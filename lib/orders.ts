import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { db } from './db';
import { getProductById, getFilesForProduct, ProductFile } from '@/config/products';
import { sendDownloadLinkEmail } from './email';
import { SITE_CONFIG } from '@/config/site';
import { stampPdf, invalidateStampedPdfCache } from '@/lib/pdf/stampPdf';
import { stampResource } from '@/lib/stampers/stampResource';

export interface ValidatedOrder {
  id: string;
  email: string;
  versionId: string;
  productName: string;
  downloadToken: string;
  tokenExpiresAt: Date;
  downloadCount: number;
  allowedFiles: ProductFile[];
}

const TOKEN_SECRET =
  process.env.ADMIN_SECRET_KEY ||
  process.env.PAYPAL_CLIENT_SECRET ||
  'stump-grinding-secret-salt-key-2025';

// 100 years = true lifetime validity
const LIFETIME_DAYS = 36500;

export function generateSignedToken(payload: {
  id: string;
  email: string;
  versionId: string;
  expiresInDays?: number;
}) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (payload.expiresInDays || LIFETIME_DAYS));
  const data = {
    id: payload.id,
    email: payload.email.trim().toLowerCase(),
    versionId: payload.versionId,
    exp: expiresAt.getTime(),
    lifetime: true,
  };
  const payloadB64 = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadB64).digest('hex');
  return { token: `${payloadB64}.${signature}`, expiresAt };
}

export async function createOrFulfillOrder({
  email,
  versionId,
  amount,
  currency = 'USD',
  provider,
  providerOrderId,
}: {
  email: string;
  versionId: string;
  amount: number;
  currency?: string;
  provider: string;
  providerOrderId?: string;
}) {
  const product = getProductById(versionId);
  if (!product) {
    throw new Error(`Invalid versionId: ${versionId}`);
  }

  // Check if already processed by providerOrderId to prevent duplicate credits
  if (providerOrderId) {
    try {
      const existing = await db.order.findFirst({
        where: { providerOrderId, status: 'completed' },
      });
      if (existing) {
        return existing;
      }
    } catch (e) {
      console.warn('DB check existing order skipped:', e);
    }
  }

  const generatedOrderId = 'ord_' + crypto.randomBytes(12).toString('hex');
  const { token: downloadToken, expiresAt: tokenExpiresAt } = generateSignedToken({
    id: generatedOrderId,
    email,
    versionId,
    expiresInDays: LIFETIME_DAYS,
  });

  let order: any = null;
  try {
    order = await db.order.create({
      data: {
        id: generatedOrderId,
        email: email.trim().toLowerCase(),
        versionId,
        amount,
        currency,
        provider,
        providerOrderId,
        status: 'completed',
        downloadToken,
        tokenExpiresAt,
        downloadCount: 0,
      },
    });
  } catch (dbErr) {
    console.warn('Could not persist order to local DB (stateless mode active):', dbErr);
    order = {
      id: generatedOrderId,
      email: email.trim().toLowerCase(),
      versionId,
      amount,
      currency,
      provider,
      providerOrderId,
      status: 'completed',
      downloadToken,
      tokenExpiresAt,
      downloadCount: 0,
    };
  }

  const downloadUrl = `${SITE_CONFIG.url}/download/${downloadToken}`;

  // Pre-stamp all entitled resources and prepare email attachments + direct download stream links
  const allowedFiles = getFilesForProduct(product.id);
  const attachments: { filename: string; content: string }[] = [];
  const directDownloadLinks: { name: string; filename: string; url: string; format: string }[] = [];

  for (const f of allowedFiles) {
    try {
      const stamped = await stampResource({
        filename: f.filename,
        email: order.email,
        orderId: order.id,
        purchaseDate: new Date(),
      });
      attachments.push({
        filename: f.filename,
        content: Buffer.from(stamped).toString('base64'),
      });
    } catch (e) {
      console.warn(`Could not stamp/attach ${f.filename}:`, e);
    }

    directDownloadLinks.push({
      name: f.name,
      filename: f.filename,
      url: `${SITE_CONFIG.url}/api/download?token=${downloadToken}&file=${encodeURIComponent(f.filename)}`,
      format: f.format,
    });
  }

  // Send official proof of payment receipt and lifetime access email with attached resources
  await sendDownloadLinkEmail({
    to: order.email,
    orderId: order.id,
    productName: product.name,
    downloadUrl,
    amount,
    currency,
    provider,
    providerOrderId,
    expiresInDays: LIFETIME_DAYS,
    attachments,
    directDownloadLinks,
  });

  return order;
}

export async function markOrderRefunded(orderId: string): Promise<boolean> {
  try {
    await db.order.update({
      where: { id: orderId },
      data: { status: 'refunded', downloadToken: `revoked_${Date.now()}` },
    });
  } catch (e) {
    console.warn(`Could not mark order ${orderId} as refunded in DB:`, e);
  }
  // Invalidate and delete cached stamped PDF file
  invalidateStampedPdfCache(orderId);
  return true;
}

export async function validateToken(token: string): Promise<
  | { success: true; order: ValidatedOrder }
  | { success: false; error: 'not_found' | 'expired' | 'revoked' }
> {
  // 1. Try stateless cryptographic signature verification first
  if (token.includes('.')) {
    const parts = token.split('.');
    if (parts.length === 2) {
      const [payloadB64, sig] = parts;
      try {
        const expectedSig = crypto
          .createHmac('sha256', TOKEN_SECRET)
          .update(payloadB64)
          .digest('hex');

        if (
          sig.length === expectedSig.length &&
          crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
        ) {
          const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8');
          const data = JSON.parse(payloadJson);

          // Check if order was marked refunded / revoked in DB
          try {
            const dbOrder = await db.order.findUnique({
              where: { id: data.id },
              select: { status: true },
            });
            if (dbOrder && (dbOrder.status === 'refunded' || dbOrder.status === 'revoked')) {
              return { success: false, error: 'revoked' };
            }
          } catch {
            // Stateless verification proceeds if DB unreachable
          }

          const product = getProductById(data.versionId);
          const allowedFiles = getFilesForProduct(data.versionId);

          // Lifetime access: do not expire valid purchaser tokens
          const lifetimeExpiry = new Date();
          lifetimeExpiry.setFullYear(lifetimeExpiry.getFullYear() + 100);

          return {
            success: true,
            order: {
              id: data.id,
              email: data.email,
              versionId: data.versionId,
              productName: product ? product.name : data.versionId,
              downloadToken: token,
              tokenExpiresAt: lifetimeExpiry,
              downloadCount: 0,
              allowedFiles,
            },
          };
        }
      } catch (err) {
        console.warn('Token cryptographic verification failed:', err);
      }
    }
  }

  // 2. Database lookup fallback
  try {
    const order = await db.order.findUnique({
      where: { downloadToken: token },
    });

    if (!order) {
      return { success: false, error: 'not_found' };
    }

    if (order.status !== 'completed') {
      return { success: false, error: 'revoked' };
    }

    const product = getProductById(order.versionId);
    const allowedFiles = getFilesForProduct(order.versionId);

    // Lifetime access: ensure token remains active permanently
    const lifetimeExpiry = new Date();
    lifetimeExpiry.setFullYear(lifetimeExpiry.getFullYear() + 100);

    return {
      success: true,
      order: {
        id: order.id,
        email: order.email,
        versionId: order.versionId,
        productName: product ? product.name : order.versionId,
        downloadToken: order.downloadToken,
        tokenExpiresAt: lifetimeExpiry,
        downloadCount: order.downloadCount,
        allowedFiles,
      },
    };
  } catch (dbErr) {
    console.warn('DB lookup failed during token validation:', dbErr);
    return { success: false, error: 'not_found' };
  }
}

export async function resendOrderLinks(rawEmail: string): Promise<{ success: boolean; count: number }> {
  const email = rawEmail.trim().toLowerCase();
  const orders = await db.order.findMany({
    where: { email, status: 'completed' },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  if (orders.length === 0) {
    return { success: false, count: 0 };
  }

  for (const order of orders) {
    // Generate fresh signed token with lifetime access
    const { token: freshToken, expiresAt: tokenExpiresAt } = generateSignedToken({
      id: order.id,
      email: order.email,
      versionId: order.versionId,
      expiresInDays: LIFETIME_DAYS,
    });

    try {
      await db.order.update({
        where: { id: order.id },
        data: {
          downloadToken: freshToken,
          tokenExpiresAt,
        },
      });
    } catch (e) {
      console.warn('Could not update order in DB:', e);
    }

    const product = getProductById(order.versionId);
    const downloadUrl = `${SITE_CONFIG.url}/download/${freshToken}`;

    const allowedFiles = product ? getFilesForProduct(product.id) : [];
    const attachments: { filename: string; content: string }[] = [];
    const directDownloadLinks: { name: string; filename: string; url: string; format: string }[] = [];

    for (const f of allowedFiles) {
      try {
        const stamped = await stampResource({
          filename: f.filename,
          email: order.email,
          orderId: order.id,
          purchaseDate: new Date(),
        });
        attachments.push({
          filename: f.filename,
          content: Buffer.from(stamped).toString('base64'),
        });
      } catch (e) {
        console.warn(`Could not stamp/attach ${f.filename}:`, e);
      }

      directDownloadLinks.push({
        name: f.name,
        filename: f.filename,
        url: `${SITE_CONFIG.url}/api/download?token=${freshToken}&file=${encodeURIComponent(f.filename)}`,
        format: f.format,
      });
    }

    await sendDownloadLinkEmail({
      to: order.email,
      orderId: order.id,
      productName: product ? product.name : order.versionId,
      downloadUrl,
      amount: order.amount,
      currency: order.currency,
      provider: order.provider,
      providerOrderId: order.providerOrderId || undefined,
      expiresInDays: LIFETIME_DAYS,
      attachments,
      directDownloadLinks,
    });
  }

  return { success: true, count: orders.length };
}

import crypto from 'crypto';
import { db } from './db';
import { getProductById, getFilesForProduct, ProductFile } from '@/config/products';
import { sendDownloadLinkEmail } from './email';
import { SITE_CONFIG } from '@/config/site';

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
    const existing = await db.order.findFirst({
      where: { providerOrderId, status: 'completed' },
    });
    if (existing) {
      return existing;
    }
  }

  const downloadToken = crypto.randomBytes(24).toString('hex');
  const tokenExpiresAt = new Date();
  tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7); // 7-day validity

  const order = await db.order.create({
    data: {
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

  const downloadUrl = `${SITE_CONFIG.url}/download/${downloadToken}`;

  // Send receipt and download email
  await sendDownloadLinkEmail({
    to: order.email,
    orderId: order.id,
    productName: product.name,
    downloadUrl,
    expiresInDays: 7,
  });

  return order;
}

export async function validateToken(token: string): Promise<
  | { success: true; order: ValidatedOrder }
  | { success: false; error: 'not_found' | 'expired' | 'revoked' }
> {
  const order = await db.order.findUnique({
    where: { downloadToken: token },
  });

  if (!order) {
    return { success: false, error: 'not_found' };
  }

  if (order.status !== 'completed') {
    return { success: false, error: 'revoked' };
  }

  if (new Date() > new Date(order.tokenExpiresAt)) {
    return { success: false, error: 'expired' };
  }

  const product = getProductById(order.versionId);
  const allowedFiles = getFilesForProduct(order.versionId);

  return {
    success: true,
    order: {
      id: order.id,
      email: order.email,
      versionId: order.versionId,
      productName: product ? product.name : order.versionId,
      downloadToken: order.downloadToken,
      tokenExpiresAt: order.tokenExpiresAt,
      downloadCount: order.downloadCount,
      allowedFiles,
    },
  };
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
    // Generate fresh token with 7 new days
    const freshToken = crypto.randomBytes(24).toString('hex');
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7);

    const updated = await db.order.update({
      where: { id: order.id },
      data: {
        downloadToken: freshToken,
        tokenExpiresAt,
      },
    });

    const product = getProductById(updated.versionId);
    const downloadUrl = `${SITE_CONFIG.url}/download/${freshToken}`;

    await sendDownloadLinkEmail({
      to: updated.email,
      orderId: updated.id,
      productName: product ? product.name : updated.versionId,
      downloadUrl,
      expiresInDays: 7,
    });
  }

  return { success: true, count: orders.length };
}

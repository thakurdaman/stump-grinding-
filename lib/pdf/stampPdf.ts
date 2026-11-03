import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export interface StampPdfOptions {
  inputPath: string;
  email: string;
  orderId: string;
  purchaseDate?: Date | string;
}

/**
 * Format a Date or date string into YYYY-MM-DD
 */
export function formatPurchaseDate(date?: Date | string): string {
  if (!date) {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }
  if (typeof date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
      return date.slice(0, 10);
    }
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

/**
 * Sanitize an email for safe WinAnsi encoding in standard PDF fonts:
 * - Trims whitespace
 * - Strips control characters
 * - Replaces non-ASCII / unsupported glyphs safely with transliterations or underscores
 */
export function sanitizeEmailForPdf(rawEmail: string): string {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return '';
  }

  // Remove control characters
  let clean = rawEmail.trim().replace(/[\x00-\x1F\x7F]/g, '');

  // Transliterate / replace non-ASCII characters to prevent Helvetica encoding crashes
  clean = clean.replace(/[^\x20-\x7E]/g, (char) => {
    // Common accented vowels fallback
    const norm = char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return /^[a-zA-Z0-9]$/.test(norm) ? norm : '_';
  });

  return clean;
}

/**
 * Truncate long emails safely if they exceed max available line width
 */
function fitTextToWidth(
  email: string,
  orderId: string,
  dateStr: string,
  font: any,
  fontSize: number,
  maxWidth: number
): { text: string; size: number } {
  let currentSize = fontSize;
  let fullText = `Licensed to ${email} | Order ${orderId} | ${dateStr}`;

  // Try shrinking font down to 6.5pt first
  while (font.widthOfTextAtSize(fullText, currentSize) > maxWidth && currentSize > 6.5) {
    currentSize -= 0.5;
  }

  // If still too wide, truncate the email local part
  if (font.widthOfTextAtSize(fullText, currentSize) > maxWidth) {
    const atIndex = email.indexOf('@');
    if (atIndex > 10) {
      const local = email.slice(0, atIndex);
      const domain = email.slice(atIndex);
      const shortLocal = `${local.slice(0, 8)}...${local.slice(-3)}`;
      fullText = `Licensed to ${shortLocal}${domain} | Order ${orderId} | ${dateStr}`;
    }
  }

  return { text: fullText, size: currentSize };
}

/**
 * Get path to stamped cache file
 */
export function getStampedCachePath(orderId: string): string {
  const baseDir = process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), 'private-files');
  const cacheDir = path.join(baseDir, 'stamped');
  return path.join(cacheDir, `${orderId}.pdf`);
}

/**
 * Invalidate / delete stamped cache file (e.g. upon refund or email change)
 */
export function invalidateStampedPdfCache(orderId: string): boolean {
  try {
    const cachePath = getStampedCachePath(orderId);
    if (fs.existsSync(cachePath)) {
      fs.unlinkSync(cachePath);
      return true;
    }
  } catch (err) {
    console.warn(`Failed to delete stamped PDF cache for ${orderId}:`, err);
  }
  return false;
}

/**
 * Server-side PDF Stamping function:
 * - Stamps buyer email, orderId, and purchase date on every page footer
 * - Adds low-opacity diagonal watermark across page centers
 * - Embeds forensic license hash in metadata
 * - Caches stamped file keyed by orderId in private-files/stamped/
 */
export async function stampPdf({
  inputPath,
  email,
  orderId,
  purchaseDate,
}: StampPdfOptions): Promise<Uint8Array> {
  // Input validation
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new Error(`Invalid or missing email for PDF stamping: "${email}"`);
  }
  if (!orderId || typeof orderId !== 'string') {
    throw new Error(`Invalid or missing orderId for PDF stamping: "${orderId}"`);
  }
  if (!inputPath || !fs.existsSync(inputPath)) {
    throw new Error(`Source PDF file not found at: "${inputPath}"`);
  }

  const cleanEmail = sanitizeEmailForPdf(email);
  if (!cleanEmail) {
    throw new Error('Email contains no valid ASCII characters for license stamping.');
  }

  const formattedDate = formatPurchaseDate(purchaseDate);

  // Check cache first (unless explicitly disabled via STAMP_CACHE=false)
  const isCacheEnabled = process.env.STAMP_CACHE !== 'false';
  const cachePath = getStampedCachePath(orderId);

  if (isCacheEnabled && fs.existsSync(cachePath)) {
    try {
      const cachedBuffer = fs.readFileSync(cachePath);
      if (cachedBuffer && cachedBuffer.length > 0) {
        return new Uint8Array(cachedBuffer);
      }
    } catch (cacheReadErr) {
      console.warn(`Error reading stamped PDF cache for ${orderId}:`, cacheReadErr);
    }
  }

  // Read original PDF (never mutate original)
  const originalBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(originalBytes);

  // Standard fonts (Helvetica is built into all PDF readers)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Cryptographic forensic tracking hash
  const salt = process.env.ADMIN_SECRET_KEY || 'stump-grinding-secret-salt-key-2025';
  const traceHash = crypto
    .createHmac('sha256', salt)
    .update(`${orderId}:${cleanEmail}:${formattedDate}`)
    .digest('hex');

  // Embed non-destructive forensic metadata
  pdfDoc.setTitle('The Stump Grinding Playbook');
  pdfDoc.setAuthor('The Stump Grinding Playbook Publishing');
  pdfDoc.setSubject(`Licensed exclusively to ${cleanEmail} | Order: ${orderId} | Trace: ${traceHash.slice(0, 16)}`);
  pdfDoc.setKeywords([
    `license:${cleanEmail}`,
    `order:${orderId}`,
    `date:${formattedDate}`,
    `trace:${traceHash}`,
  ]);
  pdfDoc.setProducer(`Stump Grinding License Engine (Order ${orderId})`);
  pdfDoc.setModificationDate(new Date());

  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const isDiagonalEnabled = process.env.STAMP_DIAGONAL !== 'false';

  // Iterate all pages and apply footer + optional diagonal watermark
  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const isCover = i === 0;

    // 1. FOOTER STAMP
    // Max width inside margins (24pt left and right margin)
    const maxFooterWidth = width - 48;
    const { text: footerText, size: footerFontSize } = fitTextToWidth(
      cleanEmail,
      orderId,
      formattedDate,
      font,
      7.5,
      maxFooterWidth
    );

    const footerTextWidth = font.widthOfTextAtSize(footerText, footerFontSize);
    const footerX = Math.max(24, (width - footerTextWidth) / 2);

    if (isCover) {
      // Cover page: dark brown background -> light cream font
      page.drawText(footerText, {
        x: footerX,
        y: 28,
        size: footerFontSize,
        font,
        color: rgb(0.96, 0.94, 0.88),
        opacity: 0.8,
      });
    } else {
      // Content pages: cream background -> muted gray-brown font
      // Y=16 sits below page number circle (which is at Y=24 to 46), well above bottom edge (Y=0)
      page.drawText(footerText, {
        x: footerX,
        y: 16,
        size: footerFontSize,
        font,
        color: rgb(0.38, 0.34, 0.3),
        opacity: 0.65,
      });
    }

    // 2. DIAGONAL WATERMARK (Subtle 6-8% opacity across page center)
    if (isDiagonalEnabled) {
      const diagText = `Licensed to ${cleanEmail}`;
      const diagFontSize = 24;
      const diagTextWidth = font.widthOfTextAtSize(diagText, diagFontSize);

      // 45 degree angle: rotated around origin (diagX, diagY)
      // Center of page is (width/2, height/2).
      // Vector of 45-deg line of length L: cos(45)*L = 0.707*L.
      // Offset so the text midpoint aligns with the page center:
      const halfDiag = (diagTextWidth * Math.SQRT1_2) / 2;
      const diagX = Math.max(30, width / 2 - halfDiag);
      const diagY = Math.max(30, height / 2 - halfDiag);

      if (isCover) {
        page.drawText(diagText, {
          x: diagX,
          y: diagY,
          size: diagFontSize,
          font,
          color: rgb(0.96, 0.94, 0.88),
          opacity: 0.07,
          rotate: degrees(45),
        });
      } else {
        page.drawText(diagText, {
          x: diagX,
          y: diagY,
          size: diagFontSize,
          font,
          color: rgb(0.42, 0.38, 0.34),
          opacity: 0.07,
          rotate: degrees(45),
        });
      }
    }
  }

  // Save the stamped PDF
  const stampedBytes = await pdfDoc.save();

  // Save to disk cache if caching is active
  if (isCacheEnabled) {
    try {
      const cacheDir = path.dirname(cachePath);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(cachePath, Buffer.from(stampedBytes));
    } catch (cacheWriteErr) {
      console.warn(`Failed to write stamped PDF to cache (${cachePath}):`, cacheWriteErr);
    }
  }

  return stampedBytes;
}

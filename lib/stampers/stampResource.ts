import fs from 'fs';
import path from 'path';
import os from 'os';
import { stampPdf } from '@/lib/pdf/stampPdf';
import { stampDocx } from './stampDocx';
import { stampXlsx } from './stampXlsx';

export interface StampResourceOptions {
  filename: string;
  email: string;
  orderId: string;
  purchaseDate?: Date | string;
}

/**
 * Stamps any resource file (PDF, XLSX, DOCX) with the buyer's verified email and order ID.
 * Caches stamped output to prevent re-processing on repeat downloads.
 */
export async function stampResource({
  filename,
  email,
  orderId,
  purchaseDate = new Date(),
}: StampResourceOptions): Promise<Uint8Array> {
  const privateDir = path.join(process.cwd(), 'private-files');
  const inputPath = path.join(privateDir, filename);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Original file not found: ${filename}`);
  }

  const ext = path.extname(filename).toLowerCase();
  const baseCacheDir = process.env.VERCEL ? os.tmpdir() : privateDir;
  // shortcut: Vercel tmpdir is per-container so cache always misses cold starts; upgrade to Vercel Blob when downloads exceed ~100/day
  const cacheDir = path.join(baseCacheDir, 'stamped', orderId);
  const cachePath = path.join(cacheDir, filename);

  // Check cache
  if (fs.existsSync(cachePath)) {
    try {
      const cached = fs.readFileSync(cachePath);
      return new Uint8Array(cached);
    } catch {
      // Proceed to stamp if cache read fails
    }
  }

  let stampedBytes: Uint8Array;

  if (ext === '.pdf') {
    stampedBytes = await stampPdf({
      inputPath,
      email,
      orderId,
      purchaseDate,
    });
  } else if (ext === '.docx') {
    stampedBytes = await stampDocx({
      inputPath,
      email,
      orderId,
      purchaseDate,
    });
  } else if (ext === '.xlsx') {
    stampedBytes = await stampXlsx({
      inputPath,
      email,
      orderId,
      purchaseDate,
    });
  } else {
    // Other files delivered as-is
    stampedBytes = new Uint8Array(fs.readFileSync(inputPath));
  }

  // Cache stamped file
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(cachePath, Buffer.from(stampedBytes));
  } catch (cacheErr) {
    console.warn(`Could not cache stamped file ${cachePath}:`, cacheErr);
  }

  return stampedBytes;
}

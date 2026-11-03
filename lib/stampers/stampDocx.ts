import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

export interface StampDocxOptions {
  inputPath: string;
  email: string;
  orderId: string;
  purchaseDate?: Date | string;
}

/**
 * Stamps a Word document (.docx) with buyer licensing info:
 * 1. Modifies the running footer on every page (word/footer1.xml)
 * 2. Modifies document metadata (docProps/core.xml)
 * 3. Returns the stamped Uint8Array buffer
 */
export async function stampDocx({
  inputPath,
  email,
  orderId,
  purchaseDate = new Date(),
}: StampDocxOptions): Promise<Uint8Array> {
  const fileBuffer = fs.readFileSync(inputPath);
  const zip = await JSZip.loadAsync(fileBuffer);

  const cleanEmail = email.trim().toLowerCase();
  const dateStr =
    purchaseDate instanceof Date
      ? purchaseDate.toISOString().split('T')[0]
      : String(purchaseDate).split('T')[0];

  const licenseNotice = `THE STUMP GRINDING PLAYBOOK | Licensed to ${cleanEmail} | Order ${orderId} | ${dateStr}`;

  // 1. Stamp footer1.xml (running footer on all pages)
  if (zip.files['word/footer1.xml']) {
    let footerXml = await zip.files['word/footer1.xml'].async('text');
    if (footerXml.includes('THE STUMP GRINDING PLAYBOOK  |  Templates &amp; Scripts Pack')) {
      footerXml = footerXml.replace(
        'THE STUMP GRINDING PLAYBOOK  |  Templates &amp; Scripts Pack',
        escapeXml(licenseNotice)
      );
    } else if (footerXml.includes('THE STUMP GRINDING PLAYBOOK')) {
      footerXml = footerXml.replace(
        /THE STUMP GRINDING PLAYBOOK[^<]*/,
        escapeXml(licenseNotice)
      );
    }
    zip.file('word/footer1.xml', footerXml);
  }

  // 2. Stamp docProps/core.xml (document metadata)
  if (zip.files['docProps/core.xml']) {
    let coreXml = await zip.files['docProps/core.xml'].async('text');
    coreXml = coreXml.replace(
      /<dc:creator>.*?<\/dc:creator>/,
      `<dc:creator>Licensed to ${escapeXml(cleanEmail)}</dc:creator>`
    );
    coreXml = coreXml.replace(
      /<cp:lastModifiedBy>.*?<\/cp:lastModifiedBy>/,
      `<cp:lastModifiedBy>Licensed to ${escapeXml(cleanEmail)} (${orderId})</cp:lastModifiedBy>`
    );
    zip.file('docProps/core.xml', coreXml);
  }

  const outputBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return new Uint8Array(outputBuffer);
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

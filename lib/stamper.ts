import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

export async function stampPdfWithBuyerEmail(
  sourceFilePath: string,
  buyerEmail: string
): Promise<Uint8Array> {
  const existingPdfBytes = fs.readFileSync(sourceFilePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const stampText = `Licensed exclusively to ${buyerEmail} • Unauthorized redistribution prohibited`;

  for (const page of pages) {
    const { width } = page.getSize();
    const textWidth = font.widthOfTextAtSize(stampText, 8);
    const x = Math.max(20, (width - textWidth) / 2);

    page.drawText(stampText, {
      x,
      y: 18,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  return await pdfDoc.save();
}

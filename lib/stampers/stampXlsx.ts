import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export interface StampXlsxOptions {
  inputPath: string;
  email: string;
  orderId: string;
  purchaseDate?: Date | string;
}

/**
 * Stamps an Excel workbook (.xlsx) with buyer licensing info:
 * 1. Writes a prominent license notice in cell A2 of the 'StartHere' sheet
 * 2. Writes buyer email and order ID into document properties (Author, Subject, Comments, Keywords)
 * 3. Returns the stamped Uint8Array buffer
 */
export async function stampXlsx({
  inputPath,
  email,
  orderId,
  purchaseDate = new Date(),
}: StampXlsxOptions): Promise<Uint8Array> {
  const fileBuffer = fs.readFileSync(inputPath);
  const cleanEmail = email.trim().toLowerCase();
  const dateStr =
    purchaseDate instanceof Date
      ? purchaseDate.toISOString().split('T')[0]
      : String(purchaseDate).split('T')[0];

  const licenseText = `Licensed to: ${cleanEmail} | Order: ${orderId} | Date: ${dateStr} | Lifetime Digital Access`;

  const wb = XLSX.read(fileBuffer, {
    cellStyles: true,
    cellNF: true,
    cellFormula: true,
    cellDates: true,
  });

  // Stamp metadata
  wb.Props = {
    ...wb.Props,
    Author: `Licensed to ${cleanEmail}`,
    Subject: `Licensed to ${cleanEmail} | Order ${orderId}`,
    Comments: `Licensed exclusively to ${cleanEmail} for lifetime business use. Order ${orderId}.`,
    Keywords: `licensed,${cleanEmail},${orderId}`,
  };

  // Stamp StartHere sheet cell A2
  const startSheet = wb.Sheets['StartHere'] || wb.Sheets[wb.SheetNames[0]];
  if (startSheet) {
    startSheet['A2'] = {
      t: 's',
      v: licenseText,
      w: licenseText,
    };
  }

  const outputBuffer = XLSX.write(wb, {
    type: 'buffer',
    bookType: 'xlsx',
  });

  return new Uint8Array(outputBuffer);
}

import { stampPdf } from './pdf/stampPdf';

/**
 * Backward compatibility wrapper for legacy callers
 */
export async function stampPdfWithBuyerEmail(
  sourceFilePath: string,
  buyerEmail: string,
  orderId: string = 'ord_legacy',
  purchaseDate?: Date | string
): Promise<Uint8Array> {
  return stampPdf({
    inputPath: sourceFilePath,
    email: buyerEmail,
    orderId,
    purchaseDate,
  });
}

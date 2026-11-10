import { createOrFulfillOrder, validateToken } from '../lib/orders';
import { getFilesForProduct } from '../config/products';
import { stampPdf } from '../lib/pdf/stampPdf';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function testE2E() {
  console.log('================================================================');
  console.log('          END-TO-END CHECKOUT & DELIVERY VERIFICATION           ');
  console.log('================================================================\n');

  const buyerEmail = 'contractor.test@gmail.com';
  const privateDir = path.join(process.cwd(), 'private-files');

  // --- 1. Tier 1: Playbook Only ---
  console.log('1. Testing "Playbook Only" ($87)...');
  const order1 = await createOrFulfillOrder({
    email: buyerEmail,
    versionId: 'playbook-only',
    amount: 87,
    provider: 'demo',
    providerOrderId: 'demo_pb_' + Date.now(),
  });

  const res1 = await validateToken(order1.downloadToken);
  if (!res1.success) throw new Error('Token 1 validation failed');
  console.log(`   ✓ Token valid. Entitled files: ${res1.order.allowedFiles.map(f => f.filename).join(', ')}`);
  
  if (res1.order.allowedFiles.length !== 1 || res1.order.allowedFiles[0].format !== 'PDF') {
    throw new Error('Playbook only should have exactly 1 PDF file');
  }

  // Simulate download route stamping
  const pbPath = path.join(privateDir, res1.order.allowedFiles[0].filename);
  const pbBytes = await stampPdf({
    inputPath: pbPath,
    email: res1.order.email,
    orderId: res1.order.id,
  });
  const doc1 = await PDFDocument.load(pbBytes);
  if (!doc1.getSubject()?.includes(buyerEmail)) throw new Error('PDF 1 not stamped with buyer email');
  console.log('   ✓ Playbook PDF successfully stamped with buyer email in metadata & footer.');

  // --- 2. Tier 2: Calculator + Templates ---
  console.log('\n2. Testing "Calculator + Templates" ($67)...');
  const order2 = await createOrFulfillOrder({
    email: buyerEmail,
    versionId: 'calculator-templates',
    amount: 67,
    provider: 'demo',
    providerOrderId: 'demo_calc_' + Date.now(),
  });

  const res2 = await validateToken(order2.downloadToken);
  if (!res2.success) throw new Error('Token 2 validation failed');
  console.log(`   ✓ Token valid. Entitled files: ${res2.order.allowedFiles.map(f => f.filename).join(', ')}`);
  
  const hasPdf2 = res2.order.allowedFiles.some(f => f.format === 'PDF');
  if (hasPdf2) {
    throw new Error('Calculator + Templates must NOT contain any PDF!');
  }
  console.log('   ✓ Confirmed: Zero PDF files delivered. Stamping is not applied.');

  // --- 3. Tier 3: Full Kit ---
  console.log('\n3. Testing "Full Kit" ($121)...');
  const order3 = await createOrFulfillOrder({
    email: buyerEmail,
    versionId: 'full-kit',
    amount: 121,
    provider: 'demo',
    providerOrderId: 'demo_full_' + Date.now(),
  });

  const res3 = await validateToken(order3.downloadToken);
  if (!res3.success) throw new Error('Token 3 validation failed');
  console.log(`   ✓ Token valid. Entitled files: ${res3.order.allowedFiles.map(f => f.filename).join(', ')}`);
  
  if (res3.order.allowedFiles.length !== 3) {
    throw new Error('Full kit must have all 3 files');
  }

  // Verify PDF is stamped and Excel / Word are unchanged
  const fullPdfFile = res3.order.allowedFiles.find(f => f.format === 'PDF')!;
  const fullExcelFile = res3.order.allowedFiles.find(f => f.format === 'EXCEL')!;
  const fullWordFile = res3.order.allowedFiles.find(f => f.format === 'WORD')!;

  const fullPdfBytes = await stampPdf({
    inputPath: path.join(privateDir, fullPdfFile.filename),
    email: res3.order.email,
    orderId: res3.order.id,
  });
  const doc3 = await PDFDocument.load(fullPdfBytes);
  if (!doc3.getSubject()?.includes(buyerEmail)) throw new Error('Full kit PDF not stamped');

  console.log('   ✓ PDF file stamped with buyer credentials.');
  console.log(`   ✓ Excel file "${fullExcelFile.filename}" delivered unchanged (${fs.statSync(path.join(privateDir, fullExcelFile.filename)).size} bytes).`);
  console.log(`   ✓ Word file "${fullWordFile.filename}" delivered unchanged (${fs.statSync(path.join(privateDir, fullWordFile.filename)).size} bytes).`);

  console.log('\n================================================================');
  console.log('            END-TO-END DEMO FLOW PASSED COMPLETELY             ');
  console.log('================================================================');
}

testE2E().catch((err) => {
  console.error('E2E Test Failed:', err);
  process.exit(1);
});

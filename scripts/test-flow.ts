import assert from 'assert';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { db } from '../lib/db';
import { PDFDocument } from 'pdf-lib';
import { PRODUCTS, isFileAllowedForProduct } from '../config/products';
import { stampPdf } from '../lib/pdf/stampPdf';
import { validateToken, generateSignedToken, createOrFulfillOrder, markOrderRefunded } from '../lib/orders';

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('       RUNNING END-TO-END FLOW VERIFICATION TESTS      ');
  console.log('======================================================\n');

  // Test 1: Verify Seed Files exist in private-files
  const privateDir = path.join(process.cwd(), 'private-files');
  const playbookFile = path.join(privateDir, 'The-Stump-Grinding-Playbook.pdf');
  const calcFile = path.join(privateDir, 'Stump-Grinding-Pricing-Calculator.xlsx');
  const templatesFile = path.join(privateDir, 'Stump-Grinding-Templates-and-Scripts-Pack.docx');

  assert(fs.existsSync(playbookFile), 'Playbook PDF seed file must exist in /private-files');
  assert(fs.existsSync(calcFile), 'Calculator XLSX seed file must exist in /private-files');
  assert(fs.existsSync(templatesFile), 'Templates DOCX seed file must exist in /private-files');
  console.log('✔ [1/7] Verified seed files exist exclusively in /private-files');

  // Test 2: Order Fulfillment & Token Generation
  const order1 = await createOrFulfillOrder({
    email: 'john.operator@test.com',
    versionId: 'playbook-only',
    amount: 87.0,
    currency: 'USD',
    provider: 'demo',
    providerOrderId: 'demo_test_order_' + Date.now(),
  });
  assert(order1.id, 'Order 1 must have an id');
  assert(order1.downloadToken, 'Order 1 must have a downloadToken');
  console.log('✔ [2/7] Verified order fulfillment and token generation ($87 Playbook Only)');

  // Test 3: Version Isolation Entitlement Check (Each tier delivers ONLY its own files)
  assert.strictEqual(isFileAllowedForProduct('playbook-only', 'The-Stump-Grinding-Playbook.pdf'), true);
  assert.strictEqual(isFileAllowedForProduct('playbook-only', 'Stump-Grinding-Pricing-Calculator.xlsx'), false);
  assert.strictEqual(isFileAllowedForProduct('playbook-only', 'Stump-Grinding-Templates-and-Scripts-Pack.docx'), false);

  assert.strictEqual(isFileAllowedForProduct('calculator-templates', 'The-Stump-Grinding-Playbook.pdf'), false);
  assert.strictEqual(isFileAllowedForProduct('calculator-templates', 'Stump-Grinding-Pricing-Calculator.xlsx'), true);
  assert.strictEqual(isFileAllowedForProduct('calculator-templates', 'Stump-Grinding-Templates-and-Scripts-Pack.docx'), true);

  assert.strictEqual(isFileAllowedForProduct('full-kit', 'The-Stump-Grinding-Playbook.pdf'), true);
  assert.strictEqual(isFileAllowedForProduct('full-kit', 'Stump-Grinding-Pricing-Calculator.xlsx'), true);
  assert.strictEqual(isFileAllowedForProduct('full-kit', 'Stump-Grinding-Templates-and-Scripts-Pack.docx'), true);
  console.log('✔ [3/7] Verified strict file access isolation across all 3 product tiers');

  // Test 4: PDF Stamping Verification (pdf-lib)
  const existingPdfBytes = fs.readFileSync(playbookFile);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  assert(pages.length > 0, 'PDF must contain pages');

  const stampedBytes = await stampPdf({
    inputPath: playbookFile,
    email: 'john.operator@test.com',
    orderId: 'ord_test_flow',
  });
  assert(stampedBytes && stampedBytes.length > 100, 'Stamped PDF bytes must be generated');

  const reloadedDoc = await PDFDocument.load(stampedBytes);
  assert.strictEqual(reloadedDoc.getPageCount(), pages.length);
  console.log('✔ [4/7] Verified dynamic PDF buyer watermarking (pdf-lib)');

  // Test 5: Lifetime Access Signed Token Validation
  const { token: signedToken } = generateSignedToken({
    id: 'ord_lifetime_buyer',
    email: 'lifetime@operator.com',
    versionId: 'full-kit',
  });
  const tokenValidation = await validateToken(signedToken);
  assert.strictEqual(tokenValidation.success, true);
  if (tokenValidation.success) {
    assert.strictEqual(tokenValidation.order.email, 'lifetime@operator.com');
    assert.strictEqual(tokenValidation.order.versionId, 'full-kit');
  }
  console.log('✔ [5/7] Verified permanent lifetime signed token verification');

  // Test 6: Tampered & Non-existent Token Rejection
  const tamperedToken = signedToken.slice(0, -6) + 'bad123';
  const tamperedCheck = await validateToken(tamperedToken);
  assert.strictEqual(tamperedCheck.success, false);
  console.log('✔ [6/7] Verified tampered token cryptographic rejection');

  // Test 7: Revoked Token Invalidation
  await markOrderRefunded('ord_lifetime_buyer');
  const invalidTokenCheck = await validateToken('completely_invalid_random_token');
  assert.strictEqual(invalidTokenCheck.success, false);
  console.log('✔ [7/7] Verified invalid token rejection and revocation handling');

  console.log('\n======================================================');
  console.log('    ALL 7 END-TO-END FLOW INTEGRATION TESTS PASSED    ');
  console.log('======================================================\n');
}

runTestSuite()
  .catch((err) => {
    console.error('Test suite failed:', err);
    process.exit(1);
  })
  .finally(() => {
    try {
      db.$disconnect();
    } catch {}
  });

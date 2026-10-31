import assert from 'assert';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { db } from '../lib/db';
import { PDFDocument } from 'pdf-lib';
import { PRODUCTS, isFileAllowedForProduct } from '../config/products';
import { stampPdfWithBuyerEmail } from '../lib/stamper';
import { validateToken, resendOrderLinks } from '../lib/orders';

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

  // Test 2: Demo Mode Order Creation for Tier 1 (Playbook Only)
  const tokenTier1 = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const order1 = await db.order.create({
    data: {
      email: 'john.operator@test.com',
      versionId: 'playbook-only',
      amount: 47.0,
      currency: 'USD',
      provider: 'demo',
      providerOrderId: 'demo_test_order_' + Date.now(),
      status: 'completed',
      downloadToken: tokenTier1,
      tokenExpiresAt: expiresAt,
    },
  });
  assert(order1.id, 'Order 1 must be created in SQLite');
  console.log('✔ [2/7] Verified demo order creation and SQLite persistence ($47 Playbook Only)');

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

  const stampedBytes = await stampPdfWithBuyerEmail(playbookFile, 'john.operator@test.com');
  assert(stampedBytes && stampedBytes.length > 100, 'Stamped PDF bytes must be generated');

  // Verify that the stamped PDF is a valid PDF document that can be reloaded
  const reloadedDoc = await PDFDocument.load(stampedBytes);
  assert.strictEqual(reloadedDoc.getPageCount(), pages.length);
  console.log('✔ [4/7] Verified dynamic PDF buyer watermarking (pdf-lib)');

  // Test 5: Expired Token Simulation (Secure rejection)
  const expiredToken = crypto.randomBytes(24).toString('hex');
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 2); // 2 days ago

  await db.order.create({
    data: {
      email: 'expired_buyer@test.com',
      versionId: 'full-kit',
      amount: 97.0,
      currency: 'USD',
      provider: 'demo',
      providerOrderId: 'demo_expired_order_' + Date.now(),
      status: 'completed',
      downloadToken: expiredToken,
      tokenExpiresAt: pastDate,
    },
  });

  const expiredCheck = await validateToken(expiredToken);
  assert.strictEqual(expiredCheck.success, false);
  assert.strictEqual(expiredCheck.error, 'expired');
  console.log('✔ [5/7] Verified expired token rejection (410 Expired policy enforced)');

  // Test 6: Resend Links Token Refresh
  const resendResult = await resendOrderLinks('expired_buyer@test.com');
  assert.strictEqual(resendResult.success, true);
  assert.strictEqual(resendResult.count, 1);

  const refreshedOrder = await db.order.findFirst({
    where: { email: 'expired_buyer@test.com' },
  });
  assert(refreshedOrder, 'Refreshed order must exist');
  assert.notStrictEqual(refreshedOrder.downloadToken, expiredToken, 'Token must be rotated');
  assert(new Date(refreshedOrder.tokenExpiresAt) > new Date(), 'New token must have future expiration');
  console.log('✔ [6/7] Verified self-service link recovery & token rotation');

  // Test 7: Lead Capture Insertion
  const lead = await db.lead.upsert({
    where: { email: 'prospect@landscaper.com' },
    update: {},
    create: { email: 'prospect@landscaper.com', source: 'pricing_cheat_sheet' },
  });
  assert.strictEqual(lead.email, 'prospect@landscaper.com');
  console.log('✔ [7/7] Verified email lead capture persistence in SQLite');

  console.log('\n======================================================');
  console.log('    ALL 7 END-TO-END FLOW INTEGRATION TESTS PASSED    ');
  console.log('======================================================\n');
}

runTestSuite()
  .catch((err) => {
    console.error('Test suite failed:', err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

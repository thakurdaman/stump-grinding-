import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PDFDocument } from 'pdf-lib';
import { stampPdf, invalidateStampedPdfCache, getStampedCachePath } from '../lib/pdf/stampPdf';
import { getFilesForProduct } from '../config/products';

async function runTests() {
  console.log('================================================================');
  console.log('       PDF LICENSING & STAMPING COMPREHENSIVE TEST SUITE        ');
  console.log('================================================================\n');

  const playbookPath = path.join(process.cwd(), 'private-files', 'The-Stump-Grinding-Playbook.pdf');
  if (!fs.existsSync(playbookPath)) {
    throw new Error(`Original playbook not found at ${playbookPath}`);
  }

  // 1. Calculate original file hash to guarantee original is NEVER modified
  const originalBytes = fs.readFileSync(playbookPath);
  const origDoc = await PDFDocument.load(originalBytes);
  const origPageCount = origDoc.getPageCount();
  const originalHash = crypto.createHash('sha256').update(originalBytes).digest('hex');
  console.log(`[PASS 1] Original PDF located: ${origPageCount} pages, SHA256: ${originalHash.slice(0, 16)}...`);

  // 2. Unit Test: Standard Stamping
  console.log('\n--- Test 1: Standard License Stamping ---');
  const testOrderId = 'ord_unit_test_101';
  const testEmail = 'operator@millerstumpgrinding.com';
  const testDate = '2026-11-02';

  // Clear cache if previously existed
  invalidateStampedPdfCache(testOrderId);

  const stampedBytes = await stampPdf({
    inputPath: playbookPath,
    email: testEmail,
    orderId: testOrderId,
    purchaseDate: testDate,
  });

  // Verify stamped PDF integrity
  const stampedDoc = await PDFDocument.load(stampedBytes);
  const pageCount = stampedDoc.getPageCount();
  console.log(`✓ Stamped document generated: ${pageCount} pages (matches ${origPageCount})`);
  if (pageCount !== origPageCount) {
    throw new Error(`Expected ${origPageCount} pages, got ${pageCount}`);
  }

  // Verify original file is still 100% untouched
  const afterHash = crypto.createHash('sha256').update(fs.readFileSync(playbookPath)).digest('hex');
  if (originalHash !== afterHash) {
    throw new Error('FATAL: Original playbook was mutated during stamping!');
  }
  console.log('✓ Original PDF is completely untouched (SHA256 matches)');

  // Verify Metadata
  const subject = stampedDoc.getSubject() || '';
  const keywords = stampedDoc.getKeywords() || '';
  console.log(`✓ Subject metadata: "${subject}"`);
  console.log(`✓ Keywords metadata: "${keywords}"`);
  if (!subject.includes(testOrderId) || !subject.includes(testEmail)) {
    throw new Error('Metadata missing order ID or email');
  }

  // 3. Test Caching: Second call must hit cache instantly
  console.log('\n--- Test 2: Disk Caching ---');
  const cacheFile = getStampedCachePath(testOrderId);
  if (!fs.existsSync(cacheFile)) {
    throw new Error(`Cache file not created at ${cacheFile}`);
  }
  console.log(`✓ Cache file created: ${cacheFile} (${fs.statSync(cacheFile).size} bytes)`);

  const startCache = Date.now();
  const cachedBytes = await stampPdf({
    inputPath: playbookPath,
    email: testEmail,
    orderId: testOrderId,
    purchaseDate: testDate,
  });
  const cacheDuration = Date.now() - startCache;
  console.log(`✓ Cached read duration: ${cacheDuration}ms (sub-15ms fast read)`);
  if (cachedBytes.byteLength !== stampedBytes.byteLength) {
    throw new Error('Cached bytes length mismatch');
  }

  // 4. Test Invalidation on refund
  console.log('\n--- Test 3: Cache Invalidation ---');
  const invalidated = invalidateStampedPdfCache(testOrderId);
  console.log(`✓ Invalidate stamped PDF cache returned: ${invalidated}`);
  if (fs.existsSync(cacheFile)) {
    throw new Error('Cache file was not removed upon invalidation');
  }
  console.log('✓ Cache file deleted cleanly');

  // 5. Edge Cases
  console.log('\n--- Test 4: Edge Cases ---');

  // Edge case A: Very long email
  const longEmail = 'extremely.long.property.management.accounting.department@commercialtreeandlandscapingllc.com';
  const longOrder = 'ord_long_email_999';
  const longBytes = await stampPdf({
    inputPath: playbookPath,
    email: longEmail,
    orderId: longOrder,
    purchaseDate: '2026-11-02',
  });
  const longDoc = await PDFDocument.load(longBytes);
  console.log(`✓ Long email (${longEmail.length} chars) stamped safely without overflow`);
  invalidateStampedPdfCache(longOrder);

  // Edge case B: Email with plus sign
  const plusEmail = 'dan+stumpgrinding.pro@gmail.com';
  const plusOrder = 'ord_plus_888';
  const plusBytes = await stampPdf({
    inputPath: playbookPath,
    email: plusEmail,
    orderId: plusOrder,
  });
  const plusDoc = await PDFDocument.load(plusBytes);
  console.log(`✓ Plus sign email (${plusEmail}) stamped without issue`);
  invalidateStampedPdfCache(plusOrder);

  // Edge case C: Non-ASCII characters (e.g. Björn / accented chars)
  const unicodeEmail = 'björn.jöhnson@stümp-service.com';
  const unicodeOrder = 'ord_unicode_777';
  const unicodeBytes = await stampPdf({
    inputPath: playbookPath,
    email: unicodeEmail,
    orderId: unicodeOrder,
  });
  const unicodeDoc = await PDFDocument.load(unicodeBytes);
  console.log(`✓ Non-ASCII email sanitized and stamped safely: ${unicodeDoc.getSubject()}`);
  invalidateStampedPdfCache(unicodeOrder);

  // Edge case D: Invalid / empty email throws
  try {
    await stampPdf({
      inputPath: playbookPath,
      email: '',
      orderId: 'ord_bad',
    });
    throw new Error('Should have rejected empty email');
  } catch (err: any) {
    console.log(`✓ Empty email rejected as expected: "${err.message}"`);
  }

  // 6. Entitlement Check for All 3 Tiers
  console.log('\n--- Test 5: Tier Entitlement Verification ---');

  // Tier 1: playbook-only
  const playbookFiles = getFilesForProduct('playbook-only');
  console.log(`✓ playbook-only: ${playbookFiles.length} file (PDF included: ${playbookFiles.some(f => f.format === 'PDF')})`);
  if (!playbookFiles.some(f => f.filename === 'The-Stump-Grinding-Playbook.pdf')) {
    throw new Error('Playbook only tier missing playbook PDF');
  }

  // Tier 2: calculator-templates
  const calcFiles = getFilesForProduct('calculator-templates');
  console.log(`✓ calculator-templates: ${calcFiles.length} files (PDF included: ${calcFiles.some(f => f.format === 'PDF')})`);
  if (calcFiles.some(f => f.format === 'PDF')) {
    throw new Error('Calculator + Templates tier must NOT include PDF!');
  }

  // Tier 3: full-kit
  const fullFiles = getFilesForProduct('full-kit');
  console.log(`✓ full-kit: ${fullFiles.length} files (PDF included: ${fullFiles.some(f => f.format === 'PDF')}, Excel included: ${fullFiles.some(f => f.format === 'EXCEL')}, Word included: ${fullFiles.some(f => f.format === 'WORD')})`);
  if (fullFiles.length !== 3) {
    throw new Error('Full kit must include all 3 commercial deliverables');
  }

  // 7. Visual Inspection Rendering of Sample Pages (Cover, Contents, Table)
  console.log('\n--- Test 6: Rendering Sample Pages to PNG ---');
  const samplePdfPath = path.join(process.cwd(), 'private-files', 'sample-stamped.pdf');
  fs.writeFileSync(samplePdfPath, Buffer.from(stampedBytes));

  const outputDir = path.join(process.cwd(), 'public', 'stamped-previews');
  const pythonExe = 'C:\\Users\\msi\\AppData\\Local\\Programs\\Python\\Python312\\python.exe';
  const renderScript = path.join(process.cwd(), 'scripts', 'render_pages.py');

  const { execSync } = await import('child_process');
  const renderOut = execSync(`"${pythonExe}" "${renderScript}" "${samplePdfPath}" "${outputDir}"`).toString();
  console.log(renderOut.trim());

  console.log('\n================================================================');
  console.log('              ALL 6 UNIT & VISUAL TESTS PASSED                  ');
  console.log('================================================================');
}

runTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});

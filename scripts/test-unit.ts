import assert from 'assert';
import { generateSignedToken, validateToken } from '../lib/orders';
import {
  checkGibberishLocalPart,
  checkVerificationCode,
  sendVerificationCode,
} from '../lib/email-verifier';
import { sanitizeEmailForPdf, formatPurchaseDate } from '../lib/pdf/stampPdf';
import { isFileAllowedForProduct, getProductById } from '../config/products';

async function runTests() {
  console.log('🧪 Starting core unit tests...\n');

  // Test 1: Signed Token Generation & Validation
  console.log('1. Testing cryptographic signed tokens...');
  const testEmail = 'contractor@example.com';
  const testOrderId = 'ord_test_unit_123';
  const testVersion = 'full-kit';

  const { token, expiresAt } = generateSignedToken({
    id: testOrderId,
    email: testEmail,
    versionId: testVersion,
    expiresInDays: 365,
  });

  assert(token.includes('.'), 'Token must contain HMAC delimiter');
  assert(expiresAt > new Date(), 'Expiry must be in future');

  const validResult = await validateToken(token);
  assert(validResult.success === true, 'Token validation failed for valid token');
  if (validResult.success) {
    assert.strictEqual(validResult.order.email, testEmail, 'Email mismatch in token');
    assert.strictEqual(validResult.order.versionId, testVersion, 'Version mismatch');
    assert(validResult.order.allowedFiles.length >= 3, 'Full kit must include all files');
  }

  // Tamper detection
  const tamperedToken = token.slice(0, -4) + 'abcd';
  const tamperedResult = await validateToken(tamperedToken);
  assert(tamperedResult.success === false, 'Tampered token was accepted!');
  console.log('   ✓ Token generation, validation, and tamper resistance passed.');

  // Test 2: Product tier file entitlements
  console.log('2. Testing file entitlements per tier...');
  assert.strictEqual(
    isFileAllowedForProduct('playbook-only', 'The-Stump-Grinding-Playbook.pdf'),
    true,
    'Playbook PDF should be allowed for playbook-only'
  );
  assert.strictEqual(
    isFileAllowedForProduct('playbook-only', 'Stump-Grinding-Pricing-Calculator.xlsx'),
    false,
    'Calculator should NOT be allowed for playbook-only'
  );
  assert.strictEqual(
    isFileAllowedForProduct('full-kit', 'Stump-Grinding-Pricing-Calculator.xlsx'),
    true,
    'Calculator should be allowed for full-kit'
  );
  assert.strictEqual(
    isFileAllowedForProduct('full-kit', 'Stump-Grinding-Templates-and-Scripts-Pack.docx'),
    true,
    'Word templates should be allowed for full-kit'
  );
  console.log('   ✓ Tier access control passed.');

  // Test 3: Email syntax, gibberish, and typo detection
  console.log('3. Testing email verification rules...');
  assert.strictEqual(
    checkGibberishLocalPart('jlkdoihakdh').isGibberish,
    true,
    'Gibberish keyboard mash should be flagged'
  );
  assert.strictEqual(
    checkGibberishLocalPart('asdfghjkl').isGibberish,
    true,
    'Home row keyboard mash should be flagged'
  );
  assert.strictEqual(
    checkGibberishLocalPart('john.smith').isGibberish,
    false,
    'Real name should not be flagged as gibberish'
  );
  console.log('   ✓ Email gibberish filter passed.');

  // Test 4: Stateless OTP code generation & verification
  console.log('4. Testing stateless OTP HMAC verification...');
  const otpRes = await sendVerificationCode('delivered@resend.dev');
  assert(otpRes.success === true, 'Failed to generate OTP');
  assert(otpRes.sessionToken, 'Must return signed sessionToken');

  // Verify with correct code in demo mode or extracted code
  if (otpRes.demoCode) {
    const checkValid = checkVerificationCode(
      'delivered@resend.dev',
      otpRes.demoCode,
      otpRes.sessionToken
    );
    assert(checkValid.success === true, 'Valid OTP check failed');
  }

  // Verify wrong code fails
  const checkWrong = checkVerificationCode(
    'delivered@resend.dev',
    '999999',
    otpRes.sessionToken
  );
  assert(checkWrong.success === false, 'Incorrect OTP was accepted!');
  console.log('   ✓ Stateless OTP generation and HMAC verification passed.');

  // Test 5: PDF Sanitization and Date Formatting
  console.log('5. Testing PDF watermark formatting & sanitization...');
  assert.strictEqual(
    sanitizeEmailForPdf('user\x00\x1F@domain.com'),
    'user@domain.com',
    'Control characters must be stripped'
  );
  assert.strictEqual(
    formatPurchaseDate(new Date('2026-11-06T12:00:00Z')),
    '2026-11-06',
    'Date formatting mismatch'
  );
  console.log('   ✓ Watermark formatting passed.');

  console.log('\n✅ All unit assertions passed successfully!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});

import dns from 'dns';

export interface EmailVerificationResult {
  valid: boolean;
  deliverable: boolean;
  reason: string;
  domain?: string;
  suggestion?: string | null;
  mxHost?: string | null;
  isDisposable?: boolean;
}

// Common disposable/temporary email provider domains
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'yopmail.com',
  'trashmail.com',
  'throwawaymail.com',
  'dispostable.com',
  'fakeinbox.com',
  'mytemp.email',
  'getairmail.com',
]);

// Known typo dictionary for quick client suggestions
const TYPO_MAP: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaho.co': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'hotmali.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'iclould.com': 'icloud.com',
  'icld.com': 'icloud.com',
  'prton.me': 'proton.me',
  'prtonmail.com': 'protonmail.com',
};

/**
 * Live verification of email deliverability:
 * 1. Syntax & RFC compliance
 * 2. Disposable / burner domain detection
 * 3. Typo detection with recommended correction
 * 4. Live DNS MX (Mail Exchange) record resolution to verify server accepts emails
 */
export async function verifyEmail(rawEmail: string): Promise<EmailVerificationResult> {
  const email = (rawEmail || '').trim().toLowerCase();

  if (!email) {
    return {
      valid: false,
      deliverable: false,
      reason: 'Email address cannot be empty.',
    };
  }

  // Basic RFC 5322 regex validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      deliverable: false,
      reason: 'Please enter a valid email format (e.g. name@domain.com).',
    };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return {
      valid: false,
      deliverable: false,
      reason: 'Email must contain exactly one "@" character.',
    };
  }

  const [localPart, domain] = parts;

  if (localPart.length > 64) {
    return {
      valid: false,
      deliverable: false,
      reason: 'Email local part exceeds standard 64 characters.',
      domain,
    };
  }

  if (email.length > 254) {
    return {
      valid: false,
      deliverable: false,
      reason: 'Email exceeds maximum allowable length of 254 characters.',
      domain,
    };
  }

  // Check for common typo suggestions
  if (TYPO_MAP[domain]) {
    const suggestedDomain = TYPO_MAP[domain];
    const suggestion = `${localPart}@${suggestedDomain}`;
    return {
      valid: false,
      deliverable: false,
      reason: `Did you mean ${suggestion}?`,
      domain,
      suggestion,
    };
  }

  // Check for disposable email addresses
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      deliverable: false,
      reason: 'Temporary or disposable email addresses are not supported for lifetime product access.',
      domain,
      isDisposable: true,
    };
  }

  // Live DNS MX (Mail Exchange) record resolution
  try {
    const mxRecords = await dns.promises.resolveMx(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return {
        valid: false,
        deliverable: false,
        reason: `The domain "${domain}" has no configured mail servers and cannot receive emails.`,
        domain,
      };
    }

    // Sort by priority (lowest number = highest priority)
    const sorted = mxRecords.sort((a, b) => a.priority - b.priority);
    const primaryMx = sorted[0].exchange;

    return {
      valid: true,
      deliverable: true,
      reason: `Mailbox domain verified active via ${primaryMx}`,
      domain,
      mxHost: primaryMx,
    };
  } catch (dnsErr: any) {
    const code = dnsErr.code || dnsErr.message;
    if (code === 'ENOTFOUND') {
      return {
        valid: false,
        deliverable: false,
        reason: `The domain "${domain}" does not exist. Please check your spelling.`,
        domain,
      };
    }
    if (code === 'ENODATA') {
      return {
        valid: false,
        deliverable: false,
        reason: `Domain "${domain}" exists but has no active mail servers to accept emails.`,
        domain,
      };
    }

    // If DNS resolution is restricted or times out, fallback to format validity
    console.warn(`DNS lookup warning for ${domain}:`, dnsErr.message);
    return {
      valid: true,
      deliverable: true,
      reason: 'Email format verified.',
      domain,
    };
  }
}

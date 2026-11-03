import { SITE_CONFIG } from '@/config/site';

export interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded string
}

export interface DirectDownloadLink {
  name: string;
  filename: string;
  url: string;
  format: string;
}

export interface SendDownloadEmailOptions {
  to: string;
  orderId: string;
  productName: string;
  downloadUrl?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  providerOrderId?: string;
  expiresInDays?: number;
  attachments?: EmailAttachment[];
  directDownloadLinks?: DirectDownloadLink[];
}

export async function sendDownloadLinkEmail({
  to,
  orderId,
  productName,
  downloadUrl,
  amount = 47,
  currency = 'USD',
  provider = 'PayPal',
  providerOrderId,
  attachments = [],
  directDownloadLinks = [],
}: SendDownloadEmailOptions): Promise<{ success: boolean; error?: string }> {
  const receiptNum = `REC-${orderId.slice(-8).toUpperCase()}`;
  const transactionId = providerOrderId || `TXN-${orderId.slice(-12).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedPrice = `$${Number(amount).toFixed(2)} ${currency.toUpperCase()}`;

  const subject = `Official Payment Receipt & Lifetime Access: ${productName} (#${receiptNum})`;

  const linksText = directDownloadLinks.length > 0
    ? directDownloadLinks.map(l => `- ${l.name} (${l.format}):\n  ${l.url}`).join('\n\n')
    : downloadUrl ? `Access link: ${downloadUrl}` : '';

  const textBody = `
===================================================================
OFFICIAL PROOF OF PAYMENT & LIFETIME ACCESS CONFIRMATION
${SITE_CONFIG.name}
===================================================================

Thank you for your purchase! Your payment has been received and confirmed.
Keep this email as official proof of payment for your accounting records.

RECEIPT DETAILS:
-------------------------------------------------------------------
Receipt Number:   ${receiptNum}
Transaction ID:   ${transactionId}
Payment Method:   ${provider.toUpperCase()}
Date of Purchase: ${currentDate}
Customer Email:   ${to}
Payment Status:   PAID IN FULL / COMPLETED

PURCHASED ITEM:
-------------------------------------------------------------------
Item:             ${productName}
Quantity:         1
Total Amount:     ${formattedPrice}

YOUR WATERMARKED & LICENSED FILES:
-------------------------------------------------------------------
All files have been individually licensed and trademarked exclusively to:
${to} (Order ${orderId})

YOUR LIFETIME ACCESS DOWNLOAD LINKS:
-------------------------------------------------------------------
You can download your resources anytime, anywhere, directly from these links:

${linksText}

* LIFETIME ACCESS GUARANTEE:
These files have NO expiration date. Your access remains active for lifetime
usage. You can download and access these resources today, next month, or
2+ years from now without ever having to repurchase.

GETTING STARTED:
1. First: Read The Stump Grinding Playbook (PDF)
2. Second: Open The Pricing & Business Calculator (Excel)
3. Third: Adapt the Templates & Customer Scripts Pack (Word)

Need assistance or have questions?
Reply directly to ${SITE_CONFIG.supportEmail} or visit our website.

— ${SITE_CONFIG.name}
  `.trim();

  const linksHtml = directDownloadLinks.length > 0
    ? `
      <div style="background-color: #ffffff; border: 1px solid #EADCCF; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #684128; border-bottom: 1px solid #EADCCF; padding-bottom: 8px;">
          Your Licensed Resources (Direct Download):
        </h3>
        <p style="font-size: 12px; color: #7A6252; margin: 0 0 14px 0;">
          Each file is individually stamped with your verified email (<strong style="color: #33241B;">${to}</strong>) and order ID (<strong style="color: #33241B;">${orderId}</strong>) for lifetime digital ownership.
        </p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${directDownloadLinks.map(l => `
            <div style="padding: 12px; background-color: #FBF6EC; border: 1px solid #E5D5C5; border-radius: 6px; margin-bottom: 8px;">
              <div style="font-weight: bold; font-size: 14px; color: #33241B; margin-bottom: 4px;">
                ${l.name}
              </div>
              <a href="${l.url}" style="background-color: #E8731A; color: #ffffff; text-decoration: none; padding: 8px 18px; font-size: 12px; font-weight: bold; border-radius: 4px; display: inline-block; margin-top: 6px;">
                Download ${l.format} &rarr;
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `
    : `
      <!-- Action Button -->
      <div style="text-align: center; margin: 28px 0;">
        <a href="${downloadUrl}" style="background-color: #E8731A; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 15px; font-weight: bold; border-radius: 6px; display: inline-block; box-shadow: 0 3px 8px rgba(232, 115, 26, 0.3);">
          Download Your Files (Lifetime Access) &rarr;
        </a>
      </div>
    `;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Proof of Payment & Lifetime Access</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #FBF6EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #33241B;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #E5D5C5; overflow: hidden; box-shadow: 0 4px 12px rgba(51, 36, 27, 0.08);">
    
    <!-- Header Banner -->
    <div style="background-color: #33241B; padding: 24px; text-align: center; border-bottom: 3px solid #E8731A;">
      <h1 style="color: #FBF6EC; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">
        ${SITE_CONFIG.name}
      </h1>
      <p style="color: #E8731A; margin: 6px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
        Official Proof of Payment &bull; Paid in Full
      </p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px;">
      
      <!-- Confirmation Intro -->
      <p style="font-size: 15px; line-height: 1.5; margin: 0 0 20px 0;">
        Hello,
      </p>
      <p style="font-size: 15px; line-height: 1.5; margin: 0 0 20px 0;">
        Thank you for your purchase of <strong>${productName}</strong>. Your payment via <strong>${provider.toUpperCase()}</strong> has been successfully processed and verified.
      </p>

      <!-- Proof of Payment Receipt Card -->
      <div style="background-color: #F9F5EE; border: 1px solid #EADCCF; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 14px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #684128; border-bottom: 1px solid #EADCCF; padding-bottom: 8px;">
          Payment Receipt Summary
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.8;">
          <tr>
            <td style="color: #7A6252;">Receipt Number:</td>
            <td style="text-align: right; font-weight: bold; color: #33241B;">${receiptNum}</td>
          </tr>
          <tr>
            <td style="color: #7A6252;">Transaction / Order ID:</td>
            <td style="text-align: right; font-family: monospace; color: #33241B;">${transactionId}</td>
          </tr>
          <tr>
            <td style="color: #7A6252;">Payment Method:</td>
            <td style="text-align: right; font-weight: 600; color: #2E5E3E;">${provider.toUpperCase()} (Verified)</td>
          </tr>
          <tr>
            <td style="color: #7A6252;">Date:</td>
            <td style="text-align: right; color: #33241B;">${currentDate}</td>
          </tr>
          <tr>
            <td style="color: #7A6252;">Billed To:</td>
            <td style="text-align: right; color: #33241B;">${to}</td>
          </tr>
          <tr style="border-top: 1px dashed #D9C2B0; padding-top: 8px;">
            <td style="padding-top: 8px; font-weight: bold; color: #33241B; font-size: 14px;">Total Amount Paid:</td>
            <td style="padding-top: 8px; text-align: right; font-weight: bold; color: #E8731A; font-size: 16px;">${formattedPrice}</td>
          </tr>
        </table>
      </div>

      <!-- Lifetime Access Banner -->
      <div style="background-color: #EAF2EC; border-left: 4px solid #2E5E3E; padding: 14px 18px; border-radius: 4px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #20442D; font-weight: 600;">
          &#10003; Lifetime Access Guarantee:
        </p>
        <p style="margin: 4px 0 0 0; font-size: 12px; line-height: 1.5; color: #2E5E3E;">
          Your resources are delivered directly to your email with NO expiration date. You can open, download, and re-download them today, next year, or 2+ years from now anytime, anywhere.
        </p>
      </div>

      <!-- Download Links Section -->
      ${linksHtml}

      <!-- Recommended Starting Order -->
      <div style="font-size: 13px; line-height: 1.6; color: #684128; border-top: 1px solid #EFE4CE; padding-top: 18px; margin-top: 24px;">
        <strong>Recommended Starting Order:</strong>
        <ol style="margin: 8px 0 0 0; padding-left: 20px;">
          <li><strong>The Stump Grinding Playbook (PDF)</strong> &mdash; master the pricing formulas &amp; contracts</li>
          <li><strong>The Pricing Calculator (Excel)</strong> &mdash; set your local machine rates and tooth wear funds</li>
          <li><strong>Templates &amp; Customer Scripts (Word)</strong> &mdash; plug in your business name and quote jobs</li>
        </ol>
      </div>

      <p style="font-size: 11px; color: #8C786A; margin-top: 24px; line-height: 1.5;">
        * Note: Please retain this email for your tax and bookkeeping records as proof of business trade education and tooling expense.
      </p>

    </div>

    <!-- Footer -->
    <div style="background-color: #F5EFE6; padding: 16px 24px; text-align: center; border-top: 1px solid #EADCCF; font-size: 12px; color: #7A6252;">
      Questions or need support? Reply to <a href="mailto:${SITE_CONFIG.supportEmail}" style="color: #E8731A; text-decoration: none;">${SITE_CONFIG.supportEmail}</a>
      <br/>
      &copy; ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.
    </div>

  </div>
</body>
</html>
  `.trim();

  // If Resend API key is configured, send live email
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'The Stump Grinding Playbook <onboarding@resend.dev>';
      const resendPayload: any = {
        from: fromEmail,
        to: [to],
        subject,
        text: textBody,
        html: htmlBody,
      };

      if (attachments && attachments.length > 0) {
        resendPayload.attachments = attachments.map((a) => ({
          filename: a.filename,
          content: a.content,
        }));
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify(resendPayload),
      });

      if (!res.ok) {
        const errJson = await res.json();
        console.error('Failed to send Resend email:', errJson);
        return { success: false, error: JSON.stringify(errJson) };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Resend email fetch exception:', err);
      return { success: false, error: err.message };
    }
  }

  // Fallback logging for local testing
  console.log('\n=================== [OFFICIAL PROOF OF PAYMENT EMAIL] ===================');
  console.log(`TO: ${to}`);
  console.log(`RECEIPT: ${receiptNum}`);
  console.log(`AMOUNT: ${formattedPrice}`);
  console.log(`DOWNLOAD: ${downloadUrl}`);
  console.log('=========================================================================\n');

  return { success: true };
}

export async function sendVerificationCodeEmail({
  to,
  code,
}: {
  to: string;
  code: string;
}): Promise<{ success: boolean; error?: string }> {
  const subject = `Your 6-Digit Email Verification Code: ${code} - ${SITE_CONFIG.name}`;
  const textBody = `
===================================================================
EMAIL VERIFICATION CODE: ${code}
${SITE_CONFIG.name}
===================================================================

Hi,

To guarantee your lifetime access and official payment receipt arrive safely in your inbox, please verify your email address.

Your 6-digit verification code is: ${code}

Enter this code on the website checkout to confirm your mailbox and proceed to secure payment. This code expires in 10 minutes.

If you did not request this verification code, you can safely ignore this email.

— ${SITE_CONFIG.name}
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Email Verification Code</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #FBF6EC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #33241B;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #E5D5C5; overflow: hidden; box-shadow: 0 4px 12px rgba(51, 36, 27, 0.08);">
    
    <div style="background-color: #33241B; padding: 20px; text-align: center; border-bottom: 3px solid #E8731A;">
      <h1 style="color: #FBF6EC; margin: 0; font-size: 18px; font-weight: bold;">
        ${SITE_CONFIG.name}
      </h1>
      <p style="color: #E8731A; margin: 4px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase;">
        Live Mailbox Verification
      </p>
    </div>

    <div style="padding: 28px 24px; text-align: center;">
      <p style="font-size: 14px; color: #684128; margin: 0 0 16px 0;">
        Enter this 6-digit code to verify your delivery mailbox and confirm lifetime access delivery:
      </p>

      <div style="display: inline-block; padding: 14px 28px; background-color: #FBF6EC; border: 2px dashed #E8731A; border-radius: 8px; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #33241B; margin: 8px 0 20px 0;">
        ${code}
      </div>

      <p style="font-size: 12px; color: #8A5A3B; margin: 0;">
        This code expires in 10 minutes. If you did not enter your email on our site, please ignore this message.
      </p>
    </div>

    <div style="background-color: #FBF6EC; padding: 14px; text-align: center; font-size: 11px; color: #8A5A3B; border-top: 1px solid #E5D5C5;">
      &copy; ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.
    </div>

  </div>
</body>
</html>
  `.trim();

  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'The Stump Grinding Playbook <onboarding@resend.dev>';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          text: textBody,
          html: htmlBody,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        console.error('Failed to send Resend verification email:', errJson);
        return { success: false, error: JSON.stringify(errJson) };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Resend verification email exception:', err);
      return { success: false, error: err.message };
    }
  }

  console.log('\n=================== [EMAIL VERIFICATION CODE] ===================');
  console.log(`TO: ${to}`);
  console.log(`CODE: ${code}`);
  console.log('=================================================================\n');

  return { success: true };
}

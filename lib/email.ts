import { SITE_CONFIG } from '@/config/site';

export interface SendDownloadEmailOptions {
  to: string;
  orderId: string;
  productName: string;
  downloadUrl: string;
  amount?: number;
  currency?: string;
  provider?: string;
  providerOrderId?: string;
  expiresInDays?: number;
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

YOUR LIFETIME ACCESS DOWNLOAD LINK:
-------------------------------------------------------------------
Access your files anytime:
${downloadUrl}

* LIFETIME ACCESS GUARANTEE:
These files have NO 7-day expiration. Your link remains active for lifetime
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
          Your download link does NOT expire after 7 days. You have lifetime access to these files. You can download and re-download them today, next year, or 2+ years from now anytime.
        </p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 28px 0;">
        <a href="${downloadUrl}" style="background-color: #E8731A; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 15px; font-weight: bold; border-radius: 6px; display: inline-block; box-shadow: 0 3px 8px rgba(232, 115, 26, 0.3);">
          Download Your Files (Lifetime Access) &rarr;
        </a>
      </div>

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

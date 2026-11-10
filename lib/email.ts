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
  amount = 121,
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
      <div style="margin: 24px 0;">
        <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #5A3E2B; margin-bottom: 12px;">
          Your Licensed Resources (Direct Download):
        </div>
        ${directDownloadLinks.map(l => `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 12px; background-color: #FFFFFF; border: 1px solid #E2D9CC; border-radius: 8px;">
            <tr>
              <td style="padding: 16px;">
                <div style="margin-bottom: 6px;">
                  <span style="display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 700; color: #2E5E3E; background-color: #EAF2EC; border-radius: 4px; font-family: -apple-system, BlinkMacSystemFont, monospace;">
                    ${l.format}
                  </span>
                </div>
                <div style="font-size: 15px; font-weight: 700; color: #1C130D; margin-bottom: 4px; line-height: 1.3;">
                  ${l.name}
                </div>
                <div style="font-size: 12px; color: #7A6252; margin-bottom: 12px; line-height: 1.4;">
                  Individually watermarked &amp; stamped for <strong style="color: #1C130D;">${to}</strong>
                </div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="${l.url}" class="mobile-btn" style="display: block; width: 100%; box-sizing: border-box; background-color: #E8731A; color: #FFFFFF; text-decoration: none; padding: 13px 20px; font-size: 14px; font-weight: 700; border-radius: 6px; text-align: center; box-shadow: 0 2px 4px rgba(232, 115, 26, 0.25);">
                        Download ${l.format} &darr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `).join('')}
      </div>
    `
    : `
      <!-- Action Button -->
      <div style="text-align: center; margin: 28px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <a href="${downloadUrl}" class="mobile-btn" style="display: block; width: 100%; max-width: 380px; box-sizing: border-box; background-color: #E8731A; color: #FFFFFF; text-decoration: none; padding: 15px 28px; font-size: 15px; font-weight: 700; border-radius: 6px; text-align: center; box-shadow: 0 3px 8px rgba(232, 115, 26, 0.3);">
                Download Your Files (Lifetime Access) &rarr;
              </a>
            </td>
          </tr>
        </table>
      </div>
    `;

  const htmlBody = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Proof of Payment & Lifetime Access</title>
  <style type="text/css">
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    table { border-collapse: collapse !important; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F6F2EB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C130D; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding: 20px 16px !important; }
      .mobile-header-padding { padding: 20px 16px !important; }
      .mobile-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px 8px; background-color: #F6F2EB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C130D;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center">
        
        <!-- Main Email Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 580px; width: 100%; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E2D9CC; overflow: hidden; box-shadow: 0 4px 16px rgba(28, 19, 13, 0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td class="mobile-header-padding" style="background-color: #1C130D; padding: 26px 20px; text-align: center; border-bottom: 3px solid #E8731A;">
              <div style="font-size: 18px; font-weight: 800; color: #FBF6EC; letter-spacing: 0.5px; line-height: 1.3;">
                ${SITE_CONFIG.name}
              </div>
              <div style="display: inline-block; margin-top: 8px; padding: 4px 12px; background-color: rgba(232, 115, 26, 0.2); border: 1px solid rgba(232, 115, 26, 0.5); border-radius: 20px; font-size: 11px; font-weight: 700; color: #FF9B4E; text-transform: uppercase; letter-spacing: 0.8px;">
                Official Proof of Payment &bull; Paid in Full
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td class="mobile-padding" style="padding: 26px 22px;">
              
              <!-- Greeting & Summary -->
              <div style="font-size: 15px; line-height: 1.5; margin-bottom: 16px; color: #1C130D;">
                Hello,
              </div>
              <div style="font-size: 15px; line-height: 1.5; margin-bottom: 22px; color: #3A2B20;">
                Thank you for your purchase of <strong style="color: #1C130D;">${productName}</strong>. Your payment via <strong style="color: #1C130D;">${provider.toUpperCase()}</strong> has been processed successfully.
              </div>

              <!-- Payment Receipt Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; background-color: #FAF6EF; border: 1px solid #E2D9CC; border-radius: 8px; margin-bottom: 22px; overflow: hidden;">
                <tr>
                  <td style="padding: 14px 16px; border-bottom: 1px solid #E2D9CC; background-color: #F4EDE1;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; color: #5A3E2B;">
                            Payment Receipt Summary
                          </span>
                        </td>
                        <td align="right">
                          <span style="display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 700; color: #1E4620; background-color: #D7F0DB; border-radius: 4px;">
                            &check; Confirmed
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    
                    <!-- Line 1: Receipt Number -->
                    <div style="border-bottom: 1px solid #EBE4D8; padding-bottom: 10px; margin-bottom: 10px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8A7263; margin-bottom: 3px;">
                        Receipt Number
                      </div>
                      <div style="font-size: 14px; font-weight: 700; color: #1C130D;">
                        ${receiptNum}
                      </div>
                    </div>

                    <!-- Line 2: Order / Transaction ID -->
                    <div style="border-bottom: 1px solid #EBE4D8; padding-bottom: 10px; margin-bottom: 10px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8A7263; margin-bottom: 3px;">
                        Transaction / Order ID
                      </div>
                      <div style="font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, monospace; font-weight: 600; color: #1C130D; word-break: break-all; overflow-wrap: anywhere;">
                        ${transactionId}
                      </div>
                    </div>

                    <!-- Line 3: Payment Method & Date -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #EBE4D8; padding-bottom: 10px; margin-bottom: 10px;">
                      <tr>
                        <td style="width: 50%; vertical-align: top; padding-bottom: 10px;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8A7263; margin-bottom: 3px;">
                            Payment Method
                          </div>
                          <div style="font-size: 13px; font-weight: 700; color: #2E5E3E;">
                            ${provider.toUpperCase()} (Verified)
                          </div>
                        </td>
                        <td style="width: 50%; vertical-align: top; padding-bottom: 10px;">
                          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8A7263; margin-bottom: 3px;">
                            Date of Purchase
                          </div>
                          <div style="font-size: 13px; font-weight: 600; color: #1C130D;">
                            ${currentDate}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Line 4: Billed To -->
                    <div style="border-bottom: 1px solid #EBE4D8; padding-bottom: 10px; margin-bottom: 12px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #8A7263; margin-bottom: 3px;">
                        Billed To
                      </div>
                      <div style="font-size: 13px; font-weight: 600; color: #1C130D; word-break: break-all; overflow-wrap: anywhere;">
                        ${to}
                      </div>
                    </div>

                    <!-- Line 5: Total Amount Paid -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #EFE6D7; border-radius: 6px; padding: 12px 14px;">
                      <tr>
                        <td style="font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #1C130D;">
                          Total Amount Paid:
                        </td>
                        <td align="right" style="font-size: 18px; font-weight: 900; color: #E8731A;">
                          ${formattedPrice}
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- Lifetime Access Banner -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; background-color: #EAF2EC; border-left: 4px solid #2E5E3E; border-radius: 6px; margin-bottom: 22px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <div style="font-size: 13px; line-height: 1.4; color: #1E4620; font-weight: 700; margin-bottom: 4px;">
                      &#10003; Lifetime Access Active &mdash; No Expiration
                    </div>
                    <div style="font-size: 12px; line-height: 1.5; color: #2E5E3E;">
                      Your resources have NO expiration date. You can open, download, and re-download them anytime on any phone, tablet, or computer.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Download Links Section -->
              ${linksHtml}

              <!-- Recommended Starting Order -->
              <div style="font-size: 13px; line-height: 1.6; color: #5A3E2B; border-top: 1px solid #E2D9CC; padding-top: 18px; margin-top: 24px;">
                <strong style="color: #1C130D;">Recommended Starting Order:</strong>
                <ol style="margin: 8px 0 0 0; padding-left: 20px; color: #3A2B20;">
                  <li style="margin-bottom: 4px;"><strong>The Stump Grinding Playbook (PDF)</strong> &mdash; master pricing formulas &amp; utility contracts</li>
                  <li style="margin-bottom: 4px;"><strong>The Pricing Calculator (Excel)</strong> &mdash; calibrate local machine rates &amp; tooth wear</li>
                  <li style="margin-bottom: 4px;"><strong>Templates &amp; Customer Scripts (Word)</strong> &mdash; insert business name &amp; quote jobs</li>
                </ol>
              </div>

              <div style="font-size: 11px; color: #8A7263; margin-top: 20px; line-height: 1.5;">
                * Note: Please keep this email for your tax and accounting records as official proof of business education and software tooling expense.
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F4EDE1; padding: 18px 20px; text-align: center; border-top: 1px solid #E2D9CC; font-size: 12px; color: #7A6252; line-height: 1.5;">
              Questions or need support? Reply directly to <a href="mailto:${SITE_CONFIG.supportEmail}" style="color: #E8731A; text-decoration: none; font-weight: 700;">${SITE_CONFIG.supportEmail}</a>
              <div style="margin-top: 4px; font-size: 11px; color: #8A7263;">
                &copy; ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // If Resend API key is configured, send live email
  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'The First 10 Stumps System <orders@stumpgrindingplaybook.com>';
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
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Email Verification Code</title>
  <style type="text/css">
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F6F2EB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C130D; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; }
      .mobile-padding { padding: 22px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 20px 8px; background-color: #F6F2EB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C130D;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 480px; width: 100%; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E2D9CC; overflow: hidden; box-shadow: 0 4px 16px rgba(28, 19, 13, 0.06);">
          <tr>
            <td style="background-color: #1C130D; padding: 22px 20px; text-align: center; border-bottom: 3px solid #E8731A;">
              <div style="font-size: 18px; font-weight: 800; color: #FBF6EC; line-height: 1.3;">
                ${SITE_CONFIG.name}
              </div>
              <div style="display: inline-block; margin-top: 6px; padding: 3px 10px; background-color: rgba(232, 115, 26, 0.2); border: 1px solid rgba(232, 115, 26, 0.5); border-radius: 20px; font-size: 11px; font-weight: 700; color: #FF9B4E; text-transform: uppercase; letter-spacing: 0.8px;">
                Live Mailbox Verification
              </div>
            </td>
          </tr>
          <tr>
            <td class="mobile-padding" style="padding: 26px 20px; text-align: center;">
              <div style="font-size: 15px; color: #3A2B20; line-height: 1.5; margin-bottom: 16px;">
                Enter this 6-digit confirmation code on checkout to verify your delivery email:
              </div>
              <div style="display: inline-block; padding: 12px 22px; background-color: #FAF6EF; border: 2px dashed #E8731A; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, monospace; font-size: 30px; font-weight: 800; letter-spacing: 6px; color: #1C130D; margin-bottom: 18px;">
                ${code}
              </div>
              <div style="font-size: 12px; color: #8A7263; line-height: 1.5;">
                This code expires in 10 minutes. If you did not enter your email on our website, you can safely ignore this message.
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F4EDE1; padding: 14px; text-align: center; font-size: 11px; color: #8A7263; border-top: 1px solid #E2D9CC;">
              &copy; ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  if (process.env.RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'The First 10 Stumps System <orders@stumpgrindingplaybook.com>';
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

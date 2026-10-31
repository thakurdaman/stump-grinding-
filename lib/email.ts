import { SITE_CONFIG } from '@/config/site';

interface SendDownloadEmailOptions {
  to: string;
  orderId: string;
  productName: string;
  downloadUrl: string;
  expiresInDays: number;
}

export async function sendDownloadLinkEmail({
  to,
  orderId,
  productName,
  downloadUrl,
  expiresInDays,
}: SendDownloadEmailOptions): Promise<{ success: boolean; error?: string }> {
  const subject = `Your files: ${productName} (${SITE_CONFIG.name})`;
  const textBody = `
Thank you for your purchase of ${productName}!

Here is your secure link to access and download your files:
${downloadUrl}

Notes for getting started:
1. This link is valid for ${expiresInDays} days. Please download and save your files locally.
2. Recommended reading order:
   - First: The Stump Grinding Playbook (PDF)
   - Second: The Pricing & Business Calculator (Excel)
   - Third: The Templates & Scripts Pack (Word)

If you have any questions or need assistance, reply directly to ${SITE_CONFIG.supportEmail}.

— ${SITE_CONFIG.name}
  `.trim();

  const htmlBody = `
<div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; color: #33241B; line-height: 1.5;">
  <div style="border-bottom: 2px solid #E8731A; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="color: #33241B; margin: 0;">${SITE_CONFIG.name}</h2>
  </div>
  <p>Thank you for purchasing <strong>${productName}</strong> (Order #${orderId.slice(-8)}).</p>
  <p>Your files are ready. Click the button below to access your secure download area:</p>
  <div style="margin: 28px 0;">
    <a href="${downloadUrl}" style="background-color: #E8731A; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 4px; display: inline-block;">
      Download Your Files &rarr;
    </a>
  </div>
  <p style="font-size: 14px; color: #684128;">
    <strong>Start here order:</strong><br/>
    1. Read <em>The Stump Grinding Playbook</em> (PDF)<br/>
    2. Open <em>The Pricing & Business Calculator</em> (Excel)<br/>
    3. Customize the <em>Templates & Scripts</em> for your local company
  </p>
  <p style="font-size: 13px; color: #888; margin-top: 24px;">
    This download link is active for ${expiresInDays} days. If you ever need fresh links in the future, visit our website and use the self-service "Resend Links" tool.
  </p>
  <hr style="border: none; border-top: 1px solid #EFE4CE; margin: 24px 0;" />
  <p style="font-size: 12px; color: #888;">
    Questions? Email us at <a href="mailto:${SITE_CONFIG.supportEmail}">${SITE_CONFIG.supportEmail}</a>
  </p>
</div>
  `.trim();

  // If Resend API key is configured, use it
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `${SITE_CONFIG.name} <orders@${new URL(SITE_CONFIG.url).hostname}>`,
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

  // Development / Demo Fallback: log to console
  console.log('\n=================== [TRANSACTIONAL EMAIL DISPATCH] ===================');
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`LINK: ${downloadUrl}`);
  console.log('======================================================================\n');
  return { success: true };
}

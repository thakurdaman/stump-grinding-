import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { validateToken, createOrFulfillOrder } from '@/lib/orders';
import { db } from '@/lib/db';
import { SITE_CONFIG } from '@/config/site';
import { PayPalProvider } from '@/lib/payments/paypal';
import { CheckCircle2, Mail, ShieldCheck, ArrowRight, RefreshCw, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SuccessPageProps {
  searchParams: {
    session_id?: string;
    token?: string;
    email?: string;
    version_id?: string;
  };
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  let orderData = null;

  // Attempt resolution by token (downloadToken or PayPal providerOrderId)
  if (searchParams.token) {
    const res = await validateToken(searchParams.token);
    if (res.success) {
      orderData = res.order;
    } else {
      let order = null;
      try {
        order = await db.order.findFirst({
          where: { providerOrderId: searchParams.token },
        });
      } catch (dbErr) {
        console.warn('DB lookup failed on success token:', dbErr);
      }

      // If PayPal redirect returned order token and order is not yet registered
      if (!order && process.env.PAYMENT_PROVIDER === 'paypal') {
        try {
          const paypal = new PayPalProvider();
          const capture = await paypal.captureOrder(searchParams.token);
          const customIdStr =
            capture?.purchase_units?.[0]?.custom_id ||
            capture?.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id;
          const custom = customIdStr ? JSON.parse(customIdStr) : {};
          const payerEmail = custom.email || capture?.payer?.email_address;
          const versionId = custom.version_id;
          const amount = parseFloat(
            capture?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value ||
              capture?.purchase_units?.[0]?.amount?.value ||
              '0'
          );
          const currency =
            capture?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code ||
            capture?.purchase_units?.[0]?.amount?.currency_code ||
            'USD';

          if (payerEmail && versionId) {
            order = await createOrFulfillOrder({
              email: payerEmail,
              versionId,
              amount,
              currency,
              provider: 'paypal',
              providerOrderId: searchParams.token,
            });
          }
        } catch (captureErr) {
          console.warn('PayPal auto-capture error on success redirect:', captureErr);
        }
      }

      if (order) {
        const tokenRes = await validateToken(order.downloadToken);
        if (tokenRes.success) {
          orderData = tokenRes.order;
        }
      }
    }
  }

  // Attempt resolution by provider session_id or demo order
  if (!orderData && searchParams.session_id) {
    try {
      const order = await db.order.findFirst({
        where: { providerOrderId: searchParams.session_id },
      });
      if (order) {
        const res = await validateToken(order.downloadToken);
        if (res.success) {
          orderData = res.order;
        }
      }
    } catch (sessionErr) {
      console.warn('DB lookup failed on session_id:', sessionErr);
    }
  }

  const deliveryEmail = orderData?.email || searchParams.email || 'your verified email address';

  return (
    <>
      <Header />

      <main className="flex-1 py-16 bg-[#FBF6EC]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Confirmation Card */}
          <div className="bg-white border-2 border-bark/15 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-forest/15 text-forest flex items-center justify-center mx-auto shadow-inner">
              <Mail size={40} className="text-forest animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-mono font-bold uppercase tracking-wider">
                <CheckCircle2 size={14} />
                <span>Payment Confirmed &bull; Sent to Email Only</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
                Check Your Verified Email
              </h1>
              <p className="text-sm sm:text-base text-bark/85 leading-relaxed">
                Your purchase has been completed. All materials and resources have been personalized with your digital license and sent directly to:
              </p>
              <div className="inline-block px-4 py-2 rounded-xl bg-sand/40 border border-bark/15 font-mono text-sm sm:text-base font-bold text-bark">
                {deliveryEmail}
              </div>
            </div>

            {/* Privacy & Anti-Piracy Notice */}
            <div className="bg-[#FAF4EB] border border-bark/15 rounded-2xl p-5 text-left space-y-2 text-xs sm:text-sm text-bark/80">
              <div className="flex items-center gap-2 font-bold text-bark">
                <Lock size={16} className="text-forest shrink-0" />
                <span>Private Email-Only Delivery</span>
              </div>
              <p className="leading-relaxed">
                To protect your personalized license watermark and prevent unauthorized public exposure, <strong>no download files or order keys are hosted on this website</strong>.
              </p>
              <p className="leading-relaxed text-forest font-medium">
                &bull; You have permanent, lifetime access to your resources directly inside your email inbox anytime, anywhere, on any phone, tablet, or computer.
              </p>
            </div>

            {/* Next Steps */}
            <div className="text-left space-y-3 pt-2 border-t border-bark/10">
              <span className="text-xs font-bold uppercase tracking-wider text-bark/60">
                What to do right now:
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm text-bark/85">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange/20 text-orange font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Open your email inbox at <strong>{deliveryEmail}</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange/20 text-orange font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Look for the email with subject: <br />
                    <code className="text-xs font-mono bg-bark/5 px-2 py-0.5 rounded text-bark font-semibold">
                      Official Payment Receipt &amp; Lifetime Access: {orderData?.productName || 'The Stump Grinding Playbook'}
                    </code>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange/20 text-orange font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Check your <strong>Spam or Promotions</strong> folder if you do not see it in your primary inbox within 60 seconds.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-forest/20 text-forest font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <span>
                    Download your personalized files and keep that email saved as your permanent lifetime digital key.
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`mailto:${deliveryEmail}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange hover:bg-orange-hover text-white text-sm font-bold shadow transition-all"
              >
                <Mail size={16} />
                Open Email Inbox
              </a>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-bark/5 hover:bg-bark/10 text-bark text-sm font-bold border border-bark/15 transition-colors"
              >
                Back to Homepage
              </Link>
            </div>
          </div>

          {/* Support Guarantee */}
          <div className="text-center text-xs text-wood-dark space-y-1">
            <p>
              Did not receive the email or need help? Our support desk responds quickly at{' '}
              <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-orange underline font-semibold">
                {SITE_CONFIG.supportEmail}
              </a>
            </p>
            <p className="text-bark/60">
              Need to resend your lifetime materials to this verified address?{' '}
              <Link href="/resend-links" className="text-forest underline font-semibold">
                Use the Instant Resend Tool &rarr;
              </Link>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

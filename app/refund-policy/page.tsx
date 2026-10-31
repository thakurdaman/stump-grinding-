import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/config/site';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[#FBF6EC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-wood hover:text-bark transition-colors"
          >
            <ArrowLeft size={14} /> Back to Homepage
          </Link>

          <div className="bg-white border border-bark/15 rounded-2xl p-8 sm:p-12 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-forest/15 text-forest">
                <ShieldCheck size={28} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest font-sans">
                  Risk-Free Guarantee
                </span>
                <h1 className="font-serif font-bold text-3xl text-bark">
                  14-Day Refund Policy
                </h1>
              </div>
            </div>

            <div className="prose prose-sm text-bark/85 leading-relaxed space-y-4 pt-2">
              <p>
                We stand behind the quality and practical field usefulness of <strong>The Stump Grinding Playbook</strong>, the Pricing Calculator, and the Templates Pack.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark pt-2">
                1. 14-Day Money-Back Guarantee
              </h3>
              <p>
                If you purchase any tier of The Stump Grinding Playbook and decide within 14 calendar days of purchase that the material does not meet your operational needs, you are entitled to a full 100% refund of your purchase price.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark pt-2">
                2. How to Request a Refund
              </h3>
              <p>
                Requesting a refund is straightforward. Simply send an email to:
              </p>
              <div className="p-4 bg-sand/30 rounded-lg border border-bark/10">
                <p className="font-mono text-sm font-semibold text-bark">
                  {SITE_CONFIG.supportEmail}
                </p>
                <p className="text-xs text-wood-dark mt-1">
                  Subject line: <code>Refund Request - [Your Order Email or Order ID]</code>
                </p>
              </div>
              <p>
                You do not need to fill out complex forms or jump through hurdles. We appreciate honest feedback on why the material wasn’t a fit so we can improve future updates, but it is not required.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark pt-2">
                3. Refund Processing
              </h3>
              <p>
                Once received, your refund will be processed through the original payment processor (Lemon Squeezy, Stripe, or PayPal) within 24 to 48 business hours. Funds typically reflect back on your original card or bank account within 3 to 7 business days, depending on your financial institution.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark pt-2">
                4. File Access After Refund
              </h3>
              <p>
                Upon processing a refund, the corresponding digital download tokens will be revoked.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

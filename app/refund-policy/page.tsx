import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/config/site';
import { ShieldCheck, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '14-Day Refund Policy',
  description: '14-day money-back guarantee terms and final sale disclosures for The Stump Grinding Playbook under US consumer law.',
  alternates: {
    canonical: '/refund-policy',
  },
};

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
            <div className="border-b border-bark/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-forest/15 text-forest">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest font-sans">
                    Consumer Protection &amp; Guarantees
                  </span>
                  <h1 className="font-serif font-bold text-3xl sm:text-4xl text-bark">
                    14-Day Refund Policy
                  </h1>
                </div>
              </div>
              <p className="text-xs text-wood-dark mt-3">
                <strong>Effective Date:</strong> November 14, 2026 &bull; <strong>Currency:</strong> United States Dollars (USD)
              </p>
            </div>

            <div className="prose prose-sm text-bark/85 leading-relaxed space-y-5 pt-2">
              <p>
                We stand behind the practical field value of <strong>{SITE_CONFIG.name}</strong>. In accordance with United States federal consumer protection standards (FTC Act) and state retail refund disclosure laws (including California Civil Code &sect; 1723 and New York General Business Law &sect; 218-a), this policy sets forth our exact refund terms, eligibility requirements, and claim procedures prior to purchase.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">
                1. 14-Day Money-Back Guarantee (Full Kit Only)
              </h3>
              <p>
                We provide a full, unconditional fourteen (14) calendar-day money-back guarantee exclusively on the <strong>Complete Beginner System (Full Kit, $121 USD)</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The 14-day evaluation window begins immediately upon payment confirmation and delivery of your download link.</li>
                <li>If within 14 calendar days you conclude the materials, spreadsheet, or contract templates do not fit your business operations, you are entitled to a 100% refund of the purchase price.</li>
                <li>No complicated questionnaires, return shipping, or administrative hurdles are required.</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">
                2. Standalone Tiers Final Sale &amp; Non-Refundable
              </h3>
              <p>
                Due to the immediate digital delivery and non-returnable nature of downloadable intellectual property, individual standalone tiers—specifically the <strong>Playbook Only ($87 USD)</strong> and the <strong>Calculator + Templates ($67 USD)</strong>—are <strong>FINAL SALE</strong> upon delivery and are not eligible for refunds or exchanges.
              </p>
              <p className="text-xs text-wood-dark italic">
                This final-sale disclosure is conspicuously displayed on our pricing cards, in our checkout modal, and within these terms prior to payment completion.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">
                3. How to Submit a Refund Claim
              </h3>
              <p>
                To request a refund for an eligible Full Kit purchase within the 14-day window, simply send an email to our support team:
              </p>
              <div className="p-4 bg-sand/30 rounded-xl border border-bark/10 space-y-2 not-prose">
                <div className="flex items-center gap-2 font-mono text-sm font-semibold text-bark">
                  <Mail size={16} className="text-orange" />
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-orange underline">
                    {SITE_CONFIG.supportEmail}
                  </a>
                </div>
                <p className="text-xs text-wood-dark">
                  Subject Line: <code>Refund Request - [Your Order Email or Order ID]</code>
                </p>
              </div>
              <p>
                Please include your original order confirmation email, transaction ID, or email address used at checkout so our system can locate your account immediately.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">
                4. Processing Timelines &amp; Banking Credits
              </h3>
              <p>
                Once received and verified:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your refund is approved and initiated through our payment processor (Stripe, PayPal, Lemon Squeezy, or Razorpay) within <strong>twenty-four (24) to forty-eight (48) business hours</strong>.</li>
                <li>Refunds are credited back strictly to the original payment method.</li>
                <li>Depending on your banking institution, credit card issuer, or PayPal account, funds typically post to your account within <strong>three (3) to seven (7) business days</strong>.</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">
                5. License Revocation &amp; Intellectual Property Post-Refund
              </h3>
              <p>
                Upon issuance of a refund, all digital licenses granted under our Terms of Service are extinguished immediately. Your unique download tokens and online access will be deactivated in our system. You are required to delete and permanently destroy all downloaded copies of the PDF Playbook, Excel calculators, and Word template documents in your possession.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">
                6. Chargebacks &amp; Payment Dispute Protocol
              </h3>
              <div className="p-4 bg-orange/10 border-l-4 border-orange rounded-r-xl space-y-2 text-xs text-bark">
                <div className="flex items-center gap-2 font-bold text-orange">
                  <AlertCircle size={16} />
                  <span>Important Notice on Credit Card Chargebacks</span>
                </div>
                <p>
                  We are committed to resolving customer inquiries fairly, swiftly, and directly. If you experience an issue or wish to request an eligible refund, please contact us at <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="underline font-semibold">{SITE_CONFIG.supportEmail}</a> before filing a dispute or chargeback with your credit card company or PayPal.
                </p>
                <p>
                  Filing an unjustified chargeback without prior communication constitutes a breach of our commercial terms. In response to unauthorized chargebacks, we submit cryptographic download records, IP verification logs, and buyer-stamped document records to financial institutions to prove successful digital delivery.
                </p>
              </div>

              <h3 className="font-serif font-bold text-xl text-bark">
                7. Contact Us
              </h3>
              <p>
                For questions regarding our 14-Day Refund Policy or to check the status of a pending refund, contact our fulfillment desk at{' '}
                <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-orange underline font-semibold">
                  {SITE_CONFIG.supportEmail}
                </a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

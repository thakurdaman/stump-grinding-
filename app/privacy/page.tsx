import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/config/site';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-wood-dark font-sans">
                Privacy &amp; Data
              </span>
              <h1 className="font-serif font-bold text-3xl text-bark mt-1">
                Privacy Policy
              </h1>
            </div>

            {/* Lawyer Review Notice */}
            <div className="p-4 bg-orange/10 border-l-4 border-orange rounded-r-lg text-xs text-bark space-y-1">
              <div className="flex items-center gap-2 font-bold text-orange">
                <AlertTriangle size={16} />
                <span>Notice to Store Operator</span>
              </div>
              <p>
                This document is a clear, plain-language starting draft. You should have it reviewed and tailored by a licensed attorney before public production launch.
              </p>
            </div>

            <div className="prose prose-sm text-bark/85 leading-relaxed space-y-4 pt-2">
              <h3 className="font-serif font-bold text-xl text-bark">1. Information We Collect</h3>
              <p>
                We collect personal information necessary to deliver your digital purchases and communicate with you:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Email address (for order confirmation, download links, and receipts)</li>
                <li>Customer name (optional, if entered at checkout)</li>
                <li>Transaction identifiers provided by payment processors (Lemon Squeezy, Stripe, or PayPal)</li>
                <li>Technical logs: download timestamps and masked IP addresses for link abuse prevention</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">2. Payment Security</h3>
              <p>
                We do not store or process payment card details or bank account information on our servers. All financial transactions are securely handled by our PCI-compliant payment gateways.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">3. How We Use Your Information</h3>
              <p>
                Your information is used exclusively to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Deliver your purchased files and generate secure download tokens</li>
                <li>Send transactional receipts and link recovery emails</li>
                <li>Provide customer support upon request</li>
                <li>Send free cheat sheets or periodic product update notices (with one-click unsubscribe links)</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">4. Third-Party Sharing</h3>
              <p>
                We do not sell, rent, or trade your personal data to third parties or marketing brokers.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">5. Contact Regarding Privacy</h3>
              <p>
                To request data deletion or ask questions about our data practices, email{' '}
                <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-orange underline">
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

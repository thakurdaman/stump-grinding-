import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/config/site';
import { ArrowLeft, ShieldCheck, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy and customer data handling for The Stump Grinding Playbook under US federal and state laws.',
  alternates: {
    canonical: '/privacy',
  },
};

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
            <div className="border-b border-bark/10 pb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-forest font-sans">
                Privacy &amp; Data Governance
              </span>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-bark mt-1">
                Privacy Policy
              </h1>
              <p className="text-xs text-wood-dark mt-2">
                <strong>Effective Date:</strong> November 14, 2026 &bull; <strong>Last Updated:</strong> November 14, 2026
              </p>
            </div>

            <div className="prose prose-sm text-bark/85 leading-relaxed space-y-5 pt-2">
              <p>
                {SITE_CONFIG.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates this website and digital storefront. We respect your privacy and are committed to protecting your personal information in compliance with United States federal and state privacy statutes, including the California Consumer Privacy Act (CCPA/CPRA), the California Online Privacy Protection Act (CalOPPA), the Children&apos;s Online Privacy Protection Act (COPPA), and the CAN-SPAM Act.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">1. Categories of Personal Information We Collect</h3>
              <p>
                We collect personal information necessary to deliver your digital purchases, personalize your document licensing watermarks, and communicate with you:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Identifiers:</strong> Email address, customer name, and order identification numbers.</li>
                <li><strong>Commercial &amp; Transaction Information:</strong> Records of product tiers purchased (Playbook Only, Calculator + Templates, Full Kit), payment confirmation timestamps, purchase amounts, and currency (USD).</li>
                <li><strong>Internet &amp; Network Activity:</strong> Technical access logs, including download timestamps, user-agent data, and masked IP addresses strictly for link abuse and anti-piracy licensing verification.</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">2. Payment Card Security</h3>
              <p>
                We do not collect, process, or store credit card numbers, debit card numbers, or bank account credentials on our servers. All financial transactions are securely tokenized and processed through our PCI-DSS Level 1 compliant merchant payment processors (Stripe, PayPal, Lemon Squeezy, or Razorpay).
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">3. How We Use Your Information</h3>
              <p>
                We use collected information solely for legitimate business purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Generating cryptographically signed lifetime download tokens and delivering your materials;</li>
                <li>Imprinting individual buyer licensing watermarks on delivered PDF, Excel, and Word files to protect against unauthorized digital piracy;</li>
                <li>Transmitting official proof-of-payment receipts and self-service link recovery notifications;</li>
                <li>Responding to customer service inquiries and technical support requests;</li>
                <li>Delivering requested educational cheat sheets or periodic product update notices (always with a one-click unsubscribe mechanism).</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">4. Third-Party Disclosures &amp; No Sale of Data</h3>
              <p>
                <strong>We do not sell, rent, or trade your personal information to third parties or marketing brokers.</strong> We do not disclose personal information for cross-context behavioral advertising. We share personal data only with trusted service providers who assist us in operating our storefront (payment processing, transactional email delivery via Resend, and cloud hosting), bound by strict contractual confidentiality obligations.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">5. Cookies &amp; Do Not Track (DNT) Signals</h3>
              <p>
                We use essential first-party session cookies and local storage necessary for checkout modal operation and download link authorization. We do not use third-party tracking pixels to profile your web activity across unrelated sites. Under the California Online Privacy Protection Act (CalOPPA), we disclose that because there is currently no universal industry standard for recognizing browser &ldquo;Do Not Track&rdquo; (DNT) signals, our website does not alter its data collection practices in response to DNT browser settings.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">6. Children&apos;s Online Privacy (COPPA Compliance)</h3>
              <p>
                Our website, products, and services are directed exclusively to business operators and individuals at least 18 years of age. In compliance with the Children&apos;s Online Privacy Protection Act (COPPA), we do not knowingly collect or solicit personal information from children under 13 years of age. If we learn we have inadvertently collected personal data from a child under 13, we will promptly delete that information from our records.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">7. State Consumer Privacy Rights (California CCPA/CPRA, VA, CO, CT)</h3>
              <p>
                If you are a resident of California or another US state with comprehensive privacy legislation, you have specific statutory rights regarding your personal information:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Right to Know &amp; Access:</strong> You may request the categories and specific pieces of personal information we have collected about you.</li>
                <li><strong>Right to Deletion:</strong> You may request deletion of your personal data, subject to legal recordkeeping and tax accounting exceptions.</li>
                <li><strong>Right to Correction:</strong> You may request correction of inaccurate personal information in our records.</li>
                <li><strong>Right to Non-Discrimination:</strong> We will never deny services, charge different prices, or provide a different level of quality for exercising your privacy rights.</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">8. CAN-SPAM Act Compliance</h3>
              <p>
                In compliance with the federal CAN-SPAM Act, all transactional emails (order receipts, download recovery) clearly identify the sender, include accurate subject lines, and reference the underlying commercial transaction. Any non-transactional educational communications provide a clear, conspicuous one-click unsubscribe link that is honored immediately.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">9. Contact Information &amp; Data Requests</h3>
              <p>
                To submit a privacy request, update your records, or inquire about our data practices, please contact our privacy compliance team:
              </p>
              <div className="p-4 bg-sand/30 rounded-xl border border-bark/10 space-y-2 not-prose">
                <div className="flex items-center gap-2 text-sm text-bark font-bold">
                  <Mail size={16} className="text-orange" />
                  <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-orange underline">
                    {SITE_CONFIG.supportEmail}
                  </a>
                </div>
                <div className="flex items-start gap-2 text-xs text-wood-dark">
                  <MapPin size={16} className="text-forest shrink-0 mt-0.5" />
                  <span>
                    The Stump Grinding Playbook &bull; Attn: Privacy &amp; Legal Compliance &bull; United States
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

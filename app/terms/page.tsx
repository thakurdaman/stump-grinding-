import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/config/site';
import { ArrowLeft, Scale, ShieldAlert, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service, licensing, liability limitation, and legal disclaimers for The Stump Grinding Playbook under US law.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Service',
    url: `${SITE_CONFIG.url}/terms`,
    description: 'Terms of service, licensing, liability limitation, and legal disclaimers for The Stump Grinding Playbook under US law.',
    isPartOf: {
      '@type': 'WebSite',
      url: SITE_CONFIG.url,
      name: SITE_CONFIG.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
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
                Legal Terms &amp; Conditions
              </span>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-bark mt-1">
                Terms of Service
              </h1>
              <p className="text-xs text-wood-dark mt-2">
                <strong>Effective Date:</strong> November 14, 2026 &bull; <strong>Last Updated:</strong> November 14, 2026
              </p>
            </div>

            <div className="prose prose-sm text-bark/85 leading-relaxed space-y-5 pt-2">
              <p>
                Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before accessing our website or purchasing digital products from {SITE_CONFIG.name} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing our website, submitting an order, or downloading any of our materials, you agree to be bound by these Terms and our Privacy Policy and Refund Policy. If you do not agree to all terms, do not access our website or purchase our materials.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">1. Eligibility &amp; Commercial Intent</h3>
              <p>
                You must be at least eighteen (18) years of age and possess the legal capacity to form a binding contract under United States law to purchase our products. Our materials are developed for commercial trade operators, contractors, and business owners operating in tree care, landscaping, and excavation services.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">2. Educational Disclaimer &amp; No Professional Counsel</h3>
              <p>
                All materials, guides, formulas, spreadsheets, checklists, and document templates provided by {SITE_CONFIG.name} are for informational and trade-educational purposes only. They do not constitute formal legal, accounting, tax, occupational safety (OSHA), or structural engineering advice. You remain solely responsible for consulting licensed professionals regarding state licensing, business insurance policies, and municipal permits.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">3. Heavy Equipment Operation &amp; 811 Utility Locates</h3>
              <p>
                Stump grinding involves mechanical excavation with high-speed cutter wheels operating in soil containing hidden subterranean hazards. <strong>You assume 100% operational, physical, and financial responsibility for your equipment, worksite safety, and job execution.</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You must contact your state&apos;s <strong>811 Dig Safe / Call Before You Dig</strong> utility locate service and wait for positive confirmation before any cutter wheel enters the ground.</li>
                <li>We bear zero liability for subterranean utility strikes (gas lines, electric mains, fiber optics, water or sewer pipes), sprinkler system damage, foundation cracking, flying debris/rock damage, or operator bodily injury.</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">4. Digital Product License &amp; Anti-Piracy Protection</h3>
              <p>
                Upon payment confirmation, we grant you a personal, revocable, non-exclusive, non-transferable license to use the purchased digital materials for your internal business operations.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Anti-Piracy Watermarking:</strong> Each delivered document contains personalized buyer identification, order numbers, and invisible cryptographic markers.</li>
                <li><strong>Restrictions:</strong> You may not sell, resell, sublicense, rent, lease, distribute, broadcast, upload to public torrent/file-sharing sites, or incorporate our materials into another commercial curriculum or product.</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">5. Financial &amp; Earnings Disclaimer</h3>
              <p>
                Worked pricing formulas, hourly rate recommendations, and margin models on this site or in our spreadsheets are illustrative examples. We make no representations or guarantees regarding customer volume, bid acceptance, gross revenue, or business profitability. Your financial results depend upon local market competition, labor efficiency, machine maintenance, overhead expenses, and individual sales execution.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">6. Pricing, Payments &amp; Refund Governance</h3>
              <p>
                All prices are stated in United States Dollars (USD). Refunds are governed strictly by our <strong>14-Day Refund Policy</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The <strong>Full Kit ($121)</strong> is backed by our 14-calendar-day money-back guarantee.</li>
                <li>Standalone tiers—<strong>Playbook Only ($87)</strong> and <strong>Calculator + Templates ($67)</strong>—are final sale upon digital delivery due to the immediate, non-returnable nature of digital intellectual property.</li>
                <li>Initiating an unjustified credit card chargeback without prior support contact constitutes a material breach of these Terms and will result in immediate revocation of all licensing and download tokens.</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">7. Conspicuous Disclaimer of Warranties</h3>
              <div className="p-4 bg-sand/30 border border-bark/15 rounded-xl font-mono text-xs uppercase tracking-wide text-bark/90 leading-relaxed">
                THE WEBSITE, DIGITAL MANUALS, PRICING CALCULATORS, TEMPLATES, AND SCRIPTS ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE UNITED STATES LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE MATERIALS WILL BE ERROR-FREE, ACCURATE, OR APPLICABLE TO EVERY GEOGRAPHIC JURISDICTION OR SOIL CONDITION.
              </div>

              <h3 className="font-serif font-bold text-xl text-bark">8. Conspicuous Limitation of Liability</h3>
              <div className="p-4 bg-sand/30 border border-bark/15 rounded-xl font-mono text-xs uppercase tracking-wide text-bark/90 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL {SITE_CONFIG.name.toUpperCase()}, ITS AUTHORS, AFFILIATES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING LOST PROFITS, REVENUE, DATA, MACHINERY REPAIR, UTILITY DAMAGE, OR BUSINESS INTERRUPTION) ARISING OUT OF OR IN CONNECTION WITH THE USE OF OUR PRODUCTS OR WEBSITE. IN NO EVENT SHALL OUR TOTAL AGGREGATE LIABILITY EXCEED THE TOTAL PURCHASE PRICE ACTUALLY PAID BY YOU FOR THE PRODUCT GIVING RISE TO THE CLAIM.
              </div>

              <h3 className="font-serif font-bold text-xl text-bark">9. Indemnification</h3>
              <p>
                You agree to defend, indemnify, and hold harmless {SITE_CONFIG.name}, its authors, officers, and contractors from and against any and all claims, damages, liabilities, losses, costs, or expenses (including reasonable attorney fees) arising from: (a) your use or misuse of our materials; (b) your operation of tree care or excavation machinery; (c) your violation of these Terms or applicable laws; or (d) any property damage, personal injury, or utility strike occurring on worksites you manage.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">10. Governing Law, Binding Arbitration &amp; Class Action Waiver</h3>
              <p>
                These Terms and any dispute arising out of or related to your purchase shall be governed by and construed in accordance with the laws of the <strong>State of Delaware, United States</strong>, without giving effect to conflict of law principles.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Binding Arbitration:</strong> Any controversy or claim arising out of or relating to these Terms shall be resolved by binding individual arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. Judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction.</li>
                <li><strong>Class Action Waiver:</strong> YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. YOU WAIVE THE RIGHT TO PARTICIPATE AS A CLASS REPRESENTATIVE OR CLASS MEMBER IN ANY CLASS CLAIM.</li>
              </ul>

              <h3 className="font-serif font-bold text-xl text-bark">11. Severability &amp; Entire Agreement</h3>
              <p>
                If any provision of these Terms is found to be unlawful, void, or for any reason unenforceable, then that provision shall be deemed severable and shall not affect the validity and enforceability of any remaining provisions. These Terms constitute the entire agreement between you and {SITE_CONFIG.name} regarding the purchase and use of our materials.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">12. Contact Information</h3>
              <p>
                For questions regarding these Terms, please contact our legal support desk at{' '}
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

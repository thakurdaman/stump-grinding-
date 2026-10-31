import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/config/site';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
                Legal Terms
              </span>
              <h1 className="font-serif font-bold text-3xl text-bark mt-1">
                Terms of Service
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
              <h3 className="font-serif font-bold text-xl text-bark">1. Educational Disclaimer</h3>
              <p>
                All materials, spreadsheets, and documents provided by {SITE_CONFIG.name} are for informational and educational purposes only. They do not constitute formal legal, tax, accounting, or insurance counsel. You assume full operational and safety responsibility for your machinery, excavation practices, and business activities.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">2. Digital Product License</h3>
              <p>
                When purchasing any tier of The Stump Grinding Playbook, you are granted a non-exclusive, non-transferable license for your individual business use. You may not resell, redistribute, upload to public file-sharing networks, or sublicense the materials or spreadsheets.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">3. No Guaranteed Financial Outcomes</h3>
              <p>
                Any financial numbers, worked pricing formulas, or margin examples presented on this website or in the materials are illustrations for learning purposes. We make no guarantee regarding customer acquisition, pricing acceptance in your locality, or business profitability.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">4. Utility Locates &amp; Physical Safety</h3>
              <p>
                Stump grinding involves subsurface excavation. Operators are strictly responsible for complying with all federal, state, and municipal regulations, including contacting 811 (Dig Safe) prior to digging or grinding. We bear no liability for property damage or utility strikes.
              </p>

              <h3 className="font-serif font-bold text-xl text-bark">5. Refund Policy</h3>
              <p>
                Refunds are governed by our 14-day Money-Back Guarantee policy as outlined in our Refund Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

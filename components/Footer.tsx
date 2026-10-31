import React from 'react';
import Link from 'next/link';
import { TreeRing } from './TreeRing';
import { SITE_CONFIG } from '@/config/site';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bark text-sand border-t border-wood-dark/40 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-12 border-b border-wood-dark/40">
          {/* Brand & Mission */}
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-wood-dark/60 flex items-center justify-center text-sand">
                <TreeRing size={26} strokeColor="#EFE4CE" />
              </div>
              <span className="font-serif font-bold text-xl text-[#FBF6EC]">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sand/80 text-sm leading-relaxed">
              Straightforward pricing models, equipment safety checks, and customer acquisition systems for American tree service companies and independent stump grinding operators.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-serif font-semibold text-[#FBF6EC] mb-3">Material</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/#inside" className="text-sand/80 hover:text-orange transition-colors">
                    What&apos;s Inside
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="text-sand/80 hover:text-orange transition-colors">
                    Pricing Tiers
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="text-sand/80 hover:text-orange transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/resend-links" className="text-sand/80 hover:text-orange transition-colors">
                    Resend My Links
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-[#FBF6EC] mb-3">Policies</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/refund-policy" className="text-sand/80 hover:text-orange transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sand/80 hover:text-orange transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sand/80 hover:text-orange transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sand/80 hover:text-orange transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-serif font-semibold text-[#FBF6EC] mb-3">Support</h4>
              <p className="text-xs text-sand/70 mb-2">
                Need help or have questions about your order?
              </p>
              <a
                href={`mailto:${SITE_CONFIG.supportEmail}`}
                className="text-xs font-mono text-orange hover:underline break-all"
              >
                {SITE_CONFIG.supportEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 space-y-4 text-xs text-sand/60">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> {SITE_CONFIG.disclaimer}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-wood-dark/20">
            <p>
              &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <p className="text-sand/50">
              One-time purchases • Instant digital delivery • No subscription fees
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

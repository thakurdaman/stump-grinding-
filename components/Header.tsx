'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TreeRing } from './TreeRing';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FBF6EC]/95 backdrop-blur-md border-b border-bark/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Wordmark Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-orange rounded-md px-1 py-1"
        >
          <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center text-wood-dark group-hover:scale-105 transition-transform">
            <TreeRing size={28} strokeColor="#33241B" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg sm:text-xl text-bark tracking-tight leading-tight">
              The Stump Grinding Playbook
            </span>
            <span className="text-[11px] font-sans uppercase tracking-wider text-wood font-medium">
              Field Manual & Pricing Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#inside"
            className="text-sm font-semibold text-bark/80 hover:text-orange transition-colors focus:outline-none focus:ring-2 focus:ring-orange rounded"
          >
            What&apos;s Inside
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-semibold text-bark/80 hover:text-orange transition-colors focus:outline-none focus:ring-2 focus:ring-orange rounded"
          >
            Versions & Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-semibold text-bark/80 hover:text-orange transition-colors focus:outline-none focus:ring-2 focus:ring-orange rounded"
          >
            FAQ
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-orange text-white text-sm font-bold shadow-sm hover:bg-orange-hover focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 transition-all transform active:scale-95"
          >
            Get the Kit
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-bark hover:bg-sand focus:outline-none focus:ring-2 focus:ring-orange"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-bark/10 bg-[#FBF6EC] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="#inside"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-bark hover:bg-sand rounded-md"
          >
            What&apos;s Inside
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-bark hover:bg-sand rounded-md"
          >
            Versions & Pricing
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-bark hover:bg-sand rounded-md"
          >
            FAQ
          </Link>
          <div className="pt-2">
            <Link
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-lg bg-orange text-white font-bold text-sm shadow hover:bg-orange-hover"
            >
              Get the Kit &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TreeRing } from '@/components/TreeRing';
import { BeforeAfter } from '@/components/BeforeAfter';
import { PreviewGallery } from '@/components/PreviewGallery';
import { FaqAccordion } from '@/components/FaqAccordion';
import { LeadCapture } from '@/components/LeadCapture';
import { CheckoutModal } from '@/components/CheckoutModal';
import { PRODUCTS, ProductTier } from '@/config/products';
import { trackEvent } from '@/components/Analytics';
import {
  Check,
  ShieldCheck,
  Download,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  BookOpen,
  FileText,
  DollarSign,
  Fuel,
  Wrench,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductTier | null>(null);

  const handleBuyClick = (product: ProductTier) => {
    trackEvent('click_buy', { productId: product.id, price: product.price });
    setSelectedProduct(product);
  };

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* =========================================================================
            SECTION 2: HERO
        ========================================================================= */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-[#FBF6EC] border-b border-bark/10">
          {/* Subtle background TreeRing watermark */}
          <div className="absolute -right-24 -top-24 text-sand/50 pointer-events-none select-none">
            <TreeRing size={480} strokeColor="#E8731A" opacity={0.06} />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Copy */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand border border-wood/25 text-bark text-xs font-bold uppercase tracking-wider">
                  <TreeRing size={16} strokeColor="#E8731A" />
                  <span>The American Operator&apos;s Field Kit</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-bark tracking-tight leading-[1.12]">
                  Stop guessing what to charge for a stump.
                </h1>

                <p className="text-lg sm:text-xl text-bark/85 leading-relaxed font-sans max-w-xl">
                  A complete, field-tested pricing system, operating manual, and client templates pack. Know your real equipment costs, stay protected with 811 locates, and price every job for actual profit.
                </p>

                {/* Primary & Secondary CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <a
                    href="#pricing"
                    onClick={() => trackEvent('view_versions')}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-orange hover:bg-orange-hover text-white font-bold text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 transition-all transform active:scale-95"
                  >
                    <span>Get the Kit &rarr;</span>
                  </a>
                  <a
                    href="#inside"
                    className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-sand/60 hover:bg-sand border border-bark/15 text-bark font-bold text-base transition-colors"
                  >
                    <span>See what&apos;s inside</span>
                  </a>
                </div>

                {/* Trust line */}
                <div className="pt-4 flex items-center gap-3 text-xs sm:text-sm text-wood-dark font-medium">
                  <span className="flex items-center gap-1.5 text-forest font-bold">
                    <ShieldCheck size={18} /> Instant download
                  </span>
                  <span>•</span>
                  <span>14-day money-back guarantee</span>
                  <span>•</span>
                  <span>Written for US operators</span>
                </div>
              </div>

              {/* Hero Art / Cover Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative backdrop */}
                  <div className="absolute -inset-2 bg-sand rounded-2xl rotate-1 border border-wood/30 shadow-sm" />

                  <div className="relative bg-bark text-sand rounded-2xl p-6 sm:p-8 shadow-xl border border-wood-dark/60 space-y-6">
                    <div className="flex items-start justify-between border-b border-wood-dark/40 pb-5">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-orange font-sans">
                          Field Manual &amp; Software
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-[#FBF6EC] mt-1">
                          The Stump Grinding Playbook
                        </h2>
                      </div>
                      <TreeRing size={42} strokeColor="#E8731A" />
                    </div>

                    <div className="space-y-3 text-sm text-sand/85">
                      <div className="flex items-center gap-3">
                        <BookOpen size={18} className="text-orange shrink-0" />
                        <span>30+ Page Tactical Playbook (PDF)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet size={18} className="text-forest-light shrink-0" />
                        <span>Multi-Stump Excel &amp; Sheets Calculator</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-wood-light shrink-0" />
                        <span>12 Legal, Quoting &amp; Safety Word Templates</span>
                      </div>
                    </div>

                    {/* Quick Preview Box */}
                    <div className="bg-wood-dark/40 rounded-xl p-4 border border-sand/10 text-xs space-y-1">
                      <p className="font-bold text-[#FBF6EC]">Direct Operator Download</p>
                      <p className="text-sand/70">
                        Compatible with all devices. No monthly software subscriptions.
                      </p>
                    </div>

                    <a
                      href="#pricing"
                      className="w-full py-3 rounded-lg bg-orange hover:bg-orange-hover text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Choose Your Version</span>
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: THE PROBLEM
        ========================================================================= */}
        <section className="py-20 bg-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-wood-dark font-sans">
                The Trap
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
                Most new operators don&apos;t fail at grinding. They fail at the math.
              </h2>
            </div>

            <div className="prose prose-lg text-bark/85 leading-relaxed space-y-4">
              <p>
                You buy a machine or rent one for the weekend. A homeowner calls about a backyard pine stump. You pace it off, guess <em>&quot;looks like a $100 job,&quot;</em> shake hands, and unload the cutter.
              </p>
              <p>
                Then reality hits. The stump has four thick lateral surface roots you didn&apos;t see under the leaves. You hit river rock buried three inches deep and dull two $15 cutter teeth. You spend an extra hour chasing the root flare so the homeowner can replant grass.
              </p>
              <p>
                By the time you blow off the driveway, pack the ramps, and burn $20 in truck and cutter fuel, you made less per hour than a fast-food drive-through worker. You were busy all afternoon, but you barely broke even.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-sand/40 border border-bark/10 rounded-xl p-5 space-y-2">
                <Fuel className="text-orange" size={24} />
                <h4 className="font-serif font-bold text-bark text-base">Unaccounted Fuel &amp; Drive</h4>
                <p className="text-xs text-bark/75">
                  Truck transit, trailering, and machine run-time quietly drain your margin before the wheel even spins.
                </p>
              </div>

              <div className="bg-sand/40 border border-bark/10 rounded-xl p-5 space-y-2">
                <Wrench className="text-wood-dark" size={24} />
                <h4 className="font-serif font-bold text-bark text-base">Hidden Tooth Wear</h4>
                <p className="text-xs text-bark/75">
                  Buried gravel, chain link fences, and root dirt dull teeth fast. If your quote doesn&apos;t build replacement teeth in, you pay out of pocket.
                </p>
              </div>

              <div className="bg-sand/40 border border-bark/10 rounded-xl p-5 space-y-2">
                <Clock className="text-forest" size={24} />
                <h4 className="font-serif font-bold text-bark text-base">Underestimated Chasing</h4>
                <p className="text-xs text-bark/75">
                  Grinding the core takes 15 minutes; grinding 8 feet of surface roots takes 45. Never quote without measuring the collar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: THE MATH EXAMPLE
        ========================================================================= */}
        <section className="py-16 bg-sand/30 border-y border-bark/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#FBF6EC] border-2 border-wood/30 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bark/10 pb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest font-sans">
                    Worked Job Breakdown
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-bark">
                    Example Job: 3 Backyard Hardwood Stumps
                  </h3>
                </div>
                <div className="inline-block px-3 py-1 bg-sand border border-wood/25 rounded-md text-xs font-semibold text-wood-dark">
                  Example job. Your numbers will differ.
                </div>
              </div>

              <p className="text-sm text-bark/80">
                Here is what happens when you quote using our structured diameter, access, and tooth wear adjustments instead of a ballpark guess:
              </p>

              {/* Numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-sand/50 rounded-xl p-5 border border-bark/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-bark/60 block mb-1">
                    Customer Quote
                  </span>
                  <div className="flex items-baseline gap-1 text-bark">
                    <span className="font-serif text-3xl sm:text-4xl font-bold">$250</span>
                    <span className="text-xs text-wood font-medium">gross</span>
                  </div>
                  <p className="text-xs text-bark/70 mt-2">
                    Based on 18&quot;, 14&quot;, and 24&quot; stumps with standard 6-inch below grade depth.
                  </p>
                </div>

                <div className="bg-sand/50 rounded-xl p-5 border border-bark/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-bark/60 block mb-1">
                    Direct Costs
                  </span>
                  <div className="flex items-baseline gap-1 text-wood-dark">
                    <span className="font-serif text-3xl sm:text-4xl font-bold">~$144</span>
                    <span className="text-xs text-wood font-medium">overhead</span>
                  </div>
                  <p className="text-xs text-bark/70 mt-2">
                    Fuel ($22), tooth wear ($32), travel time, equipment depreciation, and insurance portion.
                  </p>
                </div>

                <div className="bg-forest-light/60 rounded-xl p-5 border border-forest/30">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest font-sans block mb-1">
                    Net Profit Kept
                  </span>
                  <div className="flex items-baseline gap-1 text-forest">
                    <span className="font-serif text-3xl sm:text-4xl font-bold">~$106</span>
                    <span className="text-xs text-forest font-medium">net kept</span>
                  </div>
                  <p className="text-xs text-forest/90 mt-2">
                    Clean, predictable profit in the pocket for approximately 1.75 hours of total time.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-bark/60 leading-relaxed italic border-t border-bark/5">
                * Note: Individual fuel prices, tooth styles (Greenteeth vs standard pockets), machine capacity, and travel distances vary significantly across regions. The playbook teaches you how to plug your own local figures into the calculator.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: WHAT'S INSIDE
        ========================================================================= */}
        <section id="inside" className="py-20 bg-[#FBF6EC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
                The Inventory
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
                Everything Inside the Toolkit
              </h2>
              <p className="text-bark/80 text-base leading-relaxed">
                Three purpose-built assets designed to get you quoting with total confidence from day one.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Asset 1: Playbook */}
              <div className="bg-sand/30 border border-bark/15 rounded-2xl p-7 flex flex-col justify-between hover:border-wood transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-orange/15 text-orange flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-wood-dark">
                    Asset #1 • 30+ Pages
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-bark">
                    The Stump Grinding Playbook
                  </h3>
                  <p className="text-sm text-bark/80 leading-relaxed">
                    The core operational handbook. Covers equipment selection, commercial insurance, utility locates, quoting math, and safety checklists.
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-bark/85">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Legal setup, business insurance &amp; inland marine policy tips</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Equipment breakdown: walk-behind vs track vs tow-behind</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Mandatory Call 811 utility locate procedures &amp; liability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Quoting formulas with full worked math examples</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>30-day action plan for landing your first 5 paid jobs</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Asset 2: Calculator */}
              <div className="bg-sand/30 border border-bark/15 rounded-2xl p-7 flex flex-col justify-between hover:border-wood transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-forest/15 text-forest flex items-center justify-center">
                    <FileSpreadsheet size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-wood-dark">
                    Asset #2 • Excel &amp; Sheets
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-bark">
                    Pricing &amp; Business Calculator
                  </h3>
                  <p className="text-sm text-bark/80 leading-relaxed">
                    Never second-guess on a customer&apos;s lawn. Enter stump measurements and site conditions to instantly get minimum profitable rates.
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-bark/85">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Quote up to 8 stumps simultaneously on one sheet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Multipliers for root flare, rocky soil, tight gates, and slopes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Direct job profit and break-even revenue calculators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Built-in local settings tab to enter your hourly target &amp; gas rate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Runs cleanly on Microsoft Excel and Google Sheets</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Asset 3: Templates */}
              <div className="bg-sand/30 border border-bark/15 rounded-2xl p-7 flex flex-col justify-between hover:border-wood transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-wood/20 text-wood-dark flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-wood-dark">
                    Asset #3 • 12 Word Docs
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-bark">
                    Templates &amp; Scripts Pack
                  </h3>
                  <p className="text-sm text-bark/80 leading-relaxed">
                    Copy-and-paste service contracts, safety walkthroughs, customer quote sheets, and phone scripts ready for your business name.
                  </p>

                  <ul className="space-y-2 pt-2 text-xs text-bark/85">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Sample Service Agreement &amp; Damage Liability Waiver</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Professional Quote &amp; Invoice Word templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Pre-job hazard checklist &amp; daily machine inspection logs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Inbound phone &amp; text message answering scripts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-forest shrink-0 mt-0.5" />
                      <span>Door hanger copy, 10 social posts &amp; partner outreach</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: PREVIEWS
        ========================================================================= */}
        <PreviewGallery />

        {/* =========================================================================
            SECTION 7: REAL JOBS (BeforeAfter)
        ========================================================================= */}
        <BeforeAfter />

        {/* =========================================================================
            SECTION 8: WHO IT'S FOR & NOT FOR
        ========================================================================= */}
        <section className="py-20 bg-sand/30 border-t border-bark/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-wood-dark font-sans">
                Fit &amp; Suitability
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
                Is This Right for You?
              </h2>
              <p className="text-bark/80 text-base leading-relaxed">
                We believe in total transparency. Here is who will benefit from this toolkit, and who should not buy it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Who it is for */}
              <div className="bg-[#FBF6EC] border-2 border-forest/30 rounded-2xl p-7 sm:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <h3 className="font-serif font-bold text-xl text-bark">Who this is for</h3>
                </div>

                <ul className="space-y-3 text-sm text-bark/85 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Beginners in the US</strong> looking to start a serious stump grinding side hustle or dedicated small service business.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Tree service and landscaping company owners</strong> adding stump grinding as a profitable service line without guessing on pricing.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Recent grinder buyers</strong> who have the equipment in the trailer but lack a structured pricing sheet and customer acquisition pipeline.</span>
                  </li>
                </ul>
              </div>

              {/* Who it is NOT for */}
              <div className="bg-[#FBF6EC] border-2 border-bark/15 rounded-2xl p-7 sm:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bark text-sand flex items-center justify-center font-bold text-sm">
                    ✕
                  </div>
                  <h3 className="font-serif font-bold text-xl text-bark">Who this is NOT for</h3>
                </div>

                <ul className="space-y-3 text-sm text-bark/85 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-orange shrink-0 mt-0.5" />
                    <span><strong>Anyone looking for guaranteed income or get-rich-quick claims.</strong> Physical trade businesses require hard labor, maintenance, and hustle.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-orange shrink-0 mt-0.5" />
                    <span><strong>Operators outside the United States.</strong> While math formulas apply anywhere, the insurance, 811 utility regulations, and legal agreements are strictly US-specific.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-orange shrink-0 mt-0.5" />
                    <span><strong>Those seeking legal counsel.</strong> The included contracts are starting drafts, not substitutes for a local attorney&apos;s review.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: VERSIONS AND PRICING
        ========================================================================= */}
        <section id="pricing" className="py-24 bg-[#FBF6EC] border-t border-bark/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
                Transparent Pricing
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bark tracking-tight">
                Choose the Right Tier for Your Operation
              </h2>
              <p className="text-bark/80 text-base leading-relaxed">
                One-time purchase in USD. Keep everything forever with instant download access.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {PRODUCTS.map((tier) => {
                const isHighlight = tier.isPopular;

                return (
                  <div
                    key={tier.id}
                    className={`relative rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                      isHighlight
                        ? 'bg-bark text-sand border-2 border-orange shadow-xl lg:-translate-y-2'
                        : 'bg-sand/35 text-bark border border-bark/20 shadow-sm hover:border-wood'
                    } p-7 sm:p-8`}
                  >
                    {/* Badge */}
                    {tier.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-orange text-white text-xs font-bold uppercase tracking-wider shadow">
                        {tier.badge}
                      </div>
                    )}

                    <div>
                      <div className="border-b border-bark/10 pb-5">
                        <h3 className={`font-serif text-2xl font-bold ${isHighlight ? 'text-[#FBF6EC]' : 'text-bark'}`}>
                          {tier.name}
                        </h3>
                        <p className={`text-xs mt-1.5 leading-relaxed ${isHighlight ? 'text-sand/80' : 'text-wood-dark'}`}>
                          {tier.tagline}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="py-6 flex items-baseline gap-2">
                        <span className={`font-serif text-4xl sm:text-5xl font-bold ${isHighlight ? 'text-[#FBF6EC]' : 'text-bark'}`}>
                          ${tier.price}
                        </span>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isHighlight ? 'text-sand/60' : 'text-wood'}`}>
                          USD one-time
                        </span>
                        {tier.regularPrice && (
                          <span className="text-sm line-through text-sand/50 ml-1">
                            ${tier.regularPrice}
                          </span>
                        )}
                      </div>

                      {/* Included Features */}
                      <ul className="space-y-3 pt-2 text-sm">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check
                              size={18}
                              className={`shrink-0 mt-0.5 ${
                                isHighlight ? 'text-orange' : 'text-forest'
                              }`}
                            />
                            <span className={isHighlight ? 'text-sand/90' : 'text-bark/85'}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action button */}
                    <div className="pt-8">
                      <button
                        onClick={() => handleBuyClick(tier)}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 transition-all transform active:scale-95 cursor-pointer ${
                          isHighlight
                            ? 'bg-orange hover:bg-orange-hover text-white'
                            : 'bg-orange hover:bg-orange-hover text-white'
                        }`}
                      >
                        {tier.buttonText}
                      </button>
                      <p className={`text-[11px] text-center mt-2 ${isHighlight ? 'text-sand/60' : 'text-wood'}`}>
                        Instant access • Secure 256-bit checkout
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: GUARANTEE
        ========================================================================= */}
        <section className="py-16 bg-cream border-t border-bark/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-sand/40 border border-wood/30 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="w-20 h-20 rounded-full bg-forest/15 text-forest flex items-center justify-center shrink-0 border-2 border-forest/30">
                <ShieldCheck size={44} />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="font-serif text-2xl font-bold text-bark">
                  14-Day Money-Back Guarantee
                </h3>
                <p className="text-sm text-bark/85 leading-relaxed">
                  Try the formulas, read the playbook, and load the calculator. If you don&apos;t feel the material will help you avoid under-bidding or save you hours of guesswork on job sites, send an email within 14 days and we will refund 100% of your money. No runaround.
                </p>
                <div className="pt-1">
                  <Link
                    href="/refund-policy"
                    className="text-xs font-bold text-orange hover:underline inline-flex items-center gap-1"
                  >
                    Read our full refund policy &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 11: FAQ
        ========================================================================= */}
        <FaqAccordion />

        {/* Email Capture Signup for Free Cheat Sheet */}
        <LeadCapture />

        {/* =========================================================================
            SECTION 12: FINAL CALL TO ACTION
        ========================================================================= */}
        <section className="py-20 bg-bark text-sand border-t border-wood-dark/40 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 text-wood-dark/20 pointer-events-none select-none">
            <TreeRing size={360} strokeColor="#EFE4CE" opacity={0.05} />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-orange font-sans">
                Ready to Stop Guessing?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FBF6EC] tracking-tight">
                Protect your margins on your very next stump job.
              </h2>
              <p className="text-sand/80 text-base max-w-xl mx-auto leading-relaxed">
                One accurately quoted job easily pays for the entire kit. Download the playbook and calculator right now.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange hover:bg-orange-hover text-white font-bold text-base shadow-lg transition-transform transform active:scale-95"
              >
                Choose Your Version &rarr;
              </a>
              <Link
                href="/resend-links"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-wood-dark/50 hover:bg-wood-dark border border-sand/20 text-sand text-sm font-semibold transition-colors"
              >
                Already purchased? Access your files
              </Link>
            </div>

            <div className="pt-2 text-xs text-sand/60">
              Immediate digital file delivery • 14-day refund guarantee
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Checkout Modal */}
      <CheckoutModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}

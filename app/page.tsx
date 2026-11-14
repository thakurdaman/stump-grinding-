'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TreeRing } from '@/components/TreeRing';
import { BeforeAfter } from '@/components/BeforeAfter';
import { SystemPartsSection } from '@/components/SystemPartsSection';
import { FaqAccordion } from '@/components/FaqAccordion';
import { LeadCapture } from '@/components/LeadCapture';
import { CheckoutModal } from '@/components/CheckoutModal';
import { InteractiveCalculator } from '@/components/InteractiveCalculator';
import { VideoWalkthrough } from '@/components/VideoWalkthrough';
import { Testimonials } from '@/components/Testimonials';
import { ShareWidget } from '@/components/ShareWidget';
import { TimelineStepper } from '@/components/TimelineStepper';
import { PlaybookChaptersAccordion } from '@/components/PlaybookChaptersAccordion';
import { StickyMobileCta } from '@/components/StickyMobileCta';
import { Hero3DStage } from '@/components/Hero3DStage';
import { TiltCard } from '@/components/TiltCard';
import { PRODUCTS, ProductTier } from '@/config/products';
import { SITE_CONFIG } from '@/config/site';
import { FAQS } from '@/config/faqs';
import { trackEvent } from '@/components/Analytics';
import {
  Check,
  ShieldCheck,
  Download,
  AlertTriangle,
  ArrowRight,
  FileSpreadsheet,
  BookOpen,
  FileText,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductTier | null>(null);

  const fullKitTier = PRODUCTS.find((p) => p.id === 'full-kit') || PRODUCTS[2];

  const handleBuyClick = (product: ProductTier) => {
    trackEvent('click_buy', { productId: product.id, price: product.price });
    setSelectedProduct(product);
  };

  const productAndFaqGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${SITE_CONFIG.url}/#product`,
        name: 'The First 10 Stumps System',
        description: SITE_CONFIG.description,
        image: `${SITE_CONFIG.url}/images/cover.jpg`,
        brand: {
          '@type': 'Brand',
          name: SITE_CONFIG.name,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '28',
        },
        review: [
          {
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: 'Marcus V.',
            },
            datePublished: '2026-10-18',
            reviewBody:
              'Quoted two jobs the first weekend using the formula and landed both without haggling. The pricing calculator paid for itself on my first job.',
            name: 'Landscaper turned tree service operator',
            reviewRating: {
              '@type': 'Rating',
              bestRating: '5',
              ratingValue: '5',
              worstRating: '1',
            },
          },
          {
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: 'Dan M.',
            },
            datePublished: '2026-10-24',
            reviewBody:
              'The utility locate chapter and pre-grind walkthrough waiver saved me from a massive headache on a gas line job. Essential field manual.',
            name: 'Commercial stump grinding contractor',
            reviewRating: {
              '@type': 'Rating',
              bestRating: '5',
              ratingValue: '5',
              worstRating: '1',
            },
          },
        ],
        offers: PRODUCTS.map((p) => ({
          '@type': 'Offer',
          name: p.name,
          price: p.price.toFixed(2),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${SITE_CONFIG.url}/#pricing`,
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'USD',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'US',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
              transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
            },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'US',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_CONFIG.url}/#faq`,
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productAndFaqGraph) }}
      />
      <Header />

      <main className="flex-1 pb-16 md:pb-0">
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
              {/* Copy (Left) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Category Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-embossed border border-[#8B5A2B]/20 text-[#21150F]">
                  <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                  <span className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-[#5C4033]">
                    3-Part Complete System
                  </span>
                </div>

                {/* Main Display Headline with Optical Contrast */}
                <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-bark tracking-tight leading-[1.12]">
                  Start a stump grinding business <span className="italic font-normal text-orange block sm:inline">even if you&apos;ve never</span> touched a grinder.
                </h1>

                {/* Subhead */}
                <p className="text-base sm:text-lg text-bark/85 leading-relaxed font-sans max-w-xl">
                  Test the demand for under $100, price jobs in minutes with the root flare formula, and know exactly what to say to local tree companies.
                </p>

                {/* Primary CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <a
                    href="#pricing"
                    onClick={() => trackEvent('view_versions')}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl btn-3d-orange text-white font-bold text-base cursor-pointer"
                  >
                    <span>Get the Beginner System &rarr;</span>
                  </a>
                  <a
                    href="#path"
                    className="inline-flex items-center justify-center px-6 py-4 rounded-xl btn-3d-secondary text-bark font-bold text-base cursor-pointer"
                  >
                    <span>See your first 30 days</span>
                  </a>
                </div>

                {/* Physical 3D Feature Chips */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-semibold text-wood-dark">
                  <div className="px-3.5 py-1.5 rounded-lg bg-white/70 backdrop-blur-sm border border-bark/10 shadow-sm flex items-center gap-2">
                    <span className="text-forest font-bold">✓</span> No experience needed
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-white/70 backdrop-blur-sm border border-bark/10 shadow-sm flex items-center gap-2">
                    <span className="text-orange font-bold">✓</span> Step by step roadmap
                  </div>
                  <div className="px-3.5 py-1.5 rounded-lg bg-white/70 backdrop-blur-sm border border-bark/10 shadow-sm flex items-center gap-2">
                    <span className="text-forest font-bold">✓</span> Start part-time weekends
                  </div>
                </div>

                {/* Fine Print */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-wood-dark font-medium border-t border-bark/10">
                  <span className="flex items-center gap-1.5 text-forest font-bold">
                    <ShieldCheck size={18} /> Instant download
                  </span>
                  <span>•</span>
                  <span>14-day money-back guarantee on the Full Kit</span>
                  <span>•</span>
                  <span>Educational material, no income guarantees</span>
                  <span>•</span>
                  <span>Written for US operators</span>
                </div>
              </div>

              {/* Visual (Right): Interactive 3D Spatial Mockup Cluster */}
              <div className="lg:col-span-5">
                <Hero3DStage onGetSystem={() => handleBuyClick(fullKitTier)} />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: "ONE SYSTEM, THREE PARTS" STRIP (Merged with "See Exactly What You Are Getting")
        ========================================================================= */}
        <SystemPartsSection onGetSystem={() => handleBuyClick(fullKitTier)} />

        {/* =========================================================================
            SECTION 4: "YOUR PATH: DAY 1, DAY 7, DAY 30" (Timeline Stepper)
        ========================================================================= */}
        <TimelineStepper />

        {/* =========================================================================
            SECTION 5: "WHAT YOU'LL BE ABLE TO DO" (4 items)
        ========================================================================= */}
        <section id="what-youll-learn" className="py-20 bg-cream border-b border-bark/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
                Core Skills
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
                What You&apos;ll Be Able to Do
              </h2>
              <p className="text-bark/80 text-base leading-relaxed">
                Four practical capabilities you take away from the three-part system:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-sand/35 border border-bark/15 rounded-2xl p-6 sm:p-7 space-y-3 card-hover-lift">
                <div className="w-10 h-10 rounded-xl bg-orange/15 text-orange flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-serif font-bold text-xl text-bark">
                  Test your local market before buying equipment
                </h3>
                <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                  Validate that real homeowners in your zip codes want stumps removed before investing thousands in machinery or trailers.
                </p>
              </div>

              <div className="bg-sand/35 border border-bark/15 rounded-2xl p-6 sm:p-7 space-y-3 card-hover-lift">
                <div className="w-10 h-10 rounded-xl bg-forest/15 text-forest flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-serif font-bold text-xl text-bark">
                  Quote a stump in under 5 minutes
                </h3>
                <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                  Input ground-level diameter, root flare inches, and gate clearance into your spreadsheet to generate a reliable price right on site.
                </p>
              </div>

              <div className="bg-sand/35 border border-bark/15 rounded-2xl p-6 sm:p-7 space-y-3 card-hover-lift">
                <div className="w-10 h-10 rounded-xl bg-wood/20 text-wood-dark flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-serif font-bold text-xl text-bark">
                  Send ready-to-use outreach messages to tree companies
                </h3>
                <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                  Reach local arborists and landscapers who cut trees down but prefer subbing out the messy stump grinding work to a reliable specialist.
                </p>
              </div>

              <div className="bg-sand/35 border border-bark/15 rounded-2xl p-6 sm:p-7 space-y-3 card-hover-lift">
                <div className="w-10 h-10 rounded-xl bg-orange/15 text-orange flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="font-serif font-bold text-xl text-bark">
                  Run a job safely, from the 811 call to the final walkthrough
                </h3>
                <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                  Protect buried pipes, cables, and nearby fences. Learn the standard 811 utility locate procedures and pre-grind property inspection protocols.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: SHORT BRIDGE (Replaces "The Trap")
        ========================================================================= */}
        <section className="py-14 bg-sand/30 border-b border-bark/10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-wood-dark font-sans">
              The Setup Order
            </span>
            <p className="font-serif text-xl sm:text-2xl font-bold text-bark leading-snug">
              Most beginners guess at pricing and skip the boring steps like insurance and utility locates. This system gives you the exact order to do things in so you build a safe, structured business from day one.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: WHAT'S INSIDE (Three Cards in Exact Order: a, b, c)
        ========================================================================= */}
        <section id="inside" className="py-20 bg-[#FBF6EC] border-b border-bark/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
              <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
                The Inventory
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
                Everything Inside the System
              </h2>
              <p className="text-bark/80 text-base leading-relaxed">
                The Playbook leads the system, supported by the pricing spreadsheet and ready-to-use document pack.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Card a: The Playbook */}
              <div className="bg-sand/30 border-2 border-orange/40 rounded-2xl p-7 flex flex-col justify-between hover:border-orange transition-colors card-hover-lift shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-orange/15 text-orange flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange font-mono">
                      Lead Asset • 52 Pages
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-orange text-white">
                      The Star
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-bark">
                    The Stump Grinding Playbook
                  </h3>
                  <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                    The complete 52-page operational guide. Includes a 7-day first-job plan and a 30-day action plan covering business setup, machinery, Call 811 rules, and job execution.
                  </p>

                  {/* Accordion grouped by stage */}
                  <PlaybookChaptersAccordion />
                </div>
              </div>

              {/* Card b: The Pricing & Business Calculator */}
              <div className="bg-sand/30 border border-bark/15 rounded-2xl p-7 flex flex-col justify-between hover:border-wood transition-colors card-hover-lift">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-forest/15 text-forest flex items-center justify-center">
                    <FileSpreadsheet size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-wood-dark font-mono">
                    Supporting Asset • Excel &amp; Sheets
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-bark">
                    Pricing &amp; Business Calculator
                  </h3>
                  <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                    Pre-built spreadsheet ready for Microsoft Excel and Google Sheets on your phone. Here is what every tab does:
                  </p>

                  <ul className="space-y-2.5 pt-2 text-xs text-bark/85 font-sans">
                    <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg border border-bark/10">
                      <span className="font-mono font-bold text-forest shrink-0">Quote:</span>
                      <span>Enter diameter and site conditions to generate an instant client quote for up to 8 stumps.</span>
                    </li>
                    <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg border border-bark/10">
                      <span className="font-mono font-bold text-forest shrink-0">Settings:</span>
                      <span>Set your local gas price, hourly labor target, minimum trip fee, and trailer transit rate.</span>
                    </li>
                    <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg border border-bark/10">
                      <span className="font-mono font-bold text-forest shrink-0">JobProfit:</span>
                      <span>Subtracts fuel, machine wear, teeth buffers, and transit to calculate your take-home net per job.</span>
                    </li>
                    <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg border border-bark/10">
                      <span className="font-mono font-bold text-forest shrink-0">BreakEven:</span>
                      <span>Calculates exactly how many stumps you need to grind each month to cover insurance and equipment costs.</span>
                    </li>
                    <li className="flex items-start gap-2 bg-white/60 p-2 rounded-lg border border-bark/10">
                      <span className="font-mono font-bold text-forest shrink-0">Tracker:</span>
                      <span>Log every completed job, date, client phone, paid amount, and referral source in one running list.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card c: Templates & Scripts Pack */}
              <div className="bg-sand/30 border border-bark/15 rounded-2xl p-7 flex flex-col justify-between hover:border-wood transition-colors card-hover-lift">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-wood/20 text-wood-dark flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-wood-dark font-mono">
                    Supporting Asset • 12 Word Docs
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-bark">
                    Templates &amp; Scripts Pack
                  </h3>
                  <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                    12 ready-to-use Word documents organized into three practical groups:
                  </p>

                  <div className="space-y-3 pt-2 text-xs text-bark/85 font-sans">
                    {/* What to send */}
                    <div className="bg-white/60 p-2.5 rounded-lg border border-bark/10 space-y-1">
                      <p className="font-bold text-wood-dark uppercase text-[11px] font-mono">What to send:</p>
                      <ul className="space-y-1 pl-1">
                        <li>• Professional Quote Form (.docx)</li>
                        <li>• Standard Invoice Template (.docx)</li>
                        <li>• Service Agreement &amp; Property Damage Liability Waiver</li>
                      </ul>
                    </div>

                    {/* What to check */}
                    <div className="bg-white/60 p-2.5 rounded-lg border border-bark/10 space-y-1">
                      <p className="font-bold text-wood-dark uppercase text-[11px] font-mono">What to check:</p>
                      <ul className="space-y-1 pl-1">
                        <li>• Pre-Job Property &amp; Hazard Inspection Checklist</li>
                        <li>• Daily Machine Inspection &amp; Teeth Wear Log</li>
                        <li>• Call 811 Utility Locate Protocol &amp; Verification Sheet</li>
                      </ul>
                    </div>

                    {/* What to say */}
                    <div className="bg-white/60 p-2.5 rounded-lg border border-bark/10 space-y-1">
                      <p className="font-bold text-wood-dark uppercase text-[11px] font-mono">What to say:</p>
                      <ul className="space-y-1 pl-1">
                        <li>• Inbound Phone &amp; Text Answering Scripts</li>
                        <li>• Tree Company &amp; Arborist Partnership Outreach Message</li>
                        <li>• Door Hanger Copy, 10 Social Posts &amp; 5-Star Review Request</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: "KNOW WHAT TO CHARGE" (Interactive Quoting Engine)
        ========================================================================= */}
        <InteractiveCalculator />

        {/* =========================================================================
            SECTION 9: SUPPORTING PROOF (Video Walkthrough, 3 Ground Rules, Field Results Gallery)
        ========================================================================= */}
        <VideoWalkthrough />
        <BeforeAfter />

        {/* =========================================================================
            SECTION 10: WHO IT'S FOR / WHO IT'S NOT FOR
        ========================================================================= */}
        <section className="py-20 bg-sand/30 border-t border-bark/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
              <span className="text-xs font-bold tracking-widest uppercase text-wood-dark font-sans">
                Fit &amp; Suitability
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
                Who It&apos;s For / Who It&apos;s Not For
              </h2>
              <p className="text-bark/80 text-base leading-relaxed">
                Clear expectations before you buy:
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

                <ul className="space-y-3 text-sm text-bark/85 leading-relaxed font-sans">
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Complete beginners</strong> who want a structured, step-by-step roadmap from day 1 to day 30.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Side hustlers keeping their day job</strong> who want to run weekend or evening jobs with clear safety checklists.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Tree and landscape workers</strong> adding stump grinding as a new service without guessing on pricing formulas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>New grinder owners</strong> who have machine access but need quotes, contracts, and outreach messages ready to go.</span>
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

                <ul className="space-y-3 text-sm text-bark/85 leading-relaxed font-sans">
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-orange shrink-0 mt-0.5" />
                    <span><strong>Anyone wanting money without physical work.</strong> Operating a stump grinder requires manual labor, machine maintenance, and proper gear.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-orange shrink-0 mt-0.5" />
                    <span><strong>Anyone unwilling to follow safety rules.</strong> Flying debris, underground utilities (811), and high-RPM cutter wheels require strict discipline.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-orange shrink-0 mt-0.5" />
                    <span><strong>Anyone wanting guaranteed income.</strong> Earnings depend on local demand, equipment reliability, and your own sales effort.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-orange shrink-0 mt-0.5" />
                    <span><strong>Operators outside the US.</strong> While pricing math translates, insurance rules, 811 locate laws, and contracts are written for US operators.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle size={18} className="text-orange shrink-0 mt-0.5" />
                    <span><strong>Anyone wanting legal advice.</strong> The provided templates are starting operational drafts, not a replacement for an attorney.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10B: REAL OPERATOR TESTIMONIALS (Moved below "Who it's for / not for" and above Pricing)
        ========================================================================= */}
        <Testimonials />

        {/* =========================================================================
            SECTION 11: PRICING
        ========================================================================= */}
        <section id="pricing" className="py-24 bg-[#FBF6EC] border-t border-bark/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
              <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
                Transparent Pricing
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-bark tracking-tight">
                Choose the Right Tier for Your Operation
              </h2>
              <p className="text-bark/80 text-base leading-relaxed">
                One-time purchase in USD. Instant digital delivery with lifetime access.
              </p>
            </div>

            {/* Beginner Market Context Banner (Replaces removed ROI claim) */}
            <div className="max-w-3xl mx-auto mb-14 bg-sand/60 border border-wood/30 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-forest/20 text-forest flex items-center justify-center shrink-0">
                <DollarSign size={26} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest font-sans">Market Context</span>
                  <span className="text-xs text-bark/40">•</span>
                  <span className="text-xs font-semibold text-wood-dark font-sans">Pricing Guidance</span>
                </div>
                <h4 className="font-serif font-bold text-bark text-base sm:text-lg">
                  Understanding Stump Pricing
                </h4>
                <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                  Public price guides commonly list about $2–$5 per inch of stump diameter. Your market sets your prices; the calculator helps you find yours based on your machine, fuel, and target hourly rate.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {PRODUCTS.map((tier) => {
                const isHighlight = tier.isPopular;

                return (
                  <TiltCard
                    key={tier.id}
                    maxTilt={5}
                    className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                      isHighlight
                        ? 'bg-bark text-sand border-2 border-orange shadow-[0_25px_60px_-15px_rgba(232,115,26,0.35)] lg:-translate-y-2 hover:-translate-y-3 ring-2 ring-orange/30'
                        : 'bg-sand/35 text-bark border border-bark/20 shadow-sm hover:border-wood/60 hover:-translate-y-1 hover:shadow-lg'
                    } p-7 sm:p-8`}
                  >
                    {/* 3D Slanting Animated E-Commerce Badge */}
                    {tier.badge && (
                      <div className="absolute -top-5 right-4 sm:right-6 z-20 pointer-events-none">
                        <div className="animate-ecommerce-badge px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FA8A32] via-[#E8731A] to-[#D4620B] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider border-2 border-white/50 shadow-xl flex items-center gap-1.5 backdrop-blur-sm">
                          <span className="tracking-tight">★ BEST VALUE</span>
                          <span className="opacity-60">•</span>
                          <span className="bg-black/30 px-1.5 py-0.5 rounded-md text-[10px] tracking-normal font-bold">
                            SAVE $33
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="border-b border-bark/10 pb-5">
                        {isHighlight && (
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange block mb-1">
                            New to stump grinding? Start here.
                          </span>
                        )}
                        <h3 className={`font-serif text-2xl font-bold ${isHighlight ? 'text-[#FBF6EC]' : 'text-bark'}`}>
                          {tier.name}
                        </h3>
                        <p className={`text-xs mt-1.5 leading-relaxed ${isHighlight ? 'text-sand/80' : 'text-wood-dark'}`}>
                          {tier.tagline}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="py-6 flex items-baseline gap-2 flex-wrap">
                        <span className={`font-serif text-4xl sm:text-5xl font-bold ${isHighlight ? 'text-[#FBF6EC]' : 'text-bark'} tabular-nums`}>
                          ${tier.price}
                        </span>
                        {tier.regularPrice && (
                          <div className="flex items-center gap-1.5 ml-1">
                            <span className="text-sm line-through text-sand/50 tabular-nums">
                              ${tier.regularPrice}
                            </span>
                            {tier.regularPrice > tier.price && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-tight bg-orange/20 text-orange border border-orange/30">
                                Save ${tier.regularPrice - tier.price}
                              </span>
                            )}
                          </div>
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
                        className={`w-full py-4 px-6 rounded-xl font-bold text-base cursor-pointer ${
                          isHighlight
                            ? 'btn-3d-orange text-white'
                            : 'btn-3d-secondary text-bark font-bold'
                        }`}
                      >
                        {tier.buttonText}
                      </button>
                      <p className={`text-[11px] text-center mt-2 ${isHighlight ? 'text-sand/60' : 'text-wood'}`}>
                        Instant access
                      </p>
                    </div>
                  </TiltCard>
                );
              })}
            </div>

            {/* Share With Crew / Partner Widget */}
            <div className="mt-14 max-w-2xl mx-auto">
              <ShareWidget />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 12: GUARANTEE
        ========================================================================= */}
        <section className="py-16 bg-cream border-t border-bark/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-sand/40 border border-wood/30 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <div className="w-20 h-20 rounded-full bg-forest/15 text-forest flex items-center justify-center shrink-0 border-2 border-forest/30">
                <ShieldCheck size={44} />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="font-serif text-2xl font-bold text-bark">
                  14-Day Money-Back Guarantee (Full Kit)
                </h3>
                <p className="text-sm text-bark/85 leading-relaxed font-sans">
                  Put the Complete Beginner System to work. If you don&apos;t feel the complete package helps you avoid under-bidding or saves you hours of guesswork on job sites, send an email within 14 days of purchase and we will refund 100% of your money. Note: Standalone tiers (Playbook Only and Calculator + Templates) are non-refundable.
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
            SECTION 13: FAQ
        ========================================================================= */}
        <FaqAccordion />

        {/* =========================================================================
            SECTION 14: FREE CHEAT SHEET OPT-IN (Keep as is)
        ========================================================================= */}
        <LeadCapture />

        {/* =========================================================================
            SECTION 15: FINAL CALL TO ACTION
        ========================================================================= */}
        <section className="py-20 bg-bark text-sand border-t border-wood-dark/40 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 text-wood-dark/20 pointer-events-none select-none">
            <TreeRing size={360} strokeColor="#EFE4CE" opacity={0.05} />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-widest uppercase text-orange font-sans">
                Ready to Start?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FBF6EC] tracking-tight">
                Get the step-by-step system.
              </h2>
              <p className="text-sand/80 text-base max-w-xl mx-auto leading-relaxed">
                Download the 52-page playbook, pricing calculator spreadsheet, and ready-to-send templates right now.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl btn-3d-orange text-white font-bold text-base cursor-pointer"
              >
                Get the Beginner System &rarr;
              </a>
              <Link
                href="/resend-links"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-wood-dark/50 hover:bg-wood-dark border border-sand/20 text-sand text-sm font-semibold transition-colors"
              >
                Already purchased? Access your files
              </Link>
            </div>

            <div className="pt-2 text-xs text-sand/60">
              Immediate digital file delivery • 14-day refund guarantee on the Full Kit
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky Mobile CTA */}
      <StickyMobileCta
        featuredTier={fullKitTier}
        onSelectProduct={(tier) => handleBuyClick(tier)}
      />

      {/* Checkout Modal */}
      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

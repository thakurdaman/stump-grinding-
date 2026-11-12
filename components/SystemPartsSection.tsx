'use client';

import React, { useState, useRef } from 'react';
import { TiltCard } from '@/components/TiltCard';
import { SITE_CONFIG } from '@/config/site';
import { X, Maximize2, Download, FileText, Table, CheckSquare, ArrowRight } from 'lucide-react';

interface SystemPartsSectionProps {
  onGetSystem?: () => void;
}

export const SystemPartsSection: React.FC<SystemPartsSectionProps> = ({ onGetSystem }) => {
  const [activePreview, setActivePreview] = useState<(typeof SITE_CONFIG.previews)[0] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const previews = SITE_CONFIG.previews;
  const playbookPreview = previews.find((p) => p.id === 'playbook-preview') || previews[0];
  const calculatorPreview = previews.find((p) => p.id === 'calculator-preview') || previews[1];
  const templatesPreview = previews.find((p) => p.id === 'templates-preview') || previews[2];

  // Touch tracking exclusively for the middle swipe zone
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isHorizontalGestureRef = useRef<boolean>(false);

  const handleMiddleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
    isHorizontalGestureRef.current = false;
  };

  const handleMiddleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const diffX = e.touches[0].clientX - touchStartRef.current.x;
    const diffY = e.touches[0].clientY - touchStartRef.current.y;

    // Detect if this is an intentional horizontal swipe in the middle
    if (Math.abs(diffX) > 15 && Math.abs(diffX) > Math.abs(diffY)) {
      isHorizontalGestureRef.current = true;
    }
  };

  const handleMiddleTouchEnd = (
    e: React.TouchEvent,
    previewItem: (typeof SITE_CONFIG.previews)[0]
  ) => {
    if (!touchStartRef.current) return;
    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const duration = Date.now() - touchStartRef.current.time;

    // Only swipe between rectangular sections if swipe is horizontal in the middle
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.1) {
      if (diffX < 0) {
        // Swipe left -> next rectangular section
        setActiveIndex((prev) => Math.min(2, prev + 1));
      } else {
        // Swipe right -> previous rectangular section
        setActiveIndex((prev) => Math.max(0, prev - 1));
      }
    } else if (
      !isHorizontalGestureRef.current &&
      Math.abs(diffX) < 12 &&
      Math.abs(diffY) < 12 &&
      duration < 350
    ) {
      // Tap without swipe -> open the inspection modal
      setActivePreview(previewItem);
    }

    touchStartRef.current = null;
    isHorizontalGestureRef.current = false;
  };

  const getIcon = (category: string) => {
    if (category.includes('PDF') || category.includes('Playbook')) return <FileText className="text-orange" size={20} />;
    if (category.includes('Calculator') || category.includes('XLSX')) return <Table className="text-emerald-400" size={20} />;
    return <CheckSquare className="text-amber-500" size={20} />;
  };

  return (
    <section id="system-parts" className="py-16 sm:py-24 bg-sand/35 border-b border-bark/10 relative overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Merged Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bark/5 border border-bark/10 text-xs font-mono-code font-bold uppercase tracking-widest text-orange mb-1">
            <span>Architecture of the Kit</span>
            <span className="text-bark/30">•</span>
            <span>Inside the Materials</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-bark tracking-tight">
            One complete system. Three supporting parts.
          </h2>
          <p className="text-sm sm:text-base text-wood-dark max-w-2xl mx-auto leading-relaxed">
            See exactly what you are getting. No disconnected advice or vague theory — clean, formatted tools ready to load onto your phone or print for the truck.
          </p>

          {/* Mobile Swipe Notice (Explains middle swipe zone without blocking page scroll) */}
          <div className="flex md:hidden items-center justify-center gap-1.5 text-[11px] font-mono-code text-wood-dark font-medium pt-1">
            <span className="text-orange font-bold">↔ Swipe in the middle</span>
            <span>to switch rectangular sections ({activeIndex + 1} of 3)</span>
          </div>
        </div>

        {/* Outer Viewport (Native vertical page scroll is 100% free everywhere) */}
        <div className="relative w-full overflow-hidden md:overflow-visible" style={{ touchAction: 'pan-y' }}>
          
          {/* Animated Slide Track on Mobile / 3-Col Grid on Desktop */}
          <div
            className="flex transition-transform duration-300 ease-out md:!transform-none md:grid md:grid-cols-3 md:gap-8"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              touchAction: 'pan-y',
            }}
          >
            
            {/* =========================================================================
                PART 1: THE PLAYBOOK (Strategy & 811 Safety Manual)
            ========================================================================= */}
            <div className="w-full flex-shrink-0 md:w-auto md:flex-shrink flex flex-col px-1 sm:px-0" style={{ touchAction: 'pan-y' }}>
              <TiltCard
                maxTilt={6}
                className="bg-white/95 rounded-2xl p-6 sm:p-7 border border-bark/15 shadow-[0_12px_28px_-6px_rgba(33,21,15,0.08)] flex flex-col justify-between h-full transition-all duration-300 hover:border-orange/60"
              >
                <div className="space-y-4 relative z-10" style={{ touchAction: 'pan-y' }}>
                  {/* Top Area: Pure vertical scroll, never blocks */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-xl shadow-inner">
                      📖
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="md:hidden px-2 py-0.5 rounded-md bg-bark/10 text-bark font-mono-code text-[10px] font-bold">
                        1 / 3
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-mono-code text-[10px] font-bold uppercase tracking-wider border border-amber-300/60">
                        PDF Manual
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-mono-code text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      Part 01 • The Strategy
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-bark">The Playbook</h3>
                    <p className="text-xs font-semibold text-orange italic mt-0.5">&ldquo;So you know what to do.&rdquo;</p>
                  </div>

                  <p className="text-xs sm:text-sm text-wood-dark leading-relaxed font-sans">
                    52 comprehensive pages organized in 15 chapters. Step-by-step from testing market demand under $100, insurance, 811 locate safety, through scaling to full-time.
                  </p>

                  {/* MIDDLE SWIPE ZONE: Swiping horizontally here advances to next section */}
                  <div
                    onTouchStart={handleMiddleTouchStart}
                    onTouchMove={handleMiddleTouchMove}
                    onTouchEnd={(e) => handleMiddleTouchEnd(e, playbookPreview)}
                    onClick={() => setActivePreview(playbookPreview)}
                    className="group/doc relative mt-4 rounded-xl overflow-hidden bg-[#1E130B] p-2 border border-bark/20 cursor-pointer shadow-md hover:shadow-xl hover:border-orange transition-all duration-300 active:scale-[0.99]"
                  >
                    {/* Middle Swipe Indicator Pill */}
                    <div className="flex md:hidden items-center justify-between px-1 mb-1 text-[9px] font-mono-code text-amber-200/80">
                      <span className="font-bold text-orange">↔ SWIPE IN THE MIDDLE</span>
                      <span>Next Section &rarr;</span>
                    </div>

                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-white pointer-events-none">
                      <img
                        src={playbookPreview.image}
                        alt={playbookPreview.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover/doc:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-orange font-mono-code text-[10px] font-bold shadow-md">
                        Playbook (PDF)
                      </span>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-bark/60 backdrop-blur-[1px] opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange text-white text-xs font-bold shadow-lg transform translate-y-1 group-hover/doc:translate-y-0 transition-transform">
                          <Maximize2 size={13} /> Click to Inspect
                        </span>
                      </div>
                    </div>

                    {/* Subtitle & Caption */}
                    <div className="pt-2 px-1 pointer-events-none">
                      <p className="text-[11px] font-bold text-[#F5EFE6] leading-tight truncate">
                        {playbookPreview.title}
                      </p>
                      <p className="text-[10px] text-[#D8C7B0] leading-snug mt-0.5 line-clamp-2">
                        {playbookPreview.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Area: Pure vertical scroll, never blocks */}
                <div className="pt-4 mt-5 border-t border-bark/10 relative z-10 flex items-center justify-between text-xs font-mono-code" style={{ touchAction: 'pan-y' }}>
                  <button
                    type="button"
                    onClick={() => setActivePreview(playbookPreview)}
                    className="text-orange hover:text-orange-hover font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Inspect pages</span>
                    <ArrowRight size={13} />
                  </button>
                  <span className="text-wood-dark font-medium">15 Chapters • PDF</span>
                </div>
              </TiltCard>
            </div>

            {/* =========================================================================
                PART 2: PRICING CALCULATOR (Elevated 3D Star Tool Card)
            ========================================================================= */}
            <div className="w-full flex-shrink-0 md:w-auto md:flex-shrink flex flex-col px-1 sm:px-0" style={{ touchAction: 'pan-y' }}>
              <TiltCard
                maxTilt={6}
                className="bg-gradient-to-b from-[#21150F] to-[#120B07] text-white rounded-2xl p-6 sm:p-7 border-2 border-amber-500/40 shadow-[0_22px_45px_-10px_rgba(232,115,26,0.35)] flex flex-col justify-between h-full transform md:-translate-y-3 transition-all duration-300 hover:border-amber-400"
              >
                <div className="space-y-4 relative z-10" style={{ touchAction: 'pan-y' }}>
                  {/* Top Area: Pure vertical scroll, never blocks */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-xl shadow-inner">
                      🧮
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="md:hidden px-2 py-0.5 rounded-md bg-white/10 text-amber-200 font-mono-code text-[10px] font-bold">
                        2 / 3
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-orange text-white font-mono-code text-[10px] font-bold uppercase tracking-wider shadow">
                        ⭐ STAR TOOL
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-mono-code text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Part 02 • The Numbers
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-white">Pricing Calculator</h3>
                    <p className="text-xs font-semibold text-amber-300 italic mt-0.5">&ldquo;So you know what to charge.&rdquo;</p>
                  </div>

                  <p className="text-xs sm:text-sm text-sand/85 leading-relaxed font-sans">
                    5 specialized tabs: Quote up to 8 stumps with flare &amp; hardness multipliers, configure local overhead in Settings, log job margins, and calculate break-even targets.
                  </p>

                  {/* MIDDLE SWIPE ZONE: Swiping horizontally here advances to next/prev section */}
                  <div
                    onTouchStart={handleMiddleTouchStart}
                    onTouchMove={handleMiddleTouchMove}
                    onTouchEnd={(e) => handleMiddleTouchEnd(e, calculatorPreview)}
                    onClick={() => setActivePreview(calculatorPreview)}
                    className="group/doc relative mt-4 rounded-xl overflow-hidden bg-[#0D0805] p-2 border border-amber-500/30 cursor-pointer shadow-md hover:shadow-xl hover:border-amber-400/70 transition-all duration-300 active:scale-[0.99]"
                  >
                    {/* Middle Swipe Indicator Pill */}
                    <div className="flex md:hidden items-center justify-between px-1 mb-1 text-[9px] font-mono-code text-amber-300/80">
                      <span className="font-bold text-orange">↔ SWIPE IN THE MIDDLE</span>
                      <span>&larr; Prev / Next &rarr;</span>
                    </div>

                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-white pointer-events-none">
                      <img
                        src={calculatorPreview.image}
                        alt={calculatorPreview.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover/doc:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-emerald-400 font-mono-code text-[10px] font-bold shadow-md">
                        Pricing Calculator (XLSX)
                      </span>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-bark/60 backdrop-blur-[1px] opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange text-white text-xs font-bold shadow-lg transform translate-y-1 group-hover/doc:translate-y-0 transition-transform">
                          <Maximize2 size={13} /> Click to Inspect
                        </span>
                      </div>
                    </div>

                    {/* Subtitle & Caption */}
                    <div className="pt-2 px-1 pointer-events-none">
                      <p className="text-[11px] font-bold text-amber-200 leading-tight truncate">
                        {calculatorPreview.title}
                      </p>
                      <p className="text-[10px] text-sand/75 leading-snug mt-0.5 line-clamp-2">
                        {calculatorPreview.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Area: Pure vertical scroll, never blocks */}
                <div className="pt-4 mt-5 border-t border-white/15 relative z-10 flex items-center justify-between text-xs font-mono-code" style={{ touchAction: 'pan-y' }}>
                  <button
                    type="button"
                    onClick={() => setActivePreview(calculatorPreview)}
                    className="text-amber-300 hover:text-amber-200 font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Inspect spreadsheet</span>
                    <ArrowRight size={13} />
                  </button>
                  <span className="text-emerald-400 font-medium">5 Tabs • Excel &amp; Sheets</span>
                </div>
              </TiltCard>
            </div>

            {/* =========================================================================
                PART 3: TEMPLATES & SCRIPTS (Outreach & Contracts)
            ========================================================================= */}
            <div className="w-full flex-shrink-0 md:w-auto md:flex-shrink flex flex-col px-1 sm:px-0" style={{ touchAction: 'pan-y' }}>
              <TiltCard
                maxTilt={6}
                className="bg-white/95 rounded-2xl p-6 sm:p-7 border border-bark/15 shadow-[0_12px_28px_-6px_rgba(33,21,15,0.08)] flex flex-col justify-between h-full transition-all duration-300 hover:border-orange/60"
              >
                <div className="space-y-4 relative z-10" style={{ touchAction: 'pan-y' }}>
                  {/* Top Area: Pure vertical scroll, never blocks */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-orange/10 border border-orange/25 flex items-center justify-center text-xl shadow-inner">
                      📋
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="md:hidden px-2 py-0.5 rounded-md bg-bark/10 text-bark font-mono-code text-[10px] font-bold">
                        3 / 3
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-mono-code text-[10px] font-bold uppercase tracking-wider border border-stone-300">
                        Word &amp; Docs
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-mono-code text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      Part 03 • The Outreach
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-bark">Templates &amp; Scripts</h3>
                    <p className="text-xs font-semibold text-orange italic mt-0.5">&ldquo;So you know what to say.&rdquo;</p>
                  </div>

                  <p className="text-xs sm:text-sm text-wood-dark leading-relaxed font-sans">
                    12 ready-to-use documents: Commercial tree crew outreach messages, pre-grind walkthrough damage waivers, photo estimate texts, invoices, and review requests.
                  </p>

                  {/* MIDDLE SWIPE ZONE: Swiping horizontally here advances to prev section */}
                  <div
                    onTouchStart={handleMiddleTouchStart}
                    onTouchMove={handleMiddleTouchMove}
                    onTouchEnd={(e) => handleMiddleTouchEnd(e, templatesPreview)}
                    onClick={() => setActivePreview(templatesPreview)}
                    className="group/doc relative mt-4 rounded-xl overflow-hidden bg-[#1E130B] p-2 border border-bark/20 cursor-pointer shadow-md hover:shadow-xl hover:border-orange transition-all duration-300 active:scale-[0.99]"
                  >
                    {/* Middle Swipe Indicator Pill */}
                    <div className="flex md:hidden items-center justify-between px-1 mb-1 text-[9px] font-mono-code text-amber-200/80">
                      <span className="font-bold text-orange">↔ SWIPE IN THE MIDDLE</span>
                      <span>&larr; Prev Section</span>
                    </div>

                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-white pointer-events-none">
                      <img
                        src={templatesPreview.image}
                        alt={templatesPreview.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover/doc:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 text-orange font-mono-code text-[10px] font-bold shadow-md">
                        Templates Pack (DOCX)
                      </span>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-bark/60 backdrop-blur-[1px] opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange text-white text-xs font-bold shadow-lg transform translate-y-1 group-hover/doc:translate-y-0 transition-transform">
                          <Maximize2 size={13} /> Click to Inspect
                        </span>
                      </div>
                    </div>

                    {/* Subtitle & Caption */}
                    <div className="pt-2 px-1 pointer-events-none">
                      <p className="text-[11px] font-bold text-[#F5EFE6] leading-tight truncate">
                        {templatesPreview.title}
                      </p>
                      <p className="text-[10px] text-[#D8C7B0] leading-snug mt-0.5 line-clamp-2">
                        {templatesPreview.caption}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Area: Pure vertical scroll, never blocks */}
                <div className="pt-4 mt-5 border-t border-bark/10 relative z-10 flex items-center justify-between text-xs font-mono-code" style={{ touchAction: 'pan-y' }}>
                  <button
                    type="button"
                    onClick={() => setActivePreview(templatesPreview)}
                    className="text-orange hover:text-orange-hover font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Inspect templates</span>
                    <ArrowRight size={13} />
                  </button>
                  <span className="text-wood-dark font-medium">12 Docs • Word &amp; Docs</span>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>

        {/* Mobile Pagination Indicator Dots */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-5">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-7 bg-orange'
                  : 'w-2 bg-bark/20 hover:bg-bark/40'
              }`}
              aria-label={`Jump to part ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* High-Resolution Document Lightbox Modal */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 bg-bark/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="bg-[#FBF6EC] max-w-3xl w-full rounded-2xl shadow-2xl border border-bark/20 overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-bark/10 flex items-center justify-between bg-sand/40">
              <div className="flex items-center gap-2.5">
                {getIcon(activePreview.category)}
                <div>
                  <h4 className="font-serif-display font-bold text-lg text-bark">
                    {activePreview.title}
                  </h4>
                  <span className="text-[11px] font-mono-code text-wood-dark block">
                    {activePreview.category} &bull; High-Resolution Preview
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1.5 rounded-lg text-bark hover:bg-sand focus:outline-none focus:ring-2 focus:ring-orange transition-colors cursor-pointer"
                aria-label="Close preview modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: High-Res Document Preview */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] flex flex-col items-center space-y-4 bg-[#24170E]/5">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-bark/20 max-w-2xl w-full bg-white">
                <img
                  src={activePreview.image}
                  alt={activePreview.title}
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="bg-sand/40 border border-wood/20 rounded-xl p-4 max-w-2xl w-full text-xs text-bark/85 space-y-1">
                <p className="font-bold text-bark">Deliverable Details:</p>
                <p className="leading-relaxed">{activePreview.caption}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-bark/10 bg-sand/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-forest font-bold">
                Included in Full Kit &bull; Instant Lifetime Download
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-bark/20 text-bark font-bold text-xs hover:bg-sand transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="#pricing"
                  onClick={() => {
                    setActivePreview(null);
                    if (onGetSystem) onGetSystem();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange hover:bg-orange-hover text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span>Get All Materials &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

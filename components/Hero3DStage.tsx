'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, FileSpreadsheet, FileText, ArrowRight, Sparkles } from 'lucide-react';

interface Hero3DStageProps {
  onGetSystem?: () => void;
}

export const Hero3DStage: React.FC<Hero3DStageProps> = ({ onGetSystem }) => {
  const [viewMode, setViewMode] = useState<'render' | 'interactive'>('render');
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!stageRef.current || viewMode !== 'interactive') return;
      const rect = stageRef.current.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const yPercent = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      // Subtle, controlled 3D tilt
      const clampX = Math.max(-1, Math.min(1, xPercent));
      const clampY = Math.max(-1, Math.min(1, yPercent));
      stageRef.current.style.transform = `rotateY(${clampX * 10}deg) rotateX(${-clampY * 10}deg)`;
    };

    const handleMouseLeave = () => {
      if (stageRef.current) {
        stageRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [viewMode]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-[540px] mx-auto py-2" style={{ perspective: '1400px' }}>
      
      {/* Mockup View Switcher */}
      <div className="mb-4 z-30 bg-white/80 backdrop-blur-md p-1 rounded-xl border border-bark/15 shadow-sm flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setViewMode('render')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            viewMode === 'render'
              ? 'bg-bark text-white shadow-sm'
              : 'text-wood-dark hover:text-bark'
          }`}
        >
          <span>📸 Studio 3D Render</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('interactive')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            viewMode === 'interactive'
              ? 'bg-bark text-white shadow-sm'
              : 'text-wood-dark hover:text-bark'
          }`}
        >
          <span>🎮 Interactive 3D Physics</span>
        </button>
      </div>

      {/* 1. Photorealistic 3D Studio Mockup (Render View) */}
      <div
        className={`${
          viewMode === 'render' ? 'block' : 'hidden'
        } relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 bg-[#160D08] transition-all duration-300`}
      >
        {/* Top Status Bar */}
        <div className="px-4 py-2.5 bg-black/60 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono-code text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Complete 3-Part System
            </span>
          </div>
          <span className="text-[10px] font-mono-code text-sand/70 uppercase">
            Playbook • Calculator • Scripts
          </span>
        </div>

        {/* 3D Render Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#160D08]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-3d-bundle.jpg"
            alt="The Stump Grinding Playbook 3-Part System"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            width={1200}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#160D08]/85 via-transparent to-transparent pointer-events-none" />

          {/* Floating Glass Pill with generous padding */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 text-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-orange" />
              <span className="font-bold text-sand text-[11px]">Beginner&apos;s Playbook + Quoting Engine + Scripts</span>
            </div>
            <span className="text-amber-400 font-mono-code font-bold text-[10px]">Instant Access</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive 3D Physics Stage (CSS 3D Parallax & Depth) */}
      <div
        className={`${
          viewMode === 'interactive' ? 'block' : 'hidden'
        } relative w-full h-[470px] transition-all duration-300 select-none`}
      >
        {/* Contact Shadow Ground Base */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-[#160D08]/30 rounded-[100%] blur-2xl transform scale-y-50 pointer-events-none" />

        <div
          ref={stageRef}
          className="relative w-full h-full transform-gpu transition-transform duration-200 ease-out"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* A. The Physical 3D Playbook (Tilted Spine, Layered Pages) */}
          <div className="book-3d absolute left-2 sm:left-4 top-6 w-60 h-80 sm:w-68 sm:h-92 rounded-r-xl rounded-l-sm bg-gradient-to-br from-[#291B12] via-[#1B110B] to-[#120B07] border-l-8 border-[#3D291C] p-5 text-white z-20 cursor-pointer">
            {/* Spine Fold */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/60 via-transparent to-white/10" />

            {/* 3D Layered Page Edges */}
            <div className="book-pages-edge" />

            {/* Embossed Golden Cover */}
            <div className="relative z-10 flex flex-col justify-between h-full border border-amber-500/25 rounded-lg p-4 bg-gradient-to-b from-white/5 to-transparent">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange animate-pulse" />
                  <span className="font-mono-code text-[10px] tracking-widest text-amber-300 uppercase font-bold">
                    52-PAGE MANUAL
                  </span>
                </div>

                <span className="font-mono-code text-[9px] uppercase tracking-widest text-[#E6D7C3]/60 block mb-1">
                  FIELD OPERATOR EDITION
                </span>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#FBF6EC] leading-tight">
                  The Stump Grinding Playbook
                </h3>
                <p className="text-xs text-amber-200/80 mt-1 font-medium italic">
                  Beginner Edition • 15 Chapters
                </p>
              </div>

              <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[10px] sm:text-[11px] text-[#E6D7C3]/75 font-mono-code">
                <span>SAFETY &amp; PRICING</span>
                <span className="text-[#E8731A] font-bold">US 811 READY</span>
              </div>
            </div>

            {/* Specular Light Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-r-xl" />
          </div>

          {/* B. The Sleek 3D Glass Tablet (Interactive Quoting Calculator Screen) */}
          <div className="tablet-3d absolute right-2 sm:right-0 top-12 w-60 h-76 sm:w-68 sm:h-88 rounded-[22px] bg-[#1A120B] p-3 border-2 border-white/20 shadow-2xl z-30 cursor-pointer">
            {/* Glass Screen */}
            <div className="relative w-full h-full rounded-[16px] bg-[#0E1712] overflow-hidden flex flex-col justify-between p-3.5 text-white border border-emerald-500/30">
              {/* Glossy diagonal reflection bar */}
              <div className="absolute -top-20 -left-20 w-80 h-40 bg-gradient-to-b from-white/15 to-transparent transform rotate-45 pointer-events-none" />

              {/* Calculator Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-emerald-900/50 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono-code text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Excel Engine
                  </span>
                </div>
                <span className="text-[10px] font-mono-code text-white/50">v2.4 PRO</span>
              </div>

              {/* Calculator Live Data */}
              <div className="relative z-10 space-y-2 my-auto">
                <div className="bg-black/40 rounded-lg p-2 border border-emerald-500/20 text-xs">
                  <div className="flex justify-between text-[10px] text-white/70">
                    <span>Diameter (Collar):</span>
                    <span className="font-mono-code text-emerald-300 font-bold">28 inches</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full w-3/5 rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                  <div className="bg-black/30 p-1.5 rounded border border-white/5">
                    <span className="text-white/60 block">Soil / Flare:</span>
                    <span className="font-bold text-amber-300">Heavy Flare (1.25x)</span>
                  </div>
                  <div className="bg-black/30 p-1.5 rounded border border-white/5">
                    <span className="text-white/60 block">Species:</span>
                    <span className="font-bold text-amber-300">White Oak Hard</span>
                  </div>
                </div>

                <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-lg p-2 text-center">
                  <span className="text-[9px] font-mono-code text-emerald-400 block uppercase tracking-wider">
                    Recommended Quote
                  </span>
                  <span className="font-serif-display text-2xl font-black text-white block">$340.00</span>
                  <span className="text-[9px] text-emerald-300/80">Est. Profit Kept: $275 (81%)</span>
                </div>
              </div>

              {/* Footer Tab indicator */}
              <div className="relative z-10 flex justify-between text-[8px] font-mono-code text-white/40 pt-1.5 border-t border-emerald-900/50">
                <span className="text-emerald-400">● Quote</span>
                <span>Settings</span>
                <span>JobProfit</span>
                <span>BreakEven</span>
              </div>
            </div>
          </div>

          {/* C. Floating 3D Stamp & Waiver Card */}
          <div className="absolute -bottom-1 left-8 sm:left-12 z-40 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-amber-900/15 shadow-[0_15px_30px_rgba(0,0,0,0.2)] transform -rotate-6 transition-transform hover:rotate-0 hover:scale-105 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange/15 text-orange flex items-center justify-center font-bold text-base">
                📄
              </div>
              <div>
                <span className="font-mono-code text-[9px] font-bold text-emerald-800 uppercase block">
                  12 Word / Docs Templates
                </span>
                <span className="font-serif-display font-bold text-xs text-bark">
                  Pre-Grind Liability Waiver
                </span>
              </div>
            </div>
          </div>

          {/* D. Miniature 3D Carbide Cutter Wheel Accent */}
          <div className="absolute -right-2 -bottom-2 z-40 w-16 h-16 rounded-full bg-gradient-to-tr from-[#1E2022] via-[#3A3F44] to-[#121416] p-1 shadow-2xl border border-white/20 transform rotate-12 transition-transform hover:rotate-45">
            <div className="w-full h-full rounded-full border border-dashed border-amber-400/60 flex items-center justify-center text-center">
              <span className="font-mono-code text-[7px] font-bold text-amber-300 uppercase leading-none">
                CARBIDE<br />TEETH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spec Strip & Primary Action with Generous Mobile Spacing */}
      <div className="mt-4 w-full bg-[#1B110B] p-4 sm:p-5 rounded-2xl border border-white/10 text-xs space-y-4 shadow-xl">
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="block font-bold text-sand text-[11px] sm:text-xs">Part 1</span>
            <span className="text-[10px] sm:text-[11px] text-sand/70">52-Pg Playbook</span>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="block font-bold text-sand text-[11px] sm:text-xs">Part 2</span>
            <span className="text-[10px] sm:text-[11px] text-sand/70">Pricing Sheet</span>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="block font-bold text-sand text-[11px] sm:text-xs">Part 3</span>
            <span className="text-[10px] sm:text-[11px] text-sand/70">12 Scripts</span>
          </div>
        </div>

        {/* CTA Button with generous breathing room (at least 16px vertical gap) */}
        <div className="pt-1 pb-1">
          <a
            href="#pricing"
            onClick={onGetSystem}
            className="w-full min-h-[54px] sm:min-h-[58px] py-4 px-4 sm:px-6 rounded-xl btn-3d-orange text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 text-center leading-normal cursor-pointer shadow-md"
          >
            <span>Get the Complete Beginner System</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/30 text-amber-200 font-extrabold text-xs sm:text-sm whitespace-nowrap shadow-inner">
              $121
            </span>
            <ArrowRight size={16} className="shrink-0 text-white ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

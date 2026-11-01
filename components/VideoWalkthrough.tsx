'use client';

import React, { useState } from 'react';
import { Play, Pause, CheckCircle2, Shield, ArrowRight, Volume2, Maximize2 } from 'lucide-react';
import { TreeRing } from './TreeRing';

export function VideoWalkthrough() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 bg-cream border-t border-bark/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-bold uppercase tracking-wider">
            <Play size={12} fill="#E8731A" />
            <span>90-Second Walkthrough</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
            See the Pricing Engine in Real Action
          </h2>
          <p className="text-bark/80 text-base leading-relaxed">
            Watch how a 24-inch White Oak with 8 feet of rock-heavy surface roots gets quoted in under 30 seconds with 100% margin protection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Video Player Mockup */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-bark/20 bg-bark">
              {/* Top Chrome Header */}
              <div className="bg-[#241A13] px-4 py-2.5 flex items-center justify-between border-b border-wood-dark/40 text-sand/70 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-sand/80">Stump-Pricing-Calculator-Demo.xlsx</span>
                </div>
                <span className="text-[11px] font-semibold text-orange">HD 1080p</span>
              </div>

              {/* Video Screen Content */}
              <div 
                className="relative aspect-video bg-[#1C140E] flex flex-col items-center justify-center p-6 cursor-pointer group"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {/* Background Blueprint / Sheet Preview */}
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#E8731A_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Simulated Spreadsheet Action View */}
                <div className="relative z-10 w-full max-w-lg bg-[#2E2017] rounded-xl p-4 border border-sand/15 shadow-inner text-sand font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-sand/10 pb-2">
                    <span className="text-orange font-bold">STUMP #1: WHITE OAK (BACKYARD)</span>
                    <span className="bg-forest/30 text-green-300 px-2 py-0.5 rounded text-[10px] font-bold">CALCULATED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Diameter at Grade: <span className="text-[#FBF6EC] font-bold">24 in</span></div>
                    <div>Root Flare Chase: <span className="text-[#FBF6EC] font-bold">+8 ft</span></div>
                    <div>Access / Gate Width: <span className="text-orange font-bold">&lt; 36 in (+$35)</span></div>
                    <div>Soil Condition: <span className="text-orange font-bold">Rocky / Tooth Wear</span></div>
                  </div>

                  <div className="bg-[#1C140E] rounded-lg p-3 flex items-center justify-between border border-orange/40">
                    <div>
                      <div className="text-[10px] text-sand/60 uppercase">Recommended Quote</div>
                      <div className="text-2xl font-serif font-bold text-orange">$345.00</div>
                    </div>
                    <div className="text-right text-[11px] text-sand/80">
                      <div>Fuel + Wear Buffer: <span className="text-green-400 font-bold">$42.50</span></div>
                      <div>Estimated Run-Time: <span className="text-[#FBF6EC] font-bold">45 min</span></div>
                    </div>
                  </div>
                </div>

                {/* Big Center Play Overlay Button */}
                <div className={`absolute inset-0 flex items-center justify-center bg-black/35 transition-opacity ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                  <div className="w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" fill="#FFFFFF" />}
                  </div>
                </div>

                {/* Bottom Timeline Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-center gap-3 text-sand text-[11px]">
                  <span className="text-orange font-bold">{isPlaying ? 'Playing...' : '0:34'}</span>
                  <div className="flex-1 h-1.5 bg-sand/30 rounded-full overflow-hidden">
                    <div className="h-full bg-orange rounded-full" style={{ width: isPlaying ? '75%' : '42%' }} />
                  </div>
                  <span>1:28</span>
                  <Volume2 size={16} className="text-sand/70" />
                  <Maximize2 size={16} className="text-sand/70" />
                </div>
              </div>
            </div>
          </div>

          {/* Key Walkthrough Takeaways */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-orange/15 text-orange flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-serif font-bold text-bark text-base">Diameter + Collar Measurement</h4>
                  <p className="text-xs text-bark/75 mt-0.5 leading-relaxed">
                    Shows you exactly how measuring ground-level root flares prevents giving away 45 minutes of free cutter wheel labor.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-forest/15 text-forest flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-serif font-bold text-bark text-base">Automatic Tooth Wear Buffer</h4>
                  <p className="text-xs text-bark/75 mt-0.5 leading-relaxed">
                    Input rocky soil, buried fences, or root sand. The sheet automatically builds tooth replacement costs into the final price.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-wood/20 text-wood-dark flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-serif font-bold text-bark text-base">Copy-Paste Client Text Quote</h4>
                  <p className="text-xs text-bark/75 mt-0.5 leading-relaxed">
                    Generate professional SMS and email bid text with 811 locate disclaimers to text directly to homeowners on site.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange hover:bg-orange-hover text-white text-sm font-bold shadow transition-all transform active:scale-95"
              >
                <span>Get the Exact Calculator Shown Above</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import { SITE_CONFIG, BeforeAfterItem } from '@/config/site';
import { SlidersHorizontal } from 'lucide-react';

interface SingleSliderProps {
  item: BeforeAfterItem;
}

const ComparisonCard: React.FC<SingleSliderProps> = ({ item }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div className="bg-[#FBF6EC] border border-bark/15 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
      <div>
        <h4 className="font-serif font-bold text-lg text-bark">{item.title}</h4>
        <p className="text-xs text-wood-dark mt-1 leading-relaxed">{item.description}</p>
      </div>

      {/* Comparison Container */}
      <div className="relative w-full h-72 sm:h-84 rounded-xl overflow-hidden select-none bg-[#1A120B] border border-bark/20 shadow-inner">
        {/* AFTER Image (Full container backdrop) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
          <img
            src={item.afterImage}
            alt={`${item.title} - After Grinding`}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded bg-black/80 text-forest-light font-mono text-[11px] font-bold uppercase tracking-wider shadow">
            After Grinding
          </span>
        </div>

        {/* BEFORE Image (Clipped dynamically based on slider position) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <img
            src={item.beforeImage}
            alt={`${item.title} - Before Grinding`}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded bg-orange text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow">
            Before Grinding
          </span>
        </div>

        {/* Divider Handle line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-white text-bark flex items-center justify-center shadow-xl border-2 border-orange/80">
            <SlidersHorizontal size={14} className="text-bark" />
          </div>
        </div>

        {/* Range slider input on top */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          aria-label="Drag to compare before and after photos"
        />
      </div>

      <p className="text-center text-[11px] font-mono text-wood font-medium">
        &larr; Drag slider to see Before &amp; After &rarr;
      </p>
    </div>
  );
};

export const BeforeAfter: React.FC = () => {
  const config = SITE_CONFIG.beforeAfter;

  if (!config || !config.enabled || !config.items || config.items.length === 0) {
    return null;
  }

  return (
    <section id="real-jobs" className="py-20 bg-cream border-t border-bark/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
            Field Results
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
            Real Jobs. Real Site Conditions.
          </h2>
          <p className="text-bark/80 text-base leading-relaxed">
            From root flare chasing to tight yard gate clearances, see how proper quoting and execution look on the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {config.items.map((item) => (
            <ComparisonCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

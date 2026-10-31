'use client';

import React, { useState } from 'react';
import { SITE_CONFIG, BeforeAfterItem } from '@/config/site';
import { SlidersHorizontal } from 'lucide-react';

interface SingleSliderProps {
  item: BeforeAfterItem;
}

const ComparisonCard: React.FC<SingleSliderProps> = ({ item }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [imageError, setImageError] = useState<{ before: boolean; after: boolean }>({
    before: false,
    after: false,
  });

  return (
    <div className="bg-sand/40 border border-bark/15 rounded-xl p-5 shadow-sm space-y-4">
      <div>
        <h4 className="font-serif font-bold text-lg text-bark">{item.title}</h4>
        <p className="text-xs text-wood-dark mt-1">{item.description}</p>
      </div>

      {/* Comparison Container */}
      <div className="relative w-full h-72 sm:h-80 rounded-lg overflow-hidden select-none bg-bark/10 border border-bark/20">
        {/* Placeholder or Real Image for AFTER */}
        <div className="absolute inset-0 w-full h-full">
          {imageError.after ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-forest/10 p-4 text-center">
              <span className="inline-block px-3 py-1 rounded bg-forest text-white text-xs font-bold uppercase tracking-wider mb-2">
                AFTER (Finished Job)
              </span>
              <p className="text-sm font-semibold text-bark">Your job photo here</p>
              <p className="text-xs text-wood mt-1">Place file in {item.afterImage}</p>
            </div>
          ) : (
            <img
              src={item.afterImage}
              alt={`${item.title} - After`}
              onError={() => setImageError((prev) => ({ ...prev, after: true }))}
              className="w-full h-full object-cover"
            />
          )}
          <span className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded bg-bark/80 text-white text-xs font-bold uppercase tracking-wider">
            After
          </span>
        </div>

        {/* Clip Container for BEFORE */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="relative w-full h-full min-w-[300px]">
            {imageError.before ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-wood/15 p-4 text-center">
                <span className="inline-block px-3 py-1 rounded bg-bark text-white text-xs font-bold uppercase tracking-wider mb-2">
                  BEFORE (Uncut Stump)
                </span>
                <p className="text-sm font-semibold text-bark">Your job photo here</p>
                <p className="text-xs text-wood mt-1">Place file in {item.beforeImage}</p>
              </div>
            ) : (
              <img
                src={item.beforeImage}
                alt={`${item.title} - Before`}
                onError={() => setImageError((prev) => ({ ...prev, before: true }))}
                className="w-full h-full object-cover"
                style={{ width: '100%', minWidth: '100%' }}
              />
            )}
            <span className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded bg-orange text-white text-xs font-bold uppercase tracking-wider">
              Before
            </span>
          </div>
        </div>

        {/* Divider Handle line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
          style={{ left: `calc(${sliderPos}% - 2px)` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-8 h-8 rounded-full bg-white text-bark flex items-center justify-center shadow-md border border-bark/20">
            <SlidersHorizontal size={16} />
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

      <p className="text-center text-[11px] text-wood font-medium">
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

'use client';

import React, { useState, useRef } from 'react';
import { SITE_CONFIG, BeforeAfterItem } from '@/config/site';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

interface SingleSliderProps {
  item: BeforeAfterItem;
}

const ComparisonCard: React.FC<SingleSliderProps> = ({ item }) => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div className="bg-[#FBF6EC] border border-bark/15 rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow space-y-4 w-full">
      <h4 className="font-serif font-bold text-lg sm:text-xl text-bark">{item.title}</h4>
      <p className="text-xs sm:text-sm text-wood-dark leading-relaxed">{item.description}</p>

      {/* Comparison Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden select-none bg-[#1A120B] border border-bark/20 shadow-inner">
        {/* AFTER Image (Full container backdrop) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
          <img
            src={item.afterImage}
            alt={`${item.title} - After Grinding`}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded bg-black/80 text-forest-light font-mono text-[11px] font-bold uppercase tracking-wider shadow">
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
          <span className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded bg-orange text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow">
            Before Grinding
          </span>
        </div>

        {/* Divider Handle line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-white text-bark flex items-center justify-center shadow-xl border-2 border-orange/80 animate-pulse-subtle">
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
        &larr; Drag slider left / right to compare Before &amp; After &rarr;
      </p>
    </div>
  );
};

export const BeforeAfter: React.FC = () => {
  const config = SITE_CONFIG.beforeAfter;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!config || !config.enabled || !config.items || config.items.length === 0) {
    return null;
  }

  const items = config.items;

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const targetChild = container.children[index] as HTMLElement;
    if (targetChild) {
      container.scrollTo({
        left: targetChild.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollTo(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < items.length - 1) {
      scrollTo(activeIndex + 1);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollPos = container.scrollLeft;
    let closestIndex = 0;
    let minDiff = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const el = child as HTMLElement;
      const diff = Math.abs(el.offsetLeft - container.offsetLeft - scrollPos);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  };

  return (
    <section id="real-jobs" className="py-20 bg-cream border-t border-bark/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
          <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
            Field Results Gallery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
            Real Jobs. Real Site Conditions.
          </h2>
          <p className="text-bark/80 text-base leading-relaxed">
            Swipe or use the navigation arrows to inspect different field conditions. Every case is captured from the exact same camera angle.
          </p>
        </div>

        {/* Carousel with Side Arrow Navigation */}
        <div className="relative max-w-3xl mx-auto">
          {/* Left Side Arrow Button (only shown when not on the first scenario) */}
          {activeIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-cream/95 backdrop-blur-sm border-2 border-bark/25 hover:border-orange hover:bg-orange hover:text-white text-bark shadow-xl flex items-center justify-center transition-all duration-200 active:scale-90 focus:outline-none cursor-pointer"
              aria-label="Previous field job scenario"
              title="Previous job scenario"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right Side Arrow Button (only shown when not on the last scenario) */}
          {activeIndex < items.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-cream/95 backdrop-blur-sm border-2 border-bark/25 hover:border-orange hover:bg-orange hover:text-white text-bark shadow-xl flex items-center justify-center transition-all duration-200 active:scale-90 focus:outline-none cursor-pointer"
              aria-label="Next field job scenario"
              title="Next job scenario"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Swipeable Carousel Track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 pb-2 no-scrollbar px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="w-full flex-shrink-0 snap-center"
              >
                <ComparisonCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => scrollTo(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-8 bg-orange'
                  : 'w-2.5 bg-bark/20 hover:bg-bark/40'
              }`}
              aria-label={`Jump to scenario ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { ProductTier } from '@/config/products';

interface StickyMobileCtaProps {
  onSelectProduct: (tier: ProductTier) => void;
  featuredTier: ProductTier;
}

export const StickyMobileCta: React.FC<StickyMobileCtaProps> = ({
  onSelectProduct,
  featuredTier,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF6EC]/95 backdrop-blur-md border-t border-bark/15 p-3.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange">
            Beginner System (Full Kit)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-bold text-lg text-bark">
              ${featuredTier.price}
            </span>
            {featuredTier.regularPrice && (
              <span className="text-xs line-through text-bark/50">
                ${featuredTier.regularPrice}
              </span>
            )}
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange/15 text-orange">
              Save $33
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectProduct(featuredTier)}
          className="flex-1 py-3 px-4 rounded-xl bg-orange hover:bg-orange-hover text-white font-bold text-sm text-center shadow-md active:scale-95 transition-transform btn-shimmer"
        >
          Get the Beginner System &rarr;
        </button>
      </div>
    </div>
  );
};

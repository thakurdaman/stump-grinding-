'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { Eye, X, FileText, Table, CheckSquare } from 'lucide-react';

export const PreviewGallery: React.FC = () => {
  const [activePreview, setActivePreview] = useState<(typeof SITE_CONFIG.previews)[0] | null>(null);

  const getIcon = (category: string) => {
    if (category.includes('PDF')) return <FileText className="text-orange" size={24} />;
    if (category.includes('Calculator')) return <Table className="text-forest" size={24} />;
    return <CheckSquare className="text-wood" size={24} />;
  };

  return (
    <section id="previews" className="py-20 bg-sand/30 border-t border-bark/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-wood-dark font-sans">
            Inside the Materials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
            See Exactly What You Are Getting
          </h2>
          <p className="text-bark/80 text-base leading-relaxed">
            No vague promises or generic theory. Clean, formatted documents ready to print or load onto your phone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SITE_CONFIG.previews.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePreview(item)}
              className="bg-[#FBF6EC] border border-bark/15 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-orange transition-all cursor-pointer group flex flex-col"
            >
              {/* Document Preview Thumbnail */}
              <div className="h-56 bg-sand/60 relative border-b border-bark/10 overflow-hidden flex items-center justify-center p-6">
                <div className="w-full h-full border border-dashed border-wood/40 rounded-lg flex flex-col items-center justify-center text-center p-4 bg-white/70 group-hover:scale-102 transition-transform">
                  <div className="mb-2">{getIcon(item.category)}</div>
                  <span className="text-xs font-bold uppercase tracking-wider text-bark">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-wood mt-1">Click to inspect preview</span>
                </div>
                <div className="absolute inset-0 bg-bark/0 group-hover:bg-bark/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bark text-sand text-xs font-bold shadow">
                    <Eye size={14} /> Open Preview
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-bark mb-2 group-hover:text-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-bark/70 leading-relaxed">{item.caption}</p>
                </div>
                <span className="text-xs font-bold text-orange mt-4 inline-flex items-center gap-1">
                  View full preview &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 bg-bark/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="bg-[#FBF6EC] max-w-2xl w-full rounded-2xl shadow-2xl border border-bark/20 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-bark/10 flex items-center justify-between bg-sand/40">
              <div className="flex items-center gap-2">
                {getIcon(activePreview.category)}
                <h4 className="font-serif font-bold text-lg text-bark">
                  {activePreview.title}
                </h4>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1 rounded-md text-bark hover:bg-sand focus:outline-none focus:ring-2 focus:ring-orange"
                aria-label="Close preview modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="bg-sand/30 border border-wood/20 rounded-xl p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-sand mx-auto flex items-center justify-center">
                  {getIcon(activePreview.category)}
                </div>
                <h5 className="font-serif font-bold text-xl text-bark">{activePreview.title}</h5>
                <p className="text-sm text-bark/80 max-w-md mx-auto">{activePreview.caption}</p>
                <div className="pt-4 border-t border-wood/20 text-xs text-wood font-medium">
                  Add custom screenshot to <code>{activePreview.image}</code> to show high-resolution document pages.
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-bark/10 bg-sand/30 flex justify-end">
              <button
                onClick={() => setActivePreview(null)}
                className="px-5 py-2 rounded-lg bg-bark text-sand font-bold text-sm hover:bg-wood-dark transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

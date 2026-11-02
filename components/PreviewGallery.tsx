'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { Eye, X, FileText, Table, CheckSquare, Download, Maximize2 } from 'lucide-react';

export const PreviewGallery: React.FC = () => {
  const [activePreview, setActivePreview] = useState<(typeof SITE_CONFIG.previews)[0] | null>(null);

  const getIcon = (category: string) => {
    if (category.includes('PDF')) return <FileText className="text-orange" size={20} />;
    if (category.includes('Calculator') || category.includes('XLSX')) return <Table className="text-forest" size={20} />;
    return <CheckSquare className="text-wood" size={20} />;
  };

  return (
    <section id="previews" className="py-20 bg-sand/30 border-t border-bark/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
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

        {/* 3 Material Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SITE_CONFIG.previews.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePreview(item)}
              className="bg-[#FBF6EC] border border-bark/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-orange transition-all duration-200 cursor-pointer group flex flex-col"
            >
              {/* Document Preview Image Thumbnail */}
              <div className="h-64 sm:h-72 bg-[#20140B] relative border-b border-bark/15 overflow-hidden flex items-center justify-center p-3 select-none">
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md border border-sand/20 bg-white group-hover:scale-102 transition-transform duration-300">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Category Pill Tag */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/85 text-orange font-mono text-[10px] font-bold shadow-md">
                    {item.category}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-bark/50 backdrop-blur-[1px] transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange text-white text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                    <Maximize2 size={14} /> Click to Inspect Document
                  </span>
                </div>
              </div>

              {/* Card Description */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-bark mb-2 group-hover:text-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-bark/70 leading-relaxed font-sans">{item.caption}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-bark/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-orange inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inspect document pages &rarr;
                  </span>
                  <span className="text-[11px] font-mono text-wood font-medium">Ready to use</span>
                </div>
              </div>
            </div>
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
              <div className="flex items-center gap-2">
                {getIcon(activePreview.category)}
                <div>
                  <h4 className="font-serif font-bold text-lg text-bark">
                    {activePreview.title}
                  </h4>
                  <span className="text-[11px] font-mono text-wood-dark block">
                    {activePreview.category} &bull; High-Resolution Preview
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1.5 rounded-lg text-bark hover:bg-sand focus:outline-none focus:ring-2 focus:ring-orange transition-colors"
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
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-bark/20 text-bark font-bold text-xs hover:bg-sand transition-colors"
                >
                  Close
                </button>
                <a
                  href="#pricing"
                  onClick={() => setActivePreview(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange hover:bg-orange-hover text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-colors"
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

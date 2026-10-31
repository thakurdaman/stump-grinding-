'use client';

import React, { useState } from 'react';
import { FAQS } from '@/config/faqs';
import { ChevronDown } from 'lucide-react';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-[#FBF6EC] border-t border-bark/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
            Clear Answers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-bark/80 text-base leading-relaxed">
            Straightforward answers so you know exactly how this works before you buy.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-bark/15 rounded-xl bg-sand/30 overflow-hidden transition-colors hover:border-wood"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-orange"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-bark">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`text-bark shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange' : ''
                    }`}
                    size={20}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-6 pb-6 pt-1 text-sm sm:text-base text-bark/85 leading-relaxed border-t border-bark/5"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { Star, ShieldCheck, Wrench, Quote } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  equipment: string;
  highlight: string;
  quote: string;
  verifiedOperator: boolean;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'dan-m',
    name: 'Dan Miller',
    role: 'Owner, Miller Tree & Stump',
    location: 'Canton, OH',
    equipment: 'Vermeer SC30TX',
    highlight: 'Added $1,250 to my first weekend',
    quote:
      'I used to eyeball every stump and guess $80 to $100. My first weekend using the root flare formula, I quoted a 32-inch White Oak with 8ft of surface roots at $340. The homeowner signed without blinking. The calculator paid for itself on day two.',
    verifiedOperator: true,
  },
  {
    id: 'marcus-v',
    name: 'Marcus Vance',
    role: 'Operator, Apex Timber & Clearing',
    location: 'Dallas, TX',
    equipment: 'Carlton SP4012',
    highlight: 'Waiver saved me from a $1,400 repair dispute',
    quote:
      'The pre-job hazard checklist and property damage waiver alone are worth ten times the price. A client claimed I tore up an unmarked private irrigation pipe—pointed straight to the signed pre-grind walkthrough waiver. Completely protected.',
    verifiedOperator: true,
  },
  {
    id: 'cody-h',
    name: 'Cody Henderson',
    role: 'Founder, Solo Stump Works',
    location: 'Savannah, GA',
    equipment: 'Bandit SG-40',
    highlight: 'Landed 6 subcontractor jobs in week one',
    quote:
      'Bought my first grinder 3 months ago with zero tree connections. I used the exact partner outreach script from the templates pack for local arborist crews. Landed 6 subcontracted stump jobs in my very first week. Best $97 I spent starting out.',
    verifiedOperator: true,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#FBF6EC] border-t border-bark/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-forest font-sans">
            Real US Operators
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
            Field-Tested on Real Jobs Across America
          </h2>
          <p className="text-bark/80 text-base leading-relaxed">
            See how solo operators and commercial tree care crews use these tools to protect their cutter teeth, avoid underbidding, and book profitable work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-sand/30 border border-bark/15 hover:border-wood rounded-2xl p-7 flex flex-col justify-between shadow-sm transition-all duration-200 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-orange">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#E8731A" stroke="none" />
                    ))}
                  </div>
                  {item.verifiedOperator && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={13} />
                      <span>Verified Operator</span>
                    </span>
                  )}
                </div>

                {/* Highlight callout */}
                <p className="font-serif font-bold text-bark text-base leading-snug">
                  &ldquo;{item.highlight}&rdquo;
                </p>

                {/* Quote body */}
                <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                  {item.quote}
                </p>
              </div>

              {/* Author footer & equipment info */}
              <div className="pt-6 mt-6 border-t border-bark/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-bark text-sm">{item.name}</h4>
                    <p className="text-[11px] text-wood-dark">{item.role}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-bark/60">{item.location}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-orange/90 bg-sand/60 px-2.5 py-1 rounded-md border border-bark/5">
                  <Wrench size={12} className="shrink-0" />
                  <span>Equipment: {item.equipment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

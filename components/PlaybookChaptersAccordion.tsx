import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Check } from 'lucide-react';

interface ChapterGroup {
  stage: string;
  badge: string;
  chapters: string[];
}

const CHAPTER_GROUPS: ChapterGroup[] = [
  {
    stage: 'Prove it',
    badge: 'Stage 1',
    chapters: [
      '1. How Stump Grinding Makes Money',
      '2. Prove the Idea for Under $100',
    ],
  },
  {
    stage: 'Set up',
    badge: 'Stage 2',
    chapters: [
      '3. Set Up the Business (Banking, Licensing, COI)',
      '4. Equipment and Startup Costs (Rent vs. Buy)',
      '5. Safety & Call 811 Utility Locate Protocols',
    ],
  },
  {
    stage: 'Price it',
    badge: 'Stage 3',
    chapters: [
      '6. Price It for Profit: Base Inching, Root Flare & Obstacle Multipliers',
    ],
  },
  {
    stage: 'Get customers',
    badge: 'Stage 4',
    chapters: [
      '7. Land Your First Jobs: The Contractor Outreach System',
      '8. More Ways to Get Customers (Google Business Profile & Inbound)',
    ],
  },
  {
    stage: 'Win and do the job',
    badge: 'Stage 5',
    chapters: [
      '9. Quoting and Selling on Site',
      '10. Doing the Job: Grinding Below Grade & Lawn Protection',
      '11. Upsells and Repeat Business (Topsoil, Seed, Partner Crews)',
    ],
  },
  {
    stage: 'Grow',
    badge: 'Stage 6',
    chapters: [
      '12. Systems, Scaling, and Going Full-Time',
    ],
  },
  {
    stage: 'Launch',
    badge: 'Stage 7',
    chapters: [
      '13. Your First Paid Job in 7 Days, and Your 30-Day Plan',
      '14. Running the Numbers: A Worked Example',
    ],
  },
  {
    stage: 'Answers',
    badge: 'Stage 8',
    chapters: [
      '15. Common Questions and Beginner Mistakes',
    ],
  },
];

export const PlaybookChaptersAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-2.5 pt-2">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-wood-dark">
          15 Chapters Grouped by Stage:
        </span>
        <button
          type="button"
          onClick={() => setOpenIndex(openIndex === -1 ? 0 : -1)}
          className="text-[11px] font-semibold text-orange hover:underline"
        >
          {openIndex === -1 ? 'Expand first' : 'Collapse all'}
        </button>
      </div>

      <div className="space-y-2">
        {CHAPTER_GROUPS.map((group, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={group.stage}
              className="border border-bark/15 rounded-xl bg-white/70 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-sand/40 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-sand text-wood-dark border border-bark/10">
                    {group.badge}
                  </span>
                  <span className="font-serif font-bold text-xs sm:text-sm text-bark">
                    {group.stage}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp size={15} className="text-bark/60 shrink-0" />
                ) : (
                  <ChevronDown size={15} className="text-bark/60 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-3.5 pb-3 pt-1 border-t border-bark/10 bg-sand/20 space-y-1.5 text-xs text-bark/85">
                  {group.chapters.map((ch) => (
                    <div key={ch} className="flex items-start gap-2">
                      <Check size={14} className="text-forest shrink-0 mt-0.5" />
                      <span>{ch}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

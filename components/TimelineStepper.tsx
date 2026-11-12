'use client';

import React from 'react';
import { 
  Calendar, 
  ShieldCheck, 
  Calculator, 
  MessageSquare, 
  Camera, 
  Wrench, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { TiltCard } from './TiltCard';

interface Step {
  stepNumber: string;
  timing: string;
  badge: string;
  title: string;
  description: string;
  deliverable: string;
  icon: React.ReactNode;
  isSpecial?: boolean;
}

const STEPS: Step[] = [
  {
    stepNumber: '00',
    timing: 'Before Day 1',
    badge: 'Optional Validation',
    title: 'Test demand for under $100',
    description: 'Before you purchase or lease machinery, test demand in your town with simple validation posts and photo inquiries to confirm local volume.',
    deliverable: 'Chapter 2 Validation Checklist',
    icon: <Sparkles size={20} className="text-orange" />,
  },
  {
    stepNumber: '01',
    timing: 'Day 1',
    badge: 'Legal & Foundation',
    title: 'Insurance, banking & certificate',
    description: 'Set up your dedicated business checking account, secure general liability insurance with inland marine tool protection, and have your Certificate of Insurance (COI) ready.',
    deliverable: 'Chapter 3 Setup Protocol & COI Sheet',
    icon: <ShieldCheck size={20} className="text-forest" />,
  },
  {
    stepNumber: '02',
    timing: 'Days 2–3',
    badge: 'Pricing & Visibility',
    title: 'Set your rates & Google Business Profile',
    description: 'Calibrate the spreadsheet calculator to your local fuel, machine, and hourly targets. Publish and verify your free Google Business Profile for local map search.',
    deliverable: 'Excel Calculator & Settings Tab',
    icon: <Calculator size={20} className="text-wood-dark" />,
  },
  {
    stepNumber: '04',
    timing: 'Days 4–5',
    badge: 'Contractor Outreach',
    title: 'Send 10 partner messages to tree crews',
    description: 'Send copy-and-send partnership scripts to local tree services and landscape crews who hate hauling their own stump grinders, then follow up.',
    deliverable: 'Arborist & Contractor Outreach Word Scripts',
    icon: <MessageSquare size={20} className="text-orange" />,
  },
  {
    stepNumber: '06',
    timing: 'Day 6',
    badge: 'Quoting & 811',
    title: 'Quote from photos & call 811 first',
    description: 'Provide written quotes using photo submissions (measuring collar to collar), schedule your first job, and place the mandatory free 811 utility locate ticket.',
    deliverable: 'Quote Template & 811 Utility Locate Protocol',
    icon: <Camera size={20} className="text-forest" />,
  },
  {
    stepNumber: '07',
    timing: 'Day 7',
    badge: 'First Field Job',
    title: 'Complete the job & ask for a review',
    description: 'Walk the yard with the pre-job safety checklist, grind 8–12 inches below lawn grade, backfill with mulch chips, clean the site, and collect a 5-star review.',
    deliverable: 'Pre-Job Walkthrough & Review Request Text Script',
    icon: <Wrench size={20} className="text-white" />,
    isSpecial: true,
  },
  {
    stepNumber: '30',
    timing: 'Day 30',
    badge: 'Review & Refine',
    title: 'Log jobs, analyze profit & partner follow-ups',
    description: 'Review your 30-day job profit numbers, adjust inch-rates for tricky wood species, and follow up with every tree partner for recurring monthly referrals.',
    deliverable: '30-Day Action Plan & JobProfit Tracking Sheet',
    icon: <TrendingUp size={20} className="text-forest" />,
  },
];

export const TimelineStepper: React.FC = () => {
  return (
    <section id="path" className="py-20 sm:py-28 bg-[#F4EFE6] border-b border-bark/10 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-embossed border border-wood/30 text-bark text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
            <span className="font-mono-code text-[11px] font-bold text-wood-dark">Action Sequence</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-bark tracking-tight">
            Your Path: Day 1, Day 7, Day 30
          </h2>
          <p className="text-bark/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            The concrete sequence inside the beginner system. Step-by-step instructions so you never guess what to tackle next.
          </p>
        </div>

        {/* 3D Vertical Stepper */}
        <div className="relative">
          {/* Central Connecting 3D Depth Rod */}
          <div className="hidden sm:block absolute left-9 top-8 bottom-8 w-1 bg-gradient-to-b from-orange via-wood to-forest rounded-full shadow-[0_0_12px_rgba(232,115,26,0.3)]" />

          <div className="space-y-6 sm:space-y-8">
            {STEPS.map((step) => {
              const isSpecial = step.isSpecial;

              return (
                <div
                  key={step.timing}
                  className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 group"
                >
                  {/* 3D Step Node */}
                  <div className="flex items-center gap-3 sm:block shrink-0 z-10">
                    <div
                      className={`w-14 h-14 sm:w-18 sm:h-18 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
                        isSpecial
                          ? 'bg-gradient-to-br from-[#FA8A32] to-[#D4620B] text-white border-2 border-white/60 shadow-[0_10px_25px_rgba(232,115,26,0.5)] scale-105'
                          : 'bg-white/95 text-bark border-2 border-bark/15 shadow-[0_8px_20px_rgba(33,21,15,0.08)] group-hover:border-orange/50 group-hover:shadow-md'
                      }`}
                    >
                      <span className={`font-mono-code text-xs font-black tracking-wider ${isSpecial ? 'text-white' : 'text-orange'}`}>
                        {step.stepNumber}
                      </span>
                      <div className="mt-0.5">{step.icon}</div>
                    </div>

                    <div className="sm:hidden flex items-center gap-2">
                      <span className="text-xs font-mono-code font-bold uppercase text-orange">
                        {step.timing}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sand/60 text-wood-dark border border-bark/10">
                        {step.badge}
                      </span>
                    </div>
                  </div>

                  {/* 3D Card Box */}
                  <TiltCard
                    maxTilt={3}
                    className={`flex-1 rounded-2xl p-5 sm:p-7 transition-all duration-300 ${
                      isSpecial
                        ? 'bg-gradient-to-r from-white via-orange/5 to-white border-2 border-orange/40 shadow-xl ring-2 ring-orange/15'
                        : 'bg-white/90 border border-bark/15 shadow-sm hover:border-wood/40'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="hidden sm:flex items-center gap-3">
                        <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-orange">
                          {step.timing}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sand text-wood-dark border border-bark/10">
                          {step.badge}
                        </span>
                      </div>

                      <h3 className="font-serif-display font-bold text-lg sm:text-xl text-bark">
                        {step.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-bark/85 leading-relaxed font-sans">
                        {step.description}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs font-mono-code font-semibold text-forest">
                        <CheckCircle2 size={15} className="shrink-0 text-forest" />
                        <span>Deliverable: {step.deliverable}</span>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 text-center text-xs text-wood-dark font-sans">
          <em>Note: Outlined as the recommended operational curriculum inside the materials. Not a representation of guaranteed financial earnings.</em>
        </div>
      </div>
    </section>
  );
};

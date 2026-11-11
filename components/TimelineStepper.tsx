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
  AlertCircle
} from 'lucide-react';

interface Step {
  timing: string;
  badge: string;
  title: string;
  description: string;
  deliverable: string;
  icon: React.ReactNode;
  isOptional?: boolean;
}

const STEPS: Step[] = [
  {
    timing: 'Before Day 1',
    badge: 'Optional Validation',
    title: 'Test demand for under $100',
    description: 'Before you purchase or lease machinery, test demand in your town with simple validation posts and photo inquiries to confirm local volume.',
    deliverable: 'Chapter 2 Validation Checklist',
    icon: <Sparkles size={20} className="text-orange" />,
    isOptional: true,
  },
  {
    timing: 'Day 1',
    badge: 'Legal & Foundation',
    title: 'Insurance, banking & certificate',
    description: 'Set up your dedicated business checking account, secure general liability insurance with inland marine tool protection, and have your Certificate of Insurance (COI) ready.',
    deliverable: 'Chapter 3 Setup Protocol & COI Sheet',
    icon: <ShieldCheck size={20} className="text-forest" />,
  },
  {
    timing: 'Days 2–3',
    badge: 'Pricing & Visibility',
    title: 'Set your rates & Google Business Profile',
    description: 'Calibrate the spreadsheet calculator to your local fuel, machine, and hourly targets. Publish and verify your free Google Business Profile for local map search.',
    deliverable: 'Excel Calculator & Settings Tab',
    icon: <Calculator size={20} className="text-wood-dark" />,
  },
  {
    timing: 'Days 4–5',
    badge: 'Contractor Outreach',
    title: 'Send 10 partner messages to tree crews',
    description: 'Send copy-and-send partnership scripts to local tree services and landscape crews who hate hauling their own stump grinders, then follow up.',
    deliverable: 'Arborist & Contractor Outreach Word Scripts',
    icon: <MessageSquare size={20} className="text-orange" />,
  },
  {
    timing: 'Day 6',
    badge: 'Quoting & 811',
    title: 'Quote from photos & call 811 first',
    description: 'Provide written quotes using photo submissions (measuring collar to collar), schedule your first job, and place the mandatory free 811 utility locate ticket.',
    deliverable: 'Quote Template & 811 Utility Locate Protocol',
    icon: <Camera size={20} className="text-forest" />,
  },
  {
    timing: 'Day 7',
    badge: 'First Field Job',
    title: 'Complete the job & ask for a review',
    description: 'Walk the yard with the pre-job safety checklist, grind 8–12 inches below lawn grade, backfill with mulch chips, clean the site, and collect a 5-star review.',
    deliverable: 'Pre-Job Walkthrough & Review Request Text Script',
    icon: <Wrench size={20} className="text-wood-dark" />,
  },
  {
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
    <section id="path" className="py-20 sm:py-24 bg-[#FBF6EC] border-b border-bark/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand border border-wood/30 text-bark text-xs font-bold uppercase tracking-wider">
            <Calendar size={14} className="text-orange" />
            <span>The Plan Inside</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-bark tracking-tight">
            Your Path: Day 1, Day 7, Day 30
          </h2>
          <p className="text-bark/80 text-sm sm:text-base leading-relaxed">
            The exact sequence inside the beginner system. Step-by-step instructions designed so you never guess what to tackle next.
          </p>
        </div>

        {/* Stepper Timeline */}
        <div className="relative">
          {/* Vertical Connecting Line (desktop/tablet) */}
          <div className="hidden sm:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-orange via-forest to-wood-dark/40" />

          <div className="space-y-6 sm:space-y-8">
            {STEPS.map((step, idx) => (
              <div
                key={step.timing}
                className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-6 bg-white/80 border border-bark/15 rounded-2xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Step Icon / Dot */}
                <div className="flex items-center gap-3 sm:block">
                  <div className="w-12 h-12 rounded-xl bg-sand/80 border border-bark/15 flex items-center justify-center shrink-0 z-10 shadow-sm">
                    {step.icon}
                  </div>
                  <div className="sm:hidden flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-orange">
                      {step.timing}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sand/60 text-wood-dark border border-bark/10">
                      {step.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="hidden sm:flex items-center gap-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange">
                      {step.timing}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sand text-wood-dark border border-bark/10">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-bark">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-bark/85 leading-relaxed font-sans">
                    {step.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-medium text-forest font-sans">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>Reference: {step.deliverable}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 text-center text-xs text-wood-dark">
          <em>Note: Outlined as the recommended operational curriculum inside the materials. Not a representation of guaranteed financial earnings.</em>
        </div>
      </div>
    </section>
  );
};

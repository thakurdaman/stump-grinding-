export interface BeforeAfterItem {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://stump-grinding-playbook.vercel.app';
};

export const SITE_CONFIG = {
  name: 'The Stump Grinding Playbook',
  shortName: 'Stump Playbook',
  title: 'The Stump Grinding Playbook — How to Price, Find, and Grind Stumps Profitably',
  description:
    'A practical, no-fluff guide, pricing calculator, and business templates pack for US stump grinding operators and tree care professionals.',
  url: getSiteUrl(),
  supportEmail: process.env.SUPPORT_EMAIL || 'support@stumpgrindingplaybook.com',
  guaranteeDays: 14,
  disclaimer:
    'Educational material. Not legal, tax, insurance, or safety advice. Prices in the calculator are starting points, not market guarantees. Results depend on your market and effort.',
  
  // Real jobs before/after gallery configuration
  beforeAfter: {
    enabled: true,
    items: [
      {
        id: 'job-1',
        title: '36-inch White Oak Stump (Tight Backyard Access)',
        description: 'Ground 8 inches below grade, lawn preserved with track mats. Quoted in 10 minutes using the calculator.',
        beforeImage: '/images/before-oak.jpg',
        afterImage: '/images/after-oak.jpg',
      },
      {
        id: 'job-2',
        title: 'Surface Root Flare & Hardwood Stump Grinding',
        description: 'Challenging rock-heavy soil with extended surface roots. Root flare ground below grade with clean mulch backfill.',
        beforeImage: '/images/spartanburg-before.jpg',
        afterImage: '/images/spartanburg-after.jpg',
      },
      {
        id: 'job-3',
        title: 'Backyard Fence Line & Boundary Clearance',
        description: 'Large stump located right against residential boundary. Precision cutter wheel control with zero fence contact.',
        beforeImage: '/images/anderson-before.jpg',
        afterImage: '/images/anderson-after.jpg',
      },
      {
        id: 'job-4',
        title: 'Open Lawn Clean Grind & Re-Grading Prep',
        description: 'Deep root grind on residential lawn. Cavity raked flush and leveled with pulverized mulch, ready for topsoil and grass seed.',
        beforeImage: '/images/simpsonville-before.jpg',
        afterImage: '/images/simpsonville-after.jpg',
      },
    ] as BeforeAfterItem[],
  },

  // Document previews gallery
  previews: [
    {
      id: 'playbook-preview',
      title: 'Playbook: Utility Locates & Safety Rules',
      category: 'Playbook (PDF)',
      image: '/images/preview-playbook.png',
      caption: 'Clear step-by-step 811 protocols, pre-grind hazard checks, and tooth wear management.',
    },
    {
      id: 'calculator-preview',
      title: 'Excel Calculator: Multi-Stump Quote Engine',
      category: 'Pricing Calculator (XLSX)',
      image: '/images/preview-calculator.png',
      caption: 'Dynamic calculations for diameter, root flares, slopes, gate widths, and rock factors.',
    },
    {
      id: 'templates-preview',
      title: 'Templates: Service Agreement & Inspection Sheet',
      category: 'Templates Pack (DOCX)',
      image: '/images/preview-templates.png',
      caption: 'Ready-to-print pre-job walkthroughs, client waiver clauses, and follow-up review texts.',
    },
  ],
};

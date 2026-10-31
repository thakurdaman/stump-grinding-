export interface ProductFile {
  id: string;
  name: string;
  filename: string;
  format: 'PDF' | 'Excel' | 'Word';
  sizeApprox: string;
  description: string;
}

export const PRODUCT_FILES: Record<string, ProductFile> = {
  playbook: {
    id: 'playbook',
    name: 'The Stump Grinding Playbook',
    filename: 'The-Stump-Grinding-Playbook.pdf',
    format: 'PDF',
    sizeApprox: '4.2 MB',
    description: '30+ page operational guide covering insurance, equipment, utility locates, quoting, job execution, and safety.',
  },
  calculator: {
    id: 'calculator',
    name: 'Stump Grinding Pricing & Business Calculator',
    filename: 'Stump-Grinding-Pricing-Calculator.xlsx',
    format: 'Excel',
    sizeApprox: '1.8 MB',
    description: 'Dynamic spreadsheet (Excel & Google Sheets compatible) to quote up to 8 stumps with terrain, flare, and rock adjustments.',
  },
  templates: {
    id: 'templates',
    name: 'Templates & Scripts Pack (12 Ready-To-Use Files)',
    filename: 'Stump-Grinding-Templates-and-Scripts-Pack.docx',
    format: 'Word',
    sizeApprox: '950 KB',
    description: 'Quotes, invoices, service agreement, safety checklists, cold call/text scripts, and referral outreach messages.',
  },
};

export interface ProductTier {
  id: string;
  name: string;
  tagline: string;
  price: number;
  regularPrice?: number;
  badge?: string;
  isPopular?: boolean;
  fileIds: string[];
  description: string;
  features: string[];
  buttonText: string;
}

export const PRODUCTS: ProductTier[] = [
  {
    id: 'playbook-only',
    name: 'Playbook Only',
    tagline: 'The complete foundational guide for starting and running stump jobs.',
    price: 47,
    fileIds: ['playbook'],
    description: 'The definitive 30+ page field manual on equipment, insurance, pricing structure, marketing, and safety.',
    features: [
      'The Stump Grinding Playbook (PDF, 30+ pages)',
      'Equipment breakdown: tow-behind vs self-propelled vs walk-behind',
      'Insurance & 811 utility locate procedures',
      'Base pricing formula with worked math example',
      'Quoting, upselling, and 30-day kickoff plan',
      'Instant download & free lifetime updates',
    ],
    buttonText: 'Get the Playbook ($47)',
  },
  {
    id: 'calculator-templates',
    name: 'Calculator + Templates',
    tagline: 'For operators who already know the basics and need plug-and-play tools.',
    price: 67,
    fileIds: ['calculator', 'templates'],
    description: 'The Excel pricing engine plus all 12 operational contracts, checklists, and client communication scripts.',
    features: [
      'Pricing & Business Calculator (Excel / Google Sheets)',
      'Quote up to 8 stumps per job with soil, flare & slope factors',
      'Break-even and hourly profit margin calculator',
      '12 Word Templates & Scripts (Quotes, Agreements, Invoices)',
      'Pre-job & daily equipment safety inspection checklists',
      'Door hanger copy, 10 social posts, and referral scripts',
    ],
    buttonText: 'Get Calculator + Templates ($67)',
  },
  {
    id: 'full-kit',
    name: 'Full Kit',
    tagline: 'Everything you need to price accurately, work safely, and stay profitable.',
    price: 97,
    regularPrice: 114,
    badge: 'Best Value — Save $17',
    isPopular: true,
    fileIds: ['playbook', 'calculator', 'templates'],
    description: 'The Playbook, the Pricing Calculator, and all 12 operational templates. Total package.',
    features: [
      'The Stump Grinding Playbook (PDF, 30+ pages)',
      'Pricing & Business Calculator (Excel / Google Sheets)',
      'All 12 Templates & Scripts Pack (Word / Docs)',
      'Equipment & teeth maintenance tracking sheets',
      'Save $17 compared to buying separately',
      '14-Day Money-Back Guarantee',
      'Instant access on any device',
    ],
    buttonText: 'Get the Full Kit ($97)',
  },
];

export function getProductById(id: string): ProductTier | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getFilesForProduct(productId: string): ProductFile[] {
  const product = getProductById(productId);
  if (!product) return [];
  return product.fileIds.map((fId) => PRODUCT_FILES[fId]).filter(Boolean);
}

export function isFileAllowedForProduct(productId: string, filename: string): boolean {
  const files = getFilesForProduct(productId);
  return files.some((f) => f.filename === filename);
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'Do I need experience to use this?',
    answer:
      'No previous experience is required. The playbook starts from scratch: choosing the right machine (walk-behind, self-propelled, or tow-behind), acquiring necessary liability insurance, calling 811 utility locates, and using the step-by-step formula to quote jobs without leaving money on the table.',
  },
  {
    question: 'Is this for the US?',
    answer:
      'Yes. The playbook, legal templates, insurance guides, and utility locate rules (Call 811) are specifically tailored to the United States market, terminology, and legal frameworks. If you operate outside the US, the pricing principles will still apply, but legal and regulatory details are US-specific.',
  },
  {
    question: 'Are the prices in the calculator guaranteed?',
    answer:
      'No. Stump grinding rates vary by state, fuel prices, competition, and soil geology (e.g., rocky Tennessee soil vs sandy Florida turf). The calculator provides proven baseline formulas and multiplier fields that you calibrate for your specific city and operating costs.',
  },
  {
    question: 'Are the legal templates legal advice?',
    answer:
      'No. The contracts, agreements, and waivers provided in the Templates Pack are starting drafts based on common trade practices. They are educational materials and do not constitute formal legal counsel. We recommend having an attorney licensed in your state review them before use.',
  },
  {
    question: 'What formats are the files?',
    answer:
      'The Playbook is an easily readable PDF (30+ pages). The Pricing & Business Calculator is a standard Excel spreadsheet (.xlsx) with no restrictive macros, tested for both Microsoft Excel and Google Sheets. The Templates Pack is delivered as an editable Microsoft Word (.docx) document.',
  },
  {
    question: 'Can I use the calculator in Google Sheets?',
    answer:
      'Yes, absolutely. The spreadsheet uses standard formulas without proprietary VBA macros. You can upload the .xlsx file directly to Google Drive and open it in Google Sheets on your phone, tablet, or computer while on a job site.',
  },
  {
    question: 'How do I get my files?',
    answer:
      'Immediately after completing checkout, you will be redirected to a download confirmation page with instant download buttons. You will also receive an automated email containing your personal secure download link. No waiting.',
  },
  {
    question: 'How do refunds work?',
    answer:
      'We offer an unconditional 14-day money-back guarantee. If you look through the material and feel it won’t save you time or help you quote more profitably, simply email us at support@stumpgrindingplaybook.com within 14 days and we will issue a full refund with no hassle.',
  },
  {
    question: 'What if a download link expires?',
    answer:
      'Download links remain active for 7 days with up to 5 downloads per file for security. If your link expires or you lose your files on a new device, simply visit our self-service "Resend Links" page and enter your purchase email to receive an instant fresh download link.',
  },
];

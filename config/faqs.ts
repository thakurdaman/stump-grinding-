export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'No experience?',
    answer:
      'No previous experience is needed. The playbook assumes you know nothing about stump grinding. You read your machine’s manual, follow the safety chapter, practice on a few stumps with permission, and learn the step-by-step pricing formula before touching a paid job.',
  },
  {
    question: 'Can I keep my job?',
    answer:
      'Yes. Many people start part-time on evenings and weekends and only consider going full-time once their own job tracker shows steady profit.',
  },
  {
    question: 'Do I need a grinder?',
    answer:
      'Not to start. Chapter 2 shows how to test demand for under $100 first, and Chapter 4 compares renting, buying used, and buying new. Rental prices vary by store, so check local equipment shops.',
  },
  {
    question: 'Does it work outside the U.S.?',
    answer:
      'The business model transfers, but licensing, insurance, 811 utility-locate rules, and tax regulations are U.S.-focused, so verify everything locally if operating elsewhere.',
  },
  {
    question: 'Are the prices in the calculator guaranteed?',
    answer:
      'No. Stump grinding rates vary by area, fuel prices, competition, and soil geology (e.g., rocky terrain vs sandy loam). The calculator provides proven baseline formulas and multiplier fields that you calibrate for your specific town and real operating costs.',
  },
  {
    question: 'Are the legal templates legal advice?',
    answer:
      'No. The contracts, agreements, and waivers provided in the Templates Pack are starting drafts based on common trade practices. They are educational materials and do not constitute formal legal counsel. We recommend having an attorney licensed in your state review them before use.',
  },
  {
    question: 'What formats are the files?',
    answer:
      'The Playbook is an easily readable PDF (52 pages). The Pricing & Business Calculator is a standard Excel spreadsheet (.xlsx) with no restrictive macros, tested for both Microsoft Excel and Google Sheets. The Templates Pack is delivered as an editable Microsoft Word (.docx) document.',
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
      'We offer an up-to-14-day money-back guarantee exclusively on the Full Kit. If you purchase the Full Kit and decide within 14 days of purchase that the system does not meet your operational needs, simply email us at support@stumpgrindingplaybook.com and we will issue a full 100% refund. Please note that standalone tiers (Playbook Only and Calculator + Templates) are delivered as instant digital downloads and are non-refundable.',
  },
  {
    question: 'What if a download link expires?',
    answer:
      'Download links remain active for 7 days with up to 5 downloads per file for security. If your link expires or you lose your files on a new device, simply visit our self-service "Resend Links" page and enter your purchase email to receive an instant fresh download link.',
  },
];

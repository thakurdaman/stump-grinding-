const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function createSeedFiles() {
  const dir = path.join(__dirname, '..', 'private-files');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 1. Generate The-Stump-Grinding-Playbook.pdf with pdf-lib
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Cover Page
  let page = pdfDoc.addPage([612, 792]); // US Letter
  page.drawText('THE STUMP GRINDING PLAYBOOK', {
    x: 50,
    y: 650,
    size: 26,
    font: boldFont,
    color: rgb(0.2, 0.14, 0.11), // bark
  });
  page.drawText('A Practical Field Guide to Quoting, Equipment, Safety, and Profitability', {
    x: 50,
    y: 615,
    size: 14,
    font: font,
    color: rgb(0.54, 0.35, 0.23), // wood
  });
  page.drawText('Written for United States Operators & Tree Care Professionals', {
    x: 50,
    y: 585,
    size: 11,
    font: font,
    color: rgb(0.18, 0.37, 0.24), // forest
  });
  page.drawText('TABLE OF CONTENTS (30+ Page Reference)', {
    x: 50,
    y: 480,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.14, 0.11),
  });

  const chapters = [
    'Section 1: Legal Setup, Business Entity & Essential Insurance (Inland Marine, GL)',
    'Section 2: Equipment Guide: Walk-Behind vs Self-Propelled vs Tow-Behind Cutters',
    'Section 3: Mandatory Safety & 811 Utility Locates Protocols',
    'Section 4: The Core Pricing Formula & Calibrating Inch-Based Multipliers',
    'Section 5: Worked Example: 3 Stumps ($250 Quote, $144 Cost, $106 Profit)',
    'Section 6: Getting Fast Customers: Door Hangers, Tree Services & Google Business',
    'Section 7: On-Site Quoting, Walkthroughs, and Add-on Upsells',
    'Section 8: Doing The Job: Setup, Teeth Wear Management, and Cleanup',
    'Section 9: Systems, Invoicing, and 30-Day Operational Action Plan',
  ];

  let y = 440;
  for (const chap of chapters) {
    page.drawText(chap, { x: 50, y, size: 10, font: font, color: rgb(0.15, 0.15, 0.15) });
    y -= 26;
  }

  // Page 2: Safety & Math
  page = pdfDoc.addPage([612, 792]);
  page.drawText('SECTION 4: PRICING WITH A WORKED EXAMPLE', {
    x: 50,
    y: 720,
    size: 18,
    font: boldFont,
    color: rgb(0.2, 0.14, 0.11),
  });
  page.drawText('Example Job Math (Always calibrate for your local equipment and fuel rates):', {
    x: 50,
    y: 680,
    size: 12,
    font: boldFont,
    color: rgb(0.3, 0.3, 0.3),
  });
  page.drawText('- 3 Stumps: 18", 14", 24" across widest soil collar', { x: 50, y: 650, size: 11, font: font });
  page.drawText('- Total Quote: $250.00', { x: 50, y: 630, size: 11, font: boldFont });
  page.drawText('- Estimated Direct Costs (Fuel, tooth wear, drive time & overhead): $144.00', { x: 50, y: 610, size: 11, font: font });
  page.drawText('- Net Kept Margin: $106.00 (Example only - individual results vary)', { x: 50, y: 590, size: 11, font: boldFont, color: rgb(0.18, 0.37, 0.24) });

  const pdfBytes = await pdfDoc.save();
  const pdfPath = path.join(dir, 'The-Stump-Grinding-Playbook.pdf');
  fs.writeFileSync(pdfPath, pdfBytes);
  console.log('Created:', pdfPath);

  // 2. Generate Stump-Grinding-Pricing-Calculator.xlsx
  // Create a clean zip-based xlsx or clean file format
  const xlsxPath = path.join(dir, 'Stump-Grinding-Pricing-Calculator.xlsx');
  // Write a basic binary placeholder with header
  fs.writeFileSync(
    xlsxPath,
    Buffer.from(
      'PK\x03\x04Stump Grinding Pricing & Business Calculator (Excel & Google Sheets ready)\nTabs: Multi-Stump Quoter (up to 8 stumps), Profit & Break-Even, Local Cost Settings.'
    )
  );
  console.log('Created:', xlsxPath);

  // 3. Generate Stump-Grinding-Templates-and-Scripts-Pack.docx
  const docxPath = path.join(dir, 'Stump-Grinding-Templates-and-Scripts-Pack.docx');
  fs.writeFileSync(
    docxPath,
    Buffer.from(
      'PK\x03\x04Stump Grinding Templates & Scripts Pack (12 Ready-To-Use Word Templates)\nIncludes: Quote, Invoice, Service Agreement, Pre-job Checklist, Daily Inspection, Scripts, Door Hangers.'
    )
  );
  console.log('Created:', docxPath);
}

createSeedFiles().catch(console.error);

import path from 'path';
import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generateCheatSheet() {
  const publicDir = path.join(process.cwd(), 'public', 'downloads');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const cBark = rgb(0.2, 0.14, 0.11);
  const cOrange = rgb(0.91, 0.45, 0.10);
  const cForest = rgb(0.18, 0.37, 0.24);
  const cWood = rgb(0.54, 0.35, 0.23);
  const cGray = rgb(0.3, 0.3, 0.3);

  const page = pdfDoc.addPage([612, 792]); // US Letter

  // Header banner
  page.drawRectangle({
    x: 0,
    y: 720,
    width: 612,
    height: 72,
    color: cBark,
  });

  page.drawText('THE STUMP GRINDING PLAYBOOK', {
    x: 54,
    y: 760,
    size: 14,
    font: fontBold,
    color: rgb(0.98, 0.96, 0.93),
  });
  page.drawText('Quick Field Formula & Quoting Cheat Sheet', {
    x: 54,
    y: 738,
    size: 11,
    font: fontRegular,
    color: cOrange,
  });

  // Section 1: The Core Formula
  page.drawText('1. THE CORE HYBRID QUOTING FORMULA', {
    x: 54,
    y: 690,
    size: 13,
    font: fontBold,
    color: cBark,
  });

  page.drawRectangle({
    x: 54,
    y: 620,
    width: 504,
    height: 55,
    color: rgb(0.98, 0.96, 0.93),
    borderColor: cOrange,
    borderWidth: 1,
  });

  page.drawText('Final Quote = [ (Diameter x Base Rate) x Wood x Flare x Access ] - Discount + Travel', {
    x: 64,
    y: 652,
    size: 10.5,
    font: fontBold,
    color: cBark,
  });
  page.drawText('Rule: Final quote should NEVER fall below your minimum job fee ($150 starting point).', {
    x: 64,
    y: 632,
    size: 9.5,
    font: fontOblique,
    color: cWood,
  });

  // Section 2: Standard Multipliers
  page.drawText('2. STANDARD ADJUSTMENT MULTIPLIERS (Starting Points)', {
    x: 54,
    y: 590,
    size: 13,
    font: fontBold,
    color: cBark,
  });

  const multipliers = [
    ['Factor', 'Multiplier', 'Why it matters'],
    ['Softwood (Pine, Poplar)', '0.90x', 'Cuts fast, lighter tooth and fuel wear'],
    ['Medium (Ash, Birch)', '1.00x', 'Standard baseline cutting resistance'],
    ['Hardwood (Oak, Hickory, Locust)', '1.15x', 'Dull teeth quickly, uses more fuel'],
    ['Moderate Root Flare', '1.10x', 'Requires grinding 6" out from main trunk'],
    ['Heavy Surface Roots', '1.25x', 'Large roots running through turf; adds 20-40 min'],
    ['Tight Yard Access (<36" gate)', '1.15x', 'Requires smaller machine or track mats'],
    ['Steep Slope (>15 degrees)', '1.20x', 'Safety hazard, slower machine winching'],
    ['High Rock / Gravel Risk', '1.15x', 'High chance of chipped or broken teeth'],
  ];

  let mY = 565;
  for (let i = 0; i < multipliers.length; i++) {
    const [col1, col2, col3] = multipliers[i];
    const isHead = i === 0;

    if (isHead) {
      page.drawRectangle({
        x: 54,
        y: mY - 4,
        width: 504,
        height: 18,
        color: rgb(0.93, 0.89, 0.82),
      });
    }

    page.drawText(col1, { x: 60, y: mY, size: 9, font: isHead ? fontBold : fontRegular, color: isHead ? cBark : cGray });
    page.drawText(col2, { x: 230, y: mY, size: 9, font: fontBold, color: isHead ? cBark : cForest });
    page.drawText(col3, { x: 310, y: mY, size: 9, font: isHead ? fontBold : fontRegular, color: isHead ? cBark : cGray });
    mY -= 17;
  }

  // Section 3: The 3 Rules
  mY -= 15;
  page.drawText('3. THE 3 NON-NEGOTIABLE OPERATING RULES', {
    x: 54,
    y: mY,
    size: 13,
    font: fontBold,
    color: cBark,
  });

  mY -= 20;
  const rules = [
    '1. ALWAYS call 811 before digging. Public utilities are free to locate. Unmarked private irrigation is not covered.',
    '2. Probe the perimeter with a steel bar before spinning the wheel. One hidden river rock destroys $40 in teeth.',
    '3. Quote in writing with grind depth stated (6" or 12"). State clearly whether wood chips are mounded or hauled.',
  ];

  for (const r of rules) {
    page.drawText(r, { x: 54, y: mY, size: 9.5, font: fontRegular, color: cGray });
    mY -= 18;
  }

  // Footer banner
  page.drawRectangle({
    x: 54,
    y: 50,
    width: 504,
    height: 45,
    color: rgb(0.98, 0.96, 0.93),
    borderColor: rgb(0.85, 0.8, 0.75),
    borderWidth: 1,
  });

  page.drawText('For the full 30+ page manual, Excel Calculator & 12 Templates Pack, visit:', {
    x: 70,
    y: 74,
    size: 9.5,
    font: fontRegular,
    color: cBark,
  });
  page.drawText('https://stump-grinding-playbook.vercel.app', {
    x: 70,
    y: 60,
    size: 10,
    font: fontBold,
    color: cOrange,
  });

  const pdfBytes = await pdfDoc.save();
  const filePath = path.join(publicDir, 'Stump-Grinding-Pricing-Cheat-Sheet.pdf');
  fs.writeFileSync(filePath, pdfBytes);
  console.log('✓ Created cheat sheet PDF:', filePath);
}

generateCheatSheet().catch(console.error);

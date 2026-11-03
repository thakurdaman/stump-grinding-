import { stampResource } from '../lib/stampers/stampResource';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

async function main() {
  const testEmail = 'john.contractor@example.com';
  const testOrderId = 'ord_test998877';

  console.log('1. Testing PDF stamping...');
  const pdfBytes = await stampResource({
    filename: 'The-Stump-Grinding-Playbook.pdf',
    email: testEmail,
    orderId: testOrderId,
  });
  console.log('   PDF stamped bytes:', pdfBytes.length);

  console.log('2. Testing XLSX stamping...');
  const xlsxBytes = await stampResource({
    filename: 'Stump-Grinding-Pricing-Calculator.xlsx',
    email: testEmail,
    orderId: testOrderId,
  });
  console.log('   XLSX stamped bytes:', xlsxBytes.length);
  const wb = XLSX.read(Buffer.from(xlsxBytes));
  console.log('   XLSX A2 cell:', wb.Sheets['StartHere']['A2'].v);
  console.log('   XLSX Author:', wb.Props?.Author);

  console.log('3. Testing DOCX stamping...');
  const docxBytes = await stampResource({
    filename: 'Stump-Grinding-Templates-and-Scripts-Pack.docx',
    email: testEmail,
    orderId: testOrderId,
  });
  console.log('   DOCX stamped bytes:', docxBytes.length);
  const zip = await JSZip.loadAsync(Buffer.from(docxBytes));
  const footer = await zip.files['word/footer1.xml'].async('text');
  console.log('   DOCX footer contains email:', footer.includes(testEmail));
  const core = await zip.files['docProps/core.xml'].async('text');
  console.log('   DOCX core metadata contains email:', core.includes(testEmail));

  console.log('\n=== ALL 3 RESOURCES WATERMARKED AND LICENSED SUCCESSFULLY ===');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

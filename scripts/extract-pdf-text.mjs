// Extracts text from a PDF (uses the project's pdfjs-dist).
// Usage: node scripts/extract-pdf-text.mjs "<path-to-pdf>" [numPages] [end]
//   numPages: how many pages (default 3)
//   end:      pass "end" to read the LAST numPages instead of the first
// Prints total page count then the text of each requested page.

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFile } from 'node:fs/promises';

const file = process.argv[2];
const maxPages = Number(process.argv[3] || 3);
const fromEnd = process.argv[4] === 'end';

if (!file) {
  console.error('Usage: node scripts/extract-pdf-text.mjs "<pdf>" [numPages] [end]');
  process.exit(1);
}

const data = new Uint8Array(await readFile(file));
const doc = await getDocument({ data, useSystemFonts: true }).promise;
const total = doc.numPages;
console.log(`### PAGES: ${total}`);

const pageNums = fromEnd
  ? Array.from({ length: Math.min(maxPages, total) }, (_, i) => total - i).reverse()
  : Array.from({ length: Math.min(maxPages, total) }, (_, i) => i + 1);

for (const n of pageNums) {
  const page = await doc.getPage(n);
  const content = await page.getTextContent();
  let lastY = null;
  let out = '';
  for (const item of content.items) {
    if (!('str' in item)) continue;
    const y = item.transform[5];
    if (lastY !== null && Math.abs(y - lastY) > 2) out += '\n';
    out += item.str;
    lastY = y;
  }
  console.log(`\n----- PAGE ${n} -----`);
  console.log(out.replace(/\n{3,}/g, '\n\n').trim());
}

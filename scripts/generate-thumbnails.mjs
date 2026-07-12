// Reads the first page of each PDF and saves it as a JPEG thumbnail.
// Run once with: node scripts/generate-thumbnails.mjs

import { pdf } from 'pdf-to-img';
import sharp from 'sharp';
import { mkdir, copyFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const plays = [
  {
    id: 'xristougenniatiko-dentro',
    pdfName: 'Το Χριστουγεννιάτικο δέντρο στη χώρα των συναισθημάτων.pdf',
  },
  {
    id: 'pagomena-xristougenna-1',
    pdfName: 'Τα παγωμένα Χριστούγεννα ΕΚΔΟΧΗ 1.pdf',
  },
  {
    id: 'pagomena-xristougenna-2',
    pdfName: 'Τα παγωμένα Χριστούγεννα EKDOXH 2.pdf',
  },
  { id: 'i-profiteia', pdfName: 'i-profiteia.pdf' },
  { id: 'black-out-paixnidoxora', pdfName: 'black-out-paixnidoxora.pdf' },
  { id: 'mia-nyxta-sto-palermo', pdfName: 'mia-nyxta-sto-palermo.pdf' },
  { id: 'belades-iliako-systima', pdfName: 'belades-iliako-systima.pdf' },
  { id: 'to-koxylosentoukaki', pdfName: 'to-koxylosentoukaki.pdf' },
  { id: 'karagkiozis-treis-magoi', pdfName: 'karagkiozis-treis-magoi.pdf' },
  { id: 'ta-xexasmena-stolidia', pdfName: 'ta-xexasmena-stolidia.pdf' },
  { id: 'protoxronia-paixnidoxora', pdfName: 'protoxronia-paixnidoxora.pdf' },
  { id: 'girasko-aei-didaskomenos', pdfName: 'girasko-aei-didaskomenos.pdf' },
  { id: 'i-konti-kaminada', pdfName: 'i-konti-kaminada.pdf' },
];

for (const play of plays) {
  const dir = path.join(ROOT, 'public', 'plays', play.id);
  await mkdir(dir, { recursive: true });

  const pdfPath = path.join(ROOT, 'PDFs', play.pdfName);
  const destPdf = path.join(dir, 'play.pdf');
  const destThumb = path.join(dir, 'thumbnail.jpg');

  // Copy PDF into public so it can be downloaded / viewed
  await copyFile(pdfPath, destPdf);
  console.log(`Copied PDF → public/plays/${play.id}/play.pdf`);

  // Render first page (returns PNG Uint8Array per page)
  const pages = await pdf(pdfPath, { scale: 2 });
  let firstPage;
  for await (const page of pages) {
    firstPage = page;
    break;
  }

  await sharp(Buffer.from(firstPage))
    .jpeg({ quality: 88 })
    .toFile(destThumb);

  console.log(`Thumbnail  → public/plays/${play.id}/thumbnail.jpg`);
}

console.log('\nDone!');

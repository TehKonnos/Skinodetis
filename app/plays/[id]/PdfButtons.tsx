'use client';

import { pushEvent } from '../../lib/gtm';

export default function PdfButtons({
  pdfUrl,
  playId,
  title,
  author,
}: {
  pdfUrl: string;
  playId: string;
  title: string;
  author: string;
}) {
  const meta = { play_id: playId, play_title: title };

  return (
    <>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => pushEvent('open_pdf', meta)}
        className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-600 text-ink font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm hover:shadow-md"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        Άνοιγμα PDF
      </a>
      <a
        href={pdfUrl}
        download={`${title} - ${author} - Σκηνοδέτης.pdf`}
        onClick={() => pushEvent('download_pdf', meta)}
        className="flex items-center justify-center gap-2 w-full border border-gold/50 text-ink dark:text-cream hover:bg-gold/10 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Κατέβασμα PDF
      </a>
    </>
  );
}

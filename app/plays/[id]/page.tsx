import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPlayById, getRelatedPlays } from '../../data/plays';
import { readPlays } from '../../lib/plays-store';
import RelatedPlays from '../../components/RelatedPlays';

// Τα έργα είναι επεξεργάσιμα κατά το runtime.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const play = getPlayById(await readPlays(), id);
  if (!play) return {};
  return {
    title: `${play.title} — Σκηνοδέτης`,
    description: play.shortDescription,
  };
}

// Ενιαίο, θερμό στιλ badge (χρυσή απόχρωση) για όλες τις κατηγορίες.
const CATEGORY_BADGE =
  'bg-gold/20 text-[#7a5717] hover:bg-gold/30 dark:bg-gold/15 dark:text-gold dark:hover:bg-gold/25';

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plays = await readPlays();
  const play = getPlayById(plays, id);

  if (!play) notFound();

  const relatedPlays = getRelatedPlays(plays, play);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero image */}
      <section className="relative h-[55vh] min-h-[400px]">
        <Image
          src={play.heroImage}
          alt={`${play.title} — θεατρικό έργο`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/75" />

        {/* Back button */}
        <div className="absolute top-5 left-5 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-full transition-all duration-200 border border-white/20 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Όλα τα Έργα
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {play.categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}`}
                  className="bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors border border-white/20"
                >
                  {cat}
                </Link>
              ))}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
              {play.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Page content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
              Σχετικά με το Έργο
            </h2>
            <div className="space-y-4">
              {play.description.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* YouTube embed */}
            {play.youtubeVideoId && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                  Δείτε μια Προεπισκόπηση
                </h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/5">
                  <iframe
                    src={`https://www.youtube.com/embed/${play.youtubeVideoId}`}
                    title={`${play.title} — προεπισκόπηση`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-cream dark:bg-night-700 rounded-2xl p-6 border border-gold/30 dark:border-gold/20 shadow-sm sticky top-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5 uppercase tracking-wide">
                Στοιχεία Έργου
              </h3>

              <dl className="space-y-5">
                {/* Author */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 dark:bg-gold/15 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-gold-600 dark:text-gold"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Συγγραφέας
                    </dt>
                    <dd className="mt-0.5 text-gray-900 dark:text-white font-semibold">
                      {play.author}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-coral/15 dark:bg-coral/20 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-coral-600 dark:text-coral"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Διάρκεια
                    </dt>
                    <dd className="mt-0.5 text-gray-900 dark:text-white font-semibold">
                      {play.duration}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 dark:bg-gold/15 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-gold-600 dark:text-gold"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Ηλικιακή Ομάδα
                    </dt>
                    <dd className="mt-0.5 text-gray-900 dark:text-white font-semibold">
                      Ηλικίες {play.ageGroup}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-coral/15 dark:bg-coral/20 flex items-center justify-center shrink-0">
                    <svg
                      className="w-4 h-4 text-coral-600 dark:text-coral"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Χαρακτήρες
                    </dt>
                    <dd className="mt-0.5 text-gray-900 dark:text-white font-semibold">
                      {play.characters} ρόλοι
                    </dd>
                  </div>
                </div>

                {/* Category filter buttons */}
                <div>
                  <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Κατηγορίες
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {play.categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/?category=${encodeURIComponent(cat)}`}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${CATEGORY_BADGE}`}
                      >
                        {cat}
                      </Link>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 pt-5 border-t border-black/10 dark:border-white/10 flex flex-col gap-3">
                {play.pdfUrl && (
                  <a
                    href={play.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-600 text-ink font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm hover:shadow-md"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Άνοιγμα PDF
                  </a>
                )}
                {play.pdfUrl && (
                  <a
                    href={play.pdfUrl}
                    download={`${play.title} - ${play.author} - Σκηνοδέτης.pdf`}
                    className="flex items-center justify-center gap-2 w-full border border-gold/50 text-ink dark:text-cream hover:bg-gold/10 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Κατέβασμα PDF
                  </a>
                )}
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  Όλα τα Έργα
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <RelatedPlays plays={relatedPlays} />
      </div>

      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 py-8 px-4 text-center text-sm text-gray-400 dark:text-gray-600">
        <p>
          &copy; {new Date().getFullYear()}{' '}Σκηνοδέτης &mdash; Παιδικά Θεατρικά Έργα
        </p>
      </footer>
    </main>
  );
}

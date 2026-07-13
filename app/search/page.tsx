import type { Metadata } from 'next';
import Link from 'next/link';
import PlayCard from '../components/PlayCard';
import { readPlays } from '../lib/plays-store';
import { searchPlays } from '../data/plays';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Αναζήτηση — Σκηνοδέτης',
  robots: { index: false, follow: true }, // σελίδες αποτελεσμάτων δεν χρειάζονται indexing
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const plays = await readPlays();
  const results = query ? searchPlays(plays, query) : [];

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
      {/* Φόρμα αναζήτησης */}
      <form action="/search" method="get" className="max-w-xl mx-auto mb-10">
        <div className="flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-3 focus-within:ring-2 focus-within:ring-gold">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            name="q"
            defaultValue={query}
            autoFocus
            placeholder="Αναζήτηση έργου…"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>
      </form>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-1">
          Αναζήτηση
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base">
          {query
            ? `${results.length} αποτέλεσμα${results.length === 1 ? '' : 'τα'} για «${query}»`
            : 'Πληκτρολόγησε για να αναζητήσεις ένα έργο.'}
        </p>
      </div>

      {query && results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            Δεν βρέθηκαν έργα για «{query}».
          </p>
          <Link
            href="/#plays"
            className="text-coral-600 dark:text-coral font-semibold hover:underline"
          >
            Δείτε όλα τα έργα →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {results.map((play) => (
            <PlayCard key={play.id} play={play} />
          ))}
        </div>
      )}
    </main>
  );
}

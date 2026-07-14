import Hero from './components/Hero';
import PlayCard from './components/PlayCard';
import ContactForm from './components/ContactForm';
import NewsletterForm from './components/NewsletterForm';
import {
  filterPlays,
  getAllCategories,
  taxonomy,
  type PlayFilters,
} from './data/plays';
import { readPlays } from './lib/plays-store';
import Link from 'next/link';

// Τα έργα είναι επεξεργάσιμα κατά το runtime — να μη γίνεται static caching.
export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<PlayFilters>;
}) {
  const params = await searchParams;

  const filters: PlayFilters = {
    category: params.category,
    season: params.season,
    grade: params.grade,
    age: params.age,
    audience: params.audience,
  };

  const plays = await readPlays();
  const filteredPlays = filterPlays(plays, filters);
  const allCategories = getAllCategories(plays);

  // Ενεργά φίλτρα προς εμφάνιση στην επικεφαλίδα
  const activeFilters = taxonomy
    .map((dim) => ({ dim, value: filters[dim.param] }))
    .filter((f): f is { dim: (typeof taxonomy)[number]; value: string } =>
      Boolean(f.value)
    );

  return (
    <>
      <Hero />

      <main id="plays" className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            {activeFilters.length > 0 ? (
              <span className="text-coral-600 dark:text-coral">
                {activeFilters.map((f) => f.value).join(' · ')}
              </span>
            ) : (
              'Τα Έργα μας'
            )}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base">
            {activeFilters.length > 0
              ? `Εμφάνιση ${filteredPlays.length} έργ${filteredPlays.length !== 1 ? 'ων' : 'ου'}`
              : 'Ξεχωριστές ιστορίες για να ενθουσιάσουν το νεαρό κοινό'}
          </p>

          {/* Ενεργά φίλτρα */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {activeFilters.map((f) => (
                <span
                  key={f.dim.param}
                  className="inline-flex items-center gap-1.5 bg-coral/10 dark:bg-coral/20 text-coral-600 dark:text-coral text-sm font-medium px-3 py-1 rounded-full"
                >
                  <span className="opacity-60">{f.dim.label}:</span> {f.value}
                </span>
              ))}
              <Link
                href="/#plays"
                className="inline-flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-coral-600 dark:hover:text-coral px-2"
              >
                Καθαρισμός ✕
              </Link>
            </div>
          )}
        </div>

        {/* Φίλτρο ανά είδος */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Link
            href="/#plays"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeFilters.length === 0
                ? 'bg-coral text-white shadow-md shadow-coral/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Όλα
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}#plays`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filters.category === cat
                  ? 'bg-coral text-white shadow-md shadow-coral/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {filteredPlays.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gold-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              Δεν βρέθηκαν έργα για αυτή την κατηγορία.
            </p>
            <Link
              href="/"
              className="text-coral-600 dark:text-coral font-semibold hover:underline"
            >
              Δείτε όλα τα έργα →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredPlays.map((play) => (
              <PlayCard key={play.id} play={play} />
            ))}
          </div>
        )}
      </main>

      {/* Επικοινωνία */}
      <section
        id="contact"
        className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Επικοινωνία
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Θέλετε να ανεβάσετε ένα έργο ή έχετε μια ερώτηση; Γράψτε μας.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer με newsletter */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Newsletter
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Μείνετε ενημερωμένοι για νέα έργα και παραστάσεις.
              </p>
            </div>
            <NewsletterForm />
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400 dark:text-gray-600">
            <p>
              &copy; {new Date().getFullYear()}{' '}Σκηνοδέτης &mdash; Παιδικά Θεατρικά Έργα
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

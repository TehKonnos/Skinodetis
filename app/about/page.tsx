import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { readPlays } from '../lib/plays-store';
import ContactForm from '../components/ContactForm';
import NewsletterForm from '../components/NewsletterForm';

export const metadata: Metadata = {
  title: 'Ο Συγγραφέας — Παναγιώτης Χρυσίδης | Σκηνοδέτης',
  description:
    'Λίγα λόγια για τον Παναγιώτη Χρυσίδη, συγγραφέα παιδικών θεατρικών έργων για σχολεία και ερασιτεχνικές ομάδες.',
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const playCount = (await readPlays()).length;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-28 overflow-hidden bg-night">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-4 right-16 w-40 h-40 rounded-full bg-coral/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold mb-3">
            Ο Συγγραφέας
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            Παναγιώτης Χρυσίδης
          </h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            Συγγραφέας παιδικών θεατρικών έργων που ζωντανεύουν στη σκηνή —
            γραμμένων με αγάπη για τα παιδιά, τα σχολεία και τις ερασιτεχνικές
            θεατρικές ομάδες.
          </p>
        </div>
      </section>

      {/* Φωτογραφία σκηνοθέτη — κεντραρισμένη στο όριο των section */}
      <div className="relative z-20 flex justify-center -mt-20 sm:-mt-24">
        <div className="w-40 h-40 sm:w-48 sm:h-48 translate-x-8 sm:translate-x-40 lg:translate-x-56 rounded-full overflow-hidden ring-4 ring-gold shadow-2xl bg-night">
          <Image
            src="/panagiotis-portrait.jpg"
            alt="Ο Παναγιώτης Χρυσίδης"
            width={384}
            height={384}
            priority
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        <article className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
          <p>
            Ο <strong>Παναγιώτης Χρυσίδης</strong> γράφει θεατρικά έργα για
            παιδιά, με έμφαση στις γιορτινές παραστάσεις και τις σχολικές
            εκδηλώσεις. Τα κείμενά του συνδυάζουν τη διασκέδαση με ουσιαστικά
            μηνύματα — από τη συναισθηματική νοημοσύνη μέχρι την αξία της
            φιλίας, της συνεργασίας και της αγάπης.
          </p>
          <p>
            Τα έργα του είναι σχεδιασμένα ώστε να ανεβαίνουν εύκολα από{' '}
            <strong>σχολεία, θεατρικές λέσχες και ερασιτεχνικές ομάδες</strong>:
            ευέλικτη διανομή ρόλων, ζωντανοί χαρακτήρες και ιστορίες που
            κρατούν αμείωτο το ενδιαφέρον μικρών και μεγάλων. Πολλές παραστάσεις
            προσφέρονται σε εναλλακτικές εκδοχές, ώστε κάθε ομάδα να επιλέγει
            αυτή που ταιριάζει στον αριθμό και την ηλικία των ηθοποιών της.
          </p>
          <p>
            Στη συλλογή του Σκηνοδέτη θα βρείτε αυτή τη στιγμή{' '}
            <strong>
              {playCount} {playCount === 1 ? 'έργο' : 'έργα'}
            </strong>{' '}
            του, με χριστουγεννιάτικες ιστορίες γεμάτες μουσική, χιούμορ και
            μαγεία — έτοιμες να ανέβουν στη δική σας σκηνή.
          </p>
        </article>

        {/* Υπογραφή συγγραφέα */}
        <div className="mt-10 flex flex-col items-end">
          <Image
            src="/logo-signature.png"
            alt="Υπογραφή του Παναγιώτη Χρυσίδη"
            width={320}
            height={165}
            priority
            className="w-52 h-auto opacity-90 dark:invert"
          />
          {/* Το όνομα του συγγραφέα, για SEO */}
          <span className=" hidden mt-1 mr-2 text-sm text-gray-400 dark:text-gray-500">
            Παναγιώτης Χρυσίδης
          </span>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/#plays"
            className="inline-block bg-gold hover:bg-gold-600 text-ink font-bold py-3.5 px-9 rounded-full text-base shadow-xl hover:shadow-gold/30 transform hover:scale-105 transition-all duration-200"
          >
            Δείτε τα Έργα
          </Link>
        </div>
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
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
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

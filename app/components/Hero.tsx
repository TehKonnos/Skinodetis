import Link from 'next/link';
import RotatingHeadline from './RotatingHeadline';

export default function Hero() {
  return (
    <section className="relative h-[72vh] min-h-[520px] flex items-center justify-center overflow-hidden bg-night">
      <div className="absolute inset-0">
        {/* Video φόντου — αυτόματη αναπαραγωγή, χωρίς ήχο, σε επανάληψη */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/home.mp4" type="video/mp4" />
        </video>
        {/* Scrim ενός τόνου για αναγνωσιμότητα (όχι δίχρωμο ντεγκραντέ) */}
        <div className="absolute inset-0 bg-night/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-night/40" />
      </div>

      {/* Λάμψη προβολέα */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[60%] h-48 bg-gold/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
          Ανακαλύψτε
          <br />
          <RotatingHeadline />
        </h1>

        <p className="text-lg sm:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
          Μαγικές ιστορίες που ζωντανεύουν στη σκηνή. Μαγευτικά έργα φτιαγμένα για νεαρές
          φαντασίες και οικογένειες να απολαύσουν μαζί.
        </p>

        <div className="flex items-center justify-center">
          <Link
            href="#plays"
            className="inline-block bg-gold hover:bg-gold-600 text-ink font-bold py-3.5 px-9 rounded-full text-base shadow-xl hover:shadow-gold/30 transform hover:scale-105 transition-all duration-200"
          >
            Εξερευνήστε Όλα τα Έργα
          </Link>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

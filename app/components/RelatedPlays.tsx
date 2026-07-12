import Image from 'next/image';
import Link from 'next/link';
import type { Play } from '../data/plays';

export default function RelatedPlays({ plays }: { plays: Play[] }) {
  if (plays.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Σχετικά Έργα
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plays.map((play) => (
          <Link key={play.id} href={`/plays/${play.id}`} className="group block">
            <article className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-800 flex gap-4 p-3 sm:block sm:p-0">
              <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden sm:w-full sm:h-40 sm:rounded-none">
                <Image
                  src={play.image}
                  alt={play.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="flex-1 sm:p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-coral-600 dark:group-hover:text-coral transition-colors leading-snug">
                  {play.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {play.shortDescription}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {play.duration} &middot; Ηλικίες {play.ageGroup}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

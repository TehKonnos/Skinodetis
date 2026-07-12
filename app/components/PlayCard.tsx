import Image from 'next/image';
import Link from 'next/link';
import type { Play } from '../data/plays';

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gold/20 text-[#7a5717] dark:bg-gold/15 dark:text-gold">
      {category}
    </span>
  );
}

export default function PlayCard({ play }: { play: Play }) {
  return (
    <article className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col border border-gray-100 dark:border-gray-800">
      {/* Image */}
      <Link href={`/plays/${play.id}`} className="relative h-52 overflow-hidden block">
        <Image
          src={play.image}
          alt={play.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          Ηλικίες {play.ageGroup}
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug">
          <Link
            href={`/plays/${play.id}`}
            className="group-hover:text-coral-600 dark:group-hover:text-coral transition-colors"
          >
            {play.title}
          </Link>
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {play.shortDescription}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
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
            {play.duration}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5"
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
            {play.characters} χαρακτήρες
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {play.categories.slice(0, 3).map((cat) => (
            <CategoryBadge key={cat} category={cat} />
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/plays/${play.id}`}
          className="block text-center bg-gold hover:bg-gold-600 text-ink font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 hover:shadow-md text-sm"
        >
          Περισσότερα
        </Link>
      </div>
    </article>
  );
}

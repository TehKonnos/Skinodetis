'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchPlays, type PlaySearchItem } from '../data/plays';

export default function Search({
  items,
  colorClass,
}: {
  items: PlaySearchItem[];
  colorClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(
    () => (q.trim() ? searchPlays(items, q).slice(0, 6) : []),
    [q, items]
  );

  // Εστίαση στο input μόλις ανοίξει.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Κλείσιμο με κλικ εκτός ή Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function goToSearch() {
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div
      ref={boxRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
    >
      <button
        type="button"
        aria-label="Αναζήτηση"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center transition-colors duration-300 ${colorClass}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-3 w-[min(90vw,400px)]">
          <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToSearch();
              }}
              className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800"
            >
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Αναζήτηση έργου…"
                className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </form>

            {q.trim() && (
              <ul className="max-h-[60vh] overflow-y-auto py-1">
                {results.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Κανένα αποτέλεσμα για «{q.trim()}»
                  </li>
                ) : (
                  <>
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/plays/${p.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Image
                            src={p.image}
                            alt=""
                            width={44}
                            height={44}
                            className="w-11 h-11 rounded-lg object-cover shrink-0"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">
                              {p.title}
                            </span>
                            <span className="block text-xs text-gray-400 truncate">
                              {p.categories.join(' · ')}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li className="border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={goToSearch}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-coral-600 dark:text-coral hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        Όλα τα αποτελέσματα για «{q.trim()}» →
                      </button>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

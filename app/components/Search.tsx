'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { searchPlays, type PlaySearchItem } from '../data/plays';

const MagnifierIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export default function Search({
  items,
  colorClass = '',
  mobile = false,
  onNavigate,
}: {
  items: PlaySearchItem[];
  colorClass?: string;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(mobile); // στο mobile είναι πάντα ανοιχτό
  const [q, setQ] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(
    () => (q.trim() ? searchPlays(items, q).slice(0, 6) : []),
    [q, items]
  );

  useEffect(() => {
    if (open && !mobile) inputRef.current?.focus();
  }, [open, mobile]);

  // Desktop: κλείσιμο με κλικ εκτός ή Escape.
  useEffect(() => {
    if (mobile || !open) return;
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
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
  }, [open, mobile]);

  function goToSearch() {
    const query = q.trim();
    if (!query) return;
    if (!mobile) setOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  const resultList = q.trim() && (
    <ul className={mobile ? 'mt-2' : 'max-h-[60vh] overflow-y-auto py-1'}>
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
                onClick={() => {
                  if (!mobile) setOpen(false);
                  onNavigate?.();
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
          <li className="mt-1 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={goToSearch}
              className="w-full text-left px-3 py-2.5 text-sm font-semibold text-coral-600 dark:text-coral hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
            >
              Όλα τα αποτελέσματα για «{q.trim()}» →
            </button>
          </li>
        </>
      )}
    </ul>
  );

  // ── Mobile: πλήρες πλάτος, πάντα ανοιχτό, αποτελέσματα από κάτω ──
  if (mobile) {
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToSearch();
          }}
          className="flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 h-11 focus-within:ring-2 focus-within:ring-gold"
        >
          <MagnifierIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Αναζήτηση έργου…"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </form>
        {resultList}
      </div>
    );
  }

  // ── Desktop: slide-open inline bar (το input ανοίγει προς τα αριστερά) ──
  return (
    <div
      ref={boxRef}
      className="relative w-9 h-9"
      onMouseEnter={() => setOpen(true)}
    >
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            goToSearch();
          }
        }}
        tabIndex={open ? 0 : -1}
        placeholder="Αναζήτηση…"
        className={`absolute right-0 top-0 h-9 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gold transition-all duration-300 ${
          open
            ? 'w-44 lg:w-56 pl-4 pr-10 border border-gray-300 dark:border-gray-700 opacity-100'
            : 'w-9 opacity-0 pointer-events-none border border-transparent'
        }`}
      />
      <button
        type="button"
        aria-label="Αναζήτηση"
        aria-expanded={open}
        onClick={() => (open ? goToSearch() : setOpen(true))}
        className={`absolute right-0 top-0 z-10 flex items-center justify-center h-9 w-9 rounded-full transition-colors duration-300 ${
          open ? 'text-gray-500 dark:text-gray-400' : colorClass
        }`}
      >
        <MagnifierIcon />
      </button>

      {open && q.trim() && (
        <div className="absolute right-0 top-full mt-2 w-[min(90vw,380px)] rounded-2xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-2">
          {resultList}
        </div>
      )}
    </div>
  );
}

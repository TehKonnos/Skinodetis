'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export interface CategoryMenuGroup {
  param: string;
  label: string;
  values: string[];
}

export default function Navbar({
  categoryMenu,
}: {
  categoryMenu: CategoryMenuGroup[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Κλείσιμο του μενού με κλικ εκτός ή με Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Το δημόσιο navbar δεν εμφανίζεται στις σελίδες διαχείρισης.
  if (pathname?.startsWith('/admin')) return null;

  const linkColor = scrolled
    ? 'text-gray-600 dark:text-gray-300 hover:text-coral-600 dark:hover:text-coral'
    : 'text-white/85 hover:text-white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200/60 dark:border-gray-700/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo — wordmark ΣΚΗΝΟΔΕΤΗΣ· μαύρο πάνω σε φωτεινό navbar, λευκό (invert) στο σκούρο hero */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo-mark.png"
            alt="Σκηνοδέτης"
            width={253}
            height={110}
            priority
            className={`h-11 w-auto transition-all duration-300 ${
              scrolled ? '' : '[filter:brightness(0)_invert(1)] drop-shadow-sm'
            }`}
          />
        </Link>

        {/* Δεξιά πλευρά */}
        <nav className="flex items-center gap-5 sm:gap-7">
          {/* Dropdown Κατηγορίες */}
          <div
            className="relative"
            ref={menuRef}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${linkColor}`}
            >
              Κατηγορίες
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  menuOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full pt-3 w-[min(88vw,640px)]">
                <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-5 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                {categoryMenu
                  .filter((dim) => dim.values.length > 0)
                  .map((dim) => (
                  <div key={dim.param}>
                    <p className="text-xs font-bold uppercase tracking-wider text-coral-600 dark:text-coral mb-2">
                      {dim.label}
                    </p>
                    <ul className="space-y-1">
                      {dim.values.map((value) => (
                        <li key={value}>
                          <Link
                            href={`/?${dim.param}=${encodeURIComponent(value)}#plays`}
                            onClick={() => setMenuOpen(false)}
                            className="block text-sm text-gray-600 dark:text-gray-300 hover:text-coral-600 dark:hover:text-coral hover:translate-x-0.5 transition-all"
                          >
                            {value}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/#plays"
            className={`hidden sm:inline text-sm font-semibold transition-colors duration-300 ${linkColor}`}
          >
            Τα Έργα
          </Link>

          <Link
            href="/about"
            className={`text-sm font-semibold transition-colors duration-300 ${linkColor}`}
          >
            Ο Συγγραφέας
          </Link>

          <Link
            href="/#contact"
            className={`hidden sm:inline text-sm font-semibold transition-colors duration-300 ${linkColor}`}
          >
            Επικοινωνία
          </Link>
        </nav>
      </div>
    </header>
  );
}

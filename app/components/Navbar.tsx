'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Search from './Search';
import type { PlaySearchItem } from '../data/plays';

export interface CategoryMenuGroup {
  param: string;
  label: string;
  values: string[];
}

export default function Navbar({
  categoryMenu,
  searchItems,
}: {
  categoryMenu: CategoryMenuGroup[];
  searchItems: PlaySearchItem[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // dropdown Κατηγορίες (desktop)
  const [mobileOpen, setMobileOpen] = useState(false); // burger (mobile)
  const [mobileCatOpen, setMobileCatOpen] = useState(false); // accordion Κατηγορίες (mobile)
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Κλείσιμο του desktop dropdown με κλικ εκτός ή Escape.
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

  // Κλείσιμο των μενού σε αλλαγή σελίδας.
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
    setMobileCatOpen(false);
  }, [pathname]);

  // Κλείδωμα scroll όσο είναι ανοιχτό το mobile μενού.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Το δημόσιο navbar δεν εμφανίζεται στις σελίδες διαχείρισης.
  if (pathname?.startsWith('/admin')) return null;

  // «Στέρεο» φόντο όταν έχει γίνει scroll Ή όταν είναι ανοιχτό το mobile μενού.
  const solid = scrolled || mobileOpen;

  const linkColor = solid
    ? 'text-gray-600 dark:text-gray-300 hover:text-coral-600 dark:hover:text-coral'
    : 'text-white/85 hover:text-white';

  const catValues = categoryMenu.filter((dim) => dim.values.length > 0);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200/60 dark:border-gray-700/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo-mark.png"
            alt="Σκηνοδέτης"
            width={253}
            height={110}
            priority
            className={`h-11 w-auto transition-all duration-300 ${
              solid ? '' : '[filter:brightness(0)_invert(1)] drop-shadow-sm'
            }`}
          />
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          <Search items={searchItems} colorClass={linkColor} />

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full pt-3 w-[min(88vw,640px)]">
                <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-5 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                  {catValues.map((dim) => (
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

          <Link href="/#plays" className={`text-sm font-semibold transition-colors duration-300 ${linkColor}`}>
            Τα Έργα
          </Link>
          <Link href="/about" className={`text-sm font-semibold transition-colors duration-300 ${linkColor}`}>
            Ο Συγγραφέας
          </Link>
          <Link href="/#contact" className={`text-sm font-semibold transition-colors duration-300 ${linkColor}`}>
            Επικοινωνία
          </Link>
        </nav>

        {/* ── Burger (mobile) ── */}
        <button
          type="button"
          className={`md:hidden flex items-center justify-center w-10 h-10 -mr-2 transition-colors duration-300 ${linkColor}`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Κλείσιμο μενού' : 'Μενού'}
          aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile menu panel ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-5 space-y-6">
            <Search
              items={searchItems}
              mobile
              onNavigate={() => setMobileOpen(false)}
            />

            <nav className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
              <Link
                href="/#plays"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-base font-semibold text-gray-800 dark:text-gray-100 hover:text-coral-600 dark:hover:text-coral"
              >
                Τα Έργα
              </Link>

              {/* Κατηγορίες — accordion (κλειστό από default) */}
              {catValues.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileCatOpen((o) => !o)}
                    aria-expanded={mobileCatOpen}
                    className="w-full flex items-center justify-between py-3 text-base font-semibold text-gray-800 dark:text-gray-100"
                  >
                    Κατηγορίες
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        mobileCatOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileCatOpen && (
                    <div className="pb-4 space-y-5">
                      {catValues.map((dim) => (
                        <div key={dim.param}>
                          <p className="text-xs font-bold uppercase tracking-wider text-coral-600 dark:text-coral mb-2">
                            {dim.label}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {dim.values.map((value) => (
                              <Link
                                key={value}
                                href={`/?${dim.param}=${encodeURIComponent(value)}#plays`}
                                onClick={() => setMobileOpen(false)}
                                className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full hover:bg-gold/20 hover:text-ink dark:hover:text-gold"
                              >
                                {value}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-base font-semibold text-gray-800 dark:text-gray-100 hover:text-coral-600 dark:hover:text-coral"
              >
                Ο Συγγραφέας
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="py-3 text-base font-semibold text-gray-800 dark:text-gray-100 hover:text-coral-600 dark:hover:text-coral"
              >
                Επικοινωνία
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

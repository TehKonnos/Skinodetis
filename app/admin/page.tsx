import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getSession } from '../lib/auth';
import { logout } from './actions';

export const metadata: Metadata = {
  title: 'Διαχείριση — Σκηνοδέτης',
  robots: { index: false, follow: false },
};

// Οι σελίδες admin εξαρτώνται από τη συνεδρία — ποτέ static.
export const dynamic = 'force-dynamic';

interface ContactEntry {
  at: string;
  name: string;
  email: string;
  message: string;
}
interface NewsletterEntry {
  at: string;
  email: string;
}

async function readJsonl<T>(file: string): Promise<T[]> {
  try {
    const raw = await readFile(
      path.join(process.cwd(), 'submissions', file),
      'utf8'
    );
    return raw
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as T;
        } catch {
          return null;
        }
      })
      .filter((x): x is T => x !== null)
      .reverse(); // νεότερα πρώτα
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('el-GR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const [contact, newsletter] = await Promise.all([
    readJsonl<ContactEntry>('contact.jsonl'),
    readJsonl<NewsletterEntry>('newsletter.jsonl'),
  ]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Διαχείριση υποβολών
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Συνδεδεμένος ως <strong>{session.username}</strong>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/plays"
              className="inline-flex items-center gap-2 rounded-full bg-gold hover:bg-gold-600 text-ink px-5 py-2.5 text-sm font-semibold shadow transition-colors"
            >
              Επεξεργασία έργων
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Αποσύνδεση
              </button>
            </form>
          </div>
        </div>

        {/* Επικοινωνία */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Μηνύματα επικοινωνίας{' '}
            <span className="text-gray-400 font-normal">({contact.length})</span>
          </h2>
          {contact.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Δεν υπάρχουν μηνύματα ακόμη.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-gray-900">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Ημ/νία</th>
                    <th className="px-4 py-3">Όνομα</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Μήνυμα</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {contact.map((c, i) => (
                    <tr key={i} className="align-top">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatDate(c.at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {c.name}
                      </td>
                      <td className="px-4 py-3 text-coral-600 dark:text-coral">
                        <a href={`mailto:${c.email}`} className="hover:underline">
                          {c.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-md whitespace-pre-wrap">
                        {c.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            Εγγραφές newsletter{' '}
            <span className="text-gray-400 font-normal">
              ({newsletter.length})
            </span>
          </h2>
          {newsletter.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Δεν υπάρχουν εγγραφές ακόμη.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-gray-900">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Ημ/νία</th>
                    <th className="px-4 py-3">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {newsletter.map((n, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {formatDate(n.at)}
                      </td>
                      <td className="px-4 py-3 text-coral-600 dark:text-coral">
                        <a href={`mailto:${n.email}`} className="hover:underline">
                          {n.email}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

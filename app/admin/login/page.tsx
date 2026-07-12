import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import LoginForm from '../LoginForm';

export const metadata: Metadata = {
  title: 'Σύνδεση διαχειριστή — Σκηνοδέτης',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Ήδη συνδεδεμένος; Πήγαινε στο admin.
  if (await getSession()) redirect('/admin');

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-24 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-8">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1 text-center">
            Διαχείριση
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
            Συνδεθείτε για να δείτε τις υποβολές.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

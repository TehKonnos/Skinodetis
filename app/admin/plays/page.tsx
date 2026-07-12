import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import { readPlays } from '../../lib/plays-store';
import { playSchema } from '../../data/playSchema';
import PlaysEditor from './PlaysEditor';

export const metadata: Metadata = {
  title: 'Επεξεργασία έργων — Σκηνοδέτης',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function AdminPlaysPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const plays = await readPlays();

  // Προτάσεις αυτόματης συμπλήρωσης ανά πεδίο, από τις υπάρχουσες τιμές.
  const suggestions: Record<string, string[]> = {};
  for (const f of playSchema) {
    if (f.type !== 'tags' && f.type !== 'text') continue;
    const vals = new Set<string>();
    for (const p of plays) {
      const v = p[f.key];
      if (Array.isArray(v)) v.forEach((x) => x && vals.add(String(x)));
      else if (v) vals.add(String(v));
    }
    suggestions[f.key] = [...vals].sort((a, b) => a.localeCompare(b, 'el'));
  }

  return <PlaysEditor initialPlays={plays} suggestions={suggestions} />;
}

'use server';

import { redirect } from 'next/navigation';
import { getSession } from '../../lib/auth';
import { readPlays, writePlays } from '../../lib/plays-store';
import type { Play } from '../../data/plays';
import { coercePlay, validatePlay } from '../../data/playSchema';

export interface SaveResult {
  ok: boolean;
  message: string;
  plays: Play[];
}

async function requireSession() {
  if (!(await getSession())) redirect('/admin/login');
}

/**
 * Δημιουργεί ή ενημερώνει ένα έργο.
 * @param originalId το προηγούμενο slug (null για νέο έργο· επιτρέπει μετονομασία)
 */
export async function savePlay(
  originalId: string | null,
  raw: Record<string, unknown>
): Promise<SaveResult> {
  await requireSession();

  const play = coercePlay(raw);
  const errors = validatePlay(play);
  const list = await readPlays();

  if (errors.length > 0) {
    return { ok: false, message: errors.join(' '), plays: list };
  }

  const collision = list.findIndex((p) => p.id === play.id);
  if (collision >= 0 && play.id !== originalId) {
    return {
      ok: false,
      message: `Υπάρχει ήδη έργο με slug «${play.id}».`,
      plays: list,
    };
  }

  const next =
    originalId !== null
      ? list.map((p) => (p.id === originalId ? play : p))
      : [...list, play];

  await writePlays(next);
  return { ok: true, message: 'Αποθηκεύτηκε.', plays: next };
}

export async function deletePlay(id: string): Promise<SaveResult> {
  await requireSession();
  const list = await readPlays();
  const next = list.filter((p) => p.id !== id);
  await writePlays(next);
  return { ok: true, message: 'Διαγράφηκε.', plays: next };
}

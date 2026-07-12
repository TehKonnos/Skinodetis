import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { seedPlays, type Play } from '../data/plays';

/** Τα «ζωντανά» έργα αποθηκεύονται εδώ (επεξεργάσιμα από τον editor). */
const CONTENT_DIR = path.join(process.cwd(), 'content');
const PLAYS_FILE = path.join(CONTENT_DIR, 'plays.json');

/**
 * Διαβάζει τα έργα από το content/plays.json. Αν δεν υπάρχει (πρώτη φορά),
 * επιστρέφει το seed από το plays.ts.
 */
export async function readPlays(): Promise<Play[]> {
  try {
    const raw = await readFile(PLAYS_FILE, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as Play[]) : seedPlays;
  } catch {
    return seedPlays;
  }
}

/** Γράφει ολόκληρη τη λίστα έργων στο content/plays.json (ατομικά). */
export async function writePlays(plays: Play[]): Promise<void> {
  await mkdir(CONTENT_DIR, { recursive: true });
  const tmp = PLAYS_FILE + '.tmp';
  await writeFile(tmp, JSON.stringify(plays, null, 2), 'utf8');
  // rename για ατομική αντικατάσταση (αποφυγή μισογραμμένου αρχείου)
  const { rename } = await import('node:fs/promises');
  await rename(tmp, PLAYS_FILE);
}

import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 ώρες

/** Μυστικό υπογραφής — ορίστε το AUTH_SECRET στο .env.local σε παραγωγή. */
function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    console.warn(
      '[auth] Λείπει το AUTH_SECRET — χρήση ανασφαλούς προεπιλογής (μόνο για dev).'
    );
    return 'dev-insecure-secret-change-me';
  }
  return s;
}

function adminCredentials(): { username: string; password: string } {
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin',
  };
}

/** Σύγκριση σταθερού χρόνου (αποφυγή timing attacks). */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function verifyCredentials(username: string, password: string): boolean {
  const c = adminCredentials();
  // Και οι δύο συγκρίσεις εκτελούνται πάντα, ώστε να μη διαρρέει πληροφορία χρόνου.
  const okUser = safeEqual(username, c.username);
  const okPass = safeEqual(password, c.password);
  return okUser && okPass;
}

function sign(data: string): string {
  return crypto.createHmac('sha256', secret()).update(data).digest('base64url');
}

export function createToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + SESSION_MAX_AGE * 1000 })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token?: string): { username: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return { username: String(data.u) };
  } catch {
    return null;
  }
}

/** Διαβάζει και επαληθεύει τη συνεδρία από το cookie (για Server Components). */
export async function getSession(): Promise<{ username: string } | null> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

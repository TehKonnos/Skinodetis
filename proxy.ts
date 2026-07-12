import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Κλείδωμα ολόκληρου του site με HTTP Basic Auth (ίδιος κωδικός με το /admin).
// Όσο ισχύει, το site είναι ιδιωτικό και δεν γίνεται index από μηχανές αναζήτησης.
// Για να το ξεκλειδώσεις πριν το launch: διάγραψε αυτό το αρχείο (proxy.ts).
export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USERNAME || 'admin';
  const pass = process.env.ADMIN_PASSWORD || '';

  const header = request.headers.get('authorization');
  if (pass && header?.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6)); // "user:pass"
      const sep = decoded.indexOf(':');
      const u = decoded.slice(0, sep);
      const p = decoded.slice(sep + 1);
      if (u === user && p === pass) {
        const res = NextResponse.next();
        res.headers.set('X-Robots-Tag', 'noindex, nofollow');
        return res;
      }
    } catch {
      // αγνόησε — πέφτει στο 401
    }
  }

  return new NextResponse('Απαιτείται σύνδεση.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Skinodetis - Private", charset="UTF-8"',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export const config = {
  // Προστατεύει σελίδες + assets· εξαιρεί μόνο τα εσωτερικά αρχεία του Next.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

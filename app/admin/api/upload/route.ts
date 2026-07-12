import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { getSession } from '../../../lib/auth';

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'application/pdf': 'pdf',
};
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_IMAGE = 8 * 1024 * 1024; // 8 MB
const MAX_PDF = 25 * 1024 * 1024; // 25 MB

export async function POST(req: Request) {
  if (!(await getSession())) {
    return Response.json({ error: 'Μη εξουσιοδοτημένο.' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file');
  const playId = String(form.get('playId') ?? '').replace(/[^a-z0-9-]/g, '');
  const field = String(form.get('field') ?? 'file').replace(/[^a-zA-Z0-9]/g, '');
  const kind = String(form.get('kind') ?? 'image'); // 'image' | 'pdf'

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: 'Δεν βρέθηκε αρχείο.' }, { status: 400 });
  }
  if (kind === 'pdf' && file.type !== 'application/pdf') {
    return Response.json({ error: 'Απαιτείται αρχείο PDF.' }, { status: 400 });
  }
  if (kind === 'image' && !IMAGE_TYPES.includes(file.type)) {
    return Response.json(
      { error: 'Επιτρέπονται μόνο JPG, PNG, WebP ή SVG.' },
      { status: 400 }
    );
  }
  if (file.size > (kind === 'pdf' ? MAX_PDF : MAX_IMAGE)) {
    return Response.json(
      { error: `Το αρχείο είναι πολύ μεγάλο (όριο ${kind === 'pdf' ? '25MB' : '8MB'}).` },
      { status: 400 }
    );
  }

  const slug = playId || 'misc';
  const ext = EXT[file.type] ?? 'bin';
  // Μοναδικό όνομα ανά μεταφόρτωση → αποφυγή stale cache· τα παλιά αρχεία μένουν.
  const stamp = Date.now().toString(36);
  const filename = `${field}-${stamp}.${ext}`;

  const dir = path.join(process.cwd(), 'public', 'plays', slug);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return Response.json({ path: `/plays/${slug}/${filename}` });
}

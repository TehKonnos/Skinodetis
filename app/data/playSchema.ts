import type { Play } from './plays';

// ⚠️ ΜΟΝΑΔΙΚΗ ΠΗΓΗ ΑΛΗΘΕΙΑΣ ΓΙΑ ΤΟΝ EDITOR.
// Ο editor στο /admin/plays παράγεται εξ ολοκλήρου από αυτό το σχήμα.
// Θέλεις νέο πεδίο στα έργα; Πρόσθεσέ το εδώ (και στο interface Play στο
// plays.ts) — η φόρμα, τα defaults και το validation προσαρμόζονται μόνα τους.

export type PlayFieldType =
  | 'slug' // αναγνωριστικό URL
  | 'text' // μονή γραμμή
  | 'textarea' // πολλές γραμμές
  | 'number'
  | 'tags' // λίστα από strings (chips)
  | 'image' // upload εικόνας → path
  | 'pdf' // upload PDF → path
  | 'video'; // YouTube video id

export interface PlayField {
  key: keyof Play;
  label: string;
  type: PlayFieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  /** Να καταλαμβάνει πλήρες πλάτος στη φόρμα. */
  full?: boolean;
  /** Γραμμές για textarea. */
  rows?: number;
}

export const playSchema: PlayField[] = [
  {
    key: 'id',
    label: 'Αναγνωριστικό (slug)',
    type: 'slug',
    required: true,
    help: 'Μόνο πεζά λατινικά και παύλες. Χρησιμοποιείται στο URL: /plays/<slug>. Δεν αλλάζει εύκολα μετά τη δημοσίευση.',
  },
  { key: 'title', label: 'Τίτλος', type: 'text', required: true, full: true },
  {
    key: 'shortDescription',
    label: 'Σύντομη περιγραφή',
    type: 'textarea',
    required: true,
    full: true,
    rows: 2,
    help: 'Εμφανίζεται στις κάρτες της αρχικής.',
  },
  {
    key: 'description',
    label: 'Πλήρης περιγραφή',
    type: 'textarea',
    required: true,
    full: true,
    rows: 9,
    help: 'Κενή γραμμή = νέα παράγραφος.',
  },
  { key: 'author', label: 'Συγγραφέας', type: 'text', required: true },
  { key: 'duration', label: 'Διάρκεια', type: 'text', placeholder: 'π.χ. 60 λεπ.' },
  {
    key: 'ageGroup',
    label: 'Ηλικιακό εύρος (προβολή)',
    type: 'text',
    placeholder: 'π.χ. 5–12',
  },
  {
    key: 'characters',
    label: 'Αριθμός χαρακτήρων',
    type: 'number',
    required: true,
  },
  {
    key: 'categories',
    label: 'Είδη',
    type: 'tags',
    help: 'Π.χ. Εορταστικό, Μιούζικαλ, Περιπέτεια.',
  },
  { key: 'season', label: 'Εποχή', type: 'text', placeholder: 'π.χ. Χριστούγεννα' },
  { key: 'grades', label: 'Τάξεις', type: 'tags' },
  { key: 'ageGroups', label: 'Ηλικιακές ομάδες', type: 'tags' },
  { key: 'audiences', label: 'Κοινό', type: 'tags' },
  { key: 'image', label: 'Εικόνα κάρτας', type: 'image', required: true },
  { key: 'heroImage', label: 'Εικόνα hero', type: 'image', required: true },
  { key: 'pdfUrl', label: 'PDF έργου', type: 'pdf', help: 'Προαιρετικό.' },
  {
    key: 'youtubeVideoId',
    label: 'YouTube Video ID',
    type: 'video',
    help: 'Μόνο το ID (π.χ. dQw4w9WgXcQ), όχι όλο το URL. Προαιρετικό.',
  },
];

/** Κενό έργο με defaults ανά τύπο — παράγεται από το σχήμα. */
export function emptyPlay(): Play {
  const p: Record<string, unknown> = {};
  for (const f of playSchema) {
    p[f.key] = f.type === 'number' ? 0 : f.type === 'tags' ? [] : '';
  }
  return p as unknown as Play;
}

/** Καθαρίζει/τυποποιεί ένα raw αντικείμενο σε έγκυρο Play, βάσει σχήματος. */
export function coercePlay(raw: Record<string, unknown>): Play {
  const out: Record<string, unknown> = {};
  for (const f of playSchema) {
    const v = raw[f.key];
    if (f.type === 'number') {
      out[f.key] = typeof v === 'number' ? v : Number(v) || 0;
    } else if (f.type === 'tags') {
      out[f.key] = Array.isArray(v)
        ? v.map((x) => String(x).trim()).filter(Boolean)
        : [];
    } else {
      out[f.key] = v == null ? '' : String(v);
    }
  }
  return out as unknown as Play;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Επιστρέφει λίστα σφαλμάτων (κενή = έγκυρο). Χρησιμοποιείται client + server. */
export function validatePlay(play: Play): string[] {
  const errors: string[] = [];
  for (const f of playSchema) {
    const v = play[f.key];
    if (!f.required) continue;
    if (f.type === 'tags') {
      if (!Array.isArray(v) || v.length === 0)
        errors.push(`«${f.label}»: υποχρεωτικό.`);
    } else if (f.type === 'number') {
      if (typeof v !== 'number' || Number.isNaN(v))
        errors.push(`«${f.label}»: υποχρεωτικός αριθμός.`);
    } else if (!v || String(v).trim() === '') {
      errors.push(`«${f.label}»: υποχρεωτικό.`);
    }
  }
  if (play.id && !SLUG_RE.test(play.id)) {
    errors.push('Το slug πρέπει να έχει μόνο πεζά λατινικά, αριθμούς και παύλες.');
  }
  return errors;
}

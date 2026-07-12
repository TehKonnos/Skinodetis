'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import type { Play } from '../../data/plays';
import { playSchema, emptyPlay, validatePlay, type PlayField } from '../../data/playSchema';
import { savePlay, deletePlay } from './actions';

/* ── Βοηθητικά ─────────────────────────────────────────────── */

// Απλή μεταγραφή ελληνικών σε greeklish για δημιουργία slug.
const GREEK_MAP: Record<string, string> = {
  α: 'a', β: 'v', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'i', θ: 'th',
  ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', π: 'p',
  ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'y', φ: 'f', χ: 'ch', ψ: 'ps',
  ω: 'o', ά: 'a', έ: 'e', ή: 'i', ί: 'i', ό: 'o', ύ: 'y', ώ: 'o',
  ϊ: 'i', ϋ: 'y', ΐ: 'i', ΰ: 'y',
};
function slugify(input: string): string {
  return input
    .toLowerCase()
    .split('')
    .map((ch) => GREEK_MAP[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const INPUT =
  'w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold';

/* ── Tag input ─────────────────────────────────────────────── */

function TagInput({
  value,
  onChange,
  listId,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  listId?: string;
}) {
  const [text, setText] = useState('');
  const add = (raw: string) => {
    const t = raw.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setText('');
  };
  return (
    <div className={`${INPUT} flex flex-wrap gap-1.5 items-center`}>
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-coral/15 dark:bg-coral/25 text-coral-600 dark:text-coral text-xs font-medium px-2 py-0.5 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="hover:text-coral-600 dark:hover:text-coral"
            aria-label={`Αφαίρεση ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        list={listId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(text);
          } else if (e.key === 'Backspace' && !text && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => text && add(text)}
        placeholder="Προσθήκη…"
        className="flex-1 min-w-[8ch] bg-transparent outline-none text-sm"
      />
    </div>
  );
}

/* ── File field (upload εικόνας/PDF) ───────────────────────── */

function FileField({
  field,
  value,
  playId,
  onChange,
}: {
  field: PlayField;
  value: string;
  playId: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const kind = field.type === 'pdf' ? 'pdf' : 'image';

  async function upload(file: File) {
    setBusy(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.set('file', file);
      fd.set('playId', playId || 'misc');
      fd.set('field', String(field.key));
      fd.set('kind', kind);
      const res = await fetch('/admin/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Αποτυχία μεταφόρτωσης.');
      onChange(data.path);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Σφάλμα.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {kind === 'image' && value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-16 w-16 object-cover rounded-lg ring-1 ring-black/10"
          />
        )}
        {kind === 'pdf' && value && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-coral-600 dark:text-coral hover:underline"
          >
            Προβολή PDF ↗
          </a>
        )}
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {busy ? 'Μεταφόρτωση…' : value ? 'Αντικατάσταση' : 'Μεταφόρτωση'}
          <input
            type="file"
            accept={kind === 'pdf' ? 'application/pdf' : 'image/*'}
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = '';
            }}
          />
        </label>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ή διαδρομή, π.χ. /plays/slug/image.jpg"
        className={INPUT}
      />
      {err && <p className="text-xs text-red-600 dark:text-red-400">{err}</p>}
    </div>
  );
}

/* ── Κεντρικός editor ──────────────────────────────────────── */

export default function PlaysEditor({
  initialPlays,
  suggestions,
}: {
  initialPlays: Play[];
  suggestions: Record<string, string[]>;
}) {
  const [plays, setPlays] = useState<Play[]>(initialPlays);
  const [draft, setDraft] = useState<Play | null>(null);
  const [originalId, setOriginalId] = useState<string | null>(null); // null = νέο
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function edit(p: Play) {
    setDraft({ ...p });
    setOriginalId(p.id);
    setErrors([]);
    setMessage(null);
  }
  function create() {
    setDraft(emptyPlay());
    setOriginalId(null);
    setErrors([]);
    setMessage(null);
  }
  function duplicate(p: Play) {
    setDraft({ ...p, id: `${p.id}-antigrafo`, title: `${p.title} (αντίγραφο)` });
    setOriginalId(null);
    setErrors([]);
    setMessage(null);
  }
  function set<K extends keyof Play>(key: K, val: Play[K]) {
    setDraft((d) => (d ? { ...d, [key]: val } : d));
  }

  function save() {
    if (!draft) return;
    const errs = validatePlay(draft);
    setErrors(errs);
    if (errs.length) {
      setMessage({ ok: false, text: 'Διόρθωσε τα σφάλματα και προσπάθησε ξανά.' });
      return;
    }
    startTransition(async () => {
      const res = await savePlay(originalId, draft as unknown as Record<string, unknown>);
      setPlays(res.plays);
      setMessage({ ok: res.ok, text: res.message });
      if (res.ok) setOriginalId(draft.id); // πλέον υπάρχει
    });
  }

  function remove() {
    if (!draft || originalId === null) return;
    if (!confirm(`Διαγραφή του έργου «${draft.title}»; Δεν αναιρείται.`)) return;
    startTransition(async () => {
      const res = await deletePlay(originalId);
      setPlays(res.plays);
      setDraft(null);
      setOriginalId(null);
      setMessage({ ok: true, text: 'Το έργο διαγράφηκε.' });
    });
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(plays, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plays.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-coral-600"
            >
              ← Διαχείριση
            </Link>
            <h1 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Επεξεργασία έργων
            </h1>
          </div>
          <button
            onClick={exportJson}
            className="text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Εξαγωγή JSON (backup)
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Λίστα έργων */}
        <aside>
          <button
            onClick={create}
            className="w-full mb-4 bg-gold hover:bg-gold-600 text-ink font-bold py-2.5 px-4 rounded-full text-sm shadow"
          >
            + Νέο έργο
          </button>
          <ul className="space-y-1.5">
            {plays.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => edit(p)}
                  className={`w-full text-left rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    originalId === p.id
                      ? 'bg-gold/20 dark:bg-gold/15 text-ink dark:text-gold font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="block truncate">{p.title || '(χωρίς τίτλο)'}</span>
                  <span className="block text-xs text-gray-400 truncate">{p.id}</span>
                </button>
              </li>
            ))}
            {plays.length === 0 && (
              <li className="text-sm text-gray-400 px-3">Κανένα έργο ακόμη.</li>
            )}
          </ul>
        </aside>

        {/* Φόρμα */}
        <section>
          {!draft ? (
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center text-gray-500 dark:text-gray-400">
              Επίλεξε ένα έργο από τη λίστα ή δημιούργησε ένα νέο.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Ενέργειες + preview link */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={save}
                  disabled={pending}
                  className="bg-gold hover:bg-gold-600 text-ink font-bold py-2.5 px-6 rounded-full text-sm shadow disabled:opacity-60"
                >
                  {pending ? 'Αποθήκευση…' : 'Αποθήκευση'}
                </button>
                <button
                  onClick={() => (originalId ? edit(plays.find((p) => p.id === originalId)!) : setDraft(null))}
                  className="text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Επαναφορά
                </button>
                {originalId && (
                  <>
                    <button
                      onClick={() => duplicate(draft)}
                      className="text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Αντιγραφή
                    </button>
                    <a
                      href={`/plays/${draft.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Προεπισκόπηση ↗
                    </a>
                    <button
                      onClick={remove}
                      disabled={pending}
                      className="ml-auto text-sm font-semibold rounded-full border border-red-300 dark:border-red-800 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-60"
                    >
                      Διαγραφή
                    </button>
                  </>
                )}
              </div>

              {message && (
                <p
                  className={`text-sm font-medium ${
                    message.ok
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {message.text}
                </p>
              )}
              {errors.length > 0 && (
                <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-0.5">
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}

              {/* Live preview κάρτας */}
              <div className="rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-black/5 dark:ring-white/10 p-4 flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {draft.image ? (
                  <img
                    src={draft.image}
                    alt=""
                    className="h-24 w-32 object-cover rounded-lg shrink-0"
                  />
                ) : (
                  <div className="h-24 w-32 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Προεπισκόπηση κάρτας
                  </p>
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">
                    {draft.title || '(τίτλος)'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {draft.shortDescription || '(σύντομη περιγραφή)'}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {draft.categories.map((c) => (
                      <span
                        key={c}
                        className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Πεδία από το σχήμα */}
              <div className="rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-black/5 dark:ring-white/10 p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                {playSchema.map((f) => {
                  const value = draft[f.key];
                  const listId = suggestions[f.key as string]?.length
                    ? `dl-${String(f.key)}`
                    : undefined;
                  return (
                    <div
                      key={String(f.key)}
                      className={f.full || f.type === 'textarea' ? 'sm:col-span-2' : ''}
                    >
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {f.label}
                        {f.required && <span className="text-red-500"> *</span>}
                      </label>

                      {f.type === 'textarea' ? (
                        <textarea
                          rows={f.rows ?? 3}
                          value={String(value ?? '')}
                          onChange={(e) => set(f.key, e.target.value as Play[typeof f.key])}
                          className={`${INPUT} resize-y`}
                        />
                      ) : f.type === 'number' ? (
                        <input
                          type="number"
                          value={Number(value ?? 0)}
                          onChange={(e) =>
                            set(f.key, (Number(e.target.value) || 0) as Play[typeof f.key])
                          }
                          className={INPUT}
                        />
                      ) : f.type === 'tags' ? (
                        <TagInput
                          value={Array.isArray(value) ? (value as string[]) : []}
                          onChange={(v) => set(f.key, v as Play[typeof f.key])}
                          listId={listId}
                        />
                      ) : f.type === 'image' || f.type === 'pdf' ? (
                        <FileField
                          field={f}
                          value={String(value ?? '')}
                          playId={draft.id}
                          onChange={(v) => set(f.key, v as Play[typeof f.key])}
                        />
                      ) : f.type === 'slug' ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={String(value ?? '')}
                            onChange={(e) => set(f.key, e.target.value as Play[typeof f.key])}
                            className={INPUT}
                          />
                          <button
                            type="button"
                            onClick={() => set(f.key, slugify(draft.title) as Play[typeof f.key])}
                            className="whitespace-nowrap text-xs font-semibold rounded-xl border border-gray-300 dark:border-gray-700 px-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            από τίτλο
                          </button>
                        </div>
                      ) : (
                        <input
                          type="text"
                          list={listId}
                          value={String(value ?? '')}
                          placeholder={f.placeholder}
                          onChange={(e) => set(f.key, e.target.value as Play[typeof f.key])}
                          className={INPUT}
                        />
                      )}

                      {f.help && (
                        <p className="text-xs text-gray-400 mt-1">{f.help}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Datalists για autocomplete */}
      {Object.entries(suggestions).map(([key, vals]) =>
        vals.length ? (
          <datalist key={key} id={`dl-${key}`}>
            {vals.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        ) : null
      )}
    </main>
  );
}

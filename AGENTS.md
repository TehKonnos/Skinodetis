<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Σκηνοδέτης — Guide for AI agents & maintainers

Children's theatrical-plays site (Greek UI) for the playwright Παναγιώτης Χρυσίδης.
The owner is **non-technical** and may ask an AI to make changes. Follow these rules so
you don't break the live site or destroy data.

## 🔴 NEVER touch runtime data (irreversible)

These directories hold real user/owner data and are **gitignored** (no backup in git):

- `submissions/` — contact-form messages & newsletter signups (JSONL)
- `content/plays.json` — the live, editable play catalog
- `public/plays/<slug>/` — uploaded thumbnails, hero images, PDFs

**Do NOT** `rm`, overwrite (`>`), move, or "clean up" these. Never write test/sample data
into them. For test fixtures use a temp dir or the scratchpad. Before any destructive
command on a directory, check whether it could contain owner data; if unsure, ask.
(A past cleanup once deleted real submissions — do not repeat it.)

## Content changes → use the editor, not code

Adding/editing plays, images, PDFs, and reading messages is done in the browser at
**`/admin/plays`** and **`/admin`** (password-protected). That's the right tool for the
owner and needs no code or deploy. Only change code for design/features.

## How the app is built (so you don't re-architect by accident)

- **Play data**: `readPlays()` / `writePlays()` in `app/lib/plays-store.ts` read/write
  `content/plays.json`, falling back to the `seedPlays` array in `app/data/plays.ts`.
- **Editor is schema-driven**: the form at `/admin/plays` is generated entirely from
  `app/data/playSchema.ts`. ⚠️ If you change the `Play` fields, update BOTH the `Play`
  interface (plays.ts) AND `playSchema.ts` so the editor stays in sync.
- **Forms**: Server Actions in `app/actions.ts`; submissions saved to `submissions/*.jsonl`;
  contact form also emails via SMTP (`app/lib/mailer.ts`, config in `.env.local`).
- **Auth**: HMAC-signed cookie, `app/lib/auth.ts`; credentials/secret in `.env.local`.
- **Secrets live in `.env.local` only** (gitignored). Never hard-code or commit them.
- **Storage needs a persistent disk** (a VPS), NOT serverless (Vercel) — the app writes
  files at runtime. On serverless those writes vanish.
- Home & detail pages are `force-dynamic` and read live data via `readPlays()`.

## Safe workflow

1. Work with **git** — commit before big changes so anything is revertible.
2. Prefer testing locally (`npm run dev`) before deploying to the live site.
3. To add plays from source PDFs, see the `add-plays` skill in `.claude/skills/`.

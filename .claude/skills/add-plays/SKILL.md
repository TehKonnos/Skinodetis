---
name: add-plays
description: Add one or more theatrical plays to the Σκηνοδέτης site from a source folder of script files (PDF/DOCX), e.g. C:\Users\k.zacharakis\Documents\Sxinodetis\ΣΚΗΝΟΔΕΤΗΣ. Use whenever the user points at such a folder/files and asks to read and add the plays "the way the others were done". Covers extracting metadata, generating thumbnails, and adding entries to the data layer.
---

# Add plays to Σκηνοδέτης

Pipeline for turning Παναγιώτη Χρυσίδη script files into live plays on the site,
matching how the existing plays were added. Author is almost always
**Παναγιώτης Χρυσίδης**.

## 0. Safety first
- NEVER touch `submissions/` or `content/` (real runtime data). See the data-safety memory.
- **Check `content/plays.json`**: if it EXISTS, the public site reads it (not `seedPlays`),
  so new entries added to `seedPlays` will NOT appear. In that case either add the plays
  through the `/admin/plays` editor, or merge the new entries into `content/plays.json` too.
  If it does not exist, editing `seedPlays` is authoritative.

## 1. Explore the source folder
List files recursively. Separate **PDF** (full pipeline possible) from **DOCX-only**
(no PDF → cannot generate a thumbnail or serve a download). For DOCX-only plays, tell the
user you need a PDF export — there is no PDF converter (no libreoffice/soffice) in this env.
Skip plays already on the site (compare titles/ids against `app/data/plays.ts`).
Watch for folder names that differ from the real title inside the file.

## 2. Read each PDF's metadata
Use the committed helper (uses the project's pdfjs-dist; must run from repo root so
node_modules resolves):

```bash
node scripts/extract-pdf-text.mjs "<abs path to pdf>" 3        # first 3 pages
node scripts/extract-pdf-text.mjs "<abs path to pdf>" 6        # more, for cast lists
```

Page 1 is usually the title/cover; pages 2–5 often hold ΠΡΟΣΩΠΑ (cast), ΠΕΡΙΛΗΨΗ
(synopsis), ΣΗΜΕΙΩΜΑ ΣΥΓΓΡΑΦΕΑ, and notes on ΔΙΑΡΚΕΙΑ / ΗΛΙΚΙΑ / τάξη. Pull from these:
title, a 2-paragraph Greek description (grounded in the synopsis — do NOT invent plot),
a one-line shortDescription, character count (count the cast list), duration, age range,
grade, season. If a field isn't stated, estimate conservatively and flag it to the user.

## 3. Copy PDFs into PDFs/ with clean slug names
`cp "<source.pdf>" "PDFs/<slug>.pdf"` — slug = lowercase latin + hyphens (greeklish).

## 4. Generate thumbnails + public PDFs
Add `{ id: '<slug>', pdfName: '<slug>.pdf' }` entries to the array in
`scripts/generate-thumbnails.mjs`, then run:

```bash
node scripts/generate-thumbnails.mjs
```

This copies each PDF to `public/plays/<slug>/play.pdf` and renders page 1 to
`public/plays/<slug>/thumbnail.jpg`. Note: text-only title pages produce plain
thumbnails — tell the user they can upload a nicer cover via the `/admin/plays` editor.

## 5. Add entries to seedPlays
Append a full object per play to `seedPlays` in `app/data/plays.ts`. Every field in the
`Play` interface / `playSchema` must be set:
`id, title, description, shortDescription, categories, season, grades, ageGroups,
audiences, image, heroImage, duration, ageGroup, characters, author, pdfUrl`.
- `image` and `heroImage` → `/plays/<slug>/thumbnail.jpg`; `pdfUrl` → `/plays/<slug>/play.pdf`.
- Taxonomy values (season/grades/ageGroups/audiences/categories) are free strings — new
  values (e.g. "Καλοκαίρι", "Λύκειο", "Έφηβοι (12+)", "28η Οκτωβρίου") automatically appear
  in the "Κατηγορίες" menu and filters. Reuse existing values where they fit for consistency.
- Non-seasonal plays: set `season: ''` (empty is filtered out of the menu).

## 6. Verify
`curl` the home page and a few `/plays/<slug>` detail pages (expect 200), confirm the new
titles appear and that thumbnails serve (`/plays/<slug>/thumbnail.jpg` → 200). A full-page
screenshot may show below-fold cards blank due to lazy-loading — that's a capture artifact,
not a bug; the raw image 200 is the real check.

## 7. Clean up
Remove any temp scripts you created (keep `scripts/extract-pdf-text.mjs` — it's permanent).
Never delete `PDFs/`, `public/plays/`, `content/`, or `submissions/`.

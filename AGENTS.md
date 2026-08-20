# AGENTS.md

This file provides guidance to AI coding agents when working with code in this
repository.

Single-page Astro site that converts YouTube URLs to `yout-ube.com` equivalents. Static build,
published to GitHub Pages at `yt.edbpede.net`.

## Commands

An npm repo — `package-lock.json`, no bun lockfile (`.github/workflows/smoke.yml:38`). All three
workflows install with `npm ci`.

| Command | Purpose |
|---|---|
| `npm ci` | Install exactly what the lockfile pins (what CI does) |
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built site |
| `npm run check` | `astro check` — types across `.ts` **and** `.astro` |
| `npm test` / `test:watch` | `vitest run` / watch (no Vitest config; zero-config `*.test.ts` discovery) |
| `npm run lint` / `lint:fix` | `biome check .` / `biome check --write .` |

Targeted test runs:

```bash
npx vitest run src/utils/youtube-converter.test.ts   # one file
npx vitest run -t "youtu.be short link"              # one case (matches it.each $description)
```

Full gate, in `code-quality.yml` order:

```bash
npx biome ci . && npm run check && npm test && npm run build
```

`npx biome ci .` is the authoritative lint gate, not `npm run lint`. It exits 0 while reporting 4
pre-existing warnings (`noExplicitAny` ×3, `noNonNullAssertion` ×1) in `src/i18n/` — warnings do
not fail CI, so don't treat them as a regression you caused.

**`npm` and `node` may be shell-aliased to bun on this machine.** `npm ci` then silently runs
`bun install`, which writes an untracked `bun.lock` migrated from `package-lock.json`. Delete that
file if it appears, and invoke repo binaries directly (`./node_modules/.bin/vitest`,
`./node_modules/.bin/biome`, `./node_modules/.bin/astro`) when the runner matters.

## Architecture

No adapter, no SSR, no components directory. Three places hold everything:

- `src/utils/youtube-converter.ts` — all URL parsing, validation and conversion. Pure functions,
  no DOM. The only unit-tested module; new conversion logic goes here, not in the page, where it
  would be untestable.
- `src/pages/index.astro` — the entire UI *and* every line of client behaviour in one inline
  `<script>`: form handling, language menu, redirect.
- `src/i18n/` — two deliberately separate modules; see below.

Rendering is two-stage and easy to misread: the frontmatter renders **Danish only** via
`getTranslations(defaultLang)`, then `updateUIText()` rewrites the DOM client-side from the
`language` key in `localStorage`. There are no per-locale routes.

## i18n

| Context | Use | Not |
|---|---|---|
| Astro frontmatter / build time | `getTranslations()` or `t()` from `src/i18n/utils.ts` | `tClient()` — its cache is empty at build time |
| Inline `<script>` / browser | `await loadTranslations(lang)` then `tClient()` from `src/i18n/client-utils.ts` | `t()` — it statically imports both locale JSONs and defeats the code splitting `client-utils.ts` exists for |

`tClient()` returns the key itself and logs a warning if `loadTranslations()` has not run for that
language first. Always await the load.

**Adding a language.** `README.md` lists four steps; the `da`/`en` pair is hardcoded in more places
than that. All of these must change together:

1. `src/i18n/locales/<lang>.json`
2. `src/i18n/utils.ts` — `languages`, `translations`, and the `stored === "da" || stored === "en"`
   guard in `getCurrentLanguage()`
3. `src/i18n/client-utils.ts` — the `if (lang === "da") … else …` branch in `loadTranslations()`
4. `src/pages/index.astro` — a `data-lang` menu button, the `lang === 'da' || lang === 'en'` guard,
   the info-text ternary, and the `currentLanguageSpan` label ternary
5. `astro.config.mjs` — the `i18n.locales` array

**Adding a converter failure mode.** `convertYouTubeUrl` returns an error *key*, never a message
(`emptyInput`, `invalidUrl`, `conversionFailed`), and `showError()` looks it up as
`errors.${errorKey}`. So: return the new key, add `errors.<key>` to **both** locale JSONs
(otherwise the UI renders the raw key string), and add a rejection case to the `it.each` block in
`youtube-converter.test.ts`.

Not every visible string is a locale key: the info-box tip (`src/pages/index.astro:224`) and the
language label (`:233`) are hardcoded `da`/`en` ternaries. Prefer locale JSON for anything new.

## Gotchas

- **`astro.config.mjs` declares `i18n.locales: ["da", "en"]`, but no locale routing is active** —
  `index.astro` is the only page and the build emits exactly one. Don't link to `/en/` or assume
  Astro locale routing; switch languages via `setLanguage()` + `updateUIText()`.
- **`convertYouTubeUrl` does not normalize.** It rejects `youtube.com/watch?v=…` as `invalidUrl`
  because `new URL()` throws without a scheme. Call `normalizeUrl()` first, as
  `src/pages/index.astro:260` does.
- **Biome checks `index.astro` but does not reformat its template markup**, only the frontmatter
  and `<script>` blocks. That markup is tab-indented while `biome.json` sets 2-space indent for JS
  — match the surrounding tabs rather than "fixing" them.
- **Tailwind v4 has no config file.** It is wired through `@tailwindcss/vite` in `astro.config.mjs`
  plus `@import "tailwindcss"` in `src/styles/global.css`. Add design tokens in `global.css`; do
  not create `tailwind.config.js`.
- **Do not hand-edit the `$schema` version in `biome.json`.** A Renovate custom manager
  (`renovate.json`) reads that string as the `@biomejs/biome` version, and the `biome-migrate` job
  in `code-quality.yml` runs `biome migrate --write` and commits back on Renovate branches.
- **Any push to `main` deploys**, unless the head commit message contains `[skip ci]`. The custom
  domain comes from the `cname:` input in `deploy.yml`, not a `public/CNAME` file.
- **Unresolved license conflict:** `package.json` says `"license": "MIT"` while `LICENSE`,
  `README.md` and the page footer all say AGPL-3.0. Ask before changing either side.

## Reference

- `.github/workflows/code-quality.yml` — lint/type/test/build gate and Biome version handling.
  Read before changing CI gating or the Renovate/Biome flow; its header comments explain why
  `biome-migrate` is the only write-capable job.
- `.github/workflows/smoke.yml` — build-serve-load smoke test. Read before extending smoke
  coverage; it documents that it cannot catch client-side breakage, which is where nearly all of
  this app's logic lives.
- `README.md` — user-facing feature list. Treat its "Adding Languages" steps as incomplete
  relative to the list above.

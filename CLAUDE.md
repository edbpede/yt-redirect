# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

This is an **npm** repo — there is no bun lockfile (`.github/workflows/smoke.yml:38`), and all three
workflows install with `npm ci`. If your shell aliases `npm` to `bun`, `npm test` silently runs
`bun test` instead of Vitest; use `npx vitest run` when the runner matters.

| Command | Purpose |
|---|---|
| `npm ci` | Install exactly what `package-lock.json` pins (what CI does) |
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run build` | Static build to `./dist/` |
| `npm run preview` | Serve the built site |
| `npm run check` | `astro check` — types across `.ts` **and** `.astro` |
| `npm test` | `vitest run` (no Vitest config file; zero-config discovery of `*.test.ts`) |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint` / `lint:fix` | `biome check .` / `biome check --write .` |

Targeted runs:

```bash
npx vitest run src/utils/youtube-converter.test.ts   # one file
npx vitest run -t "youtu.be short link"              # one case (matches it.each $description)
```

Full validation, in the same order as `.github/workflows/code-quality.yml`:

```bash
npx biome ci . && npm run check && npm test && npm run build
```

`npx biome ci .` is the authoritative lint gate (not `npm run lint`). It currently reports 4
pre-existing warnings (`noExplicitAny`, `noNonNullAssertion`) in `src/i18n/` and still exits 0 —
warnings do not fail CI, so don't treat them as a regression you caused.

## Architecture Overview

A single prerendered Astro page. No adapter and no SSR: the build emits static files to `dist/`,
which `.github/workflows/deploy.yml` publishes to GitHub Pages at `yt.edbpede.net`.

Three layers matter:

- **`src/utils/youtube-converter.ts`** — all domain logic (URL parsing, validation, conversion to
  `yout-ube.com`). Pure functions, no DOM. This is the only unit-tested module.
- **`src/pages/index.astro`** — the entire UI *and* all client behaviour, in one inline
  `<script>`. There is no components directory; form handling, the language menu, and the redirect
  all live here.
- **`src/i18n/`** — two deliberately separate modules (see the decision table below).

Language handling is two-stage and easy to misread: the frontmatter renders **Danish only** via
`getTranslations(defaultLang)`, then `updateUIText()` rewrites the DOM client-side based on the
`language` key in `localStorage`. There are no per-locale routes.

## Implementation Decisions

| Situation | Use | Avoid |
|---|---|---|
| Astro frontmatter / build-time text | `t()` or `getTranslations()` from `src/i18n/utils.ts` | `tClient` — its cache is empty at build time |
| Browser code in the inline `<script>` | `loadTranslations(lang)` then `tClient()` from `src/i18n/client-utils.ts` | `t()` — it statically imports both locale JSONs and defeats the code splitting `client-utils.ts` exists for |
| New conversion or URL-format logic | Add to `src/utils/youtube-converter.ts` with cases in `youtube-converter.test.ts` | Inline parsing in `index.astro` — it is untestable there |

`tClient()` returns the key and logs a warning if `loadTranslations()` has not run for that language
first. Always await the load.

## Common Change Workflows

### Adding a user-facing string

1. Add the key to **both** `src/i18n/locales/da.json` and `en.json` — same shape in each.
2. Read it with `t()` in frontmatter, or `tClient()` in the inline script.

Note the exception already in the tree: the info-box tip text is a hardcoded `da`/`en` ternary at
`src/pages/index.astro:224`, not a locale key. Prefer locale JSON for anything new.

### Adding a new failure mode to the converter

`convertYouTubeUrl` returns an error **key**, never a message (`emptyInput`, `invalidUrl`,
`conversionFailed`), and `showError()` looks it up as `errors.${errorKey}`. So:

1. Return the new key from `src/utils/youtube-converter.ts`.
2. Add `errors.<key>` to both locale JSONs — otherwise the UI renders the raw key string.
3. Add a rejection case to the `it.each` block in `youtube-converter.test.ts`.

### Adding a language

`README.md` lists four steps; the code actually hardcodes the `da`/`en` pair in more places. All of
these must change together:

1. `src/i18n/locales/<lang>.json`.
2. `src/i18n/utils.ts` — `languages`, `translations`, and the `stored === "da" || stored === "en"`
   guard in `getCurrentLanguage()`.
3. `src/i18n/client-utils.ts` — the `if (lang === "da") … else …` branch in `loadTranslations()`.
4. `src/pages/index.astro` — a `data-lang` menu button, the `lang === 'da' || lang === 'en'` guard,
   the info-text ternary, and the `currentLanguageSpan` label ternary.
5. `astro.config.mjs` — the `i18n.locales` array.

## Critical Gotchas

- **`astro.config.mjs` declares `i18n.locales: ["da", "en"]`, but no per-locale routes exist** —
  `src/pages/index.astro` is the only page. Do not link to `/en/` or assume Astro locale routing is
  active; switch languages through `setLanguage()` + `updateUIText()` instead.
- **Biome does not format Astro template markup**, only the frontmatter and `<script>` blocks.
  `index.astro` markup is tab-indented while `biome.json` sets 2-space indent for JS — match the
  surrounding tabs in that file rather than "fixing" it.
- **Tailwind v4 has no config file.** It is wired through `@tailwindcss/vite` in `astro.config.mjs`
  plus `@import "tailwindcss"` in `src/styles/global.css`. Add design tokens in `global.css`; do not
  create `tailwind.config.js`.
- **Do not hand-edit the `$schema` version in `biome.json`.** A Renovate custom manager
  (`renovate.json`) tracks that string as the `@biomejs/biome` version, and the `biome-migrate` job
  in `code-quality.yml` runs `biome migrate --write` and commits back on Renovate branches.
- **`cssCodeSplit: false` and `inlineStylesheets: "never"`** in `astro.config.mjs` are intentional
  caching choices for this one-page app, as are the comments explaining them. Don't flip them while
  tuning performance without a reason.
- **Any push to `main` deploys.** `deploy.yml` skips only when the head commit message contains
  `[skip ci]`. The custom domain comes from the workflow's `cname:` input, not a `public/CNAME` file.
- **Unresolved license conflict:** `package.json` says `"license": "MIT"` while `LICENSE`,
  `README.md`, and the page footer all say AGPL-3.0. Ask before changing either side.

## Additional Documentation

- `README.md` — read for the user-facing feature list; treat its "Adding Languages" steps as
  incomplete relative to the workflow above.
- `.github/workflows/code-quality.yml` — read before changing lint/type/test gating or touching
  Biome versioning; its header comments explain why `biome-migrate` is the only write-capable job.
- `.github/workflows/smoke.yml` — read before extending smoke coverage; it documents explicitly that
  it cannot catch client-side breakage, which is where most of this app's logic runs.

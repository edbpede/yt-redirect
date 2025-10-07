# YouTube Link Converter

A minimalist web app that converts YouTube links to yout-ube.com equivalents with automatic redirection. Built with Astro, TypeScript, and Tailwind CSS v4.

## Features

- Converts all YouTube URL formats (standard, short, mobile, embed, shorts, live, music)
- Preserves timestamps, playlists, and other parameters
- Bilingual support (Danish/English) with persistent language selection
- Dark mode, responsive design
- Client-side conversion for privacy

## Quick Start

```bash
npm install
npm run dev      # localhost:4321
npm run build    # Build for production
```

## Development

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server |
| `npm run build` | Build to `./dist/` |
| `npm run preview` | Preview production build |
| `npm run check` | Run Astro type checking |

## Adding Languages

1. Copy `src/i18n/locales/en.json` to new language file
2. Update `src/i18n/utils.ts` and `src/i18n/client-utils.ts` with new language
3. Add language option in `src/pages/index.astro`
4. Update `astro.config.mjs` locales array

## License

This project is open source and available under the [GNU Affero General Public License v3.0](LICENSE).

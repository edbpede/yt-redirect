# YouTube Link Converter

A modern, minimalist web application that converts YouTube links to yout-ube.com equivalents with automatic redirection.

## ✨ Features

- 🔄 **Universal YouTube URL Support**: Handles all YouTube URL formats
  - Standard links (`youtube.com/watch?v=...`)
  - Short links (`youtu.be/...`)
  - Mobile links (`m.youtube.com/...`)
  - Embedded links (`youtube.com/embed/...`)
  - Shorts (`youtube.com/shorts/...`)
  - Live videos (`youtube.com/live/...`)
  - YouTube Music links
  - Preserves timestamps, playlists, and other parameters

- 🌍 **Internationalization (i18n)**
  - Danish (da) - Default language
  - English (en)
  - Weblate-compatible translation structure
  - Persistent language selection

- 🎨 **Modern UI/UX**
  - Beautiful, minimalist design
  - Fully responsive (mobile & desktop)
  - Dark mode support
  - Smooth animations and transitions
  - Accessible and user-friendly

- 💪 **TypeScript Throughout**
  - 100% TypeScript codebase
  - Type-safe URL conversion
  - Proper type definitions for all functions

- ⚡ **Built with Modern Tech**
  - Astro 5.14.1
  - Tailwind CSS v4
  - TypeScript (strict mode)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:4321/`

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── da.json          # Danish translations
│   │   │   └── en.json          # English translations
│   │   └── utils.ts             # i18n utilities
│   ├── pages/
│   │   └── index.astro          # Main converter page
│   ├── styles/
│   │   └── global.css           # Global styles with Tailwind
│   └── utils/
│       ├── youtube-converter.ts      # URL conversion logic
│       └── youtube-converter.test.ts # Test suite
├── astro.config.mjs             # Astro configuration
├── tsconfig.json                # TypeScript configuration
└── package.json
```

## 🔧 Configuration

### Tailwind CSS v4

Tailwind CSS v4 is configured via the Vite plugin in `astro.config.mjs`:

```javascript
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### i18n Configuration

The i18n system is configured in `astro.config.mjs`:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'da',
    locales: ['da', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

## 🌐 Adding New Languages

1. Create a new translation file in `src/i18n/locales/`:
   ```bash
   cp src/i18n/locales/en.json src/i18n/locales/fr.json
   ```

2. Translate the content in the new file

3. Update `src/i18n/utils.ts`:
   ```typescript
   import fr from './locales/fr.json';

   export const languages = {
     da: 'Dansk',
     en: 'English',
     fr: 'Français',
   } as const;

   export const translations = {
     da,
     en,
     fr,
   } as const;
   ```

4. Add the language option to the UI in `src/pages/index.astro`

5. Update `astro.config.mjs` to include the new locale

## 🧪 Testing

The project includes a comprehensive test suite for the URL converter. To run tests in the browser console:

1. Open the application in your browser
2. Open the browser console (F12)
3. Run: `runYouTubeConverterTests()`

This will test:
- All YouTube URL format conversions
- Invalid URL rejection
- URL validation
- URL normalization

## 📝 Supported URL Formats

The converter handles these YouTube URL formats:

| Format | Example | Converted To |
|--------|---------|--------------|
| Standard | `youtube.com/watch?v=VIDEO_ID` | `yout-ube.com/watch?v=VIDEO_ID` |
| Short | `youtu.be/VIDEO_ID` | `yout-ube.com/watch?v=VIDEO_ID` |
| Mobile | `m.youtube.com/watch?v=VIDEO_ID` | `yout-ube.com/watch?v=VIDEO_ID` |
| Embed | `youtube.com/embed/VIDEO_ID` | `yout-ube.com/watch?v=VIDEO_ID` |
| Shorts | `youtube.com/shorts/VIDEO_ID` | `yout-ube.com/watch?v=VIDEO_ID` |
| Live | `youtube.com/live/VIDEO_ID` | `yout-ube.com/watch?v=VIDEO_ID` |
| Music | `music.youtube.com/watch?v=VIDEO_ID` | `yout-ube.com/watch?v=VIDEO_ID` |

Parameters like timestamps (`t=`), playlists (`list=`), and indices are preserved.

## 🛠️ Development Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build for production to `./dist/` |
| `npm run preview` | Preview production build |
| `npm run astro` | Run Astro CLI commands |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [GNU Affero General Public License v3.0](LICENSE).

## 🔗 Links

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 💡 Tips

- The application automatically normalizes URLs (adds `https://` if missing)
- Language preference is saved in localStorage
- All conversions happen client-side for privacy
- The app automatically redirects after successful conversion

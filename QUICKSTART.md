# Quick Start Guide

Get up and running with the YouTube Link Converter in 2 minutes!

## 🚀 Start Development Server

The development server is already running at:

**http://localhost:4321/**

If you need to restart it:

```bash
npm run dev
```

## 🧪 Try It Out

### Test URLs

Copy and paste these YouTube URLs to test the converter:

1. **Standard URL**:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```

2. **Short URL**:
   ```
   https://youtu.be/dQw4w9WgXcQ
   ```

3. **With Timestamp**:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s
   ```

4. **YouTube Shorts**:
   ```
   https://www.youtube.com/shorts/dQw4w9WgXcQ
   ```

5. **Without Protocol** (will auto-add https://):
   ```
   youtube.com/watch?v=dQw4w9WgXcQ
   ```

### Expected Behavior

1. Paste a YouTube URL into the input field
2. Click "Convert and Open" (or "Konverter og Åbn" in Danish)
3. The button will show "Converting..." briefly
4. You'll be redirected to the yout-ube.com equivalent

**Note**: The yout-ube.com site itself may or may not work - we're just testing the conversion and redirect functionality.

## 🌍 Test Language Switching

1. Click the language button in the top-right corner (shows current language)
2. Select "English" or "Dansk"
3. Watch all text update instantly
4. Refresh the page - your language choice persists!

## 🧪 Run Automated Tests

1. Open the browser console (F12)
2. Type: `runYouTubeConverterTests()`
3. Press Enter
4. Watch all tests run and pass! ✅

## 📱 Test Responsive Design

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Try different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

## 🌙 Test Dark Mode

1. Enable dark mode in your OS settings
2. Refresh the page
3. The app should automatically use dark theme!

## 🔨 Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## ✅ Verify TypeScript

Check for type errors:

```bash
npm run check
```

Should show: **0 errors, 0 warnings, 0 hints**

## 📖 Learn More

- **Full Documentation**: See [README.md](README.md)
- **Testing Guide**: See [TESTING.md](TESTING.md)
- **i18n Guide**: See [i18n-GUIDE.md](i18n-GUIDE.md)
- **Implementation Details**: See [IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)

## 🎯 Common Tasks

### Add a New Language

1. Copy `src/i18n/locales/en.json` to `src/i18n/locales/[lang].json`
2. Translate the content
3. Update `src/i18n/utils.ts` to import and register the new language
4. Add language option to the UI in `src/pages/index.astro`
5. Update `astro.config.mjs` to include the new locale

See [i18n-GUIDE.md](i18n-GUIDE.md) for detailed instructions.

### Modify Styles

- Global styles: `src/styles/global.css`
- Component styles: Inline in `src/pages/index.astro` using Tailwind classes
- Custom colors: Update CSS variables in `global.css`

### Update Translations

- Danish: `src/i18n/locales/da.json`
- English: `src/i18n/locales/en.json`

After updating, refresh the page to see changes.

## 🐛 Troubleshooting

### Port Already in Use

If port 4321 is already in use:

```bash
npm run dev -- --port 3000
```

### Clear Cache

If you see stale content:

```bash
rm -rf node_modules/.vite
npm run dev
```

### Reset Language

If language switching isn't working:

1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Refresh the page

## 💡 Tips

- **Auto-reload**: The dev server automatically reloads when you save files
- **TypeScript**: VS Code will show type errors in real-time
- **Tailwind**: Use Tailwind IntelliSense extension for autocomplete
- **Testing**: Test with real YouTube URLs from different sources

## 🎉 You're Ready!

The application is fully functional and ready to use. Try converting some YouTube URLs and explore the features!

**Current Status**: ✅ All systems operational

- Development server: Running on http://localhost:4321/
- TypeScript: 0 errors
- Build: Successful
- Tests: All passing

Happy converting! 🚀


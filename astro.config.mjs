// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Use esbuild for fast minification
      minify: 'esbuild',
      // Enable CSS code splitting
      cssCodeSplit: false, // Keep CSS in one file for this small app
    },
  },
  build: {
    // Inline small assets to reduce HTTP requests
    inlineStylesheets: 'never', // We're using critical CSS strategy
  },
  compressHTML: true,
  i18n: {
    defaultLocale: 'da',
    locales: ['da', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

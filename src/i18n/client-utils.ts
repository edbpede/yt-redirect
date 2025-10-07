/**
 * Client-side i18n utilities with dynamic imports
 * This file is separated from utils.ts to enable proper code splitting
 */

import type { Language, TranslationKeys } from './utils';

// Client-side translation cache
const translationCache = new Map<Language, TranslationKeys>();

/**
 * Dynamically load translations for client-side use
 * @param lang - The language code to load
 * @returns Promise with the translation object
 */
export async function loadTranslations(lang: Language): Promise<TranslationKeys> {
  // Check cache first
  if (translationCache.has(lang)) {
    return translationCache.get(lang)!;
  }

  // Dynamically import the translation file
  let translations: TranslationKeys;

  if (lang === 'da') {
    const module = await import('./locales/da.json');
    translations = module.default;
  } else {
    const module = await import('./locales/en.json');
    translations = module.default;
  }

  // Cache it
  translationCache.set(lang, translations);
  return translations;
}

/**
 * Get translation for a specific key path (works with translation object)
 * @param translationObj - The translation object to use
 * @param key - The translation key path (e.g., 'app.title')
 * @returns The translated string
 */
function getTranslationValue(translationObj: any, key: string): string {
  const keys = key.split('.');
  let value: any = translationObj;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get translation from loaded translations (client-side version)
 * @param lang - The language code
 * @param key - The translation key path (e.g., 'app.title')
 * @returns The translated string or key if not found
 */
export function tClient(lang: Language, key: string): string {
  const cachedTranslations = translationCache.get(lang);
  if (!cachedTranslations) {
    console.warn(`Translations for "${lang}" not loaded yet. Call loadTranslations() first.`);
    return key;
  }

  return getTranslationValue(cachedTranslations, key);
}

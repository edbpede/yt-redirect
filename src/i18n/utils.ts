import da from './locales/da.json';
import en from './locales/en.json';

export const languages = {
  da: 'Dansk',
  en: 'English',
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = 'da';

export const translations = {
  da,
  en,
} as const;

export type TranslationKeys = typeof da;

/**
 * Get translation for a specific key path
 * @param lang - The language code
 * @param key - The translation key path (e.g., 'app.title')
 * @returns The translated string
 */
export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to default language if key not found
      value = translations[defaultLang];
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get the current language from localStorage or default
 * @returns The current language code
 */
export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLang;
  }
  
  const stored = localStorage.getItem('language');
  if (stored && (stored === 'da' || stored === 'en')) {
    return stored as Language;
  }
  
  return defaultLang;
}

/**
 * Set the current language in localStorage
 * @param lang - The language code to set
 */
export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

/**
 * Get all translations for a specific language
 * @param lang - The language code
 * @returns The complete translation object
 */
export function getTranslations(lang: Language): TranslationKeys {
  return translations[lang];
}


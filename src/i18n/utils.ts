import da from "./locales/da.json";
import en from "./locales/en.json";

export const languages = {
  da: "Dansk",
  en: "English",
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = "da";

export const translations = {
  da,
  en,
} as const;

export type TranslationKeys = typeof da;

/**
 * Walk a dotted key path through one locale's translation object.
 * @returns The string at that path, or null if the path does not resolve to one.
 */
function resolve(source: TranslationKeys, key: string): string | null {
  let value: unknown = source;

  for (const segment of key.split(".")) {
    if (typeof value !== "object" || value === null || !(segment in value)) {
      return null;
    }
    value = (value as Record<string, unknown>)[segment];
  }

  return typeof value === "string" ? value : null;
}

/**
 * Get translation for a specific key path.
 *
 * Prefer `getTranslations(lang)` and reach for a property directly where the key
 * is known at author time — that is type-checked, and this is not. This exists
 * for the one case where it cannot be: `convertYouTubeUrl` returns an error
 * *key*, which the form looks up as `errors.<key>`.
 *
 * @param lang - The language code
 * @param key - The translation key path (e.g., 'app.title')
 * @returns The translated string, the default language's string if the key is
 *   missing from `lang`, or the key itself if neither has it.
 */
export function t(lang: Language, key: string): string {
  return resolve(translations[lang], key) ?? resolve(translations[defaultLang], key) ?? key;
}

/**
 * Get all translations for a specific language
 * @param lang - The language code
 * @returns The complete translation object
 */
export function getTranslations(lang: Language): TranslationKeys {
  return translations[lang];
}

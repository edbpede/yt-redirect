import { persistentAtom } from "@nanostores/persistent";
import { defaultLang, type Language } from "../../i18n/utils";

/**
 * The interface language, shared by every island on the page and surviving a
 * reload.
 *
 * Two islands need this value — the switcher that sets it and the form that
 * renders in it — and Astro gives separate `client:*` roots no shared module
 * instance to rely on. A nanostore is Astro's documented answer to exactly that,
 * and `@nanostores/persistent` replaces the hand-rolled localStorage read/write
 * that used to live in src/i18n/utils.ts.
 */

/**
 * The localStorage key, unchanged from the pre-migration code.
 *
 * The default encoding is the identity function, so the value on disk is still
 * the bare string "da" or "en" and a visitor who picked English before this
 * migration keeps their choice. Changing either the key or the encoding silently
 * resets everyone.
 */
export const LANGUAGE_STORAGE_KEY = "language";

export const $language = persistentAtom<Language>(LANGUAGE_STORAGE_KEY, defaultLang, {
  encode: (value) => value,
  // Anything that is not a language we ship falls back to the default, which is
  // what the old `getCurrentLanguage()` guard did with its `stored === "da" ||
  // stored === "en"` check.
  decode: (value) => (value === "en" ? "en" : defaultLang),
});

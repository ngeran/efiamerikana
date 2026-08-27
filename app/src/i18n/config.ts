/**
 * Every locale the content model knows about. `el` stays in this union even
 * while Greek is unpublished so the UI strings, section content and schema
 * enum keep type-checking — re-enabling is a one-line change below.
 */
export const locales = ['en', 'el'] as const;

export type Locale = (typeof locales)[number];

/**
 * Locales actually routed on the site: page generation, the EN | ΕΛ switcher
 * and hreflang alternates all derive from this list. Flip Greek back on by
 * adding 'el' here (content lives in src/content/sections/*.el.json).
 */
export const enabledLocales = ['en'] as const satisfies readonly Locale[];

export const defaultLocale: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Narrowing guard for routing: distinguishes published locales from parked ones. */
export function isEnabledLocale(value: unknown): value is (typeof enabledLocales)[number] {
  return typeof value === 'string' && (enabledLocales as readonly string[]).includes(value);
}

/** `en` → `EN`, `el` → `ΕΛ` (the labels shown in the EN | ΕΛ switcher). */
export function localeSwitcherLabel(locale: Locale): string {
  return locale === 'el' ? 'ΕΛ' : 'EN';
}

export function localeHtmlLang(locale: Locale): string {
  return locale;
}

export function localeDisplayName(locale: Locale): string {
  return locale === 'el' ? 'Ελληνικά' : 'English';
}

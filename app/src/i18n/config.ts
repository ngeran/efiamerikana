export const locales = ['en', 'el'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
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

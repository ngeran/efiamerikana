import { defaultLocale, isLocale, locales, type Locale } from './config';

/**
 * Normalize a path to the form `/{locale}/rest/of/path` (always a leading
 * slash, never a trailing slash except for the locale root itself).
 *
 *     normalizePath('')                        → '/'
 *     normalizePath('en')                      → '/en'
 *     normalizePath('/en/')                    → '/en'
 *     normalizePath('/en/how-to-use/')         → '/en/how-to-use'
 */
export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');
  return trimmed === '' ? '/' : `/${trimmed}`;
}

/**
 * Return the locale segment of a normalized path, or the default locale
 * for the bare root.
 *
 *     localeOfPath('/en')          → 'en'
 *     localeOfPath('/el/x')        → 'el'
 *     localeOfPath('/')            → 'en'
 *     localeOfPath('/blog')        → null   (not a localized route)
 */
export function localeOfPath(pathname: string): Locale | null {
  const normalized = normalizePath(pathname);
  if (normalized === '/') return defaultLocale;
  const first = normalized.split('/')[1];
  return isLocale(first) ? first : null;
}

/**
 * Strip the leading locale segment (if any): `/el/how-to-use` → `/how-to-use`.
 */
export function stripLocale(pathname: string): string {
  const normalized = normalizePath(pathname);
  const first = normalized.split('/')[1];
  if (isLocale(first)) {
    const rest = normalized.slice(1 + first.length);
    return rest === '' ? '/' : rest;
  }
  return normalized;
}

/** Prefix a locale-free path with a locale: `localize('/x', 'el')` → `/el/x`. */
export function localize(pathname: string, locale: Locale): string {
  const rest = stripLocale(pathname);
  return rest === '/' ? `/${locale}` : `/${locale}${rest}`;
}

/**
 * Path of the same page in another locale — used by the EN | ΕΛ switcher so
 * it always preserves the equivalent page.
 */
export function switchLocale(pathname: string, target: Locale): string {
  return localize(pathname, target);
}

/** All localized variants of a page (for hreflang link generation). */
export function localeAlternates(pathname: string): Array<{ locale: Locale; path: string }> {
  return locales.map((locale) => ({ locale, path: localize(pathname, locale) }));
}

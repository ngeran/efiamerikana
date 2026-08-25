import { isLocale, defaultLocale, type Locale } from '../i18n/config';

/**
 * Locale encoded in a content-collection entry id.
 *
 *   `en/lemon-potatoes` → 'en'   (folder collections, Decap multiple_folders)
 *   `hero.el`           → 'el'   (singleton files,  Decap multiple_files)
 */
export function entryLocale(id: string): Locale | null {
  const folder = id.match(/^([a-z]{2})\//);
  if (folder) return isLocale(folder[1]) ? folder[1] : null;
  const suffix = id.match(/\.([a-z]{2})$/);
  return suffix && isLocale(suffix[1]) ? suffix[1] : null;
}

/**
 * Entries for a locale; falls back to `fallback` only when the locale has no
 * entries at all (a half-translated collection shows something, never gaps).
 */
export function byLocale<E extends { id: string }>(
  entries: E[],
  locale: Locale,
  fallback: Locale = defaultLocale,
): E[] {
  const primary = entries.filter((e) => entryLocale(e.id) === locale);
  if (primary.length > 0) return primary;
  return entries.filter((e) => entryLocale(e.id) === fallback);
}

/** Exclude draft entries (Decap publish workflow writes `draft: true`). */
export function published<E extends { data: { draft?: boolean } }>(entries: E[]): E[] {
  return entries.filter((e) => !e.data.draft);
}

/** Order by `order` (missing last), tie-break on id for stable output. */
export function ordered<E extends { id: string; data: { order?: number | null } }>(
  entries: E[],
): E[] {
  return [...entries].sort((a, b) => {
    const oa = a.data.order ?? Number.MAX_SAFE_INTEGER;
    const ob = b.data.order ?? Number.MAX_SAFE_INTEGER;
    return oa === ob ? a.id.localeCompare(b.id) : oa - ob;
  });
}

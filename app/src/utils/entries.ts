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
 * Manual `language` frontmatter field, when the entry carries one. Videos and
 * pictures select language per entry in the CMS; the guard keeps this working
 * for callers whose entry type has no `data.language` at all.
 */
function entryLanguage<E extends { id: string }>(e: E): Locale | null {
  const data = (e as { data?: { language?: unknown } }).data;
  return isLocale(data?.language) ? data.language : null;
}

/**
 * Entries for a locale; falls back to `fallback` only when the locale has no
 * entries at all (a half-translated collection shows something, never gaps).
 *
 * The locale comes from the entry's `language` field (manual selection in
 * the CMS) when present, else from the id (`en/foo` folder layout).
 */
export function byLocale<E extends { id: string }>(
  entries: E[],
  locale: Locale,
  fallback: Locale = defaultLocale,
): E[] {
  const localeOf = (e: E): Locale | null => entryLanguage(e) ?? entryLocale(e.id);
  const primary = entries.filter((e) => localeOf(e) === locale);
  if (primary.length > 0) return primary;
  return entries.filter((e) => localeOf(e) === fallback);
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

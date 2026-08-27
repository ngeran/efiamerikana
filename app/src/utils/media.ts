import type { ImageMetadata } from 'astro';
// Committed seed asset — statically imported so the fallback always resolves.
import placeholderImage from '../assets/media/gallery/fig-harvest.svg';

/**
 * Media resolution — CMS entries store media-library paths (e.g.
 * `/media/posters/lemon-potatoes.svg`), while the build resolves them to
 * optimized/bundled assets via import.meta.glob over `src/assets/media`.
 *
 * Storing media under `src/` (not `public/`) is deliberate: it is the only
 * location Astro's asset pipeline optimizes (images) and content-hashes
 * (videos get immutable `/_astro/…` URLs).
 *
 * Missing files NEVER throw: a CMS upload can silently fail while the entry
 * still saves with the new path, and one stale reference used to take the
 * whole page down with a 500. Instead we log loudly on the server and fall
 * back — the placeholder image for images, an empty src (poster-only card)
 * for videos — so the rest of the page always renders.
 */

// import.meta.glob requires literal patterns (no template interpolation).
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/media/**/*.{jpg,jpeg,png,webp,avif,gif,svg}',
  { eager: true },
);

/** Eager `?url` imports for video files → hashed, immutable URLs. */
const videoModules = import.meta.glob<string>('/src/assets/media/**/*.{mp4,webm,mov,m4v}', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** File path → Astro ImageMetadata (unwrapped from the glob modules). */
export const imageImports: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(imageModules).map(([path, mod]) => [path, mod.default]),
);

/** File path → bundled URL for video files. */
export const videoUrls: Record<string, string> = videoModules;

/** Prefixes the CMS may write in front of a media-library-relative path. */
const MEDIA_PREFIXES = ['src/assets/media', 'media'];

/**
 * Normalize any stored CMS media reference to a path relative to
 * `src/assets/media` — e.g. `/media/posters/x.svg`, `posters/x.svg` and
 * `src/assets/media/posters/x.svg` all become `posters/x.svg`.
 */
export function normalizeMediaPath(input: string): string {
  let p = input.trim().replace(/^\//, '');
  for (const prefix of MEDIA_PREFIXES) {
    if (p === prefix) p = '';
    else if (p.startsWith(`${prefix}/`)) p = p.slice(prefix.length + 1);
  }
  return p.replace(/^\/+/, '');
}

function suffixMatch<T>(map: Record<string, T>, relative: string): T | undefined {
  const direct = map[`/src/assets/media/${relative}`];
  if (direct !== undefined) return direct;
  const suffix = `/${relative}`;
  const hit = Object.keys(map).find((key) => key.endsWith(suffix));
  return hit !== undefined ? map[hit] : undefined;
}

/** Resolve a CMS image reference to Astro image metadata (build-time). */
export function resolveImage(input: string): ImageMetadata {
  const relative = normalizeMediaPath(input);
  const found = suffixMatch(imageImports, relative);
  if (found === undefined) {
    console.error(
      `[media] image "${input}" (normalized: "${relative}") not found under src/assets/media — ` +
        `showing the placeholder. Re-upload it via the CMS media library or fix the entry.`,
    );
    return placeholderImage;
  }
  return found;
}

/** Resolve a CMS video reference to a bundled, content-hashed URL. */
export function resolveVideo(input: string): string {
  const relative = normalizeMediaPath(input);
  const found = suffixMatch(videoUrls, relative);
  if (found === undefined) {
    console.error(
      `[media] video "${input}" (normalized: "${relative}") not found under src/assets/media — ` +
        `rendering the poster only. Re-upload it via the CMS media library or fix the entry.`,
    );
    return '';
  }
  return found;
}

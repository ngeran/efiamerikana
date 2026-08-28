// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Dev-only `/media/*` alias onto `src/assets/media`.
 *
 * The Decap admin uses `public_folder: /media` for image URLs (entry
 * previews, editor thumbnails). The real files live under `src/assets/media`
 * so Astro's pipeline optimizes them — a `public/media` copy would duplicate
 * every asset into the build output. This middleware serves the prefix in
 * dev only (`configureServer` never runs in builds), so CMS previews render
 * while deploys stay lean.
 */
const MEDIA_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

function mediaAliasDevPlugin() {
  const mediaRoot = fileURLToPath(new URL('./src/assets/media', import.meta.url));
  return {
    name: 'media-alias-dev',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/media/')) return next();
        const rel = normalize(decodeURIComponent(req.url.slice('/media/'.length).split('?')[0]));
        const file = join(mediaRoot, rel);
        // Containment check: no path traversal outside the media root.
        if (!file.startsWith(mediaRoot) || !existsSync(file) || !statSync(file).isFile()) {
          res.statusCode = 404;
          return res.end('not found');
        }
        res.setHeader(
          'Content-Type',
          MEDIA_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
        );
        createReadStream(file).pipe(res);
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // Canonical origin — override per environment with ASTRO_SITE if needed
  // (e.g. preview deploys). Used for canonical URLs, OG tags and the sitemap.
  site: process.env.ASTRO_SITE ?? 'https://efiamerikana.com',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', el: 'el' },
      },
      // The root page is a meta-refresh redirect to /en/ — keep it out.
      filter: (page) => new URL(page).pathname !== '/',
    }),
  ],
  // Locale routing is fully hand-rolled in src/i18n (routes under
  // src/pages/[lang]/, hreflang + canonical in BaseLayout, EN | ΕΛ switcher).
  // Astro's `i18n` config block is deliberately NOT set: with
  // prefixDefaultLocale it would 404 non-localized pages in dev (e.g. the
  // Decap admin shell at /admin/) and duplicate what src/i18n already does.
  // Tailwind v4 ships as a Vite plugin — no tailwind.config.js, no
  // postcss.config.js; theme lives in CSS (@theme in src/styles/global.css).
  vite: {
    plugins: [tailwindcss(), mediaAliasDevPlugin()],
  },
});

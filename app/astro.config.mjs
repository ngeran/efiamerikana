// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
    plugins: [tailwindcss()],
  },
});

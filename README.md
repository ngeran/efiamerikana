# efiamerikana — bilingual Astro landing page + Decap CMS

Production-ready, modular landing page for Effie Kazantzidis (Greek-American
home cook & UGC creator) with a Git-based editorial workflow. English + Greek,
seven CMS-managed sections, short-form portrait video gallery, black &
white → colour picture gallery, analytics, contact — all editable through
Decap CMS at `/admin/`.

Built on the omni-nix pipeline: `flake.nix` (devShell + reproducible nginx
image) → `just` → k3s / Cloudflare Pages.

---

## 1. Architecture & key decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | **Astro 5.18** (static output), TypeScript `strict` | Zero-JS by default; content layer fits Git-based CMS perfectly |
| Styling | **Tailwind CSS 4.3** via the official `@tailwindcss/vite` plugin | Current recommended integration — no `tailwind.config.js`, tokens live in CSS (`@theme` in `src/styles/global.css`) |
| Fonts | `@fontsource/*` self-hosted (Belleza display, Cantarell body, Smooch Sans labels, Stack Sans Text UI) + Greek-capable fallbacks (Didact Gothic, Open Sans) | No render-blocking third-party requests; Greek subsets download only on `/el/` (unicode-range scoped) |
| CMS | **Decap CMS 3.x** at `/admin/` | Simple Git-based editorial UI, bilingual i18n support, no server needed for the site itself |
| Content | **Astro Content Collections + Zod** (Content Layer `glob` loaders) | Typed, validated CMS content; build fails loudly on schema drift; no unsanitized HTML is ever rendered |
| Media | `src/assets/media/` (not `public/`) | Only location where Astro optimizes images (responsive `srcset`/`sizes`) and content-hashes videos (immutable `/_astro/…` URLs) |
| Client JS | Four tiny vanilla `<script>` bundles (~6 KB total): mobile menu + scroll-spy, video cards, scroll rails, picture toggles | No framework islands needed; every control works without them or degrades gracefully |
| i18n | `prefixDefaultLocale: true` → `/en/`, `/el/`; `EN | ΕΛ` switcher preserves the equivalent page | Locale-aware URLs, hreflang, canonical, per-locale CMS content |
| Registry | `src/data/sections.ts` maps section ids → components; order/enabled lives in CMS settings | Sections reorder/enable/disable from the CMS with zero code changes |

### Section order & required colours

Order (from CMS settings): Hero → Videos → Pictures → About → Analytics →
Contact → Footer.

| Section | Background | Foreground |
| --- | --- | --- |
| Hero | `#ffde59` (required, exact) | charcoal |
| Videos | `#f7f2e7` cream | charcoal |
| Pictures | `#ff1fa9` (required, exact) | charcoal on white cards |
| About | `#17130f` charcoal | cream |
| Analytics | `#000000` (required, exact) | white / yellow / pink |
| Contact | `#d62839` | white |
| Footer | `#17130f` | cream |

All text/background pairs pass WCAG 2.2 AA (verified by axe, see §5).

---

## 2. Project tree

```text
.
├── .claude/skills/astro-landing-page/SKILL.md   # project skill (moved from ./SKILL.md)
├── .envrc                                        # direnv → nix flake shell
├── flake.nix                                     # devShell + nginx OCI image + site
├── justfile                                      # build / push / deploy / cf / relock / test
├── manifests/                                    # k3s Deployment + Service
├── PROMPT.md                                     # the original master prompt
└── app/
    ├── astro.config.mjs                          # i18n, sitemap, tailwind vite plugin
    ├── eslint.config.js / .prettierrc.json / .prettierignore
    ├── playwright.config.ts / vitest.config.ts
    ├── package.json
    ├── public/
    │   ├── admin/index.html                      # Decap CMS shell (CDN bundle)
    │   ├── admin/config.yml                      # complete CMS configuration
    │   ├── robots.txt  favicon.svg
    ├── scripts/seed-media.mjs, seed-entries.mjs  # one-off generators for the committed seeds
    ├── src/
    │   ├── content.config.ts                     # collections + Zod schemas
    │   ├── content/
    │   │   ├── sections/*.{en,el}.json           # singletons: settings, hero, video-section,
    │   │   │                                     #   picture-section, about, analytics, contact, footer
    │   │   ├── videos/{en,el}/*.md               # 6 videos × 2 locales
    │   │   └── pictures/{en,el}/*.md             # 6 pictures × 2 locales
    │   ├── assets/media/                         # CMS media library (SVG + MP4 seeds)
    │   ├── components/
    │   │   ├── layout/ (BaseLayout.astro)
    │   │   ├── navigation/ (SiteHeader.astro)
    │   │   ├── sections/ (Hero, VideoSection, PicturesSection, AboutSection,
    │   │   │            AnalyticsSection, ContactSection, SiteFooter)
    │   │   ├── media/ (VideoCard, PictureCard, MediaScrollRow)
    │   │   └── ui/ (Icon, Button, SectionHeading)
    │   ├── data/sections.ts                      # section registry
    │   ├── i18n/ (config, utils, ui dictionaries)
    │   ├── layouts/ pages/ styles/ utils/
    └── tests/
        ├── unit/        # i18n helpers, entry filtering/ordering, media resolver, UI parity
        ├── component/   # AstroContainer renders (footer, video card)
        └── e2e/         # navigation, language, mobile menu, video, pictures,
                         #   CMS content, overflow sweep, axe accessibility
```

---

## 3. Local development

```bash
direnv allow                    # enter the nix shell (node 22, just, kubectl, …)
cd app && npm install           # first time only

npm run dev                     # http://localhost:4321 → redirects to /en/
npm run build && npm run preview   # production build + local serve
```

Quality gates (all must pass — see §5):

```bash
npm run format:check   # prettier
npm run lint           # eslint (+ astro plugin)
npm run check          # astro check (TypeScript, strict)
npm run test           # vitest unit + component
npm run test:e2e       # Playwright e2e + axe (builds first, then previews)
```

Playwright uses its own Chromium by default (`npx playwright install
chromium`). On this NixOS host, point it at system Chromium:

```bash
PLAYWRIGHT_EXECUTABLE="$(command -v chromium)" npm run test:e2e
```

### Local CMS editing

The admin UI needs Decap's local proxy:

```bash
cd app
npm run admin                   # starts decap-server on :8080
# uncomment `local_backend: true` in public/admin/config.yml
npm run dev                     # open http://localhost:4321/admin/
```

Edits write straight into `src/content/**` and `src/assets/media/**`; the dev
server hot-reloads. Re-comment `local_backend` before committing.

---

## 4. CMS model & editorial workflow

### Collections (public/admin/config.yml)

- **Videos / Pictures** — folder collections with Decap i18n
  (`multiple_folders` → `src/content/<collection>/<locale>/<slug>.md`).
  Editors flip the EN/ΕΛ switcher in the editor UI. Full CRUD: add, edit,
  delete, reorder (`order` number field), draft/publish (`draft` flag), media
  upload (video file, poster, image), metadata (title, description, alt,
  transcript, tag). Layout mode (grid ↔ scroll) is a select on the section
  settings entries.
- **Sections** — files collection with one explicit entry per locale file
  (`hero (English)` / `Πρωτότυπη ενότητα (Ελληνικά)` …). Deliberate: deterministic
  1:1 mapping to Astro's per-locale singletons.
  - *Site settings & section order* — enable/disable + reorder every section,
    set nav labels, site title/description (feeds `<title>`, meta, OG).
  - *Hero* — eyebrow, heading, supporting text, image + alt, layout variant
    (split/center), primary/secondary CTA.
  - *Video/Picture section* — heading, intro, **layout: grid | scroll**.
  - *About* — heading, paragraph list, pull quote, image + alt, CTA.
  - *Analytics* — heading, intro, footnote, metric list (value, label,
    description, icon). Seeded values are clearly labelled placeholders.
  - *Contact* — heading, intro, CTA label, method list (email/phone/location/
    link — the first email method feeds the always-visible header icon),
    social list (tiktok/instagram/facebook/youtube/x).
  - *Footer* — "How to use" link label + optional note. Copyright is dynamic
    (current year), "All rights reserved" from the UI dictionary.

### Publish flow

`publish_mode: simple` — Save → commit to `main` (per-entry, one commit per
change) → CI/pipeline rebuilds. Publishing workflow: edit → set `draft: true`
to hide an entry → uncheck to publish.

### Media

`media_folder: src/assets/media` (editor URL prefix `/media`). Anything
uploaded is optimized/hashed by the build. Seed media are clearly-labelled
placeholders (branded SVGs + tiny 2 s MP4 clips generated by
`scripts/seed-media.mjs`) — replace them via the CMS.

### CMS authentication (production)

The admin UI is static; it needs a Git-provider auth flow in front of GitHub:

1. **Netlify (simplest):** host the site (or just an empty placeholder) on
   Netlify, enable Identity + Git Gateway, invite editors. Then in
   `config.yml` set `backend: { name: git-gateway, repo: ngeran/efiamerikana, branch: main }`.
2. **Self-hosted OAuth:** create a GitHub OAuth App
   (github.com/settings/developers) and run a tiny token-exchange bridge
   (e.g. `decap-oauth` on a small host); point `base_url` at it.

Until one of these is configured, `/admin/` loads but cannot authenticate —
**production editorial access requires this setup**. No credentials, tokens
or secrets are committed.

---

## 5. Testing & accessibility

| Gate | Command | Coverage |
| --- | --- | --- |
| Format | `npm run format:check` | prettier over the whole repo |
| Lint | `npm run lint` | eslint 9 flat config + typescript-eslint + eslint-plugin-astro |
| Types | `npm run check` | `astro check` (strict TS) — 0 errors |
| Unit | `npm run test` | 31 tests: locale path helpers, entry locale/ordering/draft filtering, media resolver (incl. failure modes), EN/EL dictionary parity |
| Component | `npm run test` | AstroContainer renders of footer (EN+EL) and video card (9/16 frame, `preload="none"`, `playsinline`, labels) |
| E2E | `npm run test:e2e` | 102 checks (desktop + mobile Chromium): navigation & scroll-spy, `EN | ΕΛ` switching preserves the page, mobile menu (ARIA, focus trap, Escape, focus restore), video playback + dimensional stability + offscreen pause + `+` overlay, picture grayscale→colour (hover/focus/tap) + scroll rail arrows, CMS content rendering, no-overflow sweep at 320/375/768/1024/1920/2560/3840 × both locales |
| A11y | inside e2e | axe-core (wcag2a/2aa/21a/21aa/22aa) on all four pages × both projects — **0 serious/critical violations**; skip-link + heading-order checks |

---

## 6. Deployment

Two lanes, same reproducible bytes (the Nix-built `packages.site`):

```bash
# k3s (local cluster + registry on :5000)
sudo systemctl start k3s
just build && just push && just deploy     # image: localhost:5000/astro-app:latest

just forward                               # svc :80 → localhost:8080

# Cloudflare Pages (public URL)
wrangler login                             # once
just cf                                    # direct upload of the Nix build
```

Dependencies changed? `cd app && npm install && cd .. && just relock && just build`
(remember: Nix evaluates the **git index** — `git add -A` before building).

### Security headers

The nginx config baked into the image sets, on every response:

- `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'; form-action 'none'` (`unsafe-inline` styles: Tailwind emits a small inline critical block)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`

Container runs as UID 1000, read-only rootfs, all caps dropped (see
`manifests/deployment.yaml`). For Cloudflare Pages set the same CSP via
`_headers` if you deploy there.

---

## 7. Known limitations & next steps

- **CMS thumbnails**: the admin media library previews `/media/…` URLs, which
  exist only at build time (media lives in `src/assets/media` for
  optimization). Editing still works; thumbnails appear after rebuild.
- **Greek display type**: Belleza/Smooch Sans have no Greek glyphs; `/el/`
  headings fall back to Didact Gothic per-subset (clean, slightly different).
- Analytics values are placeholders by design — replace in the CMS.
- Editorial workflow is simple (save = commit). Switch to
  `publish_mode: editorial_workflow` if review stages are wanted.
- The scroll-spy and hover preview are progressive enhancements; without JS
  the site is fully navigable (all content server-rendered).
- Next steps: real media via CMS, OG image, optional contact-form adapter
  (server-side validation + provider-neutral bot protection — none is
  included because no backend is deployed), Lighthouse CI budget in the
  pipeline.

## 8. Acceptance checklist

| Criterion | Status |
| --- | --- |
| All seven sections render; enable/disable/reorder via CMS | ✅ registry + settings entries (e2e asserts all six main sections + footer) |
| EN & EL routes; `EN \| ΕΛ` preserves equivalent page | ✅ e2e `language.spec.ts` |
| Email icon visible at every viewport | ✅ e2e at 320 px |
| Keyboard/touch/pointer navigation | ✅ focus trap, Escape, hover/focus/tap e2e |
| Hero/Pictures/Analytics colours exact (`#ffde59`/`#ff1fa9`/`#000000`) | ✅ theme tokens, used verbatim |
| Grid ↔ scroll layouts via CMS | ✅ select field; videos seeded grid, pictures seeded scroll (both e2e-tested) |
| Video cards dimensionally stable during playback | ✅ bounding-box e2e assertion |
| Pictures grayscale → colour on hover/focus | ✅ computed-filter e2e assertions |
| Full CMS CRUD + reorder + media + metadata | ✅ Decap collections (manual admin flow) |
| No horizontal overflow at 320–3840 px | ✅ e2e sweep, both locales |
| Build, tests, type checks, a11y checks pass | ✅ see §5 (all executed) |
| No secrets or fabricated production data | ✅ placeholder-labelled seeds, `.example` email/handles |

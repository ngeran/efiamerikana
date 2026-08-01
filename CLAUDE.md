# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Hugo static site packaged into a non-root **nginx** OCI image with Nix (no Dockerfile), then deployed to a local **k3s** cluster or to **Cloudflare Pages**. All build/push/deploy logic lives in `flake.nix` + `justfile`; `manifests/` holds the k3s manifests; `site/` is the Hugo source.

This repo follows Nikos's omni-nix dev → Nix image → k3s pipeline (see the `project-pipeline` skill). The `flake.nix` header was generated from the `~/.omni-nix#hugo` template.

The site is a bespoke theme, **`efi-theme`** (brand "Mediterranean Hearth" for creator *Efi Americana*), living under `site/themes/efi-theme/`. Styling is **Tailwind CSS v4**, authored in `site/src/input.css` (`@theme` = the design-token system), compiled in the devShell to a committed `themes/efi-theme/assets/css/main.css` that Hugo serves verbatim. See the *Styling* section below — **the Nix image build still needs no Node**; only dev does.

## Common commands (run via `just`)

The devShell is direnv-loaded (`.envrc` → `use flake`); enter it manually with `just shell` / `nix develop` if direnv isn't active.

| Command | Purpose |
|---|---|
| `just serve` | Hugo dev server with live reload → http://localhost:1313 (drafts on). Source is `./site`. |
| `just tw` | Compile Tailwind v4 (`site/src/input.css`) → committed `themes/efi-theme/assets/css/main.css`. DevShell only. |
| `just tw-watch` | Watch + rebuild Tailwind on change — run alongside `just serve` while styling. |
| `just check` | Validate the Hugo site builds cleanly (catches broken layouts/frontmatter). Fast, no image. |
| `just build` | Build the nginx OCI image with Nix → `result` symlink. |
| `just test` | Local smoke test: loads the image into docker, runs it, curls `/`, expects 200. Needs docker. |
| `just push` | `skopeo copy` the built image to the local registry (`localhost:5000`) over HTTP. (Runs `build` first.) |
| `just deploy` | Apply `manifests/` + `kubectl rollout restart`. (Runs `push` first.) |
| `just logs` | `kubectl logs -f deploy/hugo-site`. |
| `just forward` | Port-forward the Service's :80 → local :8080. |
| `just doctor` | Pre-flight: k3s up, registry reachable, git index clean. Run this before debugging a deploy. |
| `just cf` | Deploy the Nix-built static site to **Cloudflare Pages** (production). |
| `just cf-preview` | Cloudflare Pages preview build (override branch with `CF_BRANCH=…`). |

Full local loop: `just build && just push && just deploy`. Public URL: `just cf`.

k3s is **on-demand** — start it before deploying: `sudo systemctl start k3s`. The local registry must be reachable at `localhost:5000` (`just doctor` checks both).

## Architecture — the non-obvious bits

**Nix reads the git INDEX, not the worktree.** `flake.nix` copies the site with `cp -r ${./site}/.`, and Nix's path filtering evaluates the *staged* index. Unstaged edits to `site/` or `flake.nix` are **invisible** to `nix build` — you'll build stale bytes and chase a phantom bug. After changing site content or the flake, `git add` the files (or run `just doctor`, which warns about this) before building.

**The image is built without Docker.** `packages.image` uses `pkgs.dockerTools.buildImage`; `just build` produces a `result` symlink to the image tarball, and `just push` uploads it with `skopeo copy` (no docker daemon needed for the k3s path). `just test` is the one place docker is required.

**Hugo builds OFFLINE and reproducibly — including the CSS.** Tailwind is precompiled in the devShell (`just tw`) and the output is committed at `site/themes/efi-theme/assets/css/main.css`, which Hugo fingerprints via a pure-Go pipe (`resources.Get | fingerprint`, no binary). So `nix build` / `just build` need **no Node, no network** — the lock/hash step belongs to dev only (see *Styling* below), never to the image build. The only JS (`assets/js/main.js`, mobile-nav + scroll-reveal) goes through the same offline fingerprint pipe.

## Styling — Tailwind v4 (dev-only Node)

The design system lives in **`site/src/input.css`** as a Tailwind v4 `@theme` (colors, fluid type scale via `clamp()`, hard-offset shadows, `--radius-media`). Every token becomes a utility (`bg-saffron`, `text-headline-xl`, `shadow-red`, …). Templates under `site/themes/efi-theme/layouts/` use utility classes directly; the few things utilities can't express (mobile-nav state, scroll-reveal, chart-draw animation, button/chip components) are plain CSS at the bottom of `input.css`.

- **Compile:** `just tw` (once) or `just tw-watch` (while styling, alongside `just serve`).
- **One-time setup:** `cd site && npm install -D tailwindcss @tailwindcss/cli` (nodejs_22 is in the devShell). `node_modules/` is gitignored; `package.json` + `package-lock.json` are committed.
- **Footgun:** the compiled `main.css` is a generated artifact — **re-run `just tw` before committing** styling changes, or the site ships stale CSS. (Hugo fingerprints it, so a stale file still loads — just with old styles.)
- **Content detection:** `@source "../themes/efi-theme/layouts/**/*.html"` in `input.css` tells Tailwind which templates to scan; only used utilities ship.

**Image name is hardcoded in three places — keep them in lockstep:** `flake.nix` (`imageName`), `justfile` (`image` var), and `manifests/deployment.yaml` (`image:`). Currently `localhost:5000/hugo-site:latest`. Same for the listen port (`8080`, see below).

**nginx runs non-root as UID 1000 on port 8080.** Non-root can't bind <1024, so nginx listens on `8080`; the Service (`manifests/service.yaml`) fronts it on `:80` and targets the container by **named** port `http`. The Deployment sets `runAsUser/runAsGroup/fsGroup: 1000` to match the `config.User = "1000:1000"` baked into the image. nginx.conf has no `user` directive on purpose (it can't switch users when non-root).

**Why nginx.conf overrides every default path:** the image is built `from-scratch`-style (no `/tmp`, no `/var/log/nginx`, read-only store paths). nginx's defaults point pid/logs/temp at read-only store paths and would `mkdir()` fail at startup. The config sends everything writable to `/tmp` (`pid`, all `*_temp_path`), plus `-e /dev/stderr` in `Cmd` so the pre-config error log never touches `/var/log/nginx`. At runtime, the Deployment mounts emptyDirs at `/tmp`, `/var/cache/nginx`, and `/var/log/nginx` (with `readOnlyRootFilesystem: true`); `just test` uses `--tmpfs /tmp` instead. If you change nginx's writable paths, update all three.

## Two deploy targets

- **k3s (default):** local cluster, image pulled from `localhost:5000`. Use `just deploy`. Reach it via `just forward` or the Service's cluster IP.
- **Cloudflare Pages (public):** `just cf` runs `nix build .#site` (the built static site, not the image) and uploads it directly with `wrangler`. One-time setup (wrangler login + `wrangler pages project create efiamerikana --production-branch main`) is noted in the `justfile` header. Same bytes either way.

## Site structure

- **Config** (`site/hugo.toml`): `theme = "efi-theme"`, nav in `[[menu.main]]`, site content (creator, tagline, socials, hero/contact images) in `[params]` — these map 1:1 onto a future CMS `config.yml`.
- **Theme** (`site/themes/efi-theme/`): `layouts/` (baseof + section list/single templates + `partials/` for header/nav/footer/hero/`cards/`/`analytics/`/`img.html`), `assets/css/main.css` (Tailwind output) + `assets/js/main.js`, `archetypes/{videos,pictures}.md`, `static/favicon.svg`, `i18n/en.yaml`, `theme.toml`.
- **Content** (`site/content/`): `_index.md` (home), `about/`, `videos/` (+6 items), `pictures/` (+6 items), `analytics/`, `contact/`. About/analytics/contact are single-page sections rendered via `layouts/<section>/list.html`.
- **Data** (`site/data/analytics.yaml`): the dashboard numbers (metrics, growth x-labels, platform split, geo) — `layouts/analytics/list.html` reads `hugo.Data.analytics`, so editing data updates the dashboard.
- **Images are dual-source:** front matter `image:` accepts a remote URL (used verbatim — current demo placeholders are `lh3.googleusercontent.com/aida-public/…` and **must be replaced with owned assets pre-launch**) or a local page-bundle filename (processed via `.Fill`). See `partials/img.html`.

Brand rule enforced throughout: **UI sharp (0 radius), only media rounded (8px); no soft shadows — hard offset only** (e.g. `shadow-red` = `8px 8px 0 tertiary`). Mobile nav is an accessible JS toggle (`partials/header.html` + `main.js`); breakpoints are Tailwind defaults `md`=768px / `lg`=1024px, matching the spec.

Deferred (post-approval): a Git-based CMS at `/admin/` (Decap/Sveltia), self-hosted fonts, and real analytics numbers.

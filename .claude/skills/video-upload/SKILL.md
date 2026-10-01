---
name: video-upload
description: Add new videos to the efiamerikana media library. Verifies codec/resolution/duration, transcodes to the site's web ladder (HEVC rescue, Cloudflare size limits), generates posters, creates the CMS entry, and verifies the result end to end. Use when the user asks to upload, add, format, or "make proper" a video (e.g. from ~/Downloads), or when they report a video that won't play or is too big.
---

# Video upload pipeline

All commands run from `app/`. The pipeline is idempotent per file — re-running
skips conformant files.

## Step 1 — Inspect the source (never skip)

```bash
ffprobe -v error -show_entries format=duration,size,bit_rate:stream=codec_name,codec_tag_string,width,height,pix_fmt,r_frame_rate -of default=noprint_wrappers=1 <file>
```

Decide per file:

| Finding | Action |
| --- | --- |
| `hvc1` / `hev1` codec (HEVC — TikTok/Instagram downloads) | Transcode (step 3). Chrome/Firefox cannot decode HEVC |
| `moov atom not found` or any ffprobe parse error | **Reject the file.** The transfer was truncated (moov lives at the tail of non-faststart QuickTime files). It is unrecoverable in place — ask the user to re-transfer. Do not copy it into the library |
| Size > 25 MiB | Must be transcoded (step 3 shrinks it); 25 MiB is Cloudflare Pages' per-asset deploy limit |
| Width > 720 or fps > 30 | Transcode (step 3 normalizes to the ladder) |
| Extension uppercase (`.MP4`, `.MOV`) | Rename to lowercase when copying — the asset glob and every script are lowercase-only |
| Already `avc1`, ≤720px, ≤30fps, faststart, ≤10 MB | Copy as-is; step 3 will pass it through |

## Step 2 — Copy into the library

```bash
cp <source> src/assets/media/<kebab-or-snake-lowercase-name>.mp4
```

Match the existing naming style (`down-town_web_ready.mp4`, `dunkin.mp4`).
Subfolders under `src/assets/media/` are internal (posters live in `posters/`).

## Step 3 — Transcode to the web ladder

```bash
npm run media:transcode            # HEVC rescue (re-encodes only offenders)
npm run media:normalize -- -n      # optional dry run: full ladder conformity report
npm run media:normalize            # full ladder pass (only touches non-conformant files)
```

The ladder: H.264/`avc1` + AAC 96k, `yuv420p`, ≤720px wide, ≤30fps (only
applied when the source exceeds it — native 24/25fps passes through),
duration-aware bitrate cap, 2s keyframes, `+faststart`. Conformant files are
never re-touched. The transcode script needs `ffmpeg-static` — if its binary
is missing after a fresh `npm ci`, run `npm install-scripts approve ffmpeg-static && npm rebuild ffmpeg-static`.

## Step 4 — Posters

```bash
npm run media:posters
```

Extracts the first frame to `src/assets/media/posters/<name>.jpg`. The card
resolves it by filename convention (`autoPosterFor`) — no CMS field needed.

## Step 5 — CMS entry

Create `src/content/videos/<name>.md` (frontmatter MUST include the `---`
delimiters — omitting them is a build failure):

```markdown
---
language: en
title: '<Human title>'
order: <int — existing entries use 1, 4, 5, 6, 100, 101>
video: <name>.mp4
draft: false
---
```

Optional fields: `description`, `tag`, `transcript`, `posterAlt`,
`orientation` (portrait/landscape/square — defaults to portrait), `draft`
(default false). `language: en` entries appear on `/en/` only; Greek needs a
separate entry. The editor can also do this later in `/admin/` (Decap).

## Step 6 — Verify

```bash
ffprobe -v error -show_entries format=duration,size:stream=codec_name,codec_tag_string,width,height,pix_fmt -of default=noprint_wrappers=1 src/assets/media/<name>.mp4
```

Checklist — all must hold before reporting success:

- `h264` / `avc1`, `yuv420p`, width ≤ 720, fps ≤ 30, `aac` audio
- faststart: `moov` byte offset < `mdat` offset in the first MB of the file
- size ≤ 25 MiB (Cloudflare hard limit); the ladder targets a ~10 MB budget
  via the duration-aware cap — long clips land near 10 MB by design
- `npm run build` succeeds and `dist/_astro/` contains the content-hashed
  asset; no `[media]` warnings in the build output (those mean a missing file)
- `npx playwright test tests/e2e/video.spec.ts` passes

## Library-size side effects

- 6+ videos flips the rail into its infinite-loop phase (`LOOP_MIN = 6` in
  `VideoSection.astro`): three DOM copies, clones carry posters only. The
  e2e suite is mode-aware — no action needed.
- The first six videos are the decoder/LRU budget's design load; nothing to
  configure.

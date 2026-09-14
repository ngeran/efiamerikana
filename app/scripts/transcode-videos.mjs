// @ts-check
/**
 * Keeps videos under src/assets/media browser-playable and web-sized.
 *
 * Two passes:
 *  1. Codec rescue (default): TikTok/Instagram downloads are frequently HEVC
 *     (hvc1/hev1). Chrome, Firefox and most non-Safari browsers refuse to
 *     decode HEVC, so the file uploads fine, serves fine (HTTP 200 video/mp4)
 *     and still shows as a black box that never plays. Re-encoding to avc1 +
 *     AAC + yuv420p + faststart makes every video play everywhere.
 *  2. Web-ladder normalisation (--all): even H.264 files that predate the
 *     ladder (1080p-sourced bitrates, oversize, slow-start atom order) are
 *     re-encoded to one conformant shape — ≤720px wide, ≤30fps, CRF 26 under
 *     a duration-aware bitrate cap, 2s keyframes, faststart — so every rail
 *     clip starts as fast as the small files on a hand-tuned Framer site.
 *
 * The cap is DURATION-AWARE on purpose: a flat maxrate never shrinks a
 * long clip whose average is already below it (the 107s down-town clip sat
 * at 1465 kb/s under a 1800k cap). One constant — SIZE_BUDGET — bounds every
 * file's worst case AND is the conformity threshold, so tightening the
 * budget automatically re-shrinks stale files on the next --all run.
 *
 * Usage: npm run media:transcode          (codec rescue only)
 *        npm run media:normalize          (codec rescue + web ladder)
 *        either with -n                   (dry run: report only)
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { closeSync, openSync, readSync, readdirSync, renameSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ffmpegPath from 'ffmpeg-static';

const MEDIA_ROOT = new URL('../src/assets/media', import.meta.url).pathname;
const dryRun = process.argv.includes('-n') || process.argv.includes('--dry-run');
const normalizeAll = process.argv.includes('--all');

/** Codec fourcc sample entries that browsers can't reliably decode. */
const BAD_CODECS = ['hvc1', 'hev1'];

/**
 * Worst-case bytes any single video may occupy. Doubles as the conformity
 * threshold for --all, so lowering it re-normalises files that were fine
 * under the old, larger budget.
 */
const SIZE_BUDGET = 10 * 1024 * 1024;

/** Ladder targets. 720px portrait reads clean at card size; 30fps is TikTok-native. */
const MAX_WIDTH = 720;
const MAX_FPS = 30;
/** Flat ceiling for short clips (duration-aware cap never exceeds this). */
const CAP_KBPS = 1800;

/**
 * Cloudflare Pages rejects deployments containing any single asset over
 * 25 MiB. We flag at 23 MiB to leave headroom — re-encode with
 * `npm run media:normalize` to shrink, or move the file to R2 for anything
 * that must stay huge.
 */
const OVERSIZE_LIMIT = 23 * 1024 * 1024;

/**
 * The sample-entry fourcc lives inside the moov/stsd box, which faststart
 * puts near the front but un-faststarted files append at the very end — so
 * we sniff both ends of the file instead of pulling the whole thing in.
 */
function sniffCodecs(filePath) {
  const { size } = statSync(filePath);
  const window = Math.min(512 * 1024, size);
  const fd = openSync(filePath, 'r');
  try {
    const head = Buffer.alloc(window);
    readSync(fd, head, 0, window, 0);
    const tail = Buffer.alloc(window);
    readSync(fd, tail, 0, window, Math.max(0, size - window));
    const s = head.toString('latin1') + tail.toString('latin1');
    return ['avc1', 'avc3', 'hvc1', 'hev1', 'av01', 'vp09', 'mp4v'].filter((cc) => s.includes(cc));
  } finally {
    closeSync(fd);
  }
}

/**
 * faststart (moov before mdat) is what lets a browser start playback from a
 * range request instead of downloading the whole tail first. mdat missing
 * from the head window means it starts later than moov by definition.
 */
function moovFirst(filePath) {
  const { size } = statSync(filePath);
  const window = Math.min(1024 * 1024, size);
  const fd = openSync(filePath, 'r');
  try {
    const head = Buffer.alloc(window);
    readSync(fd, head, 0, window, 0);
    const s = head.toString('latin1');
    const moov = s.indexOf('moov');
    const mdat = s.indexOf('mdat');
    return moov !== -1 && (mdat === -1 || moov < mdat);
  } finally {
    closeSync(fd);
  }
}

/**
 * Probe via `ffmpeg -i` stderr (no ffprobe binary on this machine — the
 * parser mirrors what the human-readable dump prints). Returns nulls for
 * anything unparseable; callers must treat that as "don't touch the file".
 */
function probeMeta(filePath) {
  const { stderr, status } = spawnSync(ffmpegPath, ['-i', filePath], { encoding: 'utf8' });
  if (status !== 0 && !stderr) return null;
  const duration = (() => {
    const m = stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);
    return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : null;
  })();
  const video = (() => {
    const line = stderr.split('\n').find((l) => l.includes(': Video: '));
    if (!line) return null;
    const dims = line.match(/, (\d+)x(\d+)[, ]/);
    const fps = line.match(/([\d.]+)\s*fps/);
    return {
      width: dims ? Number(dims[1]) : null,
      height: dims ? Number(dims[2]) : null,
      fps: fps ? Number(fps[1]) : null,
    };
  })();
  if (duration === null || !video || video.width === null || video.fps === null) return null;
  return { duration, ...video };
}

/**
 * Duration-aware TOTAL bitrate cap (kbps: video + audio + container slop)
 * that bounds any clip at SIZE_BUDGET. x264's -maxrate is a per-window peak,
 * not an average guarantee, so conformity allows 5% headroom around it.
 */
function capFor(durationS) {
  return Math.min(CAP_KBPS, Math.floor((SIZE_BUDGET * 8) / 1000 / durationS));
}
const AUDIO_KBPS = 96;
const MAX_VIDEO_KBPS = 200; // floor so ultra-long clips still encode watchable
const videoCapFor = (durationS) => Math.max(MAX_VIDEO_KBPS, capFor(durationS) - AUDIO_KBPS);

function isConformant(filePath, meta) {
  if (!meta) return false;
  const codecs = sniffCodecs(filePath);
  if (!codecs.some((cc) => cc === 'avc1' || cc === 'avc3')) return false;
  if (meta.width > MAX_WIDTH || meta.fps > MAX_FPS + 1) return false;
  const avgKbps = (statSync(filePath).size * 8) / 1000 / meta.duration;
  return avgKbps <= capFor(meta.duration) * 1.05 && moovFirst(filePath);
}

/** Recursively collect .mp4/.mov files under root. */
function collectVideos(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectVideos(full));
    else if (/\.(mp4|mov|m4v)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const rel = (file) => join('src/assets/media', file.split('/src/assets/media/')[1] ?? file);

/**
 * One encode path for both passes: HEVC rescues get the same ladder flags as
 * --all normalisations — there is no reason to produce a non-ladder file.
 */
function encode(file, meta) {
  const cap = videoCapFor(meta?.duration ?? 60);
  const tmp = join(MEDIA_ROOT, `.transcoding-${process.pid}-${statSync(file).size}.mp4`);
  const before = statSync(file).size;
  process.stdout.write(`  encoding ${file.split('/').pop()} … `);
  execFileSync(
    ffmpegPath,
    [
      '-y',
      '-i',
      file,
      '-vf',
      `scale='min(${MAX_WIDTH},iw)':-2`,
      '-r',
      String(MAX_FPS),
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '26',
      '-preset',
      'slow',
      '-maxrate',
      `${cap}k`,
      '-bufsize',
      `${cap * 2}k`,
      '-g',
      String(MAX_FPS * 2), // 2s keyframes: fast range-request starts, clean loop restarts
      '-c:a',
      'aac',
      '-b:a',
      '96k',
      '-ac',
      '2',
      '-movflags',
      '+faststart',
      tmp,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] },
  );
  renameSync(tmp, file);
  const after = statSync(file).size;
  console.log(
    `done (${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB, video cap ${cap}k)`,
  );
}

const videos = collectVideos(MEDIA_ROOT);

// ---- Oversize guard (always runs; Cloudflare deploy killer) ---------------
const oversized = videos.filter((file) => statSync(file).size > OVERSIZE_LIMIT);
if (oversized.length > 0) {
  console.log(
    `[media] WARNING: ${oversized.length} file(s) over ${(OVERSIZE_LIMIT / 1048576).toFixed(0)}MB ` +
      `(Cloudflare Pages deploy limit is 25 MiB per asset) — run \`npm run media:normalize\`:`,
  );
  for (const file of oversized) {
    console.log(`  ${file.split('/').pop()} (${(statSync(file).size / 1048576).toFixed(1)}MB)`);
  }
}

// ---- Pass 1: codec rescue (default mode) ----------------------------------
const offenders = videos.filter((file) => {
  const bad = sniffCodecs(file).filter((cc) => BAD_CODECS.includes(cc));
  return bad.length > 0;
});

if (!normalizeAll) {
  if (offenders.length === 0) {
    console.log(`[media] ${videos.length} video(s) scanned — all playable codecs ✓`);
    process.exit(oversized.length > 0 ? 1 : 0);
  }
  console.log(
    `[media] ${offenders.length} of ${videos.length} video(s) need transcoding (HEVC → H.264):`,
  );
  for (const file of offenders) console.log(`  ${rel(file)}`);
  if (dryRun) {
    console.log('[media] dry run — no files written');
    process.exit(0);
  }
  for (const file of offenders) {
    encode(file, probeMeta(file));
  }
  process.exit(0);
}

// ---- Pass 2: web-ladder normalisation (--all) ------------------------------
const jobs = [];
for (const file of videos) {
  const hevc = offenders.includes(file);
  const meta = probeMeta(file);
  if (!meta) {
    console.log(`[media] SKIP (unprobeable) ${rel(file)}`);
    continue;
  }
  if (hevc || !isConformant(file, meta)) {
    jobs.push({ file, meta, why: hevc ? 'HEVC codec' : 'off-ladder' });
  }
}

if (jobs.length === 0) {
  console.log(`[media] ${videos.length} video(s) scanned — all on the web ladder ✓`);
  process.exit(oversized.length > 0 ? 1 : 0);
}

console.log(`[media] ${jobs.length} of ${videos.length} video(s) need normalisation:`);
for (const { file, why } of jobs) console.log(`  ${rel(file)} (${why})`);
if (dryRun) {
  console.log('[media] dry run — no files written');
  process.exit(0);
}
for (const { file, meta } of jobs) {
  encode(file, meta);
}
console.log('[media] normalisation complete — run `npm run media:posters` if frames changed');

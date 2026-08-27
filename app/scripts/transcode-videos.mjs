// @ts-check
/**
 * Transcodes browser-hostile videos under src/assets/media to H.264/AAC.
 *
 * Why: TikTok/Instagram downloads are frequently HEVC (hvc1/hev1). Chrome,
 * Firefox and most non-Safari browsers refuse to decode HEVC, so the file
 * uploads fine, serves fine (HTTP 200 video/mp4) and still shows as a black
 * box that never plays. Re-encoding to avc1 + AAC + yuv420p + faststart makes
 * every video play everywhere.
 *
 * Usage: npm run media:transcode        (scan + transcode in place)
 *        npm run media:transcode -- -n  (dry run: report only)
 */
import { execFileSync } from 'node:child_process';
import { closeSync, openSync, readSync, readdirSync, renameSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ffmpegPath from 'ffmpeg-static';

const MEDIA_ROOT = new URL('../src/assets/media', import.meta.url).pathname;
const dryRun = process.argv.includes('-n') || process.argv.includes('--dry-run');

/** Codec fourcc sample entries that browsers can't reliably decode. */
const BAD_CODECS = ['hvc1', 'hev1'];

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

const videos = collectVideos(MEDIA_ROOT);
const offenders = [];

for (const file of videos) {
  const codecs = sniffCodecs(file);
  const bad = codecs.filter((cc) => BAD_CODECS.includes(cc));
  // av01/vp09 play in modern browsers; only HEVC needs a re-encode.
  if (bad.length > 0) offenders.push({ file, codecs });
}

if (offenders.length === 0) {
  console.log(`[media:transcode] ${videos.length} video(s) scanned — all playable codecs ✓`);
  process.exit(0);
}

console.log(
  `[media:transcode] ${offenders.length} of ${videos.length} video(s) need transcoding (HEVC → H.264):`,
);
for (const { file, codecs } of offenders) {
  console.log(
    `  ${join('src/assets/media', file.split('/src/assets/media/')[1] ?? file)} [${codecs.join(',')}]`,
  );
}

if (dryRun) {
  console.log('[media:transcode] dry run — no files written');
  process.exit(0);
}

const tmp = join(MEDIA_ROOT, `.transcoding-${process.pid}.mp4`);
for (const { file } of offenders) {
  const before = statSync(file).size;
  process.stdout.write(`  transcoding ${file.split('/').pop()} … `);
  execFileSync(
    ffmpegPath,
    [
      '-y',
      '-i',
      file,
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '24',
      '-preset',
      'medium',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-movflags',
      '+faststart',
      tmp,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] },
  );
  renameSync(tmp, file);
  const after = statSync(file).size;
  console.log(`done (${(before / 1e6).toFixed(1)}MB → ${(after / 1e6).toFixed(1)}MB)`);
}

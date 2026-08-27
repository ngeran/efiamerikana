// @ts-check
/**
 * Extracts a still frame from every video in src/assets/media and stores it
 * as a poster image under src/assets/media/posters/.
 *
 * Why: <video preload="none"> with no poster renders as a black card until
 * the visitor interacts — on touch devices there is no hover to wake it, so
 * cards look dead. A generated first-frame poster gives every video a
 * visible, paused thumbnail on page load. Posters are regenerated only when
 * missing or older than their video.
 *
 * Usage: npm run media:posters       (generate/refresh)
 *        npm run media:posters -- -f (force regenerate all)
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ffmpegPath from 'ffmpeg-static';

const MEDIA_ROOT = new URL('../src/assets/media', import.meta.url).pathname;
const POSTERS_DIR = join(MEDIA_ROOT, 'posters');
const force = process.argv.includes('-f') || process.argv.includes('--force');

/** Top-level video files only (subfolders are internal, not CMS-managed). */
const videos = readdirSync(MEDIA_ROOT).filter((f) => /\.(mp4|webm|mov|m4v)$/.test(f));
mkdirSync(POSTERS_DIR, { recursive: true });

let made = 0;
let kept = 0;
for (const video of videos) {
  const videoPath = join(MEDIA_ROOT, video);
  const posterName = `${video.replace(/\.[^.]+$/, '')}.jpg`;
  const posterPath = join(POSTERS_DIR, posterName);

  if (
    !force &&
    statSync(posterPath, { throwIfNoEntry: false })?.mtimeMs > statSync(videoPath).mtimeMs
  ) {
    kept++;
    continue;
  }

  process.stdout.write(`  ${video} → posters/${posterName} … `);
  // Seek 0.5s in so the poster isn't a fade-from-black frame, cap the width
  // at 760px (2x the widest card), and encode as quality-80 JPEG.
  execFileSync(
    ffmpegPath,
    [
      '-y',
      '-ss',
      '0.5',
      '-i',
      videoPath,
      '-frames:v',
      '1',
      '-vf',
      "scale='min(760,iw)':-2",
      '-q:v',
      '4',
      posterPath,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] },
  );
  console.log('done');
  made++;
}

console.log(`[media:posters] ${made} generated, ${kept} up to date, ${videos.length} total`);

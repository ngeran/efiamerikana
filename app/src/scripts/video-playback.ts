/**
 * Centralised autoplay controller for video cards.
 *
 * Replaces the per-card IntersectionObserver, which allowed every card over
 * 50% visible to play — six concurrent decoders on a 2xl grid, which Safari
 * refuses and low-end Android cannot sustain. This keeps a live candidate
 * set (coarse intersection), ranks it by real viewport coverage at decision
 * time (threshold maps go stale between crossings), and plays only the top
 * N. Sources stay unpromoted (`data-src`) until a card actually wins, and
 * are released after the card has been fully off screen for a while.
 *
 * sync()/mute/details wiring lives with the cards (VideoSection.astro);
 * those listeners are attached to the video elements themselves, so they
 * fire for controller-initiated play/pause too — media events don't bubble,
 * which is exactly why they must not be delegated.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Data Saver and slow connections get poster + manual play only. */
const conn = (
  navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
).connection;
const autoplayAllowed =
  conn?.saveData !== true && !/(^|-)2g$/.test(conn?.effectiveType ?? '') && !reducedMotion.matches;

/** Concurrency budget: one on phones, two from lg up where cards are smaller. */
const wide = window.matchMedia('(min-width: 1024px)');
const budget = () => (wide.matches ? 2 : 1);

/** Fraction of the card's area inside the viewport, 0–1. */
function coverage(card: HTMLElement) {
  const r = card.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return 0;
  const x = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) / r.width;
  const y = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height;
  return x * y;
}

/**
 * Promote `data-src` → `src` so nothing is fetched until it is needed —
 * with `preload="none"` the zero-video-bytes-on-load property holds even
 * for the winners until the first play call.
 */
function attachSources(video: HTMLVideoElement) {
  if (video.dataset.attached === 'true') return;
  let promoted = false;
  for (const source of video.querySelectorAll<HTMLSourceElement>('source[data-src]')) {
    source.src = source.dataset.src ?? '';
    promoted = true;
  }
  if (promoted) video.load();
  video.dataset.attached = 'true';
}

/**
 * Release the decoder and buffer for a card that has scrolled well away.
 * Debounced by the caller — detaching during a fling would flash posters
 * on every card that whips past.
 */
function detachSources(video: HTMLVideoElement) {
  if (video.dataset.attached !== 'true') return;
  video.pause();
  for (const source of video.querySelectorAll<HTMLSourceElement>('source[data-src]')) {
    source.removeAttribute('src');
  }
  video.removeAttribute('src');
  video.load();
  video.dataset.attached = 'false';
}

export function initVideoPlayback() {
  /** Cards currently intersecting the viewport. */
  const candidates = new Set<HTMLElement>();
  const detachTimers = new Map<HTMLElement, number>();

  /** Loop clones are decorative; never let one hold a decoder. */
  const allCards = () =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-video-card]')).filter(
      (card) => !card.hasAttribute('aria-hidden'),
    );

  const apply = () => {
    const winners = autoplayAllowed
      ? [...candidates]
          .filter((card) => card.dataset.intent !== 'pause')
          .map((card) => ({ card, score: coverage(card) }))
          .filter((c) => c.score >= 0.5)
          .sort((a, b) => b.score - a.score)
          .slice(0, budget())
          .map((c) => c.card)
      : [];

    for (const card of allCards()) {
      const video = card.querySelector<HTMLVideoElement>('video[data-video]');
      if (!video) continue;

      if (winners.includes(card)) {
        const timer = detachTimers.get(card);
        if (timer !== undefined) {
          window.clearTimeout(timer);
          detachTimers.delete(card);
        }
        attachSources(video);
        // Autoplay can still be refused (decoder pressure, Low Power Mode) —
        // the poster simply stays up.
        if (video.paused) video.play().catch(() => {});
      } else {
        if (!video.paused) video.pause();
        if (!candidates.has(card) && !detachTimers.has(card)) {
          detachTimers.set(
            card,
            window.setTimeout(() => {
              detachTimers.delete(card);
              if (!candidates.has(card)) detachSources(video);
            }, 500),
          );
        }
      }
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const card = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            candidates.add(card);
            const timer = detachTimers.get(card);
            if (timer !== undefined) {
              window.clearTimeout(timer);
              detachTimers.delete(card);
            }
          } else {
            candidates.delete(card);
          }
        }
        apply();
      },
      { threshold: 0 },
    );
    for (const card of allCards()) observer.observe(card);
  }

  wide.addEventListener('change', apply);

  // Manual play must always work, even when autoplay is disallowed.
  document.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-play-toggle]');
    if (!btn) return;
    const card = btn.closest<HTMLElement>('[data-video-card]');
    const video = card?.querySelector<HTMLVideoElement>('video[data-video]');
    if (!card || !video) return;
    if (video.paused) {
      card.dataset.intent = 'play';
      attachSources(video);
      video.play().catch(() => {});
    } else {
      card.dataset.intent = 'pause';
      video.pause();
    }
  });
}

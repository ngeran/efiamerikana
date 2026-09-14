/**
 * Centralised autoplay controller for video cards.
 *
 * Replaces the per-card IntersectionObserver, which allowed every card over
 * 50% visible to play — six concurrent decoders on a 2xl grid, which Safari
 * refuses and low-end Android cannot sustain. This keeps a live candidate
 * set (coarse intersection), ranks it by real viewport coverage at decision
 * time (threshold maps go stale between crossings), and plays only the top
 * N.
 *
 * Buffer lifecycle (the states are derived from data-attached + preload):
 *
 *   UNATTACHED  sources still `data-src`            — 0 bytes on the wire
 *   METADATA    attached, preload="metadata"        — moov only (~100KB)
 *   WARM        attached, preload="auto"            — browser buffers ahead
 *   PLAYING     WARM and !paused                    — decoder active
 *
 * Cards within one viewport of the fold attach at METADATA (moov lands while
 * the visitor is still scrolling, so play() has duration/dimensions ready).
 * Only winners (top-N by coverage) warm to `auto` — pre-warming every near
 * card would pull several full videos per scroll step, and winners fetch
 * those bytes at play() anyway. Leaving the fold DEMOTES to `metadata`
 * instead of detaching: removing `src` wipes buffered bytes and guarantees a
 * refetch+rejank on fling-back, while a preload downgrade keeps them.
 *
 * load() discipline: never call it after the initial attach EXCEPT on the
 * metadata→auto promotion (at that point only the moov is buffered, so the
 * reset is cheap — and Chromium needs it to act on the new preload level).
 * A demotion is hint-only, no load().
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
 * Promote `data-src` → `src` and start a METADATA fetch. preload is set
 * BEFORE load() — resource selection reads the attribute at load() time.
 * Latched: a card never re-attaches.
 */
function attachSources(video: HTMLVideoElement) {
  if (video.dataset.attached === 'true') return;
  video.preload = 'metadata';
  let promoted = false;
  for (const source of video.querySelectorAll<HTMLSourceElement>('source[data-src]')) {
    source.src = source.dataset.src ?? '';
    promoted = true;
  }
  if (promoted) video.load();
  video.dataset.attached = 'true';
}

/**
 * METADATA → WARM. On an already-attached video a load() is required for
 * Chromium to honour the raised preload, and is cheap here: only the moov
 * is buffered at this point, so nothing of value is wiped.
 */
function warm(video: HTMLVideoElement) {
  attachSources(video);
  if (video.preload !== 'auto') {
    video.preload = 'auto';
    video.load();
  }
}

/**
 * WARM → METADATA after the card has stayed away. Hint-only: buffered
 * ranges survive, the browser just stops pulling ahead. No load() — it
 * would drop every buffered byte and force a refetch on fling-back.
 */
function demote(video: HTMLVideoElement) {
  if (video.dataset.attached !== 'true') return;
  if (video.preload !== 'metadata') video.preload = 'metadata';
}

export function initVideoPlayback() {
  /** Cards currently intersecting the real viewport (drives winners). */
  const candidates = new Set<HTMLElement>();
  const demoteTimers = new Map<HTMLElement, number>();

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

    // A card the visitor explicitly started keeps its decoder even outside
    // the winner ranking — one user-requested decoder is bounded, and the
    // next apply() sweep would otherwise kill it mid-play. The pin only
    // holds WHILE the card is a candidate: off screen the controller owns
    // playback and pauses everything, user-started or not.
    const pinned = allCards().filter(
      (card) => card.dataset.intent === 'play' && candidates.has(card) && !winners.includes(card),
    );

    for (const card of allCards()) {
      const video = card.querySelector<HTMLVideoElement>('video[data-video]');
      if (!video) continue;

      if (winners.includes(card) || pinned.includes(card)) {
        const timer = demoteTimers.get(card);
        if (timer !== undefined) {
          window.clearTimeout(timer);
          demoteTimers.delete(card);
        }
        if (winners.includes(card)) warm(video);
        // Autoplay can still be refused (decoder pressure, Low Power Mode) —
        // the poster simply stays up.
        if (video.paused && (autoplayAllowed || card.dataset.intent === 'play')) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) video.pause();
        if (!candidates.has(card) && !demoteTimers.has(card)) {
          demoteTimers.set(
            card,
            window.setTimeout(() => {
              demoteTimers.delete(card);
              if (!candidates.has(card)) demote(video);
            }, 2000),
          );
        }
      }
    }
  };

  if ('IntersectionObserver' in window) {
    // TWO observers with separate jobs. The winner observer must stay
    // margin-less: crossings of the REAL viewport are what re-rank playback,
    // and a card below the fold crosses a margin'd root's threshold at page
    // load — its subsequent scroll into view would fire nothing and nobody
    // would call play(). The NEAR observer only pre-attaches metadata, where
    // an early crossing is exactly what we want.
    const winnerObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const card = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            candidates.add(card);
            const timer = demoteTimers.get(card);
            if (timer !== undefined) {
              window.clearTimeout(timer);
              demoteTimers.delete(card);
            }
          } else {
            candidates.delete(card);
          }
        }
        apply();
      },
      { threshold: 0 },
    );
    const nearObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const card = entry.target as HTMLElement;
          // Attach at METADATA while the visitor is still scrolling — the
          // moov lands early, so a later play() needs no round trip.
          if (autoplayAllowed) {
            const video = card.querySelector<HTMLVideoElement>('video[data-video]');
            if (video) attachSources(video);
          }
        }
      },
      // Vertical pre-roll only: a card one viewport above/below attaches its
      // moov; horizontal stays tight so rail neighbours off-screen stay at 0
      // bytes until they can actually be seen.
      { rootMargin: '100% 0px', threshold: 0 },
    );
    for (const card of allCards()) {
      winnerObserver.observe(card);
      nearObserver.observe(card);
    }
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
      warm(video);
      video.play().catch(() => {});
    } else {
      card.dataset.intent = 'pause';
      video.pause();
    }
    apply();
  });
}

/**
 * Centralised autoplay controller for video cards.
 *
 * Replaces the per-card IntersectionObserver, which allowed every card over
 * 50% visible to play — six concurrent decoders on a 2xl grid, which Safari
 * refuses and low-end Android cannot sustain. This keeps a live candidate
 * set (coarse intersection), ranks it by real viewport coverage at decision
 * time, and plays only the top N.
 *
 * Ranking details that are easy to get wrong:
 *
 *  - Coverage is normalised by the SMALLER of card/viewport extent. Against
 *    its own height, the 9:16 rail card on a landscape phone tops out near
 *    28% and can never pass a 0.5 gate — yet it is the only thing visible.
 *    "Fills the screen" must score 1.0 regardless of which side is smaller.
 *  - Winners re-rank on observer thresholds [0, .25, .5, .75, 1], on scroll
 *    quiescence / scrollend, and on resize. Threshold 0 alone has a blind
 *    spot: the mobile rail's centered card enters at ~0% coverage and its
 *    edges then stay inside the viewport — with no later neighbour crossing
 *    to re-rank it, it would sit fully visible and paused forever.
 *  - Hysteresis: an incumbent winner keeps its slot unless a challenger
 *    beats it by a clear margin. Without it, two cards near parity trade
 *    the slot on every crossing and the decoders thrash.
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
 * load() discipline: winners attach straight at `auto` (one load(), not a
 * metadata load aborted by a second one the same tick). After that, load()
 * runs only when nothing is buffered yet: Chromium re-evaluates the preload
 * level on load(), but on a RE-promotion — played, demoted, now back in
 * view — load() would drop every buffered byte and reset currentTime to
 * 0:00, which is precisely what demote-without-load exists to avoid. play()
 * drives buffering regardless, so skipping it costs at most some
 * pre-buffering while paused.
 *
 * Memory ceiling: attachments latch, so a long scroll across a growing
 * library would pile up media elements forever — each holds a decoder
 * handle and (until the browser evicts) buffered bytes, and iOS Safari and
 * low-end Android run out of both. An LRU over attached cards bounds it:
 * past MAX_ATTACHED, the oldest card that is neither on screen nor near
 * the fold is fully DETACHED — sources return to data-src, load() releases
 * the element, the attach latch clears, and the next near-crossing
 * re-attaches from scratch. The reset playback position is correct there:
 * a card evicted that far away starts over as a fresh visit.
 *
 * Visitor intent: ONE slot, last tap wins. A 'play' focus keeps its decoder
 * outside the winner ranking while the card stays on screen (one
 * user-requested decoder is bounded); a 'pause' focus is exempt from
 * autoplay. Both expire when the card leaves the viewport — off-screen the
 * controller owns playback entirely, and a stale focus must not resurrect a
 * decoder (or suppress autoplay) for a card the visitor scrolled past.
 *
 * Autoplay refusals (Low Power Mode, decoder pressure) latch per card so a
 * sweep never hammers play(); the latch clears on viewport re-entry or tap.
 *
 * Audio hygiene: the controller re-mutes whenever IT pauses a card. A card
 * the visitor unmuted, scrolled away from and returned to must not blast
 * sound on its own — and on Safari an unmuted play() after the gesture
 * expires is refused outright. The delegated volumechange sync below keeps
 * the mute UI in step.
 *
 * Visibility: hidden tabs and bfcache entry pause everything (looping video
 * decodes behind your back otherwise, and a bfcache restore would resume
 * the unmuted solo card mid-word); returning re-applies the policy.
 *
 * Card state — data-playing/muted/open/started, the accessible names, the
 * mute-icon lines — is synced by delegated CAPTURE listeners on document:
 * media events don't bubble but DO traverse the capture path, so one sync
 * function sees every path (controller play/pause, the audio-solo
 * re-mutes, button toggles alike) and nothing scales with the card count.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Data Saver and slow connections get poster + manual play only. */
type ConnectionInfo = {
  saveData?: boolean;
  effectiveType?: string;
  // Not present in older WebKit — guarded with ?. at the call site.
  addEventListener?: (type: string, listener: () => void) => void;
};
const conn = (navigator as Navigator & { connection?: ConnectionInfo }).connection;
// Re-computed on `change` inside initVideoPlayback — a visitor toggling
// Save Data (or the network degrading) mid-session must not keep the
// load-time policy.
let autoplayAllowed =
  conn?.saveData !== true && !/(^|-)2g$/.test(conn?.effectiveType ?? '') && !reducedMotion.matches;

/** Concurrency budget: one on phones, two from lg up where cards are smaller. */
const wide = window.matchMedia('(min-width: 1024px)');
const budget = () => (wide.matches ? 2 : 1);

/** A challenger must beat an incumbent winner by this much to take its slot. */
const HYSTERESIS = 0.15;

/**
 * Fraction of the viewport the card fills, 0–1, measured against the SMALLER
 * of card/viewport extent per axis.
 */
function coverage(card: HTMLElement) {
  const r = card.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return 0;
  const x =
    Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) /
    Math.min(r.width, innerWidth);
  const y =
    Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) /
    Math.min(r.height, innerHeight);
  return x * y;
}

/**
 * Promote `data-src` → `src` and start a fetch at `preload`. preload is set
 * BEFORE load() — resource selection reads the attribute at load() time.
 * Latched via data-attached so repeat calls are no-ops; only the LRU prune
 * (a full detach) clears the latch and allows a fresh attach.
 */
function attachSources(video: HTMLVideoElement, preload: 'metadata' | 'auto') {
  if (video.dataset.attached === 'true') return;
  video.preload = preload;
  let promoted = false;
  for (const source of video.querySelectorAll<HTMLSourceElement>('source[data-src]')) {
    source.src = source.dataset.src ?? '';
    promoted = true;
  }
  if (promoted) video.load();
  video.dataset.attached = 'true';
}

/**
 * METADATA → WARM (first attach goes straight to WARM — one load(), not a
 * metadata load aborted by a second one the same tick). On an
 * already-attached video a load() is required for Chromium to honour the
 * raised preload, but ONLY when nothing is buffered: a re-promoted card has
 * buffered bytes and a playback position that load() would wipe (see the
 * load() discipline note above).
 */
function warm(video: HTMLVideoElement) {
  if (video.dataset.attached !== 'true') {
    attachSources(video, 'auto');
    return;
  }
  if (video.preload === 'auto') return;
  video.preload = 'auto';
  if (video.buffered.length === 0 && video.currentTime === 0) video.load();
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

/**
 * Card-level presentation sync: mirrors the video's live state onto the
 * card's data-* attributes, the accessible names (labels come from
 * data-label-* attributes so this module stays free of user-facing
 * strings), and the mute-icon cross lines. Driven by the delegated capture
 * listeners below — which is why controller-initiated play/pause and the
 * audio-solo re-mutes stay in sync without trusting any button handler.
 */
function syncCard(card: HTMLElement, video: HTMLVideoElement) {
  const playing = !video.paused && !video.ended;
  card.dataset.playing = String(playing);
  card.dataset.muted = String(video.muted);
  for (const line of card.querySelectorAll<SVGLineElement>('[data-mute-line]')) {
    line.style.display = video.muted ? 'block' : 'none';
  }

  const playBtn = card.querySelector<HTMLButtonElement>('[data-play-toggle]');
  if (playBtn) {
    const playLabel = playBtn.dataset[playing ? 'labelPause' : 'labelPlay'];
    if (playLabel) playBtn.setAttribute('aria-label', playLabel);
  }

  const muteBtn = card.querySelector<HTMLButtonElement>('[data-mute-toggle]');
  if (muteBtn) {
    const muteLabel = muteBtn.dataset[video.muted ? 'labelUnmute' : 'labelMute'];
    if (muteLabel) muteBtn.setAttribute('aria-label', muteLabel);
  }
}

export function initVideoPlayback() {
  // The document-level listeners below must never stack: under Astro view
  // transitions (or any future DOM swap that re-runs init) a second call
  // would double every toggle. Full VT support (teardown + re-observe) is
  // a separate piece of work; this only makes re-init a safe no-op.
  if (document.documentElement.hasAttribute('data-video-playback-bound')) return;
  document.documentElement.setAttribute('data-video-playback-bound', '');

  /** Cards currently intersecting the real viewport (drives winners). */
  const candidates = new Set<HTMLElement>();
  const demoteTimers = new Map<HTMLElement, number>();

  /** Autoplay-refused latch: sweeps must not hammer a refused play(). */
  const blocked = new WeakSet<HTMLElement>();

  /**
   * The one card the visitor explicitly started or paused — last tap wins.
   */
  let focus: { card: HTMLElement; mode: 'play' | 'pause' } | null = null;

  /** Winner slots from the previous sweep — incumbency anchors hysteresis. */
  let incumbents: HTMLElement[] = [];

  /** Loop clones are decorative; never let one hold a decoder. */
  const allCards = () =>
    Array.from(document.querySelectorAll<HTMLElement>('[data-video-card]')).filter(
      (card) => !card.hasAttribute('aria-hidden'),
    );

  const videoOf = (card: HTMLElement) => card.querySelector<HTMLVideoElement>('video[data-video]');

  /** Cards inside the near zone (±1 viewport) — attachable but off-screen. */
  const near = new Set<HTMLElement>();

  /**
   * Attached cards, oldest first (Set iteration order; touch() re-inserts).
   * The eviction pool for the memory ceiling.
   */
  const attachedOrder = new Set<HTMLElement>();

  /** Live media elements tolerated before the LRU starts detaching. */
  const MAX_ATTACHED = 6;

  /**
   * Full detach — the reverse of attachSources: sources return to data-src
   * (zero bytes on the wire), preload resets, and load() releases the
   * element's decoder and drops every buffered byte. Deliberately the
   * violent reset that demote refuses to be: the card has been away for
   * the entire eviction distance, so restarting from 0:00 on return reads
   * as intent rather than glitch. The latch clears, so the next
   * near-crossing re-attaches exactly like a first visit.
   */
  const detachCard = (card: HTMLElement, video: HTMLVideoElement) => {
    video.pause();
    for (const source of video.querySelectorAll<HTMLSourceElement>('source[src]')) {
      source.setAttribute('data-src', source.getAttribute('src') ?? '');
      source.removeAttribute('src');
    }
    video.preload = 'metadata';
    video.load();
    video.removeAttribute('data-attached');
    attachedOrder.delete(card);
  };

  /**
   * Enforce the memory ceiling: detach LRU-oldest attached cards until the
   * pool fits, skipping anything the visitor can still reach — on screen
   * (candidates), in the near zone, or explicitly started. If everything
   * attached is protected, the cap is simply soft this sweep.
   */
  const prune = () => {
    if (attachedOrder.size <= MAX_ATTACHED) return;
    const focusCard = focus?.card ?? null;
    for (const card of attachedOrder) {
      if (attachedOrder.size <= MAX_ATTACHED) break;
      if (card === focusCard || candidates.has(card) || near.has(card)) continue;
      const video = videoOf(card);
      if (!video || video.dataset.attached !== 'true') {
        // Stale pool entry — never attached, or already detached.
        attachedOrder.delete(card);
        continue;
      }
      detachCard(card, video);
    }
  };

  /** Mark a card freshly used — moves it to the LRU's back. */
  const touch = (card: HTMLElement) => {
    attachedOrder.delete(card);
    attachedOrder.add(card);
  };

  const apply = () => {
    // Focus expires off-screen (see the Visitor intent note above).
    if (focus && !candidates.has(focus.card)) focus = null;

    const limit = budget();
    const paused = focus?.mode === 'pause' ? focus.card : null;

    const ranked = autoplayAllowed
      ? [...candidates]
          .filter((card) => card !== paused)
          .map((card) => ({ card, score: coverage(card) }))
          .filter((c) => c.score >= 0.5)
          .sort((a, b) => b.score - a.score)
      : [];
    const scoreOf = new Map(ranked.map((c) => [c.card, c.score]));

    // Hysteresis: incumbents keep their slots while still qualifying. A
    // challenger takes a free slot, or evicts the weakest incumbent on a
    // clear win — challengers are sorted, so the first failure means every
    // later one fails too.
    let winners = incumbents.filter(
      (card) => candidates.has(card) && card !== paused && (scoreOf.get(card) ?? 0) >= 0.5,
    );
    if (winners.length > limit) {
      winners.sort((a, b) => (scoreOf.get(b) ?? 0) - (scoreOf.get(a) ?? 0));
      winners = winners.slice(0, limit);
    }
    for (const { card, score } of ranked) {
      if (winners.includes(card)) continue;
      if (winners.length < limit) {
        winners.push(card);
        continue;
      }
      let weakest = 0;
      for (let i = 1; i < winners.length; i++) {
        if ((scoreOf.get(winners[i]) ?? 0) < (scoreOf.get(winners[weakest]) ?? 0)) weakest = i;
      }
      if (score >= (scoreOf.get(winners[weakest]) ?? 0) + HYSTERESIS) winners[weakest] = card;
      else break;
    }
    incumbents = winners;

    // A card the visitor explicitly started keeps its decoder even outside
    // the winner ranking. The pin only holds WHILE the card is a candidate
    // (focus expiry above).
    const pinned =
      focus?.mode === 'play' && candidates.has(focus.card) && !winners.includes(focus.card)
        ? [focus.card]
        : [];

    for (const card of allCards()) {
      const video = videoOf(card);
      if (!video) continue;

      if (winners.includes(card) || pinned.includes(card)) {
        touch(card);
        const timer = demoteTimers.get(card);
        if (timer !== undefined) {
          window.clearTimeout(timer);
          demoteTimers.delete(card);
        }
        if (winners.includes(card)) warm(video);
        // Autoplay can still be refused (decoder pressure, Low Power Mode) —
        // the poster simply stays up, and the refusal latches so the next
        // sweep doesn't hammer play() again.
        if (video.paused && !blocked.has(card) && (autoplayAllowed || pinned.includes(card))) {
          video.play().catch(() => {
            blocked.add(card);
            card.dataset.blocked = 'true';
          });
        }
      } else {
        if (!video.paused) {
          // The controller's pause also re-mutes: sound must not come back
          // on its own when the visitor returns (and Safari would refuse an
          // unmuted play() anyway — the gesture is long expired). Muting
          // first leaves no audio window before the pause; the per-card
          // volumechange listener keeps the mute UI in step.
          video.muted = true;
          video.pause();
        }
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

    prune();
  };

  if ('IntersectionObserver' in window) {
    // TWO observers with separate jobs. The winner observer carries a
    // threshold ladder (every 25% of coverage re-ranks); the NEAR observer
    // only pre-attaches metadata, where an early crossing is exactly what
    // we want.
    const winnerObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const card = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            candidates.add(card);
            // Fresh viewport entry = fresh autoplay chance: a Low Power
            // Mode refusal from the last visit must not stick forever.
            blocked.delete(card);
            card.removeAttribute('data-blocked');
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
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    const nearObserver = new IntersectionObserver(
      (entries) => {
        let attachedNew = false;
        for (const entry of entries) {
          const card = entry.target as HTMLElement;
          if (!entry.isIntersecting) {
            // Left the near zone — now evictable by the LRU prune.
            near.delete(card);
            continue;
          }
          near.add(card);
          // Attach at METADATA while the visitor is still scrolling — the
          // moov lands early, so a later play() needs no round trip.
          if (autoplayAllowed) {
            const video = videoOf(card);
            if (video) {
              attachSources(video, 'metadata');
              touch(card);
              attachedNew = true;
            }
          }
        }
        if (attachedNew) prune();
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

  // Safety net for coverage changes no threshold catches (fast flings that
  // outpace the observer, browser zoom): re-rank when scrolling settles.
  // scrollend bubbles up from the rail's scroll container; the quiescence
  // timer covers Safari builds without the event.
  let quiesceTimer = 0;
  window.addEventListener(
    'scroll',
    () => {
      window.clearTimeout(quiesceTimer);
      quiesceTimer = window.setTimeout(apply, 150);
    },
    { passive: true },
  );
  window.addEventListener('scrollend', apply);
  let resizeRaf = 0;
  window.addEventListener(
    'resize',
    () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(apply);
    },
    { passive: true },
  );

  // Policy is not load-time-frozen: Save Data, effectiveType and
  // prefers-reduced-motion changes take effect on the next sweep.
  const reevaluate = () => {
    autoplayAllowed =
      conn?.saveData !== true &&
      !/(^|-)2g$/.test(conn?.effectiveType ?? '') &&
      !reducedMotion.matches;
    apply();
  };
  reducedMotion.addEventListener('change', reevaluate);
  conn?.addEventListener?.('change', reevaluate);

  /** Hidden tab / bfcache entry: stop decoders and kill audio. */
  const pauseAll = () => {
    for (const card of allCards()) {
      const video = videoOf(card);
      if (video && !video.paused) {
        video.muted = true;
        video.pause();
      }
    }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseAll();
    else apply();
  });
  window.addEventListener('pagehide', pauseAll);
  window.addEventListener('pageshow', (event) => {
    // Bfcache restore resumes media on its own — re-assert the policy.
    if (event.persisted) apply();
  });

  /**
   * Card-state sync, delegated in CAPTURE phase. Media events don't bubble
   * but DO traverse the capture path, so one listener set sees every video
   * on the page — controller-initiated play/pause, the audio-solo re-mutes
   * below, button toggles alike. 'playing' additionally latches the poster
   * reveal: the lazy overlay must cover the element until the first frame
   * is actually up ('playing' means frames are rendered; 'play' can still
   * be a paint away, and Safari flashes black in between). Once started, a
   * paused video keeps its last rendered frame, so the overlay never needs
   * to come back.
   */
  const onCardMediaEvent = (event: Event) => {
    const video = event.target as HTMLVideoElement;
    if (!video.matches('video[data-video]')) return;
    const card = video.closest<HTMLElement>('[data-video-card]');
    if (!card) return;
    if (event.type === 'playing') {
      card.dataset.started = 'true';
      return;
    }
    syncCard(card, video);
  };
  for (const type of ['play', 'pause', 'volumechange', 'playing'] as const) {
    document.addEventListener(type, onCardMediaEvent, true);
  }

  /**
   * One audio feed site-wide: unmuting any video mutes every other one.
   * Videos keep playing — sight is cheap, the audio channel is singular
   * (the TikTok/YouTube-embed pattern). Capture phase, because media
   * events don't bubble but DO traverse the capture path, so this funnels
   * EVERY unmute path through one policy rather than trusting each button.
   */
  document.addEventListener(
    'volumechange',
    (event) => {
      const video = event.target as HTMLVideoElement;
      // React to un-mutes only, and only our cards.
      if (video.muted || !video.matches('video[data-video]')) return;
      for (const other of document.querySelectorAll<HTMLVideoElement>('video[data-video]')) {
        if (other !== video) other.muted = true;
      }
    },
    true,
  );

  // Button wiring, also delegated. The play surface is a toggle (and the
  // controller's intent slot — last tap wins); mute flips the video's audio
  // channel (the volumechange capture listener syncs the card); details
  // expands the metadata overlay.
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    const detailsBtn = target.closest<HTMLButtonElement>('[data-details-toggle]');
    if (detailsBtn) {
      const card = detailsBtn.closest<HTMLElement>('[data-video-card]');
      const open = detailsBtn.getAttribute('aria-expanded') !== 'true';
      detailsBtn.setAttribute('aria-expanded', String(open));
      if (card) card.dataset.open = String(open);
      const label = detailsBtn.dataset[open ? 'labelHide' : 'labelShow'];
      if (label) detailsBtn.setAttribute('aria-label', label);
      return;
    }

    const muteBtn = target.closest<HTMLButtonElement>('[data-mute-toggle]');
    if (muteBtn) {
      const card = muteBtn.closest<HTMLElement>('[data-video-card]');
      const video = card?.querySelector<HTMLVideoElement>('video[data-video]');
      if (card && video) {
        video.muted = !video.muted;
        syncCard(card, video);
      }
      return;
    }

    // Manual play must always work, even when autoplay is disallowed.
    const btn = target.closest<HTMLButtonElement>('[data-play-toggle]');
    if (!btn) return;
    const card = btn.closest<HTMLElement>('[data-video-card]');
    const video = card?.querySelector<HTMLVideoElement>('video[data-video]');
    if (!card || !video) return;
    touch(card);
    blocked.delete(card);
    card.removeAttribute('data-blocked');
    if (video.paused) {
      focus = { card, mode: 'play' };
      warm(video);
      video.play().catch(() => {
        blocked.add(card);
        card.dataset.blocked = 'true';
      });
    } else {
      focus = { card, mode: 'pause' };
      video.pause();
    }
    apply();
  });

  // Initial pass: labels and mute-icon state must be correct before any
  // event fires (the SSR markup hardcodes the muted default).
  for (const card of allCards()) {
    const video = videoOf(card);
    if (video) syncCard(card, video);
  }
}

/**
 * Shared horizontal media rail: arrow navigation, snap-aware scroll targets,
 * and (when the section renders 3× card copies, `data-sets="3"`) a seamless
 * infinite loop.
 *
 * Extracted from the duplicated inline scripts in VideoSection.astro and
 * PicturesSection.astro, which had already drifted apart.
 *
 * Loop mechanics — the parts that are easy to get wrong:
 *  - `scrollTo({ behavior: 'instant' })` for the normalisation jumps: the
 *    rails carry Tailwind `scroll-smooth`, and CSSOM scroll assignments
 *    follow `scroll-behavior` — a plain `scrollLeft = x` would ANIMATE a
 *    full copy-width flick through every card. ('auto' in the options does
 *    NOT override the stylesheet; only 'instant' does.)
 *  - Normalisation runs on scroll quiescence (~150ms) or `scrollend`, never
 *    mid-momentum: WebKit clobbers programmatic `scrollLeft` writes during
 *    iOS momentum scrolling. `scrollend` is feature-detected via the event
 *    name, because Safari 26.2 ships the event but not `onscrollend`.
 *  - Copy width comes from `offsetLeft` deltas (integers). Summing fractional
 *    `getBoundingClientRect()` widths drifts subpixels, and a sub-pixel-off
 *    landing makes scroll-snap visibly re-settle after the jump.
 *  - Parking is lazy (first intersection) and re-parks only on rail WIDTH
 *    change: the pictures section is `content-visibility: auto`, so rail
 *    geometry reads before it is layout-relevant are garbage, and mobile
 *    URL-bar height-only resizes must not yank the reader back to center.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Below `sm` the visible card is centre-snapped with margin either side (see
 * RAIL_CARD in the sections); from `sm` up cards tile flush against the row
 * start. The scroll target maths must match whichever mode is active or the
 * programmatic scroll lands short of where CSS snap actually settles.
 */
const centered = window.matchMedia('(max-width: 639.98px)');

export interface RailOptions {
  /** Selector for the wrapper that holds the arrows and the rail. */
  wrap: string;
  /** Selector for an individual card inside the rail. */
  card: string;
}

export function initRails({ wrap, card: cardSelector }: RailOptions) {
  for (const wrapEl of document.querySelectorAll<HTMLElement>(wrap)) {
    const rail = wrapEl.querySelector<HTMLElement>('[data-rail]');
    if (!rail) continue;

    /** Card copies rendered in the DOM; 1 = bounded rail, 3 = infinite loop. */
    const sets = Math.max(1, Number(wrapEl.dataset.sets ?? '1'));

    const cards = () => Array.from(rail.querySelectorAll<HTMLElement>(cardSelector));

    /**
     * Which card the rail is parked closest to — keeps swipes and arrows in
     * sync. In loop mode only the MIDDLE copy is scanned: every card exists
     * at identical pixel offsets in all three copies, and tie-breaking
     * toward an outer copy makes the arrows advance once and then stick.
     */
    const currentIndex = () => {
      const list = cards();
      if (list.length === 0) return 0;
      const per = Math.floor(list.length / sets);
      let closest = sets > 1 ? per : 0;
      let closestDist = Infinity;
      list.forEach((el, i) => {
        if (sets > 1) {
          const copy = Math.floor(i / per);
          if (copy !== 1) return; // middle copy only
        }
        const dist = Math.abs(el.offsetLeft - rail.offsetLeft - rail.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      return closest;
    };

    const scrollToIndex = (index: number) => {
      const list = cards();
      if (list.length === 0) return;
      const wrapped = ((index % list.length) + list.length) % list.length;
      const target = list[wrapped];
      const left = centered.matches
        ? (() => {
            const railRect = rail.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const targetCenter =
              targetRect.left - railRect.left + rail.scrollLeft + targetRect.width / 2;
            return targetCenter - rail.clientWidth / 2;
          })()
        : target.offsetLeft - rail.offsetLeft;
      // The global reduced-motion CSS rule can't reach a JS scroll behaviour.
      rail.scrollTo({ left, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    // ---- Infinite loop (inert while sets === 1) --------------------------
    // No "programmatic scroll in flight" flag is needed: normalisation only
    // ever runs from scroll-settle callbacks (scrollend / ~150ms quiescence),
    // so it can never fire mid-animation and fight an arrow's smooth scroll.

    /** Width of one card-list copy, from integer offset deltas. */
    const copyWidth = () => {
      const list = cards();
      const per = Math.floor(list.length / sets);
      if (sets < 2 || per < 1 || list.length < per * 2) return 0;
      return list[per].offsetLeft - list[0].offsetLeft;
    };

    const jumpBy = (dx: number) => {
      rail.scrollTo({ left: rail.scrollLeft + dx, behavior: 'instant' as ScrollBehavior });
    };

    /**
     * Keep scrollLeft inside the middle copy's span `[w, 2w)`: one copy-width
     * jump, invisible because the pixels a copy away are identical. The band
     * check is idempotent — a jump can never re-trigger itself, so there is
     * no normalise ping-pong.
     *
     * Whenever the rail can scroll at all (`clientWidth < w`) the maximum
     * scrollLeft is `3w + padding - clientWidth ≥ 2w`, so both hard ends are
     * always reachable by this correction: scrolling into copy 0 or copy 2
     * gets pulled back into the band instead of stopping at a visible seam.
     * (A viewport-edge trigger instead fires, subtracts a copy, lands below
     * `w`, and the next tick adds it back — oscillating forever.)
     */
    const normalise = () => {
      const w = copyWidth();
      if (!w) return;
      if (rail.scrollLeft >= w * 2) jumpBy(-w);
      else if (rail.scrollLeft < w) jumpBy(w);
    };

    const park = () => {
      const w = copyWidth();
      if (!w) return;
      rail.scrollTo({ left: w, behavior: 'instant' as ScrollBehavior });
    };

    if (sets > 1) {
      // Lazy park: never read rail geometry before the section is actually
      // laid out (content-visibility skips below-fold sections).
      const parkWhenSeen = new IntersectionObserver(
        (entries, obs) => {
          if (entries.some((e) => e.isIntersecting)) {
            park();
            obs.disconnect();
          }
        },
        { threshold: 0.01 },
      );
      parkWhenSeen.observe(rail);

      let quiesceTimer = 0;
      const scheduleNormalise = () => {
        window.clearTimeout(quiesceTimer);
        quiesceTimer = window.setTimeout(normalise, 150);
      };

      rail.addEventListener('scroll', scheduleNormalise, { passive: true });
      // Feature-detect by event name: Safari 26.2 ships `scrollend` but not
      // the `onscrollend` property, so `'onscrollend' in rail` would lie.
      rail.addEventListener('scrollend', normalise);

      // Re-park on rail WIDTH change only — mobile URL-bar resizes change
      // height and must not yank the visitor back to the middle copy.
      let lastWidth = 0;
      window.addEventListener(
        'resize',
        () => {
          requestAnimationFrame(() => {
            const width = rail.clientWidth;
            if (lastWidth !== 0 && width !== lastWidth) park();
            lastWidth = width;
          });
        },
        { passive: true },
      );
    }

    // ---- Arrows ----------------------------------------------------------
    for (const btn of wrapEl.querySelectorAll<HTMLButtonElement>('[data-rail-scroll]')) {
      btn.addEventListener('click', () => {
        const dir = Number(btn.dataset.railScroll ?? '1');
        const list = cards();
        if (list.length === 0) return;
        const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
        // Step by however many cards are fully visible, so one click advances
        // a full "screen" rather than nudging by a single card.
        const cardSpan = list[0].getBoundingClientRect().width + gap;
        const visible = Math.max(1, Math.round(rail.clientWidth / cardSpan));
        scrollToIndex(currentIndex() + dir * visible);
      });
    }
  }
}

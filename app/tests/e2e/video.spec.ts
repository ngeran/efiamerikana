import { expect, test } from '@playwright/test';

test.describe('video section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/');
  });

  test('renders a card per video with posters and lazy playback attrs', async ({ page }) => {
    const section = page.locator('#videos');
    // Count-agnostic on purpose: entries are CMS-managed. The loop phase may
    // also multiply DOM copies behind data-sets, so assert ≥1 and uniqueness
    // of the details-overlay ids rather than an exact total.
    const cards = section.locator('[data-video-card]');
    expect(await cards.count()).toBeGreaterThanOrEqual(3);

    // :not([inert]) skips the loop's clone copies (inert is a bare boolean
    // attribute; with data-sets=1 nothing is inert, so this is a no-op there).
    // Interaction tests below need a REAL card: clones are aria-hidden (the
    // playback controller skips them) and parked off-screen by the loop's
    // normalise, which would fight scrollIntoViewIfNeeded forever.
    const real = cards.locator(':not([inert])').first();
    // Assert the SSR preload hint BEFORE scrolling: once the card is in view
    // the controller may promote the preload to 'auto' and the metadata
    // assertion would race the promotion.
    await expect(real.locator('video[data-video]')).toHaveAttribute('preload', 'metadata');
    // The poster is a lazy <img> overlay — the video element itself carries
    // no poster attribute (Chromium fetches those eagerly at render time,
    // viewport notwithstanding).
    await expect(real.locator('video[data-video]')).not.toHaveAttribute('poster');
    await expect(real.locator('[data-video-poster]')).toHaveAttribute('src', /.+/);
    await expect(real.locator('[data-video-poster]')).toHaveAttribute('loading', 'lazy');
    await real.scrollIntoViewIfNeeded();
    await expect(real.locator('video[data-video]')).toHaveAttribute('playsinline', '');
    await expect(real.locator('video[data-video]')).toHaveAttribute('muted', '');

    // The metadata overlay is always on now (no toggle) — its title text
    // ships in every card's SSR.
    await expect(real.locator('.media-overlay-gradient h3')).not.toBeEmpty();
  });

  test('arrows exist only while more items remain, and step one card', async ({ page }) => {
    test.skip(
      test.info().project.name === 'mobile-chromium',
      'arrows are sm+ only — phones use the native swipe',
    );
    // 900px sits between sm and lg: two slots, three shipped videos → the
    // rail overflows by exactly one card. (At the stock 1280 viewport all
    // three fit and the arrows retire entirely — covered in the fit test.)
    await page.setViewportSize({ width: 900, height: 700 });
    await page.goto('/en/');
    const section = page.locator('#videos');
    await section.scrollIntoViewIfNeeded();
    const rail = section.locator('[data-rail]');
    const next = section.locator('[data-rail-scroll="1"]');
    const prev = section.locator('[data-rail-scroll="-1"]');

    // Start of the rail: nothing to the left — no left arrow.
    await expect(prev).toBeHidden();
    await expect(next).toBeVisible();

    // Center mode steps ONE card, and each stop lands the active card
    // exactly on the midline (900 / 2).
    const centerOf = (locator: ReturnType<typeof page.locator>) => async () => {
      const box = await locator.boundingBox();
      return box ? box.x + box.width / 2 : 0;
    };
    const cards = page.locator('[data-video-card]:not([inert])');
    await next.click();
    await expect.poll(centerOf(cards.nth(1))).toBeCloseTo(450, -1);

    // Loop rails never retire the arrows — there is always another copy.
    // Bounded rails walk to the far end, where the next arrow retires
    // exactly there while the prev arrow is back for the return trip.
    const looping =
      (await section.locator('[data-video-rail-wrap]').getAttribute('data-sets')) !== '1';
    if (looping) {
      for (let i = 0; i < 3; i++) {
        await next.click();
        await page.waitForTimeout(650);
      }
      await expect(next).toBeVisible();
      await expect(prev).toBeVisible();
    } else {
      for (let i = 0; i < 12 && (await next.isVisible()); i++) {
        await next.click();
        await page.waitForTimeout(650); // smooth scroll + snap settle
      }
      await expect(next).toBeHidden();
      await expect(prev).toBeVisible();
    }
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });

  test('at stock widths the rail is centered and the arrows match reality', async ({ page }) => {
    test.skip(
      test.info().project.name === 'mobile-chromium',
      'phones are single-card and overflow by design',
    );
    // Mode-aware on purpose: while the library fits its slots the whole
    // group centers and the arrows retire; once it outgrows them (or the
    // loop phase kicks in at 6+ videos) the active card centers instead and
    // the arrows stay. Either way, SOME card must sit exactly on the
    // midline and the arrows must agree with the measured overflow state.
    for (const width of [1280, 1900]) {
      await page.setViewportSize({ width, height: 945 });
      await page.goto('/en/');
      const section = page.locator('#videos');
      await section.scrollIntoViewIfNeeded();
      const wrap = section.locator('[data-video-rail-wrap]');
      const overflowing = (await wrap.getAttribute('data-overflow')) === 'true';
      const next = section.locator('[data-rail-scroll="1"]');
      const prev = section.locator('[data-rail-scroll="-1"]');

      const midlineDelta = async () => {
        const boxes = await page
          .locator('[data-video-card]:not([inert])')
          .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
        return Math.min(...boxes.map((b) => Math.abs(b.x + b.width / 2 - width / 2)));
      };
      await expect.poll(midlineDelta, { timeout: 5_000 }).toBeLessThan(3);

      if (overflowing) {
        await expect(next).toBeVisible(); // loop mode: always more to reach
        await expect(prev).toBeVisible();
      } else {
        await expect(next).toBeHidden();
        await expect(prev).toBeHidden();
      }
    }
  });

  test('iPad landscape: centered fit and no arrows — fingers do the navigating', async ({
    page,
  }) => {
    test.use({ hasTouch: true, isMobile: true });
    test.skip(
      test.info().project.name !== 'desktop-chromium',
      'isMobile is a Chromium context option',
    );
    // The deadlock regression: at lg/xl the shipped 3 cards fit their slots
    // (3/3 and 4/4), but the first publish measured under the pre-fit
    // layout, read the phantom end margins as overflow, and the rail stuck
    // off-center with the next arrow up. Touch devices must ALSO never see
    // the arrows at all — the finger is the navigation there.
    for (const [width, height] of [
      [1080, 810], // iPad (gen 7) landscape — lg, 3 slots
      [1194, 834], // iPad Pro 11 landscape — lg
      [1280, 1024], // iPad Pro 12.9 landscape — xl, 4 slots
    ] as const) {
      await page.setViewportSize({ width, height });
      await page.goto('/en/');
      const section = page.locator('#videos');
      await section.scrollIntoViewIfNeeded();

      await expect(section.locator('[data-rail-scroll="1"]')).toBeHidden();
      await expect(section.locator('[data-rail-scroll="-1"]')).toBeHidden();
      // Fit mode centers the middle of the group; overflow mode centers the
      // active card. Either way one card sits exactly on the midline.
      const midlineDelta = async () => {
        const boxes = await page
          .locator('[data-video-card]:not([inert])')
          .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
        return Math.min(...boxes.map((b) => Math.abs(b.x + b.width / 2 - width / 2)));
      };
      await expect.poll(midlineDelta, { timeout: 5_000 }).toBeLessThan(3);
    }
  });

  test('rail arrows are hidden on phones (finger swipe is the control)', async ({ page }) => {
    test.skip(
      test.info().project.name !== 'mobile-chromium',
      'desktop keeps the arrows — covered by the test above',
    );
    const section = page.locator('#videos');
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('[data-rail-scroll="1"]')).toBeHidden();
  });

  test('stays paused below the fold, autoplays on scroll-in, pause sticks', async ({ page }) => {
    const card = page.locator('[data-video-card]:not([inert])').first();
    const video = card.locator('video[data-video]');

    // Below the fold on load: paused poster frame — no winner plays; at most
    // a moov-only metadata fetch happens for cards near the fold.
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);

    // Scrolled into view: the most-visible card autoplays (muted) and has
    // been warmed to preload="auto" by the controller.
    await card.scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
      .toBe(false);
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).preload)).toBe('auto');
    await expect(card).toHaveAttribute('data-playing', 'true');
    // First frame is up: the poster overlay has faded out — and stays gone
    // (the latch never resets; a paused video keeps its last frame).
    await expect(card).toHaveAttribute('data-started', 'true');
    await expect(card.locator('[data-video-poster]')).toHaveCSS('opacity', '0');

    // Explicit pause wins over autoplay while still in view — via the
    // KEYBOARD (Enter on the surface = click with detail 0). A mouse click
    // is deliberately inert: the pointer control is hover.
    await card.locator('[data-play-toggle]').focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
    await expect(card).toHaveAttribute('data-playing', 'false');

    // Scrolled far away: paused by the visibility controller.
    await page.keyboard.press('Enter'); // resume
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 5_000 })
      .toBe(true);
  });

  test('a card taller than the viewport still autoplays (landscape phone)', async ({ page }) => {
    // 568×320: below the sm breakpoint (centered rail card), and the 9:16
    // card is ~2.8× the viewport height. Against its own height its visible
    // fraction tops out at ~0.36 — the old coverage metric could never pass
    // the 0.5 gate here, so landscape phones got no autoplay at all. The
    // metric now measures against the smaller of card/viewport extent, so a
    // card that fills the screen scores 1.0.
    await page.setViewportSize({ width: 568, height: 320 });
    await page.goto('/en/');
    const card = page.locator('[data-video-card]:not([inert])').first();
    const video = card.locator('video[data-video]');
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);

    // Park the card so it spans the full (short) viewport.
    await card.evaluate((el) => {
      const top = el.getBoundingClientRect().top;
      window.scrollBy(0, top);
    });
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
      .toBe(false);
  });

  test('returning to a played card resumes where it left off (no re-warm restart)', async ({
    page,
  }) => {
    const card = page.locator('[data-video-card]:not([inert])').first();
    const video = card.locator('video[data-video]');
    await card.scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(false);

    // Simulate watched progress, then leave the fold: the controller pauses,
    // and 2s later demotes the preload back to metadata (hint-only).
    await video.evaluate((v) => {
      (v as HTMLVideoElement).currentTime = 5;
    });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
    await page.waitForTimeout(2_500);

    // Fling back: re-promoting to preload="auto" must NOT load() — a load
    // would wipe the buffer and reset the clip to 0:00, the exact refetch+
    // rejank the demote path exists to avoid.
    await card.scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
      .toBe(false);
    const t = await video.evaluate((v) => (v as HTMLVideoElement).currentTime);
    expect(t).toBeGreaterThanOrEqual(4.5);
  });

  test('controller pause re-mutes — returning never restores audio on its own', async ({
    page,
  }) => {
    const card = page.locator('[data-video-card]:not([inert])').first();
    const video = card.locator('video[data-video]');
    await card.scrollIntoViewIfNeeded();
    // No play click here: the controller has usually already autoplayed the
    // card, and the surface is a toggle — clicking would pause it.
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
      .toBe(false);
    await card.locator('[data-mute-toggle]').click();
    expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(false);

    // Scrolling away pauses the card via the controller — which must re-mute
    // it: sound the visitor enabled for one moment must not come back on its
    // own (and Safari would refuse the unmuted play() anyway).
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(true);

    // Back in view: playback resumes, still muted.
    await card.scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
      .toBe(false);
    expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(true);
  });

  test('unmute toggles audio state without stopping playback', async ({ page }) => {
    const card = page.locator('[data-video-card]:not([inert])').first();
    const video = card.locator('video[data-video]');
    await card.scrollIntoViewIfNeeded();
    // The controller autoplays the most-covered cards — no click needed.
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
      .toBe(false);

    await card.locator('[data-mute-toggle]').click();
    expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(false);
    await card.locator('[data-mute-toggle]').click();
    expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(true);
  });

  test('unmuting one video mutes the rest — the audio feed is exclusive', async ({ page }) => {
    test.skip(
      test.info().project.name === 'mobile-chromium',
      'the decoder budget is 1 on phones — no second stream to duel with',
    );
    const cards = page.locator('[data-video-card]:not([inert])');
    const videos = cards.locator('video[data-video]');

    // Desktop budget is 2: scrolling the first card into view plays the two
    // most-visible cards simultaneously, both muted.
    await cards.first().scrollIntoViewIfNeeded();
    await expect
      .poll(() => videos.nth(0).evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
      .toBe(false);
    await expect
      .poll(() => videos.nth(1).evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
      .toBe(false);

    // Unmute card 0 → card 1 goes silent but KEEPS PLAYING: only the audio
    // channel is exclusive, not the decoder.
    await cards.nth(0).locator('[data-mute-toggle]').click();
    await expect
      .poll(() => videos.nth(0).evaluate((v) => (v as HTMLVideoElement).muted))
      .toBe(false);
    await expect
      .poll(() => videos.nth(1).evaluate((v) => (v as HTMLVideoElement).muted))
      .toBe(true);
    await expect
      .poll(() => videos.nth(1).evaluate((v) => (v as HTMLVideoElement).paused))
      .toBe(false);
    // The soloed card's controls reflect reality for the next visitor gesture.
    await expect(cards.nth(1)).toHaveAttribute('data-muted', 'true');

    // Re-muting card 0 does not resurrect card 1's audio — silence is the
    // honest state; bringing sound back is a deliberate act, never an echo.
    await cards.nth(0).locator('[data-mute-toggle]').click();
    await expect
      .poll(() => videos.nth(1).evaluate((v) => (v as HTMLVideoElement).muted))
      .toBe(true);
  });

  test('metadata is always visible and the + toggle is gone', async ({ page }) => {
    const card = page.locator('[data-video-card]:not([inert])').first();
    await card.scrollIntoViewIfNeeded();
    const overlay = card.locator('.media-overlay-gradient');
    await expect(overlay).toBeVisible();
    await expect(overlay.locator('h3')).toHaveText(/.+/);
    // Title, description and transcript ship in the SSR — nothing to click.
    await expect(card.locator('[data-details-toggle]')).toHaveCount(0);
  });

  test('mouse hover plays a non-winner card, leaving pauses it; clicks are inert', async ({
    page,
  }) => {
    test.skip(test.info().project.name === 'mobile-chromium', 'hover is a pointer-device control');
    await page.setViewportSize({ width: 1280, height: 945 });
    await page.goto('/en/');
    const section = page.locator('#videos');
    await section.scrollIntoViewIfNeeded();
    // At xl all four cards are fully visible; the controller autoplays the
    // top two — the last card is a non-winner, so the pointer owns it.
    const laggard = page.locator('[data-video-card]:not([inert])').nth(3);
    const paused = () =>
      laggard.locator('video[data-video]').evaluate((v) => (v as HTMLVideoElement).paused);
    await expect.poll(paused).toBe(true);

    // A pointer click (event.detail >= 1) is deliberately inert.
    await laggard.evaluate((el) => {
      el.querySelector('[data-play-toggle]')?.dispatchEvent(
        new MouseEvent('click', { detail: 1, bubbles: true }),
      );
    });
    await expect.poll(paused).toBe(true);

    // Hover plays it (muted state untouched — audio stays as the visitor
    // left it), and leaving pauses it again: the card is not a winner.
    await laggard.hover();
    await expect.poll(paused, { timeout: 5_000 }).toBe(false);
    await page.mouse.move(10, 10);
    await expect.poll(paused).toBe(true);
  });
});

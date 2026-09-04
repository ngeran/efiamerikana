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
    await real.scrollIntoViewIfNeeded();
    await expect(real.locator('video[data-video]')).toHaveAttribute('preload', 'none');
    await expect(real.locator('video[data-video]')).toHaveAttribute('poster', /.+/);
    await expect(real.locator('video[data-video]')).toHaveAttribute('playsinline', '');
    await expect(real.locator('video[data-video]')).toHaveAttribute('muted', '');

    const ids = await cards.evaluateAll((els) =>
      els.map((el) => el.querySelector('[id^="video-details-"]')?.id ?? ''),
    );
    expect(new Set(ids).size).toBe(ids.length); // no duplicate overlay ids
  });

  test('rail arrows exist on desktop and scroll the rail', async ({ page }) => {
    test.skip(
      test.info().project.name === 'mobile-chromium',
      'arrows are sm+ only — phones use the native swipe',
    );
    const section = page.locator('#videos');
    await section.scrollIntoViewIfNeeded();
    const rail = section.locator('[data-rail]');
    const next = section.locator('[data-rail-scroll="1"]');

    await expect(next).toBeVisible();

    // With few entries the cards fit without overflowing — the arrows are
    // legitimately no-ops. Only assert scrolling when there is scroll to do.
    const overflows = await rail.evaluate((el) => el.scrollWidth > el.clientWidth + 4);
    test.skip(!overflows, 'rail content fits — nothing to scroll (see the loop phase for 6+)');

    const before = await rail.evaluate((el) => el.scrollLeft);
    await next.click();
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
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

    // Below the fold on load: paused poster frame, nothing fetched.
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);

    // Scrolled into view: the most-visible card autoplays (muted).
    await card.scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
      .toBe(false);
    await expect(card).toHaveAttribute('data-playing', 'true');

    // Explicit pause wins over autoplay while still in view.
    await card.locator('[data-play-toggle]').click();
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
    await expect(card).toHaveAttribute('data-playing', 'false');

    // Scrolled far away: paused by the visibility controller.
    await card.locator('[data-play-toggle]').click(); // resume
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 5_000 })
      .toBe(true);
  });

  test('unmute toggles audio state without stopping playback', async ({ page }) => {
    const card = page.locator('[data-video-card]:not([inert])').first();
    const video = card.locator('video[data-video]');
    await card.scrollIntoViewIfNeeded();
    await card.locator('[data-play-toggle]').click();
    if (await video.evaluate((v) => (v as HTMLVideoElement).paused)) {
      await card.locator('[data-play-toggle]').click();
    }
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(false);

    await card.locator('[data-mute-toggle]').click();
    expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(false);
    await card.locator('[data-mute-toggle]').click();
    expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(true);
  });

  test('+ button reveals and hides the metadata overlay', async ({ page }) => {
    const card = page.locator('[data-video-card]:not([inert])').first();
    const toggle = card.locator('[data-details-toggle]');
    await card.scrollIntoViewIfNeeded();
    const overlay = card.locator('[id^="video-details-"]');
    await expect(overlay).toHaveCSS('opacity', '0');

    await toggle.click();
    await expect(card).toHaveAttribute('data-open', 'true');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(overlay).toHaveCSS('opacity', '1');

    await toggle.click();
    await expect(card).toHaveAttribute('data-open', 'false');
    await expect(overlay).toHaveCSS('opacity', '0');
  });
});

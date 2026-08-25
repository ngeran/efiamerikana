import { expect, test } from '@playwright/test';

test.describe('video section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/');
  });

  test('renders six cards in the seeded grid layout', async ({ page }) => {
    const section = page.locator('#videos');
    await expect(section.locator('[data-video-card]')).toHaveCount(6);
    await expect(section.locator('ul.grid')).toHaveCount(1);
    // Grid target: 3 columns at desktop widths.
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect
      .poll(async () =>
        section
          .locator('[data-video-card]')
          .first()
          .evaluate((el) => el.getBoundingClientRect().width),
      )
      .toBeLessThan(1280 / 2);
  });

  test('videos never autoplay', async ({ page }) => {
    for (const video of await page.locator('#videos video').all()) {
      expect(await video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
      expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(true);
      expect(await video.getAttribute('preload')).toBe('none');
    }
  });

  test('click plays and pauses without resizing the card', async ({ page }) => {
    const card = page.locator('[data-video-card]').first();
    const video = card.locator('video');
    const play = card.locator('[data-play-toggle]');

    await card.scrollIntoViewIfNeeded();
    const before = await card.boundingBox();

    await play.click();
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(false);
    await expect(card).toHaveAttribute('data-playing', 'true');
    await expect(play).toHaveAttribute('aria-pressed', 'true');

    // Unmute control appears during playback.
    await expect(card.locator('[data-mute-toggle]')).toBeVisible();

    // Dimensional stability: same box during playback.
    const during = await card.boundingBox();
    expect(during?.width).toBeCloseTo(before?.width ?? 0, 0);
    expect(during?.height).toBeCloseTo(before?.height ?? 0, 0);

    await play.click();
    await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
  });

  test('unmute toggles audio state without autoplaying it', async ({ page }) => {
    const card = page.locator('[data-video-card]').first();
    const video = card.locator('video');
    await card.scrollIntoViewIfNeeded();
    await card.locator('[data-play-toggle]').click();
    await expect(card.locator('[data-mute-toggle]')).toBeVisible();

    await card.locator('[data-mute-toggle]').click();
    expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(false);
    await card.locator('[data-mute-toggle]').click();
    expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(true);
  });

  test('+ button reveals and hides the metadata overlay', async ({ page }) => {
    const card = page.locator('[data-video-card]').first();
    const toggle = card.locator('[data-details-toggle]');

    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('[data-overlay]')).toHaveCSS('opacity', '0');
    await toggle.click();
    await expect(card).toHaveAttribute('data-open', 'true');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(card.locator('[data-overlay]')).toHaveCSS('opacity', '1');

    await toggle.click();
    // Hover AND focus-within each keep the overlay open on their own —
    // leave the card and drop focus from the toggle before asserting.
    await page.mouse.move(10, 10);
    await toggle.blur();
    await expect(card).toHaveAttribute('data-open', 'false');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(card.locator('[data-overlay]')).toHaveCSS('opacity', '0');
  });

  test('pauses videos that scroll out of the viewport', async ({ page }) => {
    const card = page.locator('[data-video-card]').first();
    await card.scrollIntoViewIfNeeded();
    await card.locator('[data-play-toggle]').click();
    await expect
      .poll(() => card.locator('video').evaluate((v) => (v as HTMLVideoElement).paused))
      .toBe(false);

    // Scroll far away → the card is paused by the IntersectionObserver.
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect
      .poll(() => card.locator('video').evaluate((v) => (v as HTMLVideoElement).paused), {
        timeout: 5_000,
      })
      .toBe(true);
  });
});

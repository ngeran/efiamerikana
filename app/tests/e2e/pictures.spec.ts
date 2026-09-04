import { expect, test } from '@playwright/test';

test.describe('pictures section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/');
  });

  test('renders a card per picture with loaded images', async ({ page }) => {
    const section = page.locator('#pictures');
    // Count-agnostic: entries are CMS-managed (3–5 in practice). The loop
    // phase may multiply DOM copies behind data-sets, so the meaningful
    // assertions are ≥1 card, real pixels, and unique overlay ids.
    const cards = section.locator('[data-picture-card]');
    expect(await cards.count()).toBeGreaterThanOrEqual(3);

    // Lazy images: scroll each card through the rail before asserting load.
    const count = await cards.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await cards.nth(i).scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(600);
    // Exclude MediaFrame's decorative blurred backdrop (aria-hidden, alt="")
    // — only the content image counts.
    const loaded = await cards
      .first()
      .locator('img:not([aria-hidden="true"])')
      .evaluate((img) => img.complete && img.naturalWidth > 0);
    expect(loaded).toBe(true);

    const ids = await cards.evaluateAll((els) =>
      els.map((el) => el.querySelector('[id^="picture-details-"]')?.id ?? ''),
    );
    expect(new Set(ids).size).toBe(ids.length); // no duplicate overlay ids
  });

  test('rail arrows exist on desktop and scroll the rail', async ({ page }) => {
    test.skip(
      test.info().project.name === 'mobile-chromium',
      'arrows are sm+ only — phones use the native swipe',
    );
    const section = page.locator('#pictures');
    await section.scrollIntoViewIfNeeded();
    const rail = section.locator('[data-rail]');
    const next = section.locator('[data-rail-scroll="1"]');

    await expect(next).toBeVisible();
    const before = await rail.evaluate((el) => el.scrollLeft);
    await next.click();
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
  });

  test('rail arrows are hidden on phones (finger swipe is the control)', async ({ page }) => {
    test.skip(
      test.info().project.name !== 'mobile-chromium',
      'desktop keeps the arrows — covered by the test above',
    );
    const section = page.locator('#pictures');
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('[data-rail-scroll="1"]')).toBeHidden();
  });

  test('mobile card sits centered with equal gutters', async ({ page }) => {
    test.skip(
      test.info().project.name !== 'mobile-chromium',
      'the 100vw-4rem centered card is a phone-only layout',
    );
    const card = page.locator('[data-picture-card]').first();
    await card.scrollIntoViewIfNeeded();
    const gutters = await card.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: innerWidth - r.right };
    });
    expect(Math.abs(gutters.left - gutters.right)).toBeLessThan(1);
    expect(gutters.left).toBeGreaterThan(20); // visibly inset, not flush
  });

  test('metadata overlay stays hidden while interaction toggles are off', async ({ page }) => {
    // The shipped config has showDetailsButton/hover/click all disabled —
    // the overlay must not leak through and no toggle control may render.
    const card = page.locator('[data-picture-card]').first();
    await card.scrollIntoViewIfNeeded();
    const overlay = card.locator('[id^="picture-details-"]');
    await expect(overlay).toHaveCSS('opacity', '0');
    await expect(card.locator('[data-picture-toggle]')).toHaveCount(0);
    await expect(card).toHaveAttribute('data-open', 'false');
  });
});

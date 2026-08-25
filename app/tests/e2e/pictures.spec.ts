import { expect, test } from '@playwright/test';

test.describe('pictures section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/');
  });

  test('renders six cards in the seeded scroll layout', async ({ page }) => {
    const section = page.locator('#pictures');
    await expect(section.locator('[data-picture-card]')).toHaveCount(6);
    await expect(section.locator('[data-scroller]')).toHaveCount(1);
    await expect(section.locator('[data-scroll-next]')).toBeVisible();
  });

  test('starts black & white and colours on hover', async ({ page }) => {
    test.skip(
      test.info().project.name === 'mobile-chromium',
      ':hover needs a hover-capable pointer — mobile is covered by the focus/tap tests',
    );
    const card = page.locator('[data-picture-card]').first();
    await card.scrollIntoViewIfNeeded();
    const img = card.locator('img');

    await expect(img).toHaveCSS('filter', /grayscale/);

    await card.hover();
    await expect(img).toHaveCSS('filter', /grayscale\(0\)|none/);
  });

  test('colours on keyboard focus', async ({ page }) => {
    const card = page.locator('[data-picture-card]').first();
    await card.scrollIntoViewIfNeeded();
    const img = card.locator('img');

    await card.locator('[data-picture-toggle]').focus();
    await expect(img).toHaveCSS('filter', /grayscale\(0\)|none/);
  });

  test('tap/click reveals the description (touch-safe)', async ({ page }) => {
    const card = page.locator('[data-picture-card]').first();
    await card.scrollIntoViewIfNeeded();
    const toggle = card.locator('[data-picture-toggle]');
    const desc = card.locator('[data-picture-desc]');

    await expect(desc).toBeHidden();
    await toggle.click();
    await expect(card).toHaveAttribute('data-open', 'true');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(desc).toBeVisible();
    await expect(card.locator('img')).toHaveCSS('filter', /grayscale\(0\)|none/);
  });

  test('scroll rail arrows move the rail', async ({ page }) => {
    const section = page.locator('#pictures');
    await section.scrollIntoViewIfNeeded();
    const scroller = section.locator('[data-scroller]');
    const next = section.locator('[data-scroll-next]');

    await expect(next).toBeEnabled();
    const before = await scroller.evaluate((el) => el.scrollLeft);
    await next.click();
    await expect.poll(() => scroller.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
  });
});

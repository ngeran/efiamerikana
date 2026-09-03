import { expect, test } from '@playwright/test';

/**
 * The site currently publishes English only (src/i18n/config.ts
 * `enabledLocales`). These specs pin that contract: no switcher, no /el/
 * routes, and exactly one canonical + x-default alternate. When Greek is
 * re-enabled, replace this with real EN ↔ ΕΛ switching coverage.
 */
test.describe('language (English-only)', () => {
  test('hides the EN | ΕΛ switcher with a single enabled locale', async ({ page }) => {
    await page.goto('/en/');
    await expect(
      page.getByRole('link', { name: /Αλλαγή στα Ελληνικά|Switch to Ελληνικά/ }),
    ).toHaveCount(0);
    await expect(page.locator('a[href="/el/"]')).toHaveCount(0);
  });

  test('does not generate Greek routes', async ({ page }) => {
    const response = await page.goto('/el/');
    expect(response?.status()).toBe(404);
  });

  test('emits canonical and hreflang for the enabled locale only', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/?$/);
    expect(await page.locator('link[rel="alternate"][hreflang="en"]').count()).toBe(1);
    expect(await page.locator('link[rel="alternate"][hreflang="x-default"]').count()).toBe(1);
    expect(await page.locator('link[rel="alternate"][hreflang="el"]').count()).toBe(0);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('root redirects to the default locale', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/?$/);
  });
});

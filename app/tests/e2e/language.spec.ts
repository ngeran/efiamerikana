import { expect, test } from '@playwright/test';

test.describe('language switching', () => {
  test('landing page switches EN ↔ ΕΛ and preserves the page', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.getByRole('link', { name: 'Αλλαγή στα Ελληνικά' }).first().click();
    await expect(page).toHaveURL(/\/el\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'el');
    await expect(page.locator('#hero h1')).toContainText('ΜΑΓΕΙΡΕΜΑ');

    await page.getByRole('link', { name: 'Switch to English' }).first().click();
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator('#hero h1')).toContainText('COOKING');
  });

  test('help page switching preserves the equivalent page', async ({ page }) => {
    await page.goto('/en/how-to-use');
    await page.getByRole('link', { name: 'Αλλαγή στα Ελληνικά' }).first().click();
    await expect(page).toHaveURL(/\/el\/how-to-use/);
    await expect(page.locator('h1')).toContainText('Πώς να χρησιμοποιήσετε');
  });

  test('emits canonical + hreflang alternates', async ({ page }) => {
    await page.goto('/el/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/el\/?$/);
    expect(await page.locator('link[rel="alternate"][hreflang="en"]').count()).toBe(1);
    expect(await page.locator('link[rel="alternate"][hreflang="el"]').count()).toBe(1);
    expect(await page.locator('link[rel="alternate"][hreflang="x-default"]').count()).toBe(1);
  });

  test('root redirects to the default locale', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/?$/);
  });
});

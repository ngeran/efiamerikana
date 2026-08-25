import { expect, test } from '@playwright/test';

test.describe('mobile menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en/');
  });

  test('opens and closes with correct ARIA state', async ({ page }) => {
    const toggle = page.locator('#menu-toggle');
    const panel = page.locator('#mobile-menu');

    await expect(panel).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(panel).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Focus moved into the panel
    await expect(panel.locator('a').first()).toBeFocused();

    // Focus is trapped while open: Tab all the way around the panel's
    // focusables and land back on the first one.
    const focusables = panel.locator('a, button');
    const count = await focusables.count();
    for (let i = 0; i < count; i++) await page.keyboard.press('Tab');
    await expect(panel.locator('a, button').first()).toBeFocused();
  });

  test('Escape closes the menu and restores focus to the toggle', async ({ page }) => {
    const toggle = page.locator('#menu-toggle');
    await toggle.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('choosing a link closes the menu and anchors', async ({ page }) => {
    await page.locator('#menu-toggle').click();
    await page.locator('#mobile-menu a[href="#pictures"]').click();
    await expect(page.locator('#mobile-menu')).toBeHidden();
    await expect(page).toHaveURL(/#pictures$/);
  });

  test('desktop viewport keeps the panel closed', async ({ page }) => {
    await page.locator('#menu-toggle').click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('#mobile-menu')).toBeHidden();
  });
});

import { expect, test } from '@playwright/test';

test.describe('primary navigation', () => {
  test('shows links to every enabled section', async ({ page }) => {
    await page.goto('/en/');
    for (const id of ['hero', 'videos', 'pictures', 'about', 'analytics', 'contact']) {
      await expect(page.locator(`#site-header .desktop-nav a[href="#${id}"]`)).toHaveCount(1);
      await expect(page.locator(`main #${id}`)).toHaveCount(1);
    }
  });

  test('anchor links scroll to the section', async ({ page }) => {
    // The desktop nav is only rendered ≥lg — pin a desktop viewport so this
    // test behaves identically in the mobile project.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/en/');
    await page.locator('#site-header .desktop-nav a[href="#videos"]').click();
    await expect(page).toHaveURL(/#videos$/);
    await expect(page.locator('#videos')).toBeInViewport({ ratio: 0.1 });
  });

  test('email icon stays visible even at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/en/');
    const mail = page
      .locator('#site-header a[href^="mailto:"]')
      .filter({ has: page.locator('svg') })
      .first();
    await expect(mail).toBeVisible();
  });

  test('subpage nav links back to the landing sections', async ({ page }) => {
    await page.goto('/en/how-to-use');
    const link = page.locator('#site-header .desktop-nav a[href="/en#videos"]');
    await expect(link).toHaveCount(1);
  });

  test('scroll-spy marks the active section', async ({ page }) => {
    await page.goto('/en/');
    await page.locator('#analytics').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-nav-link="analytics"]')).toHaveAttribute(
      'aria-current',
      'true',
      { timeout: 5_000 },
    );
  });
});

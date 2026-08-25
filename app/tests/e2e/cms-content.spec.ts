import { expect, test } from '@playwright/test';

/**
 * CMS-managed content rendering: everything asserted here comes from the
 * committed content files that Decap CMS edits (src/content/**).
 */
test.describe('CMS-managed content', () => {
  test('hero renders CMS fields', async ({ page }) => {
    await page.goto('/en/');
    const hero = page.locator('#hero');
    await expect(hero.locator('h1')).toContainText('A little bit of cooking');
    await expect(hero.locator('p').first()).toContainText('Greek-American home cook');
    await expect(hero.getByRole('link', { name: 'Watch the videos' })).toHaveAttribute(
      'href',
      '#videos',
    );
    await expect(hero.locator('img')).toHaveAttribute(
      'alt',
      /Placeholder artwork for the hero portrait/,
    );
  });

  test('video and picture entries render with alt text', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#videos [data-video-card] h3').first()).toHaveText('Lemon Potatoes');
    await expect(page.locator('#pictures img').first()).toHaveAttribute('alt', /Placeholder/);
    await expect(page.locator('#pictures [data-picture-card] h3').first()).toHaveText(
      'Sunset Dinner',
    );
  });

  test('analytics renders placeholder metrics as text', async ({ page }) => {
    await page.goto('/en/');
    const analytics = page.locator('#analytics');
    await expect(analytics.locator('h2')).toContainText('Driven by engagement');
    await expect(analytics.getByText('XX', { exact: true })).toHaveCount(2);
    await expect(analytics.getByText('Monthly reach', { exact: true })).toBeVisible();
    await expect(analytics.locator('footer, p').last()).toContainText(/Placeholder|CMS/);
  });

  test('contact renders CMS methods and socials', async ({ page }) => {
    await page.goto('/en/');
    const contact = page.locator('#contact');
    await expect(contact.locator('h2')).toContainText("Let's collaborate.");
    await expect(contact.getByRole('link', { name: /hello@efiamerikana\.example/ })).toHaveCount(1);
    await expect(contact.getByRole('link', { name: /TikTok/ })).toHaveAttribute(
      'href',
      'https://www.tiktok.com/@your-handle',
    );
  });

  test('footer shows the current year and the help link', async ({ page }) => {
    await page.goto('/en/');
    const footer = page.locator('footer');
    await expect(footer).toContainText(`© ${new Date().getFullYear()} EFIAMERIKANA`);
    await expect(
      footer.getByRole('link', { name: /How to use this landing page/ }),
    ).toHaveAttribute('href', '/en/how-to-use');
  });

  test('Greek content renders from the EL collection', async ({ page }) => {
    await page.goto('/el/');
    await expect(page.locator('#videos [data-video-card] h3').first()).toHaveText(
      'Πατάτες λεμόνου',
    );
    await expect(page.locator('#analytics h2')).toContainText('αλληλεπίδραση');
  });
});

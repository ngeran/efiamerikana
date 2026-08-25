import { expect, test } from '@playwright/test';

test.describe('CMS admin shell', () => {
  test('serves the Decap CMS at /admin/ (dev and production parity)', async ({
    page,
  }) => {
    const response = await page.goto('/admin/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('script[src*="decap-cms"]')).toHaveCount(1);
    await expect(page).toHaveTitle(/Content Manager/);
  });

  test('serves the CMS configuration next to the shell', async ({ request }) => {
    const response = await request.get('/admin/config.yml');
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toContain('backend:');
  });
});

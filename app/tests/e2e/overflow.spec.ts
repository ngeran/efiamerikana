import { expect, test } from '@playwright/test';

const WIDTHS = [320, 375, 768, 1024, 1920, 2560, 3840] as const;

test.describe('no horizontal overflow', () => {
  for (const width of WIDTHS) {
    for (const locale of ['en', 'el'] as const) {
      test(`${width}px /${locale}`, async ({ page }) => {
        await page.setViewportSize({ width, height: Math.round(Math.min(width * 0.7, 2160)) });
        await page.goto(`/${locale}/`);
        const overflow = await page.evaluate(
          () =>
            Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
            document.documentElement.clientWidth,
        );
        expect(overflow, `page is ${overflow}px wider than the viewport`).toBeLessThanOrEqual(1);
      });
    }
  }

  test('help page at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/en/how-to-use');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

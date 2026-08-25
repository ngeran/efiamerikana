import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('accessibility (axe)', () => {
  for (const path of ['/', '/el/', '/en/how-to-use', '/el/how-to-use']) {
    test(`no serious violations on ${path}`, async ({ page }) => {
      await page.goto(path === '/' ? '/en/' : path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      const serious = results.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact ?? ''),
      );
      expect(
        serious.map(
          (v) =>
            `${v.id}: ${v.nodes
              .map((n) => n.target.join(' '))
              .slice(0, 3)
              .join(', ')}`,
        ),
      ).toEqual([]);
    });
  }

  test('keyboard: skip link is the first focusable element', async ({ page }) => {
    await page.goto('/en/');
    await page.keyboard.press('Tab');
    await expect(page.locator('a[href="#main"]')).toBeFocused();
  });

  test('headings follow a single h1 → h2 → h3 order', async ({ page }) => {
    await page.goto('/en/');
    const levels = await page.evaluate(() =>
      Array.from(document.querySelectorAll('h1, h2, h3')).map((h) => Number(h.tagName[1])),
    );
    // No level jumps of more than 1
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]! - levels[i - 1]!).toBeLessThan(2);
    }
    expect(levels[0]).toBe(1);
  });
});

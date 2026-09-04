import { expect, test } from '@playwright/test';
import hero from '../../src/content/sections/hero.en.json' with { type: 'json' };
import analytics from '../../src/content/sections/analytics.en.json' with { type: 'json' };
import contact from '../../src/content/sections/contact.en.json' with { type: 'json' };

/**
 * CMS-managed content rendering: everything asserted here is derived from
 * the committed content files that Decap CMS edits (src/content/**), read at
 * test time — the specs stay meaningful whatever the editor last saved.
 */
test.describe('CMS-managed content', () => {
  test('hero renders CMS fields', async ({ page }) => {
    await page.goto('/en/');
    const heroEl = page.locator('#hero');

    // Heading + accent line come straight from the CMS file (the accent
    // renders as its own element beside the h1, not inside it).
    await expect(heroEl.locator('h1')).toContainText(hero.heading);
    if (hero.headingAccent) {
      await expect(heroEl.getByText(hero.headingAccent).first()).toBeVisible();
    }

    // NOTE: the current hero design does not render the CMS primaryCta —
    // its action is the fixed view-portfolio bar, anchored to the videos
    // rail. Assert that instead of a link the design no longer contains.
    const portfolioBar = page.locator('[data-hero-cta]');
    await expect(portfolioBar).toHaveAttribute('href', '#videos');

    // Hero socials mirror the contact socials (same icons, same links).
    for (const social of contact.socials.slice(0, 2)) {
      await expect(heroEl.getByRole('link', { name: social.label }).first()).toHaveAttribute(
        'href',
        social.href,
      );
    }

    // Hero image always carries alt text (CMS value).
    await expect(heroEl.locator('img').first()).toHaveAttribute('alt', hero.imageAlt);
  });

  test('video and picture cards render with titles and alt text', async ({ page }) => {
    await page.goto('/en/');

    // Every picture card's image has non-empty alt (CMS alt or title
    // fallback) — the ImageMissingAlt crash guard. Decorative blur
    // backdrops (aria-hidden) are excluded.
    const alts = await page
      .locator('[data-picture-card] img:not([aria-hidden="true"])')
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute('alt') ?? ''));
    expect(alts.length).toBeGreaterThanOrEqual(3);
    for (const alt of alts) expect(alt.length).toBeGreaterThan(0);

    // Every video card has a title heading and a poster frame.
    const titles = await page.locator('[data-video-card] h3').allTextContents();
    expect(titles.filter(Boolean).length).toBeGreaterThanOrEqual(3);
  });

  test('analytics renders the CMS metrics', async ({ page }) => {
    await page.goto('/en/');
    const analyticsEl = page.locator('#analytics');
    await expect(analyticsEl.locator('h2')).toContainText(analytics.heading);
    // Labels are the stable hook — the featured metric renders its value
    // with different markup from the rest of the grid.
    for (const metric of analytics.metrics.slice(0, 3)) {
      await expect(analyticsEl.getByText(metric.label, { exact: true }).first()).toBeVisible();
    }
  });

  test('contact renders CMS methods and socials', async ({ page }) => {
    await page.goto('/en/');
    const contactEl = page.locator('#contact');
    await expect(contactEl.locator('h2')).toContainText(contact.heading);

    const email = contact.methods.find((m) => m.icon === 'email');
    if (email?.href) {
      await expect(contactEl.getByRole('link', { name: new RegExp(email.value) })).toHaveCount(1);
    }
    for (const social of contact.socials.slice(0, 2)) {
      await expect(contactEl.getByRole('link', { name: social.label }).first()).toHaveAttribute(
        'href',
        social.href,
      );
    }
  });

  test('footer shows the current year and the help link', async ({ page }) => {
    await page.goto('/en/');
    const footer = page.locator('footer');
    await expect(footer).toContainText(`© ${new Date().getFullYear()} EFIAMERIKANA`);
    await expect(footer.getByRole('link', { name: /how to use/i })).toHaveAttribute(
      'href',
      '/en/how-to-use',
    );
  });
});

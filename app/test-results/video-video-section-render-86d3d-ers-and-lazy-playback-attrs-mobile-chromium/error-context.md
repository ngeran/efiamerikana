# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: video.spec.ts >> video section >> renders a card per video with posters and lazy playback attrs
- Location: tests/e2e/video.spec.ts:8:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: locator('#videos').locator('[data-video-card]').locator(':not([inert])').first().locator('video[data-video]')
Expected: "metadata"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('#videos').locator('[data-video-card]').locator(':not([inert])').first().locator('video[data-video]')

```

```yaml
- link "Skip to content":
  - /url: "#main"
- banner:
  - link "efiamerikana":
    - /url: /en
  - link "Send an email (effaki7@gmail.com)":
    - /url: mailto:effaki7@gmail.com
  - button "Open menu"
- main:
  - img "Placeholder artwork for the hero portrait of Effie Kazantzidis — replace via the CMS."
  - paragraph: efiamerikana
  - heading "Effie Kazantzidis" [level=1]
  - paragraph: Greek-American Home Cook
  - paragraph: Food • Lifestyle • UGC Content
  - paragraph: Real food. Real life. Real personality.
  - link "TikTok":
    - /url: https://www.tiktok.com/@efiamerikana
  - link "Instagram":
    - /url: https://www.instagram.com/efi.amerikana
  - link "view my portfolio":
    - /url: "#videos"
  - region "Selected works":
    - heading "Selected works" [level=2]
    - paragraph: Portrait cuts from the kitchen archives — TikToks, Reels and Shorts with the textures of real ingredients.
    - list "Videos, horizontally scrollable":
      - listitem:
        - button "Play video — Down Town"
        - button "Unmute"
        - heading "Down Town" [level=3]
      - listitem:
        - button "Play video — Crimpit"
        - button "Unmute"
        - heading "Crimpit" [level=3]
      - listitem:
        - button "Play video — Cheesecake"
        - button "Unmute"
        - heading "Cheesecake" [level=3]
      - listitem:
        - button "Play video — Protein Pints"
        - button "Unmute"
        - heading "Protein Pints" [level=3]
      - listitem:
        - button "Play video — Lipstick"
        - button "Unmute"
        - heading "Lipstick" [level=3]
      - listitem:
        - button "Play video — Dunkin"
        - button "Unmute"
        - heading "Dunkin" [level=3]
  - region "The gallery":
    - heading "The gallery" [level=2]
    - paragraph: Stills from the kitchen and the road — select a photo for the story behind it.
    - list "Pictures, horizontally scrollable":
      - listitem:
        - img "Argo"
        - heading "Argo" [level=3]
      - listitem:
        - img "dawn"
        - heading "dawn" [level=3]
      - listitem:
        - img "dought"
        - heading "dought" [level=3]
      - listitem:
        - img "products"
        - heading "products" [level=3]
      - listitem:
        - img "salad"
        - heading "salad" [level=3]
  - region "Authenticity is the main ingredient.":
    - heading "Authenticity is the main ingredient." [level=2]
    - paragraph: I'm not a chef. I'm a home cook. I create authentic food and lifestyle content from my kitchens in Greece and the United States. I love discovering new recipes, testing everyday kitchen products, and showing people what actually works in a real home kitchen. My food isn't styled for perfection. Sometimes I cook in my pajamas. Sometimes my recipes fail and I share those too. Because that's real life. What matters most to me is creating content that feels natural, relatable and trustworthy, not like an advertisement. Real meals, real kitchens, real ingredients, real me
    - blockquote: No fuss, no pretension — just bold flavours and honest ingredients.
    - link "Let's collaborate":
      - /url: "#contact"
    - img "Placeholder artwork for the about portrait of Effie Kazantzidis — replace via the CMS."
  - region "Analytics 60 days!":
    - heading "Analytics 60 days!" [level=2]
    - paragraph: 5.8M Views
    - paragraph: Real performance numbers from my content.
    - text: 266.4K Likes
    - paragraph: Total likes on all content
    - text: 42.4 Shares
    - paragraph: Total content shares
    - text: 22.2K Followers
    - paragraph: Total community across platforms
    - text: 5.40% Engagement by views
    - paragraph: Engagement rate relative to views
    - text: 1,423.64% Engagement by followers
    - paragraph: Engagement rate relative to followers
    - paragraph: Data reflects 60-day period across all platforms.
  - region "LET'S WORK TOGETHER":
    - heading "LET'S WORK TOGETHER" [level=2]
    - paragraph: Available for brand partnerships, recipe development and UGC campaigns.
    - link "effaki7@gmail.com":
      - /url: mailto:effaki7@gmail.com
    - heading "Ways to reach me" [level=3]
    - list:
      - listitem:
        - text: "Phone:"
        - link "+484-340-8784":
          - /url: tel:+4843408784
      - listitem:
        - text: "Phone:"
        - link "+306977208612":
          - /url: tel:+306977208612
    - heading "Follow along" [level=3]
    - list:
      - listitem:
        - link "TikTok":
          - /url: https://www.tiktok.com/@efiamerikana
      - listitem:
        - link "Instagram":
          - /url: https://www.instagram.com/efi.amerikana
    - link "Get in touch":
      - /url: mailto:effaki7@gmail.com
- contentinfo:
  - paragraph: © 2026 EFIAMERIKANA · All rights reserved.
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | 
  3   | test.describe('video section', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/en/');
  6   |   });
  7   | 
  8   |   test('renders a card per video with posters and lazy playback attrs', async ({ page }) => {
  9   |     const section = page.locator('#videos');
  10  |     // Count-agnostic on purpose: entries are CMS-managed. The loop phase may
  11  |     // also multiply DOM copies behind data-sets, so assert ≥1 and uniqueness
  12  |     // of the details-overlay ids rather than an exact total.
  13  |     const cards = section.locator('[data-video-card]');
  14  |     expect(await cards.count()).toBeGreaterThanOrEqual(3);
  15  | 
  16  |     // :not([inert]) skips the loop's clone copies (inert is a bare boolean
  17  |     // attribute; with data-sets=1 nothing is inert, so this is a no-op there).
  18  |     // Interaction tests below need a REAL card: clones are aria-hidden (the
  19  |     // playback controller skips them) and parked off-screen by the loop's
  20  |     // normalise, which would fight scrollIntoViewIfNeeded forever.
  21  |     const real = cards.locator(':not([inert])').first();
  22  |     // Assert the SSR preload hint BEFORE scrolling: once the card is in view
  23  |     // the controller may promote the preload to 'auto' and the metadata
  24  |     // assertion would race the promotion.
> 25  |     await expect(real.locator('video[data-video]')).toHaveAttribute('preload', 'metadata');
      |                                                     ^ Error: expect(locator).toHaveAttribute(expected) failed
  26  |     // The poster is a lazy <img> overlay — the video element itself carries
  27  |     // no poster attribute (Chromium fetches those eagerly at render time,
  28  |     // viewport notwithstanding).
  29  |     await expect(real.locator('video[data-video]')).not.toHaveAttribute('poster');
  30  |     await expect(real.locator('[data-video-poster]')).toHaveAttribute('src', /.+/);
  31  |     await expect(real.locator('[data-video-poster]')).toHaveAttribute('loading', 'lazy');
  32  |     await real.scrollIntoViewIfNeeded();
  33  |     await expect(real.locator('video[data-video]')).toHaveAttribute('playsinline', '');
  34  |     await expect(real.locator('video[data-video]')).toHaveAttribute('muted', '');
  35  | 
  36  |     // The metadata overlay is always on now (no toggle) — its title text
  37  |     // ships in every card's SSR.
  38  |     await expect(real.locator('.media-overlay-gradient h3')).not.toBeEmpty();
  39  |   });
  40  | 
  41  |   test('arrows exist only while more items remain, and step one card', async ({ page }) => {
  42  |     test.skip(
  43  |       test.info().project.name === 'mobile-chromium',
  44  |       'arrows are sm+ only — phones use the native swipe',
  45  |     );
  46  |     // 900px sits between sm and lg: two slots, three shipped videos → the
  47  |     // rail overflows by exactly one card. (At the stock 1280 viewport all
  48  |     // three fit and the arrows retire entirely — covered in the fit test.)
  49  |     await page.setViewportSize({ width: 900, height: 700 });
  50  |     await page.goto('/en/');
  51  |     const section = page.locator('#videos');
  52  |     await section.scrollIntoViewIfNeeded();
  53  |     const rail = section.locator('[data-rail]');
  54  |     const next = section.locator('[data-rail-scroll="1"]');
  55  |     const prev = section.locator('[data-rail-scroll="-1"]');
  56  | 
  57  |     // Start of the rail: nothing to the left — no left arrow.
  58  |     await expect(prev).toBeHidden();
  59  |     await expect(next).toBeVisible();
  60  | 
  61  |     // Center mode steps ONE card, and each stop lands the active card
  62  |     // exactly on the midline (900 / 2).
  63  |     const centerOf = (locator: ReturnType<typeof page.locator>) => async () => {
  64  |       const box = await locator.boundingBox();
  65  |       return box ? box.x + box.width / 2 : 0;
  66  |     };
  67  |     const cards = page.locator('[data-video-card]:not([inert])');
  68  |     await next.click();
  69  |     await expect.poll(centerOf(cards.nth(1))).toBeCloseTo(450, -1);
  70  | 
  71  |     // Loop rails never retire the arrows — there is always another copy.
  72  |     // Bounded rails walk to the far end, where the next arrow retires
  73  |     // exactly there while the prev arrow is back for the return trip.
  74  |     const looping =
  75  |       (await section.locator('[data-video-rail-wrap]').getAttribute('data-sets')) !== '1';
  76  |     if (looping) {
  77  |       for (let i = 0; i < 3; i++) {
  78  |         await next.click();
  79  |         await page.waitForTimeout(650);
  80  |       }
  81  |       await expect(next).toBeVisible();
  82  |       await expect(prev).toBeVisible();
  83  |     } else {
  84  |       for (let i = 0; i < 12 && (await next.isVisible()); i++) {
  85  |         await next.click();
  86  |         await page.waitForTimeout(650); // smooth scroll + snap settle
  87  |       }
  88  |       await expect(next).toBeHidden();
  89  |       await expect(prev).toBeVisible();
  90  |     }
  91  |     await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  92  |   });
  93  | 
  94  |   test('at stock widths the rail is centered and the arrows match reality', async ({ page }) => {
  95  |     test.skip(
  96  |       test.info().project.name === 'mobile-chromium',
  97  |       'phones are single-card and overflow by design',
  98  |     );
  99  |     // Mode-aware on purpose: while the library fits its slots the whole
  100 |     // group centers and the arrows retire; once it outgrows them (or the
  101 |     // loop phase kicks in at 6+ videos) the active card centers instead and
  102 |     // the arrows stay. Either way, SOME card must sit exactly on the
  103 |     // midline and the arrows must agree with the measured overflow state.
  104 |     for (const width of [1280, 1900]) {
  105 |       await page.setViewportSize({ width, height: 945 });
  106 |       await page.goto('/en/');
  107 |       const section = page.locator('#videos');
  108 |       await section.scrollIntoViewIfNeeded();
  109 |       const wrap = section.locator('[data-video-rail-wrap]');
  110 |       const overflowing = (await wrap.getAttribute('data-overflow')) === 'true';
  111 |       const next = section.locator('[data-rail-scroll="1"]');
  112 |       const prev = section.locator('[data-rail-scroll="-1"]');
  113 | 
  114 |       const midlineDelta = async () => {
  115 |         const boxes = await page
  116 |           .locator('[data-video-card]:not([inert])')
  117 |           .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  118 |         return Math.min(...boxes.map((b) => Math.abs(b.x + b.width / 2 - width / 2)));
  119 |       };
  120 |       await expect.poll(midlineDelta, { timeout: 5_000 }).toBeLessThan(3);
  121 | 
  122 |       if (overflowing) {
  123 |         await expect(next).toBeVisible(); // loop mode: always more to reach
  124 |         await expect(prev).toBeVisible();
  125 |       } else {
```
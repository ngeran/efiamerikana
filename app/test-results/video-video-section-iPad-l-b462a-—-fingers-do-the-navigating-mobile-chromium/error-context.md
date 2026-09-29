# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: video.spec.ts >> video section >> iPad landscape: centered fit and no arrows — fingers do the navigating
- Location: tests/e2e/video.spec.ts:115:3

# Error details

```
Error: Playwright Test did not expect test.use() to be called here.
Most common reasons include:
- You are calling test.use() in a configuration file.
- You are calling test.use() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.
- You are calling test.use() from an async test.describe() block. Only sync ones are supported.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "efiamerikana" [ref=e5] [cursor=pointer]:
        - /url: /en
      - generic [ref=e6]:
        - link "Send an email (effaki7@gmail.com)" [ref=e7] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
        - button "Open menu" [ref=e11]
  - main [ref=e15]:
    - generic [ref=e18]:
      - img "Placeholder artwork for the hero portrait of Effie Kazantzidis — replace via the CMS." [ref=e20]
      - generic [ref=e21]:
        - paragraph [ref=e22]: efiamerikana
        - heading "Effie Kazantzidis" [level=1] [ref=e23]
        - generic [ref=e25]:
          - paragraph [ref=e26]: Greek-American Home Cook
          - paragraph [ref=e27]: Food • Lifestyle • UGC Content
        - paragraph [ref=e28]: Real food. Real life. Real personality.
        - generic [ref=e29]:
          - link "TikTok" [ref=e30] [cursor=pointer]:
            - /url: https://www.tiktok.com/@efiamerikana
          - link "Instagram" [ref=e33] [cursor=pointer]:
            - /url: https://www.instagram.com/efi.amerikana
    - link "view my portfolio" [ref=e36] [cursor=pointer]:
      - /url: "#videos"
    - region [ref=e40]:
      - generic [ref=e43]:
        - heading "Selected works" [level=2] [ref=e44]
        - paragraph [ref=e45]: Portrait cuts from the kitchen archives — TikToks, Reels and Shorts with the textures of real ingredients.
      - list "Videos, horizontally scrollable" [ref=e48]:
        - listitem [ref=e49]:
          - generic "Down Town" [ref=e52]
          - button "Play video — Down Town" [ref=e53] [cursor=pointer]
          - button "Unmute" [ref=e54]
          - button "Show video details" [ref=e59]
          - generic:
            - heading "Down Town" [level=3]
        - listitem [ref=e61]:
          - generic "Lipstick" [ref=e64]
          - button "Play video — Lipstick" [ref=e65] [cursor=pointer]
          - button "Unmute" [ref=e66]
          - button "Show video details" [ref=e71]
          - generic:
            - heading "Lipstick" [level=3]
        - listitem [ref=e73]:
          - generic "Dunkin" [ref=e76]
          - button "Play video — Dunkin" [ref=e77] [cursor=pointer]
          - button "Unmute" [ref=e78]
          - button "Show video details" [ref=e83]
          - generic:
            - heading "Dunkin" [level=3]
    - region [ref=e85]:
      - generic [ref=e88]:
        - heading "The gallery" [level=2] [ref=e89]
        - paragraph [ref=e90]: Stills from the kitchen and the road — select a photo for the story behind it.
      - list "Pictures, horizontally scrollable" [ref=e93]:
        - listitem [ref=e94]:
          - img "Argo" [ref=e97]
          - generic:
            - heading "Argo" [level=3]
        - listitem [ref=e98]:
          - img "dawn" [ref=e101]
          - generic:
            - heading "dawn" [level=3]
        - listitem [ref=e102]:
          - img "dought" [ref=e105]
          - generic:
            - heading "dought" [level=3]
        - listitem [ref=e106]:
          - img "products" [ref=e109]
          - generic:
            - heading "products" [level=3]
        - listitem [ref=e110]:
          - img "salad" [ref=e113]
          - generic:
            - heading "salad" [level=3]
    - region [ref=e114]:
      - generic [ref=e115]:
        - generic [ref=e116]:
          - heading "Authenticity is the main ingredient." [level=2] [ref=e119]
          - paragraph [ref=e121]: I'm not a chef. I'm a home cook. I create authentic food and lifestyle content from my kitchens in Greece and the United States. I love discovering new recipes, testing everyday kitchen products, and showing people what actually works in a real home kitchen. My food isn't styled for perfection. Sometimes I cook in my pajamas. Sometimes my recipes fail and I share those too. Because that's real life. What matters most to me is creating content that feels natural, relatable and trustworthy, not like an advertisement. Real meals, real kitchens, real ingredients, real me
          - blockquote [ref=e122]: No fuss, no pretension — just bold flavours and honest ingredients.
          - link "Let's collaborate" [ref=e124] [cursor=pointer]:
            - /url: "#contact"
        - img "Placeholder artwork for the about portrait of Effie Kazantzidis — replace via the CMS." [ref=e126]
    - region [ref=e127]:
      - generic [ref=e128]:
        - generic [ref=e129]:
          - heading "Analytics 60 days!" [level=2] [ref=e130]
          - paragraph [ref=e131]:
            - text: 5.8M
            - generic [ref=e132]: Views
          - paragraph [ref=e133]: Real performance numbers from my content.
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e138]: 266.4K
            - generic [ref=e139]: Likes
            - paragraph [ref=e140]: Total likes on all content
          - generic [ref=e141]:
            - generic [ref=e145]: "42.4"
            - generic [ref=e146]: Shares
            - paragraph [ref=e147]: Total content shares
          - generic [ref=e148]:
            - generic [ref=e152]: 22.2K
            - generic [ref=e153]: Followers
            - paragraph [ref=e154]: Total community across platforms
          - generic [ref=e155]:
            - generic [ref=e158]: 5.40%
            - generic [ref=e159]: Engagement by views
            - paragraph [ref=e160]: Engagement rate relative to views
          - generic [ref=e161]:
            - generic [ref=e164]: 1,423.64%
            - generic [ref=e165]: Engagement by followers
            - paragraph [ref=e166]: Engagement rate relative to followers
        - paragraph [ref=e167]: Data reflects 60-day period across all platforms.
    - region [ref=e168]:
      - generic [ref=e169]:
        - heading "LET'S WORK TOGETHER" [level=2] [ref=e170]
        - paragraph [ref=e171]: Available for brand partnerships, recipe development and UGC campaigns.
        - link "effaki7@gmail.com" [ref=e172] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
        - generic [ref=e173]:
          - heading "Ways to reach me" [level=3] [ref=e174]
          - list [ref=e175]:
            - listitem [ref=e176]:
              - generic [ref=e179]: "Phone:"
              - link "+484-340-8784" [ref=e180] [cursor=pointer]:
                - /url: tel:+4843408784
            - listitem [ref=e181]:
              - generic [ref=e184]: "Phone:"
              - link "+306977208612" [ref=e185] [cursor=pointer]:
                - /url: tel:+306977208612
        - generic [ref=e186]:
          - heading "Follow along" [level=3] [ref=e187]
          - list [ref=e188]:
            - listitem [ref=e189]:
              - link "TikTok" [ref=e190] [cursor=pointer]:
                - /url: https://www.tiktok.com/@efiamerikana
            - listitem [ref=e193]:
              - link "Instagram" [ref=e194] [cursor=pointer]:
                - /url: https://www.instagram.com/efi.amerikana
        - link "Get in touch" [ref=e197] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
  - contentinfo [ref=e200]:
    - paragraph [ref=e202]: © 2026 EFIAMERIKANA · All rights reserved.
```

# Test source

```ts
  18  |     // Interaction tests below need a REAL card: clones are aria-hidden (the
  19  |     // playback controller skips them) and parked off-screen by the loop's
  20  |     // normalise, which would fight scrollIntoViewIfNeeded forever.
  21  |     const real = cards.locator(':not([inert])').first();
  22  |     // Assert the SSR preload hint BEFORE scrolling: once the card is in view
  23  |     // the controller may promote the preload to 'auto' and the metadata
  24  |     // assertion would race the promotion.
  25  |     await expect(real.locator('video[data-video]')).toHaveAttribute('preload', 'metadata');
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
  36  |     const ids = await cards.evaluateAll((els) =>
  37  |       els.map((el) => el.querySelector('[id^="video-details-"]')?.id ?? ''),
  38  |     );
  39  |     expect(new Set(ids).size).toBe(ids.length); // no duplicate overlay ids
  40  |   });
  41  | 
  42  |   test('arrows exist only while more items remain, and step one card', async ({ page }) => {
  43  |     test.skip(
  44  |       test.info().project.name === 'mobile-chromium',
  45  |       'arrows are sm+ only — phones use the native swipe',
  46  |     );
  47  |     // 900px sits between sm and lg: two slots, three shipped videos → the
  48  |     // rail overflows by exactly one card. (At the stock 1280 viewport all
  49  |     // three fit and the arrows retire entirely — covered in the fit test.)
  50  |     await page.setViewportSize({ width: 900, height: 700 });
  51  |     await page.goto('/en/');
  52  |     const section = page.locator('#videos');
  53  |     await section.scrollIntoViewIfNeeded();
  54  |     const rail = section.locator('[data-rail]');
  55  |     const next = section.locator('[data-rail-scroll="1"]');
  56  |     const prev = section.locator('[data-rail-scroll="-1"]');
  57  | 
  58  |     // Start of the rail: nothing to the left — no left arrow.
  59  |     await expect(prev).toBeHidden();
  60  |     await expect(next).toBeVisible();
  61  | 
  62  |     // Center mode steps ONE card, and each stop lands the active card
  63  |     // exactly on the midline (900 / 2).
  64  |     const centerOf = (locator: ReturnType<typeof page.locator>) => async () => {
  65  |       const box = await locator.boundingBox();
  66  |       return box ? box.x + box.width / 2 : 0;
  67  |     };
  68  |     const cards = page.locator('[data-video-card]:not([inert])');
  69  |     await next.click();
  70  |     await expect.poll(centerOf(cards.nth(1))).toBeCloseTo(450, -1);
  71  | 
  72  |     // Walk to the far end: the next arrow retires exactly there, while the
  73  |     // prev arrow is back for the return trip.
  74  |     for (let i = 0; i < 12 && (await next.isVisible()); i++) {
  75  |       await next.click();
  76  |       await page.waitForTimeout(650); // smooth scroll + snap settle
  77  |     }
  78  |     await expect(next).toBeHidden();
  79  |     await expect(prev).toBeVisible();
  80  |     await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  81  |   });
  82  | 
  83  |   test('when every card fits, the group centers and the arrows retire', async ({ page }) => {
  84  |     test.skip(
  85  |       test.info().project.name === 'mobile-chromium',
  86  |       'phones are single-card and overflow by design',
  87  |     );
  88  |     // Both stock widths matter: 1280 (xl, 4 slots) and 1900 (2xl, 5 slots).
  89  |     // These were chosen as regression cases TWICE: Chrome counts the center
  90  |     // mode's phantom END MARGINS in scrollWidth, and the bootstrap publish
  91  |     // runs before the fit layout engages — both made overflow read as
  92  |     // permanently true exactly at these widths (iPad landscape included),
  93  |     // so every width asserts, no skips.
  94  |     for (const width of [1280, 1900]) {
  95  |       await page.setViewportSize({ width, height: 945 });
  96  |       await page.goto('/en/');
  97  |       const section = page.locator('#videos');
  98  |       await section.scrollIntoViewIfNeeded();
  99  | 
  100 |       // Nothing to scroll: the arrows have nothing to offer, and the group
  101 |       // centers instead of hugging the left edge — with three cards the
  102 |       // middle one rides the viewport midline.
  103 |       await expect(section.locator('[data-rail-scroll="1"]')).toBeHidden();
  104 |       await expect(section.locator('[data-rail-scroll="-1"]')).toBeHidden();
  105 |       const middle = page.locator('[data-video-card]:not([inert])').nth(1);
  106 |       await expect
  107 |         .poll(async () => {
  108 |           const box = await middle.boundingBox();
  109 |           return box ? box.x + box.width / 2 : 0;
  110 |         })
  111 |         .toBeCloseTo(width / 2, -1);
  112 |     }
  113 |   });
  114 | 
  115 |   test('iPad landscape: centered fit and no arrows — fingers do the navigating', async ({
  116 |     page,
  117 |   }) => {
> 118 |     test.use({ hasTouch: true, isMobile: true });
      |          ^ Error: Playwright Test did not expect test.use() to be called here.
  119 |     test.skip(
  120 |       test.info().project.name !== 'desktop-chromium',
  121 |       'isMobile is a Chromium context option',
  122 |     );
  123 |     // The deadlock regression: at lg/xl the shipped 3 cards fit their slots
  124 |     // (3/3 and 4/4), but the first publish measured under the pre-fit
  125 |     // layout, read the phantom end margins as overflow, and the rail stuck
  126 |     // off-center with the next arrow up. Touch devices must ALSO never see
  127 |     // the arrows at all — the finger is the navigation there.
  128 |     for (const [width, height] of [
  129 |       [1080, 810], // iPad (gen 7) landscape — lg, 3 slots
  130 |       [1194, 834], // iPad Pro 11 landscape — lg
  131 |       [1280, 1024], // iPad Pro 12.9 landscape — xl, 4 slots
  132 |     ] as const) {
  133 |       await page.setViewportSize({ width, height });
  134 |       await page.goto('/en/');
  135 |       const section = page.locator('#videos');
  136 |       await section.scrollIntoViewIfNeeded();
  137 | 
  138 |       await expect(section.locator('[data-rail-scroll="1"]')).toBeHidden();
  139 |       await expect(section.locator('[data-rail-scroll="-1"]')).toBeHidden();
  140 |       const middle = page.locator('[data-video-card]:not([inert])').nth(1);
  141 |       await expect
  142 |         .poll(async () => {
  143 |           const box = await middle.boundingBox();
  144 |           return box ? box.x + box.width / 2 : 0;
  145 |         })
  146 |         .toBeCloseTo(width / 2, -1);
  147 |     }
  148 |   });
  149 | 
  150 |   test('rail arrows are hidden on phones (finger swipe is the control)', async ({ page }) => {
  151 |     test.skip(
  152 |       test.info().project.name !== 'mobile-chromium',
  153 |       'desktop keeps the arrows — covered by the test above',
  154 |     );
  155 |     const section = page.locator('#videos');
  156 |     await section.scrollIntoViewIfNeeded();
  157 |     await expect(section.locator('[data-rail-scroll="1"]')).toBeHidden();
  158 |   });
  159 | 
  160 |   test('stays paused below the fold, autoplays on scroll-in, pause sticks', async ({ page }) => {
  161 |     const card = page.locator('[data-video-card]:not([inert])').first();
  162 |     const video = card.locator('video[data-video]');
  163 | 
  164 |     // Below the fold on load: paused poster frame — no winner plays; at most
  165 |     // a moov-only metadata fetch happens for cards near the fold.
  166 |     await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
  167 | 
  168 |     // Scrolled into view: the most-visible card autoplays (muted) and has
  169 |     // been warmed to preload="auto" by the controller.
  170 |     await card.scrollIntoViewIfNeeded();
  171 |     await expect
  172 |       .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
  173 |       .toBe(false);
  174 |     await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).preload)).toBe('auto');
  175 |     await expect(card).toHaveAttribute('data-playing', 'true');
  176 |     // First frame is up: the poster overlay has faded out — and stays gone
  177 |     // (the latch never resets; a paused video keeps its last frame).
  178 |     await expect(card).toHaveAttribute('data-started', 'true');
  179 |     await expect(card.locator('[data-video-poster]')).toHaveCSS('opacity', '0');
  180 | 
  181 |     // Explicit pause wins over autoplay while still in view.
  182 |     await card.locator('[data-play-toggle]').click();
  183 |     await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
  184 |     await expect(card).toHaveAttribute('data-playing', 'false');
  185 | 
  186 |     // Scrolled far away: paused by the visibility controller.
  187 |     await card.locator('[data-play-toggle]').click(); // resume
  188 |     await page.locator('#contact').scrollIntoViewIfNeeded();
  189 |     await expect
  190 |       .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 5_000 })
  191 |       .toBe(true);
  192 |   });
  193 | 
  194 |   test('a card taller than the viewport still autoplays (landscape phone)', async ({ page }) => {
  195 |     // 568×320: below the sm breakpoint (centered rail card), and the 9:16
  196 |     // card is ~2.8× the viewport height. Against its own height its visible
  197 |     // fraction tops out at ~0.36 — the old coverage metric could never pass
  198 |     // the 0.5 gate here, so landscape phones got no autoplay at all. The
  199 |     // metric now measures against the smaller of card/viewport extent, so a
  200 |     // card that fills the screen scores 1.0.
  201 |     await page.setViewportSize({ width: 568, height: 320 });
  202 |     await page.goto('/en/');
  203 |     const card = page.locator('[data-video-card]:not([inert])').first();
  204 |     const video = card.locator('video[data-video]');
  205 |     await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
  206 | 
  207 |     // Park the card so it spans the full (short) viewport.
  208 |     await card.evaluate((el) => {
  209 |       const top = el.getBoundingClientRect().top;
  210 |       window.scrollBy(0, top);
  211 |     });
  212 |     await expect
  213 |       .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
  214 |       .toBe(false);
  215 |   });
  216 | 
  217 |   test('returning to a played card resumes where it left off (no re-warm restart)', async ({
  218 |     page,
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: video.spec.ts >> video section >> iPad landscape: centered fit and no arrows — fingers do the navigating
- Location: tests/e2e/video.spec.ts:132:3

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
      - navigation "Main navigation" [ref=e6]:
        - list [ref=e7]:
          - listitem [ref=e8]:
            - link "Home" [ref=e9] [cursor=pointer]:
              - /url: "#hero"
          - listitem [ref=e10]:
            - link "Videos" [ref=e11] [cursor=pointer]:
              - /url: "#videos"
          - listitem [ref=e12]:
            - link "Pictures" [ref=e13] [cursor=pointer]:
              - /url: "#pictures"
          - listitem [ref=e14]:
            - link "About" [ref=e15] [cursor=pointer]:
              - /url: "#about"
          - listitem [ref=e16]:
            - link "Analytics" [ref=e17] [cursor=pointer]:
              - /url: "#analytics"
          - listitem [ref=e18]:
            - link "Contact" [ref=e19] [cursor=pointer]:
              - /url: "#contact"
      - link "Send an email (effaki7@gmail.com)" [ref=e21] [cursor=pointer]:
        - /url: mailto:effaki7@gmail.com
        - generic [ref=e25]: Email me
  - main [ref=e26]:
    - generic [ref=e27]:
      - generic [ref=e29]:
        - img "Placeholder artwork for the hero portrait of Effie Kazantzidis — replace via the CMS." [ref=e31]
        - generic [ref=e32]:
          - paragraph [ref=e33]: efiamerikana
          - heading "Effie Kazantzidis" [level=1] [ref=e34]
          - generic [ref=e36]:
            - paragraph [ref=e37]: Greek-American Home Cook
            - paragraph [ref=e38]: Food • Lifestyle • UGC Content
          - paragraph [ref=e39]: Real food. Real life. Real personality.
          - generic [ref=e40]:
            - link "TikTok" [ref=e41] [cursor=pointer]:
              - /url: https://www.tiktok.com/@efiamerikana
            - link "Instagram" [ref=e44] [cursor=pointer]:
              - /url: https://www.instagram.com/efi.amerikana
      - link "view my portfolio" [ref=e50] [cursor=pointer]:
        - /url: "#videos"
    - region [ref=e54]:
      - generic [ref=e57]:
        - heading "Selected works" [level=2] [ref=e58]
        - paragraph [ref=e59]: Portrait cuts from the kitchen archives — TikToks, Reels and Shorts with the textures of real ingredients.
      - generic [ref=e61]:
        - button "Scroll videos forward" [ref=e62]
        - list "Videos, horizontally scrollable" [ref=e65]:
          - listitem [ref=e66]:
            - button [ref=e69] [cursor=pointer]
            - button [ref=e70]
            - generic:
              - heading [level=3]: Down Town
          - listitem [ref=e75]:
            - button [ref=e78] [cursor=pointer]
            - button [ref=e79]
            - generic:
              - heading [level=3]: Crimpit
          - listitem [ref=e84]:
            - button [ref=e87] [cursor=pointer]
            - button [ref=e88]
            - generic:
              - heading [level=3]: Cheesecake
          - listitem [ref=e93]:
            - button [ref=e96] [cursor=pointer]
            - button [ref=e97]
            - generic:
              - heading [level=3]: Protein Pints
          - listitem [ref=e102]:
            - button [ref=e105] [cursor=pointer]
            - button [ref=e106]
            - generic:
              - heading [level=3]: Lipstick
          - listitem [ref=e111]:
            - button [ref=e114] [cursor=pointer]
            - button [ref=e115]
            - generic:
              - heading [level=3]: Dunkin
          - listitem [ref=e120]:
            - generic "Down Town" [ref=e123]
            - button "Play video — Down Town" [ref=e124] [cursor=pointer]
            - button "Unmute" [ref=e125]
            - generic:
              - heading "Down Town" [level=3]
          - listitem [ref=e130]:
            - generic "Crimpit" [ref=e133]
            - button "Play video — Crimpit" [ref=e134] [cursor=pointer]
            - button "Unmute" [ref=e135]
            - generic:
              - heading "Crimpit" [level=3]
          - listitem [ref=e140]:
            - generic "Cheesecake" [ref=e143]
            - button "Play video — Cheesecake" [ref=e144] [cursor=pointer]
            - button "Unmute" [ref=e145]
            - generic:
              - heading "Cheesecake" [level=3]
          - listitem [ref=e150]:
            - generic "Protein Pints" [ref=e153]
            - button "Play video — Protein Pints" [ref=e154] [cursor=pointer]
            - button "Unmute" [ref=e155]
            - generic:
              - heading "Protein Pints" [level=3]
          - listitem [ref=e160]:
            - generic "Lipstick" [ref=e163]
            - button "Play video — Lipstick" [ref=e164] [cursor=pointer]
            - button "Unmute" [ref=e165]
            - generic:
              - heading "Lipstick" [level=3]
          - listitem [ref=e170]:
            - generic "Dunkin" [ref=e173]
            - button "Play video — Dunkin" [ref=e174] [cursor=pointer]
            - button "Unmute" [ref=e175]
            - generic:
              - heading "Dunkin" [level=3]
          - listitem [ref=e180]:
            - button [ref=e183] [cursor=pointer]
            - button [ref=e184]
            - generic:
              - heading [level=3]: Down Town
          - listitem [ref=e189]:
            - button [ref=e192] [cursor=pointer]
            - button [ref=e193]
            - generic:
              - heading [level=3]: Crimpit
          - listitem [ref=e198]:
            - button [ref=e201] [cursor=pointer]
            - button [ref=e202]
            - generic:
              - heading [level=3]: Cheesecake
          - listitem [ref=e207]:
            - button [ref=e210] [cursor=pointer]
            - button [ref=e211]
            - generic:
              - heading [level=3]: Protein Pints
          - listitem [ref=e216]:
            - button [ref=e219] [cursor=pointer]
            - button [ref=e220]
            - generic:
              - heading [level=3]: Lipstick
          - listitem [ref=e225]:
            - button [ref=e228] [cursor=pointer]
            - button [ref=e229]
            - generic:
              - heading [level=3]: Dunkin
    - region [ref=e234]:
      - generic [ref=e237]:
        - heading "The gallery" [level=2] [ref=e238]
        - paragraph [ref=e239]: Stills from the kitchen and the road — select a photo for the story behind it.
      - generic [ref=e241]:
        - button "Scroll pictures back" [ref=e242]
        - button "Scroll pictures forward" [ref=e245]
        - list "Pictures, horizontally scrollable" [ref=e248]:
          - listitem [ref=e249]:
            - img "Argo" [ref=e252]
            - generic:
              - heading "Argo" [level=3]
          - listitem [ref=e253]:
            - img "dawn" [ref=e256]
            - generic:
              - heading "dawn" [level=3]
          - listitem [ref=e257]:
            - img "dought" [ref=e260]
            - generic:
              - heading "dought" [level=3]
          - listitem [ref=e261]:
            - img "products" [ref=e264]
            - generic:
              - heading "products" [level=3]
          - listitem [ref=e265]:
            - img "salad" [ref=e268]
            - generic:
              - heading "salad" [level=3]
    - region [ref=e269]:
      - generic [ref=e270]:
        - generic [ref=e271]:
          - heading "Authenticity is the main ingredient." [level=2] [ref=e274]
          - paragraph [ref=e276]: I'm not a chef. I'm a home cook. I create authentic food and lifestyle content from my kitchens in Greece and the United States. I love discovering new recipes, testing everyday kitchen products, and showing people what actually works in a real home kitchen. My food isn't styled for perfection. Sometimes I cook in my pajamas. Sometimes my recipes fail and I share those too. Because that's real life. What matters most to me is creating content that feels natural, relatable and trustworthy, not like an advertisement. Real meals, real kitchens, real ingredients, real me
          - blockquote [ref=e277]: No fuss, no pretension — just bold flavours and honest ingredients.
          - link "Let's collaborate" [ref=e279] [cursor=pointer]:
            - /url: "#contact"
        - img "Placeholder artwork for the about portrait of Effie Kazantzidis — replace via the CMS." [ref=e281]
    - region [ref=e282]:
      - generic [ref=e283]:
        - generic [ref=e284]:
          - heading "Analytics 60 days!" [level=2] [ref=e285]
          - paragraph [ref=e286]:
            - text: 5.8M
            - generic [ref=e287]: Views
          - paragraph [ref=e288]: Real performance numbers from my content.
        - generic [ref=e289]:
          - generic [ref=e290]:
            - generic [ref=e293]: 266.4K
            - generic [ref=e294]: Likes
            - paragraph [ref=e295]: Total likes on all content
          - generic [ref=e296]:
            - generic [ref=e300]: "42.4"
            - generic [ref=e301]: Shares
            - paragraph [ref=e302]: Total content shares
          - generic [ref=e303]:
            - generic [ref=e307]: 22.2K
            - generic [ref=e308]: Followers
            - paragraph [ref=e309]: Total community across platforms
          - generic [ref=e310]:
            - generic [ref=e313]: 5.40%
            - generic [ref=e314]: Engagement by views
            - paragraph [ref=e315]: Engagement rate relative to views
          - generic [ref=e316]:
            - generic [ref=e319]: 1,423.64%
            - generic [ref=e320]: Engagement by followers
            - paragraph [ref=e321]: Engagement rate relative to followers
        - paragraph [ref=e322]: Data reflects 60-day period across all platforms.
    - region [ref=e323]:
      - generic [ref=e324]:
        - heading "LET'S WORK TOGETHER" [level=2] [ref=e325]
        - paragraph [ref=e326]: Available for brand partnerships, recipe development and UGC campaigns.
        - link "effaki7@gmail.com" [ref=e327] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
        - generic [ref=e328]:
          - heading "Ways to reach me" [level=3] [ref=e329]
          - list [ref=e330]:
            - listitem [ref=e331]:
              - generic [ref=e334]: "Phone:"
              - link "+484-340-8784" [ref=e335] [cursor=pointer]:
                - /url: tel:+4843408784
            - listitem [ref=e336]:
              - generic [ref=e339]: "Phone:"
              - link "+306977208612" [ref=e340] [cursor=pointer]:
                - /url: tel:+306977208612
        - generic [ref=e341]:
          - heading "Follow along" [level=3] [ref=e342]
          - list [ref=e343]:
            - listitem [ref=e344]:
              - link "TikTok" [ref=e345] [cursor=pointer]:
                - /url: https://www.tiktok.com/@efiamerikana
            - listitem [ref=e348]:
              - link "Instagram" [ref=e349] [cursor=pointer]:
                - /url: https://www.instagram.com/efi.amerikana
        - link "Get in touch" [ref=e352] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
  - contentinfo [ref=e355]:
    - paragraph [ref=e357]: © 2026 EFIAMERIKANA · All rights reserved.
```

# Test source

```ts
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
  126 |         await expect(next).toBeHidden();
  127 |         await expect(prev).toBeHidden();
  128 |       }
  129 |     }
  130 |   });
  131 | 
  132 |   test('iPad landscape: centered fit and no arrows — fingers do the navigating', async ({
  133 |     page,
  134 |   }) => {
> 135 |     test.use({ hasTouch: true, isMobile: true });
      |          ^ Error: Playwright Test did not expect test.use() to be called here.
  136 |     test.skip(
  137 |       test.info().project.name !== 'desktop-chromium',
  138 |       'isMobile is a Chromium context option',
  139 |     );
  140 |     // The deadlock regression: at lg/xl the shipped 3 cards fit their slots
  141 |     // (3/3 and 4/4), but the first publish measured under the pre-fit
  142 |     // layout, read the phantom end margins as overflow, and the rail stuck
  143 |     // off-center with the next arrow up. Touch devices must ALSO never see
  144 |     // the arrows at all — the finger is the navigation there.
  145 |     for (const [width, height] of [
  146 |       [1080, 810], // iPad (gen 7) landscape — lg, 3 slots
  147 |       [1194, 834], // iPad Pro 11 landscape — lg
  148 |       [1280, 1024], // iPad Pro 12.9 landscape — xl, 4 slots
  149 |     ] as const) {
  150 |       await page.setViewportSize({ width, height });
  151 |       await page.goto('/en/');
  152 |       const section = page.locator('#videos');
  153 |       await section.scrollIntoViewIfNeeded();
  154 | 
  155 |       await expect(section.locator('[data-rail-scroll="1"]')).toBeHidden();
  156 |       await expect(section.locator('[data-rail-scroll="-1"]')).toBeHidden();
  157 |       // Fit mode centers the middle of the group; overflow mode centers the
  158 |       // active card. Either way one card sits exactly on the midline.
  159 |       const midlineDelta = async () => {
  160 |         const boxes = await page
  161 |           .locator('[data-video-card]:not([inert])')
  162 |           .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  163 |         return Math.min(...boxes.map((b) => Math.abs(b.x + b.width / 2 - width / 2)));
  164 |       };
  165 |       await expect.poll(midlineDelta, { timeout: 5_000 }).toBeLessThan(3);
  166 |     }
  167 |   });
  168 | 
  169 |   test('rail arrows are hidden on phones (finger swipe is the control)', async ({ page }) => {
  170 |     test.skip(
  171 |       test.info().project.name !== 'mobile-chromium',
  172 |       'desktop keeps the arrows — covered by the test above',
  173 |     );
  174 |     const section = page.locator('#videos');
  175 |     await section.scrollIntoViewIfNeeded();
  176 |     await expect(section.locator('[data-rail-scroll="1"]')).toBeHidden();
  177 |   });
  178 | 
  179 |   test('stays paused below the fold, autoplays on scroll-in, pause sticks', async ({ page }) => {
  180 |     const card = page.locator('[data-video-card]:not([inert])').first();
  181 |     const video = card.locator('video[data-video]');
  182 | 
  183 |     // Below the fold on load: paused poster frame — no winner plays; at most
  184 |     // a moov-only metadata fetch happens for cards near the fold.
  185 |     await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
  186 | 
  187 |     // Scrolled into view: the most-visible card autoplays (muted) and has
  188 |     // been warmed to preload="auto" by the controller.
  189 |     await card.scrollIntoViewIfNeeded();
  190 |     await expect
  191 |       .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
  192 |       .toBe(false);
  193 |     await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).preload)).toBe('auto');
  194 |     await expect(card).toHaveAttribute('data-playing', 'true');
  195 |     // First frame is up: the poster overlay has faded out — and stays gone
  196 |     // (the latch never resets; a paused video keeps its last frame).
  197 |     await expect(card).toHaveAttribute('data-started', 'true');
  198 |     await expect(card.locator('[data-video-poster]')).toHaveCSS('opacity', '0');
  199 | 
  200 |     // Explicit pause wins over autoplay while still in view — via the
  201 |     // KEYBOARD (Enter on the surface = click with detail 0). A mouse click
  202 |     // is deliberately inert: the pointer control is hover.
  203 |     await card.locator('[data-play-toggle]').focus();
  204 |     await page.keyboard.press('Enter');
  205 |     await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
  206 |     await expect(card).toHaveAttribute('data-playing', 'false');
  207 | 
  208 |     // Scrolled far away: paused by the visibility controller.
  209 |     await page.keyboard.press('Enter'); // resume
  210 |     await page.locator('#contact').scrollIntoViewIfNeeded();
  211 |     await expect
  212 |       .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 5_000 })
  213 |       .toBe(true);
  214 |   });
  215 | 
  216 |   test('a card taller than the viewport still autoplays (landscape phone)', async ({ page }) => {
  217 |     // 568×320: below the sm breakpoint (centered rail card), and the 9:16
  218 |     // card is ~2.8× the viewport height. Against its own height its visible
  219 |     // fraction tops out at ~0.36 — the old coverage metric could never pass
  220 |     // the 0.5 gate here, so landscape phones got no autoplay at all. The
  221 |     // metric now measures against the smaller of card/viewport extent, so a
  222 |     // card that fills the screen scores 1.0.
  223 |     await page.setViewportSize({ width: 568, height: 320 });
  224 |     await page.goto('/en/');
  225 |     const card = page.locator('[data-video-card]:not([inert])').first();
  226 |     const video = card.locator('video[data-video]');
  227 |     await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
  228 | 
  229 |     // Park the card so it spans the full (short) viewport.
  230 |     await card.evaluate((el) => {
  231 |       const top = el.getBoundingClientRect().top;
  232 |       window.scrollBy(0, top);
  233 |     });
  234 |     await expect
  235 |       .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: video.spec.ts >> video section >> mouse hover plays a non-winner card, leaving pauses it; clicks are inert
- Location: tests/e2e/video.spec.ts:361:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - link "Skip to content" [ref=f1e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=f1e3]:
    - generic [ref=f1e4]:
      - link "efiamerikana" [ref=f1e5] [cursor=pointer]:
        - /url: /en
      - navigation "Main navigation" [ref=f1e6]:
        - list [ref=f1e7]:
          - listitem [ref=f1e8]:
            - link "Home" [ref=f1e9] [cursor=pointer]:
              - /url: "#hero"
          - listitem [ref=f1e10]:
            - link "Videos" [ref=f1e11] [cursor=pointer]:
              - /url: "#videos"
          - listitem [ref=f1e12]:
            - link "Pictures" [ref=f1e13] [cursor=pointer]:
              - /url: "#pictures"
          - listitem [ref=f1e14]:
            - link "About" [ref=f1e15] [cursor=pointer]:
              - /url: "#about"
          - listitem [ref=f1e16]:
            - link "Analytics" [ref=f1e17] [cursor=pointer]:
              - /url: "#analytics"
          - listitem [ref=f1e18]:
            - link "Contact" [ref=f1e19] [cursor=pointer]:
              - /url: "#contact"
      - link "Send an email (effaki7@gmail.com)" [ref=f1e21] [cursor=pointer]:
        - /url: mailto:effaki7@gmail.com
        - generic [ref=f1e25]: Email me
  - main [ref=f1e26]:
    - generic [ref=f1e27]:
      - generic [ref=f1e29]:
        - img "Placeholder artwork for the hero portrait of Effie Kazantzidis — replace via the CMS." [ref=f1e31]
        - generic [ref=f1e32]:
          - paragraph [ref=f1e33]: efiamerikana
          - heading "Effie Kazantzidis" [level=1] [ref=f1e34]
          - generic [ref=f1e36]:
            - paragraph [ref=f1e37]: Greek-American Home Cook
            - paragraph [ref=f1e38]: Food • Lifestyle • UGC Content
          - paragraph [ref=f1e39]: Real food. Real life. Real personality.
          - generic [ref=f1e40]:
            - link "TikTok" [ref=f1e41] [cursor=pointer]:
              - /url: https://www.tiktok.com/@efiamerikana
            - link "Instagram" [ref=f1e44] [cursor=pointer]:
              - /url: https://www.instagram.com/efi.amerikana
      - link "view my portfolio" [ref=f1e50] [cursor=pointer]:
        - /url: "#videos"
    - region [ref=f1e54]:
      - generic [ref=f1e57]:
        - heading "Selected works" [level=2] [ref=f1e58]
        - paragraph [ref=f1e59]: Portrait cuts from the kitchen archives — TikToks, Reels and Shorts with the textures of real ingredients.
      - generic [ref=f1e61]:
        - button "Scroll videos back" [ref=f1e62]
        - button "Scroll videos forward" [ref=f1e65]
        - list "Videos, horizontally scrollable" [ref=f1e68]:
          - listitem [ref=f1e69]:
            - button [ref=f1e72] [cursor=pointer]
            - button [ref=f1e73]
            - generic:
              - heading [level=3]: Down Town
          - listitem [ref=f1e78]:
            - button [ref=f1e81] [cursor=pointer]
            - button [ref=f1e82]
            - generic:
              - heading [level=3]: Crimpit
          - listitem [ref=f1e87]:
            - button [ref=f1e90] [cursor=pointer]
            - button [ref=f1e91]
            - generic:
              - heading [level=3]: Cheesecake
          - listitem [ref=f1e96]:
            - button [ref=f1e99] [cursor=pointer]
            - button [ref=f1e100]
            - generic:
              - heading [level=3]: Protein Pints
          - listitem [ref=f1e105]:
            - button [ref=f1e108] [cursor=pointer]
            - button [ref=f1e109]
            - generic:
              - heading [level=3]: Lipstick
          - listitem [ref=f1e114]:
            - button [ref=f1e117] [cursor=pointer]
            - button [ref=f1e118]
            - generic:
              - heading [level=3]: Dunkin
          - listitem [ref=f1e123]:
            - generic "Down Town" [ref=f1e126]
            - button "Play video — Down Town" [ref=f1e127] [cursor=pointer]
            - button "Unmute" [ref=f1e128]
            - generic:
              - heading "Down Town" [level=3]
          - listitem [ref=f1e133]:
            - generic "Crimpit" [ref=f1e136]
            - button "Play video — Crimpit" [ref=f1e137] [cursor=pointer]
            - button "Unmute" [ref=f1e138]
            - generic:
              - heading "Crimpit" [level=3]
          - listitem [ref=f1e143]:
            - generic "Cheesecake" [ref=f1e146]
            - button "Pause video — Cheesecake" [ref=f1e147] [cursor=pointer]
            - button "Unmute" [ref=f1e148]
            - generic:
              - heading "Cheesecake" [level=3]
          - listitem [ref=f1e153]:
            - generic "Protein Pints" [ref=f1e156]
            - button "Pause video — Protein Pints" [ref=f1e157] [cursor=pointer]
            - button "Unmute" [ref=f1e158]
            - generic:
              - heading "Protein Pints" [level=3]
          - listitem [ref=f1e163]:
            - generic "Lipstick" [ref=f1e166]
            - button "Play video — Lipstick" [ref=f1e167] [cursor=pointer]
            - button "Unmute" [ref=f1e168]
            - generic:
              - heading "Lipstick" [level=3]
          - listitem [ref=f1e173]:
            - generic "Dunkin" [ref=f1e176]
            - button "Play video — Dunkin" [ref=f1e177] [cursor=pointer]
            - button "Unmute" [ref=f1e178]
            - generic:
              - heading "Dunkin" [level=3]
          - listitem [ref=f1e183]:
            - button [ref=f1e186] [cursor=pointer]
            - button [ref=f1e187]
            - generic:
              - heading [level=3]: Down Town
          - listitem [ref=f1e192]:
            - button [ref=f1e195] [cursor=pointer]
            - button [ref=f1e196]
            - generic:
              - heading [level=3]: Crimpit
          - listitem [ref=f1e201]:
            - button [ref=f1e204] [cursor=pointer]
            - button [ref=f1e205]
            - generic:
              - heading [level=3]: Cheesecake
          - listitem [ref=f1e210]:
            - button [ref=f1e213] [cursor=pointer]
            - button [ref=f1e214]
            - generic:
              - heading [level=3]: Protein Pints
          - listitem [ref=f1e219]:
            - button [ref=f1e222] [cursor=pointer]
            - button [ref=f1e223]
            - generic:
              - heading [level=3]: Lipstick
          - listitem [ref=f1e228]:
            - button [ref=f1e231] [cursor=pointer]
            - button [ref=f1e232]
            - generic:
              - heading [level=3]: Dunkin
    - region [ref=f1e237]:
      - generic [ref=f1e240]:
        - heading "The gallery" [level=2] [ref=f1e241]
        - paragraph [ref=f1e242]: Stills from the kitchen and the road — select a photo for the story behind it.
      - generic [ref=f1e244]:
        - button "Scroll pictures back" [ref=f1e245]
        - button "Scroll pictures forward" [ref=f1e248]
        - list "Pictures, horizontally scrollable" [ref=f1e251]:
          - listitem [ref=f1e252]:
            - img "Argo" [ref=f1e255]
            - generic:
              - heading "Argo" [level=3]
          - listitem [ref=f1e256]:
            - img "dawn" [ref=f1e259]
            - generic:
              - heading "dawn" [level=3]
          - listitem [ref=f1e260]:
            - img "dought" [ref=f1e263]
            - generic:
              - heading "dought" [level=3]
          - listitem [ref=f1e264]:
            - img "products" [ref=f1e267]
            - generic:
              - heading "products" [level=3]
          - listitem [ref=f1e268]:
            - img "salad" [ref=f1e271]
            - generic:
              - heading "salad" [level=3]
    - region [ref=f1e272]:
      - generic [ref=f1e273]:
        - generic [ref=f1e274]:
          - heading "Authenticity is the main ingredient." [level=2] [ref=f1e277]
          - paragraph [ref=f1e279]: I'm not a chef. I'm a home cook. I create authentic food and lifestyle content from my kitchens in Greece and the United States. I love discovering new recipes, testing everyday kitchen products, and showing people what actually works in a real home kitchen. My food isn't styled for perfection. Sometimes I cook in my pajamas. Sometimes my recipes fail and I share those too. Because that's real life. What matters most to me is creating content that feels natural, relatable and trustworthy, not like an advertisement. Real meals, real kitchens, real ingredients, real me
          - blockquote [ref=f1e280]: No fuss, no pretension — just bold flavours and honest ingredients.
          - link "Let's collaborate" [ref=f1e282] [cursor=pointer]:
            - /url: "#contact"
        - img "Placeholder artwork for the about portrait of Effie Kazantzidis — replace via the CMS." [ref=f1e284]
    - region [ref=f1e285]:
      - generic [ref=f1e286]:
        - generic [ref=f1e287]:
          - heading "Analytics 60 days!" [level=2] [ref=f1e288]
          - paragraph [ref=f1e289]:
            - text: 5.8M
            - generic [ref=f1e290]: Views
          - paragraph [ref=f1e291]: Real performance numbers from my content.
        - generic [ref=f1e292]:
          - generic [ref=f1e293]:
            - generic [ref=f1e296]: 266.4K
            - generic [ref=f1e297]: Likes
            - paragraph [ref=f1e298]: Total likes on all content
          - generic [ref=f1e299]:
            - generic [ref=f1e303]: "42.4"
            - generic [ref=f1e304]: Shares
            - paragraph [ref=f1e305]: Total content shares
          - generic [ref=f1e306]:
            - generic [ref=f1e310]: 22.2K
            - generic [ref=f1e311]: Followers
            - paragraph [ref=f1e312]: Total community across platforms
          - generic [ref=f1e313]:
            - generic [ref=f1e316]: 5.40%
            - generic [ref=f1e317]: Engagement by views
            - paragraph [ref=f1e318]: Engagement rate relative to views
          - generic [ref=f1e319]:
            - generic [ref=f1e322]: 1,423.64%
            - generic [ref=f1e323]: Engagement by followers
            - paragraph [ref=f1e324]: Engagement rate relative to followers
        - paragraph [ref=f1e325]: Data reflects 60-day period across all platforms.
    - region [ref=f1e326]:
      - generic [ref=f1e327]:
        - heading "LET'S WORK TOGETHER" [level=2] [ref=f1e328]
        - paragraph [ref=f1e329]: Available for brand partnerships, recipe development and UGC campaigns.
        - link "effaki7@gmail.com" [ref=f1e330] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
        - generic [ref=f1e331]:
          - heading "Ways to reach me" [level=3] [ref=f1e332]
          - list [ref=f1e333]:
            - listitem [ref=f1e334]:
              - generic [ref=f1e337]: "Phone:"
              - link "+484-340-8784" [ref=f1e338] [cursor=pointer]:
                - /url: tel:+4843408784
            - listitem [ref=f1e339]:
              - generic [ref=f1e342]: "Phone:"
              - link "+306977208612" [ref=f1e343] [cursor=pointer]:
                - /url: tel:+306977208612
        - generic [ref=f1e344]:
          - heading "Follow along" [level=3] [ref=f1e345]
          - list [ref=f1e346]:
            - listitem [ref=f1e347]:
              - link "TikTok" [ref=f1e348] [cursor=pointer]:
                - /url: https://www.tiktok.com/@efiamerikana
            - listitem [ref=f1e351]:
              - link "Instagram" [ref=f1e352] [cursor=pointer]:
                - /url: https://www.instagram.com/efi.amerikana
        - link "Get in touch" [ref=f1e355] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
  - contentinfo [ref=f1e358]:
    - paragraph [ref=f1e360]: © 2026 EFIAMERIKANA · All rights reserved.
```

# Test source

```ts
  289 |     await expect
  290 |       .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
  291 |       .toBe(false);
  292 |     expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(true);
  293 |   });
  294 | 
  295 |   test('unmute toggles audio state without stopping playback', async ({ page }) => {
  296 |     const card = page.locator('[data-video-card]:not([inert])').first();
  297 |     const video = card.locator('video[data-video]');
  298 |     await card.scrollIntoViewIfNeeded();
  299 |     // The controller autoplays the most-covered cards — no click needed.
  300 |     await expect
  301 |       .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
  302 |       .toBe(false);
  303 | 
  304 |     await card.locator('[data-mute-toggle]').click();
  305 |     expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(false);
  306 |     await card.locator('[data-mute-toggle]').click();
  307 |     expect(await video.evaluate((v) => (v as HTMLVideoElement).muted)).toBe(true);
  308 |   });
  309 | 
  310 |   test('unmuting one video mutes the rest — the audio feed is exclusive', async ({ page }) => {
  311 |     test.skip(
  312 |       test.info().project.name === 'mobile-chromium',
  313 |       'the decoder budget is 1 on phones — no second stream to duel with',
  314 |     );
  315 |     const cards = page.locator('[data-video-card]:not([inert])');
  316 |     const videos = cards.locator('video[data-video]');
  317 | 
  318 |     // Desktop budget is 2: scrolling the first card into view plays the two
  319 |     // most-visible cards simultaneously, both muted.
  320 |     await cards.first().scrollIntoViewIfNeeded();
  321 |     await expect
  322 |       .poll(() => videos.nth(0).evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
  323 |       .toBe(false);
  324 |     await expect
  325 |       .poll(() => videos.nth(1).evaluate((v) => (v as HTMLVideoElement).paused), { timeout: 8_000 })
  326 |       .toBe(false);
  327 | 
  328 |     // Unmute card 0 → card 1 goes silent but KEEPS PLAYING: only the audio
  329 |     // channel is exclusive, not the decoder.
  330 |     await cards.nth(0).locator('[data-mute-toggle]').click();
  331 |     await expect
  332 |       .poll(() => videos.nth(0).evaluate((v) => (v as HTMLVideoElement).muted))
  333 |       .toBe(false);
  334 |     await expect
  335 |       .poll(() => videos.nth(1).evaluate((v) => (v as HTMLVideoElement).muted))
  336 |       .toBe(true);
  337 |     await expect
  338 |       .poll(() => videos.nth(1).evaluate((v) => (v as HTMLVideoElement).paused))
  339 |       .toBe(false);
  340 |     // The soloed card's controls reflect reality for the next visitor gesture.
  341 |     await expect(cards.nth(1)).toHaveAttribute('data-muted', 'true');
  342 | 
  343 |     // Re-muting card 0 does not resurrect card 1's audio — silence is the
  344 |     // honest state; bringing sound back is a deliberate act, never an echo.
  345 |     await cards.nth(0).locator('[data-mute-toggle]').click();
  346 |     await expect
  347 |       .poll(() => videos.nth(1).evaluate((v) => (v as HTMLVideoElement).muted))
  348 |       .toBe(true);
  349 |   });
  350 | 
  351 |   test('metadata is always visible and the + toggle is gone', async ({ page }) => {
  352 |     const card = page.locator('[data-video-card]:not([inert])').first();
  353 |     await card.scrollIntoViewIfNeeded();
  354 |     const overlay = card.locator('.media-overlay-gradient');
  355 |     await expect(overlay).toBeVisible();
  356 |     await expect(overlay.locator('h3')).toHaveText(/.+/);
  357 |     // Title, description and transcript ship in the SSR — nothing to click.
  358 |     await expect(card.locator('[data-details-toggle]')).toHaveCount(0);
  359 |   });
  360 | 
  361 |   test('mouse hover plays a non-winner card, leaving pauses it; clicks are inert', async ({
  362 |     page,
  363 |   }) => {
  364 |     test.skip(test.info().project.name === 'mobile-chromium', 'hover is a pointer-device control');
  365 |     await page.setViewportSize({ width: 1280, height: 945 });
  366 |     await page.goto('/en/');
  367 |     const section = page.locator('#videos');
  368 |     await section.scrollIntoViewIfNeeded();
  369 |     // At xl all four cards are fully visible; the controller autoplays the
  370 |     // top two — the last card is a non-winner, so the pointer owns it.
  371 |     const laggard = page.locator('[data-video-card]:not([inert])').nth(3);
  372 |     const paused = () =>
  373 |       laggard.locator('video[data-video]').evaluate((v) => (v as HTMLVideoElement).paused);
  374 |     await expect.poll(paused).toBe(true);
  375 | 
  376 |     // A pointer click (event.detail >= 1) is deliberately inert.
  377 |     await laggard.evaluate((el) => {
  378 |       el.querySelector('[data-play-toggle]')?.dispatchEvent(
  379 |         new MouseEvent('click', { detail: 1, bubbles: true }),
  380 |       );
  381 |     });
  382 |     await expect.poll(paused).toBe(true);
  383 | 
  384 |     // Hover plays it (muted state untouched — audio stays as the visitor
  385 |     // left it), and leaving pauses it again: the card is not a winner.
  386 |     await laggard.hover();
  387 |     await expect.poll(paused, { timeout: 5_000 }).toBe(false);
  388 |     await page.mouse.move(10, 10);
> 389 |     await expect.poll(paused).toBe(true);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  390 |   });
  391 | });
  392 | 
```
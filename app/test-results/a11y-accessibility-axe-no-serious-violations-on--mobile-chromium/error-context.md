# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> accessibility (axe) >> no serious violations on /
- Location: tests/e2e/a11y.spec.ts:6:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "color-contrast: #hero-heading",
+ ]
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
        - paragraph [ref=e44]: Videos
        - heading "Selected works" [level=2] [ref=e45]
        - paragraph [ref=e46]: Portrait cuts from the kitchen archives — TikToks, Reels and Shorts with the textures of real ingredients.
      - list "Videos, horizontally scrollable" [ref=e49]:
        - listitem [ref=e50]:
          - generic "Down Town" [ref=e51]
          - button "Play video — Down Town" [ref=e52] [cursor=pointer]
          - button "Unmute" [ref=e53]
          - button "Show video details" [ref=e58]
          - generic:
            - heading "Down Town" [level=3]
        - listitem [ref=e60]:
          - generic "Lipstick" [ref=e61]
          - button "Play video — Lipstick" [ref=e62] [cursor=pointer]
          - button "Unmute" [ref=e63]
          - button "Show video details" [ref=e68]
          - generic:
            - heading "Lipstick" [level=3]
        - listitem [ref=e70]:
          - generic "Dunkin" [ref=e71]
          - button "Play video — Dunkin" [ref=e72] [cursor=pointer]
          - button "Unmute" [ref=e73]
          - button "Show video details" [ref=e78]
          - generic:
            - heading "Dunkin" [level=3]
    - region [ref=e80]:
      - generic [ref=e83]:
        - paragraph [ref=e84]: Pictures
        - heading "The gallery" [level=2] [ref=e85]
        - paragraph [ref=e86]: Stills from the kitchen and the road — select a photo for the story behind it.
      - list "Pictures, horizontally scrollable" [ref=e89]:
        - listitem [ref=e90]:
          - img "Argo" [ref=e91]
          - generic:
            - heading "Argo" [level=3]
        - listitem [ref=e92]:
          - img "dawn" [ref=e93]
          - generic:
            - heading "dawn" [level=3]
        - listitem [ref=e94]:
          - img "dought" [ref=e95]
          - generic:
            - heading "dought" [level=3]
        - listitem [ref=e96]:
          - img "products" [ref=e97]
          - generic:
            - heading "products" [level=3]
        - listitem [ref=e98]:
          - img "salad" [ref=e99]
          - generic:
            - heading "salad" [level=3]
    - region [ref=e100]:
      - generic [ref=e101]:
        - generic [ref=e102]:
          - generic [ref=e104]:
            - paragraph [ref=e105]: About
            - heading "Authenticity is the main ingredient." [level=2] [ref=e106]
          - paragraph [ref=e108]: I'm not a chef. I'm a home cook. I create authentic food and lifestyle content from my kitchens in Greece and the United States. I love discovering new recipes, testing everyday kitchen products, and showing people what actually works in a real home kitchen. My food isn't styled for perfection. Sometimes I cook in my pajamas. Sometimes my recipes fail and I share those too. Because that's real life. What matters most to me is creating content that feels natural, relatable and trustworthy, not like an advertisement. Real meals, real kitchens, real ingredients, real me
          - blockquote [ref=e109]: No fuss, no pretension — just bold flavours and honest ingredients.
          - link "Let's collaborate" [ref=e111] [cursor=pointer]:
            - /url: "#contact"
        - img "Placeholder artwork for the about portrait of Effie Kazantzidis — replace via the CMS." [ref=e113]
    - region [ref=e114]:
      - generic [ref=e115]:
        - generic [ref=e116]:
          - generic [ref=e117]: Analytics
          - heading "Analytics 60 days!" [level=2] [ref=e118]
          - paragraph [ref=e119]:
            - text: 5.8M
            - generic [ref=e120]: Views
          - paragraph [ref=e121]: Real performance numbers from my content.
        - generic [ref=e122]:
          - generic [ref=e123]:
            - generic [ref=e126]: 266.4K
            - generic [ref=e127]: Likes
            - paragraph [ref=e128]: Total likes on all content
          - generic [ref=e129]:
            - generic [ref=e133]: "42.4"
            - generic [ref=e134]: Shares
            - paragraph [ref=e135]: Total content shares
          - generic [ref=e136]:
            - generic [ref=e140]: 22.2K
            - generic [ref=e141]: Followers
            - paragraph [ref=e142]: Total community across platforms
          - generic [ref=e143]:
            - generic [ref=e146]: 5.40%
            - generic [ref=e147]: Engagement by views
            - paragraph [ref=e148]: Engagement rate relative to views
          - generic [ref=e149]:
            - generic [ref=e152]: 1,423.64%
            - generic [ref=e153]: Engagement by followers
            - paragraph [ref=e154]: Engagement rate relative to followers
        - paragraph [ref=e155]: Data reflects 60-day period across all platforms.
    - region [ref=e156]:
      - generic [ref=e157]:
        - paragraph [ref=e158]: Contact
        - heading "LET'S WORK TOGETHER" [level=2] [ref=e159]
        - paragraph [ref=e160]: Available for brand partnerships, recipe development and UGC campaigns.
        - link "effaki7@gmail.com" [ref=e161] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
        - generic [ref=e162]:
          - heading "Ways to reach me" [level=3] [ref=e163]
          - list [ref=e164]:
            - listitem [ref=e165]:
              - generic [ref=e168]: "Phone:"
              - link "+484-340-8784" [ref=e169] [cursor=pointer]:
                - /url: tel:+4843408784
            - listitem [ref=e170]:
              - generic [ref=e173]: "Phone:"
              - link "+306977208612" [ref=e174] [cursor=pointer]:
                - /url: tel:+306977208612
        - generic [ref=e175]:
          - heading "Follow along" [level=3] [ref=e176]
          - list [ref=e177]:
            - listitem [ref=e178]:
              - link "TikTok" [ref=e179] [cursor=pointer]:
                - /url: https://www.tiktok.com/@efiamerikana
            - listitem [ref=e182]:
              - link "Instagram" [ref=e183] [cursor=pointer]:
                - /url: https://www.instagram.com/efi.amerikana
        - link "Get in touch" [ref=e186] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
  - contentinfo [ref=e189]:
    - generic [ref=e190]:
      - paragraph [ref=e191]: © 2026 EFIAMERIKANA · All rights reserved.
      - link "How to use this landing page" [ref=e192] [cursor=pointer]:
        - /url: /en/how-to-use
```

# Test source

```ts
  1  | import AxeBuilder from '@axe-core/playwright';
  2  | import { expect, test } from '@playwright/test';
  3  | 
  4  | test.describe('accessibility (axe)', () => {
  5  |   for (const path of ['/', '/el/', '/en/how-to-use', '/el/how-to-use']) {
  6  |     test(`no serious violations on ${path}`, async ({ page }) => {
  7  |       await page.goto(path === '/' ? '/en/' : path);
  8  |       const results = await new AxeBuilder({ page })
  9  |         .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  10 |         .analyze();
  11 | 
  12 |       const serious = results.violations.filter((violation) =>
  13 |         ['serious', 'critical'].includes(violation.impact ?? ''),
  14 |       );
  15 |       expect(
  16 |         serious.map(
  17 |           (v) =>
  18 |             `${v.id}: ${v.nodes
  19 |               .map((n) => n.target.join(' '))
  20 |               .slice(0, 3)
  21 |               .join(', ')}`,
  22 |         ),
> 23 |       ).toEqual([]);
     |         ^ Error: expect(received).toEqual(expected) // deep equality
  24 |     });
  25 |   }
  26 | 
  27 |   test('keyboard: skip link is the first focusable element', async ({ page }) => {
  28 |     await page.goto('/en/');
  29 |     await page.keyboard.press('Tab');
  30 |     await expect(page.locator('a[href="#main"]')).toBeFocused();
  31 |   });
  32 | 
  33 |   test('headings follow a single h1 → h2 → h3 order', async ({ page }) => {
  34 |     await page.goto('/en/');
  35 |     const levels = await page.evaluate(() =>
  36 |       Array.from(document.querySelectorAll('h1, h2, h3')).map((h) => Number(h.tagName[1])),
  37 |     );
  38 |     // No level jumps of more than 1
  39 |     for (let i = 1; i < levels.length; i++) {
  40 |       expect(levels[i]! - levels[i - 1]!).toBeLessThan(2);
  41 |     }
  42 |     expect(levels[0]).toBe(1);
  43 |   });
  44 | });
  45 | 
```
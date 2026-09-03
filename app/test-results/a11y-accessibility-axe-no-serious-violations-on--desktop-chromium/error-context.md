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
        - paragraph [ref=e58]: Videos
        - heading "Selected works" [level=2] [ref=e59]
        - paragraph [ref=e60]: Portrait cuts from the kitchen archives — TikToks, Reels and Shorts with the textures of real ingredients.
      - generic [ref=e62]:
        - button "Scroll videos back" [ref=e63]
        - button "Scroll videos forward" [ref=e66]
        - list "Videos, horizontally scrollable" [ref=e69]:
          - listitem [ref=e70]:
            - generic "Down Town" [ref=e71]
            - button "Play video — Down Town" [ref=e72] [cursor=pointer]
            - button "Unmute" [ref=e73]
            - button "Show video details" [ref=e78]
            - generic:
              - heading "Down Town" [level=3]
          - listitem [ref=e80]:
            - generic "Lipstick" [ref=e81]
            - button "Play video — Lipstick" [ref=e82] [cursor=pointer]
            - button "Unmute" [ref=e83]
            - button "Show video details" [ref=e88]
            - generic:
              - heading "Lipstick" [level=3]
          - listitem [ref=e90]:
            - generic "Dunkin" [ref=e91]
            - button "Play video — Dunkin" [ref=e92] [cursor=pointer]
            - button "Unmute" [ref=e93]
            - button "Show video details" [ref=e98]
            - generic:
              - heading "Dunkin" [level=3]
    - region [ref=e100]:
      - generic [ref=e103]:
        - paragraph [ref=e104]: Pictures
        - heading "The gallery" [level=2] [ref=e105]
        - paragraph [ref=e106]: Stills from the kitchen and the road — select a photo for the story behind it.
      - generic [ref=e108]:
        - button "Scroll pictures back" [ref=e109]
        - button "Scroll pictures forward" [ref=e112]
        - list "Pictures, horizontally scrollable" [ref=e115]:
          - listitem [ref=e116]:
            - img "Argo" [ref=e117]
            - generic:
              - heading "Argo" [level=3]
          - listitem [ref=e118]:
            - img "dawn" [ref=e119]
            - generic:
              - heading "dawn" [level=3]
          - listitem [ref=e120]:
            - img "dought" [ref=e121]
            - generic:
              - heading "dought" [level=3]
          - listitem [ref=e122]:
            - img "products" [ref=e123]
            - generic:
              - heading "products" [level=3]
          - listitem [ref=e124]:
            - img "salad" [ref=e125]
            - generic:
              - heading "salad" [level=3]
    - region [ref=e126]:
      - generic [ref=e127]:
        - generic [ref=e128]:
          - generic [ref=e130]:
            - paragraph [ref=e131]: About
            - heading "Authenticity is the main ingredient." [level=2] [ref=e132]
          - paragraph [ref=e134]: I'm not a chef. I'm a home cook. I create authentic food and lifestyle content from my kitchens in Greece and the United States. I love discovering new recipes, testing everyday kitchen products, and showing people what actually works in a real home kitchen. My food isn't styled for perfection. Sometimes I cook in my pajamas. Sometimes my recipes fail and I share those too. Because that's real life. What matters most to me is creating content that feels natural, relatable and trustworthy, not like an advertisement. Real meals, real kitchens, real ingredients, real me
          - blockquote [ref=e135]: No fuss, no pretension — just bold flavours and honest ingredients.
          - link "Let's collaborate" [ref=e137] [cursor=pointer]:
            - /url: "#contact"
        - img "Placeholder artwork for the about portrait of Effie Kazantzidis — replace via the CMS." [ref=e139]
    - region [ref=e140]:
      - generic [ref=e141]:
        - generic [ref=e142]:
          - generic [ref=e143]: Analytics
          - heading "Analytics 60 days!" [level=2] [ref=e144]
          - paragraph [ref=e145]:
            - text: 5.8M
            - generic [ref=e146]: Views
          - paragraph [ref=e147]: Real performance numbers from my content.
        - generic [ref=e148]:
          - generic [ref=e149]:
            - generic [ref=e152]: 266.4K
            - generic [ref=e153]: Likes
            - paragraph [ref=e154]: Total likes on all content
          - generic [ref=e155]:
            - generic [ref=e159]: "42.4"
            - generic [ref=e160]: Shares
            - paragraph [ref=e161]: Total content shares
          - generic [ref=e162]:
            - generic [ref=e166]: 22.2K
            - generic [ref=e167]: Followers
            - paragraph [ref=e168]: Total community across platforms
          - generic [ref=e169]:
            - generic [ref=e172]: 5.40%
            - generic [ref=e173]: Engagement by views
            - paragraph [ref=e174]: Engagement rate relative to views
          - generic [ref=e175]:
            - generic [ref=e178]: 1,423.64%
            - generic [ref=e179]: Engagement by followers
            - paragraph [ref=e180]: Engagement rate relative to followers
        - paragraph [ref=e181]: Data reflects 60-day period across all platforms.
    - region [ref=e182]:
      - generic [ref=e183]:
        - paragraph [ref=e184]: Contact
        - heading "LET'S WORK TOGETHER" [level=2] [ref=e185]
        - paragraph [ref=e186]: Available for brand partnerships, recipe development and UGC campaigns.
        - link "effaki7@gmail.com" [ref=e187] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
        - generic [ref=e188]:
          - heading "Ways to reach me" [level=3] [ref=e189]
          - list [ref=e190]:
            - listitem [ref=e191]:
              - generic [ref=e194]: "Phone:"
              - link "+484-340-8784" [ref=e195] [cursor=pointer]:
                - /url: tel:+4843408784
            - listitem [ref=e196]:
              - generic [ref=e199]: "Phone:"
              - link "+306977208612" [ref=e200] [cursor=pointer]:
                - /url: tel:+306977208612
        - generic [ref=e201]:
          - heading "Follow along" [level=3] [ref=e202]
          - list [ref=e203]:
            - listitem [ref=e204]:
              - link "TikTok" [ref=e205] [cursor=pointer]:
                - /url: https://www.tiktok.com/@efiamerikana
            - listitem [ref=e208]:
              - link "Instagram" [ref=e209] [cursor=pointer]:
                - /url: https://www.instagram.com/efi.amerikana
        - link "Get in touch" [ref=e212] [cursor=pointer]:
          - /url: mailto:effaki7@gmail.com
  - contentinfo [ref=e215]:
    - generic [ref=e216]:
      - paragraph [ref=e217]: © 2026 EFIAMERIKANA · All rights reserved.
      - link "How to use this landing page" [ref=e218] [cursor=pointer]:
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
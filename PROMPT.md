# Master Prompt: Modular Astro Landing Page with CMS
 
You are a senior Astro architect, UI engineer, accessibility specialist, and CMS integrator. Create a production-ready, bilingual landing page and a simple but fully functional content-management workflow.
 
## 1. Core objective
 
Build a modular landing page using the latest stable Astro release and current official Astro recommendations available at implementation time. Use TypeScript in strict mode and Tailwind CSS through the currently recommended Astro/Tailwind integration. Do not use deprecated integrations or APIs. Before coding, verify package compatibility and briefly document the selected versions and architecture.
 
The result must be a complete, runnable repository, not pseudocode or isolated snippets. It must pass build, type checking, linting, and the functional acceptance checks below.
 
## 2. Required sections
 
Create these independently reusable sections in this order:
 
1. Hero
2. Video
3. Pictures
4. About
5. Analytics
6. Contact
7. Footer
 
Each section must be a separate Astro component with typed props and CMS-managed content. Use a data-driven section registry so sections can be reordered, enabled, or disabled without rewriting the page.
 
## 3. Visual direction
 
- Use Tailwind CSS for styling.
- Each section must have a distinct background color while maintaining a cohesive, accessible palette.
- Hero background: `#ffde59`.
- Pictures background: `#ff1fa9`.
- Analytics background: `#000000`, with accessible light foreground colors.
- Select complementary colors for Video, About, and Contact that blend well with the required palette.
- Use rounded corners for all images and video cards unless a component explicitly opts out.
- Use strong typography, generous spacing, subtle motion, and a modern editorial layout.
- Avoid excessive visual effects, unnecessary gradients, and layout shifts.
- Respect `prefers-reduced-motion`.
- Ensure WCAG 2.2 AA color contrast, visible focus states, keyboard navigation, and semantic landmarks.
 
## 4. Responsive behavior
 
The site must work cleanly on:
 
- Small mobile phones
- Large mobile phones
- Tablets in portrait and landscape
- Laptops
- 1080p desktops
- 1440p and 2K displays
- 4K displays
 
Use a mobile-first fluid layout rather than device-specific hard-coded dimensions. Use responsive breakpoints, `clamp()` where appropriate, sensible maximum content widths, responsive typography, and optimized image sizing. Prevent horizontal page overflow at all supported widths.
 
## 5. Navigation and language support
 
Create a sticky or fixed responsive navigation bar with:
 
- Links to all enabled sections
- An email icon that remains visible at every viewport size
- A language switcher displayed as `EN | ΕΛ`
- A mobile menu with accessible open/close behavior, focus management, Escape-key support, and correct ARIA attributes
- Active-section indication when practical
 
Implement English and Greek localization using Astro's built-in i18n routing and locale-aware URLs. Keep all editable copy independently manageable for both languages. Use `lang="en"` and `lang="el"` correctly. Greek is left-to-right. Include locale-aware metadata, canonical URLs, and alternate `hreflang` links.
 
## 6. Hero section
 
The Hero section must support CMS editing of:
 
- Eyebrow text
- Heading
- Supporting text
- Primary and secondary calls to action
- Hero image or artwork
- Image alternative text
- Alignment or layout variant when practical
 
Use the required `#ffde59` background. Ensure the primary call to action remains prominent on mobile and desktop.
 
## 7. Video section
 
This section displays portrait-oriented short-form videos commonly used for TikTok or Instagram.
 
Requirements:
 
- CMS-selectable layout mode: fixed responsive grid or horizontal scroll row
- Grid target: 3 columns by 2 rows on suitable desktop widths, adapting responsibly on smaller screens
- Scroll mode: one horizontal row with scroll snapping and keyboard-accessible controls
- Stable portrait media frame, preferably `aspect-ratio: 9 / 16`
- The placeholder and media card must not resize when playback begins
- Inline playback using `playsinline`
- Playback can start by click/tap; hover preview may be added only for pointer-capable devices and must not be the sole control
- Never autoplay audio
- Include visible controls or an accessible custom play button
- Pause videos that leave the viewport when practical
- Lazy-load video metadata/posters and avoid loading all video files upfront
- Provide poster image, title, short description, transcript/caption field, and accessible label
 
CMS operations:
 
- Add video
- Upload or select video
- Upload or select poster image
- Edit video
- Delete video
- Reorder videos
- Update title, description, alt/accessibility text, and metadata
- Select grid or scroll layout
 
## 8. Pictures section
 
Requirements:
 
- CMS-selectable layout mode: fixed responsive grid or horizontal scroll row
- Desktop grid target: 3 columns by 2 rows when enough content exists
- Stable card dimensions with an appropriate fixed aspect ratio
- Images appear black and white by default
- On hover or keyboard focus, transition to full color
- On touch devices, images remain understandable without depending on hover
- Use Astro's image optimization for local assets and supply width, height, `srcset`, `sizes`, lazy loading, and descriptive alt text
 
CMS operations:
 
- Add image
- Upload or select image
- Edit image
- Delete image
- Reorder images
- Update title, short description, alt text, and metadata
- Select grid or scroll layout
 
Use the required `#ff1fa9` section background while preserving readable contrast.
 
## 9. About section
 
Support CMS editing of:
 
- Section heading
- Rich text or structured paragraphs
- Featured image
- Image alt text
- Optional call to action
 
The image and text order should adapt cleanly between mobile and desktop.
 
## 10. Analytics section
 
Create a visually clear analytics or impact section on `#000000`.
 
Support CMS operations to add, edit, delete, and reorder metric items. Each metric contains:
 
- Value
- Label
- Optional supporting description
- Optional icon identifier
 
Do not fabricate business data. Seed clearly labeled placeholder content that is easy to replace. Use semantic text rather than inaccessible chart screenshots. If animated counters are used, preserve the final value for assistive technologies and respect reduced-motion preferences.
 
## 11. Contact section
 
Create an accessible contact section with editable:
 
- Heading
- Introductory text
- Email address
- Optional phone number
- Location or availability text
- Social links
- Call-to-action label
 
Support add, edit, and delete operations for contact methods and supporting text. If a form is included, use server-side validation, bot protection strategy, explicit success/error states, and a provider-neutral adapter. Do not expose secrets in client-side code.
 
## 12. Footer
 
Keep the footer intentionally simple. Include only:
 
- Copyright notice using the current year
- “All rights reserved”
- A “How to use this landing page” link
 
Create a small localized usage/help page for that link.
 
## 13. CMS architecture
 
Use Decap CMS as the default simple Git-based CMS unless the execution environment requires another solution. If another CMS is selected, explain why and preserve every capability in this specification.
 
For Decap CMS:
 
- Create a working `/admin/` interface.
- Include `public/admin/index.html` and a complete `public/admin/config.yml`.
- Keep content in typed YAML, JSON, Markdown, or MDX files committed to the repository.
- Store uploaded media in a predictable repository directory.
- Configure bilingual fields for English and Greek.
- Configure nested and list fields for videos, pictures, metrics, contact methods, navigation, and section settings.
- Support create, edit, delete, reorder, publish, and media upload workflows.
- Use an environment-appropriate backend configuration and document local development plus production authentication setup.
- Do not commit credentials, tokens, or secrets.
- Explain that production editorial access requires configuring the selected Git provider and authentication flow.
 
Validate CMS content with Astro Content Collections and Zod. Render safe structured content. Avoid raw unsanitized HTML.
 
## 14. Recommended project structure
 
Use a clear structure similar to:
 
```text
src/
  components/
    layout/
    navigation/
    sections/
    media/
    ui/
  content/
  data/
  i18n/
  layouts/
  pages/
    [lang]/
  styles/
  utils/
public/
  admin/
  media/
tests/
```
 
Adjust the structure only when there is a documented architectural reason.
 
## 15. Performance, SEO, and engineering quality
 
- Prefer Astro components and zero client JavaScript by default.
- Use islands only where interaction is required, such as navigation, video controls, or CMS preview integration.
- Select the lightest suitable client directive.
- Use semantic HTML and structured heading order.
- Add page title, meta description, Open Graph tags, social preview metadata, canonical links, sitemap, robots configuration, and localized alternates.
- Add JSON-LD only when the content supports a valid schema type.
- Optimize fonts and avoid render-blocking third-party resources.
- Use Astro image optimization and prevent cumulative layout shift.
- Lazy-load below-the-fold media.
- Establish a reasonable Content Security Policy and security headers, documented for the chosen deployment target.
- Avoid unnecessary dependencies.
- Run accessibility checks and target strong Lighthouse performance without treating a score as a substitute for testing.
 
## 16. Testing and quality gates
 
Add:
 
- Unit tests for data transformation and locale helpers
- Component or integration tests for critical rendering where practical
- Playwright end-to-end tests for primary navigation, language switching, mobile menu, video interaction, and CMS-managed content rendering
- Automated accessibility checks using an appropriate current tool
- Formatting, linting, TypeScript, Astro check, tests, and production build scripts
 
The implementation is not complete until these commands succeed using the package manager selected by the project:
 
```text
install
format/check
lint
astro check or equivalent type check
test
build
```
 
## 17. Deliverables
 
Return the work in this order:
 
1. Architecture summary and key decisions
2. Exact project tree
3. Complete contents of every required file, with no omitted sections and no “same as above” placeholders
4. CMS model and editorial workflow explanation
5. Local development instructions
6. Production deployment and CMS authentication instructions
7. Test instructions
8. Acceptance checklist showing pass/fail status
9. Known limitations and recommended next steps
 
If the response size is limited, generate the repository as downloadable files or continue in clearly numbered parts. Never omit required files silently.
 
## 18. Acceptance criteria
 
The solution is accepted only if:
 
- All seven sections render and can be enabled, disabled, and reordered.
- English and Greek routes work and the `EN | ΕΛ` selector preserves the equivalent page where possible.
- The email icon is always visible.
- Navigation works with keyboard, touch, and pointer input.
- The Hero, Pictures, and Analytics section colors match exactly.
- Video and Pictures can switch between grid and horizontal-scroll layouts through the CMS.
- Video cards remain dimensionally stable during playback.
- Pictures transition from black and white to color on hover/focus.
- CMS users can add, edit, delete, reorder, and update all specified content and media.
- The site has no horizontal overflow at 320px, 375px, 768px, 1024px, 1920px, 2560px, and 3840px widths.
- The production build, tests, type checks, and accessibility checks pass.
- No secrets or fabricated production data are included.


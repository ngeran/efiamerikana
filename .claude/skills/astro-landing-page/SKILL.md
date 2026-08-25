---
name: astro-landing-page
description: Design, generate, review, or improve modular, responsive, bilingual Astro landing pages with Tailwind CSS, typed CMS content, media galleries, short-form video, accessibility, SEO, performance, and production quality gates. Use when a user asks for an Astro marketing site, portfolio landing page, section-based website, or reusable landing-page architecture.
---

# Astro Landing Page Skill

## Purpose

Create production-ready Astro landing pages that are modular, content-managed, responsive, accessible, localized, fast, and maintainable. Treat the task as architecture plus implementation, not as a visual mockup.

## Trigger conditions

Use this skill when the user requests one or more of the following:

- An Astro landing page or marketing site
- A modular section-based Astro website
- Tailwind styling for an Astro landing page
- A lightweight CMS for Astro
- Bilingual or multilingual Astro content
- Video, image, portfolio, analytics, about, or contact sections
- A review or modernization of an existing Astro landing-page repository

Do not use this skill for a non-Astro framework unless the user asks to migrate it to Astro.

## Required workflow

### 1. Normalize requirements

Extract and preserve:

- Required sections and their order
- Exact colors and brand constraints
- Languages and locale codes
- CMS editing operations
- Media behavior and aspect ratios
- Navigation and footer requirements
- Deployment environment, if supplied
- Accessibility, SEO, performance, and testing expectations

Do not discard unusual requirements. Resolve minor ambiguity with a documented, reversible default. Ask a clarification only when implementation would otherwise be unsafe or materially incompatible.

### 2. Verify the current ecosystem

Before implementation, check current official documentation for:

- Latest stable Astro setup
- Recommended Tailwind integration
- Astro content collections and Content Layer APIs
- Astro i18n routing
- Selected adapter and deployment target
- CMS compatibility

Never use deprecated packages or APIs merely because they appeared in older examples.

### 3. Choose the smallest viable architecture

Default choices:

- Astro with strict TypeScript
- Tailwind CSS using the currently recommended integration
- Astro components for static UI
- Client islands only for genuinely interactive behavior
- Astro Content Collections plus Zod for validating CMS-managed content
- Decap CMS for a simple Git-based editorial UI
- English and Greek routes using Astro i18n when those languages are requested

If the project requires authenticated database editing, real-time collaboration, complex workflow, or nontechnical media management at scale, select a hosted headless CMS instead and explain the tradeoff.

### 4. Build a modular section system

Create:

- One component per section
- Typed section props
- A section registry or renderer
- CMS fields for ordering, enabling, and disabling sections
- Shared primitives for headings, buttons, media cards, containers, and accessible controls

Never place the entire landing page in one oversized component.

### 5. Implement responsive behavior

Use mobile-first fluid layouts. Test at minimum:

- 320px
- 375px
- 768px
- 1024px
- 1440px
- 1920px
- 2560px
- 3840px

Use `clamp()`, responsive grids, logical sizing, stable aspect ratios, and maximum content widths. Prevent horizontal page overflow. Do not scale an entire desktop canvas down for mobile.

### 6. Implement media correctly

For images:

- Use Astro image optimization for local assets
- Provide intrinsic dimensions, responsive sources, sizes, lazy loading, and meaningful alt text
- Reserve layout space to avoid cumulative layout shift
- Use rounded corners when requested
- Make hover-only effects accessible by adding focus behavior and touch-safe presentation

For short-form video:

- Prefer a stable `9 / 16` frame
- Use `playsinline`
- Do not autoplay audio
- Provide an accessible click/tap control
- Allow hover preview only as an enhancement on hover-capable devices
- Lazy-load posters and media metadata
- Keep the card size unchanged when playback starts
- Pause offscreen media when practical
- Include title, description, poster, and transcript/caption metadata

### 7. Implement CMS editing

The CMS model must map directly to rendered types. Support user-requested add, edit, delete, reorder, upload, metadata, localization, layout selection, and publishing operations.

For Decap CMS, provide:

- `/public/admin/index.html`
- `/public/admin/config.yml`
- Media paths
- Git backend placeholder/configuration
- Local development instructions
- Production authentication instructions
- Bilingual fields
- Nested list widgets for repeated content

Never commit credentials. Clearly distinguish a locally functional CMS from production authentication, which requires provider configuration.

### 8. Accessibility and localization

Require:

- Semantic landmarks and heading order
- Keyboard operation
- Visible focus indicators
- Correct ARIA only where native HTML is insufficient
- Escape behavior and focus management for mobile navigation
- WCAG 2.2 AA contrast
- Reduced-motion support
- Locale-aware URLs, `lang`, metadata, canonical URLs, and `hreflang`
- Independent editable content for each language

### 9. Performance and SEO

Prefer zero JavaScript by default. Add islands only where needed and choose the lightest client directive. Include optimized media, lazy loading, font strategy, canonical tags, Open Graph data, sitemap, robots handling, and valid structured data only when justified.

Document security headers and Content Security Policy for the deployment target. Never expose server secrets in client code.

### 10. Test before completion

Run and verify:

- Formatter check
- Linter
- Astro/TypeScript check
- Unit tests
- End-to-end tests
- Accessibility checks
- Production build

Test navigation, language switching, mobile menu, CMS content rendering, media layout switching, video playback controls, focus states, and overflow at target widths.

Perform a secondary consistency check after tools complete:

- Confirm exact colors
- Confirm all requested sections exist
- Confirm CMS fields match component schemas
- Confirm translation keys exist in both languages
- Confirm no broken media paths
- Confirm no secrets
- Confirm generated instructions match the selected package manager and deployment target

## Output contract

Deliver:

1. Architecture summary
2. Project tree
3. Complete implementation files or a downloadable repository
4. CMS schema and workflow
5. Local setup
6. Production deployment/authentication setup
7. Test commands and results
8. Acceptance checklist
9. Known limitations

Do not claim a check passed unless it was executed successfully. Label unexecuted checks as pending.

## Quality defaults

- Clear component names
- Strict TypeScript
- Minimal dependencies
- Data-driven content
- No duplicated section markup
- No raw unsanitized CMS HTML
- No fabricated business metrics
- No inaccessible hover-only interaction
- No fixed desktop-only widths
- No placeholder secrets

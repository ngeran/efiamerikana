import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Content model — one collection per CMS-managed thing.
 *
 * Singleton sections live in `src/content/sections/<name>.<locale>.json`
 * (Decap i18n `multiple_files`). Repeated content (videos, pictures) lives
 * in `src/content/<collection>/<locale>/<slug>.md` (Decap i18n
 * `multiple_folders`). Entry ids are the file path relative to the loader
 * base without extension, so a locale is always derivable:
 *
 *   `settings.en` · `hero.el` · `en/lemon-potatoes` · `el/xoriatiki`
 */

/** Stable, locale-independent id from a loader entry (keeps dots and slashes). */
function relativeId({ entry, base }: { entry: string; base: string | URL }): string {
  const basePath = typeof base === 'string' ? base : base.pathname;
  const rel = entry.startsWith(basePath) ? entry.slice(basePath.length) : entry;
  return rel.replace(/^\//, '').replace(/\.(md|json)$/, '');
}

export const sectionIds = [
  'hero',
  'videos',
  'pictures',
  'about',
  'analytics',
  'contact',
  'footer',
] as const;
export type SectionId = (typeof sectionIds)[number];

export const layoutModes = ['grid', 'scroll'] as const;
export type LayoutMode = (typeof layoutModes)[number];

const mediaRef = z
  .string()
  .min(1)
  .describe('Path of a file in the CMS media library (src/assets/media)');

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const metricIconSchema = z.enum(['heart', 'users', 'star', 'globe', 'play', 'chart', 'sparkle']);

const socialIconSchema = z.enum(['tiktok', 'instagram', 'facebook', 'youtube', 'x']);

const methodIconSchema = z.enum(['email', 'phone', 'location', 'link']);

/* ---------------------------------------------------------------- */
/* Schemas                                                           */
/* ---------------------------------------------------------------- */

const settingsSchema = z.object({
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
  sections: z
    .array(
      z.object({
        id: z.enum(sectionIds),
        enabled: z.boolean().default(true),
        navLabel: z.string().min(1),
      }),
    )
    .min(1),
});

const heroSchema = z.object({
  eyebrow: z.string().nullish(),
  heading: z.string().min(1),
  /** Italic accent line rendered as a second heading line. */
  headingAccent: z.string().nullish(),
  /** Uppercase category line, e.g. "Food • Lifestyle • UGC Content". */
  tagline: z.string().nullish(),
  supporting: z.string().min(1),
  image: mediaRef,
  imageAlt: z.string().min(1),
  variant: z.enum(['split', 'center']).default('split'),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.nullish(),
});

const videoSectionSchema = z.object({
  heading: z.string().min(1),
  intro: z.string().nullish(),
  layout: z.enum(layoutModes).default('grid'),
});

const videoSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  order: z.number().int().default(100),
  language: z.enum(['en', 'el']).default('en'),
  video: mediaRef,
  poster: mediaRef.nullish(),
  posterAlt: z.string().nullish(),
  transcript: z.string().nullish(),
  tag: z.string().nullish(),
  draft: z.boolean().default(false),
});

const pictureSectionSchema = z.object({
  heading: z.string().min(1),
  intro: z.string().nullish(),
  layout: z.enum(layoutModes).default('grid'),
  /**
   * Show the visible "+" toggle on each card. When false the metadata still
   * reveals on hover/focus and the whole card becomes the toggle, so touch and
   * keyboard users keep a way in. Defaults true so an entry that omits the key
   * renders exactly as before.
   */
  showDetailsButton: z.boolean().default(false),
  /**
   * Enable hover preview of metadata. When false, metadata only shows when
   * explicitly toggled via the button/interaction. Defaults false for cleaner
   * visual experience.
   */
  enableHoverPreview: z.boolean().default(false),
  /**
   * Enable click-to-reveal metadata. When false, clicking/tapping on the card
   * does nothing and metadata remains hidden. When true, clicking reveals the
   * metadata overlay. Defaults false.
   */
  enableClickToReveal: z.boolean().default(false),
});

const pictureSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  order: z.number().int().default(100),
  language: z.enum(['en', 'el']).default('en'),
  image: mediaRef,
  imageAlt: z.string().nullish(),
  tag: z.string().nullish(),
  draft: z.boolean().default(false),
});

const aboutSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  pullQuote: z.string().nullish(),
  image: mediaRef,
  imageAlt: z.string().min(1),
  cta: ctaSchema.nullish(),
});

const analyticsSchema = z.object({
  heading: z.string().min(1),
  intro: z.string().nullish(),
  footnote: z.string().nullish(),
  metrics: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
        description: z.string().nullish(),
        icon: metricIconSchema.nullish(),
      }),
    )
    .min(1),
  /**
   * The one number worth setting in type larger than everything else. Omit it
   * and the section promotes metrics[0] instead, so an entry that never sets
   * this still gets a headline figure.
   */
  headline: z
    .object({
      value: z.string().min(1),
      label: z.string().min(1),
    })
    .nullish(),
  /** Free text beside the headline, e.g. "+14.2% vs previous period". */
  trend: z.string().nullish(),
  /**
   * `percent` drives a bar width, so it is clamped here rather than trusted:
   * a CMS typo of 850 would otherwise render a bar overflowing its track.
   */
  ratios: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
        percent: z.number().min(0).max(100),
      }),
    )
    .nullish(),
  /** Decorative sparkline, one 0–100 value per bar. Clamped for the same reason. */
  velocity: z.array(z.number().min(0).max(100)).nullish(),
});

const contactSchema = z.object({
  heading: z.string().min(1),
  intro: z.string().min(1),
  ctaLabel: z.string().min(1),
  methods: z
    .array(
      z.object({
        icon: methodIconSchema,
        label: z.string().min(1),
        value: z.string().min(1),
        href: z.string().nullish(),
      }),
    )
    .min(1),
  socials: z.array(
    z.object({
      icon: socialIconSchema,
      label: z.string().min(1),
      href: z.url(),
    }),
  ),
});

const footerSchema = z.object({
  howToUseLabel: z.string().min(1),
  note: z.string().nullish(),
});

/* ---------------------------------------------------------------- */
/* Collections - Simplified with manual language selection              */
/* ---------------------------------------------------------------- */

const sectionsBase = 'src/content/sections';

const singleton = (pattern: string, schema: z.ZodTypeAny) =>
  defineCollection({
    loader: glob({ pattern, base: sectionsBase, generateId: relativeId }),
    schema,
  });

export const collections = {
  settings: singleton('settings.*.json', settingsSchema),
  hero: singleton('hero.*.json', heroSchema),
  videoSection: singleton('video-section.*.json', videoSectionSchema),
  pictureSection: singleton('picture-section.*.json', pictureSectionSchema),
  about: singleton('about.*.json', aboutSchema),
  analytics: singleton('analytics.*.json', analyticsSchema),
  contact: singleton('contact.*.json', contactSchema),
  footer: singleton('footer.*.json', footerSchema),
  videos: defineCollection({
    loader: glob({ pattern: '**/*.md', base: 'src/content/videos', generateId: relativeId }),
    schema: videoSchema,
  }),
  pictures: defineCollection({
    loader: glob({ pattern: '**/*.md', base: 'src/content/pictures', generateId: relativeId }),
    schema: pictureSchema,
  }),
};

export type HeroData = z.infer<typeof heroSchema>;
export type VideoSectionData = z.infer<typeof videoSectionSchema>;
export type VideoData = z.infer<typeof videoSchema>;
export type PictureSectionData = z.infer<typeof pictureSectionSchema>;
export type PictureData = z.infer<typeof pictureSchema>;
export type AboutData = z.infer<typeof aboutSchema>;
export type AnalyticsData = z.infer<typeof analyticsSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type FooterData = z.infer<typeof footerSchema>;
export type SettingsData = z.infer<typeof settingsSchema>;
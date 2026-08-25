import { defineCollection, z } from 'astro:content';
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
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
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
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().default(100),
  video: mediaRef,
  poster: mediaRef,
  posterAlt: z.string().min(1),
  transcript: z.string().nullish(),
  tag: z.string().nullish(),
  draft: z.boolean().default(false),
});

const pictureSectionSchema = z.object({
  heading: z.string().min(1),
  intro: z.string().nullish(),
  layout: z.enum(layoutModes).default('grid'),
});

const pictureSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  order: z.number().int().default(100),
  image: mediaRef,
  imageAlt: z.string().min(1),
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
      href: z.string().url(),
    }),
  ),
});

const footerSchema = z.object({
  howToUseLabel: z.string().min(1),
  note: z.string().nullish(),
});

/* ---------------------------------------------------------------- */
/* Collections                                                       */
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

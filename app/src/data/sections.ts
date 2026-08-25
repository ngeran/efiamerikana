import type { SectionId } from '../content.config';
import Hero from '../components/sections/Hero.astro';
import VideoSection from '../components/sections/VideoSection.astro';
import PicturesSection from '../components/sections/PicturesSection.astro';
import AboutSection from '../components/sections/AboutSection.astro';
import AnalyticsSection from '../components/sections/AnalyticsSection.astro';
import ContactSection from '../components/sections/ContactSection.astro';

/**
 * Data-driven section registry. Every main section shares the same props
 * interface ({ locale, label }) and fetches its own CMS content, so the
 * page just maps over the (reorderable, toggleable) settings list.
 * The footer is rendered separately outside <main>.
 */
export const sectionComponents = {
  hero: Hero,
  videos: VideoSection,
  pictures: PicturesSection,
  about: AboutSection,
  analytics: AnalyticsSection,
  contact: ContactSection,
} as const;

export type MainSectionId = Exclude<SectionId, 'footer'>;

export function isMainSection(id: SectionId): id is MainSectionId {
  return id in sectionComponents;
}

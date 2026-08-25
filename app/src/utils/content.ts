import { getCollection, getEntry } from 'astro:content';
import { defaultLocale, type Locale } from '../i18n/config';
import { byLocale, ordered, published } from './entries';
import type {
  AboutData,
  AnalyticsData,
  ContactData,
  FooterData,
  HeroData,
  PictureData,
  PictureSectionData,
  SettingsData,
  VideoData,
  VideoSectionData,
} from '../content.config';

/**
 * Server-side content access. Singleton sections fall back to the default
 * locale when a translation is missing; repeated collections fall back
 * wholesale (a half-translated collection shows content, never gaps).
 */

type SingletonCollection =
  | 'settings'
  | 'hero'
  | 'videoSection'
  | 'pictureSection'
  | 'about'
  | 'analytics'
  | 'contact'
  | 'footer';

async function singleton<T>(
  collection: SingletonCollection,
  name: string,
  locale: Locale,
): Promise<T> {
  const entry =
    (await getEntry(collection, `${name}.${locale}`)) ??
    (await getEntry(collection, `${name}.${defaultLocale}`));
  if (!entry) {
    throw new Error(
      `[content] missing "${collection}" entry "${name}" for locale "${locale}" ` +
        `(and "${defaultLocale}" fallback) — check src/content/sections/.`,
    );
  }
  return entry.data as T;
}

export const getSettings = (locale: Locale) =>
  singleton<SettingsData>('settings', 'settings', locale);

export const getHero = (locale: Locale) => singleton<HeroData>('hero', 'hero', locale);

export const getVideoSection = (locale: Locale) =>
  singleton<VideoSectionData>('videoSection', 'video-section', locale);

export const getPictureSection = (locale: Locale) =>
  singleton<PictureSectionData>('pictureSection', 'picture-section', locale);

export const getAbout = (locale: Locale) => singleton<AboutData>('about', 'about', locale);

export const getAnalytics = (locale: Locale) =>
  singleton<AnalyticsData>('analytics', 'analytics', locale);

export const getContact = (locale: Locale) => singleton<ContactData>('contact', 'contact', locale);

export const getFooter = (locale: Locale) => singleton<FooterData>('footer', 'footer', locale);

export async function getVideos(locale: Locale): Promise<VideoData[]> {
  return ordered(published(byLocale(await getCollection('videos'), locale))).map(
    (entry) => entry.data,
  );
}

export async function getPictures(locale: Locale): Promise<PictureData[]> {
  return ordered(published(byLocale(await getCollection('pictures'), locale))).map(
    (entry) => entry.data,
  );
}

/** Nav items for enabled sections (footer renders no nav link). */
export function navItemsFrom(settings: SettingsData) {
  return settings.sections
    .filter((s) => s.enabled && s.id !== 'footer')
    .map((s) => ({ id: s.id, label: s.navLabel }));
}

/** Contact email used by the always-visible header icon. */
export function contactEmail(contact: ContactData): string {
  return contact.methods.find((m) => m.icon === 'email')?.value ?? 'hello@example.com';
}

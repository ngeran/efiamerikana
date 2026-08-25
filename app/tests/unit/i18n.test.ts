import { describe, expect, it } from 'vitest';
import {
  localize,
  localeAlternates,
  localeOfPath,
  normalizePath,
  stripLocale,
  switchLocale,
} from '../../src/i18n/utils';
import { defaultLocale, isLocale, localeSwitcherLabel, locales } from '../../src/i18n/config';
import { entryLocale } from '../../src/utils/entries';

describe('normalizePath', () => {
  it('normalizes slashes on all edges', () => {
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('en')).toBe('/en');
    expect(normalizePath('/en/')).toBe('/en');
    expect(normalizePath('/en/how-to-use/')).toBe('/en/how-to-use');
    expect(normalizePath('//el//x//')).toBe('/el/x');
  });
});

describe('localeOfPath', () => {
  it('detects the locale segment', () => {
    expect(localeOfPath('/en')).toBe('en');
    expect(localeOfPath('/el/how-to-use')).toBe('el');
    expect(localeOfPath('/')).toBe(defaultLocale);
  });

  it('returns null for non-localized roots', () => {
    expect(localeOfPath('/blog')).toBeNull();
    expect(localeOfPath('/fr/foo')).toBeNull();
  });
});

describe('stripLocale', () => {
  it('removes any locale prefix', () => {
    expect(stripLocale('/en')).toBe('/');
    expect(stripLocale('/en/how-to-use')).toBe('/how-to-use');
    expect(stripLocale('/el/how-to-use')).toBe('/how-to-use');
    expect(stripLocale('/how-to-use')).toBe('/how-to-use');
  });
});

describe('localize', () => {
  it('prefixes idempotently', () => {
    expect(localize('/', 'en')).toBe('/en');
    expect(localize('/how-to-use', 'el')).toBe('/el/how-to-use');
    expect(localize('/en/how-to-use', 'el')).toBe('/el/how-to-use');
    expect(localize('/el/how-to-use', 'el')).toBe('/el/how-to-use');
  });
});

describe('switchLocale', () => {
  it('preserves the equivalent page', () => {
    expect(switchLocale('/en', 'el')).toBe('/el');
    expect(switchLocale('/en/how-to-use', 'el')).toBe('/el/how-to-use');
    expect(switchLocale('/el/how-to-use', 'en')).toBe('/en/how-to-use');
  });
});

describe('localeAlternates', () => {
  it('lists every locale', () => {
    const alts = localeAlternates('/how-to-use');
    expect(alts.map((a) => a.locale)).toEqual(locales);
    expect(alts.map((a) => a.path)).toEqual(['/en/how-to-use', '/el/how-to-use']);
  });
});

describe('locale config', () => {
  it('switcher labels render as EN | ΕΛ', () => {
    expect(locales.map(localeSwitcherLabel).join(' | ')).toBe('EN | ΕΛ');
  });

  it('validates locales', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('el')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe('entryLocale (content ids)', () => {
  it('reads folder-collection ids', () => {
    expect(entryLocale('en/lemon-potatoes')).toBe('en');
    expect(entryLocale('el/πατάτες-λεμόνου')).toBe('el');
  });

  it('reads singleton file ids', () => {
    expect(entryLocale('hero.en')).toBe('en');
    expect(entryLocale('settings.el')).toBe('el');
  });

  it('returns null when no locale is encoded', () => {
    expect(entryLocale('hero')).toBeNull();
    expect(entryLocale('fr/x')).toBeNull();
  });
});

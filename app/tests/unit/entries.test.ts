import { describe, expect, it } from 'vitest';
import { byLocale, ordered, published } from '../../src/utils/entries';

const entry = (
  id: string,
  order?: number,
  draft = false,
): { id: string; data: { order?: number; draft: boolean; title: string } } => ({
  id,
  data: { order, draft, title: id },
});

describe('byLocale', () => {
  const entries = [entry('en/a'), entry('en/b'), entry('el/a'), entry('el/b'), entry('el/c')];

  it('filters to the requested locale', () => {
    expect(byLocale(entries, 'el').map((e) => e.id)).toEqual(['el/a', 'el/b', 'el/c']);
    expect(byLocale(entries, 'en').map((e) => e.id)).toEqual(['en/a', 'en/b']);
  });

  it('falls back to the default locale only when the locale is empty', () => {
    const onlyEn = [entry('en/a'), entry('en/b')];
    expect(byLocale(onlyEn, 'el').map((e) => e.id)).toEqual(['en/a', 'en/b']);
  });

  it('returns nothing when neither locale has entries', () => {
    expect(byLocale([], 'el')).toEqual([]);
  });
});

describe('published', () => {
  it('excludes drafts', () => {
    const entries = [entry('en/a', 1), entry('en/b', 2, true)];
    expect(published(entries).map((e) => e.id)).toEqual(['en/a']);
  });
});

describe('ordered', () => {
  it('sorts by order with a stable id tie-break', () => {
    const entries = [
      entry('en/c', 2),
      entry('en/a', 1),
      entry('en/d'),
      entry('en/b', 1),
      entry('en/e'),
    ];
    expect(ordered(entries).map((e) => e.id)).toEqual(['en/a', 'en/b', 'en/c', 'en/d', 'en/e']);
  });

  it('does not mutate the input', () => {
    const entries = [entry('en/b', 2), entry('en/a', 1)];
    ordered(entries);
    expect(entries.map((e) => e.id)).toEqual(['en/b', 'en/a']);
  });
});

import { describe, expect, it } from 'vitest';
import { ui } from '../../src/i18n/ui';
import { locales } from '../../src/i18n/config';

/** Structural (key) parity — the type system checks this at compile time,
 *  this guards against runtime drift after edits. */
function keysOf(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }
  return Object.entries(value).flatMap(([key, nested]) =>
    keysOf(nested, prefix ? `${prefix}.${key}` : key),
  );
}

describe('UI dictionary', () => {
  it('covers every locale', () => {
    expect(Object.keys(ui).sort()).toEqual([...locales].sort());
  });

  it('keeps identical key shapes in EN and EL', () => {
    expect(keysOf(ui.el)).toEqual(keysOf(ui.en));
  });

  it('has no empty strings', () => {
    const flatten = (value: unknown): string[] =>
      typeof value === 'string' ? [value] : Object.values(value ?? {}).flatMap(flatten);
    for (const locale of locales) {
      for (const text of flatten(ui[locale])) {
        expect(text.trim().length, `empty string in ${locale}`).toBeGreaterThan(0);
      }
    }
  });
});

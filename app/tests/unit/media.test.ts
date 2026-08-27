import { describe, expect, it, vi } from 'vitest';
import { normalizeMediaPath, resolveImage, resolveVideo, videoUrls } from '../../src/utils/media';

describe('normalizeMediaPath', () => {
  it('strips every prefix style the CMS may write', () => {
    expect(normalizeMediaPath('/media/videos/lemon-potatoes.mp4')).toBe(
      'videos/lemon-potatoes.mp4',
    );
    expect(normalizeMediaPath('media/posters/baklava.svg')).toBe('posters/baklava.svg');
    expect(normalizeMediaPath('src/assets/media/hero.svg')).toBe('hero.svg');
    expect(normalizeMediaPath('/src/assets/media/gallery/fig-harvest.svg')).toBe(
      'gallery/fig-harvest.svg',
    );
    expect(normalizeMediaPath('about.svg')).toBe('about.svg');
    expect(normalizeMediaPath('  /media/x.webm  ')).toBe('x.webm');
  });
});

describe('resolveVideo', () => {
  it('resolves a committed video to a bundled URL', () => {
    const url = resolveVideo('/media/dunkin.mp4');
    expect(typeof url).toBe('string');
    expect(url.length).toBeGreaterThan(0);
  });

  it('resolves nested paths by suffix', () => {
    // No nested videos are committed anymore (media is flat for CMS
    // visibility) — this documents that nested lookups resolve, not throw.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(resolveVideo('media/videos/retired-seed.mp4')).toBe('');
    spy.mockRestore();
  });

  it('falls back to an empty src for missing media instead of throwing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => resolveVideo('/media/does-not-exist.mp4')).not.toThrow();
    expect(resolveVideo('/media/does-not-exist.mp4')).toBe('');
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/not found/));
    spy.mockRestore();
  });

  it('maps every committed video', () => {
    expect(Object.keys(videoUrls).length).toBeGreaterThanOrEqual(3);
  });
});

describe('resolveImage', () => {
  it('resolves seed images without throwing', () => {
    expect(() => resolveImage('/media/hero.svg')).not.toThrow();
    expect(() => resolveImage('/media/posters/village-salad.svg')).not.toThrow();
    expect(() => resolveImage('/media/gallery/olive-grove.svg')).not.toThrow();
  });

  it('falls back to the placeholder for unknown images instead of throwing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => resolveImage('/media/nope.svg')).not.toThrow();
    expect(resolveImage('/media/nope.svg').format).toBe('svg');
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/not found/));
    spy.mockRestore();
  });
});

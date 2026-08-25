import { describe, expect, it } from 'vitest';
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
  it('resolves a seed video to a bundled URL', () => {
    const url = resolveVideo('/media/videos/lemon-potatoes.mp4');
    expect(typeof url).toBe('string');
    expect(url.length).toBeGreaterThan(0);
  });

  it('resolves nested paths by suffix', () => {
    const url = resolveVideo('media/videos/tsoureki.mp4');
    expect(typeof url).toBe('string');
  });

  it('throws a helpful error for missing media', () => {
    expect(() => resolveVideo('/media/videos/does-not-exist.mp4')).toThrowError(/not found/);
  });

  it('maps every committed seed video', () => {
    expect(Object.keys(videoUrls).length).toBeGreaterThanOrEqual(6);
  });
});

describe('resolveImage', () => {
  it('resolves seed images without throwing', () => {
    expect(() => resolveImage('/media/hero.svg')).not.toThrow();
    expect(() => resolveImage('/media/posters/village-salad.svg')).not.toThrow();
    expect(() => resolveImage('/media/gallery/olive-grove.svg')).not.toThrow();
  });

  it('throws for unknown images', () => {
    expect(() => resolveImage('/media/nope.svg')).toThrowError(/not found/);
  });
});

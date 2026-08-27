import { describe, expect, it, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import SiteFooter from '../../src/components/sections/SiteFooter.astro';
import VideoCard from '../../src/components/media/VideoCard.astro';
import type { FooterData, VideoData } from '../../src/content.config';

describe('<SiteFooter>', () => {
  const data: FooterData = {
    howToUseLabel: 'How to use this landing page',
    note: null,
  };

  it('renders copyright with the current year, rights and help link', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SiteFooter, {
      props: { data, locale: 'en' },
    });

    expect(html).toContain(`© ${new Date().getFullYear()} EFIAMERIKANA`);
    expect(html).toContain('All rights reserved.');
    expect(html).toContain('How to use this landing page');
    expect(html).toContain('href="/en/how-to-use"');
  });

  it('localizes the Greek footer', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SiteFooter, {
      props: {
        data: { howToUseLabel: 'Πώς να χρησιμοποιήσετε αυτή τη σελίδα', note: null },
        locale: 'el',
      },
    });
    expect(html).toContain('Με επιφύλαξη παντός δικαιώματος.');
    expect(html).toContain('href="/el/how-to-use"');
  });
});

describe('<VideoCard>', () => {
  const video: VideoData = {
    title: 'Lemon Potatoes',
    description: 'Crispy, glossy, aggressively lemony.',
    order: 1,
    video: '/media/videos/lemon-potatoes.mp4',
    poster: '/media/posters/lemon-potatoes.svg',
    posterAlt: 'Placeholder poster: lemon potatoes.',
    transcript: 'Placeholder transcript.',
    tag: 'Sides',
    draft: false,
  };

  it('renders a stable 9/16 frame with lazy playback attributes', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(VideoCard, {
      props: {
        video,
        locale: 'en',
        cardId: 'test-0',
        class: 'aspect-[9/16] w-full',
      },
    });

    expect(html).toContain('aspect-[9/16]');
    expect(html).toContain('preload="none"');
    expect(html).toContain('playsinline');
    expect(html).toContain('muted');
    expect(html).toContain('loop');
    expect(html).toContain('Lemon Potatoes');
    expect(html).toContain('Placeholder transcript.');
    expect(html).toContain('data-details-toggle');
    expect(html).toContain('aria-expanded="false"');
  });

  it('renders poster-only when the video file is missing', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const container = await AstroContainer.create();
    const html = await container.renderToString(VideoCard, {
      props: {
        video: { ...video, video: '/media/videos/never-uploaded.mp4' },
        locale: 'en',
        cardId: 'missing-0',
        class: 'aspect-[9/16] w-full',
      },
    });

    expect(html).not.toContain('src="/src/assets/media/videos/never-uploaded.mp4"');
    expect(html).toContain('poster=');
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/not found/));
    spy.mockRestore();
  });
});

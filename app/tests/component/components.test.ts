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
    language: 'en',
    orientation: 'portrait',
    // A REAL bundled asset — with dead controls now hidden on missing
    // files, a nonexistent video would change what the card renders.
    video: '/media/dunkin.mp4',
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
    expect(html).toContain('preload="metadata"');
    expect(html).toContain('width="576"');
    expect(html).toContain('playsinline');
    expect(html).toContain('muted');
    expect(html).toContain('loop');
    expect(html).toContain('Lemon Potatoes');
    expect(html).toContain('Placeholder transcript.');
    expect(html).toContain('data-details-toggle');
    expect(html).toContain('aria-expanded="false"');
  });

  it('passes loop-clone attributes through to the card root', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(VideoCard, {
      props: {
        video,
        locale: 'en',
        cardId: 'clone-0',
        class: 'aspect-[9/16] w-full',
        // What the section renders for the non-middle copies of the loop:
        'aria-hidden': 'true',
        inert: true,
      } as never,
    });

    expect(html).toContain('aria-hidden="true"');
    // Boolean attribute: renders bare (`inert`) or as inert="inert".
    expect(html).toMatch(/inert(\s|=")/);
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
    // The video element itself keeps no poster attribute — but a CMS poster
    // can exist even when the upload failed, so the lazy overlay stays.
    expect(html).not.toContain('poster=');
    expect(html).toContain('data-video-poster');
    // Dead controls are hidden: nothing to play, nothing to unmute.
    expect(html).not.toContain('data-play-toggle');
    expect(html).not.toContain('data-mute-toggle');
    expect(spy).toHaveBeenCalledWith(expect.stringMatching(/not found/));
    spy.mockRestore();
  });

  it('renders the poster as a lazy overlay, not a video poster attribute', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(VideoCard, {
      props: {
        video,
        locale: 'en',
        cardId: 'test-poster',
        class: 'aspect-[9/16] w-full',
      },
    });

    expect(html).toContain('data-video-poster');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    // Chromium fetches <video poster> eagerly at render time, viewport
    // notwithstanding — the attribute must stay gone now that the lazy
    // overlay carries the image.
    expect(html).not.toMatch(/<video[^>]*poster=/);
  });

  it('renders loop clones poster-only: full chrome, no media element', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(VideoCard, {
      props: {
        video,
        locale: 'en',
        cardId: 'clone-7',
        class: 'aspect-[9/16] w-full',
        posterOnly: true,
        // What the section renders for the non-middle loop copies.
        'aria-hidden': 'true',
        inert: true,
      } as never,
    });

    // No <video>, no deferred source: clones hold zero media bytes and no
    // decoder slot at any point in the loop.
    expect(html).not.toContain('<video');
    expect(html).not.toContain('data-src');
    // Visual parity with the middle copy while the rail crosses a seam.
    expect(html).toContain('data-video-poster');
    expect(html).toContain('data-play-toggle');
    expect(html).toContain('data-details-toggle');
  });
});

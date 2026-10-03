/**
 * Shared plumbing for the Decap OAuth bridge (Cloudflare Pages Functions).
 *
 * The bridge lets /admin/ authenticate against GitHub in production:
 * /auth redirects to GitHub, GitHub returns to /callback, /callback swaps
 * the code for a token and posts it back to the CMS window. Requires two
 * Pages environment variables (Settings → Environment variables):
 *
 *   DECAP_GITHUB_CLIENT_ID      from a GitHub OAuth App
 *   DECAP_GITHUB_CLIENT_SECRET  (keep secret; never sent to the browser)
 *
 * The OAuth App's Authorization callback URL must be
 *   https://<site-origin>/callback
 */

/** The two env vars, as Pages provides them (undefined when unset). */
export interface OAuthEnv {
  DECAP_GITHUB_CLIENT_ID?: string;
  DECAP_GITHUB_CLIENT_SECRET?: string;
}

/** Minimal shape of the Pages Function context we use. */
export interface FnContext {
  request: Request;
  env: OAuthEnv;
}

export const STATE_COOKIE = 'decap-oauth-state';

/** Read the state cookie from a request's Cookie header, if present. */
export function readStateCookie(request: Request): string | null {
  const cookie = request.headers.get('Cookie') ?? '';
  return new RegExp(`(?:^|;\\s*)${STATE_COOKIE}=([^;]+)`).exec(cookie)?.[1] ?? null;
}

/** A tiny standalone HTML page (the bridge has no shared shell). */
export function html(body: string, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>efiamerikana · CMS login</title>` +
      `<meta name="robots" content="noindex">` +
      `<style>body{font:16px/1.6 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#17130f;color:#f7f2e7}</style></head>` +
      `<body><div style="max-width:36rem;padding:2rem">${body}</div></body></html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        // Standalone document — its own policy; the inline login scripts are
        // the page's whole purpose.
        'Content-Security-Policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'",
        ...extraHeaders,
      },
    },
  );
}

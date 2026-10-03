/**
 * Decap OAuth bridge — step 1: GET /auth
 *
 * Redirects the CMS login popup to GitHub's authorize endpoint with a CSRF
 * state that /callback validates via a short-lived cookie. Requires the
 * DECAP_GITHUB_CLIENT_ID Pages environment variable (see _oauth.ts).
 */
import { html, STATE_COOKIE, type FnContext } from './_oauth';

export async function onRequestGet(ctx: FnContext): Promise<Response> {
  const clientId = ctx.env.DECAP_GITHUB_CLIENT_ID;
  if (!clientId) {
    return html(
      '<h1>Bridge not configured</h1><p>The <code>DECAP_GITHUB_CLIENT_ID</code> environment variable is ' +
        'missing. Set it (with <code>DECAP_GITHUB_CLIENT_SECRET</code>) in Cloudflare Pages → Settings → ' +
        'Environment variables, from a GitHub OAuth App whose callback URL is ' +
        '<code>https://&lt;site-origin&gt;/callback</code>, then redeploy.</p>',
      500,
    );
  }

  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${new URL(ctx.request.url).origin}/callback`,
    scope: 'repo,user',
    state,
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params}`,
      'Cache-Control': 'no-store',
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}

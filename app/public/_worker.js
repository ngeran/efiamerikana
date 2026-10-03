/**
 * Cloudflare Pages advanced-mode Worker — REQUIRED for the CMS login.
 *
 * Ships at the root of the build output (public/ → dist/), so it deploys
 * with the site no matter how the deploy happens (`just cf`, git
 * integration, drag-and-drop). Advanced mode takes over ALL routing, which
 * means:
 *   1. /auth + /callback implement the Decap OAuth bridge against GitHub
 *      (a `functions/` directory would ALSO work locally but did not reach
 *      the production deploy — this file cannot be left behind).
 *   2. `_headers` is NOT processed in advanced mode — every security/
 *      caching header the site needs is applied here, per path.
 *   3. Everything that is not /auth or /callback is served from the static
 *      assets (env.ASSETS) with those headers applied.
 *
 * Required Pages environment variables (Settings → Environment variables):
 *   DECAP_GITHUB_CLIENT_ID + DECAP_GITHUB_CLIENT_SECRET
 * from a GitHub OAuth App whose callback URL is
 *   https://<site-origin>/callback
 * (see README "CMS authentication" and public/admin/config.yml → base_url).
 */

const GITHUB_AUTHORIZE = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN = 'https://github.com/login/oauth/access_token';
const STATE_COOKIE = 'decap-oauth-state';

const SECURITY_HEADERS = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Public pages: nothing eval'd, nothing fetched cross-origin.
const PUBLIC_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data:; media-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; " +
  "frame-ancestors 'self'; form-action 'none'; connect-src 'self'";

// The Decap CMS bundle evaluates its own config templates (unsafe-eval) and
// talks to the GitHub content API — both forbidden by the public policy.
const ADMIN_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: https://raw.githubusercontent.com; media-src 'self'; font-src 'self'; " +
  "object-src 'none'; base-uri 'none'; frame-ancestors 'self'; form-action 'none'; " +
  "connect-src 'self' https://api.github.com https://github.com";

/** Standalone page for the bridge's responses (popup context). */
function html(body, status = 200, extraHeaders = {}) {
  return new Response(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
      '<title>efiamerikana · CMS login</title><meta name="robots" content="noindex">' +
      '<style>body{font:16px/1.6 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;' +
      'margin:0;background:#17130f;color:#f7f2e7}div{max-width:36rem;padding:2rem}code{color:#ffde59}</style></head>' +
      `<body><div>${body}</div></body></html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        // Standalone document — its own policy; the inline login scripts are
        // the page's whole purpose.
        'Content-Security-Policy':
          "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'",
        ...extraHeaders,
      },
    },
  );
}

function readStateCookie(request) {
  const cookie = request.headers.get('Cookie') ?? '';
  const match = new RegExp(`(?:^|;\\s*)${STATE_COOKIE}=([^;]+)`).exec(cookie);
  return match ? match[1] : null;
}

/** GET /auth — redirect the CMS popup to GitHub with a CSRF state cookie. */
function handleAuth(request, url, env) {
  const clientId = env.DECAP_GITHUB_CLIENT_ID;
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
    redirect_uri: `${url.origin}/callback`,
    scope: 'repo,user',
    state,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${GITHUB_AUTHORIZE}?${params}`,
      'Cache-Control': 'no-store',
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}

/** GET /callback — validate state, swap the code for a token, post it back. */
async function handleCallback(request, url, env) {
  const clientId = env.DECAP_GITHUB_CLIENT_ID;
  const clientSecret = env.DECAP_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return html(
      '<h1>Bridge not configured</h1><p><code>DECAP_GITHUB_CLIENT_ID</code> and ' +
        '<code>DECAP_GITHUB_CLIENT_SECRET</code> must both be set as Cloudflare Pages environment ' +
        'variables, then the site redeployed.</p>',
      500,
    );
  }
  const clearState = {
    'Set-Cookie': `${STATE_COOKIE}=; Path=/callback; HttpOnly; Secure; Max-Age=0`,
  };

  // The user can deny the request in GitHub's dialog.
  const denied = url.searchParams.get('error');
  if (denied) {
    return html(
      `<h1>Login cancelled</h1><p>GitHub reported: <code>${denied}</code>. Close this window and try again.</p>`,
      400,
      clearState,
    );
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const stateCookie = readStateCookie(request);
  if (!code || !state || !stateCookie || stateCookie !== state) {
    return html(
      '<h1>Invalid login state</h1><p>The OAuth state did not match — the request may have been ' +
        'replayed or the popup lost its cookie. Close this window and start the login again.</p>',
      400,
      clearState,
    );
  }

  const exchange = await fetch(GITHUB_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });
  const payload = await exchange.json();
  if (!payload.access_token) {
    return html(
      `<h1>Token exchange failed</h1><p>GitHub said: <code>${payload.error_description ?? payload.error ?? exchange.status}</code>. ` +
        'Verify the OAuth App callback URL and the client secret environment variable.</p>',
      502,
      clearState,
    );
  }

  // The message shape Decap listens for. JSON-stringified, every '<'
  // escaped so a token can never break out of the inline script.
  const message = JSON.stringify({ token: payload.access_token, provider: 'github' }).replace(
    /</g,
    '\\u003c',
  );
  return html(
    '<h1>Signed in</h1><p>You can close this window.</p><script>' +
      `window.opener && window.opener.postMessage(${JSON.stringify(message)}, ${JSON.stringify(url.origin)});` +
      'setTimeout(function(){ window.close(); }, 250);' +
      '</script>',
    200,
    clearState,
  );
}

/** Static assets with the security/caching headers _headers would give. */
async function serveAsset(request, env) {
  const asset = await env.ASSETS.fetch(request);
  const url = new URL(request.url);
  const response = new Response(asset.body, asset);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(name, value);
  }
  if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
    response.headers.set('Content-Security-Policy', ADMIN_CSP);
  } else if (!url.pathname.startsWith('/_astro/')) {
    response.headers.set('Content-Security-Policy', PUBLIC_CSP);
  }
  if (url.pathname.startsWith('/_astro/')) {
    // Content-hashed build output never changes.
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'GET' && url.pathname === '/auth') {
      return handleAuth(request, url, env);
    }
    if (request.method === 'GET' && url.pathname === '/callback') {
      return handleCallback(request, url, env);
    }
    return serveAsset(request, env);
  },
};

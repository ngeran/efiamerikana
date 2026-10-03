/**
 * Decap OAuth bridge — step 2: GET /callback
 *
 * GitHub returns the authorization code here; we validate the CSRF state
 * against the cookie /auth set, exchange the code for an access token
 * server-side (the client secret never reaches the browser), and post the
 * token to the CMS popup opener in the message shape Decap expects.
 * Requires DECAP_GITHUB_CLIENT_ID + DECAP_GITHUB_CLIENT_SECRET.
 */
import { html, readStateCookie, STATE_COOKIE, type FnContext } from './_oauth';

interface GitHubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

export async function onRequestGet(ctx: FnContext): Promise<Response> {
  const clientId = ctx.env.DECAP_GITHUB_CLIENT_ID;
  const clientSecret = ctx.env.DECAP_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return html(
      '<h1>Bridge not configured</h1><p><code>DECAP_GITHUB_CLIENT_ID</code> and ' +
        '<code>DECAP_GITHUB_CLIENT_SECRET</code> must both be set as Cloudflare Pages ' +
        'environment variables, then the site redeployed.</p>',
      500,
    );
  }

  const url = new URL(ctx.request.url);
  const origin = url.origin;

  // The user can deny the request in GitHub's dialog.
  const denied = url.searchParams.get('error');
  if (denied) {
    return html(
      `<h1>Login cancelled</h1><p>GitHub reported: <code>${denied}</code>. Close this window and try again.</p>`,
      400,
      clearState(),
    );
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const stateCookie = readStateCookie(ctx.request);
  if (!code || !state || !stateCookie || stateCookie !== state) {
    return html(
      '<h1>Invalid login state</h1><p>The OAuth state did not match — the request may have been ' +
        'replayed or the popup lost its cookie. Close this window and start the login again.</p>',
      400,
      clearState(),
    );
  }

  const exchange = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${origin}/callback`,
    }),
  });
  const payload = (await exchange.json()) as GitHubTokenResponse;
  if (!payload.access_token) {
    return html(
      `<h1>Token exchange failed</h1><p>GitHub said: <code>${payload.error_description ?? payload.error ?? exchange.status}</code>. ` +
        'Verify the OAuth App callback URL and the client secret env var.</p>',
      502,
      clearState(),
    );
  }

  // The message shape Decap listens for. JSON-stringified, every '<'
  // escaped so a token can never break out of the inline script.
  const message = JSON.stringify({ token: payload.access_token, provider: 'github' }).replace(
    /</g,
    '\\u003c',
  );
  return html(
    `<h1>Signed in</h1><p>You can close this window.</p><script>` +
      `window.opener && window.opener.postMessage(${JSON.stringify(message)}, ${JSON.stringify(origin)});` +
      `setTimeout(function(){ window.close(); }, 250);` +
      `</script>`,
    200,
    clearState(),
  );
}

function clearState(): Record<string, string> {
  return {
    'Set-Cookie': `${STATE_COOKIE}=; Path=/callback; HttpOnly; Secure; Max-Age=0`,
  };
}

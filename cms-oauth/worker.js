/**
 * GitHub OAuth proxy for Sveltia / Decap CMS (Cloudflare Worker).
 *
 * Implements the Decap OAuth-provider contract so the CMS `github` backend can
 * authenticate without a third-party identity service:
 *   /auth      → redirects the editor to GitHub to authorize
 *   /callback  → exchanges the code for an access token and hands it back to the CMS popup
 *
 * Secrets (set with `wrangler secret put …`, see README.md):
 *   OAUTH_CLIENT_ID       GitHub OAuth App → Client ID
 *   OAUTH_CLIENT_SECRET   GitHub OAuth App → Client Secret
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1) CMS sends the editor here to begin GitHub OAuth.
    if (url.pathname === "/auth") {
      const params = new URLSearchParams({
        client_id: env.OAUTH_CLIENT_ID,
        redirect_uri: `${url.origin}/callback`,
        scope: "repo,user",
        state: crypto.randomUUID(),
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302,
      );
    }

    // 2) GitHub returns here with ?code=…; exchange it for a token.
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing ?code", { status: 400 });

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: env.OAUTH_CLIENT_ID,
          client_secret: env.OAUTH_CLIENT_SECRET,
          code,
        }),
      });
      const data = await tokenRes.json();
      const token = data.access_token;
      if (!token) return new Response("GitHub token exchange failed", { status: 502 });

      // 3) Deliver the token to the CMS (opened as a popup) and close this tab.
      const payload = JSON.stringify({ token, provider: "github" });
      const html = `<!doctype html><html><body>
        <script>
          (function () {
            window.opener.postMessage(
              "authorization:github:success:" + ${JSON.stringify(payload)},
              "*"
            );
            window.close();
          })();
        </script>
      </body></html>`;
      return new Response(html, {
        headers: { "content-type": "text/html;charset=utf-8" },
      });
    }

    return new Response(
      "Sveltia/Decap GitHub OAuth proxy. The CMS calls /auth; there's nothing to see here.",
      { status: 200 },
    );
  },
};

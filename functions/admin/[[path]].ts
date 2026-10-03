/**
 * /admin/* header override — Cloudflare _headers rules can only ADD, and
 * multiple CSP headers intersect (most restrictive wins), so the site-wide
 * strict policy would veto the looser script policy the Decap CMS needs
 * (`unsafe-eval` for its config templates, GitHub API in connect-src).
 *
 * This Function shadows the static /admin/* assets and swaps the CSP on
 * the way out. Everything else on the site keeps the strict _headers CSP
 * untouched.
 */

// The admin shell's policy: like the public one, plus unsafe-eval (Decap
// evaluates its config templates), and GitHub API + raw content access.
const ADMIN_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  "style-src 'self' 'unsafe-inline'; img-src 'self' data: https://raw.githubusercontent.com; " +
  "media-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; " +
  "frame-ancestors 'self'; form-action 'none'; " +
  "connect-src 'self' https://api.github.com https://github.com";

interface AssetsEnv {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export async function onRequestGet(ctx: { request: Request; env: AssetsEnv }): Promise<Response> {
  const asset = await ctx.env.ASSETS.fetch(ctx.request);
  const response = new Response(asset.body, asset);
  response.headers.set('Content-Security-Policy', ADMIN_CSP);
  response.headers.set('X-Admin-Function', '1');
  return response;
}

# CMS GitHub OAuth proxy (Cloudflare Worker)

The CMS (Sveltia/Decap at `/admin/`) authenticates against GitHub, and GitHub
OAuth requires a tiny server to exchange the auth code for a token. This Worker
is that server — it has two routes (`/auth`, `/callback`) and holds no state.

Deploy it **once**; it runs independently of the site (the site just points to
it via `backend.base_url` in `config.yml`).

## 1. Create the GitHub OAuth App

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:

| Field | Value |
|---|---|
| Application name | `Efi Amerikana CMS` |
| Homepage URL | `https://efiamerikana.pages.dev` |
| Authorization callback URL | `https://efiamerikana-cms-oauth.<your-subdomain>.workers.dev/callback` |

> The callback URL must match this Worker's URL + `/callback`. Use your
> Cloudflare subdomain (you'll know it after the first `wrangler deploy`; if it
> changes, update the OAuth App's callback and redeploy).

After creating it, note the **Client ID** and click **Generate a new client
secret** → copy the **Client Secret** (shown once).

## 2. Deploy the Worker

From this directory (`cms-oauth/`), with `wrangler` installed (it's in the
devShell) and logged in (`wrangler login`, or set `CLOUDFLARE_API_TOKEN`):

```bash
wrangler deploy
wrangler secret put OAUTH_CLIENT_ID        # paste the Client ID
wrangler secret put OAUTH_CLIENT_SECRET    # paste the Client Secret
```

Note the deployed URL, e.g. `https://efiamerikana-cms-oauth.<your-subdomain>.workers.dev`.

## 3. Point the CMS at it

Edit `site/static/admin/config.yml`:

```yaml
backend:
  base_url: https://efiamerikana-cms-oauth.<your-subdomain>.workers.dev
  app_id:   <the GitHub OAuth App Client ID>
```

Commit + push. The GitHub Action rebuilds the site, and `/admin/` goes live.

## 4. Use it

Open `https://efiamerikana.pages.dev/admin/` → **Login with GitHub** → authorize.
Edits commit to `main`; the Cloudflare Pages Action rebuilds → live in ~1 min.

## Security

- Only someone who can authorize **your** GitHub OAuth App (i.e. you, and anyone
  you allow at the OAuth App level) can edit — that's your access control.
- The Client Secret lives only in Cloudflare Worker secrets, never in the repo.
- The Worker's only job is the OAuth code-for-token exchange; it stores nothing.

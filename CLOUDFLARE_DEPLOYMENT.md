# Cloudflare Pages Deployment Guide

This guide will walk you through deploying your Astro landing page to Cloudflare Pages and setting up the Decap CMS for content editing.

## Prerequisites

- Cloudflare account (free tier works fine)
- GitHub repository with your Astro project
- Node.js 18+ installed locally
- Wrangler CLI tool

## Step 1: Install and Authenticate Wrangler

First, install the Wrangler CLI globally:

```bash
npm install -g wrangler
```

Then authenticate with Cloudflare:

```bash
wrangler login
```

This will open a browser window where you can authorize Wrangler to access your Cloudflare account.

## Step 2: Create Your Cloudflare Pages Project

Create a new Cloudflare Pages project:

```bash
wrangler pages project create astro-app --production-branch main
```

- `astro-app` is your project name (you can change this)
- `main` is your production branch (matches your git branch)

## Step 3: Build Your Project Locally

Navigate to your project directory and build it:

```bash
cd /home/nikos/github/ngeran/efiamerikana
just cf
```

Or manually:

```bash
cd app
npm install
npm run build
```

The built files will be in the `app/dist/` directory.

## Step 4: Deploy to Cloudflare Pages

From the project root, use the just command:

```bash
just cf
```

This command will:
1. Build the static site with Nix
2. Upload it to your Cloudflare Pages project
3. Deploy it to production

Your site will be available at: `https://astro-app.pages.dev`

## Step 5: Set Up Custom Domain (Optional)

If you want to use your own domain:

1. Go to Cloudflare Dashboard
2. Navigate to Pages > Your Project
3. Click "Custom domains"
4. Add your domain (e.g., `efiamerikana.com`)
5. Follow the DNS setup instructions

## Step 6: Configure Decap CMS Authentication

The Decap CMS requires authentication for production use. You have two options:

### Option A: Netlify Identity + Git Gateway (Simplest)

1. Create a Netlify account
2. Create a new Netlify site (can be empty)
3. Enable Netlify Identity in your site settings
4. Enable Git Gateway
5. Update `app/public/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  repo: ngeran/efiamerikana
  branch: main
```

### Option B: GitHub OAuth App (Recommended for GitHub Users)

1. Create a GitHub OAuth App:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"
   - Set:
     - Application name: `Efiamerikana CMS`
     - Homepage URL: `https://your-domain.com`
     - Authorization callback URL: `https://your-domain.com/admin/`
   - Note your Client ID and generate a Client Secret

2. Update `app/public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: ngeran/efiamerikana
  branch: main
```

3. For local development, keep `local_backend: true` uncommented when running `npm run admin`

## Step 7: Test Your Deployment

1. Visit your site at the Cloudflare Pages URL
2. Navigate to `/admin/` to access the CMS
3. Test the login flow
4. Try editing some content

## Deployment Commands Reference

```bash
# Production deployment
just cf

# Preview deployment (for testing branches)
CF_BRANCH=feature-branch just cf-preview

# Local development
cd app && npm run dev

# Local CMS testing
cd app && npm run admin
# (in another terminal)
npm run dev
# Visit http://localhost:4321/admin/
```

## Troubleshooting

### Build fails

- Ensure you have the latest dependencies: `cd app && npm install`
- Check that all content files are valid
- Run `npm run check` to type-check the project

### CMS won't load

- Ensure `public/admin/index.html` exists
- Check browser console for errors
- Verify backend configuration in `config.yml`

### Can't upload media

- Ensure `src/assets/media` directory exists
- Check file permissions
- Verify media_folder path in config.yml

### Images don't appear

- Images must be in `src/assets/media` (not `public/`)
- Astro's asset pipeline only processes images in this location
- Rebuild and redeploy after adding images

## Security Notes

- Never commit OAuth credentials to git
- Use environment variables for sensitive data
- Keep your dependencies updated
- The included CSP headers are configured for security

## Performance Optimization

Your site is already optimized with:
- Responsive images with automatic srcset generation
- Self-hosted fonts with proper unicode ranges
- Minimal JavaScript (4 small bundles ~6KB total)
- Static site generation for instant loading
- CDN delivery via Cloudflare

## Next Steps

1. Replace placeholder content with real content through the CMS
2. Add real analytics (update analytics section values)
3. Configure your domain and DNS
4. Set up automated backups
5. Monitor site performance with Cloudflare Analytics

## Support

For issues specific to:
- **Astro**: Check [Astro Documentation](https://docs.astro.build)
- **Cloudflare Pages**: Check [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- **Decap CMS**: Check [Decap CMS Documentation](https://decapcms.org/docs)
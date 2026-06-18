# Deployment

This document covers deploying WriteSpace to production using Vercel static hosting.

## Overview

WriteSpace is a fully client-side React single-page application (SPA) with no backend server or database. All data is persisted in the browser's `localStorage`. This makes deployment straightforward — you only need a static file host that supports SPA routing fallback.

## Vercel Deployment

### Prerequisites

- A [Vercel](https://vercel.com) account (free tier is sufficient)
- A Git repository hosted on GitHub, GitLab, or Bitbucket

### Git-Based Deployment (Recommended)

Vercel supports automatic deployments triggered by Git pushes. This is the recommended CI/CD workflow.

1. **Push your repository** to GitHub, GitLab, or Bitbucket.

2. **Import the project** in the [Vercel Dashboard](https://vercel.com/new):
   - Click **"Add New Project"**
   - Select your Git provider and authorize access
   - Choose the `writespace` repository

3. **Configure build settings** — Vercel auto-detects the Vite framework preset. Verify the following settings:

   | Setting           | Value            |
   | ----------------- | ---------------- |
   | Framework Preset  | Vite             |
   | Build Command     | `npm run build`  |
   | Output Directory  | `dist`           |
   | Install Command   | `npm install`    |
   | Node.js Version   | 18.x or later    |

4. **Deploy** — Click the "Deploy" button. Vercel will install dependencies, run the build, and publish the `dist/` directory.

### Automatic Deployments

Once connected, Vercel automatically deploys on every push:

- **Production deployments** are triggered by pushes to the `main` (or `master`) branch.
- **Preview deployments** are triggered by pushes to any other branch or by pull requests. Each preview deployment gets a unique URL for testing.

No additional CI/CD configuration is required. Vercel handles the entire build and deploy pipeline.

### SPA Routing Configuration

WriteSpace uses React Router v6 for client-side routing. All routes (e.g., `/blogs`, `/admin`, `/login`) must resolve to `index.html` so the React router can handle them.

The `vercel.json` file in the project root configures this rewrite rule:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures that:

- Direct navigation to any route (e.g., `https://your-app.vercel.app/blogs/some-id`) serves `index.html`
- Page refreshes on any route work correctly
- The React Router picks up the URL path and renders the appropriate component

**Do not remove or modify `vercel.json`** unless you understand the impact on client-side routing.

## Environment Variables

WriteSpace does **not** require any environment variables. There are no API keys, backend URLs, or secrets to configure.

- No `.env` file is needed for development or production
- No environment variables need to be set in the Vercel dashboard
- All data is stored client-side in `localStorage`

If you extend the application with external API integrations in the future, add environment variables prefixed with `VITE_` (e.g., `VITE_API_URL`) so Vite exposes them to the client bundle via `import.meta.env.VITE_API_URL`.

## Build Details

### Build Command

```bash
npm run build
```

This runs `vite build`, which:

- Bundles all React components and dependencies
- Processes Tailwind CSS and purges unused utility classes
- Generates optimized, minified assets with content hashes
- Outputs everything to the `dist/` directory
- Produces source maps for debugging (`sourcemap: true` in `vite.config.js`)

### Output Structure

After building, the `dist/` directory contains:

```
dist/
├── index.html          # Entry HTML file
├── favicon.ico         # Favicon
└── assets/
    ├── index-[hash].js   # Bundled JavaScript
    └── index-[hash].css  # Compiled Tailwind CSS
```

### Preview Production Build Locally

To verify the production build before deploying:

```bash
npm run build
npm run preview
```

The preview server starts at [http://localhost:4173](http://localhost:4173) by default and serves the `dist/` directory.

## Manual Deployment (Other Platforms)

If you are not using Vercel, you can deploy to any static file hosting service.

### Build

```bash
npm install
npm run build
```

### Serve

Serve the `dist/` directory with any static file server. **You must configure a fallback** so that all routes serve `index.html` for client-side routing to work.

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache (.htaccess)

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Netlify (_redirects)

Create a `_redirects` file in the `dist/` directory (or `public/` so it gets copied):

```
/*    /index.html   200
```

#### GitHub Pages

GitHub Pages does not natively support SPA routing. Use a `404.html` workaround or consider a different hosting provider.

## Troubleshooting

### Blank page after deployment

- Verify the **Output Directory** is set to `dist` in your hosting provider
- Check that the SPA rewrite/fallback rule is configured correctly
- Open the browser developer console for JavaScript errors

### Routes return 404 on refresh

- The SPA routing fallback is not configured. Ensure `vercel.json` is present and contains the rewrite rule, or configure the equivalent on your hosting platform

### Styles missing or broken

- Ensure `postcss.config.js` and `tailwind.config.js` are present in the project root
- Verify that the `content` paths in `tailwind.config.js` match your source file locations
- Run `npm run build` locally and check the output CSS file is not empty

### Build fails

- Ensure Node.js 18+ is installed (`node --version`)
- Delete `node_modules/` and `package-lock.json`, then run `npm install` again
- Check for syntax errors in source files by running `npm run build` locally before pushing
# TASG Defense Website

Static website for **Terminal Applied Solutions Group, LLC** at **tasgdefense.com**.

## Included pages

- `index.html` — company mission, current focus, development pathway, founder credibility, and partner paths
- `snare-1a.html` — public capability profile that describes the mission and maturity without exposing the mechanism
- `about.html` — TASG operating model, founder background, and company standards
- `partner.html` — engagement categories and a browser-only email preparation form
- `privacy.html` — current public website information practices
- `404.html` — custom error page

## Technical improvements

- Responsive desktop and mobile navigation
- Keyboard-accessible menu and skip link
- Reduced-motion support
- Unique metadata and canonical URLs
- Organization structured data on the homepage
- 1200×630 social sharing image
- `robots.txt`, `sitemap.xml`, and web manifest
- Cloudflare Pages-compatible `_headers` security configuration
- Optimized WebP/JPEG brand assets and correctly sized icons
- No analytics, ad trackers, external fonts, packages, build tools, or runtime dependencies

## Local preview

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Deployment

Upload the contents of this folder to the repository root connected to the current hosting deployment. The custom domain remains configured through the hosting/DNS provider; replacing repository files does not by itself transfer or change the domain.

The `_headers` file is used by Cloudflare Pages. GitHub Pages ignores it harmlessly. If the site is hosted directly by GitHub Pages rather than Cloudflare Pages, manage the custom domain through repository settings and DNS.

## Public disclosure boundary

Do not place technical drawings, CAD, internal architecture, calculations, mechanism details, performance targets, materials, component layouts, invention records, partner documents, or sensitive correspondence in this public repository. Use a private repository or controlled data room for those materials.

## Before publishing

Review all public claims for accuracy and have final disclosure language reviewed as part of the company's intellectual-property and legal strategy. The current inquiry form opens the visitor's local email application and does not submit information to a web server.

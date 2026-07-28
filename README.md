# TASG Defense Website v4.3 Cloudflare QA

Static website package prepared for GitHub + Cloudflare Pages deployment.

## Files to deploy at repository root
- index.html
- snare-1a.html
- about.html
- partner.html
- privacy.html
- game.html
- 404.html
- tasg-site-v4.css
- tasg-site-v4.js
- CNAME
- VERSION.txt
- _headers
- _redirects
- robots.txt
- sitemap.xml
- site.webmanifest
- .nojekyll
- assets/

## Deployment notes
- Upload the contents of this folder to the repository root.
- Do not upload an enclosing outer folder.
- Cloudflare Pages production branch should point at the repository root.
- The game leaderboard uses browser localStorage only.
- The partner inquiry form opens the visitor's local email application.

## QA hardening in v4.1
- Browser-storage fallback for the game
- Improved light-section contrast
- Removed ambiguous device silhouette
- Reduced-motion support
- Canonical sitemap cleanup

## Cloudflare-native routing
Internal navigation uses extensionless paths such as `/about`, `/snare-1a`, and `/game`. Cloudflare Pages automatically serves matching `.html` files. No `_redirects` file is required. The custom domain is managed in Cloudflare Pages > Custom domains, not by a repository CNAME file.

## Visual QA v4.4
- Uses a clean 950×325 TASG wordmark cropped from the original 2508×627 source banner.
- WebP primary asset with PNG fallback.
- Animated topography on homepage hero, tactical displays, interior page heroes, and game frame.
- Motion is disabled automatically for visitors who prefer reduced motion.
- Rebuilt favicon and app icons around a clean centered TASG sword emblem at 512, 192, 180, and 32 pixels.
- Added subtle animated topography to privacy and 404 backgrounds so the visual language remains consistent across every route.

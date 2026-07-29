# TASG Defense Website v4.6 Final Interactive QA

Static website package prepared for GitHub and Cloudflare Pages deployment.

## Deploy
Upload the contents of this folder directly to the repository root. Do not upload an enclosing folder.

The v4.6 package keeps all critical visible assets at the repository root and adds:
- `snare-concept.html` — standalone interactive SNARE-1A concept application
- `kharg-tactical-bg-v46.jpg` — cached regional background image
- `snare-concept-preview-v46.webp` and `snare-concept-preview-v46.jpg` — homepage preview

## Interactive SNARE concept view
The SNARE-1A page embeds the standalone application. Visitors can:
- drag friendly, threat, observation, casualty, and SNARE center markers
- pan, wheel-zoom, and pinch-zoom the regional image
- adjust an explicitly conceptual 3–15 meter visualization radius
- measure local demonstration distance and bearing
- generate demonstration SITREP, 9-Line MEDEVAC, CAS 9-Line, and SNARE launch messages
- copy generated text locally

The local grid, measurements, positions, report content, and concept radius are illustrative. The interface is not connected to live networks and is not a navigation, targeting, or validated performance product.

## Existing functionality retained
- Responsive desktop/mobile navigation
- About page: Combat veteran-owned; founder display name Nick Sulewsky
- Partner inquiry mailto workflow
- Browser game and local top-10 leaderboard
- Root-level wordmark, topography, icons, and social card
- Extensionless Cloudflare Pages routing
- Reduced-motion support

## Cache and file layout
All visible assets are at repository root. CSS and JavaScript references include `?v=4.6` so the final deployment does not display a stale prior build. No `assets/` folder is required.

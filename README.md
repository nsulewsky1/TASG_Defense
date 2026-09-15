# TASG Defense website (v4.9)

Static site for [tasgdefense.com](https://tasgdefense.com). Upload root files to GitHub; Cloudflare Pages serves from repository root.

## Public posture
- **Terminal Link** is the primary product (TAK employment integration; local initiation authority).
- **Selective consulting** for kit ergonomics and digital-layer / TAK integration.
- **SNARE-1A** is a parked TRL 2 notional packaging study (not validated; not fielded).
- Training game is footer-only and `noindex`.
- Contact: `Nick@tasgdefense.com`
- Does not represent DoD or the U.S. Army.

## Deployment
- Cloudflare Pages: framework preset None, blank build command, output = repository root.
- Production branch: `main`.
- Pretty URLs: Cloudflare Pages + `_redirects` for extensionless routes.
- Local preview: `python3 serve-preview.py` then open http://127.0.0.1:8080/

## Verify
1. Confirm `/VERSION.txt` shows `v4.9`.
2. Check `/`, `/terminal-link`, `/about`, `/partner`, `/snare-1a`, `/privacy`, `/game`.
3. Hard-refresh if CSS/JS appears stale (`?v=4.9`).

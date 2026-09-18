# TASG Defense website (v4.15.1)

Static site for [tasgdefense.com](https://tasgdefense.com). Cloudflare Pages serves from repository root.

## Public posture
- **Terminal Link** is the lead product (final-layer C-sUAS employment reporting into TAK; local initiation).
- **Scoped advisory** when capacity allows.
- **SNARE-1A** is a soldier-carried net effector study for final-layer protection in a layered defense (TRL 2; not validated; not fielded; mission-level only).
- Contact: `Nick@tasgdefense.com`
- Does not represent DoD or the U.S. Army.

## Deployment
- Cloudflare Pages: framework preset None, blank build command, output = repository root.
- Production branch: `main`.
- Pretty URLs: Cloudflare Pages automatic HTML extension handling (do not add conflicting `_redirects`).
- Local preview: `python3 serve-preview.py` then open http://127.0.0.1:8080/

## Verify
1. Confirm `/VERSION.txt` shows `v4.15.1`.
2. Check `/`, `/terminal-link`, `/partner`, `/snare-1a`, `/privacy`.
3. Hard-refresh if CSS/JS appears stale (`?v=4.15.1-copy`).

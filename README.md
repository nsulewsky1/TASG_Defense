# TASG Defense website (v4.16.0-audit)

Static site for [tasgdefense.com](https://tasgdefense.com). Cloudflare Pages serves from repository root.

## Public posture
- **Terminal Link** is the lead product (C-sUAS employment reporting into TAK; local initiation). Status: prototype under verification.
- **Preferred delivery:** transfer-ready source, interface documentation, test evidence, and limited transition support.
- **Selective advisory:** scoped integration and kit-fit support.
- **SNARE-1A** is a soldier-carried net effector TRL 2 co-development study (mission-level only; not validated; not fielded).
- Contact: `Nick@tasgdefense.com`
- Independently owned and operated. No U.S. government or military endorsement implied.

## Deployment
- Cloudflare Pages: framework preset None, blank build command, output = repository root.
- Production branch: `main`.
- Pretty URLs: Cloudflare Pages automatic HTML extension handling (do not add conflicting `_redirects`).
- Local preview: `python3 serve-preview.py` then open http://127.0.0.1:8080/

## Verify
1. Confirm `/VERSION.txt` shows `v4.16.0-audit`.
2. Check `/`, `/terminal-link`, `/about`, `/partner`, `/snare-1a`, `/privacy`.
3. Hard-refresh if CSS/JS appears stale (`?v=4.16.0-audit`).
4. Partner form: Prepare email is `type=button`; native GET must not dump message fields into the URL.

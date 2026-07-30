# TASG v4.7 Lean Responsive QA

Upload every file in this folder directly to the GitHub repository root. There is no assets folder.

## Deployment
- Replace the existing root files with these v4.7 versions.
- Keep all images, CSS, JavaScript, and HTML files beside `index.html`.
- Cloudflare Pages framework preset: None.
- Build command: blank.
- Output directory: repository root.
- Production branch: `main`.

## Public posture
- The interactive tactical concept view was removed because it is not part of the current TRL 2 effort.
- The SNARE training game remains available only through the footer and is marked `noindex`.
- Do not add the general SBA seal. After VetCert approval, use only the official certification web icon supplied by SBA and avoid language implying SBA endorsement.
- Do not publish command endorsements, legal-review memoranda, military seals, unit information, official photographs, or nonpublic government information.

## Production verification
1. Open `/VERSION.txt` and confirm `2026-07-30-v4.7-Lean-Responsive-QA`.
2. Check `/`, `/snare-1a`, `/about`, `/partner`, `/privacy`, and `/game`.
3. Test the mobile menu and partner form.
4. Hard-refresh once if Cloudflare or the browser serves an older cached stylesheet.


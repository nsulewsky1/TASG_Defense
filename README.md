# TASG Teaser Website

A GitHub Pages-ready static website for **Terminal Applied Solutions Group, LLC**.

## Brand direction

- Uses the latest no-stars TASG LinkedIn-banner identity.
- Deliberately withholds product details and imagery.
- Positions TASG as an operator-led defense innovation and IP-commercialization company.
- Vanilla HTML, CSS, and JavaScript: no packages, build tools, tracking scripts, or external font dependencies.

## Preview locally

Open `index.html` directly, or run a simple local server:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Publish with GitHub Pages

1. Create a new GitHub repository, such as `tasg-site`.
2. Upload every file and folder in this package to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.

The empty `.nojekyll` file tells GitHub Pages to serve this as a plain static site.

## Configure before public release

1. Replace the preview-only private-inquiry modal behavior in `script.js` with the approved TASG email address, secure form, or intake link.
2. Add a custom domain later through **Settings → Pages** when a TASG domain is ready.
3. Review the legal disclaimer and metadata in `index.html`.
4. Keep private concepts, engineering data, and controlled imagery out of this public repository.

## File structure

```text
.
├── .nojekyll
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets
    ├── favicon.png
    ├── tasg-linkedin-banner-no-stars.png
    └── tasg-logo-no-stars.png
```

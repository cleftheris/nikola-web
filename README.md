# Νίκολα Παπαγεωργοπούλου · Dental practice website

Static, dependency-free website for the dental practice of Nikola Papageorgopoulou
in Argyroupoli, Athens — Greek at `/`, English at `/en/`. Hosted on GitHub Pages.

## Structure

```
site/                  ← everything that gets published
  index.html           Greek homepage
  en/index.html        English homepage
  404.html             Not-found page (uses absolute /nikola-web/ paths)
  assets/css/          styles.css (design tokens at the top)
  assets/js/           main.js (menu, "open now" status, click-to-load map)
  assets/img/          optimised images + icons.svg sprite + logo
  assets/fonts/        self-hosted Manrope & Literata (OFL licensed)
  site.webmanifest, robots.txt, sitemap.xml, favicons
tools/
  optimize-images.mjs  regenerates responsive images & icons
  source-images/       original photos
.github/workflows/deploy.yml   validate + deploy to GitHub Pages
```

## Editing content

Content lives directly in `site/index.html` (Greek) and `site/en/index.html` (English).
Keep both in sync. When changing practice details, also update:

- **Opening hours** – the `<tr data-day data-open data-close>` rows (drive the “Open now” badge),
  the hero summary line, and the `openingHoursSpecification` in the JSON‑LD block of both pages.
- **Phone / address** – visible text, `tel:` links and the JSON‑LD block.
- **Team photos** – put the original photo in `tools/source-images/`, add an entry to the
  `portraits` list in `tools/optimize-images.mjs` (square crop box in source pixels),
  run `npm run images`, then copy an existing team card’s `<picture>` and point it to the
  new `*-portrait-320/640` files.

## Local development

```powershell
npm install          # first time only
npm run serve        # http://localhost:8080
npm run validate     # HTML validation (also runs in CI)
npm run images       # regenerate images after changing tools/source-images
```

## Deployment

1. Push to GitHub (`main` branch).
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` validates the HTML and publishes `site/`.

The site is configured for `https://cleftheris.github.io/nikola-web/`.

### Using a custom domain

1. Add `site/CNAME` containing the domain (e.g. `www.example.gr`) and configure DNS per
   [GitHub’s guide](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).
2. Replace `https://cleftheris.github.io/nikola-web/` with the new origin in both
   `index.html` files, `sitemap.xml` and `robots.txt`.
3. In `site/404.html` replace `/nikola-web/` with `/`.

## Best practices applied

- **Performance** – no frameworks, responsive WebP/JPEG `srcset`, explicit image
  dimensions (no layout shift), preloaded hero image & font subsets, lazy-loaded images,
  CSS-only scroll animations.
- **Privacy / GDPR** – no cookies, no analytics, fonts self-hosted, Google Maps loads only
  after the visitor clicks “Show map”.
- **Security** – strict Content-Security-Policy (no inline scripts/styles), `rel="noopener"`
  on external links, strict referrer policy.
- **Accessibility** – semantic landmarks, skip link, keyboard-accessible menu with
  `aria-expanded`, visible focus styles, alt text, `prefers-reduced-motion` support,
  WCAG AA colour contrast.
- **SEO** – `Dentist` structured data (JSON‑LD), `hreflang` alternates, canonical URLs,
  Open Graph image, sitemap.

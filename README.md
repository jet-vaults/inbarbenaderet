# inbarbenaderet

## Status

| | |
|---|---|
| **Domain** | `https://inbarbenaderet.com` |
| **Pages URL** | `https://inbarbenaderet.pages.dev` |
| **Storage mode** | `Standard` (`standard`) |
| **Storage account** | `jetvaults` |
| **Public storage** | `https://jetvaults.blob.core.windows.net/inbarbenaderet/` |
| **Private storage** | `https://jetvaults.blob.core.windows.net/inbarbenaderet-private/` |
| **Public container** | `inbarbenaderet` |
| **Private container** | `inbarbenaderet-private` |
| **Activated** | No |

## Nameservers

Set these at your domain registrar:

```
lia.ns.cloudflare.com
louis.ns.cloudflare.com
```

## Development

Only the `wwwroot/` directory is served. Everything else stays in the repo.
Push to `main` → Cloudflare Pages auto-deploys.

**Do not edit the generated HTML in `wwwroot/` directly.** The site is generated:

```
site-src/
  data/            bilingual structured content (he+en per item)
    site.json      ← contact info, hours, socials — SINGLE source of truth
    ui.json        ← all UI strings
    treatments/    14 treatment pages
    articles/      11 journal articles
    products/      3 demo placeholder products (future collection)
    pages/         clinic story, academy (mesotraining), etc.
  templates/       layout + page templates (plain JS, no deps)
  build.mjs        generator → writes wwwroot/ (77 pages, sitemap, robots, _redirects)
  images-original/ high-res source copies (optimized WebP lives in wwwroot/assets/img)
  tools/optimize-images.py  image pipeline (Pillow)
```

Build after editing data/templates:

```
node site-src/build.mjs
```

Routes are bilingual (`/he/...` default + `/en/...`, hreflang linked). Old WordPress
URLs 301-redirect via `wwwroot/_redirects`. See `SITE_AUDIT.md`, `REDESIGN_PLAN.md`,
`IMAGE_MANIFEST.md`, and **`CONTENT_REVIEW.md` (open questions for the client — read
before go-live)**.

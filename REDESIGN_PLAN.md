# REDESIGN PLAN — Inbar Ben Aderet · Advanced Aesthetics

Goal: reposition Inbar Ben Aderet as an established, high-end skincare & aesthetics brand. Complete rebuild from zero — content migrated, design not.

---

## 1. New sitemap (bilingual)

```
/                        → 301 to /he/ (x-default = /he/)
/he/  /en/                        Home
/he/clinic/  /en/clinic/          The Clinic (editorial story of Inbar + clinic)
/he/treatments/  /en/treatments/  Treatments index (by concern + full list)
/he/treatments/<slug>/            15 individual treatment pages
/he/articles/  /en/articles/      Journal index
/he/articles/<slug>/              11 articles
/he/products/  /en/products/      Future collection — "Coming Soon" teaser index
/he/products/<slug>/              3 placeholder product pages (demo content, clearly non-live)
/he/academy/  /en/academy/        Mesotherapy training course (unique offering; footer + clinic link)
/he/contact/  /en/contact/        Contact / booking
/he/accessibility/ /he/privacy/   Statements (+ EN)
/he/thank-you/                    Form thank-you (preserves old route's purpose)
404.html                          Custom bilingual 404
```

Treatment slugs: `anti-aging` (incl. H.D.R), `post-acne`, `acne`, `pigmentation`, `facial-treatment`, `laser-hair-removal`, `mesotherapy`, `hifu`, `hydration`, `cosmetic-acupuncture`, `rf-treatment`, `phototherapy`, `oxygeneo`, `chemical-peel`, `evolux-pro-plasma`.

## 2. URL migration table (301s via Cloudflare Pages `_redirects`)

| Old URL | New URL | Action |
|---|---|---|
| `/` | `/he/` | 301 |
| `/clinique/` | `/he/clinic/` | 301 |
| `/clinique/treatments/` | `/he/treatments/` | 301 |
| `/clinique/articles/` | `/he/articles/` | 301 |
| `/clinique/tutorials/` | `/he/clinic/` (videos section) | 301 |
| `/anti-aging/` | `/he/treatments/anti-aging/` | 301 |
| `/acne/` | `/he/treatments/acne/` | 301 |
| `/microneedling2/` | `/he/treatments/mesotherapy/` | 301 |
| `/evoluxproplasma/` | `/he/treatments/evolux-pro-plasma/` | 301 |
| `/mesotraining/` | `/he/academy/` | 301 |
| `/akne/` | `/he/articles/acne/` | 301 |
| `/post-akne/` | `/he/articles/post-acne/` | 301 |
| `/pigmentation/` | `/he/articles/pigmentation/` | 301 |
| `/face-treatment/` | `/he/articles/facial-treatment/` | 301 |
| `/hair-removal/` | `/he/articles/laser-hair-removal/` | 301 |
| `/mezoterapia/` | `/he/articles/mesotherapy/` | 301 |
| `/hifu/` | `/he/articles/hifu/` | 301 |
| `/hederation/` | `/he/articles/hydration/` | 301 |
| `/acupuncture/` | `/he/articles/cosmetic-acupuncture/` | 301 |
| `/rf/` | `/he/articles/rf-treatment/` | 301 |
| `/טיפול-פנים-מבצע/` | `/he/contact/` | 301 |
| `/טופס-אבחון-לקוח/` | `/he/contact/` | 301 |
| `/thank-you/` | `/he/thank-you/` | 301 |
| `/shop/`, `/product/*`, `/product-*` | `/he/products/` | 301 (obsolete BIA shop → future collection teaser) |
| `/tag/*`, `/category/*` | `/he/articles/` | 301 |

## 3. Technical approach

Static, dependency-light (JetVaults standard: Cloudflare Pages serves `wwwroot/` on push to main):

- `site-src/` — source of truth, checked in:
  - `data/site.json` — single contact/config source (phones, address, hours, socials, analytics)
  - `data/treatments/*.json`, `data/articles/*.json`, `data/products/*.json`, `data/testimonials.json`, `data/pages/*.json` — bilingual structured content (`he` + `en` per item)
  - `templates/*.mjs` — page templates (plain JS template literals, no framework)
  - `build.mjs` — Node build: data + templates → static HTML into `wwwroot/`, plus sitemap.xml, robots.txt, `_redirects`
  - `images-original/` — high-res source copies (kept out of `wwwroot`)
  - `tools/optimize-images.py` — Pillow: WebP derivatives + responsive sizes → `wwwroot/assets/img/`
- `wwwroot/` — generated output (HTML per language/route, css, js, fonts, images)
- No client-side framework. One small vanilla JS file (menu, header state, reveals, parallax, carousel-free testimonials rotation). No jQuery, no animation library.
- Commerce later: product JSON already carries full future schema (price, currency, stockStatus…) — a future storefront can consume the same data.

## 4. Design system

### Colors — derived from the supplied brand suite (BA monogram · INBAR BEN ADERET · SKIN SCIENCE)
Sampled from the client's logo files (2026-08-31): ink `#40372E`, cream `#E8E4D9`, taupe `#8B8378`, warm black.

```css
--brand-primary:   #332B24;  /* espresso — dark sections */
--brand-secondary: #40372E;  /* logo ink — headings */
--brand-ink:       #29231D;  /* deepest — footer, CTAs */
--brand-accent:    #8B8378;  /* taupe — rules, markers */
--brand-accent-deep:#6B6156; /* taupe text on light (AA) */
--brand-accent-light:#CDC5B9;/* taupe on dark grounds */
--brand-background:#F6F3ED;  /* warm ivory */
--brand-surface:   #EDE9E0;  /* raised cream */
--brand-surface-green:#E8E4D9; /* legacy var name; holds the brand cream */
--brand-text:      #332B24;
--brand-muted:     #6E665C;
--brand-border:    #DDD7CB;
--brand-inverse:   #F6F3ED;
```
A warm monochrome system — ivory/cream grounds, espresso darks, taupe accents. No color outside the brand suite.

### Typography
- **EN display**: the wordmark is an elegant flared serif — closest licensed web match: **Marcellus** (headings, display, card titles).
- **Tracked caps sans**: **Jost** for nav, buttons, overlines, badges (matches the "SKIN SCIENCE" tagline letterforms).
- **Hebrew — everything**: **Assistant** (200–700), per brief.
- **EN body**: Assistant latin.
- Self-hosted woff2 subsets (all OFL-licensed), `font-display: swap`, preloaded.

Logo assets extracted from the supplied files into transparent WebP: header wordmark (`logo-mark-*`), stacked lockup (`logo-full-*`), oval BA monogram (`monogram-*`, also the favicon). Originals in `site-src/brand-v2/`.
- Scale: editorial — display clamp(2.6rem→4.5rem) light; H2 clamp(1.9rem→2.8rem); overlines 11–12px letterspaced uppercase (EN) / 13px (HE); body 1.06rem/1.75; wide margins, max reading width 68ch.

### Components & rules
- Buttons: rectangular, 1px charcoal border, generous padding, letterspaced; primary = charcoal fill, hover reveals leaf underline motion. No pills, no gradients, no shadows.
- Corner radius strategy: 0 (editorial) everywhere except tiny UI (2px inputs). Images square-cropped or 4:5 / 3:4 / 21:9 editorial ratios.
- Dividers: 1px `--brand-border`; leaf-green 24px rules as section markers.
- Numbered index motif ("01." …) carried from the old treatments page as a heritage detail, restyled.
- Cards: image + overline + title + one line; hover = slow image scale (1.03) + title shift. Not boxed — open layouts, hairline separators.
- Header: transparent over hero → solid paper with hairline border after 40px scroll; logo shrinks slightly. HE/EN selector as understated text toggle. Mobile: full-screen charcoal overlay menu, large Assistant type, staggered fade-in.
- Footer: charcoal, logo (light variant), 4 columns → stacked mobile, language switch, socials, accessibility/privacy.

### Motion
- IntersectionObserver entrance: opacity 0→1 + translateY 24px→0, 700ms cubic-bezier(.22,.61,.21,1), stagger 80ms; **only once**, only on section roots and key figures — not every element.
- Masked image reveals: `clip-path: inset(0 0 100% 0)` → `inset(0)` 900ms on hero/editorial figures.
- Hero: gentle parallax (translate3d, ≤6%, rAF, disabled on touch + reduced-motion).
- Testimonials: cross-fade quote rotation (8s), no slider chrome.
- All gated by `prefers-reduced-motion: reduce` → static.

## 5. Page structures — per brief §01–§05
Homepage: full-height editorial hero (authentic clinic photo, new logo, positioning line, primary CTA קביעת פגישה / secondary לכל הטיפולים) → brand statement → 5 signature treatments (asymmetric editorial rows, not card grid) → Inbar editorial portrait section → clinic philosophy (diagnosis, H.D.R, technology, personal care) → facts strip (real, verifiable: 20+ years, 15 treatment types, since-2000 — **no animated counters**) → testimonials (large quote typography, rotation) → 3 featured articles → future collection teaser ("A NEW CHAPTER / Inbar Ben Aderet Skincare / Coming Soon" + 3 SVG still-life placeholders) → visit/contact (address, hours, phone, WhatsApp, map link) → footer.
Clinic: hero photo → intro → Inbar's story in chapters with pull quotes (bio split: beginnings / the niche / oncology & acupuncture / mind-skin / today) → philosophy → technologies → personalized diagnosis → videos (4 tutorials) → testimonials → CTA.
Treatments: index by concern (acne, pigmentation, aging, texture/scarring, hydration, hair removal) + full numbered list; detail template: hero, what is it, what it addresses, how it works, who it suits, what to expect, pricing (where sourced), FAQ (only source-derived), related treatments, related article, consult CTA.
Articles: editorial journal grid (image, category, title, excerpt); article template: large hero, reading width 68ch, H2/H3 hierarchy, related treatment + related articles, CTA.
Products: high-end "collection" index with 3 placeholder products (Radiance Renewal Serum, Hydra Barrier Cream, Renewal Treatment Mask) as refined SVG still-lifes, "Coming Soon" labels, waitlist CTA (mailto/WhatsApp — no fake cart, no checkout, no Product schema). Full future data schema in JSON (name, slug, subtitle, descriptions, images, category, skinConcern, benefits, usage, ingredients, size, price, currency, stockStatus, featured, seo*). Internally marked `"demo": true`.

## 6. Bilingual architecture
- Each item's JSON carries `he` + `en` objects; templates receive `(lang, dir)`; all directional CSS via logical properties (`margin-inline-start`, `padding-inline`, `inset-inline-end`) — no `left/right` flipping hacks; arrows/chevrons rendered per-direction; numbers and prices forced LTR inside RTL text via `unicode-bidi`.
- `<html lang dir>` per page; hreflang `he` ↔ `en` + `x-default` → `/he/`; language switch preserves the current route.
- UI strings dictionary `data/ui.json` (he/en) — zero duplicated markup.

## 7–8. Content & image migration
- Content: structured bilingual JSON generated from the crawl (Hebrew preserved & cleaned, EN newly translated at premium editorial register). Medical claims preserved not amplified, flagged in CONTENT_REVIEW.md.
- Images: originals under `site-src/images-original/`; Pillow pipeline → WebP (quality ~82, effort high) at 480/960/1600/2200 widths as needed; semantic names (`inbar-portrait-01.webp`, `inbar-clinic-treatment-01.webp`, `inbar-ba-pigmentation-01.webp`); `width/height` attrs everywhere; hero preloaded, rest lazy; manifest at `IMAGE_MANIFEST.md`. No BIA assets. No hotlinks.

## 9. SEO migration
- 301s per table above; canonical per page; XML sitemap (both languages, hreflang annotated); robots.txt.
- Meta + OG + Twitter cards per page (og:image from authentic photography); JSON-LD: `LocalBusiness`/`BeautySalon` (site-wide), `Article` (articles), `BreadcrumbList`; **no Product schema for demo products**.
- Old titles/descriptions consulted; Hebrew keeps keyword continuity (טיפולי פנים ראשון לציון, אנטי אייג'ינג, etc.).

## 10. Open items for client (tracked in CONTENT_REVIEW.md)
Phone number conflict · stats verification · promo page fate · analytics/pixel · form backend (Easybizy vs Web3Forms vs WhatsApp-only) · "maybe-BIA" 2022/09 editorial photos · product placeholder naming.

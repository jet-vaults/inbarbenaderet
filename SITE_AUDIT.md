# SITE AUDIT — inbarbenaderet.com (existing WordPress site)

Audit date: 2026-08-31. Crawled via Yoast sitemaps + full-page downloads (23 content pages, 126 unique media assets).
The current site is WordPress + Elementor, Hebrew-only, hosted separately. It stays live and untouched until the new site is approved.

---

## 1. Existing pages

| URL | Type | Content |
|---|---|---|
| `/` | Page | 2022-era homepage: hero, Inbar Clinic intro, **BIA ITALY promo**, long "About Inbar" bio, broken counters, Instagram, contact |
| `/clinique/` | Page | 2024-era clinic landing: hero, broken counters, appointment CTA, 6 testimonials, newsletter, contact |
| `/clinique/treatments/` | Page | Treatments index: 11 numbered treatment teasers + long-form sections w/ pricing for ~9 treatments |
| `/clinique/articles/` | Page | Articles index: 11 "מהו טיפול X?" article links |
| `/clinique/tutorials/` | Page | 4 self-hosted MP4 videos of Inbar explaining treatments |
| `/acne/` | Page | Acne treatment landing page |
| `/anti-aging/` | Page | Anti-aging landing page (also in post sitemap; same URL) |
| `/evoluxproplasma/` | Page | Evolux Pro Plasma device/treatment page |
| `/mesotraining/` | Page | Professional mesotherapy training course for cosmeticians |
| `/microneedling2/` | Page | Microneedling landing page |
| `/טיפול-פנים-מבצע/` | Page | Facial treatment promo/offer page |
| `/טופס-אבחון-לקוח/` | Page | Client diagnosis intake form |
| `/thank-you/` | Page | Form thank-you page |
| `/--/` | Page | "טיפול H.D.R" — **now returns 404** (removed draft). H.D.R method content exists inside anti-aging copy |
| `/shop/`, `/product/*` | WooCommerce | **BIA ITALY shop — obsolete, excluded** (verona, milano, matera, pascara, aha-bha) |
| `/tag/*`, `/category/*`, `/product-tag/*`, `/product-category/*` | Archives | Thin auto-generated archives — not worth migrating |

## 2. Existing treatments (canonical list, from `/clinique/treatments/`)

01 אנטי אייג'ינג (incl. Inbar's signature **H.D.R method**) · 02 פוסט אקנה (scars/holes/texture) · 03 אקנה · 04 פיגמנטציה · 05 טיפול פנים (electroporation classic facial, priced) · 06 הסרת שיער · 07 מזותרפיה/מיקרונידלינג · 08 HIFU · 09 הדרציה · 10 דיקור סיני קוסמטי · 11 RF.
Additional treatments described only inside the index page: **פוטותרפיה** (priced), **אוקסיג'נאו**, **פילינג כימי**. Plus dedicated device page: **Evolux Pro Plasma**.
Several include real pricing (e.g. facial ₪520 / series 6 ₪2,900 / series 12 ₪5,600; phototherapy ₪350–520, series ₪1,500; anti-aging ₪550–1,300) and cadence recommendations.

## 3. Existing articles (11, all "מהו טיפול X?")

anti-aging, post-acne, acne, pigmentation, facial, laser hair removal, mesotherapy, HIFU, hydration, cosmetic acupuncture, RF — each mirrors a treatment. Note: the articles index reuses the acne excerpt for hair-removal (copy-paste bug).

## 4. Existing useful images (inventory of 126 assets; ~88MB downloaded)

**Authentic — migrate:**
- Inbar portraits: `ענבר.jpg` (852²), `Pi7_image_tool.jpeg` (2025, blazer + serum bottle, 1450×1590), `WhatsApp-Image-2022-08-08` (570×1024)
- Clinic/treatment photography: `0X6A9977_Custom.jpeg` (2400×1600, treatment beside INBAR-branded wall — hero grade), `הסרת-שיער.jpg` (1800×1237), `Mesotherapy-1/-2`, `RF-1`, `IMG_5620` + `IMG_8772` (cosmetic acupuncture), `face-1/2/3` (mask treatments, branded headbands), `4G8A5682.webp` (2560×1707 treatment), `IMG_2214-scaled.jpg` (2560×1920), `Rectangle-4-1.jpg` (small)
- Training/academy: `PHOTO-2026-02-17-*` ×5 (1536×2048, course sessions in front of INBAR wall) — for mesotraining page
- Devices: `IMG_6839` (microneedling tips), Evolux device renders (`PHOTO-2025-10-10`, `צילום-מסך-2025-03-06`)
- Real before/after: post-acne (`post-acne-1/2.png`, branded), pigmentation (`DFEE4A4A…` branded, `Pigmentation-2-1`, `IMG_2677`), acne closeups (`IMG_0365/0366`, `IMG_2921`, `IMG_2981`, `IMG_6843/6844`, `WhatsApp-Image-2024-02-18` ×4), aging (`IMG_2442`)
- Video stills `1.png`–`4.png` + 4 MP4 tutorials (`פיגמנטציה.mp4`, `inbar02/03/04.mp4`)
- Logos on the old site: `2025/12/inbar-logo-new.png` (INBAR + leaf-R + "אסתטיקה מתקדמת"), `לוגו-ענבר.png` — **superseded**: the client supplied the actual new brand suite (BA monogram · INBAR BEN ADERET · SKIN SCIENCE, cream/taupe/ink) on 2026-08-31; sources in `site-src/brand-v2/`. The green leaf branding still appears physically in some clinic photos (wall, pillows, headbands).

**WhatsApp testimonial screenshots (~35 files):** genuine client feedback — evidence for testimonials, but screenshots don't belong on a premium site. Text can be quoted (see CONTENT_REVIEW).

**Stock (2024/06, freepik-named, ~15 files):** mesotherapy/HIFU/RF/spa/LED-mask etc. Low authenticity — use only as gap fillers, prefer authentic.

**Old design decorations — skip:** Sand-Zen tiles, Line-art-faces, face.png, curve-p, rainbow/3-line details, leaf.png (leaf motif comes from the logo itself now).

## 5. Existing URLs
Full list captured in the crawl (71 sitemap URLs). Valuable, ranked: `/`, `/clinique/`, `/clinique/treatments/`, `/clinique/articles/`, 11 article posts, treatment landing pages (`/acne/`, `/anti-aging/`, `/microneedling2/`, `/evoluxproplasma/`, `/mesotraining/`). Redirect table in REDESIGN_PLAN.md.

## 6. Content worth keeping
- Inbar's full biography (authentic, personal, strong story: 20+ years, spa management, niche focus, oncology-patient cosmetics training, cosmetic acupuncture after her own atopic dermatitis, NLP coaching, chemistry studies, running courses for cosmeticians)
- The H.D.R signature method (name + positioning inside anti-aging copy)
- All 11 treatment descriptions + prices + cadence recommendations
- All 11 article bodies
- 6 written testimonials with names (Olga Krasilikov, Gal Shahar, Michal Ayni, Rachel Basri, Keren Arviv, Ahuva Lahav)
- Contact block: address ישראל גלילי 7 ראשון לציון; hours Sun–Thu 10:00–19:30, Fri 8:30–13:00, closed Sat; email inbarbenaderet@gmail.com; socials facebook.com/inbarcosmetic, instagram.com/inbar_benaderet
- 4 tutorial videos; mesotraining course page (unique offering)
- Authentic photography + before/afters listed above

## 7. Content that should be removed / not migrated
- Everything WooCommerce (shop, products, product tags/categories)
- Tag/category archives; login/registration modal; newsletter popups
- Old accessibility-widget overlay (replaced by genuinely accessible build)
- The promo page (מבצע) — time-limited offer, confirm with client before carrying over
- Duplicated H2/H3 blocks on the old homepage (mobile/desktop duplicates)

## 8. BIA-related content to exclude (per instruction)
- Homepage BIA ITALY section (title + copy + "מעבר לחנות" CTA)
- `/shop/` + 5 product pages + product taxonomies
- Product photography: `4G8A5385-scaled.jpg` (models with product pedestal), `IMG_9059.jpg` (product styling shoot), `729C9904…png` (BIA og:image), product PNGs
- Flagged as *maybe BIA-adjacent* (same 2022/09 shoot, but no products/branding visible): `IMG_8962-1.webp`, `IMG_9057.webp`, `3c7819a7…jpg` — treat as excluded unless client approves
- og:description of the homepage mentions BIA — new meta must not

## 9. SEO considerations
- Yoast in place; decent titles; Hebrew-only, no hreflang, no EN content at all (EN version is net-new)
- Article/treatment URLs are short root-level slugs (mixed transliteration: `/akne/` vs `/acne/`, `/mezoterapia/`) — inconsistent; two pages compete for acne (`/acne/` page vs `/akne/` post) and anti-aging (page + post at same URL)
- Site has Facebook Pixel (PixelYourSite) — ask client whether to carry analytics/pixel over
- Product/shop URLs will 404 or redirect — they're obsolete brand, redirect to `/he/products/` teaser
- Old URLs must 301 to new bilingual routes; sitemap + robots.txt + canonical + hreflang needed

## 10. Contact-information conflicts (⚠ verify with client — see CONTENT_REVIEW.md)
- Displayed phone everywhere: **050-9797653**
- But `tel:` links + most newer WhatsApp links use **050-6867653** (wa.me/972506867653)
- Older WhatsApp links use a **malformed** number `wa.me/9720509797653` (extra 0 → likely broken chats)
- Same greeting text on both → both look intended as "the clinic number" at different times

## 11. Design problems with the current site (what the redesign fixes)
- Two different eras/designs coexist (`/` = 2022 template, `/clinique/*` = 2024 template) with different navs — confusing IA; homepage doesn't even link the treatments index directly
- Animated counters render **"0 שנות נסיון / 0 לקוחות"** — statistics actively harm credibility (exactly the failure the redesign brief calls out)
- Elementor bloat: ~300KB HTML per page before assets; duplicate mobile/desktop content blocks in DOM
- Generic template look: pill buttons, boxed cards, mixed serif (Brygada 1918) + Assistant + Inter with no hierarchy system
- Copy-paste bugs (hair-removal excerpt = acne excerpt); dead draft link (`/--/` H.D.R 404)
- Accessibility = overlay widget bolted on, plus a login modal shipped in every page's DOM
- Obsolete BIA shop still promoted on the homepage above the fold
- WhatsApp testimonial screenshots as images instead of designed testimonial typography
- No EN, no hreflang, no structured data beyond Yoast defaults

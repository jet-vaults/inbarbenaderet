# CONTENT REVIEW — items to verify with the client before go-live

Compiled during the 2026-08-31 rebuild. The new site currently makes the safest choice for each item; nothing here blocks preview, but all should be resolved before DNS cutover.

## 1. Contact information conflicts (HIGH)
The old site mixes **three** phone numbers:
- **050-9797653** — displayed in every footer/contact block (the new site currently uses this everywhere)
- **050-6867653** — used in most `tel:` links and newer WhatsApp links (wa.me/972506867653)
- **03-941-3248** — appears on the 2024 anti-aging landing page
- Older WhatsApp links use a malformed `wa.me/9720509797653` (extra 0 — likely broken)

→ **Confirm the single correct phone + WhatsApp number**; update `site-src/data/site.json` (one place) and rebuild.

## 2. Numbers & claims
- Old counters displayed "0 שנות ניסיון" (broken animation). New site shows: **since 2000 · 20+ years · 15 treatment types** — derived from the site's own copy. Newer landing pages claim "25" and "26" years in places. → Confirm preferred wording.
- Facial treatment pricing: treatments index says **₪520** (series 6: ₪2,900, series 12: ₪5,600); the promo page says regular price **₪900** with a ₪447 offer that **expired 31.08.2025**. New site shows the index pricing. → Confirm current prices; promo page was not migrated.
- Anti-aging pricing ₪550–1,300 and phototherapy ₪350–520/₪1,500-series carried over verbatim. → Confirm still current.

## 3. Medically sensitive copy (handled conservatively; confirm)
- **Phototherapy FDA claim** ("שיטה רפואית מאושרת ע"י ה-FDA") — excluded pending verification.
- **HIFU/RF** "replaces the surgeon's scalpel", "revolutionary" — softened to non-clinical language.
- **"הורמון אינקופלין"** (facial-treatment article) — no such hormone exists; claim removed.
- **OxyGeneo** "נתרן דו חמצני" — chemistry naming appears incorrect (likely sodium bicarbonate); wording kept vague.
- **Post-acne** Roaccutane sentence in the source is ambiguous ("effective for people who did NOT take Roaccutane for a long period") — kept close to source; confirm intended meaning.
- **Cosmetic acupuncture** claims about memory/hearing improvement — excluded.
- **Acne article** is a long unattributed medical reference text (prevalence statistics, antibiotic-resistance discussion, "16,000+ patient studies"). Migrated, but → recommend professional review and/or a "general information, not medical advice" disclaimer.
- The **mezoterapia** article's content is entirely about microneedling; the clinic treats them as one treatment (מזותרפיה/מיקרונידלינג) — new site titles it "מזותרפיה / מיקרונידלינג". → Confirm.
- Bio inconsistency: Chinese vs Japanese acupuncture in different tellings. New site says "דיקור קוסמטי" generically where possible.

## 4. Testimonials & photography consent
- 6 written testimonials (with full names) migrated from /clinique/. → Confirm consent to republish.
- ~35 WhatsApp testimonial screenshots were NOT migrated as images (off-brand + privacy). The text of real quotes can be added later with consent.
- **Before/after photos** of real clients are shown on acne / post-acne / pigmentation treatment pages. → Confirm patient consent.
- 2022/09 branded-shoot photos that appear tied to the obsolete product line (models with product pedestal, product styling) were **excluded** per the BIA directive. Three ambiguous frames from that shoot (`IMG_8962`, `IMG_9057`, `3c7819a7…`) were also excluded to be safe. → Approve if you want them back.
- A few treatment pages use the old site's stock photos (chemical peel, phototherapy, HIFU, hydration, OxyGeneo) where no authentic photo exists. → Replace with clinic photography when available.

## 5. Forms & integrations
- The old client **diagnosis form** collects health data (conditions, medications, pregnancy). A static site must not post that unprotected; it was NOT migrated. Contact is via WhatsApp / phone / email CTAs for now. → Decide: Easybizy integration, a secure form provider, or keep WhatsApp-first.
- Old site had **Facebook Pixel** (PixelYourSite) + Easybizy WhatsApp API note. Neither carried over. → Decide on analytics/pixel before launch.
- Newsletter signup existed on the old site — not migrated (no backend). → Decide.

## 6. Products
- 3 placeholder products are clearly marked demo/coming-soon (no cart, no Product schema, notice on every page). Names (Radiance Renewal Serum / Hydra Barrier Cream / Renewal Treatment Mask) are invented placeholders. → Rename freely at launch; data schema is ready for real products.

## 7. Structure decisions to confirm
- `/evoluxproplasma/` was a B2B **device sales** page (EVOLUX PRO PLASMA, ₪59,000→₪49,999, for professionals). It now redirects to `/he/academy/`. → If device sales matter, a dedicated pro/devices page can be added.
- `/mesotraining/` became **The Academy** (`/he/academy/`) — course content migrated; course dates/pricing should be verified.
- The 4 tutorial videos (2022) were migrated and self-hosted. One is titled "טיפול ד״ר סקין" (Dr. Skin brand). → Confirm videos are still current/on-brand.
- Old promo page (טיפול-פנים-מבצע) and diagnosis-form page both redirect to `/he/contact/`.

## 8. Legal
- New accessibility statement page added (the old overlay widget was intentionally not reproduced; the site itself is built accessible — 0 axe WCAG-AA violations on scanned pages). → Israeli accessibility regulations may require specific statement wording; legal review advised.
- Privacy page is a minimal truthful statement (no tracking currently). → Update if analytics/forms are added.

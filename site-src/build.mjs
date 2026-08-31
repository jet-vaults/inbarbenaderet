// Static site generator for inbarbenaderet — Node, no dependencies.
// Usage: node site-src/build.mjs   (from repo root)
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout } from './templates/layout.mjs';
import * as P from './templates/pages.mjs';

const SRC = dirname(fileURLToPath(import.meta.url));
const ROOT = join(SRC, '..');
const OUT = join(ROOT, 'wwwroot');

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const site = readJson(join(SRC, 'data/site.json'));
const ui = readJson(join(SRC, 'data/ui.json'));
const testimonials = readJson(join(SRC, 'data/testimonials.json'));
const imgManifest = readJson(join(SRC, 'data/img-manifest.json'));
const clinic = readJson(join(SRC, 'data/pages/clinic.json'));
const academy = readJson(join(SRC, 'data/pages/mesotraining.json'));

const loadDir = (dir) => readdirSync(join(SRC, dir)).filter(f => f.endsWith('.json'))
  .map(f => readJson(join(SRC, dir, f)));

/* ---------- treatment order, images, before/afters ---------- */
const ORDER = ['anti-aging', 'post-acne', 'acne', 'pigmentation', 'facial-treatment',
  'laser-hair-removal', 'mesotherapy', 'hifu', 'hydration', 'cosmetic-acupuncture',
  'rf-treatment', 'phototherapy', 'oxygeneo', 'chemical-peel'];
const IMAGE_MAP = {
  'anti-aging': 'stock-hair-removal-01', 'post-acne': 'treatment-mesotherapy-02',
  'acne': 'stock-phototherapy-01', 'pigmentation': 'ba-pigmentation-02',
  'facial-treatment': 'treatment-facial-01', 'laser-hair-removal': 'clinic-room-01',
  'mesotherapy': 'treatment-mesotherapy-01', 'hifu': 'stock-hifu-01',
  'hydration': 'stock-hydration-01', 'cosmetic-acupuncture': 'treatment-acupuncture-01',
  'rf-treatment': 'treatment-rf-01', 'phototherapy': 'stock-phototherapy-01',
  'oxygeneo': 'stock-oxygeneo-01', 'chemical-peel': 'stock-chemical-peel-01',
};
const BA_MAP = {
  'acne': ['ba-acne-01', 'ba-acne-02'],
  'post-acne': ['ba-post-acne-01', 'ba-post-acne-02'],
  'pigmentation': ['ba-pigmentation-01', 'ba-pigmentation-02'],
};

const treatments = loadDir('data/treatments')
  .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))
  .map((t, i) => ({ ...t, num: String(i + 1).padStart(2, '0') + '.', image: IMAGE_MAP[t.slug] || 'clinic-treatment-02', ba: BA_MAP[t.slug] || [] }));

const articles = loadDir('data/articles').map(a => {
  const rel = treatments.find(t => t.slug === (a.relatedTreatment || a.slug));
  return { ...a, image: rel ? rel.image : 'clinic-treatment-02', concern: rel && rel.concerns ? rel.concerns[0] : null };
}).sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));

const products = loadDir('data/products').sort((a, b) => a.index.localeCompare(b.index));

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function makeCtx(lang) {
  const dir = lang === 'he' ? 'rtl' : 'ltr';
  const t = (obj) => (obj && typeof obj === 'object' && (lang in obj)) ? obj[lang] : obj;
  const img = (name, opts = {}) => {
    const m = imgManifest[name];
    if (!m) throw new Error('unknown image: ' + name);
    const vs = m.variants;
    const biggest = vs[vs.length - 1];
    const srcset = vs.map(v => `/assets/img/${v.file} ${v.w}w`).join(', ');
    const attrs = [
      `src="/assets/img/${biggest.file}"`,
      vs.length > 1 ? `srcset="${srcset}"` : '',
      opts.sizes ? `sizes="${opts.sizes}"` : '',
      `alt="${esc(opts.alt ?? '')}"`,
      `width="${biggest.w}" height="${biggest.h}"`,
      opts.loading === 'eager' ? '' : `loading="${opts.loading || 'lazy'}"`,
      opts.fetchpriority ? `fetchpriority="${opts.fetchpriority}"` : '',
      opts.loading === 'eager' ? 'decoding="sync"' : 'decoding="async"',
    ].filter(Boolean).join(' ');
    return `<img ${attrs}>`;
  };
  const ogFor = (name) => {
    const m = imgManifest[name];
    if (!m) return undefined;
    return `/assets/img/${m.variants[m.variants.length - 1].file}`;
  };
  const posterUrl = (name) => ogFor(name) || '';
  const blocks = (arr) => (arr || []).map(b => {
    if (b.type === 'h2') return `<h2>${esc(b.text)}</h2>`;
    if (b.type === 'h3') return `<h3>${esc(b.text)}</h3>`;
    if (b.type === 'ul') return `<ul>${(b.items || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
    return `<p>${esc(b.text)}</p>`;
  }).join('\n');
  return { lang, dir, ui, site, esc, t, img, ogFor, posterUrl, blocks, treatments, articles, products, testimonials, clinic, academy };
}

/* ---------- JSON-LD ---------- */
function businessLd(lang) {
  const addr = site.contact.address[lang];
  return {
    '@context': 'https://schema.org', '@type': 'BeautySalon',
    name: lang === 'he' ? 'ענבר בן אדרת — אסתטיקה מתקדמת' : 'Inbar Ben Aderet — Advanced Aesthetics',
    description: ui.schemaDescription[lang],
    url: `${site.domain}/${lang}/`,
    image: `${site.domain}/assets/img/clinic-treatment-01-1600.webp`,
    logo: `${site.domain}/assets/img/logo-full-dark.webp`,
    telephone: site.contact.phoneE164,
    email: site.contact.email,
    address: { '@type': 'PostalAddress', streetAddress: addr.street, addressLocality: addr.city, addressCountry: 'IL' },
    sameAs: [site.social.instagram, site.social.facebook],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '10:00', closes: '19:30' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:30', closes: '13:00' },
    ],
  };
}
function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({
      '@type': 'ListItem', position: i + 1, name, ...(url ? { item: site.domain + url } : {}),
    })),
  };
}
function articleLd(ctx, a, path) {
  const L = ctx.t(a);
  return {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: L.title, description: L.metaDescription,
    image: site.domain + ctx.ogFor(a.image),
    author: { '@type': 'Person', name: ctx.lang === 'he' ? 'ענבר בן אדרת' : 'Inbar Ben Aderet' },
    publisher: { '@type': 'Organization', name: 'Inbar Ben Aderet', logo: { '@type': 'ImageObject', url: `${site.domain}/assets/img/logo-full-dark.webp` } },
    mainEntityOfPage: site.domain + path,
    inLanguage: ctx.lang,
  };
}

/* ---------- simple page contents ---------- */
function accessibilityContent(lang) {
  return lang === 'he' ? `
<p>אנו רואים חשיבות עליונה בהנגשת האתר לכלל האוכלוסייה, לרבות אנשים עם מוגבלות. האתר נבנה מהיסוד לפי עקרונות נגישות: מבנה כותרות תקין, ניווט מלא במקלדת, טקסט חלופי לתמונות, ניגודיות צבעים העומדת בדרישות, תמיכה בהעדפת צמצום תנועה (prefers-reduced-motion) וסימון מוקדים ברור.</p>
<p>אנו פועלים להתאמת האתר לעקרונות תקן WCAG 2.1 ברמה AA. אם נתקלתם בקושי או בבעיה בגלישה באתר, נשמח שתעדכנו אותנו ונטפל בכך בהקדם.</p>
<h2>יצירת קשר בנושא נגישות</h2>
<p>טלפון: <a href="tel:${site.contact.phoneE164}"><span class="num">${site.contact.phoneDisplay}</span></a> · דוא״ל: <a href="mailto:${site.contact.email}">${site.contact.email}</a></p>` : `
<p>We consider it a core duty to make this website accessible to everyone, including people with disabilities. The site was built from the ground up on accessibility principles: a correct heading structure, full keyboard navigation, alternative text for images, compliant color contrast, respect for the reduced-motion preference, and clear focus indication.</p>
<p>We work toward conformance with WCAG 2.1 level AA. If you encounter any difficulty using the site, please let us know and we will address it promptly.</p>
<h2>Accessibility contact</h2>
<p>Phone: <a href="tel:${site.contact.phoneE164}"><span class="num">${site.contact.phoneDisplay}</span></a> · Email: <a href="mailto:${site.contact.email}">${site.contact.email}</a></p>`;
}
function privacyContent(lang) {
  return lang === 'he' ? `
<p>הפרטיות שלכם חשובה לנו. אתר זה אינו אוסף מידע אישי ללא ידיעתכם. פנייה אלינו בטלפון, בוואטסאפ או בדוא״ל נעשית ביוזמתכם, והפרטים שתמסרו ישמשו אך ורק לצורך מתן מענה וקביעת פגישה.</p>
<p>האתר אינו עושה שימוש בעוגיות מעקב פרסומיות. ייתכן שימוש בכלי מדידה בסיסיים לניתוח תנועה כללי באתר.</p>
<p>לכל בקשה בנושא מידע אישי — לרבות עיון, תיקון או מחיקה — ניתן לפנות אלינו בדוא״ל <a href="mailto:${site.contact.email}">${site.contact.email}</a>.</p>` : `
<p>Your privacy matters to us. This website does not collect personal information without your knowledge. Contacting us by phone, WhatsApp or email is at your initiative, and the details you share are used solely to respond and schedule appointments.</p>
<p>The site does not use advertising tracking cookies. Basic measurement tools may be used for general traffic analysis.</p>
<p>For any request regarding personal data — including review, correction or deletion — contact us at <a href="mailto:${site.contact.email}">${site.contact.email}</a>.</p>`;
}

/* ---------- render ---------- */
let count = 0;
function render(path, altPath, pageFn, extra = {}) {
  const lang = path.startsWith('/en/') ? 'en' : 'he';
  const ctx = makeCtx(lang);
  const page = pageFn(ctx);
  page.path = path; page.altPath = altPath;
  page.jsonLd = [businessLd(lang)];
  if (page.article && extra.articleData) page.jsonLd.push(articleLd(ctx, extra.articleData, path));
  if (extra.breadcrumb) page.jsonLd.push(breadcrumbLd([[ctx.t(ui.misc.breadcrumbHome), `/${lang}/`], ...extra.breadcrumb]));
  const html = layout(ctx, page);
  const file = path.endsWith('/') ? join(OUT, path, 'index.html') : join(OUT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  count++;
  return path;
}

const urls = [];
for (const lang of ['he', 'en']) {
  const o = lang === 'he' ? 'en' : 'he';
  const pre = `/${lang}/`, opre = `/${o}/`;
  urls.push(render(pre, opre, P.home));
  urls.push(render(`${pre}clinic/`, `${opre}clinic/`, P.clinicPage, { breadcrumb: [[lang === 'he' ? 'הקליניקה' : 'The Clinic', `${pre}clinic/`]] }));
  urls.push(render(`${pre}treatments/`, `${opre}treatments/`, P.treatmentsIndex));
  for (const tr of treatments) {
    urls.push(render(`${pre}treatments/${tr.slug}/`, `${opre}treatments/${tr.slug}/`, (ctx) => P.treatmentDetail(ctx, tr),
      { breadcrumb: [[ui.nav.treatments[lang], `${pre}treatments/`], [tr[lang].title, `${pre}treatments/${tr.slug}/`]] }));
  }
  urls.push(render(`${pre}articles/`, `${opre}articles/`, P.articlesIndex));
  for (const a of articles) {
    urls.push(render(`${pre}articles/${a.slug}/`, `${opre}articles/${a.slug}/`, (ctx) => P.articleDetail(ctx, a),
      { articleData: a, breadcrumb: [[ui.nav.articles[lang], `${pre}articles/`], [a[lang].title, `${pre}articles/${a.slug}/`]] }));
  }
  urls.push(render(`${pre}products/`, `${opre}products/`, P.productsIndex));
  for (const p of products) {
    urls.push(render(`${pre}products/${p.slug}/`, `${opre}products/${p.slug}/`, (ctx) => P.productDetail(ctx, p)));
  }
  urls.push(render(`${pre}academy/`, `${opre}academy/`, P.academyPage));
  urls.push(render(`${pre}contact/`, `${opre}contact/`, P.contactPage));
  urls.push(render(`${pre}accessibility/`, `${opre}accessibility/`, (ctx) =>
    P.simplePage(ctx, { title: ui.misc.accessibility[lang], content: accessibilityContent(lang) })));
  urls.push(render(`${pre}privacy/`, `${opre}privacy/`, (ctx) =>
    P.simplePage(ctx, { title: ui.misc.privacy[lang], content: privacyContent(lang) })));
  urls.push(render(`${pre}thank-you/`, `${opre}thank-you/`, (ctx) =>
    P.simplePage(ctx, { title: ui.misc.thankYouTitle[lang], lead: ui.misc.thankYouText[lang], content: `<p><a class="btn btn--solid" href="/${lang}/">${ui.misc.notFoundCta[lang]}</a></p>` })));
}

// 404 (Cloudflare Pages serves /404.html) — Hebrew default with EN line
{
  const ctx = makeCtx('he');
  const page = P.notFound(ctx);
  page.path = '/404.html'; page.altPath = '/en/';
  page.jsonLd = [];
  writeFileSync(join(OUT, '404.html'), layout(ctx, page));
  count++;
}

// root fallback (redirect handled by _redirects; this covers local preview)
writeFileSync(join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<title>ענבר בן אדרת · אסתטיקה מתקדמת</title>
<meta http-equiv="refresh" content="0; url=/he/">
<link rel="canonical" href="${site.domain}/he/">
<link rel="alternate" hreflang="he" href="${site.domain}/he/">
<link rel="alternate" hreflang="en" href="${site.domain}/en/">
<link rel="alternate" hreflang="x-default" href="${site.domain}/he/">
</head><body><a href="/he/">ענבר בן אדרת — לאתר</a></body></html>`);

/* ---------- _redirects (Cloudflare Pages) ---------- */
const redirects = `# root -> Hebrew default
/ /he/ 301

# old WordPress routes -> new structure (SEO migration)
/clinique/ /he/clinic/ 301
/clinique/treatments/ /he/treatments/ 301
/clinique/articles/ /he/articles/ 301
/clinique/tutorials/ /he/clinic/ 301
/anti-aging/ /he/treatments/anti-aging/ 301
/acne/ /he/treatments/acne/ 301
/microneedling2/ /he/treatments/mesotherapy/ 301
/evoluxproplasma/ /he/academy/ 301
/mesotraining/ /he/academy/ 301
/akne/ /he/articles/acne/ 301
/post-akne/ /he/articles/post-acne/ 301
/pigmentation/ /he/articles/pigmentation/ 301
/face-treatment/ /he/articles/facial-treatment/ 301
/hair-removal/ /he/articles/laser-hair-removal/ 301
/mezoterapia/ /he/articles/mesotherapy/ 301
/hifu/ /he/articles/hifu/ 301
/hederation/ /he/articles/hydration/ 301
/acupuncture/ /he/articles/cosmetic-acupuncture/ 301
/rf/ /he/articles/rf-treatment/ 301
/thank-you/ /he/thank-you/ 301
/%D7%98%D7%99%D7%A4%D7%95%D7%9C-%D7%A4%D7%A0%D7%99%D7%9D-%D7%9E%D7%91%D7%A6%D7%A2/ /he/contact/ 301
/%D7%98%D7%95%D7%A4%D7%A1-%D7%90%D7%91%D7%97%D7%95%D7%9F-%D7%9C%D7%A7%D7%95%D7%97/ /he/contact/ 301

# obsolete shop -> future collection teaser
/shop/ /he/products/ 301
/product/* /he/products/ 301
/product-category/* /he/products/ 301
/product-tag/* /he/products/ 301

# thin archives
/tag/* /he/articles/ 301
/category/* /he/articles/ 301
`;
writeFileSync(join(OUT, '_redirects'), redirects);

/* ---------- sitemap + robots ---------- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.filter(u => u.startsWith('/he/')).map(u => {
  const en = u.replace('/he/', '/en/');
  return `  <url>
    <loc>${site.domain}${u}</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${site.domain}${u}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${site.domain}${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${site.domain}${u}"/>
  </url>
  <url>
    <loc>${site.domain}${en}</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${site.domain}${u}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${site.domain}${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${site.domain}${u}"/>
  </url>`;
}).join('\n')}
</urlset>`;
writeFileSync(join(OUT, 'sitemap.xml'), sitemap);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);

console.log(`Built ${count} pages (${urls.length} routes + 404 + root).`);

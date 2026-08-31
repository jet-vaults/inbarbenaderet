// Layout shell: <head>, header, mobile menu, footer.
// ctx = { lang, dir, ui, site, path, altPath, imgTag, esc, t }
export function layout(ctx, page) {
  const { lang, dir, ui, site, esc, t } = ctx;
  const isHe = lang === 'he';
  const other = isHe ? 'en' : 'he';
  const canonical = site.domain + page.path;
  const altUrl = site.domain + page.altPath;
  const title = esc(page.title);
  const desc = esc(page.description || t(ui.schemaDescription));
  const ogImage = site.domain + (page.ogImage || '/assets/img/clinic-treatment-01-1600.webp');
  const heUrl = isHe ? canonical : altUrl;
  const enUrl = isHe ? altUrl : canonical;

  const navItems = [
    ['clinic', `/${lang}/clinic/`],
    ['treatments', `/${lang}/treatments/`],
    ['articles', `/${lang}/articles/`],
    ['products', `/${lang}/products/`, true],
    ['contact', `/${lang}/contact/`],
  ];
  const navLink = ([key, href, soon]) => {
    const cur = page.navKey === key ? ' aria-current="page"' : '';
    const badge = soon ? `<sup class="nav-badge">${esc(t(ui.nav.comingSoonBadge))}</sup>` : '';
    return `<a href="${href}"${cur}>${esc(t(ui.nav[key]))}${badge}</a>`;
  };

  const jsonLd = page.jsonLd ? page.jsonLd.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n  ') : '';

  const headerMode = page.darkHero ? 'site-header--transparent on-dark' : 'site-header--transparent';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="he" href="${heUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${heUrl}">
  <meta property="og:type" content="${page.ogType || 'website'}">
  <meta property="og:site_name" content="${esc(t(site.brand).name)} · ${esc(t(site.brand).tagline)}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="${isHe ? 'he_IL' : 'en_US'}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon-32.png?v=2" sizes="32x32">
  <link rel="icon" href="/icon-192.png?v=2" sizes="192x192">
  <link rel="apple-touch-icon" href="/icon-192.png?v=2">
  <link rel="preload" href="/assets/fonts/${isHe ? 'assistant-hebrew' : 'marcellus-latin'}.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/assistant-latin.woff2" as="font" type="font/woff2" crossorigin>
  ${page.preload || ''}
  <link rel="stylesheet" href="/assets/css/main.css">
  <noscript><style>.reveal,.stagger>*,.reveal-mask{opacity:1!important;transform:none!important;clip-path:none!important}</style></noscript>
  ${jsonLd}
</head>
<body>
  <a class="skip-link" href="#main">${esc(t(ui.misc.skipToContent))}</a>

  <header class="site-header ${headerMode}">
    <div class="container">
      <a class="site-header__logo" href="/${lang}/" aria-label="${esc(t(site.brand).name)}">
        <img class="logo-dark" src="/assets/img/logo-mark-dark.webp" alt="${esc(t(site.brand).name)} — ${esc(t(site.brand).tagline)}" width="1200" height="106">
        <img class="logo-light" src="/assets/img/logo-mark-light.webp" alt="${esc(t(site.brand).name)} — ${esc(t(site.brand).tagline)}" width="1200" height="106">
      </a>
      <nav class="site-nav" aria-label="${isHe ? 'ניווט ראשי' : 'Main navigation'}">
        ${navItems.map(navLink).join('\n        ')}
      </nav>
      <div style="display:flex;align-items:center;gap:1rem;">
        <a class="lang-switch lang-switch--desktop" href="${page.altPath}" lang="${other}" hreflang="${other}" title="${esc(t(ui.misc.langSwitchLabel))}">${esc(t(ui.misc.langSwitch))}</a>
        <button class="burger" aria-expanded="false" aria-controls="mobile-menu" aria-label="${esc(t(ui.misc.menuOpen))}">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
    <nav aria-label="${isHe ? 'ניווט' : 'Navigation'}">
      <a href="/${lang}/">${esc(t(ui.nav.home))}</a>
      ${navItems.map(([key, href, soon]) =>
        `<a href="${href}">${esc(t(ui.nav[key]))}${soon ? `<sup class="nav-badge">${esc(t(ui.nav.comingSoonBadge))}</sup>` : ''}</a>`).join('\n      ')}
    </nav>
    <div class="mobile-menu__foot">
      <a href="${page.altPath}" lang="${other}">${esc(t(ui.misc.langSwitchLabel))}</a>
      <span>·</span>
      <a href="tel:${site.contact.phoneE164}" class="num">${esc(site.contact.phoneDisplay)}</a>
    </div>
  </div>

  <main id="main">
${page.body}
  </main>

  ${footer(ctx, page)}
  <script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}

function footer(ctx, page) {
  const { lang, ui, site, esc, t } = ctx;
  const isHe = lang === 'he';
  const brand = t(site.brand);
  const addr = t(site.contact.address);
  const wa = `https://wa.me/${site.contact.whatsappE164}?text=${encodeURIComponent(t(site.contact.whatsappGreeting))}`;
  return `<footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div class="site-footer__brand">
          <a href="/${lang}/"><img src="/assets/img/logo-full-light.webp" alt="${esc(brand.name)} — ${esc(brand.tagline)}" width="1400" height="892" loading="lazy" style="height:150px;width:auto"></a>
          <p>${esc(t(ui.schemaDescription))}</p>
        </div>
        <div>
          <h4>${isHe ? 'ניווט' : 'Explore'}</h4>
          <ul>
            <li><a href="/${lang}/">${esc(t(ui.nav.home))}</a></li>
            <li><a href="/${lang}/clinic/">${esc(t(ui.nav.clinic))}</a></li>
            <li><a href="/${lang}/treatments/">${esc(t(ui.nav.treatments))}</a></li>
            <li><a href="/${lang}/articles/">${esc(t(ui.nav.articles))}</a></li>
            <li><a href="/${lang}/products/">${esc(t(ui.nav.products))}</a></li>
            <li><a href="/${lang}/academy/">${esc(t(ui.sections.academy))}</a></li>
          </ul>
        </div>
        <div>
          <h4>${esc(t(ui.sections.contactDetails))}</h4>
          <ul>
            <li><a href="tel:${site.contact.phoneE164}" class="num">${esc(site.contact.phoneDisplay)}</a></li>
            <li><a href="${wa}" target="_blank" rel="noopener">WhatsApp</a></li>
            <li><a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></li>
            <li>${esc(addr.street)}, ${esc(addr.city)}</li>
          </ul>
        </div>
        <div>
          <h4>${esc(t(ui.sections.openingHours))}</h4>
          <ul>
            ${t(site.contact.hours).map(h => `<li>${esc(h.days)} · <span class="num">${esc(h.time)}</span></li>`).join('\n            ')}
          </ul>
          <div style="display:flex;gap:1.2rem;margin-top:1.4rem;">
            <a href="${site.social.instagram}" target="_blank" rel="noopener">Instagram</a>
            <a href="${site.social.facebook}" target="_blank" rel="noopener">Facebook</a>
          </div>
        </div>
      </div>
      <div class="site-footer__bottom">
        <span>© <span class="num">${new Date().getFullYear()}</span> ${esc(brand.name)} · ${esc(t(ui.misc.rights))}</span>
        <span style="display:flex;gap:1.4rem;">
          <a href="/${lang}/accessibility/">${esc(t(ui.misc.accessibility))}</a>
          <a href="/${lang}/privacy/">${esc(t(ui.misc.privacy))}</a>
          <a href="${page.altPath}">${esc(t(ui.misc.langSwitchLabel))}</a>
        </span>
      </div>
    </div>
  </footer>`;
}

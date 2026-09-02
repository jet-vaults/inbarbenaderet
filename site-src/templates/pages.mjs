// All page body templates. Each returns { body, ...meta } consumed by layout().
// ctx = { lang, dir, ui, site, esc, t, img, blocks, treatments, articles, products, testimonials, clinic, academy }

const QUOTE_SVG = `<svg class="quote-mark" viewBox="0 0 44 34" fill="none" aria-hidden="true"><path d="M0 34V20.4C0 8.6 6.9 1.4 18.4 0l1.9 6.1c-6.6 1.6-10 5.2-10.4 10.5H19V34H0Zm25 0V20.4C25 8.6 31.9 1.4 43.4 0l1.9 6.1c-6.6 1.6-10 5.2-10.4 10.5H44V34H25Z" fill="#8B8378"/></svg>`;

const arr = (dir) => dir === 'rtl' ? '←' : '→';

function crumbs(ctx, items) {
  const { lang, ui, esc, t } = ctx;
  const all = [[t(ui.misc.breadcrumbHome), `/${lang}/`], ...items];
  return `<nav class="breadcrumbs" aria-label="breadcrumbs">` +
    all.map(([label, href], i) =>
      href && i < all.length - 1
        ? `<a href="${href}">${esc(label)}</a><span class="sep">/</span>`
        : `<span aria-current="page">${esc(label)}</span>`
    ).join('') + `</nav>`;
}

function treatmentCard(ctx, tr) {
  const { lang, ui, esc, t, img } = ctx;
  const L = t(tr);
  const href = `/${lang}/treatments/${tr.slug}/`;
  return `<a class="card" href="${href}">
    <div class="figure figure--34">${img(tr.image, { alt: '', sizes: '(max-width:900px) 100vw, 33vw', loading: 'lazy' })}</div>
    <div class="card__meta"><span class="num">${esc(tr.num)}</span></div>
    <h3 class="card__title">${esc(L.title)}</h3>
    <p class="card__excerpt">${esc(L.teaser)}</p>
  </a>`;
}

function articleCard(ctx, a) {
  const { lang, ui, esc, t, img } = ctx;
  const L = t(a);
  const href = `/${lang}/articles/${a.slug}/`;
  return `<a class="card" href="${href}">
    <div class="figure figure--34">${img(a.image, { alt: '', sizes: '(max-width:900px) 100vw, 33vw', loading: 'lazy' })}</div>
    <div class="card__meta">${esc(t(ctx.ui.concerns[a.concern] || { he: '', en: '' }))}</div>
    <h3 class="card__title">${esc(L.title)}</h3>
    <p class="card__excerpt">${esc(L.excerpt)}</p>
  </a>`;
}

function ctaBand(ctx, opts = {}) {
  const { lang, ui, site, esc, t } = ctx;
  const wa = `https://wa.me/${site.contact.whatsappE164}?text=${encodeURIComponent(t(site.contact.whatsappGreeting))}`;
  return `<section class="section section--dark">
    <div class="container center reveal">
      <span class="t-overline t-overline--bare" style="color:var(--brand-accent-light)">${esc(opts.overline || t(ui.sections.visitUs))}</span>
      <h2 class="t-h2" style="max-width:20em;margin:1rem auto 0">${esc(opts.title || t(ui.actions.bookConsult))}</h2>
      <div class="hero__ctas" style="justify-content:center;margin-top:2.2rem">
        <a class="btn btn--inverse" href="${wa}" target="_blank" rel="noopener">${esc(t(ui.actions.sendWhatsapp))}</a>
        <a class="btn btn--inverse" href="tel:${site.contact.phoneE164}"><span class="num">${esc(site.contact.phoneDisplay)}</span></a>
      </div>
    </div>
  </section>`;
}

/* ============ HOME ============ */
export function home(ctx) {
  const { lang, dir, ui, site, esc, t, img, treatments, articles, products, testimonials } = ctx;
  const isHe = lang === 'he';
  const brand = t(site.brand);
  const signature = ['anti-aging', 'mesotherapy', 'acne', 'pigmentation', 'hifu', 'rf-treatment']
    .map(s => treatments.find(x => x.slug === s)).filter(Boolean);
  const featured = ['anti-aging', 'mesotherapy', 'pigmentation']
    .map(s => articles.find(x => x.slug === s)).filter(Boolean);
  const facts = t(site.facts);
  const addr = t(site.contact.address);
  const wa = `https://wa.me/${site.contact.whatsappE164}?text=${encodeURIComponent(t(site.contact.whatsappGreeting))}`;

  const heroTitle = isHe
    ? 'עור בריא הוא לא מזל.<br>הוא מקצוע.'
    : 'Healthy skin isn’t luck.<br>It’s a craft.';
  const heroSub = isHe
    ? 'קליניקת בוטיק לאסתטיקה מתקדמת בראשון לציון. למעלה מעשרים שנות התמחות בטיפולי פנים - אבחון מדויק, טכנולוגיה מתקדמת, ויחס שאי אפשר לזייף.'
    : 'A boutique clinic for advanced aesthetics in Rishon LeZion. More than twenty years devoted to facial treatment - precise diagnosis, advanced technology, and care that cannot be faked.';
  const introTitle = isHe
    ? 'קודם מבינים את העור. רק אחר כך מטפלים בו.'
    : 'First, understand the skin. Only then, treat it.';
  const introBody = isHe
    ? 'ב-INBAR Clinic כל מסלול מתחיל באבחון מקצועי ומעמיק, וממשיך בתוכנית טיפול אישית: שילוב מדויק של חומרים פעילים, מכשור מתקדם ושיטת H.D.R הייחודית שפיתחה ענבר - שיטה העובדת על מספר בעיות עור במקביל. בלי פרוטוקולים גנריים, בלי הבטחות ריקות.'
    : 'At INBAR Clinic every journey begins with a deep professional diagnosis, and continues with a personal plan: a precise combination of active ingredients, advanced technology, and Inbar’s signature H.D.R method - addressing several skin concerns in parallel. No generic protocols, no empty promises.';

  const heroInfo = isHe
    ? 'קליניקה לטיפולי יופי ואסתטיקה מתקדמת מזה יותר מעשרים שנה. מגוון רחב של טיפולים מתקדמים לבעיות עור הפנים ולשיפור המראה - עם המכשור המתקדם ביותר ושיטת H.D.R הייחודית שפיתחה ענבר, הנותנת מענה לבעיות האנטי-אייג׳ינג.'
    : 'A clinic for advanced beauty and aesthetic treatment for more than twenty years. A wide range of advanced facial treatments - with the most advanced equipment and Inbar’s signature H.D.R method, answering the concerns of anti-aging.';

  const body = `
  <section class="hero4">
    <div class="container hero4__main">
      <div class="hero4__body">
        <span class="t-overline t-overline--bare">${esc(brand.tagline)} · ${isHe ? 'ראשון לציון' : 'Rishon LeZion'}</span>
        <h1 class="t-display hero4__title">${heroTitle}</h1>
        <p class="hero4__info">${esc(heroInfo)}</p>
        <div class="hero4__ctas">
          <a class="btn btn--light" href="/${lang}/contact/">${esc(t(ui.actions.book))}</a>
          <a class="btn btn--inverse" href="/${lang}/treatments/">${esc(t(ui.actions.exploreTreatments))}</a>
        </div>
      </div>
      <div class="hero4__mark" aria-hidden="true"><img src="/assets/img/logo-full-light.webp" alt="" width="900" height="1281" loading="eager"></div>
    </div>
    <div class="container">
      <div class="hero4__facts">
        ${facts.map(f => `<div><strong class="num">${esc(f.value)}</strong><span>${esc(f.label)}</span></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="ed-row reveal">
        <div class="ed-row__media"><div class="figure figure--45 reveal-mask">${img('placeholder-02', { alt: '', sizes: '(max-width:900px) 100vw, 50vw', loading: 'lazy' })}</div></div>
        <div class="ed-row__body">
          <span class="t-overline">${esc(t(ui.sections.philosophy))}</span>
          <h2 class="t-h2">${esc(introTitle)}</h2>
          <p class="t-muted">${esc(introBody)}</p>
          <p class="mt-3"><a class="link-arrow" href="/${lang}/clinic/">${esc(t(ui.actions.aboutClinic))} <span class="arr">${arr(dir)}</span></a></p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--surface">
    <div class="container">
      <div class="section-head reveal">
        <span class="t-overline">${esc(t(ui.sections.signatureTreatments))}</span>
        <h2 class="t-h2">${isHe ? 'טיפול נכון מתחיל בבחירה נכונה' : 'The right treatment begins with the right choice'}</h2>
      </div>
      <div class="card-grid stagger" style="row-gap:4rem">
        ${signature.map(tr => treatmentCard(ctx, tr)).join('\n')}
      </div>
      <p class="center mt-5 reveal"><a class="btn" href="/${lang}/treatments/">${esc(t(ui.actions.exploreTreatments))}</a></p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-grid__info reveal">
          <span class="t-overline">${esc(t(ui.sections.testimonials))}</span>
          ${QUOTE_SVG}
          <div class="testimonial-stage">
            ${testimonials.map((ts, i) => `<blockquote class="testimonial${i === 0 ? ' is-active' : ''}">
              <p class="testimonial__text">${esc(t(ts).quote)}</p>
              <footer class="testimonial__name">${esc(t(ts).name)}</footer>
            </blockquote>`).join('\n')}
          </div>
          <div class="testimonial-dots" role="tablist">
            ${testimonials.map((ts, i) => `<button role="tab" aria-current="${i === 0}" aria-label="${esc(t(ts).name)}"></button>`).join('')}
          </div>
        </div>
        <div class="contact-grid__aside reveal">
          <div class="figure figure--34 reveal-mask">${img('placeholder-02', { alt: '', sizes: '(max-width:900px) 100vw, 50vw', loading: 'lazy' })}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--surface">
    <div class="container">
      <div class="section-head reveal" style="display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;max-width:none">
        <div>
          <span class="t-overline">${esc(t(ui.misc.fromJournalOverline))}</span>
          <h2 class="t-h2">${esc(t(ui.sections.journal))}</h2>
        </div>
        <a class="link-arrow" href="/${lang}/articles/">${esc(t(ui.actions.allArticles))} <span class="arr">${arr(dir)}</span></a>
      </div>
      <div class="card-grid stagger">
        ${featured.map(a => articleCard(ctx, a)).join('\n')}
      </div>
    </div>
  </section>

  <section class="section section--dark" style="background:var(--brand-ink)">
    <div class="container center reveal">
      <span class="t-overline t-overline--bare" style="color:var(--brand-accent-light)">${esc(t(ui.sections.newChapter))}</span>
      <h2 class="t-display" style="margin-top:1rem">${isHe ? 'Inbar Ben Aderet Skincare' : 'Inbar Ben Aderet Skincare'}</h2>
      <p class="t-lead" style="margin:1.2rem auto 0;max-width:34em;color:var(--brand-inverse-muted)">${esc(t(ui.misc.comingSoonLine))}</p>
      <div class="card-grid stagger" style="margin-top:var(--space-5);text-align:start">
        ${products.map(p => `<a class="product-card" href="/${lang}/products/${p.slug}/">
          <span class="product-card__badge">${esc(t(ui.sections.comingSoon))}</span>
          <div class="figure figure--45"><img src="/assets/img/${p.images[0]}.webp" alt="${esc(t(p).name)}" width="800" height="1000" loading="lazy"></div>
          <div class="card__meta" style="color:var(--brand-accent-light)"><span class="product-card__num num">${p.index}</span></div>
          <h3 class="card__title" style="color:var(--brand-inverse)">${esc(t(p).name)}</h3>
          <p class="card__excerpt" style="color:var(--brand-inverse-muted)">${esc(t(p).subtitle)}</p>
        </a>`).join('\n')}
      </div>
      <p class="mt-5"><a class="btn btn--inverse" href="/${lang}/products/">${esc(t(ui.nav.products))}</a></p>
    </div>
  </section>

  <section class="section" id="visit">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-grid__info reveal">
          <span class="t-overline">${esc(t(ui.sections.visitUs))}</span>
          <h2 class="t-h2" style="margin-top:.9rem">${isHe ? 'מחכות לך בקליניקה' : 'We look forward to seeing you'}</h2>
          <dl class="info-list">
            <div><dt>${esc(t(ui.sections.addressLabel))}</dt><dd>${esc(addr.street)}, ${esc(addr.city)} · <a class="link-arrow" style="padding-bottom:.1rem" href="${site.contact.mapsUrl}" target="_blank" rel="noopener">${esc(t(ui.actions.directions))}</a></dd></div>
            <div><dt>${esc(t(ui.sections.openingHours))}</dt><dd><table class="hours-table">${t(site.contact.hours).map(h => `<tr><td>${esc(h.days)}</td><td class="num">${esc(h.time)}</td></tr>`).join('')}</table></dd></div>
            <div><dt>${esc(t(ui.sections.contactDetails))}</dt><dd><a href="tel:${site.contact.phoneE164}" class="num">${esc(site.contact.phoneDisplay)}</a> · <a href="${wa}" target="_blank" rel="noopener">WhatsApp</a> · <a href="mailto:${site.contact.email}">${esc(site.contact.email)}</a></dd></div>
          </dl>
          <div class="hero__ctas" style="margin-top:2.4rem">
            <a class="btn btn--solid" href="/${lang}/contact/">${esc(t(ui.actions.book))}</a>
          </div>
        </div>
        <div class="contact-grid__aside reveal">
          <div class="figure figure--34 reveal-mask">${img('placeholder-02', { alt: '', sizes: '(max-width:900px) 100vw, 50vw', loading: 'lazy' })}</div>
          <p class="figure__caption">${isHe ? 'INBAR Clinic · ישראל גלילי 7, ראשון לציון' : 'INBAR Clinic · 7 Israel Galili St., Rishon LeZion'}</p>
        </div>
      </div>
    </div>
  </section>`;

  return {
    navKey: 'home', darkHero: true, body,
    title: isHe ? 'ענבר בן אדרת · Skin Science - טיפולי פנים בראשון לציון' : 'Inbar Ben Aderet · Skin Science - Facial Treatments, Rishon LeZion',
    description: t(ui.schemaDescription),
  };
}

/* ============ CLINIC ============ */
export function clinicPage(ctx) {
  const { lang, dir, ui, esc, t, img, clinic, testimonials } = ctx;
  const isHe = lang === 'he';
  const L = t(clinic);
  const body = `
  <section class="page-hero">
    <div class="container">
      ${crumbs(ctx, [[t(ui.nav.clinic)]])}
      <span class="t-overline mt-3" style="margin-top:2rem;display:inline-flex">${esc(L.heroOverline)}</span>
      <h1 class="t-h1">${esc(L.heroTitle)}</h1>
      <p class="t-lead page-hero__lead" style="max-width:38em">${esc(L.heroLead)}</p>
    </div>
  </section>
  <div class="container reveal"><div class="figure figure--169 reveal-mask">${img('placeholder-05', { alt: '', sizes: '(max-width:1280px) 100vw, 1280px', loading: 'eager' })}</div></div>

  <section class="section--tight" style="padding-block:var(--space-6)">
    <div class="container--narrow container">
      ${L.chapters.map((ch, i) => `<section class="chapter reveal">
        <span class="t-overline">${esc(ch.overline)}</span>
        <h2 class="t-h2" style="margin-top:.8rem">${esc(ch.heading)}</h2>
        ${ch.body.map(pp => `<p class="t-muted" style="margin-top:1.1rem">${esc(pp)}</p>`).join('')}
        ${ch.quote ? `<blockquote class="pull-quote">${esc(ch.quote)}</blockquote>` : ''}
      </section>`).join('')}
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      <div class="section-head reveal"><span class="t-overline t-overline--bare" style="color:var(--brand-accent-light)">${esc(t(ui.sections.philosophy))}</span>
      <h2 class="t-h2">${esc(L.philosophyTitle)}</h2></div>
      <div class="card-grid stagger" style="grid-template-columns:repeat(3,1fr);gap:3rem 3.5rem">
        ${L.philosophy.map((p, i) => `<div>
          <span class="t-overline t-overline--bare num" style="color:var(--brand-accent-light)">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="t-h3" style="margin-top:.6rem">${esc(p.heading)}</h3>
          <p class="t-muted" style="margin-top:.5rem;font-size:.98rem">${esc(p.text)}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <span class="t-overline">${esc(t(ui.sections.videos))}</span>
        <h2 class="t-h2">${esc(L.videosLead)}</h2>
      </div>
      <div class="card-grid stagger" style="grid-template-columns:repeat(2,1fr)">
        ${ctx.clinic.videos.map(v => `<figure>
          <video controls preload="none" playsinline poster="${ctx.posterUrl(v.poster)}" style="width:100%;aspect-ratio:16/9;object-fit:cover;background:#000">
            <source src="/assets/video/${v.file}" type="video/mp4">
          </video>
          <figcaption class="figure__caption">${esc(v[lang])}</figcaption>
        </figure>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section section--surface">
    <div class="container reveal">
      <span class="t-overline">${esc(t(ui.sections.testimonials))}</span>
      ${QUOTE_SVG}
      <div class="testimonial-stage">
        ${testimonials.slice(0, 4).map((ts, i) => `<blockquote class="testimonial${i === 0 ? ' is-active' : ''}">
          <p class="testimonial__text">${esc(t(ts).quote)}</p>
          <footer class="testimonial__name">${esc(t(ts).name)}</footer>
        </blockquote>`).join('\n')}
      </div>
      <div class="testimonial-dots" role="tablist">
        ${testimonials.slice(0, 4).map((ts, i) => `<button role="tab" aria-current="${i === 0}" aria-label="${esc(t(ts).name)}"></button>`).join('')}
      </div>
    </div>
  </section>
  ${ctaBand(ctx)}`;

  return {
    navKey: 'clinic', body,
    title: `${esc(L.title)} · ${isHe ? 'ענבר בן אדרת' : 'Inbar Ben Aderet'}`,
    description: L.metaDescription,
  };
}

/* ============ TREATMENTS INDEX ============ */
export function treatmentsIndex(ctx) {
  const { lang, dir, ui, esc, t, img, treatments } = ctx;
  const isHe = lang === 'he';
  const concerns = ['acne', 'pigmentation', 'aging', 'texture-scarring', 'hydration', 'hair-removal'];

  const body = `
  <section class="page-hero">
    <div class="container">
      ${crumbs(ctx, [[t(ui.nav.treatments)]])}
      <span class="t-overline" style="margin-top:2rem;display:inline-flex">${esc(t(ui.nav.treatments))}</span>
      <h1 class="t-h1">${isHe ? 'לכל עור יש סיפור. לכל סיפור יש טיפול.' : 'Every skin has a story. Every story has a treatment.'}</h1>
      <p class="t-lead page-hero__lead" style="max-width:36em">${isHe
        ? 'המסלול הנכון נקבע רק אחרי אבחון אישי - אבל אפשר להתחיל להתרשם. אלו הטיפולים המרכזיים בקליניקה, לפי צורך ולפי שיטה.'
        : 'The right path is set only after a personal diagnosis - but you can begin exploring. These are the clinic’s core treatments, by concern and by method.'}</p>
      <div class="mt-4" style="display:flex;flex-wrap:wrap;gap:.7rem">
        ${concerns.map(c => `<a class="btn" style="padding:.55rem 1.15rem;font-size:.85rem" href="#${c}">${esc(t(ui.concerns[c]))}</a>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section--tight">
    <div class="container">
      <div class="t-index reveal">
        ${treatments.map(tr => `<a class="t-index__item" href="/${lang}/treatments/${tr.slug}/">
          <span class="t-index__num num">${esc(tr.num)}</span>
          <span>
            <span class="t-index__name">${esc(t(tr).title)}</span>
            <span class="t-index__teaser" style="display:block">${esc(t(tr).teaser)}</span>
          </span>
          <span class="t-index__go" aria-hidden="true">${arr(dir)}</span>
        </a>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <span class="t-overline">${esc(t(ui.sections.byConcern))}</span>
        <h2 class="t-h2">${isHe ? 'מה מטריד את העור שלך?' : 'What is your skin telling you?'}</h2>
      </div>
      ${concerns.map(c => {
        const list = treatments.filter(tr => tr.concerns && tr.concerns.includes(c));
        if (!list.length) return '';
        return `<div id="${c}" class="reveal" style="padding-block:2rem;border-top:1px solid var(--brand-border)">
          <div class="ed-row" style="align-items:start">
            <div style="grid-column:1/span 4"><h3 class="t-h3">${esc(t(ui.concerns[c]))}</h3></div>
            <div style="grid-column:5/span 8">
              ${list.map(tr => `<a class="link-arrow" style="display:inline-flex;margin-inline-end:2rem;margin-block:.45rem" href="/${lang}/treatments/${tr.slug}/">${esc(t(tr).title)} <span class="arr">${arr(dir)}</span></a>`).join('')}
            </div>
          </div>
        </div>`;
      }).join('\n')}
    </div>
  </section>
  ${ctaBand(ctx, { title: isHe ? 'לא בטוחה מה מתאים לך? נתחיל באבחון.' : 'Not sure where to begin? Start with a diagnosis.' })}`;

  return {
    navKey: 'treatments', body,
    title: isHe ? 'טיפולים · ענבר בן אדרת - אסתטיקה מתקדמת' : 'Treatments · Inbar Ben Aderet - Advanced Aesthetics',
    description: isHe
      ? 'כל הטיפולים בקליניקת ענבר בן אדרת: אנטי אייג׳ינג, אקנה, פיגמנטציה, מזותרפיה, HIFU, RF ועוד - אחרי אבחון עור אישי ומקצועי.'
      : 'All treatments at the Inbar Ben Aderet clinic: anti-aging, acne, pigmentation, mesotherapy, HIFU, RF and more - following a professional personal skin diagnosis.',
  };
}

/* ============ TREATMENT DETAIL ============ */
export function treatmentDetail(ctx, tr) {
  const { lang, dir, ui, esc, t, img, blocks, treatments, articles } = ctx;
  const isHe = lang === 'he';
  const L = t(tr);
  const related = treatments.filter(x => x.slug !== tr.slug && x.concerns.some(c => tr.concerns.includes(c))).slice(0, 3);
  const relArticle = articles.find(a => a.relatedTreatment === tr.slug || a.slug === tr.slug);

  const body = `
  <section class="page-hero">
    <div class="container">
      ${crumbs(ctx, [[t(ui.nav.treatments), `/${lang}/treatments/`], [L.title]])}
      <div class="ed-row mt-4" style="align-items:end">
        <div class="ed-row__body" style="grid-column:1/span 6;order:1">
          <span class="t-overline"><span class="num">${esc(tr.num)}</span> ${tr.concerns.map(c => esc(t(ui.concerns[c]))).join(' · ')}</span>
          <h1 class="t-h1">${esc(L.title)}</h1>
          <p class="t-lead page-hero__lead">${esc(L.intro)}</p>
          <div class="hero__ctas" style="margin-top:2rem">
            <a class="btn btn--solid" href="/${lang}/contact/">${esc(t(ui.actions.bookConsult))}</a>
          </div>
        </div>
        <div style="grid-column:8/span 5;order:2">
          <div class="figure figure--45 reveal-mask">${img(tr.image, { alt: esc(L.title), sizes: '(max-width:900px) 100vw, 40vw', loading: 'eager' })}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section--tight">
    <div class="container--narrow container prose">
      ${L.sections.map(s => `<section class="reveal"><h2>${esc(s.heading)}</h2>${blocks(s.body)}</section>`).join('\n')}
      ${L.pricing ? `<section class="reveal" style="background:var(--brand-surface-green);padding:2rem 2.2rem;margin-top:3rem">
        <h2 style="margin-top:0">${esc(t(ui.sections.pricing))}</h2>
        <p style="white-space:pre-line">${esc(L.pricing)}</p>
        <p class="t-small t-muted" style="margin-top:.8rem">${esc(t(ui.misc.priceNote))}</p>
      </section>` : ''}
      ${tr.ba && tr.ba.length ? `<section class="reveal" style="margin-top:3rem">
        <h2>${isHe ? 'תוצאות מהקליניקה' : 'Results from the clinic'}</h2>
        <div class="ba-pair" style="margin-top:1.4rem">
          ${tr.ba.map(b => `<figure>${img(b, { alt: isHe ? 'לפני ואחרי - מתוך הקליניקה' : 'Before and after - from the clinic', sizes: '(max-width:560px) 100vw, 400px', loading: 'lazy' })}</figure>`).join('')}
        </div>
        <p class="t-small t-muted" style="margin-top:.8rem">${isHe ? 'תיעוד אותנטי של מטופלות הקליניקה. התוצאות משתנות מאדם לאדם.' : 'Authentic documentation of clinic clients. Results vary from person to person.'}</p>
      </section>` : ''}
      ${L.faq && L.faq.length ? `<section class="faq reveal" style="margin-top:3rem">
        <h2>${esc(t(ui.sections.faq))}</h2>
        ${L.faq.map(f => `<details><summary>${esc(f.q)}</summary><div class="faq__a">${esc(f.a)}</div></details>`).join('\n')}
      </section>` : ''}
      ${relArticle ? `<p class="mt-5 reveal"><span class="t-overline">${esc(t(ui.sections.relatedArticle))}</span><br><a class="link-arrow mt-1" style="margin-top:.7rem" href="/${lang}/articles/${relArticle.slug}/">${esc(t(relArticle).title)} <span class="arr">${arr(dir)}</span></a></p>` : ''}
    </div>
  </section>

  ${related.length ? `<section class="section section--surface">
    <div class="container">
      <div class="section-head reveal"><span class="t-overline">${esc(t(ui.sections.relatedTreatments))}</span></div>
      <div class="card-grid stagger">
        ${related.map(r => `<a class="card" href="/${lang}/treatments/${r.slug}/">
          <div class="figure figure--34">${img(r.image, { alt: '', sizes: '(max-width:900px) 100vw, 33vw', loading: 'lazy' })}</div>
          <div class="card__meta"><span class="num">${esc(r.num)}</span></div>
          <h3 class="card__title">${esc(t(r).title)}</h3>
        </a>`).join('\n')}
      </div>
    </div>
  </section>` : ''}
  ${ctaBand(ctx, { title: isHe ? `רוצה לדעת אם ${L.title} מתאים לעור שלך?` : `Wondering if ${L.title} is right for your skin?` })}`;

  return {
    navKey: 'treatments', body,
    title: `${L.title} · ${isHe ? 'ענבר בן אדרת' : 'Inbar Ben Aderet'}`,
    description: L.metaDescription,
    ogImage: ctx.ogFor(tr.image),
    jsonLdExtra: { breadcrumb: [[t(ui.nav.treatments), `/${lang}/treatments/`], [L.title, `/${lang}/treatments/${tr.slug}/`]] },
  };
}

/* ============ ARTICLES INDEX ============ */
export function articlesIndex(ctx) {
  const { lang, ui, esc, t, articles } = ctx;
  const isHe = lang === 'he';
  const body = `
  <section class="page-hero">
    <div class="container">
      ${crumbs(ctx, [[t(ui.nav.articles)]])}
      <span class="t-overline" style="margin-top:2rem;display:inline-flex">${esc(t(ui.misc.fromJournalOverline))}</span>
      <h1 class="t-h1">${isHe ? 'מאמרים' : 'The Journal'}</h1>
      <p class="t-lead page-hero__lead" style="max-width:36em">${isHe
        ? 'ידע הוא חלק מהטיפול. כאן תמצאו הסברים מקצועיים ומעמיקים על הטיפולים, על העור, ועל מה שקורה בו באמת.'
        : 'Knowledge is part of the treatment. Professional, in-depth writing about treatments, about skin, and about what really happens within it.'}</p>
    </div>
  </section>
  <section class="section--tight" style="padding-bottom:var(--space-6)">
    <div class="container">
      <div class="card-grid stagger" style="row-gap:4rem">
        ${articles.map(a => articleCard(ctx, a)).join('\n')}
      </div>
    </div>
  </section>
  ${ctaBand(ctx)}`;
  return {
    navKey: 'articles', body,
    title: isHe ? 'מאמרים · ענבר בן אדרת' : 'Journal · Inbar Ben Aderet',
    description: isHe
      ? 'מאמרים מקצועיים מאת ענבר בן אדרת: אנטי אייג׳ינג, אקנה, פיגמנטציה, מזותרפיה, HIFU ועוד.'
      : 'Professional articles by Inbar Ben Aderet: anti-aging, acne, pigmentation, mesotherapy, HIFU and more.',
  };
}

/* ============ ARTICLE DETAIL ============ */
export function articleDetail(ctx, a) {
  const { lang, dir, ui, esc, t, img, blocks, articles, treatments } = ctx;
  const isHe = lang === 'he';
  const L = t(a);
  const relTreatment = treatments.find(x => x.slug === (a.relatedTreatment || a.slug));
  const more = articles.filter(x => x.slug !== a.slug).slice(0, 3);

  const body = `
  <section class="page-hero">
    <div class="container--narrow container">
      ${crumbs(ctx, [[t(ui.nav.articles), `/${lang}/articles/`], [L.title]])}
      <span class="t-overline" style="margin-top:2rem;display:inline-flex">${esc(t(ui.concerns[a.concern] || { he: 'מאמר', en: 'Article' }))}</span>
      <h1 class="t-h1">${esc(L.title)}</h1>
      <p class="t-lead page-hero__lead">${esc(L.excerpt)}</p>
    </div>
  </section>
  <div class="container reveal" style="max-width:1080px"><div class="figure figure--169 reveal-mask">${img(a.image, { alt: esc(L.title), sizes: '(max-width:1080px) 100vw, 1080px', loading: 'eager' })}</div></div>
  <article class="section--tight">
    <div class="container--narrow container prose">
      ${blocks(L.body)}
      ${relTreatment ? `<div style="border:1px solid var(--brand-border);padding:1.8rem 2rem;margin-top:3.5rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem">
        <div><span class="t-overline">${esc(t(ui.sections.relatedTreatment || ui.sections.relatedTreatments))}</span>
        <h3 class="t-h3" style="margin-top:.4rem">${esc(t(relTreatment).title)}</h3></div>
        <a class="btn" href="/${lang}/treatments/${relTreatment.slug}/">${esc(t(ui.actions.aboutTreatment))}</a>
      </div>` : ''}
    </div>
  </article>
  <section class="section section--surface">
    <div class="container">
      <div class="section-head reveal"><span class="t-overline">${esc(t(ui.sections.relatedArticles))}</span></div>
      <div class="card-grid stagger">${more.map(m => articleCard(ctx, m)).join('\n')}</div>
    </div>
  </section>
  ${ctaBand(ctx)}`;

  return {
    navKey: 'articles', body, ogType: 'article',
    title: `${L.title} · ${isHe ? 'ענבר בן אדרת' : 'Inbar Ben Aderet'}`,
    description: L.metaDescription,
    ogImage: ctx.ogFor(a.image),
    article: true,
  };
}

/* ============ PRODUCTS ============ */
export function productsIndex(ctx) {
  const { lang, ui, esc, t, products } = ctx;
  const isHe = lang === 'he';
  const body = `
  <section class="section--tight section--dark" style="padding-top:calc(var(--header-h) + var(--space-5));background:var(--brand-ink)">
    <div class="container center">
      <span class="t-overline t-overline--bare" style="color:var(--brand-accent-light)">${esc(t(ui.sections.newChapter))}</span>
      <h1 class="t-display" style="margin-top:1rem">Inbar Ben Aderet Skincare</h1>
      <p class="t-lead" style="margin:1.4rem auto 0;max-width:36em;color:var(--brand-inverse-muted)">${isHe
        ? 'מתוך עשרים שנות עבודה עם עור אמיתי נולדת קולקציה חדשה: הרכבים מדויקים, מרקמים נכונים, ובלי פשרות. ההשקה מתקרבת.'
        : 'Out of twenty years of working with real skin, a new collection is born: precise formulations, the right textures, without compromise. Launch is approaching.'}</p>
    </div>
    <div class="container" style="margin-top:var(--space-5)">
      <div class="card-grid stagger" style="text-align:start">
        ${products.map(p => `<a class="product-card" href="/${lang}/products/${p.slug}/">
          <span class="product-card__badge">${esc(t(ui.sections.comingSoon))}</span>
          <div class="figure figure--45"><img src="/assets/img/${p.images[0]}.webp" alt="${esc(t(p).name)}" width="800" height="1000" loading="lazy"></div>
          <div class="card__meta" style="color:var(--brand-accent-light)"><span class="num">${p.index}</span> · ${esc(p.category)}</div>
          <h2 class="card__title" style="color:var(--brand-inverse)">${esc(t(p).name)}</h2>
          <p class="card__excerpt" style="color:var(--brand-inverse-muted)">${esc(t(p).shortDescription)}</p>
        </a>`).join('\n')}
      </div>
      <p class="center" style="margin-top:var(--space-5);color:var(--brand-inverse-muted);font-size:.9rem">${esc(t(ui.misc.demoNotice))}</p>
    </div>
  </section>
  ${notifySection(ctx)}`;
  return {
    navKey: 'products', darkHero: true, body,
    title: isHe ? 'המוצרים · בקרוב - ענבר בן אדרת' : 'Products · Coming Soon - Inbar Ben Aderet',
    description: isHe ? 'קולקציית הטיפוח של ענבר בן אדרת - בקרוב. הצצה ראשונה למוצרים שבדרך.' : 'The Inbar Ben Aderet skincare collection - coming soon. A first look at what’s ahead.',
  };
}

function notifySection(ctx) {
  const { lang, ui, site, esc, t } = ctx;
  const wa = `https://wa.me/${site.contact.whatsappE164}?text=${encodeURIComponent(t(site.contact.whatsappGreeting))}`;
  return `<section class="section section--green">
    <div class="container center reveal">
      <h2 class="t-h2">${esc(t(ui.actions.notifyMe))}</h2>
      <p class="t-muted" style="max-width:34em;margin:1rem auto 0">${esc(t(ui.misc.notifyLead))}</p>
      <div class="hero__ctas" style="justify-content:center;margin-top:2rem">
        <a class="btn btn--solid" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btn" href="mailto:${site.contact.email}?subject=${encodeURIComponent(lang === 'he' ? 'עדכנו אותי בהשקת הקולקציה' : 'Notify me about the collection launch')}">${esc(site.contact.email)}</a>
      </div>
    </div>
  </section>`;
}

export function productDetail(ctx, p) {
  const { lang, dir, ui, esc, t, products } = ctx;
  const isHe = lang === 'he';
  const L = t(p);
  const others = products.filter(x => x.slug !== p.slug);
  const body = `
  <section class="page-hero" style="padding-bottom:0">
    <div class="container">${crumbs(ctx, [[t(ui.nav.products), `/${lang}/products/`], [L.name]])}</div>
  </section>
  <section class="section--tight">
    <div class="container">
      <div class="ed-row" style="align-items:start">
        <div class="ed-row__media" style="position:relative">
          <span class="product-card__badge">${esc(t(ui.sections.comingSoon))}</span>
          <div class="figure figure--45" style="background:var(--brand-surface)"><img src="/assets/img/${p.images[0]}.webp" alt="${esc(L.name)}" width="800" height="1000"></div>
        </div>
        <div class="ed-row__body">
          <span class="t-overline"><span class="num">${p.index}</span> · ${esc(p.category)} · ${esc(p.size)}</span>
          <h1 class="t-h1" style="font-size:var(--size-h2)">${esc(L.name)}</h1>
          <p class="t-lead" style="margin-top:.6rem">${esc(L.subtitle)}</p>
          <p class="t-muted mt-3">${esc(L.longDescription)}</p>
          <h2 class="t-h3 mt-4">${esc(t(ui.sections.benefits))}</h2>
          <ul class="prose" style="margin-top:.8rem">${L.benefits.map(b => `<li style="position:relative;padding-inline-start:1.2em;margin:.45em 0"><span style="position:absolute;inset-inline-start:0;top:.66em;width:7px;height:7px;background:var(--brand-accent);border-radius:50%"></span>${esc(b)}</li>`).join('')}</ul>
          <dl class="info-list mt-4" style="gap:1.1rem">
            <div><dt>${esc(t(ui.sections.usage))}</dt><dd style="font-size:1rem">${esc(L.usage)}</dd></div>
            <div><dt>${esc(t(ui.sections.ingredients))}</dt><dd style="font-size:1rem">${esc(L.ingredients)}</dd></div>
          </dl>
          <div class="hero__ctas mt-4">
            <span class="btn" style="pointer-events:none;opacity:.55">${esc(t(ui.sections.comingSoon))}</span>
          </div>
          <p class="t-small t-muted mt-2">${esc(t(ui.misc.demoNotice))}</p>
        </div>
      </div>
    </div>
  </section>
  <section class="section section--surface">
    <div class="container">
      <div class="section-head reveal"><span class="t-overline">${isHe ? 'עוד מהקולקציה' : 'More from the collection'}</span></div>
      <div class="card-grid stagger" style="grid-template-columns:repeat(2,1fr)">
        ${others.map(o => `<a class="product-card" href="/${lang}/products/${o.slug}/">
          <span class="product-card__badge">${esc(t(ui.sections.comingSoon))}</span>
          <div class="figure figure--45" style="background:var(--brand-background)"><img src="/assets/img/${o.images[0]}.webp" alt="${esc(t(o).name)}" width="800" height="1000" loading="lazy"></div>
          <h3 class="card__title" style="margin-top:1rem">${esc(t(o).name)}</h3>
        </a>`).join('\n')}
      </div>
    </div>
  </section>
  ${notifySection(ctx)}`;
  return {
    navKey: 'products', body,
    title: L.seoTitle, description: L.seoDescription,
  };
}

/* ============ ACADEMY ============ */
export function academyPage(ctx) {
  const { lang, ui, esc, t, img, blocks, academy } = ctx;
  const isHe = lang === 'he';
  const L = t(academy);
  const body = `
  <section class="page-hero">
    <div class="container">
      ${crumbs(ctx, [[t(ui.sections.academy)]])}
      <span class="t-overline" style="margin-top:2rem;display:inline-flex">${esc(t(ui.sections.academy))}</span>
      <h1 class="t-h1">${esc(L.title)}</h1>
      <p class="t-lead page-hero__lead" style="max-width:38em">${esc(L.intro || '')}</p>
    </div>
  </section>
  <div class="container reveal"><div class="figure figure--169 reveal-mask">${img('placeholder-05', { alt: '', sizes: '(max-width:1280px) 100vw, 1280px', loading: 'eager' })}</div></div>
  <section class="section--tight">
    <div class="container--narrow container prose">
      ${(L.sections || []).map(s => `<section class="reveal"><h2>${esc(s.heading)}</h2>${blocks(s.body)}</section>`).join('\n')}
    </div>
  </section>
  
  ${ctaBand(ctx, { title: isHe ? 'מתעניינת בקורס הבא? דברי איתנו.' : 'Interested in the next course? Talk to us.' })}`;
  return {
    navKey: 'academy', body,
    title: `${L.title} · ${isHe ? 'ענבר בן אדרת' : 'Inbar Ben Aderet'}`,
    description: L.metaDescription,
  };
}

/* ============ CONTACT ============ */
export function contactPage(ctx) {
  const { lang, ui, site, esc, t, img } = ctx;
  const isHe = lang === 'he';
  const addr = t(site.contact.address);
  const wa = `https://wa.me/${site.contact.whatsappE164}?text=${encodeURIComponent(t(site.contact.whatsappGreeting))}`;
  const body = `
  <section class="page-hero">
    <div class="container">
      ${crumbs(ctx, [[t(ui.nav.contact)]])}
      <span class="t-overline" style="margin-top:2rem;display:inline-flex">${esc(t(ui.nav.contact))}</span>
      <h1 class="t-h1">${isHe ? 'הצעד הראשון לעור שאת אוהבת' : 'The first step toward skin you love'}</h1>
      <p class="t-lead page-hero__lead" style="max-width:36em">${isHe
        ? 'קביעת פגישה מתחילה בשיחה קצרה. כתבו לנו בוואטסאפ, התקשרו, או השאירו הודעה במייל - ונחזור אליכם בהקדם.'
        : 'Booking begins with a short conversation. Message us on WhatsApp, call, or write by email - and we will get back to you shortly.'}</p>
      <div class="hero__ctas mt-3">
        <a class="btn btn--solid" href="${wa}" target="_blank" rel="noopener">${esc(t(ui.actions.sendWhatsapp))}</a>
        <a class="btn" href="tel:${site.contact.phoneE164}"><span class="num">${esc(site.contact.phoneDisplay)}</span></a>
        <a class="btn" href="mailto:${site.contact.email}">${esc(site.contact.email)}</a>
      </div>
    </div>
  </section>
  <section class="section--tight" style="padding-bottom:var(--space-6)">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-grid__info reveal">
          <dl class="info-list">
            <div><dt>${esc(t(ui.sections.addressLabel))}</dt><dd>${esc(addr.street)}, ${esc(addr.city)}<br><a class="link-arrow" style="margin-top:.6rem" href="${site.contact.mapsUrl}" target="_blank" rel="noopener">${esc(t(ui.actions.directions))} <span class="arr">${arr(ctx.dir)}</span></a></dd></div>
            <div><dt>${esc(t(ui.sections.openingHours))}</dt><dd><table class="hours-table">${t(site.contact.hours).map(h => `<tr><td>${esc(h.days)}</td><td class="num">${esc(h.time)}</td></tr>`).join('')}</table></dd></div>
            <div><dt>Instagram</dt><dd><a class="num" href="${site.social.instagram}" target="_blank" rel="noopener">@inbar_benaderet</a></dd></div>
          </dl>
        </div>
        <div class="contact-grid__aside reveal">
          <div class="figure figure--34 reveal-mask">${img('placeholder-02', { alt: '', sizes: '(max-width:900px) 100vw, 50vw', loading: 'lazy' })}</div>
          <p class="figure__caption">INBAR Clinic · ${esc(addr.street)}, ${esc(addr.city)}</p>
        </div>
      </div>
    </div>
  </section>`;
  return {
    navKey: 'contact', body,
    title: isHe ? 'יצירת קשר · ענבר בן אדרת' : 'Contact · Inbar Ben Aderet',
    description: isHe
      ? `קביעת פגישה בקליניקת ענבר בן אדרת: ${addr.street}, ${addr.city}. טלפון ${site.contact.phoneDisplay}.`
      : `Book an appointment at the Inbar Ben Aderet clinic: ${addr.street}, ${addr.city}. Phone ${site.contact.phoneDisplay}.`,
  };
}

/* ============ SIMPLE PAGES ============ */
export function simplePage(ctx, { navKey, title, lead, content }) {
  const { lang, ui, esc, t } = ctx;
  const body = `
  <section class="page-hero">
    <div class="container--narrow container">
      ${crumbs(ctx, [[title]])}
      <h1 class="t-h1" style="margin-top:2rem">${esc(title)}</h1>
      ${lead ? `<p class="t-lead page-hero__lead">${esc(lead)}</p>` : ''}
    </div>
  </section>
  <section class="section--tight" style="padding-bottom:var(--space-6)">
    <div class="container--narrow container prose">${content}</div>
  </section>`;
  return { navKey: navKey || '', body, title: `${title} · ${lang === 'he' ? 'ענבר בן אדרת' : 'Inbar Ben Aderet'}`, description: lead || title };
}

export function notFound(ctx) {
  const { lang, ui, esc, t } = ctx;
  const body = `
  <section class="section" style="padding-top:calc(var(--header-h) + var(--space-6));min-height:70vh">
    <div class="container center">
      <span class="t-overline t-overline--bare num">404</span>
      <h1 class="t-h1" style="margin-top:1rem">${esc(t(ui.misc.notFoundTitle))}</h1>
      <p class="t-muted" style="margin-top:1rem">${esc(t(ui.misc.notFoundText))}</p>
      <p class="mt-4"><a class="btn btn--solid" href="/${lang}/">${esc(t(ui.misc.notFoundCta))}</a></p>
    </div>
  </section>`;
  return { navKey: '', body, title: `404 · ${t(ui.misc.notFoundTitle)}`, description: t(ui.misc.notFoundText) };
}

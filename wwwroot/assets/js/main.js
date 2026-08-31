/* INBAR — Advanced Aesthetics · interactions
   Header state, mobile menu, scroll reveals, gentle hero parallax,
   testimonial rotation. No dependencies. Respects prefers-reduced-motion. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector('.burger');
  if (burger) {
    var menu = document.querySelector('.mobile-menu');
    var setOpen = function (open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (menu) menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    };
    burger.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('menu-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setOpen(false); burger.focus(); }
    });
    if (menu) menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
  }

  /* ---------- reveals ---------- */
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal, .reveal-mask, .stagger').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal, .reveal-mask, .stagger').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- hero parallax (desktop pointers only) ---------- */
  var heroImg = document.querySelector('.hero__media img');
  if (heroImg && !reduced && window.matchMedia('(pointer: fine)').matches) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, window.innerHeight);
        heroImg.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- testimonials rotation ---------- */
  var stage = document.querySelector('.testimonial-stage');
  if (stage) {
    var items = stage.querySelectorAll('.testimonial');
    var dots = document.querySelectorAll('.testimonial-dots button');
    var idx = 0, timer = null;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      items.forEach(function (it, j) { it.classList.toggle('is-active', j === idx); });
      dots.forEach(function (d, j) { d.setAttribute('aria-current', j === idx ? 'true' : 'false'); });
    };
    var start = function () {
      if (reduced || items.length < 2) return;
      timer = setInterval(function () { show(idx + 1); }, 8000);
    };
    dots.forEach(function (d, j) {
      d.addEventListener('click', function () { clearInterval(timer); show(j); start(); });
    });
    show(0); start();
  }
})();

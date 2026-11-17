/* =========================================================
   Palmera Beach Hotel — interacciones y animaciones
   ========================================================= */
(function () {
  'use strict';

  var WA_NUMBER = '573161002891';        // WhatsApp del hotel
  var HOTEL = 'Palmera Beach Hotel';
  var DICT = window.PALMERA_I18N || { es: {}, en: {} };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';
  var lang = 'es';

  if (hasGSAP && typeof window.ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  document.documentElement.classList.add('js-ready');
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function t(key) {
    return (DICT[lang] && DICT[lang][key]) || (DICT.es && DICT.es[key]) || '';
  }

  /* =========================================================
     1. Idioma (ES / EN)
     ========================================================= */
  var wordTriggers = [];

  function applyLang(next, skipStore) {
    if (!DICT[next]) return;
    lang = next;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (!v) return;
      if (el.tagName === 'META') el.setAttribute('content', v);
      else el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'));
      if (v) el.innerHTML = v;
    });

    document.documentElement.lang = next === 'es' ? 'es-CO' : 'en';
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === next);
    });

    if (!skipStore) {
      try { localStorage.setItem('palmera-lang', next); } catch (e) {}
    }
    setupWordReveal();
  }

  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });

  var stored = null;
  try { stored = localStorage.getItem('palmera-lang'); } catch (e) {}
  var initial = stored;
  if (!initial) {
    initial = (navigator.language || 'es').slice(0, 2).toLowerCase() === 'en' ? 'en' : 'es';
  }
  applyLang(initial, !stored);

  /* =========================================================
     2. Header
     ========================================================= */
  var header = document.getElementById('header');
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 40);
    if (y > 420 && y > lastY + 6) header.classList.add('is-hidden');
    else if (y < lastY - 6) header.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* =========================================================
     3. Menú a pantalla completa
     ========================================================= */
  var menu = document.getElementById('menu');
  var burger = document.getElementById('burger');
  var menuClose = document.getElementById('menu-close');
  var menuItems = menu ? menu.querySelectorAll('.menu-nav a, .menu-foot > *') : [];
  var menuOpen = false;
  var menuTl = null;

  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    menu.hidden = false;
    document.body.classList.add('no-scroll');
    burger.setAttribute('aria-expanded', 'true');
    header.classList.remove('is-hidden');

    if (hasGSAP && !reduced) {
      if (menuTl) menuTl.kill();
      menuTl = gsap.timeline();
      menuTl
        .fromTo('.menu-bg', { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0% 0 0% 0)', duration: .8, ease: 'power4.inOut' })
        .fromTo('.menu-top', { opacity: 0 }, { opacity: 1, duration: .4 }, .3)
        .fromTo(menu.querySelectorAll('.menu-nav a'),
          { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: .75, stagger: .07, ease: 'power3.out' }, .34)
        .fromTo(menu.querySelectorAll('.menu-foot > *'),
          { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .07, ease: 'power2.out' }, .6);
    } else {
      menu.classList.add('is-open');
    }
    setTimeout(function () { menuClose.focus(); }, 60);
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');

    function done() { menu.hidden = true; menu.classList.remove('is-open'); }

    if (hasGSAP && !reduced) {
      if (menuTl) menuTl.kill();
      menuTl = gsap.timeline({ onComplete: done });
      menuTl
        .to(menu.querySelectorAll('.menu-nav a, .menu-foot > *, .menu-top'),
          { opacity: 0, duration: .25, stagger: .02 })
        .to('.menu-bg', { clipPath: 'inset(0 0 100% 0)', duration: .6, ease: 'power4.inOut' }, .1);
    } else {
      done();
    }
    burger.focus();
  }

  if (burger) burger.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menu) {
    menu.querySelectorAll('[data-menu-close]').forEach(function (el) {
      el.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  /* =========================================================
     4. Enlace activo
     ========================================================= */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* =========================================================
     5. WhatsApp
     ========================================================= */
  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function formatDate(v) {
    if (!v) return null;
    var p = v.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : v;
  }
  function guests() {
    var g = document.getElementById('huespedes');
    return g ? g.value : '2';
  }
  // Mensaje: servicio + personas (+ fechas si las eligieron)
  function quoteMessage(service, withDates) {
    var msg = t('wa.greeting') + '\n';
    msg += '• ' + t('wa.service') + ': ' + service + '\n';
    if (withDates) {
      var a = formatDate(document.getElementById('llegada').value);
      var b = formatDate(document.getElementById('salida').value);
      if (a || b) msg += '• ' + t('wa.dates') + ': ' + (a || t('wa.tbd')) + ' ' + t('wa.to') + ' ' + (b || t('wa.tbd')) + '\n';
    }
    msg += '• ' + t('wa.people') + ': ' + guests();
    return msg;
  }

  var form = document.getElementById('booking-form');
  var dateWrap = document.querySelector('.booking-dates');
  var llegada = document.getElementById('llegada');
  var salida = document.getElementById('salida');

  function syncDates() {
    if (!dateWrap) return;
    dateWrap.classList.toggle('is-filled', !!(llegada.value || salida.value));
    if (llegada.value) salida.min = llegada.value;
  }
  if (llegada && salida) {
    var today = new Date().toISOString().slice(0, 10);
    llegada.min = today; salida.min = today;
    llegada.addEventListener('change', syncDates);
    salida.addEventListener('change', syncDates);
    syncDates();
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var sel = document.getElementById('plan');
      var opt = sel.options[sel.selectedIndex] || sel.options[0];
      var service = opt ? opt.textContent.trim() : sel.value;
      window.open(waLink(quoteMessage(service, true)), '_blank', 'noopener');
    });
  }

  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var topic = el.getAttribute('data-wa');
      var msg = topic === 'Restaurante' ? t('wa.menu') : quoteMessage(topic, false);
      window.open(waLink(msg), '_blank', 'noopener');
    });
  });

  var waFloat = document.getElementById('wa-float');
  if (waFloat) {
    waFloat.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(waLink(t('wa.float')), '_blank', 'noopener');
    });
  }

  /* =========================================================
     6. Carrusel del hero
     ========================================================= */
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var texts = Array.prototype.slice.call(document.querySelectorAll('.hero-text'));
  var heroDots = document.getElementById('hero-dots');
  var hIndex = 0, hTimer = null;

  function goSlide(i) {
    hIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === hIndex); });
    texts.forEach(function (x, n) { x.classList.toggle('is-active', n === hIndex); });
    if (heroDots) {
      Array.prototype.slice.call(heroDots.children).forEach(function (d, n) {
        d.classList.toggle('is-active', n === hIndex);
      });
    }
    if (hasGSAP && !reduced) {
      var line = texts[hIndex].querySelector('.hero-title .line > span');
      if (line) gsap.fromTo(line, { y: '105%' }, { y: '0%', duration: 1.1, ease: 'expo.out' });
      gsap.fromTo(texts[hIndex].querySelectorAll('.hero-kicker, .hero-lead'),
        { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .08, ease: 'power2.out', delay: .1 });
    }
  }
  function heroTimer() {
    clearInterval(hTimer);
    if (reduced || slides.length < 2) return;
    hTimer = setInterval(function () { goSlide(hIndex + 1); }, 6500);
  }

  if (heroDots && slides.length > 1) {
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', function () { goSlide(i); heroTimer(); });
      heroDots.appendChild(b);
    });
    heroTimer();
  }

  /* =========================================================
     7. Pestañas de planes
     ========================================================= */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.plan-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.plan-panel'));

  function showPanel(index) {
    tabs.forEach(function (tb, i) {
      tb.classList.toggle('is-active', i === index);
      tb.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    panels.forEach(function (p, i) {
      if (i === index) {
        p.hidden = false; p.classList.add('is-active');
        if (hasGSAP && !reduced) gsap.fromTo(p, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .5, ease: 'power2.out' });
      } else {
        p.hidden = true; p.classList.remove('is-active');
      }
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { showPanel(i); });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = (i + dir + tabs.length) % tabs.length;
      tabs[next].focus(); showPanel(next);
    });
  });

  /* =========================================================
     8. Carrusel "Los espacios"
     ========================================================= */
  var track = document.getElementById('spaces-track');
  var prevBtn = document.getElementById('sp-prev');
  var nextBtn = document.getElementById('sp-next');

  if (track) {
    var step = function () {
      var card = track.querySelector('.space-card');
      return card ? card.getBoundingClientRect().width + 20 : 320;
    };
    var updateArrows = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
      if (nextBtn) nextBtn.disabled = track.scrollLeft >= max;
    };
    if (prevBtn) prevBtn.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (nextBtn) nextBtn.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    updateArrows();

    var down = false, startX = 0, startScroll = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true; startX = e.clientX; startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      track.scrollLeft = startScroll - (e.clientX - startX);
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false; track.classList.remove('is-dragging'); updateArrows();
    });
  }

  /* =========================================================
     9. Carrusel de reseñas
     ========================================================= */
  var reviews = Array.prototype.slice.call(document.querySelectorAll('.review'));
  var dotsWrap = document.getElementById('review-dots');
  var rIndex = 0, rTimer = null;

  if (reviews.length > 1 && dotsWrap) {
    reviews.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Review ' + (i + 1));
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', function () { goReview(i); restartReviews(); });
      dotsWrap.appendChild(b);
    });
    var rDots = Array.prototype.slice.call(dotsWrap.children);

    function goReview(i) {
      rIndex = i;
      reviews.forEach(function (r, n) { r.classList.toggle('is-active', n === i); });
      rDots.forEach(function (d, n) { d.classList.toggle('is-active', n === i); });
    }
    function restartReviews() {
      clearInterval(rTimer);
      if (reduced) return;
      rTimer = setInterval(function () { goReview((rIndex + 1) % reviews.length); }, 6500);
    }
    restartReviews();
    var stage = document.getElementById('reviews-stage');
    stage.addEventListener('mouseenter', function () { clearInterval(rTimer); });
    stage.addEventListener('mouseleave', restartReviews);
  }

  /* =========================================================
     10. Títulos que se pintan palabra por palabra
     ========================================================= */
  function setupWordReveal() {
    if (!hasGSAP || reduced) return;
    wordTriggers.forEach(function (st) { st.kill(); });
    wordTriggers = [];

    document.querySelectorAll('.words-reveal').forEach(function (title) {
      if (title.querySelector('.w')) return;
      title.innerHTML = title.innerHTML
        .split(/(<br\s*\/?>)/i)
        .map(function (chunk) {
          if (/^<br/i.test(chunk)) return chunk;
          return chunk.split(/\s+/).filter(Boolean)
            .map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
        }).join('');

      var tw = gsap.to(title.querySelectorAll('.w'), {
        color: getComputedStyle(title).getPropertyValue('color'),
        stagger: .9, ease: 'none',
        scrollTrigger: { trigger: title, start: 'top 88%', end: 'top 42%', scrub: true }
      });
      if (tw.scrollTrigger) wordTriggers.push(tw.scrollTrigger);
    });
  }

  /* =========================================================
     11. Animaciones con GSAP
     ========================================================= */
  if (!hasGSAP) {
    document.querySelectorAll('.reveal-up').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    document.documentElement.classList.remove('js-ready');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (reduced) {
    gsap.set('.reveal-up, .about-img, .space-card, .g-item, .plans-right, .location-map', { opacity: 1, y: 0, clearProps: 'all' });
    gsap.set('.hero-title .line > span', { y: 0 });
    return;
  }

  // Hero
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero .eyebrow', { opacity: 1, y: 0, duration: .9 }, .15)
    .fromTo('.hero-text.is-active .hero-title .line > span', { y: '105%' }, { y: '0%', duration: 1.25, ease: 'expo.out' }, .2)
    .fromTo('.hero-text.is-active .hero-kicker', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8 }, .25)
    .fromTo('.hero-text.is-active .hero-lead', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9 }, .7)
    .to('.hero-actions', { opacity: 1, y: 0, duration: .9 }, .85)
    .from('.hero-dots button', { opacity: 0, y: 10, duration: .6, stagger: .06 }, 1)
    .from('.booking', { opacity: 0, y: 34, duration: 1 }, 1)
    .from('.features li', { opacity: 0, y: 18, duration: .8, stagger: .07 }, 1.2);

  gsap.to('.hero-slide img', {
    scale: 1.16, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  gsap.utils.toArray('.reveal-up').forEach(function (el) {
    if (el.closest('.hero')) return;
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  setupWordReveal();

  gsap.utils.toArray('.about-img').forEach(function (fig, i) {
    gsap.to(fig, { opacity: 1, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: fig, start: 'top 90%' } });
    gsap.from(fig.querySelector('img'), { scale: 1.18, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: fig, start: 'top 90%' } });
    gsap.to(fig, {
      yPercent: i === 0 ? -7 : 7, ease: 'none',
      scrollTrigger: { trigger: '.about-media', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  gsap.set('.space-card', { y: 30 });
  gsap.to('.space-card', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.spaces-track', start: 'top 88%' } });

  gsap.set('.plans-right', { y: 34 });
  gsap.to('.plans-right', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.plans-right', start: 'top 85%' } });

  gsap.to('.resto-media', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.resto', start: 'top bottom', end: 'bottom top', scrub: true } });

  gsap.set('.g-item', { y: 26 });
  gsap.to('.g-item', { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: '.gallery-grid', start: 'top 88%' } });

  gsap.set('.location-map', { y: 30 });
  gsap.to('.location-map', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.location-map', start: 'top 88%' } });

  ScrollTrigger.refresh();
})();

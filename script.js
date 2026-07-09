/* =========================================================
   Abhishek Gupta — Motion system (vanilla + GSAP if present)
   ========================================================= */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Showcase rendering (clients / study abroad / colleges) ---------- */
  (function renderShowcases() {
    const PD = window.PD;
    if (!PD) return;
    const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
    function logoTile(cls, src, abbr, name) {
      const tile = mk('span', cls);
      if (src) {
        const img = new Image();
        img.src = src; img.alt = name || ''; img.loading = 'lazy'; img.decoding = 'async';
        img.onerror = () => { tile.classList.add('is-mono'); tile.textContent = abbr; };
        tile.appendChild(img);
      } else { tile.classList.add('is-mono'); tile.textContent = abbr; }
      return tile;
    }
    const initials = (n) => (n.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('') || '?').toUpperCase();

    // Builders -------------------------------------------------------------
    // Logo chip (favicon for study via domain, local/monogram for colleges)
    function chipFor(item, mods) {
      const chip = mk('span', 'lchip' + (mods || ''));
      const src = item.domain ? ('https://www.google.com/s2/favicons?domain=' + item.domain + '&sz=128') : item.logo;
      chip.appendChild(logoTile('lchip__logo', src, item.abbr, item.name));
      chip.appendChild(mk('span', 'lchip__name', item.name));
      return chip;
    }
    // Full client card (big logo + name + tag) — for the 360° clients marquee
    function clientCard(item) {
      const card = mk('div', 'client-card');
      card.appendChild(logoTile('client-card__logo', item.logo, initials(item.name), item.name));
      const meta = mk('div', 'client-card__meta');
      meta.appendChild(mk('span', 'client-card__name', item.name));
      meta.appendChild(mk('span', 'client-card__tag', '360° marketing'));
      card.appendChild(meta);
      return card;
    }
    // Slow scrolling marquee, distributed across rows. speed = seconds per item (higher = slower).
    function buildMarquee(container, items, rows, speed, mods, builder) {
      builder = builder || chipFor;
      const buckets = Array.from({ length: rows }, () => []);
      items.forEach((c, i) => buckets[i % rows].push(c));
      buckets.forEach((bucket, ri) => {
        const m = mk('div', 'marquee' + (ri % 2 ? ' marquee--rev' : '')); m.setAttribute('data-marquee', '');
        const dur = Math.round(bucket.length * speed) + 's';
        [false, true].forEach((hidden) => {
          const tr = mk('div', 'marquee__track'); if (hidden) tr.setAttribute('aria-hidden', 'true');
          bucket.forEach((c) => tr.appendChild(builder(c, mods)));
          tr.style.animationDuration = dur;
          m.appendChild(tr);
        });
        container.appendChild(m);
      });
    }

    // Section 1 — 360° clients (slow marquee, 1 row, full cards)
    const cg = $('[data-grid="clients"]');
    if (cg) buildMarquee(cg, PD.clients, 1, 3.6, '', clientCard);

    // Section 2 — study abroad (slow marquee, 2 rows)
    const sg = $('[data-grid="study"]');
    if (sg) buildMarquee(sg, PD.study, 3, 2.6, '');

    // Section 3 — colleges: only the Top 20 on the homepage (bigger chips, 2 rows).
    // The full 307-college list lives on the dedicated /colleges page.
    const cm = $('[data-grid="colleges"]');
    const topColleges = (PD.collegesTop && PD.collegesTop.length)
      ? PD.collegesTop
      : PD.colleges.filter((c) => c.logo).slice(0, 20);
    if (cm) buildMarquee(cm, topColleges, 2, 3.6, ' lchip--lg');

    // Tools stack — static wrap grid (favicon + monogram fallback)
    const TOOLS = [
      { name: 'Meta Ads', logo: 'assets/logos/tools/meta.svg', abbr: 'M' },
      { name: 'Google Ads', logo: 'assets/logos/tools/googleads.svg', abbr: 'GA' },
      { name: 'Google Analytics 4', logo: 'assets/logos/tools/ga4.svg', abbr: 'GA4' },
      { name: 'Google Tag Manager', logo: 'assets/logos/tools/gtm.svg', abbr: 'GTM' },
      { name: 'Looker Studio', logo: 'assets/logos/tools/looker.svg', abbr: 'LS' },
      { name: 'Supermetrics', domain: 'supermetrics.com', abbr: 'SM' },
      { name: 'Zapier', logo: 'assets/logos/tools/zapier.svg', abbr: 'Z' },
      { name: 'Maglo CRM', logo: 'assets/logos/maglo.webp', abbr: 'MG' },
      { name: 'Claude AI', logo: 'assets/logos/tools/claude.svg', abbr: 'C' },
      { name: 'ChatGPT', logo: 'assets/logos/tools/openai.svg', abbr: 'GP' },
      { name: 'Google Sheets', logo: 'assets/logos/tools/sheets.svg', abbr: 'GS' }
    ];
    const tg = $('[data-grid="tools"]');
    if (tg) TOOLS.forEach((t, i) => {
      const card = mk('div', 'tool reveal'); card.setAttribute('data-tilt', '');
      card.setAttribute('data-reveal', ''); card.setAttribute('data-reveal-delay', String(i * 60));
      const src = t.domain ? ('https://www.google.com/s2/favicons?domain=' + t.domain + '&sz=128') : t.logo;
      card.appendChild(logoTile('tool__logo', src, t.abbr, t.name));
      card.appendChild(mk('span', 'tool__name', t.name));
      tg.appendChild(card);
    });
  })();

  /* ---------- Floating client-logo bubbles around the contact CTA ----------
     (Bynetic-style: real client logos drifting in white circles) ---------- */
  (function bubbles() {
    const sec = document.getElementById('contact');
    if (!sec) return;
    // [logo, left%, top%, size(px), duration(s), hot]
    const B = [
      ['assets/logos/study/leverage-edu.webp', 5, 12, 86, 9.5],
      ['assets/logos/study/edvoy.webp', 14, 52, 60, 8],
      ['assets/logos/study/aecc-india.webp', 6, 80, 74, 11],
      ['assets/logos/study/tc-global.webp', 26, 7, 56, 7.5],
      ['assets/logos/makunai.webp', 66, 5, 52, 10],
      ['assets/logos/study/santamonica-study-abroad.webp', 88, 12, 78, 9],
      ['assets/logos/study/si-uk.webp', 91, 66, 88, 10.5, true],
      ['assets/logos/study/global-tree-careers.webp', 95, 40, 60, 8.5],
      ['assets/logos/collegehai.webp', 30, 88, 64, 9.8],
      ['assets/logos/study/unischolarz.webp', 71, 89, 58, 7.8],
    ];
    const field = document.createElement('div');
    field.className = 'bubble-field'; field.setAttribute('aria-hidden', 'true');
    B.forEach((b, i) => {
      const el = document.createElement('span');
      el.className = 'bubble' + (b[5] ? ' bubble--hot' : '');
      el.style.cssText = `left:${b[1]}%;top:${b[2]}%;width:${b[3]}px;height:${b[3]}px;--fd:${b[4]}s;--fdel:${-(i * 1.3)}s`;
      el.setAttribute('data-reveal', ''); el.setAttribute('data-reveal-delay', String(i * 90));
      const img = new Image();
      img.src = b[0]; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
      img.onerror = () => el.remove();
      el.appendChild(img);
      field.appendChild(el);
    });
    sec.prepend(field);
  })();

  /* ---------- Loading screen ---------- */
  (function loader() {
    const el = $('#loader'), bar = $('#loaderBar'), pct = $('#loaderPct');
    if (!el) return;
    let p = 0;
    const tick = () => {
      p = Math.min(100, p + Math.random() * 18 + 6);
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = Math.round(p) + '%';
      if (p < 100) setTimeout(tick, 120);
      else setTimeout(() => { el.classList.add('is-done'); document.body.classList.add('loaded'); startHero(); }, 280);
    };
    if (reduce) { el.classList.add('is-done'); document.body.classList.add('loaded'); startHero(); }
    else setTimeout(tick, 200);
  })();

  /* ---------- Typed engine (reusable) ---------- */
  function makeTyped(el) {
    const phrases = (el.dataset.typed || '').split('|').filter(Boolean);
    if (!phrases.length) return;
    if (reduce) { el.textContent = phrases[0]; return; }
    let pi = 0, ci = 0, deleting = false;
    (function step() {
      const w = phrases[pi];
      el.textContent = w.slice(0, ci);
      if (!deleting && ci < w.length) { ci++; setTimeout(step, 42 + Math.random() * 38); }
      else if (!deleting && ci === w.length) { deleting = true; setTimeout(step, 1700); }
      else if (deleting && ci > 0) { ci--; setTimeout(step, 22); }
      else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(step, 320); }
    })();
  }

  /* ---------- Hero entrance (called after loader) ---------- */
  let heroStarted = false;
  function startHero() {
    if (heroStarted) return; heroStarted = true;
    $$('.hero__title .line').forEach((l, i) => setTimeout(() => l.classList.add('is-in'), 120 + i * 110));
    $$('.hero [data-reveal]').forEach((el) => {
      const d = parseInt(el.dataset.revealDelay || '0', 10);
      setTimeout(() => el.classList.add('is-in'), 300 + d);
    });
    setTimeout(() => $$('.typed').forEach(makeTyped), 700);
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('[data-reveal]').filter((el) => !el.closest('.hero'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const d = parseInt(e.target.dataset.revealDelay || '0', 10);
        setTimeout(() => e.target.classList.add('is-in'), d);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else revealEls.forEach((el) => el.classList.add('is-in'));

  /* ---------- Count-up ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
    if (reduce || isNaN(target)) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
    const dur = 1500, t0 = performance.now();
    (function frame(now) {
      const p = Math.min((now - t0) / dur, 1);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = prefix + v.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    })(performance.now());
  }
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  } else counters.forEach(animateCount);

  /* ---------- 3D tilt + spotlight ---------- */
  if (!reduce && fine) {
    $$('[data-tilt]').forEach((card) => {
      const max = card.classList.contains('portrait') ? 9 : 6;
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-4px)`;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduce && fine) {
    $$('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .28}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Cursor-follow glow + precision dot ---------- */
  if (!reduce && fine) {
    const glow = $('#cursorGlow');
    const dot = document.createElement('div');
    dot.className = 'cursor-dot'; dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    let gx = 0, gy = 0, cx = 0, cy = 0, raf;
    window.addEventListener('pointermove', (e) => {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add('is-on'); dot.classList.add('is-on');
      dot.classList.toggle('is-link', !!(e.target.closest && e.target.closest('a,button,.lchip,.client-card,.tool,.team,.cap,.cstudy')));
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    function loop() {
      cx += (gx - cx) * .15; cy += (gy - cy) * .15;
      glow.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      dot.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%)`;
      raf = (Math.abs(gx - cx) > .5 || Math.abs(gy - cy) > .5) ? requestAnimationFrame(loop) : null;
    }
    document.addEventListener('pointerleave', () => { glow.classList.remove('is-on'); dot.classList.remove('is-on'); });
  }

  /* ---------- Nav + progress + scrollspy + dock ---------- */
  const nav = $('#nav'), progress = $('#progressBar'), dock = $('#dock');
  const spyLinks = $$('[data-spy]');
  const sectionIds = [...new Set(spyLinks.map((a) => a.dataset.spy))].filter((id) => id !== 'top');
  const sections = sectionIds.map((id) => $('#' + id)).filter(Boolean);

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    dock.classList.toggle('is-on', y > 360);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    let current = '';
    const mid = y + window.innerHeight * 0.35;
    sections.forEach((sec) => { if (sec.offsetTop <= mid) current = sec.id; });
    spyLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.spy === current));
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ---------- Smooth anchors ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id === '#top') { if (id === '#top') { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); } return; }
      const t = $(id); if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---------- Parallax via --py on the CSS `translate` property ----------
     (keyframe animations use `transform`; we use `translate` so they compose
      instead of fighting each other) ---------- */
  const parallaxEls = $$('[data-parallax]');
  if (!reduce && parallaxEls.length) {
    parallaxEls.forEach((el) => { el.style.translate = '0 var(--py, 0px)'; });
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      parallaxEls.forEach((el) => {
        const dist = (parseFloat(el.dataset.parallax) || .2) * 320;
        gsap.to(el, {
          '--py': -dist + 'px', ease: 'none',
          scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom top', scrub: true }
        });
      });
    } else {
      let pr;
      const apply = () => {
        const y = window.scrollY;
        parallaxEls.forEach((el) => {
          const s = parseFloat(el.dataset.parallax) || .2;
          el.style.setProperty('--py', (-y * s * 0.22) + 'px');
        });
        pr = null;
      };
      window.addEventListener('scroll', () => { if (!pr) pr = requestAnimationFrame(apply); }, { passive: true });
      apply();
    }
  }

  /* ---------- Hero pointer parallax (award-style depth on mouse move) ----------
     Drives the CSS `translate` property with a lerp so it composes with the
     reveal/float `transform` animations instead of fighting them. */
  if (!reduce && fine) {
    const hero = $('.hero');
    const portrait = $('.hero__portrait');
    const fcards = $$('.hero__portrait .float-card');
    if (hero && portrait) {
      let tx = 0, ty = 0, x = 0, y = 0, raf2 = null;
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - .5);
        ty = ((e.clientY - r.top) / r.height - .5);
        if (!raf2) raf2 = requestAnimationFrame(step);
      }, { passive: true });
      hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf2) raf2 = requestAnimationFrame(step); });
      function step() {
        x += (tx - x) * .07; y += (ty - y) * .07;
        portrait.style.translate = `${x * -16}px ${y * -12}px`;
        // compose with the scroll-parallax --py these cards already use
        fcards.forEach((c, i) => { const d = [26, 34, 20][i] || 24; c.style.translate = `${x * d}px calc(${y * d * .7}px + var(--py, 0px))`; });
        raf2 = (Math.abs(tx - x) > .001 || Math.abs(ty - y) > .001) ? requestAnimationFrame(step) : null;
      }
    }
  }
})();

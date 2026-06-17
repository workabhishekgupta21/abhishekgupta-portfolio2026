/* =========================================================
   Abhishek Gupta — Motion system (vanilla + GSAP if present)
   ========================================================= */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

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

  /* ---------- Cursor-follow glow ---------- */
  if (!reduce && fine) {
    const glow = $('#cursorGlow');
    let gx = 0, gy = 0, cx = 0, cy = 0, raf;
    window.addEventListener('pointermove', (e) => {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add('is-on');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    function loop() {
      cx += (gx - cx) * .15; cy += (gy - cy) * .15;
      glow.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      raf = (Math.abs(gx - cx) > .5 || Math.abs(gy - cy) > .5) ? requestAnimationFrame(loop) : null;
    }
    document.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
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
})();

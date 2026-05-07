/**
 * ui.js — Shared UI components (used on every page)
 * Depends on: nothing
 *
 * Provides:
 *   - Scroll progress bar
 *   - Navbar scroll + hamburger
 *   - Scroll-reveal IntersectionObserver
 *   - Node canvas animation (hero background)
 *   - Dynamic copyright year
 */

/* ─── Scroll Progress ─────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    if (max > 0) bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
})();

/* ─── Navbar ──────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!navbar || !hamburger || !navLinks) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ─── Scroll Reveal ───────────────────────────────────────── */
function initRevealObserver() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('revealed'), i * 45);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
  return obs;
}

/* ─── Node Canvas ─────────────────────────────────────────── */
(function initNodeCanvas() {
  const canvas = document.getElementById('node-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CELL       = 24;
  const R          = 1.4;
  const BASE       = 0.06;
  const MAX_B      = 0.55;
  const WAVE_SPEED = 0.9;
  const MAX_WAVES  = 6;

  let W, H, cols, rows, dots = [], waves = [], frame = 0;

  function buildGrid() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols = Math.ceil(W / CELL) + 1;
    rows = Math.ceil(H / CELL) + 1;

    const ox = (W - (cols - 1) * CELL) / 2;
    const oy = (H - (rows - 1) * CELL) / 2;

    dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: ox + c * CELL, y: oy + r * CELL,
          c, r,
          b: BASE,
          flicker: Math.random() * Math.PI * 2
        });
      }
    }
  }

  function spawnWave() {
    waves.push({
      cx: Math.floor(Math.random() * cols),
      cy: Math.floor(Math.random() * rows),
      radius: 0,
      life:     1.0,
      decay:    0.004 + Math.random() * 0.003,
      strength: 0.25  + Math.random() * 0.3,
      width:    2.5   + Math.random() * 2
    });
  }

  function computeBrightness() {
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.b = BASE + Math.sin(d.flicker + frame * 0.012) * 0.012;
    }
    for (const w of waves) {
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dist  = Math.hypot(d.c - w.cx, d.r - w.cy);
        const delta = dist - w.radius;
        const gauss = Math.exp(-(delta * delta) / (2 * w.width * w.width));
        d.b += gauss * w.strength * w.life;
      }
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].b = Math.min(dots[i].b, MAX_B);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      if (d.b < BASE * 0.3) continue;
      ctx.beginPath();
      ctx.arc(d.x, d.y, R, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(95,196,208,${d.b.toFixed(3)})`;
      ctx.fill();
    }
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      if (d.b < 0.18) continue;
      if (d.c < cols - 1) {
        const nb = dots[i + 1];
        if (nb && nb.b > 0.18) {
          const alpha = Math.min(d.b, nb.b) * 0.22;
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(nb.x, nb.y);
          ctx.strokeStyle = `rgba(95,196,208,${alpha.toFixed(3)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      if (d.r < rows - 1) {
        const nb = dots[i + cols];
        if (nb && nb.b > 0.18) {
          const alpha = Math.min(d.b, nb.b) * 0.22;
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(nb.x, nb.y);
          ctx.strokeStyle = `rgba(95,196,208,${alpha.toFixed(3)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
  }

  function tick() {
    frame++;
    if (waves.length < MAX_WAVES && frame % 38 === 0) spawnWave();
    if (waves.length === 0) spawnWave();
    for (const w of waves) { w.radius += WAVE_SPEED; w.life -= w.decay; }
    waves = waves.filter(w => w.life > 0.02 && w.radius < Math.hypot(cols, rows) * 1.2);
    computeBrightness();
    draw();
    requestAnimationFrame(tick);
  }

  buildGrid();
  for (let i = 0; i < 3; i++) spawnWave();
  tick();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildGrid, 120);
  }, { passive: true });

  // Click-triggered wave on hero
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (!dots.length) return;
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < dots.length; i++) {
        const dist = Math.hypot(dots[i].x - mx, dots[i].y - my);
        if (dist < bestDist) { bestDist = dist; best = i; }
      }
      waves.push({ cx: dots[best].c, cy: dots[best].r, radius: 0, life: 1.0, decay: 0.003, strength: 0.55, width: 3 });
    });
  }
})();

/* ─── Dynamic Copyright Year ──────────────────────────────── */
(function setCopyrightYear() {
  const el = document.querySelector('.footer-copy');
  if (el) el.textContent = '\u00A9 ' + new Date().getFullYear() + ' Shivaprasad V';
})();

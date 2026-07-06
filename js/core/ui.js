/**
 * ui.js — Shared UI components (used on every page)
 * Depends on: nothing
 *
 * Provides:
 *   - Scroll progress bar
 *   - Navbar scroll + hamburger
 *   - Scroll-reveal IntersectionObserver
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

/* ─── Dynamic Copyright Year ──────────────────────────────── */
(function setCopyrightYear() {
  const el = document.querySelector('.footer-copy');
  if (el) el.textContent = '\u00A9 ' + new Date().getFullYear() + ' Shivaprasad V';
})();

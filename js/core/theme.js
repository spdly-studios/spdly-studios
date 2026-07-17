/**
 * theme.js — Light/Dark theme toggle with persistence.
 * - Applies saved theme (localStorage 'theme') or OS preference before paint.
 * - Toggles [data-theme] on <html>, persists choice, and dispatches 'themechange'.
 * - To avoid FOUC, an inline script in <head> sets the attribute before CSS loads;
 *   this module only wires up the toggle button and keeps state in sync.
 */
(function initTheme() {
  const KEY = 'theme';
  const root = document.documentElement;

  function systemPref() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function current() {
    return root.dataset.theme || systemPref();
  }

  function apply(theme) {
    root.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  function bindToggles() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false');
      btn.addEventListener('click', () => {
        const next = current() === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
        document.querySelectorAll('.theme-toggle').forEach(b => {
          b.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
        });
      });
    });
  }

  // Keep toggle state correct if theme set elsewhere (e.g. OS change + no saved pref)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (!saved) apply(systemPref());
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggles);
  } else {
    bindToggles();
  }

  function initObserver() {
    const obs = new MutationObserver(bindToggles);
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.body) {
    initObserver();
  } else {
    document.addEventListener('DOMContentLoaded', initObserver);
  }
})();

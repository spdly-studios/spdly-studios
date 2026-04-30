/**
 * home.js — Home page logic
 * Depends on: core/config.js, core/ui.js, data/work-data.js
 *
 * Handles:
 *   - Preloader
 *   - Projects grid rendering
 *   - Animated stats counter
 *   - Contact form feedback
 */

/* ─── Preloader ───────────────────────────────────────────── */
document.body.classList.add('no-scroll');
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('done');
    document.body.classList.remove('no-scroll');
    initRevealObserver(); // defined in core/ui.js
  }, 1900);
});

/* ─── Projects Grid ───────────────────────────────────────── */
function renderWorkGrid(data) {
  const grid = document.getElementById('work-grid');
  if (!grid) return;

  // Use Firestore data if available, otherwise fall back to static WORK_DATA
  const items = data || (typeof WORK_DATA !== 'undefined' ? WORK_DATA : []);
  if (!items.length) return;

  grid.innerHTML = ''; // clear before re-render so stale cards are removed

  items.forEach(item => {
    const card = document.createElement('a');
    card.className = 'project-card reveal';
    card.href = `work.html?id=${item.id}`;

    // Only render <img> if thumb exists — avoids 404s when field removed in Firestore
    const imgHTML = item.thumb
      ? `<img src="${item.thumb}" alt="${item.title}"
             loading="lazy"
             onerror="this.onerror=null;this.style.display='none';this.parentElement.querySelector('.img-fallback').style.display='flex'" />
         <div class="img-fallback" style="display:none;align-items:center;justify-content:center;width:100%;height:200px;background:var(--surface);color:var(--text-3);font-size:0.75rem">
           <span>Thumbnail unavailable</span>
         </div>`
      : '<div class="img-fallback" style="display:flex;align-items:center;justify-content:center;width:100%;height:200px;background:var(--surface);color:var(--text-3);font-size:0.75rem"><span>No thumbnail</span></div>';

    card.innerHTML = `
      <div class="project-card-img">${imgHTML}</div>
      <div class="project-card-body">
        <div class="project-card-cat">${item.category}</div>
        <div class="project-card-title">${item.title}</div>
        <div class="project-card-desc">${item.tagline}</div>
        <div class="project-card-tags">
          ${item.tags.slice(0, 3).map(t => `<span class="tag sm">${t}</span>`).join('')}
          ${item.tags.length > 3 ? `<span class="tag sm">+${item.tags.length - 3}</span>` : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Observe freshly added cards for scroll-reveal
  grid.querySelectorAll('.reveal').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    obs.observe(el);
  });
}

// Render immediately with static data for fast first paint
renderWorkGrid(null);

// Re-render when Firestore data arrives — replaces static cards with live data
document.addEventListener('portfolioDataReady', (e) => {
  const projects = e.detail?.projects?.items;
  if (projects && projects.length > 0) {
    console.log('[home.js] Using Firestore data:', projects.length, 'projects');
    renderWorkGrid(projects);
  } else {
    console.log('[home.js] No Firestore projects data, using static');
  }
});

/* ─── Animated Stats ──────────────────────────────────────── */
function animateStat(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const dur    = 1400;
  const start  = performance.now();
  const step   = (now) => {
    const p    = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateStat);
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) statsObs.observe(aboutStats);

/* ─── Contact Form ────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    btn.textContent = 'Message Sent ✓';
    btn.style.cssText = 'background:#2a7a5e;border-color:#2a7a5e;color:#fff';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.cssText = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3500);
  });
}
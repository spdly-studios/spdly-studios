/**
 * home.js — Home page logic
 * Depends on: core/config.js, core/ui.js, data/work-data.js
 *
 * Handles:
 *   - Preloader
 *   - Projects grid rendering
 *   - Contact form feedback
 */

/* ─── Preloader ───────────────────────────────────────────── */
document.body.classList.add('no-scroll');
window.addEventListener('load', () => {
  const label = document.querySelector('.pre-label');
  if (label) {
    const sequence = [
      { time: 0, text: 'Loading…' },
      { time: 400, text: 'Ready' }
    ];
    sequence.forEach(step => {
      setTimeout(() => {
        label.textContent = step.text;
      }, step.time);
    });
  }

  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('done');
    document.body.classList.remove('no-scroll');
    initRevealObserver();
  }, 800);
});

/* ─── Projects Grid ───────────────────────────────────────── */
function renderWorkGrid(data, limit = 4) {
  const grid = document.getElementById('work-grid');
  if (!grid) return;

  const items = data || (typeof WORK_DATA !== 'undefined' ? WORK_DATA : []);
  if (!items.length) return;

  const featuredItems = items.slice(0, limit);

  grid.innerHTML = '';

  featuredItems.forEach(item => {
    const card = document.createElement('a');
    card.className = 'project-card';
    card.href = item.url || `work.html?id=${item.id}`;

    const imgHTML = item.thumb
      ? `<img src="${item.thumb}" alt="${item.title}"
             loading="lazy"
             onerror="this.onerror=null;this.style.display='none';this.parentElement.querySelector('.img-fallback').style.display='flex'" />
         <div class="img-fallback" style="display:none;align-items:center;justify-content:center;width:100%;height:200px;background:var(--bg-alt);color:var(--text-3);font-size:0.75rem">
           <span>Thumbnail unavailable</span>
         </div>`
      : '<div class="img-fallback" style="display:flex;align-items:center;justify-content:center;width:100%;height:200px;background:var(--bg-alt);color:var(--text-3);font-size:0.75rem"><span>No thumbnail</span></div>';

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
}

/* ─── Initialize with Firestore data prioritized ─────────────────────── */
(async () => {
  let projectsData = null;
  if (typeof PortfolioData !== 'undefined') {
    try {
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 3000));
      const data = await Promise.race([PortfolioData, timeoutPromise]);
      projectsData = data?.projects?.items || null;
    } catch (e) {
      console.warn('[home.js] Error waiting for Firestore data:', e);
    }
  }

  if (projectsData && projectsData.length > 0) {
    console.log('[home.js] Rendering with Firestore data:', projectsData.length, 'projects');
    renderWorkGrid(projectsData);
  } else {
    console.log('[home.js] Rendering with static data');
    renderWorkGrid(null);
  }
})();

document.addEventListener('portfolioDataReady', (e) => {
  const projects = e.detail?.projects?.items;
  if (projects && projects.length > 0) {
    console.log('[home.js] Firestore data arrived after init, re-rendering:', projects.length, 'projects');
    renderWorkGrid(projects);
  }
});

/* ─── Contact Form ────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    btn.textContent = 'Message Sent ✓';
    btn.style.cssText = 'background:var(--text);border-color:var(--text);color:var(--bg)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.cssText = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3500);
  });
}
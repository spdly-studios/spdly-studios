/**
 * projects.js — All projects listing page
 * Depends on: core/config.js, core/ui.js, data/work-data.js
 *
 * Handles:
 *   - Rendering all projects in a grid
 *   - Preloader
 *   - Scroll reveal animations
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
function renderAllProjectsGrid(data) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  // Use Firestore data if available, otherwise fall back to static WORK_DATA
  const items = data || (typeof WORK_DATA !== 'undefined' ? WORK_DATA : []);
  if (!items.length) return;

  grid.innerHTML = ''; // clear before re-render

  items.forEach(item => {
    const card = document.createElement('a');
    card.className = 'project-card reveal';
    card.href = item.url || `work.html?id=${item.id}`;

    // Only render <img> if thumb exists
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

// ─── Initialize with Firestore data prioritized ───────────────────────
(async () => {
  // Wait for Firestore data with timeout (max 3 seconds)
  let projectsData = null;
  if (typeof PortfolioData !== 'undefined') {
    try {
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 3000));
      const data = await Promise.race([PortfolioData, timeoutPromise]);
      projectsData = data?.projects?.items || null;
    } catch (e) {
      console.warn('[projects.js] Error waiting for Firestore data:', e);
    }
  }

  // Render with Firestore data if available, otherwise use static
  if (projectsData && projectsData.length > 0) {
    console.log('[projects.js] Rendering with Firestore data:', projectsData.length, 'projects');
    renderAllProjectsGrid(projectsData);
  } else {
    console.log('[projects.js] Rendering with static data');
    renderAllProjectsGrid(null);
  }
})();

// Also listen for Firestore data ready event in case data arrives after initial render
document.addEventListener('portfolioDataReady', (e) => {
  const projects = e.detail?.projects?.items;
  if (projects && projects.length > 0) {
    console.log('[projects.js] Firestore data arrived after init, re-rendering:', projects.length, 'projects');
    renderAllProjectsGrid(projects);
  }
});
/**
 * work.js — Project detail page
 * Depends on: core/config.js, core/ui.js, data/work-data.js
 *
 * Handles:
 *   - Reading ?id= param and finding the entry in WORK_DATA
 *   - Rendering the full project page
 *   - Rendering "More Projects" grid
 */

/* ─── Helpers ─────────────────────────────────────────────── */
function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}


/* ─── Render helpers ──────────────────────────────────────── */
function renderGalleryItem(img) {
  // Skip gallery items with no src
  if (!img.src) return '';
  return `
    <div class="proj-gallery-item">
      <img src="${img.src}" alt="${img.caption}"
           onerror="this.onerror=null;this.src='assets/logo.svg'" />
      <div class="proj-gallery-caption">${img.caption}</div>
    </div>
  `;
}

function renderWorkPage(item) {
  document.title = `${item.title} — Shivaprasad V`;

  document.getElementById('proj-category').textContent = item.category;
  document.getElementById('proj-title').textContent    = item.title;
  document.getElementById('proj-tagline').textContent  = item.tagline;

  // Tags
  document.getElementById('proj-tags').innerHTML =
    item.tags.map(t => `<span class="tag">${t}</span>`).join('');

  // Hero image — only render if field exists
  const heroWrap = document.getElementById('proj-hero-img');
  if (item.hero) {
    heroWrap.innerHTML = `
      <img src="${item.hero}" alt="${item.title}"
           onerror="this.onerror=null;this.src='assets/logo.svg'" />
    `;
  } else {
    // Keep the placeholder SVG visible when no hero image is set
    heroWrap.innerHTML = `
      <div class="img-placeholder">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
             stroke="var(--accent)" stroke-width="0.8" opacity="0.2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span class="mono" style="font-size:0.62rem;opacity:0.2;margin-top:10px">
          no image
        </span>
      </div>
    `;
  }

  // Metrics band
  const metricsInner = document.getElementById('metrics-inner');
  if (item.metrics?.length) {
    metricsInner.innerHTML = item.metrics.map(m => `
      <div class="metric-item">
        <span class="metric-val">${m.value}</span>
        <span class="metric-label">${m.label}</span>
      </div>
    `).join('');
  } else {
    document.querySelector('.metrics-band').style.display = 'none';
  }

  // Body sections
  let html = '';

  if (item.overview) {
    html += `
      <div class="proj-section reveal">
        <div class="proj-section-title">Overview</div>
        <p>${item.overview}</p>
      </div>
    `;
  }

  if (item.objectives?.length) {
    html += `
      <div class="proj-section reveal">
        <div class="proj-section-title">Objectives</div>
        <div class="proj-list">
          ${item.objectives.map(o => `<div class="proj-list-item">${o}</div>`).join('')}
        </div>
      </div>
    `;
  }

  if (item.stack?.length) {
    html += `
      <div class="proj-section reveal">
        <div class="proj-section-title">Technical Stack</div>
        <div class="proj-stack-grid">
          ${item.stack.map(s => `
            <div class="proj-stack-group">
              <div class="proj-stack-cat">${s.category}</div>
              <div class="proj-stack-items">
                ${s.items.map(i => `<span class="tag sm">${i}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (item.architecture) {
    html += `
      <div class="proj-section reveal">
        <div class="proj-section-title">Architecture &amp; Workflow</div>
        <p>${item.architecture}</p>
      </div>
    `;
  }

  if (item.challenges?.length) {
    html += `
      <div class="proj-section reveal">
        <div class="proj-section-title">Engineering Challenges</div>
        <div class="proj-list">
          ${item.challenges.map(c => `<div class="proj-list-item">${c}</div>`).join('')}
        </div>
      </div>
    `;
  }

  if (item.results) {
    html += `
      <div class="proj-section reveal">
        <div class="proj-section-title">Results &amp; Performance</div>
        <p>${item.results}</p>
      </div>
    `;
  }

  if (item.images?.length) {
    const galleryItems = item.images.map(renderGalleryItem).filter(Boolean).join('');
    if (galleryItems) {
      html += `
        <div class="proj-section reveal">
          <div class="proj-section-title">Images &amp; Diagrams</div>
          <div class="proj-gallery">${galleryItems}</div>
        </div>
      `;
    }
  }

  if (item.future?.length) {
    html += `
      <div class="proj-section reveal">
        <div class="proj-section-title">Future Improvements</div>
        <div class="proj-list">
          ${item.future.map(f => `<div class="proj-list-item">${f}</div>`).join('')}
        </div>
      </div>
    `;
  }

  document.getElementById('proj-body').innerHTML = html;

  // Observe newly injected sections for scroll-reveal
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

function renderMoreWork(currentId, sourceData) {
  const grid = document.getElementById('more-work-grid');
  if (!grid) return;

  // Use Firestore data if available, otherwise fall back to static WORK_DATA
  const allItems = sourceData || (typeof WORK_DATA !== 'undefined' ? WORK_DATA : []);

  grid.innerHTML = ''; // clear before re-render

  allItems
    .filter(item => item.id !== currentId)
    .slice(0, 3)
    .forEach(item => {
      const card = document.createElement('a');
      card.className = 'project-card reveal';
      card.href = `work.html?id=${item.id}`;

      // Only render <img> if thumb exists
      const imgHTML = item.thumb
        ? `<img src="${item.thumb}" alt="${item.title}"
               onerror="this.onerror=null;this.src='assets/logo.svg'" />`
        : '';

      card.innerHTML = `
        <div class="project-card-img">${imgHTML}</div>
        <div class="project-card-body">
          <div class="project-card-cat">${item.category}</div>
          <div class="project-card-title">${item.title}</div>
          <div class="project-card-desc">${item.tagline}</div>
          <div class="project-card-tags">
            ${item.tags.slice(0, 3).map(t => `<span class="tag sm">${t}</span>`).join('')}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  grid.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ─── Init ────────────────────────────────────────────────── */
function initPage(projectsData) {
  const id   = getQueryParam('id');
  const data = projectsData || (typeof WORK_DATA !== 'undefined' ? WORK_DATA : []);
  const item = data.find(p => p.id === id);

  if (!item) {
    const titleEl = document.getElementById('proj-title');
    if (titleEl) titleEl.textContent = 'Project not found';
    return;
  }

  renderWorkPage(item);
  renderMoreWork(id, data);
}

// Run immediately on DOM ready with static data for fast first paint
window.addEventListener('DOMContentLoaded', () => {
  initPage(null);
});

// Re-run when Firestore data arrives — updates page with live data
document.addEventListener('portfolioDataReady', (e) => {
  const projects = e.detail?.projects?.items;
  if (projects) initPage(projects);
});
/**
 * tools.js — Tools & Utilities listing page
 * Depends on: core/config.js, core/ui.js, core/firebase-config.js
 *
 * Handles:
 *   - Loading tools from Firestore (portfolio/tools)
 *   - Rendering tools organized by domain/field
 *   - Filtering and sorting
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

/* ─── Tools Organization & Rendering ──────────────────────── */

/**
 * Group tools by domain/field
 * Tools structure:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   icon: string (emoji or text),
 *   domain: string,
 *   field: string,
 *   url: string,
 *   isExternal: boolean,
 *   tags: string[]
 * }
 */

function groupToolsByDomain(tools) {
  const grouped = {};
  
  tools.forEach(tool => {
    const domain = tool.domain || 'General';
    if (!grouped[domain]) {
      grouped[domain] = [];
    }
    grouped[domain].push(tool);
  });
  
  // Sort domains and tools within each domain
  const sorted = {};
  Object.keys(grouped)
    .sort()
    .forEach(domain => {
      sorted[domain] = grouped[domain].sort((a, b) => 
        (a.title || '').localeCompare(b.title || '')
      );
    });
  
  return sorted;
}

function renderAllTools(data) {
  const container = document.getElementById('tools-container');
  if (!container) return;
  
  const tools = data || [];
  
  if (!tools.length) {
    container.innerHTML = `
      <div class="tools-empty">
        <p style="font-size: 1rem; margin-bottom: 0.5rem">No tools available yet</p>
        <p style="font-size: 0.85rem; margin: 0">Check back soon for useful utilities and calculators.</p>
      </div>
    `;
    return;
  }
  
  const grouped = groupToolsByDomain(tools);
  container.innerHTML = '';
  
  // Render each domain section
  Object.entries(grouped).forEach(([domain, domainTools]) => {
    const section = document.createElement('div');
    section.className = 'tools-section reveal';
    
    const heading = document.createElement('div');
    heading.className = 'tools-section-heading';
    heading.innerHTML = `
      <h2 class="tools-section-title">${domain}</h2>
      <span class="tools-section-count">${domainTools.length}</span>
    `;
    section.appendChild(heading);
    
    const grid = document.createElement('div');
    grid.className = 'tools-grid';
    
    domainTools.forEach(tool => {
      const card = document.createElement('a');
      card.className = 'tool-card reveal';
      card.href = tool.url || '#';
      card.target = tool.isExternal ? '_blank' : '_self';
      card.rel = tool.isExternal ? 'noopener noreferrer' : '';
      
      const fieldHTML = tool.field 
        ? `<div class="tool-field">${tool.field}</div>` 
        : '';
      
      const tagsHTML = (tool.tags || []).slice(0, 2)
        .map(t => `<span class="tool-badge">${t}</span>`)
        .join('');
      
      card.innerHTML = `
        <div class="tool-icon">${tool.icon || '⚙️'}</div>
        ${fieldHTML}
        <div class="tool-title">${tool.title || 'Untitled'}</div>
        <div class="tool-description">${tool.description || 'No description'}</div>
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
          ${tagsHTML}
        </div>
        <div class="tool-meta">
          <span>${tool.isExternal ? 'External' : 'Web Tool'}</span>
          <span class="tool-link-icon">→</span>
        </div>
      `;
      
      grid.appendChild(card);
    });
    
    section.appendChild(grid);
    container.appendChild(section);
  });
  
  // Observe newly added cards for scroll-reveal
  container.querySelectorAll('.reveal').forEach(el => {
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

/* ─── Default Tools Data (Fallback) ───────────────────────── */
function getStaticTools() {
  return [
    {
      id: 'robertson-multiplier',
      title: 'Robertson\'s Multiplier',
      description: 'Calculate multiplier values for Robertson\'s method in signal processing',
      icon: '🧮',
      domain: 'Signal Processing',
      field: 'DSP',
      url: 'tools/robertsons-multiplier.html',
      isExternal: false,
      tags: ['Calculator', 'Math']
    },
    {
      id: 'pipeline-hazard',
      title: 'Pipeline Hazard Analyzer',
      description: 'Analyze and visualize pipeline hazards in processor architecture',
      icon: '⚡',
      domain: 'Computer Architecture',
      field: 'Design',
      url: 'tools/pipeline-hazard-analysis.html',
      isExternal: false,
      tags: ['Analysis', 'CPU Design']
    }
  ];
}

/* ─── Initialize with Firestore data ───────────────────────── */
(async () => {
  // Wait for Firestore data with timeout (max 6 seconds - allows for preloader + network)
  let toolsData = null;

  if (typeof PortfolioData !== 'undefined') {
    try {
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 6000));
      const data = await Promise.race([PortfolioData, timeoutPromise]);
      toolsData = data?.tools?.items || null;
    } catch (e) {
      console.warn('[tools.js] Error waiting for Firestore data:', e);
    }
  }

  // Render with Firestore data if available, otherwise use static
  if (toolsData && toolsData.length > 0) {
    console.log('[tools.js] Rendering with Firestore data:', toolsData.length, 'tools');
    renderAllTools(toolsData);
  } else {
    console.log('[tools.js] Rendering with static data (Firebase unavailable or empty)');
    renderAllTools(getStaticTools());
  }
})();

// Also listen for Firestore data ready event in case data arrives after initial render
document.addEventListener('portfolioDataReady', (e) => {
  const tools = e.detail?.tools?.items;
  if (tools && tools.length > 0) {
    console.log('[tools.js] Firestore data arrived after init, re-rendering:', tools.length, 'tools');
    renderAllTools(tools);
  }
});

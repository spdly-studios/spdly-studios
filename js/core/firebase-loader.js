(function () {
  'use strict';

  // ── Check if Firebase is configured ──────────────────────────────────
  const configured = (
    typeof FIREBASE_CONFIG !== 'undefined' &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY'
  );

  if (!configured) {
    console.warn('[PortfolioData] Firebase not configured — using static data.');
    window.PortfolioData = Promise.resolve(null);
    return;
  }

  // ── Initialize Firebase compat mode ─────────────────────────────────
  // Use compat mode to match admin panel
  if (typeof firebase === 'undefined') {
    console.error('[PortfolioData] Firebase compat SDK not loaded. Ensure firebase-app-compat.js and firebase-firestore-compat.js are loaded before this script.');
    window.PortfolioData = Promise.resolve(null);
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    window._fbDb = firebase.firestore();
  } catch (e) {
    console.error('[PortfolioData] Firebase initialization error:', e);
    window.PortfolioData = Promise.resolve(null);
    return;
  }

  // ── Helper: fetch a document from portfolio collection ──────────────
  async function fetchDoc(section) {
    try {
      const docRef = window._fbDb.collection('portfolio').doc(section);
      const snap = await docRef.get();
      return snap.exists ? snap.data() : null;
    } catch (e) {
      console.error('[PortfolioData] Error fetching', section, e);
      return null;
    }
  }

  // ── Load everything ───────────────────────────────────────────────────
  window.PortfolioData = (async () => {
    try {
      const [config, projects, experience, research, education,
             presentations, skills, contact, about] = await Promise.all([
        fetchDoc('config'),
        fetchDoc('projects'),
        fetchDoc('experience'),
        fetchDoc('research'),
        fetchDoc('education'),
        fetchDoc('presentations'),
        fetchDoc('skills'),
        fetchDoc('contact'),
        fetchDoc('about'),
      ]);

      console.log('[PortfolioData] Firebase data loaded successfully');
      return { config, projects, experience, research, education,
               presentations, skills, contact, about };
    } catch (error) {
      console.error('[PortfolioData] Error loading Firebase data:', error);
      return null;
    }
  })();

  // ── Apply data to DOM once loaded ─────────────────────────────────────
  window.PortfolioData.then(data => {
    if (!data) return;

    // Override WORK_DATA with Firestore projects
    if (data.projects && data.projects.items) {
      window.WORK_DATA = data.projects.items;
    }

    // Apply contact data
    if (data.contact) {
      applyContactData(data.contact);
    }

    // Apply about data
    if (data.about) {
      applyAboutData(data.about);
    }

    // Apply skills data
    if (data.skills && data.skills.groups) {
      applySkillsData(data.skills.groups);
    }

    // Apply experience
    if (data.experience && data.experience.items) {
      applyExperienceData(data.experience.items);
    }

    // Apply research
    if (data.research && data.research.items) {
      applyResearchData(data.research.items);
    }

    // Apply education
    if (data.education && data.education.items) {
      applyEducationData(data.education.items);
    }

    // Apply presentations
    if (data.presentations) {
      applyPresentationsData(data.presentations);
    }

    // Apply config (meta, SEO, hero)
    if (data.config) {
      applyConfigData(data.config);
    }

    // Dispatch event so page scripts know data is ready
    document.dispatchEvent(new CustomEvent('portfolioDataReady', { detail: data }));
  });

  // ── DOM patchers ───────────────────────────────────────────────────────

  function applyContactData(c) {
    const map = {
      'contact-email':    c.email,
      'contact-phone':    c.phone,
      'contact-linkedin': c.linkedin,
      'contact-github':   c.github,
      'contact-website':  c.website,
      'contact-resume':   c.resume,
      'contact-intro':    c.intro,
    };

    for (const [id, val] of Object.entries(map)) {
      if (!val) continue;
      const el = document.querySelector(`[data-field="${id}"]`);
      if (!el) continue;

      if (el.tagName === 'A') {
        const existingLabel = el.querySelector('.contact-label');
        const labelText = id === 'contact-resume'
          ? (existingLabel ? existingLabel.textContent : 'Download Resume')
          : c[id.replace('contact-', '')] || val;
        let href = '#';

        if (id === 'contact-email') {
          href = val.startsWith('mailto:') ? val : `mailto:${val}`;
        } else if (id === 'contact-phone') {
          const phoneValue = val.startsWith('tel:') ? val : `tel:${val.replace(/\s+/g, '')}`;
          href = phoneValue;
        } else if (id === 'contact-resume') {
          href = val;
        } else if (val.startsWith('http://') || val.startsWith('https://')) {
          href = val;
        } else if (id === 'contact-website') {
          href = val.startsWith('/') ? val : `https://${val}`;
        } else if (val.includes('.') && !val.includes('://')) {
          href = `https://${val}`;
        } else {
          href = val;
        }

        el.href = href;
        if (id === 'contact-resume') {
          el.setAttribute('download', '');
        }

        const labelEl = el.querySelector('.contact-label');
        if (labelEl) {
          labelEl.textContent = labelText;
        } else {
          setText(`[data-field="${id}"]`, labelText);
        }
      } else {
        el.textContent = val;
      }
    }
  }

  function applyAboutData(a) {
    if (a.bio1) setText('[data-field="about-bio1"]', a.bio1);
    if (a.bio2) setText('[data-field="about-bio2"]', a.bio2);
    if (a.bio3) setText('[data-field="about-bio3"]', a.bio3);
    if (a.location) setText('[data-field="about-location"]', a.location);
    if (a.focus) setText('[data-field="about-focus"]', a.focus);
    if (a.institution) setText('[data-field="about-institution"]', a.institution);
    if (a.badge) setText('[data-field="about-badge"]', a.badge);
    if (a.stats) {
      a.stats.forEach((s, i) => {
        const el = document.querySelectorAll('.stat-num')[i];
        if (el) el.dataset.target = s.value;
        const lbl = document.querySelectorAll('.stat-label')[i];
        if (lbl) lbl.textContent = s.label;
      });
    }
  }

  function applySkillsData(groups) {
    const grid = document.querySelector('.skills-grid');
    if (!grid) return;
    grid.innerHTML = '';
    groups.forEach(g => {
      const div = document.createElement('div');
      div.className = 'skill-group';
      div.innerHTML = `
        <div class="skill-group-label mono">${g.label}</div>
        <div class="skill-tags">${g.tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}</div>`;
      grid.appendChild(div);
    });
  }

  function applyExperienceData(items) {
    const tl = document.querySelector('.timeline');
    if (!tl) return;
    tl.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'timeline-item reveal';
      div.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-meta">
            <span class="mono timeline-date">${item.date}</span>
            <span class="timeline-company">${item.company}</span>
          </div>
          <div class="timeline-role">${item.role}</div>
          <ul class="timeline-points">${(item.points||[]).map(p=>`<li>${p}</li>`).join('')}</ul>
          <div class="timeline-tags">${(item.tags||[]).map(t=>`<span class="tag sm">${t}</span>`).join('')}</div>
        </div>`;
      tl.appendChild(div);
    });
  }

  function applyResearchData(items) {
    const grid = document.querySelector('.research-grid');
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = `research-card${i===0?' featured':''} reveal`;
      div.innerHTML = `
        <div class="research-card-inner">
          <div class="research-institution mono">${item.institution}</div>
          <h3 class="research-title">${item.title}</h3>
          <p class="research-desc">${item.desc}</p>
          ${item.metrics ? `<div class="research-metric-row">${item.metrics.map(m=>`
            <div class="research-metric">
              <span class="metric-val">${m.value}</span>
              <span class="metric-label mono">${m.label}</span>
            </div>`).join('')}</div>` : ''}
          <div class="research-tags">${(item.tags||[]).map(t=>`<span class="tag sm">${t}</span>`).join('')}</div>
          ${item.conference ? `<div class="research-conf">${item.conference}</div>` : ''}
        </div>`;
      grid.appendChild(div);
    });
  }

  function applyEducationData(items) {
    const grid = document.querySelector('.edu-grid');
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'edu-card reveal';
      div.innerHTML = `
        <div class="edu-year mono">${item.year}</div>
        <div class="edu-degree">${item.degree}</div>
        <div class="edu-field">${item.field}</div>
        <div class="edu-institution">${item.institution}</div>
        ${item.note ? `<div class="edu-note">${item.note}</div>` : ''}
        ${item.cgpa ? `<div class="edu-cgpa mono">CGPA: ${item.cgpa}</div>` : ''}`;
      grid.appendChild(div);
    });
  }

  function applyPresentationsData(p) {
    if (p.presentations) {
      const col = document.querySelector('.pt-col:first-child');
      if (col) {
        const title = col.querySelector('.pt-sub');
        col.innerHTML = '';
        if (title) col.appendChild(title);
        p.presentations.forEach(item => {
          const div = document.createElement('div');
          div.className = 'pt-item reveal';
          div.innerHTML = `<div class="pt-year mono">${item.year}</div><div><div class="pt-title">${item.title}</div><div class="pt-desc">${item.desc}</div></div>`;
          col.appendChild(div);
        });
      }
    }
    if (p.training) {
      const col = document.querySelector('.pt-col:last-child');
      if (col) {
        const title = col.querySelector('.pt-sub');
        col.innerHTML = '';
        if (title) col.appendChild(title);
        p.training.forEach(item => {
          const div = document.createElement('div');
          div.className = 'pt-item reveal';
          div.innerHTML = `<div class="pt-year mono">${item.year}</div><div><div class="pt-title">${item.title}</div><div class="pt-desc">${item.desc}</div></div>`;
          col.appendChild(div);
        });
      }
    }
  }

  function applyConfigData(cfg) {
    if (cfg.heroTagline) setText('.hero-tagline', cfg.heroTagline);
    if (cfg.heroTitle)   setText('.hero-name .name-block:first-child', cfg.heroTitle);
    if (cfg.heroEyebrow) {
      const ey = document.querySelector('.hero-eyebrow');
      if (ey) ey.innerHTML = `<span class="eyebrow-line"></span>${cfg.heroEyebrow}<span class="eyebrow-line"></span>`;
    }
    if (cfg.heroPills) {
      const pills = document.querySelector('.hero-pills');
      if (pills) pills.innerHTML = cfg.heroPills.map(p=>`<span class="pill">${p}</span>`).join('');
    }
    if (cfg.sectionHeadings) {
      Object.entries(cfg.sectionHeadings).forEach(([id, html]) => {
        const el = document.querySelector(`#${id} .section-heading`);
        if (el) el.innerHTML = html;
      });
    }
    if (cfg.footerCopy) setText('.footer-copy', cfg.footerCopy);
    document.title = cfg.pageTitle || document.title;
  }

  function setText(sel, val) {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  }

})();

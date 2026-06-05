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

/* ─── Hero Roles Rotation with Enhanced Animations ───────────────────────────────────── */
function initRoleRotation() {
  const roles = ['Dreamer', 'Thinker', 'Builder'];
  const roleItems = document.querySelectorAll('.role-item');
  
  if (roleItems.length === 0) return;
  
  let currentIndex = 0;
  
  // Set initial text
  roleItems.forEach((el, i) => {
    el.textContent = roles[i] || '';
  });
  
  // Enhanced rotation with better transitions
  const rotationInterval = setInterval(() => {
    // Add 'prev' class to previous active item
    const prevActive = document.querySelector('.role-item.active');
    if (prevActive) {
      prevActive.classList.remove('active');
      prevActive.classList.add('prev');
      // Remove 'prev' class after animation completes
      setTimeout(() => prevActive.classList.remove('prev'), 500);
    }
    
    // Move to next role
    currentIndex = (currentIndex + 1) % roles.length;
    roleItems[currentIndex].classList.add('active');
  }, 3500); // Increased to 3.5 seconds for better story pacing
  
  // Set initial active state
  roleItems[0].classList.add('active');
  
  // Optional: Update on click for interactivity
  roleItems.forEach((item, index) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      // Clear the interval and restart
      clearInterval(rotationInterval);
      
      // Remove all active/prev classes
      roleItems.forEach(el => {
        el.classList.remove('active', 'prev');
      });
      
      // Set clicked item as active
      currentIndex = index;
      item.classList.add('active');
      
      // Restart the interval
      initRoleRotation();
    });
  });
  
  return rotationInterval;
}

// Initialize roles when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRoleRotation);
} else {
  initRoleRotation();
}

/* ─── Hero Parallax on Scroll ─────────────────────────────────────────────────────────── */
function initHeroParallax() {
  const heroSection = document.getElementById('hero');
  const parallaxBg = document.getElementById('parallax-bg');
  
  if (!heroSection || !parallaxBg) return;
  
  const heroHeight = heroSection.offsetHeight;
  
  window.addEventListener('scroll', () => {
    const scrollProgress = Math.min(window.scrollY / heroHeight, 1);
    const parallaxValue = scrollProgress * 30; // 30px parallax depth
    
    // Apply subtle parallax to background
    parallaxBg.style.transform = `translateY(${parallaxValue}px)`;
    
    // Subtle fade out of hero content on scroll
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = Math.max(0.3, 1 - scrollProgress * 0.7);
    }
  });
}

// Initialize parallax when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroParallax);
} else {
  initHeroParallax();
}

/* ─── Projects Grid ───────────────────────────────────────── */
function renderWorkGrid(data, limit = 4) {
  const grid = document.getElementById('work-grid');
  if (!grid) return;

  // Use Firestore data if available, otherwise fall back to static WORK_DATA
  const items = data || (typeof WORK_DATA !== 'undefined' ? WORK_DATA : []);
  if (!items.length) return;

  // Limit to featured projects (default 4)
  const featuredItems = items.slice(0, limit);

  grid.innerHTML = ''; // clear before re-render so stale cards are removed

  featuredItems.forEach(item => {
    const card = document.createElement('a');
    card.className = 'project-card reveal';
    card.href = item.url || `work.html?id=${item.id}`;

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
      console.warn('[home.js] Error waiting for Firestore data:', e);
    }
  }

  // Render with Firestore data if available, otherwise use static
  if (projectsData && projectsData.length > 0) {
    console.log('[home.js] Rendering with Firestore data:', projectsData.length, 'projects');
    renderWorkGrid(projectsData);
  } else {
    console.log('[home.js] Rendering with static data');
    renderWorkGrid(null);
  }
})();

// Also listen for Firestore data ready event in case data arrives after initial render
document.addEventListener('portfolioDataReady', (e) => {
  const projects = e.detail?.projects?.items;
  if (projects && projects.length > 0) {
    console.log('[home.js] Firestore data arrived after init, re-rendering:', projects.length, 'projects');
    renderWorkGrid(projects);
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
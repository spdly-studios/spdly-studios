/**
 * Cinematic Particle System — "Constellation Drift"
 *
 * A handcrafted particle background for the hero section.
 * Each particle has its own wander angle, depth layer, color,
 * and breathing rhythm — no two follow the same path.
 *
 * Features:
 *   - 5-color curated palette with weighted distribution
 *   - Per-particle wander angles for organic, non-uniform motion
 *   - Depth / parallax layers (0.3–1.0) affecting size, opacity, speed
 *   - Gentle "breathing" opacity oscillation per particle
 *   - Constellation lines between nearby particles
 *   - Magnetic mouse pull (particles attracted toward cursor)
 *   - Scroll-based fade as hero leaves viewport
 *   - Retina-aware canvas with devicePixelRatio scaling
 *
 * Performance: 55 particles, deltaTime-normalized, early-exit spatial
 * checks on constellation lines, single globalAlpha for scroll fade.
 */

class ParticleBackground {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d', { alpha: true });

    this.particles = [];
    this.signals = []; // Active data pulses flowing through the network
    this.mousePos = { x: -9999, y: -9999 }; // offscreen until first move
    this.scrollOpacity = 1;
    this.animationId = null;
    this.time = 0;

    // Timing
    this.lastFrameTime = performance.now();
    this.deltaTime = 1;

    // Palette with distribution weights (cumulative thresholds)
    // 15% accent red, 15% warm amber, 15% cool teal, 10% lavender, 45% grey
    this.palette = [
      { r: 229, g: 79,  b: 77,  threshold: 0.15 },  // Accent red
      { r: 232, g: 178, b: 99,  threshold: 0.30 },  // Warm amber
      { r: 95,  g: 196, b: 208, threshold: 0.45 },  // Cool teal
      { r: 167, g: 139, b: 210, threshold: 0.55 },  // Soft lavender
      { r: 139, g: 144, b: 160, threshold: 1.00 },  // Muted grey (default)
    ];

    // Dynamic particle count based on screen size (density scaling)
    const area = window.innerWidth * window.innerHeight;
    const densityFactor = Math.min(1.5, Math.max(0.6, area / 1500000));
    const particleCount = Math.round(65 * densityFactor);

    this.config = {
      particleCount,
      connectionDistance: 120,
      connectionOpacity: 0.08,
      mouseRadius: 150,
      mousePullStrength: 0.15,
    };

    this.init();
    this.setupEventListeners();
    this.animate();
  }

  // ─── Initialization ────────────────────────────────────────

  init() {
    this.resizeCanvas();
    this.createParticles();
  }

  /**
   * Size the canvas to its CSS dimensions × devicePixelRatio
   * for crisp rendering on Retina / HiDPI screens.
   */
  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    // Fall back to window size if layout hasn't computed canvas offset width
    this.canvasWidth = this.canvas.offsetWidth > 100 ? this.canvas.offsetWidth : window.innerWidth;
    this.canvasHeight = this.canvas.offsetHeight > 100 ? this.canvas.offsetHeight : window.innerHeight;

    this.canvas.width = this.canvasWidth * dpr;
    this.canvas.height = this.canvasHeight * dpr;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /**
   * Pick a color from the curated palette using weighted random.
   */
  pickColor() {
    const roll = Math.random();
    for (const entry of this.palette) {
      if (roll < entry.threshold) {
        return { r: entry.r, g: entry.g, b: entry.b };
      }
    }
    // Fallback (should never hit, but safety)
    return { r: 139, g: 144, b: 160 };
  }

  /**
   * Build all 55 particles with unique motion signatures.
   */
  createParticles() {
    this.particles = [];

    for (let i = 0; i < this.config.particleCount; i++) {
      // Depth: 0.3 (far) to 1.0 (near)
      const depth = 0.3 + Math.random() * 0.7;

      // Speed scaled by depth — distant particles drift slower
      const baseSpeed = 0.1 + Math.random() * 0.3; // 0.1–0.4
      const speed = baseSpeed * depth;

      // Base size scaled by depth — distant particles are smaller
      const baseSize = 0.8 + Math.random() * 2.2; // 0.8–3.0
      const size = baseSize * depth;

      // Base opacity scaled by depth — distant particles are dimmer
      const baseOpacity = (0.25 + Math.random() * 0.45) * depth;

      const particle = {
        // Position — random across canvas
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,

        // Velocity (will be derived from wanderAngle each frame)
        vx: 0,
        vy: 0,

        // Unique wander behavior
        wanderAngle: Math.random() * Math.PI * 2,
        wanderSpeed: 0.001 + Math.random() * 0.004,   // 0.001–0.005
        uniqueFreq: 0.3 + Math.random() * 0.7,        // per-particle sine freq
        speed,

        // Visual properties
        color: this.pickColor(),
        size,
        depth,
        baseOpacity,

        // Breathing (opacity oscillation)
        breathPhase: Math.random() * Math.PI * 2,
        breathSpeed: 0.4 + Math.random() * 0.8,       // varied rhythm

        // Live opacity (computed each frame)
        currentOpacity: baseOpacity,
      };

      this.particles.push(particle);
    }
  }

  // ─── Event Listeners ───────────────────────────────────────

  setupEventListeners() {
    // Mouse tracking — use clientX/Y relative to canvas bounding rect
    this._onMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos.x = e.clientX - rect.left;
      this.mousePos.y = e.clientY - rect.top;
    };

    // Mouse leaves the hero / window → push cursor offscreen
    this._onMouseLeave = () => {
      this.mousePos.x = -9999;
      this.mousePos.y = -9999;
    };

    // Scroll fade based on hero section visibility
    this._onScroll = () => {
      const heroSection = document.getElementById('hero');
      if (!heroSection) return;

      const heroRect = heroSection.getBoundingClientRect();
      // 1 when hero fully visible, fades to 0 as it scrolls out
      this.scrollOpacity = Math.max(0, Math.min(1, heroRect.bottom / window.innerHeight));
    };

    // Resize handler
    this._onResize = () => {
      this.resizeCanvas();
    };

    document.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onResize);
    window.addEventListener('load', this._onResize);
  }

  // ─── Update Loop ───────────────────────────────────────────

  update() {
    // Delta-time normalization (target: 16.67ms per frame @ 60 FPS)
    const now = performance.now();
    this.deltaTime = (now - this.lastFrameTime) / 16.67;
    this.lastFrameTime = now;

    // Clamp to avoid spiral-of-death on tab-switch
    if (this.deltaTime > 3) this.deltaTime = 3;

    this.time += this.deltaTime;

    const { mouseRadius, mousePullStrength } = this.config;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // ── Wander angle update ──
      // Each particle's angle drifts at its own rate, with a per-particle
      // sine modulation so the turning feels organic, not mechanical.
      p.wanderAngle += (p.wanderSpeed + Math.sin(this.time * 0.01 * p.uniqueFreq) * 0.02) * this.deltaTime;

      // Derive velocity from wander angle
      p.vx = Math.cos(p.wanderAngle) * p.speed;
      p.vy = Math.sin(p.wanderAngle) * p.speed;

      // ── Mouse magnetic pull ──
      const dx = this.mousePos.x - p.x;
      const dy = this.mousePos.y - p.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < mouseRadius * mouseRadius && distSq > 1) {
        const dist = Math.sqrt(distSq);
        const pullForce = mousePullStrength * (1 - dist / mouseRadius);
        // Normalize direction and apply pull toward cursor
        p.vx += (dx / dist) * pullForce * this.deltaTime;
        p.vy += (dy / dist) * pullForce * this.deltaTime;
      }

      // ── Apply velocity ──
      p.x += p.vx * this.deltaTime;
      p.y += p.vy * this.deltaTime;

      // ── Soft wrap at boundaries ──
      const margin = 10;
      if (p.x < -margin) p.x = this.canvasWidth + margin;
      if (p.x > this.canvasWidth + margin) p.x = -margin;
      if (p.y < -margin) p.y = this.canvasHeight + margin;
      if (p.y > this.canvasHeight + margin) p.y = -margin;

      // ── Breathing opacity ──
      p.currentOpacity = p.baseOpacity * (0.5 + 0.5 * Math.sin(this.time * 0.01 * p.breathSpeed + p.breathPhase));
    }

    // ── Signal (Data Pulse) Spawning ──
    if (this.signals.length < 6 && Math.random() < 0.03 && this.particles.length > 0) {
      const startIndex = Math.floor(Math.random() * this.particles.length);
      const startP = this.particles[startIndex];
      const neighbors = [];
      const maxDist = this.config.connectionDistance;
      
      for (let j = 0; j < this.particles.length; j++) {
        if (j === startIndex) continue;
        const p2 = this.particles[j];
        const dx = Math.abs(startP.x - p2.x);
        if (dx > maxDist) continue;
        const dy = Math.abs(startP.y - p2.y);
        if (dy > maxDist) continue;
        const distSq = dx * dx + dy * dy;
        if (distSq < maxDist * maxDist) {
          neighbors.push(p2);
        }
      }

      if (neighbors.length > 0) {
        const targetP = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.signals.push({
          from: startP,
          to: targetP,
          progress: 0,
          speed: 0.01 + Math.random() * 0.015, // speed of transition
          color: startP.color,
          jumps: Math.floor(Math.random() * 3) + 1, // 1 to 3 hops
          history: [startP]
        });
      }
    }

    // ── Signal Updates ──
    for (let i = this.signals.length - 1; i >= 0; i--) {
      const sig = this.signals[i];
      sig.progress += sig.speed * this.deltaTime;
      
      if (sig.progress >= 1) {
        if (sig.jumps > 0) {
          const current = sig.to;
          const neighbors = [];
          const maxDist = this.config.connectionDistance;
          
          for (let j = 0; j < this.particles.length; j++) {
            const p2 = this.particles[j];
            if (p2 === current || sig.history.includes(p2)) continue;
            const dx = Math.abs(current.x - p2.x);
            if (dx > maxDist) continue;
            const dy = Math.abs(current.y - p2.y);
            if (dy > maxDist) continue;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxDist * maxDist) {
              neighbors.push(p2);
            }
          }

          if (neighbors.length > 0) {
            sig.from = current;
            sig.to = neighbors[Math.floor(Math.random() * neighbors.length)];
            sig.progress = 0;
            sig.jumps--;
            sig.history.push(sig.to);
            // Cap history length
            if (sig.history.length > 5) sig.history.shift();
          } else {
            this.signals.splice(i, 1);
          }
        } else {
          this.signals.splice(i, 1);
        }
      }
    }
  }

  // ─── Render Loop ───────────────────────────────────────────

  render() {
    const ctx = this.ctx;
    const w = this.canvasWidth;
    const h = this.canvasHeight;

    // Full clear — crisp rendering, no ghosting
    ctx.clearRect(0, 0, w, h);

    // Apply scroll fade as a global multiplier
    ctx.globalAlpha = this.scrollOpacity;

    // ── Constellation lines ──
    this.drawConnections(ctx);

    // ── Particles ──
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.currentOpacity <= 0) continue;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.currentOpacity.toFixed(3)})`;
      ctx.fill();
    }

    // ── Signals (Data Pulses) ──
    for (let i = 0; i < this.signals.length; i++) {
      const sig = this.signals[i];
      const maxDist = this.config.connectionDistance;
      
      const dx = Math.abs(sig.from.x - sig.to.x);
      const dy = Math.abs(sig.from.y - sig.to.y);
      if (dx > maxDist * 1.5 || dy > maxDist * 1.5) {
        continue;
      }
      
      const x = sig.from.x + (sig.to.x - sig.from.x) * sig.progress;
      const y = sig.from.y + (sig.to.y - sig.from.y) * sig.progress;
      
      const alpha = Math.sin(sig.progress * Math.PI) * Math.min(sig.from.currentOpacity, sig.to.currentOpacity) * 2.5;
      if (alpha <= 0.001) continue;

      const r = sig.color.r;
      const g = sig.color.g;
      const b = sig.color.b;

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${(alpha * 0.15).toFixed(3)})`;
      ctx.fill();

      // Mid glow
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${(alpha * 0.40).toFixed(3)})`;
      ctx.fill();

      // Inner core
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.95).toFixed(3)})`;
      ctx.fill();
    }

    // Reset globalAlpha
    ctx.globalAlpha = 1;
  }

  /**
   * Draw faint constellation lines between nearby particles.
   * Uses an early-exit on the x-axis delta to skip expensive sqrt calls.
   */
  drawConnections(ctx) {
    const maxDist = this.config.connectionDistance;
    const maxOpacity = this.config.connectionOpacity;
    const particles = this.particles;
    const len = particles.length;

    for (let i = 0; i < len; i++) {
      const a = particles[i];
      for (let j = i + 1; j < len; j++) {
        const b = particles[j];

        // Early exit: if too far apart on x alone, skip
        const dx = Math.abs(a.x - b.x);
        if (dx > maxDist) continue;

        const dy = Math.abs(a.y - b.y);
        if (dy > maxDist) continue;

        const distSq = dx * dx + dy * dy;
        if (distSq > maxDist * maxDist) continue;

        const dist = Math.sqrt(distSq);
        const lineOpacity = (1 - dist / maxDist) * maxOpacity * Math.min(a.currentOpacity, b.currentOpacity);

        if (lineOpacity <= 0.001) continue;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(255,255,255,${lineOpacity.toFixed(4)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  // ─── Animation Loop ────────────────────────────────────────

  animate() {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  // ─── Cleanup ───────────────────────────────────────────────

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    document.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('load', this._onResize);
  }
}

// Initialize when page loads
function initParticleBackground() {
  const canvas = document.getElementById('neural-network-canvas');
  if (canvas && !window.particleBackground) {
    window.particleBackground = new ParticleBackground(canvas);
  }
}

// Try both DOMContentLoaded and immediate check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParticleBackground);
} else {
  // DOMContentLoaded already fired, init immediately
  initParticleBackground();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.particleBackground) {
    window.particleBackground.destroy();
  }
});

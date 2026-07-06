/**
 * hero-canvas.js — Animated geometric hero background
 * Swiss-inspired: drifting node grid, connecting lines, orbiting accent
 * ring, scan line, and a magnetic pull toward the cursor.
 */

(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  let frame = 0;
  let nodes = [];
  const LINK = 130;
  const PULL = 190;

  function palette() {
    const cs = getComputedStyle(document.documentElement);
    const dark = document.documentElement.dataset.theme === 'dark';
    const base = dark ? '231,231,239' : '10,10,10';
    const accent = cs.getPropertyValue('--accent').trim() || '#e54f4d';
    return { base, accent };
  }
  let pal = palette();
  window.addEventListener('themechange', () => { pal = palette(); });

  function hexToRgba(hex, a) {
    hex = (hex || '#e54f4d').replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const n = parseInt(hex, 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r},${g},${b},${a})`;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    nodes = [];
    const step = 78;
    const cols = Math.ceil(width / step) + 1;
    const rows = Math.ceil(height / step) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = c * step + (r % 2 ? step / 2 : 0);
        nodes.push({
          x: ox, y: r * step,
          bx: ox, by: r * step,
          ph: Math.random() * Math.PI * 2,
          sp: 0.0025 + Math.random() * 0.004,
          amp: 10 + Math.random() * 18,
          big: Math.random() > 0.92
        });
      }
    }
  }

  function update() {
    frame++;
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;

    for (const n of nodes) {
      let nx = n.bx + Math.sin(frame * n.sp + n.ph) * n.amp;
      let ny = n.by + Math.cos(frame * n.sp * 0.8 + n.ph) * n.amp * 0.6;

      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const d = Math.hypot(dx, dy);
      if (d < PULL && d > 0.01) {
        const f = (1 - d / PULL) * 26;
        nx -= (dx / d) * f;
        ny -= (dy / d) * f;
      }
      n.x = nx; n.y = ny;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // connecting lines
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist > LINK) continue;
        const alpha = (1 - dist / LINK) * 0.10;
        ctx.strokeStyle = `rgba(${pal.base},${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.big ? 2.4 : 1.3, 0, Math.PI * 2);
      ctx.fillStyle = n.big ? hexToRgba(pal.accent, 0.55) : `rgba(${pal.base},0.18)`;
      ctx.fill();
    }

    // orbiting accent ring around cursor
    if (mouse.x > -9000) {
      const t = frame * 0.04;
      const rad = 46;
      ctx.strokeStyle = hexToRgba(pal.accent, 0.7);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, rad, t, t + Math.PI * 1.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, rad * 0.6, -t, -t + Math.PI);
      ctx.stroke();
    }

    // horizontal scan line
    const sy = (frame * 0.6) % (height + 120) - 60;
    const g = ctx.createLinearGradient(0, sy - 40, 0, sy + 40);
    g.addColorStop(0, hexToRgba(pal.accent, 0));
    g.addColorStop(0.5, hexToRgba(pal.accent, 0.10));
    g.addColorStop(1, hexToRgba(pal.accent, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, sy - 40, width, 80);
  }

  function tick() {
    update();
    draw();
    requestAnimationFrame(tick);
  }

  canvas.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.tx = e.clientX - r.left;
    mouse.ty = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.tx = -9999; mouse.ty = -9999;
  });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  });

  resize();
  tick();
})();

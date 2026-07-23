/* app.js — wires up UI to features.js. All heavy computation is cached in
   `store` (a FeatureStore instance) so switching views / hovering never
   redoes the full-image passes.
*/

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const canvasWrap = document.getElementById('canvasWrap');
const canvasHint = document.getElementById('canvasHint');
const featurePanel = document.getElementById('featurePanel');
const formulaPanel = document.getElementById('formulaPanel');
const inspHeader = document.getElementById('inspHeader');
const inspector = document.getElementById('inspector');
const paletteWrap = document.getElementById('paletteWrap');
const statsWrap = document.getElementById('statsWrap');
const histCanvas = document.getElementById('histCanvas');

let originalImageData = null; // pristine, never mutated
let store = null;              // FeatureStore
let posSamples = [];
let negSamples = [];
let maskData = null;           // Uint8Array of 0/1, current mask (for cleanup/export)

// ---------- Loading ----------
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = '#5b8def'; });
dropZone.addEventListener('dragleave', () => dropZone.style.borderColor = '');
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.style.borderColor = '';
  if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });

function loadFile(file) {
  if (!file.type.match(/image\/(png|jpeg|jpg)/)) { alert('Please upload a JPG or PNG file.'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 700; // cap resolution — local-stats passes are O(n*window)
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.round(w * scale); h = Math.round(h * scale);
      }
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      originalImageData = ctx.getImageData(0, 0, w, h);
      store = new FeatureStore(originalImageData);
      maskData = null;
      posSamples = []; negSamples = [];
      canvasWrap.style.display = 'block';
      canvasHint.style.display = 'block';
      featurePanel.style.display = 'block';
      formulaPanel.style.display = 'block';
      inspHeader.style.display = 'block';
      inspector.style.display = 'block';
      dropZone.style.display = 'none';
      document.getElementById('featureSelect').value = 'rgb';
      renderCurrentView();
      analyzePalette();
      computeStats();
      drawHistogram();
      renderSampleTables();
      renderComparison();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ---------- Feature map rendering ----------
function renderCurrentView() {
  const feature = document.getElementById('featureSelect').value;
  if (feature === 'rgb') {
    ctx.putImageData(originalImageData, 0, 0);
    return;
  }
  const map = store.getFeatureMap(feature);
  const out = ctx.createImageData(store.w, store.h);
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < map.length; i++) { if (map[i] < lo) lo = map[i]; if (map[i] > hi) hi = map[i]; }
  const range = (hi - lo) || 1;
  for (let i = 0, p = 0; i < map.length; i++, p += 4) {
    const norm = ((map[i] - lo) / range) * 255;
    if (feature === 'hue') {
      // false color hue as HSL wheel
      const [r, g, b] = hslToRgbApprox(map[i], 80, 50);
      out.data[p] = r; out.data[p + 1] = g; out.data[p + 2] = b;
    } else {
      out.data[p] = norm; out.data[p + 1] = norm; out.data[p + 2] = norm;
    }
    out.data[p + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
}

function hslToRgbApprox(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

document.getElementById('applyFeature').addEventListener('click', renderCurrentView);

// ---------- Pixel inspector + sampling ----------
canvas.addEventListener('mousemove', e => {
  if (!store) return;
  const { x, y } = eventToPixel(e);
  showInspector(store.getPixelFeatures(x, y));
});

canvas.addEventListener('click', e => {
  if (!store) return;
  const { x, y } = eventToPixel(e);
  const f = store.getPixelFeatures(x, y);
  const mode = document.getElementById('sampleMode').value;
  if (mode === 'pos') posSamples.push(f); else negSamples.push(f);
  renderSampleTables();
  renderComparison();
});

function eventToPixel(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: Math.floor((e.clientX - rect.left) * scaleX),
    y: Math.floor((e.clientY - rect.top) * scaleY)
  };
}

function fmt(n, d = 1) { return Number(n).toFixed(d); }

function showInspector(f) {
  inspector.innerHTML = `
    <span class="k">xy</span> ${f.x}, ${f.y} &nbsp;
    <span class="k">rgb</span> ${f.r},${f.g},${f.b} &nbsp;
    <span class="k">hex</span> ${f.hex}<br>
    <span class="k">hsv</span> ${fmt(f.hue,0)}°,${fmt(f.sat,0)}%,${fmt(f.val,0)}% &nbsp;
    <span class="k">hsl</span> ${fmt(f.hslH,0)}°,${fmt(f.hslS,0)}%,${fmt(f.hslL,0)}%<br>
    <span class="k">lab</span> L${fmt(f.L)} a${fmt(f.A)} b${fmt(f.B)} &nbsp;
    <span class="k">lum</span> ${fmt(f.lum)}<br>
    <span class="k">gradient mag</span> ${fmt(f.gradientMagnitude)} &nbsp;
    <span class="k">dir</span> ${fmt(f.gradientDirection)}° &nbsp;
    <span class="k">edge</span> ${fmt(f.edge)}<br>
    <span class="k">local mean</span> ${fmt(f.localMean)} &nbsp;
    <span class="k">variance</span> ${fmt(f.variance)} &nbsp;
    <span class="k">contrast</span> ${fmt(f.contrast)}
  `;
}

// ---------- Sample tables ----------
function sampleRowHtml(f, i, kind) {
  return `<tr>
    <td>${i + 1}</td>
    <td><div class="colorcell"><div class="dot" style="background:${f.hex}"></div></div></td>
    <td>${f.hex}</td>
    <td>${f.r},${f.g},${f.b}</td>
    <td>${fmt(f.hue,0)},${fmt(f.sat,0)},${fmt(f.val,0)}</td>
    <td>${fmt(f.L)},${fmt(f.A)},${fmt(f.B)}</td>
    <td>${fmt(f.gradientMagnitude)}</td>
    <td>${fmt(f.contrast)}</td>
    <td>${fmt(f.variance)}</td>
    <td>${fmt(f.localMean)}</td>
    <td>${f.x},${f.y}</td>
    <td class="del" data-kind="${kind}" data-i="${i}">✕</td>
  </tr>`;
}

function renderSampleTables() {
  const posBody = document.getElementById('posBody');
  const negBody = document.getElementById('negBody');
  posBody.innerHTML = posSamples.map((f, i) => sampleRowHtml(f, i, 'pos')).join('');
  negBody.innerHTML = negSamples.map((f, i) => sampleRowHtml(f, i, 'neg')).join('');
  document.getElementById('posEmpty').style.display = posSamples.length ? 'none' : 'block';
  document.getElementById('negEmpty').style.display = negSamples.length ? 'none' : 'block';
  document.getElementById('posTable').style.display = posSamples.length ? 'table' : 'none';
  document.getElementById('negTable').style.display = negSamples.length ? 'table' : 'none';

  document.querySelectorAll('.del').forEach(el => {
    el.onclick = () => {
      const kind = el.dataset.kind, i = +el.dataset.i;
      if (kind === 'pos') posSamples.splice(i, 1); else negSamples.splice(i, 1);
      renderSampleTables();
      renderComparison();
    };
  });
}

// ---------- Feature comparison ----------
const COMPARE_FEATURES = [
  ['r', 'R'], ['g', 'G'], ['b', 'B'],
  ['hue', 'Hue'], ['sat', 'Saturation'], ['val', 'Value'],
  ['L', 'LAB L'], ['A', 'LAB a'], ['B', 'LAB b'],
  ['lum', 'Luminance'], ['gradientMagnitude', 'Gradient mag'],
  ['contrast', 'Local contrast'], ['variance', 'Local variance'], ['localMean', 'Local mean']
];

function stats(arr) {
  if (!arr.length) return null;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const min = Math.min(...arr), max = Math.max(...arr);
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  return { mean, min, max, std: Math.sqrt(variance) };
}

function renderComparison() {
  const body = document.getElementById('compareBody');
  const empty = document.getElementById('compareEmpty');
  if (posSamples.length === 0 || negSamples.length === 0) {
    body.innerHTML = '';
    empty.style.display = 'block';
    document.getElementById('compareTable').style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  document.getElementById('compareTable').style.display = 'table';

  const rows = COMPARE_FEATURES.map(([key, label]) => {
    const posArr = posSamples.map(s => s[key]);
    const negArr = negSamples.map(s => s[key]);
    const ps = stats(posArr), ns = stats(negArr);
    // separation: |mean difference| normalized by pooled std
    const pooledStd = ((ps.std + ns.std) / 2) || 1e-6;
    const separation = Math.abs(ps.mean - ns.mean) / pooledStd;
    return { label, ps, ns, separation };
  });

  const maxSep = Math.max(...rows.map(r => r.separation));

  body.innerHTML = rows
    .sort((a, b) => b.separation - a.separation)
    .map(r => `<tr>
      <td>${r.label}</td>
      <td>${fmt(r.ps.mean)}</td>
      <td>${fmt(r.ps.min)}–${fmt(r.ps.max)}</td>
      <td>${fmt(r.ps.std)}</td>
      <td>${fmt(r.ns.mean)}</td>
      <td>${fmt(r.ns.min)}–${fmt(r.ns.max)}</td>
      <td>${fmt(r.ns.std)}</td>
      <td class="${r.separation === maxSep ? 'diffBad' : ''}">${fmt(r.separation, 2)}</td>
    </tr>`).join('');
}

// ---------- Formula engine ----------
document.getElementById('applyFormula').addEventListener('click', () => {
  const errEl = document.getElementById('formulaError');
  errEl.textContent = '';
  const expr = document.getElementById('formulaInput').value.trim();
  if (!expr || !store) return;
  try {
    // build a mask by evaluating the expression against each pixel's feature vector
    const w = store.w, h = store.h;
    const mask = new Uint8Array(w * h);
    // sandbox: Function with only named feature vars in scope (no closures leaked)
    const fn = new Function(
      'r,g,b,gray,hue,sat,val,lum,L,A,B,gradientMagnitude,gradientDirection,contrast,variance,localMean,edge,x,y',
      `return (${expr});`
    );
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const f = store.getPixelFeatures(x, y);
        const result = fn(f.r, f.g, f.b, f.gray, f.hue, f.sat, f.val, f.lum, f.L, f.A, f.B,
          f.gradientMagnitude, f.gradientDirection, f.contrast, f.variance, f.localMean, f.edge, f.x, f.y);
        mask[y * w + x] = result ? 1 : 0;
      }
    }
    maskData = mask;
    drawMaskOverlay();
  } catch (err) {
    errEl.textContent = 'Formula error: ' + err.message;
  }
});

document.getElementById('clearFormula').addEventListener('click', () => {
  document.getElementById('formulaInput').value = '';
  maskData = null;
  renderCurrentView();
});

function drawMaskOverlay() {
  if (!maskData) return;
  const out = ctx.createImageData(store.w, store.h);
  const src = originalImageData.data;
  for (let i = 0, p = 0; i < maskData.length; i++, p += 4) {
    if (maskData[i]) {
      out.data[p] = 255; out.data[p + 1] = 60; out.data[p + 2] = 120; out.data[p + 3] = 200;
    } else {
      out.data[p] = src[p] * 0.35; out.data[p + 1] = src[p + 1] * 0.35; out.data[p + 2] = src[p + 2] * 0.35; out.data[p + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
}

// ---------- Region cleanup (morphology on maskData, 4-connectivity) ----------
function get(mask, w, h, x, y) { return (x < 0 || y < 0 || x >= w || y >= h) ? 0 : mask[y * w + x]; }

function erode(mask, w, h) {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    out[y * w + x] = (get(mask,w,h,x,y) && get(mask,w,h,x-1,y) && get(mask,w,h,x+1,y) && get(mask,w,h,x,y-1) && get(mask,w,h,x,y+1)) ? 1 : 0;
  }
  return out;
}
function dilate(mask, w, h) {
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    out[y * w + x] = (get(mask,w,h,x,y) || get(mask,w,h,x-1,y) || get(mask,w,h,x+1,y) || get(mask,w,h,x,y-1) || get(mask,w,h,x,y+1)) ? 1 : 0;
  }
  return out;
}

function connectedComponents(mask, w, h) {
  const labels = new Int32Array(w * h).fill(-1);
  const sizes = [];
  let next = 0;
  const stack = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const idx = y * w + x;
    if (mask[idx] && labels[idx] === -1) {
      const label = next++;
      let size = 0;
      stack.push(idx);
      labels[idx] = label;
      while (stack.length) {
        const cur = stack.pop();
        size++;
        const cy = (cur / w) | 0, cx = cur % w;
        const neighbors = [[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]];
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const nIdx = ny * w + nx;
          if (mask[nIdx] && labels[nIdx] === -1) {
            labels[nIdx] = label;
            stack.push(nIdx);
          }
        }
      }
      sizes.push(size);
    }
  }
  return { labels, sizes };
}

document.getElementById('opRemoveIsolated').addEventListener('click', () => {
  if (!maskData) return;
  const { w, h } = store;
  const { labels, sizes } = connectedComponents(maskData, w, h);
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) if (labels[i] !== -1 && sizes[labels[i]] > 1) out[i] = 1;
  maskData = out; drawMaskOverlay();
});

document.getElementById('opRemoveSmall').addEventListener('click', () => {
  if (!maskData) return;
  const minSize = Math.max(1, +document.getElementById('minCompSize').value || 20);
  const { w, h } = store;
  const { labels, sizes } = connectedComponents(maskData, w, h);
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) if (labels[i] !== -1 && sizes[labels[i]] >= minSize) out[i] = 1;
  maskData = out; drawMaskOverlay();
});

document.getElementById('opOpening').addEventListener('click', () => {
  if (!maskData) return;
  const { w, h } = store;
  maskData = dilate(erode(maskData, w, h), w, h);
  drawMaskOverlay();
});

document.getElementById('opClosing').addEventListener('click', () => {
  if (!maskData) return;
  const { w, h } = store;
  maskData = erode(dilate(maskData, w, h), w, h);
  drawMaskOverlay();
});

document.getElementById('opFillHoles').addEventListener('click', () => {
  // fill small holes = closing on the inverse then invert back, restricted to small components
  if (!maskData) return;
  const { w, h } = store;
  const inverse = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) inverse[i] = maskData[i] ? 0 : 1;
  const { labels, sizes } = connectedComponents(inverse, w, h);
  const out = maskData.slice();
  const minHole = Math.max(1, +document.getElementById('minCompSize').value || 20);
  for (let i = 0; i < w * h; i++) {
    if (inverse[i] && labels[i] !== -1 && sizes[labels[i]] < minHole) out[i] = 1;
  }
  maskData = out; drawMaskOverlay();
});

document.getElementById('exportMask').addEventListener('click', () => {
  if (!maskData || !store) { alert('No mask to export. Apply a formula first.'); return; }
  const off = document.createElement('canvas');
  off.width = store.w; off.height = store.h;
  const octx = off.getContext('2d');
  const out = octx.createImageData(store.w, store.h);
  for (let i = 0, p = 0; i < maskData.length; i++, p += 4) {
    const v = maskData[i] ? 255 : 0;
    out.data[p] = v; out.data[p+1] = v; out.data[p+2] = v; out.data[p+3] = 255;
  }
  octx.putImageData(out, 0, 0);
  off.toBlob(blob => downloadBlob(blob, 'mask.png'));
});

// ---------- Dominant colors ----------
function analyzePalette() {
  const data = originalImageData.data;
  const n = data.length / 4;
  const buckets = {};
  const step = 32;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a < 10) continue;
    const key = [Math.round(r/step)*step, Math.round(g/step)*step, Math.round(b/step)*step].join(',');
    buckets[key] = (buckets[key] || 0) + 1;
  }
  const sorted = Object.entries(buckets).sort((a,b) => b[1]-a[1]);
  const size = parseInt(document.getElementById('paletteSize').value, 10);
  const top = sorted.slice(0, size);
  paletteWrap.innerHTML = '';
  top.forEach(([key, count]) => {
    const [r,g,b] = key.split(',').map(Number);
    const pct = ((count/n)*100).toFixed(1);
    const hex = rgbToHex(r,g,b);
    const div = document.createElement('div');
    div.className = 'swatch';
    div.style.background = hex;
    div.title = `${hex} — ${pct}%`;
    div.innerHTML = `<span>${pct}%</span>`;
    paletteWrap.appendChild(div);
  });
  window._uniqueColorCount = sorted.length;
}
document.getElementById('reanalyze').addEventListener('click', analyzePalette);

// ---------- Statistics ----------
function computeStats() {
  const data = originalImageData.data;
  const n = data.length / 4;
  let sumR=0,sumG=0,sumB=0,sumL=0,sumA=0,sumB2=0,sumLum=0;
  let minLum=255,maxLum=0,minC=1e9,maxC=-1e9;
  const local = store.localStats(2);
  for (let i = 0, p = 0; i < n; i++, p += 4) {
    const r=data[p],g=data[p+1],b=data[p+2];
    sumR+=r; sumG+=g; sumB+=b;
    sumL += store.L[i]; sumA += store.A[i]; sumB2 += store.B[i];
    sumLum += store.lum[i];
    if (store.lum[i] < minLum) minLum = store.lum[i];
    if (store.lum[i] > maxLum) maxLum = store.lum[i];
    if (local.contrast[i] < minC) minC = local.contrast[i];
    if (local.contrast[i] > maxC) maxC = local.contrast[i];
  }
  const avgR=Math.round(sumR/n), avgG=Math.round(sumG/n), avgB=Math.round(sumB/n);
  window._imageStats = {
    width: store.w, height: store.h, pixelCount: n,
    averageColor: { r: avgR, g: avgG, b: avgB, hex: rgbToHex(avgR,avgG,avgB) },
    averageLab: { L: +(sumL/n).toFixed(2), A: +(sumA/n).toFixed(2), B: +(sumB2/n).toFixed(2) },
    averageLuminance: +(sumLum/n).toFixed(2),
    uniqueColors: window._uniqueColorCount || null,
    luminanceRange: [Math.round(minLum), Math.round(maxLum)],
    contrastRange: [Math.round(minC), Math.round(maxC)]
  };
  const st = window._imageStats;
  statsWrap.className = '';
  statsWrap.innerHTML = `<table>
    <tr><th>Width × height</th><td>${st.width} × ${st.height}px</td></tr>
    <tr><th>Pixel count</th><td>${st.pixelCount.toLocaleString()}</td></tr>
    <tr><th>Average color</th><td><div class="colorcell"><div class="dot" style="background:${st.averageColor.hex}"></div>${st.averageColor.hex}</div></td></tr>
    <tr><th>Average LAB</th><td>L${st.averageLab.L} a${st.averageLab.A} b${st.averageLab.B}</td></tr>
    <tr><th>Average luminance</th><td>${st.averageLuminance}</td></tr>
    <tr><th>Unique colors (quantized)</th><td>${st.uniqueColors ?? '—'}</td></tr>
    <tr><th>Luminance range</th><td>${st.luminanceRange[0]} – ${st.luminanceRange[1]}</td></tr>
    <tr><th>Contrast range</th><td>${st.contrastRange[0]} – ${st.contrastRange[1]}</td></tr>
  </table>`;
}

// ---------- Histograms ----------
function drawHistogram() {
  const hctx = histCanvas.getContext('2d');
  const w = histCanvas.width, h = histCanvas.height;
  hctx.clearRect(0,0,w,h);
  const data = originalImageData.data;
  const n = data.length / 4;
  const histR=new Array(256).fill(0), histG=new Array(256).fill(0), histB=new Array(256).fill(0);
  const histGray=new Array(256).fill(0), histHue=new Array(360).fill(0), histSat=new Array(101).fill(0), histBright=new Array(256).fill(0);
  for (let i = 0, p = 0; i < n; i++, p += 4) {
    const r=data[p],g=data[p+1],b=data[p+2];
    histR[r]++; histG[g]++; histB[b]++;
    histGray[Math.round(store.gray[i])]++;
    histHue[Math.round(store.hue[i]) % 360]++;
    histSat[Math.round(store.sat[i])]++;
    histBright[Math.round(store.val[i] * 2.55)]++;
  }
  const channels = [
    { on: 'hR', hist: histR, color: 'rgba(255,80,80,0.55)', bins: 256 },
    { on: 'hG', hist: histG, color: 'rgba(80,255,120,0.55)', bins: 256 },
    { on: 'hB', hist: histB, color: 'rgba(80,140,255,0.55)', bins: 256 },
    { on: 'hGray', hist: histGray, color: 'rgba(200,200,200,0.5)', bins: 256 },
    { on: 'hHue', hist: histHue, color: 'rgba(230,120,255,0.5)', bins: 360 },
    { on: 'hSat', hist: histSat, color: 'rgba(255,200,60,0.5)', bins: 101 },
    { on: 'hBright', hist: histBright, color: 'rgba(255,255,255,0.4)', bins: 256 }
  ];
  const active = channels.filter(c => document.getElementById(c.on).checked);
  const max = Math.max(1, ...active.map(c => Math.max(...c.hist)));
  hctx.globalCompositeOperation = 'lighter';
  active.forEach(c => {
    hctx.beginPath();
    hctx.moveTo(0, h);
    for (let i = 0; i < c.bins; i++) {
      const x = (i / (c.bins - 1)) * w;
      const y = h - (c.hist[i] / max) * h;
      hctx.lineTo(x, y);
    }
    hctx.lineTo(w, h);
    hctx.closePath();
    hctx.fillStyle = c.color;
    hctx.fill();
  });
  hctx.globalCompositeOperation = 'source-over';
}
['hR','hG','hB','hGray','hHue','hSat','hBright'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => { if (store) drawHistogram(); });
});

// ---------- Export ----------
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCSVRow(arr) { return arr.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','); }

document.getElementById('exportCSV').addEventListener('click', () => {
  const header = ['kind','index','hex','r','g','b','hue','sat','val','L','A','B','gradientMagnitude','contrast','variance','localMean','x','y'];
  const lines = [toCSVRow(header)];
  posSamples.forEach((f,i) => lines.push(toCSVRow(['positive', i+1, f.hex, f.r, f.g, f.b, fmt(f.hue), fmt(f.sat), fmt(f.val), fmt(f.L), fmt(f.A), fmt(f.B), fmt(f.gradientMagnitude), fmt(f.contrast), fmt(f.variance), fmt(f.localMean), f.x, f.y])));
  negSamples.forEach((f,i) => lines.push(toCSVRow(['negative', i+1, f.hex, f.r, f.g, f.b, fmt(f.hue), fmt(f.sat), fmt(f.val), fmt(f.L), fmt(f.A), fmt(f.B), fmt(f.gradientMagnitude), fmt(f.contrast), fmt(f.variance), fmt(f.localMean), f.x, f.y])));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  downloadBlob(blob, 'samples.csv');
});

document.getElementById('exportStatsJSON').addEventListener('click', () => {
  if (!window._imageStats) { alert('Load an image first.'); return; }
  const blob = new Blob([JSON.stringify(window._imageStats, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'image-stats.json');
});

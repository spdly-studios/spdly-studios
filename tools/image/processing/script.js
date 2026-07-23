/**
 * Pixel Extractor — script.js
 * Computer Vision Laboratory
 *
 * Architecture:
 *   State      — single source of truth
 *   ImageIO    — load / decode images
 *   Features   — compute and cache all pixel feature maps
 *   EdgeDetect — Sobel / Prewitt / Laplacian kernels
 *   Formula    — safe eval expression compiler
 *   Renderer   — draw visualizations onto canvas
 *   Histogram  — RGB / grayscale charts
 *   Inspector  — per-pixel info panel updates
 *   CanvasCtrl — zoom, pan, pointer interaction
 *   UI         — wire DOM events → state → update
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
const State = {
  // Source
  sourceImage:   null,   // HTMLImageElement
  sourceCanvas:  null,   // offscreen canvas
  srcCtx:        null,
  width:         0,
  height:        0,
  pixelCount:    0,

  // Raw pixel buffer
  srcData:       null,   // Uint8ClampedArray (RGBA)

  // Feature maps — Float32Array per-pixel
  grayMap:       null,
  luminanceMap:  null,
  hsvMap:        null,   // Float32Array length w*h*3 [H,S,V repeated]
  gradMagMap:    null,
  gradDirMap:    null,
  localMeanMap:  null,
  localVarMap:   null,
  contrastMap:   null,
  edgeMap:       null,   // raw edge magnitude

  // Computed mask — Uint8Array 0 or 255
  maskData:      null,

  // Settings
  edgeAlgo:      'sobel',
  edgeThreshold: 30,
  windowSize:    5,
  formula:       '',
  viewMode:      'original',
  histMode:      'rgb',

  // Reference pixel
  refR: 0, refG: 0, refB: 0,
  hasRef: false,
  tolerance: 30,

  // Interaction
  interactionMode: 'select', // 'select' | 'pan'
  zoom: 1,
  panX: 0,
  panY: 0,
  isPanning: false,
  lastPan: { x: 0, y: 0 },
  stageX: 0, stageY: 0, // canvas stage top-left in viewport coords

  // Processing
  featuresComputed: false,
  maskActive: false,
  processing: false,
};

/* ═══════════════════════════════════════════════════════════════
   ELEMENT REFS
   ═══════════════════════════════════════════════════════════════ */
const El = {
  fileInput:       document.getElementById('file-input'),
  dropZone:        document.getElementById('drop-zone'),
  dropLabel:       document.getElementById('drop-label'),
  metaRow:         document.getElementById('image-meta'),
  metaDims:        document.getElementById('meta-dims'),
  metaSize:        document.getElementById('meta-size'),
  mainCanvas:      document.getElementById('main-canvas'),
  overlayCanvas:   document.getElementById('overlay-canvas'),
  canvasStage:     document.getElementById('canvas-stage'),
  canvasWrapper:   document.getElementById('canvas-wrapper'),
  emptyState:      document.getElementById('empty-state'),
  zoomLabel:       document.getElementById('zoom-label'),
  cursorCoords:    document.getElementById('cursor-coords'),
  progressWrap:    document.getElementById('progress-bar-wrap'),
  progressBar:     document.getElementById('progress-bar'),
  progressText:    document.getElementById('progress-text'),
  statusDot:       document.getElementById('status-dot'),
  statusText:      document.getElementById('status-text'),
  histCanvas:      document.getElementById('histogram-canvas'),
  formulaInput:    document.getElementById('formula-input'),
  formulaError:    document.getElementById('formula-error'),
  edgeAlgoSel:     document.getElementById('edge-algo'),
  edgeThresh:      document.getElementById('edge-thresh'),
  edgeThreshVal:   document.getElementById('edge-thresh-val'),
  winSize:         document.getElementById('win-size'),
  winSizeVal:      document.getElementById('win-size-val'),
  toleranceSlider: document.getElementById('tolerance-slider'),
  tolVal:          document.getElementById('tol-val'),
  refColorSwatch:  document.getElementById('ref-color-swatch'),
  refColorText:    document.getElementById('ref-color-text'),
  varRef:          document.getElementById('var-ref'),
  // Inspector
  inspectSwatch:   document.getElementById('inspect-swatch'),
  inspectHex:      document.getElementById('inspect-hex'),
  iR: document.getElementById('iR'),
  iG: document.getElementById('iG'),
  iB: document.getElementById('iB'),
  iH: document.getElementById('iH'),
  iS: document.getElementById('iS'),
  iV: document.getElementById('iV'),
  iGray: document.getElementById('iGray'),
  iLum:  document.getElementById('iLum'),
  fGradMag:   document.getElementById('fGradMag'),
  fGradDir:   document.getElementById('fGradDir'),
  fContrast:  document.getElementById('fContrast'),
  fVariance:  document.getElementById('fVariance'),
  fLocalMean: document.getElementById('fLocalMean'),
  fEdge:      document.getElementById('fEdge'),
  // Processing info
  pDims:       document.getElementById('pDims'),
  pPixels:     document.getElementById('pPixels'),
  pWindow:     document.getElementById('pWindow'),
  pEdgeAlgo:   document.getElementById('pEdgeAlgo'),
  pMaskActive: document.getElementById('pMaskActive'),
  pLastCompute:document.getElementById('pLastCompute'),
};

const mainCtx    = El.mainCanvas.getContext('2d');
const overlayCtx = El.overlayCanvas.getContext('2d');
const histCtx    = El.histCanvas.getContext('2d');

/* ═══════════════════════════════════════════════════════════════
   STATUS HELPERS
   ═══════════════════════════════════════════════════════════════ */
function setStatus(state, msg) {
  El.statusDot.className = `dot-${state}`;
  El.statusText.textContent = msg;
}

function showProgress(pct, msg) {
  El.progressWrap.classList.remove('hidden');
  El.progressBar.style.width = `${pct}%`;
  El.progressText.textContent = msg;
}

function hideProgress() {
  El.progressWrap.classList.add('hidden');
}

/* ═══════════════════════════════════════════════════════════════
   IMAGE I/O
   ═══════════════════════════════════════════════════════════════ */
const ImageIO = {
  /** Load image from File object, decode, populate State */
  loadFile(file) {
    if (!file || !file.type.match(/image\/(jpeg|png)/)) {
      alert('Please upload a JPG or PNG image.');
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      State.sourceImage = img;
      State.width       = img.naturalWidth;
      State.height      = img.naturalHeight;
      State.pixelCount  = State.width * State.height;

      // Draw source to offscreen canvas
      const oc = document.createElement('canvas');
      oc.width  = State.width;
      oc.height = State.height;
      const ctx = oc.getContext('2d');
      ctx.drawImage(img, 0, 0);
      State.sourceCanvas = oc;
      State.srcCtx       = ctx;
      State.srcData      = ctx.getImageData(0, 0, State.width, State.height).data;

      // Reset mask/formula state
      State.maskData       = null;
      State.maskActive     = false;
      State.featuresComputed = false;
      State.formula        = '';
      El.formulaInput.value = '';

      // Update meta
      El.metaDims.textContent  = `${State.width} × ${State.height}`;
      El.metaSize.textContent  = `${(file.size / 1024).toFixed(1)} KB`;
      El.metaRow.classList.remove('hidden');

      // Update proc info
      El.pDims.textContent   = `${State.width}×${State.height}`;
      El.pPixels.textContent = State.pixelCount.toLocaleString();

      El.dropLabel.innerHTML = `<strong>${file.name}</strong><br/><small>${State.width}×${State.height}</small>`;
      El.emptyState.classList.add('hidden');

      // Resize canvases
      CanvasCtrl.initCanvases();
      CanvasCtrl.fitToView();

      // Compute features then render
      setStatus('busy', 'Computing feature maps…');
      Features.computeAll().then(() => {
        setStatus('ready', `Ready — ${State.width}×${State.height}`);
        Renderer.render();
        Histogram.draw();
        Inspector.clearValues();
        UI.updateProcInfo();
      });
    };

    img.onerror = () => setStatus('error', 'Failed to load image');
    img.src = url;
  },
};

/* ═══════════════════════════════════════════════════════════════
   MATH UTILITIES
   ═══════════════════════════════════════════════════════════════ */
/** Convert RGB (0-255) to HSV (H:0-360, S:0-1, V:0-1) */
function rgbToHsv(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0, s = 0, v = max;

  if (delta > 0) {
    s = delta / max;
    if (max === rn)      h = 60 * (((gn - bn) / delta) % 6);
    else if (max === gn) h = 60 * (((bn - rn) / delta) + 2);
    else                 h = 60 * (((rn - gn) / delta) + 4);
    if (h < 0) h += 360;
  }
  return [h, s, v];
}

/** Compute perceptual luminance from linear RGB */
function luminance(r, g, b) {
  // BT.709
  return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
}

/** index into flat RGBA buffer */
function px(x, y, w) { return (y * w + x) * 4; }

/** Clamp x to [lo,hi] */
function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); }

/* ═══════════════════════════════════════════════════════════════
   EDGE DETECTION — Sobel / Prewitt / Laplacian
   ═══════════════════════════════════════════════════════════════ */
const EdgeDetect = {
  /**
   * Convolve grayscale image with two kernels (Gx, Gy) and return
   * magnitude and direction maps.
   */
  convolve2D(gray, w, h, kx, ky, ksize) {
    const mag = new Float32Array(w * h);
    const dir = new Float32Array(w * h);
    const half = Math.floor(ksize / 2);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let gx = 0, gy = 0;
        for (let ky2 = 0; ky2 < ksize; ky2++) {
          for (let kx2 = 0; kx2 < ksize; kx2++) {
            const sx = clamp(x + kx2 - half, 0, w - 1);
            const sy = clamp(y + ky2 - half, 0, h - 1);
            const g  = gray[sy * w + sx];
            gx += g * kx[ky2 * ksize + kx2];
            gy += g * ky[ky2 * ksize + kx2];
          }
        }
        const idx = y * w + x;
        mag[idx] = Math.sqrt(gx * gx + gy * gy);
        dir[idx] = Math.atan2(gy, gx) * (180 / Math.PI);
      }
    }
    return { mag, dir };
  },

  sobel(gray, w, h) {
    const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const ky = [-1, -2, -1,  0, 0,  0,  1, 2, 1];
    return this.convolve2D(gray, w, h, kx, ky, 3);
  },

  prewitt(gray, w, h) {
    const kx = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
    const ky = [-1, -1, -1,  0, 0,  0,  1, 1, 1];
    return this.convolve2D(gray, w, h, kx, ky, 3);
  },

  /**
   * Laplacian: single kernel producing a difference-of-neighbors map.
   * We fold the result into a single "edge magnitude" by abs value.
   */
  laplacian(gray, w, h) {
    const k = [0, 1, 0, 1, -4, 1, 0, 1, 0];
    const mag = new Float32Array(w * h);
    const dir = new Float32Array(w * h); // direction not meaningful for Laplacian

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0;
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            const sx = clamp(x + kx - 1, 0, w - 1);
            const sy = clamp(y + ky - 1, 0, h - 1);
            sum += gray[sy * w + sx] * k[ky * 3 + kx];
          }
        }
        mag[y * w + x] = Math.abs(sum);
        dir[y * w + x] = 0;
      }
    }
    return { mag, dir };
  },

  /** Compute edges using selected algorithm */
  compute(gray, w, h, algo) {
    switch (algo) {
      case 'prewitt':   return this.prewitt(gray, w, h);
      case 'laplacian': return this.laplacian(gray, w, h);
      default:          return this.sobel(gray, w, h);
    }
  },
};

/* ═══════════════════════════════════════════════════════════════
   FEATURE MAP COMPUTATION
   ═══════════════════════════════════════════════════════════════ */
const Features = {
  /**
   * Compute all feature maps from the raw source pixel data.
   * This is the most expensive operation and is cached in State.
   * We yield to the event loop via setTimeout slices to keep
   * the UI responsive during large images.
   */
  async computeAll() {
    const t0 = performance.now();
    const { srcData: d, width: w, height: h, pixelCount: n } = State;

    State.processing = true;
    showProgress(0, 'Computing gray / HSV…');
    await tick();

    // ── 1. Gray, Luminance, HSV ───────────────────────────────
    const grayMap      = new Float32Array(n);
    const luminanceMap = new Float32Array(n);
    const hsvMap       = new Float32Array(n * 3);

    for (let i = 0; i < n; i++) {
      const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      grayMap[i]      = gray;
      luminanceMap[i] = luminance(r, g, b);
      const [hh, ss, vv] = rgbToHsv(r, g, b);
      hsvMap[i * 3]     = hh;
      hsvMap[i * 3 + 1] = ss;
      hsvMap[i * 3 + 2] = vv;
    }

    State.grayMap      = grayMap;
    State.luminanceMap = luminanceMap;
    State.hsvMap       = hsvMap;

    showProgress(25, 'Computing gradients…');
    await tick();

    // ── 2. Gradient (using selected edge algo) ────────────────
    const { mag: gradMag, dir: gradDir } = EdgeDetect.compute(
      grayMap, w, h, State.edgeAlgo
    );
    State.gradMagMap = gradMag;
    State.gradDirMap = gradDir;

    // The edge map is the same gradient thresholded
    const edgeMap = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      edgeMap[i] = gradMag[i] > State.edgeThreshold ? gradMag[i] : 0;
    }
    State.edgeMap = edgeMap;

    showProgress(50, 'Computing local statistics…');
    await tick();

    // ── 3. Local Mean, Variance, Contrast ────────────────────
    const half = Math.floor(State.windowSize / 2);
    const localMeanMap = new Float32Array(n);
    const localVarMap  = new Float32Array(n);
    const contrastMap  = new Float32Array(n);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        let sum = 0, sumSq = 0, minV = 255, maxV = 0, count = 0;

        for (let dy = -half; dy <= half; dy++) {
          for (let dx = -half; dx <= half; dx++) {
            const nx = clamp(x + dx, 0, w - 1);
            const ny = clamp(y + dy, 0, h - 1);
            const g  = grayMap[ny * w + nx];
            sum   += g;
            sumSq += g * g;
            if (g < minV) minV = g;
            if (g > maxV) maxV = g;
            count++;
          }
        }

        const mean       = sum / count;
        localMeanMap[idx] = mean;
        localVarMap[idx]  = sumSq / count - mean * mean;
        contrastMap[idx]  = maxV - minV; // Michelson-style local contrast
      }
    }

    State.localMeanMap = localMeanMap;
    State.localVarMap  = localVarMap;
    State.contrastMap  = contrastMap;

    State.featuresComputed = true;
    State.processing       = false;

    const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
    El.pLastCompute.textContent = `${elapsed}s`;
    El.pWindow.textContent      = `${State.windowSize}×${State.windowSize}`;
    El.pEdgeAlgo.textContent    = State.edgeAlgo;

    hideProgress();
  },

  /**
   * Recompute only gradient + edge map after algorithm/threshold change.
   * Avoids rerunning the expensive local statistics.
   */
  async recomputeEdges() {
    if (!State.featuresComputed) return;
    setStatus('busy', 'Recomputing edges…');
    await tick();

    const { mag, dir } = EdgeDetect.compute(
      State.grayMap, State.width, State.height, State.edgeAlgo
    );
    State.gradMagMap = mag;
    State.gradDirMap = dir;

    const n = State.pixelCount;
    const edgeMap = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      edgeMap[i] = mag[i] > State.edgeThreshold ? mag[i] : 0;
    }
    State.edgeMap = edgeMap;

    setStatus('ready', `Ready — ${State.width}×${State.height}`);
    El.pEdgeAlgo.textContent = State.edgeAlgo;
    Renderer.render();
  },

  /**
   * Recompute local statistics after window size change.
   * Also chains edge recompute.
   */
  async recomputeLocal() {
    if (!State.featuresComputed) return;
    setStatus('busy', 'Recomputing local stats…');
    showProgress(0, 'Recomputing local statistics…');
    await tick();

    const { grayMap: gray, width: w, height: h, pixelCount: n, windowSize } = State;
    const half = Math.floor(windowSize / 2);
    const localMeanMap = new Float32Array(n);
    const localVarMap  = new Float32Array(n);
    const contrastMap  = new Float32Array(n);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        let sum = 0, sumSq = 0, minV = 255, maxV = 0, count = 0;
        for (let dy = -half; dy <= half; dy++) {
          for (let dx = -half; dx <= half; dx++) {
            const nx = clamp(x + dx, 0, w - 1);
            const ny = clamp(y + dy, 0, h - 1);
            const g  = gray[ny * w + nx];
            sum += g; sumSq += g * g;
            if (g < minV) minV = g;
            if (g > maxV) maxV = g;
            count++;
          }
        }
        const mean        = sum / count;
        localMeanMap[idx] = mean;
        localVarMap[idx]  = sumSq / count - mean * mean;
        contrastMap[idx]  = maxV - minV;
      }
    }

    State.localMeanMap = localMeanMap;
    State.localVarMap  = localVarMap;
    State.contrastMap  = contrastMap;
    El.pWindow.textContent = `${windowSize}×${windowSize}`;

    hideProgress();
    setStatus('ready', `Ready — ${State.width}×${State.height}`);
    Renderer.render();
  },
};

/* ═══════════════════════════════════════════════════════════════
   FORMULA ENGINE
   ═══════════════════════════════════════════════════════════════ */
const Formula = {
  _compiledFn: null,

  /**
   * Compile a formula string into a JS Function.
   * Variables are injected as named parameters.
   * Returns null on syntax error.
   */
  compile(expr) {
    if (!expr || !expr.trim()) return null;
    try {
      // Sanitize: only allow safe constructs — no assignments, no backtick
      const safe = expr
        .replace(/`/g, '')              // no template literals
        .replace(/\beval\b/g, '__')     // no eval
        .replace(/\bFunction\b/g, '__') // no Function constructor
        .replace(/\bdocument\b/g, '__')
        .replace(/\bwindow\b/g, '__')
        .replace(/\blocation\b/g, '__')
        .replace(/\bfetch\b/g, '__')
        .replace(/\bXMLHttp/g, '__');

      // Allowed variables as function parameters
      // eslint-disable-next-line no-new-func
      const fn = new Function(
        'R','G','B','Gray','Hue','Saturation','Value',
        'gradientMagnitude','gradientDirection',
        'contrast','variance','localMean','edge',
        'refR','refG','refB','tolerance',
        'x','y','Math',
        `"use strict"; return !!(${safe});`
      );
      return fn;
    } catch (e) {
      return null;
    }
  },

  /**
   * Apply compiled formula to every pixel.
   * Returns Uint8Array mask (255 = pass, 0 = reject).
   */
  applyMask(fn) {
    const {
      srcData: d, width: w, height: h, pixelCount: n,
      grayMap, luminanceMap, hsvMap,
      gradMagMap, gradDirMap,
      localMeanMap, localVarMap, contrastMap, edgeMap,
      refR, refG, refB, tolerance,
    } = State;

    const mask = new Uint8Array(n);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx  = y * w + x;
        const si   = idx * 4;
        const R    = d[si], G = d[si + 1], B = d[si + 2];
        const Gray = grayMap[idx];
        const Hue        = hsvMap[idx * 3];
        const Saturation = hsvMap[idx * 3 + 1];
        const Value      = hsvMap[idx * 3 + 2];

        let result = false;
        try {
          result = fn(
            R, G, B, Gray, Hue, Saturation, Value,
            gradMagMap[idx], gradDirMap[idx],
            contrastMap[idx], localVarMap[idx], localMeanMap[idx], edgeMap[idx],
            refR, refG, refB, tolerance,
            x, y, Math
          );
        } catch (_) {
          result = false;
        }

        mask[idx] = result ? 255 : 0;
      }
    }
    return mask;
  },
};

/* ═══════════════════════════════════════════════════════════════
   RENDERER
   ═══════════════════════════════════════════════════════════════ */
const Renderer = {
  /** Master render — chooses visualization mode */
  render() {
    if (!State.featuresComputed) return;

    switch (State.viewMode) {
      case 'original':   this.drawOriginal(); break;
      case 'edge':       this.drawFeatureMap(State.edgeMap,       'cyan');    break;
      case 'contrast':   this.drawFeatureMap(State.contrastMap,   'violet');  break;
      case 'gradient':   this.drawFeatureMap(State.gradMagMap,    'amber');   break;
      case 'mask':       this.drawMask(); break;
      case 'extracted':  this.drawExtracted(); break;
      case 'overlay':    this.drawOverlay(); break;
    }
  },

  /** Draw the original source image */
  drawOriginal() {
    mainCtx.drawImage(State.sourceCanvas, 0, 0);
  },

  /**
   * Draw a single-channel float map as a heatmap.
   * Auto-normalizes to [0, 255].
   * color: 'cyan' | 'violet' | 'amber'
   */
  drawFeatureMap(map, color) {
    const { width: w, height: h, pixelCount: n } = State;

    // Find range
    let min = Infinity, max = -Infinity;
    for (let i = 0; i < n; i++) {
      if (map[i] < min) min = map[i];
      if (map[i] > max) max = map[i];
    }
    const range = max - min || 1;

    const imgData = mainCtx.createImageData(w, h);
    const px4 = imgData.data;

    for (let i = 0; i < n; i++) {
      const t   = (map[i] - min) / range; // 0…1
      const i4  = i * 4;
      // Map t to chosen color palette
      switch (color) {
        case 'cyan':
          px4[i4]     = Math.round(t * 0);
          px4[i4 + 1] = Math.round(t * 229);
          px4[i4 + 2] = Math.round(t * 255);
          break;
        case 'violet':
          px4[i4]     = Math.round(t * 124);
          px4[i4 + 1] = Math.round(t * 77);
          px4[i4 + 2] = Math.round(t * 255);
          break;
        case 'amber':
          px4[i4]     = Math.round(t * 255);
          px4[i4 + 1] = Math.round(t * 171);
          px4[i4 + 2] = Math.round(t * 64);
          break;
      }
      px4[i4 + 3] = 255;
    }

    mainCtx.putImageData(imgData, 0, 0);
  },

  /** Draw binary mask: white = included, black = excluded */
  drawMask() {
    const { width: w, height: h, pixelCount: n, maskData } = State;
    const imgData = mainCtx.createImageData(w, h);
    const px4 = imgData.data;

    if (!maskData) {
      // All white (no formula applied)
      for (let i = 0; i < n; i++) {
        const i4 = i * 4;
        px4[i4] = px4[i4 + 1] = px4[i4 + 2] = 128;
        px4[i4 + 3] = 255;
      }
    } else {
      for (let i = 0; i < n; i++) {
        const v  = maskData[i];
        const i4 = i * 4;
        px4[i4] = px4[i4 + 1] = px4[i4 + 2] = v;
        px4[i4 + 3] = 255;
      }
    }
    mainCtx.putImageData(imgData, 0, 0);
  },

  /** Draw extracted result: original where mask=255, transparent elsewhere */
  drawExtracted() {
    const { srcData: d, width: w, height: h, pixelCount: n, maskData } = State;
    const imgData = mainCtx.createImageData(w, h);
    const px4 = imgData.data;

    for (let i = 0; i < n; i++) {
      const i4   = i * 4;
      const keep = !maskData || maskData[i] === 255;
      if (keep) {
        px4[i4]     = d[i4];
        px4[i4 + 1] = d[i4 + 1];
        px4[i4 + 2] = d[i4 + 2];
        px4[i4 + 3] = 255;
      } else {
        // Checkerboard pattern for transparency
        const x = i % w, y = Math.floor(i / w);
        const chk = ((x >> 3) + (y >> 3)) & 1;
        const c   = chk ? 60 : 40;
        px4[i4] = px4[i4 + 1] = px4[i4 + 2] = c;
        px4[i4 + 3] = 255;
      }
    }
    mainCtx.putImageData(imgData, 0, 0);
  },

  /** Draw original with cyan mask overlay (semi-transparent) */
  drawOverlay() {
    // First draw original
    mainCtx.drawImage(State.sourceCanvas, 0, 0);

    const { srcData: d, width: w, height: h, pixelCount: n, maskData } = State;
    if (!maskData) return;

    const imgData = overlayCtx.createImageData(w, h);
    const px4 = imgData.data;

    for (let i = 0; i < n; i++) {
      const i4 = i * 4;
      if (maskData[i] === 255) {
        // Cyan tint
        px4[i4]     = 0;
        px4[i4 + 1] = 229;
        px4[i4 + 2] = 255;
        px4[i4 + 3] = 100; // semi-transparent
      } else {
        px4[i4 + 3] = 0; // invisible
      }
    }
    overlayCtx.putImageData(imgData, 0, 0);
    return;
  },

  /** Clear overlay canvas */
  clearOverlay() {
    overlayCtx.clearRect(0, 0, State.width, State.height);
  },

  /** Draw crosshair at pixel coords (ix, iy) on overlay */
  drawCrosshair(ix, iy) {
    overlayCtx.clearRect(0, 0, State.width, State.height);
    overlayCtx.save();
    overlayCtx.strokeStyle = '#00e5ff';
    overlayCtx.lineWidth   = 1 / State.zoom; // stay 1px regardless of zoom
    overlayCtx.globalAlpha = 0.8;

    // Horizontal line
    overlayCtx.beginPath();
    overlayCtx.moveTo(0, iy + 0.5);
    overlayCtx.lineTo(State.width, iy + 0.5);
    overlayCtx.stroke();

    // Vertical line
    overlayCtx.beginPath();
    overlayCtx.moveTo(ix + 0.5, 0);
    overlayCtx.lineTo(ix + 0.5, State.height);
    overlayCtx.stroke();

    // Small square at intersection
    overlayCtx.strokeStyle = '#fff';
    overlayCtx.strokeRect(ix - 3 / State.zoom, iy - 3 / State.zoom,
                          6 / State.zoom, 6 / State.zoom);
    overlayCtx.restore();
  },
};

/* ═══════════════════════════════════════════════════════════════
   HISTOGRAM
   ═══════════════════════════════════════════════════════════════ */
const Histogram = {
  draw() {
    if (!State.featuresComputed) return;
    State.histMode === 'rgb' ? this.drawRGB() : this.drawGray();
  },

  drawRGB() {
    const { srcData: d, pixelCount: n } = State;
    const rBins = new Uint32Array(256);
    const gBins = new Uint32Array(256);
    const bBins = new Uint32Array(256);

    for (let i = 0; i < n; i++) {
      rBins[d[i * 4]]++;
      gBins[d[i * 4 + 1]]++;
      bBins[d[i * 4 + 2]]++;
    }

    this._paint([
      { bins: rBins, color: 'rgba(255,80,80,0.7)' },
      { bins: gBins, color: 'rgba(80,200,80,0.6)' },
      { bins: bBins, color: 'rgba(80,140,255,0.7)' },
    ]);
  },

  drawGray() {
    const { grayMap, pixelCount: n } = State;
    const bins = new Uint32Array(256);
    for (let i = 0; i < n; i++) bins[Math.round(grayMap[i])]++;
    this._paint([{ bins, color: 'rgba(160,170,200,0.85)' }]);
  },

  _paint(channels) {
    const cw = El.histCanvas.width;
    const ch = El.histCanvas.height;
    histCtx.clearRect(0, 0, cw, ch);

    // Background
    histCtx.fillStyle = '#0d0e11';
    histCtx.fillRect(0, 0, cw, ch);

    // Grid lines
    histCtx.strokeStyle = '#1e2230';
    histCtx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = Math.round(ch * i / 4);
      histCtx.beginPath();
      histCtx.moveTo(0, y);
      histCtx.lineTo(cw, y);
      histCtx.stroke();
    }

    // Find global max for normalization
    let maxVal = 0;
    channels.forEach(({ bins }) => {
      for (let i = 0; i < 256; i++) if (bins[i] > maxVal) maxVal = bins[i];
    });
    if (!maxVal) return;

    const barW = cw / 256;

    channels.forEach(({ bins, color }) => {
      histCtx.fillStyle = color;
      histCtx.beginPath();
      histCtx.moveTo(0, ch);
      for (let i = 0; i < 256; i++) {
        const h = (bins[i] / maxVal) * (ch - 4);
        histCtx.lineTo(i * barW, ch - h);
      }
      histCtx.lineTo(cw, ch);
      histCtx.closePath();
      histCtx.fill();
    });
  },
};

/* ═══════════════════════════════════════════════════════════════
   INSPECTOR — per-pixel panel
   ═══════════════════════════════════════════════════════════════ */
const Inspector = {
  update(ix, iy) {
    if (!State.featuresComputed) return;
    const { srcData: d, width: w, grayMap, luminanceMap, hsvMap,
            gradMagMap, gradDirMap, localMeanMap, localVarMap,
            contrastMap, edgeMap } = State;

    const idx = iy * w + ix;
    const si  = idx * 4;
    const r   = d[si], g = d[si + 1], b = d[si + 2];
    const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;

    El.inspectSwatch.style.background = hex;
    El.inspectHex.textContent         = hex.toUpperCase();

    El.iR.textContent    = r;
    El.iG.textContent    = g;
    El.iB.textContent    = b;
    El.iGray.textContent = Math.round(grayMap[idx]);
    El.iLum.textContent  = luminanceMap[idx].toFixed(3);

    const H = hsvMap[idx * 3];
    const S = hsvMap[idx * 3 + 1];
    const V = hsvMap[idx * 3 + 2];
    El.iH.textContent = Math.round(H) + '°';
    El.iS.textContent = (S * 100).toFixed(1) + '%';
    El.iV.textContent = (V * 100).toFixed(1) + '%';

    El.fGradMag.textContent   = gradMagMap[idx].toFixed(2);
    El.fGradDir.textContent   = gradDirMap[idx].toFixed(1) + '°';
    El.fContrast.textContent  = contrastMap[idx].toFixed(2);
    El.fVariance.textContent  = localVarMap[idx].toFixed(2);
    El.fLocalMean.textContent = localMeanMap[idx].toFixed(2);
    El.fEdge.textContent      = edgeMap[idx].toFixed(2);
  },

  clearValues() {
    [El.iR,El.iG,El.iB,El.iH,El.iS,El.iV,El.iGray,El.iLum,
     El.fGradMag,El.fGradDir,El.fContrast,El.fVariance,El.fLocalMean,El.fEdge
    ].forEach(el => { if (el) el.textContent = '—'; });
    El.inspectHex.textContent = '—';
    El.inspectSwatch.style.background = '';
  },
};

/* ═══════════════════════════════════════════════════════════════
   CANVAS CONTROL — zoom, pan, interaction
   ═══════════════════════════════════════════════════════════════ */
const CanvasCtrl = {
  initCanvases() {
    const { width: w, height: h } = State;
    El.mainCanvas.width    = w;
    El.mainCanvas.height   = h;
    El.overlayCanvas.width = w;
    El.overlayCanvas.height = h;
    El.canvasStage.style.width  = w + 'px';
    El.canvasStage.style.height = h + 'px';
  },

  /** Reset zoom and pan to fit the image inside the viewport */
  fitToView() {
    const { width: w, height: h } = State;
    const wrapW = El.canvasWrapper.clientWidth  - 32;
    const wrapH = El.canvasWrapper.clientHeight - 32;
    const scale = Math.min(wrapW / w, wrapH / h, 1);
    State.zoom = scale;
    State.panX = 0;
    State.panY = 0;
    this.applyTransform();
  },

  applyTransform() {
    const { zoom, panX, panY } = State;
    El.canvasStage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    El.zoomLabel.textContent = Math.round(zoom * 100) + '%';
  },

  zoomBy(delta, cx, cy) {
    const prevZoom = State.zoom;
    State.zoom = clamp(State.zoom * delta, 0.05, 20);

    // Zoom towards cursor
    if (cx !== undefined) {
      const rect  = El.canvasStage.getBoundingClientRect();
      const ox    = cx - rect.left - rect.width / 2;
      const oy    = cy - rect.top  - rect.height / 2;
      const scale = State.zoom / prevZoom;
      State.panX  = cx - El.canvasWrapper.getBoundingClientRect().left - El.canvasWrapper.clientWidth  / 2 - (cx - El.canvasWrapper.getBoundingClientRect().left - El.canvasWrapper.clientWidth  / 2 - State.panX) * scale;
      State.panY  = cy - El.canvasWrapper.getBoundingClientRect().top  - El.canvasWrapper.clientHeight / 2 - (cy - El.canvasWrapper.getBoundingClientRect().top  - El.canvasWrapper.clientHeight / 2 - State.panY) * scale;
    }

    this.applyTransform();
  },

  /**
   * Convert a pointer event position to image pixel coordinates.
   * Returns null if outside image bounds.
   */
  eventToPixel(e) {
    const rect   = El.canvasStage.getBoundingClientRect();
    const relX   = (e.clientX - rect.left) / State.zoom;
    const relY   = (e.clientY - rect.top)  / State.zoom;
    const ix     = Math.floor(relX);
    const iy     = Math.floor(relY);
    if (ix < 0 || iy < 0 || ix >= State.width || iy >= State.height) return null;
    return { ix, iy };
  },
};

/* ═══════════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════════ */
const Exporter = {
  /** Export extracted region as transparent PNG */
  exportPNG() {
    if (!State.featuresComputed) { alert('No image loaded.'); return; }

    const { srcData: d, width: w, height: h, pixelCount: n, maskData } = State;
    const oc  = document.createElement('canvas');
    oc.width  = w;
    oc.height = h;
    const ctx = oc.getContext('2d');
    const img = ctx.createImageData(w, h);
    const px4 = img.data;

    for (let i = 0; i < n; i++) {
      const i4   = i * 4;
      const keep = !maskData || maskData[i] === 255;
      px4[i4]     = d[i4];
      px4[i4 + 1] = d[i4 + 1];
      px4[i4 + 2] = d[i4 + 2];
      px4[i4 + 3] = keep ? 255 : 0;
    }
    ctx.putImageData(img, 0, 0);
    this._download(oc, 'extracted.png');
  },

  /** Export binary mask as PNG */
  exportMask() {
    if (!State.featuresComputed) { alert('No image loaded.'); return; }

    const { width: w, height: h, pixelCount: n, maskData } = State;
    const oc  = document.createElement('canvas');
    oc.width  = w;
    oc.height = h;
    const ctx = oc.getContext('2d');
    const img = ctx.createImageData(w, h);
    const px4 = img.data;

    for (let i = 0; i < n; i++) {
      const v  = maskData ? maskData[i] : 255;
      const i4 = i * 4;
      px4[i4] = px4[i4 + 1] = px4[i4 + 2] = v;
      px4[i4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    this._download(oc, 'mask.png');
  },

  _download(canvas, filename) {
    canvas.toBlob(blob => {
      const a   = document.createElement('a');
      a.href    = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, 'image/png');
  },
};

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════ */
/** Yield to browser event loop for one frame */
function tick() {
  return new Promise(r => setTimeout(r, 0));
}

/* ═══════════════════════════════════════════════════════════════
   UI — wire events
   ═══════════════════════════════════════════════════════════════ */
const UI = {
  init() {
    this.bindFileInput();
    this.bindCanvasInteraction();
    this.bindControls();
    this.bindFormula();
    this.bindHistogramTabs();
    this.bindToolbar();
    this.bindExport();
    this.bindVarRef();
  },

  /* ── File Input ─────────────────────────────────────────── */
  bindFileInput() {
    El.fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) ImageIO.loadFile(file);
    });

    El.dropZone.addEventListener('click', () => El.fileInput.click());

    El.dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      El.dropZone.classList.add('drag-over');
    });

    El.dropZone.addEventListener('dragleave', () => {
      El.dropZone.classList.remove('drag-over');
    });

    El.dropZone.addEventListener('drop', e => {
      e.preventDefault();
      El.dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) ImageIO.loadFile(file);
    });
  },

  /* ── Canvas Interaction (zoom/pan/pixel pick) ───────────── */
  bindCanvasInteraction() {
    const stage = El.canvasStage;

    // Mouse wheel — zoom
    El.canvasWrapper.addEventListener('wheel', e => {
      if (!State.featuresComputed) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      CanvasCtrl.zoomBy(delta, e.clientX, e.clientY);
    }, { passive: false });

    // Mouse move — update cursor coords + inspector
    stage.addEventListener('mousemove', e => {
      const p = CanvasCtrl.eventToPixel(e);
      if (!p) { El.cursorCoords.textContent = 'x: — y: —'; return; }
      El.cursorCoords.textContent = `x: ${p.ix}  y: ${p.iy}`;

      if (State.interactionMode === 'pan' && State.isPanning) {
        const dx = e.clientX - State.lastPan.x;
        const dy = e.clientY - State.lastPan.y;
        State.panX += dx;
        State.panY += dy;
        State.lastPan = { x: e.clientX, y: e.clientY };
        CanvasCtrl.applyTransform();
      } else {
        // Hover inspector
        Inspector.update(p.ix, p.iy);
        Renderer.drawCrosshair(p.ix, p.iy);
      }
    });

    stage.addEventListener('mouseleave', () => {
      El.cursorCoords.textContent = 'x: — y: —';
      if (State.viewMode !== 'overlay') Renderer.clearOverlay();
    });

    // Mouse down
    stage.addEventListener('mousedown', e => {
      if (State.interactionMode === 'pan') {
        State.isPanning = true;
        State.lastPan   = { x: e.clientX, y: e.clientY };
        stage.style.cursor = 'grabbing';
        return;
      }

      // Select mode — pick reference pixel
      const p = CanvasCtrl.eventToPixel(e);
      if (!p || !State.featuresComputed) return;

      const idx = p.iy * State.width + p.ix;
      const si  = idx * 4;
      State.refR = State.srcData[si];
      State.refG = State.srcData[si + 1];
      State.refB = State.srcData[si + 2];
      State.hasRef = true;

      const hex = `#${State.refR.toString(16).padStart(2,'0')}${State.refG.toString(16).padStart(2,'0')}${State.refB.toString(16).padStart(2,'0')}`;
      El.refColorSwatch.style.background = hex;
      El.refColorText.textContent = `${hex.toUpperCase()}  (${State.refR}, ${State.refG}, ${State.refB})`;
    });

    window.addEventListener('mouseup', () => {
      State.isPanning = false;
      El.canvasStage.style.cursor = State.interactionMode === 'pan' ? 'grab' : 'crosshair';
    });
  },

  /* ── View Mode ──────────────────────────────────────────── */
  bindControls() {
    // View mode radios
    document.getElementById('view-mode-group').addEventListener('change', e => {
      State.viewMode = e.target.value;
      if (State.featuresComputed) {
        Renderer.clearOverlay();
        Renderer.render();
        if (State.viewMode === 'overlay') Renderer.drawOverlay();
      }
    });

    // Edge algorithm
    El.edgeAlgoSel.addEventListener('change', () => {
      State.edgeAlgo = El.edgeAlgoSel.value;
      Features.recomputeEdges();
    });

    // Edge threshold
    El.edgeThresh.addEventListener('input', () => {
      State.edgeThreshold = parseInt(El.edgeThresh.value, 10);
      El.edgeThreshVal.textContent = State.edgeThreshold;
      Features.recomputeEdges();
    });

    // Window size
    El.winSize.addEventListener('input', () => {
      State.windowSize = parseInt(El.winSize.value, 10);
      El.winSizeVal.textContent = State.windowSize;
    });

    // Window size — trigger recompute on release
    El.winSize.addEventListener('change', () => {
      Features.recomputeLocal();
    });

    // Tolerance
    El.toleranceSlider.addEventListener('input', () => {
      State.tolerance = parseInt(El.toleranceSlider.value, 10);
      El.tolVal.textContent = State.tolerance;
    });
  },

  /* ── Formula ────────────────────────────────────────────── */
  bindFormula() {
    document.getElementById('btn-apply').addEventListener('click', () => {
      this.applyFormula();
    });

    El.formulaInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        this.applyFormula();
      }
    });

    document.getElementById('btn-clear-formula').addEventListener('click', () => {
      El.formulaInput.value = '';
      El.formulaError.classList.add('hidden');
      State.maskData   = null;
      State.maskActive = false;
      El.pMaskActive.textContent = 'No';
      Renderer.clearOverlay();
      Renderer.render();
    });
  },

  applyFormula() {
    const expr = El.formulaInput.value.trim();
    El.formulaError.classList.add('hidden');

    if (!expr) {
      State.maskData   = null;
      State.maskActive = false;
      El.pMaskActive.textContent = 'No';
      Renderer.render();
      return;
    }

    if (!State.featuresComputed) {
      El.formulaError.textContent = 'Load an image first.';
      El.formulaError.classList.remove('hidden');
      return;
    }

    const fn = Formula.compile(expr);
    if (!fn) {
      El.formulaError.textContent = 'Syntax error in formula. Check the expression.';
      El.formulaError.classList.remove('hidden');
      return;
    }

    setStatus('busy', 'Applying formula…');
    showProgress(0, 'Running formula on pixels…');

    setTimeout(() => {
      try {
        const mask = Formula.applyMask(fn);
        State.maskData   = mask;
        State.maskActive = true;
        State.formula    = expr;
        El.pMaskActive.textContent = 'Yes';

        // Count included pixels
        let included = 0;
        for (let i = 0; i < mask.length; i++) if (mask[i]) included++;
        const pct = ((included / State.pixelCount) * 100).toFixed(1);

        hideProgress();
        setStatus('ready', `Mask applied — ${included.toLocaleString()} px (${pct}%)`);
        El.formulaError.classList.add('hidden');
        Renderer.render();
      } catch (err) {
        hideProgress();
        setStatus('error', 'Formula error');
        El.formulaError.textContent = 'Runtime error: ' + err.message;
        El.formulaError.classList.remove('hidden');
      }
    }, 20);
  },

  /* ── Histogram Tabs ─────────────────────────────────────── */
  bindHistogramTabs() {
    document.querySelectorAll('.hist-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.hist-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        State.histMode = tab.dataset.hist;
        Histogram.draw();
      });
    });
  },

  /* ── Canvas Toolbar ─────────────────────────────────────── */
  bindToolbar() {
    document.getElementById('btn-zoom-in').addEventListener('click', () =>
      CanvasCtrl.zoomBy(1.25));

    document.getElementById('btn-zoom-out').addEventListener('click', () =>
      CanvasCtrl.zoomBy(1 / 1.25));

    document.getElementById('btn-zoom-fit').addEventListener('click', () =>
      CanvasCtrl.fitToView());

    const btnSelect = document.getElementById('btn-mode-select');
    const btnPan    = document.getElementById('btn-mode-pan');

    btnSelect.addEventListener('click', () => {
      State.interactionMode = 'select';
      btnSelect.classList.add('active');
      btnPan.classList.remove('active');
      El.canvasStage.style.cursor = 'crosshair';
    });

    btnPan.addEventListener('click', () => {
      State.interactionMode = 'pan';
      btnPan.classList.add('active');
      btnSelect.classList.remove('active');
      El.canvasStage.style.cursor = 'grab';
    });
  },

  /* ── Export ─────────────────────────────────────────────── */
  bindExport() {
    document.getElementById('btn-export-png').addEventListener('click', () =>
      Exporter.exportPNG());

    document.getElementById('btn-export-mask').addEventListener('click', () =>
      Exporter.exportMask());

    document.getElementById('btn-reset-all').addEventListener('click', () => {
      // Full reset
      State.maskData   = null;
      State.maskActive = false;
      El.formulaInput.value = '';
      El.formulaError.classList.add('hidden');
      El.pMaskActive.textContent = 'No';
      if (State.featuresComputed) {
        Renderer.clearOverlay();
        Renderer.render();
        setStatus('ready', `Ready — ${State.width}×${State.height}`);
      }
    });
  },

  /* ── Variable Reference ─────────────────────────────────── */
  bindVarRef() {
    document.getElementById('btn-formula-help').addEventListener('click', () => {
      El.varRef.classList.toggle('hidden');
    });
    document.getElementById('btn-close-ref').addEventListener('click', () => {
      El.varRef.classList.add('hidden');
    });
  },

  updateProcInfo() {
    El.pDims.textContent    = `${State.width}×${State.height}`;
    El.pPixels.textContent  = State.pixelCount.toLocaleString();
    El.pWindow.textContent  = `${State.windowSize}×${State.windowSize}`;
    El.pEdgeAlgo.textContent = State.edgeAlgo;
    El.pMaskActive.textContent = State.maskActive ? 'Yes' : 'No';
  },
};

/* ═══════════════════════════════════════════════════════════════
   BOOTSTRAP
   ═══════════════════════════════════════════════════════════════ */
UI.init();
setStatus('idle', 'No image loaded');

/* features.js
   Pure computation module: color space conversions + feature map generation.
   Everything is computed once per loaded image and cached on a FeatureStore
   instance, so switching feature maps / hovering pixels never re-scans
   the whole image more than necessary.
*/

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return [h, s * 100, v * 100];
}

// sRGB -> CIE LAB (D65 reference white)
function rgbToLab(r, g, b) {
  let [rl, gl, bl] = [r, g, b].map(v => {
    v /= 255;
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
  });
  let x = rl * 0.4124 + gl * 0.3576 + bl * 0.1805;
  let y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
  let z = rl * 0.0193 + gl * 0.1192 + bl * 0.9505;
  const refX = 0.95047, refY = 1.0, refZ = 1.08883;
  x /= refX; y /= refY; z /= refZ;
  const f = t => t > 0.008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116);
  const fx = f(x), fy = f(y), fz = f(z);
  const L = (y > 0.008856) ? (116 * fy - 16) : (903.3 * y);
  const A = 500 * (fx - fy);
  const B = 200 * (fy - fz);
  return [L, A, B];
}

class FeatureStore {
  constructor(imageData) {
    this.w = imageData.width;
    this.h = imageData.height;
    this.data = imageData.data;
    this.n = this.w * this.h;
    this._cache = {};
    this._buildBaseArrays();
  }

  idx(x, y) { return y * this.w + x; }

  _buildBaseArrays() {
    const n = this.n;
    const gray = new Float32Array(n);
    const hue = new Float32Array(n);
    const sat = new Float32Array(n);
    const val = new Float32Array(n);
    const lum = new Float32Array(n);
    const L = new Float32Array(n);
    const A = new Float32Array(n);
    const B = new Float32Array(n);
    const d = this.data;
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      const r = d[p], g = d[p + 1], b = d[p + 2];
      gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      lum[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const [h, s, v] = rgbToHsv(r, g, b);
      hue[i] = h; sat[i] = s; val[i] = v;
      const [ll, aa, bb] = rgbToLab(r, g, b);
      L[i] = ll; A[i] = aa; B[i] = bb;
    }
    this.gray = gray; this.hue = hue; this.sat = sat; this.val = val; this.lum = lum;
    this.L = L; this.A = A; this.B = B;
  }

  // generic 3x3 convolution over grayscale, returns Float32Array
  _convolve3(kernel) {
    const { w, h, gray } = this;
    const out = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let sum = 0, k = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            sum += gray[(y + dy) * w + (x + dx)] * kernel[k++];
          }
        }
        out[y * w + x] = sum;
      }
    }
    return out;
  }

  sobel() {
    if (this._cache.sobel) return this._cache.sobel;
    const gx = this._convolve3([-1, 0, 1, -2, 0, 2, -1, 0, 1]);
    const gy = this._convolve3([-1, -2, -1, 0, 0, 0, 1, 2, 1]);
    const mag = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) mag[i] = Math.hypot(gx[i], gy[i]);
    this._cache.sobel = { gx, gy, mag };
    return this._cache.sobel;
  }

  prewitt() {
    if (this._cache.prewitt) return this._cache.prewitt;
    const gx = this._convolve3([-1, 0, 1, -1, 0, 1, -1, 0, 1]);
    const gy = this._convolve3([-1, -1, -1, 0, 0, 0, 1, 1, 1]);
    const mag = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) mag[i] = Math.hypot(gx[i], gy[i]);
    this._cache.prewitt = { gx, gy, mag };
    return this._cache.prewitt;
  }

  laplacian() {
    if (this._cache.laplacian) return this._cache.laplacian;
    this._cache.laplacian = this._convolve3([0, 1, 0, 1, -4, 1, 0, 1, 0]);
    return this._cache.laplacian;
  }

  gradientMagnitude() {
    return this.sobel().mag;
  }

  gradientDirection() {
    if (this._cache.gradDir) return this._cache.gradDir;
    const { gx, gy } = this.sobel();
    const out = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) out[i] = Math.atan2(gy[i], gx[i]) * 180 / Math.PI;
    this._cache.gradDir = out;
    return out;
  }

  // local statistics in a window (default 5x5): mean, variance, contrast (max-min)
  localStats(radius = 2) {
    const key = 'local_' + radius;
    if (this._cache[key]) return this._cache[key];
    const { w, h, gray } = this;
    const mean = new Float32Array(w * h);
    const variance = new Float32Array(w * h);
    const contrast = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0, sumSq = 0, count = 0, mn = 255, mx = 0;
        for (let dy = -radius; dy <= radius; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= h) continue;
          for (let dx = -radius; dx <= radius; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= w) continue;
            const v = gray[yy * w + xx];
            sum += v; sumSq += v * v; count++;
            if (v < mn) mn = v;
            if (v > mx) mx = v;
          }
        }
        const m = sum / count;
        mean[y * w + x] = m;
        variance[y * w + x] = (sumSq / count) - (m * m);
        contrast[y * w + x] = mx - mn;
      }
    }
    this._cache[key] = { mean, variance, contrast };
    return this._cache[key];
  }

  // full per-pixel feature vector for inspector / sampling / formula engine
  getPixelFeatures(x, y) {
    x = Math.max(0, Math.min(this.w - 1, x));
    y = Math.max(0, Math.min(this.h - 1, y));
    const i = this.idx(x, y);
    const p = i * 4;
    const r = this.data[p], g = this.data[p + 1], b = this.data[p + 2];
    const [hh, ss, ll] = rgbToHsl(r, g, b);
    const local = this.localStats(2);
    return {
      x, y, r, g, b,
      hex: rgbToHex(r, g, b),
      hue: this.hue[i], sat: this.sat[i], val: this.val[i],
      hslH: hh, hslS: ss, hslL: ll,
      L: this.L[i], A: this.A[i], B: this.B[i],
      lum: this.lum[i], gray: this.gray[i],
      gradientMagnitude: this.gradientMagnitude()[i],
      gradientDirection: this.gradientDirection()[i],
      edge: this.gradientMagnitude()[i], // alias for formula convenience
      localMean: local.mean[i],
      variance: local.variance[i],
      contrast: local.contrast[i]
    };
  }

  // returns a Float32Array feature map for the "feature map viewer"
  getFeatureMap(name) {
    switch (name) {
      case 'gray': return this.gray;
      case 'hue': return this.hue;
      case 'sat': return this.sat;
      case 'val': return this.val;
      case 'lum': return this.lum;
      case 'gradmag': return this.gradientMagnitude();
      case 'graddir': return this.gradientDirection();
      case 'sobel': return this.sobel().mag;
      case 'prewitt': return this.prewitt().mag;
      case 'laplacian': return this.laplacian();
      case 'localmean': return this.localStats(2).mean;
      case 'localvar': return this.localStats(2).variance;
      case 'localcontrast': return this.localStats(2).contrast;
      default: return null;
    }
  }
}

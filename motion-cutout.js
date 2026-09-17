/* Local uniform-background removal. The complete factory is portable via toString(). */
window.createHangoverCutout = function createHangoverCutout() {
  'use strict';
  const MAX_SIDE = 2048, MAX_PIXELS = 4194304, MAX_URL = 16 * 1024 * 1024;
  let pending = Promise.resolve();
  const pause = () => new Promise(resolve => setTimeout(resolve, 0));
  const serial = operation => {
    const result = pending.then(operation);
    pending = result.catch(() => {});
    return result;
  };
  function dimensions(width, height) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > MAX_SIDE || height > MAX_SIDE || width * height > MAX_PIXELS) {
      throw Error('Immagine troppo grande: massimo 2048 px per lato e 4 megapixel. Ridimensionala prima di rimuovere lo sfondo.');
    }
  }
  function validate(src) {
    if (typeof src !== 'string' || src.length > MAX_URL) throw Error('Immagine non valida o troppo pesante (massimo 16 MB in memoria).');
    const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=\r\n]+)$/.exec(src);
    if (!match) throw Error('Usa un’immagine locale PNG, JPG o WebP.');
    let bytes;
    try { bytes = atob(match[2].replace(/[\r\n]/g, '')); } catch (_) { throw Error('I dati dell’immagine non sono validi.'); }
    const b = i => bytes.charCodeAt(i), u16 = i => b(i) * 256 + b(i + 1);
    const be32 = i => b(i) * 16777216 + b(i + 1) * 65536 + b(i + 2) * 256 + b(i + 3);
    const le32 = i => b(i) + b(i + 1) * 256 + b(i + 2) * 65536 + b(i + 3) * 16777216;
    let width = 0, height = 0;
    if (match[1] === 'png' && bytes.slice(0, 8) === '\x89PNG\r\n\x1a\n' && bytes.slice(12, 16) === 'IHDR') {
      width = be32(16); height = be32(20);
      for (let p = 8; p + 12 <= bytes.length;) {
        const length = be32(p), type = bytes.slice(p + 4, p + 8);
        if (type === 'acTL') throw Error('Usa un’immagine ferma: i PNG animati non sono supportati.');
        if (!Number.isFinite(length) || p + length + 12 > bytes.length) break;
        p += length + 12;
      }
    } else if (match[1] === 'jpeg' && b(0) === 255 && b(1) === 216) {
      for (let p = 2; p + 4 < bytes.length;) {
        if (b(p++) !== 255) break;
        while (b(p) === 255) p++;
        const marker = b(p++);
        if (marker === 217 || marker === 218) break;
        if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
        const length = u16(p);
        if (length < 2 || p + length > bytes.length) break;
        if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker) && length >= 8) {
          height = u16(p + 3); width = u16(p + 5); break;
        }
        p += length;
      }
    } else if (match[1] === 'webp' && bytes.slice(0, 4) === 'RIFF' && bytes.slice(8, 12) === 'WEBP') {
      for (let p = 12; p + 8 <= bytes.length;) {
        const type = bytes.slice(p, p + 4), length = le32(p + 4), q = p + 8;
        if (!Number.isFinite(length) || q + length > bytes.length) break;
        if (type === 'VP8X' && length >= 10) {
          if (b(q) & 2) throw Error('Usa un’immagine ferma: i WebP animati non sono supportati.');
          width = 1 + b(q + 4) + b(q + 5) * 256 + b(q + 6) * 65536;
          height = 1 + b(q + 7) + b(q + 8) * 256 + b(q + 9) * 65536; break;
        }
        if (type === 'VP8L' && length >= 5 && b(q) === 47) {
          const packed = le32(q + 1); width = 1 + (packed & 16383); height = 1 + ((packed >>> 14) & 16383); break;
        }
        if (type === 'VP8 ' && length >= 10 && b(q + 3) === 157 && b(q + 4) === 1 && b(q + 5) === 42) {
          width = (b(q + 6) + b(q + 7) * 256) & 16383; height = (b(q + 8) + b(q + 9) * 256) & 16383; break;
        }
        p = q + length + (length & 1);
      }
    }
    if (!width || !height) throw Error('Formato o intestazione dell’immagine non leggibile.');
    dimensions(width, height);
    return { src, mime: match[1], width, height };
  }
  async function read(input) {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      const timer = setTimeout(() => { img.onload = img.onerror = null; reject(Error('L’immagine impiega troppo tempo a caricarsi. Prova un file più piccolo.')); }, 15000);
      img.onload = () => { clearTimeout(timer); img.onload = img.onerror = null; resolve(img); };
      img.onerror = () => { clearTimeout(timer); img.onload = img.onerror = null; reject(Error('Non riesco a leggere questa immagine.')); };
      img.src = input.src;
    });
    const width = image.naturalWidth || image.width, height = image.naturalHeight || image.height;
    dimensions(width, height);
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw Error('Il browser non rende disponibile il canvas.');
    try { ctx.drawImage(image, 0, 0); return { canvas, ctx, pixels: ctx.getImageData(0, 0, width, height), width, height }; }
    catch (_) { canvas.width = canvas.height = 1; throw Error('Non riesco a elaborare i pixel dell’immagine.'); }
  }
  function borderColor(data, width, height) {
    const bins = new Float64Array(4096), sums = new Float64Array(4096 * 3);
    function sample(i) {
      const p = i * 4, alpha = data[p + 3] / 255;
      if (alpha < .25) return;
      const key = ((data[p] >> 4) << 8) | ((data[p + 1] >> 4) << 4) | (data[p + 2] >> 4);
      bins[key] += alpha; for (let c = 0; c < 3; c++) sums[key * 3 + c] += data[p + c] * alpha;
    }
    for (let x = 0; x < width; x++) { sample(x); if (height > 1) sample((height - 1) * width + x); }
    for (let y = 1; y < height - 1; y++) { sample(y * width); if (width > 1) sample(y * width + width - 1); }
    let best = 0; for (let k = 1; k < bins.length; k++) if (bins[k] > bins[best]) best = k;
    if (!bins[best]) return '#ffffff';
    return '#' + [0, 1, 2].map(c => Math.round(sums[best * 3 + c] / bins[best]).toString(16).padStart(2, '0')).join('');
  }
  function color(value) {
    if (typeof value !== 'string' || !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) throw Error('Scegli un colore esadecimale valido, per esempio #ffffff.');
    const hex = value.length === 4 ? value.slice(1).split('').map(c => c + c).join('') : value.slice(1);
    return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
  }
  async function inspect(dataURL) {
    const input = validate(dataURL);
    return serial(async () => {
      const item = await read(input);
      try {
        let hasAlpha = false; const data = item.pixels.data;
        for (let p = 3; p < data.length; p += 4) if (data[p] < 255) { hasAlpha = true; break; }
        return { hasAlpha, width: item.width, height: item.height, suggestedColor: borderColor(data, item.width, item.height) };
      } finally { item.canvas.width = item.canvas.height = 1; }
    });
  }
  async function remove(dataURL, options = {}) {
    const input = validate(dataURL);
    if (!options || typeof options !== 'object') throw Error('Opzioni di rimozione non valide.');
    const tolerance = options.tolerance === undefined ? 12 : options.tolerance;
    if (typeof tolerance !== 'number' || !Number.isFinite(tolerance) || tolerance < 0 || tolerance > 100) throw Error('La tolleranza deve essere un numero fra 0 e 100.');
    const chosen = options.color === undefined ? null : color(options.color);
    return serial(async () => {
      const item = await read(input);
      try {
        const { width, height, pixels, ctx, canvas } = item, source = pixels.data, count = width * height;
        const bg = chosen || color(borderColor(source, width, height));
        const core = tolerance * 2.55, feather = 8 + Math.min(22, core * .35), soft = Math.min(255, core + feather), core2 = core * core, soft2 = soft * soft;
        const mask = new Uint8Array(count), queue = new Uint32Array(count); let head = 0, tail = 0;
        const distance2 = i => { const p = i * 4, r = source[p] - bg[0], g = source[p + 1] - bg[1], b = source[p + 2] - bg[2]; return (r * r + g * g + b * b) / 3; };
        function visit(i) {
          if (mask[i]) return;
          // Existing transparent pixels are barriers, not bridges to opaque white artwork.
          if (source[i * 4 + 3] === 0 || distance2(i) > soft2) { mask[i] = 2; return; }
          mask[i] = 1; queue[tail++] = i;
        }
        for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
        for (let y = 1; y < height - 1; y++) { visit(y * width); visit(y * width + width - 1); }
        while (head < tail) {
          const i = queue[head++], x = i % width;
          if (x) visit(i - 1); if (x < width - 1) visit(i + 1); if (i >= width) visit(i - width); if (i < count - width) visit(i + width);
          if (head % 100000 === 0) await pause();
        }
        if (!tail) return { src: input.mime === 'png' ? input.src : canvas.toDataURL('image/png'), removedFraction: 0, width, height };
        const output = new Uint8ClampedArray(source); let totalAlpha = 0, removedAlpha = 0;
        function besideCut(i, x) { return (x > 0 && mask[i - 1] === 1) || (x + 1 < width && mask[i + 1] === 1) || (i >= width && mask[i - width] === 1) || (i + width < count && mask[i + width] === 1); }
        function edgeCoverage(i, x, y) {
          let ref = -1, best = soft2;
          for (let yy = Math.max(0, y - 2); yy <= Math.min(height - 1, y + 2); yy++) for (let xx = Math.max(0, x - 2); xx <= Math.min(width - 1, x + 2); xx++) {
            const j = yy * width + xx; if (mask[j] === 1 || source[j * 4 + 3] < 250) continue;
            const d = distance2(j); if (d > best) { best = d; ref = j; }
          }
          if (ref < 0) return null;
          let dot = 0, norm = 0; for (let c = 0; c < 3; c++) { const v = source[ref * 4 + c] - bg[c]; dot += (source[i * 4 + c] - bg[c]) * v; norm += v * v; }
          const coverage = dot / norm; if (coverage < 0 || coverage > 1) return null;
          let residual = 0; for (let c = 0; c < 3; c++) residual += Math.pow(source[i * 4 + c] - bg[c] - coverage * (source[ref * 4 + c] - bg[c]), 2);
          return residual / 3 <= Math.pow(Math.max(6, feather * .5), 2) ? coverage : null;
        }
        for (let i = 0; i < count; i++) {
          const p = i * 4, alpha = source[p + 3]; totalAlpha += alpha; if (!alpha) continue;
          const x = i % width, y = Math.floor(i / width), d = distance2(i); let keep = 1;
          if (mask[i] === 1) {
            if (d <= core2) keep = 0;
            else { const t = Math.min(1, Math.max(0, (Math.sqrt(d) - core) / Math.max(.001, soft - core))); keep = t * t * (3 - 2 * t); const matte = edgeCoverage(i, x, y); if (matte !== null) keep = Math.min(keep, matte); }
          } else if (alpha === 255 && besideCut(i, x)) {
            const matte = edgeCoverage(i, x, y); if (matte !== null && matte > .01 && matte < .99) keep = matte;
          }
          if (keep < 1) {
            output[p + 3] = Math.round(alpha * keep); removedAlpha += alpha - output[p + 3];
            if (output[p + 3] && keep > .001) for (let c = 0; c < 3; c++) output[p + c] = Math.max(0, Math.min(255, Math.round((source[p + c] - (1 - keep) * bg[c]) / keep)));
            else output[p] = output[p + 1] = output[p + 2] = 0;
          }
          if (i && i % 200000 === 0) await pause();
        }
        pixels.data.set(output); ctx.putImageData(pixels, 0, 0);
        const src = canvas.toDataURL('image/png'); if (!src.startsWith('data:image/png;base64,')) throw Error('Il browser non riesce a esportare il PNG.');
        return { src, removedFraction: totalAlpha ? removedAlpha / totalAlpha : 0, width, height };
      } finally { item.canvas.width = item.canvas.height = 1; }
    });
  }
  return { inspect, remove };
};

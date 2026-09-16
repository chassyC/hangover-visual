/* HANGOVER identity: one canonical SVG and independent dimension controls. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (!root || !root.document) return;
  root.HangoverLogoControls = api;
  const start = () => api.init(root.document, root);
  if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const LIMITS = Object.freeze({ width: [50, 150], height: [50, 150], depth: [0, 100] });
  const DEFAULTS = Object.freeze({ width: 100, height: 100, depth: 0 });
  const LABELS = Object.freeze({ word: 'HANGOVER', split: 'HANG / OVER', h: 'H', hg: 'HG', hgr: 'HGR' });
  const LAYERS = 36;
  // The supplied paths have sub-unit overshoots beyond their declared box.
  const BLEED = 1;
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const normalized = (value, key) => clamp(Number.isFinite(Number(value)) ? Number(value) : DEFAULTS[key], ...LIMITS[key]);

  function composition(key, glyphs) {
    if (!Object.prototype.hasOwnProperty.call(LABELS, key)) key = 'word';
    if (key === 'split') {
      const top = glyphs.hang, bottom = glyphs.over;
      const width = Math.max(top.width, bottom.width);
      const gap = Math.round(Math.max(top.height, bottom.height) * 0.1);
      return {
        key, label: LABELS[key], width, height: top.height + gap + bottom.height,
        rows: [
          { glyph: top, x: (width - top.width) / 2, y: 0 },
          { glyph: bottom, x: (width - bottom.width) / 2, y: top.height + gap }
        ]
      };
    }
    const glyph = glyphs[key === 'word' ? 'hangover' : key];
    return { key, label: LABELS[key], width: glyph.width, height: glyph.height, rows: [{ glyph, x: 0, y: 0 }] };
  }

  /**
   * Reserve the maximum envelope once, regardless of the current sliders.
   * Width changes only scaleX; height changes only scaleY. Increasing depth
   * never shrinks the front face. The hard shadow is included in the fit.
   */
  function layout(shape, viewportWidth, viewportHeight, values) {
    const width = Math.max(1, Number(viewportWidth) || 1);
    const height = Math.max(1, Number(viewportHeight) || 1);
    const inset = Math.min(width, height) * 0.045;
    const maximumDepth = Math.min(width, height) * 0.13;
    const maximumShadowX = maximumDepth * 1.15;
    const maximumShadowY = maximumDepth * 0.98;
    const scale = Math.min(
      (width - 2 * inset - maximumShadowX) / ((shape.width + 2 * BLEED) * LIMITS.width[1] / 100),
      (height - 2 * inset - maximumShadowY) / ((shape.height + 2 * BLEED) * LIMITS.height[1] / 100)
    );
    const scaleX = scale * normalized(values.width, 'width') / 100;
    const scaleY = scale * normalized(values.height, 'height') / 100;
    const depth = maximumDepth * normalized(values.depth, 'depth') / 100;
    const depthX = depth * 0.78, depthY = depth * 0.62;
    const shadowX = depth * 1.15, shadowY = depth * 0.98;
    const frontWidth = shape.width * scaleX, frontHeight = shape.height * scaleY;
    const x = (width - frontWidth - shadowX) / 2;
    const y = (height - frontHeight - shadowY) / 2;
    return {
      width, height, x, y, scale, scaleX, scaleY, frontWidth, frontHeight,
      depthX, depthY, shadowX, shadowY,
      bounds: {
        left: x - BLEED * scaleX, top: y - BLEED * scaleY,
        right: x + frontWidth + BLEED * scaleX + shadowX,
        bottom: y + frontHeight + BLEED * scaleY + shadowY
      }
    };
  }

  function init(doc, win) {
    const preview = doc.getElementById('identityPreview');
    const canvas = doc.getElementById('identityCanvas');
    const glyphs = win.HANGOVER_STUDIO_DATA && win.HANGOVER_STUDIO_DATA.glyphs;
    const controls = {
      width: doc.getElementById('letterWidth'),
      height: doc.getElementById('letterHeight'),
      depth: doc.getElementById('letterDepth')
    };
    if (!preview || !canvas || !glyphs || Object.values(controls).some(input => !input)) return false;
    if (preview.dataset.logoControls === 'ready') return true;
    if (['hangover', 'hang', 'over', 'h', 'hg', 'hgr'].some(key => !glyphs[key] || !glyphs[key].paths)) return false;

    const section = canvas.closest('section') || doc;
    const lockups = Array.from(section.querySelectorAll('button[data-lockup]'));
    const palettes = Array.from(section.querySelectorAll('button[data-palette]'));
    const initial = lockups.find(button => button.getAttribute('aria-pressed') === 'true');
    let selected = initial ? initial.dataset.lockup : 'word';
    let shape = composition(selected, glyphs);
    const values = { ...DEFAULTS };
    let frame = 0;

    const make = (name, attributes = {}) => {
      const element = doc.createElementNS(NS, name);
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
      return element;
    };
    const svg = make('svg', { class: 'logo-control-svg', role: 'img', 'aria-labelledby': 'identitySvgTitle', preserveAspectRatio: 'xMidYMid meet' });
    const title = make('title', { id: 'identitySvgTitle' });
    const defs = make('defs');
    const source = make('g', { id: 'identityCanonicalShape', 'fill-rule': 'evenodd' });
    const gradient = make('linearGradient', { id: 'identityChrome', x1: '0%', y1: '10%', x2: '100%', y2: '80%' });
    [
      ['0%', 'currentColor', 1], ['26%', 'currentColor', 1], ['39%', '#ffffff', 0.96],
      ['49%', 'currentColor', 1], ['59%', '#ffffff', 0.66], ['76%', 'currentColor', 1], ['100%', 'currentColor', 1]
    ].forEach(([offset, color, opacity]) => gradient.append(make('stop', { offset, 'stop-color': color, 'stop-opacity': opacity })));
    defs.append(source, gradient);
    const shadow = make('use', { href: '#identityCanonicalShape', class: 'logo-control-shadow', 'aria-hidden': 'true' });
    const extrusion = make('g', { class: 'logo-control-extrusion', 'aria-hidden': 'true' });
    const layers = [];
    // Back to front: closely spaced actual vector copies form visible sidewalls.
    for (let index = LAYERS; index >= 1; index--) {
      const layer = make('use', { href: '#identityCanonicalShape' });
      layer.style.fill = index % 6 === 0 ? 'var(--logo-edge)' : 'var(--logo-side)';
      layers.push({ element: layer, amount: index / LAYERS });
      extrusion.append(layer);
    }
    const face = make('use', { href: '#identityCanonicalShape', class: 'logo-control-face', fill: 'url(#identityChrome)' });
    svg.append(title, defs, shadow, extrusion, face);

    function setShape() {
      shape = composition(selected, glyphs);
      selected = shape.key;
      source.replaceChildren();
      shape.rows.forEach(row => {
        const group = make('g', { transform: `translate(${row.x} ${row.y})` });
        row.glyph.paths.forEach(path => {
          const [x, y] = path.translate || [0, 0];
          group.append(make('path', { d: path.d, transform: `translate(${x} ${y})` }));
        });
        source.append(group);
      });
      lockups.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lockup === selected)));
      preview.dataset.lockup = selected;
    }

    function render() {
      frame = 0;
      const box = preview.getBoundingClientRect();
      if (box.width <= 0 || box.height <= 0) return;
      const geometry = layout(shape, box.width, box.height, values);
      const transform = (dx, dy) => `translate(${geometry.x + dx} ${geometry.y + dy}) scale(${geometry.scaleX} ${geometry.scaleY})`;
      svg.setAttribute('viewBox', `0 0 ${geometry.width} ${geometry.height}`);
      face.setAttribute('transform', transform(0, 0));
      shadow.setAttribute('transform', transform(geometry.shadowX, geometry.shadowY));
      const hasDepth = values.depth > 0;
      shadow.setAttribute('display', hasDepth ? 'inline' : 'none');
      extrusion.setAttribute('display', hasDepth ? 'inline' : 'none');
      layers.forEach(layer => layer.element.setAttribute('transform', transform(geometry.depthX * layer.amount, geometry.depthY * layer.amount)));
      title.textContent = `Logo ${shape.label}: larghezza ${values.width}%, altezza ${values.height}%, profondità ${values.depth}%`;
      preview.dataset.width = String(values.width);
      preview.dataset.height = String(values.height);
      preview.dataset.depth = String(values.depth);
    }

    function schedule() {
      if (!frame) frame = win.requestAnimationFrame(render);
    }

    function readControl(key) {
      const input = controls[key];
      values[key] = normalized(input.value, key);
      input.value = String(values[key]);
      input.setAttribute('aria-valuetext', `${values[key]} per cento${key === 'depth' && values[key] === 0 ? ', piatto' : ''}`);
      const output = doc.getElementById(input.id + 'Value');
      if (output) output.value = values[key] + '%';
    }

    Object.keys(controls).forEach(key => {
      const input = controls[key];
      input.min = String(LIMITS[key][0]);
      input.max = String(LIMITS[key][1]);
      input.step = '1';
      readControl(key);
      input.addEventListener('input', () => { readControl(key); schedule(); });
      input.addEventListener('change', () => { readControl(key); schedule(); });
    });
    lockups.forEach(button => button.addEventListener('click', () => {
      selected = button.dataset.lockup;
      setShape();
      schedule();
    }));
    palettes.forEach(button => button.addEventListener('click', () => {
      canvas.dataset.palette = button.dataset.palette;
      palettes.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    }));
    const reset = section.querySelector('[data-logo-reset]');
    if (reset) reset.addEventListener('click', () => {
      Object.keys(controls).forEach(key => { controls[key].value = String(DEFAULTS[key]); readControl(key); });
      schedule();
    });

    setShape();
    preview.replaceChildren(svg);
    preview.style.removeProperty('width');
    // The SVG has its own accessible name; avoid announcing the wrapper twice.
    preview.removeAttribute('aria-label');
    preview.dataset.logoControls = 'ready';
    if (win.ResizeObserver) {
      const observer = new win.ResizeObserver(schedule);
      observer.observe(preview);
    } else win.addEventListener('resize', schedule, { passive: true });
    render();
    return true;
  }

  return Object.freeze({ init, composition, layout, limits: LIMITS, defaults: DEFAULTS });
});

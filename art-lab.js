/* HANGOVER / art direction. Original glyphs are read unchanged from font-data.js. */
(function () {
  'use strict';

  const LETTERS = ['H', 'A', 'N', 'G', 'O', 'V', 'E', 'R'];
  const COLORS = [
    { id: 'cobalt', name: 'Cobalto', hex: '#064ccc' },
    { id: 'ice', name: 'Ghiaccio', hex: '#b7dff5' },
    { id: 'orange', name: 'Arancio', hex: '#ff5028' },
    { id: 'night', name: 'Notte', hex: '#080b0d' },
    { id: 'paper', name: 'Carta', hex: '#efece2' },
    { id: 'acid', name: 'Acido', hex: '#d9f92c' }
  ];
  const DEFAULT_COLORS = ['cobalt', 'ice', 'orange'];
  const NS = 'http://www.w3.org/2000/svg';

  function rgb(hex) {
    return [1, 3, 5].map(function (i) { return parseInt(hex.slice(i, i + 2), 16); });
  }

  function luminance(hex) {
    const values = rgb(hex).map(function (v) {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  }

  function contrast(a, b) {
    const values = [luminance(a), luminance(b)].sort(function (x, y) { return y - x; });
    return (values[0] + 0.05) / (values[1] + 0.05);
  }

  function textColor(background) {
    return contrast(background, '#ffffff') > contrast(background, '#080b0d') ? '#ffffff' : '#080b0d';
  }

  function mix(a, b, weight) {
    const first = rgb(a), second = rgb(b);
    return '#' + first.map(function (value, i) {
      return Math.round(value * (1 - weight) + second[i] * weight).toString(16).padStart(2, '0');
    }).join('');
  }

  function palette(ids) {
    let selected = COLORS.filter(function (color) { return ids.indexOf(color.id) !== -1; });
    if (!selected.length) selected = COLORS.filter(function (color) { return DEFAULT_COLORS.indexOf(color.id) !== -1; });
    const background = selected.slice().sort(function (a, b) { return luminance(a.hex) - luminance(b.hex); })[0];
    const preference = ['orange', 'acid', 'ice', 'paper', 'cobalt', 'night'];
    const foreground = preference.map(function (id) {
      return selected.find(function (color) { return color.id === id && color.id !== background.id; });
    }).find(Boolean);
    if (!foreground) {
      const mono = mix(background.hex, textColor(background.hex), 0.92);
      return {
        selected: selected, background: background.hex, foreground: mono,
        echoes: [mix(background.hex, mono, 0.45)], ink: textColor(background.hex),
        roles: [{ id: background.id, role: 'fondo' }]
      };
    }
    const rest = selected.filter(function (color) { return color !== background && color !== foreground; });
    return {
      selected: selected, background: background.hex, foreground: foreground.hex,
      echoes: rest.length ? rest.map(function (color) { return color.hex; }) : [mix(background.hex, foreground.hex, 0.48)],
      ink: textColor(background.hex),
      roles: selected.map(function (color) {
        return { id: color.id, role: color === background ? 'fondo' : color === foreground ? 'segno' : 'eco' };
      })
    };
  }

  function geometry(glyph, echoCount) {
    // A square leaves a 72+ unit margin for the full sign and its diagonal echoes.
    // The offset belongs to the source drawing, and must be removed before centering.
    const scale = 390 / Math.max(glyph.width, glyph.height);
    const width = glyph.width * scale, height = glyph.height * scale;
    const spread = 54, offset = Number(glyph.offset) || 0;
    const x = (600 - width) / 2 + spread / 2;
    const y = (600 - height) / 2 - spread / 2;
    const layers = [];
    for (let i = echoCount; i > 0; i -= 1) {
      const shift = spread * i / echoCount;
      layers.push({ x: x - shift, y: y + shift, colorIndex: i - 1 });
    }
    return {
      scale: scale, x: x, y: y, offset: offset, layers: layers,
      bounds: { left: x - spread, top: y, right: x + width, bottom: y + height + spread }
    };
  }

  function escape(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function svg(glyph, letter, colors, effects) {
    const p = palette(colors), g = geometry(glyph, p.echoes.length);
    const transform = function (x, y) {
      return 'translate(' + x.toFixed(4) + ' ' + y.toFixed(4) + ') scale(' + g.scale.toFixed(6) + ') translate(' + (-g.offset) + ' ' + (-g.offset) + ')';
    };
    const path = escape(glyph.d);
    const outlines = contrast(p.foreground, p.background) < 2.4 ? ' stroke="' + p.ink + '" stroke-width="0.65"' : '';
    const echoes = g.layers.map(function (layer) {
      return '<path data-art-layer="echo" fill="' + p.echoes[layer.colorIndex] + '" transform="' + transform(layer.x, layer.y) + '" d="' + path + '"/>';
    }).join('');
    return '<svg xmlns="' + NS + '" viewBox="0 0 600 600" width="600" height="600" aria-hidden="true" focusable="false">' +
      '<defs><pattern id="art-lab-grid" width="75" height="75" patternUnits="userSpaceOnUse"><path d="M75 0H0V75" fill="none" stroke="' + p.ink + '" stroke-width="0.7" opacity="0.13"/></pattern>' +
      '<linearGradient id="art-lab-chrome" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.1"/><stop offset="0.24" stop-color="#ffffff" stop-opacity="0.56"/><stop offset="0.3" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.46" stop-color="#080b0d" stop-opacity="0.5"/><stop offset="0.485" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.1"/><stop offset="0.74" stop-color="#080b0d" stop-opacity="0.24"/><stop offset="0.85" stop-color="#ffffff" stop-opacity="0.65"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
      '<filter id="art-lab-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="17" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>' +
      '<rect data-art-layer="background" width="600" height="600" fill="' + p.background + '"/>' +
      '<rect width="600" height="600" fill="url(#art-lab-grid)"/>' +
      '<g fill-rule="evenodd">' + echoes + '<path data-art-layer="main" fill="' + p.foreground + '" transform="' + transform(g.x, g.y) + '" d="' + path + '"' + outlines + '/>' +
      (effects.chrome ? '<path data-art-layer="chrome" fill="url(#art-lab-chrome)" transform="' + transform(g.x, g.y) + '" d="' + path + '"/>' : '') + '</g>' +
      (effects.grain ? '<rect data-art-layer="grain" width="600" height="600" filter="url(#art-lab-grain)" opacity="0.09"/>' : '') +
      '<g fill="none" stroke="' + p.ink + '" stroke-width="1" opacity="0.65"><path d="M24 42V24H42M558 24H576V42M24 558V576H42M558 576H576V558"/></g></svg>';
  }

  // Export deterministic drawing helpers only in Node, for the local evidence run.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { letters: LETTERS, colors: COLORS, defaultColors: DEFAULT_COLORS, palette: palette, geometry: geometry, svg: svg, contrast: contrast, textColor: textColor };
  }
  if (typeof document === 'undefined') return;

  function init() {
    const root = document.querySelector('#stile');
    if (!root || root.dataset.artLabReady) return;
    const canvas = root.querySelector('[data-art-canvas]');
    const stage = root.querySelector('[data-art-stage]');
    const font = window.HANGOVER_FONT;
    if (!canvas || !stage || !font || !font.glyphs || !LETTERS.every(function (letter) { return font.glyphs[letter]; })) return;
    root.dataset.artLabReady = 'true';
    const state = { letter: 'G', colors: DEFAULT_COLORS.slice(), chrome: false, grain: true };
    const status = root.querySelector('[data-art-status]');
    const count = root.querySelector('[data-art-color-count]');
    const label = root.querySelector('[data-art-letter-label]');
    const letterButtons = Array.from(root.querySelectorAll('[data-art-letter]'));
    const colorButtons = Array.from(root.querySelectorAll('[data-art-color]'));
    const effectButtons = Array.from(root.querySelectorAll('[data-art-effect]'));
    const contrastMark = root.querySelector('.art-contrast .hgr');

    function render(announce) {
      const p = palette(state.colors);
      canvas.innerHTML = svg(font.glyphs[state.letter], state.letter, state.colors, state);
      stage.style.setProperty('--art-stage-ink', p.ink);
      stage.style.setProperty('--art-stage-bg', p.background);
      const description = 'Lettera ' + state.letter + ', ' + p.selected.map(function (c) { return c.name.toLowerCase(); }).join(', ') +
        (state.chrome ? ', cromo' : '') + (state.grain ? ', grana' : '');
      stage.setAttribute('aria-label', description + '. Segno completo con echi di colore.');
      if (label) label.textContent = state.letter + ' / IN THE MIX';
      if (count) count.textContent = state.colors.length + (state.colors.length === 1 ? ' COLORE' : ' COLORI');
      letterButtons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.dataset.artLetter === state.letter));
      });
      colorButtons.forEach(function (button) {
        const selected = state.colors.indexOf(button.dataset.artColor) !== -1;
        const last = selected && state.colors.length === 1;
        button.setAttribute('aria-pressed', String(selected));
        button.setAttribute('aria-disabled', String(last));
        button.title = last ? 'Mantieni almeno un colore' : '';
      });
      effectButtons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(state[button.dataset.artEffect]));
      });
      if (contrastMark) {
        // The companion monogram is recolored; the two source photographs stay intact.
        contrastMark.style.background = 'linear-gradient(115deg,' + p.selected.map(function (color, i, list) {
          const start = (i * 100 / list.length).toFixed(2), end = ((i + 1) * 100 / list.length).toFixed(2);
          return color.hex + ' ' + start + '%,' + color.hex + ' ' + end + '%';
        }).join(',') + ')';
      }
      if (announce && status) status.textContent = description + '.';
    }

    letterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        if (LETTERS.indexOf(button.dataset.artLetter) === -1) return;
        state.letter = button.dataset.artLetter;
        render(true);
      });
    });
    colorButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const id = button.dataset.artColor;
        if (!COLORS.some(function (color) { return color.id === id; })) return;
        const index = state.colors.indexOf(id);
        if (index !== -1 && state.colors.length === 1) {
          if (status) status.textContent = 'Mantieni almeno un colore. Puoi aggiungerne un altro prima di rimuovere questo.';
          return;
        }
        if (index === -1) state.colors.push(id);
        else state.colors.splice(index, 1);
        render(true);
      });
    });
    effectButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const effect = button.dataset.artEffect;
        if (effect !== 'chrome' && effect !== 'grain') return;
        state[effect] = !state[effect];
        render(true);
      });
    });
    render(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

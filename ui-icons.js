/* Shared vector UI: no platform font or emoji fallback, including portable studios. */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else { root.createHangoverUI = factory; root.HangoverUI = factory(); }
})(typeof window === 'undefined' ? globalThis : window, function createHangoverUI() {
  'use strict';
  const paths = {
    right: 'M4 12h16M13 5l7 7-7 7', left: 'M20 12H4M11 5l-7 7 7 7',
    up: 'M12 20V4M5 11l7-7 7 7', down: 'M12 4v16M5 13l7 7 7-7',
    'up-right': 'M5 19 19 5M6 5h13v13', 'down-right': 'M5 5l14 14M6 19h13V6',
    'up-left': 'M19 19 5 5M18 5H5v13', 'down-left': 'M19 5 5 19M18 19H5V6',
    reset: 'M5 8a8 8 0 1 1-1 8M5 3v5h5', redo: 'M19 8a8 8 0 1 0 1 8M19 3v5h-5',
    undo: 'M4 9h9a7 7 0 0 1 7 7v3M9 4 4 9l5 5', close: 'm6 6 12 12M18 6 6 18',
    check: 'm5 12 4 4L19 6', pause: 'M8 5v14M16 5v14'
  };
  const symbols = {'↗':'up-right','↘':'down-right','↖':'up-left','↙':'down-left','↑':'up','↓':'down','←':'left','→':'right','↺':'reset','↻':'redo','↶':'undo','▶':'play','Ⅱ':'pause','✕':'close','✓':'check','✔':'check'};
  const styles = 'svg.ui-icon{display:inline-block;width:1em;height:1em;min-width:1em;max-width:none;max-height:none;flex:0 0 auto;vertical-align:-.14em;overflow:visible;pointer-events:none;color:inherit}';
  function icon(name) {
    if (!paths[name] && name !== 'play') throw new Error('Unknown UI icon: '+name);
    const shape = name === 'play' ? '<path d="m7 4 13 8-13 8Z" fill="currentColor" stroke="none"/>' : '<path d="'+paths[name]+'"/>';
    return '<svg class="ui-icon" data-ui-icon="'+name+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">'+shape+'</svg>';
  }
  function label(element, text, name) {
    element.textContent = String(text);
    if (text && name) element.append(' ');
    if (name) element.insertAdjacentHTML('beforeend', icon(name));
    return element;
  }
  // Build-time conversion of trusted UI markup. Preserve editable text, artwork,
  // character specimens, attributes and script data; do not observe user content.
  function markup(html) {
    return String(html).replace(/<(script|style|textarea|svg|option|pre|code)\b[^>]*>[\s\S]*?<\/\1\s*>|<[^>]*>|[^<]+/gi, part => {
      if (part[0] === '<') return part;
      return part.replace(/[↗↘↖↙↑↓←→↺↻↶▶Ⅱ✕✓✔][\uFE0E\uFE0F]?/g, symbol => icon(symbols[symbol[0]]));
    });
  }
  return {icon, label, markup, styles};
});

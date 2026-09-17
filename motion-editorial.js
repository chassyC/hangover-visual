/* HANGOVER editorial extension. Self-contained factory for site and portable exports. */
window.createHangoverEditorial = function createHangoverEditorial() {
  'use strict';

  const hasText = value => String(value ?? '').trim().length > 0;

  function display(e, value, x, y, width, size, color, align) {
    if (!hasText(value)) return 0;
    return e.text(value, x, y, size, color || e.p.fg, width, align || 'left', 400, '"HANGOVER Display", sans-serif');
  }
  function copy(e, value, x, y, width, color, align, size) {
    if (!hasText(value)) return 0;
    return e.text(value, x, y, size || 16, color || e.p.fg, width, align || 'left', 400, 'monospace');
  }
  function clip(e, x, y, width, height, draw) {
    e.ctx.save(); e.ctx.beginPath(); e.ctx.rect(x, y, width, height); e.ctx.clip(); draw(); e.ctx.restore();
  }
  function drift(e, shift) { return Math.sin(e.theta + (shift || 0)); }
  function wordmark(e, x, y, width, color) { return e.mark('hangover', x, y, width, color || e.p.fg); }
  function sign(e, name, cx, cy, width, color) {
    const height = width * e.data.glyphs[name].height / e.data.glyphs[name].width;
    e.mark(name, cx - width / 2, cy - height / 2, width, color || e.p.fg);
    return height;
  }
  function titleLines(value, length) {
    const words = String(value ?? '').split(/\s+/).filter(Boolean), lines = [];
    let line = '';
    words.forEach(function (word) {
      if (line && (line + ' ' + word).length > length && lines.length < 2) { lines.push(line); line = word; }
      else line += (line ? ' ' : '') + word;
    });
    if (line) lines.push(line);
    if (lines.length === 1 && words.length > 1) {
      const split = Math.ceil(words.length / 2);
      return [words.slice(0, split).join(' '), words.slice(split).join(' ')];
    }
    return lines;
  }
  function footer(e, y, titleSize) {
    display(e, e.title, 50, y, 900, titleSize || (e.tall ? 100 : e.square ? 67 : 47));
    copy(e, e.sub, 52, e.H - 52, 896, e.p.fg, 'left', e.tall ? 19 : 16);
  }
  function photoPanel(e, x, y, width, height, zoom, shade) {
    e.photo(e.image, x, y, width, height, zoom || 1.03);
    if (shade) e.rect(x, y, width, height, 'rgba(3,8,13,' + shade + ')');
  }

  return {
    'ed-diptych': function (e) {
      const { ctx, W, H, p } = e;
      wordmark(e, 50, 32, e.tall ? 810 : 540);
      const top = e.tall ? 240 : e.square ? 155 : 111;
      const bottom = H - (e.tall ? 270 : e.square ? 205 : 138);
      const height = bottom - top, gap = 16, vertical = e.tall;
      const panelWidth = vertical ? 900 : (900 - gap) / 2;
      const panelHeight = vertical ? (height - gap) / 2 : height;
      const shift = drift(e) * 10;
      for (let i = 0; i < 2; i++) {
        const x = vertical ? 50 : 50 + i * (panelWidth + gap);
        const y = vertical ? top + i * (panelHeight + gap) : top;
        const background = i ? p.accent : p.fg, foreground = p.bg;
        e.rect(x, y, panelWidth, panelHeight, background);
        const name = i ? 'over' : 'hang', width = panelWidth * .82;
        sign(e, name, x + panelWidth / 2 + (i ? -shift : shift), y + panelHeight / 2, width, foreground);
        copy(e, i ? '02 / AFTER' : '01 / DARK', x + 20, y + 18, panelWidth - 40, foreground, 'left', 13);
        e.line(x + 20, y + panelHeight - 24, x + panelWidth - 20, y + panelHeight - 24, foreground, 1);
      }
      ctx.save(); ctx.globalAlpha = .55;
      e.line(50, bottom + 20, 950, bottom + 20, p.fg, 1); ctx.restore();
      footer(e, H - (e.tall ? 193 : e.square ? 142 : 105));
    },

    'ed-mosaic': function (e) {
      const { ctx, W, H, p } = e;
      display(e, e.title, 50, 40, 900, e.tall ? 110 : e.square ? 86 : 53);
      const top = e.tall ? 250 : e.square ? 182 : 138, bottom = H - (e.tall ? 240 : e.square ? 178 : 115);
      const cols = e.tall ? 3 : e.square ? 4 : 6, rows = e.tall ? 4 : e.square ? 3 : 2;
      const gap = 8, width = (900 - gap * (cols - 1)) / cols, height = (bottom - top - gap * (rows - 1)) / rows;
      const families = ['h', 'hg', 'hgr', 'h', 'hgr', 'hg'];
      for (let i = 0; i < cols * rows; i++) {
        const x = 50 + (i % cols) * (width + gap), y = top + Math.floor(i / cols) * (height + gap);
        const dark = i % 5 === 1, accent = i % 5 === 3, tone = dark ? p.bg : accent ? p.accent : p.fg;
        e.rect(x, y, width, height, tone);
        ctx.save(); ctx.translate(x + width / 2, y + height / 2); ctx.rotate(drift(e, i * .35) * .028);
        const name = families[i % families.length], maxWidth = Math.min(width * .69, height * .66 * e.data.glyphs[name].width / e.data.glyphs[name].height);
        sign(e, name, 0, 0, maxWidth, dark ? p.fg : p.bg); ctx.restore();
        if (dark) { ctx.strokeStyle = p.fg; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, width - 1, height - 1); }
      }
      const rail = (1 + drift(e)) * .5;
      e.rect(50, bottom + 22, 900, 2, p.muted); e.rect(50 + rail * 700, bottom + 22, 200, 2, p.accent);
      wordmark(e, 50, H - (e.tall ? 165 : e.square ? 158 : 95), e.tall ? 780 : e.square ? 690 : 280);
      copy(e, e.sub, 950, H - 46, 880, p.fg, 'right', 15);
    },

    'ed-axes': function (e) {
      const { ctx, W, H, p } = e;
      const top = e.tall ? 230 : e.square ? 155 : 102, bottom = H - (e.tall ? 265 : e.square ? 205 : 142);
      const center = (top + bottom) / 2, box = Math.min(650, (bottom - top) * .94), mw = box * 131 / 141;
      copy(e, 'H / 01', 50, 42, 240, p.fg, 'left', 16);
      wordmark(e, 535, 35, 415);
      ctx.save(); ctx.globalAlpha = .25;
      for (let i = 0; i <= 8; i++) e.line(50 + i * 112.5, top, 50 + i * 112.5, bottom, p.muted, 1);
      for (let i = 0; i <= 5; i++) e.line(50, top + (bottom - top) * i / 5, 950, top + (bottom - top) * i / 5, p.muted, 1);
      ctx.restore();
      sign(e, 'h', 508, center + 8, mw, p.muted);
      sign(e, 'h', 500, center, mw, p.fg);
      const crossX = 500 + drift(e) * 310, crossY = center + drift(e, Math.PI / 2) * (bottom - top) * .3;
      e.line(crossX, top - 12, crossX, bottom + 12, p.accent, 2);
      e.line(35, crossY, 965, crossY, p.accent, 2);
      [50, 950].forEach(function (x) { e.line(x, top - 9, x, top + 9, p.fg, 2); e.line(x, bottom - 9, x, bottom + 9, p.fg, 2); });
      footer(e, H - (e.tall ? 188 : e.square ? 143 : 105));
    },

    'ed-totem': function (e) {
      const { ctx, H, p } = e;
      const top = e.tall ? 220 : e.square ? 170 : 112, bottom = H - (e.tall ? 255 : e.square ? 205 : 151);
      const height = (bottom - top) / 3, widths = [e.tall ? 270 : 220, e.tall ? 550 : 510, e.tall ? 820 : 800];
      wordmark(e, 50, 36, e.tall ? 880 : 660);
      ['h', 'hg', 'hgr'].forEach(function (name, i) {
        const cy = top + height * (i + .5), width = Math.min(widths[i], height * .66 * e.data.glyphs[name].width / e.data.glyphs[name].height);
        const lift = drift(e, i * .8) * Math.min(9, height * .05);
        const shelf = Math.max(width + 90, 330 + i * 200), x = (1000 - shelf) / 2;
        e.line(x, cy + height * .36, x + shelf, cy + height * .36, p.muted, 2);
        sign(e, name, 500, cy + lift - height * .06, width, i === 1 ? p.accent : p.fg);
        copy(e, '0' + (i + 1), 53, cy - 8, 65, p.fg, 'left', 15);
        e.line(102, cy, Math.max(118, x - 20), cy, p.muted, 1);
      });
      footer(e, H - (e.tall ? 188 : e.square ? 145 : 106));
    },

    'ed-passepartout': function (e) {
      const { ctx, H, p } = e;
      const top = e.tall ? 210 : e.square ? 160 : 116, bottom = H - (e.tall ? 310 : e.square ? 235 : 162);
      const height = bottom - top, inset = 18 + (drift(e) + 1) * 10;
      e.rect(50, top, 900, height, p.fg);
      photoPanel(e, 50 + inset, top + inset, 900 - inset * 2, height - inset * 2, 1.04 + drift(e) * .015, .12);
      wordmark(e, 50, 38, 900);
      const seal = Math.min(e.tall ? 142 : 94, height * .24);
      e.rect(50 + inset + 18, top + height - inset - seal - 33, seal + 22, seal + 22, p.accent);
      sign(e, 'h', 50 + inset + 29 + seal / 2, top + height - inset - seal / 2 - 22, seal * .64, p.bg);
      e.line(50, bottom + 23, 950, bottom + 23, p.fg, 1);
      footer(e, H - (e.tall ? 223 : e.square ? 165 : 112), e.tall ? 119 : e.square ? 76 : 46);
      copy(e, 'AFTER DARK / IN FRAME', 950, bottom + 31, 880, p.fg, 'right', 13);
    },

    'ed-manifesto': function (e) {
      const { ctx, H, p } = e;
      const lines = titleLines(e.title, e.tall ? 15 : 22);
      const top = e.tall ? 360 : e.square ? 250 : 164, blockHeight = e.tall ? 630 : e.square ? 360 : 185;
      const lineHeight = blockHeight / Math.max(2, lines.length), size = Math.min(e.tall ? 220 : e.square ? 166 : 105, lineHeight * .83);
      wordmark(e, 50, 38, e.tall ? 900 : 620);
      copy(e, 'TONIGHT / TOGETHER', 50, e.tall ? 222 : e.square ? 154 : 122, 850, p.accent, 'left', 16);
      lines.forEach(function (value, i) {
        const shift = drift(e, i * .7) * 11, y = top + i * lineHeight;
        const width = 830;
        ctx.save(); ctx.globalAlpha = .16;
        display(e, value, 65 - shift, y + 10, width, size, p.accent); ctx.restore();
        display(e, value, 50 + shift, y, width, size, p.fg);
      });
      const stripTop = e.tall ? 1120 : e.square ? 690 : 395, stripHeight = Math.max(25, H - stripTop - (e.tall ? 180 : e.square ? 145 : 96));
      if (stripHeight > 25) {
        photoPanel(e, 50, stripTop, 690, stripHeight, 1.1 + drift(e) * .025, .25);
        e.rect(756, stripTop, 194, stripHeight, p.accent);
        sign(e, 'h', 853, stripTop + stripHeight / 2, Math.min(98, stripHeight * .7 * 131 / 141), p.bg);
      }
      e.line(50, H - 87, 950, H - 87, p.muted, 1);
      copy(e, e.sub, 50, H - 53, 900, p.fg, 'left', e.tall ? 19 : 16);
    },

    'ed-journal': function (e) {
      const { ctx, H, p } = e;
      display(e, e.title, 50, 39, 900, e.tall ? 113 : e.square ? 85 : 53);
      const top = e.tall ? 250 : e.square ? 175 : 128, bottom = H - (e.tall ? 200 : e.square ? 175 : 112);
      const gap = e.tall ? 21 : 12, rowHeight = (bottom - top - gap * 2) / 3, x = 160, width = 790;
      for (let i = 0; i < 3; i++) {
        const y = top + i * (rowHeight + gap);
        photoPanel(e, x, y, width, rowHeight, 1.05 + i * .16 + drift(e, i) * .012, .2 + i * .07);
        const band = ctx.createLinearGradient(x, y, x + width * .6, y);
        band.addColorStop(0, '#020609a6'); band.addColorStop(1, '#02060900'); e.rect(x, y, width, rowHeight, band);
        display(e, '0' + (i + 1), 50, y + rowHeight * .12, 93, Math.min(72, rowHeight * .53), p.fg);
        copy(e, ['BEFORE', 'DURING', 'AFTER'][i], x + 20, y + rowHeight - 31, width - 40, '#fff', 'left', 13);
      }
      const focusY = top + (bottom - top - 60) * (drift(e) + 1) / 2;
      e.line(138, top, 138, bottom, p.muted, 1); e.rect(134, focusY, 8, 60, p.accent);
      wordmark(e, 50, H - (e.tall ? 170 : e.square ? 158 : 95), e.tall ? 780 : e.square ? 680 : 280);
      copy(e, e.sub, 950, H - 46, 880, p.fg, 'right', 15);
    },

    'ed-aperture': function (e) {
      const { ctx, W, H, p } = e;
      const top = e.tall ? 210 : e.square ? 135 : 70, bottom = H - (e.tall ? 310 : e.square ? 230 : 160), height = bottom - top;
      photoPanel(e, 50, top, 900, height, 1.025 + drift(e) * .014, .25);
      const open = .7 + .16 * Math.cos(e.theta), side = (900 - 900 * open) / 2;
      e.rect(50, top, side, height, p.fg); e.rect(950 - side, top, side, height, p.accent);
      const width = Math.min(650, height * 1.6), cy = top + height / 2;
      const mh = width * 141 / 421;
      e.rect(500 - width / 2 - 22, cy - mh / 2 - 23, width + 44, mh + 46, p.bg);
      sign(e, 'hgr', 500, cy, width, p.fg);
      e.line(50, top - 15, 950, top - 15, p.muted, 1);
      e.line(50, bottom + 16, 950, bottom + 16, p.muted, 1);
      if (e.tall || e.square) wordmark(e, 50, 38, e.tall ? 810 : 520);
      else copy(e, 'HANGOVER / FILM', 50, 28, 900, p.fg, 'left', 14);
      footer(e, H - (e.tall ? 220 : e.square ? 165 : 115), e.tall ? 124 : e.square ? 80 : 47);
    },

    'ed-splitfilm': function (e) {
      const { ctx, H, p } = e;
      const top = e.tall ? 230 : e.square ? 155 : 110, bottom = H - (e.tall ? 295 : e.square ? 218 : 150), gap = 15;
      const vertical = e.tall, panelWidth = vertical ? 900 : 442.5, panelHeight = vertical ? (bottom - top - gap) / 2 : bottom - top;
      wordmark(e, 50, 35, e.tall ? 880 : 610);
      for (let i = 0; i < 2; i++) {
        const x = vertical ? 50 : 50 + i * (panelWidth + gap), y = vertical ? top + i * (panelHeight + gap) : top;
        const offset = drift(e, i * Math.PI) * 14;
        clip(e, x, y, panelWidth, panelHeight, function () {
          photoPanel(e, x - 25 + offset, y - 18, panelWidth + 50, panelHeight + 36, i ? 1.31 : 1.04, .14);
        });
        e.rect(x, y + panelHeight - 66, panelWidth, 66, p.bg);
        copy(e, '0' + (i + 1), x + 15, y + panelHeight - 34, 50, p.accent, 'left', 14);
        const name = i ? 'over' : 'hang', width = Math.min(170, panelWidth * .55);
        e.mark(name, x + panelWidth - width - 17, y + panelHeight - 52, width, p.fg);
        e.rect(x, y + panelHeight - 3, panelWidth * (.52 + .2 * drift(e, i * Math.PI)), 3, p.accent);
      }
      footer(e, H - (e.tall ? 210 : e.square ? 155 : 111), e.tall ? 119 : e.square ? 73 : 47);
    },

    'ed-credits': function (e) {
      const { ctx, H, p } = e;
      const top = e.tall ? 315 : e.square ? 240 : 152, bottom = H - (e.tall ? 240 : e.square ? 192 : 134);
      display(e, e.title, 50, 40, 900, e.tall ? 116 : e.square ? 85 : 53);
      copy(e, 'WITH / HANGOVER', 50, e.tall ? 231 : e.square ? 176 : 119, 850, p.accent, 'left', 15);
      const contentHeight = bottom - top, seam = e.tall ? 650 : 635;
      const names = String(e.cfg.lineup ?? '[ARTISTA 01]\n[ARTISTA 02]\n[ARTISTA 03]').split('\n').map(name => name.trim()).filter(Boolean).slice(0,4);
      if (names.length) e.line(seam, top, seam, bottom, p.muted, 1);
      const row = contentHeight / Math.max(names.length, 3), size = Math.min(e.tall ? 67 : e.square ? 48 : 35, row * .43);
      const lift = drift(e) * Math.min(16, row * .12);
      names.forEach(function (name, i) {
        const y = top + i * row + row * .22 + lift;
        copy(e, '0' + (i + 1), 50, y + 4, 46, p.accent, 'left', 12);
        display(e, name.toUpperCase(), 104, y, seam - 135, size, p.fg);
        e.line(104, top + (i + 1) * row - 8, seam - 30, top + (i + 1) * row - 8, p.muted, 1);
      });
      const width = Math.min(212, contentHeight * .68 * 131 / 141);
      sign(e, 'h', (seam + 950) / 2, (top + bottom) / 2, width, p.fg);
      const baseline = H - (e.tall ? 180 : e.square ? 170 : 102);
      wordmark(e, 50, baseline, e.tall ? 810 : e.square ? 660 : 280);
      copy(e, e.sub, 950, H - 47, 880, p.fg, 'right', 15);
    }
  };
};

'use strict';
/* Pixel pipeline: a low-resolution buffer, a hand-picked palette, ordered-dither quantisation, pixel primitives and sprites. */
const C = {
  // night blues
  ink: '#07080f', n1: '#0d1220', n2: '#141c2e', n3: '#1c2940', n4: '#263a55', n5: '#34506e', n6: '#466a88', n7: '#6488a4', n8: '#8eaec4',
  // sea teals
  t0: '#08161c', t1: '#0c222a', t2: '#113240', t3: '#16444f', t4: '#1d5a62', t5: '#277478', t6: '#3a9490', t7: '#5fb8aa', t8: '#9ad8c8', foam: '#dcf4ec',
  // fire
  f0: '#3a1a10', f1: '#6a2812', f2: '#a33e1a', f3: '#d86624', f4: '#f59c38', f5: '#ffd46a', f6: '#fff2c0',
  // wood
  w0: '#1a100a', w1: '#2a1a10', w2: '#3f2716', w3: '#56361e', w4: '#744a28', w5: '#976436', w6: '#bc8a52',
  // reds
  r0: '#300c0e', r1: '#561618', r2: '#842420', r3: '#b3382a', r4: '#d8573a',
  // bone
  b0: '#6c604c', b1: '#9a8a6c', b2: '#c8b890', b3: '#e8dcbc', b4: '#f8f2e0',
  // kraken purples
  k0: '#140c20', k1: '#221634', k2: '#34224c', k3: '#4c3468', k4: '#6a4a8a', k5: '#9270b0', k6: '#c49ad8',
  // glow
  g1: '#3fd6d0', g2: '#8ff8ec', g3: '#e6fffc',
  // metal
  m0: '#23262e', m1: '#3a3f4a', m2: '#5a616e', m3: '#848c98', m4: '#b4bcc6',
  // skin
  s0: '#5a2e20', s1: '#8c4e38', s2: '#c07a58', s3: '#e6a882',
  // draugr
  d0: '#18241f', d1: '#2c4038', d2: '#4a6a5c', d3: '#78a08c',
  // extra
  gold: '#e8b84a', white: '#ffffff', green: '#7fd99a', ember: '#ff8a3a',
};
const PAL = Object.values(C).map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
const PAL32 = new Uint32Array(PAL.map(([r, g, b]) => (255 << 24) | (b << 16) | (g << 8) | r));
const LUT = new Uint8Array(32768);
(function buildLut() {
  for (let r = 0; r < 32; r++) for (let g = 0; g < 32; g++) for (let b = 0; b < 32; b++) {
    const R = r * 8 + 4, Gc = g * 8 + 4, B = b * 8 + 4; let best = 0, bd = 1e9;
    for (let i = 0; i < PAL.length; i++) { const p = PAL[i], dr = R - p[0], dg = Gc - p[1], db = B - p[2], rm = (R + p[0]) / 2; const d = (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db; if (d < bd) { bd = d; best = i; } }
    LUT[(r << 10) | (g << 5) | b] = best;
  }
})();
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v / 16 - 0.47) * 18);
const CLAMP = new Uint8Array(512).map((_, i) => Math.max(0, Math.min(255, i - 128)));

/* Map every pixel of the buffer to the palette with a 4x4 ordered dither. */
function quantize(ctx, W, H) {
  const img = ctx.getImageData(0, 0, W, H), d = img.data, u = new Uint32Array(d.buffer);
  for (let y = 0; y < H; y++) {
    const row = (y & 3) << 2;
    for (let x = 0, i = y * W; x < W; x++, i++) {
      const t = BAYER[row | (x & 3)], j = i << 2;
      const r = CLAMP[(d[j] + t + 128) | 0] >> 3, g = CLAMP[(d[j + 1] + t + 128) | 0] >> 3, b = CLAMP[(d[j + 2] + t + 128) | 0] >> 3;
      u[i] = PAL32[LUT[(r << 10) | (g << 5) | b]];
    }
  }
  ctx.putImageData(img, 0, 0);
}

/* ---- pixel primitives (buffer coordinates) ---- */
const P = {
  rect(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); },
  dot(ctx, x, y, c, s = 1) { ctx.fillStyle = c; ctx.fillRect(Math.round(x - (s - 1) / 2), Math.round(y - (s - 1) / 2), s, s); },
  line(ctx, x0, y0, x1, y1, c, w = 1) {
    ctx.fillStyle = c; x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, o = Math.floor((w - 1) / 2);
    let err = dx + dy, n = 0;
    while (n++ < 2000) { ctx.fillRect(x0 - o, y0 - o, w, w); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } }
  },
  disc(ctx, cx, cy, r, c) {
    ctx.fillStyle = c; cx = Math.round(cx); cy = Math.round(cy); const rr = r * r + r * 0.8;
    for (let y = -Math.ceil(r); y <= Math.ceil(r); y++) { const w = Math.floor(Math.sqrt(Math.max(0, rr - y * y))); if (w >= 0 && y * y <= rr) ctx.fillRect(cx - w, cy + y, w * 2 + 1, 1); }
  },
  ring(ctx, cx, cy, r, c) { let px = null; for (let a = 0; a < TAU; a += 1 / Math.max(r, 2)) { const x = Math.round(cx + Math.cos(a) * r), y = Math.round(cy + Math.sin(a) * r); if (px !== x + ',' + y) { P.dot(ctx, x, y, c); px = x + ',' + y; } } },
  /* dithered blob for soft things (smoke, mist): coverage 0..1 */
  dither(ctx, cx, cy, r, c, cov) {
    ctx.fillStyle = c; cx = Math.round(cx); cy = Math.round(cy);
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) { if (x * x + y * y > r * r) continue; const t = (BAYER[((y + 64) & 3) * 4 + ((x + 64) & 3)] / 18 + 0.47); if (t < cov * (1 - Math.sqrt(x * x + y * y) / (r + 1) * 0.6)) ctx.fillRect(cx + x, cy + y, 1, 1); }
  },
};

/* ---- sprites: rows of characters, '.' is empty, each letter maps to a palette key ---- */
const SPR = {};
function sprite(name, rows, map) {
  const h = rows.length, w = Math.max(...rows.map((r) => r.length)), c = offscreen(w, h), g = c.getContext('2d');
  rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const ch = r[x]; if (ch === '.' || ch === ' ') continue; const k = map[ch]; if (!k) continue; g.fillStyle = C[k] || k; g.fillRect(x, y, 1, 1); } });
  c.map = map; c.rows = rows; SPR[name] = c; return c;
}
/* a recoloured copy (palette swap) */
function recolor(name, from, swap) {
  const s = SPR[from], map = { ...s.map }; for (const k in swap) map[k] = swap[k];
  return sprite(name, s.rows, map);
}
/* solid white silhouette for hit flashes */
function silhouette(img, col = '#ffffff') {
  if (img._sil && img._silc === col) return img._sil;
  const c = offscreen(img.width, img.height), g = c.getContext('2d'); g.drawImage(img, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height);
  img._sil = c; img._silc = col; return c;
}
/* a copy of a canvas with a 1px ink outline around everything drawn in it */
const OUTL = {};
function inkOutline(src, w, h, col = C.ink) {
  const k = w + 'x' + h; let o = OUTL[k];
  if (!o) { o = OUTL[k] = { s: offscreen(w, h), o: offscreen(w, h) }; o.sg = o.s.getContext('2d'); o.og = o.o.getContext('2d'); }
  o.sg.globalCompositeOperation = 'source-over'; o.sg.clearRect(0, 0, w, h); o.sg.drawImage(src, 0, 0); o.sg.globalCompositeOperation = 'source-in'; o.sg.fillStyle = col; o.sg.fillRect(0, 0, w, h); o.sg.globalCompositeOperation = 'source-over';
  o.og.clearRect(0, 0, w, h); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) o.og.drawImage(o.s, dx, dy); o.og.drawImage(src, 0, 0);
  return o.o;
}
function blit(ctx, img, x, y, flip = false, ax = 0, ay = 0) {
  x = Math.round(x); y = Math.round(y);
  if (!flip) ctx.drawImage(img, x - ax, y - ay);
  else { ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); ctx.drawImage(img, -ax, -ay); ctx.restore(); }
}
/* rotated sprite around a pivot (nearest neighbour; stays on the pixel grid) */
function blitRot(ctx, img, x, y, a, px, py, flip = false) {
  ctx.save(); ctx.translate(Math.round(x), Math.round(y)); if (flip) ctx.scale(-1, 1); ctx.rotate(a); ctx.drawImage(img, -px, -py); ctx.restore();
}

/* ---- a 3x5 digit font and small caps for numbers in the HUD ---- */
const DIGITS = {
  0: ['###', '#.#', '#.#', '#.#', '###'], 1: ['.#.', '##.', '.#.', '.#.', '###'], 2: ['###', '..#', '###', '#..', '###'], 3: ['###', '..#', '.##', '..#', '###'],
  4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '###', '..#', '###'], 6: ['###', '#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.', '.#.'],
  8: ['###', '#.#', '###', '#.#', '###'], 9: ['###', '#.#', '###', '..#', '###'], '/': ['..#', '..#', '.#.', '#..', '#..'], '+': ['...', '.#.', '###', '.#.', '...'],
  '-': ['...', '...', '###', '...', '...'], ':': ['...', '.#.', '...', '.#.', '...'], ' ': ['...', '...', '...', '...', '...'], x: ['...', '#.#', '.#.', '#.#', '...'],
};
function digits(ctx, str, x, y, col, scale = 1, shadow = C.ink) {
  str = String(str); const w = 4 * scale;
  const draw = (ox, oy, c) => { ctx.fillStyle = c; for (let i = 0; i < str.length; i++) { const g = DIGITS[str[i]] || DIGITS[' ']; for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (g[r][q] === '#') ctx.fillRect(Math.round(x + ox + i * w + q * scale), Math.round(y + oy + r * scale), scale, scale); } };
  if (shadow) draw(scale, scale, shadow); draw(0, 0, col);
  return str.length * w;
}
/* text in the buffer (CJK via the system font, snapped to whole pixels; the quantiser makes it read as pixel type) */
const FONT = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif';
/* Text lives on its own layer at the screen's real resolution, laid over the pixel buffer, so glyphs stay sharp.
   Coordinates stay in buffer pixels (the layer is scaled to match); panels drawn later erase the text under them. */
const TXT = {
  cv: null, g: null, sc: 1, main: null,
  init(main) {
    this.main = main; const cv = document.createElement('canvas'); cv.id = 'txt'; cv.setAttribute('aria-hidden', 'true');
    Object.assign(cv.style, { position: 'fixed', left: '0', top: '0', pointerEvents: 'none', zIndex: 2 });
    main.after(cv); this.cv = cv; this.g = cv.getContext('2d'); this.resize();
  },
  resize() {
    if (!this.cv) return; let dpr = Math.min(3, window.devicePixelRatio || 1); const px = Cam.BW * Cam.k * Cam.BH * Cam.k; if (px * dpr * dpr > 8.3e6) dpr = Math.max(1, Math.sqrt(8.3e6 / px)); this.sc = Cam.k * dpr;
    this.cv.width = Math.ceil(Cam.BW * this.sc); this.cv.height = Math.ceil(Cam.BH * this.sc);
    this.cv.style.width = Cam.BW * Cam.k + 'px'; this.cv.style.height = Cam.BH * Cam.k + 'px';
  },
  begin() { if (!this.g) return; const g = this.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, this.cv.width, this.cv.height); g.setTransform(this.sc, 0, 0, this.sc, 0, 0); },
  for(ctx) { return this.g && ctx.canvas === this.main ? this.g : ctx; },
  clear(ctx, x, y, w, h) { if (this.g && ctx.canvas === this.main) this.g.clearRect(x, y, w, h); },
  dim(ctx, a) { if (!this.g || ctx.canvas !== this.main) return; const g = this.g; g.globalCompositeOperation = 'source-atop'; g.fillStyle = `rgba(4,6,12,${a})`; g.fillRect(0, 0, Cam.BW, Cam.BH); g.globalCompositeOperation = 'source-over'; },
};
function text(ctx, str, x, y, o = {}) {
  str = typeof tr === 'function' ? tr(str) : str;
  ctx = TXT.for(ctx);
  let size = o.size || 12; const wt = o.bold ? 700 : 600;
  if (o.fit) { ctx.font = `${wt} ${size}px ${FONT}`; while (size > 7 && ctx.measureText(str).width > o.fit) { size -= 0.5; ctx.font = `${wt} ${size}px ${FONT}`; } }
  ctx.font = `${wt} ${size}px ${FONT}`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'top';
  if (ctx !== TXT.g) { x = Math.round(x); y = Math.round(y); }
  if (o.shadow !== false) {
    const sh = o.shadow || C.ink;
    if (o.outline) { ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(2, size * 0.2); ctx.strokeStyle = sh; ctx.strokeText(str, x, y); ctx.fillStyle = sh; ctx.fillText(str, x + 0.6, y + 0.9); }
    else { ctx.fillStyle = sh; ctx.fillText(str, x + 0.7, y + 0.8); }
  }
  ctx.fillStyle = o.color || C.b3; ctx.fillText(str, x, y);
  return ctx.measureText(str).width;
}
function wrapText(ctx, str, maxW, size = 12) {
  str = typeof tr === 'function' ? tr(str) : str;
  ctx = TXT.for(ctx); ctx.font = `600 ${size}px ${FONT}`; const out = []; let line = '';
  const words = /[\u4e00-\u9fff]/.test(str) ? [...str] : str.split(/(?<= )/);
  for (const w of words) { if (ctx.measureText(line + w).width > maxW && line) { out.push(line.trimEnd()); line = w.trimStart(); } else line += w; }
  if (line) out.push(line); return out;
}

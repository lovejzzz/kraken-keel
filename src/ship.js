'use strict';
/* Ships ride the sea with spring-damped buoyancy. Local frame: origin at the waterline centre, x toward +world x, y down.
   Pixel art: the hull is rasterised once into a sprite (clinker planks follow the hull curve), the rig is redrawn each frame,
   both are rotated onto the buffer with nearest-neighbour sampling. */
const WIND = { v: 0.3, t: 0 };
const MAST_TOP = -270, YARD_Y = -236, SAIL_BOT = -104;
const SHIPPAL = {
  player: { sail: ['r2', 'b3'], sailD: ['r1', 'b1'], shields: [['r2', 'b3'], ['b3', 'r2'], ['n4', 'b2'], ['f2', 'b3'], ['r2', 'n4']], wood: ['w1', 'w2', 'w3', 'w4', 'w5'], head: ['w2', 'w4', 'w5'], eye: 'f4' },
  raider: { sail: ['n1', 'r1'], sailD: ['ink', 'r0'], shields: [['n1', 'r2'], ['r1', 'n2'], ['m1', 'r2'], ['n1', 'm2']], wood: ['w0', 'w1', 'w2', 'w3', 'w4'], head: ['w1', 'w2', 'w3'], eye: 'r4' },
  ghost: { sail: ['d1', 'd2'], sailD: ['d0', 'd1'], shields: [['d1', 'd3'], ['d0', 'd2'], ['m1', 'd3']], wood: ['d0', 'd0', 'd1', 'd2', 'd3'], head: ['d0', 'd1', 'd2'], eye: 'g2' },
};
sprite('dragon', [
  '.......hhhh......',
  '.....hhHHHHh.....',
  '....hHHHHHHHhh...',
  '...hHHeHHHHHHHh..',
  '...hHHHHHHHHHHHhh',
  '..hHHHHHhhhhhHHHh',
  '..hHHHHh....hhHh.',
  '..hHHHh....hHHh..',
  '.hHHHh....hHHh...',
  '.hHHh......hh....',
  '.hHHh............',
  '.hHHh............',
  'hHHh.............',
  'hHHh.............',
  'hHh..............',
], { h: 'w1', H: 'w4', e: 'f4' });
sprite('curl', [
  '...hhhh...',
  '..hHHHHh..',
  '.hHh..hHh.',
  '.hH.hh.Hh.',
  '.hH.hHhHh.',
  '.hHh.hHh..',
  '..hHh.....',
  '...hHh....',
  '....hHh...',
  '.....hHh..',
  '......hHh.',
], { h: 'w1', H: 'w4' });
const SHIELD_ROWS = ['..aaaaa..', '.aabbbaa.', 'aabbabbaa', 'aabamabaa', 'aabbabbaa', '.aabbbaa.', '..aaaaa..'];
const SHIELD_ROWS2 = ['..aaaaa..', '.aaaabbb.', 'aaaaabbbb', 'aaaambbbb', 'aaaaabbbb', '.aaaabbb.', '..aaaaa..'];

class Ship {
  constructor(o) {
    Object.assign(this, {
      x: 0, y: 0, a: 0, vx: 0, vy: 0, va: 0, dir: 1, L: 300, kind: 'longship', team: 'player', pal: 'player', tx: 0, accel: 60,
      hull: 400, hullMax: 400, mast: { hp: 160, max: 160, cut: false, fall: 0 }, sinking: 0, sunk: false, bias: 0, grip: 0, breaches: [],
      slots: [], hit: 0, bobSeed: rand(0, 100), draft: 16, sail: 1, flash: 0, gone: false,
    }, o);
    if (this.kind === 'skiff') { this.L = 95; this.hull = this.hullMax = o.hull ?? 90; this.mast = null; this.draft = 5; }
    this.deckBase = this.kind === 'skiff' ? -14 : -38;
    this.walk = this.kind === 'skiff' ? this.L - 20 : this.L - 72;
    this.y = Sea.height(this.x) + this.draft;
    this.build();
  }
  yardW() { return Math.round(this.L * 0.47); }
  deckY(lx) {
    const r = Math.max(0, Math.abs(lx) - (this.walk - 80)) / 80;
    return this.deckBase - r * r * (this.kind === 'skiff' ? 6 : 24);
  }
  toWorld(lx, ly) { const c = Math.cos(this.a), s = Math.sin(this.a); return { x: this.x + c * lx - s * ly, y: this.y + s * lx + c * ly }; }
  toLocal(x, y) { const c = Math.cos(this.a), s = Math.sin(this.a), dx = x - this.x, dy = y - this.y; return { x: c * dx + s * dy, y: -s * dx + c * dy }; }
  pointVel(wx, wy) { const rx = wx - this.x, ry = wy - this.y; return { x: this.vx - this.va * ry, y: this.vy + this.va * rx }; }
  tangent() { return { x: Math.cos(this.a), y: Math.sin(this.a) }; }
  normal() { return { x: Math.sin(this.a), y: -Math.cos(this.a) }; }
  hookPoints() {
    const p = [];
    if (this.mast && !this.mast.cut) { const y = this.yardW(); p.push({ lx: 0, ly: MAST_TOP }, { lx: -y, ly: YARD_Y }, { lx: y, ly: YARD_Y }); }
    if (this.kind !== 'skiff') p.push({ lx: this.dir * (this.L + 6), ly: -150, end: true }, { lx: -this.dir * (this.L + 4), ly: -140, end: true });
    return p.map((q) => ({ ...q, ship: this }));
  }
  update(dt) {
    const dx = this.tx - this.x;
    this.vx += clamp(dx * 0.6 - this.vx * 0.9, -this.accel, this.accel) * dt;
    this.x += this.vx * dt;
    const n = 5; let sh = 0, sxh = 0, sxx = 0;
    for (let i = 0; i < n; i++) { const lx = lerp(-this.L * 0.8, this.L * 0.8, i / (n - 1)); const h = Sea.height(this.x + lx); sh += h; sxh += lx * h; sxx += lx * lx; }
    const avg = sh / n, slope = sxh / sxx;
    const sinkY = this.sinking * 240, sinkA = this.sinking * 0.35 * this.dir;
    const ty = avg + this.draft + sinkY, ta = Math.atan(slope) * (this.kind === 'skiff' ? 0.95 : 0.8) + this.bias + sinkA;
    const k = this.kind === 'skiff' ? 40 : 18, c = this.kind === 'skiff' ? 8 : 5.5;
    this.vy += ((ty - this.y) * k - this.vy * c) * dt; this.y += this.vy * dt;
    this.va += ((ta - this.a) * (k * 0.8) - this.va * c) * dt; this.a += this.va * dt;
    this.hit = Math.max(0, this.hit - dt * 3); this.flash = Math.max(0, this.flash - dt * 5);
    if (this.mast && this.mast.cut) this.mast.fall = Math.min(1, this.mast.fall + dt * 0.9);
    if (this.hull <= 0 && !this.sunk) {
      this.sinking = Math.min(1.4, this.sinking + dt * 0.28); if (this.sinking >= 1.4) this.sunk = true;
      if (Math.random() < dt * 20) { const p = this.toWorld(rand(-this.L, this.L), 0); FX.burst(p.x, Sea.height(p.x), { n: 3, speed: 120, size: 2, color: 'foam', grav: 600, life: 0.6, water: false, kind: 'drop' }); }
    }
    for (const b of this.breaches) { b.t += dt; if (Math.random() < dt * 22) { const p = this.toWorld(b.lx, b.ly + 4); FX.burst(p.x, p.y, { n: 1, angle: Math.PI * 0.5, spread: 0.5, speed: 90, size: 2, color: 'foam', color2: 't7', grav: 800, life: 0.5, kind: 'drop' }); } }
  }
  damage(d, lx = 0) {
    if (this.hull <= 0) return;
    if (this.team === 'player' && G.ups && G.ups.plate) d *= 1 - 0.15 * G.ups.plate;
    this.hull = Math.max(0, this.hull - d); this.hit = 1; this.flash = 1;
    this.va += (Math.random() < 0.5 ? -1 : 1) * d * 0.004;
    const p = this.toWorld(lx, this.deckBase + 18);
    FX.splinters(p.x, p.y, 8 + (d / 6) | 0, 0, this.pal === 'ghost' ? 'd2' : 'w4');
    if (this.kind !== 'skiff' && d >= 12 && this.breaches.length < 5 && Math.random() < 0.35) this.breaches.push({ lx: clamp(lx + rand(-30, 30), -this.walk + 20, this.walk - 20), ly: rand(-32, -24), r: rand(9, 13), t: 0, fix: 0 });
    Sfx.play(d > 20 ? 'crack' : 'wood', clamp((p.x - Cam.x) / 700, -1, 1), 0.8);
  }

  /* ---- sprite building ---- */
  hullPath(g) {
    const L = this.L;
    if (this.kind === 'skiff') {
      g.beginPath(); g.moveTo(-L - 14, -30); g.quadraticCurveTo(-L, 10, -L + 30, 14); g.quadraticCurveTo(0, 22, L - 30, 14); g.quadraticCurveTo(L, 10, L + 18, -34);
      g.lineTo(L + 10, -34); g.quadraticCurveTo(L - 4, -18, L - 30, -18); g.lineTo(-L + 30, -18); g.quadraticCurveTo(-L + 2, -18, -L - 6, -30); g.closePath(); return;
    }
    g.beginPath(); g.moveTo(-L - 22, -146);
    g.quadraticCurveTo(-L - 34, -58, -L + 44, 12); g.quadraticCurveTo(-L + 130, 46, 0, 48); g.quadraticCurveTo(L - 130, 46, L - 44, 12);
    g.quadraticCurveTo(L + 34, -58, L + 22, -150);
    g.lineTo(L + 8, -150); g.quadraticCurveTo(L + 12, -74, L - 84, -46); g.lineTo(-L + 84, -46); g.quadraticCurveTo(-L - 12, -72, -L - 8, -146); g.closePath();
  }
  build() {
    const P0 = SHIPPAL[this.pal], L = this.L, W = Math.ceil((2 * L + 100) * S), H = Math.ceil(220 * S);
    this.px = Math.round(W / 2); this.py = Math.round(170 * S); // pivot (waterline centre) inside the sprite
    // hull mask by rasterising the outline, then hard alpha
    const m = offscreen(W, H), mg = m.getContext('2d');
    mg.setTransform(S * this.dir, 0, 0, S, this.px, this.py); this.hullPath(mg); mg.fillStyle = '#fff'; mg.fill();
    const md = mg.getImageData(0, 0, W, H).data, inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H && md[(y * W + x) * 4 + 3] > 110;
    const c = offscreen(W, H), g = c.getContext('2d'), wood = P0.wood;
    for (let x = 0; x < W; x++) {
      let top = -1, bot = -1; for (let y = 0; y < H; y++) if (inside(x, y)) { if (top < 0) top = y; bot = y; }
      if (top < 0) continue;
      const span = bot - top + 1, planks = this.kind === 'skiff' ? 4 : 7;
      for (let y = top; y <= bot; y++) {
        if (!inside(x, y)) continue;
        const d = (y - top) / Math.max(span, 1), band = Math.floor(d * planks), f = d * planks - band;
        let col = band % 2 ? wood[3] : wood[2];
        if (f < 1 / (span / planks)) col = wood[0];          // seam
        else if (f < 2 / (span / planks)) col = wood[4];     // lit edge under the seam
        if (y - top > span * 0.75) col = f < 0.3 ? wood[0] : wood[1]; // shadowed belly
        if (!inside(x, y - 1)) col = wood[4];                // top edge
        g.fillStyle = C[col]; g.fillRect(x, y, 1, 1);
      }
      if ((x + 3) % 11 === 0) { const y = top + Math.round(span * 0.35); if (inside(x, y)) { g.fillStyle = C.b1; g.fillRect(x, y, 1, 1); } }
    }
    // outline
    const od = g.getImageData(0, 0, W, H), o = od.data;
    const solid = (x, y) => x >= 0 && y >= 0 && x < W && y < H && o[(y * W + x) * 4 + 3] > 0;
    const edge = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!solid(x, y) && (solid(x + 1, y) || solid(x - 1, y) || solid(x, y + 1) || solid(x, y - 1))) edge.push([x, y]);
    g.fillStyle = C.ink; for (const [x, y] of edge) g.fillRect(x, y, 1, 1);
    void od;
    if (this.kind !== 'skiff') {
      // prow dragon and stern curl
      const hp = { x: this.px + Math.round((L + 16) * S) * this.dir, y: this.py + Math.round(-150 * S) };
      const dimg = this.pal === 'player' ? SPR.dragon : (SPR['dragon_' + this.pal] || recolor('dragon_' + this.pal, 'dragon', { h: P0.head[0], H: P0.head[2], e: P0.eye }));
      blit(g, dimg, hp.x, hp.y, this.dir < 0, 2, 14);
      const cimg = this.pal === 'player' ? SPR.curl : (SPR['curl_' + this.pal] || recolor('curl_' + this.pal, 'curl', { h: P0.head[0], H: P0.head[2] }));
      blit(g, cimg, this.px - Math.round((L + 14) * S) * this.dir, this.py + Math.round(-146 * S), this.dir < 0, 5, 10);
      // gunwale rail
      g.fillStyle = C[wood[5] || wood[4]]; g.fillRect(this.px - Math.round((L - 84) * S), this.py + Math.round(-46 * S), Math.round((2 * L - 168) * S), 1); g.fillStyle = C[wood[1]]; g.fillRect(this.px - Math.round((L - 84) * S), this.py + Math.round(-46 * S) + 1, Math.round((2 * L - 168) * S), 1);
    } else {
      // oars
      g.fillStyle = C[wood[3]]; for (let i = -1; i <= 1; i += 2) g.fillRect(this.px + i * 12 - 1, this.py - 8, 2, 14);
    }
    this.spr = c; this.sprFlash = silhouette(c, C.f6);
    // shields on the rail (drawn after the crew)
    if (this.kind !== 'skiff') {
      const sc = offscreen(W, H), sg = sc.getContext('2d'); let i = 0;
      for (let x = -L + 96; x <= L - 96; x += 34, i++) {
        const pal = P0.shields[i % P0.shields.length], rows = i % 3 === 1 ? SHIELD_ROWS2 : SHIELD_ROWS;
        const s = sprite(`sh_${this.pal}_${i % P0.shields.length}_${i % 3 === 1}`, rows, { a: pal[0], b: pal[1], m: 'm3' });
        blit(sg, s, this.px + Math.round(x * S) - 4, this.py + Math.round(-26 * S) - 3);
        sg.fillStyle = C.ink; sg.fillRect(this.px + Math.round(x * S) - 3, this.py + Math.round(-26 * S) + 4, 7, 1);
      }
      this.shieldSpr = sc;
    }
    this.rig = offscreen(Math.ceil(2 * L * S + 40), Math.ceil((-MAST_TOP - 30) * S) + 4); this.rigG = this.rig.getContext('2d');
  }

  /* ---- drawing into the pixel buffer ---- */
  place(ctx, img, pivotX, pivotY, alpha = 1) {
    const bx = Cam.bx(this.x), by = Cam.by(this.y);
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(bx, by); ctx.rotate(this.a); ctx.drawImage(img, -pivotX, -pivotY); ctx.restore();
  }
  drawBack(ctx, t) {
    if (!this.mast) return;
    const g = this.rigG, R = this.rig, rw = R.width, rh = R.height, cx = Math.round(rw / 2), base = rh - 1; // rig pivot: mast foot at (cx, base) == local (0, -40)
    g.clearRect(0, 0, rw, rh);
    const P0 = SHIPPAL[this.pal], m = this.mast, top = base + Math.round((MAST_TOP + 40) * S), yw = Math.round(this.yardW() * S), yardY = base + Math.round((YARD_Y + 40) * S), bot = base + Math.round((SAIL_BOT + 40) * S);
    // rigging lines to prow and stern
    if (!m.cut) { g.fillStyle = C.w1; P.line(g, cx, top + 1, rw - 4, base - 2, C.w1, 1); P.line(g, cx, top + 1, 4, base - 2, C.w1, 1); }
    // mast
    g.fillStyle = C.w1; g.fillRect(cx - 3, top, 6, base - top); g.fillStyle = C.w3; g.fillRect(cx - 2, top, 3, base - top); g.fillStyle = C.w4; g.fillRect(cx - 2, top, 1, base - top);
    if (m.hp < m.max && !m.cut) { const k = 1 - m.hp / m.max, ny = base - Math.round(60 * S); g.fillStyle = C.b2; for (let i = 0; i < 1 + k * 3; i++) g.fillRect(cx - 3 + i, ny + i, 2, 1); }
    // yard
    g.fillStyle = C.w1; g.fillRect(cx - yw - 4, yardY - 2, 2 * yw + 8, 4); g.fillStyle = C.w3; g.fillRect(cx - yw - 3, yardY - 1, 2 * yw + 6, 2);
    // sail, column by column
    const w = WIND.v * this.dir, bill = (5 + Math.abs(w) * 10) * (m.cut ? 0.3 : 1), stripes = 7, sw = (2 * yw) / stripes;
    const tears = Math.floor((1 - this.hull / this.hullMax) * 5);
    for (let x = -yw; x < yw; x++) {
      const u = (x + yw) / (2 * yw), bow = Math.sin(u * Math.PI), sag = Math.round(bow * bill + Math.sin(t * 3.1 + u * 5 + this.bobSeed) * (0.5 + Sea.storm));
      const y0 = yardY + 2, y1 = bot + sag, si = Math.floor((x + yw) / sw) % 2;
      const shade = u < 0.12 || u > 0.88 ? 1 : (u > 0.5 + w * 0.3 ? 0 : 0);
      let col = C[shade ? P0.sailD[si] : P0.sail[si]];
      g.fillStyle = col; g.fillRect(cx + x, y0, 1, y1 - y0);
      // billow shading: lower third darker toward the wind side
      g.fillStyle = C[P0.sailD[si]]; g.fillRect(cx + x, y1 - 3, 1, 3);
      for (let yy = y0 + 6; yy < y1 - 3; yy += 6) { if ((x & 1) === 0) g.fillRect(cx + x, yy, 1, 1); }
      g.fillStyle = C.w0; g.fillRect(cx + x, y1, 1, 1);
      for (let i = 0; i < tears; i++) { const tx = -yw + Math.floor(hash1(i + this.bobSeed) * 2 * yw), ty = y0 + 4 + Math.floor(hash1(i * 3.3 + this.bobSeed) * (y1 - y0 - 12)); if (Math.abs(x - tx) < 3) { g.clearRect(cx + x, ty + Math.abs(x - tx), 1, 5 - Math.abs(x - tx)); } }
    }
    const pivotY = base + Math.round(40 * S);
    if (m.cut) {
      // the broken mast topples over the stern side
      const bx = Cam.bx(this.x), by = Cam.by(this.y);
      ctx.save(); ctx.translate(bx, by); ctx.rotate(this.a); ctx.translate(0, Math.round(-100 * S)); ctx.rotate(smooth(m.fall) * 1.35 * -this.dir); ctx.drawImage(R, -cx, -(pivotY - Math.round(100 * S))); ctx.restore();
    } else this.place(ctx, R, cx, pivotY);
  }
  drawHull(ctx, t) {
    this.place(ctx, this.spr, this.px, this.py);
    if (this.flash > 0.3) this.place(ctx, this.sprFlash, this.px, this.py, this.flash * 0.7);
  }
  drawFront(ctx) {
    if (this.shieldSpr) this.place(ctx, this.shieldSpr, this.px, this.py);
    // holes are drawn over the shields so they are always visible
    if (this.breaches.length) {
      const bx = Cam.bx(this.x), by = Cam.by(this.y);
      ctx.save(); ctx.translate(bx, by); ctx.rotate(this.a);
      for (const b of this.breaches) {
        const x = Math.round(b.lx * S), y = Math.round(b.ly * S), r = Math.round(b.r * S);
        ctx.fillStyle = C.ink; ctx.fillRect(x - r, y - r + 1, r * 2, r * 2 - 2); ctx.fillRect(x - r + 1, y - r, r * 2 - 2, r * 2);
        ctx.fillStyle = C.w6; ctx.fillRect(x - r - 1, y - r, 2, 1); ctx.fillRect(x + r - 1, y - 1, 2, 1); ctx.fillRect(x - 2, y + r - 1, 1, 2); ctx.fillRect(x + 1, y - r - 1, 1, 2);
        ctx.fillStyle = C.t7; ctx.fillRect(x - 1, y + r - 2, 2, 3); ctx.fillStyle = C.foam; ctx.fillRect(x, y + r, 1, 3);
      }
      ctx.restore();
    }
  }
  /* churning foam where the hull meets the water */
  drawWake(ctx, t) {
    if (this.sunk) return;
    const L = this.L * (this.kind === 'skiff' ? 1.1 : 0.96);
    for (let lx = -L; lx <= L; lx += 2 / S) {
      const p = this.toWorld(lx, 0), bx = Cam.bx(p.x), by = Cam.by(Sea.height(p.x)), n = noise1(lx * 0.08 + t * 3 + this.bobSeed);
      const ends = Math.pow(Math.abs(lx) / L, 3), hgt = (n > 0.5 ? 2 : 1) + Math.round(ends * 3);
      ctx.fillStyle = C[n > 0.35 ? 'foam' : 't8']; ctx.fillRect(bx, by - hgt + 1, 2, hgt);
    }
  }
  spray(dt) {
    if (this.sunk) return;
    const bl = this.dir * this.L * 0.92, p = this.toWorld(bl, 20), pv = this.pointVel(p.x, p.y), h = Sea.height(p.x);
    if (pv.y > 60 && p.y > h - 10 && Math.random() < dt * 40) {
      FX.burst(p.x + this.dir * 20, h, { n: 3 + (pv.y / 40) | 0, angle: -Math.PI / 2 + this.dir * 0.5, spread: 0.6, speed: 200 + pv.y * 2, size: 2, color: 'foam', color2: 't7', grav: 1000, life: 0.8, water: false, kind: 'drop' });
    }
  }
}

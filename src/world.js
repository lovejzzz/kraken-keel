'use strict';
/* Camera, sea, sky, rain, lightning, particles and lights — drawn into the pixel buffer. World units: y down, sea level at y = 0.
   The buffer shows the world at a fixed scale S (2 world units per pixel). */
const S = 0.5;

const Cam = {
  x: 0, y: -170, tx: 0, ty: -170, trauma: 0, punch: 0, sx: 0, sy: 0, BW: 640, BH: 360, k: 2, cw: 1280, ch: 720,
  resize(canvas) {
    const w = innerWidth, h = innerHeight;
    // whole-number pixel scale on big screens; on small ones (phones) a fractional one so the scene is not tiny
    this.k = h >= 540 ? Math.max(1, Math.round(h / 270)) : Math.max(1, h / 270);
    this.BW = Math.ceil(w / this.k); this.BH = Math.ceil(h / this.k);
    canvas.width = this.BW; canvas.height = this.BH;
    canvas.style.width = this.BW * this.k + 'px'; canvas.style.height = this.BH * this.k + 'px';
    this.cw = w; this.ch = h;
  },
  update(dt) {
    this.x = damp(this.x, this.tx, 1.8, dt); this.y = damp(this.y, this.ty, 1.8, dt);
    this.trauma = Math.max(0, this.trauma - dt * 3.2); this.punch = Math.max(0, this.punch - dt * 6);
    const s = this.trauma * this.trauma * 5, tt = performance.now() / 1000;
    this.sx = Math.round((noise1(tt * 23) - 0.5) * 2 * s); this.sy = Math.round((noise1(tt * 23 + 99) - 0.5) * 2 * s);
  },
  shake(a) { this.trauma = Math.min(1, this.trauma + a); },
  kick(a) { this.punch = Math.max(this.punch, a); },
  get ox() { return Math.round(this.BW / 2 - this.x * S) + this.sx; },
  get oy() { return Math.round(this.BH / 2 - this.y * S) + this.sy; },
  bx(x) { return Math.round(x * S) + this.ox; },
  by(y) { return Math.round(y * S) + this.oy; },
  apply(ctx) { ctx.setTransform(S, 0, 0, S, this.ox, this.oy); },
  pixel(ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); },
  /* css pixels -> world */
  toScreen(x, y) { return { x: this.bx(x) * this.k, y: this.by(y) * this.k }; },
  toWorld(cx, cy) { const bx = cx / this.k, by = cy / this.k; return { x: (bx - this.ox) / S, y: (by - this.oy) / S }; },
  viewL() { return -this.ox / S; }, viewR() { return (this.BW - this.ox) / S; }, viewT() { return -this.oy / S; }, viewB() { return (this.BH - this.oy) / S; },
};

/* ---------------- sea ---------------- */
const RX0 = -2400, RSTEP = 8, RN = 600;
const Sea = {
  t: 0, travel: 0, speed: 60, amp: 14, swell: 10, storm: 0.3, targetStorm: 0.3, rip: new Float32Array(RN), ripv: new Float32Array(RN),
  height(x) {
    const X = x + this.travel, t = this.t;
    let h = this.swell * Math.sin(X * 0.0019 + t * 0.52) + this.amp * (0.52 * Math.sin(X * 0.0058 - t * 1.02 + 1.3) + 0.28 * Math.sin(X * 0.0131 + t * 1.64) + 0.11 * Math.sin(X * 0.029 - t * 2.5 + 0.7));
    const i = (x - RX0) / RSTEP, i0 = Math.floor(i);
    if (i0 >= 0 && i0 < RN - 1) h += lerp(this.rip[i0], this.rip[i0 + 1], i - i0);
    return h;
  },
  splash(x, amount, width = 24) {
    const c = Math.round((x - RX0) / RSTEP), w = Math.max(1, Math.round(width / RSTEP));
    for (let k = -w; k <= w; k++) { const j = c + k; if (j > 0 && j < RN) this.ripv[j] += amount * (1 - Math.abs(k) / (w + 1)); }
  },
  update(dt) {
    this.t += dt; this.travel += this.speed * dt;
    this.storm = damp(this.storm, this.targetStorm, 0.35, dt);
    this.amp = lerp(16, 40, this.storm); this.swell = lerp(12, 36, this.storm);
    const r = this.rip, v = this.ripv, n = Math.min(3, Math.ceil(dt * 120));
    for (let s = 0; s < n; s++) {
      for (let i = 0; i < RN; i++) v[i] += (-r[i] * 90 - v[i] * 2.4) * (dt / n);
      for (let i = 1; i < RN - 1; i++) v[i] += (r[i - 1] + r[i + 1] - 2 * r[i]) * 900 * (dt / n);
      for (let i = 0; i < RN; i++) r[i] += v[i] * (dt / n);
    }
  },
  /* far sea between the horizon and the wave profile: flat bands with drifting glints */
  drawBack(ctx, flash) {
    const W = Cam.BW, hz = Cam.by(-250), bot = Cam.BH;
    const bands = flash > 0.3 ? ['t5', 't4', 't4', 't3', 't3', 't2'] : ['t3', 't3', 't2', 't2', 't2', 't1'];
    const hgt = Math.max(1, bot - hz);
    for (let i = 0; i < bands.length; i++) { const y0 = hz + Math.round(Math.pow(i / bands.length, 1.7) * hgt); P.rect(ctx, 0, y0, W, bot - y0, C[bands[i]]); }
    P.rect(ctx, 0, hz, W, 1, C[flash > 0.3 ? 't8' : 't5']);
    for (let k = 0; k < 90; k++) {
      const d = hash1(k * 7.3), y = hz + 2 + Math.round(Math.pow(d, 1.6) * 150), sp = 0.1 + d * 0.9;
      const x = ((hash1(k * 3.1) * W * 3 - (Sea.travel * sp * S * 0.6 + this.t * 8 * sp)) % (W + 60) + W + 60) % (W + 60) - 30;
      const len = 2 + Math.round(d * 10 * (0.6 + noise1(k + this.t * 0.4)));
      P.rect(ctx, x, y, len, 1, C[d > 0.6 ? 't4' : 't3']);
    }
    const mx = Math.round(W * Sky.moon.x), ma = clamp(1 - this.storm * 0.7, 0.15, 1);
    for (let k = 0; k < 34; k++) {
      const d = k / 34, y = hz + 1 + Math.round(Math.pow(d, 1.4) * 120), n = noise1(k * 3.1 + this.t * 1.6 + this.travel * 0.003);
      if (n < 1 - ma * 0.9) continue;
      const w = Math.round((3 + d * 22) * n), x = mx + Math.round((noise1(k * 7.7 + this.t * 0.8) - 0.5) * (8 + d * 50));
      P.rect(ctx, x - (w >> 1), y, w, 1, C[n > 0.8 ? 'n8' : 't6']);
    }
  },
  /* near water: one column per buffer pixel, bands by depth, foam on crests */
  drawFront(ctx, flash, glints) {
    const W = Cam.BW, H = Cam.BH, ox = Cam.ox, oy = Cam.oy;
    const deep = ['t4', 't4', 't3', 't3', 't3', 't2', 't2', 't2', 't2', 't1', 't1', 't1', 't1', 't1', 't0'];
    for (let x = 0; x < W; x++) {
      const wx = (x - ox) / S, h = this.height(wx), y = Math.round(h * S) + oy;
      const hn = this.height(wx + 2 / S), slope = hn - h, crest = -h / (this.amp + this.swell);
      let yy = y + 3;
      for (let b = 0; b < deep.length && yy < H; b++) { const bh = 2 + b * 2; ctx.fillStyle = C[deep[b]]; ctx.fillRect(x, yy, 1, bh); yy += bh; }
      if (yy < H) { ctx.fillStyle = C.t0; ctx.fillRect(x, yy, 1, H - yy); }
      ctx.fillStyle = C[flash > 0.3 ? 'foam' : 't6']; ctx.fillRect(x, y, 1, 1);
      ctx.fillStyle = C[flash > 0.3 ? 't8' : 't5']; ctx.fillRect(x, y + 1, 1, 2);
      const n = noise1(wx * 0.045 + this.travel * 0.045 + this.t * 0.9);
      if (crest > 0.15 && n > 0.45) { const f = Math.round((crest - 0.1) * 5 * n); ctx.fillStyle = C.foam; ctx.fillRect(x, y - f + 1, 1, f); if (n > 0.7) { ctx.fillStyle = C.t8; ctx.fillRect(x, y + 1, 1, 1); } }
      else if (slope < -1.2 && n > 0.6) { ctx.fillStyle = C.t8; ctx.fillRect(x, y - 1, 1, 1); }
    }
    const t = this.t;
    for (let k = 0; k < 40; k++) {
      const d = hash1(k * 5.1), x = ((hash1(k * 9.3) * W * 2 - t * (6 + d * 14) - this.travel * S * (0.4 + d * 0.5)) % (W + 40) + W + 40) % (W + 40) - 20;
      const wx = (x - ox) / S, y = Math.round(this.height(wx) * S) + oy + 8 + Math.round(d * 60);
      P.rect(ctx, x, y, 3 + Math.round(d * 8), 1, C[d > 0.5 ? 't3' : 't4']);
    }
    for (const l of glints) {
      const bx = Cam.bx(l.x), sy = Math.round(this.height(l.x) * S) + oy;
      for (let k = 0; k < 8; k++) {
        const w = Math.round((l.r * S * 0.18) * (1 - k / 9) * (0.6 + 0.4 * Math.sin(t * 5 + k * 2.1 + l.x)));
        if (w <= 0) continue; P.rect(ctx, bx - (w >> 1) + Math.round(Math.sin(t * 2 + k) * 3), sy + 4 + k * 5, w, 1, C[k < 3 ? 'f4' : 'f3']);
      }
    }
  },
};

/* ---------------- sky ---------------- */
const Sky = {
  clouds: [], cliffs: [], flash: 0, bolt: null, nextBolt: 6, rain: [], moon: { x: 0.74 }, fog: 0, tint: 0, dawn: 0, dawnTarget: 0, boss: false,
  build() {
    const mk = (w, h, seed, dens, tones) => {
      const c = offscreen(w, h), g = c.getContext('2d');
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const u = x / w, v = y / h, n = lerp(fbm2(u * 7 + seed, v * 2.6, 5), fbm2((u - 1) * 7 + seed, v * 2.6, 5), u);
        const shape = smooth(clamp(1 - Math.abs(v - 0.5) * 2.2, 0, 1)), a = (n - (1 - dens)) * 3 * shape;
        const th = BAYER[(y & 3) * 4 + (x & 3)] / 18 + 0.5;
        if (a <= th * 0.5) continue;
        const lit = clamp((1 - v) * 0.8 + (n - 0.55) * 2, 0, 1) + (th - 0.5) * 0.3;
        g.fillStyle = C[tones[lit > 0.66 ? 2 : lit > 0.33 ? 1 : 0]]; g.fillRect(x, y, 1, 1);
      }
      return c;
    };
    this.mkCloud = mk;
    this.clouds = [
      { c: mk(480, 70, 3.1, 0.6, ['n3', 'n4', 'n5']), y: -330, par: 0.05, sp: 2 },
      { c: mk(480, 64, 9.7, 0.56, ['n2', 'n3', 'n4']), y: -270, par: 0.1, sp: 4 },
      { c: mk(480, 56, 21.3, 0.52, ['n1', 'n2', 'n3']), y: -215, par: 0.18, sp: 7 },
    ];
    const cl = (seed, rough, heightV) => { const pts = []; for (let i = 0; i < 1200; i++) { const u = i / 1200; pts.push(Math.pow(fbm1(u * rough + seed, 5), 1.6) * heightV * (0.6 + 0.4 * Math.sin(u * TAU * 2 + seed))); } return pts; };
    this.cliffs = [{ pts: cl(4.2, 16, 70), par: 0.1, col: ['n3', 'n4'] }, { pts: cl(12.8, 26, 40), par: 0.22, col: ['n2', 'n3'] }];
    for (let i = 0; i < 360; i++) this.rain.push({ x: Math.random(), y: Math.random(), z: rand(0.3, 1) });
  },
  /* the storm answers the kraken: a volley of bolts */
  surge(G) { [0, 0.22, 0.55].forEach((d, i) => G.timers.push({ t: d, f: () => this.strike(null, i === 1) })); Cam.shake(0.18); },
  strike(x = null, sea = false) {
    const W = Cam.BW, bx = x ?? rand(40, W - 40), pts = [[bx, -4]], branches = [];
    let y = -4; const end = sea ? Cam.by(Sea.height(Cam.viewL() + bx / S)) : Cam.by(rand(-420, -200));
    while (y < end) { const [px] = pts[pts.length - 1]; y += randi(6, 13); pts.push([px + randi(-9, 9), y]); if (Math.random() < 0.22) branches.push(pts.length - 1); }
    const br = branches.map((i) => { const b = [pts[i]]; let [x0, y0] = pts[i]; const dir = pick([-1, 1]); for (let k = 0; k < randi(3, 5); k++) { x0 += dir * randi(3, 9); y0 += randi(4, 9); b.push([x0, y0]); } return b; });
    this.bolt = { pts, br, t: sea ? 0.4 : 0.3 }; this.flash = 1;
    if (sea) { const wx = Cam.viewL() + pts[pts.length - 1][0] / S; FX.splash(wx, 1.6); FX.burst(wx, Sea.height(wx) - 6, { n: 14, angle: -Math.PI / 2, spread: 0.8, speed: 260, size: 3, color: 'b4', color2: 'n7', grav: 300, life: 0.7, kind: 'mist' }); FX.light(wx, Sea.height(wx) - 40, 500, [190, 230, 255], 1.4); Cam.shake(0.08); }
    Sfx.play('thunder', clamp((bx - W / 2) / W * 2, -1, 1), 1);
  },
  update(dt, storm) {
    this.flash = Math.max(0, this.flash - dt * 2.8);
    if (this.bolt) { this.bolt.t -= dt; if (this.bolt.t <= 0) this.bolt = null; }
    this.dawn = damp(this.dawn, this.dawnTarget, 0.45, dt);
    if (storm > 0.45) { this.nextBolt -= dt; if (this.nextBolt <= 0) { this.nextBolt = this.boss ? rand(1.3, 3.6) : rand(4, 11) / storm; if (this.boss && Math.random() < 0.4) this.strike(rand(Cam.BW * 0.15, Cam.BW * 0.85), true); else this.strike(); } }
  },
  drawSky(ctx) {
    const W = Cam.BW, f = this.flash, hz = Math.max(1, Cam.by(-250));
    const g = ctx.createLinearGradient(0, 0, 0, hz), bt = this.tint, dw = this.dawn;
    // night -> the kraken's bruised green-violet sky -> dawn once it is gone
    const stop = (night, boss, dawn, fl) => { const c = mixc(mixc(night, boss, bt), dawn, dw); return rgba(c[0] + f * fl[0], c[1] + f * fl[1], c[2] + f * fl[2]); };
    const N = this.skyCols || [[8, 11, 24], [22, 33, 55], [44, 76, 96]];
    g.addColorStop(0, stop(N[0], [18, 6, 24], [34, 38, 78], [80, 90, 110])); g.addColorStop(0.7, stop(N[1], [44, 18, 46], [150, 96, 112], [90, 100, 110])); g.addColorStop(1, stop(N[2], [62, 104, 70], [255, 168, 104], [80, 90, 90]));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, hz);
    if (bt > 0.02) { const sg = ctx.createLinearGradient(0, hz - 40, 0, hz); sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(1, rgba(120, 255, 170, 0.18 * bt * (1 - dw))); ctx.fillStyle = sg; ctx.fillRect(0, hz - 40, W, 40); }
    if (bt > 0.6 && dw < 0.3) return; // the moon is swallowed by the storm
    const mx = Math.round(W * this.moon.x), my = Math.round(clamp(hz * 0.3, 16, 60)), ma = Sea.storm < 0.8;
    const MC = this.moonCol || ['b3', 'b4', 'b2', [140, 170, 200]];
    const mg = ctx.createRadialGradient(mx, my, 4, mx, my, 70); mg.addColorStop(0, rgba(MC[3][0], MC[3][1], MC[3][2], ma ? 0.35 : 0.15)); mg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = mg; ctx.fillRect(mx - 70, my - 70, 140, 140);
    P.disc(ctx, mx, my, 9, C[MC[0]]); P.disc(ctx, mx - 2, my - 1, 8, C[MC[1]]); P.dot(ctx, mx + 3, my + 2, C[MC[2]], 2); P.dot(ctx, mx - 3, my - 3, C[MC[0]], 2); P.dot(ctx, mx + 1, my - 4, C[MC[2]]);
  },
  drawClouds(ctx, t) {
    const f = this.flash;
    for (const L of this.clouds) {
      const y = Cam.by(L.y), w = L.c.width, off = Math.round(((Sea.travel * L.par * S * 0.6 + t * L.sp + Cam.x * L.par * S) % w + w) % w);
      for (let x = -off; x < Cam.BW; x += w) ctx.drawImage(L.c, x, y);
      if (f > 0.2) { ctx.globalAlpha = f * 0.5; ctx.globalCompositeOperation = 'lighter'; for (let x = -off; x < Cam.BW; x += w) ctx.drawImage(L.c, x, y); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
    }
  },
  /* dawn after the kraken: a warm sun glow rising over the cliffs */
  drawDawn(ctx) {
    const dw = this.dawn; if (dw < 0.02) return;
    const W = Cam.BW, hz = Cam.by(-250), sx = Math.round(W * 0.3), R = 220;
    ctx.globalCompositeOperation = 'lighter';
    const sg = ctx.createRadialGradient(sx, hz, 2, sx, hz, R); sg.addColorStop(0, rgba(255, 200, 120, 0.8 * dw)); sg.addColorStop(0.35, rgba(200, 110, 70, 0.35 * dw)); sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg; ctx.fillRect(sx - R, hz - R, R * 2, R + 30);
    ctx.globalCompositeOperation = 'source-over';
    P.disc(ctx, sx, hz + 2, Math.round(6 + dw * 5), C.f6); P.disc(ctx, sx, hz + 2, Math.round(4 + dw * 4), C.white);
  },
  drawBolt(ctx) {
    if (!this.bolt) return; const b = this.bolt;
    if (Math.random() < 0.2 && b.t < 0.2) return;
    const path = (p, c, w) => { for (let i = 1; i < p.length; i++) P.line(ctx, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1], c, w); };
    path(b.pts, C.n7, 3); b.br.forEach((p) => path(p, C.n6, 1)); path(b.pts, C.white, 1);
  },
  drawCliffs(ctx) {
    const hz = Cam.by(-250), W = Cam.BW;
    for (const c of this.cliffs) {
      const off = Math.round(Cam.x * c.par * S + Sea.travel * c.par * S * 0.3), n = c.pts.length, f = this.flash > 0.3;
      for (let x = 0; x < W; x++) {
        const i = ((x + off) % n + n) % n, h = Math.round(c.pts[i]), top = hz - h;
        ctx.fillStyle = C[f ? 'n5' : c.col[0]]; ctx.fillRect(x, top, 1, hz - top);
        const sn = c.pts[(i + 1) % n] > c.pts[i] ? 1 : 0;
        ctx.fillStyle = C[f ? 'n8' : c.col[1]]; ctx.fillRect(x, top, 1, 1 + sn);
        if (h > 60 && hash1(i) > 0.4) { ctx.fillStyle = C[f ? 'b4' : 'n6']; ctx.fillRect(x, top, 1, 1); }
      }
    }
    if (this.fog > 0.01) { ctx.fillStyle = `rgba(90,120,120,${0.25 * this.fog})`; ctx.fillRect(0, 0, W, Cam.BH); }
  },
  drawRain(ctx, dt, storm, wind) {
    if (storm < 0.25) return;
    const W = Cam.BW, H = Cam.BH, n = Math.floor(this.rain.length * clamp((storm - 0.25) / 0.75, 0, 1)), f = this.flash > 0.3;
    const dx = Math.round(clamp(wind * 0.004, -2, 2));
    for (let i = 0; i < n; i++) {
      const r = this.rain[i];
      r.y += dt * (1.3 + r.z * 1.5); r.x += dt * wind * 0.0002 * r.z;
      if (r.y > 1) { r.y -= 1; r.x = Math.random(); }
      r.x = ((r.x % 1) + 1) % 1;
      const x = Math.round(r.x * W), y = Math.round(r.y * H), len = 2 + Math.round(r.z * 4);
      ctx.fillStyle = C[f ? 'b4' : r.z > 0.7 ? 'n7' : 'n5'];
      for (let k = 0; k < len; k++) ctx.fillRect(x - Math.round(dx * k / len), y - k, 1, 1);
    }
  },
};

/* ---------------- particles, lights, floating text ---------------- */
const FX = {
  parts: [], lights: [], texts: [], hitstop: 0, timeScale: 1, slowT: 0, rings: [], slashes: [],
  burst(x, y, o = {}) {
    const n = o.n ?? 10;
    for (let i = 0; i < n; i++) {
      const a = (o.angle ?? -Math.PI / 2) + rand(-1, 1) * (o.spread ?? Math.PI), sp = rand(0.3, 1) * (o.speed ?? 300), life = rand(0.6, 1) * (o.life ?? 0.6);
      this.parts.push({
        x: x + rand(-1, 1) * (o.jit ?? 4), y: y + rand(-1, 1) * (o.jit ?? 4), vx: Math.cos(a) * sp + (o.vx ?? 0), vy: Math.sin(a) * sp + (o.vy ?? 0),
        life, max: life, size: Math.max(1, Math.round(rand(0.6, 1.2) * (o.size ?? 2))), col: o.color ?? 'foam', col2: o.color2, grav: o.grav ?? 900,
        drag: o.drag ?? 1.5, rot: rand(0, TAU), vr: rand(-12, 12), kind: o.kind ?? 'dot', water: o.water ?? true,
      });
    }
  },
  splash(x, power = 1) {
    const y = Sea.height(x);
    Sea.splash(x, 120 * power, 20 + power * 20);
    this.burst(x, y, { n: 12 + power * 14, angle: -Math.PI / 2, spread: 0.7, speed: 240 + power * 260, size: 2, color: 'foam', color2: 't7', grav: 1100, life: 0.9, water: false, kind: 'drop' });
    this.burst(x, y, { n: 6 + power * 6, angle: -Math.PI / 2, spread: 1.5, speed: 120, size: 3, color: 't8', grav: 160, life: 0.6, water: false, kind: 'mist', drag: 3 });
    this.rings.push({ x, r: 4, life: 0.5, max: 0.5 });
    Sfx.play(power > 1.4 ? 'splashBig' : 'splash', clamp((x - Cam.x) / 700, -1, 1), clamp(power * 0.7, 0.3, 1));
  },
  splinters(x, y, n = 12, dir = 0, col = 'w4') { this.burst(x, y, { n, angle: dir - Math.PI / 2, spread: 1.4, speed: 420, size: 2, color: col, color2: 'w2', grav: 1300, life: 1.1, kind: 'splinter' }); },
  sparks(x, y, n = 10, dir = -Math.PI / 2) { this.burst(x, y, { n, angle: dir, spread: 1.2, speed: 520, size: 1, color: 'f5', color2: 'f3', grav: 900, life: 0.3, kind: 'spark' }); },
  impact(x, y, big = false) { this.hitSpark(x, y, 0, big); },
  sparksAnim: [], lines: [],
  hitSpark(x, y, ang, big) { this.sparksAnim.push({ x, y, ang, big, t0: performance.now() }); },
  slashLine(x, y, ang, big) { this.lines.push({ x, y, ang, big, t0: performance.now() }); },
  drawHits(ctx) {
    const now = performance.now();
    for (const s of this.sparksAnim) {
      const f = Math.floor((now - s.t0) / 34), bx = Cam.bx(s.x), by = Cam.by(s.y), B = s.big ? 1.15 : 0.8;
      if (f > 5) { s.done = true; continue; }
      const ray = (len0, len1, col, w) => { for (let i = 0; i < 8; i++) { const a = s.ang + i * Math.PI / 4, el = i % 4 === 0 ? 1.6 : i % 2 ? 0.7 : 1; P.line(ctx, bx + Math.cos(a) * len0 * el, by + Math.sin(a) * len0 * el, bx + Math.cos(a) * len1 * el, by + Math.sin(a) * len1 * el, col, w); } };
      if (f === 0) { P.disc(ctx, bx, by, Math.round(4 * B), C.white); P.ring(ctx, bx, by, Math.round(6 * B), C.f6); }
      else if (f === 1) { ray(2, 11 * B, C.white, 1); P.disc(ctx, bx, by, Math.round(3 * B), C.f6); }
      else if (f === 2) { ray(4 * B, 14 * B, C.f6, 1); P.ring(ctx, bx, by, Math.round(7 * B), C.b4); P.disc(ctx, bx, by, 2, C.white); }
      else if (f === 3) { ray(10 * B, 15 * B, C.f4, 1); P.ring(ctx, bx, by, Math.round(10 * B), C.f3); }
      else { for (let i = 0; i < 6; i++) { const a = s.ang + i * 1.05; P.dot(ctx, bx + Math.cos(a) * 15 * B, by + Math.sin(a) * 15 * B, C.f3); } }
    }
    this.sparksAnim = this.sparksAnim.filter((s) => !s.done);
    for (const l of this.lines) {
      const f = Math.floor((now - l.t0) / 34), bx = Cam.bx(l.x), by = Cam.by(l.y), len = (l.big ? 26 : 18) + f * 4;
      if (f > 2) { l.done = true; continue; }
      const c = Math.cos(l.ang), sn = Math.sin(l.ang);
      P.line(ctx, bx - c * len, by - sn * len, bx + c * len, by + sn * len, C[f === 0 ? 'white' : f === 1 ? 'b4' : 'b2'], f === 0 && l.big ? 2 : 1);
    }
    this.lines = this.lines.filter((l) => !l.done);
  },
  light(x, y, r, c, i = 1) { this.lights.push({ x, y, r, c, i }); },
  text(x, y, s, col = 'f5', size = 20, life = 1.1) { this.texts.push({ x, y, s, col, size: Math.round(size * 0.45) + 3, life, max: life, vy: -60 }); },
  stop(t) { this.hitstop = Math.max(this.hitstop, t); },
  slowmo(scale, dur) { this.timeScale = scale; this.slowT = dur; },
  update(dt) {
    if (this.slowT > 0) { this.slowT -= dt / Math.max(this.timeScale, 0.05); if (this.slowT <= 0) this.timeScale = 1; }
    for (const p of this.parts) {
      p.life -= dt; p.vy += p.grav * dt; const k = Math.exp(-p.drag * dt); p.vx *= k; p.vy *= k; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      if (p.water && p.y > Sea.height(p.x) + 2) { p.life = 0; if (p.size > 1 && Math.random() < 0.3) Sea.splash(p.x, 20, 8); }
      if (p.kind === 'ember') p.vx += Math.sin(p.life * 9 + p.rot) * 30 * dt;
    }
    this.parts = this.parts.filter((p) => p.life > 0);
    if (this.parts.length > 1400) this.parts.splice(0, this.parts.length - 1400);
    for (const t of this.texts) { t.life -= dt; t.y += t.vy * dt; t.vy *= Math.exp(-2.5 * dt); }
    this.texts = this.texts.filter((t) => t.life > 0);
    for (const r of this.rings) { r.life -= dt; r.r += dt * 40; } this.rings = this.rings.filter((r) => r.life > 0);
    for (const s of this.slashes) s.life -= dt; this.slashes = this.slashes.filter((s) => s.life > 0);
  },
  draw(ctx) {
    for (const r of this.rings) {
      const bx = Cam.bx(r.x), by = Cam.by(Sea.height(r.x)), w = Math.round(r.r);
      ctx.fillStyle = C[r.life / r.max > 0.5 ? 'foam' : 't7']; ctx.fillRect(bx - w, by, 2, 1); ctx.fillRect(bx + w - 1, by, 2, 1); if (w > 6) { ctx.fillRect(bx - w + 2, by - 1, 1, 1); ctx.fillRect(bx + w - 2, by - 1, 1, 1); }
    }
    for (const p of this.parts) {
      const a = p.life / p.max, bx = Cam.bx(p.x), by = Cam.by(p.y), col = C[a < 0.45 && p.col2 ? p.col2 : p.col] || p.col;
      ctx.fillStyle = col;
      if (p.kind === 'splinter') { const hor = Math.abs(Math.cos(p.rot)) > 0.5; ctx.fillRect(bx, by, hor ? 3 : 1, hor ? 1 : 3); }
      else if (p.kind === 'spark') P.line(ctx, bx, by, Cam.bx(p.x - p.vx * 0.02), Cam.by(p.y - p.vy * 0.02), col, 1);
      else if (p.kind === 'drop') ctx.fillRect(bx, by, 1, p.size);
      else if (p.kind === 'mist' || p.kind === 'smoke' || p.kind === 'ink') P.dither(ctx, bx, by, Math.max(1, Math.round(p.size * (1.6 - a))), col, a * (p.kind === 'ink' ? 0.9 : 0.55));
      else { const s = a > 0.5 ? p.size : Math.max(1, p.size - 1); ctx.fillRect(bx - (s >> 1), by - (s >> 1), s, s); }
    }
    for (const s of this.slashes) {
      const bx = Cam.bx(s.x), by = Cam.by(s.y), r = s.big ? 10 : 6, k = s.life / s.max;
      P.line(ctx, bx - r, by, bx + r, by, C.white, 1); P.line(ctx, bx, by - r, bx, by + r, C.white, 1);
      if (s.big) { P.line(ctx, bx - r * 0.6, by - r * 0.6, bx + r * 0.6, by + r * 0.6, C.f5, 1); P.line(ctx, bx - r * 0.6, by + r * 0.6, bx + r * 0.6, by - r * 0.6, C.f5, 1); }
      if (k > 0.5) P.disc(ctx, bx, by, s.big ? 3 : 2, C.white);
    }
  },
  drawTexts(ctx) {
    for (const t of this.texts) {
      const a = t.life / t.max, pop = t.max - t.life < 0.1 ? 2 : 0;
      if (a < 0.2 && Math.floor(t.life * 30) % 2) continue;
      text(ctx, t.s, Cam.bx(t.x), Cam.by(t.y) - pop, { size: t.size + pop, align: 'center', color: C[t.col] || t.col, bold: true, outline: true });
    }
  },
};

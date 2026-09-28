'use strict';
/* What chapters 3–5 share: three new skies (the fire isles, the sea of the dead, the end of the world), hazards that are marked
   on the deck before they land (fire rain, lightning, venom, soul fire, boulders), flying foes, enemy spells, and the boss registry. */
const BOSSES = {};

/* ---------------- skies ---------------- */
const THEMES = {
  sea: { sky: null, amb: [118, 134, 168], moon: null, clouds: [['n3', 'n4', 'n5'], ['n2', 'n3', 'n4'], ['n1', 'n2', 'n3']] },
  ice: { sky: null, amb: [118, 134, 168], moon: null, clouds: [['n3', 'n4', 'n5'], ['n2', 'n3', 'n4'], ['n1', 'n2', 'n3']] },
  fire: { sky: [[26, 8, 8], [84, 24, 14], [176, 72, 30]], amb: [176, 122, 100], moon: ['f2', 'f3', 'f1', [255, 120, 60]], clouds: [['r0', 'f0', 'f1'], ['k0', 'r0', 'f0'], ['ink', 'k0', 'r0']],
    cliffs: [{ seed: 3.3, rough: 22, h: 84, sharp: true, par: 0.1, col: ['k0', 'f1'] }, { seed: 9.1, rough: 36, h: 48, sharp: true, par: 0.22, col: ['ink', 'f0'] }] },
  hel: { sky: [[4, 10, 12], [12, 30, 30], [30, 66, 58]], amb: [100, 142, 136], moon: ['d2', 'd3', 'd1', [120, 255, 200]], clouds: [['d0', 'd1', 'd2'], ['n1', 'd0', 'd1'], ['ink', 'n1', 'd0']],
    cliffs: [{ seed: 5.2, rough: 18, h: 76, sharp: true, par: 0.1, col: ['d0', 'd1'] }, { seed: 13.7, rough: 30, h: 42, sharp: false, par: 0.22, col: ['ink', 'd0'] }] },
  ragnarok: { sky: [[22, 4, 10], [72, 14, 22], [166, 58, 40]], amb: [176, 128, 122], moon: ['r3', 'r4', 'r2', [255, 80, 60]], clouds: [['r0', 'r1', 'k2'], ['k0', 'r0', 'r1'], ['ink', 'k0', 'r0']],
    cliffs: [{ seed: 7.7, rough: 26, h: 92, sharp: true, par: 0.1, col: ['k0', 'r1'] }, { seed: 2.9, rough: 40, h: 50, sharp: true, par: 0.22, col: ['ink', 'r0'] }] },
};
{
  const base = Sky.setTheme.bind(Sky), cloudCache = {};
  Sky.setTheme = function (th) {
    base(th); const T = THEMES[th] || THEMES.sea;
    this.skyCols = T.sky; this.amb = T.amb; this.moonCol = T.moon;
    if (T.cliffs) {
      const cl = (c) => { const pts = []; for (let i = 0; i < 1200; i++) { const u = i / 1200; let v = Math.pow(fbm1(u * c.rough + c.seed, 5), c.sharp ? 1.1 : 1.6) * c.h * (0.6 + 0.4 * Math.sin(u * TAU * 2 + c.seed)); if (c.sharp) v *= 0.7 + 0.6 * Math.abs(Math.sin(u * c.rough * 1.7 + c.seed)); pts.push(v); } return pts; };
      this.cliffs = T.cliffs.map((c) => ({ pts: cl(c), par: c.par, col: c.col }));
    }
    if (this.mkCloud && this.clouds) {
      const key = th === 'ice' ? 'sea' : th;
      cloudCache[key] ??= this.clouds.map((L, i) => ({ ...L, c: this.mkCloud(480, [70, 64, 56][i], [3.1, 9.7, 21.3][i], [0.6, 0.56, 0.52][i], (THEMES[key] || THEMES.sea).clouds[i]) }));
      this.clouds = cloudCache[key];
    }
    this.erupt = 0; this.lava = [];
  };
  const cliffs = Sky.drawCliffs.bind(Sky);
  Sky.drawCliffs = function (ctx) { this.drawFar(ctx); cliffs(ctx); };
}
Object.assign(Sky, {
  erupt: 0, lava: [],
  ambient() { return this.amb || [118, 134, 168]; },
  /* far scenery behind the cliffs: a volcano in the fire isles, the world tree burning at the end of the world */
  drawFar(ctx) {
    const W = Cam.BW, hz = Cam.by(-250), t = G.t;
    if (this.theme === 'fire') {
      const span = W + 260, x0 = Math.round((((W * 0.74 - Cam.x * S * 0.05 - Sea.travel * S * 0.02) % span) + span) % span) - 130, h = 118, cw = 12;
      for (let y = 0; y < h; y++) { const hw = cw + Math.round((y / h) * 120 + Math.sin(y * 0.3) * 2); ctx.fillStyle = C[y < 3 ? 'f1' : 'k0']; ctx.fillRect(x0 - hw, hz - h + y, hw * 2, 1); if (y > 6 && (y * 7) % 11 === 0) { ctx.fillStyle = C.f0; ctx.fillRect(x0 - hw + 3, hz - h + y, 3, 1); } }
      // lava runnels down the flanks, brighter while it erupts
      for (let k = 0; k < 4; k++) { const sx = x0 + (k - 1.5) * 7; for (let y = 2; y < h * (0.45 + 0.15 * k) ; y += 1) { const xx = Math.round(sx + (k - 1.5) * y * 0.5 + Math.sin(y * 0.2 + k) * 2); ctx.fillStyle = C[(y + Math.floor(t * 6)) % 5 === 0 ? 'f5' : this.erupt > 0.2 ? 'f4' : 'f2']; ctx.fillRect(xx, hz - h + y, 1, 1); } }
      const glow = 0.4 + 0.2 * Math.sin(t * 1.7) + this.erupt;
      ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x0, hz - h, 2, x0, hz - h, 90 + this.erupt * 80); g.addColorStop(0, rgba(255, 150, 60, 0.5 * glow)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x0 - 170, hz - h - 170, 340, 260); ctx.globalCompositeOperation = 'source-over';
      // smoke column, and lava bombs while it erupts
      for (let i = 0; i < 14; i++) { const u = ((t * 0.12 + i / 14) % 1), sx = x0 + Math.sin(u * 6 + i) * (4 + u * 30) + u * 50 * WIND.v, sy = hz - h - u * 150, r = Math.round(3 + u * 12); P.disc(ctx, sx, sy, r, C[u < 0.2 && this.erupt > 0.2 ? 'f1' : i % 2 ? 'k1' : 'n1']); }
      if (this.erupt > 0.05 && Math.random() < this.erupt * 0.8) this.lava.push({ x: x0 + rand(-6, 6), y: hz - h, vx: rand(-60, 60), vy: rand(-160, -90), life: 2.2 });
      for (const b of this.lava) { b.life -= 1 / 60; b.vy += 90 / 60; b.x += b.vx / 60; b.y += b.vy / 60; P.rect(ctx, Math.round(b.x), Math.round(b.y), 2, 2, C[b.life > 1.2 ? 'f6' : 'f4']); }
      this.lava = this.lava.filter((b) => b.life > 0 && b.y < hz);
      this.erupt = Math.max(0, this.erupt - 1 / 60 * 0.25);
    } else if (this.theme === 'ragnarok') {
      // the burning horizon and Yggdrasil black against it
      ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, hz - 70, 0, hz); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, rgba(255, 90, 40, 0.35 + 0.08 * Math.sin(t * 2))); ctx.fillStyle = g; ctx.fillRect(0, hz - 70, W, 70); ctx.globalCompositeOperation = 'source-over';
      const span = W + 400, x0 = Math.round((((W * 0.3 - Cam.x * S * 0.04) % span) + span) % span) - 200;
      YGG ??= makeYgg(); ctx.drawImage(YGG, x0 - YGG.width / 2, hz - YGG.height + 6);
      for (let i = 0; i < 6; i++) { const f = hash1(i * 3.3), fx = x0 - 60 + f * 120, fy = hz - 40 - hash1(i * 7.7) * 90; if (Math.floor(t * 8 + i) % 3) P.dot(ctx, fx, fy, C[i % 2 ? 'f4' : 'f5'], 2); }
    } else if (this.theme === 'hel') {
      // the gate of Hel far off, lanterns drifting on the black water
      const span = W + 300, x0 = Math.round((((W * 0.6 - Cam.x * S * 0.05) % span) + span) % span) - 150;
      for (let y = 0; y < 70; y++) { const hw = 26 - Math.round(y * 0.1); ctx.fillStyle = C.ink; ctx.fillRect(x0 - hw - 8, hz - 70 + y, 8, 1); ctx.fillRect(x0 + hw, hz - 70 + y, 8, 1); }
      P.rect(ctx, x0 - 38, hz - 76, 76, 7, C.ink); for (let k = -1; k <= 1; k += 2) P.rect(ctx, x0 + k * 30, hz - 84, 4, 9, C.ink);
      ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x0, hz - 30, 2, x0, hz - 30, 60); g.addColorStop(0, rgba(110, 255, 210, 0.4 + 0.1 * Math.sin(t * 2))); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x0 - 60, hz - 90, 120, 90); ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < 9; i++) { const lx = (((hash1(i) * W - Cam.x * S * 0.12 + t * 4) % W) + W) % W, ly = hz - 2 - Math.round(Math.sin(t + i) * 1.5); P.dot(ctx, lx, ly, C.g2); P.dot(ctx, lx, ly + 2, C.d2); }
    }
  },
  drawWeather(ctx, dt, storm, wind) {
    const th = this.theme;
    if (th === 'ice') return this.drawSnow(ctx, dt, storm, wind);
    if (th === 'sea') return this.drawRain(ctx, dt, storm, wind);
    const W = Cam.BW, H = Cam.BH, n = Math.floor(this.rain.length * 0.55);
    for (let i = 0; i < n; i++) {
      const r = this.rain[i], ember = i % 5 === 0;
      if (th === 'hel') { r.y -= dt * (0.02 + r.z * 0.04); r.x += dt * Math.sin(G.t * 0.8 + i) * 0.01; }
      else if (ember) { r.y -= dt * (0.05 + r.z * 0.08); r.x += dt * (wind * 0.0001 + Math.sin(G.t * 2 + i) * 0.02); }
      else { r.y += dt * (0.05 + r.z * 0.08); r.x += dt * wind * 0.00008 * r.z; }
      if (r.y > 1) { r.y -= 1; r.x = Math.random(); } if (r.y < 0) { r.y += 1; r.x = Math.random(); }
      r.x = ((r.x % 1) + 1) % 1;
      const x = Math.round(r.x * W), y = Math.round(r.y * H);
      if (th === 'hel') { if (i % 3) continue; const on = Math.sin(G.t * 3 + i) > -0.3; ctx.fillStyle = C[r.z > 0.8 ? 'g3' : 'g1']; if (on) ctx.fillRect(x, y, 1, r.z > 0.7 ? 2 : 1); continue; }
      ctx.fillStyle = C[ember ? (Math.floor(G.t * 10 + i) % 2 ? 'f5' : 'f3') : r.z > 0.7 ? 'm2' : 'm1']; ctx.fillRect(x, y, ember || r.z < 0.8 ? 1 : 2, 1);
    }
    if (th === 'ragnarok') this.drawRain(ctx, dt, Math.max(storm, 0.4), wind);
    else if (th === 'hel' && storm > 0.5) this.drawRain(ctx, dt, storm, wind);
  },
});
let YGG = null;
function makeYgg() {
  const W = 180, H = 150, c = offscreen(W, H), g = c.getContext('2d'); g.fillStyle = C.ink;
  const branch = (x, y, a, len, w, d) => { if (d > 6 || len < 4) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; P.line(g, x, y, x2, y2, C.ink, Math.max(1, Math.round(w))); branch(x2, y2, a - 0.45 + hash1(d * 3 + x) * 0.2, len * 0.72, w * 0.66, d + 1); branch(x2, y2, a + 0.4 - hash1(d * 5 + y) * 0.2, len * 0.7, w * 0.62, d + 1); };
  g.fillRect(W / 2 - 5, H - 60, 10, 60); for (let k = -3; k <= 3; k++) P.line(g, W / 2, H - 4, W / 2 + k * 16, H, C.ink, 2);
  branch(W / 2, H - 58, -HALF_PI, 34, 8, 0);
  return c;
}

/* ---------------- hazards: marked on a deck, then they land ---------------- */
sprite('fireball', ['.ffff.', 'fYYYYf', 'fYWWYf', 'fYWWYf', 'fYYYYf', '.ffff.'], { f: 'f3', Y: 'f5', W: 'f6' });
sprite('venomball', ['.gggg.', 'gGGGGg', 'gGWGGg', 'gGGGGg', '.gggg.'], { g: 'd2', G: 'green', W: 'white' });
sprite('soulball', ['.gggg.', 'gGGGGg', 'gGWWGg', 'gGWWGg', 'gGGGGg', '.gggg.'], { g: 'g1', G: 'g2', W: 'white' });
sprite('boulder', ['..rrrr..', '.rRRRRr.', 'rRRLRRRr', 'rRLLRRRr', 'rRRRRlRr', 'rRRRllRr', '.rRRRRr.', '..rrrr..'], { r: 'm0', R: 'm1', L: 'm2', l: 'f2' });
const HAZ = {
  fire: { col: 'f4', img: 'fireball', light: [255, 150, 60] },
  bolt: { col: 'b4', img: null, light: [180, 210, 255] },
  venom: { col: 'green', img: 'venomball', light: [120, 255, 120] },
  soul: { col: 'g2', img: 'soulball', light: [110, 255, 220] },
  rock: { col: 'f2', img: 'boulder', light: [255, 150, 60] },
};
Object.assign(G, {
  hazards: [], pools: [], corpses: [],
  resetRealm() {
    this.hazards = []; this.pools = []; this.corpses = []; this.zaps = []; this.tethers = []; Quakes.list = []; this.hammerOut = false;
    if (this.captain) this.captain.busyT = 0;
    if (this.shots) this.shots = this.shots.filter((p) => p.kind !== 'mjolnir');
  },
  /* {kind, ship, lx, t, dmg, r} */
  hazard(o) { const h = { ship: this.player, r: 36, t: 1, dmg: 12, ...o }; h.max = h.t; h.lx = clamp(h.lx, -h.ship.walk + 6, h.ship.walk - 6); this.hazards.push(h); return h; },
  /* n marks over the deck, the first one under the captain */
  volley(n, kind, dmg = 12 + this.step * 1.5, gap = 0.3, ship = this.player) {
    const cap = this.captain;
    for (let i = 0; i < n; i++) this.timers.push({ t: i * gap, f: () => { if (this.state !== 'fight') return; const lx = i === 0 && cap.ship === ship ? cap.lx : rand(-ship.walk + 20, ship.walk - 20); this.hazard({ kind, ship, lx, t: 1.0, dmg }); } });
  },
  landHazard(h) {
    const s = h.ship, p = s.toWorld(h.lx, s.deckY(h.lx)), cap = this.captain, K = HAZ[h.kind];
    if (h.kind === 'bolt') { thunderAt(this, p.x, p.y - 20, h.dmg, h.r + 10, true); return; }
    Cam.shake(h.kind === 'rock' ? 0.3 : 0.15); Sfx.play(h.kind === 'rock' ? 'slam' : 'crack', clamp((p.x - Cam.x) / 700, -1, 1), 0.8);
    FX.burst(p.x, p.y - 4, { n: 22, speed: 320, size: 2, color: K.col, color2: h.kind === 'rock' ? 'f4' : K.col, grav: 700, life: 0.6 }); FX.light(p.x, p.y - 20, 260, K.light, 1.5);
    if (h.kind === 'rock') { FX.splinters(p.x, p.y, 18); if (s === this.player) s.damage(h.dmg * 0.8, h.lx); }
    if (cap.ship === s && !cap.air && Math.abs(cap.lx - h.lx) < h.r && cap.down <= 0 && cap.dodge <= 0) { if (cap.hurt(h.dmg, Math.sign(cap.lx - h.lx || 1) * 240, -380, { stun: 0.3 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
    for (const e of this.enemies) if (!e.dead && e.ship === s && !e.air && Math.abs(e.lx - h.lx) < h.r) { e.hurt(h.dmg * 1.2, Math.sign(e.lx - h.lx || 1) * 300, -420, { stun: 0.6 }); if (e.hp <= 0) this.kill(e, cap); }
    if (h.kind === 'fire' && s === this.player && Math.random() < 0.45) this.fireAt(h.lx);
    if (h.kind === 'venom') this.pools.push({ ship: s, lx: h.lx, w: h.r, t: 6, max: 6, seed: rand(0, 9) });
  },
  updateRealm(dt) {
    this.updateArms(dt);
    for (const h of this.hazards) { h.t -= dt; if (h.t <= 0 && !h.done) { h.done = true; if (!h.ship.sunk) this.landHazard(h); } }
    this.hazards = this.hazards.filter((h) => !h.done);
    // venom pools sting whoever stands in them
    const cap = this.captain;
    for (const p of this.pools) {
      p.t -= dt;
      if (cap.ship === p.ship && !cap.air && Math.abs(cap.lx - p.lx) < p.w && cap.iframes <= 0) { p.tick = (p.tick || 0) - dt; if (p.tick <= 0) { p.tick = 0.4; if (cap.hurt(4 + this.step * 0.3, 0, 0, { stun: 0 })) { UI.pulse('hurt'); Sfx.play('fire', 0, 0.3); } } }
    }
    this.pools = this.pools.filter((p) => p.t > 0);
    // enemies with a trick of their own (wraiths fade, golems smoulder, giants throw)
    for (const e of this.enemies) {
      if (e.stats.tick && !e.dead && !e.water) e.stats.tick(this, e, dt);
      if (e.phased > 0) e.phased -= dt;
      if (e.thrown > 0) {
        e.thrown -= dt;
        if (e.air && cap.down <= 0 && Math.hypot(e.cx - cap.cx, e.cy - cap.cy) < 44 * e.scale) { e.thrown = 0; if (cap.hurt(18 * (1 + this.step * 0.04), Math.sign(e.vx) * 420, -380, { stun: 0.5 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); Cam.shake(0.2); } FX.hitSpark(cap.cx, cap.cy, 0, true); }
      }
    }
    this.corpses = this.corpses.filter((c) => this.t - c.t < 40 && !c.used);
  },
  drawRealm(ctx, t) {
    for (const p of this.pools) {
      const s = p.ship, k = clamp(p.t / 1, 0, 1), n = Math.round(p.w * 2 * S);
      for (let j = 0; j < n; j++) { if (k < 1 && hash1(j + p.seed) > k) continue; const lx = p.lx - p.w + j / S, q = s.toWorld(lx, s.deckY(lx)), bx = Cam.bx(q.x), by = Cam.by(q.y); P.rect(ctx, bx, by - 1, 1, 2, C[hash1(j * 3.1 + p.seed) > 0.7 ? 'green' : 'd2']); if (hash1(j + Math.floor(t * 4) + p.seed) > 0.95) P.dot(ctx, bx, by - 3 - Math.floor((t * 6 + j) % 3), C.green); }
    }
    for (const h of this.hazards) {
      const s = h.ship, K = HAZ[h.kind], u = 1 - h.t / h.max, p = s.toWorld(h.lx, s.deckY(h.lx)), bx = Cam.bx(p.x), by = Cam.by(p.y), w = Math.round(h.r * S), blink = Math.floor(t * (6 + u * 10)) % 2;
      // the mark: a pulsing bracket on the planks that tightens as it comes
      P.rect(ctx, bx - w, by - 1, w * 2, 1, C[blink ? K.col : 'ink']); P.rect(ctx, bx - w, by - 4, 1, 4, C[K.col]); P.rect(ctx, bx + w - 1, by - 4, 1, 4, C[K.col]);
      const iw = Math.round(w * (1 - u)); P.rect(ctx, bx - iw, by - 2, 1, 2, C.white); P.rect(ctx, bx + iw, by - 2, 1, 2, C.white);
      if (h.kind === 'bolt') { if (u > 0.5 && Math.random() < u) { const x2 = bx + randi(-6, 6); P.line(ctx, bx, by - 2, x2, by - 10 - randi(0, 8), C.b4, 1); } FX.light(p.x, p.y - 20, 60 + u * 80, K.light, 0.4 + u * 0.6); continue; }
      if (h.t < 0.35 && K.img) { const img = SPR[K.img], yy = by - Math.round((h.t / 0.35) * 220); blit(ctx, img, bx - (img.width >> 1), yy - img.height); FX.light(p.x, p.y - (h.t / 0.35) * 440, 90, K.light, 1); if (Math.random() < 0.6) FX.burst(p.x, p.y - (h.t / 0.35) * 440 - 10, { n: 1, speed: 30, size: 2, color: K.col, grav: -30, life: 0.3, kind: 'smoke', water: false }); }
    }
    this.drawArms(ctx, t);
  },
});
{ const uc = G.updateChapter; G.updateChapter = function (dt) { uc.call(this, dt); this.updateRealm(dt); }; }
PROJ_DRAW.soul = (ctx, p, bx, by) => { P.disc(ctx, bx, by, 4, C.ink); P.disc(ctx, bx, by, 3, C.g1); P.dot(ctx, bx - 1, by - 1, C.g3, 2); const a = Math.atan2(p.vy, p.vx); for (let i = 1; i < 5; i++) P.dot(ctx, bx - Math.cos(a) * i * 3, by - Math.sin(a) * i * 3, C[i < 3 ? 'g2' : 'd2']); FX.light(p.x, p.y, 70, [110, 255, 220], 0.8); };
PROJ_DRAW.rock = (ctx, p, bx, by) => { const img = SPR.boulder; blitRot(ctx, inkOutline(img, img.width, img.height), bx, by, p.a * 0.2, 4, 4); };
PROJ_DRAW.fireball = (ctx, p, bx, by) => { blit(ctx, SPR.fireball, bx - 3, by - 3); if (Math.random() < 0.7) FX.burst(p.x, p.y, { n: 1, speed: 20, size: 2, color: 'f4', grav: -40, life: 0.3, kind: 'smoke', water: false }); FX.light(p.x, p.y, 90, [255, 150, 60], 0.9); };

/* a slow homing bolt for ghosts and Hel */
function homingShot(G, x, y, dmg, kind = 'soul', speed = 480, turn = 2.2) {
  const cap = G.captain, a = Math.atan2(cap.cy - y, cap.cx - x);
  G.shots.push(new Projectile({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, grav: 0, float: true, dmg, team: 'enemy', kind, life: 3.2,
    tick: (p, dt) => { const want = Math.atan2(cap.cy - p.y, cap.cx - p.x), cur = Math.atan2(p.vy, p.vx), na = cur + clamp(wrapAngle(want - cur), -turn * dt, turn * dt), sp = Math.hypot(p.vx, p.vy); p.vx = Math.cos(na) * sp; p.vy = Math.sin(na) * sp; if (p.life < 2.2) p.float = false; } }));
}

/* ---------------- enemy spells ---------------- */
const capDeck = (G) => { const cap = G.captain; return cap.ship && !cap.air ? { ship: cap.ship, lx: cap.lx } : { ship: G.player, lx: clamp(G.player.toLocal(cap.x, cap.y).x, -G.player.walk, G.player.walk) }; };
Object.assign(SHOTS, {
  firerain: { cd: [3.6, 4.8], wind: 0.9, col: 'f5', fire(G, e) { const d = capDeck(G), n = G.chapter >= 5 ? 3 : 2; for (let i = 0; i < n; i++) G.hazard({ kind: 'fire', ship: d.ship, lx: d.lx + (i ? rand(-100, 100) : 0), t: 1.0 + i * 0.3, dmg: e.stats.dmg * (1 + G.step * 0.04), r: 34 }); Sfx.play('fire', e.pan(), 0.8); FX.burst(e.x, e.y - 90, { n: 12, angle: -HALF_PI, spread: 0.4, speed: 300, size: 2, color: 'f5', color2: 'f3', grav: 0, life: 0.5, water: false }); } },
  soul: { cd: [2.8, 3.6], wind: 0.75, bow: true, col: 'g2', fire(G, e) { homingShot(G, e.x + e.face * 10, e.y - 44, e.stats.dmg * (1 + G.step * 0.04)); Sfx.play('ballista', e.pan(), 0.3); } },
  thunder: { cd: [3.8, 5], wind: 1.0, col: 'b4', fire(G, e) { const d = capDeck(G); G.hazard({ kind: 'bolt', ship: d.ship, lx: d.lx, t: 1.15, dmg: e.stats.dmg * (1 + G.step * 0.04), r: 42 }); Sfx.play('chargeStart', e.pan(), 0.8); FX.burst(e.x, e.y - 90, { n: 10, speed: 200, size: 1, color: 'b4', color2: 'g2', grav: 0, life: 0.3, kind: 'spark', water: false }); } },
  raise: { cd: [5.5, 7], wind: 1.1, col: 'k5', fire(G, e) {
    const c = G.corpses.find((q) => !q.used && G.ships.includes(q.ship) && !q.ship.sunk && q.ship.sinking < 0.05);
    if (!c) return homingShot(G, e.x + e.face * 10, e.y - 60, e.stats.dmg * (1 + G.step * 0.04));
    c.used = true; const d = new Enemy({ type: Math.random() < 0.3 ? 'draugrShield' : 'draugr', hpMul: G.hpMul() * 0.7, value: 3 }); d.raised = true; d.role = 'boarder'; d.land(c.ship, clamp(c.lx, -c.ship.walk, c.ship.walk)); d.stun = 0.9; G.enemies.push(d);
    FX.burst(d.x, d.y - 20, { n: 24, angle: -HALF_PI, spread: 0.6, speed: 240, size: 2, color: 'k5', color2: 'g2', grav: -100, life: 0.8, water: false }); FX.text(d.x, d.y - 80, '亡者复生', '#c49ad8', 18, 1); Sfx.play('grunt', d.pan(), 1); zap(e.x, e.y - 70, d.x, d.y - 30, 0.3);
  } },
});

/* ---------------- flying foes: valkyries ---------------- */
sprite('valk_up', ['w........w.......', 'ww......ww.......', '.wW....wWw.......', '..wW..wWw..hh....', '...wWwWw..hHHh...', '....wWw...hsSh...', '.....bbbbbbbb....', '....bBBBBBBBBs...', '.....bbBBBbb.....', '......bbbbb......', '......b..b.......', '......b...b......'], { w: 'b2', W: 'b4', h: 'm3', H: 'gold', s: 's2', S: 's1', b: 'm2', B: 'm3' });
sprite('valk_dn', ['.................', '...........hh....', '..........hHHh...', '..........hsSh...', '.....bbbbbbbb....', '....bBBBBBBBBs...', '..wWwbbBBBbb.....', '.wWw..bbbbb......', 'wWw...b..b.......', 'Ww.....b..b......', 'w................', '.................'], { w: 'b2', W: 'b4', h: 'm3', H: 'gold', s: 's2', S: 's1', b: 'm2', B: 'm3' });
sprite('valk_spear', ['..W..', '.WmW.', '..m..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..'], { W: 'white', m: 'm4', w: 'w5' });
class Valkyrie {
  constructor(side) {
    const ps = G.player, hp = Math.round(110 * G.hpMul());
    Object.assign(this, { x: ps.x + side * 900, y: -560, vx: -side * 260, vy: 120, hp, max: hp, dead: false, state: 'circle', t: rand(0, 3), cd: rand(1.6, 2.6), face: -side, flash: 0, fall: 0, r: 26, must: true, value: 22, st: 0, lock: null });
    Sfx.play('horn', 0, 0.5); FX.text(this.x, this.y, '女武神！', '#e8dcbc', 18, 1);
  }
  hurt(dmg, dir = 1) {
    if (this.dead) return; this.hp -= dmg * (this.state === 'landed' ? 1.4 : 1); this.flash = 1; this.vx += dir * 220; this.vy -= 80;
    FX.burst(this.x, this.y, { n: 6, speed: 160, size: 1, color: 'b4', color2: 'b2', grav: 300, life: 0.6, water: false });
    if (this.state === 'dive' && dmg > 14) { this.state = 'rise'; this.st = 0; this.lock = null; FX.text(this.x, this.y - 30, '打断', '#ffd46a', 16, 0.6); }
    if (this.hp <= 0) { this.dead = true; G.stats.kills++; G.silver += this.value; Coins.burst(this.x, this.y, this.value, 0.7); Sfx.play('grunt', 0, 1); if (Math.random() < 0.4) { G.parts += 1; UI.partBurst(this.x, this.y, 1); } }
  }
  yank(cap) { this.state = 'stagger'; this.st = 0; this.lock = null; this.vx = Math.sign(cap.x - this.x) * 520; this.vy = 420; }
  update(dt, G) {
    this.t += dt; this.st += dt; this.flash = Math.max(0, this.flash - dt * 6);
    if (this.dead) { this.fall += dt; this.vy += 1200 * dt; this.x += this.vx * dt; this.y += this.vy * dt; return; }
    const cap = G.captain, ps = G.player, steer = (tx, ty, sp, k) => { const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy) || 1, v = Math.min(sp, d * 3); this.vx = damp(this.vx, (dx / d) * v, k, dt); this.vy = damp(this.vy, (dy / d) * v, k, dt); return d; };
    if (this.state === 'circle') { steer(cap.x + Math.sin(this.t * 0.9) * 220, -300 + Math.cos(this.t * 1.7) * 30, 380, 2.2); this.cd -= dt; if (this.cd <= 0 && cap.down <= 0 && G.state === 'fight') { const s = cap.ship && !cap.air ? cap.ship : ps; this.lock = { ship: s, lx: clamp(s === cap.ship ? cap.lx : 0, -s.walk + 10, s.walk - 10) }; this.state = 'aim'; this.st = 0; Sfx.play('chargeStart', 0, 0.6); } }
    else if (this.state === 'aim') { const p = this.lock.ship.toWorld(this.lock.lx, this.lock.ship.deckY(this.lock.lx)); steer(p.x - this.face * 60, p.y - 260, 300, 3); this.face = Math.sign(p.x - this.x) || this.face; if (this.st > 0.75) { this.state = 'dive'; this.st = 0; Sfx.play('swingBig', 0, 1); } }
    else if (this.state === 'dive') {
      const s = this.lock.ship, p = s.toWorld(this.lock.lx, s.deckY(this.lock.lx) - 24), d = steer(p.x, p.y, 1050, 12);
      if (Math.random() < 0.8) FX.burst(this.x, this.y, { n: 1, speed: 20, size: 2, color: 'b3', grav: 0, life: 0.25, kind: 'mist', water: false });
      if (d < 20 || this.st > 1.2) {
        this.state = 'landed'; this.st = 0; this.vx = 0; this.vy = 0; Cam.shake(0.2); FX.splinters(p.x, p.y + 24, 14); Sfx.play('slam', 0, 0.8);
        if (cap.ship === s && !cap.air && Math.abs(cap.lx - this.lock.lx) < 60 && cap.down <= 0 && cap.dodge <= 0) { if (cap.hurt(16 * (1 + G.step * 0.05), Math.sign(cap.lx - this.lock.lx || 1) * 360, -420, { stun: 0.4 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
      }
    } else if (this.state === 'landed') { const s = this.lock.ship; if (s.sunk) { this.state = 'rise'; this.st = 0; } else { const p = s.toWorld(this.lock.lx, s.deckY(this.lock.lx) - 24); this.x = p.x; this.y = p.y; if (this.st > 1.3) { this.state = 'rise'; this.st = 0; this.vy = -500; } } }
    else if (this.state === 'rise' || this.state === 'stagger') { this.vy += (this.state === 'stagger' ? 900 : -200) * dt; if (this.state === 'stagger' && this.y > -40) this.vy = Math.min(this.vy, -300); if (this.st > (this.state === 'stagger' ? 1.1 : 0.6)) { this.state = 'circle'; this.cd = rand(2.2, 3.4); } }
    if (this.state !== 'landed') { this.x += this.vx * dt; this.y += this.vy * dt; if (Math.abs(this.vx) > 40 && this.state !== 'dive') this.face = Math.sign(this.vx); }
  }
  draw(ctx, t = G.t) {
    const bx = Cam.bx(this.x), by = Cam.by(this.y), flip = this.face < 0, flap = this.state === 'landed' || this.state === 'dive' || this.dead ? 'valk_dn' : Math.floor(t * 8) % 2 ? 'valk_up' : 'valk_dn';
    const img = SPR[flap], o = inkOutline(img, img.width, img.height, this.flash > 0.5 ? C.white : C.ink);
    if (this.dead) { blitRot(ctx, o, bx, by, this.fall * 6, 8, 6, flip); return; }
    blit(ctx, o, bx, by, flip, 8, 6);
    const sa = this.state === 'dive' || this.state === 'aim' ? Math.atan2(this.lock ? 1 : 0.2, this.face * 0.6) - HALF_PI : this.face * 0.4;
    blitRot(ctx, SPR.valk_spear, bx + (flip ? -5 : 5), by + 2, flip ? -sa : sa, 2, 3);
    if (this.state === 'aim' && this.lock) { const s = this.lock.ship, p = s.toWorld(this.lock.lx, s.deckY(this.lock.lx)), px = Cam.bx(p.x), py = Cam.by(p.y), r = 7 + Math.floor(t * 12) % 4; P.ring(ctx, px, py - 2, r, C.r4); if (Math.floor(t * 10) % 2) P.line(ctx, bx, by, px, py - 2, C.r3, 1); }
    if (this.hp < this.max) { P.rect(ctx, bx - 9, by - 12, 18, 3, C.ink); P.rect(ctx, bx - 8, by - 11, Math.round(16 * this.hp / this.max), 1, C.r4); }
  }
}
const FLYERS = { valkyrie: Valkyrie };
G.spawnFlyer = function (k, side) { this.hawks.push(new FLYERS[k](side)); };

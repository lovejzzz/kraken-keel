'use strict';
/* Tentacles (slam, sweep, grip) and the kraken boss. */
class Tentacle {
  constructor(o) {
    Object.assign(this, { ship: null, lx: 0, mode: 'slam', state: 'warn', t: 0, hp: 70, max: 70, layer: 'front', dead: false, gone: false, pts: [], thick: 36, seed: rand(0, 99), flash: 0, hitDone: false, dur: {} }, o);
    this.max = this.hp; this.out = this.lx >= 0 ? 1 : -1;
    if (this.mode === 'grip') { this.lx = this.out * (this.ship.L - 20); }
    if (this.mode === 'sweep') { this.lx = this.out * this.ship.walk; }
    Sfx.play('tentacleWarn', 0, 0.8);
  }
  base() { const s = this.ship, off = this.mode === 'grip' ? this.out * 70 : this.mode === 'sweep' ? this.out * 110 : this.out * 40; const p = s.toWorld(this.lx + off, 0); return { x: p.x, y: Sea.height(p.x) + 70 }; }
  deckPt(lx, lift = 0) { const s = this.ship; return s.toWorld(lx, s.deckY(clamp(lx, -s.walk, s.walk)) - lift); }
  update(dt, G) {
    this.t += dt; this.flash = Math.max(0, this.flash - dt * 5);
    const s = this.ship, B = this.base();
    let tip, ctrl, k;
    const up = { x: B.x - this.out * 40, y: s.y - 270 };
    if (this.state === 'warn') {
      if (Math.random() < dt * 30) FX.burst(B.x + rand(-40, 40), Sea.height(B.x) - 2, { n: 1, speed: 60, size: rand(2, 5), color: 'foam', grav: -60, life: 0.5, water: false });
      if (Math.random() < dt * 10) Sea.splash(B.x + rand(-30, 30), 30, 16);
      if (this.t > (this.mode === 'sweep' ? 0.9 : 1.2)) { this.state = 'rise'; this.t = 0; FX.splash(B.x, 1.4); Sfx.play('tentacle', 0, 1); }
      tip = { x: B.x, y: B.y + 40 }; ctrl = tip;
    } else if (this.state === 'rise') {
      k = smooth(clamp(this.t / 0.55, 0, 1)); tip = { x: lerp(B.x, up.x, k), y: lerp(B.y, up.y, k) }; ctrl = { x: B.x, y: lerp(B.y, up.y + 120, k) };
      if (this.t > 0.55) { this.state = this.mode === 'grip' ? 'wrap' : this.mode === 'sweep' ? 'sweep' : 'aim'; this.t = 0; }
    } else if (this.state === 'aim') {
      const sw = Math.sin(this.t * 6 + this.seed) * 14; tip = { x: up.x + sw, y: up.y - Math.sin(this.t * 4) * 12 }; ctrl = { x: B.x - this.out * 20, y: up.y + 150 };
      if (this.t > 0.45) { this.state = 'slam'; this.t = 0; }
    } else if (this.state === 'slam') {
      k = clamp(this.t / 0.11, 0, 1); const D = this.deckPt(this.lx - this.out * 150, 8);
      tip = { x: lerp(up.x, D.x, k * k), y: lerp(up.y, D.y, k * k) }; ctrl = { x: lerp(B.x, this.deckPt(this.lx).x, k), y: lerp(up.y + 150, this.deckPt(this.lx, 30).y, k) };
      if (k >= 1 && !this.hitDone) { this.hitDone = true; G.tentacleSlam(this); }
      if (this.t > 0.12) { this.state = 'lie'; this.t = 0; }
    } else if (this.state === 'lie') {
      const D = this.deckPt(this.lx - this.out * 150, 8 + Math.sin(this.t * 4) * 3), mid = this.deckPt(this.lx + this.out * 20, 60);
      tip = D; ctrl = { x: mid.x, y: mid.y - 50 };
      if (this.t > (G.kraken ? 2.2 : 3.0)) { this.state = 'retreat'; this.t = 0; }
    } else if (this.state === 'sweep') {
      // a low sweep along the deck from one end to the other: jump it
      k = clamp(this.t / 1.25, 0, 1); const lxTip = lerp(this.out * this.ship.walk, -this.out * this.ship.walk * 0.9, smooth(k));
      tip = this.deckPt(lxTip, 22); ctrl = this.deckPt((this.out * this.ship.walk + lxTip) / 2, 60);
      this.sweepLx = lxTip;
      if (k > 0.05 && k < 0.98) G.tentacleSweep(this, lxTip);
      if (k >= 1) { this.state = 'retreat'; this.t = 0; }
    } else if (this.state === 'wrap') {
      // grip the hull end and pull the ship over
      const D = this.ship.toWorld(this.lx - this.out * 40, this.ship.deckBase - 10 + Math.sin(this.t * 3) * 4);
      tip = D; ctrl = { x: B.x + this.out * 30, y: this.ship.y - 150 };
      s.bias = damp(s.bias, this.out * 0.28, 1.2, dt); s.grip = 1;
      if (Math.random() < dt * 2) { s.damage(3, this.lx); }
    } else if (this.state === 'retreat') {
      k = smooth(clamp(this.t / 0.6, 0, 1)); const from = this.last || up; tip = { x: lerp(from.x, B.x, k), y: lerp(from.y, B.y + 60, k) }; ctrl = { x: lerp(B.x, B.x, k), y: lerp(from.y + 60, B.y, k) };
      if (this.t > 0.6) this.gone = true;
    }
    if (this.state !== 'retreat') this.last = tip;
    this.buildPts(B, ctrl, tip);
    if (this.hp <= 0 && !this.dead) {
      this.dead = true; this.state = 'retreat'; this.t = 0; G.onTentacleCut(this);
      const p = this.pts[(this.pts.length * 0.7) | 0] || tip; FX.burst(p.x, p.y, { n: 40, speed: 420, size: 8, color: 'k1', grav: 300, life: 1.2, kind: 'ink', drag: 2 });
    }
  }
  buildPts(B, C, T) {
    const n = 22; this.pts.length = 0;
    for (let i = 0; i <= n; i++) {
      const u = i / n, x = (1 - u) * (1 - u) * B.x + 2 * (1 - u) * u * C.x + u * u * T.x, y = (1 - u) * (1 - u) * B.y + 2 * (1 - u) * u * C.y + u * u * T.y;
      const w = Math.sin(u * 7 + Sea.t * 4 + this.seed) * 6 * u * (this.state === 'aim' || this.state === 'lie' ? 1 : 0.4);
      this.pts.push({ x: x + w, y: y + w * 0.4, i });
    }
  }
  hittable() { return ['aim', 'lie', 'wrap', 'sweep', 'rise'].includes(this.state) && !this.dead; }
  canHook() { return this.hittable(); }
  hitPoint(x, y, r) {
    if (!this.hittable()) return null; let best = null, bd = r;
    for (let i = 4; i < this.pts.length; i++) { const p = this.pts[i], d = Math.hypot(p.x - x, p.y - y) - this.thick * (1 - i / this.pts.length) * 0.6; if (d < bd) { bd = d; best = p; } }
    return best;
  }
  anchorFor(i) { const tn = this; return { anchor: () => (tn.gone || tn.dead ? null : tn.pts[Math.min(i, tn.pts.length - 1)]), anchorVel: () => ({ x: tn.ship.vx, y: tn.ship.vy }) }; }
  damage(d, G) { if (this.dead) return; this.hp -= d; this.flash = 1; if (G.kraken) G.kraken.chip(d * 0.15, G); FX.text(this.pts[this.pts.length - 4]?.x ?? 0, (this.pts[this.pts.length - 4]?.y ?? 0) - 30, `${Math.round(d)}`, '#d8b0ff', 18, 0.6); }
  draw(ctx, t) {
    const pts = this.pts; if (this.state === 'warn') return this.drawWarn(ctx, t);
    if (pts.length < 2) return;
    // densify in buffer space
    const bp = pts.map((p) => [Cam.bx(p.x), Cam.by(p.y)]), n = bp.length, samples = [];
    for (let i = 0; i < n - 1; i++) {
      const [x0, y0] = bp[i], [x1, y1] = bp[i + 1], d = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 1.5));
      for (let k = 0; k < d; k++) { const u = k / d; samples.push([x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, (i + u) / (n - 1)]); }
    }
    const R = (u) => Math.max(1.5, this.thick * S * (1 - u * 0.85) * (this.mode === 'grip' ? 1.1 : 1));
    const fl = this.flash > 0.3;
    for (const [x, y, u] of samples) P.disc(ctx, x, y, R(u) + 1, C.k0);
    for (const [x, y, u] of samples) P.disc(ctx, x, y, R(u), C[fl ? 'k6' : 'k3']);
    for (let i = 0; i < samples.length; i++) {
      const [x, y, u] = samples[i], q = samples[Math.min(i + 2, samples.length - 1)], dx = q[0] - x, dy = q[1] - y, d = Math.hypot(dx, dy) || 1, nx = dy / d, ny = -dx / d, r = R(u);
      // top highlight band and a thin rim
      P.disc(ctx, x + nx * r * 0.45, y + ny * r * 0.45, Math.max(1, r * 0.4), C[fl ? 'white' : 'k4']);
      if (i % 3 === 0) P.dot(ctx, x + nx * r * 0.7, y + ny * r * 0.7, C[fl ? 'white' : 'k5']);
      // suckers on the underside
      if (i % 5 === 0 && r > 2.5) { const sx = x - nx * r * 0.55, sy = y - ny * r * 0.55, sr = Math.max(1, Math.round(r * 0.33)); P.disc(ctx, sx, sy, sr, C.k6); P.dot(ctx, sx, sy, C.k2, sr > 1 ? 2 : 1); }
      if (u < 0.25 && i % 7 === 0) { P.dot(ctx, x + nx * r * 0.2, y + ny * r * 0.2, C.b1, 2); }
    }
    if (this.hittable() && this.hp < this.max) {
      const p = samples[(samples.length * 0.55) | 0], w = 22, x = Math.round(p[0] - w / 2), y = Math.round(p[1] - R(0.55) - 8);
      P.rect(ctx, x - 1, y - 1, w + 2, 4, C.ink); P.rect(ctx, x, y, Math.round(w * clamp(this.hp / this.max, 0, 1)), 2, C.k5);
    }
  }
  drawWarn(ctx, t) {
    if (this.mode === 'grip') return;
    const s = this.ship, lx = this.mode === 'sweep' ? 0 : this.lx - this.out * 40, w = this.mode === 'sweep' ? s.walk : 100;
    if (Math.floor(t * 10) % 2) return;
    for (let k = -w; k <= w; k += 26) {
      const p = s.toWorld(lx + k, s.deckY(lx + k) - 14), bx = Cam.bx(p.x), by = Cam.by(p.y);
      ctx.fillStyle = C.r4; ctx.fillRect(bx - 3, by - 3, 7, 1); ctx.fillRect(bx - 2, by - 2, 5, 1); ctx.fillRect(bx - 1, by - 1, 3, 1); ctx.fillRect(bx, by, 1, 1);
    }
    const B = this.base(), bx = Cam.bx(B.x), by = Cam.by(Sea.height(B.x));
    ctx.fillStyle = C.r4; ctx.fillRect(bx - 1, by - 22, 3, 9); ctx.fillRect(bx - 1, by - 11, 3, 3);
  }
}

class Kraken {
  constructor(G) {
    this.max = 1500; this.hp = this.max; this.phase = 1; this.rise = 0; this.eye = 0; this.eyeT = 6; this.attackT = 3; this.t = 0; this.dying = 0; this.dead = false;
    this.x = G.player.x + 60; this.gripDone = false; this.ink = 0; this.hooked = null; this.blink = 0; this.flash = 0; this.spawnT = 12; this.roarT = 0;
    Sfx.play('roar', 0, 1); Cam.shake(0.4);
  }
  get eyePos() { return { x: this.x + Math.sin(this.t * 0.5) * 30, y: lerp(260, -300, smooth(this.rise)) + Math.sin(this.t * 0.8) * 10 }; }
  eyeHit(x, y, r) { if (this.dying || this.eye < 0.6) return false; const e = this.eyePos; return Math.hypot(x - e.x, y - e.y) < r + 42; }
  chip(d, G) { if (this.dying) return; this.hp -= d; this.checkPhase(G); }
  hitEye(d, G, src) {
    if (this.dying) return; const mul = this.hooked ? 1.6 : 1; this.hp -= d * mul; this.flash = 1;
    const e = this.eyePos; FX.burst(e.x, e.y, { n: 18, speed: 380, size: 4, color: 'g2', life: 0.7, add: true, grav: 400 });
    FX.text(e.x, e.y - 70, `${Math.round(d * mul)}`, '#8ff0ff', 30, 0.9); Cam.shake(0.12); FX.stop(0.06); Sfx.play('heavy', 0, 1);
    if (Math.random() < 0.3) Sfx.play('roar', 0, 0.5);
    this.checkPhase(G);
  }
  meleeHit(hx, hy, reach, dmg, G) { if (this.eyeHit(hx, hy, reach * 0.6)) { this.hitEye(dmg * 1.4, G); return true; } return false; }
  hookEye(cap, G) {
    const K = this; this.hooked = 2.5;
    cap.attachRope({ anchor: () => (K.dying ? null : K.eyePos), anchorVel: () => ({ x: 0, y: 0 }) }, G);
    cap.onRope.len = Math.max(80, cap.onRope.len * 0.6); cap.onRope.reel = true;
    FX.text(cap.x, cap.y - 100, '勾住了眼睛！', '#8ff0ff', 24, 1); Sfx.play('eye', 0, 1);
  }
  checkPhase(G) {
    const f = this.hp / this.max;
    if (this.phase === 1 && f < 0.66) { this.phase = 2; Sky.surge(G); G.banner('海妖暴怒', '它缠住了船体，砍断触手让船回正', '#c890ff'); Sfx.play('roar', 0, 1); this.attackT = 1; this.gripDone = false; }
    if (this.phase === 2 && f < 0.33) { this.phase = 3; Sky.surge(G); G.banner('墨潮', '一片漆黑，只有火盆和它的眼睛在发光', '#8ff0ff'); Sfx.play('roar', 0, 1); this.ink = 1; }
    if (this.hp <= 0 && !this.dying) { this.dying = 0.001; G.krakenDies(this); }
  }
  update(dt, G) {
    this.t += dt; this.flash = Math.max(0, this.flash - dt * 4); this.x = damp(this.x, G.player.x + 90, 0.5, dt);
    if (this.dying) { this.dying += dt; this.rise = Math.max(0, 1 - this.dying / 3.5); this.eye = Math.max(0, this.eye - dt * 0.3); return; }
    this.rise = Math.min(1, this.rise + dt * 0.25);
    if (this.hooked) { this.hooked -= dt; if (this.hooked <= 0 || this.eye < 0.5) this.hooked = null; }
    const cap = G.captain; if (cap.onRope && cap.onRope.reel) { cap.onRope.len = Math.max(70, cap.onRope.len - 380 * dt); if (!this.hooked || this.eye < 0.5) cap.onRope = null; }
    // eye cycle
    this.eyeT -= dt;
    const openDur = this.phase === 3 ? 4.5 : 3.6;
    if (this.eyeT <= 0) { if (this.eye < 0.5) { this.eyeOpen = true; this.eyeT = openDur; Sfx.play('eye', 0, 1); FX.text(this.eyePos.x, this.eyePos.y - 120, '眼睛睁开了', '#8ff0ff', 24, 1.2); } else { this.eyeOpen = false; this.eyeT = this.phase === 1 ? 7 : 5.5; } }
    this.eye = damp(this.eye, this.eyeOpen ? 1 : 0, 6, dt);
    // attacks
    this.attackT -= dt;
    const living = G.tentacles.filter((t) => !t.dead && t.state !== 'retreat');
    if (this.attackT <= 0 && this.rise > 0.6) {
      const r = Math.random(), ps = G.player;
      if (this.phase >= 2 && !this.gripDone && !living.some((t) => t.mode === 'grip')) {
        this.gripDone = true; G.tentacles.push(new Tentacle({ ship: ps, lx: 1, mode: 'grip', hp: 80, layer: 'front' }), new Tentacle({ ship: ps, lx: -1, mode: 'grip', hp: 80, layer: 'back' }));
        G.banner('它抓住了船！', '砍断缠住船首和船尾的触手', '#c890ff', 1.8); this.attackT = 4;
      } else if (this.phase >= 2 && r < 0.35) {
        G.tentacles.push(new Tentacle({ ship: ps, lx: pick([-1, 1]), mode: 'sweep', hp: 60, layer: 'front' })); this.attackT = this.phase === 3 ? 3 : 4;
      } else {
        const n = this.phase === 1 ? 1 : 2;
        for (let i = 0; i < n; i++) G.spawnSlam(i * 0.35);
        this.attackT = this.phase === 1 ? 4.2 : this.phase === 2 ? 3.6 : 3.0;
      }
    }
    if (!living.some((t) => t.mode === 'grip')) G.player.grip = 0;
    // drowned boarders climb out of the sea now and then
    this.spawnT -= dt;
    if (this.spawnT <= 0 && G.enemies.filter((e) => !e.dead).length < 3 + this.phase) { this.spawnT = this.phase === 1 ? 14 : 10; G.climbers(this.phase === 3 ? 3 : 2); }
    if (this.ink) { this.ink = Math.min(1, this.ink); }
  }
  /* big head behind the ship: pre-rendered pixel mantle, per-frame eye */
  static head() {
    if (Kraken._head) return Kraken._head;
    const W = 330, H = 250, c = offscreen(W, H), g = c.getContext('2d'), cx = W / 2;
    const topAt = (x) => { const u = (x - cx) / (W / 2); return Math.abs(u) > 1 ? 1e9 : H * 0.04 + Math.pow(Math.abs(u), 1.9) * H * 0.62 + (u > 0 ? u * 14 : 0) + (fbm1(x * 0.05, 3) - 0.5) * 10; };
    for (let x = 0; x < W; x++) {
      const top = Math.round(topAt(x)); if (top > H) continue;
      for (let y = top; y < H; y++) {
        const lx = (x - cx + 60) / W, ly = (y - 30) / H, lit = clamp(1 - Math.hypot(lx, ly) * 1.7, 0, 1) + (fbm2(x * 0.035, y * 0.035, 4) - 0.5) * 0.45;
        const th = BAYER[(y & 3) * 4 + (x & 3)] / 18 + 0.5, v = lit + (th - 0.5) * 0.35;
        let col = v > 0.74 ? 'k5' : v > 0.52 ? 'k4' : v > 0.3 ? 'k3' : v > 0.12 ? 'k2' : 'k1';
        if (y - top < 1) col = 'k6'; else if (y - top < 3) col = 'k5';
        if (fbm2(x * 0.09 + 9, y * 0.09, 3) > 0.7 && y > top + 8) col = hash2(x, y) > 0.55 ? 'b1' : 'k2';
        g.fillStyle = C[col]; g.fillRect(x, y, 1, 1);
      }
      g.fillStyle = C.k0; g.fillRect(x, top - 1, 1, 1);
    }
    // ridges running up the mantle
    for (let i = 0; i < 6; i++) for (let k = 0; k < 80; k++) { const x = Math.round(cx - 110 + i * 44 + Math.sin(k / 80 * 3 + i) * 8 - k * 0.3), y = H - k * 2; if (y > topAt(x) + 6) { g.fillStyle = C[k % 9 < 5 ? 'k4' : 'k2']; g.fillRect(x, y, 1, 2); } }
    Kraken._head = c; return c;
  }
  draw(ctx, t) {
    const e = this.eyePos, r = smooth(this.rise); if (r <= 0.01) return;
    const hd = Kraken.head(), ex = Cam.bx(e.x), ey = Cam.by(e.y), hx = ex - 150, hy = ey - 50;
    ctx.drawImage(hd, hx, hy);
    if (this.flash > 0.3) { ctx.globalAlpha = 0.5; ctx.drawImage(silhouette(hd, C.k6), hx, hy); ctx.globalAlpha = 1; }
    // socket, eye, lids
    P.disc(ctx, ex, ey, 26, C.k0); P.disc(ctx, ex, ey, 24, C.ink);
    const o = this.eye;
    if (o > 0.05) {
      const hh = Math.round(18 * o), look = Math.round(clamp((Cam.x - e.x) * 0.03, -8, 8));
      for (let y = -hh; y <= hh; y++) {
        const w = Math.round(Math.sqrt(Math.max(0, 1 - (y / Math.max(hh, 1)) ** 2)) * 22);
        for (let x = -w; x <= w; x++) {
          const d = Math.hypot(x - look * 0.4, y * 1.3) / 22, th = BAYER[((y + 64) & 3) * 4 + ((x + 64) & 3)] / 18 + 0.5;
          const v = d + (th - 0.5) * 0.18; const col = v < 0.2 ? 'g3' : v < 0.45 ? 'g2' : v < 0.75 ? 'g1' : 't4';
          ctx.fillStyle = C[col]; ctx.fillRect(ex + x, ey + y, 1, 1);
        }
      }
      ctx.fillStyle = C.ink; ctx.fillRect(ex + look - 1, ey - hh + 1, 3, hh * 2 - 1); ctx.fillRect(ex + look, ey - hh, 1, hh * 2 + 1);
      P.dot(ctx, ex - 8, ey - 6, C.white, 2);
    }
    ctx.fillStyle = C.k2; ctx.fillRect(ex - 24, ey - Math.round(18 * Math.max(o, 0.06)) - 2, 48, 2); ctx.fillRect(ex - 24, ey + Math.round(18 * Math.max(o, 0.06)) + 1, 48, 2);
  }
  glow(G) { if (this.eye > 0.1 && !this.dead) { const e = this.eyePos; FX.light(e.x, e.y, 420 * this.eye, [90, 255, 240], 1.1 * this.eye); } }
}

'use strict';
/* 霜龙 — the frost wyrm, chapter 2's boss. A serpent body rises out of the sea; the head breathes frost over half the deck,
   bites where the captain stands (and gets stuck — the moment to hit it), rains icicles, dives under the ship to the other side,
   and in its last third coils around the longship: break the three glowing scales or the hull is crushed. */

/* the head, facing left, painted once: skull, horns, crest, eye; and a separate lower jaw hinged at the back */
const WYRM = (() => {
  const W = 84, H = 50, head = offscreen(W, H), g = head.getContext('2d'), jaw = offscreen(W, H), j = jaw.getContext('2d');
  const poly = (ctx, pts, col) => { ctx.fillStyle = C[col]; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]); ctx.closePath(); ctx.fill(); };
  // skull
  poly(g, [[2, 25], [8, 17], [26, 12], [44, 8], [60, 8], [74, 14], [80, 24], [74, 32], [58, 30], [22, 29], [4, 30]], 'n5');
  poly(g, [[6, 20], [26, 14], [44, 10], [60, 10], [72, 15], [60, 16], [40, 17], [20, 20]], 'n7');
  poly(g, [[4, 28], [22, 27], [58, 28], [74, 31], [58, 31], [22, 30]], 'n4');
  // horns sweeping back (over the skull)
  poly(g, [[56, 12], [70, 2], [83, 0], [74, 6], [62, 16]], 'b2'); poly(g, [[60, 12], [72, 4], [80, 2], [70, 8]], 'b4');
  poly(g, [[48, 12], [56, 3], [64, 1], [58, 7], [52, 15]], 'b2');
  // crest spikes
  for (let i = 0; i < 6; i++) { const x = 34 + i * 7; poly(g, [[x, 10], [x + 4, 2 - (i % 2) * 2], [x + 6, 9]], i % 2 ? 'b3' : 'b4'); }
  // scale dither
  for (let y = 12; y < 29; y++) for (let x = 10; x < 74; x++) if (((x + y * 3) % 7 === 0) && g.getImageData(x, y, 1, 1).data[3] > 0) { g.fillStyle = C.n4; g.fillRect(x, y, 1, 1); }
  // brow, eye socket, nostril, upper teeth
  poly(g, [[36, 13], [52, 11], [54, 15], [38, 16]], 'n3');
  g.fillStyle = C.ink; g.fillRect(8, 19, 3, 2); g.fillStyle = C.n2; g.fillRect(41, 15, 9, 5); g.fillStyle = C.g1; g.fillRect(44, 16, 5, 3);
  g.fillStyle = C.b4; for (let x = 6; x < 50; x += 5) { g.fillRect(x, 29, 2, 3); g.fillRect(x + 1, 32, 1, 1); }
  // lower jaw: hinge near (62, 30)
  poly(j, [[6, 30], [28, 31], [60, 30], [68, 34], [46, 41], [16, 37]], 'n5'); poly(j, [[10, 35], [44, 38], [64, 34], [46, 40], [16, 38]], 'n4');
  j.fillStyle = C.b4; for (let x = 9; x < 52; x += 5) { j.fillRect(x, 28, 2, 3); j.fillRect(x + 1, 27, 1, 1); }
  return { head, jaw, W, H, eye: [45, 17], hinge: [62, 31], mouth: [8, 31] };
})();
sprite('scale_glow', ['..ggg..', '.gGGGg.', 'gGWWGGg', 'gGWGGGg', 'gGGGGGg', '.gGGGg.', '..ggg..'], { g: 'n6', G: 'g1', W: 'g3' });

/* the frost wyrm's colours and words; the world serpent brings its own */
const WPAL = { body: 'n5', lit: 'n6', belly: 'b1', spike: 'b4', fleck: 'n8', flash: 'b4', shard: ['b4', 'n7'] };
const WTXT = { rage: ['霜龙暴怒', '冰锥从天而降，它会潜到船的另一边'], coil: ['血色极光', '霜龙缠住了整条船'], fall: ['霜龙坠海', '冰海安静了'], stun: '霜龙被震晕了！', adds: ['witch', 'powder'] };
class Wyrm {
  constructor(G) {
    const ps = G.player;
    Object.assign(this, { name: '霜龙', icon: 'n_wyrm', col: '#bfe8ff', intro: '等它扑咬、龙头卡在甲板上时，砸它的头', sc: 1, art: WYRM, pal: WPAL, txt: WTXT, glowC: [140, 200, 255], max: 2600, hp: 2600, phase: 1, t: 0, state: 'emerge', st: 0, side: 1, hx: ps.x + 360, hy: 240, ha: 0, jaw: 0, flash: 0, dying: 0, nextAtk: 3, atkN: 0, coil: 0, scales: [], marks: [], breath: null, zone: null, bite: null, coilT: 0, hitCd: 0, dead: false });
    Sfx.play('roar', 0, 1); Cam.shake(0.4); Sky.auroraK = 1;
  }
  get exposed() { return this.state === 'stuck' || this.state === 'stunned'; }
  hover(G) { const ps = G.player; return { x: ps.x + this.side * 360, y: -300 + Math.sin(this.t * 1.1) * 16 }; }
  deckPoint(G, lx, dy = 0) { const ps = G.player; return ps.toWorld(lx, ps.deckY(lx) + dy); }
  mouthPos() { const A = this.art, flip = this.side < 0, a = this.ha * (flip ? -1 : 1), mx = (A.mouth[0] - A.W / 2) * this.sc, my = (A.mouth[1] - A.H / 2) * this.sc; let x = mx * Math.cos(a) - my * Math.sin(a); const y = mx * Math.sin(a) + my * Math.cos(a); if (flip) x = -x; return { x: this.hx + x / S, y: this.hy + y / S }; }
  go(state) { this.state = state; this.st = 0; }
  update(dt, G) {
    this.t += dt; this.st += dt; this.flash = Math.max(0, this.flash - dt * 5); this.hitCd -= dt;
    const ps = G.player, cap = G.captain, H = this.hover(G), spd = this.phase === 3 ? 1.45 : this.phase === 2 ? 1.2 : 1;
    const moveTo = (x, y, k) => { this.hx = damp(this.hx, x, k, dt); this.hy = damp(this.hy, y, k, dt); };
    if (this.dying) { this.dying += dt; this.hy += 160 * dt; this.ha = damp(this.ha, 0.8 * -this.side, 2, dt); this.jaw = 0.7; if (Math.random() < 0.7) this.shatter(); if (this.dying > 2.6 && !this.dead) { this.dead = true; G.bossGone(this); } return; }
    // marks: icicles on a timer
    for (const m of this.marks) {
      m.t -= dt;
      if (m.t <= 0 && !m.hit) {
        m.hit = true; const p = this.deckPoint(G, m.lx); FX.burst(p.x, p.y - 4, { n: 16, speed: 260, size: 2, color: 'b4', color2: 'n8', grav: 800, life: 0.5 }); Sfx.play('clang', 0, 0.5); Cam.shake(0.06); G.iceAt(m.lx, 26, 6);
        if (cap.ship === ps && !cap.air && Math.abs(cap.lx - m.lx) < 30 && cap.down <= 0) { if (cap.hurt(12 * (1 + G.step * 0.04), Math.sign(cap.lx - m.lx || 1) * 200, -300)) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
        for (const e of G.enemies) if (!e.dead && e.ship === ps && Math.abs(e.lx - m.lx) < 30) { e.hurt(16, 0, -300, { stun: 0.6 }); if (e.hp <= 0) G.kill(e, cap); }
      }
    }
    this.marks = this.marks.filter((m) => m.t > -0.3);
    // the coil crushes the hull until its three glowing scales are broken
    this.coil = damp(this.coil, this.state === 'coil_in' || this.scales.some((s) => s.hp > 0) ? 1 : 0, 2.5, dt);
    if (this.scales.some((s) => s.hp > 0)) { this.coilT += dt; ps.hull -= 4.5 * dt; ps.va += Math.sin(this.t * 9) * 0.02 * dt; if (Math.random() < dt * 3) { Sfx.play('crack', 0, 0.3); const p = this.deckPoint(G, rand(-ps.walk, ps.walk), 20); FX.splinters(p.x, p.y, 3); } }
    switch (this.state) {
      case 'emerge': moveTo(H.x, H.y, 1.6); this.jaw = this.st > 0.6 && this.st < 1.6 ? 1 : 0; if (this.st > 0.6 && this.st < 0.65) { Sfx.play('roar', 0, 1); Cam.shake(0.3); } if (this.st > 2.4) this.go('hover'); break;
      case 'hover': {
        moveTo(H.x, H.y, 2.5); this.ha = damp(this.ha, 0, 3, dt); this.jaw = damp(this.jaw, 0, 6, dt); this.nextAtk -= dt * spd;
        if (this.nextAtk <= 0) this.pick(G);
        break;
      }
      case 'breath_tell': {
        moveTo(H.x - this.side * 40, H.y + 40, 2.5); this.ha = damp(this.ha, 0.45 * -this.side, 4, dt); this.jaw = Math.min(1, this.st / 0.9);
        const m = this.mouthPos(); if (Math.random() < 0.8) FX.burst(m.x + rand(-40, 40), m.y + rand(-40, 40), { n: 1, angle: Math.atan2(rand(-1, 1), rand(-1, 1)), spread: 0, speed: 0, size: 2, color: 'n8', color2: 'b4', grav: 0, life: 0.3, water: false });
        FX.light(m.x, m.y, 120, [160, 220, 255], 0.9);
        if (this.st > 1.1 / spd) { this.go('breath'); this.breath = { hit: new Set() }; Sfx.play('wave', 0, 1); Sfx.play('roar', 0, 0.5); }
        break;
      }
      case 'breath': {
        const z = this.zone, m = this.mouthPos();
        for (let i = 0; i < 5; i++) { const lx = rand(z.a, z.b), p = this.deckPoint(G, lx, -rand(0, 40)), a = Math.atan2(p.y - m.y, p.x - m.x); FX.burst(m.x, m.y, { n: 1, angle: a, spread: 0.08, speed: Math.hypot(p.x - m.x, p.y - m.y) * 2.4, size: 3, color: 'b4', color2: 'n8', grav: 0, life: 0.42, kind: 'mist', water: false }); }
        FX.light(m.x, m.y, 200, [170, 230, 255], 1.2);
        if (this.st > 0.25) {
          if (!this.breath.hit.has(cap) && cap.ship === ps && !cap.air && cap.lx > z.a && cap.lx < z.b && cap.down <= 0) { this.breath.hit.add(cap); if (cap.hurt(16 * (1 + G.step * 0.04), 0, -100, { stun: 0.2 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } G.freeze(cap, 1.0); }
          for (const e of G.enemies) if (!e.dead && !this.breath.hit.has(e) && e.ship === ps && e.lx > z.a && e.lx < z.b) { this.breath.hit.add(e); e.hurt(20, 0, -100, { stun: 1.2 }); if (e.hp <= 0) G.kill(e, cap); }
        }
        if (this.st > 1.0) { for (let k = 0; k < 3; k++) G.iceAt(lerp(z.a, z.b, (k + 0.5) / 3), (z.b - z.a) / 6 + 6, 8); this.zone = null; this.nextAtk = 2.4; this.go('hover'); }
        break;
      }
      case 'bite_tell': { const b = this.bite, p = this.deckPoint(G, b.lx, -30); moveTo(p.x + this.side * 190, p.y - 200, 3); this.ha = damp(this.ha, 0.3 * -this.side, 4, dt); this.jaw = Math.min(1, this.st * 2); if (this.st > 0.85 / spd) { this.go('bite'); Sfx.play('swingBig', 0, 1); } break; }
      case 'bite': {
        const b = this.bite, p = this.deckPoint(G, b.lx, -34), k = Math.min(1, this.st / 0.2); this.hx = lerp(this.hx, p.x + this.side * 36 * this.sc, k); this.hy = lerp(this.hy, p.y, k); this.ha = 0.6 * -this.side; this.jaw = 1 - k;
        if (k >= 1) {
          Cam.shake(0.4); Cam.kick(0.03); FX.splinters(p.x, p.y + 20, 22); Sfx.play('slam', 0, 1); Sfx.play('crack', 0, 0.8); ps.damage(22, b.lx);
          if (cap.ship === ps && !cap.air && Math.abs(cap.lx - b.lx) < 60 && cap.down <= 0) { if (cap.hurt(28 * (1 + G.step * 0.04), Math.sign(cap.lx - b.lx || 1) * 520, -520, { stun: 0.5 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
          for (const e of G.enemies) if (!e.dead && e.ship === ps && Math.abs(e.lx - b.lx) < 60) { e.hurt(30, Math.sign(e.lx - b.lx || 1) * 500, -500, { stun: 0.6 }); if (e.hp <= 0) G.kill(e, cap); }
          this.go('stuck'); FX.text(p.x, p.y - 120, '龙头卡住了！快打！', '#bfe8ff', 20, 1.4);
        }
        break;
      }
      case 'stuck': case 'stunned': {
        const dur = this.state === 'stunned' ? 4.5 : 2.8, b = this.bite || { lx: 0 }, p = this.deckPoint(G, b.lx, -34);
        this.hx = p.x + this.side * 36 * this.sc + Math.sin(this.t * 30) * (this.st < 0.3 ? 3 : 0.5); this.hy = p.y; this.ha = 0.6 * -this.side; this.jaw = 0.15 + Math.sin(this.t * 3) * 0.05;
        if (this.st > dur) { this.go('rise'); this.bite = null; Sfx.play('roar', 0, 0.6); }
        break;
      }
      case 'rise': moveTo(H.x, H.y, 3); this.ha = damp(this.ha, 0, 4, dt); if (this.st > 0.8) { this.nextAtk = 1.6; this.go('hover'); } break;
      case 'shards': moveTo(H.x, H.y - 30, 2); this.jaw = this.st < 1.4 ? 1 : 0; this.ha = damp(this.ha, -0.3 * -this.side, 3, dt); if (this.st > 1.6) { this.nextAtk = 2; this.go('hover'); } break;
      case 'dive': moveTo(this.hx + this.side * 60, 320, 2.2); this.ha = damp(this.ha, 1 * -this.side, 3, dt); if (this.st > 1.1) { this.side = -this.side; this.hx = G.player.x + this.side * 420; this.hy = 320; FX.splash(this.hx, 2.5); this.go('emerge'); } break;
      case 'coil_in': moveTo(H.x, H.y - 40, 2); this.jaw = 1; if (this.st > 1.3) { const ps2 = G.player; this.scales = [-1, 0, 1].map((k) => ({ lx: k * (ps2.walk + 20), dy: k === 0 ? 30 : -6, hp: this.scaleHp || 70, max: this.scaleHp || 70, flash: 0 })); this.coilT = 0; FX.text(ps2.x, ps2.y - 180, '它缠住了船！砸碎发光的鳞片！', '#ff9a9a', 20, 2); this.go('hover'); this.nextAtk = 3; } break;
    }
    for (const s of this.scales) s.flash = Math.max(0, s.flash - dt * 5);
    if (this.hp <= this.max * 0.66 && this.phase === 1) { this.phase = 2; G.banner(this.txt.rage[0], this.txt.rage[1], this.col, 2.4); Sfx.play('roar', 0, 1); Sky.surge(G); G.spawnSkiff(-this.side, this.txt.adds); }
    if (this.hp <= this.max * 0.33 && this.phase === 2) { this.phase = 3; G.banner(this.txt.coil[0], this.txt.coil[1], '#ff9a9a', 2.4); Sfx.play('roar', 0, 1); Sky.surge(G); if (!['stuck', 'bite', 'bite_tell'].includes(this.state)) { this.go('coil_in'); this.zone = null; } else this.coilNext = true; }
    Sky.auroraRed = damp(Sky.auroraRed, this.phase === 3 ? 1 : 0, 0.8, dt);
  }
  pick(G) {
    const ps = G.player, cap = G.captain; this.atkN++;
    if (this.coilNext && this.phase === 3) { this.coilNext = false; return this.go('coil_in'); }
    if (this.phase === 3 && !this.scales.some((s) => s.hp > 0) && this.coilT === 0 && this.atkN % 6 === 0) return this.go('coil_in');
    const opts = ['breath', 'bite', 'bite']; if (this.phase >= 2) opts.push('shards', 'shards', 'dive');
    const a = pick(opts);
    if (a === 'breath') { const onDeck = cap.ship === ps ? cap.lx : 0, mid = Math.sign(onDeck || rand(-1, 1)) * ps.walk * 0.45; this.zone = { a: mid - ps.walk * 0.55, b: mid + ps.walk * 0.55 }; this.go('breath_tell'); Sfx.play('chargeStart', 0, 1); }
    else if (a === 'bite') { const lx = clamp(cap.ship === ps ? cap.lx : rand(-ps.walk, ps.walk), -ps.walk + 20, ps.walk - 20); this.bite = { lx }; this.go('bite_tell'); Sfx.play('roar', 0, 0.4); }
    else if (a === 'shards') { const n = this.phase === 3 ? 7 : 5; for (let i = 0; i < n; i++) this.marks.push({ lx: i === 0 && cap.ship === ps ? cap.lx : rand(-ps.walk + 10, ps.walk - 10), t: 0.9 + i * 0.18 }); this.go('shards'); Sfx.play('roar', 0, 0.7); }
    else { this.go('dive'); Sfx.play('splashBig', 0, 1); }
    this.nextAtk = this.phase === 3 ? 1.6 : this.phase === 2 ? 2.2 : 2.8;
  }
  /* body geometry: a bezier from the sea to the back of the head, plus a tail hump further out */
  bodyPts(G) {
    const ps = G.player, sd = this.side, k = this.sc, A = { x: ps.x + sd * 700 * k, y: 40 }, P1 = { x: A.x - sd * 40, y: A.y - 420 }, P3 = { x: this.hx + sd * 70 * k, y: this.hy + 10 * k }, P2 = { x: P3.x + sd * 180 * k, y: P3.y - 40 };
    const pts = [], N = 26;
    for (let i = 0; i <= N; i++) {
      const u = i / N, v = 1 - u, x = v * v * v * A.x + 3 * v * v * u * P1.x + 3 * v * u * u * P2.x + u * u * u * P3.x, y = v * v * v * A.y + 3 * v * v * u * P1.y + 3 * v * u * u * P2.y + u * u * u * P3.y;
      const w = Math.sin(u * 7 - this.t * 2.2) * 12 * (1 - u);
      pts.push({ x: x + w, y, r: lerp(34, 24, u) * this.sc });
    }
    return pts;
  }
  coilPts(G) {
    const ps = G.player, c = this.deckPoint(G, 0, 6), rx = ps.L + 46, ry = 44, pts = [];
    for (let i = 0; i < 40; i++) { const a = (i / 40) * TAU + this.t * 0.3; pts.push({ x: c.x + Math.cos(a) * rx, y: c.y + Math.sin(a) * ry, r: 22 * Math.min(this.sc, 1.3), front: Math.sin(a) > 0 }); }
    return pts;
  }
  seg(ctx, p, t, i) {
    const bx = Cam.bx(p.x), by = Cam.by(p.y), r = Math.max(3, Math.round(p.r * S)), fl = this.flash > 0.5, K = this.pal;
    P.disc(ctx, bx, by, r + 1, C.ink); P.disc(ctx, bx, by, r, C[fl ? K.flash : K.body]); P.disc(ctx, bx - 1, by - Math.round(r * 0.35), Math.max(2, r - 3), C[fl ? 'white' : K.lit]);
    P.rect(ctx, bx - r + 2, by + Math.round(r * 0.35), (r - 2) * 2, 2, C[K.belly]);
    if (i % 2 === 0) { const sp = Math.round(5 * this.sc); P.line(ctx, bx, by - r, bx + 2, by - r - sp, C[K.spike], 2); }
    if ((i * 7 + Math.floor(t * 2)) % 11 === 0) P.dot(ctx, bx + 2, by - 2, C[K.fleck]);
  }
  draw(ctx, t, layer) {
    const G_ = G;
    if (layer === 'back') {
      // tail hump far out
      const ps = G_.player, base = ps.x + this.side * 980;
      for (let i = 0; i < 9; i++) { const u = i / 8, x = base + this.side * (u - 0.5) * 300, y = 20 - Math.sin(u * Math.PI) * (70 + Math.sin(this.t * 1.3) * 20); if (y < Sea.height(x) + 10 && !(this.dying && Math.random() < this.dying * 0.3)) this.seg(ctx, { x, y, r: 22 - Math.abs(u - 0.5) * 12 }, t, i); }
      const pts = this.bodyPts(G_);
      pts.forEach((p, i) => { if (p.y > Sea.height(p.x) + p.r * 0.6) return; if (this.dying && i < this.dying * 12) return; this.seg(ctx, p, t, i); });
      const e = pts[0]; if (Math.random() < 0.3) FX.burst(e.x, Sea.height(e.x), { n: 1, angle: -Math.PI / 2, spread: 0.6, speed: 90, size: 2, color: 'foam', grav: 300, life: 0.5 });
      if (this.coil > 0.05) this.coilPts(G_).forEach((p, i) => { if (!p.front && i / 40 < this.coil) this.seg(ctx, p, t, i); });
      if (!['stuck', 'stunned', 'bite'].includes(this.state)) this.drawHead(ctx, t);
    } else if (layer === 'front') {
      if (this.coil > 0.05) this.coilPts(G_).forEach((p, i) => { if (p.front && i / 40 < this.coil) this.seg(ctx, p, t, i); });
      for (const s of this.scales) { if (s.hp <= 0) continue; const p = this.deckPoint(G_, s.lx, s.dy), bx = Cam.bx(p.x), by = Cam.by(p.y), pulse = Math.floor(t * 6) % 2; blit(ctx, s.flash > 0.5 ? silhouette(SPR.scale_glow, C.white) : SPR.scale_glow, bx - 3 - pulse, by - 3 - pulse); if (pulse) P.ring(ctx, bx, by, 6, C.g2); P.rect(ctx, bx - 6, by - 10, 12, 2, C.ink); P.rect(ctx, bx - 6, by - 10, Math.round(12 * s.hp / s.max), 2, C.g1); }
      if (['stuck', 'stunned', 'bite'].includes(this.state)) this.drawHead(ctx, t);
    } else {
      // warnings on deck: breath zone, bite target, icicle shadows and falling icicles
      const ps = G_.player;
      if (this.zone && this.state === 'breath_tell') { const on = Math.floor(t * 8) % 2; for (let lx = this.zone.a; lx < this.zone.b; lx += 6) { const p = this.deckPoint(G_, lx, -2); P.rect(ctx, Cam.bx(p.x), Cam.by(p.y) - (on ? 3 : 2), 3, 2, C[on ? 'n8' : 'b4']); } }
      if (this.bite && this.state === 'bite_tell') { const p = this.deckPoint(G_, this.bite.lx, -2), bx = Cam.bx(p.x), by = Cam.by(p.y), r = 6 + Math.floor(this.st * 12) % 4; P.ring(ctx, bx, by - 2, r, C.r4); P.line(ctx, bx - r - 3, by - 2, bx + r + 3, by - 2, C.r4, 1); }
      for (const m of this.marks) {
        const p = this.deckPoint(G_, m.lx, -1), bx = Cam.bx(p.x), by = Cam.by(p.y);
        if (m.t > 0) { const k = clamp(1 - m.t / 1, 0, 1), w = Math.round(4 + k * 8); P.rect(ctx, bx - w, by - 1, w * 2, 2, C.n2); if (m.t < 0.25) { const iy = by - Math.round((m.t / 0.25) * 200); blit(ctx, SPR.icicle, bx - 1, iy - 8); } }
      }
    }
  }
  drawHead(ctx, t) {
    const A = this.art, k = this.sc, bx = Cam.bx(this.hx), by = Cam.by(this.hy), flip = this.side < 0, fl = this.flash > 0.5;
    // inkOutline hands back one shared canvas per size, so the jaw is drawn before the head is outlined
    ctx.save(); ctx.translate(bx, by); if (flip) ctx.scale(-1, 1); ctx.rotate(this.ha * (flip ? -1 : 1)); if (k !== 1) ctx.scale(k, k);
    ctx.save(); ctx.translate(A.hinge[0] - A.W / 2, A.hinge[1] - A.H / 2); ctx.rotate(-this.jaw * 0.55); ctx.drawImage(inkOutline(fl ? silhouette(A.jaw, C.white) : A.jaw, A.W, A.H), -A.hinge[0], -A.hinge[1]); ctx.restore();
    ctx.drawImage(inkOutline(fl ? silhouette(A.head, C.white) : A.head, A.W, A.H), -A.W / 2, -A.H / 2);
    // the eye: dull behind the scales, blazing when the head is down and open to blows
    const ex = A.eye[0] - A.W / 2, ey = A.eye[1] - A.H / 2, hot = this.exposed || this.dying, E = A.eyeC || ['g1', 'g3'];
    ctx.fillStyle = C[hot ? (Math.floor(t * 10) % 2 ? 'white' : E[1]) : E[0]]; ctx.fillRect(ex, ey, 4, 2); ctx.fillStyle = C.ink; ctx.fillRect(ex + 1, ey, 1, 2);
    if (this.jaw > 0.3 && (this.state === 'breath_tell' || this.state === 'breath' || this.state === 'spit')) { ctx.fillStyle = C[E[1]]; ctx.fillRect(A.mouth[0] - A.W / 2, A.mouth[1] - A.H / 2 + 2, 10, 2); }
    ctx.restore();
    if (this.exposed) { const r = Math.round((30 + Math.floor(t * 8) % 3) * k); P.ring(ctx, bx, by, r, C[Math.floor(t * 8) % 2 ? 'f5' : 'white']); }
  }
  shatter() { const pts = this.bodyPts(G), p = pick(pts); FX.burst(p.x, p.y, { n: 6, speed: 300, size: 3, color: this.pal.shard[0], color2: this.pal.shard[1], grav: 700, life: 0.9 }); if (Math.random() < 0.2) Sfx.play('clang', 0, 0.3); Cam.shake(0.05); }
  /* what Bon and the ballistas aim at */
  targetPoint() {
    if (this.dying) return null;
    const sc = this.scales.find((s) => s.hp > 0); if (sc) { const p = this.deckPoint(G, sc.lx, sc.dy); return { x: p.x, y: p.y, pri: 2.2 }; }
    return { x: this.hx, y: this.hy, pri: this.exposed ? 2.4 : 0.8 };
  }
  /* any hit at a point: the glowing coil scales, then the head (hard scales unless it is stuck or stunned) */
  hitAt(x, y, dmg, G, src) {
    if (this.dying) return false;
    for (const s of this.scales) {
      if (s.hp <= 0) continue; const p = this.deckPoint(G, s.lx, s.dy);
      if (Math.hypot(x - p.x, y - p.y) < 34) {
        s.hp -= dmg; s.flash = 1; FX.burst(p.x, p.y, { n: 10, speed: 260, size: 2, color: 'g2', color2: 'n8', grav: 500, life: 0.5 }); Sfx.play('clang', 0, 0.7);
        if (s.hp <= 0) { Sfx.play('crack', 0, 1); Cam.shake(0.2); FX.text(p.x, p.y - 50, '鳞片碎了！', '#bfe8ff', 18, 1); this.chip(60, G); }
        if (!this.scales.some((q) => q.hp > 0)) { this.scales = []; this.coilT = 0; this.bite = { lx: 0 }; this.go('stunned'); FX.text(G.player.x, G.player.y - 200, this.txt.stun, '#ffd84a', 24, 1.6); Sfx.play('roar', 0, 1); Cam.shake(0.4); }
        return true;
      }
    }
    if (Math.hypot(x - this.hx, y - this.hy) < 52 * this.sc) {
      const k = this.exposed ? 1.6 : 0.35; this.chip(dmg * k, G); this.flash = 1;
      if (!this.exposed && src === 'cap' && this.hitCd <= 0) { this.hitCd = 1.2; FX.text(this.hx, this.hy - 60, '鳞甲太硬', '#9ab0c0', 16, 0.8); Sfx.play('clang', 0, 0.6); }
      else FX.text(this.hx + rand(-20, 20), this.hy - 50, `${Math.round(dmg * k)}`, this.exposed ? '#ffd84a' : '#bfe8ff', this.exposed ? 22 : 16, 0.7);
      return true;
    }
    return false;
  }
  chip(d, G) {
    if (this.dying) return; this.hp -= d;
    if (this.hp <= 0) { this.hp = 0; this.dying = 0.001; this.scales = []; this.marks = []; this.zone = null; FX.slowmo(0.25, 1.2); Cam.shake(0.5); Sfx.play('roar', 0, 1); G.banner(this.txt.fall[0], this.txt.fall[1], this.col, 3.5); Sky.auroraRed = 0; }
  }
  glow(L) { if (!this.dying) L.push({ x: this.hx, y: this.hy, r: 150 * this.sc, c: this.glowC, i: this.sc > 1 ? 0.9 : 0.55 }); if (this.exposed || this.state === 'breath' || this.state === 'breath_tell') L.push({ x: this.hx, y: this.hy, r: 240, c: [150, 220, 255], i: 1 }); for (const s of this.scales) if (s.hp > 0) { const p = this.deckPoint(G, s.lx, s.dy); L.push({ x: p.x, y: p.y, r: 90, c: [110, 255, 230], i: 0.9 }); } }
}

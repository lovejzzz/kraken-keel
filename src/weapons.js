'use strict';
/* The captain's arsenal past the oar. Three boss weapons join the three he already had: the lava axe (Surtr), the soul harpoon
   (Hel) and Thor's hammer (the world serpent). Every weapon also changes its look as it levels: plain, then 精铁 (levels 2–3),
   镀金 (4–5), and at 6+ glowing 符文 steel that lights the deck and colours its swing. */
const WEAPONS = ['oar', 'cutlass', 'scatter', 'axe', 'harpoon', 'hammer'];
const TIER_NAME = ['', '精铁', '镀金', '符文'];
function wTier(k, lv = G.ups[k] || 0) { return lv >= 6 ? 3 : lv >= 4 ? 2 : lv >= 2 ? 1 : 0; }

/* ---------------- the three new weapons ---------------- */
sprite('w_axe', [
  '...hHh...', '....h....', '....w....', '....w....', '....W....', '....w....', '....W....', '....w....', '....W....', '....w....', '....W....', '....w....',
  '..mmwmm..', '.mMMwMMm.', 'mMMlwMMMm', 'mMlLwlMMm', 'mlMlwMlLm', 'mMMMwMMMm', 'mMlMwlMMm', '.mMlwMMm.', '..mmwmm..', '....w....', '...hHh...',
], { w: 'w3', W: 'w5', h: 'm2', H: 'm3', m: 'm0', M: 'm1', l: 'f3', L: 'f5' });
sprite('w_harpoon', [
  '..s..', '.s.s.', '..s..', '..w..', '..W..', '..w..', '..w..', '..W..', '..w..', '..w..', '..W..', '..w..', '..w..', '..W..', '..w..', '..w..', '..W..', '..w..', '..w..', '..W..',
  '..m..', '.mMm.', 'mMgMm', 'M.g.M', '..g..', '.gGg.', 'g.G.g', '..G..',
], { s: 'b2', w: 'w4', W: 'd2', m: 'm2', M: 'm4', g: 'g1', G: 'g2' });
sprite('w_hammer', [
  '....s.s....', '.....s.....', '.....w.....', '.....W.....', '.....w.....', '.....W.....', '.....w.....', '.....W.....',
  'mmmmmmmmmmm', 'mMMMMMMMMMm', 'mMrMMMMMrMm', 'mMMMMRMMMMm', 'mMrMMMMMrMm', 'mMMMMMMMMMm', 'mmmmmmmmmmm',
], { s: 'w3', w: 'w2', W: 'w4', m: 'm1', M: 'm3', r: 'm4', R: 'b4' });
sprite('u_axe', ['....bb....', '.mm.bb.mm.', 'mMLmbbmLMm', 'mMlMbbMlMm', 'mMMmbbmMMm', '.mm.bb.mm.', '....bb....', '....bb....', '....bb....', '...bbbb...'], { b: 'w3', m: 'm0', M: 'm1', l: 'f3', L: 'f5' });
sprite('u_harpoon', ['.........g', '........gG', '.......gGg', '......mMg.', '.....wm...', '....w.....', '...w......', '..w.......', '.w........', 's.........'], { g: 'g1', G: 'g2', m: 'm2', M: 'm4', w: 'w4', s: 'b2' });
sprite('u_hammer', ['.mmmmmmmm.', 'mMMMMMMMMm', 'mMrMMRMrMm', 'mMMMMMMMMm', '.mmmmmmmm.', '....ww....', '....wW....', '....ww....', '....wW....', '...ssss...'], { m: 'm1', M: 'm3', r: 'm4', R: 'b4', w: 'w2', W: 'w4', s: 'w3' });
sprite('ic_zap', ['..yy', '.yy.', 'yyyy', '.yy.', 'yy..'], { y: 'f5' });

/* every weapon, in each of the three upgraded looks (iron, gilt, rune) */
const TIERS = {
  oar: [{ r: 'm3', m: 'm4' }, { r: 'gold', m: 'gold', W: 'w4' }, { w: 'k4', W: 'k3', r: 'g2', m: 'gold' }],
  cutlass: [{ w: 'm4', W: 'white', g: 'm3', G: 'm4' }, { w: 'm4', W: 'f6', g: 'gold', G: 'f6', b: 'r2' }, { w: 'g1', W: 'g3', g: 'gold', G: 'g2', b: 'k3' }],
  scatterbow: [{ m: 'm3', M: 'white', k: 'm2' }, { m: 'gold', M: 'f6', w: 'w4', k: 'f2' }, { w: 'k3', W: 'k5', s: 'g2', m: 'gold', M: 'g3' }],
  w_axe: [{ W: 'm3', m: 'm1', M: 'm2', l: 'f4', L: 'f6' }, { W: 'gold', h: 'gold', H: 'f5', m: 'f1', M: 'm1', l: 'f4', L: 'f6' }, { w: 'k2', W: 'gold', h: 'g2', H: 'g3', m: 'k1', M: 'k2', l: 'f5', L: 'white' }],
  w_harpoon: [{ m: 'm3', M: 'white', W: 'm3' }, { m: 'gold', M: 'f6', W: 'gold', s: 'gold' }, { w: 'k3', W: 'g1', m: 'g1', M: 'g3', g: 'g2', G: 'white' }],
  w_hammer: [{ M: 'm4', r: 'white', w: 'w3' }, { m: 'f2', M: 'gold', r: 'f6', R: 'f6' }, { m: 'n4', M: 'n7', r: 'g2', R: 'white', w: 'k2', W: 'k4' }],
  u_oar: [{ m: 'm4' }, { m: 'gold', W: 'w6' }, { W: 'k5', b: 'k2', m: 'g2' }],
  u_cutlass: [{ m: 'm4', M: 'white' }, { g: 'f5', M: 'f6' }, { m: 'g1', M: 'g3', b: 'k3' }],
  u_scatter: [{ m: 'm4' }, { m: 'gold', M: 'f6' }, { w: 'k3', W: 'k5', s: 'g2', m: 'g1' }],
  u_axe: [{ M: 'm2', l: 'f4', L: 'f6' }, { m: 'f1', M: 'gold', b: 'w4' }, { m: 'k3', M: 'k5', l: 'f5', L: 'white', b: 'k4' }],
  u_harpoon: [{ m: 'm3', M: 'white' }, { m: 'gold', M: 'f6' }, { w: 'k3', g: 'g2', G: 'white', m: 'g1' }],
  u_hammer: [{ M: 'm4', r: 'white' }, { m: 'f2', M: 'gold', r: 'f6' }, { m: 'n4', M: 'n7', r: 'g2', R: 'white' }],
};
for (const k in TIERS) TIERS[k].forEach((sw, i) => recolor(`${k}_t${i + 1}`, k, sw));
/* grip pixel and whether both hands hold it */
const WGRIP = { oar: [[1, 2], true], cutlass: [[1, 2], false], scatterbow: [[4, 3], true], w_axe: [[4, 3], true], w_harpoon: [[2, 13], true], w_hammer: [[5, 3], false] };
const WSPR = { oar: 'oar', cutlass: 'cutlass', scatter: 'scatterbow', axe: 'w_axe', harpoon: 'w_harpoon', hammer: 'w_hammer' };
function wSprite(k, a) {
  if (k === 'hammer' && G.hammerOut && a) return 'w_none'; // Mjölnir is out flying
  const t = wTier(k); return WSPR[k] + (t ? '_t' + t : '');
}
/* smear colours: [back, bright, edge] */
function weaponSmear(k) {
  const t = wTier(k);
  if (t === 3) return k === 'axe' ? ['f3', 'f6', 'white'] : k === 'hammer' ? ['n6', 'g2', 'white'] : ['g1', 'g2', 'g3'];
  if (t === 2) return k === 'axe' ? ['f2', 'gold', 'f6'] : ['f2', 'gold', 'f6'];
  if (k === 'axe') return ['f2', 'f4', 'f6'];
  if (k === 'hammer') return ['n5', 'b4', 'white'];
  if (t === 1) return ['m2', 'm4', 'white'];
  return null;
}

Object.assign(UPGRADES, {
  axe: { name: '熔岩战斧', cost: 70, desc: '战斧伤害 +30%，烧得更狠', caps: [2, 4, 5, 6, 8], max: 2, icon: 'u_axe', tab: 'weapon', weapon: true, drop: '击败苏尔特掉落', style: '两连重劈 · 点燃敌人 · 蓄力火焰地裂', per: 0.3 },
  harpoon: { name: '幽魂鱼叉', cost: 70, desc: '鱼叉伤害 +25%，出手更快', caps: [2, 4, 5, 6, 8], max: 2, icon: 'u_harpoon', tab: 'weapon', weapon: true, drop: '击败海拉掉落', style: '把敌人拽过来 · 蓄力把自己拽过去', per: 0.25 },
  hammer: { name: '雷神之锤', cost: 80, desc: '锤子伤害 +25%，闪电多跳', caps: [2, 4, 5, 6, 8], max: 2, icon: 'u_hammer', tab: 'weapon', weapon: true, drop: '击败巨蟒掉落', style: '三连锤 · 闪电链 · 蓄力掷锤召雷', per: 0.25 },
});

/* ---------------- 熔岩战斧: two slow, huge cuts that set raiders alight; the charged blow splits the deck with fire ---------------- */
function axeBurn(cap, e, dmg) { Salvage.burnActor(e, 3 + wTier('axe') * 0.6, Math.max(4, dmg * 0.14)); FX.burst(e.x, e.cy, { n: 10, speed: 220, size: 1, color: 'f5', color2: 'f3', grav: -60, life: 0.5, kind: 'ember', water: false }); }
const AXE = [
  { name: 'x1', dur: 0.46, hit: [0.15, 0.23], cancel: 0.27, reach: 96, dmg: 21, kx: 520, ky: -320, stop: 0.1, heavy: true, sfx: 'swingBig', onHit: axeBurn,
    keys: [[0, REST_A, 0, 0, 0], [0.09, 3.2, -3, 0.35, -2], [0.15, 4.0, -5, 0.6, -3], [0.2, 7.25, 6, 0.8, 6, 1], [0.27, 7.55, 4, 0.6, 4], [0.46, REST_A + TAU, 0, 0, 0]] },
  { name: 'x2', dur: 0.58, hit: [0.18, 0.26], cancel: 99, reach: 104, dmg: 30, kx: 950, ky: -620, stop: 0.15, heavy: true, finisher: true, sfx: 'swingBig', onHit: axeBurn,
    keys: [[0, 1.25, 1, 0.2, 0], [0.1, 2.5, -3, 0.7, -2], [0.18, 2.9, -4, 0.8, -3], [0.24, -1.35, 7, 0, 7, 1], [0.31, -1.7, 4, -0.1, 4], [0.58, REST_A, 0, 0, 0]] },
];
function chargedAxe(c) {
  return { name: 'quake', dur: 0.62, hit: [0.2, 0.3], cancel: 99, reach: 110 + c * 12, dmg: 30 + c * 40, kx: 700, ky: -700 - c * 220, stop: 0.12 + c * 0.06, heavy: true, charged: true, sfx: 'swingBig', onHit: axeBurn,
    onStrike: (cap, A) => { if (A.charge >= 0.45) Quakes.spawn(cap, (18 + A.charge * 30) * cap.dmgMul * cap.wMul()); Cam.shake(0.2 + A.charge * 0.2); },
    keys: [[0, CHARGE_A, -4, 0.55, -3], [0.12, 4.2, -6, 0.4, -4], [0.22, 7.6, 7, 1, 7, 1], [0.34, 7.7, 5, 0.9, 5], [0.62, REST_A + TAU, 0, 0, 0]] };
}
/* a line of fire that runs along the deck from the axe blade */
const Quakes = {
  list: [],
  spawn(cap, dmg) {
    const s = cap.ship; if (!s) return;
    this.list.push({ ship: s, lx: cap.lx + cap.face * 30, f: cap.face, v: 720, life: 0.75, dmg, hit: new Set(), puff: 0 });
    Sfx.play('fire', cap.pan(), 1); Sfx.play('slam', cap.pan(), 0.8);
  },
  update(dt, G) {
    for (const q of this.list) {
      q.life -= dt; q.lx += q.f * q.v * dt; q.v *= Math.exp(-1.1 * dt);
      if (q.ship.sunk || Math.abs(q.lx) > q.ship.walk + 10) { q.life = 0; continue; }
      const p = q.ship.toWorld(q.lx, q.ship.deckY(q.lx));
      q.puff -= dt; if (q.puff <= 0) { q.puff = 0.03; FX.burst(p.x, p.y - 4, { n: 3, angle: -HALF_PI, spread: 0.5, speed: 260, size: 2, color: 'f5', color2: 'f3', grav: -200, life: 0.45, kind: 'ember', water: false }); FX.burst(p.x, p.y, { n: 1, angle: -HALF_PI, spread: 0.4, speed: 120, size: 1, color: 'w5', color2: 'w2', grav: 700, life: 0.4, kind: 'splinter' }); }
      FX.light(p.x, p.y - 30, 160, [255, 150, 60], 1.1);
      for (const e of G.enemies) {
        if (e.dead || e.water || e.air || e.phased > 0 || q.hit.has(e) || e.ship !== q.ship || Math.abs(e.lx - q.lx) > 30) continue;
        q.hit.add(e); const crit = Math.random() < 0.25, d = q.dmg * (crit ? 2 : 1);
        e.hurt(d, q.f * 320, -760, { stun: 0.9 }); Salvage.burnActor(e, 3.5, Math.max(4, q.dmg * 0.15)); FX.hitSpark(e.cx, e.cy, -HALF_PI, true); Sfx.play('heavy', e.pan(), 0.9);
        if (crit) critFX(e.cx, e.cy - 20, d); if (e.hp <= 0) G.kill(e, G.captain);
      }
      if (G.boss && !q.hit.has(G.boss) && G.boss.hitAt(p.x, p.y - 20, q.dmg, G, 'bolt')) q.hit.add(G.boss);
      for (const tn of G.tentacles) { if (q.hit.has(tn)) continue; const h = tn.hitPoint(p.x, p.y - 20, 34); if (h) { q.hit.add(tn); tn.damage(q.dmg, G); } }
    }
    this.list = this.list.filter((q) => q.life > 0);
  },
  draw(ctx, t) {
    for (const q of this.list) {
      const s = q.ship;
      for (let i = 0; i < 4; i++) { const lx = q.lx - q.f * i * 16; if (Math.abs(lx) > s.walk) continue; const p = s.toWorld(lx, s.deckY(lx)), bx = Cam.bx(p.x), by = Cam.by(p.y) + 1; const k = 1 - i * 0.2; drawFlame(ctx, bx, by, t * 1.5, i * 3.1 + q.lx * 0.01); if (k > 0.7) drawFlame(ctx, bx + 1, by - 8, t * 1.7, i * 1.3); if (i === 0) { drawFlame(ctx, bx - 1, by - 16, t * 2, 5); P.rect(ctx, bx - 3, by - 1, 7, 2, C.f6); } }
    }
  },
};

/* ---------------- 雷神之锤: three heavy blows whose lightning jumps to the raiders around; the charged throw flies out, calls down
   a thunderbolt and comes back to the hand ---------------- */
function zap(x1, y1, x2, y2, t = 0.2, big = false) { G.zaps.push({ x1, y1, x2, y2, t, max: t, big, seed: rand(0, 99) }); }
function hammerChain(cap, e, dmg, G, n = 1) {
  n += wTier('hammer') >= 2 ? 1 : 0;
  let from = e; const done = new Set([e]);
  for (let i = 0; i < n; i++) {
    let best = null, bd = 230;
    for (const o of G.enemies) { if (o.dead || o.water || o.phased > 0 || done.has(o)) continue; const d = Math.hypot(o.cx - from.cx, o.cy - from.cy); if (d < bd) { bd = d; best = o; } }
    if (!best) break;
    done.add(best); zap(from.cx, from.cy, best.cx, best.cy, 0.22);
    best.hurt(dmg * 0.55, Math.sign(best.x - from.x || 1) * 260, -260, { stun: 0.6 }); FX.hitSpark(best.cx, best.cy, 0, false); Sfx.play('crack', best.pan(), 0.5);
    if (best.hp <= 0) G.kill(best, cap); from = best;
  }
  FX.burst(e.cx, e.cy, { n: 8, speed: 260, size: 1, color: 'b4', color2: 'g2', grav: 0, life: 0.25, kind: 'spark', water: false });
}
const HAMMER = [
  { name: 'h1', dur: 0.36, hit: [0.1, 0.16], cancel: 0.19, reach: 90, dmg: 15, kx: 420, ky: -240, stop: 0.08, heavy: false, sfx: 'swingBig', onHit: (c, e, d, G) => hammerChain(c, e, d, G, 1),
    keys: [[0, REST_A, 0, 0, 0], [0.06, 2.9, -2, 0.3, -1], [0.1, 3.9, -4, 0.5, -3], [0.15, 7.2, 5, 0.6, 5, 1], [0.2, 7.45, 4, 0.45, 4], [0.36, REST_A + TAU, 0, 0, 0]] },
  { name: 'h2', dur: 0.38, hit: [0.1, 0.16], cancel: 0.2, reach: 90, dmg: 15, kx: 360, ky: -460, stop: 0.08, heavy: false, sfx: 'swingBig', onHit: (c, e, d, G) => hammerChain(c, e, d, G, 1),
    keys: [[0, 1.25, 1, 0.2, 0], [0.08, 2.55, -2, 0.65, -2], [0.15, -1.3, 4, 0, 4, 1], [0.2, -1.7, 3, -0.1, 3], [0.38, REST_A, 0, 0, 0]] },
  { name: 'h3', dur: 0.56, hit: [0.19, 0.26], cancel: 99, reach: 100, dmg: 27, kx: 780, ky: -600, stop: 0.14, heavy: true, finisher: true, sfx: 'swingBig', onHit: (c, e, d, G) => hammerChain(c, e, d, G, 2),
    onStrike: (cap) => { const t = cap.tipWorld(); FX.burst(t.x, t.y, { n: 14, speed: 300, size: 1, color: 'b4', color2: 'g2', grav: 0, life: 0.3, kind: 'spark', water: false }); FX.light(t.x, t.y, 200, [170, 210, 255], 1.2); Sfx.play('crack', cap.pan(), 0.6); },
    keys: [[0, REST_A, 0, 0, 0], [0.08, 2.9, -2, 0.3, -1], [0.16, 3.7, -5, 0.6, -3], [0.2, 4.9, 1, 0.1, 1, 1], [0.24, 7.55, 6, 0.85, 5, 1], [0.34, 7.6, 4, 0.6, 3], [0.56, REST_A + TAU, 0, 0, 0]] },
];
function chargedHammer(c) {
  return { name: 'throw', dur: 0.4, hit: [9, 9], cancel: 99, reach: 0, dmg: 0, kx: 0, ky: 0, stop: 0, heavy: true, charged: true, sfx: 'swingBig', strikeAt: 0.14, onStrike: (cap, A, G) => throwHammer(cap, A.charge, G),
    keys: [[0, CHARGE_A, -4, 0.5, -3], [0.1, 4.4, -5, 0.3, -3], [0.16, 6.9, 5, 0.2, 5, 1], [0.4, REST_A + TAU, 0, 0, 0]] };
}
function throwHammer(cap, c, G) {
  const sh = cap.shoulderWorld(), m = Input.mouse, a = Math.atan2(m.y - sh.y, m.x - sh.x), dmg = (26 + c * 30) * cap.dmgMul * cap.wMul();
  G.shots.push(new Projectile({ x: sh.x + Math.cos(a) * 20, y: sh.y + Math.sin(a) * 20, vx: Math.cos(a) * 1150, vy: Math.sin(a) * 1150, grav: 0, float: true, dmg, team: 'player', kind: 'mjolnir', life: 3.2, charge: c, out: true, t: 0, owner: cap, tick: hammerTick, hit: hammerHit }));
  G.hammerOut = true; cap.busyT = 99; Sfx.play('swingBig', cap.pan(), 1); Cam.kick(0.015);
}
function hammerTick(p, dt, G) {
  p.t += dt; p.spin = (p.spin || 0) + dt * 22; const cap = p.owner;
  if (Math.random() < 0.6) FX.burst(p.x, p.y, { n: 1, speed: 60, size: 1, color: Math.random() < 0.5 ? 'b4' : 'g2', grav: 0, life: 0.2, kind: 'spark', water: false });
  FX.light(p.x, p.y, 110, [170, 210, 255], 0.9);
  if (p.out && p.t > 0.42) { p.out = false; p.hitSet = new Set(); if (p.charge >= 0.45) thunderAt(G, p.x, p.y, p.dmg * (0.8 + p.charge * 0.6), 130); }
  if (!p.out) {
    const sh = cap.shoulderWorld(), dx = sh.x - p.x, dy = sh.y - p.y, d = Math.hypot(dx, dy) || 1, sp = Math.min(1500, 700 + p.t * 900);
    p.vx = damp(p.vx, (dx / d) * sp, 8, dt); p.vy = damp(p.vy, (dy / d) * sp, 8, dt);
    if (d < 34 || p.life < 0.1) { p.dead = true; G.hammerOut = false; cap.busyT = 0; Sfx.play('clang', cap.pan(), 0.8); FX.burst(sh.x, sh.y, { n: 8, speed: 160, size: 1, color: 'b4', grav: 0, life: 0.25, kind: 'spark', water: false }); }
  }
}
function hammerHit(p, G) {
  for (const e of G.enemies) {
    if (e.dead || e.water || e.phased > 0 || p.hitSet.has(e) || Math.hypot(e.cx - p.x, e.cy - p.y) > 30 * e.scale) continue;
    p.hitSet.add(e); const crit = Math.random() < p.owner.critChance({ charged: true }, { charge: p.charge }), d = p.dmg * 0.7 * (crit ? 2 : 1);
    e.hurt(d, Math.sign(p.vx || 1) * 520, -420, { stun: 0.7 }); FX.hitSpark(p.x, p.y, Math.atan2(p.vy, p.vx), true); FX.stop(0.04); Sfx.play('heavy', e.pan(), 0.9);
    if (crit) critFX(e.cx, e.cy - 20, d); hammerChain(p.owner, e, p.dmg * 0.6, G, 1); if (e.hp <= 0) G.kill(e, p.owner);
  }
  for (const h of G.hawks) if (!h.dead && !p.hitSet.has(h) && Math.hypot(h.x - p.x, h.y - p.y) < (h.r || 16) + 10) { p.hitSet.add(h); h.hurt(p.dmg * 0.8, Math.sign(p.vx) || 1); }
  for (const tn of G.tentacles) { if (p.hitSet.has(tn)) continue; const q = tn.hitPoint(p.x, p.y, 28); if (q) { p.hitSet.add(tn); tn.damage(p.dmg * 0.8, G); FX.hitSpark(q.x, q.y, 0, true); } }
  if (G.boss && !p.hitSet.has(G.boss) && G.boss.hitAt(p.x, p.y, p.dmg * 0.8, G, 'bolt')) { p.hitSet.add(G.boss); FX.stop(0.05); }
  if (G.kraken && !p.hitSet.has(G.kraken) && G.kraken.eyeHit(p.x, p.y, 16)) { p.hitSet.add(G.kraken); G.kraken.hitEye(p.dmg * 0.8, G); }
}
/* a thunderbolt out of the sky onto one spot: hurts every foe near it (also calls on the thunder shaman and Thor) */
function thunderAt(G, x, y, dmg, r, hurtsCap = false) {
  zap(x + rand(-30, 30), Cam.viewT() - 20, x, y, 0.3, true); Sky.flash = Math.max(Sky.flash, 0.8); Cam.shake(0.25); FX.stop(0.05);
  Sfx.play('thunder', clamp((x - Cam.x) / 700, -1, 1), 1); FX.light(x, y, 420, [190, 220, 255], 2);
  FX.burst(x, y, { n: 30, speed: 420, size: 1, color: 'b4', color2: 'g3', grav: 200, life: 0.5, kind: 'spark', water: false });
  if (y > Sea.height(x) - 20) FX.splash(x, 1.4);
  for (const e of G.enemies) { if (e.dead || e.water || e.phased > 0 || Math.hypot(e.cx - x, e.cy - y) > r) continue; e.hurt(dmg, Math.sign(e.x - x || 1) * 420, -520, { stun: 1.1 }); if (e.hp <= 0) G.kill(e, G.captain); }
  for (const h of G.hawks) if (!h.dead && Math.hypot(h.x - x, h.y - y) < r) h.hurt(dmg, Math.sign(h.x - x) || 1);
  if (G.boss) G.boss.hitAt(x, y, dmg, G, 'bolt');
  const cap = G.captain;
  if (hurtsCap && cap.down <= 0 && Math.hypot(cap.cx - x, cap.cy - y) < r && cap.hurt(dmg, Math.sign(cap.x - x || 1) * 300, -420, { stun: 0.5 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); }
}

/* ---------------- 幽魂鱼叉: aim and throw; whatever it bites is dragged to the captain. Charged, it drags the captain to it:
   across the gap onto an enemy deck, up to the boss, back aboard from the sea ---------------- */
Object.assign(Captain.prototype, {
  updateHarpoon(dt, G, m, peaceful) {
    const canAct = !this.water && this.dodge <= 0 && !peaceful, lv = G.ups.harpoon || 0;
    this.shotCd = Math.max(0, (this.shotCd || 0) - dt); this.chargeFlash = Math.max(0, (this.chargeFlash || 0) - dt * 4); this.recoil = Math.max(0, (this.recoil || 0) - dt * 5);
    this.holdT = m.l || m.r ? (this.holdT || 0) + dt : 0;
    const sh = this.shoulderWorld(), ang = Math.atan2(m.y - sh.y, m.x - sh.x), fa = Math.atan2(m.y - sh.y, Math.abs(m.x - sh.x) + 1);
    this.weaponA = damp(this.weaponA, clamp(fa, -1.45, 1.4) - HALF_PI + this.recoil * 0.3, 20, dt);
    this.atkLean = damp(this.atkLean || 0, this.charging ? -3 - this.charge * 3 : this.recoil * 5, 14, dt); this.atkStep = 0; this.atkCrouch = damp(this.atkCrouch || 0, this.charging ? 0.35 : 0, 10, dt);
    if (!canAct && !this.water) { this.charging = false; this.charge = 0; return; }
    // in the sea the charged harpoon still works: it is the fastest way back aboard
    if (this.water && !(m.l || m.r || m.lr || m.rr)) return;
    if (!this.charging && this.holdT > 0.2 && this.shotCd <= 0.1) { this.charging = true; this.chargeT = 0; this.charge = 0; this.chargeLv = 0; Sfx.play('chargeStart', this.pan(), 1); }
    if (this.charging) {
      this.chargeT += dt * (this.chargeRate || 1); this.charge = clamp(this.chargeT / 0.55, 0, 1); const l2 = this.charge >= 1 ? 2 : this.charge >= 0.45 ? 1 : 0;
      if (l2 > this.chargeLv) { this.chargeLv = l2; this.chargeFlash = 1; Sfx.play(l2 === 2 ? 'chargeFull' : 'chargeLv', this.pan(), 1); }
      if (Math.random() < 0.5 * this.charge) { const t = this.tipWorld(); FX.burst(t.x, t.y, { n: 1, speed: 40, size: 1, color: 'g2', grav: -30, life: 0.3, water: false }); }
    }
    if (m.lr || m.rr || (this.charging && !m.l && !m.r)) this.queued = 0.18;
    this.queued = Math.max(0, (this.queued || 0) - dt);
    if (this.queued > 0 && this.shotCd <= 0 && (!this.water || this.charge >= 0.45)) { this.throwHarpoon(G, ang, this.charging ? this.charge : 0, lv); this.queued = 0; this.charging = false; this.charge = 0; this.chargeLv = 0; }
  },
  throwHarpoon(G, ang, c, lv) {
    const pull = c >= 0.45, sh = this.shoulderWorld(), sp = pull ? 1700 : 1300, crit = Math.random() < this.critChance({ charged: pull }, { charge: c });
    const dmg = 20 * this.dmgMul * this.wMul() * (pull ? 1.2 : 1) * (crit ? 2 : 1);
    G.shots.push(new Projectile({ x: sh.x + Math.cos(ang) * 26, y: sh.y + Math.sin(ang) * 26, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, grav: pull ? 160 : 300, float: false, dmg, crit, team: 'player', kind: 'harpoon', life: pull ? 0.95 : 0.6, pull, owner: this, hit: harpoonHit, tick: (p) => FX.light(p.x, p.y, 70, [110, 255, 220], 0.6) }));
    this.shotCd = Math.max(0.35, 0.72 - lv * 0.05) + (pull ? 0.25 : 0); this.recoil = 1;
    Sfx.play('rope', this.pan(), 1); Sfx.play('swing', this.pan(), 0.8); Cam.kick(0.01);
    FX.burst(sh.x + Math.cos(ang) * 26, sh.y + Math.sin(ang) * 26, { n: 6, angle: ang, spread: 0.4, speed: 200, size: 1, color: 'g2', grav: 0, life: 0.2, water: false });
  },
});
RANGED.harpoon = 'updateHarpoon';
MELEE.axe = { combo: AXE, charged: chargedAxe, r: 42 };
MELEE.hammer = { combo: HAMMER, charged: chargedHammer, r: 34 };
function tether(from, to, t = 0.25) { G.tethers.push({ from, to, t, max: t }); }
/* fly the captain in an arc to a point */
function zipTo(cap, x, y, G) {
  y -= 30; const dx = x - cap.x, dy = y - cap.y, d = Math.hypot(dx, dy), T = clamp(d / 950, 0.42, 0.85);
  if (cap.water) { cap.water = false; cap.y = Sea.height(cap.x) - 10; }
  cap.onRope = null; cap.climb = null; cap.atk = null; cap.smear = null; cap.charging = false;
  cap.launch(dx / T, (y - cap.y) / T - 0.5 * GRAV * T); cap.zipT = T + 0.05; cap.iframes = Math.max(cap.iframes, 0.3); cap.airJumps = 1;
  tether(cap, { x, y }, T); Sfx.play('hook', cap.pan(), 1); FX.text(cap.x, cap.y - 90, '拽！', '#8ff8ec', 18, 0.6);
}
function harpoonHit(p, G) {
  const cap = p.owner, land = (x, y) => { p.dead = true; if (p.pull) zipTo(cap, x, y, G); else FX.sparks(x, y, 6); };
  for (const e of G.enemies) {
    if (e.dead || e.water || e.phased > 0 || Math.hypot(e.cx - p.x, e.cy - p.y) > 26 * e.scale) continue;
    FX.hitSpark(p.x, p.y, Math.atan2(p.vy, p.vx), true); Sfx.play('hit', e.pan(), 1); FX.stop(0.05); if (p.crit) critFX(e.cx, e.cy - 20, p.dmg);
    if (p.pull) { e.hurt(p.dmg, 0, -120, { stun: 1.1, noScale: true }); if (e.hp <= 0) G.kill(e, cap); land(e.x - Math.sign(e.x - cap.x) * 30, e.y - 10); return; }
    // yank: the lighter the foe, the harder it flies to the captain's feet
    const dx = cap.x - e.x, heavy = (e.stats.heavy || 1) > 2.5 ? 0.35 : 1;
    e.hurt(p.dmg, Math.sign(dx) * clamp(Math.abs(dx) * 1.5, 380, 1150) * heavy, (-420 - Math.min(320, Math.abs(dx) * 0.3)) * heavy, { stun: 0.9, noScale: true });
    tether(cap, e, 0.28); FX.text(e.x, e.y - 90, '拽！', '#8ff8ec', 18, 0.6);
    if (e.hp <= 0) G.kill(e, cap); p.dead = true; return;
  }
  for (const h of G.hawks) {
    if (h.dead || Math.hypot(h.x - p.x, h.y - p.y) > (h.r || 16) + 6) continue;
    h.hurt(p.dmg, Math.sign(p.vx) || 1); if (h.yank) h.yank(cap); else { h.vx = Math.sign(cap.x - h.x) * 520; h.vy = 260; }
    tether(cap, h, 0.28); Sfx.play('hit', 0, 1);
    if (p.pull) land(h.x, h.y); else p.dead = true; return;
  }
  for (const tn of G.tentacles) { const q = tn.hitPoint(p.x, p.y, 24); if (q) { tn.damage(p.dmg, G); FX.hitSpark(q.x, q.y, 0, true); land(q.x, q.y - 30); return; } }
  if (G.kraken && G.kraken.eyeHit(p.x, p.y, 12)) { G.kraken.hitEye(p.dmg, G); land(p.x, p.y); return; }
  if (G.boss && G.boss.hitAt(p.x, p.y, p.dmg, G, 'bolt')) { if (p.crit) critFX(p.x, p.y - 20, p.dmg); land(p.x, p.y + 20); return; }
  for (const s of G.ships) {
    if (s.sunk || s === cap.ship || (s === G.player && !p.pull)) continue; // never snag the deck you stand on
    const lo = s.toLocal(p.x, p.y);
    if (Math.abs(lo.x) < s.L && lo.y > s.deckY(clamp(lo.x, -s.walk, s.walk)) - 8 && lo.y < 40) {
      const lx = clamp(lo.x, -s.walk + 8, s.walk - 8), q = s.toWorld(lx, s.deckY(lx));
      if (!p.pull && s !== G.player && !s.bossShip) { s.damage(p.dmg * 0.5, lo.x); if (s.hull <= 0) G.shipSinks(s); }
      FX.splinters(p.x, p.y, 6); Sfx.play('wood', 0, 0.7); land(q.x, q.y - 4); return;
    }
  }
}
PROJ_DRAW.harpoon = (ctx, p, bx, by) => {
  const cap = p.owner, sh = cap.shoulderWorld(); ropeLine(ctx, sh.x, sh.y, p.x - Math.cos(p.a) * 30, p.y - Math.sin(p.a) * 30, 0.02);
  const img = SPR[wSprite('harpoon')]; blitRot(ctx, img, bx, by, p.a - HALF_PI, 2, img.height - 1);
  if (p.pull && Math.random() < 0.7) FX.burst(p.x, p.y, { n: 1, speed: 30, size: 1, color: 'g2', grav: 0, life: 0.3, water: false });
};
PROJ_DRAW.mjolnir = (ctx, p, bx, by) => { const img = SPR[WSPR.hammer + (wTier('hammer') ? '_t' + wTier('hammer') : '')]; blitRot(ctx, inkOutline(img, img.width, img.height), bx, by, p.spin || 0, 6, 12); if (Math.floor(G.t * 20) % 3 === 0) P.ring(ctx, bx, by, 9, C.b4); };

/* ---------------- the glow of rune steel, the lightning and ropes drawn over the scene ---------------- */
{
  const up = Captain.prototype.update;
  Captain.prototype.update = function (dt, G) {
    up.call(this, dt, G);
    if (!(this.busyT > 0) || !G.hammerOut) this.busyT = 0;
    const k = this.weapon, t = wTier(k);
    if (t === 3 && G.state !== 'title' && !this.water) {
      const tip = this.tipWorld(), col = { axe: [255, 150, 60], hammer: [150, 200, 255] }[k] || [110, 255, 230];
      FX.light(tip.x, tip.y, 90, col, 0.8);
      if (Math.random() < 0.18) FX.burst(tip.x, tip.y, { n: 1, speed: 30, size: 1, color: k === 'axe' ? 'f5' : k === 'hammer' ? 'b4' : 'g2', grav: -40, life: 0.4, kind: 'ember', water: false });
    }
  };
}
Object.assign(G, {
  zaps: [], tethers: [],
  updateArms(dt) {
    Quakes.update(dt, this);
    for (const z of this.zaps) z.t -= dt; this.zaps = this.zaps.filter((z) => z.t > 0);
    for (const r of this.tethers) r.t -= dt; this.tethers = this.tethers.filter((r) => r.t > 0 && !(r.to.dead && r.to.water));
  },
  drawArms(ctx, t) {
    Quakes.draw(ctx, t);
    for (const r of this.tethers) { const a = r.from.shoulderWorld ? r.from.shoulderWorld() : r.from, b = r.to.cx !== undefined ? { x: r.to.cx, y: r.to.cy } : r.to; ropeLine(ctx, a.x, a.y, b.x, b.y, 0.01); P.dot(ctx, Cam.bx(b.x), Cam.by(b.y), C.g2, 2); }
    for (const z of this.zaps) {
      const n = Math.max(3, Math.round(Math.hypot(z.x2 - z.x1, z.y2 - z.y1) / 26)), pts = [];
      for (let i = 0; i <= n; i++) { const u = i / n, j = i === 0 || i === n ? 0 : (hash1(i * 7.1 + z.seed + Math.floor(this.t * 30)) - 0.5) * (z.big ? 44 : 26); pts.push([Cam.bx(lerp(z.x1, z.x2, u) + j), Cam.by(lerp(z.y1, z.y2, u) + j * 0.4)]); }
      for (let i = 1; i < pts.length; i++) P.line(ctx, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], C[z.big ? 'n8' : 'b4'], z.big ? 3 : 2);
      for (let i = 1; i < pts.length; i++) P.line(ctx, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], C.white, 1);
      FX.light(z.x2, z.y2, z.big ? 240 : 120, [180, 210, 255], z.big ? 1.4 : 0.8);
    }
  },
});

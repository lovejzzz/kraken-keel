'use strict';
/* Chapter 2 — 冰封北海, the Frozen North. Frost witches ice the deck, powder monkeys carry lit kegs, falconers send hawks,
   an ice troll shakes the whole ship, and at the end a frost wyrm coils around the longship. */

/* ---------------- the cast ---------------- */
sprite('head_witch', ['....wwwww....', '...wWWWWWw...', '..wWWWWWWWw..', '.wWWwwwwwWw..', '.wWwffffgf...', '.wWwffffff...', '.wWwfffFff...', '.wWwffffff...', '..wwwffff....', '...ww.fff....', '....w........', '.............'],
  { w: 'b2', W: 'b4', f: 'n8', F: 'n7', g: 'g2' });
sprite('torso_witch', ['....wwwwww....', '..wwWWWWWWww..', '.wWWWWbWWWWWw.', '.wWWWbbbWWWWw.', '.wWWWWbWWWWWw.', '.wWWWWWWWWWWw.', '.wBBBBBBBBBBw.', '.wWWWWWWWWWWw.', '.wWWWWWWWWWWw.', '.wWWWWWWWWWWw.', '.wwWWWWWWWWww.', '..wwwwwwwwww..'],
  { w: 'b1', W: 'b3', b: 'n7', B: 'n5' });
sprite('staff_ice', ['.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.g.', 'gGg', 'GgG', '.G.'], { w: 'w3', g: 'n8', G: 'g2' });
sprite('head_troll', ['.i.i.i.i.....', 'iIiIiIiIi....', '.ggggggggg...', 'gGGGGGGGGGg..', 'gGGGkkGGGeg..', 'gGGGGGGGGGGg.', 'gGGGGGGGGGGGg', 'gGGmmGGGGmm..', '.gGmwGGGGwm..', '..gGGGGGGG...', '...ggggggg...', '.............'],
  { i: 'n8', I: 'b4', g: 'n5', G: 'n6', k: 'n4', e: 'g2', m: 'n4', w: 'b4' });
sprite('torso_troll', ['...gggggggg...', '.gGGGGGGGGGGg.', 'gGGfFfFfFGGGGg', 'gGfFFFFFFfGGGg', 'gGFFFFFFFFGGGg', 'gGfFFFFFFfGGGg', 'gGGFFFFFFGGGGg', '.gBBBBBBBBBBg.', '.gTTTTTTTTTTg.', '.gTTtTTTTtTTg.', '.gTTT....TTTg.', '.gTT......TTg.'],
  { g: 'n5', G: 'n6', f: 'w3', F: 'w5', B: 'w1', T: 'n4', t: 'n3' });
sprite('club', ['..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '.iii.', 'iIIIi', 'iIWIi', 'iIIIi', 'iIWIi', 'iIIIi', 'iIIIi', '.iii.'], { w: 'w4', i: 'n6', I: 'n8', W: 'b4' });
sprite('head_powder', ['.............', '...rrrrrr....', '..rRRRRRRrr..', '.rRRRRRRRR.r.', '.ssssssgGgs..', '.ssssssgGgs..', '.sssssssss...', '.ssskkkkss...', '..sswwwws....', '...ssssss....', '....sss......', '.............'],
  { r: 'r3', R: 'r4', s: 's2', g: 'm2', G: 'n8', k: 'ink', w: 'b4' });
sprite('torso_powder', ['....cccccc....', '..ccWBWBWBcc..', '.cWBWBWBWBWBc.', '.cBWBWBWBWBWc.', '.cWBWBWBWBWBc.', '.cBWBWBWBWBWc.', '.cWBWBWBWBWBc.', '.cRRRRRRRRRRc.', '.cTTTTTTTTTTc.', '.cTTtTTTTtTTc.', '.cTTT....TTTc.', '.cTT......TTc.'],
  { c: 's1', W: 'b3', B: 'n5', R: 'r3', T: 'w3', t: 'w2' });
sprite('barrel', ['...f..', '..fY..', '.wwww.', 'wWkWWw', 'wWWWWw', 'wmmmmw', 'wWWWWw', 'wWkWWw', '.wwww.'], { f: 'f3', Y: 'f5', w: 'w1', W: 'w4', k: 'w2', m: 'm2' });
sprite('head_falcon', ['.....ff......', '....fFf......', '...ccccc.....', '..cCCCCCc....', '.ccccccccc...', '.sssssssse...', '.sssssssss...', '.sssssssSs...', '.bbsssssss...', '..bbbbbbb....', '...bbbbb.....', '.............'],
  { f: 'r4', F: 'f5', c: 'w3', C: 'w5', s: 's2', S: 's1', e: 'ink', b: 'w2' });
sprite('torso_falcon', ['....llllll....', '..llLLLLLLll..', '.lLLLLLLLLLLl.', '.lLLdLLLLdLLl.', '.lLLLLLLLLLLl.', '.lLLdLLLLdLLl.', '.lLLLLLLLLLLl.', '.lBBBBBBByBBl.', '.lTTTTTTTTTTl.', '.lTTtTTTTtTTl.', '.lTTT....TTTl.', '.lTT......TTl.'],
  { l: 'w2', L: 'w4', d: 'w3', B: 'w1', y: 'gold', T: 'd1', t: 'd0' });
sprite('glove', ['.ll.', 'lLLl', 'lLLl', 'lLLl', '.ll.'], { l: 'w2', L: 'w5' });
sprite('hawk_up', ['..bb.........', '..bBb........', '...bBb.......', '....bBbb.yy..', 'bb..bBBBBbyk.', '.bbbBBBBBBb..', '...bbbbbbb...', '.....y.y.....'], { b: 'w2', B: 'w5', y: 'f5', k: 'ink' });
sprite('hawk_dn', ['.............', '.........yy..', 'bb..bbbbbbyk.', '.bbbBBBBBBb..', '...bBBBbbb...', '...bBb.......', '..bBb........', '..bb.........'], { b: 'w2', B: 'w5', y: 'f5', k: 'ink' });
sprite('icicle', ['wWw', 'wWw', 'wWw', '.W.', '.W.', '.w.', '.w.', '.w.'], { w: 'n8', W: 'b4' });
sprite('n_wyrm', ['h.........h.', '.h..nnn..h..', '..nnNNNnn...', '.nNNNNNNNn..', 'nNNgNNNNNNn.', 'nNNNNNNNNNNn', '.nNNNnnnnnn.', '..nwnwnwn...', '...nNNNn....', '....nnn.....', '............', '............'], { h: 'b3', n: 'n5', N: 'n7', g: 'g2', w: 'b4' });

Object.assign(STATS, {
  witch: { hp: 52, dmg: 8, speed: 140, reach: 60, wind: 0.5, ranged: true, shot: 'ice' },
  troll: { hp: 330, dmg: 22, speed: 92, reach: 104, wind: 0.95, heavy: 3.4, style: 'troll', elite: true, guard: 0 },
  powder: { hp: 36, dmg: 32, speed: 280, reach: 44, wind: 0.5, style: 'bomb' },
  falconer: { hp: 50, dmg: 6, speed: 140, reach: 60, wind: 0.5, ranged: true, shot: 'hawk' },
});
Object.assign(LOOK, { witch: { glow: [150, 230, 255] }, troll: { big: 1.9, draw: 2 }, powder: {}, falconer: {} });
Object.assign(LOOKP, {
  witch: { head: 'head_witch', torso: 'torso_witch', leg: 'b1', legD: 'b0', sleeve: 'b2', hand: 'n8', boot: 'boot', weapon: 'staff_ice', grip: [1, 4] },
  troll: { head: 'head_troll', torso: 'torso_troll', leg: 'n4', legD: 'n3', sleeve: 'n5', hand: 'n6', boot: 'boot_d', weapon: 'club', grip: [2, 1], twoHand: true },
  powder: { head: 'head_powder', torso: 'torso_powder', leg: 'w3', legD: 'w2', sleeve: 's2', hand: 's2', boot: 'boot', weapon: 'barrel', grip: [2, 1] },
  falconer: { head: 'head_falcon', torso: 'torso_falcon', leg: 'd1', legD: 'd0', sleeve: 'w3', hand: 's2', boot: 'boot', weapon: 'glove', grip: [1, 1] },
});
SHIPPAL.frost = { sail: ['b3', 'n6'], sailD: ['b1', 'n4'], shields: [['n5', 'b3'], ['b3', 'n5'], ['n7', 'b4']], wood: ['n1', 'n2', 'n3', 'n4', 'n5'], head: ['n3', 'n5', 'n7'], eye: 'g2' };

/* ---------------- encounters and the chapter-2 chart ---------------- */
Object.assign(ENC, {
  floes: { name: '浮冰海峡', sub: '冰上漂来小艇。霜巫会把甲板冻住，站在冰上会打滑。', rune: 'ᛁᛊ', storm: 0.35, reward: 80, script: [{ at: 1, skiff: 1, crew: ['raider', 'witch'] }, { at: 4, skiff: -1, crew: ['raider', 'raider'] }, { at: 13, skiff: 1, crew: ['witch', 'powder'] }] },
  powder: { name: '火药船', sub: '一整船抱着火药桶的疯子。把他们打回自己船上去炸！', rune: 'ᛒᛟᛟᛗ', storm: 0.45, reward: 95, script: [{ at: 1, ship: { side: 1, pal: 'frost', hull: 360, crew: ['powder', 'powder', 'archer', 'powder', 'raider'] } }, { at: 14, skiff: -1, crew: ['powder', 'powder'] }] },
  falcon: { name: '鹰崖', sub: '鹰猎手放出海鹰。Bon 会和它们在空中缠斗。', rune: 'ᚺᚨᚹᚲ', storm: 0.5, reward: 100, script: [{ at: 1, ship: { side: 1, pal: 'frost', hull: 360, crew: ['falconer', 'falconer', 'spear', 'raider'] } }, { at: 8, skiff: -1, crew: ['witch', 'raider'] }] },
  troll: { name: '冰巨魔', sub: '一头冰巨魔跳上了船。它砸地会震飞所有人——跳起来躲开。', rune: 'ᛏᚱᛟᛚ', storm: 0.55, reward: 110, script: [{ at: 1, ship: { side: 1, pal: 'frost', hull: 400, crew: ['troll', 'witch', 'raider', 'archer'] } }, { at: 10, skiff: -1, crew: ['powder', 'raider'] }] },
  blizzard: { name: '暴风雪', sub: '风雪里什么都看不清。两边都有人。', rune: 'ᛊᚾᛟ', storm: 1, fog: 0.6, reward: 105, script: [{ at: 1, skiff: 1, crew: ['witch', 'raider'] }, { at: 3, skiff: -1, crew: ['falconer', 'powder'] }, { at: 9, ship: { side: 1, pal: 'frost', hull: 340, crew: ['raider', 'witch', 'spear', 'powder'] } }] },
  avalanche: { name: '雪崩', sub: '两头冰巨魔，一个鹰猎手。精英敌人。', rune: 'ᚨᚹᚨᛚ', storm: 0.6, reward: 130, script: [{ at: 1, ship: { side: 1, pal: 'frost', hull: 420, crew: ['troll', 'falconer', 'troll', 'raider'] } }, { at: 12, skiff: -1, crew: ['powder', 'witch'] }] },
  jarl: { name: '冰霜首领', sub: '北海的首领带着巨魔、霜巫和火药猴。精英敌人。', rune: 'ᛃᚨᚱᛚ', storm: 0.65, reward: 140, script: [{ at: 1, ship: { side: 1, pal: 'frost', hull: 440, crew: ['chieftain', 'troll', 'witch', 'powder'] } }, { at: 6, skiff: -1, crew: ['falconer', 'powder'] }] },
  wyrm: { name: '霜龙', sub: '冰海深处，一条巨龙醒了。', rune: 'ᚹᛁᚱᛗ', storm: 0.8, reward: 0, boss: true, script: [{ at: 2, wyrm: 1 }] },
});
const CHAPTERS = {
  1: { name: '峡湾', pool: FIGHT_POOL, elite: ELITE_POOL, boss: 'kraken', theme: 'sea', pal: 'raider', drop: 'cutlass', node: 'boss', ambush: 'skiffs', rune: 'ᚠᛃᛟᚱᛞ', col: '#8ff0ff',
    endTitle: '第一章 完', endText: '海妖沉回了海底。北方的冰海里，传来了龙吟……' },
  2: { name: '冰封北海', pool: [[], ['floes'], ['floes', 'powder', 'falcon'], ['powder', 'falcon', 'troll'], ['troll', 'blizzard', 'falcon'], ['blizzard', 'troll', 'powder']], elite: ['avalanche', 'jarl'], boss: 'wyrm', theme: 'ice', pal: 'frost', drop: 'scatter', node: 'wyrm', ambush: 'floes', rune: 'ᚾᛟᚱᛞ', col: '#bfe8ff',
    endTitle: '第二章 完', endText: '霜龙沉入冰海。南方的天边烧成了红色，火山醒了……', starter: [700, 12] },
};

/* ---------------- hawks ---------------- */
class Hawk {
  constructor(owner) { Object.assign(this, { x: owner.x, y: owner.y - 60, vx: owner.face * 200, vy: -300, hp: 22, max: 22, dead: false, state: 'circle', t: rand(0, 3), cd: 1.4, face: owner.face, flash: 0, owner, fall: 0 }); Sfx.play('squawk', owner.pan(), 0.5); }
  hurt(dmg, dir = 1) { if (this.dead) return; this.hp -= dmg; this.flash = 1; this.vx += dir * 320; this.vy -= 160; FX.burst(this.x, this.y, { n: 5, speed: 140, size: 1, color: 'w5', color2: 'w2', grav: 300, life: 0.6, water: false }); if (this.hp <= 0) { this.dead = true; G.stats.kills++; G.silver += 3; Coins.burst(this.x, this.y, 3, 0.5); Sfx.play('hit', 0, 0.8); } }
  update(dt, G) {
    this.t += dt; this.flash = Math.max(0, this.flash - dt * 6);
    if (this.dead) { this.fall += dt; this.vy += 1200 * dt; this.x += this.vx * dt; this.y += this.vy * dt; return; }
    const cap = G.captain, leave = G.state !== 'fight';
    const steer = (tx, ty, sp, k) => { const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy) || 1, v = Math.min(sp, d * 3); this.vx = damp(this.vx, (dx / d) * v, k, dt); this.vy = damp(this.vy, (dy / d) * v, k, dt); return d; };
    if (leave) { steer(this.x + this.face * 900, -600, 500, 2); if (this.y < Cam.viewT() - 60) this.gone = true; }
    else if (this.state === 'circle') { steer(cap.x + Math.sin(this.t * 1.6) * 110, cap.y - 150 + Math.cos(this.t * 2.3) * 20, 420, 3); this.cd -= dt; if (this.cd <= 0 && cap.down <= 0) { this.state = 'dive'; this.dt0 = 0; Sfx.play('squawk', 0, 0.4); } }
    else if (this.state === 'dive') {
      this.dt0 += dt; const d = steer(cap.cx, cap.cy, 760, 8);
      if (d < 18) { if (cap.iframes <= 0 && cap.dodge <= 0 && cap.hurt(STATS.falconer.dmg * (1 + G.step * 0.05), Math.sign(this.vx) * 140, -80, { stun: 0.1 })) { Sfx.play('hurt', cap.pan(), 0.6); UI.pulse('hurt'); } this.state = 'rise'; this.rt = 0.5; this.vy = -420; }
      else if (this.dt0 > 1.2) { this.state = 'rise'; this.rt = 0.4; }
    } else if (this.state === 'rise') { this.vy += 300 * dt; this.rt -= dt; if (this.rt <= 0) { this.state = 'circle'; this.cd = rand(1.8, 2.8); } }
    this.x += this.vx * dt; this.y += this.vy * dt; if (Math.abs(this.vx) > 30) this.face = Math.sign(this.vx);
  }
  draw(ctx) {
    const img = SPR[this.dead || this.state === 'dive' ? 'hawk_dn' : Math.floor(this.t * 12) % 2 ? 'hawk_up' : 'hawk_dn'], bx = Cam.bx(this.x), by = Cam.by(this.y), flip = this.face < 0;
    const o = inkOutline(img, img.width, img.height, this.flash > 0.5 ? C.white : C.ink);
    if (this.dead) blitRot(ctx, o, bx, by, this.fall * 8, 6, 4, flip); else blit(ctx, o, bx, by, flip, 6, 4);
  }
}

/* ---------------- chapter-2 hooks into the voyage ---------------- */
Object.assign(G, {
  chapter: 1, hawks: [], ices: [], floes: [], boss: null,
  startChapter(n) {
    this.chapter = n; this.step = (n - 1) * 6; this.map = SeaMap.generate(n); this.node = null; this.discount = 1;
    Sky.setTheme(CHAPTERS[n].theme); Sky.dawnTarget = 0; Sky.dawn = 0;
    const cap = this.captain, ps = this.player;
    this.enemies = []; this.ships = [ps]; this.tentacles = []; this.shots = []; this.kraken = null; this.boss = null; this.timers = []; this.crates = []; this.fires = []; this.ices = []; this.hawks = []; this.resetRealm();
    Coins.list = []; UI.coins = []; Waves.list = [];
    cap.hp = cap.max; cap.water = false; cap.down = 0; cap.frozen = 0; cap.carried = false; cap.land(ps, 0); ps.hull = ps.hullMax; ps.breaches = []; ps.sinking = 0; ps.sunk = false;
    for (const sl of ps.slots) if (sl.mod) sl.mod.hp = sl.mod.max;
    Bon.reset(); this.makeFloes();
    const first = this.map.layers[1][0]; this.map.at = first.id; first.visited = true; this.node = first;
    UI.screen = null; UI.paused = false; FX.timeScale = 1; this.startEncounter(first.enc);
    this.timers.push({ t: 0.1, f: () => this.banner(`第 ${n} 章`, CHAPTERS[n].name, CHAPTERS[n].col, 3.2, CHAPTERS[n].rune) });
  },
  makeFloes() { this.floes = []; if (Sky.theme !== 'ice') return; for (let i = 0; i < 9; i++) this.floes.push({ x0: rand(0, 3200), w: randi(10, 26), h: randi(3, 6), seed: rand(0, 9), far: Math.random() < 0.6 }); },
  drawFloes(ctx, far) {
    for (const f of this.floes) {
      if (f.far !== far) continue;
      const span = 3200, wx = Cam.x - span / 2 + ((((f.x0 - Sea.travel * (far ? 0.6 : 1)) % span) + span) % span), bx = Cam.bx(wx), by = Cam.by(Sea.height(wx)) - (far ? 1 : 0);
      if (bx < -40 || bx > Cam.BW + 40) continue;
      const w = far ? Math.round(f.w * 0.6) : f.w, h = far ? f.h - 1 : f.h;
      P.rect(ctx, bx - w / 2, by - h, w, h + 2, C.ink); P.rect(ctx, bx - w / 2 + 1, by - h + 1, w - 2, h + 1, C[far ? 'n7' : 'b3']); P.rect(ctx, bx - w / 2 + 1, by - h + 1, w - 2, 1, C[far ? 'n8' : 'b4']);
      if (!far) P.rect(ctx, bx - w / 2 + 2, by + 1, w - 4, 1, C.t7);
    }
  },
  /* frost witch: an ice orb lobbed at the captain; it freezes him, or glazes the deck where it lands */
  throwIce(e, cap) {
    const ps = this.player, sx = e.x, sy = e.y - 70, tl = clamp(ps.toLocal(cap.x, cap.y).x + rand(-30, 30), -ps.walk, ps.walk);
    const to = ps.toWorld(tl, ps.deckY(tl) - 20), T = clamp(Math.abs(to.x - sx) / 560, 0.55, 1.2);
    this.shots.push(new Projectile({ x: sx, y: sy, vx: (to.x - sx) / T, vy: (to.y - sy) / T - 0.5 * 700 * T, grav: 700, dmg: e.stats.dmg, team: 'enemy', kind: 'ice', life: 4 }));
    Sfx.play('chargeStart', e.pan(), 0.6);
  },
  releaseHawk(e) { if (this.hawks.filter((h) => h.owner === e && !h.dead).length >= 1) return; this.hawks.push(new Hawk(e)); },
  iceAt(lx, w = 44, t = 9) { this.ices.push({ lx, w, t, max: t, seed: rand(0, 9) }); },
  icyAt(lx) { for (const i of this.ices) if (Math.abs(lx - i.lx) < i.w) return true; return false; },
  freeze(cap, t) { if (cap.frozen > 0 || cap.iframes > 0) return; cap.frozen = t; cap.atk = null; cap.charging = false; FX.text(cap.x, cap.y - 90, '冻住了！狂按方向键', '#bfe8ff', 18, 1); Sfx.play('clang', cap.pan(), 0.6); },
  /* a powder keg goes off: hurts everyone near, the captain, raiders, hulls */
  explode(x, y, r, dmg, src) {
    Cam.shake(0.35); Sky.flash = Math.max(Sky.flash, 0.35); FX.stop(0.06); Sfx.play('crack', clamp((x - Cam.x) / 700, -1, 1), 1); Sfx.play('heavy', 0, 1); Sfx.play('fire', 0, 0.8);
    FX.burst(x, y, { n: 40, speed: 520, size: 2, color: 'f5', color2: 'f2', grav: 400, life: 0.7 }); FX.burst(x, y, { n: 14, speed: 120, size: 5, color: 'm1', grav: -60, life: 1.4, kind: 'smoke', water: false });
    FX.hitSpark(x, y, -HALF_PI, true); FX.light(x, y, 360, [255, 170, 80], 2);
    const cap = this.captain, dc = Math.hypot(cap.cx - x, cap.cy - y);
    if (dc < r && cap.down <= 0 && !cap.carried) { if (cap.hurt(dmg * (1 - dc / r * 0.5), Math.sign(cap.x - x || 1) * 520, -520, { stun: 0.4 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
    for (const e of this.enemies) { if (e === src || e.dead || e.water) continue; const d = Math.hypot(e.cx - x, e.cy - y); if (d < r) { e.hurt(dmg * 1.5 * (1 - d / r * 0.4), Math.sign(e.x - x || 1) * 620, -560, { stun: 0.7 }); if (e.hp <= 0) this.kill(e, cap); } }
    for (const h of this.hawks) if (!h.dead && Math.hypot(h.x - x, h.y - y) < r) h.hurt(dmg, Math.sign(h.x - x || 1));
    for (const s of this.ships) {
      if (s.sunk || s.bossShip) continue; const lo = s.toLocal(x, y);
      if (Math.abs(lo.x) < s.L && lo.y > s.deckY(lo.x) - 90 && lo.y < 40) { s.damage(dmg * (s === this.player ? 0.6 : 1.2), lo.x); if (s === this.player && Math.random() < 0.4) this.fireAt(clamp(lo.x, -s.walk, s.walk)); if (s !== this.player && s.hull <= 0) this.shipSinks(s); }
    }
  },
  updateChapter(dt) {
    // hawks
    for (const h of this.hawks) h.update(dt, this);
    this.hawks = this.hawks.filter((h) => !h.gone && !(h.dead && h.y > Sea.height(h.x) + 20));
    // cutlass bleed: a few points every half second while it lasts
    for (const e of this.enemies) {
      if (!(e.bleedT > 0) || e.dead) continue; e.bleedT -= dt; e.bleedTick = (e.bleedTick || 0) - dt;
      if (e.bleedTick <= 0) { e.bleedTick = 0.5; e.hp -= 2 * e.bleedN; e.flash = Math.max(e.flash, 0.25); FX.burst(e.x, e.y - 30 * e.scale, { n: 2 + e.bleedN, speed: 70, size: 1, color: 'r3', color2: 'r1', grav: 600, life: 0.5, water: false }); if (e.hp <= 0) this.kill(e, this.captain); }
      if (e.bleedT <= 0) e.bleedN = 0;
    }
    // powder monkeys: a lit fuse always goes off, wherever the monkey has been knocked to
    for (const e of this.enemies) {
      if (!(e.fuse > 0) || e.exploded) continue;
      e.fuse -= dt; if (Math.random() < 0.8) FX.burst(e.x + e.face * 6, e.y - 50 * e.scale, { n: 1, speed: 60, size: 1, color: 'f5', color2: 'f3', grav: -50, life: 0.25, water: false });
      if (Math.floor(e.fuse * 10) % 3 === 0) e.flash = Math.max(e.flash, 0.3);
      if (e.fuse <= 0) { e.exploded = true; this.explode(e.x, e.y - 20, 120, e.stats.dmg * (1 + this.step * 0.04), e); if (!e.dead) { e.hp = 0; this.kill(e, this.captain); } if (e.water) e.gone = true; }
    }
    // ice patches melt; a frozen captain
    for (const i of this.ices) i.t -= dt; this.ices = this.ices.filter((i) => i.t > 0);
    if (this.boss) this.boss.update(dt, this);
  },
  drawIces(ctx, t) {
    const ps = this.player;
    for (const i of this.ices) {
      const k = clamp(i.t / 1.5, 0, 1), n = Math.round(i.w * 2 * S);
      for (let j = 0; j < n; j++) { const lx = i.lx - i.w + j / S, p = ps.toWorld(lx, ps.deckY(lx)), bx = Cam.bx(p.x), by = Cam.by(p.y); if (k < 1 && hash1(j + i.seed) > k) continue; P.rect(ctx, bx, by - 1, 1, 2, C[hash1(j * 3.1 + i.seed) > 0.8 ? 'b4' : 'n8']); if (hash1(j + Math.floor(t * 3) + i.seed) > 0.97) P.dot(ctx, bx, by - 3, C.white); }
    }
    const cap = this.captain;
    if (cap.frozen > 0) {
      const bx = Cam.bx(cap.x), by = Cam.by(cap.y), w = 22, h = 44;
      ctx.globalAlpha = 0.55; P.rect(ctx, bx - w / 2, by - h, w, h, C.n8); ctx.globalAlpha = 1;
      P.rect(ctx, bx - w / 2, by - h, w, 1, C.b4); P.rect(ctx, bx - w / 2, by - h, 1, h, C.b4); P.rect(ctx, bx + w / 2 - 1, by - h, 1, h, C.n6); P.rect(ctx, bx - w / 2 + 3, by - h + 4, 2, 10, C.white);
    }
    for (const h of this.hawks) h.draw(ctx);
  },
});

/* ---------------- the sky of the north: icebergs, aurora, snow ---------------- */
Object.assign(Sky, {
  theme: 'sea', auroraK: 0, auroraRed: 0,
  setTheme(th) {
    this.theme = th;
    const cl = (seed, rough, heightV, sharp) => { const pts = []; for (let i = 0; i < 1200; i++) { const u = i / 1200; let v = Math.pow(fbm1(u * rough + seed, 5), sharp ? 1.1 : 1.6) * heightV * (0.6 + 0.4 * Math.sin(u * TAU * 2 + seed)); if (sharp) v *= 0.7 + 0.6 * Math.abs(Math.sin(u * rough * 1.7 + seed)); pts.push(v); } return pts; };
    this.cliffs = th === 'ice' ? [{ pts: cl(7.1, 30, 64, true), par: 0.1, col: ['n6', 'b3'] }, { pts: cl(15.3, 44, 38, true), par: 0.22, col: ['n5', 'n8'] }] : [{ pts: cl(4.2, 16, 70), par: 0.1, col: ['n3', 'n4'] }, { pts: cl(12.8, 26, 40), par: 0.22, col: ['n2', 'n3'] }];
    G.makeFloes && G.makeFloes();
  },
  drawAurora(ctx) {
    const AC = { ice: [[90, 255, 170], [80, 220, 255], [190, 120, 255]], hel: [[90, 255, 170], [120, 255, 220], [60, 200, 150]], ragnarok: [[255, 90, 60], [255, 170, 80], [200, 60, 120]] }[this.theme]; if (!AC) return;
    const W = Cam.BW, hz = Math.max(1, Cam.by(-250)), t = G.t, boost = 1 + this.auroraK, red = this.auroraRed;
    const cols = AC;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      const c = mixc(cols[i], [255, 70, 90], red);
      for (let x = 0; x < W; x += 2) {
        const y = hz * 0.08 + i * 12 + Math.sin(x * 0.018 + t * 0.25 + i * 2) * 11 + Math.sin(x * 0.047 - t * 0.4 + i) * 5;
        const a = (0.07 + 0.05 * Math.sin(x * 0.03 + t * 0.7 + i * 1.3)) * boost;
        ctx.fillStyle = rgba(c[0], c[1], c[2], a); ctx.fillRect(x, Math.round(y), 2, 16 + i * 4);
        ctx.fillStyle = rgba(c[0], c[1], c[2], a * 0.5); ctx.fillRect(x, Math.round(y) + 16 + i * 4, 2, 10);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  },
  drawSnow(ctx, dt, storm, wind) {
    const W = Cam.BW, H = Cam.BH, n = Math.floor(this.rain.length * clamp(0.25 + storm * 0.75, 0, 1));
    for (let i = 0; i < n; i++) {
      const r = this.rain[i];
      r.y += dt * (0.12 + r.z * 0.22 + storm * 0.2); r.x += dt * (wind * 0.00012 * r.z + Math.sin(G.t * 1.3 + i) * 0.01);
      if (r.y > 1) { r.y -= 1; r.x = Math.random(); }
      r.x = ((r.x % 1) + 1) % 1;
      const x = Math.round(r.x * W), y = Math.round(r.y * H);
      ctx.fillStyle = C[r.z > 0.75 ? 'white' : r.z > 0.45 ? 'b4' : 'n8']; ctx.fillRect(x, y, r.z > 0.85 ? 2 : 1, r.z > 0.85 ? 2 : 1);
    }
  },
});

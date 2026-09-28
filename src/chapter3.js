'use strict';
/* Chapter 3 — 火山群岛, the Fire Isles. Fire priests rain burning pitch on marked planks, obsidian guards turn blades back on
   whoever strikes their shields, lava golems leave the deck smouldering and burst when they fall. At the end the fire giant
   Surtr rises half out of the sea: his flaming sword sends a blade of fire low (jump) or high (brace), his fist slams the deck
   and sticks there, he hurls lava boulders, and in his last third the volcano behind him erupts. */

/* ---------------- the cast ---------------- */
sprite('head_priest', ['....rrrrr....', '...rRRRRRr...', '..rRRRRRRRr..', '.rRRrrrrrRr..', '.rRrkkkkyk...', '.rRrkkkkkk...', '.rRrkkkYkk...', '.rRrkkkkkk...', '..rrrkkkk....', '...rr.kkk....', '....r........', '.............'],
  { r: 'r1', R: 'r2', k: 'f0', y: 'f5', Y: 'f3' });
sprite('torso_priest', ['....rrrrrr....', '..rrRRRRRRrr..', '.rRRRRgRRRRRr.', '.rRRRgggRRRRr.', '.rRRRRgRRRRRr.', '.rRRRRRRRRRRr.', '.rGGGGGGGGGGr.', '.rRRRRRRRRRRr.', '.rRRfRRRfRRRr.', '.rRRRRRRRRRRr.', '.rrRRRRRRRRrr.', '..rrrrrrrrrr..'],
  { r: 'r1', R: 'r2', g: 'f5', G: 'gold', f: 'f3' });
sprite('staff_fire', ['.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.m.', 'mfm', 'fYf', '.f.'], { w: 'w2', m: 'm1', f: 'f3', Y: 'f6' });
sprite('head_obsidian', ['...mmmmmm....', '..mMMMMMMm...', '.mMMMMMMMMm..', '.mMMMMMMMMMm.', '.mmmmmmmfffm.', '.mMMMMMMMMm..', '.mMMmMMMMMm..', '.mMMMMMMMMm..', '.mmMMMMMMm...', '..mmmmmmm....', '.............', '.............'],
  { m: 'ink', M: 'k1', f: 'f4' });
sprite('torso_obsidian', ['....mmmmmm....', '..mmMMMMMMmm..', '.mMMMlMMMMMMm.', '.mMMMMlMMMMMm.', '.mMlMMMlMMMMm.', '.mMMlMMMMlMMm.', '.mMMMMMMMMMMm.', '.mBBBBBBBBBBm.', '.mTTTTTTTTTTm.', '.mTTlTTTTtTTm.', '.mTTT....TTTm.', '.mTT......TTm.'],
  { m: 'ink', M: 'k1', l: 'f3', B: 'm1', T: 'k0', t: 'f2' });
sprite('shield_obs', ['...rrrr...', '..rRRRRr..', '.rRlRRlRr.', 'rRRRllRRRr', 'rRRlLLlRRr', 'rRRlLLlRRr', 'rRRRllRRRr', '.rRlRRlRr.', '..rRRRRr..', '...rrrr...'], { r: 'ink', R: 'k1', l: 'f2', L: 'f5' });
sprite('blade_obs', ['.w.', '.w.', 'mmm', '.M.', '.M.', '.L.', '.M.', '.M.', '.L.', '.M.', '.M.', '.M.', '.L.', '.M.', '.m.'], { w: 'w1', m: 'ink', M: 'k1', L: 'f3' });
sprite('head_golem', ['...rrrrrrr...', '..rRRRRRRRr..', '.rRRlRRRRRRr.', 'rRRRRRRRlRRr.', 'rRRRRRRRRRRr.', 'rRffRRRRffRr.', 'rRRRRRRRRRRRr', 'rRRlLLLLLlRr.', '.rRRRRRRRRRr.', '..rRRRRRRRr..', '...rrrrrrr...', '.............'],
  { r: 'ink', R: 'k0', l: 'f2', L: 'f4', f: 'f6' });
sprite('torso_golem', ['...rrrrrrrr...', '.rRRRRRRRRRRr.', 'rRRlRRRRRlRRRr', 'rRRRlRRRlRRRRr', 'rRRRRLLLRRRRRr', 'rRRRLYYYLRRRRr', 'rRRRRLLLRRRRRr', '.rRRlRRRlRRRr.', '.rRRRRlRRRRRr.', '.rRRRRRRRRRRr.', '.rRRR....RRRr.', '.rRR......RRr.'],
  { r: 'ink', R: 'k0', l: 'f2', L: 'f4', Y: 'f6' });
sprite('fist_golem', ['.rrr.', 'rRLRr', 'rRRRr', 'rLRRr', '.rrr.'], { r: 'ink', R: 'k0', L: 'f3' });

Object.assign(STATS, {
  priest: { hp: 58, dmg: 13, speed: 130, reach: 60, wind: 0.5, ranged: true, shot: 'firerain', parts: true, value: 10 },
  obsidian: { hp: 120, dmg: 14, speed: 115, reach: 64, wind: 0.6, block: true, heavy: 1.6, elite: true, guard: 1, thorns: 7, value: 14 },
  golem: { hp: 420, dmg: 24, speed: 80, reach: 104, wind: 1.0, heavy: 3.6, style: 'troll', elite: true, guard: 0, value: 30,
    tick(G, e, dt) {
      if (e.ship !== G.player || e.air || Math.abs(e.vu) < 30) return;
      e.trailT = (e.trailT ?? 0.6) - dt; if (e.trailT <= 0) { e.trailT = 1.3; if (G.fires.filter((f) => f.golem).length < 4) G.fires.push({ lx: e.lx, w: 16, t: 3.2, seed: rand(0, 20), golem: true }); }
    },
    onDeath(G, e) {
      const x = e.x, y = e.y - 30; FX.text(x, y - 60, '要炸了！', '#ff9a4a', 20, 0.8); e.flash = 1;
      G.timers.push({ t: 0.55, f: () => G.explode(x, y, 130, 24 * (1 + G.step * 0.04), e) });
    } },
});
Object.assign(LOOK, { priest: { glow: [255, 150, 60] }, obsidian: {}, golem: { big: 1.75, draw: 2, glow: [255, 130, 50] } });
Object.assign(LOOKP, {
  priest: { head: 'head_priest', torso: 'torso_priest', leg: 'r1', legD: 'r0', sleeve: 'r2', hand: 's1', boot: 'boot', weapon: 'staff_fire', grip: [1, 4] },
  obsidian: { head: 'head_obsidian', torso: 'torso_obsidian', leg: 'k0', legD: 'ink', sleeve: 'k1', hand: 'k1', boot: 'boot_d', weapon: 'blade_obs', grip: [1, 1], shield: 'shield_obs' },
  golem: { head: 'head_golem', torso: 'torso_golem', leg: 'k0', legD: 'ink', sleeve: 'k0', hand: 'k0', boot: 'boot_d', weapon: 'fist_golem', grip: [2, 2], twoHand: true },
});
SHIPPAL.ember = { sail: ['k1', 'f2'], sailD: ['ink', 'f1'], shields: [['k1', 'f3'], ['f1', 'k0'], ['ink', 'f2'], ['k0', 'r2']], wood: ['ink', 'k0', 'k1', 'm0', 'm1'], head: ['k0', 'k1', 'f2'], eye: 'f5' };
sprite('n_surtr', ['..h......h..', '..hh.ff.hh..', '...hkkkkh...', '..kKKKKKKk..', '.kKfKKKKfKk.', '.kKKKKKKKKk.', '.kKKLLLLKKk.', '..kKKKKKKk..', '...ffkkff...', '..f.ffff.f..', '.....ff.....', '............'], { h: 'm1', k: 'ink', K: 'k1', f: 'f4', L: 'f6' });
NODE_TYPES.surtr = { icon: 'n_surtr', name: '火巨人', desc: '火山里走出来的巨人苏尔特。躲开他的火焰剑，砸他卡住的拳头。' };

/* ---------------- encounters and the chapter-3 chart ---------------- */
Object.assign(ENC, {
  embers: { name: '余烬海峡', sub: '火焰祭司会标记你脚下的甲板，火雨随后落下——看到标记就挪开。', rune: 'ᛖᛗᛒ', storm: 0.4, reward: 150, script: [{ at: 1, skiff: 1, crew: ['raider', 'priest'] }, { at: 5, skiff: -1, crew: ['raider', 'berserker'] }, { at: 14, skiff: 1, crew: ['priest', 'spear'] }] },
  pyre: { name: '火祭船', sub: '一整船祭司和弓手。先冲过去砍倒祭司。', rune: 'ᛈᛃᚱ', storm: 0.45, reward: 165, script: [{ at: 1, ship: { side: 1, pal: 'ember', hull: 420, crew: ['priest', 'priest', 'archer', 'raider', 'shield'] } }, { at: 12, skiff: -1, crew: ['raider', 'powder'] }] },
  obsidian: { name: '黑曜战舰', sub: '黑曜盾卫：正面砍盾会被反刺。用重击破防，或者绕到背后。', rune: 'ᛟᛒᛊ', storm: 0.5, reward: 175, script: [{ at: 1, ship: { side: 1, pal: 'ember', hull: 440, crew: ['obsidian', 'obsidian', 'priest', 'spear'] } }, { at: 10, skiff: -1, crew: ['raider', 'priest'] }] },
  golem: { name: '熔岩傀儡', sub: '熔岩傀儡走过的地方会着火，倒下时会爆炸——别站太近。', rune: 'ᚷᛟᛚ', storm: 0.5, reward: 180, script: [{ at: 1, ship: { side: -1, pal: 'ember', hull: 440, crew: ['golem', 'priest', 'raider', 'archer'] } }, { at: 12, skiff: 1, crew: ['powder', 'raider'] }] },
  ashstorm: { name: '火山灰暴', sub: '灰烬遮天，两边都有小艇扑上来。', rune: 'ᚨᛊᚺ', storm: 1, fog: 0.5, dark: 0.2, reward: 170, script: [{ at: 1, skiff: 1, crew: ['priest', 'raider'] }, { at: 3, skiff: -1, crew: ['berserker', 'raider'] }, { at: 10, rain: 4 }, { at: 14, skiff: 1, crew: ['obsidian', 'priest'] }, { at: 22, rain: 5 }] },
  lavafield: { name: '岩浆雨', sub: '火山在喷发，熔岩弹不停砸向甲板。看准落点。', rune: 'ᛚᚨᚹᚨ', storm: 0.6, reward: 185, script: [{ at: 1, rain: 4 }, { at: 3, ship: { side: 1, pal: 'ember', hull: 420, crew: ['raider', 'priest', 'obsidian', 'spear'] } }, { at: 9, rain: 5 }, { at: 17, rain: 6 }, { at: 20, skiff: -1, crew: ['priest', 'berserker'] }, { at: 26, rain: 6 }] },
  forge: { name: '锻炉首领', sub: '火岛的首领带着熔岩傀儡和黑曜盾卫。精英敌人。', rune: 'ᚠᛟᚱᚷ', storm: 0.6, reward: 200, script: [{ at: 1, ship: { side: 1, pal: 'ember', hull: 480, crew: ['chieftain', 'golem', 'obsidian', 'priest'] } }, { at: 8, skiff: -1, crew: ['priest', 'powder'] }] },
  twingolem: { name: '双傀儡', sub: '两头熔岩傀儡，甲板会烧成一片火海。精英敌人。', rune: 'ᛏᚹᛁᚾ', storm: 0.55, reward: 205, script: [{ at: 1, ship: { side: -1, pal: 'ember', hull: 480, crew: ['golem', 'priest', 'golem', 'archer'] } }, { at: 12, skiff: 1, crew: ['obsidian', 'raider'] }] },
  surtr: { name: '火巨人苏尔特', sub: '火山醒了，火巨人从海里站了起来。', rune: 'ᛊᚢᚱᛏ', storm: 0.8, reward: 0, boss: true, script: [{ at: 2, boss: 'surtr' }] },
});
CHAPTERS[3] = { name: '火山群岛', pool: [[], ['embers'], ['embers', 'pyre', 'obsidian'], ['pyre', 'obsidian', 'golem'], ['golem', 'ashstorm', 'lavafield'], ['lavafield', 'ashstorm', 'golem']], elite: ['forge', 'twingolem'], boss: 'surtr', theme: 'fire', pal: 'ember', drop: 'axe', node: 'surtr', ambush: 'embers', rune: 'ᛗᚢᛊᛈ', col: '#ffb070',
  endTitle: '第三章 完', endText: '苏尔特沉进了岩浆海。海风变冷，远处漂来一盏盏幽绿的灯……', starter: [2000, 24] };

/* ---------------- 火巨人苏尔特 ---------------- */
/* painted once: a basalt torso veined with lava, the head with its horned crown and burning eyes, the sword */
const SURTR = (() => {
  const tw = 150, th = 150, T = offscreen(tw, th), g = T.getContext('2d');
  const poly = (ctx, pts, col) => { ctx.fillStyle = C[col]; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]); ctx.closePath(); ctx.fill(); };
  poly(g, [[4, 30], [30, 8], [60, 2], [90, 2], [120, 8], [146, 30], [140, 60], [124, 76], [118, 150], [32, 150], [26, 76], [10, 60]], 'n2');
  poly(g, [[14, 30], [34, 14], [60, 8], [74, 10], [60, 22], [36, 34], [20, 50]], 'n4'); poly(g, [[136, 30], [116, 14], [90, 8], [76, 10], [90, 22], [114, 34], [130, 50]], 'n3');
  poly(g, [[46, 40], [72, 36], [74, 64], [50, 70], [40, 58]], 'n3'); poly(g, [[104, 40], [78, 36], [76, 64], [100, 70], [110, 58]], 'n3');
  poly(g, [[48, 42], [70, 38], [70, 44], [50, 48]], 'n4'); poly(g, [[102, 42], [80, 38], [80, 44], [100, 48]], 'n4');
  for (let y = 80; y < 140; y += 12) { poly(g, [[46, y], [104, y], [100, y + 8], [50, y + 8]], 'n3'); poly(g, [[48, y], [102, y], [101, y + 2], [49, y + 2]], 'n4'); }
  // mottled basalt, then veins of lava that will pulse
  for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) { if (g.getImageData(x, y, 1, 1).data[3] === 0) continue; const n = fbm2(x * 0.08, y * 0.08, 3); if (n > 0.68) { g.fillStyle = C.n4; g.fillRect(x, y, 1, 1); } else if (n < 0.3) { g.fillStyle = C.n1; g.fillRect(x, y, 1, 1); } }
  const V = offscreen(tw, th), v = V.getContext('2d');
  const vein = (x, y, a, len, d) => { for (let i = 0; i < len; i++) { x += Math.cos(a); y += Math.sin(a); a += (hash1(x * 3.1 + y) - 0.5) * 0.6; if (g.getImageData(Math.round(x), Math.round(y), 1, 1).data[3] === 0) return; v.fillStyle = C[i % 5 === 0 ? 'f5' : 'f3']; v.fillRect(Math.round(x), Math.round(y), 1, 1); if (d < 2 && hash1(i + x) > 0.93) vein(x, y, a + (hash1(y) > 0.5 ? 0.9 : -0.9), len * 0.5, d + 1); } };
  vein(75, 60, HALF_PI, 90, 0); vein(40, 30, 0.6, 50, 0); vein(110, 30, Math.PI - 0.6, 50, 0); vein(60, 90, 1.9, 40, 1); vein(90, 90, 1.2, 40, 1);
  // the molten heart
  v.fillStyle = C.f4; v.fillRect(70, 50, 10, 8); v.fillStyle = C.f6; v.fillRect(72, 52, 6, 4);
  const hw = 60, hh = 58, H = offscreen(hw, hh), h = H.getContext('2d');
  poly(h, [[8, 18], [16, 8], [30, 4], [44, 8], [52, 18], [54, 36], [46, 50], [30, 56], [14, 50], [6, 36]], 'n2'); poly(h, [[12, 18], [20, 10], [30, 7], [30, 20], [16, 28]], 'n4'); poly(h, [[30, 7], [42, 10], [48, 18], [44, 26], [30, 20]], 'n3');
  poly(h, [[8, 16], [0, 0], [14, 10]], 'm2'); poly(h, [[52, 16], [60, 0], [46, 10]], 'm2'); poly(h, [[22, 7], [26, -2], [30, 5]], 'm3'); poly(h, [[38, 7], [34, -2], [30, 5]], 'm3');
  poly(h, [[12, 20], [28, 18], [28, 22], [12, 24]], 'n1'); poly(h, [[48, 20], [32, 18], [32, 22], [48, 24]], 'n1');
  h.fillStyle = C.ink; h.fillRect(14, 23, 12, 6); h.fillRect(34, 23, 12, 6); h.fillStyle = C.f1; h.fillRect(22, 38, 16, 4); h.fillStyle = C.f3; h.fillRect(24, 39, 12, 2);
  const S_ = offscreen(16, 170), sg = S_.getContext('2d');
  sg.fillStyle = C.m0; sg.fillRect(5, 0, 6, 26); sg.fillStyle = C.gold; sg.fillRect(0, 24, 16, 4); sg.fillStyle = C.ink; sg.fillRect(3, 28, 10, 142);
  for (let y = 30; y < 168; y++) { const w = y > 150 ? Math.round((168 - y) / 3.5) : 5; sg.fillStyle = C.k1; sg.fillRect(8 - w, y, w * 2, 1); sg.fillStyle = C.f3; sg.fillRect(8 - w, y, 1, 1); sg.fillRect(7 + w, y, 1, 1); if (y % 9 === 0) { sg.fillStyle = C.f5; sg.fillRect(8, y, 1, 3); } }
  return { T, V, tw, th, H, hw, hh, S: S_ };
})();
class Surtr {
  constructor(G) {
    const hp = Math.round(6000 * (1 + (G.step - 17) * 0.05));
    Object.assign(this, { handK: 0, name: '火巨人苏尔特', icon: 'n_surtr', col: '#ffb070', bar: 'f3', intro: '跳过低处的火焰剑，扎稳躲高处的；砸他卡在甲板上的拳头', max: hp, hp, phase: 1, t: 0, st: 0, state: 'rise', side: 1, rise: 1, flash: 0, dying: 0, dead: false, nextAtk: 2.5, atkN: 0,
      sword: { a: -2.2, lvl: 0 }, fist: null, wave: null, hitCd: 0, eruptT: 0, headDrop: 0, x: 0, hx: 0, hy: 0 });
    Sfx.play('roar', 0, 1); Cam.shake(0.5); Sky.erupt = 0.8; this.place(G);
  }
  place(G) { const ps = G.player; this.x = ps.x + this.side * 410; }
  get exposed() { return this.state === 'stunned'; }
  /* shoulder, head and hand positions in the world */
  body() {
    const up = this.rise * 520 - this.headDrop * 150, x = this.x, sd = this.side, bob = Math.sin(this.t * 1.1) * 6;
    return { top: -300 + up + bob, near: { x: x - sd * 118, y: -246 + up + bob }, far: { x: x + sd * 118, y: -246 + up + bob }, head: { x: x - sd * 8 - sd * this.headDrop * 140, y: -330 + up + bob + this.headDrop * 40 } };
  }
  frame(G) { return [this.x - 160, this.x + 60]; }
  go(s) { this.state = s; this.st = 0; }
  update(dt, G) {
    this.t += dt; this.st += dt; this.flash = Math.max(0, this.flash - dt * 5); this.hitCd -= dt;
    const ps = G.player, cap = G.captain, spd = this.phase === 3 ? 1.35 : this.phase === 2 ? 1.15 : 1;
    this.x = damp(this.x, ps.x + this.side * 410, 1.5, dt);
    this.headDrop = damp(this.headDrop, this.state === 'stunned' ? 1 : 0, 3, dt); this.handK = damp(this.handK || 0, this.state === 'sweep' ? 1 : 0, this.state === 'sweep' ? 12 : 3, dt);
    if (this.dying) { this.dying += dt; this.rise = Math.min(1.2, this.rise + dt * 0.25); if (Math.random() < 0.6) this.crumble(); if (this.dying > 3 && !this.dead) { this.dead = true; this.hx = this.x; this.hy = -200; G.bossGone(this); } return; }
    // fire waves from the sword: a line of flame running over the deck, low or high
    if (this.wave) this.runWave(dt, G);
    if (this.fist) this.runFist(dt, G);
    if (this.phase === 3 && (this.eruptT -= dt) <= 0) { this.eruptT = 14; Sky.erupt = 1.6; G.banner('火山喷发！', '熔岩弹砸向整条船', '#ff8a4a', 1.8); Cam.shake(0.4); Sfx.play('roar', 0, 0.8); G.volley(9, 'fire', 14 + G.step * 1.4, 0.28); }
    switch (this.state) {
      case 'rise': this.rise = damp(this.rise, 0, 1.2, dt); if (this.st > 0.8 && this.st < 0.85) { Sfx.play('roar', 0, 1); Cam.shake(0.4); } if (this.st > 3) this.go('idle'); break;
      case 'idle': this.sword.a = damp(this.sword.a, -1.9, 3, dt); this.nextAtk -= dt * spd; if (this.nextAtk <= 0) this.pick(G); break;
      case 'sweep_tell': { const hi = this.sword.lvl === 1; this.sword.a = damp(this.sword.a, -1.25, 5, dt); if (this.st > 1.05 / spd) { this.go('sweep'); Sfx.play('swingBig', 0, 1); Sfx.play('fire', 0, 1); this.wave = { lx: this.side * (ps.walk + 40), hi, hit: new Set(), dir: -this.side }; } break; }
      case 'sweep': this.sword.a = damp(this.sword.a, this.sword.lvl === 1 ? -Math.PI + 0.2 : -Math.PI - 0.12, 16, dt); if (this.st > 0.7) { this.go('idle'); this.nextAtk = 1.8; } break;
      case 'fist_tell': if (this.st > 0.9 / spd) { this.go('fist'); Sfx.play('swingBig', 0, 1); } break;
      case 'fist': break; // runFist moves the state on
      case 'throw': if (this.st > 0.8) { this.go('idle'); this.nextAtk = 2; } break;
      case 'stunned': if (this.st > 4.5) { this.go('idle'); this.nextAtk = 1.5; Sfx.play('roar', 0, 0.7); } break;
    }
    if (this.hp <= this.max * 0.66 && this.phase === 1) { this.phase = 2; G.banner('苏尔特暴怒', '他的剑会连斩两次', '#ffb070', 2.2); Sfx.play('roar', 0, 1); Sky.surge(G); G.spawnSkiff(-this.side, ['priest', 'raider']); }
    if (this.hp <= this.max * 0.33 && this.phase === 2) { this.phase = 3; this.eruptT = 1; G.banner('火山苏醒', '整座火山都在喷发', '#ff6a4a', 2.2); Sfx.play('roar', 0, 1); Sky.surge(G); }
  }
  pick(G) {
    const cap = G.captain, ps = G.player; this.atkN++;
    const opts = ['sweep', 'sweep', 'fist', 'fist']; if (this.phase >= 2) opts.push('throw', 'sweep2');
    const a = pick(opts);
    if (a === 'sweep' || a === 'sweep2') { this.sword.lvl = Math.random() < 0.5 ? 1 : 0; this.again = a === 'sweep2'; this.go('sweep_tell'); FX.text(ps.x, ps.y - 170, this.sword.lvl ? '高 · 扎稳（S）！' : '低 · 跳！', this.sword.lvl ? '#9fe8ff' : '#ffd46a', 22, 1.1); Sfx.play('chargeStart', 0, 1); }
    else if (a === 'fist') { const lx = clamp(cap.ship === ps ? cap.lx : rand(-ps.walk, ps.walk), -ps.walk + 30, ps.walk - 30); this.fist = { lx, k: 0, stuck: 0, hp: Math.round(150 * (1 + G.step * 0.06)), max: Math.round(150 * (1 + G.step * 0.06)), flash: 0, hit: false }; this.go('fist_tell'); Sfx.play('roar', 0, 0.5); }
    else { this.go('throw'); Sfx.play('roar', 0, 0.6); G.volley(this.phase === 3 ? 5 : 4, 'rock', 16 + G.step * 1.5, 0.3); }
    this.nextAtk = this.phase === 3 ? 1.6 : this.phase === 2 ? 2.1 : 2.6;
  }
  runWave(dt, G) {
    const w = this.wave, ps = G.player, cap = G.captain; w.lx += w.dir * 980 * dt;
    const p = ps.toWorld(w.lx, ps.deckY(clamp(w.lx, -ps.walk, ps.walk)) - (w.hi ? 58 : 14));
    for (let i = 0; i < 3; i++) FX.burst(p.x, p.y + rand(-14, 14), { n: 1, angle: w.dir > 0 ? Math.PI : 0, spread: 0.4, speed: 120, size: 2, color: 'f5', color2: 'f3', grav: -60, life: 0.35, kind: 'ember', water: false });
    FX.light(p.x, p.y, 200, [255, 150, 60], 1.3);
    if (cap.ship === ps && !w.hit.has(cap) && Math.abs(cap.lx - w.lx) < 28 && cap.down <= 0) {
      const deck = ps.deckY(cap.lx), air = cap.air || cap.y < ps.toWorld(cap.lx, deck).y - 20;
      const caught = w.hi ? (!air && !cap.brace && cap.dodge <= 0) || (air && cap.y > ps.toWorld(cap.lx, deck).y - 120) : !air;
      w.hit.add(cap);
      if (caught && cap.hurt(20 * (1 + G.step * 0.05), w.dir * 420, -360, { stun: 0.4 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); }
      else if (!caught) FX.text(cap.x, cap.y - 90, w.hi ? '躲过了！' : '跳过了！', '#9fe8b0', 18, 0.7);
    }
    for (const e of G.enemies) if (!e.dead && !w.hit.has(e) && e.ship === ps && !e.air && Math.abs(e.lx - w.lx) < 28) { w.hit.add(e); e.hurt(26, w.dir * 400, -500, { stun: 0.8 }); Salvage.burnActor(e, 3); if (e.hp <= 0) G.kill(e, cap); }
    if (!w.hi) for (const m of G.modules()) if (!w.hit.has(m) && Math.abs(m.lx - w.lx) < 24) { w.hit.add(m); m.hp -= 16; m.flash = 1; if (m.hp <= 0) G.destroyModule(m); }
    if (Math.abs(w.lx) > ps.walk + 60 && Math.sign(w.lx) === w.dir) { this.wave = null; if (this.again && this.phase >= 2) { this.again = false; this.sword.lvl = 1 - this.sword.lvl; this.go('sweep_tell'); this.st = 0.45; FX.text(ps.x, ps.y - 170, this.sword.lvl ? '高 · 扎稳（S）！' : '低 · 跳！', this.sword.lvl ? '#9fe8ff' : '#ffd46a', 22, 0.9); } }
  }
  fistPoint(G) { const ps = G.player, f = this.fist; return ps.toWorld(f.lx, ps.deckY(f.lx) - 18); }
  runFist(dt, G) {
    const f = this.fist, ps = G.player, cap = G.captain; f.flash = Math.max(0, f.flash - dt * 5);
    if (this.state === 'fist_tell') { f.k = damp(f.k, 0.35, 4, dt); return; }
    if (this.state === 'fist' && !f.hit) {
      f.k = Math.min(1, f.k + dt * 6);
      if (f.k >= 1) {
        f.hit = true; const p = this.fistPoint(G); Cam.shake(0.5); Cam.kick(0.04); FX.stop(0.08); FX.splinters(p.x, p.y + 20, 26); Sfx.play('slam', 0, 1); Sfx.play('crack', 0, 1); ps.damage(20, f.lx); ps.va += -this.side * 0.4;
        FX.burst(p.x, p.y, { n: 24, speed: 320, size: 2, color: 'f5', color2: 'f3', grav: 600, life: 0.6 });
        if (cap.ship === ps && !cap.air && Math.abs(cap.lx - f.lx) < 64 && cap.down <= 0) { if (cap.hurt(30 * (1 + G.step * 0.05), Math.sign(cap.lx - f.lx || 1) * 520, -560, { stun: 0.5 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
        for (const e of G.enemies) if (!e.dead && e.ship === ps && Math.abs(e.lx - f.lx) < 70) { e.hurt(34, Math.sign(e.lx - f.lx || 1) * 500, -520, { stun: 0.7 }); if (e.hp <= 0) G.kill(e, cap); }
        FX.text(p.x, p.y - 110, '拳头卡住了！快打！', '#ffd46a', 20, 1.4);
      }
      return;
    }
    if (f.hit) { f.stuck += dt; if (f.stuck > 3 || this.state === 'stunned') { f.k = damp(f.k, 0, 5, dt); if (f.k < 0.05) { this.fist = null; if (this.state === 'fist') { this.go('idle'); this.nextAtk = 1.4; } } } }
  }
  /* arm IK: shoulder to target with a bent elbow */
  arm(s, tx, ty, L1, L2, up = -1) {
    const dx = tx - s.x, dy = ty - s.y, d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1), a = Math.atan2(dy, dx), cb = clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1), e = a + up * this.side * Math.acos(cb);
    const el = { x: s.x + Math.cos(e) * L1, y: s.y + Math.sin(e) * L1 }, h = { x: s.x + Math.cos(a) * d, y: s.y + Math.sin(a) * d };
    return { el, h };
  }
  limb(ctx, a, b, w, fl) { const ax = Cam.bx(a.x), ay = Cam.by(a.y), bx = Cam.bx(b.x), by = Cam.by(b.y); P.line(ctx, ax, ay, bx, by, C.f1, w + 4); P.line(ctx, ax, ay, bx, by, C[fl ? 'white' : 'n2'], w); P.line(ctx, ax, ay - Math.round(w * 0.25), bx, by - Math.round(w * 0.25), C[fl ? 'white' : 'n3'], Math.max(1, Math.round(w * 0.45))); const n = Math.round(Math.hypot(bx - ax, by - ay) / 7); for (let i = 1; i < n; i++) if (hash1(i * 3.3 + w) > 0.5) P.dot(ctx, lerp(ax, bx, i / n) + (hash1(i) - 0.5) * w * 0.5, lerp(ay, by, i / n), C[Math.floor(this.t * 4 + i) % 3 ? 'f3' : 'f5']); }
  draw(ctx, t, layer) {
    const B = this.body(), fl = this.flash > 0.5, sd = this.side;
    if (layer === 'back') {
      const swordFront = this.state === 'sweep_tell' || this.state === 'sweep', drawSword = () => {
      // the far arm with the sword, behind the body
      const sa = this.sword.a, hk = this.handK || 0, handFar = { x: B.far.x + sd * lerp(30, -90, hk), y: B.far.y + lerp(90, 40, hk) - (this.state === 'sweep_tell' ? 60 : 0) }, hx = Cam.bx(handFar.x), hy = Cam.by(handFar.y);
      this.limb(ctx, B.far, handFar, 16, fl);
      const swA = sd > 0 ? sa : -Math.PI - sa, sw = SURTR.S; blitRot(ctx, fl ? silhouette(sw, C.white) : sw, hx, hy, swA - HALF_PI, 8, 26);
      // the blade burns along its length
      for (let i = 0; i < 5; i++) { const r = 70 + i * 50; if (Math.random() < 0.5) FX.burst(handFar.x + Math.cos(swA) * r, handFar.y + Math.sin(swA) * r, { n: 1, speed: 40, size: 2, color: 'f5', color2: 'f3', grav: -80, life: 0.3, kind: 'ember', water: false }); }
      };
      if (!swordFront) drawSword();
      // torso and its veins of lava, pulsing
      const tx = Cam.bx(this.x) - (SURTR.tw >> 1), ty = Cam.by(B.top);
      ctx.save(); if (sd < 0) { ctx.translate(Cam.bx(this.x) * 2, 0); ctx.scale(-1, 1); }
      ctx.drawImage(inkOutline(fl ? silhouette(SURTR.T, C.white) : SURTR.T, SURTR.tw, SURTR.th, C.f2), tx, ty);
      ctx.globalAlpha = 0.55 + 0.45 * Math.sin(t * 2.2) ** 2 + (this.phase === 3 ? 0.3 : 0); ctx.drawImage(SURTR.V, tx, ty); ctx.globalAlpha = 1;
      ctx.restore();
      // head with the burning beard and crown
      const hx2 = Cam.bx(B.head.x), hy2 = Cam.by(B.head.y), hw = SURTR.hw, hh = SURTR.hh;
      ctx.save(); ctx.translate(hx2, hy2); if (sd < 0) ctx.scale(-1, 1); ctx.rotate(this.headDrop * 0.5 * -1); ctx.drawImage(inkOutline(fl ? silhouette(SURTR.H, C.white) : SURTR.H, hw, hh, C.f2), -hw / 2, -hh / 2); ctx.restore();
      const hot = this.exposed || this.dying, eye = C[hot ? (Math.floor(t * 10) % 2 ? 'white' : 'f6') : 'f5'];
      P.rect(ctx, hx2 - 12, hy2 - 6, 8, 3, eye); P.rect(ctx, hx2 + 5, hy2 - 6, 8, 3, eye);
      for (let i = 0; i < 7; i++) drawFlame(ctx, hx2 - 14 + i * 5, hy2 + 20 + (i % 2) * 3, t * 1.3, i * 2.3);
      for (let i = 0; i < 4; i++) drawFlame(ctx, hx2 - 14 + i * 9, hy2 - 26, t * 1.6, i * 4.1 + 1);
      if (this.exposed) { const r = 30 + Math.floor(t * 8) % 3; P.ring(ctx, hx2, hy2, r, C[Math.floor(t * 8) % 2 ? 'f5' : 'white']); }
      if (swordFront) drawSword();
    }
    const reaching = this.fist || this.state === 'throw';
    if ((layer === 'front' && reaching) || (layer === 'back' && !reaching)) {
      // the near arm: hanging by his side in the water, or slamming the deck
      let target;
      if (this.fist) { const p = this.fistPoint(G), up = { x: B.near.x - sd * 140, y: B.near.y - 120 }; target = { x: lerp(up.x, p.x, this.fist.k), y: lerp(up.y, p.y, this.fist.k) }; }
      else if (this.state === 'throw') target = { x: B.near.x - sd * 60, y: B.near.y - 160 + this.st * 60 };
      else target = { x: B.near.x - sd * 40, y: B.near.y + 560 + Math.sin(this.t * 1.3) * 10 };
      const A = this.arm(B.near, target.x, target.y, 290, 280, 1);
      this.limb(ctx, B.near, A.el, 22, fl); this.limb(ctx, A.el, A.h, 18, fl);
      const fx = Cam.bx(A.h.x), fy = Cam.by(A.h.y), ff = this.fist && this.fist.flash > 0.5;
      P.disc(ctx, fx, fy, 21, C.f1); P.disc(ctx, fx, fy, 19, C[ff || fl ? 'white' : 'n2']); P.disc(ctx, fx - 4, fy - 5, 12, C[ff || fl ? 'white' : 'n3']); for (let i = -2; i <= 2; i++) { P.rect(ctx, fx + i * 7 - 2, fy - 17, 5, 6, C.n4); P.dot(ctx, fx + i * 7, fy - 10, C.f3); }
      if (this.state === 'throw') { P.disc(ctx, fx, fy - 18, 9, C.f3); P.disc(ctx, fx - 1, fy - 19, 6, C.f5); }
      if (this.fist && this.fist.hit && this.fist.hp > 0) { const pulse = Math.floor(t * 6) % 2; P.ring(ctx, fx, fy, 18 + pulse, C[pulse ? 'f5' : 'f3']); for (let i = 0; i < 5; i++) P.dot(ctx, fx + Math.cos(i * 1.3 + t) * 8, fy + Math.sin(i * 1.3 + t) * 8, C.f5); P.rect(ctx, fx - 14, fy - 26, 28, 3, C.ink); P.rect(ctx, fx - 13, fy - 25, Math.round(26 * this.fist.hp / this.fist.max), 1, C.f5); }
    }
    if (layer === 'fx') {
      // tells on the deck: the height the fire blade will come at, the fist's shadow
      const ps = G.player;
      if (this.state === 'sweep_tell') { const on = Math.floor(t * 10) % 2, hi = this.sword.lvl === 1; for (let lx = -ps.walk; lx < ps.walk; lx += 8) { const p = ps.toWorld(lx, ps.deckY(lx) - (hi ? 58 : 14)); P.rect(ctx, Cam.bx(p.x), Cam.by(p.y) - 1, 5, 2, C[on ? 'white' : hi ? 'n8' : 'f5']); } const e = ps.toWorld(-this.side * (ps.walk + 20), ps.deckY(ps.walk) - (hi ? 58 : 14)); text(ctx, hi ? '扎稳' : '跳', Cam.bx(e.x), Cam.by(e.y) - 6, { size: 11, align: 'center', color: hi ? C.n8 : C.f5, bold: true, outline: true }); }
      if (this.wave) { const w = this.wave, p = ps.toWorld(w.lx, ps.deckY(clamp(w.lx, -ps.walk, ps.walk)) - (w.hi ? 58 : 14)), bx = Cam.bx(p.x), by = Cam.by(p.y); for (let i = -12; i <= 12; i++) { const bow = Math.round(Math.sqrt(1 - (i / 12) ** 2) * 6) * w.dir; P.dot(ctx, bx + bow, by + i, C.f6); P.dot(ctx, bx + bow - w.dir, by + i, C.f5); P.dot(ctx, bx + bow - w.dir * 2, by + i, C.f3); } P.rect(ctx, bx - w.dir * 40, by - 1, w.dir * 40, 2, C.f4); }
      if (this.fist && this.state === 'fist_tell') { const p = ps.toWorld(this.fist.lx, ps.deckY(this.fist.lx)), bx = Cam.bx(p.x), by = Cam.by(p.y), r = 10 + Math.floor(this.st * 14) % 5; P.ring(ctx, bx, by - 2, r, C.r4); P.rect(ctx, bx - 32, by - 1, 64, 1, C.r3); }
    }
  }
  crumble() { const B = this.body(), x = this.x + rand(-120, 120), y = B.top + rand(0, 260); FX.burst(x, y, { n: 6, speed: 260, size: 3, color: 'k1', color2: 'f3', grav: 700, life: 1 }); if (Math.random() < 0.3) Sfx.play('crack', 0, 0.3); Cam.shake(0.05); }
  targetPoint() {
    if (this.dying) return null;
    if (this.fist && this.fist.hit && this.fist.hp > 0) { const p = this.fistPoint(G); return { x: p.x, y: p.y, pri: 2.4 }; }
    const B = this.body(); return { x: B.head.x, y: B.head.y, pri: this.exposed ? 2.4 : 0.8 };
  }
  hitAt(x, y, dmg, G, src) {
    if (this.dying || this.state === 'rise') return false;
    const f = this.fist;
    if (f && f.hit && f.hp > 0) {
      const p = this.fistPoint(G);
      if (Math.hypot(x - p.x, y - p.y) < 56) {
        f.hp -= dmg; f.flash = 1; this.chip(dmg * 1.3, G); FX.burst(p.x, p.y, { n: 10, speed: 260, size: 2, color: 'f5', color2: 'k1', grav: 500, life: 0.5 }); FX.text(p.x + rand(-20, 20), p.y - 50, `${Math.round(dmg * 1.3)}`, '#ffd84a', 20, 0.7);
        if (f.hp <= 0) { Sfx.play('crack', 0, 1); Cam.shake(0.4); FX.text(p.x, p.y - 90, '苏尔特跪倒了！打他的头！', '#ffd84a', 22, 1.6); Sfx.play('roar', 0, 1); this.wave = null; this.go('stunned'); }
        return true;
      }
    }
    const B = this.body();
    if (Math.hypot(x - B.head.x, y - B.head.y) < 70) {
      const k = this.exposed ? 1.8 : 0.3; this.chip(dmg * k, G); this.flash = 1;
      if (!this.exposed && src === 'cap' && this.hitCd <= 0) { this.hitCd = 1.2; FX.text(B.head.x, B.head.y - 70, '岩皮太硬', '#c0a090', 16, 0.8); Sfx.play('clang', 0, 0.6); }
      else FX.text(B.head.x + rand(-20, 20), B.head.y - 60, `${Math.round(dmg * k)}`, this.exposed ? '#ffd84a' : '#ffb070', this.exposed ? 22 : 15, 0.7);
      return true;
    }
    if (Math.abs(x - this.x) < 140 && y > B.top && y < 60) { this.chip(dmg * 0.15, G); this.flash = 0.6; return true; }
    return false;
  }
  chip(d, G) {
    if (this.dying) return; this.hp -= d;
    if (this.hp <= 0) { this.hp = 0; this.dying = 0.001; this.fist = null; this.wave = null; FX.slowmo(0.25, 1.2); Cam.shake(0.6); Sfx.play('roar', 0, 1); G.banner('苏尔特倒下了', '火巨人沉进了岩浆海', '#ffb070', 3.5); Sky.erupt = 0; }
  }
  glow(L) {
    if (this.dying > 2) return; const B = this.body();
    L.push({ x: this.x, y: B.top + 60, r: 260, c: [255, 120, 50], i: 0.7 + (this.phase === 3 ? 0.3 : 0) }); L.push({ x: B.head.x, y: B.head.y, r: 160, c: [255, 170, 80], i: this.exposed ? 1.4 : 0.8 });
    if (this.fist && this.fist.hit) { const p = this.fistPoint(G); L.push({ x: p.x, y: p.y, r: 150, c: [255, 150, 60], i: 1 }); }
  }
}
BOSSES.surtr = Surtr;

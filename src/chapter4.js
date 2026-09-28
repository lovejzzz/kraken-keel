'use strict';
/* Chapter 4 — 幽冥海, the Sea of the Dead. Ghost archers fade out of reach and loose soul arrows that follow you, necromancers
   raise the fallen, valkyries dive out of the sky with spears. At the end comes Naglfar, the ship of the dead, with Hel on its
   stern: three soul lanterns shield her, its broadsides rain soul fire, draugr keep boarding, her beam rakes the deck; and in
   the last third she crosses over and fights on the captain's own deck. */

/* ---------------- the cast ---------------- */
sprite('head_wraith', ['....ddddd....', '...dDDDDDd...', '..dDDDDDDDd..', '.dDDdddddDd..', '.dDdbbbbgb...', '.dDdbkbbbb...', '.dDdbbbBbb...', '.dDdbkkkkb...', '..dddbbbb....', '...dd.bbb....', '....d........', '.............'],
  { d: 'd0', D: 'd1', b: 'b1', B: 'b0', k: 'ink', g: 'g2' });
sprite('torso_wraith', ['....dddddd....', '..ddDDDDDDdd..', '.dDDDDDDDDDDd.', '.dDDbDDDbDDDd.', '.dDDDDDDDDDDd.', '.dDDDbDbDDDDd.', '.dDDDDDDDDDDd.', '.dBBBBBBBBBBd.', '.dDDDDDDDDDDd.', '.dD.DD.DD.DDd.', '.d..D..D...d..', '..............'],
  { d: 'd0', D: 'd1', b: 'b0', B: 'm1' });
recolor('bow_bone', 'bow', { s: 'g2', w: 'b1' });
sprite('head_necro', ['..k.....k....', '..kk...kk....', '...kKKKk.....', '..bbbbbbbb...', '.bBBBBBBBBb..', '.bBkkBBkkBb..', '.bBkgBBkgBb..', '.bBBBBBBBBb..', '..bBkBkBkb...', '...bbbbbb....', '.............', '.............'],
  { k: 'k3', K: 'k5', b: 'b1', B: 'b3', g: 'k6' });
sprite('torso_necro', ['....kkkkkk....', '..kkKKKKKKkk..', '.kKKbKbKbKKKk.', '.kKKKbKbKKKKk.', '.kKKbKbKbKKKk.', '.kKKKKKKKKKKk.', '.kPPPPPPPPPPk.', '.kKKKKKKKKKKk.', '.kKKKKKKKKKKk.', '.kKKKKKKKKKKk.', '.kkKKKKKKKKkk.', '..kkkkkkkkkk..'],
  { k: 'k1', K: 'k2', b: 'b2', P: 'k5' });
sprite('staff_bone', ['.bbb.', 'bkbkb', '.bbb.', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..'], { b: 'b3', k: 'k5', w: 'b0' });

Object.assign(STATS, {
  wraith: { hp: 52, dmg: 10, speed: 140, reach: 60, wind: 0.5, ranged: true, shot: 'soul', undead: true, parts: true, value: 12,
    tick(G, e, dt) {
      // fade out of the world for a moment: no blow lands on a phased wraith
      if (e.phased > 0) { e.throwCd = Math.max(e.throwCd, 0.4); if (Math.random() < 0.3) FX.burst(e.x, e.y - rand(10, 60), { n: 1, speed: 20, size: 2, color: 'd2', grav: -40, life: 0.5, kind: 'mist', water: false }); return; }
      e.phaseCd = (e.phaseCd ?? rand(2, 4)) - dt;
      if (e.phaseCd <= 0 && e.stun <= 0) { e.phaseCd = rand(4, 6); e.phased = 1.5; FX.burst(e.x, e.y - 30, { n: 14, speed: 120, size: 2, color: 'd3', color2: 'g1', grav: -60, life: 0.6, kind: 'mist', water: false }); Sfx.play('wave', e.pan(), 0.3); }
    } },
  necro: { hp: 76, dmg: 9, speed: 120, reach: 60, wind: 0.5, ranged: true, shot: 'raise', parts: true, value: 16 },
});
Object.assign(LOOK, { wraith: { glow: [110, 255, 210] }, necro: { glow: [190, 120, 255] } });
Object.assign(LOOKP, {
  wraith: { head: 'head_wraith', torso: 'torso_wraith', leg: 'd1', legD: 'd0', sleeve: 'd1', hand: 'b1', boot: 'boot_d', weapon: 'bow_bone', grip: [10, 4] },
  necro: { head: 'head_necro', torso: 'torso_necro', leg: 'k1', legD: 'k0', sleeve: 'k2', hand: 'b2', boot: 'boot_d', weapon: 'staff_bone', grip: [2, 8] },
});
SHIPPAL.hel = { sail: ['k1', 'd2'], sailD: ['k0', 'd1'], shields: [['d1', 'k3'], ['k1', 'd2'], ['b0', 'd1']], wood: ['ink', 'd0', 'd1', 'k1', 'd2'], head: ['d0', 'd1', 'b1'], eye: 'g2' };
SHIPPAL.naglfar = { sail: ['k0', 'd1'], sailD: ['ink', 'd0'], shields: [['b1', 'd1'], ['d1', 'b2'], ['b0', 'k1']], wood: ['ink', 'd0', 'b0', 'b1', 'b2'], head: ['b0', 'b1', 'b3'], eye: 'g2' };
sprite('n_hel', ['...g.g.g....', '..gkkkkkg...', '..kbbbDDk...', '.kbbbbDDDk..', '.kbkbbDgDk..', '.kbbbbDDDk..', '.kbbkkDDDk..', '..kbbbDDk...', '..kkkkkkk...', '.kKKKKKKKk..', 'kKKKKKKKKKk.', '............'], { g: 'g2', k: 'ink', b: 'b3', D: 'd1', K: 'k2' });
NODE_TYPES.naglfar = { icon: 'n_hel', name: '死者之船', desc: '用死人指甲造的船纳吉尔法，冥界女王海拉站在船尾。先打碎三盏魂灯。' };

/* ---------------- encounters and the chapter-4 chart ---------------- */
Object.assign(ENC, {
  wisp: { name: '鬼火航道', sub: '幽灵弓手会隐身，隐身时打不中；他们的魂箭会追着你飞。', rune: 'ᚹᛁᛊᛈ', storm: 0.4, fog: 0.5, dark: 0.3, reward: 200, script: [{ at: 1, skiff: 1, crew: ['wraith', 'draugr'] }, { at: 4, skiff: -1, crew: ['draugr', 'draugrShield'] }, { at: 13, skiff: 1, crew: ['wraith', 'draugr'] }] },
  necrofleet: { name: '死灵船', sub: '死灵术士会把倒下的尸体重新唤醒。先杀术士。', rune: 'ᚾᛖᚲᚱ', storm: 0.45, dark: 0.35, reward: 215, script: [{ at: 1, ship: { side: 1, pal: 'hel', hull: 460, crew: ['necro', 'draugr', 'draugrShield', 'draugr', 'wraith'] } }, { at: 12, skiff: -1, crew: ['draugr', 'draugr'] }] },
  valk: { name: '女武神', sub: '女武神从天上俯冲下来：看到红圈就躲开，她落地时最好打。', rune: 'ᚹᚨᛚᚲ', storm: 0.5, dark: 0.25, reward: 220, script: [{ at: 1, fly: ['valkyrie'] }, { at: 3, skiff: 1, crew: ['draugr', 'wraith'] }, { at: 12, fly: ['valkyrie'] }, { at: 16, skiff: -1, crew: ['draugrShield', 'draugr'] }] },
  wraiths: { name: '幽灵弓阵', sub: '一整船幽灵弓手。魂箭会拐弯，用翻滚或盾墙挡。', rune: 'ᚨᚱᚲ', storm: 0.45, fog: 0.4, dark: 0.35, reward: 225, script: [{ at: 1, ship: { side: -1, pal: 'hel', hull: 460, crew: ['wraith', 'wraith', 'draugrShield', 'wraith', 'draugr'] } }, { at: 10, skiff: 1, crew: ['draugr', 'draugr'] }] },
  drowned4: { name: '溺亡之海', sub: '溺死的人从水里爬上来，术士在远处唤醒他们。', rune: 'ᛞᚱᛟᚹᚾ', storm: 0.7, dark: 0.4, reward: 220, script: [{ at: 1, climb: 3 }, { at: 3, ship: { side: 1, pal: 'hel', hull: 440, crew: ['necro', 'draugr', 'wraith', 'draugr'] } }, { at: 10, climb: 3 }, { at: 18, climb: 3 }, { at: 22, rain: 4, kind: 'soul' }] },
  mistgrave: { name: '雾中墓场', sub: '浓雾里什么都有：女武神、弓手、亡灵。', rune: 'ᛗᛁᛊᛏ', storm: 0.6, fog: 1, dark: 0.4, reward: 230, script: [{ at: 1, skiff: 1, crew: ['wraith', 'draugr'] }, { at: 4, fly: ['valkyrie'] }, { at: 8, skiff: -1, crew: ['necro', 'draugrShield'] }, { at: 15, skiff: 1, crew: ['draugr', 'wraith', 'draugr'] }] },
  helguard: { name: '冥府卫队', sub: '冥府的将军带着术士和盾卫，女武神在头顶。精英敌人。', rune: 'ᚺᛖᛚ', storm: 0.6, dark: 0.4, reward: 250, script: [{ at: 1, ship: { side: 1, pal: 'hel', hull: 500, crew: ['chieftain', 'necro', 'draugrShield', 'draugrShield', 'wraith'] } }, { at: 6, fly: ['valkyrie'] }] },
  valkhost: { name: '女武神之群', sub: '三个女武神一起俯冲，还有弓手在船上掩护。精英敌人。', rune: 'ᚹᚨᛚᚺ', storm: 0.55, dark: 0.3, reward: 255, script: [{ at: 1, fly: ['valkyrie', 'valkyrie'] }, { at: 4, ship: { side: -1, pal: 'hel', hull: 460, crew: ['wraith', 'wraith', 'draugr'] } }, { at: 12, fly: ['valkyrie'] }] },
  naglfar: { name: '死者之船', sub: '纳吉尔法从雾里驶出，船尾站着海拉。', rune: 'ᚾᚨᚷᛚ', storm: 0.7, fog: 0.3, dark: 0.35, reward: 0, boss: true, script: [{ at: 2, boss: 'naglfar' }] },
});
CHAPTERS[4] = { name: '幽冥海', pool: [[], ['wisp'], ['wisp', 'necrofleet', 'valk'], ['necrofleet', 'valk', 'wraiths'], ['wraiths', 'drowned4', 'mistgrave'], ['mistgrave', 'drowned4', 'valk']], elite: ['helguard', 'valkhost'], boss: 'naglfar', theme: 'hel', pal: 'hel', drop: 'harpoon', node: 'naglfar', ambush: 'wisp', rune: 'ᚺᛖᛚ', col: '#8ff8ec',
  endTitle: '第四章 完', endText: '纳吉尔法沉了，海拉回到了冥界。天空裂开，狼在嚎叫——诸神黄昏来了……', starter: [3200, 32] };

/* ---------------- 死者之船纳吉尔法 and 海拉 ---------------- */
sprite('hel_body', [
  '......g.g.g.......', '.....gkkkkkg......', '.....kbbbbDDk.....', '....kbbbbbDDDk....', '....kbkbbbDgDk....', '....kbbbbbDDDk....', '....kbbkkkDDDk....', '.....kbbbbDDk.....', '......kkkkkk......', '....kKKKKKKKKk....', '...kKKKKKKKKKKk...', '..kKKKKbKbKKKKKk..',
  '..kKKKKKbKKKKKKk..', '..kKKKKKKKKKKKKk..', '..kKKKKKKKKKKKKk..', '..kKKKKGGGGKKKKk..', '..kKKKKKKKKKKKKk..', '..kKKKKKKKKKKKKk..', '.kKKKKKKKKKKKKKKk.', '.kKKKKKKKKKKKKKKk.', '.kKKKKKKKKKKKKKKk.', 'kKKKKKKKKKKKKKKKKk', 'kKdKKdKKKdKKdKKdKk', 'kd.dd.dKd.dd.dd.dk', '.d..d..d..d..d..d.',
], { g: 'g2', k: 'ink', b: 'b3', D: 'd1', K: 'k2', G: 'g1', d: 'd2' });
sprite('hel_scythe', ['bbbbbbbbb....', '.......bBbb..', '..........bb.', '...........b.', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......', '.....w.......'], { b: 'b2', B: 'g2', w: 'k3' });
sprite('lantern', ['..mmm..', '.m...m.', 'mMmMmMm', 'mgGgGgm', 'mGgWgGm', 'mgGgGgm', 'mMmMmMm', '..m.m..'], { m: 'm0', M: 'm1', g: 'g1', G: 'g2', W: 'white' });
sprite('lantern_off', ['..mmm..', '.m...m.', 'mMmMmMm', 'mk.k.km', 'm.k.k.m', 'mk.k.km', 'mMmMmMm', '..m.m..'], { m: 'm0', M: 'm1', k: 'n1' });
class Naglfar {
  constructor(G) {
    const ps = G.player, side = 1, hp = Math.round(6400 * (1 + (G.step - 23) * 0.05));
    const s = new Ship({ x: ps.x + side * 1900, team: 'enemy', pal: 'naglfar', hull: 1, hullMax: 1, dir: -side, accel: 70, L: 290 }); s.bossShip = true; s.ghost = true; s.boardCd = 4; s.slots = [];
    s.tx = ps.x + side * (ps.L + s.L + 30); G.ships.push(s);
    const lh = Math.round(160 * (1 + G.step * 0.06));
    Object.assign(this, { name: '海拉', icon: 'n_hel', col: '#8ff8ec', bar: 'd3', intro: '先打碎纳吉尔法上的三盏魂灯，海拉的护盾才会消失', max: hp, hp, phase: 1, t: 0, st: 0, state: 'arrive', side, ship: s, flash: 0, dying: 0, dead: false, nextAtk: 3, atkN: 0,
      lanterns: [-0.85, -0.45, -0.05].map((k) => ({ lx: k * side * s.walk, hp: lh, max: lh, lit: true, flash: 0 })), lanternMax: lh, relight: 0, beam: null, hel: { on: s, lx: side * s.walk * 0.3, x: 0, y: 0, face: -side, air: null, t: 0 }, hitCd: 0, cast: 0 });
    this.syncHel(); Sfx.play('horn', 0, 1); Sfx.play('roar', 0, 0.6); G.fogK = 0.5;
  }
  frame() { const s = this.ship, h = this.hel; return h.on === s ? [s.x - s.L * 0.8, h.x + 70] : [h.x - 60, h.x + 60]; }
  get shielded() { return this.phase < 3 && this.lanterns.some((l) => l.lit); }
  get exposed() { return this.state === 'stunned' || this.state === 'recover'; }
  shield() { return this.shielded ? this.lanterns.filter((l) => l.lit).length / 3 : 0; }
  syncHel() { const h = this.hel; if (h.air) return; const s = h.on, p = s.toWorld(h.lx, s.deckY(h.lx)); h.x = p.x; h.y = p.y; }
  lanternPos(l) { const s = this.ship; return s.toWorld(l.lx, s.deckY(l.lx) - 78); }
  go(st) { this.state = st; this.st = 0; }
  update(dt, G) {
    this.t += dt; this.st += dt; this.flash = Math.max(0, this.flash - dt * 5); this.hitCd -= dt; this.cast = Math.max(0, this.cast - dt * 2);
    const ps = G.player, cap = G.captain, s = this.ship, h = this.hel, spd = this.phase === 3 ? 1.3 : this.phase === 2 ? 1.15 : 1;
    s.tx = ps.x + this.side * (ps.L + s.L + 30); s.boardCd -= dt; h.t += dt;
    for (const l of this.lanterns) l.flash = Math.max(0, l.flash - dt * 5);
    if (this.dying) { this.dying += dt; s.sinking = Math.min(1, this.dying * 0.25); if (Math.random() < 0.5) FX.burst(s.x + rand(-s.L, s.L), s.y - rand(0, 120), { n: 3, speed: 120, size: 2, color: 'g2', color2: 'd2', grav: -80, life: 0.9, kind: 'mist', water: false }); if (this.dying > 3.2 && !this.dead) { this.dead = true; this.hx = h.x; this.hy = h.y - 40; s.sunk = true; G.bossGone(this); } return; }
    // Hel in the air (boarding, or blinking), else standing on a deck
    if (h.air) { const A = h.air; A.t += dt; const k = Math.min(1, A.t / A.dur), to = A.ship.toWorld(A.lx, A.ship.deckY(A.lx)); h.x = lerp(A.x0, to.x, k); h.y = lerp(A.y0, to.y, k) - Math.sin(k * Math.PI) * A.arc; if (k >= 1) { h.air = null; h.on = A.ship; h.lx = A.lx; Cam.shake(0.25); FX.burst(h.x, h.y - 10, { n: 20, speed: 260, size: 2, color: 'g2', color2: 'd2', grav: 300, life: 0.6 }); Sfx.play('slam', 0, 0.8); } }
    this.syncHel();
    if (this.relight > 0) { this.relight -= dt; if (this.relight <= 0 && this.phase < 3) { for (const l of this.lanterns) { l.lit = true; l.hp = l.max; } FX.text(s.x, s.y - 260, '魂灯重燃', '#8ff8ec', 20, 1.4); Sfx.play('fire', 0, 0.8); } }
    if (this.beam) this.runBeam(dt, G);
    switch (this.state) {
      case 'arrive': if (Math.abs(s.x - s.tx) < 60 || this.st > 6) { this.go('idle'); G.banner('魂灯护住了海拉', '跳上纳吉尔法砸碎它们，弩炮和 Bon 也会帮你打', '#8ff8ec', 2.6); } break;
      case 'idle': this.nextAtk -= dt * spd; if (this.nextAtk <= 0) this.pick(G); break;
      case 'volley': if (this.st > 1.2) { this.go('idle'); } break;
      case 'raise': if (this.st > 1.2) this.go('idle'); break;
      case 'beam_tell': this.cast = 1; if (this.st > 1.0 / spd) { this.go('beam'); this.beam = { lx: -this.side * -ps.walk, dir: -this.side, t: 0, hit: false }; this.beam.lx = this.side * (ps.walk + 20); Sfx.play('wave', 0, 1); Sfx.play('roar', 0, 0.5); } break;
      case 'beam': this.cast = 1; if (!this.beam) { this.go('idle'); this.nextAtk = 1.6; } break;
      case 'stunned': if (this.st > 6) { this.go('idle'); this.relight = 0.01; this.nextAtk = 1.5; } break;
      case 'board': if (!h.air && this.st > 0.5) { this.go('h_idle'); this.nextAtk = 1.2; } break;
      case 'h_idle': {
        const want = cap.ship === ps && !cap.air ? cap.lx - Math.sign(cap.lx - h.lx || 1) * 110 : 0; h.lx = clamp(damp(h.lx, want, 1.4, dt), -ps.walk + 20, ps.walk - 20); h.face = Math.sign(cap.x - h.x) || h.face;
        this.nextAtk -= dt * spd; if (this.nextAtk <= 0) this.pickDeck(G); break;
      }
      case 'reap_tell': h.face = Math.sign(cap.x - h.x) || h.face; if (this.st > 0.7) { this.go('reap'); Sfx.play('swingBig', 0, 1); this.reapHit = false; } break;
      case 'reap': if (!this.reapHit && this.st > 0.08) { this.reapHit = true; this.reap(G); } if (this.st > 0.3) { this.go('recover'); } break;
      case 'recover': if (this.st > 0.9) { this.go('h_idle'); this.nextAtk = 1.2; } break;
      case 'blink': if (this.st > 0.45 && !this.blinked) { this.blinked = true; const side = cap.ship === ps ? -cap.face : pick([-1, 1]); h.lx = clamp((cap.ship === ps ? cap.lx : 0) + side * 80, -ps.walk + 20, ps.walk - 20); h.face = Math.sign(cap.x - h.x) || 1; this.syncHel(); FX.burst(h.x, h.y - 40, { n: 20, speed: 200, size: 2, color: 'd3', color2: 'g2', grav: -40, life: 0.6, kind: 'mist', water: false }); Sfx.play('wave', 0, 0.6); } if (this.st > 0.8) { this.go('reap_tell'); } break;
      case 'orbs': this.cast = 1; if (this.st > 0.8) { this.go('h_idle'); this.nextAtk = 1.4; } break;
    }
    if (this.hp <= this.max * 0.66 && this.phase === 1) { this.phase = 2; G.banner('亡者的舰队', '纳吉尔法的炮更多了，亡灵不停地登船', '#8ff8ec', 2.2); Sfx.play('roar', 0, 1); Sky.surge(G); }
    if (this.hp <= this.max * 0.33 && this.phase === 2) {
      this.phase = 3; for (const l of this.lanterns) l.lit = false; this.beam = null; this.relight = 0;
      G.banner('海拉登船了', '冥界女王亲自来收你的魂', '#c49ad8', 2.4); Sfx.play('roar', 0, 1); Sky.surge(G);
      const lx = clamp(cap.ship === ps ? -cap.lx * 0.6 : 0, -ps.walk + 30, ps.walk - 30); h.air = { t: 0, dur: 1.1, x0: h.x, y0: h.y, ship: ps, lx, arc: 260 }; this.go('board');
    }
  }
  pick(G) {
    const ps = G.player; this.atkN++;
    const opts = ['volley', 'volley', 'raise', 'beam']; if (this.phase >= 2) opts.push('volley', 'beam');
    const a = pick(opts);
    if (a === 'volley') { this.go('volley'); const n = this.phase >= 2 ? 6 : 4, s = this.ship; for (let i = 0; i < n; i++) this.timers(G, i * 0.15, () => { const q = s.toWorld(-this.side * rand(0, s.L * 0.8), s.deckBase + 14); FX.burst(q.x, q.y, { n: 10, angle: this.side > 0 ? Math.PI : 0, spread: 0.4, speed: 300, size: 2, color: 'g2', color2: 'd2', grav: 0, life: 0.4, water: false }); Sfx.play('ballista', 0.5 * this.side, 0.7); }); G.volley(n, 'soul', 14 + G.step * 1.3, 0.2); }
    else if (a === 'raise') { this.go('raise'); const n = this.phase >= 2 ? 3 : 2, s = this.ship; for (let i = 0; i < n; i++) { const e = new Enemy({ type: Math.random() < 0.35 ? 'draugrShield' : pick(['draugr', 'draugr', 'wraith']), hpMul: G.hpMul() * 0.9, value: 5 }); e.role = STATS[e.type].ranged ? 'thrower' : 'boarder'; e.land(s, rand(-s.walk * 0.6, s.walk * 0.1) * this.side); e.stun = 0.8; G.enemies.push(e); FX.burst(e.x, e.y - 20, { n: 16, angle: -HALF_PI, spread: 0.5, speed: 220, size: 2, color: 'g2', color2: 'd2', grav: -80, life: 0.7, water: false }); } Sfx.play('horn', 0, 0.6); FX.text(s.x, s.y - 200, '亡灵登船！', '#8ff8ec', 18, 1); }
    else { this.go('beam_tell'); Sfx.play('chargeStart', 0, 1); FX.text(ps.x, ps.y - 170, '魂光扫过来了 · 跳或翻滚', '#8ff8ec', 18, 1.1); }
    this.nextAtk = this.phase >= 2 ? 2.2 : 2.8;
  }
  pickDeck(G) {
    const a = pick(['reap', 'reap', 'blink', 'orbs']), h = this.hel;
    if (a === 'reap') this.go('reap_tell'); else if (a === 'blink') { this.blinked = false; this.go('blink'); FX.burst(h.x, h.y - 40, { n: 20, speed: 200, size: 2, color: 'd3', color2: 'g2', grav: -40, life: 0.6, kind: 'mist', water: false }); }
    else { this.go('orbs'); for (let i = 0; i < 3; i++) this.timers(G, i * 0.2, () => homingShot(G, h.x, h.y - 70, 12 + G.step * 1.1, 'soul', 420, 2.6)); Sfx.play('chargeFull', 0, 0.6); }
    // Naglfar keeps firing from alongside
    if (Math.random() < 0.35) G.volley(3, 'soul', 12 + G.step * 1.1, 0.25);
  }
  timers(G, t, f) { G.timers.push({ t, f: () => { if (!this.dying) f(); } }); }
  reap(G) {
    const h = this.hel, cap = G.captain, ps = G.player; Cam.shake(0.2);
    for (let i = 0; i < 16; i++) { const a = -2.2 + i * 0.17; FX.burst(h.x + h.face * Math.cos(a) * 110, h.y - 40 + Math.sin(a) * 90, { n: 1, speed: 40, size: 2, color: 'g2', grav: 0, life: 0.3, water: false }); }
    if (cap.ship === ps && cap.down <= 0 && cap.dodge <= 0 && Math.sign(cap.x - h.x || h.face) === h.face && Math.abs(cap.x - h.x) < 160 && Math.abs(cap.y - h.y) < 140) { if (cap.hurt(26 * (1 + G.step * 0.05), h.face * 520, -440, { stun: 0.5 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
  }
  runBeam(dt, G) {
    const b = this.beam, ps = G.player, cap = G.captain; b.t += dt; b.lx += b.dir * (ps.walk * 2 + 40) / 1.3 * dt;
    const p = ps.toWorld(clamp(b.lx, -ps.walk, ps.walk), ps.deckY(clamp(b.lx, -ps.walk, ps.walk)));
    FX.burst(p.x, p.y - 4, { n: 2, angle: -HALF_PI, spread: 0.8, speed: 200, size: 2, color: 'g2', color2: 'd2', grav: 200, life: 0.4, water: false }); FX.light(p.x, p.y, 200, [110, 255, 220], 1.4);
    if (!b.hit && cap.ship === ps && !cap.air && cap.dodge <= 0 && cap.down <= 0 && Math.abs(cap.lx - b.lx) < 26) { b.hit = true; if (cap.hurt(22 * (1 + G.step * 0.05), b.dir * 300, -420, { stun: 0.4 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
    for (const m of G.modules()) if (Math.abs(m.lx - b.lx) < 20 && !m.beamed) { m.beamed = true; m.hp -= 12; m.flash = 1; if (m.hp <= 0) G.destroyModule(m); }
    if (Math.abs(b.lx) > ps.walk + 30 && Math.sign(b.lx) === b.dir) { this.beam = null; for (const m of G.modules()) m.beamed = false; }
  }
  draw(ctx, t, layer) {
    const h = this.hel, fl = this.flash > 0.5;
    if (layer === 'front') {
      // lanterns on their poles, and their green wards around Hel
      for (const l of this.lanterns) {
        const p = this.lanternPos(l), base = this.ship.toWorld(l.lx, this.ship.deckY(l.lx)), bx = Cam.bx(p.x), by = Cam.by(p.y);
        P.line(ctx, Cam.bx(base.x), Cam.by(base.y), bx, by + 4, C.ink, 3); P.line(ctx, Cam.bx(base.x), Cam.by(base.y), bx, by + 4, C.m1, 1);
        const img = l.lit ? SPR.lantern : SPR.lantern_off; ctx.drawImage(l.flash > 0.5 ? silhouette(img, C.white) : img, bx - 7, by - 8, 14, 16);
        if (l.lit) { if (Math.floor(t * 6) % 2) P.dot(ctx, bx, by - 6, C.g3); if (l.hp < l.max) { P.rect(ctx, bx - 8, by - 10, 16, 3, C.ink); P.rect(ctx, bx - 7, by - 9, Math.round(14 * l.hp / l.max), 1, C.g2); } if (this.shielded && !this.dying) { const hq = { x: Cam.bx(h.x), y: Cam.by(h.y - 50) }; if (Math.floor(t * 12 + l.lx) % 3 === 0) P.line(ctx, bx, by, hq.x, hq.y, C.g1, 1); } }
      }
      if (this.dying > 1.5) return;
      if (this.state === 'blink' && this.st > 0.1 && !this.blinked) return;
      // Hel stands twice a man's height: her sprite is drawn at 2.5x
      const K = 2.5, bx = Cam.bx(h.x), by = Cam.by(h.y) + Math.round(Math.sin(h.t * 2) * 2) - 2, img = SPR.hel_body, flip = h.face < 0, o = inkOutline(fl ? silhouette(img, C.white) : img, img.width, img.height);
      ctx.save(); ctx.translate(bx, by); if (flip) ctx.scale(-1, 1); ctx.drawImage(o, Math.round(-9 * K), Math.round(-img.height * K), Math.round(img.width * K), Math.round(img.height * K)); ctx.restore();
      // the scythe: raised in a tell, swept through on a reap
      const sa = this.state === 'reap_tell' ? -2.4 : this.state === 'reap' ? lerp(-2.4, 1.2, Math.min(1, this.st / 0.1)) : this.cast > 0.2 ? -1.8 : 0.3, sx = bx + (flip ? -17 : 17), sy = by - 30;
      ctx.save(); ctx.translate(sx, sy); ctx.scale(flip ? -2 : 2, 2); ctx.rotate(sa); ctx.drawImage(SPR.hel_scythe, -5, -12); ctx.restore();
      if (this.cast > 0.2) { P.dot(ctx, sx + (flip ? -8 : 8), sy - 28, C.g3, 4); FX.light(h.x, h.y - 120, 110, [110, 255, 220], 1.1); }
      if (this.state === 'reap_tell' && Math.floor(t * 10) % 2) { P.ring(ctx, bx + (flip ? -40 : 40), by - 30, 34, C.r4); }
      if (this.shielded) { const r = 38 + Math.floor(t * 5) % 2; ctx.globalAlpha = 0.5; P.ring(ctx, bx, by - 32, r, C.g2); P.ring(ctx, bx, by - 32, r + 2, C.g1); ctx.globalAlpha = 1; }
      if (this.exposed) { const r = 40 + Math.floor(t * 8) % 3; P.ring(ctx, bx, by - 32, r, C[Math.floor(t * 8) % 2 ? 'f5' : 'white']); }
    } else if (layer === 'fx') {
      const ps = G.player;
      if (this.state === 'beam_tell') { const on = Math.floor(t * 10) % 2; for (let lx = -ps.walk; lx < ps.walk; lx += 8) { const p = ps.toWorld(lx, ps.deckY(lx) - 3); P.rect(ctx, Cam.bx(p.x), Cam.by(p.y), 3, 1, C[on ? 'g2' : 'd2']); } }
      if (this.beam) { const b = this.beam, p = ps.toWorld(clamp(b.lx, -ps.walk, ps.walk), ps.deckY(clamp(b.lx, -ps.walk, ps.walk))), hx = Cam.bx(h.x) + h.face * 6, hy = Cam.by(h.y) - 30, px = Cam.bx(p.x), py = Cam.by(p.y); P.line(ctx, hx, hy, px, py, C.g1, 5); P.line(ctx, hx, hy, px, py, C.g2, 3); P.line(ctx, hx, hy, px, py, C.white, 1); P.disc(ctx, px, py, 5, C.g3); }
    }
  }
  targetPoint() {
    if (this.dying) return null;
    const l = this.lanterns.find((q) => q.lit); if (l && this.phase < 3) { const p = this.lanternPos(l); return { x: p.x, y: p.y, pri: 2.2 }; }
    return { x: this.hel.x, y: this.hel.y - 64, pri: this.exposed ? 2.4 : 1.2 };
  }
  hitAt(x, y, dmg, G, src) {
    if (this.dying || this.state === 'arrive') return false;
    for (const l of this.lanterns) {
      if (!l.lit) continue; const p = this.lanternPos(l);
      if (Math.hypot(x - p.x, y - p.y) < 34) {
        l.hp -= dmg; l.flash = 1; FX.burst(p.x, p.y, { n: 8, speed: 200, size: 1, color: 'g2', color2: 'm2', grav: 400, life: 0.4 }); Sfx.play('clang', 0, 0.6);
        if (l.hp <= 0) { l.lit = false; this.chip(this.max * 0.03, G); Sfx.play('crack', 0, 1); Cam.shake(0.2); FX.burst(p.x, p.y, { n: 30, speed: 300, size: 2, color: 'g2', color2: 'g3', grav: 100, life: 0.8, water: false }); FX.text(p.x, p.y - 40, '魂灯灭了！', '#8ff8ec', 18, 1); if (!this.lanterns.some((q) => q.lit) && this.phase < 3) { this.beam = null; this.go('stunned'); FX.text(this.hel.x, this.hel.y - 120, '海拉的护盾碎了！', '#ffd84a', 22, 1.6); Sfx.play('roar', 0, 1); } }
        return true;
      }
    }
    const h = this.hel;
    if (Math.abs(x - h.x) < 44 && y > h.y - 130 && y < h.y + 6 && !(this.state === 'blink' && !this.blinked)) {
      if (this.shielded) { if (this.hitCd <= 0) { this.hitCd = 0.8; FX.text(h.x, h.y - 110, '冥火护盾', '#8ff8ec', 16, 0.8); Sfx.play('clang', 0, 0.6); } FX.sparks(x, y, 6); return true; }
      const k = this.exposed ? 1.8 : 1; this.chip(dmg * k, G); this.flash = 1; FX.text(h.x + rand(-20, 20), h.y - 100, `${Math.round(dmg * k)}`, this.exposed ? '#ffd84a' : '#8ff8ec', this.exposed ? 22 : 16, 0.7);
      return true;
    }
    return false;
  }
  chip(d, G) {
    if (this.dying) return; this.hp -= d;
    if (this.hp <= 0) { this.hp = 0; this.dying = 0.001; this.beam = null; FX.slowmo(0.25, 1.2); Cam.shake(0.5); Sfx.play('roar', 0, 1); G.banner('海拉退回了冥界', '死者之船沉入了雾里', '#8ff8ec', 3.5); for (const e of G.enemies) if (e.ship === this.ship && !e.dead) { e.hp = 0; G.kill(e, G.captain); } }
  }
  glow(L) {
    const h = this.hel; if (!this.dying) L.push({ x: h.x, y: h.y - 50, r: 180, c: [110, 255, 220], i: this.exposed ? 1.3 : 0.8 });
    for (const l of this.lanterns) if (l.lit) { const p = this.lanternPos(l); L.push({ x: p.x, y: p.y, r: 140, c: [110, 255, 210], i: 1 }); }
  }
}
BOSSES.naglfar = Naglfar;

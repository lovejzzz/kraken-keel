'use strict';
/* Chapter 5 — 诸神黄昏, Ragnarök. Wolf warriors leap across from far off, thunder shamans call bolts onto marked planks, jötnar
   throw rocks — or their own men — at the captain, and everything from the earlier seas comes back. At the end the world serpent
   Jörmungandr: a far greater wyrm that spits venom pools, smashes half the deck with its tail, heaves a wave that tips the ship,
   and coils round it; in the last third Thor's lightning strikes the serpent from the sky. */

/* ---------------- the cast ---------------- */
sprite('head_wolf', ['.w.....w.....', '.wW...wW.....', '.wwwwwwww....', 'wWWWWWWWWw...', 'wWWWWWWWWWww.', 'wWkkWWWWWWWWw', 'wssssssswwWw.', '.sssssesswkk.', '.ssSssssss...', '.sddddddd....', '..sdddddd....', '....ddd......'],
  { w: 'n5', W: 'n7', k: 'ink', s: 's2', S: 's1', e: 'f5', d: 'n4' });
sprite('torso_wolf', ['....wwwwww....', '..wwWWWWWWww..', '.wWWssssssWWw.', '.wWsssSSsssWw.', '.wssssssssssw.', '..sssSsSssss..', '..ssssssssss..', '.bBBBBBBByBBb.', '.bTTTTTTTTTTb.', '.bTTtTTTTtTTb.', '.bTTT....TTTb.', '.bTT......TTb.'],
  { w: 'n5', W: 'n7', s: 's2', S: 's1', b: 'w1', B: 'w2', y: 'm4', T: 'n3', t: 'n2' });
sprite('seax', ['.w.', '.w.', 'mmm', '.M.', '.M.', '.M.', '.M.', '.MM', '.M.'], { w: 'w2', m: 'm2', M: 'm4' });
sprite('head_shaman', ['b.b.....b.b..', '.bb.....bb...', '..bbbbbbb....', '.fffffffff...', '.fFFFFFFFf...', '.ssnssssns...', '.ssssssese...', '.snnssssns...', '..ssssssss...', '..wwwwwww....', '...wwwww.....', '.............'],
  { b: 'b1', f: 'n4', F: 'n5', s: 's2', n: 'n7', e: 'b4', w: 'b2' });
sprite('torso_shaman', ['....ffffff....', '..ffFFFFFFff..', '.fFFFFgFFFFFf.', '.fFFFgFgFFFFf.', '.fFFFFgFFFFFf.', '.fFFbFFFbFFFf.', '.fFFFFFFFFFFf.', '.fBBBBBBBBBBf.', '.fTTTTTTTTTTf.', '.fTTtTTTTtTTf.', '.fTTT....TTTf.', '.fTT......TTf.'],
  { f: 'n3', F: 'n4', g: 'b4', b: 'n7', B: 'w2', T: 'w3', t: 'w2' });
sprite('staff_rune', ['.g.', 'gWg', '.g.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.'], { g: 'n8', W: 'white', w: 'w3' });
sprite('head_jotunn', ['..hhhhhhhh...', '.hHHHHHHHHh..', '.hssssssssh..', 'ssSSssssSSss.', 'sskkssssskks.', 'ssssssSsssss.', 'sssssssssssS.', '.bbbbssbbbbb.', 'bBBbBBBBbBBb.', 'bBBBbBBbBBBb.', '.bBBBbbBBBb..', '..bbb..bbb...'],
  { h: 'n4', H: 'n5', s: 'n6', S: 'n5', k: 'ink', b: 'b2', B: 'b4' });
sprite('torso_jotunn', ['...ssssssss...', '.sSSSSSSSSSSs.', 'sSSsSSSSSsSSSs', 'sSSSsSSSsSSSSs', 'sSSSSSSSSSSSSs', 'sSSSSssSSSSSSs', '.sSSSSSSSSSSs.', '.fFFFFFFFFFFf.', '.fFfFFfFFfFFf.', '.fFFFFFFFFFFf.', '.fFFF....FFFf.', '.fFF......FFf.'],
  { s: 'n5', S: 'n6', f: 'w2', F: 'w4' });
sprite('rock_club', ['..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '.rRr.', 'rRLRr', 'rRRRr', 'rLRRr', 'rRRLr', 'rRRRr', '.rrr.'], { w: 'w3', r: 'm0', R: 'm1', L: 'm2' });

Object.assign(STATS, {
  wolf: { hp: 96, dmg: 15, speed: 270, reach: 66, wind: 0.38, style: 'grab', leaper: true, elite: true, guard: 0.25, value: 16 },
  shaman: { hp: 70, dmg: 20, speed: 120, reach: 60, wind: 0.5, ranged: true, shot: 'thunder', parts: true, value: 16 },
  jotunn: { hp: 760, dmg: 28, speed: 72, reach: 118, wind: 1.05, heavy: 4.5, style: 'troll', elite: true, guard: 0, value: 45,
    tick(G, e, dt) {
      const cap = G.captain;
      if (e.jHold) {
        e.jHold.t -= dt; e.tell = 1;
        if (e.jHold.t <= 0) {
          const A = e.jHold.ally, T = 0.9, tx = cap.x + cap.vx * 0.25, ty = cap.y - 30; e.jHold = null; e.tell = 0; Sfx.play('swingBig', e.pan(), 1);
          if (A && !A.dead && !A.water) { A.launch((tx - A.x) / T, (ty - A.y) / T - 0.5 * GRAV * T); A.thrown = 1.4; A.stun = 1.4; FX.text(A.x, A.y - 70, '飞过来了！', '#ff9a7a', 16, 0.8); }
          else { const sx = e.x + e.face * 20, sy = e.y - 130; G.shots.push(new Projectile({ x: sx, y: sy, vx: (tx - sx) / T, vy: (ty - sy) / T - 0.5 * 900 * T, grav: 900, dmg: e.stats.dmg * 0.8 * (1 + G.step * 0.05), team: 'enemy', kind: 'rock', life: 3 })); }
        }
        return;
      }
      if (e.stun > 0 || e.air || !e.ship || e.phase !== 'move' || G.state !== 'fight') return;
      e.jCd = (e.jCd ?? rand(2.5, 4)) - dt;
      const d = Math.abs(cap.x - e.x); if (e.jCd > 0 || d > 950 || d < 170 || cap.down > 0) return;
      e.jCd = rand(5.5, 7.5);
      const ally = G.enemies.find((o) => o !== e && !o.dead && !o.air && !o.water && o.ship === e.ship && !o.stats.elite && Math.abs(o.lx - e.lx) < 170);
      e.jHold = { t: 0.75, ally }; if (ally) ally.stun = 1.6;
      FX.text(e.x, e.y - 150, ally ? '抓起同伴！' : '举起巨石！', '#c8d0d8', 16, 0.8); Sfx.play('grunt', e.pan(), 1);
    } },
});
Object.assign(LOOK, { wolf: {}, shaman: { glow: [150, 200, 255] }, jotunn: { big: 2.2, draw: 2.3 } });
Object.assign(LOOKP, {
  wolf: { head: 'head_wolf', torso: 'torso_wolf', leg: 'n3', legD: 'n2', sleeve: 's2', hand: 's2', boot: 'boot', weapon: 'seax', grip: [1, 1] },
  shaman: { head: 'head_shaman', torso: 'torso_shaman', leg: 'w3', legD: 'w2', sleeve: 'n4', hand: 's2', boot: 'boot', weapon: 'staff_rune', grip: [1, 6] },
  jotunn: { head: 'head_jotunn', torso: 'torso_jotunn', leg: 'n5', legD: 'n4', sleeve: 'n6', hand: 'n6', boot: 'boot_d', weapon: 'rock_club', grip: [2, 1], twoHand: true },
});
SHIPPAL.ragna = { sail: ['r1', 'k1'], sailD: ['r0', 'k0'], shields: [['r2', 'gold'], ['k1', 'r2'], ['ink', 'r3'], ['m1', 'f2']], wood: ['ink', 'w0', 'w1', 'w2', 'w3'], head: ['k0', 'r1', 'r2'], eye: 'f5' };
sprite('n_jorm', ['....tttt....', '..ttTTTTtt..', '.tTTTTTTTTt.', 'tTTfTTTTTTTt', 'tTTTTTTTTTTt', '.tTTTttttttt', '..twtwtwtw..', '.....tTTt...', '.t....tTTt..', '.tt...tTTt..', '..tttTTTt...', '....tttt....'], { t: 't3', T: 't5', f: 'f5', w: 'b3' });
NODE_TYPES.jormun = { icon: 'n_jorm', name: '尘世巨蟒', desc: '环绕世界的巨蛇耶梦加得。它的尾巴、毒液和巨浪都会砸向你的船。' };

/* ---------------- encounters and the chapter-5 chart ---------------- */
Object.assign(ENC, {
  wolves: { name: '狼群', sub: '狼战士会从很远的船上直接扑过来。', rune: 'ᚢᛚᚠ', storm: 0.5, reward: 250, script: [{ at: 1, skiff: 1, crew: ['wolf', 'raider'] }, { at: 4, skiff: -1, crew: ['wolf', 'wolf'] }, { at: 13, skiff: 1, crew: ['wolf', 'shaman'] }] },
  thunder: { name: '雷暴', sub: '雷霆萨满会标记落雷的位置，天上的雷也会乱劈。', rune: 'ᚦᚢᚾ', storm: 1, dark: 0.2, reward: 265, script: [{ at: 1, ship: { side: 1, pal: 'ragna', hull: 520, crew: ['shaman', 'shaman', 'raider', 'wolf', 'spear'] } }, { at: 8, rain: 3, kind: 'bolt' }, { at: 14, skiff: -1, crew: ['wolf', 'berserker'] }, { at: 20, rain: 4, kind: 'bolt' }] },
  giants: { name: '巨人来袭', sub: '约顿巨人会把巨石——甚至自己的手下——扔过来。', rune: 'ᛃᛟᛏ', storm: 0.6, reward: 275, script: [{ at: 1, ship: { side: -1, pal: 'ragna', hull: 540, crew: ['jotunn', 'raider', 'raider', 'archer'] } }, { at: 12, skiff: 1, crew: ['wolf', 'shaman'] }] },
  fimbul: { name: '芬布尔之冬', sub: '三年的寒冬：霜巫、冰巨魔和火药猴都回来了。', rune: 'ᚠᛁᛗ', storm: 0.8, fog: 0.4, reward: 265, script: [{ at: 1, ship: { side: 1, pal: 'frost', hull: 520, crew: ['troll', 'witch', 'powder', 'witch'] } }, { at: 9, skiff: -1, crew: ['wolf', 'powder'] }, { at: 16, fly: ['valkyrie'] }] },
  muspel: { name: '穆斯贝尔之子', sub: '火焰之国的大军：祭司、盾卫和熔岩傀儡。', rune: 'ᛗᚢᛊ', storm: 0.7, reward: 275, script: [{ at: 1, ship: { side: -1, pal: 'ember', hull: 540, crew: ['golem', 'priest', 'obsidian', 'priest'] } }, { at: 8, rain: 4 }, { at: 12, skiff: 1, crew: ['wolf', 'raider'] }] },
  helhost: { name: '亡者大军', sub: '海拉的亡灵大军，女武神也在空中。', rune: 'ᚺᛖᛚ', storm: 0.6, dark: 0.35, reward: 275, script: [{ at: 1, ship: { side: 1, pal: 'hel', hull: 520, crew: ['necro', 'wraith', 'draugrShield', 'draugr', 'wraith'] } }, { at: 5, fly: ['valkyrie'] }, { at: 12, climb: 3 }] },
  wolfking: { name: '狼王', sub: '狼王带着狼战士和萨满，一起从远处扑来。精英敌人。', rune: 'ᚠᛖᚾ', storm: 0.7, reward: 300, script: [{ at: 1, ship: { side: 1, pal: 'ragna', hull: 560, crew: ['chieftain', 'wolf', 'wolf', 'shaman'] } }, { at: 9, skiff: -1, crew: ['wolf', 'wolf'] }] },
  twojotunn: { name: '巨人双雄', sub: '两个约顿巨人，还有萨满在后面召雷。精英敌人。', rune: 'ᛃᛟᛏᚾ', storm: 0.75, reward: 310, script: [{ at: 1, ship: { side: -1, pal: 'ragna', hull: 580, crew: ['jotunn', 'shaman', 'jotunn', 'raider'] } }, { at: 12, skiff: 1, crew: ['wolf', 'raider'] }] },
  jormun: { name: '尘世巨蟒', sub: '诸神黄昏。环绕世界的巨蛇浮出了海面。', rune: 'ᛃᛟᚱᛗ', storm: 0.9, dark: 0.15, reward: 0, boss: true, script: [{ at: 2, boss: 'jormun' }] },
});
CHAPTERS[5] = { name: '诸神黄昏', pool: [[], ['wolves'], ['wolves', 'thunder', 'giants'], ['thunder', 'giants', 'fimbul'], ['fimbul', 'muspel', 'helhost'], ['muspel', 'helhost', 'giants']], elite: ['wolfking', 'twojotunn'], boss: 'jormun', theme: 'ragnarok', pal: 'ragna', drop: 'hammer', node: 'jormun', ambush: 'wolves', rune: 'ᚱᚨᚷᚾ', col: '#ff9a7a',
  endTitle: '诸神黄昏 · 全部通关', endText: '尘世巨蟒沉入深海，太阳重新升起。Bon 叼来了一片金色的羽毛。', starter: [4600, 40] };

/* ---------------- 尘世巨蟒耶梦加得 ---------------- */
/* the frost wyrm's head repainted sea-green, drawn 1.5x as large */
const JORM_ART = (() => {
  const swap = { n5: 't6', n7: 't8', n4: 't5', n3: 't4', n2: 't3', n6: 't7', b2: 'm2', b3: 'm3', g1: 'f4' }, key = (h) => h.toLowerCase(), M = {};
  for (const k in swap) M[key(C[k])] = C[swap[k]];
  const rc = (src) => {
    const c = offscreen(src.width, src.height), g = c.getContext('2d'); g.drawImage(src, 0, 0); const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
    for (let i = 0; i < p.length; i += 4) { if (!p[i + 3]) continue; const h = '#' + [p[i], p[i + 1], p[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join(''), to = M[h]; if (to) { const n = parseInt(to.slice(1), 16); p[i] = n >> 16; p[i + 1] = (n >> 8) & 255; p[i + 2] = n & 255; } }
    g.putImageData(d, 0, 0); return c;
  };
  return { ...WYRM, head: rc(WYRM.head), jaw: rc(WYRM.jaw), eyeC: ['f4', 'f6'] };
})();
const JPAL = { body: 't6', lit: 't7', belly: 'b2', spike: 'b3', fleck: 't8', flash: 'foam', shard: ['t7', 't4'] };
const JTXT = { rage: ['巨蟒翻海', '它会甩尾砸船、掀起巨浪——巨浪来时按住 S 扎稳'], coil: ['诸神黄昏', '巨蟒缠住了整条船'], fall: ['尘世巨蟒倒下了', '世界之蛇沉入了深海'], stun: '巨蟒被震晕了！', adds: ['wolf', 'shaman'] };
class Jormungandr extends Wyrm {
  constructor(G) {
    super(G);
    const hp = Math.round(9000 * (1 + (G.step - 29) * 0.05));
    Object.assign(this, { name: '尘世巨蟒', icon: 'n_jorm', col: '#9ad8c8', bar: 't6', intro: '等它咬下来卡在甲板上时砸它的头；尾巴砸哪半边就离开哪半边', sc: 1.5, art: JORM_ART, pal: JPAL, txt: JTXT, glowC: [170, 255, 215], max: hp, hp, scaleHp: Math.round(120 * (1 + G.step * 0.06)), thorT: 2, thorN: 0, tail: null, wave: null });
    Sky.auroraK = 0;
  }
  hover(G) { const ps = G.player; return { x: ps.x + this.side * 370, y: -255 + Math.sin(this.t * 0.9) * 16 }; }
  frame() { return [this.hx - 90, this.hx + 90]; }
  pick(G) {
    const ps = G.player, cap = G.captain; this.atkN++;
    if (this.coilNext && this.phase === 3) { this.coilNext = false; return this.go('coil_in'); }
    if (this.phase === 3 && !this.scales.some((s) => s.hp > 0) && this.atkN % 6 === 0) return this.go('coil_in');
    const opts = ['bite', 'bite', 'spit', 'tail']; if (this.phase >= 2) opts.push('tail', 'wave', 'dive', 'spit');
    const a = pick(opts);
    if (a === 'bite') { const lx = clamp(cap.ship === ps ? cap.lx : rand(-ps.walk, ps.walk), -ps.walk + 20, ps.walk - 20); this.bite = { lx }; this.go('bite_tell'); Sfx.play('roar', 0, 0.5); }
    else if (a === 'spit') { this.go('spit'); this.spat = false; Sfx.play('chargeStart', 0, 1); }
    else if (a === 'tail') { const half = cap.ship === ps && Math.abs(cap.lx) > 10 ? Math.sign(cap.lx) : pick([-1, 1]); this.tail = { half, k: 0, slam: 0, hit: false }; this.go('tail_tell'); FX.text(ps.x + half * ps.walk * 0.5, ps.y - 170, '尾巴！离开这半边', '#ff9a7a', 20, 1.2); Sfx.play('splashBig', 0, 1); }
    else if (a === 'wave') { this.go('wave_tell'); FX.text(ps.x, ps.y - 170, '巨浪！按住 S 扎稳', '#9fe8ff', 22, 1.3); Sfx.play('wave', 0, 1); }
    else { this.go('dive'); Sfx.play('splashBig', 0, 1); }
    this.nextAtk = this.phase === 3 ? 1.5 : this.phase === 2 ? 2 : 2.5;
  }
  update(dt, G) {
    super.update(dt, G);
    if (this.dying) return;
    const ps = G.player, cap = G.captain, H = this.hover(G), mv = (x, y, k) => { this.hx = damp(this.hx, x, k, dt); this.hy = damp(this.hy, y, k, dt); };
    switch (this.state) {
      case 'spit': {
        mv(H.x - this.side * 60, H.y + 70, 2.5); this.ha = damp(this.ha, 0.35 * -this.side, 4, dt); this.jaw = Math.min(1, this.st * 1.5);
        if (!this.spat && this.st > 0.8) {
          this.spat = true; const n = this.phase === 3 ? 6 : 4, m = this.mouthPos(); Sfx.play('fire', 0, 1); Sfx.play('roar', 0, 0.5);
          for (let i = 0; i < n; i++) { const lx = i === 0 && cap.ship === ps ? cap.lx : rand(-ps.walk + 20, ps.walk - 20); G.hazard({ kind: 'venom', lx, t: 0.7 + i * 0.12, dmg: 14 + G.step * 1.2, r: 34 }); const q = ps.toWorld(lx, ps.deckY(lx)); FX.burst(m.x, m.y, { n: 3, angle: Math.atan2(q.y - m.y, q.x - m.x), spread: 0.15, speed: 700, size: 3, color: 'green', color2: 'd2', grav: 300, life: 0.6, water: false }); }
        }
        if (this.st > 1.6) { this.nextAtk = 2; this.go('hover'); }
        break;
      }
      case 'tail_tell': { mv(H.x, H.y - 30, 2); const T = this.tail; T.k = Math.min(1, T.k + dt / 1.2); if (this.st > 1.25) { this.go('tail'); Sfx.play('swingBig', 0, 1); } break; }
      case 'tail': {
        const T = this.tail; T.slam = Math.min(1, T.slam + dt / 0.16);
        if (T.slam >= 1 && !T.hit) {
          T.hit = true; const half = T.half, mid = half * ps.walk * 0.55, p = ps.toWorld(mid, ps.deckY(mid)); Cam.shake(0.6); Cam.kick(0.05); FX.stop(0.1); Sfx.play('slam', 0, 1); Sfx.play('crack', 0, 1);
          FX.splinters(p.x, p.y + 10, 30); FX.splash(ps.x + half * (ps.L + 60), 2.2); ps.damage(26, mid); ps.va += half * 0.6;
          const inHalf = (lx) => lx * half > -10;
          if (cap.ship === ps && !cap.air && inHalf(cap.lx) && cap.down <= 0 && cap.dodge <= 0) { if (cap.hurt(32 * (1 + G.step * 0.04), half * 380, -640, { stun: 0.5 })) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
          for (const e of G.enemies) if (!e.dead && e.ship === ps && !e.air && inHalf(e.lx)) { e.hurt(36, half * 420, -620, { stun: 0.8 }); if (e.hp <= 0) G.kill(e, cap); }
          for (const m of G.modules()) if (inHalf(m.lx)) { m.hp -= 18; m.flash = 1; if (m.hp <= 0) G.destroyModule(m); }
        }
        if (this.st > 1.1) { this.tail = null; this.nextAtk = 1.8; this.go('hover'); }
        break;
      }
      case 'wave_tell': mv(H.x, 260, 1.8); this.ha = damp(this.ha, 1 * -this.side, 3, dt); Sea.targetStorm = 1; if (this.st > 1.2) { this.go('wave'); this.wave = { t: 0 }; ps.va += -this.side * 0.9; Sfx.play('splashBig', 0, 1); Cam.shake(0.4); } break;
      case 'wave': {
        mv(H.x, 200, 1.5); ps.va += -this.side * 1.6 * dt * (this.st < 1.2 ? 1 : 0); this.wave.t += dt;
        const wx = ps.x + this.side * lerp(ps.L + 300, -(ps.L + 300), clamp(this.st / 1.4, 0, 1)); for (let i = 0; i < 3; i++) FX.burst(wx + rand(-40, 40), Sea.height(wx) - 10, { n: 1, angle: -HALF_PI, spread: 0.6, speed: rand(200, 420), size: 3, color: 'foam', grav: 600, life: 0.7, kind: 'mist' });
        if (!this.wave.hit && this.st > 0.4 && cap.ship === ps && !cap.air && !cap.brace && cap.down <= 0) { this.wave.hit = true; cap.knock(-this.side * 360, -300, 0.3); if (cap.hurt(10, 0, 0, { stun: 0 })) UI.pulse('hurt'); FX.text(cap.x, cap.y - 90, '没扎稳！', '#ff9a7a', 18, 0.8); }
        if (this.st > 1.8) { this.wave = null; this.nextAtk = 1.5; this.go('rise'); }
        break;
      }
    }
    if (this.state !== 'tail_tell' && this.state !== 'tail') this.tail = null;
    if (this.state !== 'wave') this.wave = null;
    // Thor fights beside you at the end of the world
    if (this.phase === 3 && !this.dying) {
      this.thorT -= dt;
      if (this.thorT <= 0) {
        this.thorT = 3.4; this.thorN++;
        if (this.thorN === 1) G.banner('雷神助战！', '托尔的雷霆劈向巨蟒', '#bfe0ff', 2.2);
        zap(this.hx + rand(-40, 40), Cam.viewT() - 20, this.hx, this.hy, 0.35, true); Sky.flash = 1; Cam.shake(0.3); Sfx.play('thunder', 0, 1); FX.light(this.hx, this.hy, 500, [190, 220, 255], 2);
        FX.burst(this.hx, this.hy, { n: 30, speed: 400, size: 1, color: 'b4', color2: 'g3', grav: 200, life: 0.5, kind: 'spark', water: false }); this.flash = 1; this.chip(this.max * 0.012, G);
        if (this.thorN % 3 === 0 && this.state === 'hover' && !this.scales.some((s) => s.hp > 0)) { this.bite = { lx: rand(-ps.walk * 0.4, ps.walk * 0.4) }; this.go('stunned'); FX.text(ps.x, ps.y - 200, '雷神劈晕了巨蟒！打它的头！', '#ffd84a', 22, 1.6); }
      }
    }
  }
  tailPts(G) {
    const ps = G.player, T = this.tail, h = T.half, base = { x: ps.x + h * (ps.L + 170), y: 40 }, up = { x: ps.x + h * (ps.L + 30), y: -350 }, hitP = ps.toWorld(h * ps.walk * 0.55, ps.deckY(h * ps.walk * 0.55) - 16);
    const tip = { x: lerp(lerp(base.x, up.x, T.k), hitP.x, T.slam), y: lerp(lerp(60, up.y, T.k), hitP.y, T.slam) }, c = { x: lerp(base.x, tip.x, 0.3) + h * 120, y: lerp(base.y, tip.y, 0.5) - 60 * (1 - T.slam) };
    const pts = []; for (let i = 0; i <= 18; i++) { const u = i / 18, v = 1 - u; pts.push({ x: v * v * base.x + 2 * v * u * c.x + u * u * tip.x, y: v * v * base.y + 2 * v * u * c.y + u * u * tip.y, r: lerp(40, 12, u) }); }
    return pts;
  }
  draw(ctx, t, layer) {
    super.draw(ctx, t, layer);
    const ps = G.player;
    if (layer === 'front' && this.tail) this.tailPts(G).forEach((p, i) => { if (p.y < Sea.height(p.x) + p.r * 0.5) this.seg(ctx, p, t, i); });
    if (layer === 'fx' && this.state === 'tail_tell' && this.tail) { const on = Math.floor(t * 10) % 2, h = this.tail.half; for (let lx = -10 * h; Math.abs(lx) < ps.walk; lx += 8 * h) { const p = ps.toWorld(lx, ps.deckY(lx) - 2); P.rect(ctx, Cam.bx(p.x), Cam.by(p.y), 4, 2, C[on ? 'r4' : 'r2']); } }
    if (layer === 'fx' && this.state === 'wave_tell') { const on = Math.floor(t * 6) % 2, x = Cam.bx(ps.x + this.side * (ps.L + 200)), y = Cam.by(Sea.height(ps.x)); for (let i = 0; i < 5; i++) P.rect(ctx, x - 20 + i * 8, y - 30 - (on ? 4 : 0) - i * 2, 6, 3, C.foam); }
  }
  glow(L) { super.glow(L); if (!this.dying) { const pts = this.bodyPts(G); for (let i = 4; i < pts.length; i += 6) L.push({ x: pts[i].x, y: pts[i].y, r: 160, c: [150, 255, 210], i: 0.5 }); if (this.tail) for (const p of this.tailPts(G).filter((_, i) => i % 6 === 3)) L.push({ x: p.x, y: p.y, r: 140, c: [150, 255, 210], i: 0.6 }); } if (this.phase === 3 && !this.dying) L.push({ x: this.hx, y: this.hy - 200, r: 400, c: [170, 200, 255], i: 0.3 }); }
}
BOSSES.jormun = Jormungandr;

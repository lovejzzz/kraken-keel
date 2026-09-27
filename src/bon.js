'use strict';
/* Bon, the captain's scarlet macaw. She perches on the yard and preens; when raiders come she swoops on them.
   She levels up, eats, wears gear and dresses up, and all of that is kept between voyages (her belly is not). */

/* ---- sprites, facing right ----
   R red, D dark red, L light red, Y yellow, G gold, B blue, N dark blue, W white face, E eye, U upper beak, V lower beak, F feet */
const BONMAP = { R: 'r3', D: 'r2', L: 'r4', Y: 'f5', G: 'gold', B: 'n7', N: 'n5', W: 'b4', E: 'ink', U: 'b2', V: 'w1', F: 'm3' };
sprite('bon_sit', [
  '....LRRR...',
  '...LRRRRR..',
  '...RRRWWWU.',
  '..RRRRWEWUU',
  '..RRRRWWVUU',
  '..RRRRRRVVU',
  '.YYRRRRR...',
  '.GYYRRRRR..',
  '.BGYYRRRR..',
  '.BBGYRRRD..',
  '.NBBGRRDD..',
  '..NBBRDD...',
  '..NBBFFF...',
  '..NBB......',
  '...NB......',
  '...N.......',
], BONMAP);
sprite('bon_preen', [
  '...........',
  '...LRRR....',
  '..LRRRRR...',
  '.URWWWRR...',
  'UUWEWRRRR..',
  'UVWWRRRRR..',
  '.YYRRRRRR..',
  '.GYYRRRRR..',
  '.BGYYRRRR..',
  '.BBGYRRRD..',
  '.NBBGRRDD..',
  '..NBBRDD...',
  '..NBBFFF...',
  '..NBB......',
  '...NB......',
  '...N.......',
], BONMAP);
sprite('bon_preen2', [
  '...........',
  '...........',
  '...LRRR....',
  '..LRRRRR...',
  '.URWWWRR...',
  'UUWEWRRRR..',
  'UVYWRRRRR..',
  '.GYYRRRRR..',
  '.BGYYRRRR..',
  '.BBGYRRRD..',
  '.NBBGRRDD..',
  '..NBBRDD...',
  '..NBBFFF...',
  '..NBB......',
  '...NB......',
  '...N.......',
], BONMAP);
recolor('bon_blink', 'bon_sit', { E: 'b4' });
sprite('bon_fly', [
  '..........LRR...',
  '.........LRRWWU.',
  'NN......RRRWEWUU',
  '.NBB.RRRRRRWWVUU',
  '..NBBRRRRRRRRVV.',
  '...NBDDRRRRDD...',
  '.....NN.FF......',
], BONMAP);
sprite('bon_wing', ['.N....', 'NB....', 'NBB...', 'NBBB..', '.BBBG.', '.BBGY.', '..GYR.', '..YRR.', '..RRL.', '...RR.'], BONMAP);
recolor('bon_wing2', 'bon_wing', { B: 'n5', N: 'n3', G: 'f3', Y: 'gold', R: 'r2', L: 'r3' });
sprite('bon_head', ['..LRR..', '.RRWWU.', 'RRWEWUU', 'RRWWVU.', '.RRR...'], BONMAP);

/* hats: drawn with their bottom row over the top of her head */
sprite('hat_tri', ['..N.N..', '.NNWNN.', 'NGGGGGN'], { N: 'n2', W: 'b4', G: 'gold' });
sprite('hat_viking', ['H.......H', 'H..MMM..H', '.HMMMMMH.', '..mmmmm..'], { H: 'b3', M: 'm3', m: 'm2' });
sprite('hat_crown', ['Y.Y.Y', 'YYYYY', 'GRGBG'], { Y: 'f5', G: 'gold', R: 'r4', B: 'n8' });
sprite('hat_flower', ['.P.P.', 'PPOPP', '.PPP.', '..g..'], { P: 'f6', O: 'f4', g: 'green' });
sprite('hat_straw', ['..SSSSS..', '..sRRRs..', 'SSSSSSSSS'], { S: 'w6', s: 'w5', R: 'r3' });
/* outfits */
sprite('fit_scarf', ['TTTTT', '.tTTt'], { T: 't7', t: 't6' });
sprite('fit_bow', ['KK.KK', 'KKGKK', 'KK.KK'], { K: 'n1', G: 'gold' });
sprite('fit_chain', ['G...G', '.GYG.', '..Y..'], { G: 'gold', Y: 'f5' });
sprite('fit_cape', ['kkkk.', 'kKKkk', 'kKKKk', '.kKKk', '.kKKk', '..kKk', '..kk.', '...k.'], { K: 'k5', k: 'k4' });
sprite('fit_patch', ['KK', 'KK'], { K: 'n1' });
/* shop icons */
sprite('i_seed', ['..........', '...s.l.s..', '..slslsls.', '.oooooooo.', '.oOOOOOOo.', '..oOOOOo..', '...oooo...', '..........', '..........'], { s: 'n2', l: 'b3', o: 'w3', O: 'w6' });
sprite('i_mango', ['..........', '....gg....', '...OOOO...', '..OYYYOO..', '..OYYYOO..', '..OOYYOO..', '...OOOO...', '....OO....', '..........'], { O: 'f3', Y: 'f5', g: 'green' });
sprite('i_cake', ['..........', '...YYYY...', '..YHHHHY..', '.YHHHHHHY.', '.GGGGGGGG.', '.gYYYYYYg.', '.GGGGGGGG.', '..........'], { Y: 'f5', H: 'f6', G: 'f3', g: 'f2' });
sprite('i_talon', ['..........', '.M..M..M..', '.M..M..M..', '.MM.MM.MM.', '..M..M..M.', '..........', '.wwwwwwww.', '..........'], { M: 'm4', w: 'w4' });
sprite('i_ring', ['..........', '...GGGG...', '..G....G..', '.G..BB..G.', '.G.BBBB.G.', '.G..BB..G.', '..G....G..', '...GGGG...'], { G: 'gold', B: 'n7' });
sprite('i_bell', ['....G.....', '...GYG....', '..GYYYG...', '..GYYYG...', '.GYYYYYG..', '.GGGGGGG..', '....k.....'], { G: 'gold', Y: 'f5', k: 'n1' });
sprite('heart', ['RR.RR', 'RLRRR', 'RRRRR', '.RRR.', '..R..'], { R: 'r4', L: 'f6' });
sprite('i_none', ['..........', '..rr..rr..', '...rrrr...', '....rr....', '...rrrr...', '..rr..rr..', '..........'], { r: 'b0' });

const BON_HATS = { flower: { name: '小花', cost: 200 }, straw: { name: '草帽', cost: 300 }, tri: { name: '海盗帽', cost: 450 }, viking: { name: '维京角盔', cost: 650 }, crown: { name: '小王冠', cost: 1200 } };
const BON_FITS = { bow: { name: '领结', cost: 200 }, scarf: { name: '海蓝围巾', cost: 300 }, patch: { name: '眼罩', cost: 400 }, cape: { name: '紫斗篷', cost: 700 }, chain: { name: '金项链', cost: 1000 } };
const BON_FOOD = {
  seed: { name: '葵花籽', cost: 12, xp: 25, full: 30, icon: 'i_seed' },
  mango: { name: '芒果干', cost: 28, xp: 70, full: 55, icon: 'i_mango' },
  cake: { name: '蜜饼', cost: 50, xp: 150, full: 100, icon: 'i_cake' },
};
const BON_GEAR = {
  talon: { name: '铁爪', desc: '啄击伤害 +35%', parts: [3, 5, 7], icon: 'i_talon' },
  wing: { name: '羽翼护环', desc: '飞得更快，出手间隔 -18%', parts: [3, 5, 7], icon: 'i_ring' },
  bell: { name: '幸运铃铛', desc: '暴击 +8%，啄中时会叼回银币', parts: [4, 8], icon: 'i_bell' },
};
/* skills: [level, name, what it does, icon]. Several are team moves with the captain; 8 and 10 are magic. */
const BON_PERKS = [
  [2, '标记', '啄中的敌人被标记，船长下一击必定暴击', 'sk_mark'],
  [3, '眩晕啄', '啄中的敌人晕得更久', 'sk_daze'],
  [4, '连携俯冲', '船长连击第三下打中时，Bon 一起俯冲', 'sk_combo'],
  [5, '双连啄', '每次俯冲连啄两下', 'sk_double'],
  [6, '救援', '船长落水时，Bon 把他拽回船上', 'sk_rescue'],
  [7, '羽刃', '盘旋时甩出三片羽刃', 'sk_blade'],
  [8, '雷羽', '魔法：召来闪电劈中敌人，劈晕周围的人', 'sk_bolt'],
  [9, '羽旋风', '任何武器满蓄力出招时，Bon 卷起旋风一起冲出去', 'sk_tornado'],
  [10, '凤凰', '魔法：化作火凤凰贯穿敌阵；暴击率翻倍', 'sk_phoenix'],
];
/* emotes in a little bubble over her head, instead of words */
const EMO = { k: 'ink', r: 'r4', R: 'r3', y: 'f5', Y: 'gold', b: 'n7', B: 'n5', w: 'b4', o: 'f3', g: 'g2' };
sprite('emo_angry', ['.r...r.', 'rrr.rrr', '.r...r.', '.......', '.r...r.', 'rrr.rrr', '.r...r.'], EMO);
sprite('emo_heart', ['.rr.rr.', 'rRRrRRr', 'rRRRRRr', '.rRRRr.', '..rRr..', '...r...'], EMO);
sprite('emo_star', ['...y...', '...y...', '.yyYyy.', 'yyYYYyy', '.yyYyy.', '...y...', '...y...'], EMO);
sprite('emo_excl', ['..rr...', '..rr...', '..rr...', '..rr...', '.......', '..rr...'], EMO);
sprite('emo_sweat', ['...b...', '..bb...', '.bBBb..', '.bBwb..', '..bb...'], EMO);
sprite('emo_note', ['..kkkk.', '..k..k.', '..k..k.', '.kk.kk.', 'kkk.kkk', '.k...k.'], EMO);
sprite('emo_food', ['....ww.', '...www.', '..ooow.', '.oooo..', 'oYoo...', 'oo.....'], EMO);
sprite('emo_bolt', ['...yy..', '..yy...', '.yyyyy.', '...yy..', '..yy...', '.yy....'], EMO);
sprite('emo_fire', ['...r...', '..rr.r.', '.rorrr.', '.roYor.', 'rooYoor', '.roooo.'], EMO);
/* skill icons */
const SKI = { k: 'ink', r: 'r4', R: 'r3', y: 'f5', Y: 'gold', b: 'n7', B: 'n5', w: 'b4', W: 'b2', o: 'f3', O: 'f4', g: 'g2', m: 'm3' };
sprite('sk_mark', ['...rr....', '..r..r...', '.r.rr.r..', 'r.r..r.r.', 'r.r..r.r.', '.r.rr.r..', '..r..r...', '...rr....'], SKI);
sprite('sk_daze', ['.y.....y.', 'yYy...yYy', '.y..y..y.', '...yYy...', '....y....', '.wwwwwww.', 'wWWWWWWWw', '.wwwwwww.'], SKI);
sprite('sk_combo', ['.......R.', '......RR.', '.....R.R.', 'RRRRRR...', '.....y.y.', '......yy.', '.......y.', 'yyyyyy...'], SKI);
sprite('sk_double', ['.R...R...', 'RR..RR...', 'RRR.RRR..', 'RRRRRRRR.', 'RRR.RRR..', 'RR..RR...', '.R...R...', '.........'], SKI);
sprite('sk_rescue', ['..rwwr...', '.w....w..', 'r......r.', 'w..bb..w.', 'w..bb..w.', 'r......r.', '.w....w..', '..rwwr...'], SKI);
sprite('sk_blade', ['.......r.', '......rR.', '.....rR..', '..b.rR...', '.bBrR....', '.bBR.....', 'bBB......', 'bb.......'], SKI);
sprite('sk_bolt', ['....yy...', '...yy....', '..yyy....', '.yyyyyy..', '....yy...', '...yy....', '..yy.....', '.yy......'], SKI);
sprite('sk_tornado', ['wwwwwwww.', '.WWWWWW..', '..wwwww..', '...WWW...', '...ww....', '..WW.....', '..w......', '.W.......'], SKI);
sprite('sk_phoenix', ['.o.....o.', 'oOo...oOo', 'OyOo.oOyO', '.OyOrOyO.', '..OyRyO..', '...OYO...', '....O....', '...o.o...'], SKI);
sprite('sk_lock', ['..mmm....', '.m...m...', '.m...m...', 'mmmmmmm..', 'mkkmkkm..', 'mkkkkkm..', 'mmmmmmm..'], SKI);
/* where things sit on each body sprite: head top, eye, neck */
const BON_ANCH = { sit: { head: [6, 0], eye: [7, 3], neck: [3, 6] }, preen: { head: [4, 1], eye: [3, 4], neck: [3, 6] }, preen2: { head: [4, 2], eye: [3, 5], neck: [3, 7] }, fly: { head: [11, 0], eye: [12, 2], neck: [9, 3] } };

const BON_CV = offscreen(36, 32), BON_G = BON_CV.getContext('2d'), BON_O = offscreen(36, 32), BON_OG = BON_O.getContext('2d'), BON_S = offscreen(36, 32), BON_SG = BON_S.getContext('2d');
BON_G.imageSmoothingEnabled = false; BON_OG.imageSmoothingEnabled = false;
/* compose Bon with her clothes into a 36x32 canvas, inked outline included. Perched: feet at (18, 21). Flying: shoulder at (18, 16). */
function bonCompose(pose, wingA = 0, look = {}, t = 0) {
  const g = BON_G; g.clearRect(0, 0, 36, 32);
  const hat = look.hat, fit = look.fit, fly = pose === 'fly';
  const body = fly ? SPR.bon_fly : SPR['bon_' + pose] || SPR.bon_sit, A = BON_ANCH[fly ? 'fly' : pose === 'blink' ? 'sit' : pose] || BON_ANCH.sit;
  const bx = fly ? 18 - 7 : 18 - 5, by = fly ? 16 - 3 : 21 - 12;
  if (fly) blitRot(g, SPR.bon_wing2, 19, 16, wingA + 0.35, 3, 9);
  if (fit === 'cape') { if (fly) blitRot(g, SPR.fit_cape, bx + 6, by + 2, 1.35 + Math.sin(t * 10) * 0.12, 1, 0); else g.drawImage(SPR.fit_cape, bx, by + 6); }
  g.drawImage(body, bx, by);
  const nx = bx + A.neck[0], ny = by + A.neck[1], ex = bx + A.eye[0], ey = by + A.eye[1];
  if (fit === 'scarf') {
    if (fly) { g.fillStyle = C.t7; g.fillRect(nx, ny - 1, 2, 3); g.fillStyle = C.t6; for (let i = 1; i < 5; i++) g.fillRect(nx - i, ny + Math.round(Math.sin(t * 14 + i) * 1), 1, 1); }
    else { g.drawImage(SPR.fit_scarf, nx, ny); g.fillStyle = C.t6; g.fillRect(nx, ny + 2, 1, 2); }
  }
  if (fit === 'bow') g.drawImage(SPR.fit_bow, fly ? nx - 1 : nx, fly ? ny - 1 : ny - 1);
  if (fit === 'chain') g.drawImage(SPR.fit_chain, fly ? nx - 2 : nx, fly ? ny + 1 : ny);
  if (fit === 'patch') { g.drawImage(SPR.fit_patch, ex - (fly ? 0 : 0), ey - 1); g.fillStyle = C.n1; g.fillRect(ex - 1, ey - 2, 1, 1); g.fillRect(ex - 2, ey - 3, 1, 1); }
  if (hat) { const h = SPR['hat_' + hat], hx = bx + A.head[0] - Math.floor(h.width / 2), hy = by + A.head[1] + 1 - h.height; g.drawImage(h, hx, hy); }
  if (fly) blitRot(g, SPR.bon_wing, 18, 16, wingA, 3, 9);
  // inked outline, like every other character
  const s = BON_SG; s.clearRect(0, 0, 36, 32); s.globalCompositeOperation = 'source-over'; s.drawImage(BON_CV, 0, 0); s.globalCompositeOperation = 'source-in'; s.fillStyle = look.fire ? C[Math.floor(t * 16) % 2 ? 'f4' : 'f2'] : look.glow ? C[Math.floor(t * 8) % 2 ? 'gold' : 'f4'] : C.ink; s.fillRect(0, 0, 36, 32); s.globalCompositeOperation = 'source-over';
  const o = BON_OG; o.clearRect(0, 0, 36, 32); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) o.drawImage(BON_S, dx, dy); o.drawImage(BON_CV, 0, 0);
  return BON_O;
}

const Bon = {
  d: null, full: 100, x: 0, y: 0, vx: 0, vy: 0, face: 1, state: 'perch', t: 0, cd: 1.5, tg: null, tgT: 0, wingA: 0, flapT: 0,
  pose: 'sit', idleT: 4, preenT: 0, blinkT: 0, turnT: 7, diveT: 0, riseT: 0, second: false, volleyCd: 3, feathers: [], say: null,
  load() {
    const s = store('kk.bon') || {};
    this.d = { lv: 1, xp: 0, hats: [], fits: [], hat: null, fit: null, ...s, gear: { talon: 0, wing: 0, bell: 0, ...(s.gear || {}) } };
  },
  save() { store('kk.bon', this.d); },
  reset() { this.full = 100; this.state = 'perch'; this.emote = null; this.bolts = []; this.px = null; this.rideW = null; this.lockTg = false; this.coop = false; if (G.captain) G.captain.carried = false; this.tg = null; this.feathers = []; this.cd = 1.5; const p = this.perch(); this.x = p.x; this.y = p.y; this.vx = this.vy = 0; },
  need(lv = this.d.lv) { return 30 + lv * 30; },
  has(lv) { return this.d.lv >= lv; },
  hungry() { return this.full < 30; },
  look(prev = {}) { return { hat: prev.hat !== undefined ? prev.hat : this.d.hat, fit: prev.fit !== undefined ? prev.fit : this.d.fit, glow: this.has(10) }; },
  stats() {
    const d = this.d, g = d.gear, h = this.hungry();
    return {
      dmg: (6 + d.lv * 1.6) * (1 + g.talon * 0.35) * (h ? 0.8 : 1),
      cd: Math.max(0.55, (2.3 - d.lv * 0.09) * (1 - g.wing * 0.18) * (h ? 1.5 : 1)),
      speed: 470 + g.wing * 70 + d.lv * 12,
      crit: (0.08 + g.bell * 0.08) * (this.has(10) ? 2 : 1),
    };
  },
  gainXp(n) {
    const d = this.d; if (d.lv >= 10) return;
    d.xp += n;
    while (d.lv < 10 && d.xp >= this.need()) { d.xp -= this.need(); d.lv++; this.levelUp(); }
    if (d.lv >= 10) d.xp = 0;
    this.save();
  },
  levelUp() {
    FX.text(this.x, this.y - 40, `Bon 升级！Lv ${this.d.lv}`, '#ffd84a', 22, 1.6);
    FX.burst(this.x, this.y - 10, { n: 24, speed: 220, size: 1, color: 'gold', color2: 'f6', grav: 0, life: 0.7, kind: 'spark', water: false });
    Sfx.play('levelup', 0, 1); this.say = { s: '嘎！', t: 1.4 }; this.emo('star', 1.6);
    const perk = BON_PERKS.find((p) => p[0] === this.d.lv); if (perk) G.banner(`Bon 学会了「${perk[1]}」`, perk[2], '#ffd84a', 2.4);
  },
  feed(k) {
    const f = BON_FOOD[k]; G.silver -= G.price(f.cost); this.full = Math.min(100, this.full + f.full); this.gainXp(f.xp);
    Sfx.play('eat', 0, 1); this.say = { s: pick(['好吃！', '嘎嘎！', '还要！']), t: 1.3 }; this.happy = 1;
  },
  /* the yard, to the right of the mast */
  perch() { const ps = G.player; return ps.toWorld(ps.yardW() * 0.45, YARD_Y - 1); },
  onScreen(x, y) { return x > Cam.viewL() + 10 && x < Cam.viewR() - 10 && y > Cam.viewT() && y < Cam.viewB(); },
  pickTarget(G) {
    const cap = G.captain; let best = null, bd = 1e9;
    const consider = (o, x, y, pri) => { if (!this.onScreen(x, y)) return; const d = (Math.hypot(x - cap.x, y - cap.y) + Math.hypot(x - this.x, y - this.y) * 0.3) / pri; if (d < bd) { bd = d; best = o; } };
    for (const e of G.enemies) if (!e.dead && !e.water && !e.gone) consider({ e }, e.cx, e.cy, e.ship === cap.ship ? 1.6 : 1);
    for (const t of G.tentacles) if (t.hittable() && t.pts.length) { const p = t.pts[(t.pts.length * 0.7) | 0]; consider({ t }, p.x, p.y, 1.2); }
    if (G.kraken && G.kraken.eye > 0.6 && !G.kraken.dying) { const p = G.kraken.eyePos; consider({ eye: true }, p.x, p.y, 1.4); }
    for (const h of G.hawks || []) if (!h.dead) consider({ hawk: h }, h.x, h.y, 2.2);
    if (G.boss && G.boss.targetPoint) { const p = G.boss.targetPoint(); if (p) consider({ boss: G.boss }, p.x, p.y, p.pri || 1.3); }
    return best;
  },
  tgPos(tg) {
    if (!tg) return null;
    if (tg.e) return tg.e.dead || tg.e.water || tg.e.gone ? null : { x: tg.e.cx, y: tg.e.cy - 8 };
    if (tg.t) { if (!tg.t.hittable() || !tg.t.pts.length) return null; const p = tg.t.pts[(tg.t.pts.length * 0.7) | 0]; return { x: p.x, y: p.y }; }
    if (tg.eye) return G.kraken && G.kraken.eye > 0.6 && !G.kraken.dying ? G.kraken.eyePos : null;
    if (tg.hawk) return tg.hawk.dead ? null : { x: tg.hawk.x, y: tg.hawk.y };
    if (tg.boss) return G.boss === tg.boss && tg.boss.targetPoint ? tg.boss.targetPoint() : null;
    return null;
  },
  steer(tx, ty, sp, k, dt) {
    const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy) || 1, v = Math.min(sp, d * 3.2);
    this.vx = damp(this.vx, (dx / d) * v, k, dt); this.vy = damp(this.vy, (dy / d) * v, k, dt); return d;
  },
  emo(k, t = 1.1) { this.emote = { k, t, max: t }; },
  update(dt, G) {
    if (!this.d) return;
    this.t += dt; this.cd -= dt; this.volleyCd -= dt; this.magicCd = (this.magicCd ?? 5) - dt; this.fireCd = (this.fireCd ?? 8) - dt; this.coopCd = (this.coopCd || 0) - dt; this.rescueCd = (this.rescueCd || 0) - dt;
    if (this.say) { this.say.t -= dt; if (this.say.t <= 0) this.say = null; }
    if (this.emote) { this.emote.t -= dt; if (this.emote.t <= 0) this.emote = null; }
    this.linkT = Math.max(0, (this.linkT || 0) - dt);
    for (const e of G.enemies) if (e.marked > 0) e.marked -= dt;
    const P0 = this.perch(), cap = G.captain, st = this.stats();
    const fighting = G.state === 'fight' && cap.down <= 0;
    this.tgT -= dt;
    if (fighting && !this.lockTg && (this.tgT <= 0 || !this.tgPos(this.tg))) { this.tg = this.pickTarget(G); this.tgT = 0.5; }
    if (!fighting) this.tg = null;
    const tp = this.tgPos(this.tg);
    // the ship is going down: she takes off and circles overhead
    if (G.player.sinking > 0.02 || G.state === 'lost') {
      if (this.state === 'perch') { this.state = 'return'; this.vy = -300; this.emo('sweat', 2); }
      this.steer(G.player.x + Math.sin(this.t * 1.3) * 90, -330 + Math.cos(this.t * 2.6) * 20, st.speed * 0.6, 2.5, dt);
      this.integrate(dt); return;
    }
    // Lv6 rescue: the captain has been in the sea a moment -> fly down, grab him, carry him aboard
    if (this.has(6) && cap.water && cap.wetT > 0.9 && this.rescueCd <= 0 && !['rescue', 'carry', 'phoenix', 'cast', 'ride'].includes(this.state) && G.state !== 'title') { this.state = 'rescue'; this.emo('excl', 1); Sfx.play('squawk', 0, 1); }
    if (this.state === 'rescue') {
      if (!cap.water) { this.state = 'fly'; }
      else { const d = this.steer(cap.x, cap.y - 40, st.speed * 1.5, 6, dt); if (d < 16) { this.state = 'carry'; cap.water = false; cap.air = true; cap.carried = true; cap.ship = null; this.emo('sweat', 3); FX.splash(cap.x, 0.8); } }
      this.integrate(dt); return;
    }
    if (this.state === 'carry') {
      const ps = G.player, lo = ps.toLocal(cap.x, cap.y), lx = clamp(lo.x, -ps.walk + 40, ps.walk - 40), to = ps.toWorld(lx, ps.deckY(lx) - 90);
      const d = this.steer(to.x, to.y, 330, 4, dt); this.integrate(dt, 16);
      cap.x = this.x; cap.y = this.y + 46; cap.vx = this.vx; cap.vy = this.vy;
      if (d < 18) { cap.carried = false; cap.launch(0, 80); this.state = 'fly'; this.rescueCd = 10; FX.text(cap.x, cap.y - 80, '救援！', '#9fe8ff', 20, 1); this.emo('heart', 1.5); this.gainXp(5); }
      return;
    }
    if (this.state === 'perch') {
      this.x = P0.x; this.y = P0.y; this.vx = this.vy = 0;
      this.idleT -= dt; this.blinkT -= dt; this.turnT -= dt;
      if (this.pose === 'preen') { this.preenT -= dt; if (this.preenT <= 0) { this.pose = 'sit'; this.idleT = rand(3, 7); if (Math.random() < 0.3 && G.state !== 'title') this.emo('note', 1.4); } }
      else if (this.idleT <= 0) { this.pose = 'preen'; this.preenT = rand(1.2, 2.2); }
      if (this.blinkT <= 0) this.blinkT = rand(2, 5);
      if (this.turnT <= 0) { this.turnT = rand(5, 11); this.face = -this.face; }
      if (this.hungry() && G.state !== 'title' && !this.emote && Math.random() < dt * 0.25) this.emo('food', 1.6);
      if (tp && this.cd <= 0.8) { this.state = 'fly'; this.vy = -260; this.vx = this.face * 120; this.pose = 'sit'; Sfx.play('squawk', 0, 0.8); this.emo('angry', 1); }
      return this.updateFeathers(dt, G, st);
    }
    if (this.state === 'ride') {
      const w = this.rideW; if (!w || w.life <= 0) { this.state = 'fly'; this.rideW = null; }
      else { this.x = w.x - w.f * 6 + Math.cos(this.t * 20) * 10; this.y = w.y - 6 + Math.sin(this.t * 20) * 14; this.vx = w.f * w.v; this.vy = 0; this.face = w.f; this.flapT += dt * 18; this.wingA = -1.5; }
      return this.updateFeathers(dt, G, st);
    }
    if (this.state === 'phoenix') { this.updatePhoenix(dt, G, st); return this.updateFeathers(dt, G, st); }
    if (!tp && this.state !== 'return') this.state = 'return';
    if (this.state === 'return') {
      const d = this.steer(P0.x, P0.y - 4, st.speed * 0.8, 4, dt);
      if (d < 10) { this.state = 'perch'; this.pose = 'sit'; this.idleT = 1.5; Sfx.play('flap', 0, 0.5); this.lockTg = false; }
      if (tp) this.state = 'fly';
    } else if (this.state === 'fly') {
      const side = Math.sign(this.x - tp.x) || 1, hx = clamp(tp.x + side * 46, Cam.viewL() + 20, Cam.viewR() - 20), hy = Math.max(Cam.viewT() + 20, tp.y - 86 + Math.sin(this.t * 3) * 8);
      const d = this.steer(hx, hy, st.speed, 3.5, dt);
      if (this.has(10) && this.fireCd <= 0 && this.phoenixLine(G)) { this.fireCd = 14; }
      else if (this.has(8) && this.magicCd <= 0 && d < 140) { this.state = 'cast'; this.castT = 0; this.castTo = { ...tp }; this.emo('bolt', 0.9); Sfx.play('chargeFull', 0, 0.6); }
      else if (this.cd <= 0 && d < 70) { this.state = 'dive'; this.diveT = 0; this.second = this.has(5); Sfx.play('squawk', 0, 0.5); }
      if (this.has(7) && this.volleyCd <= 0 && d < 120) { this.volleyCd = 4.5; this.volley(tp, st); }
    } else if (this.state === 'cast') {
      this.castT += dt; this.vx *= Math.exp(-6 * dt); this.vy = damp(this.vy, -30, 4, dt); this.castTo = { ...tp };
      if (Math.random() < 0.6) FX.burst(this.x + rand(-14, 14), this.y + rand(-14, 14), { n: 1, speed: 20, size: 1, color: 'g2', color2: 'n8', grav: -40, life: 0.3, water: false });
      FX.light(this.x, this.y, 90, [150, 220, 255], 0.9);
      if (this.castT > 0.55) { this.lightning(this.castTo, st); this.state = 'fly'; this.magicCd = 9; }
    } else if (this.state === 'dive') {
      this.diveT += dt; const dx = tp.x - this.x, dy = tp.y - this.y, d = Math.hypot(dx, dy) || 1, sp = st.speed * (this.coop ? 2.4 : 1.9);
      this.vx = damp(this.vx, (dx / d) * sp, 9, dt); this.vy = damp(this.vy, (dy / d) * sp, 9, dt);
      if (d < 16) this.strike(tp, st);
      else if (this.diveT > 0.9) { this.state = 'fly'; this.cd = 0.4; this.coop = false; this.lockTg = false; }
    } else if (this.state === 'rise') {
      this.riseT -= dt; this.vy += 500 * dt; this.vx *= Math.exp(-2 * dt);
      if (this.riseT <= 0) { if (this.second) { this.second = false; this.state = 'dive'; this.diveT = 0; } else { this.state = 'fly'; this.cd = st.cd; this.lockTg = false; } }
    }
    if (this.state === 'dive' && tp) this.face = Math.sign(tp.x - this.x) || this.face;
    this.integrate(dt);
    this.updateFeathers(dt, G, st);
  },
  /* move, face the way she flies, beat the wings (swept back in a dive) */
  integrate(dt, beatOverride) {
    this.x += this.vx * dt; this.y += this.vy * dt;
    if (Math.abs(this.vx) > 25 && this.state !== 'dive') this.face = Math.sign(this.vx);
    const beat = beatOverride || (this.state === 'dive' ? 0 : this.vy < -60 ? 16 : 11);
    this.flapT += dt * beat;
    const want = this.state === 'dive' ? -1.5 : -0.45 + (Math.sin(this.flapT) * 0.5 + 0.5) * 2.2;
    this.wingA = this.state === 'dive' ? damp(this.wingA, want, 20, dt) : want;
    if (beat && Math.sin(this.flapT) > 0.97 && Math.random() < 0.5) Sfx.play('flap', 0, 0.25);
  },
  strike(tp, st) {
    const lv = this.d, crit = this.coop || Math.random() < st.crit, dmg = st.dmg * (crit ? 2 : 1) * (this.coop ? 1.6 : 1), f = this.face;
    const tg = this.tg;
    if (tg && tg.e) { const e = tg.e; e.hurt(dmg, f * 240, -200, { stun: this.has(3) ? 0.75 : 0.3 }); if (this.has(2)) e.marked = 5; this.gainXp(4); if (e.hp <= 0) { G.kill(e, G.captain); this.gainXp(10); this.emo('heart', 1); } }
    else if (tg && tg.hawk) { tg.hawk.hurt(dmg * 1.5, f); this.gainXp(4); }
    else if (tg && tg.t) { tg.t.damage(dmg, G); this.gainXp(4); }
    else if (tg && tg.eye) { G.kraken.hitEye(dmg * 1.2, G); this.gainXp(6); }
    else if (tg && tg.boss) { tg.boss.hitAt(tp.x, tp.y, dmg, G, 'bon'); this.gainXp(5); }
    FX.hitSpark(tp.x, tp.y, f > 0 ? 0.6 : Math.PI - 0.6, crit); FX.stop(crit ? 0.05 : 0.03);
    FX.burst(tp.x, tp.y, { n: 5, speed: 160, size: 1, color: 'r4', color2: 'n7', grav: 300, life: 0.5, water: false });
    Sfx.play('peck', clamp((tp.x - Cam.x) / 700, -1, 1), 1);
    if (crit) { critFX(tp.x, tp.y, dmg); this.emo('star', 0.9); }
    if (this.coop) { FX.text(tp.x, tp.y - 110, '连携！', '#ffd84a', 22, 0.9); this.coop = false; }
    if (lv.gear.bell && Math.random() < 0.12 * lv.gear.bell) { const n = randi(1, 3); G.silver += n; Coins.burst(tp.x, tp.y - 10, n, 0.5); }
    this.state = 'rise'; this.riseT = 0.32; this.vy = -420; this.vx = f * 260;
  },
  /* Lv4 team move: the captain's third combo hit calls her down on the same raider */
  coopDive(e) {
    if (!this.has(4) || this.coopCd > 0 || e.dead || ['carry', 'rescue', 'phoenix', 'cast', 'ride'].includes(this.state)) return;
    this.tg = { e }; this.lockTg = true; this.state = 'dive'; this.diveT = 0; this.coop = true; this.second = false; this.coopCd = 3; this.linkT = 0.35; this.emo('excl', 0.8);
    if (Math.hypot(this.x - e.cx, this.y - e.cy) < 30) { this.y -= 60; }
  },
  /* Lv9 team move: she rides the captain's wind blade as a feather tornado */
  ride(w) { if (!this.has(9) || ['carry', 'rescue'].includes(this.state)) return; w.tornado = true; w.dmg *= 1.5; this.rideW = w; this.state = 'ride'; this.emo('excl', 0.8); Sfx.play('squawk', 0, 1); },
  /* Lv8 magic: a lightning bolt from the sky onto the target; everyone close is dazed */
  lightning(tp, st) {
    const top = Cam.viewT() - 10, pts = [[tp.x, top]]; let y = top;
    while (y < tp.y) { y = Math.min(tp.y, y + rand(24, 44)); pts.push([tp.x + rand(-22, 22) * (y < tp.y ? 1 : 0), y]); }
    this.bolts = this.bolts || []; this.bolts.push({ pts, t: 0.32 });
    Sky.flash = Math.max(Sky.flash, 0.55); Cam.shake(0.12); Sfx.play('thunder', 0, 0.6); Sfx.play('crit', 0, 0.6);
    FX.light(tp.x, tp.y, 260, [170, 220, 255], 1.6); FX.burst(tp.x, tp.y, { n: 24, speed: 380, size: 1, color: 'white', color2: 'g2', grav: 400, life: 0.5, kind: 'spark', water: false });
    const dmg = st.dmg * 3;
    for (const e of G.enemies) if (!e.dead && !e.water && Math.hypot(e.cx - tp.x, e.cy - tp.y) < 60) { e.hurt(dmg, Math.sign(e.x - tp.x || 1) * 200, -300, { stun: 1.2 }); this.gainXp(3); if (e.hp <= 0) { G.kill(e, G.captain); this.gainXp(10); } }
    for (const h of G.hawks || []) if (!h.dead && Math.hypot(h.x - tp.x, h.y - tp.y) < 70) h.hurt(dmg, 1);
    for (const tn of G.tentacles) { const p = tn.hitPoint(tp.x, tp.y, 50); if (p) tn.damage(dmg, G); }
    if (G.kraken && G.kraken.eyeHit(tp.x, tp.y, 40)) G.kraken.hitEye(dmg, G);
    if (G.boss && G.boss.hitAt) G.boss.hitAt(tp.x, tp.y, dmg, G, 'magic');
    FX.text(tp.x, tp.y - 70, '雷羽！', '#bfe8ff', 20, 0.9);
  },
  /* Lv10 magic: she bursts into flame and tears straight through the raiders on one deck */
  phoenixLine(G) {
    const cap = G.captain, foes = G.enemies.filter((e) => !e.dead && !e.water && e.ship && this.onScreen(e.cx, e.cy));
    if (foes.length < 2) return false;
    const s = foes.sort((a, b) => Math.abs(a.x - cap.x) - Math.abs(b.x - cap.x))[0].ship, dir = this.x < s.x ? 1 : -1;
    const a = s.toWorld(-dir * (s.walk + 50), s.deckY(0) - 34), b = s.toWorld(dir * (s.walk + 50), s.deckY(0) - 34);
    this.px = { a, b, ship: s, stage: 0, t: 0, hit: new Set() }; this.state = 'phoenix'; this.emo('fire', 1.2); Sfx.play('roar', 0, 0.35); Sfx.play('chargeFull', 0, 1);
    FX.text(this.x, this.y - 40, '凤凰！', '#ffb050', 22, 1);
    return true;
  },
  updatePhoenix(dt, G, st) {
    const p = this.px; p.t += dt;
    if (p.stage === 0) { const d = this.steer(p.a.x, p.a.y, st.speed * 2.2, 8, dt); this.integrate(dt, 20); if (d < 20 || p.t > 1.2) { p.stage = 1; p.t = 0; Sfx.play('wave', 0, 1); } }
    else {
      const k = Math.min(1, p.t / 0.55); this.vx = (p.b.x - p.a.x) / 0.55; this.vy = 0; this.x = lerp(p.a.x, p.b.x, k); this.y = lerp(p.a.y, p.b.y, k); this.face = Math.sign(this.vx) || 1; this.wingA = -1.5;
      for (let i = 0; i < 3; i++) FX.burst(this.x - this.face * rand(4, 20), this.y + rand(-8, 8), { n: 1, angle: this.face > 0 ? Math.PI : 0, spread: 0.6, speed: 90, size: 2, color: 'f5', color2: 'f2', grav: -120, life: 0.5, kind: 'ember', water: false });
      FX.light(this.x, this.y, 180, [255, 160, 70], 1.3);
      for (const e of G.enemies) {
        if (e.dead || e.water || p.hit.has(e) || Math.abs(e.cx - this.x) > 26 || Math.abs(e.cy - this.y) > 50) continue;
        p.hit.add(e); const crit = Math.random() < st.crit, dmg = st.dmg * 2.5 * (crit ? 2 : 1);
        e.hurt(dmg, this.face * 420, -380, { stun: 0.8 }); Salvage.burnActor(e, 3); FX.hitSpark(e.cx, e.cy, this.face > 0 ? 0 : Math.PI, true); FX.stop(0.04); Sfx.play('fire', e.pan(), 0.8);
        if (crit) critFX(e.cx, e.cy, dmg); this.gainXp(3); if (e.hp <= 0) { G.kill(e, G.captain); this.gainXp(10); }
      }
      if (k >= 1) { this.state = 'fly'; this.px = null; this.cd = st.cd; this.vy = -300; }
    }
  },
  /* Lv7: three feather blades flung at the target */
  volley(tp, st) {
    for (let i = -1; i <= 1; i++) { const a = Math.atan2(tp.y - this.y, tp.x - this.x) + i * 0.18; this.feathers.push({ x: this.x, y: this.y, vx: Math.cos(a) * 760, vy: Math.sin(a) * 760, life: 0.6, dmg: st.dmg * 0.5, hit: new Set() }); }
    Sfx.play('swing', 0, 0.5);
  },
  updateFeathers(dt, G, st) {
    for (const p of this.feathers) {
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt;
      for (const e of G.enemies) {
        if (e.dead || e.water || p.hit.has(e) || Math.hypot(e.cx - p.x, e.cy - p.y) > 20) continue;
        p.hit.add(e); e.hurt(p.dmg, Math.sign(p.vx) * 160, -120, { stun: 0.25 }); FX.hitSpark(p.x, p.y, Math.atan2(p.vy, p.vx), false); this.gainXp(2);
        if (e.hp <= 0) { G.kill(e, G.captain); this.gainXp(10); } p.life = 0;
      }
    }
    this.feathers = this.feathers.filter((p) => p.life > 0);
  },
  draw(ctx, t) {
    if (!this.d) return;
    const look = this.look(), fly = this.state !== 'perch';
    let pose = 'sit';
    if (!fly) { if (this.pose === 'preen') pose = Math.floor(t * 5) % 3 === 0 ? 'preen2' : 'preen'; else if (this.blinkT < 0.13) pose = 'blink'; }
    if (this.state === 'phoenix') look.fire = true;
    const img = bonCompose(fly ? 'fly' : pose, this.wingA, look, t), flip = this.face < 0;
    // team link: a gold thread from the captain to her for a moment
    if (this.linkT > 0) { const c = G.captain; P.line(ctx, Cam.bx(c.x), Cam.by(c.y - 40), Cam.bx(this.x), Cam.by(this.y), C[Math.floor(t * 30) % 2 ? 'gold' : 'f6'], 1); }
    // marked raiders carry a red reticle
    for (const e of G.enemies) if (e.marked > 0 && !e.dead) { const mx = Cam.bx(e.x), my = Cam.by(e.y) - Math.round(46 * e.scale) - 12, r = 4 + (Math.floor(t * 6) % 2); P.ring(ctx, mx, my, r, C.r4); P.dot(ctx, mx, my, C.r4); }
    if (this.state === 'cast') { const r = 10 + Math.floor(this.castT * 30) % 8; P.ring(ctx, Cam.bx(this.x), Cam.by(this.y), r, C[Math.floor(t * 20) % 2 ? 'g2' : 'n8']); }
    if (fly) { const a = clamp(Math.atan2(this.vy, Math.abs(this.vx) + 1), -0.9, 1.1) * (this.state === 'dive' ? 1 : 0.5); blitRot(ctx, img, Cam.bx(this.x), Cam.by(this.y), a, 18, 16, flip); }
    else { const bob = this.pose === 'sit' && Math.floor(t * 1.3) % 4 === 0 ? 1 : 0; blit(ctx, img, Cam.bx(this.x), Cam.by(this.y) + bob, flip, 18, 21); }
    for (const p of this.feathers) { const bx = Cam.bx(p.x), by = Cam.by(p.y), c = Math.cos(Math.atan2(p.vy, p.vx)), s = Math.sin(Math.atan2(p.vy, p.vx)); P.line(ctx, bx - c * 4, by - s * 4, bx, by, C.r4, 1); P.dot(ctx, bx, by, C.n8); }
    // lightning bolts from Lv8 magic
    for (const b of this.bolts || []) { b.t -= 1 / 60; if (b.t <= 0 || (b.t < 0.15 && Math.random() < 0.3)) continue; for (let i = 1; i < b.pts.length; i++) { const p0 = b.pts[i - 1], p1 = b.pts[i]; P.line(ctx, Cam.bx(p0[0]), Cam.by(p0[1]), Cam.bx(p1[0]), Cam.by(p1[1]), C.n8, 3); P.line(ctx, Cam.bx(p0[0]), Cam.by(p0[1]), Cam.bx(p1[0]), Cam.by(p1[1]), C.white, 1); } }
    if (this.bolts) this.bolts = this.bolts.filter((b) => b.t > 0);
    // emote bubble
    if (this.emote && G.state !== 'title') {
      const e = this.emote, ic = SPR['emo_' + e.k], bx = Cam.bx(this.x) - 6, by = Cam.by(this.y) - (fly ? 30 : 34) - (e.max - e.t < 0.1 ? 2 : 0);
      if (!(e.t < 0.25 && Math.floor(t * 20) % 2)) { P.rect(ctx, bx, by, 13, 11, C.ink); P.rect(ctx, bx + 1, by + 1, 11, 9, C.b4); P.rect(ctx, bx + 3, by + 11, 3, 2, C.ink); P.dot(ctx, bx + 4, by + 11, C.b4); blit(ctx, ic, bx + 3, by + 2); }
    }
  },
  light(L) { if (this.d && (this.has(10) || this.state === 'phoenix')) L.push({ x: this.x, y: this.y - 8, r: this.state === 'phoenix' ? 160 : 70, c: [255, 190, 100], i: this.state === 'phoenix' ? 1.2 : 0.6 }); },
};

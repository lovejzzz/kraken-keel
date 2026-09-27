'use strict';
/* The voyage: encounters, refits, route choice, rendering and HUD glue. */
const SLOT_LX = [-146, -98, -50, 50, 98, 146];
const ENC = {
  skiffs: { name: '峡湾口', sub: '海盗划着小艇扑上来。把他们打下海。', rune: 'ᚠᛃᛟᚱᛞ', storm: 0.35, reward: 30, script: [{ at: 1, skiff: 1, crew: ['raider', 'raider'] }, { at: 9, skiff: -1, crew: ['raider', 'spear', 'raider'] }, { at: 20, skiff: 1, crew: ['shield', 'spear'] }] },
  rival: { name: '红帆长船', sub: '一条敌船靠上来了。砍断它的桅杆，或者用弩炮击沉它。', rune: 'ᚱᛟᛏ', storm: 0.4, reward: 60, script: [{ at: 1, ship: { side: 1, pal: 'raider', hull: 320, crew: ['raider', 'spear', 'shield', 'archer', 'thrower', 'raider'] } }] },
  storm: { name: '风暴航道', sub: '闪电、巨浪。海底有东西醒了。', rune: 'ᛊᛏᚢᚱᛗ', storm: 1, reward: 55, script: [{ at: 1, skiff: -1, crew: ['raider', 'raider'] }, { at: 5, slam: 1 }, { at: 9, slam: 1 }, { at: 12, skiff: 1, crew: ['spear', 'shield', 'raider'] }, { at: 15, slam: 2 }, { at: 18, climb: 2 }, { at: 21, slam: 1 }, { at: 24, skiff: -1, crew: ['berserker', 'firepot'] }] },
  nest: { name: '触手巢', sub: '一片翻涌的黑水。触手会拍向黑暗的地方，溺尸从水里爬上来。', rune: 'ᚾᛖᛊᛏ', storm: 0.8, dark: 0.3, reward: 70, script: [{ at: 1, slam: 1 }, { at: 4, slam: 2 }, { at: 7, climb: 2 }, { at: 9, skiff: 1, crew: ['firepot', 'raider'] }, { at: 11, slam: 2 }, { at: 14, sweep: 1 }, { at: 17, climb: 3 }, { at: 19, slam: 2 }, { at: 21, skiff: -1, crew: ['shield', 'spear'] }, { at: 25, slam: 3 }] },
  twin: { name: '夹击', sub: '首领的长船从一侧逼近，小艇从另一侧包抄。当心钩手。', rune: 'ᛏᚹᛁᚾ', storm: 0.55, reward: 85, script: [{ at: 1, ship: { side: 1, pal: 'raider', hull: 380, crew: ['chieftain', 'hookman', 'archer', 'shield', 'spear', 'raider'] } }, { at: 6, skiff: -1, crew: ['firepot', 'raider'] }, { at: 20, skiff: -1, crew: ['shield', 'spear', 'raider'] }] },
  ghost: { name: '幽灵船', sub: '雾里驶来一条没有活人的船。亡灵怕火光。', rune: 'ᛞᚱᚨᚢᚷᚱ', storm: 0.5, fog: 1, dark: 0.45, reward: 90, script: [{ at: 1, ship: { side: -1, pal: 'ghost', hull: 380, crew: ['draugr', 'draugr', 'draugrShield', 'draugr', 'draugrShield', 'draugr'] } }, { at: 12, climb: 2 }, { at: 24, climb: 3 }] },
  berserk: { name: '狂战士', sub: '不要命的家伙们冲过来，后面是首领的船，带着火罐和钩子。', rune: 'ᛒᛖᚱᛊᛖᚱᚲ', storm: 0.6, reward: 95, script: [{ at: 1, skiff: 1, crew: ['berserker', 'raider'] }, { at: 4, skiff: -1, crew: ['berserker', 'shield'] }, { at: 10, ship: { side: 1, pal: 'raider', hull: 320, crew: ['chieftain', 'hookman', 'firepot', 'archer', 'berserker'] } }, { at: 22, skiff: -1, crew: ['berserker', 'spear'] }] },
  kraken: { name: '海妖', sub: '深渊睁开了眼睛。趁它睁眼时攻击。', rune: 'ᚲᚱᚨᚲᛖᚾ', storm: 0.9, dark: 0.2, reward: 0, boss: true, script: [{ at: 2, kraken: 1 }] },
};
const ROUTE = [['skiffs'], ['rival', 'storm'], ['nest', 'twin'], ['ghost', 'berserk'], ['kraken']];
/* everything the refit sells: the captain's kit (his own page, by tab) and the ship's (the strip at the bottom) */
const UPGRADES = {
  oar: { name: '船桨', cost: 45, desc: '船桨伤害 +30%', max: 2, max2: 4, icon: 'u_oar', tab: 'weapon', weapon: true, unlock: 0, style: '三连击 · 蓄力横扫 · 击退最强', per: 0.3 },
  cutlass: { name: '水手弯刀', cost: 50, desc: '弯刀伤害 +25%，流血更深', max: 2, max2: 4, icon: 'u_cutlass', tab: 'weapon', weapon: true, unlock: 80, style: '四连快斩 · 流血 · 蓄力冲刺斩', per: 0.25 },
  scatter: { name: '霰弹弩', cost: 60, desc: '多一支弩箭，伤害 +20%', max: 2, max2: 4, icon: 'u_scatter', tab: 'weapon', weapon: true, unlock: 120, style: '远程散射 · 贴脸最痛 · 蓄力穿透', per: 0.2 },
  whet: { name: '磨利桨刃', cost: 40, desc: '暴击 +6%', max: 2, max2: 3, icon: 'u_whet', tab: 'weapon' },
  rune: { name: '雷纹符文', cost: 55, desc: '蓄力快 30%', max: 1, icon: 'u_rune', tab: 'weapon' },
  rope: { name: '海豹皮靴', cost: 30, desc: '跳得更高', max: 2, icon: 'u_boots', tab: 'armor' },
  fur: { name: '熊皮大衣', cost: 35, desc: '生命 +40', max: 2, max2: 4, icon: 'u_fur', tab: 'armor' },
  helm: { name: '铁盔', cost: 50, desc: '受到伤害 -15%', max: 2, max2: 3, icon: 'u_helm', tab: 'armor' },
  mead: { name: '一角蜜酒', cost: 15, desc: '回满生命', max: 99, icon: 'u_mead', tab: 'food' },
  fish: { name: '烤鳕鱼', cost: 8, desc: '生命 +35', max: 99, icon: 'u_fish', tab: 'food' },
  repair: { name: '补船', cost: 20, desc: '船体 +80 补洞', max: 99, icon: 'u_hammer', ship: true },
  keel: { name: '加固龙骨', cost: 45, desc: '船体上限 +80', max: 2, max2: 4, icon: 'u_keel', ship: true },
  plate: { name: '铁皮包船', cost: 50, desc: '船体受损 -15%', max: 2, max2: 3, icon: 'u_plate', ship: true },
};
sprite('u_oar', ['........bb', '.......bWb', '......bWb.', '.....bWb..', '....mWm...', '...bWb....', '..mWm.....', '.bWb......', 'bWb.......', 'bb........'], { b: 'w1', W: 'w5', m: 'm3' });
sprite('u_cutlass', ['.......mM.', '......mM..', '.....mM...', '....mM....', '...mM.....', '.gmM......', '..gg......', '.bgg......', 'bb........', 'b.........'], { m: 'm3', M: 'm4', g: 'gold', b: 'w2' });
sprite('u_scatter', ['m.........', '.m....s...', '..mmmmmmMM', '.m.wwWWm..', 'm..wW.s...', '...wW.....', '...ww.....', '..........'], { m: 'm3', M: 'm4', w: 'w3', W: 'w5', s: 'b3' });
sprite('cutlass', ['.gg.', 'gGGg', '.bb.', '.bb.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '..wW', '..wW', '...W'], { g: 'gold', G: 'f5', b: 'w2', w: 'm3', W: 'm4' });
sprite('scatterbow', ['....ww.....', '....wW.....', '....wW.....', '....wW.....', '...kwWk....', '....wW.....', 's...wW...s.', '.s..wW..s..', '..ssmmmss..', '...mMMMm...', '...m.m.m...', '...M.M.M...'], { w: 'w3', W: 'w5', k: 'm1', s: 'b3', m: 'm2', M: 'm4' });
sprite('u_whet', ['..........', '.......f..', '......fYf.', '.......f..', '.mmmmmm...', 'mMMMMMMm..', 'mMmMmMMm..', '.mmmmmm...', '..........'], { m: 'm1', M: 'm3', f: 'f5', Y: 'white' });
sprite('u_rune', ['...ssss...', '..sSSSSs..', '.sSSgSSSs.', '.sSSgSSSs.', '.sSgggSSs.', '.sSSSgSSs.', '.sSSSgSSs.', '.ssssssss.'], { s: 'm0', S: 'm2', g: 'g2' });
sprite('u_boots', ['..bbb.....', '..bBb.....', '..bBb.....', '..bBb.....', '..bBbbbb..', '..bBBBBBb.', '..bbbbbbb.', '..........'], { b: 'w1', B: 'w5' });
sprite('u_fur', ['.ff....ff.', 'fFFf..fFFf', 'fFFFffFFFf', '.fFFFFFFf.', '.fFFtFFFf.', '.fFFtFFFf.', '.fFFtFFFf.', '.ffffffff.'], { f: 'w2', F: 'w5', t: 'b2' });
sprite('u_helm', ['...mmmm...', '..mMMMMm..', '.mMMWMMMm.', '.mMMMMMMm.', '.mmmmmmmm.', '.m..MM..m.', '.m..MM..m.', '..........'], { m: 'm1', M: 'm3', W: 'm4' });
sprite('u_mead', ['.b........', '.bb.......', '..bbb.....', '..bBBbb...', '...bBBBbb.', '....bBBBYb', '.....bbYYb', '.......bb.'], { b: 'w2', B: 'b2', Y: 'f5' });
sprite('u_fish', ['..........', '...ssss..t', '.sSSSSSs.t', 'sESSsSSSst', '.sSSSSSs.t', '...ssss..t', '..........'], { s: 'f1', S: 'f3', E: 'ink', t: 'f2' });
sprite('u_hammer', ['.mmmm.....', '.mMMm.....', '.mmmmw....', '.....ww...', '......ww..', '.......ww.', '........w.', '..........'], { m: 'm1', M: 'm3', w: 'w5' });
sprite('u_keel', ['..........', 'w........w', 'ww......ww', '.wWWWWWWw.', '..wwwwww..', '....kk....', '..........'], { w: 'w2', W: 'w5', k: 'm3' });
sprite('u_plate', ['mmmmmmmmm.', 'mMrMMMrMm.', 'mMMMMMMMm.', 'mMrMMMrMm.', 'mmmmmmmmm.', '..........'], { m: 'm1', M: 'm3', r: 'm4' });

const G = {
  state: 'title', t: 0, ships: [], enemies: [], tentacles: [], shots: [], player: null, captain: null, kraken: null, silver: 60, step: 0, enc: null, encT: 0, script: [],
  timers: [], hint: '', ups: {}, stats: { kills: 0, overboard: 0, ships: 0, tentacles: 0, time: 0 }, route: [], bannerT: 0, lights: [], ambient: [70, 86, 120], darkK: 0, fogK: 0,
  ctx: null, lc: null, lctx: null, grain: null,

  init() {
    const cv = document.getElementById('game'); this.cv = cv; this.ctx = cv.getContext('2d', { willReadFrequently: true });
    Cam.resize(cv); TXT.init(cv); addEventListener('resize', () => { Cam.resize(cv); TXT.resize(); this.sizeLight(); });
    this.sizeLight();
    Input.init(cv); Touch.init(cv); Sky.build(); Bon.load();
    this.newRun(true);
    UI.init();
    let last = performance.now();
    const loop = (now) => { const dt = Math.min(0.033, (now - last) / 1000); last = now; this.frame(dt); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    // test mode keeps simulating when the tab is hidden (automated play-tests)
    if (location.search.includes('test')) setInterval(() => { const now = performance.now(); if (now - last > 60) { this.frame(Math.min(0.033, (now - last) / 1000)); last = now; } }, 33);
  },
  sizeLight() { this.lc = offscreen(Math.ceil(Cam.BW / 2), Math.ceil(Cam.BH / 2)); this.lctx = this.lc.getContext('2d'); this.ctx.imageSmoothingEnabled = false; },
  newRun(title = false) {
    this.ships = []; this.enemies = []; this.tentacles = []; this.shots = []; this.kraken = null; this.timers = []; this.crates = []; this.fires = []; this.parts = 0; this.silverPending = 0; Coins.list = []; Waves.list = []; Sky.dawnTarget = 0; Sky.dawn = 0; if (window.UI) UI.coins = [];
    this.player = new Ship({ x: 0, team: 'player', pal: 'player', hull: 420, hullMax: 420, L: 226 });
    this.player.slots = SLOT_LX.map((lx) => ({ lx, mod: null }));
    this.player.slots[1].mod = this.makeModule('ballista', SLOT_LX[1]); this.player.slots[4].mod = this.makeModule('brazier', SLOT_LX[4]);
    this.ships.push(this.player);
    this.captain = new Captain({}); this.captain.land(this.player, -20);
    this.silver = 60; this.step = 0; this.ups = {}; this.chapter = 1; this.fullRun = !title; this.wpn = { cur: 'oar', own: { oar: true } }; this.hawks = []; this.ices = []; this.boss = null; if (Sky.theme !== 'sea') Sky.setTheme('sea'); this.floes = []; this.map = SeaMap.generate(1); this.node = null; this.discount = 1; this.stats = { kills: 0, overboard: 0, ships: 0, tentacles: 0, time: 0 };
    Sea.targetStorm = Sea.storm = 0.35; Sea.speed = 60; this.darkK = 0; this.fogK = 0;
    this.state = title ? 'title' : 'route'; Bon.reset();
    if (!title) { Save.clear(); const first = this.map.layers[1][0]; this.map.at = first.id; first.visited = true; this.node = first; UI.screen = null; this.startEncounter(first.enc); }
  },
  makeModule(type, lx) { const d = MODULES[type]; return { type, lx, lv: 1, hp: d.hp, max: d.hp, cd: rand(0.5, 1.5), aim: 0, lit: true, flash: 0, ups: {} }; },
  collectCrate(c) { Salvage.collect(c); },
  /* each level costs 60% more than the last; chapter 2 opens higher tiers */
  upMax(k) { const u = UPGRADES[k]; return this.chapter >= 2 && u.max2 ? u.max2 : u.max; },
  upCost(k) { const u = UPGRADES[k], n = u.max < 10 ? this.ups[k] || 0 : 0; return this.price(Math.round(u.cost * (1 + 0.6 * n))); },
  modules() { return this.player.slots.filter((s) => s.mod && s.mod.hp > 0).map((s) => s.mod); },

  /* ---------- flow ---------- */
  openRoute() { this.state = 'route'; this.discount = 1; UI.screen = 'map'; Sea.targetStorm = 0.25; Save.write('map'); },
  price(c) { return Math.round(c * (this.discount || 1)); },
  startEncounter(key) {
    const e = ENC[key]; this.enc = { key, ...e }; this.encT = 0; this.script = e.script.map((s) => ({ ...s })); this.state = 'fight';
    Sea.targetStorm = e.storm; this.darkK = e.dark || 0; this.fogK = e.fog || 0; Sea.speed = 70;
    this.banner(e.name, e.sub, '#ffd8a0', 2.6, e.rune); Sky.dawnTarget = 0; if (e.boss) Sky.surge(this);
    Sfx.play(e.boss ? 'roar' : 'horn', 0, 1);
    UI.hideAll(); UI.hud(true);
  },
  endEncounter() {
    if (this.enc && this.enc.boss) return;
    this.shots = this.shots.filter((p) => p.team === 'player'); this.timers = []; this.fires = []; this.ices = []; this.captain.frozen = 0; Salvage.sweep();
    this.captain.iframes = 3; if (this.captain.down > 0) { this.captain.down = 0.01; }
    this.state = 'won'; this.wonT = 0; Bon.full = Math.max(0, Bon.full - 22); Bon.gainXp(15); FX.text(Bon.x, Bon.y - 34, '经验 +15', '#ffd84a', 18, 1.4);
    const nr = this.node && this.node.reward, r = nr && nr.silver != null ? nr.silver : this.enc.reward + this.step * 5; this.silver += r;
    if (nr && nr.parts) { const cp = this.captain; this.parts += nr.parts; this.timers.push({ t: 1.0, f: () => UI.partBurst(cp.x, cp.y - 120, nr.parts) }); }
    this.banner('海面平静了', '修整你的船', '#9fe8b0', 2);
    // the purse from the fight rains down on the captain
    const cp = this.captain; this.timers.push({ t: 0.6, f: () => Coins.burst(cp.x, cp.y - 160, r, 0.7) });
    Sfx.play('win', 0, 1); Sea.targetStorm = 0.2; this.darkK = 0; this.fogK = 0;
  },
  openRefit(harbor = false) {
    const cap = this.captain, ps = this.player;
    if (cap.ship !== ps || cap.water || cap.air) { cap.water = false; cap.climb = null; cap.onRope = null; cap.x = ps.x; cap.land(ps, 0); FX.text(cap.x, cap.y - 90, '船员把你接回了船上', '#9fe8b0', 18, 1.4); }
    this.state = 'refit'; this.refitHarbor = harbor; this.player.bias = 0; UI.refit(harbor); Save.write(harbor ? 'harbor' : 'refit');
  },
  lose() {
    if (this.state === 'lost') return;
    this.state = 'lost'; this.lostT = 0; Sfx.play('lose', 0, 1); Cam.shake(0.3); Save.clear();
    this.banner('龙骨断了', '船沉入了海底', '#ff9a7a', 3);
    setTimeout(() => UI.end(false), 2600);
  },
  bossGone(w) {
    Sky.auroraK = 2.5; Sea.targetStorm = 0.15; this.fogK = 0; FX.splash(w.hx, 3); Sfx.play('splashBig', 0, 1);
    this.timers.push({ t: 1.5, f: () => { this.boss = null; } }, { t: 3.5, f: () => { this.state = 'victory'; Sea.targetStorm = 0.1; UI.end(true); Sfx.play('win', 0, 1); } });
  },
  krakenDies(K) {
    FX.slowmo(0.2, 1.4); Cam.shake(0.45); Sfx.play('roar', 0, 1); Sky.strike(null, false); Sea.targetStorm = 0.12; this.fogK = 0; this.timers.push({ t: 1.2, f: () => { Sky.dawnTarget = 1; } }); setTimeout(() => Sfx.play('splashBig', 0, 1), 900);
    for (const t of this.tentacles) { t.hp = 0; }
    const e = K.eyePos; FX.burst(e.x, e.y, { n: 80, speed: 700, size: 6, color: 'g2', life: 1.6, add: true, grav: 300 });
    this.banner('深渊安静了', '海妖沉回了海底', '#8ff0ff', 3.5);
    setTimeout(() => { this.state = 'victory'; Sea.targetStorm = 0.1; this.darkK = 0; UI.end(true); Sfx.play('win', 0, 1); }, 4200);
  },
  banner(title, sub, col = '#ffd8a0', dur = 2.2, rune = '') { UI.banner(title, sub, col, dur, rune); },

  /* ---------- spawning ---------- */
  spawnShip(o) {
    const ps = this.player, side = o.side;
    const s = new Ship({ x: ps.x + side * 1900, team: 'enemy', pal: o.pal, hull: o.hull, hullMax: o.hull, dir: -side, accel: 90, L: 212 });
    s.tx = ps.x + side * (ps.L + s.L + 70); s.vx = -side * 60; s.ballCd = 6; s.boardCd = 3; s.slots = [];
    this.ships.push(s);
    o.crew.forEach((type, i) => {
      const e = new Enemy({ type, hpMul: 1 + this.step * 0.08, value: type === 'chieftain' ? 70 : type === 'berserker' ? 12 : type.includes('Shield') || type === 'shield' ? 9 : 7 });
      e.role = STATS[type].ranged ? 'thrower' : 'boarder'; e.land(s, lerp(-s.walk + 30, s.walk - 30, (i + 0.5) / o.crew.length)); this.enemies.push(e);
    });
    if (o.pal === 'ghost') s.ghost = true;
  },
  spawnSkiff(side, crew) {
    const ps = this.player;
    const s = new Ship({ x: ps.x + side * 1500, kind: 'skiff', team: 'enemy', pal: this.chapter === 2 ? 'frost' : 'raider', dir: -side, accel: 140, hull: 70 });
    s.tx = ps.x + side * (ps.L + s.L + 40); s.vx = -side * 120; s.crewLeft = crew.length;
    this.ships.push(s);
    crew.forEach((type, i) => { const e = new Enemy({ type, hpMul: 1 + this.step * 0.08, value: type === 'berserker' ? 12 : 7 }); e.role = STATS[type].ranged ? 'thrower' : 'boarder'; e.land(s, lerp(-40, 40, crew.length > 1 ? i / (crew.length - 1) : 0.5)); this.enemies.push(e); });
  },
  spawnSlam(delay = 0) {
    this.timers.push({ t: delay, f: () => {
      const ps = this.player, cap = this.captain;
      let lx = cap.ship === ps && Math.random() < 0.65 ? cap.lx + rand(-70, 70) : rand(-ps.walk + 40, ps.walk - 40);
      for (const m of this.modules()) if (m.type === 'brazier' && m.lit && Math.abs(m.lx - lx) < 130) lx = m.lx + Math.sign(lx - m.lx || 1) * 150;
      lx = clamp(lx, -ps.walk + 30, ps.walk - 30);
      const hpBase = this.kraken ? 55 : 70;
      this.tentacles.push(new Tentacle({ ship: ps, lx, mode: 'slam', hp: hpBase + this.step * 6, layer: Math.random() < 0.5 ? 'front' : 'back' }));
    } });
  },
  climbers(n) {
    const ps = this.player;
    for (let i = 0; i < n; i++) {
      this.timers.push({ t: i * 0.7, f: () => {
        const side = pick([-1, 1]), p = ps.toWorld(side * (ps.L + 50), 0);
        const e = new Enemy({ type: Math.random() < 0.7 ? 'drowned' : Math.random() < 0.5 ? 'draugrShield' : 'draugr', hpMul: 1 + this.step * 0.08, value: 8 });
        e.x = p.x; e.y = Sea.height(p.x) + 10; e.air = true; this.enemies.push(e);
        e.swingPath = { t: 0, dur: 0.8, leap: true, p0: { x: e.x, y: e.y }, landLx: side * rand(ps.walk * 0.5, ps.walk - 10), ship: ps };
        FX.splash(p.x, 1); e.face = -side;
      } });
    }
  },
  runScript(dt) {
    this.encT += dt;
    for (const ev of this.script) {
      if (ev.done || this.encT < ev.at) continue; ev.done = true;
      if (ev.skiff) this.spawnSkiff(ev.skiff, ev.crew);
      if (ev.ship) this.spawnShip(ev.ship);
      if (ev.slam) for (let i = 0; i < ev.slam; i++) this.spawnSlam(i * 0.5);
      if (ev.sweep) this.tentacles.push(new Tentacle({ ship: this.player, lx: pick([-1, 1]), mode: 'sweep', hp: 60, layer: 'front' }));
      if (ev.climb) this.climbers(ev.climb);
      if (ev.wyrm) { this.boss = new Wyrm(this); this.banner('霜龙', '等它扑咬、龙头卡在甲板上时，砸它的头', '#bfe8ff', 3, 'ᚹᛁᚱᛗ'); }
      if (ev.kraken) { this.kraken = new Kraken(this); this.banner('海妖', '弩炮会在它睁眼时射它；二段跳上去砸它的眼睛伤害更高', '#8ff0ff', 3, 'ᚲᚱᚨᚲᛖᚾ'); }
    }
    const pending = this.script.some((e) => !e.done), foes = this.enemies.some((e) => !e.dead && !e.gone), ships = this.ships.some((s) => s.team === 'enemy' && s.kind !== 'skiff' && !s.sunk && !s.defeated);
    const skiffs = this.ships.some((s) => s.kind === 'skiff' && !s.sunk && s.crewLeft > 0);
    if (!pending && !foes && !ships && !skiffs && !this.tentacles.some((t) => !t.gone) && !this.kraken && !this.boss && this.timers.length === 0) this.endEncounter();
  },

  /* ---------- queries used by actors ---------- */
  lightAt(x, y) {
    let v = 0;
    for (const m of this.modules()) if (m.type === 'brazier' && m.lit) { const p = this.player.toWorld(m.lx, -70), d = Math.hypot(p.x - x, p.y - y); v = Math.max(v, 1 - d / 260); }
    for (const s of this.ships) if (s.team === 'enemy' && s.kind !== 'skiff' && !s.sunk) { const p = s.toWorld(0, -80), d = Math.hypot(p.x - x, p.y - y); v = Math.max(v, (1 - d / 260) * 0.8); }
    return clamp(v, 0, 1);
  },
  lightMul(x, y) { let b = 0; for (const m of this.modules()) if (m.type === 'brazier' && m.lit) { const p = this.player.toWorld(m.lx, -70); if (Math.hypot(p.x - x, p.y - y) < 240) b = 0.4; } return 1 + b; },
  /* two attack slots against the captain; the one who has waited longest gets the next free slot */
  attackToken(e) {
    if (e.phase !== 'move') return true;
    const busy = this.enemies.filter((o) => !o.dead && o !== e && (o.phase === 'wind' || o.phase === 'strike') && o.ship === this.captain.ship).length;
    if (busy >= 2) return false;
    const waiting = this.enemies.filter((o) => !o.dead && o.phase === 'move' && o.ship === e.ship && Math.abs(o.x - this.captain.x) < 260);
    const longest = waiting.sort((a, b) => (b.waitT || 0) - (a.waitT || 0));
    return longest.indexOf(e) < 2 - busy;
  },
  nearestModule(e) { let best = null, bd = 1e9; for (const m of this.modules()) { const d = Math.abs(m.lx - e.lx); if (d < bd) { bd = d; best = m; } } return best; },
  wallBetween(e, tx) {
    const tl = this.player.toLocal(tx, 0).x; let best = null;
    for (const m of this.modules()) if (m.type === 'wall' && (m.lx - e.lx) * (tl - m.lx) > 0 && Math.abs(m.lx - e.lx) < 400) { if (!best || Math.abs(m.lx - e.lx) < Math.abs(best.lx - e.lx)) best = m; }
    if (best && Math.abs(best.lx - e.lx) < 24) { e.lx = best.lx - Math.sign(best.lx - e.lx || 1) * 24; e.vu = 0; }
    return best;
  },
  boardReady(s, e) {
    if (s.kind === 'skiff' || s.defeated) return false;
    if (Math.abs(s.x - s.tx) > 80 || s.boardCd > 0) return false;
    const aboard = this.enemies.filter((x) => !x.dead && x.ship === this.player).length;
    if (aboard >= 3 + (this.step > 2 ? 1 : 0)) return false;
    s.boardCd = rand(2.2, 3.6); return true;
  },

  /* ---------- combat resolution ---------- */
  kill(e, by) {
    if (e.type === 'powder' && !e.exploded && !e.dead) { e.exploded = true; const x = e.x, y = e.y - 20; this.timers.push({ t: 0.5, f: () => this.explode(x, y, 110, e.stats.dmg, e) }); }
    if (e.dead) return; e.dead = true; this.stats.kills++;
    if (e.type === 'chieftain') { this.banner('首领倒下了', '', '#ffd46a', 1.8); FX.slowmo(0.3, 0.6); }
    this.silver += e.value; Coins.burst(e.cx, e.water ? Sea.height(e.x) - 6 : e.cy, e.value, e.water ? 0.8 : 1);
    Sfx.play('coin', e.pan(), 0.6); Sfx.play('grunt', e.pan(), 0.9);
    const drop = e.type === 'chieftain' ? 3 : ['archer', 'firepot', 'hookman', 'spear'].includes(e.type) && Math.random() < 0.35 ? 1 : 0;
    if (drop) { this.parts += drop; UI.partBurst(e.x, e.y - 40, drop); }
    if (!this.enemies.some((x) => !x.dead && x !== e) && !this.script.some((x) => !x.done)) { FX.slowmo(0.3, 0.35); Cam.kick(0.05); }
  },
  onOverboard(e) {
    if (e.countedOver) return; e.countedOver = true; this.stats.overboard++;
    if (!e.dead) { e.hp = 0; this.kill(e); this.silver += 3; Coins.burst(e.x, Sea.height(e.x) - 6, 3, 0.8); }
    FX.text(e.x, Sea.height(e.x) - 60, '落水！', '#9fe8ff', 28, 1.1); Cam.kick(0.025);
  },
  hitMast(s, d) {
    const m = s.mast; if (!m || m.cut) return; m.hp -= d; s.flash = 0.5;
    const p = s.toWorld(0, -130); FX.splinters(p.x, p.y, 10); Sfx.play('wood', 0, 1);
    if (m.hp <= 0) {
      m.cut = true; s.defeatedMast = true; Sfx.play('crack', 0, 1); Cam.shake(0.25); FX.slowmo(0.4, 0.5);
      this.silver += 20; this.banner('桅杆断了！', '敌船失去了动力', '#ffd8a0', 1.6); s.ballCd = 99; const mp = s.toWorld(0, -160); Coins.burst(mp.x, mp.y, 20);
    }
  },
  enemyStrike(e, tgt, o = {}) {
    if (this.state !== 'fight') return;
    const cap = this.captain, dmg = (o.dmg || e.stats.dmg) * (1 + this.step * 0.06);
    if (tgt === cap || (cap.ship === e.ship && Math.abs(cap.x - e.x) < e.stats.reach * e.scale + 10)) {
      if (Math.abs(cap.x - e.x) < e.stats.reach * e.scale + 12 && Math.sign(cap.x - e.x) === e.face && Math.abs(cap.y - e.y) < 60) {
        const k = cap.brace ? 0.45 : 1;
        if (cap.hurt(dmg * (cap.brace ? 0.7 : 1), e.face * (o.kx || 380) * k, cap.brace ? 0 : (o.ky || -220))) {
          Sfx.play('hurt', cap.pan(), 1); Cam.shake(0.1); FX.stop(0.06); UI.pulse('hurt');
        }
      } else Sfx.play('swing', e.pan(), 0.4);
      return;
    }
    if (tgt && tgt.type) { tgt.hp -= dmg * 0.8; tgt.flash = 1; const p = this.player.toWorld(tgt.lx, -30); FX.splinters(p.x, p.y, 6); Sfx.play('wood', e.pan(), 0.8); if (tgt.hp <= 0) this.destroyModule(tgt); return; }
    if (tgt === 'hull') { this.player.damage(5, e.lx); }
  },
  destroyModule(m) {
    const p = this.player.toWorld(m.lx, -30); FX.splinters(p.x, p.y, 22); Sfx.play('crack', 0, 1); Cam.shake(0.12);
    FX.text(p.x, p.y - 40, `${MODULES[m.type].name}被毁`, '#ff9a7a', 20, 1.2);
    const sl = this.player.slots.find((s) => s.mod === m); if (sl) sl.mod = null;
  },
  shootArrow(e, cap) {
    const sx = e.x + e.face * 10, sy = e.y - 44, tx = cap.x + cap.vx * 0.35, ty = cap.y - 34, T = clamp(Math.abs(tx - sx) / 950, 0.35, 1);
    this.shots.push(new Projectile({ x: sx, y: sy, vx: (tx - sx) / T - WIND.v * 20 * T, vy: (ty - sy) / T - 0.5 * 500 * T, grav: 500, dmg: e.stats.dmg, team: 'enemy', kind: 'arrow', life: 3 }));
    Sfx.play('ballista', e.pan(), 0.25);
  },
  throwPot(e, cap) {
    const ps = this.player, sx = e.x, sy = e.y - 70;
    // lob it onto the deck near the captain, or at a module when he is away
    const m = Math.random() < 0.4 ? pick(this.modules()) : null, tl = m ? m.lx : clamp(ps.toLocal(cap.x, cap.y).x + rand(-40, 40), -ps.walk, ps.walk);
    const to = ps.toWorld(tl, ps.deckY(tl) - 4), T = clamp(Math.abs(to.x - sx) / 520, 0.6, 1.3);
    this.shots.push(new Projectile({ x: sx, y: sy, vx: (to.x - sx) / T, vy: (to.y - sy) / T - 0.5 * 900 * T, grav: 900, dmg: e.stats.dmg, team: 'enemy', kind: 'pot', life: 4 }));
    Sfx.play('swing', e.pan(), 0.6);
  },
  fireAt(lx) { this.fires.push({ lx, w: 34, t: 6, seed: rand(0, 20) }); Sfx.play('fire', 0, 1); const p = this.player.toWorld(lx, -30); FX.burst(p.x, p.y, { n: 16, speed: 260, size: 2, color: 'f5', color2: 'f2', grav: 500, life: 0.6 }); FX.burst(p.x, p.y, { n: 6, speed: 60, size: 3, color: 'f3', grav: -80, life: 0.8, kind: 'smoke', water: false }); },
  /* the chieftain's ground slam: a shock along the deck, jump to avoid it */
  shockwave(e) {
    const s = e.ship; if (!s) return;
    Sfx.play('slam', e.pan(), 0.9); Cam.shake(0.2);
    const p = s.toWorld(e.lx + e.face * 30, s.deckY(e.lx)); FX.splinters(p.x, p.y, 16); FX.hitSpark(p.x, p.y - 6, -Math.PI / 2, true);
    for (let i = 1; i <= 6; i++) this.timers.push({ t: i * 0.045, f: () => { for (const d of [-1, 1]) { const q = s.toWorld(e.lx + d * i * 28, s.deckY(e.lx + d * i * 28)); FX.burst(q.x, q.y, { n: 3, angle: -Math.PI / 2, spread: 0.5, speed: 200, size: 2, color: 'w5', color2: 'w2', grav: 900, life: 0.4, kind: 'splinter' }); } } });
    const cap = this.captain;
    const big = e.type === 'troll' ? 1.45 : 1;
    if (cap.ship === s && !cap.air && Math.abs(cap.lx - e.lx) < 170 * big && cap.down <= 0) { if (cap.hurt(14 * big * (1 + this.step * 0.06), Math.sign(cap.lx - e.lx) * 260 * big, -600)) { Sfx.play('hurt', cap.pan(), 1); UI.pulse('hurt'); } }
    for (const o of this.enemies) if (o !== e && !o.dead && o.ship === s && !o.air && Math.abs(o.lx - e.lx) < 170 * big) o.knock(Math.sign(o.lx - e.lx) * 200, -400, 0.5);
  },
  throwAxe(e, cap) {
    const sx = e.x, sy = e.y - 60, tx = cap.x + cap.vx * 0.3, ty = cap.y - 40, T = clamp(Math.abs(tx - sx) / 700, 0.5, 1.2);
    this.shots.push(new Projectile({ x: sx, y: sy, vx: (tx - sx) / T - WIND.v * 30 * T, vy: (ty - sy) / T - 0.5 * 900 * T, grav: 900, dmg: e.stats.dmg, team: 'enemy', kind: 'axe', life: 3 }));
    Sfx.play('swing', e.pan(), 0.7);
  },
  fireBallista(b, power, manual) {
    const s = this.player, p = s.toWorld(b.lx, s.deckY(b.lx) - 30), sp = 1300 + 600 * power, U = b.ups || {};
    const dmg = 28 * (U.arm ? 1.4 : 1) * (manual ? 0.8 + power * 0.6 : 1);
    const aims = U.twin ? [b.aim - 0.045, b.aim + 0.045] : [b.aim];
    for (const a of aims) {
      const bx = p.x + Math.cos(a) * 34, by = p.y + Math.sin(a) * 34, crit = Math.random() < 0.15 + (U.arm ? 0.05 : 0);
      this.shots.push(new Projectile({ x: bx, y: by, vx: Math.cos(a) * sp + s.vx, vy: Math.sin(a) * sp, grav: 380, dmg: dmg * (crit ? 2 : 1), crit, team: 'player', kind: 'bolt', pierce: manual && power > 1.2 ? 2 : 0, hot: (manual && power > 1.2) || !!U.fire, manual, fire: !!U.fire, harp: !!U.harp, from: { x: p.x, y: p.y } }));
      FX.burst(bx, by, { n: 6, angle: a, spread: 0.5, speed: 160, size: 3, color: U.fire ? 'f4' : 'foam', grav: -40, life: 0.4, kind: 'mist' });
    }
    b.cd = 2.3 * (U.winch ? 0.65 : 1); b.recoil = 1;
    Sfx.play('ballista', clamp((p.x - Cam.x) / 900, -1, 1), 1);
    if (manual) { Cam.shake(0.04); Cam.kick(0.01); }
  },
  boltHits(p) {
    for (const e of this.enemies) {
      if (e.dead || e.water || p.hitSet.has(e)) continue;
      if (Math.hypot(e.cx - p.x, e.cy - p.y) < 28 * e.scale) {
        p.hitSet.add(e); FX.hitSpark(p.x, p.y, Math.atan2(p.vy, p.vx), false);
        if (p.harp) { e.hurt(p.dmg * 0.7, -Math.sign(p.vx) * 700, -520, { stun: 1 }); FX.text(e.x, e.y - 90, '鱼叉！', '#ffd8a0', 20, 0.8); }
        else if (p.kind === 'pellet') { const v = p.volley, first = !v.hitE || !v.hitE.has(e); (v.hitE ??= new Set()).add(e); e.hurt(p.dmg * this.lightMul(e.x, e.y), first ? Math.sign(p.vx) * p.kx : 0, first ? p.ky : 0, { stun: first ? p.stun : 0.05, noScale: true }); }
        else e.hurt(p.dmg * this.lightMul(e.x, e.y), Math.sign(p.vx) * (p.kx ?? (p.crit ? 620 : 420)) * (p.crit ? 1.3 : 1), p.ky ?? (p.crit ? -420 : -280), { stun: p.stun ?? 0.6 });
        if (p.crit && !(p.volley && p.volley.crit)) { critFX(p.x, p.y - 16, p.dmg * (p.harp ? 0.7 : this.lightMul(e.x, e.y))); if (p.volley) p.volley.crit = true; }
        if (p.volley && p.charged && !p.volley.coop && e.hp > 0) { p.volley.coop = true; Bon.coopDive(e); }
        if (p.fire) Salvage.burnActor(e, 3.5);
        Sfx.play('hit', e.pan(), p.kind === 'pellet' ? 0.45 : 1); FX.stop(p.kind === 'pellet' ? 0.015 : 0.04);
        if (e.hp <= 0) this.kill(e); if (p.pierce-- <= 0) { p.dead = true; return; }
      }
    }
    for (const t of this.tentacles) { if (p.hitSet.has(t)) continue; const q = t.hitPoint(p.x, p.y, 24); if (q) { p.hitSet.add(t); t.damage(p.dmg * (p.fire ? 1.5 : 1), this); if (p.crit) critFX(p.x, p.y - 10, p.dmg * (p.fire ? 1.5 : 1)); p.dead = true; FX.burst(p.x, p.y, { n: 10, speed: 300, size: 4, color: 'k4', life: 0.5 }); Sfx.play('heavy', 0, 0.6); return; } }
    if (this.boss && this.boss.hitAt(p.x, p.y, p.dmg, this, 'bolt')) { if (p.crit) critFX(p.x, p.y - 30, p.dmg); p.dead = true; return; }
    if (this.kraken && this.kraken.eyeHit(p.x, p.y, 10)) { this.kraken.hitEye(p.dmg, this); if (p.crit) critFX(p.x, p.y - 40, p.dmg); p.dead = true; return; }
    for (const s of this.ships) {
      if (s.team === 'player' || s.sunk) continue;
      const lo = s.toLocal(p.x, p.y);
      if (s.mast && !s.mast.cut && Math.abs(lo.x) < 14 && lo.y > -340 && lo.y < -50) { this.hitMast(s, p.dmg * 0.9); p.dead = true; return; }
      if (Math.abs(lo.x) < s.L && lo.y > s.deckY(lo.x) + 4 && lo.y < 40) {
        s.damage(p.dmg * (s.mast && s.mast.cut ? 1.5 : 1), lo.x); p.dead = true; if (p.crit) { critFX(p.x, p.y - 10, p.dmg * (s.mast && s.mast.cut ? 1.5 : 1)); Cam.shake(0.1); FX.splinters(p.x, p.y, 12, 0, 'w3'); } if (p.fire && s.kind !== 'skiff') s.burn = Math.max(s.burn || 0, 5); if (p.harp && s.kind !== 'skiff') { s.vx += -Math.sign(s.x - this.player.x) * 90; s.harpT = 2.5; s.harpFrom = p.from; s.harpAt = lo; }
        if (s.hull <= 0) this.shipSinks(s); return;
      }
    }
  },
  shipSinks(s) {
    if (s.sinkCounted) return; s.sinkCounted = true;
    Salvage.spawn(s.x, s.kind !== 'skiff' ? randi(3, 5) : 1, s.L * 0.6);
    if (s.kind !== 'skiff') { this.silver += 40; this.stats.ships++; this.banner('敌船沉了！', '', '#ffd8a0', 1.6); Coins.burst(s.x, s.y - 60, 40, 1.2); Cam.shake(0.25); FX.slowmo(0.4, 0.5); }
    else { this.silver += 10; Coins.burst(s.x, s.y - 30, 10); }
    Sfx.play('crack', 0, 1); FX.splash(s.x, 2);
    for (const e of this.enemies) if (e.ship === s && !e.dead) { e.launch(e.vx + rand(-150, 150), -300); }
  },
  enemyShotHits(p) {
    const cap = this.captain;
    if (this.state !== 'fight') { p.dead = true; return; }
    if (cap.down <= 0 && Math.hypot(cap.cx - p.x, cap.cy - p.y) < 26) {
      if (cap.hurt(p.dmg * (cap.brace ? 0.6 : 1), Math.sign(p.vx) * 260, -140)) { Sfx.play('hurt', cap.pan(), 1); Cam.shake(0.1); UI.pulse('hurt'); }
      if (p.kind === 'pot' && cap.ship === this.player) this.fireAt(cap.lx);
      if (p.kind === 'ice') { this.freeze(cap, 1.1); FX.burst(p.x, p.y, { n: 14, speed: 200, size: 2, color: 'b4', color2: 'n8', grav: 400, life: 0.5 }); }
      p.dead = true; return;
    }
    const s = this.player, lo = s.toLocal(p.x, p.y);
    for (const m of this.modules()) if (m.type === 'wall' && Math.abs(lo.x - m.lx) < 22 && lo.y > s.deckY(m.lx) - 58 && lo.y < s.deckY(m.lx)) { m.hp -= p.dmg; m.flash = 1; Sfx.play('clang', 0, 0.7); FX.sparks(p.x, p.y, 8); p.dead = true; if (m.hp <= 0) this.destroyModule(m); return; }
    if (Math.abs(lo.x) < s.L && lo.y > s.deckY(lo.x) - 2 && lo.y < 40) {
      if (p.kind === 'bolt') { s.damage(p.dmg, lo.x); } else if (p.kind === 'pot') { this.fireAt(clamp(lo.x, -s.walk, s.walk)); } else if (p.kind === 'ice') { this.iceAt(clamp(lo.x, -s.walk, s.walk)); Sfx.play('clang', 0, 0.4); FX.burst(p.x, p.y, { n: 12, speed: 180, size: 2, color: 'b4', color2: 'n8', grav: 500, life: 0.5 }); } else { FX.splinters(p.x, p.y, 4); Sfx.play('wood', 0, 0.6); }
      p.dead = true;
    }
  },
  tentacleSlam(tn) {
    const s = tn.ship, lx = tn.lx - tn.out * 40, cap = this.captain;
    Sfx.play('slam', 0, 1); Cam.shake(0.3); FX.stop(0.08); Cam.kick(0.03);
    s.va += tn.out * -0.5; s.vy += 140;
    const p = s.toWorld(lx, s.deckY(lx)); FX.splinters(p.x, p.y, 20); FX.splash(p.x + tn.out * 60, 1.4);
    let absorbed = false;
    for (const m of this.modules()) {
      if (Math.abs(m.lx - lx) < 110) {
        if (m.type === 'wall') { m.hp -= 45; m.flash = 1; absorbed = true; if (m.hp <= 0) this.destroyModule(m); }
        else { m.hp -= 25; m.flash = 1; if (m.type === 'brazier' && m.lit) { m.lit = false; FX.burst(s.toWorld(m.lx, -70).x, s.toWorld(m.lx, -70).y, { n: 18, speed: 200, size: 6, color: 'm3', grav: -80, kind: 'smoke', life: 1.2 }); FX.text(s.toWorld(m.lx, -90).x, s.toWorld(m.lx, -90).y, '火盆灭了 · 按 E 重新点燃', '#ffb070', 18, 1.6); } if (m.hp <= 0) this.destroyModule(m); }
      }
    }
    s.damage(absorbed ? 8 : 22, lx);
    const hitActor = (a, dmg) => {
      if (a.ship !== s || a.air || a.water) return;
      const d = a.lx - lx; if (Math.abs(d) > 110) return;
      const out = Math.sign(d) || tn.out;
      if (a === cap) { if (a.down > 0 || a.iframes > 0) return; if (a.hurt(dmg, out * 300, -760)) { Sfx.play('hurt', 0, 1); UI.pulse('hurt'); } }
      else { a.hurt(dmg, out * 360, -820, { stun: 1 }); if (a.hp <= 0) this.kill(a); }
    };
    hitActor(cap, 18);
    for (const e of this.enemies) if (!e.dead) hitActor(e, 30);
  },
  tentacleSweep(tn, lxTip) {
    const s = tn.ship; tn.swept ??= new Set();
    const hit = (a, dmg) => {
      if (tn.swept.has(a) || a.ship !== s || a.air || a.water || Math.abs(a.lx - lxTip) > 34) return;
      tn.swept.add(a);
      if (a === this.captain) { if (a.down > 0 || a.iframes > 0) return; if (a.hurt(dmg, -tn.out * 520, -420)) { Sfx.play('hurt', 0, 1); Cam.shake(0.15); UI.pulse('hurt'); } }
      else { a.hurt(dmg, -tn.out * 560, -460, { stun: 1 }); if (a.hp <= 0) this.kill(a); }
    };
    hit(this.captain, 16); for (const e of this.enemies) if (!e.dead) hit(e, 26);
    for (const m of this.modules()) if (Math.abs(m.lx - lxTip) < 30 && !tn.swept.has(m)) { tn.swept.add(m); m.hp -= 20; m.flash = 1; if (m.hp <= 0) this.destroyModule(m); }
  },
  onTentacleCut(tn) {
    this.stats.tentacles++; this.silver += 8; const p = tn.pts[(tn.pts.length * 0.7) | 0] || { x: 0, y: 0 };
    Coins.burst(p.x, p.y, 8); Sfx.play('tentacle', 0, 1); Cam.shake(0.1);
    if (tn.mode === 'grip') { this.player.bias = 0; }
  },

  /* ---------- update ---------- */
  frame(rdt) {
    let dt = rdt * FX.timeScale;
    if (FX.hitstop > 0) { FX.hitstop -= rdt; dt = 0; }
    this.t += rdt;
    for (const e of this.enemies) if (e.jitter > 0) e.jitter -= rdt;
    Sfx.ambience(Sea.storm, rdt, this.t, this.kraken ? 1 : 0);
    Sfx.music(rdt, this.state === 'fight' ? (this.kraken || this.boss ? 1 : 0.4 + Math.min(0.5, this.enemies.filter((e) => !e.dead).length * 0.1)) : 0);
    WIND.t += rdt; WIND.v = (noise1(WIND.t * 0.07) - 0.5) * 2 * (0.4 + Sea.storm * 0.9) * (1 + Sky.tint * 0.8);
    if (dt > 0 && !UI.paused && !Touch.portrait()) this.update(dt);
    Cam.update(rdt);
    Sky.update(rdt, Sea.storm);
    this.render(rdt);
    UI.update(rdt);
    Input.endFrame();
  },
  update(dt) {
    Sea.update(dt); FX.update(dt);
    { const K = this.kraken, boss = !!K && !K.dying; Sky.boss = boss; Sky.tint = damp(Sky.tint, boss ? 1 : 0, boss ? 0.5 : 0.8, dt);
      if (boss) { Sea.targetStorm = K.phase >= 2 ? 1 : 0.88; this.fogK = K.phase >= 3 ? 0.3 : 0.16; }
      if (this.boss && !this.boss.dying) { Sea.targetStorm = this.boss.phase >= 2 ? 0.95 : 0.75; } Sky.auroraK = damp(Sky.auroraK, this.boss ? 1 : 0, 0.5, dt); }
    this.timers = this.timers.filter((t) => { t.t -= dt; if (t.t <= 0) { t.f(); return false; } return true; });
    const m = Cam.toWorld(Input.mouse.sx, Input.mouse.sy); Input.mouse.x = m.x; Input.mouse.y = m.y;
    if (Touch.on && !UI.screen && this.state !== 'title') Touch.aim(this);
    const ps = this.player, cap = this.captain;
    // ships
    ps.tx = 0; if (!this.tentacles.some((t) => t.mode === 'grip' && !t.dead)) ps.bias = damp(ps.bias, 0, 1.5, dt);
    for (const s of this.ships) {
      s.update(dt); s.spray(dt);
      if (s.team === 'enemy') {
        if (s.kind === 'skiff') {
          s.docked = Math.abs(s.x - s.tx) < 40;
          s.crewLeft = this.enemies.filter((e) => !e.dead && (e.ship === s || (e.air && e.lastGround === s))).length;
          s.emptyT = s.crewLeft === 0 && cap.ship !== s && cap.lastGround !== s ? (s.emptyT || 0) + dt : 0;
          if (s.emptyT > 2 && !s.leaving && this.encT > 0) { s.leaving = true; s.tx = s.x + Math.sign(s.x - ps.x) * 2400; }
          if (s.leaving && Math.abs(s.x - ps.x) > 2200) s.gone = true;
        } else {
          s.boardCd -= dt;
          // only throwers left: after a while they swing across too
          const crew = this.enemies.filter((e) => !e.dead && e.ship === s);
          if (crew.length && crew.every((e) => e.role === 'thrower')) { s.onlyRangedT = (s.onlyRangedT || 0) + dt; if (s.onlyRangedT > 12) crew.forEach((e) => { e.role = 'boarder'; e.stats = { ...e.stats, ranged: false }; }); }
          if (!s.mast.cut && s.hull > 0 && !s.defeated) {
            s.tx = ps.x + Math.sign(s.x - ps.x) * (ps.L + s.L + 70);
            const gunner = this.enemies.some((e) => !e.dead && e.ship === s);
            if (gunner && this.state === 'fight' && s.x > Cam.viewL() && s.x < Cam.viewR()) { s.ballCd -= dt; if (s.ballCd <= 0) { s.ballCd = rand(7, 9.5); this.enemyBallista(s); } }
          }
          else if (s.defeated && s.hull > 0) {
            const aboard = cap.ship === s || cap.climb?.ship === s || ((cap.air || cap.water) && cap.lastGround === s && Math.abs(cap.x - s.x) < s.L + 120);
            s.leaveT = aboard ? 0 : (s.leaveT || 0) + dt;
            if (!s.leaving) s.tx = ps.x + Math.sign(s.x - ps.x) * (ps.L + s.L + 70);
            if (!s.leaving && s.leaveT > 1.5) { s.leaving = true; s.tx = s.x + Math.sign(s.x - ps.x) * 3000; }
          }
          else if (s.hull > 0) s.tx = damp(s.tx, ps.x + Math.sign(s.x - ps.x) * (ps.L + s.L + 360), 0.3, dt);
          if (!s.defeated && s.hull > 0 && !this.enemies.some((e) => !e.dead && (e.ship === s || (e.swingPath && e.swingPath.from === s)))) { s.defeated = true; this.silver += 25; this.banner('敌船被清空了', '零件自动收进船舱', '#ffd8a0', 1.6); Coins.burst(s.x, s.y - 50, 25); Salvage.spawn(s.x - Math.sign(s.x - ps.x) * s.L * 0.5, randi(2, 3), 60); s.leaveT = 0; }
          if (s.leaving && Math.abs(s.x - ps.x) > 2600) s.gone = true;
        }
        if (s.hull <= 0 && !s.sinkCounted) this.shipSinks(s);
      }
    }
    this.ships = this.ships.filter((s) => !(s.sunk && s !== ps) && !s.gone);
    if (ps.hull <= 0 && this.state !== 'lost') this.lose();
    // modules
    this.updateModules(dt);
    // actors
    if (this.state !== 'title') cap.update(dt, this);
    else { cap.physics(dt, this.ships, 0); cap.anim += dt; }
    Waves.update(dt, this); Bon.update(dt, this); this.updateChapter(dt); Save.tick();
    for (const e of this.enemies) {
      const wasWater = e.water; e.update(dt, this);
      if (e.water && !wasWater) this.onOverboard(e);
      if (!e.dead && e.hp <= 0) this.kill(e);
    }
    this.enemies = this.enemies.filter((e) => !e.gone && e.y < 900);
    for (const t of this.tentacles) t.update(dt, this);
    this.tentacles = this.tentacles.filter((t) => !t.gone);
    if (this.kraken) { this.kraken.update(dt, this); if (this.kraken.dying > 4) this.kraken = null; }
    Salvage.update(dt); Salvage.updateBurns(dt); Coins.update(dt);
    for (const s of this.ships) if (s.harpT > 0) s.harpT -= dt;
    for (const p of this.shots) p.update(dt, this);
    this.shots = this.shots.filter((p) => !p.dead);
    // breaches leak during fights
    this.comboT = Math.max(0, (this.comboT || 0) - dt);
    if (this.state === 'fight') { ps.hull -= ps.breaches.length * 0.4 * dt; this.runScript(dt); this.stats.time += dt; }
    if (this.state === 'won') { this.wonT += dt; if (this.wonT > 2.4) this.openRefit(); }
    this.interact(dt);
    this.camera(dt);
  },
  enemyBallista(s) {
    const ps = this.player, from = s.toWorld(-s.dir * 0 + (ps.x > s.x ? 1 : -1) * 120, s.deckBase - 30);
    const tl = rand(-ps.walk, ps.walk), to = ps.toWorld(tl, -10), sp = 1100, d = Math.hypot(to.x - from.x, to.y - from.y), T = d / sp;
    FX.sparks(from.x, from.y, 6);
    this.timers.push({ t: 0.6, f: () => { if (s.sunk || s.mast.cut || s.defeated || this.state !== 'fight' || !this.enemies.some((e) => !e.dead && e.ship === s)) return; this.shots.push(new Projectile({ x: from.x, y: from.y, vx: (to.x - from.x) / T, vy: (to.y - from.y) / T - 0.5 * 380 * T, grav: 380, dmg: 14 + this.step * 2, team: 'enemy', kind: 'bolt' })); Sfx.play('ballista', 0.5 * Math.sign(s.x - ps.x), 0.8); } });
    s.tellT = 0.6;
  },
  updateModules(dt) {
    const ps = this.player;
    for (const m of this.modules()) {
      m.flash = Math.max(0, m.flash - dt * 5); m.recoil = Math.max(0, (m.recoil || 0) - dt * 4);
      if (m.type === 'ballista') {
        m.cd -= dt;
        if (m.manned || this.state !== 'fight') continue;
        const tgt = this.ballistaTarget(m);
        if (tgt) {
          const p = ps.toWorld(m.lx, ps.deckY(m.lx) - 30), dx = tgt.x - p.x, dy = tgt.y - p.y, d = Math.hypot(dx, dy), T = d / 1600;
          const want = Math.atan2(dy - 0.5 * 380 * T * T, dx);
          m.aim = m.aim + wrapAngle(want - m.aim) * Math.min(1, dt * 6);
          if (m.cd <= 0 && Math.abs(wrapAngle(want - m.aim)) < 0.08) this.fireBallista(m, 0.5, false);
        }
      }
      if (m.type === 'brazier' && m.lit && Math.random() < dt * 8) { const p = ps.toWorld(m.lx, -76); FX.burst(p.x, p.y, { n: 1, angle: -Math.PI / 2 + WIND.v * 0.4, spread: 0.4, speed: 90, size: 1.8, color: 'gold', grav: -120, life: 1.2, kind: 'ember', add: true, water: false }); }
    }
  },
  ballistaTarget(m) {
    const ps = this.player, p = ps.toWorld(m.lx, -60), front = (x) => true;
    if (this.kraken && this.kraken.eye > 0.6) return this.kraken.eyePos;
    if (this.boss) { const q = this.boss.targetPoint(); if (q) return q; }
    let best = null, bd = 1e9;
    const consider = (x, y, pri) => { const d = Math.hypot(x - p.x, y - p.y) / pri; if (d < bd && d < 1600) { bd = d; best = { x, y }; } };
    for (const t of this.tentacles) if (t.hittable() && t.pts.length) { const q = t.pts[(t.pts.length * 0.6) | 0]; consider(q.x, q.y, 2); }
    for (const s of this.ships) if (s.team === 'enemy' && !s.sunk && s.hull > 0) { if (s.kind === 'skiff' && !s.leaving) consider(s.x, s.y - 4, 1.6); else if (s.kind !== 'skiff' && !s.leaving) { const q = s.toWorld(rand(-80, 80), -10); consider(q.x, q.y, 1); } }
    for (const e of this.enemies) if (!e.dead && e.swingPath && !e.swingPath.leap) consider(e.cx, e.cy, 1.3);
    return best;
  },
  interact(dt) {
    const cap = this.captain, ps = this.player; this.hint = '';
    if (this.state !== 'fight' && this.state !== 'won') return;
    if (cap.water || cap.down > 0) return;
    if (cap.ship !== ps || cap.air) return;
    let near = null, nd = 60;
    for (const m of this.modules()) { const d = Math.abs(m.lx - cap.lx); if (d < nd && m.type === 'brazier' && !m.lit) { nd = d; near = m; } }
    let breach = null; for (const b of ps.breaches) if (Math.abs(b.lx - cap.lx) < 50) breach = b;
    if (breach) {
      this.hint = '按住 E 修补破洞';
      if (Input.down('e')) { breach.fix += dt; cap.crouch = 1; if (Math.random() < dt * 10) Sfx.play('wood', 0, 0.4); if (breach.fix > 1.1) { ps.breaches.splice(ps.breaches.indexOf(breach), 1); ps.hull = Math.min(ps.hullMax, ps.hull + 10); FX.text(cap.x, cap.y - 90, '补好了 +10', '#9fe8b0', 20); Sfx.play('build', 0, 1); } }
      else breach.fix = Math.max(0, breach.fix - dt);
      return;
    }
    if (near) {
      if (near.type === 'brazier') { this.hint = '按 E 点燃火盆'; if (Input.tap('e')) { near.lit = true; Sfx.play('fire', 0, 1); } }
    }
  },
  camera(dt) {
    const ps = this.player, cap = this.captain, vw = Cam.BW / S, vh = Cam.BH / S;
    if (this.state === 'title') { Cam.tx = ps.x - vw * 0.22; Cam.ty = -150; return; }
    let L = ps.x - ps.L - 60, R = ps.x + ps.L + 60;
    for (const s of this.ships) if (s !== ps && !s.leaving && s.kind !== 'skiff' && Math.abs(s.tx - ps.x) < 1400) { const near = s.tx < ps.x ? 1 : -1; L = Math.min(L, s.tx + near * (s.L + 30), s.tx); R = Math.max(R, s.tx + near * (s.L + 30), s.tx); }
    let cx = (L + R) / 2;
    cx = clamp(cx, cap.x - vw / 2 + 110, cap.x + vw / 2 - 110);
    let cy = this.kraken || this.boss ? -190 : -130;
    if (cap.y < cy - vh / 2 + 60) cy = cap.y + vh / 2 - 60;
    if (cap.water) cy = Math.max(cy, cap.y - vh / 2 + 90);
    // dead zone: small shifts of the framing never move the camera
    if (Math.abs(cx - Cam.tx) > 70) Cam.tx = cx;
    if (Math.abs(cy - Cam.ty) > 40) Cam.ty = cy;
  },

  /* ---------- render ---------- */
  render(dt) {
    const ctx = this.ctx, t = this.t, ps = this.player;
    TXT.begin();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.imageSmoothingEnabled = false;
    Sky.fog = damp(Sky.fog, this.fogK, 1, dt);
    Sky.drawSky(ctx); Sky.drawAurora(ctx); Sky.drawClouds(ctx, t); Sky.drawBolt(ctx); Sky.drawCliffs(ctx); Sky.drawDawn(ctx);
    Sea.drawBack(ctx, Sky.flash); this.drawFloes(ctx, true);
    if (this.kraken) this.kraken.draw(ctx, t);
    if (this.boss) this.boss.draw(ctx, t, 'back');
    for (const tn of this.tentacles) if (tn.layer === 'back') tn.draw(ctx, t);
    const order = [...this.ships].sort((a, b) => (a === ps) - (b === ps));
    for (const s of order) { s.drawBack(ctx, t); s.drawHull(ctx, t); }
    if (this.boss) this.boss.draw(ctx, t, 'front');
    for (const sl of ps.slots) if (sl.mod) drawModule(ctx, ps, sl.mod, t);
    for (const s of this.ships) if (s.team === 'enemy' && s.kind !== 'skiff' && !s.sunk) this.drawEnemyGear(ctx, s, t);
    Salvage.drawFires(ctx, t);
    for (const s of this.ships) if (s.harpT > 0 && s.harpFrom && !s.sunk) { const q = s.toWorld(s.harpAt.x, s.harpAt.y); ropeLine(ctx, s.harpFrom.x, s.harpFrom.y, q.x, q.y, 0.03 * (2.5 - s.harpT)); }
    for (const e of this.enemies) { e.drawRope(ctx); e.draw(ctx, t); if (e.tell) this.drawTell(ctx, e); }
    this.captain.drawRope(ctx); this.captain.draw(ctx, t);
    for (const s of order) s.drawFront(ctx);
    this.drawIces(ctx, t); if (this.boss) this.boss.draw(ctx, t, 'fx');
    Bon.draw(ctx, t);
    if (this.state === 'refit') this.drawSlots(ctx, t);
    this.drawLeaks(ctx, t);
    for (const p of this.shots) p.draw(ctx);
    for (const tn of this.tentacles) if (tn.layer === 'front') tn.draw(ctx, t);
    Salvage.draw(ctx, t);
    Coins.draw(ctx);
    this.collectLights();
    Sea.drawFront(ctx, Sky.flash, this.lights.filter((l) => l.water));
    for (const s of this.ships) s.drawWake(ctx, t);
    FX.draw(ctx);
    this.lighting(ctx);
    FX.drawHits(ctx); Waves.draw(ctx);
    if (Sky.theme === 'ice') Sky.drawSnow(ctx, dt, Sea.storm, WIND.v * 600); else Sky.drawRain(ctx, dt, Sea.storm, WIND.v * 600);
    this.captain.drawCharge(ctx); FX.drawTexts(ctx); this.drawBars(ctx); this.drawOffscreen(ctx);
    this.post(ctx);
    UI.draw(ctx);
    quantize(ctx, Cam.BW, Cam.BH);
  },
  /* a blinking arrow at the screen edge for every hostile vessel out of view */
  drawOffscreen(ctx) {
    if (this.state !== 'fight') return;
    const W = Cam.BW, blink = Math.floor(this.t * 4) % 2;
    for (const s of this.ships) {
      if (s.team !== 'enemy' || s.sunk || s.leaving || s.defeated) continue;
      if (!this.enemies.some((e) => !e.dead && e.ship === s) && s.kind === 'skiff') continue;
      const bx = Cam.bx(s.x), off = bx < -6 ? -1 : bx > W + 6 ? 1 : 0; if (!off) continue;
      const tip = off < 0 ? 3 : W - 4, y = clamp(Cam.by(s.y - 40), 30, Cam.BH - 40) + (blink ? 0 : 1), bob = Math.round(Math.sin(this.t * 8) * 1.5) * off;
      // a filled triangle pointing off screen, inked outline, and the enemy's red
      for (let i = 0; i < 8; i++) { const h = Math.round(i * 0.75), x = tip - off * i + bob; P.rect(ctx, x, y - h - 1, 1, h * 2 + 3, C.ink); if (i > 0 && i < 7) P.rect(ctx, x, y - h, 1, h * 2 + 1, C[blink ? 'r4' : 'r3']); }
      P.rect(ctx, tip - off * 10 + bob - (off > 0 ? 1 : 0), y - 1, 2, 3, C.ink);
    }
  },
  collectLights() {
    const ps = this.player; this.lights = FX.lights; FX.lights = [];
    const L = this.lights;
    const lan = ps.toWorld(0, -210); L.push({ x: lan.x, y: lan.y, r: 330, c: [255, 190, 120], i: 0.5, water: true });
    const cap = this.captain; L.push({ x: cap.x, y: cap.y - 50, r: 230, c: [255, 205, 160], i: 0.5 });
    for (const m of this.modules()) if (m.type === 'brazier' && m.lit) { const p = ps.toWorld(m.lx, -76), f = 0.85 + 0.15 * noise1(this.t * 9 + m.lx); L.push({ x: p.x, y: p.y, r: 380 * f, c: [255, 150, 60], i: 1.15 * f, water: true }); }
    for (const s of this.ships) if (s.team === 'enemy' && s.kind !== 'skiff' && !s.sunk) { const p = s.toWorld(Math.sign(s.x - ps.x) * s.L * 0.55, -80), f = 0.85 + 0.15 * noise1(this.t * 8 + s.x); L.push({ x: p.x, y: p.y, r: 280 * f, c: s.ghost ? [90, 255, 200] : [255, 140, 60], i: 0.9 * f, water: true }); }
    for (const e of this.enemies) if (e.look.glow && !e.dead) L.push({ x: e.x + e.face * 6, y: e.y - 56, r: 44, c: e.look.glow, i: 0.8 });
    if (this.kraken) this.kraken.glow(this);
    if (this.boss) this.boss.glow(L);
    // the moon gives its own light, so the night ambient does not grey it into a smudge
    if (Sky.tint < 0.6 && Sea.storm < 0.8 || Sky.dawn > 0.3) { const hz = Math.max(1, Cam.by(-250)), mx = Math.round(Cam.BW * Sky.moon.x), my = Math.round(clamp(hz * 0.3, 16, 60)); L.push({ x: Cam.viewL() + mx / S, y: Cam.viewT() + my / S, r: 44, c: [255, 250, 235], i: 1.7 }); }
    Salvage.fireLights(L); Bon.light(L);
    this.lights.push(...FX.lights); FX.lights = [];
    for (const p of FX.parts) if (p.kind === 'ember' || (p.kind === 'spark' && Math.random() < 0.3)) L.push({ x: p.x, y: p.y, r: 30, c: [255, 170, 90], i: 0.4 });
    if (Sky.bolt) L.push({ x: Cam.viewL() + (Sky.bolt.pts[0][0]) / S, y: Cam.viewT() + 200, r: 900, c: [200, 220, 255], i: 0.6 });
  },
  lighting(ctx) {
    const lx = this.lctx, W = this.lc.width, H = this.lc.height, f = Sky.flash;
    const dark = clamp(this.darkK + (this.kraken ? this.kraken.ink * 0.5 * (this.kraken.dying ? 0 : 1) : 0), 0, 1);
    const calm = this.state === 'refit' || this.state === 'route' || this.state === 'title' ? 0.25 : 0;
    const base = mixc(mixc([118, 134, 168], [34, 36, 58], dark), [255, 214, 176], Sky.dawn * 0.75), amb = mixc(mixc(base, [140, 150, 176], calm * (1 - Sky.dawn)), [255, 255, 255], f * 0.85);
    lx.setTransform(1, 0, 0, 1, 0, 0); lx.globalCompositeOperation = 'source-over';
    lx.fillStyle = rgba(amb[0], amb[1], amb[2]); lx.fillRect(0, 0, W, H);
    lx.globalCompositeOperation = 'lighter';
    for (const l of this.lights) {
      const x = Cam.bx(l.x) / 2, y = Cam.by(l.y) / 2, r = l.r * S / 2;
      if (x < -r || y < -r || x > W + r || y > H + r) continue;
      const g = lx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(l.c[0], l.c[1], l.c[2], 0.9 * l.i)); g.addColorStop(0.35, rgba(l.c[0] * 0.8, l.c[1] * 0.7, l.c[2] * 0.6, 0.45 * l.i)); g.addColorStop(1, 'rgba(0,0,0,0)');
      lx.fillStyle = g; lx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = true;
    ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(this.lc, 0, 0, Cam.BW, Cam.BH);
    ctx.imageSmoothingEnabled = false;
    // soft halos around the brightest lights (dithered by the quantiser)
    ctx.globalCompositeOperation = 'lighter';
    for (const l of this.lights) {
      if (l.i < 0.6) continue; const x = Cam.bx(l.x), y = Cam.by(l.y), r = l.r * 0.3 * S;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(l.c[0], l.c[1], l.c[2], 0.25 * l.i)); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  },
  post(ctx) {
    const W = Cam.BW, H = Cam.BH;
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 0.95);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(2,4,10,0.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    if (UI.hurtT > 0) { ctx.fillStyle = `rgba(160,20,10,${UI.hurtT * 0.28})`; ctx.fillRect(0, 0, W, H); }
  },
  drawEnemyGear(ctx, s, t) {
    const side = this.player.x > s.x ? 1 : -1, bl = side * s.L * 0.45, p = s.toWorld(bl, s.deckY(bl));
    blitRot(ctx, SPR.ballista_base, Cam.bx(p.x), Cam.by(p.y), s.a, 7, 8);
    const pv = s.toWorld(bl, s.deckY(bl) - 16), aim = Math.atan2(this.player.y - 40 - pv.y, this.player.x - pv.x), fl = Math.cos(aim) < 0;
    blitRot(ctx, SPR.ballista_arm, Cam.bx(pv.x), Cam.by(pv.y), fl ? Math.PI - aim : aim, 9, 5, fl);
    if (s.tellT > 0) { s.tellT -= 1 / 60; if (Math.floor(t * 20) % 2) { const q = Cam.bx(pv.x + Math.cos(aim) * 30), r = Cam.by(pv.y + Math.sin(aim) * 30); P.disc(ctx, q, r, 3, C.r4); P.dot(ctx, q, r, C.f6); } }
    if (!s.mast.cut) {
      const f = s.toWorld(-side * s.L * 0.55, s.deckY(-side * s.L * 0.55));
      blitRot(ctx, SPR.brazier, Cam.bx(f.x), Cam.by(f.y), s.a, 6, 9);
      drawFlame(ctx, Cam.bx(f.x), Cam.by(f.y) - 9, t, s.x * 0.01, s.ghost);
    }
  },
  drawTell(ctx, e) {
    if (Math.floor(this.t * 16) % 2) return;
    const x = Cam.bx(e.x) + e.face * 3, y = Cam.by(e.y) - 42;
    ctx.fillStyle = C.r4; ctx.fillRect(x - 1, y - 6, 3, 5); ctx.fillRect(x - 1, y, 3, 2);
  },
  drawBars(ctx) {
    for (const e of this.enemies) {
      if (e.dead || e.water) continue;
      if (e.blocking && !e.stats.block) { const gx = Cam.bx(e.x) + e.face * 2, gy = Cam.by(e.y) - 52; ctx.fillStyle = C.ink; ctx.fillRect(gx - 3, gy - 1, 7, 7); ctx.fillStyle = C.m4; ctx.fillRect(gx - 2, gy, 5, 4); ctx.fillRect(gx - 1, gy + 4, 3, 1); ctx.fillStyle = C.white; ctx.fillRect(gx - 1, gy + 1, 1, 2); }
      if (e.type === 'chieftain') { const w = 40, x = Cam.bx(e.x) - 20, y = Cam.by(e.y) - 50; text(ctx, '首领', x + 20, y - 12, { size: 9, align: 'center', color: C.gold, bold: true }); P.rect(ctx, x - 1, y - 1, w + 2, 5, C.ink); P.rect(ctx, x, y, Math.round(w * clamp(e.hp / e.max, 0, 1)), 3, C.r4); continue; }
      if (e.hp >= e.max) continue;
      const w = 16, x = Cam.bx(e.x) - 8, y = Cam.by(e.y) - 44;
      P.rect(ctx, x - 1, y - 1, w + 2, 4, C.ink); P.rect(ctx, x, y, Math.max(1, Math.round(w * clamp(e.hp / e.max, 0, 1))), 2, C.r4);
      if (e.taken > 30) P.rect(ctx, x, y + 2, Math.min(w, Math.round((e.taken - 30) / 4)), 1, C.f5);
    }
    for (const s of this.ships) {
      if (s.team !== 'enemy' || s.sunk || s.leaving) continue;
      const p = s.toWorld(0, s.kind === 'skiff' ? -60 : MAST_TOP - 36), w = s.kind === 'skiff' ? 26 : 60, x = Cam.bx(p.x) - w / 2, y = Cam.by(p.y);
      P.rect(ctx, x - 1, y - 1, w + 2, s.mast ? 6 : 4, C.ink); P.rect(ctx, x, y, Math.round(w * clamp(s.hull / s.hullMax, 0, 1)), 2, C.w5);
      if (s.mast && !s.mast.cut) P.rect(ctx, x, y + 3, Math.round(w * clamp(s.mast.hp / s.mast.max, 0, 1)), 1, C.b3);
    }
  },
  /* dashed boxes over the deck slots; a big plus in the empty ones */
  drawSlots(ctx, t) {
    const ps = this.player, hov = UI.hoverSlot;
    ps.slots.forEach((sl, i) => {
      const on = hov === i || UI.selSlot === i, blink = Math.floor(t * 3 + i) % 2, col = C[on ? 'f5' : sl.mod ? 'b1' : blink ? 'b3' : 'b2'];
      const d0 = ps.deckY(sl.lx), pt = (ox, oy) => { const p = ps.toWorld(sl.lx + ox / S, d0 + oy / S); return [Cam.bx(p.x), Cam.by(p.y)]; };
      const hw = 12, top = -36;
      if (on) { ctx.globalAlpha = 0.25; ctx.fillStyle = C.f4; for (let yy = top; yy < 0; yy++) { const [x0, y0] = pt(-hw, yy), [x1] = pt(hw, yy); ctx.fillRect(Math.min(x0, x1), y0, Math.abs(x1 - x0), 1); } ctx.globalAlpha = 1; }
      ctx.fillStyle = col;
      const edge = (ax, ay, bx, by, n) => { for (let k = 0; k <= n; k++) { if (!on && k % 5 >= 3) continue; const u = k / n, [x, y] = pt(lerp(ax, bx, u), lerp(ay, by, u)); ctx.fillRect(x, y, 1, 1); } };
      edge(-hw, top, hw, top, 24); edge(-hw, 0, hw, 0, 24); edge(-hw, top, -hw, 0, 36); edge(hw, top, hw, 0, 36);
      if (!sl.mod) { const [cx, cy] = pt(0, top / 2); ctx.fillStyle = C[on ? 'f5' : 'b3']; ctx.fillRect(cx - 5, cy - 1, 11, 2); ctx.fillRect(cx - 1, cy - 5, 2, 11); }
    });
  },
  /* each hole in our hull gets a blinking marker on the deck above it, and a repair bar while patching */
  drawLeaks(ctx, t) {
    const ps = this.player, cap = this.captain;
    for (const b of ps.breaches) {
      const p = ps.toWorld(b.lx, ps.deckY(b.lx) - 46), x = Cam.bx(p.x), y = Cam.by(p.y) + Math.round(Math.sin(t * 5 + b.lx) * 2);
      blit(ctx, SPR.i_leak, x - 3, y - 4); if (Math.floor(t * 4) % 2) P.ring(ctx, x, y, 7, C.r4);
      const q = ps.toWorld(b.lx, ps.deckY(b.lx) - 30), qx = Cam.bx(q.x), qy = Cam.by(q.y);
      ctx.fillStyle = C.r4; ctx.fillRect(qx, qy, 1, 3); ctx.fillRect(qx - 1, qy + 3, 3, 1);
      if (b.fix > 0) { P.rect(ctx, x - 9, y - 9, 18, 4, C.ink); P.rect(ctx, x - 8, y - 8, Math.round(16 * clamp(b.fix / 1.1, 0, 1)), 2, C.green); }
    }
  },
  slotAt(wx, wy) {
    const ps = this.player;
    for (let i = 0; i < ps.slots.length; i++) { const lo = ps.toLocal(wx, wy), sl = ps.slots[i]; if (Math.abs(lo.x - sl.lx) < 30 && lo.y > ps.deckY(sl.lx) - 80 && lo.y < ps.deckY(sl.lx) + 20) return i; }
    return -1;
  },
};

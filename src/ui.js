'use strict';
/* Pixel UI drawn into the buffer: HUD, banners, title, how-to, route cards, refit shop, pause and end screens.
   Immediate mode: each frame registers clickable rects; clicks are resolved against last frame's rects. */
sprite('coin', ['.yyyy.', 'yYYYYy', 'yYyyYy', 'yYyyYy', 'yYYYYy', '.yyyy.'], { y: 'f3', Y: 'gold' });
sprite('heart', ['.rr.rr.', 'rRRrRRr', 'rRRRRRr', '.rRRRr.', '..rRr..', '...r...'], { r: 'r1', R: 'r3' });
sprite('plank', ['wwwwwww', 'WWWWWWW', 'wwwwwww', 'kkkkkkk'], { w: 'w4', W: 'w5', k: 'w1' });
sprite('eyeicon', ['..kkkk..', '.kggggk.', 'kgGiiGgk', 'kgGiiGgk', '.kggggk.', '..kkkk..'], { k: 'k1', g: 'g1', G: 'g2', i: 'ink' });

/* encounter emblems for the route cards (hand-drawn, 16 x 14) */
sprite('ic_skiffs', [
  '................', '.......m........', '.......m........', '......mMm.......', '.....mMMm.......', '....mMMMm.......', '.......m........',
  'w.............w.', 'ww...........ww.', '.wWWWWWWWWWWWw..', '..wwwwwwwwwww...', '...s..s..s..s...', '..s..s..s..s....', '................',
], { m: 'b1', M: 'b3', w: 'w2', W: 'w5', s: 't6' });
sprite('ic_rival', [
  '.......m........', '...rrrrmrrrr....', '...rRrRmRrRr....', '...rRrRmRrRr....', '...rRrRmRrRr....', '...rrrrmrrrr....', '.......m........',
  'hh.....m.....hh.', '.hW...........Wh', '..wwwwwwwwwwwww.', '...wWWWWWWWWWw..', '....wwwwwwwww...', '..s...s...s...s.', '................',
], { m: 'w3', r: 'r1', R: 'b3', h: 'w4', W: 'w5', w: 'w2', s: 't6' });
sprite('ic_storm', [
  '....nnnnn.......', '..nnNNNNNnn.....', '.nNNNNNNNNNnn...', 'nNNNNNNNNNNNNn..', '.nnnnnnnnnnnn...', '......yy........', '.....yy.........',
  '....yyyyy.......', '......yy........', '.....yy.........', '....yy..........', '...y............', '..y.............', '................',
], { n: 'n4', N: 'n6', y: 'f5' });
sprite('ic_nest', [
  '..........kk....', '.........kKk....', '........kKk.....', '........kK......', '........kKk.....', '.........kKk....', '..kk......kKk...',
  '.kKk......kKk...', 'kKk.......kKk...', 'kK........kKk...', 'kKk......kKk....', '.kKkk..kkKk.....', '..kKKkkKKk......', 'ssssssssssssssss',
], { k: 'k3', K: 'k5', s: 't6' });
sprite('ic_twin', [
  '...m.......m....', '..rmr.....rmr...', '..rmr.....rmr...', '...m.......m....', 'h..m..h.h..m..h.', '.wwwww.....wwww.', '..www.......ww..',
  '................', '....x.....x.....', '.....x...x......', '......x.x.......', '.......x........', '......x.x.......', '.....x...x......',
], { m: 'w3', r: 'r2', h: 'w4', w: 'w2', x: 'm4' });
sprite('ic_ghost', [
  '....bbbbbbb.....', '...bBBBBBBBb....', '..bBBBBBBBBBb...', '..bBggBBBggBb...', '..bBggBBBggBb...', '..bBBBBBBBBBb...', '...bBBBbBBBb....',
  '....bBBBBBb.....', '....bBbBbBb.....', '.....b.b.b......', '................', '..d.d.d.d.d.d...', '.d.d.d.d.d.d....', '................',
], { b: 'b0', B: 'b2', g: 'g2', d: 'd2' });
sprite('ic_berserk', [
  'mm..........mm..', 'mMm........mMm..', 'mMMm......mMMm..', '.mMMw....wMMm...', '..mww....wwm....', '....ww..ww......', '.....wwww.......',
  '......ww........', '.....wwww.......', '....ww..ww......', '...ww....ww.....', '..ww......ww....', '.ww........ww...', '................',
], { m: 'm2', M: 'm4', w: 'w4' });
sprite('ic_kraken', [
  '.....kkkkkk.....', '...kkKKKKKKkk...', '..kKKggggggKKk..', '.kKgGGGiiGGGgKk.', '.kKgGGGiiGGGgKk.', '..kKKggggggKKk..', '...kkKKKKKKkk...',
  '.k...kkkkkk...k.', 'kKk..k.kk.k..kKk', '.kKk.k....k.kKk.', '..kKkk....kkKk..', '...kk......kk...', '................', '................',
], { k: 'k2', K: 'k4', g: 'g1', G: 'g2', i: 'ink' });


/* 12 x 12 action icons for the deck slot bar */
sprite('i_ballista', ['............', '.....b......', '....b.b.....', '...b...b....', '.wwwwwwwwMM.', '...b...b....', '....b.b.....', '.....b......', '....w.w.....', '...w...w....', '..w.....w...', '............'], { b: 'w5', w: 'w3', M: 'm4' });
sprite('i_wall', ['....rrrr....', '...rRRRRr...', '..rRRbbRRr..', '.rRRRbbRRRr.', '.rRbbmmbbRr.', '.rRbbmmbbRr.', '.rRRRbbRRRr.', '..rRRbbRRr..', '...rRRRRr...', '....rrrr....', '............', '............'], { r: 'm1', R: 'r2', b: 'b3', m: 'm4' });
sprite('i_brazier', ['.....f......', '....ff......', '....fYf.....', '...fYYff....', '...fYWYf....', '..fYWWYf....', '.mmmmmmmmm..', '..mMMMMMm...', '...mmmmm....', '....m.m.....', '...m...m....', '..m.....m...'], { f: 'f3', Y: 'f5', W: 'f6', m: 'm1', M: 'm3' });
sprite('i_arm', ['...sgg......', '...s..gg....', '...s....g...', '...s.....g..', '...s.....g..', '...s......g.', '...s......g.', '...s.....g..', '...s.....g..', '...s....g...', '...s..gg....', '...sgg......'], { g: 'gold', s: 'b3' });
sprite('i_winch', ['....wwww....', '..ww....ww..', '.w...ww...w.', '.w...ww...w.', 'w..w.ww.w..w', 'w...wMMw...w', 'w...wMMw...w', 'w..w.ww.w..w', '.w...ww...w.', '.w...ww...w.', '..ww....ww..', '....wwww....'], { w: 'w5', M: 'm3' });
sprite('i_twin', ['............', 'b.b......M..', '.bwwwwwwwMM.', 'b.b......M..', '............', '............', '............', 'b.b......M..', '.bwwwwwwwMM.', 'b.b......M..', '............', '............'], { b: 'b3', w: 'w4', M: 'm4' });
sprite('i_fire', ['.........ff.', '........fYf.', '.......fYWf.', '.......fYf..', 'b.b.....f...', '.bwwwwwwMM..', 'b.b.....M...', '............', '............', '............', '............', '............'], { f: 'f3', Y: 'f5', W: 'f6', b: 'b3', w: 'w4', M: 'm4' });
sprite('i_harp', ['.........M..', '........MMM.', '.......M.M.M', 'bwwwwwwwwM..', '.r......M...', 'r.r.........', '.r.r........', '...r.r......', '....r.r.....', '............', '............', '............'], { b: 'b3', w: 'w4', M: 'm4', r: 'b1' });
sprite('i_repair', ['..mmmmm.....', '.mMMMMMm....', '..mmmmm.....', '....w.......', '....w.......', '....w.......', '....w.......', '....w.......', '....w.......', '....W.......', '............', '............'], { m: 'm1', M: 'm4', w: 'w4', W: 'w2' });
sprite('i_sell', ['rr........rr', 'rRr......rRr', '.rRr....rRr.', '..rRr..rRr..', '...rRrrRr...', '....rRRr....', '....rRRr....', '...rRrrRr...', '..rRr..rRr..', '.rRr....rRr.', 'rRr......rRr', 'rr........rr'], { r: 'r1', R: 'r4' });
sprite('i_check', ['.......g', '......gg', '.....gg.', 'g...gg..', 'gg.gg...', '.ggg....', '..g.....'], { g: 'green' });

sprite('i_leak', ['...r...', '..rWr..', '..rWr..', '.rWWWr.', 'rWWfWWr', 'rWfffWr', 'rWWfWWr', '.rWWWr.', '..rrr..'], { r: 'r4', W: 't6', f: 'foam' });
/* 5x7 capitals and runes for the logo */
const GLYPH = {
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'], R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'], E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'], L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  'ᚲ': ['...#.', '..#..', '.#...', '#....', '.#...', '..#..', '...#.'], 'ᚱ': ['###..', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  'ᚨ': ['#....', '##...', '#.#..', '##...', '#.#..', '#....', '#....'], 'ᛖ': ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  'ᚾ': ['#....', '#....', '###..', '#.##.', '#...#', '#....', '#....'], 'ᛚ': ['#....', '##...', '#.#..', '#....', '#....', '#....', '#....'],
};
function glyphs(ctx, str, x, y, col, sc = 1, gap = 1, shadow = C.ink) {
  let cx = x; const draw = (ox, oy, c) => { let xx = x + ox; ctx.fillStyle = c; for (const ch of str) { const g = GLYPH[ch] || GLYPH[' ']; for (let r = 0; r < 7; r++) for (let q = 0; q < 5; q++) if (g[r][q] === '#') ctx.fillRect(xx + q * sc, y + oy + r * sc, sc, sc); xx += (5 + gap) * sc; } cx = xx; };
  if (shadow) draw(sc, sc, shadow); draw(0, 0, col); return cx - x;
}
function glyphW(str, sc = 1, gap = 1) { return [...str].length * (5 + gap) * sc - gap * sc; }

const UI = {
  hurtT: 0, hoverSlot: -1, selSlot: -1, paused: false, screen: 'title', rects: [], banner_: null, hint: '', slotOpts: null, flashT: 0,
  init() {
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.screen === 'settings') { this.screen = this.settingsBack || 'title'; return; }
      if (e.key === 'Escape' && (this.screen === 'bon' || this.screen === 'cap')) { this.screen = 'refit'; return; }
      if (e.key === 'Escape') { if (this.screen === 'how' || this.screen === 'chsel') this.screen = 'title'; else if (G.state === 'fight' || G.state === 'won') this.pause(!this.paused); }
      if ((e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') && this.screen === 'loot' && this.loot && this.loot.t > 1.6) { this.loot.done(); return; }
      if (e.key === 'Enter' && this.screen === 'title') { const sv = Save.get(); if (sv) { Sfx.init(); Save.load(sv); } else this.start(); }
      if (e.key === 'm' || e.key === 'M') { Sfx.init(); const on = !(Settings.music || Settings.sfx); Settings.music = Settings.sfx = on; Settings.save(); Sfx.apply(); G.banner(on ? '声音开' : '静音', '', '#e8dcbc', 0.6); }
    });
  },
  start() { Sfx.init(); Sfx.play('ui'); this.screen = null; G.newRun(false); },
  pause(on) { this.paused = on; this.screen = on ? 'pause' : null; if (on) { this.savedScale = FX.timeScale; FX.timeScale = 0; } else FX.timeScale = this.savedScale || 1; },
  pulse(k) { if (k === 'hurt') this.hurtT = 1; },
  coins: [], coinPop: 0,
  partBurst(wx, wy, n) { for (let i = 0; i < n; i++) this.coins.push({ x: Cam.bx(wx), y: Cam.by(wy), vx: rand(-60, 60), vy: rand(-110, -50), t: -i * 0.07, part: true }); },
  coinBurst(wx, wy, n) { for (let i = 0; i < n; i++) this.coins.push({ x: Cam.bx(wx), y: Cam.by(wy), vx: rand(-60, 60), vy: rand(-110, -50), t: -i * 0.05 }); },
  drawCoins(ctx, dt) {
    for (const c of this.coins) {
      const tx = c.part ? 50 : 11, ty = 44;
      c.t += dt; if (c.t < 0) continue;
      if (c.t < 0.35) { c.vy += 400 * dt; c.x += c.vx * dt; c.y += c.vy * dt; }
      else { const k = Math.min(1, (c.t - 0.35) / 0.28); c.x = lerp(c.x, tx, k * k); c.y = lerp(c.y, ty, k * k);
        if (k >= 1) { c.done = true; if (c.part) { this.partPop = 1; Sfx.play('coin', -0.8, 0.25); } else { this.coinPop = 1; G.silverPending = Math.max(0, G.silverPending - (c.value || 1)); Sfx.play('coinTick', -0.8, 0.35); } } }
      blit(ctx, SPR[c.part ? 'gear' : COIN_FRAMES[Math.floor(c.t * 14) % 4]], c.x - 3, c.y - 3);
    }
    this.coins = this.coins.filter((c) => !c.done);
    this.coinPop = Math.max(0, this.coinPop - dt * 5); this.partPop = Math.max(0, (this.partPop || 0) - dt * 5);
  },
  banner(title, sub, col, dur, rune) { this.banner_ = { title, sub, col, dur, t: 0, rune }; },
  route() { this.screen = 'map'; }, refit(harbor) { this.screen = 'refit'; this.selSlot = -1; this.slotOpts = null; G.banner(harbor ? '港口' : '修整', harbor ? '商店八折' : '点甲板空位建造 · 左边照顾船长和 Bon · 下方修船', '#9fe8b0', 2.2); },
  end(won) {
    this.screen = 'end'; this.won = won; this.record = won && (G.chapter === 1 || G.fullRun) ? Save.record(G.chapter, G.stats.time) : false;
    if (won && G.chapter < 5) { Save.unlock('ch' + (G.chapter + 1)); Save.write('ch' + (G.chapter + 1)); }
    if (won && G.chapter === 5) { Save.unlock('won'); Save.unlock('won5'); Save.clear(); }
  },
  hideAll() { if (this.screen !== 'title') this.screen = null; }, hud() {},

  /* ---- input ---- */
  mouse() { return { x: Input.mouse.sx / Cam.k, y: Input.mouse.sy / Cam.k }; },
  hitAt(p) { for (let i = this.rects.length - 1; i >= 0; i--) { const r = this.rects[i]; if (p.x >= r.x && p.y >= r.y && p.x < r.x + r.w && p.y < r.y + r.h) return r; } return null; },
  update(dt) {
    this.hurtT = Math.max(0, this.hurtT - dt * 2.5);
    if (this.loot) this.loot.t += dt;
    if (this.coins.length && (['map', 'route', 'title', 'how', 'end'].includes(this.screen) || G.state === 'title')) { for (const c of this.coins) if (!c.part) G.silverPending = Math.max(0, G.silverPending - (c.value || 1)); this.coins = []; }
    if (this.travel) { this.travel.t += dt / 0.85; if (this.travel.t >= 1) { const n = this.travel.node; this.travel = null; SeaMap.enter(n); } }
    if (this.banner_) { this.banner_.t += dt; if (this.banner_.t > this.banner_.dur + 0.5) this.banner_ = null; }
    const m = this.mouse(), hit = this.hitAt(m);
    this.hover = hit ? hit.id : null;
    G.cv.style.cursor = hit && !hit.disabled ? 'pointer' : G.state === 'fight' && !this.screen ? 'crosshair' : 'default';
    // deck slots in refit
    this.hoverSlot = -1;
    if (G.state === 'refit' && this.screen === 'refit' && !hit) { const w = Cam.toWorld(Input.mouse.sx, Input.mouse.sy); this.hoverSlot = G.slotAt(w.x, w.y); if (this.hoverSlot >= 0) G.cv.style.cursor = 'pointer'; }
    if (Input.mouse.lp) {
      if (hit) { if (!hit.disabled) { Sfx.play('ui'); hit.fn(); } Input.mouse.lp = false; Input.mouse.l = false; }
      else if (G.state === 'refit' && this.screen === 'refit') { if (this.hoverSlot >= 0) { this.selSlot = this.hoverSlot; Sfx.play('ui'); } else this.selSlot = -1; }
    }
  },

  /* ---- drawing helpers ---- */
  panel(ctx, x, y, w, h, tone = 'wood') {
    x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h); TXT.clear(ctx, x, y, w, h);
    const fill = tone === 'deep' ? C.k0 : tone === 'dark' ? C.n1 : C.w0;
    P.rect(ctx, x, y, w, h, C.ink); P.rect(ctx, x + 1, y + 1, w - 2, h - 2, tone === 'deep' ? C.k2 : C.w3); P.rect(ctx, x + 2, y + 2, w - 4, h - 4, fill);
    P.rect(ctx, x + 2, y + 2, w - 4, 1, tone === 'deep' ? C.k1 : C.w1);
    for (const [cx, cy] of [[x + 2, y + 2], [x + w - 4, y + 2], [x + 2, y + h - 4], [x + w - 4, y + h - 4]]) { P.rect(ctx, cx, cy, 2, 2, C.m3); P.dot(ctx, cx, cy, C.m4); }
  },
  button(ctx, id, x, y, w, h, label, o = {}) {
    x = Math.round(x); y = Math.round(y);
    const hov = this.hover === id && !o.disabled, down = hov && Input.mouse.l;
    const base = o.disabled ? C.w1 : o.primary ? (hov ? C.r3 : C.r2) : hov ? C.w4 : C.w3;
    P.rect(ctx, x, y + 1, w, h, C.ink); P.rect(ctx, x, y + (down ? 1 : 0), w, h, C.ink);
    P.rect(ctx, x + 1, y + 1 + (down ? 1 : 0), w - 2, h - 2, base);
    P.rect(ctx, x + 1, y + 1 + (down ? 1 : 0), w - 2, 1, o.primary ? C.r4 : C.w5);
    text(ctx, label, x + w / 2, y + (h - (o.size || 12)) / 2 - 1 + (down ? 1 : 0), { size: o.size || 12, align: 'center', color: o.disabled ? C.b0 : C.b4, bold: true });
    this.rects.push({ id, x, y, w, h, fn: o.fn || (() => {}), disabled: o.disabled });
    return hov;
  },
  bar(ctx, x, y, w, h, frac, col, back = C.n1) {
    P.rect(ctx, x - 1, y - 1, w + 2, h + 2, C.ink); P.rect(ctx, x, y, w, h, back);
    const fw = Math.round(w * clamp(frac, 0, 1)); P.rect(ctx, x, y, fw, h, col); P.rect(ctx, x, y, fw, 1, C.white === col ? col : shadeUp(col));
    for (let i = x + 8; i < x + w; i += 8) P.rect(ctx, i, y, 1, h, C.ink);
  },

  /* ---- per-frame draw ---- */
  draw(ctx) {
    this.rects = [];
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = Cam.BW, H = Cam.BH;
    if (G.state !== 'title' && !['title', 'how', 'map', 'route'].includes(this.screen) && !(this.screen === 'settings' && this.settingsBack === 'title')) this.drawHUD(ctx, W, H);
    if (!this.screen || this.screen === 'refit') this.drawBanner(ctx, W, H);
    if (this.screen === 'title') this.drawTitle(ctx, W, H);
    else if (this.screen === 'how') this.drawHow(ctx, W, H);
    else if (this.screen === 'route' || this.screen === 'map') this.drawMap(ctx, W, H);
    else if (this.screen === 'event') this.drawEvent(ctx, W, H);
    else if (this.screen === 'refit') this.drawRefit(ctx, W, H);
    else if (this.screen === 'bon') this.drawBon(ctx, W, H);
    else if (this.screen === 'cap') this.drawCap(ctx, W, H);
    else if (this.screen === 'loot') this.drawLoot(ctx, W, H);
    else if (this.screen === 'pause') this.drawPause(ctx, W, H);
    else if (this.screen === 'end') this.drawEnd(ctx, W, H);
    else if (this.screen === 'settings') this.drawSettings(ctx, W, H);
    else if (this.screen === 'chsel') this.drawChapters(ctx, W, H);
    // a gear in the corner opens the settings from anywhere in a voyage
    if (G.state !== 'title' && !['title', 'how', 'settings', 'pause', 'end', 'event', 'bon', 'cap', 'loot'].includes(this.screen)) {
      this.button(ctx, 'gearbtn', W - 20, 4, 16, 16, '', { fn: () => { if (!this.screen && (G.state === 'fight' || G.state === 'won')) { this.pause(true); this.settingsBack = 'pause'; } else this.settingsBack = this.screen || 'refit'; this.screen = 'settings'; } });
      blit(ctx, SPR.gear, W - 16, 8 - (this.hover === 'gearbtn' ? 1 : 0));
    }
    Touch.draw(ctx, W, H);
  },
  drawHUD(ctx, W, H) {
    const cap = G.captain, ps = G.player;
    // captain portrait
    this.panel(ctx, 6, 6, 30, 30, 'dark'); ctx.drawImage(SPR.head_captain, 0, 0, 13, 12, 9, 9, 26, 24);
    { const hs = armourSprites(captainGear()).helm; if (hs) ctx.drawImage(hs, 0, 0, hs.width, hs.height, 9, 9, hs.width * 2, hs.height * 2); }
    text(ctx, '船长', 42, 6, { size: 10, color: C.b2 });
    this.bar(ctx, 42, 19, 96, 6, cap.hp / cap.max, cap.hp / cap.max < 0.3 && Math.floor(G.t * 6) % 2 ? C.r4 : C.r3);
    digits(ctx, `${Math.max(0, Math.round(cap.hp))}`, 142, 19, C.b3);
    text(ctx, '船体', 42, 27, { size: 10, color: C.b2 });
    const hf = ps.hull / ps.hullMax; this.bar(ctx, 66, 30, 72, 5, hf, hf < 0.3 && Math.floor(G.t * 4) % 2 ? C.r3 : C.w5);
    digits(ctx, `${Math.max(0, Math.round(ps.hull))}`, 142, 30, C.b3);
    blit(ctx, SPR.coin, 8, 41 - Math.round(this.coinPop * 2)); digits(ctx, Math.max(0, G.silver - Math.ceil(G.silverPending || 0)), 17, 41, this.coinPop > 0.3 ? C.white : C.gold, this.coinPop > 0.6 ? 1 : 1);
    blit(ctx, SPR.gear, 47, 40 - Math.round((this.partPop || 0) * 2)); digits(ctx, G.parts, 56, 41, (this.partPop || 0) > 0.3 ? C.white : C.m4);
    if (G.wpn) { const wx = 118, ic = SPR[UPGRADES[cap.weapon].icon], n = WEAPONS.filter((k) => G.wpn.own[k]).length; P.rect(ctx, wx, 38, 14, 12, C.ink); P.rect(ctx, wx + 1, 39, 12, 10, C.n2); ctx.drawImage(ic, 0, 0, ic.width, ic.height, wx + 2, 40, 10, 8); if (n > 1 && !Touch.on) text(ctx, 'Q', wx + 17, 38, { size: 8, color: C.b1, shadow: false }); }
    if (Bon.d) { const bx = 78; blit(ctx, SPR.bon_head, bx, 39); digits(ctx, String(Bon.d.lv), bx + 9, 41, C.f5); P.rect(ctx, bx + 17, 41, 16, 4, C.ink); P.rect(ctx, bx + 18, 42, Math.round(14 * Bon.full / 100), 2, Bon.hungry() ? (Math.floor(G.t * 3) % 2 ? C.r4 : C.r2) : C.f4); }
    this.drawCoins(ctx, 1 / 60);
    if (ps.breaches.length && G.state === 'fight') text(ctx, `${ps.breaches.length} 处破洞在漏水 · 站过去按住 E`, 8, 50, { size: 10, color: Math.floor(G.t * 3) % 2 ? C.r4 : C.f4 });
    // combo counter
    if (G.comboN >= 2 && G.comboT > 0) {
      this.comboPop = Math.max(0, (this.comboPop || 0) - 1 / 20);
      const sc = 3 + (this.comboPop > 0.5 ? 1 : 0), str = String(G.comboN), w = str.length * 4 * sc, x = W - 16 - w, y = 58 - (this.comboPop > 0.5 ? 2 : 0);
      if (G.comboT > 0.3 || Math.floor(G.t * 16) % 2) { digits(ctx, str, x, y, G.comboN >= 8 ? C.f5 : G.comboN >= 4 ? C.f4 : C.b4, sc); text(ctx, '连击', W - 14, y + 5 * sc + 3, { size: 10, align: 'right', color: C.b2, bold: true }); }
    }
    // encounter and wind
    const nm = G.state === 'refit' ? '修整' : G.enc ? G.enc.name : '';
    if (nm) text(ctx, nm, W - 26, 7, { size: 13, align: 'right', color: C.b3, bold: true });
    ctx.font = `600 10px ${FONT}`; const wx = W - 48 - Math.round(ctx.measureText(tr('风')).width) - 4, wy = 26, dir = WIND.v >= 0 ? 1 : -1, len = 6 + Math.round(Math.abs(WIND.v) * 10);
    text(ctx, '风', W - 26, 21, { size: 10, align: 'right', color: C.b1 });
    P.rect(ctx, wx - (dir > 0 ? 0 : len), wy, len, 1, C.b2); P.dot(ctx, wx + dir * len, wy, C.b3); P.dot(ctx, wx + dir * (len - 1), wy - 1, C.b3); P.dot(ctx, wx + dir * (len - 1), wy + 1, C.b3);
    // boss
    const K = G.kraken || G.boss;
    if (K) { const bw = Math.min(220, W - 120), bx = Math.round(W / 2 - bw / 2), by = H - 16, wy = K === G.boss; blit(ctx, wy ? SPR[K.icon || 'n_wyrm'] : SPR.eyeicon, bx - (wy ? 14 : 12), by - (wy ? 4 : 1)); text(ctx, wy ? K.name : '海妖', bx, by - 13, { size: 10, color: wy ? K.col || C.n8 : C.g2 }); if (wy && K.phase > 1) text(ctx, `阶段 ${K.phase}`, bx + bw, by - 13, { size: 9, align: 'right', color: K.phase === 3 ? C.r4 : C.b2 }); this.bar(ctx, bx, by, bw, 5, K.hp / K.max, wy ? (K.phase === 3 ? C.r3 : C[K.bar || 'n7']) : C.k5, C.k0); if (wy && K.shield) { const sw = Math.round(bw * K.shield()); if (sw > 0) { P.rect(ctx, bx, by - 3, sw, 2, C.g2); } } }
    // hint
    const intro = G.state === 'fight' && G.step <= 1 && G.encT < 25;
    const wHint = { oar: '左键 挥桨 · 按住或右键 蓄力 · 空格 跳（可二段跳） · Shift 翻滚', cutlass: '左键 快斩 · 按住或右键 冲刺斩 · 空格 跳（可二段跳） · Shift 翻滚', scatter: '左键 朝鼠标射击 · 按住或右键 蓄力穿透 · 空格 跳（可二段跳） · Shift 翻滚', axe: '左键 重劈（会点燃） · 按住或右键 蓄力火焰地裂 · 空格 跳 · Shift 翻滚', harpoon: '左键 掷叉把敌人拽过来 · 按住或右键 把自己拽过去 · 空格 跳 · Shift 翻滚', hammer: '左键 锤击引出闪电链 · 按住或右键 掷出回旋锤召雷 · 空格 跳 · Shift 翻滚' }[cap.weapon];
    const hint = Touch.on && !G.hint ? '' : G.hint || (G.state === 'refit' ? 'A/D 走动 · 点甲板上的空位建造' : intro || this.swapHintT > 0 ? wHint : '');
    this.swapHintT = Math.max(0, (this.swapHintT || 0) - 1 / 60); if (this.lastW && this.lastW !== cap.weapon) this.swapHintT = 3; this.lastW = cap.weapon;
    if (hint && !this.screen && !K) { ctx.font = `600 10px ${FONT}`; const tw = Math.min(W - 16, ctx.measureText(tr(hint)).width + 12); P.rect(ctx, W / 2 - tw / 2, H - 18, tw, 14, C.n1); P.rect(ctx, W / 2 - tw / 2, H - 18, tw, 1, C.n3); text(ctx, hint, W / 2, H - 16, { size: 10, align: 'center', color: C.b2 }); }
  },
  drawBanner(ctx, W, H) {
    const b = this.banner_; if (!b) return;
    const inT = Math.min(1, b.t / 0.25), outT = clamp((b.dur + 0.5 - b.t) / 0.4, 0, 1), k = Math.min(inT, outT);
    if (k <= 0) return;
    const y = Math.round(H * 0.24 + (1 - inT) * 10), bw = Math.round(W * 0.7 * k);
    P.rect(ctx, W / 2 - bw / 2, y - 4, bw, 1, C.b1); P.rect(ctx, W / 2 - bw / 2, y + 44, bw, 1, C.b1);
    if (k < 0.99) return;
    if (b.rune) glyphs(ctx, runeLatin(b.rune), W / 2 - glyphW(runeLatin(b.rune)) / 2, y - 14, C.g1, 1, 2);
    text(ctx, b.title, W / 2, y, { size: 26, align: 'center', color: b.col, bold: true, outline: true });
    text(ctx, b.sub, W / 2, y + 30, { size: 11, align: 'center', color: C.b3 });
  },
  drawTitle(ctx, W, H) {
    // title block on the left third, the ship sails on the right
    const bw = Math.min(250, W * 0.5), en = Settings.lang === 'en', nLines = wrapText(ctx, '一条长船，一场风暴，一海的敌人。在摇晃的甲板上把登船的海盗打下海，最后面对深渊里睁开的那只眼睛。', bw, 10).length;
    const blockH = 90 + nLines * 13 + (Save.get() ? 24 : 0) + 44 + 12, cx = Math.round(Math.min(W * 0.3, 150)), cy = Math.round(clamp((H - blockH) / 2, 6, H * 0.16));
    glyphs(ctx, 'ᚲᚱᚨᚲᛖᚾ ᚲᛖᛖᛚ', cx - glyphW('ᚲᚱᚨᚲᛖᚾ ᚲᛖᛖᛚ', 1, 2) / 2, cy, C.g1, 1, 2);
    if (en) { glyphs(ctx, 'KRAKEN', cx - glyphW('KRAKEN', 5, 1) / 2, cy + 14, C.b4, 5, 1, C.w0); glyphs(ctx, 'KEEL', cx - glyphW('KEEL', 3, 2) / 2, cy + 56, C.f4, 3, 2); }
    else { text(ctx, '海妖龙骨', cx, cy + 12, { size: 40, align: 'center', color: C.b4, bold: true, outline: true, shadow: C.w0 }); glyphs(ctx, 'KRAKEN KEEL', cx - glyphW('KRAKEN KEEL', 2, 2) / 2, cy + 60, C.f4, 2, 2); }
    const lines = wrapText(ctx, '一条长船，一场风暴，一海的敌人。在摇晃的甲板上把登船的海盗打下海，最后面对深渊里睁开的那只眼睛。', bw, 10);
    lines.forEach((l, i) => text(ctx, l, cx, cy + 84 + i * 13, { size: 10, align: 'center', color: C.b2 }));
    const by = cy + 90 + lines.length * 13;
    const save = Save.get(), prog = Save.progress(), confirm = this.confirmNew && G.t - this.confirmNew < 3;
    let yy = by;
    if (save) { this.button(ctx, 'cont', cx - 76, yy, 152, 20, `继续航行 · ${Save.label(save)}`, { primary: true, size: 11, fn: () => { Sfx.init(); Sfx.play('ui'); Save.load(save); } }); yy += 24; }
    this.button(ctx, 'start', cx - 76, yy, 72, 18, confirm ? '确定重来？' : save ? '新航程' : '启 航', { primary: !save || confirm, size: save ? 10 : 12, fn: () => { if (save && !confirm) { this.confirmNew = G.t; return; } this.confirmNew = 0; this.start(); } });
    this.button(ctx, 'how', cx + 4, yy, 72, 18, '操作说明', { size: 11, fn: () => { Sfx.init(); this.screen = 'how'; } });
    yy += 22;
    if (Save.reach() > 1) { this.button(ctx, 'chsel', cx - 76, yy, 72, 16, '选择章节', { size: 10, fn: () => { Sfx.init(); Sfx.play('ui'); this.screen = 'chsel'; } }); this.button(ctx, 'set', cx + 4, yy, 72, 16, '设置', { size: 10, fn: () => { Sfx.init(); this.settingsBack = 'title'; this.screen = 'settings'; } }); }
    else this.button(ctx, 'set', cx - 36, yy, 72, 16, '设置', { size: 10, fn: () => { Sfx.init(); this.settingsBack = 'title'; this.screen = 'settings'; } });
    yy += 22;
    const b = Save.best(), fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    const far = [5, 4, 3, 2].find((n) => b['c' + n] != null);
    if (b.c1 != null) text(ctx, far ? `最快 · 第一章 ${fmt(b.c1)} · 一路到第 ${far} 章 ${fmt(b['c' + far])}` : `最快通关 · 第一章 ${fmt(b.c1)}`, cx, yy, { size: 9, align: 'center', color: C.f4, fit: W * 0.5 });
    else if (!Touch.on && Math.floor(G.t * 2) % 2) text(ctx, save ? '按 Enter 继续' : '按 Enter 开始', cx, yy, { size: 9, align: 'center', color: C.b0 });
  },
  drawSettings(ctx, W, H) {
    if (this.settingsBack && this.settingsBack !== 'title') { P.rect(ctx, 0, 0, W, H, 'rgba(4,6,12,0.55)'); TXT.dim(ctx, 0.55); }
    const w = 230, h = 122, x = Math.round(W / 2 - w / 2), y = Math.round(H / 2 - h / 2);
    this.panel(ctx, x, y, w, h);
    text(ctx, '设置', x + 12, y + 8, { size: 14, color: C.f5, bold: true });
    const row = (i, label, opts) => {
      const yy = y + 32 + i * 24; text(ctx, label, x + 14, yy + 3, { size: 11, color: C.b2 });
      opts.forEach((o, j) => { const bx = x + 96 + j * 64; this.button(ctx, 'st' + i + j, bx, yy, 58, 16, o.label, { size: 10, primary: o.on, fn: () => { o.fn(); Settings.save(); Sfx.apply(); } }); });
    };
    row(0, '语言', [{ label: '中文', on: Settings.lang === 'zh', fn: () => { Settings.lang = 'zh'; } }, { label: 'English', on: Settings.lang === 'en', fn: () => { Settings.lang = 'en'; } }]);
    row(1, '音乐', [{ label: '开', on: Settings.music, fn: () => { Settings.music = true; } }, { label: '关', on: !Settings.music, fn: () => { Settings.music = false; } }]);
    row(2, '音效', [{ label: '开', on: Settings.sfx, fn: () => { Settings.sfx = true; } }, { label: '关', on: !Settings.sfx, fn: () => { Settings.sfx = false; } }]);
    this.button(ctx, 'stback', x + w - 70, y + h - 24, 58, 16, '返回', { size: 10, fn: () => { this.screen = this.settingsBack || 'title'; } });
  },
  drawHow(ctx, W, H) {
    const w = Math.min(420, W - 16), h = Math.min(226, H - 12), x = Math.round(W / 2 - w / 2), y = Math.round(H / 2 - h / 2);
    this.panel(ctx, x, y, w, h);
    text(ctx, '操作', x + 12, y + 8, { size: 14, color: C.f5, bold: true });
    const rows = [['A / D', '移动。船随浪倾斜，站不稳会滑。'], ['空格 / W', '跳，按久跳高；空中还能再跳一次。'], ['在水里', '不会受伤。游到船边按左右就能爬上船，也可以按空格跳出水面。'], ['左键', '船桨三连击，第三下把人挑飞。'], ['按住左键 / 右键', '蓄力横扫。蓄满时角色发金光，放出去还会甩出一道剑气。'],
      ['S', '扎稳脚跟：不滑，挨打退得少；能挡住钩手。'], ['Shift', '翻滚，短暂无敌。'], ['Q', '切换已经买下的武器。'], ['E', '补破洞、点燃火盆。弩炮会自己开火。'], ['Esc / M', '暂停 / 静音。']];
    const keyW = Math.max(...rows.map(([k]) => this.tw(ctx, k, 10, true))) + 10;
    rows.forEach(([k, d], i) => {
      const yy = y + 28 + i * 17; ctx.font = `700 10px ${FONT}`; const kw = ctx.measureText(tr(k)).width + 10;
      P.rect(ctx, x + 12, yy, kw, 13, C.ink); P.rect(ctx, x + 13, yy, kw - 2, 12, C.w4); P.rect(ctx, x + 13, yy, kw - 2, 1, C.w6);
      text(ctx, k, x + 12 + kw / 2, yy, { size: 10, align: 'center', color: C.b4, bold: true, shadow: false });
      text(ctx, d, x + 20 + keyW, yy, { size: 10, color: C.b2, fit: w - 32 - keyW });
    });
    wrapText(ctx, '敌人挨打越多飞得越远。二段跳能跳上敌船；击沉敌船掉的零件自动收进船舱。', w - 96, 9).slice(0, 2).forEach((l, i, a) => text(ctx, l, x + 12, y + h - (a.length > 1 ? 27 : 20) + i * 11, { size: 9, color: C.g1 }));
    this.button(ctx, 'back', x + w - 66, y + h - 24, 54, 16, '知道了', { fn: () => { this.screen = 'title'; } });
  },
  /* ---- the sea chart ---- */
  parchment(R) {
    const key = R.w + 'x' + R.h; if (this._parch && this._parch.key === key) return this._parch.c;
    const c = offscreen(R.w, R.h), g = c.getContext('2d');
    for (let y = 0; y < R.h; y++) for (let x = 0; x < R.w; x++) {
      const e = Math.min(x, y, R.w - 1 - x, R.h - 1 - y), n = fbm2(x * 0.03, y * 0.03, 4), th = BAYER[(y & 3) * 4 + (x & 3)] / 18 + 0.5;
      const v = n * 0.55 + clamp(e / 26, 0, 1) * 0.6 + (th - 0.5) * 0.25;
      g.fillStyle = C[v > 0.78 ? 'b3' : v > 0.52 ? 'b2' : v > 0.34 ? 'b1' : 'b0']; g.fillRect(x, y, 1, 1);
    }
    // latitude lines, wave marks, a few islands and a compass rose
    g.fillStyle = C.b1; for (let x = 30; x < R.w - 20; x += 46) for (let y = 16; y < R.h - 16; y += 3) g.fillRect(x, y, 1, 1);
    for (let i = 0; i < 60; i++) { const x = Math.floor(hash1(i * 3.7) * (R.w - 40)) + 20, y = Math.floor(hash1(i * 9.1) * (R.h - 40)) + 20; g.fillStyle = C.b1; g.fillRect(x, y, 2, 1); g.fillRect(x + 2, y - 1, 2, 1); g.fillRect(x + 4, y, 2, 1); }
    for (let i = 0; i < 5; i++) { const cx = 30 + hash1(i * 5.3 + 1) * (R.w - 60), cy = 24 + hash1(i * 2.9 + 7) * (R.h - 60), r = 5 + hash1(i) * 9; for (let y = -r; y <= r; y++) for (let x = -r * 1.6; x <= r * 1.6; x++) { const d = (x * x) / (r * r * 2.56) + (y * y) / (r * r) + (noise2(x * 0.3 + i * 9, y * 0.3) - 0.5) * 0.7; if (d < 1) { g.fillStyle = C[d > 0.8 ? 'w3' : y < 0 ? 'b1' : 'b0']; g.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1); } } }
    const kx = R.w - 34, ky = R.h - 34; g.fillStyle = C.w2; for (let k = -12; k <= 12; k++) { g.fillRect(kx + k, ky, 1, 1); g.fillRect(kx, ky + k, 1, 1); } for (let k = -6; k <= 6; k++) { g.fillRect(kx + k, ky + k, 1, 1); g.fillRect(kx + k, ky - k, 1, 1); } g.fillStyle = C.r2; g.fillRect(kx - 1, ky - 14, 3, 3);
    this._parch = { key, c }; return c;
  },
  drawMap(ctx, W, H) {
    const R = { x: 8, y: 8, w: W - 16, h: H - 16 }, M = G.map; if (!M) return;
    P.rect(ctx, R.x - 1, R.y - 1, R.w + 2, R.h + 2, C.ink); TXT.clear(ctx, 0, 0, W, H); ctx.drawImage(this.parchment(R), R.x, R.y);
    text(ctx, M.ch > 1 ? `航海图 · ${CHAPTERS[M.ch].name}` : '航海图', R.x + 12, R.y + 6, { size: 14, color: C.w1, bold: true, shadow: C.b1 });
    text(ctx, this.travel ? '起航……' : '选择下一个目的地', R.x + 12, R.y + 23, { size: 10, color: C.w2, shadow: false });
    // purse and hull at the top right
    { let x = R.x + R.w - 30; const hs = String(Math.round(G.player.hull)), ps = String(G.parts), ss = String(G.silver);
      x -= hs.length * 4; digits(ctx, hs, x, R.y + 9, C.w1, 1, null); x -= 4; x -= text(ctx, '船体', x, R.y + 6, { size: 9, align: 'right', color: C.w2, shadow: false }); x -= 12;
      x -= ps.length * 4; digits(ctx, ps, x, R.y + 9, C.w1, 1, null); blit(ctx, SPR.gear, x - 9, R.y + 7); x -= 20;
      x -= ss.length * 4; digits(ctx, ss, x, R.y + 9, C.w1, 1, null); blit(ctx, SPR.coin, x - 9, R.y + 8); }
    const cur = M.nodes[M.at]; if (!cur) return;
    const avail = new Set(cur.next), t = G.t, all = M.layers.flat();
    // routes
    for (const n of all) for (const id of n.next || []) {
      const m = M.nodes[id], a = SeaMap.pos(n, R), b = SeaMap.pos(m, R), live = n.id === M.at && !this.travel, dist = Math.hypot(b.x - a.x, b.y - a.y), steps = Math.floor(dist / 3);
      for (let k = 2; k < steps - 2; k++) { if (((k + (live ? Math.floor(t * 8) : 0)) % 3) === 0) continue; const x = Math.round(lerp(a.x, b.x, k / steps)), y = Math.round(lerp(a.y, b.y, k / steps)); ctx.fillStyle = C[live ? 'r3' : n.visited && m.visited ? 'w1' : 'w3']; ctx.fillRect(x, y, live ? 2 : 1, live ? 2 : 1); }
    }
    // destinations
    let hovered = null;
    for (const n of all) {
      if (n.type === 'start') continue;
      const p = SeaMap.pos(n, R), T = nodeType(n), can = avail.has(n.id) && !this.travel, id = 'node_' + n.id, hov = this.hover === id;
      const past = n.layer <= cur.layer && !n.visited;
      if (past) ctx.globalAlpha = 0.35;
      if (can) P.ring(ctx, p.x, p.y, 12 + (Math.floor(t * 4) % 2), C.r3);
      P.disc(ctx, p.x, p.y, n.type === 'boss' ? 12 : 10, C.w1); P.disc(ctx, p.x, p.y, n.type === 'boss' ? 11 : 9, C[hov && can ? 'b4' : n.visited ? 'b1' : 'b3']);
      const ic = SPR[T.icon]; blit(ctx, ic, p.x - (ic.width >> 1), p.y - (ic.height >> 1));
      // reward tag
      const rw = n.reward || {}, ty = p.y + 13;
      if (rw.silver && !n.visited) { const s2 = String(rw.silver); blit(ctx, SPR.coin, p.x - (s2.length * 4 + 8) / 2, ty); digits(ctx, s2, p.x - (s2.length * 4 + 8) / 2 + 8, ty + 1, C.w1, 1, null); }
      if (rw.parts && !n.visited) { const s3 = String(rw.parts); blit(ctx, SPR.gear, p.x - 6, ty + 8); digits(ctx, s3, p.x + 3, ty + 9, C.w1, 1, null); }
      if (rw.unknown && !n.visited) text(ctx, '?', p.x, ty - 1, { size: 10, align: 'center', color: C.w1, bold: true, shadow: false });
      if (rw.heal && !n.visited) { ctx.fillStyle = C.r2; ctx.fillRect(p.x - 1, ty, 3, 7); ctx.fillRect(p.x - 3, ty + 2, 7, 3); }
      if (n.visited) { ctx.fillStyle = C.r2; for (let k = -4; k <= 4; k++) { ctx.fillRect(p.x + k, p.y + k, 1, 1); ctx.fillRect(p.x + k, p.y - k, 1, 1); } }
      ctx.globalAlpha = 1;
      this.rects.push({ id, x: p.x - 13, y: p.y - 13, w: 26, h: 34, disabled: !can, fn: () => { this.travel = { from: SeaMap.pos(cur, R), node: n, t: 0 }; Sfx.play('horn', 0, 0.5); } });
      if (hov) hovered = n;
    }
    // our ship
    let sp = SeaMap.pos(cur, R);
    if (this.travel) { const b = SeaMap.pos(this.travel.node, R), u = smooth(this.travel.t); sp = { x: lerp(this.travel.from.x, b.x, u), y: lerp(this.travel.from.y, b.y, u) }; }
    blit(ctx, SPR.n_ship, sp.x - 7, sp.y - 22 + Math.round(Math.sin(t * 3) * 1.5));
    // legend
    const lg = ['fight', 'elite', 'wreck', 'harbor', 'mystery', CHAPTERS[M.ch].node]; let lx = R.x + 12;
    for (const k of lg) { const ic = SPR[NODE_TYPES[k].icon]; blit(ctx, ic, lx, R.y + R.h - 17); lx += 15; const w = text(ctx, NODE_TYPES[k].name, lx, R.y + R.h - 16, { size: 9, color: C.w2, shadow: false }); lx += w + 10; }
    // tooltip for the hovered destination
    if (hovered) {
      const n = hovered, T = nodeType(n), e = n.enc ? ENC[n.enc] : null, p = SeaMap.pos(n, R);
      const title = e && n.type !== 'boss' ? `${tr(T.name)} · ${tr(e.name)}` : tr(T.name), body = e ? e.sub : T.desc;
      const lines = wrapText(ctx, body, 150, 10), w = 170, h = 34 + lines.length * 12 + (n.enc && n.type !== 'boss' ? 12 : 0);
      // place the tip where it hides the fewest destinations (the ones you can sail to count most)
      const boxes = all.filter((q) => q.type !== 'start').map((q) => { const qp = SeaMap.pos(q, R); return { x: qp.x - 14, y: qp.y - 14, w: 28, h: 38, k: q === n ? 12 : avail.has(q.id) ? 4 : 1 }; });
      const fit = (cx, cy) => ({ x: Math.round(clamp(cx, R.x + 4, R.x + R.w - w - 4)), y: Math.round(clamp(cy, R.y + 4, R.y + R.h - h - 22)) });
      const cands = [fit(p.x + 20, p.y - h / 2), fit(p.x - 20 - w, p.y - h / 2), fit(p.x - w / 2, p.y - 22 - h), fit(p.x - w / 2, p.y + 40), fit(p.x + 20, p.y - h - 8), fit(p.x - 20 - w, p.y + 12)];
      for (let gx = R.x + 4; gx <= R.x + R.w - w - 4; gx += 14) for (let gy = R.y + 4; gy <= R.y + R.h - h - 22; gy += 10) cands.push({ x: gx, y: gy });
      for (const b of boxes) b.k = b.k >= 12 ? 400 : b.k >= 4 ? 60 : 1;
      boxes.push({ x: R.x + 8, y: R.y + 4, w: 150, h: 34, k: 0.6 }, { x: R.x + R.w - 170, y: R.y + 4, w: 160, h: 16, k: 0.6 });
      const cost = (c) => boxes.reduce((a, b) => a + b.k * Math.max(0, Math.min(c.x + w, b.x + b.w) - Math.max(c.x, b.x)) * Math.max(0, Math.min(c.y + h, b.y + b.h) - Math.max(c.y, b.y)), 0) + Math.hypot(c.x + w / 2 - p.x, c.y + h / 2 - p.y) * 0.5;
      const { x, y } = cands.reduce((best, c) => (cost(c) < cost(best) ? c : best), cands[0]);
      this.panel(ctx, x, y, w, h, 'dark');
      text(ctx, title, x + 8, y + 6, { size: 11, color: C.f5, bold: true, fit: w - 16 });
      lines.forEach((l, i) => text(ctx, l, x + 8, y + 22 + i * 12, { size: 10, color: C.b2 }));
      if (e && n.type !== 'boss') { const st = Math.round(e.storm * 5); text(ctx, '风浪', x + 8, y + h - 14, { size: 9, color: C.b1 }); for (let s = 0; s < 5; s++) P.rect(ctx, x + 36 + s * 5, y + h - 11, 3, 6, C[s < st ? 't6' : 'n3']); }
    }
  },
  drawEvent(ctx, W, H) {
    const E = this.event; if (!E) return;
    P.rect(ctx, 0, 0, W, H, 'rgba(4,6,12,0.45)'); TXT.dim(ctx, 0.45);
    const w = Math.min(280, W - 20), lines = wrapText(ctx, E.body, w - 24, 11), h = 70 + lines.length * 14 + (E.reward ? 18 : 0), x = Math.round(W / 2 - w / 2), y = Math.round(H / 2 - h / 2);
    this.panel(ctx, x, y, w, h, E.danger ? 'deep' : 'wood');
    text(ctx, E.title, x + 12, y + 8, { size: 16, color: E.danger ? C.r4 : C.f5, bold: true });
    lines.forEach((l, i) => text(ctx, l, x + 12, y + 32 + i * 14, { size: 11, color: C.b3 }));
    if (E.reward) { let rx = x + 12; const ry = y + 36 + lines.length * 14; if (E.reward.silver) { blit(ctx, SPR.coin, rx, ry); digits(ctx, '+' + E.reward.silver, rx + 8, ry + 1, C.gold); rx += 40; } if (E.reward.parts) { blit(ctx, SPR.gear, rx, ry - 1); digits(ctx, '+' + E.reward.parts, rx + 9, ry + 1, C.m4); rx += 36; } if (E.reward.heal) { ctx.fillStyle = C.r4; ctx.fillRect(rx + 2, ry, 3, 7); ctx.fillRect(rx, ry + 2, 7, 3); } }
    this.button(ctx, 'evok', x + w - 84, y + h - 26, 72, 18, E.danger ? '迎战' : '继续', { primary: true, fn: () => { this.event = null; this.screen = E.toRefit || E.danger ? this.screen : 'map'; E.fn(); if (!E.toRefit && !E.danger) { this.screen = 'map'; G.state = 'route'; } } });
  },
  drawRefit(ctx, W, H) {
    const cap = G.captain, ps = G.player;
    // ---- the ship strip at the bottom: hull at a glance, then repair / keel / plating as picture cards
    const items = Object.entries(UPGRADES).filter(([, u]) => u.ship), cw = 64, ch = 46, gap = 4, sw = 150, tw = sw + items.length * (cw + gap) + 8;
    const x0 = Math.round(W / 2 - tw / 2), y0 = H - ch - 8;
    this.panel(ctx, x0, y0, sw, ch, 'dark');
    const hf = ps.hull / ps.hullMax, shx = x0 + 8, shy = y0 + 9;
    ctx.drawImage(SPR.n_ship, 0, 0, SPR.n_ship.width, SPR.n_ship.height, shx, shy, SPR.n_ship.width * 2, SPR.n_ship.height * 2);
    text(ctx, '船体', x0 + 42, y0 + 5, { size: 10, color: C.b3, bold: true });
    this.bar(ctx, x0 + 42, y0 + 20, sw - 50, 6, hf, hf < 0.3 ? C.r3 : C.w5);
    digits(ctx, `${Math.round(ps.hull)}/${ps.hullMax}`, x0 + 42, y0 + 30, C.b3);
    if (ps.breaches.length) { blit(ctx, SPR.i_leak, x0 + sw - 30, y0 + 28); digits(ctx, `x${ps.breaches.length}`, x0 + sw - 20, y0 + 31, C.r4); }
    let tip = null;
    items.forEach(([k, u], i) => {
      const cnt = G.ups[k] || 0, full = (cnt >= G.upMax(k) && u.max < 10) || (k === 'repair' && ps.hull >= ps.hullMax && !ps.breaches.length);
      const x = x0 + sw + gap + i * (cw + gap), id = 'up_' + k;
      if (this.iconCard(ctx, id, x, y0, cw, ch, u, cnt, full, () => this.buy(k), { price: G.upCost(k), max: G.upMax(k) })) tip = [u, x + cw / 2];
    });
    if (tip) this.tip(ctx, tip[0].name, tip[0].desc, tip[1], y0 - 4);
    this.button(ctx, 'sail', W - 104, Math.round(H * 0.45) - 18, 96, 36, '起 航 ›', { primary: true, size: 18, fn: () => { Sfx.play('horn', 0, 0.6); this.selSlot = -1; G.openRoute(); } });
    // ---- the captain and Bon: two portrait buttons on the left
    const openCap = () => { this.screen = 'cap'; this.capTab = this.capTab || 'weapon'; this.selSlot = -1; Sfx.play('ui', 0, 1); };
    const open = () => { this.screen = 'bon'; this.bonTab = this.bonTab || 'feed'; this.selSlot = -1; Sfx.play('squawk', 0, 0.7); Bon.emo('heart', 1.2); };
    const cy0 = Math.round(H * 0.45) - 40, by = cy0 + 42;
    this.button(ctx, 'capbtn', 8, cy0, 96, 36, '', { fn: openCap });
    ctx.drawImage(SPR.head_captain, 0, 0, 13, 12, 13, cy0 + 6, 26, 24);
    { const hs = armourSprites(captainGear()).helm; if (hs) ctx.drawImage(hs, 0, 0, hs.width, hs.height, 13, cy0 + 6, hs.width * 2, hs.height * 2); }
    text(ctx, '船长', 44, cy0 + 5, { size: 13, color: C.b4, bold: true });
    text(ctx, '装备 · 补给', 44, cy0 + 20, { size: 9, color: C.f5, bold: true, fit: 56 });
    this.button(ctx, 'bonbtn', 8, by, 96, 36, '', { fn: open });
    const pic = bonCompose(Bon.pose === 'preen' ? 'preen' : 'sit', 0, Bon.look(), G.t); ctx.drawImage(pic, 5, 3, 26, 27, 11, by + 5, 26, 27);
    text(ctx, 'Bon', 44, by + 5, { size: 13, color: C.b4, bold: true });
    text(ctx, Bon.hungry() ? '饿了' : `Lv ${Bon.d.lv}`, 44, by + 20, { size: 9, color: Bon.hungry() ? C.r4 : C.f5, bold: true });
    if (Bon.state === 'perch') {
      const px = Cam.bx(Bon.x), py = Cam.by(Bon.y);
      this.rects.push({ id: 'bon_perch', x: px - 8, y: py - 17, w: 16, h: 19, fn: open });
      const hy = py - 24 - (Math.floor(G.t * 3) % 2); blit(ctx, SPR.heart, px - 2, hy);
      if (this.hover === 'bon_perch') text(ctx, '点击照顾 Bon', px, hy - 12, { size: 9, align: 'center', color: C.f6, outline: true });
    }
    if (this.selSlot >= 0) this.drawSlotPop(ctx, W, H);
  },
  /* a picture card: icon, level pips, price. Returns true while hovered (for the tooltip). */
  iconCard(ctx, id, x, y, w, h, u, cnt, full, fn, opts = {}) {
    const price = opts.parts ? u.parts : opts.price ?? G.price(u.cost), poor = opts.parts ? G.parts < price : G.silver < price, dis = full || poor, hov = this.hover === id, oy = y - (hov && !dis ? 2 : 0);
    this.panel(ctx, x, oy, w, h, 'wood');
    const ic = SPR[u.icon], sc = 2, iw = ic.width * sc, ih = ic.height * sc;
    P.rect(ctx, x + 4, oy + 4, w - 8, 24, C.ink); P.rect(ctx, x + 5, oy + 5, w - 10, 22, full ? C.w2 : C.b1); P.rect(ctx, x + 5, oy + 5, w - 10, 1, C.b3);
    ctx.drawImage(ic, 0, 0, ic.width, ic.height, Math.round(x + w / 2 - iw / 2), Math.round(oy + 16 - ih / 2), iw, ih);
    const mx = opts.max ?? u.max;
    if (mx && mx < 10) for (let p = 0; p < mx; p++) { const px = x + w / 2 - (mx * 6) / 2 + p * 6; P.rect(ctx, px, oy + 30, 5, 4, C.ink); P.rect(ctx, px + 1, oy + 31, 3, 2, p < cnt ? C.f5 : C.b0); }
    if (full) text(ctx, '已满', x + w / 2, oy + h - 12, { size: 8, align: 'center', color: C.b0, shadow: false });
    else { const s = String(price), sw = s.length * 4 + 9; blit(ctx, opts.parts ? SPR.gear : SPR.coin, x + w / 2 - sw / 2 - 1, oy + h - 11); digits(ctx, s, x + w / 2 - sw / 2 + 8, oy + h - 10, poor ? C.r3 : opts.parts ? C.m4 : C.gold); }
    this.rects.push({ id, x, y, w, h, disabled: dis, fn });
    return hov;
  },
  /* a small dark tooltip centred above a point */
  tip(ctx, name, desc, cx, by) {
    const mc = TXT.for(ctx); mc.font = `700 10px ${FONT}`; const w1 = mc.measureText(tr(name)).width; mc.font = `600 9px ${FONT}`; const w2 = mc.measureText(tr(desc)).width;
    const w = Math.round(Math.max(w1, w2) + 14), h = 30, x = Math.round(clamp(cx - w / 2, 4, Cam.BW - w - 4)), y = by - h;
    this.panel(ctx, x, y, w, h, 'dark'); text(ctx, name, x + w / 2, y + 4, { size: 10, align: 'center', color: C.f5, bold: true }); text(ctx, desc, x + w / 2, y + 17, { size: 9, align: 'center', color: C.b3 });
  },
  /* a boss dropped a weapon: rays, the weapon flying out of the boss, a burst, and its name */
  drawLoot(ctx, W, H) {
    const L = this.loot; if (!L) return;
    const u = UPGRADES[L.k], t = L.t, cx = W / 2, cy = Math.round(H * 0.42), ease = (k) => 1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2);
    const dim = Math.min(0.75, t * 1.6); P.rect(ctx, 0, 0, W, H, `rgba(4,6,12,${dim})`); TXT.dim(ctx, dim);
    // turning god-rays
    if (t > 0.4) {
      const a0 = t * 0.35, R = Math.max(W, H) * 0.75, fade = Math.min(1, (t - 0.4) * 2);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 14; i++) { const a = a0 + (i / 14) * TAU, w = 0.09; ctx.fillStyle = i % 2 ? `rgba(255,220,120,${0.16 * fade})` : `rgba(255,255,240,${0.08 * fade})`; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a - w) * R, cy + Math.sin(a - w) * R); ctx.lineTo(cx + Math.cos(a + w) * R, cy + Math.sin(a + w) * R); ctx.closePath(); ctx.fill(); }
      const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, 70); g.addColorStop(0, `rgba(255,230,150,${0.55 * fade})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(cx - 70, cy - 70, 140, 140);
      ctx.restore();
    }
    // the weapon flies out of the boss, spinning, and lands with a bounce
    const k = clamp((t - 0.25) / 0.7, 0, 1), e = ease(k), px = lerp(L.sx, cx, e), py = lerp(L.sy, cy, e) + (k >= 1 ? Math.sin(t * 2.2) * 3 : 0), sc = Math.round(lerp(2, 6, Math.min(1, k * 1.3))), rot = (1 - k) * TAU * 2;
    const ic = inkOutline(SPR[u.icon], SPR[u.icon].width, SPR[u.icon].height, k >= 1 && Math.floor(t * 8) % 2 ? C.gold : C.ink);
    ctx.save(); ctx.translate(Math.round(px), Math.round(py)); ctx.rotate(rot); ctx.imageSmoothingEnabled = false; ctx.drawImage(ic, -ic.width * sc / 2, -ic.height * sc / 2, ic.width * sc, ic.height * sc); ctx.restore();
    if (k < 1 && Math.random() < 0.9) L.parts.push({ x: px, y: py, vx: rand(-20, 20), vy: rand(-20, 20), life: 0.5, c: 'f5' });
    // arrival: flash, ring, sparks, fanfare
    if (k >= 1 && !L.burst) {
      L.burst = true; L.bt = t; Cam.shake(0.25); Sfx.play('levelup', 0, 1); Sfx.play('crit', 0, 1); Sfx.play('chargeFull', 0, 1);
      for (let i = 0; i < 60; i++) { const a = rand(0, TAU), s = rand(40, 220); L.parts.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.6, 1.3), c: pick(['gold', 'f5', 'f6', 'white']) }); }
    }
    if (L.burst) {
      const bt = t - L.bt;
      if (bt < 0.25) P.rect(ctx, 0, 0, W, H, `rgba(255,248,220,${0.6 * (1 - bt / 0.25)})`);
      if (bt < 0.8) { const r = Math.round(bt * 240); P.ring(ctx, cx, cy, r, C[bt < 0.4 ? 'white' : 'gold']); P.ring(ctx, cx, cy, Math.max(1, r - 6), C.f4); }
      if (Math.random() < 0.5) { const a = rand(0, TAU), r = rand(20, 46); L.parts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, vx: 0, vy: -10, life: 0.5, c: 'white', tw: true }); }
    }
    for (const p of L.parts) { p.life -= 1 / 60; p.x += p.vx / 60; p.y += p.vy / 60; p.vx *= 0.97; p.vy = p.vy * 0.97 + 1; if (p.life > 0) { if (p.tw) { P.dot(ctx, p.x, p.y, C.white); P.dot(ctx, p.x - 1, p.y, C.f5); P.dot(ctx, p.x + 1, p.y, C.f5); } else P.rect(ctx, Math.round(p.x), Math.round(p.y), p.life > 0.6 ? 2 : 1, p.life > 0.6 ? 2 : 1, C[p.c]); } }
    L.parts = L.parts.filter((p) => p.life > 0);
    // the words
    if (t > 1.05) {
      const f = Math.min(1, (t - 1.05) * 3), up = Math.round((1 - f) * 10);
      text(ctx, '获得新武器！', cx, cy - 64 + up, { size: 12, align: 'center', color: C.f5, bold: true, outline: true });
      text(ctx, u.name, cx, cy + 40 + up, { size: 24, align: 'center', color: C.gold, bold: true, outline: true, shadow: C.w0 });
      text(ctx, u.style, cx, cy + 70 + up, { size: 10, align: 'center', color: C.b3, outline: true });
      text(ctx, '永久解锁：以后每一局都能用 · 按 Q 或在船长面板切换', cx, cy + 86 + up, { size: 9, align: 'center', color: C.b2, outline: true, fit: W - 20 });
    }
    if (t > 1.6) { if (Math.floor(t * 2.5) % 2) text(ctx, '点击继续', cx, H - 22, { size: 10, align: 'center', color: C.b1, outline: true }); this.rects.push({ id: 'lootok', x: 0, y: 0, w: W, h: H, fn: () => L.done() }); }
  },
  /* the captain's weapons: six picture cards in two rows (equip, upgrade, the tier the weapon has reached), then the crit and charge mods */
  drawWeapons(ctx, rx, rw, cy) {
    const cw = Math.floor((rw - 8) / 3), ch = 50;
    let tip = null;
    WEAPONS.forEach((k, i) => {
      const u = UPGRADES[k], own = G.wpn.own[k], cur = G.wpn.cur === k, cx = rx + (i % 3) * (cw + 4), ry = cy + Math.floor(i / 3) * (ch + 18), id = 'wp_' + k, hov = this.hover === id, lv = G.ups[k] || 0, mx = G.upMax(k), tier = wTier(k);
      const oy = ry - (hov && own && !cur ? 2 : 0);
      this.panel(ctx, cx, oy, cw, ch, cur ? 'dark' : 'wood');
      if (cur) { P.rect(ctx, cx + 1, oy + 1, cw - 2, 1, C.f5); P.rect(ctx, cx + 1, oy + ch - 2, cw - 2, 1, C.f5); }
      const ic = SPR[u.icon + (tier ? '_t' + tier : '')] || SPR[u.icon]; P.rect(ctx, cx + 4, oy + 4, cw - 8, 22, C.ink); P.rect(ctx, cx + 5, oy + 5, cw - 10, 20, own ? C[['b1', 'm2', 'f2', 'n2'][tier]] : C.w2); P.rect(ctx, cx + 5, oy + 5, cw - 10, 1, C.b3);
      ctx.drawImage(ic, 0, 0, ic.width, ic.height, Math.round(cx + cw / 2 - ic.width), Math.round(oy + 15 - ic.height), ic.width * 2, ic.height * 2);
      if (tier) text(ctx, TIER_NAME[tier], cx + cw - 7, oy + 5, { size: 8, align: 'right', color: C[['b4', 'm4', 'gold', 'g2'][tier]], bold: true, shadow: false });
      if (own) for (let p = 0; p < mx; p++) { const px = Math.round(cx + cw / 2 - (mx * 5) / 2 + p * 5); P.rect(ctx, px, oy + 27, 4, 3, C.ink); P.rect(ctx, px + 1, oy + 28, 2, 1, p < lv ? C[p >= 5 ? 'g2' : p >= 3 ? 'gold' : 'f5'] : C.b0); }
      text(ctx, u.name, cx + cw / 2, oy + 31, { size: 9, align: 'center', color: cur ? C.f5 : C.b4, bold: true, fit: cw - 6 });
      if (!own) { ctx.globalAlpha = 0.6; P.rect(ctx, cx + 5, oy + 5, cw - 10, 20, C.w1); ctx.globalAlpha = 1; blit(ctx, SPR.sk_lock, cx + cw / 2 - 4, oy + 10); text(ctx, u.drop, cx + cw / 2, oy + ch - 11, { size: 8, align: 'center', color: C.f4, bold: true, shadow: false, fit: cw - 6 }); }
      else text(ctx, cur ? '使用中' : '点击装备', cx + cw / 2, oy + ch - 11, { size: 8, align: 'center', color: cur ? C.green : C.f4, bold: true, shadow: false });
      this.rects.push({ id, x: cx, y: ry, w: cw, h: ch, disabled: !own || cur, fn: () => { G.wpn.cur = k; Sfx.play('build', 0, 0.7); } });
      const upc = G.upCost(k), maxed = lv >= mx;
      this.button(ctx, 'wu_' + k, cx, ry + ch + 2, cw, 13, !own ? '未拥有' : maxed ? '已满' : `升级 ${upc}`, { size: 8, disabled: !own || maxed || G.silver < upc, fn: () => this.buy(k) });
      if (hov) tip = [u.name, u.style, cx + cw / 2, ry - 2];
      if (this.hover === 'wu_' + k && own && !maxed) tip = [u.name, u.desc + (lv + 1 === 2 || lv + 1 === 4 || lv + 1 === 6 ? ` · 外观升为${TIER_NAME[wTier(k, lv + 1)]}` : ''), cx + cw / 2, ry - 2];
    });
    const mw = Math.floor((rw - 4) / 2), my = cy + 2 * (ch + 18) + 2, mh = 28;
    ['whet', 'rune'].forEach((k, i) => {
      const u = UPGRADES[k], cnt = G.ups[k] || 0, mx = G.upMax(k), full = cnt >= mx, price = G.upCost(k), poor = G.silver < price, dis = full || poor, mxp = rx + i * (mw + 4), id = 'up_' + k, hov = this.hover === id && !dis, oy = my - (hov ? 2 : 0);
      this.panel(ctx, mxp, oy, mw, mh, 'wood');
      const ic = SPR[u.icon]; P.rect(ctx, mxp + 3, oy + 3, 22, 22, C.ink); P.rect(ctx, mxp + 4, oy + 4, 20, 20, C.b1); ctx.drawImage(ic, 0, 0, ic.width, ic.height, mxp + 14 - ic.width, oy + 14 - ic.height, ic.width * 2, ic.height * 2);
      text(ctx, u.name, mxp + 29, oy + 3, { size: 9, color: hov ? C.f5 : C.b4, bold: true, fit: mw - 64 });
      text(ctx, u.desc, mxp + 29, oy + 15, { size: 8, color: C.b1, shadow: false, fit: mw - 64 });
      for (let p = 0; p < mx; p++) { const px = mxp + mw - 6 - (mx - p) * 5; P.rect(ctx, px, oy + 4, 4, 3, C.ink); P.rect(ctx, px + 1, oy + 5, 2, 1, p < cnt ? C.f5 : C.b0); }
      if (full) text(ctx, '已满', mxp + mw - 5, oy + mh - 12, { size: 8, align: 'right', color: C.b0, shadow: false });
      else { const s = String(price); blit(ctx, SPR.coin, mxp + mw - 12 - s.length * 4, oy + mh - 10); digits(ctx, s, mxp + mw - 4 - s.length * 4, oy + mh - 9, poor ? C.r3 : C.gold); }
      this.rects.push({ id, x: mxp, y: my, w: mw, h: mh, disabled: dis, fn: () => this.buy(k) });
    });
    if (tip) this.tip(ctx, tip[0], tip[1], tip[2], tip[3]);
  },
  /* where a voyage may begin: every chapter reached so far */
  drawChapters(ctx, W, H) {
    const reach = Save.reach(), b = Save.best(), fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    const w = Math.min(300, W - 16), rh = 30, h = 40 + 5 * (rh + 4) + 26, x = Math.round(W / 2 - w / 2), y = Math.round(clamp(H / 2 - h / 2, 4, H));
    P.rect(ctx, 0, 0, W, H, 'rgba(4,6,12,0.6)'); TXT.dim(ctx, 0.6);
    this.panel(ctx, x, y, w, h, 'wood');
    text(ctx, '选择章节', x + 12, y + 8, { size: 14, color: C.f5, bold: true });
    text(ctx, '从后面的章节开始会给一笔起步资金', x + w - 10, y + 12, { size: 8, align: 'right', color: C.b1, shadow: false, fit: w - 100 });
    for (let n = 1; n <= 5; n++) {
      const c = CHAPTERS[n], open = n <= reach, ry = y + 32 + (n - 1) * (rh + 4), id = 'chs_' + n, hov = this.hover === id && open;
      this.panel(ctx, x + 8, ry - (hov ? 1 : 0), w - 16, rh, open ? (hov ? 'deep' : 'dark') : 'wood');
      const ic = SPR[NODE_TYPES[c.node].icon]; blit(ctx, ic, x + 16, ry + 9);
      text(ctx, `第 ${n} 章 · ${c.name}`, x + 34, ry + 4, { size: 11, color: open ? c.col : C.b0, bold: true, fit: w - 110 });
      text(ctx, open ? (n > 1 ? `起步 ${c.starter[0]} 银 · ${c.starter[1]} 零件` : '从头开始的完整航程') : '通关上一章解锁', x + 34, ry + 17, { size: 8, color: open ? C.b2 : C.b0, shadow: false, fit: w - 110 });
      if (!open) blit(ctx, SPR.sk_lock, x + w - 24, ry + 10);
      else if (b['c' + n] != null && n === 1) text(ctx, fmt(b.c1), x + w - 14, ry + 10, { size: 9, align: 'right', color: C.f4, shadow: false });
      this.rects.push({ id, x: x + 8, y: ry, w: w - 16, h: rh, disabled: !open, fn: () => { Sfx.play('ui'); if (n === 1) { this.screen = null; this.start(); } else Save.startAt(n); } });
    }
    this.button(ctx, 'chsback', x + w - 76, y + h - 22, 68, 16, '返回', { size: 10, fn: () => { this.screen = 'title'; } });
  },
  /* width of a label in buffer pixels, in the current language */
  tw(ctx, s, size = 9, bold = false) { const m = TXT.for(ctx); m.font = `${bold ? 700 : 600} ${size}px ${FONT}`; return m.measureText(tr(s)).width; },
  /* silver and parts, shown inside the menus */
  drawPurse(ctx, x, y) {
    P.rect(ctx, x, y, 78, 14, C.ink); P.rect(ctx, x + 1, y + 1, 76, 12, C.n1);
    blit(ctx, SPR.coin, x + 4, y + 4); digits(ctx, Math.max(0, G.silver - Math.ceil(G.silverPending || 0)), x + 13, y + 5, C.gold);
    blit(ctx, SPR.gear, x + 42, y + 3); digits(ctx, G.parts, x + 51, y + 5, C.m4);
  },
  /* the captain's page: portrait and numbers on the left; weapon, armour and supplies on the right */
  drawCap(ctx, W, H) {
    const cap = G.captain, t = G.t;
    P.rect(ctx, 0, 0, W, H, 'rgba(4,6,12,0.55)'); TXT.dim(ctx, 0.55);
    const w = Math.min(430, W - 12), h = Math.min(232, H - 8), x = Math.round(W / 2 - w / 2), y = Math.round(H / 2 - h / 2);
    this.panel(ctx, x, y, w, h, 'wood');
    const lx = x + 8, lw = 122, bh = 92;
    this.panel(ctx, lx, y + 8, lw, bh, 'dark');
    const deckY = y + 8 + 80; P.rect(ctx, lx + 3, deckY, lw - 6, 4, C.w3); P.rect(ctx, lx + 3, deckY, lw - 6, 1, C.w5); for (let i = lx + 10; i < lx + lw - 4; i += 14) P.rect(ctx, i, deckY + 1, 1, 3, C.w2);
    const hv = { up_helm: 'helm', up_fur: 'fur', up_rope: 'boots' }[this.hover], hk = { helm: 'helm', fur: 'fur', boots: 'rope' }[hv];
    const preview = hv && (G.ups[hk] || 0) < G.upMax(hk) ? { [hv]: (G.ups[hk] || 0) + 1 } : null;
    const pose = { gear: captainGear(preview), wSpr: wSprite(cap.weapon, null), run: 0, moving: false, air: false, vy: 0, crouch: 0, weaponA: REST_A - HALF_PI + Math.sin(t * 1.5) * 0.05, hurt: false, swim: false, down: false, rope: false, charge: 0, tell: 0, blocking: false, nock: 0, spin: 0, leanPx: 0, step: 0, breath: Math.floor(t * 1.2) % 2 };
    const img = inkOutline(composePuppet('captain', pose), 72, 72);
    ctx.save(); ctx.beginPath(); ctx.rect(lx + 2, y + 10, lw - 4, bh - 4); ctx.clip();
    ctx.drawImage(img, 14, 20, 48, 42, lx + lw / 2 - 48, deckY - 82, 96, 84); ctx.restore();
    let ty = y + bh + 12;
    text(ctx, '船长', lx, ty, { size: 14, color: C.b4, bold: true }); ty += 18;
    const hl = Math.ceil(this.tw(ctx, '生命', 8)) + 4; text(ctx, '生命', lx, ty - 2, { size: 8, color: C.b1, shadow: false }); this.bar(ctx, lx + hl, ty, lw - hl, 4, cap.hp / cap.max, C.r3); ty += 7;
    digits(ctx, `${Math.round(cap.hp)}/${cap.max}`, lx + hl, ty, C.b3); ty += 11;
    const stats = [['伤害', `x${(cap.dmgMul * cap.wMul()).toFixed(1)}`], ['暴击', `${Math.round((0.12 + (cap.critBonus || 0)) * 100)}%`], ['受伤', `${Math.round((cap.armor || 1) * 100)}%`], ['跳跃', `x${(cap.jumpMul || 1).toFixed(2)}`]];
    stats.forEach(([k, v], i) => { const sx = lx + (i % 2) * 62, sy = ty + Math.floor(i / 2) * 12; text(ctx, k, sx, sy, { size: 8, color: C.b1, shadow: false }); text(ctx, v, sx + Math.max(22, Math.ceil(this.tw(ctx, k, 8)) + 4), sy, { size: 8, color: C.f5, bold: true, shadow: false }); });
    this.drawPurse(ctx, lx, y + h - 22);
    // right: tabs of picture cards
    const rx = lx + lw + 10, rw = x + w - 8 - rx, tabs = [['weapon', '武器'], ['armor', '护具'], ['food', '补给']], tw = Math.floor((rw - 8) / 3);
    tabs.forEach(([k, nm], i) => this.button(ctx, 'ct_' + k, rx + i * (tw + 4), y + 8, tw, 18, nm, { primary: this.capTab === k, size: 11, fn: () => { this.capTab = k; } }));
    const list = this.capTab === 'weapon' ? [] : Object.entries(UPGRADES).filter(([, u]) => u.tab === this.capTab), cw = Math.floor((rw - 8) / 3), ch = 96, cy = y + 32;
    let tipU = null;
    if (this.capTab === 'weapon') this.drawWeapons(ctx, rx, rw, cy);
    list.forEach(([k, u], i) => {
      const cnt = G.ups[k] || 0, full = (cnt >= G.upMax(k) && u.max < 10) || ((k === 'mead' || k === 'fish') && cap.hp >= cap.max), cx = rx + i * (cw + 4), id = 'up_' + k;
      const hov = this.iconCard(ctx, id, cx, cy, cw, ch, u, cnt, full, () => this.buy(k), { price: G.upCost(k), max: G.upMax(k) });
      text(ctx, u.name, cx + cw / 2, cy + 40 - (hov && !full ? 2 : 0), { size: 10, align: 'center', color: hov ? C.f5 : C.b4, bold: true, fit: cw - 6 });
      wrapText(ctx, u.desc, cw - 8, 8).slice(0, 2).forEach((l, j) => text(ctx, l, cx + cw / 2, cy + 55 + j * 10 - (hov && !full ? 2 : 0), { size: 8, align: 'center', color: C.b1, shadow: false }));
      if (hov) tipU = u;
    });
    const note = { weapon: '', armor: '护具让船长更耐打、跳得更高。', food: '补给马上回复生命，可以反复买。' }[this.capTab];
    text(ctx, note, rx, cy + ch + 8, { size: 9, color: C.b2, shadow: false, fit: rw });
    this.button(ctx, 'capclose', x + w - 76, y + h - 24, 68, 18, '返回', { primary: true, fn: () => { this.screen = 'refit'; } });
  },
  /* Bon's page: portrait and growth on the left; feed, gear and wardrobe tabs on the right */
  drawBon(ctx, W, H) {
    const d = Bon.d, st = Bon.stats(), t = G.t;
    P.rect(ctx, 0, 0, W, H, 'rgba(4,6,12,0.55)'); TXT.dim(ctx, 0.55);
    const w = Math.min(430, W - 12), h = Math.min(232, H - 8), x = Math.round(W / 2 - w / 2), y = Math.round(H / 2 - h / 2);
    this.panel(ctx, x, y, w, h, 'wood');
    // ---- left: portrait on a bit of yard
    const lx = x + 8, lw = 122, bh = 92;
    this.panel(ctx, lx, y + 8, lw, bh, 'dark');
    const yardY = y + 8 + 70;
    P.rect(ctx, lx + 16, y + 10, 5, bh - 4, C.w2); P.rect(ctx, lx + 17, y + 10, 2, bh - 4, C.w4);
    P.rect(ctx, lx + 4, yardY, lw - 8, 4, C.ink); P.rect(ctx, lx + 4, yardY, lw - 8, 3, C.w3); P.rect(ctx, lx + 4, yardY, lw - 8, 1, C.w5);
    const pv = this.bonPreview || {}, pose = (t % 6) > 4.6 ? (Math.floor(t * 5) % 3 ? 'preen' : 'preen2') : (t % 3.3) < 0.13 ? 'blink' : 'sit';
    const pic = bonCompose(pose, 0, Bon.look(pv), t), fx = lx + Math.round(lw / 2) + 8, hop = (this.bonHappy || 0) > 0 ? Math.round(Math.abs(Math.sin(t * 14)) * 5 * this.bonHappy) : 0;
    this.bonHappy = Math.max(0, (this.bonHappy || 0) - 1 / 60 * 1.2);
    ctx.save(); ctx.beginPath(); ctx.rect(lx + 2, y + 10, lw - 4, bh - 4); ctx.clip();
    ctx.drawImage(pic, 0, 0, 36, 32, fx - 54, yardY - 63 - hop, 108, 96); ctx.restore();
    if (Bon.say) { const s = tr(Bon.say.s), mc = TXT.for(ctx); mc.font = `600 9px ${FONT}`; const sw = Math.round(mc.measureText(s).width) + 10, sx = lx + lw - sw - 4, sy = y + 14;
      P.rect(ctx, sx, sy, sw, 14, C.ink); P.rect(ctx, sx + 1, sy + 1, sw - 2, 12, C.b4); P.rect(ctx, sx + 4, sy + 13, 3, 2, C.ink); P.dot(ctx, sx + 5, sy + 13, C.b4);
      text(ctx, Bon.say.s, sx + sw / 2, sy + 2, { size: 9, align: 'center', color: C.w1, shadow: false }); }
    // name, level, xp, belly, stats, perks
    let ty = y + bh + 12;
    text(ctx, 'Bon', lx, ty, { size: 14, color: C.b4, bold: true }); text(ctx, `Lv ${d.lv}`, lx + lw, ty + 2, { size: 11, align: 'right', color: C.f5, bold: true });
    ty += 18;
    this.bar(ctx, lx, ty, lw, 4, d.lv >= 10 ? 1 : d.xp / Bon.need(), C.f5);
    text(ctx, d.lv >= 10 ? '经验 已满级' : `经验 ${Math.floor(d.xp)}/${Bon.need()}`, lx, ty + 6, { size: 8, color: C.b1, shadow: false });
    ty += 18;
    const bl = Math.ceil(this.tw(ctx, '饱食', 8)) + 4; text(ctx, '饱食', lx, ty - 2, { size: 8, color: C.b1, shadow: false }); this.bar(ctx, lx + bl, ty, lw - bl, 4, Bon.full / 100, Bon.hungry() ? C.r3 : C.f3);
    ty += 9;
    text(ctx, Bon.hungry() ? '饿了：出手变慢、伤害降低' : `啄击 ${Math.round(st.dmg)} · 间隔 ${st.cd.toFixed(1)} 秒`, lx, ty, { size: 8, color: Bon.hungry() ? C.r4 : C.b2, shadow: false, fit: lw });
    ty += 13;
    this.drawPurse(ctx, lx, y + h - 22);
    // ---- right: tabs
    const rx = lx + lw + 10, rw = x + w - 8 - rx, tabs = [['feed', '喂食'], ['gear', '装备'], ['wear', '衣橱'], ['skill', '技能']], tw = Math.floor((rw - 12) / 4);
    tabs.forEach(([k, nm], i) => this.button(ctx, 'bt_' + k, rx + i * (tw + 4), y + 8, tw, 18, nm, { primary: this.bonTab === k, size: 11, fn: () => { this.bonTab = k; } }));
    const cy = y + 32, gap = 4;
    this.bonPreview = null;
    if (this.bonTab === 'feed' || !this.bonTab) {
      const ks = Object.keys(BON_FOOD), cw = Math.floor((rw - gap * 2) / 3), ch = 88;
      ks.forEach((k, i) => {
        const f = BON_FOOD[k], price = G.price(f.cost), stuffed = Bon.full >= 100, dis = G.silver < price || stuffed, id = 'bf_' + k, cx = rx + i * (cw + gap), hov = this.hover === id && !dis;
        this.panel(ctx, cx, cy - (hov ? 2 : 0), cw, ch, 'wood'); const oy = cy - (hov ? 2 : 0);
        ctx.drawImage(SPR[f.icon], 0, 0, 10, 9, cx + cw / 2 - 10, oy + 6, 20, 18);
        text(ctx, f.name, cx + cw / 2, oy + 28, { size: 10, align: 'center', color: dis ? C.b0 : hov ? C.f5 : C.b4, bold: true, fit: cw - 6 });
        text(ctx, `经验 +${f.xp}`, cx + cw / 2, oy + 43, { size: 8, align: 'center', color: C.f5, shadow: false });
        text(ctx, f.full >= 100 ? '饱食 回满' : `饱食 +${f.full}`, cx + cw / 2, oy + 54, { size: 8, align: 'center', color: C.b1, shadow: false });
        if (stuffed) text(ctx, '吃饱了', cx + cw / 2, oy + ch - 14, { size: 9, align: 'center', color: C.b0 }); else { const s = String(price), sw = s.length * 4 + 8; blit(ctx, SPR.coin, cx + cw / 2 - sw / 2 - 1, oy + ch - 13); digits(ctx, s, cx + cw / 2 - sw / 2 + 7, oy + ch - 12, dis ? C.w4 : C.gold); }
        this.rects.push({ id, x: cx, y: cy, w: cw, h: ch, disabled: dis, fn: () => { Bon.feed(k); this.bonHappy = 1; } });
      });
      const lines = wrapText(ctx, '每打一仗 Bon 都会饿一点，饿了出手变慢。吃饱时不肯再吃，所以每仗之后喂一次最划算。', rw, 9);
      lines.forEach((l, i) => text(ctx, l, rx, cy + ch + 8 + i * 12, { size: 9, color: C.b2, shadow: false }));
    } else if (this.bonTab === 'gear') {
      const ks = Object.keys(BON_GEAR), cw = Math.floor((rw - gap * 2) / 3), ch = 104;
      ks.forEach((k, i) => {
        const gdef = BON_GEAR[k], lv = d.gear[k] || 0, max = gdef.parts.length, full = lv >= max, cost = full ? 0 : gdef.parts[lv], dis = full || G.parts < cost, id = 'bg_' + k, cx = rx + i * (cw + gap), hov = this.hover === id && !dis, oy = cy - (hov ? 2 : 0);
        this.panel(ctx, cx, oy, cw, ch, 'wood');
        ctx.drawImage(SPR[gdef.icon], 0, 0, 10, 8, cx + cw / 2 - 10, oy + 6, 20, 16);
        text(ctx, gdef.name, cx + cw / 2, oy + 26, { size: 10, align: 'center', color: hov ? C.f5 : C.b4, bold: true, fit: cw - 6 });
        for (let p = 0; p < max; p++) { const px = cx + cw / 2 - (max * 7) / 2 + p * 7; P.rect(ctx, px, oy + 41, 5, 5, C.ink); P.rect(ctx, px + 1, oy + 42, 3, 3, p < lv ? C.f5 : C.b0); }
        wrapText(ctx, gdef.desc, cw - 8, 8).slice(0, 3).forEach((l, j) => text(ctx, l, cx + cw / 2, oy + 51 + j * 10, { size: 8, align: 'center', color: C.b1, shadow: false }));
        if (full) text(ctx, '已满', cx + cw / 2, oy + ch - 14, { size: 9, align: 'center', color: C.b0 });
        else { const s = String(cost), sw = s.length * 4 + 9; blit(ctx, SPR.gear, cx + cw / 2 - sw / 2 - 1, oy + ch - 14); digits(ctx, s, cx + cw / 2 - sw / 2 + 8, oy + ch - 12, dis ? C.w4 : C.m4); }
        this.rects.push({ id, x: cx, y: cy, w: cw, h: ch, disabled: dis, fn: () => { G.parts -= cost; d.gear[k] = lv + 1; Bon.save(); Sfx.play('build', 0, 1); Bon.say = { s: '闪亮亮！', t: 1.3 }; this.bonHappy = 1; } });
      });
      text(ctx, '装备用零件打造，永久保留。', rx, cy + ch + 8, { size: 9, color: C.b2, shadow: false });
    } else if (this.bonTab === 'skill') {
      const cols = 3, cw = Math.floor((rw - gap * (cols - 1)) / cols), ch = 44; let tipS = null;
      BON_PERKS.forEach(([lv, nm, ds, ic], i) => {
        const cx = rx + (i % cols) * (cw + gap), cy2 = cy + Math.floor(i / cols) * (ch + 4), ok = d.lv >= lv, id = 'bs_' + lv, hov = this.hover === id;
        this.panel(ctx, cx, cy2, cw, ch, ok ? 'dark' : 'wood');
        if (ok) { P.rect(ctx, cx + 1, cy2 + 1, cw - 2, 1, C.f5); }
        const I = SPR[ic]; P.rect(ctx, cx + 4, cy2 + 5, 22, 20, C.ink); P.rect(ctx, cx + 5, cy2 + 6, 20, 18, ok ? C.n3 : C.w2);
        ctx.drawImage(I, 0, 0, I.width, I.height, cx + 6, cy2 + 7, I.width * 2, I.height * 2);
        if (!ok) { ctx.globalAlpha = 0.55; P.rect(ctx, cx + 5, cy2 + 6, 20, 18, C.w1); ctx.globalAlpha = 1; blit(ctx, SPR.sk_lock, cx + 11, cy2 + 11); }
        text(ctx, nm, cx + 30, cy2 + 6, { size: 10, color: ok ? C.f5 : C.b0, bold: true, fit: cw - 34 });
        text(ctx, `Lv ${lv}`, cx + 30, cy2 + 21, { size: 8, color: ok ? C.green : C.b0, shadow: false });
        if (lv === 8 || lv === 10) text(ctx, '魔法', cx + cw - 4, cy2 + 21, { size: 8, align: 'right', color: C.g2, bold: true, shadow: false });
        else if ([2, 4, 6, 9].includes(lv)) text(ctx, '合作', cx + cw - 4, cy2 + 21, { size: 8, align: 'right', color: C.f4, bold: true, shadow: false });
        this.rects.push({ id, x: cx, y: cy2, w: cw, h: ch, fn: () => {} }); if (hov) tipS = [nm, ds, cx + cw / 2, i < cols ? cy2 + ch + 36 : cy2];
      });
      if (tipS) this.tip(ctx, tipS[0], tipS[1], tipS[2], tipS[3] - 2);
    } else {
      const cw = Math.floor((rw - gap * 5) / 6), ch = 50;
      const row = (label, kind, defs, yy) => {
        text(ctx, label, rx, yy, { size: 9, color: C.b2, bold: true, shadow: false });
        const items = [[null, { name: kind === 'hat' ? '不戴' : '不穿', cost: 0 }], ...Object.entries(defs)], cur = kind === 'hat' ? d.hat : d.fit, owned = kind === 'hat' ? d.hats : d.fits;
        items.forEach(([k, def], i) => {
          const has = !k || owned.includes(k), wearing = cur === k, dis = !has && G.silver < def.cost, id = `bw_${kind}_${k || 'none'}`, cx = rx + i * (cw + gap), top = yy + 12, hov = this.hover === id;
          if (hov) this.bonPreview = { [kind]: k };
          this.panel(ctx, cx, top - (hov ? 2 : 0), cw, ch, wearing ? 'dark' : 'wood'); const oy = top - (hov ? 2 : 0);
          if (wearing) { P.rect(ctx, cx + 1, oy + 1, cw - 2, 1, C.f5); P.rect(ctx, cx + 1, oy + ch - 2, cw - 2, 1, C.f5); }
          const ic = k ? SPR[(kind === 'hat' ? 'hat_' : 'fit_') + k] : SPR.i_none, sc = ic.width > 7 ? 2 : 3;
          P.rect(ctx, cx + 4, oy + 4, cw - 8, 20, C.ink); P.rect(ctx, cx + 5, oy + 5, cw - 10, 18, C.b1); P.rect(ctx, cx + 5, oy + 5, cw - 10, 1, C.b3);
          ctx.drawImage(ic, cx + Math.round(cw / 2 - ic.width * sc / 2), oy + Math.round(14 - ic.height * sc / 2) + 2, ic.width * sc, ic.height * sc);
          text(ctx, def.name, cx + cw / 2, oy + 26, { size: 8, align: 'center', color: dis ? C.b0 : C.b4, bold: true, fit: cw - 4 });
          if (wearing) text(ctx, '穿着', cx + cw / 2, oy + ch - 13, { size: 8, align: 'center', color: C.green, shadow: false });
          else if (has) text(ctx, k ? '拥有' : '', cx + cw / 2, oy + ch - 13, { size: 8, align: 'center', color: C.b1, shadow: false });
          else { const s = String(def.cost), sw = s.length * 4 + 8; blit(ctx, SPR.coin, cx + cw / 2 - sw / 2 - 1, oy + ch - 12); digits(ctx, s, cx + cw / 2 - sw / 2 + 7, oy + ch - 11, dis ? C.w4 : C.gold); }
          this.rects.push({ id, x: cx, y: top, w: cw, h: ch, disabled: dis, fn: () => {
            if (!has) { G.silver -= def.cost; owned.push(k); Sfx.play('coin', 0, 0.8); }
            if (kind === 'hat') d.hat = wearing && k ? null : k; else d.fit = wearing && k ? null : k;
            Bon.save(); Sfx.play('squawk', 0, 0.6); Bon.say = { s: k && !wearing ? pick(['好看吗？', '嘎～', '帅不帅？']) : '嘎。', t: 1.3 }; this.bonHappy = 0.8;
          } });
        });
      };
      row('帽子', 'hat', BON_HATS, cy);
      row('衣服', 'fit', BON_FITS, cy + 70);
      text(ctx, '奢侈品：永久拥有，跨局保留。钱多的时候来这里花。鼠标放上去可以先试穿。', rx, cy + 140, { size: 9, color: C.b2, shadow: false, fit: rw });
    }
    this.button(ctx, 'bonclose', x + w - 76, y + h - 24, 68, 18, '返回', { primary: true, fn: () => { this.screen = 'refit'; this.bonPreview = null; } });
  },
  /* a row of icons above the chosen deck slot; costs under them; the hovered one names itself */
  drawSlotPop(ctx, W, H) {
    const sl = G.player.slots[this.selSlot], m = sl.mod, items = [];
    if (!m) {
      const ic = { ballista: 'i_ballista', wall: 'i_wall', brazier: 'i_brazier' };
      for (const [k, d] of Object.entries(MODULES)) items.push({ icon: ic[k], name: d.name, desc: d.desc, silver: G.price(d.cost), fn: () => { G.silver -= G.price(d.cost); sl.mod = G.makeModule(k, sl.lx); Sfx.play('build', 0, 1); const p = G.player.toWorld(sl.lx, -30); FX.splinters(p.x, p.y, 10, 0, 'b2'); this.selSlot = -1; } });
    } else {
      if (m.type === 'ballista') for (const [k, up] of Object.entries(BALLISTA_UPS)) {
        const owned = !!(m.ups || {})[k];
        items.push({ icon: 'i_' + k, name: up.name, desc: up.desc, parts: owned ? 0 : up.parts, owned, fn: owned ? null : () => { G.parts -= up.parts; m.ups = { ...(m.ups || {}), [k]: true }; m.hp = m.max = m.max + 10; Sfx.play('build', 0, 1); const p = G.player.toWorld(m.lx, -40); FX.sparks(p.x, p.y, 12); } });
      }
      if (m.type === 'brazier' && !m.lit) items.push({ icon: 'flame0', name: '点燃', desc: '让火盆重新亮起来', silver: 0, fn: () => { m.lit = true; Sfx.play('fire', 0, 1); } });
      if (m.hp < m.max) items.push({ icon: 'i_repair', name: '修理', desc: `耐久 ${Math.round(m.hp)}/${m.max}`, silver: G.price(10), fn: () => { G.silver -= G.price(10); m.hp = m.max; Sfx.play('build', 0, 1); } });
      const refund = Math.floor(MODULES[m.type].cost / 2);
      items.push({ icon: 'i_sell', name: '拆掉', desc: `收回 ${refund} 银`, refund, fn: () => { G.silver += refund; sl.mod = null; this.selSlot = -1; Sfx.play('wood', 0, 1); } });
    }
    const cell = 20, bw = items.length * cell + 6, bh = 32;
    const p = G.player.toWorld(sl.lx, G.player.deckY(sl.lx) - 62), ax = Cam.bx(p.x), ay = Cam.by(p.y);
    const x = Math.round(clamp(ax - bw / 2, 4, W - bw - 4)), y = Math.round(clamp(ay - bh, 4, H - bh - 70));
    this.panel(ctx, x, y, bw, bh, 'dark');
    let hovered = null;
    items.forEach((it, i) => {
      const cx = x + 3 + i * cell, cy = y + 3, id = 'slot_' + i, afford = it.owned || ((it.silver || 0) <= G.silver && (it.parts || 0) <= G.parts);
      const hov = this.hover === id;
      if (hov) hovered = it;
      P.rect(ctx, cx, cy, cell - 2, 16, C[it.owned ? 'n3' : hov && afford ? 'n5' : 'n2']);
      const img = SPR[it.icon]; if (img) { if (!afford && !it.owned) ctx.globalAlpha = 0.4; blit(ctx, img, cx + (cell - 2 - img.width) / 2, cy + (16 - img.height) / 2); ctx.globalAlpha = 1; }
      if (it.owned) blit(ctx, SPR.i_check, cx + cell - 10, cy + 9);
      // cost under the icon
      const cy2 = cy + 18;
      if (it.parts) { blit(ctx, SPR.gear, cx, cy2); digits(ctx, it.parts, cx + 9, cy2 + 1, afford ? C.m4 : C.r3, 1, null); }
      else if (it.silver) { blit(ctx, SPR.coin, cx, cy2); digits(ctx, it.silver, cx + 8, cy2 + 1, afford ? C.gold : C.r3, 1, null); }
      else if (it.refund) digits(ctx, '+' + it.refund, cx + 1, cy2 + 1, C.green, 1, null);
      this.rects.push({ id, x: cx, y: cy, w: cell - 2, h: 28, disabled: it.owned || !afford, fn: () => { if (it.fn) it.fn(); } });
    });
    // name and one line of explanation for the hovered icon
    const tip = hovered || null;
    if (tip) { ctx.font = `600 10px ${FONT}`; const line = `${tip.name} · ${tip.desc}`, tw = ctx.measureText(tr(line)).width + 10, tx = Math.round(clamp(x + bw / 2 - tw / 2, 4, W - tw - 4)); P.rect(ctx, tx, y - 16, tw, 14, C.ink); P.rect(ctx, tx + 1, y - 15, tw - 2, 12, C.n2); text(ctx, line, tx + 5, y - 15, { size: 10, color: C.b3, shadow: false }); }
    P.line(ctx, ax, y + bh, ax, Cam.by(G.player.toWorld(sl.lx, G.player.deckY(sl.lx) - 40).y), C.b1, 1);
  },
  buy(k) {
    const u = UPGRADES[k], n = G.ups[k] || 0, cap = G.captain, ps = G.player, cost = G.upCost(k);
    if (G.silver < cost || n >= G.upMax(k) || (u.weapon && !G.wpn.own[k])) return;
    G.silver -= cost; G.ups[k] = n + 1; Sfx.play('coin', 0, 1); Sfx.play('build', 0, 0.6);
    if (k === 'whet') cap.critBonus = (cap.critBonus || 0) + 0.06;
    if (k === 'rune') cap.chargeRate = 1 + 0.3 * G.ups.rune;
    if (k === 'helm') cap.armor = Math.max(0.4, Math.pow(0.85, G.ups.helm));
    if (k === 'fish') cap.hp = Math.min(cap.max, cap.hp + 35);
    if (k === 'rope') cap.jumpMul = 1 + 0.1 * G.ups.rope;
    if (k === 'fur') { cap.max += 40; cap.hp += 40; }
    if (k === 'mead') cap.hp = cap.max;
    if (k === 'repair') { ps.hull = Math.min(ps.hullMax, ps.hull + 80); ps.breaches = []; }
    if (k === 'keel') { ps.hullMax += 80; ps.hull += 80; }
    if (k === 'keel' || k === 'plate') ps.setLook({ keel: G.ups.keel || 0, plate: G.ups.plate || 0 });
    FX.text(cap.x, cap.y - 90, u.name, 'green', 20);
  },
  drawPause(ctx, W, H) {
    P.rect(ctx, 0, 0, W, H, 'rgba(4,6,12,0.55)'); TXT.dim(ctx, 0.55);
    const w = 180, h = 90, x = Math.round(W / 2 - w / 2), y = Math.round(H / 2 - h / 2);
    this.panel(ctx, x, y, w, h); text(ctx, '暂停', W / 2, y + 12, { size: 16, align: 'center', color: C.b4, bold: true });
    this.button(ctx, 'resume', x + 14, y + 48, 70, 18, '继续', { primary: true, fn: () => this.pause(false) });
    this.button(ctx, 'quit', x + w - 84, y + 48, 70, 18, '回到标题', { fn: () => { this.pause(false); G.newRun(true); this.screen = 'title'; } });
    this.button(ctx, 'pset', x + w / 2 - 35, y + 70, 70, 14, '设置', { size: 10, fn: () => { this.settingsBack = 'pause'; this.screen = 'settings'; } });
  },
  drawEnd(ctx, W, H) {
    P.rect(ctx, 0, 0, W, H, 'rgba(4,6,12,0.5)'); TXT.dim(ctx, 0.5);
    const w = Math.min(340, W - 20), h = 150, x = Math.round(W / 2 - w / 2), y = Math.round(H / 2 - h / 2), s = G.stats;
    this.panel(ctx, x, y, w, h, this.won ? 'deep' : 'wood');
    const CH = CHAPTERS[G.chapter];
    text(ctx, this.won ? CH.endTitle : '龙骨断了', W / 2, y + 12, { size: 22, align: 'center', color: this.won ? CH.col : C.r4, bold: true, outline: true });
    text(ctx, this.won ? CH.endText : `你撑到了第 ${G.chapter} 章第 ${G.step - (G.chapter - 1) * 6 + 1} 程。`, W / 2, y + 42, { size: 10, align: 'center', color: C.b2, fit: w - 16 });
    const items = [['击倒', s.kills], ['打下海', s.overboard], ['击沉敌船', s.ships], ['砍断触手', s.tentacles], ['用时', `${Math.floor(s.time / 60)}:${String(Math.floor(s.time % 60)).padStart(2, '0')}`]];
    if (this.record) text(ctx, '新纪录！', x + 8, y + h - 22, { size: 10, color: C.f5, bold: true, outline: true, fit: 56 });
    items.forEach(([k, v], i) => { const cx = x + (w / items.length) * (i + 0.5); text(ctx, k, cx, y + 64, { size: 9, align: 'center', color: C.b1 }); const str = String(v); digits(ctx, str, cx - (str.length * 8 - 2) / 2, y + 80, C.b4, 2); });
    if (this.won && G.chapter < 5) {
      const nx = G.chapter + 1;
      this.button(ctx, 'chapter2', W / 2 + 4, y + h - 28, 110, 18, `进入第 ${nx} 章 ›`, { primary: true, fn: () => { this.screen = null; G.startChapter(nx); } });
      this.button(ctx, 'again', W / 2 - 104, y + h - 28, 96, 18, '重新开始', { fn: () => { this.screen = null; G.newRun(false); } });
    } else this.button(ctx, 'again', W / 2 - 45, y + h - 28, 90, 18, '再来一次', { primary: true, fn: () => { this.screen = null; G.newRun(false); } });
  },
};
function shadeUp(col) { const i = Object.values(C).indexOf(col); const keys = Object.keys(C); const k = keys[i]; if (!k) return col; const m = k.match(/^([a-z]+)(\d)$/); if (!m) return col; const up = C[m[1] + (+m[2] + 1)]; return up || col; }
function runeLatin(r) { return [...(r || '')].map((c) => (GLYPH[c] ? c : { 'ᚠ': 'ᚨ', 'ᛃ': 'ᚾ', 'ᛟ': 'ᛖ', 'ᛞ': 'ᛖ', 'ᛏ': 'ᛚ', 'ᛊ': 'ᚲ', 'ᚢ': 'ᚱ', 'ᛗ': 'ᛖ', 'ᛁ': 'ᛚ', 'ᚹ': 'ᚱ', 'ᛒ': 'ᚱ', 'ᚷ': 'ᚲ' }[c] || 'ᛚ')).join(''); }

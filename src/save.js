'use strict';
/* Voyage saves: the run is written whenever the ship is safe (refit, the sea chart, or between chapters), so closing the page
   loses nothing. Clearing a chapter unlocks starting straight from the next one. Best clear times are kept too. */
const Save = {
  KEY: 'kk.run',
  get() { const s = store(this.KEY); return s && s.v === 1 ? s : null; },
  clear() { try { localStorage.removeItem(this.KEY); } catch (e) { /* storage may be blocked */ } },
  progress() { return store('kk.progress') || {}; },
  unlock(k) { const p = this.progress(); if (p[k]) return; p[k] = true; store('kk.progress', p); },
  best() { const b = store('kk.best') || {}, o = {}; for (let n = 1; n <= 5; n++) o['c' + n] = b['c' + n] ?? (n === 1 ? b.time : null) ?? null; return o; },
  /* the furthest chapter a voyage may start from */
  reach() { const p = this.progress(); if (p.won && !p.ch3) this.unlock('ch3'); let n = 1; while (n < 5 && p['ch' + (n + 1)]) n++; return n; },
  /* returns true when this is a new record */
  record(ch, time) { const b = this.best(), k = 'c' + ch, rec = b[k] == null || time < b[k]; if (rec) { b[k] = time; store('kk.best', b); } return rec; },
  write(where) {
    if (G.state === 'title' || !G.map || !G.player) return;
    const cap = G.captain, ps = G.player, m = G.map;
    store(this.KEY, {
      v: 1, where, fullRun: !!G.fullRun, chapter: G.chapter, step: G.step, silver: G.silver, parts: G.parts, ups: G.ups, wpn: G.wpn, discount: G.discount || 1, stats: G.stats, bonFull: Bon.full,
      cap: { hp: cap.hp, max: cap.max, dmgMul: cap.dmgMul, critBonus: cap.critBonus || 0, chargeRate: cap.chargeRate || 1, armor: cap.armor || 1, jumpMul: cap.jumpMul || 1 },
      ship: { hull: ps.hull, hullMax: ps.hullMax, slots: ps.slots.map((s) => (s.mod ? { type: s.mod.type, lv: s.mod.lv, hp: s.mod.hp, max: s.mod.max, ups: s.mod.ups || {}, lit: s.mod.lit } : null)) },
      map: { ch: m.ch, at: m.at, layers: m.layers }, time: Date.now(),
    });
    this.lastWrite = G.t;
  },
  load(s) {
    G.newRun(true);
    Object.assign(G, { chapter: s.chapter, step: s.step, silver: s.silver, parts: s.parts, ups: s.ups || {}, wpn: s.wpn || { cur: 'oar', own: { oar: true } }, discount: s.discount || 1, stats: s.stats || G.stats, fullRun: !!s.fullRun });
    { const pg = this.progress(); for (const k of WEAPONS) G.wpn.own[k] = !!G.wpn.own[k] || !!pg['w_' + k] || k === 'oar'; if (!G.wpn.own[G.wpn.cur]) G.wpn.cur = 'oar'; }
    Object.assign(G.captain, s.cap);
    const ps = G.player; ps.hull = s.ship.hull; ps.hullMax = s.ship.hullMax; ps.setLook({ keel: G.ups.keel || 0, plate: G.ups.plate || 0 });
    ps.slots.forEach((sl, i) => { const d = s.ship.slots[i]; sl.mod = d ? Object.assign(G.makeModule(d.type, sl.lx), d) : null; });
    G.map = { ch: s.map.ch, at: s.map.at, layers: s.map.layers, nodes: Object.fromEntries(s.map.layers.flat().map((n) => [n.id, n])) };
    Sky.setTheme(CHAPTERS[s.chapter].theme); G.makeFloes(); Bon.reset(); Bon.full = s.bonFull ?? 100;
    UI.screen = null; UI.paused = false; FX.timeScale = 1;
    if (/^ch\d$/.test(s.where)) G.startChapter(+s.where[2]);
    else if (s.where === 'map') G.openRoute();
    else G.openRefit(s.where === 'harbor');
  },
  /* a fresh voyage that begins at a later chapter, with a purse to kit the ship out first */
  startAt(n) {
    const c = CHAPTERS[n];
    this.clear(); G.newRun(true); G.chapter = n; G.step = (n - 1) * 6; G.map = SeaMap.generate(n); Sky.setTheme(c.theme); G.makeFloes(); Bon.reset();
    G.silver = c.starter[0]; G.parts = c.starter[1]; UI.screen = null; G.openRefit(false);
    G.banner(`第 ${n} 章 · ${c.name}`, `起步资金 ${c.starter[0]} 银、${c.starter[1]} 个零件：先整备，再起航`, c.col, 3.2);
  },
  /* in a refit or on the chart, write every couple of seconds so purchases are kept too */
  tick() { if ((G.state === 'refit' || G.state === 'route') && G.t - (this.lastWrite || 0) > 2) this.write(G.state === 'route' ? 'map' : G.refitHarbor ? 'harbor' : 'refit'); },
  /* "chapter 1 · leg 3" for the continue button */
  label(s) { const m = /^ch(\d)$/.exec(s.where); return m ? `第 ${m[1]} 章 · 第 1 程` : `第 ${s.chapter} 章 · 第 ${Math.max(1, s.step - (s.chapter - 1) * 6 + 1)} 程`; },
};

/* Dev-only: play whole voyages (chapter 1 then 2) with a sensible shopping policy and keep a ledger. Needs dev-harness + dev-fullrun. */
window.ECON = {
  shop(led) {
    const cap = G.captain, ps = G.player, spend = (what, cost) => { led.spent[what] = (led.spent[what] || 0) + cost; };
    const buy = (k) => { const u = UPGRADES[k], c = G.upCost(k); if (G.silver < c || (G.ups[k] || 0) >= G.upMax(k)) return false; UI.buy(k); spend(u.ship ? 'ship' : u.tab === 'food' ? 'heal' : 'captain', c); return true; };
    // 1. keep the boat afloat and the captain alive
    while (ps.hull < ps.hullMax * 0.7 && buy('repair'));
    if (cap.hp < cap.max * 0.5) buy(cap.max - cap.hp > 60 ? 'mead' : 'fish');
    // 2. build a ballista on an empty slot now and then
    const empty = ps.slots.findIndex((s) => !s.mod), mb = MODULES.ballista;
    if (empty >= 0 && G.silver >= G.price(mb.cost) + 40 && G.modules().filter((m) => m.type === 'ballista').length < 3) { G.silver -= G.price(mb.cost); ps.slots[empty].mod = G.makeModule('ballista', ps.slots[empty].lx); spend('modules', G.price(mb.cost)); }
    // a second weapon once the purse allows
    if (!G.wpn.own.cutlass && G.silver >= G.price(UPGRADES.cutlass.unlock) + 60) { G.silver -= G.price(UPGRADES.cutlass.unlock); G.wpn.own.cutlass = true; spend('weapons', G.price(UPGRADES.cutlass.unlock)); }
    // 3. upgrades, cheapest first
    for (let pass = 0; pass < 6; pass++) {
      const opts = Object.entries(UPGRADES).filter(([k, u]) => u.max < 10 && (!u.weapon || G.wpn.own[k]) && (G.ups[k] || 0) < G.upMax(k) && G.silver >= G.upCost(k)).sort((a, b) => G.upCost(a[0]) - G.upCost(b[0]));
      if (!opts.length) break; buy(opts[0][0]);
    }
    // 4. Bon: food when hungry or flush, gear with parts
    if (Bon.full < 100 && (Bon.hungry() || G.silver > 150)) { const f = G.silver > 200 ? 'cake' : G.silver > 90 ? 'mango' : 'seed', c = G.price(BON_FOOD[f].cost); if (G.silver >= c) { Bon.feed(f); spend('bonFood', c); } }
    for (const [k, gd] of Object.entries(BON_GEAR)) { const lv = Bon.d.gear[k] || 0; if (lv < gd.parts.length && G.parts >= gd.parts[lv]) { G.parts -= gd.parts[lv]; Bon.d.gear[k] = lv + 1; led.partsSpent += gd.parts[lv]; } }
    // ballista upgrades with the remaining parts
    for (const m of G.modules()) if (m.type === 'ballista') for (const [k, up] of Object.entries(BALLISTA_UPS)) if (!(m.ups || {})[k] && G.parts >= up.parts) { G.parts -= up.parts; m.ups = { ...(m.ups || {}), [k]: true }; led.partsSpent += up.parts; }
  },
  voyage() {
    localStorage.removeItem('kk.bon'); Bon.load();
    const led = { fights: [], spent: {}, partsSpent: 0, chapterEnd: [], src: {} };
    const ob = Coins.burst.bind(Coins); Coins.burst = (x, y, n, pw) => { const st = new Error().stack.split('\n')[2] || '', m = st.match(/at (?:Object\.|G\.)?([\w.]+)/), k = m ? m[1] : '?'; led.src[k] = (led.src[k] || 0) + Math.round(n); return ob(x, y, n, pw); }; this._ob = ob;
    UI.start(); H.opts = { god: true, charge: true }; H.n = 0;
    for (let ch = 1; ch <= 2; ch++) {
      if (ch === 2) G.startChapter(2);
      let guard = 0;
      while (guard++ < 12) {
        const s0 = G.silver, p0 = G.parts, key = G.enc && G.enc.key; let f = 0;
        const cap = G.captain, lim = G.enc && G.enc.boss ? 60 * 400 : 60 * 150;
        while (G.state === 'fight' && f < lim) {
          const b = G.boss, tp = b && b.targetPoint();
          if (f % 6 === 0) { if (b && tp && (b.exposed || b.scales.some((q) => q.hp > 0))) { Input.keys.delete('a'); Input.keys.delete('d'); const sc = Cam.toScreen(tp.x, tp.y); Input.mouse.sx = sc.x; Input.mouse.sy = sc.y; if (Math.abs(tp.x - cap.x) > 60) Input.keys.add(tp.x > cap.x ? 'd' : 'a'); else Input.mouse.lp = true; } else H.botStep(); } if (G.captain.water && f % 30 === 0) { Input.taps.add(' '); } FR.step(false); f++; if (G.player.hull < 40) G.player.hull = 120; }
        let k = 0; while (G.state === 'won' && k++ < 600) FR.step(false);
        const boss = G.enc && G.enc.boss;
        if (boss) { if (G.state === 'fight') { if (G.kraken && !G.kraken.dying) { G.kraken.hp = 0; G.kraken.checkPhase(G); } if (G.boss && !G.boss.dying) G.boss.chip(1e6, G); led.forced = (led.forced || 0) + 1; } let w = 0; while (G.state !== 'victory' && w++ < 60 * 10) FR.step(false); if (G.state !== 'victory') { G.state = 'victory'; } }
        led.fights.push({ ch, key, secs: Math.round(f / 60), earned: G.silver - s0, parts: G.parts - p0, state: G.state });
        if (boss || G.state === 'lost' || G.state === 'fight') break;
        if (G.state !== 'refit') break;
        this.shop(led);
        UI.rects = []; FR.step(true); UI.rects.find((r) => r.id === 'sail')?.fn(); FR.step(true);
        let m = 0;
        while (G.state !== 'fight' && m++ < 40) {
          if (UI.screen === 'map') { FR.step(true); const nodes = UI.rects.filter((r) => r.id && r.id.startsWith('node_') && !r.disabled); const pick1 = nodes.map((r) => G.map.nodes[r.id.slice(5)]).sort((a, b) => ((b.reward && b.reward.silver) || 0) - ((a.reward && a.reward.silver) || 0))[0]; UI.rects.find((r) => r.id === 'node_' + pick1.id).fn(); let w = 0; while (UI.travel && w++ < 120) FR.step(false); }
          else if (UI.screen === 'event') { const s1 = G.silver; FR.step(true); UI.rects.find((r) => r.id === 'evok')?.fn(); FR.step(true); led.fights.push({ ch, key: 'event', earned: G.silver - s1 }); }
          else if (G.state === 'refit') { this.shop(led); FR.step(true); UI.rects.find((r) => r.id === 'sail')?.fn(); FR.step(true); }
          else FR.step(true);
        }
      }
      led.chapterEnd.push({ ch, silver: G.silver, parts: G.parts, state: G.state, bonLv: Bon.d.lv, ups: JSON.stringify(G.ups) });
      if (G.state !== 'victory') break;
    }
    led.totalEarned = led.fights.reduce((a, f) => a + Math.max(0, f.earned), 0); Coins.burst = this._ob;
    return led;
  },
};

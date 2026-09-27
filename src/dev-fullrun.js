/* Dev-only: play whole runs with the bot and check invariants every frame. Load after dev-harness.js. */
window.FR = {
  issues: [],
  note(kind, msg) { if (this.issues.length < 200 && !this.issues.some((i) => i.kind === kind && i.msg === msg)) this.issues.push({ kind, msg, state: G.state, enc: G.enc && G.enc.key, t: +G.encT.toFixed(1) }); },
  check() {
    const c = G.captain, b = Bon;
    const bad = (v) => typeof v !== 'number' || !isFinite(v);
    if (bad(c.x) || bad(c.y)) this.note('nan', 'captain position');
    if (bad(b.x) || bad(b.y)) this.note('nan', 'Bon position');
    if (bad(G.silver) || G.silver < 0) this.note('money', 'silver ' + G.silver);
    if (bad(G.parts) || G.parts < 0) this.note('money', 'parts ' + G.parts);
    if (G.silverPending < -0.01) this.note('money', 'pending ' + G.silverPending);
    if (Math.abs(b.x - c.x) > 4000) this.note('bon', 'Bon far away ' + Math.round(b.x - c.x) + ' ' + b.state);
    if (FX.parts.length > 4000) this.note('leak', 'particles ' + FX.parts.length);
    if (FX.texts.length > 200) this.note('leak', 'texts ' + FX.texts.length);
    if (G.shots.length > 300) this.note('leak', 'shots ' + G.shots.length);
    if (G.enemies.length > 80) this.note('leak', 'enemies list ' + G.enemies.length);
    if (Coins.list.length > 200) this.note('leak', 'coins ' + Coins.list.length);
    if (UI.coins.length > 300) this.note('leak', 'ui coins ' + UI.coins.length);
    for (const e of G.enemies) if (!e.dead && (bad(e.x) || bad(e.y))) this.note('nan', 'enemy ' + e.type);
    for (const s of G.ships) if (bad(s.x) || bad(s.y) || bad(s.a)) this.note('nan', 'ship ' + s.kind);
    if (FX.timeScale <= 0 || FX.timeScale > 1) this.note('time', 'timeScale ' + FX.timeScale);
  },
  step(render) {
    const dt = (1 / 60) * FX.timeScale;
    if (FX.hitstop > 0) { FX.hitstop -= 1 / 60; FX.update && 0; }
    else { G.t += 1 / 60; Cam.update(1 / 60); G.update(dt); }
    if (render) G.render(1 / 60);
    UI.update(1 / 60); Input.endFrame(); this.check();
  },
  /* one whole voyage: returns a log of nodes and how each ended */
  run(opts = {}) {
    const log = []; let guard = 0;
    UI.start(); H.opts = { god: opts.god !== false, charge: true }; H.n = 0;
    while (guard++ < 40) {
      // fight until it ends
      let f = 0; const t0 = performance.now();
      while (G.state === 'fight' && f < 60 * 150) { if (f % 6 === 0) H.botStep(); this.step(f % 5 === 0); f++; if (opts.hull && G.player.hull < 60) G.player.hull = 200; }
      const secs = Math.round(f / 60);
      if (G.state === 'fight') { this.note('stuck', `fight ${G.enc.key} did not end in 150s: ` + H.report()); log.push(`${G.enc.key}:STUCK`); break; }
      log.push(`${G.enc ? G.enc.key : G.node && G.node.type}:${G.state}/${secs}s/${Math.round(performance.now() - t0)}ms`);
      if (G.state === 'lost' || G.state === 'victory') break;
      if (G.enc && G.enc.boss && G.kraken && G.kraken.dying) { let k = 0; while (G.state !== 'victory' && k++ < 60 * 8) this.step(false); break; }
      // won -> refit
      let k = 0; while (G.state !== 'refit' && k++ < 600) this.step(false);
      if (G.state !== 'refit') { this.note('flow', 'no refit after win, state ' + G.state + ' screen ' + UI.screen); break; }
      // spend a little: buy a random upgrade, feed Bon
      this.step(true);
      const ups = UI.rects.filter((r) => r.id && r.id.startsWith('up_') && !r.disabled); if (ups.length) pick(ups).fn();
      if (G.silver > 30) { UI.rects.find((r) => r.id === 'bonbtn')?.fn(); UI.bonTab = 'feed'; this.step(true); UI.rects.find((r) => r.id === 'bf_seed' && !r.disabled)?.fn(); UI.screen = 'refit'; }
      this.step(true); UI.rects.find((r) => r.id === 'sail')?.fn(); this.step(true);
      // map: pick a node, handle events
      let m = 0;
      while (G.state !== 'fight' && m++ < 50) {
        if (UI.screen === 'map') { this.step(true); const opts2 = UI.rects.filter((r) => r.id && r.id.startsWith('node_') && !r.disabled); if (!opts2.length) { this.note('flow', 'map has no available node at ' + G.map.at); break; } pick(opts2).fn(); let w = 0; while (UI.travel && w++ < 120) this.step(false); log.push('> ' + G.node.type + (G.node.enc ? ':' + G.node.enc : '')); }
        else if (UI.screen === 'event') { this.step(true); const ok = UI.rects.find((r) => r.id === 'evok'); if (!ok) { this.note('flow', 'event without button'); break; } ok.fn(); this.step(true); }
        else if (UI.screen === 'refit' || G.state === 'refit') { this.step(true); UI.rects.find((r) => r.id === 'sail')?.fn(); this.step(true); }
        else { this.step(true); }
      }
      if (G.state !== 'fight') { this.note('flow', 'could not get to a fight: state ' + G.state + ' screen ' + UI.screen); break; }
    }
    return log;
  },
};

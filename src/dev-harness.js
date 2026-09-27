/* Dev-only play-test helpers (not part of the build). Load with: await import('/dev-harness.js?'+Date.now()) */
window.H = {
  start(key) { UI.screen = null; G.newRun(false); UI.screen = null; G.startEncounter(key); UI.banner_ = null; },
  wait(ms) { return new Promise((r) => setTimeout(r, ms)); },
  /* a simple brawler bot: walks to the nearest enemy on its deck and attacks; charges now and then; hooks enemies on ropes */
  bot(opts = {}) { clearInterval(this._b); this.opts = opts; this.n = 0; this._b = setInterval(() => this.botStep(), 110); },
  botStep() {
    const opts = this.opts || {}; const n = ++this.n; {
      const c = G.captain;
      if (opts.god) { c.iframes = Math.max(c.iframes, 0.2); c.hp = c.max; }
      Input.keys.delete('a'); Input.keys.delete('d');
      if (c.water) { Input.keys.add('w'); return; } else Input.keys.delete('w');
      const es = G.enemies.filter((e) => !e.dead && !e.water && (e.ship === c.ship || e.swingPath));
      const tn = G.tentacles.find((t) => t.hittable());
      let tx = null, ty = null;
      if (tn && tn.pts.length) { const p = tn.pts[(tn.pts.length * 0.7) | 0]; tx = p.x; ty = p.y; }
      if (es.length) { const e = es.sort((a, b) => Math.abs(a.x - c.x) - Math.abs(b.x - c.x))[0]; tx = e.cx; ty = e.cy; }
      if (G.kraken && G.kraken.eye > 0.6 && !es.length) { const p = G.kraken.eyePos; tx = p.x; ty = p.y; if (n % 20 === 0) Input.mouse.rp = true; }
      if (!es.length && c.ship && c.ship !== G.player && G.enemies.some((e) => !e.dead && e.ship === G.player)) { c.land(G.player, 0); return; }
      if (tx === null) return;
      const s = Cam.toScreen(tx, ty); Input.mouse.sx = s.x; Input.mouse.sy = s.y;
      if (Math.abs(tx - c.x) > 95 && !(G.kraken && tx === G.kraken.eyePos.x)) Input.keys.add(tx > c.x ? 'd' : 'a');
      else if (opts.charge && n % 30 < 9) { Input.mouse.l = true; if (n % 30 === 8) { Input.mouse.l = false; Input.mouse.lr = true; } }
      else Input.mouse.lp = true;
    }
  },
  /* fast-forward the simulation: n updates per 10 ms tick, no rendering */
  turbo(n = 6) { clearInterval(this._b); clearInterval(this._t); let k = 0; this._t = setInterval(() => { for (let i = 0; i < n; i++) { if (this.opts && ++k % 6 === 0) this.botStep(); const dt = (1 / 60) * FX.timeScale; if (FX.hitstop > 0) { FX.hitstop -= 1 / 60; continue; } G.t += 1 / 60; Cam.update(1 / 60); G.update(dt); UI.update(1 / 60); Input.endFrame(); } }, 10); },
  unturbo() { clearInterval(this._t); },
  stop() { clearInterval(this._b); Input.keys.clear(); },
  report() {
    return JSON.stringify({ state: G.state, t: +G.encT.toFixed(1), stats: G.stats, cap: Math.round(G.captain.hp), hull: Math.round(G.player.hull), breaches: G.player.breaches.length, silver: G.silver,
      enemies: G.enemies.filter((e) => !e.dead).map((e) => e.type + ':' + (e.ship === G.player ? 'ours' : e.ship ? 'theirs' : e.water ? 'water' : 'air')),
      ships: G.ships.filter((s) => s.team === 'enemy').map((s) => `${s.kind} hull ${Math.round(s.hull)} mast ${s.mast ? Math.round(s.mast.hp) : '-'}`), tentacles: G.tentacles.length, kraken: G.kraken ? Math.round(G.kraken.hp) : null });
  },
  mag(x, y, w, h) {
    let c = document.getElementById('mag');
    if (!c) { c = document.createElement('canvas'); c.id = 'mag'; c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:99;background:#000;image-rendering:pixelated'; document.body.appendChild(c); }
    c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(G.cv, Math.round(x), Math.round(y), w, h, 0, 0, w, h); c.style.display = 'block';
  },
  unmag() { const c = document.getElementById('mag'); if (c) c.style.display = 'none'; },
};

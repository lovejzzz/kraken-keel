'use strict';
/* A thrown grappling rope. The hook flies on a ballistic arc and pays rope out behind it; the rope is a Verlet chain that
   sags when slack, pulls straight when taut, drapes over decks and floats on the sea. States:
   idle -> fly -> (attached | yank | haul | slack) -> retract -> idle */
const ROPE_G = 1400, ROPE_SEG = 14, HOOK_SPEED = 1450;
sprite('grapple', ['..m..', 'm.m.m', '.mMm.', '..M..', '..M..', '..w..'], { m: 'm3', M: 'm4', w: 'w4' });

class Rope {
  constructor(owner) { this.owner = owner; this.state = 'idle'; this.pts = []; this.len = 0; this.hook = null; this.t = 0; this.target = null; }
  hand() { const o = this.owner; return { x: o.x + o.face * 6, y: o.y - 46 * o.scale }; }
  busy() { return this.state !== 'idle'; }
  /* choose what the throw is aimed at: hook points, crates, enemies, tentacles, the kraken's eye */
  static candidates(G, owner) {
    const out = [], own = !owner.water && (owner.ship || owner.lastGround);
    for (const s of G.ships) { if (s.sunk || (s === own)) continue; for (const h of s.hookPoints()) { const p = s.toWorld(h.lx, h.ly); out.push({ kind: 'point', x: p.x, y: p.y }); } }
    if (owner.water) { const s = G.player; for (const h of s.hookPoints()) { const p = s.toWorld(h.lx, h.ly); out.push({ kind: 'point', x: p.x, y: p.y, anchor: shipAnchor(s, h.lx, h.ly) }); } }
    for (const c of G.crates) if (!c.taken) out.push({ kind: 'crate', x: c.x, y: c.y - 6, crate: c });
    for (const e of G.enemies) if (!e.dead && !e.water) out.push({ kind: 'enemy', x: e.cx, y: e.cy, enemy: e });
    for (const t of G.tentacles) if (t.hittable() && t.pts.length) { const i = (t.pts.length * 0.75) | 0, p = t.pts[i]; out.push({ kind: 'tentacle', x: p.x, y: p.y, tentacle: t, i }); }
    if (G.kraken && G.kraken.eye > 0.6 && !G.kraken.dying) { const e = G.kraken.eyePos; out.push({ kind: 'eye', x: e.x, y: e.y }); }
    return out;
  }
  aimTarget(G, mx, my, range) {
    const h = this.hand(); let best = null, bd = 80;
    for (const c of Rope.candidates(G, this.owner)) {
      const dm = Math.hypot(c.x - mx, c.y - my), dh = Math.hypot(c.x - h.x, c.y - h.y);
      if (dh > range || dm > bd) continue; bd = dm; best = c;
    }
    return best;
  }
  /* launch velocity that lands on (tx, ty); the flatter of the two ballistic solutions */
  solve(hx, hy, tx, ty, v) {
    const dx = tx - hx, dy = hy - ty, g = ROPE_G, adx = Math.abs(dx) || 1, v2 = v * v, disc = v2 * v2 - g * (g * adx * adx + 2 * dy * v2);
    if (disc < 0) { const a = Math.atan2(ty - hy, dx); return { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 250 }; }
    const th = Math.atan((v2 - Math.sqrt(disc)) / (g * adx));
    return { vx: Math.sign(dx || 1) * Math.cos(th) * v, vy: -Math.sin(th) * v };
  }
  throw(G, mx, my, range) {
    const h = this.hand(), tgt = this.aimTarget(G, mx, my, range);
    let v;
    if (tgt) v = this.solve(h.x, h.y, tgt.x, tgt.y, HOOK_SPEED);
    else { const a = Math.atan2(my - h.y, mx - h.x); v = { vx: Math.cos(a) * HOOK_SPEED, vy: Math.sin(a) * HOOK_SPEED - 120 }; }
    this.hook = { x: h.x, y: h.y, vx: v.vx + (this.owner.vx || 0) * 0.3, vy: v.vy, ang: 0 };
    this.state = 'fly'; this.t = 0; this.range = range; this.len = 0; this.caught = null;
    this.pts = [{ x: h.x, y: h.y, ox: h.x, oy: h.y }, { x: h.x, y: h.y, ox: h.x, oy: h.y }];
    Sfx.play('rope', this.owner.pan());
  }
  throwAt(G, tx, ty, range) {
    const h = this.hand(), v = this.solve(h.x, h.y, tx, ty, HOOK_SPEED * 0.85);
    this.hook = { x: h.x, y: h.y, vx: v.vx, vy: v.vy, ang: 0 }; this.state = 'fly'; this.t = 0; this.range = range; this.len = 0; this.caught = null;
    this.pts = [{ x: h.x, y: h.y, ox: h.x, oy: h.y }, { x: h.x, y: h.y, ox: h.x, oy: h.y }];
  }
  release() { if (this.state === 'attached' || this.state === 'haul' || this.state === 'yank') { this.state = 'retract'; this.t = 0; Sfx.play('rope', this.owner.pan(), 0.5); } }
  /* keep the particle count matched to the rope length; new links appear at the hand */
  fit() {
    const n = clamp(Math.ceil(this.len / ROPE_SEG) + 1, 2, 64);
    const h = this.pts[0];
    while (this.pts.length < n) this.pts.splice(1, 0, { x: h.x, y: h.y, ox: h.x, oy: h.y });
    while (this.pts.length > n && this.pts.length > 2) this.pts.splice(1, 1);
  }
  endPos() {
    const c = this.caught; if (!c) return null;
    if (c.kind === 'point' || c.kind === 'tentacle') { const a = c.anchor.anchor(); return a; }
    if (c.kind === 'enemy') return { x: c.enemy.cx, y: c.enemy.cy };
    if (c.kind === 'crate') return { x: c.crate.x, y: c.crate.y - 6 };
    if (c.kind === 'eye') return G.kraken ? G.kraken.eyePos : null;
    return null;
  }
  update(dt, G) {
    if (this.state === 'idle') return;
    this.t += dt; const h = this.hand(), o = this.owner;
    this.pts[0].x = h.x; this.pts[0].y = h.y; this.pts[0].ox = h.x; this.pts[0].oy = h.y;
    const last = () => this.pts[this.pts.length - 1];
    if (this.state === 'fly') {
      const k = this.hook, steps = 3;
      for (let s = 0; s < steps && this.state === 'fly'; s++) {
        k.vy += ROPE_G * dt / steps; k.x += k.vx * dt / steps; k.y += k.vy * dt / steps; k.ang = Math.atan2(k.vy, k.vx);
        this.catchTest(G);
      }
      if (this.state === 'fly') {
        this.len = Math.max(this.len, Math.hypot(k.x - h.x, k.y - h.y) * 1.04);
        if (this.len > this.range) { this.state = 'slack'; this.t = 0; this.hook.vx *= 0.3; }
        else if (k.y > Sea.height(k.x) + 4) { this.state = 'slack'; this.t = 0; FX.splash(k.x, 0.25); }
        else for (const s of G.ships) { const lo = s.toLocal(k.x, k.y); if (Math.abs(lo.x) < s.walk && lo.y > s.deckY(lo.x) && lo.y < s.deckY(lo.x) + 24 && k.vy > 0) { this.state = 'slack'; this.t = 0; Sfx.play('wood', o.pan(), 0.3); break; } }
      }
    } else if (this.state === 'attached') {
      const a = this.endPos(); if (!a || !o.onRope) { this.state = 'retract'; this.t = 0; }
      else this.len = o.onRope.len + 8;
    } else if (this.state === 'yank') {
      if (this.t > 0.2) { this.state = 'retract'; this.t = 0; }
    } else if (this.state === 'haul') {
      const c = this.caught.crate; const dx = h.x - c.x, dy = h.y - c.y, d = Math.hypot(dx, dy);
      c.x += (dx / d) * Math.min(d, 760 * dt); c.y += (dy / d) * Math.min(d, 760 * dt); c.held = true;
      this.len = Math.max(20, d);
      if (d < 26) { G.collectCrate(c); this.state = 'retract'; this.t = 0; }
    } else if (this.state === 'slack') {
      if (this.t > 0.25) { this.state = 'retract'; this.t = 0; }
    }
    if (this.state === 'retract') { this.len -= 1500 * dt; if (this.len <= 16) { this.state = 'idle'; this.pts = []; this.caught = null; return; } }
    this.fit();
    // verlet step for the free links
    const end = last(), pinnedEnd = this.state === 'fly' || this.state === 'attached' || this.state === 'yank' || this.state === 'haul';
    const ep = pinnedEnd ? (this.state === 'fly' ? this.hook : this.endPos()) : null;
    for (let i = 1; i < this.pts.length; i++) {
      const p = this.pts[i]; if (i === this.pts.length - 1 && ep) continue;
      const vx = (p.x - p.ox) * 0.985, vy = (p.y - p.oy) * 0.985; p.ox = p.x; p.oy = p.y; p.x += vx; p.y += vy + ROPE_G * dt * dt;
    }
    if (ep) { end.x = end.ox = ep.x; end.y = end.oy = ep.y; }
    const rest = this.len / (this.pts.length - 1);
    for (let it = 0; it < 12; it++) {
      for (let i = 0; i < this.pts.length - 1; i++) {
        const a = this.pts[i], b = this.pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1e-4;
        if (d <= rest && this.state !== 'retract') continue; // a rope only pulls, it never pushes
        const diff = (d - rest) / d, aFixed = i === 0, bFixed = i + 1 === this.pts.length - 1 && !!ep;
        if (aFixed && bFixed) continue;
        const wa = aFixed ? 0 : bFixed ? 1 : 0.5, wb = bFixed ? 0 : aFixed ? 1 : 0.5;
        a.x += dx * diff * wa; a.y += dy * diff * wa; b.x -= dx * diff * wb; b.y -= dy * diff * wb;
      }
      // drape on decks, float on the sea
      for (let i = 1; i < this.pts.length; i++) {
        const p = this.pts[i]; if (i === this.pts.length - 1 && ep) continue;
        const sh = Sea.height(p.x) + 2; if (p.y > sh) { p.y = sh; p.oy = lerp(p.oy, p.y, 0.5); }
        if (it % 4 === 0) for (const s of G.ships) { const lo = s.toLocal(p.x, p.y); if (Math.abs(lo.x) < s.walk && lo.y > s.deckY(lo.x) - 1 && lo.y < s.deckY(lo.x) + 22) { const q = s.toWorld(lo.x, s.deckY(lo.x) - 1); p.x = q.x; p.y = q.y; p.ox = lerp(p.ox, p.x, 0.6); } }
      }
    }
    if (!ep && this.hook) { const e = last(), pr = this.pts[this.pts.length - 2] || e; this.hook.x = e.x; this.hook.y = e.y; this.hook.ang = Math.atan2(e.y - pr.y, e.x - pr.x); }
  }
  catchTest(G) {
    const k = this.hook, o = this.owner, own = !o.water && (o.ship || o.lastGround);
    if (o.team !== 'player') { // an enemy hook only cares about the captain
      const cap = G.captain; if (cap.down <= 0 && Math.hypot(cap.cx - k.x, cap.cy - k.y) < 22) { this.caught = { kind: 'enemy', enemy: cap }; this.state = 'yank'; this.t = 0; o.onHookCaptain && o.onHookCaptain(cap, G); }
      return;
    }
    for (const e of G.enemies) {
      if (e.dead || e.water || Math.hypot(e.cx - k.x, e.cy - k.y) > 26) continue;
      this.caught = { kind: 'enemy', enemy: e }; this.state = 'yank'; this.t = 0; this.len = Math.hypot(e.cx - o.x, e.cy - o.y);
      const dir = Math.sign(o.x - e.x) || 1, heavy = (e.stats && e.stats.heavy) || 1;
      e.knock((dir * 760) / heavy, -520 / Math.sqrt(heavy), 0.8); e.hurt(4, 0, 0, { stun: 0.8 }); e.blocking = false;
      Sfx.play('hook', e.pan()); FX.stop(0.06); FX.hitSpark(k.x, k.y, dir > 0 ? 0 : Math.PI, false); FX.text(e.x, e.y - 90, '拽！', '#ffd8a0', 22, 0.7);
      return;
    }
    for (const c of G.crates) if (!c.taken && Math.hypot(c.x - k.x, c.y - 6 - k.y) < 26) { this.caught = { kind: 'crate', crate: c }; this.state = 'haul'; this.t = 0; Sfx.play('hook', 0, 0.8); return; }
    for (const tn of G.tentacles) { const p = tn.hitPoint(k.x, k.y, 26); if (p && tn.canHook()) { const anchor = tn.anchorFor(p.i); this.caught = { kind: 'tentacle', anchor }; this.attach(anchor, G); tn.damage(6, G); return; } }
    if (G.kraken && G.kraken.eyeHit(k.x, k.y, 30)) { G.kraken.hookEye(o, G); this.caught = { kind: 'eye' }; this.state = 'attached'; return; }
    for (const s of G.ships) {
      if (s.sunk || (s === own && this.t < 0.6)) continue;
      for (const hp of s.hookPoints()) { const p = s.toWorld(hp.lx, hp.ly); if (Math.hypot(p.x - k.x, p.y - k.y) < 28) { const anchor = shipAnchor(s, hp.lx, hp.ly); if (hp.end) anchor.climb = { ship: s, lx: Math.sign(hp.lx) * s.walk * 0.85 }; this.caught = { kind: 'point', anchor }; this.attach(anchor, G); this.wrapT = 0; return; } }
    }
  }
  attach(anchor, G) { this.state = 'attached'; this.wrapT = 0; this.owner.attachRope(anchor, G); FX.sparks(this.hook.x, this.hook.y, 5); }
  draw(ctx, t) {
    if (this.state === 'idle' || this.pts.length < 2) return;
    const P0 = this.pts;
    for (let i = 1; i < P0.length; i++) {
      const a = P0[i - 1], b = P0[i], ax = Cam.bx(a.x), ay = Cam.by(a.y), bx = Cam.bx(b.x), by = Cam.by(b.y);
      P.line(ctx, ax, ay + 1, bx, by + 1, C.w1, 1); P.line(ctx, ax, ay, bx, by, i % 2 ? C.b1 : C.b2, 1);
    }
    const e = P0[P0.length - 1], pr = P0[P0.length - 2], ang = Math.atan2(e.y - pr.y, e.x - pr.x) + Math.PI / 2;
    // a wrap of rope around whatever it caught
    if (this.state === 'attached' && this.caught && this.caught.kind === 'point') { const x = Cam.bx(e.x), y = Cam.by(e.y); P.ring(ctx, x, y, 3, C.b2); P.dot(ctx, x - 2, y - 2, C.b3); }
    else blitRot(ctx, SPR.grapple, Cam.bx(e.x), Cam.by(e.y), this.state === 'fly' ? this.hook.ang + Math.PI / 2 : ang, 2, 1);
  }
}

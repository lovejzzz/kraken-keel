'use strict';
/* Characters: deck physics (they stand on a rolling deck and slide when it tilts), air, water, rope; combat; procedural drawing. */
const GRAV = 1900, CHAR = 1;
const LOOK = {
  captain: { coat: '#5a3a24', trim: '#b89868', skin: '#d9a07a', beard: '#b4481e', hat: '#3b2a1e', leg: '#2b2420', boot: '#3a2618', weapon: 'oar' },
  raider: { coat: '#3a3438', trim: '#6e1a18', skin: '#c89070', beard: '#2a1e18', hat: '#5b6068', leg: '#221c1c', boot: '#2a1c14', weapon: 'axe' },
  shield: { coat: '#34383e', trim: '#6e1a18', skin: '#c08868', beard: '#4a3020', hat: '#6b7078', leg: '#221c1c', boot: '#2a1c14', weapon: 'sword', shield: '#6e1a18' },
  berserker: { coat: '#4a3a2a', trim: '#8a6a40', skin: '#c47a5a', beard: '#6a2a14', hat: null, leg: '#2a1c14', boot: '#2a1c14', weapon: 'bigaxe', big: 1.18 },
  thrower: { coat: '#2e3a34', trim: '#6e1a18', skin: '#c89070', beard: '#3a2a1e', hat: '#4a4e54', leg: '#221c1c', boot: '#2a1c14', weapon: 'axe' },
  draugr: { coat: '#2a3430', trim: '#3f5a50', skin: '#7f9a8c', beard: '#4a5a52', hat: '#4a5850', leg: '#1a2220', boot: '#1a2220', weapon: 'sword', glow: [120, 255, 220] },
  draugrShield: { coat: '#26302c', trim: '#3f5a50', skin: '#7a9486', beard: '#4a5a52', hat: '#4a5850', leg: '#1a2220', boot: '#1a2220', weapon: 'sword', shield: '#3a4a44', glow: [120, 255, 220] },
  spear: {}, archer: {}, firepot: {}, hookman: {}, chieftain: {}, drowned: { glow: [120, 255, 220] },
};
const STATS = {
  raider: { hp: 64, dmg: 10, speed: 170, reach: 62, wind: 0.5 },
  shield: { hp: 84, dmg: 10, speed: 130, reach: 62, wind: 0.6, block: true, heavy: 1.2, elite: true, guard: 1 },
  berserker: { hp: 110, dmg: 17, speed: 250, reach: 74, wind: 0.38, heavy: 1.4, elite: true, guard: 0.35 },
  thrower: { hp: 44, dmg: 9, speed: 150, reach: 60, wind: 0.5, ranged: true },
  draugr: { hp: 66, dmg: 11, speed: 160, reach: 64, wind: 0.5, undead: true },
  draugrShield: { hp: 88, dmg: 11, speed: 120, reach: 64, wind: 0.6, block: true, undead: true, heavy: 1.2, elite: true, guard: 1 },
  spear: { hp: 70, dmg: 12, speed: 150, reach: 104, wind: 0.55, style: 'thrust', elite: true, guard: 0.5 },
  archer: { hp: 40, dmg: 7, speed: 150, reach: 60, wind: 0.5, ranged: true, shot: 'arrow' },
  firepot: { hp: 46, dmg: 8, speed: 150, reach: 60, wind: 0.5, ranged: true, shot: 'pot' },
  hookman: { hp: 60, dmg: 9, speed: 150, reach: 62, wind: 0.5, ranged: true, shot: 'hook' },
  drowned: { hp: 44, dmg: 9, speed: 200, reach: 58, wind: 0.4, style: 'grab', undead: true },
  chieftain: { hp: 260, dmg: 20, speed: 170, reach: 90, wind: 0.7, heavy: 2.4, style: 'boss', elite: true, guard: 0.6 },
};

class Actor {
  constructor(o) {
    Object.assign(this, {
      x: 0, y: 0, vx: 0, vy: 0, ship: null, lx: 0, vu: 0, face: 1, hp: 40, max: 40, team: 'enemy', type: 'raider', state: 'idle', st: 0,
      air: true, water: false, dead: false, gone: false, flash: 0, stun: 0, iframes: 0, anim: 0, squash: 0, lean: 0, onRope: null, coyote: 0, weaponA: 0,
      brace: false, wetT: 0, lastGround: null, id: Math.random(),
    }, o);
    this.look = LOOK[this.type]; this.stats = STATS[this.type];
    this.scale = (this.look.big || 1) * CHAR;
  }
  get feet() { return { x: this.x, y: this.y }; }
  get cx() { return this.x; } get cy() { return this.y - 34 * this.scale; }
  groundAngle() { if (!this.ship) return 0; const s = this.ship, e = 2, dy = s.deckY(this.lx + e) - s.deckY(this.lx - e); return s.a + Math.atan2(dy, 2 * e); }
  land(ship, lx) {
    const was = this.air;
    this.ship = ship; this.lx = lx; this.air = false; this.onRope = null; this.zipT = 0;
    const T = { x: Math.cos(ship.a), y: Math.sin(ship.a) }, pv = ship.pointVel(this.x, this.y);
    this.vu = (this.vx - pv.x) * T.x + (this.vy - pv.y) * T.y;
    if (was) { const impact = Math.min(1, Math.abs(this.vy) / 900); this.squash = 0.25 * impact + 0.05; if (impact > 0.3) { Sfx.play('land', this.pan(), impact); FX.burst(this.x, this.y, { n: 5, angle: -Math.PI / 2, spread: 1.4, speed: 120, size: 1, color: 'n7', life: 0.35, grav: 500 }); } }
    this.syncToShip();
  }
  syncToShip() {
    const s = this.ship; const p = s.toWorld(this.lx, s.deckY(this.lx));
    const T = { x: Math.cos(s.a), y: Math.sin(s.a) }, pv = s.pointVel(p.x, p.y);
    this.x = p.x; this.y = p.y; this.vx = pv.x + T.x * this.vu; this.vy = pv.y + T.y * this.vu;
  }
  launch(vx, vy) { // leave the deck with a world velocity
    this.air = true; this.ship = null; this.vx = vx; this.vy = vy; this.coyote = 0;
  }
  pan() { return clamp((this.x - Cam.x) / 900, -1, 1); }
  knock(kx, ky, stun = 0.3) {
    this.stun = Math.max(this.stun, stun);
    if (this.onRope) this.onRope = null;
    if (!this.air && this.ship) {
      const s = this.ship, T = { x: Math.cos(s.a), y: Math.sin(s.a) }, pv = s.pointVel(this.x, this.y);
      if (ky < -220) { this.launch(this.vx + kx, this.vy + ky); return; }
      this.vu += kx * T.x + ky * T.y;
    } else { this.vx += kx; this.vy += ky; }
  }
  physics(dt, ships, move = 0, braced = false) {
    this.flash = Math.max(0, this.flash - dt * 6); this.squash = damp(this.squash, 0, 12, dt); this.iframes = Math.max(0, this.iframes - dt);
    if (this.water) return this.swim(dt, move);
    if (this.onRope) return this.ropePhysics(dt, ships, move);
    if (!this.air && this.ship) {
      const s = this.ship;
      // a sinking deck throws everyone off at once (the captain leaps toward his own ship)
      if (s.sunk || s.sinking > 0.08) { const home = this.team === 'player' && G.player && G.player !== s ? Math.sign(G.player.x - this.x) || 1 : Math.sign(this.x - s.x) || 1; this.launch(this.vx + home * 260, Math.min(this.vy, 0) - 560); this.lastGround = null; return; }
      const ga = this.groundAngle(), sn = Math.sin(ga);
      const slide = braced ? 0 : Math.sign(sn) * Math.max(0, Math.abs(sn) - 0.1) * GRAV * 1.15;
      const topSpeed = (this.stats ? this.stats.speed : 330) * (braced ? 0.45 : 1), icy = s === G.player && G.icyAt && G.ices.length && G.icyAt(this.lx);
      if (move) { const target = move * topSpeed, acc = icy ? 650 : 2600; this.vu += clamp(target - this.vu, -acc * dt, acc * dt); }
      else this.vu *= Math.exp(-(icy ? (braced ? 3 : 0.5) : braced ? 14 : this.stun > 0 ? 2.2 : 6) * dt);
      if (icy && Math.random() < dt * Math.abs(this.vu) * 0.03) FX.burst(this.x, this.y - 1, { n: 1, angle: -Math.PI / 2, spread: 1, speed: 40, size: 1, color: 'b4', grav: 200, life: 0.3, water: false });
      this.vu += slide * dt;
      this.lx += this.vu * dt;
      if (Math.abs(this.lx) > s.walk) {
        const out = Math.sign(this.lx);
        if (this.vu * out > 250) {
          // over the rail: thrown off the end of the ship
          this.syncToShip(); const N = s.normal(); this.launch(this.vx + N.x * Math.abs(this.vu) * 0.5, this.vy + N.y * Math.abs(this.vu) * 0.6 - 80); return;
        }
        this.lx = out * s.walk; this.vu = Math.min(0, this.vu * out) * out;
      }
      this.syncToShip();
      this.lastGround = s; this.coyote = 0.1;
      return;
    }
    // airborne
    this.coyote -= dt; this.vy += GRAV * dt;
    if (this.team === 'player' && this.stun <= 0 && !this.onRope && !(this.zipT > 0)) {
      if (move) this.vx += clamp(move * 225 - this.vx, -1600 * dt, 1600 * dt);
      else this.vx *= Math.exp(-7 * dt);
    } else this.vx *= Math.exp(-0.25 * dt);
    const px = this.x, py = this.y;
    this.x += this.vx * dt; this.y += this.vy * dt;
    for (const s of ships) {
      if (s.sunk || s.sinking > 0.05) continue;
      const lo = s.toLocal(this.x, this.y), lp = s.toLocal(px, py);
      if (Math.abs(lo.x) <= s.walk + 4) {
        const dy = s.deckY(lo.x);
        if (lo.y >= dy && lp.y <= s.deckY(lp.x) + 10) { const rel = this.vy - s.pointVel(this.x, this.y).y; if (rel > -60) { this.land(s, clamp(lo.x, -s.walk, s.walk)); return; } }
      }
      // the captain grabs the rail: coming down just past the end of a deck (over the prow or stern), he is set on its edge
      if (this.team === 'player' && this.vy > 0 && Math.abs(lo.x) > s.walk && Math.abs(lo.x) < s.L + 6 && lo.y > s.deckY(Math.sign(lo.x) * s.walk) - 8 && lo.y < s.deckY(Math.sign(lo.x) * s.walk) + 34) {
        const lx = Math.sign(lo.x) * (s.walk - 4), p = s.toWorld(lx, s.deckY(lx)); this.x = p.x; this.y = p.y; this.vx *= 0.2; this.land(s, lx); this.squash = 0.25; return;
      }
      // hull body: push out past the nearer end
      if (Math.abs(lo.x) < s.L - 10 && lo.y > s.deckY(lo.x) + 6 && lo.y < 40 && !(this.zipT > 0)) {
        const out = Math.sign(lo.x) || 1, p = s.toWorld(out * (s.L + 12), lo.y); this.x = p.x; this.vx = out * Math.abs(this.vx) * 0.3 + s.vx;
      }
    }
    if (this.y > Sea.height(this.x) + 6) this.enterWater();
  }
  enterWater() {
    this.water = true; this.air = false; this.ship = null; this.onRope = null; this.wetT = 0;
    FX.splash(this.x, clamp(Math.hypot(this.vx, this.vy) / 700, 0.6, 1.8));
    this.vx *= 0.2; this.vy = 0;
    this.onWater && this.onWater();
  }
  swim(dt, move) {
    this.wetT += dt; const h = Sea.height(this.x);
    this.vx = damp(this.vx, move * (this.team === 'player' ? 190 : 110) - (this.team === 'player' ? 0 : Sea.speed * 0.15), 3, dt); this.x += this.vx * dt;
    this.y = damp(this.y, h + 14 + Math.sin(this.wetT * 3) * 3, 8, dt); this.vy = 0;
    if (Math.random() < dt * 3) Sea.splash(this.x, 12, 10);
  }
  ropePhysics(dt, ships, move) {
    const r = this.onRope, a = r.anchor();
    if (!a) { this.onRope = null; this.air = true; return; }
    r.t = (r.t || 0) + dt;
    if (r.climb) {
      r.len = Math.max(40, r.len - 520 * dt);
      if (Math.hypot(this.x - a.x, this.y - 46 - a.y) < 75 && !r.climb.ship.sunk) { const s = r.climb.ship; this.onRope = null; this.x = s.toWorld(r.climb.lx, 0).x; this.land(s, r.climb.lx); this.iframes = Math.max(this.iframes, 0.4); FX.burst(this.x, this.y, { n: 6, speed: 90, size: 1, color: 'n7', life: 0.3, grav: 400 }); return; }
    } else if (r.maxLen && r.len > r.maxLen) r.len = Math.max(r.maxLen, r.len - 900 * dt);
    else if (r.reel && Input.mouse.r && this.team === 'player') r.len = Math.max(70, r.len - 240 * dt);
    this.vy += GRAV * dt; this.vx += move * 520 * dt;
    this.x += this.vx * dt; this.y += this.vy * dt;
    const hand = 46 * this.scale, dx = this.x - a.x, dy = this.y - hand - a.y, d = Math.hypot(dx, dy);
    if (d > r.len) {
      const nx = dx / d, ny = dy / d; this.x = a.x + nx * r.len; this.y = a.y + ny * r.len + hand;
      const av = r.anchorVel ? r.anchorVel() : { x: 0, y: 0 }, rvx = this.vx - av.x, rvy = this.vy - av.y, vr = rvx * nx + rvy * ny;
      if (vr > 0) { this.vx -= vr * nx; this.vy -= vr * ny; }
    }
    this.air = true;
    // land on a deck while swinging
    for (const s of ships) {
      if (s.sunk) continue; const lo = s.toLocal(this.x, this.y);
      if (r.t > 0.35 && Math.abs(lo.x) <= s.walk && lo.y >= s.deckY(lo.x) - 2 && lo.y < s.deckY(lo.x) + 30 && this.vy > -100) { this.onRope = null; this.land(s, lo.x); return; }
    }
    if (this.y > Sea.height(this.x) + 6) this.enterWater();
  }
  hurt(dmg, kx, ky, o = {}) {
    if (this.dead || this.iframes > 0 || this.phased > 0) return false;
    if (this.team === 'player' && this.armor) dmg *= this.armor;
    this.hp -= dmg; this.flash = 1; this.flashT0 = performance.now();
    // the more punishment a raider has taken, the further he flies (captain excluded)
    if (this.team !== 'player' && !o.noScale) { this.taken = (this.taken || 0) + dmg; const k = Math.min(3.2, 1 + this.taken / 42) / ((this.stats && this.stats.heavy) || 1); kx *= k; ky *= 0.75 + 0.25 * k; }
    this.knock(kx, ky, o.stun ?? 0.3);
    FX.burst(this.x, this.cy, { n: 6 + (dmg / 3) | 0, angle: Math.atan2(ky, kx), spread: 0.8, speed: 320, size: 2, color: this.look.glow ? 'd3' : 'r3', color2: this.look.glow ? 'd1' : 'r1', grav: 1200, life: 0.5 });
    return true;
  }

  /* ---- drawing ---- */
  draw(ctx, t) { if (this.smear) drawSmear(ctx, this, true); drawPuppet(ctx, this, t); if (this.smear) drawSmear(ctx, this, false); }
}
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255, f = (v) => clamp(v + v * k, 0, 255) | 0;
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
/* A rope anchored to a ship point, a tentacle or the kraken */
function shipAnchor(ship, lx, ly) {
  return { anchor: () => (ship.sunk ? null : ship.toWorld(lx, ly)), anchorVel: () => { const p = ship.toWorld(lx, ly); return ship.pointVel(p.x, p.y); } };
}

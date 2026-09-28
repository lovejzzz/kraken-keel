'use strict';
/* Captain controls, enemy AI, projectiles and deck modules. */
/* Attacks as keyframed poses. Angles are screen angles in the facing frame: 0 = forward, -PI/2 = up, PI/2 = down.
   key: [time, angle, lean px, crouch, step px, fast(1 = ease-out burst)] */
const HALF_PI = Math.PI / 2, REST_A = 1.35, CHARGE_A = 3.85;
const wrapPi = (a) => a - TAU * Math.round(a / TAU);
/* crits: double damage, a gold burst and a longer freeze */
function critFX(x, y, dmg) {
  FX.text(x + rand(-6, 6), y - 50, `暴击 ${Math.round(dmg)}`, '#ffd84a', 21, 0.9); FX.hitSpark(x, y, -HALF_PI, true);
  FX.burst(x, y, { n: 20, speed: 560, size: 1, color: 'gold', color2: 'f5', grav: 500, life: 0.45, kind: 'spark', water: false });
  FX.light(x, y, 160, [255, 220, 120], 1.2); FX.stop(0.07); Cam.kick(0.018); Sfx.play('crit', clamp((x - Cam.x) / 700, -1, 1), 1);
}
const ATTACKS = [
  { name: 'slash', dur: 0.34, hit: [0.085, 0.135], cancel: 0.16, reach: 86, dmg: 12, kx: 360, ky: -170, stop: 0.075, heavy: false, sfx: 'swing',
    keys: [[0, REST_A, 0, 0, 0], [0.045, 2.75, -2, 0.25, -1], [0.08, 3.98, -4, 0.45, -3], [0.125, 7.2, 5, 0.55, 5, 1], [0.17, 7.5, 4, 0.45, 4], [0.22, 7.45, 2, 0.25, 2], [0.34, REST_A + TAU, 0, 0, 0]] },
  { name: 'upper', dur: 0.36, hit: [0.075, 0.13], cancel: 0.18, reach: 86, dmg: 12, kx: 300, ky: -430, stop: 0.085, heavy: false, sfx: 'swing',
    keys: [[0, 1.25, 1, 0.2, 0], [0.065, 2.55, -2, 0.65, -2], [0.125, -1.3, 4, 0, 4, 1], [0.17, -1.7, 3, -0.1, 3], [0.22, -1.6, 2, 0, 2], [0.36, REST_A, 0, 0, 0]] },
  { name: 'slam', dur: 0.54, hit: [0.185, 0.25], cancel: 99, reach: 98, dmg: 24, kx: 820, ky: -560, stop: 0.14, heavy: true, finisher: true, sfx: 'swingBig',
    keys: [[0, REST_A, 0, 0, 0], [0.08, 2.9, -2, 0.3, -1], [0.16, 3.7, -5, 0.6, -3], [0.195, 4.9, 1, 0.1, 1, 1], [0.235, 7.55, 6, 0.85, 5, 1], [0.34, 7.6, 4, 0.6, 3], [0.54, REST_A + TAU, 0, 0, 0]] },
];
/* the cutlass: short, quick, low knockback — four cuts, the last a lunging thrust; hits make raiders bleed */
const CUTLASS = [
  { name: 'c1', dur: 0.2, hit: [0.045, 0.09], cancel: 0.09, reach: 64, dmg: 8, kx: 150, ky: -90, stop: 0.045, heavy: false, sfx: 'swing', light: true,
    keys: [[0, REST_A, 0, 0, 0], [0.04, 3.7, -2, 0.2, -1], [0.085, 7.1, 4, 0.3, 4, 1], [0.12, 7.35, 3, 0.2, 3], [0.2, REST_A + TAU, 0, 0, 0]] },
  { name: 'c2', dur: 0.2, hit: [0.045, 0.09], cancel: 0.09, reach: 64, dmg: 8, kx: 150, ky: -130, stop: 0.045, heavy: false, sfx: 'swing', light: true,
    keys: [[0, 1.25, 1, 0.2, 0], [0.04, 2.4, -1, 0.45, -1], [0.085, -1.1, 4, 0, 4, 1], [0.12, -1.4, 3, 0, 3], [0.2, REST_A, 0, 0, 0]] },
  { name: 'c3', dur: 0.21, hit: [0.05, 0.095], cancel: 0.1, reach: 66, dmg: 9, kx: 170, ky: -100, stop: 0.05, heavy: false, sfx: 'swing', light: true,
    keys: [[0, REST_A, 0, 0, 0], [0.045, 3.4, -2, 0.3, -1], [0.09, 6.9, 5, 0.4, 5, 1], [0.13, 7.2, 3, 0.2, 3], [0.21, REST_A + TAU, 0, 0, 0]] },
  { name: 'c4', dur: 0.32, hit: [0.09, 0.15], cancel: 99, reach: 82, dmg: 16, kx: 360, ky: -200, stop: 0.08, heavy: true, finisher: true, sfx: 'swingBig',
    keys: [[0, 0.5, -3, 0.3, -3], [0.07, 0.35, -5, 0.45, -4], [0.11, -0.05, 9, 0.2, 10, 1], [0.2, 0, 6, 0.1, 6], [0.32, REST_A, 0, 0, 0]] },
];
function chargedCutlass(c) {
  return { name: 'dash', dur: 0.34, hit: [0.03, 0.22], cancel: 99, reach: 70, dmg: 16 + c * 24, kx: 280, ky: -160, stop: 0.06, heavy: true, charged: true, dash: true, finisher: c > 0.9, sfx: 'swingBig',
    keys: [[0, 3.8, -3, 0.5, -2], [0.05, 6.1, 5, 0.4, 7, 1], [0.22, 6.3, 6, 0.3, 6], [0.34, REST_A + TAU, 0, 0, 0]] };
}
function chargedAttack(c) {
  return { name: 'sweep', dur: 0.44, hit: [0.02, 0.12], cancel: 99, reach: 104 + c * 18, dmg: 28 + c * 34, kx: 900 + c * 700, ky: -540 - c * 320, stop: 0.1 + c * 0.06, heavy: true, charged: true, sfx: 'swingBig',
    keys: [[0, CHARGE_A, -4, 0.55, -3], [0.045, 5.2, 2, 0.3, 3, 1], [0.095, 7.1, 7, 0.6, 7, 1], [0.17, 7.5, 4, 0.35, 4], [0.44, REST_A + TAU, 0, 0, 0]] };
}
/* every melee weapon: its combo, its charged move and the smear radius; ranged weapons name their update method */
const MELEE = { oar: { combo: ATTACKS, charged: chargedAttack, r: 38 }, cutlass: { combo: CUTLASS, charged: chargedCutlass, r: 27 } };
const RANGED = { scatter: 'updateScatter' };
/* enemy spells by shot name, and extra projectile looks (filled in by the later chapters and weapons) */
const SHOTS = {}, PROJ_DRAW = {};
/* sample a keyframed attack at time t -> {a, lean, crouch, step} */
function atkPose(def, t) {
  const K = def.keys; if (t <= K[0][0]) return { a: K[0][1], lean: K[0][2], crouch: K[0][3], step: K[0][4] };
  for (let i = 1; i < K.length; i++) {
    if (t <= K[i][0]) {
      const p = K[i - 1], q = K[i], u = (t - p[0]) / (q[0] - p[0]), e = q[5] ? 1 - Math.pow(1 - u, 3) : smooth(u);
      return { a: lerp(p[1], q[1], e), lean: lerp(p[2], q[2], e), crouch: lerp(p[3], q[3], e), step: lerp(p[4], q[4], e) };
    }
  }
  const L = K[K.length - 1]; return { a: L[1], lean: L[2], crouch: L[3], step: L[4] };
}
/* is angle psi inside the arc swept from a0 to a1 (either direction), with a margin */
function inArc(psi, a0, a1, m) { const lo = Math.min(a0, a1) - m, hi = Math.max(a0, a1) + m; for (let k = -1; k <= 1; k++) { const p = psi + k * TAU; if (p >= lo && p <= hi) return true; } return false; }

class Captain extends Actor {
  constructor(o) {
    super({ team: 'player', type: 'captain', hp: 100, max: 100, ...o });
    this.stats = { speed: 330 };
    Object.assign(this, { atk: null, combo: 0, comboT: 0, buffer: 0, chargeT: 0, charging: false, charge: 0, dodge: 0, dodgeCd: 0, hook: null, ropeRange: 560, dmgMul: 1, down: 0, jumpBuf: 0, mounted: null, climbT: 0, coldT: 0, walkV: 0, stepT: 0 });
  }
  update(dt, G) {
    const I = Input, m = I.mouse;
    if (this.down > 0) {
      this.down -= dt; this.weaponA = damp(this.weaponA, 1.4, 6, dt); this.crouch = 1;
      this.physics(dt, G.ships, 0, true);
      if (this.down <= 0) { this.hp = Math.round(this.max * 0.5); this.iframes = 1.5; this.crouch = 0; FX.text(this.x, this.y - 90, '重新站起', '#ffd8a0', 22); }
      return;
    }
    if (this.climb) return this.updateClimb(dt, G);
    if (this.frozen > 0) {
      const mash = I.tap('a', 'd', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'ArrowUp') || Input.mouse.lp;
      this.frozen -= dt + (mash ? 0.14 : 0); if (mash) FX.burst(this.x, this.y - 30, { n: 3, speed: 120, size: 1, color: 'b4', color2: 'n8', grav: 500, life: 0.4 });
      if (this.frozen <= 0) { this.frozen = 0; FX.burst(this.x, this.y - 30, { n: 16, speed: 260, size: 2, color: 'b4', color2: 'n8', grav: 600, life: 0.6 }); Sfx.play('clang', this.pan(), 0.6); }
      this.physics(dt, G.ships, 0, true); return;
    }
    if (this.carried) { this.air = true; this.anim += dt; this.weaponA = damp(this.weaponA, -2.4 - HALF_PI, 8, dt); this.atk = null; this.charging = false; if (Bon.state !== 'carry') this.carried = false; return; }
    if (this.ship && !G.ships.includes(this.ship)) { this.launch(this.vx, this.vy - 200); this.lastGround = G.player; }
    let move = this.zipT > 0 ? 0 : I.axis(); if (this.zipT > 0) this.zipT -= dt;
    const peaceful = G.state !== 'fight' && G.state !== 'won';
    const grounded = !this.air && !this.water && !this.onRope;
    this.brace = grounded && I.down('s', 'ArrowDown') && !this.atk;
    this.crouch = damp(this.crouch || 0, this.brace ? 1 : 0, 14, dt);
    this.dodge = Math.max(0, this.dodge - dt); this.dodgeCd = Math.max(0, this.dodgeCd - dt); this.comboT = Math.max(0, this.comboT - dt);
    this.buffer = Math.max(0, this.buffer - dt); this.jumpBuf = Math.max(0, this.jumpBuf - dt);
    // facing: toward the mouse while acting, else toward movement
    const mdx = m.x - this.x;
    if (this.atk || this.charging || (RANGED[this.weapon] && !peaceful && !this.water && this.dodge <= 0)) this.face = mdx >= 0 ? 1 : -1; else if (move) this.face = move;
    // jump (buffered, coyote, variable height)
    if (I.tap(' ', 'w', 'ArrowUp')) this.jumpBuf = 0.13;
    // in the sea, swimming into a hull (or jumping beside one) hauls the captain up over the rail
    if (this.water) {
      for (const s of G.ships) {
        if (s.sunk || s.sinking > 0.5 || s.leaving) continue;
        const lo = s.toLocal(this.x, this.y), side = Math.sign(lo.x) || 1, inside = Math.abs(lo.x) < s.L, touching = Math.abs(lo.x) < s.L + 22;
        if (touching && (this.jumpBuf > 0 || (move && (inside || move === -side)))) {
          const lx = clamp(lo.x, -s.walk + 10, s.walk - 10);
          this.climb = { ship: s, lx, t: 0, x0: this.x, y0: this.y }; this.water = false; this.air = true; this.jumpBuf = 0; this.atk = null; this.smear = null; this.charging = false;
          this.face = Math.sign(s.toWorld(lx, 0).x - this.x) || this.face; FX.splash(this.x, 0.7); Sfx.play('jump', this.pan(), 0.8);
          return this.updateClimb(dt, G);
        }
      }
    }
    if (grounded || this.water) this.airJumps = 1;
    if (this.jumpBuf > 0 && this.dodge <= 0) {
      const cancel = () => { this.atk = null; this.smear = null; this.charging = false; this.chargeT = 0; this.charge = 0; };
      if (this.water) {
        // leap out of the sea: high enough to land on a deck
        this.jumpBuf = 0; cancel(); this.water = false; this.y = Sea.height(this.x) - 8; this.launch(this.vx + move * 150, -820);
        FX.splash(this.x, 0.8); Sfx.play('jump', this.pan()); this.squash = -0.2;
      } else if (grounded || this.coyote > 0) {
        this.jumpBuf = 0; cancel();
        const base = grounded ? this.ship.pointVel(this.x, this.y) : { x: this.vx, y: this.vy };
        const s = this.ship || this.lastGround, T = s ? s.tangent() : { x: 1, y: 0 };
        this.launch(base.x + T.x * this.vu * (grounded ? 0.6 : 0) + move * 60, Math.min(base.y, 0) - 700 * (this.jumpMul || 1));
        this.squash = -0.2; Sfx.play('jump', this.pan()); this.coyote = 0;
      } else if (this.air && this.airJumps > 0) {
        // a second jump in the air, to cross the gap between ships
        this.jumpBuf = 0; this.airJumps--; cancel(); this.vy = Math.min(this.vy, 0) - 640; this.vx = move ? move * 225 : this.vx * 0.3;
        Sfx.play('jump', this.pan(), 1.2); FX.burst(this.x, this.y, { n: 8, angle: Math.PI / 2, spread: 1.2, speed: 110, size: 3, color: 'n7', grav: 0, life: 0.35, kind: 'mist', water: false });
      }
    }
    if (this.air && !this.onRope && !(this.zipT > 0) && this.vy < -200 && !I.down(' ', 'w', 'ArrowUp')) this.vy += 2600 * dt; // short hop when released
    // water: no penalty; swim and jump back out. Only if he drifts far from every ship does the crew haul him in.
    if (this.water) {
      G.hint = '空格 跳出水面 · 游向船边爬上去';
      const nearest = Math.min(...G.ships.filter((s) => !s.sunk).map((s) => Math.abs(this.x - s.x) - s.L));
      this.farT = nearest > 500 ? (this.farT || 0) + dt : 0;
      if (this.farT > 4) { const ps = G.player, side = Math.sign(this.x - ps.x) || 1; this.water = false; this.land(ps, side * ps.walk * 0.8); FX.splash(this.x, 0.8); FX.text(this.x, this.y - 70, '船员把你拉了上来', '#9fe8ff', 20, 1.4); this.farT = 0; }
    }
    // dodge roll
    if (I.tap('Shift') && this.dodgeCd <= 0 && grounded && !this.atk) {
      this.dodge = 0.34; this.dodgeCd = 0.62; this.iframes = 0.3; this.vu = (move || this.face) * 620; this.face = move || this.face; Sfx.play('swing', this.pan(), 0.6);
      FX.burst(this.x, this.y - 4, { n: 6, angle: Math.PI / 2 * 0 - Math.PI / 2, spread: 1, speed: 90, size: 5, color: 'foam', grav: 0, life: 0.4, kind: 'mist' });
    }
    if (this.dodge > 0) { move = 0; this.spinRoll = (this.spinRoll || 0) + dt * 18 * this.face; } else this.spinRoll = 0;
    // weapon switch (Q) between owned weapons
    if (I.tap('q', 'Q') && !this.atk && !this.charging && G.wpn && !G.hammerOut) { const own = WEAPONS.filter((k) => G.wpn.own[k]); if (own.length > 1) { G.wpn.cur = own[(own.indexOf(G.wpn.cur) + 1) % own.length]; Sfx.play('ui', 0, 1); FX.text(this.x, this.y - 90, UPGRADES[G.wpn.cur].name, '#ffd8a0', 16, 0.8); this.weaponA = REST_A - HALF_PI; } }
    const sc = !!RANGED[this.weapon], nHits = (MELEE[this.weapon] || MELEE.oar).combo.length;
    if (sc) this[RANGED[this.weapon]](dt, G, m, peaceful); else {
    // attack: tap for combo, hold to charge
    if (m.lp && !this.water && !peaceful) this.buffer = 0.16;
    this.holdT = m.l ? (this.holdT || 0) + dt : 0; this.chargeFlash = Math.max(0, (this.chargeFlash || 0) - dt * 4);
    const canAct = !this.water && this.dodge <= 0 && !peaceful;
    if (canAct && !this.charging && !(this.busyT > 0) && (m.r || (m.l && this.holdT > 0.2)) && (!this.atk || (!this.atk.def.heavy && this.atk.t > this.atk.def.hit[1] + 0.02))) {
      this.atk = null; this.smear = null; this.charging = true; this.chargeT = 0; this.charge = 0; this.chargeLv = 0; this.buffer = 0; Sfx.play('chargeStart', this.pan(), 1);
    }
    if (this.charging) {
      if (!canAct) { this.charging = false; this.charge = 0; }
      else {
        this.chargeT += dt * (this.chargeRate || 1); this.charge = clamp(this.chargeT / 0.6, 0, 1);
        const lv = this.charge >= 1 ? 2 : this.charge >= 0.45 ? 1 : 0, tip = this.tipWorld();
        if (lv > this.chargeLv) {
          this.chargeLv = lv; this.chargeFlash = 1; Sfx.play(lv === 2 ? 'chargeFull' : 'chargeLv', this.pan(), 1);
          FX.burst(tip.x, tip.y, { n: lv === 2 ? 18 : 8, speed: lv === 2 ? 300 : 170, size: 1, color: 'f6', color2: lv === 2 ? 'gold' : 'f4', grav: 0, life: 0.3, kind: 'spark', water: false });
          if (lv === 2) { Cam.kick(0.012); FX.stop(0.03); }
        }
        // sparks drawn into the blade, a glow that grows
        if (Math.random() < 0.3 + this.charge * 0.6) { const a = rand(0, TAU), r = rand(26, 44); FX.burst(tip.x + Math.cos(a) * r, tip.y + Math.sin(a) * r, { n: 1, angle: a + Math.PI, spread: 0, speed: r * 5, size: 1, color: this.charge >= 1 ? 'gold' : 'f4', grav: 0, life: 0.2, jit: 0, water: false }); }
        FX.light(tip.x, tip.y, 80 + this.charge * 140, [255, 190, 90], 0.3 + this.charge * 0.7);
        if ((!m.l && !m.r) || m.lr || m.rr) { this.startAttack(9, this.charge); this.charging = false; this.chargeT = 0; this.charge = 0; this.chargeLv = 0; this.buffer = 0; }
      }
    }
    if (this.buffer > 0 && !this.charging && this.dodge <= 0 && !this.water && !(this.busyT > 0)) {
      if (!this.atk) { this.buffer = 0; this.startAttack(this.comboT > 0 ? this.combo % nHits : 0); }
      else if (this.atk.t > this.atk.def.cancel && this.atk.step < nHits - 1) { this.buffer = 0; this.startAttack(this.atk.step + 1); }
    }
    }
    if (this.atk) this.runAttack(dt, G);
    else if (!sc) {
      const tgt = this.charging ? CHARGE_A - HALF_PI + Math.sin(performance.now() / 28) * 0.1 * this.charge : this.air ? -2.0 - HALF_PI : this.brace ? 0.4 - HALF_PI : REST_A - HALF_PI + Math.sin(this.anim * 0.5) * 0.04;
      this.weaponA = tgt + wrapPi(this.weaponA - tgt); // never unwind a full turn after a swing
      this.weaponA = damp(this.weaponA, tgt, this.charging ? 16 : 9, dt);
      this.atkLean = damp(this.atkLean || 0, this.charging ? -4 : 0, 12, dt); this.atkCrouch = damp(this.atkCrouch || 0, this.charging ? 0.55 + this.charge * 0.2 : 0, 12, dt); this.atkStep = damp(this.atkStep || 0, this.charging ? -3 : 0, 12, dt);
    }
    if (this.atk && this.atk.def.dash) move = 0; else if (this.atk && this.atk.def.heavy) move *= 0.15; else if (this.atk && this.atk.def.light) move *= 0.85; else if (this.atk || this.charging) move *= sc ? 0.55 : 0.3;
    // movement
    this.physics(dt, G.ships, this.dodge > 0 ? 0 : move, this.brace);
    this.walkV = !this.air ? this.vu : 0; this.anim += dt * (Math.abs(this.walkV) * 0.045 + 1);
    if (!this.air && Math.abs(this.walkV) > 60) { this.stepT -= dt * Math.abs(this.walkV) / 130; if (this.stepT <= 0) { this.stepT = 1; Sfx.play('step', this.pan(), 0.7); if (Sea.storm > 0.3) FX.burst(this.x - this.face * 6, this.y - 2, { n: 2, angle: -Math.PI / 2 - this.face * 0.6, spread: 0.5, speed: 90, size: 1, color: 't8', grav: 700, life: 0.3 }); } }
    this.spin = this.dodge > 0 ? this.spinRoll : 0;
    this.lean = damp(this.lean, (this.vu / 330) * 0.12 * (this.air ? 0 : 1), 8, dt);
    if (this.hp <= 0 && this.down <= 0) this.knockOut(G);
  }
  knockOut(G) {
    this.hp = 0; this.down = 4; this.atk = null; this.charging = false; this.onRope = null;
    if (this.water) { this.water = false; this.land(G.player, 0); }
    FX.text(this.x, this.y - 90, '船长倒下', '#ff9a7a', 26, 1.6); Sfx.play('hurt', this.pan(), 1); Cam.shake(0.15);
    const lost = Math.floor(G.silver * 0.15); if (lost) { G.silver -= lost; FX.text(this.x, this.y - 60, `-${lost} 银`, '#c0c8d0', 20); }
  }
  startAttack(step, charge = 0) {
    // step 9 is the charged move (every combo is shorter than that)
    const M = MELEE[this.weapon] || MELEE.oar, def = step === 9 ? M.charged(charge) : M.combo[step];
    // the swing leans toward the cursor: aim up to hit what is above, down for what is below
    const sh = this.shoulderWorld(), fa = Math.atan2(Input.mouse.y - sh.y, Math.abs(Input.mouse.x - sh.x) + 8), tilt = def.dash ? 0 : clamp(fa, -0.95, 0.8) * 0.55;
    this.atk = { step, def, t: 0, hit: new Set(), charge, connected: false, tilt, prevA: atkPose(def, 0).a + tilt }; this.combo = step + 1; this.comboT = 0.55;
    this.swung = false;
  }
  get weapon() { return (G.wpn && G.wpn.cur) || 'oar'; }
  wMul() { const k = this.weapon, u = UPGRADES[k]; return 1 + (u && u.per || 0) * (G.ups[k] || 0); }
  /* the scatterbow: aim with the mouse, tap to fire a fan of bolts, hold to tighten it and punch through */
  updateScatter(dt, G, m, peaceful) {
    const canAct = !this.water && this.dodge <= 0 && !peaceful, lv = G.ups.scatter || 0;
    this.shotCd = Math.max(0, (this.shotCd || 0) - dt); this.chargeFlash = Math.max(0, (this.chargeFlash || 0) - dt * 4); this.recoil = Math.max(0, (this.recoil || 0) - dt * 6);
    this.holdT = m.l || m.r ? (this.holdT || 0) + dt : 0;
    const sh = this.shoulderWorld(), ang = Math.atan2(m.y - sh.y, m.x - sh.x), fa = Math.atan2(m.y - sh.y, Math.abs(m.x - sh.x) + 1);
    this.weaponA = damp(this.weaponA, clamp(fa, -1.45, 1.4) - HALF_PI - this.recoil * 0.5, 24, dt); this.atkLean = -this.recoil * 4; this.atkStep = 0; this.atkCrouch = damp(this.atkCrouch || 0, this.charging ? 0.4 : 0, 10, dt);
    if (!canAct) { this.charging = false; this.charge = 0; return; }
    if (!this.charging && this.holdT > 0.22 && this.shotCd <= 0.1) { this.charging = true; this.chargeT = 0; this.charge = 0; this.chargeLv = 0; Sfx.play('chargeStart', this.pan(), 1); }
    if (this.charging) {
      this.chargeT += dt * (this.chargeRate || 1); this.charge = clamp(this.chargeT / 0.7, 0, 1); const l2 = this.charge >= 1 ? 2 : this.charge >= 0.45 ? 1 : 0;
      if (l2 > this.chargeLv) { this.chargeLv = l2; this.chargeFlash = 1; Sfx.play(l2 === 2 ? 'chargeFull' : 'chargeLv', this.pan(), 1); }
      if (Math.random() < 0.4 * this.charge) { const p = { x: sh.x + Math.cos(ang) * 30, y: sh.y + Math.sin(ang) * 30 }; FX.burst(p.x, p.y, { n: 1, speed: 40, size: 1, color: 'f5', grav: 0, life: 0.2, water: false }); }
    }
    if (m.lr || m.rr || (this.charging && !m.l && !m.r)) this.queued = 0.18;
    this.queued = Math.max(0, (this.queued || 0) - dt);
    if (this.queued > 0 && this.shotCd <= 0) { this.fireScatter(G, ang, this.charging ? this.charge : 0, lv); this.queued = 0; this.charging = false; this.charge = 0; this.chargeLv = 0; }
  }
  fireScatter(G, ang, c, lv) {
    const charged = c > 0.3, n = (charged ? 7 : 5) + lv, spread = charged ? lerp(0.3, 0.12, c) : 0.46, spd = charged ? 1500 : 1150, life = charged ? 0.5 : 0.3;
    const dmg = 7 * this.dmgMul * this.wMul() * (charged ? 1 + c * 0.6 : 1), sh = this.shoulderWorld(), mx = sh.x + Math.cos(ang) * 30, my = sh.y + Math.sin(ang) * 30, volley = {};
    for (let i = 0; i < n; i++) {
      const a = ang + (i / (n - 1) - 0.5) * spread + rand(-0.03, 0.03), s = spd * rand(0.92, 1.05), crit = Math.random() < this.critChance({ charged }, { charge: c });
      G.shots.push(new Projectile({ x: mx, y: my, vx: Math.cos(a) * s, vy: Math.sin(a) * s, grav: 160, dmg: dmg * (crit ? 2 : 1), crit, team: 'player', kind: 'pellet', life, kx: charged ? 200 : 90, ky: charged ? -90 : -40, stun: charged ? 0.35 : 0.2, pierce: charged ? 1 : 0, fire: lv >= 3 && Math.random() < 0.3, volley, charged }));
    }
    if (c >= 0.99 && Bon.has(9)) { const w = Waves.spawn(this, dmg * 2.2); Bon.ride(w); }
    this.shotCd = 0.8 - lv * 0.06 + (charged ? 0.25 : 0); this.recoil = 1;
    if (!this.air && this.ship) this.vu -= this.face * (charged ? 300 : 160); else this.vx -= Math.cos(ang) * (charged ? 260 : 120);
    Cam.kick(charged ? 0.022 : 0.01); Cam.shake(charged ? 0.1 : 0.04);
    FX.burst(mx, my, { n: charged ? 16 : 9, angle: ang, spread: 0.35, speed: 380, size: 1, color: 'f6', color2: 'f4', grav: 0, life: 0.14, kind: 'spark', water: false });
    FX.burst(mx, my, { n: 4, angle: ang, spread: 0.5, speed: 60, size: 3, color: 'm2', grav: -40, life: 0.5, kind: 'smoke', water: false }); FX.light(mx, my, 150, [255, 200, 120], 1.2);
    Sfx.play('ballista', this.pan(), 0.6); Sfx.play('crack', this.pan(), charged ? 0.7 : 0.3);
  }
  critChance(d, A) { return 0.12 + (this.critBonus || 0) + (d.charged ? 0.35 * (A.charge || 0) : 0) + (this.comboT > 0 && d.name === 'slam' ? 0.08 : 0); }
  /* charge meter over the head: fills orange, a notch at the first level, blinks gold when full */
  drawCharge(ctx) {
    if (!this.charging && this.weapon === 'scatter' && this.shotCd > 0) { const bx = Cam.bx(this.x) - 9, by = Cam.by(this.y) - 58, k = 1 - this.shotCd / 1.05; P.rect(ctx, bx - 1, by - 1, 20, 4, C.ink); P.rect(ctx, bx, by, Math.round(18 * clamp(k, 0, 1)), 2, C.m3); return; }
    if (!this.charging) return;
    const bx = Cam.bx(this.x) - 9, by = Cam.by(this.y) - 58, w = 18, k = this.charge, full = k >= 1, blink = Math.floor(performance.now() / 80) % 2;
    P.rect(ctx, bx - 1, by - 1, w + 2, 5, C.ink); P.rect(ctx, bx, by, w, 3, C.n2);
    P.rect(ctx, bx, by, Math.round(w * k), 3, C[full ? (blink ? 'gold' : 'white') : k >= 0.45 ? 'f5' : 'f3']);
    P.rect(ctx, bx + Math.round(w * 0.45), by, 1, 3, C.ink);
    if (full) { P.rect(ctx, bx - 2, by - 2, w + 4, 1, C[blink ? 'gold' : 'f4']); P.rect(ctx, bx - 2, by + 4, w + 4, 1, C[blink ? 'gold' : 'f4']); }
  }
  /* shoulder in world units (the smear and the hit arc pivot here) */
  shoulderWorld() { const lean = this.atkLean || 0, cr = this.atkCrouch || 0; return { x: this.x + this.face * (lean + 1) / S, y: this.y + (-19 + cr * 3) / S }; }
  tipWorld() { const sh = this.shoulderWorld(), a = this.weaponA + HALF_PI, r = 38 / S; return { x: sh.x + Math.cos(a) * r * this.face, y: sh.y + Math.sin(a) * r }; }
  runAttack(dt, G) {
    const A = this.atk, d = A.def; A.t += dt;
    const p = atkPose(d, A.t); p.a += A.tilt || 0;
    this.weaponA = p.a - HALF_PI; this.atkLean = p.lean; this.atkCrouch = p.crouch; this.atkStep = p.step;
    // whoosh at the start of the fast part, and a small lunge
    if (!this.swung && A.t >= d.hit[0] - 0.02) {
      this.swung = true; Sfx.play(d.sfx, this.pan(), d.heavy ? 1 : 0.8);
      if (!this.air && this.ship) this.vu += this.face * (d.charged ? 260 + A.charge * 200 : d.heavy ? 200 : 110);
      if (d.charged && !d.dash) { const p = this.shoulderWorld(); FX.burst(p.x - this.face * 20, this.y - 4, { n: 8, angle: -HALF_PI - this.face * 0.9, spread: 0.5, speed: 160, size: 4, color: 'n7', grav: 0, life: 0.4, kind: 'mist' }); if (A.charge >= 0.99) { const w = Waves.spawn(this, d.dmg * 0.6); Bon.ride(w); Cam.kick(0.02); } }
      if (d.name === 'slam' && !this.air) { /* stomp */ }
    }
    // smear: the arc the weapon tip swept over the last few frames
    const tail = atkPose(d, Math.max(d.hit[0] - 0.03, A.t - (d.heavy ? 0.06 : 0.045))).a + (A.tilt || 0);
    this.smear = A.t >= d.hit[0] - 0.03 && A.t <= d.hit[1] + 0.07 ? { from: tail, to: p.a, r: (MELEE[this.weapon] || MELEE.oar).r + (A.charge || 0) * 4, heavy: d.heavy, col: weaponSmear(this.weapon, d), k: A.t <= d.hit[1] ? 1 : 1 - (A.t - d.hit[1]) / 0.07 } : null;
    if (d.dash && !A.rode && A.charge >= 0.99 && Bon.has(9)) { A.rode = true; const w = Waves.spawn(this, d.dmg * 0.5); Bon.ride(w); }
    if (d.dash && A.t <= d.hit[1]) { this.vu = this.face * (650 + A.charge * 450); this.iframes = Math.max(this.iframes, 0.1); if (Math.random() < 0.8) FX.burst(this.x - this.face * 10, this.y - 20, { n: 1, angle: this.face > 0 ? Math.PI : 0, spread: 0.3, speed: 120, size: 2, color: 'b4', grav: 0, life: 0.25, kind: 'mist', water: false }); }
    if (d.onStrike && !A.struck && A.t >= (d.strikeAt ?? d.hit[0] + 0.03)) { A.struck = true; d.onStrike(this, A, G); }
    if (A.t >= d.hit[0] && A.t <= d.hit[1]) { if (d.dash) this.hitScan(G, d, A, -0.9, 0.9); else this.hitScan(G, d, A, A.prevA, p.a); }
    A.prevA = p.a;
    if (d.name === 'slam' && A.t >= 0.235 && !A.stomped && !this.air) { A.stomped = true; const t = this.tipWorld(); FX.burst(t.x, t.y, { n: 10, angle: -Math.PI / 2, spread: 1.3, speed: 220, size: 2, color: 'w4', color2: 'w2', grav: 900, life: 0.5, kind: 'splinter' }); FX.burst(t.x, t.y, { n: 6, angle: -Math.PI / 2, spread: 1.4, speed: 80, size: 3, color: 'n7', grav: 0, life: 0.4, kind: 'mist' }); Sfx.play('wood', this.pan(), 0.7); if (!A.connected) Cam.shake(0.12); }
    if (A.t >= d.dur) { this.atk = null; this.smear = null; }
  }
  hitScan(G, d, A, a0, a1) {
    const sh = this.shoulderWorld(), dmg = d.dmg * this.dmgMul * this.wMul(), reach = d.reach, f = this.face;
    const swingDir = Math.sign(a1 - a0) || 1, tipA = a1;
    const connect = (x, y, big, target) => {
      // contact point, swing tangent and the feedback stack
      const tang = tipA + swingDir * HALF_PI, worldAng = f > 0 ? tang : Math.PI - tang;
      FX.hitSpark(x, y, worldAng, big); FX.slashLine(x, y, f > 0 ? tipA + HALF_PI * 0.6 * swingDir : Math.PI - tipA - HALF_PI * 0.6 * swingDir, big);
      if (!A.connected) { A.connected = true; FX.stop(d.stop); if (big) { Cam.shake(d.charged ? 0.28 : 0.16); Cam.kick(0.02); } if (d.charged && (A.charge || 0) > 0.8) FX.slowmo(0.3, 0.16); }
      FX.burst(x, y, { n: big ? 14 : 8, angle: worldAng, spread: 0.55, speed: big ? 560 : 420, size: 1, color: 'f6', color2: 'f4', grav: 700, life: 0.28, kind: 'spark', water: false });
      if (target) target.jitter = d.stop + 0.06;
      G.comboN = G.comboT > 0 ? (G.comboN || 0) + 1 : 1; G.comboT = 1.4; UI.comboPop = 1;
    };
    for (const e of G.enemies) {
      if (e.dead || A.hit.has(e) || e.water || e.phased > 0) continue;
      const rx = (e.cx - sh.x) * f, ry = e.cy - sh.y, dist = Math.hypot(rx, ry), psi = Math.atan2(ry, rx);
      if (!(dist < 26 || (dist <= reach + 18 * e.scale && inArc(psi, a0, a1, 0.5)))) continue;
      A.hit.add(e);
      const cx = e.cx - f * 8, cy = e.cy - 4;
      const mul = G.lightMul(e.x, e.y);
      const guarding = e.blocking && e.phase !== 'wind' && e.phase !== 'strike';
      if (guarding && Math.sign(this.x - e.x) === e.face && !d.heavy) {
        e.cool = 0.06; e.counter = true; e.waitT = 99;
        e.hurt(dmg * 0.15, f * 180, -40, { stun: 0.14 }); Sfx.play('clang', e.pan()); FX.sparks(e.x + e.face * 12, e.y - 40, 14, f > 0 ? Math.PI : 0); FX.stop(0.05); e.jitter = 0.1;
        FX.hitSpark(e.x + e.face * 12, e.y - 40, f > 0 ? Math.PI : 0, false); FX.text(e.x, e.y - 84, '格挡', '#c8d0d8', 18, 0.6);
        // obsidian shields bite back
        if (e.stats.thorns && this.hurt(e.stats.thorns * (1 + G.step * 0.04), -f * 240, -140, { stun: 0.12 })) { FX.burst(e.x + e.face * 12, e.y - 40, { n: 10, speed: 260, size: 1, color: 'f5', color2: 'f3', grav: 400, life: 0.4, water: false }); FX.text(this.x, this.y - 84, '反刺', '#ff9a7a', 16, 0.6); UI.pulse('hurt'); }
        continue;
      }
      if (guarding && Math.sign(this.x - e.x) === e.face && d.heavy) { e.blocking = false; e.guardT = 0; e.guardBreak = 1.4; FX.text(e.x, e.y - 84, '破防', '#ffd46a', 20, 0.7); Sfx.play('clang', e.pan(), 0.8); }
      const marked = e.marked > 0, crit = marked || Math.random() < this.critChance(d, A), cm = crit ? 2 : 1; if (marked) { e.marked = 0; FX.text(e.x, e.y - 100, '标记暴击', '#ff9a7a', 18, 0.8); }
      e.hurt(dmg * mul * cm, f * d.kx * (crit ? 1.35 : 1), d.ky * (crit ? 1.2 : 1), { stun: d.heavy || crit ? 0.7 : 0.38 });
      if (crit) critFX(cx, cy - 16, dmg * mul * cm);
      // elites don't stay stun-locked: after two quick light hits they shake it off and raise their guard for the third
      if (e.stats.elite && !d.heavy) { e.chain = G.t - (e.lastHitT ?? -9) < 0.9 ? (e.chain || 0) + 1 : 1; e.lastHitT = G.t; if (e.chain >= 2 && Math.random() < 0.35 + e.stats.guard * 0.5) { e.stun = Math.min(e.stun, 0.14); e.guardT = 0.7; e.chain = 0; } }
      e.spin = d.heavy ? f * 0.4 : 0;
      connect(cx, cy, d.heavy, e);
      if (d.finisher && e.hp > 0) Bon.coopDive(e);
      if (this.weapon === 'cutlass' && e.hp > 0) { e.bleedN = Math.min(3 + (G.ups.cutlass || 0), (e.bleedN || 0) + 1); e.bleedT = 3.2; }
      if (d.onHit) d.onHit(this, e, dmg * mul * cm, G);
      Sfx.play(d.heavy ? 'heavy' : 'hit', e.pan());
      if (d.charged) Sfx.play('crack', e.pan(), 0.6);
      if (e.hp <= 0) G.kill(e, this);
    }
    const tip = this.tipWorld();
    if (this.ship === G.player) for (const fr of G.fires) { const lo = G.player.toLocal(tip.x, tip.y).x; if (!A.hit.has(fr) && Math.abs(lo - fr.lx) < fr.w + 10) { A.hit.add(fr); fr.t -= 2.6; FX.burst(tip.x, tip.y, { n: 8, speed: 120, size: 3, color: 'm2', grav: -80, life: 0.8, kind: 'smoke', water: false }); if (fr.t <= 0) FX.text(tip.x, tip.y - 30, '扑灭', '#9fe8b0', 18, 0.7); } }
    for (const h of G.hawks) {
      if (h.dead || A.hit.has(h)) continue;
      const rx = (h.x - sh.x) * f, ry = h.y - sh.y, dist = Math.hypot(rx, ry), psi = Math.atan2(ry, rx);
      if (dist < 20 || (dist <= reach + 14 && inArc(psi, a0, a1, 0.5))) { A.hit.add(h); h.hurt(dmg * (d.heavy ? 1.5 : 1), f); connect(h.x, h.y, d.heavy, null); Sfx.play('hit', 0, 0.8); }
    }
    if (G.boss && !A.hit.has(G.boss)) { const mid = { x: (tip.x + sh.x) / 2, y: (tip.y + sh.y) / 2 }, bc = Math.random() < this.critChance(d, A), bd = dmg * (d.heavy ? 1.3 : 1) * (bc ? 2 : 1); if (G.boss.hitAt(tip.x, tip.y, bd, G, 'cap') || G.boss.hitAt(mid.x, mid.y, bd, G, 'cap')) { A.hit.add(G.boss); connect(tip.x, tip.y, true, null); if (bc) critFX(tip.x, tip.y - 20, bd); } }
    const kc = Math.random() < this.critChance(d, A);
    if (G.kraken && !A.hit.has(G.kraken) && G.kraken.meleeHit(tip.x, tip.y, reach, dmg * (kc ? 2 : 1), G)) { if (kc) critFX(tip.x, tip.y - 30, dmg * 2 * 1.4); A.hit.add(G.kraken); connect(tip.x, tip.y, true, null); }
    for (const tn of G.tentacles) {
      if (A.hit.has(tn)) continue;
      const p = tn.hitPoint(tip.x, tip.y, 30) || tn.hitPoint((tip.x + sh.x) / 2, (tip.y + sh.y) / 2, 26);
      if (p) { A.hit.add(tn); const tc = Math.random() < this.critChance(d, A); tn.damage(dmg * (d.heavy ? 1.3 : 1) * (tc ? 2 : 1), G); if (tc) critFX(p.x, p.y - 10, dmg * (d.heavy ? 1.3 : 1) * 2); connect(p.x, p.y, d.heavy, tn); Sfx.play('heavy', 0, 0.8); FX.burst(p.x, p.y, { n: 12, speed: 380, size: 2, color: 'k5', color2: 'k3', life: 0.6 }); }
    }
    for (const s of G.ships) {
      if (s.team === 'player' || !s.mast || s.mast.cut || A.hit.has(s) || this.ship !== s) continue;
      const lo = s.toLocal(tip.x, tip.y); if (Math.abs(lo.x) < 40 && lo.y < -40) { A.hit.add(s); G.hitMast(s, dmg * 0.9); connect(tip.x, tip.y, d.heavy, null); }
    }
  }
  attachRope(anchor, G) {
    const a = anchor.anchor(); if (!a) return;
    const len = Math.max(70, Math.hypot(this.x - a.x, this.y - 46 * this.scale - a.y));
    this.onRope = { ...anchor, len, climb: anchor.climb };
    if (!this.air) { this.launch(this.vx, this.vy - 260); }
    if (this.water) { this.water = false; this.air = true; this.vy = -300; FX.splash(this.x, 0.8); }
    this.air = true; Sfx.play('hook', this.pan()); FX.sparks(a.x, a.y, 6);
    this.onRope.len = Math.min(len, this.ropeRange); this.onRope.t = 0; this.onRope.reel = true;
    // the swing's lowest point must clear the decks, so a long rope is reeled in quickly first
    this.onRope.maxLen = Math.max(70, -70 - a.y);
    // a hard yank toward the anchor starts the swing
    const dx = a.x - this.x, dy = a.y - (this.y - 46), d = Math.hypot(dx, dy) || 1;
    this.vx += (dx / d) * 430; this.vy += (dy / d) * 430 - 120; }
  /* a quick vault from the water onto a deck */
  updateClimb(dt, G) {
    const c = this.climb, s = c.ship; c.t += dt; const k = Math.min(1, c.t / 0.34);
    if (s.sunk || !G.ships.includes(s)) { this.climb = null; this.launch(0, 0); return; }
    const to = s.toWorld(c.lx, s.deckY(c.lx)), e = smooth(k);
    this.x = lerp(c.x0, to.x, e); this.y = lerp(c.y0, to.y, e) - Math.sin(k * Math.PI) * 34; this.vx = 0; this.vy = 0;
    this.crouch = 1 - k; this.weaponA = damp(this.weaponA, 2.0 - HALF_PI, 10, dt); this.anim += dt;
    if (Math.random() < 0.6) FX.burst(this.x, this.y - 10, { n: 1, angle: Math.PI / 2, spread: 0.5, speed: 60, size: 1, color: 'n7', grav: 600, life: 0.4 });
    if (k >= 1) { this.climb = null; this.land(s, c.lx); this.iframes = Math.max(this.iframes, 0.35); this.squash = 0.2; Sfx.play('step', this.pan(), 1); }
  }
  updateMounted(dt, G) {
    const b = this.mounted, s = G.player, m = Input.mouse;
    this.lx = b.lx - 34 * (b.face || 1); this.vu = 0; this.air = false; this.ship = s; this.syncToShip();
    this.face = m.x >= this.x ? 1 : -1; this.weaponA = 0.9; this.crouch = 0.4;
    const p = s.toWorld(b.lx, s.deckY(b.lx) - 30);
    b.aim = Math.atan2(m.y - p.y, m.x - p.x); b.face = Math.cos(b.aim) >= 0 ? 1 : -1;
    if (m.l) { b.pull = Math.min(1, (b.pull || 0) + dt * 1.6); }
    if (m.lr && b.cd <= 0) { G.fireBallista(b, 0.6 + (b.pull || 0) * 0.9, true); b.pull = 0; }
    if (Input.tap('e', 'E') || Input.tap(' ', 'w')) { this.mounted = null; b.manned = false; if (Input.tap(' ', 'w')) this.launch(this.vx, this.vy - 600); }
    if (this.hp <= 0) { this.mounted = null; b.manned = false; this.knockOut(G); }
    this.anim += dt;
  }
  drawRope(ctx) {}
}
function ropeLine(ctx, x1, y1, x2, y2, sag) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + Math.hypot(x2 - x1, y2 - y1) * sag, n = Math.max(4, Math.round(Math.hypot(x2 - x1, y2 - y1) * S / 3));
  let px = Cam.bx(x1), py = Cam.by(y1);
  for (let i = 1; i <= n; i++) {
    const u = i / n, x = (1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * mx + u * u * x2, y = (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * my + u * u * y2;
    const bx = Cam.bx(x), by = Cam.by(y); P.line(ctx, px, py + 1, bx, by + 1, C.w1, 1); P.line(ctx, px, py, bx, by, C.b1, 1); px = bx; py = by;
  }
}

/* ---------------- enemies ---------------- */
class Enemy extends Actor {
  constructor(o) {
    super(o);
    const hpMul = o.hpMul || 1; this.hp = this.max = Math.round(this.stats.hp * hpMul);
    Object.assign(this, { cool: rand(0.4, 1.4), phase: 'move', pt: 0, target: null, blocking: false, guardBreak: 0, throwCd: rand(1.5, 3.5), value: o.value ?? 6, swingPath: null, sinkT: 0, walkV: 0 });
  }
  update(dt, G) {
    if (this.water) { this.sinkT += dt; this.y += 30 * dt; if (this.sinkT > 1.3) this.gone = true; this.x -= Sea.speed * 0.15 * dt; return; }
    if (this.dead && !this.air) { this.sinkT += dt; if (this.sinkT > 0.9) this.gone = true; this.physics(dt, G.ships, 0); return; }
    this.guardBreak = Math.max(0, this.guardBreak - dt);
    if (this.rope && this.rope.busy()) this.rope.update(dt, G);
    if (this.swingPath) return this.followSwing(dt, G);
    if (this.ship && !G.ships.includes(this.ship)) { const s = this.ship; this.launch(this.vx, this.vy - 100); this.lastGround = null; void s; }
    if (this.stun > 0 || this.air) {
      this.stun -= dt; this.phase = 'move'; this.blocking = false; this.smear = null; this.atkLean = 0; this.atkStep = 0;
      if (!this.air && this.ship && Math.abs(this.vu) > 160 && Math.random() < 0.6) FX.burst(this.x - Math.sign(this.vu) * 4, this.y - 1, { n: 1, angle: -Math.PI / 2 - Math.sign(this.vu) * 0.8, spread: 0.4, speed: 70, size: 1, color: 'w5', color2: 'b1', grav: 500, life: 0.3 });
      if (this.air && Math.hypot(this.vx, this.vy) > 650) FX.burst(this.cx, this.cy, { n: 1, speed: 0, size: 2, color: 'b3', color2: 'n6', grav: 0, life: 0.22, jit: 3, water: false });
      this.weaponA = damp(this.weaponA, this.air ? 2.4 : 1.2, 6, dt);
      this.physics(dt, G.ships, 0); this.walkV = 0;
      if (!this.air) this.spin = 0; else this.spin = (this.spin || 0) + dt * 3 * Math.sign(this.vx || 1);
      return;
    }
    this.spin = 0;
    const cap = G.captain, ps = G.player;
    let move = 0;
    // on an enemy vessel, not with the captain: throw, board or wait
    if (this.ship && this.ship !== ps && cap.ship !== this.ship) {
      const s = this.ship;
      if (this.stats.leaper && G.state === 'fight' && (this.leapCd = (this.leapCd ?? rand(0.6, 1.8)) - dt) <= 0 && Math.abs(this.x - ps.x) < 1000) { this.leapCd = 99; this.leapTo(G, ps); FX.text(this.x, this.y - 80, '嗷呜！', '#c8d0d8', 16, 0.7); return; }
      this.face = Math.sign(ps.x - this.x) || 1;
      if (s.kind === 'skiff') {
        if (this.role === 'thrower' && (this.skiffT = (this.skiffT || 0) + dt) < 14) { if (s.docked || Math.abs(s.x - ps.x) < 700) this.rangedAttack(dt, G, cap); }
        else { if (s.docked) this.leapTo(G, ps); this.weaponA = damp(this.weaponA, 0.6, 5, dt); }
        this.walkV = 0; this.physics(dt, G.ships, 0); return;
      }
      if (this.stats.ranged || this.role === 'thrower') this.rangedAttack(dt, G, cap); else if (this.role === 'boarder' && G.boardReady(s, this)) { this.startBoard(G, s); return; }
      else this.weaponA = damp(this.weaponA, 0.5, 4, dt);
      // shuffle toward the near rail
      const want = clamp(s.toLocal(ps.x, ps.y).x * 0.5, -s.walk + 20, s.walk - 20);
      move = Math.abs(want - this.lx) > 20 ? Math.sign(want - this.lx) * 0.4 : 0;
      this.physics(dt, G.ships, move); this.walkV = this.vu; this.anim += dt * (Math.abs(this.vu) * 0.045 + 1); return;
    }
    // on the same deck as a target
    const onCapShip = (cap.ship === this.ship || (cap.air && cap.lastGround === this.ship && Math.abs(cap.x - this.x) < 700)) && cap.down <= 0 && !cap.water;
    let tx = null, tgt = null;
    if (onCapShip) { tx = cap.x; tgt = cap; }
    else if (this.ship === ps) { const m = G.nearestModule(this); if (m) { tgt = m; tx = ps.toWorld(m.lx, 0).x; } else { tgt = 'hull'; tx = ps.toWorld(this.hullSpot ??= rand(-120, 120), 0).x; } }
    if (tx === null) { this.physics(dt, G.ships, 0); return; }
    const dx = tx - this.x, dist = Math.abs(dx);
    // walls block the way
    const wall = this.ship === ps ? G.wallBetween(this, tx) : null;
    if (wall) { tgt = wall; }
    const reach = this.stats.reach * this.scale;
    const tDist = wall ? Math.abs(ps.toWorld(wall.lx, 0).x - this.x) : dist;
    if (this.phase === 'move') {
      this.face = Math.sign(wall ? ps.toWorld(wall.lx, 0).x - this.x : dx) || this.face;
      const st = this.stats, elite = !!st.elite, vsCap = tgt === cap && !wall;
      this.cool -= dt; this.waitT = (this.waitT || 0) + dt;
      if (!vsCap) { if (tDist > reach * 0.8) move = this.face; }
      else {
        // an attack slot: at most two raiders swing at the captain at once, the rest keep their distance
        const token = G.attackToken(this), hold = reach * (elite ? 1.3 : 1.1) + 14;
        if (elite && cap.charging && cap.charge > 0.25 && tDist < reach + 110) move = -this.face * 1.3;            // back off from a charged sweep
        else if (!token) { if (tDist < hold - 18) move = -this.face * 0.6; else if (tDist > hold + 30) move = this.face * 0.8; }
        else if (tDist > reach * 0.8) move = this.face;
        // elites won't fight with their backs to the rail
        if (elite && this.ship && this.ship.walk - Math.abs(this.lx) < 46 && tDist < reach + 70) move = -Math.sign(this.lx) * 0.9;
        // read the captain's swing and guard against it
        if (elite && cap.atk && !cap.atk.read?.has(this) && tDist < reach + 50 && this.guardBreak <= 0) {
          (cap.atk.read ??= new Set()).add(this);
          if (!st.block && Math.random() < st.guard) { this.guardT = 0.42; }
        }
        // strike into openings: while the captain recovers from a swing, or after waiting a while
        if (st.style === 'bomb') { if (!this.fuse && tDist < 70) { this.fuse = 1.25; Sfx.play('fire', this.pan(), 0.7); FX.text(this.x, this.y - 70, '嘶——', '#ffb050', 16, 0.8); } if (this.fuse) move = 0; }
        const opening = !cap.atk || cap.atk.t > cap.atk.def.hit[1] + 0.04;
        if (st.style !== 'bomb' && tDist <= reach && this.cool <= 0 && token && (opening || !elite || this.waitT > 2.2)) this.wantAttack = true;
      }
      this.guardT = Math.max(0, (this.guardT || 0) - dt);
      this.blocking = (!!st.block && this.guardBreak <= 0 && vsCap) || this.guardT > 0;
      if ((this.wantAttack || (!vsCap && tDist <= reach && this.cool <= 0))) {
        this.wantAttack = false; this.waitT = 0; this.phase = 'wind'; this.pt = 0; Sfx.play('grunt', this.pan(), 0.6); this.bossMove = this.stats.style === 'boss' ? ((this.bossN = (this.bossN || 0) + 1) % 3 === 0 ? 'slam' : 'swing') : this.stats.style === 'troll' ? 'slam' : null; }
      if (this.stats.style === 'boss' && tgt === cap && tDist > 200 && tDist < 520 && (this.chargeCd = (this.chargeCd ?? 3) - dt) <= 0) { this.phase = 'wind'; this.pt = 0; this.bossMove = 'charge'; this.chargeCd = rand(5, 8); Sfx.play('roar', this.pan(), 0.35); }
      this.weaponA = damp(this.weaponA, this.guardT > 0 && !this.stats.block ? -1.1 - HALF_PI : this.blocking ? 0.2 : 0.5, this.guardT > 0 ? 18 : 6, dt);
    } else if (this.phase === 'wind') {
      this.pt += dt; this.blocking = false; const style = this.stats.style, bm = this.bossMove;
      const w = (bm === 'slam' ? 0.85 : bm === 'charge' ? 0.6 : this.stats.wind) * (this.counter ? 0.45 : 1);
      if (style === 'thrust') { this.weaponA = damp(this.weaponA, -0.05 - HALF_PI, 12, dt); this.atkLean = damp(this.atkLean || 0, -3, 10, dt); this.atkStep = damp(this.atkStep || 0, -2, 10, dt); }
      else if (style === 'grab') { this.weaponA = damp(this.weaponA, 0.2 - HALF_PI, 10, dt); this.atkLean = damp(this.atkLean || 0, -3, 10, dt); }
      else if (bm === 'charge') { this.weaponA = damp(this.weaponA, 0.3 - HALF_PI, 8, dt); this.atkLean = damp(this.atkLean || 0, 3, 8, dt); this.atkCrouch = 0.7; }
      else { this.weaponA = damp(this.weaponA, (bm === 'slam' ? -2.7 : -2.2) - HALF_PI, 10, dt); this.atkLean = damp(this.atkLean || 0, bm === 'slam' ? -3 : -2, 10, dt); if (bm === 'slam') this.atkCrouch = 0.5; }
      this.tell = this.pt > w - 0.22 ? 1 : 0;
      if (this.pt >= w) {
        this.phase = 'strike'; this.pt = 0; Sfx.play(bm ? 'swingBig' : 'swing', this.pan(), 0.8);
        this.vu += this.face * (style === 'thrust' ? 300 : style === 'grab' ? 460 : bm === 'charge' ? 560 : 120); this.atkCrouch = 0;
      }
    } else if (this.phase === 'strike') {
      this.pt += dt; this.tell = 0; const ea = (u) => 1 - Math.pow(1 - clamp(u, 0, 1), 3), style = this.stats.style, bm = this.bossMove;
      const dur = bm === 'charge' ? 0.5 : bm === 'slam' ? 0.22 : 0.16;
      if (style === 'thrust') { this.weaponA = -HALF_PI; this.atkLean = lerp(-3, 4, ea(this.pt / 0.08)); this.atkStep = lerp(-2, 5, ea(this.pt / 0.08)); this.smear = this.pt < 0.14 ? { from: -0.06, to: 0.06, r: 46, heavy: false, k: 1 - this.pt / 0.14 } : null; }
      else if (style === 'grab') { this.weaponA = -HALF_PI - 0.2; this.atkLean = 4; this.smear = null; }
      else if (bm === 'charge') { this.weaponA = 0.3 - HALF_PI; this.atkLean = 3; if (Math.random() < 0.7) FX.burst(this.x - this.face * 8, this.y - 2, { n: 2, angle: -Math.PI / 2 - this.face, spread: 0.5, speed: 120, size: 1, color: 'w5', grav: 600, life: 0.3 }); this.vu = this.face * 560; }
      else { const a0 = bm === 'slam' ? -2.7 : -2.2, a1 = bm === 'slam' ? 1.2 : 0.8; this.weaponA = lerp(a0, a1, ea(this.pt / 0.1)) - HALF_PI; this.atkLean = lerp(-2, 3, ea(this.pt / 0.1)); this.atkStep = 2;
        this.smear = this.pt < 0.16 ? { from: lerp(a0, a1, ea((this.pt - 0.05) / 0.1)), to: this.weaponA + HALF_PI, r: style === 'troll' ? 60 : style === 'boss' ? 40 : 30, heavy: this.type === 'berserker' || style === 'boss' || style === 'troll', k: 1 - Math.max(0, this.pt - 0.1) / 0.06 } : null; }
      if (bm === 'charge') { if (!this.struck && Math.abs(cap.x - this.x) < 50 && cap.ship === this.ship && !cap.air) { this.struck = true; G.enemyStrike(this, cap, { kx: 700, ky: -380, dmg: 18 }); } }
      else if (!this.struck && this.pt > 0.06) { this.struck = true; if (bm === 'slam') G.shockwave(this); else G.enemyStrike(this, tgt); }
      if (this.pt > dur) { this.phase = 'recover'; this.pt = 0; this.struck = false; this.smear = null; this.counter = false; }
    } else if (this.phase === 'recover') {
      this.pt += dt; this.weaponA = damp(this.weaponA, 0.3, 5, dt); this.atkLean = damp(this.atkLean || 0, 0, 6, dt); this.atkStep = damp(this.atkStep || 0, 0, 6, dt);
      if (this.pt > 0.45) { this.phase = 'move'; this.cool = rand(0.35, 1.1); }
    }
    if (this.stats.style === 'grab') this.crouch = 1;
    const light = G.lightAt(this.x, this.y - 30);
    const slow = this.stats.undead && light > 0.35 ? 0.6 : 1;
    this.physics(dt, G.ships, move * slow, false);
    this.walkV = this.vu; this.anim += dt * (Math.abs(this.vu) * 0.045 + 1);
  }
  rangedAttack(dt, G, cap) {
    const shot = this.stats.shot || 'axe', SP = SHOTS[shot], bow = shot === 'arrow' || (SP && SP.bow), wind = shot === 'hook' ? 1.0 : bow ? 0.75 : SP ? SP.wind : 0.55;
    if (this.rope && this.rope.busy()) { this.spinHook = 0; return; }
    if (this.x < Cam.viewL() + 30 || this.x > Cam.viewR() - 30) { this.throwCd = Math.max(this.throwCd, 1.2); this.tell = 0; this.nock = 0; this.spinHook = 0; return; }
    this.throwCd -= dt; this.nock = 0; this.spinHook = 0;
    const dx = (cap.x - this.x) * this.face, dy = cap.y - 40 - (this.y - 40), aim = Math.atan2(dy, Math.max(20, dx));
    if (this.throwCd < wind) {
      const u = 1 - this.throwCd / wind; this.tell = u > 0.6 ? 1 : 0;
      if (bow) { this.weaponA = aim - 0.25 - HALF_PI; this.nock = u; this.atkLean = -1; }
      else if (SP) { this.weaponA = damp(this.weaponA, -2.9 - HALF_PI, 8, dt); this.atkLean = -1; if (Math.random() < 0.6) FX.burst(this.x + this.face * 4, this.y - 80 * this.scale, { n: 1, speed: 50, size: 1, color: SP.col || 'f5', grav: -40, life: 0.3, water: false }); }
      else if (shot === 'hook') { this.spinHook = u * 22; this.weaponA = damp(this.weaponA, -2.6 - HALF_PI, 8, dt); }
      else { this.weaponA = damp(this.weaponA, -2.3 - HALF_PI, 10, dt); this.atkLean = -2; if (shot === 'pot' && Math.random() < 0.5) FX.burst(this.x - this.face * 6, this.y - 76, { n: 1, speed: 40, size: 1, color: 'f5', grav: -60, life: 0.2, water: false }); }
    } else { this.weaponA = damp(this.weaponA, bow ? aim - HALF_PI : 0.5, 4, dt); this.atkLean = damp(this.atkLean || 0, 0, 6, dt); }
    if (this.throwCd <= 0) {
      this.tell = 0; this.atkLean = 2;
      if (SP) { this.throwCd = rand(SP.cd[0], SP.cd[1]); SP.fire(G, this, cap); this.weaponA = bow ? aim - HALF_PI : 0.8 - HALF_PI; }
      else if (shot === 'arrow') { this.throwCd = rand(2.4, 3.2); G.shootArrow(this, cap); }
      else if (shot === 'pot') { this.throwCd = rand(3.4, 4.6); G.throwPot(this, cap); this.weaponA = 0.8 - HALF_PI; }
      else if (shot === 'ice') { this.throwCd = rand(3, 4.2); G.throwIce(this, cap); this.weaponA = 0.8 - HALF_PI; }
      else if (shot === 'hawk') { this.throwCd = rand(5.5, 7.5); G.releaseHawk(this); this.weaponA = -2.6 - HALF_PI; }
      else if (shot === 'hook') { this.throwCd = rand(5.5, 7); this.rope = this.rope || new Rope(this); this.rope.throwAt(G, cap.cx + cap.vx * 0.25, cap.cy, 560); Sfx.play('rope', this.pan()); }
      else { this.throwCd = rand(2.2, 3.4); G.throwAxe(this, cap); this.weaponA = -1.2; }
    }
  }
  onHookCaptain(cap, G) {
    if (cap.brace || cap.dodge > 0 || cap.iframes > 0 || cap.mounted) { FX.text(cap.x, cap.y - 90, '扎稳了！', '#9fe8b0', 20, 0.8); Sfx.play('clang', cap.pan(), 0.6); return; }
    const dir = Math.sign(this.x - cap.x) || 1; cap.onRope = null; cap.atk = null;
    cap.launch(dir * 640, -470); cap.hurt(5, 0, 0, { stun: 0 });
    FX.text(cap.x, cap.y - 90, '被钩住了！', '#ff9a7a', 22, 1); Sfx.play('hook', cap.pan()); FX.stop(0.06); UI.pulse('hurt');
  }
  startBoard(G, from) {
    const ps = G.player, side = Math.sign(ps.x - from.x);
    const yard = { lx: from.yardW() * side, ly: YARD_Y };
    const land = clamp(rand(0.15, 0.85) * ps.walk * -side, -ps.walk + 10, ps.walk - 10);
    this.swingPath = { t: 0, dur: rand(1.0, 1.25), from, yard, p0: { x: this.x, y: this.y }, landLx: land, ship: ps };
    this.ship = null; this.air = true; Sfx.play('rope', this.pan(), 0.7); this.face = side;
  }
  leapTo(G, ps) {
    const s = this.ship, side = Math.sign(s.x - ps.x) || 1;
    const land = side * rand(ps.walk * 0.55, ps.walk - 10);
    this.swingPath = { t: 0, dur: rand(0.55, 0.75), leap: true, p0: { x: this.x, y: this.y }, landLx: land, ship: ps };
    this.ship = null; this.air = true; this.face = -side; Sfx.play('jump', this.pan());
  }
  followSwing(dt, G) {
    const P = this.swingPath; P.t += dt; const k = clamp(P.t / P.dur, 0, 1), s = P.ship;
    const end = s.toWorld(P.landLx, s.deckY(P.landLx));
    let x, y;
    if (P.leap) { x = lerp(P.p0.x, end.x, k); y = lerp(P.p0.y, end.y, k) - Math.sin(k * Math.PI) * 170; }
    else {
      const a = P.from.sunk ? null : P.from.toWorld(P.yard.lx, P.yard.ly);
      if (!a) { this.swingPath = null; this.launch(this.vx, this.vy); return; }
      const c = { x: (P.p0.x + end.x) / 2, y: Math.max(P.p0.y, end.y) + 90 };
      x = (1 - k) * (1 - k) * P.p0.x + 2 * (1 - k) * k * c.x + k * k * end.x; y = (1 - k) * (1 - k) * P.p0.y + 2 * (1 - k) * k * c.y + k * k * end.y - Math.sin(k * Math.PI) * 60;
      P.anchor = a;
    }
    this.vx = (x - this.x) / Math.max(dt, 1e-3); this.vy = (y - this.y) / Math.max(dt, 1e-3); this.x = x; this.y = y;
    this.weaponA = damp(this.weaponA, 2.4, 6, dt); this.spin = 0;
    if (k >= 1) { this.swingPath = null; this.land(s, P.landLx); this.stun = 0.15; }
  }
  drawRope(ctx) { if (this.swingPath && this.swingPath.anchor) ropeLine(ctx, this.x, this.y - 56 * this.scale, this.swingPath.anchor.x, this.swingPath.anchor.y, 0.02); if (this.rope) this.rope.draw(ctx, G.t); }
}

/* ---------------- projectiles ---------------- */
class Projectile {
  constructor(o) { Object.assign(this, { x: 0, y: 0, vx: 0, vy: 0, dmg: 10, team: 'player', kind: 'bolt', life: 3, hitSet: new Set(), grav: 380, spin: 0, a: 0, pierce: 0, dead: false }, o); }
  update(dt, G) {
    this.life -= dt; if (this.life <= 0) this.dead = true;
    if (this.tick) this.tick(this, dt, G);
    if (this.kind === 'pot') this.a += dt * 9;
    this.vy += this.grav * dt; if (!this.float) this.vx += WIND.v * (this.kind === 'bolt' ? 90 : 60) * dt;
    const steps = 3;
    for (let s = 0; s < steps && !this.dead; s++) {
      this.x += this.vx * dt / steps; this.y += this.vy * dt / steps; this.a = this.kind === 'axe' ? this.a + dt * 18 / steps : Math.atan2(this.vy, this.vx);
      if (this.hit) this.hit(this, G); else if (this.team === 'player') G.boltHits(this); else G.enemyShotHits(this);
      if (!this.float && this.y > Sea.height(this.x) + 4 && !this.dead) { this.dead = true; FX.splash(this.x, 0.35); if (this.onSea) this.onSea(this); }
    }
    if (this.kind === 'bolt' && Math.random() < 0.5) FX.burst(this.x, this.y, { n: 1, speed: 10, size: 3, color: 'm4', grav: -20, life: 0.3, kind: 'mist', water: false });
  }
  draw(ctx) {
    const bx = Cam.bx(this.x), by = Cam.by(this.y);
    if (this.kind === 'bolt') {
      const c = Math.cos(this.a), sn = Math.sin(this.a);
      if (this.crit) { P.line(ctx, bx - c * 22, by - sn * 22, bx, by, C.f4, 3); if (Math.random() < 0.7) FX.burst(this.x, this.y, { n: 1, speed: 30, size: 1, color: 'gold', grav: 0, life: 0.25, water: false }); FX.light(this.x, this.y, 70, [255, 210, 110], 0.8); }
      P.line(ctx, bx - c * 16, by - sn * 16, bx, by, C[this.crit ? 'gold' : this.hot ? 'f4' : 'w4'], 1);
      P.line(ctx, bx, by, bx + c * 3, by + sn * 3, C.m4, 2);
      P.dot(ctx, bx - c * 16, by - sn * 16 - 1, C.b3); P.dot(ctx, bx - c * 15, by - sn * 15 + 1, C.b3);
      if (this.hot) P.dot(ctx, bx - c * 8, by - sn * 8, C.f6);
    } else if (this.kind === 'arrow') blitRot(ctx, SPR.arrow, bx, by, Math.atan2(this.vy, this.vx) - HALF_PI, 1, 6);
    else if (this.kind === 'pellet') { const c = Math.cos(this.a), sn = Math.sin(this.a); P.line(ctx, bx - c * 5, by - sn * 5, bx, by, C[this.crit ? 'gold' : 'm4'], 1); P.dot(ctx, bx, by, C[this.fire ? 'f5' : 'b4']); }
    else if (this.kind === 'ice') { P.disc(ctx, bx, by, 4, C.ink); P.disc(ctx, bx, by, 3, C.n8); P.dot(ctx, bx - 1, by - 1, C.white, 2); if (Math.random() < 0.7) FX.burst(this.x, this.y, { n: 1, speed: 20, size: 1, color: 'b4', grav: 0, life: 0.3, water: false }); FX.light(this.x, this.y, 60, [150, 220, 255], 0.7); }
    else if (this.kind === 'pot') { blitRot(ctx, SPR.pot, bx, by, this.a, 3, 4); if (Math.random() < 0.6) FX.burst(this.x, this.y - 6, { n: 1, speed: 20, size: 1, color: 'f5', grav: -40, life: 0.2, water: false }); }
    else if (PROJ_DRAW[this.kind]) PROJ_DRAW[this.kind](ctx, this, bx, by);
    else blitRot(ctx, SPR.axe, bx, by, this.a, 1, 6);
  }
}

/* ---------------- deck modules ---------------- */
const MODULES = {
  ballista: { name: '弩炮', cost: 60, hp: 70, desc: '自动射击敌船、小艇、触手和海妖的眼睛。' },
  wall: { name: '盾墙', cost: 25, hp: 130, desc: '拦住敌人，也挡飞斧和触手。' },
  brazier: { name: '火盆', cost: 30, hp: 60, desc: '光里的敌人更怕打，亡灵变慢，触手避开火光。' },
};
sprite('ballista_base', [
  '......mm......',
  '.....wWWw.....',
  '....wW..Ww....',
  '...wW....Ww...',
  '..wW......Ww..',
  '.wW........Ww.',
  'wWWWWWWWWWWWWw',
  'ww..........ww',
], { w: 'w1', W: 'w4', m: 'm3' });
sprite('ballista_arm', [
  '....................b.....',
  '..................bbW.....',
  '.................bW.s.....',
  '................bW..s.....',
  '...............bW...s.....',
  'SSSSSSSSSSSSSSSSSSSSSSSmmM',
  'wwwwwwwwwwwwwwwwwwwww.....',
  '...............bW...s.....',
  '................bW..s.....',
  '.................bW.s.....',
  '..................bbW.....',
  '....................b.....',
], { b: 'w2', W: 'w5', s: 'b3', S: 'w5', w: 'w2', m: 'm3', M: 'm4' });
recolor('ballista_arm2', 'ballista_arm', { W: 'gold', b: 'm1' });
sprite('brazier', [
  '.mmmmmmmmmm.',
  '.mMMMMMMMMm.',
  '..mmmmmmmm..',
  '.....mm.....',
  '....m.mm....',
  '...m..m.m...',
  '..m...m..m..',
  '.m....m...m.',
  'm.....m....m',
], { m: 'm0', M: 'm2' });
(function wallSprite() {
  const c = offscreen(26, 24), g = c.getContext('2d');
  g.fillStyle = C.w1; g.fillRect(3, 12, 2, 12); g.fillRect(21, 12, 2, 12); g.fillStyle = C.w3; g.fillRect(3, 12, 1, 12); g.fillRect(21, 12, 1, 12);
  const cols = [['r2', 'b3'], ['b3', 'r2'], ['n4', 'b2']];
  cols.forEach((p, i) => { const sp = sprite('wall_sh' + i, ['...aaaa...', '..abbbba..', '.abbabbba.', 'abbbabbbba', 'abbamabbba', 'abbbabbbba', '.abbabbba.', '..abbbba..', '...aaaa...'], { a: 'ink', b: p[0], m: 'm3' }); g.drawImage(sp, 1 + i * 7, 4 + (i % 2) * 3); });
  SPR.wall = c;
})();


/* four hand-drawn flame frames (7 x 12) */
const FLAME_F = [
  ['...a...', '...a...', '..aa...', '..aba..', '.abba..', '.abbba.', 'abbcbba', 'abccbba', 'abcdcba', '.bcdcb.', '.bbcbb.', '..aaa..'],
  ['....a..', '...aa..', '...ab..', '..abba.', '..abba.', '.abbcba', 'abbccba', 'abccdba', 'abcddba', '.bcdcb.', '.bbcbb.', '..aaa..'],
  ['..a....', '..aa...', '.aba...', '.abba..', '.abbba.', 'abbcba.', 'abccbba', 'abcdcba', 'abcdcba', '.bcdcb.', '.bbcbb.', '..aaa..'],
  ['.......', '...a...', '..aba..', '..aba..', '.abbba.', '.abcba.', 'abbcbba', 'abccbba', 'abcdcba', '.bcdcb.', '.bbcbb.', '..aaa..'],
];
FLAME_F.forEach((rows, i) => { sprite('flame' + i, rows, { a: 'f2', b: 'f3', c: 'f4', d: 'f6' }); sprite('gflame' + i, rows, { a: 'd2', b: 'g1', c: 'g2', d: 'g3' }); });
function drawFlame(ctx, x, y, t, seed, ghost = false) {
  const fr = ((Math.floor(t * 10 + seed * 7) % 4) + 4) % 4, img = SPR[(ghost ? 'gflame' : 'flame') + fr];
  blit(ctx, img, x - 3 + (Math.abs(Math.floor(t * 5 + seed)) % 2 ? 0 : -1), y - 12);
  if (Math.floor(t * 7 + seed) % 3 === 0) P.dot(ctx, x + (fr % 3) - 1, y - 14 - (fr % 2), C[ghost ? 'g2' : 'f5']);
}

function drawModule(ctx, s, m, t) {
  const p = s.toWorld(m.lx, s.deckY(m.lx)), bx = Cam.bx(p.x), by = Cam.by(p.y), a = s.a;
  const put = (img, px, py, rot = a) => blitRot(ctx, img, bx, by, rot, px, py);
  if (m.type === 'ballista') {
    put(SPR.ballista_base, 7, 8);
    const pv = s.toWorld(m.lx, s.deckY(m.lx) - 16), fl = Math.cos(m.aim) < 0, pull = Math.round((m.pull || 0) * 3) + Math.round((m.recoil || 0) * 2);
    const U = m.ups || {}, ax = Cam.bx(pv.x), ay = Cam.by(pv.y), ra = fl ? Math.PI - m.aim : m.aim;
    blitRot(ctx, SPR[U.arm ? 'ballista_arm2' : 'ballista_arm'], ax, ay, ra, 9 + pull, 5, fl);
    const tipx = ax + Math.cos(m.aim) * 16, tipy = ay + Math.sin(m.aim) * 16;
    if (U.twin && m.cd <= 0.3) { const nx = -Math.sin(m.aim) * 2, ny = Math.cos(m.aim) * 2; P.line(ctx, ax + nx, ay + ny, tipx + nx, tipy + ny, C.m4, 1); }
    if (U.fire && m.cd <= 0.3) { P.dot(ctx, tipx, tipy, C[Math.floor(t * 12) % 2 ? 'f5' : 'f4'], 2); }
    if (U.harp) { const q = s.toWorld(m.lx - 8, s.deckY(m.lx) - 3); P.ring(ctx, Cam.bx(q.x), Cam.by(q.y), 2, C.b1); P.dot(ctx, tipx, tipy, C.m4); }
    if (U.winch) { const q = s.toWorld(m.lx + 8, s.deckY(m.lx) - 6); P.ring(ctx, Cam.bx(q.x), Cam.by(q.y), 3, C.w5); P.dot(ctx, Cam.bx(q.x) + Math.round(Math.cos(t * 3) * 2), Cam.by(q.y) + Math.round(Math.sin(t * 3) * 2), C.w6); }
  } else if (m.type === 'wall') {
    put(SPR.wall, 13, 24);
    if (m.hp < m.max * 0.5) { ctx.fillStyle = C.ink; ctx.fillRect(bx - 3, by - 16, 1, 5); ctx.fillRect(bx - 2, by - 12, 1, 4); }
  } else if (m.type === 'brazier') {
    put(SPR.brazier, 6, 9);
    const f = s.toWorld(m.lx, s.deckY(m.lx) - 20), fx = Cam.bx(f.x), fy = Cam.by(f.y);
    if (m.lit) {
      drawFlame(ctx, fx, fy + 1, t, m.lx);
    } else { ctx.fillStyle = C.m1; ctx.fillRect(fx - 4, fy - 1, 8, 1); if (Math.random() < 0.05) FX.burst(f.x, f.y - 6, { n: 1, speed: 20, size: 2, color: 'm2', grav: -40, life: 1, kind: 'smoke', water: false }); }
  }
  if (m.flash > 0.4) { ctx.fillStyle = C.white; ctx.fillRect(bx - 6, by - 12, 12, 10); }
}

/* Wind blade: a full-charge sweep throws a crescent of air along the deck that cuts through everyone in its path. */
const Waves = {
  list: [],
  spawn(cap, dmg) { const f = cap.face, w = { x: cap.x + f * 40, y: cap.y - 38, f, v: 1100, life: 0.42, max: 0.42, dmg, hit: new Set() }; this.list.push(w); Sfx.play('wave', cap.pan(), 1); return w; },
  update(dt, G) {
    for (const w of this.list) {
      w.life -= dt; w.x += w.f * w.v * dt; w.v *= Math.exp(-2.2 * dt);
      if (Math.random() < 0.8) FX.burst(w.x - w.f * 10, w.y + rand(-24, 24), { n: 1, angle: w.f > 0 ? Math.PI : 0, spread: 0.3, speed: 80, size: 1, color: 'b4', grav: 0, life: 0.25, water: false });
      for (const e of G.enemies) {
        if (e.dead || e.water || e.phased > 0 || w.hit.has(e) || Math.abs(e.cx - w.x) > (w.tornado ? 44 : 26) || Math.abs(e.cy - w.y) > (w.tornado ? 80 : 56)) continue;
        w.hit.add(e); const crit = Math.random() < 0.3, dmg = w.dmg * (crit ? 2 : 1);
        e.hurt(dmg, w.f * (w.tornado ? 520 : 760), w.tornado ? -760 : -420, { stun: 0.7 }); FX.hitSpark(e.cx, e.cy, w.f > 0 ? 0 : Math.PI, true); FX.stop(0.05); Sfx.play('heavy', e.pan(), 0.9);
        if (crit) critFX(e.cx, e.cy - 20, dmg); if (e.hp <= 0) G.kill(e, G.captain);
      }
      for (const tn of G.tentacles) { if (w.hit.has(tn)) continue; const p = tn.hitPoint(w.x, w.y, 30); if (p) { w.hit.add(tn); tn.damage(w.dmg, G); FX.hitSpark(p.x, p.y, 0, true); } }
    }
    this.list = this.list.filter((w) => w.life > 0);
  },
  draw(ctx) {
    for (const w of this.list) {
      const k = w.life / w.max, bx = Cam.bx(w.x), by = Cam.by(w.y), h = Math.round((14 + (1 - k) * 6) * (w.tornado ? 1.5 : 1));
      if (w.tornado) for (let i = 0; i < 14; i++) { const a = G.t * 22 + i * 0.9, r = 4 + i * 1.3; P.dot(ctx, bx + Math.cos(a) * r * 0.6, by - 18 + i * 3 + Math.sin(a) * 2, C[i % 3 === 0 ? 'r4' : i % 3 === 1 ? 'n7' : 'b4'], 2); }
      for (let i = -h; i <= h; i++) {
        const u = i / h, bow = Math.round(Math.sqrt(1 - u * u) * 7) * w.f, th = Math.max(1, Math.round((1 - Math.abs(u)) * 4 * k + 0.5));
        for (let j = 0; j < th; j++) P.dot(ctx, bx + bow - w.f * j, by + i, C[j === 0 ? 'white' : j === 1 ? 'gold' : 'f4']);
        if (k > 0.4 && Math.abs(u) < 0.8 && (i & 1)) P.dot(ctx, bx + bow - w.f * (th + 2), by + i, C.b4);
      }
    }
  },
};

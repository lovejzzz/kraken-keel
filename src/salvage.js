'use strict';
/* Salvage: crates of ship parts float off wrecked and cleared enemy ships. Swim to them (or jump down) to pick them up.
   Parts buy ballista upgrades (each ballista keeps its own set). Also burning (fire bolts, firepots) lives here. */
sprite('crate', ['wwwwwwwww', 'wWWWWWWWw', 'wWmWWWmWw', 'wWWmWmWWw', 'wWWWmWWWw', 'wWWmWmWWw', 'wWmWWWmWw', 'wwwwwwwww'], { w: 'w1', W: 'w4', m: 'w2' });
sprite('gear', ['..m.m..', '.mmmmm.', 'mmM.Mmm', '.m...m.', 'mmM.Mmm', '.mmmmm.', '..m.m..'], { m: 'm3', M: 'm4' });

const BALLISTA_UPS = {
  arm: { name: '铁弓臂', parts: 3, desc: '伤害 +40%' },
  winch: { name: '绞盘', parts: 3, desc: '装填快 35%' },
  twin: { name: '双矢', parts: 5, desc: '一次射出两支弩箭' },
  fire: { name: '火油箭', parts: 4, desc: '点燃敌人和敌船，烧触手更狠' },
  harp: { name: '鱼叉箭', parts: 4, desc: '射中的人被拽进海里，敌船被拖近' },
};

const Salvage = {
  spawn(x, n, spread = 120) {
    for (let i = 0; i < n; i++) G.crates.push({ x: x + rand(-spread, spread) * 0.4, y: Sea.height(x) - 30, vx: rand(-1, 1) * spread * 1.2, vy: rand(-520, -360), air: true, age: 0, delay: 0.75 + i * 0.14, t: rand(0, 3), taken: false, held: false, parts: Math.random() < 0.3 ? 2 : 1, rot: rand(-0.3, 0.3) });
  },
  update(dt) {
    for (const c of G.crates) {
      c.t += dt;
      if (c.held || c.taken) continue;
      // parts knocked loose are picked up automatically: a short tumble through the air, then into the hold
      c.age = (c.age || 0) + dt; if (c.age > (c.delay ?? 0)) { Salvage.collect(c); continue; }
      if (c.air) { c.vy += 1300 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += dt * 9 * Math.sign(c.vx || 1); if (c.y > Sea.height(c.x) - 3 && c.vy > 0) { c.air = false; FX.splash(c.x, 0.35); } continue; }
      c.x += (c.vx - Sea.speed * 0.08) * dt; c.vx *= Math.exp(-2 * dt);
      c.y = damp(c.y, Sea.height(c.x) - 3 + Math.sin(c.t * 2.2) * 2, 6, dt); c.rot = Math.sin(c.t * 1.7) * 0.25;
      if (c.t > 32) c.gone = true;
    }
    G.crates = G.crates.filter((c) => !c.gone && !c.taken);
  },
  collect(c) {
    if (c.taken) return; c.taken = true; G.parts += c.parts;
    Sfx.play('coin', 0, 0.8); Sfx.play('build', 0, 0.5); UI.partBurst(c.x, c.y, c.parts);
  },
  /* at the end of a fight the crew fishes out half of what is still floating */
  sweep() {
    const left = G.crates.filter((c) => !c.taken), n = Math.floor(left.reduce((a, c) => a + c.parts, 0) / 2);
    if (n > 0) { G.parts += n; FX.text(G.captain.x, G.captain.y - 110, `船员捞起了 ${n} 个零件`, 'm4', 18, 1.6); }
    G.crates = [];
  },
  draw(ctx, t) {
    for (const c of G.crates) {
      const bx = Cam.bx(c.x), by = Cam.by(c.y);
      blitRot(ctx, SPR.crate, bx, by, c.rot, 4, 6);
      if (!c.held && Math.floor(t * 3 + c.t) % 3 === 0) P.dot(ctx, bx + 3, by - 7, C.b4);
      if (c.t > 26 && Math.floor(t * 8) % 2) P.rect(ctx, bx - 4, by - 7, 9, 1, C.r4);
    }
  },
  /* ---- burning ---- */
  burnActor(e, dur = 3) { e.burn = Math.max(e.burn || 0, dur); },
  updateBurns(dt) {
    for (const e of G.enemies) if (e.burn > 0 && !e.dead) {
      e.burn -= dt; e.burnTick = (e.burnTick || 0) - dt;
      if (e.water) e.burn = 0;
      if (e.burnTick <= 0) { e.burnTick = 0.5; e.hp -= 4; e.flash = 0.4; if (e.hp <= 0) G.kill(e); }
      if (Math.random() < dt * 14) FX.burst(e.x + rand(-6, 6), e.y - rand(10, 50), { n: 1, angle: -Math.PI / 2, spread: 0.4, speed: 60, size: 1, color: 'f5', color2: 'f3', grav: -120, life: 0.4, kind: 'ember', water: false });
    }
    for (const s of G.ships) if (s.burn > 0 && s.team === 'enemy' && !s.sunk) {
      s.burn -= dt; s.burnTick = (s.burnTick || 0) - dt;
      if (s.burnTick <= 0) { s.burnTick = 0.5; s.damage(4, rand(-s.L * 0.5, s.L * 0.5)); if (s.hull <= 0) G.shipSinks(s); }
    }
    // fire patches on our deck (firepots)
    for (const f of G.fires) {
      f.t -= dt * (1 + Sea.storm * 0.8);
      const cap = G.captain, ps = G.player;
      if (cap.ship === ps && !cap.air && Math.abs(cap.lx - f.lx) < f.w && cap.iframes <= 0) { f.tick = (f.tick || 0) - dt; if (f.tick <= 0) { f.tick = 0.4; if (cap.hurt(4, 0, 0, { stun: 0 })) { Sfx.play('fire', 0, 0.6); UI.pulse('hurt'); } } }
      for (const m of G.modules()) if (Math.abs(m.lx - f.lx) < f.w) { m.hp -= 5 * dt; if (m.hp <= 0) G.destroyModule(m); }
    }
    G.fires = G.fires.filter((f) => f.t > 0);
  },
  drawFires(ctx, t) {
    const ps = G.player;
    for (const f of G.fires) {
      const n = Math.max(1, Math.round(f.w / 18)), k = clamp(f.t / 1.5, 0, 1);
      for (let i = 0; i < n; i++) {
        const lx = f.lx - f.w + (i + 0.5) * (2 * f.w / n), p = ps.toWorld(lx, ps.deckY(lx));
        if (k < 1 && hash1(i + f.seed) > k) continue;
        drawFlame(ctx, Cam.bx(p.x), Cam.by(p.y) + 1, t, f.seed + i * 1.7);
      }
    }
    for (const s of G.ships) if (s.burn > 0 && !s.sunk) for (let i = 0; i < 3; i++) { const p = s.toWorld((i - 1) * s.L * 0.45, s.deckY(0) + 4); drawFlame(ctx, Cam.bx(p.x), Cam.by(p.y), t, i * 2.3 + s.x); }
    for (const e of G.enemies) if (e.burn > 0 && !e.dead) drawFlame(ctx, Cam.bx(e.x), Cam.by(e.y) - 14, t, e.id * 10);
  },
  fireLights(L) {
    const ps = G.player;
    for (const f of G.fires) { const p = ps.toWorld(f.lx, -50); L.push({ x: p.x, y: p.y, r: 200, c: [255, 140, 50], i: 0.8 * clamp(f.t / 1.5, 0, 1) }); }
    for (const s of G.ships) if (s.burn > 0 && !s.sunk) L.push({ x: s.x, y: s.y - 60, r: 260, c: [255, 140, 50], i: 0.8 });
  },
};

/* ---- coins: spill out of whatever died, bounce on the deck, then fly one by one into the purse ---- */
sprite('coin_b', ['.yy.', 'yYYy', 'yYyy', 'yYyy', 'yYYy', '.yy.'], { y: 'f3', Y: 'gold' });
sprite('coin_c', ['yy', 'YY', 'YY', 'YY', 'YY', 'yy'], { y: 'f3', Y: 'gold' });
const COIN_FRAMES = ['coin', 'coin_b', 'coin_c', 'coin_b'];
const Coins = {
  list: [],
  burst(x, y, n, power = 1) {
    n = Math.max(1, Math.round(n)); const shown = Math.min(n, 40), per = n / shown;
    for (let i = 0; i < shown; i++) this.list.push({ x: x + rand(-6, 6), y: y + rand(-6, 6), vx: rand(-240, 240) * power, vy: rand(-680, -320) * power, t: 0, delay: 0.5 + i * 0.03 + rand(0, 0.12), rot: rand(0, 4), spin: rand(10, 18), value: per });
    G.silverPending += n;
    Sfx.play('coinBurst', clamp((x - Cam.x) / 700, -1, 1), Math.min(1, 0.45 + n * 0.03));
  },
  update(dt) {
    for (const c of this.list) {
      c.t += dt; c.rot += dt * c.spin;
      if (c.t < c.delay) {
        c.vy += 1500 * dt; c.x += c.vx * dt; c.y += c.vy * dt;
        for (const s of G.ships) {
          if (s.sunk) continue; const lo = s.toLocal(c.x, c.y);
          if (Math.abs(lo.x) < s.walk + 10 && lo.y > s.deckY(lo.x) && lo.y < s.deckY(lo.x) + 24 && c.vy > 0) {
            const q = s.toWorld(lo.x, s.deckY(lo.x)); c.x = q.x; c.y = q.y; c.vy *= -0.45; c.vx *= 0.7; c.spin *= 0.7;
            if (Math.abs(c.vy) > 80 && Math.random() < 0.35) Sfx.play('coinTick', clamp((c.x - Cam.x) / 700, -1, 1), 0.12);
          }
        }
        const h = Sea.height(c.x); if (c.y > h) { c.y = h; c.vy *= -0.25; c.vx *= 0.8; }
      } else {
        UI.coins.push({ x: Cam.bx(c.x), y: Cam.by(c.y), vx: 0, vy: 0, t: 0.35, value: c.value }); c.done = true;
      }
    }
    this.list = this.list.filter((c) => !c.done);
  },
  draw(ctx) { for (const c of this.list) { const img = SPR[COIN_FRAMES[Math.floor(c.rot) % 4]]; blit(ctx, img, Cam.bx(c.x) - (img.width >> 1), Cam.by(c.y) - 6); } },
};

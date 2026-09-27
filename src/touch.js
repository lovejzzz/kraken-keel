'use strict';
/* Touch play: pixel buttons on screen (move, jump, attack/charge, roll, brace, E, Q) that press the same keys and mouse
   buttons the keyboard does; several at once. Attacks aim themselves at the nearest foe. Taps anywhere else act as clicks. */
const Touch = {
  on: false, ptr: new Map(), held: new Set(), btns: [],
  init(cv) {
    try { if (matchMedia('(pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches) this.on = true; } catch (e) { /* old browsers */ }
    cv.style.touchAction = 'none';
    // swallow the emulated mouse events and page gestures a touch would otherwise make
    cv.addEventListener('touchstart', (e) => { e.preventDefault(); }, { passive: false });
    cv.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
    cv.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'touch') return; this.on = true; this.down(e); });
    cv.addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') this.move(e); });
    const up = (e) => { if (e.pointerType === 'touch') this.up(e); };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  },
  portrait() { return this.on && innerHeight > innerWidth * 1.05; },
  buf(e) { const r = G.cv.getBoundingClientRect(); return { sx: e.clientX - r.left, sy: e.clientY - r.top, x: (e.clientX - r.left) / Cam.k, y: (e.clientY - r.top) / Cam.k }; },
  at(p) { for (const b of this.btns) if (p.x >= b.x - 3 && p.x <= b.x + b.w + 3 && p.y >= b.y - 3 && p.y <= b.y + b.h + 3) return b; return null; },
  down(e) {
    const p = this.buf(e), b = this.at(p);
    if (b) { this.ptr.set(e.pointerId, b.id); this.press(b.id, true); return; }
    // not a control: a click on whatever is under the finger (menus, deck slots, the chart)
    Input.mouse.sx = p.sx; Input.mouse.sy = p.sy;
    const hit = UI.hitAt({ x: p.x, y: p.y });
    if (hit || UI.screen || G.state === 'refit' || G.state === 'title') { Input.mouse.lp = true; Input.mouse.l = true; this.ptr.set(e.pointerId, 'ui'); }
  },
  move(e) {
    const id = this.ptr.get(e.pointerId); if (!id || id === 'ui') return;
    // slide between the two arrows without lifting
    if (id === 'left' || id === 'right') { const b = this.at(this.buf(e)); if (b && (b.id === 'left' || b.id === 'right') && b.id !== id) { this.press(id, false); this.press(b.id, true); this.ptr.set(e.pointerId, b.id); } }
  },
  up(e) {
    const id = this.ptr.get(e.pointerId); this.ptr.delete(e.pointerId); if (!id) return;
    if (id === 'ui') { Input.mouse.l = false; Input.mouse.lr = true; return; }
    this.press(id, false);
  },
  press(id, on) {
    const key = { left: 'a', right: 'd', jump: ' ', roll: 'Shift', brace: 's', use: 'e', swap: 'q' }[id];
    if (on) this.held.add(id); else this.held.delete(id);
    if (id === 'atk') { if (on) { Input.mouse.l = true; Input.mouse.lp = true; } else { Input.mouse.l = false; Input.mouse.lr = true; } return; }
    if (!key) return;
    if (on) { if (!Input.keys.has(key)) Input.taps.add(key); Input.keys.add(key); } else Input.keys.delete(key);
  },
  /* attacks and shots point at the nearest foe in reach; otherwise straight ahead */
  aim(G) {
    const cap = G.captain; let best = null, bd = 1e9;
    const consider = (x, y, pri = 1) => { const d = Math.hypot(x - cap.x, y - cap.y) / pri - (Math.sign(x - cap.x) === cap.face ? 60 : 0); if (d < bd && Math.abs(x - cap.x) < 520) { bd = d; best = { x, y }; } };
    for (const e of G.enemies) if (!e.dead && !e.water) consider(e.cx, e.cy);
    for (const h of G.hawks || []) if (!h.dead) consider(h.x, h.y, 1.2);
    for (const t of G.tentacles) if (t.hittable() && t.pts.length) { const q = t.pts[(t.pts.length * 0.7) | 0]; consider(q.x, q.y, 0.9); }
    if (G.kraken && G.kraken.eye > 0.6) { const q = G.kraken.eyePos; consider(q.x, q.y, 1.3); }
    if (G.boss) { const q = G.boss.targetPoint(); if (q) consider(q.x, q.y, q.pri || 1); }
    const t = best || { x: cap.x + cap.face * 220, y: cap.y - 34 };
    Input.mouse.x = t.x; Input.mouse.y = t.y;
  },
  /* lay the buttons out for this frame and draw them */
  draw(ctx, W, H) {
    this.btns = [];
    if (!this.on) return;
    if (this.portrait()) {
      P.rect(ctx, 0, 0, W, H, 'rgba(4,6,12,0.85)'); TXT.dim(ctx, 0.85);
      text(ctx, '请把设备横过来', W / 2, H / 2 - 14, { size: 16, align: 'center', color: C.b4, bold: true }); text(ctx, '横屏才能看清整条船', W / 2, H / 2 + 8, { size: 10, align: 'center', color: C.b2 });
      return;
    }
    const fight = (G.state === 'fight' || G.state === 'won') && !UI.screen, walk = fight || (G.state === 'refit' && UI.screen === 'refit');
    if (!walk) return;
    const add = (id, x, y, w, h, label, show = true) => { if (show) this.btns.push({ id, x: Math.round(x), y: Math.round(y), w, h, label }); };
    add('left', 8, H - 46, 36, 36, '◀'); add('right', 50, H - 46, 36, 36, '▶');
    if (fight) {
      const own = G.wpn ? ['oar', 'cutlass', 'scatter'].filter((k) => G.wpn.own[k]).length : 1;
      add('atk', W - 54, H - 58, 46, 46, G.captain.weapon === 'scatter' ? '射' : '攻');
      add('jump', W - 100, H - 46, 38, 38, '跳');
      add('roll', W - 54, H - 100, 38, 30, '滚');
      add('brace', W - 138, H - 40, 32, 30, '扎');
      add('use', W - 100, H - 86, 32, 28, 'E', !!G.hint && G.hint.includes('E'));
      add('swap', W - 138, H - 76, 32, 28, 'Q', own > 1);
    }
    for (const b of this.btns) {
      const on = this.held.has(b.id), big = b.id === 'atk';
      ctx.globalAlpha = on ? 0.9 : 0.55;
      P.rect(ctx, b.x, b.y, b.w, b.h, C.ink); P.rect(ctx, b.x + 1, b.y + 1, b.w - 2, b.h - 2, C[on ? (big ? 'r3' : 'w4') : big ? 'r1' : 'n2']); P.rect(ctx, b.x + 1, b.y + 1, b.w - 2, 1, C[on ? 'b3' : 'n4']);
      ctx.globalAlpha = 1;
      if (b.label === '◀' || b.label === '▶') { const d = b.label === '◀' ? -1 : 1, cx = b.x + b.w / 2, cy = b.y + b.h / 2; for (let i = 0; i < 8; i++) P.rect(ctx, cx + d * (4 - i), cy - i * 0.9, 1, Math.round(i * 1.8) + 1, C.b3); }
      else text(ctx, b.label, b.x + b.w / 2, b.y + b.h / 2 - (big ? 8 : 6), { size: big ? 15 : 11, align: 'center', color: C.b4, bold: true });
      if (big && G.captain.charging) { const r = b.w / 2 + 2, k = G.captain.charge; for (let a = 0; a < k * TAU; a += 0.12) P.dot(ctx, b.x + b.w / 2 + Math.sin(a) * r, b.y + b.h / 2 - Math.cos(a) * r, C[k >= 1 ? 'gold' : 'f4']); }
    }
  },
};

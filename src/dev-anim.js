/* Dev-only: lay out the captain's attack animations frame by frame on an overlay canvas (6x zoom). */
window.animSheet = function (steps = [0, 1, 2, 3], frames = 14, every = 2) {
  const cw = 64, ch = 60, cols = frames, rows = steps.length;
  let ov = document.getElementById('anim');
  if (!ov) { ov = document.createElement('canvas'); ov.id = 'anim'; ov.style.cssText = 'position:fixed;inset:0;z-index:99;background:#141c2e;image-rendering:pixelated;width:100%;height:100%'; document.body.appendChild(ov); }
  ov.width = cw * cols; ov.height = ch * rows; const g = ov.getContext('2d'); g.imageSmoothingEnabled = false;
  g.fillStyle = '#263a55'; g.fillRect(0, 0, ov.width, ov.height);
  const c = new Captain({}); c.x = 0; c.y = 0; c.face = 1; c.air = false; c.ship = null;
  const fakeG = { enemies: [], tentacles: [], ships: [], kraken: null, lightMul: () => 1, kill() {}, hitMast() {} };
  const bx = Cam.bx, by = Cam.by;
  steps.forEach((st, r) => {
    c.atk = null; c.weaponA = 0.35; c.swingFx = 0; c.startAttack(st, st === 3 ? 1 : 0);
    for (let f = 0; f < cols; f++) {
      for (let k = 0; k < every; k++) if (c.atk) c.runAttack(1 / 60, fakeG); else { c.weaponA = damp(c.weaponA, 0.35, 8, 1 / 60); c.swingFx = Math.max(0, (c.swingFx || 0) - 8 / 60); }
      const ox = f * cw + 22, oy = r * ch + 48;
      Cam.bx = (x) => Math.round(x * S) + ox; Cam.by = (y) => Math.round(y * S) + oy;
      g.fillStyle = f % 2 ? '#22324a' : '#263a55'; g.fillRect(f * cw, r * ch, cw, ch);
      c.anim = 0; c.walkV = 0; c.draw(g, 0);
      g.fillStyle = '#e8dcbc'; g.font = '8px monospace'; g.fillText(`${st}:${f * every}`, f * cw + 2, r * ch + 8);
    }
  });
  Cam.bx = bx; Cam.by = by; ov.style.display = 'block';
};
window.hideSheet = () => { const o = document.getElementById('anim'); if (o) o.style.display = 'none'; };

'use strict';
/* dev only: step the game frame by frame and lay crops around the captain side by side in an overlay (for reviewing animation) */
window.filmstrip = function (setup, n = 12, every = 1, opts = {}) {
  const w = opts.w || 110, h = opts.h || 90, cols = opts.cols || 6, sc = opts.scale || 3;
  let ov = document.getElementById('filmstrip'); if (ov) ov.remove();
  ov = document.createElement('canvas'); ov.id = 'filmstrip'; ov.width = w * cols; ov.height = h * Math.ceil(n / cols);
  Object.assign(ov.style, { position: 'fixed', left: '0', top: '0', width: ov.width * sc + 'px', imageRendering: 'pixelated', zIndex: 9, background: '#000' });
  document.body.appendChild(ov); const o = ov.getContext('2d');
  setup && setup();
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < every; k++) { opts.each && opts.each(i * every + k); G.frame(1 / 60); }
    const c = G.captain, bx = Cam.bx(c.x) + (opts.dx || 0), by = Cam.by(c.y) + (opts.dy || 0);
    o.drawImage(G.cv, bx - w / 2, by - h + 20, w, h, (i % cols) * w, Math.floor(i / cols) * h, w, h);
    o.fillStyle = '#ff0'; o.font = '8px monospace'; o.fillText(String(i * every), (i % cols) * w + 2, Math.floor(i / cols) * h + 8);
  }
  return ov.width + 'x' + ov.height;
};

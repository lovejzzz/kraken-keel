'use strict';
/* Math, noise and input shared by every module. */
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const pick = (arr) => arr[(Math.random() * arr.length) | 0];
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
const smooth = (t) => t * t * (3 - 2 * t);
const sign = (v) => (v < 0 ? -1 : 1);
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

function hash1(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function noise1(x) { const i = Math.floor(x), f = x - i; return lerp(hash1(i), hash1(i + 1), smooth(f)); }
function fbm1(x, oct = 4) { let a = 0, amp = 0.5, fr = 1; for (let i = 0; i < oct; i++) { a += amp * noise1(x * fr + i * 17.3); fr *= 2.03; amp *= 0.5; } return a; }
function hash2(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function noise2(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = smooth(x - ix), fy = smooth(y - iy);
  return lerp(lerp(hash2(ix, iy), hash2(ix + 1, iy), fx), lerp(hash2(ix, iy + 1), hash2(ix + 1, iy + 1), fx), fy);
}
function fbm2(x, y, oct = 5) { let a = 0, amp = 0.5, fr = 1; for (let i = 0; i < oct; i++) { a += amp * noise2(x * fr, y * fr); fr *= 2.02; amp *= 0.5; } return a; }

function rgba(r, g, b, a = 1) { return `rgba(${r | 0},${g | 0},${b | 0},${a})`; }
function mixc(c1, c2, t) { return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]; }

function offscreen(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); c.getContext('2d', { willReadFrequently: true }); return c; }

/* Input: keyboard + mouse in world coordinates (set by the camera each frame). */
const Input = {
  keys: new Set(), taps: new Set(), mouse: { sx: 0, sy: 0, x: 0, y: 0, l: false, r: false, lp: false, rp: false, lr: false, rr: false },
  init(canvas) {
    addEventListener('keydown', (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) e.preventDefault();
      if (!this.keys.has(k)) this.taps.add(k);
      this.keys.add(k);
    });
    addEventListener('keyup', (e) => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; this.keys.delete(k); });
    addEventListener('blur', () => { this.keys.clear(); this.mouse.l = this.mouse.r = false; });
    canvas.addEventListener('mousemove', (e) => { const r = canvas.getBoundingClientRect(); this.mouse.sx = e.clientX - r.left; this.mouse.sy = e.clientY - r.top; });
    canvas.addEventListener('mousedown', (e) => {
      const r = canvas.getBoundingClientRect(); this.mouse.sx = e.clientX - r.left; this.mouse.sy = e.clientY - r.top;
      if (e.button === 0) { this.mouse.l = true; this.mouse.lp = true; }
      if (e.button === 2) { this.mouse.r = true; this.mouse.rp = true; }
    });
    addEventListener('mouseup', (e) => {
      if (e.button === 0 && this.mouse.l) { this.mouse.l = false; this.mouse.lr = true; }
      if (e.button === 2 && this.mouse.r) { this.mouse.r = false; this.mouse.rr = true; }
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  },
  down(...ks) { return ks.some((k) => this.keys.has(k)); },
  tap(...ks) { return ks.some((k) => this.taps.has(k)); },
  axis() { return (this.down('d', 'ArrowRight') ? 1 : 0) - (this.down('a', 'ArrowLeft') ? 1 : 0); },
  endFrame() { this.taps.clear(); this.mouse.lp = this.mouse.rp = this.mouse.lr = this.mouse.rr = false; },
};

function store(key, val) { try { if (val === undefined) return JSON.parse(localStorage.getItem(key)); localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; } }

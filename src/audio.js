'use strict';
/* Procedural sound: every effect is synthesised (noise + oscillators + envelopes). Ambience beds follow the storm. */
const MUSIC_SOUNDS = new Set(['drum', 'horn', 'win', 'lose', 'note']);
const Sfx = {
  ctx: null, master: null, bus: null, verb: null, noise: null, on: true, beds: {}, drums: null, musicT: 0,
  init() {
    if (location.hash === '#mute') { this.on = false; return; }
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const c = (this.ctx = new AC());
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.2;
    this.master = c.createGain(); this.master.gain.value = 0.85; this.master.connect(comp); comp.connect(c.destination);
    // two buses so music and sound effects can be switched separately
    this.sfxBus = c.createGain(); this.sfxBus.connect(this.master); this.musicBus = c.createGain(); this.musicBus.connect(this.master);
    this.bus = this.sfxBus; this.route = this.sfxBus;
    // small hall reverb
    const len = c.sampleRate * 2.2, ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    this.verb = c.createConvolver(); this.verb.buffer = ir; const vg = c.createGain(); vg.gain.value = 0.22; this.verb.connect(vg); vg.connect(this.master);
    this.mverb = c.createConvolver(); this.mverb.buffer = ir; const mg = c.createGain(); mg.gain.value = 0.35; this.mverb.connect(mg); mg.connect(this.musicBus);
    const n = c.sampleRate * 2; this.noise = c.createBuffer(1, n, c.sampleRate); const d = this.noise.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    this.beds.sea = this.bed('lowpass', 420, 0.0); this.beds.rain = this.bed('highpass', 2600, 0.0); this.beds.wind = this.bed('bandpass', 700, 0.0);
    this.beds.deep = this.bed('lowpass', 120, 0.0);
    // a low drone pad under everything musical
    const dg = c.createGain(); dg.gain.value = 0.0; const df = c.createBiquadFilter(); df.type = 'lowpass'; df.frequency.value = 320; df.Q.value = 0.8; df.connect(dg); dg.connect(this.musicBus);
    for (const [f, d] of [[73.4, -4], [73.4, 5], [110, 3]]) { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = d; const g = c.createGain(); g.gain.value = 0.33; o.connect(g); g.connect(df); o.start(); }
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 140; lfo.connect(lg); lg.connect(df.frequency); lfo.start();
    this.drone = dg; this.melT = 2; this.apply();
  },
  apply() { if (!this.ctx) return; const now = this.ctx.currentTime; this.sfxBus.gain.setTargetAtTime(Settings.sfx ? 1 : 0, now, 0.05); this.musicBus.gain.setTargetAtTime(Settings.music ? 1 : 0, now, 0.05); },
  bed(type, f, g) {
    const c = this.ctx, src = c.createBufferSource(); src.buffer = this.noise; src.loop = true;
    const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = type === 'bandpass' ? 0.7 : 0.5;
    const gn = c.createGain(); gn.gain.value = g; src.connect(fl); fl.connect(gn); gn.connect(this.sfxBus); src.start();
    return { fl, gn, f };
  },
  ambience(storm, dt, t, deep = 0) {
    if (!this.ctx) return; const b = this.beds, now = this.ctx.currentTime;
    const swell = 0.55 + 0.45 * Math.sin(t * 0.7) * Math.sin(t * 0.31 + 1);
    b.sea.gn.gain.setTargetAtTime((0.16 + storm * 0.22) * swell, now, 0.3); b.sea.fl.frequency.setTargetAtTime(300 + 500 * swell * (0.5 + storm), now, 0.3);
    b.rain.gn.gain.setTargetAtTime(storm * 0.07, now, 0.5);
    b.wind.gn.gain.setTargetAtTime(0.02 + storm * 0.09 * (0.5 + 0.5 * Math.sin(t * 0.43)), now, 0.4);
    b.wind.fl.frequency.setTargetAtTime(400 + 900 * noise1(t * 0.3), now, 0.4);
    b.deep.gn.gain.setTargetAtTime(deep * 0.5, now, 0.8);
  },
  env(g, t0, a, peak, dec) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + dec); },
  out(pan, verb = 0.3) {
    const c = this.ctx, g = c.createGain(), p = c.createStereoPanner ? c.createStereoPanner() : null;
    const bus = this.route || this.sfxBus, rv = bus === this.musicBus ? this.mverb : this.verb;
    if (p) { p.pan.value = clamp(pan, -1, 1); g.connect(p); p.connect(bus); if (verb) { const s = c.createGain(); s.gain.value = verb; p.connect(s); s.connect(rv); } }
    else g.connect(bus);
    return g;
  },
  nz(t0, dur, type, f, q, peak, a, pan = 0, verb = 0.3, fEnd = null) {
    const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noise; s.playbackRate.value = rand(0.8, 1.2);
    const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t0); fl.Q.value = q;
    if (fEnd) fl.frequency.exponentialRampToValueAtTime(fEnd, t0 + dur);
    const g = this.out(pan, verb); s.connect(fl); fl.connect(g); this.env(g, t0, a, peak, dur); s.start(t0, rand(0, 1)); s.stop(t0 + dur + a + 0.05);
  },
  osc(t0, dur, type, f, fEnd, peak, a, pan = 0, verb = 0.3) {
    const c = this.ctx, o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t0);
    if (fEnd) o.frequency.exponentialRampToValueAtTime(fEnd, t0 + dur);
    const g = this.out(pan, verb); o.connect(g); this.env(g, t0, a, peak, dur); o.start(t0); o.stop(t0 + dur + a + 0.05);
  },
  play(name, pan = 0, vol = 1) {
    if (!this.ctx || !this.on) return; const t = this.ctx.currentTime, v = vol;
    this.route = MUSIC_SOUNDS.has(name) ? this.musicBus : this.sfxBus;
    if (this.route === this.sfxBus && !Settings.sfx) return; if (this.route === this.musicBus && !Settings.music) return;
    switch (name) {
      case 'swing': this.nz(t, 0.16, 'bandpass', 900, 1.2, 0.18 * v, 0.02, pan, 0.1, 2600); break;
      case 'swingBig': this.nz(t, 0.3, 'bandpass', 500, 1.0, 0.3 * v, 0.03, pan, 0.2, 1800); this.osc(t, 0.25, 'sine', 120, 60, 0.1 * v, 0.01, pan); break;
      case 'hit': this.nz(t, 0.09, 'lowpass', 2400, 0.7, 0.5 * v, 0.002, pan, 0.2); this.osc(t, 0.12, 'sine', 180, 55, 0.5 * v, 0.002, pan, 0.1); break;
      case 'heavy': this.nz(t, 0.2, 'lowpass', 1600, 0.8, 0.7 * v, 0.002, pan, 0.4); this.osc(t, 0.3, 'sine', 140, 38, 0.8 * v, 0.002, pan, 0.2); this.nz(t, 0.05, 'highpass', 3000, 0.7, 0.3 * v, 0.001, pan); break;
      case 'clang': this.osc(t, 0.35, 'square', 820, 780, 0.08 * v, 0.001, pan, 0.5); this.osc(t, 0.4, 'triangle', 1330, 1290, 0.1 * v, 0.001, pan, 0.5); this.nz(t, 0.06, 'highpass', 4000, 1, 0.25 * v, 0.001, pan); break;
      case 'wood': this.nz(t, 0.14, 'bandpass', 700, 2.5, 0.5 * v, 0.002, pan, 0.3); this.osc(t, 0.1, 'triangle', 260, 150, 0.25 * v, 0.002, pan); break;
      case 'crack': this.nz(t, 0.35, 'bandpass', 500, 1.4, 0.7 * v, 0.002, pan, 0.5, 200); this.nz(t + 0.03, 0.08, 'highpass', 2500, 1, 0.3 * v, 0.001, pan); this.osc(t, 0.4, 'sawtooth', 90, 40, 0.15 * v, 0.003, pan); break;
      case 'splash': this.nz(t, 0.55, 'lowpass', 2200, 0.6, 0.45 * v, 0.01, pan, 0.4, 400); this.nz(t, 0.2, 'bandpass', 900, 1, 0.3 * v, 0.004, pan); break;
      case 'splashBig': this.nz(t, 1.1, 'lowpass', 1600, 0.5, 0.8 * v, 0.02, pan, 0.6, 180); this.osc(t, 0.5, 'sine', 90, 35, 0.4 * v, 0.01, pan); break;
      case 'step': this.nz(t, 0.05, 'bandpass', 380, 2, 0.08 * v, 0.002, pan, 0); break;
      case 'jump': this.nz(t, 0.08, 'bandpass', 600, 1.5, 0.1 * v, 0.005, pan, 0); break;
      case 'land': this.nz(t, 0.1, 'lowpass', 500, 1, 0.25 * v, 0.002, pan, 0.1); this.osc(t, 0.1, 'sine', 110, 60, 0.2 * v, 0.002, pan); break;
      case 'rope': this.nz(t, 0.25, 'bandpass', 1500, 3, 0.15 * v, 0.01, pan, 0.1, 500); break;
      case 'hook': this.osc(t, 0.08, 'square', 1400, 900, 0.07 * v, 0.001, pan, 0.2); this.nz(t, 0.06, 'highpass', 2500, 1, 0.2 * v, 0.001, pan); break;
      case 'ballista': this.osc(t, 0.3, 'sawtooth', 160, 70, 0.25 * v, 0.002, pan, 0.3); this.nz(t, 0.25, 'bandpass', 1200, 1, 0.35 * v, 0.002, pan, 0.2, 400); break;
      case 'thunder': { const d = rand(0.05, 0.4); this.nz(t + d, 2.8, 'lowpass', 900, 0.4, 0.9 * v, 0.02, pan, 0.8, 80); this.nz(t + d, 0.3, 'lowpass', 3000, 0.4, 0.4 * v, 0.003, pan, 0.5); break; }
      case 'hurt': this.osc(t, 0.2, 'sawtooth', 220, 110, 0.12 * v, 0.004, pan, 0.2); this.nz(t, 0.1, 'lowpass', 1400, 1, 0.3 * v, 0.002, pan); break;
      case 'grunt': this.osc(t, 0.16, 'sawtooth', rand(120, 170), 70, 0.08 * v, 0.01, pan, 0.2); break;
      case 'coin': this.osc(t, 0.12, 'triangle', 1800, 1800, 0.07 * v, 0.001, pan, 0.4); this.osc(t + 0.06, 0.18, 'triangle', 2400, 2400, 0.06 * v, 0.001, pan, 0.4); break;
      case 'build': this.play('wood', pan, 0.8); this.osc(t + 0.08, 0.1, 'triangle', 300, 200, 0.2 * v, 0.002, pan); this.nz(t + 0.16, 0.12, 'bandpass', 800, 2, 0.35 * v, 0.002, pan); break;
      case 'fire': this.nz(t, 0.6, 'bandpass', 1200, 0.8, 0.2 * v, 0.05, pan, 0.2, 400); break;
      case 'tentacleWarn': this.nz(t, 1.2, 'lowpass', 300, 1.2, 0.35 * v, 0.2, pan, 0.4, 900); this.osc(t, 1.2, 'sine', 55, 45, 0.25 * v, 0.2, pan, 0.4); break;
      case 'tentacle': this.nz(t, 0.5, 'lowpass', 700, 0.8, 0.5 * v, 0.02, pan, 0.4, 150); this.osc(t, 0.5, 'sine', 70, 30, 0.35 * v, 0.02, pan, 0.4); break;
      case 'slam': this.play('crack', pan, 1); this.play('splash', pan, 0.7); this.osc(t, 0.6, 'sine', 70, 28, 0.9 * v, 0.002, pan, 0.4); break;
      case 'roar': this.osc(t, 2.4, 'sawtooth', 70, 38, 0.3 * v, 0.3, pan, 0.8); this.osc(t, 2.4, 'sawtooth', 73, 36, 0.25 * v, 0.3, pan, 0.8); this.nz(t, 2.4, 'lowpass', 500, 2, 0.5 * v, 0.3, pan, 0.8, 120); break;
      case 'horn': [0, 0.9].forEach((d, i) => { this.osc(t + d, 0.8 + i * 0.6, 'sawtooth', 98 + i * 49, 97 + i * 49, 0.12 * v, 0.15, pan, 0.8); this.osc(t + d, 0.8 + i * 0.6, 'sawtooth', 147 + i * 49, 146 + i * 49, 0.06 * v, 0.15, pan, 0.8); }); break;
      case 'win': [0, 0.25, 0.5].forEach((d, i) => this.osc(t + d, 0.9, 'triangle', [294, 370, 440][i], null, 0.13 * v, 0.02, 0, 0.8)); break;
      case 'lose': [0, 0.35, 0.7].forEach((d, i) => this.osc(t + d, 1.2, 'triangle', [220, 196, 147][i], null, 0.13 * v, 0.02, 0, 0.8)); break;
      case 'coinTick': { const f = rand(1900, 2900); this.osc(t, 0.06, 'triangle', f, f, 0.08 * v, 0.001, pan, 0.25); this.osc(t + 0.03, 0.09, 'sine', f * 1.5, f * 1.5, 0.05 * v, 0.001, pan, 0.3); break; }
      case 'coinBurst': { this.nz(t, 0.18, 'bandpass', 2400, 2, 0.25 * v, 0.002, pan, 0.2); for (let i = 0; i < 7; i++) { const f = rand(1600, 3000), d = i * rand(0.018, 0.04); this.osc(t + d, 0.08, 'triangle', f, f * 0.98, 0.07 * v, 0.001, pan, 0.3); } this.osc(t, 0.12, 'sine', 220, 120, 0.12 * v, 0.002, pan, 0.1); break; }
      case 'note': { const f = pan; this.route = this.musicBus; const o = this.ctx.createOscillator(), o2 = this.ctx.createOscillator(), g = this.out(0, 0.7), lf = this.ctx.createOscillator(), lg = this.ctx.createGain();
        o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = f; o2.frequency.value = f * 2.005; lf.frequency.value = 5.2; lg.gain.value = f * 0.006; lf.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
        const g2 = this.ctx.createGain(); g2.gain.value = 0.25; o.connect(g); o2.connect(g2); g2.connect(g); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06 * v, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
        o.start(t); o2.start(t); lf.start(t); o.stop(t + 2.7); o2.stop(t + 2.7); lf.stop(t + 2.7); break; }
      case 'crit': this.osc(t, 0.3, 'square', 1250, 1180, 0.07 * v, 0.001, pan, 0.5); this.osc(t, 0.45, 'triangle', 2500, 2440, 0.08 * v, 0.001, pan, 0.6); this.nz(t, 0.07, 'highpass', 5000, 0.8, 0.3 * v, 0.001, pan); this.osc(t, 0.3, 'sine', 170, 40, 0.8 * v, 0.002, pan, 0.2); break;
      case 'chargeStart': this.osc(t, 0.3, 'triangle', 220, 330, 0.07 * v, 0.02, pan, 0.2); this.nz(t, 0.25, 'bandpass', 700, 2, 0.08 * v, 0.05, pan, 0.2, 1400); break;
      case 'chargeLv': this.osc(t, 0.22, 'triangle', 660, 700, 0.12 * v, 0.003, pan, 0.4); this.osc(t, 0.18, 'square', 1320, 1400, 0.03 * v, 0.003, pan, 0.4); break;
      case 'chargeFull': this.osc(t, 0.4, 'triangle', 990, 1060, 0.14 * v, 0.003, pan, 0.6); this.osc(t + 0.06, 0.4, 'triangle', 1480, 1560, 0.1 * v, 0.003, pan, 0.6); this.nz(t, 0.1, 'highpass', 4000, 1, 0.12 * v, 0.002, pan, 0.4); break;
      case 'wave': this.nz(t, 0.45, 'bandpass', 1200, 0.8, 0.35 * v, 0.01, pan, 0.4, 400); this.osc(t, 0.35, 'sine', 300, 90, 0.2 * v, 0.005, pan, 0.3); break;
      case 'squawk': this.osc(t, 0.08, 'square', 1500, 2400, 0.045 * v, 0.004, pan, 0.2); this.osc(t + 0.09, 0.11, 'square', 2200, 1250, 0.045 * v, 0.004, pan, 0.2); this.osc(t, 0.2, 'sawtooth', 900, 1500, 0.02 * v, 0.01, pan, 0.2); break;
      case 'flap': this.nz(t, 0.06, 'bandpass', 900, 1.4, 0.06 * v, 0.004, pan, 0.05); break;
      case 'peck': this.nz(t, 0.035, 'highpass', 3000, 1, 0.22 * v, 0.001, pan, 0.1); this.osc(t, 0.05, 'square', 950, 520, 0.05 * v, 0.001, pan, 0.1); break;
      case 'levelup': [660, 880, 1100, 1320].forEach((f, i) => this.osc(t + i * 0.08, 0.2, 'triangle', f, f * 1.01, 0.1 * v, 0.004, pan, 0.4)); break;
      case 'eat': [0, 0.09, 0.18].forEach((d) => this.nz(t + d, 0.05, 'bandpass', 2200, 2, 0.12 * v, 0.002, pan, 0.05)); break;
      case 'ui': this.osc(t, 0.07, 'triangle', 660, 520, 0.06 * v, 0.002, 0, 0.1); break;
      case 'bubbles': for (let i = 0; i < 6; i++) this.osc(t + i * rand(0.04, 0.12), 0.06, 'sine', rand(300, 700), rand(800, 1400), 0.05 * v, 0.005, pan, 0.2); break;
      case 'drum': this.osc(t, 0.35, 'sine', 95, 45, 0.5 * v, 0.003, pan, 0.3); this.nz(t, 0.06, 'lowpass', 900, 1, 0.3 * v, 0.002, pan, 0.2); break;
      case 'eye': this.osc(t, 1.0, 'sine', 880, 440, 0.05 * v, 0.2, pan, 0.9); this.osc(t, 1.0, 'sine', 1320, 660, 0.03 * v, 0.2, pan, 0.9); break;
    }
  },
  /* A slow war-drum pulse under fights (intensity 0..1). */
  music(dt, intensity, mood = 1) {
    if (!this.ctx) return;
    if (this.drone) this.drone.gain.setTargetAtTime(Settings.music ? 0.05 + intensity * 0.03 : 0, this.ctx.currentTime, 0.8);
    // a sparse melody in D minor pentatonic, higher and busier in a fight
    this.melT -= dt;
    if (this.melT <= 0 && Settings.music) {
      const scale = [293.7, 349.2, 392, 440, 523.3, 587.3, 698.5], i = Math.min(scale.length - 1, Math.floor(Math.random() * (4 + intensity * 3)));
      this.last = this.last == null ? 2 : clamp(this.last + randi(-2, 2), 0, scale.length - 1); const f = scale[Math.random() < 0.5 ? this.last : i] / (intensity > 0.3 ? 1 : 2);
      this.play('note', f, 0.7 + intensity * 0.3); this.melT = intensity > 0.3 ? rand(0.9, 1.8) : rand(1.8, 3.4);
      if (Math.random() < 0.25) this.melT *= 2.2;
    }
    if (intensity <= 0.01) return; this.musicT -= dt;
    if (this.musicT <= 0) {
      const beat = 60 / (70 + intensity * 50); this.musicT += beat;
      this.beat = (this.beat || 0) + 1; const b = this.beat % 8;
      if (b === 0 || b === 3 || b === 4 || (intensity > 0.6 && b === 6)) this.play('drum', 0, 0.35 + intensity * 0.4);
    }
  },
};

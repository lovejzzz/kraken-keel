'use strict';
/* The sea chart: a branching voyage, left to right. Each column is a leg; every node is a destination with a known reward.
   Fights, elite fights (a chieftain aboard), wrecks to salvage, harbours to refit, fog with a surprise, and the kraken. */
sprite('n_fight', ['m..........m', '.m........m.', '..m......m..', '...m....m...', '....m..m....', '.....mm.....', '.....mm.....', '....w..w....', '...w....w...', '.ww......ww.', 'ww........ww', '............'], { m: 'm1', w: 'w2' });
sprite('n_elite', ['h..........h', 'hh........hh', '.hh.gggg.hh.', '..hgGGGGgh..', '..gGGGGGGg..', '.gGGkGGkGGg.', '.gGGkGGkGGg.', '.gggggggggg.', '..w......w..', '...wwwwww...', '............', '............'], { h: 'b0', g: 'f2', G: 'gold', k: 'ink', w: 'w1' });
sprite('n_wreck', ['......m.....', '.....mm.....', '....m.m.....', '......m.....', '.wwwwwwwww..', '.wWmWWWmWw..', '.wWWmWmWWw..', '.wWWWmWWWw..', '.wWWmWmWWw..', '.wwwwwwwww..', 't.t.t.t.t.t.', '.t.t.t.t.t.t'], { m: 'w1', w: 'w1', W: 'w4', t: 't4' });
sprite('n_harbor', ['.....mm.....', '....m..m....', '.....mm.....', '..mmmmmmmm..', '.....mm.....', '.....mm.....', '.....mm.....', 'm....mm....m', 'mm...mm...mm', '.mm..mm..mm.', '..mmmmmmmm..', '....mmmm....'], { m: 'n3' });
sprite('n_mystery', ['...wwwww....', '..ww...ww...', '.......ww...', '......ww....', '.....ww.....', '.....ww.....', '............', '.....ww.....', '.....ww.....', '............', '.t.t.t.t.t..', 't.t.t.t.t.t.'], { w: 'n2', t: 'n6' });
sprite('n_boss', ['...kkkkkk...', '.kkKKKKKKkk.', 'kKKggggggKKk', 'kKgGGiiGGgKk', 'kKgGGiiGGgKk', 'kKKggggggKKk', '.kkKKKKKKkk.', '..k.kkkk.k..', '.k..k..k..k.', 'k...k..k...k', '...k....k...', '............'], { k: 'k1', K: 'k3', g: 'g1', G: 'g2', i: 'ink' });
sprite('n_ship', ['......m.......', '....rrmbb.....', '....rrmbb.....', '....rrmbb.....', '......m.......', 'h.....m......h', 'hwwwwwwwwwwwwh', '.wWWWWWWWWWWw.', '..wwwwwwwwww..'], { m: 'w1', r: 'r2', b: 'b4', h: 'w2', w: 'w1', W: 'w4' });

const NODE_TYPES = {
  fight: { icon: 'n_fight', name: '战斗', desc: '一场遭遇战。' },
  elite: { icon: 'n_elite', name: '精英', desc: '首领坐镇的长船。难打，奖励丰厚，必掉零件。' },
  wreck: { icon: 'n_wreck', name: '沉船残骸', desc: '不用打仗。捞起漂在海上的零件和银币。' },
  harbor: { icon: 'n_harbor', name: '港口', desc: '免费补船、回满生命，港口商店打八折。' },
  mystery: { icon: 'n_mystery', name: '迷雾', desc: '雾里看不清：可能是宝藏，也可能是埋伏。' },
  boss: { icon: 'n_boss', name: '海妖', desc: '深渊里的那只眼睛。' },
  wyrm: { icon: 'n_wyrm', name: '霜龙', desc: '冰海深处的巨龙。它会缠住整条船。' },
};
const FIGHT_POOL = [[], ['skiffs'], ['rival', 'storm', 'skiffs'], ['storm', 'nest', 'rival'], ['nest', 'ghost', 'storm'], ['ghost', 'nest', 'storm']];
const ELITE_POOL = ['twin', 'berserk'];

const SeaMap = {
  generate(ch = 1) {
    const cfg = CHAPTERS[ch];
    const layers = [], LN = 7;
    layers.push([{ id: 's', layer: 0, type: 'start', y: 0.5 }]);
    for (let l = 1; l < LN - 1; l++) {
      const n = l === 1 ? 1 : randi(2, 3), row = [];
      const types = this.typesFor(l, n);
      for (let i = 0; i < n; i++) row.push({ id: `${l}_${i}`, layer: l, type: types[i], y: (i + 0.5) / n + rand(-0.08, 0.08) });
      layers.push(row);
    }
    layers.push([{ id: 'boss', layer: LN - 1, type: 'boss', y: 0.5 }]);
    // links: each node reaches the one or two nearest nodes of the next leg; every node gets reached
    for (let l = 0; l < LN - 1; l++) {
      const a = layers[l], b = layers[l + 1];
      for (const n of a) { const near = [...b].sort((p, q) => Math.abs(p.y - n.y) - Math.abs(q.y - n.y)); n.next = near.slice(0, b.length > 2 && Math.random() < 0.6 ? 2 : Math.min(2, b.length)).map((x) => x.id); if (a.length === 1) n.next = b.map((x) => x.id); }
      for (const m of b) if (!a.some((n) => n.next.includes(m.id))) { const n = [...a].sort((p, q) => Math.abs(p.y - m.y) - Math.abs(q.y - m.y))[0]; n.next.push(m.id); }
    }
    // what each destination holds
    const used = {};
    for (const row of layers) for (const n of row) {
      const step = n.layer - 1;
      if (n.type === 'fight') { const pool = cfg.pool[n.layer].filter((k) => !used[k]); n.enc = pick(pool.length ? pool : cfg.pool[n.layer]); used[n.enc] = 1; n.reward = { silver: ENC[n.enc].reward + step * 5, parts: 0 }; }
      if (n.type === 'elite') { n.enc = pick(cfg.elite); n.reward = { silver: Math.round(ENC[n.enc].reward * 1.4 + step * 5), parts: 3 }; }
      if (n.type === 'wreck') n.reward = { silver: 15 + step * 5, parts: randi(3, 5) };
      if (n.type === 'harbor') n.reward = { heal: true };
      if (n.type === 'mystery') n.reward = { unknown: true };
      if (n.type === 'boss') { n.enc = cfg.boss; n.reward = {}; }
    }
    return { ch, layers, at: 's', nodes: Object.fromEntries(layers.flat().map((n) => [n.id, n])) };
  },
  typesFor(l, n) {
    const bag = l === 1 ? ['fight'] : l === 2 ? ['fight', 'mystery', 'wreck'] : l === 3 ? ['fight', 'harbor', 'elite'] : l === 4 ? ['fight', 'elite', 'mystery'] : ['harbor', 'fight', 'elite'];
    const out = []; for (let i = 0; i < n; i++) out.push(bag[i % bag.length]);
    for (let i = out.length - 1; i > 0; i--) { const j = randi(0, i); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  },
  /* screen placement of a node inside the chart rectangle */
  pos(n, R) { const LN = G.map.layers.length; return { x: Math.round(R.x + 26 + (n.layer / (LN - 1)) * (R.w - 52)), y: Math.round(R.y + 30 + n.y * (R.h - 64)) }; },
  available() { const cur = G.map.nodes[G.map.at]; return cur.next.map((id) => G.map.nodes[id]); },
  /* what happens on arrival */
  enter(n) {
    G.map.at = n.id; n.visited = true; G.step = (G.chapter - 1) * 6 + Math.max(0, n.layer - 1); G.node = n;
    if (n.type === 'fight' || n.type === 'elite' || n.type === 'boss') { UI.screen = null; G.startEncounter(n.enc); return; }
    if (n.type === 'wreck') return this.event('沉船残骸', '一条沉船的残骸在浪里打转。船员跳下去，捞起了零件和银币。', () => this.pay(n.reward), n.reward);
    if (n.type === 'harbor') return this.event('港口', '峡湾里的小港口。木匠补好了船，你也喝上了热汤。港口商店打八折。', () => { const ps = G.player, cap = G.captain; ps.hull = ps.hullMax; ps.breaches = []; cap.hp = cap.max; G.discount = 0.8; G.openRefit(true); }, { heal: true }, true);
    if (n.type === 'mystery') {
      const r = Math.random();
      if (r < 0.45) { const rw = { silver: 30 + G.step * 8, parts: randi(2, 4) }; return this.event('迷雾', '雾散开时，你们撞上了一条被遗弃的货船，舱里还有东西。', () => this.pay(rw), rw); }
      if (r < 0.75) return this.event('迷雾', '是埋伏！小艇从雾里冲了出来。', () => { n.enc = 'skiffs'; n.reward = { silver: 40 + G.step * 5, parts: 1 }; UI.screen = null; G.startEncounter('skiffs'); }, null, false, true);
      return this.event('迷雾', '雾里传来歌声。船员们说那是好兆头：船长的生命上限 +20。', () => { G.captain.max += 20; G.captain.hp = G.captain.max; }, { heal: true });
    }
  },
  pay(rw) { const cap = G.captain; if (rw.silver) { G.silver += rw.silver; Coins.burst(cap.x, cap.y - 160, rw.silver, 0.7); } if (rw.parts) { G.parts += rw.parts; UI.partBurst(cap.x, cap.y - 120, rw.parts); } },
  event(title, body, fn, reward, toRefit = false, danger = false) { UI.event = { title, body, fn, reward, toRefit, danger }; UI.screen = 'event'; Sfx.play(danger ? 'horn' : 'coin', 0, 0.7); },
};

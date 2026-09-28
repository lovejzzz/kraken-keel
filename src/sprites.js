'use strict';
/* Hand-drawn pixel parts (heads, torsos, weapons, shields) and the character puppet that animates them.
   All parts face right. Heads pivot at the neck, torsos at the hip, weapons at the grip. */

/* ---------- heads (13 x 12, neck at 6,11) ---------- */
sprite('head_captain', [
  '....hhhhhh...',
  '..hhHHHHHHh..',
  '.hHHHHHHHHHh.',
  'hhhhhhhhhhhhh',
  '.qqsssssesq..',
  '.qqssssssssS.',
  '.qqsssssSss..',
  '.qrrssrrrrr..',
  '..rrrrrrrrrr.',
  '..rrrRrrrRr..',
  '...rrrRrrr...',
  '....rrrRr....',
], { h: 'w2', H: 'w4', q: 'f2', s: 's2', S: 's1', e: 'ink', r: 'f2', R: 'f1' });
sprite('head_raider', [
  '.....mmmm....',
  '...mmMMMMm...',
  '..mMMMMMMMm..',
  '.mMMMMMMMMMm.',
  '.mmmmmmmmNmm.',
  '.dsssssssNe..',
  '.dssssssssss.',
  '.ddsssssSs...',
  '.dddssdddd...',
  '..ddddddddd..',
  '...dddddd....',
  '....dddd.....',
], { m: 'm1', M: 'm3', N: 'm2', s: 's2', S: 's1', e: 'ink', d: 'w2' });
recolor('head_raider2', 'head_raider', { d: 'b1', s: 's3' });
recolor('head_thrower', 'head_raider', { m: 'w3', M: 'w4', N: 's2', d: 'w1' });
sprite('head_berserker', [
  '.ww.....ww...',
  '.wWwwwwwwWw..',
  'wWWWWWWWWWWw.',
  'wWWWWWWWWWWWk',
  'wwwwwwwwwwwWk',
  'w.sssssssse..',
  'w.sssssssss..',
  '..sssSsssS...',
  '..rrrsssrrr..',
  '..rrrrrrrrr..',
  '...rrRrrrr...',
  '....rrrr.....',
], { w: 'w2', W: 'w4', k: 'ink', s: 's2', S: 's1', e: 'ink', r: 'f1', R: 'r0' });
sprite('head_draugr', [
  '.....mmmm....',
  '...mmMMMMm...',
  '..mMMmMMMMm..',
  '.mMMMMMMmMMm.',
  '.mmmmmmmmNmm.',
  '.dgggggggNx..',
  '.dgGGgggggg..',
  '.dggGggGgg...',
  '.ddgddgdd....',
  '..d.dd.d.d...',
  '..d..d...d...',
  '.....d.......',
], { m: 'm0', M: 'r1', N: 'm1', g: 'd3', G: 'd2', x: 'g2', d: 'd1' });

/* ---------- torsos (14 x 12, hip at 7,11) ---------- */
sprite('torso_captain', [
  '....fFFFFf....',
  '..ffFFFFFFFf..',
  '.fFFFFFFFFFFf.',
  'oofcccccTTTcf.',
  'oOocccccTTTTc.',
  'o.occcccTtTTc.',
  'oOocccccTTTTc.',
  '.oocccccTTTTc.',
  '..cRRRRRRRRRc.',
  '..cBBBBBBByBc.',
  '..ccccccTTTcc.',
  '..ccc....cccc.',
], { f: 'w3', F: 'b1', c: 'w2', o: 'b2', O: 'b0', T: 'n4', t: 'n3', R: 'r2', B: 'w1', y: 'gold' });
sprite('torso_raider', [
  '....cccccc....',
  '..ccMMMMMMcc..',
  '.cMMMMMMMMMMc.',
  '.cMmMmMmMmMMc.',
  '.cMMMMMMMMMMc.',
  '.cmMmMmMmMmMc.',
  '.cMMMMMMMMMMc.',
  '.cmMmMmMmMmMc.',
  '.cBBBBBBByBBc.',
  '.cTTTTTTTTTTc.',
  '.cTTtTTTTtTTc.',
  '.cTTT....TTTc.',
], { c: 'm0', M: 'm2', m: 'm1', B: 'w1', y: 'm4', T: 'r1', t: 'r0' });
recolor('torso_shield', 'torso_raider', { T: 'n4', t: 'n3' });
recolor('torso_thrower', 'torso_raider', { M: 'w4', m: 'w3', T: 'd1', t: 'd0' });
sprite('torso_berserker', [
  '..wwwwwwwww...',
  '.wWWWWWWWWWw..',
  'wWWwwwwwwWWWw.',
  'wWwssssssswWw.',
  'wwsSsssSsssww.',
  '.wssSssssSss..',
  '.wsssSsssss...',
  '..ssssSsssS...',
  '..BBBBBBByBB..',
  '..TTTTTTTTTT..',
  '..TTtTTTTtTT..',
  '..TTT....TTT..',
], { w: 'w2', W: 'w4', s: 's2', S: 's1', B: 'w1', y: 'm4', T: 'w3', t: 'w2' });
sprite('torso_draugr', [
  '....cccccc....',
  '..ccGGGGGGcc..',
  '.cGGgGGGgGGGc.',
  '.cGrGrGrGrGGc.',
  '.cG.GgGgGgGGc.',
  '.cGGrGrGrGG.c.',
  '.c.GGgGGgGGGc.',
  '.cGGGGG.GGGGc.',
  '.cBBBBmBBBBBc.',
  '.cTT.TTTTT.Tc.',
  '.c.TtT.TtT.Tc.',
  '.cT......T..c.',
], { c: 'd0', G: 'd1', g: 'd2', r: 'd3', B: 'm0', m: 'm2', T: 'd1', t: 'd0' });

/* ---------- boots, weapons, shields ---------- */
sprite('boot', ['bbbb..', 'bbbbbb', 'BBBBBB'], { b: 'w2', B: 'w0' });
sprite('boot_d', ['bbbb..', 'bbbbbb', 'BBBBBB'], { b: 'd1', B: 'd0' });
/* the captain's armour, worn on the puppet: helm over the head, a mantle over the shoulders, better boots */
const ARM = { m: 'm2', M: 'm3', W: 'm4', G: 'gold', w: 'b4', k: 'm1' };
sprite('helm1', ['...mmmmmm....', '..mMMMMMMm...', '.mMMWMMMMMm..', 'mmmmmmmmmmmmm', '..........k..', '..........k..'], ARM);
sprite('helm2', ['...mmmmmm....', '..mMMMMMMm...', '.mMMWMMMMMm..', 'mGGGGGGGGGGGm', '.k........k..', '.k........k..', '.k...........'], ARM);
sprite('helm3', ['w..mmmmmm....', 'ww.mMMMMMm...', 'wwmMMWMMMMm..', 'mGGGGGGGGGGGm', '.k........k..', '.k........k..', '.k...........'], ARM);
sprite('mantle1', ['...ffffffff...', '.fFFFFFFFFFFf.', 'fFFfFFFFfFFFFf', '.f.f..f..f.f..'], { f: 'w3', F: 'w5' });
sprite('mantle2', ['...ffffffff...', '.fFFFFFFFFFFf.', 'fFFfFFyFfFFFFf', '.f.f..f..f.f..'], { f: 'b1', F: 'b3', y: 'gold' });
sprite('mantle3', ['..ffffffffff..', '.fFFFFFFFFFFf.', 'fFFfFFyFfFFFFf', 'fFfFfFFfFfFFf.', 'c.c.f..f..c.c.'], { f: 'b1', F: 'b3', y: 'gold', c: 'b4' });
sprite('boot_fur', ['FFFF..', 'bbbbbb', 'BBBBBB'], { b: 'w3', F: 'b2', B: 'w1' });
sprite('boot_seal', ['FFFF..', 'bbbbbb', 'BBBBBB'], { b: 'm2', F: 'b3', B: 'm0' });
function captainGear(extra) { const u = (G && G.ups) || {}; return { helm: u.helm || 0, fur: u.fur || 0, boots: u.rope || 0, ...(extra || {}) }; }
function armourSprites(gear) { if (!gear) return {}; return { helm: gear.helm ? SPR['helm' + Math.min(3, gear.helm)] : null, mantle: gear.fur ? SPR['mantle' + Math.min(3, gear.fur)] : null, boot: gear.boots ? SPR[gear.boots >= 2 ? 'boot_seal' : 'boot_fur'] : null }; }
sprite('oar', [
  '.wW.', '.wW.', '.wW.', '.wW.', 'mmmm', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.', '.wW.',
  '.wW.', '.wWW', 'wwWW', 'wwWW', 'wrWW', 'wwrW', 'wrWW', 'wwWW', 'wwWW', 'wwWW', '.wW.', '.W..',
], { w: 'w5', W: 'w3', r: 'f3', m: 'm3' });
sprite('axe', ['.w..', '.w..', '.w..', '.w..', '.w..', '.w..', '.w..', '.w..', '.w..', '.wmm', '.wMMm', '.wMMM', '.wmm', '.w..'], { w: 'w4', m: 'm3', M: 'm4' });
sprite('bigaxe', ['..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', '..w..', 'mmwmm', 'MMwMM', 'MMwMM', 'mMwMm', '.mwm.', '..w..'], { w: 'w3', m: 'm3', M: 'm4' });
sprite('sword', ['.w.', '.w.', 'mmm', '.M.', '.M.', '.M.', '.M.', '.M.', '.M.', '.M.', '.M.', '.M.', '.M.', '.M.', '.m.'], { w: 'w2', m: 'm2', M: 'm4' });
sprite('sword_d', ['.w.', '.w.', 'mmm', '.M.', '.M.', '.M.', '.M.', '.m.', '.M.', '.M.', '.M.', '.M.', '.m.'], { w: 'd0', m: 'm1', M: 'd3' });
sprite('shield_r', [
  '...rrrr...', '..rRRRRr..', '.rRbRRbRr.', 'rRRRbbRRRr', 'rRRbmmbRRr', 'rRRbmmbRRr', 'rRRRbbRRRr', '.rRbRRbRr.', '..rRRRRr..', '...rrrr...',
], { r: 'm1', R: 'r2', b: 'b3', m: 'm3' });
recolor('shield_d', 'shield_r', { R: 'd1', b: 'd3', r: 'm0' });


/* ---------- the second wave of the cast ---------- */
sprite('head_spear', [
  '....ccccc....', '...cCCCCCc...', '..cCCCCCCCc..', '..cccccccccc.', '.fsssssssse..', '.fsssssssss..', '.fssssssSs...', '.fbbsssbbbb..', '..bbbbbbbbb..', '...bbbbbb....', '....bbb......', '.............',
], { c: 'w3', C: 'w5', f: 'w2', s: 's2', S: 's1', e: 'ink', b: 'b0' });
sprite('head_archer', [
  '....hhhhh....', '...hHHHHHh...', '..hHHHHHHHh..', '.hHHhhhhhhh..', '.hHhsssssse..', '.hHssssssss..', '.hHssssSss...', '.hHhsssssss..', '..hhdddddd...', '...hhdddd....', '....hhhh.....', '.............',
], { h: 'd1', H: 'd2', s: 's2', S: 's1', e: 'ink', d: 'w1' });
sprite('head_firepot', [
  '.............', '....rrrrr....', '...rRRRRRr...', '..rRRRRRRRrr.', '..rrrrrrrrr.r', '.qsssssssek..', '.qsskssssss..', '.qsssssksS...', '.qqsssssss...', '..qqsskss....', '...qqqqq.....', '.............',
], { r: 'r2', R: 'r3', q: 'w1', s: 's2', S: 's1', k: 'm1', e: 'ink' });
sprite('head_hook', [
  '.............', '....sssss....', '...sSSSSSs...', '..sSStSSSSs..', '..sStttSSSs..', '.ssSStSSSSe..', '.sSSSSSSSSSS.', '.sSSSSSSSs...', '.gbbSSSbbb...', '..bbbbbbbb...', '...bbbbbb....', '....bb.......',
], { s: 's1', S: 's2', t: 'n4', g: 'gold', b: 'w2', e: 'ink' });
sprite('head_drowned', [
  '...w.w.w.....', '..wwwwwwww...', '.wwgggggwww..', '.wgGGGGGGgw..', '.wgGGGGGxGg..', '.wgGkGGGGGG..', '.wgGGGGGGg...', '..wgGkkkG....', '..w.gggg.....', '..w..w.......', '.....w.......', '.............',
], { w: 't4', g: 'd2', G: 'd3', x: 'g2', k: 'd0' });
sprite('head_chief', [
  'h...........h', 'hh..mmmmm..hh', '.hhmMMMMMmhh.', '..mMMgMMMMm..', '.mmmmmmmmmmm.', '.bsssssNse...', '.bssssssNsss.', '.bbssssssss..', '.bbbbssbbbb..', '..bbbbbbbbb..', '..bbbBbbbbb..', '...bbbbbbb...',
], { h: 'b3', m: 'm1', M: 'gold', g: 'f5', N: 'm2', s: 's2', e: 'ink', b: 'b3', B: 'b2' });
sprite('torso_spear', [
  '....cccccc....', '..ccQQQQQQcc..', '.cQqQqQqQqQQc.', '.cQQQQQQQQQQc.', '.cqQqQqQqQqQc.', '.cQQQQQQQQQQc.', '.cqQqQqQqQqQc.', '.cBBBBBBByBBc.', '.cTTTTTTTTTTc.', '.cTTtTTTTtTTc.', '.cTTT....TTTc.', '.cTT......TTc.',
], { Q: 'b1', q: 'b0', c: 'w1', B: 'w1', y: 'm3', T: 'n4', t: 'n3' });
sprite('torso_archer', [
  'a.a.cccccc....', '.aaccLLLLLcc..', '..cLLlLLLLLLc.', '.cLLLlLLLLLLc.', '.cLLLLlLLLLLc.', '.cLLLLLlLLLLc.', '.cLLLLLLlLLLc.', '.cBBBBBBByBBc.', '.cTTTTTTTTTTc.', '.cTTtTTTTtTTc.', '.cTTT....TTTc.', '.cTT......TTc.',
], { a: 'b3', L: 'w3', l: 'w1', c: 'w1', B: 'w0', y: 'm3', T: 'd1', t: 'd0' });
sprite('torso_firepot', [
  '....cccccc....', '..ccsssssscc..', '.cssAAAAAAssc.', '.csAAAAAAAAsc.', '.csAAAAAAAAsc.', '.c.AAAAAAAA.c.', '.c.AAaAAaAA.c.', '.cBBBBBBBBBBc.', '.ppTTTTTTTTpp.', '.pPTTtTTTtTPp.', '..pTT....TTp..', '..TT......TT..',
], { s: 's2', c: 's1', A: 'w4', a: 'w2', B: 'w1', p: 'f1', P: 'f3', T: 'w2', t: 'w1' });
sprite('torso_hook', [
  '....ssssss....', '..ssSSSSSSss..', '.sSSHSSSSHSSs.', '.sSSSHSSHSSSs.', '.sSSSSHHSSSSs.', '.sSSSSHHSSSSs.', '.sSSSHSSHSSSs.', '.cBBBBBBBBBBc.', '.cTTTTTTTTTTc.', '.cTTtTTTTtTTc.', '.cTTT....TTTc.', '.cTT......TTc.',
], { s: 's1', S: 's2', H: 'w1', B: 'w0', T: 'w3', t: 'w2', c: 'w1' });
sprite('torso_drowned', [
  '....gggggg....', '..ggDDDDDDgg..', '.gDDdDDDdDDDg.', '.gDbDDDDDDbDg.', '.g.DDdDDdDD.g.', '.gDDDDbDDDDDg.', '.g.DdDDDDdD.g.', '.gDDwDDDwDDDg.', '.gTT.TTTT.TTg.', '.g.TtT.TtT..g.', '..T......T....', '..............',
], { g: 'd1', D: 'd2', d: 'd1', b: 'b1', w: 't4', T: 'd1', t: 'd0' });
sprite('torso_chief', [
  '.wwwwwwwwwwww.', 'wWWWWWWWWWWWWw', 'wWWmmmmmmmmWWw', 'wWmMMMMMMMMmWw', 'wWmMggggggMmWw', 'wwmMMMGMMMMmww', '.wmMMMMMMMMmw.', '.wBBBBByBBBBw.', '.wTTTTTTTTTTw.', '.wTTtTTTTtTTw.', '.wTTT....TTTw.', '..TT......TT..',
], { w: 'w2', W: 'w4', m: 'm1', M: 'm3', g: 'gold', G: 'f5', B: 'w0', y: 'gold', T: 'r1', t: 'r0' });
sprite('spear', ['.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', 'mmm', 'mMm', '.M.', '.M.', '.m.'], { w: 'w4', m: 'm2', M: 'm4' });
sprite('bow', ['s...................s', '.ss...............ss.', '..www...........www..', '.....wwww...wwww.....', '.........www.........'], { s: 'b3', w: 'w5' });
sprite('pot', ['..ff..', '..rr..', '.pPPp.', 'pPPPPp', 'pPpPPp', 'pPPPPp', '.pppp.'], { f: 'f5', r: 'w2', p: 'f1', P: 'f2' });
sprite('greatsword', ['.w..', '.w..', '.w..', '.w..', '.w..', 'mmmm', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.MM.', '.M..'], { w: 'w1', m: 'gold', M: 'm4' });
sprite('arrow', ['.b.', 'bwb', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.w.', '.m.', 'mMm', '.M.'], { b: 'b3', w: 'w4', m: 'm2', M: 'm4' });


const LOOKP = {
  captain: { head: 'head_captain', torso: 'torso_captain', leg: 'n3', legD: 'n2', sleeve: 'w3', hand: 's2', boot: 'boot', weapon: 'oar', grip: [1, 2], twoHand: true },
  raider: { head: 'head_raider', torso: 'torso_raider', leg: 'w3', legD: 'w2', sleeve: 'm1', hand: 's2', boot: 'boot', weapon: 'axe', grip: [1, 1] },
  shield: { head: 'head_raider2', torso: 'torso_shield', leg: 'n3', legD: 'n2', sleeve: 'm1', hand: 's3', boot: 'boot', weapon: 'sword', grip: [1, 1], shield: 'shield_r' },
  berserker: { head: 'head_berserker', torso: 'torso_berserker', leg: 'w3', legD: 'w2', sleeve: 's2', hand: 's2', boot: 'boot', weapon: 'bigaxe', grip: [2, 1], twoHand: true },
  thrower: { head: 'head_thrower', torso: 'torso_thrower', leg: 'd1', legD: 'd0', sleeve: 'w3', hand: 's2', boot: 'boot', weapon: 'axe', grip: [1, 1] },
  draugr: { head: 'head_draugr', torso: 'torso_draugr', leg: 'd1', legD: 'd0', sleeve: 'd2', hand: 'd3', boot: 'boot_d', weapon: 'sword_d', grip: [1, 1] },
  draugrShield: { head: 'head_draugr', torso: 'torso_draugr', leg: 'd1', legD: 'd0', sleeve: 'd2', hand: 'd3', boot: 'boot_d', weapon: 'sword_d', grip: [1, 1], shield: 'shield_d' },
};
Object.assign(LOOKP, {
  spear: { head: 'head_spear', torso: 'torso_spear', leg: 'n3', legD: 'n2', sleeve: 'b1', hand: 's2', boot: 'boot', weapon: 'spear', grip: [1, 12], twoHand: true },
  archer: { head: 'head_archer', torso: 'torso_archer', leg: 'd1', legD: 'd0', sleeve: 'w3', hand: 's2', boot: 'boot', weapon: 'bow', grip: [10, 4] },
  firepot: { head: 'head_firepot', torso: 'torso_firepot', leg: 'w2', legD: 'w1', sleeve: 's2', hand: 's2', boot: 'boot', weapon: 'pot', grip: [3, 1] },
  hookman: { head: 'head_hook', torso: 'torso_hook', leg: 'w3', legD: 'w2', sleeve: 's2', hand: 's2', boot: 'boot', weapon: 'grapple', grip: [2, 5] },
  drowned: { head: 'head_drowned', torso: 'torso_drowned', leg: 'd1', legD: 'd0', sleeve: 'd2', hand: 'd3', boot: 'boot_d', weapon: null, grip: [0, 0] },
  chieftain: { head: 'head_chief', torso: 'torso_chief', leg: 'r1', legD: 'r0', sleeve: 'w4', hand: 's2', boot: 'boot', weapon: 'greatsword', grip: [1, 3], twoHand: true },
});
const PUP = { c: offscreen(72, 72), s: offscreen(72, 72) };
PUP.g = PUP.c.getContext('2d'); PUP.sg = PUP.s.getContext('2d');
const FX0 = 36, FY0 = 60; // feet position inside the puppet canvas

/* Compose one character into the puppet canvas. pose: {run, moving, air, vy, crouch, weaponA, hurt, swim, down, rope, charge, tell} */
function composePuppet(type, pose) {
  const L = LOOKP[type], g = PUP.g; g.clearRect(0, 0, 72, 72);
  const WS = pose.wSpr ? WGRIP[pose.wSpr.replace(/_t\d$/, '')] : null, grip = WS ? WS[0] : L.grip, two = WS ? WS[1] : L.twoHand, AR = armourSprites(pose.gear);
  const cr = Math.round(pose.crouch * 3), bob = pose.moving ? (Math.abs(Math.sin(pose.run)) > 0.7 ? 1 : 0) : pose.breath;
  const hipX = FX0, hipY = FY0 - 10 + cr + bob;
  const lean = pose.hurt ? -2 : Math.round(pose.leanPx || 0), step = Math.round(pose.step || 0);
  // legs (back then front): thigh 6, shin 6
  const leg = (ph, col, boot, back) => {
    let kx, ky, fx, fy;
    if (pose.air) { kx = hipX + (back ? -2 : 3); ky = hipY + 3; fx = kx + (back ? -2 : -1); fy = ky + 4; if (pose.vy > 0) { ky += 1; fy += 1; } }
    else if (pose.moving) { const s = Math.sin(ph), c = Math.cos(ph); kx = hipX + s * 3.5; ky = hipY + 4 + Math.min(0, c) * 1.5; fx = hipX + s * 5.5 + (c > 0 ? 0 : -1); fy = FY0 - 3 - Math.max(0, -c) * 2.5; }
    else { const spread = (back ? -2 - pose.crouch * 2 - Math.max(0, step) * 0.4 : 2 + pose.crouch * 2 + step); kx = hipX + spread * 0.6 + (back ? 0 : pose.crouch * 1.5); ky = hipY + 4 - cr * 0.3; fx = hipX + spread; fy = FY0 - 3; }
    P.line(g, hipX + (back ? -2 : 1), hipY, kx, ky, col, 4); P.line(g, kx, ky, fx, fy, col, 4);
    blit(g, AR.boot || SPR[boot], fx - 2, fy);
  };
  if (pose.swim) {
    // only shoulders and head above water
  } else if (!pose.down) {
    leg(pose.run + Math.PI, L.legD, L.boot, true); leg(pose.run, L.leg, L.boot, false);
  }
  // back arm (shield or swing)
  const shX = hipX + lean + 1, shY = hipY - 9;
  const backA = pose.rope ? -2.6 : pose.air ? -2.2 : pose.moving ? Math.sin(pose.run) * 0.8 : 0.25;
  if (L.shield) {
    const sx = hipX + 3 + lean, sy = hipY - 8 + (pose.blocking ? -2 : 0);
    blit(g, SPR[L.shield], sx - 3, sy - 3);
  } else if (!two || pose.rope || pose.swim) {
    const hx = shX - 2 + Math.sin(-backA) * -6, hy = shY + Math.cos(backA) * 6;
    P.line(g, shX - 2, shY, hx, hy, shadeKey(L.sleeve), 2); P.dot(g, hx, hy, C[L.hand], 2);
  } else {
    // far arm reaches for the shaft (drawn behind the body)
    const wa0 = pose.weaponA, gx = shX + 1 - Math.sin(wa0) * 6 - Math.sin(wa0) * 5, gy = shY + 1 + Math.cos(wa0) * 6 + Math.cos(wa0) * 5;
    P.line(g, shX - 3, shY + 1, gx, gy, shadeKey(L.sleeve), 3);
  }
  // torso and head
  blit(g, SPR[L.torso], hipX + lean - 7, hipY - 11);
  const hy = hipY - 11 + (pose.hurt ? 1 : 0), hx = hipX + lean + (pose.lunge ? 1 : 0);
  if (AR.mantle) blit(g, AR.mantle, hipX + lean - 7, hipY - 12);
  blit(g, SPR[L.head], hx - 6, hy - 10);
  if (AR.helm) blit(g, AR.helm, hx - 6, hy - 10);
  if (pose.tell) { P.dot(g, hx + 4, hy - 7, C.r4, 1); }
  // front arm with weapon (weaponA: 0 = hanging down, rotation maps (0,1) -> (-sin, cos))
  const wa = pose.weaponA, ax = shX + 1, ay = shY + 1;
  const hx2 = ax - Math.sin(wa) * 6, hy2 = ay + Math.cos(wa) * 6;
  const W = SPR[pose.wSpr || L.weapon];
  if (W) blitRot(g, W, hx2, hy2, wa, grip[0], grip[1]);
  if (pose.nock) { const c = Math.cos(wa + Math.PI / 2), sn = Math.sin(wa + Math.PI / 2); P.line(g, hx2 - c * (3 + pose.nock * 5), hy2 - sn * (3 + pose.nock * 5), hx2 + c * 12, hy2 + sn * 12, C.w5, 1); P.dot(g, hx2 + c * 12, hy2 + sn * 12, C.m4); }
  if (pose.spin) { for (let i = 0; i < 6; i++) { const a = pose.spin + i * 0.5; P.dot(g, shX + Math.cos(a) * 9, shY - 12 + Math.sin(a) * 4, C.b2); } blit(g, SPR.grapple, shX + Math.cos(pose.spin + 3) * 9 - 2, shY - 14 + Math.sin(pose.spin + 3) * 4); }
  if (pose.charge > 0) { g.globalCompositeOperation = 'lighter'; const tipx = hx2 - Math.sin(wa) * 26, tipy = hy2 + Math.cos(wa) * 26; P.dither(g, tipx, tipy, 5 + Math.round(pose.charge * 3), C.f4, 0.5 + pose.charge * 0.4); g.globalCompositeOperation = 'source-over'; }
  P.line(g, ax, ay, hx2, hy2, C[L.sleeve], 3); P.dot(g, hx2, hy2, C[L.hand], 3);
  if (two && !pose.rope && !pose.swim) P.dot(g, hx2 - Math.sin(wa) * 5, hy2 + Math.cos(wa) * 5, C[L.hand], 3);
  return PUP.c;
}
function shadeKey(k) { const ramp = { w3: 'w2', m1: 'm0', s2: 's1', d2: 'd1', w2: 'w1' }; return C[ramp[k] || k]; }

/* Draw an actor into the buffer at its feet position, with outline, flash and rotation for tumbles. */
function drawPuppet(ctx, a, t) {
  const type = a.type, pose = {
    run: a.anim, moving: Math.abs(a.walkV || 0) > 25 && !a.air && !(a.atk || a.phase === 'strike'), air: a.air && !a.onRope && !a.swingPath ? true : !!a.swingPath, vy: a.vy, crouch: Math.max(a.crouch || 0, a.atkCrouch || 0),
    weaponA: a.weaponA, hurt: a.stun > 0.05 && !a.air, swim: a.water, down: a.down > 0 || (a.dead && !a.air && !a.water), rope: !!a.onRope || !!(a.swingPath && !a.swingPath.leap),
    wSpr: a.type === 'captain' ? wSprite(a.weapon, a) : null, gear: a.type === 'captain' ? captainGear() : null, charge: a.charge || 0, tell: a.tell, blocking: a.blocking, nock: a.nock || 0, spin: a.spinHook || 0, leanPx: a.atkLean || 0, step: a.atkStep || 0, breath: Math.sin(t * 2.2 + a.id * 9) > 0.6 ? 1 : 0,
  };
  if (a.dead && !a.air && !a.water && a.sinkT > 0.35 && Math.floor(a.sinkT * 16) % 2) return;
  // a phased wraith is a flicker of mist
  if (a.phased > 0 && Math.floor(performance.now() / 60) % 3) return;
  const img = composePuppet(type, pose);
  const jit = a.jitter > 0 && a.flash > 0.05 ? (Math.floor(performance.now() / 33) % 2 ? 1 : -1) * (a.jitter > 0.1 ? 2 : 1) : 0;
  const bx = Cam.bx(a.x) + jit, by = Cam.by(a.y) + (a.water ? 12 : 0);
  let rot = 0;
  if (a.spin) rot = a.spin; if (pose.down) rot = -Math.PI / 2 * 0.95;
  if (a.dodge > 0) rot = (a.spinRoll || 0);
  const flip = a.face < 0;
  // outline: silhouette offset in 4 directions
  PUP.sg.clearRect(0, 0, 72, 72); PUP.sg.drawImage(img, 0, 0); PUP.sg.globalCompositeOperation = 'source-in'; const white = a.flash > 0.05 && (!a.flashT0 || performance.now() - a.flashT0 < 60 || FX.hitstop <= 0 && a.flash > 0.5);
  const glow = a.charging ? (a.charge >= 1 ? C[Math.floor(performance.now() / 70) % 2 ? 'gold' : 'f4'] : a.chargeFlash > 0.3 ? C.f6 : a.charge > 0.45 ? C.f2 : null) : null;
  PUP.sg.fillStyle = white ? C.white : glow || C.ink; PUP.sg.fillRect(0, 0, 72, 72); PUP.sg.globalCompositeOperation = 'source-over';
  const sc = a.look && a.look.draw || 1;
  const drawAt = (im, ox, oy) => {
    if (sc !== 1) { ctx.save(); ctx.translate(Math.round(bx + ox * sc), Math.round(by + oy * sc)); if (flip) ctx.scale(-1, 1); if (rot) ctx.rotate(rot); ctx.drawImage(im, 0, 0, 72, 72, -FX0 * sc, -FY0 * sc, 72 * sc, 72 * sc); ctx.restore(); return; }
    if (rot) blitRot(ctx, im, bx + ox, by + oy - 14, rot, FX0, FY0 - 14, flip); else blit(ctx, im, bx + ox, by + oy, flip, FX0, FY0);
  };
  if (a.water) { ctx.save(); ctx.beginPath(); ctx.rect(bx - 40 * sc, by - 80 * sc, 80 * sc, 80 * sc - 8); ctx.clip(); }
  const ink = PUP.s;
  if (white) {
    // white hit frame
    const tmp = PUP.s; drawAt(tmp, 0, 0);
  } else {
    for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) drawAt(ink, ox, oy);
    drawAt(img, 0, 0);
  }
  if (a.water) ctx.restore();
}

/* Swing smear: a solid crescent between the weapon tip's recent angles, pinned at the shoulder.
   back = true draws the faint trailing part behind the body, false the bright edge in front. */
function drawSmear(ctx, a, back) {
  const s = a.smear; if (!s || s.k <= 0) return;
  let a0 = s.from, a1 = s.to; if (Math.abs(a1 - a0) < 0.1) return;
  const f = a.face, ox = Cam.bx(a.x) + f * (Math.round(a.atkLean || 0) + 1), oy = Cam.by(a.y) - 19 + Math.round((a.atkCrouch || 0) * 3);
  const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) * 12)), r2 = s.r;
  const outer = [], inner = [], edge = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, ang = lerp(a0, a1, u), band = (s.heavy ? 15 : 11) * s.k, ri = lerp(r2 - 1, r2 - band, Math.pow(u, 0.7));
    const c = Math.cos(ang) * f, sn = Math.sin(ang);
    outer.push([ox + c * (r2 + 1), oy + sn * (r2 + 1)]); inner.push([ox + c * ri, oy + sn * ri]); edge.push([ox + c * (r2 - 2 - u * 2), oy + sn * (r2 - 2 - u * 2)]);
  }
  const poly = (A, B, col) => { ctx.fillStyle = col; ctx.beginPath(); A.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); for (let i = B.length - 1; i >= 0; i--) ctx.lineTo(B[i][0], B[i][1]); ctx.closePath(); ctx.fill(); };
  const K = s.col; // a weapon's tier colours its smear: [back, bright, edge]
  if (back) { poly(outer, inner, K ? C[K[0]] : s.heavy ? C.f3 : C.b1); return; }
  const half = Math.floor(n * 0.35);
  poly(outer.slice(half), edge.slice(half), K ? C[K[1]] : s.heavy ? C.f6 : C.b4);
  poly(outer.slice(Math.floor(n * 0.7)), edge.slice(Math.floor(n * 0.7)), K ? C[K[2]] : C.white);
}

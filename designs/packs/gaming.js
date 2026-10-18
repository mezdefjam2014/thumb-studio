// Gaming pack: 10 layouts from docs/RESEARCH.md §5 x 8 game palettes = 80 templates.
// d.cover = gameplay screenshot, d.person = your face (facecam), d.person2 = character/boss, d.item = weapon/logo.
import { pop } from '../../core/pop.js';

function game(x, W, H, d, K, P) {
  const U = pop(x, W, H, d, K, P), u = U.u, r = K.rnd;
  const fill = (img, bx, by, bw, bh) => { const s = Math.max(bw / img.width, bh / img.height); x.drawImage(img, bx + (bw - img.width * s) / 2, by + (bh - img.height * s) / 2, img.width * s, img.height * s); };

  // Screenshot (enhanced) or stylised arena gradient with perspective grid.
  U.arena = (o = {}) => {
    const g = x.createRadialGradient(W * .6, H * .4, 0, W * .6, H * .4, Math.hypot(W, H) * .65);
    g.addColorStop(0, P.bg[0]); g.addColorStop(1, P.bg[1]); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (d.cover && !o.noShot) {
      x.save(); x.filter = `saturate(1.5) contrast(1.2) brightness(${o.dim ?? .9})`; fill(d.cover, 0, 0, W, H); x.restore();
      x.save(); x.globalCompositeOperation = 'soft-light'; x.fillStyle = P.glow; x.globalAlpha = .35; x.fillRect(0, 0, W, H); x.restore();
    } else {
      x.save(); x.strokeStyle = P.glow; x.globalAlpha = .18; x.lineWidth = 2 * u; const hz = H * .62;
      for (let i = -12; i <= 12; i++) { x.beginPath(); x.moveTo(W / 2 + i * 30 * u, hz); x.lineTo(W / 2 + i * 260 * u, H); x.stroke(); }
      for (let i = 1; i < 9; i++) { const y = hz + (H - hz) * (i / 9) ** 1.7; x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
      x.restore(); U.glow(W * .5, H * .62, W * .4, P.glow, .35);
    }
  };
  U.speed = (cx, cy, n = 46) => { x.save(); x.strokeStyle = 'rgba(255,255,255,.22)'; for (let i = 0; i < n; i++) { const a = r() * 6.283, r0 = Math.min(W, H) * (.35 + r() * .2), r1 = Math.hypot(W, H); x.lineWidth = (1 + r() * 4) * u; x.beginPath(); x.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); x.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); x.stroke(); } x.restore(); };

  // Character art placeholder: armoured silhouette with glowing eyes.
  const hero = () => { const c = document.createElement('canvas'); c.width = 600; c.height = 800; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 800); gr.addColorStop(0, '#3b4252'); gr.addColorStop(1, '#14171f'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(300, 60); g.lineTo(420, 140); g.lineTo(410, 330); g.lineTo(300, 390); g.lineTo(190, 330); g.lineTo(180, 140); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(40, 800); g.lineTo(70, 480); g.lineTo(200, 400); g.lineTo(400, 400); g.lineTo(530, 480); g.lineTo(560, 800); g.closePath(); g.fill();
    g.fillStyle = P.glow; g.shadowColor = P.glow; g.shadowBlur = 30; g.fillRect(215, 215, 70, 18); g.fillRect(315, 215, 70, 18); return c; };
  U.char = (cx, bottom, h, o = {}) => U.cutout(d.person2 || hero(), cx, bottom, h, { line: P.glow, ow: 6, rim: P.glow, flip: o.flip, filter: o.filter });
  U.me = (cx, bottom, h, o = {}) => U.cutout(d.person, cx, bottom, h, { line: P.pop, ow: 8, rim: P.pop, flip: o.flip });

  U.bolt = (x1, y1, x2, y2) => { const pts = [[x1, y1]], n = 9; for (let i = 1; i < n; i++) { const t = i / n; pts.push([x1 + (x2 - x1) * t + (r() - .5) * 80 * u, y1 + (y2 - y1) * t]); } pts.push([x2, y2]);
    x.save(); x.lineJoin = 'miter'; x.shadowColor = P.glow; x.shadowBlur = 40 * u; for (const [c, w] of [[P.glow, 18], ['#fff', 6]]) { x.strokeStyle = c; x.lineWidth = w * u; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); } x.restore(); };

  U.rank = (cx, cy, s) => { x.save(); x.translate(cx, cy); x.shadowColor = P.glow; x.shadowBlur = 40 * u;
    const g = x.createLinearGradient(0, -s, 0, s); g.addColorStop(0, '#fff6c2'); g.addColorStop(.5, P.fg); g.addColorStop(1, '#7a5200'); x.fillStyle = g;
    x.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; x.lineTo(Math.cos(a) * s, Math.sin(a) * s); } x.closePath(); x.fill(); x.shadowColor = 'transparent';
    x.strokeStyle = '#fff'; x.lineWidth = 6 * u; x.stroke(); x.fillStyle = P.bg[1];
    for (let i = 0; i < 3; i++) { const y = -s * .35 + i * s * .3; x.beginPath(); x.moveTo(-s * .45, y); x.lineTo(0, y + s * .22); x.lineTo(s * .45, y); x.lineTo(s * .45, y + s * .12); x.lineTo(0, y + s * .34); x.lineTo(-s * .45, y + s * .12); x.fill(); }
    x.restore(); };

  U.glitch = (n = 14) => { for (let i = 0; i < n; i++) { const y = r() * H, h = (6 + r() * 30) * u, dx = (r() - .5) * 60 * u; x.drawImage(x.canvas, 0, y, W, h, dx, y, W, h); }
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = .5; for (let i = 0; i < 5; i++) { x.fillStyle = i % 2 ? '#ff0040' : '#00e5ff'; x.fillRect(0, r() * H, W, (2 + r() * 6) * u); } x.restore(); };

  U.burst = (txt, cx, cy, s) => { x.save(); x.translate(cx, cy); x.rotate(-.15); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 20 * u; x.fillStyle = P.pop; x.beginPath();
    for (let i = 0; i < 28; i++) { const rr = i % 2 ? s * .78 : s; const a = i * Math.PI / 14; x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } x.closePath(); x.fill(); x.shadowColor = 'transparent'; x.strokeStyle = '#fff'; x.lineWidth = 5 * u; x.stroke();
    x.fillStyle = '#fff'; x.font = `${s * .55}px Anton, Impact, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, s * .04); x.restore(); };

  U.facecam = (cx, cy, rad) => { x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 30 * u; x.fillStyle = P.bg[1]; x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.fill(); x.shadowColor = 'transparent'; x.clip();
    U.cutout(d.person, cx, cy + rad, rad * 2.1, { ow: 0, rim: P.pop }); x.restore();
    x.strokeStyle = P.pop; x.lineWidth = 10 * u; x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.stroke(); x.strokeStyle = '#fff'; x.lineWidth = 4 * u; x.stroke(); };

  U.stat = (label, val, bx, by, w) => { const h = 46 * u; x.fillStyle = 'rgba(0,0,0,.65)'; x.beginPath(); x.roundRect(bx, by, w, h, 8 * u); x.fill();
    x.fillStyle = '#fff'; x.font = `${h * .5}px Anton, Impact, sans-serif`; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(label, bx + 12 * u, by + h / 2);
    const bw = w * .5, bx2 = bx + w - bw - 12 * u; x.fillStyle = 'rgba(255,255,255,.2)'; x.fillRect(bx2, by + h * .35, bw, h * .3); x.fillStyle = P.pop; x.fillRect(bx2, by + h * .35, bw * val, h * .3); };

  U.tile = (img, b, rot, label) => U.imgBox(img, b, { rot, label });
  U.title = (txt, b, o = {}) => U.words(txt, b, { ext: 10, extC: P.st, glow: P.glow, sw: .1, ...o });
  U.end = (o = {}) => U.finish({ vig: o.vig ?? .5, grain: .04 });
  return U;
}

const G = (name, draw) => ({ name, niche: 'gaming', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) { draw(x, W, H, d, game(x, W, H, d, K, P), K.wide, P); } });
const two = (d) => d.big.split(/\s+/).slice(0, 2).join(' ');

export default [
  G('FACE + BOSS', (x, W, H, d, U, w) => {
    U.arena({ dim: .7 });
    if (w) { U.char(.68 * W, H * .92, .92 * H); U.me(.18 * W, H * 1.02, .7 * H); U.title(two(d), U.box([.03, .04, .42, .26]), { align: 'left' }); }
    else { U.char(.55 * W, .62 * H, .5 * H); U.me(.3 * W, .95 * H, .36 * H); U.title(two(d), U.box([.06, .08, .76, .14])); }
    U.end();
  }),
  G('RIM-LIT HERO', (x, W, H, d, U, w) => {
    U.arena({ dim: .6 }); U.speed(w ? .3 * W : .5 * W, w ? .5 * H : .45 * H);
    if (w) { U.glow(.3 * W, .55 * H, .55 * H, '#fff', .15); U.char(.3 * W, H * 1.02, .95 * H); U.title(d.big, U.box([.55, .2, .41, .45]), { maxLines: 3 }); }
    else { U.char(.5 * W, .78 * H, .56 * H); U.title(d.big, U.box([.06, .08, .76, .15])); }
    U.end();
  }),
  G('VERSUS SCREEN', (x, W, H, d, U, w, P) => {
    U.arena({ noShot: true });
    x.save(); x.globalAlpha = .55; x.fillStyle = P.pop; w ? x.fillRect(0, 0, W / 2, H) : x.fillRect(0, 0, W, H / 2); x.restore();
    if (w) { U.me(.25 * W, H * 1.02, .82 * H); U.char(.76 * W, H * .9, .8 * H, { flip: true }); U.bolt(.5 * W, 0, .5 * W, H); U.title('VS', U.box([.42, .36, .16, .2])); U.title(two(d), U.box([.03, .03, .4, .16]), { align: 'left' }); }
    else { U.me(.5 * W, .5 * H, .32 * H); U.char(.5 * W, .88 * H, .32 * H, { flip: true }); U.bolt(0, .5 * H, W, .5 * H); U.title('VS', U.box([.35, .46, .3, .08])); U.title(two(d), U.box([.06, .07, .76, .1])); }
    U.end();
  }),
  G('RANK UP', (x, W, H, d, U, w) => {
    U.arena({ dim: .65 });
    if (w) { U.rank(.8 * W, .26 * H, .19 * H); U.me(.24 * W, H * 1.02, .82 * H); U.title(d.big, U.box([.42, .42, .36, .4]), { maxLines: 2 }); }
    else { U.rank(.5 * W, .24 * H, .1 * H); U.me(.5 * W, .92 * H, .46 * H); U.title(d.big, U.box([.06, .36, .76, .1])); }
    U.end();
  }),
  G('LOADOUT', (x, W, H, d, U, w) => {
    U.arena({ dim: .55 });
    const b = U.box(w ? [.08, .22, .6, .44] : [.08, .22, .84, .26]);
    d.item ? U.cutout(d.item, b.x + b.w / 2, b.y + b.h, b.h, { line: '#fff', ow: 6, rim: '#fff' }) : U.tile(null, b, -.18, 'WEAPON');
    const sb = U.box(w ? [.7, .2, .26, .34] : [.12, .52, .66, .18]);
    [['DMG', .92], ['RNG', .7], ['FIRE', .84]].forEach(([l, v], i) => U.stat(l, v, sb.x, sb.y + i * sb.h / 3, sb.w));
    x.fillStyle = 'rgba(0,0,0,.6)'; w ? x.fillRect(0, .72 * H, .66 * W, .22 * H) : x.fillRect(0, .74 * H, W, .12 * H);
    U.title(d.big, U.box(w ? [.03, .73, .6, .2] : [.06, .75, .76, .1]), { align: w ? 'left' : 'center' });
    U.end();
  }),
  G('SECRET FOUND', (x, W, H, d, U, w, P) => {
    U.arena({ dim: .85 }); U.glitch();
    U.ring(w ? .66 * W : .6 * W, w ? .5 * H : .4 * H, w ? .12 * H : .13 * W, P.pop);
    U.arrow(w ? .4 * W : .25 * W, w ? .32 * H : .25 * H, w ? .56 * W : .5 * W, w ? .44 * H : .36 * H, { color: P.pop });
    U.title('SECRET?', U.box(w ? [.03, .04, .4, .22] : [.06, .08, .76, .12]), { align: w ? 'left' : 'center' });
    w ? U.facecam(.15 * W, .78 * H, .18 * H) : U.facecam(.28 * W, .7 * H, .16 * W);
    U.end();
  }),
  G('SCREENSHOT + FACECAM', (x, W, H, d, U, w) => {
    U.arena({ dim: 1 }); if (!d.cover) U.tile(null, { x: -10, y: -10, w: W + 20, h: H + 20 }, 0, 'GAMEPLAY');
    w ? U.facecam(.16 * W, .76 * H, .2 * H) : U.facecam(.3 * W, .7 * H, .18 * W);
    U.title(d.big, U.box(w ? [.32, .04, .64, .26] : [.06, .08, .76, .14]));
    U.end({ vig: .35 });
  }),
  G('GIANT NUMBER', (x, W, H, d, U, w) => {
    U.arena({ dim: .55 });
    if (w) { U.char(.74 * W, H * 1.02, .9 * H); U.title(U.num('LVL 1'), U.box([.04, .16, .5, .4])); U.title(U.rest(), U.box([.04, .6, .5, .16])); }
    else { U.char(.5 * W, .9 * H, .5 * H); U.title(U.num('LVL 1'), U.box([.06, .1, .76, .2])); U.title(U.rest(), U.box([.06, .31, .76, .07])); }
    U.end();
  }),
  G('HORROR PEEK', (x, W, H, d, U, w, P) => {
    U.arena({ dim: .3 });
    if (!d.cover) { x.fillStyle = '#020203'; x.fillRect(0, 0, W, H); const cx = w ? .65 * W : .5 * W; x.fillStyle = '#0b0c0e'; x.beginPath(); x.moveTo(cx - .1 * W, .3 * H); x.lineTo(cx + .1 * W, .3 * H); x.lineTo(W, H); x.lineTo(0, H); x.fill(); }
    x.save(); x.globalCompositeOperation = 'screen'; const g = x.createRadialGradient(w ? .65 * W : .5 * W, .45 * H, 0, w ? .65 * W : .5 * W, .45 * H, H * .4); g.addColorStop(0, 'rgba(255,240,200,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.restore();
    U.char(w ? .65 * W : .5 * W, w ? .8 * H : .55 * H, w ? .6 * H : .3 * H, { filter: 'brightness(.25)' });
    const ex = w ? .65 * W : .5 * W, ey = (w ? .8 - .6 * .72 : .55 - .3 * .72) * H; for (const s of [-1, 1]) U.glow(ex + s * (w ? 22 : 30) * U.u, ey, 30 * U.u, P.pop, .95);
    U.me(w ? .17 * W : .28 * W, w ? H * 1.02 : .95 * H, w ? .6 * H : .3 * H);
    U.title(two(d), U.box(w ? [.03, .04, .44, .24] : [.06, .08, .76, .12]), { align: w ? 'left' : 'center' });
    U.end({ vig: .75 });
  }),
  G('UPDATE BURST', (x, W, H, d, U, w) => {
    U.arena({ dim: .6 }); U.speed(W / 2, H / 2);
    const t = w ? [[.3, .1, .4, .42], [.08, .5, .36, .4], [.56, .5, .36, .4]] : [[.2, .2, .6, .2], [.06, .44, .42, .17], [.52, .44, .42, .17]];
    t.forEach((b, i) => U.tile(i ? d.cover : d.item || d.cover, U.box(b), (i - 1) * .04, ['LOGO', 'NEW MAP', 'NEW ITEM'][i]));
    U.burst('NEW', w ? .12 * W : .2 * W, w ? .16 * H : .14 * H, w ? .13 * H : .12 * W);
    U.title(d.big, U.box(w ? [.56, .02, .42, .3] : [.06, .66, .76, .1]));
    U.end();
  })
];

// 8 palettes from research §5. bg = [glow, base], fg = text, pop = accent, glow = rim/neon.
export const GAME_PRESETS = [
  { name: 'BATTLE ROYALE', bg: ['#7a55ff', '#22097a'], fg: '#ffd400', st: '#14004a', pop: '#00e5ff', glow: '#00e5ff' },
  { name: 'BLOCK EARTH', bg: ['#8fd3ff', '#2e7d32'], fg: '#ffffff', st: '#3b2414', pop: '#7a4b2a', glow: '#4caf50' },
  { name: 'HORROR', bg: ['#2a0a0e', '#050607'], fg: '#b8c7c0', st: '#000000', pop: '#d0001c', glow: '#7a0010' },
  { name: 'CYBERPUNK', bg: ['#24124a', '#0a0a1a'], fg: '#fcee0a', st: '#0a0a1a', pop: '#ff2a6d', glow: '#05d9e8' },
  { name: 'RETRO ARCADE', bg: ['#3a0a7a', '#12003b'], fg: '#f9ed69', st: '#12003b', pop: '#ff2e63', glow: '#08d9d6' },
  { name: 'SCI-FI', bg: ['#14425e', '#0b1e2d'], fg: '#f4f4f4', st: '#0b1e2d', pop: '#ff7a1a', glow: '#00c2b8' },
  { name: 'FANTASY GOLD', bg: ['#3a2370', '#1a0f2e'], fg: '#f2b632', st: '#1a0f2e', pop: '#6e3ff3', glow: '#f2b632' },
  { name: 'RED VS BLUE', bg: ['#1a2550', '#0b1020'], fg: '#ffffff', st: '#0b1020', pop: '#ff3b3b', glow: '#2e7bff' }
];

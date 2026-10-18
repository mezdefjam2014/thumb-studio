// Music pack: 10 layouts from docs/RESEARCH.md §4 x 8 genre palettes = 80 templates.
// d.cover = cover art, d.person = artist cut-out, d.item = prop. d.bpm / d.key / d.label feed the badges.
import { pop } from '../../core/pop.js';

function music(x, W, H, d, K, P) {
  const U = pop(x, W, H, d, K, P), u = U.u, r = K.rnd;
  const fill = (img, bx, by, bw, bh) => { const s = Math.max(bw / img.width, bh / img.height); x.drawImage(img, bx + (bw - img.width * s) / 2, by + (bh - img.height * s) / 2, img.width * s, img.height * s); };

  U.mood = (o = {}) => {
    const g = x.createRadialGradient(W * (o.lx ?? .6), H * (o.ly ?? .45), 0, W * (o.lx ?? .6), H * (o.ly ?? .45), Math.hypot(W, H) * .62);
    g.addColorStop(0, P.bg[0]); g.addColorStop(1, P.bg[1]); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (d.cover && o.art !== false) { x.save(); x.globalAlpha = .45; x.filter = `blur(${24 * u}px) saturate(1.3)`; fill(d.cover, -40 * u, -40 * u, W + 80 * u, H + 80 * u); x.restore(); x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0, 0, W, H); }
    x.save(); x.globalCompositeOperation = 'screen'; U.glow(W * .1, H * .05, Math.max(W, H) * .4, P.pop, .22); U.glow(W * .95, H * .95, Math.max(W, H) * .35, P.alt, .2); x.restore();
  };
  // Hooded artist placeholder (stylised, no real likeness).
  const hood = () => { const c = document.createElement('canvas'); c.width = 600; c.height = 800; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 600, 800); gr.addColorStop(0, '#2a2a33'); gr.addColorStop(1, '#0c0c10'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(300, 40); g.bezierCurveTo(470, 40, 500, 260, 470, 420); g.lineTo(560, 520); g.lineTo(590, 800); g.lineTo(10, 800); g.lineTo(40, 520); g.lineTo(130, 420); g.bezierCurveTo(100, 260, 130, 40, 300, 40); g.fill();
    g.fillStyle = '#050507'; g.beginPath(); g.ellipse(300, 290, 120, 150, 0, 0, 7); g.fill(); g.fillStyle = P.pop; g.globalAlpha = .7; g.fillRect(225, 300, 150, 10); return c; };
  U.artist = (cx, bottom, h, o = {}) => U.cutout(d.person || hood(), cx, bottom, h, { ow: o.ow ?? 0, line: P.pop, rim: o.rim ?? P.pop, flip: o.flip, filter: o.filter || 'contrast(1.15) saturate(.9)' });

  U.art = (b, rot = 0) => U.imgBox(d.cover, b, { rot, r: 6, label: 'COVER' });
  U.badge2 = (txt, cx, cy, s = 26) => U.badge(txt, cx, cy, { size: s, bg: 'rgba(0,0,0,.55)', fg: P.fg });
  U.meta = () => [d.bpm && `${d.bpm} BPM`, d.key].filter(Boolean).join(' · ') || '140 BPM · C MINOR';

  U.wave = (by, bh, o = {}) => { const n = o.n || 90, bw = W / n; x.save(); x.shadowColor = P.pop; x.shadowBlur = 18 * u;
    for (let i = 0; i < n; i++) { const t = i / n, env = .25 + .75 * Math.abs(Math.sin(t * Math.PI * 3.2)) * (0.5 + r() * .5), h = bh * env; const g = x.createLinearGradient(0, by + bh / 2 - h / 2, 0, by + bh / 2 + h / 2); g.addColorStop(0, P.pop); g.addColorStop(1, P.alt); x.fillStyle = g; x.fillRect(i * bw + bw * .2, by + bh / 2 - h / 2, bw * .6, h); }
    x.restore(); };
  U.eq = (bx, by, bw, bh, n = 14) => { const cw = bw / n; for (let i = 0; i < n; i++) { const lv = Math.floor((.3 + r() * .7) * 10); for (let j = 0; j < lv; j++) { x.fillStyle = j > 7 ? P.pop : j > 5 ? P.alt : P.fg; x.globalAlpha = .85; x.fillRect(bx + i * cw + 2 * u, by + bh - (j + 1) * bh / 10 + 2 * u, cw - 4 * u, bh / 10 - 4 * u); } } x.globalAlpha = 1; };

  U.vinyl = (cx, cy, R, rot = 0) => { x.save(); x.translate(cx, cy); x.rotate(rot); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 40 * u; x.fillStyle = '#0b0b0d'; x.beginPath(); x.arc(0, 0, R, 0, 7); x.fill(); x.shadowColor = 'transparent';
    x.strokeStyle = 'rgba(255,255,255,.05)'; x.lineWidth = 1.4 * u; for (let i = R * .38; i < R * .97; i += 5 * u) { x.beginPath(); x.arc(0, 0, i, 0, 7); x.stroke(); }
    const sh = x.createLinearGradient(-R, -R, R, R); sh.addColorStop(.35, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,255,.14)'); sh.addColorStop(.65, 'rgba(255,255,255,0)'); x.fillStyle = sh; x.beginPath(); x.arc(0, 0, R, 0, 7); x.fill();
    x.fillStyle = P.pop; x.beginPath(); x.arc(0, 0, R * .34, 0, 7); x.fill(); x.save(); x.clip(); if (d.cover) fill(d.cover, -R * .34, -R * .34, R * .68, R * .68); x.restore();
    x.fillStyle = '#000'; x.beginPath(); x.arc(0, 0, R * .03, 0, 7); x.fill(); x.restore(); };

  // 3D sample-pack box: cover on the front, darker side + top.
  U.packBox = (b) => { const dx = b.w * .16, dy = b.h * .1; x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 40 * u; x.shadowOffsetY = 20 * u;
    x.fillStyle = P.bg[1]; x.beginPath(); x.moveTo(b.x + b.w - dx, b.y + dy); x.lineTo(b.x + b.w, b.y); x.lineTo(b.x + b.w, b.y + b.h - dy); x.lineTo(b.x + b.w - dx, b.y + b.h); x.closePath(); x.fill(); x.restore();
    x.fillStyle = P.alt; x.beginPath(); x.moveTo(b.x, b.y + dy); x.lineTo(b.x + dx, b.y); x.lineTo(b.x + b.w, b.y); x.lineTo(b.x + b.w - dx, b.y + dy); x.closePath(); x.fill();
    U.imgBox(d.cover, { x: b.x, y: b.y + dy, w: b.w - dx, h: b.h - dy }, { r: 2, label: 'PACK ART' }); };

  U.icon = (k, cx, cy, s) => { x.save(); x.translate(cx, cy); x.shadowColor = P.pop; x.shadowBlur = 18 * u; x.strokeStyle = P.fg; x.fillStyle = P.fg; x.lineWidth = s * .09; x.lineCap = 'round';
    if (k === 0) { x.font = `${s * 1.6}px serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('♫', 0, 0); }
    if (k === 1) { x.beginPath(); x.roundRect(-s * .55, -s * .8, s * 1.1, s * 1.6, s * .15); x.stroke(); x.beginPath(); x.arc(0, s * .25, s * .35, 0, 7); x.stroke(); x.beginPath(); x.arc(0, -s * .4, s * .15, 0, 7); x.stroke(); }
    if (k === 2) { x.strokeRect(-s, -s * .45, s * 2, s * .9); for (let i = 1; i < 7; i++) { x.beginPath(); x.moveTo(-s + i * s * 2 / 7, -s * .45); x.lineTo(-s + i * s * 2 / 7, s * .45); x.stroke(); } }
    if (k === 3) { x.beginPath(); x.arc(0, 0, s * .8, Math.PI, 0); x.stroke(); x.fillRect(-s * .95, -s * .05, s * .35, s * .6); x.fillRect(s * .6, -s * .05, s * .35, s * .6); }
    if (k === 4) { x.beginPath(); x.roundRect(-s * .3, -s * .9, s * .6, s * 1.1, s * .3); x.fill(); x.beginPath(); x.arc(0, -s * .2, s * .55, 0, Math.PI); x.stroke(); x.beginPath(); x.moveTo(0, s * .35); x.lineTo(0, s * .8); x.stroke(); }
    if (k === 5) { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { x.globalAlpha = (i + j) % 3 ? .9 : .5; x.fillRect(-s * .8 + i * s * .42, -s * .8 + j * s * .42, s * .34, s * .34); } }
    x.restore(); };

  U.chroma = (px = 5) => { const c = document.createElement('canvas'); c.width = W; c.height = H; c.getContext('2d').drawImage(x.canvas, 0, 0);
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = .35; x.filter = 'sepia(1) saturate(6) hue-rotate(-50deg)'; x.drawImage(c, px * u, 0); x.filter = 'sepia(1) saturate(6) hue-rotate(150deg)'; x.drawImage(c, -px * u, 0); x.restore(); };
  U.vhs = () => { x.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < H; y += 3 * u) x.fillRect(0, y, W, 1.2 * u); x.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 4; i++) x.fillRect(0, r() * H, W, (2 + r() * 5) * u); };

  // Title + small "TYPE BEAT"/label line at ~45% size, like the research spec.
  U.title = (b, o = {}) => { const s = U.words(d.title, b, { sw: .08, ...o }); const lab = o.sub ?? d.label; if (lab) U.words(lab, { x: b.x, y: b.y + b.h + 6 * u, w: b.w, h: Math.min(b.h * .3, s * .45) }, { sw: .08, fill: P.pop, align: o.align }); return s; };
  U.neon = (txt, b, o = {}) => { U.words(txt, b, { stroke: 'transparent', sw: 0, glow: P.pop, fill: '#ffffff', ...o }); U.words(txt, b, { stroke: 'transparent', sw: 0, glow: P.pop, fill: 'rgba(255,255,255,.95)', ...o }); };
  U.end = (o = {}) => U.finish({ vig: o.vig ?? .5, grain: o.grain ?? .06 });
  return U;
}

const M = (name, draw) => ({ name, niche: 'music', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) { draw(x, W, H, d, music(x, W, H, d, K, P), K.wide, P); } });

export default [
  M('ARTIST TYPE BEAT', (x, W, H, d, U, w) => {
    U.mood({ lx: .72 });
    if (w) { U.artist(.72 * W, H * 1.02, .98 * H); U.title(U.box([.04, .26, .46, .34]), { align: 'left' }); U.badge2(U.meta(), .16 * W, .9 * H); }
    else { U.artist(.5 * W, .7 * H, .58 * H); U.title(U.box([.06, .68, .76, .13])); U.badge2(U.meta(), .44 * W, .87 * H, 30); }
    U.end();
  }),
  M('GLOW POSTER', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .5, ly: .38 });
    x.save(); x.globalCompositeOperation = 'screen'; U.glow(W / 2, (w ? .38 : .34) * H, w ? .5 * H : .5 * W, P.pop, .7); x.restore();
    U.art(U.box(w ? [.37, .08, .26, .46] : [.18, .14, .64, .36]));
    U.title(U.box(w ? [.12, .64, .76, .18] : [.06, .56, .76, .1]));
    U.end();
  }),
  M('WAVEFORM', (x, W, H, d, U, w) => {
    U.mood({ lx: .5 });
    U.wave((w ? .44 : .44) * H, (w ? .2 : .12) * H);
    U.title(U.box(w ? [.04, .08, .8, .28] : [.06, .14, .76, .13]), { align: w ? 'left' : 'center' });
    U.badge2(U.meta(), w ? .17 * W : .44 * W, w ? .76 * H : .64 * H, w ? 26 : 30);
    U.end();
  }),
  M('VINYL', (x, W, H, d, U, w) => {
    U.mood({ lx: .6 });
    if (w) { U.art(U.box([.28, .14, .36, .64]), -.03); U.vinyl(.74 * W, .5 * H, .44 * H, K0(d)); U.title(U.box([.03, .05, .26, .34]), { align: 'left', maxLines: 3 }); }
    else { U.art(U.box([.1, .12, .62, .35]), -.03); U.vinyl(.72 * W, .4 * H, .32 * W, K0(d)); U.title(U.box([.06, .62, .76, .1])); }
    U.end();
  }),
  M('SAMPLE PACK BOX', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .3 });
    const lines = [`${(d.big.match(/\d+/) || ['100'])[0]} LOOPS`, 'ONE SHOTS', 'STEMS + MIDI'];
    if (w) { U.packBox(U.box([.06, .12, .36, .76])); U.title(U.box([.5, .1, .46, .2]), { align: 'left', sub: '' }); lines.forEach((l, i) => U.words('• ' + l, U.box([.5, .38 + i * .12, .44, .09]), { align: 'left', sw: .06, fill: i ? P.fg : P.pop })); }
    else { U.packBox(U.box([.16, .12, .68, .38])); U.title(U.box([.06, .55, .76, .09]), { sub: '' }); lines.forEach((l, i) => U.words(l, U.box([.1, .68 + i * .055, .68, .045]), { sw: .06, fill: i ? P.fg : P.pop })); }
    U.end();
  }),
  M('ICON COLLAGE', (x, W, H, d, U, w) => {
    U.mood({ lx: .5 });
    const pts = w ? [[.12, .2], [.88, .2], [.1, .78], [.9, .78], [.5, .12], [.5, .88]] : [[.2, .14], [.8, .14], [.2, .74], [.8, .74], [.5, .1], [.5, .82]];
    pts.forEach(([px, py], i) => U.icon(i, px * W, py * H, (w ? .07 * H : .06 * W)));
    U.title(U.box(w ? [.2, .32, .6, .26] : [.08, .36, .74, .12]));
    U.end();
  }),
  M('VIDEO FRAME', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .3 });
    if (d.cover) { x.save(); x.filter = 'contrast(1.1) saturate(1.1)'; U.imgBox(d.cover, { x: -10, y: -10, w: W + 20, h: H + 20 }, { r: 0 }); x.restore(); }
    U.artist(w ? .3 * W : .5 * W, w ? H * 1.02 : .72 * H, w ? .8 * H : .5 * H, { rim: P.alt });
    x.fillStyle = '#000'; x.fillRect(0, 0, W, H * .07); x.fillRect(0, H * .93, W, H * .07);
    U.fade(w ? 'right' : 'bottom', .45, 'rgba(0,0,0,.7)');
    U.title(U.box(w ? [.48, .6, .48, .2] : [.06, .72, .76, .11]), { align: w ? 'right' : 'center', sub: d.label || 'OFFICIAL VIDEO' });
    U.end();
  }),
  M('NEON SIGN', (x, W, H, d, U, w, P) => {
    x.fillStyle = P.bg[1]; x.fillRect(0, 0, W, H);
    x.fillStyle = 'rgba(255,255,255,.03)'; for (let yy = 0; yy < H; yy += 40 * U.u) for (let xx = (yy / 40 % 2) * 40 * U.u; xx < W; xx += 80 * U.u) x.fillRect(xx, yy, 78 * U.u, 38 * U.u);
    const b = U.box(w ? [.1, .28, .6, .32] : [.06, .3, .76, .16]);
    U.neon(d.title, b);
    x.save(); x.globalAlpha = .25; x.translate(0, (b.y + b.h) * 2 + 8 * U.u); x.scale(1, -1); U.neon(d.title, b); x.restore();
    const g = x.createLinearGradient(0, b.y + b.h, 0, b.y + b.h * 2.2); g.addColorStop(0, 'rgba(0,0,0,.4)'); g.addColorStop(1, P.bg[1]); x.fillStyle = g; x.fillRect(0, b.y + b.h, W, b.h * 1.4);
    U.badge2(U.meta(), w ? .84 * W : .44 * W, w ? .14 * H : .7 * H);
    U.end({ vig: .6 });
  }),
  M('LYRIC STACK', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .75 });
    if (w) U.artist(.8 * W, H * 1.02, .95 * H);
    else U.artist(.6 * W, .96 * H, .42 * H);
    const ws = d.title.split(/\s+/), n = Math.min(4, Math.max(2, ws.length)), per = Math.ceil(ws.length / n), L = [];
    for (let i = 0; i < ws.length; i += per) L.push(ws.slice(i, i + per).join(' '));
    L.forEach((l, i) => U.words(l, U.box(w ? [.04, .08 + i * (.8 / L.length), .56, .8 / L.length * .9] : [.06, .1 + i * (.4 / L.length), .76, .4 / L.length * .9]), { align: 'left', sw: .07, fill: i % 2 ? P.pop : P.fg }));
    U.end();
  }),
  M('MOODY PORTRAIT', (x, W, H, d, U, w, P) => {
    x.fillStyle = P.bg[1]; x.fillRect(0, 0, W, H);
    U.artist(w ? .66 * W : .5 * W, w ? H * 1.02 : .9 * H, w ? .98 * H : .62 * H, { rim: P.pop, filter: 'grayscale(.5) contrast(1.3) brightness(.85)' });
    U.fade('bottom', .35, 'rgba(0,0,0,.85)');
    if (w) { x.save(); x.translate(.16 * W, .5 * H); x.rotate(-Math.PI / 2); U.words(d.title, { x: -.4 * H, y: -.1 * W, w: .8 * H, h: .2 * W }, { sw: .06 }); x.restore(); U.badge2(U.meta(), .86 * W, .1 * H); }
    else { U.words(d.title, U.box([.06, .08, .76, .1]), { sw: .06 }); U.badge2(U.meta(), .44 * W, .2 * H, 30); }
    U.vhs(); U.chroma(4);
    U.end({ grain: .08 });
  })
];
function K0(d) { return (d.seed % 628) / 100; }

// 8 genre palettes from research §4. bg = [glow, base], fg = text, pop + alt = accents.
export const MUSIC_PRESETS = [
  { name: 'TRAP PURPLE', bg: ['#3a0a6a', '#120022'], fg: '#ffffff', st: '#000', pop: '#ff3cac', alt: '#8e2de2' },
  { name: 'DRILL ICE', bg: ['#1d2b38', '#0a0f14'], fg: '#ffffff', st: '#000', pop: '#7fd4ff', alt: '#3a4a58' },
  { name: 'MELODIC SUNSET', bg: ['#4a1a5a', '#1b0b3a'], fg: '#fff3e0', st: '#14061f', pop: '#ff5e78', alt: '#ffb36b' },
  { name: 'LO-FI PASTEL', bg: ['#4a3f60', '#2a2438'], fg: '#fff1d6', st: '#1a1524', pop: '#f7b7c9', alt: '#b8c0ff' },
  { name: 'BOOM BAP GOLD', bg: ['#3a2c14', '#17120b'], fg: '#f4e4bc', st: '#000', pop: '#d9a441', alt: '#7a1f1f' },
  { name: 'NEON RAVE', bg: ['#140a30', '#05010f'], fg: '#ffffff', st: '#000', pop: '#00ffa3', alt: '#ff00e5' },
  { name: 'RAGE', bg: ['#2a0000', '#080808'], fg: '#f5f5f5', st: '#000', pop: '#ff1e1e', alt: '#3a0000' },
  { name: 'RNB VELVET', bg: ['#4a1530', '#1a0a14'], fg: '#f8bbd0', st: '#000', pop: '#c2185b', alt: '#ffd59e' }
];

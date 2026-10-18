// True-crime pack: 10 layouts from docs/RESEARCH.md §2 x 8 noir palettes = 80 templates.
// d.person = subject, d.person2 = second person, d.cover = scene/photo, d.item = evidence. No gore; serious tone.
import { pop, TYPE } from '../../core/pop.js';

const DESAT = 'grayscale(.6) contrast(1.25) brightness(.95)';

function crime(x, W, H, d, K, P) {
  const U = pop(x, W, H, d, K, P), u = U.u, r = K.rnd;
  const fill = (img, bx, by, bw, bh) => { const s = Math.max(bw / img.width, bh / img.height); x.drawImage(img, bx + (bw - img.width * s) / 2, by + (bh - img.height * s) / 2, img.width * s, img.height * s); };

  U.dark = () => {
    const g = x.createRadialGradient(W * .55, H * .4, 0, W * .55, H * .4, Math.hypot(W, H) * .65);
    g.addColorStop(0, P.bg[0]); g.addColorStop(1, P.bg[1]); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (d.cover) { x.save(); x.globalAlpha = .5; x.filter = `${DESAT} blur(${3 * u}px)`; fill(d.cover, 0, 0, W, H); x.restore(); x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0, 0, W, H); }
  };
  // Neutral head-and-shoulders placeholder (no cartoon face for this niche).
  const ghost = () => { const c = document.createElement('canvas'); c.width = 600; c.height = 800; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 600, 800); gr.addColorStop(0, '#8a8f96'); gr.addColorStop(1, '#3a3d42'); g.fillStyle = gr; g.beginPath(); g.ellipse(300, 290, 165, 205, 0, 0, 7); g.fill(); g.fillRect(240, 450, 120, 120); g.beginPath(); g.roundRect(30, 560, 540, 300, 140); g.fill(); return c; };
  U.subject = (img, cx, bottom, h, o = {}) => U.cutout(img || ghost(), cx, bottom, h, { ow: 0, rim: o.rim ?? false, filter: o.filter || DESAT, flip: o.flip });
  U.scan = (a = .07) => { x.fillStyle = `rgba(0,0,0,${a * 3})`; for (let y = 0; y < H; y += 4 * u) x.fillRect(0, y, W, 1.4 * u); };
  U.tint = (c, a = .18, mode = 'color') => { x.save(); x.globalCompositeOperation = mode; x.globalAlpha = a; x.fillStyle = c; x.fillRect(0, 0, W, H); x.restore(); };

  U.tape = (x1, y1, x2, y2, txt = 'CRIME SCENE  DO NOT CROSS  ') => {
    const a = Math.atan2(y2 - y1, x2 - x1), len = Math.hypot(x2 - x1, y2 - y1), h = 62 * u;
    x.save(); x.translate(x1, y1); x.rotate(a);
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 18 * u; x.shadowOffsetY = 8 * u;
    x.fillStyle = P.tape || '#ffd60a'; x.fillRect(0, -h / 2, len, h); x.shadowColor = 'transparent';
    x.fillStyle = '#111'; x.font = `${h * .58}px Anton, Impact, sans-serif`; x.textBaseline = 'middle';
    const t = txt.repeat(12); x.fillText(t, -r() * 200 * u, 2 * u);
    x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(0, -h / 2, len, 4 * u); x.fillRect(0, h / 2 - 4 * u, len, 4 * u);
    x.restore();
  };

  U.paper = (b, rot = 0, tone = '#e9dcbf') => {
    x.save(); x.translate(b.x + b.w / 2, b.y + b.h / 2); x.rotate(rot);
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 30 * u; x.shadowOffsetY = 12 * u;
    x.fillStyle = tone; x.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); x.shadowColor = 'transparent';
    const g = x.createRadialGradient(0, 0, Math.min(b.w, b.h) * .2, 0, 0, Math.hypot(b.w, b.h) * .6);
    g.addColorStop(0, 'rgba(120,80,30,0)'); g.addColorStop(1, 'rgba(90,55,20,.35)'); x.fillStyle = g; x.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
    x.restore();
  };
  // Fake typed lines (unreadable on purpose) inside box b.
  U.lines = (b, lh = 26) => { x.fillStyle = 'rgba(40,30,20,.45)'; for (let y = b.y; y < b.y + b.h; y += lh * u) x.fillRect(b.x, y, b.w * (.55 + r() * .45), lh * u * .32); };
  U.redact = (b, n = 4) => { const h = Math.min(b.h / n * .7, H * .055); for (let i = 0; i < n; i++) { const w = b.w * (.45 + r() * .55); x.fillStyle = '#0a0a0a'; x.fillRect(b.x + r() * (b.w - w), b.y + i * (b.h / n), w, h); } };

  U.stamp = (txt, cx, cy, size = 54, rot = -.14, c = P.pop) => {
    x.save(); x.translate(cx, cy); x.rotate(rot); x.globalAlpha = .88;
    x.font = `bold ${size * u}px ${TYPE}`; const w = x.measureText(txt).width + size * u * .9, h = size * u * 1.5;
    x.strokeStyle = c; x.lineWidth = 6 * u; x.strokeRect(-w / 2, -h / 2, w, h); x.lineWidth = 2.5 * u; x.strokeRect(-w / 2 + 9 * u, -h / 2 + 9 * u, w - 18 * u, h - 18 * u);
    x.fillStyle = c; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 0, 2 * u);
    x.globalCompositeOperation = 'destination-out'; // worn ink
    for (let i = 0; i < 60; i++) { x.globalAlpha = .5; x.fillRect((r() - .5) * w, (r() - .5) * h, 3 * u, 2 * u); }
    x.restore();
  };

  U.polaroid = (img, cx, cy, w, rot = 0, label) => {
    const h = w * 1.18, p = w * .06;
    x.save(); x.translate(cx, cy); x.rotate(rot);
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 24 * u; x.shadowOffsetY = 10 * u;
    x.fillStyle = '#f1ede4'; x.fillRect(-w / 2, -h / 2, w, h); x.shadowColor = 'transparent';
    x.save(); x.beginPath(); x.rect(-w / 2 + p, -h / 2 + p, w - p * 2, w - p * 2); x.clip(); x.filter = DESAT;
    if (img) fill(img, -w / 2 + p, -h / 2 + p, w - p * 2, w - p * 2); else { x.fillStyle = '#3a3a3a'; x.fillRect(-w / 2, -h / 2, w, w); x.fillStyle = '#555'; x.beginPath(); x.arc(0, -h / 2 + w * .42, w * .17, 0, 7); x.fill(); x.fillRect(-w * .25, -h / 2 + w * .62, w * .5, w * .4); }
    x.restore();
    if (label) { x.fillStyle = '#222'; x.font = `${w * .09}px ${TYPE}`; x.textAlign = 'center'; x.fillText(label, 0, h / 2 - p * 1.4); }
    x.restore();
    return { x: cx, y: cy - h / 2 + 6 * u };
  };
  U.pin = (pt) => { x.fillStyle = P.pop; x.beginPath(); x.arc(pt.x, pt.y, 9 * u, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.arc(pt.x - 3 * u, pt.y - 3 * u, 3 * u, 0, 7); x.fill(); };
  U.string = (pts) => { x.save(); x.strokeStyle = '#c1121f'; x.lineWidth = 3.5 * u; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 6 * u; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y)); x.stroke(); x.restore(); };

  U.cone = (cx, w0, w1, a = .5) => {
    x.save(); x.globalCompositeOperation = 'screen';
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgba(255,248,225,${a})`); g.addColorStop(1, 'rgba(255,248,225,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(cx - w0 / 2, 0); x.lineTo(cx + w0 / 2, 0); x.lineTo(cx + w1 / 2, H); x.lineTo(cx - w1 / 2, H); x.fill(); x.restore();
    x.fillStyle = '#ddd'; x.fillRect(cx - w0 * .6, 0, w0 * 1.2, 10 * u);
  };

  // Night house + trees silhouette with lit window at (wx, wy).
  U.house = (cx, base, s, wx, wy) => {
    x.save(); x.fillStyle = '#050608';
    for (let i = 0; i < 9; i++) { const tx = r() * W, th = (120 + r() * 160) * u; x.beginPath(); x.moveTo(tx, base - th); x.lineTo(tx - 50 * u, base); x.lineTo(tx + 50 * u, base); x.fill(); }
    x.fillRect(cx - s * .5, base - s * .55, s, s * .55); x.beginPath(); x.moveTo(cx - s * .6, base - s * .55); x.lineTo(cx, base - s * .95); x.lineTo(cx + s * .6, base - s * .55); x.fill();
    x.fillRect(0, base, W, H - base);
    U.glow(wx, wy, s * .5, P.light || '#ffe8a3', .55);
    x.fillStyle = P.light || '#ffe8a3'; x.fillRect(wx - s * .07, wy - s * .08, s * .14, s * .16);
    x.restore();
  };

  // Mugshot height chart.
  U.chart = (b) => {
    x.fillStyle = '#d9d9d6'; x.fillRect(b.x, b.y, b.w, b.h); x.strokeStyle = 'rgba(0,0,0,.55)'; x.fillStyle = 'rgba(0,0,0,.65)';
    x.font = `${18 * u}px ${TYPE}`; x.textAlign = 'left';
    for (let i = 0, y = b.y + b.h; y > b.y; i++, y -= 22 * u) { const big = i % 4 === 0; x.lineWidth = big ? 3 * u : 1.2 * u; x.beginPath(); x.moveTo(b.x, y); x.lineTo(b.x + b.w, y); x.stroke(); if (big) x.fillText(`${(4 + i / 4).toFixed(0)}'`, b.x + 10 * u, y - 4 * u); }
  };

  U.end = (o = {}) => { U.scan(o.scan ?? .05); U.finish({ vig: .58, grain: .07, lx: o.lx, ly: o.ly }); };
  return U;
}

const T = (name, draw) => ({ name, niche: 'crime', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) { draw(x, W, H, d, crime(x, W, H, d, K, P), K.wide, P); } });
const hook = (d, n = 3) => d.big.split(/\s+/).slice(0, n).join(' ');

export default [
  T('MUGSHOT', (x, W, H, d, U, w, P) => {
    U.dark();
    if (w) { U.chart({ x: .28 * W, y: 0, w: .44 * W, h: H }); U.subject(d.person, .5 * W, H * 1.02, .92 * H); U.words(hook(d), U.box([.04, .64, .4, .16]), { plate: P.pop, fill: '#fff', align: 'left' }); U.stamp('SUSPECT', .82 * W, .2 * H, 44, .12); }
    else { U.chart({ x: .1 * W, y: .12 * H, w: .8 * W, h: .6 * H }); U.subject(d.person, .5 * W, .74 * H, .52 * H); U.words(hook(d), U.box([.08, .62, .7, .08]), { plate: P.pop, fill: '#fff' }); U.stamp('SUSPECT', .7 * W, .16 * H, 50, .12); }
    U.end();
  }),
  T('REDACTED FILE', (x, W, H, d, U, w, P) => {
    x.fillStyle = P.bg[1]; x.fillRect(0, 0, W, H);
    const pb = U.box(w ? [.03, .05, .94, .9] : [.05, .1, .9, .72]); U.paper(pb, -.012);
    U.lines({ x: pb.x + pb.w * .06, y: pb.y + pb.h * .3, w: pb.w * .58, h: pb.h * .6 });
    U.redact({ x: pb.x + pb.w * .06, y: pb.y + pb.h * .32, w: pb.w * .56, h: pb.h * .4 }, 5);
    U.polaroid(d.person || d.cover, pb.x + pb.w * (w ? .82 : .74), pb.y + pb.h * (w ? .55 : .6), pb.w * (w ? .24 : .38), .05);
    U.words(hook(d), { x: pb.x + pb.w * .05, y: pb.y + pb.h * .06, w: pb.w * .56, h: pb.h * .2 }, { fill: '#141414', sw: 0, stroke: 'transparent', align: 'left', font: TYPE, weight: 'bold', hi: P.pop });
    U.stamp('UNSOLVED', pb.x + pb.w * .8, pb.y + pb.h * .2, w ? 46 : 56, -.14);
    U.end({ scan: 0 });
  }),
  T('TAPE CROSS', (x, W, H, d, U, w, P) => {
    U.dark(); U.glow(W / 2, H * .5, Math.max(W, H) * .35, P.pop, .25);
    U.subject(d.person, .5 * W, w ? H * 1.02 : .8 * H, w ? .86 * H : .5 * H);
    U.tape(-.05 * W, (w ? .2 : .3) * H, 1.05 * W, (w ? .8 : .55) * H); U.tape(-.05 * W, (w ? .85 : .6) * H, 1.05 * W, (w ? .3 : .35) * H);
    U.words(hook(d), U.box(w ? [.03, .03, .5, .22] : [.06, .08, .76, .13]), { sw: .09, hi: P.pop, align: w ? 'left' : 'center' });
    U.end();
  }),
  T('SILHOUETTE', (x, W, H, d, U, w, P) => {
    U.dark(); U.glow(w ? .75 * W : .5 * W, w ? .45 * H : .5 * H, H * .45, P.rim, .45);
    U.subject(d.person, w ? .75 * W : .5 * W, w ? H * 1.02 : .82 * H, w ? .86 * H : .52 * H, { filter: 'brightness(0)', rim: P.rim });
    U.words('?', U.box(w ? [.08, .14, .3, .44] : [.3, .1, .4, .2]), { fill: P.rim, sw: .05 });
    U.words(hook(d, 2), U.box(w ? [.04, .6, .46, .16] : [.06, .3, .76, .08]), { sw: .08, hi: P.pop });
    U.end();
  }),
  T('CASE BOARD', (x, W, H, d, U, w, P) => {
    x.fillStyle = '#4a3423'; x.fillRect(0, 0, W, H); U.tint(P.bg[1], .55, 'multiply');
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(0,0,0,${Math.random() * .25})`; x.fillRect(Math.random() * W, Math.random() * H, 2 * U.u, 2 * U.u); }
    const s = w ? H * .26 : W * .3, pts = w
      ? [U.polaroid(d.cover, .14 * W, .45 * H, s, -.08, 'SCENE'), U.polaroid(d.person, .5 * W, .56 * H, s * 1.7, .02, 'SUSPECT'), U.polaroid(d.item, .85 * W, .4 * H, s, .07, 'EVIDENCE'), U.polaroid(d.person2, .2 * W, .82 * H, s * .9, .05, 'WITNESS')]
      : [U.polaroid(d.cover, .24 * W, .3 * H, s, -.08, 'SCENE'), U.polaroid(d.person, .55 * W, .48 * H, s * 1.6, .02, 'SUSPECT'), U.polaroid(d.item, .78 * W, .3 * H, s, .07, 'EVIDENCE'), U.polaroid(d.person2, .26 * W, .64 * H, s * .9, .05, 'WITNESS')];
    U.string([pts[0], pts[1], pts[2]]); U.string([pts[1], pts[3]]); pts.forEach(U.pin);
    U.words(hook(d), U.box(w ? [.25, .02, .5, .14] : [.06, .08, .76, .1]), { plate: '#0d0d0f', fill: '#fff', hi: P.pop });
    U.end({ scan: 0 });
  }),
  T('VICTIM VS SUSPECT', (x, W, H, d, U, w, P) => {
    U.dark();
    x.save(); x.globalCompositeOperation = 'soft-light'; x.fillStyle = '#ff8a3d'; w ? x.fillRect(0, 0, W / 2, H) : x.fillRect(0, 0, W, H / 2); x.fillStyle = '#2c6e9b'; w ? x.fillRect(W / 2, 0, W / 2, H) : x.fillRect(0, H / 2, W, H / 2); x.restore();
    if (w) { U.subject(d.person2, .25 * W, H * 1.02, .84 * H, { filter: 'sepia(.35) contrast(1.15)' }); U.subject(d.person, .75 * W, .86 * H, .76 * H, { flip: true }); }
    else { U.subject(d.person2, .5 * W, .48 * H, .32 * H, { filter: 'sepia(.35) contrast(1.15)' }); U.subject(d.person, .5 * W, .84 * H, .32 * H, { flip: true }); }
    x.fillStyle = '#fff'; w ? x.fillRect(W / 2 - 2 * U.u, 0, 4 * U.u, H) : x.fillRect(0, H / 2 - 2 * U.u, W, 4 * U.u);
    U.badge('?', W / 2, w ? H * .45 : H / 2, { size: 90, bg: P.pop });
    U.words(hook(d), U.box(w ? [.03, .74, .42, .2] : [.06, .08, .76, .1]), { sw: .09, align: w ? 'left' : 'center' });
    U.end();
  }),
  T('THE LOCATION', (x, W, H, d, U, w, P) => {
    if (d.cover) { U.dark(); U.tint('#0a1a3a', .5, 'multiply'); U.glow(.68 * W, .45 * H, H * .3, P.light, .35); }
    else { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P.bg[1]); g.addColorStop(1, P.bg[0]); x.fillStyle = g; x.fillRect(0, 0, W, H); U.house(w ? .66 * W : .5 * W, (w ? .78 : .62) * H, w ? .44 * H : .5 * W, w ? .68 * W : .55 * W, (w ? .64 : .5) * H); }
    U.subject(d.person, w ? .2 * W : .2 * W, w ? .96 * H : .66 * H, w ? .3 * H : .14 * H, { filter: 'brightness(.08)' });
    U.fade('bottom', .4);
    U.words(hook(d), U.box(w ? [.03, .66, .5, .22] : [.06, .7, .76, .12]), { sw: .08, hi: P.pop, align: w ? 'left' : 'center' });
    U.end();
  }),
  T('EVIDENCE', (x, W, H, d, U, w, P) => {
    U.dark();
    const img = d.item || d.cover;
    U.imgBox(img, { x: -10, y: -10, w: W + 20, h: H + 20 }, { r: 0, label: 'EVIDENCE PHOTO' });
    U.tint(P.bg[1], .45, 'multiply'); U.scan(.04);
    U.ring(w ? .64 * W : .55 * W, w ? .55 * H : .45 * H, w ? .14 * H : .16 * W, P.pop);
    U.badge('EXHIBIT A', w ? .14 * W : .26 * W, w ? .86 * H : .62 * H, { bg: '#f1ede4', fg: '#111', size: 34, rot: -.04 });
    U.words(hook(d, 2), U.box(w ? [.03, .03, .55, .22] : [.06, .08, .76, .12]), { sw: .09, hi: P.pop, align: w ? 'left' : 'center' });
    U.end();
  }),
  T('HEADLINE', (x, W, H, d, U, w, P) => {
    U.dark();
    const pb = U.box(w ? [.04, .1, .64, .5] : [.06, .12, .82, .3]); U.paper(pb, -.03, '#e6dcc6');
    x.save(); x.translate(pb.x + pb.w / 2, pb.y + pb.h / 2); x.rotate(-.03);
    x.fillStyle = '#111'; x.font = `bold ${pb.h * .1}px Georgia, "Times New Roman", serif`; x.textAlign = 'center'; x.fillText('THE DAILY RECORD', 0, -pb.h * .36);
    x.fillRect(-pb.w * .45, -pb.h * .3, pb.w * .9, 3 * U.u); x.restore();
    U.words(hook(d, 4), { x: pb.x + pb.w * .05, y: pb.y + pb.h * .28, w: pb.w * .9, h: pb.h * .42 }, { fill: '#111', sw: 0, stroke: 'transparent', font: 'Georgia, "Times New Roman", serif', weight: 'bold', rot: -.03 });
    U.lines({ x: pb.x + pb.w * .06, y: pb.y + pb.h * .76, w: pb.w * .86, h: pb.h * .18 }, 18);
    U.subject(d.person, w ? .86 * W : .72 * W, w ? H * 1.02 : .9 * H, w ? .96 * H : .5 * H);
    U.end({ scan: 0 });
  }),
  T('INTERROGATION', (x, W, H, d, U, w, P) => {
    x.fillStyle = '#030304'; x.fillRect(0, 0, W, H);
    U.cone(W / 2, w ? .14 * W : .2 * W, w ? .7 * W : 1.1 * W, .42);
    U.subject(d.person, W / 2, w ? H * 1.02 : .86 * H, w ? .82 * H : .5 * H, { filter: 'grayscale(.7) contrast(1.35)' });
    U.fade('bottom', .3, 'rgba(0,0,0,.92)');
    U.words(d.big.split(/\s+/).sort((a, b) => b.length - a.length)[0], U.box(w ? [.25, .72, .5, .16] : [.06, .76, .76, .09]), { sw: .07, fill: P.light });
    U.end({ scan: .03 });
  })
];

// 8 palettes from research §2. bg = [glow, base], fg = light, pop = red/accent, rim = silhouette rim.
export const CRIME_PRESETS = [
  { name: 'NOIR RED', bg: ['#3a3a3e', '#0d0d0f'], fg: '#f2f2f2', st: '#000', pop: '#e10e1a', rim: '#9ad8ff', light: '#f2f2f2' },
  { name: 'TAPE YELLOW', bg: ['#3a2a10', '#111111'], fg: '#ffffff', st: '#000', pop: '#ffd60a', rim: '#ffd60a', light: '#fff2b0', tape: '#ffd60a' },
  { name: 'COLD CASE', bg: ['#1f4a6b', '#0a1622'], fg: '#bfe3f2', st: '#000', pop: '#e10e1a', rim: '#7fd4ff', light: '#bfe3f2' },
  { name: 'POLICE LIGHTS', bg: ['#1e2a7a', '#0a0f2c'], fg: '#ffffff', st: '#000', pop: '#e10e1a', rim: '#1e5bff', light: '#ffffff' },
  { name: 'SEPIA ARCHIVE', bg: ['#6b4a2b', '#2b1d12'], fg: '#e9d8b4', st: '#120b05', pop: '#8a0f0f', rim: '#e9d8b4', light: '#e9d8b4' },
  { name: 'BLOOD & BONE', bg: ['#4a0c10', '#140506'], fg: '#e8dcc8', st: '#000', pop: '#c3121a', rim: '#e8dcc8', light: '#e8dcc8' },
  { name: 'STREETLAMP', bg: ['#3d4a5c', '#0b0b12'], fg: '#ffe8a3', st: '#000', pop: '#ff9f1c', rim: '#ff9f1c', light: '#ffe8a3' },
  { name: 'FORENSIC', bg: ['#0d3a2c', '#05140f'], fg: '#d9fff0', st: '#000', pop: '#e10e1a', rim: '#2ee6a6', light: '#d9fff0' }
];

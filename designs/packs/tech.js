// Tech pack: 10 layouts from docs/RESEARCH.md §3 x 8 palettes = 80 templates.
// d.item = product cut-out (auto cut-out slot), d.cover = second product / photo, d.person = host.
import { pop } from '../../core/pop.js';

const SANS = '"Segoe UI", Inter, "Helvetica Neue", Arial, sans-serif';

function tech(x, W, H, d, K, P) {
  const U = pop(x, W, H, d, K, P), u = U.u, r = K.rnd;

  // Studio sweep: soft key light, floor gradient, faint horizon.
  U.studio = (o = {}) => {
    const g = x.createRadialGradient(W * (o.lx ?? .62), H * .38, 0, W * (o.lx ?? .62), H * .38, Math.hypot(W, H) * .6);
    g.addColorStop(0, P.bg[0]); g.addColorStop(1, P.bg[1]); x.fillStyle = g; x.fillRect(0, 0, W, H);
    const f = x.createLinearGradient(0, H * .7, 0, H); f.addColorStop(0, 'rgba(0,0,0,0)'); f.addColorStop(1, P.light ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.45)');
    x.fillStyle = f; x.fillRect(0, H * .7, W, H * .3);
    if (!P.light) U.glow(W * (o.lx ?? .62), H * .45, Math.min(W, H) * .55, P.pop, .22);
  };

  // Phone render placeholder.
  const phone = (alt) => { const c = document.createElement('canvas'); c.width = 400; c.height = 820; const g = c.getContext('2d');
    g.fillStyle = '#16181d'; g.beginPath(); g.roundRect(10, 10, 380, 800, 64); g.fill(); g.strokeStyle = '#4a4f5a'; g.lineWidth = 6; g.stroke();
    const s = g.createLinearGradient(0, 40, 400, 780); s.addColorStop(0, alt ? P.alt : P.pop); s.addColorStop(1, '#0b0d12'); g.fillStyle = s; g.beginPath(); g.roundRect(30, 30, 340, 760, 48); g.fill();
    g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(30, 30); g.lineTo(240, 30); g.lineTo(30, 420); g.fill();
    g.fillStyle = '#000'; g.beginPath(); g.roundRect(150, 48, 100, 26, 13); g.fill(); return c; };

  // Product with contact shadow + floor reflection. Rotation tilts toward 3/4 view.
  U.product = (img, cx, bottom, h, o = {}) => {
    const src = img || phone(o.alt), w = h * src.width / src.height;
    x.save(); x.fillStyle = 'rgba(0,0,0,.45)'; x.filter = `blur(${14 * u}px)`; x.beginPath(); x.ellipse(cx, bottom, w * .55, h * .04, 0, 0, 7); x.fill(); x.restore();
    if (o.reflect !== false) { x.save(); x.globalAlpha = .16; x.translate(cx, bottom); x.scale(1, -1); x.rotate(-(o.rot || 0)); x.drawImage(src, -w / 2, -h * .35, w, h * .35); x.restore(); }
    x.save(); x.translate(cx, bottom - h / 2); x.rotate(o.rot || 0); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 40 * u; x.shadowOffsetY = 18 * u;
    if (o.filter) x.filter = o.filter; x.drawImage(src, -w / 2, -h / 2, w, h); x.restore();
    if (!P.light) { x.save(); x.globalCompositeOperation = 'screen'; U.glow(cx + w * .35, bottom - h * .7, h * .25, P.pop, .35); x.restore(); }
    return { cx, top: bottom - h, w, h };
  };

  U.t = (txt, b, o = {}) => U.words(txt, b, { font: SANS, weight: '900', sw: P.light ? 0 : .04, stroke: P.light ? 'transparent' : '#000', fill: P.fg, ...o });
  U.icon = (kind, cx, cy, s) => { x.save(); x.translate(cx, cy); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 20 * u; x.fillStyle = kind === 'x' ? '#e10600' : '#1fbf5b'; x.beginPath(); x.arc(0, 0, s, 0, 7); x.fill(); x.shadowColor = 'transparent';
    x.strokeStyle = '#fff'; x.lineWidth = s * .26; x.lineCap = 'round'; x.beginPath(); if (kind === 'x') { x.moveTo(-s * .4, -s * .4); x.lineTo(s * .4, s * .4); x.moveTo(s * .4, -s * .4); x.lineTo(-s * .4, s * .4); } else { x.moveTo(-s * .45, 0); x.lineTo(-s * .1, s * .35); x.lineTo(s * .45, -s * .35); } x.stroke(); x.restore(); };
  U.crown = (cx, cy, s) => { x.save(); x.translate(cx, cy); x.fillStyle = '#ffc93c'; x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 16 * u; x.beginPath(); x.moveTo(-s, s * .5); x.lineTo(-s, -s * .3); x.lineTo(-s * .5, s * .1); x.lineTo(0, -s * .6); x.lineTo(s * .5, s * .1); x.lineTo(s, -s * .3); x.lineTo(s, s * .5); x.closePath(); x.fill(); x.restore(); };
  U.leader = (x1, y1, x2, y2, label) => { x.save(); x.strokeStyle = P.fg; x.lineWidth = 3 * u; x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke(); x.fillStyle = P.pop; x.beginPath(); x.arc(x1, y1, 9 * u, 0, 7); x.fill();
    const s = Math.min(W, H) * .06; x.font = `900 ${s}px ${SANS}`; x.textBaseline = 'middle'; x.textAlign = x2 < x1 ? 'right' : 'left'; const tw = x.measureText(label).width, px = 14 * u, lx = x2 < x1 ? x2 - tw - px * 2 : x2;
    x.fillStyle = P.light ? '#fff' : 'rgba(0,0,0,.6)'; x.beginPath(); x.roundRect(lx, y2 - s * .75, tw + px * 2, s * 1.5, 10 * u); x.fill(); x.fillStyle = P.fg; x.fillText(label, x2 < x1 ? x2 - px : x2 + px, y2 + 2 * u); x.restore(); };
  U.tag = (txt, cx, cy, s) => { x.save(); x.translate(cx, cy); x.rotate(-.08); x.font = `900 ${s}px ${SANS}`; const w = x.measureText(txt).width + s * 1.2, h = s * 1.5;
    x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 24 * u; x.shadowOffsetY = 10 * u; x.fillStyle = P.pop; x.beginPath(); x.moveTo(-w / 2, -h / 2); x.lineTo(w / 2 - h * .4, -h / 2); x.lineTo(w / 2, 0); x.lineTo(w / 2 - h * .4, h / 2); x.lineTo(-w / 2, h / 2); x.closePath(); x.fill();
    x.shadowColor = 'transparent'; x.fillStyle = P.light ? '#fff' : P.bg[1]; x.beginPath(); x.arc(w / 2 - h * .45, 0, h * .1, 0, 7); x.fill(); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, -h * .15, s * .05); x.restore(); };
  U.crack = (cx, cy, s) => { x.save(); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 2.5 * u; x.shadowColor = '#000'; x.shadowBlur = 4 * u;
    for (let i = 0; i < 9; i++) { let a = r() * 6.283, px = cx, py = cy; x.beginPath(); x.moveTo(px, py); for (let j = 0; j < 5; j++) { a += (r() - .5) * .8; px += Math.cos(a) * s * .25; py += Math.sin(a) * s * .25; x.lineTo(px, py); } x.stroke(); } x.restore(); };
  U.box3d = (cx, bottom, w) => { const h = w * .55, fl = w * .28; x.save(); x.fillStyle = '#b07a45'; x.fillRect(cx - w / 2, bottom - h, w, h); x.fillStyle = '#8a5a2e'; x.fillRect(cx - w / 2, bottom - h, w, h * .12);
    x.fillStyle = '#c99060'; x.beginPath(); x.moveTo(cx - w / 2, bottom - h); x.lineTo(cx - w / 2 - fl * .6, bottom - h - fl); x.lineTo(cx - w * .1, bottom - h - fl * .8); x.lineTo(cx, bottom - h); x.fill();
    x.beginPath(); x.moveTo(cx + w / 2, bottom - h); x.lineTo(cx + w / 2 + fl * .6, bottom - h - fl); x.lineTo(cx + w * .1, bottom - h - fl * .8); x.lineTo(cx, bottom - h); x.fill(); x.restore(); return bottom - h; };
  U.flare = (cx, cy) => { x.save(); x.globalCompositeOperation = 'screen'; U.glow(cx, cy, 90 * u, '#ffffff', .8); x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(cx - 200 * u, cy - 1.5 * u, 400 * u, 3 * u); x.restore(); };
  U.end = () => U.finish({ vig: P.light ? .12 : .45, grain: .025, lx: .7, ly: .05 });
  return U;
}

const TT = (name, draw) => ({ name, niche: 'tech', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) { draw(x, W, H, d, tech(x, W, H, d, K, P), K.wide, P); } });
const verdict = (d, n = 2) => d.big.split(/\s+/).slice(0, n).join(' ');

export default [
  TT('PRODUCT + VERDICT', (x, W, H, d, U, w, P) => {
    U.studio();
    if (w) { U.product(d.item, .68 * W, .88 * H, .76 * H, { rot: .12 }); U.t(verdict(d), U.box([.04, .3, .38, .34]), { align: 'left', hi: P.pop }); }
    else { U.product(d.item, .5 * W, .66 * H, .48 * H, { rot: .1 }); U.t(verdict(d), U.box([.06, .7, .76, .12]), { hi: P.pop }); }
    U.end();
  }),
  TT('A VS B', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .5 });
    if (w) { U.product(d.item, .25 * W, .85 * H, .64 * H, { rot: -.1 }); U.product(d.cover, .75 * W, .85 * H, .64 * H, { rot: .1, alt: true }); U.badge('VS', .5 * W, .5 * H, { size: 64, bg: P.pop }); U.crown(.25 * W, .14 * H, .06 * H); U.icon('ok', .38 * W, .25 * H, .05 * H); U.icon('x', .88 * W, .25 * H, .05 * H); }
    else { U.product(d.item, .3 * W, .72 * H, .4 * H, { rot: -.1 }); U.product(d.cover, .72 * W, .72 * H, .4 * H, { rot: .1, alt: true }); U.badge('VS', .5 * W, .52 * H, { size: 60, bg: P.pop }); U.crown(.3 * W, .27 * H, .05 * W); U.t(verdict(d), U.box([.06, .08, .76, .1])); }
    U.end();
  }),
  TT('HOST + PRODUCT', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .4 });
    if (w) { U.cutout(d.person, .18 * W, H * 1.02, .82 * H, { ow: 0, rim: P.pop }); U.product(d.item, .6 * W, .9 * H, .7 * H, { rot: .08 }); U.t(verdict(d), U.box([.7, .08, .27, .3]), { maxLines: 3, hi: P.pop }); }
    else { U.product(d.item, .62 * W, .58 * H, .36 * H, { rot: .08 }); U.cutout(d.person, .32 * W, .95 * H, .4 * H, { ow: 0, rim: P.pop }); U.t(verdict(d), U.box([.06, .08, .76, .12]), { hi: P.pop }); }
    U.end();
  }),
  TT('UNBOX REVEAL', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .5 });
    const top = U.box3d(.5 * W, w ? 1.02 * H : .86 * H, w ? .42 * W : .7 * W);
    x.save(); x.globalCompositeOperation = 'screen'; U.glow(.5 * W, top, w ? .5 * H : .4 * W, '#fff', .8); U.glow(.5 * W, top, w ? .6 * H : .5 * W, P.pop, .5); x.restore();
    U.product(d.item, .5 * W, top + (w ? .1 : .05) * H, w ? .6 * H : .36 * H, { reflect: false });
    U.t(verdict(d, 1) || 'FINALLY', U.box(w ? [.04, .05, .36, .3] : [.06, .08, .76, .12]), { align: w ? 'left' : 'center', hi: P.pop });
    U.end();
  }),
  TT('SPEC CALLOUT', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .5 });
    const p = U.product(d.item, .5 * W, w ? .9 * H : .7 * H, w ? .78 * H : .46 * H, { rot: .06 });
    const L = (d.big.split(/\s+/).length >= 2 ? d.big.split(/\s+/) : ['200MP', '5000mAh', '1TB']).slice(0, 3);
    if (w) { U.leader(p.cx + p.w * .2, p.top + p.h * .2, .74 * W, .2 * H, L[0]); U.leader(p.cx - p.w * .25, p.top + p.h * .5, .24 * W, .4 * H, L[1] || '1TB'); if (L[2]) U.leader(p.cx + p.w * .25, p.top + p.h * .75, .74 * W, .66 * H, L[2]); }
    else { U.leader(p.cx + p.w * .2, p.top + p.h * .2, .66 * W, .18 * H, L[0]); U.leader(p.cx - p.w * .25, p.top + p.h * .55, .26 * W, .76 * H, L[1] || '1TB'); if (L[2]) U.leader(p.cx + p.w * .25, p.top + p.h * .8, .66 * W, .8 * H, L[2]); }
    U.end();
  }),
  TT('PRICE TAG', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .35 });
    if (w) { U.product(d.item, .3 * W, .9 * H, .78 * H, { rot: -.08 }); U.tag(U.num('$999'), .76 * W, .28 * H, .16 * H); U.t(U.rest(), U.box([.56, .52, .4, .2]), { hi: P.pop }); }
    else { U.product(d.item, .5 * W, .72 * H, .44 * H, { rot: -.08 }); U.tag(U.num('$999'), .5 * W, .16 * H, .07 * H); U.t(U.rest(), U.box([.06, .74, .76, .1]), { hi: P.pop }); }
    U.end();
  }),
  TT('BROKEN TEST', (x, W, H, d, U, w, P) => {
    U.studio();
    const p = w ? U.product(d.item, .62 * W, .9 * H, .8 * H, { rot: .18 }) : U.product(d.item, .55 * W, .7 * H, .46 * H, { rot: .14 });
    U.crack(p.cx + p.w * .05, p.top + p.h * .4, p.h * .7);
    U.icon('x', w ? .86 * W : .82 * W, w ? .2 * H : .28 * H, w ? .08 * H : .07 * W);
    if (w) { x.save(); x.beginPath(); x.arc(.15 * W, .24 * H, .14 * H, 0, 7); x.clip(); U.cutout(d.person, .15 * W, .38 * H, .32 * H, { ow: 0, rim: false }); x.restore(); x.strokeStyle = '#fff'; x.lineWidth = 6 * U.u; x.beginPath(); x.arc(.15 * W, .24 * H, .14 * H, 0, 7); x.stroke(); U.t(verdict(d), U.box([.03, .5, .34, .3]), { align: 'left', hi: P.pop }); }
    else { U.t(verdict(d), U.box([.06, .08, .76, .12]), { hi: P.pop }); }
    U.end();
  }),
  TT('MACRO DETAIL', (x, W, H, d, U, w, P) => {
    U.studio();
    const img = d.item || d.cover;
    if (img) { x.save(); x.filter = 'contrast(1.15) saturate(1.2)'; const s = Math.max(W / img.width, H / img.height) * 1.6; x.drawImage(img, W / 2 - img.width * s * .55, H / 2 - img.height * s * .45, img.width * s, img.height * s); x.restore(); }
    else { const cx = w ? .64 * W : .5 * W, cy = w ? .5 * H : .4 * H, R = w ? .38 * H : .34 * W; for (const [rr, c] of [[1, '#1a1c22'], [.8, '#2c2f38'], [.62, '#05060a'], [.38, P.pop], [.22, '#05060a']]) { x.fillStyle = c; x.beginPath(); x.arc(cx, cy, R * rr, 0, 7); x.fill(); } U.flare(cx - R * .25, cy - R * .25); }
    U.fade(w ? 'left' : 'bottom', .5, 'rgba(0,0,0,.75)');
    U.t(verdict(d), U.box(w ? [.04, .34, .34, .3] : [.06, .74, .76, .12]), { align: w ? 'left' : 'center', fill: '#fff', hi: P.pop, sw: .04, stroke: '#000' });
    U.end();
  }),
  TT('TOP 5 LINEUP', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .5 });
    const n = 5, sz = [.5, .62, .78, .62, .5];
    for (let i = 0; i < n; i++) { const cx = w ? (.12 + i * .19) * W : (.14 + i * .18) * W; U.product(i % 2 ? d.cover : d.item, cx, w ? .86 * H : .7 * H, (w ? .62 * H : .3 * H) * sz[i] / .78, { alt: i % 2, reflect: false }); U.badge(String([5, 3, 1, 2, 4][i]), cx, w ? .9 * H : .74 * H, { size: 30, bg: i === 2 ? P.pop : '#222' }); }
    U.t((d.big.match(/TOP\s*\d+/i) || ['TOP 5'])[0].toUpperCase(), U.box(w ? [.03, .04, .34, .26] : [.06, .08, .76, .14]), { align: w ? 'left' : 'center', hi: P.pop });
    U.end();
  }),
  TT('RATING SCORE', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .7 });
    const sc = (d.big.match(/\d+(\.\d)?\s*\/\s*10/) || ['9/10'])[0].replace(/\s/g, '');
    if (w) { U.product(d.item, .74 * W, .9 * H, .76 * H, { rot: .1 }); U.t(sc, U.box([.04, .16, .42, .44]), { fill: P.pop }); U.t(verdict(d), U.box([.04, .62, .42, .14]), { align: 'left' }); }
    else { U.product(d.item, .5 * W, .74 * H, .42 * H, { rot: .1 }); U.t(sc, U.box([.06, .08, .76, .16]), { fill: P.pop }); U.t(verdict(d), U.box([.06, .25, .76, .06])); }
    U.end();
  })
];

// 8 palettes from research §3. light = high-key background (dark text, no outline).
export const TECH_PRESETS = [
  { name: 'CLEAN STUDIO', bg: ['#ffffff', '#dfe5ee'], fg: '#0f1115', st: '#ffffff', pop: '#2f6bff', alt: '#ff5a36', light: true },
  { name: 'DARK MODE PRO', bg: ['#1f2533', '#0b0d12'], fg: '#e6eaf2', st: '#000', pop: '#3da9fc', alt: '#7c5cff' },
  { name: 'NEON CYBER', bg: ['#21145a', '#0a0620'], fg: '#ffffff', st: '#000', pop: '#00f0ff', alt: '#ff2bd6' },
  { name: 'WARM MINIMAL', bg: ['#ffffff', '#ebebf0'], fg: '#1d1d1f', st: '#ffffff', pop: '#ff9500', alt: '#0a84ff', light: true },
  { name: 'ANDROID GREEN', bg: ['#1f4232', '#0f1f17'], fg: '#ffffff', st: '#000', pop: '#3ddc84', alt: '#0b3d2a' },
  { name: 'CARBON ORANGE', bg: ['#2d2d2d', '#121212'], fg: '#e0e0e0', st: '#000', pop: '#ff6a00', alt: '#e0e0e0' },
  { name: 'GOLD PREMIUM', bg: ['#2e2610', '#0e0e0e'], fg: '#ffffff', st: '#000', pop: '#d4af37', alt: '#3b2f0b' },
  { name: 'RED VERDICT', bg: ['#ffffff', '#e4e4e8'], fg: '#101010', st: '#ffffff', pop: '#e10600', alt: '#8e8e93', light: true }
];

// MrBeast-style pack: 10 layouts from docs/RESEARCH.md §1 (zones in % of frame).
// Each layout x 8 palettes (POP_PRESETS) = 80 templates. d.person = main face, d.person2 = second, d.item = prop.
// AAA pass: layered plates (bg plate -> mid light/haze -> sharp hero -> foreground accents), motivated light,
// premium gradient/extruded type, procedural shaded props. All local helpers live in fx() below.
import { pop } from '../../core/pop.js';

const L = (name, draw) => ({ name, niche: 'mrbeast', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) { const U = pop(x, W, H, d, K, P); draw(x, W, H, d, U, K.wide, P, fx(x, W, H, d, U, P, K)); } });

// ---------- colour + canvas utils ----------
const hex = (c) => { c = String(c).replace('#', ''); if (c.length === 3) c = [...c].map((v) => v + v).join(''); const n = parseInt(c.slice(0, 6), 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const rgba = (c, a) => { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; };
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };

// Lit "mystery contestant" silhouette (placeholder until a face is uploaded): dark figure, dual rim light. Cached per colour pair.
const SIL = new Map();
const silhouette = (rimA, rimB) => {
  const k = rimA + rimB; if (SIL.has(k)) return SIL.get(k);
  const c = cv(600, 800), g = c.getContext('2d');
  const shape = (ctx, dx = 0, dy = 0) => {
    ctx.beginPath(); ctx.moveTo(10 + dx, 800 + dy); ctx.bezierCurveTo(20 + dx, 620 + dy, 140 + dx, 565 + dy, 228 + dx, 548 + dy);
    ctx.bezierCurveTo(250 + dx, 530 + dy, 252 + dx, 500 + dy, 248 + dx, 470 + dy); ctx.bezierCurveTo(170 + dx, 420 + dy, 150 + dx, 330 + dy, 152 + dx, 270 + dy);
    ctx.bezierCurveTo(150 + dx, 140 + dy, 225 + dx, 80 + dy, 300 + dx, 80 + dy); ctx.bezierCurveTo(375 + dx, 80 + dy, 450 + dx, 140 + dy, 448 + dx, 270 + dy);
    ctx.bezierCurveTo(450 + dx, 330 + dy, 430 + dx, 420 + dy, 352 + dx, 470 + dy); ctx.bezierCurveTo(348 + dx, 500 + dy, 350 + dx, 530 + dy, 372 + dx, 548 + dy);
    ctx.bezierCurveTo(460 + dx, 565 + dy, 580 + dx, 620 + dy, 590 + dx, 800 + dy); ctx.closePath();
  };
  const body = g.createLinearGradient(0, 80, 0, 800); body.addColorStop(0, '#2a2f3a'); body.addColorStop(.55, '#15181f'); body.addColorStop(1, '#07080b');
  g.fillStyle = body; shape(g); g.fill();
  const rim = (col, dx) => {
    const r = cv(600, 800), q = r.getContext('2d'); q.fillStyle = col; shape(q); q.fill();
    q.globalCompositeOperation = 'destination-out'; q.filter = 'blur(6px)'; shape(q, dx * .45, 8); q.fill();
    g.save(); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = .85; g.filter = 'blur(1.5px)'; g.drawImage(r, 0, 0); g.globalAlpha = .35; g.filter = 'blur(18px)'; g.drawImage(r, 0, 0); g.restore();
  };
  rim(rimA, 30); rim(rimB, -30);
  g.save(); g.globalCompositeOperation = 'source-atop'; const kf = g.createRadialGradient(270, 250, 10, 300, 280, 220);
  kf.addColorStop(0, 'rgba(255,240,220,.16)'); kf.addColorStop(1, 'rgba(255,240,220,0)'); g.fillStyle = kf; g.fillRect(0, 0, 600, 800); g.restore();
  SIL.set(k, c); return c;
};

// ---------- local premium kit ----------
function fx(x, W, H, d, U, P, K) {
  const u = U.u, M = {}, R = K.rnd || Math.random, wide = K.wide;
  const bgL = P.bg[0], bgD = P.bg[1], ink = P.st, acc = P.pop, fg = P.fg;
  const cover = (img, bx, by, bw, bh) => { const s = Math.max(bw / img.width, bh / img.height); x.drawImage(img, bx + (bw - img.width * s) / 2, by + (bh - img.height * s) / 2, img.width * s, img.height * s); };
  M.cover = cover;

  // Background plate: deep radial, soft blurred photo, haze, optional floor.
  M.plate = (o = {}) => {
    const cx = W * (o.cx ?? .5), cy = H * (o.cy ?? .4), Rr = Math.hypot(W, H) * .75;
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, Rr);
    g.addColorStop(0, mix(o.c0 || bgL, '#ffffff', .18)); g.addColorStop(.35, o.c0 || bgL); g.addColorStop(.75, o.c1 || bgD); g.addColorStop(1, mix(o.c1 || bgD, '#000000', .55));
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (d.cover && o.photo !== false) { x.save(); x.globalAlpha = o.photoA ?? .4; x.globalCompositeOperation = 'luminosity'; x.filter = `blur(${12 * u}px)`; cover(d.cover, -30 * u, -30 * u, W + 60 * u, H + 60 * u); x.restore(); }
    if (o.floor) {
      const fy = H * o.floor, f = x.createLinearGradient(0, fy - 40 * u, 0, H);
      f.addColorStop(0, 'rgba(0,0,0,0)'); f.addColorStop(.25, rgba(mix(bgD, '#000', .5), .45)); f.addColorStop(1, rgba(mix(bgD, '#000', .7), .85));
      x.fillStyle = f; x.fillRect(0, fy - 40 * u, W, H - fy + 40 * u);
      x.save(); x.globalCompositeOperation = 'screen'; const hz = x.createLinearGradient(0, fy - 30 * u, 0, fy + 30 * u);
      hz.addColorStop(0, 'rgba(255,255,255,0)'); hz.addColorStop(.5, rgba(mix(bgL, '#fff', .5), .28)); hz.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = hz; x.fillRect(0, fy - 30 * u, W, 60 * u); x.restore();
    }
  };

  // God rays with radial falloff (soft, varied widths), screened on.
  M.shafts = (cx, cy, o = {}) => {
    const n = o.n || 16, c = cv(W / 2, H / 2), g = c.getContext('2d'), RR = Math.hypot(W, H) / 2, a0 = o.a0 ?? 0, sp = o.spread ?? Math.PI * 2;
    g.translate(cx / 2, cy / 2); g.fillStyle = o.c || '#fff';
    for (let i = 0; i < n; i++) {
      const a = a0 + sp * (i + R() * .6) / n, w = sp / n * (.25 + R() * .45);
      g.globalAlpha = .35 + R() * .65; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, RR * 1.2, a, a + w); g.closePath(); g.fill();
    }
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'destination-in';
    const m = g.createRadialGradient(cx / 2, cy / 2, 0, cx / 2, cy / 2, RR * (o.fall ?? .85)); m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(.35, 'rgba(0,0,0,.55)'); m.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = m; g.fillRect(0, 0, c.width, c.height);
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = o.a ?? .45; x.filter = `blur(${4 * u}px)`; x.drawImage(c, 0, 0, W, H); x.restore();
  };

  // Soft light: additive radial bloom.
  M.light = (cx, cy, r, c = '#fff', a = .5) => { x.save(); x.globalCompositeOperation = 'screen'; U.glow(cx, cy, r, c, a); x.restore(); };

  // Bokeh discs (out-of-focus lights) in a region [x0,y0,x1,y1] fractions.
  M.bokeh = (n, [x0, y0, x1, y1], c = '#fff', a = .35) => {
    x.save(); x.globalCompositeOperation = 'screen';
    for (let i = 0; i < n; i++) {
      const bx = W * (x0 + R() * (x1 - x0)), by = H * (y0 + R() * (y1 - y0)), r = (6 + R() * 26) * u;
      const g = x.createRadialGradient(bx, by, 0, bx, by, r); g.addColorStop(0, rgba(c, a * (.4 + R() * .6))); g.addColorStop(.7, rgba(c, a * .35)); g.addColorStop(1, rgba(c, 0));
      x.fillStyle = g; x.beginPath(); x.arc(bx, by, r, 0, 7); x.fill();
    }
    x.restore();
  };

  // Sparks / embers with short streaks; blur > 0 for out-of-focus foreground.
  M.sparks = (n, [x0, y0, x1, y1], c = '#fff', blur = 0) => {
    x.save(); x.globalCompositeOperation = 'screen'; if (blur) x.filter = `blur(${blur * u}px)`; x.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const sx = W * (x0 + R() * (x1 - x0)), sy = H * (y0 + R() * (y1 - y0)), l = (4 + R() * 18) * u * (blur ? 2 : 1), a = -1.2 + R() * .5;
      x.strokeStyle = rgba(c, .5 + R() * .5); x.lineWidth = (1.5 + R() * 2.5) * u * (blur ? 2.5 : 1);
      x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + Math.cos(a) * l, sy + Math.sin(a) * l); x.stroke();
    }
    x.restore();
  };

  // Spotlight cone from (tx,ty) widening to a floor pool at (bx,by).
  M.cone = (tx, ty, bx, by, wt, wb, c = '#fff', a = .35) => {
    x.save(); x.globalCompositeOperation = 'screen'; x.filter = `blur(${10 * u}px)`;
    const g = x.createLinearGradient(tx, ty, bx, by); g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0));
    x.fillStyle = g; x.beginPath(); x.moveTo(tx - wt / 2, ty); x.lineTo(tx + wt / 2, ty); x.lineTo(bx + wb / 2, by); x.lineTo(bx - wb / 2, by); x.closePath(); x.fill();
    x.filter = `blur(${18 * u}px)`; x.fillStyle = rgba(c, a * .6); x.beginPath(); x.ellipse(bx, by, wb * .55, wb * .12, 0, 0, 7); x.fill();
    x.restore();
  };

  // Hero person: palette rim light + key wrap + bottom falloff, thin clean outline, contact shadow, back bloom.
  M.person = (img, cx, bottom, h, o = {}) => {
    const src = img || silhouette(o.rimA || mix(fg, '#ffffff', .4), o.rimB || acc), w = h * src.width / src.height, ow = (o.ow ?? (img ? 6 : 0)) * u, p = Math.max(ow * 2, 4 * u) + 6 * u;
    const oc = cv(w + p * 2, h + p * 2), g = oc.getContext('2d');
    if (o.flip) { g.translate(oc.width, 0); g.scale(-1, 1); }
    if (img) g.filter = o.filter || 'brightness(1.08) saturate(1.22) contrast(1.08)';
    g.drawImage(src, p, p, w, h); g.setTransform(1, 0, 0, 1, 0, 0); g.filter = 'none';
    if (img) {
      g.globalCompositeOperation = 'source-atop';
      const side = o.light === 'l' ? 0 : oc.width, lg = g.createLinearGradient(side, 0, oc.width * (o.light === 'l' ? .38 : .62), 0);
      lg.addColorStop(0, rgba(o.rim || acc, .55)); lg.addColorStop(1, rgba(o.rim || acc, 0)); g.fillStyle = lg; g.fillRect(0, 0, oc.width, oc.height);
      const kg = g.createLinearGradient(oc.width - side, 0, oc.width * .5, 0); kg.addColorStop(0, 'rgba(255,245,230,.22)'); kg.addColorStop(1, 'rgba(255,245,230,0)'); g.fillStyle = kg; g.fillRect(0, 0, oc.width, oc.height);
    }
    g.globalCompositeOperation = 'source-atop';
    const bs = g.createLinearGradient(0, p + h * .6, 0, p + h); bs.addColorStop(0, 'rgba(0,0,0,0)'); bs.addColorStop(1, `rgba(0,0,0,${o.foot ?? .45})`); g.fillStyle = bs; g.fillRect(0, 0, oc.width, oc.height);
    if (o.dim) { g.fillStyle = `rgba(0,0,0,${o.dim})`; g.fillRect(0, 0, oc.width, oc.height); }
    const sil = cv(oc.width, oc.height), s = sil.getContext('2d'); s.drawImage(oc, 0, 0); s.globalCompositeOperation = 'source-in'; s.fillStyle = o.line || '#fff'; s.fillRect(0, 0, sil.width, sil.height);
    const X = cx - oc.width / 2, Y = bottom - h - p;
    if (o.glow !== false) M.light(cx, bottom - h * .6, h * .7, o.glow || acc, .5);
    x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 50 * u; x.shadowOffsetY = 18 * u; x.drawImage(sil, X, Y); x.restore();
    if (ow > 0) for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; x.drawImage(sil, X + Math.cos(a) * ow, Y + Math.sin(a) * ow); }
    x.drawImage(oc, X, Y);
    return { x: X + p, y: Y + p, w, h };
  };

  // Premium title: vertical gradient fill with highlight, deep extrusion, heavy ink stroke, one accent word.
  M.title = (t, b, o = {}) => {
    const base = o.fill || fg, gr = x.createLinearGradient(0, -b.h / 2, 0, b.h / 2);
    gr.addColorStop(0, mix(base, '#ffffff', .65)); gr.addColorStop(.42, mix(base, '#ffffff', .1)); gr.addColorStop(.5, base); gr.addColorStop(1, mix(base, '#000000', .28));
    let hi; const n = String(t).trim().split(/\s+/).length;
    if (o.accent !== false && n > 1) { const ac = o.accent || (acc.toLowerCase() === base.toLowerCase() ? '#ffffff' : acc); hi = x.createLinearGradient(0, -b.h / 2, 0, b.h / 2); hi.addColorStop(0, mix(ac, '#ffffff', .5)); hi.addColorStop(.5, ac); hi.addColorStop(1, mix(ac, '#000000', .3)); }
    return U.words(t, b, { maxLines: n > 5 ? 3 : 2, sw: .18, ext: o.ext ?? 16, extC: mix(ink, bgD, .25), glow: o.halo === false ? null : rgba(o.haloC || bgL, .55), ...o, fill: gr, hi });
  };

  // Shaded 3/4 gift crate: the "giant prize" placeholder prop. Returns bounds.
  M.crate = (cx, bottom, h, o = {}) => {
    const c = o.c || acc, rib = o.rib || (fg.toLowerCase() === c.toLowerCase() ? '#ffffff' : fg), fw = h * .78, sw = h * .24, td = h * .2, fh = h - td;
    const L0 = cx - (fw + sw) / 2, T0 = bottom - fh;
    x.save(); x.filter = `blur(${18 * u}px)`; x.fillStyle = 'rgba(0,0,0,.6)'; x.beginPath(); x.ellipse(cx + sw * .2, bottom, (fw + sw) * .62, h * .06, 0, 0, 7); x.fill(); x.restore();
    if (o.glow !== false) M.light(cx, bottom - h * .5, h * .9, c, .45);
    const poly = (pts, f) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fillStyle = f; x.fill(); };
    const fr = x.createLinearGradient(L0, T0, L0 + fw * .3, bottom); fr.addColorStop(0, mix(c, '#ffffff', .25)); fr.addColorStop(1, mix(c, '#000000', .35));
    const sd = x.createLinearGradient(L0 + fw, 0, L0 + fw + sw, 0); sd.addColorStop(0, mix(c, '#000000', .4)); sd.addColorStop(1, mix(c, '#000000', .62));
    const tp = x.createLinearGradient(0, T0 - td, 0, T0); tp.addColorStop(0, mix(c, '#ffffff', .5)); tp.addColorStop(1, mix(c, '#ffffff', .2));
    x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 40 * u; x.shadowOffsetY = 16 * u;
    poly([[L0, T0], [L0 + fw, T0], [L0 + fw, bottom], [L0, bottom]], fr); x.restore();
    poly([[L0 + fw, T0], [L0 + fw + sw, T0 - td], [L0 + fw + sw, bottom - td], [L0 + fw, bottom]], sd);
    poly([[L0, T0], [L0 + sw, T0 - td], [L0 + fw + sw, T0 - td], [L0 + fw, T0]], tp);
    const rw = fw * .15, rg = (a, b) => { const g = x.createLinearGradient(a, 0, b, 0); g.addColorStop(0, mix(rib, '#000', .25)); g.addColorStop(.45, mix(rib, '#fff', .35)); g.addColorStop(1, mix(rib, '#000', .2)); return g; };
    poly([[L0 + fw / 2 - rw / 2, T0], [L0 + fw / 2 + rw / 2, T0], [L0 + fw / 2 + rw / 2, bottom], [L0 + fw / 2 - rw / 2, bottom]], rg(L0 + fw / 2 - rw / 2, L0 + fw / 2 + rw / 2));
    const ry = T0 + fh * .42; poly([[L0, ry - rw / 2], [L0 + fw, ry - rw / 2], [L0 + fw, ry + rw / 2], [L0, ry + rw / 2]], mix(rib, '#000', .08));
    poly([[L0 + fw, ry - rw / 2], [L0 + fw + sw, ry - rw / 2 - td], [L0 + fw + sw, ry + rw / 2 - td], [L0 + fw, ry + rw / 2]], mix(rib, '#000', .45));
    const tcx = L0 + fw / 2 + sw / 2, tcy = T0 - td / 2;
    poly([[L0 + fw / 2 - rw / 2, T0], [L0 + fw / 2 + rw / 2, T0], [L0 + fw / 2 + rw / 2 + sw, T0 - td], [L0 + fw / 2 - rw / 2 + sw, T0 - td]], mix(rib, '#fff', .2));
    x.save(); x.translate(tcx, tcy); const bw = fw * .3;
    for (const sgn of [-1, 1]) { const bg2 = x.createRadialGradient(sgn * bw * .5, -bw * .35, 0, sgn * bw * .5, -bw * .3, bw * .7); bg2.addColorStop(0, mix(rib, '#fff', .45)); bg2.addColorStop(1, mix(rib, '#000', .35)); x.fillStyle = bg2; x.beginPath(); x.ellipse(sgn * bw * .48, -bw * .3, bw * .55, bw * .33, sgn * -.5, 0, 7); x.fill(); }
    x.fillStyle = mix(rib, '#000', .15); x.beginPath(); x.ellipse(0, -bw * .12, bw * .18, bw * .15, 0, 0, 7); x.fill(); x.restore();
    x.save(); x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 3 * u; x.beginPath(); x.moveTo(L0, T0); x.lineTo(L0 + fw, T0); x.lineTo(L0 + fw + sw, T0 - td); x.stroke(); x.restore();
    if (o.q !== false) { x.save(); x.font = `${fh * .42}px Anton, Impact, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(0,0,0,.22)'; x.fillText('?', L0 + fw * .25, T0 + fh * .72); x.restore(); }
    return { x: L0, y: T0 - td, w: fw + sw, h };
  };

  // The prop in a layout: uploaded cut-out item > photo card > shaded crate.
  M.hero = (cx, bottom, h, card, o = {}) => {
    if (d.item) return U.prop(d.item, cx, bottom, h, { rim: '#ffffff', rimA: .35, rot: o.rot || 0 });
    if (d.cover) { const b = U.box(card); M.light(b.x + b.w / 2, b.y + b.h / 2, Math.max(b.w, b.h) * .75, acc, .5); U.imgBox(d.cover, b, { rot: o.rot || 0, r: 14 }); return b; }
    return M.crate(cx, bottom, h * .92, o);
  };

  // Brick of banded cash: top face, edge banding, paper strap.
  const brick = (cx, cy, w, hh, shade = 0) => {
    const td = w * .3, x0 = cx - w / 2;
    const fr = x.createLinearGradient(0, cy, 0, cy + hh); fr.addColorStop(0, '#dfeedd'); fr.addColorStop(1, '#8fb894');
    x.fillStyle = fr; x.fillRect(x0, cy, w, hh);
    x.fillStyle = 'rgba(40,90,50,.45)'; for (let yy = cy + 2 * u; yy < cy + hh; yy += 3 * u) x.fillRect(x0, yy, w, .9 * u);
    const tp = x.createLinearGradient(x0, cy - td, x0 + w, cy); tp.addColorStop(0, '#8fd49a'); tp.addColorStop(.5, '#4f9e5e'); tp.addColorStop(1, '#2e6e3c');
    x.fillStyle = tp; x.beginPath(); x.moveTo(x0, cy); x.lineTo(x0 + w * .12, cy - td); x.lineTo(x0 + w * 1.12, cy - td); x.lineTo(x0 + w, cy); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(220,245,215,.55)'; x.lineWidth = 1.5 * u; x.beginPath(); x.moveTo(x0 + w * .1, cy - td * .15); x.lineTo(x0 + w * .19, cy - td * .85); x.lineTo(x0 + w * 1.03, cy - td * .85); x.lineTo(x0 + w * .94, cy - td * .15); x.closePath(); x.stroke();
    x.fillStyle = 'rgba(20,60,30,.35)'; x.beginPath(); x.ellipse(x0 + w * .56, cy - td * .5, w * .1, td * .3, 0, 0, 7); x.fill();
    x.fillStyle = '#6f9c76'; x.beginPath(); x.moveTo(x0 + w, cy); x.lineTo(x0 + w * 1.12, cy - td); x.lineTo(x0 + w * 1.12, cy - td + hh); x.lineTo(x0 + w, cy + hh); x.closePath(); x.fill();
    const sx = x0 + w * .44, sw2 = w * .14, sg = x.createLinearGradient(sx, 0, sx + sw2, 0); sg.addColorStop(0, '#c9a94a'); sg.addColorStop(.5, '#fff1b8'); sg.addColorStop(1, '#b8902f');
    x.fillStyle = sg; x.fillRect(sx, cy, sw2, hh); x.beginPath(); x.moveTo(sx, cy); x.lineTo(sx + w * .12, cy - td); x.lineTo(sx + sw2 + w * .12, cy - td); x.lineTo(sx + sw2, cy); x.closePath(); x.fill();
    if (shade) { x.fillStyle = `rgba(0,0,0,${shade})`; x.beginPath(); x.moveTo(x0, cy + hh); x.lineTo(x0, cy); x.lineTo(x0 + w * .12, cy - td); x.lineTo(x0 + w * 1.12, cy - td); x.lineTo(x0 + w * 1.12, cy - td + hh); x.lineTo(x0 + w, cy + hh); x.closePath(); x.fill(); }
  };
  // Pile of cash bricks filling a band; back rows darker/smaller, front rows larger.
  M.cash = (by, bh, o = {}) => {
    const rows = o.rows || 7, cxm = W * (o.cx ?? .5);
    // mound body so no plate shows between bricks
    const mg = x.createLinearGradient(0, by, 0, by + bh); mg.addColorStop(0, '#2c6a3a'); mg.addColorStop(1, '#0b2512');
    x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 40 * u; x.fillStyle = mg; x.beginPath(); x.moveTo(-20 * u, H + 20 * u);
    x.bezierCurveTo(-20 * u, by + bh * .35, cxm - W * .3, by, cxm, by); x.bezierCurveTo(cxm + W * .3, by, W + 20 * u, by + bh * .35, W + 20 * u, H + 20 * u); x.closePath(); x.fill(); x.restore();
    for (let r = 0; r < rows; r++) {
      const t = r / (rows - 1), w = (wide ? 110 : 140) * u * (.6 + t * .8), hh = w * .22;
      for (let cx = -w * .5 + R() * w * .5; cx < W + w; cx += w * (.8 + R() * .35)) {
        const dx = Math.min(1, Math.abs(cx - cxm) / (W * .55)), y = by + bh * (.04 + t * .82) + dx * dx * bh * .35 * (1 - t) + (R() - .5) * hh * 1.4;
        x.save(); x.translate(cx, y); x.rotate((R() - .5) * .35); brick(0, 0, w, hh, (1 - t) * .5 + R() * .1); x.restore();
      }
    }
  };
  // Loose bills floating; blur for foreground depth.
  M.bills = (n, [x0, y0, x1, y1], blur = 0, size = 1) => {
    x.save(); if (blur) x.filter = `blur(${blur * u}px)`;
    for (let i = 0; i < n; i++) {
      const bx = W * (x0 + R() * (x1 - x0)), by = H * (y0 + R() * (y1 - y0)), w = 120 * u * size * (.7 + R() * .6), h = w * .43;
      x.save(); x.translate(bx, by); x.rotate((R() - .5) * 2.2); x.transform(1, 0, (R() - .5) * .6, .7 + R() * .3, 0, 0);
      const g = x.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, '#a8dfa8'); g.addColorStop(.5, '#5aa86a'); g.addColorStop(1, '#2d6a3a');
      x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 12 * u; x.shadowOffsetY = 6 * u; x.fillStyle = g; x.fillRect(-w / 2, -h / 2, w, h); x.shadowColor = 'transparent';
      x.strokeStyle = 'rgba(225,250,220,.7)'; x.lineWidth = 1.6 * u; x.strokeRect(-w / 2 + 5 * u, -h / 2 + 5 * u, w - 10 * u, h - 10 * u);
      x.fillStyle = 'rgba(20,60,30,.45)'; x.beginPath(); x.ellipse(0, 0, h * .32, h * .36, 0, 0, 7); x.fill();
      x.restore();
    }
    x.restore();
  };

  // Lit pill tag with bevel.
  M.tag = (text, cx, cy, o = {}) => {
    const s = (o.size || 40) * u, c = o.bg || acc; x.save(); x.translate(cx, cy); x.rotate(o.rot || 0);
    x.font = `${s}px Anton, Impact, sans-serif`; const w = x.measureText(text).width + s * 1.1, h = s * 1.45;
    x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 22 * u; x.shadowOffsetY = 8 * u;
    x.fillStyle = ink; x.beginPath(); x.roundRect(-w / 2 - 4 * u, -h / 2 - 4 * u, w + 8 * u, h + 8 * u, h * .3); x.fill(); x.shadowColor = 'transparent';
    const g = x.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, mix(c, '#fff', .35)); g.addColorStop(.5, c); g.addColorStop(1, mix(c, '#000', .35));
    x.fillStyle = g; x.beginPath(); x.roundRect(-w / 2, -h / 2, w, h, h * .26); x.fill();
    x.fillStyle = 'rgba(255,255,255,.28)'; x.beginPath(); x.roundRect(-w / 2 + 4 * u, -h / 2 + 3 * u, w - 8 * u, h * .38, h * .2); x.fill();
    x.fillStyle = o.fg || '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowOffsetY = 3 * u; x.fillText(text, 0, s * .06);
    x.restore();
  };

  // Metallic VS disk with energy bloom.
  M.vs = (cx, cy, r) => {
    M.light(cx, cy, r * 3.2, '#ffffff', .55); M.light(cx, cy, r * 2, acc, .6);
    x.save(); x.translate(cx, cy); x.rotate(-.12);
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 30 * u; x.shadowOffsetY = 10 * u;
    const m = x.createLinearGradient(0, -r, 0, r); m.addColorStop(0, '#ffffff'); m.addColorStop(.5, '#b9bec8'); m.addColorStop(.52, '#7d838f'); m.addColorStop(1, '#e8ebf0');
    x.fillStyle = m; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill(); x.shadowColor = 'transparent';
    const ig = x.createRadialGradient(-r * .3, -r * .4, 0, 0, 0, r * .86); ig.addColorStop(0, '#454852'); ig.addColorStop(1, '#07080a');
    x.fillStyle = ig; x.beginPath(); x.arc(0, 0, r * .84, 0, 7); x.fill();
    x.font = `${r * 1.05}px Anton, Impact, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
    const vc = hex(fg).reduce((a, b) => a + b) < 200 ? '#ffe600' : fg;
    const tg = x.createLinearGradient(0, -r * .5, 0, r * .5); tg.addColorStop(0, mix(vc, '#fff', .6)); tg.addColorStop(.5, vc); tg.addColorStop(1, mix(vc, '#000', .3));
    x.strokeStyle = '#000'; x.lineWidth = r * .12; x.strokeText('VS', 0, r * .06); x.fillStyle = tg; x.fillText('VS', 0, r * .06);
    x.globalCompositeOperation = 'screen'; x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.ellipse(0, -r * .45, r * .62, r * .26, 0, 0, 7); x.fill();
    x.restore();
  };

  // Callout ring: glowing, inner lift, two-tone stroke.
  M.ring = (cx, cy, r) => {
    x.save(); x.beginPath(); x.ellipse(cx, cy, r * 1.08, r, -.15, 0, 7); x.clip(); x.globalCompositeOperation = 'screen'; x.fillStyle = 'rgba(255,255,255,.14)'; x.fillRect(0, 0, W, H); x.restore();
    x.save(); x.translate(cx, cy); x.rotate(-.15);
    x.shadowColor = acc; x.shadowBlur = 40 * u; x.strokeStyle = acc; x.lineWidth = 16 * u; x.beginPath(); x.ellipse(0, 0, r * 1.08, r, 0, 0, 7); x.stroke();
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 14 * u; x.shadowOffsetY = 6 * u; x.strokeStyle = '#fff'; x.lineWidth = 22 * u; x.stroke(); x.shadowColor = 'transparent';
    const g = x.createLinearGradient(0, -r, 0, r); g.addColorStop(0, mix(acc, '#fff', .3)); g.addColorStop(1, mix(acc, '#000', .25)); x.strokeStyle = g; x.lineWidth = 13 * u; x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 3 * u; x.beginPath(); x.ellipse(0, 0, r * 1.08, r, 0, Math.PI * 1.1, Math.PI * 1.55); x.stroke();
    x.restore();
  };

  // Stopwatch dial behind the countdown number.
  M.dial = (cx, cy, r) => {
    M.light(cx, cy, r * 1.6, acc, .45);
    x.save(); x.translate(cx, cy);
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 40 * u; x.shadowOffsetY = 14 * u;
    const rim = x.createLinearGradient(0, -r, 0, r); rim.addColorStop(0, '#f4f6fa'); rim.addColorStop(.5, '#8b92a0'); rim.addColorStop(1, '#3a3f48');
    x.fillStyle = rim; x.fillRect(-r * .12, -r * 1.2, r * .24, r * .2); x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill(); x.shadowColor = 'transparent';
    const face = x.createRadialGradient(-r * .3, -r * .3, 0, 0, 0, r * .92); face.addColorStop(0, mix(bgD, '#000', .35)); face.addColorStop(1, mix(bgD, '#000', .8));
    x.fillStyle = face; x.beginPath(); x.arc(0, 0, r * .9, 0, 7); x.fill();
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, big = i % 5 === 0; x.strokeStyle = big ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.3)'; x.lineWidth = (big ? 5 : 2) * u; x.beginPath(); x.moveTo(Math.cos(a) * r * (big ? .7 : .76), Math.sin(a) * r * (big ? .7 : .76)); x.lineTo(Math.cos(a) * r * .84, Math.sin(a) * r * .84); x.stroke(); }
    x.shadowColor = acc; x.shadowBlur = 24 * u; x.strokeStyle = acc; x.lineWidth = 12 * u; x.lineCap = 'round'; x.beginPath(); x.arc(0, 0, r * .9 - 8 * u, -Math.PI / 2, Math.PI * 1.15); x.stroke();
    x.shadowColor = 'transparent'; x.fillStyle = 'rgba(255,255,255,.1)'; x.beginPath(); x.ellipse(-r * .15, -r * .45, r * .6, r * .3, -.3, 0, 7); x.fill();
    x.restore();
  };

  // Circular face medallion (head crop of a cut-out).
  M.medal = (img, cx, cy, r, o = {}) => {
    const src = img || silhouette(mix(fg, '#fff', .4), acc);
    M.light(cx, cy, r * 1.8, o.c || acc, .45);
    x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 30 * u; x.shadowOffsetY = 10 * u; x.fillStyle = '#fff'; x.beginPath(); x.arc(cx, cy, r + 7 * u, 0, 7); x.fill(); x.restore();
    x.save(); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.clip();
    const bg = x.createRadialGradient(cx, cy - r * .3, 0, cx, cy, r); bg.addColorStop(0, mix(o.c || acc, '#fff', .3)); bg.addColorStop(1, mix(o.c || acc, '#000', .45)); x.fillStyle = bg; x.fillRect(cx - r, cy - r, r * 2, r * 2);
    const w = r * 2.3, h = w * src.height / src.width; x.translate(cx, 0); if (o.flip) x.scale(-1, 1);
    if (img) x.filter = 'brightness(1.08) saturate(1.2)'; x.drawImage(src, -w / 2, cy - r * .92, w, h); x.filter = 'none'; x.setTransform(1, 0, 0, 1, 0, 0);
    const v = x.createRadialGradient(cx, cy, r * .6, cx, cy, r); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.4)'); x.fillStyle = v; x.fillRect(cx - r, cy - r, r * 2, r * 2);
    x.restore();
    x.save(); x.strokeStyle = o.c || acc; x.lineWidth = 6 * u; x.beginPath(); x.arc(cx, cy, r + 2 * u, 0, 7); x.stroke(); x.restore();
  };

  // Backlit crowd: rows of head+shoulder silhouettes with rim, fogged with depth.
  M.crowd = (y0, y1, o = {}) => {
    const rows = o.rows || 4, rimC = o.rim || mix(bgL, '#fff', .5), fog = mix(bgD, '#000', .2);
    for (let r = 0; r < rows; r++) {
      const t = r / (rows - 1), s = (wide ? 26 : 34) * u * (1 + t * 1.5), y = y0 + (y1 - y0) * (.04 + t * .5), body = mix(fog, '#030304', .35 + t * .6);
      for (let cx = -s + R() * s; cx < W + s; cx += s * (1.15 + R() * .3)) {
        const ox = cx, oy = y + (R() - .5) * s * .3, arm = R() < .12 + .1 * t;
        const fig = (dy, f) => { x.fillStyle = f; x.beginPath(); x.ellipse(ox, oy + dy, s * .36, s * .44, 0, 0, 7); x.fill(); x.beginPath(); x.roundRect(ox - s * .75, oy + s * .38 + dy, s * 1.5, s * 3.4, s * .55); x.fill(); if (arm) { x.beginPath(); x.roundRect(ox + s * .45, oy - s * 1.2 + dy, s * .3, s * 1.9, s * .15); x.fill(); } };
        fig(-2.5 * u * (1 + t), rgba(rimC, .55 + t * .3)); fig(0, body);
      }
      const fg2 = x.createLinearGradient(0, y - s, 0, y + s * 3); fg2.addColorStop(0, rgba(mix(bgL, bgD, .5), .25 * (1 - t))); fg2.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = fg2; x.fillRect(0, y - s, W, s * 4);
    }
  };

  M.end = (o = {}) => { U.grade({ bloom: .2, tone: .26, ...o.grade }); U.finish({ vig: .42, ...o }); };
  return M;
}

export default [
  // 1. Shocked face left, giant prize right, words top-right.
  L('SHOCK + GIANT', (x, W, H, d, U, w, P, M) => {
    M.plate({ cx: w ? .66 : .5, cy: w ? .42 : .34, floor: w ? .82 : .56 });
    M.shafts(w ? .66 * W : .5 * W, w ? .4 * H : .34 * H, { n: 18, a: .5 });
    M.bokeh(14, [0, 0, 1, .7], P.bg[0], .3);
    if (w) {
      M.hero(.67 * W, .86 * H, .6 * H, [.46, .28, .42, .5], { rot: .03 });
      M.person(d.person, .2 * W, H * 1.02, .9 * H, { light: 'r' });
      M.sparks(24, [.4, .2, .95, .8], P.fg);
      M.title(d.big, U.box([.42, .03, .54, .23]), { rot: -.03 });
    } else {
      M.hero(.5 * W, .53 * H, .27 * H, [.12, .27, .76, .25], { rot: .02 });
      M.person(d.person, .47 * W, H, .45 * H);
      M.sparks(24, [.05, .2, .95, .55], P.fg);
      M.title(d.big, U.box([.06, .08, .76, .15]), { rot: -.03 });
    }
    M.sparks(6, [0, .6, .5, 1], '#ffffff', 5);
    M.end();
  }),

  // 2. Hero rising out of a mountain of banded cash, money number top-left.
  L('MONEY PILE', (x, W, H, d, U, w, P, M) => {
    M.plate({ cy: w ? .3 : .26 });
    M.shafts(.5 * W, -.05 * H, { n: 14, a: .55, c: '#fff4c2', spread: Math.PI * .9, a0: Math.PI * .05, fall: 1.1 });
    M.bokeh(12, [0, .05, 1, .5], '#ffe48a', .35);
    M.bills(6, [0, .05, 1, .5], 2.5, .7);
    if (w) {
      M.person(d.person, .58 * W, .8 * H, .72 * H, { glow: '#ffe066' });
      M.cash(.6 * H, .45 * H);
      M.bills(4, [0, .75, .7, 1.05], 7, 1.6);
      M.title(U.num('$10,000'), U.box([.03, .06, .38, .3]), { rot: -.05, fill: '#7CFF4D', accent: false, haloC: '#7CFF4D' });
    } else {
      M.person(d.person, .47 * W, .66 * H, .42 * H, { glow: '#ffe066' });
      M.cash(.6 * H, .34 * H);
      M.bills(4, [0, .82, 1, 1.02], 7, 1.6);
      M.title(U.num('$10,000'), U.box([.06, .08, .76, .15]), { rot: -.04, fill: '#7CFF4D', accent: false, haloC: '#7CFF4D' });
    }
    M.end({ grade: { warm: '#ffe7a0' } });
  }),

  // 3. Duel: two lit halves, energy seam, metal VS disk.
  L('SPLIT VS', (x, W, H, d, U, w, P, M) => {
    M.plate({ photoA: .3 });
    x.save(); x.beginPath();
    if (w) { x.moveTo(W * .54, 0); x.lineTo(W, 0); x.lineTo(W, H); x.lineTo(W * .46, H); } else { x.moveTo(0, H * .52); x.lineTo(W, H * .48); x.lineTo(W, H); x.lineTo(0, H); }
    x.closePath(); x.clip();
    const gx = w ? .78 * W : .5 * W, gy = w ? .4 * H : .75 * H, g = x.createRadialGradient(gx, gy, 0, gx, gy, Math.hypot(W, H) * .6);
    g.addColorStop(0, mix(P.pop, '#ffffff', .5)); g.addColorStop(.25, P.pop); g.addColorStop(1, mix(P.pop, '#000000', .85)); x.fillStyle = g; x.fillRect(0, 0, W, H); x.restore();
    M.shafts(w ? .2 * W : .5 * W, w ? .3 * H : .2 * H, { n: 12, a: .35 });
    M.shafts(w ? .8 * W : .5 * W, w ? .3 * H : .75 * H, { n: 12, a: .3, c: '#ffe9c2' });
    x.save(); x.globalCompositeOperation = 'screen'; x.lineCap = 'round';
    for (const [lw, a, b] of [[30, .25, 18], [12, .7, 6], [4, 1, 0]]) { x.strokeStyle = `rgba(255,255,255,${a})`; x.lineWidth = lw * U.u; x.filter = b ? `blur(${b * U.u}px)` : 'none'; x.beginPath(); w ? (x.moveTo(.54 * W, 0), x.lineTo(.46 * W, H)) : (x.moveTo(0, .52 * H), x.lineTo(W, .48 * H)); x.stroke(); }
    x.restore();
    const B = d.person2 || d.item;
    if (w) {
      M.person(d.person, .24 * W, H * 1.02, .86 * H, { light: 'r', rim: P.bg[0], glow: P.bg[0] });
      M.person(B, .76 * W, H * .8, .7 * H, B ? { flip: !!d.person2, light: 'l', rim: '#fff', glow: P.pop } : { flip: true, rimA: P.pop, rimB: '#ffffff', glow: P.pop });
      M.vs(.5 * W, .44 * H, .12 * H);
      M.title(d.big, U.box([.03, .72, .42, .24]), { align: 'left', ext: 12 });
    } else {
      M.person(d.person, .45 * W, .48 * H, .27 * H, { glow: P.bg[0] });
      M.person(B, .47 * W, .86 * H, .33 * H, B ? { flip: !!d.person2, glow: P.pop } : { flip: true, rimA: P.pop, rimB: '#ffffff', glow: P.pop });
      M.vs(.47 * W, .5 * H, .085 * H);
      M.title(d.big, U.box([.06, .08, .76, .12]), { ext: 12 });
    }
    M.end();
  }),

  // 4. Tiny person on an endless floor vs. an enormous prop.
  L('SCALE SHOT', (x, W, H, d, U, w, P, M) => {
    const fy = w ? .82 : .7;
    M.plate({ cx: w ? .62 : .5, cy: w ? .35 : .4, floor: fy });
    x.save(); x.globalCompositeOperation = 'screen'; x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = 2 * U.u;
    for (let i = -10; i <= 10; i++) { x.beginPath(); x.moveTo(W * .5 + i * W * .04, H * fy); x.lineTo(W * .5 + i * W * .3, H); x.stroke(); }
    x.restore();
    M.shafts(w ? .62 * W : .5 * W, w ? .1 * H : .2 * H, { n: 10, a: .4, spread: Math.PI * .8, a0: Math.PI * .1 });
    M.bokeh(10, [0, 0, 1, .5], P.bg[0], .25);
    if (w) {
      M.hero(.63 * W, .86 * H, .84 * H, [.36, .06, .56, .7], { rot: -.02 });
      M.person(d.person, .13 * W, .97 * H, .4 * H, { light: 'r', ow: 5 });
      U.arrow(.21 * W, .56 * H, .33 * W, .42 * H, { w: 14 });
      M.title(d.big, U.box([.02, .04, .3, .36]), { maxLines: 3, align: 'left', ext: 12 });
    } else {
      M.hero(.5 * W, .7 * H, .44 * H, [.08, .26, .84, .4], { rot: -.02 });
      M.person(d.person, .2 * W, .78 * H, .16 * H, { ow: 5 });
      U.arrow(.32 * W, .7 * H, .44 * W, .62 * H, { w: 14 });
      M.title(d.big, U.box([.06, .08, .76, .14]));
    }
    M.end({ grade: { tone: .3 } });
  }),

  // 5. Huge extruded number on a stopwatch dial, face right.
  L('COUNTDOWN', (x, W, H, d, U, w, P, M) => {
    M.plate({ cx: w ? .3 : .5, cy: w ? .4 : .26 });
    M.shafts(w ? .26 * W : .5 * W, w ? .42 * H : .25 * H, { n: 16, a: .35 });
    if (w) {
      M.dial(.25 * W, .42 * H, .36 * H);
      M.title(U.num(), U.box([.04, .16, .42, .5]), { rot: -.05, accent: false, ext: 24 });
      M.title(U.rest(), U.box([.04, .76, .4, .16]), { ext: 10, halo: false });
      M.person(d.person, .7 * W, H * 1.02, .92 * H, { light: 'l' });
    } else {
      M.dial(.47 * W, .25 * H, .3 * W);
      M.title(U.num(), U.box([.1, .15, .72, .2]), { rot: -.05, accent: false, ext: 24 });
      M.title(U.rest(), U.box([.06, .38, .76, .07]), { ext: 10, halo: false });
      M.person(d.person, .47 * W, H, .5 * H);
    }
    M.sparks(16, [0, .1, 1, .9], P.pop, 3);
    M.end();
  }),

  // 6. One dominant face, two reaction medallions.
  L('TRIPLE FACE', (x, W, H, d, U, w, P, M) => {
    M.plate({ cy: .5 });
    M.shafts(.5 * W, w ? .55 * H : .6 * H, { n: 22, a: .45 });
    M.bokeh(16, [0, 0, 1, 1], P.bg[0], .3);
    const side = d.person2 || d.person;
    if (w) {
      M.medal(side, .14 * W, .4 * H, .17 * H);
      M.medal(side, .86 * W, .4 * H, .17 * H, { flip: true });
      M.person(d.person, .5 * W, H * 1.03, .84 * H);
      M.title(U.hero(), U.box([.32, .02, .36, .16]), { accent: false });
    } else {
      M.medal(side, .2 * W, .37 * H, .12 * W);
      M.medal(side, .7 * W, .37 * H, .12 * W, { flip: true });
      M.person(d.person, .46 * W, H, .5 * H);
      M.title(U.hero(), U.box([.06, .08, .76, .14]), { accent: false });
    }
    M.end();
  }),

  // 7. Desaturated "before" vs. glowing "after" across a light seam.
  L('BEFORE / AFTER', (x, W, H, d, U, w, P, M) => {
    const A = w ? [[0, 0], [.45, 0], [.55, 1], [0, 1]] : [[0, 0], [1, 0], [1, .45], [0, .55]], B = w ? [[.45, 0], [1, 0], [1, 1], [.55, 1]] : [[0, .45], [1, .45], [1, 1], [0, 1]];
    const clip = (pts) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a * W, b * H) : x.moveTo(a * W, b * H)); x.closePath(); x.clip(); };
    const [ca, cb] = w ? [[.24, .5], [.76, .5]] : [[.47, .25], [.47, .6]];
    x.save(); clip(A); x.filter = 'grayscale(1) brightness(.75) contrast(1.1)';
    if (d.cover) M.cover(d.cover, 0, 0, W, H); else { M.plate({ cx: ca[0], cy: ca[1], photo: false }); M.crate(ca[0] * W, (ca[1] + (w ? .22 : .1)) * H, w ? .4 * H : .16 * H, { glow: false }); }
    x.filter = 'none'; x.fillStyle = 'rgba(20,30,45,.3)'; x.fillRect(0, 0, W, H); x.restore();
    x.save(); clip(B);
    if (d.item || d.cover) { x.filter = 'saturate(1.45) contrast(1.1) brightness(1.05)'; M.cover(d.item || d.cover, 0, 0, W, H); x.filter = 'none'; }
    else { M.plate({ cx: cb[0], cy: cb[1], photo: false }); M.shafts(cb[0] * W, cb[1] * H, { n: 14, a: .55 }); M.crate(cb[0] * W, (cb[1] + (w ? .22 : .1)) * H, w ? .46 * H : .18 * H); }
    M.sparks(20, w ? [.55, .1, 1, .8] : [.1, .5, .9, .9], P.fg); x.restore();
    x.save(); x.globalCompositeOperation = 'screen'; x.lineCap = 'round';
    for (const [lw, a, b] of [[34, .3, 16], [14, .8, 4], [6, 1, 0]]) { x.strokeStyle = `rgba(255,255,255,${a})`; x.lineWidth = lw * U.u; x.filter = b ? `blur(${b * U.u}px)` : 'none'; x.beginPath(); w ? (x.moveTo(.45 * W, 0), x.lineTo(.55 * W, H)) : (x.moveTo(0, .55 * H), x.lineTo(W, .45 * H)); x.stroke(); }
    x.restore();
    if (w) {
      M.tag('BEFORE', .2 * W, .1 * H, { bg: '#4a4f58' }); M.tag('AFTER', .78 * W, .1 * H);
      U.arrow(.36 * W, .5 * H, .64 * W, .5 * H, { bend: -.25, w: 22 });
      M.title(d.big, U.box([.03, .7, .38, .26]), { align: 'left', ext: 12 });
    } else {
      M.tag('BEFORE', .26 * W, .1 * H, { bg: '#4a4f58' }); M.tag('AFTER', .2 * W, .58 * H);
      U.arrow(.72 * W, .34 * H, .72 * W, .6 * H, { bend: .3, w: 22 });
      M.title(d.big, U.box([.06, .71, .76, .08]), { ext: 12 });
    }
    M.end({ vig: .36 });
  }),

  // 8. Wide scene, glowing ring on the detail, reaction face inset bottom-left.
  L('CIRCLE CALLOUT', (x, W, H, d, U, w, P, M) => {
    const [rx, ry] = w ? [.67, .42] : [.58, .4], rr = w ? .13 * H : .14 * W;
    if (d.cover) { x.save(); x.filter = 'saturate(1.35) contrast(1.1)'; M.cover(d.cover, 0, 0, W, H); x.restore(); U.fade('bottom', .4, 'rgba(0,0,0,.6)'); }
    else {
      M.plate({ cx: rx, cy: ry, floor: w ? .72 : .52, photo: false });
      M.shafts(rx * W, ry * H - rr * 3, { n: 10, a: .35, spread: Math.PI * .7, a0: Math.PI * .15 });
      M.bokeh(14, [0, 0, 1, .6], P.bg[0], .3);
      if (!d.item) M.crate(rx * W, ry * H + rr * .75, rr * 1.4);
    }
    if (d.item) U.prop(d.item, rx * W, ry * H + rr * .8, rr * 1.5, { rim: '#fff', rimA: .3 });
    M.ring(rx * W, ry * H, rr);
    if (w) {
      M.person(d.person, .155 * W, .99 * H, .5 * H, { light: 'r' });
      U.arrow(.3 * W, .66 * H, .56 * W, .5 * H, { w: 18 });
      M.title(d.big, U.box([.03, .04, .52, .26]), { align: 'left' });
    } else {
      M.person(d.person, .28 * W, .86 * H, .3 * H);
      U.arrow(.42 * W, .62 * H, .55 * W, .5 * H, { w: 18 });
      M.title(d.big, U.box([.06, .08, .76, .14]));
    }
    M.end();
  }),

  // 9. Host on the right points into a spotlit object on the left.
  L('POINTING HOST', (x, W, H, d, U, w, P, M) => {
    M.plate({ cx: w ? .28 : .5, cy: w ? .55 : .38, floor: w ? .88 : .54 });
    if (w) {
      M.cone(.22 * W, -.05 * H, .27 * W, .9 * H, .08 * W, .42 * W, '#fff6dc', .4);
      M.bokeh(10, [.4, 0, 1, .6], P.bg[0], .25);
      M.hero(.27 * W, .88 * H, .58 * H, [.05, .3, .42, .56], { rot: -.03 });
      M.sparks(14, [.05, .3, .5, .85], P.fg);
      M.person(d.person, .72 * W, H * 1.02, .92 * H, { flip: true, light: 'l', rim: '#fff6dc' });
      U.arrow(.58 * W, .44 * H, .47 * W, .56 * H, { w: 18, bend: -.4 });
      M.title(d.big, U.box([.03, .03, .48, .24]));
    } else {
      M.cone(.5 * W, .02 * H, .5 * W, .52 * H, .12 * W, .9 * W, '#fff6dc', .4);
      M.hero(.47 * W, .52 * H, .28 * H, [.1, .25, .74, .25], { rot: -.03 });
      M.person(d.person, .56 * W, H, .44 * H, { flip: true });
      U.arrow(.34 * W, .64 * H, .26 * W, .52 * H, { w: 16, bend: -.4 });
      M.title(d.big, U.box([.06, .08, .76, .14]));
    }
    M.end();
  }),

  // 10. Arena: backlit crowd, single spotlight on the last one standing.
  L('LAST STANDING', (x, W, H, d, U, w, P, M) => {
    M.plate({ c0: P.bg[1], c1: '#05050a', cy: .2, photoA: .25 });
    M.shafts(.5 * W, -.1 * H, { n: 12, a: .3, spread: Math.PI * .8, a0: Math.PI * .1, fall: 1.2, c: P.bg[0] });
    M.bokeh(22, [0, 0, 1, .4], P.bg[0], .4);
    if (w) {
      M.crowd(.38 * H, H);
      M.cone(.34 * W, -.05 * H, .34 * W, H, .06 * W, .5 * W, '#ffffff', .45);
      M.person(d.person, .34 * W, H * 1.02, .88 * H, { light: 'r', rim: '#ffffff' });
      M.title(d.big, U.box([.52, .04, .45, .34]), { rot: .03 });
    } else {
      M.crowd(.48 * H, H);
      M.cone(.47 * W, 0, .47 * W, H, .1 * W, .9 * W, '#ffffff', .45);
      M.person(d.person, .47 * W, H, .5 * H, { rim: '#ffffff' });
      M.title(d.big, U.box([.06, .08, .76, .16]));
    }
    M.sparks(8, [0, .7, 1, 1], '#ffffff', 6);
    M.end({ vig: .55 });
  })
];

// Music pack: 10 layouts from docs/RESEARCH.md §4 x 8 genre palettes = 80 templates.
// d.cover = cover art, d.person = artist cut-out, d.item = prop. d.bpm / d.key / d.label feed the badges.
// Premium album-art / label-campaign look: mood haze, light leaks, smoke, bokeh, tactile materials, tracked type.
import { pop } from '../../core/pop.js';

const F = 'Anton, Impact, "Arial Narrow", sans-serif';
const rgba = (hex, a) => { const h = String(hex).replace('#', ''), f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h; const n = parseInt(f.slice(0, 6), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
const SANS = '"Helvetica Neue", Inter, "Segoe UI", Arial, sans-serif';

function music(x, W, H, d, K, P) {
  const U = pop(x, W, H, d, K, P), u = U.u, r = K.rnd, TAU = Math.PI * 2;
  const fill = (img, bx, by, bw, bh) => { const s = Math.max(bw / img.width, bh / img.height); x.drawImage(img, bx + (bw - img.width * s) / 2, by + (bh - img.height * s) / 2, img.width * s, img.height * s); };
  const cv = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
  U.lab = () => String(d.label || 'TYPE BEAT').toUpperCase();
  U.meta2 = () => [d.bpm && `${d.bpm} BPM`, d.key].filter(Boolean).join(' · ') || '140 BPM · C MINOR';
  const scr = (fn) => { x.save(); x.globalCompositeOperation = 'screen'; fn(); x.restore(); };

  // ---------- atmosphere ----------
  U.haze = (cx, cy, rad, c, a = .5) => scr(() => U.glow(cx, cy, rad, c, a));
  U.smoke = (n = 7, y0 = .35, y1 = 1, a = .07) => { x.save(); x.filter = `blur(${38 * u}px)`; x.globalCompositeOperation = 'screen';
    for (let i = 0; i < n; i++) { x.fillStyle = `rgba(255,255,255,${a * (.5 + r())})`; x.beginPath(); x.ellipse(r() * W, H * (y0 + r() * (y1 - y0)), (.18 + r() * .25) * W, (.03 + r() * .05) * H, (r() - .5) * .5, 0, TAU); x.fill(); }
    x.restore(); };
  U.bokeh = (n = 14, o = {}) => scr(() => { for (let i = 0; i < n; i++) { const x0 = o.x0 ?? 0, x1 = o.x1 ?? 1, y0 = o.y0 ?? 0, y1 = o.y1 ?? 1;
    const cx = (x0 + r() * (x1 - x0)) * W, cy = (y0 + r() * (y1 - y0)) * H, rad = (6 + r() * 26) * u * (o.s || 1), c = [P.pop, P.alt, '#ffffff'][i % 3];
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, rad); g.addColorStop(0, rgba(c, .04)); g.addColorStop(.75, rgba(c, .14 + r() * .14)); g.addColorStop(.9, rgba(c, .28)); g.addColorStop(1, rgba(c, 0)); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, rad, 0, TAU); x.fill(); } });
  U.leak = (side = 'left', c = P.alt, a = .35) => scr(() => { const g = side === 'left' ? x.createLinearGradient(0, 0, W * .35, H * .2) : x.createLinearGradient(W, 0, W * .65, H * .2);
    g.addColorStop(0, rgba(c, a)); g.addColorStop(.4, rgba('#ffb36b', a * .35)); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); });
  U.mood = (o = {}) => {
    const lx = o.lx ?? .6, ly = o.ly ?? .45, g = x.createRadialGradient(W * lx, H * ly, 0, W * lx, H * ly, Math.hypot(W, H) * .7);
    g.addColorStop(0, P.bg[0]); g.addColorStop(.55, P.bg[1]); g.addColorStop(1, '#000'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (d.cover && o.art !== false) { x.save(); x.globalAlpha = .4; x.filter = `blur(${28 * u}px) saturate(1.3)`; fill(d.cover, -50 * u, -50 * u, W + 100 * u, H + 100 * u); x.restore(); x.fillStyle = 'rgba(0,0,0,.4)'; x.fillRect(0, 0, W, H); }
    U.haze(W * lx, H * ly, Math.max(W, H) * .42, P.pop, .28);
    U.haze(W * (1 - lx), H * .05, Math.max(W, H) * .38, P.alt, .2);
    if (o.smoke !== false) U.smoke(6, .45, 1);
    if (o.bokeh) U.bokeh(o.bokeh, o.bk || {});
    U.leak(o.leak || 'left');
  };

  // ---------- type ----------
  const balance = (ws, n) => { const tot = ws.join(' ').length, L = []; let cur = []; for (const w of ws) { cur.push(w); if (cur.join(' ').length >= tot / n * .92 && L.length < n - 1) { L.push(cur.join(' ')); cur = []; } } if (cur.length) L.push(cur.join(' ')); return L; };
  // Fitted display type with soft shadow + vertical gradient. Returns real extents so sub-lines sit right under the words.
  // o: align, va (top|middle|bottom), maxLines, maxSize, fill, top, outline, ol, line(i) -> 'outline' | colour | null, glow, dry
  U.type = (text, b, o = {}) => {
    const ws = String(text).toUpperCase().split(/\s+/).filter(Boolean), max = o.maxLines ?? 2, LH = o.lh ?? .94, tr = o.track ?? .025, font = o.font || F;
    let best = { size: 0, lines: [] };
    x.save();
    for (let n = 1; n <= Math.min(max, ws.length || 1); n++) {
      const L = balance(ws, n); let sz = b.h / (L.length * LH); x.font = `${sz}px ${font}`; x.letterSpacing = `${sz * tr}px`;
      const wm = Math.max(...L.map((l) => x.measureText(l).width)); if (wm > b.w) sz *= b.w / wm; if (o.maxSize) sz = Math.min(sz, o.maxSize * u);
      if (sz > best.size * 1.04) best = { size: sz, lines: L };
    }
    const { size, lines } = best, bh = lines.length * size * LH, va = o.va || 'middle', al = o.align || 'left';
    const y0 = va === 'top' ? b.y : va === 'bottom' ? b.y + b.h - bh : b.y + (b.h - bh) / 2, ax = al === 'left' ? b.x : al === 'right' ? b.x + b.w : b.x + b.w / 2;
    x.font = `${size}px ${font}`; x.letterSpacing = `${size * tr}px`; x.textAlign = al; x.textBaseline = 'middle'; x.lineJoin = 'round';
    const gr = x.createLinearGradient(0, y0, 0, y0 + bh); gr.addColorStop(0, o.top || '#ffffff'); gr.addColorStop(1, o.fill || P.fg);
    let wmax = 0;
    lines.forEach((l, i) => {
      wmax = Math.max(wmax, x.measureText(l).width - size * tr); if (o.dry) return;
      const y = y0 + (i + .5) * size * LH + size * .03, mode = o.line ? o.line(i) : null;
      if (mode === 'outline' || o.outline) {
        x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = size * .12; x.strokeStyle = o.ol || P.fg; x.lineWidth = Math.max(1.5 * u, size * .024); x.strokeText(l, ax, y); x.restore(); return;
      }
      x.save(); x.shadowColor = 'rgba(0,0,0,.65)'; x.shadowBlur = size * .22; x.shadowOffsetY = size * .05; x.fillStyle = 'rgba(0,0,0,.55)'; x.fillText(l, ax, y); x.restore();
      if (o.glow) { x.save(); x.shadowColor = o.glow; x.shadowBlur = size * .3; x.fillStyle = o.glow; x.globalAlpha = .5; x.fillText(l, ax, y); x.restore(); }
      x.fillStyle = mode || gr; x.fillText(l, ax, y);
    });
    x.restore();
    const left = al === 'left' ? ax : al === 'right' ? ax - wmax : ax - wmax / 2;
    return { size, lines, top: y0, bottom: y0 + bh, left, right: left + wmax, cx: left + wmax / 2 };
  };
  // Tracked small-caps line. Returns width.
  U.track = (text, px, py, s, o = {}) => { const T = String(text).toUpperCase(); x.save(); x.font = `${o.weight || 700} ${s}px ${o.font || SANS}`; x.letterSpacing = `${s * (o.sp ?? .34)}px`; x.textBaseline = 'middle';
    const w = x.measureText(T).width - s * (o.sp ?? .34); x.textAlign = 'left'; const lx = o.align === 'center' ? px - w / 2 : o.align === 'right' ? px - w : px;
    if (o.glow) { x.shadowColor = o.glow; x.shadowBlur = s * .8; } x.fillStyle = o.color || P.fg; x.fillText(T, lx, py); x.restore(); return w; };
  // Label under a title block: hairline rule + tracked label in accent.
  U.sub = (t, txt = U.lab(), o = {}) => { const s = Math.max(13 * u, Math.min(34 * u, t.size * (o.k ?? .2))), y = t.bottom + s * 1.2, al = o.align || 'left';
    if (!txt) return y; const st = { color: P.pop, glow: rgba(P.pop, .55) };
    if (al === 'left') { x.fillStyle = P.pop; x.fillRect(t.left + 2 * u, y - 1 * u, s * 1.6, 2 * u); U.track(txt, t.left + s * 2.4, y, s, st); }
    else U.track(txt, al === 'center' ? t.cx : t.right, y, s, { ...st, align: al });
    return y + s; };
  // Glass pill with BPM / key.
  U.pill = (px, py, s = 17, o = {}) => {
    const txt = [d.bpm && `${d.bpm} BPM`, d.key].filter(Boolean).join('  ·  ').toUpperCase() || '140 BPM  ·  C MINOR', S = s * u;
    x.save(); x.font = `700 ${S}px ${SANS}`; x.letterSpacing = `${S * .2}px`; const tw = x.measureText(txt).width - S * .2, h = S * 2.3, w = tw + S * 3.3, left = o.align === 'center' ? px - w / 2 : o.align === 'right' ? px - w : px;
    x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 20 * u; x.shadowOffsetY = 6 * u; x.fillStyle = 'rgba(8,8,12,.62)'; x.beginPath(); x.roundRect(left, py - h / 2, w, h, h / 2); x.fill(); x.shadowColor = 'transparent';
    const bg = x.createLinearGradient(0, py - h / 2, 0, py + h / 2); bg.addColorStop(0, 'rgba(255,255,255,.38)'); bg.addColorStop(1, 'rgba(255,255,255,.06)'); x.strokeStyle = bg; x.lineWidth = 1.2 * u; x.stroke();
    x.shadowColor = P.pop; x.shadowBlur = S; x.fillStyle = P.pop; x.beginPath(); x.arc(left + S * 1.2, py, S * .3, 0, TAU); x.fill(); x.shadowColor = 'transparent';
    x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(txt, left + S * 2.05, py + S * .04); x.restore();
    return { left, w, h };
  };

  // ---------- figures + objects ----------
  // Hooded artist placeholder, lit with palette rims (stylised, no real likeness).
  let hoodC;
  const hood = () => { if (hoodC) return hoodC; const c = cv(600, 800), g = c.getContext('2d');
    const sil = () => { g.beginPath(); g.moveTo(300, 30); g.bezierCurveTo(445, 28, 505, 175, 490, 330); g.bezierCurveTo(484, 400, 472, 440, 456, 470); g.bezierCurveTo(545, 500, 592, 565, 600, 800); g.lineTo(0, 800); g.bezierCurveTo(8, 565, 55, 500, 144, 470); g.bezierCurveTo(128, 440, 116, 400, 110, 330); g.bezierCurveTo(95, 175, 155, 28, 300, 30); g.closePath(); };
    const body = g.createLinearGradient(0, 0, 0, 800); body.addColorStop(0, '#2e2e38'); body.addColorStop(1, '#0b0b10'); g.fillStyle = body; sil(); g.fill();
    g.save(); sil(); g.clip();
    const key = g.createRadialGradient(240, 160, 0, 240, 160, 340); key.addColorStop(0, 'rgba(255,255,255,.14)'); key.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = key; g.fillRect(0, 0, 600, 800);
    g.globalCompositeOperation = 'screen';
    const rr = g.createLinearGradient(600, 0, 410, 0); rr.addColorStop(0, rgba(P.pop, .95)); rr.addColorStop(.25, rgba(P.pop, .35)); rr.addColorStop(1, rgba(P.pop, 0)); g.fillStyle = rr; g.fillRect(0, 0, 600, 800);
    const rl = g.createLinearGradient(0, 0, 170, 0); rl.addColorStop(0, rgba(P.alt, .7)); rl.addColorStop(1, rgba(P.alt, 0)); g.fillStyle = rl; g.fillRect(0, 0, 600, 800);
    g.globalCompositeOperation = 'source-over'; g.lineCap = 'round'; g.filter = 'blur(6px)';
    [[150, 560, 230, 700, 210, 800], [450, 560, 380, 690, 400, 800], [300, 520, 290, 640, 310, 790]].forEach(([a, b, c2, d2, e, f]) => { g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 16; g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo(c2, d2, e, f); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 8; g.beginPath(); g.moveTo(a + 14, b); g.quadraticCurveTo(c2 + 14, d2, e + 14, f); g.stroke(); });
    g.filter = 'none'; g.restore();
    const op = g.createRadialGradient(300, 330, 10, 300, 300, 150); op.addColorStop(0, '#000'); op.addColorStop(1, '#0d0d12'); g.fillStyle = op; g.beginPath(); g.ellipse(300, 300, 112, 142, 0, 0, TAU); g.fill();
    const rim = g.createLinearGradient(190, 0, 412, 0); rim.addColorStop(0, rgba(P.alt, .45)); rim.addColorStop(.45, 'rgba(255,255,255,.05)'); rim.addColorStop(1, rgba(P.pop, .85)); g.strokeStyle = rim; g.lineWidth = 9; g.beginPath(); g.ellipse(300, 298, 118, 148, 0, 0, TAU); g.stroke();
    g.save(); g.beginPath(); g.ellipse(300, 300, 112, 142, 0, 0, TAU); g.clip();
    const jaw = g.createRadialGradient(330, 420, 0, 320, 410, 90); jaw.addColorStop(0, 'rgba(120,80,64,.55)'); jaw.addColorStop(1, 'rgba(60,38,30,0)'); g.fillStyle = jaw; g.beginPath(); g.ellipse(310, 410, 80, 52, 0, 0, TAU); g.fill();
    g.strokeStyle = rgba(P.pop, .7); g.lineWidth = 4; g.beginPath(); g.ellipse(300, 395, 72, 62, 0, -.1, 1.1); g.stroke();
    g.fillStyle = rgba(P.pop, .5); g.beginPath(); g.ellipse(350, 330, 6, 2.2, 0, 0, TAU); g.fill(); g.globalAlpha = .4; g.beginPath(); g.ellipse(262, 330, 5, 1.8, 0, 0, TAU); g.fill(); g.restore();
    g.lineCap = 'round'; [[262, 455, 248, 610], [338, 455, 356, 620]].forEach(([a, b, c2, d2], i) => { g.strokeStyle = i ? rgba(P.pop, .8) : 'rgba(200,200,210,.55)'; g.lineWidth = 6; g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo(a + (i ? 14 : -10), (b + d2) / 2, c2, d2); g.stroke(); g.fillStyle = '#bbb'; g.fillRect(c2 - 4, d2, 8, 22); });
    return (hoodC = c); };
  U.artist = (cx, bottom, h, o = {}) => {
    U.haze(cx + h * .12, bottom - h * .6, h * .7, o.rim || P.pop, o.halo ?? .4);
    if (d.person) return U.prop(d.person, cx, bottom, h, { shadow: false, rim: o.rim || P.pop, rimA: .55, rimLeft: o.rimLeft, tint: P.bg[1], tintA: .16, flip: o.flip, filter: o.filter || 'contrast(1.12) saturate(.95)' });
    const c = hood(), w = h * c.width / c.height; x.save(); if (o.filter) x.filter = o.filter; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 40 * u;
    if (o.flip) { x.translate(cx, 0); x.scale(-1, 1); x.drawImage(c, -w / 2, bottom - h, w, h); } else x.drawImage(c, cx - w / 2, bottom - h, w, h); x.restore();
  };

  // Abstract album-art placeholder: sun disc, horizon cuts, tracked label - reads as designed art, not a grey box.
  const artPH = (bx, by, bw, bh) => { x.save(); x.beginPath(); x.rect(bx, by, bw, bh); x.clip();
    const g = x.createLinearGradient(0, by, 0, by + bh); g.addColorStop(0, P.bg[0]); g.addColorStop(1, P.bg[1]); x.fillStyle = g; x.fillRect(bx, by, bw, bh);
    const R = Math.min(bw, bh) * .3, cx = bx + bw / 2, cy = by + bh * .52; x.shadowColor = P.pop; x.shadowBlur = R * .6;
    const sg = x.createLinearGradient(0, cy - R, 0, cy + R); sg.addColorStop(0, P.alt); sg.addColorStop(1, P.pop); x.fillStyle = sg; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.fill(); x.shadowColor = 'transparent';
    x.fillStyle = P.bg[1]; for (let i = 0; i < 7; i++) x.fillRect(bx, cy + R * (.1 + i * .14), bw, R * (.02 + i * .012));
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(bx, cy + R * 1.02, bw, bh);
    U.track(U.lab(), bx + bw * .07, by + bh * .09, Math.min(bw, bh) * .045, { color: 'rgba(255,255,255,.75)', sp: .4 });
    x.restore(); };
  // Cover art square with deep shadow, hairline edge and gloss.
  U.art = (b, rot = 0, o = {}) => { x.save(); x.translate(b.x + b.w / 2, b.y + b.h / 2); x.rotate(rot);
    x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 50 * u; x.shadowOffsetY = 22 * u; x.fillStyle = '#000'; x.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); x.shadowColor = 'transparent';
    if (d.cover) { x.save(); x.beginPath(); x.rect(-b.w / 2, -b.h / 2, b.w, b.h); x.clip(); fill(d.cover, -b.w / 2, -b.h / 2, b.w, b.h); x.restore(); } else artPH(-b.w / 2, -b.h / 2, b.w, b.h);
    if (o.wear) { x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 3 * u; x.beginPath(); x.arc(0, 0, Math.min(b.w, b.h) * .44, 0, TAU); x.stroke(); }
    const gl = x.createLinearGradient(-b.w / 2, -b.h / 2, b.w / 2, b.h / 2); gl.addColorStop(0, 'rgba(255,255,255,.16)'); gl.addColorStop(.4, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(0,0,0,.2)'); x.fillStyle = gl; x.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
    x.strokeStyle = 'rgba(255,255,255,.2)'; x.lineWidth = 1.2 * u; x.strokeRect(-b.w / 2 + .5, -b.h / 2 + .5, b.w - 1, b.h - 1);
    x.restore(); };

  // Vinyl with groove bands, conic sheen, accent spec and printed label (title on label when no cover).
  U.vinyl = (cx, cy, R, rot = 0) => { x.save(); x.translate(cx, cy);
    x.shadowColor = 'rgba(0,0,0,.75)'; x.shadowBlur = 50 * u; x.shadowOffsetY = 16 * u; x.fillStyle = '#070709'; x.beginPath(); x.arc(0, 0, R, 0, TAU); x.fill(); x.shadowColor = 'transparent';
    x.lineWidth = Math.max(.8, u); for (let i = R * .37; i < R * .975; i += 2.6 * u) { const band = Math.sin(i / R * 38) > .88; x.strokeStyle = band ? 'rgba(0,0,0,.9)' : `rgba(255,255,255,${.025 + r() * .03})`; x.beginPath(); x.arc(0, 0, i, 0, TAU); x.stroke(); }
    x.save(); x.rotate(rot); const ring = () => { x.beginPath(); x.arc(0, 0, R * .975, 0, TAU); x.arc(0, 0, R * .36, 0, TAU, true); };
    const cg = x.createConicGradient(0, 0, 0); [[0, 0], [.06, .2], [.12, 0], [.5, 0], [.56, .16], [.62, 0], [1, 0]].forEach(([s, a]) => cg.addColorStop(s, `rgba(255,255,255,${a})`)); x.fillStyle = cg; ring(); x.fill();
    const tg = x.createConicGradient(1.2, 0, 0); [[0, rgba(P.pop, 0)], [.08, rgba(P.pop, .22)], [.16, rgba(P.pop, 0)], [1, rgba(P.pop, 0)]].forEach(([s, c]) => tg.addColorStop(s, c)); x.fillStyle = tg; ring(); x.fill(); x.restore();
    x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 1.5 * u; x.beginPath(); x.arc(0, 0, R - 1 * u, -2.4, -1.2); x.stroke();
    const L = R * .34; x.save(); x.beginPath(); x.arc(0, 0, L, 0, TAU); x.clip();
    if (d.cover) fill(d.cover, -L, -L, L * 2, L * 2);
    else { const lg = x.createRadialGradient(0, 0, 0, 0, 0, L); lg.addColorStop(0, P.alt); lg.addColorStop(1, P.pop); x.fillStyle = lg; x.fillRect(-L, -L, L * 2, L * 2);
      x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = u; x.beginPath(); x.arc(0, 0, L * .84, 0, TAU); x.stroke();
      U.track(U.lab(), 0, -L * .5, L * .1, { align: 'center', color: 'rgba(0,0,0,.75)', sp: .3 }); U.type(d.title, { x: -L * .62, y: -L * .3, w: L * 1.24, h: L * .55 }, { align: 'center', maxLines: 2, fill: '#141414', top: '#141414', track: .01 }); U.track(U.meta2(), 0, L * .55, L * .075, { align: 'center', color: 'rgba(0,0,0,.7)', sp: .2 }); }
    x.restore();
    x.fillStyle = '#d8d8d8'; x.beginPath(); x.arc(0, 0, R * .025, 0, TAU); x.fill(); x.fillStyle = '#000'; x.beginPath(); x.arc(0, 0, R * .014, 0, TAU); x.fill();
    x.restore(); };

  // 3D sample-pack box: printed front (cover or designed face), shaded spine with tracked type, lit top, gloss, floor reflection.
  U.packBox = (b) => {
    const dx = b.w * .2, dy = b.w * .12, fw = b.w - dx, fh = b.h - dy, fx = b.x, fy = b.y + dy;
    const front = cv(fw, fh), g = front.getContext('2d'), art = fh * .72;
    if (d.cover) { const s = Math.max(fw / d.cover.width, art / d.cover.height); g.drawImage(d.cover, (fw - d.cover.width * s) / 2, (art - d.cover.height * s) / 2, d.cover.width * s, d.cover.height * s); }
    else { const gg = g.createLinearGradient(0, 0, 0, art); gg.addColorStop(0, P.bg[0]); gg.addColorStop(1, P.bg[1]); g.fillStyle = gg; g.fillRect(0, 0, fw, art);
      g.save(); g.shadowColor = P.pop; g.shadowBlur = fw * .12; g.strokeStyle = P.pop; g.lineWidth = fw * .016; for (let i = 0; i < 5; i++) { g.globalAlpha = 1 - i * .18; g.beginPath(); g.arc(fw * .5, art * .5, fw * (.08 + i * .07), 0, TAU); g.stroke(); } g.restore(); }
    g.fillStyle = '#0c0c10'; g.fillRect(0, art, fw, fh - art); g.fillStyle = P.pop; g.fillRect(0, art, fw, Math.max(2, fh * .012));
    // floor shadow + reflection
    x.save(); x.filter = `blur(${22 * u}px)`; x.fillStyle = 'rgba(0,0,0,.75)'; x.beginPath(); x.ellipse(fx + b.w * .5, b.y + b.h, b.w * .6, b.w * .06, 0, 0, TAU); x.fill(); x.restore();
    x.save(); x.globalAlpha = .16; x.translate(0, (fy + fh) * 2); x.scale(1, -1); x.drawImage(front, fx, fy, fw, fh); x.restore();
    const rf = x.createLinearGradient(0, fy + fh, 0, fy + fh * 1.35); rf.addColorStop(0, rgba(P.bg[1], 0)); rf.addColorStop(1, P.bg[1]); x.fillStyle = rf; x.fillRect(fx - 5, fy + fh, fw + dx + 10, fh * .36);
    // spine
    x.save(); x.beginPath(); x.moveTo(fx + fw, fy); x.lineTo(fx + fw + dx, fy - dy); x.lineTo(fx + fw + dx, fy + fh - dy); x.lineTo(fx + fw, fy + fh); x.closePath();
    const sp = x.createLinearGradient(fx + fw, 0, fx + fw + dx, 0); sp.addColorStop(0, '#18181e'); sp.addColorStop(1, '#050507'); x.fillStyle = sp; x.fill(); x.clip();
    x.translate(fx + fw, fy); x.transform(1, -dy / dx, 0, 1, 0, 0);
    x.fillStyle = rgba(P.pop, .9); x.fillRect(0, art, dx, Math.max(2, fh * .012));
    x.translate(dx * .5, art * .5); x.rotate(Math.PI / 2); U.track(U.lab() + '  ·  VOL. 1', 0, 0, dx * .16, { align: 'center', color: 'rgba(255,255,255,.7)', sp: .4 }); x.restore();
    // top
    x.beginPath(); x.moveTo(fx, fy); x.lineTo(fx + dx, fy - dy); x.lineTo(fx + fw + dx, fy - dy); x.lineTo(fx + fw, fy); x.closePath();
    const tp = x.createLinearGradient(0, fy - dy, 0, fy); tp.addColorStop(0, '#41414c'); tp.addColorStop(1, '#1d1d24'); x.fillStyle = tp; x.fill(); x.strokeStyle = 'rgba(255,255,255,.28)'; x.lineWidth = u; x.stroke();
    // printed front + finish
    x.drawImage(front, fx, fy);
    U.type(d.title, { x: fx + fw * .07, y: fy + art + fh * .035, w: fw * .86, h: fh * .14 }, { align: 'left', maxLines: 2 });
    U.track('SAMPLE PACK  ·  ' + U.meta2(), fx + fw * .07, fy + fh * .94, Math.max(8 * u, fw * .028), { color: P.pop, sp: .25 });
    const gl = x.createLinearGradient(fx, fy, fx + fw, fy + fh); gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(.28, 'rgba(255,255,255,.16)'); gl.addColorStop(.36, 'rgba(255,255,255,0)'); x.fillStyle = gl; x.fillRect(fx, fy, fw, fh);
    x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = 1.2 * u; x.beginPath(); x.moveTo(fx + fw, fy); x.lineTo(fx + fw, fy + fh); x.stroke();
  };

  // Line icons on glass tiles, lit with palette rim.
  U.tile = (k, cx, cy, s) => { x.save(); x.translate(cx, cy);
    x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 30 * u; x.shadowOffsetY = 10 * u; x.fillStyle = 'rgba(10,10,14,.6)'; x.beginPath(); x.roundRect(-s, -s, s * 2, s * 2, s * .32); x.fill(); x.shadowColor = 'transparent';
    const tg = x.createLinearGradient(0, -s, 0, s); tg.addColorStop(0, 'rgba(255,255,255,.14)'); tg.addColorStop(1, 'rgba(255,255,255,.02)'); x.fillStyle = tg; x.fill();
    const bd = x.createLinearGradient(-s, -s, s, s); bd.addColorStop(0, 'rgba(255,255,255,.45)'); bd.addColorStop(.5, 'rgba(255,255,255,.06)'); bd.addColorStop(1, rgba(P.pop, .55)); x.strokeStyle = bd; x.lineWidth = 1.4 * u; x.stroke();
    const ig = x.createLinearGradient(0, -s * .6, 0, s * .6); ig.addColorStop(0, '#ffffff'); ig.addColorStop(1, P.pop); x.strokeStyle = ig; x.fillStyle = ig; x.lineWidth = s * .075; x.lineCap = 'round'; x.lineJoin = 'round'; x.shadowColor = P.pop; x.shadowBlur = s * .35;
    const q = s * .58;
    if (k === 0) { x.beginPath(); x.arc(0, q * .15, q * .85, Math.PI * 1.02, -Math.PI * .02); x.stroke(); x.beginPath(); x.roundRect(-q * .98, q * .05, q * .4, q * .75, q * .14); x.roundRect(q * .58, q * .05, q * .4, q * .75, q * .14); x.fill(); }
    if (k === 1) { x.beginPath(); x.roundRect(-q * .32, -q, q * .64, q * 1.05, q * .32); x.stroke(); x.lineWidth = s * .035; for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(-q * .3, -q + i * q * .26); x.lineTo(q * .3, -q + i * q * .26); x.stroke(); } x.lineWidth = s * .075; x.beginPath(); x.arc(0, -q * .2, q * .55, .1, Math.PI - .1); x.stroke(); x.beginPath(); x.moveTo(0, q * .36); x.lineTo(0, q * .8); x.moveTo(-q * .35, q * .82); x.lineTo(q * .35, q * .82); x.stroke(); }
    if (k === 2) { x.lineWidth = s * .05; x.strokeRect(-q, -q * .5, q * 2, q); for (let i = 1; i < 7; i++) { x.beginPath(); x.moveTo(-q + i * q * 2 / 7, -q * .5); x.lineTo(-q + i * q * 2 / 7, q * .5); x.stroke(); } [1, 2, 4, 5, 6].forEach((i) => x.fillRect(-q + i * q * 2 / 7 - q * .09, -q * .5, q * .18, q * .58)); }
    if (k === 3) { x.lineWidth = s * .06; x.beginPath(); x.roundRect(-q * .7, -q, q * 1.4, q * 2, q * .15); x.stroke(); x.beginPath(); x.arc(0, q * .3, q * .45, 0, TAU); x.stroke(); x.beginPath(); x.arc(0, q * .3, q * .14, 0, TAU); x.fill(); x.beginPath(); x.arc(0, -q * .52, q * .2, 0, TAU); x.stroke(); }
    if (k === 4) { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const lit = (i * 3 + j * 5 + 1) % 4 === 0; x.globalAlpha = lit ? 1 : .35; x.fillStyle = lit ? P.pop : '#fff'; x.beginPath(); x.roundRect(-q + i * q * .52, -q + j * q * .52, q * .42, q * .42, q * .06); x.fill(); } }
    if (k === 5) { x.beginPath(); x.ellipse(-q * .45, q * .55, q * .3, q * .22, -.4, 0, TAU); x.ellipse(q * .55, q * .4, q * .3, q * .22, -.4, 0, TAU); x.fill(); x.beginPath(); x.moveTo(-q * .18, q * .5); x.lineTo(-q * .18, -q * .7); x.lineTo(q * .82, -q * .9); x.lineTo(q * .82, q * .35); x.stroke(); x.lineWidth = s * .14; x.beginPath(); x.moveTo(-q * .18, -q * .6); x.lineTo(q * .82, -q * .8); x.stroke(); }
    x.restore(); };

  // Mirrored waveform with played/unplayed split, playhead, reflection and time codes.
  U.wave = (by, bh, o = {}) => { const n = o.n || 120, x0 = (o.x0 ?? .04) * W, x1 = (o.x1 ?? .96) * W, bw = (x1 - x0) / n, cy = by + bh / 2, ph = o.ph ?? .62;
    x.save(); for (let i = 0; i < n; i++) { const t = i / n, a = Math.min(1, (.18 + .82 * Math.abs(Math.sin(t * Math.PI * 2.6 + 1)) * (.45 + r() * .55)) * (t < .04 || t > .96 ? .3 : 1)), h = bh * .5 * a, bx = x0 + i * bw + bw * .18;
      if (t < ph) { const g = x.createLinearGradient(0, cy - h, 0, cy); g.addColorStop(0, P.alt); g.addColorStop(1, P.pop); x.fillStyle = g; x.shadowColor = P.pop; x.shadowBlur = 14 * u; } else { x.fillStyle = 'rgba(255,255,255,.28)'; x.shadowColor = 'transparent'; }
      x.beginPath(); x.roundRect(bx, cy - h, bw * .64, h, bw * .3); x.fill();
      x.shadowColor = 'transparent'; x.globalAlpha = .3; x.beginPath(); x.roundRect(bx, cy + 2 * u, bw * .64, h * .7, bw * .3); x.fill(); x.globalAlpha = 1; }
    const px = x0 + (x1 - x0) * ph; x.shadowColor = '#fff'; x.shadowBlur = 16 * u; x.fillStyle = '#fff'; x.fillRect(px - u, cy - bh * .62, 2 * u, bh); x.beginPath(); x.arc(px, cy - bh * .62, 5 * u, 0, TAU); x.fill(); x.restore();
    x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(x0, cy + .5 * u, x1 - x0, u);
    const ts = 12 * u * (o.ts || 1); U.track('01:26', x0, cy + bh * .62, ts, { color: 'rgba(255,255,255,.7)', sp: .2 }); U.track('02:47', x1, cy + bh * .62, ts, { color: 'rgba(255,255,255,.45)', sp: .2, align: 'right' });
  };

  U.chroma = (px = 4) => { const c = cv(W, H); c.getContext('2d').drawImage(x.canvas, 0, 0);
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = .2; x.filter = 'sepia(1) saturate(6) hue-rotate(-50deg)'; x.drawImage(c, px * u, 0); x.filter = 'sepia(1) saturate(6) hue-rotate(150deg)'; x.drawImage(c, -px * u, 0); x.restore(); };
  U.scan = (a = .1) => { x.fillStyle = `rgba(0,0,0,${a})`; for (let y = 0; y < H; y += 3 * u) x.fillRect(0, y, W, 1.1 * u); };
  U.end = (o = {}) => U.finish({ vig: o.vig ?? .55, grain: o.grain ?? .06, lx: o.lx ?? .9, ly: .05 });
  U.close = (o = {}) => { U.grade({ bloom: o.bloom ?? .24, tone: .24, warm: o.warm || P.alt }); U.end(o); };
  return U;
}

const M = (name, draw) => ({ name, niche: 'music', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) { draw(x, W, H, d, music(x, W, H, d, K, P), K.wide, P); } });

export default [
  // 1. Artist cut-out: lit hooded figure right, editorial title left + tracked label + glass BPM pill.
  M('ARTIST TYPE BEAT', (x, W, H, d, U, w) => {
    U.mood({ lx: w ? .72 : .5, ly: .35, bokeh: 10, bk: w ? { x0: .5, y0: .05, y1: .6 } : { y0: .05, y1: .4 } });
    if (w) { U.artist(.72 * W, H * 1.03, .99 * H); U.fade('left', .55, 'rgba(0,0,0,.55)'); const t = U.type(d.title, U.box([.05, .22, .44, .38]), { maxLines: 3, va: 'bottom' }); const y = U.sub(t); U.pill(.05 * W, y + 40 * U.u); }
    else { U.artist(.5 * W, .64 * H, .52 * H); U.fade('bottom', .5, 'rgba(0,0,0,.9)'); const t = U.type(d.title, U.box([.06, .58, .76, .11]), { align: 'center', va: 'top' }); const y = U.sub(t, undefined, { align: 'center' }); U.pill(.44 * W, Math.min(.76 * H, y + 54 * U.u), 22, { align: 'center' }); }
    U.close();
  }),
  // 2. Centred cover with halo, smoke and mirror floor; stacked title under.
  M('GLOW POSTER', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .5, ly: .32, bokeh: 16 });
    const b = U.box(w ? [.5 - .21 * H / W, .07, .42 * H / W, .42] : [.2, .1, .6, .6 * W / H]);
    U.haze(b.x + b.w / 2, b.y + b.h / 2, b.w * 1.3, P.pop, .55); U.haze(b.x + b.w / 2, b.y + b.h / 2, b.w * .7, '#ffffff', .12);
    U.art(b);
    x.save(); x.globalAlpha = .16; x.translate(0, (b.y + b.h) * 2 + 4 * U.u); x.scale(1, -1); U.art(b); x.restore();
    const fg = x.createLinearGradient(0, b.y + b.h, 0, b.y + b.h * 1.4); fg.addColorStop(0, rgba(P.bg[1], 0)); fg.addColorStop(1, rgba(P.bg[1], .9)); x.fillStyle = fg; x.fillRect(b.x - b.w, b.y + b.h, b.w * 3, b.h * .4);
    U.smoke(5, w ? .5 : .35, w ? .7 : .5, .09);
    const t = U.type(d.title, U.box(w ? [.14, .58, .66, .16] : [.06, .5, .76, .12]), { align: 'center', va: 'top' });
    const y = U.sub(t, undefined, { align: 'center', k: .22 });
    U.pill(w ? .47 * W : .44 * W, Math.min(w ? .76 * H : .76 * H, y + (w ? 34 : 56) * U.u), w ? 14 : 22, { align: 'center' });
    U.close();
  }),
  // 3. Waveform band with playhead, title above, pill below-left.
  M('WAVEFORM', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .5, ly: .5, bokeh: 8 });
    U.haze(W * .5, H * .5, W * .55, P.pop, .25);
    U.wave((w ? .42 : .4) * H, (w ? .2 : .12) * H, w ? {} : { x0: .06, x1: .94, n: 70, ts: 1.6 });
    const t = U.type(d.title, U.box(w ? [.05, .07, .78, .25] : [.06, .12, .76, .16]), { align: w ? 'left' : 'center', va: 'bottom' });
    U.sub(t, undefined, { align: w ? 'left' : 'center' });
    U.pill(w ? .05 * W : .44 * W, w ? .76 * H : .62 * H, w ? 16 : 22, { align: w ? 'left' : 'center' });
    U.close();
  }),
  // 4. Vinyl sliding out of its sleeve; title top-left.
  M('VINYL', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .62, ly: .5 });
    if (w) { const s = .66 * H; U.haze(.75 * W, .55 * H, .6 * H, P.pop, .35); U.vinyl(.66 * W, .54 * H, s * .48, (d.seed || 1) % 6); U.art({ x: .3 * W, y: .54 * H - s / 2, w: s, h: s }, 0, { wear: true });
      const t = U.type(d.title, U.box([.04, .07, .26, .34]), { maxLines: 3, va: 'top' }); const y = U.sub(t, undefined, { k: .16 }); U.pill(.04 * W, y + 30 * U.u, 12); }
    else { const s = .6 * W; U.haze(.6 * W, .48 * H, .5 * W, P.pop, .35); U.vinyl(.64 * W, .5 * H, s * .48, (d.seed || 1) % 6); U.art({ x: .06 * W, y: .5 * H - s / 2, w: s, h: s }, -.02, { wear: true });
      const t = U.type(d.title, U.box([.06, .09, .76, .13]), { align: 'center', va: 'top' }); U.sub(t, undefined, { align: 'center' }); U.pill(.44 * W, .7 * H, 22, { align: 'center' }); }
    U.close();
  }),
  // 5. Printed sample-pack box left, refined contents list right.
  M('SAMPLE PACK BOX', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .3, ly: .4 });
    const n = (d.big.match(/\d+/) || ['100'])[0], lines = [[n, 'LOOPS'], ['250', 'ONE SHOTS'], ['STEMS', '+ MIDI']];
    const list = (lx, ly, gap, s, lw) => lines.forEach(([a, b], i) => { const y = ly + i * gap; x.fillStyle = 'rgba(255,255,255,.14)'; x.fillRect(lx, y + s * .68, lw, U.u);
      const t = U.type(a, { x: lx, y: y - s * .5, w: lw * .55, h: s }, { maxLines: 1, fill: i ? P.fg : P.pop, top: i ? '#ffffff' : P.pop }); U.track(b, t.right + s * .3, y + s * .08, s * .3, { color: 'rgba(255,255,255,.85)' }); });
    if (w) { U.haze(.25 * W, .5 * H, .5 * H, P.pop, .4); U.packBox(U.box([.05, .1, .37, .72])); const t = U.type(d.title, U.box([.48, .08, .46, .2]), { va: 'top' }); U.sub(t, 'SAMPLE PACK'); list(.48 * W, .46 * H, .12 * H, .085 * H, .42 * W); }
    else { U.haze(.5 * W, .3 * H, .5 * W, P.pop, .4); U.packBox(U.box([.18, .1, .56, .32])); const t = U.type(d.title, U.box([.06, .49, .76, .08]), { va: 'top', align: 'center' }); U.sub(t, 'SAMPLE PACK', { align: 'center' }); list(.12 * W, .63 * H, .05 * H, .036 * H, .66 * W); }
    U.close();
  }),
  // 6. Glass instrument tiles orbiting a centred title.
  M('ICON COLLAGE', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .5, ly: .5, bokeh: 12 });
    U.haze(W * .5, H * .48, (w ? .6 : .5) * W, P.pop, .3);
    const pts = w ? [[.12, .22], [.88, .2], [.1, .7], [.88, .6], [.36, .12], [.6, .86]] : [[.2, .13], [.72, .12], [.16, .66], [.74, .68], [.46, .05], [.44, .76]];
    const s = w ? .075 * H : .07 * W;
    pts.forEach(([px, py], i) => U.tile(i, px * W, py * H, s * (i % 2 ? 1 : 1.12)));
    const t = U.type(d.title, U.box(w ? [.22, .32, .56, .26] : [.08, .3, .72, .16]), { align: 'center' });
    const y = U.sub(t, undefined, { align: 'center' });
    U.pill(w ? .5 * W : .44 * W, Math.min(y + 40 * U.u, w ? .7 * H : .58 * H), w ? 15 : 22, { align: 'center' });
    U.close();
  }),
  // 7. Music-video still: letterboxed frame, artist left, thin outlined title lower-left, viewfinder marks.
  M('VIDEO FRAME', (x, W, H, d, U, w, P) => {
    U.mood({ lx: w ? .3 : .5, ly: .4, art: false, bokeh: 18, bk: { x0: .4 } });
    if (d.cover) { x.save(); x.filter = 'contrast(1.1) saturate(.9) brightness(.7)'; const s = Math.max(W / d.cover.width, H / d.cover.height); x.drawImage(d.cover, (W - d.cover.width * s) / 2, (H - d.cover.height * s) / 2, d.cover.width * s, d.cover.height * s); x.restore(); }
    U.haze(w ? .65 * W : .5 * W, .4 * H, .5 * W, P.alt, .3);
    U.artist(w ? .3 * W : .5 * W, w ? H * 1.02 : .7 * H, w ? .86 * H : .5 * H, { rim: P.alt });
    U.fade('bottom', .45, 'rgba(0,0,0,.8)');
    const bar = w ? .09 : .06; x.fillStyle = '#000'; x.fillRect(0, 0, W, H * bar); x.fillRect(0, H * (1 - bar), W, H * bar);
    const m = 26 * U.u, ix = w ? .05 * W : .07 * W, iy = H * bar + m, ex = w ? .95 * W : .93 * W, ey = .78 * H; x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1.5 * U.u;
    [[ix, iy, 1, 1], [ex, iy, -1, 1], [ix, ey, 1, -1]].forEach(([a, b, sx, sy]) => { x.beginPath(); x.moveTo(a + sx * m, b); x.lineTo(a, b); x.lineTo(a, b + sy * m); x.stroke(); });
    const t = U.type(d.title, U.box(w ? [.5, .5, .42, .2] : [.08, .6, .74, .14]), { align: w ? 'right' : 'center', va: 'bottom', outline: true, ol: '#fff' });
    U.sub(t, d.label || 'OFFICIAL MUSIC VIDEO', { align: w ? 'right' : 'center', k: .18 });
    U.track('● ' + U.meta2(), ix + 10 * U.u, iy + (w ? 20 : 30) * U.u, (w ? 12 : 20) * U.u, { color: 'rgba(255,255,255,.75)', sp: .25 });
    U.close({ vig: .6, warm: '#ffb36b' });
  }),
  // 8. Neon sign: brick wall, glass tubes with white-hot core, wall spill, wet-floor reflection.
  M('NEON SIGN', (x, W, H, d, U, w, P) => {
    const u = U.u; x.fillStyle = '#060608'; x.fillRect(0, 0, W, H);
    const floorY = (w ? .72 : .56) * H, bw = 64 * u, bh = 24 * u;
    for (let yy = 0, row = 0; yy < floorY; yy += bh, row++) for (let xx = row % 2 ? -bw / 2 : 0; xx < W; xx += bw) { const v = 17 + Math.abs(Math.round(xx * 7 + yy * 13)) % 9; x.fillStyle = `rgb(${v + 6},${v},${v})`; x.fillRect(xx + 1.5 * u, yy + 1.5 * u, bw - 3 * u, bh - 3 * u); }
    const fl = x.createLinearGradient(0, floorY, 0, H); fl.addColorStop(0, '#111116'); fl.addColorStop(1, '#030304'); x.fillStyle = fl; x.fillRect(0, floorY, W, H - floorY);
    const b = U.box(w ? [.08, .24, .64, .32] : [.06, .24, .76, .24]), cx = b.x + b.w / 2;
    const t = U.type(d.title, b, { align: 'center', dry: true }), cy = (t.top + t.bottom) / 2;
    U.haze(cx, cy, b.w * .7, P.pop, .55); U.haze(cx, cy, b.w * .35, P.pop, .35);
    x.fillStyle = 'rgba(170,170,180,.55)'; [t.left + 14 * u, t.right - 14 * u].forEach((a) => { x.fillRect(a - u, t.top - 40 * u, 2 * u, 34 * u); x.beginPath(); x.arc(a, t.top - 6 * u, 3 * u, 0, 7); x.fill(); });
    x.save(); x.font = `${t.size}px ${F}`; x.letterSpacing = `${t.size * .025}px`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round'; x.lineCap = 'round';
    t.lines.forEach((l, i) => { const y = t.top + (i + .5) * t.size * .94 + t.size * .03, lx = cx + t.size * .0125;
      x.shadowColor = P.pop; x.shadowBlur = t.size * .45; x.strokeStyle = rgba(P.pop, .6); x.lineWidth = t.size * .075; x.strokeText(l, lx, y);
      x.shadowBlur = t.size * .12; x.strokeStyle = P.pop; x.lineWidth = t.size * .045; x.strokeText(l, lx, y);
      x.shadowBlur = t.size * .05; x.shadowColor = '#fff'; x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = t.size * .016; x.strokeText(l, lx, y); });
    x.restore();
    const s = Math.max(14 * u, Math.min(30 * u, t.size * .2)); U.track(U.lab(), cx, t.bottom + s * 1.6, s, { align: 'center', color: '#fff', glow: P.alt, sp: .5 });
    x.save(); x.beginPath(); x.rect(0, floorY, W, H - floorY); x.clip(); x.translate(0, floorY * 2); x.scale(1, -1); x.filter = `blur(${4 * u}px)`; x.globalAlpha = .55; x.drawImage(x.canvas, 0, 0, W, floorY, 0, 0, W, floorY); x.restore();
    const wet = x.createLinearGradient(0, floorY, 0, H); wet.addColorStop(0, 'rgba(0,0,0,.25)'); wet.addColorStop(1, 'rgba(0,0,0,.92)'); x.fillStyle = wet; x.fillRect(0, floorY, W, H - floorY);
    U.haze(cx, floorY, b.w * .5, P.pop, .18);
    U.pill(w ? .06 * W : .44 * W, w ? .1 * H : .72 * H, w ? 15 : 22, { align: w ? 'left' : 'center' });
    U.close({ vig: .65, bloom: .3 });
  }),
  // 9. Lyric stack: huge alternating solid/outline lines left, artist right.
  M('LYRIC STACK', (x, W, H, d, U, w, P) => {
    U.mood({ lx: .78, ly: .4 });
    if (w) U.artist(.79 * W, H * 1.03, .96 * H); else U.artist(.6 * W, .92 * H, .4 * H);
    U.fade(w ? 'left' : 'top', .5, 'rgba(0,0,0,.6)');
    const ws = d.title.toUpperCase().split(/\s+/).filter(Boolean), n = Math.min(4, Math.max(2, ws.length)), per = Math.ceil(ws.length / n), L = [];
    for (let i = 0; i < ws.length; i += per) L.push(ws.slice(i, i + per).join(' '));
    const area = w ? [.04, .07, .56, .7] : [.06, .08, .76, .42], lh = area[3] / L.length; let last;
    L.forEach((l, i) => { last = U.type(l, U.box([area[0], area[1] + i * lh, area[2], lh * .96]), { maxLines: 1, line: () => (i % 2 ? 'outline' : i === L.length - 1 && L.length > 2 ? P.pop : null), ol: P.pop, maxSize: w ? 200 : 260 }); });
    U.sub({ ...last, size: Math.min(last.size, 90 * U.u), left: area[0] * W }, undefined);
    U.close();
  }),
  // 10. Low-key portrait right, vertical fragmented title left, BPM badge top-right.
  M('MOODY PORTRAIT', (x, W, H, d, U, w, P) => {
    x.fillStyle = '#050506'; x.fillRect(0, 0, W, H);
    U.haze(w ? .78 * W : .7 * W, .3 * H, (w ? .7 : .45) * H, P.pop, .45);
    U.smoke(5, .2, .9, .05);
    U.artist(w ? .66 * W : .5 * W, w ? H * 1.03 : .86 * H, w ? .99 * H : .58 * H, { rim: P.pop, halo: .25, filter: 'brightness(.85) contrast(1.15)' });
    U.fade('bottom', .4, 'rgba(0,0,0,.9)');
    const all = d.title.toUpperCase().split(/\s+/).filter(Boolean), per = Math.ceil(all.length / 4), ws = []; for (let i = 0; i < all.length; i += per) ws.push(all.slice(i, i + per).join(' '));
    const mode = (i) => (i === 1 ? 'outline' : i === ws.length - 1 && ws.length > 1 ? P.pop : null);
    if (w) { const col = .3 * W / ws.length; ws.forEach((wd, i) => { x.save(); x.translate(.04 * W + col * (i + .5), .46 * H + (i % 2 ? .04 : -.02) * H); x.rotate(-Math.PI / 2); U.type(wd, { x: -.38 * H, y: -col * .47, w: .76 * H, h: col * .94 }, { maxLines: 1, align: i % 2 ? 'right' : 'left', line: () => mode(i), ol: P.fg }); x.restore(); });
      U.track(U.lab(), .05 * W, .93 * H, 12 * U.u, { color: P.pop, sp: .5 }); }
    else { ws.forEach((wd, i) => U.type(wd, U.box([.06 + (i % 2) * .1, .08 + i * .065, .66, .06]), { maxLines: 1, line: () => mode(i), ol: P.fg })); U.track(U.lab(), .07 * W, (.08 + ws.length * .065 + .015) * H, 22 * U.u, { color: P.pop, sp: .5 }); }
    U.pill(w ? .95 * W : .82 * W, w ? .09 * H : .74 * H, w ? 14 : 20, { align: 'right' });
    U.scan(.08); U.chroma(3);
    U.close({ grain: .08, vig: .65 });
  })
];

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

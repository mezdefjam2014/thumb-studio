// Tech pack: 10 layouts from docs/RESEARCH.md §3 x 8 palettes = 80 templates.
// d.item = product cut-out (auto cut-out slot), d.cover = second product / photo, d.person = host.
// Everything else (studio sweep, devices, glass, lenses) is drawn procedurally. Keynote / studio look.
import { pop } from '../../core/pop.js';

const SANS = '"Segoe UI Black", "Segoe UI", "Helvetica Neue", Inter, Arial, sans-serif';
const hex = (h) => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map((c) => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const rgba = (h, a) => `rgba(${hex(h).join(',')},${a})`;
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h); return [c, c.getContext('2d')]; };
const lin = (g, x0, y0, x1, y1, stops) => { const l = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => l.addColorStop(o, c)); return l; };
const rr = (g, X, Y, w, h, r) => { g.beginPath(); g.roundRect(X, Y, w, h, r); };

function tech(x, W, H, d, K, P) {
  const U = pop(x, W, H, d, K, P), u = U.u, r = K.rnd, L = !!P.light;

  // ---------- STUDIO: seamless sweep, softbox key, rim strips, floor falloff ----------
  U.studio = (o = {}) => {
    const lx = o.lx ?? .62, hz = o.hz ?? (K.wide ? .62 : .58);
    const wallTop = L ? mix(P.bg[1], P.bg[0], .55) : mix(P.bg[1], '#000000', .35);
    x.fillStyle = lin(x, 0, 0, 0, H, [[0, wallTop], [hz - .12, P.bg[0]], [hz, L ? '#ffffff' : mix(P.bg[0], '#ffffff', .06)], [hz + .08, P.bg[0]], [1, L ? P.bg[1] : mix(P.bg[1], '#000000', .4)]]);
    x.fillRect(0, 0, W, H);
    x.save(); x.globalCompositeOperation = L ? 'source-over' : 'screen';
    U.glow(W * lx, H * .12, Math.max(W, H) * .55, '#ffffff', L ? .55 : .1);
    U.glow(W * lx, H * hz, Math.max(W, H) * .4, L ? '#ffffff' : P.pop, L ? .6 : .14);
    if (!L) for (const [sx, c] of [[0, o.rimL || P.pop], [W, o.rimR || P.alt]]) { x.fillStyle = lin(x, sx, 0, sx === 0 ? W * .32 : W * .68, 0, [[0, rgba(c, .28)], [1, rgba(c, 0)]]); x.fillRect(0, 0, W, H); }
    x.restore();
    x.fillStyle = lin(x, 0, H * hz, 0, H, [[0, 'rgba(0,0,0,0)'], [1, L ? 'rgba(20,30,50,.10)' : 'rgba(0,0,0,.5)']]); x.fillRect(0, H * hz, W, H * (1 - hz));
  };

  // ---------- DEVICE RENDERS (offscreen, lighting baked) ----------
  const finish = (alt) => L ? (alt ? [mix(P.alt, '#ffffff', .55), mix(P.alt, '#ffffff', .2)] : ['#f2f3f6', '#c9cdd5'])
    : (alt ? [mix(P.alt, '#000000', .25), mix(P.alt, '#000000', .7)] : ['#2b2f37', '#0c0e12']);
  const metal = (g, X0, X1) => lin(g, X0, 0, X1, 0, L ? [[0, '#9ea3ab'], [.08, '#f7f8fa'], [.2, '#c3c7ce'], [.8, '#d7dadf'], [.93, '#ffffff'], [1, '#8d929a']]
    : [[0, '#1a1c20'], [.07, '#8d939c'], [.18, '#3c4048'], [.82, '#2c3036'], [.94, '#a8aeb7'], [1, '#14161a']]);
  const sheen = (g, w, h, a = .16) => { g.save(); g.globalCompositeOperation = 'source-atop'; g.fillStyle = lin(g, 0, 0, w, h * .6, [[0, 'rgba(255,255,255,0)'], [.38, 'rgba(255,255,255,0)'], [.42, `rgba(255,255,255,${a})`], [.56, `rgba(255,255,255,${a * .4})`], [.6, 'rgba(255,255,255,0)']]); g.fillRect(0, 0, w, h); g.restore(); };
  const wall = (g, X, Y, w, h, alt) => {
    g.save(); rr(g, X, Y, w, h, Math.min(w, h) * .1); g.clip();
    g.fillStyle = lin(g, 0, Y, 0, Y + h, [[0, '#05060a'], [1, '#10131c']]); g.fillRect(X, Y, w, h);
    g.filter = `blur(${Math.min(w, h) * .09}px)`;
    g.fillStyle = alt ? P.alt : P.pop; g.beginPath(); g.ellipse(X + w * .3, Y + h * .62, w * .55, h * .28, -.5, 0, 7); g.fill();
    g.fillStyle = alt ? P.pop : P.alt; g.globalAlpha = .8; g.beginPath(); g.ellipse(X + w * .78, Y + h * .35, w * .4, h * .2, .6, 0, 7); g.fill();
    g.globalAlpha = .5; g.fillStyle = '#fff'; g.beginPath(); g.ellipse(X + w * .55, Y + h * .5, w * .12, h * .1, 0, 0, 7); g.fill();
    g.restore();
  };
  const lens = (g, cx, cy, R) => {
    g.fillStyle = lin(g, cx - R, cy - R, cx + R, cy + R, [[0, '#f4f5f7'], [.45, '#5c616a'], [1, '#d9dce1']]); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
    g.fillStyle = '#050608'; g.beginPath(); g.arc(cx, cy, R * .84, 0, 7); g.fill();
    const c = g.createRadialGradient(cx - R * .2, cy - R * .25, R * .05, cx, cy, R * .66); c.addColorStop(0, '#3a4b8c'); c.addColorStop(.45, '#1b1440'); c.addColorStop(.8, '#07070d'); c.addColorStop(1, '#111');
    g.fillStyle = c; g.beginPath(); g.arc(cx, cy, R * .66, 0, 7); g.fill();
    g.strokeStyle = 'rgba(120,200,255,.35)'; g.lineWidth = R * .05; g.beginPath(); g.arc(cx, cy, R * .5, 3.6, 5.2); g.stroke();
    g.strokeStyle = 'rgba(255,120,220,.25)'; g.beginPath(); g.arc(cx, cy, R * .38, .4, 1.8); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(cx - R * .28, cy - R * .3, R * .12, R * .07, -.7, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.arc(cx + R * .25, cy + R * .22, R * .05, 0, 7); g.fill();
  };
  const crackOn = (g, cx, cy, s, lw = 1) => { // shattered glass
    g.save(); g.lineCap = 'round';
    for (let i = 0; i < 14; i++) {
      let a = i / 14 * 6.283 + r() * .3, px = cx, py = cy; g.beginPath(); g.moveTo(px, py);
      for (let j = 0; j < 7; j++) { a += (r() - .5) * .5; const st = s * (.08 + r() * .12); px += Math.cos(a) * st; py += Math.sin(a) * st; g.lineTo(px, py); }
      g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 5 * lw; g.stroke(); g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2.2 * lw; g.stroke();
    }
    for (const k of [.12, .24, .4]) { g.beginPath(); for (let a = 0; a < 6.3; a += .35) { const q = s * k * (.85 + r() * .3); g.lineTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q); } g.closePath(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1.6 * lw; g.stroke(); }
    const sp = g.createRadialGradient(cx, cy, 0, cx, cy, s * .12); sp.addColorStop(0, 'rgba(255,255,255,.9)'); sp.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sp; g.beginPath(); g.arc(cx, cy, s * .12, 0, 7); g.fill();
    g.restore();
  };
  U.crackOn = crackOn; U.lens = lens;
  const DEV = {
    phoneBack(o) { const [c, g] = cv(500, 1000), [f0, f1] = finish(o.alt);
      g.fillStyle = metal(g, 0, 500); rr(g, 0, 0, 500, 1000, 86); g.fill();
      g.fillStyle = lin(g, 0, 0, 500, 1000, [[0, f0], [1, f1]]); rr(g, 12, 12, 476, 976, 76); g.fill();
      g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 18; g.shadowOffsetY = 6; g.fillStyle = lin(g, 34, 34, 284, 284, [[0, mix(f0, '#ffffff', .25)], [1, f1]]); rr(g, 34, 34, 250, 250, 64); g.fill(); g.restore();
      g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; rr(g, 35, 35, 248, 248, 63); g.stroke();
      lens(g, 102, 104, 54); lens(g, 102, 216, 54); lens(g, 214, 160, 54);
      g.fillStyle = '#fff7da'; g.beginPath(); g.arc(214, 70, 16, 0, 7); g.fill(); g.fillStyle = '#222'; g.beginPath(); g.arc(214, 250, 9, 0, 7); g.fill();
      g.fillStyle = L ? 'rgba(0,0,0,.14)' : 'rgba(255,255,255,.14)'; g.beginPath(); g.arc(250, 560, 34, 0, 7); g.fill();
      sheen(g, 500, 1000, L ? .45 : .14);
      g.strokeStyle = lin(g, 0, 0, 500, 1000, [[0, 'rgba(255,255,255,.9)'], [.5, 'rgba(255,255,255,.1)'], [1, 'rgba(255,255,255,.5)']]); g.lineWidth = 3; rr(g, 2, 2, 496, 996, 84); g.stroke();
      return c; },
    phoneFront(o) { const [c, g] = cv(500, 1000);
      g.fillStyle = metal(g, 0, 500); rr(g, 0, 0, 500, 1000, 86); g.fill();
      g.fillStyle = '#030304'; rr(g, 10, 10, 480, 980, 78); g.fill();
      wall(g, 26, 26, 448, 948, o.alt);
      g.fillStyle = '#000'; rr(g, 180, 50, 140, 40, 20); g.fill(); g.fillStyle = '#1a2340'; g.beginPath(); g.arc(296, 70, 8, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,.92)'; g.font = `600 150px ${SANS}`; g.textAlign = 'center'; g.fillText('9:41', 250, 330);
      g.font = `600 30px ${SANS}`; g.fillStyle = 'rgba(255,255,255,.7)'; g.fillText('Tuesday 18', 250, 170);
      if (o.crack) crackOn(g, 300, 420, 900);
      sheen(g, 500, 1000, .22);
      g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 3; rr(g, 2, 2, 496, 996, 84); g.stroke();
      return c; },
    laptop(o) { const [c, g] = cv(1400, 820), [f0, f1] = finish(o.alt);
      g.fillStyle = lin(g, 0, 0, 0, 760, [[0, mix(f0, '#ffffff', .2)], [1, f1]]); rr(g, 150, 0, 1100, 760, 34); g.fill();
      g.fillStyle = '#040405'; rr(g, 162, 12, 1076, 736, 26); g.fill();
      wall(g, 186, 40, 1028, 690, o.alt);
      g.fillStyle = '#040405'; rr(g, 640, 12, 120, 34, 12); g.fill();
      sheen(g, 1400, 820, .12);
      g.fillStyle = lin(g, 0, 760, 0, 812, [[0, L ? '#f4f5f7' : '#6d727b'], [.4, L ? '#c9cdd4' : '#2c3036'], [1, L ? '#8f949c' : '#0d0f12']]);
      g.beginPath(); g.moveTo(60, 760); g.lineTo(1340, 760); g.quadraticCurveTo(1400, 762, 1396, 790); g.lineTo(1370, 812); g.lineTo(30, 812); g.lineTo(4, 790); g.quadraticCurveTo(0, 762, 60, 760); g.fill();
      g.fillStyle = 'rgba(0,0,0,.35)'; rr(g, 610, 760, 180, 14, 7); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2; g.beginPath(); g.moveTo(60, 761); g.lineTo(1340, 761); g.stroke();
      return c; },
    headphones(o) { const [c, g] = cv(1000, 960), [f0, f1] = finish(o.alt);
      g.lineCap = 'round';
      g.strokeStyle = lin(g, 0, 120, 0, 560, [[0, mix(f0, '#ffffff', .3)], [1, f1]]); g.lineWidth = 72; g.beginPath(); g.arc(500, 560, 380, Math.PI + .28, -0.28); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 6; g.beginPath(); g.arc(500, 560, 404, Math.PI + .5, -0.5); g.stroke();
      g.strokeStyle = L ? '#d6d9de' : '#16181c'; g.lineWidth = 34; g.beginPath(); g.arc(500, 560, 336, Math.PI + .4, -0.4); g.stroke();
      for (const s of [-1, 1]) {
        const cx = 500 + s * 330; g.fillStyle = metal(g, cx - 20, cx + 20); rr(g, cx - 16, 400, 32, 220, 14); g.fill();
        g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30; g.shadowOffsetY = 12;
        g.fillStyle = lin(g, cx - 130, 560, cx + 130, 940, [[0, mix(f0, '#ffffff', .35)], [.5, f0], [1, f1]]); rr(g, cx - 135, 560, 270, 380, 130); g.fill(); g.restore();
        g.fillStyle = L ? '#b9bec6' : '#050608'; rr(g, s < 0 ? cx + 95 : cx - 135, 580, 40, 340, 20); g.fill();
        g.strokeStyle = P.pop; g.lineWidth = 6; rr(g, cx - 105, 600, 210, 300, 105); g.stroke();
        g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(cx - 50, 650, 26, 70, -.3, 0, 7); g.fill();
      }
      return c; },
    watch(o) { const [c, g] = cv(560, 1000), [f0, f1] = finish(o.alt);
      g.fillStyle = lin(g, 0, 0, 560, 0, [[0, f1], [.5, mix(f0, '#ffffff', .15)], [1, f1]]); rr(g, 110, 0, 340, 300, 40); g.fill(); rr(g, 110, 700, 340, 300, 40); g.fill();
      g.fillStyle = metal(g, 40, 520); rr(g, 40, 230, 480, 540, 140); g.fill();
      g.fillStyle = '#020203'; rr(g, 64, 254, 432, 492, 120); g.fill();
      const ring = (R, col, a) => { g.lineCap = 'round'; g.lineWidth = 36; g.strokeStyle = rgba(col, .25); g.beginPath(); g.arc(280, 500, R, 0, 7); g.stroke(); g.strokeStyle = col; g.beginPath(); g.arc(280, 500, R, -1.57, -1.57 + a); g.stroke(); };
      ring(160, P.pop, 5.2); ring(116, '#ff375f', 4.1); ring(72, '#3ddc84', 3.2);
      g.fillStyle = metal(g, 512, 548); rr(g, 512, 400, 34, 110, 12); g.fill();
      sheen(g, 560, 1000, .2); return c; },
    buds() { const [c, g] = cv(800, 640);
      g.fillStyle = lin(g, 0, 60, 0, 620, [[0, '#ffffff'], [.7, '#d3d7de'], [1, '#9a9fa8']]); rr(g, 40, 60, 720, 560, 220); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 4; g.beginPath(); g.moveTo(52, 250); g.lineTo(748, 250); g.stroke();
      g.fillStyle = P.pop; g.shadowColor = P.pop; g.shadowBlur = 20; g.beginPath(); g.arc(400, 330, 10, 0, 7); g.fill(); g.shadowBlur = 0;
      g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.ellipse(250, 150, 150, 36, -.08, 0, 7); g.fill(); return c; }
  };
  U.dev = (kind, o = {}) => DEV[kind](o);

  // Lit product on the floor: contact shadow, faded reflection, drop shadow, rim wrap. src = image or device kind.
  U.product = (src, cx, bottom, h, o = {}) => {
    const isImg = src && typeof src === 'object', img = isImg ? src : U.dev(typeof src === 'string' ? src : (o.fb || 'phoneBack'), o);
    const w = h * img.width / img.height, rot = o.rot || 0, pad = 4, [lc, lg] = cv(Math.ceil(w) + pad * 2, Math.ceil(h) + pad * 2);
    lg.filter = isImg ? 'contrast(1.06) saturate(1.08)' : 'none'; lg.drawImage(img, pad, pad, w, h); lg.filter = 'none';
    lg.globalCompositeOperation = 'source-atop';
    const rim = o.rim ?? (L ? '#ffffff' : P.pop), side = o.rimLeft ? 0 : lc.width;
    lg.globalAlpha = L ? .35 : .5; lg.fillStyle = lin(lg, side, 0, o.rimLeft ? lc.width * .25 : lc.width * .75, 0, [[0, rim], [1, 'rgba(0,0,0,0)']]); lg.fillRect(0, 0, lc.width, lc.height);
    lg.globalAlpha = 1; lg.fillStyle = lin(lg, 0, lc.height * .55, 0, lc.height, [[0, 'rgba(0,0,0,0)'], [1, L ? 'rgba(0,0,0,.12)' : 'rgba(0,0,0,.35)']]); lg.fillRect(0, 0, lc.width, lc.height);
    if (o.reflect !== false) {
      const rh = Math.min(h * .45, H - bottom + 4); if (rh > 4) {
        const [rc, rg] = cv(lc.width, Math.ceil(rh)); rg.scale(1, -1); rg.drawImage(lc, 0, -lc.height + pad);
        rg.setTransform(1, 0, 0, 1, 0, 0); rg.globalCompositeOperation = 'destination-in'; rg.fillStyle = lin(rg, 0, 0, 0, rh, [[0, 'rgba(0,0,0,1)'], [1, 'rgba(0,0,0,0)']]); rg.fillRect(0, 0, rc.width, rh);
        x.save(); x.globalAlpha = L ? .22 : .3; x.translate(cx, bottom); x.rotate(-rot * .5); x.drawImage(rc, -rc.width / 2, 0); x.restore();
      }
    }
    x.save(); x.filter = `blur(${18 * u}px)`; x.fillStyle = `rgba(0,0,0,${L ? .25 : .6})`; x.beginPath(); x.ellipse(cx, bottom, w * .6, Math.max(8 * u, h * .035), 0, 0, 7); x.fill();
    x.filter = `blur(${4 * u}px)`; x.fillStyle = `rgba(0,0,0,${L ? .35 : .7})`; x.beginPath(); x.ellipse(cx, bottom - 2 * u, w * .4, Math.max(3 * u, h * .01), 0, 0, 7); x.fill(); x.restore();
    if (!L && o.glow !== false) { x.save(); x.globalCompositeOperation = 'screen'; U.glow(cx, bottom - h * .5, h * .7, o.gc || P.pop, .28); x.restore(); }
    x.save(); x.translate(cx, bottom - h / 2); x.rotate(rot); x.shadowColor = `rgba(0,0,0,${L ? .22 : .55})`; x.shadowBlur = 50 * u; x.shadowOffsetY = 26 * u;
    x.drawImage(lc, -lc.width / 2, -lc.height / 2); x.restore();
    return { cx, top: bottom - h, w, h, rot };
  };

  // ---------- TYPE + UI ----------
  U.t = (txt, b, o = {}) => U.words(txt, b, { font: SANS, weight: '900', sw: L ? 0 : .02, stroke: L ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,.5)', fill: P.fg, hi: P.pop, ...o });
  U.kick = (txt, X, Y, s, al = 'left') => {
    x.save(); x.font = `700 ${s}px ${SANS}`; x.letterSpacing = `${s * .22}px`; const tw = x.measureText(txt).width, pw = tw + s * 1.4, ph = s * 2;
    const lx = al === 'left' ? X : al === 'right' ? X - pw : X - pw / 2;
    x.fillStyle = L ? rgba(P.pop, .1) : 'rgba(255,255,255,.07)'; rr(x, lx, Y - ph / 2, pw, ph, ph / 2); x.fill();
    x.strokeStyle = rgba(P.pop, L ? .55 : .7); x.lineWidth = 1.5 * u; x.stroke();
    x.fillStyle = L ? P.pop : '#fff'; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(txt, lx + s * .81, Y + s * .06); x.restore(); };
  U.glass = (X, Y, w, h, rad = 22 * u, o = {}) => {
    x.save(); rr(x, X, Y, w, h, rad); x.clip(); x.filter = `blur(${18 * u}px)`; x.drawImage(x.canvas, 0, 0); x.filter = 'none';
    x.fillStyle = o.fill || (L ? 'rgba(255,255,255,.62)' : 'rgba(255,255,255,.07)'); x.fillRect(X, Y, w, h);
    x.fillStyle = lin(x, 0, Y, 0, Y + h * .5, [[0, 'rgba(255,255,255,.18)'], [1, 'rgba(255,255,255,0)']]); x.fillRect(X, Y, w, h); x.restore();
    x.save(); x.shadowColor = `rgba(0,0,0,${L ? .12 : .4})`; x.shadowBlur = 30 * u; x.shadowOffsetY = 12 * u; x.strokeStyle = L ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.22)'; x.lineWidth = 1.5 * u; rr(x, X, Y, w, h, rad); x.stroke(); x.restore();
  };
  U.icon = (kind, cx, cy, s) => { const c = kind === 'x' ? '#ff2d2d' : '#22c55e'; x.save(); x.translate(cx, cy);
    x.shadowColor = rgba(c, .6); x.shadowBlur = 30 * u; x.fillStyle = lin(x, 0, -s, 0, s, [[0, mix(c, '#ffffff', .25)], [1, mix(c, '#000000', .2)]]); x.beginPath(); x.arc(0, 0, s, 0, 7); x.fill(); x.shadowColor = 'transparent';
    x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 2 * u; x.stroke();
    x.strokeStyle = '#fff'; x.lineWidth = s * .22; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); if (kind === 'x') { x.moveTo(-s * .36, -s * .36); x.lineTo(s * .36, s * .36); x.moveTo(s * .36, -s * .36); x.lineTo(-s * .36, s * .36); } else { x.moveTo(-s * .42, 0); x.lineTo(-s * .1, s * .32); x.lineTo(s * .44, -s * .32); } x.stroke(); x.restore(); };
  U.crown = (cx, cy, s) => { x.save(); x.translate(cx, cy); x.shadowColor = 'rgba(255,190,40,.6)'; x.shadowBlur = 26 * u; x.fillStyle = lin(x, 0, -s * .6, 0, s * .5, [[0, '#fff1b8'], [.5, '#ffc93c'], [1, '#b8860b']]);
    x.beginPath(); x.moveTo(-s, s * .5); x.lineTo(-s, -s * .3); x.lineTo(-s * .5, s * .05); x.lineTo(0, -s * .62); x.lineTo(s * .5, s * .05); x.lineTo(s, -s * .3); x.lineTo(s, s * .5); x.closePath(); x.fill(); x.restore(); };
  U.leader = (x1, y1, x2, y2, label, cap) => { // hairline elbow callout ending in a glass spec pill
    x.save(); x.strokeStyle = L ? rgba(P.fg, .55) : 'rgba(255,255,255,.7)'; x.lineWidth = 2 * u; x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y1); x.lineTo(x2, y2); x.stroke();
    x.fillStyle = P.pop; x.shadowColor = P.pop; x.shadowBlur = 16 * u; x.beginPath(); x.arc(x1, y1, 7 * u, 0, 7); x.fill(); x.shadowBlur = 0;
    x.strokeStyle = rgba(P.pop, .5); x.lineWidth = 2 * u; x.beginPath(); x.arc(x1, y1, 15 * u, 0, 7); x.stroke(); x.restore();
    const s = Math.min(W, H) * .075; x.save(); x.font = `900 ${s}px ${SANS}`; const tw = x.measureText(label).width; x.restore();
    const pw = tw + s * .9, ph = s * (cap ? 1.85 : 1.4), lx = x2 - pw / 2, ly = y2 - ph / 2;
    U.glass(lx, ly, pw, ph, 14 * u);
    x.save(); x.textAlign = 'center'; x.textBaseline = 'middle';
    if (cap) { x.font = `700 ${s * .28}px ${SANS}`; x.letterSpacing = `${s * .06}px`; x.fillStyle = L ? rgba(P.fg, .6) : 'rgba(255,255,255,.6)'; x.fillText(cap, x2, ly + s * .38); x.letterSpacing = '0px'; }
    x.font = `900 ${s}px ${SANS}`; x.fillStyle = P.fg; x.fillText(label, x2, cap ? ly + ph * .6 : y2 + s * .04); x.restore(); };
  U.flare = (cx, cy, s = 1) => { x.save(); x.globalCompositeOperation = 'screen'; U.glow(cx, cy, 110 * u * s, '#ffffff', .85); U.glow(cx, cy, 260 * u * s, P.pop, .3);
    x.fillStyle = lin(x, cx - 420 * u * s, 0, cx + 420 * u * s, 0, [[0, 'rgba(255,255,255,0)'], [.5, 'rgba(255,255,255,.7)'], [1, 'rgba(255,255,255,0)']]); x.fillRect(cx - 420 * u * s, cy - 1.5 * u, 840 * u * s, 3 * u); x.restore(); };
  U.end = () => U.finish({ vig: L ? .1 : .5, grain: .02, lx: .7, ly: .05 });
  U.fin = () => { U.grade(L ? { bloom: .07, tone: .05, curve: .04, warm: '#fff6ea' } : { bloom: .22, tone: .22, curve: .12, warm: mix(P.pop, '#ffffff', .6) }); U.end(); };
  return U;
}

const TT = (name, draw) => ({ name, niche: 'tech', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) { draw(x, W, H, d, tech(x, W, H, d, K, P), K.wide, P); } });
const verdict = (d, n = 3) => { const ws = d.big.split(/\s+/).filter(Boolean); return (ws.length <= n ? ws : ws.slice(-Math.min(2, n))).join(' '); };
const kick = (d, fb) => (d.kicker || d.label || fb).toUpperCase();

export default [
  // 1. Keynote hero: front + back pair at 3/4, verdict left.
  TT('PRODUCT + VERDICT', (x, W, H, d, U, w, P) => {
    U.studio({ lx: w ? .66 : .5 });
    if (w) { if (!d.item) U.product('phoneFront', .55 * W, .86 * H, .66 * H, { rot: -.07 }); U.product(d.item || 'phoneBack', .7 * W, .9 * H, .8 * H, { rot: .1 });
      U.kick(kick(d, 'FULL REVIEW'), .05 * W, .25 * H, 15 * U.u); U.t(verdict(d), U.box([.04, .31, .38, .36]), { align: 'left', maxLines: 3 }); }
    else { if (!d.item) U.product('phoneFront', .38 * W, .74 * H, .38 * H, { rot: -.07 }); U.product(d.item || 'phoneBack', .6 * W, .77 * H, .44 * H, { rot: .1 });
      U.kick(kick(d, 'FULL REVIEW'), .44 * W, .1 * H, 22 * U.u, 'center'); U.t(verdict(d), U.box([.06, .13, .76, .17]), { maxLines: 3 }); }
    U.fin();
  }),
  // 2. Split-lit duel: pop vs alt key, glowing divider, glass VS, crown + check on winner.
  TT('A VS B', (x, W, H, d, U, w, P) => {
    const L = !!P.light; U.studio({ lx: .5, rimL: P.pop, rimR: P.alt });
    x.save(); x.globalCompositeOperation = L ? 'multiply' : 'screen'; const gr = Math.max(W, H) * .32;
    U.glow(.25 * W, .5 * H, gr, L ? '#e4ecff' : P.pop, L ? .6 : .22); U.glow(.75 * W, .5 * H, gr, L ? '#ffece4' : P.alt, L ? .6 : .22); x.restore();
    x.fillStyle = lin(x, 0, 0, 0, H, [[0, 'rgba(255,255,255,0)'], [.5, L ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.7)'], [1, 'rgba(255,255,255,0)']]); x.fillRect(W / 2 - 1.5 * U.u, 0, 3 * U.u, H);
    const vs = (cx, cy, R) => { U.glass(cx - R, cy - R, R * 2, R * 2, R); x.save(); x.font = `900 ${R * .9}px ${SANS}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = P.fg; x.fillText('VS', cx, cy + R * .05); x.restore(); };
    if (w) { U.product(d.item || 'phoneBack', .25 * W, .86 * H, .66 * H, { rot: -.1, rimLeft: true, gc: P.pop }); U.product(d.cover || 'phoneBack', .7 * W, .86 * H, .66 * H, { rot: .1, alt: true, rim: L ? '#fff' : P.alt, gc: P.alt });
      vs(.5 * W, .5 * H, .085 * H); U.crown(.25 * W, .1 * H, .055 * H); U.icon('ok', .36 * W, .22 * H, .05 * H); U.icon('x', .84 * W, .22 * H, .05 * H); }
    else { U.product(d.item || 'phoneBack', .28 * W, .74 * H, .36 * H, { rot: -.1, rimLeft: true, gc: P.pop }); U.product(d.cover || 'phoneBack', .7 * W, .74 * H, .36 * H, { rot: .1, alt: true, rim: L ? '#fff' : P.alt, gc: P.alt });
      vs(.5 * W, .56 * H, .09 * W); U.crown(.28 * W, .33 * H, .06 * W); U.icon('ok', .14 * W, .4 * H, .06 * W); U.icon('x', .8 * W, .4 * H, .055 * W); U.t(verdict(d), U.box([.06, .09, .76, .16]), { maxLines: 2 }); }
    U.fin();
  }),
  // 3. Host reaction + product held up in key light, headline top-right.
  TT('HOST + PRODUCT', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .55 });
    if (w) { U.cutout(d.person, .2 * W, H * 1.02, .9 * H, { ow: 0, rim: P.pop }); U.product(d.item || 'phoneFront', .56 * W, .9 * H, .7 * H, { rot: .12 }); U.flare(.62 * W, .2 * H, .6);
      U.kick(kick(d, 'HANDS-ON'), .7 * W, .09 * H, 14 * U.u); U.t(verdict(d), U.box([.7, .13, .27, .42]), { maxLines: 3, align: 'left' }); }
    else { U.product(d.item || 'phoneFront', .64 * W, .7 * H, .38 * H, { rot: .1 }); U.cutout(d.person, .32 * W, .8 * H, .42 * H, { ow: 0, rim: P.pop });
      U.kick(kick(d, 'HANDS-ON'), .44 * W, .1 * H, 22 * U.u, 'center'); U.t(verdict(d), U.box([.06, .13, .76, .16]), { maxLines: 2 }); }
    U.fin();
  }),
  // 4. Premium white box, lid lifted, light beam with dust, device rising.
  TT('UNBOX REVEAL', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .5 }); const u = U.u, L = !!P.light;
    const bw = w ? .4 * W : .74 * W, bh = bw * .32, cx = .5 * W, by = w ? .97 * H : .8 * H, top = by - bh;
    x.save(); x.globalCompositeOperation = L ? 'source-over' : 'screen';
    x.fillStyle = lin(x, 0, top, 0, 0, [[0, L ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.5)'], [1, 'rgba(255,255,255,0)']]);
    x.beginPath(); x.moveTo(cx - bw * .45, top); x.lineTo(cx - bw * .8, 0); x.lineTo(cx + bw * .8, 0); x.lineTo(cx + bw * .45, top); x.fill();
    U.glow(cx, top, bw * .6, P.pop, L ? .25 : .55); x.restore();
    for (let i = 0; i < 40; i++) { const px = cx + Math.sin(i * 12.9) * .45 * bw, py = top - Math.abs(Math.cos(i * 7.3)) * top * .9; x.fillStyle = L ? `rgba(120,140,170,${.15 + .2 * Math.abs(Math.sin(i))})` : `rgba(255,255,255,${.2 + .4 * Math.abs(Math.sin(i))})`; x.beginPath(); x.arc(px, py, (1 + (i % 3)) * u, 0, 7); x.fill(); }
    x.fillStyle = '#0d0e10'; rr(x, cx - bw / 2 + 8 * u, top - bh * .18, bw - 16 * u, bh * .3, 6 * u); x.fill();
    U.product(d.item || 'phoneBack', cx, top + bh * .1, w ? .62 * H : .36 * H, { reflect: false, rot: .02 });
    x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 40 * u; x.shadowOffsetY = 20 * u;
    x.fillStyle = lin(x, 0, top, 0, by, [[0, '#ffffff'], [1, '#d9dce2']]); rr(x, cx - bw / 2, top, bw, bh, 10 * u); x.fill(); x.restore();
    x.fillStyle = '#fff'; x.fillRect(cx - bw / 2 + 4 * u, top, bw - 8 * u, 3 * u);
    x.fillStyle = rgba(P.pop, .9); x.fillRect(cx - bw * .12, top + bh * .48, bw * .24, 4 * u);
    x.save(); x.translate(w ? .2 * W : .2 * W, w ? .74 * H : .86 * H); x.rotate(-.22); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 40 * u; x.shadowOffsetY = 24 * u;
    const lw = bw * .55; x.fillStyle = lin(x, 0, -bh * .2, 0, bh * .2, [[0, '#ffffff'], [1, '#cfd3da']]); rr(x, -lw / 2, -bh * .16, lw, bh * .32, 8 * u); x.fill(); x.restore();
    U.flare(cx, top - (w ? .55 : .3) * H, .7);
    if (w) { U.kick(kick(d, 'UNBOXING'), .04 * W, .08 * H, 14 * u); U.t(verdict(d) || 'FINALLY', U.box([.03, .12, .32, .3]), { align: 'left', maxLines: 3 }); }
    else { U.kick(kick(d, 'UNBOXING'), .44 * W, .09 * H, 22 * u, 'center'); U.t(verdict(d) || 'FINALLY', U.box([.06, .12, .76, .14])); }
    U.fin();
  }),
  // 5. Spec sheet: back of phone, hairline elbow leaders to glass spec pills.
  TT('SPEC CALLOUT', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .5 });
    const p = U.product(d.item || 'phoneBack', .5 * W, w ? .92 * H : .72 * H, w ? .82 * H : .44 * H, { rot: 0 });
    const words = d.big.split(/\s+/).filter(Boolean), sp = words.filter((t) => /\d/.test(t)), Ls = (sp.length >= 2 ? sp : ['200MP', '5000mAh', '1TB']).slice(0, 3), caps = ['CAMERA', 'BATTERY', 'STORAGE'];
    const left = p.cx - p.w / 2, at = (fx, fy) => [left + p.w * fx, p.top + p.h * fy];
    if (w) { const [a1, b1] = at(.3, .14), [a2, b2] = at(.3, .55), [a3, b3] = at(.75, .8);
      U.leader(a1, b1, .2 * W, .3 * H, Ls[0], caps[0]); U.leader(a2, b2, .2 * W, .68 * H, Ls[1] || '1TB', caps[1]); if (Ls[2]) U.leader(a3, b3, .77 * W, .45 * H, Ls[2], caps[2]); }
    else { const [a1, b1] = at(.3, .14), [a2, b2] = at(.3, .6), [a3, b3] = at(.75, .85);
      U.leader(a1, b1, .44 * W, .14 * H, Ls[0], caps[0]); U.leader(a2, b2, .24 * W, .76 * H, Ls[1] || '1TB', caps[1]); if (Ls[2]) U.leader(a3, b3, .66 * W, .76 * H, Ls[2], caps[2]); }
    U.fin();
  }),
  // 6. Laptop hero + glass price card with accent spine.
  TT('PRICE TAG', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .35 }); const u = U.u;
    let price; const card = (X, Y, cw, chh) => { U.glass(X, Y, cw, chh, 26 * u); x.save(); x.fillStyle = P.pop; rr(x, X, Y, 8 * u, chh, [26 * u, 0, 0, 26 * u]); x.fill(); x.restore();
      x.save(); x.font = `700 ${chh * .1}px ${SANS}`; x.letterSpacing = `${chh * .03}px`; x.fillStyle = P.light ? rgba(P.fg, .55) : 'rgba(255,255,255,.6)'; x.textBaseline = 'top'; x.fillText('PRICE', X + chh * .16, Y + chh * .12); x.restore();
      U.t(price, { x: X + chh * .1, y: Y + chh * .28, w: cw - chh * .2, h: chh * .62 }, { fill: P.pop, hi: null, align: 'left', maxLines: 1 }); };
    const rest = verdict({ big: U.rest() }); price = ((d.big + ' ' + d.title).match(/[$€£]\s?\d[\d,.]*/) || ['$999'])[0];
    if (w) { U.product(d.item || 'laptop', .32 * W, .9 * H, d.item ? .78 * H : .5 * H, { rot: d.item ? -.08 : 0 }); card(.6 * W, .12 * H, .34 * W, .3 * H); U.t(rest, U.box([.6, .48, .34, .22]), { align: 'left', maxLines: 2 }); }
    else { U.product(d.item || 'laptop', .47 * W, .74 * H, d.item ? .42 * H : .2 * H, { rot: 0 }); card(.1 * W, .1 * H, .66 * W, .15 * H); U.t(rest, U.box([.06, .3, .76, .13]), { maxLines: 2 }); }
    U.fin();
  }),
  // 7. Drop test: shattered glass, falling shards, red X, host inset.
  TT('BROKEN TEST', (x, W, H, d, U, w, P) => {
    U.studio({ rimL: '#ff2d2d' }); const u = U.u;
    const o = { rot: w ? .2 : .16, crack: true, rim: '#ff4040', gc: '#ff2d2d' };
    const p = w ? U.product(d.item || 'phoneFront', .6 * W, .9 * H, .8 * H, o) : U.product(d.item || 'phoneFront', .54 * W, .74 * H, .44 * H, o);
    if (d.item) U.crackOn(x, p.cx, p.top + p.h * .4, p.h * .9, u);
    for (let i = 0; i < 9; i++) { const sx = p.cx + Math.sin(i * 3.1) * .7 * p.w, sy = p.top + p.h * (.75 + .25 * Math.abs(Math.cos(i * 1.7))), s = (6 + (i % 4) * 5) * u;
      x.save(); x.translate(sx, sy); x.rotate(i); x.fillStyle = 'rgba(200,230,255,.55)'; x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = u; x.beginPath(); x.moveTo(0, -s); x.lineTo(s * .8, s * .5); x.lineTo(-s * .6, s * .7); x.closePath(); x.fill(); x.stroke(); x.restore(); }
    U.icon('x', w ? .84 * W : .78 * W, w ? .18 * H : .3 * H, w ? .08 * H : .07 * W);
    const inset = (cx, cy, R) => { U.glow(cx, cy, R * 1.5, P.pop, .4); x.save(); x.beginPath(); x.arc(cx, cy, R, 0, 7); x.clip(); x.fillStyle = P.bg[1]; x.fillRect(cx - R, cy - R, R * 2, R * 2); U.cutout(d.person, cx, cy + R * 1.3, R * 2.4, { ow: 0, rim: false, shadow: false }); x.restore();
      x.strokeStyle = '#fff'; x.lineWidth = 6 * u; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke(); x.strokeStyle = P.pop; x.lineWidth = 3 * u; x.beginPath(); x.arc(cx, cy, R + 8 * u, 0, 7); x.stroke(); };
    if (w) { inset(.15 * W, .24 * H, .15 * H); U.t(verdict(d), U.box([.03, .48, .34, .3]), { align: 'left', maxLines: 3 }); }
    else { inset(.24 * W, .32 * H, .16 * W); U.t(verdict(d), U.box([.06, .09, .76, .14]), { maxLines: 2 }); }
    U.fin();
  }),
  // 8. Macro: camera module fills the frame (or a punch-in crop of the upload).
  TT('MACRO DETAIL', (x, W, H, d, U, w, P) => {
    const u = U.u, img = d.item || d.cover;
    x.fillStyle = '#050608'; x.fillRect(0, 0, W, H);
    if (img) { x.save(); x.filter = 'contrast(1.18) saturate(1.2)'; const s = Math.max(W / img.width, H / img.height) * 1.6; x.drawImage(img, W / 2 - img.width * s * .55, H / 2 - img.height * s * .45, img.width * s, img.height * s); x.restore(); }
    else {
      const [f0, f1] = P.light ? ['#e6e8ec', '#9ca2ab'] : [mix(P.bg[0], '#ffffff', .1), '#0a0b0e'];
      x.fillStyle = lin(x, 0, 0, W, H, [[0, f0], [.5, mix(f0, f1, .5)], [1, f1]]); x.fillRect(0, 0, W, H);
      const cx = w ? .66 * W : .5 * W, cy = w ? .52 * H : .42 * H, R = w ? .5 * H : .4 * W;
      x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 60 * u; x.fillStyle = lin(x, cx - R * 1.6, cy - R * 1.6, cx + R, cy + R, [[0, mix(f0, '#ffffff', .2)], [1, f1]]); rr(x, cx - R * 1.45, cy - R * 1.45, R * 3.2, R * 3.2, R * .9); x.fill(); x.restore();
      const [lc, lg] = cv(800, 800); U.lens(lg, 400, 400, 380);
      const big = (lx, ly, LR) => x.drawImage(lc, lx - LR, ly - LR, LR * 2, LR * 2);
      big(cx, cy, R); big(cx - R * 1.25, cy - R * 1.55, R * .9); big(w ? cx + R * 1.5 : cx + R * .2, w ? cy - R * 1.5 : cy + R * 2.3, R * .7);
      x.save(); x.globalCompositeOperation = 'screen'; const cg = x.createConicGradient(0, cx, cy); [P.pop, P.alt, '#00ffb0', P.pop].forEach((c, i) => cg.addColorStop(i / 3, rgba(c, .22))); x.fillStyle = cg; x.beginPath(); x.arc(cx, cy, R * .55, 0, 7); x.fill(); x.restore();
      U.flare(cx - R * .3, cy - R * .32, 1);
    }
    x.fillStyle = w ? lin(x, 0, 0, W * .55, 0, [[0, 'rgba(0,0,0,.85)'], [1, 'rgba(0,0,0,0)']]) : lin(x, 0, H * .5, 0, H * .85, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.85)']]); x.fillRect(0, 0, W, H);
    const T = { fill: '#fff', sw: .02, stroke: 'rgba(0,0,0,.5)' };
    if (w) { U.kick(kick(d, 'CAMERA TEST'), .04 * W, .3 * H, 14 * u); U.t(verdict(d), U.box([.03, .35, .36, .32]), { ...T, align: 'left', maxLines: 3 }); }
    else { U.kick(kick(d, 'CAMERA TEST'), .44 * W, .6 * H, 22 * u, 'center'); U.t(verdict(d), U.box([.06, .63, .76, .14]), { ...T, maxLines: 2 }); }
    U.fin();
  }),
  // 9. Ranked lineup on podium plinths: mixed device family, #1 centre under the key.
  TT('TOP 5 LINEUP', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .5 }); const u = U.u, L = !!P.light;
    const ranks = [4, 2, 1, 3, 5], kinds = ['buds', 'phoneBack', 'laptop', 'headphones', 'watch'], hs = { buds: .17, phoneBack: .44, laptop: .34, headphones: .36, watch: .34 };
    if (!w) { // tall: depth stack, back row first, #1 front-centre
      const spots = { 5: [.76, .47, .85], 4: [.24, .47, .85], 3: [.8, .66, 1], 2: [.2, .66, 1], 1: [.5, .78, 1.3] }, kk = { 1: d.item || 'phoneBack', 2: d.cover || 'headphones', 3: 'watch', 4: 'buds', 5: 'laptop' }, hk = { phoneBack: .28, headphones: .15, watch: .17, buds: .09, laptop: .1 };
      for (const rk of [5, 4, 3, 2, 1]) { const [fx, fy, s] = spots[rk], k = kk[rk], hh = H * (typeof k === 'string' ? hk[k] : .3) * s;
        if (rk === 1) { x.save(); x.globalCompositeOperation = L ? 'source-over' : 'screen'; U.glow(fx * W, fy * H - hh * .5, hh, L ? '#ffffff' : P.pop, .5); x.restore(); }
        const p = U.product(k, fx * W, fy * H, hh, { reflect: rk === 1, glow: rk === 1, alt: rk % 2 === 0 });
        const R = 34 * u * s; x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 16 * u; x.fillStyle = rk === 1 ? P.pop : (L ? '#ffffff' : '#1c1f26'); x.beginPath(); x.arc(fx * W, p.top - R * 1.3, R, 0, 7); x.fill(); x.restore();
        x.save(); x.font = `900 ${R * 1.2}px ${SANS}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = rk === 1 ? '#fff' : P.fg; x.fillText(String(rk), fx * W, p.top - R * 1.25); x.restore(); }
      U.crown(.5 * W, .78 * H - H * .28 * 1.3 - 34 * u * 3.6, .05 * W);
      U.t((d.big.match(/TOP\s*\d+/i) || ['TOP 5'])[0].toUpperCase(), U.box([.06, .09, .76, .14]), { maxLines: 1 }); U.fin(); return; }
    const floor = w ? .9 * H : .74 * H, slot = w ? .19 * W : .175 * W, x0 = w ? .12 * W : .15 * W, sc = w ? H : .5 * H;
    ranks.forEach((rk, i) => { const cx = x0 + i * slot, plH = (6 - rk) * (w ? .035 : .018) * H, pw = slot * .86, top = floor - plH;
      x.save(); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 30 * u; x.shadowOffsetY = 14 * u; x.fillStyle = lin(x, 0, top, 0, floor, L ? [[0, '#ffffff'], [1, '#d5d9e0']] : [[0, '#2a2e36'], [1, '#0b0c10']]); rr(x, cx - pw / 2, top, pw, plH + 2 * u, 6 * u); x.fill(); x.restore();
      x.fillStyle = rk === 1 ? P.pop : (L ? '#fff' : 'rgba(255,255,255,.25)'); x.fillRect(cx - pw / 2, top, pw, 3 * u);
      const kind = rk === 1 && d.item ? d.item : rk === 2 && d.cover ? d.cover : kinds[i];
      if (rk === 1) { x.save(); x.globalCompositeOperation = L ? 'source-over' : 'screen'; U.glow(cx, top - sc * .2, sc * .4, L ? '#ffffff' : P.pop, .5); x.restore(); }
      let hh = sc * (typeof kind === 'string' ? hs[kind] : .44) * (rk === 1 ? 1.15 : 1); if (kind === 'laptop' && !w) hh *= .45;
      U.product(kind, cx, top, hh, { reflect: false, glow: rk === 1, alt: i % 2 === 1 });
      x.save(); x.font = `900 ${Math.min(plH * .8, (w ? .07 : .045) * H)}px ${SANS}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = rk === 1 ? P.pop : (L ? rgba(P.fg, .7) : 'rgba(255,255,255,.75)'); x.fillText(String(rk), cx, top + plH * .52); x.restore(); });
    U.crown(x0 + 2 * slot, w ? .1 * H : .3 * H, w ? .05 * H : .05 * W);
    const tt = (d.big.match(/TOP\s*\d+/i) || ['TOP 5'])[0].toUpperCase();
    U.t(tt, U.box(w ? [.03, .04, .28, .2] : [.06, .09, .76, .14]), { align: w ? 'left' : 'center', maxLines: 1 });
    U.fin();
  }),
  // 10. Giant score inside a progress ring, headphones render right.
  TT('RATING SCORE', (x, W, H, d, U, w, P) => {
    U.studio({ lx: .72 }); const u = U.u, L = !!P.light;
    const m = d.big.match(/(\d+(?:\.\d)?)\s*\/\s*10/), sc = m ? m[1] : '9', frac = Math.min(1, parseFloat(sc) / 10);
    const score = (cx, cy, R) => {
      x.save(); x.lineCap = 'round'; x.lineWidth = R * .1; x.strokeStyle = L ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.08)'; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
      x.strokeStyle = lin(x, cx - R, cy + R, cx + R, cy - R, [[0, P.pop], [1, L ? P.pop : mix(P.pop, '#ffffff', .4)]]); x.shadowColor = P.pop; x.shadowBlur = L ? 0 : 30 * u; x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + 6.283 * frac); x.stroke(); x.restore();
      x.save(); x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.font = `900 ${R * 1.05}px ${SANS}`; x.fillStyle = P.fg; x.letterSpacing = `${-R * .04}px`; x.fillText(sc, cx, cy + R * .3);
      x.font = `800 ${R * .28}px ${SANS}`; x.letterSpacing = '0px'; x.fillStyle = P.pop; x.fillText('/ 10', cx, cy + R * .64); x.restore(); };
    if (w) { U.product(d.item || 'headphones', .7 * W, .92 * H, .74 * H, { rot: .06 }); score(.24 * W, .4 * H, .27 * H); U.t(verdict(d), U.box([.04, .73, .4, .1]), { maxLines: 1 }); }
    else { U.product(d.item || 'headphones', .5 * W, .76 * H, .3 * H, { rot: .06 }); score(.44 * W, .33 * H, .2 * W); U.t(verdict(d), U.box([.06, .08, .76, .1]), { maxLines: 2 }); }
    U.fin();
  })
];

// 8 palettes from research §3. light = high-key background (dark text, no outline).
export const TECH_PRESETS = [
  { name: 'CLEAN STUDIO', bg: ['#f5f7fa', '#d6dde8'], fg: '#0f1115', st: '#ffffff', pop: '#2f6bff', alt: '#ff5a36', light: true },
  { name: 'DARK MODE PRO', bg: ['#1c2230', '#0b0d12'], fg: '#e6eaf2', st: '#000', pop: '#3da9fc', alt: '#7c5cff' },
  { name: 'NEON CYBER', bg: ['#1d1250', '#0a0620'], fg: '#ffffff', st: '#000', pop: '#00f0ff', alt: '#ff2bd6' },
  { name: 'WARM MINIMAL', bg: ['#ffffff', '#e6e6eb'], fg: '#1d1d1f', st: '#ffffff', pop: '#ff9500', alt: '#0a84ff', light: true },
  { name: 'ANDROID GREEN', bg: ['#173426', '#0a160f'], fg: '#ffffff', st: '#000', pop: '#3ddc84', alt: '#1f7a52' },
  { name: 'CARBON ORANGE', bg: ['#2a2a2a', '#101010'], fg: '#f2f2f2', st: '#000', pop: '#ff6a00', alt: '#9a9a9a' },
  { name: 'GOLD PREMIUM', bg: ['#262012', '#0b0b0b'], fg: '#ffffff', st: '#000', pop: '#d4af37', alt: '#7a6224' },
  { name: 'RED VERDICT', bg: ['#ffffff', '#e2e2e7'], fg: '#101010', st: '#ffffff', pop: '#e10600', alt: '#8e8e93', light: true }
];

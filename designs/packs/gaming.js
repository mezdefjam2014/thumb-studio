// Gaming pack: 10 layouts from docs/RESEARCH.md §5 x 8 game palettes = 80 templates.
// d.cover = gameplay screenshot, d.person = your face (facecam), d.person2 = character/boss, d.item = weapon/logo.
// Key-art look: procedural scenes, volumetric fog + shafts, embers, lit armoured figures, extruded gradient titles.
import { pop } from '../../core/pop.js';

const F = 'Anton, Impact, "Arial Narrow", sans-serif';
const hx = (c) => { c = String(c).replace('#', ''); if (c.length === 3) c = [...c].map((v) => v + v).join(''); const n = parseInt(c, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mix = (a, b, t) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const rgba = (c, a) => { const [r, g, b] = hx(c); return `rgba(${r},${g},${b},${a})`; };
const CACHE = new Map();

// Procedural armoured figure (hero | boss | creature), lit with palette rim lights. 600x800, cached per palette.
function figure(P, kind) {
  const key = kind + P.glow + P.pop + P.bg[1];
  if (CACHE.has(key)) return CACHE.get(key);
  const c = document.createElement('canvas'); c.width = 600; c.height = 800; const g = c.getContext('2d');
  const lin = (x0, y0, x1, y1, stops) => { const l = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, s]) => l.addColorStop(o, s)); return l; };
  const poly = (pts) => { g.beginPath(); pts.forEach(([a, b], i) => i ? g.lineTo(a, b) : g.moveTo(a, b)); g.closePath(); };
  const steel = kind === 'creature' ? ['#3a3d42', '#16171a', '#060607'] : kind === 'boss' ? ['#6b5e66', '#2a2026', '#0c080a'] : ['#8d99b0', '#3a4253', '#11141b'];
  const eye = kind === 'hero' ? P.glow : P.pop;
  if (kind === 'creature') {
    g.fillStyle = lin(0, 200, 0, 800, [[0, steel[1]], [1, steel[2]]]);
    g.beginPath(); g.moveTo(130, 800); g.bezierCurveTo(140, 600, 180, 470, 300, 430); g.bezierCurveTo(420, 470, 460, 600, 470, 800); g.fill();
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(300 + s * 110, 470); g.bezierCurveTo(300 + s * 230, 540, 300 + s * 250, 680, 300 + s * 215, 800); g.lineTo(300 + s * 190, 800); g.bezierCurveTo(300 + s * 210, 680, 300 + s * 180, 560, 300 + s * 90, 500); g.fill(); }
    g.fillStyle = lin(220, 120, 380, 430, [[0, steel[0]], [1, steel[2]]]);
    g.beginPath(); g.ellipse(300, 290, 92, 160, 0, 0, 7); g.fill();
    g.fillStyle = '#000'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(300 + s * 38, 270, 30, 20, s * .35, 0, 7); g.fill(); }
    g.beginPath(); g.ellipse(300, 380, 40, 30, 0, 0, 7); g.fill();
  } else {
    g.fillStyle = lin(0, 380, 0, 800, [[0, '#120d10'], [1, '#050405']]); // cape
    poly([[150, 430], [450, 430], [560, 800], [40, 800]]); g.fill();
    g.fillStyle = lin(120, 0, 480, 0, [[0, steel[0]], [.45, steel[1]], [1, steel[2]]]);
    poly([[175, 430], [425, 430], [520, 800], [80, 800]]); g.fill();
    g.fillStyle = lin(200, 440, 400, 640, [[0, mix(steel[0], '#ffffff', .25)], [.5, steel[1]], [1, steel[2]]]);
    poly([[200, 440], [400, 440], [418, 565], [300, 650], [182, 565]]); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.6)'; g.lineWidth = 5; g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(300, 445); g.lineTo(300, 640); g.stroke();
    for (let i = 0; i < 3; i++) { const y = 665 + i * 46; g.fillStyle = lin(220, y, 380, y + 40, [[0, steel[0]], [1, steel[2]]]); g.beginPath(); g.roundRect(222 + i * 4, y, 156 - i * 8, 38, 8); g.fill(); g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 4; g.stroke(); }
    g.fillStyle = steel[2]; g.fillRect(262, 370, 76, 75);
    for (const s of [-1, 1]) { const ax = 300 + s * (kind === 'boss' ? 175 : 160); g.fillStyle = lin(ax - 70, 0, ax + 70, 0, s < 0 ? [[0, steel[0]], [1, steel[2]]] : [[0, steel[1]], [1, steel[2]]]); poly([[ax - 55, 500], [ax + 55, 500], [ax + 50 + s * 20, 800], [ax - 50 + s * 20, 800]]); g.fill(); g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 4; g.stroke(); g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = 3; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(ax - 50 + s * k * 5, 600 + k * 60); g.lineTo(ax + 50 + s * k * 5, 600 + k * 60); g.stroke(); } }
    for (const s of [-1, 1]) { // pauldrons with ridges
      const cx = 300 + s * (kind === 'boss' ? 165 : 150);
      g.fillStyle = lin(cx - 120, 380, cx + 120, 560, s < 0 ? [[0, mix(steel[0], '#ffffff', .2)], [1, steel[2]]] : [[0, steel[1]], [1, steel[2]]]);
      g.beginPath(); g.ellipse(cx, 480, kind === 'boss' ? 130 : 112, 82, s * -.32, Math.PI, Math.PI * 2.15); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = 4; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(cx, 492 + k * 22, 100 - k * 14, 60 - k * 8, s * -.32, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
      if (kind === 'boss') for (let k = 0; k < 3; k++) { g.fillStyle = lin(0, 300, 0, 440, [[0, '#d8ccd2'], [1, steel[2]]]); const bx = cx - 50 + k * 45; poly([[bx - 14, 425 - k * 4], [bx + s * 22, 330 - k * 12], [bx + 16, 422]]); g.fill(); }
    }
    g.fillStyle = lin(190, 120, 410, 400, [[0, mix(steel[0], '#ffffff', .2)], [.5, steel[1]], [1, steel[2]]]); // helmet
    g.beginPath(); g.ellipse(300, 255, 112, 135, 0, Math.PI, 0); g.lineTo(395, 300); g.lineTo(355, 405); g.lineTo(245, 405); g.lineTo(205, 300); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 5; g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 6; g.beginPath(); g.moveTo(300, 122); g.lineTo(300, 235); g.stroke();
    g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 4; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(300 + s * 20, 330); g.lineTo(300 + s * 55, 395); g.stroke(); }
    if (kind === 'boss') for (const s of [-1, 1]) { g.fillStyle = lin(0, 40, 0, 220, [[0, '#efe3e8'], [1, '#2a2026']]); g.beginPath(); g.moveTo(300 + s * 70, 170); g.bezierCurveTo(300 + s * 150, 120, 300 + s * 170, 60, 300 + s * 140, 0); g.bezierCurveTo(300 + s * 200, 70, 300 + s * 180, 170, 300 + s * 95, 215); g.fill(); }
  }
  // light wrap: key from left (glow), kicker from right (pop), floor darkness
  g.globalCompositeOperation = 'source-atop';
  g.fillStyle = lin(0, 0, 600, 0, [[0, rgba(P.glow, .45)], [.4, 'rgba(0,0,0,0)'], [.62, 'rgba(0,0,0,0)'], [1, rgba(P.pop, .4)]]); g.fillRect(0, 0, 600, 800);
  g.fillStyle = lin(0, 520, 0, 800, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.6)']]); g.fillRect(0, 0, 600, 800);
  // rim band = silhouette minus shifted silhouette
  for (const [dx, col] of [[-14, '#ffffff'], [14, P.pop], [-8, P.glow]]) {
    const rc = document.createElement('canvas'); rc.width = 600; rc.height = 800; const q = rc.getContext('2d');
    q.drawImage(c, 0, 0); q.globalCompositeOperation = 'source-in'; q.fillStyle = col; q.fillRect(0, 0, 600, 800);
    q.globalCompositeOperation = 'destination-out'; q.drawImage(c, -dx, 6);
    g.globalAlpha = col === '#ffffff' ? .5 : .9; g.filter = 'blur(2px)'; g.drawImage(rc, 0, 0); g.filter = 'none'; g.globalAlpha = 1;
  }
  g.globalCompositeOperation = 'source-over';
  // eyes / visor
  g.shadowColor = eye; g.shadowBlur = 40; g.fillStyle = eye;
  if (kind === 'hero') { poly([[212, 262], [388, 262], [372, 296], [228, 296]]); g.fill(); g.fill(); g.fillStyle = '#fff'; g.shadowBlur = 10; g.fillRect(240, 274, 120, 6); g.fillStyle = P.glow; g.shadowBlur = 30; g.beginPath(); g.arc(300, 530, 18, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(300, 530, 7, 0, 7); g.fill(); }
  else { const cr = kind === 'creature', y = cr ? 272 : 280; for (const s of [-1, 1]) { g.fillStyle = eye; g.beginPath(); g.ellipse(300 + s * (cr ? 38 : 45), y, cr ? 14 : 30, cr ? 7 : 10, s * .3, 0, 7); g.fill(); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(300 + s * (cr ? 38 : 45), y, 5, 3, 0, 0, 7); g.fill(); } }
  g.shadowBlur = 0;
  CACHE.set(key, c); return c;
}

function game(x, W, H, d, K, P) {
  const U = pop(x, W, H, d, K, P), u = U.u, r = K.rnd, w = K.wide;
  const fill = (img, bx, by, bw, bh) => { const s = Math.max(bw / img.width, bh / img.height); x.drawImage(img, bx + (bw - img.width * s) / 2, by + (bh - img.height * s) / 2, img.width * s, img.height * s); };
  const contain = (img, bx, by, bw, bh) => { const s = Math.min(bw / img.width, bh / img.height); x.drawImage(img, bx + (bw - img.width * s) / 2, by + (bh - img.height * s) / 2, img.width * s, img.height * s); };

  // Procedural key-art landscape in a box: sky, sun, layered ridges with aerial perspective, glowing horizon, grid floor.
  U.scene = (bx, by, bw, bh, o = {}) => {
    const hz = by + bh * (o.hz ?? .6);
    let g = x.createLinearGradient(0, by, 0, hz); g.addColorStop(0, P.bg[1]); g.addColorStop(1, mix(P.bg[0], P.glow, .25)); x.fillStyle = g; x.fillRect(bx, by, bw, bh);
    const sx = bx + bw * (o.sun ?? .62); U.glow(sx, hz - bh * .05, bh * .7, P.glow, .5); U.glow(sx, hz - bh * .05, bh * .18, '#ffffff', .6);
    for (let l = 0; l < 4; l++) {
      const base = hz - bh * (.02 + (3 - l) * .05), amp = bh * (.14 - l * .02), col = mix(mix(P.bg[0], P.glow, .3), P.bg[1], .25 + l * .25);
      x.fillStyle = col; x.beginPath(); x.moveTo(bx, by + bh); let px = bx; x.lineTo(px, base);
      while (px < bx + bw) { px += bw * (.04 + r() * .06); x.lineTo(px, base - amp * (.3 + r() * .7)); }
      x.lineTo(bx + bw, by + bh); x.fill();
    }
    g = x.createLinearGradient(0, hz, 0, by + bh); g.addColorStop(0, mix(P.bg[1], P.glow, .2)); g.addColorStop(1, '#000000'); x.fillStyle = g; x.fillRect(bx, hz, bw, by + bh - hz);
    x.save(); x.beginPath(); x.rect(bx, hz, bw, by + bh - hz); x.clip(); x.strokeStyle = P.glow; x.lineWidth = 1.5 * u;
    for (let i = -14; i <= 14; i++) { x.globalAlpha = .25; x.beginPath(); x.moveTo(bx + bw / 2 + i * bw * .02, hz); x.lineTo(bx + bw / 2 + i * bw * .2, by + bh); x.stroke(); }
    for (let i = 1; i < 10; i++) { const y = hz + (by + bh - hz) * (i / 10) ** 1.8; x.globalAlpha = .1 + .2 * i / 10; x.beginPath(); x.moveTo(bx, y); x.lineTo(bx + bw, y); x.stroke(); }
    x.restore();
    x.save(); x.globalCompositeOperation = 'screen'; g = x.createLinearGradient(0, hz - 6 * u, 0, hz + 6 * u); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, rgba(P.glow, .9)); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(bx, hz - 6 * u, bw, 12 * u); x.restore();
  };

  U.arena = (o = {}) => {
    if (d.cover && !o.noShot) {
      x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
      x.save(); x.filter = `saturate(1.5) contrast(1.22) brightness(${o.dim ?? .9})`; fill(d.cover, 0, 0, W, H); x.restore();
      x.save(); x.globalCompositeOperation = 'soft-light'; x.globalAlpha = .45; const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, P.glow); g.addColorStop(1, P.pop); x.fillStyle = g; x.fillRect(0, 0, W, H); x.restore();
    } else {
      U.scene(0, 0, W, H, o);
      if (o.dim != null) { x.fillStyle = `rgba(0,0,0,${Math.max(0, .9 - o.dim) * .8})`; x.fillRect(0, 0, W, H); }
    }
  };

  // Atmosphere
  U.fog = (y0, y1, a = .35, c) => { x.save(); x.filter = `blur(${28 * u}px)`; const col = c || mix(P.bg[0], '#ffffff', .25);
    for (let i = 0; i < 14; i++) { x.fillStyle = rgba(col, a * (.25 + r() * .4)); x.beginPath(); x.ellipse(r() * W, y0 + r() * (y1 - y0), W * (.15 + r() * .25), (y1 - y0) * (.15 + r() * .25), 0, 0, 7); x.fill(); } x.restore(); };
  U.shafts = (sx, sy, ang, spread, n = 6, c = '#ffffff', a = .22) => { x.save(); x.globalCompositeOperation = 'screen'; x.filter = `blur(${10 * u}px)`; const L = Math.hypot(W, H) * 1.1;
    for (let i = 0; i < n; i++) { const a0 = ang - spread / 2 + spread * (i + r() * .6) / n, wd = spread / n * (.25 + r() * .5); const g = x.createRadialGradient(sx, sy, 0, sx, sy, L); g.addColorStop(0, rgba(c, a * (.5 + r() * .5))); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g;
      x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + Math.cos(a0) * L, sy + Math.sin(a0) * L); x.lineTo(sx + Math.cos(a0 + wd) * L, sy + Math.sin(a0 + wd) * L); x.fill(); } x.restore(); };
  U.embers = (n = 60, c = P.pop, area = [0, 0, 1, 1]) => { x.save(); x.globalCompositeOperation = 'lighter'; const hot = mix(c, '#ffffff', .45);
    for (let i = 0; i < n; i++) { const ex = (area[0] + r() * area[2]) * W, ey = (area[1] + area[3] * (1 - r() ** 1.6)) * H, s = (1 + r() * 3.5) * u, streak = r() < .35, hc = r() < .5, al = .4 + r() * .6;
      if (w && ex > .78 * W && ey > .8 * H) continue; // keep the timestamp box clean
      x.shadowColor = c; x.shadowBlur = 10 * u; x.fillStyle = hc ? hot : c; x.globalAlpha = al;
      if (streak) { x.strokeStyle = hot; x.lineWidth = s * .7; x.beginPath(); x.moveTo(ex, ey); x.lineTo(ex - s * 4, ey + s * 7); x.stroke(); } else { x.beginPath(); x.arc(ex, ey, s, 0, 7); x.fill(); } } x.restore(); };
  U.bokeh = (n = 14, c = P.glow) => { x.save(); x.globalCompositeOperation = 'screen'; x.filter = `blur(${3 * u}px)`;
    for (let i = 0; i < n; i++) { const R = (12 + r() * 46) * u; x.globalAlpha = .06 + r() * .14; x.fillStyle = r() < .5 ? c : P.pop; x.beginPath(); x.arc(r() * W, r() * H * (w ? .78 : 1), R, 0, 7); x.fill(); } x.restore(); };
  U.speed = (cx, cy, n = 46, c = '#ffffff') => { x.save(); x.globalCompositeOperation = 'screen'; const R = Math.hypot(W, H);
    for (let i = 0; i < n; i++) { const a = r() * 6.283, r0 = Math.min(W, H) * (.32 + r() * .25), r1 = r0 + R * (.25 + r() * .5), p0 = [cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], p1 = [cx + Math.cos(a) * r1, cy + Math.sin(a) * r1];
      const g = x.createLinearGradient(...p0, ...p1); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.35, rgba(c, .3 + r() * .35)); g.addColorStop(1, 'rgba(0,0,0,0)'); x.strokeStyle = g; x.lineWidth = (1 + r() * 5) * u; x.beginPath(); x.moveTo(...p0); x.lineTo(...p1); x.stroke(); } x.restore(); };
  U.shock = (cx, cy, R, c = P.glow) => { x.save(); x.globalCompositeOperation = 'screen'; x.shadowColor = c; x.shadowBlur = 30 * u;
    [[1, 14, .7], [.72, 6, .5], [1.25, 3, .3]].forEach(([k, lw, a]) => { x.strokeStyle = rgba(mix(c, '#ffffff', .3), a); x.lineWidth = lw * u; x.beginPath(); x.ellipse(cx, cy, R * k, R * k * .92, 0, 0, 7); x.stroke(); });
    x.restore(); U.glow(cx, cy, R * .9, c, .3); };

  // Characters
  U.char = (cx, bottom, h, o = {}) => {
    U.glow(cx, bottom - h * .6, h * .55, o.halo || P.glow, o.haloA ?? .5);
    if (d.person2) return U.cutout(d.person2, cx, bottom, h, { line: P.glow, ow: 5, rim: P.glow, flip: o.flip, filter: o.filter });
    U.cutout(figure(P, o.kind || 'hero'), cx, bottom, h, { ow: 0, rim: false, flip: o.flip, filter: o.filter || 'contrast(1.08) saturate(1.15)' });
  };
  U.me = (cx, bottom, h, o = {}) => U.cutout(d.person, cx, bottom, h, { line: o.line || P.pop, ow: 8, rim: P.pop, flip: o.flip });

  // Chunky title: outer neon glow, deep extrusion, ink stroke, gradient face, top gloss. Fitted to box b.
  U.title = (text, b, o = {}) => {
    const words = String(text).toUpperCase().split(/\s+/).filter(Boolean), max = o.maxLines || 2, al = o.align || 'center';
    let size = 0, lines = [];
    for (let n = 1; n <= Math.min(max, words.length); n++) {
      const per = Math.ceil(words.length / n), L = []; for (let i = 0; i < words.length; i += per) L.push(words.slice(i, i + per));
      let sz = b.h / (L.length * .96); x.font = `${sz}px ${F}`; const wm = Math.max(...L.map((l) => x.measureText(l.join(' ')).width)) * 1.14; if (wm > b.w) sz *= b.w / wm;
      if (sz > size) { size = sz; lines = L; }
    }
    if (!lines.length) return 0;
    const glow = o.glow || P.glow, ext = size * (o.ext ?? .085), face = o.fill || P.fg, lh = size * .96;
    x.save(); x.translate(b.x + b.w / 2, b.y + b.h / 2); x.rotate(o.rot || 0); x.font = `${size}px ${F}`; x.textBaseline = 'middle'; x.textAlign = 'left'; x.lineJoin = 'round';
    const rows = lines.map((ws, i) => { const t = ws.join(' '), tw = x.measureText(t).width, y = (i - (lines.length - 1) / 2) * lh + size * .04; const sx = al === 'left' ? -b.w / 2 + ext * .2 : al === 'right' ? b.w / 2 - tw - ext * .6 : -tw / 2 - ext * .3; return { ws, t, sx, y }; });
    if (o.chroma) rows.forEach(({ t, sx, y }) => { x.globalAlpha = .85; x.fillStyle = '#ff0040'; x.fillText(t, sx - size * .06, y); x.fillStyle = '#00e5ff'; x.fillText(t, sx + size * .06, y + size * .02); x.globalAlpha = 1; });
    rows.forEach(({ t, sx, y }) => { x.save(); x.shadowColor = glow; x.shadowBlur = size * .45; x.fillStyle = rgba(glow, .75); x.fillText(t, sx + ext * .5, y + ext); x.restore(); });
    const deep = mix(glow, '#000000', .72), step = Math.max(1, ext / 16);
    rows.forEach(({ t, sx, y }) => { for (let e = ext; e > 0; e -= step) { x.fillStyle = mix(deep, P.st, e / ext * .6); x.fillText(t, sx + e * .5, y + e); } x.strokeStyle = P.st; x.lineWidth = size * .1; x.strokeText(t, sx + ext * .5, y + ext); });
    rows.forEach(({ ws, t, sx, y }, i) => {
      x.strokeStyle = P.st; x.lineWidth = size * .1; x.strokeText(t, sx, y);
      let cx = sx; ws.forEach((wd, j) => { const col = o.hi && i === rows.length - 1 && j === ws.length - 1 && ws.length + i > 1 ? o.hi : face, tw = x.measureText(wd).width;
        const g = x.createLinearGradient(0, y - size * .42, 0, y + size * .42); g.addColorStop(0, mix(col, '#ffffff', .65)); g.addColorStop(.48, col); g.addColorStop(.52, mix(col, '#000000', .12)); g.addColorStop(1, mix(col, '#000000', .42)); x.fillStyle = g; x.fillText(wd, cx, y);
        const s = x.createLinearGradient(0, y - size * .42, 0, y); s.addColorStop(0, 'rgba(255,255,255,.5)'); s.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = s; x.fillText(wd, cx, y);
        cx += tw + x.measureText(' ').width; });
    });
    x.restore(); return size;
  };
  U.chip = (t, cx, cy, s, bg = P.pop, fg = '#fff') => { x.save(); x.font = `${s}px ${F}`; const tw = x.measureText(t).width + s * .9, h = s * 1.3; x.translate(cx, cy); x.transform(1, 0, -.18, 1, 0, 0);
    x.shadowColor = bg; x.shadowBlur = 18 * u; const g = x.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, mix(bg, '#ffffff', .25)); g.addColorStop(1, mix(bg, '#000000', .3)); x.fillStyle = g; x.fillRect(-tw / 2, -h / 2, tw, h); x.shadowBlur = 0;
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 0, s * .05); x.restore(); };

  U.bolt = (x1, y1, x2, y2, c = P.glow) => { const pts = [[x1, y1]], n = 14, nx = -(y2 - y1), ny = x2 - x1, nl = Math.hypot(nx, ny);
    for (let i = 1; i < n; i++) { const t = i / n, j = (r() - .5) * 70 * u; pts.push([x1 + (x2 - x1) * t + nx / nl * j, y1 + (y2 - y1) * t + ny / nl * j]); } pts.push([x2, y2]);
    const path = () => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); };
    x.save(); x.lineJoin = 'miter'; x.lineCap = 'round'; x.globalCompositeOperation = 'screen'; x.shadowColor = c;
    for (const [col, lw, sb] of [[rgba(c, .35), 40, 60], [c, 14, 30], ['#ffffff', 5, 12]]) { x.strokeStyle = col; x.lineWidth = lw * u; x.shadowBlur = sb * u; path(); x.stroke(); }
    for (let k = 2; k < n - 1; k += 3) { const [a, b] = pts[k]; let px = a, py = b; x.lineWidth = 3 * u; x.strokeStyle = mix(c, '#ffffff', .5); x.beginPath(); x.moveTo(px, py); for (let s = 0; s < 4; s++) { px += (r() - .5) * 60 * u; py += (r() - .5) * 60 * u; x.lineTo(px, py); } x.stroke(); }
    x.restore(); };

  // Winged gold rank emblem with chevrons, star and bevel.
  U.rank = (cx, cy, s) => { U.glow(cx, cy, s * 2.4, P.glow, .55); U.shock(cx, cy, s * 1.35, P.fg);
    x.save(); x.translate(cx, cy); const gold = (y0, y1) => { const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#fff8d6'); g.addColorStop(.35, '#ffd34d'); g.addColorStop(.6, '#b07a10'); g.addColorStop(1, '#5a3800'); return g; };
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 24 * u; x.shadowOffsetY = 10 * u;
    for (const sd of [-1, 1]) for (let f = 0; f < 4; f++) { x.fillStyle = gold(-s * .6, s * .6); x.beginPath(); x.moveTo(sd * s * .6, -s * .3 + f * s * .2); x.lineTo(sd * s * (1.75 - f * .22), -s * .7 + f * s * .32); x.lineTo(sd * s * (1.5 - f * .22), -s * .45 + f * s * .32); x.lineTo(sd * s * .6, -s * .05 + f * s * .2); x.fill(); x.strokeStyle = 'rgba(60,30,0,.7)'; x.lineWidth = 2 * u; x.stroke(); }
    const hex = (k) => { x.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; x.lineTo(Math.cos(a) * s * k, Math.sin(a) * s * k); } x.closePath(); };
    x.fillStyle = gold(-s, s); hex(1); x.fill(); x.shadowColor = 'transparent'; x.shadowOffsetY = 0;
    x.strokeStyle = '#fff4c0'; x.lineWidth = 5 * u; x.stroke();
    const ig = x.createLinearGradient(0, -s, 0, s); ig.addColorStop(0, mix(P.bg[1], P.glow, .35)); ig.addColorStop(1, P.bg[1]); x.fillStyle = ig; hex(.8); x.fill(); x.strokeStyle = '#7a5200'; x.lineWidth = 4 * u; x.stroke();
    x.shadowColor = '#ffd34d'; x.shadowBlur = 20 * u; x.fillStyle = gold(-s * .5, s * .6);
    for (let i = 0; i < 3; i++) { const y = -s * .28 + i * s * .26; x.beginPath(); x.moveTo(-s * .45, y); x.lineTo(0, y + s * .2); x.lineTo(s * .45, y); x.lineTo(s * .45, y + s * .12); x.lineTo(0, y + s * .32); x.lineTo(-s * .45, y + s * .12); x.fill(); }
    x.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? s * .12 : s * .3, a = -Math.PI / 2 + i * Math.PI / 5; x.lineTo(Math.cos(a) * rr, -s * 1.12 + Math.sin(a) * rr); } x.fill();
    x.restore(); };

  U.glitch = (n = 14) => { for (let i = 0; i < n; i++) { const y = r() * H, h = (6 + r() * 30) * u, dx = (r() - .5) * 60 * u; x.drawImage(x.canvas, 0, y, W, h, dx, y, W, h); }
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = .45; for (let i = 0; i < 6; i++) { x.fillStyle = i % 2 ? '#ff0040' : '#00e5ff'; x.fillRect(0, r() * H, W, (2 + r() * 5) * u); } x.restore();
    x.save(); x.globalAlpha = .12; x.fillStyle = '#000'; for (let y = 0; y < H; y += 4 * u) x.fillRect(0, y, W, 1.5 * u); x.restore(); };

  U.burst = (txt, cx, cy, s) => { U.glow(cx, cy, s * 1.6, P.pop, .5); x.save(); x.translate(cx, cy); x.rotate(-.15); x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 24 * u; x.shadowOffsetY = 8 * u;
    const g = x.createRadialGradient(0, -s * .3, 0, 0, 0, s); g.addColorStop(0, mix(P.pop, '#ffffff', .35)); g.addColorStop(1, mix(P.pop, '#000000', .35)); x.fillStyle = g; x.beginPath();
    for (let i = 0; i < 32; i++) { const rr = i % 2 ? s * .74 : s; const a = i * Math.PI / 16; x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } x.closePath(); x.fill(); x.shadowColor = 'transparent'; x.strokeStyle = '#fff'; x.lineWidth = 6 * u; x.stroke();
    x.restore(); U.title(txt, { x: cx - s * .62, y: cy - s * .4, w: s * 1.24, h: s * .8 }, { rot: -.15, fill: '#ffffff', glow: P.pop, ext: .07 }); };

  U.facecam = (cx, cy, rad) => { U.glow(cx, cy, rad * 1.7, P.pop, .55); x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 30 * u;
    const g = x.createRadialGradient(cx, cy - rad * .3, 0, cx, cy, rad); g.addColorStop(0, mix(P.bg[0], P.pop, .3)); g.addColorStop(1, P.bg[1]); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.fill(); x.shadowColor = 'transparent'; x.clip();
    U.cutout(d.person, cx, cy + rad * 1.05, rad * 2.1, { ow: 0, rim: P.pop }); x.restore();
    x.save(); x.shadowColor = P.pop; x.shadowBlur = 24 * u; const rg = x.createLinearGradient(cx - rad, cy - rad, cx + rad, cy + rad); rg.addColorStop(0, mix(P.pop, '#ffffff', .4)); rg.addColorStop(1, mix(P.pop, '#000000', .3)); x.strokeStyle = rg; x.lineWidth = 12 * u; x.beginPath(); x.arc(cx, cy, rad, 0, 7); x.stroke(); x.shadowBlur = 0; x.strokeStyle = '#fff'; x.lineWidth = 3 * u; x.beginPath(); x.arc(cx, cy, rad - 7 * u, 0, 7); x.stroke(); x.restore();
    U.chip('LIVE', cx, cy + rad, 20 * u, '#e0102a'); };

  // HUD stat row: icon, label, segmented bar.
  U.stat = (label, val, bx, by, wd, icon) => { const h = 44 * u; x.save(); const g = x.createLinearGradient(bx, 0, bx + wd, 0); g.addColorStop(0, 'rgba(0,0,0,.75)'); g.addColorStop(1, 'rgba(0,0,0,.35)'); x.fillStyle = g; x.beginPath(); x.roundRect(bx, by, wd, h, 6 * u); x.fill();
    x.fillStyle = P.pop; x.fillRect(bx, by, 4 * u, h); const ix = bx + 26 * u, iy = by + h / 2; x.strokeStyle = '#fff'; x.fillStyle = '#fff'; x.lineWidth = 3 * u; x.shadowColor = P.glow; x.shadowBlur = 10 * u;
    if (icon === 0) { x.beginPath(); x.arc(ix, iy, 11 * u, 0, 7); x.stroke(); x.beginPath(); x.moveTo(ix - 16 * u, iy); x.lineTo(ix + 16 * u, iy); x.moveTo(ix, iy - 16 * u); x.lineTo(ix, iy + 16 * u); x.stroke(); }
    else if (icon === 1) { x.beginPath(); x.moveTo(ix + 4 * u, iy - 16 * u); x.lineTo(ix - 9 * u, iy + 2 * u); x.lineTo(ix, iy + 2 * u); x.lineTo(ix - 4 * u, iy + 16 * u); x.lineTo(ix + 9 * u, iy - 2 * u); x.lineTo(ix, iy - 2 * u); x.closePath(); x.fill(); }
    else { for (let k = 0; k < 3; k++) { x.beginPath(); x.moveTo(ix - 12 * u + k * 8 * u, iy - 12 * u); x.lineTo(ix - 4 * u + k * 8 * u, iy); x.lineTo(ix - 12 * u + k * 8 * u, iy + 12 * u); x.stroke(); } }
    x.shadowBlur = 0; x.font = `${h * .5}px ${F}`; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(label, bx + 50 * u, iy);
    const n = 10, bw = wd * .46, sx = bx + wd - bw - 12 * u, sw = bw / n; for (let i = 0; i < n; i++) { const on = i < Math.round(val * n); x.fillStyle = on ? (i >= n - 2 ? '#ffffff' : P.pop) : 'rgba(255,255,255,.14)'; if (on) { x.shadowColor = P.pop; x.shadowBlur = 10 * u; } x.fillRect(sx + i * sw, iy - h * .17, sw * .78, h * .34); x.shadowBlur = 0; }
    x.restore(); };

  // Procedural rifle, centred at cx,cy, length L, rotated.
  U.gun = (cx, cy, L, rot) => { const k = L / 120; x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(k, k);
    const metal = (y0, y1) => { const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#aab3c2'); g.addColorStop(.25, '#4a505c'); g.addColorStop(.7, '#1d2027'); g.addColorStop(1, '#0a0b0e'); return g; };
    const P2 = (pts, y0, y1) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fillStyle = metal(y0, y1); x.fill(); x.lineWidth = .6; x.strokeStyle = 'rgba(255,255,255,.3)'; x.stroke(); };
    x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 30 * u / k; x.shadowOffsetY = 10 * u / k;
    P2([[-56, -4], [-32, -7], [-32, 6], [-52, 13], [-58, 11]], -7, 13); x.shadowColor = 'transparent'; x.shadowOffsetY = 0;
    P2([[-33, -8], [24, -8], [26, 5], [-33, 5]], -8, 5);
    P2([[24, -6], [46, -6], [46, 3], [24, 3]], -6, 3); P2([[46, -3.2], [60, -3.2], [60, .5], [46, .5]], -3, .5); P2([[60, -4], [64, -4], [64, 1.5], [60, 1.5]], -4, 1.5);
    P2([[-2, 5], [8, 5], [12, 24], [3, 25]], 5, 25); P2([[-22, 5], [-14, 5], [-17, 19], [-25, 18]], 5, 19);
    P2([[-14, -14], [12, -14], [12, -9], [-14, -9]], -14, -9); P2([[-16, -16], [-12, -16], [-12, -8], [-16, -8]], -16, -8); P2([[10, -17], [16, -17], [16, -7], [10, -7]], -17, -7);
    x.fillStyle = P.glow; x.shadowColor = P.glow; x.shadowBlur = 20; x.beginPath(); x.ellipse(16, -12, 1.2, 4, 0, 0, 7); x.fill();
    x.fillRect(-30, -1.5, 52, 1.6); x.fillStyle = P.pop; x.shadowColor = P.pop; x.fillRect(26, -4.5, 18, 1.2);
    x.shadowBlur = 0; x.strokeStyle = 'rgba(0,0,0,.5)'; x.lineWidth = .5; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(27 + i * 3, -6); x.lineTo(27 + i * 3, 3); x.stroke(); }
    x.restore(); };

  // Neon-framed tile; procedural mini-scene when empty.
  U.tile = (img, b, rot, label, o = {}) => { x.save(); x.translate(b.x + b.w / 2, b.y + b.h / 2); x.rotate(rot); const L = -b.w / 2, T = -b.h / 2, rr = 12 * u;
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 34 * u; x.shadowOffsetY = 14 * u; x.fillStyle = '#000'; x.beginPath(); x.roundRect(L, T, b.w, b.h, rr); x.fill(); x.shadowColor = 'transparent'; x.shadowOffsetY = 0;
    x.save(); x.clip(); if (img && !o.logo) { x.filter = 'saturate(1.4) contrast(1.15)'; fill(img, L, T, b.w, b.h); x.filter = 'none'; } else { U.scene(L, T, b.w, b.h, { hz: .62, sun: .3 + r() * .4 }); if (o.logo) img ? contain(img, L + b.w * .1, T + b.h * .1, b.w * .8, b.h * .8) : U.rank(0, b.h * .06, Math.min(b.w, b.h) * .2); }
    const gl = x.createLinearGradient(L, T, L + b.w * .6, T + b.h * .6); gl.addColorStop(0, 'rgba(255,255,255,.18)'); gl.addColorStop(.5, 'rgba(255,255,255,0)'); x.fillStyle = gl; x.fillRect(L, T, b.w, b.h); x.restore();
    x.shadowColor = P.glow; x.shadowBlur = 22 * u; x.strokeStyle = P.glow; x.lineWidth = 5 * u; x.beginPath(); x.roundRect(L, T, b.w, b.h, rr); x.stroke(); x.shadowBlur = 0; x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 1.5 * u; x.stroke();
    x.restore(); if (label) U.chip(label, b.x + b.w / 2, b.y + b.h - 4 * u, Math.min(30 * u, b.h * .1)); };

  U.end = (o = {}) => { U.grade({ bloom: o.bloom ?? .28, tone: .26, warm: o.warm }); U.finish({ vig: o.vig ?? .55, grain: .045 }); };
  return U;
}

const G = (name, draw) => ({ name, niche: 'gaming', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) { draw(x, W, H, d, game(x, W, H, d, K, P), K.wide, P); } });
const big = (d) => d.big || d.title || 'GAME OVER';
const two = (d) => big(d).split(/\s+/).slice(0, 2).join(' ');

export default [
  G('FACE + BOSS', (x, W, H, d, U, w, P) => {
    U.arena({ dim: .55, sun: w ? .6 : .5 });
    if (w) {
      U.shafts(.6 * W, -.1 * H, Math.PI / 2, 1.1, 7, P.pop, .28); U.fog(.55 * H, .95 * H, .45);
      U.char(.6 * W, .84 * H, .86 * H, { kind: 'boss', halo: P.pop, haloA: .6 }); U.embers(70, P.pop, [.35, .1, .6, .7]);
      U.fade('left', .5, 'rgba(0,0,0,.6)'); U.me(.18 * W, H * 1.02, .72 * H);
      U.title(two(d), U.box([.03, .04, .44, .26]), { align: 'left', hi: P.pop });
    } else {
      U.shafts(.5 * W, 0, Math.PI / 2, 1, 6, P.pop, .28); U.fog(.4 * H, .7 * H, .45);
      U.char(.58 * W, .6 * H, .44 * H, { kind: 'boss', halo: P.pop, haloA: .6 }); U.embers(70, P.pop, [.1, .2, .8, .5]);
      U.fade('bottom', .4, 'rgba(0,0,0,.7)'); U.me(.32 * W, .78 * H, .3 * H);
      U.title(two(d), U.box([.06, .08, .76, .14]), { hi: P.pop });
    }
    U.end();
  }),
  G('RIM-LIT HERO', (x, W, H, d, U, w, P) => {
    U.arena({ dim: .5, sun: w ? .3 : .5, hz: .7 });
    const cx = w ? .32 * W : .5 * W, cy = w ? .5 * H : .4 * H;
    U.shafts(cx, cy - .3 * H, Math.PI / 2, 2.4, 10, P.glow, .3); U.speed(cx, cy, 50, P.glow); U.bokeh(16);
    U.glow(cx, cy, w ? .7 * H : .45 * H, '#ffffff', .22);
    if (w) { U.char(cx, H * 1.02, H * .98); U.fog(.82 * H, H, .4); U.title(big(d), U.box([.54, .12, .43, .62]), { maxLines: 3, hi: P.pop }); }
    else { U.char(cx, .78 * H, .56 * H); U.fog(.72 * H, .85 * H, .45); U.title(big(d), U.box([.06, .08, .76, .16]), { hi: P.pop, maxLines: 3 }); }
    U.embers(40, P.glow);
    U.end();
  }),
  G('VERSUS SCREEN', (x, W, H, d, U, w, P) => {
    U.arena({ noShot: true, dim: .4 });
    x.save(); x.globalCompositeOperation = 'screen';
    for (const [c, side] of [[P.pop, 0], [P.glow, 1]]) { const g = w ? x.createLinearGradient(side ? W : 0, 0, W / 2, 0) : x.createLinearGradient(0, side ? H : 0, 0, H / 2); g.addColorStop(0, rgba(c, .75)); g.addColorStop(1, rgba(c, .05)); x.fillStyle = g; x.beginPath();
      const q = w ? (side ? [[.56, 0], [1, 0], [1, 1], [.44, 1]] : [[0, 0], [.56, 0], [.44, 1], [0, 1]]) : (side ? [[0, .55], [1, .45], [1, 1], [0, 1]] : [[0, 0], [1, 0], [1, .45], [0, .55]]);
      q.forEach(([a, b], i) => i ? x.lineTo(a * W, b * H) : x.moveTo(a * W, b * H)); x.fill(); }
    x.restore();
    if (w) {
      U.speed(.25 * W, .5 * H, 24, P.pop); U.speed(.75 * W, .5 * H, 24, P.glow);
      U.me(.24 * W, H * 1.02, .84 * H); U.char(.7 * W, .82 * H, .8 * H, { flip: true });
      U.shock(.5 * W, .5 * H, .2 * H); U.bolt(.56 * W, -.02 * H, .44 * W, 1.02 * H); U.embers(50, '#ffffff', [.3, 0, .4, 1]);
      U.title('VS', U.box([.4, .36, .2, .26]), { fill: '#ffffff', glow: P.pop, ext: .12 }); U.title(two(d), U.box([.03, .03, .4, .16]), { align: 'left' });
    } else {
      U.me(.38 * W, .45 * H, .26 * H); U.char(.6 * W, .8 * H, .34 * H, { flip: true });
      U.shock(.5 * W, .5 * H, .14 * W); U.bolt(-.02 * W, .56 * H, 1.02 * W, .44 * H); U.embers(50, '#ffffff', [0, .4, 1, .2]);
      U.title('VS', U.box([.3, .44, .4, .12]), { fill: '#ffffff', glow: P.pop, ext: .12 }); U.title(two(d), U.box([.06, .08, .76, .09]));
    }
    U.end();
  }),
  G('RANK UP', (x, W, H, d, U, w, P) => {
    U.arena({ dim: .5, sun: .8 });
    if (w) { U.shafts(.82 * W, .17 * H, Math.PI * .85, 1.4, 8, '#ffd34d', .25); U.rank(.82 * W, .2 * H, .12 * H); U.embers(60, '#ffd34d', [.55, 0, .45, .6]);
      U.me(.2 * W, H * 1.02, .84 * H); U.chip('RANK UP', .58 * W, .4 * H, 34 * U.u); U.title(big(d), U.box([.38, .45, .41, .36]), { hi: P.pop }); }
    else { U.shafts(.5 * W, .2 * H, Math.PI / 2, 2.2, 8, '#ffd34d', .25); U.rank(.62 * W, .19 * H, .065 * H); U.embers(60, '#ffd34d', [0, 0, 1, .5]);
      U.me(.42 * W, .78 * H, .36 * H); U.chip('RANK UP', .44 * W, .33 * H, 46 * U.u); U.title(big(d), U.box([.06, .36, .76, .13]), { hi: P.pop, maxLines: 3 }); }
    U.fog(w ? .85 * H : .75 * H, H, .35);
    U.end();
  }),
  G('LOADOUT', (x, W, H, d, U, w, P) => {
    U.arena({ dim: .35, hz: .75 });
    U.shafts(w ? .4 * W : .5 * W, -.2 * H, Math.PI / 2, .9, 6, '#ffffff', .2); U.bokeh(18);
    const gx = w ? .34 * W : .45 * W, gy = w ? .4 * H : .32 * H, L = w ? .6 * W : .9 * W, rot = -.38;
    U.glow(gx, gy, L * .45, P.glow, .45); U.speed(gx, gy, 30, P.glow);
    if (d.item) U.prop(d.item, gx, gy + L * .2, L * .4, { rot, rim: P.glow }); else U.gun(gx, gy, L, rot);
    U.embers(40, P.pop, w ? [.05, .1, .6, .55] : [.05, .1, .9, .35]);
    const sb = U.box(w ? [.66, .16, .31, .4] : [.08, .5, .74, .18]);
    [['DMG', .92], ['RANGE', .7], ['FIRE RATE', .84]].forEach(([l, v], i) => U.stat(l, v, sb.x, sb.y + i * sb.h / 3, sb.w, i));
    const by = w ? .64 * H : .71 * H, bh = w ? .17 * H : .08 * H, bw = w ? .78 * W : W, g = x.createLinearGradient(0, by, 0, by + bh); g.addColorStop(0, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
    x.fillStyle = g; x.fillRect(0, by, bw, bh); x.fillStyle = P.pop; x.shadowColor = P.pop; x.shadowBlur = 16 * U.u; x.fillRect(0, by, bw, 4 * U.u); x.shadowBlur = 0;
    U.title(big(d), U.box(w ? [.03, .645, .72, .16] : [.06, .715, .76, .07]), { align: w ? 'left' : 'center', hi: P.pop });
    U.end();
  }),
  G('SECRET FOUND', (x, W, H, d, U, w, P) => {
    U.arena({ dim: .7, sun: .7 });
    const tx = w ? .64 * W : .58 * W, ty = w ? .5 * H : .4 * H, R = w ? .13 * H : .12 * W;
    if (!d.cover) { U.glow(tx, ty, R * 2, '#ffd34d', .6); x.save(); x.translate(tx, ty); const s = R * .6; const g = x.createLinearGradient(0, -s, 0, s); g.addColorStop(0, '#ffe08a'); g.addColorStop(1, '#6b3a00'); x.fillStyle = g; x.shadowColor = '#ffd34d'; x.shadowBlur = 30 * U.u; x.beginPath(); x.roundRect(-s, -s * .4, s * 2, s * 1.1, 6 * U.u); x.fill(); x.beginPath(); x.ellipse(0, -s * .4, s, s * .55, 0, Math.PI, 0); x.fill(); x.strokeStyle = '#3a1f00'; x.lineWidth = 3 * U.u; x.beginPath(); x.moveTo(-s, -s * .4); x.lineTo(s, -s * .4); x.stroke(); x.fillStyle = '#fff'; x.fillRect(-s * .12, -s * .5, s * .24, s * .4); x.restore(); }
    U.glitch(); U.embers(30, '#ffd34d', [(tx / W) - .15, (ty / H) - .2, .3, .4]);
    x.save(); x.shadowColor = P.pop; x.shadowBlur = 30 * U.u; U.ring(tx, ty, R, P.pop); x.restore();
    U.arrow(w ? .42 * W : .2 * W, w ? .3 * H : .27 * H, tx - R * 1.1, ty - R * .5, { color: P.pop });
    U.title('SECRET?', U.box(w ? [.03, .04, .4, .22] : [.06, .08, .76, .12]), { align: w ? 'left' : 'center', chroma: true, fill: '#ffffff', glow: P.pop });
    w ? U.facecam(.15 * W, .72 * H, .18 * H) : U.facecam(.3 * W, .66 * H, .16 * W);
    U.end();
  }),
  G('SCREENSHOT + FACECAM', (x, W, H, d, U, w, P) => {
    U.arena({ dim: 1, sun: .55 });
    const cx = w ? .6 * W : .58 * W, cy = w ? .5 * H : .45 * H;
    if (!d.cover) { U.fog(.45 * H, .75 * H, .3); U.char(cx, w ? .8 * H : .55 * H, w ? .45 * H : .2 * H, { kind: 'boss', halo: P.pop }); U.embers(40, P.pop); }
    x.save(); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 3 * U.u; x.shadowColor = '#000'; x.shadowBlur = 6 * U.u;
    for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { x.beginPath(); x.moveTo(cx + a * 10 * U.u, cy + b * 10 * U.u); x.lineTo(cx + a * 28 * U.u, cy + b * 28 * U.u); x.stroke(); } x.restore();
    U.title('-999', { x: cx + 30 * U.u, y: cy - 110 * U.u, w: 150 * U.u, h: 64 * U.u }, { fill: P.fg, glow: P.pop, rot: .12, ext: .05 });
    const hb = U.box(w ? [.3, .9, .4, .028] : [.18, .76, .6, .012]);
    x.fillStyle = 'rgba(0,0,0,.6)'; x.fillRect(hb.x - 4, hb.y - 4, hb.w + 8, hb.h + 8); x.fillStyle = P.pop; x.shadowColor = P.pop; x.shadowBlur = 12 * U.u; x.fillRect(hb.x, hb.y, hb.w * .18, hb.h); x.shadowBlur = 0;
    U.fade('top', .35, 'rgba(0,0,0,.7)');
    w ? U.facecam(.14 * W, .78 * H, .14 * H) : U.facecam(.25 * W, .62 * H, .17 * W);
    U.title(big(d), U.box(w ? [.04, .04, .74, .24] : [.06, .08, .76, .14]), { hi: P.pop });
    U.end({ vig: .4 });
  }),
  G('GIANT NUMBER', (x, W, H, d, U, w, P) => {
    U.arena({ dim: .45, sun: w ? .7 : .5 });
    U.shafts(w ? .72 * W : .5 * W, -.1 * H, Math.PI / 2, 1, 7, P.glow, .25);
    if (w) { U.char(.7 * W, .82 * H, .8 * H); U.fog(.7 * H, H, .4); U.shock(.3 * W, .38 * H, .32 * H, P.pop); U.speed(.3 * W, .38 * H, 30, P.pop);
      U.title(U.num('LVL 1'), U.box([.03, .1, .56, .52]), { hi: P.pop, ext: .1 }); U.title(U.rest(), U.box([.06, .64, .5, .16]), { fill: '#ffffff' }); }
    else { U.char(.5 * W, .78 * H, .42 * H); U.fog(.65 * H, .85 * H, .4); U.shock(.44 * W, .2 * H, .3 * W, P.pop);
      U.title(U.num('LVL 1'), U.box([.06, .1, .76, .2]), { ext: .1 }); U.title(U.rest(), U.box([.06, .31, .76, .07]), { fill: '#ffffff' }); }
    U.embers(50, P.pop);
    U.end();
  }),
  G('HORROR PEEK', (x, W, H, d, U, w, P) => {
    const ex = w ? .65 * W : .5 * W, vy = w ? .42 * H : .4 * H;
    U.arena({ dim: .25 });
    if (!d.cover) { // receding corridor with door frames
      x.fillStyle = '#030304'; x.fillRect(0, 0, W, H);
      for (let i = 0; i < 9; i++) { const t = (1 - i / 9) ** 2.2, fw = W * (.08 + t * 1.3), fh = H * (.12 + t * 1.6), c = Math.round(8 + 22 * (1 - t));
        x.strokeStyle = `rgba(${c + 30},${c + 30},${c + 34},${.25 + .5 * t})`; x.lineWidth = (2 + 18 * t) * U.u; x.strokeRect(ex - fw / 2, vy - fh * .45, fw, fh); }
      const g = x.createLinearGradient(0, vy, 0, H); g.addColorStop(0, 'rgba(30,32,36,0)'); g.addColorStop(1, 'rgba(40,42,48,.6)'); x.fillStyle = g; x.beginPath(); x.moveTo(ex - .04 * W, vy + .05 * H); x.lineTo(ex + .04 * W, vy + .05 * H); x.lineTo(W * 1.2, H); x.lineTo(-W * .2, H); x.fill();
      U.glow(ex, vy - .1 * H, .1 * H, P.pop, .25);
    }
    const lx = w ? .2 * W : .3 * W, ly = w ? H : .85 * H;
    x.save(); x.globalCompositeOperation = 'screen'; x.filter = `blur(${14 * U.u}px)`; const a = Math.atan2(vy - ly, ex - lx), L = Math.hypot(ex - lx, vy - ly) * 1.25, sp = .2;
    const cg = x.createRadialGradient(lx, ly, 0, lx, ly, L); cg.addColorStop(0, 'rgba(255,240,205,.55)'); cg.addColorStop(1, 'rgba(255,240,205,.03)'); x.fillStyle = cg;
    x.beginPath(); x.moveTo(lx, ly); x.lineTo(lx + Math.cos(a - sp) * L, ly + Math.sin(a - sp) * L); x.lineTo(lx + Math.cos(a + sp) * L, ly + Math.sin(a + sp) * L); x.fill(); x.restore();
    U.glow(ex, vy + .05 * H, .3 * H, '#fff1cc', .3);
    U.char(ex, w ? .86 * H : .58 * H, w ? .66 * H : .3 * H, { kind: 'creature', halo: '#000000', haloA: .5, filter: 'brightness(.85) contrast(1.2)' });
    U.fog(w ? .55 * H : .45 * H, w ? H : .7 * H, .3, '#8a9096'); U.embers(40, '#fff1cc', [lx / W, .2, w ? .5 : .6, .6]);
    U.fade('bottom', .3, 'rgba(0,0,0,.8)'); U.me(w ? .17 * W : .3 * W, w ? H * 1.02 : .78 * H, w ? .62 * H : .28 * H);
    U.title(two(d), U.box(w ? [.03, .04, .44, .24] : [.06, .08, .76, .12]), { align: w ? 'left' : 'center', fill: '#e8ece9', glow: P.pop, hi: P.pop });
    U.end({ vig: .8, bloom: .35 });
  }),
  G('UPDATE BURST', (x, W, H, d, U, w, P) => {
    U.arena({ dim: .4 }); U.shafts(.5 * W, -.1 * H, Math.PI / 2, 1.6, 8, P.glow, .22); U.speed(w ? .4 * W : .5 * W, w ? .45 * H : .4 * H, 40, P.glow); U.bokeh(16);
    const t = w ? [[.25, .06, .28, .36], [.04, .47, .28, .32], [.37, .47, .28, .32]] : [[.22, .2, .5, .19], [.06, .43, .38, .16], [.47, .43, .38, .16]];
    t.forEach((b, i) => U.tile(i ? d.cover : d.item, U.box(b), (i - 1) * .05, ['', 'NEW MAP', 'NEW ITEM'][i], { logo: i === 0 }));
    U.burst('NEW', w ? .1 * W : .2 * W, w ? .17 * H : .14 * H, w ? .13 * H : .12 * W);
    U.embers(50, P.pop);
    U.title(big(d), U.box(w ? [.67, .06, .31, .7] : [.06, .64, .76, .12]), { maxLines: w ? 4 : 3, hi: P.pop });
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

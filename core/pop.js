// "Loud" kit for high-CTR styles: outlined cut-outs, huge stroked words, rays, arrows, rings, badges.
// Use: const U = pop(x, W, H, d, K, P). Boxes are fractions [x, y, w, h] of the frame.
const F = 'Anton, Impact, "Arial Narrow", sans-serif';
export const TYPE = '"Courier New", Courier, monospace';

export function pop(x, W, H, d, K, P) {
  const u = Math.min(W, H) / 720, U = { u };
  U.box = ([bx, by, bw, bh]) => ({ x: bx * W, y: by * H, w: bw * W, h: bh * H });
  U.z = (wide, tall) => K.wide ? wide : tall;

  const fill = (img, bx, by, bw, bh) => {
    const s = Math.max(bw / img.width, bh / img.height), w = img.width * s, h = img.height * s;
    x.drawImage(img, bx + (bw - w) / 2, by + (bh - h) / 2, w, h);
  };
  const ph = (bx, by, bw, bh, label = 'IMAGE') => {
    const g = x.createLinearGradient(bx, by, bx + bw, by + bh);
    g.addColorStop(0, P.pop); g.addColorStop(1, P.bg[1]);
    x.fillStyle = g; x.fillRect(bx, by, bw, bh);
    x.fillStyle = 'rgba(255,255,255,.35)'; x.font = `${Math.min(bw, bh) * .16}px ${F}`;
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(label, bx + bw / 2, by + bh / 2);
  };

  U.rays = (cx, cy, n = 20, a = .16) => {
    const R = Math.hypot(W, H); x.save(); x.fillStyle = `rgba(255,255,255,${a})`;
    for (let i = 0; i < n; i++) { const a0 = i * 2 * Math.PI / n; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, R, a0, a0 + Math.PI / n); x.fill(); }
    x.restore();
  };

  // grad | rays | photo | split
  U.bg = (kind = 'grad') => {
    if (kind === 'photo' && d.cover) {
      x.save(); x.filter = 'saturate(1.45) contrast(1.1)'; fill(d.cover, 0, 0, W, H); x.restore();
      const g = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .4, W / 2, H / 2, Math.hypot(W, H) * .6);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      return;
    }
    const g = x.createRadialGradient(W * .5, H * .45, 0, W * .5, H * .45, Math.hypot(W, H) * .6);
    g.addColorStop(0, P.bg[0]); g.addColorStop(1, P.bg[1]); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (d.cover && kind !== 'flat') { // faded, blurred photo blended into the colour
      x.save(); x.globalAlpha = .38; x.globalCompositeOperation = 'luminosity'; x.filter = `blur(${10 * u}px)`;
      fill(d.cover, -20 * u, -20 * u, W + 40 * u, H + 40 * u); x.restore();
    }
    if (kind === 'rays') U.rays(W / 2, H * .5);
    if (kind === 'split') {
      x.fillStyle = P.pop; x.beginPath();
      if (K.wide) { x.moveTo(W * .54, 0); x.lineTo(W, 0); x.lineTo(W, H); x.lineTo(W * .46, H); }
      else { x.moveTo(0, H * .52); x.lineTo(W, H * .48); x.lineTo(W, H); x.lineTo(0, H); }
      x.fill();
    }
  };

  // Image in a rounded box with white border. opts: rot, gray, r, label
  U.imgBox = (img, b, o = {}) => {
    const r = (o.r ?? 18) * u;
    x.save(); x.translate(b.x + b.w / 2, b.y + b.h / 2); x.rotate(o.rot || 0);
    x.shadowColor = 'rgba(0,0,0,.55)'; x.shadowBlur = 30 * u; x.shadowOffsetY = 12 * u;
    x.beginPath(); x.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, r); x.fillStyle = '#000'; x.fill();
    x.shadowColor = 'transparent'; x.save(); x.clip();
    if (o.gray) x.filter = 'grayscale(1) brightness(.8)'; else if (img) x.filter = 'saturate(1.35) contrast(1.08)';
    img ? fill(img, -b.w / 2, -b.h / 2, b.w, b.h) : ph(-b.w / 2, -b.h / 2, b.w, b.h, o.label);
    x.restore();
    x.strokeStyle = '#fff'; x.lineWidth = 8 * u; x.beginPath(); x.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, r); x.stroke();
    x.restore();
  };

  // Placeholder "shocked face" so layouts read before a real cut-out is added.
  const face = () => {
    const c = document.createElement('canvas'); c.width = 600; c.height = 800; const g = c.getContext('2d');
    g.fillStyle = P.pop; g.beginPath(); g.roundRect(40, 560, 520, 300, 120); g.fill();
    g.fillStyle = '#e9b48f'; g.fillRect(250, 470, 100, 110);
    g.beginPath(); g.ellipse(300, 310, 185, 215, 0, 0, 7); g.fill();
    g.fillStyle = '#2b1a10'; g.beginPath(); g.ellipse(300, 170, 190, 110, 0, Math.PI, 0); g.fill();
    for (const ex of [228, 372]) { g.fillStyle = '#fff'; g.beginPath(); g.arc(ex, 300, 40, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(ex, 305, 17, 0, 7); g.fill(); }
    g.strokeStyle = '#2b1a10'; g.lineWidth = 14; g.lineCap = 'round';
    g.beginPath(); g.moveTo(185, 225); g.lineTo(265, 212); g.moveTo(335, 212); g.lineTo(415, 225); g.stroke();
    g.fillStyle = '#5a1010'; g.beginPath(); g.ellipse(300, 430, 58, 66, 0, 0, 7); g.fill();
    return c;
  };

  // Cut-out (person or prop) with thick white outline, anchored bottom-centre.
  U.cutout = (img, cx, bottom, h, o = {}) => {
    const src = img || face(), w = h * src.width / src.height, ow = (o.ow ?? 9) * u, p = ow * 2;
    const oc = document.createElement('canvas'); oc.width = w + p * 2; oc.height = h + p * 2;
    const g = oc.getContext('2d');
    if (o.flip) { g.translate(oc.width, 0); g.scale(-1, 1); }
    g.drawImage(src, p, p, w, h); g.setTransform(1, 0, 0, 1, 0, 0);
    const sil = document.createElement('canvas'); sil.width = oc.width; sil.height = oc.height;
    const s = sil.getContext('2d'); s.drawImage(oc, 0, 0); s.globalCompositeOperation = 'source-in'; s.fillStyle = o.line || '#fff'; s.fillRect(0, 0, sil.width, sil.height);
    const X = cx - oc.width / 2, Y = bottom - h - p;
    if (o.rim !== false) U.glow(cx, bottom - h * .55, h * .62, o.rim || P.pop, .55);
    x.save(); x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 40 * u; x.shadowOffsetY = 14 * u;
    if (ow > 0 || o.shadow !== false) x.drawImage(ow > 0 ? sil : oc, X, Y); x.restore();
    if (ow > 0) for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; x.drawImage(sil, X + Math.cos(a) * ow, Y + Math.sin(a) * ow); }
    x.save(); x.filter = o.filter || 'brightness(1.06) saturate(1.2) contrast(1.05)'; x.drawImage(oc, X, Y); x.restore();
  };

  // Huge stroked words fitted into box b (1..maxLines lines). opts: align, fill, stroke, rot, maxLines, plate
  U.words = (text, b, o = {}) => {
    const words = String(text).split(/\s+/).filter(Boolean), max = o.maxLines || 2, al = o.align || 'center';
    let size = 0, lines = [];
    for (let n = 1; n <= Math.min(max, words.length); n++) {
      const per = Math.ceil(words.length / n), L = [];
      for (let i = 0; i < words.length; i += per) L.push(words.slice(i, i + per).join(' '));
      let sz = b.h / (L.length * .98); x.font = `${o.weight || ''} ${sz}px ${o.font || F}`;
      const wMax = Math.max(...L.map((l) => x.measureText(l).width)) * 1.1; if (wMax > b.w) sz *= b.w / wMax;
      if (sz > size) { size = sz; lines = L; }
    }
    x.save(); x.translate(b.x + b.w / 2, b.y + b.h / 2); x.rotate(o.rot || 0);
    x.font = `${o.weight || ''} ${size}px ${o.font || F}`; x.textAlign = al; x.textBaseline = 'middle'; x.lineJoin = 'round';
    const ax = al === 'left' ? -b.w / 2 + size * .06 : al === 'right' ? b.w / 2 - size * .06 : 0, lh = size * .98;
    if (o.plate) {
      const tw = Math.max(...lines.map((l) => x.measureText(l).width)), ph2 = lines.length * lh + size * .2, px = size * .25;
      const left = al === 'left' ? ax - px : al === 'right' ? ax - tw - px : -tw / 2 - px;
      x.fillStyle = o.plate; x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 20 * u; x.shadowOffsetY = 8 * u;
      x.beginPath(); x.roundRect(left, -ph2 / 2, tw + px * 2, ph2, 10 * u); x.fill(); x.shadowColor = 'transparent';
    }
    lines.forEach((l, i) => {
      const y = (i - (lines.length - 1) / 2) * lh + size * .04;
      if (o.ext) { x.fillStyle = o.extC || P.st; for (let e = o.ext; e > 0; e -= 1) x.fillText(l, ax + e * u * .6, y + e * u); }
      if (o.glow) { x.save(); x.shadowColor = o.glow; x.shadowBlur = size * .25; x.fillStyle = o.glow; x.fillText(l, ax, y); x.restore(); }
      if (!o.plate) {
        x.strokeStyle = o.stroke || P.st; x.lineWidth = size * (o.sw ?? .16);
        x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowOffsetY = size * .07; x.shadowBlur = size * .05;
        x.strokeText(l, ax, y); x.shadowColor = 'transparent';
      }
      x.fillStyle = o.fill || P.fg; x.fillText(l, ax, y);
      if (o.hi && i === lines.length - 1) { const ws = l.split(' '), last = ws.pop(), pre = ws.length ? ws.join(' ') + ' ' : ''; const w0 = x.measureText(pre).width, wl = x.measureText(last).width, tw = w0 + wl; const sx = al === 'left' ? ax : al === 'right' ? ax - tw : -tw / 2; x.textAlign = 'left'; x.fillStyle = o.hi; x.fillText(last, sx + w0, y); x.textAlign = al; }
    });
    x.restore();
    return size;
  };

  U.arrow = (x1, y1, x2, y2, o = {}) => {
    const w = (o.w ?? 20) * u, bend = o.bend ?? .3, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const cx = mx - (y2 - y1) * bend, cy = my + (x2 - x1) * bend, a = Math.atan2(y2 - cy, x2 - cx), hl = w * 2.6;
    const ex = x2 - Math.cos(a) * hl * .7, ey = y2 - Math.sin(a) * hl * .7;
    const path = () => { x.beginPath(); x.moveTo(x1, y1); x.quadraticCurveTo(cx, cy, ex, ey); };
    const head = () => { x.beginPath(); x.moveTo(x2, y2); x.lineTo(x2 - Math.cos(a - .5) * hl, y2 - Math.sin(a - .5) * hl); x.lineTo(x2 - Math.cos(a + .5) * hl, y2 - Math.sin(a + .5) * hl); x.closePath(); };
    x.save(); x.lineCap = 'round'; x.lineJoin = 'round';
    x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 16 * u;
    x.strokeStyle = '#fff'; x.lineWidth = w + 10 * u; path(); x.stroke(); head(); x.lineWidth = 10 * u; x.stroke(); x.fillStyle = '#fff'; x.fill();
    x.shadowColor = 'transparent'; x.strokeStyle = o.color || P.pop; x.lineWidth = w; path(); x.stroke(); x.fillStyle = o.color || P.pop; head(); x.fill();
    x.restore();
  };

  U.ring = (cx, cy, r, color) => {
    x.save(); x.translate(cx, cy); x.rotate(-.15);
    x.beginPath(); x.ellipse(0, 0, r * 1.08, r, 0, 0, 7);
    x.strokeStyle = '#fff'; x.lineWidth = 20 * u; x.stroke(); x.strokeStyle = color || P.pop; x.lineWidth = 12 * u; x.stroke();
    x.restore();
  };

  U.badge = (text, cx, cy, o = {}) => {
    const s = (o.size || 44) * u; x.save(); x.translate(cx, cy); x.rotate(o.rot || 0);
    x.font = `${s}px ${F}`; const w = x.measureText(text).width + s * .8, h = s * 1.35;
    x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 16 * u; x.shadowOffsetY = 6 * u;
    x.fillStyle = o.bg || P.pop; x.beginPath(); x.roundRect(-w / 2, -h / 2, w, h, 10 * u); x.fill();
    x.shadowColor = 'transparent'; x.strokeStyle = '#fff'; x.lineWidth = 5 * u; x.stroke();
    x.fillStyle = o.fg || '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 0, s * .05);
    x.restore();
  };

  U.glow = (cx, cy, r, c = '#fff', a = .55) => {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, c); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.save(); x.globalAlpha = a; x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); x.restore();
  };

  // Procedural cash stacks filling a band.
  U.cash = (bx, by, bw, bh) => {
    const r = K.rnd, n = Math.round(bw / (90 * u) * 3);
    for (let i = 0; i < n; i++) {
      const cx = bx + r() * bw, cy = by + bh * (.15 + r() * .85), w = 150 * u, h = 66 * u;
      x.save(); x.translate(cx, cy); x.rotate((r() - .5) * .9);
      x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 10 * u;
      x.fillStyle = '#2f8f4e'; x.fillRect(-w / 2, -h / 2, w, h); x.shadowColor = 'transparent';
      x.strokeStyle = '#bfe8c4'; x.lineWidth = 3 * u; x.strokeRect(-w / 2 + 6 * u, -h / 2 + 6 * u, w - 12 * u, h - 12 * u);
      x.fillStyle = '#bfe8c4'; x.font = `${h * .55}px ${F}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('$', 0, 2 * u);
      x.restore();
    }
  };

  // Silhouette crowd rows from y0 to y1.
  U.crowd = (y0, y1, c) => {
    const r = K.rnd; x.save(); x.fillStyle = c;
    for (let row = 0; row < 3; row++) {
      const y = y0 + (y1 - y0) * (.15 + row * .3), s = (40 + row * 18) * u; x.globalAlpha = .45 + row * .2;
      for (let cx = -s; cx < W + s; cx += s * 1.5) { const ox = cx + (r() - .5) * s * .6; x.beginPath(); x.arc(ox, y, s * .45, 0, 7); x.fill(); x.beginPath(); x.roundRect(ox - s * .7, y + s * .4, s * 1.4, s * 2.2, s * .5); x.fill(); }
    }
    x.restore();
  };

  // Fade a frame edge into a colour: dir = 'bottom' | 'top' | 'left' | 'right'.
  U.fade = (dir = 'bottom', amt = .35, c = 'rgba(0,0,0,.85)') => {
    const g = dir === 'bottom' ? x.createLinearGradient(0, H * (1 - amt), 0, H) : dir === 'top' ? x.createLinearGradient(0, H * amt, 0, 0)
      : dir === 'left' ? x.createLinearGradient(W * amt, 0, 0, 0) : x.createLinearGradient(W * (1 - amt), 0, W, 0);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, c); x.fillStyle = g; x.fillRect(0, 0, W, H);
  };

  // Shared AAA finish: soft light leak, vignette, fine grain.
  U.finish = (o = {}) => {
    x.save(); x.globalCompositeOperation = 'screen';
    U.glow(W * (o.lx ?? .85), H * (o.ly ?? .1), Math.max(W, H) * .45, P.bg[0], .22); x.restore();
    const g = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .45, W / 2, H / 2, Math.hypot(W, H) * .62);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${o.vig ?? .45})`); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.save(); x.globalAlpha = o.grain ?? .05; x.fillStyle = grain(); x.fillRect(0, 0, W, H); x.restore();
  };
  let grainPat;
  const grain = () => {
    if (grainPat) return grainPat;
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), im = g.createImageData(128, 128);
    for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0); return (grainPat = x.createPattern(c, 'repeat'));
  };

  // First number in big words / title ("$10,000", "100", "24H"), else fallback.
  U.num = (fb = '100') => ((d.big + ' ' + d.title).match(/\$?\d[\d,.]*\s?[KMB%H]?\b/i) || [fb])[0].toUpperCase();
  // Loudest single word: a number if any, else the longest word.
  U.hero = () => { const n = (d.big.match(/\$?\d[\d,.]*\s?[KMB%H]?/i) || [])[0]; return n || d.big.split(/\s+/).sort((a, b) => b.length - a.length)[0] || 'WOW'; };
  U.rest = () => d.big.replace(/\$?\d[\d,.]*\s?[KMB%H]?\b/i, '').trim() || 'CHALLENGE';
  return U;
}

// 8 tuned palettes (MrBeast-style saturation, black outline).
// 8 palettes from docs/RESEARCH.md §1. bg = [light, dark], fg = text, pop = accent, st = outline ink.
export const POP_PRESETS = [
  { name: 'BEAST BLUE', bg: ['#4c8dff', '#0a3fb8'], fg: '#ffe600', st: '#0a0a0a', pop: '#ff2d2d' },
  { name: 'CASH', bg: ['#1fb35d', '#033d1c'], fg: '#ffffff', st: '#0a0a0a', pop: '#ffd400' },
  { name: 'ALARM', bg: ['#ff3322', '#6e0200'], fg: '#ffffff', st: '#111111', pop: '#ffd400' },
  { name: 'POOL', bg: ['#45d6ff', '#0078a8'], fg: '#ffffff', st: '#06223a', pop: '#ff3d81' },
  { name: 'ORANGE TEAL', bg: ['#ff9d3d', '#c24a00'], fg: '#ffffff', st: '#101820', pop: '#00b8a9' },
  { name: 'CANDY', bg: ['#ff5aad', '#a1004f'], fg: '#fff200', st: '#14002b', pop: '#2b1bff' },
  { name: 'LAVA NIGHT', bg: ['#40006f', '#0b0016'], fg: '#ffd60a', st: '#000000', pop: '#ff4d00' },
  { name: 'ARCTIC', bg: ['#ffffff', '#b9e3ff'], fg: '#0057ff', st: '#0b0b0b', pop: '#ff2d2d' }
];

// True-crime pack: 10 layouts from docs/RESEARCH.md §2 x 8 noir palettes = 80 templates.
// Netflix-documentary key art: motivated hard light, haze, blinds, tactile paper/tape/polaroids, restrained type.
// d.person = subject, d.person2 = second person, d.cover = scene/photo, d.item = evidence. No gore; serious tone.
import { pop, TYPE } from '../../core/pop.js';

const F = '"Bebas Neue", Oswald, Anton, Impact, "Arial Narrow", sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';
const HAND = '"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive';
const DESAT = 'grayscale(.6) contrast(1.22) brightness(.92)';

function crime(x, W, H, d, K, P) {
  const U = pop(x, W, H, d, K, P), u = U.u, r = K.rnd;
  U.r = r;
  const cv = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return [c, c.getContext('2d')]; };
  const cover = (img, bx, by, bw, bh) => { const s = Math.max(bw / img.width, bh / img.height); x.drawImage(img, bx + (bw - img.width * s) / 2, by + (bh - img.height * s) / 2, img.width * s, img.height * s); };
  U.cover = cover;
  U.tint = (c, a = .18, mode = 'color') => { x.save(); x.globalCompositeOperation = mode; x.globalAlpha = a; x.fillStyle = c; x.fillRect(0, 0, W, H); x.restore(); };

  // ---------- light & atmosphere ----------
  U.room = (o = {}) => {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P.bg[1]); g.addColorStop(1, '#020203'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (d.cover && o.photo !== false) { x.save(); x.globalAlpha = o.pa ?? .55; x.filter = `${DESAT} blur(${(o.blur ?? 2) * u}px)`; cover(d.cover, 0, 0, W, H); x.restore(); U.tint(P.bg[1], .55, 'multiply'); }
    else if (d.bg) { // built-in cinematic plate: seed picks the crop, pushed in + tilted, heavy blur, noir grade
      const r = ((d.seed || 0) * 9301 + 49297) % 233280 / 233280, z = 1.25 + r * .2, rot = (r - .5) * .06;
      x.save(); x.globalAlpha = .78; x.filter = `saturate(.75) contrast(1.15) brightness(.75) blur(${7 * u}px)`;
      x.translate(W / 2 + (r - .5) * W * .12, H / 2 + (.5 - r) * H * .08); x.rotate(rot); cover(d.bg, -W * z / 2, -H * z / 2, W * z, H * z); x.restore();
      U.tint(P.bg[1], .38, 'multiply');
    }
    U.glow(W * (o.lx ?? .5), H * (o.ly ?? .3), Math.max(W, H) * (o.lr ?? .55), P.bg[0], o.la ?? .8);
  };
  U.haze = (a = .22, y0 = 0, y1 = H, col = P.light) => {
    const s = .25, [c, g] = cv(W * s, H * s);
    for (let i = 0; i < 16; i++) {
      const cx = r() * c.width, cy = (y0 + r() * (y1 - y0)) * s, rx = (.15 + r() * .35) * W * s, k = .2 + r() * .25;
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.save(); g.translate(cx, cy); g.scale(1, k); g.fillStyle = gr; g.fillRect(-rx, -rx, rx * 2, rx * 2); g.restore();
    }
    g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height);
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = a; x.filter = `blur(${10 * u}px)`; x.drawImage(c, 0, 0, W, H); x.restore();
  };
  // Light shafts through venetian blinds.
  U.blinds = (sx, sy, ang, L, s0, s1, n = 9, a = .3, col = P.light) => {
    const s = .5, [c, g] = cv(W * s, H * s); g.scale(s, s); g.translate(sx, sy); g.rotate(ang);
    const lg = g.createLinearGradient(0, 0, L, 0); lg.addColorStop(0, col); lg.addColorStop(.6, col); lg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = lg;
    for (let i = 0; i < n; i++) { const t0 = i / n, t1 = t0 + .5 / n; g.beginPath(); g.moveTo(0, -s0 / 2 + s0 * t0); g.lineTo(L, -s1 / 2 + s1 * t0); g.lineTo(L, -s1 / 2 + s1 * t1); g.lineTo(0, -s0 / 2 + s0 * t1); g.fill(); }
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = a; x.filter = `blur(${4 * u}px)`; x.drawImage(c, 0, 0, W, H);
    x.globalAlpha = a * .6; x.filter = `blur(${24 * u}px)`; x.drawImage(c, 0, 0, W, H); x.restore();
  };
  U.cone = (cx, top, w0, w1, bottom, a = .5, col = '#fff6dc') => {
    const s = .5, [c, g] = cv(W * s, H * s); g.scale(s, s);
    const lg = g.createLinearGradient(0, top, 0, bottom); lg.addColorStop(0, col); lg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = lg;
    g.beginPath(); g.moveTo(cx - w0 / 2, top); g.lineTo(cx + w0 / 2, top); g.lineTo(cx + w1 / 2, bottom); g.lineTo(cx - w1 / 2, bottom); g.fill();
    x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = a; x.filter = `blur(${6 * u}px)`; x.drawImage(c, 0, 0, W, H);
    x.globalAlpha = a * .5; x.filter = `blur(${30 * u}px)`; x.drawImage(c, 0, 0, W, H); x.restore();
  };
  U.dust = (b, n = 80, a = .5) => { x.save(); for (let i = 0; i < n; i++) { x.fillStyle = `rgba(255,248,230,${r() * a})`; x.beginPath(); x.arc(b.x + r() * b.w, b.y + r() * b.h, (.5 + r() * 1.6) * u, 0, 7); x.fill(); } x.restore(); };

  // ---------- people ----------
  // Premium lit silhouette (head, neck, coat with lapels, optional fedora) with a rim crescent.
  const silC = (o = {}) => {
    const [c, g] = cv(600, 800);
    const shape = (gg, dx = 0, dy = 0) => {
      gg.beginPath(); gg.ellipse(300 + dx, 280 + dy, 112, 146, 0, 0, 7); gg.fill();
      gg.beginPath(); gg.moveTo(245 + dx, 390 + dy); gg.lineTo(355 + dx, 390 + dy); gg.lineTo(372 + dx, 530 + dy); gg.lineTo(228 + dx, 530 + dy); gg.fill();
      gg.beginPath(); gg.moveTo(dx, 800 + dy); gg.bezierCurveTo(8 + dx, 630 + dy, 110 + dx, 548 + dy, 228 + dx, 510 + dy); gg.lineTo(372 + dx, 510 + dy);
      gg.bezierCurveTo(490 + dx, 548 + dy, 592 + dx, 630 + dy, 600 + dx, 800 + dy); gg.closePath(); gg.fill();
      if (o.hat) { gg.beginPath(); gg.ellipse(300 + dx, 198 + dy, 172, 24, -.06, 0, 7); gg.fill(); gg.beginPath(); gg.moveTo(205 + dx, 200 + dy); gg.bezierCurveTo(200 + dx, 120 + dy, 215 + dx, 82 + dy, 260 + dx, 86 + dy); gg.quadraticCurveTo(300 + dx, 108 + dy, 340 + dx, 86 + dy); gg.bezierCurveTo(385 + dx, 82 + dy, 400 + dx, 120 + dy, 395 + dx, 200 + dy); gg.fill(); }
    };
    g.fillStyle = '#08090b'; shape(g);
    g.globalCompositeOperation = 'source-atop';
    const lg = g.createLinearGradient(0, 120, 0, 800); lg.addColorStop(0, 'rgba(70,76,86,.55)'); lg.addColorStop(.5, 'rgba(25,27,32,.4)'); lg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = lg; g.fillRect(0, 0, 600, 800);
    const [rc, rg] = cv(600, 800); rg.fillStyle = o.rim || P.rim; shape(rg); rg.globalCompositeOperation = 'destination-out'; shape(rg, o.left ? 16 : -16, 8);
    g.filter = 'blur(2px)'; g.drawImage(rc, 0, 0); g.filter = 'blur(16px)'; g.globalAlpha = .55; g.drawImage(rc, 0, 0); g.filter = 'none'; g.globalAlpha = 1;
    g.strokeStyle = 'rgba(150,160,175,.18)'; g.lineWidth = 4; g.beginPath(); g.moveTo(228, 512); g.lineTo(300, 660); g.lineTo(372, 512); g.stroke();
    g.beginPath(); g.moveTo(300, 660); g.lineTo(300, 800); g.stroke();
    return c;
  };
  U.sil = silC;
  // Subject: real cut-out lit into the scene, or the premium silhouette.
  U.fig = (img, cx, bottom, h, o = {}) => {
    if (o.back !== false) U.glow(cx, bottom - h * .62, h * .55, o.rim || P.rim, o.backA ?? .16);
    if (img) return U.prop(img, cx, bottom, h, { filter: o.filter || DESAT, rim: o.rim ?? P.rim, rimA: o.rimA ?? .38, rimLeft: o.left, flip: o.flip, shadow: o.shadow ?? false, tintA: .2 });
    const s = silC(o), w = h * .75;
    x.drawImage(s, cx - w / 2, bottom - h, w, h);
    return { cx, top: bottom - h, w, h };
  };
  // Hard flash shadow thrown on the wall behind the subject.
  U.castShadow = (img, cx, bottom, h, dx, a = .55) => {
    const src = img || silC(), w = h * src.width / src.height, [c, g] = cv(w, h);
    g.drawImage(src, 0, 0, w, h); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    x.save(); x.globalAlpha = a; x.filter = `blur(${5 * u}px)`; x.drawImage(c, cx - w / 2 + dx, bottom - h + dx * .2, w, h); x.restore();
  };

  // ---------- type ----------
  U.title = (text, b, o = {}) => U.words(text, b, { font: o.font || F, weight: o.weight, fill: o.fill || '#f2efe8', stroke: o.stroke || 'rgba(0,0,0,.55)', sw: o.sw ?? .02, hi: o.hi === false ? undefined : (o.hi || (P.pop === '#8a0f0f' ? '#d4232c' : P.pop)), align: o.align || 'left', maxLines: o.lines || 2, plate: o.plate, rot: o.rot });
  U.label = (t, px, py, size = 16, col = P.light, o = {}) => {
    x.save(); x.font = `${o.bold ? 'bold ' : ''}${size * u}px ${o.font || TYPE}`; x.letterSpacing = `${(o.sp ?? .3) * size * u}px`;
    x.textAlign = o.align || 'left'; x.textBaseline = 'middle'; x.globalAlpha = o.a ?? .85; x.fillStyle = col;
    x.shadowColor = 'rgba(0,0,0,.8)'; x.shadowBlur = 6 * u; x.fillText(t, px, py); x.restore();
  };

  // ---------- materials ----------
  const paperC = (w, h, tone, o = {}) => {
    const [c, g] = cv(w, h); g.fillStyle = tone; g.fillRect(0, 0, w, h);
    const n = Math.min(6000, w * h / 220);
    for (let i = 0; i < n; i++) { const px = r() * w, py = r() * h, l = (2 + r() * 9) * u, a = r() * 6.28; g.strokeStyle = r() < .55 ? 'rgba(90,60,30,.09)' : 'rgba(255,255,255,.14)'; g.lineWidth = .7 * u; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); g.stroke(); }
    for (let i = 0; i < 2; i++) { const sx = r() * w, sy = r() * h, sr = (30 + r() * 50) * u; const sg = g.createRadialGradient(sx, sy, sr * .5, sx, sy, sr); sg.addColorStop(0, 'rgba(140,95,40,.05)'); sg.addColorStop(.9, 'rgba(120,80,30,.16)'); sg.addColorStop(1, 'rgba(120,80,30,0)'); g.fillStyle = sg; g.fillRect(sx - sr, sy - sr, sr * 2, sr * 2); }
    const crease = (horiz, p) => { const gr = horiz ? g.createLinearGradient(0, p - 10 * u, 0, p + 10 * u) : g.createLinearGradient(p - 10 * u, 0, p + 10 * u, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.45, 'rgba(60,40,20,.16)'); gr.addColorStop(.52, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; horiz ? g.fillRect(0, p - 10 * u, w, 20 * u) : g.fillRect(p - 10 * u, 0, 20 * u, h); };
    if (o.creases !== false) { crease(true, h * (.3 + r() * .1)); crease(false, w * (.5 + r() * .15)); }
    const eg = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .3, w / 2, h / 2, Math.hypot(w, h) * .58); eg.addColorStop(0, 'rgba(0,0,0,0)'); eg.addColorStop(1, 'rgba(90,55,20,.45)'); g.fillStyle = eg; g.fillRect(0, 0, w, h);
    return c;
  };
  U.sheet = (b, rot = 0, tone = '#e6dcc4', o = {}) => {
    const c = paperC(b.w, b.h, tone, o);
    x.save(); x.translate(b.x + b.w / 2, b.y + b.h / 2); x.rotate(rot);
    x.shadowColor = 'rgba(0,0,0,.75)'; x.shadowBlur = 40 * u; x.shadowOffsetY = 18 * u; x.shadowOffsetX = 8 * u; x.drawImage(c, -b.w / 2, -b.h / 2); x.restore();
  };
  U.on = (b, rot, fn) => { x.save(); x.translate(b.x + b.w / 2, b.y + b.h / 2); x.rotate(rot); x.translate(-b.w / 2, -b.h / 2); fn({ x: 0, y: 0, w: b.w, h: b.h }); x.restore(); };
  U.lines = (b, lh = 24, col = 'rgba(40,30,20,.42)') => { x.fillStyle = col; for (let y = b.y; y < b.y + b.h; y += lh * u) { let px = b.x; const end = b.x + b.w * (.6 + r() * .4); while (px < end) { const ww = (14 + r() * 40) * u; x.fillRect(px, y, Math.min(ww, end - px), lh * u * .3); px += ww + 7 * u; } } };
  U.redact = (b, n = 4) => { const hh = Math.min(b.h / n * .62, H * .05); for (let i = 0; i < n; i++) { const ww = b.w * (.4 + r() * .6), bx = b.x + r() * (b.w - ww), by = b.y + i * (b.h / n); x.fillStyle = '#0b0b0c'; x.beginPath(); x.roundRect(bx, by, ww, hh, 2 * u); x.fill(); x.fillStyle = 'rgba(255,255,255,.06)'; x.fillRect(bx + 4 * u, by + 3 * u, ww * .7, 2 * u); } };

  // Crime tape with twists/folds, sheen and drop shadow.
  U.tape = (x1, y1, x2, y2, o = {}) => {
    const a = Math.atan2(y2 - y1, x2 - x1), len = Math.hypot(x2 - x1, y2 - y1), h = (o.h || 52) * u, col = P.tape || '#f4c60b';
    const t = o.txt || 'CRIME SCENE  •  DO NOT CROSS  •  ';
    x.save(); x.translate(x1, y1); x.rotate(a);
    x.save(); x.filter = `blur(${12 * u}px)`; x.fillStyle = 'rgba(0,0,0,.6)'; x.fillRect(0, -h / 2 + 18 * u, len, h); x.restore();
    x.font = `${h * .55}px ${F}`; x.letterSpacing = `${2 * u}px`; const tw = x.measureText(t).width, off = r() * tw;
    let p = 0, i = 0;
    while (p < len) {
      const l = (160 + r() * 240) * u, e = Math.min(len, p + l), k = (r() - .5) * .5, hh = h * (1 - Math.abs(k) * .35);
      x.save(); x.beginPath(); x.rect(p, -hh / 2, e - p + 1, hh); x.clip();
      x.fillStyle = col; x.fillRect(p, -h, e - p + 1, h * 2);
      x.save(); x.scale(1, hh / h); x.fillStyle = '#141414'; x.textBaseline = 'middle'; for (let tx = -off; tx < len; tx += tw) if (tx + tw > p && tx < e) x.fillText(t, tx, 1.5 * u); x.restore();
      const sh = x.createLinearGradient(0, -hh / 2, 0, hh / 2); sh.addColorStop(0, 'rgba(255,255,255,.4)'); sh.addColorStop(.22, 'rgba(255,255,255,0)'); sh.addColorStop(.75, 'rgba(0,0,0,.08)'); sh.addColorStop(1, 'rgba(0,0,0,.4)'); x.fillStyle = sh; x.fillRect(p, -hh / 2, e - p + 1, hh);
      x.fillStyle = k > 0 ? `rgba(255,255,255,${k * .45})` : `rgba(0,0,0,${-k * .9})`; x.fillRect(p, -hh / 2, e - p + 1, hh);
      x.restore();
      if (i++) { x.fillStyle = 'rgba(0,0,0,.4)'; x.fillRect(p - 2 * u, -h / 2, 3 * u, h); x.fillStyle = 'rgba(255,255,255,.4)'; x.fillRect(p + 1 * u, -h / 2, 1.5 * u, h); }
      p = e;
    }
    x.restore();
  };

  // Worn rubber stamp (offscreen, eroded ink).
  U.stamp = (txt, cx, cy, size = 50, rot = -.14, c = P.pop, o = {}) => {
    const s = size * u; x.save(); x.font = `bold ${s}px ${TYPE}`; const tw = x.measureText(txt).width; x.restore();
    const w = tw + s * 1.1, h = s * 1.6, [sc, g] = cv(w + 20 * u, h + 20 * u);
    g.translate(sc.width / 2, sc.height / 2); g.strokeStyle = c; g.fillStyle = c; g.lineWidth = 5 * u; g.strokeRect(-w / 2, -h / 2, w, h); g.lineWidth = 2 * u; g.strokeRect(-w / 2 + 8 * u, -h / 2 + 8 * u, w - 16 * u, h - 16 * u);
    g.font = `bold ${s}px ${TYPE}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 2 * u);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 500; i++) { g.globalAlpha = r() * .85; g.beginPath(); g.arc(r() * sc.width, r() * sc.height, (.4 + r() * 2) * u, 0, 7); g.fill(); }
    const lg = g.createLinearGradient(0, 0, sc.width, sc.height); lg.addColorStop(0, 'rgba(0,0,0,.5)'); lg.addColorStop(.5, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,.35)'); g.globalAlpha = 1; g.fillStyle = lg; g.fillRect(0, 0, sc.width, sc.height);
    x.save(); x.translate(cx, cy); x.rotate(rot); x.globalAlpha = o.a ?? .88; if (o.mul) x.globalCompositeOperation = 'multiply'; x.drawImage(sc, -sc.width / 2, -sc.height / 2); x.restore();
  };

  // Placeholder photo contents for a polaroid (lit, intentional).
  const phPhoto = (kind, bx, by, s) => {
    const bg = x.createRadialGradient(bx + s * .4, by + s * .35, 0, bx + s * .5, by + s * .5, s * .8); bg.addColorStop(0, '#5c626b'); bg.addColorStop(1, '#0e0f12'); x.fillStyle = bg; x.fillRect(bx, by, s, s);
    if (kind === 'scene') {
      x.fillStyle = '#0a0b0d'; x.fillRect(bx, by + s * .72, s, s * .28);
      for (let i = 0; i < 6; i++) { const tx = bx + r() * s; x.beginPath(); x.moveTo(tx, by + s * (.35 + r() * .2)); x.lineTo(tx - s * .08, by + s * .74); x.lineTo(tx + s * .08, by + s * .74); x.fill(); }
      x.beginPath(); x.moveTo(bx + s * .25, by + s * .72); x.lineTo(bx + s * .25, by + s * .5); x.lineTo(bx + s * .5, by + s * .32); x.lineTo(bx + s * .75, by + s * .5); x.lineTo(bx + s * .75, by + s * .72); x.fill();
      U.glow(bx + s * .6, by + s * .59, s * .2, '#ffd98a', .5); x.fillStyle = '#ffd98a'; x.fillRect(bx + s * .56, by + s * .55, s * .07, s * .08);
    } else if (kind === 'item') {
      x.save(); x.translate(bx + s * .5, by + s * .52); x.rotate(-.35); x.fillStyle = '#121316'; x.beginPath(); x.roundRect(-s * .16, -s * .3, s * .32, s * .6, s * .05); x.fill();
      x.fillStyle = '#26303a'; x.fillRect(-s * .13, -s * .25, s * .26, s * .48); x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(-s * .13, -s * .25, s * .08, s * .48); x.restore();
    } else { x.drawImage(silC(), bx + s * .1, by + s * .12, s * .8, s * .8 * 4 / 3); }
  };
  U.polaroid = (img, cx, cy, w, rot = 0, label, kind = 'person') => {
    const h = w * 1.2, p = w * .06, iw = w - p * 2;
    x.save(); x.translate(cx, cy); x.rotate(rot);
    x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 26 * u; x.shadowOffsetY = 12 * u; x.shadowOffsetX = 5 * u; x.fillStyle = '#ebe5d6'; x.fillRect(-w / 2, -h / 2, w, h); x.shadowColor = 'transparent';
    const pg = x.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); pg.addColorStop(0, 'rgba(255,255,255,.3)'); pg.addColorStop(1, 'rgba(110,90,60,.3)'); x.fillStyle = pg; x.fillRect(-w / 2, -h / 2, w, h);
    x.save(); x.beginPath(); x.rect(-w / 2 + p, -h / 2 + p, iw, iw); x.clip();
    if (img) { x.filter = 'grayscale(.55) sepia(.18) contrast(1.15) brightness(.92)'; cover(img, -w / 2 + p, -h / 2 + p, iw, iw); x.filter = 'none'; } else phPhoto(kind, -w / 2 + p, -h / 2 + p, iw);
    const vg = x.createRadialGradient(0, -h / 2 + p + iw / 2, iw * .3, 0, -h / 2 + p + iw / 2, iw * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); x.fillStyle = vg; x.fillRect(-w / 2, -h / 2, w, h);
    const gl = x.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2 - iw * .3); gl.addColorStop(0, 'rgba(255,255,255,.22)'); gl.addColorStop(.35, 'rgba(255,255,255,.04)'); gl.addColorStop(.36, 'rgba(255,255,255,0)'); x.fillStyle = gl; x.fillRect(-w / 2, -h / 2, w, h);
    x.restore();
    if (label) { x.fillStyle = '#1d1d22'; x.font = `${w * .085}px ${HAND}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(label, 0, h / 2 - (h - w) * .45); }
    x.restore();
    return { x: cx + Math.sin(rot) * h * .45, y: cy - Math.cos(rot) * h * .45 };
  };
  const pinRed = P.pop === '#ffd60a' || P.pop === '#ff9f1c' ? '#c3121a' : P.pop;
  U.pin = (pt) => {
    x.save(); x.fillStyle = 'rgba(0,0,0,.5)'; x.filter = `blur(${2 * u}px)`; x.beginPath(); x.arc(pt.x + 4 * u, pt.y + 6 * u, 8 * u, 0, 7); x.fill(); x.restore();
    const g = x.createRadialGradient(pt.x - 3 * u, pt.y - 3 * u, 1 * u, pt.x, pt.y, 9 * u); g.addColorStop(0, '#ff9a9a'); g.addColorStop(.4, pinRed); g.addColorStop(1, '#3a0306');
    x.fillStyle = g; x.beginPath(); x.arc(pt.x, pt.y, 9 * u, 0, 7); x.fill();
  };
  U.string = (a, b) => {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + Math.hypot(b.x - a.x, b.y - a.y) * .08;
    x.save(); x.lineCap = 'round';
    x.strokeStyle = 'rgba(0,0,0,.45)'; x.lineWidth = 3 * u; x.filter = `blur(${2 * u}px)`; x.beginPath(); x.moveTo(a.x + 5 * u, a.y + 9 * u); x.quadraticCurveTo(mx + 5 * u, my + 14 * u, b.x + 5 * u, b.y + 9 * u); x.stroke(); x.filter = 'none';
    x.strokeStyle = '#a80f18'; x.lineWidth = 3 * u; x.beginPath(); x.moveTo(a.x, a.y); x.quadraticCurveTo(mx, my, b.x, b.y); x.stroke();
    x.strokeStyle = 'rgba(255,140,140,.35)'; x.lineWidth = 1 * u; x.stroke(); x.restore();
  };
  // Hand-drawn marker circle.
  U.mark = (cx, cy, rx, ry, col = pinRed) => {
    x.save(); x.translate(cx, cy); x.rotate(-.12); x.strokeStyle = col; x.lineCap = 'round'; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 8 * u;
    for (let k = 0; k < 2; k++) { x.lineWidth = (7 - k * 2.5) * u; x.globalAlpha = .92 - k * .3; x.beginPath(); for (let t = 0; t <= 1.1; t += .015) { const a = -1.9 + t * 6.283, j = 1 + Math.sin(t * 7 + k * 2) * .03 + k * .05 + t * .04; const px = Math.cos(a) * rx * j, py = Math.sin(a) * ry * j; t ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
    x.restore();
  };
  U.chart = (b) => {
    const g = x.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, '#c9c9c4'); g.addColorStop(1, '#8e8e8a'); x.fillStyle = g; x.fillRect(b.x, b.y, b.w, b.h);
    x.strokeStyle = 'rgba(0,0,0,.6)'; x.fillStyle = 'rgba(0,0,0,.7)'; x.font = `bold ${16 * u}px ${TYPE}`; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    for (let i = 0, y = b.y + b.h; y > b.y; i++, y -= 18 * u) { const big = i % 6 === 0; x.lineWidth = big ? 3 * u : 1 * u; x.beginPath(); x.moveTo(b.x, y); x.lineTo(b.x + (big ? b.w : b.w * .08), y); x.stroke(); x.beginPath(); x.moveTo(b.x + b.w * .92, y); x.lineTo(b.x + b.w, y); x.stroke(); if (big) x.fillText(`${4 + i / 6}'`, b.x + 10 * u, y - 7 * u); }
  };
  U.placard = (cx, cy, w) => {
    const h = w * .34; x.save(); x.translate(cx, cy); x.rotate(.01);
    x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 20 * u; x.shadowOffsetY = 8 * u; x.fillStyle = '#121214'; x.fillRect(-w / 2, -h / 2, w, h); x.shadowColor = 'transparent';
    x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 2 * u; x.strokeRect(-w / 2 + 6 * u, -h / 2 + 6 * u, w - 12 * u, h - 12 * u);
    x.fillStyle = '#e9e6dc'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `bold ${h * .22}px ${TYPE}`; x.fillText('COUNTY SHERIFF', 0, -h * .2); x.font = `bold ${h * .28}px ${TYPE}`; x.fillText(`0${4 + (d.seed || 7) % 5}-4471-${17 + (d.seed || 7) % 9}`, 0, h * .18);
    x.restore();
  };

  U.end = (o = {}) => { U.grade({ bloom: o.bloom ?? .2, tone: .2, curve: .14, warm: o.warm || '#ffd9a8' }); U.finish({ vig: o.vig ?? .62, grain: .09, lx: o.lx ?? .5, ly: o.ly ?? -.2 }); };
  return U;
}

// Set dressing with the built-in crime props (assets/props/crime). Uploads (d.item) always win.
// item: what fills the layout's evidence slot; dress: [name, cx, bottom, h, rot] in frame fractions (wide | tall).
const EVID = ['handcuffs', 'cassette', 'bullets', 'vhs', 'shotgun-shells', 'fbi-badge', 'badge-wallet'];
const PAPERS = ['newspaper-bundle', 'newspapers', 'torn-newspaper'];
const FILES = ['archive-file', 'case-file', 'fbi-folder', 'case-book'];
// A name may be a list: the template's seed picks one, so SHUFFLE varies the set dressing.
const BG = { // background plates (assets/props/crime-bg) per layout; the seed picks one
  'MUGSHOT': ['blood-grunge', 'newspaper-wall', 'dark-board'],
  'REDACTED FILE': ['desk-evidence', 'newspaper-wall', 'collage-board'],
  'TAPE CROSS': ['red-tape', 'cuffs-lights'],
  'SILHOUETTE': ['dark-board', 'cuffs-lights', 'headlines'],
  'VICTIM VS SUSPECT': ['collage-board', 'headlines', 'dark-board'],
  'EVIDENCE': ['desk-evidence', 'blood-grunge'],
  'HEADLINE': ['headlines', 'newspaper-wall', 'collage-board']
};
const DRESS = {
  'MUGSHOT': { wide: [[['badge-wallet', 'fbi-badge'], .84, .74, .28, .12]], tall: [[['badge-wallet', 'fbi-badge'], .76, .32, .1, .12]] },
  'REDACTED FILE': { wide: [['magnifier', .66, 1.02, .55, .35]], tall: [['magnifier', .7, .88, .22, .35]] },
  'TAPE CROSS': { wide: [[['bullets', 'cassette'], .12, 1.02, .3, -.2], [['shotgun-shells', 'polaroids'], .7, 1.04, .34, .15]], tall: [[['bullets', 'cassette'], .2, .92, .12, -.2], [['shotgun-shells', 'polaroids'], .72, .94, .13, .15]] },
  'SILHOUETTE': { wide: [[FILES, .1, 1.1, .42, -.12]], tall: [[FILES, .18, .97, .26, -.12]] },
  'CASE BOARD': { item: EVID, wide: [['polaroids', .88, 1.06, .36, .12]], tall: [['polaroids', .76, .95, .14, .12]] },
  'VICTIM VS SUSPECT': { wide: [[PAPERS, .62, 1.04, .3, .08]], tall: [[PAPERS, .74, .97, .12, .08]] },
  'EVIDENCE': { item: EVID, wide: [['evidence-box', .14, 1.03, .4, -.04]], tall: [['evidence-box', .2, .96, .15, -.04]] },
  'HEADLINE': { wide: [[PAPERS, .2, 1.03, .42, -.1]], tall: [[PAPERS, .24, .93, .17, -.1]] },
  'INTERROGATION': { wide: [[FILES, .27, .97, .34, -.08], [['bullets', 'cassette'], .72, .95, .16, .3]], tall: [[FILES, .3, .81, .15, -.08], [['bullets', 'cassette'], .72, .8, .07, .3]] }
};
const T = (name, draw) => ({ name, niche: 'crime', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) {
  const R = DRESS[name] || {}, pr = d.prop || (() => null);
  const sd = d.seed || 0, bgs = BG[name];
  const dd = { ...d, item: d.item || (R.item ? pr('crime', R.item[sd % R.item.length]) : null), bg: bgs ? pr('crime-bg', bgs[sd % bgs.length]) : null };
  const U = crime(x, W, H, dd, K, P), end = U.end;
  U.end = (o) => { // dress the set just before the grade so props share the scene's light
    if (!d.item) for (const [n, cx, b, h, rot] of (K.wide ? R.wide : R.tall) || []) {
      const img = pr('crime', Array.isArray(n) ? n[(d.seed || 0) % n.length] : n); if (img) U.prop(img, cx * W, b * H, h * H, { rot, filter: 'contrast(1.1) saturate(.55) brightness(.9)', rim: P.light, rimA: .25, tint: P.bg[1], tintA: .18 });
    }
    end(o);
  };
  draw(x, W, H, dd, U, K.wide, P);
} });
const STOP = /^(OF|THE|A|AN|IN|AT|TO|AND|ON|FOR|WITH|BY|FROM)$/i;
const hook = (d, n = 3) => { const w = d.big.split(/\s+/).filter(Boolean).slice(0, n); while (w.length > 1 && STOP.test(w[w.length - 1])) w.pop(); return w.join(' '); };
const longest = (d) => d.big.split(/\s+/).sort((a, b) => b.length - a.length)[0];

export default [
  T('MUGSHOT', (x, W, H, d, U, w, P) => {
    U.room({ ly: .15, la: .5 });
    const cb = U.box(w ? [.26, 0, .48, 1] : [.08, .08, .84, .64]); U.chart(cb);
    const cx = .5 * W, bot = w ? H * 1.02 : .7 * H, h = w ? .92 * H : .5 * H;
    U.castShadow(d.person, cx, bot, h, 34 * U.u, .5);
    U.glow(cx, .2 * H, cb.w * .7, '#ffffff', .18);
    U.fig(d.person, cx, bot, h, { rim: '#dfe8f0', back: false });
    U.placard(cx, w ? .86 * H : .66 * H, w ? .26 * W : .5 * W);
    U.fade('bottom', .25);
    if (w) { U.label('PERSON OF INTEREST', .04 * W, .58 * H, 13); U.title(hook(d), U.box([.04, .62, .2, .18]), { plate: P.pop, fill: '#fff', hi: false }); U.stamp('SUSPECT', .86 * W, .18 * H, 40, .12); }
    else { U.label('PERSON OF INTEREST', .5 * W, .712 * H, 13, P.light, { align: 'center' }); U.title(hook(d), U.box([.1, .725, .68, .06]), { plate: P.pop, fill: '#fff', hi: false, align: 'center', lines: 1 }); U.stamp('SUSPECT', .68 * W, .12 * H, 34, .12); }
    U.end({ ly: .1 });
  }),
  T('REDACTED FILE', (x, W, H, d, U, w, P) => {
    U.room({ photo: false, lx: .2, ly: .1, la: .6 });
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(0,0,0,${U.r() * .12})`; x.fillRect(0, U.r() * H, W, (1 + U.r() * 4) * U.u); }
    const fb = U.box(w ? [.08, .03, .66, .96] : [.1, .08, .84, .72]), sb = U.box(w ? [.05, .07, .64, .98] : [.06, .11, .82, .7]);
    U.sheet(fb, .035, '#c7a46a', { creases: false }); U.sheet(sb, -.012);
    U.on(sb, -.012, (b) => {
      U.label('CASE FILE  No. 07-4471', b.w * .06, b.h * .06, w ? 13 : 11, '#2a2219', { a: .8, bold: true });
      x.fillStyle = 'rgba(40,30,20,.5)'; x.fillRect(b.w * .06, b.h * .1, b.w * .88, 2 * U.u);
      U.title(hook(d), { x: b.w * .06, y: b.h * .13, w: b.w * (w ? .56 : .5), h: b.h * (w ? .2 : .15) }, { font: TYPE, weight: 'bold', fill: '#151311', stroke: 'transparent', sw: 0, hi: '#b3121b' });
      U.lines({ x: b.w * .06, y: b.h * .4, w: b.w * .6, h: b.h * .5 });
      U.redact({ x: b.w * .06, y: b.h * .41, w: b.w * .58, h: b.h * .42 }, 5);
    });
    const pc = w ? [.62 * W, .5 * H, .25 * W] : [.68 * W, .34 * H, .34 * W];
    U.polaroid(d.person || d.cover, pc[0], pc[1], pc[2], .06, 'J. DOE');
    x.save(); x.strokeStyle = '#9aa0a8'; x.lineWidth = 3 * U.u; x.beginPath(); x.roundRect(pc[0] - pc[2] * .1, pc[1] - pc[2] * .72, pc[2] * .1, pc[2] * .32, 6 * U.u); x.stroke(); x.restore();
    U.stamp('CLASSIFIED', w ? .5 * W : .44 * W, w ? .2 * H : .62 * H, w ? 40 : 30, -.14, '#b3121b', { mul: true, a: .95 });
    U.haze(.12);
    U.end({ lx: .2, ly: 0 });
  }),
  T('TAPE CROSS', (x, W, H, d, U, w, P) => {
    U.room({ ly: .35, la: .6 });
    U.glow(0, .1 * H, H * .8, '#e10e1a', .35); U.glow(W, .1 * H, H * .8, '#1e5bff', .35);
    U.haze(.25, .3 * H, H);
    U.fig(d.person, .5 * W, w ? H * 1.02 : .8 * H, w ? .88 * H : .5 * H);
    if (w) { U.tape(-.05 * W, .28 * H, 1.05 * W, .78 * H); U.tape(-.05 * W, .92 * H, 1.05 * W, .36 * H); }
    else { U.tape(-.1 * W, .52 * H, 1.1 * W, .72 * H, { h: 46 }); U.tape(-.1 * W, .76 * H, 1.1 * W, .54 * H, { h: 46 }); }
    if (w) { U.label('THE INVESTIGATION', .04 * W, .06 * H, 13); U.title(hook(d), U.box([.04, .09, .4, .22])); }
    else { U.label('THE INVESTIGATION', .5 * W, .09 * H, 13, P.light, { align: 'center' }); U.title(hook(d), U.box([.06, .1, .76, .12]), { align: 'center' }); }
    U.end({ ly: .1 });
  }),
  T('SILHOUETTE', (x, W, H, d, U, w, P) => {
    U.room({ lx: w ? .7 : .5, ly: .4, la: .55 });
    U.blinds(-.1 * W, -.1 * H, w ? .5 : .9, Math.hypot(W, H) * 1.1, H * .25, H * 1.4, 10, .28);
    U.haze(.2);
    const cx = w ? .72 * W : .5 * W, bot = w ? H * 1.02 : .82 * H, h = w ? .92 * H : .56 * H;
    U.glow(cx, bot - h * .6, h * .6, P.rim, .3);
    U.fig(d.person, cx, bot, h, { hat: true, filter: 'brightness(.12) contrast(1.4)', rimA: .7, left: true });
    U.dust({ x: 0, y: 0, w: W, h: H * .8 }, 70, .4);
    if (w) { U.label('IDENTITY UNKNOWN', .05 * W, .3 * H, 13, P.rim); U.title(hook(d), U.box([.05, .34, .42, .26])); }
    else { U.label('IDENTITY UNKNOWN', .5 * W, .08 * H, 13, P.rim, { align: 'center' }); U.title(hook(d), U.box([.06, .1, .76, .12]), { align: 'center' }); }
    U.end({ lx: .1, ly: 0 });
  }),
  T('CASE BOARD', (x, W, H, d, U, w, P) => {
    const R = U.r, s = .5, c = document.createElement('canvas'); c.width = W * s; c.height = H * s; const g = c.getContext('2d');
    g.fillStyle = '#5a3d26'; g.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < c.width * c.height / 12; i++) { g.fillStyle = R() < .5 ? `rgba(30,18,8,${.15 + R() * .3})` : `rgba(200,150,95,${R() * .22})`; g.fillRect(R() * c.width, R() * c.height, 1 + R() * 2.5, 1 + R() * 2.5); }
    x.drawImage(c, 0, 0, W, H); U.tint(P.bg[1], .5, 'multiply'); U.glow(.5 * W, .45 * H, Math.max(W, H) * .5, '#ffe2b0', .3);
    const q = w ? H * .25 : W * .28;
    const card = (cx, cy, ww, rot, t) => { const b = { x: cx - ww / 2, y: cy - ww * .3, w: ww, h: ww * .6 }; U.sheet(b, rot, '#efe9da', { creases: false }); U.on(b, rot, (bb) => { x.fillStyle = '#b3121b'; x.fillRect(0, bb.h * .22, bb.w, 1.5 * U.u); U.label(t, bb.w * .08, bb.h * .12, 10, '#222', { a: .9, bold: true }); U.lines({ x: bb.w * .08, y: bb.h * .34, w: bb.w * .84, h: bb.h * .55 }, 14); }); return { x: cx, y: cy - ww * .26 }; };
    const pts = w
      ? [U.polaroid(d.cover, .15 * W, .48 * H, q, -.08, 'the scene', 'scene'), U.polaroid(d.person, .5 * W, .56 * H, q * 1.75, .02, 'suspect'), U.polaroid(d.item, .84 * W, .44 * H, q, .07, 'exhibit A', 'item'), card(.22 * W, .86 * H, q * 1.1, .05, 'TIMELINE'), card(.68 * W, .87 * H, q * .95, -.04, 'WITNESS')]
      : [U.polaroid(d.cover, .25 * W, .31 * H, q, -.08, 'the scene', 'scene'), U.polaroid(d.person, .5 * W, .5 * H, q * 1.7, .02, 'suspect'), U.polaroid(d.item, .76 * W, .3 * H, q, .07, 'exhibit A', 'item'), card(.28 * W, .7 * H, q * 1.2, .05, 'TIMELINE'), card(.7 * W, .71 * H, q * 1.05, -.04, 'WITNESS')];
    U.string(pts[0], pts[1]); U.string(pts[1], pts[2]); U.string(pts[1], pts[3]); U.string(pts[1], pts[4]); U.string(pts[0], pts[3]); pts.forEach(U.pin);
    const tb = U.box(w ? [.22, .03, .56, .14] : [.06, .07, .76, .08]);
    x.save(); x.fillStyle = '#0c0c0e'; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 18 * U.u; x.shadowOffsetY = 6 * U.u; x.fillRect(tb.x - 14 * U.u, tb.y, tb.w + 28 * U.u, tb.h); x.restore();
    U.title(hook(d), { x: tb.x, y: tb.y + tb.h * .12, w: tb.w, h: tb.h * .76 }, { align: 'center', lines: 1 });
    U.end();
  }),
  T('VICTIM VS SUSPECT', (x, W, H, d, U, w, P) => {
    U.room({ la: .4 });
    x.save(); x.globalCompositeOperation = 'screen';
    if (w) { U.glow(.22 * W, .35 * H, H * .8, '#b06a32', .5); U.glow(.78 * W, .35 * H, H * .8, '#2c6e9b', .55); } else { U.glow(.5 * W, .25 * H, W * .8, '#b06a32', .5); U.glow(.5 * W, .7 * H, W * .8, '#2c6e9b', .55); }
    x.restore(); U.haze(.15);
    if (w) { U.fig(d.person2, .25 * W, H * 1.02, .84 * H, { filter: 'sepia(.4) saturate(.8) contrast(1.1)', rim: '#ffc58a', left: true }); U.fig(d.person, .75 * W, H * 1.02, .84 * H, { flip: !!d.person, rim: '#7fc4ff' }); }
    else { U.fig(d.person2, .5 * W, .47 * H, .3 * H, { filter: 'sepia(.4) saturate(.8) contrast(1.1)', rim: '#ffc58a', left: true }); U.fig(d.person, .5 * W, .82 * H, .3 * H, { rim: '#7fc4ff' }); }
    const lg = w ? x.createLinearGradient(0, 0, 0, H) : x.createLinearGradient(0, 0, W, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(.5, 'rgba(255,255,255,.7)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = lg; w ? x.fillRect(W / 2 - 1.5 * U.u, 0, 3 * U.u, H) : x.fillRect(0, H / 2 - 1.5 * U.u, W, 3 * U.u);
    const bx = W / 2, by = w ? .42 * H : .5 * H, br = 46 * U.u;
    x.save(); x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 24 * U.u; x.fillStyle = '#0c0c0e'; x.beginPath(); x.arc(bx, by, br, 0, 7); x.fill(); x.restore();
    x.strokeStyle = P.pop; x.lineWidth = 3 * U.u; x.beginPath(); x.arc(bx, by, br - 6 * U.u, 0, 7); x.stroke();
    U.words('?', { x: bx - br * .6, y: by - br * .62, w: br * 1.2, h: br * 1.2 }, { font: F, fill: '#fff', sw: 0, stroke: 'transparent' });
    if (w) { U.label('THE VICTIM', .04 * W, .08 * H, 13, '#ffc58a'); U.label('THE SUSPECT', .96 * W, .08 * H, 13, '#9fd2ff', { align: 'right' }); U.title(hook(d), U.box([.04, .7, .4, .2])); }
    else { U.label('THE VICTIM', .08 * W, .2 * H, 13, '#ffc58a'); U.label('THE SUSPECT', .08 * W, .55 * H, 13, '#9fd2ff'); U.title(hook(d), U.box([.06, .07, .76, .09]), { align: 'center' }); }
    U.end();
  }),
  T('THE LOCATION', (x, W, H, d, U, w, P) => {
    const u = U.u, R = U.r, base = (w ? .8 : .62) * H;
    if (d.cover) { U.room({ pa: .85, blur: 0, la: .3 }); U.tint('#0a1a3a', .45, 'multiply'); }
    else {
      const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05070c'); g.addColorStop(.6, P.bg[1]); g.addColorStop(1, '#020203'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      const mx = w ? .3 * W : .25 * W; U.glow(mx, .18 * H, H * .35, '#cfd8e8', .35); x.fillStyle = 'rgba(230,236,245,.85)'; x.beginPath(); x.arc(mx, .18 * H, 16 * u, 0, 7); x.fill();
      U.haze(.25, .2 * H, base);
      const trees = (y, hmin, hmax, col, n) => { x.fillStyle = col; for (let i = 0; i < n; i++) { const tx = R() * W, th = (hmin + R() * (hmax - hmin)) * u; for (let k = 0; k < 4; k++) { const ty = y - th * (1 - k * .22), tw = th * (.18 + k * .06); x.beginPath(); x.moveTo(tx, ty); x.lineTo(tx - tw, ty + th * .4); x.lineTo(tx + tw, ty + th * .4); x.fill(); } x.fillRect(tx - 3 * u, y - th * .1, 6 * u, th * .2); } };
      trees(base - 30 * u, 120, 220, '#141a24', 26); U.haze(.2, base - 200 * u, base);
      const hx = w ? .64 * W : .5 * W, s = w ? .46 * H : .62 * W;
      x.fillStyle = '#06070a'; x.fillRect(hx - s * .5, base - s * .5, s, s * .5);
      x.beginPath(); x.moveTo(hx - s * .6, base - s * .48); x.lineTo(hx - s * .05, base - s * .9); x.lineTo(hx + s * .55, base - s * .48); x.fill(); x.fillRect(hx + s * .25, base - s * .85, s * .07, s * .2);
      x.strokeStyle = 'rgba(160,180,210,.25)'; x.lineWidth = 2 * u; x.beginPath(); x.moveTo(hx - s * .6, base - s * .48); x.lineTo(hx - s * .05, base - s * .9); x.lineTo(hx + s * .55, base - s * .48); x.stroke();
      const wx = hx + s * .18, wy = base - s * .3, ww = s * .12, wh = s * .14;
      U.glow(wx, wy, s * .6, P.light, .35); x.fillStyle = P.light; x.fillRect(wx - ww / 2, wy - wh / 2, ww, wh); x.fillStyle = '#06070a'; x.fillRect(wx - 1.5 * u, wy - wh / 2, 3 * u, wh); x.fillRect(wx - ww / 2, wy - 1.5 * u, ww, 3 * u);
      x.fillStyle = 'rgba(255,220,150,.5)'; x.fillRect(hx - s * .3, base - s * .26, s * .08, s * .1);
      x.fillStyle = '#030304'; x.fillRect(0, base, W, H - base);
      x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = .25; const rg = x.createLinearGradient(0, base, 0, H); rg.addColorStop(0, '#556'); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.beginPath(); x.moveTo(hx - s * .1, base); x.lineTo(hx + s * .05, base); x.lineTo(w ? .5 * W : .9 * W, H); x.lineTo(w ? .1 * W : .2 * W, H); x.fill(); x.restore();
      trees(H * 1.05, 260, 420, '#000', 7);
    }
    U.fig(d.person, .3 * W, base + 6 * u, w ? .2 * H : .11 * H, { filter: 'brightness(.08)', back: false, rimA: .5 });
    U.haze(.18, base - 80 * u, H);
    U.fade('bottom', .45);
    if (w) { U.label('LAST SEEN', .04 * W, .66 * H, 13); U.title(hook(d), U.box([.04, .69, .5, .2])); }
    else { U.label('LAST SEEN', .08 * W, .66 * H, 13); U.title(hook(d), U.box([.08, .675, .74, .1])); }
    U.end({ lx: .3, ly: 0, bloom: .3 });
  }),
  T('EVIDENCE', (x, W, H, d, U, w, P) => {
    const u = U.u, R = U.r, red = P.pop === '#ffd60a' || P.pop === '#ff9f1c' ? '#e10e1a' : P.pop;
    U.room({ photo: false, ly: .35, la: .5 });
    for (let i = 0; i < 60; i++) { x.strokeStyle = `rgba(255,255,255,${R() * .04})`; x.lineWidth = 1 * u; const yy = R() * H; x.beginPath(); x.moveTo(0, yy); x.lineTo(W, yy + (R() - .5) * 20 * u); x.stroke(); }
    if (d.cover) { x.save(); x.globalAlpha = .25; x.filter = `${DESAT} blur(${8 * u}px)`; U.cover(d.cover, 0, 0, W, H); x.restore(); }
    U.cone(w ? .6 * W : .5 * W, -.05 * H, W * .1, w ? W * .8 : W * 1.2, H, .3);
    const b = w ? { cx: .62 * W, cy: .55 * H, w: .34 * W, h: .74 * H } : { cx: .5 * W, cy: .47 * H, w: .64 * W, h: .48 * H }, rot = w ? .06 : -.04;
    x.save(); x.translate(b.cx, b.cy); x.rotate(rot);
    x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 30 * u; x.shadowOffsetY = 14 * u; x.fillStyle = 'rgba(200,210,220,.1)'; x.beginPath(); x.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 8 * u); x.fill(); x.restore();
    const iw = b.w * .7, ih = b.h * .55, iy = -b.h * .05;
    if (d.item) U.prop(d.item, 0, iy + ih / 2, ih, { filter: 'contrast(1.1) saturate(.6)', rim: P.light, rimA: .2, shadow: false });
    else {
      x.save(); x.rotate(-.18); const pw = Math.min(iw * .55, ih * .5), phh = pw * 1.9;
      x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 20 * u; x.fillStyle = '#0e0f12'; x.beginPath(); x.roundRect(-pw / 2, iy - phh / 2, pw, phh, pw * .14); x.fill(); x.shadowColor = 'transparent';
      const sg = x.createLinearGradient(0, iy - phh / 2, 0, iy + phh / 2); sg.addColorStop(0, '#1d3a4f'); sg.addColorStop(1, '#08121a'); x.fillStyle = sg; x.beginPath(); x.roundRect(-pw * .44, iy - phh * .44, pw * .88, phh * .88, pw * .08); x.fill();
      U.glow(0, iy - phh * .1, pw * .8, '#7fc4ff', .3);
      x.fillStyle = '#e8f4ff'; x.font = `${pw * .2}px ${F}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('23:47', 0, iy - phh * .25);
      x.fillStyle = red; x.font = `bold ${pw * .085}px ${TYPE}`; x.fillText('1 MISSED CALL', 0, iy - phh * .08);
      x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1.2 * u; x.beginPath(); x.moveTo(pw * .1, iy - phh * .3); x.lineTo(-pw * .05, iy); x.lineTo(pw * .15, iy + phh * .15); x.lineTo(-pw * .1, iy + phh * .35); x.stroke();
      x.restore();
    }
    const sh = x.createLinearGradient(-b.w / 2, -b.h / 2, b.w / 2, b.h / 2); sh.addColorStop(0, 'rgba(255,255,255,.18)'); sh.addColorStop(.3, 'rgba(255,255,255,.02)'); sh.addColorStop(.55, 'rgba(255,255,255,.14)'); sh.addColorStop(.62, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(255,255,255,.08)');
    x.fillStyle = sh; x.beginPath(); x.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 8 * u); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.12)'; x.lineWidth = 1.5 * u; for (let i = 0; i < 6; i++) { const yy = -b.h / 2 + R() * b.h; x.beginPath(); x.moveTo(-b.w / 2, yy); x.bezierCurveTo(-b.w * .2, yy - 20 * u, b.w * .1, yy + 30 * u, b.w / 2, yy + (R() - .5) * 40 * u); x.stroke(); }
    x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 2 * u; x.beginPath(); x.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 8 * u); x.stroke();
    x.fillStyle = '#b3121b'; x.fillRect(-b.w / 2, -b.h / 2 + 12 * u, b.w, 9 * u); x.fillStyle = 'rgba(255,255,255,.3)'; x.fillRect(-b.w / 2, -b.h / 2 + 12 * u, b.w, 2 * u);
    const lb = { x: -b.w * .42, y: b.h * .3, w: b.w * .84, h: b.h * .16 };
    x.fillStyle = '#f2efe6'; x.fillRect(lb.x, lb.y, lb.w, lb.h); x.fillStyle = '#b3121b'; x.fillRect(lb.x, lb.y, lb.w, lb.h * .3);
    x.fillStyle = '#fff'; x.font = `bold ${lb.h * .2}px ${TYPE}`; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('EVIDENCE', lb.x + 8 * u, lb.y + lb.h * .15);
    x.fillStyle = '#222'; x.font = `${lb.h * .16}px ${TYPE}`; x.fillText('CASE NO. 07-4471', lb.x + 8 * u, lb.y + lb.h * .5); x.fillText('ITEM 01  /  SEALED', lb.x + 8 * u, lb.y + lb.h * .78);
    x.restore();
    U.mark(b.cx, b.cy - b.h * .07, b.w * .38, b.h * .3);
    const tx = .2 * W, ty = w ? .78 * H : .72 * H, ts = 46 * u;
    x.save(); x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 16 * u; x.shadowOffsetY = 8 * u; x.fillStyle = '#e8b80c'; x.beginPath(); x.moveTo(tx - ts * .6, ty + ts * .6); x.lineTo(tx - ts * .35, ty - ts * .6); x.lineTo(tx + ts * .35, ty - ts * .6); x.lineTo(tx + ts * .6, ty + ts * .6); x.fill(); x.restore();
    x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(tx - ts * .35, ty - ts * .6, ts * .7, ts * .15);
    x.fillStyle = '#111'; x.font = `${ts * .8}px ${F}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('1', tx, ty + ts * .1);
    if (w) { U.label('EXHIBIT A', .04 * W, .08 * H, 13, P.light); U.title(hook(d), U.box([.04, .11, .38, .26]), { hi: red }); }
    else { U.label('EXHIBIT A', .5 * W, .08 * H, 13, P.light, { align: 'center' }); U.title(hook(d), U.box([.06, .09, .76, .12]), { align: 'center', hi: red }); }
    U.end({ lx: .6, ly: 0 });
  }),
  T('HEADLINE', (x, W, H, d, U, w, P) => {
    U.room({ lx: .3, ly: .3, la: .55 }); U.haze(.12);
    const pb = U.box(w ? [.04, .1, .6, .78] : [.06, .09, .84, .44]), rot = -.025;
    U.sheet(pb, rot, '#e4dac3');
    U.on(pb, rot, (b) => {
      x.fillStyle = '#121212'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `bold ${b.h * .09}px ${SERIF}`; x.fillText('The Daily Record', b.w / 2, b.h * .08);
      x.fillRect(b.w * .04, b.h * .14, b.w * .92, 3 * U.u); x.fillRect(b.w * .04, b.h * .185, b.w * .92, 1 * U.u);
      x.font = `${b.h * .026}px ${TYPE}`; x.fillText('LATE EDITION  •  POLICE APPEAL FOR WITNESSES', b.w / 2, b.h * .163);
      U.title(hook(d, 4), { x: b.w * .04, y: b.h * .21, w: b.w * .92, h: b.h * .3 }, { font: SERIF, weight: 'bold', fill: '#121212', stroke: 'transparent', sw: 0, align: 'center', hi: '#9e0f16' });
      const ph = { x: b.w * .04, y: b.h * .55, w: b.w * .4, h: b.h * .4 };
      x.save(); x.beginPath(); x.rect(ph.x, ph.y, ph.w, ph.h); x.clip();
      if (d.cover) { x.filter = 'grayscale(1) contrast(1.3)'; U.cover(d.cover, ph.x, ph.y, ph.w, ph.h); x.filter = 'none'; }
      else { x.fillStyle = '#3a3a3a'; x.fillRect(ph.x, ph.y, ph.w, ph.h); x.fillStyle = '#161616'; x.fillRect(ph.x, ph.y + ph.h * .7, ph.w, ph.h * .3); x.beginPath(); x.moveTo(ph.x + ph.w * .2, ph.y + ph.h * .7); x.lineTo(ph.x + ph.w * .5, ph.y + ph.h * .35); x.lineTo(ph.x + ph.w * .8, ph.y + ph.h * .7); x.fill(); }
      x.fillStyle = 'rgba(228,218,195,.35)'; const st = 4 * U.u; for (let yy = ph.y, row = 0; yy < ph.y + ph.h; yy += st, row++) for (let xx = ph.x + (row % 2) * st / 2; xx < ph.x + ph.w; xx += st) x.fillRect(xx, yy, 1.3 * U.u, 1.3 * U.u);
      x.restore();
      U.lines({ x: b.w * .48, y: b.h * .56, w: b.w * .22, h: b.h * .38 }, 12); U.lines({ x: b.w * .73, y: b.h * .56, w: b.w * .22, h: b.h * .38 }, 12);
    });
    U.fig(d.person, w ? .82 * W : .64 * W, w ? H * 1.02 : H * .99, w ? 1 * H : .46 * H, { rim: P.light, left: true, rimA: .45 });
    if (!w) U.label('UNSOLVED SINCE 1987', .08 * W, .58 * H, 13, P.light);
    U.end({ lx: .3, ly: 0 });
  }),
  T('INTERROGATION', (x, W, H, d, U, w, P) => {
    const u = U.u;
    x.fillStyle = '#030304'; x.fillRect(0, 0, W, H);
    const mg = x.createLinearGradient(0, .1 * H, 0, .6 * H); mg.addColorStop(0, 'rgba(70,80,95,.18)'); mg.addColorStop(1, 'rgba(20,24,30,.05)');
    const mr = w ? [.06 * W, .12 * H, .28 * W, .42 * H] : [.08 * W, .1 * H, .84 * W, .2 * H];
    x.fillStyle = mg; x.fillRect(...mr); x.strokeStyle = 'rgba(160,170,185,.12)'; x.lineWidth = 3 * u; x.strokeRect(...mr);
    const cx = W / 2, lampY = w ? .05 * H : .06 * H, tableY = w ? .8 * H : .66 * H;
    U.cone(cx, lampY, w ? .08 * W : .14 * W, w ? .7 * W : 1.2 * W, H, .55, P.light);
    U.dust({ x: cx - .25 * W, y: lampY, w: .5 * W, h: tableY - lampY }, 90, .5);
    U.fig(d.person, cx, w ? .98 * H : .74 * H, w ? .8 * H : .46 * H, { filter: 'grayscale(.75) contrast(1.4) brightness(.95)', rim: P.light, rimA: .25, back: false });
    x.fillStyle = '#0d0d0f'; x.beginPath(); x.moveTo(cx - .5 * W, tableY); x.lineTo(cx + .5 * W, tableY); x.lineTo(W, H); x.lineTo(0, H); x.fill();
    const tg = x.createRadialGradient(cx, tableY, 0, cx, tableY, w ? .35 * W : .5 * W); tg.addColorStop(0, 'rgba(255,240,210,.35)'); tg.addColorStop(1, 'rgba(255,240,210,0)'); x.fillStyle = tg; x.fillRect(0, tableY, W, H - tableY);
    x.fillStyle = 'rgba(255,255,255,.2)'; x.fillRect(0, tableY, W, 2 * u);
    const lw = w ? .09 * W : .2 * W;
    x.fillStyle = '#1b1c1f'; x.fillRect(cx - 2 * u, 0, 4 * u, lampY);
    const sg = x.createLinearGradient(cx - lw / 2, 0, cx + lw / 2, 0); sg.addColorStop(0, '#2a2b2f'); sg.addColorStop(.5, '#5a5c62'); sg.addColorStop(1, '#141518'); x.fillStyle = sg;
    x.beginPath(); x.moveTo(cx - lw * .18, lampY - lw * .25); x.lineTo(cx + lw * .18, lampY - lw * .25); x.lineTo(cx + lw / 2, lampY + lw * .1); x.lineTo(cx - lw / 2, lampY + lw * .1); x.fill();
    U.glow(cx, lampY + lw * .1, lw * .7, '#fff8e6', .9); x.fillStyle = '#fffaf0'; x.beginPath(); x.ellipse(cx, lampY + lw * .1, lw * .4, lw * .06, 0, 0, 7); x.fill();
    U.label('INTERVIEW ROOM 3  •  02:14', w ? .04 * W : .5 * W, w ? .07 * H : .09 * H, 12, '#9aa3ad', { align: w ? 'left' : 'center', a: .7 });
    U.title(longest(d), U.box(w ? [.25, .74, .5, .14] : [.1, .685, .7, .085]), { align: 'center', lines: 1, fill: '#f2efe8' });
    U.end({ ly: -.1, bloom: .3 });
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

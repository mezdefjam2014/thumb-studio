// Drawing helpers. makeKit binds them to one canvas + data so designs stay short.
const DISPLAY = 'Anton, Impact, "Arial Narrow", sans-serif';
const BODY = 'Inter, "Segoe UI", system-ui, sans-serif';

export function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

export function makeKit(x, W, H, d) {
  const wide = W > H, k = wide ? W / 1280 : W / 1080, A = d.accent;
  const K = { wide, k, W, H, rnd: rng(d.seed || 1) };

  K.artBox = () => wide ? { cx: .71 * W, cy: .5 * H, size: .62 * H } : { cx: .5 * W, cy: .31 * H, size: .66 * W };

  const fill = (img, bx, by, bw, bh) => {
    const s = Math.max(bw / img.width, bh / img.height), w = img.width * s, h = img.height * s;
    x.drawImage(img, bx + (bw - w) / 2, by + (bh - h) / 2, w, h);
  };

  K.bg = (blur = 60, bright = .3) => {
    x.fillStyle = '#0b0b0f'; x.fillRect(0, 0, W, H);
    if (d.cover) {
      x.save(); x.filter = `blur(${blur * k}px) brightness(${bright})`;
      fill(d.cover, -W * .1, -H * .1, W * 1.2, H * 1.2); x.restore();
    } else {
      const g = x.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#0b0b0f'); g.addColorStop(1, hexA(A, .35));
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    }
  };

  K.vign = (s = .75) => {
    const g = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .75);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${s})`);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
  };

  K.glowR = (cx, cy, r, a = .45) => {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, hexA(A, a)); g.addColorStop(1, hexA(A, 0));
    x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2);
  };

  K.spot = (B) => {
    x.save(); x.globalCompositeOperation = 'screen';
    const top = wide ? 0 : -H * .05, g = x.createLinearGradient(0, top, 0, B.cy + B.size * .6);
    g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath();
    x.moveTo(B.cx - B.size * .12, top); x.lineTo(B.cx + B.size * .12, top);
    x.lineTo(B.cx + B.size * .8, B.cy + B.size * .6); x.lineTo(B.cx - B.size * .8, B.cy + B.size * .6);
    x.fill(); x.restore();
    K.glowR(B.cx, B.cy + B.size * .45, B.size * .7, .35);
  };

  // Square cover with shadow + hairline border. No art -> accent placeholder.
  K.cover = (cx, cy, size, rot = 0) => {
    x.save(); x.translate(cx, cy); x.rotate(rot);
    x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 50 * k; x.shadowOffsetY = 20 * k;
    x.fillStyle = '#000'; x.fillRect(-size / 2, -size / 2, size, size);
    x.shadowColor = 'transparent';
    x.beginPath(); x.rect(-size / 2, -size / 2, size, size); x.clip();
    if (d.cover) fill(d.cover, -size / 2, -size / 2, size, size);
    else {
      const g = x.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
      g.addColorStop(0, A); g.addColorStop(1, '#120608');
      x.fillStyle = g; x.fillRect(-size / 2, -size / 2, size, size);
      x.fillStyle = 'rgba(255,255,255,.9)'; x.font = `${size * .5}px ${DISPLAY}`;
      x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText((d.title || '?')[0], 0, size * .03);
    }
    x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 2 * k; x.strokeRect(-size / 2, -size / 2, size, size);
    x.restore();
  };

  // Procedural vinyl (no image asset needed).
  K.record = (cx, cy, size, rot = 0) => {
    const r = size / 2;
    x.save(); x.translate(cx, cy); x.rotate(rot);
    x.shadowColor = 'rgba(0,0,0,.7)'; x.shadowBlur = 40 * k;
    x.fillStyle = '#0d0d0f'; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill(); x.shadowColor = 'transparent';
    x.strokeStyle = 'rgba(255,255,255,.05)'; x.lineWidth = 1.2 * k;
    for (let i = r * .38; i < r * .97; i += 5 * k) { x.beginPath(); x.arc(0, 0, i, 0, 7); x.stroke(); }
    const sh = x.createLinearGradient(-r, -r, r, r);
    sh.addColorStop(.3, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,255,.12)'); sh.addColorStop(.7, 'rgba(255,255,255,0)');
    x.fillStyle = sh; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill();
    x.beginPath(); x.arc(0, 0, r * .34, 0, 7); x.clip();
    if (d.cover) fill(d.cover, -r * .34, -r * .34, r * .68, r * .68); else { x.fillStyle = A; x.fill(); }
    x.fillStyle = '#0b0b0f'; x.beginPath(); x.arc(0, 0, r * .03, 0, 7); x.fill();
    x.restore();
  };

  // Darkens the text zone so text always reads.
  K.shade = (s = .85) => {
    const g = wide ? x.createLinearGradient(0, 0, W * .6, 0) : x.createLinearGradient(0, H * .5, 0, H * .68);
    g.addColorStop(0, wide ? `rgba(0,0,0,${s})` : 'rgba(0,0,0,0)');
    g.addColorStop(1, wide ? 'rgba(0,0,0,0)' : `rgba(0,0,0,${s})`);
    x.fillStyle = g;
    if (wide) x.fillRect(0, 0, W * .6, H); else { x.fillRect(0, H * .5, W, H * .5); }
  };

  // Font size + wrap so every line fits maxW in <= maxLines (never below 54k).
  K.fit = (text, maxW, start, maxLines) => {
    const words = text.split(/\s+/).filter(Boolean), min = 54 * k;
    const wrap = (s) => {
      x.font = `${s}px ${DISPLAY}`; const lines = []; let cur = '';
      for (const w of words) { const t = cur ? cur + ' ' + w : w; if (cur && x.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t; }
      if (cur) lines.push(cur); return lines;
    };
    for (let s = start; s > min; s -= 2 * k) {
      const lines = wrap(s);
      if (lines.length <= maxLines && lines.every(l => x.measureText(l).width <= maxW)) return { size: s, lines };
    }
    return { size: min, lines: wrap(min) };
  };

  const tk = wide ? k : k * 1.7;
  const kick = (tx, y) => { x.font = `600 ${26 * tk}px ${BODY}`; x.fillStyle = A; x.fillText(d.kicker, tx, y); };
  const tag = (tx, y, align) => {
    if (!d.label) return 0;
    x.font = `700 ${22 * tk}px ${BODY}`;
    const w = x.measureText(d.label).width + 32 * tk, h = 44 * tk, lx = align === 'center' ? tx - w / 2 : tx;
    x.fillStyle = A; x.beginPath(); x.roundRect(lx, y, w, h, 6 * k); x.fill();
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText(d.label, lx + w / 2, y + h * .68);
    x.textAlign = align; return h;
  };
  const foot = (tx, y) => { x.font = `500 ${20 * tk}px ${BODY}`; x.fillStyle = 'rgba(255,255,255,.65)'; x.fillText(d.footer, tx, y); };

  // Kicker + title + tag + footer inside the safe text zone. Always drawn last.
  K.text = () => {
    x.save(); x.textBaseline = 'alphabetic';
    const f = K.fit(d.title, wide ? .36 * W : .88 * W, (wide ? 120 : 150) * k, wide ? 3 : 2);
    const lh = f.size * 1.02, cap = f.size * .9, gap = 22 * k, kh = 26 * k;
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 16 * k;
    if (wide) {
      const tx = .05 * W, blockH = kh + gap + cap + (f.lines.length - 1) * lh + gap + 44 * k;
      let y = H / 2 - blockH / 2 + kh;
      x.textAlign = 'left'; kick(tx, y);
      y += gap + cap; x.font = `${f.size}px ${DISPLAY}`; x.fillStyle = '#fff';
      f.lines.forEach((l, i) => x.fillText(l, tx, y + i * lh));
      y += (f.lines.length - 1) * lh + gap; tag(tx, y, 'left');
      foot(tx, H * .93);
    } else {
      const cx = W / 2; let y = .70 * H - 80 * k + 26 * (tk - k);
      x.textAlign = 'center'; kick(cx, y);
      y += gap + cap; x.font = `${f.size}px ${DISPLAY}`; x.fillStyle = '#fff';
      f.lines.forEach((l, i) => x.fillText(l, cx, y + i * lh));
      y += (f.lines.length - 1) * lh + gap * 1.4; tag(cx, y, 'center');
      foot(cx, H * .96);
    }
    x.restore();
  };

  return K;
}

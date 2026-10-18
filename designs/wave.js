export default {
  name: 'WAVEFORM',
  types: ['beats', 'packs', 'samples', 'video', 'podcast'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox(), s = A.size * .7, n = 36, bw = (A.size * 1.1) / n;
    K.bg(70, .22);
    K.vign();
    K.glowR(A.cx, A.cy, A.size * .7, .3);
    x.fillStyle = d.accent; x.globalAlpha = .75;
    for (let i = 0; i < n; i++) {
      const h = (.15 + K.rnd() * .85) * A.size * .5 * Math.sin(Math.PI * (i + .5) / n);
      x.fillRect(A.cx - A.size * .55 + i * bw, A.cy - h / 2, bw * .6, h);
    }
    x.globalAlpha = 1;
    K.cover(A.cx, A.cy, s);
    K.shade();
    K.text();
  }
};

export default {
  name: 'NEON FRAME',
  types: ['*'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox(), s = A.size * .8, p = 18 * K.k;
    K.bg(70, .15);
    K.vign(.85);
    x.save();
    x.strokeStyle = d.accent; x.lineWidth = 6 * K.k; x.shadowColor = d.accent;
    for (const b of [40, 20]) { x.shadowBlur = b * K.k; x.strokeRect(A.cx - s / 2 - p, A.cy - s / 2 - p, s + p * 2, s + p * 2); }
    x.restore();
    K.cover(A.cx, A.cy, s);
    K.shade();
    K.text();
  }
};

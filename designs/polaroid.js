export default {
  name: 'POLAROID',
  types: ['*'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox(), s = A.size * .78, rot = (K.rnd() - .5) * .14, pad = s * .06;
    K.bg(30, .35);
    K.vign(.7);
    K.glowR(A.cx, A.cy, A.size * .8, .3);
    x.save(); x.translate(A.cx, A.cy); x.rotate(rot);
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 40 * K.k; x.shadowOffsetY = 16 * K.k;
    x.fillStyle = '#f2efe8'; x.fillRect(-s / 2 - pad, -s / 2 - pad, s + pad * 2, s + pad * 4.5);
    x.restore();
    K.cover(A.cx, A.cy, s, rot);
    K.shade();
    K.text();
  }
};

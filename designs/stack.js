export default {
  name: 'STACK',
  types: ['packs', 'samples', 'beats', 'custom'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox(), s = A.size * .72, o = A.size * .07, r = (K.rnd() - .5) * .06;
    K.bg(60, .25);
    K.vign();
    K.glowR(A.cx, A.cy, A.size * .8, .3);
    x.globalAlpha = .55; K.cover(A.cx + o * 1.6, A.cy - o * .6, s, .1 + r);
    x.globalAlpha = .8; K.cover(A.cx + o * .6, A.cy - o * .2, s, .04 + r);
    x.globalAlpha = 1; K.cover(A.cx - o * .5, A.cy + o * .3, s, -.04 + r);
    K.shade();
    K.text();
  }
};

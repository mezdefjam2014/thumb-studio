export default {
  name: 'TILT',
  types: ['*'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox(), s = A.size * .8, sk = -.12 - K.rnd() * .1;
    K.bg(60, .25);
    K.vign();
    K.glowR(A.cx, A.cy + s * .4, A.size * .6, .45);
    x.save(); x.translate(A.cx, A.cy); x.transform(1, sk, 0, 1, 0, 0); x.scale(.92, 1);
    K.cover(0, 0, s); x.restore();
    K.shade();
    K.text();
  }
};

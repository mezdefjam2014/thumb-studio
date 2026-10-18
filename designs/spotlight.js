export default {
  name: 'SPOTLIGHT',
  types: ['*'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox();
    K.bg(60, .25);
    K.vign();
    K.spot(A);
    K.cover(A.cx, A.cy, A.size * .9, (K.rnd() - .5) * .08);
    K.shade();
    K.text();
  }
};

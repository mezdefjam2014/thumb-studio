export default {
  name: 'VINYL SPIN',
  types: ['beats', 'packs', 'samples', 'video'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox(), s = A.size * .82, off = A.size * .16;
    K.bg(80, .2);
    K.vign(.8);
    K.glowR(A.cx, A.cy, A.size * .9, .4);
    K.record(A.cx + off, A.cy, s * .98, K.rnd() * 6.28);
    K.cover(A.cx - off * .7, A.cy, s, 0);
    K.shade();
    K.text();
  }
};

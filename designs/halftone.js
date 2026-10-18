export default {
  name: 'HALFTONE',
  types: ['*'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox();
    x.fillStyle = '#0c0c10'; x.fillRect(0, 0, W, H);
    K.dots(0, 0, W, H, 20, .18);
    K.vign(.9);
    x.fillStyle = d.accent;
    x.beginPath(); x.arc(A.cx, A.cy, A.size * .48, 0, 7); x.fill();
    K.cover(A.cx, A.cy, A.size * .66, (K.rnd() - .5) * .1);
    K.shade();
    K.text();
  }
};

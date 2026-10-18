export default {
  name: 'COLOR SLAB',
  types: ['*'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox();
    x.fillStyle = '#0b0b0f'; x.fillRect(0, 0, W, H);
    x.fillStyle = d.accent; x.beginPath();
    if (K.wide) { x.moveTo(W * .52, 0); x.lineTo(W, 0); x.lineTo(W, H); x.lineTo(W * .45, H); }
    else { x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W, H * .5); x.lineTo(0, H * .58); }
    x.fill();
    K.cover(A.cx, A.cy, A.size * .84, (K.rnd() - .5) * .08);
    K.shade(.6);
    K.text();
  }
};

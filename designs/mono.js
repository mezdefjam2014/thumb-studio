export default {
  name: 'MONO',
  types: ['*'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    const A = K.artBox(), s = A.size * .86;
    x.filter = 'grayscale(1)'; K.bg(50, .3); x.filter = 'none';
    K.vign();
    x.filter = 'grayscale(1) contrast(1.25)'; K.cover(A.cx, A.cy, s); x.filter = 'none';
    x.save(); x.globalCompositeOperation = 'multiply'; x.fillStyle = d.accent;
    x.fillRect(A.cx - s / 2, A.cy - s / 2, s, s); x.restore();
    K.shade();
    K.text();
  }
};

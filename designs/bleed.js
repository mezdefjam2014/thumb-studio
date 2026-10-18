import { hexA } from '../core/kit.js';
export default {
  name: 'FULL BLEED',
  types: ['*'],
  ratios: ['16:9', '9:16'],
  draw(x, W, H, d, K) {
    K.bg(40, .2);
    const g = K.wide ? x.createLinearGradient(W * .42, 0, W * .62, 0) : x.createLinearGradient(0, H * .5, 0, H * .64);
    if (K.wide) K.coverIn(W * .42, 0, W * .58, H); else K.coverIn(0, 0, W, H * .64);
    g.addColorStop(0, 'rgba(11,11,15,1)'); g.addColorStop(1, 'rgba(11,11,15,0)');
    x.fillStyle = g;
    if (K.wide) x.fillRect(W * .42, 0, W * .2, H); else x.fillRect(0, H * .5, W, H * .14);
    x.fillStyle = hexA(d.accent, .9);
    if (K.wide) x.fillRect(W * .05, H * .08, 80 * K.k, 6 * K.k); else x.fillRect(W / 2 - 60 * K.k, H * .64, 120 * K.k, 6 * K.k);
    K.shade(.9);
    K.text();
  }
};

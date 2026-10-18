import { makeKit } from './kit.js';

export const SIZES = { '16:9': [1280, 720], '9:16': [1080, 1920] };

// One design + ratio + data -> finished canvas.
export function make(design, ratio, data, canvas = document.createElement('canvas')) {
  const [W, H] = SIZES[ratio];
  canvas.width = W; canvas.height = H;
  const x = canvas.getContext('2d');
  x.reset?.();
  design.draw(x, W, H, data, makeKit(x, W, H, data));
  return canvas;
}

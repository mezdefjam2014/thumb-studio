// In-browser background removal. The image never leaves the browser;
// only the model files are fetched from the CDN on first use, then cached.
let lib;

const hasAlpha = (img) => {
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0, 64, 64);
  const a = g.getImageData(0, 0, 64, 64).data;
  let clear = 0; for (let i = 3; i < a.length; i += 4) if (a[i] < 20) clear++;
  return clear > 64 * 64 * .05;
};

const load = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });

// Crop to the visible pixels so cut-outs anchor cleanly at their bottom edge.
function trim(img) {
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const { data, width: w, height: h } = g.getImageData(0, 0, c.width, c.height);
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 <= x0 || y1 <= y0) return c;
  const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
  o.getContext('2d').drawImage(c, -x0, -y0); return o;
}

export async function cutout(file, onStep) {
  const orig = await load(URL.createObjectURL(file));
  if (hasAlpha(orig)) return trim(orig); // already a cut-out PNG
  onStep?.('Loading cut-out model…');
  lib ||= import('https://esm.sh/@imgly/background-removal@1.5.5');
  const { removeBackground } = await lib;
  onStep?.('Cutting out…');
  const blob = await removeBackground(file, { progress: (k, cur, tot) => tot && onStep?.(`Model ${Math.round(cur / tot * 100)}%`) });
  return trim(await load(URL.createObjectURL(blob)));
}

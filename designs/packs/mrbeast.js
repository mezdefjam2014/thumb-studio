// MrBeast-style pack: 10 layouts from docs/RESEARCH.md §1 (zones in % of frame).
// Each layout x 8 palettes (POP_PRESETS) = 80 templates. d.person = main face, d.person2 = second, d.item = prop.
import { pop } from '../../core/pop.js';

const L = (name, draw) => ({ name, niche: 'mrbeast', types: ['*'], ratios: ['16:9', '9:16'], draw(x, W, H, d, K, P) { draw(x, W, H, d, pop(x, W, H, d, K, P), K.wide, P); } });

// Prop: cut-out if given, else the main image in a framed box.
const prop = (U, d, b, cx, bottom, h, rot = 0) => d.item ? U.cutout(d.item, cx, bottom, h, { rim: '#fff' }) : U.imgBox(d.cover, U.box(b), { rot });

export default [
  L('SHOCK + GIANT', (x, W, H, d, U, w) => {
    U.bg('rays');
    if (w) { prop(U, d, [.42, .08, .52, .68], .68 * W, .8 * H, .76 * H, .03); U.cutout(d.person, .2 * W, H * 1.02, .92 * H); U.words(d.big, U.box([.42, .03, .54, .3]), { rot: -.03 }); }
    else { prop(U, d, [.08, .28, .84, .3], .5 * W, .58 * H, .3 * H, .02); U.cutout(d.person, .5 * W, .97 * H, .42 * H); U.words(d.big, U.box([.06, .08, .76, .17]), { rot: -.03 }); }
    U.finish();
  }),
  L('MONEY PILE', (x, W, H, d, U, w) => {
    U.bg('rays'); U.glow(W / 2, w ? .45 * H : .4 * H, w ? .5 * H : .45 * W, '#fff', .5);
    if (w) { U.cutout(d.person, .55 * W, .8 * H, .72 * H); U.cash(0, .58 * H, W, .42 * H); U.words(U.num('$10,000'), U.box([.03, .06, .4, .3]), { rot: -.05, fill: '#7CFF4D' }); }
    else { U.cutout(d.person, .5 * W, .64 * H, .4 * H); U.cash(0, .56 * H, W, .3 * H); U.words(U.num('$10,000'), U.box([.06, .08, .76, .17]), { rot: -.04, fill: '#7CFF4D' }); }
    U.finish({ vig: .35 });
  }),
  L('SPLIT VS', (x, W, H, d, U, w, P) => {
    U.bg('split');
    const B = d.person2 || d.item;
    if (w) {
      U.cutout(d.person, .25 * W, H * 1.02, .86 * H, { rim: P.bg[0] });
      B ? U.cutout(B, .75 * W, .8 * H, .72 * H, { flip: true, rim: '#fff' }) : U.imgBox(d.cover, U.box([.58, .12, .36, .6]), { rot: .04 });
      U.badge('VS', .5 * W, .45 * H, { size: 86, bg: '#111', fg: P.fg, rot: -.08 });
      U.words(d.big, U.box([.03, .7, .42, .26]), { align: 'left' });
    } else {
      U.cutout(d.person, .5 * W, .49 * H, .3 * H, { rim: P.bg[0] });
      B ? U.cutout(B, .5 * W, .9 * H, .3 * H, { flip: true, rim: '#fff' }) : U.imgBox(d.cover, U.box([.12, .56, .76, .26]), { rot: .03 });
      U.badge('VS', .5 * W, .51 * H, { size: 80, bg: '#111', fg: P.fg, rot: -.08 });
      U.words(d.big, U.box([.06, .08, .76, .1]));
    }
    U.finish();
  }),
  L('SCALE SHOT', (x, W, H, d, U, w) => {
    U.bg('grad');
    if (w) { prop(U, d, [.3, .06, .64, .72], .64 * W, .86 * H, .84 * H, -.02); U.cutout(d.person, .14 * W, .97 * H, .42 * H); U.arrow(.2 * W, .5 * H, .34 * W, .3 * H, { w: 16 }); U.words(d.big, U.box([.02, .04, .3, .42]), { maxLines: 3, align: 'left' }); }
    else { prop(U, d, [.08, .24, .84, .38], .5 * W, .62 * H, .4 * H, -.02); U.cutout(d.person, .25 * W, .92 * H, .26 * H); U.arrow(.36 * W, .72 * H, .5 * W, .6 * H, { w: 16 }); U.words(d.big, U.box([.06, .08, .76, .17])); }
    U.finish();
  }),
  L('COUNTDOWN', (x, W, H, d, U, w, P) => {
    U.bg('grad');
    const slab = (b) => { x.save(); x.translate(b.x + b.w / 2, b.y + b.h / 2); x.rotate(-.05); x.fillStyle = P.pop; x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 30 * U.u; x.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); x.restore(); };
    if (w) { slab(U.box([.05, .14, .4, .52])); U.words(U.num(), U.box([.05, .12, .4, .56]), { rot: -.05 }); U.words(U.rest(), U.box([.04, .7, .42, .18])); U.cutout(d.person, .74 * W, H * 1.02, .94 * H); }
    else { slab(U.box([.12, .12, .68, .22])); U.words(U.num(), U.box([.1, .11, .72, .24]), { rot: -.05 }); U.words(U.rest(), U.box([.06, .37, .76, .07])); U.cutout(d.person, .5 * W, .95 * H, .46 * H); }
    U.finish();
  }),
  L('TRIPLE FACE', (x, W, H, d, U, w, P) => {
    U.bg('rays');
    const side = d.person2 || d.person;
    if (w) { U.cutout(side, .13 * W, .98 * H, .52 * H, { rim: P.pop }); U.cutout(side, .86 * W, .78 * H, .48 * H, { flip: true, rim: P.pop }); U.cutout(d.person, .5 * W, H * 1.03, .82 * H); U.words(U.hero(), U.box([.3, .02, .4, .18])); }
    else { U.cutout(side, .2 * W, .52 * H, .2 * H, { rim: P.pop }); U.cutout(side, .8 * W, .52 * H, .2 * H, { flip: true, rim: P.pop }); U.cutout(d.person, .5 * W, .9 * H, .48 * H); U.words(U.hero(), U.box([.1, .1, .7, .1])); }
    U.finish();
  }),
  L('BEFORE / AFTER', (x, W, H, d, U, w, P) => {
    U.bg('flat');
    const half = (pts, img, gray) => { x.save(); x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a * W, b * H) : x.moveTo(a * W, b * H)); x.closePath(); x.clip(); U.imgBox(img, { x: -10, y: -10, w: W + 20, h: H + 20 }, { gray, r: 0 }); x.restore(); };
    const A = w ? [[0, 0], [.45, 0], [.55, 1], [0, 1]] : [[0, 0], [1, 0], [1, .45], [0, .55]], B = w ? [[.45, 0], [1, 0], [1, 1], [.55, 1]] : [[0, .45], [1, .45], [1, 1], [0, 1]];
    half(A, d.cover, true); half(B, d.item || d.cover, false);
    x.strokeStyle = '#fff'; x.lineWidth = 14 * U.u; x.beginPath();
    w ? (x.moveTo(.45 * W, 0), x.lineTo(.55 * W, H)) : (x.moveTo(0, .55 * H), x.lineTo(W, .45 * H)); x.stroke();
    if (w) { U.badge('BEFORE', .2 * W, .1 * H, { bg: '#333' }); U.badge('AFTER', .78 * W, .1 * H); U.arrow(.36 * W, .5 * H, .64 * W, .5 * H, { bend: -.25, w: 24 }); U.words(d.big, U.box([.03, .68, .4, .28]), { align: 'left' }); }
    else { U.badge('BEFORE', .3 * W, .16 * H, { bg: '#333' }); U.badge('AFTER', .3 * W, .62 * H); U.arrow(.7 * W, .36 * H, .7 * W, .62 * H, { bend: .3, w: 24 }); U.words(d.big, U.box([.06, .74, .76, .1])); }
    U.finish({ vig: .3 });
  }),
  L('CIRCLE CALLOUT', (x, W, H, d, U, w) => {
    U.bg('photo'); if (!d.cover) U.imgBox(null, { x: -10, y: -10, w: W + 20, h: H + 20 }, { r: 0, label: 'MAIN IMAGE' });
    if (w) { U.ring(.68 * W, .42 * H, .12 * H); U.cutout(d.person, .16 * W, .99 * H, .52 * H); U.arrow(.3 * W, .66 * H, .6 * W, .5 * H, { w: 20 }); U.words(d.big, U.box([.03, .03, .55, .28]), { align: 'left' }); }
    else { U.ring(.6 * W, .38 * H, .14 * W); U.cutout(d.person, .28 * W, .82 * H, .32 * H); U.arrow(.4 * W, .58 * H, .55 * W, .45 * H, { w: 20 }); U.words(d.big, U.box([.06, .08, .76, .17])); }
    U.finish();
  }),
  L('POINTING HOST', (x, W, H, d, U, w) => {
    U.bg('grad');
    if (w) { prop(U, d, [.05, .27, .44, .6], .27 * W, .9 * H, .62 * H, -.03); U.cutout(d.person, .78 * W, H * 1.02, .94 * H, { flip: true }); U.arrow(.62 * W, .45 * H, .5 * W, .55 * H, { w: 18, bend: -.4 }); U.words(d.big, U.box([.04, .02, .46, .26])); }
    else { prop(U, d, [.08, .24, .84, .3], .5 * W, .55 * H, .3 * H, -.03); U.cutout(d.person, .55 * W, .95 * H, .38 * H, { flip: true }); U.words(d.big, U.box([.06, .08, .76, .17])); }
    U.finish();
  }),
  L('LAST STANDING', (x, W, H, d, U, w, P) => {
    U.bg('grad');
    if (w) { U.crowd(.42 * H, H, P.bg[1]); U.cutout(d.person, .34 * W, H * 1.02, .88 * H); U.words(d.big, U.box([.5, .03, .47, .36]), { rot: .03 }); }
    else { U.crowd(.5 * H, H, P.bg[1]); U.cutout(d.person, .5 * W, .95 * H, .5 * H); U.words(d.big, U.box([.06, .08, .76, .17])); }
    U.finish();
  })
];

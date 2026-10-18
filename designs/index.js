import spotlight from './spotlight.js';
import vinylSpin from './vinyl-spin.js';
import polaroid from './polaroid.js';
import neon from './neon.js';
import stack from './stack.js';
import bleed from './bleed.js';
import halftone from './halftone.js';
import mono from './mono.js';
import wave from './wave.js';
import slab from './slab.js';
import tilt from './tilt.js';
import mrbeast from './packs/mrbeast.js';
import { POP_PRESETS } from '../core/pop.js';

// A pack layout x its palettes -> one template per combination.
const expand = (layouts, presets) => presets.flatMap((p) => layouts.map((l) => ({ ...l, name: `${l.name} · ${p.name}`, preset: p })));

const classic = [spotlight, vinylSpin, polaroid, neon, stack, bleed, halftone, mono, wave, slab, tilt]
  .map((dz) => ({ niche: dz.types.includes('*') ? 'classic' : 'music', ...dz }));

export default [...expand(mrbeast, POP_PRESETS), ...classic];

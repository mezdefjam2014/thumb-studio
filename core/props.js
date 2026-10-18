// Built-in prop cut-outs (assets/props/<cat>/<name>.webp, made by tools/cut_props.py).
// All load once at startup; designs read them through d.prop(cat, name).
const imgs = {};
export let PROPS = {};

export async function loadProps() {
  try {
    PROPS = await (await fetch('assets/props/manifest.json')).json();
    await Promise.all(Object.entries(PROPS).flatMap(([c, names]) => names.map((n) => new Promise((ok) => {
      const i = new Image(); i.onload = () => { imgs[`${c}/${n}`] = i; ok(); }; i.onerror = ok; i.src = `assets/props/${c}/${n}.webp`;
    }))));
  } catch { PROPS = {}; }
}

export const prop = (cat, name) => imgs[`${cat}/${name}`] || null;

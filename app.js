import designs from './designs/index.js';
import { make } from './core/render.js';
import { makePackage } from './core/package.js';
import { tagLen } from './core/tags.js';
import { rng } from './core/kit.js';
import { cutout } from './core/cutout.js';

import { WORDS } from './core/words.js';
const $ = (id) => document.getElementById(id);
const seed = () => (Math.random() * 1e9) | 0;
const S = { ratio: '16:9', cover: null, person: null, item: null, seeds: designs.map(seed), locks: new Set(), picked: -1 };

function data(i) {
  const type = $('type').value, w = WORDS[type], lab = w.label, kick = w.kicker;
  return {
    title: $('title').value.trim().toUpperCase() || 'UNTITLED',
    label: ($('label').value.trim() || lab).toUpperCase(),
    kicker: ($('ep').value.trim() && w.f.ep ? `${kick} · ${w.f.ep.replace('#', $('ep').value.trim())}` : kick).toUpperCase(), footer: $('footer').value.trim(), cover: S.cover, person: S.person, person2: S.person2, item: S.item,
    big: ($('big').value.trim() || $('title').value.trim().split(/\s+/).slice(0, 3).join(' ')).toUpperCase(),
    accent: $('accent').value, type, seed: S.seeds[i] || 1,
    bpm: w.f.bpm ? $('bpm').value.trim() : '', key: w.f.key ? $('key').value.trim().toUpperCase() : ''
  };
}
const fits = (dz, type) => dz.ratios.includes(S.ratio) && (dz.types.includes('*') || dz.types.includes(type)) && ($('niche').value === '*' || dz.niche === $('niche').value);

// Cards draw only when scrolled into view (hundreds of templates).
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  io.unobserve(e.target); const i = +e.target.dataset.i;
  make(designs[i], S.ratio, data(i), e.target);
}), { rootMargin: '400px' });

function render() {
  const grid = $('grid'), type = $('type').value;
  grid.className = 'grid' + (S.ratio === '9:16' ? ' tall' : '');
  grid.innerHTML = ''; io.disconnect();
  document.documentElement.style.setProperty('--accent', $('accent').value);
  let n = 0;
  designs.forEach((dz, i) => {
    if (!fits(dz, type)) return; n++;
    const card = document.createElement('div');
    card.className = 'card' + (S.picked === i ? ' picked' : '');
    const cv = document.createElement('canvas'); cv.dataset.i = i;
    card.append(cv); io.observe(cv);
    const bar = document.createElement('div'); bar.className = 'bar';
    bar.innerHTML = `<span>${dz.name}</span><button class="lk${S.locks.has(i) ? ' locked' : ''}" title="Lock">LOCK</button><button class="dl" title="Download PNG">PNG</button>`;
    card.append(bar);
    card.onclick = (e) => {
      if (e.target.closest('.lk')) { S.locks.has(i) ? S.locks.delete(i) : S.locks.add(i); return render(); }
      if (e.target.closest('.dl')) return download(make(dz, S.ratio, data(i)), dz);
      S.picked = S.picked === i ? -1 : i; render(); renderPacks();
    };
    grid.append(card);
  });
  $('shuffle').textContent = `SHUFFLE (${n})`;
}

// Downloads: a chosen folder (FOLDER button) saves straight in; otherwise a Save-as window each time.
// Browsers without the file pickers (Firefox, Safari) fall back to their normal download.
let saveDir = null;
async function download(cv, dz) {
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const name = `${slug($('title').value || 'thumb')}-${slug(dz.name)}-${S.ratio.replace(':', 'x')}.png`;
  const blob = await new Promise((ok) => cv.toBlob(ok, 'image/png'));
  try {
    let fh;
    if (saveDir) fh = await saveDir.getFileHandle(name, { create: true });
    else if (window.showSaveFilePicker) fh = await showSaveFilePicker({ suggestedName: name, types: [{ description: 'PNG image', accept: { 'image/png': ['.png'] } }] });
    if (fh) { const w = await fh.createWritable(); await w.write(blob); await w.close(); return; }
  } catch (e) { if (e.name === 'AbortError') return; console.warn(e); }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
$('folder').hidden = !window.showDirectoryPicker;
$('folder').onclick = async () => {
  try { saveDir = await showDirectoryPicker({ mode: 'readwrite' }); $('folder').textContent = 'FOLDER: ' + saveDir.name; $('folder').title = 'Downloads save here. Reload the page to go back to Save-as.'; }
  catch (e) { if (e.name !== 'AbortError') console.warn(e); }
};

async function loadSlot(slot, el, file) {
  if (!file || !file.type.startsWith('image/')) return;
  const span = el.querySelector('span'), show = (t) => { span.hidden = false; span.textContent = t; };
  let img;
  if (el.hasAttribute('data-cut')) {
    el.classList.add('busy');
    try { img = await cutout(file, show); }
    catch (e) { console.warn(e); show('Cut-out failed, using photo'); img = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = URL.createObjectURL(file); }); }
    el.classList.remove('busy');
  } else img = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = URL.createObjectURL(file); });
  S[slot] = img;
  el.style.backgroundImage = `url(${img.toDataURL ? img.toDataURL() : img.src})`; span.hidden = true;
  render(); renderPacks();
}

// ---- YouTube packages ----
const input = () => {
  const v = (id) => $(id).value.trim(), f = WORDS[$('type').value].f;
  return { title: v('title') || 'Untitled', type: $('type').value, artist: v('artist'), genre: v('genre'), mood: v('mood'), bpm: f.bpm ? v('bpm') : '', key: f.key ? v('key') : '', ep: f.ep ? v('ep') : '', epLabel: f.ep || '', link: v('link'), footer: v('footer') };
};
function genPacks() { const off = seed(); S.pkgs = Array.from({ length: +$('count').value }, (_, n) => makePackage(input(), rng(seed()), off + n)); renderPacks(); }

const LIMITS = { title: 100, desc: 5000, pin: 0, thumb: 0 };
function field(name, key, pk) {
  const el = document.createElement('div'); el.className = 'fld';
  const n = pk[key].length, lim = LIMITS[key];
  el.innerHTML = `<div class="h">${name}<span class="${lim && n > lim ? 'bad' : ''}">${lim ? n + '/' + lim : ''}</span><button>COPY</button></div><textarea rows="${key === 'desc' ? 8 : 2}"></textarea>`;
  const ta = el.querySelector('textarea'); ta.value = pk[key];
  ta.oninput = () => { pk[key] = ta.value; if (lim) el.querySelector('span').textContent = ta.value.length + '/' + lim; };
  el.querySelector('button').onclick = (e) => copy(pk[key], e.target);
  return el;
}
function copy(text, btn) {
  navigator.clipboard.writeText(text).then(() => { btn.textContent = 'COPIED'; setTimeout(() => btn.textContent = 'COPY', 1200); });
}
function renderPacks() {
  const box = $('packs'); box.innerHTML = '';
  const list = designs.map((dz, i) => i).filter((i) => fits(designs[i], $('type').value));
  S.pkgs.forEach((pk, n) => {
    const card = document.createElement('div'); card.className = 'pk';
    const di = S.picked >= 0 ? S.picked : list[n % list.length];
    const thumbData = { ...data(di), title: pk.thumb };
    card.append(make(designs[di], '16:9', thumbData));
    card.append(field('TITLE', 'title', pk), field('DESCRIPTION', 'desc', pk));
    const tg = document.createElement('div'); tg.className = 'fld';
    const len = tagLen(pk.tags);
    tg.innerHTML = `<div class="h">TAGS<span class="${len > 500 ? 'bad' : ''}">${len}/500</span><button>COPY</button></div><div class="chips"></div>`;
    pk.tags.forEach((t, j) => { const c = document.createElement('i'); c.textContent = t; c.title = 'Remove'; c.onclick = () => { pk.tags.splice(j, 1); renderPacks(); }; tg.lastChild.append(c); });
    tg.querySelector('button').onclick = (e) => copy(pk.tags.join(', '), e.target);
    card.append(tg, field('PINNED COMMENT', 'pin', pk), field('THUMBNAIL TEXT', 'thumb', pk));
    box.append(card);
  });
}
S.pkgs = [];
$('regen').onclick = genPacks;
$('count').onchange = genPacks;
['artist', 'genre', 'mood', 'bpm', 'key', 'ep', 'link'].forEach((id) => $(id).addEventListener('input', () => { clearTimeout(t); t = setTimeout(genPacks, 300); }));

let t;
const later = () => { clearTimeout(t); t = setTimeout(() => { render(); genPacks(); }, 150); };
['title', 'big', 'label', 'footer', 'accent', 'ep'].forEach((id) => $(id).addEventListener('input', later));
// Type select grouped Music / Video; fields relabel per type.
const groups = {};
for (const [id, w] of Object.entries(WORDS)) (groups[w.group] ||= []).push(`<option value="${id}">${w.label || 'Custom'}</option>`);
$('type').innerHTML = Object.entries(groups).map(([g, o]) => `<optgroup label="${g}">${o.join('')}</optgroup>`).join('');
$('type').value = 'gaming';
function fields() {
  const f = WORDS[$('type').value].f;
  document.querySelectorAll('[data-f]').forEach((l) => { const v = f[l.dataset.f]; l.hidden = !v; if (v) l.firstChild.textContent = v === 1 ? l.dataset.f.toUpperCase() : v; });
}
fields();
$('type').onchange = () => { fields(); render(); genPacks(); };
$('ratio').onclick = (e) => {
  const r = e.target.dataset.r; if (!r) return;
  S.ratio = r; [...$('ratio').children].forEach((b) => b.classList.toggle('on', b.dataset.r === r)); render();
};
$('shuffle').onclick = () => { S.seeds = S.seeds.map((s, i) => S.locks.has(i) ? s : seed()); render(); };
document.querySelectorAll('[data-slot]').forEach((el) => {
  const slot = el.dataset.slot;
  el.querySelector('input').onchange = (e) => loadSlot(slot, el, e.target.files[0]);
  el.ondragover = (e) => { e.preventDefault(); el.classList.add('over'); };
  el.ondragleave = () => el.classList.remove('over');
  el.ondrop = (e) => { e.preventDefault(); el.classList.remove('over'); loadSlot(slot, el, e.dataTransfer.files[0]); };
});
$('niche').onchange = render;

document.fonts.ready.then(() => { render(); genPacks(); });

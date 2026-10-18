import designs from './designs/index.js';
import { make } from './core/render.js';

const TYPES = {
  beats: ['TYPE BEAT', 'NEW BEAT'], packs: ['SAMPLE PACK', 'NEW SAMPLE PACK'],
  samples: ['SINGLE SAMPLE', 'NEW SAMPLE'], video: ['MUSIC VIDEO', 'NEW VIDEO'],
  podcast: ['PODCAST', 'NEW EPISODE'], product: ['PRODUCT', 'NEW DROP'], custom: ['', 'NEW']
};
const $ = (id) => document.getElementById(id);
const seed = () => (Math.random() * 1e9) | 0;
const S = { ratio: '16:9', cover: null, seeds: designs.map(seed), locks: new Set(), picked: -1 };

function data(i) {
  const type = $('type').value, [lab, kick] = TYPES[type];
  return {
    title: $('title').value.trim().toUpperCase() || 'UNTITLED',
    label: ($('label').value.trim() || lab).toUpperCase(),
    kicker: kick, footer: $('footer').value.trim(), cover: S.cover,
    accent: $('accent').value, type, seed: S.seeds[i]
  };
}
const fits = (dz, type) => dz.ratios.includes(S.ratio) && (dz.types.includes('*') || dz.types.includes(type));

function render() {
  const grid = $('grid'), type = $('type').value;
  grid.className = 'grid' + (S.ratio === '9:16' ? ' tall' : '');
  grid.innerHTML = '';
  document.documentElement.style.setProperty('--accent', $('accent').value);
  designs.forEach((dz, i) => {
    if (!fits(dz, type)) return;
    const card = document.createElement('div');
    card.className = 'card' + (S.picked === i ? ' picked' : '');
    const cv = make(dz, S.ratio, data(i));
    card.append(cv);
    const bar = document.createElement('div'); bar.className = 'bar';
    bar.innerHTML = `<span>${dz.name}</span><button class="lk${S.locks.has(i) ? ' locked' : ''}" title="Lock">LOCK</button><button class="dl" title="Download PNG">PNG</button>`;
    card.append(bar);
    card.onclick = (e) => {
      if (e.target.closest('.lk')) { S.locks.has(i) ? S.locks.delete(i) : S.locks.add(i); return render(); }
      if (e.target.closest('.dl')) return download(cv, dz);
      S.picked = S.picked === i ? -1 : i; render();
    };
    grid.append(card);
  });
}

function download(cv, dz) {
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  cv.toBlob((b) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `${slug($('title').value || 'thumb')}-${slug(dz.name)}-${S.ratio.replace(':', 'x')}.png`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }, 'image/png');
}

function loadCover(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const url = URL.createObjectURL(file), img = new Image();
  img.onload = () => { S.cover = img; $('drop').style.backgroundImage = `url(${url})`; $('dropTxt').textContent = ''; render(); };
  img.src = url;
}

let t;
const later = () => { clearTimeout(t); t = setTimeout(render, 150); };
['title', 'label', 'footer', 'accent'].forEach((id) => $(id).addEventListener('input', later));
$('type').onchange = render;
$('ratio').onclick = (e) => {
  const r = e.target.dataset.r; if (!r) return;
  S.ratio = r; [...$('ratio').children].forEach((b) => b.classList.toggle('on', b.dataset.r === r)); render();
};
$('shuffle').onclick = () => { S.seeds = S.seeds.map((s, i) => S.locks.has(i) ? s : seed()); render(); };
$('cover').onchange = (e) => loadCover(e.target.files[0]);
const drop = $('drop');
drop.ondragover = (e) => { e.preventDefault(); drop.classList.add('over'); };
drop.ondragleave = () => drop.classList.remove('over');
drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove('over'); loadCover(e.dataTransfer.files[0]); };

document.fonts.ready.then(render);

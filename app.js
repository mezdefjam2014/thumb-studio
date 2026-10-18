import designs from './designs/index.js';
import { make } from './core/render.js';
import { makePackage } from './core/package.js';
import { tagLen } from './core/tags.js';
import { rng } from './core/kit.js';

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
      S.picked = S.picked === i ? -1 : i; render(); renderPacks();
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
  img.onload = () => { S.cover = img; $('drop').style.backgroundImage = `url(${url})`; $('dropTxt').textContent = ''; render(); renderPacks(); };
  img.src = url;
}

// ---- YouTube packages ----
const input = () => {
  const v = (id) => $(id).value.trim();
  return { title: v('title') || 'Untitled', type: $('type').value, artist: v('artist'), genre: v('genre'), mood: v('mood'), bpm: v('bpm'), key: v('key'), link: v('link'), footer: v('footer') };
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
['artist', 'genre', 'mood', 'bpm', 'key', 'link'].forEach((id) => $(id).addEventListener('input', () => { clearTimeout(t); t = setTimeout(genPacks, 300); }));

let t;
const later = () => { clearTimeout(t); t = setTimeout(() => { render(); genPacks(); }, 150); };
['title', 'label', 'footer', 'accent'].forEach((id) => $(id).addEventListener('input', later));
$('type').onchange = () => { render(); genPacks(); };
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

document.fonts.ready.then(() => { render(); genPacks(); });

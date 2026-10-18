import { WORDS } from './words.js';
import { buildTags, fitTags } from './tags.js';

const cap = (s) => String(s || '').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '').replace(/\s*\|\s*$/, '').replace(/\(\s*\)|\s{2,}/g, ' ').trim();

// Templates per type; ones missing a needed field are skipped.
const TITLES = {
  beats: [['[FREE] {Artist} Type Beat - "{Title}" | {Genre} {Year}', 'Artist'], ['{Artist} Type Beat "{Title}" | {Mood} {Genre} Instrumental', 'Artist'], ['"{Title}" - {Mood} {Genre} Beat | {BPM} BPM {Key}', 'BPM'], ['[FREE] {Genre} Type Beat - "{Title}" ({Year})']],
  packs: [['{Title} - Sample Pack | {Genre} Samples ({Year})'], ['[FREE] {Genre} Sample Pack - "{Title}" | {Mood} Samples'], ['{Title} | {Mood} {Genre} Sample Pack {Year}']],
  samples: [['"{Title}" {Mood} {Genre} Sample | {BPM} BPM {Key}', 'BPM'], ['[FREE] {Genre} Sample - "{Title}" ({Year})'], ['{Mood} {Genre} Sample "{Title}" | Royalty Free']],
  video: [['{Artist} - {Title} (Official Music Video)', 'Artist'], ['{Title} (Official Video) | {Genre} {Year}']],
  podcast: [['{Title} | {Label} {Year}'], ['{Title} - {Mood} {Genre} Podcast']],
  product: [['{Title} - Honest Review ({Year})'], ['{Title} | Everything You Need To Know']],
  custom: [['{Title}'], ['{Title} | {Genre} {Year}']]
};

export function makePackage(p, rnd = Math.random, n = -1) {
  const w = WORDS[p.type], y = String(new Date().getFullYear());
  const v = { Title: cap(p.title), Artist: cap(p.artist), Genre: cap(p.genre), Mood: cap(p.mood), BPM: p.bpm, Key: p.key, Label: w.label, Year: y };
  const pool = TITLES[p.type].filter(([, need]) => !need || v[need]);
  let title = fill(pool[n >= 0 ? n % pool.length : Math.floor(rnd() * pool.length)][0], v).replace(/\[FREE\]\s+Type/, '[FREE]');
  if (title.length > 100) title = title.slice(0, 99).replace(/\s\S*$/, '');

  const tags = fitTags(buildTags(p));
  const hash = [p.genre, w.tag, p.artist && p.type === 'beats' && `${p.artist} type beat`]
    .filter(Boolean).slice(0, 3).map((t) => '#' + t.replace(/[^a-z0-9]/gi, '').toLowerCase());
  const hooks = [`${w.verb} "${v.Title}" now.`, `New ${w.noun}: "${v.Title}".`, `"${v.Title}" is here.`];
  const details = [p.bpm && `BPM: ${p.bpm}`, p.key && `Key: ${p.key}`, v.Genre && `Genre: ${v.Genre}`, v.Mood && `Mood: ${v.Mood}`].filter(Boolean);
  const desc = [hash.join(' '), '', hooks[Math.floor(rnd() * hooks.length)], p.link && `${w.verb}: ${p.link}`, '',
    details.join('\n'), details.length ? '' : null, w.use, '', p.footer].filter((l) => l !== null && l !== false && l !== undefined)
    .join('\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, 5000);

  const pins = [`${w.verb} "${v.Title}" here: ${p.link || '(link)'}`, `Which ${w.noun} should I drop next? ${p.link ? '👉 ' + p.link : ''}`, `Like + subscribe for more ${w.nouns}. ${p.link || ''}`];
  const words = [...String(p.title).split(/\s+/), p.mood].filter(Boolean);
  const thumb = words.slice(0, 2 + Math.floor(rnd() * 2)).join(' ').toUpperCase();
  return { title, desc, tags, pin: pins[Math.floor(rnd() * pins.length)].trim(), thumb };
}

import { WORDS } from './words.js';
import { buildTags, fitTags } from './tags.js';

const cap = (s) => String(s || '').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '').replace(/\s*\|\s*$/, '').replace(/\(\s*\)|\s{2,}/g, ' ').trim();

// Templates per type; ones missing a needed field are skipped.
const TITLES = {
  beats: [['[FREE] {Name} Type Beat - "{Title}" | {Cat} {Year}', 'Name'], ['{Name} Type Beat "{Title}" | {Mood} {Cat} Instrumental', 'Name'], ['"{Title}" - {Mood} {Cat} Beat | {BPM} BPM {Key}', 'BPM'], ['[FREE] {Cat} Type Beat - "{Title}" ({Year})']],
  packs: [['{Title} - Sample Pack | {Cat} Samples ({Year})'], ['[FREE] {Cat} Sample Pack - "{Title}" | {Mood} Samples'], ['{Title} | {Mood} {Cat} Sample Pack {Year}']],
  samples: [['"{Title}" {Mood} {Cat} Sample | {BPM} BPM {Key}', 'BPM'], ['[FREE] {Cat} Sample - "{Title}" ({Year})'], ['{Mood} {Cat} Sample "{Title}" | Royalty Free']],
  video: [['{Name} - {Title} (Official Music Video)', 'Name'], ['{Title} (Official Video) | {Cat} {Year}']],
  gaming: [['{Title} in {Name}', 'Name'], ['{Title} | {Name} {Cat} {EpT}', 'Name'], ['{Title} {EpT}']],
  vlog: [['{Title} | {Name} Vlog', 'Name'], ['{Title} {EpT}'], ['{Mood} {Title} ({Cat} Vlog)', 'Mood']],
  tutorial: [['How To {Title} in {Name} ({Mood} Guide)', 'Name'], ['{Title} - {Cat} Tutorial for {Mood}s', 'Mood'], ['{Title} | {Name} Tutorial {Year}', 'Name'], ['{Title} (Step by Step)']],
  review: [['{Name} Review: {Title}', 'Name'], ['{Title} - Is {Name} {Mood}?', 'Mood'], ['{Title} | Honest {Cat} Review {Year}']],
  reaction: [['Reacting To {Name}: {Title}', 'Name'], ['{Title} ({Mood} Reaction)', 'Mood'], ['{Title} | {Cat} Reaction']],
  news: [['{Title} | {Name} News', 'Name'], ['{Title} - What It Means ({Year})'], ['BREAKING: {Title}']],
  podcast: [['{Title} ft. {Name} | {Label} {EpT}', 'Name'], ['{Title} - {Cat} Podcast {EpT}'], ['{Title} | {Label} {Year}']],
  product: [['{Name} {Title} | {Mood}', 'Name'], ['{Title} - Everything You Need To Know']],
  custom: [['{Title}'], ['{Title} | {Cat} {Year}']]
};

export function makePackage(p, rnd = Math.random, n = -1) {
  const w = WORDS[p.type], y = String(new Date().getFullYear());
  const v = { Title: cap(p.title), Name: cap(p.artist), Cat: cap(p.genre), EpT: p.ep ? '(' + p.epLabel.replace('#', p.ep) + ')' : '', Mood: cap(p.mood), BPM: p.bpm, Key: p.key, Label: w.label, Year: y };
  const pool = TITLES[p.type].filter(([, need]) => !need || v[need]);
  let title = fill(pool[n >= 0 ? n % pool.length : Math.floor(rnd() * pool.length)][0], v).replace(/\[FREE\]\s+Type/, '[FREE]').replace(/\s+(\||-|\.\.\.)?\s*$/, '').replace(/\(\s*\)/g, '').trim();
  if (title.length > 100) title = title.slice(0, 99).replace(/\s\S*$/, '');

  const tags = fitTags(buildTags(p));
  const hash = [p.genre, w.tag, p.artist && (p.type === 'beats' ? `${p.artist} type beat` : p.artist)]
    .filter(Boolean).slice(0, 3).map((t) => '#' + t.replace(/[^a-z0-9]/gi, '').toLowerCase());
  const hooks = [`${w.verb} "${v.Title}" now.`, `New ${w.noun}: "${v.Title}".`, `"${v.Title}" is here.`];
  const F = Object.fromEntries(Object.entries(w.f).map(([k, l]) => [k, String(l).replace(/\s*\(.*\)/, '')])), details = [p.bpm && `BPM: ${p.bpm}`, p.key && `Key: ${p.key}`, v.Name && `${F.name}: ${v.Name}`, v.Cat && `${F.cat}: ${v.Cat}`, v.Mood && `${F.mood}: ${v.Mood}`].filter(Boolean);
  const desc = [hash.join(' '), '', hooks[Math.floor(rnd() * hooks.length)], p.link && `${w.verb}: ${p.link}`, '',
    details.join('\n'), details.length ? '' : null, w.use, '', p.footer].filter((l) => l !== null && l !== false && l !== undefined)
    .join('\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, 5000);

  const pins = [`${w.verb} "${v.Title}" here: ${p.link || '(link)'}`, `Which ${w.noun} should I drop next? ${p.link ? '👉 ' + p.link : ''}`, `Like + subscribe for more ${w.nouns}. ${p.link || ''}`];
  const words = [...String(p.title).split(/\s+/), p.mood].filter(Boolean);
  const thumb = words.slice(0, 2 + Math.floor(rnd() * 2)).join(' ').toUpperCase();
  return { title, desc, tags, pin: pins[Math.floor(rnd() * pins.length)].trim(), thumb };
}

import { WORDS } from './words.js';

const clean = (s) => String(s || '').replace(/[#<>,"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

// YouTube counts commas between tags and adds quotes around tags with spaces.
export const tagLen = (tags) => tags.reduce((n, t) => n + t.length + (t.includes(' ') ? 2 : 0), 0) + Math.max(0, tags.length - 1);

// Ranked: exact phrases, then broad, year last.
export function buildTags(p) {
  const w = WORDS[p.type], g = clean(p.genre), m = clean(p.mood), a = clean(p.artist), y = String(new Date().getFullYear());
  const beat = p.type === 'beats', snd = /packs|samples/.test(p.type);
  const exact = [
    clean(p.title),
    a && w.tag && `${a} ${w.tag}`,
    a && beat && `free ${a} type beat`,
    g && w.tag && `${g} ${w.tag}`,
    p.type === 'packs' && g && `free ${g} sample pack`,
    g && snd && `${g} samples`,
    a && g && !beat && `${a} ${g}`,
    m && g && `${m} ${g}`,
  ];
  const broad = [
    a, w.tag, g, m && `${m} ${w.noun}`, p.bpm && `${p.bpm} bpm`, p.key && clean(p.key),
    w.tag && `${w.tag} ${y}`, a && `${a} ${y}`, beat && 'free beat', snd && 'royalty free samples',
    (beat || snd) && 'producer', y
  ];
  const seen = new Set(), out = [];
  for (const t of [...exact, ...broad].map(clean)) if (t && !seen.has(t)) { seen.add(t); out.push(t); }
  return out;
}

export function fitTags(tags, max = 500) {
  const t = [...tags];
  while (t.length && tagLen(t) > max) t.pop();
  return t;
}

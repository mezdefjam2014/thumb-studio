// Per-type vocabulary + which input fields each type shows.
// f: name = label of the "name" field (artist, game, product...), cat = category label, bpm/key/ep = extra fields.
const MUSIC = { cat: 'Genre', mood: 'Mood', bpm: 1, key: 1 };
export const WORDS = {
  beats:    { group: 'Music', label: 'Type Beat', kicker: 'NEW BEAT', noun: 'beat', nouns: 'beats', verb: 'Lease', use: 'Free for non-profit use. Buy a lease for commercial releases.', tag: 'type beat', f: { ...MUSIC, name: 'Artist ("type beat")' } },
  packs:    { group: 'Music', label: 'Sample Pack', kicker: 'NEW SAMPLE PACK', noun: 'sample pack', nouns: 'samples', verb: 'Download', use: 'Royalty-free. Clear for beats, releases and streams.', tag: 'sample pack', f: { ...MUSIC, bpm: 0, key: 0, name: 'Inspired by (artist)' } },
  samples:  { group: 'Music', label: 'Single Sample', kicker: 'NEW SAMPLE', noun: 'sample', nouns: 'samples', verb: 'Download', use: 'Royalty-free. Clear for beats, releases and streams.', tag: 'sample', f: { ...MUSIC, name: 'Inspired by (artist)' } },
  video:    { group: 'Music', label: 'Music Video', kicker: 'NEW VIDEO', noun: 'video', nouns: 'videos', verb: 'Stream', use: 'Stream the full song on all platforms.', tag: 'music video', f: { cat: 'Genre', mood: 'Mood', name: 'Artist' } },
  gaming:   { group: 'Video', label: 'Gaming', kicker: 'NEW GAMEPLAY', noun: 'video', nouns: 'videos', verb: 'Watch', use: '', tag: 'gameplay', f: { name: 'Game', cat: 'Kind (walkthrough, challenge...)', mood: 'Hook (insane, funny...)', ep: 'Part #' } },
  vlog:     { group: 'Video', label: 'Vlog', kicker: 'NEW VLOG', noun: 'vlog', nouns: 'vlogs', verb: 'Watch', use: '', tag: 'vlog', f: { name: 'Place / who', cat: 'Topic', mood: 'Vibe', ep: 'Day / Ep #' } },
  tutorial: { group: 'Video', label: 'Tutorial', kicker: 'HOW TO', noun: 'tutorial', nouns: 'tutorials', verb: 'Learn', use: 'Questions? Drop them in the comments.', tag: 'tutorial', f: { name: 'Tool / software', cat: 'Skill / topic', mood: 'Level (beginner...)' } },
  review:   { group: 'Video', label: 'Review', kicker: 'HONEST REVIEW', noun: 'review', nouns: 'reviews', verb: 'Check', use: 'Not sponsored unless stated.', tag: 'review', f: { name: 'Product / brand', cat: 'Category', mood: 'Verdict (worth it?)' } },
  reaction: { group: 'Video', label: 'Reaction', kicker: 'REACTING TO', noun: 'reaction', nouns: 'reactions', verb: 'Watch', use: '', tag: 'reaction', f: { name: 'Reacting to', cat: 'Category', mood: 'Hook (shocked...)' } },
  news:     { group: 'Video', label: 'News', kicker: 'BREAKING', noun: 'update', nouns: 'updates', verb: 'Read', use: 'Sources in the description.', tag: 'news', f: { name: 'Who / what', cat: 'Topic', mood: 'Angle' } },
  podcast:  { group: 'Video', label: 'Podcast', kicker: 'NEW EPISODE', noun: 'episode', nouns: 'episodes', verb: 'Listen', use: 'New episodes every week.', tag: 'podcast', f: { name: 'Guest', cat: 'Topic', mood: 'Hook', ep: 'Episode #' } },
  product:  { group: 'Video', label: 'Product', kicker: 'NEW DROP', noun: 'product', nouns: 'products', verb: 'Get', use: 'Limited stock.', tag: 'product', f: { name: 'Brand', cat: 'Category', mood: 'Hook' } },
  custom:   { group: 'Video', label: '', kicker: 'NEW', noun: 'video', nouns: 'videos', verb: 'Watch', use: '', tag: '', f: { name: 'Name', cat: 'Topic', mood: 'Hook' } }
};
export const MUSIC_TYPES = ['beats', 'packs', 'samples', 'video'];

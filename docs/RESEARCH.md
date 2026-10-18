# Thumbnail Rulebook (canvas template engine)
Canvas: 1280x720 (16:9) and 1080x1920 (9:16). H = canvas height, W = width. All % are of W (x) / H (y).
Evidence note: web sources found were mostly generic creator guides plus the (unverified) MrBeast onboarding memo, which gives
no pixel specs. Niche archetypes/palettes/sizes below are synthesized design conventions (observed-pattern heuristics),
NOT measured CTR data. Validate with YouTube Test & Compare (up to 3 variants; winner chosen by watch-time share, not CTR).

## 0. Cross-niche rules (apply to every template)
- Test at 168x94 px: subject + <=4 words must still read. Auto-preview the downscale in the editor.
- One focal point. Hierarchy: subject > text > prop. Max 3 visual elements + background.
- Text: 1-4 words (hard cap 5). Min cap-height 12% H (~11px at 168x94). Never 2 lines of small text.
- Contrast: text vs. local bg >= 4.5:1; subject separated from bg via rim light/outline 0.4-0.8% H or dark vignette.
- Saturation +10-25% vs. natural; avoid mid-gray and low-contrast pastel pairs.
- Safe area 1280x720: keep text/face OUT of the bottom-right timestamp box = x 82-100%, y 84-100% (treat x>=80, y>=82 as no-go).
  Keep 3% H margin from all edges (mobile crop / rounded corners).
- 1080x1920 (vertical): top 12% and bottom 22% are UI-covered; right rail x>82% has buttons.
  Keep subject+text in y 14-76%, x 6-80%. Stack text vertically; text width <= 88% W.
- Thumbnail opens a curiosity gap, title gives context; do NOT repeat the same words.
- Must match video content (retention counterweight; memo: first minute must pay off the thumbnail).
- Faces: eyes near upper-third line (y~33%), face 35-60% of H tall, eyes visible, strong emotion.
  Expressive faces reported to lift CTR ~20-30% (vendor claim, unverified).
- Consistency: reuse font, palette, layout per series; vary subject/crop.
- Cut-out subject: outline 3-8 px at 720p (white or accent) + soft drop shadow (blur 2% H, 40% opacity).
- Text effects at 720p: outside stroke 6-10 px (0.8-1.4% H); shadow offset 4-8 px; or stroke + extrude 6-12 px.
- Glow: radial behind subject, 40-70% H diameter, 30-60% opacity, one hue max.
- Arrows/circles: stroke 1.0-1.6% H, saturated red/yellow, point at the single curiosity object; max 1 arrow + 1 circle.
- Number badges: 8-14% H circle/rounded rect in a corner, away from bottom-right.
- Split/versus: divider at x=50%, 1.5% W wide.
- Avoid: >3 text elements, tiny logos/text, low-res or jagged cutouts, content in bottom-right, misleading imagery,
  more than 2 saturated hues + 1 neutral, gradients that kill text contrast, borders wasting 5%+ of frame.

## 1. MrBeast-style challenge / entertainment
Memo/commentary: title+thumbnail first; extreme concrete premise ("50 hours in ketchup" beats "in my front yard"); CTR/AVD/AVP are the 3 core metrics.
Pattern: giant absurd object/scale + shocked face + 0-3 words (often a number/money/time).
### 10 layout archetypes
1. Shock-Left / Giant-Right: face x 0-38%, y 15-100%; giant prop x 38-100%, y 5-80%; 3 words top-right y 5-25% or none.
2. Money Pile: cash fills y 55-100%; face x 30-70%, y 8-65%; "$X" text x 5-45%, y 8-35%.
3. Split Versus: 50/50 vertical split; subject A left, B right; "VS" badge center 12% H; text bottom-left only.
4. Scale Shot: tiny person x 5-25%, y 60-95% vs. enormous object x 20-100%, y 0-85%.
5. Countdown Number: huge number 35-50% H at x 5-45%, y 10-70%; face x 55-95%.
6. Triple Face: dominant face center 45% H; two faces at x 5-22% and 78-95%, 25% H; 0-1 word.
7. Before/After Diagonal: slash (45%,0)->(55%,100%); before desaturated left, after saturated right; arrow across.
8. Circle-Callout: wide scene, red circle (r 8-12% H) on object x 55-80%; face inset x 3-28%, y 55-97%.
9. Pointing Host: host x 55-100% pointing left to object x 5-50%; text over object top.
10. Last-One-Standing: crowd across y 40-100%, hero face foreground center-left, "LAST TO..." top y 5-30%.
### 8 palettes
- Beast Yellow-Blue: bg #1E6BFF, text #FFE600, accent #FF2D2D, ink #0A0A0A
- Cash Green: #0B7A3B, #7CFF4D, #FFD400, #0A0A0A
- Alarm Red-White: #E10600, #FFFFFF, #FFD400, #111111
- Pool Cyan: #00C2FF, #FFFFFF, #FF3D81, #06223A
- Hot Orange-Teal: #FF7A00, #00B8A9, #FFFFFF, #101820
- Candy Magenta: #FF2E97, #FFF200, #2B1BFF, #FFFFFF
- Lava Night: #1A0033, #FF4D00, #FFD60A, #FFFFFF
- Arctic Pop: #DFF6FF, #0057FF, #FF2D2D, #0B0B0B
### Typography
- Heavy condensed/geometric sans (Burbank-like, Anton, Impact). ALL CAPS, 0-3 words, numbers favored.
- Cap-height 14-30% H. Stroke 1.0-1.5% H black; shadow 0.8% H offset, 50% black. Fill yellow/white; one word accent.
### Props/overlays: red arrows, circles, "$" numbers, fire/explosions, cash stacks, scale-exaggerated objects, brightened subject, speed lines.
### Face/emotion: mouth wide open, brows up, eyes wide, gaze at the prop; face 40-60% H; rim light; cut out + brighten.
### Avoid: >3 words, subtle emotion, dim photos, crowds without a clear hero, text over face.

## 2. True crime / criminal cases
Pattern: moody, desaturated, one suspect/victim/location + evidence prop + stark 1-4 word hook; respectful of victims.
### 10 layout archetypes
1. Mugshot Hero: desat face x 30-70%, y 10-90%; name in red box x 4-45%, y 62-80%.
2. Redacted File: document texture full-bleed; black redaction bars across y 30-70%; rotated (-8 deg) stamp x 40-90%, y 10-30%.
3. Tape Cross: two yellow tape diagonals crossing at center; subject partly behind; text top-left.
4. Silhouette Mystery: dark silhouette x 55-95%, y 15-100% with cyan rim; "?" or 2 words x 5-50%, y 25-60%.
5. Case Board: 3-5 polaroids with red string; hero photo 2x size x 30-70%; text banner y 3-18%.
6. Victim vs Suspect: warm left / cold right 50/50; "?" badge center.
7. Location Establishing: dark house/road/woods, window glow x 60-75%; small figure; text bottom-left on shadow.
8. Evidence Closeup: macro of weapon/phone/note fills frame; red circle on detail; 2 words top.
9. Newspaper Headline: aged plate x 5-70%, y 10-45%; subject cutout bleeds off right.
10. Interrogation Cone: overhead cone light, subject x 30-70%, rest falls to black; 1 word at y 78%.
### 8 palettes
- Noir Red: #0D0D0F, #E10E1A, #F2F2F2, #6B6B6B
- Tape Yellow: #111111, #FFD60A, #FFFFFF, #8A0F0F
- Cold Case Blue: #0A1622, #2C6E9B, #BFE3F2, #E10E1A
- Police Lights: #0A0F2C, #E10E1A, #1E5BFF, #FFFFFF
- Sepia Archive: #2B1D12, #B58B5A, #E9D8B4, #8A0F0F
- Blood & Bone: #140506, #8C0F14, #E8DCC8, #3A3A3A
- Sodium Streetlamp: #0B0B12, #FF9F1C, #FFE8A3, #3D4A5C
- Forensic Green: #05140F, #2EE6A6, #D9FFF0, #E10E1A
### Typography
- Condensed bold sans/serif or typewriter/stencil; caps; 1-4 words ("STILL MISSING", "THE LAST CALL").
- Cap-height 10-18% H. Stroke 0.6-1.0% H or solid plate; shadow 0.6% H 70% black. White/red fill; one word red.
### Props/overlays: redaction bars (4-6% H tall), crime tape, red circle/arrow on evidence, stamps (CLASSIFIED/UNSOLVED), pins+string, grain 3-6%, vignette 40-60%, glitch/scanlines, blur on sensitive faces.
### Face/emotion: neutral/cold direct stare, hard lighting, desat 40-70%; host face (if any) serious not goofy.
### Avoid: gore, bright cartoon palettes, glamorizing perpetrators, >4 words, watermarked photos, mocking victims.

## 3. Technology (reviews / unboxing / comparisons)
Pattern: product hero, clean bg, one verdict word, optional host reaction; sharp, high-key, minimal.
### 10 layout archetypes
1. Product + Verdict: product x 40-95%, y 12-88% at 3/4 angle; verdict x 5-42%, y 30-65%.
2. A vs B: products x 5-45% and 55-95%, y 20-85%; "VS" badge center 10% H; check/crown on winner.
3. Host + Product: host x 0-35% shoulder-up; product held x 40-80%; text top-right.
4. Unbox Reveal: open box y 45-100% center, glow rising, product emerging; "FINALLY" top.
5. Spec Callout: product center, 2-3 leader lines to 1-2 word labels (6% H).
6. Price Tag: product left; price badge 22% H at x 60-92%, y 10-45%.
7. Broken Test: product with crack/flame/red X; face inset 25% H in a non-bottom-right corner.
8. Macro Detail: lens/chip/port fills frame, rim light; 1-2 words.
9. Lineup: 3-5 devices row y 35-80%, size by rank; "TOP 5" top-left.
10. Rating Score: giant "9/10" x 5-45%, y 15-70%; product behind right with soft shadow.
### 8 palettes
- Clean Studio: #F5F7FA, #0F1115, #2F6BFF, #FF5A36
- Dark Mode Pro: #0B0D12, #E6EAF2, #3DA9FC, #7C5CFF
- Neon Cyber: #0A0620, #00F0FF, #FF2BD6, #FFFFFF
- Warm Minimal: #FFFFFF, #1D1D1F, #FF9500, #0A84FF
- Android Green: #0F1F17, #3DDC84, #FFFFFF, #0B3D2A
- Carbon & Orange: #121212, #FF6A00, #E0E0E0, #2A2A2A
- Gold Premium: #0E0E0E, #D4AF37, #FFFFFF, #3B2F0B
- Alert Red Verdict: #FFFFFF, #E10600, #101010, #8E8E93
### Typography
- Clean grotesque/geometric ExtraBold (Inter, Montserrat, Poppins); caps or Title Case; 1-3 words ("BUY", "SKIP", "WORTH IT?", "DEAD?").
- Cap-height 10-20% H. Stroke 0.3-0.8% H or contrast plate; soft shadow blur 1.5% H 30%. White on dark / dark on light; 1 accent word.
### Props/overlays: floor reflection/shadow, rim light, glow 50% H, spec badges, price tag, check/X icons, "NEW" tag, feature arrows, comparison divider, one lens flare max.
### Face/emotion: raised-brow surprise or deadpan impressed; 25-40% H; eyes on product; clean light; host optional.
### Avoid: plain stock product on white with no hook, 5+ spec texts, brand logo as only subject, gradient behind text, fake-looking renders.

## 4. Music (type beats, sample packs, music videos)
Pattern: mood first; a recognizable series template wins. Type beats: "[ARTIST] type beat" is search text; thumbnail carries vibe, optional BPM/key.
### 10 layout archetypes
1. Artist-Cutout Type Beat: stylized figure x 45-95%, y 0-100%; title x 4-48%, y 35-65% + "TYPE BEAT" at 45% size below.
2. Centered Glow Poster: one image center with radial glow; stacked title y 70-88%, x<=80%.
3. Waveform Band: waveform bar y 40-60% full width; title y 15-38%; BPM/key badge left below.
4. Vinyl: disc x 35-85% partly cropped, label = title; sleeve behind left.
5. Sample Pack Box: 3D box mock x 5-45%, y 10-90%; bullets ("100 LOOPS") x 50-92%, y 20-70%.
6. Icon Collage: 4-6 instrument icons (12% H) around center title.
7. Music-Video Frame: artist face x 10-45% 40-55% H; small outlined title y 70-85% left.
8. Neon Sign: dark scene; neon tube title x 10-70%, y 30-60%; reflection below.
9. Lyric Stack: 2-4 huge stacked lines x 5-60%; face right.
10. Moody Portrait: low-key portrait right; vertical fragmented title left; BPM badge top-right.
### 8 palettes
- Trap Purple: #120022, #8E2DE2, #FF3CAC, #FFFFFF
- Drill Ice: #0A0F14, #7FD4FF, #FFFFFF, #3A4A58
- Melodic Sunset: #1B0B3A, #FF5E78, #FFB36B, #FFF3E0
- Lo-fi Pastel: #2A2438, #F7B7C9, #B8C0FF, #FFF1D6
- Boom Bap Gold: #17120B, #D9A441, #F4E4BC, #7A1F1F
- Neon Rave: #05010F, #00FFA3, #FF00E5, #00B7FF
- Rage Red-Black: #080808, #FF1E1E, #F5F5F5, #3A0000
- RnB Velvet: #1A0A14, #C2185B, #F8BBD0, #FFD59E
### Typography
- Mood-driven: bold condensed sans, brush script, or blackletter (trap/drill); 1-3 words + small "TYPE BEAT"; BPM/key badge cap-height 4-5% H.
- Title cap-height 12-26% H. Stroke 0.5-1.2% H; neon glow = 2 layers blur 1% and 3% H at 60%/30%. Tracking +2-6%.
### Props/overlays: waveform, EQ bars, vinyl, speakers, grain 4-8%, chromatic aberration 3-6 px, VHS lines, light leaks, BPM/key badge, "FREE" badge top-left.
### Face/emotion: cool/neutral/menacing over smiling; hooded/shadow-lit; for artist-reference use stylized or licensed imagery.
### Avoid: script fonts unreadable at 168 px, text over busy detail, copyrighted photos/logos, >3 fonts, tiny BPM text, palette that mismatches genre.

## 5. Video games
Pattern: character/hero art + reaction face + dramatic light + 1-3 word hook; game-specific color identity.
### 10 layout archetypes
1. Face + Boss: facecam x 0-35%, y 30-100%; boss art x 35-100%, y 0-90%; 2 words top-left.
2. Rim-Lit Hero: hero 40-60% W wide, y 5-100%; glow in game color; title x 55-95%.
3. Versus Screen: characters facing at x 5-45% / 55-95%; lightning/crack center; "VS" 12% H.
4. Rank Badge: rank icon 20% H at x 70-95%, y 5-30%; player/hero lower-left.
5. Loadout Hero: weapon diagonal bottom-left to top-right; 3 stat icons; text on shadow band.
6. Secret/Glitch: scene with red circle + arrow on hidden item; glitch on rest; "SECRET?".
7. Screenshot + Face Inset: enhanced gameplay (+contrast +sat), face circle 28% H at x 3-25%, y 60-97%.
8. Giant Number: "LVL 1"/"0 DEATHS" 30% H; character behind right.
9. Horror Peek: dark corridor, creature eyes/silhouette x 55-75%; scared face bottom-left; flashlight cone.
10. Update Burst: logo + 3 content tiles in triangle; "NEW" burst top-left.
### 8 palettes
- Battle Royale Pop: #5B2EFF, #00E5FF, #FFD400, #FFFFFF
- Block Earth: #4CAF50, #7A4B2A, #8FD3FF, #FFFFFF
- Horror Dark: #050607, #7A0010, #B8C7C0, #FFD400
- Cyberpunk: #0A0A1A, #FCEE0A, #FF2A6D, #05D9E8
- Retro Arcade: #12003B, #FF2E63, #08D9D6, #F9ED69
- Sci-Fi Teal-Orange: #0B1E2D, #00C2B8, #FF7A1A, #F4F4F4
- Fantasy Gold: #1A0F2E, #F2B632, #6E3FF3, #FFFFFF
- Competitive Red-Blue: #0B1020, #FF3B3B, #2E7BFF, #FFFFFF
### Typography
- Chunky display sans (Bebas Neue, Anton, Rubik, Orbitron for sci-fi); caps; 1-3 words; ranks/numbers great.
- Cap-height 12-26% H. Stroke 1.0-1.4% H dark; extrusion 8-14 px; outer glow in accent 1.5% H.
### Props/overlays: red circle/arrow, rank icons, "NEW"/"SECRET"/"NERFED" tags, health bars, crosshair, damage numbers, speed lines, glitch, vignette, bloom on weapons/eyes.
### Face/emotion: scream/gasp/smirk, 30-45% H, colored outline in game accent; gaze at threat/object; optional facecam circle 25-30% H.
### Avoid: raw low-contrast screenshots, leftover HUD clutter, tiny logos, text over bright explosions without plate, multiple competing characters.

## 6. Engine build checklist (derived)
- Layer order: bg (blur/grade) > glow > prop > subject cutout (outline, shadow) > FX (grain, vignette) > text > arrow/circle > badge.
- Presets per niche: archetype ID + palette ID + font preset; ratio presets re-map % boxes; vertical stacks text.
- Auto checks: (a) 168x94 preview, (b) nothing in no-go zone, (c) words <=4, (d) contrast >=4.5, (e) face >=25% H, (f) <=3 elements.
- A/B export: up to 3 variants (palette swap, text swap, face crop).

## Sources
- https://zackchewning.substack.com/p/content-lessons-from-the-1-youtubers
- https://www.creatorhandbook.net/leaked-document-allegedly-reveals-mrbeasts-secrets-to-youtube-success-the-key-takeaways/
- https://www.alexanderjarvis.com/memo-how-to-succeed-in-mrbeast-production/
- https://gigazine.net/gsc_news/en/20240917-mrbeast-youtube-production
- https://subscribr.ai/youtube-strategy/optimize-youtube-thumbnails-ctr
- https://tubecore.xpanddigital.io/blog/youtube-thumbnail-design-guide
- https://tubecore.xpanddigital.io/blog/youtube-thumbnail-ab-testing
- https://vidiq.com/blog/post/youtube-thumbnail-tips/
- https://vidiq.com/es/blog/post/youtube-custom-thumbnails-ctr/
- https://entreresource.com/youtube-thumbnail-best-practices/
- https://epidemicsound.com/blog/a-b-test-youtube-thumbnails
- https://www.creatorhandbook.net/how-to-design-and-test-youtube-thumbnails/
- https://growthos.in/blog/youtube-thumbnail-a-b-testing-best-practices
- https://drivetribe.com/blog/revolutionising-video-performance-youtubes-thumbnail-beta-test/

"""Cut out user-supplied prop photos into assets/props/<cat>/<name>.webp (rembg isnet, trimmed, max 1024).
Usage: python tools/cut_props.py <cat> <src_dir> name1=file1 name2=file2 ...  then it rewrites assets/props/manifest.json
"""
import json, sys
from pathlib import Path
from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent / 'assets' / 'props'
cat, src = sys.argv[1], Path(sys.argv[2])
s = new_session('isnet-general-use')
out = ROOT / cat; out.mkdir(parents=True, exist_ok=True)
for pair in sys.argv[3:]:
    name, f = pair.split('=')
    im = Image.open(src / f).convert('RGB'); im.thumbnail((1600, 1600))
    cut = remove(im, session=s, post_process_mask=True)
    bb = cut.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    cut = cut.crop(bb); cut.thumbnail((1024, 1024))
    cut.save(out / f'{name}.webp', 'WEBP', quality=90, method=5)
    print(name, cut.size)
man = {c.name: sorted(p.stem for p in c.glob('*.webp')) for c in sorted(ROOT.iterdir()) if c.is_dir()}
(ROOT / 'manifest.json').write_text(json.dumps(man, indent=1))
print(man)

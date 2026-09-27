"""Inline every script of src/index.html into one self-contained page: dist/kraken-keel.html,
and a copy at the repo root as index.html (what GitHub Pages serves).
python3 tools/build.py"""
import os, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(ROOT, 'src', 'index.html'), encoding='utf-8').read()
block = re.search(r'<!--SCRIPTS-->(.*?)<!--/SCRIPTS-->', src, re.S)
out = []
for m in re.finditer(r'<script(?: src="([^"?]+)(?:\?[^"]*)?")?>(.*?)</script>', block.group(1), re.S):
    if m.group(1):
        code = open(os.path.join(ROOT, 'src', m.group(1)), encoding='utf-8').read()
        out.append(f'<script>\n/* {m.group(1)} */\n{code}\n</script>')
    else:
        out.append(f'<script>{m.group(2)}</script>')
html = src[:block.start()] + '\n'.join(out) + src[block.end():]
os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
path = os.path.join(ROOT, 'dist', 'kraken-keel.html')
open(path, 'w', encoding='utf-8').write(html)
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(html)
print('built', path, 'and index.html,', len(html) // 1024, 'KB')

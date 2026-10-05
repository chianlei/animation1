"""Prepare local assets from the saved public reference HTML."""
import html,json,re,shutil
from pathlib import Path
from urllib.request import urlopen,Request
s=Path('/tmp/justphil-reference.html').read_text()
out=Path('public/media');out.mkdir(parents=True,exist_ok=True)
manifest=json.loads(Path('downloads/justphilride/manifest.json').read_text())
for record in manifest['images']:
 name=record['url'].split('/')[-1].split('?')[0]
 shutil.copyfile(Path('downloads/justphilride')/record['file'],out/name)
masks=re.findall(r'\.(framer-[\w]+)\{-webkit-mask:url\("data:image/svg\+xml,((?:\\.|[^"\\])*)"\)',s)
for name,svg in masks:
 svg=svg.replace('\\"','"')
 svg=re.sub(r'var\(--[^,]+,\s*(rgb\([^)]*\)|[^)]+)\)',r'\1',svg)
 (out/f'{name}.svg').write_text(svg)
# Standalone data SVG artwork, including the tall Phil logo and award badges.
svgs=list(dict.fromkeys(html.unescape(x) for x in re.findall(r'src="(data:image/svg\+xml,[^"]+)"',s)))
for i,svg in enumerate(svgs):
 (out/f'artwork-{i}.svg').write_text(svg.split(',',1)[1])
 print('artwork',i,re.search(r'viewBox="([^"]+)',svg).group(1),len(svg))
fonts=[]
for face in re.findall(r'@font-face \{[^}]+\}',s):
 family=re.search(r'font-family: "([^"]+)"',face)
 weight=re.search(r'font-weight: (\d+)',face)
 url=re.search(r'url\("([^"]+)"\)',face)
 if family and weight and url and 'font-style: normal' in face and family.group(1) in ['Manrope','JetBrains Mono'] and weight.group(1) in ['400','500']:
  filename=family.group(1).lower().replace(' ','-')+'-'+weight.group(1)+'.woff2'
  fonts.append((url.group(1),filename))
fonts.append(('https://framerusercontent.com/assets/ONDhvEPbNw6tVP0dazFh68bhIVM.mp4','phil-ride.mp4'))
fonts.append(('https://framerusercontent.com/assets/4r36YVFqPm20zNo7eUhODuygxPY.mp4','mike-kus-work.mp4'))
for url,filename in fonts:
 if (out/filename).exists():continue
 print('download',filename,flush=True)
 with urlopen(Request(url,headers={'User-Agent':'WebsiteReference/1.0'}),timeout=60) as r:(out/filename).write_bytes(r.read())
print('Assets ready',flush=True)

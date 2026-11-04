# python3 tools/tile.py OUT.png COLS a.png b.png ...  -> a contact sheet (each tile 640x360, labelled with its file name)
import sys
from PIL import Image, ImageDraw
out, cols, fs = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
w, h = 640, 360; rows = (len(fs)+cols-1)//cols
S = Image.new('RGB', (cols*w, rows*h), (40,40,40)); d = ImageDraw.Draw(S)
for k, f in enumerate(fs):
    x, y = (k%cols)*w, (k//cols)*h
    S.paste(Image.open(f).convert('RGB').resize((w-4, h-4)), (x+2, y+2))
    d.rectangle([x+2, y+2, x+120, y+22], fill=(0,0,0)); d.text((x+6, y+6), f.split('/')[-1], fill=(255,255,0))
S.save(out)

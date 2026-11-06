#!/usr/bin/env python3
"""collect.py — (re)build videos/ from the working folders on the box (+ a copy of the Mac render kits).

Copies what can't easily be regenerated: source code (animation pages, booths, render/cut/music scripts), the logs (READMEs),
the YouTube descriptions and the take transcripts (the script Greg read + cue times). Leaves out what can be regenerated or
must not be public: renders, check frames, node_modules, voice/webcam recordings, film clips, sound fonts, secrets.
Scrubs: Greg's private shelf key, the voice-booth upload key, Mac user paths.

usage (on the box): python3 tools/collect.py MAC_KITS_DIR YT_TOOLS_DIR
  MAC_KITS_DIR = a copy of mac:~/airport-sessions/*-render without media; YT_TOOLS_DIR = a copy of mac:~/youtube-upload/*.js|txt|md
"""
import os, re, shutil, sys, json

HOME = os.path.expanduser('~')
AS = f'{HOME}/airport-sessions'
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KITS, YT = sys.argv[1], sys.argv[2]

# folder in the repo, working folder, Mac render kit(s), take prefixes, YouTube (id, title), description files
VIDEOS = [
  ('01-yellow-is-red-green', 'yellow-is-red-green', [], ['yellow', 'yellow2', 'reddish'],
   [('9OENcy-O1X0', 'yellow is red-green, v0.1'), ('6TJWpPFuMHk', 'seen reddish-green?, v0.2')], ['desc-yellow-v01.txt', 'desc-reddish-v02.txt']),
  ('02-belt-trick', 'spinor-v2', ['spinor-v2-render'], ['spinor2'],
   [('kCnTGcyHGoc', 'a rubber chessboard magic trick (the belt trick), v0.2')], ['desc-spinor-v02.txt', 'desc-spinor-v01.txt']),
  ('03-bluffing', 'poker-video', [], ['poker1'],
   [('iEu0NNmp28E', 'is bluffing actually a good idea, mathematically?, v0.1')], ['desc-poker-v01.txt']),
  ('04-epr-weird', 'epr-video', ['epr-render'], ['epr1'],
   [('toD7BWe4QeU', 'why is the EPR paradox weird?, v0.1')], ['desc-epr-v01.txt']),
  ('05-matrix-multiply', 'matmul-video', ['matmul-render'], ['mm1'],
   [('M6-sdPYdZyY', 'a nicer way to multiply matrices by hand, v0.1')], []),
  ('06-quantum-turing', 'qc-video', ['qc-render'], ['qc1'],
   [('D7K6TvOLo7g', 'the Turing machine of quantum computation, v0.1')], ['desc-qc-v01.txt']),
  ('07-circuit-diagrams', 'circuit-video', ['circuit-render'], ['circ1'],
   [('SrnDeKmCIws', 'from circuit diagrams to vector × matrix, v0.1')], ['desc-circuit-v01.txt']),
  ('08-double-slit', 'doubleslit-video', ['doubleslit-render'], ['ds1'],
   [('qdw7IvXof4k', 'the double-slit experiment as a quantum computation, v0.1')], ['desc-doubleslit-v01.txt']),
  ('09-epr-matrix-math', 'eprqc-video', ['eprqc-render'], ['epq1'],
   [('9glmM8-isOQ', 'the EPR paradox, as matrix math, v0.1')], ['desc-eprqc-v01.txt']),
  ('10-crystal-pyramid', 'crystal-video', ['crystal-render'], [],
   [('C3tgVoma3xs', 'the labyrinth crystal-ball pyramid, with tennis balls, v0.1')], ['desc-crystal-v01.txt']),
  ('11-color-golf', 'color-golf/video', ['cg-render'], [],
   [('iujHMK7D6OY', 'color golf, v0.1')], ['desc-colorgolf-doc-v01.txt']),
]

SKIP_DIRS = {'node_modules', '.venv', 'chk', 'pub', 'frames', '.airport-uploads', '__pycache__', '.git', 'edit', 'trim',
             'dl', 'arrows', 'spin', 'atest', 'smid', 'hsmid', 'mid', 'suite-out', 'out', 'shots', 'review'}
SKIP_EXT = {'.mp4', '.webm', '.mov', '.wav', '.m4a', '.mp3', '.png', '.jpg', '.jpeg', '.gif', '.sf2', '.sf3', '.log', '.mid', '.tgz', '.zip', '.pdf'}
SKIP_FILES = {'knight-data.js', 'knight-120.js', 'spinor-knight-mesh.js', 'key.txt', 'token.json', 'client_secret.json'}
MAX = 1_500_000                                   # anything bigger than this is generated data: leave it out, say so

SHELF = re.search(r'^D=(\w+)', open(f'{HOME}/kb/tools/personal-reports-push.sh').read(), re.M).group(1)   # the private shelf key (not in this repo)
VOICE_KEY = open(f'{HOME}/greg-voice/key.txt').read().strip()
def scrub(text):
    text = text.replace(SHELF, '<shelf>').replace(VOICE_KEY, '<VOICE_KEY>')
    text = re.sub(r'/Users/[a-z]+/', '~/', text)
    return text

skipped = []
def copy_tree(src, dst):
    for root, dirs, files in os.walk(src):
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS and not d.startswith('.'))
        for f in sorted(files):
            p = os.path.join(root, f); ext = os.path.splitext(f)[1].lower()
            if f in SKIP_FILES or ext in SKIP_EXT or f.startswith('.'): continue
            if os.path.getsize(p) > MAX: skipped.append((p, os.path.getsize(p))); continue
            try: text = scrub(open(p, encoding='utf-8').read())
            except UnicodeDecodeError: skipped.append((p, 'binary')); continue
            q = os.path.join(dst, os.path.relpath(p, src)); os.makedirs(os.path.dirname(q), exist_ok=True)
            open(q, 'w').write(text)

# extra files written into a folder: missing logs, and SOURCES.md for what is referenced instead of included
EXTRA = {
  '01-yellow-is-red-green': {'README.md': """# yellow is red-green (v0.1) / seen reddish-green? (v0.2), Oct 2026

The oldest pipeline; this session kept no log of its own. The same pipeline is documented in
[../02-belt-trick/README.md](../02-belt-trick/README.md) (its "sibling project"): anim.html (scrubbable 1920×1080 animation) →
build-booth.js + studio2.orig.html → booth.html (voice booth) → render.js (syncs the animation to the take) → publish.
Takes: takes/yellow-*, yellow2-*, reddish-*.json. Descriptions: descriptions/.
"""},
  '02-belt-trick': {'SOURCES.md': """# Not included here

- The chess knight 3-D mesh (src/knight-data.js, 892k triangles, 86 MB; decimated to 77k by tools/decimate.js into
  spinor-knight-mesh.js). Where the original model came from isn't recorded, so it isn't redistributed here. Any
  knight STL/OBJ works: load it into the same {count, pos (base64 float32)} format and run tools/decimate.js.
- dl/: copies of downloaded third-party pages (reference only).
"""},
  '03-bluffing': {'SOURCES.md': """# Not included here

- A.npy: a numpy array written by the solver (solve.py / explore.py); regenerate it by running them (venv with numpy + scipy).
"""},
  '10-crystal-pyramid': {'SOURCES.md': """# Third-party and personal material: where it is and how to get it

## The Labyrinth clip (not included: copyrighted; used briefly, small and muted, as commentary)
- Labyrinth (1986), Jim Henson Company / TriStar. The moment: Sarah bites the peach; the Goblin King spins a pyramid of 4
  crystal balls in his gloved hand (really Michael Moschen's arm, from behind) and sends bubbles to her.
- Source used: YouTube fan upload "Labyrinth - Peach Dreams" (Samasaurus Rex), https://www.youtube.com/watch?v=_A29dCiWe8w ,
  3:09–3:15 (640×480, letterboxed; picture ≈ crop 624:266:8:105). The video used 192.1–195.3 s.
- Download (yt-dlp needs a JS runtime for YouTube now, e.g. deno):
  `brew install yt-dlp deno` then `yt-dlp -f "bv*[height<=1080]+ba/b" --merge-output-format mp4 -o "%(id)s.%(ext)s" _A29dCiWe8w`
- Background: https://en.wikipedia.org/wiki/Michael_Moschen ; Henson's "Inside the Labyrinth: Crystals"
  https://www.youtube.com/watch?v=3U8fTAHxjdo (behind the scenes, incl. Moschen doing the balls in black).
- Not in the official Henson "Ballroom Scene" clip (4nBjvElCzAw): it starts just after this moment.

## The choir sound font (not included: 216 MB; MIT licensed)
- MuseScore_General.sf2 (FluidR3 → FluidR3Mono → MuseScore General):
  https://ftp.osuosl.org/pub/musescore/soundfont/MuseScore_General/MuseScore_General.sf2 (license: MuseScore_General_License.md
  in the same folder). Played with FluidSynth (`brew install fluid-synth`). Credit it in the description.

## Greg's footage (not included)
- An iPhone video of Greg doing the 4-ball pyramid with tennis balls (1920×1080, 39.5 s): 0–8 s a pretend failed attempt,
  ~9 s on the real rotation. The video used 5.48–7.80 s (fail) and 8.42–14.52 s (rotation). Shoot your own.

## Regenerable (not included)
- The glass-ball scenes: blender/pyramid.py + blender/anim.py (Blender 5.2, Cycles on the Mac's GPU, 64 samples, ~44 s/frame).
- The choir cues: audio/suite.py + audio/suite.sh (MIDI → FluidSynth → texture → mix).
"""},
}

vroot = os.path.join(REPO, 'videos')
if os.path.isdir(vroot): shutil.rmtree(vroot)
index = []
for folder, work, kits, prefixes, yts, descs in VIDEOS:
    dst = os.path.join(vroot, folder)
    copy_tree(os.path.join(AS, work), dst)
    if work == 'color-golf/video':               # the session log lives one level up
        open(os.path.join(dst, 'SESSION-README.md'), 'w').write(scrub(open(os.path.join(AS, 'color-golf/README.md')).read()))
    for k in kits:
        if os.path.isdir(os.path.join(KITS, k)): copy_tree(os.path.join(KITS, k), os.path.join(dst, 'mac-render'))
    for p in prefixes:                           # take transcripts: the script Greg read + cue times (not the recordings)
        for f in sorted(os.listdir(f'{HOME}/greg-voice/takes')):
            if f.startswith(p + '-') and f.endswith('.json'):
                os.makedirs(os.path.join(dst, 'takes'), exist_ok=True)
                open(os.path.join(dst, 'takes', f), 'w').write(scrub(open(f'{HOME}/greg-voice/takes/{f}').read()))
    for d in descs:
        if os.path.exists(os.path.join(YT, d)):
            os.makedirs(os.path.join(dst, 'descriptions'), exist_ok=True)
            shutil.copy(os.path.join(YT, d), os.path.join(dst, 'descriptions', d))
    for name, text in EXTRA.get(folder, {}).items():
        if not os.path.exists(os.path.join(dst, name)): open(os.path.join(dst, name), 'w').write(text)
    index.append({'folder': folder, 'youtube': [{'id': i, 'title': t, 'url': f'https://youtu.be/{i}'} for i, t in yts]})

# shared tools: the voice-take server, the YouTube upload scripts (they read secrets from files that are NOT here)
tdst = os.path.join(REPO, 'tools')
os.makedirs(os.path.join(tdst, 'voice-server'), exist_ok=True)
open(os.path.join(tdst, 'voice-server', 'server.js'), 'w').write(scrub(open(f'{HOME}/greg-voice/server.js').read()))
os.makedirs(os.path.join(tdst, 'youtube-upload'), exist_ok=True)
for f in ('README.md', 'auth.js', 'latest.js', 'update.js', 'upload.js'):
    open(os.path.join(tdst, 'youtube-upload', f), 'w').write(scrub(open(os.path.join(YT, f)).read()))
json.dump(index, open(os.path.join(REPO, 'videos', 'index.json'), 'w'), indent=1, ensure_ascii=False)

print('skipped (too big or binary):'); [print(' ', p.replace(HOME, '~'), s) for p, s in skipped]
left = [os.path.join(r, f) for r, _, fs in os.walk(REPO) for f in fs if '/.git/' not in os.path.join(r, f)]
bad = [p for p in left if any(s in open(p, errors='ignore').read() for s in (SHELF, VOICE_KEY)) or re.search(r'/Users/[a-z]+/', open(p, errors='ignore').read())]
print('files:', len(left), 'still containing a secret:', bad)

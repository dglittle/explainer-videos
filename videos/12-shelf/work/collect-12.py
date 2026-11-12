#!/usr/bin/env python3
# Copies this session into explainer-videos/videos/12-shelf with collect.py's rules (same skips, same scrubbing).
# usage: python3 work/collect-12.py /path/to/explainer-videos
import os, re, sys, shutil
HOME = os.path.expanduser('~'); SRC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = sys.argv[1]; DST = os.path.join(REPO, 'videos', '12-shelf')
SKIP_DIRS = {'node_modules', 'chk', '.git'}
SKIP_EXT = {'.mp4', '.webm', '.mov', '.wav', '.m4a', '.mp3', '.png', '.jpg', '.jpeg', '.gif', '.log', '.zip', '.pdf'}
SKIP_FILES = {'key.txt', 'token.json', 'client_secret.json', 'check-v1.js'}
SKIP_RE = re.compile(r'^shelf-(anim|voice).*\.html$')        # published copies of anim-v*.html / booth.html
SHELF = re.search(r'^D=(\w+)', open(f'{HOME}/kb/tools/personal-reports-push.sh').read(), re.M).group(1)
VOICE_KEY = open(f'{HOME}/greg-voice/key.txt').read().strip()
def scrub(t): return re.sub(r'/Users/[a-z]+/', '~/', t.replace(SHELF, '<shelf>').replace(VOICE_KEY, '<VOICE_KEY>'))
if os.path.exists(DST): shutil.rmtree(DST)
n = 0
for root, dirs, files in os.walk(SRC):
    dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS and not d.startswith('.') and not os.path.islink(os.path.join(root, d)))
    for f in sorted(files):
        p = os.path.join(root, f)
        if f in SKIP_FILES or os.path.splitext(f)[1].lower() in SKIP_EXT or f.startswith('.') or SKIP_RE.match(f) or os.path.islink(p): continue
        q = os.path.join(DST, os.path.relpath(p, SRC)); os.makedirs(os.path.dirname(q), exist_ok=True)
        open(q, 'w').write(scrub(open(p, encoding='utf-8').read())); n += 1
# the take transcript (what Greg read + cue times), as in the other folders
os.makedirs(os.path.join(DST, 'takes'), exist_ok=True)
for f in sorted(os.listdir(f'{HOME}/greg-voice/takes')):
    if f.startswith('shf1-2') and f.endswith('.json'):
        open(os.path.join(DST, 'takes', f), 'w').write(scrub(open(f'{HOME}/greg-voice/takes/{f}').read())); n += 1
bad = []
for root, _, files in os.walk(DST):
    for f in files:
        t = open(os.path.join(root, f), errors='ignore').read()
        if SHELF in t or VOICE_KEY in t or re.search(r'/Users/[a-z]+/', t): bad.append(f)
print(n, 'files →', DST, '| leaks:', bad or 'none')

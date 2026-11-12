# shelf-video — "shelf" explainer (Nov 2026)

Greg's ask (Nov-11): "we have the two sides, each with a widget world, and we say we want to sync them, here's how, I edit
something on one side, and we [go] through the process, showing each step of it making its way to the other side.. maybe just
that for now.. prototype up such a video, in javascript (don't worry about narration yet)".

Background gathered first: explainer-videos repo (PROCESS.md, TRICKS.md; cloned at /tmp/shelfvid-src), github.com/dglittle/shelf
(npm shelf-merge v0.2.4), and a short literature review (LWW: RFC 677, 1975; ties by value: Cassandra, GUN HAM; recursive
"higher version wins, equal → merge inside" = Baquero/Almeida's lexicographic pair + map composition; Kleppmann's JSON CRDT
keeps concurrent nested edits where shelf's newer overwrite resets the subtree). Also removed the "no hand/finger shapes" rule
from explainer-videos PROCESS.md at Greg's ask (commit 57fe36a): it was one pointer in the matrix video, not a general rule.

## Files
- anim.html: engine copied from 09-epr-matrix-math (ENGINE START/END, SCRIPT, ev/at/after, CHK). `shelf_merge` is pasted
  verbatim from shelf v0.2.4; every value and version on screen comes from running it:
  INIT {lamp:{on,color:'gold'},sign:{text}} → A0 (all versions 1) → B0 (synced copy) → local edit {lamp:{color:'teal'}}
  → change [{lamp:{color:'teal'}},[1,{lamp:[1,{color:2}]}]] → compareWalk (=, =, win) → B1 == A1; echo back = null.
- SCRIPT = 9 PLACEHOLDER lines (only for pacing; Greg writes narration later). 61 s at the guessed pace.
- Layout: two worlds (lamp + 3 swatches, sign) on top, two shelves under them (rows with version chips facing the middle),
  a dashed "pipe" between; the change's rows fly out of the left shelf into a package at the same row heights, travel right,
  and are compared row by row against the right shelf (=, =, >), notes under the package. Webcam corner kept free.
- tools/check.js, shots.js, tile.py from 09 (check.js: swarm field removed). Run with
  `NODE_PATH=/home/bitnami/archive/ergane/work/trinet-enroll/node_modules node tools/check.js` (puppeteer-core lives there).

## Status
- Nov-11 prototype v0.1: all CHK pass, no key problems, 1.7 ms/frame. Published https://bloop.monster/<shelf>/shelf-anim.html.
  Known: the bottom ~280 px are empty (the right shelf can't go lower without hitting the webcam corner); could scale up later.
- Nov-11 (Greg: "instead of a lamp and a sign.. a lamp and.. a shelf ;)"): sign → a wall shelf (wood plank, brackets, books drawn from
  the data + a little plant). Data is now {lamp:{on,color}, shelf:{books:3}}, so the JSON has a "shelf" key inside the shelf. Republished.
- Nov-11 v2 (Greg: "include the shelf_merge way of modifying the lamp's color.. not even sure if this is a good modification..
  please save this current version before giving this a try"): v1 saved as anim-v1.html → shelf-anim-v1.html (shelf-anim.html
  also still = v1). v2 = anim.html → shelf-anim2.html: a code strip in the empty bottom band (y 880). Left: the click types
  `shelf_merge(shelf, {lamp: {color: "teal"}})` (the argument is jsLit(EDIT)), and "teal" flies from the code into the shelf row;
  while the change is packed, ` → change` is appended (it IS the return value). Right: `shelf_merge(shelf, change)` types at the
  start of the compare line. Placeholder lines 3 and 7 lengthened to fit (69 s). Webcam corner pixel-scanned: 0 frames touch it.
- Nov-12 v3 (Greg: "actually show the "version" part of a shelf.. since that's where those numbers go.. (then it becomes clear
  also that the delta returned from shelf_merge is itself also a shelf)"): v2 saved as anim-v2.html (= shelf-anim2.html).
  v3 = anim.html = anim-v3.html → shelf-anim3.html. Each shelf is drawn as [ value , version ]: big brackets, the value tree
  (FS 21) and, row for row beside it, the version tree (leaf = number, object = [n, { … }]; numbers gold). Chips are gone; the
  bump, rings and "+1" act on the numbers in the version column. Panels 510 wide (A x 70, B x 1340). "the change (a shelf too)"
  is the same two-column shape (EFS 19), its closing braces placed after its rows (ERALL). The "=" / ">" signs between chips are
  dropped (the version columns are apart now); the notes under the package carry the comparison, and both numbers ring.
  Right-hand code right-aligned to the webcam corner (CBX()). Webcam corner pixel-scanned: 0 frames. Built via work/apply-v3.py.
- Nov-12 v4 (Greg: "maybe at first, show it "long form", with a regular [ at the beginning, and the version part *under* the
  first part.. but then we have an animation "lifting" that up, and making the outer [ and ] big"): v3 saved as anim-v3.html.
  v4 = anim.html = anim-v4.html → shelf-anim4.html. New first line 'just a pair' (placeholder, hold 2.6 s): the shelf written out
  long, centered (LF 30, LH 40): [ / value tree / version tree / ], labels "value" and "version" beside each part. shelfMorph():
  u1 over D_LIFT 2.4 s: the version part slides right (0–0.35), then lifts up beside the value (0.36–0.68); the small [ and ]
  ride the corners (bigBr drawn small = the characters), then stretch tall (0.7–1); labels fade and reappear above the columns.
  On 'two copies' (shortened) it glides into copy A's panel (D_PLACE 1.3 s, font 30 → 21), then worlds, copy B, the rest as v3.
  77 s. Webcam corner: 0 frames. Built via work/apply-v4.py + two small fixes (staging, size).
- Nov-12 v5 (Greg: "begin as it did before, and the json for the "value" side of the left side's shelf is *exactly* where it
  winds up in the end, but the version stuff is below it, going off the screen, so it can't be completely seen (which is the
  "funny" part), and then it animates to be on the side.. (maybe make the right's appear after the left's has done this)"):
  v4 saved as anim-v4.html. v5 = anim.html = anim-v5.html → shelf-anim5.html. Line 1 'just a pair' shows copy A only: its
  value rows at their final spots, a small [ before them, the version rows under them (RY(9)…RY(17)) and a small ] at RY(18),
  off screen; copy A's shelf panel also runs off the bottom. shelfMorph() u1 over D_LIFT 2.6 s: version slides right (0–0.3),
  lifts up into view (0.3–0.72; the panel shrinks back to SHH with it), [ and ] stretch tall (0.72–1); "version" label fades in.
  Line 2 'second copy' (placeholder) fades in copy B (world + finished shelf). Rest as v3/v4. 80 s. Webcam corner: 0 frames.
  Built via work/apply-v5.py.
- Nov-12 v6 (Greg's nits: "(a) the "[" we see before it gets elongated, be in exactly the same font, and in a position that lines
  up where it would be (given the monospaceness); (b) make "value" only appear when "version" does"): v5 saved as anim-v5.html.
  v6 = anim.html = anim-v6.html → shelf-anim6.html. Brackets are now the mono-font characters (glyphBr: the ends drawn as is, the
  middle stem stretched by clip + vertical scale; at natural height it IS the typed character). "[" typed right before the value's
  "{" ("[{"); "]" typed right after the version's last "}]" ("}]]", off screen). Lift (D_LIFT 2.8): slide right 0–0.28, lift
  0.28–0.66, "]" moves to the right edge 0.66–0.8, both stretch 0.8–1; "value" and "version" labels fade in together then. The
  final shelves and "the change" use the same glyph brackets (shelfBr), color C.txt. Webcam corner: 0 frames. work/apply-v6.py.
- Nov-12 v7 (Greg: "maybe alice and bob, rather than copy a and copy b?"): v6 saved as anim-v6.html. v7 = anim-v7.html →
  shelf-anim7.html. Labels "Alice" (#6fd0ff) and "Bob" (#ffb36b), 24 px bold (colors as in the EPR videos); code-strip captions
  "Alice's click runs:" / "Bob, when the change arrives:"; placeholder lines say Alice/Bob (key 'other side' → 'over to bob').
- Nov-12 booth (Greg: "create a recording studio for me to record the lines"): build-booth.js + studio2.orig.html copied from
  09-epr-matrix-math; prefix shf1- everywhere (localStorage shf1-script/-frames/-cam, IndexedDB shf-voice-1, take ids
  shf1-YYYYMMDD-HHMMSS, server list filter), DIR for the 10 lines, h1 "shelf: one edit, synced", link shelf-anim7.html.
  The upload key is filled in at build time from ~/greg-voice/key.txt (the source keeps <VOICE_KEY>). `node build-booth.js >
  booth.html` → shelf-voice.html. booth-lines-test: 0 bad at 1000×575, 1440×800, 1920×1000. Voice server ~/greg-voice up on
  :61920 (health ok). Takes will land in ~/greg-voice/takes/shf1-*. Diff the take's lines against SCRIPT before rendering.
- Nov-12 booth v2 (Greg: "how exactly [do I edit the text]? ... could you make [key words] not a requirement? ... does it save it
  anywhere?"): build-booth.js now (a) maps booth line i → anim line i when the counts match, else an in-order best match by shared
  words (lineMap: DP over word-overlap Jaccard, threshold 0.15) — key phrases no longer needed for the frames; (b) saves the
  script to localStorage (shf1-script) 0.4 s after typing stops and re-renders the lines live (not while recording); "Use this
  script" button removed; (c) POSTs a copy to the voice server 2.5 s after typing stops → ~/greg-voice/takes/shf1-script.json
  ({script, lines, saved}; /list ignores .json so it isn't shown as a take). Reset asks first. Tested headless: reword (10/10
  thumbs), delete a line (9 lines, map 0,1,3…9), box copy written (test copy deleted after). booth-lines-test 0 bad.
  TODO at render time: render.js must match take lines to anim lines the same way (by position / shared words), NOT key phrases.
- Nov-12 render v01: take shf1-20261112-053214 (100.6 s, camera on, Greg read the placeholder lines as written; line 1 is 25 s of
  speech in short phrases, no restart). mac-render/ = run.sh + render.js from 09, matching now by position / shared words (lineMap,
  same as the booth), out default shelf.mp4; anim.html = v7. On the Mac in ~/shelf-video-render (new folder). Dry: matched 10/10,
  pace 1.20 (capped), 8 camera windows, video 103.4 s / 3101 frames; render 82 s. volumedetect mean −26.3 dB, max −0.8 dB.
  Draft (not YouTube): https://bloop.monster/<shelf>/shelf-v01.mp4 (video/mp4). Contact sheet chk/sheet-render.png.
- Nov-12 PUBLISHED (Greg: "could you please publish it? (and have the description reference the github.. and maybe also have the
  github reference the youtube?) ... as a v0.1"): YouTube https://youtu.be/d-KngLVobEs (public) "syncing with a shelf, v0.1",
  description descriptions/desc-shelf-v01.txt (links github.com/dglittle/shelf and explainer-videos/videos/12-shelf). Token had
  expired (invalid_grant): backed up as token-expired-2026-11-12.json, `node auth.js`, Greg signed in (TOKEN_SAVED 05:52).
  S3: https://bloop.monster/<shelf>/shelf-sync-v01.mp4 (md5 c3f9e978…, matches the Mac render, video/mp4, no-cache).
  Repo: this folder → explainer-videos videos/12-shelf (README row, index.json, collect.py entry); dglittle/shelf README links the video.

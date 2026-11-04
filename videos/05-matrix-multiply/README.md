# matmul-video — "multiplying matrices on paper" (Falk's scheme), Oct-24, 2026

Greg's ask: greg-prompt.txt, brief.txt. Same pipeline as ../epr-video/README.md (code copied from there, not edited in place).

## The math (computed and checked in anim.html)
- The layout is **Falk's scheme** (Sigurd Falk, 1951; "Falk-Schema"). Greg was told; the end card has an optional credit line
  (`const CREDIT=true` in the engine; set false to drop it). Nothing in the SCRIPT names it: those are Greg's words.
- A = [[2,1,3],[1,4,2]] (2×3) bottom-left, B = [[1,5],[2,1],[3,2]] (3×2) above-right, C = AB = [[13,17],[15,13]] under B, right of A.
- Checks (page note + console.error if any fail): mm() product; the same numbers read off the LAYOUT (cells left of C[i][j] in A, above it in B,
  paired in order: layoutTerms); a hand-written product; and the background chain: (AB)C = A(BC) for 5 loops.
- Visual bonus: the pair lines from A[i][k] and B[k][j] meet on the diagonal of the empty 3×3 square (drawn under the cells).

## Files
- anim.html → matmul-anim.html. SCRIPT: 8 lines (not claiming, on paper, we have our first, draw it above, implied space, trace our finger,
  sum them, happy manual), 75 s at the guessed pace. Background: bgChain() = a chain A·B·C computing itself on a 6.6 s loop:
  bright during the intro lines, a faint ghost (alpha 0.045, bigger) behind the explanation. scMain() = the worked example.
- build-booth.js → booth.html → matmul-voice.html. Takes: `mm1-*` (localStorage mm1-script/-frames/-cam, IndexedDB mm-voice-1).
- render.js (default out matmul.mp4), tools/ (shots.js now writes chk/end00.png, chk/mid00.png, chk/t00.png by mode).
- Bottom-right corner (1680–1900, 845–1065) is free in every scene (checked with a fake camera render on the Mac).

## Mac render kit
mac:~/airport-sessions/matmul-render/ (anim.html, render.js, run.sh copied from epr-render). Fake test: fakecam.webm (testsrc2 + tones)
+ fake.json → fake-test.mp4: 8/8 lines matched, 6 face windows, 68.6 s of video in 56 s.

## Status
Oct-24: published https://bloop.monster/<shelf>/matmul-anim.html · https://bloop.monster/<shelf>/matmul-voice.html
Waiting for Greg's take (~/greg-voice/takes/mm1-*). Then: scp to the Mac kit, `./run.sh take.webm take.json --dry`, render, check. Don't upload until "publish".

## Draft 2 (Oct-24), from Greg's notes
Greg: intro = many A·B=C examples (no chains), each smaller, "occupying the space"; NO background during the real explanation;
gloss over the dot product (the audience knows it). Booth skipped while iterating the video.
- anim.html now: swarm(key,seed,keep,dt0,dec,s0) packs little A·B=C's by rejection sampling, shrinking each try (FACE corner and
  `keep` boxes stay free); mini() animates one (A pops, B next to it then slides up, each C cell traces left+up, then re-traces on a cycle).
  SW1 = intro (dives away at "we have our first"); SW2 = the end, around MAINBOX, title and credit.
- Dot product: one equation "2·1 + 1·2 + 3·3 = 13" all at once, the 13 flies in, the other 3 cells fill in 0.55 s each with tracers.
  The elbow/pair lines and the term-by-term equation are gone. 'sum them' hold is 5.2 → 2.6; 'on paper' hold is 1.0 → 1.4.
- SCRIPT text is unchanged, so the published booth (matmul-voice.html) still matches; rebuild it if the holds/visuals should show there.
- Published as matmul-anim2.html (draft 1 stays at matmul-anim.html; anim-v1.html is its local copy).
- tools/tile.py OUT COLS pngs... makes contact sheets.
- Oct-24: the hand-shaped finger was replaced (Greg: it looked like something we want to avoid). finger() is now an abstract
  glowing arrowhead (chevron + soft halo), tinted blue going left through A and orange going up through B. It rests just outside
  the bracket (AX(0)-0.2·CS / BY(0)-0.2·CS) so it never covers a digit. Republished matmul-anim2.html.
- Oct-24: booth rebuilt from draft 2 (`node build-booth.js > booth.html`; it writes to stdout). DIR updated for the swarm/arrow;
  the anim link → matmul-anim2.html. Prefix still mm1- (no takes existed yet). Republished matmul-voice.html.
- Oct-24 03:09: Greg's take mm1-20261024-030900 (48.5 s, camera on). Mac render: 8/8 matched, pace 0.69, 6 face windows,
  51.8 s video, rendered in 46 s. Volume mean −32.4 / max −10.8 dB (same as epr-v01). Checked a 20-frame contact sheet
  (chk/real-a.png, real-b.png). Output: mac:~/airport-sessions/matmul-render/matmul-v01.mp4. NOT uploaded: waiting for "publish".

PUBLISHED Oct-24 (Greg: "ship it!"): https://youtu.be/M6-sdPYdZyY (public), "a nicer way to multiply matrices by hand, v0.1"
(desc-matmul-v01.txt), and S3: https://bloop.monster/<shelf>/manual-matmul-v01.mp4 (= matmul-v01.mp4, the render from the
Oct-24 03:09 take). Known nit: at the start of "trace our finger" the fading "the result" label overlaps "A·B" for ~0.5 s.
- Oct-24: spun off the next flight, ⚛️ qc-video (~/airport-sessions/qc-video, brief.txt + greg-prompt.txt): Greg's
  "quantum computation as a one-hot vector times a giant matrix" screenplay. Created with tarmac.js new/set/say.

# epr-video — "Why is the EPR paradox weird?" (Oct-24, 2026)

Greg's ask (greg-prompt.txt, brief.txt): explain EPR with three increasingly true lies (phone apps with 1, 2, 3 buttons),
then the truth, plus a short "triangle inequality" proof. Same pipeline as ../poker-video/README.md and ../spinor-v2/README.md.

## The physics (computed and checked in anim.html)
- Polarization-entangled photons (|HH>+|VV>)/√2; button = polarizer angle: top 0°, middle 22.5°, bottom 45°.
  P(same) = cos²(angle between): same button 100%, top–middle and middle–bottom cos²(22.5°) = 85.36%, top–bottom cos²(45°) = 50%.
- **Fix to Greg's text**: he wrote "cos(45°), more than 75%", but cos 45° = 70.7% is below 75%. The right number is cos²(22.5°) ≈ 85.4%.
- Bell / triangle inequality: for answers written down at the bump, top≠bottom ⇒ middle differs from one of them, so
  P(T≠B) ≤ P(T≠M)+P(M≠B) → 50% ≤ 2(1−p) → p ≤ 75%. The page checks this on all 8 assignments, and checks an explicit app
  that reaches 75/75/50. Real particles: 14.6% + 14.6% = 29.3% < 50%.
- In lie #3 (top/bottom always different), the inequality gives 100% ≤ 0%, so it's impossible even with random assignments.

## Files
- anim.html → published as epr-anim.html. SCRIPT (31 lines) has key phrases for render.js. Scenes: intro, three lies, lie 1–3, truth, why, lab.
- build-booth.js → booth.html → epr-voice.html. Takes upload to ~/greg-voice as `epr1-*.{webm,json}`.
- render.js (same as poker; default out epr.mp4), tools/ (shots.js, fake-take.js, booth-shot.js). node_modules → ../poker-video.

## Webcam (Oct-24, Greg's ask)
- Booth: "camera" checkbox (remembered) → getUserMedia video 640×480 + round mirrored preview; records video/webm vp8+opus
  (~1.2 Mb/s, ≈50 MB for 5 min; server cap 200 MB). Safari would give video/mp4 → uploaded as .mp4. Tested headless with
  fake devices: tools/booth-cam-test.js.
- render.js: if the take has a video stream (and no --nocam), it puts a 220 px round face with a gold ring at (1680,845), bottom-right.
  It only shows during "windows" = runs of spoken lines with pauses < 1.5 s and no inserted silence, so it's hidden in holds and
  never freezes. Fades 0.3 s. Each window is its own `-ss/-t` input. The first version used split=N, which buffered frames and got
  OOM-killed here (exit 137).
- **Render on the Mac** (Greg's ask; this box has 4 GB): kit in mac:~/airport-sessions/epr-render/ (anim.html, render.js, run.sh).
  `./run.sh <take.webm> <take.json> [--dry] [--out f.mp4]`. About 33 fps there (48 s of video took 43 s). Copy the take from ~/greg-voice/takes
  with scp, and re-copy anim.html/render.js if they change.

## Status
Oct-24: anim + booth published: https://bloop.monster/<shelf>/epr-anim.html · https://bloop.monster/<shelf>/epr-voice.html
Waiting for Greg's take (look in ~/greg-voice/takes for epr1-*). Then render on the Mac (see Webcam), `--dry` first, then S3 (video/mp4).
v0.1 rendered Oct-24 on the Mac from take epr1-20261024-005500 (4:30, all 31 lines, with webcam; pace 0.79; 9 face windows; 9.5 min render):
mac:~/airport-sessions/epr-render/epr-v01.mp4 (copy here: epr-v01.mp4). NOT uploaded anywhere yet (Greg: "don't upload it yet").

## v0.2 ending (Oct-24, Greg's ask)
Lines 0–20 unchanged (pixel-identical, checked against anim-v01.html). The old narrated ending (truth / triangle / lab) is now
VSCRIPT, a virtual timeline after T. New lines 21–26 (nits and details, absolutely create, still impossible, fancy math, convey,
the end): the 85/50 truth table, then a "fancy math" wall of 4 panels that replay the old scenes offscreen (the engine draws to a
swappable context `g`; panel() renders into an offscreen canvas), keeping the bottom-right corner free for the face circle.
Booth: Record starts at the highlighted line, so Greg can record just the new ending as a pickup take.
tools/splice.js <take1> <take2> <out> [--upto 'punch line']: keeps take1 until he moved past that line, then appends take2,
merges cues, and re-encodes vp8/opus (27 s on the Mac). Tested on the Mac with take1 + a fake pickup: all 27 lines matched.
v0.2 rendered Oct-24 on the Mac from Greg's full re-take epr1-20261024-014519 (all 27 lines, webcam, pace 0.79, 3:38, ~4 min render):
mac:~/airport-sessions/epr-render/epr-v02.mp4 (copy here: epr-v02.mp4). The 'convey' hold went 0.6 → 4 s so the spirit punchline is readable.
NOT uploaded anywhere yet.
PUBLISHED Oct-24 (Greg: "publish!"): https://youtu.be/toD7BWe4QeU (public), "why is the EPR paradox weird?, v0.1" (desc-epr-v01.txt),
and S3: https://bloop.monster/<shelf>/why-epr-weird-v01.mp4 (= epr-v02.mp4, the render from the Oct-24 01:45 take).

# eprqc-video — "the EPR paradox as a quantum computation" (Oct-24, 2026)

Greg's ask (greg-prompt.txt): last in the quantum series (qc-video → circuit-video → doubleslit-video https://youtu.be/qdw7IvXof4k),
"basically the same idea as the double slit one, except for the EPR paradox". Video first to look over; booth later.
Builds on his earlier EPR video (../epr-video: the 3-button phone app, polarizers at 0°, 22.5°, 45°).
Code copied from ../doubleslit-video (src-common.js = helpers + swarm), not edited there. Script lines are my DRAFT in his voice.

## The math (computed + checked in anim.html; `node tools/check.js`)
- Two qubits: Alice (first bit), Bob. Tie gates: H on Alice, CNOT Alice→Bob: 00 → (00 + 11)/√2.
- Buttons top/middle/bottom = turn by 0°, 22.5°, 45° (R(θ) on each qubit, like a polarizer), then look.
  same = cos²(angle between) (CHK.cos2): 100% / 85.4% / 50%. Each side alone 50/50 for every pair (CHK.noSignal).
- Written-down answers (all 8 cheat sheets checked, CHK.sheets): different(top,bottom) ≤ 14.6% + 14.6% = 29.3%; qubits: 50%.
- Note: `after` is an engine helper name; the "press buttons a,b" function is press(a,b).

## Files
- anim.html → eprqc-anim.html (assembled from src-math.js + qc helpers + src-common.js + src-scenes.js; edit anim.html now).
  11 lines, 128 s at the guessed pace. Flags MIRROR, NOTE_BELL. Runs: RUNS (cursor sweeps; one per button pair; 3×3 table fills).
- build-booth.js copied from doubleslit (still ds1- strings): change to a new prefix (e.g. epq1-) when Greg wants the booth.

## Status
Oct-24: published https://bloop.monster/<shelf>/eprqc-anim.html (draft 1). Waiting for Greg's feedback.
- Oct-25 (Greg: "say what the two tie gates do; the audience knows gates, not any particular gate"): split 'tie them together'
  into two lines: H = "makes Alice's qubit 50/50 between 0 and 1, like the slit gate from last time"; new 'copies alice' = the copy
  (CNOT) "like the spy gate: it flips Bob's qubit whenever Alice's is a 1". The first run's cursor uses keyframes (kf) so it passes
  H during the first line and the CNOT during the second. Labels "50/50" and "copy: flip Bob if Alice is 1", and little matrices
  (H 2×2, copy 4×4) under the tie box until the buttons line. 12 lines now. Draft 1 kept as anim-draft1.html. Republished.
- Also explained the "15 + 15 = 30" (neighbors differ 14.6%; every top≠bottom cheat sheet is a neighbor-disagreement sheet);
  offered a 100-card visual and a reworded line; Greg hasn't chosen yet.
- Oct-25 draft 3 (Greg: "focus on the mapping between the circuit/real-life setup and the matrix math: the start vector stays,
  multiplied in order by the gates' expanded 4×4s"): chain() strip at the bottom (CHS=50, CHY=800, CHX(i)=80+250i):
  start · H(Alice) · copy · turns(a,b) = now. Each 4×4 appears when its gate is introduced; when the glow passes a gate (or
  during the new 'in order' line, in turn) its matrix lights up and dashed lines tie the gate(s) to it; "now" = product so far,
  and slides right when the turns matrix arrives. Removed the old vector row and the tie insets. Circuit moved up (YA0 280,
  YB0 370, YA1 190, YB1 460); written-down text + "Alice alone" now sit between the diverged wires. Script: 'one for alice'
  + "so our vector of 4 numbers has a 1 at 00"; new line 'in order'; 'turns their qubit' + "one more 4 by 4 matrix at the end".
  13 lines. Draft 2 kept as anim-draft2.html. Republished.
- Oct-28 draft 4 (Greg: "focus only on the link between the physical setup and the matrix math, Falk-style as in the matmul video;
  show where in the result vector the 100/85/50% correlations are; not why it's strange"): src-scenes3.js + script3.js.
  Layout = Falk's staircase for a chain: circuit on top; each gate's 4×4 DIRECTLY under it (XMk, MYB=430, CS2=60); each result
  directly under its matrix, right of the previous vector (VYB); start vector bottom-left. STEPS: per step, each result cell is
  traced (left along the previous vector, up the matrix column) and fills; one turns step per button pair. Final vector: 00 and
  11 ringed; "same (00, 11): a² + d² = …%" and "different (01, 10)". Right panel: real experiment (source + polarizers at the
  pressed angles, "they see the same: …%") + the 3×3 table. Dropped: written-down answers, no-messages, Bell row. End card
  "the setup ↔ the math". 12 lines (keys: 'talked about the epr', 'right below it', 'turn their qubit', 'squared and added', …).
  Draft 3 kept as anim-draft3.html. Republished eprqc-anim.html.
- Oct-29 draft 5 (Greg): (a) removed the right panel (MIRROR=false; real experiment + table gone) and centered the layout
  (CS2=64, X_V0=360, LP=X_V0-150, XW0=X_V0+30); (b) the final vector rings EVERY non-zero cell: 00/11 green (same), 01/10 red
  (different) — before, only 00/11 were ringed even when 01/10 weren't 0; (c) a "squared:" row under the final vector (each
  number squared, as %), and the sums read off it: "same (00 + 11): 42.7% + 42.7% = 85.4%", "different (01 + 10): …".
  Webcam corner checked by pixel scan (rightmost text below y 815 at x 1614). Draft 4 kept as anim-draft4.html. Republished.
- Oct-29 draft 6 (Greg): (a) self-contained: first line now 'famous bit of quantum' ("The EPR paradox is a famous bit of quantum
  weirdness that really happens. In this video, I just want to show how that real setup turns into matrix math."); also dropped
  "like the slit gate from last time", "like the spy gate", "the matrix video" (→ "in a handy layout"). (b) abrupt ending: last
  line hold 1.2 s, no end card, no end swarm (scEnd no longer called); the video ends on the diagram. 125 s at the guessed pace.
  (c) build-alts.js → alts.html → eprqc-alts.html: 6 options (A squared row + sums [current], B bars, C one 100% bar regrouped,
  D squares in place + arcs, E just the headline, F two piles), each drawn for same / neighbors / top-bottom with the engine.
  Draft 5 kept as anim-draft5.html. Waiting for Greg's pick.
- Oct-29: Greg liked C and D, and wants "same" only (different = 1 − same). build-alts2.js → alts2.html → eprqc-alts2.html:
  C1 100% track filled by the 00 + 11 squares; C2 same + total at the fill line (gauge); C3 stacked into a 100% tube; D1 squares
  under 00/11 only + one arc with the total; D2 arc with "a% + b% = total"; CD the arc pours into the 100% track. Only 00/11 ringed.
- Oct-29 draft 7 (Greg picked CD): under the final vector, the 00 and 11 squares (as %), a green arc that draws in from both
  ends, a drop line, then a 100% track that fills to psame ("same: 85.4%"); re-pours on each new button pair (tied to the cells
  refilling). Only 00/11 are ringed (green); "different" is gone. Draft 6 kept as anim-draft6.html. Republished.
- Oct-29: last line → 'there you have it' ("And there you have it: the EPR paradox situation, turned into easy math.", Greg's wording). Republished.
- Oct-29: booth built: build-booth.js (prefix epq1-: localStorage epq1-script/-frames/-cam, IndexedDB epq-voice-1; DIR for the 12
  current lines; title/h1 "The EPR paradox, as matrix math"; link eprqc-anim.html) → booth.html → eprqc-voice.html.
  booth-lines-test: 0 bad at 1000×575, 1440×800, 1920×1000. Waiting for Greg's take (~/greg-voice/takes/epq1-*).
  Mac kit when it arrives: mac:~/airport-sessions/eprqc-render (run.sh from doubleslit-render), --dry first; upload only on "publish".

## v0.1 render (Oct-29)
Take epq1-20261029-031002 (114 s, camera on; all 12 lines as written). Mac kit mac:~/airport-sessions/eprqc-render (run.sh from
doubleslit-render). --dry: 12/12 matched, pace 0.97, 10 face windows. Render: 118.4 s, 3552 frames, 112 s on the Mac.
Volume −24.6 / −0.5 dB (no clipping). Checked a 16-frame sheet (chk/real.png): the face circle sits just right of the "same" bar
(bar ends x≈1614, circle starts 1680), no overlap. Output: mac:~/airport-sessions/eprqc-render/eprqc-v01.mp4 (copy here).
Description drafted: desc-eprqc-v01.txt. NOT uploaded: waiting for "publish".

## Publishing (Oct-29, Greg: "ship it!")
S3 done: https://bloop.monster/<shelf>/epr-as-matrix-math-v01.mp4 (= eprqc-v01.mp4, md5 e45eb2e5…, video/mp4, no-cache).
YouTube: upload.js failed "fatal invalid_grant" (testing-mode OAuth token expired, last renewed Oct 21). Backed up
token-expired-2026-10-29.json; started `node auth.js` on the Mac (auth5.log, opens a Google consent tab); waiting for Greg to
click through (TOKEN_SAVED), then upload as "the EPR paradox, as matrix math, v0.1" with desc-eprqc-v01.txt, public.
Greg re-consented (auth5.log TOKEN_SAVED, new token.json Oct 29 03:21).
PUBLISHED Oct-29: https://youtu.be/9glmM8-isOQ (public), "the EPR paradox, as matrix math, v0.1" (desc-eprqc-v01.txt),
and S3 https://bloop.monster/<shelf>/epr-as-matrix-math-v01.mp4. Render from take epq1-20261029-031002.
Series: D7K6TvOLo7g (Turing machine of QC) → SrnDeKmCIws (circuit diagrams) → qdw7IvXof4k (double slit) → 9glmM8-isOQ (EPR).
Next YouTube token expiry: ~Nov 5 (testing-mode OAuth, ~7 days): re-run `node auth.js` on the Mac if upload says invalid_grant.
- Token-expiry how-to also in mac:~/pima/work/youtube-upload/README.md (added Oct-29).
- Oct-29: spun off the generic next flight: 🎬 next-video (~/airport-sessions/next-video/brief.txt = the full handoff). Created with tarmac.js new --text.

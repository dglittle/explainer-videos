# qc-video — "quantum computation as a one-hot vector times a giant matrix" (Oct-24, 2026)

Greg's ask: greg-prompt.txt, brief.txt. Same pipeline as ../matmul-video/README.md (code COPIED from there, not edited in place).
node_modules → ../poker-video/node_modules.

## The math (computed and checked in anim.html; `node tools/check.js` prints CHK, key-phrase rules, page errors)
- Tape of 3 cells → 2³ = 8 states (state k ↔ BITS(k)). Classical step = "add 1" (binary counter): P[k+1 mod 8][k] = 1,
  a permutation (one 1 per row and column). Story: 011 → 100 → 101.
- Quantum: VR = H⊗H on cells 2,3 of |101⟩ = ½(|100⟩−|101⟩+|110⟩−|111⟩); VC = phase i on cell 2 → ½, −½, ½i, −½i.
  U = CNOT(0→2)·Phase(π/3 on 1)·Ry(cos .8/sin .6 on 0)·Ry(0.5 rad on 2) (GATES), checked U†U = I; Q1 = U·VC, Q2 = U·Q1.
- Looking (Born rule): PROB = |Q2ᵢ|², a fixed draw u = 0.8 → we "see" 111 (p ≈ 0.32), the vector collapses to one-hot, then U runs on.
- Erasing step [1 1; 0 0]·(.71,.71) = (1.41, 0): length √2 (why classical steps must be reversible; Bennett 1973).
- Swarm: little d×d machines (d = 2/4/8), random permutations (gold, digits) or random unitaries (pink, arrows); norms checked.
- What I told Greg: his picture is right. |z|² = z·z̄ is right. Notes: the state should include head position + control state
  (on-screen note NOTE_HEAD); "keeps length 1 for every input" = unitary ⇒ invertible ⇒ classical step must be reversible
  (optional line 'called unitary'); measurement / Born rule is the missing piece (optional line 'when we look');
  in practice U = product of small local gates (NOTE_GATES); credits (CREDIT): Aaronson QCSD ch. 9, Deutsch 1985, Bernstein–Vazirani 1993, Bennett 1973.

## Files
- anim.html → qc-anim.html. Built from src-math.js + matmul's helpers + src-scenes.js (I assembled it once with python;
  since then anim.html and the src files were edited in step: edit anim.html directly from now on, the src-*.js are just history).
  SCRIPT: 14 lines (2 optional: 'called unitary', 'when we look'; if Greg skips them, render.js plays their notes silently),
  181 s at the guessed pace. Flags: CREDIT, NOTE_HEAD, NOTE_GATES.
- build-booth.js → booth.html → qc-voice.html. Takes: `qc1-*` (localStorage qc1-script/-frames/-cam, IndexedDB qc-voice-1).
- tools/: shots.js, tile.py, check.js (new), steptimes.js (new: frame times inside each step), booth-shot.js, fake-take.js, splice.js.
- Bottom-right corner (1650–1920, 815–1080) is free in every scene (checked on the per-line contact sheets chk/sheet-*.png).

## Status
Oct-24: published https://bloop.monster/<shelf>/qc-anim.html · https://bloop.monster/<shelf>/qc-voice.html
(kbt versions: qc-anim 60ne5-38051, qc-voice 0m0p1-51363). Waiting for Greg's feedback / take (~/greg-voice/takes/qc1-*).
Next: Mac kit mac:~/airport-sessions/qc-render (copy matmul-render's run.sh + anim.html + render.js), `--dry` first. Don't upload until "publish".

## Draft 2 (Oct-24), Greg: "make the vector a row, it flows better left to right"
- The vector is now a ROW: new = vector · M, with the displayed matrices MP = Pᵀ (one 1 in every ROW) and MU = Uᵀ (vm() in the math).
  CHK.rowform checks v·Pᵀ = P·v and VC·Uᵀ = U·VC. Old column version kept as anim-v1-colvec.html (not published).
- Layout = Falk's scheme for vector·matrix (like the matmul video): vector row bottom-left (x 600–1096, y 716), matrix up-right
  (x 1120–1616, y 196–692), result row under the matrix. The empty square above the vector has a faint diagonal "mirror" with the
  state names (= the matrix's row names). Classical: the 1 goes up to the diagonal, right along its row to the matrix's 1, down into
  the result; quantum: every entry up + along its row, then every column down. Next step: the result slides LEFT into the vector's place.
- Swarm minis use the same layout. Probability bars hang under the result's state names. End card: vector ← vector · U.
- Republished qc-anim.html (82lla-3779) and qc-voice.html (cz1gn-3857; DIR updated; SCRIPT text unchanged, so the prefix stays qc1-).
- Oct-24 booth fix (Greg: after Space the next line sometimes sat with its top hidden, and couldn't be scrolled). Causes: go() read
  offsetTop while the font-size (and thumbnail width) transitions were still running, so a long previous line that then shrank
  pushed everything up; and the 3 thumbnails were a fixed ~680 px, leaving a ~290 px text column on a 1000 px window.
  Fix (build-booth.js, end): no font-size/width transitions; thumbnails min(120px,8vw) / current min(220px,14vw), wrap under the
  text below 420 px; a tall line is moved up to fit (never above the top, by its text block); wheel/trackpad nudges the lines
  (the next line snaps back). tools/booth-lines-test.js [booth.html] [w h] presses Space through all lines: 0 bad at
  900×520, 1000×575, 1000×700, 1440×800, 1920×1000 (the old booth: 13 of 14 bad at 1000×575). Republished qc-voice.html.
  The same bug is in the epr/matmul booths (not fixed there).

## v0.1 render (Oct-24)
Take qc1-20261024-042911 (127 s, camera on; Greg read all 14 lines incl. both OPTIONAL ones, script unedited).
Mac kit mac:~/airport-sessions/qc-render (run.sh from matmul-render, anim.html + render.js from here). --dry: 14/14 matched,
pace 0.78, 11 face windows. Render: 139.4 s video, 4181 frames, 2:46 on the Mac. Volume mean −33.5 / max −10.5 dB.
Checked an 18-frame contact sheet (chk/real-a.png, real-b.png): face circle never covers content.
Output: mac:~/airport-sessions/qc-render/qc-v01.mp4 (copy here: qc-v01.mp4). Description drafted: desc-qc-v01.txt.
(uploaded later the same day, see PUBLISHED below)

PUBLISHED Oct-24 (Greg: "ship it!", title idea his): https://youtu.be/jQTMWvVRNXo (public), "the Turing machine of quantum computation, v0.1"
(desc-qc-v01.txt; uploaded with mac:~/youtube-upload/upload.js, log in upload.log there), and S3:
https://bloop.monster/<shelf>/turing-machine-of-qc-v01.mp4 (= qc-v01.mp4, md5 2bcd7282…, content-type video/mp4; put directly
with aws s3api, since personal-reports-push.sh would label an .mp4 application/octet-stream). Render from take qc1-20261024-042911.

## Fix after publishing (Oct-24), Greg: "going from numbers to complex numbers, the left vector has nothing in it, a cell's state still highlighted"
Cause: in 'relax the'/'complex too' the morph ran on the RESULT (101) while the left vector (the old input, 100) faded out on
purpose (left·M = right stops being true), but its gold label 100 stayed (hotT ignored alpha). Zero amplitudes drew as empty circles.
Fix: new timeline event 'slide' at at(l8,0.05) moves the result (101) left into the vector's place; morphs take on:'T' and
change the LEFT vector in place (result slots stay empty until U acts in 'also require'); highlights need alpha > 0.5; zero
amplitudes in arrow mode show a dim 0 (cells ≥ 40 px); value labels (½, −½i) go under whichever vector morphed.
Published v0.1 page kept as anim-v01-published.html. Republished qc-anim.html (yxg1e-608). Re-rendering from the same take as
mac:~/airport-sessions/qc-render/qc-v02.mp4 (dry: 14/14, pace 0.78, 139.4 s).
v0.2 rendered (162 s on the Mac, 12.6 MB): mac:~/airport-sessions/qc-render/qc-v02.mp4 (copy here: qc-v02.mp4, md5 01122d4f…); checked frames 58–88 s (chk/real2.png).

PUBLISHED v0.2 render Oct-24 (Greg chose "(a)": new upload, old one unlisted): https://youtu.be/D7K6TvOLo7g (public; same title
"the Turing machine of quantum computation, v0.1", same desc-qc-v01.txt). The first upload https://youtu.be/jQTMWvVRNXo is now
UNLISTED (update.js --privacy unlisted; old links still work). S3 https://bloop.monster/<shelf>/turing-machine-of-qc-v01.mp4
now holds qc-v02.mp4 (12614827 bytes, no-cache). Current video id: D7K6TvOLo7g.
- Oct-24: follow-on video started in ../circuit-video (circuit diagrams → vector × matrix); the double-slit idea is the one after that.

# circuit-video — "from circuit diagrams to vector × matrix" (Oct-24, 2026)

Greg's ask (greg-prompt.txt): a follow-on to qc-video ("the Turing machine of quantum computation", https://youtu.be/D7K6TvOLo7g):
explain the one-horizontal-line-per-qubit circuit diagram and how it converts mechanically into vector × matrix.
His bigger idea (the double-slit experiment as a quantum computation) is the NEXT video. Code copied from ../qc-video (not edited there).
No screenplay from Greg this time: the SCRIPT lines are my DRAFT in his voice, for him to rewrite in the booth.

## The math (computed + checked in anim.html; `node tools/check.js`)
- 3 wires → 8 states; the top wire is the first bit (each bit drawn in its wire's color: WC).
- Circuit: H on wire 0, CNOT 0→1, CNOT 1→2 (GHZ): 000 → (000+100)/√2 → (000+110)/√2 → (000+111)/√2.
- Rule (expand): M[i][j] = little[sub(i)][sub(j)] if i, j agree on every wire the gate doesn't touch, else 0 = "copy the little matrix
  in once per setting of the other wires". CHK.kron: equals H⊗I⊗I, CNOT⊗I, I⊗CNOT. CHK.stamps: the 4 copies (STAMPS) land where drawn.
- Row vectors (as in qc-video): new = v·Mᵀ; these gates are symmetric so Mᵀ = M (CHK.symmetric). Bonus: v·M₁·M₂·M₃ is in diagram order;
  with column vectors it's M₃M₂M₁v (CHK.order). UT = M₁M₂M₃ gives the same result (CHK.together). All unitary, lengths 1.
- Swarm: random little circuits (H/X/Z/CNOT, 2–4 wires), each with its matrix as a heat grid (gold +, pink −), computed by the same rule.

## Files
- anim.html → circuit-anim.html (assembled from src-math.js + qc-video helpers + src-scenes.js; edit anim.html from now on).
  SCRIPT 12 lines ('same order' OPTIONAL), 147 s at the guessed pace. Flags NOTE_TENSOR, NOTE_LOOK (true), NOTE_NEXT (false: "next: double slit?").
- build-booth.js → booth.html → circuit-voice.html. Takes: `circ1-*` (localStorage circ1-script/-frames/-cam, IndexedDB circ-voice-1).
  Includes the booth line-position fix from qc-video. tools/booth-lines-test.js: 0 bad at 1000×575, 1440×800, 1920×1000.
- Mac render kit: make mac:~/airport-sessions/circuit-render (copy qc-render's run.sh), --dry first; upload only on "publish".

## Status
Oct-24: published https://bloop.monster/<shelf>/circuit-anim.html · https://bloop.monster/<shelf>/circuit-voice.html
Waiting for Greg's feedback on the draft lines / the animation, then a take (~/greg-voice/takes/circ1-*).

## v0.1 render (Oct-24)
Take circ1-20261024-053644 (108.5 s, camera on; Greg read all 12 draft lines unedited, incl. the optional 'same order').
Mac kit mac:~/airport-sessions/circuit-render (run.sh from qc-render). --dry: 12/12 matched, pace 0.79, 9 face windows.
Render: 115.6 s video, 3467 frames, 144 s on the Mac. Output: mac:~/airport-sessions/circuit-render/circuit-v01.mp4 (copy here).
Volume mean −24.1 / max −1.3 dB: ~9 dB louder than qc/matmul, and it's in the take itself (source −23.8 / −1.3), no clipping.
Checked a 16-frame contact sheet (chk/real.png). Description: desc-circuit-v01.txt. (published, see below)

PUBLISHED Oct-24 (Greg: "publish!"): https://youtu.be/SrnDeKmCIws (public), "from circuit diagrams to vector × matrix, v0.1"
(desc-circuit-v01.txt; mac:~/pima/work/youtube-upload/upload.js), and S3: https://bloop.monster/<shelf>/circuit-diagrams-v01.mp4
(= circuit-v01.mp4, md5 d8ab8e7b…, video/mp4, no-cache). Render from take circ1-20261024-053644.
Next (Greg's idea): the double-slit experiment as a quantum computation.
- Oct-24: next in the series: ../doubleslit-video.
- Oct-24: published https://youtu.be/qdw7IvXof4k (the double slit, ../doubleslit-video).

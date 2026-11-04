# doubleslit-video — "the double-slit experiment as a quantum computation" (Oct-24, 2026)

Greg's ask (greg-prompt.txt): third in the series after qc-video (https://youtu.be/D7K6TvOLo7g) and circuit-video
(https://youtu.be/SrnDeKmCIws). Script = Greg's words (light cleanup); 'coin flip' and 'end in different' are my OPTIONAL lines.
Code copied from ../circuit-video (helpers + swarm: src-common.js), not edited there.

## The math (computed + checked in anim.html; `node tools/check.js`)
- Dual-rail: one particle = which wire holds the 1: top = 10, bottom = 01 (00/11 never occur: CHK.oneParticle).
- slit (on top/bottom) = [[1/√2, 1/√2],[1/√2, −1/√2]]: 10 → (10 + 01)/√2, 50/50.
- mix 25% = [[√¾, −½],[½, √¾]] (row vectors: new = v·M): a definite top/bottom flips with ½² = 25% (CHK.flip25).
- slit then mix: top (1+2·√¾·½)/2 = 93.3%, bottom 6.7%. Coin-flip math would give 50%·75% + 50%·25% = 50%.
- Fringes (NOTE_FRINGE): a path phase φ gives P(top) = (1 + √3/2·cos φ)/2, between 6.7% and 93.3%.
- Spy: 3rd wire, copy (CNOT top → spy) after the slit: the spy always equals the path (CHK.spyTruth); after mix: 50/50 (CHK.spy5050),
  because top ends as 0.61 (spy 1) and 0.35 (spy 0) in different cells: 0.61² + 0.35² = 50%.
- Notes for Greg: "travel" itself doesn't change the vector (the interference happens where the paths are mixed again; a longer path
  adds a phase = the fringes); a quantum gate doesn't have "a chance" of flipping by itself: its entries are amplitudes (√¾, ½) that
  square to 75/25 on a definite input; the copy gate copies top/bottom, not the superposition (no-cloning), and that's what entangles.
  This setup is a Mach–Zehnder interferometer (NOTE_MZ credit on the end card).

## Files
- anim.html → doubleslit-anim.html (assembled from src-math.js + qc helpers + src-common.js + src-scenes.js; edit anim.html now).
  SCRIPT 14 lines, 176 s at the guessed pace. Flags NOTE_TRAVEL, NOTE_FRINGE, NOTE_MZ (all true).
- build-booth.js → booth.html → doubleslit-voice.html. Takes: `ds1-*` (localStorage ds1-script/-frames/-cam, IndexedDB ds-voice-1).
- Mac render kit: make mac:~/airport-sessions/doubleslit-render (run.sh from circuit-render), --dry first; upload only on "publish".

## Status
Oct-24: published https://bloop.monster/<shelf>/doubleslit-anim.html · https://bloop.monster/<shelf>/doubleslit-voice.html
Waiting for Greg's feedback / take (~/greg-voice/takes/ds1-*).

## Draft 2 (Oct-24), Greg: "instead of explaining why they're (not) equal, make the dialog about how they mirror the real double slit"
- Dropped my "why" lines ('coin flip', 'end in different') and their notes (coin-flip math, 0.61² + 0.35²), and the φ fringe plot.
- New OPTIONAL mirror lines: 'bright stripes' (top/bottom ≈ a bright and a dark spot) and 'detector at the slits' (the stripes go away).
- MIRROR panel (right, under the bars): source, two slits, screen. Screen computed from the two slit paths (slitAmp: size·e^(ikr)):
  run 1 adds amplitudes then squares (ISTRIPES: stripes); run 2 has a detector, squares then adds (IPLAIN: one smooth blob).
  The screen fills when the circuit's particle passes the mix gate. Marks: top = the bright center (YB), bottom = the first dark
  stripe (YD). CHK.mirror. The intro cartoon uses the same ISTRIPES. End card: a "circuit ↔ real double slit" table.
- Draft 1 kept as anim-draft1.html. Republished both pages (Greg should press "Reset to the double-slit script" in the booth).
- Oct-24: Greg's edit: 'split into two' line now says "in quantum computation, we can't create or destroy qubits" (was "quantum mechanics"); on-screen caption matches. Republished both pages.

## v0.1 render (Oct-24)
Take ds1-20261024-064558 (137 s, camera on; all 14 lines with the latest wording, incl. both OPTIONAL mirror lines).
Mac kit mac:~/airport-sessions/doubleslit-render (run.sh from circuit-render). --dry: 14/14 matched, pace 0.79, 8 face windows.
Render: 140.3 s video, 4209 frames, 358 s on the Mac. Volume mean −24.2 / max −1.3 dB (like circuit-video's take).
Checked a 16-frame contact sheet (chk/real.png). Output: mac:~/airport-sessions/doubleslit-render/doubleslit-v01.mp4 (copy here).
Description drafted: desc-doubleslit-v01.txt. NOT uploaded: waiting for "publish".
- Oct-24 (Greg: "connect the copy gate to the lower qubit, so it doesn't cross a wire"): copy is now bottom → spy (CP8: spy ^= bottom);
  same which-way info, still 50/50; note text "the spy = 1 exactly when the particle took the bottom path ✓" (CHK.spyTruth updated).
  The v0.1 render's page kept as anim-v01-render.html. Republished both pages; re-rendering from the same take as doubleslit-v02.mp4.
  v0.2 rendered (263 s on the Mac): mac:~/airport-sessions/doubleslit-render/doubleslit-v02.mp4 (copy here; md5 7b3f2840…); spy-run frames checked (chk/real2.png). NOT uploaded: waiting for "publish".
- Oct-24 (Greg: rework "one qubit splits into two" around "a particle with two places it can go"; he'll re-record):
  'split into two' → 'two places' ("We'd like a particle that has two places it can go, like the two slits. So let's use two qubits,
  one for each place, where a 1 means the particle is there."); 'top qubit is a 1' → "We start knowing the particle is at the top: ...".
  Visual: the cartoon stays through that line, its two slits light up in the top/bottom wire colors, caption "two places it can go →
  one qubit for each place". The split/✗ picture is gone. v0.2-render page kept as anim-v02-render.html. Republished both pages.
- Oct-24 (Greg: "the point is the numbers DO change during travel; the 25% mixing gate represents the travel itself"): agreed: in
  the real experiment the mixing is the propagation (each slit's wave reaches both spots); a bare wire = no time passing. Removed
  NOTE_TRAVEL ("travelling: the numbers don't change"); the dashed "travel" bracket now stretches over the mix gate when it
  appears, with "(the waves fan out and overlap)"; end-card row "the mix gate ↔ the travel to the screen (the waves fan out)".
  (My earlier README note "travel itself doesn't change the vector" is superseded.) Script unchanged. Republished both pages.

## v0.3 render (Oct-24) — the current one
Take ds1-20261024-073853 (133 s; the "two places" wording; all 14 lines). With the travel-bracket + bottom-wire copy changes.
--dry: 14/14, pace 0.75, 6 face windows. Render: 136.2 s, 4086 frames, 252 s on the Mac. Volume −24.0 / −2.5 dB.
Checked a 16-frame sheet (chk/real3.png). Output: mac:~/airport-sessions/doubleslit-render/doubleslit-v03.mp4 (copy here).
desc-doubleslit-v01.txt updated to the two-places / travel-is-the-mix framing. (published, see below)

PUBLISHED Oct-24 (Greg: "publish!"): https://youtu.be/qdw7IvXof4k (public), "the double-slit experiment as a quantum computation, v0.1"
(desc-doubleslit-v01.txt; mac:~/pima/work/youtube-upload/upload.js), and S3: https://bloop.monster/<shelf>/double-slit-qc-v01.mp4
(= doubleslit-v03.mp4, md5 510186d1…, video/mp4, no-cache). Render from take ds1-20261024-073853.
Series so far: D7K6TvOLo7g (Turing machine of QC) → SrnDeKmCIws (circuit diagrams) → qdw7IvXof4k (double slit).
- Oct-24: next (last in the series): ../eprqc-video (the EPR paradox as a quantum computation).
- Oct-29: the series' last video (for now) published: https://youtu.be/9glmM8-isOQ (../eprqc-video).

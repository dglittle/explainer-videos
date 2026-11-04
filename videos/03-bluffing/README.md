# poker-video — "Tiny Poker: bluffing is math" (Oct-21, 2026)

Greg's ask: show with a tiny poker game that bluffing is mathematically right, at some frequency, by
recreating the math (256×256 payoff matrix → linear program → human strategy). Same pipeline as ../spinor-v2/README.md.

## The game & the math (solve.py, explore.py, punch.py; venv in .venv with numpy+scipy)
Cards 1–4, one each (12 deals). Stacks 4. SB posts 1, BB posts 2. SB: fold / call (limp) / raise to 4.
vs raise, BB: fold/call. vs limp, BB: check (showdown ±2) / raise to 4 → SB fold (−2) / call (±4).
SB plan per card ∈ {F, R, call→fold, call→call} → 4⁴ = 256; BB per card {check|raise}×{fold|call} → 256.
- Value for SB **5/36** chip/hand. SB optimal (one of many): ⅓ each of [F,F,CC,R], [R,F,CC,R], [F,F,CF,R]
  → 4 raise; 3 limp, call a raise ⅔; 2 fold; 1 fold ⅔ / **raise ⅓ (bluff)**. (Freedom: the bluff mass can
  be split between 1s and 2s, total ⅓; the 3's ⅔ call is forced.)
- BB optimal: ½ [kF,kF,kC,rC], ⅓ [rF,kF,kF,rC], ⅙ [kF,kF,kF,rC] → 4 raise/call; 3 check, call a raise ½;
  2 check/fold; 1 **raise ⅓ after a limp (bluff)**, else check; fold to raises.
- Why ⅓: BB with a 3 facing a raise sees 4s (always) + ⅓ of 1s → ¼ of raises are bluffs → call = ¼·4 − ¾·4 = −2 = fold.
- SB banned from bluffing: 4/36. BB banned from bluffing: 12/36. Neither: 9/36. Dominance elimination: 256×256 → 36×24.

## Files
- anim.html → published as poker-anim.html. 2-D canvas only (no WebGL). Engine between ENGINE START/END:
  SCRIPT = [key phrase, text, wordless hold s]; line times S[i]/E[i] are derived from word counts (2.5 w/s).
  The payoff matrix is computed in the page; the LP solution (XS/YS) is hard-coded from solve.py and checked (VAL = 5/36).
- build-booth.js → booth.html (published as poker-voice.html). Script + per-line frames come from the engine.
  Takes upload to ~/greg-voice as `poker1-*.{webm,json}`.
- render.js `<take> <take.json> [--dry] [--max N] [--out f.mp4]`: matches take lines to SCRIPT by key phrase (in order;
  lines may be skipped), pins speech start/end → S/E, inserts silence where the anim needs a hold. Renders fine on
  THIS box (~12 fps, ~13 min for 5 min of video). Always `--dry` first.
- tools/shots.js (frame PNGs → chk/), tools/booth-shot.js, tools/fake-take.js (tone take for testing render.js).
- Publish: `node ~/kb/tools/kbt/kbt.js write docs/<shelf>/<f> --new` (or read/--version to update), and
  `bash ~/kb/tools/personal-reports-push.sh pub/<f>` (push uses basename only).

## Status
v0.1 rendered Oct-21 from take poker1-20261021-022834 (4:25): https://bloop.monster/<shelf>/tiny-poker-v01.mp4
(render-v01.log). render.js scales the wordless holds by Greg's pace (speech/anim, here 0.83), per his ask.
Re-rendered from Greg's corrected take poker1-20261021-030049 (pace 0.80, 4:14):
https://bloop.monster/<shelf>/tiny-poker-v01-take2.mp4 (render-v01-take2.log) — this is the current one.
Published Oct-21 as "Tiny Poker: bluffing is math, v0.1"; retitled Oct-22 to "is bluffing actually a good idea, mathematically?, v0.1" (naming/: Astra + Fable brainstorm), public: https://youtu.be/iEu0NNmp28E (desc-poker-v01.txt).
YouTube token had expired (testing-mode OAuth, ~7 days): re-consent = on the Mac `node auth.js` (opens a browser tab Greg clicks through). If he rewords a line, keep its key phrase
(or update SCRIPT keys) so render.js can match it.

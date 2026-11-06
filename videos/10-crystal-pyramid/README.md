# crystal-video — contact juggling idea (Oct-29, 2026; topic still forming)

Greg's ask: de-risk two parts first. (a) a short fair-use clip of Bowie in Labyrinth spinning crystal balls (really Michael
Moschen's arm from behind, credited "crystal ball manipulation"). (b) a cute 3-D animated "diagram" of 4 balls stacked in a
pyramid, rotating, in JS/WebGL.

## (b) pyramid.html (WebGL test)
- One fragment shader ray-traces 4 glass balls (r=1; 3 on the floor + 1 on top; CHK.touching = all 6 center distances are 2r),
  refraction in and out, a reflection bounce, glowing tetrahedron edges + center dots INSIDE the glass (seen through it),
  a grid floor with glassy shadows + a small caustic. Rotation SPIN=0.55 rad/s (?spin=). drawFrame(t) + cv, like anim.html.
- ?still=T draws one frame. Headless: tools/glshots.js (chromium --use-angle=swiftshader --enable-unsafe-swiftshader; ~2.5 s/frame
  at 1920×1080 in software. A real GPU (Mac render) is fast; check the render path before relying on it.)
- Don't name globals `top` (clashes with window.top).
- Published: https://bloop.monster/<shelf>/crystal-pyramid.html

## (a) Labyrinth clip
- No yt-dlp on this box or the Mac (Mac has ffmpeg). Lead: Henson's "Inside the Labyrinth: Crystals" youtube.com/watch?v=3U8fTAHxjdo.
- Risk: YouTube Content ID may claim film clips (Labyrinth = Henson/Sony) even when they're fair use.

## (a) update Oct-29
- Installed on the Mac (Greg OK'd): brew yt-dlp 2026.10.26 + deno (YouTube's JS challenge needs it). Works.
- Downloads in mac:~/airport-sessions/crystal-src/dl/ (contact sheets: crystal-src/sheet.sh IN OUT EVERY COLSxROWS; copies in chk/s-*.png):
  - 3U8fTAHxjdo  Henson official "Inside the Labyrinth: Crystals", 2:57, 640×480 (best). 0:00 a gloved hand with a ball pyramid;
    0:06–0:20 Moschen lying down in black, arm raised, doing the balls; 0:24 ball close-up; 0:42 Bowie with a ball; Henson talking.
  - yfKEFs5E9fc  fan clip "Crystal Ball Trick (Michael Moschen)", 29 s, 480×360.  0UWNWVIhFdY  fan clip, 41 s, 320×240.
- Ideas for Content ID: small inner frame, short, talked over.

## pyramid test 2 (Nov-1, Greg: "without the tetrahedron, and going through one more ball, with a framerate")
- pyramid.html rewritten as a loop (v1 kept as pyramid-v1.html): per pixel, up to DEPTH glass passes. At each ball: Fresnel
  reflection shaded cheaply (cheap(): one-step ball / floor / sky), highlight + rim, then the ray refracts in, bounces inside on
  total internal reflection (≤4), refracts out, and goes on to the next ball. After DEPTH balls, cheap() shades the rest.
  ?depth=N (default 2), tap the HUD or press 1–5 to change it live. The HUD (an HTML div, not in the canvas) shows fps + resolution;
  ?hud=0 hides it. Lines/dots removed. Floor shadows + caustic still faked.
- Headless (software GL): ~1.7 s/frame at depth 1–3. Published https://bloop.monster/<shelf>/crystal-pyramid2.html

## compare page (Nov-1, Greg: "go through a third ball, and show one the old way and one the new")
- compare.html (built from pyramid.html's shader; regenerate if the shader changes): two WebGL canvases, same clock. Left depth 1
  ("the old way": rays stop at the first ball), right depth 3. Tap a label to cycle 1–5 (keys 1–5 right, shift+1–5 left);
  ?a=&b= set depths, ?w= canvas width (default 960×540 each). HUD fps covers both views. tools/pageshot.js = full-page screenshot.
- Published https://bloop.monster/<shelf>/crystal-compare.html

## THE clip (Nov-1): the 4-ball pyramid in the film
- Greg: not the bedroom scene, not "Jareth Visits Hoggle" (different trick): the moment Jareth sends bubbles to Sarah.
- Found in fan clip _A29dCiWe8w "Labyrinth - Peach Dreams" (Samasaurus Rex, 4:12, 640×480 letterboxed, picture ≈640×274):
  3:09–3:15 close-up, 4 crystal balls stacked in a pyramid on Jareth's gloved hand (Moschen's), dissolving in over Sarah's face;
  3:16–3:18 Jareth in the castle window sending a bubble; 3:19 the bubbles float to Sarah. (chk/z-A2.png = 1 fps sheet from 3:04.)
- Not in the official Henson "Ballroom Scene" 4nBjvElCzAw (starts after the bubbles). gQlwvmFAyzc ("As The World Falls Down"):
  worse VHS-like 4:3 copy. No HD copy of this moment found yet.

## first cut (Nov-1) — Greg's screenplay: labyrinth | anim | Greg fails | anim + arrows ("rotate!") | Greg rotates
- Greg's video: mac ~/Downloads/IMG_0797.MOV (AirDrop) → copied to mac:~/airport-sessions/crystal-src/greg/. iPhone, SDR HEVC
  1920×1080 landscape, 29.91 fps, 39.5 s. 0–8 s fake struggle (logos don't move); ~9 s real rotation starts; 10–36 s rotating;
  37 s+ camera drops. Sheets: chk/s-greg.png (1 fps), chk/z-greg.png (2 fps, 7–17 s).
- cut-anim.html (shader from pyramid.html + 2-D overlay; ?scene=spin|arrows, ?t=): spin = 4 s, 0.9 rad/s, depth 3; arrows = 5 s,
  balls still, a glowing ring (back half faint) draws in around the pile at y 1.15, r 2.75, 3 arrowheads glide counterclockwise
  (seen from above), fades out the last 0.35 s. proj() = the shader's camera. AirDrop on the Mac was Off; Greg turned it on.
- Mac kit mac:~/airport-sessions/crystal-render/ (copies in render/): frames.js SCENE SECS OUT.mp4 (GPU Chrome, Metal, ~20 ms/frame)
  → a-spin.mp4, a-arrows.mp4; cut.sh OUT.mp4 (env L0 L1 F0 F1 R0 R1 = cut points) → crystal-cut1.mp4.
- crystal-cut1.mp4: 26.9 s, silent audio track. 1) Labyrinth 3:09.4–3:15.3, crop 624×266+8+105 → 1440×614 at (240,170) on
  #0b0e16, captions "Labyrinth (1986)" + "crystal balls: Michael Moschen" (Avenir Next), 0.3 s fade-in; 2) spin 4 s;
  3) Greg 1.0–6.0; 4) arrows 5 s; 5) Greg 10.0–17.0. Hard cuts, abrupt end.
- Spin scene: the front ball looks milky when it covers another ball (depth 3 sees the pale wall through 2 balls). Not a bug.

## cut 2 (Nov-1, Greg: "(a) twist the other way, to match Bowie and me; (b) the arrows scene: balls should spin too, as before")
- cut-anim.html (cut 1 version kept as cut-anim-v1.html): DIR = -1 (front of the pile moves left on screen); SPIN = 0.9*DIR;
  ring uses DIR*RR*cos(th); arrows scene now spins exactly like the spin scene, ring + arrowheads on top.
  New CHK.sameWay: front ball and ring front both move in DIR on screen (caught my first sign error). CHK all true on the Mac.
- Re-rendered a-spin/a-arrows, ./cut.sh crystal-cut2.mp4 (same cut points, 26.9 s). Copy in render/.

## trimmer (Nov-1, Greg: "a thing like the recording studio to pick in/out times for the Bowie clip and my two clips")
- trim.html (local on the Mac, NOT published: it plays the film clip): mac:~/airport-sessions/crystal-render/trim.html, proxies in
  trim/ (lab.mp4 = fan upload 170–210 s, cropped, 30 fps, -g 6; greg.mp4 = 960×540, 30 fps, -g 6). 3 tabs (Labyrinth / pretend fail /
  real rotation), scrub bar with the picked range, ±1 frame / ±1 s, set IN / OUT, play IN→OUT; keys space ←→ shift I O P 1-3.
  Times are original-file seconds. Picks persist in localStorage (crystal-cuts-v1); Save downloads ~/Downloads/crystal-cuts.json.
- cutj.sh OUT.mp4 [json] reads the newest ~/Downloads/crystal-cuts*.json → env L0..R1 → cut.sh (copies the json to cuts-used.json).
  Tested in Chrome on the Mac at 1000×575 (headless): frame/second steps, IN, tab switch, preview all work, no errors.

## cut 3 (Nov-1) — Greg's picks from trim.html (~/Downloads/crystal-cuts.json, copy render/cuts-used.json)
- lab 189.4–195.3 (unchanged), fail 5.48–7.80 (2.3 s), rot 8.42–17.00 (8.6 s). ./cutj.sh crystal-cut3.mp4 → 25.8 s. Copy in render/.

## cut 4 (Nov-1, Greg: "(a) the arrow becomes a circle: start a bit left of center, end a bit right, looping around behind;
##   (b) balls rotate ~1.9×")
- cut-anim.html (cut 2/3 version kept as cut-anim-v2.html): drawRing = ONE arrow, th from -pi/2+GAP/2 (just left of front-center)
  the spin's way around behind to -pi/2+2pi-GAP/2 (just right), GAP 0.42 rad; draws in over 1.1 s with the head riding the tip,
  then the head stays at the end (pointing left, toward center) with a gentle pulse; back part faint. SPIN = 1.71*DIR rad/s.
  CHK touching + sameWay true.
- Re-rendered a-spin/a-arrows; ./cutj.sh crystal-cut4.mp4 cuts-used.json (Greg's cut 3 picks) → 25.8 s. Copy in render/.

## real path tracing prototype (Nov-1, Greg: arrow → thicker "tall ribbon", maybe red; "do real raytracing with the modern POV-Ray,
##   and let the sphere rays hit the arrow too; first just show a real raytraced pyramid, same setup, to see if it's worth it")
- Installed Blender 5.2.3 on the Mac (brew --cask blender). blender/pyramid.py (mac: crystal-render/blender/):
  `Blender -b -P pyramid.py -- OUT.png ANGLE SAMPLES`. Same balls (asserts touching), camera (angle_y = 2 atan(0.5/1.9)), key light
  from L as a disk area light, a soft blue "window" light, world gradient, grid floor (procedural). Glass BSDF IOR 1.5, faint blue.
  Cycles on GPU (Metal), denoise, 24 bounces, MNEE glass caustics (5.2: ob.cycles.is_caustics_caster/receiver, light.data.cycles.is_caustics_light).
- Web (x,y,z) → Blender (x,-z,y). Floor is an 80-unit plane: its far edge shows as a horizon (web fades instead).
- Times on the M1 Max at 1920×1080: 256 samples 131 s/frame, 64 samples 44 s/frame. A 4 s scene (120 frames) ≈ 1.5 h at 64.
- Published side by side: https://bloop.monster/<shelf>/crystal-cycles.html (chk/webgl-a035.png vs blender/test-s256.png, s64).

## ribbon arrow still (Nov-1, Greg: "a sample with a red arrow ribbon as it would look at the end of that animation")
- pyramid.py (v1 kept as pyramid-v1.py) 4th arg ribbon=1: a mesh ribbon on the web arrow's path (RR 2.75, RY 1.15, GAP 0.42, DIR -1),
  half-height 0.25, thickness 0.06; arrowhead 0.62 long, flaring to half-height 0.5, tip at th1. Red Principled (0.75,0.02,0.02),
  rough 0.3, a little red emission (0.6). Balls at the arrows scene's end angle 0.35 + (-1.71)(5) = -8.2.
- blender/ribbon1.png: 256 samples, 80.6 s (kernels cached). The balls refract/reflect the ribbon (upside-down in the top ball),
  real shadow ring on the floor. Framing matches the web (top ball ≈430 px across in both).
- Published https://bloop.monster/<shelf>/crystal-ribbon.html

## animated ribbon arrow in Cycles (Nov-1, Greg: "animate the arrow; the scene about 0.7× as long; a way to see render progress")
- pyramid.py refactored (v2 kept as pyramid-v2.py): BALL_OBS + set_balls(angle); set_arrow(thE) rebuilds the ribbon from TH0 to thE
  with the head at the tip (head scales down while the arrow is shorter than 1.6 heads); `LIB = True` + exec → builds, no render.
- blender/anim.py OUTDIR SECS SAMPLES DRAW [only=…]: 30 fps, balls 0.35 + (−1.71)t, arrow thE = TH0 + (TH1−TH0)·smooth(t/DRAW),
  hidden while < 0.02 rad; seed = frame; skips existing frames (resumable); OUTDIR/progress.json after each frame.
- Scene: 3.5 s (0.7 × 5) = 105 frames, DRAW 0.77 s (0.7 × 1.1). Test at 128 samples: 45 s (no arrow) … 113 s (full arrow)/frame.
  Full run at 64 samples: mac crystal-render/blender/arrows/ (nohup caffeinate, log arrows.log), started 05:14.
- Progress: https://bloop.monster/<shelf>/crystal-progress.html polls crystal-progress.json/.png every 15 s;
  tools/progress-watch.sh MACDIR uploads them every 60 s (direct S3 via personal-reports-push.sh) until state "done".
- cut.sh now takes ARROWS=file (default a-arrows.mp4) for scene 4.
- Render done 06:34 (105 frames, 64 samples, avg 44 s/frame ≈ 80 min). a-arrows-cy.mp4 (crf 16) → ARROWS=a-arrows-cy.mp4
  ./cutj.sh crystal-cut5.mp4 cuts-used.json → 24.3 s (scene 4 now 3.5 s, Cycles). Copies in render/. Sheet chk/sheet5.png:
  the front ball sometimes shows a big magnified white/red blob (the lamp / ribbon seen through it) for a few frames.
  Scene 2 (spin) is still WebGL → looks different from scene 4.

## spin scene in Cycles too (Nov-1, Greg: "render the first scene with the ray-balls in the same fancy way")
- anim.py: DRAW 0 = no arrow. Running: anim.py -- blender/spin 4 64 0 (120 frames, 64 samples, log spin.log), progress on the same
  crystal-progress page (watcher on blender/spin). When done: a-spin-cy.mp4 → recut with scene 2 = a-spin-cy.mp4.
- Watcher bug: it started before Blender's first progress.json, fell back to the stale local copy from the arrows run ("done") and
  quit. Fixed: progress-watch.sh deletes the local json first and only uses a fresh ssh copy. Restarted on blender/spin.
- Spin render done 01:13 Nov-2 (120 frames, 64 samples, avg 44 s/frame ≈ 90 min). a-spin-cy.mp4; cut.sh also takes SPINF=file.
  SPINF=a-spin-cy.mp4 ARROWS=a-arrows-cy.mp4 ./cutj.sh crystal-cut6.mp4 cuts-used.json → 24.3 s; both glass scenes now Cycles.
  Copies in render/. Sheet chk/sheet6.png (1 fps): order and look OK; same magnified white lamp-blob moments in the front ball.

## heavenly choir sound (Nov-2, Greg: no narration; an "ahhhh", symphonic, a held chord with ethereal grandiosity; picked option 2)
- Option 2 = General MIDI "Choir Aahs" via FluidSynth. Installed on the Mac: brew fluid-synth 2.6.2. Sound font MuseScore_General.sf2
  (MIT; FluidR3 lineage; license file next to it) in mac:~/airport-sessions/crystal-src/sf/. Credit line suggested for the description.
- audio/choir.py (hand-written MIDI writer; 60 bpm, 480 tps; CC11 swells, CC91 reverb) → A plain aah (C major, wide), B "heavens open"
  (aahs+oohs+strings+choir pad, soprano G5→C6 enters at 1 s), C "a-AAAH" (F major breath → C major bloom).
  audio/render.sh (Mac crystal-render/audio/): fluidsynth big reverb + chorus → plain gain to −3 dB peak (loudnorm's dynamic mode
  flattened the swells) → trim A 8.5 / B 10 / C 9 s with 2 s fade-out → wav + m4a. macOS bash 3: no `declare -A`.
- I can't listen: checked only waveforms/spectra (chk/w-*.png). Published https://bloop.monster/<shelf>/crystal-choir.html

## choir cues per scene (Nov-2, Greg: a series of chords — (a) Labyrinth, (b) first CGI, (c) first real-life silent, (d) second CGI
##   like (b) but the first note quicker and the second hitting harder, (e) final real-life; the 2nd chord has a leading note like C)
- audio/suite.py (imports choir.py helpers; choir.py main now under __main__): a = A minor add9 slow swell; b = C/E breath 1.0 s →
  F major bloom (bass E→F leading note); d = same, breath 0.77 s (blooms as the arrow lands), fast attack, louder, low F2 in strings,
  timpani F2+C3; e = C major "heavens open" + soprano G5→C6. Notes held past the scene end.
- audio/suite.sh CUT OUT (Mac crystal-render/audio/): lengths from ../cuts-used.json (CGI 4 / 3.5 fixed) → fluidsynth −g 0.22 →
  ONE shared gain (loudest peak → −3 dB) → trim each to its scene (0.08 s fade = cut with the picture; e 1.5 s fade) → concat with
  silence for c → soundtrack.wav (24.3 s = video) → muxed onto crystal-cut6 → crystal-cut7.mp4 (copy in render/).
- Bug found: synth.reverb.width=100 made the reverb clip (raw peaks 0.0 dB); width 1.0 → raw peaks −8…−12 dB. Also fixed in
  render.sh, but the A/B/C test page was rendered with the clipping setting.
- Published https://bloop.monster/<shelf>/crystal-cues.html (full soundtrack + the 4 cues).

## cue e: earlier, stronger soprano (Nov-2, Greg: "the last one could use an earlier and stronger soprano; not punchy enough up high")
- suite.py (v1 kept as suite-v1.py): soprano (aahs, vol 127) in at 0.12 s, G5 → C6 at 0.5 s, vel 122; doubled by oohs on C6 and
  strings on C6 + E6 (E6 = 88). Shared gain now from a, b, d only (+7.1 dB, was +5.4 → a/b/d 1.7 dB louder than cut 7);
  e gets the same gain + alimiter (limit 0.7, ~6 dB of peak limiting). High band (950–1450 Hz) RMS: first 1.5 s −27.3 → −20.5 dB,
  whole cue −23.9 → −18.3; e RMS −13.6 vs d −17.5 (the finale is the loudest).
- BUG (mine): an inline comment swallowed the peak command → empty gain → every cue's ffmpeg failed silently and the stale cues
  were reused (first cut8 had the old audio). suite.sh now has set -e -o pipefail and checks $pk; rebuilt → crystal-cut8.mp4.
- crystal-cues.html republished: soundtrack + new e + old e (cue-e-v1) + a, b, d.

## half-hearted choir (Nov-2, Greg: "soften them; comedy: only half-committing to the 'ahhh', self-conscious about how underwhelming
##   this is; and some grit/texture that fits the non-committing")
- suite.py half mode (v2 kept as suite-v2.py): velocities/swells ×0.78, fewer choir notes, no strings/pad layers, timpani a soft
  F2 "doof" (vel 75), soprano solo (vel 96, still in at 0.12 s), and sag(): pitch bend −30 cents (x² curve) over the last 0.6 s
  of each cue (e: last 1.6 s, during the fade).
- suite.sh CUT OUT half (v2 kept as suite-v2.sh): files prefixed h; FX = highpass 170, lowpass 5200, vibrato 0.7 Hz d 0.08, acrusher
  11 bits mix 0.3 LIN (+5 ms fade-in); pink hiss a=0.004 + sparse crackle (aevalsrc random clicks, lowpass 3k) per cue;
  target peak −12 dB (full −3); e −3.5 dB extra, no limiter. Full mode re-checked: unchanged (−2.9 dB peak).
- Bug: acrusher mode=log made a −1.41 spike in the first ms of e (near-silent input) → lin + fade-in.
- Result: peaks a −13.4, b −15.6, d −12.8, e −12.6; RMS −28.7/−30.4/−27.2/−26.5; mix mean −28.1 dB (full −16.7).
  crystal-cut9.mp4 (copy render/). Published https://bloop.monster/<shelf>/crystal-cues-half.html

## edit studio: trim each section (Nov-2, Greg: "a studio to trim each section (only smaller), a playback of the video with those
##   trims, and a way to give you the results")
- edit.html (local on the Mac, crystal-render/edit.html; NOT published: Labyrinth) + make-edit.sh → edit/: v-a..v-e.mp4 (960×540,
  30 fps, -g 3, no audio: a = first 5.9 s of crystal-cut9, b/d = the Cycles scenes, c/e = Greg's clips at cuts-used times) and
  au-a/b/d/e.wav (= the half cues). Sections n frames: a 177, b 120, c 70, d 105, e 258.
- UI: timeline blocks ∝ length, gold IN/OUT edges (drag/click; only inward; ≥ 6 frames kept), ±1 frame buttons, keys (space play all,
  1–5 section, ←→ IN, shift+←→ OUT, S section). Play all = one clock (performance.now) drives sections, corrects video drift > 0.08 s;
  audio = <audio> per cue (file:// blocks WebAudio decoding): 'refit' cues start at the section start, d 'lock'ed to the picture,
  volume fades at section ends. Trims in localStorage crystal-trims-v1; Save → ~/Downloads/crystal-trims.json (frames + seconds).
  Headless test (1000×575): drag/keys/play all a→e with trims/save all OK; audio within ~0.06 s of the picture.
- render/recut-trims.sh OUT [json] (+ trims.py; bash 3.2 can't take a heredoc in $( )): trims → source times (+0.2 s) and exact
  frame counts NA..NE; cut.sh now takes SP0/SP1, AR0/AR1 (-ss/-to on the Cycles scenes) and NA..NE (trim=end_frame per section);
  music re-fit: CUTS=cuts-trimmed.json, CGI1/CGI2 = new lengths, DBREATH = 0.77 − d's IN (min 0.08) so the bloom stays on the arrow;
  suite.sh half. Tests: no trims → 730 frames, test trims → 707 frames; soundtrack matches to the frame.

## cut 10 (Nov-2) — Greg's trims from edit.html (~/Downloads/crystal-trims.json, copy render/trims-used.json)
- a 81–177 (3.2 s: starts 2.7 s into the old Labyrinth clip, on the pyramid close-up), b 0–78 (2.6 s), c 0–70 (2.33 s, untrimmed),
  d 0–57 (1.9 s: ends ~1.1 s after the arrow lands), e 0–183 (6.1 s). ./recut-trims.sh crystal-cut10.mp4 → 484 frames = 16.13 s
  (= 96+78+70+57+183), music re-fit (d breath 0.77 unchanged, d IN untouched), peak −11.7 dB. Copy in render/.
- Bug: recut-trims.sh passed a relative OUT to suite.sh (which cds to audio/) → file landed in audio/; now made absolute.

## PUBLISHED (Nov-2, Greg: "ship it!")
- Final = crystal-cut10.mp4 (16.13 s, 484 frames, half-hearted choir; md5 b1280e9aa7f023b4d7410bfc637afc5e on Mac = here = S3).
- S3: https://bloop.monster/<shelf>/crystal-pyramid-v01.mp4 (video/mp4, no-cache; served md5 verified).
- YouTube: https://youtu.be/C3tgVoma3xs public, "the labyrinth crystal-ball pyramid, with tennis balls, v0.1", desc desc-crystal-v01.txt
  (copy on the Mac in ~/youtube-upload/). Token was still valid (renewed Oct 29; next expiry ~Nov 5).
  API right after upload: public, uploaded, processing. Watch for a Content ID claim on the Labyrinth clip (Greg: "we'll see").

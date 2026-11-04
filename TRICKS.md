# Tricks: every technique, and the file that does it

Paths are relative to `videos/`. Each folder's `README.md` has the details and the gotchas.

## Animation
- **Scrubbable 1920×1080 "video" page with an engine block** the booth can copy: `09-epr-matrix-math/anim.html` (newest canvas
  engine; `SCRIPT`, `S[i]/E[i]`, `ev/at/after` scheduling, `drawFrame(t)`, `CHK` self-checks). Older: `02-belt-trick/anim.html`.
- **Self-checking numbers**: every page builds a `CHK` object and `console.error`s on failure; `tools/check.js` runs it headless.
- **Swarm of little examples** under an intro: `06-quantum-turing`, `08-double-slit` (`src-common.js`).
- **Falk's layout** for matrix × matrix by hand (matrix above, result below; a staircase for a chain of gates):
  `05-matrix-multiply`, `09-epr-matrix-math` (draft 4+).
- **Options pages** (several mockups, drawn with the real engine, for Greg to pick): `09-epr-matrix-math/build-alts.js`, `build-alts2.js`.
- **WebGL in the 2-D pipeline** (drawn offscreen, copied into the canvas the booth records): `02-belt-trick/anim.html`; mesh
  decimation `02-belt-trick/tools/decimate.js`.
- **Real-time ray tracing in one fragment shader** (glass spheres, refraction in/out, total internal reflection, N balls deep,
  fake caustics; fps HUD; side-by-side depth compare): `10-crystal-pyramid/pyramid.html`, `compare.html`, `cut-anim.html`
  (+ a 2-D overlay projected with the shader's own camera, and a `CHK.sameWay` direction check).
- **Path tracing in Blender (Cycles) from a script**, matching the web camera exactly (web y-up → Blender z-up, `angle_y` from the
  shader focal length): `10-crystal-pyramid/blender/pyramid.py` (stills; glass caustics via MNEE) and `blender/anim.py`
  (animation, resumable, writes `progress.json`). A **live progress page** for long renders: `pub`-style page polling a JSON +
  latest frame, fed by `tools/progress-watch.sh` (in that folder).
- **Game / screen recordings cut against an animation**: `11-color-golf` (`cut-anim.html`, `tools/cut-frames.js`).
- **Game theory solved in code, then animated**: `03-bluffing/solve.py`, `explore.py`.

## Voice and face
- **The booth** (records voice + webcam while showing each line with start/middle/end thumbnails; takes kept in IndexedDB and
  uploaded): `*/build-booth.js` + `studio2.orig.html`; layout test `tools/booth-lines-test.js`; server `../tools/voice-server`.
- **Render synced to the voice** (silencedetect finds each line's real start/end, the animation is re-timed to it, the webcam
  circle is composited bottom-right): `*/render.js`, run on the Mac with `mac-render/run.sh` (`--dry` first).
- **Splicing takes / fake takes for testing**: `04-epr-weird/tools/splice.js`, `fake-take.js`.

## Footage, editing, sound
- **Sourcing a film clip** (yt-dlp + deno, contact sheets with timestamps to find the moment, letterbox crop by row/column means):
  `10-crystal-pyramid/README.md` and `SOURCES.md`.
- **ffmpeg cut list** (framed clip with captions, generated scenes, phone footage; frame-exact per section with `trim=end_frame`):
  `10-crystal-pyramid/render/cut.sh` (on the Mac: `mac-render/cut.sh`).
- **In/out picker** for source clips (scrub, ±1 frame, set IN/OUT, saves a JSON to Downloads): `10-crystal-pyramid/trim.html`.
- **Section-trim studio** (timeline, shrink-only handles, "play all" preview with trims and music, save → recut):
  `10-crystal-pyramid/edit.html` + `mac-render/make-edit.sh` + `render/recut-trims.sh` (+ `trims.py`).
- **Generated music**: a tiny MIDI writer (`10-crystal-pyramid/audio/choir.py`), per-scene cues in a chord progression with a
  leading-note "breath" and a hit timed to a visual event (`audio/suite.py`), rendered with FluidSynth + a General MIDI sound font,
  one shared gain so cues keep their balance, re-fit to trimmed lengths (`audio/suite.sh`). A **"half-hearted" mode** for comedy:
  thinner, quieter, a pitch sag at each cue's end, cassette texture (band-limit, wow, light bit-crush, hiss + crackle).
  Gotchas logged: FluidSynth `reverb.width=100` clips; ffmpeg `loudnorm` (dynamic) flattens swells; `acrusher mode=log` spikes.

## Publishing
- **S3 + YouTube** (upload, verify via API, token renewal): `../PROCESS.md` step 7, `../tools/youtube-upload/`.
- **Descriptions**: `*/descriptions/` (house style in `../PROCESS.md`).

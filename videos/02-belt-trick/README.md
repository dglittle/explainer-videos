# spinor-v2 — voiced animation video pipeline (Oct-19, 2026)

Made "a rubber chessboard magic trick (the belt trick), v0.2", https://youtu.be/kCnTGcyHGoc
(old one retitled "Spinor Belt Trick — 720° on a Chessboard, v0.1", https://youtu.be/Xs5VtU3XFWs, descriptions link each other).
Sibling project with the same pipeline: ../yellow-is-red-green/ ("seen reddish-green?, v0.2").

## The pipeline (screenplay → animation → voice booth → render → publish)
1. **Screenplay brainstorm page**: spinor-screenplays.html → https://bloop.monster/<shelf>/spinor-screenplays.html
2. **anim.html**: scrubbable 1920×1080 "video". All drawing is between `// ==== ENGINE START` / `ENGINE END`
   (here: WebGL drawn offscreen into the 2-D canvas `cv`, so the booth can copy it). `drawFrame(t)` draws anim time t.
   Published as spinor-v2-anim.html (+ spinor-knight-mesh.js, the knight decimated 892k→77k tris by tools/decimate.js).
3. **build-booth.js** → booth.html (published as spinor-v2-voice.html): Greg's recording booth, built from studio2.orig.html,
   with start/middle/end frames per line drawn by the same engine. Takes upload to ~/greg-voice (port 61920) as `spinor2-*.{webm,json}`.
   Line frames are matched by a key phrase per line (VKEYS).
4. **render.js** `<take.webm> <take.json> [--dry] [--max N] [--out f.mp4]`: silencedetect finds each line's real start/end,
   anchors map output time → anim time, inserted silences make room for wordless action (here: after "twice", and the 10 s trick).
   Always run `--dry` first and read the anchors.
   **Render on Greg's Mac (GPU, ~1 min)**, not this box (no GPU, ~6 s/frame ≈ 3 h): kit in mac:~/airport-sessions/spinor-v2-render/, run with
   `CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" FF=/opt/homebrew/bin/ffmpeg PUPPETEER=$HOME/core/node_modules/puppeteer-core ~/.nvm/versions/node/v22.13.1/bin/node render.js …`
5. **Publish**: MP4 to S3 bloop.monster/<shelf>/ (content-type video/mp4); pages via kbt into kb docs/<shelf>/ + personal-reports-push.sh.
   YouTube on the Mac: ~/pima/work/youtube-upload (upload.js; update.js --id --title --descfile for retitles). Only when Greg says so.

## Gotchas
- The `ssh mac` reverse tunnel (port 2222) drops when the Mac sleeps; wait for it, don't fight it.
- JPEG-piped frames come out yuvj420p (full range); render.js forces `scale=out_range=tv,format=yuv420p` + bt709 tags.
- Seam/cut effects in a deforming mesh: triangles straddling the cut stretch across it; discard them (vIn varying) while cut.
- Headless checks of WebGL pages here need `--use-angle=swiftshader --enable-unsafe-swiftshader` and a long protocolTimeout.
- Naming: titles end ", v0.x"; descriptions say who made what (real voice, AI animation) and link the previous version.
  Brainstorm with Astra = `~/ergane/vendor/codex-new/node_modules/.bin/codex exec -m gpt-6-astra -s read-only --skip-git-repo-check …` (naming/).

# How these videos get made

Short (15 s – 4 min) voiced explainer videos. An animation page draws every frame from code (2-D canvas or WebGL, 1920×1080),
Greg records his voice (+ optional webcam) in a browser "booth" while reading the script, and a renderer syncs the animation to
his voice and puts his face in a circle, bottom-right. Newer videos also mix in real footage, film clips (fair use, short, muted),
path-traced 3-D (Blender) and generated music. Then S3 + YouTube.

Machines in the logs: "the box" = a small Linux server (4 GB, no GPU: checks, pages, publishing); "the Mac" = Greg's M1 Max laptop
(rendering, Blender, ffmpeg, the YouTube upload tool), reached as `ssh mac`. Draft pages were published to a private web folder
(`https://bloop.monster/<shelf>/…`) so Greg could look on his phone.

## The steps
1. **Topic + screenplay.** Greg names the topic. Use his words for the script (light cleanup). If he gives no screenplay, draft lines
   in his voice and SAY they're drafts; offer optional lines as clearly marked suggestions. Check his math/physics gently and say
   what's right first. For a new kind of video, de-risk the hard parts first with small prototypes (e.g. 10-crystal-pyramid).
2. **Animation page** (`anim.html`). Between `// ==== ENGINE START` and `// ==== ENGINE END` is the engine (the booth copies it
   verbatim). It draws to `g` (not `ctx`; don't shadow `g`, and beware helper-name clashes: `after`, `at`, `ev`, `S`, `E`, `T`, `L`;
   also never name a global `top`, it clashes with `window.top`).
   `SCRIPT = [[key phrase, spoken text, wordless hold seconds], …]`. Each key must be lowercase, unique, appear in its own line's
   text and in no other line (`tools/check.js` reports keyProblems). Line times `S[i]`/`E[i]` come from word counts (2.5 words/s
   guess); `ev(i,f,d)`, `at(i,f)`, `after(i,s,d)` schedule visuals inside lines. Keep the bottom-right corner (x 1650–1920,
   y 815–1080) empty in every scene: the webcam circle goes there. Every number on screen is computed by the page and re-checked
   (a `CHK` object; `console.error` on failure).
3. **Check it.** `node tools/check.js` (CHK, key problems, page errors, ms/frame); `node tools/shots.js end|mid|t1 t2…` → `chk/*.png`;
   `python3 tools/tile.py OUT.png COLS files…` → a contact sheet. Look at frames per line, mid-line and mid-step. A pixel scan of the
   webcam corner is a good last check. WebGL pages need headless Chrome with `--use-angle=swiftshader --enable-unsafe-swiftshader`
   on a GPU-less box (~2 s/frame); render on the Mac's GPU instead.
4. **Iterate with Greg** on the animation alone first; then the booth; then a take; then "publish". Stop after each deliverable and
   give him the link. Keep replies short and skimmable (he's often on a phone). When unsure how to lay something out, make an
   options page with several mockups (09-epr-matrix-math `build-alts.js`) and let him pick.
5. **Booth.** `node build-booth.js > booth.html`. Give each video a new take prefix (e.g. `epq1-`) and change EVERY old prefix string
   (localStorage keys, IndexedDB name, take id, server list filter), plus the stage directions (DIR), title, the animation link and
   the "Reset to the … script" label. `node tools/booth-lines-test.js booth.html W H` must report 0 bad lines (1000×575 is Greg's
   laptop window). Takes upload to `tools/voice-server` → `<prefix>-YYYYMMDD-HHMMSS.{webm,json}` (the json has the script he read
   + cue times). Diff his lines against SCRIPT before rendering: he sometimes edits wording.
6. **Render on the Mac.** Copy `run.sh` from the newest `mac-render/`, then `./run.sh TAKE.webm TAKE.json --dry --out X.mp4` (must
   say "matched N of N"; shows pace + face windows), then without `--dry`. Grab frames with ffmpeg and tile them; check volume
   (`volumedetect`).
7. **Publish only when Greg says "publish" / "ship it".** (1) S3: `aws s3api put-object … --content-type video/mp4 --cache-control
   no-cache`, verify md5 against the Mac file. (2) YouTube from the Mac with `tools/youtube-upload` (`node upload.js --file … --title
   "…, v0.1" --desc "$(cat desc.txt)" --privacy public`), then verify via the API. The OAuth app is in testing mode: the token
   expires about weekly ("invalid_grant") → `node auth.js` (Greg clicks a Google consent tab). YouTube can't replace a file: a fix
   is a new upload + the old one set unlisted (`update.js`), only if Greg wants. (3) Log the video id + S3 URL in the folder README.

## How Greg likes to work (learned the hard way)
- Beautiful over long. A busy "swarm" of little examples under the intro is liked; a CLEAN screen for the real explanation; gloss
  over what the audience already knows; remove "noise" (side panels he
  didn't ask for); abrupt endings (no lingering end cards); self-contained videos (no "last time" unless he wants a series).
- Row vectors, left-to-right flow; Falk's layout (matrix above, result below) reads well.
- He reads at ~0.75–0.97 of the 2.5 words/s guess; short spoken lines followed by on-screen text need long holds (3–4 s).
- Comedy: timing matters most; he prefers to set cut points himself with a studio page (10-crystal-pyramid `trim.html`, `edit.html`).
- Descriptions: lowercase, start with "the human voice and face you see are real, … made by an AI (Claude) …" (adapt: "the hands
  and tennis balls you see are real …"), explain the idea and the checked numbers, credit third-party material, end with
  "v0.1. still an attempt, to be improved upon." Titles end with ", v0.1". Since Nov 2026 each description also links this repo.
- Outward-facing things (publishing, installing apps on his Mac) only when he asks; say what you installed.

## Keep a log
Each video folder has a `README.md` written as you go: what Greg asked (his words), what you did, the numbers, bugs and how they were
found. It's what makes the next video fast — and it's how this repo teaches future sessions.

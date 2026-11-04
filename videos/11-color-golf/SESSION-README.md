# color-golf session (Oct-28, 2026)

## Where things are
- 2014 web version: github.com/dglittle/color-golf (public, gh-pages, jQuery, 10 rounds). Clone: ref/old-web.
- 2025 iPhone app (SwiftUI): mac:~/Dropbox/sourcecode/colorgolf/ (Xcode project, no git). The whole game is in colorgolfApp.swift (copy: ref/).
  mac:~/Dropbox/sourcecode/color_golf/ is an untouched Expo starter (Dec 2024): ignore it.
- GitHub access from box: `. ~/pima/secrets/github.env` (GH_USER, GH_TOKEN), push with an env-only credential helper.

## (a) the new version: github.com/dglittle/color-golf, branch gh-pages (public, MIT), live at https://dglittle.github.io/color-golf/
- Oct-29: moved here from the temporary dglittle/colorgolf repo (v0.7, one commit on top of the 2014 history). colorgolf/ = a clone of
  color-golf (gh-pages); the old clone of the temporary repo is colorgolf-dup-repo/. The temporary repo's Pages is OFF; deleting the repo
  needs the delete_repo scope (box token and mac gh token both lack it) → Greg deletes it, or runs `gh auth refresh -h github.com -s delete_repo` on the mac.
- colorgolf/ = the working copy. index.html: one file, no dependencies. It's a port of the Swift game:
  7 shades per channel, 9 colors, 6 tries, "shades away" = sum of the index distances, the ball starts black (white if the goal is black),
  holes in one → 7×7 stars + a big star every 50th, best score, localStorage (key `colorgolf`).
- Changes from the Swift version: "make guess" → "swing", you can drag along a row, no fake 3 s launch delay, phone-shaped on desktop.
- Test: tools/test-game.js (puppeteer: plays a game, screenshots → shots/).

## (b) the video: video/
- Same pipeline as ../qc-video and ../matmul-video (booth → take in ~/greg-voice/takes → Mac render).
- anim.html: 11 lines, about 92 s. The SCRIPT words are MY DRAFT for Greg to rewrite. Checks are in the page's note line.
- Booth: build-booth.js → booth.html (take prefix cg1-, IndexedDB cg-voice-1, link cg-anim.html).
- tools/shots.js → chk/sheet.png (frames from the middle and end of each line). The fake take + `render.js --dry` matched 11/11 lines.
- Nov-1 draft 2 (Greg: "try your hand at a video of this game"; pipeline per ../next-video/brief.txt): the phone shows the game as it is
  now (hole in the goal; the 3 shades merge at the rows' middle; a miss rolls to d/18 of the way to the corner; a match rises and plays a
  real sink: 'solid/ripple' for the worked example, 'claude4/petals' for the hole in one). All 38 sets are inlined inside the ENGINE
  region (so booth + render get them). New line 'thirty-eight' = all 38 sinks at once in an 8-wide grid (corner kept free).
  URL now dglittle.github.io/color-golf. 12 lines, ~106 s. Draft 1 kept as anim-draft1.html. tools/at.js OUT "expr"… = frames at times.
  Published (anim only): https://bloop.monster/<shelf>/cg-anim.html (kbt qq7dg-77944). Booth rebuilt (cg1-), not published.
  No YouTube.

## (c) sink animations: review site (Oct-29)
- review/: server.js (https://test.bloop.monster:61930/#k=<key>, key in ~/.color-golf-review-key; crontab @reboot '# color-golf-review'),
  index.html (every idea plays while on screen, approve box + note, saved to review/approvals.json), sets/*.js (format: review/FORMAT.md).
- Sets: 2-solid (6), 3-solid2 (6), 4-astra1 (6) = copied verbatim from the sink-demo*.html files; 5-claude4 (10, new);
  6-astra2 (Astra round 2, codex exec in astra/). 1-shaded (4, shaded ball) moved to review/retired/ (Greg: solid only). Check: review/test-review.js [set] (errors, flat end state for every idea, frame grid).
- INCIDENT Oct-29 03:18 (Pacific): while restarting the review server I ran `pkill -f "node server.js"`, which also killed every other server
  started as `node server.js`: airport tower 61500, pima2-web 61888, ergane-web 61889, ariadne-web 61890, olympus 60377, greg-1 61910,
  greg-voice 61920 (+ prism 62000, which came back by itself). All restarted within ~20 s with their crontab @reboot commands.
  Port 61895 was also listening before and is NOT back: unknown owner (no crontab line or code names it). Lesson: kill by pid, never by pattern.
- Oct-29: Greg: "use them all", one rule: every idea starts the same (full-size ball, full-size rimless hole); anything else grows in during
  the flight. Fixed 15 (ball shrinks on the way up; Astra's light hairline fades in). Check: review/test-start.js [t] (t = 0: all identical).
- In the game (colorgolf/index.html): a match → the swatches merge at y = goal bottom + 75/390·width (where every set's flight starts), then
  play_sink() draws one random idea offscreen (390×420 scaled to the width) and copies its goal part onto the goal (centered on the hole)
  and its lower part below. tools/build-sinks.js inlines review/sets/*.js between the SINKS markers: RUN IT after changing a set.
  Tests: tools/test-sinks-game.js (all 38 in the game: errors, flat end), test-game.js, test-import.js.
- Nov-2 "documentary cut" (Greg recorded himself from the side in QuickTime, unsaved: mac ~/Library/Containers/com.apple.QuickTimePlayerX/
  Data/Library/Autosave Information/…/Movie Recording.mov, copied to mac:~/airport-sessions/cg-render/greg-raw.mov, 47 s 1920×1080 ProRes).
  Clips 27.1–31.9 ("I invented color golf because of color…") and 34.4–44.0 ("color is all different amounts of red green and blue…"),
  each cropped 960×1080 at x=314 (right edge at 66.369% of 1920), on the RIGHT; left = video/cut-anim.html (drawCut(t), timed to the
  speech gaps: title → "color" lights up → "golf" shrinks + flag tips; RGB bars fill → "?"; a real 'solid/ripple' sink + "hole in one!";
  a miss "11 shades away"). Frames: tools/cut-frames.js → left.mp4; composed on the mac (ffmpeg crop/concat/hstack, +11 dB, 30 ms fades):
  mac:~/airport-sessions/cg-render/color-golf-doc-v01.mp4 (copy: video/color-golf-doc-v01.mp4), 14.5 s, mean −26.9 dB, max −5.7 dB. Not uploaded.
- Nov-2 v02 (Greg: "show the colors joining into a ball and firing up; then fire up wrongly, and wrongly again"): scenes C/D rebuilt as
  "shots" (rows under the goal → the 3 chosen shades merge 0.6 s → a match rises into 'solid/ripple'; a miss flies to d/18 of the way).
  "it's hard though" = 2 misses on green [43,172,86]: 11 shades away, then 13 ("as far off as you can get"; CHK MAXD2 = 13).
  Clip 2 now 34.4–44.2 (Greg turns to the camera at ~44.25) + its last frame held 1.2 s → 15.8 s. v01 left half = cut-anim-v1.html.
  Output: mac cg-render/color-golf-doc-v02.mp4 (copy video/color-golf-doc-v02.mp4). Not uploaded.
- Nov-2 v03 (Greg: "a try where both attempts fail"): the "win" shot is a near miss (guess [215,86,172], 1 shade away, the ball almost
  covers the hole), then "it's hard though" = the farthest possible from that pink ([0,255,0], 12 = MAXD). Same goal, so the ball jumps
  from almost-in to the far corner. Hold 0.8 s → 15.4 s. v02 left half = cut-anim-v2.html. Output: mac cg-render/color-golf-doc-v03.mp4
  (copy video/color-golf-doc-v03.mp4). Not uploaded.
- PUBLISHED Nov-2 (Greg: "perfection! please publish it"): v03 → https://youtu.be/iujHMK7D6OY (public, "color golf, v0.1",
  desc video/desc-doc-v01.txt = mac youtube-upload/desc-colorgolf-doc-v01.txt, links the game + the repo) and
  S3 https://bloop.monster/<shelf>/color-golf-doc-v01.mp4 (md5 7acbee19… = the Mac file). The repo README now shows video.jpg
  (a still at 3.6 s + a play button) linking to the YouTube video (commit 24e268a on gh-pages).

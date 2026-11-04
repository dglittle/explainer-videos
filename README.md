# explainer-videos

Everything behind the short voiced explainer videos on Greg Little's YouTube channel ([@glittle312](https://www.youtube.com/@glittle312)),
made by Greg with an AI (Claude): the animation pages, the recording booth, the render and edit scripts, the music generators,
the session logs, the YouTube descriptions and the scripts Greg read. MIT licensed.

**If you're an AI asked to "make a video along the lines of <one of these videos>":** read [PROCESS.md](PROCESS.md) (how a video
gets made, start to finish, and how Greg likes to work), then [TRICKS.md](TRICKS.md) (every technique, with the file that does it),
then the matching folder's `README.md` below (the full log of that video: every request, decision, bug and fix, in order).
Copy the newest folder that's closest to what you need; don't edit another video's files in place.

## The videos (newest first)

| # | video | folder | how it's made |
|---|---|---|---|
| 11 | [color golf, v0.1](https://youtu.be/iujHMK7D6OY) | [videos/11-color-golf](videos/11-color-golf) | screen-recorded web game (its own repo: [dglittle/color-golf](https://github.com/dglittle/color-golf)) + canvas animation, cut together |
| 10 | [the labyrinth crystal-ball pyramid, with tennis balls, v0.1](https://youtu.be/C3tgVoma3xs) | [videos/10-crystal-pyramid](videos/10-crystal-pyramid) | film clip + Blender (Cycles) path-traced glass balls + phone footage + generated choir; trim studio |
| 9 | [the EPR paradox, as matrix math, v0.1](https://youtu.be/9glmM8-isOQ) | [videos/09-epr-matrix-math](videos/09-epr-matrix-math) | canvas animation + voice booth + Mac render (the classic pipeline) |
| 8 | [the double-slit experiment as a quantum computation, v0.1](https://youtu.be/qdw7IvXof4k) | [videos/08-double-slit](videos/08-double-slit) | classic pipeline |
| 7 | [from circuit diagrams to vector × matrix, v0.1](https://youtu.be/SrnDeKmCIws) | [videos/07-circuit-diagrams](videos/07-circuit-diagrams) | classic pipeline |
| 6 | [the Turing machine of quantum computation, v0.1](https://youtu.be/D7K6TvOLo7g) | [videos/06-quantum-turing](videos/06-quantum-turing) | classic pipeline (booth fixes, publish details) |
| 5 | [a nicer way to multiply matrices by hand, v0.1](https://youtu.be/M6-sdPYdZyY) | [videos/05-matrix-multiply](videos/05-matrix-multiply) | classic pipeline (Falk's layout) |
| 4 | [why is the EPR paradox weird?, v0.1](https://youtu.be/toD7BWe4QeU) | [videos/04-epr-weird](videos/04-epr-weird) | classic pipeline (+ webcam circle, Mac render notes) |
| 3 | [is bluffing actually a good idea, mathematically?, v0.1](https://youtu.be/iEu0NNmp28E) | [videos/03-bluffing](videos/03-bluffing) | classic pipeline + a game-theory solver |
| 2 | [a rubber chessboard magic trick (the belt trick), v0.2](https://youtu.be/kCnTGcyHGoc) | [videos/02-belt-trick](videos/02-belt-trick) | WebGL animation (the original pipeline notes) |
| 1 | [yellow is red-green, v0.1](https://youtu.be/9OENcy-O1X0) · [seen reddish-green?, v0.2](https://youtu.be/6TJWpPFuMHk) | [videos/01-yellow-is-red-green](videos/01-yellow-is-red-green) | the oldest pipeline |

`videos/index.json` has the same list in machine-readable form.

## What's in each folder
- `README.md`: the session log (start here for that video).
- the source: `anim.html` (the animation; every number on screen is computed and checked), `build-booth.js` + `studio2.orig.html`
  (the voice booth), `render.js` (syncs the animation to Greg's voice), `tools/`, plus anything special to that video.
- `mac-render/`: the render kit used on the Mac (`run.sh`, `render.js`, and the take's cue file).
- `takes/*.json`: what Greg actually read (the script text + the time each line started). The recordings themselves are not here.
- `descriptions/`: the YouTube description(s) as uploaded.

## What's deliberately not here
- Anything that can be regenerated (renders, check frames, `node_modules`), and the voice/webcam recordings and phone footage.
- Third-party material: film clips, downloaded pages, sound fonts, 3-D models of unknown origin. Each folder's `SOURCES.md` (where
  needed) says where to get them and how.
- Secrets. Paths in the logs refer to machines that aren't public; a few placeholders were put in: `<shelf>` (a private web folder
  where draft pages were published) and `<VOICE_KEY>` (the voice booth's upload key). Bring your own.

## Tools shared by all videos
- [tools/voice-server/server.js](tools/voice-server/server.js): receives takes from the booth (needs a key file + TLS certs).
- [tools/youtube-upload/](tools/youtube-upload): upload / update / list videos with the YouTube Data API (OAuth; needs your own client secret).
- [tools/collect.py](tools/collect.py): rebuilds `videos/` from the working folders (how this repo was made; run it again after a new video).

## License
MIT (see [LICENSE](LICENSE)) for everything here written by Greg and Claude. Third-party material is referenced, not included.

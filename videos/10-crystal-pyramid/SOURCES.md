# Third-party and personal material: where it is and how to get it

## The Labyrinth clip (not included: copyrighted; used briefly, small and muted, as commentary)
- Labyrinth (1986), Jim Henson Company / TriStar. The moment: Sarah bites the peach; the Goblin King spins a pyramid of 4
  crystal balls in his gloved hand (really Michael Moschen's arm, from behind) and sends bubbles to her.
- Source used: YouTube fan upload "Labyrinth - Peach Dreams" (Samasaurus Rex), https://www.youtube.com/watch?v=_A29dCiWe8w ,
  3:09–3:15 (640×480, letterboxed; picture ≈ crop 624:266:8:105). The video used 192.1–195.3 s.
- Download (yt-dlp needs a JS runtime for YouTube now, e.g. deno):
  `brew install yt-dlp deno` then `yt-dlp -f "bv*[height<=1080]+ba/b" --merge-output-format mp4 -o "%(id)s.%(ext)s" _A29dCiWe8w`
- Background: https://en.wikipedia.org/wiki/Michael_Moschen ; Henson's "Inside the Labyrinth: Crystals"
  https://www.youtube.com/watch?v=3U8fTAHxjdo (behind the scenes, incl. Moschen doing the balls in black).
- Not in the official Henson "Ballroom Scene" clip (4nBjvElCzAw): it starts just after this moment.

## The choir sound font (not included: 216 MB; MIT licensed)
- MuseScore_General.sf2 (FluidR3 → FluidR3Mono → MuseScore General):
  https://ftp.osuosl.org/pub/musescore/soundfont/MuseScore_General/MuseScore_General.sf2 (license: MuseScore_General_License.md
  in the same folder). Played with FluidSynth (`brew install fluid-synth`). Credit it in the description.

## Greg's footage (not included)
- An iPhone video of Greg doing the 4-ball pyramid with tennis balls (1920×1080, 39.5 s): 0–8 s a pretend failed attempt,
  ~9 s on the real rotation. The video used 5.48–7.80 s (fail) and 8.42–14.52 s (rotation). Shoot your own.

## Regenerable (not included)
- The glass-ball scenes: blender/pyramid.py + blender/anim.py (Blender 5.2, Cycles on the Mac's GPU, 64 samples, ~44 s/frame).
- The choir cues: audio/suite.py + audio/suite.sh (MIDI → FluidSynth → texture → mix).

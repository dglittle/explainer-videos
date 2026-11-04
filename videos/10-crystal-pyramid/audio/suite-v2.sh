#!/bin/bash
# suite.sh CUT.mp4 OUT.mp4 — on the Mac: scene lengths from cuts-used.json → MIDI cues (suite.py) → FluidSynth → one shared gain
# (cues keep their relative loudness) → each trimmed to its scene → soundtrack (a | b | silence | d | e) → muxed onto CUT.mp4.
cd "$(dirname "$0")"
set -e -o pipefail
SF=~/airport-sessions/crystal-src/sf/MuseScore_General.sf2; FF=/opt/homebrew/bin/ffmpeg
read LAB FAIL REAL <<< $(/usr/bin/python3 -c "import json;c=json.load(open('../cuts-used.json'));print(round(c['lab']['out']-c['lab']['in'],3),round(c['fail']['out']-c['fail']['in'],3),round(c['rot']['out']-c['rot']['in'],3))")
CGI1=4; CGI2=3.5
echo "scenes: lab $LAB cgi1 $CGI1 fail $FAIL cgi2 $CGI2 real $REAL"
/usr/bin/python3 suite.py smid $LAB $CGI1 $CGI2 $REAL
for v in a b d e; do
  /opt/homebrew/bin/fluidsynth -ni -q -F sraw-$v.wav -r 48000 -g 0.22 \
    -o synth.reverb.room-size=0.95 -o synth.reverb.damp=0.15 -o synth.reverb.width=1.0 -o synth.reverb.level=0.9 \
    -o synth.chorus.active=1 -o synth.chorus.level=1.2 -o synth.chorus.depth=6 "$SF" smid/$v.mid
done
# the shared gain comes from a, b, d; e (the loud finale) gets the same gain plus a limiter
pk=$(for v in a b d; do $FF -i sraw-$v.wav -af volumedetect -f null - 2>&1 | grep max_volume | grep -oE -- "-?[0-9.]+ dB" | grep -oE -- "-?[0-9.]+"; done | sort -g | tail -1)
[ -n "$pk" ] || { echo "no peak measured"; exit 1; }
G=$(echo "-3 - ($pk)" | bc); echo "loudest raw peak $pk dB -> gain $G dB for all cues"
cue(){ # name length fade
  $FF -v error -y -i sraw-$1.wav -af "volume=${G}dB,atrim=0:$2,afade=t=out:st=$(echo "$2 - $3" | bc):d=$3" -ar 48000 -ac 2 cue-$1.wav; }
cue a $LAB 0.08; cue b $CGI1 0.08; cue d $CGI2 0.08
$FF -v error -y -i sraw-e.wav -af "volume=${G}dB,alimiter=limit=0.7:attack=5:release=80:level=false,atrim=0:$REAL,afade=t=out:st=$(echo "$REAL - 1.5" | bc):d=1.5" -ar 48000 -ac 2 cue-e.wav
$FF -v error -y -f lavfi -t $FAIL -i anullsrc=r=48000:cl=stereo cue-c.wav
$FF -v error -y -i cue-a.wav -i cue-b.wav -i cue-c.wav -i cue-d.wav -i cue-e.wav -filter_complex "concat=n=5:v=0:a=1" soundtrack.wav
for v in a b c d e; do echo "cue $v $(/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of csv=p=0 cue-$v.wav)s"; done
for v in a b d e; do $FF -v error -y -i cue-$v.wav -c:a aac -b:a 160k cue-$v.m4a; done
$FF -v error -y -i soundtrack.wav -c:a aac -b:a 160k soundtrack.m4a
$FF -v error -y -i "$1" -i soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$2"
echo "video $(/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")s soundtrack $(/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of csv=p=0 soundtrack.wav)s"
$FF -i "$2" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"

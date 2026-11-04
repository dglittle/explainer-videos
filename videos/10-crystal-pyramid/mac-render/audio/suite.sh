#!/bin/bash
# suite.sh CUT.mp4 OUT.mp4 [half] — on the Mac: scene lengths from cuts-used.json → MIDI cues (suite.py) → FluidSynth → one shared gain
# (cues keep their relative loudness) → each trimmed to its scene → soundtrack (a | b | silence | d | e) → muxed onto CUT.mp4.
cd "$(dirname "$0")"
set -e -o pipefail
SF=~/airport-sessions/crystal-src/sf/MuseScore_General.sf2; FF=/opt/homebrew/bin/ffmpeg
read LAB FAIL REAL <<< $(/usr/bin/python3 -c "import json;c=json.load(open('${CUTS:-../cuts-used.json}'));print(round(c['lab']['out']-c['lab']['in'],3),round(c['fail']['out']-c['fail']['in'],3),round(c['rot']['out']-c['rot']['in'],3))")
CGI1=${CGI1:-4}; CGI2=${CGI2:-3.5}; DBREATH=${DBREATH:-0.77}     # trims: shorter CGI scenes; the d breath ends on the arrow
MODE=${3:-full}
if [ "$MODE" = half ]; then
  P=h; TARGET=-12                       # half: much quieter (loudest cue peak −12 dB instead of −3)
  # "a cheap cassette of a choir": small-speaker band, a little tape wobble, light bit-crush grit
  FX="highpass=f=170,lowpass=f=5200,vibrato=f=0.7:d=0.08,acrusher=bits=11:mix=0.3:mode=lin:aa=1,afade=t=in:d=0.005,"
else
  P=; TARGET=-3; FX=
fi
echo "scenes: lab $LAB cgi1 $CGI1 fail $FAIL cgi2 $CGI2 real $REAL"
/usr/bin/python3 suite.py ${P}smid $LAB $CGI1 $CGI2 $REAL $MODE $DBREATH
for v in a b d e; do
  /opt/homebrew/bin/fluidsynth -ni -q -F ${P}sraw-$v.wav -r 48000 -g 0.22 \
    -o synth.reverb.room-size=0.95 -o synth.reverb.damp=0.15 -o synth.reverb.width=1.0 -o synth.reverb.level=0.9 \
    -o synth.chorus.active=1 -o synth.chorus.level=1.2 -o synth.chorus.depth=6 "$SF" ${P}smid/$v.mid
done
# the shared gain comes from a, b, d; e (the loud finale) gets the same gain plus a limiter
pk=$(for v in a b d; do $FF -i ${P}sraw-$v.wav -af "${FX}volumedetect" -f null - 2>&1 | grep max_volume | grep -oE -- "-?[0-9.]+ dB" | grep -oE -- "-?[0-9.]+"; done | sort -g | tail -1)
[ -n "$pk" ] || { echo "no peak measured"; exit 1; }
G=$(echo "$TARGET - ($pk)" | bc); echo "loudest raw peak $pk dB -> gain $G dB for all cues"
cue(){ # name length fade [limiter] [extra dB]
  local lim=; [ "$4" = lim ] && lim="alimiter=limit=0.7:attack=5:release=80:level=false,"
  local xg=${5:-0}
  local tex="[a]anull[o]"
  if [ "$MODE" = half ]; then             # faint hiss + sparse crackle under each cue (it cuts with the cue)
    tex="anoisesrc=d=$2:c=pink:a=0.004:r=48000,aformat=channel_layouts=stereo[n];aevalsrc='if(lt(random(0),0.0006),(random(1)-0.5)*0.35,0)|if(lt(random(2),0.0006),(random(3)-0.5)*0.35,0)':d=$2:s=48000,lowpass=f=3000[c];[a][n][c]amix=inputs=3:normalize=0[o]"
  fi
  $FF -v error -y -i ${P}sraw-$1.wav -filter_complex "[0:a]${FX}volume=$(echo "$G + $xg" | bc)dB,${lim}atrim=0:$2,aformat=channel_layouts=stereo:sample_rates=48000[a];$tex;[o]afade=t=out:st=$(echo "$2 - $3" | bc):d=$3[out]" -map "[out]" -ar 48000 -ac 2 ${P}cue-$1.wav; }
cue a $LAB 0.08; cue b $CGI1 0.08; cue d $CGI2 0.08
if [ "$MODE" = half ]; then cue e $REAL 1.5 - -3.5; else cue e $REAL 1.5 lim; fi     # half: the finale only a bit louder
$FF -v error -y -f lavfi -t $FAIL -i anullsrc=r=48000:cl=stereo ${P}cue-c.wav
$FF -v error -y -i ${P}cue-a.wav -i ${P}cue-b.wav -i ${P}cue-c.wav -i ${P}cue-d.wav -i ${P}cue-e.wav -filter_complex "concat=n=5:v=0:a=1" ${P}soundtrack.wav
for v in a b c d e; do echo "cue $v $(/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of csv=p=0 ${P}cue-$v.wav)s"; done
for v in a b d e; do $FF -v error -y -i ${P}cue-$v.wav -c:a aac -b:a 160k ${P}cue-$v.m4a; done
$FF -v error -y -i ${P}soundtrack.wav -c:a aac -b:a 160k ${P}soundtrack.m4a
$FF -v error -y -i "$1" -i ${P}soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$2"
echo "video $(/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")s soundtrack $(/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of csv=p=0 ${P}soundtrack.wav)s"
$FF -i "$2" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"

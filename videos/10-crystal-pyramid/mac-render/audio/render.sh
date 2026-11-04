#!/bin/bash
# render.sh — on the Mac: MIDI variants → wav (FluidSynth + MuseScore General, big reverb) → loudness-normalized m4a + wav
cd "$(dirname "$0")"
SF=~/airport-sessions/crystal-src/sf/MuseScore_General.sf2; FF=/opt/homebrew/bin/ffmpeg
/usr/bin/python3 choir.py mid
for v in A B C; do
  case $v in A) L=8.5;; B) L=10;; C) L=9;; esac        # seconds kept (the tail fades out over the last 2 s)
  /opt/homebrew/bin/fluidsynth -ni -q -F raw-$v.wav -r 48000 -g 0.5 \
    -o synth.reverb.room-size=0.95 -o synth.reverb.damp=0.15 -o synth.reverb.width=1.0 -o synth.reverb.level=0.9 \
    -o synth.chorus.active=1 -o synth.chorus.level=1.2 -o synth.chorus.depth=6 "$SF" mid/$v.mid
  # plain gain to a -3 dB peak (loudnorm's dynamic mode flattened the swells), and trim the silent end of the reverb tail
  pk=$($FF -i raw-$v.wav -af volumedetect -f null - 2>&1 | grep max_volume | grep -oE -- "-?[0-9.]+ dB" | grep -oE -- "-?[0-9.]+")
  $FF -v error -y -i raw-$v.wav -af "volume=$(echo "-3 - ($pk)" | bc)dB,atrim=0:$L,afade=t=out:st=$(echo "$L - 2" | bc):d=2" -ar 48000 choir-$v.wav
  $FF -v error -y -i choir-$v.wav -c:a aac -b:a 160k choir-$v.m4a
  echo "$v $($FF -i choir-$v.wav -af volumedetect -f null - 2>&1 | grep -E 'max_volume' | sed 's/.*max/max/') $(/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of csv=p=0 choir-$v.wav)s"
done

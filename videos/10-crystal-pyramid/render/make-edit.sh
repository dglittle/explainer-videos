#!/bin/bash
# make-edit.sh — preview material for edit.html: one small video per section (as in the current cut) + the half-mode cue audio.
cd "$(dirname "$0")"; set -e
F=/opt/homebrew/bin/ffmpeg; S=~/airport-sessions/crystal-src; GREG=$S/greg/IMG_0797.MOV
read F0 F1 R0 R1 <<< $(/usr/bin/python3 -c "import json;c=json.load(open('cuts-used.json'));print(c['fail']['in'],c['fail']['out'],c['rot']['in'],c['rot']['out'])")
mkdir -p edit
V="scale=960:540,fps=30,format=yuv420p"; E="-an -c:v libx264 -crf 21 -g 3 -movflags +faststart"
$F -v error -y -t 5.9 -i crystal-cut9.mp4 -vf "$V" $E edit/v-a.mp4                       # Labyrinth, framed + captions
$F -v error -y -i a-spin-cy.mp4 -vf "$V" $E edit/v-b.mp4
$F -v error -y -ss $F0 -to $F1 -i "$GREG" -vf "$V" $E edit/v-c.mp4
$F -v error -y -i a-arrows-cy.mp4 -vf "$V" $E edit/v-d.mp4
$F -v error -y -ss $R0 -to $R1 -i "$GREG" -vf "$V" $E edit/v-e.mp4
for v in a b d e; do cp audio/hcue-$v.wav edit/au-$v.wav; done
for v in a b c d e; do echo "$v $(/opt/homebrew/bin/ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 edit/v-$v.mp4) frames"; done

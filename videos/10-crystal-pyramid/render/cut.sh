#!/bin/bash
# cut.sh OUT.mp4   (NA..NE = exact frame counts per section, optional) — first cut: labyrinth | spin anim | greg fails | arrows anim | greg rotates. Silent (voice comes later).
cd "$(dirname "$0")"
F=/opt/homebrew/bin/ffmpeg; S=~/airport-sessions/crystal-src
LAB=$S/dl/_A29dCiWe8w.mp4; GREG=$S/greg/IMG_0797.MOV
L0=${L0:-189.4}; L1=${L1:-195.3}      # labyrinth: the 4-ball pyramid close-up (3:09.4–3:15.3)
F0=${F0:-1.0};  F1=${F1:-6.0}         # greg pretends to struggle
R0=${R0:-10.0}; R1=${R1:-17.0}        # greg really rotates them
FONT=/System/Library/Fonts/Avenir\ Next.ttc
BG=0x0b0e16
V="fps=30,format=yuv420p,setsar=1"
$F -v error -y \
 -ss $L0 -to $L1 -i "$LAB" -ss ${SP0:-0} -to ${SP1:-99} -i ${SPINF:-a-spin.mp4} -ss $F0 -to $F1 -i "$GREG" -ss ${AR0:-0} -to ${AR1:-99} -i ${ARROWS:-a-arrows.mp4} -ss $R0 -to $R1 -i "$GREG" \
 -f lavfi -i "anullsrc=r=48000:cl=stereo" \
 -filter_complex "
  [0:v]crop=624:266:8:105,scale=1440:614:flags=lanczos,setpts=PTS-STARTPTS[lab];
  color=c=$BG:s=1920x1080:r=30:d=$(echo "$L1-$L0" | bc)[bg];
  [bg][lab]overlay=240:170:shortest=1,
   drawtext=fontfile='$FONT':text='Labyrinth (1986)':fontsize=52:fontcolor=0xe8ecf4:x=(w-tw)/2:y=830,
   drawtext=fontfile='$FONT':text='crystal balls\: Michael Moschen':fontsize=32:fontcolor=0x9aa6bc:x=(w-tw)/2:y=905,
   fade=in:st=0:d=0.3,$V,trim=end_frame=${NA:-999999},setpts=PTS-STARTPTS[s1];
  [1:v]$V,setpts=PTS-STARTPTS,trim=end_frame=${NB:-999999},setpts=PTS-STARTPTS[s2];
  [2:v]scale=1920:1080,setpts=PTS-STARTPTS,$V,trim=end_frame=${NC:-999999},setpts=PTS-STARTPTS[s3];
  [3:v]$V,setpts=PTS-STARTPTS,trim=end_frame=${ND:-999999},setpts=PTS-STARTPTS[s4];
  [4:v]scale=1920:1080,setpts=PTS-STARTPTS,$V,trim=end_frame=${NE:-999999},setpts=PTS-STARTPTS[s5];
  [s1][s2][s3][s4][s5]concat=n=5:v=1:a=0[v]" \
 -map "[v]" -map 5:a -shortest -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 128k -movflags +faststart "$1"

#!/bin/bash
# recut-trims.sh OUT.mp4 [trims.json] — the cut with Greg's trims from edit.html (newest ~/Downloads/crystal-trims*.json),
# the half-hearted music re-fitted to the new lengths. Trims are frames from each section's start, as in the current cut.
OUT=$(cd "$(dirname "$1")" && pwd)/$(basename "$1")     # absolute: suite.sh runs from audio/
cd "$(dirname "$0")"; set -e -o pipefail
J=${2:-$(ls -t ~/Downloads/crystal-trims*.json 2>/dev/null | head -1)}
[ -f "$J" ] || { echo "no crystal-trims json found"; exit 1; }
cp "$J" trims-used.json; echo "using $J"
eval "$(/usr/bin/python3 trims.py "$J")"
echo "picture: lab $L0-$L1 spin $SP0-$SP1 fail $F0-$F1 arrows $AR0-$AR1 real $R0-$R1 | music: cgi1 $CGI1 cgi2 $CGI2 d-breath $DBREATH"
SPINF=a-spin-cy.mp4 ARROWS=a-arrows-cy.mp4 ./cut.sh /tmp/recut-video.mp4
CUTS=../cuts-trimmed.json audio/suite.sh /tmp/recut-video.mp4 "$OUT" half | grep -E "scenes|video|max_volume"

#!/bin/bash
# cutj.sh OUT.mp4 [cuts.json] — cut using Greg's picks from trim.html (default: newest ~/Downloads/crystal-cuts*.json)
cd "$(dirname "$0")"
J=${2:-$(ls -t ~/Downloads/crystal-cuts*.json 2>/dev/null | head -1)}
[ -f "$J" ] || { echo "no crystal-cuts json found"; exit 1; }
cp "$J" cuts-used.json; echo "using $J: $(tr -d '\n ' < "$J")"
eval "$(/usr/bin/python3 -c '
import json,sys; c=json.load(open(sys.argv[1]))
print("export L0=%s L1=%s F0=%s F1=%s R0=%s R1=%s" % (c["lab"]["in"],c["lab"]["out"],c["fail"]["in"],c["fail"]["out"],c["rot"]["in"],c["rot"]["out"]))' "$J")"
./cut.sh "$1"

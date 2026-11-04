#!/bin/bash
# tools/progress-watch.sh MACDIR — every 60 s: copy MACDIR/progress.json + the latest frame (shrunk) from the Mac and upload them
# as crystal-progress.json / .png next to crystal-progress.html. Stops after the render says "done".
cd "$(dirname "$0")/.."
D=$1; last=
rm -f pub/crystal-progress.json            # never trust a copy left over from an earlier render
while true; do
  if ! ssh mac "cat $D/progress.json" > pub/crystal-progress.json.tmp 2>/dev/null; then
    echo "$(date +%T) no progress.json yet"; sleep 20; continue
  fi
  mv pub/crystal-progress.json.tmp pub/crystal-progress.json
  latest=$(python3 -c "import json;print(json.load(open('pub/crystal-progress.json')).get('latest') or '')" 2>/dev/null)
  files=pub/crystal-progress.json
  if [ -n "$latest" ] && [ "$latest" != "$last" ] && scp -q "mac:$D/$latest" /tmp/crystal-latest.png; then
    python3 -c "from PIL import Image;im=Image.open('/tmp/crystal-latest.png').convert('RGB');im.resize((1280,720)).save('pub/crystal-progress.png',optimize=True)"
    files="$files pub/crystal-progress.png"; last=$latest
  fi
  bash ~/kb/tools/personal-reports-push.sh $files >/dev/null
  echo "$(date +%T) $(tr -d '\n' < pub/crystal-progress.json)"
  grep -q '"state": "done"' pub/crystal-progress.json && break
  sleep 60
done
echo WATCH DONE

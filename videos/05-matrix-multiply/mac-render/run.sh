#!/bin/bash
# usage: ./run.sh <take.webm> <take.json> [render.js args]
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" FF=/opt/homebrew/bin/ffmpeg PUPPETEER=$HOME/core/node_modules/puppeteer-core exec ~/.nvm/versions/node/v22.13.1/bin/node render.js "$@"

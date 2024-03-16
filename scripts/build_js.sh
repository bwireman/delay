#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

./scripts/update.sh

gleam clean
rm -rf dist/delay.mjs
rm -rf dist/delay.d.js
gleam build --target javascript

# format input for comments.py
cat src/delay.gleam | grep pub -B 3 | grep -v "\}" | grep -v import | sed -E 's/\(.*//g' >comments.tmp

yarn esbuild \
    build/dev/javascript/delay/delay.mjs \
    --bundle \
    --external:*/prelude.mjs \
    --external:*/gleam.mjs \
    --keep-names \
    --outfile=dist/delay.mjs \
    --format=esm \
    --platform=neutral \
    --banner:js='//Code for `delay-gleam` Generated using Gleam & Esbuild 
    //https://www.npmjs.com/package/delay-gleam 
    //https://github.com/bwireman/delay'

mv dist/delay.mjs dist/delay.mjs.tmp
cat dist/delay.mjs.tmp |
    sed 's/var tempDataView.*//g' |
    sed 's/var SHIFT.*//g' |
    sed 's/var BUCKET_SIZE.*//g' |
    sed 's/var MASK.*//g' |
    sed 's/var MAX_INDEX_NODE.*//g' |
    sed 's/var MIN_ARRAY_NODE.*//g' |
    grep -v "gleam/.*mjs" |
    grep -v "gleam_stdlib/.*mjs" |
    sed 's/\.\.\/gleam.mjs/.\/extras\/prelude.mjs/g' |
    sed 's/\.\/gleam.mjs/.\/extras\/prelude.mjs/g'  >dist/delay.mjs

rm dist/delay.mjs.tmp

# comment ./dist/delay.mjs
./scripts/comment.py dist/delay.mjs 'build/dev/javascript/delay/delay.mjs'

yarn dets \
    --files build/dev/javascript/delay/delay.mjs \
    --types build/dev/javascript/delay/delay.d.mts \
    --out dist/delay.d.mts.tmp

# fixup issue in dets around iterator symbol and numbered properties
# & remove dets module declaration
cat dist/delay.d.mts.tmp |
    tail -n +2 |
    head -n -1 |
    sed 's/\"\[Symbol.iterator\]\"/\[Symbol.iterator\]/g' |
    sed 's/\"\([[:digit:]]\+\)\"/\1/g' >dist/delay.d.mts


yarn eslint ./dist/delay.mjs --fix
yarn eslint ./dist/extras/extras.mjs --fix
yarn prettier ./dist --write
yarn prettier ./dist/extras/extras.mjs --write

# comment ./dist/delay.d.mts
./scripts/comment.py dist/delay.d.mts

rm dist/*.tmp
rm *.tmp

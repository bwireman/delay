#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

gleam clean
rm -rf dist/
gleam build --target javascript

# format input for comments.py
cat src/delay.gleam | grep pub -B 3 | grep -v "\}" | grep -v import  | sed -E 's/\(.*//g' >  comments.tmp 

yarn esbuild \
    --bundle build/dev/javascript/delay/delay.mjs \
    --keep-names \
    --outdir=dist \
    --format=esm \
    --platform=neutral \
    --banner:js='//Code for `delay-gleam` Generated using Gleam & Esbuild 
    //https://www.npmjs.com/package/delay-gleam 
    //https://github.com/bwireman/delay'

# comment ./dist/delay.js 
./scripts/comment.py dist/delay.js 'build/dev/javascript/delay/delay.mjs'

yarn dets \
    --files build/dev/javascript/delay/delay.mjs \
    --types build/dev/javascript/delay/delay.d.mts build/dev/javascript/delay/gleam.d.mts build/dev/javascript/prelude.d.mts \
    --out dist/delay.d.ts.tmp

# fixup issue in dets around iterator symbol and numbered properties
# & remove dets module declaration
cat dist/delay.d.ts.tmp |
    tail -n +2 |
    head -n -1 |
    sed 's/\"\[Symbol.iterator\]\"/\[Symbol.iterator\]/g' |
    sed 's/\"\([[:digit:]]\+\)\"/\1/g' >dist/delay.d.ts

yarn prettier ./dist --write

# comment ./dist/delay.d.ts 
./scripts/comment.py dist/delay.d.ts

rm dist/*.tmp
rm *.tmp

#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

gleam clean
rm -rf dist/
gleam build --target javascript

yarn esbuild \
    --bundle build/dev/javascript/delay/delay.mjs \
    --keep-names \
    --outdir=dist \
    --format=esm \
    --sourcemap \
    --platform=neutral

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

rm dist/delay.d.ts.tmp

yarn prettier ./dist --write
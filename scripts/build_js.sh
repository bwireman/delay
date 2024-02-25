#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

gleam clean
rm -rf dist/
gleam build --target javascript
yarn esbuild --bundle build/dev/javascript/delay/delay.mjs --keep-names --analyze=verbose --outdir=dist --format=esm --sourcemap --platform=neutral
cp build/dev/javascript/delay/delay.d.mts dist/
cp build/dev/javascript/prelude.d.mts dist/
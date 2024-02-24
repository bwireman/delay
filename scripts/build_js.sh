#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

gleam clean
gleam build --target javascript
rm -rf dist/
yarn esbuild --bundle build/dev/javascript/delay/delay.mjs --outdir=dist --format=esm --sourcemap --platform=neutral
cp build/dev/javascript/delay/delay.d.mts dist/
cp build/dev/javascript/prelude.d.mts dist/
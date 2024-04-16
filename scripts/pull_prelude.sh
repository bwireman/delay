#!/usr/bin/env bash
set -ex

cd "$(dirname $0)/.."

if [ -z "$1" ]; then
    echo "Must set gleam tag"
    echo "Usage:" "$0" "<version>"
    exit 1
fi
VER="v$1"

http --print=b "https://raw.githubusercontent.com/gleam-lang/gleam/${VER}/LICENCE" > LICENCE._
sed -e 's/^/\/\//' LICENCE._ > LICENCE._._

echo "// copy of https://github.com/gleam-lang/gleam/blob/${VER}/compiler-core/templates/prelude.d.mts" > dist/extras/prelude.d.mts
echo "// ---" > dist/extras/prelude.d.mts
cat LICENCE._._ >> dist/extras/prelude.d.mts
http --print=b "https://raw.githubusercontent.com/gleam-lang/gleam/${VER}/compiler-core/templates/prelude.d.mts" >> dist/extras/prelude.d.mts

echo "// copy of https://github.com/gleam-lang/gleam/blob/${VER}/compiler-core/templates/prelude.mjs" > dist/extras/prelude.mjs
echo "// ---" >> dist/extras/prelude.mjs
cat LICENCE._._ >> dist/extras/prelude.mjs
http --print=b "https://raw.githubusercontent.com/gleam-lang/gleam/${VER}/compiler-core/templates/prelude.mjs" >> dist/extras/prelude.mjs

rm -rf LICENCE._
rm -rf LICENCE._._
#!/usr/bin/env bash
set -ex

cd "$(dirname $0)/.."

if [ -z "$1" ]; then
    echo "Must set gleam tag"
    echo "Usage:" "$0" "<version>"
    exit 1
fi
VER="v$1"

http --print=b "https://raw.githubusercontent.com/gleam-lang/gleam/${VER}/LICENCE" > dist/extras/LICENCE.txt_
sed -e 's/^/\/\//' dist/extras/LICENCE.txt_ > dist/extras/LICENCE.comments.txt_
rm -rf dist/extras/LICENCE.txt_

echo "// copy of https://github.com/gleam-lang/gleam/blob/${VER}/compiler-core/templates/prelude.d.mts" > dist/extras/prelude.d.mts
echo "// ---" > dist/extras/prelude.d.mts

cat dist/extras/LICENCE.comments.txt_ >> dist/extras/prelude.d.mts
gleam export typescript-prelude >> dist/extras/prelude.d.mts

echo "// copy of https://github.com/gleam-lang/gleam/blob/${VER}/compiler-core/templates/prelude.mjs" > dist/extras/prelude.mjs
echo "// ---" >> dist/extras/prelude.mjs

cat dist/extras/LICENCE.comments.txt_ >> dist/extras/prelude.mjs
gleam export javascript-prelude >> dist/extras/prelude.mjs

rm -rf dist/extras/LICENCE.comments.txt_
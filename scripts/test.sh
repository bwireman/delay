#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

gleam format src test
gleam build --target erlang
./scripts/build_js.sh
gleam test --target erlang
gleam test --target javascript
yarn vitest --run

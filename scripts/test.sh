#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

gleam build --target erlang
gleam build --target javascript
gleam test --target erlang
gleam test --target javascript
gleam format src test

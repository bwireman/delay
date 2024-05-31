#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

gleam update
yarn upgrade
yarn audit
gleam run -m go_over
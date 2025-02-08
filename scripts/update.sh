#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

gleam update
npm upgrade
npm audit
#!/usr/bin/env bash
set -e

cd "$(dirname $0)/.."

GREEN='\033[0;32m'
NC='\033[0m'

gleam format src test
gleam build --target erlang
./scripts/build_js.sh

echo -e "${GREEN}==> erlang${NC}"
gleam test --target erlang

echo -e "${GREEN}==> nodejs${NC}"
gleam test --target javascript --runtime nodejs
node --test ./specs/test_dist.spec.js

echo -e "${GREEN}==> bun${NC}"
gleam test --target javascript --runtime bun
bun test ./specs/test_dist.spec.js

echo -e "${GREEN}==> deno${NC}"
gleam test --target javascript --runtime deno
deno test ./specs/test_dist.spec.js

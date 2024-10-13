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

echo -e "${GREEN}==> bun${NC}"
gleam test --target javascript --runtime bun

echo -e "${GREEN}==> deno${NC}"
gleam test --target javascript --runtime deno

echo -e "${GREEN}==> VITE${NC}"
yarn vitest --run

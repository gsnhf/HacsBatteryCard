#!/usr/bin/env bash
set -euo pipefail

mkdir -p ha-config

printf '\nDevcontainer ready.\n'
printf 'Start Home Assistant with: docker-compose up -d\n'
printf 'Then open: http://localhost:8123\n\n'
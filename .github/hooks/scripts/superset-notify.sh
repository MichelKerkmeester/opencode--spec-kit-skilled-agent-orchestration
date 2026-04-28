#!/usr/bin/env bash
set -euo pipefail

EVENT="${1:-}"

if [ -x "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh" ]; then
  /Users/michelkerkmeester/.superset/hooks/copilot-hook.sh "$EVENT"
else
  printf '{}\n'
fi

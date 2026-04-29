#!/usr/bin/env bash
set -euo pipefail

event="${1:-}"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"
payload="$(cat)"

case "$event" in
  sessionStart)
    node "$repo_root/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js" >/dev/null
    ;;
  userPromptSubmitted)
    printf '%s' "$payload" | node "$repo_root/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js" >/dev/null
    ;;
esac

if [[ -x /Users/michelkerkmeester/.superset/hooks/copilot-hook.sh ]]; then
  printf '%s' "$payload" | /Users/michelkerkmeester/.superset/hooks/copilot-hook.sh "$event" >/dev/null || true
fi

printf '{}\n'

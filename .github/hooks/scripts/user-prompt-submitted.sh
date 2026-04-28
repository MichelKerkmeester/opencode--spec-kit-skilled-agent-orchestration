#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
INPUT_FILE="$(mktemp "${TMPDIR:-/tmp}/speckit-copilot-user-prompt.XXXXXX")"
trap 'rm -f "$INPUT_FILE"' EXIT

cat > "$INPUT_FILE"

cd "$REPO_ROOT"
node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js < "$INPUT_FILE"

if [ -x "/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh" ]; then
  /Users/michelkerkmeester/.superset/hooks/copilot-hook.sh userPromptSubmitted < "$INPUT_FILE" >/dev/null 2>/dev/null || true
fi

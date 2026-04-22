#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
HOOK_JS="${REPO_ROOT}/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js"
TMP_INPUT="$(mktemp "${TMPDIR:-/tmp}/copilot-user-prompt.XXXXXX")"

cleanup() {
  rm -f "${TMP_INPUT}"
}

trap cleanup EXIT

cat > "${TMP_INPUT}" || true

if [ -f "${HOOK_JS}" ]; then
  node "${HOOK_JS}" < "${TMP_INPUT}" > /dev/null || true
fi

"${SCRIPT_DIR}/superset-notify.sh" userPromptSubmitted < /dev/null > /dev/null 2>&1 || true

printf '{}\n'

#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
HOOK_JS="${REPO_ROOT}/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js"
TMP_INPUT="$(mktemp "${TMPDIR:-/tmp}/copilot-session-start.XXXXXX")"

cleanup() {
  rm -f "${TMP_INPUT}"
}

trap cleanup EXIT

cat > "${TMP_INPUT}" || true

if [ -f "${HOOK_JS}" ]; then
  if ! node "${HOOK_JS}" < "${TMP_INPUT}"; then
    cat <<'EOF'
Session context received. Current state:

- Memory: startup summary unavailable
- Code Graph: unavailable
- CocoIndex: unknown

What would you like to work on?
EOF
  fi
else
  cat <<'EOF'
Session context received. Current state:

- Memory: startup summary unavailable
- Code Graph: unavailable
- CocoIndex: unknown

What would you like to work on?
EOF
fi

"${SCRIPT_DIR}/superset-notify.sh" sessionStart < /dev/null > /dev/null 2>&1 || true

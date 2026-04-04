#!/bin/bash
set -euo pipefail

EVENT_TYPE="${1:-}"
SUPERSET_HOOK="${SUPERSET_COPILOT_HOOK:-${HOME}/.superset/hooks/copilot-hook.sh}"

cat > /dev/null 2>&1 || true

printf '{}\n'

if [ -x "${SUPERSET_HOOK}" ] && [ -n "${EVENT_TYPE}" ]; then
  "${SUPERSET_HOOK}" "${EVENT_TYPE}" < /dev/null > /dev/null 2>&1 || true
fi

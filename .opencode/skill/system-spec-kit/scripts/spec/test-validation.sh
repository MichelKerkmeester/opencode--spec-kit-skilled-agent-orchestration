#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Legacy Validation Test Wrapper
# ───────────────────────────────────────────────────────────────
# Backward-compatible entrypoint forwarding to scripts/tests.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "${SCRIPT_DIR}/../tests/test-validation.sh" "$@"

# Exit codes:
#   0 - Success

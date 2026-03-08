#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: check-links.sh
# ───────────────────────────────────────────────────────────────
# Compatibility entrypoint for wikilink validation.
# Delegates to rules/check-links.sh to preserve existing call paths.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/rules/check-links.sh" "$@"

# Exit codes:
#   0 - Success

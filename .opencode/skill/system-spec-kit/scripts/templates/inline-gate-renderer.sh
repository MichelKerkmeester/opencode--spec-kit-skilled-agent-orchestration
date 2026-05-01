#!/usr/bin/env bash
# -------------------------------------------------------------------
# COMPONENT: Inline Gate Renderer Wrapper
# -------------------------------------------------------------------
# Renders Level-gated markdown templates for shell callers.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOADER="$SKILL_ROOT/node_modules/tsx/dist/loader.mjs"
RENDERER="$SCRIPT_DIR/inline-gate-renderer.ts"

exec node --import "$LOADER" "$RENDERER" "$@"

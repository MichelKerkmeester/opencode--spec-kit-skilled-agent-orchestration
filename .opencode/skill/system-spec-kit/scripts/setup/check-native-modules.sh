#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Check Native Modules
# ───────────────────────────────────────────────────────────────
# Quick diagnostic for native module health.
# Run from spec-kit root: bash scripts/setup/check-native-modules.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
MARKER="$ROOT_DIR/.node-version-marker"

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is required but was not found in PATH" >&2
  exit 1
fi

echo "-- Native Module Health Check --"
echo ""
echo "Current Node.js: $(node --version)"
echo "MODULE_VERSION:  $(node -e 'console.log(process.versions.modules)')"
echo ""

# Check .node-version-marker
if [[ -f "$MARKER" ]]; then
  MARKER_NODE=$(node - "$MARKER" <<'NODE'
const fs = require('fs');
const markerPath = process.argv[2];
const marker = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
console.log(marker.nodeVersion ?? 'unknown');
NODE
)
  MARKER_MOD=$(node - "$MARKER" <<'NODE'
const fs = require('fs');
const markerPath = process.argv[2];
const marker = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
console.log(marker.moduleVersion ?? 'unknown');
NODE
)
  echo "Marker Node.js:  $MARKER_NODE"
  echo "Marker MODULE:   $MARKER_MOD"
  CURRENT_MOD=$(node -e 'console.log(process.versions.modules)')
  if [[ "$MARKER_MOD" = "$CURRENT_MOD" ]]; then
    echo "Version match:   [OK]"
  else
    echo "Version match:   [FAIL] mismatch - rebuild needed" >&2
  fi
else
  echo "Marker:          [FAIL] not found (run rebuild script to create)" >&2
fi

echo ""
echo "-- Module Probes --"
echo ""

# Probe better-sqlite3
if node -e "require('$ROOT_DIR/mcp_server/node_modules/better-sqlite3')" 2>/dev/null; then
  echo "better-sqlite3:    [OK] loads"
else
  echo "better-sqlite3:    [FAIL] did not load" >&2
fi

# Probe onnxruntime-node (optional, may not be installed)
if [[ -d "$ROOT_DIR/shared/node_modules/onnxruntime-node" ]]; then
  if node -e "require('$ROOT_DIR/shared/node_modules/onnxruntime-node')" 2>/dev/null; then
    echo "onnxruntime-node:  [OK] loads"
  else
    echo "onnxruntime-node:  [FAIL] did not load" >&2
  fi
else
  echo "onnxruntime-node:  [SKIP] not installed"
fi

# Probe sharp (optional)
if [[ -d "$ROOT_DIR/shared/node_modules/sharp" ]]; then
  if node -e "require('$ROOT_DIR/shared/node_modules/sharp')" 2>/dev/null; then
    echo "sharp:             [OK] loads"
  else
    echo "sharp:             [FAIL] did not load" >&2
  fi
else
  echo "sharp:             [SKIP] not installed"
fi

echo ""
echo "-- Summary --"
echo ""
echo "If any modules FAILED, run: bash scripts/setup/rebuild-native-modules.sh" >&2

# Exit codes:
#   0 - Success
#   1 - ERROR: node is required but was not found in PATH

#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Rebuild Native Modules
# ───────────────────────────────────────────────────────────────
# Rebuilds native Node.js modules after a Node version change.
# Run from spec-kit root: bash scripts/setup/rebuild-native-modules.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Rebuilding Native Modules                               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Node.js:        $(node --version)"
echo "MODULE_VERSION: $(node -e 'console.log(process.versions.modules)')"
echo "Platform:       $(uname -s) $(uname -m)"
echo ""

# Step 1: Rebuild better-sqlite3 (mcp_server)
echo "── Step 1: Rebuilding better-sqlite3..."
cd "$ROOT_DIR/mcp_server"
npm rebuild better-sqlite3
echo "   ✓ better-sqlite3 rebuilt"

# Step 2: Rebuild shared workspace native modules
echo "── Step 2: Rebuilding shared workspace modules..."
cd "$ROOT_DIR/shared"
if [[ -d "node_modules" ]]; then
  npm rebuild 2>/dev/null || echo "   (no native modules in shared/)"
else
  echo "   (shared/node_modules not found — run npm install first)" >&2
fi
echo "   ✓ shared modules rebuilt"

# Step 3: Optionally clear HuggingFace cache
HF_CACHE="$HOME/.cache/huggingface/hub"
if [[ -d "$HF_CACHE" ]]; then
  echo ""
  echo "── Step 3: HuggingFace cache found at $HF_CACHE"
  read -p "   Clear HuggingFace cache? (y/N): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$HF_CACHE"
    echo "   ✓ HuggingFace cache cleared"
  else
    echo "   ⊘ Skipped"
  fi
fi

# Step 4: Write .node-version-marker
echo ""
echo "── Step 4: Writing .node-version-marker..."
node "$ROOT_DIR/scripts/setup/record-node-version.js"
echo "   ✓ .node-version-marker updated"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Done! Restart the MCP server to apply changes.         ║"
echo "╚══════════════════════════════════════════════════════════╝"

# Exit codes:
#   0 - Success

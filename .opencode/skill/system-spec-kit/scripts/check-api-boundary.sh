#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: API Boundary Checker
# ───────────────────────────────────────────────────────────────
# Enforce one-way API boundary: mcp_server/lib/ must NEVER import
# From mcp_server/api/. The api/ directory is a stable public
# Surface that depends on lib/, not the reverse.
#
# Exit Codes:
#   0 - No violations found
#   1 - Boundary violation(s) detected
#   2 - Missing lib/ directory

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$(dirname "$SCRIPT_DIR")/mcp_server"

if [ ! -d "$MCP_DIR/lib" ]; then
  echo "ERROR: $MCP_DIR/lib/ not found" >&2
  exit 2
fi

# Match relative imports that resolve to the api/ directory:
#   From '../api/...'  from '../../api/...'  from '../api'  from '../../api'
violations=$(grep -rn --include='*.ts' --include='*.js' -E "from ['\"]\.\.(/\.\.)?/api(/[^'\"]*)?['\"]" "$MCP_DIR/lib/" 2>/dev/null || true)

if [ -n "$violations" ]; then
  echo "ERROR: lib/ -> api/ import boundary violation(s) found:" >&2
  echo "$violations"
  echo ""
  echo "The api/ directory is a one-way boundary. Only api/ may import from lib/, never the reverse."
  exit 1
fi

echo "PASS: No lib/ -> api/ import violations found"
exit 0

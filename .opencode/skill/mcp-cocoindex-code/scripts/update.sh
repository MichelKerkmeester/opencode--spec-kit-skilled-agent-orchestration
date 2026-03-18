#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ CocoIndex Code MCP Updater                                               ║
# ╚══════════════════════════════════════════════════════════════════════════╝
# Update CocoIndex Code to the latest version in the skill folder venv.
# Usage: bash .opencode/skill/mcp-cocoindex-code/scripts/update.sh

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SKILL_DIR="$(dirname "$SCRIPT_DIR")"
readonly VENV_DIR="$SKILL_DIR/mcp_server/.venv"
readonly PACKAGE_NAME="cocoindex-code"

# ─────────────────────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

check_venv() {
    if [[ ! -d "$VENV_DIR" ]]; then
        echo "Error: Venv not found at $VENV_DIR" >&2
        echo "Run install.sh first: bash $SKILL_DIR/scripts/install.sh" >&2
        exit 1
    fi
}

get_version() {
    "$VENV_DIR/bin/pip" show "$PACKAGE_NAME" 2>/dev/null | grep "^Version:" | cut -d' ' -f2
}

update_package() {
    local current_version
    current_version="$(get_version)"
    echo "  Current version: $current_version"

    echo "  Updating $PACKAGE_NAME..."
    "$VENV_DIR/bin/pip" install --upgrade --quiet "$PACKAGE_NAME"

    local new_version
    new_version="$(get_version)"
    echo "  Updated version: $new_version"

    if [[ "$current_version" == "$new_version" ]]; then
        echo "  Already at latest version."
    fi
}

verify_binary() {
    if ! "$VENV_DIR/bin/ccc" --help > /dev/null 2>&1; then
        echo "Error: ccc binary not functional after update" >&2
        exit 1
    fi
    echo "  Binary verified: $VENV_DIR/bin/ccc"
}

# ─────────────────────────────────────────────────────────────────────────────
# 3. MAIN
# ─────────────────────────────────────────────────────────────────────────────

echo "=== CocoIndex Code MCP Update Script ==="
echo ""

check_venv
update_package
verify_binary

echo ""
echo "=== Update complete ==="

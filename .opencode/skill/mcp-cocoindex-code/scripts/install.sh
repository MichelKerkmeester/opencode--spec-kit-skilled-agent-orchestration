#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ CocoIndex Code MCP Installer                                            ║
# ╚══════════════════════════════════════════════════════════════════════════╝
# Install CocoIndex Code MCP server into the skill folder venv.
# Usage: bash .opencode/skill/mcp-cocoindex-code/scripts/install.sh

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SKILL_DIR="$(dirname "$SCRIPT_DIR")"
readonly VENV_DIR="$SKILL_DIR/mcp_server/.venv"
readonly PROJECT_ROOT="$(cd "$SKILL_DIR/../../.." && pwd)"
readonly PACKAGE_NAME="cocoindex-code"
readonly PYTHON_BIN="python3.11"

# ─────────────────────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

check_python() {
    if ! command -v "$PYTHON_BIN" &> /dev/null; then
        echo "Error: $PYTHON_BIN is not installed" >&2
        echo "Install Python 3.11 from https://www.python.org or via: brew install python@3.11" >&2
        exit 1
    fi
}

create_venv() {
    if [[ -d "$VENV_DIR" ]]; then
        echo "  Venv exists at: $VENV_DIR"
        return 0
    fi

    echo "  Creating Python 3.11 venv..."
    "$PYTHON_BIN" -m venv "$VENV_DIR"
    echo "  Venv created at: $VENV_DIR"
}

install_package() {
    echo "  Installing $PACKAGE_NAME..."
    "$VENV_DIR/bin/pip" install --upgrade --quiet "$PACKAGE_NAME"

    local version
    version="$("$VENV_DIR/bin/pip" show "$PACKAGE_NAME" 2>/dev/null | grep "^Version:" | cut -d' ' -f2)"
    echo "  Installed: $PACKAGE_NAME $version"
}

verify_binary() {
    if ! "$VENV_DIR/bin/ccc" --help > /dev/null 2>&1; then
        echo "Error: ccc binary not functional after install" >&2
        exit 1
    fi
    echo "  Binary verified: $VENV_DIR/bin/ccc"
}

init_index() {
    if [[ -d "$PROJECT_ROOT/.cocoindex_code" ]]; then
        echo "  Index exists at: $PROJECT_ROOT/.cocoindex_code/"
        return 0
    fi

    echo "  Initializing CocoIndex Code project..."
    cd "$PROJECT_ROOT"
    "$VENV_DIR/bin/ccc" init
    echo "  Run 'ccc index' to build the semantic index."
}

print_summary() {
    echo ""
    echo "=== Installation complete ==="
    echo ""
    echo "Binary:  $VENV_DIR/bin/ccc"
    echo "Project: $PROJECT_ROOT"
    echo ""
    echo "Next steps:"
    echo "  1. Build index:  $VENV_DIR/bin/ccc index"
    echo "  2. Test search:  $VENV_DIR/bin/ccc search 'error handling'"
    echo "  3. Enable MCP:   Set disabled: false in .mcp.json"
}

# ─────────────────────────────────────────────────────────────────────────────
# 3. MAIN
# ─────────────────────────────────────────────────────────────────────────────

echo "=== CocoIndex Code MCP Install Script ==="
echo ""

check_python
echo "Installing CocoIndex Code MCP server..."
echo "  Skill folder:  $SKILL_DIR"
echo "  Project root:  $PROJECT_ROOT"
echo ""

create_venv
install_package
verify_binary
init_index
print_summary

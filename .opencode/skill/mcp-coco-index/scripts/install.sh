#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ CocoIndex Code MCP Installer                                            ║
# ╚══════════════════════════════════════════════════════════════════════════╝
# Install CocoIndex Code MCP server into the skill folder venv.
# Usage: bash .opencode/skill/mcp-coco-index/scripts/install.sh

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

# ─────────────────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

PROJECT_ROOT_INPUT=""
PYTHON_BIN=""

# ─────────────────────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

show_help() {
    cat <<'EOF'
Usage: bash .opencode/skill/mcp-coco-index/scripts/install.sh [--root <path>]

Options:
  --root <path>  Override the project root to initialize
  -h, --help     Show this help message
EOF
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
    if ! "$VENV_DIR/bin/pip" install --upgrade --quiet --no-build-isolation --editable "$SKILL_DIR/mcp_server"; then
        echo "  Dependency resolution failed; retrying local editable install without dependency resolution..."
        "$VENV_DIR/bin/pip" install --upgrade --quiet --no-build-isolation --no-deps --editable "$SKILL_DIR/mcp_server"
    fi

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
    local project_root="$1"
    if [[ -d "$project_root/.cocoindex_code" ]]; then
        echo "  Index exists at: $project_root/.cocoindex_code/"
        return 0
    fi

    echo "  Initializing CocoIndex Code project..."
    cd "$project_root"
    "$VENV_DIR/bin/ccc" init
    echo "  Run 'ccc index' to build the semantic index."
}

print_summary() {
    local project_root="$1"
    echo ""
    echo "=== Installation complete ==="
    echo ""
    echo "Binary:  $VENV_DIR/bin/ccc"
    echo "Project: $project_root"
    echo ""
    echo "Next steps:"
    echo "  1. Ensure ready: bash $COMMON_SCRIPT_DIR/ensure_ready.sh --root \"$project_root\""
    echo "  2. Doctor:       bash $COMMON_SCRIPT_DIR/doctor.sh --root \"$project_root\""
    echo "  3. Enable MCP:   Set disabled: false in .mcp.json when needed"
}

# ─────────────────────────────────────────────────────────────────────────────
# 3. MAIN
# ─────────────────────────────────────────────────────────────────────────────

echo "=== CocoIndex Code MCP Install Script ==="
echo ""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --root)
            if [[ $# -lt 2 ]]; then
                log_error "Missing value for --root"
                exit 1
            fi
            PROJECT_ROOT_INPUT="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown argument: $1"
            show_help
            exit 1
            ;;
    esac
done

PROJECT_ROOT="$(resolve_project_root "$PROJECT_ROOT_INPUT")"
PYTHON_BIN="$(require_python_bin)"
echo "Installing CocoIndex Code MCP server..."
echo "  Skill folder:  $SKILL_DIR"
echo "  Project root:  $PROJECT_ROOT"
echo "  Python:       $PYTHON_BIN"
echo ""

create_venv
install_package
verify_binary
init_index "$PROJECT_ROOT"
print_summary "$PROJECT_ROOT"

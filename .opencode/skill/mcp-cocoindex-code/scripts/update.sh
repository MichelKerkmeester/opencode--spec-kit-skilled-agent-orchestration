#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ CocoIndex Code MCP Updater                                               ║
# ╚══════════════════════════════════════════════════════════════════════════╝
# Update CocoIndex Code to the latest version in the skill folder venv.
# Usage: bash .opencode/skill/mcp-cocoindex-code/scripts/update.sh

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

# ─────────────────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

PROJECT_ROOT_INPUT=""

# ─────────────────────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

check_venv() {
    if [[ ! -d "$VENV_DIR" ]]; then
        echo "Error: Venv not found at $VENV_DIR" >&2
        echo "Run install.sh first: bash $COMMON_SCRIPT_DIR/install.sh" >&2
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

show_help() {
    cat <<'EOF'
Usage: bash .opencode/skill/mcp-cocoindex-code/scripts/update.sh [--root <path>]

Options:
  --root <path>  Override the project root used for post-update health checks
  -h, --help     Show this help message
EOF
}

# ─────────────────────────────────────────────────────────────────────────────
# 3. MAIN
# ─────────────────────────────────────────────────────────────────────────────

echo "=== CocoIndex Code MCP Update Script ==="
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
check_venv
update_package
verify_binary

echo ""
echo "=== Update complete ==="
STATUS_OUTPUT="$(get_index_status_output "$PROJECT_ROOT" || true)"
FILES_COUNT="$(parse_status_files "$STATUS_OUTPUT" || printf '0')"
CHUNKS_COUNT="$(parse_status_chunks "$STATUS_OUTPUT" || printf '0')"
if [[ "${FILES_COUNT:-0}" -gt 0 && "${CHUNKS_COUNT:-0}" -gt 0 ]]; then
    echo "  Index health: ${FILES_COUNT} files, ${CHUNKS_COUNT} chunks"
else
    log_warn "Index is missing or empty after update. Run: bash $COMMON_SCRIPT_DIR/ensure_ready.sh --root \"$PROJECT_ROOT\""
fi

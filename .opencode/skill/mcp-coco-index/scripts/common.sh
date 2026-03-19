#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: COCOINDEX SCRIPT HELPERS
# ───────────────────────────────────────────────────────────────
# Shared helpers for CocoIndex skill scripts.

readonly COMMON_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SKILL_DIR="$(dirname "$COMMON_SCRIPT_DIR")"
readonly VENV_DIR="$SKILL_DIR/mcp_server/.venv"
readonly CCC_BIN="$VENV_DIR/bin/ccc"
readonly PIP_BIN="$VENV_DIR/bin/pip"
readonly VENV_PYTHON_BIN="$VENV_DIR/bin/python"
readonly DEFAULT_PROJECT_ROOT="$(cd "$SKILL_DIR/../../.." && pwd)"
readonly PACKAGE_NAME="cocoindex-code"
readonly EXIT_BINARY_MISSING=20
readonly EXIT_SKILL_PAYLOAD_MISSING=21
readonly EXIT_HELPER_PAYLOAD_INCOMPLETE=22
readonly EXIT_INDEX_MISSING=23
readonly EXIT_REQUIRED_CONFIG_MISSING=24
readonly EXIT_DAEMON_REQUIRED_NOT_RUNNING=25
readonly -a CONFIG_PATHS=(
    ".mcp.json"
    "opencode.json"
    ".agents/settings.json"
    ".gemini/settings.json"
    ".claude/mcp.json"
    ".codex/config.toml"
)

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
BLUE=$'\033[0;34m'
BOLD=$'\033[1m'
NC=$'\033[0m'

if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi

log_info() { printf "${BLUE}INFO:${NC} %s\n" "$1"; }
log_pass() { printf "${GREEN}PASS:${NC} %s\n" "$1"; }
log_warn() { printf "${YELLOW}WARN:${NC} %s\n" "$1" >&2; }
log_error() { printf "${RED}ERROR:${NC} %s\n" "$1" >&2; }

READINESS_STATUS=""
READINESS_BLOCKING_ISSUES=()
READINESS_WARNINGS=()
READINESS_DETECTED_CONFIGS=()
READINESS_EXPECTED_CONFIGS=()
READINESS_BINARY_READY=false
READINESS_SKILL_PAYLOAD_READY=false
READINESS_HELPER_PAYLOAD_READY=false
READINESS_INDEX_READY=false
READINESS_DAEMON_RUNNING=false
READINESS_PROJECT_ROOT=""
READINESS_VERSION_TEXT=""
READINESS_STATUS_OUTPUT=""
READINESS_DAEMON_STATUS_TEXT=""
READINESS_FILES_COUNT=0
READINESS_CHUNKS_COUNT=0
READINESS_RECOMMENDED_NEXT_STEP=""

json_escape() {
    local value="${1-}"
    value=${value//\\/\\\\}
    value=${value//\"/\\\"}
    value=${value//$'\n'/\\n}
    value=${value//$'\r'/\\r}
    value=${value//$'\t'/\\t}
    printf '%s' "$value"
}

resolve_project_root() {
    local candidate="${1:-$DEFAULT_PROJECT_ROOT}"
    if [[ ! -d "$candidate" ]]; then
        log_error "Project root does not exist: $candidate"
        return 1
    fi
    (
        cd "$candidate"
        pwd
    )
}

_python_meets_minimum() {
    local candidate="$1"
    "$candidate" -c 'import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)' >/dev/null 2>&1
}

find_python_bin() {
    local candidate
    for candidate in python3.13 python3.12 python3.11 python3; do
        if command -v "$candidate" >/dev/null 2>&1 && _python_meets_minimum "$candidate"; then
            printf '%s\n' "$candidate"
            return 0
        fi
    done
    return 1
}

require_python_bin() {
    local python_bin
    python_bin="$(find_python_bin || true)"
    if [[ -z "$python_bin" ]]; then
        log_error "Python 3.11+ is required but was not found on PATH."
        return 1
    fi
    printf '%s\n' "$python_bin"
}

ccc_available() {
    [[ -x "$CCC_BIN" ]]
}

get_installed_version() {
    if [[ ! -x "$PIP_BIN" ]]; then
        return 1
    fi
    "$PIP_BIN" show "$PACKAGE_NAME" 2>/dev/null | awk -F': ' '/^Version:/ {print $2; exit}'
}

run_ccc() {
    local project_root="$1"
    shift
    (
        cd "$project_root"
        COCOINDEX_CODE_ROOT_PATH="$project_root" "$CCC_BIN" "$@"
    )
}

get_index_status_output() {
    local project_root="$1"
    run_ccc "$project_root" status 2>&1
}

parse_status_chunks() {
    printf '%s\n' "$1" | awk '/Chunks:/ {print $2; exit}'
}

parse_status_files() {
    printf '%s\n' "$1" | awk '/Files:/ {print $2; exit}'
}

get_daemon_status_output() {
    local project_root="$1"
    run_ccc "$project_root" daemon status 2>&1
}

detect_configs() {
    local project_root="$1"
    local config_path
    for config_path in "${CONFIG_PATHS[@]}"; do
        if [[ -f "$project_root/$config_path" ]] && grep -q 'cocoindex_code' "$project_root/$config_path"; then
            printf '%s\n' "$config_path"
        fi
    done
}

config_has_cocoindex() {
    local project_root="$1"
    local config_path="$2"
    [[ -f "$project_root/$config_path" ]] && grep -q 'cocoindex_code' "$project_root/$config_path"
}

skill_payload_available() {
    [[ -f "$SKILL_DIR/SKILL.md" ]] &&
    [[ -d "$SKILL_DIR/references" ]] &&
    [[ -d "$SKILL_DIR/assets" ]] &&
    [[ -d "$SKILL_DIR/scripts" ]]
}

helper_payload_complete() {
    [[ -f "$COMMON_SCRIPT_DIR/common.sh" ]] &&
    [[ -f "$COMMON_SCRIPT_DIR/doctor.sh" ]] &&
    [[ -f "$COMMON_SCRIPT_DIR/ensure_ready.sh" ]] &&
    [[ -f "$COMMON_SCRIPT_DIR/install.sh" ]] &&
    [[ -f "$COMMON_SCRIPT_DIR/update.sh" ]]
}

reset_readiness_state() {
    READINESS_STATUS=""
    READINESS_BLOCKING_ISSUES=()
    READINESS_WARNINGS=()
    READINESS_DETECTED_CONFIGS=()
    READINESS_EXPECTED_CONFIGS=()
    READINESS_BINARY_READY=false
    READINESS_SKILL_PAYLOAD_READY=false
    READINESS_HELPER_PAYLOAD_READY=false
    READINESS_INDEX_READY=false
    READINESS_DAEMON_RUNNING=false
    READINESS_PROJECT_ROOT=""
    READINESS_VERSION_TEXT=""
    READINESS_STATUS_OUTPUT=""
    READINESS_DAEMON_STATUS_TEXT=""
    READINESS_FILES_COUNT=0
    READINESS_CHUNKS_COUNT=0
    READINESS_RECOMMENDED_NEXT_STEP=""
}

compute_recommended_next_step() {
    if [[ " ${READINESS_BLOCKING_ISSUES[*]-} " == *" $EXIT_SKILL_PAYLOAD_MISSING "* ]]; then
        printf '%s\n' "Restore the local mcp-coco-index skill payload before using CocoIndex automation."
        return 0
    fi
    if [[ " ${READINESS_BLOCKING_ISSUES[*]-} " == *" $EXIT_HELPER_PAYLOAD_INCOMPLETE "* ]]; then
        printf '%s\n' "Restore the CocoIndex helper scripts under .opencode/skill/mcp-coco-index/scripts."
        return 0
    fi
    if [[ " ${READINESS_BLOCKING_ISSUES[*]-} " == *" $EXIT_BINARY_MISSING "* ]]; then
        printf 'Run bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --root "%s"\n' "$READINESS_PROJECT_ROOT"
        return 0
    fi
    if [[ " ${READINESS_BLOCKING_ISSUES[*]-} " == *" $EXIT_INDEX_MISSING "* ]]; then
        printf 'Run bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --root "%s" --refresh-index\n' "$READINESS_PROJECT_ROOT"
        return 0
    fi
    if [[ " ${READINESS_BLOCKING_ISSUES[*]-} " == *" $EXIT_REQUIRED_CONFIG_MISSING "* ]] || [[ " ${READINESS_WARNINGS[*]-} " == *" $EXIT_REQUIRED_CONFIG_MISSING "* ]]; then
        printf '%s\n' "Follow .opencode/skill/mcp-coco-index/references/downstream_adoption_checklist.md and assets/config_templates.md to add cocoindex_code to the required configs."
        return 0
    fi
    if [[ " ${READINESS_BLOCKING_ISSUES[*]-} " == *" $EXIT_DAEMON_REQUIRED_NOT_RUNNING "* ]]; then
        printf '%s\n' "Restart the CocoIndex daemon or run a warm-up search before requiring daemon readiness."
        return 0
    fi
    if [[ " ${READINESS_WARNINGS[*]-} " == *" $EXIT_DAEMON_REQUIRED_NOT_RUNNING "* ]]; then
        printf '%s\n' "Daemon will auto-start on the next ccc search or ccc index command."
        return 0
    fi
    printf '%s\n' "Semantic search is ready. Use MCP search first, then follow-up queries with refresh_index=false."
}

compute_readiness() {
    local project_root="$1"
    local require_config="$2"
    local require_daemon="$3"
    shift 3

    local config_path
    local config_detected=false
    local config_missing=false

    reset_readiness_state
    READINESS_PROJECT_ROOT="$project_root"
    if [[ $# -gt 0 ]]; then
        READINESS_EXPECTED_CONFIGS=("$@")
    fi
    READINESS_BINARY_READY=false
    READINESS_SKILL_PAYLOAD_READY=false
    READINESS_HELPER_PAYLOAD_READY=false
    READINESS_INDEX_READY=false
    READINESS_DAEMON_RUNNING=false

    if skill_payload_available; then
        READINESS_SKILL_PAYLOAD_READY=true
    else
        READINESS_BLOCKING_ISSUES+=("$EXIT_SKILL_PAYLOAD_MISSING")
    fi

    if helper_payload_complete; then
        READINESS_HELPER_PAYLOAD_READY=true
    else
        READINESS_BLOCKING_ISSUES+=("$EXIT_HELPER_PAYLOAD_INCOMPLETE")
    fi

    if ccc_available; then
        READINESS_BINARY_READY=true
        READINESS_VERSION_TEXT="$(get_installed_version || true)"
        READINESS_STATUS_OUTPUT="$(get_index_status_output "$project_root" || true)"
        if [[ -n "$READINESS_STATUS_OUTPUT" ]]; then
            READINESS_FILES_COUNT="$(parse_status_files "$READINESS_STATUS_OUTPUT" || printf '0')"
            READINESS_CHUNKS_COUNT="$(parse_status_chunks "$READINESS_STATUS_OUTPUT" || printf '0')"
            if [[ "${READINESS_FILES_COUNT:-0}" -gt 0 && "${READINESS_CHUNKS_COUNT:-0}" -gt 0 ]]; then
                READINESS_INDEX_READY=true
            else
                READINESS_BLOCKING_ISSUES+=("$EXIT_INDEX_MISSING")
            fi
        else
            READINESS_BLOCKING_ISSUES+=("$EXIT_INDEX_MISSING")
        fi

        READINESS_DAEMON_STATUS_TEXT="$(get_daemon_status_output "$project_root" || true)"
        if [[ "$READINESS_DAEMON_STATUS_TEXT" == *"Daemon version:"* ]]; then
            READINESS_DAEMON_RUNNING=true
        fi
    else
        READINESS_BLOCKING_ISSUES+=("$EXIT_BINARY_MISSING")
    fi

    while IFS= read -r config_path; do
        [[ -n "$config_path" ]] && READINESS_DETECTED_CONFIGS+=("$config_path")
    done < <(detect_configs "$project_root")

    if [[ "${#READINESS_EXPECTED_CONFIGS[@]}" -gt 0 ]]; then
        for config_path in "${READINESS_EXPECTED_CONFIGS[@]}"; do
            if config_has_cocoindex "$project_root" "$config_path"; then
                config_detected=true
            else
                config_missing=true
            fi
        done
    else
        if [[ "${#READINESS_DETECTED_CONFIGS[@]}" -gt 0 ]]; then
            config_detected=true
        else
            config_missing=true
        fi
    fi

    if [[ "$config_missing" == true ]]; then
        if [[ "$require_config" == true ]]; then
            READINESS_BLOCKING_ISSUES+=("$EXIT_REQUIRED_CONFIG_MISSING")
        else
            READINESS_WARNINGS+=("$EXIT_REQUIRED_CONFIG_MISSING")
        fi
    fi

    if [[ "$READINESS_DAEMON_RUNNING" == false ]]; then
        if [[ "$require_daemon" == true ]]; then
            READINESS_BLOCKING_ISSUES+=("$EXIT_DAEMON_REQUIRED_NOT_RUNNING")
        else
            READINESS_WARNINGS+=("$EXIT_DAEMON_REQUIRED_NOT_RUNNING")
        fi
    fi

    if [[ "${#READINESS_BLOCKING_ISSUES[@]}" -gt 0 ]]; then
        READINESS_STATUS="not_ready"
    elif [[ "${#READINESS_WARNINGS[@]}" -gt 0 ]]; then
        READINESS_STATUS="degraded"
    else
        READINESS_STATUS="ready"
    fi

    READINESS_RECOMMENDED_NEXT_STEP="$(compute_recommended_next_step)"
}

readiness_exit_code() {
    if [[ "${#READINESS_BLOCKING_ISSUES[@]}" -gt 0 ]]; then
        printf '%s\n' "${READINESS_BLOCKING_ISSUES[0]}"
    else
        printf '0\n'
    fi
}

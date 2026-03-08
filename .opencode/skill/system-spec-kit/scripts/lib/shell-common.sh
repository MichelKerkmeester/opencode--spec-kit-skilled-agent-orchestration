#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Shell Common
# ───────────────────────────────────────────────────────────────
# Shared shell utilities for spec-kit scripts.
# Source this file: source "$(dirname "$0")/../lib/shell-common.sh"
#
# Functions:
#   _json_escape()    - Escape strings for safe JSON embedding
#   find_repo_root()  - Walk parent directories to find repository root
#
# Compatibility: Bash 3.2+ (macOS default)
# ───────────────────────────────────────────────────────────────

# AI-WHY: Conditional strict mode is intentional for sourced libraries.
# Calling scripts (create.sh, validate.sh, archive.sh) set -euo pipefail
# at their own file level. Making it unconditional here would override
# the caller's shell options when this file is sourced.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    set -euo pipefail
fi

# Guard against double-sourcing
[[ -n "${_SHELL_COMMON_LOADED:-}" ]] && return 0
_SHELL_COMMON_LOADED=1

# ───────────────────────────────────────────────────────────────
# JSON string escape — handles special characters for safe JSON embedding
# Usage: _json_escape "string with special chars"
# Canonical version (consolidated from create.sh and validate.sh)
# ───────────────────────────────────────────────────────────────
_json_escape() {
    local str="$1"
    # Order matters: backslash first, then other escapes
    str="${str//\\/\\\\}"   # Backslash
    str="${str//\"/\\\"}"   # Double quote
    str="${str//$'\n'/\\n}" # Newline
    str="${str//$'\r'/\\r}" # Carriage return
    str="${str//$'\t'/\\t}" # Tab
    printf '%s' "$str"
}

# ───────────────────────────────────────────────────────────────
# Repository root detection — walks parent directories looking
# for .git or .specify markers.
# Usage: find_repo_root "/some/starting/directory"
# Returns: Prints repo root path to stdout, returns 0 on success, 1 if not found
#
# Note: For git-first detection, see also scripts/common.sh get_repo_root()
# which uses `git rev-parse --show-toplevel` as primary strategy.
# ───────────────────────────────────────────────────────────────
find_repo_root() {
    local dir="${1:-}"

    [[ -n "$dir" ]] || return 1

    while [[ "$dir" != "/" ]]; do
        if [[ -d "$dir/.git" ]] || [[ -d "$dir/.specify" ]]; then
            printf '%s\n' "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    return 1
}

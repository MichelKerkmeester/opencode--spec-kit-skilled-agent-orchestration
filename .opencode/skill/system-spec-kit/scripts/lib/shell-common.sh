#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Shell Common
# ───────────────────────────────────────────────────────────────
# Shared shell utilities for spec-kit scripts.
# Source this file: source "$(dirname "$0")/../lib/shell-common.sh"
#
# Functions:
# _json_escape()    - Escape strings for safe JSON embedding
# Find_repo_root()  - Walk parent directories to find repository root
#
# Compatibility: Bash 3.2+ (macOS default)
# ───────────────────────────────────────────────────────────────

# Conditional strict mode — skipped when sourced to avoid breaking caller's error handling.
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
# Phase parent detection — determines whether a folder is a phase
# parent (contains at least one populated NNN-* child folder).
# Contract: ≥1 direct child matching ^[0-9]{3}-[a-z0-9-]+$ AND
# ≥1 such child has spec.md OR description.json.
# Usage: is_phase_parent "/path/to/spec-folder"
# Returns: 0 if phase parent, 1 if not
# ───────────────────────────────────────────────────────────────
is_phase_parent() {
    local parent_folder="$1"
    local has_nnn_child=false
    local has_populated_child=false

    local saved_nullglob
    saved_nullglob=$(shopt -p nullglob 2>/dev/null || true)
    shopt -s nullglob 2>/dev/null || true

    for phase_dir in "$parent_folder"/[0-9][0-9][0-9]-[a-z0-9][a-z0-9-]*/; do
        if [[ -d "$phase_dir" ]]; then
            has_nnn_child=true
            if [[ -f "$phase_dir/spec.md" ]] || [[ -f "$phase_dir/description.json" ]]; then
                has_populated_child=true
                break
            fi
        fi
    done

    eval "$saved_nullglob" 2>/dev/null || true

    [[ "$has_nnn_child" == "true" ]] && [[ "$has_populated_child" == "true" ]]
}

# ───────────────────────────────────────────────────────────────
# Repository root detection — walks parent directories looking
# For .git or .specify markers.
# Usage: find_repo_root "/some/starting/directory"
# Returns: Prints repo root path to stdout, returns 0 on success, 1 if not found
#
# Note: For git-first detection, see also scripts/common.sh get_repo_root()
# Which uses `git rev-parse --show-toplevel` as primary strategy.
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

# Exit codes:
# 0 - Success
# 1 - General error

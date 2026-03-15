#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Quality Audit
# ───────────────────────────────────────────────────────────────
# Discovers all spec folders and runs validate.sh on each.
# Aggregates results for continuous quality monitoring.
#
# Usage:
#   quality-audit.sh [--json] [--fix] [--root <path>]
#
# Exit codes:
#   0 - all pass
#   1 - warnings found
#   2 - errors found

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

JSON_MODE=false
FIX_MODE=false
ROOT_PATH=""
VERBOSE=false

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --json) JSON_MODE=true; shift ;;
            --fix) FIX_MODE=true; shift ;;
            --verbose|-v) VERBOSE=true; shift ;;
            --root) ROOT_PATH="$2"; shift 2 ;;
            --help|-h) show_help; exit 0 ;;
            *) echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;
        esac
    done
}

show_help() {
    cat <<'EOF'
quality-audit.sh — Continuous spec folder quality monitoring

Usage: quality-audit.sh [--json] [--fix] [--root <path>] [--verbose]

Options:
  --json      Machine-readable JSON output
  --fix       Run auto-remediation for fixable issues
  --root      Repository root (default: git root or cwd)
  --verbose   Show per-folder details
  --help      Show this help

Output:
  Summary: pass/warn/fail counts, by-rule breakdown, worst folders
EOF
}

# ───────────────────────────────────────────────────────────────
# 2. SPEC FOLDER DISCOVERY
# ───────────────────────────────────────────────────────────────

discover_spec_folders() {
    local root="$1"
    # Find directories containing spec.md, skip scratch/memory/node_modules
    find "$root" -name "spec.md" -type f \
        -not -path "*/scratch/*" \
        -not -path "*/memory/*" \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/test-fixtures/*" \
        -not -path "*/templates/*" \
        2>/dev/null | while IFS= read -r spec_file; do
        dirname "$spec_file"
    done | sort -u
}

# ───────────────────────────────────────────────────────────────
# 3. VALIDATION
# ───────────────────────────────────────────────────────────────

main() {
    parse_args "$@"

    # Resolve root
    if [[ -z "$ROOT_PATH" ]]; then
        ROOT_PATH="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
    fi

    local validate_script="$SCRIPT_DIR/validate.sh"
    if [[ ! -f "$validate_script" ]]; then
        echo "ERROR: validate.sh not found at $validate_script" >&2
        exit 2
    fi

    # Discover folders
    local folders=()
    while IFS= read -r folder; do
        [[ -n "$folder" ]] && folders+=("$folder")
    done < <(discover_spec_folders "$ROOT_PATH")

    local total=${#folders[@]}
    local pass_count=0 warn_count=0 fail_count=0
    local worst_folders=()

    if [[ $total -eq 0 ]]; then
        if $JSON_MODE; then
            echo '{"total":0,"pass":0,"warn":0,"fail":0,"folders":[]}'
        else
            echo "No spec folders found under $ROOT_PATH"
        fi
        exit 0
    fi

    local json_folders="["
    local first_json=true

    for folder in "${folders[@]}"; do
        local folder_name
        folder_name=$(echo "$folder" | sed "s|$ROOT_PATH/||")
        local exit_code=0
        local output

        if $JSON_MODE; then
            output=$(bash "$validate_script" "$folder" --json --quiet 2>/dev/null) || exit_code=$?
        else
            output=$(bash "$validate_script" "$folder" --quiet 2>/dev/null) || exit_code=$?
        fi

        case $exit_code in
            0) ((pass_count++)) || true ;;
            1) ((warn_count++)) || true
               $VERBOSE && echo "WARN: $folder_name" ;;
            2) ((fail_count++)) || true
               worst_folders+=("$folder_name")
               $VERBOSE && echo "FAIL: $folder_name"
               # --fix: re-run staleness auto-upgrade on failing folders
               if $FIX_MODE; then
                   local staleness_script="$SCRIPT_DIR/check-template-staleness.sh"
                   if [[ -f "$staleness_script" ]]; then
                       bash "$staleness_script" --auto-upgrade --root "$folder" 2>/dev/null || true
                   fi
               fi
               ;;
        esac

        if $JSON_MODE; then
            $first_json && first_json=false || json_folders+=","
            json_folders+="{\"folder\":\"$folder_name\",\"status\":$( [[ $exit_code -eq 0 ]] && echo '"pass"' || ( [[ $exit_code -eq 1 ]] && echo '"warn"' || echo '"fail"' ) )}"
        fi
    done

    json_folders+="]"

    if $JSON_MODE; then
        local worst_json="["
        local first_worst=true
        for w in "${worst_folders[@]+${worst_folders[@]:0:10}}"; do
            $first_worst && first_worst=false || worst_json+=","
            worst_json+="\"$w\""
        done
        worst_json+="]"

        cat <<EOF
{"total":$total,"pass":$pass_count,"warn":$warn_count,"fail":$fail_count,"worst":$worst_json,"folders":$json_folders}
EOF
    else
        echo ""
        echo "═══════════════════════════════════════════════════════════════"
        echo "  Spec Quality Audit Report"
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
        echo "  Total folders: $total"
        echo "  ✓ Pass:  $pass_count"
        echo "  ⚠ Warn:  $warn_count"
        echo "  ✗ Fail:  $fail_count"
        echo ""

        if [[ ${#worst_folders[@]} -gt 0 ]]; then
            echo "  Worst folders (up to 10):"
            for w in "${worst_folders[@]+${worst_folders[@]:0:10}}"; do
                echo "    - $w"
            done
            echo ""
        fi

        echo "═══════════════════════════════════════════════════════════════"
    fi

    # Exit code
    [[ $fail_count -gt 0 ]] && exit 2
    [[ $warn_count -gt 0 ]] && exit 1
    exit 0
}

main "$@"

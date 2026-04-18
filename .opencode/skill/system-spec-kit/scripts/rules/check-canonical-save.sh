#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-CANONICAL-SAVE
# ───────────────────────────────────────────────────────────────
#
# Grandfathering windows for the canonical-save hardening rollout:
# - 007/008/009/010 temporary allowlist expires at 2026-05-01T00:00:00Z
# - save_lineage enforcement becomes hard for graph writes on/after 2026-05-01T00:00:00Z

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CANONICAL_SAVE_HELPER="${CANONICAL_SAVE_HELPER:-$SCRIPT_DIR/check-canonical-save-helper.cjs}"

run_check() {
    local folder="$1"
    local _level="$2"
    local selected_rule="${3:-${SPECKIT_CANONICAL_SAVE_RULE:-CANONICAL_SAVE_ROOT_SPEC_REQUIRED}}"
    local output=""
    [[ ! -f "$CANONICAL_SAVE_HELPER" ]] && {
        RULE_NAME="$selected_rule"
        RULE_STATUS="fail"
        RULE_MESSAGE="Canonical-save helper missing"
        RULE_DETAILS=("Expected helper: $CANONICAL_SAVE_HELPER")
        return 0
    }

    output="$(node "$CANONICAL_SAVE_HELPER" "$folder" "$selected_rule")"

    RULE_NAME="$selected_rule"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    while IFS=$'\t' read -r kind value; do
        [[ -z "$kind" ]] && continue
        case "$kind" in
            rule) RULE_NAME="$value" ;;
            status) RULE_STATUS="$value" ;;
            message) RULE_MESSAGE="$value" ;;
            detail) RULE_DETAILS+=("$value") ;;
        esac
    done <<< "$output"

    if [[ -z "$RULE_MESSAGE" ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Canonical-save rule bridge returned no parseable output"
        RULE_DETAILS=("Raw output: $output")
    fi

    return 0
}

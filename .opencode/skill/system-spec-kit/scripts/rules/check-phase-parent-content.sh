#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-PHASE-PARENT-CONTENT
# ───────────────────────────────────────────────────────────────

set -euo pipefail

run_check() {
    local folder="$1"
    local _level="$2"
    local spec_file="$folder/spec.md"

    RULE_NAME="PHASE_PARENT_CONTENT"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    if ! is_phase_parent "$folder"; then
        RULE_STATUS="pass"
        RULE_MESSAGE="Not a phase parent; content-discipline scan skipped"
        return 0
    fi

    if [[ ! -f "$spec_file" ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="Phase parent spec.md missing; content-discipline scan skipped"
        return 0
    fi

    local findings
    findings="$(
        awk '
          /^```/ { in_fence = !in_fence; next }
          in_fence { next }
          /<!--/ { in_comment = 1 }
          in_comment {
            if (/-->/) in_comment = 0
            next
          }
          {
            line = tolower($0)
            if (line ~ /consolidat[a-z]*/) print FNR ": consolidat*"
            if (line ~ /merged from/) print FNR ": merged from"
            if (line ~ /renamed from/) print FNR ": renamed from"
            if (line ~ /collapsed/) print FNR ": collapsed"
            if (line ~ /reorganization/) print FNR ": reorganization"
            if ($0 ~ /[0-9]+→[0-9]+/) print FNR ": N→N"
          }
        ' "$spec_file"
    )"

    if [[ -z "$findings" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="Phase parent content avoids migration-history tokens"
        return 0
    fi

    RULE_STATUS="warn"
    RULE_MESSAGE="Phase parent spec.md contains migration-history token(s)"
    RULE_REMEDIATION="Move merge, rename, collapse, renumber, or reorganization history to context-index.md; keep parent spec.md focused on root purpose, phase manifest, and what needs done."

    while IFS= read -r finding; do
        [[ -n "$finding" ]] && RULE_DETAILS+=("$finding")
    done <<< "$findings"

    # F-019-D4-03: append manifest-size health advisory using the dist
    # is-phase-parent.js CLI. Emits child_count + threshold bucket so authors
    # see manifest sprawl alongside content-discipline tokens. Soft-fails if
    # node or the dist artifact is unavailable; never escalates final status.
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local health_cli="$script_dir/../dist/spec/is-phase-parent.js"
    if command -v node >/dev/null 2>&1 && [[ -f "$health_cli" ]]; then
        local health_line
        if health_line="$(node "$health_cli" health "$folder" 2>/dev/null)"; then
            local health_status health_count health_message
            health_status="$(printf '%s' "$health_line" | awk -F '\t' '{print $1}')"
            health_count="$(printf '%s' "$health_line" | awk -F '\t' '{print $2}')"
            health_message="$(printf '%s' "$health_line" | awk -F '\t' '{print $3}')"
            if [[ "$health_status" == "warning" || "$health_status" == "error" ]]; then
                RULE_DETAILS+=("phase-parent health: $health_status ($health_count children) — $health_message")
            fi
        fi
    fi
}

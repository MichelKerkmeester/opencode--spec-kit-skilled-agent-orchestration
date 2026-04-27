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
}

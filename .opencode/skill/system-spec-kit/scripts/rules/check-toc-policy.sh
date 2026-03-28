#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-TOC-POLICY
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: TOC_POLICY
# Severity: error
# Description: Enforces that Table of Contents sections appear only in research/research.md.

run_check() {
    local folder="$1"
    local level="$2"
    # Keep signature parity with other rules.
    : "$level"

    RULE_NAME="TOC_POLICY"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local -a toc_restricted_files=(
        "spec.md"
        "plan.md"
        "tasks.md"
        "checklist.md"
        "decision-record.md"
        "implementation-summary.md"
        "handover.md"
        "debug-delegation.md"
    )
    local -a violations=()
    local checked_count=0
    local toc_heading_pattern='^[[:space:]]*#{1,6}[[:space:]]*([0-9]+[.)][[:space:]]+)?(table of contents|toc)[[:space:]]*$'

    for doc_name in "${toc_restricted_files[@]-}"; do
        local doc_path="$folder/$doc_name"
        [[ ! -f "$doc_path" ]] && continue
        ((checked_count++)) || true

        local match_lines
        match_lines=$(grep -nEi "$toc_heading_pattern" "$doc_path" 2>/dev/null || true)
        if [[ -n "$match_lines" ]]; then
            local first_line
            first_line=$(echo "$match_lines" | head -n 1 | cut -d: -f1)
            violations+=("$doc_name: TOC heading found at line $first_line")
        fi
    done

    if [[ $checked_count -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No TOC-restricted spec documents found (skipped)"
        return
    fi

    if [[ ${#violations[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="TOC sections are not allowed in ${#violations[@]} non-research spec file(s)"
        RULE_DETAILS=("${violations[@]}")
        RULE_REMEDIATION="Remove '## TABLE OF CONTENTS' / '## TOC' sections from spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, and debug-delegation.md. Only research/research.md may include a TOC."
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="TOC policy passed: no TOC headings in non-research spec documents"
    fi
}

# Execute only when run directly to avoid double-run when sourced by validate.sh
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    run_check "$@"
fi

# Exit codes:
#   0 - Success

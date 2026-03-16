#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-TEMPLATE-SOURCE
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: TEMPLATE_SOURCE
# Severity: error
# Description: Checks that spec documents include SPECKIT_TEMPLATE_SOURCE header

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="TEMPLATE_SOURCE"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

# ───────────────────────────────────────────────────────────────
# 2. COLLECT FILES TO VALIDATE
# ───────────────────────────────────────────────────────────────

    # Check template source headers in spec documentation files
    local -a spec_files=("spec.md" "plan.md" "tasks.md" "checklist.md" "decision-record.md" "implementation-summary.md")
    local -a missing_header=()
    local -a checked_files=()

    for doc_name in "${spec_files[@]-}"; do
        local doc_path="$folder/$doc_name"
        
        # Skip if file doesn't exist
        [[ ! -f "$doc_path" ]] && continue
        
        checked_files+=("$doc_name")
        
        # Check for SPECKIT_TEMPLATE_SOURCE header in first 20 lines
        # (frontmatter with trigger_phrases arrays can exceed 10 lines)
        local has_header=false
        if head -n 20 "$doc_path" 2>/dev/null | grep -q "SPECKIT_TEMPLATE_SOURCE:"; then
            has_header=true
        fi
        
        if [[ "$has_header" == false ]]; then
            missing_header+=("$doc_name")
        fi
    done

# ───────────────────────────────────────────────────────────────
# 3. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    if [[ ${#checked_files[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No spec documentation files found (skipped)"
        return
    fi

    if [[ ${#missing_header[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Template source header missing in ${#missing_header[@]} file(s)"
        
        for file in "${missing_header[@]-}"; do
            RULE_DETAILS+=("$file: Missing <!-- SPECKIT_TEMPLATE_SOURCE: ... --> header")
        done
        
        RULE_REMEDIATION="Add template source header to files created from templates. Format:
<!-- SPECKIT_TEMPLATE_SOURCE: [template-names] | v2.2 -->

Example for Level 3+:
<!-- SPECKIT_TEMPLATE_SOURCE: spec + plan + tasks + checklist + decision-record | v2.2 -->

This header proves files were created from official templates, not from scratch or memory."
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="Template source headers present in all ${#checked_files[@]} spec files"
    fi
}

# Execute only when run directly to avoid double-run when sourced by validate.sh
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    run_check "$@"
fi

# Exit codes:
#   0 - Success

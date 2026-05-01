#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-SECTIONS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: SECTIONS_PRESENT
# Severity: warning
# Description: Checks for required markdown sections based on documentation level (warning only).
#   Spec.md: Problem Statement, Requirements, Scope
#   Plan.md: Technical Context, Architecture, Implementation
#   Checklist.md (L2+): Verification Protocol, Code Quality
#   Decision-record.md (L3): Context, Decision, Consequences

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="SECTIONS_PRESENT"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local -a missing=()
    local rule_dir helper_script
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    helper_script="$rule_dir/../utils/template-structure.js"

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local contract_level="$level"
    if is_phase_parent "$folder"; then
        contract_level="phase"
    fi

    local -a spec_files=()
    local filename
    while IFS= read -r filename; do
        [[ -n "$filename" ]] && spec_files+=("$filename")
    done < <(node "$helper_script" docs "$contract_level")

    for filename in "${spec_files[@]-}"; do
        local filepath="$folder/$filename"

        [[ ! -f "$filepath" ]] && continue

        local compare_output
        compare_output=$(node "$helper_script" compare "$contract_level" "$filename" "$filepath" headers 2>/dev/null || true)
        if ! grep -q $'^supported\ttrue$' <<< "$compare_output"; then
            continue
        fi

        while IFS=$'\t' read -r kind value; do
            if [[ "$kind" == "missing_header" ]]; then
                missing+=("$filename: $value")
            fi
        done <<< "$compare_output"
    done

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#missing[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All required sections found"
    else
        RULE_STATUS="warn"
        RULE_MESSAGE="Missing ${#missing[@]} recommended section(s)"
        RULE_DETAILS=("${missing[@]}")
        RULE_REMEDIATION="Add missing sections to improve documentation completeness"
    fi
}

# Exit codes:
#   0 - Success

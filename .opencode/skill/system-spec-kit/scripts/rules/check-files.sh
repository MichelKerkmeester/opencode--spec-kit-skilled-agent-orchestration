#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-FILES
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: FILE_EXISTS
# Severity: error
# Description: Validates required files exist for documentation level
#   Level 1: spec.md, plan.md, tasks.md
#   Level 2: Level 1 + checklist.md
#   Level 3: Level 2 + decision-record.md
#   Implementation-summary.md: Required after implementation (detected by completed items)

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="FILE_EXISTS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local missing=()
    local rule_dir
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local helper_script="$rule_dir/../utils/template-structure.js"
    local numeric_level="${level//[^0-9]/}"

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    # Phase-parent early branch: lean parents require the control trio.
    # Plan, tasks, checklist, decision-record, and implementation-summary
    # live in child phase folders.
    if is_phase_parent "$folder"; then
        local phase_doc
        while IFS= read -r phase_doc; do
            [[ -z "$phase_doc" ]] && continue
            [[ ! -f "$folder/$phase_doc" ]] && missing+=("$phase_doc")
        done < <(node "$helper_script" docs "phase")
        [[ ! -f "$folder/description.json" ]] && missing+=("description.json")
        [[ ! -f "$folder/graph-metadata.json" ]] && missing+=("graph-metadata.json")

        if [[ ${#missing[@]} -eq 0 ]]; then
            RULE_STATUS="pass"
            RULE_MESSAGE="Phase parent: lean trio present"
        else
            RULE_STATUS="fail"
            RULE_MESSAGE="Phase parent: missing ${#missing[@]} required file(s)"
            RULE_DETAILS=("${missing[@]}")
            RULE_REMEDIATION="Phase parents require spec.md, description.json, and graph-metadata.json"
        fi
        return 0
    fi

    # Implementation-summary.md required after implementation starts
    local has_implementation=false
    if [[ -f "$folder/checklist.md" ]]; then
        if grep -qE '\[[xX]\]' "$folder/checklist.md" 2>/dev/null; then
            has_implementation=true
        fi
    fi
    
    if [[ "$has_implementation" == "true" ]]; then
        [[ ! -f "$folder/implementation-summary.md" ]] && missing+=("implementation-summary.md (required after implementation)")
    fi
    
    # Level 1: check tasks.md for completion if no checklist
    if [[ "$numeric_level" -eq 1 ]] && [[ ! -f "$folder/implementation-summary.md" ]]; then
        if [[ -f "$folder/tasks.md" ]]; then
            if grep -qE '\[[xX]\]' "$folder/tasks.md" 2>/dev/null; then
                missing+=("implementation-summary.md (required: tasks show completion)")
            fi
        fi
    fi

    local doc_name
    while IFS= read -r doc_name; do
        [[ -z "$doc_name" ]] && continue
        if [[ "$doc_name" == "implementation-summary.md" ]]; then
            continue
        fi
        [[ ! -f "$folder/$doc_name" ]] && missing+=("$doc_name")
    done < <(node "$helper_script" docs "$level")

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#missing[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All required files present for Level $level"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Missing ${#missing[@]} required file(s) for Level $level"
        RULE_DETAILS=("${missing[@]}")
        local missing_list
        missing_list=$(IFS=', '; echo "${missing[*]}")
        RULE_REMEDIATION="Create missing files for Level $level: $missing_list"
    fi
}

# Exit codes:
#   0 - Success

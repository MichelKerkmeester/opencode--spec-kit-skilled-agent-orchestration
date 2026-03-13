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
    # T501 FIX: Strip non-numeric suffix (e.g. "3+" → "3") for arithmetic comparisons
    local numeric_level="${level//[^0-9]/}"

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    # Level 1 requirements
    [[ ! -f "$folder/spec.md" ]] && missing+=("spec.md")
    [[ ! -f "$folder/plan.md" ]] && missing+=("plan.md")
    [[ ! -f "$folder/tasks.md" ]] && missing+=("tasks.md")
    
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
    
    # Level 2 additions
    if [[ "$numeric_level" -ge 2 ]]; then
        [[ ! -f "$folder/checklist.md" ]] && missing+=("checklist.md")
    fi
    
    # Level 3 additions
    if [[ "$numeric_level" -ge 3 ]]; then
        [[ ! -f "$folder/decision-record.md" ]] && missing+=("decision-record.md")
    fi

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#missing[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All required files present for Level $level"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="Missing ${#missing[@]} required file(s)"
        RULE_DETAILS=("${missing[@]}")
        local missing_list
        missing_list=$(IFS=', '; echo "${missing[*]}")
        RULE_REMEDIATION="Create missing files: $missing_list. Use templates from .opencode/skill/system-spec-kit/templates/"
    fi
}

# Exit codes:
#   0 - Success

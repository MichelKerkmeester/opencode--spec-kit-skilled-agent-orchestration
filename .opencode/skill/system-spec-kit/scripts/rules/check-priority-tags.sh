#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-PRIORITY-TAGS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: PRIORITY_TAGS
# Severity: warning
# Description: Validates checklist items have priority context (P0/P1/P2 headers or inline tags).
#              Only runs for Level 2+ (when checklist.md exists)

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="PRIORITY_TAGS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    # T501 FIX: Strip non-numeric suffix (e.g. "3+" → "3") for arithmetic comparisons
    local numeric_level="${level//[^0-9]/}"
    if [[ "$numeric_level" -lt 2 ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="Skipped (Level 1 - no checklist required)"
        return
    fi
    
    local checklist="$folder/checklist.md"
    
    if [[ ! -f "$checklist" ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="Skipped (checklist.md not found)"
        return
    fi

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local current_priority=""
    local items_without_priority=0
    local line_number=0
    
    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_number++)) || true
        
        # Priority section headers: ## P0, ## P0 - Blockers, ### P0:, etc.
        if [[ "$line" =~ ^#{1,3}[[:space:]]+(P[012])([[:space:]]|$|:|-) ]]; then
            current_priority="${BASH_REMATCH[1]}"
            continue
        fi
        
        # Checklist items: - [ ] or - [x]
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[[:space:]xX]\] ]]; then
            # Validate format: must have space after ] and description
            if [[ ! "$line" =~ ^[[:space:]]*-[[:space:]]\[[[:space:]xX]\][[:space:]]+.+ ]]; then
                RULE_DETAILS+=("Line $line_number: Invalid format (missing space or description)")
                ((items_without_priority++)) || true
                continue
            fi
            
            local has_priority=false
            [[ -n "$current_priority" ]] && has_priority=true
            # Inline: [P0], [P1], [P2] or **P0**, **P1**, **P2**
            [[ "$line" =~ \[P[012]\] ]] && has_priority=true
            [[ "$line" =~ \*\*P[012]\*\* ]] && has_priority=true
            
            if [[ "$has_priority" == "false" ]]; then
                local desc="${line#*] }"
                desc="${desc:0:50}"
                [[ ${#desc} -eq 50 ]] && desc="${desc}..."
                RULE_DETAILS+=("Line $line_number: $desc")
                ((items_without_priority++)) || true
            fi
        fi
    done < "$checklist"

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ $items_without_priority -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All checklist items have priority context"
    else
        RULE_STATUS="warn"
        RULE_MESSAGE="Found $items_without_priority checklist item(s) without priority context"
        RULE_REMEDIATION="Move items under P0/P1/P2 headers or add inline [P0]/[P1]/[P2] tags"
    fi
}

# Exit codes:
#   0 - Success

#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-EVIDENCE
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: EVIDENCE_CITED
# Severity: warning
# Description: Checks that completed P0/P1 checklist items have evidence citations.
#              P2 items are exempt. Patterns: [EVIDENCE:], | Evidence:, ✓/✔,
#              (verified)/(tested)/(confirmed), [DEFERRED:]

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="EVIDENCE_CITED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local checklist="$folder/checklist.md"
    
    if [[ ! -f "$checklist" ]]; then
        RULE_STATUS="skip"
        RULE_MESSAGE="No checklist.md (Level 1 or missing)"
        return 0
    fi

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local current_priority=""
    local line_num=0
    local missing_count=0
    
    while IFS= read -r line || [[ -n "$line" ]]; do
        ((line_num++)) || true
        
        # Detect priority section headers (## P0, ## [P1], ### P2: ...)
        if [[ "$line" =~ ^#{1,6}[[:space:]]+\[?(P[0-2])\]?([[:space:]]|$|:|-) ]]; then
            current_priority="${BASH_REMATCH[1]}"
            continue
        fi

        # Check completed items: - [x] or - [X]
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[xX]\] ]]; then
            local item_priority=""
            if [[ "$line" =~ \[(P[0-2])\] ]]; then
                item_priority="${BASH_REMATCH[1]}"
            elif [[ -n "$current_priority" ]]; then
                item_priority="$current_priority"
            fi

            [[ "$item_priority" == "P2" ]] && continue

            local task_text="${line#*] }"
            local has_evidence=false
            local line_lower
            line_lower=$(echo "$line" | tr '[:upper:]' '[:lower:]')
            
            # Evidence patterns
            [[ "$line_lower" == *"[evidence:"* ]] && has_evidence=true
            [[ "$line_lower" == *"| evidence:"* ]] && has_evidence=true
            # Unicode checkmarks: ✓ ✔ ☑ ✅
            if [[ "$line" == *"✓"* || "$line" == *"✔"* || "$line" == *"☑"* || "$line" == *"✅"* ]]; then
                has_evidence=true
            fi
            # Multiple checkboxes on same line
            if [[ "$line" =~ \[[xX]\].*\[[xX]\] ]]; then
                has_evidence=true
            fi
            [[ "$line_lower" == *"(verified)"* || "$line_lower" == *"(tested)"* || "$line_lower" == *"(confirmed)"* ]] && has_evidence=true
            [[ "$line_lower" == *"[deferred:"* ]] && has_evidence=true
            
            if [[ "$has_evidence" == "false" ]]; then
                ((missing_count++)) || true
                local display_task="$task_text"
                if [[ ${#display_task} -gt 50 ]]; then
                    display_task="${display_task:0:47}..."
                fi
                local priority_label="${item_priority:-UNSPECIFIED}"
                RULE_DETAILS+=("${priority_label}:${line_num}: ${display_task}")
            fi
        fi
    done < "$checklist"

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ $missing_count -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="All completed P0/P1 items have evidence"
    else
        RULE_STATUS="warn"
        RULE_MESSAGE="Found ${missing_count} completed item(s) without evidence"
        RULE_REMEDIATION="Add [EVIDENCE: description] to completed P0/P1 items"
    fi
}

# Exit codes:
#   0 - Success

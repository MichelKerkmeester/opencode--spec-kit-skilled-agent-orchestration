#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-AI-PROTOCOLS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: AI_PROTOCOL
# Severity: warn
# Description: Validates that AI execution protocols are present for
#   Level 3+ specs that require them.

# ───────────────────────────────────────────────────────────────
# 1. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Extract level from spec.md
# Support multiple level declaration formats:
# Bullet (- **Level**: N), table row (| **Level** | N |), frontmatter (level: N)
_ai_get_declared_level() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    if [[ -f "$spec_file" ]]; then
        local level_line
        # Try bullet format first: - **Level**: N
        level_line=$(grep -E "^\- \*\*Level\*\*:" "$spec_file" 2>/dev/null || true)
        # Try table format: | **Level** | N |
        if [[ -z "$level_line" ]]; then
            level_line=$(grep -Ei '^\| *\*\*Level\*\* *\|' "$spec_file" 2>/dev/null || true)
        fi
        # Try frontmatter YAML: level: N
        if [[ -z "$level_line" ]]; then
            level_line=$(grep -Ei '^level:' "$spec_file" 2>/dev/null || true)
        fi
        if [[ -n "$level_line" ]]; then
            local level_val=""
            # Extract value based on detected format
            if echo "$level_line" | grep -qE '^\- \*\*Level\*\*:'; then
                # Bullet: - **Level**: 3
                level_val=$(echo "$level_line" | head -1 | sed 's/.*\*\*Level\*\*: *//' | tr -d '[:space:]' | sed 's/\[.*\]//' | head -c 2)
            elif echo "$level_line" | grep -qEi '^\|.*[Ll]evel'; then
                # Table: | **Level** | 3 | — extract second column
                level_val=$(echo "$level_line" | head -1 | awk -F'|' '{gsub(/[[:space:]*]/, "", $3); print $3}' | head -c 2)
            elif echo "$level_line" | grep -qEi '^level:'; then
                # Frontmatter YAML: level: 3
                level_val=$(echo "$level_line" | head -1 | sed 's/^[Ll]evel: *//' | tr -d '[:space:]' | head -c 2)
            fi
            echo "$level_val"
        fi
    fi
}

# Check for AI protocol sections in various forms
_ai_has_protocol_section() {
    local folder="$1"

    # Check plan.md
    if [[ -f "$folder/plan.md" ]]; then
        if grep -qE "AI EXECUTION|Pre-Task Checklist|Task Execution Rules" "$folder/plan.md" 2>/dev/null; then
            return 0
        fi
    fi

    # Check tasks.md
    if [[ -f "$folder/tasks.md" ]]; then
        if grep -qE "AI EXECUTION|Pre-Task Checklist|Blocked Task Protocol" "$folder/tasks.md" 2>/dev/null; then
            return 0
        fi
    fi

    return 1
}

# Check for pre-task checklist
_ai_has_pre_task_checklist() {
    local folder="$1"
    if [[ -f "$folder/plan.md" ]]; then
        grep -q "Pre-Task Checklist" "$folder/plan.md" 2>/dev/null && return 0
    fi
    if [[ -f "$folder/tasks.md" ]]; then
        grep -q "Pre-Task Checklist" "$folder/tasks.md" 2>/dev/null && return 0
    fi
    return 1
}

# Check for execution rules
_ai_has_execution_rules() {
    local folder="$1"
    if [[ -f "$folder/plan.md" ]]; then
        grep -qE "Execution Rules|TASK-SEQ|TASK-SCOPE" "$folder/plan.md" 2>/dev/null && return 0
    fi
    if [[ -f "$folder/tasks.md" ]]; then
        grep -qE "Execution Rules|TASK-SEQ|TASK-SCOPE" "$folder/tasks.md" 2>/dev/null && return 0
    fi
    return 1
}

# Check for status reporting format
_ai_has_status_format() {
    local folder="$1"
    if [[ -f "$folder/plan.md" ]]; then
        grep -qE "Status Format|Status Reporting" "$folder/plan.md" 2>/dev/null && return 0
    fi
    if [[ -f "$folder/tasks.md" ]]; then
        grep -qE "Status Format|Status Reporting" "$folder/tasks.md" 2>/dev/null && return 0
    fi
    return 1
}

# Check for blocked task protocol
_ai_has_blocked_protocol() {
    local folder="$1"
    if [[ -f "$folder/plan.md" ]]; then
        grep -qE "Blocked Task|BLOCKED" "$folder/plan.md" 2>/dev/null && return 0
    fi
    if [[ -f "$folder/tasks.md" ]]; then
        grep -qE "Blocked Task|BLOCKED" "$folder/tasks.md" 2>/dev/null && return 0
    fi
    return 1
}

# ───────────────────────────────────────────────────────────────
# 2. MAIN RUN_CHECK FUNCTION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="AI_PROTOCOL"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local warnings=()
    local errors=()

    # Get declared level from spec.md (fallback to passed level)
    local declared_level
    declared_level=$(_ai_get_declared_level "$folder")
    if [[ -z "$declared_level" ]]; then
        declared_level="$level"
    fi

    # Only check for Level 3 and 3+
    if [[ "$declared_level" != "3" ]] && [[ "$declared_level" != "3+" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="AI protocol check not applicable for Level $declared_level"
        return 0
    fi

    # Check for main AI protocol section
    if ! _ai_has_protocol_section "$folder"; then
        if [[ "$declared_level" = "3+" ]]; then
            errors+=("Level 3+ requires AI Execution Protocol section")
        else
            warnings+=("Level 3 should include AI Execution Protocol section")
        fi
    fi

    # Check individual components and track score
    local protocol_score=0

    if _ai_has_pre_task_checklist "$folder"; then
        ((protocol_score++)) || true
    else
        warnings+=("Missing Pre-Task Checklist")
    fi

    if _ai_has_execution_rules "$folder"; then
        ((protocol_score++)) || true
    else
        warnings+=("Missing Execution Rules table")
    fi

    if _ai_has_status_format "$folder"; then
        ((protocol_score++)) || true
    else
        warnings+=("Missing Status Reporting Format")
    fi

    if _ai_has_blocked_protocol "$folder"; then
        ((protocol_score++)) || true
    else
        warnings+=("Missing Blocked Task Protocol")
    fi

    # For Level 3+, require at least 3 components
    if [[ "$declared_level" = "3+" ]] && [[ "$protocol_score" -lt 3 ]]; then
        errors+=("Level 3+ requires at least 3/4 AI protocol components (found $protocol_score)")
    fi

    # ───────────────────────────────────────────────────────────────
    # 3. RESULTS
    # ───────────────────────────────────────────────────────────────

    if [[ ${#errors[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="AI protocol validation errors"
        RULE_DETAILS=("${errors[@]-}")
        if [[ -n "${warnings[*]-}" ]]; then
            RULE_DETAILS+=("${warnings[@]}")
        fi
        RULE_REMEDIATION="Add AI Execution Protocol section with required components"
    elif [[ ${#warnings[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="AI protocol incomplete ($protocol_score/4 components)"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Add missing AI protocol components for Level $declared_level"
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="AI protocols present and complete ($protocol_score/4)"
    fi

    return 0
}

# Exit codes:
#   0 - Success
#   1 - General error

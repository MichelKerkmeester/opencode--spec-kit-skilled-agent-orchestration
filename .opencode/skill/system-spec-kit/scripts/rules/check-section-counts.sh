#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-SECTION-COUNTS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: SECTION_COUNTS
# Severity: warn
# Description: Validates that section counts are within expected ranges
#   For the declared documentation level.

# ───────────────────────────────────────────────────────────────
# 1. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Extract level from spec.md
_section_get_declared_level() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    if [[ -f "$spec_file" ]]; then
        local level_line
        level_line=$(grep -E "^\- \*\*Level\*\*:" "$spec_file" 2>/dev/null || true)
        if [[ -n "$level_line" ]]; then
            echo "$level_line" | head -1 | sed 's/.*Level.*: *//' | tr -d '[:space:]' | sed 's/\[.*\]//' | head -c 2
        fi
    fi
}

# Count level 2 headers (##)
_section_count_h2() {
    local file="$1"
    if [[ -f "$file" ]]; then
        local count
        count=$(grep -c "^## " "$file" 2>/dev/null || true)
        echo "${count:-0}"
    else
        echo "0"
    fi
}

# Count level 3 headers (###)
_section_count_h3() {
    local file="$1"
    if [[ -f "$file" ]]; then
        local count
        count=$(grep -c "^### " "$file" 2>/dev/null || true)
        echo "${count:-0}"
    else
        echo "0"
    fi
}

# Count functional requirements
_section_count_requirements() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    if [[ -f "$spec_file" ]]; then
        local count
        count=$(grep -cE "REQ-FUNC-|REQ-DATA-|REQ-" "$spec_file" 2>/dev/null || true)
        echo "${count:-0}"
    else
        echo "0"
    fi
}

# Count acceptance scenarios
_section_count_acceptance_scenarios() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    if [[ -f "$spec_file" ]]; then
        local count
        count=$(grep -c "\*\*Given\*\*" "$spec_file" 2>/dev/null || true)
        echo "${count:-0}"
    else
        echo "0"
    fi
}

# ───────────────────────────────────────────────────────────────
# 2. MAIN RUN_CHECK FUNCTION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="SECTION_COUNTS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local warnings=()
    local errors=()

    # Get declared level from spec.md (fallback to passed level)
    local declared_level
    declared_level=$(_section_get_declared_level "$folder")
    if [[ -z "$declared_level" ]]; then
        declared_level="$level"
    fi

    # Count sections in each file
    local spec_h2 plan_h2 requirements scenarios
    spec_h2=$(_section_count_h2 "$folder/spec.md")
    plan_h2=$(_section_count_h2 "$folder/plan.md")
    requirements=$(_section_count_requirements "$folder")
    scenarios=$(_section_count_acceptance_scenarios "$folder")

    # Define minimum section expectations per level
    local min_spec_h2 min_plan_h2 min_requirements min_scenarios
    case "$declared_level" in
        1)
            min_spec_h2=5
            min_plan_h2=4
            min_requirements=3
            min_scenarios=2
            ;;
        2)
            # Level 2 template has 6 required sections + 1 questions section = 7 H2 minimum.
            # The 3 optional L2 sections (NFR, EDGE CASES, COMPLEXITY ASSESSMENT) may be
            # legitimately absent; template-structural compliance is enforced by TEMPLATE_HEADERS.
            min_spec_h2=7
            min_plan_h2=6
            min_requirements=5
            min_scenarios=4
            ;;
        3|3+)
            min_spec_h2=10
            min_plan_h2=8
            min_requirements=8
            min_scenarios=6
            ;;
        *)
            min_spec_h2=5
            min_plan_h2=4
            min_requirements=3
            min_scenarios=2
            ;;
    esac

    # Validate spec.md sections
    if [[ "$spec_h2" -lt "$min_spec_h2" ]]; then
        warnings+=("spec.md has $spec_h2 sections, expected at least $min_spec_h2 for Level $declared_level")
    fi

    # Validate plan.md sections
    if [[ "$plan_h2" -lt "$min_plan_h2" ]]; then
        warnings+=("plan.md has $plan_h2 sections, expected at least $min_plan_h2 for Level $declared_level")
    fi

    # Validate requirements count
    if [[ "$requirements" -lt "$min_requirements" ]]; then
        warnings+=("Found $requirements requirements, expected at least $min_requirements for Level $declared_level")
    fi

    # Validate acceptance scenarios
    if [[ "$scenarios" -lt "$min_scenarios" ]]; then
        warnings+=("Found $scenarios acceptance scenarios, expected at least $min_scenarios for Level $declared_level")
    fi

    # Check for required files at each level
    if [[ "$declared_level" = "2" ]] || [[ "$declared_level" = "3" ]] || [[ "$declared_level" = "3+" ]]; then
        if [[ ! -f "$folder/checklist.md" ]]; then
            errors+=("Level $declared_level requires checklist.md")
        fi
    fi

    if [[ "$declared_level" = "3" ]] || [[ "$declared_level" = "3+" ]]; then
        if [[ ! -f "$folder/decision-record.md" ]]; then
            warnings+=("Level $declared_level should include decision-record.md")
        fi
    fi

    # ───────────────────────────────────────────────────────────────
    # 3. RESULTS
    # ───────────────────────────────────────────────────────────────

    if [[ ${#errors[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Section count validation errors"
        RULE_DETAILS=("${errors[@]-}")
        if [[ -n "${warnings[*]-}" ]]; then
            RULE_DETAILS+=("${warnings[@]}")
        fi
        RULE_REMEDIATION="Add missing required files or increase section depth"
    elif [[ ${#warnings[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="Section counts below expectations for Level $declared_level"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Expand spec content or reduce declared level"
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="Section counts appropriate for Level $declared_level"
    fi

    return 0
}

# Exit codes:
#   0 - Success

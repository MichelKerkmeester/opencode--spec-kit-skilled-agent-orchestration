#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-COMPLEXITY
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: COMPLEXITY_MATCH
# Severity: warn
# Description: Validates that declared complexity level matches actual content.
#   Checks if spec content is appropriate for the declared level.

# ───────────────────────────────────────────────────────────────
# 1. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Extract level from spec.md metadata
_complexity_get_declared_level() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    if [[ -f "$spec_file" ]]; then
        local level

        # Pattern 0: SPECKIT_LEVEL marker (authoritative)
        level=$(grep -oE '<!-- SPECKIT_LEVEL: *[123]\+? *-->' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)

        # Pattern 1: Metadata table with bold key
        if [[ -z "$level" ]]; then
            level=$(grep -E '\|\s*\*\*Level\*\*\s*\|\s*[123]\+?\s*\|' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 2: Metadata table without bold key
        if [[ -z "$level" ]]; then
            level=$(grep -E '\|\s*Level\s*\|\s*[123]\+?\s*\|' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 3: Bullet metadata
        if [[ -z "$level" ]]; then
            level=$(grep -E '^\- \*\*Level\*\*:[[:space:]]*[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 4: YAML frontmatter
        if [[ -z "$level" ]]; then
            level=$(grep -E '^level:[[:space:]]*[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 5: Anchored inline fallback
        if [[ -z "$level" ]]; then
            level=$(grep -E '^[Ll]evel[: ]+[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        echo "$level"
    fi
}

# Count user stories in spec.md
_complexity_count_user_stories() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    if [[ -f "$spec_file" ]]; then
        local count
        count=$(grep -cE "^### (User Story|US-)" "$spec_file" 2>/dev/null || true)
        echo "${count:-0}"
    else
        echo "0"
    fi
}

# Count acceptance scenarios in spec.md
_complexity_count_acceptance_scenarios() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    if [[ -f "$spec_file" ]]; then
        local count
        count=$(grep -cE "\*\*Given\*\*|^[[:space:]]*[0-9]+\.[[:space:]]+Given\b" "$spec_file" 2>/dev/null || true)
        echo "${count:-0}"
    else
        echo "0"
    fi
}

# Count phases in plan.md
_complexity_count_phases() {
    local folder="$1"
    local plan_file="$folder/plan.md"
    if [[ -f "$plan_file" ]]; then
        local count
        count=$(grep -cE "^##+[[:space:]]+Phase\b" "$plan_file" 2>/dev/null || true)
        echo "${count:-0}"
    else
        echo "0"
    fi
}

# Count tasks in tasks.md
_complexity_count_tasks() {
    local folder="$1"
    local tasks_file="$folder/tasks.md"
    if [[ -f "$tasks_file" ]]; then
        local count
        count=$(grep -cE "^- \[[ xX]\][[:space:]]+" "$tasks_file" 2>/dev/null || true)
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

    RULE_NAME="COMPLEXITY_MATCH"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local warnings=()

    # Get declared level from spec.md
    local declared_level
    declared_level=$(_complexity_get_declared_level "$folder")
    if [[ -z "$declared_level" ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No declared level found in spec.md (using inferred level)"
        return 0
    fi

    # Get content counts
    local story_count scenario_count phase_count task_count
    story_count=$(_complexity_count_user_stories "$folder")
    scenario_count=$(_complexity_count_acceptance_scenarios "$folder")
    phase_count=$(_complexity_count_phases "$folder")
    task_count=$(_complexity_count_tasks "$folder")

    # Define minimum signal thresholds per level.
    # Keep these intentionally conservative to avoid false warnings on current templates.
    local min_phases min_tasks
    case "$declared_level" in
        1)
            min_phases=1
            min_tasks=3
            ;;
        2)
            min_phases=2
            min_tasks=4
            ;;
        3|3+)
            min_phases=2
            min_tasks=5
            ;;
        *)
            # Unknown level - skip checks
            RULE_STATUS="pass"
            RULE_MESSAGE="Unknown level '$declared_level' - skipping complexity checks"
            return 0
            ;;
    esac

    # Check phase count
    if [[ "$phase_count" -lt "$min_phases" ]]; then
        warnings+=("Phases ($phase_count) below minimum ($min_phases) for Level $declared_level")
    fi

    # Check task count
    if [[ "$task_count" -lt "$min_tasks" ]]; then
        warnings+=("Tasks ($task_count) below minimum ($min_tasks) for Level $declared_level")
    fi

    # ───────────────────────────────────────────────────────────────
    # 3. RESULTS
    # ───────────────────────────────────────────────────────────────

    if [[ ${#warnings[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="Complexity level consistent with content (Level $declared_level; phases=$phase_count, tasks=$task_count, stories=$story_count, scenarios=$scenario_count)"
    else
        RULE_STATUS="warn"
        RULE_MESSAGE="Content metrics may not match declared Level $declared_level"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Review declared level or adjust content to match expectations"
    fi

    return 0
}

# Exit codes:
#   0 - Success

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

_section_expected_spec_h2() {
    local level="$1"
    local contract_json="$2"
    node - "$level" "$contract_json" <<'NODE'
const [level, raw] = process.argv.slice(2);
const contract = JSON.parse(raw);
const count = Object.entries(contract.sectionGates || {})
  .filter(([, levels]) => Array.isArray(levels) && levels.includes(level))
  .length;
process.stdout.write(String(count || 5));
NODE
}

_section_expected_template_h2() {
    local helper_script="$1"
    local level="$2"
    local basename="$3"
    local contract_json
    contract_json="$(node "$helper_script" contract "$level" "$basename" 2>/dev/null)" || {
        echo "0"
        return 0
    }
    node - "$contract_json" <<'NODE'
const contract = JSON.parse(process.argv[2]);
process.stdout.write(String((contract.headerRules || []).length));
NODE
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

    # Phase-parent early branch: skip Level-N section-count expectations at phase parents.
    # The lean phase-parent template intentionally carries fewer sections (manifest only);
    # the full Level-N section count is not the right contract here.
    if is_phase_parent "$folder"; then
        RULE_STATUS="info"
        RULE_MESSAGE="Phase parent: section-count enforcement skipped (lean trio policy)"
        return 0
    fi

    local warnings=()
    local errors=()
    local rule_dir helper_script
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    helper_script="$rule_dir/../utils/template-structure.js"

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

    # Define minimum section expectations from the shared Level contract.
    local min_spec_h2 min_plan_h2 min_requirements min_scenarios
    local contract_json
    contract_json="$(node "$helper_script" level-contract "$declared_level")"
    min_spec_h2="$(_section_expected_spec_h2 "$declared_level" "$contract_json")"
    min_plan_h2="$(_section_expected_template_h2 "$helper_script" "$declared_level" "plan.md")"
    [[ "$min_plan_h2" -eq 0 ]] && min_plan_h2=4

    case "$declared_level" in
        1)
            min_requirements=3
            min_scenarios=2
            ;;
        2)
            min_requirements=5
            min_scenarios=4
            ;;
        3|3+)
            min_requirements=8
            min_scenarios=6
            ;;
        *)
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

    local req_doc
    while IFS= read -r req_doc; do
        [[ -z "$req_doc" || "$req_doc" == "implementation-summary.md" ]] && continue
        if [[ ! -f "$folder/$req_doc" ]]; then
            errors+=("Level $declared_level requires $req_doc")
        fi
    done < <(node "$helper_script" docs "$declared_level")

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

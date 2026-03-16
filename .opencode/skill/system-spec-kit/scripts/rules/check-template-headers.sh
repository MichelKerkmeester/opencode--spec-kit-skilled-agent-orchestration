#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-TEMPLATE-HEADERS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: TEMPLATE_HEADERS
# Severity: warn
# Description: Checks that spec document section headers match the expected template structure

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="TEMPLATE_HEADERS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local -a warnings=()
    local files_checked=0

    # ─── Header expectations per file type ─────────────────────
    # spec.md (Level 1+): numbered headers
    local -a spec_headers=(
        "1. METADATA"
        "2. PROBLEM & PURPOSE"
        "3. SCOPE"
        "4. REQUIREMENTS"
        "5. SUCCESS CRITERIA"
        "6. RISKS & DEPENDENCIES"
        "7. OPEN QUESTIONS"
    )

    # checklist.md (Level 2+): unnumbered headers
    local -a checklist_headers=(
        "Verification Protocol"
        "Pre-Implementation"
        "Code Quality"
        "Testing"
        "Security"
        "Documentation"
        "File Organization"
        "Verification Summary"
    )

    # plan.md (Level 1+): numbered headers
    local -a plan_headers=(
        "1. SUMMARY"
        "2. QUALITY GATES"
        "3. ARCHITECTURE"
        "4. IMPLEMENTATION PHASES"
        "5. TESTING STRATEGY"
        "6. DEPENDENCIES"
        "7. ROLLBACK PLAN"
    )

    # tasks.md (Level 1+): mixed headers
    local -a tasks_headers=(
        "Task Notation"
        "Completion Criteria"
        "Cross-References"
    )

    # ─── Check each file type ──────────────────────────────────

    check_headers() {
        local file="$1"
        local display_name="$2"
        shift 2
        local -a expected=("$@")

        if [[ ! -f "$file" ]]; then
            return
        fi

        ((files_checked++)) || true

        for header in "${expected[@]}"; do
            if ! grep -qF "## $header" "$file" 2>/dev/null; then
                warnings+=("$display_name: Missing required section header '## $header'")
            fi
        done
    }

    # spec.md
    check_headers "$folder/spec.md" "spec.md" "${spec_headers[@]}"

    # plan.md
    check_headers "$folder/plan.md" "plan.md" "${plan_headers[@]}"

    # tasks.md
    check_headers "$folder/tasks.md" "tasks.md" "${tasks_headers[@]}"

    # checklist.md (only if level >= 2 or file exists)
    if [[ -f "$folder/checklist.md" ]]; then
        check_headers "$folder/checklist.md" "checklist.md" "${checklist_headers[@]}"

        # CHK-NNN format check: verify checklist items use CHK-NNN prefix
        local bare_priority_count=0
        local chk_count=0
        bare_priority_count=$(grep -cE '^\s*-\s*\[[ x]\]\s*\*\*\[P[012]\]\*\*' "$folder/checklist.md" 2>/dev/null || echo "0")
        chk_count=$(grep -cE '^\s*-\s*\[[ x]\]\s*CHK-[0-9]+' "$folder/checklist.md" 2>/dev/null || echo "0")

        if [[ "$bare_priority_count" -gt 0 && "$chk_count" -eq 0 ]]; then
            warnings+=("checklist.md: Uses **[P0]** format instead of CHK-NNN [P0] identifiers ($bare_priority_count items without CHK prefix)")
        elif [[ "$bare_priority_count" -gt 0 ]]; then
            warnings+=("checklist.md: $bare_priority_count item(s) use **[P0]** format instead of CHK-NNN [P0]")
        fi

        # H1 format check: should start with "Verification Checklist:"
        local h1_line
        h1_line=$(grep -m1 '^# ' "$folder/checklist.md" 2>/dev/null || true)
        if [[ -n "$h1_line" ]] && ! echo "$h1_line" | grep -qF "# Verification Checklist:"; then
            warnings+=("checklist.md: H1 should start with '# Verification Checklist:' (found: '${h1_line:0:60}')")
        fi
    fi

    # ─── Results ───────────────────────────────────────────────

    if [[ $files_checked -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No spec documents found to check (skipped)"
        return
    fi

    if [[ ${#warnings[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="${#warnings[@]} template header deviation(s) in $files_checked file(s)"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="1. Compare section headers against templates in .opencode/skill/system-spec-kit/templates/
2. Ensure all required ## headers are present with correct text
3. Use CHK-NNN [P0/P1/P2] format for checklist items"
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="All template headers match in $files_checked file(s)"
    fi
}

# Exit codes:
#   0 - Success

#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-TEMPLATE-HEADERS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: TEMPLATE_HEADERS
# Severity: error for structural deviations, warning for non-blocking extras.
# Description: Checks that spec document section headers match the expected template structure

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="TEMPLATE_HEADERS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local rule_dir
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local helper_script="$rule_dir/../utils/template-structure.js"

    local -a errors=()
    local -a warnings=()
    local files_checked=0

    count_matches() {
        local pattern="$1"
        local file="$2"
        local count
        count=$({ grep -E "$pattern" "$file" 2>/dev/null || true; } | wc -l | tr -d '[:space:]')
        echo "${count:-0}"
    }

    compare_headers() {
        local file="$1"
        local display_name="$2"

        if [[ ! -f "$file" ]]; then
            return
        fi

        ((files_checked++)) || true

        local compare_output
        compare_output=$(node "$helper_script" compare "$level" "$(basename "$file")" "$file" headers 2>/dev/null || true)
        if ! grep -q $'^supported\ttrue$' <<< "$compare_output"; then
            return
        fi

        while IFS=$'\t' read -r kind value; do
            case "$kind" in
                missing_header)
                    errors+=("$display_name: Missing required section header matching '$value'")
                    ;;
                out_of_order_header)
                    errors+=("$display_name: Required section header out of order '$value'")
                    ;;
                extra_header)
                    warnings+=("$display_name: Extra custom section header '## $value' does not exist in the active template")
                    ;;
            esac
        done <<< "$compare_output"
    }

    compare_headers "$folder/spec.md" "spec.md"
    compare_headers "$folder/plan.md" "plan.md"
    compare_headers "$folder/tasks.md" "tasks.md"
    compare_headers "$folder/checklist.md" "checklist.md"
    compare_headers "$folder/decision-record.md" "decision-record.md"
    compare_headers "$folder/implementation-summary.md" "implementation-summary.md"

    if [[ -f "$folder/checklist.md" ]]; then
        local bare_priority_count=0
        local chk_count=0
        bare_priority_count=$(count_matches '^\s*-\s*\[[ x]\]\s*\*\*\[P[012]\]\*\*' "$folder/checklist.md")
        chk_count=$(count_matches '^\s*-\s*\[[ x]\]\s*CHK-[0-9]+' "$folder/checklist.md")

        if [[ "$bare_priority_count" -gt 0 && "$chk_count" -eq 0 ]]; then
            errors+=("checklist.md: Uses **[P0]** format instead of CHK-NNN [P0] identifiers ($bare_priority_count items without CHK prefix)")
        elif [[ "$bare_priority_count" -gt 0 ]]; then
            errors+=("checklist.md: $bare_priority_count item(s) use **[P0]** format instead of CHK-NNN [P0]")
        fi

        local h1_line
        h1_line=$(grep -m1 '^# ' "$folder/checklist.md" 2>/dev/null || true)
        if [[ -n "$h1_line" ]] && ! grep -qF "# Verification Checklist:" <<< "$h1_line"; then
            errors+=("checklist.md: H1 should start with '# Verification Checklist:' (found: '${h1_line:0:60}')")
        fi
    fi

    if [[ $files_checked -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No spec documents found to check (skipped)"
        return
    fi

    if [[ ${#errors[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="${#errors[@]} structural template deviation(s) found in $files_checked file(s)"
        RULE_DETAILS=("${errors[@]}")
        if [[ ${#warnings[@]} -gt 0 ]]; then
            RULE_DETAILS+=("${warnings[@]}")
        fi
        RULE_REMEDIATION="1. Copy the exact H1/H2 structure from the active template in .opencode/skill/system-spec-kit/templates/
2. Restore missing or reordered required sections before custom sections
3. Use '# Verification Checklist:' and CHK-NNN [P0/P1/P2] format for checklist files"
        return
    fi

    if [[ ${#warnings[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="${#warnings[@]} non-blocking template header deviation(s) in $files_checked file(s)"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Move custom sections after the required template structure or document the deviation explicitly"
        return
    fi

    RULE_STATUS="pass"
    RULE_MESSAGE="All template headers match in $files_checked file(s)"
}

# Exit codes:
#   0 - Success

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
#
# F-009-B4-02: A second checkbox on the same line is no longer treated
# as evidence. Only explicit semantic markers count.
# F-009-B4-03: Priority parsing is now sourced from
# scripts/lib/check-priority-helper.sh so this rule shares its regex
# with check-priority-tags.sh.

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

# F-009-B4-03: Source the shared priority helper. BASH_SOURCE-relative path
# keeps the resolution stable when this rule is invoked from validate.sh.
_check_evidence_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/check-priority-helper.sh
source "${_check_evidence_dir}/../lib/check-priority-helper.sh"

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

        # F-009-B4-03: Detect priority section headers via the shared helper.
        local _detected_priority=""
        if detect_priority_section_header "$line" _detected_priority; then
            current_priority="$_detected_priority"
            continue
        fi

        # Check completed items: - [x] or - [X]
        if [[ "$line" =~ ^[[:space:]]*-[[:space:]]\[[xX]\] ]]; then
            local item_priority=""
            local _inline_priority=""
            # F-009-B4-03: Reuse the shared inline tag detector.
            if detect_priority_inline_tag "$line" _inline_priority; then
                item_priority="$_inline_priority"
            elif [[ -n "$current_priority" ]]; then
                item_priority="$current_priority"
            fi

            [[ "$item_priority" == "P2" ]] && continue

            local task_text="${line#*] }"
            local has_evidence=false
            local line_lower
            line_lower=$(echo "$line" | tr '[:upper:]' '[:lower:]')

            # Evidence patterns: explicit semantic markers only.
            # F-009-B4-02: The same-line second-checkbox heuristic was
            # removed because multi-task lines (e.g. "- [x] foo / - [x] bar"
            # collapsed onto one author-formatted line) produced false
            # positives that masked missing evidence on real items.
            [[ "$line_lower" == *"[evidence:"* ]] && has_evidence=true
            [[ "$line_lower" == *"| evidence:"* ]] && has_evidence=true
            # Unicode checkmarks: ✓ ✔ ☑ ✅
            if [[ "$line" == *"✓"* || "$line" == *"✔"* || "$line" == *"☑"* || "$line" == *"✅"* ]]; then
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

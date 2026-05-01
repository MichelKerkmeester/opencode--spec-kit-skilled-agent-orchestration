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
    local contract_level="$level"
    if is_phase_parent "$folder"; then
        if [[ -f "$folder/spec.md" ]] \
            && grep -q "<!-- ANCHOR:phase-map -->" "$folder/spec.md" 2>/dev/null \
            && [[ ! -f "$folder/plan.md" ]] \
            && [[ ! -f "$folder/tasks.md" ]] \
            && [[ ! -f "$folder/checklist.md" ]] \
            && [[ ! -f "$folder/decision-record.md" ]] \
            && [[ ! -f "$folder/implementation-summary.md" ]]; then
            contract_level="phase"
        else
            contract_level="$level"
        fi
    fi

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
        compare_output=$(node "$helper_script" compare "$contract_level" "$(basename "$file")" "$file" headers 2>/dev/null || true)
        if ! grep -q $'^supported\ttrue$' <<< "$compare_output"; then
            return
        fi

        # F-009-B4-04: Preserve helper extra_header results and classify by
        # document position. The helper emits required_header lines first
        # (in expected order) and extra_header lines at the end. For
        # classification we need to walk the actual document and record
        # which extras precede the last required header (mid-document drift,
        # warning) vs. follow it (custom packet extensions, accepted).
        local last_required_normalized=""
        local -a required_normalized=()
        while IFS=$'\t' read -r kind value; do
            if [[ "$kind" == "required_header" ]]; then
                # Build normalized expected sequence so we can scan the
                # document in document order below.
                required_normalized+=("$value")
                last_required_normalized="$value"
            fi
        done <<< "$compare_output"

        # Build the document's actual H2 sequence (basic parse, mirrors
        # the helper's normalization but in shell to avoid a second JS hop).
        local -a actual_raw=()
        local in_fence=0
        while IFS= read -r doc_line || [[ -n "$doc_line" ]]; do
            if [[ "$doc_line" =~ ^[[:space:]]*(\`\`\`|~~~) ]]; then
                in_fence=$(( in_fence == 0 ? 1 : 0 ))
                continue
            fi
            (( in_fence == 1 )) && continue
            if [[ "$doc_line" =~ ^##[[:space:]]+(.+)$ ]]; then
                actual_raw+=("${BASH_REMATCH[1]}")
            fi
        done < "$file"

        while IFS=$'\t' read -r kind value; do
            case "$kind" in
                missing_header)
                    errors+=("$display_name: Missing required section header matching '$value'")
                    ;;
                out_of_order_header)
                    errors+=("$display_name: Required section header out of order '$value'")
                    ;;
                extra_header)
                    # F-009-B4-04: Classify extras by position in the actual
                    # document. If the extra header appears AFTER the last
                    # required header, it is a packet extension (accepted).
                    # If it appears BEFORE, it is mid-document drift
                    # (warning, surfaces but does not block).
                    local extra_index=-1
                    local last_required_index=-1
                    local idx=0
                    for actual in "${actual_raw[@]}"; do
                        if [[ "$actual" == "$value" ]]; then
                            extra_index=$idx
                        fi
                        # Match against any required name (normalized comparison
                        # by uppercase) — last occurrence wins so we anchor on
                        # the last required header's position.
                        local actual_upper
                        actual_upper=$(printf '%s' "$actual" | tr '[:lower:]' '[:upper:]')
                        actual_upper="${actual_upper// /' '}"
                        for req in "${required_normalized[@]}"; do
                            local req_upper
                            req_upper=$(printf '%s' "$req" | tr '[:lower:]' '[:upper:]')
                            if [[ "$actual_upper" == "$req_upper" ]]; then
                                last_required_index=$idx
                                break
                            fi
                        done
                        idx=$((idx + 1))
                    done

                    if (( extra_index >= 0 && last_required_index >= 0 && extra_index < last_required_index )); then
                        warnings+=("$display_name: Mid-document extra header '$value' appears before the last required section (position $((extra_index + 1)) of ${#actual_raw[@]})")
                    fi
                    # Headers after the last required structure remain valid
                    # packet extensions; no message emitted.
                    ;;
            esac
        done <<< "$compare_output"
    }

    while IFS= read -r contract_doc; do
        [[ -z "$contract_doc" ]] && continue
        compare_headers "$folder/$contract_doc" "$contract_doc"
    done < <(node "$helper_script" docs "$contract_level")

    if [[ -f "$folder/checklist.md" ]]; then
        local bare_priority_count=0
        local chk_count=0
        # F-009-B4-05: Match both lowercase and uppercase X in checkbox class
        # so checklists exported from external tools that use [X] do not
        # produce false-positive missing-CHK errors.
        bare_priority_count=$(count_matches '^\s*-\s*\[[ xX]\]\s*\*\*\[P[012]\]\*\*' "$folder/checklist.md")
        chk_count=$(count_matches '^\s*-\s*\[[ xX]\]\s*CHK-[0-9]+' "$folder/checklist.md")

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
        RULE_REMEDIATION="1. Copy the exact H1/H2 structure from the active Level template
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

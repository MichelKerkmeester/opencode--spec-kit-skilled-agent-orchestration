#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-ANCHORS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: ANCHORS_VALID
# Severity: error
# Description: Checks that anchor pairs in memory files and spec documents are properly matched

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    local rule_dir
    rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local helper_script="$rule_dir/../utils/template-structure.js"

    RULE_NAME="ANCHORS_VALID"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    local -a all_files=()

# ───────────────────────────────────────────────────────────────
# 2. COLLECT FILES TO VALIDATE
# ───────────────────────────────────────────────────────────────

    # Collect memory files
    local memory_dir="$folder/memory"
    if [[ -d "$memory_dir" ]]; then
        while IFS= read -r -d '' file; do
            all_files+=("$file")
        done < <(find "$memory_dir" -maxdepth 1 -name "*.md" -type f -print0 2>/dev/null)
    fi

    # Collect spec document files (spec 129: anchor tags in spec docs)
    local -a spec_doc_names=("spec.md" "plan.md" "tasks.md" "checklist.md" "decision-record.md" "implementation-summary.md")
    for doc_name in "${spec_doc_names[@]-}"; do
        local doc_path="$folder/$doc_name"
        if [[ -f "$doc_path" ]]; then
            all_files+=("$doc_path")
        fi
    done

    if [[ ${#all_files[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No memory or spec document files found (skipped)"
        return
    fi

# ───────────────────────────────────────────────────────────────
# 3. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    local -a errors=()
    local -a warnings=()
    local -a missing_anchors=()
    local file_count=0

    # Create temp files once before the loop; cleaned up at function end.
    local tmp_opens tmp_closes
    tmp_opens=$(mktemp)
    tmp_closes=$(mktemp)

    # T007: Check that major spec docs have at least 1 ANCHOR tag
    local -a major_docs=("spec.md" "plan.md" "tasks.md" "checklist.md" "decision-record.md")
    for doc_name in "${major_docs[@]-}"; do
        local doc_path="$folder/$doc_name"
        if [[ -f "$doc_path" ]]; then
            local anchor_count
            anchor_count=$(grep -c '<!-- ANCHOR:' "$doc_path" 2>/dev/null || echo "0")
            # Fix: grep -c might return multiple lines if there are errors, take first line only
            anchor_count=$(echo "$anchor_count" | head -1)
            if [[ "$anchor_count" -eq 0 ]]; then
                missing_anchors+=("$doc_name: No ANCHOR tags found (required for structured retrieval)")
            fi
        fi
    done

    for file in "${all_files[@]-}"; do
        ((file_count++)) || true
        local filename
        filename=$(basename "$file")

        # Use parent dir name for disambiguation (memory/foo.md vs spec.md)
        local parent_dir
        parent_dir=$(basename "$(dirname "$file")")
        local display_name="$filename"
        if [[ "$parent_dir" == "memory" ]]; then
            display_name="memory/$filename"
        fi

        # Detect malformed opening anchor syntax.
        while IFS=: read -r line_num line_text; do
            [[ -z "$line_num" ]] && continue
            if ! printf '%s\n' "$line_text" | grep -Eq '<!--[[:space:]]*ANCHOR:[[:space:]]*[A-Za-z0-9][A-Za-z0-9_-]*[[:space:]]*-->'; then
                errors+=("$display_name:$line_num: Malformed opening anchor syntax")
            fi
        done < <(grep -n '<!--[[:space:]]*ANCHOR:' "$file" 2>/dev/null || true)

        # Detect malformed closing anchor syntax.
        while IFS=: read -r line_num line_text; do
            [[ -z "$line_num" ]] && continue
            if ! printf '%s\n' "$line_text" | grep -Eq '<!--[[:space:]]*/ANCHOR:[[:space:]]*[A-Za-z0-9][A-Za-z0-9_-]*[[:space:]]*-->'; then
                errors+=("$display_name:$line_num: Malformed closing anchor syntax")
            fi
        done < <(grep -n '<!--[[:space:]]*/ANCHOR:' "$file" 2>/dev/null || true)

        # Extract opening anchors: <!-- ANCHOR:id --> format: "linenum id"
        { grep -nE '<!--[[:space:]]*ANCHOR:[[:space:]]*[A-Za-z0-9][A-Za-z0-9_-]*[[:space:]]*-->' "$file" 2>/dev/null || true; } | \
            sed -nE 's/^([0-9]+):.*ANCHOR:[[:space:]]*([A-Za-z0-9][A-Za-z0-9_-]*).*/\1 \2/p' > "$tmp_opens"

        # Extract closing anchors: <!-- /ANCHOR:id -->
        { grep -nE '<!--[[:space:]]*/ANCHOR:[[:space:]]*[A-Za-z0-9][A-Za-z0-9_-]*[[:space:]]*-->' "$file" 2>/dev/null || true; } | \
            sed -nE 's/^([0-9]+):.*\/ANCHOR:[[:space:]]*([A-Za-z0-9][A-Za-z0-9_-]*).*/\1 \2/p' > "$tmp_closes"

        local all_ids
        all_ids=$(awk '{print $2}' "$tmp_opens" "$tmp_closes" 2>/dev/null | sort -u)

        local id
        for id in $all_ids; do
            [[ -z "$id" ]] && continue

            local opens closes open_line close_line
            opens=$(awk -v id="$id" '$2 == id {count++} END {print count+0}' "$tmp_opens")
            closes=$(awk -v id="$id" '$2 == id {count++} END {print count+0}' "$tmp_closes")

            if [[ "$opens" -gt "$closes" ]]; then
                open_line=$(awk -v id="$id" '$2 == id {print $1; exit}' "$tmp_opens")
                errors+=("$display_name:$open_line: Unclosed anchor '$id'")
            elif [[ "$closes" -gt "$opens" ]]; then
                close_line=$(awk -v id="$id" '$2 == id {print $1; exit}' "$tmp_closes")
                errors+=("$display_name:$close_line: Orphaned closing anchor '$id'")
            fi
        done

    done

    rm -f "$tmp_opens" "$tmp_closes"

# ───────────────────────────────────────────────────────────────
# 4. REQUIRED ANCHOR ORDER VALIDATION
# ───────────────────────────────────────────────────────────────

    local -a missing_required=()
    local -a out_of_order_required=()

    compare_required_anchors() {
        local file="$1"
        local display_name="$2"

        if [[ ! -f "$file" ]]; then
            return
        fi

        local compare_output
        compare_output=$(node "$helper_script" compare "$level" "$(basename "$file")" "$file" anchors 2>/dev/null || true)
        if ! grep -q $'^supported\ttrue$' <<< "$compare_output"; then
            return
        fi

        while IFS=$'\t' read -r kind value; do
            case "$kind" in
                missing_anchor)
                    missing_required+=("$display_name: Missing required anchor '$value'")
                    ;;
                out_of_order_anchor)
                    out_of_order_required+=("$display_name: Required anchor out of order '$value'")
                    ;;
                extra_anchor)
                    warnings+=("$display_name: Extra custom anchor '$value' does not exist in the active template")
                    ;;
            esac
        done <<< "$compare_output"
    }

    compare_required_anchors "$folder/spec.md" "spec.md"
    compare_required_anchors "$folder/plan.md" "plan.md"
    compare_required_anchors "$folder/tasks.md" "tasks.md"
    compare_required_anchors "$folder/checklist.md" "checklist.md"
    compare_required_anchors "$folder/decision-record.md" "decision-record.md"
    compare_required_anchors "$folder/implementation-summary.md" "implementation-summary.md"

# ───────────────────────────────────────────────────────────────
# 5. RESULTS
# ───────────────────────────────────────────────────────────────

    local has_errors=false

    if [[ ${#missing_anchors[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="ANCHOR tags missing in ${#missing_anchors[@]} major spec document(s)"
        RULE_DETAILS+=("${missing_anchors[@]}")
        has_errors=true
    fi

    if [[ ${#errors[@]} -gt 0 ]]; then
        if [[ "$has_errors" == true ]]; then
            RULE_MESSAGE="$RULE_MESSAGE; Found ${#errors[@]} anchor mismatch(es)"
        else
            RULE_STATUS="fail"
            RULE_MESSAGE="Found ${#errors[@]} anchor mismatch(es)"
        fi
        RULE_DETAILS+=("${errors[@]}")
        has_errors=true
    fi

    if [[ ${#missing_required[@]} -gt 0 ]]; then
        if [[ "$has_errors" == true ]]; then
            RULE_MESSAGE="$RULE_MESSAGE; ${#missing_required[@]} required anchor(s) missing"
        else
            RULE_STATUS="fail"
            RULE_MESSAGE="${#missing_required[@]} required anchor(s) missing"
        fi
        RULE_DETAILS+=("${missing_required[@]}")
        has_errors=true
    fi

    if [[ ${#out_of_order_required[@]} -gt 0 ]]; then
        if [[ "$has_errors" == true ]]; then
            RULE_MESSAGE="$RULE_MESSAGE; ${#out_of_order_required[@]} required anchor(s) out of order"
        else
            RULE_STATUS="fail"
            RULE_MESSAGE="${#out_of_order_required[@]} required anchor(s) out of order"
        fi
        RULE_DETAILS+=("${out_of_order_required[@]}")
        has_errors=true
    fi

    if [[ "$has_errors" == false ]]; then
        if [[ ${#warnings[@]} -gt 0 ]]; then
            RULE_STATUS="warn"
            RULE_MESSAGE="${#warnings[@]} non-blocking anchor deviation(s) in $file_count file(s)"
            RULE_DETAILS+=("${warnings[@]}")
        else
            RULE_STATUS="pass"
            RULE_MESSAGE="All anchor pairs valid in $file_count file(s)"
        fi
    else
        RULE_REMEDIATION="1. Add ANCHOR tags to major spec docs (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
2. Ensure each <!-- ANCHOR:id --> has matching <!-- /ANCHOR:id -->
3. Restore the active template's required anchor order before custom anchors"
    fi
}

# Exit codes:
#   0 - Success

#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-PHASE-LINKS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

# Rule: PHASE_LINKS
# Severity: warn
# Description: Validates phase parent-child back-references
#   - Only runs if folder contains [0-9][0-9][0-9]-*/ child folders
#   - Checks parent spec.md has Phase Documentation Map section
#   - Checks each child spec.md has parent back-reference (../spec.md)
#   - Checks predecessor/successor links are consistent

# ───────────────────────────────────────────────────────────────
# 1. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="PHASE_LINKS"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

# ───────────────────────────────────────────────────────────────
# 2. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    # TODO: Parse Predecessor/Successor metadata table rows instead of grepping for phase name presence. Current approach may pass with swapped, stale, or duplicated adjacency metadata. See review finding F-035.

    # Check if this folder has phase children
    local phase_dirs=()
    for phase_dir in "$folder"/[0-9][0-9][0-9]-*/; do
        [[ -d "$phase_dir" ]] && phase_dirs+=("${phase_dir%/}")
    done

    # No phases = skip (pass with info message)
    if [[ ${#phase_dirs[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="No phase folders detected (non-phased spec)"
        return 0
    fi

    local -a issues=()

    # Check 1: Parent spec.md has Phase Documentation Map
    if [[ -f "$folder/spec.md" ]]; then
        if ! grep -qi "PHASE DOCUMENTATION MAP" "$folder/spec.md" 2>/dev/null; then
            issues+=("Parent spec.md missing 'PHASE DOCUMENTATION MAP' section")
        fi
    else
        issues+=("Parent spec.md not found (required for phase parent)")
    fi

    # Check 2: Each child has spec.md with parent back-reference
    for phase_dir in "${phase_dirs[@]}"; do
        local phase_name
        phase_name=$(basename "$phase_dir")
        local child_spec="$phase_dir/spec.md"

        if [[ -f "$child_spec" ]]; then
            # Check for parent reference: ../spec.md in table row OR parent: field in YAML
            if ! grep -q '\.\./spec\.md' "$child_spec" 2>/dev/null && \
               ! grep -qi '^| \*\*Parent Spec\*\*' "$child_spec" 2>/dev/null && \
               ! grep -qi '^parent:' "$child_spec" 2>/dev/null; then
                issues+=("$phase_name/spec.md missing parent back-reference (expected: '| **Parent Spec** | ../spec.md |' or 'parent:' field)")
            fi

            # Validate that the referenced parent path actually exists
            local parent_ref
            parent_ref=$(grep -oE '\.\./spec\.md' "$child_spec" 2>/dev/null | head -1 || true)
            if [[ -n "$parent_ref" ]]; then
                local resolved_parent="$phase_dir/$parent_ref"
                if [[ ! -f "$resolved_parent" ]]; then
                    issues+=("$phase_name/spec.md references parent '$parent_ref' but file does not exist")
                fi
            fi
        else
            issues+=("$phase_name/ missing spec.md")
        fi
    done

    # Check 3: Predecessor references (each child except first should reference predecessor)
    local prev_name=""
    for phase_dir in "${phase_dirs[@]}"; do
        local phase_name
        phase_name=$(basename "$phase_dir")
        local child_spec="$phase_dir/spec.md"

        if [[ -n "$prev_name" && -f "$child_spec" ]]; then
            if ! grep -qF "$prev_name" "$child_spec" 2>/dev/null; then
                issues+=("$phase_name/spec.md missing predecessor reference ($prev_name)")
            fi
        fi

        prev_name="$phase_name"
    done

    # Check 4: Successor references (each child except last should reference successor)
    local total_phases=${#phase_dirs[@]}
    for (( _idx=0; _idx<total_phases-1; _idx++ )); do
        local current_dir="${phase_dirs[$_idx]}"
        local next_dir="${phase_dirs[$((_idx + 1))]}"
        local current_name
        current_name=$(basename "$current_dir")
        local next_name
        next_name=$(basename "$next_dir")
        local current_spec="$current_dir/spec.md"

        if [[ -f "$current_spec" ]]; then
            if ! grep -qF "$next_name" "$current_spec" 2>/dev/null; then
                issues+=("$current_name/spec.md missing successor reference ($next_name)")
            fi
        fi
    done

# ───────────────────────────────────────────────────────────────
# 3. RESULTS
# ───────────────────────────────────────────────────────────────

    if [[ ${#issues[@]} -eq 0 ]]; then
        RULE_STATUS="pass"
        RULE_MESSAGE="Phase links valid (${#phase_dirs[@]} phases verified)"
    else
        RULE_STATUS="fail"
        RULE_MESSAGE="${#issues[@]} phase link issue(s) found"
        RULE_DETAILS=("${issues[@]}")
        RULE_REMEDIATION="Fix phase back-references. Each child spec.md needs one of: '| **Parent Spec** | ../spec.md |' table row, 'parent:' YAML field, or '../spec.md' text reference. Parent spec.md needs a 'PHASE DOCUMENTATION MAP' section."
    fi
}

# Exit codes:
#   0 - Success

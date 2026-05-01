#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# RULE: CHECK-LEVEL-MATCH
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

_level_match_rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
_level_match_helper="$_level_match_rule_dir/../utils/template-structure.js"
unset _level_match_rule_dir

# Rule: LEVEL_MATCH
# Severity: error
# Description: Validates that the declared level is consistent across all
#   Spec folder files, and required files exist for the declared level.

# ───────────────────────────────────────────────────────────────
# 1. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Extract level from a file's metadata section
_level_extract_from_file() {
    local file="$1"
    if [[ -f "$file" ]]; then
        local level=""

        # Pattern 0: SPECKIT_LEVEL marker
        level=$(grep -oE '<!-- SPECKIT_LEVEL: *[123]\+? *-->' "$file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)

        # Pattern 1: Metadata bullet format
        if [[ -z "$level" ]]; then
            level=$(grep -E '^\- \*\*Level\*\*:\s*[123]\+?' "$file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 2: Table format with bold
        if [[ -z "$level" ]]; then
            level=$(grep -E '^\|\s*\*\*Level\*\*\s*\|\s*[123]\+?\s*\|' "$file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 3: Table format without bold
        if [[ -z "$level" ]]; then
            level=$(grep -E '^\|\s*Level\s*\|\s*[123]\+?\s*\|' "$file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 4: YAML frontmatter
        if [[ -z "$level" ]]; then
            level=$(grep -E '^level:\s*[123]\+?' "$file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 5: Anchored inline fallback
        if [[ -z "$level" ]]; then
            level=$(grep -E '^[Ll]evel[: ]+[123]\+?' "$file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        if [[ -n "$level" ]]; then
            echo "$level"
            return 0
        fi
    fi
    echo ""
}

# Detect whether a file contains an explicit but invalid level declaration
_level_has_invalid_declaration() {
    local file="$1"
    [[ -f "$file" ]] || return 1

    local line=""

    line=$(grep -E '<!--[[:space:]]*SPECKIT_LEVEL:' "$file" 2>/dev/null | head -1 || true)
    if [[ -n "$line" ]] && ! echo "$line" | grep -qE '<!--[[:space:]]*SPECKIT_LEVEL:[[:space:]]*([123]\+?)[[:space:]]*-->'; then
        return 0
    fi

    line=$(grep -E '^\- \*\*Level\*\*:' "$file" 2>/dev/null | head -1 || true)
    if [[ -n "$line" ]] && ! echo "$line" | grep -qE '^\-[[:space:]]+\*\*Level\*\*:[[:space:]]*([123]\+?)[[:space:]]*$'; then
        return 0
    fi

    line=$(grep -E '^\|\s*\*\*Level\*\*\s*\|' "$file" 2>/dev/null | head -1 || true)
    if [[ -n "$line" ]] && ! echo "$line" | grep -qE '^\|[[:space:]]*\*\*Level\*\*[[:space:]]*\|[[:space:]]*([123]\+?)[[:space:]]*\|'; then
        return 0
    fi

    line=$(grep -E '^\|\s*Level\s*\|' "$file" 2>/dev/null | head -1 || true)
    if [[ -n "$line" ]] && ! echo "$line" | grep -qE '^\|[[:space:]]*Level[[:space:]]*\|[[:space:]]*([123]\+?)[[:space:]]*\|'; then
        return 0
    fi

    line=$(grep -E '^level:' "$file" 2>/dev/null | head -1 || true)
    if [[ -n "$line" ]] && ! echo "$line" | grep -qE '^level:[[:space:]]*([123]\+?)[[:space:]]*$'; then
        return 0
    fi

    line=$(grep -E '^[Ll]evel(:[[:space:]]*|[[:space:]]+)[0-9]\+?[[:space:]]*$' "$file" 2>/dev/null | head -1 || true)
    if [[ -n "$line" ]] && ! echo "$line" | grep -qE '^[Ll]evel[: ]+([123]\+?)[[:space:]]*$'; then
        return 0
    fi

    return 1
}

# Check if file should declare level
_level_should_have() {
    local file="$1"
    local basename
    basename=$(basename "$file")

    # These files should have level declarations.
    # NOTE: plan.md is intentionally not required because many valid Level 1
    # Fixtures/specs omit a plan-level declaration while still being consistent.
    case "$basename" in
        spec.md|checklist.md)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

_level_has_implementation_started() {
    local folder="$1"
    if [[ -f "$folder/checklist.md" ]] && grep -qE '\[[xX]\]' "$folder/checklist.md" 2>/dev/null; then
        return 0
    fi
    if [[ -f "$folder/tasks.md" ]] && grep -qE '\[[xX]\]' "$folder/tasks.md" 2>/dev/null; then
        return 0
    fi
    return 1
}

# ───────────────────────────────────────────────────────────────
# 2. MAIN RUN_CHECK FUNCTION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"

    RULE_NAME="LEVEL_MATCH"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""

    # Phase-parent early branch: skip level-match enforcement at phase parents.
    # The parent surface is the lean trio (spec.md, description.json, graph-metadata.json);
    # level is informational only. Real level enforcement happens at child phase folders.
    if is_phase_parent "$folder"; then
        RULE_STATUS="info"
        RULE_MESSAGE="Phase parent: level enforcement skipped (lean trio policy)"
        return 0
    fi

    local warnings=()
    local errors=()

    # Get primary level from spec.md
    local primary_level=""
    if [[ -f "$folder/spec.md" ]]; then
        primary_level=$(_level_extract_from_file "$folder/spec.md")
    fi

    if [[ -z "$primary_level" ]] && _level_has_invalid_declaration "$folder/spec.md"; then
        errors+=("spec.md contains an invalid level declaration (expected 1, 2, 3, or 3+)")
    fi

    if [[ -z "$primary_level" ]]; then
        # Use inferred level if spec.md doesn't declare one
        primary_level="$level"
    fi

    # Check each relevant file for level consistency
    for file in "$folder"/*.md; do
        if [[ -f "$file" ]]; then
            if _level_should_have "$file"; then
                local file_level
                file_level=$(_level_extract_from_file "$file")
                local basename
                basename=$(basename "$file")

                if [[ -n "$file_level" ]]; then
                    if [[ "$file_level" != "$primary_level" ]]; then
                        errors+=("$basename declares Level $file_level, but spec.md declares Level $primary_level")
                    fi
                else
                    if _level_has_invalid_declaration "$file"; then
                        errors+=("$basename contains an invalid level declaration (expected 1, 2, 3, or 3+)")
                    else
                        warnings+=("$basename does not declare a level (expected Level $primary_level)")
                    fi
                fi
            fi
        fi
    done

    # Validate file presence based on the shared Level contract.
    local required_files=()
    local req_file
    while IFS= read -r req_file; do
        [[ -z "$req_file" ]] && continue
        if [[ "$req_file" == "implementation-summary.md" ]] && ! _level_has_implementation_started "$folder"; then
            continue
        fi
        required_files+=("$req_file")
    done < <(node "$_level_match_helper" docs "$primary_level")

    for req_file in "${required_files[@]-}"; do
        if [[ ! -f "$folder/$req_file" ]]; then
            errors+=("Required file missing for Level $primary_level: $req_file")
        fi
    done

    # Check for files that suggest higher level
    if [[ "$primary_level" = "1" ]]; then
        if [[ -f "$folder/decision-record.md" ]]; then
            warnings+=("decision-record.md present but Level 1 declared - consider upgrading level")
        fi
    fi

    # ───────────────────────────────────────────────────────────────
    # 3. RESULTS
    # ───────────────────────────────────────────────────────────────

    if [[ ${#errors[@]} -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Level consistency errors"
        RULE_DETAILS=("${errors[@]-}")
        if [[ -n "${warnings[*]-}" ]]; then
            RULE_DETAILS+=("${warnings[@]}")
        fi
        RULE_REMEDIATION="Ensure all files declare consistent level and required files exist"
    elif [[ ${#warnings[@]} -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="Level consistency warnings"
        RULE_DETAILS=("${warnings[@]}")
        RULE_REMEDIATION="Add level declarations to files or review level assignment"
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="Level consistent across all files (Level $primary_level)"
    fi

    return 0
}

# Exit codes:
#   0 - Success
#   1 - General error

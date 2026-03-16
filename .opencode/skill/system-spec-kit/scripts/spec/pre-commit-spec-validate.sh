#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Pre-Commit Spec Validation
# ───────────────────────────────────────────────────────────────
# Called from .git/hooks/pre-commit to validate staged spec docs.
# Runs fast 6-rule subset of validate.sh on affected spec folders.
#
# Exit codes:
#   0 - pass (or no spec files staged)
#   1 - warnings (mode=warn allows commit)
#   2 - errors (mode=block/strict blocks commit)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

ENFORCE_CONFIG="$REPO_ROOT/.speckit-enforce.yaml"
MODE="warn"
NEW_FOLDER_MODE="block"
CREATED_AFTER=""
FAST_RULES="FILE_EXISTS,LEVEL_DECLARED,FRONTMATTER_VALID,TEMPLATE_SOURCE,ANCHORS_VALID,FOLDER_NAMING"

load_enforcement_config() {
    [[ ! -f "$ENFORCE_CONFIG" ]] && return 0

    # Parse YAML without requiring yq — simple grep-based extraction
    local val
    val=$(grep -E '^\s+mode:\s*' "$ENFORCE_CONFIG" 2>/dev/null | head -1 | sed 's/.*mode:\s*//' | tr -d '[:space:]"'"'" || true)
    [[ -n "$val" ]] && MODE="$val"

    val=$(grep -E '^\s+new_folder_mode:\s*' "$ENFORCE_CONFIG" 2>/dev/null | head -1 | sed 's/.*new_folder_mode:\s*//' | tr -d '[:space:]"'"'" || true)
    [[ -n "$val" ]] && NEW_FOLDER_MODE="$val"

    val=$(grep -E '^\s+created_after:\s*' "$ENFORCE_CONFIG" 2>/dev/null | head -1 | sed 's/.*created_after:\s*//' | tr -d '[:space:]"'"'" || true)
    [[ -n "$val" ]] && CREATED_AFTER="$val"

    # SE-04: Validate YYYY-MM-DD date format
    if [[ -n "$CREATED_AFTER" ]] && ! [[ "$CREATED_AFTER" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        echo "Warning: Invalid created_after date format '$CREATED_AFTER' (expected YYYY-MM-DD), ignoring" >&2
        CREATED_AFTER=""
    fi

    # Parse pre_commit_rules list from config
    local in_rules=false rules_str=""
    while IFS= read -r line; do
        if [[ "$line" =~ ^pre_commit_rules: ]]; then
            in_rules=true; continue
        elif $in_rules; then
            # SE-02: Skip comment lines and blank lines within the list
            [[ "$line" =~ ^[[:space:]]*# ]] && continue
            [[ "$line" =~ ^[[:space:]]*$ ]] && continue
            if [[ "$line" =~ ^[[:space:]]*-[[:space:]]+([A-Za-z0-9_]+) ]]; then
                [[ -n "$rules_str" ]] && rules_str+=","
                rules_str+="${BASH_REMATCH[1]}"
            elif [[ ! "$line" =~ ^[[:space:]]*- ]]; then
                break
            fi
        fi
    done < "$ENFORCE_CONFIG"
    [[ -n "$rules_str" ]] && FAST_RULES="$rules_str"

    # SE-03: Validate parsed mode values
    case "$MODE" in
        warn|block|strict) ;;
        *) echo "Warning: Invalid mode '$MODE' in $ENFORCE_CONFIG, defaulting to 'warn'" >&2; MODE="warn" ;;
    esac
    case "$NEW_FOLDER_MODE" in
        warn|block|strict) ;;
        *) echo "Warning: Invalid new_folder_mode '$NEW_FOLDER_MODE' in $ENFORCE_CONFIG, defaulting to 'block'" >&2; NEW_FOLDER_MODE="block" ;;
    esac
}

# ───────────────────────────────────────────────────────────────
# 2. STAGED FILE DETECTION
# ───────────────────────────────────────────────────────────────

get_staged_spec_files() {
    # Get staged .md files under specs/ or .opencode/specs/ paths
    git diff --cached --name-only --diff-filter=ACMR 2>/dev/null | \
        grep -E '(^|/)specs?/.*\.md$' || true
}

# Walk up from a file path to find the spec folder (directory containing spec.md)
find_spec_folder() {
    local file_path="$1"
    local dir
    dir=$(dirname "$file_path")

    # Walk up to 5 levels looking for spec.md
    local depth=0
    while [[ $depth -lt 5 ]]; do
        local abs_dir="$REPO_ROOT/$dir"
        if [[ -f "$abs_dir/spec.md" ]]; then
            echo "$abs_dir"
            return 0
        fi
        # Check if we've hit the repo root
        local parent
        parent=$(dirname "$dir")
        [[ "$parent" == "$dir" ]] && break
        dir="$parent"
        ((depth++))
    done
    return 1
}

# ───────────────────────────────────────────────────────────────
# 3. FOLDER AGE CHECK
# ───────────────────────────────────────────────────────────────

is_new_folder() {
    local folder="$1"
    # A folder is "new" if all its files are staged as Added (not Modified)
    local folder_rel="${folder#"$REPO_ROOT"/}"
    local total_files modified_files
    total_files=$(git diff --cached --name-only "$folder_rel/" 2>/dev/null | wc -l | tr -d ' ')
    modified_files=$(git diff --cached --name-only --diff-filter=M "$folder_rel/" 2>/dev/null | wc -l | tr -d ' ')

    # If no modified files but has staged files, it's new
    [[ "$total_files" -gt 0 && "$modified_files" -eq 0 ]]
}

is_after_enforcement_date() {
    local folder="$1"
    [[ -z "$CREATED_AFTER" ]] && return 1

    # Check git log for earliest commit of spec.md in this folder
    local folder_rel="${folder#"$REPO_ROOT"/}"
    local first_commit_date
    first_commit_date=$(git log --diff-filter=A --date=short --format=%ad -- "$folder_rel/spec.md" 2>/dev/null | tail -1 || true)

    # If not yet committed (new file), it's after the date
    if [[ -z "$first_commit_date" ]]; then
        return 0
    fi

    [[ "$first_commit_date" > "$CREATED_AFTER" || "$first_commit_date" == "$CREATED_AFTER" ]]
}

# ───────────────────────────────────────────────────────────────
# 4. VALIDATION
# ───────────────────────────────────────────────────────────────

validate_folder() {
    local folder="$1"
    local effective_mode="$MODE"

    # Determine effective mode
    if is_new_folder "$folder"; then
        effective_mode="$NEW_FOLDER_MODE"
    elif is_after_enforcement_date "$folder"; then
        # Folders created after enforcement date get stricter treatment
        [[ "$effective_mode" == "warn" ]] && effective_mode="block"
    fi

    # Run validate.sh with fast rule subset via SPECKIT_RULES env var
    local exit_code=0
    SPECKIT_RULES="$FAST_RULES" bash "$SCRIPT_DIR/validate.sh" "$folder" --quiet 2>/dev/null || exit_code=$?

    case $exit_code in
        0) return 0 ;;
        1) # Warnings
            case "$effective_mode" in
                strict) return 2 ;;
                *)      return 1 ;;
            esac
            ;;
        2) # Errors
            case "$effective_mode" in
                warn) return 1 ;;
                *)    return 2 ;;
            esac
            ;;
    esac
    return 0
}

# ───────────────────────────────────────────────────────────────
# 5. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    load_enforcement_config

    # Get staged spec files
    local staged_files
    staged_files=$(get_staged_spec_files)
    [[ -z "$staged_files" ]] && exit 0

    # Derive unique spec folders (Bash 3.2 compatible dedup)
    local spec_folders=()
    local seen_list=""
    while IFS= read -r file; do
        [[ -z "$file" ]] && continue
        local folder
        folder=$(find_spec_folder "$file") || continue
        # Dedup via string search
        case "$seen_list" in
            *"|$folder|"*) continue ;;
        esac
        seen_list="${seen_list}|$folder|"
        spec_folders+=("$folder")
    done <<< "$staged_files"

    [[ ${#spec_folders[@]} -eq 0 ]] && exit 0

    # Validate each folder
    local has_errors=false has_warnings=false
    local start_time
    start_time=$(date +%s)

    for folder in "${spec_folders[@]}"; do
        local folder_name
        folder_name=$(basename "$folder")
        local result=0
        validate_folder "$folder" || result=$?

        case $result in
            0) ;;
            1) has_warnings=true
               echo "spec-validate: warning in $folder_name" ;;
            2) has_errors=true
               echo "spec-validate: ERROR in $folder_name" ;;
        esac
    done

    local elapsed=$(( $(date +%s) - start_time ))
    local folder_count=${#spec_folders[@]}

    if $has_errors; then
        echo "spec-validate: blocked — $folder_count folder(s) checked in ${elapsed}s (mode: $MODE)"
        echo "spec-validate: fix errors or set mode to 'warn' in .speckit-enforce.yaml"
        exit 2
    fi

    if $has_warnings; then
        echo "spec-validate: $folder_count folder(s) passed with warnings in ${elapsed}s"
    fi

    exit 0
}

main "$@"

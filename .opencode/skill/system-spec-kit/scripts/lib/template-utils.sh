#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Template Utils
# ───────────────────────────────────────────────────────────────
# Template operations for spec-kit scripts.
# Source this file: source "$(dirname "$0")/../lib/template-utils.sh"
#
# Functions:
# Get_level_templates_dir()  - Resolve template directory for a given level
# Copy_template()            - Copy template file with level-specific fallback
#
# Compatibility: Bash 3.2+ (macOS default)
# ───────────────────────────────────────────────────────────────

# Conditional strict mode — skipped when sourced to avoid breaking caller's error handling.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    set -euo pipefail
fi

# Guard against double-sourcing
[[ -n "${_TEMPLATE_UTILS_LOADED:-}" ]] && return 0
_TEMPLATE_UTILS_LOADED=1

# ───────────────────────────────────────────────────────────────
# Get level-specific templates directory path.
# Maps documentation level (1, 2, 3, 3+) to the appropriate folder.
#
# Usage: dir=$(get_level_templates_dir "2" "/path/to/templates")
# Args:
# $1 - Documentation level: 1, 2, 3, or 3+
# $2 - Base templates directory path
# Returns: Prints resolved directory path to stdout
# ───────────────────────────────────────────────────────────────
get_level_templates_dir() {
    local level="$1"
    local base_dir="$2"
    case "$level" in
        1) printf '%s\n' "$base_dir/level_1" ;;
        2) printf '%s\n' "$base_dir/level_2" ;;
        3) printf '%s\n' "$base_dir/level_3" ;;
        "3+"|4) printf '%s\n' "$base_dir/level_3+" ;;
        *) printf '%s\n' "$base_dir/level_1" ;;  # Default fallback
    esac
}

# ───────────────────────────────────────────────────────────────
# Copy a template file to a destination directory with fallback.
# Tries level-specific folder first, then falls back to base templates.
# If no template is found, creates an empty file.
#
# Consolidated from create.sh's copy_template() and copy_subfolder_template()
# Which were near-identical (only differed in destination directory).
#
# Usage: copy_template "spec.md" "/dest/dir" "/level/templates" "/base/templates" [dest_name]
# Args:
# $1 - Template filename (e.g., "spec.md")
# $2 - Destination directory (e.g., "$FEATURE_DIR" or "$SUBFOLDER_PATH")
# $3 - Level-specific templates directory
# $4 - Base templates directory (fallback)
# $5 - (Optional) Destination filename if different from template name
# Returns: Prints the created filename to stdout (for tracking in CREATED_FILES)
# Exit: 0 always (creates empty file as fallback)
# ───────────────────────────────────────────────────────────────
copy_template() {
    local template_name="$1"
    local dest_dir="$2"
    local level_templates_dir="$3"
    local base_templates_dir="$4"
    local dest_name="${5:-$template_name}"
    local dest_path="$dest_dir/$dest_name"

    # Try level-specific folder first, then fallback to base templates
    local template_path="$level_templates_dir/$template_name"
    if [[ ! -f "$template_path" ]]; then
        template_path="$base_templates_dir/$template_name"
    fi

    if [[ -f "$template_path" ]]; then
        cp "$template_path" "$dest_path"
        printf '%s\n' "$dest_name"
    else
        touch "$dest_path"
        printf '%s\n' "$dest_name (empty - template not found)"
    fi
}

# Exit codes:
# 0 - Success

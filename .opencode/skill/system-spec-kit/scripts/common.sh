#!/usr/bin/env bash
set -euo pipefail
# ───────────────────────────────────────────────────────────────
# SPECKIT: COMMON UTILITIES
# ───────────────────────────────────────────────────────────────
# Repository detection, branch management, and path resolution.
# NOTE: lib/common.sh provides LOW-LEVEL utilities (colors, logging).
#       This file provides HIGH-LEVEL repo/branch/path utilities.

# ───────────────────────────────────────────────────────────────
# 1. REPOSITORY ROOT DETECTION
# ───────────────────────────────────────────────────────────────

# Resolve the project repository root via git or fall back to relative path from script location
get_repo_root() {
    if git rev-parse --show-toplevel >/dev/null 2>&1; then
        git rev-parse --show-toplevel
    else
        # Fall back to script location for non-git repos
        # Path: scripts/ -> system-spec-kit/ -> skill/ -> .opencode/ -> project
        local script_dir
        script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        echo "Warning: Not in a git repo, using relative path for PROJECT_ROOT" >&2
        (cd "$script_dir/../../../.." && pwd)
    fi
}

# ───────────────────────────────────────────────────────────────
# 2. BRANCH DETECTION
# ───────────────────────────────────────────────────────────────

# Detect the current feature branch via env var, git, or latest numbered specs/ folder
get_current_branch() {
    # Priority 1: Environment variable
    if [[ -n "${SPECIFY_FEATURE:-}" ]]; then
        echo "$SPECIFY_FEATURE"
        return
    fi

    # Priority 2: Git branch name
    if git rev-parse --abbrev-ref HEAD >/dev/null 2>&1; then
        git rev-parse --abbrev-ref HEAD
        return
    fi

    # Priority 3: Latest numbered folder in specs/
    local repo_root specs_dir latest_feature="" highest=0
    repo_root="$(get_repo_root)"
    specs_dir="$repo_root/specs"

    if [[ -d "$specs_dir" ]]; then
        for dir in "$specs_dir"/*; do
            if [[ -d "$dir" ]]; then
                local dirname number
                dirname="$(basename "$dir")"
                if [[ "$dirname" =~ ^([0-9]{3})- ]]; then
                    number=$((10#${BASH_REMATCH[1]}))
                    if [[ "$number" -gt "$highest" ]]; then
                        highest="$number"
                        latest_feature="$dirname"
                    fi
                fi
            fi
        done
        [[ -n "$latest_feature" ]] && { echo "$latest_feature"; return; }
    fi

    echo "main"
}

# Return success (0) if the current directory is inside a git repository
has_git() {
    git rev-parse --show-toplevel >/dev/null 2>&1
}

# ───────────────────────────────────────────────────────────────
# 3. BRANCH VALIDATION
# ───────────────────────────────────────────────────────────────

# Validate that the given branch name matches the NNN-feature-name convention
check_feature_branch() {
    local branch="$1" has_git_repo="${2:-false}"

    if [[ "$has_git_repo" != "true" ]]; then
        echo "[speckit] Warning: Git not detected; skipped branch validation" >&2
        return 0
    fi

    if [[ ! "$branch" =~ ^[0-9]{3}- ]]; then
        echo "ERROR: Not on a feature branch. Current: $branch" >&2
        echo "Feature branches should be: 001-feature-name" >&2
        return 1
    fi
    return 0
}

# ───────────────────────────────────────────────────────────────
# 4. PATH RESOLUTION
# ───────────────────────────────────────────────────────────────

# Build the absolute path to a feature's spec directory: $repo_root/specs/$branch_name
get_feature_dir() {
    echo "$1/specs/$2"
}

# Resolve a spec folder path by matching the 3-digit numeric prefix from the branch name
find_feature_dir_by_prefix() {
    local repo_root="$1" branch_name="$2"
    local specs_dir="$repo_root/specs"

    # Extract numeric prefix (e.g., "004" from "004-whatever")
    if [[ ! "$branch_name" =~ ^([0-9]{3})- ]]; then
        echo "$specs_dir/$branch_name"
        return
    fi

    local prefix="${BASH_REMATCH[1]}" matches=()
    if [[ -d "$specs_dir" ]]; then
        for dir in "$specs_dir"/"$prefix"-*; do
            [[ -d "$dir" ]] && matches+=("$(basename "$dir")")
        done
    fi

    if [[ ${#matches[@]} -eq 0 ]]; then
        echo "$specs_dir/$branch_name"
    elif [[ ${#matches[@]} -eq 1 ]]; then
        echo "$specs_dir/${matches[0]}"
    else
        echo "ERROR: Multiple spec dirs with prefix '$prefix': ${matches[*]}" >&2
        echo "$specs_dir/$branch_name"
    fi
}

# Get_feature_paths - Export feature paths as eval-able variables
# SECURITY: Uses printf %q to prevent injection from malicious paths
get_feature_paths() {
    local repo_root current_branch has_git_repo="false" feature_dir
    repo_root="$(get_repo_root)"
    current_branch="$(get_current_branch)"
    has_git && has_git_repo="true"
    feature_dir="$(find_feature_dir_by_prefix "$repo_root" "$current_branch")"

    printf 'REPO_ROOT=%q\n' "$repo_root"
    printf 'CURRENT_BRANCH=%q\n' "$current_branch"
    printf 'HAS_GIT=%q\n' "$has_git_repo"
    printf 'FEATURE_DIR=%q\n' "$feature_dir"
    printf 'FEATURE_SPEC=%q\n' "$feature_dir/spec.md"
    printf 'IMPL_PLAN=%q\n' "$feature_dir/plan.md"
    printf 'TASKS=%q\n' "$feature_dir/tasks.md"
    printf 'RESEARCH_DIR=%q\n' "$feature_dir/research"
    printf 'RESEARCH=%q\n' "$feature_dir/research/research.md"
    printf 'CHECKLISTS_DIR=%q\n' "$feature_dir/checklists"
    printf 'DECISIONS_DIR=%q\n' "$feature_dir/decisions"
}

# ───────────────────────────────────────────────────────────────
# 5. DISPLAY HELPERS
# ───────────────────────────────────────────────────────────────

# Print a checkmark or cross indicating whether a file exists at the given path
check_file() {
    [[ -f "$1" ]] && echo "  ✓ $2" || echo "  ✗ $2"
}

# Print a checkmark or cross indicating whether a non-empty directory exists at the given path
check_dir() {
    [[ -d "$1" && -n "$(ls -A "$1" 2>/dev/null)" ]] && echo "  ✓ $2" || echo "  ✗ $2"
}

# Exit codes:
#   0 - Success
#   1 - ERROR: Not on a feature branch. Current: $branch

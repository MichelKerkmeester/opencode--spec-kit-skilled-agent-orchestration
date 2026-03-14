#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Git Branch
# ───────────────────────────────────────────────────────────────
# Git branch utilities for spec-kit scripts.
# Source this file: source "$(dirname "$0")/../lib/git-branch.sh"
#
# Functions:
# Check_existing_branches()  - Find next available branch number
# Generate_branch_name()     - Create branch name from description
#
# Required variables (must be set before calling):
# SPECS_DIR - Path to the specs/ directory (for check_existing_branches)
#
# Compatibility: Bash 3.2+ (macOS default)
# ───────────────────────────────────────────────────────────────

# Conditional strict mode — skipped when sourced to avoid breaking caller's error handling.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    set -euo pipefail
fi

# Guard against double-sourcing
[[ -n "${_GIT_BRANCH_LOADED:-}" ]] && return 0
_GIT_BRANCH_LOADED=1

# ───────────────────────────────────────────────────────────────
# Check existing branches and spec directories to determine the
# Next available branch number for a given short name.
#
# Usage: next_num=$(check_existing_branches "feature-name")
# Requires: SPECS_DIR to be set
# Returns: Prints the next available number (current max + 1) to stdout
# ───────────────────────────────────────────────────────────────
check_existing_branches() {
    local short_name="$1"

    # Escape regex metacharacters in short_name for safe use in grep/sed patterns
    local escaped_name
    escaped_name=$(printf '%s' "$short_name" | sed 's/[.[\*^$()+{}?|]/\\&/g')

    # Fetch all remotes to get latest branch info
    if ! git fetch --all --prune 2>/dev/null; then
        printf '%s\n' "Warning: Could not fetch from remote (continuing with local branches only)" >&2
    fi

    # Find all branches matching the pattern using git ls-remote (more reliable)
    # Only check remote if origin exists
    local remote_branches=""
    if git remote | grep -q '^origin$'; then
        remote_branches=$(git ls-remote --heads origin 2>/dev/null | grep -E "refs/heads/[0-9]+-${escaped_name}$" | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n)
    fi
    
    # Also check local branches
    local local_branches
    local_branches=$(git branch 2>/dev/null | grep -E "^[* ]*[0-9]+-${escaped_name}$" | sed 's/^[* ]*//' | sed 's/-.*//' | sort -n)
    
    # Check specs directory as well
    local spec_dirs=""
    if [[ -d "${SPECS_DIR:-}" ]]; then
        # Use while loop instead of xargs for cross-platform compatibility
        # (BSD xargs doesn't support -r flag, GNU xargs needs it for empty input)
        while IFS= read -r dir; do
            [[ -n "$dir" ]] && spec_dirs="$spec_dirs $(basename "$dir" | sed 's/-.*//')"
        done < <(find "$SPECS_DIR" -maxdepth 1 -type d -name "[0-9]*-${short_name}" 2>/dev/null)
        spec_dirs=$(printf '%s\n' "$spec_dirs" | tr ' ' '\n' | grep -v '^$' | sort -n)
    fi
    
    # Combine all sources and get the highest number
    local max_num=0
    for num in $remote_branches $local_branches $spec_dirs; do
        if [[ "$num" -gt "$max_num" ]]; then
            max_num=$num
        fi
    done
    
    # Return next number
    printf '%s\n' "$((max_num + 1))"
}

# ───────────────────────────────────────────────────────────────
# Generate a concise branch name from a feature description.
# Applies NLP-lite stop word filtering to extract meaningful words.
#
# Usage: branch_suffix=$(generate_branch_name "Add user authentication system")
# Returns: Prints hyphenated branch name (e.g., "user-authentication-system") to stdout
# ───────────────────────────────────────────────────────────────
generate_branch_name() {
    local description="$1"
    
    # Common stop words to filter out
    local stop_words="^(i|a|an|the|to|for|of|in|on|at|by|with|from|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|can|may|might|must|shall|this|that|these|those|my|your|our|their|want|need|add|get|set)$"
    
    # Convert to lowercase and split into words
    local clean_name
    clean_name=$(printf '%s\n' "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/ /g')
    
    # Filter words: remove stop words and words shorter than 3 chars (unless they're uppercase acronyms in original)
    local meaningful_words=()
    for word in $clean_name; do
        # Skip empty words
        [[ -z "$word" ]] && continue
        
        # Keep words that are NOT stop words AND (length >= 3 OR are potential acronyms)
        if ! printf '%s\n' "$word" | grep -qiE "$stop_words"; then
            if [[ ${#word} -ge 3 ]]; then
                meaningful_words+=("$word")
            else
                # Check if word appears as uppercase in original (likely acronym)
                # Use tr for bash 3.2 compatibility (macOS default) instead of ${word^^}
                local word_upper
                word_upper=$(printf '%s\n' "$word" | tr '[:lower:]' '[:upper:]')
                if printf '%s\n' "$description" | grep -qw "${word_upper}"; then
                    # Keep short words if they appear as uppercase in original (likely acronyms)
                    meaningful_words+=("$word")
                fi
            fi
        fi
    done
    
    # If we have meaningful words, use first 3-4 of them
    if [[ ${#meaningful_words[@]} -gt 0 ]]; then
        local max_words=3
        if [[ ${#meaningful_words[@]} -eq 4 ]]; then max_words=4; fi
        
        local result=""
        local count=0
        for word in "${meaningful_words[@]}"; do
            if [[ $count -ge $max_words ]]; then break; fi
            if [[ -n "$result" ]]; then result="$result-"; fi
            result="$result$word"
            count=$((count + 1))
        done
        printf '%s\n' "$result"
    else
        # Fallback to original logic if no meaningful words found
        printf '%s\n' "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | tr '-' '\n' | grep -v '^$' | head -3 | tr '\n' '-' | sed 's/-$//'
    fi
}

# Exit codes:
# 0 - Success

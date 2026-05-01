#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Check Priority Helper
# ───────────────────────────────────────────────────────────────
# Shared priority-context detection used by check-evidence.sh and
# check-priority-tags.sh. Centralizes the parsing of priority section
# headers (## P0 / ### [P1] / etc.) and inline tags ([P0]/**P0**) so
# the two rules stay aligned.
#
# F-009-B4-03: Before this helper, both rules implemented their own
# priority parsing with subtly different regexes (check-evidence used
# 1-6 header levels with optional brackets; check-priority-tags used
# 1-3 levels without brackets). Shared parsing eliminates that drift.
#
# Usage:
#   source "${SCRIPT_DIR}/../lib/check-priority-helper.sh"
#   priority=""
#   while IFS= read -r line; do
#     if priority_section_header "$line" detected; then
#       priority="$detected"
#       continue
#     fi
#     if priority_item_tag "$line" item_tag; then
#       echo "item priority: ${item_tag:-$priority}"
#     fi
#   done < file.md
#
# Compatibility: Bash 3.2+ (macOS default)
# ───────────────────────────────────────────────────────────────

# Conditional strict mode — skipped when sourced to avoid breaking caller's error handling.
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
    set -euo pipefail
fi

# Guard against double-sourcing
[[ -n "${_CHECK_PRIORITY_HELPER_LOADED:-}" ]] && return 0
_CHECK_PRIORITY_HELPER_LOADED=1

# ───────────────────────────────────────────────────────────────
# Priority section header regex: matches ## P0, ### [P1], ###### P2: ...
# Supports H1-H6 (1-6 hashes), optional brackets around P0/P1/P2,
# trailing whitespace/colon/dash/end-of-line as separator.
#
# Matches:
#   "## P0"
#   "### P1 - Required"
#   "## [P0]"
#   "##### P2:"
# Does NOT match:
#   "##P0" (no space after hash)
#   "## P3" (only P0/P1/P2)
# ───────────────────────────────────────────────────────────────
PRIORITY_SECTION_HEADER_REGEX='^#{1,6}[[:space:]]+\[?(P[012])\]?([[:space:]]|$|:|-)'

# ───────────────────────────────────────────────────────────────
# Priority inline tag regex: matches [P0], [P1], [P2] anywhere in line.
# ───────────────────────────────────────────────────────────────
PRIORITY_INLINE_TAG_REGEX='\[(P[012])\]'

# ───────────────────────────────────────────────────────────────
# Priority bold tag regex: matches **P0**, **P1**, **P2**.
# ───────────────────────────────────────────────────────────────
PRIORITY_BOLD_TAG_REGEX='\*\*(P[012])\*\*'

# ───────────────────────────────────────────────────────────────
# detect_priority_section_header — sets named output var when line
# is a priority section header.
#
# Args:
#   $1 — line to examine
#   $2 — name of output variable to set (will be set to P0/P1/P2)
#
# Returns: 0 if matched, 1 otherwise
# ───────────────────────────────────────────────────────────────
detect_priority_section_header() {
    local line="$1"
    local outvar="$2"
    if [[ "$line" =~ $PRIORITY_SECTION_HEADER_REGEX ]]; then
        printf -v "$outvar" '%s' "${BASH_REMATCH[1]}"
        return 0
    fi
    return 1
}

# ───────────────────────────────────────────────────────────────
# detect_priority_inline_tag — sets named output var when line
# carries an inline [P0]/[P1]/[P2] tag.
#
# Args:
#   $1 — line to examine
#   $2 — name of output variable to set (will be set to P0/P1/P2)
#
# Returns: 0 if matched, 1 otherwise
# ───────────────────────────────────────────────────────────────
detect_priority_inline_tag() {
    local line="$1"
    local outvar="$2"
    if [[ "$line" =~ $PRIORITY_INLINE_TAG_REGEX ]]; then
        printf -v "$outvar" '%s' "${BASH_REMATCH[1]}"
        return 0
    fi
    return 1
}

# ───────────────────────────────────────────────────────────────
# line_has_priority_context — fast yes/no probe used by
# check-priority-tags. Returns 0 when the line carries any of:
# inline [P0], bold **P0**.
#
# Args:
#   $1 — line to examine
#
# Returns: 0 if any tag form present, 1 otherwise
# ───────────────────────────────────────────────────────────────
line_has_priority_context() {
    local line="$1"
    [[ "$line" =~ $PRIORITY_INLINE_TAG_REGEX ]] && return 0
    [[ "$line" =~ $PRIORITY_BOLD_TAG_REGEX ]] && return 0
    return 1
}

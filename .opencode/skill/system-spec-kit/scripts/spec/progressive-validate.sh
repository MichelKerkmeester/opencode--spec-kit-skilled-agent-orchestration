#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPECKIT: PROGRESSIVE VALIDATE
# ───────────────────────────────────────────────────────────────
# Progressive validation pipeline for spec documents.
# Wraps validate.sh with a 4-level pipeline:
#   Level 1 - Detect  : Identify all violations (same as validate.sh)
#   Level 2 - Auto-fix: Apply safe mechanical corrections with diff log
#   Level 3 - Suggest : Present non-automatable issues with guidance
#   Level 4 - Report  : Produce structured output with before/after diffs
#
# USAGE:
#   ./progressive-validate.sh <folder-path> [OPTIONS]
#
# OPTIONS:
#   --level N     Run pipeline up to level N (1-4, default: 4)
#   --dry-run     Show what would be changed without applying fixes
#   --json        Structured JSON output
#   --strict      Treat warnings as errors
#   --quiet, -q   Minimal output
#   --verbose     Detailed output
#   --help, -h    Show help
#   --version     Show version
#
# EXIT CODES: 0=pass, 1=warnings, 2=errors (identical to validate.sh)
#
# Bash 3.2+ compatible (macOS default)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION="1.0.0"

# Source shared library
source "${SCRIPT_DIR}/../lib/shell-common.sh"

# ───────────────────────────────────────────────────────────────
# STATE
# Boolean flags are stored as "true"/"false" strings.
# Use [[ "$FLAG" == "true" ]] for comparisons — NEVER use $FLAG
# directly in boolean context with set -e (runs false command).
# ───────────────────────────────────────────────────────────────
FOLDER_PATH=""
PIPELINE_LEVEL=4
DRY_RUN="false"
JSON_MODE="false"
STRICT_MODE="false"
VERBOSE="false"
QUIET_MODE="false"

# Fix tracking (bash 3.2 compatible — use indexed arrays)
AUTOFIX_COUNT=0
AUTOFIX_LOG=""        # newline-separated log entries
AUTOFIX_DIFFS=""      # accumulated diff output
SUGGESTION_COUNT=0
SUGGESTION_LOG=""     # newline-separated suggestion entries

VALIDATE_EXIT=0

# ───────────────────────────────────────────────────────────────
# COLORS (disabled for non-TTY)
# ───────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    DIM='\033[2m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' BLUE='' CYAN='' DIM='' BOLD='' NC=''
fi

# ───────────────────────────────────────────────────────────────
# HELP
# ───────────────────────────────────────────────────────────────
show_help() {
    cat << 'EOF'
progressive-validate.sh - Progressive Validation Pipeline (v1.0)

USAGE: ./progressive-validate.sh <folder-path> [OPTIONS]

OPTIONS:
    --help, -h     Show help
    --version      Show version
    --level N      Run pipeline up to level N (1-4, default: 4)
    --dry-run      Show what would be auto-fixed without applying changes
    --json         JSON structured output
    --strict       Treat warnings as errors
    --verbose      Detailed output
    --quiet, -q    Minimal output

LEVELS:
    1 = Detect    Identify all violations (equivalent to validate.sh)
    2 = Auto-fix  Apply safe mechanical corrections with diff logging
    3 = Suggest   Present non-automatable issues with guided options
    4 = Report    Full structured output with before/after diffs (default)

EXIT CODES: 0=pass, 1=warnings, 2=errors

AUTO-FIXES APPLIED AT LEVEL 2+:
    - Missing dates -> insert current date (YYYY-MM-DD)
    - Heading level normalization -> fix inconsistent heading levels
    - Whitespace normalization -> trim trailing whitespace, normalize line endings

CRITICAL: All auto-fixes are logged with before/after diff to prevent silent corruption.
EOF
    exit 0
}

# ───────────────────────────────────────────────────────────────
# ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────
parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help|-h)    show_help ;;
            --version)    echo "progressive-validate.sh version $VERSION"; exit 0 ;;
            --level)
                if [[ -z "${2:-}" ]] || ! [[ "$2" =~ ^[1-4]$ ]]; then
                    echo "ERROR: --level requires a value between 1 and 4" >&2; exit 2
                fi
                PIPELINE_LEVEL="$2"; shift 2 ;;
            --dry-run)    DRY_RUN="true"; shift ;;
            --json)       JSON_MODE="true"; shift ;;
            --strict)     STRICT_MODE="true"; shift ;;
            --verbose)    VERBOSE="true"; shift ;;
            --quiet|-q)   QUIET_MODE="true"; shift ;;
            -*)           echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;
            *)
                if [[ -z "$FOLDER_PATH" ]]; then
                    FOLDER_PATH="$1"
                else
                    echo "ERROR: Multiple paths provided" >&2; exit 2
                fi
                shift ;;
        esac
    done

    [[ -z "$FOLDER_PATH" ]] && { echo "ERROR: Folder path required" >&2; exit 2; }
    FOLDER_PATH="${FOLDER_PATH%/}"
    [[ ! -d "$FOLDER_PATH" ]] && { echo "ERROR: Folder not found: $FOLDER_PATH" >&2; exit 2; }
    return 0
}

# ───────────────────────────────────────────────────────────────
# OUTPUT HELPERS
# ───────────────────────────────────────────────────────────────
log_section() {
    [[ "$JSON_MODE" == "true" ]] && return 0
    [[ "$QUIET_MODE" == "true" ]] && return 0
    echo -e "\n${BLUE}──────────────────────────────────────────────${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}──────────────────────────────────────────────${NC}"
}

log_fix() {
    local label="$1" detail="$2"
    [[ "$JSON_MODE" == "true" ]] && return 0
    [[ "$QUIET_MODE" == "true" ]] && return 0
    if [[ "$DRY_RUN" == "true" ]]; then
        printf "${CYAN}[DRY-RUN]${NC} ${BOLD}%s${NC}: %s\n" "$label" "$detail"
    else
        printf "${GREEN}[FIX]${NC} ${BOLD}%s${NC}: %s\n" "$label" "$detail"
    fi
}

log_suggest() {
    local label="$1" detail="$2"
    [[ "$JSON_MODE" == "true" ]] && return 0
    [[ "$QUIET_MODE" == "true" ]] && return 0
    printf "${YELLOW}[SUGGEST]${NC} ${BOLD}%s${NC}: %s\n" "$label" "$detail"
}

log_verbose() {
    [[ "$VERBOSE" != "true" ]] && return 0
    [[ "$JSON_MODE" == "true" ]] && return 0
    [[ "$QUIET_MODE" == "true" ]] && return 0
    printf "${DIM}  %s${NC}\n" "$1"
}

# ───────────────────────────────────────────────────────────────
# DIFF HELPER
# Produces a unified diff between old_content and new_content.
# ───────────────────────────────────────────────────────────────
compute_diff() {
    local label="$1"
    local old_content="$2"
    local new_content="$3"
    local old_file new_file
    old_file=$(mktemp /tmp/progressive-validate-old.XXXXXX)
    new_file=$(mktemp /tmp/progressive-validate-new.XXXXXX)
    printf '%s' "$old_content" > "$old_file"
    printf '%s' "$new_content" > "$new_file"
    # diff exits 1 when files differ — suppress errexit with || true
    local diff_output=""
    diff_output=$(diff -u --label "a/$label" --label "b/$label" "$old_file" "$new_file" 2>/dev/null || true)
    rm -f "$old_file" "$new_file"
    printf '%s' "$diff_output"
}

# Append a fix record to AUTOFIX_LOG and AUTOFIX_DIFFS
record_fix() {
    local file="$1"
    local fix_type="$2"
    local description="$3"
    local diff_text="$4"

    AUTOFIX_COUNT=$((AUTOFIX_COUNT + 1))
    local entry="${AUTOFIX_COUNT}|${file}|${fix_type}|${description}"
    if [[ -n "$AUTOFIX_LOG" ]]; then
        AUTOFIX_LOG="${AUTOFIX_LOG}
${entry}"
    else
        AUTOFIX_LOG="$entry"
    fi

    if [[ -n "$AUTOFIX_DIFFS" ]]; then
        AUTOFIX_DIFFS="${AUTOFIX_DIFFS}
---DIFF:${AUTOFIX_COUNT}---
${diff_text}"
    else
        AUTOFIX_DIFFS="---DIFF:${AUTOFIX_COUNT}---
${diff_text}"
    fi
}

# Append a suggestion record to SUGGESTION_LOG
record_suggestion() {
    local file="$1"
    local issue_type="$2"
    local location="$3"
    local remediation="$4"

    SUGGESTION_COUNT=$((SUGGESTION_COUNT + 1))
    local entry="${SUGGESTION_COUNT}|${file}|${issue_type}|${location}|${remediation}"
    if [[ -n "$SUGGESTION_LOG" ]]; then
        SUGGESTION_LOG="${SUGGESTION_LOG}
${entry}"
    else
        SUGGESTION_LOG="$entry"
    fi
}

# ───────────────────────────────────────────────────────────────
# LEVEL 1: DETECT
# Delegates entirely to validate.sh, capturing its exit code.
# ───────────────────────────────────────────────────────────────
run_level1_detect() {
    log_section "Level 1: Detect — Running validate.sh"

    local validate_script="${SCRIPT_DIR}/validate.sh"
    if [[ ! -f "$validate_script" ]]; then
        echo "ERROR: validate.sh not found at $validate_script" >&2
        exit 2
    fi

    local extra_flags=()
    [[ "$JSON_MODE" == "true" ]]   && extra_flags+=("--json")
    [[ "$STRICT_MODE" == "true" ]] && extra_flags+=("--strict")
    [[ "$VERBOSE" == "true" ]]     && extra_flags+=("--verbose")
    [[ "$QUIET_MODE" == "true" ]]  && extra_flags+=("--quiet")

    VALIDATE_EXIT=0
    if [[ "$JSON_MODE" == "true" ]]; then
        # In JSON mode, capture validate.sh output
        local detect_output=""
        if [[ ${#extra_flags[@]} -gt 0 ]]; then
            detect_output=$("$validate_script" "$FOLDER_PATH" "${extra_flags[@]}" 2>&1) || VALIDATE_EXIT=$?
        else
            detect_output=$("$validate_script" "$FOLDER_PATH" 2>&1) || VALIDATE_EXIT=$?
        fi
        _DETECT_JSON_OUTPUT="$detect_output"
        # Print detect output only if Level 1 is the final level
        if [[ $PIPELINE_LEVEL -eq 1 ]]; then
            printf '%s\n' "$detect_output"
        fi
    else
        # Human-readable: stream validate.sh output directly
        if [[ ${#extra_flags[@]} -gt 0 ]]; then
            "$validate_script" "$FOLDER_PATH" "${extra_flags[@]}" 2>&1 || VALIDATE_EXIT=$?
        else
            "$validate_script" "$FOLDER_PATH" 2>&1 || VALIDATE_EXIT=$?
        fi
    fi
}

# ───────────────────────────────────────────────────────────────
# LEVEL 2: AUTO-FIX HELPERS
# ───────────────────────────────────────────────────────────────

# AUTO-FIX 2a: Insert missing dates into spec documents.
# Looks for placeholder patterns like "YYYY-MM-DD", "[DATE]", "date: TBD",
# and replaces them with today's date.
autofix_missing_dates() {
    local folder="$1"
    local today
    today=$(date +%Y-%m-%d)

    local md_file
    for md_file in "$folder"/*.md; do
        [[ ! -f "$md_file" ]] && continue
        local fname
        fname=$(basename "$md_file")

        local original_content
        original_content=$(< "$md_file")
        local new_content="$original_content"

        # Pattern 1: Literal "YYYY-MM-DD" placeholder
        new_content="${new_content//YYYY-MM-DD/$today}"

        # Pattern 2: [DATE] placeholder
        new_content="${new_content//\[DATE\]/$today}"

        # Pattern 3: date: TBD / **Date:** TBD / | Date | TBD | (case insensitive via python3)
        if command -v python3 >/dev/null 2>&1; then
            new_content=$(printf '%s' "$new_content" | python3 -c "
import sys, re
content = sys.stdin.read()
today = '$today'
content = re.sub(r'(?i)(date:\s*)tbd', r'\g<1>' + today, content)
content = re.sub(r'(?i)(\*\*[Dd]ate:\*\*\s*)tbd', r'\g<1>' + today, content)
content = re.sub(r'(?i)(\|\s*[Dd]ate\s*\|\s*)tbd(\s*\|)', r'\g<1>' + today + r'\2', content)
sys.stdout.write(content)
" 2>/dev/null || printf '%s' "$new_content")
        fi

        if [[ "$new_content" != "$original_content" ]]; then
            local diff_text
            diff_text=$(compute_diff "$fname" "$original_content" "$new_content")
            record_fix "$fname" "MISSING_DATE" "Inserted current date ($today) for date placeholders" "$diff_text"
            log_fix "MISSING_DATE" "$fname — replaced date placeholders with $today"
            log_verbose "Diff for $fname"
            if [[ "$DRY_RUN" != "true" ]]; then
                printf '%s\n' "$new_content" > "$md_file"
            fi
        fi
    done
}

# AUTO-FIX 2b: Normalize heading levels.
# Shifts all headings so the minimum heading level is H1.
autofix_heading_levels() {
    local folder="$1"

    local md_file
    for md_file in "$folder"/*.md; do
        [[ ! -f "$md_file" ]] && continue
        local fname
        fname=$(basename "$md_file")

        local original_content
        original_content=$(< "$md_file")

        if ! command -v python3 >/dev/null 2>&1; then
            continue
        fi

        local new_content
        local _py_heading_script
        _py_heading_script=$(cat << 'PYEOF'
import sys, re
lines = sys.stdin.read().splitlines(keepends=True)
heading_pat = re.compile(r'^(#{1,6})\s+(.+)$')
headings = []
for i, line in enumerate(lines):
    m = heading_pat.match(line.rstrip('\n').rstrip('\r'))
    if m:
        headings.append((i, len(m.group(1)), m.group(2)))
if not headings:
    sys.stdout.write(''.join(lines))
    sys.exit(0)
min_level = min(h[1] for h in headings)
fixed_lines = list(lines)
if min_level > 1:
    shift = min_level - 1
    for idx, level, text in headings:
        new_level = max(1, level - shift)
        fixed_lines[idx] = '#' * new_level + ' ' + text + '\n'
sys.stdout.write(''.join(fixed_lines))
PYEOF
)
        new_content=$(printf '%s' "$original_content" | python3 -c "$_py_heading_script") || true

        if [[ "$new_content" != "$original_content" ]]; then
            local diff_text
            diff_text=$(compute_diff "$fname" "$original_content" "$new_content")
            record_fix "$fname" "HEADING_LEVELS" "Normalized heading levels so minimum heading is H1" "$diff_text"
            log_fix "HEADING_LEVELS" "$fname — normalized heading hierarchy"
            log_verbose "Heading fix applied to $fname"
            if [[ "$DRY_RUN" != "true" ]]; then
                printf '%s\n' "$new_content" > "$md_file"
            fi
        fi
    done
}

# AUTO-FIX 2c: Whitespace normalization.
# Trims trailing whitespace on each line and normalizes CRLF to LF.
autofix_whitespace() {
    local folder="$1"

    local md_file
    for md_file in "$folder"/*.md; do
        [[ ! -f "$md_file" ]] && continue
        local fname
        fname=$(basename "$md_file")

        local original_content
        original_content=$(< "$md_file")

        if ! command -v python3 >/dev/null 2>&1; then
            continue
        fi

        local new_content
        new_content=$(printf '%s' "$original_content" | python3 -c "
import sys
content = sys.stdin.read()
content = content.replace('\r\n', '\n').replace('\r', '\n')
lines = [line.rstrip() for line in content.splitlines()]
result = '\n'.join(lines)
if result and not result.endswith('\n'):
    result += '\n'
sys.stdout.write(result)
" 2>/dev/null || printf '%s' "$original_content")

        if [[ "$new_content" != "$original_content" ]]; then
            local diff_text
            diff_text=$(compute_diff "$fname" "$original_content" "$new_content")
            record_fix "$fname" "WHITESPACE" "Normalized trailing whitespace and line endings" "$diff_text"
            log_fix "WHITESPACE" "$fname — trimmed trailing whitespace / normalized CRLF->LF"
            log_verbose "Whitespace fix applied to $fname"
            if [[ "$DRY_RUN" != "true" ]]; then
                printf '%s\n' "$new_content" > "$md_file"
            fi
        fi
    done
}

# ───────────────────────────────────────────────────────────────
# LEVEL 2: AUTO-FIX ORCHESTRATOR
# ───────────────────────────────────────────────────────────────
run_level2_autofix() {
    if [[ "$DRY_RUN" == "true" ]]; then
        log_section "Level 2: Auto-fix — DRY RUN (no changes will be applied)"
    else
        log_section "Level 2: Auto-fix — Applying safe mechanical corrections"
    fi

    autofix_missing_dates  "$FOLDER_PATH"
    autofix_heading_levels "$FOLDER_PATH"
    autofix_whitespace     "$FOLDER_PATH"

    if [[ "$JSON_MODE" != "true" && "$QUIET_MODE" != "true" ]]; then
        if [[ $AUTOFIX_COUNT -eq 0 ]]; then
            echo -e "  ${GREEN}No auto-fixes needed.${NC}"
        else
            if [[ "$DRY_RUN" == "true" ]]; then
                echo -e "\n  ${CYAN}${BOLD}Dry-run: $AUTOFIX_COUNT fix(es) would be applied.${NC}"
            else
                echo -e "\n  ${GREEN}${BOLD}Applied $AUTOFIX_COUNT auto-fix(es).${NC}"
            fi
        fi
    fi
}

# ───────────────────────────────────────────────────────────────
# LEVEL 3: SUGGEST
# Analyzes issues that cannot be auto-fixed and presents guided options.
# ───────────────────────────────────────────────────────────────
run_level3_suggest() {
    log_section "Level 3: Suggest — Guided fix options for non-automatable issues"

    local validate_script="${SCRIPT_DIR}/validate.sh"
    local extra_flags=("--quiet")
    [[ "$STRICT_MODE" == "true" ]] && extra_flags+=("--strict")

    # Run validate.sh in quiet mode to get exit status
    local exit_code=0
    if [[ ${#extra_flags[@]} -gt 0 ]]; then
        "$validate_script" "$FOLDER_PATH" "${extra_flags[@]}" > /dev/null 2>&1 || exit_code=$?
    else
        "$validate_script" "$FOLDER_PATH" > /dev/null 2>&1 || exit_code=$?
    fi

    if [[ $exit_code -eq 0 ]]; then
        if [[ "$JSON_MODE" != "true" && "$QUIET_MODE" != "true" ]]; then
            echo -e "  ${GREEN}No issues requiring manual intervention.${NC}"
        fi
        return 0
    fi

    # Run validate.sh in JSON mode to get structured issue data
    local json_output=""
    json_output=$("$validate_script" "$FOLDER_PATH" --json 2>&1) || true

    # Extract individual rule failures from JSON output
    if command -v python3 >/dev/null 2>&1 && [[ -n "$json_output" ]]; then
        local suggestions_raw
        suggestions_raw=$(printf '%s' "$json_output" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    results = data.get('results', [])
    for r in results:
        if r.get('status') in ('fail', 'warn', 'error'):
            rule = r.get('rule', 'UNKNOWN')
            msg  = r.get('message', '')
            print(rule + '|||' + msg)
except Exception:
    pass
" 2>/dev/null || true)

        if [[ -n "$suggestions_raw" ]]; then
            while IFS= read -r line; do
                [[ -z "$line" ]] && continue
                local rule_name="${line%%|||*}"
                local issue_msg="${line#*|||}"
                local remediation
                remediation=$(get_suggestion_for_rule "$rule_name" "$issue_msg")
                record_suggestion "$FOLDER_PATH" "$rule_name" "$issue_msg" "$remediation"
                if [[ "$JSON_MODE" != "true" && "$QUIET_MODE" != "true" ]]; then
                    echo -e "\n  ${YELLOW}${BOLD}Issue:${NC} ${rule_name}"
                    echo -e "  ${BOLD}Location:${NC} $FOLDER_PATH"
                    echo -e "  ${BOLD}Detail:${NC}   $issue_msg"
                    echo -e "  ${BOLD}Remediation:${NC} $remediation"
                fi
            done <<< "$suggestions_raw"
        fi
    fi

    if [[ "$JSON_MODE" != "true" && "$QUIET_MODE" != "true" ]]; then
        if [[ $SUGGESTION_COUNT -eq 0 ]]; then
            echo -e "  ${YELLOW}Issues detected but could not be parsed. Run with --json for details.${NC}"
        else
            echo -e "\n  ${YELLOW}${BOLD}$SUGGESTION_COUNT issue(s) require manual intervention.${NC}"
        fi
    fi
}

# Returns a human-readable remediation hint for a given rule name.
get_suggestion_for_rule() {
    local rule="$1"
    case "$rule" in
        FILE_EXISTS|FILES)
            echo "Create the missing file using the spec-kit template: .opencode/skill/system-spec-kit/templates/"
            ;;
        PLACEHOLDER_FILLED|PLACEHOLDERS)
            echo "Search the file for [PLACEHOLDER] patterns and replace them with real content."
            ;;
        SECTIONS_PRESENT|SECTIONS)
            echo "Add the missing section heading. Refer to the template for the expected structure."
            ;;
        LEVEL_DECLARED|LEVEL)
            echo "Add a Level row to the spec.md metadata table: | **Level** | 1 | (or 2, 3, 3+)"
            ;;
        PRIORITY_TAGS|PRIORITY)
            echo "Tag tasks with [P0], [P1], or [P2] priority markers. Remove invalid priority tags."
            ;;
        EVIDENCE_CITED|EVIDENCE)
            echo "Add evidence to completed P0/P1 items: [SOURCE: file:line], [TESTED:], [VERIFIED:], etc."
            ;;
        ANCHORS_VALID|ANCHORS)
            echo "Fix memory file anchors: ensure each <!-- anchor:id --> has a matching <!-- /anchor:id -->."
            ;;
        TOC_POLICY|TOC)
            echo "Add or update the Table of Contents using the spec-kit TOC format with anchor links."
            ;;
        PHASE_LINKS|LINKS_VALID|LINKS)
            echo "Fix broken relative links. Check that all referenced files exist."
            ;;
        *)
            echo "Review the rule documentation and the failing file. No automated fix available for $rule."
            ;;
    esac
}

# ───────────────────────────────────────────────────────────────
# LEVEL 4: REPORT
# Produces structured output combining all pipeline results.
# ───────────────────────────────────────────────────────────────
run_level4_report() {
    if [[ "$JSON_MODE" == "true" ]]; then
        generate_json_report
    else
        generate_human_report
    fi
}

generate_human_report() {
    log_section "Level 4: Report — Progressive Validation Summary"

    local validate_label
    case $VALIDATE_EXIT in
        0) validate_label="${GREEN}PASSED${NC}" ;;
        1) validate_label="${YELLOW}PASSED WITH WARNINGS${NC}" ;;
        *) validate_label="${RED}FAILED${NC}" ;;
    esac

    if [[ "$QUIET_MODE" != "true" ]]; then
        echo -e "  ${BOLD}Folder:${NC}      $FOLDER_PATH"
        echo -e "  ${BOLD}Pipeline:${NC}    Level $PIPELINE_LEVEL"
        [[ "$DRY_RUN" == "true" ]] && echo -e "  ${BOLD}Mode:${NC}        DRY RUN (no changes applied)"
        echo -e "  ${BOLD}Detect:${NC}      $validate_label"
        echo -e "  ${BOLD}Auto-fixes:${NC}  $AUTOFIX_COUNT applied"
        echo -e "  ${BOLD}Suggestions:${NC} $SUGGESTION_COUNT manual action(s)"

        if [[ $AUTOFIX_COUNT -gt 0 && "$VERBOSE" == "true" ]]; then
            echo -e "\n  ${BOLD}Auto-fix Diffs:${NC}"
            echo -e "${DIM}${AUTOFIX_DIFFS}${NC}"
        fi
    else
        local result_label
        case $VALIDATE_EXIT in
            0) result_label="PASSED" ;;
            1) result_label="PASSED_WITH_WARNINGS" ;;
            *) result_label="FAILED" ;;
        esac
        echo "RESULT: $result_label (autofixes=$AUTOFIX_COUNT suggestions=$SUGGESTION_COUNT)"
    fi
}

generate_json_report() {
    local passed="true"
    [[ $VALIDATE_EXIT -ge 2 ]] && passed="false"
    [[ $VALIDATE_EXIT -ge 1 && "$STRICT_MODE" == "true" ]] && passed="false"

    local folder_escaped
    folder_escaped="$(_json_escape "$FOLDER_PATH")"

    # Build auto-fixes JSON array
    local fixes_json="["
    local first_entry="true"
    if [[ -n "$AUTOFIX_LOG" ]]; then
        while IFS='|' read -r fix_num fix_file fix_type fix_desc; do
            [[ -z "$fix_num" ]] && continue
            [[ "$first_entry" != "true" ]] && fixes_json+=","
            first_entry="false"
            fixes_json+="{\"id\":${fix_num},\"file\":\"$(_json_escape "$fix_file")\",\"type\":\"$(_json_escape "$fix_type")\",\"description\":\"$(_json_escape "$fix_desc")\"}"
        done <<< "$AUTOFIX_LOG"
    fi
    fixes_json+="]"

    # Build suggestions JSON array
    local suggestions_json="["
    local first_sug="true"
    if [[ -n "$SUGGESTION_LOG" ]]; then
        while IFS='|' read -r sug_num sug_file sug_type sug_loc sug_rem; do
            [[ -z "$sug_num" ]] && continue
            [[ "$first_sug" != "true" ]] && suggestions_json+=","
            first_sug="false"
            suggestions_json+="{\"id\":${sug_num},\"file\":\"$(_json_escape "$sug_file")\",\"rule\":\"$(_json_escape "$sug_type")\",\"location\":\"$(_json_escape "$sug_loc")\",\"remediation\":\"$(_json_escape "$sug_rem")\"}"
        done <<< "$SUGGESTION_LOG"
    fi
    suggestions_json+="]"

    # Diffs as JSON-escaped string
    local diffs_escaped=""
    [[ -n "$AUTOFIX_DIFFS" ]] && diffs_escaped="$(_json_escape "$AUTOFIX_DIFFS")"

    # Whether fixes were actually applied (not dry-run)
    local fixes_applied="true"
    [[ "$DRY_RUN" == "true" ]] && fixes_applied="false"

    cat << EOF
{
  "version": "$VERSION",
  "pipelineLevel": $PIPELINE_LEVEL,
  "dryRun": $DRY_RUN,
  "folder": "$folder_escaped",
  "detectExitCode": $VALIDATE_EXIT,
  "passed": $passed,
  "strict": $STRICT_MODE,
  "autoFixes": {
    "count": $AUTOFIX_COUNT,
    "applied": $fixes_applied,
    "items": $fixes_json,
    "diffs": "$diffs_escaped"
  },
  "suggestions": {
    "count": $SUGGESTION_COUNT,
    "items": $suggestions_json
  }
}
EOF
}

# ───────────────────────────────────────────────────────────────
# MAIN
# ───────────────────────────────────────────────────────────────
main() {
    parse_args "$@"

    # Internal variable for JSON detect output (set by run_level1_detect)
    _DETECT_JSON_OUTPUT=""

    # Print pipeline header (human-readable mode only)
    if [[ "$JSON_MODE" != "true" && "$QUIET_MODE" != "true" ]]; then
        echo -e "\n${BLUE}===============================================${NC}"
        echo -e "${BLUE}  Progressive Validation Pipeline v${VERSION}${NC}"
        echo -e "${BLUE}===============================================${NC}"
        echo -e "  ${BOLD}Folder:${NC}   $FOLDER_PATH"
        echo -e "  ${BOLD}Levels:${NC}   1-${PIPELINE_LEVEL}"
        [[ "$DRY_RUN" == "true" ]] && echo -e "  ${BOLD}Mode:${NC}     DRY RUN"
        echo ""
    fi

    # Level 1: Detect (always runs)
    run_level1_detect

    # Level 2: Auto-fix
    if [[ $PIPELINE_LEVEL -ge 2 ]]; then
        run_level2_autofix
    fi

    # Level 3: Suggest
    if [[ $PIPELINE_LEVEL -ge 3 ]]; then
        run_level3_suggest
    fi

    # Level 4: Report
    if [[ $PIPELINE_LEVEL -ge 4 ]]; then
        run_level4_report
    fi

    # ─── Exit code compatibility (0/1/2) identical to validate.sh ───
    if [[ $VALIDATE_EXIT -ge 2 ]]; then
        exit 2
    fi
    if [[ $VALIDATE_EXIT -ge 1 && "$STRICT_MODE" == "true" ]]; then
        exit 2
    fi
    if [[ $VALIDATE_EXIT -ge 1 ]]; then
        exit 1
    fi
    exit 0
}

main "$@"

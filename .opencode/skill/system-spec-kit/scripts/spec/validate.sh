#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Validate Spec
# ───────────────────────────────────────────────────────────────
# Spec Folder Validation Orchestrator - Bash 3.2+ compatible

# Strict mode with guarded dynamic expansions.
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

# Feature flag: Skip validation if SPECKIT_SKIP_VALIDATION is set
if [[ -n "${SPECKIT_SKIP_VALIDATION:-}" ]]; then
    echo "Validation skipped (SPECKIT_SKIP_VALIDATION=${SPECKIT_SKIP_VALIDATION})" >&2
    exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly RULES_DIR="$SCRIPT_DIR/../rules"
readonly VERSION="2.0.0"

# Source shared libraries
source "${SCRIPT_DIR}/../lib/shell-common.sh"

# ───────────────────────────────────────────────────────────────
# 2. STATE & GLOBALS
# ───────────────────────────────────────────────────────────────

# State
FOLDER_PATH="" DETECTED_LEVEL=1 LEVEL_METHOD="inferred" CONFIG_FILE_PATH=""
JSON_MODE=false STRICT_MODE=false VERBOSE=false QUIET_MODE=false RECURSIVE=false RECURSIVE_OPT_OUT=false
ERRORS=0 WARNINGS=0 INFOS=0 RESULTS=""
PHASE_RESULTS="" PHASE_COUNT=0

# Rule execution order (empty = alphabetical)
RULE_ORDER=()

# ───────────────────────────────────────────────────────────────
# 3. UTILITY FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Timing helper - get current time in milliseconds
get_time_ms() {
    # Try nanoseconds first (Linux), then Python, then seconds only (macOS fallback)
    # P1-01 FIX: macOS date +%s%N outputs literal "N" (e.g. "1234567890N") instead of erroring.
    # Must verify the output contains only digits AND is long enough to be nanoseconds.
    local ns
    ns=$(date +%s%N 2>/dev/null)
    if [[ "$ns" =~ ^[0-9]+$ ]] && [[ ${#ns} -gt 10 ]]; then
        echo $(( ns / 1000000 ))
    elif command -v python3 >/dev/null 2>&1; then
        python3 -c "import time; print(int(time.time() * 1000))" 2>/dev/null || echo $(( $(date +%s) * 1000 ))
    else
        echo $(( $(date +%s) * 1000 ))
    fi
}

# Colors (disabled for non-TTY)
if [[ -t 1 ]]; then
    RED='\033[0;31m' GREEN='\033[0;32m' YELLOW='\033[1;33m' BLUE='\033[0;34m' BOLD='\033[1m' NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi

# Rule severity defaults (bash 3.2 compatible)
RULE_SEVERITY_FILE_EXISTS="error" RULE_SEVERITY_FILES="error"
RULE_SEVERITY_PLACEHOLDER_FILLED="error" RULE_SEVERITY_PLACEHOLDERS="error"
RULE_SEVERITY_SECTIONS_PRESENT="warn" RULE_SEVERITY_SECTIONS="warn"
RULE_SEVERITY_LEVEL_DECLARED="info" RULE_SEVERITY_LEVEL="info"
RULE_SEVERITY_PRIORITY_TAGS="warn" RULE_SEVERITY_EVIDENCE_CITED="warn"
RULE_SEVERITY_ANCHORS_VALID="error" RULE_SEVERITY_ANCHORS="error"
RULE_SEVERITY_EVIDENCE="warn" RULE_SEVERITY_PRIORITY="warn"

# ───────────────────────────────────────────────────────────────
# 4. HELP & ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────

show_help() { cat << 'EOF'
validate-spec.sh - Spec Folder Validation Orchestrator (v2.0)

USAGE: ./validate-spec.sh <folder-path> [OPTIONS]

OPTIONS:
    --help, -h     Show help     --version, -v  Show version
    --json         JSON output   --strict       Warnings as errors
    --verbose      Detailed      --quiet, -q    Results only
    --recursive    Validate parent + all [0-9][0-9][0-9]-*/ child phase folders
    --no-recursive Disable auto-recursive validation when phase children exist

EXIT CODES: 0=pass, 1=warnings, 2=errors

RULES: FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT, LEVEL_DECLARED,
       PRIORITY_TAGS, EVIDENCE_CITED, ANCHORS_VALID, TOC_POLICY, PHASE_LINKS,
       SPEC_DOC_INTEGRITY

LEVELS: 1=spec+plan+tasks+impl-summary*, 2=+checklist, 3=+decision-record
        *impl-summary required after tasks completed
EOF
exit 0; }

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help|-h) show_help ;;
            --version|-v) echo "validate-spec.sh version $VERSION"; exit 0 ;;
            --json) JSON_MODE=true; shift ;;
            --strict) STRICT_MODE=true; shift ;;
            --verbose) VERBOSE=true; shift ;;
            --quiet|-q) QUIET_MODE=true; shift ;;
            --recursive) RECURSIVE=true; shift ;;
            --no-recursive) RECURSIVE=false; RECURSIVE_OPT_OUT=true; shift ;;
            -*) echo "ERROR: Unknown option '$1'" >&2; exit 2 ;;
            *) [[ -z "$FOLDER_PATH" ]] && FOLDER_PATH="$1" || { echo "ERROR: Multiple paths" >&2; exit 2; }; shift ;;
        esac
    done
    [[ -z "$FOLDER_PATH" ]] && { echo "ERROR: Folder path required" >&2; exit 2; }
    FOLDER_PATH="${FOLDER_PATH%/}"
    [[ ! -d "$FOLDER_PATH" ]] && { echo "ERROR: Folder not found: $FOLDER_PATH" >&2; exit 2; }
    return 0
}

# ───────────────────────────────────────────────────────────────
# 5. CONFIGURATION LOADING
# ───────────────────────────────────────────────────────────────

has_phase_children() {
    local parent_folder="$1"
    for phase_dir in "$parent_folder"/[0-9][0-9][0-9]-*/; do
        if [[ -d "$phase_dir" ]]; then
            return 0
        fi
    done
    return 1
}

apply_env_overrides() {
    [[ "${SPECKIT_VALIDATION:-}" == "false" ]] && { echo "Validation disabled"; exit 0; }
    [[ "${SPECKIT_STRICT:-}" == "true" ]] && STRICT_MODE=true
    [[ "${SPECKIT_VERBOSE:-}" == "true" ]] && VERBOSE=true
    [[ "${SPECKIT_JSON:-}" == "true" ]] && JSON_MODE=true
    [[ "${SPECKIT_QUIET:-}" == "true" ]] && QUIET_MODE=true
    # SPECKIT_RULES: comma-separated rule subset (e.g., "FILE_EXISTS,LEVEL_DECLARED")
    # Used by pre-commit hook for fast 6-rule validation
    if [[ -n "${SPECKIT_RULES:-}" ]]; then
        RULE_ORDER=()
        IFS=',' read -ra _rules <<< "$SPECKIT_RULES"
        for _r in "${_rules[@]}"; do
            local _canonical
            _canonical=$(canonicalize_rule_name "$_r")
            if [[ -n "$_canonical" ]]; then
                RULE_ORDER+=("$_canonical")
            else
                echo "Warning: Unrecognized SPECKIT_RULES entry: '$_r'" >&2
            fi
        done
        unset _rules _r _canonical
    fi
    return 0
}

load_config() {
    local folder="${1:-.}"
    [[ -f "$folder/.speckit.yaml" ]] && { CONFIG_FILE_PATH="$folder/.speckit.yaml"; }
    if [[ -z "$CONFIG_FILE_PATH" ]]; then
        local root; root=$(git rev-parse --show-toplevel 2>/dev/null) || root="$(pwd)"
        [[ -f "$root/.speckit.yaml" ]] && CONFIG_FILE_PATH="$root/.speckit.yaml"
    fi
    # Parse rule order if config exists
    if [[ -n "$CONFIG_FILE_PATH" && -f "$CONFIG_FILE_PATH" ]]; then
        local rule_order_str=""
        if command -v yq >/dev/null 2>&1; then
            rule_order_str=$(yq -r '.validation.rule_order[]? // empty' "$CONFIG_FILE_PATH" 2>/dev/null || true)
            [[ -z "$rule_order_str" ]] && rule_order_str=$(yq -r '.rule_order[]? // empty' "$CONFIG_FILE_PATH" 2>/dev/null || true)
        else
            # Fallback: simple grep for rule_order entries
            local in_order=false
            while IFS= read -r line; do
                if [[ "$line" =~ ^[[:space:]]*rule_order: ]]; then
                    in_order=true; continue
                elif $in_order && [[ "$line" =~ ^[[:space:]]*[A-Za-z0-9_]+: ]]; then
                    break
                fi
                if $in_order && [[ "$line" =~ ^[[:space:]]+-[[:space:]]+([A-Za-z0-9_-]+) ]]; then
                    rule_order_str+="${BASH_REMATCH[1]}"$'\n'
                fi
            done < "$CONFIG_FILE_PATH"
        fi
        if [[ -n "$rule_order_str" ]]; then
            RULE_ORDER=()
            while IFS= read -r rule; do
                local canonical_rule
                canonical_rule=$(canonicalize_rule_name "$rule")
                [[ -n "$canonical_rule" ]] && RULE_ORDER+=("$canonical_rule")
            done <<< "$rule_order_str"
        fi
    fi
    return 0
}

# Template hash validation - checks if spec files match original templates
# This is informational only; modifications are expected and not failures
validate_template_hashes() {
    local folder="$1"
    local hash_file="$SCRIPT_DIR/../../templates/.hashes"
    
    # No hash file means skip validation
    [[ ! -f "$hash_file" ]] && return 0
    
    while IFS='=' read -r template expected_hash; do
        # Skip empty lines and comments
        [[ -z "$template" || "$template" =~ ^# ]] && continue
        
        local actual_file="$folder/$template"
        if [[ -f "$actual_file" ]]; then
            # Calculate hash (macOS uses md5, Linux uses md5sum)
            local actual_hash
            if command -v md5 >/dev/null 2>&1; then
                actual_hash=$(md5 -q "$actual_file" 2>/dev/null)
            else
                actual_hash=$(md5sum "$actual_file" 2>/dev/null | cut -d' ' -f1)
            fi
            # Note: We don't fail on mismatch - templates are meant to be customized
            # This function is for informational/audit purposes only
        fi
    done < "$hash_file"
    
    return 0
}

# ───────────────────────────────────────────────────────────────
# 6. LEVEL DETECTION
# ───────────────────────────────────────────────────────────────

detect_level() {
    local folder="$1"
    local spec_file="$folder/spec.md"
    local level=""
    
    if [[ -f "$spec_file" ]]; then
        # Pattern 0: SPECKIT_LEVEL marker (most authoritative)
        # <!-- SPECKIT_LEVEL: 2 --> or <!-- SPECKIT_LEVEL: 3+ -->
        level=$(grep -oE '<!-- SPECKIT_LEVEL: *[123]\+? *-->' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)

        # Pattern 1: Table format with bold (common)
        # | **Level** | 2 | or | **Level** | 3+ |
        if [[ -z "$level" ]]; then
            level=$(grep -E '\|\s*\*\*Level\*\*\s*\|\s*[123]\+?\s*\|' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi
        
        # Pattern 2: Table format without bold
        # | Level | 2 | or | Level | 3+ |
        if [[ -z "$level" ]]; then
            level=$(grep -E '\|\s*Level\s*\|\s*[123]\+?\s*\|' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi
        
        # Pattern 2b: Bullet metadata format (SE-05)
        # - **Level**: 2 or - **Level**: 3+
        if [[ -z "$level" ]]; then
            level=$(grep -E '^[[:space:]]*-[[:space:]]+\*\*Level\*\*:?\s*[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi

        # Pattern 3: YAML frontmatter
        # Level: 2 or level: 3+
        if [[ -z "$level" ]]; then
            level=$(grep -E '^level:\s*[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi
        
        # Pattern 4: Anchored inline "Level: N" or "Level N"
        # (line-start only to avoid prose false-positives)
        if [[ -z "$level" ]]; then
            level=$(grep -E '^[Ll]evel[: ]+[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
        fi
        
        [[ -n "$level" ]] && { DETECTED_LEVEL="$level"; LEVEL_METHOD="explicit"; return; }
    fi
    
    # Fallback: infer from existing files
    [[ -f "$folder/decision-record.md" ]] && { DETECTED_LEVEL=3; LEVEL_METHOD="inferred"; return; }
    [[ -f "$folder/checklist.md" ]] && { DETECTED_LEVEL=2; LEVEL_METHOD="inferred"; return; }
    DETECTED_LEVEL=1; LEVEL_METHOD="inferred"
}

# ───────────────────────────────────────────────────────────────
# 7. LOGGING
# ───────────────────────────────────────────────────────────────

log_pass() {
    ! $JSON_MODE && ! $QUIET_MODE && printf "${GREEN}✓${NC} ${BOLD}%s${NC}: %s\n" "$1" "$2"
    [[ -n "$RESULTS" ]] && RESULTS+=","
    RESULTS+="{\"rule\":\"$(_json_escape "$1")\",\"status\":\"pass\",\"message\":\"$(_json_escape "$2")\"}"
}
log_warn() {
    ((WARNINGS++)) || true
    ! $JSON_MODE && ! $QUIET_MODE && printf "${YELLOW}⚠${NC} ${BOLD}%s${NC}: %s\n" "$1" "$2"
    [[ -n "$RESULTS" ]] && RESULTS+=","; RESULTS+="{\"rule\":\"$(_json_escape "$1")\",\"status\":\"warn\",\"message\":\"$(_json_escape "$2")\"}"
}
log_error() {
    ((ERRORS++)) || true
    ! $JSON_MODE && ! $QUIET_MODE && printf "${RED}✗${NC} ${BOLD}%s${NC}: %s\n" "$1" "$2"
    [[ -n "$RESULTS" ]] && RESULTS+=","; RESULTS+="{\"rule\":\"$(_json_escape "$1")\",\"status\":\"error\",\"message\":\"$(_json_escape "$2")\"}"
}
log_info() {
    ((INFOS++)) || true
    ! $JSON_MODE && ! $QUIET_MODE && $VERBOSE && printf "${BLUE}ℹ${NC} ${BOLD}%s${NC}: %s\n" "$1" "$2"
    [[ -n "$RESULTS" ]] && RESULTS+=","; RESULTS+="{\"rule\":\"$(_json_escape "$1")\",\"status\":\"info\",\"message\":\"$(_json_escape "$2")\"}"
}
log_detail() { ! $JSON_MODE && ! $QUIET_MODE && printf "    - %s\n" "$1"; true; }

# ───────────────────────────────────────────────────────────────
# 8. RULE RESOLUTION
# ───────────────────────────────────────────────────────────────

get_rule_severity() {
    case "$1" in
        FILE_EXISTS|FILES|PLACEHOLDER_FILLED|PLACEHOLDERS|ANCHORS_VALID|ANCHORS|TOC_POLICY|TEMPLATE_HEADERS) echo "error" ;;
        SECTIONS_PRESENT|SECTIONS|PRIORITY_TAGS|EVIDENCE_CITED|EVIDENCE|PRIORITY|PHASE_LINKS|LINKS_VALID|LINKS) echo "warn" ;;
        SPEC_DOC_INTEGRITY|DOC_INTEGRITY) echo "error" ;;
        LEVEL_DECLARED|LEVEL) echo "info" ;;
        *) echo "error" ;;
    esac
}
should_run_rule() { [[ "$(get_rule_severity "$1")" != "skip" ]]; }

# Map rule name to script filename
canonicalize_rule_name() {
    local raw="$1"
    local normalized
    normalized=$(echo "$raw" | tr '[:lower:]-' '[:upper:]_')
    case "$normalized" in
        FILES|FILES_PRESENT|FILES_EXISTS|FILE_EXISTS) echo "FILE_EXISTS" ;;
        PLACEHOLDERS|PLACEHOLDER|PLACEHOLDER_FILLED|PLACEHOLDERS_FILLED) echo "PLACEHOLDER_FILLED" ;;
        SECTIONS|SECTIONS_PRESENT) echo "SECTIONS_PRESENT" ;;
        LEVEL|LEVEL_DECLARED) echo "LEVEL_DECLARED" ;;
        PRIORITY|PRIORITY_TAGS) echo "PRIORITY_TAGS" ;;
        EVIDENCE|EVIDENCE_CITED) echo "EVIDENCE_CITED" ;;
        ANCHOR|ANCHORS|ANCHOR_MATCHED|ANCHORS_VALID) echo "ANCHORS_VALID" ;;
        TOC|TOC_POLICY) echo "TOC_POLICY" ;;
        PHASE_LINKS) echo "PHASE_LINKS" ;;
        LINKS|LINKS_VALID) echo "LINKS_VALID" ;;
        AI_PROTOCOL|AI_PROTOCOLS) echo "AI_PROTOCOLS" ;;
        COMPLEXITY|COMPLEXITY_MATCH) echo "COMPLEXITY_MATCH" ;;
        FOLDER_NAMING) echo "FOLDER_NAMING" ;;
        FRONTMATTER|FRONTMATTER_VALID) echo "FRONTMATTER_VALID" ;;
        LEVEL_MATCH) echo "LEVEL_MATCH" ;;
        SECTION_COUNTS) echo "SECTION_COUNTS" ;;
        SPEC_DOC_INTEGRITY|DOC_INTEGRITY) echo "SPEC_DOC_INTEGRITY" ;;
        TEMPLATE_SOURCE) echo "TEMPLATE_SOURCE" ;;
        TEMPLATE_HEADERS) echo "TEMPLATE_HEADERS" ;;
        *) echo "$normalized" ;;
    esac
}

rule_name_to_script() {
    local rule="$1"
    case "$rule" in
        FILE_EXISTS) echo "files" ;;
        PLACEHOLDER_FILLED) echo "placeholders" ;;
        SECTIONS_PRESENT) echo "sections" ;;
        LEVEL_DECLARED) echo "level" ;;
        PRIORITY_TAGS) echo "priority-tags" ;;
        EVIDENCE_CITED) echo "evidence" ;;
        ANCHORS_VALID) echo "anchors" ;;
        TOC_POLICY) echo "toc-policy" ;;
        PHASE_LINKS) echo "phase-links" ;;
        AI_PROTOCOLS) echo "ai-protocols" ;;
        COMPLEXITY_MATCH) echo "complexity" ;;
        FOLDER_NAMING) echo "folder-naming" ;;
        FRONTMATTER_VALID) echo "frontmatter" ;;
        LEVEL_MATCH) echo "level-match" ;;
        LINKS_VALID) echo "links" ;;
        SECTION_COUNTS) echo "section-counts" ;;
        TEMPLATE_SOURCE) echo "template-source" ;;
        SPEC_DOC_INTEGRITY) echo "spec-doc-integrity" ;;
        TEMPLATE_HEADERS) echo "template-headers" ;;
        *) echo "" ;;
    esac
}

get_rule_scripts() {
    local folder="$1"
    # If RULE_ORDER is set, use that order; otherwise alphabetical
    if [[ ${#RULE_ORDER[@]} -gt 0 ]]; then
        for rule_name in "${RULE_ORDER[@]}"; do
            local script_name; script_name=$(rule_name_to_script "$rule_name")
            [[ -z "$script_name" ]] && continue
            local script="$RULES_DIR/check-${script_name}.sh"
            if [[ -f "$script" ]]; then
                echo "$script"
            else
                echo "Warning: Rule script not found: check-${script_name}.sh (from rule '$rule_name')" >&2
            fi
        done
    else
        for script in "$RULES_DIR"/check-*.sh; do
            [[ -f "$script" ]] && echo "$script"
        done
    fi
}

# ───────────────────────────────────────────────────────────────
# 9. RULE EXECUTION
# ───────────────────────────────────────────────────────────────

run_all_rules() {
    local folder="$1" level="$2"
    # Level "3+" is a valid value — pass it through to rule scripts unchanged.
    # Rule scripts that need numeric comparisons (check-files, check-sections)
    # do their own local stripping; template-aware rules (check-template-headers,
    # check-anchors) forward the value to template-structure.js which handles "3+".
    local rule_scripts; rule_scripts=$(get_rule_scripts "$folder")
    
    while IFS= read -r rule_script; do
        [[ -z "$rule_script" ]] && continue
        [[ ! -f "$rule_script" ]] && continue
        # P1-14 FIX: Validate rule script before sourcing
        # Ensure it's a regular file with .sh extension within RULES_DIR
        local real_rule; real_rule=$(realpath "$rule_script" 2>/dev/null || echo "$rule_script")
        local real_rules_dir; real_rules_dir=$(realpath "$RULES_DIR" 2>/dev/null || echo "$RULES_DIR")
        if [[ ! "$real_rule" == "$real_rules_dir"/* ]] || [[ "${rule_script##*.}" != "sh" ]]; then
            echo "Warning: Skipping suspicious rule script: $rule_script" >&2
            continue
        fi
        local bn; bn=$(basename "$rule_script" .sh)
        local rule_name; rule_name=$(echo "${bn#check-}" | tr '[:lower:]' '[:upper:]' | tr '-' '_')
        should_run_rule "$rule_name" || continue
        
        # Capture start time for verbose timing
        local start_ms; start_ms=$(get_time_ms)
        
        RULE_NAME="" RULE_STATUS="pass" RULE_MESSAGE="" RULE_DETAILS=() RULE_REMEDIATION=""
        source "$rule_script"
        type run_check >/dev/null 2>&1 || continue
        run_check "$folder" "$level"
        
        # Calculate elapsed time
        local end_ms; end_ms=$(get_time_ms)
        local elapsed_ms=$(( end_ms - start_ms ))
        local timing_str=""
        if $VERBOSE && ! $JSON_MODE && ! $QUIET_MODE; then
            if [[ $elapsed_ms -lt 1000 ]]; then
                timing_str=" [${elapsed_ms}ms]"
            else
                timing_str=" [$((elapsed_ms / 1000)).$((elapsed_ms % 1000 / 100))s]"
            fi
        fi
        
        local sev; sev="$(get_rule_severity "$rule_name")"
        case "${RULE_STATUS:-pass}" in
            pass) log_pass "${RULE_NAME:-$rule_name}" "${RULE_MESSAGE:-OK}${timing_str}" ;;
            fail) case "$sev" in error) log_error "${RULE_NAME:-$rule_name}" "${RULE_MESSAGE:-Failed}${timing_str}" ;; warn) log_warn "${RULE_NAME:-$rule_name}" "${RULE_MESSAGE:-Warning}${timing_str}" ;; info) $VERBOSE && log_info "${RULE_NAME:-$rule_name}" "${RULE_MESSAGE:-Info}${timing_str}" ;; esac ;;
            warn) log_warn "${RULE_NAME:-$rule_name}" "${RULE_MESSAGE:-Warning}${timing_str}" ;;
            info) $VERBOSE && log_info "${RULE_NAME:-$rule_name}" "${RULE_MESSAGE:-Info}${timing_str}" ;;
        esac
        if [[ -n "${RULE_DETAILS[*]-}" ]]; then
            for d in "${RULE_DETAILS[@]}"; do log_detail "$d"; done
        fi
        unset -f run_check 2>/dev/null || true
    done <<< "$rule_scripts"

    return 0
}

# ───────────────────────────────────────────────────────────────
# 10. OUTPUT
# ───────────────────────────────────────────────────────────────

print_header() {
    $JSON_MODE && return 0; $QUIET_MODE && return 0
    echo -e "\n${BLUE}───────────────────────────────────────────────────────────────
${NC}"
    echo -e "${BLUE}  Spec Folder Validation v$VERSION${NC}"
    echo -e "${BLUE}───────────────────────────────────────────────────────────────
${NC}\n"
    echo -e "  ${BOLD}Folder:${NC} $FOLDER_PATH"
    echo -e "  ${BOLD}Level:${NC}  $DETECTED_LEVEL ($LEVEL_METHOD)"
    [[ -n "$CONFIG_FILE_PATH" ]] && echo -e "  ${BOLD}Config:${NC} $CONFIG_FILE_PATH" || true
    echo -e "\n${BLUE}───────────────────────────────────────────────────────────────
${NC}\n"
}

print_summary() {
    $JSON_MODE && return 0
    if $QUIET_MODE; then
        local status="PASSED"
        if [[ $ERRORS -gt 0 ]]; then
            status="FAILED"
        elif [[ $WARNINGS -gt 0 ]] && $STRICT_MODE; then
            status="FAILED_STRICT"
        elif [[ $WARNINGS -gt 0 ]]; then
            status="PASSED_WITH_WARNINGS"
        fi
        echo "RESULT: $status (errors=$ERRORS warnings=$WARNINGS)"
        return 0
    fi
    echo -e "\n${BLUE}───────────────────────────────────────────────────────────────
${NC}\n"
    echo -e "  ${BOLD}Summary:${NC} ${RED}Errors:${NC} $ERRORS  ${YELLOW}Warnings:${NC} $WARNINGS"
    $VERBOSE && echo -e "  ${BLUE}Info:${NC} $INFOS" || true
    echo ""
    if [[ $ERRORS -gt 0 ]]; then echo -e "  ${RED}${BOLD}RESULT: FAILED${NC}"
    elif [[ $WARNINGS -gt 0 ]]; then
        if $STRICT_MODE; then echo -e "  ${RED}${BOLD}RESULT: FAILED${NC} (strict)"; else echo -e "  ${YELLOW}${BOLD}RESULT: PASSED WITH WARNINGS${NC}"; fi
    else echo -e "  ${GREEN}${BOLD}RESULT: PASSED${NC}"; fi
    echo ""
}

generate_json() {
    local passed="true"
    [[ $ERRORS -gt 0 ]] && passed="false"
    [[ $WARNINGS -gt 0 ]] && $STRICT_MODE && passed="false"
    local cfg="null"; [[ -n "$CONFIG_FILE_PATH" ]] && cfg="\"$(_json_escape "$CONFIG_FILE_PATH")\""
    local folder_escaped="$(_json_escape "$FOLDER_PATH")"
    # JSON-safe level: quote if non-numeric (e.g. "3+")
    local json_level="$DETECTED_LEVEL"
    if [[ "$json_level" =~ [^0-9] ]]; then
        json_level="\"$(_json_escape "$json_level")\""
    fi
    local phases_json=""
    if $RECURSIVE && [[ -n "$PHASE_RESULTS" ]]; then
        phases_json=",\"phases\":[$PHASE_RESULTS],\"phaseCount\":$PHASE_COUNT"
    fi
    echo "{\"version\":\"$VERSION\",\"folder\":\"$folder_escaped\",\"level\":$json_level,\"levelMethod\":\"$LEVEL_METHOD\",\"config\":$cfg,\"results\":[$RESULTS]${phases_json},\"summary\":{\"errors\":$ERRORS,\"warnings\":$WARNINGS,\"info\":$INFOS},\"passed\":$passed,\"strict\":$STRICT_MODE}"
}

# ───────────────────────────────────────────────────────────────
# 11. PHASE VALIDATION
# ───────────────────────────────────────────────────────────────

# Recursive phase validation - validates parent + all [0-9][0-9][0-9]-*/ child folders
run_recursive_validation() {
    local parent_folder="$1"
    local child_errors=0
    local child_warnings=0
    local phase_results=""

    # Discover child phase folders (NNN-* pattern)
    local phase_dirs=()
    for phase_dir in "$parent_folder"/[0-9][0-9][0-9]-*/; do
        [[ -d "$phase_dir" ]] && phase_dirs+=("${phase_dir%/}")
    done

    if [[ ${#phase_dirs[@]} -eq 0 ]]; then
        # No phase children found - just validate parent normally
        ! $JSON_MODE && ! $QUIET_MODE && echo -e "\n  ${BLUE}No phase folders found. Validating parent only.${NC}" || true
        return 0
    fi

    ! $JSON_MODE && ! $QUIET_MODE && echo -e "\n${BLUE}───────────────────────────────────────────────────────────────
${NC}" || true
    ! $JSON_MODE && ! $QUIET_MODE && echo -e "${BLUE}  Recursive Phase Validation (${#phase_dirs[@]} phases found)${NC}" || true
    ! $JSON_MODE && ! $QUIET_MODE && echo -e "${BLUE}───────────────────────────────────────────────────────────────
${NC}" || true

    for phase_dir in "${phase_dirs[@]}"; do
        local phase_name
        phase_name=$(basename "$phase_dir")

        # Save parent state
        local parent_errors=$ERRORS
        local parent_warnings=$WARNINGS
        local parent_infos=$INFOS
        local parent_results="$RESULTS"
        local parent_level="$DETECTED_LEVEL"

        # Reset counters for child
        ERRORS=0 WARNINGS=0 INFOS=0 RESULTS=""

        ! $JSON_MODE && ! $QUIET_MODE && echo -e "\n  ${BOLD}Phase: $phase_name${NC}" || true

        # Detect child level and validate
        detect_level "$phase_dir"
        run_all_rules "$phase_dir" "$DETECTED_LEVEL"

        # Accumulate child results
        child_errors=$((child_errors + ERRORS))
        child_warnings=$((child_warnings + WARNINGS))

        # Build phase JSON entry
        local child_passed="true"
        [[ $ERRORS -gt 0 ]] && child_passed="false" || true
        [[ $WARNINGS -gt 0 ]] && $STRICT_MODE && child_passed="false" || true
        # JSON-safe level: quote if non-numeric (e.g. "3+")
        local json_level="$DETECTED_LEVEL"
        if [[ "$json_level" =~ [^0-9] ]]; then
            json_level="\"$(_json_escape "$json_level")\""
        fi
        [[ -n "$phase_results" ]] && phase_results+=","
        phase_results+="{\"name\":\"$(_json_escape "$phase_name")\",\"level\":$json_level,\"errors\":$ERRORS,\"warnings\":$WARNINGS,\"passed\":$child_passed,\"results\":[$RESULTS]}"

        # Restore parent state — child results stored in phases[] JSON only (not top-level results[])
        DETECTED_LEVEL="$parent_level"
        ERRORS=$((parent_errors + ERRORS))
        WARNINGS=$((parent_warnings + WARNINGS))
        INFOS=$((parent_infos + INFOS))
        RESULTS="$parent_results"
    done

    # Store phase results for JSON output
    PHASE_RESULTS="$phase_results"
    PHASE_COUNT=${#phase_dirs[@]}

    ! $JSON_MODE && ! $QUIET_MODE && echo -e "\n  ${BOLD}Phase Summary:${NC} ${#phase_dirs[@]} phases, $child_errors errors, $child_warnings warnings" || true
}

# ───────────────────────────────────────────────────────────────
# 12. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    parse_args "$@"
    if ! $RECURSIVE && ! $RECURSIVE_OPT_OUT && has_phase_children "$FOLDER_PATH"; then
        RECURSIVE=true
        ! $JSON_MODE && ! $QUIET_MODE && echo "Auto-enabled recursive validation: phase child folders detected."
    fi
    load_config "$FOLDER_PATH"
    apply_env_overrides
    detect_level "$FOLDER_PATH"
    validate_template_hashes "$FOLDER_PATH"
    print_header
    run_all_rules "$FOLDER_PATH" "$DETECTED_LEVEL"

    # Recursive phase validation
    PHASE_RESULTS="" PHASE_COUNT=0
    if $RECURSIVE; then
        run_recursive_validation "$FOLDER_PATH"
    fi

    if $JSON_MODE; then generate_json; else print_summary; fi
    if [[ $ERRORS -gt 0 ]]; then exit 2; fi
    if [[ $WARNINGS -gt 0 ]] && $STRICT_MODE; then exit 2; fi
    if [[ $WARNINGS -gt 0 ]]; then exit 1; fi
    exit 0
}

main "$@"

# Exit codes:
#   0 - Success
#   1 - General error

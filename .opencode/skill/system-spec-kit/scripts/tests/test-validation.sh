#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Test Validation
# ───────────────────────────────────────────────────────────────
# Runs validation tests against fixture spec folders.
# COMPATIBILITY: bash 3.2+ (macOS default)

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATOR="$SCRIPT_DIR/../spec/validate.sh"
FIXTURES="$SCRIPT_DIR/../test-fixtures"

# Colors
if [[ -t 1 ]]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    DIM='\033[2m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' BLUE='' DIM='' BOLD='' NC=''
fi

# Global counters
PASSED=0
FAILED=0
SKIPPED=0
TOTAL_TIME=0

# Options
VERBOSE=false
SINGLE_TEST=""
SINGLE_CATEGORY=""
LIST_ONLY=false

# Category tracking (bash 3.2 compatible)
CURRENT_CATEGORY=""
CURRENT_CAT_PASSED=0
CURRENT_CAT_FAILED=0
CURRENT_CAT_SKIPPED=0
CURRENT_CAT_TIME=0
CATEGORY_SUMMARIES=""
TEST_LIST=""
CATEGORY_LIST=""

# ───────────────────────────────────────────────────────────────
# 2. HELPER FUNCTIONS
# ───────────────────────────────────────────────────────────────

show_help() {
    cat << 'EOF'
validate-spec.sh Test Runner v2.0.0

USAGE:
  ./test-validation.sh [OPTIONS]

OPTIONS:
  -v, --verbose     Show output for passing tests (default: only show failures)
  -t, --test NAME   Run single test matching NAME (partial match, case-insensitive)
  -c, --category CAT Run only tests in category CAT (partial match)
  -l, --list        List all tests and categories without running
  -h, --help        Show this help message

EXAMPLES:
  ./test-validation.sh                    # Run all tests
  ./test-validation.sh -v                 # Run all with verbose output
  ./test-validation.sh -t "Level 1"       # Run test containing "Level 1"
  ./test-validation.sh -c positive        # Run all positive tests
  ./test-validation.sh -l                 # List available tests

EXIT CODES:
  0 - All tests passed
  1 - One or more tests failed
EOF
}

format_time() {
    local ms=$1
    if [[ "$ms" -lt 1000 ]]; then
        echo "${ms}ms"
    else
        local seconds=$((ms / 1000))
        local remaining_ms=$((ms % 1000))
        printf "%d.%03ds" "$seconds" "$remaining_ms"
    fi
}

get_time_ms() {
    if command -v gdate &> /dev/null; then
        # macOS with coreutils
        gdate +%s%3N
    elif command -v perl &> /dev/null; then
        # Perl fallback (common on macOS)
        perl -MTime::HiRes=time -e 'printf "%.0f\n", time * 1000'
    else
        # Fallback: seconds only (multiply by 1000)
        echo "$(($(date +%s) * 1000))"
    fi
}

to_lower() {
    echo "$1" | tr '[:upper:]' '[:lower:]'
}

contains_ci() {
    local haystack="$1"
    local needle="$2"
    local lower_haystack
    local lower_needle
    lower_haystack=$(to_lower "$haystack")
    lower_needle=$(to_lower "$needle")
    
    case "$lower_haystack" in
        *"$lower_needle"*) return 0 ;;
        *) return 1 ;;
    esac
}

save_category_summary() {
    if [[ -n "$CURRENT_CATEGORY" ]]; then
        local total=$((CURRENT_CAT_PASSED + CURRENT_CAT_FAILED + CURRENT_CAT_SKIPPED))
        if [[ "$total" -gt 0 ]]; then
            local time_fmt
            time_fmt=$(format_time "$CURRENT_CAT_TIME")
            # Format: name|passed|failed|skipped|time
            local entry="${CURRENT_CATEGORY}|${CURRENT_CAT_PASSED}|${CURRENT_CAT_FAILED}|${CURRENT_CAT_SKIPPED}|${time_fmt}"
            if [[ -n "$CATEGORY_SUMMARIES" ]]; then
                CATEGORY_SUMMARIES="${CATEGORY_SUMMARIES}
${entry}"
            else
                CATEGORY_SUMMARIES="$entry"
            fi
        fi
    fi
}

# ───────────────────────────────────────────────────────────────
# 3. CATEGORY FUNCTIONS
# ───────────────────────────────────────────────────────────────

begin_category() {
    local name="$1"
    
    # Save previous category stats
    save_category_summary
    
    # Reset for new category
    CURRENT_CATEGORY="$name"
    CURRENT_CAT_PASSED=0
    CURRENT_CAT_FAILED=0
    CURRENT_CAT_SKIPPED=0
    CURRENT_CAT_TIME=0
    
    # Track for listing
    if [[ -n "$CATEGORY_LIST" ]]; then
        CATEGORY_LIST="${CATEGORY_LIST}
${name}"
    else
        CATEGORY_LIST="$name"
    fi
    
    # Check if we should skip this category
    if [[ -n "$SINGLE_CATEGORY" ]]; then
        if ! contains_ci "$name" "$SINGLE_CATEGORY"; then
            return 1  # Skip this category
        fi
    fi
    
    echo ""
    echo -e "${BLUE}${BOLD}$name:${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    return 0
}

# ───────────────────────────────────────────────────────────────
# 4. TEST FUNCTIONS
# ───────────────────────────────────────────────────────────────

run_test() {
    local name="$1"
    local fixture="$2"
    local expect="$3"  # "pass", "warn", or "fail"
    local expected_rule="${4:-}"  # Optional rule marker that must appear in output
    
    # Register test for listing
    local test_entry="[$CURRENT_CATEGORY] $name"
    if [[ -n "$TEST_LIST" ]]; then
        TEST_LIST="${TEST_LIST}
${test_entry}"
    else
        TEST_LIST="$test_entry"
    fi

    # If list-only mode, skip execution
    if [[ "$LIST_ONLY" = true ]]; then
        return
    fi

    # Check if we should run this test (single test filter)
    if [[ -n "$SINGLE_TEST" ]]; then
        if ! contains_ci "$name" "$SINGLE_TEST"; then
            return  # Skip this test silently
        fi
    fi

    # Check if category is filtered out
    if [[ -n "$SINGLE_CATEGORY" ]]; then
        if ! contains_ci "$CURRENT_CATEGORY" "$SINGLE_CATEGORY"; then
            return  # Skip this test silently
        fi
    fi

    local fixture_path="$FIXTURES/$fixture"

    # Start timing
    local start_time
    start_time=$(get_time_ms)

    # Check fixture exists
    if [[ ! -d "$fixture_path" ]]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(fixture not found: $fixture)${NC} ${DIM}[${elapsed}ms]${NC}" >&2
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi
    
    # Check validator exists
    if [[ ! -f "$VALIDATOR" ]]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(validator not found)${NC} ${DIM}[${elapsed}ms]${NC}" >&2
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi
    
    # Run validator
    local exit_code=0
    local output
    output=$("$VALIDATOR" "$fixture_path" 2>&1) || exit_code=$?
    
    # End timing
    local end_time
    end_time=$(get_time_ms)
    local elapsed=$((end_time - start_time))
    local time_display
    time_display=$(format_time "$elapsed")
    
    # Update timing
    CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
    TOTAL_TIME=$((TOTAL_TIME + elapsed))
    
    # Determine actual result based on exit code
    # Exit 0 = pass, Exit 1 = warn, Exit 2 = fail
    local actual
    case $exit_code in
        0) actual="pass" ;;
        1) actual="warn" ;;
        *) actual="fail" ;;
    esac
    
    # Compare
    if [[ "$actual" = "$expect" ]]; then
        if [[ -n "$expected_rule" ]] && ! printf '%s\n' "$output" | grep -Fq "$expected_rule"; then
            echo -e "${RED}✗${NC} $name ${DIM}[${time_display}]${NC}"
            echo -e "  ${RED}Expected rule marker not found:${NC} $expected_rule" >&2
            echo -e "  ${DIM}Output:${NC}"
            echo "$output" | sed 's/^/    /'
            FAILED=$((FAILED + 1))
            CURRENT_CAT_FAILED=$((CURRENT_CAT_FAILED + 1))
            return
        fi

        echo -e "${GREEN}✓${NC} $name ${DIM}[${time_display}]${NC}"
        PASSED=$((PASSED + 1))
        CURRENT_CAT_PASSED=$((CURRENT_CAT_PASSED + 1))

        # Show output in verbose mode
        if [[ "$VERBOSE" = true ]] && [[ -n "$output" ]]; then
            echo -e "${DIM}  Output:${NC}"
            echo "$output" | sed 's/^/    /' | head -20
            local line_count
            line_count=$(echo "$output" | wc -l | tr -d ' ')
            if [[ "$line_count" -gt 20 ]]; then
                echo -e "    ${DIM}... ($((line_count - 20)) more lines)${NC}"
            fi
        fi
    else
        echo -e "${RED}✗${NC} $name ${DIM}[${time_display}]${NC}"
        echo -e "  ${RED}Expected:${NC} $expect, ${RED}Got:${NC} $actual (exit code: $exit_code)"
        echo -e "  ${DIM}Output:${NC}"
        echo "$output" | sed 's/^/    /'
        FAILED=$((FAILED + 1))
        CURRENT_CAT_FAILED=$((CURRENT_CAT_FAILED + 1))
    fi
}

run_test_with_flags() {
    local name="$1"
    local fixture="$2"
    local expect="$3"  # "pass", "warn", or "fail"
    local flags="${4:-}"
    local env_vars="${5:-}"

    # Register test for listing
    local test_entry="[$CURRENT_CATEGORY] $name"
    if [[ -n "$TEST_LIST" ]]; then
        TEST_LIST="${TEST_LIST}
${test_entry}"
    else
        TEST_LIST="$test_entry"
    fi

    if [[ "$LIST_ONLY" = true ]]; then return; fi

    if [[ -n "$SINGLE_TEST" ]]; then
        if ! contains_ci "$name" "$SINGLE_TEST"; then return; fi
    fi

    if [[ -n "$SINGLE_CATEGORY" ]]; then
        if ! contains_ci "$CURRENT_CATEGORY" "$SINGLE_CATEGORY"; then return; fi
    fi

    local fixture_path="$FIXTURES/$fixture"
    local start_time
    start_time=$(get_time_ms)

    if [[ ! -d "$fixture_path" ]]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(fixture not found: $fixture)${NC}" >&2
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi

    if [[ ! -f "$VALIDATOR" ]]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(validator not found)${NC}" >&2
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi

    local exit_code=0
    local output
    local -a validator_cmd=("$VALIDATOR" "$fixture_path")
    if [[ -n "$flags" ]]; then
        local -a flag_args=()
        # Intentional split: flags are provided as a CLI fragment.
        # shellcheck disable=SC2206
        flag_args=($flags)
        validator_cmd+=("${flag_args[@]}")
    fi
    if [[ -n "$env_vars" ]]; then
        local -a env_args=()
        # Intentional split: env_vars are KEY=VALUE assignments.
        # shellcheck disable=SC2206
        env_args=($env_vars)
        output=$(env "${env_args[@]}" "${validator_cmd[@]}" 2>&1) || exit_code=$?
    else
        output=$("${validator_cmd[@]}" 2>&1) || exit_code=$?
    fi

    local end_time
    end_time=$(get_time_ms)
    local elapsed=$((end_time - start_time))
    local time_display
    time_display=$(format_time "$elapsed")
    CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
    TOTAL_TIME=$((TOTAL_TIME + elapsed))

    local actual
    case $exit_code in
        0) actual="pass" ;;
        1) actual="warn" ;;
        *) actual="fail" ;;
    esac

    if [[ "$actual" = "$expect" ]]; then
        echo -e "${GREEN}✓${NC} $name ${DIM}[${time_display}]${NC}"
        PASSED=$((PASSED + 1))
        CURRENT_CAT_PASSED=$((CURRENT_CAT_PASSED + 1))
        if [[ "$VERBOSE" = true ]] && [[ -n "$output" ]]; then
            echo -e "${DIM}  Output:${NC}"
            echo "$output" | sed 's/^/    /' | head -15
        fi
    else
        echo -e "${RED}✗${NC} $name ${DIM}[${time_display}]${NC}"
        echo -e "  ${RED}Expected:${NC} $expect, ${RED}Got:${NC} $actual (exit code: $exit_code)"
        echo -e "  ${DIM}Output:${NC}"
        echo "$output" | sed 's/^/    /'
        FAILED=$((FAILED + 1))
        CURRENT_CAT_FAILED=$((CURRENT_CAT_FAILED + 1))
    fi
}

run_test_json_valid() {
    local name="$1"
    local fixture="$2"
    local expect="$3"

    # Register test for listing
    local test_entry="[$CURRENT_CATEGORY] $name"
    if [[ -n "$TEST_LIST" ]]; then
        TEST_LIST="${TEST_LIST}
${test_entry}"
    else
        TEST_LIST="$test_entry"
    fi

    if [[ "$LIST_ONLY" = true ]]; then return; fi

    if [[ -n "$SINGLE_TEST" ]]; then
        if ! contains_ci "$name" "$SINGLE_TEST"; then return; fi
    fi

    if [[ -n "$SINGLE_CATEGORY" ]]; then
        if ! contains_ci "$CURRENT_CATEGORY" "$SINGLE_CATEGORY"; then return; fi
    fi

    local fixture_path="$FIXTURES/$fixture"
    local start_time
    start_time=$(get_time_ms)

    if [[ ! -d "$fixture_path" ]]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(fixture not found)${NC}" >&2
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi

    local exit_code=0
    local output
    output=$("$VALIDATOR" "$fixture_path" --json 2>&1) || exit_code=$?

    local end_time
    end_time=$(get_time_ms)
    local elapsed=$((end_time - start_time))
    local time_display
    time_display=$(format_time "$elapsed")
    CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
    TOTAL_TIME=$((TOTAL_TIME + elapsed))

    local actual
    case $exit_code in
        0) actual="pass" ;;
        1) actual="warn" ;;
        *) actual="fail" ;;
    esac

    local json_valid=false
    echo "$output" | python3 -m json.tool > /dev/null 2>&1 && json_valid=true

    local has_fields="False"
    if [[ "$json_valid" = true ]]; then
        has_fields=$(echo "$output" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    required = ['version', 'folder', 'passed', 'results', 'summary']
    print('True' if all(k in d for k in required) else 'False')
except: print('False')
" 2>/dev/null || echo "False")
    fi

    if [[ "$actual" = "$expect" ]] && [[ "$json_valid" = true ]] && [[ "$has_fields" = "True" ]]; then
        echo -e "${GREEN}✓${NC} $name ${DIM}[${time_display}]${NC}"
        PASSED=$((PASSED + 1))
        CURRENT_CAT_PASSED=$((CURRENT_CAT_PASSED + 1))
        if [[ "$VERBOSE" = true ]]; then
            echo -e "${DIM}  JSON (formatted):${NC}"
            echo "$output" | python3 -m json.tool 2>/dev/null | sed 's/^/    /' | head -15
        fi
    else
        echo -e "${RED}✗${NC} $name ${DIM}[${time_display}]${NC}"
        [[ "$actual" != "$expect" ]] && echo -e "  ${RED}Expected:${NC} $expect, ${RED}Got:${NC} $actual"
        [[ "$json_valid" != true ]] && echo -e "  ${RED}JSON validation failed${NC}"
        [[ "$has_fields" != "True" ]] && echo -e "  ${RED}Missing required JSON fields${NC}"
        echo -e "  ${DIM}Output:${NC}"
        echo "$output" | sed 's/^/    /'
        FAILED=$((FAILED + 1))
        CURRENT_CAT_FAILED=$((CURRENT_CAT_FAILED + 1))
    fi
}

run_test_quiet() {
    local name="$1"
    local fixture="$2"
    local expect="$3"

    # Register test for listing
    local test_entry="[$CURRENT_CATEGORY] $name"
    if [[ -n "$TEST_LIST" ]]; then
        TEST_LIST="${TEST_LIST}
${test_entry}"
    else
        TEST_LIST="$test_entry"
    fi

    if [[ "$LIST_ONLY" = true ]]; then return; fi

    if [[ -n "$SINGLE_TEST" ]]; then
        if ! contains_ci "$name" "$SINGLE_TEST"; then return; fi
    fi

    if [[ -n "$SINGLE_CATEGORY" ]]; then
        if ! contains_ci "$CURRENT_CATEGORY" "$SINGLE_CATEGORY"; then return; fi
    fi

    local fixture_path="$FIXTURES/$fixture"
    local start_time
    start_time=$(get_time_ms)

    if [[ ! -d "$fixture_path" ]]; then
        local end_time
        end_time=$(get_time_ms)
        local elapsed=$((end_time - start_time))
        echo -e "${YELLOW}⊘${NC} $name ${DIM}(fixture not found)${NC}" >&2
        SKIPPED=$((SKIPPED + 1))
        CURRENT_CAT_SKIPPED=$((CURRENT_CAT_SKIPPED + 1))
        CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
        TOTAL_TIME=$((TOTAL_TIME + elapsed))
        return
    fi

    local exit_code=0
    local output
    output=$("$VALIDATOR" "$fixture_path" --quiet 2>&1) || exit_code=$?

    local end_time
    end_time=$(get_time_ms)
    local elapsed=$((end_time - start_time))
    local time_display
    time_display=$(format_time "$elapsed")
    CURRENT_CAT_TIME=$((CURRENT_CAT_TIME + elapsed))
    TOTAL_TIME=$((TOTAL_TIME + elapsed))

    local actual
    case $exit_code in
        0) actual="pass" ;;
        1) actual="warn" ;;
        *) actual="fail" ;;
    esac

    local line_count
    line_count=$(echo -n "$output" | wc -l | tr -d ' ')

    # Quiet mode should produce 0-2 lines max
    if [[ "$actual" = "$expect" ]] && [[ "$line_count" -le 2 ]]; then
        echo -e "${GREEN}✓${NC} $name ${DIM}[${time_display}]${NC}"
        PASSED=$((PASSED + 1))
        CURRENT_CAT_PASSED=$((CURRENT_CAT_PASSED + 1))
        if [[ "$VERBOSE" = true ]]; then
            echo -e "${DIM}  Output lines: ${line_count}${NC}"
        fi
    else
        echo -e "${RED}✗${NC} $name ${DIM}[${time_display}]${NC}"
        [[ "$actual" != "$expect" ]] && echo -e "  ${RED}Expected:${NC} $expect, ${RED}Got:${NC} $actual"
        [[ "$line_count" -gt 2 ]] && echo -e "  ${RED}Quiet mode produced too much output (${line_count} lines)${NC}"
        echo -e "  ${DIM}Output:${NC}"
        echo "$output" | sed 's/^/    /'
        FAILED=$((FAILED + 1))
        CURRENT_CAT_FAILED=$((CURRENT_CAT_FAILED + 1))
    fi
}

# ───────────────────────────────────────────────────────────────
# 5. PARSE ARGUMENTS
# ───────────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
    case $1 in
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -t|--test)
            SINGLE_TEST="$2"
            shift 2
            ;;
        -c|--category)
            SINGLE_CATEGORY="$2"
            shift 2
            ;;
        -l|--list)
            LIST_ONLY=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use -h for help"
            exit 1
            ;;
    esac
done

# ───────────────────────────────────────────────────────────────
# 6. HEADER
# ───────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}───────────────────────────────────────────────────────────────
${NC}"
echo -e "${BLUE}${BOLD}  validate-spec.sh Test Suite v2.0${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────────
${NC}"

if [[ "$LIST_ONLY" = true ]]; then
    echo -e "${DIM}  Mode: List only${NC}"
elif [[ -n "$SINGLE_TEST" ]]; then
    echo -e "${DIM}  Filter: test matching \"$SINGLE_TEST\"${NC}"
elif [[ -n "$SINGLE_CATEGORY" ]]; then
    echo -e "${DIM}  Filter: category matching \"$SINGLE_CATEGORY\"${NC}"
fi

if [[ "$VERBOSE" = true ]]; then
    echo -e "${DIM}  Verbose: enabled${NC}"
fi

# ───────────────────────────────────────────────────────────────
# 7. TEST CASES
# ───────────────────────────────────────────────────────────────

# ─────────────────────────────────────────────────────────────────
# POSITIVE TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "Positive Tests (should PASS or WARN)"; then
    run_test "Compliant Level 2 template fixture" "053-template-compliant-level2" "pass"
    run_test "Extra custom header warns without failing" "054-template-extra-header" "warn"
fi

# ─────────────────────────────────────────────────────────────────
# LEVEL_DECLARED RULE TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "Level Declaration Tests (should PASS or WARN)"; then
    run_test "Explicit level declaration on compliant fixture" "053-template-compliant-level2" "pass"
fi

# ─────────────────────────────────────────────────────────────────
# WARNING TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "Warning Tests (should WARN)"; then
    run_test "Template extra custom header warns" "054-template-extra-header" "warn"
fi

# ─────────────────────────────────────────────────────────────────
# SECTIONS_PRESENT RULE TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "Sections Present Tests (should FAIL on missing)"; then
    run_test "Missing required spec header now fails" "055-template-missing-header" "fail"
fi

# ─────────────────────────────────────────────────────────────────
# NEGATIVE TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "Negative Tests (should FAIL)"; then
    run_test "Missing required files (no spec.md)" "006-missing-required-files" "fail"
    run_test "Unfilled placeholders" "005-unfilled-placeholders" "fail"
    run_test "Invalid anchors (unclosed, mismatched, orphaned)" "008-invalid-anchors" "fail"
    run_test "Empty folder (all L1 files missing)" "001-empty-folder" "fail"
    run_test "Missing plan.md (L1)" "032-missing-plan" "fail"
    run_test "Missing tasks.md (L1)" "035-missing-tasks" "fail"
    run_test "Level 2 missing checklist.md" "027-level2-missing-checklist" "fail"
    run_test "Level 3 missing decision-record.md" "028-level3-missing-decision" "fail"
    run_test "Missing required header fails" "055-template-missing-header" "fail"
    run_test "Reordered required header fails" "056-template-reordered-header" "fail"
    run_test "Missing required anchor fails" "057-template-missing-anchor" "fail"
    run_test "Reordered required anchor fails" "058-template-reordered-anchor" "fail"
    run_test "Checklist H1 mismatch fails" "059-checklist-h1-invalid" "fail"
    run_test "Checklist CHK format mismatch fails" "060-checklist-chk-format-invalid" "fail"
fi

# ─────────────────────────────────────────────────────────────────
# PRIORITY_TAGS EDGE CASE TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "Priority Tags Edge Cases"; then
    run_test "Legacy bare priority format now fails" "060-checklist-chk-format-invalid" "fail"
fi

# ─────────────────────────────────────────────────────────────────
# ANCHOR EDGE CASE TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "Anchor Edge Cases"; then
    run_test "Compliant anchor order passes" "053-template-compliant-level2" "pass"
    run_test "Missing required anchor fails" "057-template-missing-anchor" "fail" "ANCHORS_VALID"
    run_test "Reordered required anchor fails" "058-template-reordered-anchor" "fail" "ANCHORS_VALID"
fi

# ─────────────────────────────────────────────────────────────────
# EVIDENCE_CITED EDGE CASE TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "Evidence Edge Cases"; then
    run_test "Compliant evidence citations pass" "053-template-compliant-level2" "pass"
fi

# ─────────────────────────────────────────────────────────────────
# PLACEHOLDER_FILLED EDGE CASE TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "Placeholder Edge Cases"; then
    run_test "Compliant fixture stays placeholder-free" "053-template-compliant-level2" "pass"
    run_test "Multiple placeholders across files (all detected)" "036-multiple-placeholders" "fail"
    run_test "Placeholder case variations (detected)" "037-placeholder-case-variations" "fail"
fi

# ─────────────────────────────────────────────────────────────────
# CLI OPTIONS TESTS
# ─────────────────────────────────────────────────────────────────
if begin_category "CLI Options Tests"; then
    run_test_json_valid "--json produces valid JSON with required fields" "053-template-compliant-level2" "pass"

    run_test_with_flags "--strict mode: warnings become errors" "054-template-extra-header" "fail" "--strict"

    run_test_quiet "--quiet mode: minimal output" "053-template-compliant-level2" "pass"

    run_test_with_flags "Env var: SPECKIT_STRICT=true" "054-template-extra-header" "fail" "" "SPECKIT_STRICT=true"
    run_test "Compliant fixture remains stable across default rule order" "053-template-compliant-level2" "pass"
fi

# Save final category
save_category_summary

# ───────────────────────────────────────────────────────────────
# 8. LIST MODE OUTPUT
# ───────────────────────────────────────────────────────────────

if [[ "$LIST_ONLY" = true ]]; then
    echo ""
    echo -e "${BLUE}${BOLD}Available Categories:${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    echo "$CATEGORY_LIST" | while IFS= read -r cat; do
        [[ -n "$cat" ]] && echo "  • $cat"
    done

    echo ""
    echo -e "${BLUE}${BOLD}Available Tests:${NC}"
    echo "─────────────────────────────────────────────────────────────────"
    echo "$TEST_LIST" | while IFS= read -r test; do
        [[ -n "$test" ]] && echo "  • $test"
    done
    
    cat_count=$(echo "$CATEGORY_LIST" | grep -c . || echo 0)
    test_count=$(echo "$TEST_LIST" | grep -c . || echo 0)
    
    echo ""
    echo -e "${DIM}Total: ${test_count} tests in ${cat_count} categories${NC}"
    echo ""
    exit 0
fi

# ───────────────────────────────────────────────────────────────
# 9. SUMMARY
# ───────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}───────────────────────────────────────────────────────────────
${NC}"
echo -e "${BLUE}${BOLD}  Summary${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────────
${NC}"
echo ""

# Per-category breakdown
echo -e "${BOLD}By Category:${NC}"
echo "─────────────────────────────────────────────────────────────────"

if [[ -n "$CATEGORY_SUMMARIES" ]]; then
    echo "$CATEGORY_SUMMARIES" | while IFS='|' read -r cat_name cat_p cat_f cat_s cat_time; do
        [[ -z "$cat_name" ]] && continue
        cat_total=$((cat_p + cat_f + cat_s))

        # Color-code based on results
        if [[ "$cat_f" -gt 0 ]]; then
            echo -e "  ${RED}●${NC} ${cat_name}: ${GREEN}${cat_p}${NC}/${cat_total} passed ${DIM}(${cat_time})${NC}"
        elif [[ "$cat_s" -eq "$cat_total" ]]; then
            echo -e "  ${YELLOW}●${NC} ${cat_name}: ${YELLOW}${cat_s}${NC} skipped ${DIM}(${cat_time})${NC}"
        else
            echo -e "  ${GREEN}●${NC} ${cat_name}: ${GREEN}${cat_p}${NC}/${cat_total} passed ${DIM}(${cat_time})${NC}"
        fi
    done
fi

echo ""
echo -e "${BOLD}Totals:${NC}"
echo "─────────────────────────────────────────────────────────────────"

TOTAL=$((PASSED + FAILED + SKIPPED))
TOTAL_TIME_FMT=$(format_time "$TOTAL_TIME")

echo -e "  ${GREEN}Passed:${NC}  $PASSED"
echo -e "  ${RED}Failed:${NC}  $FAILED" >&2
echo -e "  ${YELLOW}Skipped:${NC} $SKIPPED"
echo -e "  ─────────────"
echo -e "  Total:   $TOTAL"
echo -e "  ${DIM}Time:    $TOTAL_TIME_FMT${NC}"
echo ""

# ───────────────────────────────────────────────────────────────
# 10. EXIT
# ───────────────────────────────────────────────────────────────

if [[ $FAILED -gt 0 ]]; then
    echo -e "${RED}${BOLD}RESULT: FAILED${NC}" >&2
    echo ""
    exit 1
elif [[ $SKIPPED -eq $TOTAL ]] && [[ $TOTAL -gt 0 ]]; then
    echo -e "${YELLOW}${BOLD}RESULT: SKIPPED${NC}"
    echo "Validator or fixtures not found. Ensure validate-spec.sh exists." >&2
    echo ""
    exit 0
elif [[ $TOTAL -eq 0 ]]; then
    echo -e "${YELLOW}${BOLD}RESULT: NO TESTS RUN${NC}"
    echo "No tests matched the filter criteria."
    echo ""
    exit 0
else
    echo -e "${GREEN}${BOLD}RESULT: PASSED${NC}"
    echo ""
    exit 0
fi

# Exit codes:
#   0 - Success
#   1 - General error

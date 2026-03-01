#!/bin/bash
# ───────────────────────────────────────────────────────────────
# Test Runner: SpecKit Template Complexity System
#
# Runs all test suites and reports results
# Usage: ./run-tests.sh [--verbose] [--bail]
# ───────────────────────────────────────────────────────────────

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERBOSE=false
BAIL=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --verbose|-v)
            VERBOSE=true
            ;;
        --bail|-b)
            BAIL=true
            ;;
        --help|-h)
            echo "Usage: ./run-tests.sh [--verbose] [--bail]"
            echo ""
            echo "Options:"
            echo "  --verbose, -v    Show detailed test output"
            echo "  --bail, -b       Stop on first failure"
            echo "  --help, -h       Show this help"
            exit 0
            ;;
    esac
done

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Results tracking
TOTAL_PASSED=0
TOTAL_FAILED=0
SUITES_PASSED=0
SUITES_FAILED=0

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       SpecKit Template Complexity - Test Suite               ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

run_test_suite() {
    local name="$1"
    local command="$2"

    echo -e "${YELLOW}▶ Running: ${name}${NC}"

    if $VERBOSE; then
        output=$(eval "$command" 2>&1)
        exit_code=$?
        echo "$output"
    else
        output=$(eval "$command" 2>&1)
        exit_code=$?
    fi

    # Extract passed/failed counts from output
    passed=$(echo "$output" | grep -oE 'Passed: [0-9]+' | grep -oE '[0-9]+' || echo "0")
    failed=$(echo "$output" | grep -oE 'Failed: [0-9]+' | grep -oE '[0-9]+' || echo "0")

    if [ -z "$passed" ]; then passed=0; fi
    if [ -z "$failed" ]; then failed=0; fi

    TOTAL_PASSED=$((TOTAL_PASSED + passed))
    TOTAL_FAILED=$((TOTAL_FAILED + failed))

    if [ $exit_code -eq 0 ]; then
        echo -e "  ${GREEN}✓ PASSED${NC} (${passed} tests)"
        ((SUITES_PASSED++))
    else
        echo -e "  ${RED}✗ FAILED${NC} (${passed} passed, ${failed} failed)"
        ((SUITES_FAILED++))

        # Show failures in non-verbose mode
        if ! $VERBOSE; then
            echo ""
            echo "$output" | grep -A1 "✗" | head -20
            echo ""
        fi

        if $BAIL; then
            echo -e "${RED}Bailing on first failure${NC}"
            exit 1
        fi
    fi

    echo ""
}

# ───────────────────────────────────────────────────────────────
# JavaScript Test Suites
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}─── JavaScript Tests ───${NC}"
echo ""

run_test_suite "Complexity Detector" "node '$SCRIPT_DIR/test-detector.js'"
run_test_suite "Marker Parser" "node '$SCRIPT_DIR/test-marker-parser.js'"
run_test_suite "Template Preprocessor" "node '$SCRIPT_DIR/test-preprocessor.js'"
run_test_suite "Classifier & Features" "node '$SCRIPT_DIR/test-classifier.js'"

# ───────────────────────────────────────────────────────────────
# Shell Test Suite
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}─── CLI Script Tests ───${NC}"
echo ""

run_test_suite "CLI Scripts" "bash '$SCRIPT_DIR/test-cli.sh'"

# ───────────────────────────────────────────────────────────────
# Summary
# ───────────────────────────────────────────────────────────────

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}SUMMARY${NC}"
echo ""
echo "  Test Suites: ${SUITES_PASSED} passed, ${SUITES_FAILED} failed"
echo "  Total Tests: ${TOTAL_PASSED} passed, ${TOTAL_FAILED} failed"
echo ""

if [ $TOTAL_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    ALL TESTS PASSED ✓                        ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    TESTS FAILED ✗                            ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi

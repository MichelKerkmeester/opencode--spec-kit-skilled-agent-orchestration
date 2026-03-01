#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# TEST RUNNER - Spec 072 Test Infrastructure (Shell Wrapper)
# Runs Node.js tests and any shell-based tests with colored output
# ───────────────────────────────────────────────────────────────

set -e

# ─────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
BOLD='\033[1m'
RESET='\033[0m'

# Counters
TOTAL_PASSED=0
TOTAL_FAILED=0
SHELL_TESTS_RUN=0
NODE_TESTS_RUN=0

# ─────────────────────────────────────────────────────────────
# 2. UTILITY FUNCTIONS
# ─────────────────────────────────────────────────────────────

print_banner() {
    echo ""
    echo -e "${BOLD}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "${BOLD}  🧪 SPEC 072 TEST RUNNER (Shell Wrapper)${RESET}"
    echo -e "${BOLD}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "  Date: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    echo -e "  Directory: $TESTS_DIR"
    echo -e "${BOLD}═══════════════════════════════════════════════════════════════${RESET}"
}

print_section() {
    echo ""
    echo -e "${CYAN}────────────────────────────────────────────────────────────────${RESET}"
    echo -e "${CYAN}$1${RESET}"
    echo -e "${CYAN}────────────────────────────────────────────────────────────────${RESET}"
}

print_success() {
    echo -e "${GREEN}✅ $1${RESET}"
}

print_error() {
    echo -e "${RED}❌ $1${RESET}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${RESET}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${RESET}"
}

# ─────────────────────────────────────────────────────────────
# 3. TEST RUNNERS
# ─────────────────────────────────────────────────────────────

run_node_tests() {
    print_section "📦 Running Node.js Tests"

    local node_runner="$TESTS_DIR/run-all-tests.js"

    if [[ -f "$node_runner" ]]; then
        echo -e "${GRAY}Running: node $node_runner${RESET}"
        echo ""

        # Run Node.js test runner
        if node "$node_runner"; then
            NODE_TESTS_RUN=1
            TOTAL_PASSED=$((TOTAL_PASSED + 1))
            return 0
        else
            NODE_TESTS_RUN=1
            TOTAL_FAILED=$((TOTAL_FAILED + 1))
            return 1
        fi
    else
        print_warning "Node.js test runner not found: $node_runner"
        return 0
    fi
}

run_shell_tests() {
    print_section "🐚 Running Shell Tests"

    # Find all *.test.sh files
    local shell_tests=()
    while IFS= read -r -d '' file; do
        shell_tests+=("$file")
    done < <(find "$TESTS_DIR" -name "*.test.sh" -type f -print0 2>/dev/null || true)

    if [[ ${#shell_tests[@]} -eq 0 ]]; then
        echo -e "${GRAY}   No shell test files found (*.test.sh)${RESET}"
        return 0
    fi

    echo -e "${BLUE}   Found ${#shell_tests[@]} shell test file(s)${RESET}"

    local shell_passed=0
    local shell_failed=0

    for test_file in "${shell_tests[@]}"; do
        local relative_path="${test_file#$TESTS_DIR/}"
        echo ""
        echo -e "${CYAN}   📄 Running: $relative_path${RESET}"

        # Make executable if not already
        chmod +x "$test_file" 2>/dev/null || true

        # Run the test
        local start_time=$(date +%s%N)

        if bash "$test_file"; then
            local end_time=$(date +%s%N)
            local duration=$(( (end_time - start_time) / 1000000 ))
            print_success "   $relative_path (${duration}ms)"
            shell_passed=$((shell_passed + 1))
        else
            local end_time=$(date +%s%N)
            local duration=$(( (end_time - start_time) / 1000000 ))
            print_error "   $relative_path (${duration}ms)"
            shell_failed=$((shell_failed + 1))
        fi
    done

    SHELL_TESTS_RUN=$((shell_passed + shell_failed))
    TOTAL_PASSED=$((TOTAL_PASSED + shell_passed))
    TOTAL_FAILED=$((TOTAL_FAILED + shell_failed))

    if [[ $shell_failed -gt 0 ]]; then
        return 1
    fi
    return 0
}

run_verification_scripts() {
    print_section "🔍 Running Verification Scripts"

    local verification_dir="$SCRIPT_DIR/../verification"

    if [[ ! -d "$verification_dir" ]]; then
        echo -e "${GRAY}   No verification directory found${RESET}"
        return 0
    fi

    # Find verification scripts
    local verify_scripts=()
    while IFS= read -r -d '' file; do
        verify_scripts+=("$file")
    done < <(find "$verification_dir" -name "verify-*.js" -type f -print0 2>/dev/null || true)

    if [[ ${#verify_scripts[@]} -eq 0 ]]; then
        echo -e "${GRAY}   No verification scripts found (verify-*.js)${RESET}"
        return 0
    fi

    echo -e "${BLUE}   Found ${#verify_scripts[@]} verification script(s)${RESET}"

    local verify_passed=0
    local verify_failed=0

    for script in "${verify_scripts[@]}"; do
        local script_name=$(basename "$script")
        echo ""
        echo -e "${CYAN}   📄 Running: $script_name${RESET}"

        if node "$script"; then
            print_success "   $script_name"
            verify_passed=$((verify_passed + 1))
        else
            print_error "   $script_name"
            verify_failed=$((verify_failed + 1))
        fi
    done

    TOTAL_PASSED=$((TOTAL_PASSED + verify_passed))
    TOTAL_FAILED=$((TOTAL_FAILED + verify_failed))

    if [[ $verify_failed -gt 0 ]]; then
        return 1
    fi
    return 0
}

# ─────────────────────────────────────────────────────────────
# 4. SUMMARY
# ─────────────────────────────────────────────────────────────

print_summary() {
    echo ""
    echo -e "${BOLD}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "${BOLD}  📊 FINAL SUMMARY${RESET}"
    echo -e "${BOLD}═══════════════════════════════════════════════════════════════${RESET}"
    echo ""

    local total=$((TOTAL_PASSED + TOTAL_FAILED))

    echo -e "  ${GREEN}✅ Passed:  $TOTAL_PASSED${RESET}"

    if [[ $TOTAL_FAILED -gt 0 ]]; then
        echo -e "  ${RED}❌ Failed:  $TOTAL_FAILED${RESET}"
    else
        echo -e "  ❌ Failed:  0"
    fi

    echo -e "  📝 Total:   $total"
    echo ""

    if [[ $TOTAL_FAILED -eq 0 ]]; then
        echo -e "  ${GREEN}🎉 ALL TESTS PASSED!${RESET}"
    else
        echo -e "  ${RED}⚠️  SOME TESTS FAILED${RESET}"
    fi

    echo -e "${BOLD}═══════════════════════════════════════════════════════════════${RESET}"
    echo ""
}

# ─────────────────────────────────────────────────────────────
# 5. MAIN
# ─────────────────────────────────────────────────────────────

main() {
    local start_time=$(date +%s)
    local exit_code=0

    print_banner

    # Run Node.js tests
    if ! run_node_tests; then
        exit_code=1
    fi

    # Run shell tests
    if ! run_shell_tests; then
        exit_code=1
    fi

    # Run verification scripts
    if ! run_verification_scripts; then
        exit_code=1
    fi

    # Calculate duration
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    # Print summary
    print_summary
    echo -e "  ${GRAY}Total execution time: ${duration}s${RESET}"
    echo ""

    exit $exit_code
}

# Handle arguments
case "${1:-}" in
    -h|--help)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  -h, --help     Show this help message"
        echo "  -v, --verbose  Enable verbose output"
        echo ""
        echo "Runs all tests in the spec 072 tests directory:"
        echo "  - *.test.js files via Node.js"
        echo "  - *.test.sh files via Bash"
        echo "  - verify-*.js files in verification directory"
        exit 0
        ;;
    -v|--verbose)
        export TEST_VERBOSE=true
        ;;
esac

# Run main
main

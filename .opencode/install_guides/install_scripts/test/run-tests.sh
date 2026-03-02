#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP INSTALL SCRIPT TEST RUNNER
# ───────────────────────────────────────────────────────────────
# Runs MCP install script tests inside Docker containers to
# validate installation logic in a clean environment.
#
# Usage:
#   .opencode/install_guides/install_scripts/test/run-tests.sh [script-name]
#
# Examples:
#   .opencode/install_guides/install_scripts/test/run-tests.sh                    # Run all tests
#   .opencode/install_guides/install_scripts/test/run-tests.sh sequential-thinking # Run specific test

set -euo pipefail
IFS=$'\n\t'

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"
readonly IMAGE_NAME="mcp-install-test"

# ───────────────────────────────────────────────────────────────
# 2. COLORS & LOGGING
# ───────────────────────────────────────────────────────────────
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'

log_info() { echo -e "${CYAN}[INFO]${NC} ${1}"; }
log_success() { echo -e "${GREEN}[OK]${NC} ${1}"; }
log_error() { echo -e "${RED}[ERROR]${NC} ${1}" >&2; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} ${1}"; }

# ───────────────────────────────────────────────────────────────
# 3. DOCKER FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Build Docker image if needed
build_image() {
    log_info "Building Docker test image..."
    docker build -t "${IMAGE_NAME}" "${SCRIPT_DIR}" || {
        log_error "Failed to build Docker image"
        exit 1
    }
    log_success "Docker image built: ${IMAGE_NAME}"
}

# ───────────────────────────────────────────────────────────────
# 4. TEST FUNCTIONS
# ───────────────────────────────────────────────────────────────

# Run a single script test
run_test() {
    local script_name="$1"
    local script_path=".opencode/install_guides/install_scripts/install-${script_name}.sh"
    
    log_info "Testing: ${script_name}"
    
    # Run in Docker with workspace mounted
    if docker run --rm \
        -v "${PROJECT_ROOT}:/workspace" \
        -w /workspace \
        "${IMAGE_NAME}" \
        bash -c "
            # Create minimal opencode.json if not mounted correctly
            if [[ ! -f opencode.json ]]; then
                echo '{\"mcp\": {}}' > opencode.json
            fi
            
            # Run the install script
            ${script_path} --verbose
        " 2>&1; then
        log_success "${script_name} - PASSED"
        return 0
    else
        log_error "${script_name} - FAILED"
        return 1
    fi
}

# Run all tests
run_all_tests() {
    local passed=0
    local failed=0
    local scripts=(
        "sequential-thinking"
        "code-mode"
        # Skip spec-kit-memory - requires bundled files
        # Skip chrome-devtools - requires Chrome
    )
    
    echo ""
    echo "┌─────────────────────────────────────────────────────────────────┐"
    echo "│           MCP Install Scripts - Docker Test Suite             │"
    echo "└─────────────────────────────────────────────────────────────────┘"
    echo ""
    
    for script in "${scripts[@]}"; do
        if run_test "${script}"; then
            ((passed++))
        else
            ((failed++))
        fi
        echo ""
    done
    
    echo "───────────────────────────────────────────────────────────────"
    echo "RESULTS"
    echo "───────────────────────────────────────────────────────────────"
    echo -e "${GREEN}Passed: ${passed}${NC}"
    echo -e "${RED}Failed: ${failed}${NC}"
    echo ""
    
    if [[ "${failed}" -gt 0 ]]; then
        exit 1
    fi
}

# ───────────────────────────────────────────────────────────────
# 5. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    # Check Docker is available
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    # Build image
    build_image
    
    # Run tests
    if [[ $# -gt 0 ]]; then
        run_test "$1"
    else
        run_all_tests
    fi
}

main "$@"

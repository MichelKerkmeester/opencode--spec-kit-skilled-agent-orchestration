#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# 138-hybrid-rag-fusion: Spec Folder Validation Script
# ───────────────────────────────────────────────────────────────
# Exit codes: 0 = all pass, 1 = warnings only, 2 = errors found
#
# Checks:
#   1. Required root spec files exist
#   2. Required subfolder implementation-summary.md files exist
#   3. ANCHOR tag integrity (no unclosed anchors)
#   4. Test suite files exist
#   5. Test suite passes (optional, runs if vitest available)
# ───────────────────────────────────────────────────────────────

set -uo pipefail

# Resolve paths relative to this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPEC_DIR="$SCRIPT_DIR"
PROJECT_ROOT="$(cd "$SPEC_DIR/../../../.." && pwd)"
MCP_SERVER_DIR="$PROJECT_ROOT/.opencode/skill/system-spec-kit/mcp_server"

# Counters
ERRORS=0
WARNINGS=0
PASSES=0

# Colors (disabled for non-TTY)
if [[ -t 1 ]]; then
    RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
    BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'
else
    RED=''; GREEN=''; YELLOW=''; BLUE=''; BOLD=''; NC=''
fi

pass() {
    ((PASSES++)) || true
    printf -- "${GREEN}PASS${NC}  %s\n" "$1"
}

warn() {
    ((WARNINGS++)) || true
    printf -- "${YELLOW}WARN${NC}  %s\n" "$1"
}

fail() {
    ((ERRORS++)) || true
    printf -- "${RED}FAIL${NC}  %s\n" "$1"
}

header() {
    echo ""
    printf -- "${BLUE}${BOLD}--- %s ---${NC}\n" "$1"
}

# ───────────────────────────────────────────────────────────────
# CHECK 1: Required root spec files
# ───────────────────────────────────────────────────────────────
header "Check 1: Root spec files"

ROOT_REQUIRED=(
    "spec.md"
    "plan.md"
    "tasks.md"
    "checklist.md"
    "decision-record.md"
)

# implementation-summary.md is required but may not exist yet
# (created after implementation completes)
ROOT_EXPECTED=(
    "implementation-summary.md"
)

for f in "${ROOT_REQUIRED[@]}"; do
    if [[ -f "$SPEC_DIR/$f" ]]; then
        pass "$f exists"
    else
        fail "$f MISSING (required)"
    fi
done

for f in "${ROOT_EXPECTED[@]}"; do
    if [[ -f "$SPEC_DIR/$f" ]]; then
        pass "$f exists"
    else
        warn "$f MISSING (expected after implementation completes)"
    fi
done

# ───────────────────────────────────────────────────────────────
# CHECK 2: Subfolder implementation-summary.md files
# ───────────────────────────────────────────────────────────────
header "Check 2: Subfolder implementation-summary.md files"

SUBFOLDERS=(
    "001-system-speckit-hybrid-rag-fusion"
    "002-skill-graph-integration"
    "003-unified-graph-intelligence"
)

for sf in "${SUBFOLDERS[@]}"; do
    local_path="$SPEC_DIR/$sf/implementation-summary.md"
    if [[ -f "$local_path" ]]; then
        pass "$sf/implementation-summary.md exists"
    else
        fail "$sf/implementation-summary.md MISSING"
    fi
done

# ───────────────────────────────────────────────────────────────
# CHECK 3: ANCHOR tag integrity
# ───────────────────────────────────────────────────────────────
header "Check 3: ANCHOR tag integrity"

ANCHOR_ERRORS=0

check_anchors() {
    local file="$1"
    local rel_path="${file#$SPEC_DIR/}"

    # Extract opening and closing anchor names
    local opens closes
    opens=$(grep -oE '<!-- ANCHOR:[a-zA-Z0-9_-]+ -->' "$file" 2>/dev/null | sed 's/<!-- ANCHOR://;s/ -->//' | sort)
    closes=$(grep -oE '<!-- /ANCHOR:[a-zA-Z0-9_-]+ -->' "$file" 2>/dev/null | sed 's/<!-- \/ANCHOR://;s/ -->//' | sort)

    # Check for opens without closes
    while IFS= read -r anchor; do
        [[ -z "$anchor" ]] && continue
        if ! echo "$closes" | grep -qx "$anchor"; then
            fail "Unclosed ANCHOR:$anchor in $rel_path"
            ((ANCHOR_ERRORS++)) || true
        fi
    done <<< "$opens"

    # Check for closes without opens
    while IFS= read -r anchor; do
        [[ -z "$anchor" ]] && continue
        if ! echo "$opens" | grep -qx "$anchor"; then
            fail "Closing /ANCHOR:$anchor without opening in $rel_path"
            ((ANCHOR_ERRORS++)) || true
        fi
    done <<< "$closes"
}

# Check all .md files in the spec folder (root and subfolders)
while IFS= read -r md_file; do
    check_anchors "$md_file"
done < <(find "$SPEC_DIR" -name "*.md" -not -path "*/scratch/*" -not -path "*/node_modules/*" 2>/dev/null)

if [[ $ANCHOR_ERRORS -eq 0 ]]; then
    pass "All ANCHOR tags properly paired"
fi

# ───────────────────────────────────────────────────────────────
# CHECK 4: Test files exist
# ───────────────────────────────────────────────────────────────
header "Check 4: Test file existence"

# Key test files referenced in tasks.md
KEY_TEST_FILES=(
    "adaptive-fusion.vitest.ts"
    "hybrid-search.vitest.ts"
    "adaptive-fallback.vitest.ts"
    "mmr-reranker.vitest.ts"
    "evidence-gap-detector.vitest.ts"
    "causal-boost.vitest.ts"
    "sqlite-fts.vitest.ts"
    "query-expander.vitest.ts"
    "unit-rrf-fusion.vitest.ts"
    "integration-138-pipeline.vitest.ts"
    "graph-regression-flag-off.vitest.ts"
    "graph-search-fn.vitest.ts"
    "skill-graph-cache.vitest.ts"
    "graph-flags.vitest.ts"
    "graph-channel-benchmark.vitest.ts"
    "pipeline-integration.vitest.ts"
    "semantic-bridge.vitest.ts"
)

TEST_DIR="$MCP_SERVER_DIR/tests"
MISSING_TESTS=0

for tf in "${KEY_TEST_FILES[@]}"; do
    if [[ -f "$TEST_DIR/$tf" ]]; then
        pass "tests/$tf exists"
    else
        fail "tests/$tf MISSING"
        ((MISSING_TESTS++)) || true
    fi
done

# Count total test files
TOTAL_TESTS=$(find "$TEST_DIR" -name "*.vitest.ts" 2>/dev/null | wc -l | tr -d ' ')
pass "Total test files found: $TOTAL_TESTS"

# ───────────────────────────────────────────────────────────────
# CHECK 5: Test suite execution (if vitest available)
# ───────────────────────────────────────────────────────────────
header "Check 5: Test suite execution"

if [[ -d "$MCP_SERVER_DIR" ]] && [[ -f "$MCP_SERVER_DIR/package.json" ]]; then
    # Check if npx is available
    if command -v npx >/dev/null 2>&1; then
        echo "Running vitest (this may take a moment)..."

        # Run tests and capture exit code
        VITEST_OUTPUT=$(cd "$MCP_SERVER_DIR" && npx vitest run --reporter=verbose 2>&1) || VITEST_EXIT=$?
        VITEST_EXIT=${VITEST_EXIT:-0}

        if [[ $VITEST_EXIT -eq 0 ]]; then
            # Extract summary line
            SUMMARY=$(echo "$VITEST_OUTPUT" | grep -E "Tests\s+" | tail -1)
            if [[ -n "$SUMMARY" ]]; then
                pass "Test suite passed: $SUMMARY"
            else
                pass "Test suite passed (exit code 0)"
            fi
        else
            # Extract failure info
            FAILED_COUNT=$(echo "$VITEST_OUTPUT" | grep -oE '[0-9]+ failed' | head -1)
            PASSED_COUNT=$(echo "$VITEST_OUTPUT" | grep -oE '[0-9]+ passed' | head -1)
            fail "Test suite failed (exit $VITEST_EXIT): ${FAILED_COUNT:-unknown failures}, ${PASSED_COUNT:-unknown passes}"
            # Show last few lines for context
            echo "  Last 5 lines of output:"
            echo "$VITEST_OUTPUT" | tail -5 | while IFS= read -r line; do
                echo "    $line"
            done
        fi
    else
        warn "npx not available - cannot run test suite"
    fi
else
    warn "mcp_server directory not found at expected path - cannot run tests"
fi

# ───────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────
echo ""
printf -- "${BLUE}${BOLD}═══════════════════════════════════════════════════════════════${NC}\n"
printf -- "${BOLD}  VALIDATION SUMMARY${NC}\n"
printf -- "${BLUE}${BOLD}═══════════════════════════════════════════════════════════════${NC}\n"
echo ""
printf -- "  ${GREEN}Passed:${NC}   %d\n" "$PASSES"
printf -- "  ${YELLOW}Warnings:${NC} %d\n" "$WARNINGS"
printf -- "  ${RED}Errors:${NC}   %d\n" "$ERRORS"
echo ""

if [[ $ERRORS -gt 0 ]]; then
    printf -- "  ${RED}${BOLD}RESULT: FAILED${NC} (exit 2)\n"
    echo ""
    exit 2
elif [[ $WARNINGS -gt 0 ]]; then
    printf -- "  ${YELLOW}${BOLD}RESULT: PASSED WITH WARNINGS${NC} (exit 1)\n"
    echo ""
    exit 1
else
    printf -- "  ${GREEN}${BOLD}RESULT: PASSED${NC} (exit 0)\n"
    echo ""
    exit 0
fi

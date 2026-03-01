#!/bin/bash
# ───────────────────────────────────────────────────────────────
# Test Suite: CLI Scripts
#
# Tests for detect-complexity.js and expand-template.js
# Run with: ./test-cli.sh
# ───────────────────────────────────────────────────────────────

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
SCRIPTS_DIR="$REPO_ROOT/.opencode/skill/system-spec-kit/scripts"

PASSED=0
FAILED=0

# Test helper functions
pass() {
    echo "  ✓ $1"
    ((PASSED++))
}

fail() {
    echo "  ✗ $1"
    echo "    Error: $2"
    ((FAILED++))
}

test_case() {
    echo "Running: $1"
}

# ───────────────────────────────────────────────────────────────
# detect-complexity.js Tests
# ───────────────────────────────────────────────────────────────

echo ""
echo "=== detect-complexity.js Tests ==="
echo ""

echo "Basic Detection:"

# Test: Simple task detection
test_case "Simple task returns Level 1"
output=$(node "$SCRIPTS_DIR/detect-complexity.js" --request "Fix typo" --quiet 2>/dev/null)
if [ "$output" = "1" ]; then
    pass "Simple task returns Level 1"
else
    fail "Simple task returns Level 1" "Expected '1', got '$output'"
fi

# Test: JSON output
test_case "JSON output includes required fields"
output=$(node "$SCRIPTS_DIR/detect-complexity.js" --request "Add feature" --json 2>/dev/null)
if echo "$output" | grep -q '"recommendedLevel"' && echo "$output" | grep -q '"totalScore"'; then
    pass "JSON output includes required fields"
else
    fail "JSON output includes required fields" "Missing required fields in output"
fi

# Test: Help flag
test_case "Help flag shows usage"
output=$(node "$SCRIPTS_DIR/detect-complexity.js" --help 2>&1)
if echo "$output" | grep -q "USAGE"; then
    pass "Help flag shows usage"
else
    fail "Help flag shows usage" "Help text not shown"
fi

echo ""
echo "Input Validation:"

# Test: No arguments
test_case "No arguments shows error"
output=$(node "$SCRIPTS_DIR/detect-complexity.js" 2>&1)
exit_code=$?
if [ $exit_code -eq 1 ] && echo "$output" | grep -qi "error"; then
    pass "No arguments shows error"
else
    fail "No arguments shows error" "Should exit with error"
fi

# Test: Empty request
test_case "Empty request shows error"
output=$(node "$SCRIPTS_DIR/detect-complexity.js" --request "" 2>&1)
exit_code=$?
if [ $exit_code -eq 1 ]; then
    pass "Empty request shows error"
else
    fail "Empty request shows error" "Should exit with error for empty request"
fi

# Test: Non-existent file
test_case "Non-existent file shows error"
output=$(node "$SCRIPTS_DIR/detect-complexity.js" --file "/nonexistent/file.txt" 2>&1)
exit_code=$?
if [ $exit_code -eq 1 ] && echo "$output" | grep -qi "not found"; then
    pass "Non-existent file shows error"
else
    fail "Non-existent file shows error" "Should show file not found error"
fi

# Test: Valid file input (Happy Path - Gap #5)
test_case "Valid file input works"
FIXTURE_FILE="$SCRIPT_DIR/fixtures/sample-request.txt"
if [ -f "$FIXTURE_FILE" ]; then
    output=$(node "$SCRIPTS_DIR/detect-complexity.js" --file "$FIXTURE_FILE" --quiet 2>/dev/null)
    exit_code=$?
    if [ $exit_code -eq 0 ] && [ -n "$output" ]; then
        pass "Valid file input works"
    else
        fail "Valid file input works" "Exit code: $exit_code, Output: $output"
    fi
else
    fail "Valid file input works" "Fixture file not found"
fi

# Test: File input with JSON output
test_case "File input with JSON output"
if [ -f "$FIXTURE_FILE" ]; then
    output=$(node "$SCRIPTS_DIR/detect-complexity.js" --file "$FIXTURE_FILE" --json 2>/dev/null)
    if echo "$output" | grep -q '"recommendedLevel"' && echo "$output" | grep -q '"totalScore"'; then
        pass "File input with JSON output"
    else
        fail "File input with JSON output" "Missing required fields in JSON output"
    fi
else
    fail "File input with JSON output" "Fixture file not found"
fi

echo ""
echo "Complex Detection:"

# Test: Auth task detects risk
test_case "Auth task has risk score > 0"
output=$(node "$SCRIPTS_DIR/detect-complexity.js" --request "Add OAuth2 authentication" --json 2>/dev/null)
# Extract risk score from JSON (handles multi-line formatted output)
risk_score=$(echo "$output" | tr -d '\n ' | grep -o '"risk":{[^}]*"score":[0-9]*' | grep -o '"score":[0-9]*' | grep -o '[0-9]*')
if [ -n "$risk_score" ] && [ "$risk_score" -gt 0 ]; then
    pass "Auth task has risk score > 0"
else
    fail "Auth task has risk score > 0" "Risk score: $risk_score"
fi

# Test: Multi-agent task
test_case "Multi-agent task detected"
output=$(node "$SCRIPTS_DIR/detect-complexity.js" --request "Implement with 10 parallel workstreams" --json 2>/dev/null)
# Extract multiAgent score from JSON (handles multi-line formatted output)
multi_score=$(echo "$output" | tr -d '\n ' | grep -o '"multiAgent":{[^}]*"score":[0-9]*' | grep -o '"score":[0-9]*' | grep -o '[0-9]*')
if [ -n "$multi_score" ] && [ "$multi_score" -gt 0 ]; then
    pass "Multi-agent task detected"
else
    fail "Multi-agent task detected" "Multi-agent score: $multi_score"
fi

# ───────────────────────────────────────────────────────────────
# expand-template.js Tests
# ───────────────────────────────────────────────────────────────

echo ""
echo "=== expand-template.js Tests ==="
echo ""

echo "Basic Operations:"

# Test: Help flag
test_case "Help flag shows usage"
output=$(node "$SCRIPTS_DIR/expand-template.js" --help 2>&1)
if echo "$output" | grep -q "USAGE"; then
    pass "Help flag shows usage"
else
    fail "Help flag shows usage" "Help text not shown"
fi

# Test: Dry run mode
test_case "Dry run mode works"
output=$(node "$SCRIPTS_DIR/expand-template.js" --template spec.md --level 2 --dry-run 2>&1)
if echo "$output" | grep -qi "dry run"; then
    pass "Dry run mode works"
else
    fail "Dry run mode works" "Dry run output not found"
fi

echo ""
echo "Input Validation:"

# Test: No arguments
test_case "No arguments shows error"
output=$(node "$SCRIPTS_DIR/expand-template.js" 2>&1)
exit_code=$?
if [ $exit_code -eq 1 ]; then
    pass "No arguments shows error"
else
    fail "No arguments shows error" "Should exit with error"
fi

# Test: --all without --spec-folder
test_case "--all without --spec-folder shows error"
output=$(node "$SCRIPTS_DIR/expand-template.js" --all --level 2 2>&1)
exit_code=$?
if [ $exit_code -eq 1 ] && echo "$output" | grep -qi "spec-folder"; then
    pass "--all without --spec-folder shows error"
else
    fail "--all without --spec-folder shows error" "Should require spec-folder"
fi

echo ""
echo "Level Handling:"

# Test: Level 1
test_case "Accepts level 1"
output=$(node "$SCRIPTS_DIR/expand-template.js" --template spec.md --level 1 --dry-run 2>&1)
exit_code=$?
if [ $exit_code -eq 0 ]; then
    pass "Accepts level 1"
else
    fail "Accepts level 1" "Should accept level 1"
fi

# Test: Level 3+
test_case "Accepts level 3+"
output=$(node "$SCRIPTS_DIR/expand-template.js" --template spec.md --level "3+" --dry-run 2>&1)
exit_code=$?
if [ $exit_code -eq 0 ]; then
    pass "Accepts level 3+"
else
    fail "Accepts level 3+" "Should accept level 3+"
fi

# ───────────────────────────────────────────────────────────────
# Summary
# ───────────────────────────────────────────────────────────────

echo ""
echo "=== Summary ==="
echo "Passed: $PASSED"
echo "Failed: $FAILED"

if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi

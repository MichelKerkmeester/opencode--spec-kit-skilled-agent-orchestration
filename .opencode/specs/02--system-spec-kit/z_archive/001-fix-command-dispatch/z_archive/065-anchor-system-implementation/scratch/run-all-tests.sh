#!/bin/bash
# Test Runner for Anchor System & System Spec Kit

OUTPUT_FILE="test-output.txt"
echo "Running full test suite..." > "$OUTPUT_FILE"
echo "Date: $(date)" >> "$OUTPUT_FILE"
echo "---------------------------------------------------" >> "$OUTPUT_FILE"

# 1. Setup Environment for test-validation.sh
echo ">>> Setting up validation tests..." >> "$OUTPUT_FILE"
SCRIPT_ROOT="../../../../.opencode/skill/system-spec-kit/scripts"
TEST_DIR="$SCRIPT_ROOT/tests"

# Navigate to scratch dir context
cd "$(dirname "$0")"

# Adjust paths relative to scratch dir
SCRIPT_ROOT="../../../../.opencode/skill/system-spec-kit/scripts"
TEST_DIR="$SCRIPT_ROOT/tests"

if [ -d "$SCRIPT_ROOT/test-fixtures" ] && [ ! -d "$TEST_DIR/test-fixtures" ]; then
    echo "Symlinking test-fixtures..." >> "$OUTPUT_FILE"
    ln -s "../test-fixtures" "$TEST_DIR/test-fixtures"
fi

# 2. Run test-validation.sh
echo "" >> "$OUTPUT_FILE"
echo ">>> Running test-validation.sh" >> "$OUTPUT_FILE"
if [ -f "$TEST_DIR/test-validation.sh" ]; then
    # Run from test dir to ensure relative paths work
    (cd "$TEST_DIR" && ./test-validation.sh) >> "$OUTPUT_FILE" 2>&1
else
    echo "Skipped: test-validation.sh not found at $TEST_DIR/test-validation.sh" >> "$OUTPUT_FILE"
fi

# 3. Run JS System Tests
echo "" >> "$OUTPUT_FILE"
echo ">>> Running JS System Tests" >> "$OUTPUT_FILE"
for test_file in "$TEST_DIR"/*.js; do
    if [ -f "$test_file" ]; then
        echo "Running $(basename "$test_file")..." >> "$OUTPUT_FILE"
        node "$test_file" >> "$OUTPUT_FILE" 2>&1
    fi
done

# 4. Run Anchor System Tests
echo "" >> "$OUTPUT_FILE"
echo ">>> Running Anchor System Implementation Tests" >> "$OUTPUT_FILE"

if [ -f "test-parser.js" ]; then
    echo "Running test-parser.js..." >> "$OUTPUT_FILE"
    node "test-parser.js" >> "$OUTPUT_FILE" 2>&1
fi

if [ -f "verify-logic.js" ]; then
    echo "Running verify-logic.js..." >> "$OUTPUT_FILE"
    node "verify-logic.js" >> "$OUTPUT_FILE" 2>&1
fi

echo "---------------------------------------------------" >> "$OUTPUT_FILE"
echo "Tests Complete." >> "$OUTPUT_FILE"

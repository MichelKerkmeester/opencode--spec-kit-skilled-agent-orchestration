#!/bin/bash
# Memory System Testing Suite
# Tests the merged memory system in system-spec-kit
#
# Usage: ./test-suite.sh
# Run from project root

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SPEC_KIT_DIR=".opencode/skill/system-spec-kit"
MCP_SERVER="$SPEC_KIT_DIR/mcp_server/context-server.js"
DATABASE="$SPEC_KIT_DIR/database/context-index.sqlite"
CONSTITUTIONAL="$SPEC_KIT_DIR/constitutional"
GENERATE_SCRIPT="$SPEC_KIT_DIR/scripts/generate-context.js"
LIB_DIR="$SPEC_KIT_DIR/mcp_server/lib"

PASS_COUNT=0
FAIL_COUNT=0

pass() {
    echo -e "${GREEN}✓${NC} $1"
    PASS_COUNT=$((PASS_COUNT + 1))
}

fail() {
    echo -e "${RED}✗${NC} $1"
    FAIL_COUNT=$((FAIL_COUNT + 1))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "=== Memory System Testing Suite ==="
echo ""

# ============================================
# Test 1: Infrastructure Check
# ============================================
echo "Test 1: Infrastructure Check"
echo "----------------------------"

# Check MCP server exists
if [ -f "$MCP_SERVER" ]; then
    pass "MCP server exists: $MCP_SERVER"
else
    fail "MCP server NOT found: $MCP_SERVER"
fi

# Check database exists
if [ -f "$DATABASE" ]; then
    pass "Database exists: $DATABASE"
else
    warn "Database not found (will be created on first run)"
fi

# Check constitutional folder exists
if [ -d "$CONSTITUTIONAL" ]; then
    pass "Constitutional folder exists: $CONSTITUTIONAL"
else
    fail "Constitutional folder NOT found: $CONSTITUTIONAL"
fi

# Check lib modules count
LIB_COUNT=$(ls -1 "$LIB_DIR"/*.js 2>/dev/null | wc -l | tr -d ' ')
if [ "$LIB_COUNT" -eq 23 ]; then
    pass "All 23 lib modules exist"
else
    fail "Expected 23 lib modules, found $LIB_COUNT"
fi

# Check generate-context script
if [ -f "$GENERATE_SCRIPT" ]; then
    pass "generate-context.js exists"
else
    fail "generate-context.js NOT found: $GENERATE_SCRIPT"
fi

echo ""

# ============================================
# Test 2: Syntax Validation
# ============================================
echo "Test 2: Syntax Validation"
echo "-------------------------"

# Check context-server.js syntax
if node --check "$MCP_SERVER" 2>/dev/null; then
    pass "context-server.js syntax OK"
else
    fail "context-server.js has syntax errors"
fi

# Check generate-context.js syntax
if node --check "$GENERATE_SCRIPT" 2>/dev/null; then
    pass "generate-context.js syntax OK"
else
    fail "generate-context.js has syntax errors"
fi

# Check all lib modules syntax
LIB_ERRORS=0
for libfile in "$LIB_DIR"/*.js; do
    if ! node --check "$libfile" 2>/dev/null; then
        fail "Syntax error in: $(basename "$libfile")"
        LIB_ERRORS=$((LIB_ERRORS + 1))
    fi
done
if [ "$LIB_ERRORS" -eq 0 ]; then
    pass "All lib modules syntax OK"
fi

echo ""

# ============================================
# Test 3: No Old Path References
# ============================================
echo "Test 3: No Old Path References"
echo "------------------------------"

# Files to check for old system-memory paths
FILES_TO_CHECK=(
    "$MCP_SERVER"
    "$GENERATE_SCRIPT"
    "$SPEC_KIT_DIR/SKILL.md"
)

OLD_PATH_FOUND=0
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        # Check for old path references (excluding comments about migration)
        if grep -q "system-memory" "$file" 2>/dev/null; then
            # Check if it's a real path reference vs documentation
            REAL_REFS=$(grep "system-memory" "$file" | grep -v "#" | grep -v "from system-memory" | grep -v "migrated from" || true)
            if [ -n "$REAL_REFS" ]; then
                warn "Possible old path in: $(basename "$file")"
                echo "    $REAL_REFS"
                OLD_PATH_FOUND=$((OLD_PATH_FOUND + 1))
            fi
        fi
    fi
done

if [ "$OLD_PATH_FOUND" -eq 0 ]; then
    pass "No old system-memory paths found in key files"
else
    warn "$OLD_PATH_FOUND files may have old path references (review above)"
fi

echo ""

# ============================================
# Test 4: Database Integrity
# ============================================
echo "Test 4: Database Integrity"
echo "--------------------------"

if [ -f "$DATABASE" ]; then
    # Check memory_index table
    MEMORY_COUNT=$(sqlite3 "$DATABASE" "SELECT COUNT(*) FROM memory_index;" 2>/dev/null || echo "ERROR")
    if [ "$MEMORY_COUNT" != "ERROR" ]; then
        pass "memory_index table accessible: $MEMORY_COUNT records"
    else
        fail "Cannot access memory_index table"
    fi

    # Check vec_memories table (requires sqlite-vec extension)
    # Use table existence check instead of COUNT since sqlite-vec may not be available in CLI
    VEC_EXISTS=$(sqlite3 "$DATABASE" "SELECT name FROM sqlite_master WHERE type='table' AND name='vec_memories';" 2>/dev/null || echo "")
    if [ "$VEC_EXISTS" = "vec_memories" ]; then
        pass "vec_memories table exists (virtual table - requires sqlite-vec for queries)"
    else
        fail "vec_memories table NOT found"
    fi

    # Check for checkpoints table
    CP_COUNT=$(sqlite3 "$DATABASE" "SELECT COUNT(*) FROM checkpoints;" 2>/dev/null || echo "ERROR")
    if [ "$CP_COUNT" != "ERROR" ]; then
        pass "checkpoints table accessible: $CP_COUNT checkpoints"
    else
        warn "checkpoints table not found (may be created later)"
    fi
else
    warn "Database not found - skipping integrity checks"
    warn "Restart OpenCode to create database"
fi

echo ""

# ============================================
# Summary
# ============================================
echo "=== Test Summary ==="
echo ""
echo -e "Passed: ${GREEN}$PASS_COUNT${NC}"
echo -e "Failed: ${RED}$FAIL_COUNT${NC}"
echo ""

if [ "$FAIL_COUNT" -eq 0 ]; then
    echo -e "${GREEN}=== All Tests Passed ===${NC}"
    exit 0
else
    echo -e "${RED}=== $FAIL_COUNT Test(s) Failed ===${NC}"
    exit 1
fi

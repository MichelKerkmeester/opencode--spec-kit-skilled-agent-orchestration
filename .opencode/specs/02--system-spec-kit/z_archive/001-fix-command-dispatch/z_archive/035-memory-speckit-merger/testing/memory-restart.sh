#!/bin/bash
# Memory System Restart
# Cleans database and prepares for re-indexing
#
# Usage: ./memory-restart.sh
# Run from project root
#
# After running this script:
# 1. Restart OpenCode
# 2. Run memory_index_scan({ force: true }) via MCP
# 3. Verify with memory_stats()

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

SPEC_KIT_DIR=".opencode/skill/system-spec-kit"
DATABASE="$SPEC_KIT_DIR/database/context-index.sqlite"
BACKUP_DIR="$SPEC_KIT_DIR/database/backups"

echo "=== Memory System Restart ==="
echo ""

# ============================================
# Step 1: Create backup
# ============================================
echo -e "${CYAN}Step 1: Creating backup...${NC}"

if [ -f "$DATABASE" ]; then
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/context-index_$TIMESTAMP.sqlite"
    cp "$DATABASE" "$BACKUP_FILE"
    echo -e "${GREEN}✓${NC} Backup created: $BACKUP_FILE"
    
    # Also backup WAL and SHM if they exist
    if [ -f "$DATABASE-wal" ]; then
        cp "$DATABASE-wal" "$BACKUP_FILE-wal"
    fi
    if [ -f "$DATABASE-shm" ]; then
        cp "$DATABASE-shm" "$BACKUP_FILE-shm"
    fi
else
    echo -e "${YELLOW}⚠${NC} No existing database to backup"
fi

echo ""

# ============================================
# Step 2: Get current counts (before deletion)
# ============================================
echo -e "${CYAN}Step 2: Current state...${NC}"

if [ -f "$DATABASE" ]; then
    CURRENT_COUNT=$(sqlite3 "$DATABASE" "SELECT COUNT(*) FROM memory_index;" 2>/dev/null || echo "0")
    VEC_COUNT=$(sqlite3 "$DATABASE" "SELECT COUNT(*) FROM vec_memories;" 2>/dev/null || echo "0")
    echo "Current memories: $CURRENT_COUNT"
    echo "Current vectors: $VEC_COUNT"
else
    echo "No database exists"
fi

echo ""

# ============================================
# Step 3: Confirm deletion
# ============================================
echo -e "${YELLOW}WARNING: This will delete the database and require re-indexing.${NC}"
echo ""
read -p "Continue? (y/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

echo ""

# ============================================
# Step 4: Delete database
# ============================================
echo -e "${CYAN}Step 3: Deleting database...${NC}"

if [ -f "$DATABASE" ]; then
    rm -f "$DATABASE"
    rm -f "$DATABASE-wal"
    rm -f "$DATABASE-shm"
    echo -e "${GREEN}✓${NC} Database deleted"
else
    echo "No database to delete"
fi

echo ""

# ============================================
# Step 5: Instructions for re-indexing
# ============================================
echo -e "${CYAN}Step 4: Re-indexing required${NC}"
echo ""
echo "The database has been deleted. To re-index:"
echo ""
echo -e "${GREEN}1.${NC} Restart OpenCode"
echo "   - Close and reopen OpenCode"
echo "   - This clears MCP server in-memory cache"
echo "   - Database will be auto-created on first MCP call"
echo ""
echo -e "${GREEN}2.${NC} Run memory_index_scan to re-index all memory files:"
echo "   Use MCP tool: memory_index_scan({ force: true })"
echo ""
echo -e "${GREEN}3.${NC} Verify counts:"
echo "   Use MCP tool: memory_stats()"
echo ""
echo -e "${GREEN}4.${NC} Test functionality:"
echo "   Use MCP tool: memory_search({ query: \"test\" })"
echo ""

# List what will be indexed
echo -e "${CYAN}Files that will be indexed:${NC}"
echo ""

# Count constitutional files
CONST_COUNT=$(find "$SPEC_KIT_DIR/constitutional" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
echo "Constitutional memories: $CONST_COUNT files"

# Count spec folder memory files
SPEC_MEM_COUNT=$(find "specs" -path "*/memory/*.md" 2>/dev/null | wc -l | tr -d ' ')
echo "Spec folder memories: $SPEC_MEM_COUNT files"

echo ""
echo -e "${GREEN}=== Restart Complete ===${NC}"
echo ""
echo "If issues occur, run rollback.sh to restore from backup."

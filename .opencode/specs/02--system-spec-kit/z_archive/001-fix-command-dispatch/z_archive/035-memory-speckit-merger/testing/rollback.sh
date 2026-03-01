#!/bin/bash
# Memory System Rollback
# Restores database from backup if issues occur
#
# Usage: ./rollback.sh
# Run from project root

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

echo "=== Memory System Rollback ==="
echo ""

# ============================================
# Step 1: List available backups
# ============================================
echo -e "${CYAN}Available backups:${NC}"
echo ""

if [ -d "$BACKUP_DIR" ]; then
    BACKUPS=($(ls -1 "$BACKUP_DIR"/*.sqlite 2>/dev/null | xargs -n1 basename 2>/dev/null || true))
    
    if [ ${#BACKUPS[@]} -eq 0 ]; then
        echo -e "${RED}No backups found in $BACKUP_DIR${NC}"
        exit 1
    fi
    
    # List backups with numbers
    for i in "${!BACKUPS[@]}"; do
        BACKUP="${BACKUPS[$i]}"
        SIZE=$(ls -lh "$BACKUP_DIR/$BACKUP" | awk '{print $5}')
        DATE=$(echo "$BACKUP" | sed 's/context-index_//' | sed 's/.sqlite//')
        echo "  $((i+1))) $BACKUP ($SIZE)"
    done
else
    echo -e "${RED}Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

echo ""

# ============================================
# Step 2: Select backup
# ============================================
echo -e "${CYAN}Select backup to restore:${NC}"
read -p "Enter number (1-${#BACKUPS[@]}) or 'q' to quit: " SELECTION

if [[ "$SELECTION" == "q" || "$SELECTION" == "Q" ]]; then
    echo "Aborted."
    exit 0
fi

# Validate selection
if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -gt ${#BACKUPS[@]} ]; then
    echo -e "${RED}Invalid selection${NC}"
    exit 1
fi

BACKUP_FILE="${BACKUPS[$((SELECTION-1))]}"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

echo ""
echo "Selected: $BACKUP_FILE"

# ============================================
# Step 3: Confirm restore
# ============================================
echo ""
echo -e "${YELLOW}WARNING: This will replace the current database with the backup.${NC}"

if [ -f "$DATABASE" ]; then
    CURRENT_COUNT=$(sqlite3 "$DATABASE" "SELECT COUNT(*) FROM memory_index;" 2>/dev/null || echo "unknown")
    echo "Current database has: $CURRENT_COUNT memories"
fi

BACKUP_COUNT=$(sqlite3 "$BACKUP_PATH" "SELECT COUNT(*) FROM memory_index;" 2>/dev/null || echo "unknown")
echo "Backup database has: $BACKUP_COUNT memories"

echo ""
read -p "Continue with restore? (y/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# ============================================
# Step 4: Perform restore
# ============================================
echo ""
echo -e "${CYAN}Restoring backup...${NC}"

# Remove current database files
rm -f "$DATABASE"
rm -f "$DATABASE-wal"
rm -f "$DATABASE-shm"

# Copy backup
cp "$BACKUP_PATH" "$DATABASE"

# Copy WAL/SHM if they exist
if [ -f "$BACKUP_PATH-wal" ]; then
    cp "$BACKUP_PATH-wal" "$DATABASE-wal"
fi
if [ -f "$BACKUP_PATH-shm" ]; then
    cp "$BACKUP_PATH-shm" "$DATABASE-shm"
fi

echo -e "${GREEN}✓${NC} Database restored from: $BACKUP_FILE"

echo ""

# ============================================
# Step 5: Post-restore instructions
# ============================================
echo -e "${CYAN}Post-restore steps:${NC}"
echo ""
echo -e "${GREEN}1.${NC} Restart OpenCode"
echo "   - Close and reopen OpenCode"
echo "   - This clears MCP server in-memory cache"
echo ""
echo -e "${GREEN}2.${NC} Verify restore:"
echo "   Use MCP tool: memory_stats()"
echo ""
echo -e "${GREEN}3.${NC} Test functionality:"
echo "   Use MCP tool: memory_search({ query: \"test\" })"
echo ""

# Verify the restore
echo -e "${CYAN}Verifying restored database...${NC}"
RESTORED_COUNT=$(sqlite3 "$DATABASE" "SELECT COUNT(*) FROM memory_index;" 2>/dev/null || echo "ERROR")
if [ "$RESTORED_COUNT" != "ERROR" ]; then
    echo -e "${GREEN}✓${NC} Database accessible: $RESTORED_COUNT memories"
else
    echo -e "${RED}✗${NC} Database may be corrupted - try different backup"
fi

echo ""
echo -e "${GREEN}=== Rollback Complete ===${NC}"

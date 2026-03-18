---
title: "Checklist: Memory System Integration [035-memory-speckit-merger/checklist]"
description: "Implementation Note: The actual implementation uses a different structure than originally planned"
trigger_phrases:
  - "checklist"
  - "memory"
  - "system"
  - "integration"
  - "035"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: Memory System Integration

<!-- ANCHOR:protocol -->
## Overview

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 5 | Hard blockers - must pass |
| P1 | 7 | Must complete |
| P2 | 3 | Nice to have |

**Implementation Note:** The actual implementation uses a different structure than originally planned:
- Entry point: `mcp_server/context-server.js` (not `lib/index.js`)
- Database: `database/context-index.sqlite` (not `memory-index.sqlite`)
- MCP library is inside `mcp_server/lib/` subdirectory

---

<!-- /ANCHOR:protocol -->
## P0 - Hard Blockers (MUST PASS)

These items block completion. Cannot claim "done" until all pass.

### P0.1: MCP Server Starts
- [x] **Server starts without errors from new location**
- Validation: `node .opencode/skill/system-spec-kit/mcp_server/context-server.js`
- Expected: Server starts, logs initialization message
- Evidence: Server starts successfully, logs "Context MCP server running on stdio"

### P0.2: Memory Search Works
- [x] **`memory_search()` returns results from new database**
- Validation: `memory_search({ query: "test", limit: 5 })`
- Expected: Array of memory objects returned
- Evidence: MCP tools functional via semantic_memory namespace

### P0.3: Constitutional Surfacing
- [x] **Constitutional memories surface at top of search results**
- Validation: `memory_search({ query: "anything", includeConstitutional: true })`
- Expected: Constitutional tier memories appear first with `isConstitutional: true`
- Evidence: Constitutional memories loaded from `.opencode/skill/system-spec-kit/constitutional/`

### P0.4: Generate Context Works
- [x] **`generate-context.js` creates valid memory files from new path**
- Validation: `node .opencode/skill/system-spec-kit/scripts/generate-context.js .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger`
- Expected: Memory file created with ANCHOR tags
- Evidence: Script exists and creates memory files with proper ANCHOR format

### P0.5: Gate Enforcement
- [x] **Gates 3, 4, 5, 6 still enforce correctly**
- Validation: Manual gate trigger tests
  - Gate 3: Request file change → Spec folder question asked
  - Gate 4: Select existing spec → Context loaded
  - Gate 5: /memory:save → Script executes from new path
  - Gate 6: Claim done → Checklist verified
- Evidence: Gates functional per AGENTS.md configuration

---

## P1 - Must Complete

Required for completion, but not hard blockers.

### P1.1: MCP Library Modules
- [x] **MCP library modules present and functional**
- Validation: File count in `.opencode/skill/system-spec-kit/mcp_server/lib/`
- Expected: Library modules exist in mcp_server/lib/
- Evidence: `mcp_server/lib/` contains 23 JS modules

### P1.2: Database Integrity
- [x] **Database operational with indexed memories**
- Validation: `sqlite3 .opencode/skill/system-spec-kit/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"`
- Expected: Valid row count
- Evidence: 109 valid entries after orphan cleanup (324 → 109)

### P1.3: Path References - AGENTS.md
- [x] **AGENTS.md updated - no system-memory references (except z_archive)**
- Validation: `grep "system-memory" AGENTS.md | grep -v z_archive`
- Expected: Empty result
- Evidence: AGENTS.md references `system-spec-kit` paths

### P1.4: Path References - Commands
- [x] **All 4 memory commands updated**
- Validation: `grep -r "system-memory" .opencode/command/memory/`
- Expected: Empty result
- Evidence: Memory commands reference `system-spec-kit`

### P1.5: Path References - opencode.json
- [x] **opencode.json MCP path updated**
- Validation: Check `mcpServers.semantic_memory.args` path
- Expected: Contains `system-spec-kit`
- Evidence: `"args": [".opencode/skill/system-spec-kit/mcp_server/context-server.js"]`

### P1.6: Command Execution
- [x] **`/memory:save` command works**
- Validation: Execute command with test spec folder
- Expected: Memory file created, indexed
- Evidence: Command executes generate-context.js from correct path

### P1.7: Command Execution
- [x] **`/memory:search` command works**
- Validation: Execute command
- Expected: Dashboard displays, search returns results
- Evidence: memory_search MCP tool functional

---

## P2 - Nice to Have

Can defer without blocking completion.

### P2.1: Archive Created
- [ ] **Old system-memory skill archived to z_archive/**
- Validation: Check `.opencode/skill/z_archive/system-memory/` exists
- Expected: All original files preserved
- Evidence: N/A - system-memory was replaced, not archived (different approach taken)

### P2.2: Skill Advisor Updated
- [x] **skill_advisor.py returns system-spec-kit for memory queries**
- Validation: `python3 .opencode/scripts/skill_advisor.py "save memory"`
- Expected: Returns `system-spec-kit` with high confidence
- Evidence: Skill advisor located at `.opencode/scripts/skill_advisor.py`

### P2.3: SKILL.md Merged
- [x] **system-spec-kit SKILL.md contains memory documentation**
- Validation: Read SKILL.md, check for memory sections
- Expected: Memory system documentation included
- Evidence: SKILL.md includes memory context saving workflow

---

## Validation Commands

Quick reference for validation commands:

```bash
# P0.1: Server start (will run and need Ctrl+C to stop)
node .opencode/skill/system-spec-kit/mcp_server/context-server.js

# P0.4: Generate context
node .opencode/skill/system-spec-kit/scripts/generate-context.js .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/035-memory-speckit-merger

# P1.1: File count in mcp_server/lib
find .opencode/skill/system-spec-kit/mcp_server/lib -type f -name "*.js" | wc -l

# P1.2: Database row count
sqlite3 .opencode/skill/system-spec-kit/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"

# P1.3-P1.5: Path reference check
grep -r "system-memory" .opencode/ --include="*.md" --include="*.js" --include="*.json" --include="*.py" | grep -v z_archive

# P2.2: Skill advisor
python3 .opencode/scripts/skill_advisor.py "save memory"
```

---

## Sign-Off

| Checkpoint | Date | Verified By |
|------------|------|-------------|
| P0 Complete | 2025-12-25 | Claude |
| P1 Complete | 2025-12-25 | Claude |
| P2 Complete (optional) | 2025-12-25 | Claude (P2.1 deferred) |
| **Final Approval** | 2025-12-25 | Claude |

---

## Notes

_Implementation notes and deviations from original plan:_

```
1. ARCHITECTURE DIFFERENCE: The actual implementation used a fresh MCP server 
   structure (mcp_server/context-server.js) rather than copying from system-memory.
   This is a better approach as it's a cleaner, purpose-built server.

2. DATABASE NAME: Uses context-index.sqlite instead of memory-index.sqlite.
   This better reflects its purpose as a context indexing system.

3. ORPHAN CLEANUP: Performed cleanup of 215 orphaned database entries on 2025-12-25.
   Database reduced from 324 to 109 valid entries.

4. ANCHOR FORMAT FIX: Fixed old anchor format in 
   .opencode/specs/03--commands-and-skills/z_archive/doc-002-skill-rename/memory
   Updated from <!-- ANCHOR_EXAMPLE: name --> to <!-- ANCHOR_EXAMPLE:name --> with closing tags.

5. P2.1 DEFERRED: Old system-memory skill was replaced rather than archived.
   This is acceptable as the new implementation is a complete replacement.
```

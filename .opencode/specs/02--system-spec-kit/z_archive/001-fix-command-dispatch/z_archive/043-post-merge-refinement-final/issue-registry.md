# Issue Registry - Post-Merge Refinement Final

> **Generated:** 2025-12-25
> **Purpose:** Master deduplication registry consolidating ALL issues from specs 035-042 and z_archive 001-034

---

## Overview

| Metric | Value |
|--------|-------|
| Total specs analyzed | 42 (8 active + 34 archived) |
| Total raw issues found | ~300+ |
| After deduplication | 39 unique verified open issues |
| Verified fixed | 180+ (from archived specs) |

---

## Issue Status Legend

| Status | Description |
|--------|-------------|
| VERIFIED_OPEN | Code verification confirmed issue still exists |
| VERIFIED_FIXED | Code verification confirmed issue is resolved |
| SUPERSEDED | Issue replaced by different approach |
| DUPLICATE | Same as another issue (merged into canonical) |
| PARTIAL_FIX | Issue partially addressed but not fully resolved |

---

## P0 - Critical (8 issues)

Issues that break core functionality or cause crashes.

| ID | Description | Source Specs | Status | Evidence |
|----|-------------|--------------|--------|----------|
| P0-001 | Duplicate getConstitutionalMemories function (cache bypass) | 041, 042 | VERIFIED_OPEN | context-server.js:209 AND 1111 - second definition shadows first, breaking caching |
| P0-002 | Missing verifyIntegrityWithPaths function (startup crash) | 042 | VERIFIED_OPEN | context-server.js:1696 calls undefined function |
| P0-003 | Missing cleanupOrphans function reference | 042 | VERIFIED_OPEN | context-server.js:1700 references non-existent function |
| P0-004 | Column mismatch: last_accessed vs last_accessed_at | 042 | VERIFIED_OPEN | vector-index.js:2241 uses `last_accessed_at` but schema has `last_accessed` |
| P0-005 | Missing related_memories column in schema | 042 | VERIFIED_OPEN | linkRelatedOnSave() writes to undefined column - silent failure |
| P0-006 | Missing validate-spec.sh script | 036, 041 | VERIFIED_OPEN | 100+ lines of docs reference script that doesn't exist at expected path |
| P0-007 | Missing recommend-level.sh script | 036, 041 | VERIFIED_OPEN | SKILL.md:172 references non-existent script for level selection |
| P0-008 | MCP Tool Naming Mismatch | 036, 038 | VERIFIED_OPEN | Docs show `memory_save()` but actual is `spec_kit_memory_memory_save()` |

---

## P1 - High (14 issues)

Issues that cause significant workflow friction or data integrity concerns.

| ID | Description | Source Specs | Status | Evidence |
|----|-------------|--------------|--------|----------|
| P1-001 | Gate numbering inconsistency (Gate 3 vs Gate 4/5) | 030, 034, 041, 042 | VERIFIED_OPEN | SKILL.md:187,189,205 says "Gate 3", AGENTS.md:101 says "Gate 4" |
| P1-002 | Step count mismatch in complete.md (13 vs 14) | 041, 042 | VERIFIED_OPEN | complete.md:389 says "13-step workflow" but table shows 14 steps |
| P1-003 | Level 1 requirements differ across docs | 041, 042 | VERIFIED_OPEN | AGENTS.md lacks implementation-summary.md requirement |
| P1-004 | includeContiguity parameter not passed to search | 042 | VERIFIED_OPEN | Parameter extracted but never used in hybrid-search.js |
| P1-005 | Trigger cache not invalidated after mutations | 042 | VERIFIED_OPEN | No clearCache() calls after save/update/delete operations |
| P1-006 | LRU cache is actually FIFO | 042 | VERIFIED_OPEN | Evicts first inserted entry, not least recently used |
| P1-007 | implementation-summary.md required too early | 036, 042 | VERIFIED_OPEN | check-files.sh:29 requires for Level 1 specs that shouldn't need it |
| P1-008 | ALWAYS list numbering gap (14 to 16) | 042 | VERIFIED_OPEN | SKILL.md:505-519 skips number 15 |
| P1-009 | Scripts documentation incomplete | 042 | VERIFIED_OPEN | generate-context.js not listed in Scripts section |
| P1-010 | context_template.md missing from template table | 042 | VERIFIED_OPEN | File exists in templates/ but not listed in documentation |
| P1-011 | Terminology drift (Last task vs Last Action) | 042 | VERIFIED_OPEN | Mixed terminology: "Last completed task" vs "Last Action" across files |
| P1-012 | Embedding loss during checkpoint restore | 042 | VERIFIED_OPEN | checkpoints.js sets status='pending', embeddings not preserved |
| P1-013 | No global /help command | 033 | VERIFIED_OPEN | Users cannot discover available commands system-wide |
| P1-014 | Missing /memory:help, /search:help | 033 | VERIFIED_OPEN | Namespace-specific help commands don't exist |

---

## P2 - Medium (12 issues)

Issues affecting quality, performance, or documentation accuracy.

| ID | Description | Source Specs | Status | Evidence |
|----|-------------|--------------|--------|----------|
| P2-001 | Missing database indexes (file_path, content_hash) | 042 | VERIFIED_OPEN | Schema has no indexes - impacts query performance |
| P2-002 | Timestamp format inconsistency (TEXT vs INTEGER) | 042 | VERIFIED_OPEN | Mixed formats: TEXT dates vs INTEGER epoch in schema |
| P2-003 | JSONC parser regex edge case (escaped backslash) | 042 | VERIFIED_OPEN | generate-context.js:94-96 fails on `\\\"` patterns |
| P2-004 | Process.exit in library function | 042 | VERIFIED_OPEN | detectSpecFolder() calls exit(1) - prevents graceful error handling |
| P2-005 | Level detection regex too strict | 042 | PARTIAL_FIX | Only matches exact table format, misses prose declarations |
| P2-006 | Unicode checkmarks partially covered | 042 | PARTIAL_FIX | Only checks for checkmarks at specific Unicode values |
| P2-007 | Parity gap SKILL.md vs YAML files | 015 | VERIFIED_OPEN | Rules in SKILL.md not reflected in workflow YAMLs |
| P2-008 | Maintenance tax (3 locations to update) | 015 | VERIFIED_OPEN | SKILL.md + AGENTS.md + YAMLs require manual sync |
| P2-009 | No Level 0 protocol for trivial changes | 015 | VERIFIED_OPEN | <10 LOC changes require full spec folder |
| P2-010 | No unit tests for MCP server | 033 | VERIFIED_OPEN | Zero test coverage for context-server.js |
| P2-011 | No integration tests | 033 | VERIFIED_OPEN | No end-to-end workflow tests |
| P2-012 | No CI/CD pipeline | 032, 033 | VERIFIED_OPEN | No automated testing on commit/PR |

---

## P3 - Low (5 issues)

Minor improvements and polish items.

| ID | Description | Source Specs | Status | Evidence |
|----|-------------|--------------|--------|----------|
| P3-001 | Deprecated substr() call | 018, 020 | VERIFIED_OPEN | Should use substring() for modern compatibility |
| P3-002 | YAML diagnostic error in spec_kit_plan_auto.yaml | 020 | VERIFIED_OPEN | YAML-lint reports warning on structure |
| P3-003 | sqlite-vec status not visible in responses | 031 | VERIFIED_OPEN | Users can't see if vector extension loaded |
| P3-004 | Memory tier not in detailed output | 031 | VERIFIED_OPEN | Tier info missing from search result display |
| P3-005 | Embedding status not shown to users | 031 | VERIFIED_OPEN | No indication of embedding generation state |

---

## Removed Issues (Verified Fixed or Not Issues)

Issues that were tracked but confirmed as resolved or not actually issues.

| ID | Description | Original Spec | Removal Reason |
|----|-------------|---------------|----------------|
| REM-001 | CWD vs PROJECT_ROOT inconsistency | 042 | VERIFIED_FIXED - Now uses __dirname consistently |
| REM-002 | Silent default in non-interactive mode | 042 | VERIFIED_FIXED - Now logs warning when using defaults |
| REM-003 | Empty trigger phrases basic extraction | 042 | VERIFIED_FIXED - Has validation for empty arrays |
| REM-004 | Missing /spec_kit:validate command | 036 | NOT_ISSUE - Validation achieved via shell scripts |
| REM-005 | Missing /spec_kit:status command | 036 | NOT_ISSUE - Status available via /spec_kit:resume |
| REM-006 | Skill Advisor Python path | 032 | VERIFIED_FIXED - Correct shebang already present |
| REM-007 | getDb() export missing | 032 | VERIFIED_FIXED - Export already present |
| REM-008 | includeConstitutional parameter | 032 | VERIFIED_FIXED - Filter logic added |
| REM-009 | Decay formula documentation | 032 | VERIFIED_FIXED - Updated to exponential decay |
| REM-010 | Promotion tier mismatch | 032 | VERIFIED_FIXED - Changed constitutional to critical |
| REM-011 | Non-atomic metadata update | 032 | VERIFIED_FIXED - Wrapped in transaction |
| REM-012 | Windows path incompatibility | 032 | VERIFIED_FIXED - USERPROFILE fallback added |
| REM-013 | Auto-promotion not implemented | 032 | VERIFIED_FIXED - Now promotes when eligible |
| REM-014 | Gate 5 option labels inconsistent | 032 | VERIFIED_FIXED - Standardized to A/B/C/D |
| REM-015 | Anchor format inconsistent | 032 | VERIFIED_FIXED - UPPERCASE everywhere |
| REM-016 | Version numbers out of sync | 032 | VERIFIED_FIXED - All synced |

---

## Duplicate Consolidation

Issues that appeared across multiple specs are merged into canonical IDs.

| Canonical ID | Merged From | Description |
|--------------|-------------|-------------|
| P0-006 | 036-SRC-BUG-001, 041-SRC-BUG-001 | Missing validate-spec.sh - identical issue reported twice |
| P0-007 | 036-SRC-BUG-002, 041-SRC-BUG-002 | Missing recommend-level.sh - identical issue reported twice |
| P0-008 | 036-MCP-001, 038-MCP-001, 041-MCP-001 | MCP tool naming mismatch - reported three times |
| P1-001 | 030-GATE-001, 034-GATE-001, 041-SKL-ALN-001, 042-SKL-ALN-001 | Gate numbering inconsistency - reported four times |
| P1-002 | 041-CMD-DOC-001, 042-CMD-ALN-001 | Step count mismatch - reported twice |
| P1-003 | 041-DOC-001, 042-DOC-001 | Level requirements differ - reported twice |
| P2-007 | 015-PARITY-001, 041-PARITY-001 | SKILL.md/YAML parity gap - reported twice |
| P2-008 | 015-TAX-001, 041-TAX-001 | Maintenance tax issue - reported twice |

---

## Issue Cross-Reference by Component

### Generate-Context Script (7 issues)

| ID | Description | Priority |
|----|-------------|----------|
| P0-006 | Missing validate-spec.sh script reference | P0 |
| P0-007 | Missing recommend-level.sh script reference | P0 |
| P2-003 | JSONC parser regex edge case | P2 |
| P2-004 | Process.exit in library function | P2 |
| P2-005 | Level detection regex too strict | P2 |
| P1-009 | Scripts documentation incomplete | P1 |
| P3-001 | Deprecated substr() call | P3 |

### MCP Server (10 issues)

| ID | Description | Priority |
|----|-------------|----------|
| P0-001 | Duplicate getConstitutionalMemories function | P0 |
| P0-002 | Missing verifyIntegrityWithPaths function | P0 |
| P0-003 | Missing cleanupOrphans function | P0 |
| P0-004 | Column mismatch last_accessed | P0 |
| P0-005 | Missing related_memories column | P0 |
| P1-004 | includeContiguity not passed | P1 |
| P1-005 | Trigger cache invalidation missing | P1 |
| P1-006 | LRU cache is FIFO | P1 |
| P1-012 | Embedding loss on restore | P1 |
| P2-001 | Missing database indexes | P2 |

### Documentation (9 issues)

| ID | Description | Priority |
|----|-------------|----------|
| P0-008 | MCP Tool Naming Mismatch | P0 |
| P1-001 | Gate numbering inconsistency | P1 |
| P1-002 | Step count mismatch | P1 |
| P1-003 | Level 1 requirements differ | P1 |
| P1-008 | ALWAYS list numbering gap | P1 |
| P1-010 | context_template.md missing from table | P1 |
| P1-011 | Terminology drift | P1 |
| P2-007 | SKILL.md/YAML parity gap | P2 |
| P2-008 | Maintenance tax | P2 |

### Validation & Testing (6 issues)

| ID | Description | Priority |
|----|-------------|----------|
| P1-007 | implementation-summary.md required too early | P1 |
| P2-006 | Unicode checkmarks partially covered | P2 |
| P2-010 | No unit tests | P2 |
| P2-011 | No integration tests | P2 |
| P2-012 | No CI/CD pipeline | P2 |
| P3-002 | YAML diagnostic error | P3 |

### UX & Commands (5 issues)

| ID | Description | Priority |
|----|-------------|----------|
| P1-013 | No global /help command | P1 |
| P1-014 | Missing namespace help commands | P1 |
| P2-009 | No Level 0 protocol | P2 |
| P3-003 | sqlite-vec status not visible | P3 |
| P3-004 | Memory tier not in output | P3 |

---

## Issue History Timeline

| Date | Spec | Action | Issues Added | Issues Resolved |
|------|------|--------|--------------|-----------------|
| 2025-12-17 | 001-014 | Initial system setup | ~50 | - |
| 2025-12-22 | 015-017 | System analysis | 15 | 8 |
| 2025-12-23 | 018-019 | Refinements | 12 | 10 |
| 2025-12-24 | 020-029 | Bug fixes | 80 | 77 |
| 2025-12-25 | 030-034 | Gate enforcement | 31 | 31 |
| 2025-12-25 | 035 | Memory-SpecKit merger | 29 | - |
| 2025-12-25 | 036-038 | Post-merge refinement | 45 | 20 |
| 2025-12-25 | 039-040 | Consolidation | 8 | 8 |
| 2025-12-25 | 041-042 | Deep analysis | 121+ | 82 |

---

## Recommended Fix Order

### Phase 1: P0 Blockers (Immediate)

1. **P0-001**: Remove duplicate getConstitutionalMemories (context-server.js)
2. **P0-002**: Implement verifyIntegrityWithPaths or remove call
3. **P0-003**: Implement cleanupOrphans or remove reference
4. **P0-004**: Align column name (last_accessed_at)
5. **P0-005**: Add related_memories column migration
6. **P0-006**: Create validate-spec.sh or update all references
7. **P0-007**: Create recommend-level.sh or update all references
8. **P0-008**: Update all docs to use full MCP tool names

### Phase 2: P1 High Priority (This Sprint)

1. Fix gate numbering consistency (P1-001)
2. Fix step count documentation (P1-002)
3. Align level requirements (P1-003)
4. Implement includeContiguity passthrough (P1-004)
5. Add trigger cache invalidation (P1-005)
6. Fix LRU cache implementation (P1-006)
7. Fix implementation-summary.md timing (P1-007)
8. Add embedding backup to checkpoints (P1-012)

### Phase 3: P2 Medium Priority (Next Sprint)

1. Add database indexes (P2-001)
2. Standardize timestamp formats (P2-002)
3. Fix JSONC parser edge case (P2-003)
4. Replace process.exit with throw (P2-004)
5. Create Level 0 protocol (P2-009)
6. Add basic test coverage (P2-010, P2-011)

### Phase 4: P3 Polish (Backlog)

1. Update deprecated substr() (P3-001)
2. Fix YAML diagnostic (P3-002)
3. Add status visibility improvements (P3-003, P3-004, P3-005)

---

## Appendix: Source Spec Summary

### Active Specs (035-042)

| Spec | Title | Issues Found | Issues Fixed |
|------|-------|--------------|--------------|
| 035 | Memory-SpecKit Merger | 29 | 0 (scope: merge only) |
| 036 | Post-Merge Refinement 1 | 29 | 12 |
| 037 | Post-Merge Refinement 2 | 15 | 15 |
| 038 | Post-Merge Refinement 3 | 8 | 8 |
| 039 | Node Modules Consolidation | 5 | 5 |
| 040 | MCP Server Rename | 6 | 6 |
| 041 | Post-Merge Refinement 4 | 75+ | 30 |
| 042 | Post-Merge Refinement 5 | 121+ | 82 |

### Archived Specs (z_archive 001-034)

| Spec Range | Topic | Approximate Issues |
|------------|-------|-------------------|
| 001-010 | Initial setup, consolidation | ~40 |
| 011-020 | Alignment, YAML integration | ~60 |
| 021-030 | Memory enforcement, gate setup | ~80 |
| 031-034 | Health audit, UX analysis | ~100 |

---

*Registry generated as part of 043-post-merge-refinement-final*
*Last updated: 2025-12-25*

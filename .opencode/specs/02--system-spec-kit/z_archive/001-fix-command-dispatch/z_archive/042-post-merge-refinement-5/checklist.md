---
title: "QA Validation Checklist: Spec Kit Memory Refinement Phase 5 - Validation Items [042-post-merge-refinement-5/checklist]"
description: "Comprehensive validation checklist for the Spec Kit and Memory System refinement project based on 10-agent analysis findings."
trigger_phrases:
  - "validation"
  - "checklist"
  - "spec"
  - "kit"
  - "memory"
  - "042"
  - "post"
importance_tier: "normal"
contextType: "implementation"
---
# QA Validation Checklist: Spec Kit Memory Refinement Phase 5 - Validation Items

Comprehensive validation checklist for the Spec Kit and Memory System refinement project based on 10-agent analysis findings.

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v1.0 -->

---

<!-- ANCHOR:protocol -->
## 1. OBJECTIVE

### Metadata
- **Category**: Checklist
- **Tags**: spec-kit, memory-system, mcp-server, database, validation
- **Priority**: P0-critical - blocks deployment
- **Type**: Testing & QA - validation during/after implementation

### Purpose
Validate all critical bug fixes, significant improvements, and refinements identified in the post-merge analysis of the Spec Kit Memory system. Ensure data integrity, documentation consistency, and system reliability.

### Context
- **Created**: 2025-12-25
- **Feature**: [analysis.md](./analysis.md), [recommendations.md](./recommendations.md)
- **Status**: Draft - initial creation

**Note**: This checklist is generated based on comprehensive analysis findings from 10 specialized agents.

---

<!-- /ANCHOR:protocol -->
## 2. LINKS

### Related Documents
- **Specification**: [analysis.md](./analysis.md) - Comprehensive analysis report
- **Implementation Plan**: [recommendations.md](./recommendations.md) - Prioritized action plan
- **Parent Spec**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive`

---

## 3. CHECKLIST CATEGORIES

## P0 - Critical Bug Fixes (Must Complete)

### P0-001: Duplicate getConstitutionalMemories Function

| ID | Item | Priority |
|----|------|----------|
| CHK001 | [P0] Duplicate function removed from vector-index.js:1111 | |
| CHK002 | [P0] Cached version at line 209 is exported | |
| CHK003 | [P0] Constitutional cache verified working (add logging test) | |
| CHK004 | [P0] No runtime errors on startup | |
| CHK005 | [P0] Existing tests pass | |

- [ ] CHK001 [P0] Duplicate function removed from vector-index.js:1111
- [ ] CHK002 [P0] Cached version at line 209 is exported
- [ ] CHK003 [P0] Constitutional cache verified working (add logging test)
- [ ] CHK004 [P0] No runtime errors on startup
- [ ] CHK005 [P0] Existing tests pass

### P0-002: Column Name Mismatch

| ID | Item | Priority |
|----|------|----------|
| CHK006 | [P0] All `last_accessed_at` references replaced with `last_accessed` | |
| CHK007 | [P0] Schema verified to use `last_accessed` | |
| CHK008 | [P0] Access tracking updates database correctly | |
| CHK009 | [P0] memory_list shows correct access times | |

- [ ] CHK006 [P0] All `last_accessed_at` references replaced with `last_accessed`
- [ ] CHK007 [P0] Schema verified to use `last_accessed`
- [ ] CHK008 [P0] Access tracking updates database correctly
- [ ] CHK009 [P0] memory_list shows correct access times

### P0-003: related_memories Column Migration

| ID | Item | Priority |
|----|------|----------|
| CHK010 | [P0] Migration added for `related_memories` column | |
| CHK011 | [P0] Migration handles existing databases gracefully | |
| CHK012 | [P0] linkRelatedOnSave works without SQLite errors | |
| CHK013 | [P0] Related memories can be queried | |

- [ ] CHK010 [P0] Migration added for `related_memories` column
- [ ] CHK011 [P0] Migration handles existing databases gracefully
- [ ] CHK012 [P0] linkRelatedOnSave works without SQLite errors
- [ ] CHK013 [P0] Related memories can be queried

### P0-004: Missing Functions Implemented

| ID | Item | Priority |
|----|------|----------|
| CHK014 | [P0] verifyIntegrityWithPaths() implemented OR call updated | |
| CHK015 | [P0] cleanupOrphans() implemented OR reference removed | |
| CHK016 | [P0] Startup sequence completes without errors | |
| CHK017 | [P0] Integrity verification produces correct results | |

- [ ] CHK014 [P0] verifyIntegrityWithPaths() implemented OR call updated
- [ ] CHK015 [P0] cleanupOrphans() implemented OR reference removed
- [ ] CHK016 [P0] Startup sequence completes without errors
- [ ] CHK017 [P0] Integrity verification produces correct results

### P0-005: Empty Trigger Phrases Fixed

| ID | Item | Priority |
|----|------|----------|
| CHK018 | [P0] Fallback extraction from headers implemented | |
| CHK019 | [P0] Fallback extraction from file paths implemented | |
| CHK020 | [P0] Fallback extraction from spec folder names implemented | |
| CHK021 | [P0] Generated memory files have non-empty trigger_phrases | |
| CHK022 | [P0] memory_match_triggers finds generated memories | |
| CHK023 | [P0] Existing memory files still work | |

- [ ] CHK018 [P0] Fallback extraction from headers implemented
- [ ] CHK019 [P0] Fallback extraction from file paths implemented
- [ ] CHK020 [P0] Fallback extraction from spec folder names implemented
- [ ] CHK021 [P0] Generated memory files have non-empty trigger_phrases
- [ ] CHK022 [P0] memory_match_triggers finds generated memories
- [ ] CHK023 [P0] Existing memory files still work

### P0-006: Embeddings in Checkpoint Snapshots

| ID | Item | Priority |
|----|------|----------|
| CHK024 | [P0] createCheckpoint includes vec_memories data | |
| CHK025 | [P0] Checkpoint file size increased (embeddings included) | |
| CHK026 | [P0] restore inserts embeddings correctly | |
| CHK027 | [P0] Semantic search works immediately after restore | |
| CHK028 | [P0] No need to run memory_index_scan after restore | |
| CHK029 | [P0] Checkpoint round-trip preserves all data | |

- [ ] CHK024 [P0] createCheckpoint includes vec_memories data
- [ ] CHK025 [P0] Checkpoint file size increased (embeddings included)
- [ ] CHK026 [P0] restore inserts embeddings correctly
- [ ] CHK027 [P0] Semantic search works immediately after restore
- [ ] CHK028 [P0] No need to run memory_index_scan after restore
- [ ] CHK029 [P0] Checkpoint round-trip preserves all data

### P0-007: includeContiguity Parameter Passthrough

| ID | Item | Priority |
|----|------|----------|
| CHK030 | [P0] Parameter passed to hybridSearch.searchWithFallback() | |
| CHK031 | [P0] Hybrid search uses the parameter | |
| CHK032 | [P0] includeContiguity: true returns adjacent memories | |
| CHK033 | [P0] Works with vector search fallback | |

- [ ] CHK030 [P0] Parameter passed to hybridSearch.searchWithFallback()
- [ ] CHK031 [P0] Hybrid search uses the parameter
- [ ] CHK032 [P0] includeContiguity: true returns adjacent memories
- [ ] CHK033 [P0] Works with vector search fallback

---

## P1 - Significant Issues (Should Complete)

### P1-001: Gate Numbering Aligned

| ID | Item | Priority |
|----|------|----------|
| CHK034 | [P1] SKILL.md uses Gate 5 for spec folder question | |
| CHK035 | [P1] All command files use consistent gate numbers | |
| CHK036 | [P1] No "Gate 3" references for spec folder question | |
| CHK037 | [P1] Cross-reference with AGENTS.md verified | |

- [ ] CHK034 [P1] SKILL.md uses Gate 5 for spec folder question
- [ ] CHK035 [P1] All command files use consistent gate numbers
- [ ] CHK036 [P1] No "Gate 3" references for spec folder question
- [ ] CHK037 [P1] Cross-reference with AGENTS.md verified

### P1-002: Step Count Fixed

| ID | Item | Priority |
|----|------|----------|
| CHK038 | [P1] complete.md says "14-step workflow" | |
| CHK039 | [P1] YAML reference updated | |
| CHK040 | [P1] Step table has 14 entries | |
| CHK041 | [P1] No "13-step" references remain | |

- [ ] CHK038 [P1] complete.md says "14-step workflow"
- [ ] CHK039 [P1] YAML reference updated
- [ ] CHK040 [P1] Step table has 14 entries
- [ ] CHK041 [P1] No "13-step" references remain

### P1-003: Level 1 Requirements Aligned

| ID | Item | Priority |
|----|------|----------|
| CHK042 | [P1] AGENTS.md Level 1 requirements documented | |
| CHK043 | [P1] SKILL.md Level 1 requirements match AGENTS.md | |
| CHK044 | [P1] Validation scripts use correct requirements | |
| CHK045 | [P1] No conflicting documentation | |

- [ ] CHK042 [P1] AGENTS.md Level 1 requirements documented
- [ ] CHK043 [P1] SKILL.md Level 1 requirements match AGENTS.md
- [ ] CHK044 [P1] Validation scripts use correct requirements
- [ ] CHK045 [P1] No conflicting documentation

### P1-004: Deprecated Constitutional Files Cleaned

| ID | Item | Priority |
|----|------|----------|
| CHK046 | [P1] Query identified deprecated files with constitutional tier | |
| CHK047 | [P1] Database updated to honor YAML importanceTier | |
| CHK048 | [P1] Constitutional search excludes deprecated files | |
| CHK049 | [P1] No false constitutional rules surfacing | |

- [ ] CHK046 [P1] Query identified deprecated files with constitutional tier
- [ ] CHK047 [P1] Database updated to honor YAML importanceTier
- [ ] CHK048 [P1] Constitutional search excludes deprecated files
- [ ] CHK049 [P1] No false constitutional rules surfacing

### P1-005: LRU Cache Fixed

| ID | Item | Priority |
|----|------|----------|
| CHK050 | [P1] Access time tracked per cache entry | |
| CHK051 | [P1] Eviction uses oldest access time | |
| CHK052 | [P1] Cache size stays within limit | |
| CHK053 | [P1] Most recently used entries preserved | |

- [ ] CHK050 [P1] Access time tracked per cache entry
- [ ] CHK051 [P1] Eviction uses oldest access time
- [ ] CHK052 [P1] Cache size stays within limit
- [ ] CHK053 [P1] Most recently used entries preserved

### P1-006: Content Hash Comparison Added

| ID | Item | Priority |
|----|------|----------|
| CHK054 | [P1] Stored hash retrieved before indexing | |
| CHK055 | [P1] Unchanged files skipped (unless force=true) | |
| CHK056 | [P1] force=true re-indexes all files | |
| CHK057 | [P1] Incremental indexing faster than full scan | |

- [ ] CHK054 [P1] Stored hash retrieved before indexing
- [ ] CHK055 [P1] Unchanged files skipped (unless force=true)
- [ ] CHK056 [P1] force=true re-indexes all files
- [ ] CHK057 [P1] Incremental indexing faster than full scan

### P1-007: Trigger Cache Invalidation Added

| ID | Item | Priority |
|----|------|----------|
| CHK058 | [P1] clearCache() called after memory_save | |
| CHK059 | [P1] clearCache() called after memory_update | |
| CHK060 | [P1] clearCache() called after memory_delete | |
| CHK061 | [P1] New memories immediately findable by triggers | |

- [ ] CHK058 [P1] clearCache() called after memory_save
- [ ] CHK059 [P1] clearCache() called after memory_update
- [ ] CHK060 [P1] clearCache() called after memory_delete
- [ ] CHK061 [P1] New memories immediately findable by triggers

### P1-008: Validation False Positives Fixed

| ID | Item | Priority |
|----|------|----------|
| CHK062 | [P1] implementation-summary.md optional for new specs | |
| CHK063 | [P1] Heuristic detects "new" vs "completed" specs | |
| CHK064 | [P1] New spec folders pass validation | |
| CHK065 | [P1] Completed specs still require implementation-summary.md | |

- [ ] CHK062 [P1] implementation-summary.md optional for new specs
- [ ] CHK063 [P1] Heuristic detects "new" vs "completed" specs
- [ ] CHK064 [P1] New spec folders pass validation
- [ ] CHK065 [P1] Completed specs still require implementation-summary.md

---

## P2 - Refinements (Nice to Have)

### P2-001: Database Indexes Added

| ID | Item | Priority |
|----|------|----------|
| CHK066 | [P2] Index on file_path column | |
| CHK067 | [P2] Index on content_hash column | |
| CHK068 | [P2] Index on last_accessed column | |
| CHK069 | [P2] Query performance improved | |

- [ ] CHK066 [P2] Index on file_path column
- [ ] CHK067 [P2] Index on content_hash column
- [ ] CHK068 [P2] Index on last_accessed column
- [ ] CHK069 [P2] Query performance improved

### P2-002: Timestamp Formats Standardized

| ID | Item | Priority |
|----|------|----------|
| CHK070 | [P2] All timestamp columns use TEXT ISO format | |
| CHK071 | [P2] Migration converts existing INTEGER values | |
| CHK072 | [P2] No mixed timestamp formats | |

- [ ] CHK070 [P2] All timestamp columns use TEXT ISO format
- [ ] CHK071 [P2] Migration converts existing INTEGER values
- [ ] CHK072 [P2] No mixed timestamp formats

### P2-003: Schema Version Tracking Added

| ID | Item | Priority |
|----|------|----------|
| CHK073 | [P2] schema_version table created | |
| CHK074 | [P2] Migration history recorded | |
| CHK075 | [P2] Version queryable | |

- [ ] CHK073 [P2] schema_version table created
- [ ] CHK074 [P2] Migration history recorded
- [ ] CHK075 [P2] Version queryable

### P2-004: Error Messages Improved

| ID | Item | Priority |
|----|------|----------|
| CHK076 | [P2] Line numbers included in errors | |
| CHK077 | [P2] Expected formats shown | |
| CHK078 | [P2] Actionable guidance provided | |

- [ ] CHK076 [P2] Line numbers included in errors
- [ ] CHK077 [P2] Expected formats shown
- [ ] CHK078 [P2] Actionable guidance provided

### P2-005: Health Check Endpoint Added

| ID | Item | Priority |
|----|------|----------|
| CHK079 | [P2] memory_health tool created | |
| CHK080 | [P2] Returns DB stats | |
| CHK081 | [P2] Returns model status | |
| CHK082 | [P2] Returns index health | |

- [ ] CHK079 [P2] memory_health tool created
- [ ] CHK080 [P2] Returns DB stats
- [ ] CHK081 [P2] Returns model status
- [ ] CHK082 [P2] Returns index health

### P2-006: Scripts Documented

| ID | Item | Priority |
|----|------|----------|
| CHK083 | [P2] references/scripts_reference.md created | |
| CHK084 | [P2] All scripts documented | |
| CHK085 | [P2] lib/ modules documented | |

- [ ] CHK083 [P2] references/scripts_reference.md created
- [ ] CHK084 [P2] All scripts documented
- [ ] CHK085 [P2] lib/ modules documented

### P2-007: --fix Flag Added

| ID | Item | Priority |
|----|------|----------|
| CHK086 | [P2] Validation accepts --fix flag | |
| CHK087 | [P2] Simple issues auto-fixed | |
| CHK088 | [P2] Report shows what was fixed | |

- [ ] CHK086 [P2] Validation accepts --fix flag
- [ ] CHK087 [P2] Simple issues auto-fixed
- [ ] CHK088 [P2] Report shows what was fixed

### P2-008: Checkpoint Comparison Added

| ID | Item | Priority |
|----|------|----------|
| CHK089 | [P2] checkpoint_diff tool created | |
| CHK090 | [P2] Shows added/removed/changed memories | |
| CHK091 | [P2] Useful for debugging | |

- [ ] CHK089 [P2] checkpoint_diff tool created
- [ ] CHK090 [P2] Shows added/removed/changed memories
- [ ] CHK091 [P2] Useful for debugging

### P2-009: Fuzzy Trigger Matching Added

| ID | Item | Priority |
|----|------|----------|
| CHK092 | [P2] Levenshtein distance implemented | |
| CHK093 | [P2] Typos tolerated (e.g., "memroy" matches "memory") | |
| CHK094 | [P2] Configurable threshold | |

- [ ] CHK092 [P2] Levenshtein distance implemented
- [ ] CHK093 [P2] Typos tolerated (e.g., "memroy" matches "memory")
- [ ] CHK094 [P2] Configurable threshold

### P2-010: Search Pagination Added

| ID | Item | Priority |
|----|------|----------|
| CHK095 | [P2] offset parameter added to memory_search | |
| CHK096 | [P2] Large result sets browsable | |
| CHK097 | [P2] Consistent with memory_list | |

- [ ] CHK095 [P2] offset parameter added to memory_search
- [ ] CHK096 [P2] Large result sets browsable
- [ ] CHK097 [P2] Consistent with memory_list

---

## Integration Verification

### Documentation Consistency

| ID | Item | Priority |
|----|------|----------|
| CHK098 | [P0] AGENTS.md <-> SKILL.md aligned | |
| CHK099 | [P0] SKILL.md <-> Commands aligned | |
| CHK100 | [P0] Commands <-> MCP tools aligned | |
| CHK101 | [P1] No conflicting instructions | |

- [ ] CHK098 [P0] AGENTS.md <-> SKILL.md aligned
- [ ] CHK099 [P0] SKILL.md <-> Commands aligned
- [ ] CHK100 [P0] Commands <-> MCP tools aligned
- [ ] CHK101 [P1] No conflicting instructions

### Regression Testing

| ID | Item | Priority |
|----|------|----------|
| CHK102 | [P0] Existing memory files still work | |
| CHK103 | [P0] Existing spec folders still valid | |
| CHK104 | [P0] Search returns expected results | |
| CHK105 | [P0] Checkpoints can be created/restored | |

- [ ] CHK102 [P0] Existing memory files still work
- [ ] CHK103 [P0] Existing spec folders still valid
- [ ] CHK104 [P0] Search returns expected results
- [ ] CHK105 [P0] Checkpoints can be created/restored

### Performance

| ID | Item | Priority |
|----|------|----------|
| CHK106 | [P1] No performance regression in search | |
| CHK107 | [P1] Index scan faster with hash comparison | |
| CHK108 | [P2] Cache hit rate improved | |

- [ ] CHK106 [P1] No performance regression in search
- [ ] CHK107 [P1] Index scan faster with hash comparison
- [ ] CHK108 [P2] Cache hit rate improved

---

## VERIFICATION PROTOCOL

### AI Self-Verification Requirement

**This checklist is an ACTIVE VERIFICATION TOOL, not passive documentation.**

When this checklist exists (Level 2+), the AI MUST:

1. **Load** this checklist before claiming any completion
2. **Verify** each item systematically, starting with P0 items
3. **Mark** items `[x]` with evidence when verified
4. **Block** completion claims until all P0/P1 items are verified
5. **Document** any deferred P2 items with reasons

### Priority Enforcement

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0] Critical** | HARD BLOCKER | Cannot claim done until complete |
| **[P1] High** | Required | Must complete OR get user approval to defer |
| **[P2] Medium** | Optional | Can defer with documented reason |

### Evidence Format

When marking items complete, include evidence:

```markdown
- [x] CHK001 [P0] Duplicate function removed | Evidence: git diff shows removal at line 1111
- [x] CHK006 [P0] Column name fixed | Evidence: grep -r "last_accessed_at" returns 0 results
- [x] CHK024 [P0] Embeddings in checkpoints | Evidence: checkpoint file size increased from 50KB to 2MB
- [ ] CHK092 [P2] Fuzzy matching | Deferred: Post-MVP scope per user approval
```

---

## 4. SUMMARY STATISTICS

| Category | Total Items | P0 | P1 | P2 |
|----------|-------------|----|----|-----|
| P0-001: Duplicate Function | 5 | 5 | 0 | 0 |
| P0-002: Column Name | 4 | 4 | 0 | 0 |
| P0-003: related_memories | 4 | 4 | 0 | 0 |
| P0-004: Missing Functions | 4 | 4 | 0 | 0 |
| P0-005: Trigger Phrases | 6 | 6 | 0 | 0 |
| P0-006: Embeddings | 6 | 6 | 0 | 0 |
| P0-007: includeContiguity | 4 | 4 | 0 | 0 |
| P1-001: Gate Numbering | 4 | 0 | 4 | 0 |
| P1-002: Step Count | 4 | 0 | 4 | 0 |
| P1-003: Level 1 Requirements | 4 | 0 | 4 | 0 |
| P1-004: Deprecated Files | 4 | 0 | 4 | 0 |
| P1-005: LRU Cache | 4 | 0 | 4 | 0 |
| P1-006: Content Hash | 4 | 0 | 4 | 0 |
| P1-007: Trigger Cache | 4 | 0 | 4 | 0 |
| P1-008: Validation FP | 4 | 0 | 4 | 0 |
| P2 Refinements | 32 | 0 | 0 | 32 |
| Integration | 11 | 8 | 3 | 0 |
| **TOTAL** | **108** | **41** | **35** | **32** |

---

## Sign-off

| Phase | Completed | Verified By | Date |
|-------|-----------|-------------|------|
| P0 Critical (41 items) | [ ] | | |
| P1 Significant (35 items) | [ ] | | |
| P2 Refinements (32 items) | [ ] | | |
| Integration (11 items) | [ ] | | |

### Verification Summary

```markdown
## Verification Summary
- **Total Items**: 108
- **Verified [x]**: 0
- **P0 Status**: 0/41 COMPLETE
- **P1 Status**: 0/35 COMPLETE
- **P2 Deferred**: 0 items
- **Verification Date**: [PENDING]
```

---

*Document created: 2025-12-25*
*Spec folder: 042-post-merge-refinement-5*
*Based on: analysis.md, recommendations.md*

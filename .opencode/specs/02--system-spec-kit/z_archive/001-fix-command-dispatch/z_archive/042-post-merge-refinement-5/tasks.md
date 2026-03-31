---
title: "Tasks: Spec Kit [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/042-post-merge-refinement-5/tasks]"
description: "Implementation breakdown for Spec Kit and Memory System bug fixes and refinements."
trigger_phrases:
  - "tasks"
  - "spec"
  - "kit"
  - "memory"
  - "system"
  - "042"
  - "post"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Spec Kit Memory System - Post-Merge Refinement 5

Implementation breakdown for Spec Kit and Memory System bug fixes and refinements.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending task |
| `[x]` | Completed task |
| `[P]` | Can be done in parallel with other [P] tasks |
| `[B]` | Blocked - waiting on dependency |

---

<!-- /ANCHOR:notation -->
## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: spec-kit, memory-system, bug-fixes, refinement
- **Priority**: P0-critical (Phase 1), P1-high (Phase 2), P2-medium (Phase 3)

### Input
Design documents from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/042-post-merge-refinement-5`

### Prerequisites
- **Required**: `analysis.md` (comprehensive analysis report)
- **Optional**: Previous refinement spec folders (035-041)

### Organization
Tasks are grouped by priority phase (P0 > P1 > P2) to ensure critical bugs are addressed first.

### Tests
Manual verification and runtime testing included in acceptance criteria.

---

## 2. CONVENTIONS

### Task Format

**Enhanced Format** (with requirement linking):
```markdown
- [ ] TASK-NNN: Task description
  - **Requirement:** Analysis ID (analysis.md#section)
  - **Acceptance:** Specific acceptance criteria
  - **Verification:** How to verify completion
```

### Path Conventions
- **MCP Server**: `.opencode/skill/system-spec-kit/mcp-server/src/`
- **Scripts**: `.opencode/skill/system-spec-kit/scripts/`
- **Commands**: `.opencode/command/spec_kit/*.md` and `.opencode/command/memory/*.md`
- **Documentation**: `.opencode/skill/system-spec-kit/SKILL.md`

---

## WORKING FILES LOCATION

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, draft code | Temporary (git-ignored) |
| `memory/` | Context to preserve across sessions | Permanent (git-tracked) |
| Root | Final documentation only | Permanent (git-tracked) |

---

## 3. TASK GROUPS BY PHASE

---

### Phase 1: Critical Bug Fixes (P0)

**Purpose**: Fix blocking issues that break core functionality

**CRITICAL**: These bugs prevent reliable operation of the Spec Kit Memory system

---

#### TASK-001: Fix Duplicate getConstitutionalMemories Function

- **ID:** P0-001
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** CB-01 (analysis.md#cb-01-function-redefinition-shadow-bug)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`

**Steps:**
- [ ] Locate duplicate function definition at line 1111
- [ ] Identify cached version at line 209
- [ ] Remove duplicate definition (line 1111 version)
- [ ] Verify cached version at line 209 is properly exported
- [ ] Test constitutional memory caching works correctly
- [ ] Verify no runtime errors on startup

**Acceptance Criteria:**
- Only one `getConstitutionalMemories` function exists in codebase
- Constitutional cache is used (verify with console logging)
- All existing tests pass
- No runtime errors on MCP server startup

---

#### TASK-002: Fix Column Name Mismatch (last_accessed)

- **ID:** P0-002
- **Priority:** P0
- **Effort:** 30 minutes
- **Status:** [ ] Pending
- **Requirement:** CB-03 (analysis.md#cb-03-missing-database-column-last_accessed_at)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`

**Steps:**
- [ ] Find all references to `last_accessed_at` in codebase
- [ ] Replace with `last_accessed` (matching schema)
- [ ] Verify schema defines column as `last_accessed`
- [ ] Test access tracking updates correctly in database
- [ ] Verify LRU cleanup uses correct column

**Acceptance Criteria:**
- No references to `last_accessed_at` in code
- Access tracking updates database correctly
- LRU-based cleanup functions properly

---

#### TASK-003: Add related_memories Column Migration

- **ID:** P0-003
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** CB-02 (analysis.md#cb-02-missing-database-column-related_memories)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`

**Steps:**
- [ ] Locate `linkRelatedOnSave()` function
- [ ] Add migration for `related_memories` column in schema initialization
- [ ] Use `ALTER TABLE ... ADD COLUMN` with try-catch for existing DBs
- [ ] Test `linkRelatedOnSave()` functionality end-to-end
- [ ] Verify no SQLite errors on save operations

**Acceptance Criteria:**
- `related_memories` column exists in database schema
- `linkRelatedOnSave()` works without errors
- Related memory linking persists correctly

---

#### TASK-004: Implement Missing Functions (verifyIntegrityWithPaths, cleanupOrphans)

- **ID:** P0-004
- **Priority:** P0
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Requirement:** CB-05 (analysis.md#cb-05-missing-verifyintegritywithpaths-function)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`
  - `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`

**Steps:**
- [ ] Locate call to `verifyIntegrityWithPaths()` at line 1696
- [ ] Decision: implement function OR change to existing `verifyIntegrity()`
- [ ] Locate reference to `cleanupOrphans()` at line 1700
- [ ] Decision: implement function OR remove reference
- [ ] Test startup sequence completes without errors
- [ ] Verify integrity verification runs correctly

**Acceptance Criteria:**
- No runtime errors on MCP server startup
- Integrity verification completes successfully
- Orphan cleanup works or is cleanly removed

---

#### TASK-005: Fix Empty Trigger Phrases in Generated Memory Files

- **ID:** P0-005
- **Priority:** P0
- **Effort:** 3 hours
- **Status:** [ ] Pending
- **Requirement:** MEM-01 (analysis.md#mem-01)
- **Files:**
  - `.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.js`

**Steps:**
- [ ] Analyze why extraction fails on generated (non-human) content
- [ ] Add fallback: extract keywords from section headers
- [ ] Add fallback: extract terms from file paths
- [ ] Add fallback: extract from spec folder name (e.g., "042-post-merge-refinement-5")
- [ ] Test on existing generated memory files
- [ ] Verify `trigger_phrases` array is non-empty after extraction

**Acceptance Criteria:**
- Generated memory files have non-empty `trigger_phrases` arrays
- `memory_match_triggers` tool finds generated memories
- Fallback chain provides reasonable trigger phrases

---

#### TASK-006: Include Embeddings in Checkpoint Snapshots

- **ID:** P0-006
- **Priority:** P0
- **Effort:** 4 hours
- **Status:** [ ] Pending
- **Requirement:** CB-06 (analysis.md#cb-06-embedding-loss-during-restore)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/checkpoints.js`

**Steps:**
- [ ] Modify `createCheckpoint` to query `vec_memories` table
- [ ] Serialize embeddings alongside `memory_index` data
- [ ] Handle embedding format (Float32Array serialization)
- [ ] Modify restore to insert embeddings back into `vec_memories`
- [ ] Handle embedding dimension validation (768 dimensions)
- [ ] Test checkpoint create/restore round-trip
- [ ] Verify semantic search works immediately after restore

**Acceptance Criteria:**
- Checkpoints include embedding data in snapshot
- Restored memories have working embeddings
- No need to run `memory_index_scan` after restore
- Semantic search returns results after restore

---

#### TASK-007: Fix includeContiguity Parameter Passthrough

- **ID:** P0-007
- **Priority:** P0
- **Effort:** 30 minutes
- **Status:** [ ] Pending
- **Requirement:** SR-01 (analysis.md#sr-01)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`

**Steps:**
- [ ] Locate `handleMemorySearch` function at line 652
- [ ] Find call to `hybridSearch.searchWithFallback()`
- [ ] Pass `includeContiguity` parameter to hybrid search
- [ ] Verify hybrid search implementation uses the parameter
- [ ] Test contiguity appears in search results

**Acceptance Criteria:**
- `includeContiguity: true` returns adjacent memories
- Works with both pure vector and hybrid search modes
- Contiguous memories appear in result set

---

**Phase 1 Checkpoint**: All P0 bugs fixed - core functionality reliable

---

### Phase 2: Significant Issues (P1)

**Purpose**: Fix high-priority issues affecting quality and consistency

---

#### TASK-008: Align Gate Numbering Across Documentation

- **ID:** P1-001
- **Priority:** P1
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Requirement:** CB-07, SK-01 (analysis.md#cb-07-gate-numbering-inconsistency)
- **Files:**
  - `.opencode/skill/system-spec-kit/SKILL.md`
  - `.opencode/command/spec_kit/*.md`
  - `.opencode/command/memory/*.md`
  - `AGENTS.md`

**Steps:**
- [ ] Find all "Gate 3" references in SKILL.md
- [ ] Update to "Gate 5" per AGENTS.md authoritative source
- [ ] Find all gate references in command files
- [ ] Update to match AGENTS.md numbering
- [ ] Verify no Gate 6 references exist (only Gates 1-5 defined)
- [ ] Verify no inconsistencies remain

**Acceptance Criteria:**
- All gate references match AGENTS.md definitions
- No "Gate 3" for spec folder question
- Gate numbering consistent (1-5) across all files

---

#### TASK-009: Fix Step Count Mismatch in Workflow Documentation

- **ID:** P1-002
- **Priority:** P1
- **Effort:** 30 minutes
- **Status:** [ ] Pending
- **Requirement:** CMD-01 (analysis.md#cmd-01)
- **Files:**
  - `.opencode/command/spec_kit/complete.md`

**Steps:**
- [ ] Find "13-step workflow" references
- [ ] Update to "14-step workflow"
- [ ] Update YAML reference if present
- [ ] Verify step table has 14 rows
- [ ] Check other workflow docs for consistency

**Acceptance Criteria:**
- Documentation says "14 steps"
- Step table has 14 entries
- No "13-step" references remain

---

#### TASK-010: Align Level 1 Requirements Between AGENTS.md and SKILL.md

- **ID:** P1-003
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** INT-02 (analysis.md#int-02)
- **Files:**
  - `AGENTS.md`
  - `.opencode/skill/system-spec-kit/SKILL.md`

**Steps:**
- [ ] Compare Level 1 requirements in both files
- [ ] Decide canonical set (recommend: spec.md, plan.md, tasks.md)
- [ ] Update SKILL.md to match AGENTS.md
- [ ] Update validation scripts if affected
- [ ] Verify template generation matches

**Acceptance Criteria:**
- AGENTS.md and SKILL.md have identical Level 1 requirements
- Validation accepts correct Level 1 structure
- No conflicting guidance for developers

---

#### TASK-011: Clean Deprecated Constitutional Files from Database

- **ID:** P1-004
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** INT-03 (analysis.md#int-03)
- **Files:**
  - Database queries
  - `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`

**Steps:**
- [ ] Query for files with `importanceTier='constitutional'` in DB
- [ ] Check YAML frontmatter in actual files for `tier:` value
- [ ] Update DB records to match YAML (downgrade deprecated)
- [ ] Verify constitutional search excludes deprecated files
- [ ] Add validation to prevent future mismatches

**Acceptance Criteria:**
- No deprecated files have constitutional tier in DB
- Constitutional search returns only active rules
- Database matches file YAML metadata

---

#### TASK-012: Fix LRU Cache Eviction Logic

- **ID:** P1-005
- **Priority:** P1
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Requirement:** DB-11 (analysis.md#db-11)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`

**Steps:**
- [ ] Locate cache implementation at line 2158 (approx)
- [ ] Identify current eviction strategy (likely FIFO)
- [ ] Add access time tracking per cache entry
- [ ] Modify eviction to use oldest access time (true LRU)
- [ ] Test eviction order with multiple cache hits/misses

**Acceptance Criteria:**
- Cache evicts least recently used entries first
- Cache size stays within configured limit
- Recently accessed entries survive eviction

---

#### TASK-013: Add Content Hash Comparison for Incremental Indexing

- **ID:** P1-006
- **Priority:** P1
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Requirement:** MEM-02 (analysis.md#mem-02)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`

**Steps:**
- [ ] In `handleMemoryIndexScan`, get stored content hash from DB
- [ ] Compute hash of current file content
- [ ] Compare hashes before re-indexing
- [ ] Skip re-indexing if unchanged (unless `force=true`)
- [ ] Test incremental indexing performance improvement

**Acceptance Criteria:**
- Unchanged files are skipped during index scan
- `force=true` re-indexes all files regardless of hash
- Significant performance improvement for large repos

---

#### TASK-014: Invalidate Trigger Cache on Memory Mutations

- **ID:** P1-007
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** MCP-06 (analysis.md#mcp-06)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/trigger-matcher.js`
  - `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`

**Steps:**
- [ ] Locate memory save/update/delete handlers in context-server.js
- [ ] Import or access trigger matcher cache clear function
- [ ] Call `triggerMatcher.clearCache()` after successful mutations
- [ ] Test cache freshness after memory save
- [ ] Verify new memories immediately findable by triggers

**Acceptance Criteria:**
- New memories immediately findable by `memory_match_triggers`
- No stale trigger matches after updates
- Cache invalidation is targeted (not full rebuild)

---

#### TASK-015: Fix Validation False Positives for New Spec Folders

- **ID:** P1-008
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** VAL-01, VAL-13 (analysis.md#val-01)
- **Files:**
  - `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh`

**Steps:**
- [ ] Locate `implementation-summary.md` check at line 29
- [ ] Make optional for new spec folders (no implementation yet)
- [ ] Add heuristic: if no completed tasks, skip check
- [ ] Test on new spec folder without implementation-summary.md
- [ ] Verify completed specs still require implementation-summary.md

**Acceptance Criteria:**
- New spec folders don't fail validation for missing implementation-summary.md
- Completed specs with tasks marked done require implementation-summary.md
- Validation messages are clear about why checks pass/fail

---

**Phase 2 Checkpoint**: All P1 issues resolved - documentation consistent, caches correct

---

### Phase 3: Refinements (P2)

**Purpose**: Quality improvements and missing features

---

#### TASK-016: Add Missing Database Indexes for Performance

- **ID:** P2-001
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** DB-01, DB-04 (analysis.md#db-01)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`

**Steps:**
- [ ] Add index on `file_path` column
- [ ] Add index on `content_hash` column
- [ ] Add index on `spec_folder` column
- [ ] Use `CREATE INDEX IF NOT EXISTS` for safety
- [ ] Test query performance improvement

**Acceptance Criteria:**
- Indexes created on startup without errors
- File-based lookups use index (verify with EXPLAIN)
- No full table scans for common queries

---

#### TASK-017: Standardize Error Handling Patterns

- **ID:** P2-002
- **Priority:** P2
- **Effort:** 3 hours
- **Status:** [ ] Pending
- **Requirement:** Cross-cutting concern (analysis.md#2-error-handling-patterns)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/*.js`

**Steps:**
- [ ] Audit silent failures (8+ locations identified)
- [ ] Add proper error logging with context
- [ ] Implement retry logic for embedding generation
- [ ] Add try-catch to uncovered async operations
- [ ] Standardize error message format

**Acceptance Criteria:**
- No silent failures in critical paths
- Errors logged with sufficient context for debugging
- Transient failures retried appropriately

---

#### TASK-018: Fix FTS5 Query Injection Risk

- **ID:** P2-003
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** MCP-07 (analysis.md#mcp-07)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/hybrid-search.js`

**Steps:**
- [ ] Locate FTS5 query construction at lines 51-58
- [ ] Implement proper query sanitization
- [ ] Handle special FTS5 characters (AND, OR, NOT, quotes)
- [ ] Test with adversarial query inputs
- [ ] Verify legitimate complex queries still work

**Acceptance Criteria:**
- Long/malformed queries don't cause injection
- FTS5 special syntax properly escaped
- Search quality maintained for normal queries

---

#### TASK-019: Add Checkpoint Decompression Size Validation

- **ID:** P2-004
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** MCP-05 (analysis.md#mcp-05)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/checkpoints.js`

**Steps:**
- [ ] Locate checkpoint decompression at lines 163-173
- [ ] Add size validation before decompression
- [ ] Set reasonable max size limit (e.g., 100MB uncompressed)
- [ ] Reject oversized checkpoints with clear error
- [ ] Test with normal and edge-case checkpoints

**Acceptance Criteria:**
- Zip bomb risk mitigated
- Reasonable checkpoints decompress normally
- Clear error for oversized checkpoints

---

#### TASK-020: Document Missing Scripts in SKILL.md

- **ID:** P2-005
- **Priority:** P2
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Requirement:** SK-07, SK-08 (analysis.md#sk-07)
- **Files:**
  - `.opencode/skill/system-spec-kit/SKILL.md`

**Steps:**
- [ ] Inventory all scripts in scripts/ directory
- [ ] Document check-prerequisites.sh purpose and usage
- [ ] Document common.sh shared functions
- [ ] Document setup.sh installation steps
- [ ] Document check-completion.sh workflow
- [ ] Document test-validation.sh testing approach
- [ ] Add lib/ module documentation section

**Acceptance Criteria:**
- All scripts documented in SKILL.md
- lib/ modules have purpose descriptions
- Users can understand full script ecosystem

---

#### TASK-021: Fix Asymmetric Decay Calculation in Search

- **ID:** P2-006
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** SR-03 (analysis.md#sr-03)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/hybrid-search.js`

**Steps:**
- [ ] Locate decay calculation with `boost * 100`
- [ ] Analyze why 100x multiplier exists
- [ ] Normalize decay to reasonable scale (0-1 or 0-10)
- [ ] Test search result ranking before/after
- [ ] Verify constitutional memories still prioritized

**Acceptance Criteria:**
- Decay calculation uses consistent scale
- Recent memories appropriately boosted
- No result skewing from excessive multiplier

---

#### TASK-022: Fix CWD vs PROJECT_ROOT Path Resolution

- **ID:** P2-007
- **Priority:** P2
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Requirement:** CB-04, GC-01 (analysis.md#cb-04-cwd-vs-project_root-path-resolution)
- **Files:**
  - `.opencode/skill/system-spec-kit/scripts/generate-context.js`

**Steps:**
- [ ] Locate `detectSpecFolder()` at line 2599
- [ ] Replace `process.cwd()` with `CONFIG.PROJECT_ROOT`
- [ ] Audit all path resolution for consistency
- [ ] Add path normalization utility function
- [ ] Test running script from different directories

**Acceptance Criteria:**
- Spec folder detection works from any directory
- Paths consistently use PROJECT_ROOT
- No path resolution failures from CWD mismatch

---

#### TASK-023: Add Memory File Format Validation

- **ID:** P2-008
- **Priority:** P2
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Requirement:** VAL-11 (analysis.md#val-11)
- **Files:**
  - `.opencode/skill/system-spec-kit/scripts/validation/`

**Steps:**
- [ ] Create check-memory-format.sh script
- [ ] Validate YAML frontmatter structure
- [ ] Validate required fields (title, trigger_phrases)
- [ ] Validate ANCHOR tag pairs
- [ ] Integrate with existing validation pipeline
- [ ] Test on valid and invalid memory files

**Acceptance Criteria:**
- Memory files validated during spec validation
- Clear errors for malformed memory files
- Valid memory files pass without issues

---

#### TASK-024: Add Race Condition Handling in Embedding Warmup

- **ID:** P2-009
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** MCP-04 (analysis.md#mcp-04)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`

**Steps:**
- [ ] Locate embedding model warmup at lines 1684-1691
- [ ] Add mutex or lock for warmup sequence
- [ ] Prevent concurrent warmup attempts
- [ ] Handle warmup failure gracefully
- [ ] Test concurrent startup scenarios

**Acceptance Criteria:**
- Only one warmup executes at a time
- Concurrent requests wait for warmup
- Warmup failures don't crash server

---

#### TASK-025: Add Dry-Run Mode for Checkpoint Restore

- **ID:** P2-010
- **Priority:** P2
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Requirement:** CP-10 (analysis.md#cp-10)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/checkpoints.js`
  - `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`

**Steps:**
- [ ] Add `dryRun` parameter to checkpoint_restore tool
- [ ] In dry-run mode, calculate what would change
- [ ] Return summary: memories to add/update/remove
- [ ] Don't modify database in dry-run mode
- [ ] Update tool documentation

**Acceptance Criteria:**
- `dryRun: true` shows restore preview
- No database changes in dry-run mode
- Clear summary of planned operations

---

**Phase 3 Checkpoint**: All P2 refinements complete - system polished and robust

---

### Phase 4: Polish and Documentation

**Purpose**: Final improvements affecting multiple components

---

#### TASK-026: Update All Stale Path References

- **ID:** P3-001
- **Priority:** P3
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** SK-05 (analysis.md#sk-05)
- **Files:**
  - Various documentation files

**Steps:**
- [ ] Search for `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/030-gate3-enforcement`
- [ ] Update to current correct path
- [ ] Search for other potentially stale paths
- [ ] Verify all documentation links work

**Acceptance Criteria:**
- No broken path references
- Documentation links resolve correctly

---

#### TASK-027: Standardize Terminology Across Documentation

- **ID:** P3-002
- **Priority:** P3
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Requirement:** INT-10, INT-11 (analysis.md#int-10)
- **Files:**
  - SKILL.md, AGENTS.md, command files

**Steps:**
- [ ] Decide on "Task" vs "Action" terminology
- [ ] Decide on "Memory" vs "Context" terminology
- [ ] Update all files for consistency
- [ ] Create terminology glossary if helpful

**Acceptance Criteria:**
- Consistent terminology across all docs
- No confusion between terms

---

#### TASK-028: Add Missing Command Implementations

- **ID:** P3-003
- **Priority:** P3
- **Effort:** 4 hours
- **Status:** [ ] Pending
- **Requirement:** CMD-05 through CMD-09 (analysis.md#cmd-05)
- **Files:**
  - `.opencode/command/spec_kit/`
  - `.opencode/command/memory/`

**Steps:**
- [ ] Create /spec_kit:validate command
- [ ] Create /spec_kit:status command
- [ ] Create /memory:list command
- [ ] Create /memory:promote command (tier management)
- [ ] Create /search:help command
- [ ] Test all new commands

**Acceptance Criteria:**
- All listed commands implemented and functional
- Commands follow existing style conventions
- Help text explains usage

---

#### TASK-029: Add Search Type Transparency

- **ID:** P3-004
- **Priority:** P3
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Requirement:** INT-09 (analysis.md#int-09)
- **Files:**
  - `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`

**Steps:**
- [ ] Add `searchType` field to search results
- [ ] Values: "vector", "hybrid", "fts", "trigger"
- [ ] Include fallback chain information
- [ ] Update response format documentation

**Acceptance Criteria:**
- Users know which search type executed
- Fallback chain visible in response

---

#### TASK-030: Create Implementation Summary

- **ID:** P3-005
- **Priority:** P3
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Files:**
  - `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/042-post-merge-refinement-5/implementation-summary.md`

**Steps:**
- [ ] Document all changes made
- [ ] List files modified
- [ ] Summarize testing performed
- [ ] Note any remaining issues

**Acceptance Criteria:**
- Complete record of implementation
- Useful for future reference

---

**Phase 4 Checkpoint**: All tasks complete - ready for final validation

---

## 4. VALIDATION CHECKLIST

### Code Quality
- [ ] Lint passes on modified JavaScript files
- [ ] No console warnings or errors on startup
- [ ] All MCP tools respond correctly

### Documentation
- [ ] SKILL.md updated with any process changes
- [ ] Command documentation accurate
- [ ] Memory files indexed and searchable

### Functional Verification
- [ ] Constitutional memories cached correctly
- [ ] Checkpoints preserve embeddings
- [ ] Gate numbering consistent
- [ ] Trigger matching finds new memories
- [ ] Validation doesn't false-positive on new specs

### Review & Sign-off
- [ ] All acceptance criteria met
- [ ] Manual testing of critical paths
- [ ] implementation-summary.md created

---

## 5. DEPENDENCY GRAPH

```
Phase 1 (P0) - No external dependencies
  TASK-001 ─┐
  TASK-002 ─┤
  TASK-003 ─┼─> Phase 2 can begin
  TASK-004 ─┤
  TASK-005 ─┤
  TASK-006 ─┤
  TASK-007 ─┘

Phase 2 (P1) - Depends on Phase 1
  TASK-008 ─┐
  TASK-009 ─┤
  TASK-010 ─┤
  TASK-011 ─┼─> Phase 3 can begin
  TASK-012 ─┤
  TASK-013 ─┤
  TASK-014 ─┤
  TASK-015 ─┘

Phase 3 (P2) - Depends on Phase 2
  [P] TASK-016 ─┐
  [P] TASK-017 ─┤  (Can run in parallel)
  [P] TASK-018 ─┤
  [P] TASK-019 ─┤
  [P] TASK-020 ─┤
  [P] TASK-021 ─┤
  [P] TASK-022 ─┼─> Phase 4 can begin
  [P] TASK-023 ─┤
  [P] TASK-024 ─┤
  [P] TASK-025 ─┘

Phase 4 (P3) - Depends on Phase 3
  TASK-026 ─┐
  TASK-027 ─┤
  TASK-028 ─┼─> TASK-030 (Summary)
  TASK-029 ─┘
```

---

## 6. EFFORT SUMMARY

| Phase | Tasks | Total Effort | Priority |
|-------|-------|--------------|----------|
| Phase 1 | 7 | 12 hours | P0 - Critical |
| Phase 2 | 8 | 10.5 hours | P1 - High |
| Phase 3 | 10 | 15 hours | P2 - Medium |
| Phase 4 | 5 | 9 hours | P3 - Low |
| **Total** | **30** | **46.5 hours** | |

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Analysis**: See `analysis.md` for detailed bug descriptions
- **Specification**: See `spec.md` for requirements (if created)
- **Plan**: See `plan.md` for technical approach (if created)
- **Validation**: See `checklist.md` for validation criteria (if created)

---

*Document generated: 2025-12-25*
*Spec Folder: 042-post-merge-refinement-5*
<!-- /ANCHOR:cross-refs -->

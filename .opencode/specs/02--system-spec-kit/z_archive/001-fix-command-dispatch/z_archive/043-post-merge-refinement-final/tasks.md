---
title: "Task Breakdown: Post-Merge Refinement Final [043-post-merge-refinement-final/tasks]"
description: "1. [ ] Locate cached version at line 209"
trigger_phrases:
  - "task"
  - "breakdown"
  - "post"
  - "merge"
  - "refinement"
  - "tasks"
  - "043"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown: Post-Merge Refinement Final

| **Field** | **Value** |
|-----------|-----------|
| **Total Tasks** | 34 |
| **P0 Tasks** | 8 |
| **P1 Tasks** | 14 |
| **P2 Tasks** | 12 |
| **Estimated Effort** | 37 hours |

---

## Phase 1: Critical Fixes (P0)

### TASK-P0-001: Remove Duplicate getConstitutionalMemories
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P0-001
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`
- **Evidence:** context-server.js:209 AND 1111 - second definition shadows first, breaking caching
- **Steps:**
  1. [ ] Locate cached version at line 209
  2. [ ] Locate duplicate at line 1111
  3. [ ] Remove duplicate function definition (keep cached version)
  4. [ ] Ensure cached version at line 209 is properly exported
  5. [ ] Test constitutional memory caching works
  6. [ ] Verify no runtime errors
- **Acceptance Criteria:**
  - Only one getConstitutionalMemories function exists
  - Constitutional cache is used (verify with logging)
  - No duplicate function warnings

---

### TASK-P0-002: Fix verifyIntegrityWithPaths
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P0-002
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`, `vector-index.js`
- **Evidence:** context-server.js:1696 calls undefined function
- **Steps:**
  1. [ ] Locate call at context-server.js:1696
  2. [ ] Determine if function exists elsewhere or needs implementation
  3. [ ] Option A: Implement verifyIntegrityWithPaths function
  4. [ ] Option B: Change call to existing verifyIntegrity()
  5. [ ] Test MCP server startup sequence
  6. [ ] Verify no startup crashes
- **Acceptance Criteria:**
  - MCP server starts without errors
  - Integrity verification works correctly

---

### TASK-P0-003: Fix cleanupOrphans Reference
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P0-003
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/context-server.js`
- **Evidence:** context-server.js:1700 references non-existent function
- **Steps:**
  1. [ ] Locate reference at context-server.js:1700
  2. [ ] Determine if function exists elsewhere
  3. [ ] Option A: Implement cleanupOrphans function
  4. [ ] Option B: Remove misleading reference
  5. [ ] Update any related documentation
  6. [ ] Test affected code paths
- **Acceptance Criteria:**
  - No references to undefined functions
  - Orphan cleanup either works or is properly documented as TODO

---

### TASK-P0-004: Fix Column Name Mismatch
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P0-004
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`
- **Evidence:** vector-index.js:2241 uses `last_accessed_at` but schema has `last_accessed`
- **Steps:**
  1. [ ] Find all references to last_accessed_at (lines 2366, 2379, 2387, 2470, 2481, 2528, 2549, 2676, 2680)
  2. [ ] Verify schema column name is `last_accessed`
  3. [ ] Replace all instances with `last_accessed` (matches schema)
  4. [ ] Verify access-tracker.js uses correct name
  5. [ ] Test access tracking updates database correctly
  6. [ ] Run manual database query to confirm updates work
- **Acceptance Criteria:**
  - All column references match schema definition
  - Access tracking works correctly
  - No SQL errors on access operations

---

### TASK-P0-005: Add related_memories Column
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P0-005
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`
- **Evidence:** linkRelatedOnSave() writes to undefined column - silent failure
- **Steps:**
  1. [ ] Add migration function for related_memories column
  2. [ ] Integrate with existing migrateConfidenceColumns or create new migration
  3. [ ] Handle existing databases gracefully (ALTER TABLE IF NOT EXISTS pattern)
  4. [ ] Test linkRelatedOnSave works after migration
  5. [ ] Test getRelatedMemories works after migration
  6. [ ] Verify backward compatibility with existing databases
- **Acceptance Criteria:**
  - Column exists in database after migration
  - Related memory functions work without errors
  - Existing data preserved

---

### TASK-P0-006: Create validate-spec.sh
- **Priority:** P0
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Issue:** P0-006
- **Files:** `.opencode/skill/system-spec-kit/scripts/validate-spec.sh` (new)
- **Evidence:** 100+ lines of docs reference script that doesn't exist at expected path
- **Steps:**
  1. [ ] Review documentation references to understand expected behavior
  2. [ ] Create script based on documentation specifications
  3. [ ] Implement level detection from spec.md
  4. [ ] Implement file existence checks (spec.md, plan.md, checklist.md, etc.)
  5. [ ] Implement placeholder validation (find unfilled placeholders)
  6. [ ] Implement level-appropriate requirement checking
  7. [ ] Add exit codes: 0=pass, 1=warnings, 2=errors
  8. [ ] Test on existing spec folders (various levels)
  9. [ ] Make script executable (chmod +x)
- **Acceptance Criteria:**
  - Script exists at `.opencode/skill/system-spec-kit/scripts/validate-spec.sh`
  - Script is executable
  - Validates spec folders correctly per documentation
  - Returns appropriate exit codes

---

### TASK-P0-007: Create recommend-level.sh
- **Priority:** P0
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P0-007
- **Files:** `.opencode/skill/system-spec-kit/scripts/recommend-level.sh` (new)
- **Evidence:** SKILL.md:172 references non-existent script for level selection
- **Steps:**
  1. [ ] Review SKILL.md documentation for expected behavior
  2. [ ] Create script based on documentation
  3. [ ] Implement LOC counting for changed files
  4. [ ] Recommend level based on thresholds (<100: L1, 100-499: L2, 500+: L3)
  5. [ ] Consider complexity factors beyond LOC
  6. [ ] Test on various input scenarios
  7. [ ] Make script executable (chmod +x)
- **Acceptance Criteria:**
  - Script exists at `.opencode/skill/system-spec-kit/scripts/recommend-level.sh`
  - Script is executable
  - Returns correct level recommendations based on LOC
  - Output is parseable

---

### TASK-P0-008: Update MCP Tool Documentation
- **Priority:** P0
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Issue:** P0-008
- **Files:** `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/command/memory/*.md`, `.opencode/command/spec_kit/*.md`
- **Evidence:** Docs show `memory_save()` but actual is `spec_kit_memory_memory_save()`
- **Steps:**
  1. [ ] Audit all tool name references in SKILL.md
  2. [ ] Audit all tool name references in command files
  3. [ ] Replace `memory_save` with `spec_kit_memory_memory_save`
  4. [ ] Replace `memory_search` with `spec_kit_memory_memory_search`
  5. [ ] Replace `memory_list` with `spec_kit_memory_memory_list`
  6. [ ] Update all command examples to use full namespaced names
  7. [ ] Add note explaining the namespace convention
  8. [ ] Verify consistency across all documentation
- **Acceptance Criteria:**
  - All documentation matches actual MCP tool names
  - No references to non-namespaced tool names
  - Examples work when copy-pasted

---

## Phase 2: Documentation Alignment (P1-DOC)

### TASK-P1-001: Fix Gate Numbering
- **Priority:** P1
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Issue:** P1-001
- **Files:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Evidence:** SKILL.md:187,189,205 says "Gate 3", AGENTS.md:101 says "Gate 4"
- **Steps:**
  1. [ ] Find all "Gate 3" references for spec folder (lines 82, 187, 189, 205, 707)
  2. [ ] Verify AGENTS.md canonical numbering (Gate 4 for spec folder)
  3. [ ] Replace "Gate 3" with "Gate 4" where referring to spec folder question
  4. [ ] Update any gate flowcharts or diagrams
  5. [ ] Verify no inconsistencies remain
  6. [ ] Cross-check with command documentation
- **Acceptance Criteria:**
  - Gate numbering matches AGENTS.md exactly
  - No conflicting gate references

---

### TASK-P1-002: Fix Step Count
- **Priority:** P1
- **Effort:** 0.5 hours
- **Status:** [ ] Pending
- **Issue:** P1-002
- **Files:** `.opencode/command/spec_kit/complete.md`
- **Evidence:** complete.md:389 says "13-step workflow" but table shows 14 steps
- **Steps:**
  1. [ ] Locate line 389 reference to "13-step"
  2. [ ] Locate line 401 reference to "13-step" (if exists)
  3. [ ] Count actual steps in the table
  4. [ ] Change "sequential_13_step" to "sequential_14_step"
  5. [ ] Change "13-step" prose to "14-step"
  6. [ ] Verify table has exactly 14 steps
- **Acceptance Criteria:**
  - All references say 14 steps
  - Table contains exactly 14 steps

---

### TASK-P1-003: Align Level 1 Requirements
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P1-003
- **Files:** `AGENTS.md`, `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/skill/system-spec-kit/scripts/check-files.sh`
- **Evidence:** AGENTS.md lacks implementation-summary.md requirement
- **Steps:**
  1. [ ] Review AGENTS.md Level 1 requirements
  2. [ ] Review SKILL.md Level 1 requirements (lines 136, 239)
  3. [ ] Decide canonical Level 1 (recommend: WITHOUT implementation-summary.md)
  4. [ ] Update SKILL.md line 136 to remove implementation-summary.md from Level 1
  5. [ ] Update SKILL.md line 239 to match
  6. [ ] Update check-files.sh to make implementation-summary.md conditional on Level 2+
  7. [ ] Document decision in decision-record.md
- **Acceptance Criteria:**
  - Level 1 requirements identical in AGENTS.md and SKILL.md
  - check-files.sh validates correctly per aligned requirements

---

### TASK-P1-007: Fix implementation-summary.md Timing
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P1-007
- **Files:** `.opencode/skill/system-spec-kit/scripts/check-files.sh`
- **Evidence:** check-files.sh:29 requires for Level 1 specs that shouldn't need it
- **Steps:**
  1. [ ] Locate check at line 29 in check-files.sh
  2. [ ] Add level detection logic
  3. [ ] Make implementation-summary.md check conditional on Level >= 2
  4. [ ] Test with Level 1 spec folder (should pass without file)
  5. [ ] Test with Level 2 spec folder (should require file)
  6. [ ] Update script documentation
- **Acceptance Criteria:**
  - Level 1 specs pass validation without implementation-summary.md
  - Level 2+ specs still require implementation-summary.md

---

### TASK-P1-008: Fix ALWAYS List Numbering Gap
- **Priority:** P1
- **Effort:** 0.5 hours
- **Status:** [ ] Pending
- **Issue:** P1-008
- **Files:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Evidence:** SKILL.md:505-519 skips number 15
- **Steps:**
  1. [ ] Locate ALWAYS list at lines 505-519
  2. [ ] Identify numbering gap (14 jumps to 16)
  3. [ ] Renumber items to be sequential
  4. [ ] Verify no content was accidentally deleted
  5. [ ] Update any references to numbered items
- **Acceptance Criteria:**
  - ALWAYS list is numbered sequentially with no gaps
  - All items present

---

### TASK-P1-009: Add generate-context.js to Scripts Documentation
- **Priority:** P1
- **Effort:** 0.5 hours
- **Status:** [ ] Pending
- **Issue:** P1-009
- **Files:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Evidence:** generate-context.js not listed in Scripts section
- **Steps:**
  1. [ ] Locate Scripts section in SKILL.md
  2. [ ] Add entry for generate-context.js
  3. [ ] Document purpose: context/memory file generation
  4. [ ] Document usage: `node generate-context.js [spec-folder-path]`
  5. [ ] Document output: creates memory/*.md files
  6. [ ] Verify path is correct
- **Acceptance Criteria:**
  - generate-context.js documented in Scripts section
  - Usage instructions are accurate

---

### TASK-P1-010: Add context_template.md to Template Table
- **Priority:** P1
- **Effort:** 0.5 hours
- **Status:** [ ] Pending
- **Issue:** P1-010
- **Files:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Evidence:** File exists in templates/ but not listed in documentation
- **Steps:**
  1. [ ] Locate template table in SKILL.md
  2. [ ] Verify context_template.md exists in templates/
  3. [ ] Add row for context_template.md
  4. [ ] Document purpose: memory file generation template
  5. [ ] Document when to use
- **Acceptance Criteria:**
  - context_template.md appears in template documentation
  - All template files in templates/ are documented

---

### TASK-P1-011: Fix Terminology Drift
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P1-011
- **Files:** `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/command/spec_kit/*.md`, `.opencode/skill/system-spec-kit/templates/*.md`
- **Evidence:** Mixed terminology: "Last completed task" vs "Last Action" across files
- **Steps:**
  1. [ ] Search for all variations of "Last task" / "Last Action" / "Last completed"
  2. [ ] Decide canonical terminology (recommend: "Last completed task")
  3. [ ] Update SKILL.md to use canonical term
  4. [ ] Update command files to use canonical term
  5. [ ] Update templates to use canonical term
  6. [ ] Verify consistency
- **Acceptance Criteria:**
  - Single terminology used across all files
  - No mixed terms for same concept

---

## Phase 3: Code Fixes (P1-CODE)

### TASK-P1-004: Fix includeContiguity Parameter
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P1-004
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/hybrid-search.js`
- **Evidence:** Parameter extracted but never used in hybrid-search.js
- **Steps:**
  1. [ ] Locate parameter extraction in hybrid-search.js
  2. [ ] Identify where contiguity logic should be applied
  3. [ ] Implement contiguous memory retrieval (adjacent memories)
  4. [ ] Pass parameter through search chain
  5. [ ] Test with includeContiguity: true
  6. [ ] Verify adjacent memories are returned
- **Acceptance Criteria:**
  - includeContiguity parameter is respected
  - Adjacent memories returned when requested

---

### TASK-P1-005: Add Trigger Cache Invalidation
- **Priority:** P1
- **Effort:** 1.5 hours
- **Status:** [ ] Pending
- **Issue:** P1-005
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/trigger-matcher.js`, `context-server.js`
- **Evidence:** No clearCache() calls after save/update/delete operations
- **Steps:**
  1. [ ] Locate trigger cache implementation
  2. [ ] Add cache.clear() call after memory_save
  3. [ ] Add cache.clear() call after memory_update
  4. [ ] Add cache.clear() call after memory_delete
  5. [ ] Test cache invalidation works
  6. [ ] Verify trigger matching sees new/updated memories
- **Acceptance Criteria:**
  - Trigger cache invalidated after mutations
  - New triggers available immediately after save

---

### TASK-P1-006: Fix LRU Cache Implementation
- **Priority:** P1
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Issue:** P1-006
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js` or cache module
- **Evidence:** Evicts first inserted entry, not least recently used
- **Steps:**
  1. [ ] Locate cache implementation
  2. [ ] Analyze current eviction logic
  3. [ ] Implement proper LRU tracking (update timestamp on access)
  4. [ ] Evict entry with oldest last-access time
  5. [ ] Add tests for LRU behavior
  6. [ ] Verify cache size limits work correctly
- **Acceptance Criteria:**
  - Cache evicts least recently used entry
  - Recently accessed entries preserved

---

### TASK-P1-012: Fix Embedding Loss on Checkpoint Restore
- **Priority:** P1
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Issue:** P1-012
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/checkpoints.js`
- **Evidence:** checkpoints.js sets status='pending', embeddings not preserved
- **Steps:**
  1. [ ] Review checkpoint creation logic
  2. [ ] Ensure embeddings are included in checkpoint data
  3. [ ] Review restore logic
  4. [ ] Preserve embedding data during restore
  5. [ ] Don't reset status to 'pending' if embeddings exist
  6. [ ] Test checkpoint create/restore cycle
  7. [ ] Verify embeddings preserved after restore
- **Acceptance Criteria:**
  - Embeddings preserved during checkpoint/restore cycle
  - No need to regenerate embeddings after restore

---

### TASK-P1-013: Create Global /help Command
- **Priority:** P1
- **Effort:** 1.5 hours
- **Status:** [ ] Pending
- **Issue:** P1-013
- **Files:** `.opencode/command/help.md` (new)
- **Evidence:** Users cannot discover available commands system-wide
- **Steps:**
  1. [ ] Create help.md command file
  2. [ ] List all available command namespaces
  3. [ ] Show how to get namespace-specific help
  4. [ ] Include examples for common workflows
  5. [ ] Add cross-references to skill documentation
  6. [ ] Test command discovery
- **Acceptance Criteria:**
  - /help command exists and works
  - Lists all available namespaces
  - Shows how to get more specific help

---

### TASK-P1-014: Create Namespace Help Commands
- **Priority:** P1
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P1-014
- **Files:** `.opencode/command/memory/help.md` (new), `.opencode/command/search/help.md` (new)
- **Evidence:** Namespace-specific help commands don't exist
- **Steps:**
  1. [ ] Create memory/help.md listing all memory commands
  2. [ ] Create search/help.md listing all search commands
  3. [ ] Document each command briefly
  4. [ ] Add usage examples
  5. [ ] Cross-reference related commands
  6. [ ] Test help command discovery
- **Acceptance Criteria:**
  - /memory:help and /search:help commands exist
  - Accurately list all commands in namespace
  - Provide useful examples

---

## Phase 4: Quality Improvements (P2)

### TASK-P2-001: Add Database Indexes
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P2-001
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`
- **Evidence:** Schema has no indexes - impacts query performance
- **Steps:**
  1. [ ] Review common query patterns
  2. [ ] Add index on file_path column
  3. [ ] Add index on content_hash column
  4. [ ] Add index on spec_folder column
  5. [ ] Add composite indexes for common query combinations
  6. [ ] Add migration to create indexes on existing databases
  7. [ ] Test query performance improvement
- **Acceptance Criteria:**
  - Indexes created on key columns
  - Query performance measurably improved

---

### TASK-P2-002: Standardize Timestamp Format
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P2-002
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/src/vector-index.js`
- **Evidence:** Mixed formats: TEXT dates vs INTEGER epoch in schema
- **Steps:**
  1. [ ] Audit all timestamp columns
  2. [ ] Decide canonical format (recommend: INTEGER epoch for consistency)
  3. [ ] Add migration to convert TEXT to INTEGER
  4. [ ] Update all INSERT/UPDATE statements
  5. [ ] Update all SELECT statements
  6. [ ] Test timestamp operations
- **Acceptance Criteria:**
  - All timestamps use same format
  - Existing data migrated correctly

---

### TASK-P2-003: Fix JSONC Parser Edge Case
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P2-003
- **Files:** `.opencode/skill/system-spec-kit/scripts/generate-context.js`
- **Evidence:** generate-context.js:94-96 fails on `\\\"` patterns
- **Steps:**
  1. [ ] Locate regex at lines 94-96
  2. [ ] Identify failing pattern with escaped backslash before quote
  3. [ ] Update regex to handle `\\\"` correctly
  4. [ ] Add test cases for edge cases
  5. [ ] Test with files containing escaped patterns
- **Acceptance Criteria:**
  - JSONC parser handles `\\\"` patterns correctly
  - No false positives/negatives in comment stripping

---

### TASK-P2-004: Replace Process.exit with Throw
- **Priority:** P2
- **Effort:** 0.5 hours
- **Status:** [ ] Pending
- **Issue:** P2-004
- **Files:** `.opencode/skill/system-spec-kit/scripts/generate-context.js`
- **Evidence:** detectSpecFolder() calls exit(1) - prevents graceful error handling
- **Steps:**
  1. [ ] Locate process.exit(1) call in detectSpecFolder
  2. [ ] Replace with throw new Error()
  3. [ ] Update callers to catch error
  4. [ ] Provide meaningful error message
  5. [ ] Test error handling flow
- **Acceptance Criteria:**
  - No process.exit in library functions
  - Errors can be caught and handled gracefully

---

### TASK-P2-005: Improve Level Detection Regex
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P2-005
- **Files:** `.opencode/skill/system-spec-kit/scripts/generate-context.js` or validation scripts
- **Evidence:** Only matches exact table format, misses prose declarations
- **Steps:**
  1. [ ] Locate level detection regex
  2. [ ] Add support for prose format ("Level: 2")
  3. [ ] Add support for frontmatter format
  4. [ ] Test with various spec.md formats
  5. [ ] Maintain backward compatibility with table format
- **Acceptance Criteria:**
  - Level detected from table format
  - Level detected from prose format
  - Level detected from frontmatter

---

### TASK-P2-006: Improve Unicode Checkmark Coverage
- **Priority:** P2
- **Effort:** 0.5 hours
- **Status:** [ ] Pending
- **Issue:** P2-006
- **Files:** `.opencode/skill/system-spec-kit/scripts/check-files.sh` or validation logic
- **Evidence:** Only checks for checkmarks at specific Unicode values
- **Steps:**
  1. [ ] Identify all possible checkmark Unicode characters
  2. [ ] Add common variants: ✓ ✔ ☑ 
  3. [ ] Update regex/matching logic
  4. [ ] Test with various checkmark styles
- **Acceptance Criteria:**
  - Common checkmark variants recognized
  - No false negatives for valid completed items

---

### TASK-P2-007: Align SKILL.md with YAML Files
- **Priority:** P2
- **Effort:** 2 hours
- **Status:** [ ] Pending
- **Issue:** P2-007
- **Files:** `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/workflow/*.yaml`
- **Evidence:** Rules in SKILL.md not reflected in workflow YAMLs
- **Steps:**
  1. [ ] Identify rules in SKILL.md
  2. [ ] Compare with workflow YAML files
  3. [ ] Add missing rules to YAMLs
  4. [ ] Remove conflicting/outdated rules
  5. [ ] Verify parity between docs
  6. [ ] Document sync process for future
- **Acceptance Criteria:**
  - SKILL.md rules reflected in YAMLs
  - No conflicting definitions

---

### TASK-P2-008: Document Maintenance Locations
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P2-008
- **Files:** `.opencode/skill/system-spec-kit/SKILL.md`
- **Evidence:** SKILL.md + AGENTS.md + YAMLs require manual sync
- **Steps:**
  1. [ ] Create "Maintenance Guide" section in SKILL.md
  2. [ ] List all files that must stay in sync
  3. [ ] Document what content is canonical where
  4. [ ] Add checklist for updates
  5. [ ] Consider automation options for future
- **Acceptance Criteria:**
  - Clear documentation of sync requirements
  - Developers know what to update together

---

### TASK-P2-009: Create Level 0 Protocol
- **Priority:** P2
- **Effort:** 1.5 hours
- **Status:** [ ] Pending
- **Issue:** P2-009
- **Files:** `AGENTS.md`, `.opencode/skill/system-spec-kit/SKILL.md`
- **Evidence:** <10 LOC changes require full spec folder
- **Steps:**
  1. [ ] Define Level 0 criteria (<10 LOC, single file, no logic change)
  2. [ ] Document when Level 0 applies
  3. [ ] Define minimal documentation requirements
  4. [ ] Update AGENTS.md with Level 0
  5. [ ] Update SKILL.md with Level 0
  6. [ ] Update check-files.sh to recognize Level 0
- **Acceptance Criteria:**
  - Level 0 protocol documented
  - Trivial changes don't require full spec folder

---

### TASK-P2-010: Add Unit Tests for MCP Server
- **Priority:** P2
- **Effort:** 4 hours
- **Status:** [ ] Pending
- **Issue:** P2-010
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/test/` (new)
- **Evidence:** Zero test coverage for context-server.js
- **Steps:**
  1. [ ] Set up test framework (Jest or similar)
  2. [ ] Create test directory structure
  3. [ ] Add unit tests for vector-index.js core functions
  4. [ ] Add unit tests for hybrid-search.js
  5. [ ] Add unit tests for trigger-matcher.js
  6. [ ] Add unit tests for checkpoints.js
  7. [ ] Aim for 50% coverage on critical paths
- **Acceptance Criteria:**
  - Test framework configured
  - Core functions have unit tests
  - Tests pass

---

### TASK-P2-011: Add Integration Tests
- **Priority:** P2
- **Effort:** 3 hours
- **Status:** [ ] Pending
- **Issue:** P2-011
- **Files:** `.opencode/skill/system-spec-kit/mcp-server/test/integration/` (new)
- **Evidence:** No end-to-end workflow tests
- **Steps:**
  1. [ ] Create integration test directory
  2. [ ] Test memory save → search → retrieve flow
  3. [ ] Test checkpoint create → restore flow
  4. [ ] Test trigger matching with mutations
  5. [ ] Test database migrations
  6. [ ] Document how to run tests
- **Acceptance Criteria:**
  - Integration tests cover main workflows
  - Tests can be run locally

---

### TASK-P2-012: Document CI/CD Requirements
- **Priority:** P2
- **Effort:** 1 hour
- **Status:** [ ] Pending
- **Issue:** P2-012
- **Files:** `.opencode/skill/system-spec-kit/CI-CD-REQUIREMENTS.md` (new)
- **Evidence:** No automated testing on commit/PR
- **Steps:**
  1. [ ] Document ideal CI/CD pipeline
  2. [ ] List test commands to run
  3. [ ] Define success criteria
  4. [ ] Note dependencies and environment needs
  5. [ ] Create as spec for future implementation
- **Acceptance Criteria:**
  - CI/CD requirements documented
  - Ready for implementation in future spec

---

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1 (P0 - Critical) | 8 | 0/8 complete |
| Phase 2 (P1-DOC - Documentation) | 8 | 0/8 complete |
| Phase 3 (P1-CODE - Code Fixes) | 6 | 0/6 complete |
| Phase 4 (P2 - Quality) | 12 | 0/12 complete |
| **Total** | **34** | **0/34 complete** |

---

## Effort Estimate by Phase

| Phase | Tasks | Estimated Hours |
|-------|-------|-----------------|
| Phase 1 (P0) | 8 | 10 hours |
| Phase 2 (P1-DOC) | 8 | 6.5 hours |
| Phase 3 (P1-CODE) | 6 | 9 hours |
| Phase 4 (P2) | 12 | 16.5 hours |
| **Total** | **34** | **42 hours** |

---

## Deferred Items (P3)

The following P3 items are out of scope for this spec and tracked for future work:

| ID | Description | Reason Deferred |
|----|-------------|-----------------|
| P3-001 | Deprecated substr() call | Low impact, polish |
| P3-002 | YAML diagnostic error | Warning only |
| P3-003 | sqlite-vec status visibility | Nice-to-have |
| P3-004 | Memory tier in detailed output | Nice-to-have |
| P3-005 | Embedding status visibility | Nice-to-have |

---

*Generated: 2025-12-25*
*Spec: 043-post-merge-refinement-final*

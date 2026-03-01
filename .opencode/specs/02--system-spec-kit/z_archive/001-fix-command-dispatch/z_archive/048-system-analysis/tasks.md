---
title: "Task Breakdown: SpecKit & Memory System Remediation [048-system-analysis/tasks]"
description: "Legend"
trigger_phrases:
  - "task"
  - "breakdown"
  - "speckit"
  - "memory"
  - "system"
  - "tasks"
  - "048"
importance_tier: "normal"
contextType: "implementation"
---
# Task Breakdown: SpecKit & Memory System Remediation

> **Spec**: 048-system-analysis
> **Total Tasks**: 35
> **Level**: 3

---

## Task Summary

| Priority | Count | Status |
|----------|-------|--------|
| P0 (Critical) | 4 | ☐ Pending |
| P1 (Important) | 11 | ☐ Pending |
| P2 (Nice to Have) | 20 | ☐ Pending |
| P3 (Tech Debt) | 6 | ☐ Deferred |
| **Total** | **35** | |

---

## P0: Critical Tasks (MUST COMPLETE)

### T-P0-001: Add null check to getFailedEmbeddings()
- **Bug ID**: BUG-H1
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/retry-manager.js:104-112`
- **Work Stream**: WS1 (MCP Server Core)
- **Description**: `getFailedEmbeddings()` calls `db.prepare()` without checking if database is initialized, causing crash
- **Acceptance Criteria**:
  - [ ] Null check added at function start
  - [ ] Returns empty array if db is null
  - [ ] Warning logged when db is null
  - [ ] Unit test added for null case

---

### T-P0-002: Add null check to getRetryStats()
- **Bug ID**: BUG-H2
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/retry-manager.js:121-131`
- **Work Stream**: WS1 (MCP Server Core)
- **Description**: `getRetryStats()` calls `db.prepare()` without checking if database is initialized
- **Acceptance Criteria**:
  - [ ] Null check added at function start
  - [ ] Returns default stats object if db is null
  - [ ] Warning logged when db is null
  - [ ] Unit test added for null case

---

### T-P0-003: Fix tempPath scope in generate-context.js
- **Bug ID**: BUG-H3
- **File**: `.opencode/skill/system-spec-kit/scripts/generate-context.js:2727`
- **Work Stream**: WS2 (Scripts)
- **Description**: `tempPath` variable is referenced in catch block but defined inside try block, causing undefined error
- **Acceptance Criteria**:
  - [ ] `tempPath` declared before try block
  - [ ] Catch block checks if `tempPath` exists before cleanup
  - [ ] Error handling tested with simulated write failure
  - [ ] No undefined variable errors in catch block

---

### T-P0-004: Add implementation-summary.md to JS validator
- **Bug ID**: BUG-H4
- **File**: `.opencode/skill/system-spec-kit/scripts/validate-spec-folder.js`
- **Work Stream**: WS2 (Scripts)
- **Description**: JS validator missing `implementation-summary.md` check for Level 1, inconsistent with bash validator
- **Acceptance Criteria**:
  - [ ] `LEVEL_REQUIREMENTS` updated to include `implementation-summary.md`
  - [ ] Conditional check matches bash validator logic (after implementation starts)
  - [ ] Validation output matches bash validator

---

## P1: Important Tasks (SHOULD COMPLETE)

### T-P1-001: Add input validation to hybrid-search init()
- **Bug ID**: BUG-M3
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/hybrid-search.js:20-23`
- **Work Stream**: WS1 (MCP Server Core)
- **Acceptance Criteria**:
  - [ ] Validate `database` parameter is not null
  - [ ] Validate `vectorSearchFn` is a function
  - [ ] Throw descriptive error if validation fails

---

### T-P1-002: Fix Date parsing in generate-context.js
- **Bug ID**: BUG-M1
- **File**: `.opencode/skill/system-spec-kit/scripts/generate-context.js:4131,4176-4177`
- **Work Stream**: WS2 (Scripts)
- **Acceptance Criteria**:
  - [ ] Store ISO timestamp alongside formatted timestamp
  - [ ] Use ISO timestamp for Date parsing
  - [ ] Backward compatible with existing formatted timestamps

---

### T-P1-003: Create debug command YAML assets
- **Bug ID**: BUG-M4
- **File**: `.opencode/command/spec_kit/assets/`
- **Work Stream**: WS4 (Commands & Assets)
- **Acceptance Criteria**:
  - [ ] `spec_kit_debug_auto.yaml` created
  - [ ] `spec_kit_debug_confirm.yaml` created
  - [ ] Assets follow pattern of other command assets
  - [ ] Debug command tested with both modes

---

### T-P1-004: Add try/catch to cleanup-orphaned-vectors.js
- **Bug ID**: BUG-M6
- **File**: `.opencode/skill/system-spec-kit/scripts/cleanup-orphaned-vectors.js`
- **Work Stream**: WS2 (Scripts)
- **Acceptance Criteria**:
  - [ ] Main logic wrapped in try/catch
  - [ ] Graceful exit on error with message
  - [ ] Non-zero exit code on failure

---

### T-P1-005: Create .env.example
- **Bug ID**: SEC-3
- **File**: `.env.example`
- **Work Stream**: WS8 (Security & Config)
- **Acceptance Criteria**:
  - [ ] All expected environment variables documented
  - [ ] No actual secrets in file
  - [ ] Comments explain each variable

---

### T-P1-006: Add checkpoint name validation
- **Bug ID**: SEC-4
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/checkpoints.js`
- **Work Stream**: WS8 (Security & Config)
- **Note**: Less severe than initially assessed - parameterized queries prevent SQL injection
- **Acceptance Criteria**:
  - [ ] Regex validation `/^[a-zA-Z0-9_-]+$/`
  - [ ] Descriptive error message for invalid names
  - [ ] Test with special characters

---

### T-P1-007: Update search-weights.json version
- **Bug ID**: BUG-L11
- **File**: `.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json`
- **Work Stream**: WS8 (Security & Config)
- **Acceptance Criteria**:
  - [ ] Version updated from 11.0.0 to 16.0.0

---

### T-P1-008: Increase constitutional cache TTL
- **Bug ID**: BUG-L10
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js:205`
- **Work Stream**: WS1 (MCP Server Core)
- **Acceptance Criteria**:
  - [ ] TTL increased from 60s to 300s (5 minutes)
  - [ ] Comment added explaining rationale

---

### T-P1-009: Extract formatAgeString() to utility
- **Bug ID**: PERF-2
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Work Stream**: WS2 (Scripts)
- **Acceptance Criteria**:
  - [ ] Function extracted to shared utility file
  - [ ] Both usages updated to import from utility
  - [ ] Duplicate code removed (44 lines)

---

### T-P1-010: Implement prepared statement caching
- **Bug ID**: PERF-1
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Work Stream**: WS1 (MCP Server Core)
- **Acceptance Criteria**:
  - [ ] Top 5-10 most common queries cached at module level
  - [ ] Cache populated on first use
  - [ ] Performance improvement measured

---

### T-P1-011: Sync tier weights in documentation
- **Bug ID**: ALIGN-2
- **File**: `.opencode/skill/system-spec-kit/references/memory_system.md`
- **Work Stream**: WS5 (Documentation)
- **Acceptance Criteria**:
  - [ ] Tier weights match `importance-tiers.js` values
  - [ ] critical=1.0, important=0.8, normal=0.5, temporary=0.3

---

## P2: Nice to Have Tasks

### T-P2-001: Document 10 undocumented scripts
- **Bug ID**: BUG-L2
- **File**: `.opencode/skill/system-spec-kit/SKILL.md`
- **Acceptance Criteria**: All scripts in scripts/ folder documented

---

### T-P2-002: Remove cross-template dependency
- **Bug ID**: BUG-L3
- **File**: `.opencode/skill/system-spec-kit/templates/spec.md`
- **Acceptance Criteria**: Remove CHK036-038 references

---

### T-P2-003: Update .gitignore path
- **Bug ID**: BUG-L12
- **File**: `.gitignore`
- **Acceptance Criteria**: Path matches actual database location

---

### T-P2-004: Fix quick_reference.md template count
- **Bug ID**: ALIGN-1
- **File**: `.opencode/skill/system-spec-kit/references/quick_reference.md`
- **Acceptance Criteria**: Change "12 total" to "10"

---

### T-P2-005: Document re-embedding behavior
- **Bug ID**: ALIGN-3
- **File**: `.opencode/skill/system-spec-kit/references/memory_system.md`
- **Acceptance Criteria**: Clarify re-embedding only on title change

---

### T-P2-006: Clarify deprecated tier behavior
- **Bug ID**: ALIGN-4
- **File**: `.opencode/skill/system-spec-kit/references/memory_system.md`
- **Acceptance Criteria**: Change "rarely" to "never surfaces"

---

### T-P2-007: Document rate limiting
- **Bug ID**: ALIGN-6
- **File**: `.opencode/skill/system-spec-kit/references/memory_system.md`
- **Acceptance Criteria**: Document 1-minute cooldown on memory_index_scan

---

### T-P2-008: Clarify spec folder filter behavior
- **Bug ID**: ALIGN-7
- **File**: `.opencode/skill/system-spec-kit/references/memory_system.md`
- **Acceptance Criteria**: Document prefix matching (startsWith)

---

### T-P2-009: Fix Gate terminology in skill_advisor.py
- **Bug ID**: ALIGN-8
- **File**: `.opencode/scripts/skill_advisor.py`
- **Acceptance Criteria**: Docstring says "Gate 2" to match AGENTS.md

---

### T-P2-010: Standardize mode terminology
- **Bug ID**: ALIGN-9
- **Files**: `SKILL.md`, `AGENTS.md`
- **Acceptance Criteria**: Consistent "Direct mode" vs "JSON mode" terminology

---

### T-P2-011: Fix legacy memory file anchors
- **Bug ID**: BUG-L8
- **File**: Various legacy memory files
- **Acceptance Criteria**: All anchors have closing `-->`

---

### T-P2-012: Fix e2e-test-memory.md anchor
- **Bug ID**: BUG-L9
- **File**: `e2e-test-memory.md`
- **Acceptance Criteria**: Use HTML comment format, not markdown heading

---

### T-P2-013: Validate id is positive integer
- **Bug ID**: BUG-L6
- **File**: `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
- **Acceptance Criteria**: Reject negative or zero IDs with clear error

---

### T-P2-014: Create 5-minute Quick Start guide
- **Bug ID**: IMP-1
- **File**: `QUICK_START.md` or similar
- **Acceptance Criteria**: Max 50 lines, progressive disclosure

---

### T-P2-015: Add progress indicators
- **Bug ID**: IMP-2
- **File**: `.opencode/skill/system-spec-kit/scripts/generate-context.js`
- **Acceptance Criteria**: Progress output during long operations

---

### T-P2-016: Auto-suggest handover detection
- **Bug ID**: IMP-3
- **File**: `.opencode/skill/system-spec-kit/SKILL.md`
- **Acceptance Criteria**: Document session end detection triggers

---

### T-P2-017: Async file reads in formatSearchResults
- **Bug ID**: PERF-4
- **File**: `.opencode/skill/system-spec-kit/mcp_server/context-server.js`
- **Acceptance Criteria**: Replace `fs.readFileSync` with `Promise.all()`

---

### T-P2-018: Batch constitutional cache
- **Bug ID**: PERF-5
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js`
- **Acceptance Criteria**: Global cache, filter by specFolder in memory

---

### T-P2-019: Document template-reality gap as intentional
- **Bug ID**: ALIGN-10
- **File**: `.opencode/skill/system-spec-kit/references/template_guide.md`
- **Acceptance Criteria**: Add note that templates are aspirational

---

### T-P2-020: Use string includes for simple phrases
- **Bug ID**: PERF-3
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/trigger-matcher.js`
- **Work Stream**: WS3 (Trigger & Search)
- **Acceptance Criteria**:
  - [ ] Simple alphanumeric phrases use `String.includes`
  - [ ] Regex reserved for patterns with special chars
  - [ ] Performance improvement measured

---

## P3: Technical Debt (DEFERRED)

### T-P3-001: Create test fixtures for validation
- **Description**: 40+ fixtures referenced but don't exist
- **Status**: Deferred to separate spec folder

---

### T-P3-002: Add Unicode normalization
- **Description**: Trigger matching doesn't normalize Unicode
- **Status**: Deferred - edge case

---

### T-P3-003: Constitutional directory scanning
- **Description**: Auto-discover `.opencode/skill/*/constitutional/`
- **Status**: Deferred - manual indexing works

---

### T-P3-004: Portable paths in configs
- **Description**: Replace absolute paths with env vars
- **Status**: Deferred - works locally

---

### T-P3-005: Complete JS validators
- **Description**: `validate-memory-file.js` is a stub
- **Status**: Deferred - bash validators are authoritative

---

### T-P3-006: Add dryRun to memory_delete
- **Description**: Preview what would be deleted
- **Status**: Deferred - nice to have

---

## Task Tracking

```
Legend:
☐ - Pending
◐ - In Progress
✓ - Complete
✗ - Blocked
⊘ - Cancelled
```

| Phase | P0 | P1 | P2 | P3 |
|-------|----|----|----|----|
| Phase 1 | ☐☐☐☐ | | | |
| Phase 2 | | ☐☐☐☐☐☐☐☐☐☐☐ | | |
| Phase 3 | | | ☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐☐ | |
| Phase 4 | | | | ☐☐☐☐☐☐ |

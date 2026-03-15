---
title: "Tasks: Context-Server Modularization - Implementation Breakdown [066-context-server-modularization/tasks]"
description: "Task list for decomposing context-server.js into focused modules."
trigger_phrases:
  - "tasks"
  - "context"
  - "server"
  - "modularization"
  - "implementation"
  - "066"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Context-Server Modularization - Implementation Breakdown

Task list for decomposing context-server.js into focused modules.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending task |
| `[x]` | Completed task |
| `[P]` | Can be done in parallel with other [P] tasks |

---

<!-- /ANCHOR:notation -->
## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: mcp-server, modularization
- **Priority**: P1

### Input
Design documents from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/066-context-server-modularization`

### Prerequisites
- **Required**: `plan.md`, `spec.md`

---

## 2. TASK GROUPS BY PHASE

### Phase 1: Preparation

**Purpose**: Create baseline and directory structure

- [ ] T001 Create snapshot of current MCP tool outputs for comparison
- [ ] T002 [P] Create directory structure: core/, handlers/, formatters/, utils/, hooks/
- [ ] T003 [P] Document function dependency map from context-server.js
- [ ] T004 Create index.js stub files in each new directory

**Checkpoint**: Directory structure ready, baseline captured

---

### Phase 2: Utils Extraction (Lowest Risk)

**Purpose**: Extract standalone utilities with no external dependencies

- [ ] T005 Extract `validateQuery()` to utils/validators.js (lines 384-399)
- [ ] T006 Extract `validateInputLengths()` to utils/validators.js (lines 553-571)
- [ ] T007 Extract `INPUT_LIMITS` constant to utils/validators.js (lines 538-546)
- [ ] T008 [P] Extract `safeJsonParse()` to utils/json-helpers.js (lines 489-496)
- [ ] T009 Extract `processWithRetry()` to utils/batch-processor.js (lines 423-444)
- [ ] T010 Extract `processBatches()` to utils/batch-processor.js (lines 455-477)
- [ ] T011 Update utils/index.js with re-exports
- [ ] T012 Update context-server.js imports to use utils/
- [ ] T013 Verify MCP tools still work

**Checkpoint**: Utils extracted, imports updated, tools verified

---

### Phase 3: Formatters Extraction

**Purpose**: Extract response formatting logic

- [ ] T014 Extract `estimateTokens()` to formatters/token-metrics.js (lines 75-79)
- [ ] T015 Extract `calculateTokenMetrics()` to formatters/token-metrics.js (lines 88-131)
- [ ] T016 Extract `formatSearchResults()` to formatters/search-results.js (lines 1199-1313)
- [ ] T017 Update formatters/index.js with re-exports
- [ ] T018 Update context-server.js imports to use formatters/
- [ ] T019 Verify memory_search and memory_match_triggers work

**Checkpoint**: Formatters extracted, search results formatting verified

---

### Phase 4: Core Extraction

**Purpose**: Extract server configuration and state management

- [ ] T020 Extract constants to core/config.js (lines 40-150)
  - BATCH_SIZE, BATCH_DELAY_MS, INDEX_SCAN_COOLDOWN
  - LIB_DIR, SHARED_DIR, DATABASE_PATH paths
- [ ] T021 Extract `checkDatabaseUpdated()` to core/db-state.js (lines 282-298)
- [ ] T022 Extract `reinitializeDatabase()` to core/db-state.js (lines 304-321)
- [ ] T023 Extract `getLastScanTime()` to core/db-state.js (lines 332-348)
- [ ] T024 Extract `setLastScanTime()` to core/db-state.js (lines 355-369)
- [ ] T025 Extract tool definitions to core/server-setup.js (lines 577-940)
- [ ] T026 Update core/index.js with re-exports
- [ ] T027 Update context-server.js imports to use core/
- [ ] T028 Verify all MCP tools and startup work

**Checkpoint**: Core extracted, server initialization verified

---

### Phase 5: Handlers Extraction

**Purpose**: Extract all MCP tool handlers

**Part A: Search & Triggers**
- [ ] T029 Extract `handleMemorySearch()` to handlers/memory-search.js (lines 1040-1189)
- [ ] T030 Extract `handleMemoryMatchTriggers()` to handlers/memory-triggers.js (lines 1331-1515)

**Part B: CRUD Operations**
- [ ] T031 Extract `handleMemoryDelete()` to handlers/memory-crud.js (lines 1525-1622)
- [ ] T032 Extract `handleMemoryUpdate()` to handlers/memory-crud.js (lines 1623-1735)
- [ ] T033 Extract `handleMemoryList()` to handlers/memory-crud.js (lines 1736-1825)
- [ ] T034 Extract `handleMemoryStats()` to handlers/memory-crud.js (lines 1826-1890)
- [ ] T035 Extract `handleMemoryHealth()` to handlers/memory-crud.js (lines 1891-1940)

**Part C: Save & Index**
- [ ] T036 Extract `indexMemoryFile()` to handlers/memory-save.js (lines 2096-2185)
- [ ] T037 Extract `handleMemorySave()` to handlers/memory-save.js (lines 2186-2287)
- [ ] T038 Extract `handleMemoryIndexScan()` to handlers/memory-index.js (lines 2288-2440)
- [ ] T039 Extract `indexSingleFile()` to handlers/memory-index.js (lines 2441-2465)
- [ ] T040 Extract `findConstitutionalFiles()` to handlers/memory-index.js

**Part D: Checkpoints**
- [ ] T041 Extract `handleCheckpointCreate()` to handlers/checkpoints.js (lines 1941-1969)
- [ ] T042 Extract `handleCheckpointList()` to handlers/checkpoints.js (lines 1970-1998)
- [ ] T043 Extract `handleCheckpointRestore()` to handlers/checkpoints.js (lines 1999-2022)
- [ ] T044 Extract `handleCheckpointDelete()` to handlers/checkpoints.js (lines 2023-2051)
- [ ] T045 Extract `handleMemoryValidate()` to handlers/checkpoints.js (lines 2052-2095)

**Part E: Integration**
- [ ] T046 Update handlers/index.js with re-exports
- [ ] T047 Update context-server.js to import handlers from handlers/
- [ ] T048 Update tool dispatch switch statement to use imported handlers
- [ ] T049 Verify all 12 MCP tools work

**Checkpoint**: All handlers extracted, all tools verified

---

### Phase 6: Hooks Extraction

**Purpose**: Extract SK-004 memory surfacing

- [ ] T050 Extract `extract_context_hint()` to hooks/memory-surface.js (lines 171-187)
- [ ] T051 Extract `get_constitutional_memories()` to hooks/memory-surface.js (lines 193-227)
- [ ] T052 Extract `auto_surface_memories()` to hooks/memory-surface.js (lines 235-267)
- [ ] T053 Extract `MEMORY_AWARE_TOOLS` constant to hooks/memory-surface.js (lines 153-164)
- [ ] T054 Update hooks/index.js with re-exports
- [ ] T055 Update context-server.js to use hooks/
- [ ] T056 Verify SK-004 memory surfacing works

**Checkpoint**: SK-004 hooks extracted, auto-surfacing verified

---

### Phase 7: Entry Point Refactor

**Purpose**: Slim context-server.js to orchestration only

- [ ] T057 Remove all extracted code from context-server.js
- [ ] T058 Add clean imports from core/, handlers/, formatters/, utils/, hooks/
- [ ] T059 Keep only: main(), startupScan logic, signal handlers
- [ ] T060 Verify context-server.js is <200 lines
- [ ] T061 Run full MCP tool verification

**Checkpoint**: Entry point slimmed, all tools work

---

### Phase 8: Cleanup & Validation

**Purpose**: Final verification and documentation

- [ ] T062 Run snapshot comparison (outputs must match baseline)
- [ ] T063 Verify all modules are <300 lines each
- [ ] T064 Test startup scan completes without errors
- [ ] T065 Test all checkpoint operations
- [ ] T066 Update implementation-summary.md with results
- [ ] T067 Clean up any scratch/ files

**Checkpoint**: All validation complete, documentation updated

---

## 3. VALIDATION CHECKLIST

### Code Quality
- [ ] All modules <300 lines
- [ ] context-server.js <200 lines
- [ ] No circular dependencies
- [ ] All imports follow layering rules

### Functionality
- [ ] All 12 MCP tools work identically
- [ ] Startup scan completes
- [ ] SK-004 memory surfacing works
- [ ] Checkpoint operations work

### Documentation
- [ ] spec.md complete
- [ ] plan.md complete
- [ ] tasks.md complete (this file)
- [ ] checklist.md complete
- [ ] decision-record.md complete
- [ ] implementation-summary.md created (after completion)

---

## 4. SUMMARY

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Preparation | T001-T004 | Pending |
| Phase 2: Utils | T005-T013 | Pending |
| Phase 3: Formatters | T014-T019 | Pending |
| Phase 4: Core | T020-T028 | Pending |
| Phase 5: Handlers | T029-T049 | Pending |
| Phase 6: Hooks | T050-T056 | Pending |
| Phase 7: Entry Point | T057-T061 | Pending |
| Phase 8: Cleanup | T062-T067 | Pending |

**Total Tasks**: 67

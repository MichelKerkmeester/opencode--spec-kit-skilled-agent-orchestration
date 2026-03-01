---
title: "Tasks: Memory Command Separation - Implementation Breakdown [068-memory-index-commands/tasks]"
description: "Task list for separating /memory:search into /memory:search (read-only) and /memory:database (management)."
trigger_phrases:
  - "tasks"
  - "memory"
  - "command"
  - "separation"
  - "implementation"
  - "068"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Command Separation - Implementation Breakdown

Task list for separating `/memory:search` into `/memory:search` (read-only) and `/memory:database` (management).

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending task |
| `[x]` | Completed task |
| `[P]` | Can be done in parallel with other [P] tasks |
| `[B]` | Blocked - waiting on dependency |

---

## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: memory-system, commands, refactoring
- **Priority**: P1

### Input
Design documents from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/068-memory-index-commands`

### Prerequisites
- **Required**: `plan.md`, `spec.md`

### Organization
Tasks are grouped by phase to enable clear progress tracking.

---

## 2. CONVENTIONS

### Task Format

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions
- ID format: `T###`

### Path Conventions
- **Commands**: `.opencode/command/memory/`
- **Spec folder**: `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/068-memory-index-commands`

---

## WORKING FILES LOCATION

| Directory | Purpose | Persistence |
|-----------|---------|-------------|
| `scratch/` | Debug logs, test data, draft code | Temporary (git-ignored) |
| `memory/` | Context to preserve across sessions | Permanent (git-tracked) |
| Root | Final documentation only | Permanent (git-tracked) |

---

## 3. TASK GROUPS BY PHASE

### Phase 1: Analysis & Design ✅ COMPLETE

**Purpose**: Map all operations and define command structures

- [x] T001 Create comprehensive operation mapping from current search.md
- [x] T002 Define `/memory:search` argument routing (read-only operations)
- [x] T003 Define `/memory:database` argument routing (management operations)
- [x] T004 Define MCP tool requirements for each command
- [x] T005 Design gate structure for destructive operations in database.md

**Checkpoint**: ✅ Command structures fully defined before implementation

---

### Phase 2: User Story 1 - Read-Only Search Command (Priority: P0) MVP ✅ COMPLETE

**Goal**: Refactor `/memory:search` to be purely read-only

**Independent Test**: Run all search/browse operations, verify no write options appear

**Implementation:**
- [x] T006 [US1] Create backup of original search.md in scratch/
- [x] T007 [US1] Remove Section 11 (Cleanup Mode) from search.md
- [x] T008 [US1] Remove Section 9 (Trigger Edit) from search.md
- [x] T009 [US1] Remove Section 12 (Tier Promotion Menu) from search.md
- [x] T010 [US1] Remove validation actions (v, x) from Memory Detail View
- [x] T011 [US1] Remove tier promotion action (p) from Memory Detail View
- [x] T012 [US1] Remove trigger edit action (t) from Memory Detail View
- [x] T013 [US1] Remove cleanup action (c) from Dashboard
- [x] T014 [US1] Update Gate 1 (remove cleanup gate, since no destructive ops)
- [x] T015 [US1] Update frontmatter (remove management tools from allowed-tools)
- [x] T016 [US1] Update description to emphasize read-only nature
- [x] T017 [US1] Update argument-hint to remove cleanup/tier options
- [x] T018 [US1] Add cross-reference to `/memory:database` for management operations
- [x] T019 [US1] Renumber sections after removals
- [x] T020 [US1] Update Related Commands section

**Checkpoint**: ✅ `/memory:search` is purely read-only

---

### Phase 3: User Story 2 - Database Management Command (Priority: P0) MVP ✅ COMPLETE

**Goal**: Create new `/memory:database` command with all management operations

**Independent Test**: Run all management operations, verify gates work

**Implementation:**
- [x] T021 [US2] Create `.opencode/command/memory/database.md` file
- [x] T022 [US2] Write frontmatter (description, argument-hint, allowed-tools)
- [x] T023 [US2] Write Gate 1 (Cleanup confirmation)
- [x] T024 [US2] Write Gate 2 (Delete confirmation)
- [x] T025 [US2] Write Section 1 (Purpose)
- [x] T026 [US2] Write Section 2 (Contract)
- [x] T027 [US2] Write Section 3 (Argument Routing)
- [x] T028 [US2] Write Section 4 (MCP Enforcement Matrix)
- [x] T029 [US2] Write Section 5 (Stats Dashboard Mode - no args)
- [x] T030 [US2] Write Section 6 (Scan Mode - index new files)
- [x] T031 [US2] Write Section 7 (Cleanup Mode - from original search.md)
- [x] T032 [US2] Write Section 8 (Tier Management Mode)
- [x] T033 [US2] Write Section 9 (Trigger Edit Mode - from original search.md)
- [x] T034 [US2] Write Section 10 (Validate Mode)
- [x] T035 [US2] Write Section 11 (Delete Mode)
- [x] T036 [US2] Write Section 12 (Health Check Mode)
- [x] T037 [US2] Write Section 13 (Quick Reference)
- [x] T038 [US2] Write Section 14 (Error Handling)
- [x] T039 [US2] Write Section 15 (Related Commands)
- [x] T040 [US2] Add cross-reference to `/memory:search`

**Checkpoint**: ✅ `/memory:database` has all management operations

---

### Phase 4: User Story 3 - Index New Files (Priority: P1) ✅ COMPLETE

**Goal**: Ensure scan mode works correctly in `/memory:database`

**Independent Test**: Create test file, run scan, verify indexed

**Implementation:**
- [x] T041 [US3] Implement scan mode argument parsing
- [x] T042 [US3] Implement --force flag handling
- [x] T043 [US3] Add scan progress output format
- [x] T044 [US3] Add scan completion summary

**Checkpoint**: ✅ Indexing operations documented in database.md Section 6

---

### Phase 5: User Story 4 - Health Check (Priority: P2) ✅ COMPLETE

**Goal**: Add comprehensive health check to `/memory:database`

**Independent Test**: Run health check, verify report is comprehensive

**Implementation:**
- [x] T045 [US4] Implement health mode argument parsing
- [x] T046 [US4] Define health check output format
- [x] T047 [US4] Add health metrics (count, size, orphans, last scan)

**Checkpoint**: ✅ Health check documented in database.md Section 12

---

### Phase 6: Testing & Verification

**Purpose**: Verify all operations work correctly

- [ ] T048 Test `/memory:search` dashboard mode
- [ ] T049 Test `/memory:search` semantic search mode
- [ ] T050 Test `/memory:search` direct load by ID
- [ ] T051 Test `/memory:search` load by spec folder
- [ ] T052 Test `/memory:search` load with anchor
- [ ] T053 Test `/memory:search` triggers view (read-only)
- [ ] T054 Verify NO destructive options in search.md
- [ ] T055 Test `/memory:database` stats dashboard
- [ ] T056 Test `/memory:database scan`
- [ ] T057 Test `/memory:database scan --force`
- [ ] T058 Test `/memory:database cleanup` gate
- [ ] T059 Test `/memory:database tier` mode
- [ ] T060 Test `/memory:database triggers` edit mode
- [ ] T061 Test `/memory:database validate` mode
- [ ] T062 Test `/memory:database delete` gate
- [ ] T063 Test `/memory:database health` mode
- [ ] T064 Verify cross-references work in both commands

**Checkpoint**: All tests pass

---

### Phase 7: Documentation & Cleanup

**Purpose**: Finalize documentation and clean up

- [ ] T065 Update checklist.md with verification results
- [ ] T066 Verify line counts (search <400, db <500)
- [ ] T067 Remove scratch/ backup file
- [ ] T068 Save implementation context to memory/
- [ ] T069 Mark spec folder as complete

**Checkpoint**: Implementation complete

---

## 4. VALIDATION CHECKLIST

### Code Quality
- [ ] Both command files follow markdown conventions
- [ ] All sections numbered correctly
- [ ] All cross-references valid
- [ ] No orphaned content

### Documentation
- [x] spec.md updated
- [x] plan.md updated
- [x] checklist.md updated
- [x] decision-record.md created

### Review & Sign-off
- [ ] All operations preserved
- [ ] Gates work correctly
- [ ] No breaking changes

### Cross-References
- **Specification**: See `spec.md` for requirements
- **Plan**: See `plan.md` for technical approach
- **Checklist**: See `checklist.md` for validation

---

## 5. OPERATION MAPPING REFERENCE

### Operations Moving to `/memory:database`

| Original Section | Operation | New Location in database.md |
|------------------|-----------|----------------------|
| Section 9 | Trigger Edit | Section 9 |
| Section 11 | Cleanup Mode | Section 7 |
| Section 12 | Tier Promotion | Section 8 |
| Memory Detail [v] | Validate useful | Section 10 |
| Memory Detail [x] | Validate not useful | Section 10 |
| Memory Detail [p] | Promote tier | Section 8 |
| Memory Detail [t] | Edit triggers | Section 9 |
| Dashboard [c] | Cleanup | Section 7 |
| Gate 1 | Cleanup confirmation | Gate 1 |

### New Operations in `/memory:database`

| Operation | Section | MCP Tool |
|-----------|---------|----------|
| Stats Dashboard | Section 5 | memory_stats, memory_list |
| Scan | Section 6 | memory_index_scan |
| Scan --force | Section 6 | memory_index_scan(force: true) |
| Delete | Section 11 | memory_delete |
| Health | Section 12 | memory_health |

### Operations Staying in `/memory:search`

| Operation | Section | MCP Tool |
|-----------|---------|----------|
| Dashboard | Section 6 | memory_stats, memory_list |
| Direct Load by ID | Section 5.1 | memory_list, Read |
| Load by Spec Folder | Section 5.2 | memory_search, Read |
| Load with Anchor | Section 5.3 | memory_search, Read |
| Search | Section 7 | memory_search |
| Triggers View | Section 10 | memory_list (read-only) |
| Memory Detail | Section 8 | Read (read-only view) |

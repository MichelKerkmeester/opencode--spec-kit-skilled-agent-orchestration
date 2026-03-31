---
title: "Implementation Plan: [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/068-memory-index-commands/plan]"
description: "Implementation plan for separating the unified /memory:search command into two focused commands."
trigger_phrases:
  - "implementation"
  - "plan"
  - "memory"
  - "command"
  - "separation"
  - "068"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Memory Command Separation - Technical Approach & Architecture

Implementation plan for separating the unified `/memory:search` command into two focused commands.

<!-- SPECKIT_TEMPLATE_SOURCE: plan | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: memory-system, commands, refactoring
- **Priority**: P1
- **Branch**: `070-memory-index-commands`
- **Date**: 2026-01-16
- **Spec**: [spec.md](./spec.md)

### Input
Feature specification from `.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/068-memory-index-commands/spec.md`

### Summary
Refactor the 667-line `/memory:search` command into two focused commands: a read-only search command (~350 lines) and a database management command (~400 lines). This separation follows the Single Responsibility Principle and improves safety by isolating destructive operations.

### Technical Context

- **Language/Version**: Markdown (command definition files)
- **Primary Dependencies**: OpenCode command system, Spec Kit Memory MCP
- **Storage**: N/A - pure command refactoring
- **Testing**: Manual testing via command invocation
- **Target Platform**: OpenCode CLI
- **Project Type**: single-project
- **Performance Goals**: N/A - same as existing
- **Constraints**: Must preserve all existing functionality
- **Scale/Scope**: 2 command files, ~750 total lines

---

<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

**GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.**

### Definition of Ready (DoR)
- [x] Problem statement clear; scope documented
- [x] Stakeholders identified; decisions path agreed
- [x] Constraints known; risks captured
- [x] Success criteria measurable

### Definition of Done (DoD)
- [ ] All acceptance criteria met; tests passing
- [ ] Docs updated (spec/plan/tasks/README)
- [ ] Performance/error budgets respected
- [ ] Rollback verified or not needed

### Rollback Guardrails
- **Stop Signals**: Critical functionality missing from either command
- **Recovery Procedure**: Revert to original search.md from git history

### Constitution Check (Complexity Tracking)

No violations - this refactoring actually reduces complexity.

<!-- /ANCHOR:quality-gates -->
---

## 3. PROJECT STRUCTURE

### Architecture Overview

**Command Separation Architecture:**

```
BEFORE (Unified):
┌─────────────────────────────────────────────┐
│         /memory:search (667 lines)          │
├─────────────────────────────────────────────┤
│ READ:  Dashboard, Search, Load, Triggers    │
│ WRITE: Cleanup, Tier, Triggers, Validate    │
│ GATES: Cleanup confirmation mixed with UX   │
└─────────────────────────────────────────────┘

AFTER (Separated):
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│ /memory:search (~350 lines)     │  │ /memory:database (~400 lines)         │
├─────────────────────────────────┤  ├─────────────────────────────────┤
│ READ-ONLY:                      │  │ MANAGEMENT:                     │
│ - Dashboard (stats + recent)    │  │ - Stats Dashboard               │
│ - Semantic Search               │  │ - Scan (index new files)        │
│ - Direct Load (ID/folder/anchor)│  │ - Cleanup (GATED)               │
│ - Triggers View (read-only)     │  │ - Tier Management               │
│ - Memory Detail View            │  │ - Trigger Editing               │
│                                 │  │ - Validate                      │
│ NO GATES NEEDED                 │  │ - Delete (GATED)                │
│                                 │  │ - Health Check                  │
│                                 │  │                                 │
│                                 │  │ GATES: Cleanup, Delete          │
└─────────────────────────────────┘  └─────────────────────────────────┘
          │                                     │
          └───────── Cross-references ──────────┘
```

**Key Architectural Decisions:**
- **Pattern**: Command separation (Single Responsibility Principle)
- **Data Flow**: Request-response (user invokes command → command executes → output)
- **State Management**: Stateless (each invocation is independent)

### Documentation (This Feature)

```
.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/068-memory-index-commands
  spec.md              # Feature specification
  plan.md              # This file
  tasks.md             # Task breakdown
  checklist.md         # Validation checklist
  decision-record.md   # ADR for command separation
  scratch/             # Drafts, prototypes (git-ignored)
  memory/              # Session context preservation
```

### Source Code (Repository Root)

```
.opencode/command/memory/
  search.md            # MODIFY: Remove management operations
  database.md                # CREATE: New database management command
  save.md              # UNCHANGED: Already handles context saving
  checkpoint.md        # UNCHANGED: Already handles checkpoints
```

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Design & Setup

- **Goal**: Define exact command structures and MCP tool mappings
- **Deliverables**:
  - Detailed command argument routing for both commands
  - MCP tool mapping for each mode
  - Gate definitions for destructive operations
- **Owner**: Developer
- **Duration**: 1 hour
- **Parallel Tasks**: None

### Phase 2: Core Implementation

- **Goal**: Create new database.md and refactor search.md
- **Deliverables**:
  - New `/memory:database` command file with all management operations
  - Refactored `/memory:search` with read-only operations
  - Cross-references between commands
- **Owner**: Developer
- **Duration**: 2-3 hours
- **Parallel Tasks**: 
  - [P] Write new database.md
  - [P] Refactor search.md (after database.md exists to avoid missing operations)

### Phase 3: Integration & Testing

- **Goal**: Verify both commands work correctly
- **Deliverables**:
  - Manual testing of all modes in both commands
  - Verification that no operations are missing
  - Gate testing for destructive operations
- **Owner**: Developer
- **Duration**: 1 hour
- **Parallel Tasks**: None

### Phase 4: Documentation & Cleanup

- **Goal**: Update all references and finalize
- **Deliverables**:
  - Update any AGENTS.md references if needed
  - Save implementation context to memory
  - Archive spec folder if complete
- **Owner**: Developer
- **Duration**: 30 minutes
- **Parallel Tasks**: None

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Manual Testing

Since these are command definition files (not code), testing is manual:

**`/memory:search` Test Cases:**
1. `/memory:search` → Dashboard displays stats + recent
2. `/memory:search 42` → Loads memory by ID
3. `/memory:search 007-auth` → Loads from spec folder
4. `/memory:search 42 --anchor:summary` → Loads anchor section
5. `/memory:search oauth tokens` → Semantic search works
6. `/memory:search triggers` → Shows trigger overview (read-only)
7. Verify NO cleanup/tier/delete options appear anywhere

**`/memory:database` Test Cases:**
1. `/memory:database` → Stats dashboard displays
2. `/memory:database scan` → Scans and indexes new files
3. `/memory:database scan --force` → Force re-indexes all
4. `/memory:database cleanup` → Gate blocks, shows candidates
5. `/memory:database tier 42 critical` → Changes tier
6. `/memory:database triggers 42` → Edit triggers flow
7. `/memory:database delete 42` → Gate blocks, confirms before delete
8. `/memory:database health` → Shows health report

<!-- /ANCHOR:testing -->
---

## 6. SUCCESS METRICS

### Functional Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| All operations preserved | 100% | Checklist verification |
| Read operations in search.md | All read operations | Manual verification |
| Write operations in database.md | All write operations | Manual verification |

### Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| search.md line count | <400 lines | `wc -l` |
| database.md line count | <500 lines | `wc -l` |
| No destructive ops in search | 0 | Manual review |

---

## 7. RISKS & MITIGATIONS

### Risk Matrix

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Missing operation in refactor | High | Low | Comprehensive mapping before coding | Developer |
| R-002 | User confusion about command split | Medium | Medium | Clear documentation, cross-refs | Developer |
| R-003 | Breaking existing workflows | Medium | Low | Preserve all argument patterns | Developer |

### Rollback Plan

- **Rollback Trigger**: Critical operation missing or broken
- **Rollback Procedure**:
  1. `git checkout HEAD~1 -- .opencode/command/memory/search.md`
  2. Delete `.opencode/command/memory/database.md`
  3. Verify original command works
- **Verification**: Run original command test cases

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES

### Internal Dependencies

| Dependency | Type | Owner | Status | Timeline | Impact if Blocked |
|------------|------|-------|--------|----------|-------------------|
| Original search.md | Internal | Project | Green | N/A | Source for refactor |

### External Dependencies

| Dependency | Type | Vendor | Status | Timeline | Impact if Blocked |
|------------|------|--------|--------|----------|-------------------|
| Spec Kit Memory MCP | External | MCP Server | Green | N/A | Required for operations |

<!-- /ANCHOR:dependencies -->
---

## 9. COMMUNICATION & REVIEW

### Stakeholders
- **Developer**: Primary implementer and user

### Checkpoints
- **Phase 1 Complete**: Command structures defined
- **Phase 2 Complete**: Both commands implemented
- **Phase 3 Complete**: All tests pass
- **Phase 4 Complete**: Documentation updated

---

## 10. REFERENCES

### Related Documents
- **Feature Specification**: See `spec.md` for requirements and user stories
- **Task Breakdown**: See `tasks.md` for implementation task list
- **Decision Record**: See `decision-record.md` for architectural decision

### MCP Tool Reference

**Read-Only Tools (for `/memory:search`):**
- `spec_kit_memory_memory_stats` - Get database statistics
- `spec_kit_memory_memory_list` - List memories with pagination
- `spec_kit_memory_memory_search` - Semantic search
- `spec_kit_memory_memory_match_triggers` - Match trigger phrases
- `Read` - Read memory file content

**Management Tools (for `/memory:database`):**
- `spec_kit_memory_memory_save` - Index a file
- `spec_kit_memory_memory_index_scan` - Scan workspace
- `spec_kit_memory_memory_delete` - Delete memory
- `spec_kit_memory_memory_update` - Update tier/triggers
- `spec_kit_memory_memory_validate` - Mark useful/not useful
- `spec_kit_memory_memory_health` - Health check

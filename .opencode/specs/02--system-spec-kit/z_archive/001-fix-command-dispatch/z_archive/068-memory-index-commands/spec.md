---
title: "Feature Specification: Memory Command Separation - Requirements & User Stories [068-memory-index-commands/spec]"
description: "Separate the unified /memory:search command into two focused commands: a read-only search command and a database management command."
trigger_phrases:
  - "feature"
  - "specification"
  - "memory"
  - "command"
  - "separation"
  - "spec"
  - "068"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Memory Command Separation - Requirements & User Stories

Separate the unified `/memory:search` command into two focused commands: a read-only search command and a database management command.

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

---

## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Level**: 3
- **Tags**: memory-system, commands, refactoring
- **Priority**: P1
- **Feature Branch**: `070-memory-index-commands`
- **Created**: 2026-01-16
- **Status**: In Progress
- **Input**: User request to separate search and database management operations

### Stakeholders
- Developer (primary user of memory commands)

### Problem Statement
The current `/memory:search` command (667 lines) combines two fundamentally different concerns:
1. **Read operations**: searching, browsing, loading memories
2. **Write operations**: cleanup, tier management, trigger editing, validation

This creates several issues:
- Users accidentally trigger destructive operations while searching
- The command is too long and complex to maintain
- Cognitive overload when users just want to search
- Safety gates are mixed with navigation flows

### Purpose
Split the unified memory command into two focused commands with clear single responsibilities: one for read-only search/browse operations and one for database administration/maintenance.

### Assumptions

- Users will quickly adapt to the new command structure
- The new `/memory:database` command will be discoverable via help/documentation
- Existing workflows can be migrated without breaking changes

**Assumptions Validation Checklist**:
- [x] All assumptions reviewed with stakeholders
- [x] Technical feasibility verified for each assumption
- [x] Risk assessment completed for critical assumptions
- [x] Fallback plans identified for uncertain assumptions

---

## 2. SCOPE

### In Scope
- Refactor `/memory:search` to be read-only (remove management operations)
- Create new `/memory:database` command for database management
- Add indexing operations (scan, re-index) to new command
- Migrate cleanup, tier, trigger, and validation operations to new command
- Add health check functionality to new command
- Update cross-references between commands

### Out of Scope
- Changes to `/memory:save` command - already handles context saving
- Changes to `/memory:checkpoint` command - already handles checkpoints
- Changes to underlying MCP tools - using existing APIs
- Database schema changes - pure command-level refactoring

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/memory/search.md` | Modify | Remove management operations, simplify to read-only |
| `.opencode/command/memory/database.md` | Create | New database management command |

---

## 3. USERS & STORIES

### User Story 1 - Search memories without management options (Priority: P0) MVP

As a developer, I want to search and browse my conversation memories without seeing cleanup, tier management, or other administrative options, so that I can quickly find context without cognitive overload.

**Why This Priority**: P0 because this is the core value proposition - separating read operations from write operations for cleaner UX.

**Independent Test**: Can search for memories, load by ID/folder/anchor, view dashboard without seeing any destructive operation options.

**Acceptance Scenarios**:
1. **Given** user runs `/memory:search oauth`, **When** results display, **Then** no cleanup/delete/tier options are shown
2. **Given** user runs `/memory:search 42`, **When** memory loads, **Then** only read-only actions available (back, search, related)

---

### User Story 2 - Manage memory database with dedicated command (Priority: P0) MVP

As a developer, I want a dedicated command for database management operations, so that administrative tasks are isolated and clearly gated for safety.

**Why This Priority**: P0 because destructive operations need proper isolation and safety gates.

**Independent Test**: Can run `/memory:database` and access all management operations (cleanup, tier, triggers, delete, scan, health) with proper confirmation gates.

**Acceptance Scenarios**:
1. **Given** user runs `/memory:database cleanup`, **When** candidates found, **Then** confirmation gate blocks deletion until approved
2. **Given** user runs `/memory:database scan`, **When** scan completes, **Then** shows count of indexed/skipped files

---

### User Story 3 - Index new memory files (Priority: P1)

As a developer, I want to scan and index new memory files from the command line, so that I can ensure the database is up-to-date with my file system.

**Why This Priority**: P1 because indexing is essential for database maintenance but not blocking.

**Independent Test**: Can run `/memory:database scan` to find and index new files, verify with stats.

**Acceptance Scenarios**:
1. **Given** new memory file created manually, **When** user runs `/memory:database scan`, **Then** file is indexed
2. **Given** user runs `/memory:database scan --force`, **When** scan completes, **Then** all files re-indexed regardless of hash

---

### User Story 4 - Check database health (Priority: P2)

As a developer, I want to check the health of my memory database, so that I can identify orphaned files, consistency issues, or performance problems.

**Why This Priority**: P2 because health checks are nice-to-have for troubleshooting.

**Independent Test**: Can run `/memory:database health` and see comprehensive health report.

**Acceptance Scenarios**:
1. **Given** user runs `/memory:database health`, **When** check completes, **Then** shows memory count, disk usage, orphan count, last scan time

---

## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001:** `/memory:search` MUST be read-only with no write operations
- **REQ-FUNC-002:** `/memory:search` MUST support dashboard, search, direct load, anchor load, and triggers view modes
- **REQ-FUNC-003:** `/memory:database` MUST handle all database management operations (cleanup, tier, triggers, delete, scan, health)
- **REQ-FUNC-004:** `/memory:database` MUST gate destructive operations (cleanup, delete) with confirmation prompts
- **REQ-FUNC-005:** `/memory:database scan` MUST support `--force` flag for re-indexing all files
- **REQ-FUNC-006:** `/memory:database health` MUST report memory count, database size, and last scan time
- **REQ-FUNC-007:** Both commands MUST reference each other in their documentation
- **REQ-FUNC-008:** `/memory:database` MUST create automatic checkpoint before bulk cleanup operations

### Traceability Mapping

| User Story | Related Requirements | Notes |
|------------|---------------------|-------|
| Story 1 - Search without management | REQ-FUNC-001, REQ-FUNC-002 | Core search functionality |
| Story 2 - Dedicated management command | REQ-FUNC-003, REQ-FUNC-004, REQ-FUNC-008 | Database management |
| Story 3 - Index new files | REQ-FUNC-005 | Indexing operations |
| Story 4 - Health check | REQ-FUNC-006 | Database health |

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Search operations should complete in <500ms for typical queries
- **NFR-P02**: Scan operations should process >100 files per second

### Security
- **NFR-S01**: Destructive operations MUST require explicit confirmation
- **NFR-S02**: Bulk delete MUST create checkpoint before execution

### Reliability
- **NFR-R01**: Failed scans should not corrupt existing index
- **NFR-R02**: Cleanup should be atomic (all-or-nothing per confirmation)

### Usability
- **NFR-U01**: Command help must clearly explain purpose and options
- **NFR-U02**: Error messages must suggest correct command if user uses wrong one

---

## 6. EDGE CASES

### Data Boundaries
- What happens when database is empty? → Dashboard shows "No memories indexed" with scan suggestion
- What happens when scan finds 0 new files? → Report "Already up to date"

### Error Scenarios
- What happens when memory file is corrupted? → Skip with error log, continue scanning
- What happens when delete target doesn't exist? → Report "Memory #ID not found"

### State Transitions
- What happens when scan is interrupted? → Next scan picks up where it left off (hash-based)
- What happens when cleanup is cancelled mid-review? → No changes made

---

## 7. SUCCESS CRITERIA

### Measurable Outcomes

- **SC-001**: `/memory:search` reduced from 667 lines to <400 lines
- **SC-002**: `/memory:database` contains all management operations in <500 lines
- **SC-003**: Zero destructive operations reachable from search command
- **SC-004**: All gates from old command preserved in new db command

### KPI Targets

| Category | Metric | Target | Measurement Method |
|----------|--------|--------|-------------------|
| Adoption | User adoption of new commands | 100% | No fallback to old behavior |
| Quality | P0/P1 defect rate | 0 within 7 days | Issue tracking |
| Usability | Users finding correct command | >90% first try | Manual observation |

---

## 8. DEPENDENCIES & RISKS

### Dependencies

| Dependency | Type | Owner | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| Spec Kit Memory MCP | External | MCP Server | Green | Cannot implement without MCP tools |

### Risk Assessment

| Risk ID | Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-------------|--------|------------|---------------------|-------|
| R-001 | Users confused by command split | Low | Medium | Clear documentation, cross-references | Developer |
| R-002 | Missing operation in refactor | Medium | Low | Comprehensive checklist validation | Developer |

### Rollback Plan

- **Rollback Trigger**: Critical functionality missing or broken
- **Rollback Procedure**: Revert to original search.md from git
- **Data Migration Reversal**: N/A - no data changes

---

## 9. OUT OF SCOPE

**Explicit Exclusions**:

- `/memory:save` changes - already handles context saving, separate concern
- `/memory:checkpoint` changes - already handles checkpoints, separate concern
- MCP tool changes - using existing APIs as-is
- New MCP tools - not creating new server-side functionality

---

## 10. OPEN QUESTIONS

- None - requirements are clear

---

## 11. APPENDIX

### Command Structure Diagrams

**Current State (Unified):**
```
/memory:search
├── READ: Dashboard, Search, Load, Triggers View
└── WRITE: Cleanup, Tier, Triggers Edit, Validate, Delete
```

**Target State (Separated):**
```
/memory:search (READ-ONLY)
├── Dashboard (stats + recent)
├── Search (semantic query)
├── Direct Load (by ID)
├── Folder Load (by spec folder)
├── Anchor Load (specific section)
└── Triggers View (read-only)

/memory:database (MANAGEMENT)
├── Stats Dashboard
├── Scan (index new files)
├── Cleanup (GATED)
├── Tier Management
├── Trigger Editing
├── Validate
├── Delete (GATED)
└── Health Check
```

---

## 12. WORKING FILES

### File Organization During Development

**Temporary/exploratory files MUST be placed in:**
- `scratch/` - For drafts, prototypes, debug logs, test queries (git-ignored)

**Permanent documentation belongs in:**
- Root of spec folder - spec.md, plan.md, tasks.md, etc.
- `memory/` - Session context and conversation history

---

## 13. CHANGELOG

### Version History

#### v1.0 (2026-01-16)
**Initial specification**

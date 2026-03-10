---
title: "Tasks: maintenance [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "maintenance"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: maintenance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm maintenance feature inventory for F-01 and F-02 (`feature_catalog/04--maintenance/`)
- [ ] T002 Gather source evidence references for findings (`mcp_server/handlers/memory-index.ts`, `mcp_server/lib/storage/incremental-index.ts`, `mcp_server/startup-checks.ts`)
- [ ] T003 [P] Align maintenance spec/plan/checklist baseline before remediation (`004-maintenance/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Reconcile incremental scan hash accounting with mtime-only reality [Priority: P0] (`mcp_server/handlers/memory-index.ts`, `mcp_server/lib/storage/incremental-index.ts`)
- [ ] T005 Add direct startup guard unit tests for marker and SQLite warning branches [Priority: P2] (`mcp_server/startup-checks.ts`, `mcp_server/tests/`)
- [ ] T006 Update maintenance test inventory and remove stale retry test reference [Priority: P2] (`feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md`)
- [ ] T007 Confirm no unresolved P1 behavior-mismatch work remains [Priority: P1] (`004-maintenance/tasks.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Test happy path manually for EX-021 and EX-022 mapping
- [ ] T009 Test edge cases for hash-accounting semantics and SQLite version extraction failures
- [ ] T010 Update documentation after verification (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

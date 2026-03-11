---
title: "Tasks: discovery [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "discovery"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: discovery

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

- [x] T001 Confirm Discovery feature inventory and source references (`feature_catalog/03--discovery/*.md`)
- [x] T002 Validate current handler/test file existence for mapped features (`mcp_server/handlers/*`, `mcp_server/tests/*`)
- [x] T003 [P] Prepare implementation branch context for Discovery follow-up (`.opencode/specs/.../003-discovery/*.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P1] Fix inaccurate folder total summary count in `memory_stats` (`mcp_server/handlers/memory-crud-stats.ts`)
- [x] T005 [P1] Include `requestId` in all `memory_health` error responses (`mcp_server/handlers/memory-crud-health.ts`)
- [x] T006 [P2] Add `memory_list` edge-case handler tests and resolve stale test reference (`mcp_server/handlers/memory-crud-list.ts`, `mcp_server/tests/*`)
- [x] T007 [P1] Add tests for stats scoring fallback, limit truncation, and health diagnostic edge paths (`mcp_server/tests/*.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Validate EX-018/EX-019/EX-020 playbook mapping against implemented behavior (`feature_catalog/03--discovery/*.md`)
- [x] T009 Verify Discovery edge-case and error-path test coverage is complete (`mcp_server/tests/*.vitest.ts`)
- [x] T010 Update Discovery spec artifacts to reflect final status and evidence (`.opencode/specs/.../003-discovery/*.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

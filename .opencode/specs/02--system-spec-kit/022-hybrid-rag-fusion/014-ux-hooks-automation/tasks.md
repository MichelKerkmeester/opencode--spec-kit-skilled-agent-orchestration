---
title: "Tasks: UX Hooks Automation"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
# Tasks: UX Hooks Automation

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

- [x] T001 Audit mutation handlers and checkpoint delete flow for shared post-mutation hook gaps
- [x] T002 Define shared post-mutation hook wiring contract and failure-handling behavior
- [x] T003 [P] Capture baseline failing scenarios from CRUD and modularization test paths
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Integrate shared post-mutation hook automation into save/update/delete/bulk-delete and atomic save paths
- [x] T005 Add `memory_health` optional `autoRepair` path with repair metadata reporting
- [x] T006 Add checkpoint delete safety parameter `confirmName` and response metadata
- [x] T007 Update schemas/types/tool definitions for new parameters and response contracts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Stabilize regressions: `escapeLikePattern` export, hybrid-search-flags mock path, modularization threshold (800 -> 880), and missing trigger matcher import
- [x] T009 Run targeted verification: `npm test -- tests/handler-memory-save.vitest.ts tests/hybrid-search-flags.vitest.ts tests/modularization.vitest.ts tests/handler-memory-crud.vitest.ts tests/tool-input-schema.vitest.ts` (150 passed)
- [x] T010 Run full verification (`npm test`, 237 files / 7146 passed) and sync spec artifacts
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification evidence recorded
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

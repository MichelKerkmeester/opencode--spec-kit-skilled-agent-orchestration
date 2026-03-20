---
title: "Tasks: Research Remediation Merged Wave 1 and Wave 2 [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "research remediation wave 2"
  - "018 research remediation"
importance_tier: "high"
contextType: "implementation"
---
# Tasks: Research Remediation Merged Wave 1 and Wave 2

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Preserve the Wave 1 baseline inside the merged remediation phase
- [x] T002 Convert the Phase 1B deep-research findings into a bounded Wave 2 fix set
- [x] T003 Define compile and targeted test lanes as the shared gate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fix hybrid-enrichment mutation safety and git string fallthrough in `scripts/core/workflow.ts`
- [x] T005 Preserve nested enrichment blocks and validate constrained fields in `scripts/utils/input-normalizer.ts`
- [x] T006 Reconcile status and completion percent in `scripts/extractors/collect-session-data.ts`
- [x] T007 Add Phase 1B JSON-mode coverage in `scripts/tests/runtime-memory-inputs.vitest.ts`
- [x] T008 Add enrichment-safety coverage in `scripts/tests/task-enrichment.vitest.ts`
- [x] T009 Update the successor phase docs to capture both Wave 1 and Wave 2 outcomes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `tsc --noEmit`
- [x] T011 Run `npm run build`
- [x] T012 Run the targeted Vitest lanes for the changed Phase 1B behavior
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

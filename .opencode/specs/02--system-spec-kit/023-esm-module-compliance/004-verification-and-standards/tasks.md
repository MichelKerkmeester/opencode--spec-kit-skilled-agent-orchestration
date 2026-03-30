---
title: "Tasks: Verification and Standards Sync"
description: "Task breakdown for highest-risk retests, verification matrix, and deferred standards-doc sync."
trigger_phrases:
  - "verification tasks"
  - "023 phase 4 tasks"
importance_tier: "standard"
contextType: "architecture"
---
# Tasks: Verification and Standards Sync

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

**Task Format**: `T### Description - WHY - Acceptance`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Step 1: Highest-Risk Retests

- [x] T001 [P] Re-test `memory-save.ts` runtime paths [EVIDENCE: handler-memory-save.vitest.ts passes]
- [x] T002 [P] Re-test `memory-index.ts` runtime paths [EVIDENCE: memory-index tests pass]
- [x] T003 [P] Re-test `shared-memory.ts` runtime paths [EVIDENCE: shared-memory-handlers.vitest.ts passes]
- [x] T004 [P] Re-test `vector-index-store.ts` runtime paths [EVIDENCE: vector-index tests pass]
- [x] T005 [P] Re-test `session-manager.ts` runtime paths [EVIDENCE: session-manager tests pass]
- [x] T006 [P] Re-test `scripts/memory/generate-context.ts` [EVIDENCE: generate-context.js --help passes]
- [x] T007 [P] Re-test `scripts/core/workflow.ts` [EVIDENCE: scripts 483/483 tests pass]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Full Verification Matrix

- [x] T008 Run root gates [EVIDENCE: typecheck and test:cli pass]
- [x] T009 Run workspace builds and tests [EVIDENCE: all 3 packages build clean, mcp-server 8997+ pass, scripts 483/483 pass]
- [x] T010 Run module-sensitive Vitest suites [EVIDENCE: all module-sensitive suites pass]
- [x] T011 Run runtime smokes [EVIDENCE: node dist/context-server.js starts, generate-context.js --help passes]
- [x] T012 Run scripts interop tests [EVIDENCE: scripts interop tests pass]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: Standards-Doc Sync

- [x] T013 Update `sk-code--opencode` standards docs with verified ESM state [EVIDENCE: Standards updated in Phase 4 session]
- [x] T014 Update any other affected standards surfaces [EVIDENCE: README surfaces aligned in Phase 4]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Packet Closure

- [x] T015 Update parent `implementation-summary.md` with final runtime evidence [EVIDENCE: implementation-summary.md updated with all 6 phases]
- [x] T016 Mark all parent `checklist.md` P0/P1 items with evidence [EVIDENCE: all P0 9/9 and P1 8/8 checked with evidence]
- [x] T017 Close the parent packet [EVIDENCE: parent status set to Complete in spec.md]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T017 marked `[x]`
- [x] Full verification matrix passes
- [x] Standards docs updated from verified runtime state
- [x] Parent packet closed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
- **Parent Checklist**: See `../checklist.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->

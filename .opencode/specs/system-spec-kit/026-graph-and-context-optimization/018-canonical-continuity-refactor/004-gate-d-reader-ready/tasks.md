---
title: "Tasks: Gate D — Reader Ready"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gate d"
  - "reader ready"
  - "tasks"
  - "resume ladder"
  - "reader handlers"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Gate D — Reader Ready

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] T001 Confirm Gate C is closed, dual-write shadow is stable, and D0 can start in parallel.
- [ ] T002 Decide `resumeLadder` placement and lock the shared recovery contract (`session-resume.ts` or `mcp_server/lib/resume/resume-ladder.ts`).
- [ ] T003 Retarget canonical discovery and trigger-source assumptions before user-facing resume changes (`memory-index-discovery.ts`, `memory-triggers.ts`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Restructure `memory-search.ts` to query `spec_doc` and `continuity`, with `archived=1` fallback only.
- [ ] T005 Restructure `memory-context.ts` and retarget `resume` mode to the new ladder.
- [ ] T006 Rewrite `session-resume.ts` around the 4-level ladder with no SQL on the happy path.
- [ ] T007 [P] Restructure `session-bootstrap.ts` next-action messaging to follow the new resume contract.
- [ ] T008 [P] Restructure `memory-index-discovery.ts` to promote spec docs and demote `memory/` content to archive-only fallback.
- [ ] T009 [P] Update `memory-triggers.ts` to load `trigger_phrases` from canonical spec-doc frontmatter plus continuity metadata.
- [ ] T010 Wire archived filtering, source telemetry, and fallback reporting so D0 can measure `archived_hit_rate` accurately.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Implement or align the 10 resume tests and 25 integration scenarios named in iteration 029.
- [ ] T012 Run the 13 merge-blocking regression scenarios from iteration 025.
- [ ] T013 Run perf benchmarks and verify `resume <500ms`, `search <300ms`, `trigger <10ms` p95 targets from iteration 027.
- [ ] T014 Start the overlapping D0 2-week archived observation window and confirm short-window `archived_hit_rate <15%`.
- [ ] T015 Sync `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` with the final evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Gate D tasks are marked `[x]`.
- [ ] No `[B]` tasks remain for the six reader surfaces or their test lane.
- [ ] Reader-ready evidence shows canonical doc-first behavior, green regressions, green fallback tests, and D0 observation started.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Grounding**: [`../resource-map.md`](../resource-map.md) section 4, [`../scratch/resource-map/02-handlers.md`](../scratch/resource-map/02-handlers.md), and iterations 013, 017, 018, 025, 027, 029, 036, 039
<!-- /ANCHOR:cross-refs -->

---

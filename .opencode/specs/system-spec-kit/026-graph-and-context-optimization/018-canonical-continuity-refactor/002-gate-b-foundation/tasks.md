---
title: "Gate B — Foundation"
feature: phase-018-gate-b-foundation
level: 3
status: planned
parent: 018-canonical-continuity-refactor
gate: B
description: "Ordered execution list for the Gate B foundation lane: rehearsal, production schema and archive cutover, then ranking and metric validation."
trigger_phrases:
  - "gate b tasks"
  - "foundation tasks"
  - "archive flip"
  - "causal edges migration"
  - "phase 018"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Gate B — Foundation

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after its prerequisite gate is clear |
| `[B]` | Blocked by failed rehearsal, failed rollback, or unresolved scope drift |

**Task Format**: `T### [P?] Description (file path or surface)`

Task ordering follows `../resource-map.md` Section 4 and iteration 028: rehearse first, then production cutover, then ranking and metric proof.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Freeze the approved Gate B schema scope from `../resource-map.md` F-1/F-2, `../scratch/resource-map/01-schema.md`, and the critical-file list so no duplicate `is_archived` work slips in.
- [ ] T002 Create the immutable production-copy snapshot and the `fork-A-pre` / `fork-B-post` rehearsal copies.
- [ ] T003 Run the iteration 037 dry-run pipeline on `fork-B-post` and capture JSON evidence.
- [ ] T004 Rerun the same migration on `fork-B-post` and verify the operator-level no-op requirement.
- [ ] T005 Rehearse the hard rollback path on `fork-B-post` and compare logical baseline equivalence against `fork-A-pre`.
- [ ] T006 [P] Hand the exact DDL, expected row counts, and replay rules to tests before the production window is approved.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Apply the approved `causal_edges` anchor-column migration in `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`.
- [ ] T008 Thread `source_anchor` and `target_anchor` through `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`.
- [ ] T009 Thread the new fields through `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`.
- [ ] T010 Thread the new fields through `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`.
- [ ] T011 Verify `.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts` or document the explicit exclusion if no change is required.
- [ ] T012 Write and stage `.opencode/skill/system-spec-kit/scripts/memory/archive-flip-018.sh`.
- [ ] T013 Execute the production archive flip and verify that exactly 155 rows now have `is_archived=1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Update archived-row ranking in `.opencode/skill/system-spec-kit/mcp_server/lib/search/stage2-fusion.ts` or the equivalent fusion surface so archived rows score at `x0.3`.
- [ ] T015 Validate sample searches and confirm fresh spec-doc results outrank archived peers when relevance is comparable.
- [ ] T016 Expose `archived_hit_rate` in the `memory_stats` reporting surface using the presented-slot definition from iterations 027 and 036.
- [ ] T017 Verify 2-hop causal BFS still works on mixed pre/post migration edges.
- [ ] T018 Reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so the packet tells one consistent Gate B story.
- [ ] T019 Record any unresolved scope conflict or schema ambiguity as a named blocker instead of silently carrying it into Gate C.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` REQ-001 through REQ-008 are complete.
- [ ] No `[B]` task remains on rehearsal evidence, hard rollback, schema cutover, archive flip, ranking proof, or metric visibility.
- [ ] The Gate B exit criteria from `../implementation-design.md`, iteration 020, and iteration 028 are all satisfied.
- [ ] Any broader tuple-column work from iteration 035 is either explicitly deferred or explicitly approved, rather than silently mixed into this gate.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` for corrected schema scope, risks, and acceptance criteria.
- **Plan**: See `plan.md` for sequencing, handoffs, rollback logic, and the two-week pacing model.
- **Verification**: See `checklist.md` for the Gate B exit-gate checklist and sign-off criteria.
- **Planned closeout narrative**: See `implementation-summary.md` for the future post-implementation summary shape.
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

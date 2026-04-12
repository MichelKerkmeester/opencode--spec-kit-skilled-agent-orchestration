---
title: "Gate B — Foundation"
feature: phase-018-gate-b-foundation
level: 3
status: complete
closed_by_commit: TBD
parent: 006-canonical-continuity-refactor
gate: B
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation"
    last_updated_at: "2026-04-11T20:55:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded Gate B archived-tier cleanup follow-through"
    next_safe_action: "Have orchestrator commit the validated Gate B cleanup"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/002-gate-b-foundation/tasks.md"]
description: "Ordered execution list for the Gate B foundation lane: rehearsal, production schema and archive cutover, then ranking and metric validation."
trigger_phrases: ["gate b tasks", "foundation tasks", "archive flip", "causal edges migration", "phase 018"]
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
| `pending` | Pending marker (not used in this closed packet) |
| `[x]` | Completed |
| `[P]` | Parallelizable after its prerequisite gate is clear |
| `[B]` | Historical blocked marker retained for lineage only |

**Task Format**: `T### [P?] Description (file path or surface)`

Task ordering follows `../resource-map.md` Section 4 and iteration 028: rehearse first, then production cutover, then ranking and metric proof.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the approved Gate B schema scope from `../resource-map.md` F-1/F-2, `../scratch/resource-map/01-schema.md`, and the critical-file list so no duplicate `is_archived` work slips in.
- [x] T002 Create the immutable production-copy snapshot and the `fork-A-pre` / `fork-B-post` rehearsal copies.
- [x] T003 Run the iteration 037 dry-run pipeline on `fork-B-post` and capture the corrected Gate B evidence package.
- [x] T004 Rerun the same migration on `fork-B-post` and verify the operator-level no-op requirement. [Evidence: `Rehearsal rerun changes | 0` in `implementation-summary.md`]
- [x] T005 Rehearse the hard rollback path on `fork-B-post` and compare logical baseline equivalence against `fork-A-pre`. [Evidence: `Rollback result | Returned to baseline counts` in `implementation-summary.md`]
- [x] T006 [P] Hand the exact DDL, expected row counts, and replay rules to tests before the production window is approved. [Evidence: 2026-04-12 Gate B suite `7` files / `223` tests passed]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Apply the approved `causal_edges` anchor-column migration in `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`. [Evidence: `source_anchor` / `target_anchor` plus both indexes remain in tree]
- [x] T008 Thread `source_anchor` and `target_anchor` through `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`.
- [x] T009 Thread the new fields through `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`.
- [x] T010 Thread the new fields through `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts`.
- [x] T011 Verify `.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts` or document the explicit exclusion if no change is required. [Evidence: `schema-downgrade.ts` keeps deprecated `is_archived` compatibility comments and no active archived-tier logic]
- [x] T012 N/A — a standalone `.opencode/skill/system-spec-kit/scripts/memory/archive-flip-018.sh` helper is not part of the final contract. [Reason: canonical migration ownership stays inline in `vector-index-schema.ts` and the cleanup pass did not retain a standalone script]
- [x] T013 Execute the production archive flip and verify that the rebaselined `183` legacy memory-path rows, plus the `1` baseline archived non-memory row, define the final archived state. [Evidence: `implementation-summary.md` production tables]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 N/A — archived-tier ranking (`x0.3`) was removed by the Gate B cleanup pass under the Phase 018 no-observation directive. [Evidence: no `x0.3`, `0.3`, or `is_archived` references remain in `stage2-fusion.ts`]
- [x] T015 N/A — the active runtime no longer demotes archived peers as a separate scoring class. [Evidence: `tests/stage2-fusion.vitest.ts` and `tests/search-archival.vitest.ts` passed against the compatibility-only contract]
- [x] T016 N/A — `archived_hit_rate` was removed from the active `memory_stats` reporting surface by Gate B cleanup. [Evidence: no `archived_hit_rate` references remain in `memory-crud-stats.ts`]
- [x] T017 Verify 2-hop causal BFS still works on mixed pre/post migration edges. [Evidence: `tests/causal-edges.vitest.ts` passed on 2026-04-12; `implementation-summary.md` records live sample path `1 -> 10 -> 11`]
- [x] T018 Reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so the packet tells one consistent Gate B story.
- [x] T019 Record any unresolved scope conflict or schema ambiguity as a named blocker instead of silently carrying it into Gate C. [Evidence: no unresolved blocker remains; the cleanup contract is now explicit]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` REQ-001 through REQ-008 are complete under the post-cleanup Gate B contract.
- [x] No active blocker remains on rehearsal evidence, hard rollback, schema cutover, archive flip, or anchor-aware traversal.
- [x] The Gate B exit criteria from `../implementation-design.md`, iteration 020, and iteration 028 are all satisfied.
- [x] Any broader tuple-column work from iteration 035 remains outside this gate and is not silently mixed into the final contract.
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

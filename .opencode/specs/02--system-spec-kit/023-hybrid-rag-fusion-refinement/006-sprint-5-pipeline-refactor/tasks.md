---
title: "Tasks: Sprint 5 — Pipeline Refactor"
description: "Task breakdown for 4-stage pipeline refactor, spec folder pre-filter, query expansion, and spec-kit retrieval metadata."
trigger_phrases:
  - "sprint 5 tasks"
  - "pipeline refactor tasks"
  - "R6 tasks"
importance_tier: "normal"
contextType: "implementation" # SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
---
# Tasks: Sprint 5 — Pipeline Refactor

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

**Task Format**: `T### [P?] Description (file path) [effort] — requirement`

**Dependency Format**: `{T###}` = depends on task T###
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-a -->
## Phase A: R6 Pipeline Refactor

- [x] T001 Create checkpoint: `memory_checkpoint_create("pre-pipeline-refactor")` [0h]
- [x] T002 Implement 4-stage pipeline refactor — Stage 1 (Candidate Gen), Stage 2 (Fusion + Signal Integration), Stage 3 (Rerank + Aggregate), Stage 4 (Filter + Annotate — NO score changes), behind `SPECKIT_PIPELINE_V2` flag [40-55h] {T001} — R6

> **F9 — REQUIRED: Decompose T002 (R6) into 5-8 subtasks** (R6 is a 40-55h single task; decomposition reduces integration risk and enables incremental verification):
>
> - **T002a** [5-8h]: Stage architecture definition — define TypeScript interfaces for each stage's input/output types; enforce Stage 4 immutability via TypeScript read-only type guards (compile-time) with runtime assertion as defense-in-depth (OQ-S5-001 CLOSED)
> - **T002b** [6-9h]: Stage 1 implementation — Candidate generation; migrate 5-channel parallel execution into Stage 1 boundary; preserve existing channel behavior exactly
> - **T002c** [8-12h]: Stage 2 implementation — Fusion + Signal Integration; consolidate all scoring signals (RRF/RSF, causal boost, co-activation, composite, intent weights) into single application point; verify G2 cannot recur
> - **T002d** [6-9h]: Stage 3 implementation — Rerank + Aggregate; migrate cross-encoder, MMR, MPAB into Stage 3; MPAB must remain after RRF (preserve Sprint 4 pipeline position)
> - **T002e** [5-8h]: Stage 4 implementation — Filter + Annotate; migrate state filter + evidence-gap/metadata attribution into Stage 4 and keep session dedup + constitutional injection at post-cache handler boundary; add Stage 4 invariant guard (assert no score mutation)
> - **T002f** [5-8h]: Integration + backward compatibility; wire all 4 stages behind `SPECKIT_PIPELINE_V2` flag; old pipeline remains when flag is OFF
> - **T002g** [3-5h]: Feature flag interaction testing — verify all 10+ accumulated flags (Sprint 0-5) work correctly under PIPELINE_V2; flags: SPECKIT_COMPLEXITY_ROUTER, RSF_FUSION, CHANNEL_MIN_REP, DOCSCORE_AGGREGATION, LEARN_FROM_SELECTION, SAVE_QUALITY_GATE, RECONSOLIDATION, PIPELINE_V2, EMBEDDING_EXPANSION + any from prior sprints
>   **Flag interaction matrix (UT-7 R5)**: Flags that interact with PIPELINE_V2 (scoring/pipeline flags): RSF_FUSION, CHANNEL_MIN_REP, DOCSCORE_AGGREGATION, LEARN_FROM_SELECTION. Flags independent of PIPELINE_V2 (context/session flags): SPECKIT_COMPLEXITY_ROUTER, SAVE_QUALITY_GATE, RECONSOLIDATION, EMBEDDING_EXPANSION. Test strategy: pairwise coverage of the 4 interacting flags (6 pairs × 2 states = 12 test configurations) + 1 all-flags-on run. Document coverage matrix as CHK-075 evidence.
> - **T002h** [2-4h]: Dark-run verification — 0 ordering differences vs full eval corpus; this gate MUST pass before Phase B begins

- [x] T003 Verify R6 dark-run: 0 ordering differences on full eval corpus [included] {T002}
- [x] T004 Verify all 158+ tests pass with `SPECKIT_PIPELINE_V2` enabled [included] {T002}
- [x] T004b Record p95 simple query latency baseline on eval corpus before R12 implementation [1-2h] {T004} — R12 baseline (UT-7 R3)
<!-- /ANCHOR:phase-a -->

---

<!-- ANCHOR:phase-b -->
## Phase B: Search + Spec-Kit (after Phase A passes)

- [x] T005 [P] Implement spec folder pre-filter [5-8h] {T004} — R9
- [x] T006 [P] Implement query expansion with R15 mutual exclusion, behind `SPECKIT_EMBEDDING_EXPANSION` flag [10-15h] {T004} — R12
- [x] T007 [P] Implement template anchor optimization [5-8h] {T004} — S2
- [x] T008 [P] Implement validation signals as retrieval metadata [4-6h] {T004} — S3
- [x] T009a [P] Add memory auto-surface hooks at tool dispatch and session compaction lifecycle points in `hooks/memory-surface.ts` — per-point token budget 4000 max; config/logic change in Spec-Kit integration layer [4-6h] {T004} — TM-05 (REQ-S5-006)
<!-- /ANCHOR:phase-b -->

---

<!-- ANCHOR:pageindex -->
## PageIndex Tasks

- [x] T011 Implement PI-B1 tree thinning for spec folder consolidation — extend generate-context.js with bottom-up merge logic: files < 200 tokens merge summary into parent, files < 500 tokens use content as summary; memory thresholds: 300 tokens (thinning), 100 tokens (text is summary); operates pre-pipeline before Stage 1 candidate generation [10-14h] — PI-B1
  - Thinning runs in context loading step (before pipeline, does not affect stage boundaries)
  - Verify no content loss during merge — parent absorbs child summary faithfully
  - Verify R9 pre-filter interaction: thinning does not alter folder identity or pre-filter behavior
- [x] T013 Implement PI-A4 constitutional memory as retrieval directives — add `retrieval_directive` metadata field to constitutional-tier memories; format as explicit instruction prefixes ("Always surface when:", "Prioritize when:") for LLM consumption; parse existing constitutional memory content to identify rule patterns [8-12h] — PI-A4 (deferred from Sprint 4 per REC-07)
  - Acceptance: `retrieval_directive` field present on all constitutional-tier memories; directive prefix pattern validated
  - Risk: Low-Medium — content transformation only; no scoring logic changes
- [x] T012 Implement PI-B2 progressive validation for spec documents — extend validate.sh to 4-level pipeline: Detect (identify violations) → Auto-fix (missing dates, heading levels, whitespace normalization, with before/after diff log) → Suggest (guided options for non-automatable issues) → Report (structured output, exit 0/1/2 compatible); include dry-run mode [16-24h] — PI-B2
  - All auto-fixes must log before/after diff (primary mitigation for silent corruption)
  - Dry-run mode: show proposed auto-fixes without applying them
  - Exit code compatibility: exit 0 = pass, exit 1 = warnings, exit 2 = errors (unchanged)
<!-- /ANCHOR:pageindex -->

---

<!-- ANCHOR:phase-c -->
## Phase C: Verification

- [x] T-FS5 Feature flag sunset review at Sprint 5 exit — review all active feature flags; permanently enable flags with positive metrics, remove flags with negative metrics, extend measurement window (max 14 days) for inconclusive flags; ensure ≤6 simultaneous active flags [0.5-1h] {T009a} — NFR-O01/O02/O03
- [x] T010 [GATE] Sprint 5 exit gate verification [0h] {T002, T003, T004, T005, T006, T007, T008, T009a, T-FS5}
<!-- /ANCHOR:phase-c -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] R6: 0 ordering differences verified
- [x] Full regression executed with PIPELINE_V2; no new Sprint 5 failures
- [x] Stage 4 invariant verified: no score modifications
- [x] R9 cross-folder identical results verified
- [x] R12+R15 mutual exclusion enforced
- [x] R12 no simple query latency degradation
- [x] Intent weights applied ONCE in Stage 2 (G2 prevention)
- [x] TM-05 auto-surface fires at tool dispatch and session compaction; 4000-token budget enforced
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:task-id-mapping -->
## Task ID Mapping (Child → Parent)

Child tasks use local IDs; parent `../tasks.md` uses global IDs. Cross-reference table:

| Child Task ID | Parent Task ID | Description |
|---------------|----------------|-------------|
| T001 | T032 | Checkpoint creation (pre-pipeline-refactor) |
| T002 | T033 | 4-stage pipeline refactor (R6) |
| T003 | T034 | Verify R6 dark-run |
| T004 | T035 | Verify 158+ tests pass with PIPELINE_V2 |
| T004b | *(not in parent)* | p95 latency baseline for R12 |
| T005 | T036 | Spec folder pre-filter (R9) |
| T006 | T037 | Query expansion (R12) |
| T007 | T038 | Template anchor optimization (S2) |
| T008 | T039 | Validation signals as retrieval metadata (S3) |
| T009a | T060 | Dual-scope injection (TM-05) |
| T011 | PI-B1 | Tree thinning for spec folder consolidation (PI-B1) |
| T012 | PI-B2 | Progressive validation for spec documents (PI-B2) |
| T013 | PI-A4 | Constitutional memory as retrieval directives (PI-A4) |
| T-FS5 | T-FS5 | Feature flag sunset review (Sprint 5 exit) |
| T010 | T040 | Sprint 5 exit gate verification |
<!-- /ANCHOR:task-id-mapping -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Parent Plan**: See `../plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 6 of 8
- Sprint 5: Pipeline Refactor
- 15 tasks across 3 phases (A, B, C) + PageIndex
-->

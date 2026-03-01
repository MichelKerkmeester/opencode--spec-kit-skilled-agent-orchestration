# Ultra-Think Review: Sprint 4 — Feedback Loop

**Spec**: 140-hybrid-rag-fusion-refinement / 005-sprint-4-feedback-loop
**Review Type**: UT-6 Multi-Lens Analysis
**Date**: 2026-02-27
**Reviewer**: Ultra-Think Agent (UT-6)
**Status**: Draft

---

## Executive Summary

Sprint 4 (Feedback Loop) is the most architecturally significant sprint in the 140 series. It introduces three interdependent capabilities — MPAB chunk aggregation (R1), learned relevance feedback with FTS5 contamination risk (R11), and A/B evaluation infrastructure (R13-S2) — alongside two save-pipeline mutations (TM-04 quality gate, TM-06 reconsolidation). The recommended S4a/S4b split is sound and creates genuine optionality. However, three structural problems require resolution before implementation begins: the effort arithmetic across S4a and S4b is internally inconsistent, a threshold gap between TM-04 (>0.92 reject) and TM-06 (>=0.88 merge) creates an unverified zone that no checklist item covers, and S4b concentrates two independently dangerous mutations (CRITICAL R11 + TM-06) with compounding rollback complexity. The 28-day calendar dependency (F10) is correctly identified but under-planned. PI-A4 (constitutional memory as search directives) is better suited to Sprint 5. Overall, the spec's risk architecture is defensible; the execution planning requires sharpening before S4b begins.

---

## Multi-Lens Analysis

### Analytical Lens

**Effort Arithmetic Inconsistency**

The plan.md effort table states a total of 51-76h, summed as:

| Phase | Stated |
|-------|--------|
| Phase 1: R1 MPAB | 8-12h |
| Phase 2: R11 Learned Feedback | 16-24h |
| Phase 3: R13-S2 Shadow Scoring | 15-20h |
| Phase 4: TM-04 Quality Gate | 6-10h |
| Phase 5: TM-06 Reconsolidation | 6-10h |
| **Stated total** | **51-76h** |

This total excludes the following tasks, which appear explicitly in tasks.md but carry no corresponding line in the effort table:

- T001a (chunk ordering, B2): 2-4h
- T002a (auto-promotion logic): 5-8h
- T002b (negative feedback confidence signal): 4-6h
- T003a (Exclusive Contribution Rate metric): 2-3h
- PI-A4 / T009 (constitutional memory directives): 8-12h

Including all explicitly scoped subtasks, the true range is approximately **68-109h** — a 33-43% increase over the stated total. This is not a rounding error; the gap is structural and will affect scheduling and handoff timing.

**S4a Internal Inconsistency**

S4a is stated in both spec.md and the tasks checkpoint note as 25-35h. The S4a task set covers:

- T001 (R1 MPAB): 8-12h
- T003 (R13-S2 enhanced eval): 15-20h
- TM-04 (pre-storage quality gate): 6-10h

T001 + T003 alone sum to 23-32h before TM-04 is added. With TM-04, the correct S4a range is 29-42h — higher than the 25-35h stated. Additionally, TM-04 placement is ambiguous. Spec.md lists TM-04 as an S4a task; tasks.md groups TM-04 (T007) separately from both S4a and S4b task lists. The checkpoint note in tasks.md describes S4a as T001 + T003 only, omitting TM-04 entirely. This three-way inconsistency needs resolution before sprint start.

**S4b Internal Inconsistency**

S4b is stated as 47-74h. The S4b task set covers:

- T002 (R11 learned feedback): 16-24h
- T002a (auto-promotion): 5-8h
- T002b (negative feedback signal): 4-6h
- T008 (TM-06 reconsolidation): 6-10h

T002 + T008 sum to 22-34h. Adding T002a and T002b raises this to 31-48h. The 47-74h stated range is not reachable from the task sums alone; the gap of 16-26h is unexplained. Either additional work is implied but not listed, or the stated S4b range is over-estimated. Either condition needs explicit documentation.

**MPAB Coefficient Derivation**

The MPAB bonus coefficient (0.3) and the R11 query weight (0.7x) are stated without derivation from prior sprint measurements (S0-S3). Open question OQ-S4-002 acknowledges the 0.3 coefficient is under review, but neither document cites the empirical basis. The coefficient directly determines the magnitude of the chunk aggregation signal; an incorrect value will cause R1 to either dominate or be inert.

---

### Critical Lens

**MR1 (FTS5 Contamination): Well-Mitigated**

The FTS5 contamination risk — R11 accidentally adding `learned_triggers` to the FTS5 index — is the highest-severity risk in this sprint and is handled with appropriate depth. Mitigations are layered and non-redundant:

1. Schema design uses a separate column (`TEXT DEFAULT '[]'`), architecturally excluded from FTS5
2. CHK-031 is P0 and directly tests the contamination condition
3. The S4a/S4b split ensures A/B detection infrastructure (R13-S2) is operational before any R11 mutations begin
4. R11 is behind a feature flag (`SPECKIT_LEARN_FROM_SELECTION`) with safe-off semantics
5. NFR-S01 explicitly prohibits the column from appearing in the FTS5 index
6. SQLite rollback path (DROP COLUMN) is documented and version-gated
7. A full re-index escape hatch is implicitly available

This is a textbook defense-in-depth design for an irreversible risk.

**F10 (28-Day Calendar Dependency): Under-Planned**

F10 is correctly identified and documented (spec.md §3, plan.md summary, tasks.md checkpoint, CHK-076). However, the planning documentation stops at naming the constraint. It provides no guidance on what work fills the 28-day window between S4a completion and S4b start. Specifically:

- No intermediate deliverables are defined for the idle period
- No criteria are defined for what constitutes "S4a metrics confirm no regressions" (the stated S4b gate)
- CHK-076 is P0 but evaluates the constraint at the end rather than requiring a mid-sprint checkpoint at the 14-day mark

The 28-day window is a project planning fact, not just a technical constraint. Without specifying what happens during those 28 days, teams will either start S4b too early (violating the gate) or leave the sprint plan with an unstructured idle period.

**S4b Risk Concentration**

S4b contains two independently high-risk mutations that interact:

- CRITICAL severity R11: schema migration + learned trigger writes to stored memories
- TM-06 reconsolidation: post-embedding merge/replace decisions on stored memories

Both operations modify persisted memory data. If both are enabled simultaneously and a regression occurs, the rollback must disentangle the effects of two data-mutating systems. The rollback plan (plan.md §7 and L2 enhanced rollback) addresses R11 and TM-06 separately but does not describe a procedure for combined-failure recovery. The 4-6h full rollback estimate may be insufficient if both systems have written to overlapping memories.

**TM-04/TM-06 Threshold Gap: Unverified Zone**

TM-04 Layer 3 rejects saves with cosine similarity >0.92 to existing memories. TM-06 merges memories with cosine similarity >=0.88. This creates an unverified interaction zone: a save with similarity in the range [0.88, 0.92] passes TM-04 (not a near-duplicate by save-gate criteria) but triggers TM-06 merge behavior (is a duplicate by reconsolidation criteria). The save proceeds, generates an embedding, and is then immediately merged with an existing memory by TM-06.

This is not a contradiction — the two thresholds serve different functions at different pipeline stages. However, the behavior in the [0.88, 0.92] zone is non-obvious and undocumented. No checklist item verifies that the intended outcome for this zone (save then merge, or reject before merge?) is what actually occurs. The absence of a test case for this handoff is a gap.

**Duplicate Checklist IDs**

CHK-050, CHK-051, and CHK-052 appear twice in checklist.md with different semantic content:

- First occurrence (lines 93-95, `sprint-4-verification` anchor): TM-06 conflict path, TM-06 complement path, TM-06 reconsolidation flag
- Second occurrence (lines 119-121, `testing` anchor): all acceptance criteria met, 10-15 new tests passing, edge cases tested

Automated verification tooling that checks item completion by ID will produce incorrect results. Either the first or second block must be renumbered. This is a structural defect that must be fixed before checklist tooling is run.

**TM-04 + TM-06 Save Pipeline Complexity**

TM-04 introduces a 3-layer save gate (structural, content quality, semantic dedup). TM-06 introduces a 3-path reconsolidation decision (merge, replace, store). Together, every save now traverses a 6-decision tree before a memory is stored. At the current corpus size (inferred <500 memories based on sprint history), this complexity is disproportionate to the problem: semantic dedup and reconsolidation address a corpus-quality problem that does not yet exist at scale. Both are correctly placed behind feature flags, but the planning documents do not discuss the maintenance burden of maintaining these two overlapping quality systems long-term.

---

### Holistic Lens

**Off-Ramp Criteria Are Measurable**

The Sprint 4 handoff criteria (spec.md §1 metadata) are concrete and testable:
- R1 MRR@5 within 2% of baseline — quantitative, measurable by dark-run
- R11 noise <5% — quantitative, measurable by shadow log
- R13-S2 operational — binary, verifiable by A/B infrastructure check

This is better defined than the handoff criteria in earlier sprints. The exit gate (T006) aggregates these checks explicitly.

**S4a/S4b Split Creates Genuine Optionality**

The F3 sub-sprint split is not merely organizational. S4a delivers independent value: MPAB aggregation improves retrieval signal immediately, and R13-S2 A/B infrastructure enables continuous evaluation for all future sprints. If S4a metrics reveal unexpected regressions, S4b can be indefinitely deferred without losing S4a's deliverables. This is a correct application of the "deliver value at each phase boundary" principle.

**Missing S0-S3 Evidence Linkage**

Two numeric parameters central to Sprint 4 are asserted without empirical derivation:

1. MPAB bonus coefficient: 0.3 (OQ-S4-002 acknowledges this is uncertain)
2. R11 query weight for learned triggers: 0.7x

Neither value is traced to measurements from Sprints 0-3. The architecture documents refer to prior sprints having established baselines (Sprint 3 exit gate is a precondition), but no document bridges Sprint 3 output metrics to Sprint 4 parameter choices. If the baseline measurements from prior sprints exist, they should be cited. If they do not yet exist at planning time, both parameters should be explicitly marked as provisional with a commitment to validate before S4b begins.

**PI-A4 Placement**

PI-A4 (constitutional memory as search directives) is scoped to Sprint 4 in both spec.md and tasks.md. The feature restructures how constitutional memories are consumed at retrieval time, changing their role from content items to query-shaping directives. This is a retrieval pipeline modification — closer in nature to Sprint 5 (pipeline refactor) than to Sprint 4 (feedback loop). PI-A4 does not depend on any Sprint 4 deliverable (R1, R11, R13-S2) and does not enable or block any Sprint 4 exit criterion. Moving PI-A4 to Sprint 5 would reduce S4a scope, clean the S4a effort arithmetic, and place retrieval pipeline changes in the sprint where retrieval pipeline changes are the primary theme. The 8-12h estimate for PI-A4 is excluded from the plan.md effort table, making it an invisible scope addition.

---

## Key Findings

### Top Risks

**Risk 1: Effort Inconsistency (S4a/S4b stated ranges vs. task sums)**

The stated S4a range (25-35h) and S4b range (47-74h) do not match the arithmetic sum of their constituent tasks. The total sprint effort, including all subtasks, is approximately 68-109h against a stated 51-76h. TM-04 appears in S4a in the spec but is absent from the S4a task list in the tasks checkpoint note. This inconsistency will produce incorrect scheduling and incorrect gate-pass assessments at the S4a/S4b boundary.

Resolution: Reconstruct effort ranges from task sums, resolve TM-04 placement, and update plan.md effort table to include all subtasks. Document PI-A4 either explicitly inside or explicitly outside the effort total.

**Risk 2: TM-04/TM-06 Threshold Gap ([0.88, 0.92] unverified zone)**

TM-04 rejects saves at >0.92 cosine similarity. TM-06 merges at >=0.88. A memory saved with similarity between 0.88 and 0.92 passes the quality gate (TM-04 approves it) and is then immediately merged by reconsolidation (TM-06 treats it as a duplicate). No checklist item covers this handoff, and no test case is defined for the [0.88, 0.92] zone.

Resolution: Add a checklist item and unit test for a save with similarity in the [0.88, 0.92] range. Document whether the intended behavior is "save then merge" (TM-06 wins) or "reject before merge" (lower the TM-04 threshold to match TM-06). If "save then merge" is intended, document the resulting frequency increment as expected behavior.

**Risk 3: S4b Risk Concentration (CRITICAL R11 + TM-06 compound rollback)**

S4b enables both R11 (learned trigger writes to stored memories, CRITICAL severity) and TM-06 (merge/replace/store decisions on stored memories). Both systems write to persisted memory data. The rollback plan addresses each system separately but does not describe a combined-failure recovery procedure. If both systems have been active concurrently and a regression is detected, disentangling their effects is non-trivial.

Resolution: Add a combined-failure rollback procedure to plan.md L2 enhanced rollback. Define the order of operations: (1) disable both flags, (2) identify memories touched by TM-06 since enable (via supersedes edges and frequency counter deltas), (3) identify memories touched by R11 (via learned_triggers column), (4) restore from checkpoint. Estimate the combined rollback time separately from the per-system estimates.

---

### Top Strengths

**Strength 1: S4a/S4b Split with Genuine Optionality**

The F3 recommendation is architecturally correct. S4a delivers independent, deferral-safe value: MRR@5-validated chunk aggregation and a fully operational A/B evaluation harness. S4b is explicitly gated on S4a metrics, creating a natural abort point. The split also ensures that the detection infrastructure (R13-S2) is operational before the highest-risk mutation (R11) is enabled — a correct sequencing of detection before mutation.

**Strength 2: R11 Defense-in-Depth (7 Safeguards + P0 Gate + Separate Column + Shadow Period)**

R11's contamination risk is addressed at every layer: architecture (separate column), schema (explicit FTS5 exclusion), behavior (7 runtime safeguards covering TTL, denylist, cap, provenance, shadow period, eligibility, and query weight), verification (CHK-031 P0 contamination test), and process (S4a operational before R11 mutations begin). This is the correct treatment for an irreversible risk. Each safeguard is independently testable, and the safeguard set is non-redundant (each covers a distinct failure mode).

**Strength 3: F10 Calendar Dependency Made Explicit**

The 28-day calendar constraint for the R11 prerequisite is documented in four locations (spec.md §3, plan.md summary, tasks.md checkpoint, CHK-076 P0). Most sprint planning documents treat time-based prerequisites as implicit; making F10 explicit at spec authoring time prevents the common failure mode of a team starting S4b immediately after S4a based on effort-hours completion. CHK-076 is P0, making the calendar check a hard blocker rather than a recommendation.

---

## Recommendations

**REC-01: Reconstruct Effort Table from Task Sums**
Priority: High. Before sprint start, rebuild the plan.md effort table by summing all task estimates including subtasks (T001a, T002a, T002b, T003a). State PI-A4/T009 as either explicitly in-scope (add to total) or explicitly out-of-scope (note as deferred to Sprint 5). Correct S4a and S4b stated ranges to match task arithmetic. Update the stated sprint total from 51-76h to the true range (~68-109h, excluding PI-A4).

**REC-02: Resolve TM-04 Placement**
Priority: High. Determine definitively whether TM-04 (T007) is an S4a or S4b task. Update spec.md §3 recommended split, tasks.md checkpoint note, and plan.md effort breakdown to be consistent. If TM-04 is S4a, add it explicitly to the S4a task list and update S4a effort accordingly. If S4b, explain the architectural rationale (TM-06 dependency?) in a comment.

**REC-03: Define [0.88, 0.92] Zone Behavior and Add Checklist Item**
Priority: High. Document the intended behavior for saves with cosine similarity in the [0.88, 0.92] range: does TM-04 pass and TM-06 merge (save-then-merge), or should TM-04 be tuned to reject at >=0.88 to match TM-06? Add a P1 checklist item and a unit test covering this zone. This is a requirement gap, not an implementation detail.

**REC-04: Fix Duplicate CHK-050/051/052 IDs**
Priority: High. Renumber the second occurrence of CHK-050, CHK-051, CHK-052 (lines 119-121 in checklist.md, testing anchor) to CHK-054, CHK-055, CHK-056. Update the Verification Summary table totals accordingly. This is a structural defect that will cause incorrect automated verification results.

**REC-05: Add Combined S4b Rollback Procedure**
Priority: Medium. Add a combined-failure rollback section to plan.md L2 enhanced rollback covering simultaneous R11 + TM-06 active state. Include: order of flag disablement, method for identifying R11-touched memories (learned_triggers column delta), method for identifying TM-06-touched memories (supersedes edges, frequency counter), and a revised combined rollback time estimate.

**REC-06: Plan the F10 Idle Window**
Priority: Medium. Add a section to plan.md or tasks.md describing the 28-day S4a-to-S4b idle period as structured work: (a) monitor R13-S2 A/B dashboards, (b) collect and review shadow log data from R1, (c) validate MPAB coefficient (0.3) against MRR@5 measurements, (d) derive R11 query weight (0.7x) from observed channel attribution data. This converts an unstructured idle window into a validation sprint that produces the empirical evidence S4b parameters require.

**REC-07: Move PI-A4 to Sprint 5**
Priority: Medium. PI-A4 has no dependency on Sprint 4 deliverables and no impact on Sprint 4 exit criteria. It is retrieval-pipeline in nature, making Sprint 5 (pipeline refactor) the natural home. Moving PI-A4 reduces S4a scope by 8-12h, cleans the effort arithmetic, and co-locates retrieval pipeline changes. If PI-A4 must remain in Sprint 4, add its effort to the plan.md table explicitly and add CHK-PI-A4 items to the Verification Summary totals.

**REC-08: Derive MPAB Coefficient and R11 Weight from Sprint 3 Data**
Priority: Medium. Before S4b begins, the MPAB bonus coefficient (0.3) and R11 learned-trigger query weight (0.7x) should be anchored to empirical measurements from Sprints 0-3. If no such data exists yet, mark both values as provisional in spec.md §10 open questions and add a S4a verification task to collect the measurements needed to confirm or revise them before S4b starts.

**REC-09: Add 14-Day Mid-Window Checkpoint to CHK-076**
Priority: Low. CHK-076 currently evaluates the full 28-day constraint at S4b entry. Add a subordinate check at the 14-day mark (after one complete eval cycle) to confirm the eval infrastructure is collecting valid data. An early failure at day 14 is recoverable; a failure discovered at day 28 wastes the full idle window.

---

## Cross-References

| Document | Path | Relevance |
|----------|------|-----------|
| Sprint 4 Specification | `005-sprint-4-feedback-loop/spec.md` | Primary source: requirements, risks, scope |
| Sprint 4 Plan | `005-sprint-4-feedback-loop/plan.md` | Effort estimates, architecture, rollback plan |
| Sprint 4 Tasks | `005-sprint-4-feedback-loop/tasks.md` | Task sums used for effort reconciliation |
| Sprint 4 Checklist | `005-sprint-4-feedback-loop/checklist.md` | Duplicate ID defect (CHK-050/051/052) |
| Sprint 3 Review | `research/11 - ultra-think-review-sprint-3-query-intelligence.md` | Prior sprint measurements (MPAB coefficient basis) |
| Sprint 5 Spec | `006-sprint-5-pipeline-refactor/spec.md` | Proposed home for PI-A4 |
| Parent Spec | `../spec.md` | Overall sprint sequencing and R-series requirements |
| Parent Plan | `../plan.md` | Cross-sprint effort totals context |

---

**Review completed by**: Ultra-Think Agent (UT-6)
**Analytical lens coverage**: Effort arithmetic, parameter derivation, threshold interaction, ID integrity
**Critical lens coverage**: MR1 FTS5 contamination, F10 calendar dependency, S4b risk concentration, threshold gap, save pipeline complexity
**Holistic lens coverage**: Off-ramp measurability, optionality architecture, S0-S3 evidence linkage, PI-A4 placement

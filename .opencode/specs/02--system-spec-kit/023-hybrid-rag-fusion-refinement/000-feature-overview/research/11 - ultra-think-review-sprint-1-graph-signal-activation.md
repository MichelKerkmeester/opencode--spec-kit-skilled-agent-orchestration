# Ultra-Think Review: Sprint 1 — Graph Signal Activation

**Review Source**: UT-3 Analysis
**Spec Folder**: `02--system-spec-kit/022-hybrid-rag-fusion-refinement/002-sprint-1-graph-signal-activation/`
**Review Date**: 2026-02-27
**Sprint Phase**: Phase 2 of 8
**Priority**: P0

---

## Executive Summary

Sprint 1 — Graph Signal Activation is a well-specified phase that adds typed-weighted degree as the 5th RRF channel (R4), measures edge density, and instruments agent consumption patterns. The structural foundation is strong: requirements trace cleanly from spec (REQ-S1-001 through REQ-S1-005) to tasks (T001–T006 with T003a and T005a) to checklist items (CHK-010, CHK-011, CHK-060, CHK-061). The R4 formula is precisely defined, hub-domination protections are triple-layered, and the build-gate/enable-gate separation allows overlapping development with Sprint 0.

Three issues require attention before implementation begins. First, the P0 exit gate (CHK-060: MRR@5 +2% absolute) is vulnerable to sparse graph conditions that are outside the code's control — the graph may simply lack enough edges for R4 to contribute meaningful signal. Second, combining R4 activation with A7 co-activation strength tripling in a single sprint creates dual graph amplification whose interaction effects will be difficult to isolate. Third, a phase numbering mismatch between the plan (Phases 1–6) and the tasks document (Phases 1–5 with different boundaries) creates coordination risk during implementation. The corrected total effort estimate, including the omitted Phase 6 (PI-A3), is 28–41h rather than the plan's stated 24–35h.

The sprint's parallelization design with Sprint 2 is a genuine strength, as is the clean rollback path via feature flag.

---

## Multi-Lens Analysis

### Analytical Lens

**Requirements traceability is complete.** REQ-S1-001 (R4 degree channel) maps to T001 (degree computation) and T002 (RRF integration), with direct checklist coverage at CHK-010 (hub domination check), CHK-011 (MRR@5 delta), CHK-060, and CHK-061. REQ-S1-002 (edge density) maps to T003 and CHK-062. REQ-S1-003 (G-NEW-2 instrumentation) maps to T004 and CHK-063. REQ-S1-004 (A7 co-activation) maps to T003a and CHK-027. REQ-S1-005 (TM-08 signal vocabulary) maps to T005a and CHK-065. The trace is end-to-end with no orphaned requirements.

**Task decomposition is appropriately granular.** T001 carries the bulk of complexity (8–10h) and is correctly broken into four sub-steps: SQL query (2–3h), normalization wrapper (2–3h), cache with mutation-triggered invalidation (2–3h), and constitutional exclusion filter (1h). T002 (4–6h) depends on T001, blocking Phase 5. T003, T003a, T004, and T005a are marked parallelizable and converge at T005 (dark-run). The dependency DAG is clean with no cycles.

**The R4 formula is precisely specified.** `typed_degree(node) = SUM(weight_t * count_t)` with weights: caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5. Normalization: `log(1 + typed_degree) / log(1 + MAX_TYPED_DEGREE)` where MAX_TYPED_DEGREE=15. Hard cap at DEGREE_BOOST_CAP=0.15. The formula measures 1-hop typed degree centrality — it is not a 2-hop traversal signal. This distinction matters for interpreting R4's contribution in sparse graphs: a memory with one strong causal edge still receives meaningful score; a memory with no edges receives zero.

**The scoring integration is unambiguous.** R4 enters RRF as a 5th additive channel alongside vector, FTS5, trigger, and graph-traverse. The plan's architecture section correctly documents this as a channel extension to existing RRF fusion, not a replacement or weight adjustment of existing channels.

**Effort discrepancy identified.** The plan's effort table (plan.md, `ANCHOR:effort`) totals 24–35h across Phases 1–5. Phase 6 (PI-A3: Pre-Flight Token Budget Validation, 4–6h) is present in the plan's implementation phases section but absent from the effort table. Corrected total: 28–41h. This is a documentation gap, not a planning error, but the discrepancy should be corrected before sprint kick-off to avoid schedule surprises.

**Phase numbering mismatch between plan and tasks.** The plan defines Phases 1–6 with Phase 5 as "Dark-Run and Verification" and Phase 6 as "PI-A3." The tasks document defines Phases 1–5 with Phase 3 covering both measurement and agent UX (conflating the plan's Phases 3 and 4), Phase 5 handling PI-A3, and Phase 4 covering dark-run. The boundary confusion means a developer reading the plan and the tasks in parallel will encounter inconsistent phase labels for the same work. This warrants explicit reconciliation before T005 coordination begins.

---

### Critical Lens

**Risk 1 (Primary): Sparse graph degradation threatens the P0 exit gate.** CHK-060 requires MRR@5 delta >+2% absolute over the Sprint 0 baseline. This gate can fail for two distinct reasons: (a) R4 code is incorrect, or (b) edge density is too low for R4 to differentiate results meaningfully. The spec acknowledges the sparse graph risk (risks table: "Graph too sparse — density < 0.5 — R4 has minimal effect") and correctly notes that R4 returns zero for unconnected memories. However, the exit gate does not distinguish between these failure modes. If the graph has density < 0.5, R4 will compute near-zero scores for most memories, providing insufficient signal to shift rankings by +2% MRR@5. In this scenario, CHK-060 fails not because the implementation is wrong but because the data does not support the signal.

The mitigation documented in the spec — "Escalate R10 to earlier sprint; R4 still correct (returns zero when no edges)" — addresses graph coverage in future sprints but does not resolve the immediate P0 gate failure. Recommendation: add a conditional exit path that records edge density first (T003) and documents a density-adjusted MRR@5 threshold if density < 0.5. The gate as written assumes sufficient graph density exists; that assumption needs explicit validation before CHK-060 is treated as a hard blocker.

**Risk 2 (Significant): Dual graph amplification from R4 and A7 in the same sprint.** Sprint 1 activates R4 (new degree channel) and simultaneously triples A7 co-activation boost strength from 0.1x to 0.25–0.3x. Both are graph-derived signals. If the dark-run shows unexpected result composition shifts, it will be difficult to attribute the effect to R4 alone versus A7 alone versus their interaction. The spec does not establish a sequential enablement order (enable R4 first, stabilize, then adjust A7) or a factorial experiment design for isolating each signal.

This is not a blocking concern — both changes are feature-flag-gated and individually rollback-safe — but it means the dark-run measurement conflates two interventions. If CHK-060 is met, attribution is ambiguous. If CHK-060 is missed, the failure cause is harder to diagnose. Recommendation: enable R4 and A7 in separate dark-run passes within Sprint 1, or at minimum record MRR@5 at three points: Sprint 0 baseline, R4-only, and R4+A7.

**Performance budget is realistic.** NFR-P01 targets <10ms p95 for R4 degree computation overhead. With a mutation-triggered degree cache (T001 sub-step 3), the SQL aggregation over `causal_edges` executes once per graph change rather than per query. For a typical memory store with hundreds to low-thousands of edges, the SQL aggregation should complete well under 10ms. The cache design is appropriate for the access pattern.

**Empty graph safety is well-handled.** R4 returns 0 for memories with no edges (NFR-R02, CHK-026). When the graph has no edges at all, R4 contributes zero to all RRF scores, and the system degrades gracefully to 4-channel fusion. The feature flag (`SPECKIT_DEGREE_BOOST`) provides an additional instant-disable path. The error scenario (graph DB unavailable) is also documented: R4 returns 0, other channels continue normally.

**PI-A3 scope placement is orthogonal.** Pre-flight token budget validation (PI-A3, T007) is logically independent of graph signal activation. The rationale in the spec — that Sprint 1 expands the result scoring surface and increases token overflow risk — is plausible but not specific to Sprint 1 uniquely. PI-A3 would be equally valid in Sprint 0 or Sprint 2. Its inclusion in Sprint 1 adds 4–6h of implementation effort that does not contribute to the R4 dark-run or any Sprint 1 exit gate criteria. It is low-risk and additive, but it competes for sprint capacity and is not required for CHK-060 through CHK-066.

---

### Holistic Lens

**Integration with Sprint 0 is clean.** The build-gate/enable-gate distinction (spec.md, `ANCHOR:phase-context`) is precisely articulated: R4 code can be written and unit-tested during Sprint 0 without the eval infrastructure; it must not be enabled until Sprint 0's exit gate passes. This allows overlapping development without creating a hard sequencing constraint that would extend the overall timeline. The plan's definition of ready explicitly requires Sprint 0 exit gate passage before Sprint 1 dark-run begins.

**Cross-sprint parallelization is well-designed.** Sprint 1 and Sprint 2 share only Sprint 0 outputs as a common dependency. Sprint 2's deliverables (R18 embedding cache, N4 cold-start boost, G2 investigation, score normalization) have zero technical dependency on Sprint 1's R4 or edge density outputs. The single documented coordination point — that Sprint 2's normalization should incorporate R4 degree scores if Sprint 1 completes first — is correctly characterized as a retroactive update option, not a blocking dependency. This design saves 3–5 weeks on the critical path.

**Feature flag hygiene is strong.** CHK-066 establishes an active flag ceiling of 6 and requires a flag inventory at sprint exit. Sprint 1 introduces two new flags: `SPECKIT_DEGREE_BOOST` and `SPECKIT_COACTIVATION_STRENGTH`. Enforcing the ceiling prevents flag proliferation from creating configuration complexity. The explicit inventory requirement makes the flag audit a first-class artifact rather than an informal check.

**Constitutional exclusion is appropriately designed.** Excluding constitutional memories from degree boost (NFR-S01, T001 sub-step 4, CHK-012, CHK-031) prevents a class of domination risk specific to the memory architecture. Constitutional memories by definition appear in all results at the top of the tier ordering; adding degree boost would compound this prominence artificially. The exclusion is implemented at the SQL level (WHERE NOT constitutional) rather than as a post-computation filter, which is the correct approach.

**Rollback is low-cost.** Disabling `SPECKIT_DEGREE_BOOST` instantly removes R4 from scoring. All R4 code changes are additive (new SQL, new TypeScript normalization, new RRF channel slot). No schema changes. No data migrations. The plan estimates 1–2h for full rollback including code revert and test verification. This is credible.

---

## Key Findings

### Top Risks

**Risk 1 — P0 gate vulnerable to sparse graph (Severity: High)**
CHK-060 requires MRR@5 +2% absolute. If edge density < 0.5, R4 contributes near-zero signal to rankings regardless of implementation correctness. The gate as written does not distinguish implementation failure from data insufficiency. The P0 label means the sprint cannot be called complete if this gate fails, but the failure cause determines the correct response: fix the code (sparse graph is not a code bug) or escalate R10 (correct response to insufficient density). An undifferentiated P0 gate could block sprint closure for a data reason while the code is correct.

**Risk 2 — Dual graph amplification interaction effects (Severity: Medium)**
Activating R4 and tripling A7 co-activation strength simultaneously creates two correlated graph signals in the same dark-run. If the combined effect overshoots or undershoots the target, isolating the source is difficult. A sequential enablement protocol within Sprint 1 would provide cleaner measurement without extending the sprint timeline significantly.

**Risk 3 — Phase numbering mismatch (Severity: Low-Medium)**
The plan defines Phases 1–6; the tasks document defines Phases 1–5 with different phase boundaries. A developer executing T005 (dark-run) while referencing the plan's Phase 5 and the tasks document's Phase 4 will encounter inconsistent labels for the same work. This creates coordination friction during dark-run execution, which is the highest-stakes step in the sprint.

### Top Strengths

**Strength 1 — Triple hub-domination protection**
R4 includes three independent hub-domination safeguards: MAX_TOTAL_DEGREE=50 caps the raw degree input, DEGREE_BOOST_CAP=0.15 caps the normalized output, and constitutional memory exclusion removes the highest-prominence memories from degree scoring entirely. Each cap can fail independently without the others failing. This layered defense addresses the preferential attachment risk (high-severity in the risk register) more robustly than any single cap would.

**Strength 2 — Build-gate/enable-gate separation**
The explicit distinction between when R4 code can be written (during Sprint 0, immediately) and when R4 can be enabled (after Sprint 0 exit gate and R13 infrastructure are operational) eliminates an artificial sequencing constraint. This allows parallel development effort and reduces critical path length without creating measurement integrity problems. The separation is precisely articulated in the spec and reflected in the plan's definition of ready.

**Strength 3 — Clean Sprint 2 parallelization**
The zero technical dependency between Sprint 1 and Sprint 2 deliverables, combined with the single documented coordination point (normalization incorporation of R4 degree scores), enables immediate parallel execution after Sprint 0. The plan explicitly quantifies the timeline benefit (3–5 weeks saved on critical path) and correctly characterizes the coordination point as non-blocking.

---

## Recommendations

**REC-1 (Address before sprint start): Differentiate CHK-060 failure modes**
Revise CHK-060 to include a density-conditional path: if T003 edge density measurement returns density < 0.5, document a density-adjusted MRR@5 threshold and record the result as "R4 signal limited by graph sparsity — R10 escalation triggered" rather than an undifferentiated P0 failure. This preserves the P0 gate's intent (confirm R4 works when data supports it) without conflating implementation quality with data coverage.

**REC-2 (Address before dark-run): Sequential dark-run passes for R4 and A7**
Before executing T005, establish a three-measurement sequence: (a) Sprint 0 baseline MRR@5, (b) R4-only dark-run with A7 at original 0.1x, (c) R4+A7 dark-run with A7 at 0.25–0.3x. This adds negligible time to the dark-run phase (one additional eval pass) and provides clean attribution data for CHK-011 and CHK-027. If either change is rolled back, the factorial data identifies which change drove which effect.

**REC-3 (Address before implementation): Reconcile phase numbering**
Align the plan's phase labels with the tasks document's phase labels, or add a cross-reference table that maps plan Phase N to tasks Phase M explicitly. The tasks document's phase structure (which omits Phase 6 from the plan and uses different boundaries for Phase 3) should either be brought into alignment with the plan or the discrepancy should be documented as intentional with a clear mapping.

**REC-4 (Consider deferring): PI-A3 scope**
PI-A3 (T007, 4–6h) is logically orthogonal to graph signal activation. If sprint capacity is constrained, PI-A3 can be deferred to Sprint 2 or Sprint 3 without affecting any Sprint 1 exit gate. The token budget overflow risk it addresses exists independently of R4 activation. If included in Sprint 1, ensure it does not consume capacity from T004 (G-NEW-2 instrumentation), which is P1 required and feeds into CHK-063.

**REC-5 (Documentation): Correct the effort table**
Add Phase 6 (PI-A3, 4–6h) to the effort table in plan.md and update the total from 24–35h to 28–41h. This is a minor documentation fix but ensures sprint scheduling is based on accurate estimates.

---

## Cross-References

| Document | Path | Key Anchors |
|----------|------|-------------|
| Sprint 1 Spec | `002-sprint-1-graph-signal-activation/spec.md` | `requirements`, `risks`, `nfr`, `edge-cases` |
| Sprint 1 Plan | `002-sprint-1-graph-signal-activation/plan.md` | `phases`, `effort`, `phase-deps`, `architecture` |
| Sprint 1 Tasks | `002-sprint-1-graph-signal-activation/tasks.md` | `phase-1`, `phase-2`, `phase-3`, `completion` |
| Sprint 1 Checklist | `002-sprint-1-graph-signal-activation/checklist.md` | `code-quality`, `testing`, `pre-impl` |
| Parent Spec | `140-hybrid-rag-fusion-refinement/spec.md` | Sprint roadmap, cross-sprint dependencies |
| Sprint 0 (Predecessor) | `001-sprint-0-epistemological-foundation/` | Exit gate, eval infrastructure, BM25 baseline |
| Sprint 2 (Parallel) | `003-sprint-2-scoring-calibration/` | R18, N4, G2, normalization — zero dependency on Sprint 1 |
| Ultra-Think Root Review | `research/11 - ultra-think-review-root-documentation.md` | Overall architecture findings |
| Ultra-Think Sprint 0 Review | `research/11 - ultra-think-review-sprint-0-epistemological-foundation.md` | Sprint 0 findings and exit gate criteria |

**Requirements covered by this review**:
- REQ-S1-001 (R4 degree channel) — Risk 1, Strength 1, REC-1, REC-2
- REQ-S1-002 (edge density) — Risk 1, REC-1
- REQ-S1-003 (G-NEW-2 instrumentation) — REC-4
- REQ-S1-004 (A7 co-activation) — Risk 2, REC-2
- REQ-S1-005 (TM-08 signal vocabulary) — not flagged (P2 optional, no critical findings)

**Checklist items with critical findings**:
- CHK-060 — P0 exit gate; sparse graph vulnerability (Risk 1, REC-1)
- CHK-011 — MRR@5 measurement; dual-amplification attribution (Risk 2, REC-2)
- CHK-027 — A7 co-activation verification; dual-amplification attribution (Risk 2, REC-2)
- CHK-066 — Feature flag ceiling; two new flags introduced (`SPECKIT_DEGREE_BOOST`, `SPECKIT_COACTIVATION_STRENGTH`)

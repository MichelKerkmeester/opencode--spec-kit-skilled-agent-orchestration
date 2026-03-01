# Ultra-Think Review: Sprint 5 — Pipeline Refactor

**Spec**: 140-hybrid-rag-fusion-refinement / 006-sprint-5-pipeline-refactor
**Review ID**: UT-7
**Date**: 2026-02-27
**Reviewer**: Ultra-Think Analysis (Multi-Lens Synthesis)
**Sources**: spec.md, plan.md, tasks.md, checklist.md (Phase 6 of 8)

---

## Executive Summary

Sprint 5 is the architectural centrepiece of the 8-sprint program. R6 — a 4-stage pipeline refactor with a hard Stage 4 invariant (no score changes after Stage 3) — is the single largest work item in the entire plan, consuming 40-55h of the sprint's 68-98h core budget. When the two PageIndex items (PI-B1: 10-14h, PI-B2: 16-24h) are added, the total rises to 94-136h, making this the heaviest sprint by a substantial margin.

The sprint design is sound in its principles: Phase A must pass a 0-ordering-difference gate before Phase B begins, a named checkpoint guards against regression, and a defined off-ramp allows Phase B items to be delivered as incremental patches if the R6 refactor fails. The T002 subtask decomposition (T002a through T002h) addresses the high integration risk of a 40-55h monolithic task.

Three issues require resolution before implementation begins. First, OQ-S5-001 (compile-time vs runtime enforcement of the Stage 4 invariant) is the architectural centrepiece of R6 and remains open; it should be closed during spec finalisation, not deferred to implementation. Second, CHK-041 requires "no degradation" of simple query latency for R12 but provides no baseline measurement, no measurement protocol, and no tolerance band — the criterion is unfalsifiable as written. Third, scope creep has inflated the sprint: PI-B1, PI-B2, and TM-05 are tangential to the pipeline refactor's core goal and collectively add 30-44h. These items warrant separation into a parallel or successor sprint.

The sprint delivers a clean feed into Sprint 6: the 4-stage architecture with its explicit boundaries directly enables the graph deepening work planned for Phase 7.

---

## Multi-Lens Analysis

### Analytical Lens

**R6 Decomposition (T002a-T002h)**

The plan's F9 callout decomposes R6 into eight subtasks with clear stage-by-stage sequencing and explicit interface contracts at each boundary. The decomposition follows a logical build order:

1. T002a — interface definition (type-level Stage 4 immutability before any migration)
2. T002b — Stage 1 migration (channel boundary isolation)
3. T002c — Stage 2 migration (scoring consolidation, G2 prevention)
4. T002d — Stage 3 migration (MPAB post-RRF position preserved from Sprint 4)
5. T002e — Stage 4 migration (invariant guard implementation)
6. T002f — feature flag integration and backward compatibility
7. T002g — flag interaction testing (10+ accumulated flags)
8. T002h — dark-run verification (hard gate: 0 ordering differences)

This structure enables incremental dark-run verification at each subtask boundary, reducing the risk of discovering ordering regressions only at the final gate. The subtask durations are individually credible (2-12h each).

However, the F9 note labels this decomposition "RECOMMENDED" rather than mandatory. This is a structural weakness. The original F9 finding that motivated the decomposition was that a 40-55h monolithic task creates unacceptable integration risk. If the decomposition is optional, an implementer can ignore it and reintroduce that risk. The language should be hardened to "REQUIRED" to close the gap between the stated motivation and the actual enforcement.

**Phase A/B Hard Gate**

The 0-ordering-difference gate between Phase A and Phase B is correctly positioned. The acceptance criterion — 0 differences in positions 1-5 AND weighted rank correlation >0.995 on the full eval corpus — is specific and measurable. The relaxation from a strict "0 differences everywhere" criterion to "0 in top-5 positions with high rank correlation" is a pragmatic concession to floating-point arithmetic variance and is well-reasoned.

**Files-to-Change Table**

The scope table in spec.md §3 is imprecise in two entries:

| Entry | Problem |
|-------|---------|
| "Pipeline module (Create)" | No concrete file path provided |
| "Search handlers (Modify)" | No concrete file path provided |

`memory-search.ts` and `hooks/auto-surface.ts` are named explicitly; the other two entries are not. During implementation setup, a developer cannot confirm scope from this table alone. Concrete paths should be resolved during technical planning before T002a begins.

**Effort Distribution**

| Phase | Effort |
|-------|--------|
| Phase A: R6 Pipeline Refactor | 40-55h |
| Phase B: R9, R12, S2, S3, TM-05 | 28-41h |
| Phase C: Verification | included |
| Core sprint total | **68-98h** |
| PI-B1: Tree Thinning | 10-14h |
| PI-B2: Progressive Validation | 16-24h |
| **Full sprint total** | **94-136h** |

This is the largest sprint in the program. The 136h upper bound represents approximately 3.5 developer-weeks. No sprint size guidance or sprint boundary (calendar or budget) is defined in the spec, leaving the schedule overrun risk unquantified.

---

### Critical Lens

**OQ-S5-001 Unresolved: Stage 4 Invariant Enforcement Mechanism**

OQ-S5-001 asks whether the Stage 4 invariant (no score changes after Stage 3) should be enforced at compile-time via TypeScript type guards or at runtime via assertions. This is not a style preference — it has direct implications for implementation in T002a and T002e.

- Compile-time enforcement: Stage 4 input/output types are structurally immutable (read-only score fields, or scores omitted from Stage 4 output type). Violations are caught at build time. Requires careful type design and may require wrapper types.
- Runtime enforcement: Stage 4 asserts that scores are unchanged at exit (deep equality check or score delta = 0). Violations are caught at test/execution time. Simpler to implement but does not prevent the pattern from being written.

NFR-R02 in spec.md describes a "build-time error (or assertion)" as acceptable, but this optionality means the implementer will make the decision during coding — precisely when the architectural choice should already be settled. T002a (interface definition) is the correct point to close this question, and T002a cannot produce a complete design until OQ-S5-001 is answered.

**Recommendation**: Close OQ-S5-001 before T002a begins. The preferred answer (compile-time type guards for structural immutability) should be documented in the spec as a decision, not left as an open question.

**R12 Latency "No Degradation" Criterion is Unfalsifiable (CHK-041)**

CHK-041 states: "R12 no degradation of simple query latency." REQ-S5-003 and NFR-P02 repeat this requirement. The criterion has three missing components:

1. **No baseline**: There is no recorded p95 latency figure for simple queries before R12 is implemented. Without a baseline, "no degradation" cannot be measured.
2. **No measurement protocol**: There is no specification of how latency will be measured (query corpus, percentile, number of runs, environment).
3. **No tolerance band**: "No degradation" is not a numeric threshold. A 1ms regression technically violates it; a 5% regression may be acceptable in practice.

As written, CHK-041 can be claimed as passing by any implementer who believes subjectively that performance is unchanged. The criterion must be made falsifiable before Phase B begins.

**Recommendation**: Before R12 implementation, record a p95 latency baseline for simple queries (R15="simple") on a defined corpus. Express CHK-041 as: "p95 simple query latency under R12 is within X% of baseline" where X is agreed (5% is a common threshold for retrieval systems).

**Feature Flag Combinatorial Risk**

By Sprint 5 exit, 10+ feature flags have accumulated. T002g allocates only 3-5h to verify all flag interactions under PIPELINE_V2. The checklist (CHK-075) requires that "all 10+ accumulated flags tested together" with evidence of "no interaction regressions." With 10 binary flags, there are 1,024 possible combinations; with 12 flags, 4,096.

Exhaustive combination testing is not feasible in 3-5h. The spec does not define a reduced test matrix (e.g., pairwise coverage, orthogonal array) that would provide systematic coverage within the time budget. CHK-074 sets a target of "≤6 active flags at Sprint 5 exit," implying flag sunset is expected — but this check occurs at exit gate, after T002g is complete.

**Recommendation**: Define the flag interaction test matrix explicitly before T002g begins. At minimum, identify which flags interact with PIPELINE_V2 (scoring flags are likely; context/session flags may be independent) and test those combinations. Document the coverage strategy in the checklist evidence for CHK-075.

**OQ-S5-002 Unresolved: S2/S3 Signal Weighting**

OQ-S5-002 asks how template anchor (S2) and validation (S3) signals should weight relative to existing scoring — additive or multiplicative. This parallels the G2 double-weighting issue that motivates the entire pipeline refactor. An unresolved weighting question for two new scoring signals, entering Stage 2 (the single consolidated scoring point), risks introducing the same class of problem that R6 is designed to prevent.

**Recommendation**: Resolve OQ-S5-002 before T007 (S2) and T008 (S3) begin. The resolution should specify: signal type (additive offset, multiplicative factor, or independent ranking dimension), scale (bounded 0-1 or unbounded), and interaction with existing Stage 2 scoring signals.

---

### Holistic Lens

**Sprint Ordering: Correct**

The principle of "calibration before surgery" is honoured. Sprints 0-4 established the scoring calibration infrastructure (graph signals, cross-encoder, MPAB, feedback loop) before Sprint 5 attempts to refactor the pipeline that runs them. A pipeline refactor attempted before the scoring layer was stable would have compounded integration risk.

The dependency chain is clean: Sprint 4 exit gate (feedback loop) must close before Sprint 5 begins; Sprint 5 exit gate (4-stage architecture) must close before Sprint 6 (graph deepening) begins. The sequential gate design prevents architectural debt from accumulating.

**Sprint 6 Feed is Clean**

The 4-stage architecture directly enables Sprint 6's graph deepening work. Stage 1 (Candidate Generation) and Stage 2 (Fusion + Signal Integration) are the natural extension points for graph-based scoring signals. The clean stage boundaries mean Sprint 6 additions can be confined to Stage 1 (new graph channels) and Stage 2 (new graph scoring signals) without touching Stage 3 or Stage 4. This is the correct architectural substrate for the planned work.

**Scope Creep: Three Tangential Items**

Three items in the sprint are tangential to the pipeline refactor's core goal:

| Item | Description | Effort | Relationship to R6 |
|------|-------------|--------|--------------------|
| PI-B1 | Tree thinning in generate-context.js | 10-14h | Pre-pipeline context loading; no interaction with stage boundaries or scoring |
| PI-B2 | Progressive validation for validate.sh | 16-24h | Validation tooling; no interaction with pipeline, scoring, or retrieval |
| TM-05 | Dual-scope auto-surface hooks | 4-6h | Lifecycle hooks in auto-surface.ts; unrelated to 4-stage architecture |

PI-B1 and PI-B2 are useful improvements, but their inclusion in Sprint 5 inflates the sprint by 26-38h without advancing the core R6 goal. If R6 encounters ordering regressions or the Phase A gate is delayed, these items will compete for attention during the most critical phase of implementation. TM-05's relationship to the pipeline is similarly orthogonal.

The R6 off-ramp acknowledges that Phase B items can be delivered as incremental patches if the pipeline refactor fails. This logic extends to PI-B1 and PI-B2: both are independently deliverable at any sprint boundary and have no dependency on SPECKIT_PIPELINE_V2.

**Recommendation**: Consider separating PI-B1, PI-B2, and TM-05 into a tooling/infrastructure sprint running in parallel or after Sprint 5, so that Sprint 5 resources remain concentrated on R6 and its Phase B dependencies.

**R6 Off-Ramp is Well-Defined**

If ordering regressions in the dark-run cannot be resolved, the plan specifies a concrete fallback: retain the current pipeline and implement R9, R12, S2, and S3 as incremental patches to the existing code. This preserves the retrieval quality improvements (query expansion, pre-filter, metadata signals) even if the architectural invariant cannot be achieved in this sprint. The off-ramp is correctly scoped — it does not abandon the sprint's retrieval value, only defers the architectural refactor.

The named checkpoint (`pre-pipeline-refactor`) is required before T001 and provides a clean restore point. This is good risk management for the largest refactor in the program.

---

## Key Findings

### Top Risks

**Risk 1 — Sprint Oversize (94-136h)**

Sprint 5 is the largest sprint in the 8-sprint program. The 136h upper bound is approximately 3.5 developer-weeks. No sprint boundary (calendar, budget, or LOC) is defined, and no prioritisation rule specifies which items are cut if the sprint runs long. The three tangential items (PI-B1, PI-B2, TM-05) account for 30-44h of this overrun risk and have no dependency on PIPELINE_V2.

Probability: High. Impact: High (schedule slip propagates to Sprint 6 graph deepening).
Mitigation: Separate PI-B1, PI-B2, and TM-05 into a parallel sprint. Define a sprint time-box.

**Risk 2 — OQ-S5-001 Unresolved Before T002a**

The Stage 4 invariant enforcement mechanism (compile-time vs runtime) is the architectural centrepiece of R6 and is currently an open question in spec.md §10. T002a (interface definition) cannot produce a complete, correct design until this question is answered. If the question is deferred to implementation, the developer will make an ad-hoc architectural decision under time pressure.

Probability: Medium (questions often drift to implementation). Impact: High (wrong enforcement mechanism may require T002a rework, cascading to T002b-T002f).
Mitigation: Close OQ-S5-001 as a spec decision before T002a begins. Recommended answer: compile-time type guards for structural immutability.

**Risk 3 — R12 Latency Criterion Unfalsifiable**

CHK-041 ("no degradation of simple query latency") has no baseline, no protocol, and no tolerance band. If R12 introduces a latency regression, there is no objective evidence to detect it. The checklist item will be self-assessed by the implementer as passing.

Probability: High (baselines are frequently skipped). Impact: Medium (latency regressions in retrieval are user-visible but non-blocking for correctness).
Mitigation: Record p95 baseline before R12 implementation; express CHK-041 as a numeric threshold (e.g., p95 within 5% of baseline).

---

### Top Strengths

**Strength 1 — R6 Off-Ramp Defined**

The plan explicitly states that if ordering regressions cannot be resolved, the current pipeline is retained and R9, R12, S2, S3 are implemented as incremental patches. This means the sprint delivers retrieval value regardless of whether the architectural refactor succeeds. The off-ramp is not a sign of low confidence in R6 — it is sound sprint design.

**Strength 2 — Phase A/B Hard Gate with Specific Criterion**

The 0-ordering-difference gate (positions 1-5 AND rank correlation >0.995) is measurable and enforced structurally by the T002h subtask. Phase B is blocked in the task dependency graph until T002h passes. This prevents the anti-pattern of "we'll fix the ordering differences in Phase C."

**Strength 3 — Feature Flag Audit (CHK-074 through CHK-076)**

The checklist includes three P1 items specifically for feature flag hygiene: a count target (≤6 active flags at exit), an interaction matrix verification, and a sunset documentation requirement with metric evidence. This proactive flag management prevents the accumulated technical debt of 10+ flags from compounding into Sprint 6 and beyond. The sunset criteria are tied to the metric evidence already collected in prior sprints (e.g., RSF_FUSION retirement threshold linked to Sprint 3's Kendall tau result).

---

## Recommendations

**R1 — Harden T002 Decomposition to REQUIRED**
Change the F9 note from "RECOMMENDED: Decompose T002" to "REQUIRED: T002 is split into T002a-T002h; monolithic T002 is not permitted." The stated motivation (integration risk of a 40-55h task) justifies mandatory decomposition. Priority: High. Owner: Spec author before implementation begins.

**R2 — Close OQ-S5-001 as a Spec Decision**
Document the Stage 4 invariant enforcement mechanism in spec.md §10 as a closed decision. Recommended resolution: compile-time TypeScript type guards enforcing structural immutability (read-only score fields in Stage 4 input/output types), with a runtime assertion as a secondary defense-in-depth guard. Priority: High. Owner: Spec author before T002a.

**R3 — Establish R12 Latency Baseline Before Phase B**
Add a pre-Phase-B task to record p95 simple query latency on a defined corpus. Update CHK-041 to: "p95 simple query latency under R12+R15 mutual exclusion is within 5% of pre-R12 baseline." Priority: High. Owner: Implementation team before T006.

**R4 — Resolve OQ-S5-002 Before T007/T008**
Document the S2/S3 signal weighting strategy (additive, multiplicative, or independent dimension) in spec.md §10 as a closed decision. Specify scale bounds and interaction with existing Stage 2 signals. Priority: Medium. Owner: Spec author before Phase B.

**R5 — Define Flag Interaction Test Matrix for T002g**
Before T002g begins, identify which of the 10+ accumulated flags interact with PIPELINE_V2 (likely: RSF_FUSION, CHANNEL_MIN_REP, DOCSCORE_AGGREGATION, LEARN_FROM_SELECTION). Define a pairwise or orthogonal test matrix for those interactions. Document the coverage strategy as evidence for CHK-075. Priority: Medium. Owner: Implementation team before T002g.

**R6 — Separate PI-B1, PI-B2, and TM-05**
Move PI-B1 (tree thinning, 10-14h), PI-B2 (progressive validation, 16-24h), and TM-05 (auto-surface hooks, 4-6h) into a parallel infrastructure sprint or defer to post-Sprint 5. These items have no dependency on SPECKIT_PIPELINE_V2 and their inclusion inflates Sprint 5 by 30-44h. Priority: Medium. Owner: Sprint planner.

**R7 — Add Concrete File Paths to Scope Table**
Resolve "Pipeline module (Create)" and "Search handlers (Modify)" to concrete TypeScript file paths before T002a begins. Priority: Low. Owner: Implementation team during technical setup.

---

## Cross-References

| Item | Location |
|------|----------|
| Sprint 5 specification | `006-sprint-5-pipeline-refactor/spec.md` |
| Sprint 5 implementation plan | `006-sprint-5-pipeline-refactor/plan.md` |
| Sprint 5 task breakdown | `006-sprint-5-pipeline-refactor/tasks.md` |
| Sprint 5 verification checklist | `006-sprint-5-pipeline-refactor/checklist.md` |
| Parent specification | `../spec.md` |
| Parent plan | `../plan.md` |
| Sprint 4 review (predecessor) | `research/11 - ultra-think-review-sprint-4-feedback-loop.md` |
| Root documentation review | `research/11 - ultra-think-review-root-documentation.md` |
| PageIndex architecture analysis | `research/9 - analysis-pageindex-systems-architecture.md` |
| PageIndex recommendations | `research/9 - recommendations-pageindex-patterns-for-speckit.md` |

| Requirement | Checklist Items | Risk Rating |
|-------------|-----------------|-------------|
| R6: 4-stage pipeline (REQ-S5-001) | CHK-020 to CHK-024 | High |
| R9: Spec folder pre-filter (REQ-S5-002) | CHK-030 | Low |
| R12: Query expansion (REQ-S5-003) | CHK-040, CHK-041 | Medium |
| S2/S3: Retrieval metadata (REQ-S5-004/005) | CHK-050, CHK-051 | Low |
| TM-05: Auto-surface hooks (REQ-S5-006) | CHK-055 to CHK-058 | Low |
| PI-B1: Tree thinning | CHK-PI-B1-001 to 007 | Low |
| PI-B2: Progressive validation | CHK-PI-B2-001 to 010 | Medium |

| Open Question | Status | Blocks |
|---------------|--------|--------|
| OQ-S5-001: Stage 4 enforcement (compile vs runtime) | OPEN — must close | T002a |
| OQ-S5-002: S2/S3 signal weighting | OPEN — must close | T007, T008 |

---

*Ultra-Think Review UT-7 — Sprint 5 Pipeline Refactor — 2026-02-27*

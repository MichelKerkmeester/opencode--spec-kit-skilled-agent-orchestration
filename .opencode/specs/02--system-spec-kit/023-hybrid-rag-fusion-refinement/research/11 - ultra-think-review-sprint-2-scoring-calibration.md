---
title: "Ultra-Think Review: Sprint 2 — Scoring Calibration"
description: "Multi-lens UT-4 analysis of Sprint 2 scoring calibration: R18 embedding cache, N4 cold-start boost, G2 investigation, TM-01/TM-03, and score normalization."
trigger_phrases:
  - "sprint 2 review"
  - "scoring calibration review"
  - "ultra-think sprint 2"
  - "UT-4 scoring calibration"
importance_tier: "important"
contextType: "research"
---
# Ultra-Think Review: Sprint 2 — Scoring Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_REVIEW_SOURCE: UT-4 multi-lens analysis | 2026-02-27 -->
<!-- PARENT_SPEC: ../003-sprint-2-scoring-calibration/spec.md -->

---

## Executive Summary

Sprint 2 (Scoring Calibration) is a well-motivated sprint that targets real, measurable deficiencies in the memory system's scoring pipeline: a 15:1 magnitude mismatch between RRF and composite scoring, systematic invisibility of newly indexed memories, unnecessary embedding regeneration costs, and an unresolved double intent weighting anomaly. The core engineering instincts are sound — feature flag discipline is rigorous, the G2 investigation is correctly scoped with dual-outcome paths, and the parallelization insight saves 3-5 weeks on critical path.

However, the sprint carries three material risks that require pre-implementation resolution. First, scope has expanded from the original 4 features (R18, N4, G2, normalization) to 7+ work items (adding TM-01 interference scoring, TM-03 classification-based decay, FUT-5 K-value sensitivity, PI-A1 folder scoring, and a Phase 7 verification block) without a corresponding re-evaluation of the complexity assessment or effort budget. The 26-40h estimate may undercount. Second, the normalization method is unresolved (OQ-S2-003: linear vs. min-max vs. z-score) and this gap directly blocks Phase 4 — the most critical deliverable. Third, TM-01's thresholds (0.75 cosine similarity, -0.08 penalty coefficient) are unjustified magic numbers that risk both false penalties and conflicting signals with N4's boost logic.

The sprint is implementable with those three issues addressed. The UT-4 analysis surfaces no fundamental design flaws — only calibration gaps and documentation debt.

---

## Multi-Lens Analysis

### Analytical Lens

**R18 Embedding Cache (T001, Phase 1)**

The specification is well-defined. The schema — `content_hash TEXT, model_id TEXT, embedding BLOB, dimensions INT, created_at TEXT, last_used_at TEXT, PRIMARY KEY (content_hash, model_id)` — is explicit and sufficient. The implementation hints in tasks.md are concrete and grounded in existing codebase patterns (`db.ts` migration style, `INSERT OR REPLACE` idiom). The 8-12h estimate is conservative and credible for a new SQLite table plus cache lookup/store wiring in the embedding pipeline.

Key correctness properties are satisfied by design: the composite primary key `(content_hash, model_id)` ensures cache invalidation on model change; SHA-256 collision risk is correctly described as astronomically low; `last_used_at` enables future LRU eviction at low incremental cost. The graceful fallback on cache miss (normal embedding generation) means R18 carries near-zero regression risk.

One gap: no explicit cache size bound is specified. The spec notes eviction as "future work," which is reasonable, but a soft warning threshold (e.g., alert when cache exceeds 10,000 entries) should be in the NFR or edge cases section to prevent silent unbounded growth.

**N4 Cold-Start Boost (T002, Phase 2)**

The formula `boost = 0.15 * exp(-elapsed_hours / 12)` is precisely defined. The spec provides verification points at 0h (0.15), 12h (~0.055), 24h (~0.020), and 48h (~0.003), which map cleanly to four unit tests. The 48h cutoff produces an effective-zero boost (~0.003), giving a smooth boundary without a hard cliff. Feature-flag gating behind `SPECKIT_NOVELTY_BOOST` (defaulting to disabled) is correct protocol. The 3-5h effort estimate is reasonable for formula implementation plus flag wiring plus four unit tests.

The spec states N4 is "applied BEFORE FSRS temporal decay" with a combined score cap at 0.95. This ordering is important: applying N4 before FSRS means the boost operates on the pre-decay composite score rather than the post-decay value. This is analytically defensible — N4 corrects for FSRS's systematic penalty against recency — but the interaction requires empirical verification, not just assertion.

**G2 Double Intent Weighting (T003, Phase 3)**

The investigation-first design is correct. The spec identifies all three codebase locations (`hybrid-search.ts`, `intent-classifier.ts`, `adaptive-fusion.ts`) and defines explicit decision criteria in tasks.md: if weights are applied once in classification AND once in fusion for the same purpose, it is likely a bug (double-counting); if applied in classification for channel selection AND in fusion for score weighting (different purposes), it may be intentional. Both outcome paths (fix + dark-run, or document + dark-run) are fully specified. The 4-6h investigation budget is appropriate.

The dependency chain is correctly modeled: T004 (normalization) depends on T003 (G2 outcome), because the normalization approach may need to account for whether intent weighting is applied once or twice in the pipeline at the time normalization is computed.

**Score Normalization (T004, Phase 4)**

This is the most consequential deliverable in Sprint 2 — it directly addresses the 15:1 magnitude mismatch that makes RRF fusion nearly invisible. The normalization is correctly gated on G2 resolution. However, OQ-S2-003 (normalization method: linear vs. min-max vs. z-score) remains unresolved in the spec. The spec text states "research recommends linear to [0,1] but empirical comparison may be needed." This is not a resolved question; it is a deferred one. Phase 4 cannot begin without answering it.

**TM-01 Interference Scoring (T005)**

The interference scoring concept — penalizing memories that cluster too densely in the same spec_folder — addresses a real problem: when many near-duplicate memories exist, individual scores should be reduced to prevent a single topic from consuming the result set. The implementation approach (cosine similarity threshold, count-based interference score, linear penalty in composite scoring) is structurally sound.

However, two values require justification before implementation: (1) the 0.75 cosine similarity threshold defining "near-duplicate," and (2) the -0.08 penalty coefficient per unit of interference score. Neither has a stated derivation. These should be treated as calibration parameters from the start — named constants with documented rationale, exposed as configurable values (even if not yet feature-flag gated), rather than hardcoded literals.

**TM-03 Classification-Based Decay (T006)**

The decay multiplier matrix (context_type x importance_tier) is logically consistent: decisions and constitutional/critical memories are semantically long-lived and should not decay; temporary memories should decay faster; research notes occupy a middle ground. The 3-5h estimate for modifying `fsrs-scheduler.ts` with the multiplier matrix is plausible. No major analytical gaps identified here.

**FUT-5 K-Value Sensitivity (T004a)**

Grid search over K ∈ {20, 40, 60, 80, 100} is a sound empirical approach to RRF parameter calibration. The 2-3h estimate is appropriate for running the grid, measuring MRR@5 deltas, and documenting the optimal K. This is a research task, not an implementation task — it produces a recommendation, not a code change.

**PI-A1 Folder-Level Relevance Scoring (T009, Phase 5/PI-A1)**

The FolderScore formula `(1/sqrt(M+1)) * SUM(MemoryScore(m))` with a damping factor to prevent volume bias is analytically principled. Placement in Sprint 2 is justified because score normalization (Phase 4) is a prerequisite for meaningful FolderScore aggregation — without [0,1]-normalized inputs, the sum is on an arbitrary scale. The two-phase retrieval pattern (folder selection then within-folder search) is a natural fit for spec-scoped queries. Low regression risk as a pure scoring addition with no schema changes.

**Structural Defects Identified**

Two structural errors in tasks.md require correction before implementation begins:

1. **Phase ordering inversion**: Phase 5 (PI-A1: Folder-Level Relevance Scoring) appears in tasks.md before Phase 4 (Verification). The document reads: Phase 3 block, then Phase 5 (PI-A1), then Phase 4 (Verification). This is a documentation sequencing error — Phase 4 (Verification, containing T007 and T008) is the sprint exit gate and must appear last.

2. **Completion criteria reference error**: The `completion` anchor states "Sprint 2 exit gate (T006) passed." T006 is TM-03 Classification-Based Decay — a feature implementation task, not the sprint exit gate. The actual sprint exit gate is T008. The completion criteria should read "Sprint 2 exit gate (T008) passed."

---

### Critical Lens

**Gap 1: Normalization Method Unresolved (OQ-S2-003) — Blocks Phase 4**

OQ-S2-003 asks which normalization method to apply (linear scaling, min-max normalization, or z-score standardization). The spec acknowledges the question but does not resolve it. The plan.md states normalization approach "may depend on G2 outcome" — which is accurate, but it conflates two separate decisions: (a) which mathematical method to use, and (b) how G2 outcome affects the scoring distribution that normalization operates on.

These are independent decisions. The normalization method choice should be resolved before Phase 3 exits, not deferred to Phase 4 implementation. Unresolved, it creates a decision gap mid-implementation that could stall or backtrack Phase 4.

Recommended resolution: add a Phase 3 subtask to select the normalization method empirically — measure the actual score distribution on a sample query set, compare linear scaling vs. min-max output stability, and document the selection with evidence. This adds 1-2h to Phase 3 but removes a blocking ambiguity from Phase 4.

**Gap 2: N4 and FSRS Interaction — Asserted, Not Proven**

The spec states N4 has "no conflict with FSRS temporal decay" with the rationale that "N4 modifies composite score, FSRS modifies temporal weight; they are additive, not multiplicative." This claim is asserted without mathematical derivation.

The concern is not that the two systems share the same variable (they do not), but that the 0.95 cap creates an interaction surface. If a memory's composite score is already at 0.90 post-normalization, N4's boost of 0.15 at t=0h would be clipped to 0.05 by the cap. The clipping behavior is not symmetric across memories — higher-scoring memories receive less boost than lower-scoring ones, which may invert the intended effect for already-strong new memories. This requires empirical dark-run verification, not assertion.

**Gap 3: TM-01 False Cluster Penalty**

TM-01 penalizes memories with cosine similarity > 0.75 in the same spec_folder by counting near-neighbors and applying a linear penalty. This design assumes that high-similarity intra-folder memories are redundant. However, a spec folder organized around a single complex decision will legitimately contain many memories that are semantically similar (all discussing aspects of the same decision). These memories are not redundant — they are contextually dense. TM-01 would penalize this entire cluster, reducing the visibility of relevant memories precisely where they are needed most.

The 0.75 threshold is not calibrated against real spec_folder distributions. Without empirical validation against actual memory clusters, the threshold could be either too permissive (not catching true redundancy) or too aggressive (penalizing legitimate semantic coherence). This is not a reason to abandon TM-01, but it is a reason to require a dark-run with false-positive measurement as part of CHK-066 ("no false penalties on distinct content").

**Gap 4: N4 and TM-01 Signal Conflict**

N4 boosts new memories by up to +0.15. TM-01 may penalize those same new memories if they are indexed into a spec_folder that already contains semantically similar content (which is the common case — new memories about a topic where prior memories exist). The two features could fire simultaneously in opposing directions, with no defined priority or resolution mechanism.

The spec does not address this interaction. It should either (a) specify that N4 boost is applied after TM-01 penalty (N4 as a floor-setting mechanism), or (b) clarify that the systems are independent (N4 in composite-scoring.ts pre-FSRS path, TM-01 as a post-normalization penalty) and the net effect is the intended behavior. The current spec leaves this interaction implicit.

**Gap 5: Scope Expansion Without Complexity Re-Assessment**

The original Sprint 2 scope in the spec.md problem statement describes 4 features: R18, N4, G2, normalization. The in-scope table in spec.md §3 adds FUT-5. Tasks.md adds TM-01 (T005), TM-03 (T006), PI-A1 (T009), and a verification phase (T007, T008). The checklist adds CHK-066 and CHK-067 as P1 sprint exit gate items for TM-01 and TM-03.

The complexity assessment in spec.md §9 scores Sprint 2 at 24/70 (Level 2) based on "4 files, 1 new table, 3 independent features." This score was computed against the original 4-feature scope. The actual scope — 7 features across 8 phases with 9 tasks — warrants a re-assessment. The 26-40h effort estimate in plan.md covers the expanded scope but the complexity score does not reflect it, creating a documentation inconsistency.

---

### Holistic Lens

**Sprint Parallelization — Correctly Identified**

The insight that Sprint 1 (R4 typed-degree, edge density) and Sprint 2 (R18, N4, G2, normalization) are independent of each other — both depending only on Sprint 0 — is analytically correct and high-value. The spec correctly identifies the sole coordination point: if Sprint 1 completes first, Sprint 2's normalization can incorporate R4 degree scores retroactively. This is forward-looking design that protects the critical path without creating a hard dependency.

The 3-5 week savings estimate from parallel execution is credible given the sprint durations implied by the effort estimates.

**Sprint 3 Feed-Forward — Dependency Chain Sound**

Sprint 2's primary feed-forward to Sprint 3 is the normalized [0,1] score outputs (required for query routing decisions in Sprint 3) and FUT-5's optimal K value (which informs RRF configuration in the hybrid search pipeline Sprint 3 refines). The dependency chain is sound. Score normalization is correctly identified as a prerequisite for FolderScore aggregation (PI-A1), which in turn is a prerequisite for the two-phase retrieval path that Sprint 3's query router will invoke.

**Parameterized Calibration Design**

The consistent use of feature flags (`SPECKIT_NOVELTY_BOOST`, `SPECKIT_INTERFERENCE_SCORE`), configurable formulas (N4's half-life parameter, TM-01's threshold and coefficient), and dark-run comparison methodology reflects a calibration-oriented design philosophy rather than a one-time fix. This is the correct approach for a scoring pipeline where the right parameter values cannot be known in advance — the infrastructure for ongoing measurement is being built alongside the first set of parameter values. The N4 formula's 12h half-life and 0.15 coefficient, and TM-01's 0.75 threshold and -0.08 coefficient, should all be understood as initial calibration points, not final values.

**Missing Observability**

The sprint installs several new scoring components (N4 boost, TM-01 interference penalty, TM-03 decay multipliers) but does not specify monitoring for post-deployment drift. The dark-run methodology validates correctness at deployment time, but there is no mechanism to detect if N4 boost values drift from expected distribution over time (e.g., if a large batch of memories is indexed simultaneously, creating an artificial cold-start spike), or if TM-01 interference scores creep upward as the memory database grows and intra-folder density naturally increases.

A lightweight observability requirement — logging the distribution of N4 boost values and TM-01 interference scores at query time, sampled to 5% of queries — would cost 2-4h to implement and provide the foundation for future calibration decisions. Without it, the calibration parameters will be set once and left unmonitored.

---

## Key Findings

### Top Risks

**Risk 1: Scope Creep — 4 Features Expanded to 7+**

The original problem statement describes 4 features. The tasks.md includes 9 tasks (T001, T002, T003, T004, T004a, T005, T006, T007, T008) plus T009 (PI-A1) across phases that are ordered inconsistently. The 26-40h effort estimate may undercount if TM-01's interference scoring computation (cosine similarity across all intra-folder memory pairs at index time) proves expensive on large spec_folders, or if G2 reveals a complex double-application that requires non-trivial refactoring rather than a one-line fix.

Mitigation: Re-evaluate complexity score (currently 24/70) against 7-feature scope. Consider whether TM-01 and TM-03 belong in Sprint 2 (scoring calibration) or Sprint 5 (pipeline refactor), given that their parameter values are unjustified and require empirical calibration work that mirrors the core Sprint 2 calibration work.

**Risk 2: Normalization Method Unresolved — OQ-S2-003 Blocks Phase 4**

Phase 4 (score normalization) cannot begin until the normalization method is selected. The spec defers this to "empirical comparison if needed" without specifying who decides, on what evidence, and with what timeline. This is a decision gap that sits on the critical path between Phase 3 (G2 investigation) and the sprint's most important deliverable.

Mitigation: Add an explicit decision task to Phase 3 — measure the actual RRF and composite score distributions on a 100-query sample, compare linear scaling vs. min-max output stability, document the selection. Gate Phase 4 on this decision being logged in a decision record.

**Risk 3: Magic Number Thresholds in TM-01**

TM-01's 0.75 cosine similarity threshold and -0.08 penalty coefficient appear in spec.md §4 (REQ-S2-006) without derivation or justification. They are not described as initial calibration values subject to empirical tuning — they are specified as requirements. This creates two problems: (a) implementation engineers may treat them as fixed rather than tuneable, and (b) CHK-066 requires "no false penalties on distinct content" without specifying how false penalties are measured or what constitutes a false positive.

Mitigation: Reclassify the 0.75 threshold and -0.08 coefficient as initial calibration values in the spec. Add a FUT item for empirical validation of TM-01 parameters after 2 eval cycles. Define false positive measurement criteria in CHK-066 (e.g., "no penalty applied to spec_folders containing fewer than 3 memories about a single topic, where all memories have been manually verified as semantically distinct").

### Top Strengths

**Strength 1: Feature Flag Discipline — Every New Behavior Gated**

Both N4 (`SPECKIT_NOVELTY_BOOST`) and TM-01 (`SPECKIT_INTERFERENCE_SCORE`) are gated behind environment variable feature flags that default to disabled. This means Sprint 2 can be deployed to production with all new scoring behaviors in dark-run mode, empirically validated before activation, and instantly disabled if validation fails. The rollback plan (plan.md §7) requires only flag changes for the scoring behaviors and a `DROP TABLE` for the embedding cache — an estimated 2-3h rollback with low difficulty. This is model feature flag engineering for a scoring pipeline.

**Strength 2: G2 Dual-Outcome Design — Both Paths Fully Specified**

The G2 investigation (T003) is the most technically uncertain task in the sprint. The spec correctly handles this uncertainty by defining both outcome paths with equal specificity: if bug, implement fix with dark-run comparison; if intentional, document rationale with evidence. The decision criteria in tasks.md (T003b) are concrete: intent weights applied for the same purpose twice = bug; applied for different purposes in different pipeline stages = intentional. This design prevents the investigation from becoming an open-ended exploration — it will terminate with a documented outcome regardless of what the investigation finds.

**Strength 3: Parallel Sprint Execution — 3-5 Weeks Saved on Critical Path**

The identification of Sprint 1 and Sprint 2 as parallel-executable — both depending only on Sprint 0 — is the highest-leverage scheduling insight in the parent plan. The spec correctly removes the Sprint 1 prerequisite that appeared in an earlier version and documents the sole coordination point (R4 degree scores can be incorporated retroactively into normalization). This is evidence of careful dependency analysis rather than conservative sequential scheduling by default.

---

## Recommendations

**REC-S2-01 (Pre-implementation, Blocking): Resolve OQ-S2-003 Before Phase 4**

Add a Phase 3 subtask: measure actual RRF and composite score distributions on a 100-query sample from the live memory database. Compare linear scaling vs. min-max normalization on stability of output distribution. Document the selection in a decision record before Phase 4 begins. Effort: 1-2h. Priority: blocking.

**REC-S2-02 (Pre-implementation, Blocking): Fix Structural Defects in tasks.md**

Correct the two documentation errors: (1) move the Phase 5 (PI-A1) block to appear after Phase 4 (Verification) in document order, or rename the phases consistently with plan.md's 8-phase structure; (2) update the `completion` anchor's exit gate reference from T006 to T008. These are documentation errors that will cause confusion during implementation.

**REC-S2-03 (Pre-implementation, High Priority): Reclassify TM-01 Thresholds as Calibration Values**

Update REQ-S2-006 to describe the 0.75 similarity threshold and -0.08 penalty coefficient as "initial calibration values, subject to empirical tuning after 2 eval cycles." Add a FUT item for TM-01 parameter calibration. Update CHK-066 to specify how false positives are measured.

**REC-S2-04 (Implementation, Medium Priority): Specify N4 Cap Clipping Behavior**

Document the behavior when a memory's pre-boost composite score is already high (e.g., 0.85+). The 0.95 cap means N4's intended 0.15 boost is clipped asymmetrically — high-scoring new memories receive proportionally less boost than low-scoring ones. This may be acceptable but should be explicitly specified (not emergent behavior).

**REC-S2-05 (Implementation, Medium Priority): Define N4 and TM-01 Interaction Resolution**

Specify whether N4 boost is applied before or after TM-01 penalty in the composite scoring pipeline. If N4 is applied first and TM-01 is applied second, the penalty could partially or fully negate the boost for new memories in dense clusters. If TM-01 is applied first and N4 second, the boost acts as a floor for new memories regardless of interference. Document the chosen order and the rationale.

**REC-S2-06 (Post-deployment, Low Priority): Add Lightweight Observability**

Log the distribution of N4 boost values and TM-01 interference scores at query time, sampled at 5%. This enables detection of calibration drift without requiring additional infrastructure — the data is already computed in the hot path. Effort: 2-4h. Without this, the Sprint 2 calibration parameters will be set once and left unmonitored.

**REC-S2-07 (Scope, Advisory): Re-Evaluate TM-01 and TM-03 Sprint Placement**

TM-01 and TM-03 are substantive features with unjustified parameter values that require empirical calibration. They share structural similarity with Sprint 2's core calibration work but add scope risk. Consider whether they are better placed in Sprint 5 (pipeline refactor) where calibration infrastructure (from Sprint 2's R13-S1 eval) will have had 2+ cycles to produce empirical guidance. If retained in Sprint 2, update the complexity assessment score.

---

## Cross-References

| Document | Path | Relationship |
|----------|------|--------------|
| Sprint 2 Spec | `003-sprint-2-scoring-calibration/spec.md` | Primary source |
| Sprint 2 Plan | `003-sprint-2-scoring-calibration/plan.md` | Implementation plan |
| Sprint 2 Tasks | `003-sprint-2-scoring-calibration/tasks.md` | Task breakdown |
| Sprint 2 Checklist | `003-sprint-2-scoring-calibration/checklist.md` | Verification checklist |
| Parent Spec | `../spec.md` | Parent 140 specification |
| Sprint 0 Review | `research/11 - ultra-think-review-sprint-0-epistemological-foundation.md` | Predecessor UT review |
| Sprint 1 Review | `research/11 - ultra-think-review-sprint-1-graph-signal-activation.md` | Parallel sprint UT review |
| Sprint 3 Spec | `004-sprint-3-query-intelligence/spec.md` | Successor (normalization feed-forward) |
| Requirements | REQ-S2-001 through REQ-S2-007 | Primary requirements reviewed |
| Open Questions | OQ-S2-001, OQ-S2-002, OQ-S2-003 | Unresolved questions (OQ-S2-003 is blocking) |
| Checklist Items | CHK-060 through CHK-068 | Sprint exit gate criteria |

---

<!--
UT-4 REVIEW — Sprint 2, Scoring Calibration
Lenses applied: Analytical, Critical, Holistic
Top risks: Scope creep, normalization method gap, magic number thresholds
Top strengths: Feature flag discipline, G2 dual-outcome design, parallel sprint execution
Structural defects found: Phase ordering inversion in tasks.md, T006 vs T008 completion criteria error
Review date: 2026-02-27
-->

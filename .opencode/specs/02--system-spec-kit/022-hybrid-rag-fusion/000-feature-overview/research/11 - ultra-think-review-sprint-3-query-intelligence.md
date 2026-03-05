# Ultra-Think Review: Sprint 3 — Query Intelligence

**Source**: UT-5 analysis of Sprint 3 spec, plan, tasks, and checklist
**Date**: 2026-02-27
**Spec Folder**: `02--system-spec-kit/022-hybrid-rag-fusion/013-query-intelligence/`
**Phase**: 4 of 8

---

## Executive Summary

Sprint 3 closes the query-level intelligence layer of the Hybrid RAG Fusion pipeline. Its three core deliverables — a 3-tier query complexity router (R15), Relative Score Fusion evaluation across all variant forms (R14/N1), and post-fusion channel min-representation enforcement (R2) — are well-specified, measurably bounded, and correctly sequenced. The shadow-mode evaluation discipline is sound, and the Hard Scope Cap governing continuation beyond Sprint 3 is the single best-designed governance mechanism in the entire specification series.

Two structural issues warrant remediation before implementation begins. First, T001 (10-16h) is a monolithic task covering classifier design, routing logic, flag wiring, and shadow verification — it should be decomposed into 3-4 granular subtasks to enable incremental verification. Second, T008 (PI-A2, 12-16h) introduces a three-tier search fallback chain that nearly matches the total effort of the primary R15 feature while addressing a condition — empty or low-similarity results — that is rare or unmeasurable given the current corpus size of fewer than 500 memories. PI-A2 is premature at this scale and should be deferred.

A third concern applies to the evaluation corpus: CHK-030 requires 100+ queries for RSF shadow comparison, but no sourcing strategy is defined. With a corpus under 500 memories, the risk of synthetic or non-representative queries producing misleading tau scores is real and should be addressed explicitly.

Overall assessment: the sprint is ready to proceed with the two structural remediations applied. The default-STOP off-ramp cap, shadow evaluation discipline, and feature flag governance represent the best practices of this specification series.

---

## Multi-Lens Analysis

### Analytical Lens

**Query classifier design** uses a 3-tier complexity model (simple / moderate / complex) grounded in lightweight, deterministic heuristics: query character length, whitespace-split term count, trigger phrase presence via exact match, and a stop-word-to-content-word ratio heuristic for semantic complexity. This is a sound approach. It avoids the overhead of a 7-intent-type classification system that would require either trained models or extensive rule libraries, and it is fast enough to satisfy the p95 <30ms requirement for simple queries.

The classification boundaries are partially defined in T001a: simple is characterized by 3 or fewer terms or a trigger phrase match; complex requires more than 8 terms with no trigger match. The moderate zone covers the interior. These thresholds are reasonable starting points and are config-driven rather than hardcoded, which is correct. No boundary calibration data is cited.

**Relative Score Fusion (RSF)** is implemented in shadow mode alongside RRF. The evaluation criterion is the Kendall tau rank-correlation computed over 100+ queries. A tau below 0.4 triggers RSF rejection. This is a principled, measurement-first approach: RSF is not promoted to production unless it demonstrates sufficient ranking agreement. Three variants are in scope — single-pair, multi-list, and cross-variant — totaling approximately 200-250 LOC, substantially more than a naive estimate of the core formula alone (~80 LOC). The spec correctly flags this scope difference.

**Phase dependency structure** is clean. Phases 1 and 2 (R15 router and R14/N1 RSF) are independently parallelizable and both depend only on the Sprint 2 exit gate. Phase 3 (R2 min-representation) depends on Phase 1. Phase 4 (shadow comparison and verification) gates on all three. No circular dependencies are present.

**Effort range** is 26-40h for the three core phases, a 1.5x spread that reflects genuine uncertainty about classifier calibration time and RSF variant complexity. Adding PI-A2 (12-16h) pushes the total to 38-56h, expanding the spread further. The wide ranges are not a defect — they are honest — but the T001 monolith contributes to the uncertainty by bundling multiple separable concerns into a single estimate block.

**Feature flag count** at Sprint 3 exit is expected to reach 6 active flags. CHK-073 caps this at 6 and requires explicit evidence at exit gate. This is a well-calibrated governance constraint: a count above 6 indicates either insufficient flag retirement discipline or scope accumulation.

**R15 and R2 interaction** is correctly specified. The minimum 2-channel constraint in R15 is a prerequisite for the R2 channel diversity guarantee to function. Both the spec (NFR-R02) and the checklist (CHK-021, CHK-025) encode this dependency. The rollback procedure also identifies these flags as interacting, requiring joint disable and independent verification.

### Critical Lens

**T001 monolithic task structure.** T001 covers classifier feature design, classification boundary definition, tier-to-channel-subset mapping, flag wiring, pipeline entry wiring, and shadow verification — all under a single 10-16h estimate. This structure resists incremental verification. A classifier boundary bug detected at the shadow verification sub-step cannot be isolated without re-reading the entire 10-16h implementation unit. The task should be decomposed into at minimum: (a) classifier design and boundary definition (2-4h), (b) tier routing and flag wiring (3-4h), (c) pipeline integration and shadow run (3-6h), (d) p95 latency verification (1-2h). T002 has a similar issue: all three RSF variants are bundled into one 10-14h task, though the single-pair-first sequencing noted in the hint provides partial mitigation.

**Misclassification handling is binary.** The specified fallback on classifier failure is "fall back to complex tier — full pipeline runs." This is a safe default. However, no confidence score is produced by the classifier. A query sitting on the simple/moderate boundary could be assigned either tier without any signal to downstream consumers that the classification is uncertain. For the current scale, the binary fallback is acceptable, but it forecloses the ability to use classification confidence as a downstream feature (e.g., conservative top-K truncation for low-confidence classifications). This is worth noting as a known limitation rather than a gap to fill now.

**PI-A2 scope creep.** The PI-A2 task (search strategy degradation with a three-tier fallback chain) adds 12-16h of effort and 7 checklist items (CHK-PI-A2-001 through CHK-PI-A2-007) to Sprint 3. Its triggering conditions are: top result similarity below 0.4 or result count below 3. At a corpus size under 500 memories, results below 3 are uncommon and similarity below 0.4 on genuine queries is unmeasured. There is no evidence in the spec or plan that empty or low-quality results represent a measured deficiency in Sprint 0-3 data. PI-A2 implements a complex, three-tier degradation chain (full hybrid → broadened → structural) for a condition that has not been demonstrated to occur at meaningful frequency. PI-A2 effort (12-16h) approaches the total effort of the R2 min-representation phase plus Phase 4 shadow evaluation combined. The 11 additional checklist items expand the verification burden by approximately 35%. This pattern — adding defensive infrastructure for unmeasured edge cases — is premature optimization. PI-A2 should be deferred to the post-Sprint 3 evaluation window and reconsidered only if Sprint 0-3 metrics demonstrate that low-result or low-similarity queries constitute a measurable degradation pathway.

**Eval corpus sourcing is undefined.** CHK-030 requires a minimum of 100 queries for the RSF shadow comparison. No sourcing strategy is defined in the spec, plan, or checklist. At fewer than 500 total memories, synthetic query generation is likely, but synthetic queries constructed to match known memory content will systematically over-represent the easy classification tier and under-represent edge cases. Alternatively, if queries are drawn from actual usage logs, the distribution may be skewed toward the dominant use patterns. Neither approach is acknowledged. A sourcing strategy — even a brief one — should be added to the plan or as a pre-implementation checklist item to ensure the tau computation has defined meaning.

**R12+R15 mutual exclusion is deferred but documented.** The spec correctly notes that R12 (query expansion) and R15 (complexity router) cannot be active simultaneously, with the enforcement deferred to Sprint 5 where R12 is scoped. CHK is silent on this during Sprint 3 verification. This is acceptable given the deferral, but a P2 note in the Sprint 3 checklist confirming R12 is not active would close a potential interaction risk at no meaningful cost.

### Holistic Lens

**The Hard Scope Cap is the strongest governance feature in this specification series.** The cap is encoded in three documents (spec, plan, checklist) with consistent wording. The three conditions for continuing beyond Sprint 3 — (a) measured deficiency evidence with specific Sprint 0-3 metric values, (b) updated effort estimates from actuals, (c) ROI assessment — are unambiguous and non-circumventable. The default decision is explicitly STOP. CHK-064 encodes this at the checklist level where it functions as a hard gate on the exit evaluation. This is an exemplary scope governance pattern.

**Sprint 3 is a natural stopping point.** The query intelligence layer — classification, routing, alternative fusion evaluation, and post-fusion diversity enforcement — constitutes a complete, coherent capability increment. If the off-ramp thresholds (MRR@5 >= 0.7, constitutional accuracy >= 95%, cold-start recall >= 90%) are met, the system will have a well-instrumented, multi-channel, diversity-enforced retrieval pipeline with a validated fusion strategy. This is a production-capable state. The inclination to continue into Sprints 4-7 should be actively resisted unless the metrics demonstrate specific, quantified deficiencies.

**Shadow evaluation discipline is consistently applied.** R15 uses shadow comparison between the full 5-channel pipeline and the routed subset before enabling routing as primary. RSF runs in shadow alongside RRF with Kendall tau as the decision criterion. R2 enforces via dark-run before activating. This pattern — measure before commit — is applied correctly across all three primary features and represents the most important correctness property of the sprint design.

**Query classification as Sprint 4+ dependency.** The R15 classifier will become a foundational dependency for any feature in Sprint 4 or beyond that wants to vary behavior by query type. Dynamic token budgets (FUT-7, T007) and confidence-based truncation (R15-ext, T006) already depend on it within Sprint 3. This makes the classifier's accuracy boundaries and the absence of a confidence signal more consequential than they appear at this sprint's scale.

**Off-ramp thresholds are well-chosen.** MRR@5 >= 0.7 measures ranking quality on actual retrieval tasks. Constitutional accuracy >= 95% guards the highest-priority content against any regression introduced by routing. Cold-start recall >= 90% ensures the pipeline remains effective for new spec folders with no warm cache. These three metrics cover the principal quality dimensions (ranking, priority correctness, coverage) without over-specifying the evaluation surface.

---

## Key Findings

### Top Risks

**Risk 1: PageIndex PI-A2 scope creep (High Priority)**
PI-A2 adds 12-16h and 7 checklist items to address a condition — low-similarity or low-count query results — that has not been measured or demonstrated at the current corpus scale (<500 memories). This effort nearly matches the core R15 phase (10-16h) and expands verification scope by ~35%. Implementing PI-A2 in Sprint 3 violates the evidence-based continuation principle that the Hard Scope Cap is designed to enforce. The risk is not that PI-A2 is wrong in concept — a degradation fallback chain is a reasonable idea — but that it is being built without measured evidence of need.

Mitigation: Defer T008 (PI-A2) from Sprint 3. Add a note in CHK-064 that PI-A2 will be evaluated in the post-Sprint 3 assessment window using Sprint 0-3 frequency data on low-result queries. Proceed with PI-B3 (T009, 4-8h) as its lower risk and effort profile is proportionate to current scale.

**Risk 2: T001 monolithic task structure (Medium Priority)**
T001 bundles classifier design, routing implementation, flag wiring, pipeline integration, and shadow verification into a single 10-16h task. This structure makes incremental progress invisible and delays detection of design-level issues (e.g., wrong classification boundaries) until the implementation is already fully wired. A bug at the boundary definition stage discovered during shadow verification requires unwinding multiple implementation layers.

Mitigation: Decompose T001 into 3-4 granular subtasks as described in the analytical section. Consider similar decomposition for T002: implement the single-pair RSF variant first (T002a), verify it, then build multi-list (T002b) and cross-variant (T002c) on the confirmed foundation.

**Risk 3: Eval corpus representativeness (Medium Priority)**
CHK-030 gates RSF adoption on a Kendall tau computed from 100+ queries. No sourcing strategy is defined. With a corpus under 500 memories, synthetic queries risk over-representing simple classification cases and producing a tau score that reflects query generation bias rather than genuine fusion behavior differences. An artificially high tau could falsely validate RSF; an artificially low tau could falsely reject it.

Mitigation: Add a plan-level item defining the query sourcing strategy before implementation begins. Acceptable approaches include: stratified sampling across query tiers (ensuring coverage of simple, moderate, and complex tier distributions), log-based sampling from actual usage if available, or a documented hybrid with explicit acknowledgment of synthetic query limitations.

### Top Strengths

**Strength 1: Default-STOP scope cap with three-condition continuation gate**
The Hard Scope Cap is the clearest, most operationally enforceable scope governance mechanism in this specification series. Its three conditions are specific enough to resist gaming (metric values must be cited, not summarized; effort estimates must come from actuals, not original projections; ROI must be explicit). The default-STOP framing inverts the usual implementation bias toward continuation. CHK-064 encodes it at checklist level, making it a non-skippable exit gate item. This pattern should be carried forward into any future specification series.

**Strength 2: Shadow-mode evaluation applied consistently across all three features**
All three primary Sprint 3 features use shadow or dark-run evaluation before any production impact. R15 runs both the full pipeline and the routed subset in parallel, comparing results before enabling routing as primary. RSF runs alongside RRF with results logged but not used until tau is computed and documented. R2 enforces via dark-run before activating. This eliminates the category of regression caused by untested feature activation and creates an audit trail for every feature decision. The shadow discipline is a structural property of the sprint design, not an afterthought.

**Strength 3: Feature flag governance with count cap and sunset requirement**
CHK-073 caps active feature flags at 6 at Sprint 3 exit and requires an explicit enumeration of active flags as evidence. CHK-074 requires documented metric evidence for any flag retirement or consolidation. Together these two items prevent flag accumulation from becoming technical debt and ensure that flag lifecycle decisions are made consciously rather than by default. The count cap is well-calibrated: Sprint 3 brings exactly 3 new flags, the prior sprints contribute up to 3, and the cap absorbs the full expected count without slack that would invite additions.

---

## Recommendations

**R1. Defer T008 (PI-A2) from Sprint 3.**
Remove T008 from the Sprint 3 task list. Add a deferred evaluation item in CHK-064: "PI-A2 will be re-evaluated after Sprint 3 using measured frequency of low-result (<3) and low-similarity (<0.4) query outcomes from Sprint 0-3 data." Retain T009 (PI-B3) as its 4-8h effort and low-risk profile are proportionate to the current implementation context.

**R2. Decompose T001 into granular subtasks.**
Split T001 into: (a) classifier boundary definition and feature design (2-4h), (b) tier-to-channel-subset routing and flag wiring (3-4h), (c) pipeline integration (2-4h), (d) shadow comparison run and p95 latency verification (1-2h). Update the tasks.md accordingly. Consider analogous decomposition for T002 using single-pair-first sequencing as T002a, T002b (multi-list), T002c (cross-variant).

**R3. Define eval corpus sourcing strategy before implementation.**
Add a plan-level or checklist item (P1) specifying how the 100+ queries for RSF shadow comparison will be sourced. Minimum requirement: stratified sampling with documented tier distribution. If synthetic queries are used, acknowledge the limitation in the RSF decision documentation.

**R4. Add a P2 checklist item confirming R12 is not active at Sprint 3 exit.**
A single checklist item — "R12 (query expansion) flag is inactive at Sprint 3 exit gate" — closes the R12+R15 mutual exclusion interaction risk at negligible cost.

**R5. Add a known-limitation note on classifier confidence absence.**
In the spec's risks or open questions section, note that the R15 classifier produces no confidence score, and that the binary "fall back to complex" default is intentional but forecloses confidence-weighted downstream features. This is not a Sprint 3 gap to fix but a design decision worth documenting for Sprint 4+ context.

---

## Cross-References

| Document | Path | Relevance |
|----------|------|-----------|
| Sprint 3 Spec | `013-query-intelligence/spec.md` | Primary source for requirements, scope, and risks |
| Sprint 3 Plan | `013-query-intelligence/plan.md` | Implementation phases, effort, and PageIndex tasks |
| Sprint 3 Tasks | `013-query-intelligence/tasks.md` | Task decomposition, dependencies, and completion criteria |
| Sprint 3 Checklist | `013-query-intelligence/checklist.md` | Verification items CHK-020 through CHK-082 |
| Parent Spec | `../000-feature-overview/spec.md` | Full specification context and sprint sequence |
| Parent Plan | `../000-feature-overview/plan.md` | Cross-sprint dependencies and milestone structure |
| UT Reviews Sprint 0-2 | `research/11 - ultra-think-review-sprint-*.md` | Predecessor sprint analysis for pattern continuity |
| PageIndex Analysis | `research/9 - recommendations-pageindex-patterns-for-speckit.md` | Source analysis for PI-A2 and PI-B3 recommendations |

---

**Review authored by**: UT-5 multi-lens analysis
**Lenses applied**: Analytical, Critical, Holistic
**Scope status**: Review only — no implementation artifacts modified

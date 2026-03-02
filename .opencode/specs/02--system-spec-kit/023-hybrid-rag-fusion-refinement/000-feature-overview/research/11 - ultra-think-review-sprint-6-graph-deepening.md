# Ultra-Think Review: Sprint 6 — Graph Deepening

**Source**: UT-8 analysis
**Date**: 2026-02-27
**Sprint**: 007-sprint-6-graph-deepening (Phase 7 of 8)
**Parent Spec**: 140-hybrid-rag-fusion-refinement
**Status**: Pre-implementation review (spec.md status: Draft)

---

## Executive Summary

Sprint 6 — Graph Deepening is a technically ambitious sprint targeting six requirements (R7, R10, R16, N2, N3-lite, S4) across four subsystems simultaneously. The sprint has two internally parallel phases: Phase A (graph centrality, community detection, and N3-lite consolidation) and Phase B (anchor-aware thinning, encoding-intent capture, entity extraction, and spec folder hierarchy retrieval).

The documentation quality is high. Effort transparency is a standout strength: the dual-track estimate (68-101h heuristic / 120-200h production) with embedded warnings at every level is exemplary practice. The provenance-first design — `created_by='auto'`, `weight_history` audit, strength caps, and edge bounds — is sound defensive engineering.

However, UT-8 analysis identifies a structurally significant concern: the sprint may be premature. Critical open questions about graph size and edge density (OQ-S6-001, OQ-S6-002) remain unresolved at spec time, yet they are prerequisites for determining whether the N2 graph algorithms produce signal or noise at current data scale. The 10% attribution mandate for N2 (REQ-S6-004) risks forcing the retrieval pipeline to over-weight a graph channel that may be structurally uninformative at the current corpus size. Combined with HIGH rollback difficulty (12-20h) and a 2-3x estimation uncertainty range, the sprint carries meaningful execution risk concentrated in Phase A.

Phase B (R7, R16, S4) is practical, well-scoped, and delivers clear value independent of graph scale. N3-lite (T002) is moderately well-specified, though bundling five sub-components into a single task at 10-15h is an under-decomposition risk.

The primary recommendation from UT-8 is to split Sprint 6 into Sprint 6a (Phase B + N3-lite: 31-48h, low risk) and Sprint 6b (Phase A N2 + R10: gated on a mandatory feasibility spike and measured graph density). This sequencing protects delivery of high-value practical improvements while deferring speculative graph sophistication until the evidence base exists to justify it.

---

## Multi-Lens Analysis

### Analytical Lens

**Task decomposition quality**

Task T001 is well-decomposed: it breaks into four sub-tasks (T001a–T001d) each carrying sub-steps, algorithm references, and per-subtask acceptance criteria. This is exemplary for a high-complexity graph task and meaningfully reduces ambiguity at implementation time.

T001a (N2a: Graph Momentum / Temporal Degree Delta) is estimated at 8-12h for a snapshot table plus delta computation. This estimate may be inflated. A `degree_snapshot` table with daily degree counts and a delta query is straightforward SQL engineering — the ceiling is likely closer to 5-8h absent unexpected schema complications.

T001b (N2b: Causal Depth Signal) at 5-8h for BFS/DFS max-depth normalization is reasonable and well-specified.

T001c (N2c: Community Detection) at 12-15h heuristic / 40-80h Louvain is the most uncertain item in Phase A, correctly flagged with a dedicated estimation warning. The recommended escalation path (connected components first, Louvain only if separation is insufficient) is a sound engineering approach.

T001d (weight_history audit tracking) at 2-3h is accurately scoped and correctly promoted to REQUIRED status — without it, rollback of cumulative Hebbian weight modifications is practically impossible.

T002 (N3-lite) bundles five distinct sub-components — contradiction scan, Hebbian strengthening, staleness detection, edge bounds, and contradiction cluster surfacing — into a single task at 10-15h total. This is under-decomposed. Each sub-component has independent acceptance criteria and could fail or be deferred independently. A split into T002a–T002e would align with the decomposition discipline applied to T001.

**Algorithm specification gaps**

Temporal decay formulas for Hebbian strengthening are clearly stated (+0.05/cycle, MAX_STRENGTH_INCREASE=0.05, 30-day decay of 0.1). However, relationship-type weighting for the N2 attribution target is unspecified. REQ-S6-004 requires "channel attribution >10%" but does not define how different edge types (causal, support, contradicts, derived_from) are weighted when computing graph channel contribution. Without this specification, the attribution metric is ambiguous and the 10% target is not verifiable.

OQ-S6-002 (which centrality algorithm — betweenness, PageRank, or eigenvector?) remains open, yet T001a and T001b implement degree-delta and depth-signal algorithms respectively — neither of which is betweenness, PageRank, or eigenvector centrality. There is a mismatch between the open question framing and the algorithm choices actually specified in the tasks.

**Feasibility spike designation**

The Algorithm Feasibility Spike (8-16h) is designated RECOMMENDED in the Definition of Ready (plan.md §2). Given the 2-3x estimation uncertainty it is intended to resolve, RECOMMENDED is insufficient. Without this spike, the sprint cannot reliably commit to a quality tier (heuristic vs. production) before planning begins, which is the primary driver of the 68-101h vs. 120-200h gap.

**Verification burden calibration**

The checklist contains 37 verification items: 2 P0, 18 P1, 17 P2. All six core requirements are classified P2-Optional at the requirement level (spec.md §4), yet the exit gate items for those same requirements are promoted to P1 in the checklist (CHK-060 through CHK-066). This creates an internal priority inconsistency: requirements are deferrable at the spec level but effectively mandatory at the verification level. The P2 classification at the requirement level should either be raised to P1 or the exit gate items should explicitly reference the P2 deferral path.

---

### Critical Lens

**Is graph deepening premature?**

This is the central question UT-8 raises. The spec acknowledges in OQ-S6-001 that the actual edge density after Sprints 1-5 is unknown. At sub-500 nodes with sparse edges, the N2 algorithms behave qualitatively differently than at scale:

- N2c (Community Detection): At sub-500 nodes, label propagation and connected-components BFS return trivially obvious clusters — the spec folder hierarchy itself already encodes the most natural community structure. Algorithmic community detection at this scale adds computation without adding information that is not already available through S4.
- N2a (Graph Momentum): At 5-10 memories indexed per day, the temporal degree delta over a 7-day sliding window is dominated by noise rather than signal. The momentum scores for a sparse graph measure recent indexing activity, not meaningful connectivity acceleration.
- N2b (Causal Depth Signal): Max-depth normalization by graph diameter is meaningful only when the graph has sufficient depth. In a shallow graph (depth 2-3 common), this produces a near-binary score (root=0, leaf=1) with minimal gradient between nodes.

None of these failure modes are disqualifying at larger scale. They are, however, real risks at the graph scale that likely exists at Sprint 6 entry. The spec does not state the current graph size, and this is a meaningful omission.

**The 10% attribution mandate**

REQ-S6-004 requires graph channel attribution >10% of final top-K results. If the graph channel at current density provides structurally weak signal (as argued above), enforcing a 10% attribution floor means the retrieval pipeline will systematically include graph-derived results that are lower quality than the alternatives the pipeline is displacing to meet the threshold. This is not a hypothetical degradation path — it is a predictable consequence of mandating contribution from a structurally thin channel.

**Value distribution across the sprint**

Phase B items are practical, well-scoped, and directly useful:
- R7 (anchor-aware thinning): Recall@20 within 10% of baseline is a measurable, conservative acceptance criterion. Effort (10-15h) matches scope.
- R16 (encoding-intent capture): Low-risk, 5-8h, clearly bounded. Delivers useful retrieval metadata.
- S4 (spec folder hierarchy): 6-10h, hierarchy traversal functional, directly useful for structured retrieval.

These three items together require approximately 21-33h at the low end and deliver reliable, scale-independent improvements.

N2 (items 4-6) and R10 together consume 37-53h at the heuristic estimate (25-35h N2 + 12-18h R10). At production quality, this range extends to 95-130h (N2c up to 80h + R10 up to 50h). At current graph scale, the likely value return for this effort is marginal.

The sprint is therefore approximately 50% high-value practical work (Phase B: R7, R16, S4) and 50% speculative graph sophistication (Phase A: N2, R10) whose value is contingent on graph scale that has not been measured.

**N3-lite rollback exposure**

N3-lite Hebbian strengthening modifies existing edge weights incrementally. After multiple cycles, the cumulative effect of +0.05 increments with 30-day decay is non-trivial to reverse without the `weight_history` log introduced in T001d. The spec correctly identifies rollback difficulty as HIGH (12-20h). However, T001d is a prerequisite for T002 but is itself listed as a separate task within the T001 block — its status as a true dependency (not just a sequencing note) is underspecified in the task notation.

---

### Holistic Lens

**Sprint 5 integration gaps**

Sprint 6 declares Sprint 5 pipeline refactor as a blocking dependency for all work. The plan references this dependency in the Definition of Ready and the phase dependency table, but provides no specific interface citations. No mention is made of which Sprint 5 interfaces R7 thinning logic reads, which indexing pipeline entrypoints R16 extends, or which graph subsystem APIs Phase A algorithms consume. The dependency is acknowledged but not substantiated. This is not a blocker for spec approval, but it is a gap that creates integration risk at implementation time.

**Algorithm feasibility spike sufficiency**

The Feasibility Spike (8-16h) is designated RECOMMENDED rather than REQUIRED. This designation is inconsistent with the documented uncertainty level. The spike is listed as addressing: (a) whether Louvain is appropriate at current graph density, (b) what heuristic level is sufficient for contradiction detection, and (c) whether rule-based entity extraction meets the <20% FP threshold. These are not optimizations — they are prerequisite calibrations for three of the six sprint requirements. Demoting them to RECOMMENDED creates the risk that the sprint begins with an uncalibrated quality tier and encounters the estimation gap (68-101h vs. 120-200h) mid-sprint rather than at planning time.

**Concurrent concern surface**

Sprint 6 addresses five distinct concerns simultaneously: graph centrality (N2a/b/c), lightweight consolidation (N3-lite), indexing granularity (R7), metadata enrichment (R16), and entity enrichment (R10). These span four subsystems: the graph module (`fsrs.ts`), the consolidation module (`causal_edges` schema), the indexing pipeline, and the entity extraction module. Partial completion of any one thread does not constitute a sprint deliverable — the exit gate requires all six requirements verified. A sprint with this surface area and HIGH rollback difficulty on its largest component (N3-lite) carries structural delivery risk that is not fully mitigated by Phase A/B parallelization.

**Verification item priority calibration**

37 verification items for a sprint where all six core requirements are P2-Optional represents a disproportionate verification burden relative to the deferral classification. The checklist would benefit from a clear deferral path notation aligned with the P2 designation in the spec: each P2 requirement should have an explicit "deferred with reason" option in the checklist rather than implicitly promoting to P1 at the exit gate level.

---

## Key Findings

### Top Risks

**Risk 1 — Premature graph sophistication (HIGH)**

N2 centrality and community detection on a sub-500-node graph with sparse edges is likely to produce noise rather than signal. The 10% attribution mandate (REQ-S6-004) risks forcing the retrieval pipeline to over-weight a structurally thin graph channel, actively degrading retrieval quality for users. This risk is not mitigated by any current sprint mechanism — the attribution target is a fixed requirement, not a density-conditional gate like R10. OQ-S6-001 (edge density) and OQ-S6-002 (centrality algorithm selection) remain open at sprint entry.

Mitigation path: Gate N2 implementation on a feasibility spike that measures actual graph density and validates algorithm behavior on real data. If graph density is insufficient, defer N2 to Sprint 6b and remove the 10% attribution mandate from the Sprint 6 exit gate.

**Risk 2 — Estimation uncertainty without mandatory spike (HIGH)**

The 68-101h vs. 120-200h estimation range represents a 2-3x uncertainty band. The primary driver is the quality tier for N2c (community detection), N3-lite (contradiction detection), and R10 (entity extraction). This uncertainty is known at spec time but unresolved because the feasibility spike that would resolve it is RECOMMENDED rather than REQUIRED. A sprint that begins without confirming quality tier cannot commit to delivery timelines or resource allocation with confidence.

Mitigation path: Promote the Feasibility Spike from RECOMMENDED to REQUIRED as a Definition of Ready gate. The 8-16h spike investment directly collapses the 120h estimation uncertainty band.

**Risk 3 — HIGH rollback difficulty for N3-lite edge mutations (HIGH)**

N3-lite Hebbian strengthening modifies existing edge weights incrementally and persistently. The `weight_history` log (T001d) is the primary rollback mechanism, but it is a prerequisite for T002 that is itself implementation work within the sprint. If T001d is not completed before N3-lite begins execution, weight modifications accumulate without a recovery path. The 12-20h rollback estimate applies even with `weight_history` in place. Without it, rollback may require full checkpoint restore, discarding all Sprint 6 changes.

Mitigation path: Enforce T001d as a HARD GATE before any N3-lite execution begins. Consider running N3-lite in a single controlled cycle with manual review before enabling the weekly batch schedule.

---

### Top Strengths

**Strength 1 — Estimation transparency**

The dual-track effort model (68-101h heuristic / 120-200h production) with embedded estimation warnings at the requirement level (spec.md §3), plan level (plan.md §1, §4), task level (tasks.md T001, T002, T005), and effort table (plan.md §L2) is exemplary documentation practice. The warnings are specific — they name the algorithm (Louvain), the risk mechanism (research-grade on SQLite), and the recommended alternative (connected components first). This transparency enables informed planning and scoping decisions at sprint entry rather than mid-sprint discovery.

**Strength 2 — Provenance-first design**

The sprint's safety architecture is well-designed. `created_by='auto'` tagging on all auto-created edges and entities, `weight_history` audit logging for Hebbian modifications, strength caps (max 0.5 for auto edges), edge count bounds (MAX_EDGES_PER_NODE=20), and the Hebbian strengthening cap (MAX_STRENGTH_INCREASE=0.05/cycle with 30-day decay) collectively provide a defensible rollback surface. The selective cleanup path (`DELETE FROM causal_edges WHERE created_by='auto'`) is explicit and testable. CHK-030 and CHK-031 enforce provenance tracking in the verification checklist.

**Strength 3 — Phase B practical value**

R7 (anchor-aware thinning), R16 (encoding-intent capture), and S4 (spec folder hierarchy as retrieval structure) are well-scoped, scale-independent improvements that deliver measurable value at current corpus size. R7's acceptance criterion (Recall@20 within 10% of baseline) is conservative and verifiable. R16 is low-risk metadata enrichment behind a feature flag. S4 directly leverages existing spec folder structure for retrieval context. These three items collectively require 21-33h and carry LOW rollback difficulty. They represent the most reliable value delivery in the sprint.

---

## Recommendations

### Primary Recommendation: Split Sprint 6

UT-8 recommends restructuring Sprint 6 into two sequential sub-sprints:

**Sprint 6a — Practical Improvements (31-48h, LOW risk)**

Scope: Phase B (R7, R16, S4) + N3-lite consolidation (T002, T001d prerequisite)

Rationale: These items deliver clear value independent of graph scale, carry LOW to MEDIUM rollback difficulty, and have well-specified acceptance criteria. N3-lite is included in Sprint 6a because Hebbian strengthening and staleness detection provide graph maintenance value at any scale, and the provenance infrastructure (T001d) benefits all subsequent graph work.

Excluded from Sprint 6a: N2 centrality/community detection (T001a–c), R10 auto entity extraction (T005).

**Sprint 6b — Graph Sophistication (gated, 37-53h+ heuristic)**

Scope: N2 items 4-6 (T001a–c) + R10 auto entity extraction (T005)

Entry gate (REQUIRED before Sprint 6b begins):
1. Feasibility spike completed (8-16h): measures actual graph density, validates N2a/b/c algorithm behavior on real data, validates R10 FP rate on a sample of 50+ entities.
2. OQ-S6-001 resolved: edge density documented post-Sprint 1-5.
3. OQ-S6-002 resolved: centrality algorithm selected with evidence from spike.
4. REQ-S6-004 revisited: if graph density is insufficient for meaningful centrality signal, the 10% attribution mandate must be removed or replaced with a density-conditional acceptance criterion.

This structure protects Sprint 6a delivery (high confidence, practical value) while preventing Sprint 6b from beginning with unresolved prerequisites that are the documented source of execution risk.

---

### Secondary Recommendations

**Rec-S6-01: Decompose T002 (N3-lite) into sub-tasks**

Split T002 into T002a (contradiction scan, ~40 LOC heuristic), T002b (Hebbian strengthening, ~20 LOC), T002c (staleness detection, ~15 LOC), T002d (edge bounds enforcement), T002e (contradiction cluster surfacing). Each sub-component is independently testable and independently deferrable. This decomposition aligns T002 with the discipline applied to T001.

**Rec-S6-02: Promote Feasibility Spike to REQUIRED**

Move the Algorithm Feasibility Spike from RECOMMENDED to REQUIRED in the Definition of Ready (plan.md §2 Quality Gates). Add it as a P0 item in the pre-implementation checklist (CHK-004a). The spike collapses the primary source of estimation uncertainty before sprint commitment.

**Rec-S6-03: Specify relationship-type weighting for N2 attribution**

REQ-S6-004 requires >10% graph channel attribution without specifying how different edge types contribute. Define a weighting scheme (e.g., causal edges weight 1.0, support edges weight 0.7, derived_from edges weight 0.5) or clarify that all edge types are treated equally in attribution scoring. Without this specification, the 10% target is not unambiguously verifiable.

**Rec-S6-04: Resolve OQ-S6-002 before T001a-b implementation**

OQ-S6-002 asks which centrality algorithm is best suited for the memory graph topology, but T001a and T001b implement degree-delta and depth-signal algorithms — neither of which is betweenness, PageRank, or eigenvector centrality. Either close OQ-S6-002 by clarifying that T001a/b are the chosen algorithms (not betweenness/PageRank/eigenvector), or reconcile the open question with the implemented algorithms before sprint start.

**Rec-S6-05: Enforce T001d as hard gate before T002**

The tasks file lists T001d as a prerequisite for T002 via the `{T001d}` notation, but the PRE gate for N3-lite execution is not enforced at the checklist level. Add a CHK item (P0) requiring `weight_history` logging verified before any N3-lite Hebbian cycle runs.

**Rec-S6-06: Add density-conditional acceptance for REQ-S6-004**

If the sprint proceeds without splitting, modify REQ-S6-004 from a fixed ">10% attribution" mandate to "attribution >10% OR graph density <threshold documented with decision to defer". This prevents the retrieval pipeline from being forced to surface low-quality graph results to satisfy a fixed percentage target on a thin graph.

---

## Cross-References

| Reference | Location | Relevance |
|-----------|----------|-----------|
| Sprint 6 Spec | `007-sprint-6-graph-deepening/spec.md` | Source document for requirements, risks, open questions |
| Sprint 6 Plan | `007-sprint-6-graph-deepening/plan.md` | Effort estimates, architecture, rollback procedure |
| Sprint 6 Tasks | `007-sprint-6-graph-deepening/tasks.md` | Task decomposition, T001a-d, T002, T003-T007 |
| Sprint 6 Checklist | `007-sprint-6-graph-deepening/checklist.md` | 37 verification items, P0/P1/P2 distribution |
| Sprint 5 Spec | `006-sprint-5-pipeline-refactor/spec.md` | Blocking dependency for all Sprint 6 work |
| Sprint 1 Spec | `002-sprint-1-graph-signal-activation/spec.md` | R4 graph signal baseline; source of edge density data for R10 gating |
| PageIndex Analysis | `research/9 - analysis-pageindex-systems-architecture.md` | PI-A1 folder scoring as graph traversal pre-filter |
| PageIndex Patterns | `research/9 - recommendations-pageindex-patterns-for-speckit.md` | PI-A2 fallback chain for empty graph query results |
| PageIndex Tree Search | `research/9 - pageindex-tree-search-analysis.md` | Supporting evidence for S4 hierarchy traversal design |
| Sprint 5 UT Review | `research/11 - ultra-think-review-sprint-5-pipeline-refactor.md` | Prior UT analysis pattern; Sprint 5 findings inform Sprint 6 integration gaps |
| OQ-S6-001 | `spec.md §10` | Edge density — unresolved at spec time; gates R10 and N2 feasibility |
| OQ-S6-002 | `spec.md §10` | Centrality algorithm selection — unresolved; inconsistent with T001a/b algorithm choices |
| REQ-S6-004 | `spec.md §4` | N2 attribution >10% — central risk item; lacks relationship-type weighting specification |
| `fsrs.ts` | Codebase | Existing `computeGraphCentrality()` and `computeStructuralFreshness()` — N2 builds on this |

---

*Review produced from UT-8 analysis. Pre-implementation status — no code has been written for Sprint 6 at time of review.*

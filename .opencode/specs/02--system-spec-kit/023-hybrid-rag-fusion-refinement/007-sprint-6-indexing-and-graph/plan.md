---
title: "Implementation Plan: Sprint 6 — Indexing and Graph"
description: "Graph centrality, community detection, N3-lite consolidation, anchor-aware thinning, encoding-intent capture, auto entity extraction, and spec folder hierarchy."
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify | v2.2"
trigger_phrases:
  - "sprint 6 plan"
  - "indexing and graph plan"
  - "consolidation plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Sprint 6 — Indexing and Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Node.js MCP server |
| **Storage** | SQLite (better-sqlite3), FTS5, sqlite-vec |
| **Testing** | Vitest |

### Overview

This plan implements Sprint 6 — graph deepening and indexing optimization, **split into two sequential sub-sprints** following UT-8 review:

- **Sprint 6a — Practical Improvements (33-51h, LOW risk)**: R7 (anchor-aware thinning), R16 (encoding-intent), S4 (hierarchy), T001d (weight_history), N3-lite (consolidation). Delivers value at any graph scale — no graph-density dependency.
- **Sprint 6b — Graph Sophistication (37-53h heuristic, GATED)**: N2 (centrality/community detection), R10 (auto entity extraction). Entry gated on feasibility spike completion and graph density evidence.

Sprint 7 depends on Sprint 6a (not full Sprint 6). Sprint 6b executes only if the feasibility spike demonstrates sufficient graph density for centrality algorithms to add value.

> **ESTIMATION WARNING — SPRINT TOTAL**: Sprint 6a (33-51h) assumes lightweight heuristic implementations for N3-lite. Sprint 6b (37-53h heuristic, 80-150h production) is gated on feasibility spike. If production-quality ML-adjacent implementations are required for N2c and R10, the Sprint 6b range expands significantly. Confirm quality requirements before Sprint 6b entry.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
**Sprint 6a:**
- [ ] Sprint 5 pipeline refactor complete and exit gate passed
- [ ] Evaluation infrastructure operational (from Sprint 0)
- [ ] Checkpoint created before sprint start

**Sprint 6b (additional gates — do NOT block Sprint 6a):**
- [ ] Edge density measured (determines R10 gating)
- [ ] Algorithm feasibility spike completed (see note below)

> **REQUIRED PREREQUISITE FOR SPRINT 6b — Algorithm Feasibility Spike (8-16h)**: Conduct during Sprint 4-5 to validate N2c and R10 approaches on actual data before committing to Sprint 6b. This spike MUST determine: (a) whether Louvain is appropriate at current graph density, or whether connected components suffices; (b) whether rule-based entity extraction meets the <20% FP threshold on a representative sample. **Sprint 6b cannot begin without this spike completed.** Sprint 6a may proceed independently — it has no dependency on the feasibility spike.

### Definition of Done
- [ ] Sprint 6 exit gate passed — all requirements verified
- [ ] 14-22 new tests added and passing
- [ ] All existing tests still passing
- [ ] Active feature flag count <=6
- [ ] All health dashboard targets checked
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two sequential sub-sprints: Sprint 6a (practical, no graph-scale dependency) → Sprint 6b (graph sophistication, gated on feasibility spike)

### Key Components
- **Consolidation module** (Sprint 6a): N3-lite — weekly contradiction scan (~40 LOC), Hebbian edge strengthening (~20 LOC), staleness detection (~15 LOC)
- **Weight audit** (Sprint 6a): T001d weight_history logging for Hebbian rollback
- **Indexing pipeline** (Sprint 6a): R7 anchor-aware chunk thinning, R16 encoding-intent metadata capture
- **Spec-kit retrieval** (Sprint 6a): S4 spec folder hierarchy traversal for structured retrieval
- **Graph analysis module** (Sprint 6b, GATED): Centrality algorithms (degree-based), community detection, channel attribution scoring
- **Entity extraction module** (Sprint 6b, GATED): R10 auto entity extraction with density gating and `created_by='auto'` tagging

### Data Flow
1. **Sprint 6a**: T001d weight_history → N3-lite consolidation (weekly batch) | R7 anchor-aware thinning → R16 intent capture → S4 hierarchy traversal
2. **Sprint 6b (GATED)**: N2 centrality/community → graph scoring enhancement | R10 entity extraction (if density gating met)
3. **Exit**: Sprint 6a exit gate → Sprint 7 unblocked; Sprint 6b exit gate → optional additional graph value

### N3-lite Implementation Details
1. **Contradiction scan** (weekly): Find memory pairs with similarity >0.85, check for conflicting conclusions (~40 LOC)
   > **ESTIMATION WARNING**: ~40 LOC assumes heuristic approach (cosine similarity + keyword conflict check). Semantic accuracy >80% requires NLI model integration — effort 3-5x higher.
2. **Hebbian strengthening**: +0.05 per validation cycle, MAX_STRENGTH_INCREASE=0.05, 30-day decay of 0.1 (~20 LOC)
3. **Staleness detection** (weekly): Flag edges unfetched for 90+ days (~15 LOC)
4. **Edge growth bounds**: MAX_EDGES_PER_NODE=20, auto edges capped at strength=0.5, all auto-edges track `created_by`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Sprint 6a: Practical Improvements (R7, R16, S4, T001d, N3-lite) — 33-51h

- [ ] T001d: weight_history audit tracking — log weight changes for N3-lite Hebbian modifications (2-3h)
  - Dependency justification: REQUIRED before any N3-lite Hebbian cycle runs. Enables rollback independent of edge creation.
- [ ] R7: Implement anchor-aware chunk thinning (10-15h)
  - Dependency justification: requires indexing pipeline from Sprint 5 refactor; thinning logic reads anchor metadata added in earlier sprints.
- [ ] R16: Implement encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag (5-8h)
  - Dependency justification: extends index-time metadata; no blocking prerequisites beyond Sprint 5.
- [ ] S4: Implement spec folder hierarchy as retrieval structure (6-10h)
  - Dependency justification: requires spec folder metadata available from Sprint 0 indexing.
- [ ] N3-lite: Implement contradiction scan + Hebbian strengthening + staleness detection with edge caps (10-15h) {T001d}
  - N3-lite decomposed into T002a-T002e (see tasks.md) — each independently testable/deferrable.

### Sprint 6b: Graph Sophistication (N2, R10) — 37-53h heuristic (GATED)

> **Sprint 6b Entry Gates (ALL REQUIRED):**
> 1. Feasibility spike completed (8-16h)
> 2. OQ-S6-001 resolved (edge density documented)
> 3. OQ-S6-002 resolved (RESOLVED — T001a Graph Momentum/temporal degree delta + T001b causal depth signal selected as Sprint 6 baseline; Katz/PageRank/betweenness/eigenvector deferred pending Sprint 6b feasibility spike evidence; see spec.md OQ-S6-002)
> 4. REQ-S6-004 revisited (10% mandate removed or density-conditioned if graph is thin)

> **ESTIMATION WARNING — N2c**: Louvain/label propagation community detection on SQLite is research-grade. N2c listed at 12-15h; production quality requires 40-80h. Recommend evaluating connected-components heuristic first.
> **ESTIMATION WARNING — R10**: Entity extraction at <20% FP rate is an ML challenge. 12-18h assumes rule-based heuristics; ML-based accuracy requires 30-50h.

- [ ] N2 items 4-6: Implement graph centrality + community detection (25-35h)
  - N2a (Graph Momentum): temporal degree delta over 7-day window. Reference: sliding window degree tracking, no external library needed.
  - N2b (Causal Depth Signal): BFS/DFS max-depth traversal normalized by graph diameter. Reference: standard graph traversal.
  - N2c (Community Detection): start with connected components (BFS, ~20 LOC); only escalate to Louvain if connected-components provides insufficient separation. Louvain reference: `igraph` Python binding or `communities` npm package if available; expect SQLite adjacency-list export as input.
- [ ] R10: Implement auto entity extraction behind `SPECKIT_AUTO_ENTITIES` flag — gated on density <1.0 (12-18h)
  - Dependency justification: density gate requires Sprint 1 graph signal to be measured. Approach: rule-based noun-phrase extraction first (spaCy or `compromise` npm package); escalate to ML only if FP >20%.

### R10 Gating
- Only implement if Sprint 1 exit showed edge density <1.0 edges/node
- If density >=1.0, skip R10 and document decision

### Sprint Sequencing
- Sprint 6a and Sprint 6b are **sequential** — Sprint 6b cannot start until Sprint 6a exit gate passes AND Sprint 6b entry gates are satisfied
- Sprint 7 depends on Sprint 6a exit gate (not Sprint 6b)
- Sprint 6b may be deferred entirely if feasibility spike shows insufficient graph density
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Count |
|-----------|-------|-------|-------|
| Unit | T001d weight_history logging — verify before/after values, timestamps, and edge IDs recorded on weight change | Vitest | 1 test |
| Unit | T001d weight_history rollback — verify weights can be restored from history entries | Vitest | 1 test |
| Unit | R7 recall verification, anchor-aware thinning logic | Vitest | 2-3 tests |
| Unit | R10 entity extraction, FP rate, density gating | Vitest | 2-3 tests |
| Unit | N2 centrality computation, community detection | Vitest | 2-3 tests |
| Unit | N3-lite contradiction scan, Hebbian bounds/caps, staleness, 30-day decay verification | Vitest | 4-5 tests |
| Unit | S4 hierarchy traversal | Vitest | 1-2 tests |
| Integration | N2 attribution in end-to-end retrieval | Vitest | 1-2 tests |
| Integration | R7 + R16 combined indexing pipeline | Vitest | 1-2 tests |

**Total**: 14-22 new tests, estimated 400-550 LOC
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sprint 5 pipeline refactor | Internal | Green (assumed) | Blocks all Sprint 6 work |
| Evaluation infrastructure (Sprint 0) | Internal | Green (assumed) | Cannot verify metrics |
| Edge density measurement (Sprint 1) | Internal | Green (assumed) | Cannot determine R10 gating |
| better-sqlite3 | Internal | Green | Required for graph operations |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N3-lite edge mutations cause data corruption, R10 FP rate exceeds threshold, or flag count exceeds 6
- **Procedure**: Disable feature flags (`SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`), selectively remove auto-created edges via `created_by='auto'` tag, restore from pre-sprint checkpoint
- **Estimated time**: 12-20h (HIGH rollback difficulty due to edge mutations)
- **Difficulty**: HIGH — edge deletions from N3-lite are destructive; R10 auto-entities tagged with `created_by='auto'` for selective removal
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Sprint 6a (Practical) ──────────────────────────┐
  T001d weight_history (2-3h)                   │
  R7 (10-15h) ─┐                               │
  R16 (5-8h) ──┤── parallelizable              ├──► Sprint 6a Exit Gate ──► Sprint 7
  S4 (6-10h) ──┘                               │
  N3-lite (10-15h) {T001d}                      │
                                                 │
Sprint 6b (Graph, GATED) ──────────────────────  │
  [GATE: feasibility spike + OQ-S6-001/002]     │
  N2 centrality/community (25-35h)              ├──► Sprint 6b Exit Gate
  R10 entity extraction (12-18h)                │
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Sprint 6a | Sprint 5 exit gate | Sprint 6a exit gate |
| Sprint 6a Exit Gate | All Sprint 6a tasks | Sprint 7, Sprint 6b entry |
| Sprint 6b | Sprint 6a exit gate + feasibility spike + OQ-S6-001/002 resolved | Sprint 6b exit gate |
| Sprint 6b Exit Gate | All Sprint 6b tasks | None (optional additional value) |

**Note**: Sprint 6a and Sprint 6b are **sequential**. Items within Sprint 6a (R7, R16, S4) are parallelizable. Sprint 7 depends only on Sprint 6a exit gate.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

### Sprint 6a Effort

| Component | Complexity | Estimated Effort | Production-Quality Risk |
|-----------|------------|------------------|------------------------|
| T001d: weight_history | Low | 2-3h | Low risk |
| R7: Anchor-aware thinning | Medium | 10-15h | Low risk |
| R16: Encoding-intent | Low | 5-8h | Low risk |
| S4: Spec folder hierarchy | Low-Medium | 6-10h | Low risk |
| N3-lite: Consolidation | Medium | 10-15h | Contradiction: 3-5x if semantic NLI |
| **Sprint 6a Total** | | **33-51h** | |

### Sprint 6b Effort (GATED)

| Component | Complexity | Estimated Effort | Production-Quality Risk |
|-----------|------------|------------------|------------------------|
| N2 (items 4-6): Centrality + community | High | 25-35h | N2c: up to 80h if Louvain required |
| R10: Entity extraction (gated) | Medium-High | 12-18h | 30-50h if ML-based NER |
| **Sprint 6b Total (heuristic)** | | **37-53h** | |
| **Sprint 6b Total (production)** | | **80-150h** | If N2c + R10 require ML |

**Note**: Checkpoint recommended before sprint start due to HIGH rollback difficulty. Sprint 6a may proceed immediately. Sprint 6b requires feasibility spike and quality tier confirmation (heuristic vs. production) before entry.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Checkpoint created before sprint start
- [ ] Edge density measured (R10 gating decision)
- [ ] Feature flags configured: `SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`
- [ ] All existing tests verified passing before changes
- [ ] Current feature flag count documented (must be <=6 post-sprint)

### Rollback Procedure
1. **Immediate**: Disable feature flags — `SPECKIT_CONSOLIDATION`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENCODING_INTENT`
2. **Selective cleanup**: Remove auto-created edges via `created_by='auto'` query
3. **Selective cleanup**: Remove auto-extracted entities via `created_by='auto'` query
4. **Full rollback**: Restore from pre-sprint checkpoint if selective cleanup insufficient
5. **Verify rollback**: Run full test suite + eval metrics comparison

### Data Reversal
- **Has data migrations?** Yes — N3-lite modifies edge strengths; R10 creates new entity nodes/edges
- **Reversal procedure**: `created_by` provenance field enables selective removal of all auto-created/modified edges and entities. Full checkpoint restore available as fallback.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References

Builds on PageIndex integration from Sprints 2-3 (PI-A1 folder scoring, PI-A2 fallback chain).

- **PI-A1 (Sprint 2 — DocScore aggregation)**: Consider folder-level scoring as a pre-filter before graph traversal in Sprint 6b. Folder scores established in Sprint 2 can narrow the graph candidate set, reducing centrality computation overhead.
- **PI-A2 (Sprint 3 — Fallback chain)**: Graph queries returning empty results (low-centrality or unpopulated community clusters) should route into the Sprint 3 fallback chain rather than returning empty-handed. Coordinate with Sprint 6b N2 implementation to emit a fallback signal when graph channel returns no results.

Research evidence: See research documents `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder.
<!-- /ANCHOR:pageindex-xrefs -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Plan**: See `../plan.md`

---

<!--
LEVEL 2 PLAN — Phase 7 of 8
- Core + L2 addendums (Phase Dependencies, Effort, Enhanced Rollback)
- Sprint 6: Graph deepening + indexing optimization
- Split into Sprint 6a (33-51h, LOW risk) + Sprint 6b (37-53h, GATED on feasibility spike)
- UT-8 amendments: feasibility spike promoted to REQUIRED, phases restructured as sequential sub-sprints
- HIGH rollback difficulty — checkpoint recommended
-->

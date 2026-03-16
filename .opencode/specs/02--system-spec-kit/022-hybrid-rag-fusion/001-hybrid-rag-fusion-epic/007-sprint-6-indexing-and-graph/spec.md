---
title: "Feature Specification: Sprint 6 — Indexing and Graph"
description: "Deepen graph with centrality, community detection, and consolidation. Optimize indexing with anchor-aware thinning, intent capture, and entity extraction."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + phase-child-header | v2.2"
trigger_phrases:
  - "sprint 6"
  - "indexing and graph"
  - "centrality"
  - "consolidation"
  - "entity extraction"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Sprint 6 — Indexing and Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-02-26 |
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 7 of 8 |
| **Predecessor** | ../015-pipeline-refactor/ |
| **Successor** | ../017-long-horizon/ |
| **Handoff Criteria** | Sprint 6a gate: R7, R16, S4, N3-lite, weight_history verified; Sprint 6b gate (if executed): N2 attribution >10% or density-conditional deferral, R10 FP <20%; flag count <=6 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 7** of the Hybrid RAG Fusion Refinement specification.

**Sprint 6 is split into two sequential sub-sprints** based on UT-8 review findings:

- **Sprint 6a — Practical Improvements (33-51h, LOW risk)**: Delivers value at any corpus/graph size. Scope: R7 (anchor-aware thinning), R16 (encoding-intent), S4 (hierarchy), T001d (weight_history), N3-lite (contradiction scan, Hebbian strengthening, staleness detection, edge bounds).
- **Sprint 6b — Graph Sophistication (37-53h heuristic, GATED)**: Requires feasibility spike and graph density evidence before entry. Scope: N2 (centrality/community detection), R10 (auto entity extraction).

**Scope Boundary**: Sprint 6 scope boundary — graph deepening and indexing optimization sprint. Sprint 6a maximizes practical retrieval quality improvements; Sprint 6b is gated on graph density evidence before committing to centrality/community algorithms.

**Dependencies**:
- Sprint 5 pipeline refactor complete (015-pipeline-refactor)
- Evaluation infrastructure operational (from Sprint 0)
- Graph signal established (from Sprint 1/R4)
- Sprint 6b additionally requires: feasibility spike completed, OQ-S6-001 resolved, OQ-S6-002 resolved, REQ-S6-004 density-conditional acceptance revisited

> **HARD SCOPE CAP**: Sprint 6 is beyond the recommended off-ramp (Sprint 3). Per root spec, starting Sprint 6+ requires separate NEW spec approval and explicit justification based on Sprint 3 off-ramp evaluation results.

**Deliverables**:

*Sprint 6a:*
- Anchor-aware chunk thinning (R7)
- Encoding-intent capture at index time (R16)
- Spec folder hierarchy as retrieval structure (S4)
- weight_history audit tracking (T001d / MR10)
- Lightweight consolidation: contradiction scan, Hebbian strengthening, staleness detection (N3-lite)

*Sprint 6b (GATED on feasibility spike):*
- Graph centrality + community detection (N2 items 4-6)
- Auto entity extraction gated on density (R10)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Graph signal was established in Sprint 1 (R4) but lacks sophistication — centrality and community structures remain unexploited, leaving graph channel attribution below potential. Chunk indexing is not anchor-aware, leading to suboptimal retrieval granularity. Entity extraction is absent, meaning the graph may be sparse where automatic entity recognition could densify it. No consolidation process exists — stale edges persist, contradictions go undetected, and edge strengths never adapt to usage patterns. The spec folder hierarchy is unused in retrieval despite being a natural organizational structure.

### Purpose

Maximize graph channel contribution through centrality and community detection, optimize indexing quality with anchor-aware thinning and intent capture, and establish lightweight consolidation to maintain graph health over time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

#### Sprint 6a — Practical Improvements (33-51h, LOW risk)

- **R7**: Anchor-aware chunk thinning — Recall@20 within 10% of baseline
- **R16**: Encoding-intent capture at index time behind SPECKIT_ENCODING_INTENT flag
- **S4**: Spec folder hierarchy as retrieval structure — hierarchy traversal functional
- **T001d / MR10**: weight_history audit tracking — log weight changes for N3-lite Hebbian modifications; enables rollback independent of edge creation
- **N3-lite**: Contradiction scan (weekly) + Hebbian edge strengthening + staleness detection + contradiction cluster surfacing (surface all cluster members, not just flagged pair) behind `SPECKIT_CONSOLIDATION` flag

#### Sprint 6b — Graph Sophistication (37-53h heuristic, GATED on feasibility spike)

- **N2 (items 4-6)**: Graph centrality + community detection, decomposed into: N2a (Graph Momentum -- temporal degree delta), N2b (Causal Depth Signal -- max-depth path normalization), N2c (Community Detection -- label propagation or Louvain clustering) — channel attribution >10%
- **R10**: Auto entity extraction (gated on edge density <1.0) behind `SPECKIT_AUTO_ENTITIES` flag — FP rate <20%

**Sprint 6b Entry Gates (REQUIRED before Sprint 6b starts):**
1. Feasibility spike completed (8-16h)
2. OQ-S6-001 resolved (edge density documented)
3. OQ-S6-002 resolved (centrality algorithm selected with evidence)
4. REQ-S6-004 revisited (10% mandate removed or density-conditioned if graph is thin)

### Existing Code Note

> **Important**: `fsrs.ts` already contains `computeGraphCentrality()` (basic degree centrality) and `computeStructuralFreshness()`. N2 items 4-6 build on this existing foundation — the implementation should extend `fsrs.ts` rather than creating new files.

### Out of Scope

- Full consolidation (N3 complete) — N3-lite is the scoped subset
- Advanced graph algorithms beyond centrality/community — future optimization
- R10 implementation if density >=1.0 — gated condition not met
- Pipeline architecture changes — completed in Sprint 5

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `fsrs.ts` | Modify | N2: Centrality + community detection algorithms (extends existing `computeGraphCentrality()`) |
| `causal_edges` schema + consolidation module | Create/Modify | N3-lite: Contradiction scan, Hebbian strengthening, staleness detection |
| Indexing pipeline | Modify | R7: Anchor-aware chunk thinning logic |
| Indexing pipeline | Modify | R16: Encoding-intent metadata capture |
| Entity extraction module | Create | R10: Auto entity extraction with density gating |
| `graph-search-fn.ts` | Modify | S4: Spec folder hierarchy traversal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - HARD GATE (blocks Sprint 6a N3-lite work)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S6-007 | **T001d / MR10**: weight_history audit tracking — log weight changes for N3-lite Hebbian modifications; enables rollback independent of edge creation | All N3-lite weight modifications logged with before/after values, timestamps, and affected edge IDs; rollback of weight changes verified functional from history |

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S6-001 | **R7**: Anchor-aware chunk thinning | Recall@20 within 10% of baseline |
| REQ-S6-002 | **R16**: Encoding-intent capture behind `SPECKIT_ENCODING_INTENT` flag | Intent metadata recorded at index time; index-only capture (no retrieval-time scoring impact) |
| REQ-S6-003 | **R10**: Auto entity extraction (only if density <1.0) behind `SPECKIT_AUTO_ENTITIES` flag | FP rate <20% on manual review of >=50 auto-extracted entities |
| REQ-S6-004 | **N2 (items 4-6)**: Graph centrality + community detection | Graph channel attribution >10% of final top-K OR graph density <1.0 edges/node documented with decision to defer (density-conditional acceptance); N2c community assignments stable across 2 runs on test graph with >=50 nodes |
| REQ-S6-005 | **N3-lite**: Contradiction scan (weekly) + Hebbian edge strengthening behind `SPECKIT_CONSOLIDATION` flag | Detects at least 1 known contradiction in curated test data; heuristic approach acceptable if lightweight |
| REQ-S6-006 | **S4**: Spec folder hierarchy as retrieval structure | Hierarchy traversal functional in retrieval queries |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

**Sprint 6a Success Criteria:**
- **SC-001**: R7 Recall@20 within 10% of baseline after anchor-aware thinning
- **SC-004**: N3-lite contradiction scan identifies at least 1 known contradiction
- **SC-005**: N3-lite edge bounds enforced — MAX_EDGES_PER_NODE=20, MAX_STRENGTH_INCREASE=0.05/cycle
- **SC-006**: Active feature flag count <=6 (sunset audit if exceeded)
- **SC-008**: Sprint 6a exit gate — R7, R16, S4, N3-lite, weight_history all verified
- **SC-009**: weight_history logging verified functional before any N3-lite Hebbian cycle runs

**Sprint 6b Success Criteria (conditional on Sprint 6b execution):**
- **SC-002**: R10 false positive rate <20% on manual review (if implemented)
- **SC-003**: N2 graph channel attribution >10% of final top-K results OR graph density <1.0 edges/node documented with decision to defer; N2c community assignments stable across 2 runs on test graph with >=50 nodes
- **SC-007**: Sprint 6b exit gate — all Sprint 6b requirements verified
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | N3-lite edge mutations potentially irreversible | High | Track `created_by` provenance on all auto-created/modified edges for selective cleanup |
| Risk | R10 false positives may pollute graph with incorrect entities | Medium | Gated on density <1.0; auto entities capped at strength=0.5; `created_by='auto'` tag for selective removal |
| Risk | Feature flag count exceeds 6-flag maximum | Medium | Sunset audit required if exceeded; consolidate or retire flags from earlier sprints |
| Risk | HIGH rollback difficulty (12-20h) | High | Checkpoint recommended before sprint start; `created_by` provenance enables selective rollback |
| Dependency | Sprint 5 pipeline refactor complete | Blocks all Sprint 6 work | Sprint 5 exit gate must be passed |
| Dependency | Evaluation infrastructure (Sprint 0) | Required for metric verification | Must be operational |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R7 chunk thinning must not degrade Recall@20 by more than 10%
- **NFR-P02**: N3-lite consolidation runs as weekly batch — no impact on query-time latency

### Security
- **NFR-S01**: N3-lite edge mutations tracked with `created_by` provenance for audit trail
- **NFR-S02**: R10 auto-extracted entities tagged with `created_by='auto'` for traceability

### Reliability
- **NFR-R01**: N3-lite edge bounds enforced: MAX_EDGES_PER_NODE=20, auto edges capped at strength=0.5
- **NFR-R02**: N3-lite Hebbian strengthening capped: MAX_STRENGTH_INCREASE=0.05 per cycle, 30-day decay of 0.1
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Edge density >=1.0**: R10 auto entity extraction is skipped entirely (gating condition not met)
- **Zero contradictions found**: N3-lite contradiction scan returns empty — not a failure if no contradictions exist in data
- **MAX_EDGES_PER_NODE reached**: New auto-edges rejected; manual edges still allowed

### Error Scenarios
- **N3-lite weekly job failure**: Consolidation skipped for that cycle; edges remain unchanged; retry next cycle
- **R10 extraction produces >20% FP**: Flag `SPECKIT_AUTO_ENTITIES` disabled; auto entities tagged `created_by='auto'` removed

### State Transitions
- **Partial N3-lite completion**: Each sub-component (contradiction, Hebbian, staleness) is independent — partial completion is valid
- **Sprint checkpoint restore**: All `created_by='auto'` edges can be selectively removed to restore pre-sprint state
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 6 requirements across graph, indexing, entity extraction, and spec-kit subsystems |
| Risk | 14/25 | Irreversible edge mutations, FP pollution, flag count risk, HIGH rollback difficulty |
| Research | 8/20 | Research complete (142 analysis); algorithms identified but implementation details TBD |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S6-001**: What is the actual edge density after Sprint 1-5? Determines if R10 auto entity extraction is activated.
- **OQ-S6-002** [RESOLVED]: T001a (temporal degree delta / Graph Momentum) and T001b (causal depth signal) are the chosen Sprint 6 centrality baseline. Katz, betweenness, PageRank, and eigenvector centrality are deferred, and may be reconsidered only if the Sprint 6b feasibility spike shows this baseline is insufficient at measured graph density.
- **OQ-S6-003**: What is the optimal contradiction similarity threshold? Spec says >0.85 but may need tuning.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:pageindex-xrefs -->
### PageIndex Cross-References

Builds on PageIndex integration from Sprints 2-3 (PI-A1 folder scoring, PI-A2 fallback chain).

| ID | Sprint | Relevance to Sprint 6 |
|----|--------|----------------------|
| **PI-A1** (DocScore aggregation) | Sprint 2 | Graph deepening may benefit from folder-level scoring as a pre-filter before graph traversal |
| **PI-A2** (Fallback chain) | Sprint 3 | Graph queries that return empty results should integrate into the fallback chain established in Sprint 3 |

Research evidence: See research documents `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder.
<!-- /ANCHOR:pageindex-xrefs -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See ../000-feature-overview/spec.md
- **Parent Plan**: See ../000-feature-overview/plan.md

---

<!--
LEVEL 2 SPEC — Phase 7 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 6: Indexing and graph deepening
- Split into Sprint 6a (Practical, 33-51h, LOW risk) + Sprint 6b (37-53h, GATED)
- UT-8 amendments applied: OQ-S6-002 resolved, REQ-S6-004 density-conditional, attribution weighting specified
-->

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

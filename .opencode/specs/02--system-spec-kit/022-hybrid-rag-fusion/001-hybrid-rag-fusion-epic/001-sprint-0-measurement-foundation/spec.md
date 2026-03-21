---
title: "Feature Specification: Sprint 0 — Measurement Foundation"
description: "Fix graph channel (0% hit rate), chunk collapse dedup, co-activation hub domination, and establish evaluation infrastructure with BM25 baseline."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
trigger_phrases:
  - "sprint 0"
  - "measurement foundation"
  - "graph ID fix"
  - "eval infrastructure"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Sprint 0 — Measurement Foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-26 |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 1 of 10 |
| **Predecessor** | None (first phase) |
| **Successor** | ../002-sprint-1-graph-signal-activation/spec.md |
| **Handoff Criteria** | Sprint 0 exit gate — graph hit rate >0%, chunk dedup verified, BM25 baseline MRR@5 recorded, baseline metrics for 100+ queries with diversity requirement (>=5 per intent type, >=3 complexity tiers, >=30 manually curated), active feature flags <=6 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 1** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 0 scope boundary — BLOCKING foundation sprint. All downstream sprints depend on the evaluation infrastructure and bug fixes delivered here.

**Dependencies**:
- None (Sprint 0 is the first phase — no predecessors)

**Deliverables**:
- Functional graph channel (G1 ID format fix)
- Chunk dedup fix (G3 all code paths)
- Fan-effect divisor for co-activation hub domination (R17)
- Evaluation infrastructure with 5-table schema (R13-S1)
- BM25-only baseline measurement (G-NEW-1)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The graph channel is completely broken — 0% hit rate in production due to `mem:${edgeId}` string IDs being compared against numeric memory IDs. The chunk collapse dedup logic only runs on the `includeContent=true` path, allowing duplicate chunks to surface in default search mode (`includeContent=false`). Co-activation scoring suffers from hub domination where highly-connected memories dominate results regardless of query relevance. Most critically, zero evaluation metrics exist — every tuning decision is pure speculation.

### Purpose

Establish measurable retrieval quality by fixing silent failures blocking all downstream improvement, and create the evaluation infrastructure that gates every subsequent sprint's changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **G1**: Fix graph channel ID format — convert `mem:${edgeId}` to numeric memory IDs at BOTH locations (`graph-search-fn.ts` lines 110 AND 151)
- **G3**: Fix chunk collapse conditional — dedup on ALL code paths including `includeContent=false`
- **R17**: Add fan-effect divisor to co-activation scoring to reduce hub domination
- **R13-S1**: Evaluation infrastructure — separate SQLite DB with 5-table schema, logging hooks, core metrics (MRR@5, NDCG@10, Recall@20, Hit Rate@1) + 5 diagnostic metrics (Inversion Rate, Constitutional Surfacing Rate, Importance-Weighted Recall, Cold-Start Detection Rate, Intent-Weighted NDCG)
- **G-NEW-1**: BM25-only baseline comparison and measurement
- **A2**: Full-context ceiling evaluation — theoretical quality ceiling metric (LLM-based, not production path)
- **B7**: Quality proxy formula — automated regression detection metric
- **D4**: R13 observer effect mitigation — eval logging overhead health check

### Out of Scope

- R4 (typed-degree channel) — requires Sprint 0 evaluation infrastructure first; Sprint 1 scope
- All scoring/fusion changes — require eval infrastructure to validate; Sprint 2+ scope
- R11 (learned relevance feedback) — requires R13 running 2+ eval cycles; Sprint 4 scope
- Pipeline refactoring — Sprint 5 scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `graph-search-fn.ts` | Modify | G1: Fix ID format from `mem:${edgeId}` to numeric |
| `memory-search.ts` | Modify | G3: Fix chunk collapse to run on all code paths |
| `co-activation.ts` | Modify | R17: Add fan-effect divisor to co-activation scoring |
| `memory-save.ts` | Modify | TM-02: SHA256 content-hash fast-path dedup before embedding generation |
| `speckit-eval.db` | Create | R13-S1: Evaluation database with 5-table schema |
| Eval handler files | Create | R13-S1: Logging hooks for search/context/trigger handlers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S0-001 | **G1**: Fix graph channel ID format — convert `mem:${edgeId}` to numeric memory IDs | Graph hit rate > 0% in retrieval telemetry; verified at BOTH locations in `graph-search-fn.ts` (lines ~110 AND ~151); cross-ref: CHK-010, T001 |
| REQ-S0-002 | **G3**: Fix chunk collapse conditional — dedup on all code paths including `includeContent=false` | No duplicate chunk rows in default search mode; tested via both `includeContent=true` and `includeContent=false` paths; cross-ref: CHK-011, T002 |
| REQ-S0-003 | **R13-S1**: Evaluation DB with 5-table schema (see parent spec.md §4.1 for full schema DDL: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth`, `eval_metric_snapshots`) + logging hooks + core metric computation | Baseline metrics (MRR@5, NDCG@10, Recall@20, Hit Rate@1) + 5 diagnostic metrics computed for at least 100 queries (50 minimum for initial baseline; >=100 required for BM25 contingency decision). Schema validated against parent spec §4.1 DDL. Full-context ceiling metric (A2) recorded. Quality proxy formula (B7) operational. |
| REQ-S0-007 | **Eval-the-eval validation**: Hand-calculate MRR@5 for 5 randomly selected queries and compare to R13 computed values | Hand-calculated MRR@5 matches R13 output within ±0.01 for all 5 queries; discrepancies resolved before BM25 contingency decision (REQ-052 in parent spec) |
| REQ-S0-004 | **G-NEW-1**: BM25-only baseline comparison | BM25 baseline MRR@5 recorded and compared to hybrid. Ground truth corpus satisfies diversity requirement: >=30 manually curated non-trigger-phrase queries, >=5 queries per intent type, >=3 query complexity tiers. BM25 contingency decision requires statistical significance (p<0.05, paired t-test or bootstrap CI) on >=100 diverse queries. |

### P0 - Blockers (MUST complete) — Additional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S0-006 | **TM-02**: Content-hash fast-path dedup in `memory-save.ts` — SHA256 hash check BEFORE embedding generation; O(1) check rejects exact duplicates in same `spec_folder` | Exact duplicate saves rejected without embedding generation; no false positives on distinct content |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S0-005 | **R17**: Fan-effect divisor in co-activation scoring | Hub domination reduced in co-activation results |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Graph hit rate > 0% (from 0% baseline) after G1 fix
- **SC-002**: No duplicate chunk rows appear in default search mode after G3 fix
- **SC-003**: Baseline MRR@5, NDCG@10, Recall@20, Hit Rate@1 + 5 diagnostic metrics computed and stored for 100+ queries
- **SC-004**: BM25 baseline MRR@5 recorded; BM25 contingency decision made
- **SC-005**: Sprint 0 exit gate — all 4 P0 requirements verified

### Exit Gate: Ground Truth Diversification (HARD REQUIREMENT)

Ground truth corpus MUST include:
- >=30 manually curated natural-language queries (NOT derived from trigger phrases — avoids circular validation bias per R-008)
- >=15 queries covering: graph relationship queries ("what decisions led to X?"), temporal queries ("what was discussed last week?"), cross-document queries ("how does A relate to B?"), and hard negatives
- >=5 queries per intent type, >=3 query complexity tiers (simple single-concept, moderate multi-concept, complex cross-document)
- >=100 total diverse queries for BM25 contingency decision (synthetic + manual combined)
- Statistical significance requirement: BM25 vs hybrid MRR@5 comparison must achieve p<0.05 (paired t-test or bootstrap 95% CI) before any threshold-based roadmap decision

**Rationale**: The BM25 contingency decision (the most consequential decision in the plan) must not be based on systematically biased data. Synthetic ground truth derived from trigger phrases evaluates a system that retrieves partly via trigger phrases, inflating MRR@5 scores. 50 queries provide confidence intervals too wide for the >=80%/50-80%/<50% threshold decision. This elevates R-008 and R-011 to hard exit gates.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | G1 fix reveals sparse graph — few or no edges exist | Low | Not a failure — informs Sprint 1 density decision; R4 correctly returns zero |
| Risk | R13-S1 is largest item (20-28h) — scope creep possible | Medium | Strict 5-table schema; defer advanced features to R13-S2 (Sprint 4) |
| Risk | BM25 >= 80% of hybrid MRR@5 — challenges multi-channel approach | High | Decision matrix defined: PAUSE if >=80%, rationalize if 50-80%, PROCEED if <50% |
| Dependency | None | N/A | Sprint 0 is first phase — no external dependencies |

### BM25 Contingency Decision Protocol

When BM25 baseline results fall in the 50-80% range ("rationalize" path):
- **Decision owner**: Project lead (user) — not automated
- **Required artifact**: Written rationale document explaining why multi-channel retrieval provides sufficient value over BM25-only, citing specific query categories where hybrid outperforms
- **Decision timeline**: Within 1 sprint cycle (before Sprint 1 implementation begins)
- **Output**: Go/No-Go decision recorded in sprint exit documentation with supporting evidence
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Eval logging adds ≤5ms p95 to search latency — measured before/after (D4 observer effect check)
- **NFR-P02**: G1 fix must not degrade graph search performance

### Security
- **NFR-S01**: Eval DB (`speckit-eval.db`) MUST be separate from primary DB — no observer effect
- **NFR-S02**: No eval queries touch the primary database

### Reliability
- **NFR-R01**: G1 and G3 fixes must not break existing 158+ tests
- **NFR-R02**: Eval infrastructure degrades gracefully — search continues if eval DB is unavailable
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Empty graph after G1 fix**: Correct behavior — R4 produces zero scores for all memories; graph channel returns empty results
- **N=0 queries for BM25 baseline**: Requires minimum 50 queries with ground truth (>=100 for BM25 contingency decision). Synthetic generation from trigger phrases SUPPLEMENTS but does not replace the >=30 manually curated non-trigger-phrase queries required by Exit Gate §5

### Error Scenarios
- **Eval DB creation failure**: Search continues unaffected; eval logging disabled with warning
- **Zero graph edges found**: Graph search returns empty — not an error post-G1 fix

### State Transitions
- **Partial R13-S1 completion**: Schema without hooks = usable but no automatic logging; hooks can be added incrementally
- **BM25 contingency trigger**: If BM25 >= 80% of hybrid — PAUSE S3-S7 (preserve S1/S2 work which may still improve over BM25), escalate to project lead. Aligns with root spec §8 contingency definition.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 5 files across 3 subsystems (graph, search, eval), schema creation |
| Risk | 12/25 | BM25 contingency could alter roadmap; eval DB is new subsystem |
| Research | 8/20 | Research complete (142 analysis); code locations identified |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S0-001**: What is the actual edge count in the graph after G1 fix? Will determine if Sprint 1 R4 has meaningful data to work with.
- **OQ-S0-002**: ~~Synthetic ground truth quality — are trigger phrases sufficient for initial baseline, or do we need manual relevance annotations?~~ **RESOLVED** by REQ-S0-004: >=30 manually curated non-trigger-phrase queries required; synthetic generation supplements but does not replace manual curation.
- **OQ-S0-003**: G-NEW-2 pre-analysis — what agent consumption patterns dominate in practice? Findings may reshape ground truth query design for representativeness.
<!-- /ANCHOR:questions -->

---

### PageIndex Integration

**PI-A5 — Verify-Fix-Verify for Memory Quality**: **DEFERRED TO SPRINT 1** per Ultra-Think Review REC-09. TM-02 (T054, SHA256 content-hash dedup) remains in Sprint 0.

Bounded quality loop after embedding generation: verify (cosine self-similarity >0.7, title-content alignment >0.5), fix (re-generate with enhanced metadata), re-verify. Max 2 retries; flag `quality_flag=low` on exhaustion. Extends R-001 (eval framework) and R-002 (quality metrics). Effort: 12-16h, Medium risk.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See ../000-feature-overview/spec.md
- **Parent Plan**: See ../000-feature-overview/plan.md

---

<!--
LEVEL 2 SPEC — Phase 1 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 0: BLOCKING foundation sprint
-->

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

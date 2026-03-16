---
title: "Feature Specification: Sprint 7 — Long Horizon"
description: "Address scale-dependent features (memory summaries, content generation, entity linking), complete evaluation infrastructure, and evaluate INT8 quantization."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
trigger_phrases:
  - "sprint 7"
  - "long horizon"
  - "memory summaries"
  - "entity linking"
  - "R5 evaluation"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Sprint 7 — Long Horizon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1-P3 |
| **Status** | Completed |
| **Created** | 2026-02-26 |
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 8 of 8 |
| **Predecessor** | ../016-indexing-and-graph/ |
| **Successor** | None (final phase) |
| **Handoff Criteria** | N/A (program completion) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 8** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 7 scope boundary — final sprint addressing scale-dependent optimizations, evaluation infrastructure completion, and deferred-item decisions. All items are parallelizable with no internal dependencies.

> **GATING AND OPTIONALITY NOTE**: Sprint 7 is entirely P2/P3 priority and gated on >5K memories (current system estimate: <2K at typical spec-kit deployment). All items are optional and should only be pursued if Sprint 0-6 metrics demonstrate clear need. R8 (memory summary generation / PageIndex integration) is particularly conditional — the tree-navigation approach may not be compatible with spec-kit's latency requirements (500ms p95 hard limit). S5 (cross-document entity linking) is similarly gated — only activates if >1K active memories with embeddings OR >50 verified entities in the entity catalog; below threshold, document as skipped. Do not begin Sprint 7 unless Sprint 0-6 exit gates are fully passed and scale thresholds are confirmed.

**Dependencies**:
- Sprint 6a graph deepening complete (016-indexing-and-graph) — depends on S6a only, not S6b
- Evaluation infrastructure operational (from Sprint 0, enhanced in Sprint 4)
- Full pipeline operational (from Sprint 5 refactor)

> **HARD SCOPE CAP**: Sprint 7 is beyond the recommended off-ramp (Sprint 3). Per root spec, starting Sprint 7+ requires separate NEW spec approval and explicit justification based on Sprint 3 off-ramp evaluation results.

**Deliverables**:
- Memory summary generation gated on >5K memories (R8)
- Smarter memory content generation from markdown (S1)
- Cross-document entity linking (S5)
- Full reporting + ablation study framework (R13-S3)
- R5 INT8 quantization evaluation decision
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Memory summaries are only valuable at scale (>5K memories) — implementing them prematurely adds overhead without benefit. Content generation from markdown is suboptimal, producing lower-quality memory content than possible. Cross-document entity links are absent, limiting the graph's ability to connect related concepts across documents. The R13 evaluation infrastructure lacks ablation studies and full reporting, making it difficult to attribute improvements to specific changes. The R5 INT8 quantization decision was deferred pending scale data — a final evaluation is needed.

### Purpose

Address scale-dependent optimizations that become valuable at maturity, complete the evaluation infrastructure with full reporting and ablation capabilities, and make the final deferred R5 INT8 quantization decision based on measured criteria.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R8**: Memory summaries (gated on >5K memories) behind SPECKIT_MEMORY_SUMMARIES flag — summary pre-filtering reduces search space. Note: the PageIndex tree-navigation approach used in summary generation must be validated against the 500ms p95 latency limit before activation.
- **S1**: Smarter memory content generation from markdown — improved content quality
- **S5**: Cross-document entity linking (gated on >1K active memories OR >50 verified entities) behind `SPECKIT_ENTITY_LINKING` flag — entity links established across documents
- **R13-S3**: Full reporting + ablation studies — complete evaluation capability
- **R5**: Evaluate INT8 quantization need — decision documented based on activation criteria (>10K memories OR >50ms latency OR >1536 dimensions)
- **DEF-014**: Resolve structuralFreshness() disposition — implement, defer, or document as out-of-scope (deferred from parent spec)

### Out of Scope

- R8 implementation if <5K memories — gated condition not met
- R5 INT8 implementation unless activation criteria met (>10K memories OR >50ms latency OR >1536 dimensions)
- New retrieval channels — all channel work completed in prior sprints
- Pipeline architecture changes — completed in Sprint 5

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/memory-summaries.ts` | Create | R8: Memory summary generation module |
| `mcp_server/handlers/memory-search.ts` | Modify | R8: Pre-filter integration into search pipeline |
| `mcp_server/lib/parsing/memory-parser.ts` | Modify | S1: Improved markdown-to-content conversion |
| `mcp_server/lib/search/entity-linker.ts` | Create | S5: Cross-document entity resolution and linking |
| `mcp_server/lib/storage/causal-edges.ts` | Modify | S5: Entity link graph connections |
| `mcp_server/lib/telemetry/retrieval-telemetry.ts` | Modify | R13-S3: Full reporting integration |
| `mcp_server/lib/eval/ablation-framework.ts` | Create | R13-S3: Ablation study framework |
| `mcp_server/lib/search/vector-index.ts` | Modify | R5: INT8 quantization evaluation (if criteria met) |

> **Note**: Paths are based on current architecture; new file locations to be confirmed at implementation start.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (must complete OR get user approval to defer)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S7-004 | **R13-S3**: Full reporting + ablation studies | Complete evaluation capability with ablation framework |

### P2 - Optional (can defer with documented reason)

(No P2 requirements — R13-S3 promoted to P1 as capstone evaluation infrastructure)

### P3 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S7-001 | **R8**: Memory summaries (only if >5K memories) behind `SPECKIT_MEMORY_SUMMARIES` flag | Summary pre-filtering reduces search space |
| REQ-S7-002 | **S1**: Smarter memory content generation from markdown | Content quality improved (manual review) |
| REQ-S7-003 | **S5**: Cross-document entity linking (gated on >1K active memories OR >50 verified entities) behind `SPECKIT_ENTITY_LINKING` flag | Entity links established across documents (if scale threshold met); otherwise document as skipped |
| REQ-S7-005 | **R5**: Evaluate INT8 quantization need — implement ONLY if >10K memories OR >50ms latency OR >1536 dimensions | Decision documented with activation criteria |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R13-S3 full reporting operational — ablation study framework functional
- **SC-002**: R8 gating verified — only implemented if >5K total memories with embeddings in the database (see scale gate definition below)
- **SC-003**: S1 content generation matches template schema >=95% (automated validation with manual review fallback for edge cases)
- **SC-004**: S5 entity links established across documents (if scale threshold met)
- **SC-005**: R5 decision documented with activation criteria measurements
- **SC-006**: Program completion — all health dashboard targets reviewed
- **SC-007**: Final feature flag audit — sunset all sprint-specific flags from Sprints 0-7

### Scale Gate Definition

> **SCALE GATE CLARITY (R8)**: The "5K memories" threshold for R8 activation means **5,000 active memories with successful embeddings** in `memory_index` (i.e., `(is_archived IS NULL OR is_archived = 0)` AND `embedding_status = 'success'`). Pending/failed embeddings and archived rows do not count. The threshold must be confirmed by a direct database query: `SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'`.

> **SCALE GATE CLARITY (S5)**: S5 (cross-document entity linking) activates only if **>1,000 active memories with successful embeddings** (`SELECT COUNT(*) FROM memory_index WHERE (is_archived IS NULL OR is_archived = 0) AND embedding_status = 'success'` returns >1K) **OR >50 verified entities** exist in the entity catalog. Below either threshold, S5 should be documented as skipped with the measured values recorded as decision evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R8 overhead not justified at small scale | Low | Gated on >5K memories — no implementation cost if threshold not met |
| Risk | S5 overlaps with R10 (auto entity extraction from Sprint 6) | Medium | Coordinate with R10 output — S5 links existing entities, R10 creates them |
| Risk | R5 INT8 quantization may cause 5.32% recall loss | High | Only implement if activation criteria met; use custom quantized BLOB (NOT sqlite-vec's vec_quantize_i8); preserve Spec 140's KL-divergence calibration note |
| Risk | S5 low ROI at sub-1K scale | Low | Gated on >1K active memories OR >50 verified entities — skip and document if threshold not met |
| Risk | R10 FP rate unconfirmed from Sprint 6 | Medium | T003 fallback: restrict S5 to manually verified entities only; exclude R10 auto-entities if FP rate unknown |
| Dependency | Sprint 6a graph deepening complete (S6a only, not S6b) | Blocks Sprint 7 | Sprint 6a exit gate must be passed |
| Dependency | Evaluation infrastructure (Sprint 0/4) | Required for R13-S3 | Must be operational |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R8 summary pre-filtering must reduce search space (measured reduction in candidate set)
- **NFR-P02**: R5 INT8 quantization only considered if search latency >50ms

### Security
- **NFR-S01**: R5 INT8 quantization must use custom quantized BLOB — NOT sqlite-vec's `vec_quantize_i8`
- **NFR-S02**: R5 must preserve KL-divergence calibration from Spec 140 analysis

### Reliability
- **NFR-R01**: R8 degrades gracefully if memory count drops below 5K after activation
- **NFR-R02**: R13-S3 ablation framework must not interfere with production retrieval
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Memory count <5K**: R8 memory summaries skipped entirely (gating condition not met)
- **Memory count >10K OR latency >50ms OR dimensions >1536**: R5 INT8 activation criteria met — proceed with evaluation
- **Memory count <1K AND verified entities <50**: S5 cross-document entity linking skipped entirely (scale gate not met) — document measured values as decision evidence
- **Zero cross-document entities**: S5 linking returns empty — not a failure if no cross-document entities exist

### Error Scenarios
- **R5 INT8 recall loss >5.32%**: Do not implement — document decision and rationale
- **R13-S3 ablation study with insufficient data**: Defer ablation until sufficient eval cycles accumulated
- **S5 conflicts with R10 entities**: S5 links only verified entities; R10 auto-entities excluded from S5 linking if FP rate unknown. **Fallback if R10 FP rate not confirmed from Sprint 6**: restrict S5 to manually verified entities only; do not include any R10 auto-entities. If no manually verified entities exist and scale gate not met, document S5 as skipped

### State Transitions
- **R8 activated then memory count drops below 5K**: Summaries become stale — disable flag, summaries persist but are not regenerated
- **Program completion**: All sprint-specific feature flags audited for sunset
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 5 items but all are independent; moderate LOC per item |
| Risk | 8/25 | R5 recall loss is main risk; other items are low-risk |
| Research | 6/20 | R5 evaluation criteria defined; S5/R8 design straightforward |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S7-001**: Current memory count — does it exceed 5K threshold for R8 activation?
- **OQ-S7-002**: Current search latency, memory count, and embedding dimensions — do any meet R5 INT8 activation criteria?
- ~~**OQ-S7-003**: How does S5 cross-document entity linking interact with R10 auto-extracted entities from Sprint 6?~~ **RESOLVED**: Addressed in Edge Cases section 8 — S5 links only verified entities; R10 auto-entities excluded if FP rate unknown; fallback restricts to manually verified entities only.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:pageindex-xrefs -->
### PageIndex Cross-References

Builds on PageIndex integration from Sprints 0, 5 (PI-A5 quality verification, PI-B1 tree thinning).

| ID | Sprint | Relevance to Sprint 7 |
|----|--------|----------------------|
| **PI-A5** (Verify-fix-verify) | Sprint 0 | Long-horizon quality monitoring should incorporate the verify-fix-verify pattern for ongoing memory quality — as the system accumulates memories at scale, the V-F-V loop ensures degraded memories are detected, corrected, and re-verified continuously |
| **PI-B1** (Tree thinning) | Sprint 5 | Long-horizon context loading benefits from thinning for large accumulated spec folders — with R8 memory summaries gated on >5K memories, the tree thinning pattern established in Sprint 5 provides a complementary pruning strategy for oversized context trees |

These are cross-references only — Sprint 7 does not own PI-A5 or PI-B1. Integration points should be considered during R8 memory summary design and R13-S3 quality reporting but are not blocking requirements for the Sprint 7 exit gate.

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
LEVEL 2 SPEC — Phase 8 of 8 (FINAL)
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 7: Long horizon — scale-dependent optimizations + eval completion
- All items parallelizable
- R5 activation criteria: >10K memories OR >50ms latency OR >1536 dimensions
-->

---

## Phase Navigation

- Successor: 018-deferred-features

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

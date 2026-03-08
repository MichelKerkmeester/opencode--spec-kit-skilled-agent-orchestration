---
title: "Feature Specification: Core RAG Sprints 0 to 8 Consolidation"
description: "Consolidated specification covering former sprint folders 010 through 018."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + consolidation-merge | v2.2"
trigger_phrases:
  - "core rag sprints 0 to 8 spec"
  - "sprint 0 to 8 consolidated spec"
importance_tier: "critical"
contextType: "implementation"
---
# 006 Core RAG Sprints 0 to 8 - Consolidated spec

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + consolidation-merge | v2.2 -->

This file consolidates `spec.md` from sprint folders 006 through 018.

Source folders:
- `006-measurement-foundation/spec.md`
- `011-graph-signal-activation/spec.md`
- `012-scoring-calibration/spec.md`
- `013-query-intelligence/spec.md`
- `014-feedback-and-quality/spec.md`
- `015-pipeline-refactor/spec.md`
- `016-indexing-and-graph/spec.md`
- `017-long-horizon/spec.md`
- `018-deferred-features/spec.md`

---

## 006-measurement-foundation

Source: `006-measurement-foundation/spec.md`

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
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None (first phase) |
| **Successor** | ../011-graph-signal-activation/ |
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
- **Parent Spec**: See `../000-feature-overview/spec.md`
- **Parent Plan**: See `../000-feature-overview/plan.md`

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

## 011-graph-signal-activation

Source: `011-graph-signal-activation/spec.md`

---
title: "Feature Specification: Sprint 1 — Graph Signal Activation"
description: "Activate typed-weighted degree as 5th RRF channel and measure graph signal contribution."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
trigger_phrases:
  - "sprint 1"
  - "graph signal"
  - "degree channel"
  - "R4"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Sprint 1 — Graph Signal Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete (Conditional Proceed) |
| **Created** | 2026-02-26 |
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 2 of 8 |
| **Predecessor** | ../006-measurement-foundation/ |
| **Successor** | ../013-query-intelligence/ |
| **Handoff Criteria** | R4 MRR@5 delta >+2% absolute, edge density measured, no single memory >60% presence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 2** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 1 scope boundary — graph signal activation. Adds the 5th RRF channel (typed-weighted degree) and measures graph density to inform future sprints.

**Dependencies**:
- Sprint 0 exit gate MUST be passed (graph channel functional, eval infrastructure operational, BM25 baseline recorded)

**Parallelization Note**: Sprint 1 and Sprint 2 have a **soft dependency** (not hard). Sprint 2's scope (R18 embedding cache, N4 cold-start boost, G2 investigation, score normalization) has zero technical dependency on Sprint 1's deliverables. Both depend only on Sprint 0 outputs. The sole coordination point is that S2's score normalization should incorporate R4's degree scores if S1 completes first — normalization can proceed without them and be retroactively updated.

**Build-gate vs Enable-gate**: R4 (typed-degree channel) can be **built and unit-tested** during Sprint 0 — it does not require eval infrastructure to write the code. However, R4 MUST NOT be **enabled** (flag activated) until S0 exit gate passes and R13 metrics are available for dark-run validation. This distinction allows overlapping development.

**Deliverables**:
- Typed-weighted degree computation as 5th RRF channel (R4)
- Edge density measurement from R13 data
- Agent-as-consumer UX analysis and consumption instrumentation (G-NEW-2)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The graph channel is now functional after Sprint 0's G1 fix, but it contributes only through graph-search results (traversal). The typed-weighted degree score — measuring how well-connected a memory is via causal, derivation, and support edges — is the most orthogonal signal available (low correlation with vector similarity and FTS5). Edge density is unknown, which blocks decisions about whether R10 (auto entity extraction) needs to be escalated to increase graph coverage.

### Purpose

Activate the graph's structural connectivity signal as a 5th RRF channel, measure its contribution to retrieval quality via the Sprint 0 evaluation infrastructure, and establish edge density as a key health metric for future graph-deepening decisions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R4**: Typed-weighted degree as 5th RRF channel with MAX_TYPED_DEGREE=15, MAX_TOTAL_DEGREE=50, DEGREE_BOOST_CAP=0.15, constitutional memory exclusion
- **A7**: Co-activation boost strength increase — raise multiplier from 0.1x to 0.25-0.3x to make graph signal investment visible in results
- **Edge density measurement**: Compute edges/node ratio from R13 eval data
- **G-NEW-2**: Agent-as-consumer UX analysis and consumption instrumentation
- **PI-A5**: Verify-fix-verify memory quality loop (deferred from Sprint 0 per REC-09) — REQ-057

### Out of Scope

- R10 (auto entity extraction) — Sprint 6 scope; may be escalated based on density measurement
- N2 (graph centrality + community detection) — Sprint 6 scope
- N3-lite (contradiction scan) — Sprint 6 scope
- Scoring calibration changes — Sprint 2 scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `graph-search-fn.ts` | Modify | R4: Typed-weighted degree computation SQL + normalization |
| `rrf-fusion.ts` | Modify | R4: Integration as 5th RRF channel |
| `hybrid-search.ts` | Modify | R4: Degree score integration into search pipeline |
| `co-activation.ts` | Modify | A7: Increase co-activation boost multiplier from 0.1x to 0.25-0.3x |
| `trigger-matcher.ts` | Modify | TM-08: Add CORRECTION and PREFERENCE signal categories |
| `memory-save.ts` | Modify | PI-A5: Post-save quality scoring, auto-fix loop, rejection logging |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S1-001 | **R4**: Typed-weighted degree as 5th RRF channel with configurable parameters: MAX_TYPED_DEGREE=15, MAX_TOTAL_DEGREE=50, DEGREE_BOOST_CAP=0.15, constitutional exclusion | R4 dark-run passes — no single memory >60% of results; MRR@5 delta >+2% absolute; degree computation verified against known test graph with expected scores; cross-ref CHK-010, CHK-011, T001, T002 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S1-002 | Edge density measurement from R13 eval data | Edge density (edges/node) computed; R10 escalation decision documented if density < 0.5; density metric logged to `speckit-eval.db` for trend tracking; cross-ref CHK-062, T003 |
| REQ-S1-003 | **G-NEW-2**: Agent consumption instrumentation + initial UX analysis | Consumption patterns logged; initial pattern report generated with >=5 identified patterns; instrumentation captures query text, result count, selected result IDs, and ignored result IDs; cross-ref T004 |
| REQ-S1-004 | **A7**: Co-activation boost strength increase — raise base multiplier from 0.1x to 0.25-0.3x with configurable coefficient | Graph channel effective contribution >=15% at hop 2 (up from ~5%). Dark-run verified. |

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S1-005 | **TM-08**: Expand importance signal vocabulary in `trigger-matcher.ts` — add CORRECTION signals ("actually", "wait", "I was wrong") and PREFERENCE signals ("prefer", "like", "want") from true-mem's 8-category vocabulary | CORRECTION and PREFERENCE signal categories recognised and classified correctly by trigger extractor |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R4 MRR@5 delta >+2% absolute over Sprint 0 baseline. Density-conditional: if edge density < 0.5 (T003), gate evaluates R4 correctness (returns zero for unconnected memories) rather than absolute MRR@5 lift.
- **SC-002**: No single memory appears in >60% of R4 dark-run results (hub domination check)
- **SC-003**: Edge density measured and R10 escalation decision recorded
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Graph too sparse (density < 0.5) — R4 has minimal effect | Medium | Escalate R10 to earlier sprint; R4 still correct (returns zero when no edges). **Exit gate path**: If density < 0.5, CHK-060 evaluates R4 implementation correctness (unit tests + zero-return behavior) rather than requiring +2% MRR@5 lift. Record as "R4 signal limited by graph sparsity — R10 escalation triggered." |
| Risk | Preferential attachment — well-connected memories dominate via R4 | High | MAX_TOTAL_DEGREE=50 cap, DEGREE_BOOST_CAP=0.15, constitutional exclusion |
| Risk | R4 dark-run fails (MRR@5 delta < +2%) | Medium | Keep R4 behind flag; investigate sparse graph or weight miscalibration |
| Dependency | Sprint 0 exit gate | Blocking | Sprint 0 must pass before Sprint 1 begins |
| Dependency | R13-S1 eval infrastructure | Required | Needed for dark-run measurement and density computation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R4 degree computation adds <10ms p95 to search latency (dark-run overhead budget)
- **NFR-P02**: Degree cache invalidated only on graph mutation (not per-query)

### Security
- **NFR-S01**: Constitutional memories excluded from degree boost (prevents artificial inflation)

### Reliability
- **NFR-R01**: R4 behind feature flag `SPECKIT_DEGREE_BOOST` — graduated to ON by default (set `SPECKIT_DEGREE_BOOST=false` to disable)
- **NFR-R02**: R4 gracefully returns 0 if graph has no edges for a memory
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Zero edges for a memory**: R4 returns 0 — no boost applied; correct behavior
- **MAX_TOTAL_DEGREE exceeded**: Score capped at DEGREE_BOOST_CAP=0.15 — prevents unbounded boost
- **Constitutional memory with many edges**: Excluded from degree boost to prevent domination

### Error Scenarios
- **Graph DB unavailable**: R4 returns 0 for all memories; other 4 channels continue normally
- **Cache invalidation race**: Stale degree score used — acceptable for short window; refreshed on next mutation

### State Transitions
- **R4 flag disabled mid-search**: In-progress search completes with flag state at query start; next search uses updated flag
- **Edge density < 0.5**: R10 escalation decision triggered but R4 still operational (just low-impact)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 3 files, degree SQL + normalization + RRF integration |
| Risk | 10/25 | Preferential attachment risk mitigated by caps; sparse graph possible |
| Research | 8/20 | R4 formula defined in research; edge type weights specified |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S1-001**: Actual edge density after Sprint 0 — will R4 have meaningful data, or is the graph too sparse? Cross-ref: density-conditional exit path in SC-001 and CHK-060.
- **OQ-S1-002**: Optimal edge type weights — research specifies caused=1.0, derived_from=0.9, etc. — do these need tuning based on actual data?
<!-- /ANCHOR:questions -->

---

### PageIndex Integration

**Recommendation**: PI-A3 — Pre-Flight Token Budget Validation

**Description**: Before assembling the final result set for a search response, compute the total token count across all candidate results and validate it against the configured token budget. If the candidate set exceeds the budget, truncate to the highest-scoring results that fit within budget (greedy highest-first). If `includeContent=true` and a single result alone exceeds the budget, return a summary of that result instead of full content. All budget overflow events are logged for observability.

**Rationale**: Sprint 1 introduces the 5th RRF channel (R4 typed-degree) and increases co-activation boost strength (A7), both of which expand the result set's potential scoring surface and can cause previously marginal results to surface. This increases the risk of token budget overflow in downstream consumers. Sprint 1 is therefore the natural point to install a pre-flight budget guard — it closes the latent overflow risk before Sprint 2's scoring calibration work makes result composition even more dynamic. PI-A3 is low-risk (4-6h, additive logic, no schema changes) and extends the R-004 baseline scoring benchmarks already established by Sprint 0's evaluation infrastructure.

**Extends Existing Recommendations**:
- **R-004 (baseline scoring benchmarks)**: Token budget overflow events are logged to the eval infrastructure as a new diagnostic, extending the benchmark dataset with token-cost-per-query signal.

**Constraints**:
- Truncation strategy: highest-scoring results first (greedy, not round-robin).
- `includeContent=true` single-result overflow: return summary (not truncated raw content, not an error).
- Log all overflow events with: query_id, candidate_count, total_tokens, budget_limit, truncated_to_count.
- Effort: 4-6h, Low risk.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../000-feature-overview/spec.md`
- **Parent Plan**: See `../000-feature-overview/plan.md`
- **Predecessor**: See `../006-measurement-foundation/`

---

<!--
LEVEL 2 SPEC — Phase 2 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 1: Graph signal activation via R4 typed-degree channel
-->

---

## Phase Navigation

- Successor: `012-scoring-calibration`

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

## 012-scoring-calibration

Source: `012-scoring-calibration/spec.md`

---
title: "Feature Specification: Sprint 2 — Scoring Calibration"
description: "Resolve dual scoring magnitude mismatch, add cold-start boost, embedding cache, and investigate double intent weighting."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
trigger_phrases:
  - "sprint 2"
  - "scoring calibration"
  - "embedding cache"
  - "cold-start boost"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Sprint 2 — Scoring Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (Conditional Proceed) |
| **Created** | 2026-02-26 |
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 3 of 8 |
| **Predecessor** | ../006-measurement-foundation/ (direct dependency — Sprint 1 is a parallel sibling, not a predecessor) |
| **Successor** | ../013-query-intelligence/ |
| **Handoff Criteria** | Cache hit >90%, N4 dark-run passes, G2 resolved, score distributions normalized to [0,1] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 3** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 2 scope boundary — scoring calibration. Resolves the 15:1 magnitude mismatch between RRF and composite scoring, adds embedding cache for instant rebuild, introduces cold-start boost for new memory visibility, and investigates the G2 double intent weighting anomaly.

**Dependencies**:
- Sprint 0 exit gate MUST be passed (graph channel functional, eval infrastructure operational, BM25 baseline recorded)
- R13-S1 eval infrastructure operational (Sprint 0 deliverable)
- **NOTE: Sprint 2 does NOT depend on Sprint 1.** Sprint 1's deliverables (R4 typed-degree, edge density) have zero technical overlap with Sprint 2's scope (R18, N4, G2, score normalization). The previous dependency on Sprint 1 exit gate is removed.

**Parallelization Note**: Sprint 1 and Sprint 2 can execute in parallel after Sprint 0 exit gate. Sprint 2's scope (R18 embedding cache, N4 cold-start boost, G2 double intent weighting, score normalization) has zero technical dependency on Sprint 1's deliverables (R4 typed-degree channel, edge density measurement). Both depend only on Sprint 0 outputs. Parallel execution saves 3-5 weeks on critical path. The sole coordination point: if Sprint 1 completes first, Sprint 2's score normalization (Phase 4) should incorporate R4 degree scores — but normalization can proceed without them and be updated retroactively.

**Deliverables**:
- Embedding cache for instant rebuild (R18)
- Cold-start boost with exponential decay (N4)
- G2 double intent weighting resolution
- Score normalization — both RRF and composite in [0,1]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The dual scoring systems have a ~15:1 magnitude mismatch — RRF fusion scores range ~[0, 0.07] while composite scores range ~[0, 1]. This means composite scoring dominates purely due to scale, not quality, making the RRF fusion contribution nearly invisible. New memories are systematically invisible because FSRS temporal decay penalizes recent items (designed for spaced repetition, not retrieval). Re-indexing unchanged content requires full embedding regeneration, wasting API costs and time. Additionally, the G2 double intent weighting anomaly — where intent weights are applied twice in the pipeline — has unknown status (bug or intentional design).

### Purpose

Calibrate the scoring pipeline so both systems contribute proportionally to final ranking, ensure newly indexed memories are discoverable within 48 hours, eliminate unnecessary embedding regeneration costs, and resolve the G2 anomaly to prevent silent scoring distortion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R18**: Embedding cache — `embedding_cache` table with content_hash + model_id key for instant rebuild
- **N4**: Cold-start boost — exponential decay (`0.15 * exp(-elapsed_hours / 12)`) behind feature flag `SPECKIT_NOVELTY_BOOST`
- **G2**: Double intent weighting investigation — determine if bug or intentional design, fix or document
- **Score normalization**: Both RRF and composite scoring output normalized to [0,1] range
- **FUT-5**: RRF K-value sensitivity investigation — grid search over K parameter to find optimal fusion constant

### Out of Scope

- R1 (MPAB chunk aggregation) — Sprint 4 scope
- R11 (learned relevance feedback) — Sprint 4 scope; requires R13 2 eval cycles
- R15 (query complexity router) — Sprint 3 scope
- Pipeline refactoring — Sprint 5 scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `embedding_cache` table | Create | R18: Cache table in primary DB |
| `composite-scoring.ts` | Modify | N4: Cold-start boost + score normalization + TM-01: interference penalty |
| `hybrid-search.ts` | Modify | G2: Double intent weighting investigation/fix |
| `intent-classifier.ts` | Modify | G2: Intent weighting application point (1 of 3 codebase locations) |
| `adaptive-fusion.ts` | Modify | G2: Intent weighting application point (1 of 3 codebase locations) |
| `rrf-fusion.ts` | Modify | Score normalization to [0,1] |
| `memory_index` schema | Modify | TM-01: Add `interference_score` column |
| `fsrs-scheduler.ts` | Modify | TM-03: Classification-based decay multipliers by context_type and importance_tier |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S2-001 | **R18**: Embedding cache with content_hash + model_id key | Cache hit rate >90% on re-index of unchanged content; cache lookup adds <1ms p95; stale entries never served (content_hash key guarantees); cross-ref CHK-010, CHK-060, T001 |
| REQ-S2-002 | **N4**: Cold-start boost with exponential decay (12h half-life) behind `SPECKIT_NOVELTY_BOOST` flag | New memories (<48h) surface when relevant; dark-run passes (old results not displaced); boost formula verified at key timestamps (0h, 12h, 24h, 48h); no conflict with FSRS temporal decay; cross-ref CHK-011, CHK-061, T002 |
| REQ-S2-003 | **G2**: Double intent weighting investigation and resolution | Resolved: fixed (if bug) or documented as intentional design with rationale; investigation traces all 3 code locations (hybrid-search.ts, intent-classifier.ts, adaptive-fusion.ts); cross-ref CHK-012, CHK-062, T003 |
| REQ-S2-004 | Score normalization — both RRF and composite in [0,1] | Both scoring systems produce outputs in [0,1] range; 15:1 mismatch eliminated; MRR@5 not regressed after normalization; cross-ref CHK-013, CHK-063, T004 |
| REQ-S2-005 | **FUT-5**: RRF K-value sensitivity investigation — grid search K ∈ {20, 40, 60, 80, 100} | Optimal K identified and documented; MRR@5 delta measured per K value |
| REQ-S2-006 | **TM-01**: Interference scoring — add `interference_score` column to `memory_index`; compute at index time by counting memories with cosine similarity > 0.75 (initial calibration value, subject to empirical tuning after 2 eval cycles) in same `spec_folder`; apply as `-0.08 * interference_score` (initial calibration coefficient, subject to empirical tuning after 2 eval cycles) in `composite-scoring.ts` behind `SPECKIT_INTERFERENCE_SCORE` flag. Both 0.75 and -0.08 should be named constants, configurable via environment variables. | Interference penalty active; high-similarity memory clusters show reduced individual scores; no false penalties on distinct content |
| REQ-S2-007 | **TM-03**: Classification-based decay in `fsrs-scheduler.ts` — decay policy multipliers by `context_type` (decisions: no decay, research: 2x stability, implementation/discovery/general: standard) and by `importance_tier` (constitutional/critical: no decay, important: 1.5x, normal: standard, temporary: 0.5x) | Decay rates differentiated per type/tier matrix; constitutional/critical memories never decay; temporary memories decay faster |

**Future Work:**
- **FUT-S2-001**: Empirical validation of TM-01 parameters (0.75 similarity threshold, -0.08 penalty coefficient) after 2 R13 eval cycles. Both values are initial calibration targets, not final — tuning required based on observed interference score distributions and false positive rates.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Embedding cache hit rate >90% on re-index of unchanged content
- **SC-002**: N4 dark-run passes — new memories visible, highly relevant older results not displaced
- **SC-003**: G2 resolved — either fixed or documented as intentional with rationale
- **SC-004**: Score distributions normalized — both RRF and composite in [0,1] range
- **SC-005**: FUT-5 K-value sensitivity investigation completed — optimal K identified and MRR@5 delta measured per K value
- **SC-006**: TM-01 interference scoring active — high-similarity memory clusters show reduced individual scores; no false penalties on distinct content
- **SC-007**: TM-03 classification-based decay operational — constitutional/critical memories never decay; temporary memories decay faster; decisions context_type does not decay
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | N4 conflicts with FSRS temporal decay — double-penalizing or double-boosting | Medium | Apply N4 BEFORE FSRS; verify no interaction with cap at 0.95 |
| Risk | G2 is intentional design — fixing it changes ranking behavior | Medium | Dark-run before/after comparison; document decision with evidence |
| Risk | R18 cache invalidation — stale embeddings used after content change | Low | Cache key includes content_hash; any content change = cache miss |
| Risk | Score normalization changes ranking order | Medium | Dark-run comparison; verify MRR@5 not regressed |
| Dependency | Sprint 0 exit gate | Blocking | Sprint 0 must pass before Sprint 2 begins (Sprint 1 is NOT a dependency — parallel execution possible) |
| Dependency | R13-S1 eval infrastructure | Required | Needed for dark-run comparisons |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R18 cache lookup adds <1ms p95 to re-index path
- **NFR-P02**: N4 cold-start computation adds <2ms p95 to search (dark-run overhead budget)
- **NFR-P03**: Score normalization adds negligible overhead (<1ms)

### Security
- **NFR-S01**: Embedding cache stores only content_hash (not raw content) — no sensitive data duplication
- **NFR-S02**: N4 behind feature flag `SPECKIT_NOVELTY_BOOST` — disabled by default

### Reliability
- **NFR-R01**: Cache miss = normal embedding generation (graceful fallback)
- **NFR-R02**: N4 disabled state = no behavior change from pre-Sprint-2
- **NFR-R03**: G2 fix/documentation does not break existing 158+ tests
- **NFR-P04**: Log N4 boost and TM-01 interference score distributions at query time, sampled at 5% (P2)
- **NFR-R04**: R18 cache size soft warning at 10,000 entries (log warning, not hard limit)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **R18 content_hash collision**: Astronomically unlikely with SHA-256; if occurs, embedding regenerated (correct but wasteful)
- **N4 memory exactly 48h old**: Boost = `0.15 * exp(-48/12)` = ~0.0028 — effectively zero; smooth transition
- **N4 + constitutional memory**: Constitutional tier guarantee applied AFTER N4; no conflict
- **N4 + high baseline score**: When pre-boost composite score exceeds 0.80, the 0.95 cap clips the N4 boost asymmetrically — a memory at 0.90 receives only +0.05 (not +0.15). This is expected behavior: high-scoring memories already surface at top; N4 primarily benefits lower-scoring new memories that would otherwise be invisible.
- **N4 + TM-01 interaction**: N4 boost is applied BEFORE TM-01 interference penalty in the composite scoring pipeline. This means the boost establishes a floor for new memories, and TM-01 then reduces the score for dense clusters. The net effect for a new memory in a dense cluster is: boost first, penalize second. Both effects are independent and may partially cancel.

### Error Scenarios
- **R18 cache table missing**: Embedding regeneration proceeds normally; no search impact
- **N4 memory with unknown creation time**: Default to no boost (elapsed_hours = infinity)
- **G2 removal causes ranking regression**: Roll back G2 fix; document as intentional design

### State Transitions
- **R18 model_id change**: All cache entries for old model are misses; gradual replacement
- **N4 flag toggled mid-search**: In-progress search completes with flag state at query start
- **Score normalization applied retroactively**: Only affects live scoring; historical R13 metrics use original scales (documented)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 7 features, 5+ files, 1 new table + 1 new column, 8 phases |
| Risk | 10/25 | N4/FSRS interaction, G2 uncertainty, TM-01 false positives, N4+TM-01 signal conflict |
| Research | 6/20 | R18 schema defined in research; N4 formula specified; G2 needs investigation |
| **Total** | **30/70** | **Level 2** (upper range) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S2-001**: G2 double intent weighting — is it a bug or intentional design? Sprint 2 investigation will resolve this. Cross-ref: OQ-004 in root spec.
- **OQ-S2-002**: N4 interaction with FSRS — does the cold-start boost correctly complement (not conflict with) temporal decay? Requires empirical verification via dark-run.
- **OQ-S2-003**: Score normalization method — linear scaling vs. min-max vs. z-score? Research recommends linear to [0,1] but empirical comparison may be needed. **BLOCKING**: Must be resolved before Phase 4 begins. Add Phase 3 subtask for empirical normalization method selection.
<!-- /ANCHOR:questions -->

---

### PageIndex Integration

**Recommendation**: PI-A1 — Folder-Level Relevance Scoring via DocScore Aggregation

**Description**: Compute a folder-level relevance score by aggregating the individual memory scores within each spec folder. The formula is:

```
FolderScore(F) = (1 / sqrt(M + 1)) * SUM(MemoryScore(m) for m in F)
```

where M is the number of memories in the folder. The damping factor `1/sqrt(M+1)` prevents large folders from dominating purely by volume. This enables a two-phase retrieval strategy: first select the highest-scoring folders, then execute within-folder search against those candidates — reducing the effective search space and improving precision for spec-scoped queries.

**Rationale**: Sprint 2 is the correct sprint for PI-A1 for two reasons. First, the score normalization work in Sprint 2 (eliminating the 15:1 RRF-vs-composite magnitude mismatch and producing [0,1]-range outputs from both systems) is a prerequisite for meaningful folder-level aggregation — FolderScore only makes sense when the underlying MemoryScore values are on a comparable scale. Second, PI-A1 is pure scoring logic added to the existing reranker pipeline, which is the primary subject of Sprint 2. It does not require new infrastructure, tables, or channels, making it low-risk (4-8h).

**Extends Existing Recommendations**:
- **R-006 (weight rebalancing)**: FolderScore provides a new aggregation layer where folder-level weights can be tuned in future sprints, extending the weight rebalancing surface.
- **R-007 (scoring pipeline)**: PI-A1 is added as a post-reranker stage in the scoring pipeline — folder scores are computed after individual reranking and before final result assembly, fitting cleanly into the R-007 pipeline model.

**Constraints**:
- Formula: `FolderScore = (1/sqrt(M+1)) * SUM(MemoryScore(m))` — damping factor is mandatory to prevent volume bias.
- Two-phase retrieval is the target usage pattern: folder selection then within-folder search.
- Pure scoring addition — no schema changes, no new tables, no new channels.
- Effort: 4-8h, Low risk.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../000-feature-overview/spec.md`
- **Parent Plan**: See `../000-feature-overview/plan.md`
- **Predecessor**: See `../006-measurement-foundation/` (direct dependency — Sprint 1 is a parallel sibling)

---

<!--
LEVEL 2 SPEC — Phase 3 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 2: Scoring calibration — R18 cache, N4 cold-start, G2 investigation, normalization
- Off-ramp: Recommended minimum viable stop after Sprint 2+3 (phases 3+4)
-->

---

## Phase Navigation

- Predecessor: `011-graph-signal-activation`

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

## 013-query-intelligence

Source: `013-query-intelligence/spec.md`

---
title: "Feature Specification: Sprint 3 — Query Intelligence"
description: "Add query complexity routing, evaluate Relative Score Fusion alternative, and enforce channel diversity."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
trigger_phrases:
  - "sprint 3"
  - "query intelligence"
  - "complexity router"
  - "RSF fusion"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Sprint 3 — Query Intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (5 PASS / 2 Conditional) |
| **Created** | 2026-02-26 |
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 4 of 8 |
| **Predecessor** | ../011-graph-signal-activation/, ../012-scoring-calibration/ |
| **Successor** | ../014-feedback-and-quality/ |
| **Handoff Criteria** | R15 p95 <30ms simple, RSF Kendall tau computed, R2 precision within 5% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 4** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 3 scope boundary — query-level intelligence. Routes queries by complexity for speed, evaluates RSF as RRF alternative, enforces minimum channel representation in fusion results.

**Dependencies**:
- Sprint 1 AND Sprint 2 exit gates (S3's query router needs R4's 5th channel from S1 + calibrated scores from S2)

**Deliverables**:
- Query complexity router with 3-tier classification (R15)
- Relative Score Fusion evaluation with all 3 variants (R14/N1)
- Channel min-representation constraint (R2)
- Off-ramp evaluation checkpoint
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

All queries use the full 5-channel pipeline regardless of complexity, meaning simple lookups (e.g., trigger phrase matches) pay the same latency cost as complex semantic queries. No alternative to RRF fusion has been evaluated — RRF was adopted without comparison data. Post-fusion results have no channel diversity guarantee, allowing a single dominant channel to monopolize top-k results.

### Purpose

Route simple queries to fewer channels for speed improvement, evaluate RSF as a principled RRF alternative with full shadow comparison, and enforce minimum channel representation to guarantee retrieval diversity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R15**: Query complexity router with 3 tiers (simple/moderate/complex), minimum 2 channels
- **R14/N1**: Relative Score Fusion — all 3 fusion variants (single-pair, multi-list, cross-variant) evaluated in parallel with RRF
- **R2**: Channel min-representation constraint (post-fusion, quality floor 0.2, only when channel returned results)
- **R15-ext**: Confidence-based result truncation — adaptive top-K cutoff based on score confidence gap
- **FUT-7**: Dynamic token budget allocation — context size varies by query complexity tier

### Out of Scope

- R12 (query expansion) — Sprint 5 scope; R12+R15 mutual exclusion enforced there
- R6 (pipeline refactor) — Sprint 5 scope; requires stable scoring first
- R11 (learned relevance feedback) — Sprint 4 scope; requires R13 eval cycles
- Any scoring weight changes — Sprint 2 locked those values

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `query-classifier.ts` (new) | Create | R15: Query classifier + tier-based channel routing |
| `rrf-fusion.ts` | Modify | R14/N1: RSF implementation alongside RRF (all 3 variants) |
| `hybrid-search.ts` | Modify | R2: Channel min-representation enforcement post-fusion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S3-001 | **R15**: Query complexity router with 3 tiers (simple/moderate/complex), minimum 2 channels | p95 latency <30ms for simple queries. Flag: `SPECKIT_COMPLEXITY_ROUTER` |
| REQ-S3-002 | **R14/N1**: RSF parallel to RRF — all 3 fusion variants (single-pair, multi-list, cross-variant) | 100+ query shadow comparison completed, Kendall tau computed. Flag: `SPECKIT_RSF_FUSION` |
| REQ-S3-003 | **R2**: Channel min-representation (post-fusion, quality floor 0.2, only when channel returned results) | Top-3 precision within 5% of baseline. Flag: `SPECKIT_CHANNEL_MIN_REP` |
| REQ-S3-004 | **R15-ext**: Confidence-based result truncation — adaptive top-K cutoff based on score confidence gap (parent: REQ-047) | Results truncated at score confidence gap; minimum 3 results guaranteed. Reduces irrelevant tail results by >30% |
| REQ-S3-005 | **FUT-7**: Dynamic token budget allocation by query complexity tier (parent: REQ-048) | Simple: 1500t, Moderate: 2500t, Complex: 4000t. Token waste reduced for simple queries |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R15 simple query p95 latency <30ms
- **SC-002**: RSF vs RRF comparison: Kendall tau computed on 100+ queries; tau <0.4 = reject RSF
- **SC-003**: R2 dark-run: top-3 precision within 5% of baseline
- **SC-004**: Sprint 3 exit gate — all 5 P1 requirements verified
- **SC-005**: Off-ramp evaluated: MRR@5 >= 0.7, constitutional >= 95%, cold-start >= 90%
- **SC-006**: R15-ext confidence truncation reduces irrelevant tail results by >30%, minimum 3 results guaranteed
- **SC-007**: FUT-7 dynamic token budget applied per tier (simple: 1500t, moderate: 2500t, complex: 4000t)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R15 misclassification causes silent recall degradation | High | Shadow comparison: run both full and routed pipeline, compare results |
| Risk | R15+R2 interaction — R15 minimum must be 2 channels to preserve R2 guarantee | Medium | Enforce min=2 in router config; test interaction explicitly |
| Risk | R14/N1 covers 3 fusion variants (~200-250 LOC, not just ~80 LOC core formula) | Medium | Budget 10-14h for full implementation; single-pair variant first as foundation |
| Dependency | Sprint 2 exit gate | Blocks start | Sprint 2 must be verified complete before Sprint 3 begins |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Simple queries <30ms p95 latency
- **NFR-P02**: Moderate queries <100ms p95 latency
- **NFR-P03**: Complex queries <300ms p95 latency

### Reliability
- **NFR-R01**: R12+R15 mutual exclusion enforced — both flags cannot be active simultaneously
- **NFR-R02**: R15 minimum 2 channels even for simple tier (preserves R2 guarantee)

### Observability
- **NFR-O01**: R15 classification logged for every query (eval infrastructure)
- **NFR-O02**: RSF shadow scores logged alongside RRF for post-hoc analysis

### Feature Flags
Sprint 3 introduces 5 feature flags (all disabled by default):
- `SPECKIT_COMPLEXITY_ROUTER` — R15 query complexity router (REQ-S3-001)
- `SPECKIT_RSF_FUSION` — R14/N1 Relative Score Fusion (REQ-S3-002)
- `SPECKIT_CHANNEL_MIN_REP` — R2 channel min-representation (REQ-S3-003)
- `SPECKIT_CONFIDENCE_TRUNCATION` — R15-ext confidence-based result truncation (REQ-S3-004)
- `SPECKIT_DYNAMIC_TOKEN_BUDGET` — FUT-7 dynamic token budget allocation (REQ-S3-005)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **R15 minimum 2 channels for simple queries**: Even the simplest query must route to at least 2 channels to preserve R2 channel diversity guarantee
- **RSF with empty channels**: RSF handles channels returning zero results gracefully — empty channel excluded from fusion
- **R2 with all channels returning empty**: If all channels return empty, R2 enforcement is a no-op (nothing to diversify)

### Error Scenarios
- **R15 classifier failure**: Fallback to "complex" tier — full pipeline runs (safe default)
- **RSF numerical overflow**: Score normalization prevents unbounded values; clamp to [0, 1]

### State Transitions
- **Flag interaction**: R15+R2+R14/N1 interact — disabling one may affect others; rollback must verify independent flag behavior
- **Off-ramp trigger**: If off-ramp thresholds met (MRR@5 >= 0.7, constitutional >= 95%, cold-start >= 90%), further sprints become optional
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 3 features across routing, fusion, and post-fusion layers |
| Risk | 10/25 | R15 misclassification risk; R14/N1 3-variant scope |
| Research | 6/20 | Research complete (142 analysis); RSF formula defined |
| Multi-Agent | 0/15 | Single-sprint, single-agent scope |
| Coordination | 0/15 | No cross-sprint coordination required within Sprint 3 |
| **Total** | **30/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S3-001**: What features should the R15 classifier use? Query length, term count, presence of trigger phrases, semantic complexity?
- **OQ-S3-002**: Should the off-ramp decision be automated or require manual review?

### Known Limitations

- **KL-S3-001**: The R15 classifier produces no confidence score. Classification is deterministic based on threshold boundaries. The fallback to "complex" tier on classifier failure is intentional and safe but forecloses confidence-weighted downstream features (e.g., conservative top-K truncation for low-confidence classifications, downstream consumers using classification certainty). This is a design decision for Sprint 3 scope — if classifier confidence becomes needed, it should be added as a Sprint 4+ feature.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:pageindex-integration -->
### PageIndex Integration

Sprint 3 incorporates two PageIndex recommendations that extend the existing query intelligence features.

#### PI-A2: Search Strategy Degradation with Fallback Chain [DEFERRED]

> **Deferred from Sprint 3.** At corpus scale <500 memories, the triggering conditions (top similarity <0.4 or result count <3) have not been measured or demonstrated at meaningful frequency. Effort (12-16h) approaches the core R15 phase total. PI-A2 will be re-evaluated after Sprint 3 using Sprint 0-3 metric data. See UT review R1.

**Rationale**: The R15 query complexity router already classifies queries by tier, but it does not handle the case where the selected channel subset produces low-quality results. PI-A2 adds a three-tier fallback chain that activates automatically when top-result similarity falls below 0.4 or the result count drops below 3:

1. **Full hybrid search** (primary) — all channels selected by R15 tier execute normally
2. **Broadened search** (first fallback) — relaxed filters, trigger matching enabled, channel constraints loosened
3. **Structural search** (second fallback) — folder browsing, tier-based listing, no vector requirement

Transition thresholds: top result similarity < 0.4 OR result count < 3 triggers descent to the next tier. The fallback is automatic and bounded — no user intervention is required, and the chain terminates at structural search.

**Relationship to existing work**: PI-A2 sits alongside R-010 (hybrid fusion) and R-012 (graph integration) as a new recommendation. It depends on the Sprint 0 evaluation framework to measure similarity thresholds and result counts. The R15 minimum-2-channel constraint is preserved at all fallback levels.

**Effort**: 12-16h | **Risk**: Medium | **Dependency**: Sprint 0 eval framework

#### PI-B3: Description-Based Spec Folder Discovery [P2/Optional]

**Rationale**: Currently, queries without an explicit `specFolder` parameter perform full-corpus search. PI-B3 generates a cached 1-sentence description per spec folder derived from `spec.md` and stores them in a `descriptions.json` file. The `memory_context` orchestration layer uses this file for lightweight folder routing before issuing vector queries, reducing unnecessary cross-folder churn.

**Relationship to existing work**: PI-B3 is a low-risk addition to the folder routing layer. It complements the R9 spec folder pre-filter (Sprint 5) by providing a discovery step before the pre-filter applies.

**Effort**: 4-8h | **Risk**: Low
<!-- /ANCHOR:pageindex-integration -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../000-feature-overview/spec.md`
- **Parent Plan**: See `../000-feature-overview/plan.md`

---

**OFF-RAMP: After Sprint 3, evaluate "good enough" thresholds. If MRR@5 >= 0.7, constitutional >= 95%, cold-start >= 90%, further sprints optional.**

> **HARD SCOPE CAP — Sprint 2+3 Off-Ramp**: Sprints 4-7 require NEW spec approval based on demonstrated need from Sprint 0-3 metrics. Approval must include:
> (a) Evidence that remaining work addresses measured deficiencies (cite specific Sprint 0-3 metric values that fell short)
> (b) Updated effort estimates based on Sprint 0-3 actuals (not original estimates)
> (c) ROI assessment: projected metric improvement vs. implementation cost
>
> If all three off-ramp thresholds are met, the default decision is STOP. Continuing beyond Sprint 3 requires explicit written approval with the above evidence.

---

<!--
LEVEL 2 SPEC — Phase 4 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 3: Query Intelligence
-->

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

## 014-feedback-and-quality

Source: `014-feedback-and-quality/spec.md`

---
title: "Feature Specification: Sprint 4 — Feedback and Quality"
description: "Close the feedback loop with chunk aggregation, learned relevance feedback, and shadow scoring infrastructure."
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
trigger_phrases:
  - "sprint 4"
  - "feedback and quality"
  - "MPAB"
  - "learned relevance"
  - "R11"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Sprint 4 — Feedback and Quality

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-26 |
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 5 of 8 |
| **Predecessor** | ../013-query-intelligence/ |
| **Successor** | ../015-pipeline-refactor/ |
| **Handoff Criteria** | R1 MRR@5 within 2%, R11 noise <5%, R13-S2 operational |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 5** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 4 scope boundary — feedback and learning. Closes the feedback loop by aggregating chunk scores, learning from user selections with strict safeguards, and establishing full A/B evaluation infrastructure.

**Dependencies**:
- Sprint 3 exit gate (query intelligence complete — R15, R14/N1, R2 verified)
- R13 must have completed at least 2 full eval cycles before R11 mutations enabled

> **HARD SCOPE CAP**: Sprint 4 is beyond the recommended off-ramp (Sprint 3). Per root spec, starting Sprint 4+ requires separate NEW spec approval and explicit justification based on Sprint 3 off-ramp evaluation results.

**Deliverables**:
- MPAB chunk-to-memory aggregation with N=0/N=1 guards (R1)
- Learned relevance feedback with separate column and 10 safeguards (R11)
- Shadow scoring + channel attribution + ground truth Phase B (R13-S2)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Chunked memories are scored individually without aggregation — a memory with 5 matching chunks gets no advantage over one with 1 chunk, losing valuable signal. No mechanism exists to learn from user selections (which memories users actually use), so the system cannot self-improve. Evaluation is limited to basic metrics without shadow scoring or A/B comparison capability, making it impossible to validate changes against production behavior.

### Purpose

Aggregate chunk scores safely with MPAB (preserving N=0/N=1 semantics), learn from user behavior with 10 strict safeguards to prevent FTS5 contamination, and establish full A/B evaluation infrastructure for continuous quality measurement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R1**: MPAB chunk-to-memory aggregation with N=0/N=1 guards, index-based max removal
- **R11**: Learned relevance feedback with separate `learned_triggers` column + 10 safeguards
- **R13-S2**: Shadow scoring + channel attribution + ground truth Phase B
- **G-NEW-3 Phase C**: LLM-judge ground truth generation (tasks T027a, T027b) — context-type boost validation via automated LLM-judge labeling with >=80% agreement with manual labels

### Out of Scope

- R6 (pipeline refactor) — Sprint 5 scope
- R12 (query expansion) — Sprint 5 scope
- R15 changes — locked from Sprint 3
- Direct FTS5 index modification — R11 uses separate column exclusively
- PI-A4 (constitutional memory as expert knowledge injection) — deferred to Sprint 5 (retrieval-pipeline work, no S4 dependency)

### Prerequisite

R13 must have completed at least 2 full eval cycles before R11 mutations are enabled. This is a P0 gate check.

> **R13 Eval Cycle Definition**: One eval cycle = minimum 100 queries evaluated AND 14+ calendar days (both conditions must be met). Two full cycles = minimum 200 queries AND 28+ calendar days. This matches the parent spec's more stringent criteria. This calendar dependency is NOT reflected in effort hours and must be planned for explicitly in the project timeline. Expect a mandatory idle window of 28+ calendar days between Sprint 3 completion and R11 enablement.

---

### RECOMMENDED: Sprint 4 Sub-Sprint Split

> **F3 — RECOMMENDED SPLIT**: Sprint 4 should be split into two sub-sprints to isolate the CRITICAL FTS5 contamination risk in R11.

**S4a — Lower Risk (estimated 33-49h)**
- R1: MPAB chunk-to-memory aggregation (8-12h) + T001a chunk ordering (2-4h)
- R13-S2: Enhanced shadow scoring + channel attribution + ground truth Phase B (15-20h) + T003a exclusive contribution rate (2-3h)
- TM-04: Pre-storage quality gate (6-10h) — no schema change

**S4b — Higher Risk (estimated 31-48h, requires S4a metrics + 28-day window)**
- R11: Learned relevance feedback with separate `learned_triggers` column + 10 safeguards (16-24h) + T002a auto-promotion (5-8h) + T002b negative feedback (4-6h)
- TM-06: Reconsolidation-on-save (6-10h) — schema-adjacent, high caution

**Rationale for split**: R11 has CRITICAL severity — an FTS5 contamination mistake (adding `learned_triggers` to the FTS5 index) is irreversible without a full re-index of all memories. Isolating R11 into S4b means S4a's A/B infrastructure is operational before R11 mutations begin, enabling immediate detection of any regression. Risk concentration is eliminated by ensuring R1 and R13-S2 are verified clean before R11 is enabled.

> **NOTE — TM-04 S4a/S4b placement divergence**: This child spec places TM-04 in **S4a** (quality gate before feedback mutations). The parent spec (`../000-feature-overview/spec.md` line 128) places TM-04 in S4b. The child spec's S4a placement is correct: TM-04 is a pre-storage quality gate with no schema change that should be operational before R11 feedback mutations begin in S4b. The parent spec should be updated to move TM-04 from S4b to S4a to match this child spec's authoritative Sprint 4 phasing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `composite-scoring.ts` or fusion layer | Modify | R1: MPAB aggregation with N=0/N=1 guards |
| `memory_index` schema | Modify | R11: `ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]'` |
| Search handlers | Modify | R11: 10 safeguards implementation |
| Eval infrastructure | Modify | R13-S2: Shadow scoring + channel attribution + ground truth Phase B |
| `memory-save.ts` (save handler) | Modify | TM-04: Multi-layer pre-storage quality gate (L1 structural, L2 content quality, L3 semantic dedup) |
| `memory-save.ts` (save handler) | Modify | TM-06: Post-embedding reconsolidation check against top-3 similar memories (merge/replace/store) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S4-PRE | **R13 prerequisite**: Verify R13 completed 2+ full eval cycles | Eval cycle count >= 2 verified before R11 work begins |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S4-001 | **R1**: MPAB with N=0/N=1 guards, index-based max removal | MRR@5 within 2% of baseline, N=1 no regression. Chunk ordering: collapsed multi-chunk results maintain original document position order. Flag: `SPECKIT_DOCSCORE_AGGREGATION` |
| REQ-S4-002 | **R11**: Learned feedback with separate `learned_triggers` column + 10 safeguards (denylist 100+, rate cap 3/8h, TTL 30d decay, FTS5 isolation, noise floor top-3, rollback mechanism, provenance/audit log, shadow period 1 week, eligibility 72h, sprint gate review) | Noise rate <5%. Auto-promotion: memories with >=5 positive validations promoted normal->important; >=10 promoted important->critical. Negative feedback confidence signal active: wasUseful=false reduces score via confidence multiplier (floor=0.3). Flag: `SPECKIT_LEARN_FROM_SELECTION` |
| REQ-S4-003 | **R13-S2**: Shadow scoring + channel attribution + ground truth Phase B | A/B infrastructure operational. Exclusive Contribution Rate computed per channel |
| REQ-S4-004 | **TM-04**: Pre-storage quality gate in `memory_save` handler — Layer 1 structural (existing), Layer 2 content quality scoring (title, triggers, length, anchors, metadata, signal density >= 0.4 threshold), Layer 3 semantic dedup (>0.92 cosine similarity = reject). Behind `SPECKIT_SAVE_QUALITY_GATE` flag | Low-quality saves blocked (score below 0.4 signal density threshold); semantic near-duplicates (>0.92 cosine similarity) rejected; structurally valid, distinct content passes all layers |
| REQ-S4-005 | **TM-06**: Reconsolidation-on-save — after embedding generation check top-3 similar memories: >=0.88 similarity = duplicate (merge, increment frequency), 0.75–0.88 = conflict (replace, add supersedes edge), <0.75 = complement (store new). Requires checkpoint before enabling. Behind `SPECKIT_RECONSOLIDATION` flag | Duplicate memories merged with frequency increment; conflicting memories replaced with causal supersedes edge; complement memories stored without modification; checkpoint created before first enable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R1 dark-run: MRR@5 within 2% of baseline, no N=1 regression
- **SC-002**: R11 shadow log: noise rate <5%
- **SC-003**: R13-S2: Full A/B comparison infrastructure operational
- **SC-004**: R11 FTS5 contamination test: `learned_triggers` NOT in FTS5 index
- **SC-005**: Sprint 4 exit gate — all requirements verified
- **SC-006**: TM-04 quality gate: saves below 0.4 signal density blocked; near-duplicates (>0.92 cosine similarity) rejected; structurally valid distinct content passes all layers
- **SC-007**: TM-06 reconsolidation: duplicates (>=0.88) merged with frequency increment; conflicts (0.75-0.88) replaced with causal supersedes edge; complements (<0.75) stored without modification; checkpoint created before first enable
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | **CRITICAL** — R11 FTS5 contamination if separate column not used (MR1) | Critical | Separate `learned_triggers` column, explicit FTS5 exclusion test |
| Risk | R1 N=0 div-by-zero (MR4) | High | Guard: N=0 --> return 0 |
| Risk | R1+N4 double-boost — MPAB bonus on already co-activation-boosted scores | Medium | Verify MPAB operates after fusion, not on pre-boosted scores |
| Risk | N4+R11 transient artifact learning — R11 learns from temporary co-activation patterns | Medium | R11 eligibility requires memory age >= 72h |
| Risk | TM-04 quality gate over-filtering — overly strict thresholds reject legitimate saves (MR12) | Medium | **Warn-only mode for first 2 weeks**: log quality scores and would-reject decisions but do NOT block saves. Tune thresholds based on observed false-rejection rate before enabling enforcement. See parent spec MR12 mitigation |
| Dependency | Sprint 3 exit gate | Blocks start | Must be verified complete |
| Dependency | R13 2+ eval cycles | Blocks R11 | P0 prerequisite for R11 mutations |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R11 dark-run overhead must not exceed +15ms p95
- **NFR-P02**: R1 operates on already-fetched data — no additional DB queries

### Security
- **NFR-S01**: R11 `learned_triggers` column MUST NOT be added to FTS5 index
- **NFR-S02**: R11 denylist must contain 100+ stop words to prevent noise injection

### Reliability
- **NFR-R01**: R11 must NOT modify triggers until 1-week shadow period completes
- **NFR-R02**: Schema migration must be atomic with backup (checkpoint recommended)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **N=0 chunks**: Return score 0 — no chunks means no signal
- **N=1 chunk**: Return score as-is — no bonus or penalty applied (single chunk = raw score)
- **R11 memories <72h old**: Excluded from learned feedback eligibility — too new to learn from

### Error Scenarios
- **R11 "not in top 3" safeguard**: Requires R13 query provenance — if provenance unavailable, R11 skip (safe default)
- **Schema migration failure**: Abort and restore from checkpoint — search continues with existing schema
- **R11 denylist miss**: New stop word pattern bypasses denylist — TTL 30d provides self-healing

### State Transitions
- **R11 shadow period**: First 1 week = shadow only (log but don't apply). After 1 week = mutations enabled (if noise <5%)
- **R1+R11 interaction**: R1 aggregates chunks, R11 learns from selections — ensure R11 operates on post-MPAB scores

### TM-04/TM-06 Threshold Interaction
- **[0.88, 0.92] merge zone**: A save with cosine similarity in the range [0.88, 0.92] passes TM-04 (which only rejects >0.92) and then triggers TM-06 merge behavior (which merges at >=0.88). The intended behavior is **save-then-merge**: TM-04 allows the save, embedding is generated, and TM-06 merges it with the existing memory (incrementing frequency counter). This is the expected behavior — TM-04 guards against truly redundant saves, while TM-06 handles the consolidation of closely-related content.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 3 features: MPAB aggregation, learned feedback with schema change, eval Phase B |
| Risk | 18/25 | CRITICAL FTS5 contamination risk; schema migration; 10 safeguards complexity |
| Research | 6/20 | Research complete (142 analysis); MPAB formula and R11 safeguards defined |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S4-001**: Should R11 shadow period be configurable or hardcoded to 1 week?
- **OQ-S4-002**: MPAB bonus coefficient is **provisionally set at 0.3** — must be validated against MRR@5 measurements from S4a shadow data before S4b begins. If no Sprint 0-3 empirical basis exists at sprint start, treat as provisional and add S4a validation task.
- **OQ-S4-003**: R11 learned-trigger query weight is **provisionally set at 0.7x** — must be derived from channel attribution data (R13-S2) during the F10 idle window. Adjust based on observed signal-to-noise ratio before S4b enables R11 mutations.
<!-- /ANCHOR:questions -->

---

---

<!-- ANCHOR:pageindex-integration -->
### PageIndex Integration

> **PI-A4 deferred to Sprint 5** — Constitutional Memory as Expert Knowledge Injection (8-12h) has no Sprint 4 dependency and does not affect any Sprint 4 exit criterion. It is retrieval-pipeline work that fits Sprint 5's theme (pipeline refactor + query expansion R12). See `../015-pipeline-refactor/spec.md` for updated placement. Rationale: ultra-think review REC-07.
<!-- /ANCHOR:pageindex-integration -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../000-feature-overview/spec.md`
- **Parent Plan**: See `../000-feature-overview/plan.md`

---

### Schema Change

```sql
ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]';
-- Nullable, default empty JSON array
-- Rollback: ALTER TABLE memory_index DROP COLUMN learned_triggers; (SQLite 3.35.0+)
```

---

<!--
LEVEL 2 SPEC — Phase 5 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 4: Feedback and Quality
-->

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

## 015-pipeline-refactor

Source: `015-pipeline-refactor/spec.md`

---
title: "Feature Specification: Sprint 5 — Pipeline Refactor"
description: "Refactor retrieval pipeline to 4-stage architecture with Stage 4 invariant, add spec folder pre-filter, query expansion, and spec-kit retrieval metadata."
trigger_phrases:
  - "sprint 5"
  - "pipeline refactor"
  - "R6"
  - "4-stage pipeline"
importance_tier: "normal"
contextType: "implementation" # SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2
---
# Feature Specification: Sprint 5 — Pipeline Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (elevated from P2 — safety-critical NFRs: Stage 4 invariant, pipeline integrity) |
| **Status** | Implemented |
| **Created** | 2026-02-26 |
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 6 of 8 |
| **Predecessor** | ../014-feedback-and-quality/ |
| **Successor** | ../016-indexing-and-graph/ |
| **Handoff Criteria** | R6 0 ordering differences, 158+ tests pass, R9 cross-folder equivalent, R12 no latency degradation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
### Phase Context

This is **Phase 6** of the Hybrid RAG Fusion Refinement specification.

**Scope Boundary**: Sprint 5 scope boundary — pipeline architecture. Establishes clean 4-stage pipeline with architectural invariant (Stage 4 = no score changes), adds retrieval optimizations (spec folder pre-filter, query expansion), and integrates spec-kit signals (template anchors, validation metadata).

**R6 Conditionality**: R6 pipeline refactor is CONDITIONAL — required only if Sprint 2 score normalization fails exit gate, OR Stage 4 invariant is deemed architecturally necessary regardless of normalization outcome. If Sprint 2 normalization succeeds and no architectural justification exists for the invariant, R6 may be descoped.

**Dependencies**:
- Sprint 4 exit gate (feedback loop complete — R1, R11, R13-S2 verified)

> **HARD SCOPE CAP**: Sprint 5 is beyond the recommended off-ramp (Sprint 3). Per root spec, starting Sprint 5+ requires separate NEW spec approval and explicit justification based on Sprint 3 off-ramp evaluation results.

**Deliverables**:
- 4-stage pipeline refactor with Stage 4 invariant (R6)
- Spec folder pre-filter (R9)
- Query expansion with R15 mutual exclusion (R12)
- Template anchor optimization (S2)
- Validation signals as retrieval metadata (S3)
- Dual-scope memory auto-surface hooks at tool dispatch and session compaction (TM-05)

**Internal Phasing**: Phase A (Pipeline) MUST pass before Phase B (Search + Spec-Kit) begins.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current pipeline intermixes scoring, filtering, and annotation without clear stage boundaries. This enables anti-patterns like double-weighting (G2) where intent weights or other scoring signals can be applied multiple times across different code paths. Spec folder pre-filtering is absent, requiring full corpus search even when the user has specified a folder. No query expansion exists. Template and validation signals generated by the spec-kit system are unused in retrieval scoring.

### Purpose

Establish a clean 4-stage pipeline with an architectural invariant (Stage 4 cannot modify scores), add retrieval optimizations for speed and relevance, and surface spec-kit signals in the scoring layer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **R6**: 4-stage pipeline refactor with Stage 4 invariant (no score changes after Stage 3)
- **R9**: Spec folder pre-filter for scoped queries
- **R12**: Query expansion (suppressed when R15="simple") with `SPECKIT_EMBEDDING_EXPANSION` flag
- **S2**: Template anchor optimization — anchor-aware retrieval metadata
- **S3**: Validation signals as retrieval metadata — validation metadata in scoring
- **PI-A4**: Constitutional memory as retrieval directives — reformat constitutional memories with `retrieval_directive` metadata field (deferred from Sprint 4 per REC-07)

### Out of Scope

- R15 changes — locked from Sprint 3
- R11 changes — locked from Sprint 4
- New fusion algorithms — RRF/RSF decision locked from Sprint 3
- Graph deepening — Sprint 6 scope

### Internal Phasing

- **Phase A (Pipeline)**: R6 decomposed into 8 sub-tasks (T002a-T002h, 40-63h total). See `tasks.md` for the authoritative sub-task breakdown including stage architecture definition, per-stage implementation, integration, feature flag interaction testing, and dark-run verification.
  - MUST pass exit gate (0 differences in positions 1-5 AND rank correlation >0.995) before Phase B starts
- **Phase B (Search + Spec-Kit)**: R9, R12, S2, S3, TM-05 (28-43h) — starts only after Phase A passes. Phase B tasks are parallelizable ([P] markers in tasks.md); wall-clock time may be less than sequential effort estimate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `memory-search.ts` | Major Modify | R6: 4-stage pipeline architecture |
| lib/search/pipeline/ | Create | R6: Stage definitions and boundaries |
| handlers/memory-search.ts, handlers/memory-context.ts | Modify | R9: Spec folder pre-filter, R12: Query expansion |
| Template/validation handlers | Modify | S2: Anchor optimization, S3: Validation metadata |
| `hooks/memory-surface.ts` | Modify | TM-05: Dual-scope injection hooks at tool dispatch and session compaction |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P2 - Important (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-S5-001 | **R6**: 4-stage pipeline with Stage 4 invariant (decomposed into 4 sub-tasks: Stage1/Stage2/Stage3/Stage4 + integration) | 0 ordering differences in positions 1-5 AND weighted rank correlation >0.995 on eval corpus (relaxed from strict "0 differences" which is fragile for floating-point arithmetic), 158+ tests pass. Flag: `SPECKIT_PIPELINE_V2` |
| REQ-S5-002 | **R9**: Spec folder pre-filter | Cross-folder queries produce identical results to without pre-filter |
| REQ-S5-003 | **R12**: Query expansion (suppressed when R15="simple") | No simple query latency degradation. Flag: `SPECKIT_EMBEDDING_EXPANSION` |
| REQ-S5-004 | **S2**: Template anchor optimization | Anchor-aware retrieval metadata present in results |
| REQ-S5-005 | **S3**: Validation signals as retrieval metadata | Validation metadata integrated into scoring |
| REQ-S5-006 | **TM-05**: Dual-scope memory auto-surface hooks at tool dispatch and session compaction lifecycle points, with per-point token budgets (4000 max). Extends `hooks/memory-surface.ts`. Behind config/logic in Spec-Kit integration layer | Memory auto-surface fires at tool dispatch and session compaction; per-point token budget of 4000 enforced; no regression in existing auto-surface behavior |

### Acceptance Scenarios

1. **Given** `SPECKIT_PIPELINE_V2` is enabled and Stage 3 produces ranked results, **When** Stage 4 filter/annotate executes, **Then** scores and ordering are unchanged.
2. **Given** a query is scoped to a spec folder, **When** R9 pre-filtering runs before scoring, **Then** only in-scope candidates are processed and result relevance remains equivalent to baseline behavior.
3. **Given** R15 classifies a query as `simple`, **When** R12 expansion logic is evaluated, **Then** expansion is skipped and simple-query latency remains within the defined guardrail.
4. **Given** template-anchor and validation metadata are available for results, **When** Stage 2 composite scoring executes, **Then** both S2 and S3 signals are attached and applied at the single scoring point.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: R6 dark-run: 0 ordering differences in positions 1-5 AND weighted rank correlation >0.995 on full eval corpus
- **SC-002**: All 158+ existing tests pass with `SPECKIT_PIPELINE_V2` enabled
- **SC-003**: Stage 4 invariant verified: no score modifications in Stage 4
- **SC-004**: R9 cross-folder queries identical to without pre-filter
- **SC-005**: R12+R15 mutual exclusion: R12 suppressed when R15="simple"
- **SC-006**: R12 p95 simple query latency within 5% of pre-R12 baseline
- **SC-007**: Intent weights applied ONCE in Stage 2 (prevents G2 recurrence)
- **SC-008**: Sprint 5 exit gate — all requirements verified
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R6 is single largest work item (40-55h) | High | Checkpoint before start; off-ramp to retain current pipeline if ordering regressions unresolvable |
| Risk | Ordering regression in dark-run | High | Off-ramp: retain current pipeline and implement R9/R12/S2/S3 as incremental patches |
| Risk | R12+R15 mutual exclusion must be enforced | Medium | Explicit guard: if R15 classification = "simple", skip R12 expansion |
| Risk | G2 recurrence — intent weights applied in multiple stages | Medium | Stage 2 = single point for all scoring signals; Stage 4 invariant enforces no-score-change |
| Dependency | Sprint 4 exit gate | Blocks start | Must be verified complete |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: R6 pipeline must not degrade p95 latency vs current implementation
- **NFR-P02**: R12 must not degrade simple query latency (R15 mutual exclusion)
- **NFR-P03**: R9 pre-filter should reduce latency for scoped queries

### Reliability
- **NFR-R01**: All 158+ existing tests must pass under `SPECKIT_PIPELINE_V2`
- **NFR-R02**: Stage 4 invariant: any code that modifies scores after Stage 3 is a build-time error (compile-time type guards) with runtime assertion as defense-in-depth

### Maintainability
- **NFR-M01**: Each stage has clear interface boundary — stages are independently testable
- **NFR-M02**: Stage definitions documented in code with JSDoc
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **R9 with no spec folder**: Pre-filter is a no-op — full corpus search
- **R12 with empty expansion**: If query expansion produces no additional terms, original query proceeds unchanged
- **S2/S3 with no template/validation data**: Missing signals are omitted — scoring not degraded

### Error Scenarios
- **R6 stage boundary violation**: Stage 4 attempts score modification — assertion/guard catches and logs error
- **R12+R15 flag conflict**: Both expansion and simple routing active — R15 takes precedence, R12 suppressed

### State Transitions
- **Phase A to Phase B gate**: R6 must achieve 0 ordering differences before Phase B begins
- **R6 off-ramp**: If ordering regressions cannot be resolved, retain current pipeline and implement R9/R12/S2/S3 as incremental patches to existing code
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | R6 is major refactor (40-55h); 4 additional features in Phase B |
| Risk | 14/25 | Ordering regression risk; R6 off-ramp defined; R12+R15 interaction |
| Research | 6/20 | Research complete (142 analysis); 4-stage architecture designed |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **OQ-S5-001** [CLOSED — UT-7 R2]: Stage 4 invariant enforced via **compile-time TypeScript type guards** (read-only score fields in Stage 4 input/output types) as primary enforcement, with **runtime assertion** (score delta = 0 check at Stage 4 exit) as defense-in-depth. Rationale: compile-time enforcement prevents the pattern from being written; runtime assertion catches edge cases missed by type system.
- **OQ-S5-002** [CLOSED — UT-7 R4]: S2 (template anchor) and S3 (validation) signals are **independent ranking dimensions** in the composite scoring model, expanding it from 5-factor to 7-factor with rebalanced weights. Both signals are applied exclusively in Stage 2 as part of the consolidated scoring point. Weight rebalancing ensures existing factor influence is preserved proportionally. Rationale: independent dimensions provide maximum tuning flexibility while the Stage 2 single-application-point architecture prevents G2-class double-weighting.
<!-- /ANCHOR:questions -->

---

---

<!-- ANCHOR:pageindex-integration -->
### PageIndex Integration

Sprint 5 incorporates two PageIndex recommendations that extend the pipeline refactor and validation infrastructure.

#### PI-B1: Tree Thinning for Spec Folder Consolidation

**Rationale**: The R6 pipeline refactor establishes clean stage boundaries, but the context loading step that precedes the pipeline can still be token-heavy when spec folders contain many small files. PI-B1 applies bottom-up merging of small files during spec folder context loading:

- Files under 200 tokens: merge summary into parent document
- Files under 500 tokens: use file content directly as the summary (no separate summary pass needed)
- Memory files: 300-token threshold for thinning, 100-token threshold where the text itself is the summary

This is an extension of the `generate-context.js` workflow, not a change to the pipeline stages themselves. It reduces token overhead before Stage 1 candidate generation without modifying any scoring logic.

**Relationship to existing work**: PI-B1 is a pre-pipeline optimization that operates on the context loading layer. It complements the R9 spec folder pre-filter (which runs inside the pipeline) by reducing context size before the pipeline starts. The Stage 4 invariant is unaffected.

**Effort**: 10-14h | **Risk**: Low

#### PI-B2: Progressive Validation for Spec Documents

**Rationale**: The current `validate.sh` script operates as a binary pass/fail gate. PI-B2 extends it to a 4-level progressive pipeline:

1. **Detect** — identify all violations (existing behavior)
2. **Auto-fix** — apply safe mechanical corrections automatically: missing dates, heading level normalization, whitespace normalization
3. **Suggest** — present non-automatable issues with guided fix options
4. **Report** — produce structured output (exit 0/1/2) with before/after diffs for all auto-fixes

All auto-fixes are logged with before/after diffs as the primary mitigation against silent corruption. This makes the validation step actionable rather than purely diagnostic, reducing the manual effort required to bring a spec folder into compliance.

**Relationship to existing work**: PI-B2 extends `validate.sh` from the Sprint 5 verification infrastructure. It does not affect the pipeline stages, scoring logic, or any Sprint 5 feature flags. Exit codes remain compatible: exit 0 = pass, exit 1 = warnings, exit 2 = errors (must fix).

**Effort**: 16-24h | **Risk**: Medium | **Mitigation**: Log all auto-fixes with before/after diff; dry-run mode available
<!-- /ANCHOR:pageindex-integration -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../000-feature-overview/spec.md`
- **Parent Plan**: See `../000-feature-overview/plan.md`

---

### R6 4-Stage Architecture

| Stage | Name | Responsibilities | Score Changes |
|-------|------|-----------------|---------------|
| 1 | Candidate Generation | 5 channels execute, raw results collected | N/A (raw scores) |
| 2 | Fusion + Signal Integration | RRF/RSF, causal boost, co-activation, composite, intent weights (ONCE) | YES |
| 3 | Rerank + Aggregate | Cross-encoder, MMR, MPAB | YES |
| 4 | Filter + Annotate | State filter, evidence-gap annotation, feature/state metadata attribution (session dedup + constitutional injection run post-cache in handler) | **NO** |

**Architectural Invariant**: Stage 4 MUST NOT modify scores. Any ordering change after Stage 3 is a bug.

---

<!--
LEVEL 2 SPEC — Phase 6 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 5: Pipeline Refactor
-->

---

## 016-indexing-and-graph

Source: `016-indexing-and-graph/spec.md`

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
- **R16**: Encoding-intent capture at index time behind `SPECKIT_ENCODING_INTENT` flag
- **S4**: Spec folder hierarchy as retrieval structure — hierarchy traversal functional
- **T001d / MR10**: weight_history audit tracking — log weight changes for N3-lite Hebbian modifications; enables rollback independent of edge creation
- **N3-lite**: Contradiction scan (weekly) + Hebbian edge strengthening + staleness detection + contradiction cluster surfacing (surface all cluster members, not just flagged pair) behind `SPECKIT_CONSOLIDATION` flag
  > **ESTIMATION WARNING**: Contradiction detection requires semantic analysis beyond simple string comparison. The ~40 LOC estimate assumes a lightweight heuristic approach (cosine similarity + keyword conflict check); if semantic accuracy >80% is needed, effort could be 3-5x higher. Sufficient quality means: detects at least 1 known contradiction in curated test data without requiring a full NLI model.

#### Sprint 6b — Graph Sophistication (37-53h heuristic, GATED on feasibility spike)

- **N2 (items 4-6)**: Graph centrality + community detection, decomposed into: N2a (Graph Momentum -- temporal degree delta), N2b (Causal Depth Signal -- max-depth path normalization), N2c (Community Detection -- label propagation or Louvain clustering) — channel attribution >10%
  > **ESTIMATION WARNING**: Implementing Louvain/label propagation community detection from scratch on SQLite is research-grade work. The current 12-15h estimate for N2c is likely insufficient. Consider 40-80h for production quality, or evaluate using a simpler heuristic (connected components via BFS/DFS) first. Sufficient quality for N2c means: community assignments are stable across two consecutive runs on the same data (deterministic or near-deterministic output).
- **R10**: Auto entity extraction (gated on edge density <1.0) behind `SPECKIT_AUTO_ENTITIES` flag — FP rate <20%
  > **ESTIMATION WARNING**: Entity extraction with <20% false positive rate is an ML challenge. The 12-18h estimate assumes rule-based heuristics (regex, noun-phrase extraction via NLP library); if ML-based accuracy is needed (e.g., fine-tuned NER model), consider 30-50h. Sufficient quality means: FP rate <20% verified via manual review of a sample of >=50 auto-extracted entities.

**Sprint 6b Entry Gates (REQUIRED before Sprint 6b starts):**
1. Feasibility spike completed (8-16h)
2. OQ-S6-001 resolved (edge density documented)
3. OQ-S6-002 resolved (centrality algorithm selected with evidence)
4. REQ-S6-004 revisited (10% mandate removed or density-conditioned if graph is thin)

> **OVERALL SPRINT ESTIMATION NOTE**: Sprint 6a (33-51h) delivers value at any graph scale. Sprint 6b (37-53h heuristic, 80-150h production) is gated — if feasibility spike shows graph is too sparse for centrality/community detection, Sprint 6b can be deferred without blocking Sprint 7.

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
| REQ-S6-004 | **N2 (items 4-6)**: Graph centrality + community detection | Graph channel attribution >10% of final top-K OR graph density <1.0 edges/node documented with decision to defer (density-conditional acceptance); N2c community assignments stable across 2 runs on test graph with ≥50 nodes |
| REQ-S6-005 | **N3-lite**: Contradiction scan (weekly) + Hebbian edge strengthening behind `SPECKIT_CONSOLIDATION` flag | Detects at least 1 known contradiction in curated test data; heuristic approach acceptable if lightweight |
| REQ-S6-006 | **S4**: Spec folder hierarchy as retrieval structure | Hierarchy traversal functional in retrieval queries |

> **Attribution weighting (REQ-S6-004 clarification)**: All edge types (causal, enabled, supports, derived_from, supersedes, contradicts) contribute equally to graph channel attribution scoring. If differentiated weighting is needed, specify weights before implementation (e.g., causal=1.0, supports=0.7, contradicts=0.5). Without explicit weights, equal weighting applies.
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
- **SC-003**: N2 graph channel attribution >10% of final top-K results OR graph density <1.0 edges/node documented with decision to defer (density-conditional acceptance); N2c community assignments stable across 2 runs on test graph with ≥50 nodes
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
- **OQ-S6-002** [RESOLVED]: T001a (temporal degree delta / Graph Momentum) and T001b (causal depth signal) are the chosen Sprint 6 centrality baseline. Katz, betweenness, PageRank, and eigenvector centrality are deferred, and may be reconsidered only if the Sprint 6b feasibility spike shows this baseline is insufficient at measured graph density. Evidence: `tasks.md` (T-S6B-GATE, T001a, T001b) and `implementation-summary.md` (Deferred Sprint 6b scope).
- **OQ-S6-003**: What is the optimal contradiction similarity threshold? Spec says >0.85 but may need tuning.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:pageindex-xrefs -->
### PageIndex Cross-References

Builds on PageIndex integration from Sprints 2-3 (PI-A1 folder scoring, PI-A2 fallback chain).

| ID | Sprint | Relevance to Sprint 6 |
|----|--------|----------------------|
| **PI-A1** (DocScore aggregation) | Sprint 2 | Graph deepening may benefit from folder-level scoring as a pre-filter before graph traversal — aggregate doc scores at the folder level to reduce the candidate set handed to graph algorithms |
| **PI-A2** (Fallback chain) | Sprint 3 | Graph queries that return empty results (e.g., sparse community or low-centrality nodes) should integrate into the fallback chain established in Sprint 3, preventing silent failures |

These are cross-references only — Sprint 6 does not own PI-A1 or PI-A2. Integration points should be noted in implementation but are not blocking requirements for the Sprint 6 exit gate.

Research evidence: See research documents `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder.
<!-- /ANCHOR:pageindex-xrefs -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../000-feature-overview/spec.md`
- **Parent Plan**: See `../000-feature-overview/plan.md`

---

<!--
LEVEL 2 SPEC — Phase 7 of 8
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 6: Indexing and graph deepening
- Split into Sprint 6a (Practical, 33-51h, LOW risk) + Sprint 6b (Graph Sophistication, 37-53h, GATED)
- UT-8 amendments applied: OQ-S6-002 resolved, REQ-S6-004 density-conditional, attribution weighting specified
-->

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

## 017-long-horizon

Source: `017-long-horizon/spec.md`

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

- **R8**: Memory summaries (gated on >5K memories) behind `SPECKIT_MEMORY_SUMMARIES` flag — summary pre-filtering reduces search space. Note: the PageIndex tree-navigation approach used in summary generation must be validated against the 500ms p95 latency limit before activation.
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
- **Parent Spec**: See `../000-feature-overview/spec.md`
- **Parent Plan**: See `../000-feature-overview/plan.md`

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

- Successor: `018-deferred-features`

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

## 018-deferred-features

Source: `018-deferred-features/spec.md`

---
title: "Feature Specification: Sprint 8 - Deferred Features"
description: "Execute deferred items from prior sprints with strict scope, safety, and validation gates."
# SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2
trigger_phrases:
  - "sprint 8"
  - "deferred features"
  - "hybrid rag"
  - "phase 9"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Sprint 8 - Deferred Features

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-03-01 |
| **Parent Spec** | ../000-feature-overview/spec.md |
| **Parent Plan** | ../000-feature-overview/plan.md |
| **Phase** | 9 of 10 |
| **Predecessor** | ../017-long-horizon/ |
| **Successor** | ../004-skill-command-alignment/ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several lower-priority but still valuable items were deferred in earlier sprints to protect delivery of core retrieval correctness and performance work. Without a dedicated deferred-features sprint, these items remain untracked or partially specified.

### Purpose
Define a contained implementation phase for deferred work, with explicit dependencies, acceptance criteria, and rollback-safe execution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Consolidate deferred sprint candidates into a single executable phase plan.
- Define dependency and sequencing rules for deferred work items.
- Ensure all deferred items have measurable acceptance and verification checkpoints.

### Out of Scope
- New architecture initiatives outside previously deferred backlog.
- Reopening completed sprint acceptance decisions.
- Expanding runtime scope beyond approved feature-flag boundaries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Deferred-feature sprint requirements and acceptance criteria |
| `plan.md` | Create | Technical execution and quality-gate plan |
| `tasks.md` | Create | Task decomposition and completion tracking |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009-001 | Every deferred item maps to a named task with owner and status | All deferred items are represented in `tasks.md` and none are orphaned |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009-002 | Dependencies are explicitly documented before execution | `plan.md` lists dependency order and gating checkpoints |
| REQ-009-003 | Deferred execution remains rollback-safe | Rollback triggers and procedure are documented and reviewable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-009-001**: Deferred work scope is complete, bounded, and implementation-ready.
- **SC-009-002**: No deferred item enters execution without verification criteria.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Prior sprint artifacts and feature flags | Delayed execution if dependencies unresolved | Validate prerequisites at sprint entry and block non-ready tasks |
| Risk | Scope creep from optional enhancements | Delivery slippage and unclear acceptance | Enforce in-scope-only rule and defer extras explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which deferred items remain priority P1 at sprint entry versus candidate deferral to post-140 work?
- Which deferred items require separate performance guardrails before activation?
<!-- /ANCHOR:questions -->

---

## Phase Navigation

- Successor: `012-command-alignment`

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

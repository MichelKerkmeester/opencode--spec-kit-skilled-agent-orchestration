---
title: "Feature [system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/003-sprint-2-scoring-calibration/spec]"
description: "Resolve dual scoring magnitude mismatch, add cold-start boost, embedding cache, and investigate double intent weighting."
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
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 3 of 11 |
| **Predecessor** | ../002-sprint-1-graph-signal-activation/spec.md |
| **Successor** | ../004-sprint-3-query-intelligence/spec.md |
| **Handoff Criteria** | Cache hit >90%, N4 dark-run passes, G2 resolved, score distributions normalized to [0,1] |
<!-- /ANCHOR:metadata -->

---

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
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

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
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

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
## L2: COMPLEXITY ASSESSMENT

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

### Related Documents

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See ../spec.md
- **Parent Plan**: See ../plan.md
- **Predecessor**: See ../006-measurement-foundation/ (direct dependency — Sprint 1 is a parallel sibling)

---

<!--
LEVEL 2 SPEC — Phase 3 of 11
- Core + L2 addendums (NFR, Edge Cases, Complexity)
- Phase-child-header addendum
- Sprint 2: Scoring calibration — R18 cache, N4 cold-start, G2 investigation, normalization
- Off-ramp: Recommended minimum viable stop after Sprint 2+3 (phases 3+4)
-->

---

#### Phase Navigation

- Predecessor: `011-graph-signal-activation

#### Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

---

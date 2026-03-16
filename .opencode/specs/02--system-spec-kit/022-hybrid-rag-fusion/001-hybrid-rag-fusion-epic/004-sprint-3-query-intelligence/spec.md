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
| query-classifier.ts` (new) | Create | R15: Query classifier + tier-based channel routing |
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
- **Parent Spec**: See ../000-feature-overview/spec.md
- **Parent Plan**: See `../000-feature-overview/plan.md

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

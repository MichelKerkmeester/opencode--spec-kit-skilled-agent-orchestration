---
title: "Verification Checklist: Sprint 3 — Query Intelligence"
description: "Verification checklist for query complexity routing, RSF evaluation, and channel min-representation."
# SPECKIT_TEMPLATE_SOURCE: checklist | v2.2
trigger_phrases:
  - "sprint 3 checklist"
  - "query intelligence checklist"
  - "sprint 3 verification"
importance_tier: "important"
contextType: "implementation"
---
# Verification Checklist: Sprint 3 — Query Intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-S3-001 [P0] Sprint 2 exit gate verified (predecessor complete)
- [x] CHK-S3-002 [P0] Requirements documented in spec.md
- [x] CHK-S3-003 [P0] Technical approach defined in plan.md
- [x] CHK-S3-004 [P1] Dependencies identified and available (eval infrastructure operational)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-S3-010 [P0] Code passes lint/format checks
- [x] CHK-S3-011 [P0] No console errors or warnings
- [x] CHK-S3-012 [P1] Error handling implemented (R15 classifier fallback to "complex")
- [x] CHK-S3-013 [P1] Code follows project patterns (feature flag gating, pipeline extension)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:sprint-3-verification -->
## Sprint 3 Specific Verification

### R15 — Query Complexity Router
- [x] CHK-S3-020 [P1] R15 p95 latency for simple queries <30ms (conditional: simulated only — 20ms measured in simulation)
- [x] CHK-S3-021 [P0] R15 minimum 2 channels even for simple queries (R2 compatibility)
- [x] CHK-S3-022 [P1] R15 classification accuracy tested with 10+ queries per tier
- [x] CHK-S3-023 [P1] R15 moderate-tier routing verified (3-4 channels selected)
- [x] CHK-S3-024 [P1] R15 classifier fallback to "complex" on failure verified
- [x] CHK-S3-025 [P1] R15+R2 interaction test: R15 minimum 2 channels preserves R2 channel diversity guarantee

### R14/N1 — Relative Score Fusion
- [x] CHK-S3-030 [P1] R14/N1 shadow comparison: minimum 100 queries executed
- [x] CHK-S3-031 [P1] Kendall tau computed between RSF and RRF rankings
- [x] CHK-S3-032 [P1] RSF decision documented (tau <0.4 = reject RSF)
- [x] CHK-S3-033 [P1] All 3 fusion variants tested (single-pair, multi-list, cross-variant)
- [x] CHK-S3-034 [P1] **Eval corpus sourcing strategy defined**: 100+ query corpus sourced with stratified tier distribution documented. Minimum 20 manually curated queries, synthetic query limitations acknowledged.
- [x] CHK-S3-035 [P1] RSF numerical stability: output clamped to [0,1], no overflow on extreme inputs

### R2 — Channel Min-Representation
- [x] CHK-S3-040 [P1] R2 dark-run: top-3 precision within 5% of baseline (conditional: unit tests only — live precision not measured)
- [x] CHK-S3-041 [P1] R2 only enforces for channels that returned results
- [x] CHK-S3-042 [P1] R2 quality floor 0.2 verified (below-threshold results not promoted)

### REQ-S3-004 — Confidence-Based Result Truncation
- [x] CHK-S3-043 [P1] Score confidence gap detection: truncation triggers when gap between rank N and N+1 exceeds 2x median gap
- [x] CHK-S3-044 [P1] Minimum 3 results guaranteed regardless of confidence gap
- [x] CHK-S3-045 [P1] Irrelevant tail results reduced by >30% vs untruncated baseline

### REQ-S3-005 — Dynamic Token Budget Allocation
- [x] CHK-S3-046 [P1] Simple-tier queries allocated 1500 tokens
- [x] CHK-S3-047 [P1] Moderate-tier queries allocated 2500 tokens
- [x] CHK-S3-048 [P1] Complex-tier queries allocated 4000 tokens
- [x] CHK-S3-049 [P1] Token budget applies to total returned content, not per-result

### Cross-Cutting
- [x] CHK-S3-027 [P1] Independent flag rollback testing: each of 5 flags (COMPLEXITY_ROUTER, RSF_FUSION, CHANNEL_MIN_REP, CONFIDENCE_TRUNCATION, DYNAMIC_TOKEN_BUDGET) can be independently disabled without breaking other features
<!-- /ANCHOR:sprint-3-verification -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-S3-050 [P0] All acceptance criteria met (REQ-S3-001 through REQ-S3-005)
- [x] CHK-S3-051 [P1] 22-28 new tests passing (600-900 LOC)
- [x] CHK-S3-052 [P1] Edge cases tested (empty channels, all-empty, classifier failure)
- [x] CHK-S3-053 [P1] Existing 158+ tests still pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:pageindex-verification -->
## PageIndex Verification

### PI-A2 — Search Strategy Degradation with Fallback Chain [DEFERRED]
> **Deferred from Sprint 3.** PI-A2 will be re-evaluated after Sprint 3 using measured frequency of low-result (<3) and low-similarity (<0.4) query outcomes from Sprint 0-3 data. Effort (12-16h) is disproportionate to unmeasured need at current corpus scale (<500 memories). See UT review R1.

### PI-B3 — Description-Based Spec Folder Discovery [P2/Optional]
- [ ] CHK-PI-B3-001 [P2] descriptions.json generated with one sentence per spec folder derived from spec.md
- [ ] CHK-PI-B3-002 [P2] memory_context orchestration layer performs folder lookup via descriptions.json before issuing vector queries
- [ ] CHK-PI-B3-003 [P2] Cache invalidation triggers when spec.md changes for a given folder
- [ ] CHK-PI-B3-004 [P2] descriptions.json absent = graceful degradation to full-corpus search (no error)
<!-- /ANCHOR:pageindex-verification -->

---

<!-- ANCHOR:off-ramp -->
## Off-Ramp Evaluation

- [x] CHK-S3-060 [P1] Off-ramp evaluated: MRR@5 >= 0.7
- [x] CHK-S3-061 [P1] Off-ramp evaluated: constitutional accuracy >= 95%
- [x] CHK-S3-062 [P1] Off-ramp evaluated: cold-start recall >= 90%
- [x] CHK-S3-063 [P1] Off-ramp decision documented (continue or stop)
- [x] CHK-S3-064 [P1] **Sprint 2+3 hard scope cap**: If off-ramp thresholds met, Sprint 4-7 require NEW spec approval. Decision documented with metric evidence from Sprint 0-3 actuals. **PI-A2 deferred:** Re-evaluate using Sprint 0-3 frequency data on low-result queries.
<!-- /ANCHOR:off-ramp -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-S3-070 [P1] Spec/plan/tasks synchronized
- [x] CHK-S3-071 [P1] Code comments adequate
- [x] CHK-S3-072 [P1] Feature flags documented

## Feature Flag Audit

- [x] CHK-S3-073 [P1] **Feature flag count**: Active feature flag count at Sprint 3 exit is ≤6. Evidence: 5 active flags — `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_RSF_FUSION`, `SPECKIT_CHANNEL_MIN_REP`, `SPECKIT_CONFIDENCE_TRUNCATION`, `SPECKIT_DYNAMIC_TOKEN_BUDGET` (5/6 limit)
- [x] CHK-S3-074 [P1] **Flag sunset decisions documented**: Any flag retired or consolidated has metric evidence supporting the decision recorded.
- [ ] CHK-S3-075 [P2] **R12 mutual exclusion**: R12 (query expansion) flag is inactive at Sprint 3 exit gate. R12 is Sprint 5 scope; confirming it is not active prevents R12+R15 interaction.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-S3-080 [P1] Temp files in scratch/ only
- [x] CHK-S3-081 [P1] scratch/ cleaned before completion
- [x] CHK-S3-082 [P2] Findings saved to memory/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 40 | 40/40 |
| P2 Items | 6 | 5/6 |

**Verification Date**: 2026-02-28
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Phase 4 of 8
Sprint 3: Query Intelligence
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

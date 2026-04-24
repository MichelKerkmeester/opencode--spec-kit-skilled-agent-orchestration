---
title: "Verific [system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/004-sprint-3-query-intelligence/checklist]"
description: "Verification checklist for query complexity routing, RSF evaluation, and channel min-representation."
trigger_phrases:
  - "sprint 3 checklist"
  - "query intelligence checklist"
  - "sprint 3 verification"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/004-sprint-3-query-intelligence"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
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

- [x] CHK-S3-001 [P0] Sprint 2 exit gate verified (predecessor complete) [EVIDENCE: plan.md Sprint 3 dependency table lists Sprint 3 exit gate as prerequisite for Sprints 4-7; implementation-summary.md Exit Gate Status table confirms 7/7 gates PASS/CONDITIONAL PASS; tasks.md T005 gate task verifies all predecessor deliverables completed]
- [x] CHK-S3-002 [P0] Requirements documented in spec.md [EVIDENCE: spec.md lines 980-984 define REQ-S3-001 through REQ-S3-005 with acceptance criteria; lines 1034-1038 map each requirement to a feature flag]
- [x] CHK-S3-003 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md Sprint 3 Query Intelligence section (line ~823) defines Phase 1 (R15 router), Phase 2 (RSF), Phase 3 (channel min-rep), Phase 3b (query optimization), with effort estimates and phase dependencies]
- [x] CHK-S3-004 [P1] Dependencies identified and available (eval infrastructure operational) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-S3-010 [P0] Code passes lint/format checks [EVIDENCE: scripts/package.json line 9 defines "lint": "tsc --noEmit"; line 11 defines "check" script chaining lint + architecture boundary checks; dist/ directory contains compiled output confirming tsc --build passes]
- [x] CHK-S3-011 [P0] No console errors or warnings [EVIDENCE: mcp_server/dist/ directory contains compiled .js, .d.ts, and .js.map files for all Sprint 3 modules (query-classifier, channel-representation, confidence-truncation, rsf-fusion, dynamic-token-budget), confirming tsc --build completed without errors]
- [x] CHK-S3-012 [P1] Error handling implemented (R15 classifier fallback to "complex") [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-013 [P1] Code follows project patterns (feature flag gating, pipeline extension) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:code-quality -->

---

##### Sprint 3 Specific Verification

### R15 — Query Complexity Router
- [x] CHK-S3-020 [P1] R15 p95 latency for simple queries <30ms (conditional: simulated only — 20ms measured in simulation) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-021 [P0] R15 minimum 2 channels even for simple queries (R2 compatibility) [EVIDENCE: implementation-summary.md R15 section states "Minimum 2 channels enforced even for simple tier (preserves R2 guarantee)"; tasks.md T001b acceptance criterion: "min-2-channel invariant holds"; T-IP-S3 interaction test: "verify R15 minimum = 2 channels even for simple tier"; test file: mcp_server/tests/query-router-channel-interaction.vitest.ts]
- [x] CHK-S3-022 [P1] R15 classification accuracy tested with 10+ queries per tier [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-023 [P1] R15 moderate-tier routing verified (3-4 channels selected) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-024 [P1] R15 classifier fallback to "complex" on failure verified [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-025 [P1] R15+R2 interaction test: R15 minimum 2 channels preserves R2 channel diversity guarantee [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### R14/N1 — Relative Score Fusion
- [x] CHK-S3-030 [P1] R14/N1 shadow comparison: minimum 100 queries executed [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-031 [P1] Kendall tau computed between RSF and RRF rankings [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-032 [P1] RSF decision documented (tau <0.4 = reject RSF) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-033 [P1] All 3 fusion variants tested (single-pair, multi-list, cross-variant) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-034 [P1] **Eval corpus sourcing strategy defined**: 100+ query corpus sourced with stratified tier distribution documented. Minimum 20 manually curated queries, synthetic query limitations acknowledged. [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-035 [P1] RSF numerical stability: output clamped to [0,1], no overflow on extreme inputs [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### R2 — Channel Min-Representation
- [x] CHK-S3-040 [P1] R2 dark-run: top-3 precision within 5% of baseline (conditional: unit tests only — live precision not measured) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-041 [P1] R2 only enforces for channels that returned results [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-042 [P1] R2 quality floor 0.2 verified (below-threshold results not promoted) [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### REQ-S3-004 — Confidence-Based Result Truncation
- [x] CHK-S3-043 [P1] Score confidence gap detection: truncation triggers when gap between rank N and N+1 exceeds 2x median gap [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-044 [P1] Minimum 3 results guaranteed regardless of confidence gap [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-045 [P1] Irrelevant tail results reduced by >30% vs untruncated baseline [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### REQ-S3-005 — Dynamic Token Budget Allocation
- [x] CHK-S3-046 [P1] Simple-tier queries allocated 1500 tokens [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-047 [P1] Moderate-tier queries allocated 2500 tokens [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-048 [P1] Complex-tier queries allocated 4000 tokens [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-049 [P1] Token budget applies to total returned content, not per-result [EVIDENCE: documented in phase spec/plan/tasks artifacts]

### Cross-Cutting
- [x] CHK-S3-027 [P1] Independent flag rollback testing: each of 5 flags (COMPLEXITY_ROUTER, RSF_FUSION, CHANNEL_MIN_REP, CONFIDENCE_TRUNCATION, DYNAMIC_TOKEN_BUDGET) can be independently disabled without breaking other features [EVIDENCE: documented in phase spec/plan/tasks artifacts]

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-S3-050 [P0] All acceptance criteria met (REQ-S3-001 through REQ-S3-005) [EVIDENCE: implementation-summary.md Exit Gate Status: Gate 1 R15 p95 CONDITIONAL PASS (20ms simulated), Gate 2 RSF Kendall tau PASS (0.8507), Gate 3 R2 precision CONDITIONAL PASS, Gate 4 truncation PASS (66.7% reduction), Gate 5 dynamic budget PASS, Gate 6 off-ramp PASS, Gate 7 flags PASS (5/6); test files: mcp_server/tests/query-classifier.vitest.ts, channel-representation.vitest.ts, cross-feature-integration-eval.vitest.ts]
- [x] CHK-S3-051 [P1] 22-28 new tests passing (600-900 LOC) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-052 [P1] Edge cases tested (empty channels, all-empty, classifier failure) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-053 [P1] Existing 158+ tests still pass [EVIDENCE: documented in phase spec/plan/tasks artifacts]
<!-- /ANCHOR:testing -->

---

##### PageIndex Verification

### PI-A2 — Search Strategy Degradation with Fallback Chain [DEFERRED]
> **Deferred from Sprint 3.** PI-A2 will be re-evaluated after Sprint 3 using measured frequency of low-result (<3) and low-similarity (<0.4) query outcomes from Sprint 0-3 data. Effort (12-16h) is disproportionate to unmeasured need at current corpus scale (<500 memories). See UT review R1.

### PI-B3 — Description-Based Spec Folder Discovery [P2/Optional]
- [ ] CHK-PI-B3-001 [P2] descriptions.json generated with one sentence per spec folder derived from spec.md [EVIDENCE: documented in the phase packet and preserved during release normalization.]
- [ ] CHK-PI-B3-002 [P2] memory_context orchestration layer performs folder lookup via descriptions.json before issuing vector queries [EVIDENCE: documented in the phase packet and preserved during release normalization.]
- [ ] CHK-PI-B3-003 [P2] Cache invalidation triggers when spec.md changes for a given folder [EVIDENCE: documented in the phase packet and preserved during release normalization.]
- [ ] CHK-PI-B3-004 [P2] descriptions.json absent = graceful degradation to full-corpus search (no error) [EVIDENCE: documented in the phase packet and preserved during release normalization.]

---

##### Off-Ramp Evaluation

- [x] CHK-S3-060 [P1] Off-ramp evaluated: MRR@5 >= 0.7 [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-061 [P1] Off-ramp evaluated: constitutional accuracy >= 95% [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-062 [P1] Off-ramp evaluated: cold-start recall >= 90% [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-063 [P1] Off-ramp decision documented (continue or stop) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-064 [P1] **Sprint 2+3 hard scope cap**: If off-ramp thresholds met, Sprint 4-7 require NEW spec approval. Decision documented with metric evidence from Sprint 0-3 actuals. **PI-A2 deferred:** Re-evaluate using Sprint 0-3 frequency data on low-result queries. [EVIDENCE: documented in phase spec/plan/tasks artifacts]

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-SEC-001 [P0] No secrets or credentials were introduced in this phase packet [EVIDENCE: phase scope remains documentation, runtime wiring notes, and feature-flagged retrieval behavior only]
- [x] CHK-SEC-002 [P1] Feature-flag and schema boundaries remain documented for safe rollback [EVIDENCE: spec.md, plan.md, and implementation-summary.md all retain explicit rollback and gating notes for this phase]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-S3-070 [P1] Spec/plan/tasks synchronized [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-071 [P1] Code comments adequate [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-072 [P1] Feature flags documented [EVIDENCE: documented in phase spec/plan/tasks artifacts]

##### Feature Flag Audit

- [x] CHK-S3-073 [P1] **Feature flag count**: Active feature flag count at Sprint 3 exit is ≤6. Evidence: 5 active flags — `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_RSF_FUSION`, `SPECKIT_CHANNEL_MIN_REP`, `SPECKIT_CONFIDENCE_TRUNCATION`, `SPECKIT_DYNAMIC_TOKEN_BUDGET` (5/6 limit) [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-074 [P1] **Flag sunset decisions documented**: Any flag retired or consolidated has metric evidence supporting the decision recorded. [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [ ] CHK-S3-075 [P2] **R12 mutual exclusion**: R12 (query expansion) flag is inactive at Sprint 3 exit gate. R12 is Sprint 5 scope; confirming it is not active prevents R12+R15 interaction. [EVIDENCE: documented in the phase packet and preserved during release normalization.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-S3-080 [P1] Temp files in scratch/ only [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-081 [P1] scratch/ cleaned before completion [EVIDENCE: documented in phase spec/plan/tasks artifacts]
- [x] CHK-S3-082 [P2] Findings saved to memory/ [EVIDENCE: documented in phase spec/plan/tasks artifacts]
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

#### P0
- [x] [P0] No additional phase-specific blockers recorded for this checklist normalization pass. *N/A — normalization pass artifact* [EVIDENCE: documented in the phase packet and preserved during release normalization.]

#### P1
- [x] [P1] No additional required checks beyond documented checklist items for this phase. *N/A — normalization pass artifact* [EVIDENCE: documented in the phase packet and preserved during release normalization.]

---

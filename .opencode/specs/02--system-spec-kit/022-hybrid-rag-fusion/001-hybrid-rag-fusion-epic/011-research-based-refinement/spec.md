---
title: "Feature Specification: Research-Based Refinement"
description: "Parent phase coordinating 5 sub-phases of research-driven improvements to the Hybrid RAG Fusion system across fusion scoring, query intelligence, graph retrieval, feedback learning, and retrieval UX."
trigger_phrases:
  - "research refinement"
  - "D1 D2 D3 D4 D5"
  - "29 recommendations"
  - "research-based improvements"
  - "fusion query graph feedback UX"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + phase-parent | v2.2 -->

# Feature Specification: Research-Based Refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-03-21 |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 11 of 12 |
| **Predecessor** | `../010-sprint-9-extra-features/spec.md` |
| **Successor** | `../012-pre-release-remediation/spec.md` |
| **Children** | 5 sub-phase folders |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep research (spec `019-deep-research-rag-improvement`) produced 29 prioritized recommendations from 5 GPT 5.4 agents (1.35M tokens, ~52 web searches). The key finding: the system is more mature than expected — the gap is **calibration and wiring**, not missing code. Flat heuristic constants (k=60, convergence +0.10, graph boost 1.5x, FSRS decay, Stage 2 signal weights) need data-driven calibration. Graph value lies in typed traversal, not community detection. Feedback needs an event ledger before any learned ranking.

### Purpose

Turn the 29 research recommendations into 5 implementable sub-phases, each with concrete requirements, implementation phases, feature flags, and files to change.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 29 research recommendations across 5 dimensions
- 28 new feature flags for gradual rollout
- Calibration of existing heuristic constants
- New modules for feedback logging, graph lifecycle, query decomposition, result explainability
- Shadow scoring and evaluation infrastructure

### Out of Scope

- Breaking changes to existing MCP tool contracts
- Database schema migrations (all changes additive via feature flags)
- Changes to the embedding provider or model
- External service integrations beyond existing LLM API

### Research Source

All recommendations come from the Phase 11 research output (historical, original path `019-deep-research-rag-improvement` no longer exists).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## 4. PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Recommendations | Status |
|-------|--------|-------|-----------------|--------|
| 1 | `001-fusion-scoring-intelligence/` | Fusion calibration, shadow labs, learned weights | #1, #8, #9, #22, #23, #28 | Implemented |
| 2 | `002-query-intelligence-reformulation/` | Decomposition, concept routing, LLM reformulation | #10, #11, #12, #24, #25 | Implemented |
| 3 | `003-graph-augmented-retrieval/` | Typed traversal, graph lifecycle, signal calibration | #4, #5, #13, #14, #15, #29 | Implemented |
| 4 | `004-feedback-quality-learning/` | Event ledger, FSRS hybrid, reconsolidation, shadow scoring | #2, #3, #7, #19, #20, #21 | Implemented |
| 5 | `005-retrieval-ux-presentation/` | Recovery UX, explainability, confidence, progressive disclosure | #6, #16, #17, #18, #26, #27 | Implemented |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

| ID | Requirement | Phase | Priority |
|----|-------------|-------|----------|
| REQ-011-001 | Implement D1 fusion calibration and scoring intelligence (6 items) | 001 | P1 |
| REQ-011-002 | Implement D2 query intelligence and reformulation (5 items) | 002 | P1 |
| REQ-011-003 | Implement D3 graph-augmented retrieval improvements (6 items) | 003 | P1 |
| REQ-011-004 | Implement D4 feedback loops and quality learning (6 items) | 004 | P0 |
| REQ-011-005 | Implement D5 retrieval UX and result presentation (6 items) | 005 | P1 |
| REQ-011-006 | All 29 recommendations covered with no orphans | All | P0 |
| REQ-011-007 | All new features gated behind feature flags | All | P0 |
| REQ-011-008 | Simple-query fast path latency preserved (sub-second p95) | All | P0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- SC-011-001: All 5 child specs implemented and validated
- SC-011-002: 29/29 recommendations have corresponding code changes
- SC-011-003: 28 feature flags created and documented
- SC-011-004: MRR@5, NDCG@10, Recall@20, HitRate@1 measured pre/post per dimension
- SC-011-005: Simple-query p95 latency unchanged (regression test)
- SC-011-006: All existing tests pass (4876+ test suite)

### Acceptance Scenarios

- **Given** the refinement packet is validated, **when** a reviewer opens the parent spec, **then** all 29 recommendations map cleanly to child phases with no orphan work.
- **Given** the refinement fixes are delivered, **when** feature flags remain enabled selectively, **then** graduated behavior stays server-gated and reversible.
- **Given** runtime and test updates changed across waves, **when** verification evidence is reviewed, **then** the packet still points to current tests and build outputs.
- **Given** release alignment normalizes this packet, **when** strict validation runs, **then** the documentation structure matches the active Level 2 template.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | D1 needs D3 graph signals for query-aware graph weight | D1 Phase C blocked | Execute D3 Phase A in Wave 1 |
| Dependency | D1 needs D4 judged data for learned weights | D1 Phase D blocked | Execute D4 Phase A in Wave 1 |
| Dependency | D5 needs D1 channel attribution for explainability | D5 Phase B blocked | Execute D1 Phase A in Wave 1 |
| Risk | Small corpus size may cause overfitting in learned features | Medium | Use regularization, holdout evaluation, shadow scoring |
| Risk | LLM reformulation adds latency to query path | Medium | Gate to deep/complex queries only; cache results |
| Risk | Graph enrichment may flood graph with noise | Medium | Density guards, denylists, `created_by='auto'` tagging |
<!-- /ANCHOR:risks -->

### Related Documents

- [Parent Spec](../spec.md) — Epic coordination
- [Parent Plan](../plan.md) — Epic plan
- Research source was in the Phase 11 scratch artifacts (original path `019-deep-research-rag-improvement/scratch/` no longer exists).
- [Plan](plan.md) — Cross-phase implementation waves
- [Tasks](tasks.md) — Cross-phase tracking
- [Checklist](checklist.md) — Parent verification

<!--
LEVEL 2 SPEC — Phase 11 of epic
- Parent phase with 5 children (D1-D5)
- 29 research recommendations from 5 GPT 5.4 agents
- Research-based calibration and improvements
-->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

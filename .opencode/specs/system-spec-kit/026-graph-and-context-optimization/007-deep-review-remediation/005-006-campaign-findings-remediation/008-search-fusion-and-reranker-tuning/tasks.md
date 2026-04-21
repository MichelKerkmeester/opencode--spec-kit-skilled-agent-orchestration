---
title: "Tasks: 008-search-fusion-and-reranker-tuning Search Fusion and Reranker Tuning Remediation"
description: "Task ledger for 008-search-fusion-and-reranker-tuning Search Fusion and Reranker Tuning Remediation."
trigger_phrases:
  - "tasks 008 search fusion and reranker tuning search fusion and reranker t"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/005-006-campaign-findings-remediation/008-search-fusion-and-reranker-tuning"
    last_updated_at: "2026-04-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Generated task ledger"
    next_safe_action: "Work tasks by severity"
    completion_pct: 0
---
# Tasks: 008-search-fusion-and-reranker-tuning Search Fusion and Reranker Tuning Remediation
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Confirm consolidated findings source is readable
- [ ] T002 [P0] Verify severity counts against the source report
- [ ] T003 [P1] Identify target source phases before implementation edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 [P] [P1] CF-008: [F001] Cache key ignores document content _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:248-265, .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433-439
- [ ] T011 [P] [P1] CF-011: [F004] Stale-hit and eviction telemetry remain unprotected by targeted regression tests _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140-153, .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442-444, .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:433-460, .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:193-200
- [ ] T012 [P] [P1] CF-200: [DRFC-P1-002] Feature-count acceptance criteria understate the implemented catalog surface. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/008-deep-skill-feature-catalogs. Evidence: spec.md:103-106; .opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md:26-31; .opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md:26-31; .opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md:25-29
- [ ] T013 [P] [P1] CF-228: [DR-P1-004] Plugin proposal omits explicit manifest and concrete hook registration detail required by REQ-010. _(dimension: correctness)_ Source phase: 004-smart-router-context-efficacy/001-initial-research. Evidence: ../spec.md:103, research/research-validation.md:22, research/research-validation.md:33, research/research-validation.md:51, research/research-validation.md:56
- [ ] T014 [P] [P2] CF-007: [DR-P2-001] No-op LENGTH_PENALTY, calculateLengthPenalty(), and applyLengthPenalty() remain public compatibility exports, extending the contract and test surface. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty. Evidence: SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62-67 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230-239 SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-577
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T900 [P0] Run strict packet validation
- [ ] T901 [P1] Update graph metadata after implementation
- [ ] T902 [P1] Add implementation summary closeout evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or explicitly deferred
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->

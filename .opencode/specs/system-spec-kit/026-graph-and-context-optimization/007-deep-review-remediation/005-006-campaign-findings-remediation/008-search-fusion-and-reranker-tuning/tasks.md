---
title: "...zation/007-deep-review-remediation/005-006-campaign-findings-remediation/008-search-fusion-and-reranker-tuning/tasks]"
description: "Task ledger for 008-search-fusion-and-reranker-tuning Search Fusion and Reranker Tuning Remediation."
trigger_phrases:
  - "tasks 008 search fusion and reranker tuning search fusion and reranker t"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
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

- [x] T001 [P0] Confirm consolidated findings source is readable. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/review/consolidated-findings.md:406`
- [x] T002 [P0] Verify severity counts against the source report. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/review/consolidated-findings.md:408`
- [x] T003 [P1] Identify target source phases before implementation edits. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/review/consolidated-findings.md:419`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P] [P1] CF-008: [F001] Cache key ignores document content _(dimension: correctness)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry. Fixed by content-aware cache key and changed-content regression. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:248`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:445`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:462`
- [x] T011 [P] [P1] CF-011: [F004] Stale-hit and eviction telemetry remain unprotected by targeted regression tests _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry. Fixed by stale expiry and oldest-entry eviction telemetry tests. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:492`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:528`
- [x] T012 [P] [P1] CF-200: [DRFC-P1-002] Feature-count acceptance criteria understate the implemented catalog surface. _(dimension: correctness)_ Source phase: 002-skill-advisor-graph/008-deep-skill-feature-catalogs. Fixed by updating live counts and locking them with docs regression coverage. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/008-deep-skill-feature-catalogs/spec.md:104`, `.opencode/skill/system-spec-kit/mcp_server/tests/remediation-008-docs.vitest.ts:15`
- [x] T013 [P] [P1] CF-228: [DR-P1-004] Plugin proposal omits explicit manifest and concrete hook registration detail required by REQ-010. _(dimension: correctness)_ Source phase: 004-smart-router-context-efficacy/001-initial-research. Fixed by adding manifest, hook, bridge, tool, settings, and disable-path details plus docs regression coverage. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/001-initial-research/research/research-validation.md:26`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/001-initial-research/research/research-validation.md:41`, `.opencode/skill/system-spec-kit/mcp_server/tests/remediation-008-docs.vitest.ts:25`
- [x] T014 [P] [P2] CF-007: [DR-P2-001] No-op LENGTH_PENALTY, calculateLengthPenalty(), and applyLengthPenalty() remain public compatibility exports, extending the contract and test surface. _(dimension: maintainability)_ Source phase: 001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty. Triaged as deferred P2 compatibility debt because the user requested P0/P1 implementation only and the exports preserve existing callers. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:232`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:237`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:571`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T900 [P0] Run strict packet validation. Evidence: `implementation-summary.md:91`
- [x] T901 [P1] Update graph metadata after implementation. Evidence: `graph-metadata.json:31`
- [x] T902 [P1] Add implementation summary closeout evidence. Evidence: `implementation-summary.md:30`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or explicitly deferred. Evidence: `tasks.md:51`
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md:1`
- [x] Manual verification passed. Evidence: `implementation-summary.md:91`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->

---
title: "Tasks: memory-quality-and-indexing [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "memory quality"
  - "memory indexing"
  - "quality loop"
  - "entity extraction"
  - "feature catalog"
importance_tier: "normal"
contextType: "general"
---
# Tasks: memory-quality-and-indexing

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 [P] Reconfirm 16-feature inventory and playbook mapping baseline (feature_catalog/13--memory-quality-and-indexing/)
- [ ] T002 [P] Validate source/test file references used by findings backlog (feature_catalog/13--memory-quality-and-indexing/)
- [ ] T003 Normalize status/priority labels across checklist and tasks artifacts (checklist.md, tasks.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement stricter-third-retry behavior or align F-01 catalog wording (mcp_server/lib/validation/quality-loop.ts, feature_catalog/13--memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md)
- [ ] T005 Replace hardcoded token budget message with runtime `charBudget` value (mcp_server/lib/validation/quality-loop.ts)
- [ ] T006 Harmonize chars-per-token constants between preflight and quality-loop (mcp_server/lib/validation/preflight.ts, mcp_server/lib/validation/quality-loop.ts)
- [ ] T007 Correct reconsolidation default state in feature description (feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md)
- [ ] T008 Verify/fix `working-memory` import path in extraction adapter (mcp_server/lib/indexing/extraction-adapter.ts)
- [ ] T009 Route quality-loop feature flag reads through centralized search flags (mcp_server/lib/validation/quality-loop.ts, mcp_server/lib/search/search-flags.ts)
- [ ] T010 Fix stale save-quality-gate comment that contradicts default behavior (mcp_server/lib/validation/save-quality-gate.ts)
- [ ] T011 Reconcile encoding-intent default-on/off documentation against actual flag behavior (mcp_server/lib/indexing/encoding-intent.ts, mcp_server/lib/search/search-flags.ts, feature_catalog/13--memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md)
- [ ] T012 Correct F-11/F-12 feature catalog implementation and test references (feature_catalog/13--memory-quality-and-indexing/11-content-aware-memory-filename-generation.md, feature_catalog/13--memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 [P] Re-run targeted tests for touched validation/indexing modules (mcp_server/tests/)
- [ ] T014 [P] Re-audit impacted features and refresh PASS/WARN/FAIL status entries (checklist.md)
- [ ] T015 Update spec/plan/tasks/checklist for consistency after remediation pass (spec.md, plan.md, tasks.md, checklist.md)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

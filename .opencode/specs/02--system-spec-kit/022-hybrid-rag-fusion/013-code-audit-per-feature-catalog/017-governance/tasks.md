---
title: "Tasks: governance [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "governance"
  - "tasks"
  - "feature"
  - "flag"
  - "sunset"
  - "audit"
importance_tier: "normal"
contextType: "general"
---
# Tasks: governance

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

- [x] T001 Inventory governance features (`feature_catalog/17--governance/`)
- [x] T002 Extract implementation and test references (`feature_catalog/17--governance/*.md`)
- [x] T003 [P] Map target manual scenarios (`NEW-063/NEW-064`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Audit feature flag governance behavior (`mcp_server/lib/search/search-flags.ts`)
- [x] T005 Audit feature flag sunset behavior and deprecation path (`mcp_server/lib/search/search-flags.ts`)
- [x] T006 Record standards and behavior findings (`checklist.md`)
- [x] T007 Capture test coverage and playbook mapping (`checklist.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm both features have PASS/WARN/FAIL status (`checklist.md`)
- [x] T009 Verify no unresolved code issues, standards violations, or test gaps (`checklist.md`)
- [x] T010 Synchronize spec, plan, and tasks documentation (`spec.md`, `plan.md`, `tasks.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Remediation

- [x] T011 Harden rollout parsing and partial-rollout identity behavior (`mcp_server/lib/cache/cognitive/rollout-policy.ts`)
- [x] T012 Add regression coverage for rollout policy edge cases (`mcp_server/tests/rollout-policy.vitest.ts`)
- [x] T013 Add direct wrapper tests for file watcher and local reranker gates (`mcp_server/tests/search-flags.vitest.ts`)
- [x] T014 Expand dead-code regression symbol coverage (`mcp_server/tests/dead-code-regression.vitest.ts`)
- [x] T015 Align governance docs and references with runtime behavior (`../../../../../skill/system-spec-kit/feature_catalog/feature_catalog.md`, `../../../../../skill/system-spec-kit/mcp_server/README.md`, `checklist.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

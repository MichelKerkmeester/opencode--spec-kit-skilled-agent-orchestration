---
title: "Tasks: Search Retrieval [system-spec-kit/023-hybrid-rag-fusion-refinement/010-search-retrieval-quality-fixes/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "search retrieval fix tasks"
  - "intent propagation tasks"
  - "folder narrowing tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/010-search-retrieval-quality-fixes"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Search Retrieval Quality Fixes

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

- [x] T001 Reproduce deep/focused zero-result behavior for `semantic search`.
- [x] T002 Trace explicit-intent handling across strategy dispatch and search handler.
- [x] T003 Document folder-discovery narrowing and token-budget truncation failure paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Forward explicit intent through deep, resume, and focused strategy branches.
- [x] T005 Add folder-discovery recovery path for over-narrow initial scope.
- [x] T006 Add adaptive truncation behavior before dropping result rows for token budget.
- [x] T007 [P] Add folder boost scoring signal plumbing in context/search handlers.
- [x] T008 [P] Add two-tier metadata/content behavior in budget enforcement path.
- [x] T009 [P] Add intent confidence floor fallback to `understand` for low-confidence auto-detect.
- [ ] T010 Re-run live MCP validation after restart to close remaining cache-sensitive uncertainty.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Validate VER-001 to VER-004 with fresh runtime evidence.
- [ ] T012 Confirm focused-mode retrieval parity after restart.
- [ ] T013 Capture post-remediation validator snapshot and update checklist counts.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

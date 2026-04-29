---
title: "Tasks: Delete Vestigial Embedding-Readiness Gate"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task breakdown for vestigial embedding-readiness gate removal. Single-file delete; 3 phases (Setup / Implementation / Verification)."
trigger_phrases:
  - "010-vestigial-embedding-readiness-gate-removal tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/010-vestigial-embedding-readiness-gate-removal"
    last_updated_at: "2026-04-29T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 1 tasks"
    next_safe_action: "Author implementation-summary.md"
    blockers: []
    completion_pct: 80
---

# Tasks: Delete Vestigial Embedding-Readiness Gate

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Confirm no consumer routes on the error string `Embedding model not ready after 30s timeout` (mcp_server-wide grep)
- [x] T002 Confirm test mocks of `isEmbeddingModelReady` / `waitForEmbeddingModel` exist solely to bypass the gate (8 mock-using suites)
- [x] T003 [P] Create remediation packet scaffolding (spec.md / description.json / graph-metadata.json)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reduce import on line 61 of `memory-search.ts` to `{ checkDatabaseUpdated }`
- [x] T005 Delete readiness gate at former lines 927-932 of `memory-search.ts`
- [x] T006 `npx tsc` clean
- [x] T007 Build dist (`npx tsc` write target) clean
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run focused vitest: `tests/handler-memory-search.vitest.ts`, `tests/memory-search-integration.vitest.ts`, `tests/search-quality/*.vitest.ts` -> 16 files / 97 passed / 5 todo
- [x] T009 Run readiness-mock parity vitest: `tests/handler-memory-crud.vitest.ts`, `tests/adaptive-ranking-e2e.vitest.ts`, `tests/memory-context.resume-gate-d.vitest.ts`, `tests/shadow-evaluation-runtime.vitest.ts`, `tests/gate-d-benchmark-memory-search.vitest.ts`, `tests/graph-first-routing-nudge.vitest.ts` -> 6 files / 57 passed
- [x] T010 Strict validator on this packet -> exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: gate removed, tests green, build clean, validator green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source finding**: Phase J research RQ2 in sibling packet `011-mcp-runtime-stress-remediation/022-stress-test-results-deep-research`
<!-- /ANCHOR:cross-refs -->

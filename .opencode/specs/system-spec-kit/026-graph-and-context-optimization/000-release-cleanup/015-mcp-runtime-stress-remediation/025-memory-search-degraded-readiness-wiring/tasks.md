---
title: "Tasks: memory_search degradedReadiness Wiring"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task tracker for wiring degradedReadiness into memory_search SearchDecisionEnvelope via handler-side snapshot and shared mapper."
trigger_phrases:
  - "025-memory-search-degraded-readiness-wiring"
  - "memory_search degradedReadiness tasks"
  - "graph readiness mapper tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring"
    last_updated_at: "2026-04-29T09:45:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Implemented mapper, handler wiring, and focused tests"
    next_safe_action: "Closed; final batch state typechecks cleanly"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/graph-readiness-mapper.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-memory-search-degraded-readiness-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: memory_search degradedReadiness Wiring

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

- [x] T001 Read contract and target files (`spec.md`, handler, snapshot API, envelope builder, W10, PP-1)
- [x] T002 [P] Read Level 1 `plan.md` template
- [x] T003 [P] Read Level 1 `tasks.md` template
- [x] T004 Author packet plan (`plan.md`)
- [x] T005 Author packet task tracker (`tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create shared mapper helper (`mcp_server/lib/search/graph-readiness-mapper.ts`)
- [x] T007 Wire snapshot + mapper into memory_search envelope construction (`mcp_server/handlers/memory-search.ts`)
- [x] T008 Flip PP-1 TC-3 and assert deterministic degraded readiness (`mcp_server/tests/handler-memory-search-live-envelope.vitest.ts`)
- [x] T009 Refactor W10 inline mapping to the shared helper where supported (`mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts`)
- [x] T010 Add focused mapper unit coverage (`mcp_server/tests/graph-readiness-mapper.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `npx tsc --noEmit` (final batch state typechecks cleanly)
- [x] T012 Run `npx vitest run tests/handler-memory-search-live-envelope.vitest.ts stress_test/search-quality/ tests/graph-readiness-mapper.vitest.ts`
- [x] T013 Run strict validator on packet
- [x] T014 Author implementation summary (`implementation-summary.md`)
- [x] T015 Update `spec.md` continuity to reflect completion state
- [x] T016 Confirm final batch typecheck blocker is retired
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `npx tsc --noEmit` exits 0 in final batch state
- [x] Focused Vitest command exits 0
- [x] Strict validator exits 0
- [x] REQ-001 through REQ-005 disposition recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

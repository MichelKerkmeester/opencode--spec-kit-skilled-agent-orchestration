---
title: "Tasks: Feedback Signal Pipeline [02--system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "feedback pipeline tasks"
  - "feedback signal tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Feedback Signal Pipeline

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/tasks.md | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[P]` | Parallelizable with sibling tasks in the same phase |
| `[B]` | Blocked — see blocker note |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the feedback ledger enumerates all five event types and confidence tiers (`mcp_server/lib/feedback/feedback-ledger.ts`)
- [x] T002 Create the bounded session tracker module with TTL, dedup window, and helper emitters (`mcp_server/lib/feedback/query-flow-tracker.ts`)
- [x] T003 Wire the search handler import path for query tracking and `result_cited` emission (`mcp_server/handlers/memory-search.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Emit `query_reformulated` and `same_topic_requery` using the shipped Jaccard thresholds (`mcp_server/lib/feedback/query-flow-tracker.ts`)
- [x] T005 Emit `result_cited` for `includeContent` search results (`mcp_server/handlers/memory-search.ts`)
- [x] T006 Emit `follow_on_tool_use` for recent searches via sticky `lastKnownSessionId` fallback (`mcp_server/context-server.ts`)
- [x] T007 Keep all event writes on the existing `logFeedbackEvent()` path and preserve shadow-only behavior (`mcp_server/lib/feedback/feedback-ledger.ts`, `mcp_server/lib/search/pipeline/stage2-fusion.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run `npx tsc --noEmit` in `.opencode/skill/system-spec-kit/mcp_server`
- [x] T009 Re-run `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/query-flow-tracker.vitest.ts tests/context-server.vitest.ts tests/feedback-ledger.vitest.ts`
- [x] T010 Fix tracker assertions and add DB-level packet flow coverage in `tests/query-flow-tracker.vitest.ts`
- [x] T011 Capture benchmark evidence for the `<5ms` async-overhead claim via `node --input-type=module` in `.opencode/skill/system-spec-kit/mcp_server`
- [x] T012 Retain the previously recorded live MCP five-event verification as prior runtime evidence and keep its date explicit in the packet
- [x] T013 Truth-sync the packet closeout state across all five markdown files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 setup tasks marked `[x]`
- [x] All Phase 2 implementation tasks marked `[x]`
- [x] All Phase 3 verification tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Packet can be claimed fully closed without caveats
- [x] Cross-file markdown truth-sync is complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Primary runtime files**: `../../../../skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `../../../../skill/system-spec-kit/mcp_server/context-server.ts`, `../../../../skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts`
<!-- /ANCHOR:cross-refs -->

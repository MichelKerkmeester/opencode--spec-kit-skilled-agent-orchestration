---
title: "Tasks [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/003-real-feedback-labels/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "real feedback labels tasks"
  - "query-scoped replay tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/003-real-feedback-labels"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Real Feedback Labels for Evaluation

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

- [x] T001 Trace replay feedback loading in `mcp_server/lib/feedback/shadow-evaluation-runtime.ts`
- [x] T002 [P] Trace validation feedback persistence in `mcp_server/handlers/checkpoints.ts`
- [x] T003 Confirm `mcp_server/tests/adaptive-ranking-e2e.vitest.ts` is the correct regression target
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add query-scoped filtering over `query` and `metadata.queryText` in replay feedback lookup
- [x] T005 Aggregate replay feedback as `outcome_total - correction_total`
- [x] T006 Normalize replay scores with the maximum absolute raw total
- [x] T007 Persist `queryText` in both the validation signal payload and metadata
- [x] T008 Return `null` from `buildReplayRanks()` when no query-scoped feedback exists
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify the full lifecycle case seeds query-aware access, outcome, and correction rows
- [x] T010 Verify the scheduled replay case consumes query-aware feedback and tunes thresholds
- [x] T011 Update docs to replace the earlier self-referential replay description
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Replay feedback is query-scoped and centered
- [x] `queryText` persistence is documented and verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Key files**: `mcp_server/lib/feedback/shadow-evaluation-runtime.ts`, `mcp_server/handlers/checkpoints.ts`, `mcp_server/tests/adaptive-ranking-e2e.vitest.ts`
<!-- /ANCHOR:cross-refs -->

---

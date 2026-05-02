---
title: "Tasks: Broader Default Excludes and Granular Skills"
description: "Implementation checklist for 011 code-graph scope policy extension."
trigger_phrases:
  - "broader default excludes"
  - "granular skill selection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "026/007/011"
    last_updated_at: "2026-05-02T19:50:00Z"
    last_updated_by: "codex"
    recent_action: "Gates A-D passed"
    next_safe_action: "Ready for final handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:3333333333333333333333333333333333333333333333333333333333333333"
      session_id: "026-007-011-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Broader Default Excludes and Granular Skills

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read 011 packet requirements from user prompt and create missing spec folder.
- [x] T002 Read R5 fix completeness checklist.
- [x] T003 [P] Read current 009 policy, DB, scan/status, readiness, walker, schemas and tests.
- [x] T004 [P] Run same-class producer and consumer inventories.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add broader default exclude constants and env vars.
- [x] T006 Extend policy resolver for per-folder booleans, skill lists, csv env, labels and v2 fingerprints.
- [x] T007 Extend walker and default config to enforce all five folders and selected skills.
- [x] T008 Extend DB stored-scope read, scan args and status payload.
- [x] T009 Extend public schema, runtime schema and public validator support for property unions and regex.
- [x] T010 Update README and env reference.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Add default/env/per-call tests for broader folder excludes.
- [x] T012 Add selected skill tests for one name, two names, empty list and csv env.
- [x] T013 Add v2 round-trip, deterministic serialization and v1 migration tests.
- [x] T014 Run focused Gate A tests.
- [x] T015 Run full code-graph Gate B tests.
- [x] T016 Run workflow-invariance Gate C.
- [x] T017 Run 009 and 011 strict validation Gate D.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Gates A-D pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
title: "Tasks: Graph and Context Optimization [system-spec-kit/026-graph-and-context-optimization/tasks]"
description: "Task record for the 026 phase consolidation from 29 active folders to 9 thematic wrappers."
trigger_phrases:
  - "026 graph and context optimization"
  - "026 phase consolidation"
  - "29 to 9 phase map"
  - "merged phase map"
  - "graph context optimization root packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization"
    last_updated_at: "2026-04-25T12:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Second topical consolidation: 008-skill-advisor + 009-memory-causal-graph created; 010 renamed to 010-hook-parity; 007-code-graph expanded to 5 children"
    next_safe_action: "Use merged-phase-map.md and context indexes for navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:ca5b8d2f380b05535fae5ba1e81bb50a2045580243d027fbb3b95cc566d927d4"
      session_id: "026-phase-consolidation-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Graph and Context Optimization

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

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read root packet docs before modifying them. [SOURCE: spec.md; plan.md; tasks.md; implementation-summary.md]
- [x] T002 Enumerate old direct phase folders `001` through `029`. [SOURCE: merged-phase-map.md]
- [x] T003 Note existing dirty worktree changes in phases `027` through `029` and root `review/`. [SOURCE: git status]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Move every old phase folder into its active wrapper direct-child path. [SOURCE: merged-phase-map.md]
- [x] T011 Create active wrapper docs for the active phase wrappers (first pass: nine wrappers; second pass: refined to 11 wrappers). [SOURCE: 001-research-and-baseline/spec.md; 010-hook-parity/spec.md; 008-skill-advisor/spec.md; 009-memory-causal-graph/spec.md]
- [x] T012 Create per-wrapper context indexes bridge docs. [SOURCE: 001-research-and-baseline/context-index.md; 010-hook-parity/context-index.md; 008-skill-advisor/context-index.md; 007-code-graph/context-index.md]
- [x] T013 Refresh moved `description.json` and `graph-metadata.json` files with new paths and migration aliases (including second-pass aliases for `006-search-routing-advisor/` and `010-hook-package/`). [SOURCE: graph-metadata.json]
- [x] T014 Update root docs to reflect the active map after both consolidation passes. [SOURCE: spec.md]
- [x] T015 Append the second-pass move/rename table to `merged-phase-map.md` while preserving the first-pass 29→9 history verbatim. [SOURCE: merged-phase-map.md]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Confirm all old phases `001` through `029` are represented exactly once in the first-pass section of `merged-phase-map.md`, and every second-pass move/rename appears exactly once in the appended second-pass section. [SOURCE: verification command]
- [x] T021 Parse all `description.json` and `graph-metadata.json` files under the packet. [SOURCE: verification command]
- [x] T022 Run strict validation on the root packet and each active wrapper. [SOURCE: implementation-summary.md]
- [x] T023 Check old trigger phrases (including `006-search-routing-advisor` and `010-hook-package` aliases) remain visible in source metadata or wrapper context indexes. [SOURCE: verification command]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Active direct phase surface contains the 11 approved wrappers (intentional gaps at `006` and `011`).
- [x] No original phase folder content was deleted.
- [x] Root support folders remain at the root.
- [x] Validation and parse checks completed.
- [x] Both consolidation passes (29→9 first pass and 9→11 second pass) are documented in `merged-phase-map.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Merged Phase Map**: See `merged-phase-map.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---
title: "Tasks: Fix Delivery vs Progress Routing Confusion"
description: "Task ledger for delivery/progress routing remediation."
trigger_phrases:
  - "delivery progress tasks"
  - "content router delivery tasks"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex"
    recent_action: "Normalized task IDs and evidence anchors"
    next_safe_action: "No further phase-local work required"
    completion_pct: 100
---
# Tasks: Fix Delivery vs Progress Routing Confusion

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

- [x] T001 Confirm current delivery cue lines in `content-router.ts:404-423`.
- [x] T002 Confirm current floor-guard lines in `content-router.ts:965-993`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Expand `RULE_CUES.narrative_delivery` with sequencing and verification-order terms.
- [x] T004 Gate progress scoring with `strongDeliveryMechanics`.
- [x] T005 Refresh ambiguous delivery/progress prototypes.
- [x] T006 Add regression tests for delivery chunks that still contain implementation verbs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T901 Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- [x] T902 Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts`.
<!-- /ANCHOR:phase-3 -->

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

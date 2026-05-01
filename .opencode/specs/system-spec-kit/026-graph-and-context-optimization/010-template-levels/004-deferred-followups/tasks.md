---
title: "Tasks: deferred-followups [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/004-deferred-followups"
    last_updated_at: "2026-05-01T20:32:55Z"
    last_updated_by: "codex"
    recent_action: "Defined packet tasks"
    next_safe_action: "Complete verification"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-deferred-followups"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: deferred-followups

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T101 [P] DEFER-G7-08 write `templates/manifest/EXTENSION_GUIDE.md`
- [x] T102 [P] DEFER-G7-04 expand rendered snapshot coverage
- [x] T103 [P] DEFER-G7-07 add manifest `versions` and resolver `templateVersions`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T104 DEFER-G7-01 add validation orchestrator and `validate.sh` routing
- [x] T105 DEFER-G7-09 add lenient `parent_session_id` warning semantics
- [x] T106 DEFER-G7-10 apply exit-code taxonomy in validation and docs
- [x] T107 DEFER-G7-02 add batch inline renderer mode and scaffold batching
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T108 DEFER-G7-03 add canonical save advisory lock with stale cleanup
- [x] T109 DEFER-G7-06 expand manifest per-document section gates
- [x] T110 DEFER-G7-05 write `templates/manifest/MIGRATION.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Automated verification passed or limitations documented
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

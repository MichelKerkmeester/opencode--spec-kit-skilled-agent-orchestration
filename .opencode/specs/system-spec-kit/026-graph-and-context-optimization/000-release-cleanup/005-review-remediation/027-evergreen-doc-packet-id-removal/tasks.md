---
title: "Tasks: Evergreen Doc Packet ID Removal"
description: "Task tracker for the doc-only evergreen packet-ID rule, audit, and fixes."
trigger_phrases:
  - "027-evergreen-doc-packet-id-removal"
  - "evergreen doc rule"
  - "no packet ids in readmes"
  - "sk-doc evergreen rule"
  - "packet id audit"
importance_tier: "important"
contextType: "general"
template_source_marker: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/027-evergreen-doc-packet-id-removal"
    last_updated_at: "2026-04-29T20:05:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed evergreen doc audit tasks"
    next_safe_action: "Validate and hand off"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:040evergreentasks00000000000000000000000000000000000000"
      session_id: "027-evergreen-doc-packet-id-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Evergreen Doc Packet ID Removal

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

- [x] T001 Read sk-doc skill, references, and templates.
- [x] T002 Read system-spec-kit Level 2 templates.
- [x] T003 [P] Collect recent evergreen candidates.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `evergreen packet ID rule`.
- [x] T005 Wire rule into `sk-doc skill` and quick reference.
- [x] T006 Update README/install/catalog/playbook templates.
- [x] T007 Apply targeted evergreen doc wording fixes.
- [x] T008 Write `audit findings`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run audit grep.
- [x] T010 Run strict validator.
- [x] T011 Review git diff scope.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

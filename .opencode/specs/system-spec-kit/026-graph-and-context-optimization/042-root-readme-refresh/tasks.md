---
title: "Tasks: 042 root README refresh"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2"
description: "Task ledger for README count verification, evergreen cleanup, and validation."
trigger_phrases:
  - "042-root-readme-refresh"
  - "root readme update"
  - "framework readme refresh"
  - "tool count refresh"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh"
    last_updated_at: "2026-04-29T20:52:18+02:00"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Strict validation passed"
    next_safe_action: "Ready for commit"
    blockers: []
    key_files:
      - "README.md"
      - "verification-notes.md"
      - "audit-findings.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 042 Root README Refresh

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

- [x] T001 Read root README (`README.md`)
- [x] T002 Read evergreen packet-ID rule (`.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md`)
- [x] T003 [P] Read canonical tool and advisor schema sources
- [x] T004 [P] Read runtime bindings and current system-spec-kit docs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Verify tool, advisor, agent, skill, and command counts
- [x] T006 Create packet Level 2 docs
- [x] T007 Patch README counts and feature mentions
- [x] T008 Remove README packet-folder hardlink
- [x] T009 Write `verification-notes.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run evergreen grep on README
- [x] T011 Write `audit-findings.md`
- [x] T012 Confirm no markdown wiki-links
- [x] T013 Run strict validator
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
- **Evidence**: See `verification-notes.md` and `audit-findings.md`
<!-- /ANCHOR:cross-refs -->

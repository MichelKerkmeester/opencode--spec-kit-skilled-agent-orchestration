---
title: "Tasks: Smart-Router Resilience Pattern Finish"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "smart router"
  - "cross-links"
importance_tier: "important"
contextType: "general"
level: 2
status: complete
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/012-sk-doc-smart-router-resilience-template"
    last_updated_at: "2026-05-03T00:58:00+02:00"
    last_updated_by: "codex"
    recent_action: "Recorded completed IMPL-012 finisher tasks."
    next_safe_action: "Review final diff if desired."
    blockers: []
    key_files:
      - ".opencode/skill/sk-deep-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:3333333333333333333333333333333333333333333333333333333333333333"
      session_id: "impl-012-finisher"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Smart-Router Resilience Pattern Finish

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

- [x] T001 Confirm branch remains `main`
- [x] T002 Read canonical smart-router asset
- [x] T003 Identify existing cross-link format
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add pattern and cross-link to `.opencode/skill/sk-deep-review/SKILL.md`
- [x] T005 [P] Add cross-link to `.opencode/skill/sk-code/SKILL.md`
- [x] T006 [P] Add cross-link to `.opencode/skill/sk-code-opencode/SKILL.md`
- [x] T007 [P] Add cross-link to `.opencode/skill/sk-code-review/SKILL.md`
- [x] T008 [P] Add cross-link to `.opencode/skill/sk-deep-research/SKILL.md`
- [x] T009 [P] Add cross-link to `.opencode/skill/sk-git/SKILL.md`
- [x] T010 [P] Add cross-link to `.opencode/skill/sk-improve-agent/SKILL.md`
- [x] T011 [P] Add cross-link to `.opencode/skill/sk-improve-prompt/SKILL.md`
- [x] T012 [P] Add cross-link to `.opencode/skill/system-spec-kit/SKILL.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run pattern marker count and confirm 19
- [x] T014 Run cross-link count and confirm 19
- [x] T015 Run workflow-invariance vitest and confirm pass
- [x] T016 Repair spec packet docs and rerun strict validation
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

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: Move changelog_template.md into sk-doc [045] [skilled-agent-orchestration/045-sk-doc-changelog-template/tasks]"
description: "Task tracker for the changelog template relocation packet."
trigger_phrases:
  - "045 tasks"
  - "sk-doc-changelog-template tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/045-sk-doc-changelog-template"
    last_updated_at: "2026-04-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted task list"
    next_safe_action: "Execute T004-T010"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:045-sk-doc-changelog-template"
      session_id: "045-sk-doc-changelog-template"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: Move changelog_template.md into sk-doc

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

- [x] T001 Confirm sk-doc/assets/documentation exists (`.opencode/skill/sk-doc/assets/documentation/`)
- [x] T002 Inventory all references to the old template path
- [x] T003 Confirm Level 1 templates apply
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the new template at [.opencode/skill/sk-doc/assets/documentation/changelog_template.md](../../../skill/sk-doc/assets/documentation/changelog_template.md)
- [x] T005 Delete the original at the former create-command asset path
- [x] T006 [P] Update [.opencode/command/create/assets/create_changelog_auto.yaml](../../../command/create/assets/create_changelog_auto.yaml) (5 occurrences)
- [x] T007 [P] Update [.opencode/command/create/assets/create_changelog_confirm.yaml](../../../command/create/assets/create_changelog_confirm.yaml) (5 occurrences)
- [x] T008 [P] Update [.opencode/command/create/changelog.md](../../../command/create/changelog.md) (Section 3 reference)
- [x] T009 [P] Update [.opencode/skill/system-spec-kit/references/workflows/nested_changelog.md](../../../skill/system-spec-kit/references/workflows/nested_changelog.md) (global-template pointer)
- [x] T010 Wire CHANGELOG intent into [.opencode/skill/sk-doc/SKILL.md](../../../skill/sk-doc/SKILL.md) (use-case mention + Smart Router intent + resource map + references list)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 grep verification: zero hits for `command/create/assets/changelog_template` under `.opencode/command/` and `.opencode/skill/`
- [x] T012 Read-back the moved template to confirm parity with the source (size and shasum match)
- [x] T013 Author [implementation-summary.md](./implementation-summary.md) with Files Changed table and verification results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] grep verification passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

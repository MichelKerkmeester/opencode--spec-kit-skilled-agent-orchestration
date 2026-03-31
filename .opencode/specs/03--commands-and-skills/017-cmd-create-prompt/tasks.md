---
title: "Tasks: create:prompt Command [template:level_2/tasks.md] [03--commands-and-skills/017-cmd-create-prompt/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "create"
  - "prompt"
  - "command"
  - "template"
  - "017"
  - "cmd"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: create:prompt Command

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

---

---
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create command file with frontmatter (`.opencode/command/create/prompt.md`)
- [x] T002 Implement mandatory gate pattern — blocks on empty $ARGUMENTS
- [x] T003 Write PURPOSE section — describe command's role as sk-prompt-improver wrapper
- [x] T004 Write CONTRACT section — define inputs ($ARGUMENTS) and outputs (STATUS)

---

---
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement argument dispatch — parse mode prefix ($text, $improve, $refine, $short, $json, $yaml, $raw) and execution mode (:auto/:confirm)
- [x] T006 Write INSTRUCTIONS section — 6-step enhancement pipeline (Validate → Load Skill → Enhance → Score → Deliver → Status)
- [x] T007 Add Gate 3 exemption declaration — prompt enhancement is conversation-only

---

---
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 3: Verification

### Phase 3: Polish & Verify

- [x] T008 Write EXAMPLES section — 6 usage patterns covering common scenarios
- [x] T009 Write NOTES, RELATED COMMANDS, and VIOLATION SELF-DETECTION sections
- [x] T010 Verify against command_template.md §15 validation checklist — all items pass

---

---
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Command file validates against command_template.md checklist
- [x] Manual review confirms proper structure and content

---

---
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

---
<!-- /ANCHOR:cross-refs -->

---

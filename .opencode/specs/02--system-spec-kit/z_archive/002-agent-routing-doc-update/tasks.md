---
title: "Tasks: Agent Routing Documentation Update [119-agent-routing-doc-update/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "agent"
  - "routing"
  - "documentation"
  - "update"
  - "119"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Agent Routing Documentation Update

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

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: SKILL.md Updates

- [x] T001 Add `debug-delegation.md` to Agent Exclusivity exceptions (`SKILL.md:~67`)
- [x] T002 Add Agent Dispatch in Commands subsection after Resource Router (`SKILL.md:~158`)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: README.md Updates

- [x] T003 [P] Add `:with-research` and `:auto-debug` to Mode Suffixes table (`README.md:~228`)
- [x] T004 [P] Update Recent Changes section with spec 014 reference (`README.md:~781`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Changelog

- [x] T005 [P] Create changelog entry (`changelog/01--system-spec-kit/v2.2.9.0.md`)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [x] T006 Verify agent names match between SKILL.md and command YAML files
- [x] T007 Verify trigger conditions match YAML thresholds

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] SKILL.md documents all 4 agents dispatched in spec_kit commands
- [x] README.md mode suffixes include `:with-research` and `:auto-debug`

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->

---

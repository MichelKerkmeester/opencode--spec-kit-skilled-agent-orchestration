---
title: "Tasks: Recursive Agent sk-doc Alignment [template:level_2/tasks.md]"
description: "Task tracking for phase 003 under packet 041."
trigger_phrases:
  - "041 phase 003 tasks"
  - "recursive agent doc alignment tasks"
importance_tier: "important"
contextType: "general"
---
# Tasks: Recursive Agent sk-doc Alignment

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

- [x] T001 Create the new `003-sk-improve-agent-doc-alignment/` phase packet
- [x] T002 Update root packet `041` so phase `003` is part of the program history
- [x] T003 Identify all failing `sk-doc` and packaging surfaces before editing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Align `.opencode/skill/sk-improve-agent/SKILL.md` with `sk-doc` packaging rules
- [x] T005 Align `.opencode/skill/sk-improve-agent/README.md` with `sk-doc` README rules
- [x] T006 Align all markdown files under `.opencode/skill/sk-improve-agent/references/`
- [x] T007 Align markdown assets under `.opencode/skill/sk-improve-agent/assets/`
- [x] T008 Align `.opencode/command/spec_kit/agent-improver.md` with `sk-doc`
- [x] T009 Align `.opencode/agent/agent-improver.md` with `sk-doc`
- [x] T010 Update packet-linked usage examples and metadata to the new phase path
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `package_skill.py --check` for `sk-improve-agent`
- [x] T012 Run `validate_document.py` for README, command, and agent
- [x] T013 Run `validate_document.py` for all references and markdown assets
- [x] T014 Run strict validation for root `041`
- [x] T015 Run strict validation for phase `003`
- [x] T016 Update the implementation summary with the final evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase `003` exists and is documented
- [x] `sk-improve-agent` package docs align with `sk-doc`
- [x] Related command and agent docs align with `sk-doc`
- [x] Parent packet `041` records `003` as completed work
- [x] Validators pass for the package and packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent Packet**: See [../](../)
- **Previous Phase**: See [../002-sk-improve-agent-full-skill/](../002-sk-improve-agent-full-skill/)
- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Checklist**: See [checklist.md](./checklist.md)
- **Implementation Summary**: See [implementation-summary.md](./implementation-summary.md)
<!-- /ANCHOR:cross-refs -->

---

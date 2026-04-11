---
title: "Tasks: Recursive Agent Package and Runtime Alignment [template:level_2/tasks.md]"
description: "Task tracking for phase 005 under packet 041."
trigger_phrases:
  - "041 phase 005 tasks"
  - "recursive agent package runtime alignment tasks"
importance_tier: "important"
contextType: "general"
---
# Tasks: Recursive Agent Package and Runtime Alignment

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

- [x] T001 Rewrite `.opencode/skill/sk-improve-agent/SKILL.md` to the stricter `sk-doc` skill template family
- [x] T002 Rewrite `.opencode/skill/sk-improve-agent/README.md` to the `sk-doc` README template family
- [x] T003 Rewrite every markdown file under `.opencode/skill/sk-improve-agent/references/`
- [x] T004 Rewrite markdown files under `.opencode/skill/sk-improve-agent/assets/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rename the canonical mutator agent to `agent-improver`
- [x] T006 Rename and align runtime agent mirrors for Claude, Gemini, `.agents`, and Codex
- [x] T007 Align `.opencode/command/spec_kit/agent-improver.md` to the command template family
- [x] T008 Update YAML workflows to dispatch `@agent-improver`
- [x] T009 Update command wrapper TOMLs to match the corrected command body
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Resynchronize `.agents/skills/sk-improve-agent/`
- [x] T011 Update active packet docs that still referenced the removed mutator path
- [x] T012 Create the new `005-sk-improve-agent-package-runtime-alignment/` phase packet
- [x] T013 Update parent packet `041` to record phase `005`
- [x] T014 Update `.opencode/specs/descriptions.json` with the new phase
- [x] T015 Run package, document, syntax, and packet validators
- [x] T016 Update the implementation summary with the final evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Source agent-improver package follows the intended template family
- [x] Runtime mutator surfaces use `agent-improver`
- [x] Command and wrapper surfaces are synchronized
- [x] `.agents/skills/sk-improve-agent/` is synchronized to the corrected source package
- [x] Root `041` records phase `005` and validates strictly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent Packet**: See [../](../)
- **Previous Phase**: See [../004-sk-improve-agent-promotion-verification/](../004-sk-improve-agent-promotion-verification/)
- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Checklist**: See [checklist.md](./checklist.md)
- **Implementation Summary**: See [implementation-summary.md](./implementation-summary.md)
<!-- /ANCHOR:cross-refs -->

---

---
title: "Tasks: Append Nested Child Phases in create.sh [02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/008-create-sh-phase-parent]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase parent tasks"
  - "nested append task list"
  - "create sh phase planning tasks"
importance_tier: "critical"
contextType: "planning"
---
# Tasks: Append Nested Child Phases in create.sh

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Document the current parser and append behavior in `plan.md`
- [x] T002 Reproduce the nested-parent failure using `.opencode/specs/.../011-indexing-and-adaptive-fusion`
- [x] T003 Define the public flag contract for `--phase-parent` and `--parent`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update argument parsing in `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
- [x] T005 Adjust `resolve_and_validate_spec_path()` to accept nested paths under approved roots
- [x] T006 Resolve append output tree from the validated parent folder in `create.sh`
- [x] T007 [P] Update append numbering logic so it scans only the chosen parent folder
- [x] T008 [P] Update help text and examples for `--phase-parent` in `create.sh`
- [x] T009 Keep `--phase --parent` backward compatible in `create.sh`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify nested append under `.opencode/specs/` with an existing parent
- [x] T011 Verify flat append under `specs/` still works
- [x] T012 Verify invalid parent paths fail cleanly
- [x] T013 Run `validate.sh --strict` for the phase folder after documentation updates
- [ ] T014 Save context to memory once implementation work closes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] Both flat and nested append flows are verified
- [ ] No unrelated `create.sh` behavior changed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Target Script**: `.opencode/skill/system-spec-kit/scripts/spec/create.sh`
<!-- /ANCHOR:cross-refs -->

---

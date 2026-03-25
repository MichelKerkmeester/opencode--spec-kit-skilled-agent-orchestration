---
title: "Tasks: Memory README Coverage Ownership Remediation [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "memory"
  - "coverage"
  - "ownership"
  - "remediation"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Memory README Coverage Ownership Remediation

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

- [ ] T001 Review the current `Coverage by Command` section (`.opencode/command/memory/README.txt`)
- [ ] T002 Confirm the existing command rows and totals that should remain stable (`.opencode/command/memory/README.txt`)
- [ ] T003 Draft concise wording for primary ownership versus helper-tool usage (`.opencode/command/memory/README.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Update the coverage table headers to reflect primary ownership (`.opencode/command/memory/README.txt`)
- [ ] T005 Revise row presentation so helper-tool usage is not mistaken for direct ownership (`.opencode/command/memory/README.txt`)
- [ ] T006 Add the explanatory note directly below the table (`.opencode/command/memory/README.txt`)
- [ ] T007 Keep the edit limited to the target section only (`.opencode/command/memory/README.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-read the updated section for clarity and consistency (`.opencode/command/memory/README.txt`)
- [ ] T009 Inspect the diff to confirm no adjacent README sections changed (`.opencode/command/memory/README.txt`)
- [ ] T010 Confirm the note explains zero-primary-ownership commands clearly (`.opencode/command/memory/README.txt`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

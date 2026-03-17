---
title: "Tasks: Perfect Session Capturing [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "perfect session capturing"
  - "root remediation"
  - "template compliance"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Perfect Session Capturing

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

- [x] T001 Read active Level 3 templates and validator expectations (`.opencode/skill/system-spec-kit/templates/level_3/`)
- [x] T002 Capture current verification evidence for scripts, MCP, and CLI proof lanes (`.opencode/skill/system-spec-kit/`)
- [x] T003 Inventory root and child spec gaps from recursive validation (`010-perfect-session-capturing/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Repair stale module-contract expectations without widening public boundaries (`.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js`)
- [x] T005 Rewrite root `spec.md` and `plan.md` onto current Level 3 structure (`spec.md`, `plan.md`)
- [x] T006 Create missing root `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` (root spec folder)
- [x] T007 Add parent phase-map coverage and child predecessor or successor links needed by recursive validation (`spec.md` plus child phase metadata already remediated)
- [x] T008 Refresh root documentation to separate fixture-backed proof from live CLI proof (root spec folder)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun root and recursive spec validation until the folder is clean (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [x] T010 Rerun completion checks and targeted root claims (`.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh`)
- [x] T011 Reconfirm targeted scripts, extractor, and MCP verification lanes after doc and test-lane remediation (`.opencode/skill/system-spec-kit/`)
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

---

**AI EXECUTION PROTOCOL**

### Pre-Task Checklist
- Re-read the root spec and plan before touching canonical status language.
- Confirm whether a task changes docs only or also changes code or tests.
- Keep child-folder edits limited to phase-link metadata unless validation shows deeper drift.

### Execution Rules

| Rule | Expectation |
|------|-------------|
| TASK-SCOPE | Stay inside the root spec pack and the minimum child-link metadata needed for recursive compliance |
| TASK-EVIDENCE | Do not mark a task done without fresh command or file evidence |
| TASK-TRUTH | Distinguish live CLI proof, fixture-backed proof, and blocked cases explicitly |
| TASK-VERIFY | Re-run the authoritative validators before closing the task |

### Status Reporting Format

- `STARTED:` task id, scope, and target files
- `IN PROGRESS:` current checkpoint and remaining work
- `BLOCKED:` exact blocker and the evidence gathered
- `DONE:` command or file evidence plus resulting status

### Blocked Task Protocol

1. Stop when a validator or test failure changes completion truth.
2. Record the blocker against the affected task with evidence.
3. Resume only after the blocker is patched or explicitly documented as unresolved.

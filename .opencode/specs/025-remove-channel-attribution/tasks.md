---
title: "Tasks: Remove Channel Attribution"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "channel attribution tasks"
  - "remove channel attribution"
  - "shadow scoring cleanup"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Remove Channel Attribution

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

- [x] T001 Create spec folder and capture scope (`specs/025-remove-channel-attribution/*`)
- [x] T002 Read requested files and dependent references (`.opencode/skill/system-spec-kit/**`)
- [x] T003 [P] Map remaining channel-attribution usages with repository search
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete the channel-attribution source, test, and markdown artifacts
- [x] T005 Remove channel-attribution imports and comment out dependent tests in the two vitest suites
- [x] T006 Update feature catalog, simple-terms catalog, eval README, and playbook index references
- [x] T007 Review diff for scope and consistency
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run targeted vitest coverage for the edited suites
- [x] T009 Re-scan repository references for deleted artifacts in edited index docs
- [x] T010 Update implementation summary with results
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

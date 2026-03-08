---
title: "Tasks: Git Context Extractor for Stateless Memory Saves [025-git-context-extractor/tasks]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "git context extractor"
  - "stateless memory save"
  - "extractor"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Git Context Extractor for Stateless Memory Saves

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

- [ ] T001 Review adjacent extractor patterns (`.opencode/skill/system-spec-kit/scripts/extractors/`)
- [ ] T002 Confirm the stateless memory-save payload fields that need git context
- [ ] T003 [P] Check whether `.opencode/skill/system-spec-kit/scripts/extractors/index.ts` needs a new export
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `git-context-extractor.ts` (`.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts`)
- [ ] T005 Collect branch, head, commit, and repo-state metadata in a normalized response
- [ ] T006 Return an explicit fallback object when git metadata is unavailable or incomplete
- [ ] T007 Wire the new extractor into the registry only if the current module layout requires it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run a targeted build, typecheck, or script invocation for the extractor path
- [ ] T009 Verify the normal repository case and at least one fallback case
- [ ] T010 Update `implementation-summary.md` after the implementation is complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual or scripted verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

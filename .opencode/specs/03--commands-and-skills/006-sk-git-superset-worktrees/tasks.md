---
title: "Tasks: sk-git Superset Worktree Alignment [03--commands-and-skills/006-sk-git-superset-worktrees/tasks]"
description: "Task breakdown for adapting Superset-style worktree documentation into sk-git."
---
# Tasks: sk-git Superset Worktree Alignment

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

---
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Review the current sk-git worktree documentation and the Superset reference findings.
- [ ] T002 Confirm the in-scope documentation files for the adaptation pass.
- [ ] T003 Identify deferred items that must stay out of scope for this spec.

---
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rewrite references/worktree_workflows.md around the adapted Superset-style setup flow.
- [ ] T005 Update SKILL.md to recommend centralized worktree usage while preserving fallback behavior.
- [ ] T006 [P] Update teardown, shared-pattern, and quick-reference documentation.
- [ ] T007 [P] Update checklist and config-template assets.
- [ ] T008 Document security confirmation for lifecycle hooks and config-vs-auto-detect behavior.

---
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Phase 3: Verification

- [ ] T009 Verify centralized-path, fallback, and migration guidance are consistent.
- [ ] T010 Verify deferred items remain documented as deferred, not implemented.
- [ ] T011 Validate the spec-folder structure.

---
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed

---
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

---
<!-- /ANCHOR:cross-refs -->

---

---
title: "Tasks: Phase 009 - Rename workflows-git to sk-git (Barter Repo) [009-sk-git-from-barter-repo/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase"
  - "009"
  - "rename"
  - "workflows"
  - "git"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 009 - Rename workflows-git to sk-git (Barter Repo)

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
## Step 1: Filesystem Rename

- [x] T001 Rename Barter `.opencode/skill/workflows-git/` to `.opencode/skill/sk-git/` via `git mv` [Evidence: EV-01]
- [x] T002 Verify new folder `.opencode/skill/sk-git/` exists with all 8 files [Evidence: EV-02]
- [x] T003 Verify old folder `.opencode/skill/workflows-git/` no longer exists [Evidence: EV-01]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates — SKILL.md

- [x] T004 Update SKILL.md line 2: `name: workflows-git` → `name: sk-git` [Evidence: git diff]
- [x] T005 Update SKILL.md line 314: `workflows-code` → `sk-code--opencode` (integration-points table) [Evidence: git diff]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: Internal File Updates — git_workflow_guide.md

- [x] T006 Update `references/git_workflow_guide.md` line 9: `workflows-git skill` → `sk-git skill` [Evidence: git diff]
- [x] T007 Update `references/git_workflow_guide.md` line 347: `Use workflows-git for history` → `Use sk-git for history` [Evidence: git diff]
- [x] T008 Update `references/git_workflow_guide.md` line 358: `Use workflows-git for pre-impl` → `Use sk-git for pre-impl` [Evidence: git diff]
- [x] T009 Update `references/git_workflow_guide.md` line 370: `Use workflows-git to inform` → `Use sk-git to inform` [Evidence: git diff]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Verification

- [x] T010 Run `rg "workflows[-]git" .opencode/skill/sk-git/` from Barter root → 0 matches [Evidence: EV-03]
- [x] T011 Run `rg "workflows[-]code" .opencode/skill/sk-git/` from Barter root → 0 matches [Evidence: EV-03]
- [x] T012 Run `find .opencode/skill/sk-git -type f | wc -l` from Barter root → 8 [Evidence: EV-02]
- [x] T013 Verify old folder absent: `test ! -d .opencode/skill/workflows-git` [Evidence: EV-01]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T013 marked `[x]`
- [x] Old-name rg check passed (T010, T011)
- [x] File count verified (T012)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
title: "Tasks: Phase 002 — Rename workflows-code--web-dev to sk-code--web [002-sk-code--web/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase"
  - "002"
  - "rename"
  - "workflows"
  - "code"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 002 — Rename workflows-code--web-dev to sk-code--web

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

- [x] T001 `git mv .opencode/skill/workflows-code--web-dev .opencode/skill/sk-code--web`
- [x] T002 Verify new folder exists with all 51 files intact
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (51 files)

- [x] T003 Update SKILL.md — name field, title, self-references, paths (.opencode/skill/sk-code--web/SKILL.md)
- [x] T004 Update index.md — name, description (.opencode/skill/sk-code--web/index.md)
- [x] T005 [P] Update nodes/quick-reference.md — self-references, cross-skill refs
- [x] T006 [P] Update nodes/when-to-use.md — self-references, decision criteria
- [x] T007 [P] Update nodes/implementation-workflow.md — paths, cross-refs
- [x] T008 [P] Update nodes/verification-workflow.md — paths, cross-refs
- [x] T009 [P] Update nodes/debugging-workflow.md — cross-refs
- [x] T010 [P] Update nodes/project-detection.md — cross-refs
- [x] T011 [P] Update nodes/stack-detection.md — cross-refs
- [x] T012 [P] Update nodes/quality-standards.md — cross-refs
- [x] T013 [P] Update references/*.md (~8 files) — hard-coded paths
- [x] T014 [P] Update assets/*.md (~25 files) — template paths, examples
- [x] T015 [P] Update scripts/*.{sh,mjs} (~5 files) — hard-coded paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: External Reference Updates (17 files)

### skill_advisor.py (25 lines)
- [x] T016 Update INTENT_BOOSTERS entries for `workflows-code--web-dev` → `sk-code--web`
- [x] T017 Update MULTI_SKILL_BOOSTERS entries for `workflows-code--web-dev` → `sk-code--web`

### Agent Files (8 files across 4 runtimes)
- [x] T018 [P] Update .opencode/agent/orchestrate.md
- [x] T019 [P] Update .opencode/agent/review.md
- [x] T020 [P] Update .opencode/agent/chatgpt/orchestrate.md
- [x] T021 [P] Update .opencode/agent/chatgpt/review.md
- [x] T022 [P] Update .claude/agents/orchestrate.md
- [x] T023 [P] Update .claude/agents/review.md
- [x] T024 [P] Update .gemini/agents/orchestrate.md
- [x] T025 [P] Update .gemini/agents/review.md

### Install Guides
- [x] T026 [P] Update .opencode/install_guides/README.md
- [x] T027 [P] Update .opencode/install_guides/SET-UP - AGENTS.md

### Root Docs
- [x] T028 Update CLAUDE.md
- [x] T029 Update .opencode/README.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Bare Reference Resolution

- [x] T030 Find all bare `workflows-code` references (grep for `workflows-code[^-]` and `workflows-code$`)
- [x] T031 Map each to `sk-code--web` (default variant) or `sk-code--*` wildcard as appropriate
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Changelog & Cross-References

- [x] T032 `git mv .opencode/changelog/08--workflows-code--web-dev .opencode/changelog/08--sk-code--web`
- [x] T033 Update cross-references to `workflows-code--web-dev` in other skill folders
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Step 6: Verification

- [x] T034 Run `grep -r "workflows-code--web-dev"` across active directories — expect 0 results
- [x] T035 Run `grep -r "workflows-code[^-]"` — expect 0 bare references
- [x] T036 Run `python3 skill_advisor.py "implement feature"` — expect `sk-code--web`
- [x] T037 Verify `ls .opencode/skill/sk-code--web/` — folder exists
- [x] T038 Verify no old folder remains
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Grep verification passed (T034-T035)
- [x] Smoke test passed (T036)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

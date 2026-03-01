---
title: "Tasks: Phase 003 — Rename legacy full-stack skill identifier to sk-code--full-stack [003-sk-code--full-stack/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase"
  - "003"
  - "rename"
  - "legacy"
  - "code"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 003 — Rename legacy full-stack skill identifier to sk-code--full-stack

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

- [x] T001 `git mv .opencode/skill/legacy full-stack skill identifier .opencode/skill/sk-code--full-stack` [Evidence: EV-01]
- [x] T002 Verify new folder exists with all 88 files intact [Evidence: EV-02]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (88 files)

- [x] T003 Update SKILL.md — name, title, self-refs (.opencode/skill/sk-code--full-stack/SKILL.md) [Evidence: EV-11]
- [x] T004 Update index.md — name, description [Evidence: EV-11]
- [x] T005 [P] Update nodes/*.md (~15 files) — self-refs, cross-skill refs [Evidence: EV-03]
- [x] T006 [P] Update references/*.md (~20 files) — hard-coded paths, cross-refs [Evidence: EV-03]
- [x] T007 [P] Update assets/*.md (~40 files) — template paths, examples, invocations [Evidence: EV-03]
- [x] T008 [P] Update scripts/*.{sh,ts} (~8 files) — hard-coded paths [Evidence: EV-03]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: External Reference Updates (11 files)

### skill_advisor.py (8 lines)
- [x] T009 Update MULTI_SKILL_BOOSTERS entries for `legacy full-stack skill identifier` → `sk-code--full-stack` [Evidence: EV-04, EV-05]

### Agent Files (4 runtimes)
- [x] T010 [P] Update .opencode/agent/orchestrate.md [Evidence: EV-07]
- [x] T011 [P] Update .opencode/agent/chatgpt/orchestrate.md [Evidence: EV-07]
- [x] T012 [P] Update .claude/agents/orchestrate.md [Evidence: EV-07]
- [x] T013 [P] Update .gemini/agents/orchestrate.md [Evidence: EV-07]

### Install Guides
- [x] T014 [P] Update .opencode/install_guides/README.md [Evidence: EV-06]
- [x] T015 [P] Update .opencode/install_guides/SET-UP - AGENTS.md [Evidence: EV-06]

### Root Docs
- [x] T016 Update CLAUDE.md [Evidence: EV-12]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Changelog & Cross-References

- [x] T017 `git mv .opencode/changelog/09--legacy full-stack skill identifier .opencode/changelog/09--sk-code--full-stack` [Evidence: EV-10]
- [x] T018 Update cross-references in other skill folders [Evidence: EV-08]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Verification

- [x] T019 `grep -r "legacy full-stack skill identifier"` in active dirs — expect 0 [Evidence: EV-09]
- [x] T020 skill_advisor.py smoke test [Evidence: EV-04, EV-05]
- [x] T021 Verify `sk-code--full-stack/` exists [Evidence: EV-01]
- [x] T022 Verify no old folder remains [Evidence: EV-01]
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Grep verification passed (T019)
- [x] Smoke test passed (T020)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

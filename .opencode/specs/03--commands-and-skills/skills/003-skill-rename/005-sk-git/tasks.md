---
title: "Tasks: Phase 005 - Finalize sk-git Rename [005-sk-git/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase"
  - "005"
  - "finalize"
  - "git"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 005 - Finalize sk-git Rename

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

- [x] T001 Move git skill folder to `.opencode/skill/sk-git` [Evidence: EV-01]
- [x] T002 Verify new folder with all 20 files [Evidence: EV-02]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (20 files)

- [x] T003 Update SKILL.md [Evidence: EV-06]
- [x] T004 Update index.md [Evidence: EV-06]
- [x] T005 [P] Update nodes/*.md (~5 files) [Evidence: EV-06]
- [x] T006 [P] Update references/*.md (~3 files) [Evidence: EV-06]
- [x] T007 [P] Update assets/*.md (~5 files) [Evidence: EV-06]
- [x] T008 [P] Update scripts/*.sh (~2 files) [Evidence: EV-06]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: skill_advisor.py (28 lines - highest)

- [x] T009 Update INTENT_BOOSTERS to `sk-git` (~20 entries) [Evidence: EV-07, EV-08]
- [x] T010 Update MULTI_SKILL_BOOSTERS to `sk-git` (~8 entries) [Evidence: EV-07, EV-08]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: External Reference Updates (39 files)

### Agent Files
- [x] T011 [P] Update `.opencode/agent/orchestrate.md` [Evidence: EV-06]
- [x] T012 [P] Update `.opencode/agent/chatgpt/orchestrate.md` [Evidence: EV-06]
- [x] T013 [P] Update `.claude/agents/orchestrate.md` [Evidence: EV-06]
- [x] T014 [P] Update `.gemini/agents/orchestrate.md` [Evidence: EV-06]

### Install Guides
- [x] T015 [P] Update `.opencode/install_guides/README.md` [Evidence: EV-06]
- [x] T016 [P] Update `.opencode/install_guides/SET-UP - AGENTS.md` [Evidence: EV-06]
- [x] T017 [P] Update `.opencode/install_guides/SET-UP - Opencode Agents.md` [Evidence: EV-06]
- [x] T018 [P] Update `.opencode/install_guides/SET-UP - Skill Creation.md` [Evidence: EV-06]

### Root Docs
- [x] T019 Update `CLAUDE.md` [Evidence: EV-06]
- [x] T020 Update `README.md` [Evidence: EV-06]
- [x] T021 Update `.opencode/README.md` [Evidence: EV-06]

### Other External
- [x] T022 [P] Update remaining external references (system-spec-kit, command files, etc.) [Evidence: EV-06]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Changelog & Cross-References

- [x] T023 Move git changelog folder to `.opencode/changelog/10--sk-git` [Evidence: EV-01]
- [x] T024 Update cross-refs in other skill folders [Evidence: EV-06]
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Step 6: Verification

- [x] T025 Run generated binary-safe active-target command: `rg -n -I --hidden --no-messages "workflows[-]git" .opencode/skill/ .opencode/command/ .opencode/agent/ .opencode/install_guides/ .claude/ .gemini/ CLAUDE.md README.md .opencode/README.md --glob '!.git/**' --glob '!.opencode/specs/**' --glob '!.opencode/changelog/**' --glob '!**/memory/**' --glob '!**/scratch/**' --glob '!*.sqlite' --glob '!*.sqlite-*' | wc -l` - expect `0` output lines [Evidence: EV-06]
- [x] T026 `python3 .opencode/skill/scripts/skill_advisor.py "git commit"` -> `sk-git` [Evidence: EV-03]
- [x] T027 `python3 .opencode/skill/scripts/skill_advisor.py "push changes"` -> `sk-git` [Evidence: EV-04]
- [x] T028 `python3 .opencode/skill/scripts/skill_advisor.py "create branch"` -> `sk-git` [Evidence: EV-05]
- [x] T029 Verify new folder exists and old folder is absent [Evidence: EV-01, EV-02]
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Binary-safe active-target old-name check passed (T025)
- [x] All three smoke tests passed (T026-T028)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

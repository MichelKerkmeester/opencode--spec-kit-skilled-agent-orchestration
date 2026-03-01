---
title: "Tasks: Phase 001 — Rename legacy workflow-prefixed skill to sk-code--opencode [001-sk-code--opencode/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase"
  - "001"
  - "rename"
  - "legacy"
  - "code"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 001 — Rename legacy workflow-prefixed skill to `sk-code--opencode`

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

- [x] T001 Rename legacy workflow-prefixed skill folder to `.opencode/skill/sk-code--opencode/`
- [x] T002 Verify new folder exists with all contents intact (`find .opencode/skill/sk-code--opencode -type f` = 35 files)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (35 files)

- [x] T003 Update SKILL.md — name field, title, self-references, paths (.opencode/skill/sk-code--opencode/SKILL.md)
- [x] T004 Update index.md — name, description (.opencode/skill/sk-code--opencode/index.md)
- [x] T005 [P] Update nodes/quick-reference.md — self-references, cross-skill refs
- [x] T006 [P] Update nodes/when-to-use.md — self-references
- [x] T007 [P] Update nodes/implementation-workflow.md — paths, cross-refs
- [x] T008 [P] Update nodes/verification-workflow.md — paths
- [x] T009 [P] Update nodes/language-standards.md — cross-refs
- [x] T010 [P] Update nodes/project-detection.md — cross-refs
- [x] T011 [P] Update references/*.md (~5 files) — hard-coded paths to skill folder
- [x] T012 [P] Update assets/*.md (~15 files) — template paths, example invocations
- [x] T013 [P] Update scripts/*.sh (~3 files) — hard-coded paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: External Reference Updates (12 active-path files)

### skill_advisor.py (19 lines)
- [x] T014 Update INTENT_BOOSTERS entries from legacy workflow-prefixed token to `sk-code--opencode` (.opencode/skill/scripts/skill_advisor.py)
- [x] T015 Update MULTI_SKILL_BOOSTERS entries from legacy workflow-prefixed token to `sk-code--opencode` (.opencode/skill/scripts/skill_advisor.py)

### Active-Path Skill References
- [x] T016 [P] Update .opencode/skill/README.md — skill listing and link targets
- [x] T017 [P] Update .opencode/skill/sk-code--full-stack/README.md — cross-skill reference
- [x] T018 [P] Update .opencode/skill/sk-doc/README.md — cross-skill reference
- [x] T019 [P] Update .opencode/skill/sk-git/README.md — cross-skill reference
- [x] T020 [P] Update .opencode/skill/system-spec-kit/README.md — routing and relative link
- [x] T021 [P] Update .opencode/skill/system-spec-kit/SKILL.md — routing/downstream references
- [x] T022 [P] Update .opencode/skill/system-spec-kit/nodes/rules.md — routing rule reference
- [x] T023 [P] Update .opencode/skill/system-spec-kit/config/config.jsonc — indexed skill reference
- [x] T024 [P] Update .opencode/skill/system-spec-kit/mcp_server/tests/skill-ref-config.vitest.ts — fixture/assertion references

### Install Guides
- [x] T025 [P] Update .opencode/install_guides/README.md — skill registry
- [x] T026 [P] Update .opencode/install_guides/SET-UP - AGENTS.md — skill references
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Changelog & Cross-References

- [x] T027 Rename legacy workflow-prefixed changelog directory to `.opencode/changelog/07--sk-code--opencode/`
- [x] T028 Update active-path cross-references to `sk-code--opencode` in skill folders (scan: legacy-token query across phase target set) — 0 matches
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Verification

- [x] T029 Run legacy-token scan across phase active-path target set — 0 results (`rg` exit: 1)
- [x] T030 Run `python3 .opencode/skill/scripts/skill_advisor.py "opencode standards"` — returned `sk-code--opencode` (confidence 0.95, threshold pass)
- [x] T031 Verify `ls .opencode/skill/sk-code--opencode/` — folder exists (35 files)
- [x] T032 Verify legacy workflow-prefixed folder alias is absent
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Legacy-token verification passed (T029)
- [x] Smoke test passed (T030)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

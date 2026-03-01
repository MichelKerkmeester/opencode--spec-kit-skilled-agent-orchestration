---
title: "Tasks: Phase 004 — Finalize Rename to sk-doc [004-sk-doc/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase"
  - "004"
  - "finalize"
  - "rename"
  - "documentation"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 004 — Finalize Rename to sk-doc

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

- [x] T001 Rename skill folder from legacy path to `.opencode/skill/sk-doc/`
- [x] T002 Verify new folder with all 49 files (`SK_DOC_FILE_COUNT:49`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (49 files)

- [x] T003 Update SKILL.md — name, title, self-refs
- [x] T004 Update index.md — name, description
- [x] T005 [P] Update nodes/*.md (~8 files) — self-refs, cross-skill refs
- [x] T006 [P] Update references/*.md (~6 files) — paths, HVR refs
- [x] T007 [P] Update assets/*.md (~25 files) — template paths, examples
- [x] T008 [P] Update scripts/*.{sh,py} (~5 files) — paths
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: Agent File Updates (8 files — densest)

### write.md (4 runtimes — ~30 refs each)
- [x] T009 Update .opencode/agent/write.md (~30 refs)
- [x] T010 Update .opencode/agent/chatgpt/write.md (~30 refs)
- [x] T011 Update .claude/agents/write.md (~30 refs)
- [x] T012 Update .gemini/agents/write.md (~30 refs)

### orchestrate.md (4 runtimes)
- [x] T013 [P] Update .opencode/agent/orchestrate.md
- [x] T014 [P] Update .opencode/agent/chatgpt/orchestrate.md
- [x] T015 [P] Update .claude/agents/orchestrate.md
- [x] T016 [P] Update .gemini/agents/orchestrate.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Command File Updates (9 files)

- [x] T017 [P] Update .opencode/command/create/skill.md
- [x] T018 [P] Update .opencode/command/create/skill_asset.md
- [x] T019 [P] Update .opencode/command/create/skill_reference.md
- [x] T020 [P] Update .opencode/command/create/agent.md
- [x] T021 [P] Update .opencode/command/create/install_guide.md
- [x] T022 [P] Update .opencode/command/create/folder_readme.md
- [x] T023 [P] Update .opencode/command/create/skill--auto.yaml (legacy task entry; active templates verified)
- [x] T024 [P] Update .opencode/command/create/skill--confirm.yaml (legacy task entry; active templates verified)
- [x] T025 [P] Update .opencode/command/create/skill_asset--auto.yaml (legacy task entry; active templates verified)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: system-spec-kit Updates (12+ files)

### HVR_REFERENCE Paths
- [x] T026 [P] Update templates/level_1/implementation-summary.md — HVR path
- [x] T027 [P] Update templates/level_2/implementation-summary.md — HVR path
- [x] T028 [P] Update templates/level_3/implementation-summary.md — HVR path
- [x] T029 [P] Update templates/level_3+/implementation-summary.md — HVR path
- [x] T030 [P] Update templates/level_3/decision-record.md — HVR path
- [x] T031 [P] Update templates/level_3+/decision-record.md — HVR path
- [x] T032 [P] Update templates/core/impl-summary-core.md — HVR path
- [x] T033 [P] Update remaining template files with HVR refs

### Config & Docs
- [x] T034 Update system-spec-kit SKILL.md — skill references
- [x] T035 Update system-spec-kit README.md — related resources
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Step 6: Install Guides & Root Docs (7 files)

- [x] T036 [P] Update .opencode/install_guides/README.md
- [x] T037 [P] Update .opencode/install_guides/SET-UP - AGENTS.md
- [x] T038 [P] Update .opencode/install_guides/SET-UP - Opencode Agents.md
- [x] T039 [P] Update .opencode/install_guides/SET-UP - Skill Creation.md
- [x] T040 Update README.md (project root)
- [x] T041 Update CLAUDE.md
- [x] T042 Update .opencode/README.md
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Step 7: skill_advisor.py (8 lines)

- [x] T043 Update INTENT_BOOSTERS from legacy name to `sk-doc`
- [x] T044 Remove legacy-name MULTI_SKILL_BOOSTERS entries and align remaining mappings
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Step 8: Changelog & Cross-References

- [x] T045 Rename changelog directory from legacy path to `.opencode/changelog/06--sk-doc/`
- [x] T046 Update cross-refs in other skill folders
<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:phase-9 -->
## Step 9: Verification

- [x] T047 Run legacy-name grep across active files — expect 0 (validated with `rg`, `EXIT:1`)
- [x] T048 Run legacy-name HVR_REFERENCE grep in spec-kit templates — expect 0 (`EXIT:1`)
- [x] T049 `python3 skill_advisor.py "create documentation" --threshold 0.8` → `TOP_SKILL:sk-doc`
- [x] T050 Verify folder exists (`NEW_SKILL_DIR:yes`, `NEW_CHANGELOG_DIR:yes`)
- [x] T051 Verify no old folder remains (`OLD_SKILL_DIR:no`, `OLD_CHANGELOG_DIR:no`)
- [x] T052 Run phase validator (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh .../004-sk-doc`) — `Errors: 0, Warnings: 3, EXIT:1`
<!-- /ANCHOR:phase-9 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] Grep verification passed (T047-T048)
- [x] Smoke test passed (T049)
- [x] Phase validator executed with no errors (T052)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

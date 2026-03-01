---
title: "Tasks: Phase 008 — Rename workflows-code to sk-code in Barter repo [008-sk-code-from-barter-repo/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase"
  - "008"
  - "rename"
  - "workflows"
  - "code"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Phase 008 — Rename `workflows-code` to `sk-code` in Barter repo

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

All paths relative to `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Step 1: Filesystem Rename

- [ ] T001 Rename `workflows-code/` skill folder to `sk-code/` in Barter repo (`.opencode/skill/workflows-code/` → `.opencode/skill/sk-code/`)
- [ ] T002 Verify new folder exists with all contents intact (`find .opencode/skill/sk-code -type f` — expect ~88 files)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Step 2: Internal File Updates (4 files, 6 lines)

- [ ] T003 Update SKILL.md L2 — `name: workflows-code` → `name: sk-code` (`.opencode/skill/sk-code/SKILL.md`)
- [ ] T004 [P] Update SKILL.md L10 — `<!-- Keywords: workflows-code, ...` → `<!-- Keywords: sk-code, ...` (`.opencode/skill/sk-code/SKILL.md`)
- [ ] T005 [P] Update SKILL.md L653 — `workflows-code/` in directory tree → `sk-code/` (`.opencode/skill/sk-code/SKILL.md`)
- [ ] T006 [P] Update stack_detection.md L21 — `workflows-code skill` → `sk-code skill` (`.opencode/skill/sk-code/references/stack_detection.md`)
- [ ] T007 [P] Update debugging_checklist.md L242 — `[workflows-code SKILL.md]` → `[sk-code SKILL.md]` (`.opencode/skill/sk-code/assets/debugging_checklist.md`)
- [ ] T008 [P] Update verification_checklist.md L225 — `[workflows-code SKILL.md]` → `[sk-code SKILL.md]` (`.opencode/skill/sk-code/assets/verification_checklist.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Step 3: External Reference Updates (8 files, ~35 lines)

### skill_advisor.py (27 bare `workflows-code` entries)

- [ ] T009 Update INTENT_BOOSTERS L256-260 — `bug`, `error`, `implement`, `refactor`, `verification` entries: `workflows-code` → `sk-code` (`.opencode/skill/scripts/skill_advisor.py`)
- [ ] T010 [P] Update INTENT_BOOSTERS L265-277 — `opencode`, `python`, `shell`, `bash`, `jsonc`, `shebang`, `snake_case`, `docstring`, `jsdoc`, `commonjs`, `require`, `strict` entries: `workflows-code` → `sk-code` (`.opencode/skill/scripts/skill_advisor.py`)
- [ ] T011 [P] Update MULTI_SKILL_BOOSTERS L302-315 — `code`, `fix`, `mcp`, `plan`, `script`, `server`, `standards`, `style`, `test`, `update` entries: `workflows-code` → `sk-code` (`.opencode/skill/scripts/skill_advisor.py`)

### system-spec-kit SKILL.md (2 lines)

- [ ] T012 [P] Update system-spec-kit/SKILL.md L699 — `workflows-code` → `sk-code` in routing chain (`.opencode/skill/system-spec-kit/SKILL.md`)
- [ ] T013 [P] Update system-spec-kit/SKILL.md L725 — `workflows-code` → `sk-code` in skill table (`.opencode/skill/system-spec-kit/SKILL.md`)

### system-spec-kit references/ (5 files, 1 line each)

- [ ] T014 [P] Update phase_checklists.md L192 — `workflows-code skill` → `sk-code skill` (`.opencode/skill/system-spec-kit/references/validation/phase_checklists.md`)
- [ ] T015 [P] Update quick_reference.md L688 — `workflows-code` → `sk-code` in skill listing (`.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`)
- [ ] T016 [P] Update epistemic-vectors.md L410 — `workflows-code` → `sk-code` in prose (`.opencode/skill/system-spec-kit/references/memory/epistemic-vectors.md`)
- [ ] T017 [P] Update level_specifications.md L817 — `workflows-code` → `sk-code` in skill listing (`.opencode/skill/system-spec-kit/references/templates/level_specifications.md`)
- [ ] T018 [P] Update template_guide.md L1133 — `workflows-code` → `sk-code` in skill listing (`.opencode/skill/system-spec-kit/references/templates/template_guide.md`)

### system-spec-kit assets/ (1 file, 1 line)

- [ ] T019 [P] Update level_decision_matrix.md L363 — `workflows-code` → `sk-code` in skill listing (`.opencode/skill/system-spec-kit/assets/level_decision_matrix.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Step 4: Changelog & Version Bump

- [ ] T020 Add CHANGELOG entry `## 2026-02-21` with `### Updated` subsection describing the rename from `workflows-code` to `sk-code` (`.opencode/skill/sk-code/SKILL.md`)
- [ ] T021 [P] Bump version from 6.0.0 in SKILL.md metadata section (`.opencode/skill/sk-code/SKILL.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Step 5: Verification

- [ ] T022 Run bare-token legacy scan: `rg 'workflows-code' .opencode/skill/` excluding suffixed variants — must return 0 results in active-path Barter files (`rg` exit code 1)
- [ ] T023 Run `python3 .opencode/skill/scripts/skill_advisor.py "code standards"` in Barter repo — must return `sk-code` (confidence pass)
- [ ] T024 [P] Verify `ls .opencode/skill/sk-code/` in Barter repo — folder exists with ~88 files
- [ ] T025 [P] Confirm `workflows-code/` folder is absent in Barter repo `.opencode/skill/`
- [ ] T026 [P] Spot-check SKILL.md L46-47 and L752-757 — confirm deferred cross-skill refs to `workflows-git`, `workflows-documentation`, `workflows-chrome-devtools` are unchanged
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Legacy-token verification passed (T022)
- [ ] Smoke test passed (T023)
- [ ] Deferred refs confirmed unchanged (T026)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

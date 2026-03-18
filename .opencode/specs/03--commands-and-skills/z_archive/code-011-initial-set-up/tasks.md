---
title: "Tasks: workflows-code-opencode Skill Implementation [011-initial-set-up/tasks]"
description: "Parallel Dispatch: 3 opus agents executed simultaneously"
trigger_phrases:
  - "tasks"
  - "workflows"
  - "code"
  - "opencode"
  - "skill"
  - "030"
  - "initial"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: workflows-code-opencode Skill Implementation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.0 -->
<!-- UPDATED: 2026-02-04 - Implementation Complete -->

---

<!-- ANCHOR:summary -->
## Task Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Setup | 7 | Complete |
| Phase 2: Orchestrator | 1 | Complete |
| Phase 3: Shared | 2 | Complete |
| Phase 4: JavaScript | 3 | Complete |
| Phase 5: Python | 3 | Complete |
| Phase 6: Shell | 3 | Complete |
| Phase 7: Config | 2 | Complete |
| Phase 8: Checklists | 5 | Complete |
| Phase 9: Verification | 1 | Complete |
| **Total** | **27** | **27/27** |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup (Folder Structure)

- [x] T001 [P] Create skill folder `.opencode/skill/workflows-code-opencode/`
- [x] T002 [P] Create `references/shared/` subfolder
- [x] T003 [P] Create `references/javascript/` subfolder
- [x] T004 [P] Create `references/python/` subfolder
- [x] T005 [P] Create `references/shell/` subfolder
- [x] T006 [P] Create `references/config/` subfolder
- [x] T007 [P] Create `assets/checklists/` subfolder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Orchestrator

- [x] T008 Create `SKILL.md` with multi-language routing (379 lines)
  - YAML frontmatter
  - Section 1: WHEN TO USE (language triggers)
  - Section 2: LANGUAGE ROUTING (detection algorithm)
  - Section 3: HOW IT WORKS
  - Section 4: RULES (ALWAYS/NEVER)
  - Section 5: SUCCESS CRITERIA
  - Section 6: RELATED RESOURCES
  - Section 7: QUICK REFERENCE
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Shared References [W-A]

- [x] T009 Create `references/shared/universal_patterns.md` (388 lines)
  - Naming principles
  - Commenting philosophy
  - Reference comment patterns
- [x] T010 Create `references/shared/code_organization.md` (467 lines)
  - File structure principles
  - Module organization
  - Import/export philosophy
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: JavaScript References [W-B]

- [x] T011 Create `references/javascript/style_guide.md` (302 lines)
  - File header format
  - Section organization
  - Naming conventions
  - Formatting rules
- [x] T012 Create `references/javascript/quality_standards.md` (425 lines)
  - Module organization (CommonJS)
  - Error handling
  - JSDoc documentation
  - Security patterns
- [x] T013 Create `references/javascript/quick_reference.md` (266 lines)
  - File template
  - Naming cheat sheet
  - Common patterns
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Python References [W-C]

- [x] T014 Create `references/python/style_guide.md` (432 lines)
  - File header format (shebang + box)
  - Section organization
  - Naming conventions
  - Docstring format
- [x] T015 Create `references/python/quality_standards.md` (461 lines)
  - Error handling
  - Type hints
  - CLI patterns
  - Testing patterns
- [x] T016 Create `references/python/quick_reference.md` (406 lines)
  - File template
  - Naming cheat sheet
  - Common patterns
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Shell References [W-D]

- [x] T017 Create `references/shell/style_guide.md` (554 lines)
  - Shebang convention
  - File header format
  - Variable/function naming
  - Quoting rules
- [x] T018 Create `references/shell/quality_standards.md` (547 lines)
  - Strict mode
  - Error handling
  - Color definitions
  - Logging functions
- [x] T019 Create `references/shell/quick_reference.md` (493 lines)
  - File template
  - Exit code conventions
  - Common patterns
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Config References [W-E]

- [x] T020 Create `references/config/style_guide.md` (387 lines)
  - JSON structure
  - JSONC comment patterns
  - Schema references
- [x] T021 Create `references/config/quick_reference.md` (330 lines)
  - JSON template
  - JSONC template
  - Common patterns
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: Checklists [W-E]

- [x] T022 Create `assets/checklists/universal_checklist.md` (275 lines)
  - P0/P1/P2 items for all languages
- [x] T023 Create `assets/checklists/javascript_checklist.md` (325 lines)
  - JS-specific P0/P1/P2 items
- [x] T024 Create `assets/checklists/python_checklist.md` (353 lines)
  - PY-specific P0/P1/P2 items
- [x] T025 Create `assets/checklists/shell_checklist.md` (336 lines)
  - SH-specific P0/P1/P2 items
- [x] T026 Create `assets/checklists/config_checklist.md` (343 lines)
  - JSON/JSONC-specific items
<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:phase-9 -->
## Phase 9: Verification

- [x] T027 Final verification
  - Validate SKILL.md structure (17,104 bytes)
  - Test language detection (routing algorithm implemented)
  - Verify evidence citations (42+ citations across files)
  - Cross-reference patterns (all match research findings)
<!-- /ANCHOR:phase-9 -->

---

<!-- ANCHOR:workstreams -->
## Workstream Assignment

| Workstream | Agent | Tasks | Status |
|------------|-------|-------|--------|
| W-A | Agent 1 | T001-T010 (Setup + Orchestrator + Shared) | Complete |
| W-B | Agent 2 | T011-T013 (JavaScript) | Complete |
| W-C | Agent 3 | T014-T026 (Python + Shell + Config + Checklists) | Complete |
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:completion -->
## Execution Summary

**Parallel Dispatch**: 3 opus agents executed simultaneously
**Total Files Created**: 19 markdown files
**Total LOC**: ~6,500+ lines
**Execution Time**: ~8 minutes (parallel)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:notation -->
## Legend

- `[P]` = Parallelizable (can run simultaneously)
- `[ ]` = Pending
- `[x]` = Complete
- `[~]` = In Progress
- `[!]` = Blocked
<!-- /ANCHOR:notation -->

---

---
title: "Tasks: Skill Rename — workflows-* to sk-*/mcp-* [002-skill-rename/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "skill"
  - "rename"
  - "workflows"
  - "mcp"
  - "038"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Skill Rename — workflows-* to sk-*/mcp-*

<!-- SPECKIT_LEVEL: 3+ -->
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

<!-- ANCHOR:phase-0 -->
## Phase 0: Documentation Setup

- [x] T001 Upgrade parent spec.md to Level 3+ (spec.md)
- [x] T002 Upgrade parent plan.md to Level 3+ (plan.md)
- [x] T003 Upgrade parent checklist.md to Level 3+ (checklist.md)
- [x] T004 Create parent tasks.md (tasks.md)
- [x] T005 Create parent decision-record.md (decision-record.md)
- [x] T006 [P] Create phase 001-sk-code--opencode/ folder with L2 docs
- [x] T007 [P] Create phase 002-sk-code--web/ folder with L2 docs
- [x] T008 [P] Create phase 003-sk-code--full-stack/ folder with L2 docs
- [x] T009 [P] Create phase 004-sk-doc/ folder with L2 docs
- [x] T010 [P] Create phase 005-sk-git/ folder with L2 docs
- [x] T011 [P] Create phase 006-sk-doc-visual/ folder with L2 docs
- [x] T012 [P] Create phase 007-mcp-chrome-devtools/ folder with L2 docs
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-exec -->
## Phase Execution (Sequential — Longest Match First)

- [x] T013 Execute Phase 3: `sk-code--full-stack` → `sk-code--full-stack` (003-sk-code--full-stack/)
- [x] T014 Execute Phase 1: `sk-code--opencode` → `sk-code--opencode` (001-sk-code--opencode/)
- [x] T015 Execute Phase 2: `workflows-code--web-dev` → `sk-code--web` (002-sk-code--web/)
- [x] T016 Execute Phase 7: `mcp-chrome-devtools` → `mcp-chrome-devtools` (007-mcp-chrome-devtools/)
- [x] T017 Execute Phase 4: `sk-doc` → `sk-doc` (004-sk-doc/)
- [x] T018 Execute Phase 6: `sk-doc-visual` → `sk-doc-visual` (006-sk-doc-visual/)
- [x] T019 Execute Phase 5: `sk-git` → `sk-git` (005-sk-git/)
<!-- /ANCHOR:phase-exec -->

---

<!-- ANCHOR:verification -->
## Final Verification

- [x] T020 Run full grep verification: 0 matches for all old names
- [x] T021 Run skill_advisor.py smoke tests (4 queries)
- [x] T022 Verify all 7 new folders exist
- [x] T023 Verify no old folders remain
- [x] T024 Update parent Phase Documentation Map with completion status
- [x] T025 Save memory context
- [x] T026 Create Phase 008 spec documentation (008-sk-code-from-barter-repo/)
- [x] T027 Execute Phase 008: rename `workflows-code` → `sk-code` in Barter repo
- [x] T028 Verify Phase 008: legacy-token scan + skill_advisor.py smoke test (Barter repo)
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Full grep verification passed (T020)
- [x] skill_advisor.py smoke tests passed (T021)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

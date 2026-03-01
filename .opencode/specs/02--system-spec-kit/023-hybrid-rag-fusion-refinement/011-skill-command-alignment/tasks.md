---
title: "Tasks: Skill & Command Alignment"
description: "Task Format: T### [P?] Description (file path)"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Skill & Command Alignment
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Gap Analysis & Planning

- [x] T001 Identify MCP tool gaps across 4 speckit agent files
- [x] T002 Verify gaps against actual agent file content (corrected: 5 actionable gaps, not 7)
- [x] T003 Design canonical+sync editing strategy (ADR-001)
- [x] T004 Determine note placement strategy (ADR-002)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Agent File Updates (Scope B)

- [x] T005 Add `memory_bulk_delete` to L4 row in canonical (`.opencode/agent/speckit.md`)
- [x] T006 Add `eval_run_ablation`, `eval_reporting_dashboard` to L6 row in canonical
- [x] T007 Add `memory_context` modes note after MCP table in canonical
- [x] T008 Add save-time behaviors note after MCP table in canonical
- [x] T009 [P] Sync changes to `.opencode/agent/chatgpt/speckit.md`
- [x] T010 [P] Sync changes to `.claude/agents/speckit.md`
- [x] T011 [P] Sync changes to `.gemini/agents/speckit.md`

### Spec Folder Documentation (Scope A)

- [x] T012 [P] Create spec.md from Level 3 template
- [x] T013 [P] Create plan.md from Level 3 template
- [x] T014 [P] Create tasks.md from Level 3 template (this file)
- [x] T015 [P] Create checklist.md from Level 3 template
- [x] T016 [P] Create decision-record.md from Level 3 template
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification & Completion

- [ ] T017 Diff-verify all 4 agent files have identical Section 2 body content
- [ ] T018 Grep-verify `memory_bulk_delete` present in all 4 files
- [ ] T019 Grep-verify `eval_run_ablation` present in all 4 files
- [ ] T020 Verify all agent files under 550 lines
- [ ] T021 Create implementation-summary.md
- [ ] T022 Run validate.sh on spec folder
- [ ] T023 Save context via generate-context.js
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Command Alignment (Scope C)

- [x] T024 Audit all `.opencode/command/**/*.md` for `memory_bulk_delete` gaps
- [x] T025 Add `memory_bulk_delete` to `manage.md` `allowed-tools` frontmatter
- [x] T026 Add `bulk-delete` mode: argument patterns, routing, enforcement matrix, tool signature
- [x] T027 Add GATE 5 (bulk delete confirmation) and Section 9B (BULK DELETE MODE)
- [x] T028 Add quick reference entries for `bulk-delete`
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 tasks (T001-T004) completed
- [x] All Phase 2 tasks (T005-T016) completed
- [ ] All Phase 3 tasks (T017-T023) completed
- [x] All Phase 4 tasks (T024-T028) completed
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

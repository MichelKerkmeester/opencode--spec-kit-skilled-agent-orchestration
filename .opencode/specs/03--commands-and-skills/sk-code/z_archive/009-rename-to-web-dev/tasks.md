---
title: "Tasks: Rename workflows-code to workflows-code--web-dev [009-rename-to-web-dev/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "rename"
  - "workflows"
  - "code"
  - "028"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Rename workflows-code to workflows-code--web-dev

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.0 -->

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
## Phase 1: Pre-Rename Verification

- [ ] T001 Run baseline grep to count all `workflows-code` references in active files
- [ ] T002 Verify no pending branches with changes to `.opencode/skill/workflows-code/`
- [ ] T003 Snapshot file listing of `workflows-code/` directory for post-rename comparison

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Directory Rename

- [ ] T004 Rename `.opencode/skill/workflows-code/` to `.opencode/skill/workflows-code--web-dev/`
- [ ] T005 Verify file count and names match pre-rename snapshot

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Update References

**Ring 1 - Skill internal files:**
- [ ] T006 [P] Update `SKILL.md` self-references (`.opencode/skill/workflows-code--web-dev/SKILL.md`)
- [ ] T007 [P] Update `assets/checklists/code_quality_checklist.md`
- [ ] T008 [P] Update `references/implementation/bundling_patterns.md`
- [ ] T009 [P] Update `references/implementation/performance_patterns.md`
- [ ] T010 [P] Update `references/deployment/cdn_deployment.md`
- [ ] T011 [P] Update `references/deployment/minification_guide.md`
- [ ] T012 [P] Update `references/debugging/debugging_workflows.md`

**Ring 2 - System configuration files:**
- [ ] T013 Update `AGENTS.md` - all `workflows-code` references
- [ ] T014 [P] Update `AGENTS.md` - skill routing tables
- [ ] T015 [P] Update `.opencode/scripts/skill_advisor.py` - skill name mappings

**Ring 3 - Agent files:**
- [ ] T016 [P] Update `.opencode/agent/orchestrate.md`
- [ ] T017 [P] Update `.opencode/agent/review.md`

**Ring 4 - Command and template files:**
- [ ] T018 [P] Update `.opencode/command/create/assets/create_agent.yaml`
- [ ] T019 [P] Update `.opencode/command/create/skill_reference.md`
- [ ] T020 [P] Update `.opencode/scripts/README.md`

**Ring 5 - Cross-skill references:**
- [ ] T021 [P] Update `.opencode/skill/sk-code--opencode/SKILL.md`
- [ ] T022 [P] Update `.opencode/skill/mcp-chrome-devtools/SKILL.md`
- [ ] T023 [P] Update `.opencode/skill/mcp-chrome-devtools/examples/README.md`
- [ ] T024 [P] Update `.opencode/skill/system-spec-kit/SKILL.md`
- [ ] T025 [P] Update `.opencode/skill/system-spec-kit/assets/level_decision_matrix.md`
- [ ] T026 [P] Update `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`
- [ ] T027 [P] Update `.opencode/skill/system-spec-kit/references/templates/template_guide.md`
- [ ] T028 [P] Update `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md`
- [ ] T029 [P] Update `.opencode/skill/system-spec-kit/references/validation/phase_checklists.md`
- [ ] T030 [P] Update `.opencode/skill/system-spec-kit/references/memory/epistemic-vectors.md`
- [ ] T031 [P] Update `.opencode/skill/system-spec-kit/mcp_server/tests/README.md`
- [ ] T032 [P] Update `.opencode/skill/sk-doc/assets/opencode/skill_md_template.md`

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T033 Run post-rename grep: verify zero stale `workflows-code` references in active files (excluding `--opencode`, `--web-dev`, and `z_archive/`)
- [ ] T034 Verify `skill_advisor.py` routes web dev tasks to `workflows-code--web-dev`
- [ ] T035 Spot-check 3-5 updated files for correct replacements

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Post-rename grep returns zero stale references in active scope
- [ ] Manual verification passed

<!-- /ANCHOR:completion -->

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

---

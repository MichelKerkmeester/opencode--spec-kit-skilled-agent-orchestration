---
title: "Tasks: Create Command YAML Refinement [skilled-agent-orchestration/027-cmd-create-yaml-refinement/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "create yaml refinement tasks"
  - "create command yaml standardization tasks"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/027-cmd-create-yaml-refinement"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Create Command YAML Refinement

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
## Phase 1: Setup

- [x] T001 Audit `.opencode/command/spec_kit/assets/*.yaml` as the style baseline
- [x] T002 Inspect the create asset suite for missing shared top-level sections
- [x] T003 Create the new `027-cmd-create-yaml-refinement` spec folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Rewrite `.opencode/command/create/assets/create_feature_catalog_auto.yaml`
- [x] T011 Rewrite `.opencode/command/create/assets/create_feature_catalog_confirm.yaml`
- [x] T012 Rewrite `.opencode/command/create/assets/create_testing_playbook_auto.yaml`
- [x] T013 Rewrite `.opencode/command/create/assets/create_testing_playbook_confirm.yaml`
- [x] T014 Normalize `.opencode/command/create/assets/create_agent_auto.yaml`
- [x] T015 Normalize `.opencode/command/create/assets/create_agent_confirm.yaml`
- [x] T016 Normalize `.opencode/command/create/assets/create_changelog_auto.yaml`
- [x] T017 Normalize `.opencode/command/create/assets/create_changelog_confirm.yaml`
- [x] T018 Normalize `.opencode/command/create/assets/create_folder_readme_auto.yaml`
- [x] T019 Normalize `.opencode/command/create/assets/create_folder_readme_confirm.yaml`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Parse every file in `.opencode/command/create/assets/`
- [x] T021 Re-validate `.opencode/command/create/README.txt`
- [x] T022 Re-validate `.opencode/command/README.txt`
- [x] T023 Validate this spec folder with `validate.sh`
- [x] T024 Update `implementation-summary.md` with the final verification evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All scoped YAML asset edits complete
- [x] No validation blockers remain in the spec packet
- [x] The create asset suite exposes one shared top-level contract
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

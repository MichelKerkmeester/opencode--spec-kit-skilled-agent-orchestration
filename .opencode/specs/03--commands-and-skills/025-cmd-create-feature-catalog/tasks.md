---
title: "Tasks: /create:feature-catalog Command [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "feature catalog command tasks"
  - "/create:feature-catalog tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: /create:feature-catalog Command

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

- [x] T001 Confirm spec `021-sk-doc-feature-catalog-testing-playbook` remains the source of truth for feature-catalog package shape
- [x] T002 Read `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md`
- [x] T003 Read `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md`
- [x] T004 Read `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md`
- [x] T005 Freeze naming translation `/create:feature-catalog` -> `feature_catalog/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Create `.opencode/command/create/feature-catalog.md`
- [x] T011 Create `.opencode/command/create/assets/create_feature_catalog_auto.yaml`
- [x] T012 Create `.opencode/command/create/assets/create_feature_catalog_confirm.yaml`
- [x] T013 Create `.agents/commands/create/feature-catalog.toml`
- [x] T014 Ensure all three command surfaces use the same operation arguments and path conventions
- [x] T015 Ensure the workflow loads the feature-catalog creation reference and both template files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Update `.opencode/command/create/README.txt`
- [x] T021 Update `.opencode/command/README.txt`
- [x] T022 Update `.opencode/README.md`
- [x] T023 [P] Update `.opencode/agent/write.md`
- [x] T024 [P] Update `.opencode/agent/chatgpt/write.md`
- [x] T025 [P] Update `.codex/agents/write.toml`
- [x] T026 [P] Update `.agents/agents/write.md`
- [x] T030 Run `validate_document.py` for `.opencode/command/create/feature-catalog.md`
- [x] T031 Parse `create_feature_catalog_auto.yaml`
- [x] T032 Parse `create_feature_catalog_confirm.yaml`
- [x] T033 Parse `.agents/commands/create/feature-catalog.toml`
- [x] T034 Run grep/path sweeps for `/create:feature-catalog` across runtime docs
- [x] T035 Validate this spec folder with `validate.sh`
- [x] T036 Update `implementation-summary.md` with real implementation evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All scoped implementation tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Command files, runtime mirror, and discovery docs agree on command naming and output folder contract
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

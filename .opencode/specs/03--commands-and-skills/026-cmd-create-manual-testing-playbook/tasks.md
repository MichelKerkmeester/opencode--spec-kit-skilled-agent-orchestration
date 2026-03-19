---
title: "Tasks: /create:testing-playbook Command [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "testing playbook command tasks"
  - "/create:testing-playbook tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: /create:testing-playbook Command

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

- [x] T001 Confirm spec `021-sk-doc-feature-catalog-testing-playbook` remains the source of truth for manual testing playbook package shape
- [x] T002 Read `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md`
- [x] T003 Read `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md`
- [x] T004 Read `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md`
- [x] T005 Freeze naming translation `/create:testing-playbook` -> `manual_testing_playbook/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Create `.opencode/command/create/testing-playbook.md`
- [x] T011 Create `.opencode/command/create/assets/create_testing_playbook_auto.yaml`
- [x] T012 Create `.opencode/command/create/assets/create_testing_playbook_confirm.yaml`
- [x] T013 Create `.agents/commands/create/testing-playbook.toml`
- [x] T014 Ensure all three command surfaces use the same operation arguments and path conventions
- [x] T015 Ensure the workflow loads the playbook creation reference and both template files
- [x] T016 Ensure the workflow forbids legacy sidecar review files and a `snippets/` subtree
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
- [x] T030 Run `validate_document.py` for `.opencode/command/create/testing-playbook.md`
- [x] T031 Parse `create_testing_playbook_auto.yaml`
- [x] T032 Parse `create_testing_playbook_confirm.yaml`
- [x] T033 Parse `.agents/commands/create/testing-playbook.toml`
- [x] T034 Run grep/path sweeps for `/create:testing-playbook` across runtime docs
- [x] T035 Verify generated package rules exclude legacy sidecar review files and `snippets/`
- [x] T036 Validate this spec folder with `validate.sh`
- [x] T037 Update `implementation-summary.md` with real implementation evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All scoped implementation tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Command files, runtime mirror, and discovery docs agree on command naming, output folder contract, and no-sidecar rules
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

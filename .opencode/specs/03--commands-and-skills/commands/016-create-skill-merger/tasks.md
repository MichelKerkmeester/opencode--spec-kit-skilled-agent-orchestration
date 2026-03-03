---
title: "Tasks: Create Skill Merger"
description: "Completed task log for canonical /create:sk-skill migration, alignment, expansion, and memory indexing"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "tasks"
  - "create skill merger"
  - "retroactive implementation"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Create Skill Merger

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
## Phase 1: Canonical Command and Unified Workflows

- [x] T001 Create canonical command entrypoint for merged skill operations (`.opencode/command/create/sk-skill.md`)
- [x] T002 [P] Create autonomous unified workflow with 4 operation branches (`.opencode/command/create/assets/create_sk_skill_auto.yaml`)
- [x] T003 [P] Create interactive unified workflow with checkpoints (`.opencode/command/create/assets/create_sk_skill_confirm.yaml`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Deprecation Cleanup

- [x] T004 Delete deprecated legacy command entrypoint (`.opencode/command/create/skill.md`)
- [x] T005 Delete deprecated legacy reference command (`.opencode/command/create/skill_reference.md`)
- [x] T006 Delete deprecated legacy asset command (`.opencode/command/create/skill_asset.md`)
- [x] T007 Delete deprecated legacy auto/confirm workflow pair (`.opencode/command/create/assets/create_skill_auto.yaml`, `.opencode/command/create/assets/create_skill_confirm.yaml`)
- [x] T008 Delete deprecated legacy reference workflow pair (`.opencode/command/create/assets/create_skill_reference_auto.yaml`, `.opencode/command/create/assets/create_skill_reference_confirm.yaml`)
- [x] T009 Delete deprecated legacy asset workflow pair (`.opencode/command/create/assets/create_skill_asset_auto.yaml`, `.opencode/command/create/assets/create_skill_asset_confirm.yaml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Reference Alignment and Verification

- [x] T010 Update related command reference links to canonical variants (`.opencode/command/create/prompt.md`)
- [x] T011 Verify operation support documented (`full-create`, `full-update`, `reference-only`, `asset-only`) in canonical command and mode workflows (`.opencode/command/create/sk-skill.md`, `.opencode/command/create/assets/create_sk_skill_auto.yaml`, `.opencode/command/create/assets/create_sk_skill_confirm.yaml`)
- [x] T012 Verify mode support documented (`:auto`, `:confirm`) in canonical command and mode workflows (`.opencode/command/create/sk-skill.md`, `.opencode/command/create/assets/create_sk_skill_auto.yaml`, `.opencode/command/create/assets/create_sk_skill_confirm.yaml`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Canonical Alignment and Length Expansion

- [x] T013 Align canonical command and unified YAMLs closer to sk-doc command template and existing create-command conventions (`.opencode/command/create/sk-skill.md`, `.opencode/command/create/assets/create_sk_skill_auto.yaml`, `.opencode/command/create/assets/create_sk_skill_confirm.yaml`)
- [x] T014 Verify canonical command expansion to 523 lines (`.opencode/command/create/sk-skill.md`)
- [x] T015 Verify autonomous YAML expansion to 470 lines (`.opencode/command/create/assets/create_sk_skill_auto.yaml`)
- [x] T016 Verify interactive YAML expansion to 519 lines (`.opencode/command/create/assets/create_sk_skill_confirm.yaml`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Cross-Runtime Documentation Sync

- [x] T017 Synchronize active write-agent docs to canonical command naming (`.agents/agents/write.md`, `.opencode/agent/write.md`, `.opencode/agent/chatgpt/write.md`, `.codex/agents/write.toml`)
- [x] T018 Synchronize active README/install guides to canonical command naming (`.opencode/README.md`, `README.md`, `.opencode/install_guides/README.md`, `.opencode/install_guides/SET-UP - AGENTS.md`)
- [x] T019 Verify zero legacy `/create:skill*` references in runtime docs directories (`.agents/agents`, `.codex`, `.claude`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Memory Save and Indexing

- [x] T020 Save implementation memory in spec-folder memory path (`.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/memory/*.md` via `generate-context.js`)
- [x] T021 Confirm memory metadata embedding status is indexed (`.opencode/specs/03--commands-and-skills/commands/016-create-skill-merger/memory/metadata.json`)
- [x] T022 Run `memory_index_scan` for spec folder and confirm completion status (spec folder `03--commands-and-skills/commands/016-create-skill-merger`)
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Migration strategy reflected: canonical `/create:sk-skill`; old command/workflow files removed
- [x] Cross-runtime doc synchronization reflected across write-agent/runtime/README/install guide surfaces
- [x] Alignment and length expansion reflected with exact line-count outcomes
- [x] Memory save and indexing reflected with concrete file and scan evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Completion Notes**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

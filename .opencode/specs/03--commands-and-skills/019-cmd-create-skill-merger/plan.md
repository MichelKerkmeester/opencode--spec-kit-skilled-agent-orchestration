---
title: "Implementation Plan: Create Skill Merger"
description: "Consolidate skill creation command surfaces into one canonical command and two unified mode workflows, align and expand canonical artifacts, retire deprecated assets, and complete memory indexing."
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
trigger_phrases:
  - "implementation plan"
  - "create skill merger"
  - "create:sk-skill"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Create Skill Merger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML command/workflow definitions |
| **Framework** | OpenCode command framework |
| **Storage** | Repository file system |
| **Testing** | Static contract verification through file content and presence checks |

### Overview
This implementation replaced fragmented create-skill command entrypoints with one canonical command file and two unified mode workflow files. Delivery followed a migration-first strategy, then a deterministic hardening pass: align canonical artifacts with sk-doc/create-command conventions, expand contract detail coverage, synchronize active cross-runtime docs to canonical `/create:sk-skill`, and save/index spec-folder memory artifacts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.
- [x] Success criteria measurable and migration-focused.
- [x] Dependencies identified (create command docs and workflow assets).

### Definition of Done
- [x] Canonical command and mode workflows present.
- [x] Deprecated command/workflow files removed.
- [x] Related command references updated to canonical variants.
- [x] Level 2 documentation synchronized.
- [x] Canonical command and YAML artifacts aligned with sk-doc/create command conventions.
- [x] Length expansion completed for canonical command and both unified YAML files.
- [x] Memory context saved and indexed for this spec folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command-router consolidation with explicit operation and mode contracts.

### Key Components
- **Canonical Entrypoint** (`.opencode/command/create/sk-skill.md`): Defines setup, gate model, mode routing, and operation contract.
- **Auto Workflow** (`.opencode/command/create/assets/create_sk_skill_auto.yaml`): Autonomous execution flow.
- **Confirm Workflow** (`.opencode/command/create/assets/create_sk_skill_confirm.yaml`): Interactive execution flow with checkpoints.
- **Reference Update** (`.opencode/command/create/prompt.md`): Points related command guidance to canonical command variants.
- **Cross-Runtime Doc Sync** (`.agents/agents/write.md`, `.opencode/agent/write.md`, `.opencode/agent/chatgpt/write.md`, `.codex/agents/write.toml`, `.opencode/README.md`, `README.md`, `.opencode/install_guides/README.md`, `.opencode/install_guides/SET-UP - AGENTS.md`): Aligns active docs to canonical `/create:sk-skill` naming.
- **Legacy Reference Verification** (`.agents/agents`, `.codex`, `.claude`): Directory-level check confirms no remaining `/create:skill*` references.
- **Memory Artifacts** (`memory/*.md`, `memory/metadata.json`): Captures and indexes implementation context for retrieval.

### Data Flow
User invokes `/create:sk-skill` -> command file validates setup and required fields -> command routes by mode (`:auto` or `:confirm`) -> selected YAML routes by operation (`full-create`, `full-update`, `reference-only`, `asset-only`) -> workflow enforces hard/soft gates and completion reporting.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Canonical Entry and Mode Workflows
- [x] Create canonical command entrypoint.
- [x] Create autonomous unified workflow file.
- [x] Create interactive unified workflow file.

### Phase 2: Migration Cleanup
- [x] Remove deprecated command markdown files.
- [x] Remove deprecated workflow YAML files.

### Phase 3: Reference Alignment
- [x] Update related prompt command references to `/create:sk-skill` variants.
- [x] Verify operation and mode support are represented in canonical docs.

### Phase 4: Canonical Alignment and Expansion
- [x] Align `.opencode/command/create/sk-skill.md` with sk-doc command template and create-command conventions.
- [x] Expand `.opencode/command/create/sk-skill.md` to 523 lines.
- [x] Expand `.opencode/command/create/assets/create_sk_skill_auto.yaml` to 470 lines.
- [x] Expand `.opencode/command/create/assets/create_sk_skill_confirm.yaml` to 519 lines.

### Phase 5: Cross-Runtime Documentation Sync
- [x] Synchronize active cross-runtime docs to canonical `/create:sk-skill` naming in all eight listed files.
- [x] Verify no legacy `/create:skill*` references remain in `.agents/agents`, `.codex`, and `.claude`.

### Phase 6: Memory Persistence
- [x] Save memory context file for spec folder.
- [x] Confirm indexed embedding metadata and successful `memory_index_scan` completion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural verification | Canonical files exist; deprecated files absent | Repository path checks |
| Contract verification | Operation/mode support statements in command/YAML docs | Content inspection |
| Reference verification | Prompt command links point to canonical variants | Content inspection |
| Cross-runtime doc sync verification | Active docs and guides point to canonical variants | Content inspection across eight listed files |
| Legacy reference scan | No `/create:skill*` references in key runtime directories | Directory grep checks in `.agents/agents`, `.codex`, `.claude` |
| Expansion verification | Canonical artifact line counts match completion target | `wc -l` checks |
| Memory verification | Memory save artifacts exist and index state is current | Memory file checks + `memory_index_scan` result |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/command/create/` command docs | Internal | Green | Consolidation cannot be completed |
| `.opencode/command/create/assets/` workflows | Internal | Green | Mode routing cannot be unified |
| Related prompt reference docs | Internal | Green | Users receive stale command guidance |
| Runtime write-agent and README/install docs | Internal | Green | Canonical command naming drifts across runtimes |
| `.opencode/specs/.../memory/` persistence artifacts | Internal | Green | Implementation context is not retrievable for continuation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Canonical command fails to represent required operations or mode routing.
- **Procedure**: Reintroduce removed legacy files from VCS history and revert prompt reference updates until canonical contract is corrected.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Canonical Create) ---> Phase 2 (Migration Cleanup) ---> Phase 3 (Reference Alignment) ---> Phase 4 (Alignment + Expansion) ---> Phase 5 (Cross-Runtime Doc Sync) ---> Phase 6 (Memory Persistence)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Canonical Create | None | Cleanup, Reference Alignment |
| Migration Cleanup | Canonical Create | Reference Alignment finalization |
| Reference Alignment | Canonical Create, Cleanup | Alignment + Expansion |
| Alignment + Expansion | Canonical Create, Reference Alignment | Cross-Runtime Doc Sync |
| Cross-Runtime Doc Sync | Alignment + Expansion | Memory Persistence |
| Memory Persistence | Cross-Runtime Doc Sync | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Canonical Create | Medium | Completed |
| Migration Cleanup | Low | Completed |
| Reference Alignment | Low | Completed |
| Alignment + Expansion | Medium | Completed |
| Cross-Runtime Doc Sync | Low | Completed |
| Memory Persistence | Low | Completed |
| **Total** | | **Completed (retroactive documentation)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Canonical command routing definitions are present.
- [x] Mode workflows map to command routing targets.
- [x] Legacy file removal list confirmed.

### Rollback Procedure
1. Restore removed legacy command/workflow files from version control.
2. Revert canonical command and prompt reference updates.
3. Verify command docs and workflow assets match restored state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable.
<!-- /ANCHOR:enhanced-rollback -->

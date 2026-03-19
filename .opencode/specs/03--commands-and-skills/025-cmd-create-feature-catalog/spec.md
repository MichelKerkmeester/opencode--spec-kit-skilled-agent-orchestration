---
title: "Feature Specification: /create:feature-catalog Command [template:level_3/spec.md]"
description: "Define a Level 3 implementation packet for a new create command that scaffolds feature_catalog packages from the shipped sk-doc references and templates aligned in spec 021."
trigger_phrases:
  - "create feature catalog command"
  - "/create:feature-catalog"
  - "feature catalog scaffold"
  - "sk-doc feature catalog template"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: /create:feature-catalog Command

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet defines the implementation contract for a new `/create:feature-catalog` command that scaffolds the current `sk-doc` feature-catalog package shape. The command must create or update `feature_catalog/` using the shipped creation reference and both template files, then keep runtime mirrors and command-discovery surfaces aligned.

**Key Decisions**: Keep the user-facing command name `/create:feature-catalog` while scaffolding the canonical `feature_catalog/` folder; treat spec `021-sk-doc-feature-catalog-testing-playbook` as the source of truth for package shape and authoring rules.

**Critical Dependencies**: `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md`, `.opencode/skill/sk-doc/assets/documentation/feature_catalog/`, and the existing `create/*` command conventions.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-19 |
| **Updated** | 2026-03-19 |
| **Branch** | `025-cmd-create-feature-catalog` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo has a shipped feature-catalog contract and `sk-doc` now teaches that contract through dedicated templates and creation references, but there is no dedicated create command that can scaffold it consistently. That leaves authors to assemble `feature_catalog/` packages by hand, which increases the risk of stale headers, wrong folder layout, missed template inputs, and unsynchronized runtime command menus.

### Purpose
Add `/create:feature-catalog` so authors can generate or update a canonical `feature_catalog/` package using the current `sk-doc` standards without re-deriving the contract manually.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a canonical command entrypoint at `.opencode/command/create/feature-catalog.md`.
- Add paired workflow assets:
  - `.opencode/command/create/assets/create_feature_catalog_auto.yaml`
  - `.opencode/command/create/assets/create_feature_catalog_confirm.yaml`
- Add the runtime mirror `.agents/commands/create/feature-catalog.toml`.
- Define command setup flow for:
  - target skill name
  - `create|update` operation
  - `--path <dir>` override
  - `:auto|:confirm` execution mode
  - source strategy based on existing playbook/catalog state
- Require the command to load:
  - `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md`
  - `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md`
  - `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md`
- Define output contract for `<skill-root>/feature_catalog/feature_catalog.md` plus numbered root-level category folders and per-feature files.
- Scope the implementation to existing create-command patterns, runtime mirrors, and command-advertising docs that list live create commands.

### Out of Scope
- Implementing recursive feature-file validators.
- Changing the shipped `feature_catalog/` contract described in spec `021-sk-doc-feature-catalog-testing-playbook`.
- Creating new command-entry surfaces in runtimes that do not already expose them.
- Editing command implementation files in this spec-authoring turn.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/feature-catalog.md` | Create | Canonical command definition for `/create:feature-catalog` |
| `.opencode/command/create/assets/create_feature_catalog_auto.yaml` | Create | Auto-mode workflow |
| `.opencode/command/create/assets/create_feature_catalog_confirm.yaml` | Create | Confirm-mode workflow |
| `.agents/commands/create/feature-catalog.toml` | Create | Runtime mirror for the command |
| `.opencode/command/create/README.txt` | Modify | Add the new command to the create-command inventory |
| `.opencode/command/README.txt` | Modify | Keep top-level command catalog aligned |
| `.opencode/README.md` | Modify | Reflect the new create command in runtime-facing docs |
| `.opencode/agent/write.md` | Modify | Add the command to write-agent guidance where create commands are enumerated |
| `.opencode/agent/chatgpt/write.md` | Modify | Keep ChatGPT runtime write guidance aligned |
| `.codex/agents/write.toml` | Modify | Keep Codex runtime create-command inventory aligned |
| `.agents/agents/write.md` | Modify | Keep `.agents` runtime guidance aligned |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical command entrypoints exist | `.opencode/command/create/feature-catalog.md`, the paired YAML assets, and `.agents/commands/create/feature-catalog.toml` all exist and refer to the same command |
| REQ-002 | The command uses the shipped feature-catalog contract | The command loads the feature-catalog creation reference plus both feature-catalog templates from `sk-doc` and scaffolds the root catalog file under `feature_catalog/` plus numbered category folders |
| REQ-003 | Setup flow captures the required routing decisions | The command supports `<skill-name> [create|update] [--path <dir>] [:auto|:confirm]` and explicitly collects target path, operation, source strategy, and execution mode |
| REQ-004 | Create/update behavior is honest about output location | The command name stays `/create:feature-catalog` while output lands in `<skill-root>/feature_catalog/` and that translation is documented in the command and spec packet |
| REQ-005 | Runtime-facing command inventories stay synchronized | The existing create-command discovery docs and write-agent surfaces list the new command consistently |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | The command follows the current create-command pattern | It requires `@write` Phase 0 verification, uses a single consolidated setup prompt, and ships `:auto` and `:confirm` variants |
| REQ-102 | The generated catalog follows frontmatter and section conventions | The root and per-feature outputs use frontmatter, unnumbered `TABLE OF CONTENTS` in the root, and numbered all-caps section headers |
| REQ-103 | Runtime mirror policy remains minimal | Only the real `.agents` command mirror is added; no new fake command-entry folders are introduced elsewhere |
| REQ-104 | Validation strategy is documented before implementation begins | The packet records command-doc validation, YAML/TOML parsing, command-inventory greps, and scenario checks for create/update plus auto/confirm modes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/create:feature-catalog` can be documented and implemented without re-deriving the feature-catalog contract from memory.
- **SC-002**: The command scaffolds the same `feature_catalog/` package shape taught by `sk-doc` and shipped in `system-spec-kit`.
- **SC-003**: The command’s markdown entrypoint, YAML variants, and `.agents` mirror stay structurally aligned.
- **SC-004**: Runtime-facing command lists mention `/create:feature-catalog` consistently and do not imply unsupported mirrors.
- **SC-005**: The packet is complete enough that implementation can proceed without reopening structural decisions.

### Acceptance Scenarios

1. **Given** a maintainer runs `/create:feature-catalog my-skill create :auto`, **when** the command resolves the skill root, **then** it scaffolds the target skill's root catalog file under `feature_catalog/` plus numbered category folders using the shipped `sk-doc` reference and templates.
2. **Given** a maintainer runs `/create:feature-catalog my-skill update --path custom/skills :confirm`, **when** an existing catalog is present, **then** the command routes through the update flow instead of pretending it is a greenfield create.
3. **Given** a runtime consumer reads the create-command menus, **when** it looks for feature-catalog generation support, **then** `/create:feature-catalog` appears in the same surfaces as other live create commands.
4. **Given** future maintainers inspect the spec packet, **when** they compare it with spec `021-sk-doc-feature-catalog-testing-playbook`, **then** the output contract matches the shipped feature-catalog package shape.
5. **Given** the command is invoked with `--path custom/skills`, **when** the workflow resolves the skill root, **then** output still lands in that custom parent instead of silently falling back to `.opencode/skill/`.
6. **Given** the command generates the package from a paired playbook, **when** reviewers inspect the output, **then** root summaries and per-feature files still match the rooted feature-catalog contract instead of a playbook-oriented structure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec `021-sk-doc-feature-catalog-testing-playbook` | Wrong output contract if ignored | Treat `021` as authoritative for package shape, headers, and template/reference inputs |
| Dependency | Existing `create/*` command conventions | Drift from runtime expectations | Mirror naming, setup flow, and YAML pairing from existing create commands |
| Risk | Command name vs folder-name confusion | Users may expect `feature-playbook/` style output or mismatched paths | Document the explicit translation: `/create:feature-catalog` -> `feature_catalog/` |
| Risk | Only the root template is loaded | Generated catalog may omit per-feature file contract | Require both the root template and the snippet template in the implementation flow |
| Risk | Runtime docs miss the new command | Discoverability and routing drift | Include doc-synchronization work in the same implementation packet |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Command setup stays lightweight and uses one consolidated prompt instead of repeated clarification rounds.
- **NFR-P02**: Template/reference loading should remain limited to the files required for this document family.

### Security
- **NFR-S01**: The command must not instruct authors to fabricate current-state behavior; generated docs should clearly be scaffolds requiring project-specific content.
- **NFR-S02**: No secrets, credentials, or environment-specific internals should be embedded in the scaffold defaults.

### Reliability
- **NFR-R01**: The generated root catalog and per-feature files use stable folder and file naming conventions from the shipped contract.
- **NFR-R02**: All declared command paths and asset references resolve cleanly in documentation validation and path sweeps.

---

## 8. EDGE CASES

### Data Boundaries
- A skill may not yet contain enough features for a mature multi-category catalog; the command should still scaffold a valid minimal package.
- A skill may already have a manual testing playbook but no feature catalog; the command should allow catalog creation from that context.
- A custom `--path` may target a non-default skill root parent and must not silently fall back to `.opencode/skill/`.

### Error Scenarios
- Existing `feature_catalog/` content is present during `create`; the command should stop or switch to the documented update path.
- The creation reference or either template file is missing or moved; the command should fail loudly instead of generating partial output.
- Runtime mirror documentation lists the command but the command assets are missing; the packet must prevent this drift by treating them as one deliverable set.

### State Transitions
- Greenfield create: no catalog exists -> scaffold full root file plus category folders.
- Update path: catalog exists -> refresh/extend based on current package state without changing the canonical folder name.
- Runtime sync: new command files land -> runtime command inventories update in the same implementation phase.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | New command docs, YAML assets, runtime mirror, and multiple downstream command inventories |
| Risk | 17/25 | Contract drift between `sk-doc`, generated output, and command discovery docs |
| Research | 13/20 | Must reconcile spec `021`, `sk-doc` creation guidance, and existing create-command patterns |
| Multi-Agent | 7/15 | Moderate coordination across command/runtime surfaces |
| Coordination | 8/15 | Requires synchronized markdown, YAML, TOML, and runtime-doc updates |
| **Total** | **66/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Implementation loads only one template file | High | Medium | Make both template files explicit P0 requirements and test for them |
| R-002 | Runtime docs advertise a command not actually shipped | Medium | Medium | Keep command files and command inventories in one implementation phase |
| R-003 | `create` vs `update` semantics stay ambiguous | High | Medium | Require explicit operation routing and scenario coverage in the packet |
| R-004 | Output path uses the wrong folder naming | High | Low | Record `/create:feature-catalog` -> `feature_catalog/` as an accepted ADR |

---

## 11. USER STORIES

### US-001: Create a new catalog package (Priority: P0)

**As a** skill author, **I want** `/create:feature-catalog` to scaffold the canonical package shape, **so that** I can produce a standards-aligned feature inventory without rebuilding the contract manually.

**Acceptance Criteria**:
1. Given a target skill without a catalog, When I run the command in create mode, Then it scaffolds the root catalog file under `feature_catalog/` and numbered category folders.

---

### US-002: Update an existing catalog package (Priority: P0)

**As a** maintainer, **I want** the command to distinguish update from create, **so that** it can safely extend an existing catalog instead of overwriting it blindly.

**Acceptance Criteria**:
1. Given an existing `feature_catalog/` package, When I run the command in update mode, Then the workflow acknowledges the existing package and routes through an update-oriented prompt path.

---

### US-003: Trust the generated structure (Priority: P1)

**As a** reviewer, **I want** the command output to match spec `021` and the `sk-doc` feature-catalog references, **so that** generated docs are consistent with the shipped examples.

**Acceptance Criteria**:
1. Given the generated docs, When I inspect headers, TOC, folder naming, and per-feature file structure, Then they match the documented contract from spec `021`.

---

### US-004: Discover the command in every live runtime surface (Priority: P1)

**As a** runtime operator, **I want** the new command to appear in the same command inventories as other create commands, **so that** I do not need tribal knowledge to find it.

**Acceptance Criteria**:
1. Given the updated runtime docs, When I inspect create-command listings, Then `/create:feature-catalog` is documented consistently.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The output contract, runtime scope, and naming translation are fixed by this packet and spec `021-sk-doc-feature-catalog-testing-playbook`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

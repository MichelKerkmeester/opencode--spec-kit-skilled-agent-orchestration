---
title: "Feature Specification: /create:testing-playbook Command [template:level_3/spec.md]"
description: "Define a Level 3 implementation packet for a new create command that scaffolds manual_testing_playbook packages from the shipped sk-doc references and templates aligned in spec 021."
trigger_phrases:
  - "create testing playbook command"
  - "/create:testing-playbook"
  - "manual testing playbook scaffold"
  - "sk-doc playbook template"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: /create:testing-playbook Command

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet defines the implementation contract for `/create:testing-playbook`, a new create command that must scaffold the current integrated `manual_testing_playbook/` package. The command must honor the post-021 contract: root playbook plus numbered category folders, root-owned review/orchestration guidance, per-feature files that mimic feature-catalog entry structure, and no legacy review or sub-agent ledger sidecars or `snippets/` subtree.

**Key Decisions**: Keep the requested command name `/create:testing-playbook` while generating the canonical `manual_testing_playbook/` folder; require the playbook creation reference and both testing-playbook templates as source inputs.

**Critical Dependencies**: `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md`, `.opencode/skill/sk-doc/assets/documentation/testing_playbook/`, and spec `021-sk-doc-feature-catalog-testing-playbook`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-19 |
| **Updated** | 2026-03-19 |
| **Branch** | `026-cmd-create-manual-testing-playbook` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo now has a stable manual testing playbook contract, but there is no dedicated create command that can generate it reliably. That forces authors to recreate root guidance, numbered category folders, prompt-orchestration rules, and per-feature-file structure manually, which risks reintroducing the sidecar-doc and `snippets/` patterns that spec `021` explicitly removed.

### Purpose
Add `/create:testing-playbook` so authors can create or update a standards-aligned `manual_testing_playbook/` package that matches the shipped playbook contract taught by `sk-doc`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a canonical command entrypoint at `.opencode/command/create/testing-playbook.md`.
- Add paired workflow assets:
  - `.opencode/command/create/assets/create_testing_playbook_auto.yaml`
  - `.opencode/command/create/assets/create_testing_playbook_confirm.yaml`
- Add the runtime mirror `.agents/commands/create/testing-playbook.toml`.
- Define command setup flow for:
  - target skill name
  - `create|update` operation
  - `--path <dir>` override
  - `:auto|:confirm` execution mode
  - source strategy based on an existing feature catalog or manual scenario inventory
- Require the command to load:
  - `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md`
  - `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md`
  - `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md`
- Define output contract for `<skill-root>/manual_testing_playbook/manual_testing_playbook.md` plus numbered root-level category folders and per-feature files.
- Require the output to follow the integrated root-guidance model and explicitly forbid canonical sidecar playbook files.
- Scope the implementation to existing create-command patterns, runtime mirrors, and command-advertising docs that list live create commands.

### Out of Scope
- Changing the shipped playbook contract captured in spec `021`.
- Reintroducing legacy review/ledger sidecars or a `snippets/` subtree.
- Creating recursive validators for playbook per-feature files.
- Editing command implementation files in this spec-authoring turn.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/testing-playbook.md` | Create | Canonical command definition for `/create:testing-playbook` |
| `.opencode/command/create/assets/create_testing_playbook_auto.yaml` | Create | Auto-mode workflow |
| `.opencode/command/create/assets/create_testing_playbook_confirm.yaml` | Create | Confirm-mode workflow |
| `.agents/commands/create/testing-playbook.toml` | Create | Runtime mirror for the command |
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
| REQ-001 | Canonical command entrypoints exist | `.opencode/command/create/testing-playbook.md`, the paired YAML assets, and `.agents/commands/create/testing-playbook.toml` all exist and refer to the same command |
| REQ-002 | The command uses the shipped testing-playbook contract | The command loads the playbook creation reference plus both testing-playbook templates and scaffolds the root playbook file under `manual_testing_playbook/` plus numbered category folders of per-feature files |
| REQ-003 | The generated playbook follows the integrated root-guidance model | Output contains root-owned review/orchestration guidance and does not create legacy review/ledger sidecars or a `snippets/` subtree |
| REQ-004 | Setup flow captures the required routing decisions | The command supports `<skill-name> [create|update] [--path <dir>] [:auto|:confirm]` and explicitly collects target path, operation, source strategy, and execution mode |
| REQ-005 | Runtime-facing command inventories stay synchronized | Existing create-command discovery docs and write-agent surfaces list the new command consistently |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | The command follows the current create-command pattern | It requires `@write` Phase 0 verification, uses a single consolidated setup prompt, and ships `:auto` and `:confirm` variants |
| REQ-102 | Generated playbooks mimic the current feature-catalog-style header and snippet structure | Root and per-feature outputs use frontmatter, unnumbered `TABLE OF CONTENTS` in the root, numbered all-caps section headers, and divider lines between numbered sections |
| REQ-103 | Scenario prompts are scaffolded for realistic orchestrator-led testing | The generated package instructs authors to capture user request, orchestrator prompt, execution process, desired user-visible outcome, evidence, and verdict |
| REQ-104 | Validation strategy is documented before implementation begins | The packet records command-doc validation, YAML/TOML parsing, command-inventory greps, and create/update plus auto/confirm scenario checks |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/create:testing-playbook` generates the same playbook package shape taught by `sk-doc` and shipped in `system-spec-kit`.
- **SC-002**: The command never reintroduces legacy sidecar files or the deprecated `snippets/` subtree.
- **SC-003**: The command’s markdown entrypoint, YAML variants, and `.agents` mirror stay structurally aligned.
- **SC-004**: Runtime-facing command lists mention `/create:testing-playbook` consistently and do not imply unsupported mirrors.
- **SC-005**: The packet is complete enough that implementation can proceed without reopening core decisions around prompts, package shape, or runtime scope.

### Acceptance Scenarios

1. **Given** a maintainer runs `/create:testing-playbook my-skill create :auto`, **when** the command resolves the skill root, **then** it scaffolds the target skill's root playbook file under `manual_testing_playbook/` plus numbered category folders using the shipped playbook reference and templates.
2. **Given** a maintainer runs `/create:testing-playbook my-skill update :confirm`, **when** an existing playbook is present, **then** the workflow routes through an update-aware flow and preserves the canonical package naming.
3. **Given** the generated package is inspected, **when** reviewers look for sidecar review docs or a `snippets/` subtree, **then** neither exists because the guidance lives in the root playbook and the per-feature files live in root-level numbered folders.
4. **Given** runtime consumers inspect command menus, **when** they look for testing-playbook generation support, **then** `/create:testing-playbook` appears consistently across the live create-command inventories.
5. **Given** the command is invoked with `--path custom/skills`, **when** the workflow resolves the skill root, **then** output still lands in that custom parent instead of silently falling back to `.opencode/skill/`.
6. **Given** a feature catalog already exists, **when** the workflow derives scenario inventory from it, **then** the generated playbook still preserves integrated root guidance and realistic prompt scaffolding.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec `021-sk-doc-feature-catalog-testing-playbook` | Wrong playbook shape if ignored | Treat `021` as authoritative for package contract, sidecar removal, and header conventions |
| Dependency | Existing `create/*` command conventions | Drift from runtime expectations | Mirror the current create-command structure and setup flow |
| Risk | Legacy playbook structure leaks back in | High | Make sidecar-file and `snippets/` prohibition a P0 requirement |
| Risk | Playbook prompts are generated as bare command paraphrases | Medium | Make orchestrator-led prompt scaffolding a P1 requirement and ADR-backed rule |
| Risk | Runtime docs miss the new command | Medium | Include command-inventory synchronization in the implementation scope |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Command setup stays lightweight and uses one consolidated prompt instead of repeated clarification rounds.
- **NFR-P02**: Reference/template loading remains limited to the files required for this document family.

### Security
- **NFR-S01**: Generated playbooks must not imply that destructive tests are safe by default; the scaffold should retain root-level safety and evidence guidance.
- **NFR-S02**: No secrets, credentials, or machine-specific internals should be embedded in scaffold defaults.

### Reliability
- **NFR-R01**: Generated root and per-feature files use stable naming conventions from the shipped contract.
- **NFR-R02**: The command never creates deprecated sidecar canonical files or a `snippets/` subtree.

---

## 8. EDGE CASES

### Data Boundaries
- A skill may have a feature catalog already; the command should use that as the preferred input source for scenario inventory.
- A skill may have no catalog; the command should still support manual scenario inventory capture.
- A custom `--path` may target a non-default skill root parent and must not silently fall back to `.opencode/skill/`.

### Error Scenarios
- Existing `manual_testing_playbook/` content is present during `create`; the command should stop or switch to the documented update path.
- The creation reference or either template file is missing or moved; the command should fail loudly instead of generating partial output.
- Runtime mirror documentation lists the command but the command assets are missing; the packet must prevent this drift by treating them as one deliverable set.

### State Transitions
- Greenfield create: no playbook exists -> scaffold root file plus category folders and per-feature files.
- Update path: playbook exists -> refresh/extend based on current package state without changing the canonical folder name.
- Inventory source selection: existing feature catalog preferred; manual scenario list used when no catalog exists.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | New command docs, YAML assets, runtime mirror, and multiple downstream command inventories |
| Risk | 19/25 | High risk of regressing to deprecated playbook structures and weaker prompt scaffolds |
| Research | 14/20 | Must reconcile spec `021`, live playbook examples, `sk-doc` guidance, and create-command patterns |
| Multi-Agent | 7/15 | Moderate coordination across command/runtime surfaces |
| Coordination | 8/15 | Requires synchronized markdown, YAML, TOML, and runtime-doc updates |
| **Total** | **70/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Implementation recreates deprecated sidecar files | High | Medium | Make sidecar removal a P0 requirement and verify absence explicitly |
| R-002 | Only the root template is loaded | High | Medium | Require both templates and the creation reference |
| R-003 | Prompt scaffolds remain shallow and non-orchestrator-like | Medium | Medium | Encode prompt-quality expectations into requirements and ADRs |
| R-004 | Output path uses the wrong folder naming | High | Low | Record `/create:testing-playbook` -> `manual_testing_playbook/` as an accepted ADR |

---

## 11. USER STORIES

### US-001: Create a new playbook package (Priority: P0)

**As a** skill author, **I want** `/create:testing-playbook` to scaffold the canonical package shape, **so that** I can create a standards-aligned playbook without rebuilding the contract manually.

**Acceptance Criteria**:
1. Given a target skill without a playbook, When I run the command in create mode, Then it scaffolds the root playbook file under `manual_testing_playbook/` and numbered category folders.

---

### US-002: Update an existing playbook package safely (Priority: P0)

**As a** maintainer, **I want** the command to distinguish update from create, **so that** it can extend an existing playbook instead of overwriting it blindly.

**Acceptance Criteria**:
1. Given an existing `manual_testing_playbook/` package, When I run the command in update mode, Then the workflow acknowledges the existing package and routes through an update-oriented prompt path.

---

### US-003: Preserve the modern playbook contract (Priority: P1)

**As a** reviewer, **I want** the command output to match spec `021` and the `sk-doc` playbook references, **so that** generated playbooks do not regress to legacy sidecar or `snippets/` structures.

**Acceptance Criteria**:
1. Given the generated docs, When I inspect package contents, Then the root playbook owns shared guidance and the per-feature files live directly in numbered category folders.

---

### US-004: Generate realistic prompt scaffolds (Priority: P1)

**As a** playbook author, **I want** the generated per-feature files to scaffold user request, orchestrator prompt, process, desired outcome, evidence, and verdict, **so that** the resulting scenarios mimic real operator testing.

**Acceptance Criteria**:
1. Given a generated per-feature file, When I inspect `CURRENT REALITY` and `TEST EXECUTION`, Then the file clearly scaffolds realistic orchestrator-led testing instead of bare command paraphrases.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The output contract, runtime scope, prompt expectations, and naming translation are fixed by this packet and spec `021-sk-doc-feature-catalog-testing-playbook`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

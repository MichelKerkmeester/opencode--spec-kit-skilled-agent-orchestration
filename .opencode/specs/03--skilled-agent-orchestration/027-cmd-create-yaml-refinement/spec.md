---
title: "Feature Specification: Create Command YAML Refinement [03--commands-and-skills/027-cmd-create-yaml-refinement/spec]"
description: "Define a Level 3 refinement packet that aligns the create-command YAML assets with the richer spec_kit-style workflow contract while preserving the current command behaviors."
trigger_phrases:
  - "create yaml refinement"
  - "create command yaml standardization"
  - "spec_kit style yaml alignment"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Create Command YAML Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet defines the refinement pass for `.opencode/command/create/assets/*.yaml` so the create-command suite more closely matches the richer `spec_kit` command YAML style. The work must strengthen the newer feature-catalog and testing-playbook assets, then add a shared structural contract across the broader create suite without rewriting command behavior or changing command names.

**Key Decisions**: Standardize on one shared top-level section family across all create YAML assets; keep `create_folder_readme` as a unified asset for now, but give it the same top-level contract as the rest of the suite.

**Critical Dependencies**: `.opencode/command/spec_kit/assets/*.yaml`, the live `create/*` asset suite, and the previously shipped `025` and `026` command packets.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-19 |
| **Updated** | 2026-03-19 |
| **Branch** | `027-cmd-create-yaml-refinement` |

---

<!-- ANCHOR:problem -->
<!-- /ANCHOR:metadata -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The create-command YAML assets had drifted into uneven shapes. The newer feature-catalog and testing-playbook assets were materially thinner than both the `spec_kit` YAML baseline and the more mature create-command assets, while the broader suite lacked one consistent top-level contract for routing, gates, workflow overview, error handling, and termination. That drift makes the suite harder to maintain, review, and extend coherently.

### Purpose
Refine the create-command YAML suite so it reads like one family of workflows: stronger auto/confirm symmetry for the newer assets and a shared structural contract across the broader create asset set.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refine the newer feature-catalog and testing-playbook YAML assets so auto and confirm modes share one richer contract.
- Normalize the broader create-command asset suite around common top-level sections:
  - `runtime_agent_path_resolution`
  - `input_contract`
  - `gate_logic`
  - `workflow_overview`
  - `circuit_breaker`
  - `error_recovery`
  - `termination`
  - `rules`
- Keep `create_folder_readme` unified, but add the same top-level workflow contract used elsewhere.
- Preserve current command names, arguments, and output contracts.
- Limit file changes to the create YAML asset suite plus this spec packet.

### Out of Scope
- Renaming commands or changing their user-facing invocation shapes.
- Splitting `create_folder_readme` into separate command families.
- Editing create-command markdown entrypoints or runtime discovery docs in this refinement pass.
- Introducing a formal YAML schema validator beyond parse/inspection checks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/assets/create_feature_catalog_auto.yaml` | Modify | Strengthen auto-mode contract to match suite standards |
| `.opencode/command/create/assets/create_feature_catalog_confirm.yaml` | Modify | Add missing setup/gating/reporting sections and confirm-mode parity |
| `.opencode/command/create/assets/create_testing_playbook_auto.yaml` | Modify | Strengthen auto-mode contract to match suite standards |
| `.opencode/command/create/assets/create_testing_playbook_confirm.yaml` | Modify | Add missing setup/gating/reporting sections and confirm-mode parity |
| `.opencode/command/create/assets/create_agent_auto.yaml` | Modify | Add shared top-level standardization sections |
| `.opencode/command/create/assets/create_agent_confirm.yaml` | Modify | Add shared top-level standardization sections |
| `.opencode/command/create/assets/create_changelog_auto.yaml` | Modify | Add shared top-level standardization sections |
| `.opencode/command/create/assets/create_changelog_confirm.yaml` | Modify | Add shared top-level standardization sections |
| `.opencode/command/create/assets/create_folder_readme_auto.yaml` | Modify | Add top-level standardization while keeping dual operation branches |
| `.opencode/command/create/assets/create_folder_readme_confirm.yaml` | Modify | Add top-level standardization while keeping dual operation branches |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The create YAML suite shares one recognizable top-level contract | Every create YAML asset exposes the core standard sections needed for routing, gates, workflow overview, recovery, and completion |
| REQ-002 | Feature-catalog and testing-playbook confirm assets reach parity with their auto variants | Confirm mode retains the same root setup/gating/reporting contract and adds checkpoint behavior instead of dropping key sections |
| REQ-003 | The full create asset suite remains valid YAML | A parser can load every file in `.opencode/command/create/assets/` after the refinement pass |
| REQ-004 | `create_folder_readme` remains usable without structural ambiguity at the top level | The unified file gains the same shared workflow framing as the rest of the suite even though it still branches into README and install-guide operations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | Section naming becomes more consistent across the suite | Shared concepts use the same top-level key names wherever practical |
| REQ-102 | The newer YAMLs more closely mimic `spec_kit` style | They include richer request analysis, gates, workflow overview, recovery, and termination sections |
| REQ-103 | The refinement avoids command-behavior drift | Invocation semantics, command names, and output folder contracts remain unchanged |
| REQ-104 | The spec packet documents the structural choices honestly | This packet records why the suite was normalized and what was intentionally left unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Reviewers can inspect any create YAML asset and see the same top-level workflow scaffolding concepts.
- **SC-002**: `create_feature_catalog_*` and `create_testing_playbook_*` now have real auto/confirm symmetry.
- **SC-003**: `create_folder_readme_*` remains a dual-operation asset, but no longer feels structurally disconnected from the rest of the suite.
- **SC-004**: YAML parse checks pass for every file in `.opencode/command/create/assets/`.
- **SC-005**: The packet is complete enough that later command work can treat the normalized create YAML suite as a stable baseline.

### Acceptance Scenarios

1. **Given** a maintainer opens any create-command YAML asset, **when** they scan the top-level keys, **then** the shared sections for routing, gates, workflow overview, recovery, and termination are present.
2. **Given** a maintainer compares `create_feature_catalog_auto.yaml` and `create_feature_catalog_confirm.yaml`, **when** they inspect the structure, **then** confirm mode adds checkpoints without losing the main setup/gating/reporting contract.
3. **Given** a maintainer compares `create_testing_playbook_auto.yaml` and `create_testing_playbook_confirm.yaml`, **when** they inspect the structure, **then** confirm mode adds checkpoints without losing the main setup/gating/reporting contract.
4. **Given** a maintainer opens `create_folder_readme_auto.yaml` or `create_folder_readme_confirm.yaml`, **when** they inspect the top-level structure, **then** they see the same shared contract even though README and install-guide branches remain inside one file.
5. **Given** the full create YAML suite is parsed, **when** a YAML parser loads all files in the asset folder, **then** every file parses successfully.
6. **Given** later command work reuses this suite, **when** it looks for a create-asset baseline, **then** `create_sk_skill_*` and the normalized suite expose one more coherent pattern family.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/command/spec_kit/assets/*.yaml` | Wrong target style if ignored | Use `spec_kit` YAMLs as the style baseline for richer workflow scaffolding |
| Dependency | Existing create-command semantics | Regression risk if structural cleanup changes behavior | Limit the pass to structural clarity and naming consistency, not command behavior changes |
| Risk | Over-normalization breaks specialized assets | Medium | Keep command-specific operational content and normalize only the shared top-level contract |
| Risk | `create_folder_readme` still feels unusually large | Medium | Record it as an intentional short-term exception while still adding shared top-level sections |
| Risk | Packet remains template text | High | Rewrite the entire Level 3 packet with the actual refinement scope and verification evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The refinement should not materially increase parse complexity or make the assets invalid YAML.
- **NFR-P02**: Shared sections should improve maintainability without forcing every command into a wholly new operational model.

### Security
- **NFR-S01**: The refinement must not introduce secrets, credentials, or machine-specific data into any asset.
- **NFR-S02**: Command safety rules already present in specialized assets must remain intact after normalization.

### Reliability
- **NFR-R01**: All refined assets must continue to parse successfully as YAML.
- **NFR-R02**: The new shared section names should be stable enough to serve as the suite baseline for future create-command work.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Some create assets are already mature and need only light normalization.
- `create_folder_readme` contains two operation families in one file, so parity must be top-level rather than fully flattened.
- The newer feature-catalog and testing-playbook assets need a larger rewrite because they started from a thinner schema.

### Error Scenarios
- A structural cleanup could accidentally remove command-specific behavior if normalization goes too far.
- Key-name additions could create YAML syntax errors if inserted carelessly across large files.
- The spec packet itself could remain incomplete if the new spec folder is left as scaffold text.

### State Transitions
- Baseline state: uneven create YAML schemas with thinner newer assets.
- Target state: one create YAML suite with a shared top-level contract and stronger auto/confirm symmetry.
- Residual exception: `create_folder_readme` remains unified but gains shared workflow framing.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Ten YAML asset files plus one new Level 3 packet |
| Risk | 18/25 | Structural normalization across a live command suite with behavior-preservation constraints |
| Research | 12/20 | Requires comparing `spec_kit`, mature create assets, and the newer thinner assets |
| Multi-Agent | 6/15 | Useful review/spec delegation, but implementation stayed mostly local |
| Coordination | 7/15 | YAML assets and spec packet must stay aligned |
| **Total** | **62/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Confirm assets stay structurally thinner than auto assets | High | Medium | Rewrite them with the same shared contract and checkpoint additions |
| R-002 | `create_folder_readme` remains a structural outlier | Medium | High | Keep it unified for now but add top-level parity sections |
| R-003 | YAML edits introduce syntax errors | High | Medium | Run parser checks across the whole asset suite |
| R-004 | Spec packet remains template-only | High | Medium | Rewrite all Level 3 packet docs with actual scope and evidence |

---

## 11. USER STORIES

### US-001: Workflow Maintainer (Priority: P0)

**As a** maintainer of create-command workflows, **I want** the YAML assets to share one recognizable top-level contract, **so that** I can extend or review the suite without re-learning each file from scratch.

**Acceptance Criteria**:
1. Given any create YAML asset, When I inspect the top-level sections, Then I see the same core workflow scaffolding concepts.

---

### US-002: Command Author (Priority: P1)

**As a** command author adding or refining create flows, **I want** feature-catalog and testing-playbook YAMLs to follow the richer suite standard, **so that** I can use them as reliable patterns for future work.

**Acceptance Criteria**:
1. Given the feature-catalog or testing-playbook asset pair, When I compare auto and confirm modes, Then confirm mode keeps the same contract and adds checkpoints instead of deleting structure.

---

### US-003: Reviewer (Priority: P1)

**As a** reviewer, **I want** the create YAML suite to parse cleanly after the refinement pass, **so that** I can trust the cleanup did not damage the workflow assets.

**Acceptance Criteria**:
1. Given the full asset folder, When a YAML parser loads every file, Then all files parse without errors.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking for this refinement pass.
- A future follow-up may still decide whether `create_folder_readme` should remain unified or split into separate command families.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

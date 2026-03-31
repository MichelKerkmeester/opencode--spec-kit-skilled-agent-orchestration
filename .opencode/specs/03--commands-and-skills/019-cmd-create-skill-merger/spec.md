---
title: "Feature Specification: Create Skill Merger"
description: "Consolidate create-skill command surfaces into one canonical entrypoint, align canonical artifacts to command template conventions, and record indexed memory completion."
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
trigger_phrases:
  - "create:sk-skill"
  - "skill merger"
  - "command consolidation"
  - "unified workflow"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Create Skill Merger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-03 |
| **Branch** | `016-create-skill-merger` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The create command surface for skills was fragmented across separate command files and YAML workflows (`/create:skill`, `/create:skill_reference`, `/create:skill_asset`). That duplication increased maintenance cost and made routing behavior harder to keep consistent across operation and mode variants. After canonical merger, active runtime and onboarding documentation still needed explicit synchronization to canonical `/create:sk-skill` references.

### Purpose
Establish `/create:sk-skill` as the single canonical entrypoint with deterministic routing for operation and mode variants, while removing deprecated command and workflow files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add canonical command entrypoint for skill create/update/reference/asset flows.
- Add unified mode workflows for autonomous and interactive execution.
- Align canonical command and unified YAML structure with sk-doc command template conventions and existing create-command patterns.
- Expand canonical command and unified YAML detail depth to complete the documented length increase.
- Remove deprecated command markdown files and legacy workflow YAML files.
- Update related command references so prompt docs point to canonical `/create:sk-skill` variants.
- Synchronize active cross-runtime documentation surfaces to canonical `/create:sk-skill` command naming.
- Verify no legacy `/create:skill*` references remain in `.agents/agents`, `.codex`, and `.claude`.
- Capture and index memory context for this spec folder.

### Out of Scope
- Changes to non-skill create commands outside the documented reference updates.
- Behavioral changes to sk-doc validation scripts.
- Introduction of new operations beyond `full-create`, `full-update`, `reference-only`, `asset-only`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/sk-skill.md` | Modify | Canonical command aligned to sk-doc/create command conventions and expanded to 523 lines |
| `.opencode/command/create/assets/create_sk_skill_auto.yaml` | Modify | Unified autonomous workflow aligned to command ecosystem and expanded to 470 lines |
| `.opencode/command/create/assets/create_sk_skill_confirm.yaml` | Modify | Unified interactive workflow aligned to command ecosystem and expanded to 519 lines |
| .opencode/command/create/skill.md | Delete | Deprecated legacy command removed |
| .opencode/command/create/skill_reference.md | Delete | Deprecated legacy command removed |
| .opencode/command/create/skill_asset.md | Delete | Deprecated legacy command removed |
| `.opencode/command/create/assets/create_skill_auto.yaml` | Delete | Deprecated legacy workflow removed |
| `.opencode/command/create/assets/create_skill_confirm.yaml` | Delete | Deprecated legacy workflow removed |
| `.opencode/command/create/assets/create_skill_reference_auto.yaml` | Delete | Deprecated legacy workflow removed |
| `.opencode/command/create/assets/create_skill_reference_confirm.yaml` | Delete | Deprecated legacy workflow removed |
| `.opencode/command/create/assets/create_skill_asset_auto.yaml` | Delete | Deprecated legacy workflow removed |
| `.opencode/command/create/assets/create_skill_asset_confirm.yaml` | Delete | Deprecated legacy workflow removed |
| `.opencode/command/create/prompt.md` | Modify | Replace old create:skill references with create:sk-skill variants |
| `.agents/agents/write.md` | Modify | Synchronize active write-agent docs to canonical `/create:sk-skill` |
| `.opencode/agent/write.md` | Modify | Synchronize runtime write-agent docs to canonical `/create:sk-skill` |
| .opencode/agent/chatgpt/write.md | Modify | Synchronize ChatGPT runtime write-agent docs to canonical `/create:sk-skill` |
| `.codex/agents/write.toml` | Modify | Synchronize Codex runtime write-agent config to canonical `/create:sk-skill` |
| `.opencode/README.md` | Modify | Synchronize command documentation to canonical `/create:sk-skill` |
| `README.md` | Modify | Synchronize root documentation to canonical `/create:sk-skill` |
| `.opencode/install_guides/README.md` | Modify | Synchronize install guide index to canonical `/create:sk-skill` |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | Synchronize setup guide references to canonical `/create:sk-skill` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Canonical command must be `/create:sk-skill` | `.opencode/command/create/sk-skill.md` exists and defines unified entrypoint contract |
| REQ-002 | Mode support must include `:auto` and `:confirm` | Routing in `.opencode/command/create/sk-skill.md` targets `create_sk_skill_auto.yaml` and `create_sk_skill_confirm.yaml` |
| REQ-003 | Operation support must include all four operations | Command and YAML files document `full-create`, `full-update`, `reference-only`, `asset-only` |
| REQ-004 | Deprecated command/workflow files must be removed | Listed legacy markdown and YAML files are absent from repository |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Related command references must point to canonical command | `.opencode/command/create/prompt.md` references `/create:sk-skill` variants and no longer points to removed command names |
| REQ-006 | Migration mapping from old commands to new operation variants must be explicit | Deprecation map exists in `.opencode/command/create/sk-skill.md` |
| REQ-007 | Canonical artifacts must align with command template conventions | `.opencode/command/create/sk-skill.md` and both unified YAMLs follow sk-doc-style command template and create-command structure patterns |
| REQ-008 | Length expansion must be completed for canonical artifacts | `wc -l` reports 523 lines for `.opencode/command/create/sk-skill.md`, 470 for `create_sk_skill_auto.yaml`, and 519 for `create_sk_skill_confirm.yaml` |
| REQ-009 | Spec-folder memory save and indexing must be completed | Latest `memory/*.md` artifact and `memory/metadata.json` exist; index status is `indexed` and `memory_index_scan` reports completion |
| REQ-010 | Active cross-runtime docs must be synchronized to canonical command naming | `.agents/agents/write.md`, `.opencode/agent/write.md`, .opencode/agent/chatgpt/write.md, `.codex/agents/write.toml`, `.opencode/README.md`, `README.md`, `.opencode/install_guides/README.md`, and `.opencode/install_guides/SET-UP - AGENTS.md` reference `/create:sk-skill` and no longer reference `/create:skill*` |
| REQ-011 | Legacy `/create:skill*` references must be absent in key runtime directories | Directory verification returns no `/create:skill` matches in `.agents/agents`, `.codex`, and `.claude` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One command entrypoint exists for skill workflows: `/create:sk-skill`.
- **SC-002**: Two unified mode workflows exist and are route targets for canonical command execution.
- **SC-003**: All listed deprecated create-skill command and workflow files are removed.
- **SC-004**: Related prompt command references use `/create:sk-skill` variants only.
- **SC-005**: Canonical command and unified YAMLs are aligned with sk-doc/create command template conventions.
- **SC-006**: Length expansion is completed with exact counts: 523 (sk-skill.md), 470 (`create_sk_skill_auto.yaml`), 519 (`create_sk_skill_confirm.yaml`).
- **SC-007**: Memory context for this spec folder is saved and indexed.
- **SC-008**: All eight listed cross-runtime and onboarding docs are synchronized to canonical `/create:sk-skill` references.
- **SC-009**: Verification scan confirms no legacy `/create:skill*` references remain in `.agents/agents`, `.codex`, or `.claude`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing create command ecosystem | Broken references if migration is partial | Explicit deprecation map and targeted prompt reference update |
| Risk | Users invoking removed legacy command names | Command not found during transition period | Keep migration map in canonical command and align docs to `/create:sk-skill` |
| Risk | Operation/type mismatch in unified flow | Incorrect branch execution | Hard-gate checks in both unified YAML workflows |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Routing metadata in command and YAML files remains deterministic and static.

### Security
- **NFR-S01**: No secrets or credentials are introduced in command/workflow content.

### Reliability
- **NFR-R01**: Mode and operation contracts are explicitly documented in both command and YAML definitions.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- Missing operation input must trigger setup collection instead of inference.
- `type` is required only for `reference-only` and `asset-only`.

### Error Scenarios
- `full-create` against existing skill path must hard block and offer reroute to update.
- `full-update`/doc-only against missing skill path must hard block and request correction.

### State Transitions
- `:auto` uses autonomous execution.
- `:confirm` uses checkpoint-based execution with proceed/review/modify/abort options.
<!-- /ANCHOR:edge-cases -->

---


### Acceptance Scenarios

1. **AS-001 - Canonical Entrypoint Present**: **Given** the command directory after merger completion, **When** `.opencode/command/create/sk-skill.md` is inspected, **Then** `/create:sk-skill` is the documented canonical entrypoint and legacy skill.md, skill_reference.md, and skill_asset.md are absent.
2. **AS-002 - Deterministic Mode Routing**: **Given** canonical command execution in auto or confirm mode, **When** mode routing is evaluated in `.opencode/command/create/sk-skill.md`, **Then** `:auto` routes to `create_sk_skill_auto.yaml` and `:confirm` routes to `create_sk_skill_confirm.yaml`.
3. **AS-003 - Full Operation Coverage**: **Given** operation selection for merged skill workflows, **When** command and workflow contracts are inspected, **Then** `full-create`, `full-update`, `reference-only`, and `asset-only` are all documented and supported.
4. **AS-004 - Canonical Artifact Expansion Complete**: **Given** completion evidence for canonical artifacts, **When** line counts are checked, **Then** `.opencode/command/create/sk-skill.md` is 523 lines, `create_sk_skill_auto.yaml` is 470 lines, and `create_sk_skill_confirm.yaml` is 519 lines.
5. **AS-005 - Cross-Runtime Docs Synced**: **Given** active runtime and onboarding documentation surfaces, **When** synchronized documentation files are reviewed, **Then** all eight listed files reference canonical `/create:sk-skill` naming and do not reference `/create:skill*`.
6. **AS-006 - Directory-Level Legacy Reference Verification**: **Given** repository runtime directories, **When** searching `.agents/agents`, `.codex`, and `.claude` for `/create:skill`, **Then** zero matches are returned.
7. **AS-007 - Migration + Memory Completion Verified**: **Given** post-merger validation state, **When** command references and spec memory artifacts are reviewed, **Then** `.opencode/command/create/prompt.md` references `/create:sk-skill` variants only and the latest `memory/*.md` plus `memory/metadata.json` are present with indexed status.


---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Command consolidation plus multi-file deletions and one reference update |
| Risk | 15/25 | Runtime entrypoint migration and command discoverability risk |
| Research | 10/20 | Existing command and workflow contracts needed alignment |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Migration strategy is explicit and implemented with canonical `/create:sk-skill` routing.
<!-- /ANCHOR:questions -->

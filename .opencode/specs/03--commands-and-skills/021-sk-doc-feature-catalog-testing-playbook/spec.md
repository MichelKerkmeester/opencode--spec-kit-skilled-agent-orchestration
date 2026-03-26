---
title: "Feature Specification: sk-doc Feature Catalog + Testing Playbook Alignment [template:level_2/spec.md]"
description: "Align system-spec-kit and mcp-coco-index documentation around the shipped feature-catalog and manual-testing-playbook contracts, then update sk-doc templates, references, and routing docs to match the final structure."
trigger_phrases:
  - "feature catalog"
  - "manual testing playbook"
  - "sk-doc templates"
  - "references/global"
  - "references/specific"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: sk-doc Feature Catalog + Testing Playbook Alignment

This packet records the final shipped documentation contract for the feature-catalog and manual-testing-playbook work. It replaces the earlier playbook-only framing with the broader reality: both document families, their templates, their references, and their downstream creation workflows were aligned together.

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
| **Created** | 2026-03-18 |
| **Updated** | 2026-03-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The original spec packet captured only the first part of the work: refactoring manual testing playbooks toward a feature-catalog-like package shape. The shipped result grew beyond that. Feature catalogs were aligned to the same header/frontmatter conventions, manual playbooks absorbed their former sidecar docs, `sk-doc` gained new template bundles and standards references, the reference tree was regrouped into `global/` and `specific/`, and downstream create-command routing was updated.

### Purpose
Document the final contract so future maintenance reflects what actually shipped: feature catalogs define current behavior, manual testing playbooks define realistic orchestrator-led validation, and `sk-doc` now teaches both families through aligned templates, creation references, and runtime-consumer paths.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reformat `system-spec-kit` and `mcp-coco-index` manual testing playbooks into feature-catalog-style packages with one root playbook plus numbered root-level category folders of per-feature files.
- Align `system-spec-kit/feature_catalog/`, including `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md`, to the final header/frontmatter contract, including unnumbered `TABLE OF CONTENTS`, numbered all-caps H2 sections, and feature-catalog-style snippet framing.
- Integrate former playbook sidecar guidance into the root playbook and remove the old review-protocol and subagent-utilization-ledger sidecar model from the shipped contract.
- Add frontmatter to feature-catalog and manual-testing per-feature files, align divider usage between numbered sections, and mirror the feature-catalog category structure into the `.claude` manual-testing-playbook tree.
- Expand `sk-doc` with template bundles for both feature catalogs and testing playbooks, then add standards/workflow references for both families plus the missing agent-creation reference.
- Regroup `sk-doc/references/` into `global/` and `specific/`, and update all downstream consumers including `.opencode/skill/sk-doc/SKILL.md`, `.opencode/skill/sk-doc/README.md`, `.opencode/skill/sk-doc/references/global/quick_reference.md`, `.opencode/skill/sk-doc/references/global/workflows.md`, create-command assets, and `.opencode/agent/write.md`.
- Capture follow-on naming alignment such as `.opencode/skill/sk-doc/references/specific/install_guide_creation.md` and other path updates that landed during the same documentation modernization cycle.

### Out of Scope
- Building recursive validators for all per-feature files.
- Redesigning feature IDs or category taxonomy beyond what was needed to mirror the shipped feature-catalog structure.
- Changing unrelated skills, commands, or agents outside the documentation-path updates required to keep the runtime surfaces honest.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/manual_testing_playbook/` | Modify | Convert the package to the integrated root-playbook contract with numbered category folders and richer orchestrator-led per-feature files. |
| `.opencode/skill/system-spec-kit/feature_catalog/` | Modify | Align the root catalogs and per-feature files to the final frontmatter, header, TOC, and snippet conventions. |
| `.opencode/skill/mcp-coco-index/manual_testing_playbook/` | Modify | Align the root playbook and per-feature files to the same integrated package contract. |
| `.claude/skills/system-spec-kit/manual_testing_playbook/` | Modify | Mirror the 19-folder feature-catalog layout into the Claude playbook tree. |
| `.opencode/skill/sk-doc/assets/documentation/testing_playbook/` | Modify | Ship the final root-playbook and per-feature templates in a dedicated bundle folder. |
| `.opencode/skill/sk-doc/assets/documentation/feature_catalog/` | Create | Add the root and per-feature feature-catalog template bundle. |
| `.opencode/skill/sk-doc/references/specific/` | Create/Modify | Add creation guides for playbooks, feature catalogs, and agents, and align install-guide naming. |
| `.opencode/skill/sk-doc/references/global/` | Modify | Keep quick-reference and workflow docs aligned with the grouped reference tree. |
| `.opencode/command/create/` | Modify | Update create-command paths so agent and documentation workflows resolve the regrouped `sk-doc` references. |
| `.opencode/agent/write.md` | Modify | Update reference discovery wording to match nested `references/**/*.md` layout. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Modify | Assert NEW-125 summary content from the root playbook and detailed content from the per-feature file. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Manual testing playbooks use the integrated root-playbook contract | The root playbook document, such as `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`, owns review/orchestration policy, while numbered category folders hold the per-feature execution truth. |
| REQ-002 | Feature catalogs use the final feature-catalog header and snippet contract | Root catalogs and per-feature files use aligned frontmatter, intro flow, unnumbered TOC, and numbered all-caps sections. |
| REQ-003 | `sk-doc` authoring guidance matches the shipped structure | Template bundles, creation references, grouped reference paths, and runtime-facing docs all point to the same current contract. |
| REQ-004 | Downstream runtime consumers resolve the new paths | Create-command assets and other routing docs reference real `sk-doc` files after the template/reference reorganization. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | Coverage and navigation remain auditable | Root docs, per-feature files, and category folders are countable, linkable, and structurally consistent. |
| REQ-102 | Prompt and orchestration guidance match realistic manual testing | Playbook scenarios describe user request, orchestrator prompt, desired outcome, and evidence capture expectations. |
| REQ-103 | Validator limitations remain documented honestly | The docs acknowledge that recursive snippet/per-feature validation still needs manual or custom verification. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system-spec-kit` and `mcp-coco-index` ship root playbooks that act as directory, review, and orchestration surfaces, with per-feature playbook files stored under numbered root-level category folders.
- **SC-002**: `system-spec-kit/feature_catalog/` and its companion “simple terms” catalog follow the same frontmatter and header conventions taught by `sk-doc`.
- **SC-003**: `sk-doc` ships dedicated template bundles and standards/workflow references for both feature catalogs and testing playbooks, plus the missing `.opencode/skill/sk-doc/references/specific/agent_creation.md` reference.
- **SC-004**: `sk-doc` reference grouping and downstream path consumers are synchronized so no runtime-facing workflow points at stale flat-reference paths.

### Acceptance Scenarios

1. **Given** `system-spec-kit` ships both a feature catalog and a manual testing playbook, **when** a maintainer opens the root docs and per-feature files, **then** both document families follow the same frontmatter/header conventions and numbered category-folder contract.
2. **Given** the old manual playbook sidecar docs were removed, **when** an operator follows the shipped playbook package, **then** review protocol and orchestration guidance are found in the root playbook instead of parallel canonical sidecar files.
3. **Given** `sk-doc` is used to author a new feature catalog or testing playbook, **when** the creator loads the templates and creation references, **then** the bundle folders, grouped references, and workflow docs all describe the same current contract.
4. **Given** create-command and write-agent workflows rely on `sk-doc` references, **when** they resolve grouped-reference paths, **then** the runtime consumers point at real files including `.opencode/skill/sk-doc/references/specific/agent_creation.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `system-spec-kit` feature IDs and category taxonomy | Broken traceability if renamed carelessly | Preserve published IDs and map playbook folders to the existing feature-catalog structure. |
| Dependency | `sk-doc` template/routing surfaces | Authoring drift if one surface is missed | Sweep skill docs, README, references, assets, commands, and agent docs together. |
| Risk | Sidecar-doc language lingers after root-playbook integration | Users follow two conflicting contracts | Remove or delete sidecar references and restate the root-playbook contract everywhere it matters. |
| Risk | Regrouped `references/` tree breaks create workflows | Agent/command creation docs point to dead paths | Update downstream runtime consumers and verify path grep results. |
| Risk | Validator coverage is assumed broader than it is | False confidence in per-feature-file quality | Record the recursive-validation limitation explicitly in the docs and checklist. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Root playbook and root catalog files should stay scannable and not re-embed full per-feature detail.
- **NFR-P02**: Grouped template/reference bundles should reduce lookup cost for future documentation creation tasks.

### Security
- **NFR-S01**: Documentation changes must not introduce secrets, credentials, or unsafe operational guidance.
- **NFR-S02**: Manual-testing docs must preserve destructive-scenario and sandbox caveats while moving guidance into the root playbook.

### Reliability
- **NFR-R01**: Published feature IDs and per-feature file paths remain stable and resolvable.
- **NFR-R02**: Downstream `sk-doc` consumers resolve the new grouped reference paths without ambiguity.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Large surface area: `system-spec-kit` spans 195 manual-testing per-feature files and a large feature catalog, so root docs must stay directory-oriented.
- Cross-runtime duplication: `.opencode` and `.claude` trees need consistent folder mapping even though only one is the canonical source for authoring guidance.
- Historical path drift: older changelog/spec references may still mention pre-rename folder or file names.

### Error Scenarios
- Root docs link to paths that were moved during the folder regrouping.
- Deleted sidecar playbook docs remain referenced from templates or workflow docs.
- `AGENT_COMMAND` routing still points at templates only and omits the new creation reference.

### State Transitions
- The work began as a playbook-only refactor and expanded into a broader documentation-contract modernization.
- Reference regrouping and template bundling happened after the initial playbook migration, so later packet updates must account for both phases.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 21/25 | Two document families, multiple shipped packages, and several downstream runtime consumers. |
| Risk | 15/25 | Mostly docs, but path drift and contract drift can break creation workflows. |
| Research | 12/20 | Required reconciling shipped docs, runtime consumers, and later follow-on changes. |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The packet now reflects the delivered state.
<!-- /ANCHOR:questions -->

---
title: "Implementation Plan: sk-doc Feature Catalog + Testing Playbook Alignment [template:level_2/plan.md]"
description: "Align the shipped feature-catalog and manual-testing-playbook contracts across system-spec-kit, mcp-coco-index, sk-doc, and the downstream runtime consumers that rely on those docs."
trigger_phrases:
  - "feature catalog plan"
  - "manual testing playbook plan"
  - "sk-doc regroup references"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: sk-doc Feature Catalog + Testing Playbook Alignment

This plan records the phases that brought the final documentation contract into sync across the shipped examples, the `sk-doc` authoring surface, and the downstream runtime consumers.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML path references |
| **Framework** | OpenCode skill documentation packages |
| **Storage** | Git working tree |
| **Testing** | `rg`, markdown validation, path sweeps, targeted Vitest docs tests |

### Overview
The work started by reshaping manual testing playbooks into feature-catalog-style packages, then expanded into a broader standards alignment pass. That later pass brought feature catalogs onto the same frontmatter/header conventions, folded playbook sidecar guidance into the root playbook, added template bundles and creation references in `sk-doc`, regrouped references into `global/` and `specific/`, and updated downstream create/runtime docs to match.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement expanded to cover the full shipped work, not only the initial playbook refactor
- [x] Affected packages and downstream consumers identified
- [x] Verification surfaces defined for docs, paths, counts, and targeted tests

### Definition of Done
- [x] Feature-catalog and manual-testing-playbook contracts match the shipped examples
- [x] `sk-doc` templates and references match the shipped examples
- [x] Downstream command/agent consumers point at real grouped-reference paths
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-contract alignment across paired root-doc plus per-feature-file package families.

### Key Components
- **Feature catalogs**: Root catalog documents such as `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` plus numbered category folders of per-feature files.
- **Manual testing playbooks**: Root playbook documents such as `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` plus numbered category folders of per-feature files.
- **`sk-doc` template bundles**: Dedicated `assets/documentation/feature_catalog/` and `assets/documentation/testing_playbook/` bundles.
- **`sk-doc` reference groups**: `references/global/` for cross-cutting docs and `references/specific/` for creation workflow guides.
- **Runtime consumers**: Create commands and agent docs that load the regrouped references.

### Data Flow
Audit shipped contracts -> normalize feature catalogs and playbooks -> align template bundles and standards references -> regroup `sk-doc` references -> update downstream runtime consumers -> run validation and path-resolution checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract Lock and Inventory
- [x] Inventory the shipped `system-spec-kit` and `mcp-coco-index` playbook/catalog surfaces.
- [x] Lock the final root-doc plus numbered-category-folder contract for both document families.
- [x] Identify every `sk-doc` surface and downstream consumer that still assumed the older flat or sidecar-based model.

### Phase 2: Package Alignment
- [x] Refactor `system-spec-kit/manual_testing_playbook/` into the integrated root-playbook contract and align prompts, frontmatter, and per-feature-file structure.
- [x] Align `system-spec-kit/feature_catalog/` and `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md` to the final header/frontmatter conventions.
- [x] Normalize `mcp-coco-index/manual_testing_playbook/` to the integrated root-playbook contract.
- [x] Mirror the feature-catalog folder taxonomy into `.claude/skills/system-spec-kit/manual_testing_playbook/`.

### Phase 3: sk-doc Surface Modernization
- [x] Move playbook and feature-catalog templates into dedicated bundle folders.
- [x] Add `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md` and `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_snippet_template.md`.
- [x] Add `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md`, `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md`, and `.opencode/skill/sk-doc/references/specific/agent_creation.md`.
- [x] Rename the former install-guide standards reference to `.opencode/skill/sk-doc/references/specific/install_guide_creation.md`.
- [x] Regroup references into `references/global/` and `references/specific/`.

### Phase 4: Runtime Consumer Alignment and Verification
- [x] Update `.opencode/skill/sk-doc/SKILL.md`, `.opencode/skill/sk-doc/README.md`, `.opencode/skill/sk-doc/references/global/quick_reference.md`, and `.opencode/skill/sk-doc/references/global/workflows.md`.
- [x] Update create-command assets and `.opencode/agent/write.md` path assumptions.
- [x] Re-run validation, count audits, link/path sweeps, and the targeted `vitest` suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Folder layout, file presence, per-feature counts | `find`, `ls`, `test` |
| Content consistency | Stale wording, grouped-reference paths, sidecar-doc removal | `rg`, targeted review |
| Markdown validation | Touched `sk-doc` docs and references | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| JSON validation | Template rules manifest | `python3 -m json.tool` |
| Regression tests | Root/per-feature-file Hydra doc contract | `npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/hydra-spec-pack-consistency.vitest.ts` |

### Executed Checks

- **PC-001 Feature/playbook package shape**
  - PASS: `system-spec-kit` ships feature catalogs and playbooks under numbered category folders, and `mcp-coco-index` ships the aligned playbook package.
- **PC-002 Sidecar removal and root integration**
  - PASS: former canonical playbook sidecar guidance was moved into the root playbook contract and the obsolete files were removed.
- **PC-003 Per-feature coverage and frontmatter**
  - PASS: playbook/category counts matched at `system-spec-kit 195/195` and `mcp-coco-index 20/20`, and per-feature files in the aligned trees received frontmatter.
- **PC-004 sk-doc template/reference alignment**
  - PASS: playbook and feature-catalog bundles, creation references, and grouped `references/` paths now match the shipped structure.
- **PC-005 Downstream runtime-path alignment**
  - PASS: create-command assets and `.opencode/agent/write.md` now reference the regrouped `sk-doc` docs, including the created `.opencode/skill/sk-doc/references/specific/agent_creation.md`.
- **PC-006 Markdown and JSON validation**
  - PASS: targeted `sk-doc` docs validated cleanly, with only previously documented non-blocking embedded-example numbering warnings where applicable; `template_rules.json` parsed successfully.
- **PC-007 Targeted regression tests**
  - PASS: `npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/hydra-spec-pack-consistency.vitest.ts` completed with 15 tests passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `system-spec-kit` feature catalog and playbook trees | Internal | Complete | Provide the canonical package shape and naming that `sk-doc` now teaches. |
| `mcp-coco-index` playbook tree | Internal | Complete | Confirms the contract generalizes beyond one skill. |
| `sk-doc` templates and references | Internal | Complete | Needed to keep future authoring aligned with the shipped examples. |
| Create-command and agent routing docs | Internal | Complete | Needed so grouped-reference paths resolve during runtime workflows. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken grouped-reference paths, incorrect runtime consumer references, or drift between the shipped examples and `sk-doc` guidance.
- **Procedure**: Revert the affected doc family in one batch: shipped example package, `sk-doc` teaching surface, and downstream runtime consumers together. Reapply in smaller passes only if the contract can still be kept coherent at each step.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Contract Lock -> Package Alignment -> sk-doc Modernization -> Runtime Consumer Alignment -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract Lock | None | Package Alignment |
| Package Alignment | Contract Lock | sk-doc Modernization |
| sk-doc Modernization | Package Alignment | Runtime Consumer Alignment |
| Runtime Consumer Alignment | sk-doc Modernization | Verification |
| Verification | All prior phases | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract Lock and Inventory | Medium | 1-2 hours |
| Package Alignment | High | 4-7 hours |
| sk-doc Modernization | High | 3-5 hours |
| Runtime Consumer Alignment and Verification | Medium | 1-3 hours |
| **Total** | | **9-17 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Root contracts were documented before broader path rewrites began.
- [x] Shipped examples and `sk-doc` surfaces were inventoried together.
- [x] Downstream create/runtime docs were included in the sweep instead of deferred.

### Rollback Procedure
1. Revert grouped `sk-doc` reference paths and restore the previous tree only if every runtime consumer is reverted in the same batch.
2. Revert feature-catalog and playbook contract changes in the shipped examples together if the docs no longer describe the same structure.
3. Re-run path and validation checks before attempting a smaller re-landing.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

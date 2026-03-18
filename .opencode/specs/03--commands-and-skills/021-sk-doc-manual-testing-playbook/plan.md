---
title: "Implementation Plan: sk-doc Manual Testing Playbook Feature-Catalog Refactor [template:level_2/plan.md]"
description: "Refactor manual testing playbooks into a root-folder feature-catalog package, then align the shipped examples and sk-doc authoring guidance to the same numbered-category per-feature-file contract."
trigger_phrases:
  - "manual testing playbook plan"
  - "root category folders plan"
  - "feature catalog playbook plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: sk-doc Manual Testing Playbook Feature-Catalog Refactor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON |
| **Framework** | OpenCode skill documentation packages |
| **Storage** | Git working tree |
| **Testing** | `rg`, file-structure checks, markdown validation where applicable |

### Overview
Restructure manual testing playbooks to mirror the feature catalog pattern: a root index for navigation and coverage, plus numbered category folders containing per-feature files. Apply that contract first to `system-spec-kit`, then normalize `mcp-cocoindex-code`, and finally update `sk-doc` templates, references, and rules so future playbooks are authored the same way.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Root page plus category-folder contract implemented in both playbook packages
- [x] Ledger, per-feature-file, and link verification checks pass
- [x] `sk-doc` templates/references/rules updated to the final contract
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feature-catalog-style documentation package refactor

### Key Components
- **Root index**: Package entry point, coverage ledger, navigation, and source-of-truth contract.
- **Numbered category folders (`01--*`, `02--*`, etc.)**: Root-level folders that contain per-feature playbook files.
- **Per-feature files**: Detailed operator contracts stored directly inside the numbered category folders.
- **Companion docs**: Review and execution guidance that reference the root ledger and root-folder feature files.
- **sk-doc authoring surface**: The skill guide, templates, quick reference, and rules that teach the package structure.

### Data Flow
Inventory current playbook package state -> define the root-ledger plus category-folder contract -> migrate `system-spec-kit` to that structure -> normalize `mcp-cocoindex-code` language and coverage rules -> sweep `sk-doc` docs/rules for matching guidance -> run structural verification against ledgers, feature IDs, and stale phrase checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract and Inventory
- [x] Inventory current playbook packages and identify stale merged-playbook or alternate-subtree language.
- [x] Lock the target package contract: root index, numbered category folders, per-feature files, coverage ledger, and companion-doc responsibilities.
- [x] Define deterministic verification rules for feature IDs, root-file paths, and link integrity.

### Phase 2: Package Refactor
- [x] Split `system-spec-kit` into a root directory page plus 195 per-feature files under numbered category folders while preserving feature coverage.
- [x] Normalize `mcp-cocoindex-code` root directory page, 20 per-feature files, and companion docs to the same contract.
- [x] Sweep `sk-doc` templates, references, README, skill-guide content, workflows, and rules to teach the final package model, including divider lines between numbered sections.
- [x] Update the feature-flag reference regression test to read NEW-125 summary/detail content from the correct root page and per-feature file sources.

### Phase 3: Verification
- [x] Run stale-language searches against the touched surfaces.
- [x] Verify every ledger entry points to a real per-feature file and every feature ID appears exactly once.
- [x] Validate touched markdown docs with the available sk-doc/documentation checks where applicable.
- [x] Run the targeted `vitest` suites that cover feature-flag-reference docs and Hydra spec-pack consistency.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Package layout, category-folder paths, file presence | `find`, `test`, `ls` |
| Content consistency | Stale wording, contract alignment, feature IDs | `rg`, targeted diff review |
| Markdown validation | Touched sk-doc docs and templates | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| JSON validation | Template rules manifest | `python3 -m json.tool` |
| Regression tests | Root/per-feature-file contract and Hydra links | `npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/hydra-spec-pack-consistency.vitest.ts` |

### Executed Checks

- **PC-001 Package shape check**
  - PASS: `system-spec-kit` now ships a root directory page plus 195 per-feature files under numbered category folders; `mcp-cocoindex-code` ships a root directory page plus 20 per-feature files under the same contract.
- **PC-002 Stale contract wording check**
  - PASS: playbook-coupled docs were updated so the root page plus numbered category folders is the canonical contract across both packages and the touched `sk-doc` surfaces.
- **PC-003 Coverage ledger integrity**
  - PASS: per-feature-file counts matched exactly at `system-spec-kit 195/195` and `mcp-cocoindex-code 20/20`.
- **PC-004 Link and path resolution**
  - PASS: root links to per-feature files resolved with zero missing links for both playbooks.
- **PC-005 Markdown validation**
  - PASS: the sk-doc document validator passed for the skill guide, README, quick reference, workflows reference, playbook template, and per-feature file template; template files may retain only non-blocking numbering warnings caused by fenced example headings.
- **PC-006 JSON validation**
  - PASS: `python3 -m json.tool .opencode/skill/sk-doc/assets/template_rules.json`
- **PC-007 Targeted regression tests**
  - PASS: `npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/hydra-spec-pack-consistency.vitest.ts` in `.opencode/skill/system-spec-kit/mcp_server` completed with 15 tests passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current playbook packages in `system-spec-kit` and `mcp-cocoindex-code` | Internal | Complete | Preserved category intent while moving to the root-page plus category-folder contract. |
| `sk-doc` template and rule surface | Internal | Complete | Updated to keep future authoring guidance aligned with the new structure. |
| Existing validator behavior | Internal | Managed | Template-doc numbering warnings remain non-blocking; root-folder file-validation limitations are described honestly in the docs. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Coverage ledger drift, broken per-feature-file links, or conflicting package-contract language after the refactor.
- **Procedure**: Revert touched playbook and `sk-doc` documentation files together, then re-apply the migration in smaller passes: `system-spec-kit`, `mcp-cocoindex-code`, and `sk-doc` guidance.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

``` 
Phase 1 (Contract + Inventory) ──► Phase 2 (Package Refactor) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract + Inventory | None | Package Refactor |
| Package Refactor | Contract + Inventory | Verify |
| Verify | Package Refactor | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract + Inventory | Medium | 1-2 hours |
| Package Refactor | High | 4-7 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **6-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Root-ledger contract written down before moving scenario tables.
- [x] Feature-ID inventory captured for both playbook packages.
- [x] Coupled `sk-doc` surfaces identified before wording changes begin.

### Rollback Procedure
1. Revert the touched manual testing playbook package files and `sk-doc` docs/rules as one batch.
2. Restore the previous root playbook files before reintroducing root-folder per-feature files.
3. Re-run stale-language and ledger-integrity checks to confirm the prior state is coherent.
4. Retry the migration with one package at a time if the combined pass proves too noisy.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

---
title: "Feature Specification: sk-doc Manual Testing Playbook Feature-Catalog Refactor [template:level_2/spec.md]"
description: "Manual testing playbook documentation moved from a merged-playbook model to a root-folder feature-catalog model. Align system-spec-kit, mcp-cocoindex-code, and sk-doc guidance on one numbered-category per-feature-file contract."
trigger_phrases:
  - "manual testing playbook"
  - "feature catalog style"
  - "root index"
  - "category folders"
  - "sk-doc playbook template"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: sk-doc Manual Testing Playbook Feature-Catalog Refactor

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual testing playbook docs were inconsistent across the repo while the contract was still evolving. The final implementation uses numbered category folders with per-feature files directly under each playbook root, so this packet needs to reflect that root-folder contract instead of earlier merged or alternate-subtree wording.

### Purpose
Define and document one feature-catalog-style playbook contract so the root playbook acts as the package index and coverage ledger, numbered category folders hold per-feature detail files, and the shipped examples and authoring guidance stay in sync.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reformat manual testing playbooks to a feature-catalog-style package with a root directory page plus numbered category folders that hold per-feature files.
- Align `system-spec-kit` to the root-folder contract with 195 per-feature files, all stored directly under numbered category folders and all using divider lines between numbered sections.
- Normalize the `mcp-cocoindex-code` playbook package so its root directory page, 20 per-feature files, and companion docs all use the same contract language.
- Sweep coupled `sk-doc` playbook templates, references, README, skill-guide content, workflows, and rules so the authoring guidance matches the shipped package format, including divider lines between numbered sections in the main/file scaffolds.
- Update the feature-flag reference regression test so NEW-125 assertions read summary content from the root playbook and detailed contract content from the NEW-125 per-feature file under `02--new-features/`.

### Out of Scope
- Renumbering or renaming existing feature IDs unless a broken mapping forces a documented exception.
- Editing non-playbook docs that are unrelated to manual testing playbook packaging.
- Building new validator logic beyond the documentation and rule updates required to describe the package correctly.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/manual_testing_playbook/` root index | Modify | Convert the merged scenario file into a root index and coverage ledger. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/01--*/` and `02--*/` | Create | Add 195 per-feature files directly under numbered category folders and insert divider lines between numbered sections. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/` review protocol | Modify | Update coverage rules and source-of-truth language for the root page plus numbered-category model. |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/` subagent ledger | Modify | Align wave-planning guidance with the new package structure. |
| `.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/` root index | Modify | Normalize root index wording, coverage ledger rules, and navigation. |
| `.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/01--*/` and sibling category folders | Modify | Reconcile 20 per-feature files with the final package contract and category naming. |
| `.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/` review protocol | Modify | Keep release-readiness and coverage checks aligned with the root-ledger model. |
| `.opencode/skill/mcp-cocoindex-code/manual_testing_playbook/` subagent ledger | Modify | Update coordinator guidance so root-folder-backed coverage is described correctly. |
| `.opencode/skill/sk-doc/` skill guide | Modify | Update playbook workflow language to describe a root page plus numbered category folders as the standard package. |
| `.opencode/skill/sk-doc/README.md` | Modify | Describe the root-plus-category-folder contract in user-facing documentation. |
| `.opencode/skill/sk-doc/assets/documentation/` playbook template | Modify | Rewrite the template around a root page plus numbered category folders and divider lines between numbered sections. |
| `.opencode/skill/sk-doc/assets/documentation/` per-feature file template | Create | Add a dedicated per-feature file template aligned with the new package contract. |
| `.opencode/skill/sk-doc/references/` quick reference | Modify | Update package layout, file purposes, and workflow steps. |
| `.opencode/skill/sk-doc/references/workflows.md` | Modify | Align workflow guidance to the root-page plus category-folder package model. |
| `.opencode/skill/sk-doc/assets/template_rules.json` | Modify | Remove rule language that assumes a separate detail-file subtree and align the docs to the final root-folder contract. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Modify | Read NEW-125 summary content from the root playbook and detailed contract content from the NEW-125 per-feature file. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Manual testing playbooks use the final feature-catalog-style root-folder contract | Root playbook index files read as index and coverage ledger docs, while scenario detail lives in per-feature files under numbered category folders. |
| REQ-002 | `system-spec-kit` is migrated from the merged playbook format without losing coverage | All existing feature IDs remain mapped in the new root ledger and resolve to per-feature files under the root-folder contract. |
| REQ-003 | `mcp-cocoindex-code` package language matches the final contract | Root index, category-folder files, and companion docs no longer contradict each other about the source of truth. |
| REQ-004 | `sk-doc` authoring guidance matches the shipped playbook structure | Template pair, skill guide, README, quick reference, workflows, and rules all describe the same required root-folder package model. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | Coverage and navigation remain easy to audit after the split | Root ledgers list every feature ID with category-folder destination, and links resolve locally. |
| REQ-102 | Documentation stays honest about validator limits | Any validator gaps around recursive root-folder file checks are documented explicitly instead of implied away. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `system-spec-kit` and `mcp-cocoindex-code` both ship a root playbook index plus numbered category folders of per-feature files with consistent source-of-truth language.
- **SC-002**: `sk-doc` now teaches the final root-folder contract with divider lines between numbered sections and no conflicting alternate-subtree guidance.
- **SC-003**: Coverage-ledger and per-feature-file checks prove that every feature ID is present exactly once and points to a real root-folder file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing feature IDs and category groupings in both playbook packages | Broken traceability if changed carelessly | Preserve IDs, mirror existing numbered category ranges, and verify ledger-to-file mapping before closing. |
| Dependency | Current `sk-doc` template and rule surface | Authoring guidance drift if any file is missed | Sweep all playbook-coupled docs/rules with targeted `rg` checks for stale contract language. |
| Risk | `system-spec-kit` split introduces missing or duplicated feature IDs | Coverage ledger becomes unreliable | Use deterministic ID counting against the new root ledger and per-feature files. |
| Risk | `mcp-cocoindex-code` keeps partial old wording | Users get conflicting instructions | Normalize root index, review protocol, and category-folder files in the same pass. |
| Risk | Validator language over-promises per-feature-file validation | False confidence in package completeness | Document validator limits explicitly until tooling catches up. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Root playbook indexes stay compact enough to scan quickly and should not duplicate full per-feature detail already housed in category folders.
- **NFR-P02**: The split should reduce navigation cost for large playbooks, especially `system-spec-kit`, by grouping per-feature detail into numbered category folders.

### Security
- **NFR-S01**: Destructive-scenario warnings and sandbox guidance must survive the split unchanged.
- **NFR-S02**: No secrets, credentials, or environment-specific paths are introduced while refactoring doc structure.

### Reliability
- **NFR-R01**: Every feature ID listed in a root coverage ledger resolves to exactly one per-feature file.
- **NFR-R02**: Relative links between root indexes, category folders, per-feature files, review protocols, and ledgers remain valid after the refactor.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Large playbook surface: `system-spec-kit` has enough features that the root index must stay ledger-only and avoid re-embedding all per-feature detail.
- Mixed package maturity: `mcp-cocoindex-code` already had a split package shape, so the work is partly normalization and partly cleanup instead of a full fresh split.
- Historical references: older docs may still point at merged-playbook assumptions and need an explicit sweep.

### Error Scenarios
- Missing per-feature files after the split: root ledger points to dead paths.
- Duplicate feature IDs across root-folder files: coverage counts pass visually but fail deterministically.
- Review protocol still counting features from the wrong surface: release-readiness math becomes misleading.

### State Transitions
- In-progress migration: root index may land before all category-folder files, so verification must happen only after both sides are updated.
- Partial docs sweep: `sk-doc` can become the new source of drift if templates or rules lag behind package examples.
- Follow-up validator work: if needed later, it should be tracked separately from this documentation refactor.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Two shipped playbook packages plus multiple sk-doc template and rule files. |
| Risk | 13/25 | High documentation-drift risk, but limited to markdown and rules. |
| Research | 11/20 | Requires reconciling current package shapes, coverage-ledger logic, and validator wording. |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 9. ACCEPTANCE SCENARIOS

1. **Given** the `system-spec-kit` playbook is still merged, **when** the refactor lands, **then** its root playbook becomes an index and coverage ledger and the per-feature files live under numbered category folders.
2. **Given** the `mcp-cocoindex-code` package already has a split package shape, **when** the normalization pass completes, **then** its root index, category-folder files, and companion docs all describe the same source-of-truth contract.
3. **Given** `sk-doc` teaches users how to author playbooks, **when** its template pair and references are updated, **then** they describe required root-level category folders and divider lines between numbered sections.
4. **Given** both playbook packages use root ledgers, **when** verification runs, **then** every feature ID appears exactly once in the matching root-folder file set and every root-file link resolves.

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

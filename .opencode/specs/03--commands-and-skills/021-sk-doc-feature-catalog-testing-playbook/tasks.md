---
title: "Tasks: sk-doc Feature Catalog + Testing [03--commands-and-skills/021-sk-doc-feature-catalog-testing-playbook/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "feature catalog tasks"
  - "testing playbook tasks"
  - "sk-doc regroup tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: sk-doc Feature Catalog + Testing Playbook Alignment

Task log for the broader documentation-alignment effort that followed the initial playbook refactor.

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
## Phase 1: Setup

- [x] T001 Establish Level 2 spec scope for the broader feature-catalog plus testing-playbook alignment packet
- [x] T002 Inventory the shipped `system-spec-kit` and `mcp-coco-index` playbook/catalog structures
- [x] T003 [P] Enumerate `sk-doc` templates, references, README/skill docs, and runtime consumers that still described older contracts
- [x] T004 Lock the final root-doc plus numbered-category-folder contract for feature catalogs and testing playbooks
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Refactor `system-spec-kit/manual_testing_playbook/` into the integrated root-playbook contract
- [x] T011 [P] Align all `system-spec-kit` playbook per-feature files with frontmatter, divider, and orchestrator-led prompt expectations
- [x] T012 Align `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md` and `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md` to the final header/frontmatter conventions
- [x] T013 [P] Add frontmatter to feature-catalog and manual-testing per-feature files in the aligned trees
- [x] T014 Remove obsolete canonical playbook sidecar docs and fold their guidance into the root playbook
- [x] T015 Normalize `mcp-coco-index/manual_testing_playbook/` to the same integrated root-playbook contract
- [x] T016 Mirror the feature-catalog folder taxonomy into `.claude/skills/system-spec-kit/manual_testing_playbook/`
<!-- /ANCHOR:phase-2 -->

---

### Additional Implementation Scope

- [x] T020 Move testing-playbook templates into `assets/documentation/testing_playbook/`
- [x] T021 [P] Create the feature-catalog template bundle under `assets/documentation/feature_catalog/`
- [x] T022 Update `.opencode/skill/sk-doc/SKILL.md`, `.opencode/skill/sk-doc/README.md`, `.opencode/skill/sk-doc/references/global/quick_reference.md`, and `.opencode/skill/sk-doc/references/global/workflows.md` for the final feature-catalog and testing-playbook contracts
- [x] T023 [P] Add `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md` and `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md`
- [x] T024 [P] Rename the former install-guide standards reference to `.opencode/skill/sk-doc/references/specific/install_guide_creation.md`
- [x] T025 Regroup `sk-doc/references/` into `global/` and `specific/`
- [x] T026 Create the missing `.opencode/skill/sk-doc/references/specific/agent_creation.md`
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Update `.opencode/command/create/` assets and docs to use the regrouped reference paths
- [x] T031 Update `.opencode/agent/write.md` to match nested grouped-reference discovery
- [x] T032 Run stale-path and stale-contract wording sweeps across touched surfaces
- [x] T033 Validate touched `sk-doc` docs and references with `validate_document.py`
- [x] T034 Verify playbook counts, path resolution, and frontmatter coverage in the aligned trees
- [x] T035 Run `npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/hydra-spec-pack-consistency.vitest.ts`
- [x] T036 Synchronize `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` to the final delivered scope
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and verification tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The packet describes the shipped contracts and downstream path updates honestly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

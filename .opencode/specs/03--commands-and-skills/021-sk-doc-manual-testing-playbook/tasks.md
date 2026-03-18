---
title: "Tasks: sk-doc Manual Testing Playbook Feature-Catalog Refactor [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual testing playbook tasks"
  - "root category folder tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: sk-doc Manual Testing Playbook Feature-Catalog Refactor

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

- [x] T001 Establish Level 2 spec scope for the playbook refactor (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
- [x] T002 Inventory current playbook package shapes in `system-spec-kit` and `mcp-cocoindex-code`
- [x] T003 [P] Enumerate coupled `sk-doc` playbook templates, references, and rules that still describe the old contract
- [x] T004 Lock the target package contract: root index, numbered category folders, per-feature files, coverage ledger, and companion-doc roles
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Rewrite the `system-spec-kit` playbook root index as a coverage ledger and navigation surface
- [x] T011 [P] Create 195 per-feature files under numbered `system-spec-kit/manual_testing_playbook/` category folders and move scenario detail into them
- [x] T012 Update the `system-spec-kit` review protocol to count coverage from the root ledger plus root-folder per-feature files
- [x] T013 Update the `system-spec-kit` subagent ledger to reference the package structure cleanly
- [x] T014 Normalize the `mcp-cocoindex-code` playbook root index wording and ledger rules
- [x] T015 [P] Reconcile 20 `mcp-cocoindex-code/manual_testing_playbook/` per-feature files with the final numbered-category contract
- [x] T016 Update the `mcp-cocoindex-code` review protocol and subagent ledger to use the final root-folder-backed coverage wording
- [x] T017 Update the sk-doc playbook template
- [x] T018 [P] Create and align the sk-doc per-feature file template
- [x] T019 [P] Update the sk-doc skill guide
- [x] T020 [P] Update the sk-doc README, quick reference, and workflows guidance
- [x] T021 [P] Update `.opencode/skill/sk-doc/assets/template_rules.json`
- [x] T022 Update `.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts` for root-versus-per-feature-file NEW-125 assertions
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run stale-language searches for old playbook-contract phrases across touched files
- [x] T031 Verify package file presence and root-folder per-feature-file path resolution in both playbook packages
- [x] T032 Verify each root ledger feature ID appears exactly once in the matching root-folder per-feature files (`195/195`, `20/20`)
- [x] T033 Run applicable markdown validation checks on touched `sk-doc` documentation files and JSON validation on `template_rules.json`
- [x] T034 Run `npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/hydra-spec-pack-consistency.vitest.ts` in `.opencode/skill/system-spec-kit/mcp_server`
- [x] T035 Synchronize `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` with the completed implementation state
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and verification tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Root-ledger and root-folder per-feature-file verification checks passed for both playbook packages
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

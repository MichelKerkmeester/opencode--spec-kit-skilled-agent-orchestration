---
title: "Tasks: tooling-and-scripts [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "tooling and scripts"
  - "tooling-and-scripts"
  - "tree thinning"
  - "architecture boundary"
  - "progressive validation"
  - "file watcher"
  - "admin cli"
importance_tier: "normal"
contextType: "general"
---
# Tasks: tooling-and-scripts

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

- [x] T001 Build feature inventory for all 8 Tooling and Scripts features (`feature_catalog/16--tooling-and-scripts/*.md`)
- [x] T002 Consolidate FAIL/WARN findings into prioritized remediation groups (`checklist.md`, `tasks.md`)
- [x] T003 [P] Normalize audit criteria mapping (correctness, standards, behavior, testing, playbook) (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Repoint tree-thinning feature mapping to actual consolidation workflow code (`feature_catalog/16--tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md`)
- [x] T005 [P0] Add tree-thinning token-threshold merge/content-summary tests (`mcp_server/lib/chunking/chunk-thinning.ts`, `mcp_server/tests/chunk-thinning.vitest.ts`)
- [x] T006 [P0] Fix architecture boundary checker path mapping and multiline/wrapper parsing robustness (`scripts/evals/check-architecture-boundaries.ts`)
- [x] T007 [P0] Add architecture boundary violation tests for GAP A/GAP B and wrapper bypass cases (`mcp_server/tests/layer-definitions.vitest.ts`)
- [x] T008 [P0] Correct progressive-validation script path mapping and populate feature test table (`scripts/spec/progressive-validate.sh`, `mcp_server/tests/progressive-validation.vitest.ts`)
- [x] T009 [P0] Export `getWatcherMetrics` and add watcher metrics coverage (`mcp_server/lib/ops/file-watcher.ts`, `mcp_server/tests/file-watcher.vitest.ts`)
- [x] T010 [P1] Add auditable source evidence for dead-code-removal claims (`feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md`)
- [x] T011 [P1] Add file-level evidence and rule mapping for standards-alignment claims (`feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md`)
- [x] T012 [P1] Decide and document checkpoint-before-delete contract for standalone admin CLI (`mcp_server/cli.ts`, `feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md`)
- [x] T013 [P1] Add CLI integration tests for `stats`, `bulk-delete`, `reindex`, and `schema-downgrade` (`mcp_server/cli.ts`)
- [x] T014 [P1] Add rename integration and debounce stress tests for watcher cleanup (`mcp_server/lib/ops/file-watcher.ts`, `mcp_server/tests/file-watcher.vitest.ts`)
- [x] T015 [P2] Add regression tests to protect dead-code-removal outcomes (`feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md`)
- [x] T016 [P2] Link lint/check outputs for standards-alignment verification traceability (`feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 [P] Run targeted Vitest suites for watcher, progressive-validation, architecture, and CLI paths (`mcp_server/tests/*.vitest.ts`)
- [x] T018 Reconcile feature-catalog implementation/test tables with resolved runtime surfaces (`feature_catalog/16--tooling-and-scripts/*.md`)
- [x] T019 Synchronize final state across `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` (`016-tooling-and-scripts/*.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

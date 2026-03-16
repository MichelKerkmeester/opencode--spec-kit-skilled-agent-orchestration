---
title: "Tasks: bug-fixes-and-data-integrity [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "bug fixes"
  - "data integrity"
  - "causal link"
  - "verification sync"
  - "scripts package"
importance_tier: "normal"
contextType: "general"
---
# Tasks: bug-fixes-and-data-integrity

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

| Priority | Count | Description |
|----------|-------|-------------|
| **P0** | 7 | Runtime correctness + critical verification |
| **P1** | 14 | Coverage hardening, docs alignment, and scripts reliability |
| **P2** | 1 | Cleanup and optional follow-through item |
| **Total** | 22 | Packet tasks |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] [P0] Reconfirm review findings and reproduce causal-link lock/busy masking path (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts`)
- [x] T002 [P] [P1] Reconfirm stale documentation and coverage overclaim surfaces (`.opencode/skill/system-spec-kit/README.md`, `.opencode/skill/system-spec-kit/mcp_server/tests/README.md`, `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`, `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md`)
- [x] T003 [P] [P0] Lock implementation scope to approved runtime/test/doc files and packet markdown only
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] [P0] Fix lock/busy error handling in causal edge insert to rethrow infra failures (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`)
- [x] T005 [P] [P0] Add storage-level regression for `SQLITE_BUSY` rethrow (`.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts`)
- [x] T006 [P] [P0] Add integration regression asserting causal-link lock path maps to `E022` envelope (`.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts`)
- [x] T007 [P] [P1] Replace symlink fallback pass-through branches with environment capability gating (`.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts`)
- [x] T008 [P] [P1] Remove stale `hash_checks` token from legacy comment (`.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts`)
- [x] T009 [P] [P1] Refresh root README test counts and verification freshness (`.opencode/skill/system-spec-kit/README.md`)
- [x] T010 [P] [P1] Refresh `mcp_server/tests` README coverage wording and file-count command (`.opencode/skill/system-spec-kit/mcp_server/tests/README.md`)
- [x] T011 [P] [P1] Update watcher cleanup feature note to current reliability coverage wording (`.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/08-watcher-delete-rename-cleanup.md`)
- [x] T012 [P] [P1] Replace undocumented coverage-gap statement with explicit 29-entry notes matrix (`.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`)
- [x] T013 [P] [P1] Restore scripts package local test runner dependency (`.opencode/skill/system-spec-kit/scripts/package.json`, `.opencode/skill/system-spec-kit/package-lock.json`)
- [x] T014 [P] [P1] Fix scripts support paths for import resolution and CLI authority expectation (`.opencode/skill/system-spec-kit/scripts/lib/decision-tree-generator.ts`, `.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts`)
- [x] T015 [P] [P1] Fix macOS `/var` vs `/private/var` file writer target resolution (`.opencode/skill/system-spec-kit/scripts/core/file-writer.ts`)
- [x] T016 [P] [P2] Remove stray packet artifact file (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/005-lifecycle/.DS_Store`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Documentation Sync

- [x] T017 [P] [P0] Verify type safety in skill root (`npm run typecheck` in `.opencode/skill/system-spec-kit`)
- [x] T018 [P] [P0] Verify targeted MCP suites (`causal-edges`, `integration-causal-graph`, `incremental-index`, `incremental-index-v2`) pass in `.opencode/skill/system-spec-kit/mcp_server`
- [x] T019 [P] [P1] Verify selected scripts suites pass individually (`generate-context-cli-authority`, `memory-render-fixture`, `import-policy-rules`, `tree-thinning`, `slug-uniqueness`, `task-enrichment`, `runtime-memory-inputs`) in `.opencode/skill/system-spec-kit/scripts`
- [x] T020 [P] [P1] Capture full `scripts` package `npm test` completion evidence and close remaining checklist item (`Test Files 9 passed (9)`, `Tests 150 passed (150)`, `Duration 77.49s`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Packet Documentation

- [x] T021 [P] [P1] Rewrite `008` packet docs to align with actual fixes and verification state (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] T022 [P] [P1] Replace stale glob/brace placeholders in Discovery packet task references with concrete paths (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/003-discovery/tasks.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks completed
- [x] All P1 tasks completed
- [x] No `[B]` blocked tasks
- [x] Verification claims restricted to observed evidence only
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

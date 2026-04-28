---
title: "Tasks: Memory-Indexer Storage-Boundary Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task list driving the storage-boundary fix (P1) plus 13 P2 advisories from the 005 deep-review report."
trigger_phrases:
  - "001-memory-indexer-storage-boundary"
  - "validator hygiene"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/001-memory-indexer-storage-boundary"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    completion_pct: 100
---

# Tasks: Memory-Indexer Storage-Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

Tasks are grouped by plan phase. Each task lists requirement, status, and evidence.

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |

**Task Format**: `T### [REQ] Description. Evidence: file:line or command exit.`

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T1** [REQ-001] Add `isIndexableConstitutionalMemoryPath()` in `mcp_server/lib/utils/index-scope.ts`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:54`; `tests/index-scope.vitest.ts:74`.
- [x] **T2** [REQ-001] Wire helper into `mcp_server/lib/parsing/memory-parser.ts:~967`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:971`.
- [x] **T3** [REQ-001] Wire helper into `mcp_server/handlers/memory-index-discovery.ts:~223`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:227`.
- [x] **T4** [REQ-001] Wire helper into `mcp_server/lib/storage/checkpoints.ts:~1335`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1335`; `npx vitest run tests/checkpoint-restore-invariant-enforcement.vitest.ts tests/checkpoint-restore-readme-poisoning.vitest.ts` exit 0.
- [x] **T5** [REQ-001] Wire helper into `mcp_server/lib/search/vector-index-mutations.ts:~449`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:450`.
- [x] **T6** [REQ-001] Wire helper into `mcp_server/lib/storage/post-insert-metadata.ts`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:104`.
- [x] **T7** [REQ-001] Wire helper into `mcp_server/handlers/memory-save.ts` save-time validation. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:333`.
- [x] **T8** [REQ-001, REQ-012] Refactor `scripts/memory/cleanup-index-scope-violations.ts` to derive excluded paths from SSOT. Evidence: `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:111`.
- [x] **T9** [REQ-002] Author `mcp_server/tests/checkpoint-restore-readme-poisoning.vitest.ts`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-restore-readme-poisoning.vitest.ts:125`; initial test failed before T4, then passed after T4.
- [x] **T10** [REQ-001] Run Phase 1 focused suite. Evidence: `npx vitest run tests/index-scope.vitest.ts tests/checkpoint-restore-invariant-enforcement.vitest.ts tests/checkpoint-restore-readme-poisoning.vitest.ts tests/memory-save-index-scope.vitest.ts tests/memory-crud-update-constitutional-guard.vitest.ts tests/symlink-realpath-hardening.vitest.ts tests/cleanup-script-audit-emission.vitest.ts` exit 0.

<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T11** [REQ-006] Define `E_MEMORY_INDEX_SCOPE_EXCLUDED` error code; thread through `memory-save.ts:~2715`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:173`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-index-scope.vitest.ts:346`.
- [x] **T12** [REQ-005] Add `warnings` + `capExceeded` to `findFiles()` in `memory-index-discovery.ts`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:45`.
- [x] **T13** [REQ-005] Add same fields in `code_graph/lib/structural-indexer.ts:~1377`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:42`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1385`.
- [x] **T14** [REQ-005] Surface fields in `memory_index_scan` MCP response and code-graph scan summary. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:374`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:47`.
- [x] **T15** [REQ-007] Route `applyPostInsertMetadataFallback` through `applyPostInsertMetadata`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:102`; `.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:264`.

<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T16** [REQ-008] Rewrite `010-memory-indexer-invariants` to `005-memory-indexer-invariants` in 005 root docs. Evidence: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/spec.md:194`.
- [x] **T17** [REQ-004] Add resolvability evidence to 005 `checklist.md`. Evidence: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/checklist.md:74`.
- [x] **T18** [REQ-014] Back-fill alternatives for ADR-008..ADR-012. Evidence: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md:317`; `:346`; `:375`; `:404`; `:433`.
- [x] **T19** [REQ-009] Update feature catalog packet ID + ADR refs. Evidence: `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:25`.
- [x] **T20** [REQ-010] Add adversarial scenarios in manual playbook. Evidence: `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:38`.
- [x] **T21** [REQ-011] Rewrite relevant runtime trace comments to packet `026/005`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:372`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:452`.
- [x] **T22** [REQ-013] Append Repair / Verify / Rollback subsection in mcp_server/README.md. Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md:121`.
- [x] **T23** [REQ-003] Fix strategy artifact map paths. Evidence: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/deep-review-strategy.md:156`; `:159`.
- [x] **T24** [REQ-015] Extract shared fixture `mcp_server/tests/fixtures/memory-index-db.ts`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/memory-index-db.ts:10`; migrated tests at `checkpoint-restore-invariant-enforcement.vitest.ts:6`, `checkpoint-restore-readme-poisoning.vitest.ts:6`, `cleanup-script-audit-emission.vitest.ts:8`.

<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T25** Strict packet validator. Evidence: closure pass records the strict-validator command and exit code in the temporary hygiene summary.
- [x] **T26** Re-read source review report; dispositions recorded in `implementation-summary.md`. Evidence: `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/review/005-memory-indexer-invariants-pt-01/review-report.md:46`.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->

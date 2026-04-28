---
title: "Tasks: Dead-Code Pruning"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "T001-T204 task ledger covering read+verify, 13 surgical deletes, cascade-orphan cleanup, and verification."
trigger_phrases:
  - "004-dead-code-pruning tasks"
  - "dead-code pruning task ledger"
importance_tier: "important"
contextType: "tasks-ledger"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/004-dead-code-pruning"
    last_updated_at: "2026-04-28T09:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "Validate packet"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Dead-Code Pruning

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending
- `[x]` complete
- `[~]` in progress
- `[!]` blocked
- Each task has `Tnnn` ID, action, optional file refs, acceptance criterion.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Read `../003-dead-code-audit/dead-code-audit-report.md` and confirm Category: `dead` table has 13 findings.
  - **Acceptance**: 13 entries identified; each has file:line + symbol + recommended action `delete` + safety `high-confidence-delete`.

- [x] **T002** For each finding (1..13), Read the cited file at the cited line; verify the symbol still matches (cross-check by symbol name in case line drifted).
  - **Acceptance**: All 13 symbols still present in source as audited.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T101** Delete unused `memoryParser` namespace import in `mcp_server/context-server.ts`.
  - **Acceptance**: Import line removed; siblings untouched.

- [x] **T102** Delete unused `DEFAULT_TOKEN_CAP` constant in `mcp_server/hooks/codex/user-prompt-submit.ts`.
  - **Acceptance**: Constant declaration removed.

- [x] **T103** Delete unused private `isMarkdownOrTextFile` helper in `mcp_server/lib/parsing/memory-parser.ts`.
  - **Acceptance**: Function block removed; section divider preserved cleanly.

- [x] **T104** Delete unused private `deleteCausalEdgesForMemoryIds` in `mcp_server/lib/storage/checkpoints.ts`.
  - **Acceptance**: Function block removed.

- [x] **T105** Delete unused `failedCount` local in `mcp_server/skill_advisor/handlers/advisor-validate.ts`.
  - **Acceptance**: Variable declaration removed.

- [x] **T106** Delete unused type import `SkillGraphLease` from `mcp_server/skill_advisor/lib/daemon/lifecycle.ts`.
  - **Acceptance**: Type-import segment dropped from destructured import; siblings preserved.

- [x] **T107** Delete unused `statSync` import from `node:fs` in `mcp_server/skill_advisor/lib/daemon/watcher.ts`.
  - **Acceptance**: `statSync` removed from destructured import; siblings preserved.

- [x] **T108** Delete unused `dirname` import from `node:path` in `mcp_server/skill_advisor/lib/derived/extract.ts`.
  - **Acceptance**: `dirname` removed from destructured import; siblings preserved.

- [x] **T109** Delete unused `SOURCE_CATEGORIES` constant in `mcp_server/skill_advisor/lib/derived/extract.ts`.
  - **Acceptance**: Constant declaration block removed.

- [x] **T110** Delete unused `join` import from `node:path` in `mcp_server/skill_advisor/lib/generation.ts`.
  - **Acceptance**: `join` removed from destructured import; siblings preserved.

- [x] **T111** Delete unused test-local `content` in `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`.
  - **Acceptance**: Variable declaration line removed.

- [x] **T112** Delete unused `vi` import in `mcp_server/code_graph/tests/code-graph-seed-resolver.vitest.ts`.
  - **Acceptance**: `vi` removed from vitest destructured import; siblings preserved.

- [x] **T113** Delete unused `existsSync` import in `mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts`.
  - **Acceptance**: `existsSync` removed from `node:fs` destructured import; siblings preserved.

- [x] **T114** Run strict typecheck `tsc --noUnusedLocals --noUnusedParameters` to detect cascade orphans.
  - **Acceptance**: Cascade orphans identified (if any) by error output.

- [x] **T115** Cascade-orphan cleanup. After T114, two cascade orphans surfaced:
  - `mcp_server/skill_advisor/handlers/advisor-validate.ts` — `p0Checks` array became orphan (its only consumer was the deleted `failedCount`); removed.
  - `mcp_server/lib/storage/checkpoints.ts` — `deleteEdgesForMemory` import became orphan (its only consumer was the deleted `deleteCausalEdgesForMemoryIds`); removed.
  - **Acceptance**: Strict typecheck exits 0 after cascade cleanup.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T201** Run normal `tsc --noEmit` — exit 0 expected.
  - **Acceptance**: `EXIT=0` observed.

- [x] **T202** Run full `vitest run` — must pass.
  - **Acceptance**: All test files pass; no regression.

- [x] **T203** Run `validate.sh --strict` on packet — Errors=0 (SPEC_DOC_INTEGRITY noise accepted).
  - **Acceptance**: Exit 0; structural errors=0.

- [x] **T204** Update `implementation-summary.md` with per-finding outcome + cascade orphan list + tsc/vitest results.
  - **Acceptance**: implementation-summary.md fully populated (NOT placeholder).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

This packet is complete when:
- All 13 audit-listed deletes applied (or skip-with-reason documented)
- Cascade orphans cleaned up
- `tsc --noEmit` exit 0
- `tsc --noUnusedLocals --noUnusedParameters` exit 0
- `vitest run` passes
- `validate.sh --strict` Errors=0
- `implementation-summary.md` lists per-finding outcome
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor: `../003-dead-code-audit/`
- Source of truth: `../003-dead-code-audit/dead-code-audit-report.md` Category: `dead` table
- Sibling phases under same parent: `../001-memory-terminology/`, `../002-feature-catalog/`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->

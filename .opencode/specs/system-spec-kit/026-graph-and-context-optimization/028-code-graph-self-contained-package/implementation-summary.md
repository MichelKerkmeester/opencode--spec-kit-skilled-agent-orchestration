---
title: "Implementation Summary: 028 — Code-Graph Self-Contained Package Migration"
description: "Code-graph was migrated into mcp_server/code-graph/ as a self-contained package with behavior-preserving import-path rewires and verification."
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/028-code-graph-self-contained-package"
    last_updated_at: "2026-04-20T20:50:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Moved code-graph package; verified 52/52 tests"
    next_safe_action: "Orchestrator stage rename set and commit"
    blockers:
      - ".git/index.lock creation blocked by sandbox; see blocker.md"
    completion_pct: 95
    open_questions:
      - "Orchestrator must stage/commit to complete git history verification on the new path."
    answered_questions:
      - "Runtime DB stays in mcp_server/database/ and was not modified."
---
# Implementation Summary: 028 — Code-Graph Self-Contained Package Migration

## Status

Implementation and verification are complete in the filesystem. Commit/staging is blocked by sandboxed git-index permissions; see `blocker.md`.

## What Shipped

- Created self-contained package folder `mcp_server/code-graph/`.
- Moved 34 requested files into the package:
  - 17 lib files into `mcp_server/code-graph/lib/`
  - 9 handler files into `mcp_server/code-graph/handlers/`
  - 1 tool descriptor into `mcp_server/code-graph/tools/code-graph-tools.ts`
  - 7 targeted code-graph tests into `mcp_server/code-graph/tests/`
- Added `mcp_server/code-graph/tools/index.ts` as a package-local barrel so dispatcher imports avoid the mandated stale-path grep substring `tools/code-graph-tools`.
- Updated imports across `mcp_server/`, `mcp_server/hooks/`, `mcp_server/tests/`, and `scripts/tests/`.
- Rewired dispatcher import in `mcp_server/tools/index.ts`.
- Updated `mcp_server/vitest.config.ts` to include `mcp_server/code-graph/tests/**/*.{vitest,test}.ts`.

## Files Moved

Lib:
`README.md`, `budget-allocator.ts`, `code-graph-context.ts`, `code-graph-db.ts`, `compact-merger.ts`, `ensure-ready.ts`, `index.ts`, `indexer-types.ts`, `ops-hardening.ts`, `query-intent-classifier.ts`, `readiness-contract.ts`, `runtime-detection.ts`, `seed-resolver.ts`, `startup-brief.ts`, `structural-indexer.ts`, `tree-sitter-parser.ts`, `working-set-tracker.ts`.

Handlers:
`README.md`, `ccc-feedback.ts`, `ccc-reindex.ts`, `ccc-status.ts`, `context.ts`, `index.ts`, `query.ts`, `scan.ts`, `status.ts`.

Tools:
`code-graph-tools.ts`.

Tests:
`code-graph-context-handler.vitest.ts`, `code-graph-indexer.vitest.ts`, `code-graph-ops-hardening.vitest.ts`, `code-graph-query-handler.vitest.ts`, `code-graph-scan.vitest.ts`, `code-graph-seed-resolver.vitest.ts`, `code-graph-siblings-readiness.vitest.ts`.

## Test Results

| Check | Result |
|---|---|
| Baseline code-graph vitest | `/tmp/028-baseline.log`: 7 files / 52 tests passed |
| Migrated code-graph vitest | `/tmp/028-after-codegraph.log`: 7 files / 52 tests passed |
| Stale import grep | 0 lines |
| File count | `find mcp_server/code-graph -type f \| wc -l` => 35 |
| Old locations | `find mcp_server/lib/code-graph mcp_server/handlers/code-graph -type f 2>/dev/null \| wc -l` => 0 |
| Typecheck | `/tmp/028-typecheck.log`: exit 0 |
| Build | `/tmp/028-build.log`: exit 0 |
| Skill-advisor regression | `/tmp/028-skill-advisor.log`: 12 files / 85 tests passed |
| Hook regression | `/tmp/028-hook-tests.log`: 10 files / 171 tests passed |

## Git History Evidence

The sandbox prevented `git mv` and staging because `.git/index.lock` cannot be created. Until the orchestrator stages/commits the rename set, `git log --follow mcp_server/code-graph/lib/code-graph-db.ts` has no committed new-path history.

Old-path history is intact:

```text
e774eef07e fix(016): scattered medium refactors (T-HST-10, T-RCB-09/10/11, T-PIN-07/08, T-ENR-02, T-SRS-03/04, T-SAP-03; R4-003, R5-002, R11-004, R12-003, R16-002, R17-002, R19-002, R27-001, R29-002, R38-001, R46-001)
2837e157a6 feat(026-014): ship code graph upgrade runtime lane
da60644818 feat(spec-kit): v3.2.0.0 — ESM compliance + Compact Code Graph unified release
8e5c714f4b feat(spec-kit): Phase 025 implementation + deep review fixes across phases 001-023
3571249f28 chore: sync all pending changes — search retrieval fixes, code-graph v2, spec updates
```

## Open Items

- Orchestrator must stage the rename set and commit with the exact requested message in `blocker.md`.
- After staging/commit, rerun `git log --follow mcp_server/code-graph/lib/code-graph-db.ts | head -5` to verify history on the new path.

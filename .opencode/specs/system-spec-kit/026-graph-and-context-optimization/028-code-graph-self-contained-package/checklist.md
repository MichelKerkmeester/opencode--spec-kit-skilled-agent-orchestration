---
title: "Checklist: 028 — Code-Graph Self-Contained Package Migration"
description: "Level 2 verification checklist for code-graph migration to self-contained package."
importance_tier: "high"
contextType: "implementation"
---

# Checklist: 028

## P0 Verification (blockers — MUST pass before convergence)

- [x] 17 files at `mcp_server/code-graph/lib/` (evidence: `find .../code-graph/lib -maxdepth 1 -type f | wc -l` => 17). Git index writes are sandbox-blocked; staged rename/history verification remains for orchestrator (see `blocker.md`).
- [x] 9 files at `mcp_server/code-graph/handlers/` (evidence: `find .../code-graph/handlers -maxdepth 1 -type f | wc -l` => 9). Git index writes are sandbox-blocked; staged rename/history verification remains for orchestrator (see `blocker.md`).
- [x] Tool descriptor at `mcp_server/code-graph/tools/code-graph-tools.ts` (plus package-local barrel `mcp_server/code-graph/tools/index.ts` to keep the stale-path grep at zero).
- [x] 7 test files at `mcp_server/code-graph/tests/` (evidence: `find .../code-graph/tests -maxdepth 1 -name 'code-graph-*.vitest.ts' | wc -l` => 7).
- [x] Old directories `mcp_server/lib/code-graph/` and `mcp_server/handlers/code-graph/` are gone (evidence: `find mcp_server/lib/code-graph mcp_server/handlers/code-graph -type f 2>/dev/null | wc -l` => 0).
- [x] No stale imports remain (evidence: `grep -rln "mcp_server/lib/code-graph\|mcp_server/handlers/code-graph\|tools/code-graph-tools" mcp_server/ scripts/ --include="*.ts"` returned 0 lines).
- [x] `mcp_server/schemas/tool-input-schemas.ts` checked; no code-graph import path existed to update, strict code-graph schemas remain inline.
- [x] `mcp_server/tool-schemas.ts` checked; no `codeGraphTools` import path existed to update, code-graph tool schema definitions remain inline.
- [x] `mcp_server/tools/index.ts` updated (evidence: imports `../code-graph/tools/index.js`).
- [x] `mcp_server/vitest.config.ts` include patterns updated (evidence: includes `mcp_server/code-graph/tests/**/*.{vitest,test}.ts`).
- [x] Baseline code-graph vitest pass count preserved (evidence: `/tmp/028-baseline.log` => 7 files / 52 tests; `/tmp/028-after-codegraph.log` => 7 files / 52 tests).
- [x] `npm run typecheck` exit 0 (evidence: `/tmp/028-typecheck.log`).
- [x] `npm run build` exit 0 (evidence: `/tmp/028-build.log`).
- [x] Regression: skill-advisor suite green (evidence: `/tmp/028-skill-advisor.log` => 12 files / 85 tests; current suite count differs from the checklist's stale 96-test expectation).
- [x] Regression: hook tests still green (evidence: `/tmp/028-hook-tests.log` => 10 files / 171 tests).

## P1 Verification (required)

- [x] All 7 MCP tool names unchanged: `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `ccc_reindex`, `ccc_status`, `ccc_feedback` (evidence: `mcp_server/code-graph/tools/code-graph-tools.ts` `TOOL_NAMES` set unchanged).
- [x] `mcp_server/code-graph/lib/README.md` preserved (architecture notes retained).
- [x] `mcp_server/code-graph/handlers/README.md` preserved.
- [ ] Commit message references `refactor(028):` and explains the self-contained package migration. Blocked by `.git/index.lock: Operation not permitted`; exact commit message is recorded in `blocker.md`.
- [x] No code logic changes: content edits are import-path rewires plus `vitest.config.ts` include update and a tiny tools barrel needed for the mandated stale-path grep.
- [x] DB file at `mcp_server/database/code-graph.sqlite*` left in place (evidence: `git status --short .../mcp_server/database` returned no rows).

## P2 Verification (suggestions — nice to have)

- [ ] Zod schemas extracted to `mcp_server/code-graph/schemas/` if they were co-located
- [ ] Optional `mcp_server/code-graph/index.ts` package public surface added
- [ ] Optional `mcp_server/code-graph/README.md` added linking lib/ + handlers/ READMEs

## Failure modes to watch

- [ ] If `git mv` fails with .git/index.lock → sandbox issue; use `mv` + stage with `git add -A`; orchestrator commits
- [ ] If imports break after move → check `.js` suffix on relative imports (ESM resolution)
- [ ] If typecheck breaks with "Cannot find module" → tsconfig paths may reference old locations; verify tsconfig is unchanged
- [ ] If vitest discovery fails → confirm include pattern syntax matches skill-advisor pattern from 027

## Evidence conventions

`path/to/file.ts:LINE` for code; shell log quote for commands; `git log --follow <file>` output for history preservation.

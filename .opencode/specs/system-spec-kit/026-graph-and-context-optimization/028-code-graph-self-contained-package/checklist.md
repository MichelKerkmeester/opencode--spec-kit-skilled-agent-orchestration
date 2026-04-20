---
title: "Checklist: 028 — Code-Graph Self-Contained Package Migration"
description: "Level 2 verification checklist for code-graph migration to self-contained package."
importance_tier: "high"
contextType: "implementation"
---

# Checklist: 028

## P0 Verification (blockers — MUST pass before convergence)

- [ ] 17 files at `mcp_server/code-graph/lib/` with git history preserved (evidence: `git log --follow`)
- [ ] 9 files at `mcp_server/code-graph/handlers/` with git history
- [ ] Tool descriptor at `mcp_server/code-graph/tools/code-graph-tools.ts`
- [ ] 7 test files at `mcp_server/code-graph/tests/`
- [ ] Old directories `mcp_server/lib/code-graph/` and `mcp_server/handlers/code-graph/` are gone (evidence: `find` returns nothing)
- [ ] No stale imports remain (evidence: `grep -rln "mcp_server/lib/code-graph\|mcp_server/handlers/code-graph\|tools/code-graph-tools" mcp_server/ scripts/ --include="*.ts"` returns 0 lines)
- [ ] `mcp_server/schemas/tool-input-schemas.ts` updated
- [ ] `mcp_server/tool-schemas.ts` updated
- [ ] `mcp_server/tools/index.ts` updated
- [ ] `mcp_server/vitest.config.ts` include patterns updated
- [ ] Baseline code-graph vitest pass count preserved (evidence: log diff vs /tmp/028-baseline.log)
- [ ] `npm run typecheck` exit 0
- [ ] `npm run build` exit 0
- [ ] Regression: skill-advisor 96-test suite still green (no cross-package regression)
- [ ] Regression: hook tests still green (no startup-brief import regression)

## P1 Verification (required)

- [ ] All 7 MCP tool names unchanged: `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `ccc_reindex`, `ccc_status`, `ccc_feedback`
- [ ] `mcp_server/code-graph/lib/README.md` preserved (architecture notes retained)
- [ ] `mcp_server/code-graph/handlers/README.md` preserved
- [ ] Commit message references `refactor(028):` and explains the self-contained package migration
- [ ] No code logic changes: `git diff --stat` shows only renames + import-path edits
- [ ] DB file at `mcp_server/database/code-graph.sqlite*` left in place (runtime state, not code)

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

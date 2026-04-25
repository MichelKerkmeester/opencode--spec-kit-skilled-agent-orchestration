---
title: "P [system-spec-kit/026-graph-and-context-optimization/007-code-graph/002-code-graph-self-contained-package/plan]"
description: "Phase plan for behavior-preserving migration of code-graph into self-contained mcp_server/code-graph/ package."
trigger_phrases:
  - "plan"
  - "002"
  - "code"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/002-code-graph-self-contained-package"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Plan: 028 — Code-Graph Self-Contained Package Migration

## Phase Sequence

```
[baseline capture] → [git mv moves] → [import-path updates] → [dispatcher rewire] → [vitest config] → [verify] → [commit]
```

## Phase 1 — Baseline capture (5 min)
- Run targeted code-graph vitest: `cd mcp_server && ../scripts/node_modules/.bin/vitest run mcp_server/tests/code-graph-*.vitest.ts --reporter=default > /tmp/028-baseline.log 2>&1` — record file + test counts
- Run `npm run typecheck` — expect exit 0 pre-migration
- Record baseline tool-dispatch test (if any integration test calls `code_graph_status`)

## Phase 2 — Directory setup + moves (10 min)
- `mkdir -p mcp_server/code-graph/{lib,handlers,tools,tests}`
- `git mv mcp_server/lib/code-graph/* mcp_server/code-graph/lib/`
- `git mv mcp_server/handlers/code-graph/* mcp_server/code-graph/handlers/`
- `git mv mcp_server/tools/code-graph-tools.ts mcp_server/code-graph/tools/code-graph-tools.ts`
- `for f in mcp_server/tests/code-graph-*.vitest.ts; do git mv "$f" mcp_server/code-graph/tests/; done`
- Delete empty dirs: `rmdir mcp_server/lib/code-graph mcp_server/handlers/code-graph`

## Phase 3 — Import path updates (20 min)
Find all stale imports with grep:
```
grep -rln "mcp_server/lib/code-graph\|mcp_server/handlers/code-graph\|tools/code-graph-tools" mcp_server/ scripts/ --include="*.ts"
```

Update each to point at new locations. Common patterns:
- `'../lib/code-graph/code-graph-db.js'` → `'../code-graph/lib/code-graph-db.js'` (from hooks/)
- `'../../lib/code-graph/startup-brief.js'` → `'../../code-graph/lib/startup-brief.js'` (from hooks/claude/)
- `'./code-graph-tools.js'` → `'../code-graph/tools/code-graph-tools.js'` (from tools/index.ts)

## Phase 4 — Dispatcher rewire (5 min)
- `mcp_server/schemas/tool-input-schemas.ts` — update code-graph schema import path
- `mcp_server/tool-schemas.ts` — update codeGraphTools import
- `mcp_server/tools/index.ts` — update codeGraphTools import + export

## Phase 5 — Vitest config (2 min)
- `mcp_server/vitest.config.ts` — add `'mcp_server/code-graph/tests/**/*.{vitest,test}.ts'` to include (matches skill-advisor pattern from 027)

## Phase 6 — Verify (5-10 min)
- `cd mcp_server && ../scripts/node_modules/.bin/vitest run mcp_server/code-graph/tests/ --reporter=default` — same pass count as baseline
- `grep -rln "mcp_server/lib/code-graph\|mcp_server/handlers/code-graph\|tools/code-graph-tools" mcp_server/ scripts/ --include="*.ts"` — zero lines
- `npm run typecheck` — exit 0
- `npm run build` — exit 0
- `git log --follow mcp_server/code-graph/lib/code-graph-db.ts | head -5` — confirms history preserved
- Run full advisor suite as regression check: `../scripts/node_modules/.bin/vitest run mcp_server/skill-advisor/tests/ --reporter=default` — same 96 tests green

## Phase 7 — Commit + push (2 min)
Single commit: `refactor(028): migrate code-graph to self-contained mcp_server/code-graph/ package`

Body:
- Mirrors skill-advisor architecture from Phase 027
- 17 lib + 9 handlers + 1 tool + 7 tests moved via git mv (history preserved)
- Import paths updated across hooks/, tests/, tools/, schemas/
- Dispatcher rewired; MCP tool names unchanged
- Vitest include patterns updated
- Zero behavior change; baseline pass count preserved
- No DB, CLI, or schema changes

## Estimated wall-clock

30-60 min for a cli-codex gpt-5.4 high fast dispatch. Purely mechanical migration.

## References

- Spec: `./spec.md`
- Tasks: `./tasks.md`
- Checklist: `./checklist.md`
- Pattern reference: Phase 027/003 migration prep commit `1146faeec` (same pattern, skill-advisor)

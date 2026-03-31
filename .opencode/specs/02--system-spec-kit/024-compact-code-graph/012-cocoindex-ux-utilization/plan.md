---
title: "Plan: Phase 012 — CocoIndex UX [02--system-spec-kit/024-compact-code-graph/012-cocoindex-ux-utilization/plan]"
description: "1. Fix hook compilation (P0, 1-2 hours) — tsconfig + build verification"
trigger_phrases:
  - "plan"
  - "phase"
  - "012"
  - "cocoindex"
importance_tier: "important"
contextType: "planning"
---
# Plan: Phase 012 — CocoIndex UX, Utilization & Usefulness

## Implementation Order

1. **Fix hook compilation** (P0, 1-2 hours) — tsconfig + build verification
2. **CocoIndex MCP availability** (P1, 2-3 hours) — mcp.json + startup status
3. **Enhanced MCP tools** (P1, 3-4 hours) — ccc_status + ccc_reindex
4. **Agent routing** (P1, 2-3 hours) — @context CocoIndex-first + compaction integration
5. **Auto-index + freshness** (P2, 1-2 hours) — stale detection + background reindex
6. **Quality feedback** (P2, 2-3 hours) — ccc_feedback tool + storage

## Step A: Fix Hook Compilation (P0)

1. **Update `mcp_server/tsconfig.json`** — the `include` field already has `**/*.ts` which covers `hooks/claude/*.ts`. The issue is likely that the hooks/claude/ files import from `node:*` builtins and use top-level `process.exit()` which tsc may handle differently. Check:
   - Verify `hooks/claude/*.ts` are included in the build scope
   - If tsconfig excludes them, add explicit include
   - Run `npm run build` and verify `dist/hooks/claude/` is populated
   - If build fails, fix any TS errors in the hook files

2. **Add build verification** — after `npm run build`, check that these files exist:
   - `dist/hooks/claude/shared.js`
   - `dist/hooks/claude/hook-state.js`
   - `dist/hooks/claude/compact-inject.js`
   - `dist/hooks/claude/session-prime.js`
   - `dist/hooks/claude/session-stop.js`
   - `dist/hooks/claude/claude-transcript.js`

3. **Test hooks locally** — run `echo '{}' | node dist/hooks/claude/session-prime.js` and verify it exits 0 with output.

## Step B: CocoIndex MCP Availability

1. **Add to `.claude/mcp.json`** — add cocoindex_code entry matching the opencode.json config:
   ```json
   "cocoindex_code": {
     "command": ".opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc",
     "args": ["mcp"],
     "env": { "COCOINDEX_CODE_ROOT_PATH": "." }
   }
   ```

2. **Update `session-prime.ts` startup handler** — add CocoIndex availability check:
   - Check if `ccc` binary exists at the expected path
   - If available, include in startup output: "CocoIndex Code: available"
   - If not, skip silently (don't fail the hook)

3. **Update `session-prime.ts` compact handler** — after injecting cached payload, note CocoIndex availability for the AI to use in recovery.

## Step C: Enhanced MCP Tools

These are changes to the CocoIndex Code MCP server itself (Python-based, external). Spec only — actual implementation depends on CocoIndex upstream or local fork.

1. **`ccc_status` tool** — expose index stats (file count, chunk count, model, last indexed)
2. **`ccc_reindex` tool** — trigger incremental re-index from MCP
3. **Document in skill files** — update SKILL.md, README.md, tool_reference.md

## Step D: Agent Routing Improvements

1. **Update `@context` agent** across all 4 runtimes — add explicit CocoIndex-first enforcement:
   - Before Grep/Glob, check if query is semantic → call `mcp__cocoindex_code__search`
   - Only fall back to Grep/Glob if CocoIndex unavailable or returns no results

2. **Wire PreCompact CocoIndex integration** — in `compact-inject.ts`:
   - After extracting active file paths from transcript
   - Query CocoIndex for semantic neighbors of top 3 files (if MCP available)
   - Include top results in cached payload under "Semantic Neighbors" section
   - Budget: use COMPACTION_TOKEN_BUDGET overflow from code graph allocation

3. **Wire reverse semantic augmentation** — in `code-graph-context.ts`:
   - After expanding graph neighborhoods
   - Query CocoIndex with expanded symbol names/file paths
   - Include semantic matches in context response
   - Guard: skip if <400ms budget remains (latency guard from Phase 010 design)

## Step E: Auto-Index & Freshness

1. **Stale detection** — in SessionStart startup, check `.cocoindex_code/settings.yml` mtime
   - If >24h old, trigger background `ccc index` via subprocess (don't wait)
   - Log: "CocoIndex: triggering background re-index (last indexed >24h ago)"

2. **Default `refresh_index: false`** — document recommendation in search_patterns.md and SKILL.md
   - Avoids concurrency issues on parallel MCP queries
   - Explicit refresh via `ccc_reindex` or `ccc index` CLI

## Step F: Quality Feedback

1. **`ccc_feedback` MCP tool** — accepts search result ID + useful/not-useful signal
2. **Storage** — append to feedback table in CocoIndex database
3. **Pattern** — mirror `memory_validate` interface: `wasUseful`, `resultRank`, `queryTerms`

## Parallel Work Strategy (4 agents)

**Agent A**: Step A (hook compilation fix + build verification)
**Agent B**: Step B (mcp.json + session-prime updates)
**Agent C**: Step D (agent routing + compact-inject CocoIndex integration)
**Agent D**: Step C + documentation updates

Steps E and F are P2 and can be deferred to a follow-up.

<!-- ANCHOR:dependencies -->
## Dependencies

- Step A must complete first (hooks must compile before B can test them)
- Steps B, C, D can partially parallelize after A
- Steps E, F are independent and can run after B
<!-- /ANCHOR:dependencies -->

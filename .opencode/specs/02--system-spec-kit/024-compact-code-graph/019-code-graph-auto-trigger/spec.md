# Phase 019: Code Graph Auto-Trigger

## What This Is

Right now, you have to manually run `code_graph_scan` before the code graph works. This phase makes the code graph automatically index itself when needed — no manual step required.

## Plain-English Summary

**Problem:** If you ask "who calls this function?" and the code graph hasn't been indexed, you get an empty result or an error. The user has to remember to run `code_graph_scan` first, which breaks the flow.

**Solution:** Add a shared `ensureCodeGraphReady()` helper that checks if the graph is fresh before every query. If it's stale or empty, it triggers a quick reindex automatically.

## What to Build

### A shared "ensure ready" helper that checks three things:

1. **Graph empty?** → Full scan needed (first use)
2. **Git HEAD changed?** → Branch switch detected, full rescan
3. **File mtimes drifted?** → Some files changed, selective reindex only those files

This helper is called at the top of `code_graph_context` and `code_graph_query`. The scan happens transparently — the user just asks their question and gets an answer.

### Also improve `code_graph_status`:

Make it report **true freshness** instead of just "last scan time":
- "fresh" = indexed within 5 minutes and no file changes
- "stale" = files changed since last index
- "empty" = never indexed

### Update runtime docs:

Add to all gate docs: "If `code_graph_status` shows stale, the server will auto-reindex on your next query."

## Files to Change

| File | Change |
|------|--------|
| New `lib/code-graph/ensure-ready.ts` | Shared freshness checker + selective reindex trigger |
| `handlers/code-graph/context.ts` | Call `ensureCodeGraphReady()` before building context |
| `handlers/code-graph/query.ts` | Call `ensureCodeGraphReady()` before running query |
| `handlers/code-graph/status.ts` | Report true freshness (empty/stale/fresh) |
| `lib/code-graph/code-graph-db.ts` | Add per-file mtime tracking |
| `handlers/code-graph/scan.ts` | Support selective reindex (changed files only) |
| `AGENTS.md`, `CODEX.md`, `GEMINI.md` | Document auto-trigger behavior |

## Cross-Runtime Impact

| Runtime | Before | After |
|---------|--------|-------|
| Claude Code | 100% | 100% |
| OpenCode | 60% | 95% |
| Codex CLI | 55% | 95% |
| Copilot CLI | 50% | 95% |
| Gemini CLI | 50% | 95% |

This is the **highest parity gain** of all proposals — every runtime benefits equally because it's entirely server-side.

## Estimated LOC: 170-360
## Risk: MEDIUM — auto-indexing adds latency to first query; needs timeout guards
## Dependencies: None

---

## Implementation Status (Post-Review Iterations 041-050)

| Item | Status | Evidence |
|------|--------|----------|
| ensure-ready.ts shared helper | DONE | lib/code-graph/ensure-ready.ts (203 lines) |
| Three freshness conditions (empty/HEAD/mtime) | DONE | detectState() lines 56-105 |
| context.ts auto-trigger | DONE | ensureCodeGraphReady(process.cwd()) before buildContext |
| query.ts auto-trigger | DONE | ensureCodeGraphReady(process.cwd()) before query dispatch |
| status.ts true freshness reporting | DONE | getGraphFreshness() returns fresh/stale/empty |
| 10-second timeout guard | DONE | AUTO_INDEX_TIMEOUT_MS = 10_000 |
| Selective reindex for stale files | DONE | SELECTIVE_REINDEX_THRESHOLD = 50 |
| Per-file mtime tracking | DONE | ensureFreshFiles() in code-graph-db.ts |

### Review Findings (iter 043)
- F048 (P2): selective reindex passes raw file paths as includeGlobs. DEFERRED
- F049 (P2): timeout via AbortController doesn't cancel indexFiles. DEFERRED (fire-and-forget is acceptable)

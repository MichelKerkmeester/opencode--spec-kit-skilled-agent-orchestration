# Research Iteration 098: Code Graph Auto-Trigger Patterns

## Focus
Investigate how code graph indexing can happen automatically on non-hook CLIs without requiring explicit `code_graph_scan` calls.

## Findings

### Current State

`code_graph_scan` is only triggered by an explicit MCP tool call. The handler resolves a workspace root, builds indexer config, checks stored `last_git_head`, and forces a full reindex on branch change; otherwise it defaults to "incremental," but that mode still parses every matching file before skipping unchanged DB writes, because `indexFiles()` reads and parses the full candidate set first.

Staleness detection is fragmented today:
- `code_graph_context` computes freshness from `MAX(indexed_at)` only, with `fresh/recent/stale/unknown`.
- Claude `session-prime.ts` warns only when the last scan is older than 24h.
- `code_graph_status` reports `staleFiles`, but that currently means parse-health problems (`error`/`recovered`), not on-disk file drift.
- The DB already stores `file_mtime_ms`, and helpers like `isFileStale()` / `ensureFreshFiles()` exist, but query/context paths do not use them.

Non-hook CLIs therefore never auto-index. They can be told to check `code_graph_status`, but nothing automatically repairs an empty or stale graph.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts`]

### Problem

Non-hook CLIs never auto-index, so code graph quality is often empty or stale unless the model explicitly calls `code_graph_scan`. That weakens `code_graph_context` and `code_graph_query`, especially on first-use, branch switches, and after file edits.

## Proposals

### Proposal A: MCP Server Startup Auto-Index
- Description: Trigger code graph indexing during MCP server initialization. Best variant is not "always full scan," but a startup preflight that decides whether to launch a scan.
- LOC estimate: 80-160
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
  - tests around startup/init behavior
- Dependencies:
  - single-flight scan guard / "scan in progress" metadata
  - root-dir resolution at startup
  - optional async prewarm path
- Risk: MEDIUM-HIGH — startup is shared by all MCP users, so synchronous auto-index penalizes every session, even ones that never use graph tools. Async startup avoids blocking, but then first graph requests can race with the background scan.

### Proposal B: Stale Detection via File Mtime
- Description: Use existing `file_mtime_ms` storage to compare current workspace mtimes against indexed mtimes, then selectively reindex only stale/new/deleted files. This should become the canonical freshness signal, not `indexed_at` age alone.
- LOC estimate: 90-180
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts`
  - tests for stale/new/deleted files
- Dependencies:
  - candidate file discovery walk
  - selective parse path, not current parse-everything flow
  - normalized freshness helper shared by status/context/query
- Risk: MEDIUM — technically sound and already partly supported by schema, but it needs a real selective-index path. Without that, mtime checks only improve correctness, not latency.

### Proposal C: Lazy Indexing on First Query
- Description: On `code_graph_context` or `code_graph_query`, auto-index when the graph is empty or stale. Best form is "lazy + selective": if seeds/subject resolve to files, reindex those first; if the graph is empty, do an initial workspace scan once.
- LOC estimate: 70-150
- Files to change:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`
  - likely new helper such as `lib/code-graph/ensure-ready.ts`
- Dependencies:
  - shared freshness/auto-index helper
  - single-flight guard
  - reuse of mtime/git-head checks
- Risk: MEDIUM — first graph call gets slower, but only sessions that actually use graph tools pay the cost. This is the best cross-runtime parity lever because it does not depend on hooks.

### Proposal D: Gate Doc Auto-Trigger Instructions
- Description: Strengthen runtime docs/prompts so that when `code_graph_status` shows empty/stale graph, the model must immediately call `code_graph_scan`.
- LOC estimate: 10-30
- Files to change:
  - `AGENTS.md`
  - `CODEX.md`
  - `GEMINI.md`
  - likely `CLAUDE.md` / related docs
- Dependencies:
  - prompt compliance by each runtime/model
  - clearer status semantics
- Risk: LOW — tiny change, zero runtime cost, but it is guidance, not true automation.

## Recommendation

Use a **B + C + D** combination.

`C` is the real cross-runtime fix: lazy auto-index on first `code_graph_context/query` call gives non-hook CLIs parity without imposing scan cost on every MCP startup.

`B` is the enabling correctness layer: centralize freshness on per-file mtime plus git-head drift, and add a selective reindex path so auto-index is cheap enough to be acceptable.

`D` is the safety net: keep docs telling models to check `code_graph_status` early, but upgrade the instruction to "if empty/stale, scan now."

**Not recommended to lead with pure A.** Startup full-scan is the most expensive option because this MCP server hosts many non-graph tools, so every session would pay parse + CPU + memory overhead. A small startup preflight is fine, but full startup auto-index should be secondary.

## Cross-Runtime Impact

| Runtime | Current Auto-Index | After Implementation | Parity Change |
|---------|-------------------|---------------------|---------------|
| Claude Code | Hook warns on stale | Hook warning + lazy first-use auto-index | 100% -> 100% |
| OpenCode | Manual only | Lazy first-use auto-index | 60% -> 95% |
| Codex CLI | Manual only | Lazy first-use auto-index + stronger first-turn docs | 55% -> 95% |
| Copilot CLI | Manual only | Lazy first-use auto-index + stronger first-turn docs | 50% -> 95% |
| Gemini CLI | Manual only | Lazy first-use auto-index + stronger first-turn docs | 50% -> 95% |

## Next Steps

1. Add a shared `ensureCodeGraphReady()` helper that checks: graph empty, git HEAD changed, per-file mtime drift.
2. Refactor scan flow so selective reindex avoids parsing the entire workspace.
3. Call that helper from `code_graph_context` and `code_graph_query`.
4. Update `code_graph_status` to report true freshness/staleness, not just parse-health issues.
5. Update runtime docs so non-hook CLIs escalate from `code_graph_status` to scan automatically.
6. Add tests for: empty DB first query, stale mtime reindex, branch switch full reindex, no-op when graph is already fresh.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high

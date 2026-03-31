# Iteration 71: Error Recovery and Graceful Degradation

## Focus
Investigate existing error handling patterns in hook scripts, code-graph-db.ts, and runtime detection to understand current resilience posture, then design graceful degradation tiers, DB recovery strategies, and error telemetry for the compact code graph system.

## Findings

1. **Hooks use a "never-block" guarantee pattern**: Both `compact-inject.ts` and `session-prime.ts` wrap their `main()` call in `.catch()` that logs to stderr, followed by `.finally(() => process.exit(0))`. This ensures the hook process ALWAYS exits successfully regardless of any error. The pattern is correct but loses all diagnostic context -- errors are logged to stderr which is typically invisible to the user.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:245-249]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:220-224]

2. **Three-tier fallback already exists in compact-inject.ts**: The `main()` function tries `buildMergedContext()` (3-source merge pipeline) first, catches failures, then falls back to `buildCompactContext()` (legacy transcript-only analysis). This is a concrete existing pattern for source-level degradation. However, the fallback is coarse -- if the merge fails at ANY point, it falls back entirely rather than degrading specific sources.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:224-232]

3. **session-prime.ts handles unavailable code graph gracefully**: It uses a dynamic import with try/catch for `code-graph-db.js`, setting `getStats` to null if the module is unavailable. When checking stale index, it wraps the `getStats()` call in another try/catch. This is the correct double-guard pattern for optional dependencies -- import guard + call guard.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:18-24, 103-117]

4. **code-graph-db.ts has NO error recovery for SQLite failures**: The `initDb()` function calls `new Database(dbPath)` and `db.exec(SCHEMA_SQL)` without any try/catch. If the DB file is corrupted, locked by another process, or the schema migration fails, the error propagates up and crashes the caller. There is no WAL checkpoint recovery, no corrupt-db detection, no auto-rebuild. The `getDb()` function only checks for null (uninitialized), not for a closed or corrupted connection. WAL mode is set (`pragma journal_mode = WAL`) which helps concurrent readers but does not handle corruption.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:71-80, 82-86]

5. **No retry logic anywhere in the codebase**: The `withTimeout()` function in shared.ts provides timeout protection (1800ms default, under the 2s hook hard cap) with fallback values, but there is zero retry logic. If a SQLite query fails due to a transient lock (`SQLITE_BUSY`), it crashes. The `better-sqlite3` library is synchronous, so `SQLITE_BUSY` manifests as a thrown exception. WAL mode reduces but does not eliminate writer-writer contention.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:54-68]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:7, 76]

6. **Runtime detection provides degradation signals but nothing consumes them**: `runtime-detection.ts` exports `getRecoveryApproach()` returning `'hooks'` or `'tool_fallback'`, and `HookPolicy` types including `'unavailable'`. However, no code in the codebase currently calls `getRecoveryApproach()` to adapt behavior. The degradation chain (hooks -> tool fallback -> memory only) is designed but unwired.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:46-54]

7. **Designed graceful degradation cascade (new design)**:
   - **Level 0 (full)**: Code Graph + CocoIndex + Memory (3-source merge) -- current happy path
   - **Level 1 (graph-down)**: CocoIndex + Memory only. Trigger: `initDb()` throws or `getStats()` returns null. Action: skip codeGraph section in MergeInput, log warning, continue with 2-source merge
   - **Level 2 (graph+coco-down)**: Memory only. Trigger: CocoIndex binary missing (`checkCocoIndexAvailable()` returns not-installed) AND graph unavailable. Action: use constitutional + triggered memories only
   - **Level 3 (all-down)**: Bare session recovery. Trigger: MCP server itself unreachable. Action: instruction-file-based prompts (CLAUDE.md, CODEX.md) tell the AI to call `memory_context` on first interaction
   - Implementation: A `DegradationLevel` enum (0-3) computed once per session via a `computeDegradationLevel()` function that probes each source. The level is passed into `mergeCompactBrief` to adjust budget allocation (e.g., at Level 1, code graph's 1200-token floor reallocates to CocoIndex and memory).
[INFERENCE: based on analysis of compact-inject.ts fallback pattern, session-prime.ts dynamic import pattern, runtime-detection.ts hook policy, and code-graph-db.ts lack of recovery]

8. **Designed DB auto-rebuild from source files (new design)**:
   - The code graph DB is fully reconstructable from source files via `code_graph_scan`. Unlike the memory index (which contains user-authored content), the code graph is purely derived data.
   - Auto-rebuild trigger: In `initDb()`, wrap `new Database(dbPath)` and `db.exec(SCHEMA_SQL)` in try/catch. On `SQLITE_CORRUPT`, `SQLITE_NOTADB`, or `SQLITE_CANTOPEN` errors: (a) log the corruption, (b) rename the corrupt file to `code-graph.sqlite.corrupt.{timestamp}`, (c) create a fresh DB, (d) set a `needsFullRescan` flag that `code_graph_scan` checks on next invocation, (e) continue with empty graph (Level 1 degradation) until rescan completes.
   - Estimated LOC: ~40 lines in `initDb()` + ~10 lines flag check in scan handler.
   - For `SQLITE_BUSY` (write contention): Add a `busy_timeout` pragma (e.g., `db.pragma('busy_timeout = 3000')`) which makes better-sqlite3 retry internally for up to 3 seconds before throwing.
[INFERENCE: based on code-graph-db.ts schema being fully reconstructable from `structural-indexer.ts` scan, plus SQLite error code semantics]

## Ruled Out
- **File watchers for auto-rebuild** -- already ruled out in prior iterations; polling/scan-based approach is better for this use case
- **Cross-process DB locking via flock** -- `better-sqlite3` is single-process synchronous; WAL + busy_timeout is sufficient

## Dead Ends
None identified this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` (full file, 249 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` (full file, 224 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts` (full file, 103 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` (full file, 339 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts` (full file, 55 lines)
- Grep across `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/` for error/fallback/retry patterns

## Assessment
- New information ratio: 0.69
- Questions addressed: All 6 sub-questions from the dispatch focus
- Questions answered: (1) Hook error handling pattern: never-block + stderr logging; (2) shared.ts timeout: withTimeout with fallback value; (3) SQLite failure modes: no handling for locked/corrupt/crash; (4) Degradation cascade: 4-level design (full -> graph-down -> graph+coco-down -> bare); (5) DB rebuild: auto-rename + flag-based rescan; (6) Error telemetry: stderr-only currently, needs structured reporting

## Reflection
- What worked and why: Direct source code reading of all 5 files in the error handling chain revealed concrete gaps. The `initDb()` lack of try/catch and the `getRecoveryApproach()` being unwired were only discoverable from source.
- What did not work and why: N/A -- focused iteration with clear targets.
- What I would do differently: Could have also checked the MCP tool handler layer (tools/index.ts) to see if there is error handling wrapping tool dispatch calls, since that is where user-visible errors surface.

## Recommended Next Focus
Error telemetry and observability design: How should errors be surfaced to users without blocking them? Current stderr logging is invisible. Design structured error reporting (e.g., a `_diagnostics` field in MCP tool responses, or a `code_graph_health` summary injected into session priming output). Also investigate the MCP tool handler layer for existing error boundary patterns.

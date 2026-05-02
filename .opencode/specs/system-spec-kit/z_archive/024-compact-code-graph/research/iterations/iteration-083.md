# Iteration 83: Verification of Error Recovery Design Claims from Iteration 071

## Focus
Verify whether the six error-recovery claims recorded in iteration 071 still match the current code in `code-graph-db.ts`, `runtime-detection.ts`, `compact-inject.ts`, and `session-prime.ts`.

## Findings

1. **Claim 1 is only partially true: `initDb()` still has zero local recovery, but "corrupt DB crashes MCP server" is now overstated.**
   `initDb()` still performs `new Database(dbPath)`, `pragma(...)`, and `db.exec(SCHEMA_SQL)` without any local `try/catch`, so corrupt/locked DB failures are not handled inside `code-graph-db.ts`. However, tool dispatch in `context-server.ts` is wrapped in a top-level `try/catch` that converts thrown tool errors into MCP error responses instead of letting them terminate the server process. The recovery test also now explicitly asserts that a corrupt DB should either initialize or throw a meaningful error, not hang or crash silently.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:71-79]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:308-459]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:901-923]

2. **Claim 2 is false in current codebase scope: SQLITE_BUSY handling exists now, just not in `code-graph-db.ts`.**
   The code-graph DB module still has no `busy_timeout`, no retry wrapper, and no `SQLITE_BUSY`-specific handling around initialization or graph writes. But iteration 071's broader statement that there is "No SQLITE_BUSY retry logic anywhere" no longer holds: the job queue and file watcher both implement explicit `SQLITE_BUSY` retry helpers, and other SQLite stores set `busy_timeout` pragmas.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:71-79]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:123-163]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:176-200]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:144-149]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:805-811]

3. **Claim 3 is mostly still true: `getRecoveryApproach()` exists and is tested, but remains unwired in production paths.**
   `runtime-detection.ts` still exposes `getRecoveryApproach()` as a simple `hooks` vs `tool_fallback` selector built on `areHooksAvailable()`. That behavior is now covered by cross-runtime tests, but repo search under `mcp_server/` shows only the definition file and tests calling `getRecoveryApproach()`; the hook scripts and tool handlers examined in this pass do not consume it. So the design is no longer entirely dormant, but it is still not wired into runtime behavior.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:46-54]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:6-7]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:38-54]

4. **Claim 4 remains true: the Claude hooks still follow a never-block pattern with stderr-only logging.**
   Both hooks still end with `main().catch(...).finally(() => process.exit(0))`, which guarantees successful process exit even on failure. Their logging still routes through `hookLog()`, and `hookLog()` writes exclusively to `process.stderr` while stdout is reserved for hook injection payloads.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:244-249]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:219-224]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:70-80]

5. **Claim 5 remains true: `compact-inject.ts` still has a 2-tier fallback of merged -> legacy.**
   `compact-inject.ts` still attempts `buildMergedContext()` first, truncates the merged payload on success, and falls back to `buildCompactContext()` if any error escapes the merge path. This is a single coarse fallback tier from the merged pipeline to the legacy transcript-based context builder.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:223-232]

6. **Claim 6 remains true: `session-prime.ts` still guards optional code-graph usage with a dynamic import guard plus a call-site guard.**
   The file still performs a top-level dynamic import of `code-graph-db.js` inside a `try/catch`, setting `getStats` to `null` when the module is unavailable. Startup stale-index detection then adds a second `try/catch` around `getStats()` so missing/uninitialized graph state is skipped silently rather than breaking the hook.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:17-24]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:102-117]

## Ruled Out
- Claiming that `code-graph-db.ts` now has local corruption recovery or `SQLITE_BUSY` handling
- Claiming that `getRecoveryApproach()` is actively wired into production hook/tool behavior
- Claiming that iteration 071's "no SQLITE_BUSY logic anywhere" still matches the current repo

## Dead Ends
- None. The verification pass was conclusive from direct source reading plus targeted repo search.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts`

## Assessment
- New information ratio: 0.58
- Questions addressed: All 6 verification claims from the dispatch prompt
- Questions answered:
  1. `initDb()` still lacks local recovery, but the MCP server now has a top-level request error boundary, so "crashes MCP server" is too strong.
  2. `SQLITE_BUSY` handling now exists elsewhere in the MCP server, but not in the code-graph DB path.
  3. `getRecoveryApproach()` is implemented and tested, but still not wired into production behavior.
  4. Hook never-block + stderr-only logging still holds.
  5. `compact-inject.ts` still has merged -> legacy fallback.
  6. `session-prime.ts` still has the optional code-graph import guard.

## Reflection
- What worked and why: Direct code reading plus narrow repo-wide searches quickly separated file-local truth from codebase-wide truth. That mattered most for claim 2, which was outdated globally but still directionally correct for the code-graph path.
- What did not work and why: Iteration 071's wording mixed module-local and repo-wide assertions, so each claim needed scope checking before it could be accepted or rejected.
- What I would do differently: For future verification passes, explicitly classify every inherited claim as module-local, runtime-path, or repo-wide before starting source review.

## Recommended Next Focus
Verify whether code-graph tools are actually initialized in production runtime paths (`initDb()` call sites and startup flow), because this pass found strong request-level error wrapping but did not establish a live production initialization path for the code-graph DB.

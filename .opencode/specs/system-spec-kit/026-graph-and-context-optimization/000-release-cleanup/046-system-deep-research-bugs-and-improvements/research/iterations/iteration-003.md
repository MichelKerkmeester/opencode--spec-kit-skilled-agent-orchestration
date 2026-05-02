# Iteration 003 — A3: Resource leaks across mcp_server

## Focus
Audited long-running `mcp_server` paths for file descriptor leaks, unbounded in-memory growth, and subprocess lifecycle gaps. The pass focused on `skill_advisor/lib`, `code_graph/lib`, and shared `mcp_server/lib` watcher/cache/session surfaces.

## Actions Taken
- Enumerated target files with `rg --files` under `skill_advisor/lib`, `code_graph/lib`, and `mcp_server/lib`.
- Searched allocator and cleanup patterns: `spawn`, `fs.watch`/`chokidar`, streams, `openSync`, `new Database`, `setInterval`, `setTimeout`, `new Map`, `new Set`, cache constants, and close/dispose paths.
- Read and traced `skill_advisor/lib/subprocess.ts`, `skill_advisor/lib/daemon/watcher.ts`, `skill_advisor/lib/daemon/lifecycle.ts`, `skill_advisor/lib/daemon/lease.ts`, `mcp_server/lib/ops/file-watcher.ts`, `mcp_server/lib/cache/tool-cache.ts`, `skill_advisor/lib/source-cache.ts`, `skill_advisor/lib/prompt-cache.ts`, `code_graph/lib/code-graph-db.ts`, `code_graph/lib/tree-sitter-parser.ts`, and relevant `session-manager.ts` slices.
- Verified non-findings for several suspected surfaces: `fsyncPath()` closes its `openSync()` fd in `finally`; `runSpawnAttempt()` waits on child `close`; `code_graph` DB init closes failed handles and exposes `closeDb()`; session and tool-cache intervals have shutdown cleanup.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-003-A3-01 | P1 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:336-343 | `refreshTargets()` discovers the new target set, assigns `targets = refreshed`, and calls `watcher.add?.(...)` for additions, but never unwatches paths removed from `graph-metadata.json` or deleted skill directories. The underlying chokidar watcher is allocated at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:304-310`, and the only cleanup site is full daemon close at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:505-514`. In a long-running daemon, derived key-file churn can accumulate stale watch handles until shutdown. | Extend `SkillGraphFsWatcher` with `unwatch`, diff removed target paths in `refreshTargets()`, call `watcher.unwatch(removedPaths)`, and prune related `fileHashes` entries. If chokidar abstraction cannot support unwatch, recreate the watcher on target shrink. |
| F-003-A3-02 | P2 | .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:321 | `diagnostics` is a process-lifetime `string[]` with no TTL, size cap, or compaction. It grows from storm events at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:354`, quarantine events at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:387`, reindex failures at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:463`, and watcher errors at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:479`; `status()` returns a full copy at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:486-493`. A noisy filesystem or persistent malformed skill can grow memory and status payloads without bound. | Replace `diagnostics` with a bounded ring buffer plus aggregate counters, for example last 100 diagnostics and per-code counts. Keep status payload size capped. |
| F-003-A3-03 | P2 | .opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:223-232 | `startFileWatcher()` bounds active reindex work to two concurrent tasks, but the backpressure queue is an unbounded `pendingReindexSlots` array. Every debounced task beyond the active limit pushes a closure at line 232, and release only drains one slot at `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:235-239`. Under sustained changes or a stuck/slow `reindexFn`, queued closures and tracked promises can grow without a cap. | Replace the slot queue with per-path coalescing and a hard maximum queue depth. On overflow, drop superseded work for the same canonical path or emit a bounded diagnostic. On close, abort queued work instead of waiting for every stale task to run. |

## Questions Answered
- FD leaks: no raw `openSync()` fd leak found; `fsyncPath()` closes in `finally`. A watch-handle leak exists in the skill graph daemon when target sets shrink because additions are handled but removals are not.
- Unbounded memory growth: advisor daemon diagnostics and shared file watcher reindex queue can grow without caps. Main cache surfaces reviewed in this pass have TTL/size limits or shutdown hooks.
- Subprocess zombies: no zombie pattern found in the advisor subprocess runner; `spawn()` is attached to `error` and `close`, timeout kills the child, and the promise resolves only through those lifecycle events.

## Questions Remaining
- Whether production daemon configs frequently mutate `derived.key_files`; if yes, F-003-A3-01 should be treated closer to P1 than P2.
- Whether `startFileWatcher()` is enabled for broad workspace roots in production. Broad roots raise the practical impact of F-003-A3-03.
- A follow-on pass should check top-level MCP handler shutdown wiring to ensure exported `shutdown()` functions are actually called by process lifecycle code.

## Next Focus
Follow on with lifecycle integration: audit server startup/shutdown entrypoints to verify daemon, watcher, cache, session, and database cleanup hooks are wired into actual MCP process termination paths.

# Iteration 020: Cross-cutting concurrency and state

## Findings

### [P1] External DB rebind refreshes only a subset of singleton DB consumers
**File** `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`

**Issue** `checkDatabaseUpdated()`/`reinitializeDatabase()` closes and reopens the main DB, but only rebinds `checkpoints`, `accessTracker`, `hybridSearch`, `sessionManager`, and `incrementalIndex`. Several other long-lived modules are initialized once at startup with module-level DB handles or timer closures and are never rebound after a DB swap. That leaves later MCP requests and background jobs reading from a stale or already-closed connection after an external DB update.

**Evidence** `core/db-state.ts:56-64` defines the rebind dependency list, and `core/db-state.ts:180-197` only reinitializes that narrow subset. But startup wires additional DB-bound singletons in `context-server.ts:942-1017`, including `sessionBoost`, `causalBoost`, `workingMemory`, `attentionDecay`, `coActivation`, `archivalManager`, and `shadowEvaluationRuntime`. Those modules retain their own process-global DB state, for example `lib/search/session-boost.ts:11-12,32-33,73-92`, `lib/search/causal-boost.ts:138-156`, and `lib/feedback/shadow-evaluation-runtime.ts:86-87,372-390`.

**Fix** Move DB access to call-time `vectorIndex.getDb()` lookups, or extend `db-state` so every module with a retained DB handle or scheduler closure participates in rebind. For timer-based modules, stop and restart the job on rebind so it captures the fresh handle.

### [P1] Retrieval session state is global, caller-controlled, and not scope-bound
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts`

**Issue** Retrieval session state is stored in a process-global singleton keyed only by raw `sessionId`. `memory_search` mutates and consumes that state directly from the request without validating that the caller actually owns the session. In a shared MCP process, one caller can accidentally or intentionally reuse another caller's `sessionId` and influence future dedup/goal-boost behavior.

**Evidence** `lib/search/session-state.ts:74-168` stores mutable session state in an in-memory `Map`, and `lib/search/session-state.ts:223-255` exposes it through a singleton manager. `handlers/memory-search.ts:675-685` updates goal/anchor state from the supplied `sessionId`, `handlers/memory-search.ts:821-835` applies dedup from that same singleton, and `handlers/memory-search.ts:913-929` marks results as seen for that `sessionId`. None of those paths call the trusted-session validation used by the durable session manager.

**Fix** Key retrieval state by a trusted scope tuple, not just `sessionId` alone. At minimum use the normalized tenant/user/agent scope plus the trusted effective session id, and refuse to mutate in-memory retrieval state for untrusted caller-supplied ids.

### [P1] Progressive-disclosure cursors replay prior result sets without scope checks
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts`

**Issue** Continuation cursors are backed by a process-global in-memory store that holds entire result sets. The cursor token is only base64-encoded JSON, and cursor resolution does not verify tenant/user/agent/session scope before replaying stored results. Any caller that obtains a cursor can fetch a prior result set from an unrelated invocation, bypassing the current request's scope filters.

**Evidence** `lib/search/progressive-disclosure.ts:88` defines a global `cursorStore`, `lib/search/progressive-disclosure.ts:121-149` shows the cursor is plain base64 JSON, and `lib/search/progressive-disclosure.ts:315-316,352-401` stores and resolves results using only the cursor payload. In `handlers/memory-search.ts:441-466`, cursor resolution happens before `normalizeScopeContext()` at `handlers/memory-search.ts:469-470`, so the continuation path does not re-assert the current scope.

**Fix** Bind each stored cursor entry to the normalized scope and tool name, include an integrity-protected token payload, and reject cursor reuse when the current scope does not match the scope that created it. Also clear cursor state during shutdown/restart instead of relying only on TTL.

### [P1] Access-tracker accumulators can bleed across DB swaps
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts`

**Issue** `access-tracker` keeps an in-memory accumulator map keyed only by `memoryId`. On external DB rebind, `db-state` calls `accessTracker.init(newDb)`, which swaps the DB handle but does not flush or discard pending accumulator entries. Any buffered counts from the old DB can later be written into the new DB against the same numeric ids, corrupting `access_count` and `last_accessed`.

**Evidence** `lib/storage/access-tracker.ts:54-57` defines module-level `db` and `accumulators`, and `lib/storage/access-tracker.ts:63-71` replaces `db` without resetting the map. Pending counts are later flushed by `trackAccess()` and `reset()` in `lib/storage/access-tracker.ts:81-109,242-249`. The rebind path that triggers this is `core/db-state.ts:180-181`.

**Fix** Treat a DB swap as a hard generation boundary: flush safely before rebinding, or drop all pending accumulators when the DB identity changes. If you need to preserve buffered state, key it by `(db identity, memoryId)` instead of `memoryId` alone.

### [P2] External DB reinitialization leaves stale in-process caches alive
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts`

**Issue** The server reinitializes the DB on external updates, but it does not invalidate several process-global caches that were populated from the old DB. That means unrelated MCP calls can continue to observe pre-rebind search results and trigger phrases until TTL expiry or a later mutation hook happens to clear them.

**Evidence** `core/db-state.ts:164-167` clears only db-state's own local cache flags during reinit. Meanwhile `lib/cache/tool-cache.ts:67-79,85-93` keeps a global response cache whose keys do not encode DB generation, and `handlers/memory-search.ts:399,614-618` checks for DB updates and then immediately consults that cache. Likewise `lib/parsing/trigger-matcher.ts:141-145,181-187,203-252` keeps a module-level trigger cache loaded from `memory_index`, but db-state rebind does not clear it.

**Fix** Add a DB-generation token to all process-global caches that depend on DB content, or explicitly invalidate those caches from `reinitializeDatabase()`. Rebind should be treated like a global mutation event, not just a connection swap.

## Summary

The main risk pattern is not low-level thread unsafety inside a single Node event loop. It is process-global mutable state surviving across MCP tool calls, DB swaps, and caller boundaries. The highest-risk issues are the partial DB rebind path, unscoped retrieval session state, and unscoped continuation cursors; those can all leak or corrupt behavior across otherwise unrelated invocations. A full non-test source sweep was completed before writing this pass.

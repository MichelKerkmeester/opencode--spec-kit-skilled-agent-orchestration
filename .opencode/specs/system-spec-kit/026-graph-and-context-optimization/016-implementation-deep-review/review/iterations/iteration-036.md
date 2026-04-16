# Iteration 36 - traceability - server_core

## Dispatcher
- iteration: 36 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:19:56.223Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/context-server.ts
- .opencode/skill/system-spec-kit/mcp_server/core/config.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/context-server-error-envelope.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/unit-path-security.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **The 250 ms dispatch graph-context timeout does not actually cap tool-call latency.** `context-server.ts:631-672:resolveDispatchGraphContext` races a `setTimeout(..., 250)` against `buildDispatchGraphContext()`, but the graph walk is launched inside `queueMicrotask()` and then runs synchronously through `graphDb.queryOutline/queryEdgesFrom/queryEdgesTo` (`context-server.ts:509-613`). Because microtasks run before timers and the traversal never yields, an expensive graph expansion still blocks the event loop until it finishes; only then can the timeout branch resolve. The server therefore advertises a timeout-backed "best effort" enrichment path while still allowing the enrichment work to stall every successful tool response that contains file paths (`context-server.ts:968-970`).

```json
{"claim":"resolveDispatchGraphContext advertises a 250ms timeout, but its synchronous queueMicrotask-based traversal cannot be preempted by the timer, so graph enrichment can still block tool responses for the full traversal cost.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/context-server.ts:509-613",".opencode/skill/system-spec-kit/mcp_server/context-server.ts:631-672",".opencode/skill/system-spec-kit/mcp_server/context-server.ts:968-970"],"counterevidenceSought":"Looked for any await/yield inside buildDispatchGraphContext, worker-thread offload, or behavioral tests covering GRAPH_ENRICHMENT_TIMEOUT_MS / resolveDispatchGraphContext; none were present in the reviewed server-core sources and tests.","alternativeExplanation":"The timeout might have been intended as metadata only, but the Promise.race/timeout status plumbing and dedicated 250ms constant read as an actual latency guard for dispatch-time enrichment.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Downgrade if the contract is explicitly narrowed to 'graph enrichment may block arbitrarily long; timeout only labels late results after the fact.'"}
```

- **`resolveDatabasePaths()` promises late env override support, but the server core still runs on import-time path snapshots.** `core/config.ts:45-48` says the DB dir is re-checked at call time "to support runtime overrides (e.g. tests that set the env var after module import)", yet the same module immediately freezes `DATABASE_DIR`, `DATABASE_PATH`, `DEFAULT_BASE_PATH`, and `ALLOWED_BASE_PATHS` at import time (`core/config.ts:83-86`, `127-135`). `context-server.ts` then bakes those frozen values into `SKILL_GRAPH_DATABASE_PATH` (`223`), startup logging/init (`1734-1743`), skill-graph source discovery (`1347-1352`), watcher roots (`2002-2004`), and background scan launch (`2068-2070`); `skill-graph-db.ts:12,214-215` also lazily reopens from the frozen `DATABASE_DIR`. Meanwhile the vector store resolves the DB path dynamically (`vector-index-store.ts:276-287`). Late env changes can therefore split the live vector DB from the skill-graph DB and workspace/watch roots, even though the config layer advertises end-to-end runtime override support. `memory-roadmap-flags.vitest.ts:91-102` only verifies the helper resolver, so this drift is not covered.

```json
{"claim":"The config layer advertises runtime DB-dir overrides after module import, but context-server startup/watcher/skill-graph paths still use import-time constants, so late env changes do not propagate consistently across server-core subsystems.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/core/config.ts:45-48",".opencode/skill/system-spec-kit/mcp_server/core/config.ts:83-86",".opencode/skill/system-spec-kit/mcp_server/core/config.ts:127-135",".opencode/skill/system-spec-kit/mcp_server/context-server.ts:223",".opencode/skill/system-spec-kit/mcp_server/context-server.ts:1347-1352",".opencode/skill/system-spec-kit/mcp_server/context-server.ts:1734-1743",".opencode/skill/system-spec-kit/mcp_server/context-server.ts:2002-2004",".opencode/skill/system-spec-kit/mcp_server/context-server.ts:2068-2070",".opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:12",".opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:214-215",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:276-287",".opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:91-102"],"counterevidenceSought":"Looked for a startup-time re-read of resolveDatabasePaths(), a rebuild of DEFAULT_BASE_PATH/ALLOWED_BASE_PATHS from current env, or end-to-end tests that mutate env after import and then exercise main()/watcher setup; none appeared in the reviewed files.","alternativeExplanation":"The intent may have been to make only low-level DB consumers honor late overrides, but the config comment explicitly cites post-import overrides and server-core still surfaces/logs stale paths from frozen constants.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if the public contract is explicitly narrowed to 'only direct resolveDatabasePaths() callers honor late env overrides' and server startup/watcher behavior is documented as import-time only."}
```

### P2 Findings
- `context-server-error-envelope.vitest.ts:5-17` is a pure source-regex test, and large sections of `context-server.vitest.ts` load source text once (`66-72`) and assert lexical patterns such as `parseArgs` signatures and tool-definition wiring (`83-92`, `208-259`). Those suites do not execute `resolveDispatchGraphContext()` or any late-env override path, so both server-core regressions above can ship with green tests.

## Traceability Checks
- `graph-first-routing-nudge.vitest.ts:14-54` and `100-157` are properly behavior-driven: they import runtime modules and verify the actual helper/output contract for structural nudges, so the drift here is not in the nudge classifier itself.
- The mismatch is in server orchestration: one path claims a hard timeout for dispatch-time graph enrichment, and another claims late env overrides survive import, but the concrete execution flow in `context-server.ts` does not uphold either promise end-to-end.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1525-1584` — shutdown orchestration is coherent: it drains schedulers/caches, closes both watchers and the stdio transport, and enforces a deadline before exit.
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:74-80` — the resolved DB filename is forced under the chosen DB directory via `path.basename(...)`, so `MEMORY_DB_PATH` cannot redirect the file outside that directory once `databaseDir` is accepted.
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts` — this suite exercises real module behavior rather than signature-only text matching, giving it much better contract coverage than the legacy regex-heavy context-server tests.

## Next Focus
- Iteration 37 should follow these two traceability gaps into adjacent startup/search consumers (`core/db-state`, code-graph DB lifecycle, watcher bootstrap, and any handlers that rely on dispatch-time `graphContext`) to see where the stale-path and fake-timeout behavior becomes user-visible.

# Iteration 005: D5 Performance

## Findings

No P0 or P1 issues found.

### [P2] `vector-index-store.ts` keeps per-call `import()` boundaries on hot retrieval paths even though the heavy store dependencies are already eagerly loaded
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:20-29`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:942-944`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1036-1044`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1082-1099`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1114-1117`
- **Issue**: The store eagerly loads `better-sqlite3`, `sqlite-vec`, the embeddings provider, and schema helpers at module load, so the remaining `await import(...)` calls in `search()`, `get()`, `getStats()`, `searchEnriched()`, `enhancedSearch()`, `getConstitutionalMemories()`, and `verifyIntegrity()` no longer buy a meaningful startup reduction. They do, however, leave an avoidable async module-resolution boundary on every hot-path search/read call.
- **Evidence**: The top of the file already commits to native-module and provider startup cost. Later methods still `await import('./vector-index-queries.js')` or related helpers on each invocation. Node will cache module evaluation, but these call sites still allocate and await the namespace promise on every request, which is unnecessary on the memory-search path.
- **Fix**: Either statically import the stable query/mutation helpers or cache them behind module-level promises so the hot search/read paths do not repeatedly cross an async import boundary once the store is live.

### [P2] `mcp_server/cli.ts` pays the heavy DB/native import graph before it knows which command needs that machinery
- **File**: `.opencode/skill/system-spec-kit/mcp_server/cli.ts:15-24`; `.opencode/skill/system-spec-kit/mcp_server/cli.ts:30-31`; `.opencode/skill/system-spec-kit/mcp_server/cli.ts:364-376`
- **Issue**: The CLI parses `process.argv` only after loading vector-index, checkpoint, access-tracker, mutation-ledger, trigger-matcher, and startup-check modules at the top level. That means lightweight invocations such as usage/error paths still pay the ESM/native module-graph startup cost before command dispatch. The later dynamic import in `runReindex()` only protects the reindex handler itself, not the earlier startup work.
- **Evidence**: Command resolution happens at lines 30-31, but the heavy imports are already fixed at lines 15-24. `runReindex()` explicitly tries to defer `./handlers/memory-index.js`, which confirms the file already recognizes startup cost, but the biggest graph is still front-loaded.
- **Fix**: Move command-specific imports behind per-command loader functions so help/argument-validation and lighter commands can exit before paying for the full database/native stack.

## Notes

- I did not find a new P1 performance regression in `scripts/core/workflow.ts`. The retry-manager path memoizes its dynamic import, and the other `await import('@spec-kit/mcp-server/api')` sites appear once-per-workflow rather than hot-loop repeated loads.
- I did not find evidence that top-level-await removal itself introduced a new eager-startup regression in the reviewed `context-server.ts` path. Startup is still heavy, but the visible cost is dominated by explicit API-key validation, DB initialization, integrity checks, BM25 rebuild, and background subsystem setup inside `main()`, not by a newly introduced eager replacement for former TLA behavior.
- `shared/index.ts` remains a broad barrel, but in this D5 pass I did not find a concrete runtime-cost issue attributable to its re-exports in the reviewed Node entrypoints. The stronger concern there remains API surface size and maintainability rather than observed startup overhead.

## Summary

- P0: 0 findings
- P1: 0 findings
- P2: 2 findings
- newFindingsRatio: 0.20
- Recommended next focus: D6 Reliability on async-import failure handling, fallback-path correctness, and startup degradation behavior

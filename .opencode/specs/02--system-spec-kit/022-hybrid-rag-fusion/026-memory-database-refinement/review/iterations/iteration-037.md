# Iteration 037 - Traceability Review

- Dimension: Traceability - Spec-code alignment
- Iteration: 7 of 10
- Scope checked: `spec.md:49-76` and `implementation-summary.md:40-56`
- Review mode: Read-only verification against code under `.opencode/skill/system-spec-kit/mcp_server/`

The seven targeted claims are all in-scope for this spec packet: lineage/versioning, embedding lifecycle, checkpoint lifecycle, shared memory/governance, reconsolidation, hybrid search, and causal graph correctness are explicitly listed in `spec.md:53-76`.

## Misalignment Findings

### P1

1. `implementation-summary.md:52` says fallback threshold units were "normalized from percentage to fractional", but the code still uses percentage units. `lib/search/hybrid-search.ts:234-239` defines fallback thresholds as `30`, `17`, and `10` with comments that explicitly say "percentage units", and `lib/search/vector-index-queries.ts:200` and `lib/search/vector-index-queries.ts:349` convert those values by dividing by `100` when building `max_distance`. This is a direct summary-to-code mismatch.

### P2

1. `implementation-summary.md:46` attributes savepoint-per-table atomicity to `handlers/checkpoints.ts`, but the actual savepoint loop lives in `lib/storage/checkpoints.ts:1001-1038` and is invoked from `lib/storage/checkpoints.ts:1771-1798`. `handlers/checkpoints.ts:389-446` only consumes the result and surfaces `partialFailure` and `rolledBackTables`.
2. `implementation-summary.md:45` over-attributes canonical embedding-dimension resolution to `lib/search/vector-index-store.ts`. That file does enforce the fail-fast bootstrap guard at `lib/search/vector-index-store.ts:207-235` and `lib/search/vector-index-store.ts:758-775`, but the imported `getStartupEmbeddingDimension()` resolves the canonical startup dimension in `shared/embeddings/factory.js:52-59` and `shared/embeddings/factory.js:198-199`.
3. `implementation-summary.md:47` is only partially supported. Admin mutations do require caller identity through `validateCallerAuth()` in `handlers/shared-memory.ts:182-212`, but `handleSharedMemoryStatus()` still accepts `args.actorUserId` or `args.actorAgentId` from the request and validates them directly via `validateSharedCallerIdentity()` at `handlers/shared-memory.ts:688-695`. The phrase "no longer accepts auth from the request body" is not demonstrable from the current code.
4. `implementation-summary.md:48` is directionally right but imprecise. `executeMerge()` calls `recordLineageTransition()` and updates BM25 reachability, but the underlying operations are not all "upserts": active projection is upserted in `lib/storage/lineage-state.ts:357-377`, lineage is inserted in `lib/storage/lineage-state.ts:706-733`, and BM25 is handled as remove/add plus repair fallback in `lib/storage/reconsolidation.ts:335-373`.

## Verified Claims Table

| Claim | Summary ref | Code evidence | Verdict | Notes |
| --- | --- | --- | --- | --- |
| `buildScopePrefix()` uses SHA-256 hash | `implementation-summary.md:44` | `lib/storage/lineage-state.ts:201-219` | Verified | `buildScopePrefix()` hashes the normalized governance tuple with `createHash('sha256')` and returns `scope-sha256:<digest>`. |
| `getStartupEmbeddingDimension()` resolves canonical dimension | `implementation-summary.md:45` | `lib/search/vector-index-store.ts:90-109`, `lib/search/vector-index-store.ts:207-235`, `lib/search/vector-index-store.ts:758-775`, `shared/embeddings/factory.js:52-59`, `shared/embeddings/factory.js:198-199` | Partially verified | Canonical dimension resolution exists, and startup mismatch now fails before schema bootstrap. The resolution logic is in the imported shared factory, while `vector-index-store.ts` consumes it and enforces the fail-fast guard. |
| savepoint-per-table atomicity | `implementation-summary.md:46` | `handlers/checkpoints.ts:389-446`, `lib/storage/checkpoints.ts:1001-1038`, `lib/storage/checkpoints.ts:1771-1798`, `lib/storage/checkpoints.ts:1825-1828` | Partially verified | Behavior is present, but the handler is not where the savepoints are implemented. The handler only reports merge-failure metadata. |
| `validateCallerAuth()` requires caller identity | `implementation-summary.md:47` | `handlers/shared-memory.ts:143-179`, `handlers/shared-memory.ts:182-212`, `handlers/shared-memory.ts:400-404`, `handlers/shared-memory.ts:688-695`, `handlers/shared-memory.ts:738-742` | Partially verified | `validateCallerAuth()` does require exactly one caller identity for admin mutations. `shared_memory_status` still authenticates from request args, just via `validateSharedCallerIdentity()` instead of `validateCallerAuth()`. |
| `executeMerge()` upserts projection/lineage/BM25 | `implementation-summary.md:48` | `lib/storage/reconsolidation.ts:265-339`, `lib/storage/reconsolidation.ts:364-384`, `lib/storage/lineage-state.ts:357-377`, `lib/storage/lineage-state.ts:623-733` | Partially verified | `executeMerge()` creates the new memory row, calls `recordLineageTransition()` so projection is upserted and lineage is recorded, removes/adds BM25 documents, and returns `newMemoryId`. The word "upserts" is too broad for lineage and BM25. |
| fallback threshold fractional not percentage | `implementation-summary.md:52` | `lib/search/hybrid-search.ts:234-239`, `lib/search/hybrid-search.ts:1565-1579`, `lib/search/hybrid-search.ts:1920-1947`, `lib/search/vector-index-queries.ts:200`, `lib/search/vector-index-queries.ts:349` | Not verified | Current code still expresses fallback thresholds as percentages and converts them downstream via `/ 100`. |
| per-path visited tracking for diamonds | `implementation-summary.md:56` | `lib/storage/causal-edges.ts:446-479` | Verified | Traversal carries a per-branch `path` set, clones it per child, and checks `path.has(nextId)` before recursing. That prevents cycles without globally blocking diamond-shaped revisits on sibling paths. |

## Conclusion

Traceability is mixed rather than clean. Claims `a` and `g` are fully supported by code. Claims `b`, `c`, `d`, and `e` are directionally correct but the implementation summary overstates file ownership or the exact operation semantics. Claim `f` is not supported by the current code and should be corrected in the summary before relying on it as source-of-truth documentation.

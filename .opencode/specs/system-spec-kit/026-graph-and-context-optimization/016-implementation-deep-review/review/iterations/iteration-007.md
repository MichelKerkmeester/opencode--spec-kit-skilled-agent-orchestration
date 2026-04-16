# Iteration 7 - correctness - lib

## Dispatcher
- iteration: 7 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:30:10.986Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **Checkpoint scoped restore deletes causal edges through the wrong database handle**
   - Evidence: `clearTableForRestoreScope()` routes `causal_edges` cleanup through `deleteCausalEdgesForMemoryIds(database, memoryIds)` [.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:849-856], but that helper ignores its `database` argument and calls `deleteEdgesForMemory(memoryId)` [.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:591-598]. `deleteEdgesForMemory()` itself mutates the module-global `db`, not the caller-supplied checkpoint database [.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:693-703]. `checkpoints.init()` only stores its own database handle and never rebinds causal-edges storage [.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1-40,242-246].
   - Impact: a restore against any non-global or isolated database can leave stale `causal_edges` rows in the target DB, or delete edges from whichever DB `causal-edges.ts` was last initialized with. That breaks checkpoint restore isolation and can corrupt the wrong store during test/maintenance flows.
   - Test gap: the storage test fixture explicitly initializes both modules with the same DB handle [.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:119-120], so it never exercises the cross-database path.

```json
{
  "claim": "Scoped checkpoint restore performs causal-edge deletion through causal-edges.ts global state instead of the restore database handle, so cross-database restores can mutate the wrong store or leave stale causal edges behind.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:26",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:591-598",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:849-856",
    ".opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:693-703",
    ".opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:119-120"
  ],
  "counterevidenceSought": "I looked for checkpoints.init() rebinding causal-edges to the same database or for restore tests that run causal-edge cleanup against an isolated restore DB, but found neither.",
  "alternativeExplanation": "If the runtime guarantees a single process-wide causal-edge DB that is always identical to the checkpoint DB, the bug would be masked; the code does not enforce that invariant.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if there is a higher-level invariant proving checkpoint restore can only execute after causal-edges.init(targetDatabase) and never against an alternate DB handle."
}
```

### P2 Findings
- **`search-archival.vitest.ts` is signature-only and would miss real archive-behavior regressions.** The suite just regex-matches `includeArchived = false` in source text instead of exercising runtime behavior [.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:24-61,117-119]. That means implementation drift in the actual search path can ship while this suite still passes.
- **`getRelatedMemories` has no positive-path coverage in the main vector-index suite.** The only assertions are “empty array for missing/no relations” [.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:955-966], so a broken decode/join path for populated `related_memories` would not be caught there.

## Traceability Checks
- **Phase 027 structural bootstrap contract matches implementation intent.** `buildStructuralBootstrapContract()` implements the ready/stale/missing surface split, bounded token fitting, and source-surface-specific guidance [.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:210-287], and `structural-contract.vitest.ts` verifies those contract branches plus the <=500-token ceiling [.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:43-192].
- **Archive handling is intentionally compatibility-only on this surface.** `search-archival.vitest.ts` explicitly codifies `includeArchived` as API-only compatibility after cleanup rather than live filtering behavior [.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:69-120], so I did not file that as an implementation defect this iteration.

## Confirmed-Clean Surfaces
- **`validation-metadata.ts`**: extraction order, score immutability, and `precomputedContent` precedence are internally consistent and directly covered by focused tests [.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:173-275; .opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:39-442].
- **`session-snapshot.ts`**: the contract builder handles fresh/stale/missing graph states coherently and includes explicit budget trimming before returning the structural payload [.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:94-129,210-287].
- **`skill-graph-queries.ts`**: relation deduping plus BFS traversal for `conflicts`, `transitivePath`, and `subgraph` are mechanically sound on the reviewed paths; I did not find a correctness issue in those query helpers this pass [.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts:231-433].

## Next Focus
- Iteration 8 should probe **security/traceability in remaining lib+handler write paths**, especially any helper that mixes explicit DB handles with module-global state or relies on static/source-text-only tests.

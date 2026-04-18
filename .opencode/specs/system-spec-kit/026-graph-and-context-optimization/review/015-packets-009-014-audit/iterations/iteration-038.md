# Iteration 38 - maintainability - lib

## Dispatcher
- iteration: 38 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:27:26Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap-gate-d.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- **Import-order-sensitive path allowlist in `vector-index-store.ts`.** `ALLOWED_BASE_PATHS` is built once at module load from `process.env.MEMORY_ALLOWED_PATHS`, and both `validate_file_path_local()` and `safe_read_file_async()` keep using that frozen snapshot (`.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:289-330`). The suite already shows the maintenance cost: some tests have to `vi.resetModules()` and import only after setting env (`.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:160-165`), while others mutate `MEMORY_ALLOWED_PATHS` after statically importing the module (`.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:8-15,95-99`). This is not a production break today, but it makes path-policy behavior depend on import timing and invites brittle test/setup failures.
- **`search-flags.ts` has outgrown its dedicated parser coverage.** The module now owns many separately parsed env gates, including planner/save flags (`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:123-160`), community/query-intelligence flags (`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:282-452`), and later D4/D5/graph retrieval flags (`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:520-724`). The dedicated test file only imports and asserts a small hand-picked subset (`.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:13-25,71-215`), and save-path specs usually mock the accessors instead of exercising the real parser (`.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:50-54`). That leaves newer flag parsing branches vulnerable to silent regressions.

## Traceability Checks
- `includeArchived` is intentionally compatibility-only in the low-level vector-index query helpers after the archival cleanup. `vector-index-queries.ts` still accepts the parameter for signature stability, `search-archival.vitest.ts` explicitly codifies that it is API-only compatibility, and archived exclusion now lives in higher-level hybrid search (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1808-1810`). The implementation matches that current intent.
- The structural bootstrap contract still matches its reader-facing ceiling: `session-snapshot.ts` constrains the contract to 500 tokens, and `structural-contract.vitest.ts` verifies the hard ceiling with oversized mock data.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts` - fallback-state reporting is explicit, bounded, and backed by forced-degrade tests.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts` - pure metadata extraction is straightforward and comprehensively covered for tier/content/checklist cases.
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` - ready/stale/missing contract shaping and token-budget trimming have focused, behavior-level tests.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` - migration/index guardrails around compatibility and `memory_conflicts` rebuild are exercised by dedicated schema refinement tests.

## Next Focus
- Iteration 39 should stay on `lib/skill-graph/*`: the indexer and traversal code read cleanly, but they remain much less directly exercised than the search/session modules and are the best place to hunt higher-signal maintainability or traceability issues next.

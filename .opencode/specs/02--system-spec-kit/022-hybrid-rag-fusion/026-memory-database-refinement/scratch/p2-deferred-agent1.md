# P2 Deferred Fixes - Agent 1

## Scope

Implemented the three deferred P2 fixes inside the owned Spec Kit Memory MCP server modules:

- `handlers/causal-graph.ts`
- `lib/storage/causal-edges.ts`
- `lib/search/graph-search-fn.ts`
- `core/db-state.ts`
- `tests/integration-causal-graph.vitest.ts`
- `tests/graph-search-fn.vitest.ts`

## Changes

### P2-005: Snapshot-consistent `memory_drift_why`

- Wrapped the full `memory_drift_why` traversal/detail-read sequence in a single database transaction when the DB handle exposes `transaction()`.
- Kept a safe fallback path for lightweight mocked DB handles that do not implement transactions.
- Added an integration test that verifies the handler returns a self-consistent related-memory set for all returned edge endpoints and that the DB transaction wrapper is used.

### P2-006: Surface traversal truncation

- Changed `getEdgesFrom()`, `getEdgesTo()`, and `getAllEdges()` to keep array behavior while attaching:
  - `truncated: boolean`
  - `limit: number`
- Updated `getCausalChain()` to propagate truncation metadata onto the returned root node.
- Updated the causal-graph handler response to surface:
  - `truncated`
  - `truncationLimit`
  - directional bucket truncation metadata
  - a hint when traversal was truncated
- Added an integration test that seeds `MAX_EDGES_LIMIT + 1` outgoing edges and verifies the truncation flag is exposed.

### P2-027: Clear degree cache on DB rebind

- Added DB rebind listener support in `core/db-state.ts`.
- Registered `graph-search-fn` degree-cache invalidation against DB rebind events.
- Added a test that demonstrates stale cached degree scores on the same DB handle before rebind, then verifies `reinitializeDatabase()` clears the cache and recomputes the updated score.

## Verification

Ran from:

`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server`

Commands:

- `npx tsc --noEmit 2>&1 | tail -5`
- `npx vitest run tests/integration-causal-graph.vitest.ts tests/graph-search-fn.vitest.ts 2>&1 | tail -20`

Result:

- TypeScript check passed.
- Focused Vitest run passed: `2` files, `34` tests.

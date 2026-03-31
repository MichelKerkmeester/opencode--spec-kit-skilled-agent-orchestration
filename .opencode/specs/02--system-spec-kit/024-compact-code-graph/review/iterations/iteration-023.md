# Iteration 023: D1 Correctness Handler Dive

## Focus

Fresh correctness dive on the code-graph handlers only: `scan.ts`, `query.ts`, `context.ts`, and `status.ts`. The goal for this pass was to re-check handler-local input normalization, DB-call sequencing, error propagation, return-shape behavior, and empty-result handling without re-litigating already-known library defects unless they are still directly reachable from the handlers.

## Prior Finding Status

### [P1] F021 - the production `code_graph_scan` path still never initializes the code-graph DB before calling stale-check helpers - CONFIRMED

- `code_graph_scan` is still dispatched straight through `tools/code-graph-tools.ts` into `handleCodeGraphScan(...)` with no code-graph-specific initialization step in front of it.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:36-45]
- Inside the handler, the incremental path still calls `graphDb.isFileStale(...)` before any handler-local initialization or recovery branch runs.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:47-53]
- `isFileStale(...)` still immediately calls `getDb()`, and `getDb()` still throws when `initDb(...)` has not run yet.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:82-85][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:171-177]

### [P1] F006 - `handlers/code-graph/context.ts` still erases provider-typed seed identity during normalization - CONFIRMED

- The handler input still accepts provider-specific seed fields such as `provider`, `symbolName`, `nodeId`, `symbolId`, `file`, and `range`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:13-27]
- The normalization step still preserves the provider-typed CocoIndex branch only; every non-CocoIndex seed is collapsed to `{ filePath, startLine, endLine, query }`, which drops the `manual` and `graph` identities plus the fields those seed kinds need.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:39-45]
- The downstream resolver still distinguishes `CocoIndexSeed`, `ManualSeed`, and `GraphSeed`, but that only works if the typed seed reaches `resolveAnySeed(...)` intact.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:18-43][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:242-247]

## New Findings

### [P1] F026 - `code_graph_query` transitive traversal ignores the advertised `maxDepth` boundary and can duplicate nodes on converging paths

- The public tool contract still advertises `includeTransitive` plus `maxDepth` as a bounded multi-hop traversal control for `code_graph_query`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-649]
- In `transitiveTraversal(...)`, the depth guard is applied only when dequeuing the current frontier item (`if (visited.has(item.id) || item.depth > maxDepth) continue`). Nodes discovered from an item already at `depth === maxDepth` are still appended to `results` and `next` with `depth + 1`, so out-of-bound nodes leak into the returned payload even though they are never explored further.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:44-52][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:54-65][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:68-79]
- The same traversal also marks nodes as visited only when they are dequeued, not when they are first enqueued. If two parents at the same depth both reach the same child before that child is popped, the child is pushed into `results` twice.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:44-52][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:54-65][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:68-79]
- The live built handler reproduced both failure modes:
  - `A -> B -> C` with `includeTransitive: true` and `maxDepth: 1` still returned `C` at `depth: 2`.
  - `A -> {B, C}` and `{B, C} -> D` with `maxDepth: 2` returned `D` twice in the `nodes` array.
- Impact: the handler returns incorrect graph neighborhoods for bounded traversal requests. Downstream callers can receive nodes outside the requested radius and duplicate neighbors, which overstates impact analysis and breaks the `maxDepth` contract that the tool advertises.

## Verified Healthy / Narrowed Non-Findings

- `code_graph_status` still wraps DB-access failures in a structured `{ status: "error", error: ... }` payload rather than throwing, and this pass did not uncover a new async or empty-result defect there.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9-50]
- `code_graph_context` still wraps `buildContext(...)` failures in a structured error payload. The live correctness issue in that handler remains F006's seed-erasure bug, not an unhandled rejection or missing catch in the top-level handler.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:59-95]
- `code_graph_query` still handles unresolved subjects and non-transitive empty edge sets without throwing: unresolved subjects return a structured error object, and the 1-hop branches simply emit empty `edges` arrays when no matches are found.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:118-125][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:146-176]
- I did not record a second validation finding in this pass because the live handler-input validation gap is still the already-tracked dispatcher-level issue F010, not a newly discovered handler-local regression.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:36-45]

## Summary

- `F021`: **CONFIRMED**
- `F006`: **CONFIRMED**
- New correctness finding: **`F026` [P1]**
- New findings delta: `+0 P0`, `+1 P1`, `+0 P2`
- Recommended remediation order: keep the scan-path DB bootstrap fix and the context-seed fix in scope, then repair `transitiveTraversal(...)` so it enforces `maxDepth` before appending children and deduplicates nodes on enqueue rather than on dequeue.

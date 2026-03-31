# Iteration 016: D1 Correctness Re-verification

## Focus

Re-verify prior correctness findings `F005` through `F008` against the current structural indexer, code-graph DB update path, and `code_graph_context` seed normalization code. This pass also checked whether the current production `code_graph_scan` path can successfully initialize and use the graph DB on a fresh runtime.

## Prior Finding Status

### 1. [P1] F005 - `structural-indexer.ts` still stores one-line JS/TS symbol ranges, so multi-line `CALLS` extraction and enclosing-seed resolution remain broken - CONFIRMED

- The JS/TS parser still records `endLine: lineNum` for exported functions, arrow-function assignments, classes, interfaces, type aliases, enums, imports, and exports, so every captured symbol range still collapses to a single source line.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:38-79][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:82-104]
- `capturesToNodes(...)` still persists those one-line `startLine` / `endLine` values directly into the graph nodes.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:171-191]
- `extractEdges(...)` still slices call bodies with `contentLines.slice(caller.startLine - 1, caller.endLine)`, so a multi-line JS/TS function whose body calls another symbol on later lines is still analyzed as if its body were only the signature line.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:282-313]
- `resolveSeed(...)` still relies on `start_line <= ? AND end_line >= ?` for enclosing-symbol resolution, so any line inside a multi-line function body still misses the containing symbol when that symbol was indexed with a one-line range.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:172-213]
- Local repro matched the code-path reasoning: parsing a multi-line TS sample through the built structural indexer still produced one-line function/class ranges and missed the expected `CALLS` edge.

### 2. [P1] F006 - `handlers/code-graph/context.ts` still erases provider-typed seed identity during normalization - CONFIRMED

- The handler argument type still accepts provider-specific seed fields such as `provider`, `symbolName`, `nodeId`, `symbolId`, `file`, and `range`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:13-27]
- The normalization step still preserves only the CocoIndex branch explicitly; every non-CocoIndex seed is collapsed to `{ filePath, startLine, endLine, query }`, which drops the `provider: 'manual'` and `provider: 'graph'` identities plus the symbol/node identifiers those seed kinds need.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:39-45]
- The downstream resolver still distinguishes `CocoIndexSeed`, `ManualSeed`, and `GraphSeed`, but that discrimination only works if the typed seed reaches `resolveAnySeed(...)` intact.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:18-43][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:242-247]
- `buildContext(...)` still accepts only `CodeGraphSeed[]`, so once the handler strips the provider-specific fields there is no remaining path for manual or graph seeds to resolve by symbol name or symbol ID.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:14-23][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:48-53]

### 3. [P1] F007 - `code-graph-db.ts` plus `scan.ts` still leave stale inbound edges behind after symbol churn because orphan cleanup never runs on the normal incremental path - CONFIRMED

- `replaceNodes(...)` still deletes all nodes for the file before inserting the new node set, so symbol-ID churn removes the old target node immediately.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:127-147]
- `replaceEdges(...)` still deletes edges only where `source_id IN (...)` for the current file's source IDs, so inbound edges from other files that still target the deleted symbol ID remain untouched.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:149-169]
- The normal `code_graph_scan` path still performs `upsertFile(...)`, `replaceNodes(...)`, and `replaceEdges(...)` per file, but it never calls `cleanupOrphans()` afterward.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:47-64][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:282-297]
- Manual repro confirmed the defect shape remains current: replacing a target node `A1` with `A2` still leaves an inbound `B1 -> A1` edge in the DB until `cleanupOrphans()` is run explicitly.

### 4. [P1] F008 - `structural-indexer.ts` still never emits JS/TS `method` nodes, so class containment remains incomplete for the primary language - CONFIRMED

- The JS/TS parser still recognizes top-level functions, arrow functions, classes, interfaces, type aliases, enums, imports, and exports, but it still has no method-capture branch for class members such as `foo() {}`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:38-105]
- `extractEdges(...)` still emits `CONTAINS` edges only from class nodes to nodes whose `kind === 'method'`, so JS/TS class containment still depends on method nodes that the parser never produces.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:210-222]
- The current targeted indexer test coverage still only asserts `CONTAINS` via a Python class/method sample; it does not exercise JS/TS method capture at all.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:137-144]
- Local repro on a TS class sample still emitted only the class plus a top-level helper function, with no `method` node and no class-contained call graph.

## New Findings

### [P1] F021 - the production `code_graph_scan` path still never initializes the code-graph DB before calling stale-check helpers, so a fresh runtime throws before indexing can start

- The server's global initialization guard still only calls `vectorIndex.initializeDb()` for the memory index; it does not initialize the code-graph SQLite DB anywhere on the live tool-dispatch path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:358-366]
- `code_graph_scan` is still dispatched directly from `tools/code-graph-tools.ts` into `handleCodeGraphScan(...)` with no code-graph-specific setup step.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:35-40]
- Inside `handleCodeGraphScan(...)`, the first incremental stale check still calls `graphDb.isFileStale(...)` before any handler-local recovery or initialization path runs.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:47-53]
- `isFileStale(...)` still calls `getDb()`, and `getDb()` still throws `Code graph database not initialized. Call initDb() first.` when `initDb(...)` has not been run.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:82-85][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:171-177]
- The only current `initDb(...)` callsites in the reviewed source remain test-only crash-recovery coverage, not production handlers.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:881-909]
- I reproduced the live failure by calling the built `handleTool('code_graph_scan', {})` path in the `mcp_server` workspace; it threw the same `Code graph database not initialized` error before returning an MCP response.
- Impact: on a fresh runtime, the first real `code_graph_scan` invocation can fail before any graph file is indexed, making the code-graph feature family unusable until some out-of-band initializer runs.

## Verified Healthy / Narrowed Non-Findings

- `cleanupOrphans()` itself still works when called explicitly; the targeted crash-recovery test passes, so `F007` remains specifically a missing-callsite bug on the incremental scan path rather than a broken cleanup helper.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:282-297][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:925-973]
- The targeted `code-graph-indexer.vitest.ts` suite still passes, but it does not contradict `F005` or `F008` because its containment assertion is Python-only and its TypeScript coverage stops at top-level function/class/import extraction.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:77-145]

## Summary

- `F005`: **CONFIRMED**
- `F006`: **CONFIRMED**
- `F007`: **CONFIRMED**
- `F008`: **CONFIRMED**
- New correctness finding: **`F021` [P1]**
- Active severity delta this pass: `+0 P0`, `+1 P1`, `+0 P2`
- Recommended remediation order: fix the fresh-runtime DB initialization blocker first so `code_graph_scan` becomes operable, then repair JS/TS symbol-range + method extraction so `CALLS`, `CONTAINS`, and seed resolution all share trustworthy graph spans.

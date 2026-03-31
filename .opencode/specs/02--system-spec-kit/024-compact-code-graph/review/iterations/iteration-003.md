# Iteration 003: D1 Correctness

## Scope

- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts`

## Findings

No P0 issues found.

### [P1] Symbol ranges never extend beyond the declaration line, which breaks both `CALLS` extraction and enclosing-seed resolution
- **Files**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:41-47`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:57-59`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:67-79`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:171-191`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:282-313`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:172-225`; `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:146-150`; `.opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/spec.md:83-88`
- **Issue**: Every JS/TS capture is created with `endLine: lineNum`, and `capturesToNodes()` copies that one-line range into the stored `CodeNode`. `extractEdges()` then scans `contentLines.slice(caller.startLine - 1, caller.endLine)`, which means multi-line functions and classes only contribute their declaration line to `CALLS` detection. The same collapsed range also defeats the resolver's "enclosing symbol" fallback, because any CocoIndex hit inside a function body falls outside the stored symbol range and degrades straight to a file anchor.
- **Why it matters**: The code graph loses most real call edges for normal multi-line code, and `code_graph_context` cannot honor the documented `exact -> enclosing -> file anchor` resolution chain for snippets that land inside a function body.
- **Hunter**: The parser hard-codes one-line ranges at capture time, and both the call extractor and seed resolver trust those stored ranges as if they were full symbol spans.
- **Skeptic**: This would be harmless only if the implementation intentionally targeted single-line declarations, but both the plan and phase-010 spec explicitly rely on enclosing-symbol resolution for arbitrary line hits.
- **Referee**: `P1` is appropriate because this breaks the core correctness of the structural graph for ordinary multi-line functions and classes without needing unusual input.

### [P1] The public `code_graph_context` handler strips manual and graph seed identity, so 2 of the 3 advertised seed types never resolve
- **Files**: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:39-45`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:51-57`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:27-40`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:243-247`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:661-690`; `.opencode/specs/02--system-spec-kit/024-compact-code-graph/010-cocoindex-bridge-context/spec.md:209-216`
- **Issue**: `handleCodeGraphContext()` normalizes every incoming seed to a plain `{ filePath, startLine, endLine, query }` object. That conversion preserves CocoIndex `file/range`, but it discards `provider`, `symbolName`, and `symbolId`, so `resolveSeeds()` never sees a `ManualSeed` or `GraphSeed` at runtime. The resolver does have dedicated branches for those seed types, but the public handler makes them unreachable.
- **Why it matters**: The schema and spec both claim `code_graph_context` accepts `provider: manual` and `provider: graph`, yet those calls silently degrade into empty-path file anchors instead of resolving the requested symbol.
- **Hunter**: The handler is the only public entry point, and it erases exactly the discriminators that `resolveAnySeed()` needs to dispatch to `resolveManualSeed()` and `resolveGraphSeed()`.
- **Skeptic**: If every caller pre-normalized seeds internally this would not surface, but the tool schema explicitly exposes provider-typed seeds to external callers, so the handler has to preserve them.
- **Referee**: `P1` fits because the MCP surface is contractually advertising behavior that the live path cannot perform.

### [P1] Incremental re-indexing leaves stale inbound edges behind when a changed file deletes or renames symbols
- **Files**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:127-168`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:283-297`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:47-74`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:194-203`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:232-234`
- **Issue**: Re-indexing a file deletes and recreates that file's nodes, then deletes only edges whose `source_id` belongs to the newly indexed file. Any edges from unchanged files that still point at removed symbol IDs remain in `code_edges`. `cleanupOrphans()` can remove those rows, but the scan handler never calls it after updating the graph.
- **Why it matters**: After a rename or symbol removal, impact/neighborhood queries can return dead edge IDs or `null` endpoint nodes until another full cleanup happens. In incremental mode, that stale state persists indefinitely for unchanged callers/importers.
- **Hunter**: The DB layer explicitly lacks foreign keys on `code_edges`, so deleting nodes for a changed file does not repair inbound references automatically.
- **Skeptic**: One could argue a later full scan repairs this, but the default handler runs incrementally and reports success immediately, so callers see an inconsistent graph in the normal path.
- **Referee**: `P1` is warranted because the persisted graph can become internally inconsistent after ordinary edits, which directly corrupts query results.

### [P1] JavaScript and TypeScript methods are never indexed, so class containment and method-level graphing are missing in the primary languages
- **Files**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:38-104`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:210-223`; `.opencode/specs/02--system-spec-kit/024-compact-code-graph/008-structural-indexer/spec.md:36-39`; `.opencode/specs/02--system-spec-kit/024-compact-code-graph/008-structural-indexer/spec.md:47-63`; `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:137-145`
- **Issue**: `parseJsTs()` only emits nodes for top-level functions, const-assigned arrows, classes, interfaces, type aliases, enums, imports, and exports. There is no branch that recognizes `method` declarations inside JS/TS classes. `extractEdges()` can only create `CONTAINS` edges from `class -> method`, so those edges never exist for the two highest-priority languages.
- **Why it matters**: `outline` and `neighborhood` views omit class methods in JavaScript and TypeScript, and method-level call graphing is absent even though phase 008 defines methods as required node types.
- **Hunter**: The implementation has a hard dependency on `method` nodes for containment, but the JS/TS parser never produces that kind at all.
- **Skeptic**: Python does cover methods, and the current unit suite only exercises `CONTAINS` through Python, which can make the gap easy to miss.
- **Referee**: `P1` is justified because this is a primary-language feature omission, not an edge-case parser miss.

## Verification Notes

- Reviewed the four scoped code-graph library files line-by-line.
- Cross-checked phase specs and plan contracts for seed handling and structural vocabulary.
- Ran `TMPDIR=/Users/michelkerkmeester/MEGA/Development/Opencode\ Env/Public/.tmp/vitest-tmp npm run test:core -- --run tests/code-graph-indexer.vitest.ts` in `.opencode/skill/system-spec-kit/mcp_server` to confirm the current tests still pass despite these gaps.

## Summary

- P0: 0 findings
- P1: 4 findings
- P2: 0 findings

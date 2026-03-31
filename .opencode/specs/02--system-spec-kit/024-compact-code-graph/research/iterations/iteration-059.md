# Iteration 59: CocoIndex Utilization Improvements (Q16)

## Focus
Investigate how CocoIndex utilization can be improved across four dimensions: (1) automatic re-indexing triggers, (2) smarter seed resolution in seed-resolver.ts, (3) query routing between structural (code graph) and semantic (CocoIndex) search, and (4) hybrid query patterns combining both systems for better results.

## Findings

### 1. Seed Resolution Has Three Concrete Improvement Opportunities

The current `seed-resolver.ts` (268 lines) implements a 3-tier resolution chain: exact symbol match at line -> enclosing symbol (smallest range containing line) -> file anchor fallback. Analysis reveals three improvement opportunities:

**A. Fuzzy line matching is absent.** The exact match (`start_line = ?`) fails when CocoIndex chunk boundaries don't align perfectly with symbol start lines. CocoIndex's RecursiveSplitter uses 1000-char chunks with 150-char overlap, so chunk start lines often land mid-function rather than at the function declaration. A range-overlap query (`WHERE start_line <= ? AND end_line >= ?`) already exists as the "enclosing" fallback, but it's only tried after exact fails. A better approach: combine exact + near-exact (within N lines) before falling through to enclosing.

**Proposed improvement**: Add a "near-exact" resolution tier between exact and enclosing:
```sql
SELECT * FROM code_nodes
WHERE file_path = ? AND ABS(start_line - ?) <= 3
ORDER BY ABS(start_line - ?) ASC, kind != 'function'
LIMIT 1
```
This would match when CocoIndex reports line 45 but the function starts at line 43. Confidence: 0.95 (between exact's 1.0 and enclosing's 0.7).

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:168-240]

**B. Manual seed resolution lacks fuzzy name matching.** `resolveManualSeed()` does `WHERE name = ?` (exact string match). This fails for partial names, typos, or when the AI uses a slightly different name (e.g., "buildContext" vs "buildCodeContext"). Adding a `LIKE` fallback would improve manual seed hit rate significantly.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:83-128]

**C. No score propagation from CocoIndex.** `resolveCocoIndexSeed()` discards the CocoIndex similarity score entirely -- it converts to a bare `CodeGraphSeed` and delegates. The original CocoIndex score could inform the confidence value of the `ArtifactRef`, especially when combined with resolution quality. A seed with CocoIndex score 0.9 + enclosing resolution should have higher confidence than one with CocoIndex score 0.3 + enclosing resolution.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:74-79]

### 2. Automatic Re-Indexing: Three Trigger Points Identified

Currently, CocoIndex re-indexing is fully manual (`ccc index` CLI or `ccc_reindex` MCP tool). The daemon architecture supports background indexing, but no automatic triggers exist. Three trigger points are viable:

**A. On branch switch (git checkout/switch).** Branch switches are the highest-impact change event because they can modify hundreds of files at once. Detection approach: watch for `.git/HEAD` changes via file watcher, or intercept `git` commands via shell hooks. CocoIndex already handles file-level diffing during indexing, so a branch-switch trigger just needs to invoke `ccc index` (incremental). The code graph (`code_graph_scan`) already has incremental indexing via content hash -- coordinating both is the key challenge.

**B. On session start.** The CocoIndex SKILL.md already mandates "ALWAYS check index status before searching" and "suggest reindexing if codebase has changed significantly." This could be automated: during SessionStart hook (or equivalent), check `ccc status` and auto-trigger `ccc index` if stale. The daemon's auto-restart on version mismatch shows this pattern already exists partially.

**C. On file save (debounced).** Individual file saves are low-impact but frequent. A debounced trigger (e.g., 30 seconds after last save) would keep both indexes fresh. The code graph's `code_graph_scan` already supports incremental indexing with content hash checks, making individual file updates cheap. CocoIndex's daemon architecture supports background indexing and "search during indexing" (streams IndexWaitingNotice), so freshness wouldn't block searches.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/SKILL.md:267-306 (daemon architecture)]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:22-30 (content hash tracking)]

### 3. Query Intent Router Improvements

The current integration (from segment 5 research) designed a query-intent router with heuristic classification. Examining the actual code reveals the routing is purely implicit -- the AI decides which tool to call. Three improvements:

**A. Keyword-based pre-classification.** The CocoIndex SKILL.md already has intent signals with weighted scoring (SEARCH: weight 4, INDEX: weight 4, etc.). This pattern can be generalized to route between CocoIndex semantic search and code graph structural queries:

| Signal | Route to | Rationale |
|--------|----------|-----------|
| "who calls X", "callers of", "dependencies" | Code Graph (impact mode) | Structural relationship query |
| "find code that does X", "implementations of" | CocoIndex (search) | Semantic/intent query |
| "outline of", "what's in file" | Code Graph (outline mode) | File structure query |
| "how is X implemented" | Both (CocoIndex -> Code Graph) | Start semantic, expand structural |
| "imports", "exports", "module structure" | Code Graph (neighborhood) | Dependency graph query |

**B. Confidence-based fallback routing.** When CocoIndex returns low-similarity results (all below 0.3), automatically fall back to code graph structural search. When code graph returns file_anchor resolution (no symbol match), suggest CocoIndex semantic search for better results.

**C. Automatic dual-query for ambiguous intents.** When the router cannot confidently classify intent (scores within ambiguity delta), execute both searches in parallel and merge results. The compact-merger.ts already handles 3-source merging with deduplication.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/SKILL.md:68-96 (intent scoring pattern)]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:1-44 (merge infrastructure)]

### 4. Hybrid Query Patterns: CocoIndex Seeds into Code Graph Expansion

The current architecture already supports CocoIndex -> Code Graph bridging via `CocoIndexSeed` type in seed-resolver.ts. But the pattern is one-directional. Three hybrid patterns would improve results:

**A. Structural expansion of semantic results.** After CocoIndex finds semantically relevant code, automatically expand via code graph to include callers, callees, and imported modules. This is already supported via `code_graph_context` with `queryMode: 'neighborhood'`, but the AI must explicitly chain the calls. An integrated `hybrid_search` tool could automate: CocoIndex search -> resolve seeds -> expand neighborhood -> merge into single response.

**B. Semantic enrichment of structural results.** After code graph returns a call chain or dependency tree, use CocoIndex to find semantically similar code that isn't structurally connected. Example: after finding all callers of `resolveSeed()`, CocoIndex could find other resolution/lookup patterns in the codebase that use similar logic but aren't in the call graph.

**C. Working set warm-up.** On session start, use the code graph to identify the "hot" files from the last session (files with recent edits tracked via `code_files.indexed_at`), then use CocoIndex to pre-fetch semantically adjacent code. This creates a broader initial context than either system alone.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:48-118 (buildContext with seed resolution)]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:18-25 (CocoIndexSeed type)]

### 5. Underutilized CocoIndex Features

Analysis of the CocoIndex MCP skill reveals several capabilities not fully leveraged by the current integration:

**A. Language and path filters are not passed through.** The CocoIndex `search` tool accepts `languages` (list) and `paths` (list) filter parameters, but the seed-resolver and code-graph-context modules don't pass these through when initiating CocoIndex searches. Using code graph file metadata (language column in `code_nodes`) to auto-filter CocoIndex searches by relevant language would improve precision.

**B. `refresh_index` parameter management.** The skill documents a known concurrency issue: simultaneous `refresh_index=true` requests cause `ComponentContext` errors. The integration should track whether a refresh has occurred in the current session and automatically set `refresh_index=false` for subsequent calls. The `computeFreshness()` function in code-graph-context.ts already tracks staleness -- this could be extended to CocoIndex freshness.

**C. `ccc_feedback` tool is available but never called.** The Spec Kit Memory MCP exposes `ccc_feedback` for submitting search result quality feedback, but no code path automatically calls it. After the AI uses a CocoIndex result (e.g., reads the file, uses the finding), implicit positive feedback could be logged. This would build a quality signal over time.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/SKILL.md:236-242 (MCP tool parameters)]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:164-177 (computeFreshness)]

## Ruled Out

- **Real-time file watcher for CocoIndex re-indexing**: Too complex for the current architecture. The daemon already handles background indexing; adding another file watcher creates duplicate infrastructure and coordination complexity. Debounced session-level triggers are sufficient.
- **LSP integration for query routing**: Previously ruled out in strategy.md (exhausted approaches). LSP per-language server overhead makes this impractical.

## Dead Ends

None identified this iteration. All investigated approaches are viable improvement paths.

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts` (full file, 268 lines)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts` (full file, 330 lines)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts` (first 80 lines)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` (first 60 lines, schema)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/SKILL.md` (full file, 627 lines)

## Assessment
- New information ratio: 0.80
- Questions addressed: [Q16]
- Questions answered: [Q16 — substantially answered with 5 findings across 4 dimensions]

## Reflection
- What worked and why: Direct file analysis of both seed-resolver.ts and code-graph-context.ts alongside the CocoIndex SKILL.md revealed concrete improvement opportunities that wouldn't be visible from external documentation alone. The code shows exact gaps (missing near-exact matching, discarded CocoIndex scores, no auto-filter passthrough).
- What did not work and why: N/A -- all research avenues produced findings.
- What I would do differently: Would also examine the `ccc_reindex` and `ccc_status` handler implementations in the MCP server to understand what coordination primitives already exist for automatic re-indexing triggers.

## Recommended Next Focus
Consolidate Q13-Q16 findings into a unified feature improvement roadmap. Identify dependencies between improvements (e.g., seed resolution improvements enable better hybrid queries), prioritize by impact-to-effort ratio, and produce a phased implementation plan for Segment 6 synthesis.

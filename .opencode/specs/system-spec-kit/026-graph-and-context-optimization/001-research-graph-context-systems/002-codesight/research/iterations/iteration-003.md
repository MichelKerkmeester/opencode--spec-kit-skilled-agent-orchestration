# Iteration 3 - Dependency graph, blast radius, and MCP tool surface

## Summary
Codesight’s blast-radius feature is graph-backed at the core: it builds a reverse dependency walk from import edges and then projects that onto routes, middleware, and models. The route and middleware overlays are direct file-membership checks, but the model overlay is heuristic, because it marks all schemas as affected whenever an affected file owns a route tagged `db`, not when a specific schema usage edge is proven. The MCP surface is meaningfully more opinionated than “scan once and dump”: all 8 tools share a per-root cached `ScanResult`, and most tools transform detector output into assistant-friendly text summaries instead of returning raw arrays. That said, cache staleness is manual, and the server uses handwritten JSON-RPC over stdio rather than an MCP SDK.

## Files Read
- `external/src/detectors/graph.ts:1-238`
- `external/src/detectors/blast-radius.ts:1-128`
- `external/src/mcp-server.ts:1-534`
- `external/src/index.ts:1-220`
- `external/src/index.ts:332-536`
- `external/src/types.ts:1-200`

## Findings

### Finding 1 - Import graph is local-only with minimal alias normalization
- Source: `external/src/detectors/graph.ts:5-55`, `external/src/detectors/graph.ts:58-99`, `external/src/detectors/graph.ts:219-237`
- What it does: For TS/JS, Codesight scans each code file with regexes for `import/export ... from`, dynamic `import()`, and `require()`. It only keeps imports starting with `.` or the hard-coded aliases `@/` and `~/`, resolves relative imports against the current file, rewrites `@/` and `~/` to `src/`, strips emitted `.js/.mjs/.cjs`, then tries exact file, extension, and `index.*` matches against the project file set.
- Why it matters: This is lightweight and cheap, but it is not a build-accurate resolver for tsconfig path aliases, package exports, or node_modules. In `Code_Environment/Public`, this pattern is a good seed graph, but not enough if we want trustworthy cross-package or alias-heavy dependency analysis.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: dependency graph
- Risk/cost: medium. It is simple to port, but easy to over-trust in real monorepos or custom alias setups.

### Finding 2 - “Hot files” are ranked only by incoming import count
- Source: `external/src/detectors/graph.ts:49-55`, `external/src/types.ts:127-139`, `external/src/types.ts:156-159`
- What it does: Codesight increments `importCount` only when a file is imported, then sorts descending by that count and returns the top 20 as `hotFiles`. There is no degree centrality, no outgoing-edge weighting, and no use of the `hotFileThreshold` config type declared in `types.ts`.
- Why it matters: The implementation is closer to “most depended-on files” than “graph centrality.” If we reuse this idea in `Code_Environment/Public`, we should name it accordingly and avoid implying richer graph math than the code actually performs.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: dependency graph, hot file ranking
- Risk/cost: low. The heuristic is understandable, but the naming should stay honest.

### Finding 3 - Reverse-dependency BFS dedupes cycles, but the depth cap is off by one
- Source: `external/src/detectors/blast-radius.ts:7-18`, `external/src/detectors/blast-radius.ts:19-49`, `external/src/detectors/blast-radius.ts:77-84`
- What it does: The detector builds `importedBy` and `imports` maps from the graph, then runs BFS over `importedBy` so a changed file fans out to files that import it directly or transitively. Cycles are contained by the `affected` set, but dependents are added to `affected` before the queued node’s depth is checked, so nodes one hop beyond `maxDepth` can still appear in the final result.
- Why it matters: The traversal direction is right for change impact, but the current depth semantics are looser than advertised. If `Code_Environment/Public` adopts a similar BFS, depth enforcement should happen before adding descendants to the result set.
- Evidence type: source-confirmed
- Recommendation: reject
- Affected area: blast radius
- Risk/cost: medium. The algorithm is small, but incorrect depth reporting can mislead impact estimates.

### Finding 4 - Route and middleware overlays are direct; model impact is heuristic
- Source: `external/src/detectors/blast-radius.ts:54-75`, `external/src/detectors/blast-radius.ts:91-127`, `external/src/index.ts:493-527`
- What it does: Affected routes are any routes whose `file` is in the affected set, and affected middleware is any middleware entry whose `file` is affected. Affected models are inferred much more loosely: for each schema, the code checks whether any affected file owns a route tagged `db`, and if so it adds the schema name, regardless of whether that schema is referenced from that route or file.
- Why it matters: The route and middleware overlays are plausible projections from the graph, but the model layer is not provenance-backed. For `Code_Environment/Public`, this is a useful UX pattern only if schema impact is clearly labeled as heuristic or upgraded to a real usage graph.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: blast radius, schema impact
- Risk/cost: medium. The mixed-confidence output can create false confidence unless surfaced explicitly.

### Finding 5 - Multi-file blast radius is a unioned report, not a second traversal mode
- Source: `external/src/detectors/blast-radius.ts:91-127`
- What it does: Multi-file mode normalizes each input path, runs `analyzeBlastRadius()` once per file, unions affected files, dedupes routes by `path + method`, and dedupes models and middleware with sets. It removes the original input files from `affectedFiles` and reports the combined source list as a comma-joined `file` string.
- Why it matters: This is operationally simple and predictable, but it does not detect interactions between changed files beyond set union. In `Code_Environment/Public`, that may be enough for review-time change summaries, but not for deeper impact modeling.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: blast radius, multi-file reporting
- Risk/cost: low. The approach is easy to understand and cheap to compute.

### Finding 6 - The MCP server is cached, text-first, and manually speaks JSON-RPC over stdio
- Source: `external/src/mcp-server.ts:35-49`, `external/src/mcp-server.ts:51-85`, `external/src/mcp-server.ts:89-288`, `external/src/mcp-server.ts:292-398`, `external/src/mcp-server.ts:402-534`, `external/src/index.ts:366-370`
- What it does: All tools call `getScanResult()`, which caches one `ScanResult` per resolved root and reuses it until either the root changes or `codesight_refresh` clears the cache. The server exposes tools via `tools/list`, wraps every tool result as `content: [{ type: "text", text: ... }]`, hand-parses `Content-Length` framed JSON-RPC messages from stdin, and never checks mtimes or file hashes for automatic staleness detection.
- Why it matters: This is a useful assistant-facing pattern because it serves curated summaries rather than raw detector objects, but freshness is entirely caller-driven. In `Code_Environment/Public`, the interface design is worth borrowing; the cache invalidation and protocol handling probably need hardening.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: MCP tool design, cache lifecycle
- Risk/cost: medium. The UX is strong, but manual protocol and manual refresh increase maintenance risk.

## MCP Tool Inventory
| # | Tool name | Signature / params | One-line description | Cache reuse? |
|---|-----------|-------------------|----------------------|--------------|
| 1 | `codesight_scan` | `({ directory?: string })` | Full codebase scan returning the complete AI context map across routes, schema, components, libraries, config, middleware, and dependency graph. | yes |
| 2 | `codesight_get_summary` | `({ directory?: string })` | Compact project summary with stack, key stats, high-impact files, and required env vars. | yes |
| 3 | `codesight_get_routes` | `({ directory?: string, prefix?: string, tag?: string, method?: string })` | Returns API routes with methods, paths, params, tags, and handler files, with optional filtering. | yes |
| 4 | `codesight_get_schema` | `({ directory?: string, model?: string })` | Returns database models with fields, types, constraints, and relations, optionally filtered by model name. | yes |
| 5 | `codesight_get_blast_radius` | `({ directory?: string, file?: string, files?: string[], depth?: number })` | Returns transitively affected files, routes, models, and middleware for one file or a list of files. | yes |
| 6 | `codesight_get_env` | `({ directory?: string, required_only?: boolean })` | Returns environment variables across the codebase with required/default status and source file. | yes |
| 7 | `codesight_get_hot_files` | `({ directory?: string, limit?: number })` | Returns the most-imported files, presented as highest-blast-radius files. | yes |
| 8 | `codesight_refresh` | `({ directory?: string })` | Forces a re-scan so later tool calls use updated project context. | no |

## Blast-Radius Algorithm Notes
- Edge construction: The graph detector scans per file, filters to known code extensions, and emits `ImportEdge { from, to }` records. For TS/JS it only tracks local relative imports and the special aliases `@/` and `~/`, resolves relative paths from the importing file’s directory, rewrites the two aliases to `src/`, strips runtime `.js/.mjs/.cjs`, and then normalizes against known project files by exact match, extension match, or `index.*` match. Imports outside those patterns, including node modules and arbitrary path aliases, are ignored rather than represented as graph nodes.
- BFS direction & depth: Blast radius builds a reverse adjacency map (`importedBy`) and traverses outward from the changed file to files that depend on it, so the direction is “who breaks if this file changes,” not “what this file imports.” Cycle handling is via the `affected` set, which prevents repeated enqueues, but the current implementation can still include nodes one hop past `maxDepth` because it adds dependents before rejecting over-depth queue entries.
- Heuristic overlays: Route impact is direct file membership against the affected set, and middleware impact is the same. Model impact is heuristic: it does not trace schema usage through imports or symbol references; instead, if any affected file owns a route tagged `db`, all schemas are candidates for inclusion. Multi-file mode is also heuristic in the sense that it unions per-file results rather than computing a distinct combined traversal graph.

## Answered Questions
- Q6: answered - `graph.ts` shows regex-based per-file edge extraction, local-only normalization, and hot-file scoring by incoming import count only.
- Q7: answered - `blast-radius.ts` implements reverse-dependency BFS with cycle dedupe, heuristic overlays, and union-based multi-file reporting.
- Q9: answered - `mcp-server.ts` defines exactly 8 tools, all backed by a per-root cache and returned through text-wrapped raw JSON-RPC responses.

## Open Questions / Next Focus
- Inspect `external/src/generators/ai-config.ts` to compare profile-specific output differences for Codex, Claude Code, Cursor, Copilot, and Windsurf.
- Inspect `external/src/eval.ts` plus `external/eval/fixtures/*` to verify whether the benchmark claims are grounded in representative fixtures or mostly smoke-test quality.
- Verify whether any detector or formatter layer outside `graph.ts` enriches import edges with route/schema evidence that would make blast-radius less heuristic than it currently appears.

## Cross-Phase Awareness
This pass stayed inside phase `002-codesight` and only read the requested source files under `external/src/`, plus the related CLI entrypoint and type definitions needed to confirm contracts. I did not investigate phase-003/004 design work, implementation proposals, or any `Code_Environment/Public` runtime code beyond extracting implications for later adoption.

## Metrics
- newInfoRatio: 0.78
- findingsCount: 6
- focus: "iteration 3: graph + blast-radius + MCP tools"
- status: insight
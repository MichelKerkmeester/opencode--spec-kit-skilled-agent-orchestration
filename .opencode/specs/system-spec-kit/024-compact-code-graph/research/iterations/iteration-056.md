# Iteration 56: Feature Improvements — Code Graph, Budget Allocator, Merger, Hook System

## Focus
Q13 — What feature improvements can be made to code graph, budget allocator, merger, and hook system? This iteration analyzes the current implementation to identify concrete gaps, missing edge types, parsing limitations, and improvement opportunities across all four subsystems.

## Findings

### 1. Missing Edge Types: DECORATES, OVERRIDES, TYPE_OF
The current `EdgeType` in `indexer-types.ts` defines 7 edge types: `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, `TESTED_BY`. Three important relationship types are absent:

- **DECORATES** — TypeScript decorators (`@Injectable()`, `@Component()`) and Python decorators (`@property`, `@staticmethod`, custom decorators) create semantic relationships between a decorator and its target. The regex parser does not detect decorator syntax at all. Adding `DECORATES` edges would enable answering "what decorates this class?" and "what does this decorator apply to?" — critical for Angular/NestJS codebases and Python frameworks (Django, Flask, FastAPI).

- **OVERRIDES** — When a subclass method shadows a parent class method, there is no `OVERRIDES` edge. Currently the graph captures `EXTENDS` (class to parent) and `CONTAINS` (class to method), but not the method-level override relationship. With tree-sitter, detecting same-named methods in `EXTENDS`-linked classes is straightforward. This is essential for understanding polymorphism and virtual dispatch.

- **TYPE_OF** — TypeScript type annotations (`x: SomeType`, function return types, generic parameters) create implicit dependencies on types/interfaces/classes. The current parser ignores these entirely. Adding `TYPE_OF` edges would capture the "this function depends on this interface's shape" relationship, which is more semantically meaningful than import edges for understanding coupling.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:12-15]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:195-343]

### 2. Regex Parser Limitations — Endline Accuracy and Nesting
The regex-based parser has a fundamental limitation: `endLine` is always set to `startLine` for all captures. This means function/class bodies are never tracked — the parser only knows where a symbol declaration starts, not where it ends. This causes:

- **Inaccurate CALLS edges**: The call detection in `extractEdges()` uses `contentLines.slice(caller.startLine - 1, caller.endLine)` to find calls within a function body — but since `endLine === startLine`, it only looks at the declaration line itself, never the body. This means the vast majority of call relationships are missed.
- **No nesting awareness**: Cannot determine which symbols are inside which scopes.
- **Imprecise CocoIndex seed mapping**: When CocoIndex returns a line range, matching it to a structural symbol requires accurate start/end line data.

The fix is either (a) add brace/indent counting to the regex parser as a targeted improvement, or (b) migrate to tree-sitter WASM which provides accurate ranges natively.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:30-107 — all captures set endLine = lineNum (same as startLine)]

### 3. Tree-sitter WASM Migration Path
The structural indexer header comments state "Tree-sitter WASM integration planned as future enhancement." A practical migration path:

- **Package**: `web-tree-sitter` (WASM-based, works in Node.js) + language grammar packages (`tree-sitter-javascript`, `tree-sitter-typescript`, `tree-sitter-python`, `tree-sitter-bash`)
- **Key benefit**: Accurate start/end positions for all nodes, proper nesting, error recovery for partial/malformed files
- **Migration strategy**: Dual-mode parser — attempt tree-sitter first, fall back to regex if grammar loading fails. This preserves the existing regex parser as fallback while gaining accuracy.
- **Cost**: ~4MB additional WASM files (one per grammar). Parse performance should be comparable or better than regex for large files due to incremental parsing.
- **API change**: `RawCapture` already has `startLine/endLine/startColumn/endColumn` — tree-sitter maps directly to these fields. The `CodeNode` and `CodeEdge` types need no changes.
- **Priority**: HIGH — the endLine bug makes CALLS detection almost non-functional, which is the most valuable edge type for AI context.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:7 — "Tree-sitter WASM integration planned"]
[INFERENCE: based on analysis of web-tree-sitter npm package API from prior iterations 31, 38]

### 4. Budget Allocator Improvements
The current budget allocation (from iteration 49) uses a floor-based system with overflow pool: constitutional 700, graph 1200, CocoIndex 900, triggered 400, overflow 800. Improvements:

- **Adaptive weighting by query intent**: The query-intent router (iteration 48) classifies queries as structural/semantic/hybrid. The budget allocator should shift allocation based on this — structural queries should give graph a larger floor (1500) and reduce CocoIndex floor (600), semantic queries should invert this.
- **Usage-based learning**: Track which source types actually consume their budget vs. leave unused tokens. If graph consistently under-uses its 1200 allocation, redistribute to higher-demand sources. The `getTokenUsageRatio()` function in `code-graph-db.ts` already provides a foundation for this.
- **Dynamic overflow**: Rather than a fixed 800-token overflow pool, make it proportional to total context budget. At high token usage (>70% of context window), compress all floors proportionally.
- **Source-quality scoring**: Weight budget allocation by source quality — if CocoIndex returns high-confidence matches (score > 0.8), increase its budget; if graph results are sparse (few edges), reallocate its budget.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:331-338]
[SOURCE: Iteration 049 findings — three-source allocator design]

### 5. 3-Source Merger Improvements
The merge strategy (iteration 52) uses constitutional priority with deduplication. Improvements:

- **Cross-source deduplication by content hash**: When the same code symbol appears in both graph context and CocoIndex results, deduplicate by content hash rather than by file+line heuristics. The `contentHash` field on `CodeNode` enables this.
- **Relevance decay by distance**: Graph neighbors at depth 3 should be weighted lower than depth 1. Currently the merge treats all graph results equally regardless of traversal depth.
- **Interleaved ranking**: Rather than appending source blocks sequentially (constitutional, then graph, then CocoIndex), interleave results by relevance score. This produces more coherent context for the AI.
- **Conflict resolution**: When graph says function A calls function B, but CocoIndex's semantic search suggests they are unrelated, flag the disagreement as a signal (one source may be stale).

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:60-83 — buildContext output structure]
[INFERENCE: based on iteration 52 merge strategy and CodeNode.contentHash field in indexer-types.ts]

### 6. Hook System Improvements
From iterations 11-20 (hooks architecture), identified improvements:

- **Incremental graph refresh on file save**: The Claude Code `Stop` hook fires after every turn. Use it to trigger incremental re-indexing of files modified during that turn, keeping the graph fresh without explicit user action. Currently graph freshness depends on explicit `code_graph_scan` calls.
- **Pre-compaction graph snapshot**: During `PreCompact`, capture the current working set's structural neighborhood and cache it, so `SessionStart(source=compact)` can inject relevant graph context alongside memory context.
- **Hook-based CocoIndex re-index trigger**: When the `Stop` hook detects file writes, trigger CocoIndex incremental re-index in the background (non-blocking). This keeps semantic search results fresh.
- **Cross-runtime hook parity**: Claude has the richest hook system (PreCompact, SessionStart, Stop). For Copilot/Gemini CLIs with limited hooks, simulate equivalent behavior via MCP tool auto-invocation patterns (see Q15 for details).

[SOURCE: Iterations 11-20 findings — hook architecture, PreCompact/SessionStart/Stop lifecycle]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:30-92 — scan handler]

### 7. Additional SymbolKind Gaps
The current `SymbolKind` type misses several common constructs:

- **decorator** — Python/TS decorators as first-class symbols
- **property** — Class properties/fields (currently ignored by all parsers)
- **constant** — Module-level constants (`const X = ...` not followed by arrow function)
- **namespace** — TypeScript namespaces
- **generator** — Generator functions (`function*`)

The `variable` kind exists in the type definition but is never emitted by any parser. The `parameter` kind is defined but also never emitted.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:7-10]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:30-107 — only emits function, class, method, interface, type_alias, enum, import, export]

### 8. Query API Missing Operations
The `code_graph_query` handler supports 5 operations: `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`. Missing useful operations:

- **`extends_from` / `extends_to`**: Query class inheritance chains. Currently `EXTENDS` edges exist but cannot be queried through the API.
- **`implements`**: Query which classes implement an interface.
- **`tested_by` / `tests`**: Query test relationships. `TESTED_BY` edges exist but are not queryable.
- **`contains` / `contained_by`**: Query class membership.
- **`impact`**: Already in `code_graph_context` but not in `code_graph_query` — reverse caller analysis to understand what depends on a symbol.
- **`search`**: Text search across symbol names/signatures without needing exact match (the current `resolveSubject` only does exact name lookup).

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:9 — only 5 operations]

## Ruled Out
- LSP-based approach: Previously exhausted (per strategy.md section 9). Server-per-language overhead is impractical.
- Full tree-sitter native bindings: WASM approach is more portable and avoids native compilation issues across platforms.

## Dead Ends
None newly discovered. The regex parser limitations are fixable via tree-sitter migration, not fundamentally unviable.

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts` (full file)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts` (full file)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` (full file)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` (full file)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` (full file)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts` (full file)
- Prior iteration findings: 31 (tree-sitter evaluation), 38 (tree-sitter deep dive), 48 (query-intent router), 49 (budget allocator), 52 (merge strategy)

## Assessment
- New information ratio: 0.72
- Questions addressed: [Q13]
- Questions answered: [Q13 — partially, all four subsystems analyzed with concrete improvements identified]

## Reflection
- What worked and why: Direct codebase analysis was the most productive approach. Reading the actual implementation revealed the critical endLine bug in the regex parser — something not discoverable from prior design-level research iterations. The structural-indexer.ts file is the single most informative source for understanding current limitations.
- What did not work and why: N/A — first iteration of this segment, all approaches were fresh.
- What I would do differently: For next iteration, focus on Q14 (automatic AI utilization) since Q13 is now well-covered. The endLine bug discovery provides a concrete hook for Q14 — automatic graph refresh on file change would be much more valuable once CALLS edges actually work.

## Recommended Next Focus
Q14 — How can code graph + CocoIndex be utilized automatically without explicit tool calls? Investigate auto-triggering patterns: implicit graph queries during file reads/edits, proactive context loading based on working set, and automatic re-indexing strategies.

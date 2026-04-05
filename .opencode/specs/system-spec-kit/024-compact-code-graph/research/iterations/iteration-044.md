# Iteration 044: Code Graph MCP Tool API Design

## Focus

Design the public MCP API surface for adding code graph capabilities to the existing Spec Kit Memory MCP server, with emphasis on tool boundaries, structural query patterns, integration with current retrieval channels, LLM-friendly output formats, indexing strategy, monorepo support, error handling, and MVP scope.

## Findings

1. The right public surface is four tools, not one.

   The existing server already uses a layered shape: `memory_context` is the orchestration entry point, `memory_search` and `memory_match_triggers` are focused retrieval tools, and `memory_index_scan` / ingest tools handle maintenance. The code graph should mirror that mental model instead of introducing a one-off "do everything" endpoint. The recommended public surface is:

   - `code_graph_scan`: build, refresh, or repair the code graph index
   - `code_graph_query`: exact structural query for symbols, files, and edges
   - `code_graph_context`: LLM-oriented orchestration that turns a task or question into a compact graph neighborhood
   - `code_graph_status`: freshness, coverage, errors, and active-job visibility

   This fits the existing server taxonomy well: start-here orchestration at L1, focused query at L2/L3, and maintenance at L7. It also matches MCP's tool model, where each tool should expose a clear `inputSchema`, and structured results are best returned through `structuredContent` plus a text fallback. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:39-213`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:245-257`] [SOURCE: https://modelcontextprotocol.io/specification/2025-06-18/server/tools]

2. Query patterns should follow the proven LSP vocabulary, because those are already the structural questions coding assistants and IDEs need most.

   The user's example questions line up almost exactly with LSP/LSIF concepts:

   - "What does this function call?" -> outgoing call hierarchy
   - "What calls this function?" -> incoming call hierarchy
   - "What files does this file import?" -> import graph
   - "Show me the class hierarchy" -> type hierarchy
   - "What is the structure of this file?" -> document symbols / outline
   - "What are the entry points?" -> exported symbols plus package/module entry edges

   For AI assistants, the highest-value structural operations are:

   - `outline`
   - `symbols`
   - `entry_points`
   - `calls_from`
   - `calls_to`
   - `imports_from`
   - `imports_to`
   - `inherits_from`
   - `inherited_by`
   - `implements`
   - `implemented_by`
   - `definitions`
   - `references`
   - `dependency_path`

   LSP is strong evidence here because it already standardized `textDocument/documentSymbol`, `workspace/symbol`, `textDocument/implementation`, `callHierarchy/incomingCalls`, `callHierarchy/outgoingCalls`, `typeHierarchy/supertypes`, and `typeHierarchy/subtypes` as the core structural primitives. LSIF strengthens the same direction by modeling code understanding as a graph of documents, ranges, and project-scoped relationships. [SOURCE: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/] [SOURCE: https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/]

3. We should keep "direct code graph query" separate from "search channel integration" in the MVP.

   The current server's `graph` and `degree` lanes are causal-memory signals, not code-structure signals. That is visible in the live docs and code: the server advertises channels `vector`, `fts5`, `bm25`, `graph`, and `degree`, and `graph-search-fn.ts` is built around `causal_edges` and typed memory-degree scoring. Overloading the existing `graph` name to also mean call graphs, import graphs, and class hierarchies would create ambiguity in telemetry, ablation, explainability, and user expectations. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:245-257`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:204-275`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:23-71`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:4-58`]

   Recommendation:

   - MVP: keep code graph as a direct tool surface (`code_graph_query`, `code_graph_context`) plus orchestration-level fusion with memory
   - Future: add a sixth retrieval lane named `code_graph`, not `graph`, after we have a normalized result model for code artifacts
   - Future ablations should add `code_graph` beside the current `vector`, `bm25`, `fts5`, `graph`, and `trigger` set, not replace `graph`

   This also aligns with earlier packet research that said the clean-room approach should live inside the existing MCP architecture while remaining distinct from the current memory graph. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-010.md:12-18`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-010.md:26-53`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/memory/29-03-26_10-28__deep-research-evaluating-codex-cli-compact-dual.md:114-120`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/memory/29-03-26_10-28__deep-research-evaluating-codex-cli-compact-dual.md:180-202`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:345-353`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:245-281`]

4. The ideal output format is compact, typed, and graph-shaped, not a raw AST dump.

   MCP now explicitly supports `structuredContent` and `outputSchema`, and recommends also returning serialized JSON in a text block for backwards compatibility. That is exactly what a code graph tool should do. For LLM use, the output should contain just enough topology to reason, not the whole graph database. [SOURCE: https://modelcontextprotocol.io/specification/2025-06-18/server/tools]

   Recommended result shape for `code_graph_query`:

   ```json
   {
     "query": {
       "operation": "calls_to",
       "subject": { "kind": "symbol", "value": "handleMemoryContext" },
       "scope": { "workspaceRoot": "/repo", "language": ["typescript"] }
     },
     "freshness": {
       "state": "hot",
       "indexedAt": "2026-03-30T16:30:00Z",
       "stale": false,
       "partial": false
     },
     "summary": "3 callers found for handleMemoryContext across 2 files.",
     "focus": {
       "id": "sym:ts:/mcp_server/handlers/memory-context.ts#handleMemoryContext",
       "kind": "function",
       "name": "handleMemoryContext",
       "filePath": ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts",
       "range": { "startLine": 976, "startColumn": 1, "endLine": 1372, "endColumn": 2 }
     },
     "nodes": [
       {
         "id": "sym:...",
         "kind": "function",
         "name": "handleMemoryContext",
         "fqName": "memory-context.handleMemoryContext",
         "language": "typescript",
         "packageId": "system-spec-kit",
         "filePath": "...",
         "signature": "function handleMemoryContext(args: ContextArgs): Promise<MCPResponse>",
         "exported": false
       }
     ],
     "edges": [
       {
         "kind": "calls",
         "from": "sym:caller",
         "to": "sym:callee",
         "site": { "filePath": "...", "line": 328, "column": 7 },
         "confidence": 0.96
       }
     ],
     "relatedFiles": ["..."],
     "nextQueries": ["calls_from", "imports_to", "outline"],
     "warnings": []
   }
   ```

   Important design constraints:

   - stable node IDs
   - explicit `kind`, `filePath`, `range`, and `signature`
   - typed edge kinds (`calls`, `imports`, `inherits`, `implements`, `exports`, `tested_by`)
   - freshness metadata on every response
   - optional `warnings` instead of silently hiding partial results

   The output should also support profile-style compaction similar to the existing memory response profiles: `quick`, `research`, and `debug` are enough for the graph tools. The current memory formatters already prove that profile-specific reduction is useful for LLM consumption and token control. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:66-112`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:432-498`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:463-469`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:433-478`]

5. `code_graph_context` should combine graph context with memory context late, not by collapsing the two stores.

   The strongest design is:

   - keep memory as durable natural-language/project-decision context
   - keep code graph as structural code topology
   - combine them in an orchestration layer that knows the task intent

   This is consistent with the current server shape. `memory_context` is already the start-here tool for intent-aware retrieval, while the search subsystem remains multi-channel and profile-aware. The code graph should become a sibling structural provider that can be fused with memory when the task is code-centric. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:39-187`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:1515-1547`]

   Recommended orchestration behavior:

   - `memory_context` stays the canonical top-level retrieval API for the overall system
   - `code_graph_context` is called directly for code-structure questions or internally by `memory_context` when the prompt mentions files, symbols, stack traces, call chains, or refactor intent
   - merged output should keep separate sections:
     - `memoryContext`
     - `graphContext`
     - `combinedSummary`
     - `nextActions`

   Example fusion rules:

   - `find_decision`: memory dominates, graph only augments file/symbol references
   - `understand`: balanced mix of memory + outline + inbound/outbound edges
   - `fix_bug`: graph dominates around failing symbol, callers/callees/imports/tests; memory adds prior incidents or design rationale
   - `refactor`: graph dominates for impact analysis; memory adds architectural constraints

6. The MCP input schemas should be explicit, typed, and mostly operation-driven rather than free-form natural language.

   Recommended `code_graph_scan` input:

   ```ts
   interface CodeGraphScanArgs {
     workspaceRoot?: string;
     projectIds?: string[];
     packageIds?: string[];
     pathGlobs?: string[];
     languages?: string[];
     mode?: "background" | "foreground" | "if_stale";
     refresh?: "incremental" | "full";
     maxFiles?: number;
     followImports?: boolean;
     priority?: "interactive" | "background";
     waitForCompletion?: boolean;
   }
   ```

   Recommended `code_graph_query` input:

   ```ts
   interface CodeGraphQueryArgs {
     operation:
       | "outline"
       | "symbols"
       | "entry_points"
       | "calls_from"
       | "calls_to"
       | "imports_from"
       | "imports_to"
       | "inherits_from"
       | "inherited_by"
       | "implements"
       | "implemented_by"
       | "definitions"
       | "references"
       | "dependency_path";
     subject: {
       symbolId?: string;
       fqName?: string;
       name?: string;
       filePath?: string;
       position?: { line: number; column: number };
     };
     workspaceRoot?: string;
     projectId?: string;
     packageId?: string;
     pathGlobs?: string[];
     languages?: string[];
     direction?: "incoming" | "outgoing" | "both";
     depth?: number;
     limit?: number;
     includeSites?: boolean;
     includeSignatures?: boolean;
     includeBodySnippets?: boolean;
     includeTrace?: boolean;
     freshness?: "prefer_cached" | "if_stale" | "rebuild_scope";
     profile?: "quick" | "research" | "debug";
   }
   ```

   Recommended `code_graph_context` input:

   ```ts
   interface CodeGraphContextArgs {
     input: string;
     subject?: {
       symbolId?: string;
       fqName?: string;
       filePath?: string;
       position?: { line: number; column: number };
     };
     intent?: "understand" | "fix_bug" | "refactor" | "add_feature";
     workspaceRoot?: string;
     projectId?: string;
     packageId?: string;
     pathGlobs?: string[];
     languages?: string[];
     maxNodes?: number;
     maxEdges?: number;
     budgetTokens?: number;
     includeMemory?: boolean;
     includeOutline?: boolean;
     includeCallers?: boolean;
     includeCallees?: boolean;
     includeImports?: boolean;
     includeHierarchy?: boolean;
     includeEntryPoints?: boolean;
     includeTests?: boolean;
     includeTrace?: boolean;
     freshness?: "prefer_cached" | "if_stale" | "rebuild_scope";
     profile?: "quick" | "research" | "debug";
   }
   ```

   Recommended `code_graph_status` input:

   ```ts
   interface CodeGraphStatusArgs {
     workspaceRoot?: string;
     projectId?: string;
     packageId?: string;
     includeErrors?: boolean;
     includeJobs?: boolean;
     limitErrors?: number;
   }
   ```

   The key schema choice is that `code_graph_query` should be explicit and deterministic, while `code_graph_context` can accept natural language and perform orchestration. This mirrors `memory_search` versus `memory_context`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:39-213`] [SOURCE: https://modelcontextprotocol.io/specification/2025-06-18/server/tools]

7. Indexing should be hybrid: background-first for coverage, on-demand for freshness repair.

   A pure on-demand model will feel too slow for repeated graph questions, while a pure background-only model will expose stale data during active editing. Tree-sitter's incremental parsing model is a strong fit for "refresh one file or one scope cheaply," and recent indexing research in this packet already converged on a hybrid freshness model. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md`] [SOURCE: https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html]

   Recommended policy:

   - default: background incremental indexer
   - `code_graph_query` default freshness: `prefer_cached`
   - if data is stale and query scope is small: automatically use `if_stale`
   - if scope is broad or rebuild cost is high: return stale results with freshness metadata plus a warning unless the caller requested `rebuild_scope`

   This matches the packet's earlier incremental-update findings and respects the interactive UX constraint that graph queries should not routinely trigger a repo-wide rebuild. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md`]

8. Monorepo support should be first-class in the identifier model, not bolted on later.

   LSIF is useful here because it treats project context explicitly: a project vertex owns documents through `contains` edges. We should do the same in a repository-native form. [SOURCE: https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/]

   Recommended identity model:

   - `workspaceRoot`
   - `projectId`
   - `packageId`
   - `relativeFilePath`
   - `language`
   - `symbolId` or fully-qualified name

   Recommended graph partitions:

   - workspace-level graph
   - per-project graph
   - per-package graph
   - cross-package dependency edges

   Recommended monorepo features:

   - detect package roots from manifests and config files
   - support repeated symbol names across packages without collision
   - expose query scope controls for package and project
   - compute `entry_points` per package, not just per repo
   - keep generated/vendor directories excluded by default

   This is especially important for AI assistants because "what are the entry points?" often really means "what is the public surface of this package?" not "show me every export in the monorepo."

9. Error handling must distinguish invalid requests, partial graph results, and stale or missing index state.

   MCP already distinguishes protocol errors from tool execution errors. We should preserve that split. Invalid arguments, impossible combinations, or unknown operations should be schema/protocol failures. Runtime indexing or parsing failures should return tool results with `isError: true` or partial success plus warnings. [SOURCE: https://modelcontextprotocol.io/specification/2025-06-18/server/tools]

   Required error and warning cases:

   - unsupported language
   - file outside allowed roots
   - symbol not found
   - ambiguous symbol name
   - parse error in file
   - unresolved import or unknown callee target
   - stale index
   - no index yet for requested scope
   - graph job already running
   - query scope too broad for requested budget
   - partial graph because some files were skipped or failed

   Recommended response conventions:

   - `warnings[]` for partial but usable results
   - `freshness.partial = true` when some scope failed
   - `recoveryHints[]` when the user should run `code_graph_scan`
   - `isError: true` only when no meaningful response can be produced

10. The MVP should be intentionally narrow: JS/TS-first, structural navigation first, fusion later.

   MVP should include:

   - `code_graph_scan`
   - `code_graph_query`
   - `code_graph_context`
   - `code_graph_status`
   - JS/TS parsing first
   - file outline
   - entry points
   - outgoing calls
   - incoming calls
   - imports and reverse imports
   - basic class/interface hierarchy where available
   - freshness metadata
   - monorepo package scoping
   - orchestration-level fusion with memory context

   Future enhancements should include:

   - multi-language depth beyond JS/TS
   - full references/implementations across more languages
   - test-to-code edges
   - config/runtime wiring edges
   - graph-aware ranking inside the hybrid search pipeline
   - ablation support for a new `code_graph` channel
   - session-activity weighting from read/edit history
   - data-flow and control-flow analysis
   - graph diff queries between git revisions

   This aligns with the packet's prior recommendation to build a clean-room code graph channel using tree-sitter inside the existing architecture, but without forcing phase-one changes into the current memory search contracts too early. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-010.md:12-53`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:49-56`]

## Evidence

- Existing server tool layering and "start with memory_context" contract:
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/README.md`
- Current retrieval channels are memory-centric and already use `graph` / `degree` terminology:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts`
- Existing response-shaping patterns for LLM-friendly envelopes:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts`
- Prior packet direction:
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-010.md`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/memory/29-03-26_10-28__deep-research-evaluating-codex-cli-compact-dual.md`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md`
- External standards and product references:
  - MCP tools, `structuredContent`, and `outputSchema`: https://modelcontextprotocol.io/specification/2025-06-18/server/tools
  - LSP structural query families: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/
  - LSIF project/document graph modeling: https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/
  - Tree-sitter parser usage and incremental parsing model: https://tree-sitter.github.io/tree-sitter/using-parsers/2-basic-parsing.html
  - Sourcegraph Cody context selection and symbol-first UX: https://sourcegraph.com/docs/cody/clients/cody-with-sourcegraph

## New Information Ratio (0.0-1.0)

0.77

## Novelty Justification

This iteration adds new design work rather than restating earlier packet conclusions. Prior iterations established that we should build a clean-room code graph with tree-sitter inside the existing MCP architecture; this iteration specifies the actual public API surface, the operation taxonomy, the schema split between deterministic query and orchestration context, the late-fusion model with memory, the distinction between causal-memory `graph` and future `code_graph`, and the exact MVP boundary. The most important new information is the recommendation to treat code graph as a sibling structural provider first and only later as a sixth search lane, which preserves compatibility with the current memory result model and existing ablation/telemetry semantics.

## Recommendations for Our Implementation

1. Implement four public tools: `code_graph_scan`, `code_graph_query`, `code_graph_context`, and `code_graph_status`.
2. Keep `code_graph_query` explicit and operation-driven; keep natural-language orchestration in `code_graph_context`.
3. Do not overload the current `graph` lane name. Reserve a future sixth retrieval lane named `code_graph`.
4. Reuse the current MCP envelope style: `structuredContent` plus text fallback, optional profile reduction, freshness metadata, and trace/debug variants.
5. Start with JS/TS, package-aware IDs, and the six highest-value operations: `outline`, `entry_points`, `calls_from`, `calls_to`, `imports_from`, and `imports_to`.
6. Add hierarchy and implementation operations only where parser confidence is high enough to avoid noisy results.
7. Fuse graph context with memory late, and keep both visible in the response so callers can understand what came from topology versus prior decisions.
8. Make indexing hybrid: background incremental coverage with on-demand scoped refresh when callers explicitly request freshness.
9. Expose warnings and partial-state metadata instead of hiding parse failures, stale data, or skipped files.
10. Defer search-channel fusion, ablation, test-edge enrichment, and advanced multi-language semantics until the direct tool surface is stable and clearly useful.

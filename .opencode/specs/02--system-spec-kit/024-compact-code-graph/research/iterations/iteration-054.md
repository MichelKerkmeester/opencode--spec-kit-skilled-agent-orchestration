# Iteration 054: MCP Tool API - `code_graph_context` with CocoIndex Seeds

## Focus

Define the implementation-ready MCP contract for `code_graph_context` now that the packet has already converged on three constraints:

1. Code graph stays structural.
2. CocoIndex stays the semantic retrieval system of record.
3. The bridge point is `code_graph_context`, not `code_graph_query`.

This iteration answers the remaining API-level questions: the full parameter schema, how `seeds` should accept CocoIndex results, what the LLM-facing output should look like, how budget enforcement should work, and whether the query-mode surface should explicitly distinguish `neighborhood`, `outline`, and `impact`.

## Findings

1. `code_graph_context` should expose one orchestration-first schema with explicit `queryMode`, optional `subject`, and seed-native bridge inputs.

   The packet already established the split between deterministic graph queries and orchestration context: `code_graph_query` stays operation-driven, while `code_graph_context` accepts natural-language intent and performs seed resolution plus bounded expansion. What was still open was the final caller-facing schema. The cleanest answer is to keep the natural-language `input` field, retain `subject` for graph-native callers, and add two bridge surfaces:

   - `seeds[]` for pre-resolved external anchors
   - `queryMode` for projection style

   Recommended schema:

   ```ts
   interface CodeGraphContextArgs {
     input: string;
     queryMode?: 'neighborhood' | 'outline' | 'impact';
     intent?: 'understand' | 'fix_bug' | 'refactor' | 'add_feature';
     subject?: {
       symbolId?: string;
       fqName?: string;
       filePath?: string;
       position?: { line: number; column: number };
     };
     seeds?: CodeGraphSeed[];
     workspaceRoot?: string;
     projectId?: string;
     packageId?: string;
     pathGlobs?: string[];
     languages?: string[];
     maxSeeds?: number;
     maxNodes?: number;
     maxEdges?: number;
     budgetTokens?: number;
     includeOutline?: boolean;
     includeCallers?: boolean;
     includeCallees?: boolean;
     includeImports?: boolean;
     includeHierarchy?: boolean;
     includeEntryPoints?: boolean;
     includeTests?: boolean;
     includeSemanticAnalogs?: boolean;
     includeMemory?: boolean;
     includeTrace?: boolean;
     freshness?: 'prefer_cached' | 'if_stale' | 'rebuild_scope';
     profile?: 'quick' | 'research' | 'debug';
   }
   ```

   `queryMode` should be explicit instead of overloading `profile` or `intent`. `profile` controls output density, while `queryMode` controls graph-expansion behavior. `intent` still matters for weighting, but it is too broad to replace the actual structural mode requested by the caller. This is the missing separation between "what kind of graph package do you want?" and "why are you asking?".

2. `seeds[]` should accept raw CocoIndex MCP results directly, then normalize them internally to graph artifacts.

   The CocoIndex MCP contract already returns exactly the fields the bridge needs: `file`, `lines`, `snippet`, `score`, and `language`. That means `code_graph_context` should not force the caller to convert those results into a different symbol-only object just to call the next tool. The bridge should accept a discriminated union that includes the native CocoIndex response shape.

   Recommended seed types:

   ```ts
   type CodeGraphSeed = CocoIndexSeed | ManualSeed | GraphSeed;

   interface CocoIndexSeed {
     provider: 'cocoindex';
     file: string;
     lines: [number, number];
     snippet?: string;
     score?: number;
     language?: string;
   }

   interface ManualSeed {
     provider: 'manual';
     filePath: string;
     startLine: number;
     endLine: number;
     startColumn?: number;
     endColumn?: number;
     snippet?: string;
     relevance?: number;
     language?: string;
   }

   interface GraphSeed {
     provider: 'graph';
     symbolId?: string;
     fqName?: string;
     filePath?: string;
     startLine?: number;
     endLine?: number;
   }
   ```

   Internal normalization should convert all seed types into a shared `ArtifactRef` or equivalent internal anchor:

   ```ts
   interface ArtifactRef {
     workspaceRoot?: string;
     packageId?: string;
     filePath: string;
     startLine: number;
     endLine: number;
     symbolId?: string;
     fqName?: string;
     language?: string;
   }
   ```

   Resolution order should remain:

   - exact symbol overlap
   - enclosing symbol
   - nearest file-level outline node
   - raw file anchor

   That keeps the caller API ergonomic while preserving a single internal identity layer for dedupe, caching, telemetry, and traceability.

3. The LLM-facing output should be MCP `structuredContent` plus a compact path-first text fallback, with visibly separate semantic and structural sections.

   Earlier packet work already rejected raw AST dumps and raw edge dumps as the primary product. The best response is a typed envelope for tools plus a compact, scan-friendly projection for language models. That means `code_graph_context` should return structured data in sections that preserve provenance:

   ```json
   {
     "query": {
       "input": "how does authentication work",
       "queryMode": "neighborhood",
       "intent": "understand"
     },
     "semanticSeeds": [
       {
         "provider": "cocoindex",
         "file": "src/auth/middleware.ts",
         "lines": [10, 42],
         "score": 0.91,
         "language": "typescript"
       }
     ],
     "resolvedAnchors": [
       {
         "artifact": {
           "filePath": "src/auth/middleware.ts",
           "startLine": 12,
           "endLine": 40,
           "symbolId": "sym:ts:auth#AuthMiddleware.handle"
         },
         "resolution": "enclosing_symbol",
         "confidence": 0.94
       }
     ],
     "graphContext": {
       "roots": [],
       "nodes": [],
       "edges": [],
       "outline": [],
       "entryPoints": [],
       "tests": []
     },
     "semanticAnalogs": [],
     "combinedSummary": "AuthMiddleware.handle is the main request gate; it depends on TokenVerifier.verify and is exercised by auth.test.ts.",
     "nextActions": [
       "Inspect callers of AuthMiddleware.handle",
       "Open auth.test.ts for expected behaviors"
     ],
     "freshness": {
       "state": "hot",
       "partial": false
     },
     "warnings": []
   }
   ```

   The text fallback should not serialize the whole JSON. It should render a compact map-like brief:

   ```text
   Seed: src/auth/middleware.ts:10-42 (CocoIndex score 0.91)
   Root: AuthMiddleware.handle() [function]
   Called by: auth/routes.ts
   Uses: TokenVerifier.verify, SessionStore
   Tests: auth.test.ts
   Why included: top semantic hit + direct request boundary
   ```

   The key design rule is visible separation:

   - `semanticSeeds`: what CocoIndex found
   - `resolvedAnchors`: how those seeds mapped into graph subjects
   - `graphContext`: the structural neighborhood itself
   - `semanticAnalogs`: optional semantic expansion beyond the seed neighborhood
   - `combinedSummary` and `nextActions`: LLM-optimized synthesis

   This keeps late fusion inspectable and matches the repo's existing profile-formatter philosophy.

4. Budget enforcement should happen in two layers: graph-local shaping inside `code_graph_context`, then outer-envelope truncation at compaction/session surfaces.

   The packet already fixed the outer compaction ceiling at `4000` tokens and later proposed a three-source allocation profile where code graph gets about `1200` tokens inside that larger envelope. That implies `code_graph_context` should not try to own the whole compaction budget. Its job is to produce a compact structural package with an internal target, then let the outer caller decide final allocation.

   Recommended enforcement model:

   - direct tool default: `budgetTokens = 1200`
   - `outline` target: `800-1200`
   - `neighborhood` target: `1200-1800`
   - `impact` target: `1800-2500` when called directly
   - compaction caller: still pass `budgetTokens: 1200` unless a wider research/debug path explicitly overrides it

   Truncation order should be deterministic:

   1. drop second-hop neighbors
   2. drop sibling symbols
   3. drop semantic analogs
   4. drop tests when they are not direct evidence
   5. drop import-detail lines while preserving import presence

   Never drop all of these:

   - top seed
   - resolved root anchor
   - one boundary edge
   - one next action

   This matches the packet's broader rule of degrade, do not fail. The graph package should shrink gracefully instead of flipping from rich answer to empty error.

5. `queryMode` should be a first-class behavioral switch with exactly three v1 modes: `neighborhood`, `outline`, and `impact`.

   The packet already had most of this behavior scattered across earlier findings: `outline` as a high-value structural operation, one-hop compact neighborhoods as the default bridge behavior, and "impact analysis" as the one case where wider reverse expansion is justified. The missing step is to promote those behaviors into one explicit tool parameter.

   Recommended semantics:

   - `neighborhood`:
     Default mode. Resolve the best 1-3 anchors, include local outline, direct imports/exports, one-hop callers/callees, optional tests, and a compact summary. This is the right mode for "how does X work" and "help me understand this area".

   - `outline`:
     Structure-first mode. Return file/package outline, exported symbols, containment, and entry points, with minimal edge expansion. This is the fallback when there is no strong semantic seed or when the caller wants a repo-map-style orientation rather than adjacency reasoning.

   - `impact`:
     Reverse-expansion mode. Bias toward callers, reverse imports, entry points, tests, and boundary-facing nodes. Allow selective second-hop traversal if budget remains. This is the correct mode for "what breaks if I change this", "who depends on this", and refactor blast-radius analysis.

   Suggested per-mode defaults:

   | Mode | Default edges | Hop policy | Typical use |
   | --- | --- | --- | --- |
   | `outline` | `CONTAINS`, `EXPORTS`, `ENTRY_POINTS` | 0-1 hop | orientation, repo map, package surface |
   | `neighborhood` | `CALLS`, `IMPORTS`, `CONTAINS`, optional `TESTED_BY` | 1 hop | understand, debug, implementation lookup |
   | `impact` | reverse `CALLS`, reverse `IMPORTS`, `ENTRY_POINTS`, `TESTED_BY`, boundary edges | 1 hop default, 2 hop selective | refactor, blast radius, verification planning |

   This is simpler than overloading `expansion: minimal | balanced | impact`, because callers can reason in product language instead of tuning an internal expansion heuristic.

## Evidence

- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md`
  - established `code_graph_context` as the LLM-oriented orchestration tool and separated it from `code_graph_query`
  - proposed the first parameter surface with `input`, `subject`, graph toggles, `budgetTokens`, `freshness`, and `profile`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-046.md`
  - added the bridge contract with `seeds[]`, internal seed resolution order, late-fusion sections, and deterministic degradation rules
  - established one-hop default expansion and selective two-hop expansion for impact-style questions
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-048.md`
  - defined `impact_analysis`, `structural_navigation`, and mixed semantic-plus-structural routing as separate code-query behaviors
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-049.md`
  - established the fixed outer `4000` compaction envelope and the recommendation that code graph gets a bounded share rather than owning the whole budget
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-050.md`
  - clarified that LLM output should be path-first, compact, symbol-rich, and not a raw graph dump
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md`
  - explicitly states that `code_graph_context` should accept CocoIndex results as seeds for structural expansion
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md`
  - DR-010 locked the division of labor: CocoIndex for semantic retrieval, code graph for structural relationships
- `.opencode/skill/mcp-coco-index/references/tool_reference.md`
  - confirms CocoIndex MCP search returns `file`, `lines`, `snippet`, `score`, and `language`, which is the native seed shape the bridge should accept
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
  - shows current MCP tool-schema style: explicit JSON schema, strict `additionalProperties: false`, and separate orchestration vs focused retrieval tools
- `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts`
  - shows the established response philosophy: profile-driven shaping for LLM consumers
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
  - shows the existing envelope style with structured result payloads, trace metadata, and token-sensitive formatting

## New Information Ratio (0.0-1.0)

0.64

## Novelty Justification

Iterations 044, 046, 048, 049, and 050 already answered most of the architectural questions separately, but they stopped short of one implementation-ready MCP contract for `code_graph_context`. This iteration's new value is the convergence step:

- it promotes `queryMode` into a first-class parameter instead of leaving mode behavior implicit
- it closes the last bridge gap by letting `seeds[]` accept native CocoIndex MCP result objects directly
- it separates output-shaping concerns cleanly across `queryMode`, `intent`, `profile`, and `budgetTokens`
- it turns scattered budget notes into a concrete two-layer enforcement rule for direct tool calls vs outer compaction envelopes

So this is not a first-discovery pass. It is the missing API-spec pass that makes the earlier research implementable without further schema debate.

## Recommendations

1. Implement `code_graph_context` with `queryMode: 'neighborhood' | 'outline' | 'impact'` instead of overloading `profile` or `intent`.
2. Accept native CocoIndex MCP search hits in `seeds[]` with `provider: 'cocoindex'`, `file`, `lines`, `snippet`, `score`, and `language`.
3. Normalize all seed variants internally into one `ArtifactRef` layer before ranking, expansion, dedupe, or tracing.
4. Keep `subject` for deterministic graph-native callers, but do not require it for CocoIndex-seeded flows.
5. Return `structuredContent` with visibly separate `semanticSeeds`, `resolvedAnchors`, `graphContext`, `semanticAnalogs`, `combinedSummary`, and `nextActions` sections.
6. Render the text fallback as a compact repo-map-style brief, not a raw JSON dump.
7. Default direct tool calls to about `1200` tokens, and let compaction/session callers allocate that tool inside their larger outer envelope.
8. Make truncation deterministic and mode-aware, always preserving the main seed, resolved root, one key edge, and one next action.
9. Use `outline` as the no-strong-anchor fallback, `neighborhood` as the general default, and `impact` for reverse-dependency or blast-radius questions.
10. Treat this tool as the bridge surface only; keep exact graph operations in `code_graph_query` and keep semantic retrieval ownership in CocoIndex.

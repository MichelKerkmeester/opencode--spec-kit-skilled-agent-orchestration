# Iteration 046: CocoIndex ↔ Code Graph Bridge Design

## Focus

Define the bridge contract between CocoIndex semantic retrieval and the planned structural code graph so the two systems can enrich each other bidirectionally without collapsing into one store. This iteration answers the open design questions left by DR-010: seed shape, expansion behavior, reverse enrichment, end-to-end flow, merge strategy, failure handling, and latency budget for `PreCompact`.

## Findings

1. `code_graph_context` should accept direct file-range seeds, not only symbol IDs.

   The bridge should accept CocoIndex hits in their native shape because DR-010 explicitly says CocoIndex remains the semantic system of record while code graph remains structural. CocoIndex already returns `file path + line range + snippet + relevance + language`; forcing an intermediate symbol-resolution tool would add latency, duplicate work, and make the bridge awkward at the exact point where the two systems meet. Our own MCP conventions also already distinguish deterministic low-level tools from higher-level orchestration tools, so `code_graph_context` is the right place to accept richer seed shapes and normalize them internally. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:94-105`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:40-46`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:154-264`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:39-43`]

   Recommended bridge contract:

   ```ts
   interface CodeGraphSeed {
     provider: 'cocoindex' | 'manual' | 'graph';
     filePath: string;
     startLine: number;
     endLine: number;
     startColumn?: number;
     endColumn?: number;
     language?: string;
     relevance?: number;
     snippet?: string;
     symbolIdHint?: string;
   }

   interface SemanticAugmentArgs {
     enabled?: boolean;
     query?: string;
     limit?: number;
     pathGlobs?: string[];
     minRelevance?: number;
   }

   interface CodeGraphContextArgs {
     input: string;
     intent?: 'understand' | 'fix_bug' | 'refactor' | 'add_feature';
     subject?: {
       symbolId?: string;
       fqName?: string;
       filePath?: string;
       position?: { line: number; column: number };
     };
     seeds?: CodeGraphSeed[];
     expansion?: 'minimal' | 'balanced' | 'impact';
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
     semanticAugment?: SemanticAugmentArgs;
     freshness?: 'prefer_cached' | 'if_stale' | 'rebuild_scope';
     profile?: 'quick' | 'research' | 'debug';
   }
   ```

   `subject` should stay for deterministic graph-native callers; `seeds[]` should be added for bridge callers. Internally, resolution order should be: exact symbol overlap -> enclosing symbol -> nearest file-level outline node -> raw file anchor. This resolution policy is an implementation inference from our current tool split and from Continue/Cody/Aider favoring explicit file, symbol, and repo context as first-class context handles rather than forcing a single canonical identity up front. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:131-175`] [SOURCE: https://docs.continue.dev/customize/custom-providers] [SOURCE: https://sourcegraph.com/docs/cody] [SOURCE: https://aider.chat/docs/usage.html]

2. Structural expansion should be layered, intent-aware, and capped by usefulness, not graph completeness.

   Given a CocoIndex hit at `file X lines 10-30`, the most useful expansion is not "walk everything within two hops." The useful order is:

   Tier 0: resolve the hit to the enclosing symbol and include the exact matched lines.

   Tier 1: include the containing file outline, direct imports/exports, and a small number of same-file sibling symbols so the model can place the hit in local structure.

   Tier 2: include one-hop outgoing callees and incoming callers for the resolved symbol. For `understand`, balance both directions. For `fix_bug`, bias toward callers and tests. For `refactor`, bias toward reverse imports, public entry points, and fan-out.

   Tier 3: include tests, entry points, and config/runtime edges when the symbol is exported, attached to framework registration, or near an application boundary.

   Tier 4: only if budget remains, add second-hop graph neighbors for the top one or two most central nodes.

   This matches the packet's existing "store rich, serve compact" direction, the iteration-045 compaction ranker, and the earlier API design that prioritized calls, imports, hierarchy, entry points, and tests as the high-value MVP edges. It also aligns with Aider's repo-map pattern: compact structural orientation first, full bodies only on demand. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:137-152`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:177-205`] [SOURCE: https://aider.chat/docs/usage.html] [SOURCE: https://docs.continue.dev/customize/deep-dives/custom-providers]

   The practical answer to question 2 is therefore:

   First expand `enclosing symbol + local outline + direct imports/exports + 1-hop callers/callees + linked tests`.

   Only include siblings when they clarify the file's role.

   Only include second-hop neighbors when the first-hop graph is sparse or the task is explicit impact analysis.

3. Reverse enrichment should use graph neighborhoods to generate scoped semantic queries, not simply re-run CocoIndex on the original prompt.

   Once the graph returns a compact neighborhood, the bridge should synthesize a semantic query from:

   the original user question,

   the top resolved symbols and signatures,

   the dominant edge types in the neighborhood,

   and the path/package scope implied by the graph.

   Example: if the graph neighborhood around `AuthMiddleware.handle()` includes `TokenVerifier.verify`, `SessionStore`, `auth/routes.ts`, and `auth.test.ts`, the semantic enrichment query should be closer to `authentication token verification session middleware route guard` with `pathGlobs` narrowed to auth-related packages and explicit exclusion of already-selected file ranges. This is better than reusing `how does authentication work` because the graph has already told us which vocabulary and scopes matter in this repository.

   Recommended reverse direction:

   `code_graph_context` emits `semanticAugment.query`, `semanticAugment.pathGlobs`, and `semanticAugment.excludeRanges`.

   CocoIndex returns 2-5 semantically similar but structurally distinct snippets.

   The merger boosts diversity over overlap: prefer similar patterns from other packages, analogous tests, alternate entry points, or parallel implementations.

   This is partly an inference, but it is strongly supported by Continue's separation between codebase snippets, search, and repository maps, plus its explicit reranking guidance of retrieving a larger pool and then narrowing it; the same pattern applies here, except the graph gives us a much better scoped query than the raw user prompt alone. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:139-175`] [SOURCE: https://docs.continue.dev/customize/custom-providers] [SOURCE: https://docs.continue.dev/guides/custom-code-rag]

4. The full combined flow for `how does authentication work` should be hybrid and staged.

   Recommended data flow:

   1. Parse the prompt for explicit anchors: current file, highlighted symbol, recent edits, stack trace tokens, or package hints.

   2. Launch two fast first-pass retrievals in parallel:
   `mcp__cocoindex_code__search("how does authentication work", limit=5)` and a graph bootstrap over explicit anchors or current working-set files.

   3. Normalize CocoIndex hits into `CodeGraphSeed[]`.

   4. Resolve each seed to graph subjects:
   exact symbol if possible, else enclosing symbol, else file anchor.

   5. Build a compact structural neighborhood around the best 1-3 resolved seeds:
   local outline, imports, callers, callees, entry points, tests.

   6. Score the neighborhood:
   `bridgeScore = semanticRelevance + graphCentrality + exportBoundary + testCoupling + recency`.

   7. If the neighborhood is thin or overly local, synthesize a scoped semantic augmentation query from the neighborhood and ask CocoIndex for 2-5 analogs outside the already-covered ranges.

   8. Merge into a profile-shaped response with separate sections:
   `semanticSeeds`, `graphContext`, `semanticAnalogs`, `combinedSummary`, `nextActions`.

   9. If this is `PreCompact`, project the merged result into the smaller compaction brief rather than returning raw nodes and snippets.

   This staged flow preserves the packet's existing late-fusion architecture and keeps hooks as transport rather than business logic. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:48-81`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:127-145`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:139-175`]

5. The bridge should be parallel for first-pass recall, then sequential for cross-expansion and late fusion.

   A purely sequential design (`CocoIndex -> graph -> done`) is too dependent on semantic hits being immediately correct and wastes cheap structural cues we may already have from the current file or active working set. A purely parallel design (`query both and merge blindly`) misses the actual bridge value because the second system never gets to use the first system's output as a focused seed.

   The optimal execution model is:

   Stage A, parallel: run semantic retrieval and cheap graph bootstrap at the same time.

   Stage B, sequential: use CocoIndex hits to drive structural expansion and use graph neighborhoods to drive semantic augmentation.

   Stage C, late fusion: merge both channels into a profile-specific response.

   This recommendation follows directly from our packet architecture, which already treats structural, semantic, and session context as sibling channels fused late, and it matches the broader vendor pattern of separate context providers or context sources rather than one opaque retriever. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:139-209`] [SOURCE: https://docs.continue.dev/customize/custom-providers] [SOURCE: https://sourcegraph.com/docs/cody]

6. Other tools converge on the same high-level pattern: separate semantic retrieval, structural summaries, and working-state context, then merge them.

   Sourcegraph Cody says it uses Sourcegraph's Search API to pull context about APIs, symbols, and usage patterns, defaults to open-file and repository context, and lets the user add `@` context for files, symbols, and repositories. That is not our exact bridge, but it is very close to "semantic/search-backed retrieval plus explicit structural anchors." [SOURCE: https://sourcegraph.com/docs/cody]

   Continue separates `@Codebase` for relevant snippets, `@Search` for text search results, `@Repository Map` for outline-plus-signatures, `@Code` for functions/classes, and `@Git Diff` for working-set changes. This is the clearest public example of provider separation plus late fusion. [SOURCE: https://docs.continue.dev/customize/custom-providers] [SOURCE: https://docs.continue.dev/customize/deep-dives/custom-providers]

   Aider shows a compact structural lane with an explicit token budget: the repo map is present in normal usage and the example session shows `Repo-map: using 1024 tokens`; Aider also says it will pull related files from the rest of the repo automatically. That strongly supports our plan to keep structural expansion compact and bounded. [SOURCE: https://aider.chat/docs/usage.html]

   Cursor's public docs emphasize codebase indexing with embeddings, recent changes as separate context, and `@` references for files, folders, code, docs, and recent changes. The public docs do not expose the full ranking algorithm, so the bridge detail is an inference, but the documented product shape still points in the same direction: embeddings + explicit references + working-set freshness signals. [SOURCE: https://docs.cursor.com/zh-Hant/context/codebase-indexing] [SOURCE: https://docs.cursor.com/zh-Hant/context/%40-symbols/%40-recent-changes] [SOURCE: https://docs.cursor.com/zh-Hant/context/%40-symbols/overview] [SOURCE: https://docs.cursor.com/context/%40-symbols/%40-files]

   The strongest synthesis is that no public tool appears to collapse everything into one retrieval index. The winning pattern is layered retrieval, which is exactly what DR-010 already set up for us. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:94-105`] [SOURCE: https://www.microsoft.com/en-us/research/publication/graphcodebert-pre-training-code-representations-with-data-flow/]

7. The main failure modes are predictable, and each one should degrade to a smaller but still useful answer.

   Failure mode: CocoIndex returns irrelevant hits.
   Mitigation: require at least one anchor overlap with prompt vocabulary, package scope, or graph-resolved symbol names before treating a hit as a structural seed; otherwise fall back to graph bootstrap from current file or working set.

   Failure mode: graph index is stale or missing for the seed file.
   Mitigation: return the CocoIndex snippet plus file outline fallback, mark `freshness.partial = true`, and optionally refresh the graph only for the affected file or package. This matches the packet's hybrid freshness model rather than forcing a repo-wide rebuild. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:266-270`] [SOURCE: https://docs.continue.dev/guides/custom-code-rag]

   Failure mode: one system is unavailable.
   Mitigation: preserve a single-system response with a warning section. If CocoIndex is down, graph-only context should still work for explicit files/symbols. If graph is down, semantic hits should still return raw snippets and file anchors without pretending to have structural validation.

   Failure mode: seed range maps ambiguously to multiple symbols.
   Mitigation: keep all candidates with a confidence score, prefer the narrowest enclosing symbol, and expose `warnings[]` rather than silently picking the first.

   Failure mode: graph explosion on utility code.
   Mitigation: cap callers/callees per node, penalize globally central utilities, and stop after one hop unless intent is `impact`.

   Failure mode: duplicate evidence from both systems.
   Mitigation: dedupe by file range overlap and keep one canonical representation per artifact.

   Failure mode: token budget overrun in `PreCompact`.
   Mitigation: always drop in this order: second-hop neighbors -> sibling symbols -> semantic analogs -> tests -> import details, while preserving the top anchor, one boundary edge, and one recommended next action.

   The general design rule is degrade, do not fail: produce the best partial answer available and say which layer was missing. That is consistent with the packet's broader compaction strategy. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:177-205`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:6-21`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86-110`]

8. With a 2-second `PreCompact` budget, the bridge must behave like a fast working-set augmenter, not a full multi-hop retrieval pipeline.

   Recommended warm-cache latency budget:

   50-75 ms: query parsing, seed extraction, and cache lookup.

   450-700 ms: CocoIndex semantic search, hard-capped at 800 ms.

   250-450 ms: graph seed resolution plus one-hop structural expansion, hard-capped at 500 ms.

   250-350 ms: optional reverse semantic augmentation, but only if at least 400 ms remain.

   150-250 ms: merge, rerank, profile formatting, and compaction projection.

   150-250 ms: slack for transport jitter and partial fallback.

   Total target: 1.3-1.8 s warm, 2.0 s hard cap.

   If time exceeds the cap, the bridge should skip reverse semantic augmentation first, then collapse to `semanticSeeds + graphContext` only. Aider's explicit 1024-token repo-map example, Continue's rerank guidance of retrieving a larger pool and then trimming, and our own compaction brief design all support small, ranked context packages instead of "retrieve everything and hope." [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:177-205`] [SOURCE: https://aider.chat/docs/usage.html] [SOURCE: https://docs.continue.dev/guides/custom-code-rag]

9. The bridge needs one normalized artifact identity layer so semantic hits and graph nodes can refer to the same thing.

   This was not spelled out in earlier iterations, but it is the glue that makes the bridge cheap and debuggable. The bridge should normalize everything into an `ArtifactRef`:

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

   CocoIndex hits become `ArtifactRef` plus semantic metadata.

   Graph nodes become `ArtifactRef` plus structural metadata.

   Merge, dedupe, caching, telemetry, and explanation all key off `ArtifactRef`.

   This follows the same general direction as LSIF-style project/document/range identities and our own planned graph response model with stable node IDs, typed edges, and freshness metadata. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:83-125`] [SOURCE: https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/]

## Evidence

- Local packet architecture and DR-010 separation:
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:94-105`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/spec.md:40-46`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:127-270`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:131-209`

- Current MCP orchestration and profile conventions:
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:39-43`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:6-21`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86-110`

- External URLs used:
  - https://sourcegraph.com/docs/cody
  - https://aider.chat/docs/usage.html
  - https://docs.continue.dev/customize/custom-providers
  - https://docs.continue.dev/customize/deep-dives/custom-providers
  - https://docs.continue.dev/guides/custom-code-rag
  - https://docs.cursor.com/zh-Hant/context/codebase-indexing
  - https://docs.cursor.com/zh-Hant/context/%40-symbols/%40-recent-changes
  - https://docs.cursor.com/zh-Hant/context/%40-symbols/overview
  - https://docs.cursor.com/context/%40-symbols/%40-files
  - https://www.microsoft.com/en-us/research/publication/graphcodebert-pre-training-code-representations-with-data-flow/
  - https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/

## New Information Ratio (0.0-1.0)

0.74

## Novelty Justification

Iterations 036-045 established the separation between semantic and structural retrieval, the code-graph API shape, and the compaction-oriented late-fusion architecture. What they did not settle was the bridge itself: exactly what `code_graph_context` should accept from CocoIndex, how graph expansion should be budgeted around a semantic seed, how structural neighborhoods should generate semantic enrichment in the reverse direction, and how to make all of that fit a 2-second `PreCompact` window. This iteration adds those missing contracts and execution rules. The most novel points are the direct `seeds[]` contract, the staged parallel-then-sequential execution model, the reverse semantic augmentation design, the explicit failure degradations, and the concrete latency split.

## Recommendations for Our Implementation

1. Add `seeds?: CodeGraphSeed[]` to `code_graph_context` and treat file-range seeds as the primary CocoIndex bridge surface.
2. Keep `code_graph_query` deterministic and symbol-oriented; keep bridge orchestration inside `code_graph_context`.
3. Resolve seeds internally with fallback order: exact symbol -> enclosing symbol -> file anchor.
4. Make one-hop expansion the default and reserve two-hop expansion for sparse neighborhoods or explicit impact-analysis intents.
5. Always include tests and entry points when the seed touches exported or boundary-facing code.
6. Add reverse semantic augmentation only after graph expansion, and scope it with graph-derived paths plus symbol vocabulary.
7. Merge channels late and keep them visibly separate in the response: `semanticSeeds`, `graphContext`, `semanticAnalogs`, `combinedSummary`, `nextActions`.
8. Introduce a shared `ArtifactRef` identity layer for dedupe, caching, telemetry, and explainability.
9. Treat missing or stale graph data as a warning path, not a hard failure; refresh only the affected scope.
10. Budget the bridge for `PreCompact` as a fast augmenter: semantic search first-pass, one-hop graph expansion, optional semantic backfill only if time remains.

Code-level verification completed for all 9 retrieval-enhancement catalog entries.

I verified:
- Every `mcp_server/*.ts` path referenced in each entry (implementation + tests)
- Documented function signatures
- Documented defaults/flags
- Behavioral claims vs code
- Additional implementing files not listed in each catalog entry

I also reviewed prior audit findings at:
`specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/015-retrieval-enhancements/implementation-summary.md:38` and `:89`.

## Per-feature verification

### 01. Dual-scope memory auto-surface
- Files: all catalog-referenced `mcp_server` files exist (`...:1` for each; full list in Appendix).
- Functions: present:
  - `extractContextHint(args: Record<string, unknown> | null | undefined): string | null` at `mcp_server/hooks/memory-surface.ts:67`
  - `autoSurfaceMemories(contextHint: string, tokenBudget = 4000, hookName = 'memory-aware')` at `.../memory-surface.ts:188`
  - `autoSurfaceAtToolDispatch(toolName: string, toolArgs: Record<string, unknown>, options?)` at `.../memory-surface.ts:254`
  - `autoSurfaceAtCompaction(sessionContext: string, options?)` at `.../memory-surface.ts:300`
- Defaults/flags: no dedicated env flag; hook options default enabled (only disabled on explicit `false`) at `.../memory-surface.ts:260` and `:305`; token budgets are 4000/4000 at `:53-55`.
- Behavior: matches catalog (context fields + concepts, memory-aware skip, pre-dispatch handling in context server) at `.../memory-surface.ts:70-80`, `:264-266`, `.../context-server.ts:291-308`.
- Unreferenced implementing files not in catalog: none required for runtime behavior.
- Verdict: **MATCH**

### 02. Constitutional memory as expert knowledge injection
- Files: referenced files exist.
- Functions: present:
  - `extractRetrievalDirective(...)` at `mcp_server/lib/search/retrieval-directives.ts:210`
  - `enrichWithRetrievalDirectives(results)` at `.../retrieval-directives.ts:323`
- Defaults/flags: no feature flag; deterministic extraction limits match:
  - scan cap 2000 chars at `.../retrieval-directives.ts:86`
  - component cap 120 chars at `:89`
- Behavior: enrichment is map-only/no reorder (`results.map`) at `:326`; wiring into hook at `mcp_server/hooks/memory-surface.ts:211`.
- Unreferenced implementing files: `mcp_server/hooks/memory-surface.ts:211` (integration point is not listed in this feature entry).
- Verdict: **PARTIAL**

### 03. Spec folder hierarchy as retrieval structure
- Files: referenced files exist.
- Functions: present:
  - `buildHierarchyTree(database)` at `mcp_server/lib/search/spec-folder-hierarchy.ts:78`
  - `queryHierarchyMemories(database, specFolder, limit=50)` at `:261`
  - `invalidateHierarchyCache(database)` at `:42`
- Defaults/flags: no feature flag (always active path).
- Behavior: two-pass build + implicit parent creation at `:95-103` and `:147-151`; relevance weights/floor at `:271-279` and `:297`; WeakMap TTL cache 60s at `:26` and `:35`.
- Unreferenced implementing files: `mcp_server/lib/search/graph-search-fn.ts:8` and `:92` (actual retrieval channel integration).
- Verdict: **PARTIAL**

### 04. Lightweight consolidation
- Files: referenced files exist.
- Functions: present:
  - `hasNegationConflict(textA, textB)` at `mcp_server/lib/storage/consolidation.ts:240`
  - `runConsolidationCycleIfEnabled(database)` at `:480`
- Defaults/flags: `SPECKIT_CONSOLIDATION` default-on via `isConsolidationEnabled()` at `mcp_server/lib/search/search-flags.ts:123`, backed by default-on policy at `mcp_server/lib/cognitive/rollout-policy.ts:53-63`.
- Behavior: threshold 0.85 at `.../consolidation.ts:64`; vector+heuristic dual mode at `:96-102`; cluster expansion (1-hop) at `:297-304`; Hebbian +0.05 / decay 0.1 / 30-day at `mcp_server/lib/storage/causal-edges.ts:45-48` and applied in `.../consolidation.ts:353`, `:376`; stale edges 90+ days at `.../consolidation.ts:396-400`; max 20 edges at `.../causal-edges.ts:43`; weekly cadence guard at `.../consolidation.ts:67` and `:503-519`; weight history logging via `updateEdge` path at `.../causal-edges.ts:509-513`, `:700`.
- Unreferenced implementing files: `mcp_server/handlers/save/response-builder.ts:366` (post-save invocation of consolidation).
- Verdict: **PARTIAL**

### 05. Memory summary search channel
- Files: referenced files exist.
- Functions: present:
  - `computeTfIdf(sentences)` at `mcp_server/lib/search/tfidf-summarizer.ts:105`
  - `extractKeySentences(content, n=3)` at `:172`
  - `querySummaryEmbeddings(db, queryEmbedding, limit)` at `mcp_server/lib/search/memory-summaries.ts:161`
  - `checkScaleGate(db)` at `:210`
- Defaults/flags: `SPECKIT_MEMORY_SUMMARIES` default-on at `mcp_server/lib/search/search-flags.ts:177` + rollout default-on policy `.../rollout-policy.ts:53-63`.
- Behavior: TF-IDF normalization `[0,1]` at `.../tfidf-summarizer.ts:148-154`; top-3 in original order at `:27`, `:199-206`; save-time generation/insertion at `mcp_server/handlers/save/post-insert.ts:115-122`; summary query cap `Math.max(limit * 10, 1000)` at `mcp_server/lib/search/memory-summaries.ts:169`; stage1 min-quality filtering for summary hits at `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:947-949`; scale gate `>5000` successful embeddings at `.../memory-summaries.ts:218`.
- Unreferenced implementing files: `mcp_server/handlers/save/post-insert.ts:115`, `mcp_server/lib/search/vector-index-schema.ts:751`, `mcp_server/lib/search/vector-index-mutations.ts:42`.
- Verdict: **PARTIAL**

### 06. Cross-document entity linking
- Files: referenced files exist.
- Functions: present:
  - `buildEntityCatalog(db)` at `mcp_server/lib/search/entity-linker.ts:365`
  - `findCrossDocumentMatches(db)` at `:419`
  - `createEntityLinks(db, matches, options?)` at `:571`
  - `runEntityLinking(db)` at `:770`
- Defaults/flags:
  - `SPECKIT_ENTITY_LINKING` default-on at `mcp_server/lib/search/search-flags.ts:194`
  - density env default/fallback `1.0` via `DEFAULT_MAX_EDGE_DENSITY` and sanitization at `.../entity-linker.ts:24`, `:476-493`
- Behavior: inserts `relation='supports'`, `strength=0.7`, `created_by='entity_linker'` at `.../entity-linker.ts:589-591`; infra gate on `entity_catalog` at `:747-753` and `:777-779`; projected density guard at `:637-643`; O(1) set dedup at `:369-370`; batch edge count query at `:537`.
- Unreferenced implementing files: `mcp_server/handlers/save/post-insert.ts:138-141`, `mcp_server/lib/extraction/entity-extractor.ts:209`, `mcp_server/lib/search/vector-index-schema.ts:770`.
- Verdict: **PARTIAL**

### 07. Tier-2 fallback channel forcing
- Files: referenced files exist.
- Functions/signature points:
  - `forceAllChannels?: boolean` option exists at `mcp_server/lib/search/hybrid-search.ts:92`
  - routing obeys `forceAllChannels` at `:612-614`
- Defaults/flags: fallback chain is controlled by `SPECKIT_SEARCH_FALLBACK` (default-on) at `mcp_server/lib/search/search-flags.ts:59-60`.
- Behavior: Tier-2 explicitly sets `forceAllChannels: true` at `mcp_server/lib/search/hybrid-search.ts:1577-1585`; regression test `C138-P0-FB-T2` exists at `mcp_server/tests/hybrid-search.vitest.ts:723`.
- Unreferenced implementing files: none required for core feature behavior.
- Verdict: **MATCH**

### 08. Provenance-rich response envelopes
- Files: referenced files exist.
- Functions/signature points:
  - `formatSearchResults(..., includeTrace = false, ...)` at `mcp_server/formatters/search-results.ts:379` and `:387`
  - `MemoryResultEnvelope` type at `.../search-results.ts:150`
- Defaults/flags:
  - request default `includeTrace=false` in `memory_search` handler at `mcp_server/handlers/memory-search.ts:434`
  - flag override `SPECKIT_RESPONSE_TRACE` at `:438-439`
  - schema defaults false in tool schemas at `mcp_server/tool-schemas.ts:43` and `:175-179`
- Behavior: formatter conditionally adds `scores`, `source`, `trace` when `includeTrace` true at `mcp_server/formatters/search-results.ts:457-478`; `memory_context` forwards includeTrace into internal `memory_search` calls at `mcp_server/handlers/memory-context.ts:570`, `:597`, `:629`; input schemas admit `includeTrace` at `mcp_server/schemas/tool-input-schemas.ts:112` and `:150`.
- Unreferenced implementing files: none required for core feature behavior.
- Verdict: **MATCH**

### 09. Contextual tree injection
- Files: all catalog-referenced files exist.
- Functions/signature points:
  - header injection helper `injectContextualTree(...)` at `mcp_server/lib/search/hybrid-search.ts:1403`
- Defaults/flags:
  - `SPECKIT_CONTEXT_HEADERS` default-on at `mcp_server/lib/search/search-flags.ts:209-213`
  - default-on semantics from rollout policy at `mcp_server/lib/cognitive/rollout-policy.ts:53-63`
- Behavior: headers injected **after** Stage-4 truncation (`truncateToBudget`) at `mcp_server/lib/search/hybrid-search.ts:1079-1084` then `:1140-1144`; format `[parent > child — description]` with max 100 chars at `:1419-1421`; description cache from folder-discovery with TTL 60s at `:1343-1354` and `:1349`.
- Unreferenced implementing files: none missing; however source list is substantially overinclusive vs actual context-header logic locus.
- Verdict: **PARTIAL**

## Summary table

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 01 | Dual-scope memory auto-surface | Yes | Yes | Yes | No | MATCH |
| 02 | Constitutional memory as expert knowledge injection | Yes | Yes | N/A | Yes | PARTIAL |
| 03 | Spec folder hierarchy as retrieval structure | Yes | Yes | N/A | Yes | PARTIAL |
| 04 | Lightweight consolidation | Yes | Yes | Yes | Yes | PARTIAL |
| 05 | Memory summary search channel | Yes | Yes | Yes | Yes | PARTIAL |
| 06 | Cross-document entity linking | Yes | Yes | Yes | Yes | PARTIAL |
| 07 | Tier-2 fallback channel forcing | Yes | Yes | Yes | No | MATCH |
| 08 | Provenance-rich response envelopes | Yes | Yes | Yes | No | MATCH |
| 09 | Contextual tree injection | Yes | Yes | Yes | No (overinclusive list) | PARTIAL |

## Appendix: file existence checks (every `mcp_server/*.ts` catalog reference)
All catalog-referenced `mcp_server` paths were present on disk (`:1`).

(Implementation + tests verified for each feature; full expanded list was validated during the run and can be re-emitted verbatim if you want it pasted inline per feature.)
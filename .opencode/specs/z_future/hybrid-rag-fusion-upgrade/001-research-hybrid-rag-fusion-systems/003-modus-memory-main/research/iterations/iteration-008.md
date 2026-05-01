# Iteration 008: COMPARISON - RETRIEVAL

## Focus
COMPARISON - RETRIEVAL: Compare search/retrieval against our Spec Kit Memory (`memory_search`, CocoIndex, code-graph).

## Findings

### Finding 1: Modus’s BM25 stack is clean, but Public’s lexical lane is already stronger and sits inside a broader retrieval system
- **Source**: `external/internal/index/bm25.go:10-25,103-181,189-269`; `external/internal/index/indexer.go:160-220`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:45-67`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:146-206`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:11-23,1391-1405`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1-25,113-124`
- **What it does**: Modus builds a six-field in-memory BM25 index with fixed weights (`path 1.5`, `source 1.0`, `subject 2.0`, `title 3.0`, `tags 1.5`, `body 1.0`), simple stemming, and a last-chance prefix scan when exact term lookup misses. Public already has weighted lexical retrieval too, but its FTS5 BM25 weights are materially stronger (`title 10x`, `trigger_phrases 5x`, generic metadata `2x`, body `1x`) and that lexical lane runs inside hybrid search with both vector and keyword channels active before later graph/session/feedback fusion.
- **Why it matters for us**: The useful conclusion is **not** “swap in Modus BM25.” Public already has a richer lexical+semantic memory path, plus dedicated code retrieval channels. Modus is a reference for a compact lexical implementation, not a superior search architecture.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus’s fuzzy query cache is one real retrieval idea Public does not already have
- **Source**: `external/internal/index/cache.go:10-17,41-80,83-119,167-195`; `external/internal/index/indexer.go:169-219`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:718-767`
- **What it does**: Modus adds a two-tier cache in front of search: exact normalized-query hash reuse, then fuzzy reuse when Jaccard similarity between token sets is at least `0.6`, with a small LRU of `256` entries. Public also caches search responses, but the cache key is exact and scope-heavy (`query/concepts/specFolder/tenant/user/agent/sharedSpace/session/flags`), so it does not opportunistically reuse near-duplicate lexical queries.
- **Why it matters for us**: This is one of the few genuinely missing retrieval mechanics. But it is only safe on a bounded lexical sub-lane; applying fuzzy reuse to Public’s fully fused response would be wrong because scoped visibility, session dedup, boosts, and telemetry make “similar query” much less equivalent than in Modus.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Modus’s “Librarian expansion” is a local LLM rewrite path, while Public already has three expansion families
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-321`; `external/README.md:261-267,316-317`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:20-100`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:155-259`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:347-383,616-860,1088-1155`
- **What it does**: In source, Modus expansion is not a static synonym table on the hot path; `ExpandQuery()` calls the Librarian model, parses JSON expansions, keeps the original query, caps the set at 6, then merges result sets by unique path or fact key. Public already has rule-based synonym expansion, embedding-based term mining, query decomposition, and optional LLM reformulation in deep mode, all fail-open and integrated into the hybrid pipeline.
- **Why it matters for us**: The net-new idea is narrower than the README suggests. We do **not** need “query expansion” in general; we already have it. The transferable part is a cheap, explicitly lexical rewrite lane that can widen BM25/FTS recall without changing semantic or graph routing.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Modus’s best retrieval-specific pattern is not its graph model, but its explicit “connected docs not in top hits” appendix
- **Source**: `external/internal/index/crossref.go:41-112,154-214`; `external/internal/mcp/vault.go:75-101`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:15-24,317-420`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:46-117,143-159,178-247`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:10-39`
- **What it does**: Modus builds cheap adjacency maps over markdown documents only: shared subject gets weight `3.0`, entity `2.0`, tag `1.0`, then `vault_search` appends connected documents that were not already returned. Public’s code-graph and CocoIndex are stronger, but they solve different problems: `code_graph_query/context` answer structural code questions, and CocoIndex is the semantic code-search bridge. Neither is the same as “show me adjacent memory docs I might also want right now.”
- **Why it matters for us**: This is additive, not competitive. Public should not replace causal memory or code graph with Modus-style string adjacency, but a small connected-memory appendix for markdown artifacts could improve exploration and follow-on recall without disturbing the existing routing split of memory vs semantic code vs structural code.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Modus’s fact-only retrieval lane is fast, but too narrow to replace Public’s scoped hybrid memory search
- **Source**: `external/internal/index/facts.go:23-145`; `external/internal/index/indexer.go:307-371`; `external/internal/vault/facts.go:290-336`; `external/internal/mcp/vault.go:273-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:492-540,771-809,1071-1169,1251-1323`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:118-164,189-256`
- **What it does**: Modus maintains a separate in-memory fact store over `memory/facts/*.md`, scoring by token overlap with small confidence and recency boosts, then merges query variants by `subject|predicate`. Public’s `memory_search` is much broader: scoped retrieval (`tenant/user/agent/session/sharedSpace`), hybrid/vector/multi-concept modes, constitutional injection, session and causal boosts, reranking, dedup, and shadow telemetry.
- **Why it matters for us**: Modus’s split is a plausible fast path for a tiny fact surface, but it is much weaker than Public’s actual memory retrieval contract. If we want a “quick facts” helper later, it should be a sidecar or profile, not the main memory search model.
- **Recommendation**: reject
- **Impact**: medium

### Finding 6: Modus’s retrieval README overstates the hot path; only the cache story is source-plausible
- **Source**: `external/README.md:261-267,308-317`; `external/docs/librarian.md:33-40`; `external/internal/librarian/search.go:15-35,57-106`; `external/internal/index/cache.go:49-80,167-195`; `external/internal/index/bm25.go:116-118,171-181`
- **What it does**: README says search uses “local synonym map” and “no LLM calls on the search path,” but source expansion/reranking go through `Call(...)` when the Librarian is available. The “microseconds” claim is believable for exact cache hits only; fuzzy cache still scans cache entries, and prefix fallback scans the full term vocabulary. So the fast path exists, but the marketing summary collapses very different paths together.
- **Why it matters for us**: We should treat Modus’s performance story as a benchmark candidate for exact-cache and cold-BM25 tiers, not as proof that the overall retrieval design is cheaper or simpler than Public’s routed memory/CocoIndex/code-graph stack.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/index/indexer.go`
- `external/internal/index/facts.go`
- `external/internal/index/crossref.go`
- `external/internal/librarian/search.go`
- `external/internal/vault/facts.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/internal/mcp/vault.go`
- `external/internal/mcp/memory.go`
- `external/README.md`
- `external/docs/librarian.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts`

## Assessment
- **New information ratio**: 0.81
- **Questions addressed**: BM25 transferability vs Public lexical search; cache-path differences; real query-expansion mechanics; adjacency-map usefulness vs code-graph/CocoIndex; fact-lane overlap vs `memory_search`; credibility of performance claims.
- **Questions answered**: Modus BM25 is not stronger than Public’s lexical lane; fuzzy lexical cache reuse is the clearest missing idea; Librarian expansion is real local-LLM rewriting, not a no-LLM synonym map; adjacency appendices are the best reusable retrieval UX pattern; Modus fact search is too narrow for Public’s main memory contract; README search/performance claims are only partially source-backed.

## Reflection
- **What worked**: Following the requested order from BM25/cache/expansion into MCP handlers made the retrieval story much clearer than starting from the README. Comparing Modus against Public’s actual lexical, hybrid, semantic-code, and structural-code surfaces prevented false “missing feature” conclusions.
- **What did not work**: The phase scaffold is incomplete for a full saved iteration: `research/research.md` is absent, and strict spec validation could not run because the validator hit a permission boundary. That means this iteration is solid as source-backed analysis, but not yet as a completed in-folder research artifact.

## Recommended Next Focus
Investigate a system that couples **retrieval-time expansion with explicit scoped caching and related-result surfacing** without turning recall into write-side mutation, so we can compare a stronger retrieval broker against both Modus and Public’s current split between `memory_search`, CocoIndex, and code-graph.


Total usage est:        1 Premium request
API time spent:         4m 23s
Total session time:     4m 43s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.9m in, 15.3k out, 1.8m cached, 7.4k reasoning (Est. 1 Premium request)

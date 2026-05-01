# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

## Findings

### Finding 1: Modus is **not** a vector or true hybrid retriever; it is a BM25-only engine with optional LLM query rewrites
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go:10-25,103-181,189-269`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:1-8,22-32,65-136,160-220`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:21-58,273-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100-104,482-485,771-810,1234-1235`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:11-17,616-750`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:147-205`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:45-66`
- **What it does**: Modus builds one in-memory lexical index over six fields with fixed weights `{path 1.5, source 1.0, subject 2.0, title 3.0, tags 1.5, body 1.0}`, tokenizes/stems locally, and falls back to prefix matching for terms of length `>=3`. The only “hybrid” element in shipped search is librarian-driven query expansion before rerunning the same lexical engine. There is no vector lane, no learned fusion, and no cross-channel score combination. Public already has explicit hybrid retrieval: weighted FTS5 BM25, embedding/vector retrieval, multi-variant deep mode, and RRF-based fusion.
- **Why it matters for us**: Modus is useful as a compact lexical baseline, but it is not evidence for replacing Public’s hybrid stack. Its field-weight idea is already overlapped here, and our current lexical weights are actually stronger and more structured.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus expands queries, but merges variant results with **first-seen dedup**, not global re-ranking
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:10-52,55-107`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28-58,280-332`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:324-343,346-391,713-750,803-850`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-41,931-942`
- **What it does**: `ExpandQuery()` always keeps the original query first, appends up to five additional strings, and `vault_search` / `memory_search` then append results variant-by-variant while deduplicating by `path` or `subject|predicate`. After dedup, Modus simply truncates to `limit`; it does not merge scores across branches or globally re-rank the union. A librarian `RankResults()` helper exists, but the only call site is its own definition. Public, by contrast, preserves branch/source provenance per candidate and fuses later in the pipeline.
- **Why it matters for us**: This is the biggest ranking weakness in Modus’s “hybrid-like” behavior. Expansion can improve recall, but Modus’s merge policy means later variants often cannot beat early lexical hits even if they are more relevant.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: The cache idea is useful, but the shipped Jaccard/LRU implementation is unsafe and only partially correct
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:10-80,83-120,137-195`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:718-755`
- **What it does**: Modus adds a two-tier cache: exact query hash match first, then fuzzy reuse when token-set Jaccard similarity is `>=0.6`, with `256` max entries. That part is interesting. But `get()` mutates `hits` while holding only `RLock`, and cache reads never increment the global counter, so its “LRU” recency signal is not actually advanced on access.
- **Why it matters for us**: The architectural idea is stronger than the implementation. Public already has exact-argument caching around `memory_search`; a safe lexical/paraphrase cache could still be worth exploring for repeated nearby queries, but Modus’s version should not be copied.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: README latency claims only fit the pure in-memory BM25 path; the default librarian-expanded path can be network/LLM-bound
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:27-32,51-58,191-207,416-427`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28-35,280-285`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:17-33,35-82`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:71-75,717-739`
- **What it does**: Modus advertises `<100µs` cached search and `<5ms` cold search, which is believable for the in-memory BM25/cache path after startup. But when the librarian is reachable, both `vault_search` and `memory_search` first do a health probe and then send a chat-completions request with a `120s` HTTP timeout to generate expansions. That makes the real default search path dependent on external model latency, not just BM25 speed. Public’s deep expansion path is explicitly gated and wrapped in a `5s` timeout budget.
- **Why it matters for us**: The Modus performance story is valid only for one branch of the runtime. We should not import its “always expand when available” behavior into Public’s main retrieval path.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Modus’s fact lane is **not BM25**, and it couples search with automatic write-side reinforcement
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go:23-145,187-229`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:287-320,343`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160-217,339-370`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:517-523,795-803`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:530-585,841-883,1194-1203`
- **What it does**: `memory_search` prints `bm25+librarian`, but the fact lane uses a separate `factStore.search()` that scores by token overlap, a small inverse-hit-frequency heuristic, `confidence * 0.1`, and a coarse recency multiplier. It is not BM25. Then every returned fact is asynchronously reinforced via `go v.ReinforceFact(...)`, so read access mutates stored state by default. Public already has FSRS strengthening logic, but only behind explicit `trackAccess=true`.
- **Why it matters for us**: Modus’s fact path is closer to a lightweight subject/value recall lane than a full lexical ranker. The automatic reinforcement loop is also too write-happy for Public’s default search semantics.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Cross-reference hints are the best transferable search-side idea, but only as a lightweight appendix, not as a ranking core
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:9-24,41-113,154-214`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:75-99,901-924`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:22-27,977-1050`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:25-47`
- **What it does**: Modus builds adjacency maps keyed by normalized subject, tag, and entity name, then scores connected docs with fixed weights `subject=3`, `entity=2`, `tag=1`. This is cheap and useful for related-document surfacing. But it is intentionally shallow: no traversal, no causal semantics, and the “scan title/body for entity mentions” comment only checks title and subject in code. Public already has richer graph-aware ranking signals, causal boost, and structural freshness augmentation.
- **Why it matters for us**: The transferable piece is presentation, not retrieval replacement. Modus shows a cheap way to append “related memory” hints beside primary search hits without requiring full graph traversal on every query.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`

## Assessment
- **New information ratio**: 0.81
- **Questions addressed**: whether Modus has real hybrid/vector retrieval; exact BM25 field behavior; cache tiers and fuzzy reuse; expansion ordering and failure handling; credibility of search latency claims; fact-lane scoring and reinforcement coupling; cross-reference weighting vs graph behavior
- **Questions answered**: Modus is lexical-only in shipped runtime; its query expansion is recall-oriented but rank-weak; its fuzzy cache idea is promising but its implementation is unsafe; its advertised latency excludes the LLM-expanded path; its fact search is a separate lightweight scorer with automatic write-back; its adjacency maps are best treated as related-doc hints, not as a graph substitute

## Reflection
- **What worked**: Tracing the actual call chain from MCP tool handlers into the BM25 engine and librarian client exposed the real runtime behavior quickly, especially the difference between “search core” and “search marketing.” Comparing Modus’s branch merge logic directly against Public’s Stage 1/Stage 2 pipeline made the recommendation boundaries much clearer.
- **What did not work**: README language around FTS5 and latency was too optimistic to trust without source tracing, and some comments overstate what the code does, especially around entity/body cross-referencing. Broad term searches were also noisy until narrowed to exact handler and pipeline entrypoints.

## Recommended Next Focus
Trace **agent/tool orchestration and caller contract** next: when Modus expects the client to choose `vault_search` vs `memory_search` vs `vault_connected`, how often searches implicitly mutate memory, and whether the shipped tool surface assumes a prompt-side policy layer to compensate for weak global ranking and LLM-latency tradeoffs.


Total usage est:        1 Premium request
API time spent:         6m 9s
Total session time:     6m 41s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  3.2m in, 20.0k out, 3.1m cached, 7.7k reasoning (Est. 1 Premium request)

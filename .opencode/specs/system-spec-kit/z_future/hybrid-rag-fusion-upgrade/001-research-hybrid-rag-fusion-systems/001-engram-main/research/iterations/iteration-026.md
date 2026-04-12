# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings
### Finding 1: Lexical search should own exact handles, artifact names, and stable thread keys
- **Source**: `001-engram-main/external/internal/store/store.go:1474-1519,1546-1583,3384-3391`; `001-engram-main/external/docs/ARCHITECTURE.md:86-116`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-56,113-164`
- **What it does**: Engram gives exact structured identifiers a deterministic lexical fast path: if a query contains `/`, `Search()` checks `topic_key = ?` first, prepends those hits ahead of normal FTS results, and only then falls back to `MATCH` ordered by `fts.rank`. Public already contains the same product signal: `query-router.ts` explicitly preserves BM25 for `find_spec`, `find_decision`, and artifact-like classes such as `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, and `research`.
- **Why it matters**: This is the clearest lexical win case. When the user knows the exact name or key, semantic similarity only widens recall. Public should treat artifact identifiers, exact labels, and future thread keys as first-class lexical lanes.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Semantic retrieval should remain the default leader for natural-language discovery
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49-170`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482-530,654-809,952-958,1230-1235`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973-1253,1747-1779`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:75-200`; `001-engram-main/external/internal/store/store.go:1518-1583`
- **What it does**: Public's `memory_search` is explicitly semantic-first, then runs a hybrid pipeline over vector, FTS, BM25, graph, and degree lanes with weighted RRF and default reranking. Within that fusion, vector stays primary, FTS is downweighted to `0.3` because higher weighting flooded top-k with noisy lexical matches, BM25 stays at `0.6` for breadth, and lexical-only fallback happens only after hybrid attempts fail. Engram has no semantic lane here; after exact `topic_key` lookup it relies on sanitized FTS5 `MATCH` plus `fts.rank`.
- **Why it matters**: Semantic beats lexical on concept queries, paraphrases, cross-session synthesis, and any case where relevant memories do not repeat the exact query terms. Public's current architecture is right to keep semantic leadership.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Lexical precision should stay split into specialized lanes, not collapsed into one generic keyword score
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:75-200`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:1-24,59-90`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:146-220`
- **What it does**: Public already separates lexical behaviors. `memory_match_triggers` does exact trigger-phrase matching with binary scores, decay, activation, co-activation, and tiered content shaping. Learned feedback writes inferred aliases into a separate `learned_triggers` column with a 30-day TTL and `0.7x` weight, explicitly avoiding FTS pollution. FTS5 itself uses weighted BM25 over title, trigger phrases, file path, and content.
- **Why it matters**: Lexical wins in different ways for different reasons: trigger recall, artifact-name lookup, and lightweight learned aliases are not the same problem. Keeping them as separate lanes preserves precision and prevents generic lexical weighting from becoming noisy.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Final ordering should be decided after fusion by semantic reranking, not by raw lexical scores
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:123-240,290-433`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:4-35,128-195`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221-1253`; `001-engram-main/external/internal/store/store.go:1521-1583`
- **What it does**: Public does not stop at fusion. Stage 3 reranks fused candidates on chunk text via cross-encoder or local reranker, then applies MMR diversity while explicitly preserving non-embedded rows such as lexical-only hits. Stage 4 then preserves score/order invariants. Engram stops earlier: after exact-key prepends, ordering is just FTS rank.
- **Why it matters**: This is what makes "semantic first, lexical preserved" real. Lexical lanes are strong candidate generators, but raw term scores should not be the final arbiter once semantic context is available.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public should add an explicit thread-key lookup lane instead of overloading semantic search to recover evolving topics
- **Source**: `001-engram-main/external/internal/store/store.go:1474-1519,2898-2919`; `001-engram-main/external/docs/ARCHITECTURE.md:86-116`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49-170`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:113-164`
- **What it does**: Engram pairs stable `topic_key` upserts with direct lookup in `Search()`, so an evolving architecture or bug thread can be retrieved deterministically by key instead of approximately by meaning. Public has artifact-aware routing and strong semantic search, but no equivalent first-class thread-key lookup inside `memory_search`.
- **Why it matters**: This is the main gap surfaced by the semantic-vs-lexical comparison. Public is better for concept discovery; Engram is better for "take me back to the exact durable thread."
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Assessment
- New information ratio: 0.60
- Fallback note: CocoIndex was unavailable in-session for this pass, so the analysis used targeted grep plus direct file reads.

## Recommended Next Focus
Design a concrete routing matrix for Public: `exact key / artifact name -> lexical-first`, `trigger phrase -> trigger lane`, `short exact query -> lexical-preserving hybrid`, `natural-language concept query -> semantic-first hybrid`, then decide whether thread-key lookup belongs inside `memory_search` or as a sibling surface.

Packet write was permission-blocked in this session, so this iteration is returned inline only.


Total usage est:        1 Premium request
API time spent:         4m 42s
Total session time:     5m 3s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.5m in, 20.7k out, 1.4m cached, 7.7k reasoning (Est. 1 Premium request)

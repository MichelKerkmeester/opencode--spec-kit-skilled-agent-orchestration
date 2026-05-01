# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

## Findings
### Finding 1: **Reject Modus’s fuzzy result-cache architecture; it is the wrong cache contract for Public**
- **Source**: `external/internal/index/cache.go:10-17,41-80,83-119`; `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:56-61,98-106,143-181,242-257`
- **What it does**: Modus caches full result sets with two tiers: exact query hash and fuzzy reuse when Jaccard similarity between token sets is `>= 0.6`. Its “LRU” bookkeeping is weaker than advertised: `counter` advances only on `put`, while `get` rewrites `hits` without advancing recency, so eviction is really write-recency-biased rather than true read-recency-aware. Public’s cache is a canonical-args SHA256 key with TTL, explicit invalidation by tool, and generation bumps to prevent stale reuse after mutations.
- **Why it matters for us**: Public’s retrieval result is shaped by many dynamic knobs — scope, archived filtering, session boost, causal boost, rerank, quality thresholds, trace flags, progressive disclosure. Modus-style fuzzy query reuse would blur those dimensions and risk replaying the wrong scored payload for a merely similar query. This is a direction change we should avoid.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: **Do not simplify deep-mode query expansion to Modus’s “union then cap” flow**
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-331`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:347-389,616-779`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:6-20`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:28-64`
- **What it does**: Modus expands a query into up to 6 strings, runs searches per variant, deduplicates by `path` or `subject|predicate`, then truncates to the requested limit. There is no cross-variant score reconciliation, branch attribution, or post-merge rerank contract; early variants effectively dominate. Public’s deep mode already runs variant branches with timeout protection and `Promise.allSettled`, merges rows by canonical id while preserving branch/source scores, then applies fusion and rerank under a deterministic ranking contract.
- **Why it matters for us**: Modus’s expansion prompt is interesting, but its merge semantics are weaker than Public’s current pipeline. If we refactor our deep retrieval path toward a simpler variant union, we would lose ranking fidelity and auditability. The right direction is to keep all expansion strategies inside Stage 1 and let Stage 2/3 own scoring.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: **Adopt a stricter “one retrieval core” rule; Modus’s duplicated fact search paths are a warning**
- **Source**: `external/internal/index/indexer.go:117-130,287-370`; `external/internal/index/facts.go:23-145`; `external/internal/vault/facts.go:290-337`; `external/internal/mcp/vault.go:271-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:118-164`
- **What it does**: Modus has at least two fact-retrieval contracts for the same memory objects: a general document BM25 index filtered to `memory/facts/`, and a separate in-memory `factStore` with its own term index, confidence boost, recency boost, and active-flag handling. `memory_search` uses `Index.SearchFacts`, while `Vault.SearchFacts` uses a different path and fallback behavior. Public, by contrast, pushes `memory_search` through a single pipeline config and result contract.
- **Why it matters for us**: This is the clearest architecture lesson from Modus for refactor planning: do not create a second “special fast path” retrieval engine for a subset of memories. If Public adds more specialized search entry points, they should stay thin wrappers over the existing pipeline instead of growing parallel ranking rules that will drift.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: **Refactor Public’s access-writeback out of Stage 2 fusion before expanding it further**
- **Source**: `external/internal/mcp/vault.go:311-317`; `external/internal/vault/facts.go:160-216`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520,771-807`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:840-883,920-940,1194-1207`
- **What it does**: Modus treats every returned fact as a successful recall and asynchronously reinforces it straight from the MCP handler. Public is safer — `trackAccess` is explicit and off by default — but the actual FSRS strengthening write-back still runs inside Stage 2 fusion, alongside scoring signals like session boost, causal boost, and intent weighting.
- **Why it matters for us**: Comparing the two systems makes the boundary problem obvious: search-time mutation is a different concern from ranking. Public should keep the explicit opt-in policy, but move the write-back/testing-effect path into a post-retrieval access-effects module so Stage 2 stays purely about score construction. That will make future FSRS/review-policy work easier without creeping side effects into ranking logic.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: **If we want Modus-style “connected docs” ergonomics, add them as a formatter over existing graph evidence, not as a new index**
- **Source**: `external/internal/index/crossref.go:154-214,248-281`; `external/internal/mcp/vault.go:75-101,899-925`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:223-257`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:947-995`
- **What it does**: Modus appends a lightweight connected-doc block after primary results using fixed subject/entity/tag weights. Public already computes and exposes graph contribution metadata in the pipeline response, but it does not currently turn that into a first-class “you may also want these linked memories” presentation block.
- **Why it matters for us**: The storage/index part of Modus’s adjacency model is not worth adopting over Public’s causal graph. But the UX layer is reusable: a formatter that emits graph-derived related-memory hints could improve browsing without touching retrieval architecture or inventing another relationship store.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `phase-research-prompt.md`
- `research/iterations/iteration-010.md`
- `research/iterations/iteration-011.md`
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/index/indexer.go`
- `external/internal/index/facts.go`
- `external/internal/index/crossref.go`
- `external/internal/librarian/search.go`
- `external/internal/vault/facts.go`
- `external/internal/mcp/vault.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`

## Assessment
- New information ratio: 0.79
- Questions addressed: whether Modus’s cache design should influence Public; whether Modus’s query-expansion merge path is architecturally better or worse than Public’s pipeline; whether Modus’s split fact-search surfaces suggest a refactor direction; whether Public’s own FSRS write-back placement should change; whether any part of Modus’s connected-doc UX is worth borrowing without adopting its adjacency index.
- Questions answered: Public should **not** move toward Modus’s fuzzy result cache or union-first expansion flow; Public **should** preserve a single canonical retrieval core and refactor access-writeback out of Stage 2; the only cross-ref idea worth carrying forward is a response-layer related-doc hint built from existing graph evidence rather than a new storage/index model.

## Reflection
- What worked: Tracing the exact merge and cache code paths exposed the architectural differences much faster than feature-by-feature comparison. Looking at where side effects happen — handler, retrieval core, or post-processing — was the key lens for this iteration.
- What did not work: The phase folder does not currently have the reducer-owned deep-research state files, so there was no machine-maintained “next focus” packet to resume from. I had to anchor this pass on the prior iteration markdown plus direct source tracing instead.

## Recommended Next Focus
Compare against a system with an explicit **review queue / due-items scheduler** and **approval inbox**, so the next pass can test whether Public’s strongest missing piece is not retrieval anymore, but the operator workflow that sits on top of retrieval, reinforcement, and governance.


Total usage est:        1 Premium request
API time spent:         5m 6s
Total session time:     5m 29s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.9m in, 16.9k out, 1.7m cached, 8.8k reasoning (Est. 1 Premium request)

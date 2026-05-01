# Iteration 034: PERFORMANCE IMPLICATIONS

## Focus
PERFORMANCE IMPLICATIONS: Analyze performance trade-offs of adopted patterns. Search latency, storage growth, indexing overhead, startup time impact.

## Findings

### Finding 1: Modus gets its fast cold path by collapsing retrieval into one in-memory lane and paying startup/RAM cost up front
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go:103-181`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:65-136,139-149,307-370`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:31,421-427,456,462` [SOURCE: paths above]
- **What it does**: Modus scans markdown, builds BM25 postings, fact indexes, and adjacency maps entirely in memory at process startup, then serves search from RAM with no disk I/O on the hot path.
- **Why it matters**: That architecture is why Modus can plausibly hit very low cold-search latency, but it also means every client/process pays rebuild time and duplicates index memory. Public’s persistent SQLite/vector/code-graph/CocoIndex approach is heavier on disk and code complexity, but it amortizes cost across a long-lived server instead of rebuilding per process.
- **Recommendation**: **reject**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 2: Modus’s fuzzy Jaccard cache is only safe because its query contract is narrow; Public’s exact-key cache is the correct boundary
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:10-17,39-120`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:718-809,1042-1049,1071-1129` [SOURCE: paths above]
- **What it does**: Modus reuses results for exact query matches and Jaccard-similar term sets across a small BM25-only retrieval surface. Public caches by a much larger parameter set: scopes, limits, decay, content inclusion, anchors, rerank, session state, boosts, and trace settings.
- **Why it matters**: In Public, fuzzy cache reuse would blur materially different retrieval intents and response shapes. The current exact-key cache plus post-cache session dedup is slower than Modus’s fuzzy reuse, but it preserves correctness across a much wider control surface.
- **Recommendation**: **reject**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 3: Modus’s librarian expansion is the main hidden latency multiplier and should never be treated as “free”
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:10-18,27-52`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:17-23,35-81`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:21-45,273-331`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:308,316` [SOURCE: paths above]
- **What it does**: Modus checks a localhost model endpoint, sends chat-completion requests with up to 120s timeout, expands queries into multiple variants, then fans out multiple searches before merging results. Its README claims “zero network calls” and “no LLM calls on the search path,” which the code does not support literally.
- **Why it matters**: This is the clearest performance trap for Public. Query expansion can help weak-result recovery, but as a default path it adds another runtime dependency and multiplies p95 latency.
- **Recommendation**: **prototype later**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 4: Public already has the right performance pattern: explicit latency tiers, not one universal retrieval path
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-807`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184-240`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:752-768`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:914-947`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:128-168` [SOURCE: paths above]
- **What it does**: Public routes `memory_context` quick mode to trigger matching, while focused/deep/resume modes route to the heavier hybrid `memory_search` path. Cache hits skip the embedding wait, but cache misses may block on embedding readiness; the server also performs DB freshness and auto-surface prechecks before dispatch.
- **Why it matters**: Public’s performance story is not “make everything as cheap as Modus BM25.” It is “use the cheap lane when the task allows it, and pay for richer retrieval only when necessary.” That is the transferable pattern worth strengthening.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 5: Public’s bigger storage footprint buys lower steady-state churn by pushing work into incremental and async maintenance surfaces
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:148-205,212-240,367-387,486-623`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:600-616,728-735`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123-205`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-44` [SOURCE: paths above]
- **What it does**: Public exposes incremental memory scans with fast-path mtime skips, deferred stale cleanup, post-success mtime updates, optional async embedding on save, incremental code-graph indexing, and explicit CocoIndex reindex commands.
- **Why it matters**: Compared with Modus, Public stores more derived state and operational metadata, so disk growth is higher. But the payoff is that write/index cost can be spread across explicit maintenance operations instead of forcing every process to rebuild the whole retrieval stack at startup.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go:103-181`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:10-17,39-120`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:65-136,139-149,307-370`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go:23-145`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:10-18,27-52`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:17-23,35-81`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:21-45,75-103,273-331`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:31,53,58,308,316,421-427,456,462`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:718-809,1042-1049,1071-1129`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-807`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184-240`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:148-205,212-240,367-387,486-623`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:600-616,728-735`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123-205`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-44`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:892-947`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:128-168`

## Assessment
- **New information ratio**: **0.24**
- **Questions addressed**: what actually drives Modus search speed; whether its cache pattern transfers; whether librarian expansion is cheap enough for default use; how Public’s storage/indexing model shifts cost; where startup vs steady-state trade-offs land.
- **Questions answered**: Modus speed mostly comes from a single in-memory lane plus exact caching and prebuilt postings; its fuzzy cache is not safely portable to Public; librarian expansion is materially expensive and should stay off the default path; Public’s explicit fast/slow retrieval lanes and incremental maintenance surfaces are the better fit for this repo.
- **Novelty justification**: Earlier iterations ranked features and noted benchmark claims; this pass ties the performance story to concrete hot-path, cold-path, startup, and maintenance code on both systems.

## Ruled Out
- Porting Modus’s per-process full in-memory rebuild model into Public mainline, because it would trade persistent-index amortization for repeated startup cost and RAM duplication.
- Adding Jaccard-similar fuzzy cache reuse to Public, because its retrieval contract is too parameter-rich for approximate cache hits to stay trustworthy.
- Treating librarian-style lexical expansion as a default retrieval stage, because it multiplies search latency and runtime dependency risk.
- Making write-on-read strengthening the default performance policy for Public, because it couples retrieval latency and mutation semantics too tightly.

## Reflection
- **What worked**: comparing the exact Modus hot path (`indexer`/`bm25`/`cache`/`librarian`) against Public’s exact routing and maintenance handlers made the performance trade-offs much clearer than benchmark claims alone.
- **What did not work**: broad grep across the whole MCP server was noisy; targeted handler reads were much more efficient for isolating latency and startup costs.
- **What I would do differently**: in a benchmark-enabled follow-up, measure p50/p95 for Public quick/focused/deep modes and compare them against a bounded lexical-fallback prototype rather than relying on static analysis alone.

## Recommended Next Focus
Define concrete performance guardrails for the adopt-now surfaces: p50/p95 targets for `memory_context` quick vs deep, acceptable startup/rehydration budgets, and storage-growth ceilings for memory index, code graph, and CocoIndex before any lexical-fallback experiment is approved.


Total usage est:        1 Premium request
API time spent:         3m 40s
Total session time:     3m 58s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 14.2k out, 1.2m cached, 6.5k reasoning (Est. 1 Premium request)

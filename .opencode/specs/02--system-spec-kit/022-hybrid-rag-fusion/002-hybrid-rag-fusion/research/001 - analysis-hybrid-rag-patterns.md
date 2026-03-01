# Analysis: Hybrid RAG Patterns for system-spec-kit Memory MCP

<!-- ANCHOR:research-scope-and-framing-138 -->
## Scope and framing

This analysis focuses on concrete retrieval architecture and implementation behavior in the current system-spec-kit memory MCP, then compares it with patterns from the provided context notes and external codebases. It intentionally avoids broad RAG primer material unless it changes an implementation decision.

[Assumes: "memory MCP/database" in this spec means `.opencode/skill/system-spec-kit/mcp_server` retrieval handlers, search modules, and SQLite-backed index implementation, rather than a separate external datastore project.]

[Assumes: the target optimization axis is practical retrieval quality under bounded latency and operational complexity, not maximizing benchmark metrics at any cost.]
<!-- /ANCHOR:research-scope-and-framing-138 -->

<!-- ANCHOR:research-current-system-baseline-what-already-exists-and-is-strong-138 -->
## Current system baseline (what already exists and is strong)

The current pipeline is already more mature than a simple vector-only retriever. In `memory_search`, the flow includes intent detection, state filtering, optional session and causal boosts, optional reranking, quality thresholding, and session deduplication [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:706-730`], [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:457-624`], [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:958-999`].

On retrieval methods, the handler prefers hybrid search with fallback to pure vector if hybrid fails or returns empty [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:842-915`], [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:917-953`]. Hybrid search itself supports vector + FTS + BM25 (+ optional graph), and the enhanced path uses weighted RRF fusion via `fuseResultsMulti` [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324-375`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:386-405`].

At the storage layer, the vector index has meaningful operational engineering: dynamic embedding-dimension handling and mismatch validation, schema migration discipline (versioned migrations), deferred indexing for non-blocking availability, and FSRS-aware temporal decay in SQL ranking [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:201-235`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:242-275`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:307-320`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1708-1767`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1990-2005`].

The practical implication: system-spec-kit is not at "basic RAG" stage. It is at "optimize an already layered retrieval stack" stage.
<!-- /ANCHOR:research-current-system-baseline-what-already-exists-and-is-strong-138 -->

<!-- ANCHOR:research-what-the-context-notes-add-and-where-they-match-current-gaps-138 -->
## What the context notes add (and where they match current gaps)

The first context note emphasizes tri-hybrid retrieval, not just dense+sparse: SQL filtering for structure, vectors for semantics, sparse for exact/domain terms, and then rank fusion [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_1.md:64-73`]. It specifically calls out strict/structured constraints as a weak spot for dense-only approaches [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_1.md:32-33`], and precision improvements from sparse signals for IDs/codes/version-like terms [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_1.md:34-49`].

The second context note stresses two ideas: (1) multi-query expansion to improve recall and ambiguity handling, and (2) RRF to stabilize final ranking [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_2.md:104-110`]. It also explicitly warns about latency and complexity from these enhancements [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_2.md:211-214`].

The strongest overlap with system-spec-kit today:

- Fusion exists, but multi-query orchestration does not exist in the runtime retrieval path.
- SQL filtering exists as metadata predicates, but there is no explicit "candidate narrowing stage" independent of retrieval engines.
- Sparse exists (FTS/BM25), but behavior and filtering parity across methods is not yet fully aligned.
<!-- /ANCHOR:research-what-the-context-notes-add-and-where-they-match-current-gaps-138 -->

<!-- ANCHOR:research-code-level-findings-and-tradeoffs-in-current-implementation-138 -->
## Code-level findings and tradeoffs in current implementation

### 1) Fusion quality is good, but some scoring constants are high-risk

`rrf-fusion.ts` uses `DEFAULT_K = 60` and a fixed `CONVERGENCE_BONUS = 0.10` [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts:19-21`]. With RRF, top-rank base contributions are around `1/(60+1) ~= 0.0164`, so a fixed +0.10 convergence boost can dominate native rank contributions. In practice, this can over-favor items that merely appear in multiple lists over items that rank very high in one strong list.

Tradeoff:

- Pro: Increases consensus robustness across sources.
- Con: Can flatten nuanced ranking quality and hide high-confidence single-source wins.
- Maintainability note: Hard-coded global constant is simple to reason about, but inflexible per intent/document type.

### 2) Adaptive fusion exists but appears disconnected from active search flow

`adaptive-fusion.ts` has intent-weight profiles, feature-flag rollout, degraded-mode contract, and dark-run diffing [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:53-60`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:72-76`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:272-347`].

However, in the current retrieval path, `memory-search.ts` routes through `hybridSearch.searchWithFallback` and post-processing, and there is no visible call to `hybridAdaptiveFuse` in runtime search modules [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:842-908`].

Tradeoff:

- Pro: Keeps production path stable.
- Con: Leaves a designed capability unused, increasing code surface and cognitive load without retrieval gains.

### 3) Filter parity is not uniform across retrieval methods

In hybrid search, FTS applies archival filtering via SQL when `includeArchived` is false [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:150-152`]. BM25 path receives only `{limit, specFolder}` and does not apply the same archival condition in this module [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:79-84`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260-262`].

Tradeoff:

- Pro: Simpler BM25 integration.
- Con: Potentially inconsistent results when archives should be excluded; makes retrieval behavior harder to explain and debug.

### 4) Caching is useful but cache key coverage is incomplete

`memory_search` uses tool cache with a structured key payload [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:750-775`], but this cache key set does not visibly include every high-impact retrieval toggle (notably `includeArchived` and quality-threshold args), even though those options affect output [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:657-666`], [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:804-805`], [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:887-888`], [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:932-933`].

Tradeoff:

- Pro: Lower latency through aggressive cache reuse.
- Con: Cache correctness risk if semantically different requests share a key.

### 5) Vector-index layer is operationally strong and should remain the system backbone

Several robust patterns should be preserved:

- Provider-aware embedding dimensions + mismatch checks [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:201-221`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:242-275`].
- Deferred indexing with BM25/FTS reachability to avoid total unavailability [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1708-1767`].
- FSRS-based decay formula with fallback, in SQL, close to the retrieval path [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1990-2005`].
- Security hardening around allowed paths and JSON parsing [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:325-340`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:360-391`].

This is not a component to replace. It is a component to make more query-planner-driven.
<!-- /ANCHOR:research-code-level-findings-and-tradeoffs-in-current-implementation-138 -->

<!-- ANCHOR:research-patterns-from-external-repos-that-are-directly-applicable-138 -->
## Patterns from external repos that are directly applicable

### GraphRAG MCP: selective context expansion as a first-class runtime toggle

`hybrid_search(..., expand_context=True)` exposes graph-context expansion as an explicit request-time switch [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/graphrag_mcp/server.py:27-40`]. The same server also surfaces graph schema and vector collection observability endpoints [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/graphrag_mcp/server.py:42-83`], [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/graphrag_mcp/server.py:85-118`].

Why it matters for system-spec-kit:

- system-spec-kit already has causal boosting, but exposing retrieval expansion policies as explicit knobs can reduce "magic behavior" and improve testability.
- Observability resources should mirror available retrieval modes so production diagnostics are easier.

### WiredBrain hybrid retriever: explicit fallback ladder + enrichment pass

WiredBrain uses a retrieval sequence that is very implementation-friendly:

1. session/file-context search,
2. vector search,
3. explicit fallback to Postgres text search,
4. graph enrichment,
5. weighted final ranking [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/WiredBrain-Hierarchical-Rag/src/retrieval/hybrid_retriever_v2.py:400-490`].

It also contains practical intent branching for summary-vs-specific queries in file chunks [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/WiredBrain-Hierarchical-Rag/src/retrieval/hybrid_retriever_v2.py:209-295`], and explicit fallback behavior if vector fails or returns empty [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/WiredBrain-Hierarchical-Rag/src/retrieval/hybrid_retriever_v2.py:443-454`].

Why it matters:

- The sequence is easy to reason about under outages and partial data quality.
- This aligns with the first context note's "orchestration over single engine" framing [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_1.md:76-92`].

### RAGFlow retrieval: deterministic score fusion with retry relaxation

RAGFlow combines text + dense via weighted sum (`0.05,0.95`) [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/ragflow/rag/nlp/search.py:127-129`], then applies zero-hit retries with lower matching strictness and adjusted similarity [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/ragflow/rag/nlp/search.py:135-147`]. It also distinguishes rerank behavior by backend normalization behavior (Infinity vs Elastic) [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/ragflow/rag/nlp/search.py:414-428`].

Why it matters:

- Explicit fallback policy improves recall without opening floodgates.
- Backend-specific score semantics are handled intentionally; system-spec-kit can similarly formalize score normalization contracts across vector/FTS/BM25.
<!-- /ANCHOR:research-patterns-from-external-repos-that-are-directly-applicable-138 -->

<!-- ANCHOR:research-architecture-implications-for-system-spec-kit-138 -->
## Architecture implications for system-spec-kit

### The core architectural shift: from "method fallback" to "query planning"

Current system behavior is robust but mostly method-centric (try hybrid, fallback to vector). The context and external patterns suggest moving to planner-centric orchestration:

1. **Intent + query-shape classification** (already partially present via intent classifier).
2. **Candidate narrowing stage** using SQL filters before retrieval-heavy steps.
3. **Multi-path retrieval execution** (vector/sparse/optional graph expansion) with explicit per-path budgets.
4. **Fusion + post-fusion policy** (RRF/adaptive plus thresholding).
5. **Degraded-mode signaling** when any path fails.

This can be done incrementally without replacing the existing storage/search primitives.

### SQL-first narrowing should be added, not generalized into full relational planner

The first context note argues for SQL as a structural gate [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_1.md:50-63`], [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_1.md:66-70`]. In system-spec-kit, the practical equivalent is prefiltering candidate IDs by strict metadata conditions (spec folder, document type, state, tier, archival, quality threshold) before expensive dense/sparse operations.

Implementation-wise this can use existing columns and indexes in `memory_index` [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1435-1476`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1585-1612`].

Tradeoff:

- Pro: Lower latency and better precision for structured requests.
- Con: Slightly more code and query-planner logic.
- Maintainability: Favor a compact, explicit planner enum over generic rule engines.

### Multi-query should be selective and budgeted

Multi-query expansion is useful for ambiguity/recall [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_2.md:108-116`], but it adds latency and complexity [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_2.md:211-214`].

Recommendation-level implication from this analysis: run multi-query only on intent classes and query patterns that benefit most (e.g., broad "understand" queries), cap at 2-3 rewrites, and reuse cache keys derived from canonicalized rewrite sets.

### Fusion should converge toward adaptive mode, but with bounded blast radius

Adaptive fusion module already includes dark-run and degraded contracts [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:228-253`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:333-341`]. That is exactly what a safe rollout needs.

The analysis suggests activating adaptive fusion in shadow mode first, compare order deltas/quality deltas, then switch for selected intents. This avoids replacing deterministic RRF globally on day one.

### Retrieval trace and telemetry are strategic assets

The handler already emits retrieval traces and telemetry signals [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:734-739`], [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:597-621`]. Those should be used as the primary control loop for rollout decisions, not anecdotal answer quality.
<!-- /ANCHOR:research-architecture-implications-for-system-spec-kit-138 -->

<!-- ANCHOR:research-decision-table-practical-adoption-impact-138 -->
## Decision table: practical adoption impact

| Pattern | Expected latency impact | Complexity impact | Maintainability impact | Net value |
|---|---:|---:|---:|---|
| SQL candidate narrowing pre-stage | Low to medium improvement (less downstream work) | Medium | Positive if planner stays small | High |
| Selective multi-query (2-3 rewrites max) | Medium cost | Medium | Neutral | Medium-high for ambiguous queries |
| Activate adaptive fusion with dark-run first | Minimal in dark-run, small in active mode | Medium | Positive if it replaces ad hoc constants over time | High |
| Uniform filter parity across vector/FTS/BM25 | Low | Low-medium | Strong positive (predictable behavior) | High |
| Full graph expansion by default | High cost | High | Negative unless tightly scoped | Low-medium |
<!-- /ANCHOR:research-decision-table-practical-adoption-impact-138 -->

<!-- ANCHOR:research-detailed-implementation-blueprint-code-level-138 -->
## Detailed implementation blueprint (code-level)

### A) Planner contract and stage budgets

To keep complexity bounded, define a small planner contract such as:

- `mode`: one of `fast_exact`, `balanced_hybrid`, `ambiguous_multiquery`, `structured_filter_heavy`.
- `budgetMs`: total retrieval budget.
- `pathBudgets`: per-path caps (`vector`, `fts`, `bm25`, optional graph boost).
- `policy`: includes rewrite count, fallback relaxation policy, and whether adaptive fusion can be active.

The existing post-search pipeline can remain unchanged and simply consume candidate lists generated by planner-selected paths [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:457-624`]. This separation minimizes blast radius because planner changes affect candidate generation, while ranking/post-processing remains stable.

[Assumes: planner decisions are deterministic for the same request payload and feature-flag state, to preserve cache usefulness and reproducibility.]

### B) Keep fallback ladder explicit and typed

WiredBrain's implementation is useful not because of exact algorithms, but because the fallback path is legible and ordered (file/session first, then vector, then text fallback, then enrichment) [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/WiredBrain-Hierarchical-Rag/src/retrieval/hybrid_retriever_v2.py:410-447`].

For system-spec-kit, the equivalent should be:

1. strict filter mode if query shape is structured,
2. hybrid search mode,
3. relaxed sparse fallback,
4. vector-only fallback,
5. explicit degraded response metadata.

The key is to avoid hidden branching. `adaptive-fusion.ts` already models degraded outcomes with `failure_mode`, `fallback_mode`, and `confidence_impact` [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:24-33`]. Reusing that envelope pattern across planner fallbacks improves observability and user trust.

### C) Normalize score semantics before fusion

`hybrid-search.ts` already normalizes per source in one path and uses RRF in another [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:283-304`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324-375`]. The recommendation is to make score semantics explicit at the fusion boundary:

- vector score interpreted as normalized relevance,
- lexical score interpreted as normalized relevance,
- graph/boost scores interpreted as bounded additive modifiers.

Without this contract, maintainers will keep adding compensating constants. That increases tuning debt and makes ranking regressions hard to diagnose.

### D) Promote dormant adaptive fusion by replacing constants, not layering more constants

A common anti-pattern is to keep deterministic RRF constants, add adaptive weights, then add additional boosts in later stages. This creates non-linear interactions. Instead, migrate in this order:

1. dark-run adaptive output versus standard output,
2. remove or reduce fixed convergence bonus once adaptive mode proves stable,
3. keep one canonical place where source weight policy is applied.

This works because adaptive fusion already includes intent and document-type shaping [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:87-117`].

### E) Preserve and extend resilience around indexing and dimension management

The vector index has important reliability behavior that should not be disturbed during retrieval changes:

- provider-specific embedding dimensions and mismatch detection [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:201-221`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:269-275`],
- deferred indexing fallback for BM25/FTS accessibility [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1708-1767`],
- schema migration transaction safety [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1045-1061`].

Any planner work that increases reliance on sparse fallbacks should include operational dashboards for deferred/pending embedding rows so retrieval quality issues are diagnosed as indexing state, not only ranker quality.
<!-- /ANCHOR:research-detailed-implementation-blueprint-code-level-138 -->

<!-- ANCHOR:research-failure-modes-to-design-around-138 -->
## Failure modes to design around

- **Latency amplification from multi-query fan-out.** Mitigate with hard rewrite caps and per-path budget cancellations.
- **Cache pollution from under-specified keys.** Mitigate by including all retrieval-semantic toggles in key args and validating with differential tests [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:750-775`].
- **Ranking instability from mixed additive boosts.** Mitigate by defining one score composition policy and tracking rank deltas in telemetry.
- **Operational drift between dense and sparse quality.** Mitigate with parity tests and controlled fallback relaxation similar to RAGFlow's retry pattern [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/ragflow/rag/nlp/search.py:135-147`].
<!-- /ANCHOR:research-failure-modes-to-design-around-138 -->

<!-- ANCHOR:research-bottom-line-138 -->
## Bottom line

The strongest hybrid-RAG pattern for this codebase is **not** "add more retrieval methods." It is **planner-led orchestration over existing methods**:

1. keep current vector + FTS + BM25 + post-pipeline core,
2. add SQL-first candidate narrowing and filter parity,
3. make multi-query selective,
4. graduate adaptive fusion from dormant module to measured rollout,
5. drive changes by retrieval traces/latency/error telemetry already present.

That path preserves the existing engineering strengths while directly addressing recall, precision, and observability gaps highlighted by both context notes and external implementations.
<!-- /ANCHOR:research-bottom-line-138 -->


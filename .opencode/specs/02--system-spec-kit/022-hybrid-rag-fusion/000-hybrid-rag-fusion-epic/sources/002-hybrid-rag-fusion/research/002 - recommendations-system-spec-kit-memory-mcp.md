# Recommendations: system-spec-kit Memory MCP Hybrid Retrieval Rollout

This document proposes a practical rollout to improve retrieval quality and resilience in system-spec-kit memory MCP/database, using patterns already present in the codebase plus selected external ideas.

[Assumes: retrieval quality is measured by downstream answer usefulness and citation relevance, not only raw top-k overlap.]

[Assumes: SQLite + sqlite-vec + FTS5 remain the storage/search foundation in the near term.]

<!-- ANCHOR:decision-what-to-adopt-138 -->
## What to Adopt

### 1) Add a lightweight retrieval planner before search execution

Adopt a planner that selects one of a small set of retrieval modes per request (e.g., `structured_filter_heavy`, `semantic_discovery`, `exact_lookup`, `ambiguous_multiquery`). The existing handler already has intent classification and a staged post-processing pipeline, so this can be layered in with low disruption [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:706-730`], [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:457-624`].

Why now:

- The context explicitly points to SQL + vector + sparse orchestration as the robust pattern for mixed data [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_1.md:64-73`].
- The current code has strong building blocks, but method selection is still mostly "hybrid then fallback" [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:842-953`].

### 2) Implement SQL candidate narrowing and enforce filter parity across retrievers

Introduce a candidate-ID preselection query in `memory_index` for strict filters (folder, tier, archival, state, document_type, quality score), then execute dense/sparse retrieval only within that candidate set when query shape indicates structure-heavy intent.

Rationale:

- `memory_index` already contains rich indexed metadata for this [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1435-1476`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1585-1612`].
- FTS already applies archival filtering, while BM25 path is less explicit in this module, so parity work should be a priority [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:150-152`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:79-84`].

### 3) Add selective multi-query expansion (not global)

Add query rewriting for only ambiguous/recall-sensitive intents and cap rewrites at 2-3. Fuse rewrite results with RRF, then pass into existing post-search pipeline.

Why selective:

- Multi-query + RRF addresses single-query blind spots [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_2.md:104-110`].
- Always-on multi-query increases latency and complexity [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_2.md:211-214`].

Implementation cue: follow RAGFlow-style retry relaxation discipline (strict first pass, then controlled relaxation) rather than jumping straight to broad expansion [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/ragflow/rag/nlp/search.py:135-147`].

### 4) Activate adaptive fusion through dark-run, then targeted enablement

Use `adaptive-fusion.ts` as the primary fusion evolution path, but stage rollout through dark-run and diff comparison first. The module already supports feature flags, degraded contracts, and dark-run diff output [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:72-76`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:24-33`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:333-341`].

This should eventually replace reliance on static bonus tuning in baseline RRF (`CONVERGENCE_BONUS = 0.10`) where a single constant may over-dominate ranking nuance [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts:19-21`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts:160-167`].

### 5) Keep and extend retrieval observability as a hard requirement

Every rollout stage should require retrieval trace and telemetry validation before promotion. The current handler already records stage-level traces and telemetry fields; use these as rollout gates [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:734-739`], [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:597-621`].

Additionally, copy GraphRAG's explicit introspection pattern by exposing retrieval-mode and index-health resources alongside search tools [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/graphrag_mcp/server.py:42-83`], [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/graphrag_mcp/server.py:85-118`].
<!-- /ANCHOR:decision-what-to-adopt-138 -->

<!-- ANCHOR:decision-what-to-avoid-138 -->
## What to Avoid

- **Avoid a big-bang retrieval rewrite.** Current memory search already has a stable fallback and post-processing stack; replacing it wholesale increases regression risk with limited upside [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:842-953`].
- **Avoid always-on multi-query.** Use it only where ambiguity and recall justify cost; otherwise p95 latency will drift upward without consistent gains [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/context/reddit_post_2.md:211-214`].
- **Avoid hidden filter divergence across retrievers.** If one path excludes archives and another does not, ranking output becomes non-deterministic and harder to trust [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:150-152`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260-262`].
- **Avoid score-weight tuning without telemetry.** RAGFlow uses explicit fusion weights and retries, making tuning inspectable; emulate that explicitness [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/ragflow/rag/nlp/search.py:127-129`], [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/ragflow/rag/nlp/search.py:135-147`].
- **Avoid expensive graph/context expansion by default.** WiredBrain and GraphRAG both imply context expansion should be explicit or stage-gated, not automatic for every query [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/WiredBrain-Hierarchical-Rag/src/retrieval/hybrid_retriever_v2.py:456-490`], [Source: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/scratch/ext-repos/graphrag_mcp/server.py:27-40`].
<!-- /ANCHOR:decision-what-to-avoid-138 -->

<!-- ANCHOR:decision-phased-plan-138 -->
## Phased Plan

### Phase 0: Safety and measurement baseline (1 week)

Deliverables:

- Add missing retrieval-impact parameters to cache-key inputs (including archival and quality thresholds) in `memory_search` cache args.
- Add metric labels for planner mode, fusion mode, and fallback reason in retrieval telemetry.
- Snapshot baseline quality/latency metrics on production-like query set.

Risk mitigation:

- Keep behavior unchanged, instrumentation only.
- Add unit tests to verify cache-key variation changes hit/miss behavior.

### Phase 1: Filter parity + SQL candidate narrowing (1-2 weeks)

Deliverables:

- Implement prefilter query for candidate IDs when request carries strong structural constraints.
- Ensure archival/tier/quality filtering semantics are consistent across vector, FTS, BM25 paths.
- Add regression tests for parity across methods.

Risk mitigation:

- Roll behind feature flag and compare top-k overlap against baseline.
- Fallback to current hybrid path if prefilter returns too few candidates.

### Phase 2: Selective multi-query expansion (2 weeks)

Deliverables:

- Add rewrite generator with strict cap (`max_rewrites=3`) and intent-based trigger rules.
- Fuse rewrite results using existing RRF path and pass into post-search pipeline.
- Add timeout budget per rewrite and global query budget.

Risk mitigation:

- Enable only for selected intents (start with `understand`/`find_spec`).
- Auto-disable rewrite branch when p95 exceeds target.

### Phase 3: Adaptive fusion dark-run and intent-gated activation (2 weeks)

Deliverables:

- Wire `hybridAdaptiveFuse` into retrieval path in dark-run mode first.
- Log `darkRunDiff` and quality deltas by intent/document type.
- Enable adaptive output for one intent class once deltas are stable.

Risk mitigation:

- Use built-in degraded fallback contract to standard RRF on error [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:320-330`].
- Maintain hard switch to deterministic fusion for incident response.

### Phase 4: Hardening and operations (ongoing)

Deliverables:

- Add retrieval health endpoint (mode usage, fallback rates, empty-result rates).
- Publish runbook for tuning: rewrite cap, fusion weights, similarity thresholds.
- Add periodic audit on embedding-dimension consistency and deferred-indexing backlog [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:242-275`], [Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1708-1767`].

Risk mitigation:

- Weekly rollback drills for feature flags.
- Canary by spec-folder subsets before global rollout.
<!-- /ANCHOR:decision-phased-plan-138 -->

<!-- ANCHOR:decision-validation-metrics-138 -->
## Validation Metrics

Use both quality and operational metrics. Promotion between phases requires passing all P0 metrics and at least two P1 metrics.

| Priority | Metric | Target | Why it matters |
|---|---|---|---|
| P0 | p95 retrieval latency | `<= +20%` vs baseline per intent | Prevent silent quality-for-latency regressions |
| P0 | Empty-result rate | `<= baseline` (no increase) | Detect over-restrictive filtering/planning |
| P0 | Error/fallback rate | No sustained increase; degraded fallback functioning | Confirms resilience of staged rollout |
| P0 | Archive filter correctness | 100% pass on parity tests | Guarantees predictable retrieval semantics |
| P1 | Recall@k on curated test set | `+8-15%` for ambiguous queries | Primary expected benefit of selective multi-query |
| P1 | Precision@k on exact-match queries | `+5%` or no regression | Validates sparse + structured improvements |
| P1 | Citation relevance score | Measurable lift in evaluator rubric | Ties retrieval changes to answer grounding |
| P1 | Session dedup token savings | No regression from current baseline | Preserves one existing efficiency advantage [Source: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:975-992`] |
| P2 | Top-1 stability across retries | Improved or equal | Operational consistency indicator |

[Assumes: a representative eval set exists across at least these intent buckets: `understand`, `find_spec`, `fix_bug`, `refactor`, `add_feature`.]

[Assumes: latency is measured end-to-end at tool boundary, including embedding generation and reranking when enabled.]
<!-- /ANCHOR:decision-validation-metrics-138 -->

<!-- ANCHOR:decision-recommended-success-criteria-for-this-spec-138 -->
## Recommended success criteria for this spec

- Hybrid planner and filter parity are fully shipped behind flags with no P0 regressions.
- Adaptive fusion is integrated in dark-run and enabled for at least one intent with documented gains.
- Multi-query branch is selective, budgeted, and demonstrably improves ambiguous-query recall.
- Operational runbook and telemetry dashboards are in place so tuning is repeatable, not tribal knowledge.
<!-- /ANCHOR:decision-recommended-success-criteria-for-this-spec-138 -->


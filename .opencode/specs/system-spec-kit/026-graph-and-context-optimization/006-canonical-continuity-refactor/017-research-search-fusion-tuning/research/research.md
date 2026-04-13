# Research Synthesis: Search Fusion Weight Optimization and Reranking Threshold Calibration

## Scope

This packet investigated fusion-weight optimization and rerank-threshold calibration for continuity-oriented system-spec-kit MCP searches. The work was read-only against the current codebase, limited to packet-local research artifacts, and used synthetic reasoning plus repo-native eval fixtures rather than historical saves.

## Method

The 10-iteration loop covered four layers:

1. Inventory hardcoded constants across Stage 1, Stage 2, Stage 3, cross-encoder, and `search-weights.json`.
2. Trace the real hybrid fusion control path through `hybrid-search.ts`, shared adaptive fusion, and shared RRF.
3. Reuse existing K-sensitivity and reranker comparison fixtures already shipped in the repo.
4. Run small packet-local corpus probes where the code alone was insufficient, especially for length-penalty fit.

## Core Findings

### RQ-1: What `search-weights.json` values produce best precision@5/10?

The key answer is that `search-weights.json` is no longer the dominant precision lever for hybrid continuity searches.

- The file only feeds vector smart-ranking with `relevance=0.5`, `recency=0.3`, and `access=0.2`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:21] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:967]
- The config README explicitly notes that `rrfFusion` and `crossEncoder` sections were removed as dead config. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:40]
- Hybrid continuity ranking is assembled in `hybrid-search.ts` using adaptive intent weights and shared RRF. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221]

Recommended interpretation:

- Keep `search-weights.json` unchanged for now unless the target is specifically vector-only smart ranking.
- For continuity-oriented hybrid search, use a profile closer to `find_spec` or `find_decision` than to the default profile.
- The strongest practical lever is intent-specific RRF K plus graph/spec weighting, not the current JSON file.

Continuity-friendly weight envelope:

| Profile | Semantic | Keyword | Recency | Graph |
|---|---:|---:|---:|---:|
| `find_spec` normalized | 0.5385 | 0.1538 | 0.0769 | 0.2308 |
| `find_decision` normalized | 0.2727 | 0.1818 | 0.0909 | 0.4545 |
| Suggested continuity range | 0.50-0.55 | 0.15-0.20 | <=0.08 | 0.23-0.30 |

[SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60] [INFERENCE: packet-local normalization and continuity mapping]

### RQ-2: Is the FSRS decay constant `0.2346` appropriate for spec-doc continuity?

Yes, but only in the sense that it is canonical and should not be packet-locally retuned.

- The scheduler establishes FSRS long-term decay as `R(t) = (1 + 19/81 * t/S)^(-0.5)`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:10]
- Cognitive docs restate the same invariant and explain why it exists. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:121]
- Search-time decay comments in `vector-index-store.ts` point back to the same formula. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:7]

Conclusion:

- Do not retune `0.2346` for continuity search alone.
- If continuity retrieval needs different time behavior, tune the inputs around the invariant:
  - Stability growth and review cadence
  - Unreviewed fallback half-life behavior
  - Stage 2 recency fusion weight/cap

### RQ-3: What is the latency profile across reranking providers?

Only a bounded answer is possible from the current repo state.

- Static provider contracts:
  - Voyage: `maxDocuments=100`, `timeout=15000`
  - Cohere: `maxDocuments=100`, `timeout=15000`
  - Local: `maxDocuments=50`, `timeout=30000`
  [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35]
- Runtime telemetry surface:
  - The reranker only tracks in-memory `avg`, `p95`, and `count`.
  - No persisted per-provider latency history exists in code.
  [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:458] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499]

Quality-side comparison from repo fixtures:

| Ordering source | Avg P@5 | Avg RR@5 |
|---|---:|---:|
| Baseline input order | 0.48 | 0.5167 |
| Voyage fixtures | 0.48 | 0.8667 |
| Cohere fixtures | 0.48 | 0.9000 |

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:21] [INFERENCE: packet-local metric computation over the fixture rank orders]

Recommendation:

- Treat Cohere and Voyage as materially better than fallback for first-hit precision in the current fixture corpus.
- Do not claim live latency distributions until provider-tagged telemetry is added.

### RQ-4: Do the cross-encoder length penalties help or hurt for spec-doc content?

The current thresholds likely hurt spec-doc continuity retrieval.

- Length penalties are hardcoded as:
  - `<50` chars => `0.9`
  - `>2000` chars => `0.95`
  [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62]
- Packet-local corpus probe over `.opencode/specs/system-spec-kit/**/*.md` found:
  - `5966` markdown files total
  - `0` below 50 chars
  - `4690` above 2000 chars (`78.6%`)
  - median length `5666`
  [INFERENCE: packet-local corpus probe]

Conclusion:

- The short penalty is effectively irrelevant for this corpus.
- The long penalty triggers on the dominant document shape, so it behaves as a near-global 5 percent demotion against the very documents continuity search usually wants.

Recommendation:

- Raise the long threshold substantially, or remove it entirely for spec-doc continuity paths.
- A safe first implementation experiment would be:
  - keep the short threshold unchanged
  - raise `longThreshold` from `2000` to at least `8000`
  - or gate long-penalty application to chunk/snippet mode instead of parent-doc mode

### RQ-5: What is the cache hit rate at the current 5-minute TTL?

Current code cannot answer that question.

- The reranker cache is a `Map` with `CACHE_TTL=300000` and `MAX_CACHE_ENTRIES=200`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:115]
- Cache hits are used internally during reranking, but no hit/miss counter is incremented or exposed. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:424]
- The exported status surface only reports provider and latency sample count. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499]

Recommendation:

- Keep the 5-minute TTL until instrumentation exists.
- Add:
  - hit count
  - miss count
  - stale-hit count
  - eviction count
  - provider-tagged cache outcomes
- Revisit TTL only after those counters are available on real continuity-query traffic.

## Cross-Cutting Recommendations

### 1. Reframe the tuning surface

If the implementation goal is continuity precision, do not start with `search-weights.json`.

Primary levers:
- adaptive intent profile selection
- RRF K selection
- graph weight for spec/decision continuity
- rerank minimum-candidate threshold
- long-document penalty behavior

Secondary lever:
- vector smart-ranking JSON weights

### 2. Make continuity tuning explicit

Current code has no dedicated `continuity` intent. Continuity queries are currently closest to a blend of `find_spec` and `find_decision`.

Suggested first continuity profile:
- semantic `0.52`
- keyword `0.18`
- recency `0.07`
- graph `0.23`

[INFERENCE: derived from normalized `find_spec` plus continuity source-of-truth requirements]

### 3. Revisit RRF K by intent

The repo already includes an intent-aware K sweep. That should be extended to continuity-style judged queries instead of relying on a single default.

Suggested direction:
- continuity / understand-like discovery: test `K=60-80`
- literal / exact navigation: test `K=10-20`

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:127] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:98]

### 4. Raise the rerank floor

The current Stage 3 minimum rerank threshold is `2`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49]

Recommendation:
- continuity search should test `MIN_RESULTS_FOR_RERANK=4` or `5`

[INFERENCE: 2-document reranks offer limited ordering gain while still incurring reranker cost]

## Recommended Implementation Order

1. Add cache hit/miss telemetry and provider-tagged latency counters.
2. Introduce a dedicated continuity fusion config surface.
3. A/B test raising or disabling the long-document penalty.
4. Evaluate a higher minimum rerank candidate threshold.
5. Extend the judged K-sweep harness with continuity-specific queries and labels.

## Confidence and Limits

High-confidence conclusions:
- `search-weights.json` is secondary for hybrid fusion
- FSRS `0.2346` is canonical and should not be packet-locally retuned
- Long-document penalty is mismatched to the actual spec-doc corpus
- Cache hit rate is not observable from current code

Bounded-confidence conclusions:
- Cohere is slightly ahead of Voyage on the current fixture RR@5, but this is fixture evidence, not live traffic telemetry
- Raising the rerank minimum threshold is a strong recommendation, but still needs measured validation after instrumentation lands

# Research Synthesis: Search Fusion Weight Optimization and Safe Continuity-Focused Follow-Ons

## Scope

This packet investigated fusion-weight optimization and rerank-threshold calibration for continuity-oriented system-spec-kit MCP searches, then resumed for a second 10-iteration pass to answer how the recommended changes can be implemented safely. The work stayed read-only against runtime code and wrote only packet-local research artifacts.

## Method

The full 20-iteration loop covered five layers:

1. Inventory hardcoded constants across Stage 1, Stage 2, Stage 3, cross-encoder, and `search-weights.json`.
2. Trace the real hybrid fusion control path through `hybrid-search.ts`, shared adaptive fusion, and shared RRF.
3. Reuse existing K-sensitivity and reranker comparison fixtures already shipped in the repo.
4. Run packet-local corpus probes where the code alone was insufficient, especially for length-penalty fit.
5. In the resumed loop, trace request contracts, routing surfaces, and test suites to turn the earlier "what to change" conclusions into safe implementation guidance.

<!-- ANCHOR:core-findings-1-10 -->
## Core Findings from Iterations 1-10

### 1. `search-weights.json` is not the primary continuity-fusion control surface

- The file only feeds vector smart-ranking with `relevance=0.5`, `recency=0.3`, and `access=0.2`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:21] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:967]
- The config README explicitly notes that `rrfFusion` and `crossEncoder` sections were removed as dead config. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:40]
- Hybrid continuity ranking is assembled in `hybrid-search.ts` using adaptive intent weights and shared RRF. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221]

Practical result:

- Leave `search-weights.json` alone unless the target is specifically vector-only smart ranking.
- For continuity-oriented hybrid search, the stronger levers are adaptive profile weights, graph emphasis, and intent-specific RRF K.

### 2. FSRS `0.2346` is canonical and should not be retuned here

- The scheduler establishes FSRS long-term decay as `R(t) = (1 + 19/81 * t/S)^(-0.5)`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:10]
- Cognitive docs and search-time decay comments point back to the same invariant. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:121] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:7]

Practical result:

- Do not retune `0.2346` for continuity search alone.
- If continuity retrieval needs different temporal behavior, tune inputs around the invariant instead.

### 3. Provider quality can be compared from fixtures, but live latency cannot

- Static provider contracts exist for Voyage, Cohere, and local rerankers. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35]
- The current reranker status surface only tracks in-memory latency `avg`, `p95`, and `count`; there is no persisted per-provider telemetry. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:458] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499]
- Fixture-based comparison shows Cohere slightly ahead of Voyage on RR@5 in the current corpus. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:21]

Practical result:

- Treat Cohere and Voyage as better than fallback for first-hit ranking in the current fixture corpus.
- Do not claim live latency distributions until provider-tagged telemetry exists.

### 4. The length penalty is a poor fit for the actual spec-doc corpus

- Length penalties are hardcoded in `cross-encoder.ts`:
  - `<50` chars => `0.9`
  - `>2000` chars => `0.95`
  [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62]
- Packet-local corpus probing over `.opencode/specs/system-spec-kit/**/*.md` showed `78.6%` of markdown files exceed 2000 characters. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/research/iterations/iteration-008.md:7] [INFERENCE: packet-local corpus probe result reused in synthesis]

Practical result:

- The short penalty is basically irrelevant.
- The long penalty acts as a near-global demotion against the exact documents continuity search most often wants.
- User decision for implementation is now explicit: remove the length penalty entirely.

### 5. Cache TTL should not be changed before observability exists

- The reranker cache uses `CACHE_TTL=300000` and `MAX_CACHE_ENTRIES=200`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:116]
- Cache hits are used internally but no hit/miss counters are recorded or exposed. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:424]

Practical result:

- Keep the 5-minute TTL until instrumentation lands.

<!-- /ANCHOR:core-findings-1-10 -->

<!-- ANCHOR:resumed-findings-11-20 -->
## Resumed Findings from Iterations 11-20

### 6. Safe length-penalty removal requires behavior deletion plus temporary compatibility

The production scoring logic is localized in `cross-encoder.ts`, but the request contract is not:

- `applyLengthPenalty` is a public argument in schemas, tool metadata, runtime types, handler defaults, pipeline config, cache-key construction, and shadow replay config. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:160] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:137] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/types.ts:69] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:643] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:235]
- Four dedicated suites currently assert the exact penalty thresholds and helper names: `cross-encoder.vitest.ts`, `cross-encoder-extended.vitest.ts`, `search-extended.vitest.ts`, and `search-limits-scoring.vitest.ts`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:8] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:74] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:199] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:158]

Safe implementation guidance for phase `001-remove-length-penalty`:

1. Delete `LENGTH_PENALTY`, `calculateLengthPenalty()`, `applyLengthPenalty()`, and the scoring branch in `rerankResults()`.
2. Keep the `applyLengthPenalty` argument accepted for one compatibility cycle, but make it inert.
3. Rewrite penalty-specific tests from "old math exists" to "flag is compatibility-only / content length no longer changes reranker scores".
4. Defer full contract cleanup (schema/tool argument deletion) to a separate cleanup phase if desired.

### 7. The best reranker-telemetry contract is a `cache` block on `RerankerStatus`

The repo already has the mechanics needed for the requested counters:

- valid hit: fresh entry returned
- miss: cache key absent
- stale hit: key found but expired
- eviction: `enforceCacheBound()` removes the oldest entry

The cleanest shape is:

```ts
interface RerankerStatus {
  available: boolean;
  provider: string | null;
  model: string | null;
  latency: { avg: number; p95: number; count: number };
  cache: {
    hits: number;
    misses: number;
    staleHits: number;
    evictions: number;
    entries: number;
    maxEntries: number;
    ttlMs: number;
  };
}
```

Why this shape:

- It matches the current module-level status pattern in `cross-encoder.ts`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:100]
- It keeps cache telemetry process-scoped rather than polluting per-document results.
- `resetSession()` already owns cache/latency/circuit-breaker cleanup, so the new counters can share the same reset boundary. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:525]

Exposure guidance:

- Canonical source: `getRerankerStatus()`.
- Optional mirror surface: retrieval telemetry, because it already owns `rerankLatencyMs` and per-request observability. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:57]

### 8. The continuity profile can be narrow or broad, and the packet should choose explicitly

Minimal implementation scope:

- Add `continuity` to `INTENT_WEIGHT_PROFILES` in `adaptive-fusion.ts`.
- Keep the suggested weights: semantic `0.52`, keyword `0.18`, recency `0.07`, graph `0.23`.
- Wire explicit internal callers to pass `'continuity'`.

This works because:

- `getAdaptiveWeights(intent: string)` is string-typed, not union-typed. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:137]
- `hybrid-search.ts` also treats intent as a string before calling adaptive fusion. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1223]

Broader public-intent scope:

- If continuity must become a public search intent accepted by `memory_search`, the blast radius expands into:
  - `IntentType`, intent keywords/patterns/centroids, weight adjustments, scores, descriptions, auto-profile mapping, lambda mapping in `intent-classifier.ts`
  - BM25-preserving behavior in `query-router.ts`
  - fallback artifact mapping in `artifact-routing.ts`
  - intent-related tests that currently assert the 7-intent universe. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:209] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:53] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:321]

Safe phase-003 guidance:

- Decide up front whether the phase is "new adaptive-fusion profile" or "new public intent".
- Do not allow it to silently become both.

### 9. The rerank minimum should move to 4 first, and the fallout is localized

Key observation:

- `MIN_RESULTS_FOR_RERANK` is enforced in Stage 3 only, not in `cross-encoder.rerankResults()`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321]

Why `4` is safer than `5`:

- At `4`, 2- and 3-result candidate sets skip reranking, but 4-result sets still get neural ordering.
- At `5`, every 4-result continuity query also loses reranking, which is a stronger unmeasured shift.

Current test fallout:

- The direct Stage 3 regression suite uses 2-row fixtures and currently expects reranking to apply. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:42] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:70] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:93]
- Direct `crossEncoder.rerankResults()` tests are not threshold-sensitive and can stay as-is. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:177] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:349]

Safe phase-004 guidance:

1. Set `MIN_RESULTS_FOR_RERANK = 4`.
2. Expand the first three `stage3-rerank-regression.vitest.ts` fixtures to 4 rows.
3. Add explicit threshold assertions:
   - 3 rows => `applied === false`
   - 4 rows => `applied === true`
4. Leave direct cross-encoder suites alone unless they later import Stage 3 helpers.

### 10. Continuity-specific K sweeps are possible now, but the lowest-cost harness is not the typed judged sweep

The repo has two useful K-evaluation paths:

1. `IntentKOptimizationQuery` / `optimizeKValuesByIntent()`
   - `intent` is a plain string
   - can accept `continuity` immediately
   - good for precomputed rankings and focused calibration work

2. `JudgedQuery` / `runJudgedKSweep()`
   - `intent` is typed as `IntentClass`
   - continuity is not currently in the union
   - better for broader typed evaluation, but only after the public intent story is settled

Evidence:

- `IntentKOptimizationQuery` is string-typed. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:402]
- `JudgedQuery.intent` is union-typed. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:339]

Safe K-sweep guidance:

- Add continuity-specific queries first to `k-value-optimization.vitest.ts`.
- Use prompts centered on continuity recovery:
  - "resume the packet from the last safe action"
  - "what changed in this spec folder since the last session"
  - "where was this implementation decision recorded"
  - "continue the canonical continuity refactor"
- Only extend the typed judged sweep if continuity later becomes a real public intent.

<!-- /ANCHOR:resumed-findings-11-20 -->

<!-- ANCHOR:recommended-implementation-order -->
## Recommended Implementation Order

1. Phase `002-add-reranker-telemetry`
   - Establish cache counters and status source of truth first.
2. Phase `001-remove-length-penalty`
   - Remove the behavior, keep temporary request-contract compatibility.
3. Phase `004-raise-rerank-minimum`
   - Move to `4`, not `5`, and patch the threshold-sensitive Stage 3 tests.
4. Phase `003-continuity-search-profile`
   - Implement only at the explicitly chosen scope.
5. Continuity-specific K-sweep extension
   - Run as supporting validation through `k-value-optimization.vitest.ts`.

<!-- /ANCHOR:recommended-implementation-order -->

<!-- ANCHOR:confidence-and-limits -->
## Confidence and Limits

High-confidence conclusions:

- `search-weights.json` is secondary for hybrid continuity fusion
- FSRS `0.2346` is canonical and should not be retuned here
- The length penalty should be removed entirely for this packet
- Cache TTL should not be changed before counters exist
- `MIN_RESULTS_FOR_RERANK = 4` is a safer first step than `5`
- The continuity profile can be added narrowly in adaptive fusion without forcing an immediate public-intent refactor

Bounded-confidence conclusions:

- Cohere is slightly ahead of Voyage on the current fixture RR@5, but this is fixture evidence, not live traffic telemetry
- Retrieval telemetry is the best mirror surface for cache counters, but that should remain a follow-on to the core status patch
- Whether continuity should become a first-class public search intent is now a scoping decision, not an unanswered technical mystery
<!-- /ANCHOR:confidence-and-limits -->

---
title: "...advisor/001-search-and-routing-tuning/001-search-fusion-tuning/research/010-search-and-routing-tuning-pt-01/research]"
description: "This packet investigated fusion-weight optimization and rerank-threshold calibration for continuity-oriented system-spec-kit MCP searches, then resumed for a second 10-iteration..."
trigger_phrases:
  - "advisor"
  - "001"
  - "search"
  - "and"
  - "routing"
  - "research"
  - "010"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/research/010-search-and-routing-tuning-pt-01"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Research Synthesis: Search Fusion Weight Optimization and Safe Continuity-Focused Follow-Ons

## Scope

This packet investigated fusion-weight optimization and rerank-threshold calibration for continuity-oriented system-spec-kit MCP searches, then resumed for a second 10-iteration pass to answer how the recommended changes can be implemented safely, then ran a 5-iteration convergence wave to finalize an implementation-ready handoff, and finally extended through a 10-iteration post-implementation audit after the four follow-on sub-phases and doc-alignment work shipped. The work stayed read-only against runtime code and wrote only packet-local research artifacts.

## Method

The full 25-iteration loop covered six layers:

1. Inventory hardcoded constants across Stage 1, Stage 2, Stage 3, cross-encoder, and `search-weights.json`.
2. Trace the real hybrid fusion control path through `hybrid-search.ts`, shared adaptive fusion, and shared RRF.
3. Reuse existing K-sensitivity and reranker comparison fixtures already shipped in the repo.
4. Run packet-local corpus probes where the code alone was insufficient, especially for length-penalty fit.
5. In the resumed loop, trace request contracts, routing surfaces, and test suites to turn the earlier "what to change" conclusions into safe implementation guidance.
6. In the final convergence loop, cross-validate the recommendations against each other, rank the sub-phases by combined impact and risk, capture rollout edge cases, and turn the K-sweep follow-up into a low-risk supporting validation plan.
7. In the post-implementation loop, trace the shipped runtime end to end, inspect the reranker telemetry semantics, verify doc alignment against the live code, and define the next research phase based on the remaining contract gaps rather than on more weight tuning.

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

## Convergence Findings from Iterations 21-25

### 11. The late-stage recommendations are internally consistent; the only contradiction found was packet-local artifact drift

- Re-reading the current code and test surfaces against the packet’s own conclusions did not uncover a runtime contradiction. The guidance around telemetry, length-penalty removal, rerank minimum, continuity scope, and K sweeps still fits together. [SOURCE: research/iterations/iteration-021.md:7]
- The only drift found during convergence was in the research packet itself: `deep-research-config.json` still capped the loop at `10` and the dashboard still reflected `10/10` even though the state log already contained `20` completed iterations. [SOURCE: research/iterations/iteration-021.md:9]

Practical result:

- Treat the current recommendations as a coherent sequence, not as competing options.
- Keep reducer-owned packet artifacts synchronized whenever a deep-research lineage is manually extended.

### 12. The best implementation order is driven by impact-to-risk ratio, not by novelty

Combined ranking:

1. `002-add-reranker-telemetry`
2. `001-remove-length-penalty`
3. `004-raise-rerank-minimum`
4. `003-continuity-search-profile`

Why this order:

- Phase `002` is the best first move because it adds observability with the lowest behavior risk and establishes data for later tuning. [SOURCE: research/iterations/iteration-022.md:7]
- Phase `001` is second because it removes the clearest continuity regression, but it still carries compatibility and test fallout. [SOURCE: research/iterations/iteration-022.md:8]
- Phase `004` is third because its Stage 3 blast radius is localized, but its user-facing effect is smaller than phase `001`. [SOURCE: research/iterations/iteration-022.md:9]
- Phase `003` is last because it has the widest potential upside and the widest potential blast radius, depending on whether it stays narrow or becomes a public intent. [SOURCE: research/iterations/iteration-022.md:10]

### 13. The main edge cases are no longer theoretical

- Raising `MIN_RESULTS_FOR_RERANK` to `4` changes local GGUF reranking too, because the Stage 3 minimum-results guard runs before the local reranker branch. This is a Stage 3 policy shift, not just a cloud-reranker optimization. [SOURCE: research/iterations/iteration-023.md:7]
- Keeping `applyLengthPenalty` as a no-op preserves compatibility, but the cache key still carries the `lp` option bit. That means identical results may temporarily occupy separate cache buckets until the flag is fully removed. [SOURCE: research/iterations/iteration-023.md:8]
- Cache counters need explicit semantics during implementation: `resetSession()` must clear them, and the packet should decide whether they represent process-wide activity or per-provider activity. [SOURCE: research/iterations/iteration-023.md:9]
- Broad public continuity intent remains the riskiest partial rollout because classifier enums, query routing, artifact routing, tool schemas, and test datasets all move together. [SOURCE: research/iterations/iteration-023.md:10]

### 14. The K-sweep follow-up can proceed now without destabilizing the typed evaluation path

- The lowest-risk extension point remains `optimizeKValuesByIntent()` and `k-value-optimization.vitest.ts`. That path already groups by arbitrary string keys, so a new `continuity` bucket can be added without changing `IntentClass`. [SOURCE: research/iterations/iteration-024.md:7] [SOURCE: research/iterations/iteration-024.md:8]
- The typed judged sweep should stay deferred because both `JudgedQuery.intent` and its test helper are union-locked to the current intent set. [SOURCE: research/iterations/iteration-024.md:9]

Practical result:

- Add continuity-specific judged queries first to `k-value-optimization.vitest.ts`.
- Keep the typed judged sweep and ground-truth dataset unchanged unless continuity later becomes a real public intent.

### 15. The remaining phase-003 scope question is now resolved: go narrow first

- The final convergence pass resolves the last open strategy question in favor of the narrow internal scope: add `continuity` only at the adaptive-fusion/internal-caller seam, then validate it through the string-typed K harness. [SOURCE: research/iterations/iteration-025.md:8]
- Public continuity intent should be treated as a separate follow-on only if operator-facing APIs truly need an explicit new intent value. [SOURCE: research/iterations/iteration-025.md:8]

Practical result:

- Phase `003` should not silently expand into classifier, router, schema, and test-union work.
- The supporting K-sweep belongs with the narrow profile first and is not a blocker for phases `001`, `002`, or `004`.

<!-- ANCHOR:recommended-implementation-order -->
## Recommended Implementation Order

1. Phase `002-add-reranker-telemetry`
   - Establish cache counters and status source of truth first.
   - Define whether counters are process-wide or provider-scoped, and reset them in `resetSession()`.
2. Phase `001-remove-length-penalty`
   - Remove the behavior, keep temporary request-contract compatibility.
   - Accept the short-lived cache-key duplication (`lp` vs non-`lp`) until the flag is formally retired.
3. Phase `004-raise-rerank-minimum`
   - Move to `4`, not `5`, and patch the threshold-sensitive Stage 3 tests.
   - Document that this also changes local GGUF reranking behavior for 2-3 result sets.
4. Phase `003-continuity-search-profile`
   - Implement only at the explicitly chosen scope.
   - Chosen scope from this research pass: narrow adaptive-fusion/internal-caller seam first.
5. Continuity-specific K-sweep extension
   - Run as supporting validation through `k-value-optimization.vitest.ts`.
   - Defer the typed judged sweep until and unless continuity becomes a public intent.

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
- The packet’s recommendations do not contradict one another; they form a stable execution order of `002 -> 001 -> 004 -> 003`

Bounded-confidence conclusions:

- Cohere is slightly ahead of Voyage on the current fixture RR@5, but this is fixture evidence, not live traffic telemetry
- Retrieval telemetry is the best mirror surface for cache counters, but that should remain a follow-on to the core status patch
- Whether continuity should become a first-class public search intent is now a product/surface decision, not an unanswered technical mystery
- Cache-counter provider semantics still need an explicit implementation choice because the current cache map is process-wide while the status surface reports a single active provider

## Post-Implementation Findings from Iterations 26-35

### 16. Continuity fusion is live for search-style calls, but continuity-specific Stage 3 MMR is not

- `handleMemorySearch()` now carries two intent values: `detectedIntent` remains the public classifier result, while `adaptiveFusionIntent` is rewritten to `continuity` when `profile === 'resume'`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:816] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:900]
- Stage 1 uses `adaptiveFusionIntent` when it hands intent into hybrid search, and hybrid fusion reads that string to load the continuity weights from `adaptive-fusion.ts`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:534] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221] [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:53]
- Stage 3 still reads `config.detectedIntent` for the MMR lambda, and the orchestrator forwards the unchanged config object. So a `profile: 'resume'` search can fuse as `continuity` and still diversify as `understand` (or whatever public intent was detected). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:153] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:113] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:206]

Practical result:

- The continuity profile is only partially wired end to end in the search pipeline today.
- If the intended design is "continuity affects both fusion and Stage 3 diversity", a follow-on phase still needs to unify the Stage 3 intent source.

### 17. Canonical `/spec_kit:resume` does not use the search pipeline at all

- `memory_context` treats `resume` as a dedicated ladder strategy and returns `handover.md -> _memory.continuity -> spec docs` directly. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:776] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1097]
- The resume-mode regression test makes that contract explicit by failing if `handleMemorySearch()` is called. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:6]
- `session_resume` documents its first sub-call as `memory_context(mode=resume, profile=resume)`, so the operator-facing recovery surface inherits the direct-doc ladder rather than the 4-stage retrieval path. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:14]

Practical result:

- The continuity profile is not part of the canonical packet-recovery path today.
- Documentation should distinguish canonical resume from search-style `profile='resume'` retrieval instead of treating them as one surface.

### 18. The new reranker telemetry is inspection-grade, not dashboard-grade

- `getRerankerStatus()` now exposes latency `avg`, `p95`, `count` and cache `hits`, `misses`, `staleHits`, `evictions`, `entries`, `maxEntries`, and `ttlMs`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:100] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516]
- The stale-cache path increments `misses`, `staleHits`, and `evictions` together before deleting the entry. Capacity-pressure eviction increments the same `evictions` counter. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442]
- `resetSession()` clears cache counters, latency samples, and circuit-breaker state, but the status payload does not expose reset time, provider-scoped counters, failure counts, or circuit-open status. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:171] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551]

Practical result:

- The status surface is now good for local inspection and basic validation.
- A real monitoring dashboard still needs semantic refinements: separate expiry vs capacity eviction, explicit scope semantics, reset markers, and failure/circuit context.

### 19. Documentation alignment is mixed rather than broadly stale

- `SKILL.md` is accurate at the summary level: it correctly describes the 4-stage pipeline, the rerank minimum of `4`, the compatibility-only `applyLengthPenalty`, and the presence of cache telemetry. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:592]
- `ARCHITECTURE.md` and `configs/README.md` get the constants right but overstate the continuity-lambda story by implying that continuity-oriented reranking is live end to end. [SOURCE: .opencode/skill/system-spec-kit/ARCHITECTURE.md:150] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:50]
- The feature-catalog page for the 4-stage pipeline repeats the same stronger claim. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:25]

Practical result:

- Search-document wording should shift from "resume-style searches use the continuity lambda" to a more precise split:
  - continuity weights are live in adaptive fusion for search-style calls
  - Stage 3 still keys MMR off `detectedIntent`
  - canonical `/spec_kit:resume` bypasses the search pipeline entirely

### 20. The shipped changes are stable, but the subtle Stage 3 contract still matters

- The length penalty is fully retired as a ranking behavior: `calculateLengthPenalty()` always returns `1.0`, `applyLengthPenalty()` returns a cloned result set unchanged, and the targeted no-op tests remain green. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:176]
- Cache reuse now ignores the old length-penalty flag, so identical rerank calls no longer split across `applyLengthPenalty=true/false` buckets. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:431] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:482]
- `MIN_RESULTS_FOR_RERANK = 4` is correctly test-covered for both cloud and local rerankers, but 2-3 result sets can still be reordered when MMR is enabled because `MMR_MIN_CANDIDATES` remains `2`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:206] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:136] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:164]

Practical result:

- No urgent re-tuning is needed after shipping.
- The main residual runtime issue is the Stage 3 intent-source split, especially for small result sets where reranking is skipped but MMR still applies.

## Recommended Next Research Phase

1. Decide how Stage 3 should choose its intent signal.
   - Candidates: reuse `adaptiveFusionIntent`, introduce a dedicated `stage3Intent`, or explicitly keep Stage 3 tied to public intents only.
2. Decide whether any operator-facing surface truly needs search-pipeline continuity behavior.
   - The canonical answer may be "no" because `/spec_kit:resume` already bypasses the search pipeline.
3. Define dashboard-grade reranker telemetry semantics.
   - Separate stale expiry from capacity eviction, expose scope/reset/failure context, and decide provider-vs-process aggregation.
4. Tighten doc wording once the intended contract is explicit.
   - `SKILL.md` can stay mostly as-is.
   - `ARCHITECTURE.md`, `configs/README.md`, and repeated feature-catalog wording should stop implying that the continuity lambda is already live end to end.
<!-- /ANCHOR:confidence-and-limits -->

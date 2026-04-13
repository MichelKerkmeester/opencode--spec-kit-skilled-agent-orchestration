---
title: Deep Research Strategy
description: Runtime strategy for packet 017 search fusion and reranking tuning.
---

# Deep Research Strategy - Search Fusion & Reranking Tuning

Runtime packet for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning`.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Track the 20-iteration investigation into fusion weights, RRF calibration, reranker thresholds, FSRS decay assumptions, cache observability, and the safest implementation seams for the packet’s four follow-on implementation phases.

### Usage

- Iterations 1-10 established the "what should change" recommendations.
- Iterations 11-20 resumed the loop to answer "how do we change it safely" without modifying source files.
- This state reflects the post-resume strategy and implementation-facing guidance for packet-local follow-on work.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Search fusion weight optimization, reranking threshold calibration, and safe implementation guidance for continuity-oriented system-spec-kit MCP searches.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Decide whether phase `003-continuity-search-profile` should stay adaptive-fusion-only or widen into a public continuity intent across classifier/routing/tool surfaces.

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- No source edits under `.opencode/skill/system-spec-kit/mcp_server/`
- No historical memory-save analysis or telemetry backfill
- No provider live benchmarking that requires external credentials or a running local reranker
- No packet-wide implementation plan outside the `research/` directory

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Complete 20 packet-local iterations
- Address RQ-1 through RQ-10 with either evidence-backed answers or explicit bounded unknowns
- Produce implementation-facing recommendations for phases `001`-`004` and the continuity-specific K-sweep follow-up without changing runtime code

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- `RQ-1` answered: `search-weights.json` is not the main fusion control surface. It only feeds vector smart-ranking, while hybrid fusion is driven by `adaptive-fusion.ts`, `rrf-fusion.ts`, and `hybrid-search.ts`. Best precision work should target those levers instead. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:21] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:967] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221]
- `RQ-2` answered: the `0.2346` constant is a canonical FSRS v4 invariant reused across scheduler docs and search-time decay consumers, so it should not be retuned just for continuity search. Tune stability inputs or unreviewed fallback behavior instead. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:10] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:121] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:7]
- `RQ-3` answered with bounded evidence: provider latency instrumentation exists only as in-memory avg/p95/count plus static timeouts. Fixture quality comparisons show Cohere and Voyage both improve first-hit ranking over baseline, with Cohere slightly ahead on RR@5 in the project fixture corpus. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:458] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:21]
- `RQ-4` answered: the long penalty is mismatched to the actual spec-doc corpus shape and should be removed entirely for this packet. The short penalty is equally unjustified in this embedded RAG context. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:389] [INFERENCE: 78.6 percent of markdown files under `.opencode/specs/system-spec-kit` exceed 2000 characters in the packet-local distribution probe]
- `RQ-5` answered as a bounded unknown: the current code cannot report cache hit rate because the reranker cache stores entries and latency samples but exposes no hit/miss counters. The present 5-minute TTL should stay until instrumentation lands. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:424] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499]
- `RQ-6` answered: phase `001-remove-length-penalty` should remove the scoring behavior in `cross-encoder.ts` but keep `applyLengthPenalty` as a compatibility no-op for one release cycle, because the flag still exists in schemas, handler defaults, cache keys, and shadow replay configs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:643] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:160] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:235]
- `RQ-7` answered: the best cache-counter shape is a nested `cache` block on `RerankerStatus` with `{ hits, misses, staleHits, evictions, entries, maxEntries, ttlMs }`, while retrieval telemetry is the best optional mirror surface if operator-visible exposure is later required. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:57]
- `RQ-8` answered: the safest minimal continuity-profile change is to add `continuity` only to `INTENT_WEIGHT_PROFILES` in `adaptive-fusion.ts` and wire it from internal callers. Making continuity a public search intent would require coordinated changes across `intent-classifier.ts`, `query-router.ts`, `artifact-routing.ts`, and multiple test suites. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:53]
- `RQ-9` answered: `MIN_RESULTS_FOR_RERANK` should move from `2` to `4` first, not `5`. The behavioral fallout is localized to the Stage 3 threshold guard and the current `stage3-rerank-regression.vitest.ts` fixtures that assume reranking still runs on 2-row inputs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:50] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:42]
- `RQ-10` answered: the repo can be extended with continuity-specific K sweeps immediately through the string-typed `IntentKOptimizationQuery` / `optimizeKValuesByIntent()` harness. The typed judged sweep should only be extended later if continuity becomes a first-class public intent. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:402] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:494] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:670]

---

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the real pipeline files instead of trusting stale packet assumptions exposed the actual fusion and rerank control surfaces. (iterations 1-4)
- Reusing repo-native eval artifacts (`k-value-analysis.ts`, `k-value-optimization.vitest.ts`, `reranker-eval-comparison.vitest.ts`) kept the work grounded in project-specific evidence. (iterations 5, 7, 19)
- Treating the resumed loop as an implementation-seam audit rather than another parameter-theory pass produced concrete, phase-by-phase guidance. (iterations 11-20)
- Searching tests and tool schemas in addition to runtime code surfaced the real blast radius for removing the length penalty and raising the rerank minimum. (iterations 11, 12, 18)

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- The packet spec originally understated how many request-contract and test surfaces still reference `applyLengthPenalty`. (iterations 11 and 12)
- The current codebase still lacks live provider latency distributions and cache hit counters, so several optimization questions remain bounded by instrumentation gaps. (iterations 7, 8, 13, 14)
- "Add continuity profile" looks small at the adaptive-fusion layer but becomes a larger refactor if interpreted as a public search intent. (iterations 15 and 16)

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Live provider latency profiling from current repo state -- BLOCKED (iterations 7, 13, 14)
- What was tried: inspect provider contracts, status surfaces, and telemetry modules.
- Why blocked: repository contains only in-memory latency samples and no persisted per-provider runtime history.
- Do NOT retry: claiming live Voyage/Cohere/Local latency distributions from code inspection alone.

### Cache hit-rate derivation from current code only -- BLOCKED (iterations 8, 13, 14)
- What was tried: inspect reranker cache implementation, status surface, and reset behavior.
- Why blocked: cache stores results but never increments or exports hit/miss counters.
- Do NOT retry: changing TTL based on inferred or fabricated cache performance.

### Public continuity intent assumption -- RULED OUT as default phase-003 scope (iterations 15 and 16)
- What was tried: trace whether a new adaptive-fusion profile automatically becomes available through public handler/tool surfaces.
- Why blocked: explicit intent validation and multiple routing/test maps are union-locked to the current 7-intent set.
- Do NOT retry: treating `adaptive-fusion.ts` changes alone as sufficient for public continuity intent support.

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Treat `search-weights.json` as the hybrid fusion source of truth: ruled out because the config README and JSON both say dead `rrfFusion` and `crossEncoder` knobs were removed, while live hybrid weights come from TypeScript modules. (iterations 2, 3, 6)
- Retune the FSRS `0.2346` constant for continuity search alone: ruled out because the scheduler establishes it as the canonical long-term decay invariant shared by multiple consumers. (iteration 3)
- Keep the long-doc length penalty unchanged for continuity-centric spec-doc retrieval: ruled out by corpus-shape evidence and user direction. (iterations 8, 11, 12)
- Jump directly to `MIN_RESULTS_FOR_RERANK = 5`: ruled out as the first safe change because it would skip reranking for all 4-result candidate sets without telemetry to justify that broader cutoff. (iterations 17 and 18)
- Start continuity-specific K sweeps by extending the typed judged-intent union first: ruled out because the string-typed optimization harness already supports continuity with lower blast radius. (iteration 19)

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Research loop complete. If this packet moves into implementation, the next focus should be:

1. Phase `002-add-reranker-telemetry`: add cache counters to `RerankerStatus` and reset them in `resetSession()`.
2. Phase `001-remove-length-penalty`: delete the scoring logic in `cross-encoder.ts`, keep `applyLengthPenalty` as a compatibility no-op, and rewrite the dedicated penalty tests.
3. Phase `004-raise-rerank-minimum`: set `MIN_RESULTS_FOR_RERANK = 4`, expand the direct Stage 3 regression fixtures to 4 rows, and add one negative-boundary test for 3 rows.
4. Phase `003-continuity-search-profile`: explicitly choose narrow scope (adaptive-fusion/internal callers only) or broad scope (new public intent across classifier/routing/tool surfaces) before implementation begins.
5. Extend `k-value-optimization.vitest.ts` with continuity-specific judged queries as supporting validation for the new profile and rerank threshold choices.

---

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

- Hybrid fusion is assembled in `hybrid-search.ts` by converting FTS and BM25 into a single keyword list, then applying adaptive intent weights before calling shared RRF fusion.
- Stage 2 adds bounded recency fusion (`0.07`, cap `0.10`) and multiple post-fusion amplifiers.
- Stage 3 reranks whenever at least `MIN_RESULTS_FOR_RERANK` candidates survive and a reranker is enabled.
- The search packet is continuity-sensitive, so canonical spec-doc retrieval should prefer stable source-of-truth documents over freshness-heavy heuristics.
- User decisions now locked for follow-on implementation: remove the length penalty entirely, keep FSRS `0.2346` unchanged, favor a continuity profile near `semantic 0.52 / keyword 0.18 / recency 0.07 / graph 0.23`, and raise the rerank minimum into the `4-5` range with `4` as the safest first step.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations executed: 20
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-04-13T04:50:40Z
- Resumed analysis focus (iterations 11-20): safe implementation guidance only; still read-only against runtime code
- Additional packet constraints: no source edits, no git commit or push
<!-- /ANCHOR:research-boundaries -->

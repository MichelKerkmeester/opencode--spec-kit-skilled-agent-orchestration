---
title: Deep Research Strategy
description: Runtime strategy for packet 017 search fusion and reranking tuning.
---

# Deep Research Strategy - Search Fusion & Reranking Tuning

Runtime packet for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning`.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Track the 10-iteration investigation into fusion weights, RRF calibration, reranker thresholds, FSRS decay assumptions, and cache observability for the system-spec-kit MCP search pipeline.

### Usage

- Initialization copied the canonical strategy template and populated packet-specific questions.
- Each iteration wrote packet-local evidence into `research/iterations/iteration-NNN.md`.
- This final state reflects the post-iteration reducer-friendly summary for the completed run.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Search fusion weight optimization and reranking threshold calibration for system-spec-kit MCP server continuity queries.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Follow-on instrumentation question: add cache hit/miss counters before changing the 5-minute reranker TTL.

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

- Complete 10 packet-local iterations
- Address RQ-1 through RQ-5 with either evidence-backed answers or explicit bounded unknowns
- Produce implementation-facing recommendations without changing runtime code

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- `RQ-1` answered: `search-weights.json` is not the main fusion control surface. It only feeds vector smart-ranking, while hybrid fusion is driven by `adaptive-fusion.ts`, `rrf-fusion.ts`, and `hybrid-search.ts`. Best precision work should target those levers instead. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:21] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:967] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221]
- `RQ-2` answered: the `0.2346` constant is a canonical FSRS v4 invariant reused across scheduler docs and search-time decay consumers, so it should not be retuned just for continuity search. Tune stability inputs or unreviewed fallback behavior instead. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:10] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:121] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:7]
- `RQ-3` answered with bounded evidence: provider latency instrumentation exists only as in-memory avg/p95/count plus static timeouts. Fixture quality comparisons show Cohere and Voyage both improve first-hit ranking over baseline, with Cohere slightly ahead on RR@5 in the project fixture corpus. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:35] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:458] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:21]
- `RQ-4` answered: the short penalty is effectively irrelevant for spec docs, while the long penalty applies to the dominant corpus shape and likely hurts continuity-style retrieval by acting as a near-global 5 percent demotion. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:306] [INFERENCE: 78.6 percent of markdown files under `.opencode/specs/system-spec-kit` exceed 2000 characters in the packet-local distribution probe]
- `RQ-5` answered as a bounded unknown: the current code cannot report cache hit rate because the reranker cache stores entries and latency samples but exposes no hit/miss counters. The present 5-minute TTL should stay until instrumentation lands. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:115] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:424] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:499]

---

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the real pipeline files instead of trusting `spec.md` placeholder paths exposed the actual fusion entrypoints in `pipeline/` plus `hybrid-search.ts`. (iterations 1-3)
- Using repo-native eval artifacts (`k-value-analysis.ts`, `k-value-optimization.vitest.ts`, `reranker-eval-comparison.vitest.ts`) gave project-specific evidence without inventing a new benchmark. (iterations 5 and 7)
- Sampling real spec-doc length distribution made the length-penalty discussion concrete instead of theoretical. (iteration 8)
- Treating `search-weights.json` as a secondary control surface prevented false recommendations aimed at the wrong config file. (iterations 2, 3, and 6)

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- The packet spec listed stale paths for Stage 1 and Stage 2; relying on them directly would have produced incorrect evidence. (iteration 3)
- The codebase does not contain live provider latency distributions or reranker cache hit counters, so RQ-3 and RQ-5 could not be answered with production telemetry. (iterations 7 and 8)
- `search-weights.json` framing initially implied fusion tuning, but that file no longer controls RRF or cross-encoder behavior. (iterations 2 and 3)

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Live provider latency profiling from current repo state -- BLOCKED (iteration 7, 2 attempts)
- What was tried: inspect provider contracts, search for persisted telemetry, compare available eval fixtures.
- Why blocked: repository contains only in-memory latency samples and mocked reranker fixtures, not captured production traces.
- Do NOT retry: claiming real Voyage/Cohere/Local latency distributions from code inspection alone.

### Cache hit-rate derivation from current code only -- BLOCKED (iteration 8, 2 attempts)
- What was tried: inspect cache implementation, exported status surface, and reset behavior.
- Why blocked: cache stores results and latency samples but never increments or exports hit/miss counters.
- Do NOT retry: changing TTL based on a fabricated or inferred hit rate.

### Repo-native fixture and corpus probes -- PRODUCTIVE (iterations 5, 7, 8)
- What worked: use existing K-sweep utilities, reranker comparison fixtures, and a packet-local markdown length probe.
- Prefer for: implementation-ready tuning recommendations and bounded evidence statements.

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Treat `search-weights.json` as the hybrid fusion source of truth: ruled out because the config README and JSON both say dead `rrfFusion` and `crossEncoder` knobs were removed, while live hybrid weights come from TypeScript modules. (iteration 3, evidence: `.opencode/skill/system-spec-kit/mcp_server/configs/README.md:40`, `.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json:28`)
- Retune the FSRS `0.2346` constant for continuity search alone: ruled out because the scheduler establishes it as the canonical long-term decay invariant shared by multiple consumers. (iteration 3, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:18`)
- Keep the long-doc length penalty unchanged for continuity-centric spec-doc retrieval: ruled out as a default recommendation because the threshold catches most of the actual packet corpus shape. (iteration 8, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62`, packet-local markdown length probe)

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Session complete. If this research moves into implementation, the next focus should be:

1. Expose hybrid fusion weights and continuity-specific RRF K selection in a dedicated config surface rather than `search-weights.json`.
2. Add reranker cache hit/miss instrumentation and provider-tagged latency counters.
3. A/B test removing or raising the `>2000` long-document penalty for spec-doc continuity queries.
4. Revisit the Stage 3 minimum rerank candidate threshold after telemetry is available.

---

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

- Hybrid fusion is assembled in `hybrid-search.ts` by converting FTS and BM25 into a single keyword list, then applying adaptive intent weights before calling shared RRF fusion.
- Stage 2 adds bounded recency fusion (`0.07`, cap `0.10`) and multiple post-fusion amplifiers.
- Stage 3 reranks whenever at least 2 candidates survive and a reranker is enabled.
- The search packet is continuity-sensitive, so canonical spec-doc retrieval should prefer stable source-of-truth documents over freshness-heavy heuristics.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-04-13T04:50:40Z
- Additional packet constraints: read-only analysis, no historical saves, synthetic queries only, no git commit or push
<!-- /ANCHOR:research-boundaries -->

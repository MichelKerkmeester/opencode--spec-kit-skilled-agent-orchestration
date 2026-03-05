# Hybrid RAG Search Core Analysis

## Scope
- Code inspected: `.opencode/skill/system-spec-kit/mcp_server/lib/search/*` (hybrid search, intent classifier, fusion, reranker, query expander, evidence-gap detector, flags) plus the handler files `memory-search.ts`, `memory-context.ts`, `memory-index.ts`, `memory-triggers.ts` and the relevant test suites (notably `tests/hybrid-search.vitest.ts` and `tests/memory-search-integration.vitest.ts`).
- No files were modified; the job is pure auditing/analyzing.

## Observations
### Strengths
1. **Resilient hybrid pipeline** – `hybrid-search.ts` wires vector, FTS/BM25, graph structure, adaptive fusion, MMR reranking, co-activation boosting and two-pass fallback, so every query gets both RRF-fused and normalized signals before being promoted to the rest of the pipeline (`lib/search/hybrid-search.ts:404-647`).
2. **Intent-aware weighting** – The deterministic centroid + keyword/pattern classifier drives both lambda selection for MMR and artifact-routing overrides, preventing noisy single-keyword matches via negative patterns and min-confidence thresholds (`lib/search/intent-classifier.ts:345-422`).
3. **Handler-level instrumentation** – `memory-search.ts` orchestrates multi-concept search, deep-mode query expansion, fallback to vector search, session/causal boosts, TRM evidence-gap detection, and cross-encoder reranking before formatting, ensuring consistent telemetry (`handlers/memory-search.ts:779-1399`).

### Risks / Bugs / Gaps
1. **Multi-source provenance is lost** – The dedup map in `hybridSearch` keeps only the highest-scoring entry per ID and throws away the `sources` array, so downstream consumers (traces, evidence-gap detector, artifact routing) cannot tell how many channels contributed to a hit (`lib/search/hybrid-search.ts:383-388`).
2. **Inconsistent TRM inputs on fallback** – Evidence-gap detection uses `rrfScore`, but when hybrid search falls through to vector-only, `handlers/memory-search.ts` feeds `score` or `similarity` instead. Those fallbacks have different distributions, so the Z-score logic can emit false positives/negatives whenever the RRF pipeline isn’t involved (`handlers/memory-search.ts:908-918`).
3. **Fallback gating skips relaxation for lowered similarity** – `searchWithFallback` only retries at 0.17 if the first pass ran with `minSimilarity >= 0.3`. If a caller explicitly sets `minSimilarity` to a lower value (e.g., 0.1) and receives zero hits, the fallback path is never executed, so the only chance to relax similarity is denied (`lib/search/hybrid-search.ts:615-633`).
4. **Deep-mode variant merge lacks re-ranking** – The deep-mode expansion loop merges variant result sets by ID (order of first occurrence) without reapplying RRF or deduplicating by score, so an inferior early variant can block a better later one and no signal survives to tell the pipeline which variant produced the match (`handlers/memory-search.ts:1267-1294`).
5. **Cross-encoder fallback compresses scoring** – When reranker providers are missing or error, fallback scoring clamps results to [0, 0.5) and ignores the original RRF/intent score distribution, which undermines evidence-gap detection and any downstream heuristics that expect a 0–1 relevance band (`lib/search/cross-encoder.ts:318-401`).

### Improvement Opportunities
- **Propagate multi-source metadata** – Extend `HybridSearchResult` to carry a `sources` array (current fusion already builds one in `rrf-fusion.ts`), then merge it instead of dropping it in the dedup stage so TRM/telemetry can make decisions based on how many channels agreed.
- **Normalize fallback scoring for TRM** – Instead of injecting raw fallback scores and `similarity` into `detectEvidenceGap`, synthesize a pseudo-RRF value (e.g., using the fallback rank position) so the Z-score logic sees consistent distributions even when the hybrid fusion is skipped.
- **Deep-mode rerank after variant merge** – After collecting all variant results in deep mode, run a lightweight RRF/MMR pass (or at least sort by hybrid confidence) so later variants can surface if they are more relevant, and annotate which variant(s) produced each hit.
- **Expand query variants beyond single synonym** – `query-expander.ts` currently substitutes only the first synonym per matched term (max 3 variants). A small addition of metadata (e.g., storing the replaced word) would allow downstream reranking to know which variant triggered the match and avoid the first-in wins effect.
- **Review cross-encoder fallback scaling** – Consider mapping fallback scores into the same 0–1 scale (e.g., by rescaling from 0.2–1.0) so feature flags like TRM and artifact routing see consistent magnitudes regardless of provider availability.

### Tests & Coverage Notes
- `tests/hybrid-search.vitest.ts` exercises the initialization, BM25+/combined lexical search, and exports referenced by the handler (`tests/hybrid-search.vitest.ts:45-200`).
- `tests/memory-search-integration.vitest.ts` documents the expected behaviors for concepts validation, hybrid fallback, and reranking even though many assertions are placeholders (`tests/memory-search-integration.vitest.ts:1-180`).

## Next Steps / Evidence Tracking
- Capture the missing multi-source metadata in telemetry traces and evidence-gap logs.
- Tighten TRM input scaling so fallback searches feed comparable values.
- Add a small regression test that forces `searchWithFallback` to run with `minSimilarity < FALLBACK_THRESHOLD` and ensure fallback still runs (test currently absent).

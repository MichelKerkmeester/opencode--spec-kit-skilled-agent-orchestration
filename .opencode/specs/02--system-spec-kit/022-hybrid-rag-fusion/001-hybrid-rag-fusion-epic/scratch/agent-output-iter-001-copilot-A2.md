# Hybrid RAG Fusion Pipeline Architecture Review

## 1. How does the orchestrator handle errors/exceptions from individual stages? Is there fallback logic?

The orchestrator itself is straight-line and fail-fast. It `await`s Stage 1 through Stage 4 in order and has no `try/catch`, no branch-based recovery, and no alternate path if a stage throws. Any uncaught exception from a stage aborts `executePipeline()` and bubbles to the caller. [`orchestrator.ts:42-77`]

Fallback logic exists, but it mostly lives below the orchestrator boundary.

Stage 1 catches several hybrid-search sub-failures and degrades locally instead of failing the pipeline. Deep multi-query expansion falls back to a single hybrid search if the parallel variant run throws. [`stage1-candidate-gen.ts:271-317`]

R12 embedding expansion also degrades locally: if expansion fails, Stage 1 logs a warning and continues with standard hybrid search. [`stage1-candidate-gen.ts:340-403`]

If the standard hybrid search call itself throws, Stage 1 falls back to pure vector search and records a trace fallback entry. [`stage1-candidate-gen.ts:406-441`]

Stage 1 still has fail-fast branches for unrecoverable inputs or prerequisites. It throws on invalid multi-concept input, on failed query embedding generation for hybrid/vector search, and on unknown `searchType` values. [`stage1-candidate-gen.ts:224-245`, `stage1-candidate-gen.ts:267-269`, `stage1-candidate-gen.ts:452-453`, `stage1-candidate-gen.ts:469-472`]

The deepest fallback layer is inside `hybrid-search.ts`, which Stage 1 calls. `searchWithFallback()` retries with a lower similarity threshold, then falls back to FTS-only, then BM25-only, and finally returns `[]` if all methods are empty. [`hybrid-search.ts:1078-1121`]

When the tiered fallback flag is enabled, `searchWithFallbackTiered()` widens retrieval in Tier 2 and then uses `structuralSearch()` as a last-resort Tier 3. [`hybrid-search.ts:1452-1532`, `hybrid-search.ts:1134-1190`]

`hybridSearchEnhanced()` adds another recovery layer: if its outer `try` fails, it logs a warning and falls back to legacy `hybridSearch()`. [`hybrid-search.ts:1048-1064`]

Stage 2 is mostly collect-and-continue. Each optional scoring/enrichment step is wrapped in its own `try/catch` and logs warnings instead of aborting the stage: session boost, causal boost, co-activation, community boost, graph signals, testing effect, intent weights, artifact routing, feedback signals, anchor metadata, and validation metadata all degrade this way. [`stage2-fusion.ts:584-595`, `stage2-fusion.ts:601-616`, `stage2-fusion.ts:623-653`, `stage2-fusion.ts:659-673`, `stage2-fusion.ts:678-696`, `stage2-fusion.ts:703-710`, `stage2-fusion.ts:717-729`, `stage2-fusion.ts:733-741`, `stage2-fusion.ts:745-756`, `stage2-fusion.ts:777-782`, `stage2-fusion.ts:788-793`]

Stage 3 follows the same best-effort pattern. Cross-encoder reranking returns original results when disabled, undersized, or failed. MMR failures are logged and skipped. Parent reassembly failures fall back to best-chunk rows. [`stage3-rerank.ts:277-390`, `stage3-rerank.ts:163-218`, `stage3-rerank.ts:560-615`]

Stage 4 is the main fail-fast boundary after Stage 1. It has no recovery wrapper around `verifyScoreInvariant()`, so any score mutation detected in Stage 4 throws and aborts the pipeline. [`stage4-filter.ts:306-312`, `types.ts:384-428`]

## 2. Are there dead code paths or unreachable branches in any stage?

The strongest concrete dead-code finding is dead telemetry in Stage 2: `metadata.qualityFiltered` is initialized to `0` but is never updated anywhere else in the file, so it is effectively a permanently-zero field. [`stage2-fusion.ts:559-575`]

I found multiple stale contract comments that no longer match runtime behavior. The orchestrator comment says Stage 4 is responsible for "dedup" and "attribution," and the Stage 4 input contract says Stage 4 covers "session dedup, constitutional injection, channel attribution." [`orchestrator.ts:34-37`, `types.ts:270-283`]

The implementation does not do that. Stage 4 only performs memory-state filtering, evidence-gap annotation, metadata assembly, and invariant verification; its returned `constitutionalInjected` count is only pass-through metadata from Stage 1, not actual Stage 4 injection logic. [`stage4-filter.ts:255-345`]

Stage 4 explicitly says session dedup is **not** performed there and instead happens after cache in the main handler. [`stage4-filter.ts:34-35`, `stage4-filter.ts:236-241`, `stage4-filter.ts:338-340`]

That means the dead artifact here is not a dead branch so much as dead architecture description: the documented Stage 4 responsibilities have drifted away from the executable stage.

I also found a normalization/provenance gap signaled directly by `hybrid-search.ts`: when deduplicating multi-source results, only the highest-scoring entry's single `source` survives, and the file comments call out that multi-source provenance is lost. [`hybrid-search.ts:520-535`]

## 3. What happens if a stage returns empty results — does the pipeline short-circuit or continue?

The pipeline continues. The orchestrator does not branch on empty arrays; it always invokes Stage 1, Stage 2, Stage 3, and Stage 4 in sequence. [`orchestrator.ts:42-77`]

On the hybrid path, Stage 1 first gives `hybrid-search.ts` multiple chances to avoid emptiness. `searchWithFallback()` retries at a lower threshold, then falls back to FTS-only, then BM25-only. [`hybrid-search.ts:1095-1121`]

With tiered fallback enabled, the search widens again and finally uses structural SQL retrieval before giving up. [`hybrid-search.ts:1459-1532`, `hybrid-search.ts:1134-1190`]

If all of that still yields nothing, Stage 1 still returns successfully with `candidateCount: candidates.length`, which can be `0`. There is no Stage 1 exception for empty output. [`stage1-candidate-gen.ts:676-685`]

Stage 2 is empty-tolerant rather than short-circuiting. It starts with `results = [...candidates]` and still returns `scored: results` at the end. [`stage2-fusion.ts:578-579`, `stage2-fusion.ts:827-832`]

Its helper functions are explicitly written as no-ops on empty input. Validation signal scoring, intent weighting, artifact routing, feedback signals, and testing-effect writeback all return immediately or do nothing when `results.length === 0`. [`stage2-fusion.ts:121-123`, `stage2-fusion.ts:314-315`, `stage2-fusion.ts:368-369`, `stage2-fusion.ts:415-416`, `stage2-fusion.ts:500-504`]

Stage 3 also continues on empty or undersized input. Cross-encoder reranking returns the original rows when there are fewer than two results, and chunk collapse returns the input unchanged when there are no chunk parents. [`stage3-rerank.ts:287-294`, `stage3-rerank.ts:463-465`]

Stage 3 then returns whatever remains, including an empty array, with metadata. [`stage3-rerank.ts:249-256`]

Stage 4 likewise continues and returns an empty final set if filtering removes everything or if upstream was already empty. It computes `workingResults` from the filter result and returns `final: workingResults` without any short-circuit branch. [`stage4-filter.ts:255-263`, `stage4-filter.ts:334-345`]

## 4. Is there a stage that should exist but doesn't (e.g., dedup, normalization)?

Yes: there is no single bounded normalization/dedup/provenance stage, and that missing boundary shows up in several places.

Session dedup is the clearest example. Pipeline contracts still describe dedup as part of Stage 4, but Stage 4 explicitly excludes it, and the actual session dedup runs later in `handlers/memory-search.ts` after cache materialization. [`types.ts:270-283`, `stage4-filter.ts:34-35`, `stage4-filter.ts:236-241`, `memory-search.ts:1081-1127`]

Candidate/result dedup is scattered instead of centralized. Stage 1 deduplicates deep-mode variant results by ID, deduplicates R12 baseline-plus-expanded results by ID, and deduplicates summary-channel merges by ID. [`stage1-candidate-gen.ts:292-303`, `stage1-candidate-gen.ts:378-388`, `stage1-candidate-gen.ts:600-617`]

`hybrid-search.ts` also performs canonical-ID dedup internally before returning fused hybrid results. [`hybrid-search.ts:520-535`]

Stage 3 performs another dedup pass when merging non-chunk rows with reassembled parent rows, preferring the higher-scoring row per ID. [`stage3-rerank.ts:491-503`]

Because dedup is fragmented, provenance is fragmented too. `hybrid-search.ts` explicitly documents that multi-source provenance is lost at its dedup point because only one `source` survives. [`hybrid-search.ts:520-523`]

So the missing stage is not a total absence of dedup logic; it is the absence of a dedicated normalization/provenance boundary that owns canonicalization, source aggregation, and dedup semantics in one place.

## 5. How is the pipeline invoked from `hybrid-search.ts`? Any mismatch between entry point expectations and pipeline reality?

The pipeline is **not** invoked from `hybrid-search.ts`.

The real pipeline entry point is `handlers/memory-search.ts`, which builds `pipelineConfig` and calls `executePipeline(pipelineConfig)`. [`memory-search.ts:929-968`]

By contrast, Stage 1 imports `../hybrid-search` and calls `searchWithFallback()` as a dependency while generating hybrid candidates. [`stage1-candidate-gen.ts:37-38`, `stage1-candidate-gen.ts:281-285`, `stage1-candidate-gen.ts:321-325`, `stage1-candidate-gen.ts:358-370`, `stage1-candidate-gen.ts:411-415`]

`hybrid-search.ts` simply exports `hybridSearch`, `hybridSearchEnhanced`, and `searchWithFallback`; it is a dependency of Stage 1, not the pipeline entry point. [`hybrid-search.ts:1712-1721`]

This creates a major architecture mismatch. Stage 1's contract says it only executes search channels and returns raw candidates without scoring modifications. [`stage1-candidate-gen.ts:6-8`, `stage1-candidate-gen.ts:23-29`, `stage1-candidate-gen.ts:186-190`]

But the hybrid helper it calls already performs work that belongs to later stages. `hybridSearchEnhanced()` does adaptive fusion, MPAB-style chunk aggregation, channel enforcement, confidence truncation, reranking/MMR, co-activation score boosts, folder scoring, and token-budget truncation before returning. [`hybrid-search.ts:732-745`, `hybrid-search.ts:761-799`, `hybrid-search.ts:801-857`, `hybrid-search.ts:859-955`, `hybrid-search.ts:957-999`]

That directly conflicts with Stage 2's contract, which says every score modification in the pipeline happens exactly once there, and with Stage 3's contract, which says reranking and aggregation live there. [`stage2-fusion.ts:9-18`, `stage2-fusion.ts:40-45`, `stage3-rerank.ts:6-14`]

In other words, the pipeline reality for hybrid searches is nested and duplicated: Stage 1 delegates to a subsystem that already performs Stage 2/3-like behavior, then the formal Stage 2 and Stage 3 run again on top of those results. [`stage1-candidate-gen.ts:259-441`, `hybrid-search.ts:543-1065`, `stage2-fusion.ts:555-833`, `stage3-rerank.ts:127-257`]

A second mismatch is fallback behavior. If `hybridSearchEnhanced()` throws, it silently degrades to legacy `hybridSearch()`, so Stage 1 may feed legacy-ranked results into the modern 4-stage pipeline. [`hybrid-search.ts:1057-1064`]

## 6. What is the actual error propagation strategy — fail-fast, collect-and-continue, or retry?

The real strategy is mixed and layered.

At the orchestrator boundary, it is fail-fast: `executePipeline()` does not catch, so any uncaught stage error propagates upward. [`orchestrator.ts:42-77`]

At the Stage 1 / `hybrid-search.ts` boundary, it is fallback-heavy. Stage 1 catches several hybrid search failures and substitutes narrower or simpler searches, while `searchWithFallback()` and `searchWithFallbackTiered()` retry with looser retrieval settings or alternate retrieval methods when results are empty or degraded. [`stage1-candidate-gen.ts:271-317`, `stage1-candidate-gen.ts:340-441`, `hybrid-search.ts:1078-1121`, `hybrid-search.ts:1452-1532`]

`hybridSearchEnhanced()` also converts thrown exceptions into a fallback to legacy `hybridSearch()`. [`hybrid-search.ts:1059-1064`]

Stage 2 is collect-and-continue. Optional boosts/enrichments catch and log their own failures, then keep the current result set. There is no generic retry loop for those exceptions. [`stage2-fusion.ts:584-595`, `stage2-fusion.ts:601-616`, `stage2-fusion.ts:623-653`, `stage2-fusion.ts:659-673`, `stage2-fusion.ts:678-696`, `stage2-fusion.ts:703-710`, `stage2-fusion.ts:717-729`, `stage2-fusion.ts:733-741`, `stage2-fusion.ts:745-756`, `stage2-fusion.ts:777-782`, `stage2-fusion.ts:788-793`]

Stage 3 is also collect-and-continue. Rerank failures, MMR failures, and parent reassembly failures degrade to original rows or fallback rows rather than aborting the stage. [`stage3-rerank.ts:163-218`, `stage3-rerank.ts:277-390`, `stage3-rerank.ts:560-615`]

Stage 4 returns to fail-fast for invariants. If score immutability is violated, `verifyScoreInvariant()` throws and there is no local recovery. [`stage4-filter.ts:306-312`, `types.ts:384-428`]

So the most accurate summary is:

- **Fail-fast at the orchestrator and invariant boundaries.** [`orchestrator.ts:42-77`, `stage4-filter.ts:306-312`]
- **Collect-and-continue for most Stage 2 and Stage 3 enrichments.** [`stage2-fusion.ts:584-793`, `stage3-rerank.ts:163-390`, `stage3-rerank.ts:560-615`]
- **Retry/fallback only inside the Stage 1 hybrid-search dependency layer, mostly on empty/degraded search output rather than as a general exception-retry framework.** [`stage1-candidate-gen.ts:271-441`, `hybrid-search.ts:1078-1121`, `hybrid-search.ts:1452-1532`]

## Overall assessment

The clean 4-stage architecture exists more as a wrapper than as the sole execution model for hybrid search. The biggest architecture gap is that Stage 1 delegates to `hybrid-search.ts`, and that dependency already performs fusion, truncation, reranking, aggregation, and fallback behavior that the later pipeline stages claim to own. [`stage1-candidate-gen.ts:259-441`, `hybrid-search.ts:543-1065`, `stage2-fusion.ts:9-18`, `stage3-rerank.ts:6-14`]

That leaves the system with mixed responsibility boundaries, duplicated ranking logic, stale Stage 4 contracts, and one concrete dead telemetry field (`qualityFiltered`). [`types.ts:270-283`, `stage4-filter.ts:236-241`, `stage2-fusion.ts:559-575`]

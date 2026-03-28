# Iteration 1: Pipeline Architecture Audit

## Focus
Trace the 4-stage search pipeline (candidate generation -> fusion/scoring -> rerank/aggregate -> filter/annotate), identify orchestrator logic, data flow contracts, stage boundaries, and architecture gaps.

## Findings

### F1. Clean orchestrator with linear dataflow, no error handling at pipeline level
The orchestrator (`orchestrator.ts`) is a remarkably clean 79-line module that executes stages sequentially: `stage1 -> stage2 -> stage3 -> stage4`. Each stage receives the output of the previous stage plus shared `PipelineConfig`. However, the orchestrator has **zero error handling** -- if any stage throws, the entire pipeline aborts with an unhandled exception. Each individual stage has granular try/catch for sub-operations (e.g., co-activation, MMR), but the orchestrator itself does not wrap stage execution.

[SOURCE: mcp_server/lib/search/pipeline/orchestrator.ts:42-78]

### F2. Well-typed stage contracts with compile-time + runtime invariants
The pipeline has excellent type safety. Key types flow through the pipeline:
- **Stage 1**: `PipelineConfig` -> `Stage1Output { candidates: PipelineRow[], metadata }`
- **Stage 2**: `PipelineRow[]` -> `Stage2Output { scored: PipelineRow[], metadata }`
- **Stage 3**: `PipelineRow[]` -> `Stage3Output { reranked: PipelineRow[], metadata }`
- **Stage 4**: `Stage4ReadonlyRow[]` -> `Stage4Output { final: Stage4ReadonlyRow[], metadata, annotations }`

The Stage 4 immutability invariant is enforced at **two levels**:
1. **Compile-time**: `Stage4ReadonlyRow` makes score fields `Readonly<Pick<...>>`
2. **Runtime**: `captureScoreSnapshot()` before, `verifyScoreInvariant()` after -- throws on any mutation

[SOURCE: mcp_server/lib/search/pipeline/types.ts:14-46, 74-105, 349-429]

### F3. Score resolution inconsistency between ranking-contract.ts and types.ts
`resolveEffectiveScore()` in types.ts uses fallback chain: `intentAdjustedScore -> rrfScore -> score -> similarity/100`.

But `compareDeterministicRows()` in ranking-contract.ts uses a **different** chain: `score -> intentAdjustedScore -> rrfScore -> similarity/100`.

This means `resolveEffectiveScore` prefers `intentAdjustedScore` first, while the deterministic sort prefers `score` first. After Stage 2's `syncScoreAliasesInPlace` aligns all aliases, this divergence is practically masked. But if any code path leaves aliases out of sync, sorting and score resolution would disagree on which row ranks higher. This is a latent bug.

[SOURCE: mcp_server/lib/search/pipeline/types.ts:58-68]
[SOURCE: mcp_server/lib/search/pipeline/ranking-contract.ts:36-49]

### F4. Stage 2 is a 9-step scoring monolith (854 lines)
Stage 2 applies 9 sequential scoring operations in a fixed order:
1. Session boost (hybrid only)
2. Causal boost (hybrid + graph enabled)
2a. Co-activation spreading
2b. Community co-retrieval (N2c)
2c. Graph signals (N2a+N2b)
3. Testing effect (FSRS write-back, trackAccess only)
4. Intent weights (non-hybrid only -- G2 guard)
5. Artifact routing weights
6. Feedback signals (learned triggers + negative feedback)
7. Artifact-based result limiting
8. Anchor metadata (annotation only)
9. Validation metadata + quality scoring

This module is 854 lines and handles scoring, annotation, and side-effects (FSRS DB writes). Steps 8-9 are pure annotation/metadata, not scoring, and arguably belong in a separate "enrich" step or even Stage 4.

[SOURCE: mcp_server/lib/search/pipeline/stage2-fusion.ts:555-833]

### F5. G2 double-weighting guard is architecturally sound
The most critical invariant: intent weights are applied ONLY for non-hybrid searches. Hybrid search incorporates intent weighting during RRF/RSF fusion internally. The guard at line 717 (`if (!isHybrid && config.intentWeights)`) prevents double-counting. This is well-documented in comments at lines 17-19, 36-39, and 293-297.

[SOURCE: mcp_server/lib/search/pipeline/stage2-fusion.ts:717-730]

### F6. Stage 1 has 5+ search channels with complex branching
Stage 1 handles:
1. **Multi-concept**: Per-concept embeddings, multiConceptSearch
2. **Hybrid deep mode**: Query expansion via buildDeepQueryVariants + parallel variant searches + dedup
3. **Hybrid R12**: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) + parallel baseline/expanded search
4. **Hybrid standard**: searchWithFallback -> vector fallback on error
5. **Vector**: Direct vectorSearch
6. **R8 Summary channel**: Post-channel summary embedding search (additive, not exclusive)

Plus post-channel: constitutional injection, quality filtering, tier/context filtering, governance scope filtering.

Stage 1 is 702 lines with deep nesting (if/else chains for search type + mode). The R12 embedding expansion path alone is ~70 lines with try/catch fallbacks.

[SOURCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:192-686]

### F7. Stage 3 rerank has 3 sub-steps with graceful degradation
1. Cross-encoder reranking (or local GGUF reranker)
2. MMR diversity pruning (gated by SPECKIT_MMR)
3. MPAB chunk collapse + parent reassembly

All steps degrade gracefully: cross-encoder failure returns original results, MMR failure logs and continues, MPAB DB failure falls back to best-chunk content. The `stage2Score` field is preserved for auditability when reranking overwrites `score`.

[SOURCE: mcp_server/lib/search/pipeline/stage3-rerank.ts:127-257]

### F8. Unsafe type cast: Stage 3 output -> Stage 4 input
In the orchestrator at line 61:
```typescript
results: stage3Result.reranked as Stage4ReadonlyRow[],
```
This `as` cast converts mutable `PipelineRow[]` to `Stage4ReadonlyRow[]` without runtime verification. The TypeScript `Readonly` only provides compile-time safety -- at runtime, the objects are still mutable JavaScript objects. The `verifyScoreInvariant()` runtime check in Stage 4 compensates for this, but the cast itself is a code smell that could be replaced with `Object.freeze()` for true immutability.

[SOURCE: mcp_server/lib/search/pipeline/orchestrator.ts:61]

### F9. Stage 4 extractScoringValue uses a different fallback chain than resolveEffectiveScore
`extractScoringValue()` in stage4-filter.ts uses: `rrfScore -> intentAdjustedScore -> score -> similarity` (raw similarity, not divided by 100).

`resolveEffectiveScore()` in types.ts uses: `intentAdjustedScore -> rrfScore -> score -> similarity/100`.

This is a **third** score resolution ordering (alongside the ranking-contract.ts one from F3). While Stage 4 uses `extractScoringValue` only for evidence-gap Z-score analysis (not ranking), having 3 different priority chains for "get the best score" is a maintenance hazard.

[SOURCE: mcp_server/lib/search/pipeline/stage4-filter.ts:211-217]
[SOURCE: mcp_server/lib/search/pipeline/types.ts:58-68]

### F10. Constitutional injection timing creates a filter inconsistency
In Stage 1, constitutional injection happens **between** tier/contextType filtering and quality score filtering (lines 536-579 vs line 583). Constitutional rows injected via vector search bypass the initial hybrid search filters but ARE filtered by the F-05 contextType guard and quality threshold. However, they are NOT subject to archive filtering at that point (only the main candidates go through `applyArchiveFilter` for R8 summary hits). This could allow archived constitutional memories to enter the pipeline.

[SOURCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:536-583]

## Sources Consulted
- `mcp_server/lib/search/pipeline/orchestrator.ts` (79 lines)
- `mcp_server/lib/search/pipeline/types.ts` (430 lines)
- `mcp_server/lib/search/pipeline/ranking-contract.ts` (69 lines)
- `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` (702 lines)
- `mcp_server/lib/search/pipeline/stage2-fusion.ts` (854 lines)
- `mcp_server/lib/search/pipeline/stage3-rerank.ts` (665 lines)
- `mcp_server/lib/search/pipeline/stage4-filter.ts` (366 lines)

## Assessment
- New information ratio: 1.0 (first iteration; all findings are new)
- Questions addressed: Q1 (pipeline architecture, stages, contracts, orchestration)
- Questions answered: None fully answered yet (Q1 partially addressed -- architecture traced, gaps identified, but need deeper analysis of whether stages are missing/redundant)

## Reflection
- What worked and why: Reading types.ts first gave the complete type contract, making subsequent stage reads highly productive. The pipeline directory is self-contained and well-organized.
- What did not work and why: The dispatch context had incorrect path prefixes (`shared/` instead of `mcp_server/`), requiring a Glob discovery step.
- What I would do differently: For iteration 2 (scoring deep dive), pre-read the shared algorithm files (rrf-fusion.ts, adaptive-fusion.ts) before stage2-fusion.ts to understand the fusion math.

## Recommended Next Focus
Iteration 2 should dive into the scoring system: trace how RRF/RSF weights are configured, whether the 15+ signals have data-driven calibration or hardcoded values, and examine the 3 different score resolution chains identified in F3/F9 as a potential bug cluster.

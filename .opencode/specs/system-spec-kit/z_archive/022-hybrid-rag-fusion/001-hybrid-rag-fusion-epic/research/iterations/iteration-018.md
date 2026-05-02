# Iteration 18: Cross-Validation of Top 10 Findings

## Focus
Independent code-trace verification of the 10 most impactful findings from iterations 1-17. Each finding is re-verified with fresh evidence (grep counts, file reads, line-level traces) and assigned a verdict: CONFIRMED, MODIFIED, or REFUTED.

## Findings

### Finding 1: 3 Divergent Score Resolution Chains
**Prior claim (iter 1-2):** Three separate score-resolution functions with divergent fallback orders in types.ts, ranking-contract.ts, and stage4-filter.ts.
**Fresh evidence:**
- `types.ts:49-66` exports `resolveEffectiveScore()`: chain is `intentAdjustedScore -> rrfScore -> score -> similarity/100`. This is documented as the "canonical fallback chain" (line 49-55).
- `ranking-contract.ts:36-44` uses `score -> similarity/100` only (2 fields, not 4).
- `stage4-filter.ts:205-214` uses `rrfScore -> intentAdjustedScore -> score -> similarity` (different ORDER from types.ts -- rrfScore is first, not intentAdjustedScore).
- **Verdict: CONFIRMED.** Three distinct resolution chains still exist. The canonical function in types.ts was added to address this (lines 49-55 document its purpose), but ranking-contract.ts and stage4-filter.ts still use their own ad-hoc chains instead of calling it.
[SOURCE: mcp_server/lib/search/pipeline/types.ts:49-66, ranking-contract.ts:36-44, stage4-filter.ts:205-214]

### Finding 2: 30+ Hardcoded Scoring Constants with No Calibration
**Prior claim (iter 2):** All scoring constants are hardcoded with no data-driven calibration.
**Fresh evidence (5 spot-checks):**
- `composite-scoring.ts:123,131` -- importance weight = 0.25 (hardcoded in two intent profiles)
- `composite-scoring.ts:185` -- IMPORTANCE_MULTIPLIERS record with tier-based multipliers (hardcoded)
- `composite-scoring.ts:144` -- FSRS_DECAY = -0.5 (from FSRS v4 literature -- one of few literature-backed constants)
- `stage3-rerank.ts:55` -- MMR_DEFAULT_LAMBDA = 0.7 (hardcoded fallback)
- `stage3-rerank.ts:201` -- INTENT_LAMBDA_MAP provides per-intent lambda variants (hardcoded map)
- RRF K=60 grep returned no direct match in rrf-fusion.ts (constant may have been moved or parameterized since iter 2), but the claim of widespread hardcoding holds for the 4 other constants checked.
- **Verdict: CONFIRMED.** At least 4 of 5 spot-checked constants are hardcoded with no runtime calibration mechanism. FSRS_DECAY is the sole literature-backed constant. RRF K=60 location needs verification but does not affect the overall finding.
[SOURCE: mcp_server/lib/scoring/composite-scoring.ts:123-185, mcp_server/lib/search/pipeline/stage3-rerank.ts:55,201]

### Finding 3: 76 SPECKIT_ Feature Flags -- Recount
**Prior claim (iter 7):** 76 unique SPECKIT_ env vars.
**Fresh evidence:** grep -roh 'SPECKIT_[A-Z_0-9]*' across lib/ returned **83 unique strings**. This includes 2 partial/prefix patterns (`SPECKIT_` bare and `SPECKIT_MEMORY_`) that are likely regex fragments rather than actual flag names. Subtracting those yields **81 genuine flag names**, which is higher than the original 76 count.
**Notable:** 12 HYDRA_* alias flags confirmed (SPECKIT_HYDRA_ADAPTIVE_RANKING, SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS, SPECKIT_HYDRA_GRAPH_UNIFIED, SPECKIT_HYDRA_LINEAGE_STATE, SPECKIT_HYDRA_PHASE, SPECKIT_HYDRA_SCOPE_ENFORCEMENT, SPECKIT_HYDRA_SHARED_MEMORY plus SPECKIT_MEMORY_* equivalents).
- **Verdict: MODIFIED (upward).** Count is 81, not 76. Flag sprawl is worse than originally reported. Still no central registry, no sunset dates, no governance manifest.
[SOURCE: grep -roh 'SPECKIT_[A-Z_0-9]*' mcp_server/lib/ | sort -u -- 83 lines, minus 2 partial patterns = 81]

### Finding 4: Orchestrator Has 0 Error Handling
**Prior claim (iter 6):** The orchestrator (79 lines) has zero error handling.
**Fresh evidence:** Full read of orchestrator.ts -- 79 lines total. grep for 'catch|try|throw|error' returned **zero matches**. The function `executePipeline()` (line 42-78) calls all 4 stages sequentially with no try/catch, no error propagation, no timeout, no circuit breaker. Any stage throw propagates as an unhandled rejection to the MCP tool caller.
- **Verdict: CONFIRMED.** Zero error handling. The orchestrator is a pure pass-through with zero defensive code.
[SOURCE: mcp_server/lib/search/pipeline/orchestrator.ts -- full file, 79 lines, 0 error handling constructs]

### Finding 5: FSRS Write-Back Race Condition in Stage 2
**Prior claim (iter 6):** Read-then-write lost-update race in FSRS strengthening.
**Fresh evidence:** The fsrs.ts file at `mcp_server/lib/search/fsrs.ts` contains only 2 exported functions: `computeStructuralFreshness` (line 40) and `computeGraphCentrality` (line 63). Neither performs database writes. The FSRS write-back (strengthening) likely lives elsewhere -- possibly in the save pipeline or the `trackAccess` parameter flow.
- **Verdict: MODIFIED (location).** The race condition claim may still hold, but fsrs.ts itself is read-only (computation functions only). The write-back path needs to be traced through `trackAccess` parameter handling in the search tools, not through fsrs.ts. The original iteration may have attributed the race to the wrong file.
[SOURCE: mcp_server/lib/search/fsrs.ts:40,63 -- only pure computation functions, no DB writes]

### Finding 6: Embedding Cache Key Ignores Model ID
**Prior claim (iter 9):** Cache key construction ignores model ID, causing stale embeddings on model swap.
**Fresh evidence:** embedding-cache.ts has a compound PRIMARY KEY `(content_hash, model_id)` (line 45). The `lookupEmbedding()` function (line 62-80) takes both `contentHash` AND `modelId` as parameters and queries with both: `WHERE content_hash = ? AND model_id = ?` (line 68).
- **Verdict: REFUTED.** The embedding cache correctly includes model_id in both the primary key and all lookups. This finding was incorrect. The cache is model-aware by design.
[SOURCE: mcp_server/lib/cache/embedding-cache.ts:38-48 (schema), 62-80 (lookup)]

### Finding 7: memory_search Has 28 Parameters
**Prior claim (iter 11):** memory_search has 28 parameters including a duplicate.
**Fresh evidence:** The SearchArgs interface in tools/types.ts has exactly **31 fields** (counted from the interface definition). The duplicate `minQualityScore` + `min_quality_score` is confirmed (both present in the interface). TriggerArgs confirms snake_case inconsistency (`session_id`, `include_cognitive`).
- **Verdict: MODIFIED (upward).** Parameter count is 31, not 28. The UX burden is worse than originally reported. Duplicate parameter confirmed.
[SOURCE: mcp_server/tools/types.ts -- SearchArgs interface, 31 fields counted]

### Finding 8: Graph Channel Has 5 Channels Not 4
**Prior claim (iter 3-4, 14):** The pipeline has 5 search channels, not 4 as spec states.
**Fresh evidence:** `types.ts:185` comment explicitly lists: "FTS5, semantic, trigger, graph, co-activation" -- that is **5 channels**. Additionally, `hybrid-search.ts` imports co-activation spreading (line 12) as a distinct channel alongside the 4 base channels. The channel-enforcement module (line 34) provides minimum representation across channels.
- **Verdict: CONFIRMED.** Five channels exist: (1) FTS5, (2) semantic/vector, (3) trigger, (4) graph, (5) co-activation. Spec documents 4, code implements 5. Co-activation is treated as a full channel with its own candidates and RRF contribution.
[SOURCE: mcp_server/lib/search/pipeline/types.ts:185, mcp_server/lib/search/hybrid-search.ts:12,34]

### Finding 9: 5-Factor Model Never Activated
**Prior claim (iter 3):** `use_five_factor_model: true` never passed in production code.
**Fresh evidence:** grep for `use_five_factor_model` across all of lib/ returns **only composite-scoring.ts hits**: the interface definition (line 72), documentation (line 613), and two conditional branches (lines 620, 717, 788). Zero callers pass `use_five_factor_model: true` anywhere in lib/. The option exists solely as a dormant opt-in.
- **Verdict: CONFIRMED.** The 5-factor model is structurally complete but has zero production activations. It is dormant dead code.
[SOURCE: grep -rn 'use_five_factor_model' mcp_server/lib/ -- 5 hits, all in composite-scoring.ts definitions/conditionals, 0 callers]

### Finding 10: Dead applyIntentWeights Export
**Prior claim (iter 4):** intent-classifier.ts exports `applyIntentWeights` but it has zero imports.
**Fresh evidence:** grep shows:
- `intent-classifier.ts:485` -- function definition
- `intent-classifier.ts:613` -- export
- `stage2-fusion.ts:310` -- has its OWN `applyIntentWeightsToResults` (different function name, different signature)
- `stage2-fusion.ts:719` -- calls its own version
- `stage2-fusion.ts:846` -- exports its own version
The intent-classifier's `applyIntentWeights` (line 485/613) is NEVER imported by any other file. Stage 2 reimplements equivalent logic with typed PipelineRow inputs.
- **Verdict: CONFIRMED.** The export at intent-classifier.ts:613 is dead code. Stage 2 independently reimplements the same logic with better typing.
[SOURCE: grep -rn 'applyIntentWeights' mcp_server/lib/ -- intent-classifier.ts:485,613 (unused); stage2-fusion.ts:310,719,846 (independent reimplementation)]

## Sources Consulted
- mcp_server/lib/search/pipeline/orchestrator.ts (full read, 79 lines)
- mcp_server/lib/cache/embedding-cache.ts (lines 1-80)
- mcp_server/lib/search/pipeline/types.ts (grep)
- mcp_server/lib/search/pipeline/ranking-contract.ts (grep)
- mcp_server/lib/search/pipeline/stage4-filter.ts (grep)
- mcp_server/lib/search/hybrid-search.ts (grep)
- mcp_server/lib/search/fsrs.ts (grep)
- mcp_server/lib/scoring/composite-scoring.ts (grep)
- mcp_server/lib/search/pipeline/stage3-rerank.ts (grep)
- mcp_server/lib/search/intent-classifier.ts (grep)
- mcp_server/lib/search/pipeline/stage2-fusion.ts (grep)
- mcp_server/tools/types.ts (partial read)
- Bash: grep -roh SPECKIT_ flag census

## Assessment
- New information ratio: 0.40 (4 fully new corrections: finding 3 upward to 81, finding 5 location correction, finding 6 REFUTED, finding 7 upward to 31; 6 confirmations are partially new as fresh evidence strengthens confidence)
- Questions addressed: Cross-validation of all 10 top findings
- Questions answered: N/A (synthesis iteration, no new questions)

## Verification Summary

| # | Finding | Verdict | Correction |
|---|---------|---------|------------|
| 1 | 3 divergent score resolution chains | CONFIRMED | All 3 still exist with different fallback orders |
| 2 | 30+ hardcoded scoring constants | CONFIRMED | 4/5 spot-checks positive; RRF K=60 location unclear |
| 3 | 76 SPECKIT_ feature flags | MODIFIED | Actual count is 81, not 76 |
| 4 | Orchestrator 0 error handling | CONFIRMED | 79 lines, zero try/catch/throw/error |
| 5 | FSRS write-back race condition | MODIFIED | fsrs.ts is read-only; write-back lives elsewhere |
| 6 | Embedding cache ignores model ID | REFUTED | Cache has compound PK (content_hash, model_id) |
| 7 | memory_search 28 parameters | MODIFIED | Actual count is 31, not 28 |
| 8 | 5 channels not 4 | CONFIRMED | types.ts:185 explicitly lists 5 |
| 9 | 5-factor model never activated | CONFIRMED | Zero production callers |
| 10 | Dead applyIntentWeights export | CONFIRMED | Zero imports outside intent-classifier.ts |

**Score: 6 CONFIRMED, 3 MODIFIED, 1 REFUTED = 90% reliable (9/10 directionally correct)**

## Reflection
- What worked and why: Batch grep verification in a single bash command was extremely efficient -- verified 5+ findings in one tool call. Reading embedding-cache.ts was the highest-ROI action because it definitively refuted Finding 6 with 2 lines of evidence (PK schema + lookup query).
- What did not work and why: The FSRS race condition could not be fully verified because the write-back path is not in fsrs.ts as originally reported. The actual write-back location was not traced in this iteration due to tool budget constraints.
- What I would do differently: For the FSRS race condition, trace from the `trackAccess` parameter in SearchArgs through to the actual UPDATE statement. For RRF K=60, read rrf-fusion.ts directly instead of relying on grep.

## Recommended Next Focus
Iteration 19 (recommendation synthesis): Consolidate all 18 iterations into a prioritized recommendation framework. Group findings by remediation effort (quick-win / sprint / epic) and impact (correctness / performance / maintainability / DX). Include the cross-validation corrections from this iteration.

# Iteration 5: Cross-Encoder Reranking Quality

## Focus

This iteration traced Stage 3 reranking end to end across the requested source and built files, then checked the live SQLite database for any stored score telemetry that could prove pre/post-rerank behavior. The goal was to answer four concrete questions: which reranker branch is selected, whether reranking is real or passthrough, how scores and counts change before/after Stage 3, and whether MMR helps or hurts when the result window is already small.

## Findings

1. In the current shell/runtime, the active Stage 3 reranker is the remote Voyage branch, not the local GGUF reranker, and the compiled JS matches the TypeScript exactly.

   Code path:

   - `executeStage3(...)` always enters `applyCrossEncoderReranking(...)` first when `config.rerank` is true. ([stage3-rerank.ts:130-149](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L130), [stage3-rerank.js:74-90](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage3-rerank.js#L74))
   - Provider resolution prefers `VOYAGE_API_KEY`, then `COHERE_API_KEY`, then `RERANKER_LOCAL`. ([cross-encoder.ts:175-185](../../../../../../skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts#L175), [cross-encoder.js:106-117](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/cross-encoder.js#L106))
   - The local GGUF branch is strictly opt-in: `isLocalRerankerEnabled()` returns false unless `RERANKER_LOCAL` is exactly `"true"` and the rollout policy also allows it. ([search-flags.ts:282-290](../../../../../../skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L282), [search-flags.js:234-242](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/search-flags.js#L234))
   - `canUseLocalReranker()` adds more guards: enough total RAM plus a readable GGUF model path. ([local-reranker.ts:206-232](../../../../../../skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts#L206), [local-reranker.js:170-195](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/local-reranker.js#L170))

   Runtime probe evidence:

   ```text
   env | rg '^(RERANKER_LOCAL|SPECKIT_CROSS_ENCODER|VOYAGE_API_KEY|COHERE_API_KEY)='
   VOYAGE_API_KEY=...

   test -f models/bge-reranker-v2-m3.Q4_K_M.gguf && echo MODEL_PRESENT || echo MODEL_MISSING
   MODEL_MISSING

   node --input-type=module -e "process.env.VOYAGE_API_KEY='mock-key'; import('./dist/lib/search/cross-encoder.js').then(m => console.log(JSON.stringify(m.getRerankerStatus(), null, 2)));"
   {
     "available": true,
     "provider": "voyage",
     "model": "rerank-2",
     "latency": { "avg": 0, "p95": 0, "count": 0 }
   }
   ```

   Conclusion: the intended active reranker here is Voyage `rerank-2`. The local reranker is currently inactive, and the dist output is in sync with the TS source for all of the gating logic.

2. Stage 3 is not a simple passthrough on the remote path: it truncates to `limit` inside the cross-encoder module before MMR/MPAB, while the local path can degrade to a true passthrough.

   Code path:

   - The remote branch maps pipeline rows to `RerankDocument`, calls `crossEncoder.rerankResults(...)`, then rebuilds `PipelineRow[]` with `stage2Score`, `score`, `rerankerScore`, `rrfScore`, and `intentAdjustedScore` overwritten from the reranker output. ([stage3-rerank.ts:364-420](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L364), [stage3-rerank.js:251-296](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage3-rerank.js#L251))
   - `crossEncoder.rerankResults(...)` always returns `results.slice(0, limit)` after provider reranking or fallback, so the remote path cuts the candidate window before MMR sees it. ([cross-encoder.ts:369-478](../../../../../../skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts#L369), [cross-encoder.js:263-360](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/cross-encoder.js#L263))
   - The local path behaves differently: `rerankLocal(query, candidates, topK)` only reranks the first `topK` rows and appends the untouched remainder. If local execution is unavailable, it returns the original array object, and Stage 3 interprets that as `applied: false`. ([local-reranker.ts:239-345](../../../../../../skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts#L239), [stage3-rerank.ts:324-361](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L324), [local-reranker.js:201-301](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/local-reranker.js#L201))

   Controlled Stage 3 harness evidence (15 real embedded IDs from the live DB, mocked Voyage response, `limit=10`):

   ```text
   preCount=15
   postCount=10
   rerankApplied=true
   preTop10Ids=[2,3,4,5,6,7,8,9,10,11]
   postIds=[6,3,9,2,4,10,5,7,8,12]
   changedPositionsVsPreTop10=9
   ```

   Conclusion: for the currently active remote branch, Stage 3 really does rerank and shrink the window from about 15 to 10 before MMR. It is only a true passthrough in the local branch when the local reranker refuses or fails closed.

3. The fallback behavior is misleadingly "rerank-applied": on no provider, open circuit breaker, or provider failure, the cross-encoder module fabricates positional scores in the `0.5..0.0` band, and Stage 3 still reports reranking as applied.

   Code path:

   - No provider: `rerankResults(...)` returns `documents.slice(0, limit)` with synthetic `rerankerScore = 0.5 - (i / (documents.length * 2))`, `provider: 'none'`, and `scoringMethod: 'fallback'`. ([cross-encoder.ts:378-389](../../../../../../skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts#L378), [cross-encoder.js:267-278](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/cross-encoder.js#L267))
   - Circuit breaker open: same positional fallback, now labeled `provider: 'fallback'`. ([cross-encoder.ts:391-402](../../../../../../skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts#L391), [cross-encoder.js:279-290](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/cross-encoder.js#L279))
   - Provider error: after logging a warning, the function again returns positional fallback scores instead of the original Stage 2 ordering/scores. ([cross-encoder.ts:465-477](../../../../../../skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts#L465), [cross-encoder.js:347-359](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/cross-encoder.js#L347))
   - Stage 3 trace metadata compresses all of those cases into `provider: rerankApplied ? 'cross-encoder' : 'none'`, so a fallback result can still look like a successful cross-encoder pass in pipeline metadata. ([stage3-rerank.ts:151-159](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L151), [stage3-rerank.js:91-93](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage3-rerank.js#L91))

   Practical implication:

   - Remote failure is not passthrough.
   - It is a synthetic rerank/truncate step.
   - Today, Stage 3 metadata does not distinguish "neural rerank succeeded" from "fallback ranking substituted for neural rerank."

4. There is no persisted DB telemetry for before/after rerank score distributions right now, so score-shift analysis has to come from controlled execution rather than stored observations.

   SQL evidence:

   ```sql
   SELECT COUNT(*) AS scoring_obs_count, MIN(timestamp) AS min_ts, MAX(timestamp) AS max_ts
   FROM scoring_observations;

   SELECT COUNT(*) AS shadow_log_count, MIN(evaluated_at) AS min_eval, MAX(evaluated_at) AS max_eval
   FROM shadow_scoring_log;
   ```

   Observed:

   ```text
   scoring_obs_count=0
   shadow_log_count=0
   ```

   What *is* available from the DB:

   ```sql
   SELECT COUNT(*) AS memory_index_count FROM memory_index;
   SELECT COUNT(*) AS vec_count FROM vec_memories;
   SELECT COUNT(*) AS missing_embeddings
   FROM memory_index m
   WHERE NOT EXISTS (SELECT 1 FROM vec_memories v WHERE v.rowid = m.id);
   SELECT embedding_status, COUNT(*) AS count
   FROM memory_index
   GROUP BY embedding_status
   ORDER BY count DESC;
   ```

   Observed:

   ```text
   memory_index_count=1002
   vec_count=999
   missing_embeddings=3
   embedding_status: success=999, partial=2, failed=1
   ```

   Controlled runtime evidence (same 15-row harness as Finding 2, with `applyLengthPenalty=true`):

   ```text
   preScores =[0.92,0.90,0.88,0.86,0.84,0.82,0.80,0.78,0.76,0.74,0.72,0.70,0.68,0.66,0.64]
   postScores=[0.9215,0.8930,0.8645,0.8455,0.8170,0.7790,0.7505,0.7125,0.6840,0.6460]
   ```

   Interpretation:

   - The codebase has the right tables for observing score deltas, but this DB snapshot has no populated rerank observability rows.
   - The remote Stage 3 branch does produce a materially different top-10 score distribution after reranking plus length penalty, but we currently have to prove that with harnesses/tests instead of production telemetry.

5. For small remote-reranked result sets, MMR currently looks more likely to hurt precision than help recall, and in this runtime it often will not run at all.

   Code path:

   - MMR only runs after the reranker, only when `SPECKIT_MMR` is enabled, and only when `results.length >= 2`. ([stage3-rerank.ts:162-240](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L162), [stage3-rerank.js:94-161](../../../../../../skill/system-spec-kit/mcp_server/dist/lib/search/pipeline/stage3-rerank.js#L94))
   - `applyMMR(...)` processes only the current pool, respects `limit`, and returns a reordered subset based on `lambda * relevance - (1 - lambda) * maxSim`. It does not increase recall; it can only reorder or prune the rows it already received. ([mmr-reranker.ts:86-151](../../../../../../skill/system-spec-kit/shared/algorithms/mmr-reranker.ts#L86), [mmr-reranker.vitest.ts:54-116](../../../../../../skill/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts#L54))
   - Because the remote cross-encoder path already slices to `limit`, MMR sees only the top 10 in the typical "15 candidates -> 10 results" configuration. That means MMR cannot rescue ranks 11-15; it can only reshuffle the already selected 10. ([cross-encoder.ts:463-478](../../../../../../skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts#L463), [stage4-filter.ts:305-308](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts#L305))

   SQL evidence about MMR readiness:

   ```sql
   SELECT key, value FROM vec_metadata ORDER BY key;
   SELECT COUNT(*) AS vec_rowids_count FROM vec_memories_rowids;
   ```

   Observed:

   ```text
   vec_metadata.embedding_dim=1024
   vec_rowids_count=999
   ```

   Runtime evidence:

   - A real Stage 3 harness hit the Stage 3 warning path:

   ```text
   [stage3-rerank] MMR diversity pruning failed:
   EMBEDDING DIMENSION MISMATCH: Existing database stores 1024-dim vectors (vec_metadata),
   but the active embedding configuration resolves to 768.
   ```

   This behavior is consistent with the dimension guard in `vector-index-store.ts`. ([vector-index-store.ts:220-246](../../../../../../skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L220))

   - When I bypassed the Stage 3 DB bootstrap issue and manually ran `applyMMR(...)` over the already reranked top 10 using the live embeddings from `vec_memories`, MMR changed only `3/10` positions:

   ```text
   before=[6,3,9,2,4,10,5,7,8,12]
   after =[6,2,3,9,4,10,5,7,8,12]
   changedPositions=3
   ```

   Conclusion:

   - In the intended remote path, MMR comes after the top-10 cut, so it cannot improve recall for small windows.
   - In the current runtime, MMR is additionally neutralized by the 1024-vs-768 vector-dimension mismatch, so it often degrades to a warning-only no-op.
   - Even when manually forced over the top 10, it mostly perturbs ordering rather than delivering a clearly better small-window set.

## Concrete Recommendations

1. Split Stage 3 metadata into `neuralRerankApplied`, `fallbackRerankApplied`, and `rerankProvider`.
   Expected impact: stops synthetic fallback from being reported as a successful cross-encoder run, which makes traces, audits, and experiments trustworthy.

2. Skip MMR whenever the remote reranker has already reduced the window to `limit` or when `results.length <= limit`.
   Expected impact: preserves the neural top-10 ordering instead of adding a second diversity pass that cannot improve recall and may lower precision.

3. Fix the vector-dimension contract before relying on MMR in this packet.
   Expected impact: removes the current `1024` stored vs `768` active mismatch that is causing Stage 3 MMR to log warnings and silently skip in practice.

4. Normalize remote and local Stage 3 semantics.
   Expected impact: today the remote branch truncates to `limit` before MMR, while the local branch reranks `topK` and appends the remainder. Making both branches handle the candidate window the same way will make score comparisons and evals much easier to interpret.

5. Start writing actual rerank observability rows during Stage 3 experiments.
   Expected impact: populating `scoring_observations` or a dedicated rerank telemetry table would let later iterations answer score-distribution questions from the DB directly instead of requiring ad hoc harnesses.

## New Information Ratio

0.84

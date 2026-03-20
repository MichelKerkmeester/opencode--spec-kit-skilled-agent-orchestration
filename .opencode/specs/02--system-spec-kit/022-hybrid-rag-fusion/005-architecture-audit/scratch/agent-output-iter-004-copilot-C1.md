● List directory .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline
  └ 9 files found

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 50 files found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/5c8e002f-a897-49a9-b9e1-f23c770c8e80/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read the MCP search pipeline and core search files in the requested order.…
  └ 5 lines...

I’ve got the target surface mapped. Next I’m pulling sizes and then reading the pipeline in coherent chunks so the stage sequencing and score flow stay easy to trace.

● Search (grep)
  │ "createSearchPipeline|runPipeline|stage1|stage2|stage3|stage4|Pipeline" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Count lines in target search files (shell)
  │ wc -l \
  │ '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts' \
  │ '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit
  │ /mcp_server/lib/search/pipeline/stage1-candidate-gen.ts' \…
  └ 50 lines...

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ 78 lines read

● Read ranking-contract.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts
  └ 68 lines read

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts
  └ 36 lines read

● List exports and top-level declarations for search files (shell)
  │ python - <<'PY'
  │ from pathlib import Path
  │ files = [
  │ '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts',
  │ '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts',…
  └ 24 lines...

The orchestration contract is clean at a glance: `1 -> 2 -> 3 -> 4`, with Stage 4 explicitly score-readonly. I’m now drilling into where the implementation might diverge from that contract—especially fusion, reranking, and fallback behavior.

● Search (grep)
  │ "executeStage1|executeStage2|executeStage3|executeStage4|executePipeline|hybridSearch|search|rer
  │ ank|fuse|classify|expand|route" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● List exports and declarations for target files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ files = [
  │ '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts',
  │ '.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts',…
  └ 149 lines...

● General-purpose Audit search pipeline
  └ Agent started in background with agent_id: search-pipeline-audit. You can use...

I’m in the implementation details now. The likely weak spots are already narrowing to Stage 2 score handling, Stage 3 fallback paths, and whether `hybrid-search.ts` still carries duplicated pre-pipeline logic.

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:220 (220 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L221:430 (209 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:340 (340 lines read)

● Search (grep)
  │ "executePipeline|SPECKIT_PIPELINE_V2|stage1|stage2|stage3|stage4|pipeline"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 11 lines found

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L761:853 (93 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:260 (260 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L341:701 (361 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L520:760 (241 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L481:664 (184 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L241:480 (240 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L260:519 (260 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:240 (240 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L1:280 (280 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L281:365 (85 lines read)

● Search (grep)
  │ "executePipeline|hybridSearchEnhanced|searchWithFallback|executeStage1|executeStage2|executeStag
  │ e3|executeStage4|SPECKIT_PIPELINE_V2"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 16 lines found

● Search (grep)
  │ "query-classifier|classify|expandQuery|routeQuery|classifyIntent|rsf|local-reranker|cross-encode
  │ r" (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 10 lines found

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L520:940 (421 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1526:1753 (228 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1040:1525 (485 lines read)

● Search (grep)
  │ "executePipeline" (.opencode/skill/system-spec-kit/mcp_server)
  └ 10 lines found

A clearer pattern is emerging: there’s a newer 4-stage pipeline, but `hybrid-search.ts` still embeds a parallel mini-pipeline with its own fusion, MMR, MPAB, and reranking. I’m verifying whether that duplication is intentional or a source of drift.

● Read query-classifier.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts
  └ 223 lines read

● Read query-expander.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts
  └ 95 lines read

● Read query-router.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts
  └ 166 lines read

● Read intent-classifier.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts
  └ L1:260 (260 lines read)

● Read intent-classifier.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts
  └ L261:624 (364 lines read)

● Read reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts
  └ 53 lines read

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L281:541 (261 lines read)

● Read rsf-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts
  └ 430 lines read

● Read local-reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ L261:388 (128 lines read)

● Read local-reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ L1:260 (260 lines read)

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L1:280 (279 lines read)

● Search (grep)
  │ "maxDocuments|PROVIDER_CONFIG|applyLengthPenalty\(|generateCacheKey\(|resolveProvider\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts)
  └ 19 lines found

● Search (grep)
  │ "rsfShadow|fuseResultsRsf|reranker\.ts|hybridSearch\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 15 lines found

● Search (grep)
  │ "rerankResults\(|applyLengthPenalty\(|rerankLocal\(|getRerankerStatus\(|resetProvider\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 11 lines found

● Search (grep)
  │ "fuseResultsMulti|toHybridResult|hybridAdaptiveFuse|rsfShadow"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 7 lines found

● Search (grep)
  │ "stage2Score|rerankerScore|score: rerankScore|intentAdjustedScore|rrfScore"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)
  └ 10 lines found

● Search (grep)
  │ "function isLocalRerankerEnabled|const isLocalRerankerEnabled|export function
  │ isLocalRerankerEnabled" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 1 line found

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L240:520 (281 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:240 (240 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L220:320 (32 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L900:1035 (136 lines read)

● Search (grep)
  │ "SPECKIT_PIPELINE_V2|pipelineResult|executePipeline\(|catch \(.*pipeline|fallback"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 41 lines found

● Read (General-purpose agent — Audit search pipeline)
  └ Running

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L390:425 (36 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L930:1058 (129 lines read)

● Search (grep)
  │ "qualityFiltered|metadata\.qualityFiltered|qualityFiltered\s*=|filterByMinQualityScore" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 6 lines found

● Search (grep)
  │ "qualityFiltered|artifactRoutingApplied|feedbackSignalsApplied|sessionBoostApplied|causalBoostAp
  │ plied|graphContribution"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 28 lines found

● Search (grep)
  │ "interface HybridSearchOptions|PipelineConfig|applyStateLimits|includeConstitutional|anchors|qua
  │ lityThreshold|intentWeights|artifactRouting" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "clampStage2GraphBonus|STAGE2_GRAPH_BONUS_CAP" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 7 lines found

● Search (grep)
  │ "includeContent|triggerPhrases|intent\?:
  │ string|forceAllChannels|useBm25|useFts|useVector|useGraph"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 35 lines found

● Search (grep)
  │ "from './reranker'|from "./reranker"|rerankResults\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 21 lines found

● Search (grep)
  │ "rsfShadow" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve confirmed one of the bigger architectural smells: a lot of “pipeline” logic still lives inside `hybrid-search.ts`, so Stage 1 is not just candidate generation in practice. I’m tightening the final findings now around the concrete breakpoints and unreachable/duplicated surfaces.

● Search (grep)
  │ "withSyncedScoreAliases\(|syncScoreAliasesInPlace\(|resolveEffectiveScore\(|extractScoringValue\
  │ (" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 13 lines found

● Search (grep)
  │ "from './reranker'|from "./reranker"|from '../search/reranker'|from "../search/reranker"" in
  │ *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Read (General-purpose agent — Audit search pipeline)
  └ Running

## Findings

1. **The orchestrator’s stage order is correct on paper, but Stage 1 violates it in practice.**  
`orchestrator.ts` cleanly executes `1 -> 2 -> 3 -> 4` (`pipeline/orchestrator.ts:42-65`), and Stage 1 claims “no scoring modifications” / raw candidate collection (`pipeline/stage1-candidate-gen.ts:180-187`). But the hybrid path delegates to `hybridSearch.searchWithFallback(...)` (`stage1-candidate-gen.ts:281-285`, `312-316`, `411-415`), and that function already does routing, adaptive fusion, MPAB aggregation, local rerank/MMR, co-activation, token-budget truncation, and contextual header injection (`hybrid-search.ts:543-1057`). So Stage 1 is effectively a nested mini-pipeline, then Stages 2/3 do fusion/rerank/aggregation again.

2. **Stage 3 rerank scores are largely shadowed by stale Stage 2 aliases.**  
The shared score resolver prefers `intentAdjustedScore -> rrfScore -> score -> similarity/100` (`pipeline/types.ts:48-67`). Stage 3 overwrites only `score`/`rerankerScore` while preserving Stage 2 aliases (`pipeline/stage3-rerank.ts:320-327`, `373-380`). Then later Stage 3 logic still reads `effectiveScore(...)` for MMR and MPAB (`stage3-rerank.ts:192-195`, `498-502`, `514-520`, `537`) and Stage 4 evidence-gap scoring prefers `rrfScore`/`intentAdjustedScore` over `score` (`stage4-filter.ts:203-216`). Net effect: reranking can change array order transiently, but downstream ranking math still uses Stage 2 values.

3. **Score normalization is inconsistent after fusion.**  
Stage 2 stores boosted values through `withSyncedScoreAliases(...)` without clamping (`stage2-fusion.ts:165-173`), including artifact routing and co-activation (`stage2-fusion.ts:382-389`, `637-639`). But `resolveEffectiveScore()` clamps reads to `[0,1]` (`pipeline/types.ts:58-67`), while deterministic sorting compares raw stored numbers without clamping (`pipeline/ranking-contract.ts:36-57`). That means ranking can be based on `>1` scores in one place and flattened scores in another. Also, `cross-encoder.ts` applies length penalty only to `rerankerScore`, not `score` (`cross-encoder.ts:198-208`), and does not re-sort after penalizing (`cross-encoder.ts:418-420`, `449`), so the penalty may not actually affect returned order.

4. **Query understanding is split across two classifiers, and the live pipeline drops important signals.**  
`PipelineConfig` carries detected intent/weights (`pipeline/types.ts:148-158`), but Stage 1 does not pass `intent`, `triggerPhrases`, or `includeContent` into `hybrid-search` (`stage1-candidate-gen.ts:281-285`, `411-415`) even though `HybridSearchOptions` supports them (`hybrid-search.ts:64-83`). As a result, `hybrid-search` re-classifies intent internally (`hybrid-search.ts:733-742`) and routes complexity using trigger phrases it never receives (`hybrid-search.ts:561-565`, `query-router.ts:119-141`). There’s also a likely semantic mismatch where `find_spec` is weighted toward `contextType: 'decision'` (`intent-classifier.ts:189-196`), which biases spec lookup toward decision docs.

5. **There are concrete performance hotspots.**  
Stage 1 duplicates embedding work for the same query: it generates an initial embedding (`stage1-candidate-gen.ts:263-265`), regenerates embeddings for deep variants including the original query (`277-280`), may regenerate again for constitutional injection (`543-545`), and again for summary embeddings (`594-596`). Multi-concept embeddings are generated serially (`236-245`). There are also N+1 DB patterns: summary-hit hydration does one `SELECT ... WHERE id = ?` per hit (`603-609`), and BM25 spec-folder filtering does one DB lookup per BM25 result (`hybrid-search.ts:282-294`).

6. **Error recovery is mostly per-feature, not per-stage.**  
Inside stages, many optional features fail open with `console.warn` and continue (for example Stage 2 boosts/feedback and Stage 3 MMR/rerank fallbacks: `stage2-fusion.ts:584-756`, `stage3-rerank.ts:163-218`, `384-389`). But if a stage itself throws—e.g. embedding generation failure or unknown search type in Stage 1 (`stage1-candidate-gen.ts:227-243`, `267-269`, `470-472`) or a Stage 4 invariant failure (`stage4-filter.ts:306-312`)—the orchestrator does not catch it (`orchestrator.ts:42-65`), and the handler calls `executePipeline(...)` directly with no alternate search path (`handlers/memory-search.ts:929-968`).

7. **There is dead or overgrown search surface area.**  
`reranker.ts` is a standalone sort-only reranker that appears unused in runtime. `rsf-fusion.ts` explicitly declares itself dormant/shadow-only (`rsf-fusion.ts:7-16`), while `hybrid-search.ts` still carries `rsfShadow` metadata shape (`hybrid-search.ts:130-141`) with no live producer. `cross-encoder.ts` has a full “local” provider path (`cross-encoder.ts:315-349`), but pipeline Stage 3 already short-circuits to `local-reranker.ts` before calling `crossEncoder.rerankResults(...)` (`stage3-rerank.ts:303-337`). It also defines provider `maxDocuments` limits (`cross-encoder.ts:26-60`) but never enforces them in `rerankResults(...)` (`355-364`). Finally, Stage 2 metadata includes `qualityFiltered`, but it is initialized and never updated (`pipeline/types.ts:221-240`, `stage2-fusion.ts:574`).

Overall: **the biggest architectural issue is that the “V2 pipeline” still wraps a legacy mini-pipeline inside Stage 1, which creates sequencing drift, duplicated work, and score-contract violations.**


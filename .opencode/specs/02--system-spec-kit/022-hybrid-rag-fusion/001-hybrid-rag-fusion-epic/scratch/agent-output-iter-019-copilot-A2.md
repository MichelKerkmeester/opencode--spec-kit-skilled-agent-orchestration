● skill(sk-deep-research)

I'll map the search pipeline around recommendation synthesis, then trace where ranking inputs are produced and consumed so I can surface concrete bugs and dead paths with citations.

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/**/*"
  └ 58 files found

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep research iteration 19/20 on
  │ hybrid-rag-fusion system at .opencode/skill/system-spec-kit/mcp_server/lib/search/. Focus:
  │ Recommendation synthesis. Read source files, trace data flows, find bugs, dead code,
  │ architecture issues. Report with file:line citations." --threshold 0.8
  └ 59 lines...

● search recommendation synthesis ranking fusion rerank recommendation results in mcp_server lib/se…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I’ve got the likely ranking/fusion files. Next I’m reading the pipeline stages plus the older hybrid-search path to see whether recommendation synthesis is duplicated, bypassed, or partially dead.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ 1 line read

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ 1 line read

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ 1 line read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ 1 line read

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ 78 lines read

● Read ranking-contract.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts
  └ 68 lines read

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ 365 lines read

● Search (grep)
  │ "recommend|rerank|fusion|orchestr|stage[1234]|ranking" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/30107c4d-55bc-475d-90d0-a68f64d5483a/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 8 lines...

● Explore Mapping recommendation synthesis
  └ Agent started in background with agent_id: search-pipeline-map. You can use r...

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:260 (259 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:260 (260 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:260 (260 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:260 (259 lines read)

● Read rsf-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts
  └ L1:260 (260 lines read)

● Read local-reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ L1:260 (260 lines read)

● Read reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/reranker.ts
  └ L1:260 (53 lines read)

I’m into the implementation now. A likely theme is contract drift: comments and types describe one scoring ownership model, while the rerank and legacy paths may still mutate or bypass it.

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L260:620 (361 lines read)

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L1:320 (319 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L260:760 (500 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts
  └ 36 lines read

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L260:760 (501 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md
  └ L1:260 (117 lines read)

● Search (grep)
  │ "executePipeline\(|executeStage3\(|applyCrossEncoderReranking\(|collapseAndReassembleChunkResult
  │ s\(|stage2Score|hybridSearch\(|searchHybrid\(|init\(" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L760:1160 (401 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1160:1560 (401 lines read)

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L320:620 (222 lines read)

● Read local-reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ L260:420 (129 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L760:1060 (94 lines read)

● Search (grep)
  │ "executePipeline\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 2 lines found

● Search (grep)
  │ "rerankResults\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 21 lines found

● Search (grep)
  │ "hybridSearchEnhanced\(|searchWithFallback\(|hybridSearch\(" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

The live entry point is `handlers/memory-search.ts`; now I’m checking whether it always uses the new pipeline or can still fall back into the legacy hybrid stack, because that determines which “recommendation synthesis” path is actually user-visible.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L880:1080 (200 lines read)

● Search (grep)
  │ "export \{|export default|module\.exports"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 1 line found

● Search (grep)
  │ "hybridSearchEnhanced\(|searchWithFallback\(" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 1 line found

● Search (grep)
  │ "rsfShadow|fuseResultsRsf|rsf-fusion" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "stage2Score" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 3 lines found

● Search (grep)
  │ "_s3meta|_s4shadow|_s4attribution|_degradation" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 26 lines found

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L280:700 (421 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:280 (280 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1680:1735 (56 lines read)

● Search (grep)
  │ "rsfShadow|fuseResultsRsf|fuseResultsRsfMulti|fuseResultsRsfCrossVariant" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 13 lines found

● Search (grep)
  │ "buildEvalChannelPayloads|adaptiveShadow"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 7 lines found

● Search (grep)
  │ "pipelineMetadata|rerankMetadata|chunkReassembly|graphContribution|traceMetadata" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read (Explore agent — Mapping recommendation synthesis)
  └ idle

Iteration 19 findings for recommendation synthesis:

- **P1 architecture drift:** the “V2-only” runtime still feeds Stage 1 from the legacy `hybrid-search` stack, so candidates are already fused, reranked, MMR-pruned, co-activation-boosted, and token-truncated before Stage 2/3 run again. That breaks Stage 1’s “no scoring modifications” contract and creates double-synthesis risk (`handlers/memory-search.ts:929-968`; `lib/search/pipeline/stage1-candidate-gen.ts:6-8,271-316,406-415`; `lib/search/hybrid-search.ts:543-1057,1078-1101`).

- **P1 cache correctness bug:** cross-encoder cache keys use only `query + sorted IDs`, but outputs depend on input order/content (`originalRank`, fallback scores). Same IDs in a different order can reuse stale rankings (`lib/search/cross-encoder.ts:215-225,239-241,263-270,367-374,390-396`).

- **P2 recall starvation:** Stage 1 passes `limit` into legacy hybrid search, and that stack slices/truncates before Stage 2/3, so later recommendation stages never see a wider candidate pool (`lib/search/pipeline/stage1-candidate-gen.ts:281-285,411-415`; `lib/search/hybrid-search.ts:862-870,988-999`).

- **P2 dead/rotting surfaces:** `rsfShadow` is still documented as the remaining RSF integration, but I only found the type/doc references, not a live writer path (`lib/search/hybrid-search.ts:130-141`; `lib/search/rsf-fusion.ts:7-18`).

- **P2 observability blind spot:** `memory-search` exposes only Stage 1-4 metadata, while pre-pipeline routing/enforcement/truncation inside `hybrid-search` materially shapes recommendations but stays outside `PipelineResult.metadata` (`lib/search/hybrid-search.ts:555-594,801-855,982-1055`; `handlers/memory-search.ts:970-978`).


● skill(sk-deep-research)

I’m doing one focused audit pass over `lib/search`: first mapping the search pipeline and key entry points, then I’ll turn that into a gap-analysis report with concrete citations.

✗ Read plan.md
  │ ~/.copilot/session-state/16dfc974-3696-4b0d-96a3-de403229bd31/plan.md
  └ Path does not exist

● Read quick_reference.md
  │ .agents/skills/sk-deep-research/references/quick_reference.md
  └ 199 lines read

● Read loop_protocol.md
  │ .agents/skills/sk-deep-research/references/loop_protocol.md
  └ L1:220 (220 lines read)

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/**/*"
  └ 58 files found

● Route skills for research audit (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep research iteration 20/20 on
  │ hybrid-rag-fusion system at .opencode/skill/system-spec-kit/mcp_server/lib/search/. Focus: gap
  │ analysis + research debt. Read source files, trace data flows, find bugs, dead code,
  │ architecture issues. Report with file:line citations." --threshold 0.8
  └ 67 lines...

I’ve got the file map and skill routing. Next I’m tracing the actual pipeline entry points and the cross-file data flow so the final report distinguishes real bugs from just-unused utilities.

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ 1 line read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ 1 line read

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ 1 line read

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ 1 line read

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ 1 line read

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ 78 lines read

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ 365 lines read

● Read ranking-contract.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts
  └ 68 lines read

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ 429 lines read

● search entry points and orchestration for hybrid rag fusion search pipeline in mcp_server lib/sea…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

The pipeline split is real, but I’m already seeing some contract drift between comments/types and runtime behavior. I’m now checking whether that drift is harmless documentation debt or something that can actually skew results.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:260 (260 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:260 (259 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:320 (320 lines read)

● Read query-router.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts
  └ L1:260 (166 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:260 (251 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:320 (320 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ L1:260 (260 lines read)

● Search (grep)
  │ "executePipeline\(|SPECKIT_PIPELINE_V2|executeStage[1234]\(|filterByMemoryState\(|session
  │ dedup|channel attribution|constitutionalInjected" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 27 lines found

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L300:760 (365 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md
  └ L1:260 (117 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L260:760 (500 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L320:920 (499 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L260:760 (442 lines read)

● Search (grep)
  │ "executePipeline\(|isPipelineV2Enabled\(|executePipeline\(|pipeline/orchestrator" in
  │ **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 8 lines found

I’ve traced the main runtime path into `handlers/memory-search.ts`. I’m now checking two likely problem areas: whether Stage 3/4 output is consumed consistently by the handler, and whether legacy `hybrid-search.ts` code is still carrying dead or divergent logic.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L900:1160 (261 lines read)

● Search (grep)
  │ "export\s*\{|module\.exports|export function|export const"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 2 lines found

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L760:1220 (460 lines read)

● Read vector-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts
  └ L1:260 (166 lines read)

● Search (grep)
  │ "combinedLexicalSearch\(|hybridSearch\(|hybridSearchEnhanced\(|getGraphMetrics\(|resetGraphMetri
  │ cs\(|searchWithFallback\(" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "precomputedContent|contentSource|channelAttribution|session dedup|enableDedup|dedup" in
  │ **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve confirmed the handler consumes pipeline output directly, with session dedup intentionally happening after the cache. Now I’m separating “real runtime issues” from “legacy file still present but no longer on the hot path.”

● Read copilot-tool-output-1774014242890-ydq57b.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014242890-ydq57b.txt
  └ L1:220 (92 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1688:1735 (48 lines read)

● Read copilot-tool-output-1774014242890-ems5ou.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014242890-ems5ou.txt
  └ L1:260 (88 lines read)

● Search (grep)
  │ "QUALITY_FLOOR|token budget truncation|quality floor|channel attribution" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 11 lines found

● Search (grep)
  │ "type RawSearchResult|formatSearchResults\(|precomputedContent|contentSource" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 72 lines found

● Search (grep)
  │ "buildEvalChannelPayloads|_s3meta|traceMetadata|_s4shadow|_s4attribution" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 30 lines found

I found a stronger architectural problem than simple comment drift: some non-production consumers still bypass the new pipeline and call the legacy enhanced search stack directly. I’m verifying exactly where that happens so I can cite the split cleanly.

● Read eval-reporting.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
  └ L1:180 (175 lines read)

● Read search-results.ts
  │ .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
  └ L210:330 (121 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L180:240 (61 lines read)

● Read memory-crud-stats.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
  └ L280:340 (50 lines read)

● Search (grep)
  │ "TODO|FIXME|deprecated|legacy|compatibility|ignored at runtime" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 51 lines found

● Search (grep)
  │ "searchWithFallbackTiered|structuralSearch\(|hybridSearchEnhanced\(|executePipeline\(" in
  │ **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I found a likely correctness problem in the evaluation path: ablation is wiring channel flags into `hybridSearchEnhanced()`, but that function only knows the legacy hybrid channels, not the newer pipeline-level semantics. I’m checking the ablation framework next to confirm whether any channel is being “measured” without actually being toggled.

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L1:260 (260 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L260:520 (261 lines read)

● Read copilot-tool-output-1774014287536-eg8614.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774014287536-eg8614.txt
  └ L1:220 (89 lines read)

● Search (grep)
  │ "useTrigger|trigger|ALL_CHANNELS|toHybridSearchFlags" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/eval)
  └ 29 lines found

● Search (grep)
  │ "channelAttribution|traceMetadata|sources\b|source\b"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 10 lines found

I’ve confirmed one concrete evaluation bug: the ablation framework claims it can disable a `trigger` channel, but the search function it calls has no trigger-channel switch. I’m pulling the exact helper lines now so the report can distinguish “channel exists in eval model” from “channel exists in runtime.”

● Read query-classifier.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts
  └ L1:220 (220 lines read)

● Read ablation-framework.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts
  └ L748:780 (25 lines read)

● Search (grep)
  │ "trigger channel|trigger phrases|trigger search|memory_match_triggers|trigger_derived|trigger"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ No matches found

● Search (grep)
  │ "trigger channel|trigger-derived|trigger"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md)
  └ 1 line found

● Search (grep)
  │ "useTrigger|triggerPhrases"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 2 lines found

I found a likely real runtime bug in Stage 1: the governance scope filter runs before constitutional injection, but the injected constitutional rows are fetched afterward and only re-filtered by `contextType`. I’m checking whether `vectorSearch()` itself enforces scope, because if it doesn’t, that’s a leakage path.

● Read vector-index-types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts
  └ L1:220 (177 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L494:576 (83 lines read)

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "tenantId|userId|agentId|sharedSpaceId|sessionId"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
  └ No matches found

● Search (grep)
  │ "function vectorSearch\(|export function vectorSearch\(|vectorSearch\(" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 4 lines found

This looks worse than doc drift: `vectorSearch()` doesn’t even accept governance IDs in its option type, so the constitutional injection path has no way to carry tenant/user/session/shared-space scope into the secondary fetch. I’m confirming the exact query constraints in `vector_search()` now.

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L380:520 (141 lines read)

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L240:380 (141 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L510:572 (63 lines read)

● Search (grep)
  │ "tenant_id|user_id|agent_id|session_id|shared_space_id"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
  └ No matches found

I’ve got four strong candidates. I’m doing one independent verification pass with a side agent now to pressure-test whether these are real issues or just misleading comments.

● Explore Verifying search findings
  │ See end of hybridSearchEnhanced (shell)
  │   │ sed -n '970,1010p' "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
  │   └ 42 lines...
  └ Final return of hybridSearchEnhanced (shell)
      │ sed -n '1010,1040p' "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      └ 32 lines...

Top gaps I found in `hybrid-rag-fusion`:

- **High — the 4-stage pipeline is not actually stage-separated.** Stage 1 claims “NO scoring modifications” and “raw candidates” (`stage1-candidate-gen.ts:6-8,23-29`), but for hybrid search it calls `searchWithFallback()` (`stage1-candidate-gen.ts:281-285,312-316,411-415`), which delegates to `hybridSearchEnhanced()` (`hybrid-search.ts:1078-1101`). That path already does fusion (`hybrid-search.ts:745-748`), MPAB aggregation (`hybrid-search.ts:761-799`), channel enforcement (`hybrid-search.ts:801-835`), confidence truncation (`hybrid-search.ts:837-857`), MMR/reranking (`hybrid-search.ts:859-927`), co-activation (`hybrid-search.ts:930-955`), folder scoring (`hybrid-search.ts:957-979`), and token-budget truncation (`hybrid-search.ts:988-1000`). This conflicts with Stage 2’s “single authoritative scoring point” contract (`stage2-fusion.ts:9-19`) and Stage 3’s rerank/aggregate contract (`stage3-rerank.ts:6-14`).

- **High — governance scope can be bypassed by constitutional injection.** Scope filtering runs first (`stage1-candidate-gen.ts:494-522`), but constitutional rows are fetched afterward via `vectorIndex.vectorSearch(...)` with only `{ limit, specFolder, tier, useDecay }` (`stage1-candidate-gen.ts:536-555`). `VectorSearchOptions` has no tenant/user/agent/session/shared-space fields (`vector-index-types.ts:81-91`), and `vector_search()` filters only by tier/folder/context/archive, not governance columns (`vector-index-queries.ts:208-299`). That makes injected constitutional memories a potential cross-scope leak.

- **Medium — ablation “trigger” results are invalid.** Ablation advertises a `trigger` channel and maps it to `useTrigger` (`ablation-framework.ts:50-60,753-771`), but `hybridSearchEnhanced()` has no trigger-channel toggle; it only passes `triggerPhrases` into query complexity routing (`hybrid-search.ts:77,561`). The classifier uses trigger phrases only to mark a query as “simple” (`query-classifier.ts:75-86,127-146`). So “trigger ablation” changes routing heuristics, not a real retrieval channel.

- **Medium — Stage 4 contract/docs are stale.** `pipeline/types.ts` still says Stage 4 handles “session dedup, constitutional injection, channel attribution” (`pipeline/types.ts:271-283`), and `lib/search/README.md` says Stage 4 applies quality floor and token-budget truncation (`README.md:117-119`). Actual Stage 4 only does state filtering, evidence-gap detection, annotations, and invariant checks (`stage4-filter.ts:27-35,255-345`); session dedup is post-cache in the handler (`handlers/memory-search.ts:1081-1153`).

- **Low — direct evaluation path still bypasses the pipeline API.** Production `memory_search` calls `executePipeline()` (`handlers/memory-search.ts:929-968`), but eval ablation calls `hybridSearchEnhanced()` directly (`handlers/eval-reporting.ts:77-99`). That means eval is not measuring the same top-level contract the handler exposes.


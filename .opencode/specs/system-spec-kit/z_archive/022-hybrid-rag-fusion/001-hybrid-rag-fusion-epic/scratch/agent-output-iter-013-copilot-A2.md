● skill(sk-deep-research)

I’m gathering prior context and the search-layer entry points first, then I’ll trace the hot paths end-to-end and report concrete performance issues with citations.

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/75d779fa-ddc0-4b31-b078-63d30649cf7c/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Load prior memory and inspect search-layer files plus package/test entry points.…
  └ 6 lines...

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep research iteration 13/20 on
  │ hybrid-rag-fusion system at .opencode/skill/system-spec-kit/mcp_server/lib/search/. Focus:
  │ Performance hot paths. Read source files, trace data flows, find bugs, dead code, architecture
  │ issues." --threshold 0.8
  └ 51 lines...

I’ve loaded the research skill and prior memory hooks. Next I’m mapping the `lib/search` surface plus adjacent tests so I can trace the real hot paths instead of just reading files in isolation.

● Search (grep)
  │ "hybrid|rerank|rrf|candidate|search\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/**/*"
  └ 58 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/**/*search*"
  └ 15 files found

● search hybrid search pipeline in mcp_server lib/search rerank candidates search results fusion
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I’ve identified the main surface. Now I’m reading the orchestration and stage files together so I can map exactly where candidate generation, fusion, reranking, and filtering spend work.

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ 1 line read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:320 (319 lines read)

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ L1:320 (78 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:320 (320 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:320 (320 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L1:320 (320 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:320 (320 lines read)

● Search (grep)
  │ "export (async )?function|export class|function execute|class
  │ Search|runStage|searchType|rerankApplied" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L320:760 (440 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L300:760 (461 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L320:760 (382 lines read)

● Search (grep)
  │ "export async function executeStage2|function searchWithFallback|export async function
  │ searchWithFallback|collapseAndReassembleChunkResults|searchHybrid|function search|export async
  │ function hybridSearch" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 8 lines found

I’ve got a likely architectural smell already: there are two MPAB collapse implementations in play. I’m drilling into `searchWithFallback` and the Stage 3 helper definitions now to separate real hot-path issues from legacy scaffolding.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1220:1600 (381 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L320:760 (345 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L760:1220 (460 lines read)

● Read integration-search-pipeline.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts
  └ L1:260 (260 lines read)

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L1:320 (319 lines read)

● Read hybrid-search.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
  └ L1:260 (260 lines read)

I’ve confirmed the search layer still contains both the legacy monolith and the newer 4-stage pipeline. I’m checking the handler entry path now so I can tell which performance problems are actually production hot paths versus dormant legacy ones.

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:340 (340 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:260 (251 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L360:860 (501 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:360 (360 lines read)

● Search (grep)
  │ "executePipeline|searchWithFallback|PIPELINE_V2|pipeline|hybridSearchEnhanced|handleMemorySearch
  │ " in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L860:1280 (404 lines read)

● Search (grep)
  │ "collapseAndReassembleChunkResults\(|contentSource|precomputedContent"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 9 lines found

● Search (grep)
  │ "executePipeline\(|isPipelineV2Enabled|searchWithFallback\(|hybridSearchEnhanced\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 1 line found

● Search (grep)
  │ "export \{|export default|export \w+"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 4 lines found

● Read memory-summaries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts
  └ L1:320 (242 lines read)

● Read local-reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ L1:320 (320 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1688:1755 (66 lines read)

● Read vector-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts
  └ L1:320 (166 lines read)

The main live-path bug is worse than I expected: Stage 1 is supposed to be candidate generation, but it delegates into the old monolith that already fuses, reranks, truncates, and enriches results before Stage 2/3 run again. I’m pulling a few more supporting citations, then I’ll package the highest-signal findings.

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L320:620 (222 lines read)

● Read embedding-expansion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "export async function rerankResults|function
  │ rerankResults|generateCacheKey|cache.get\(|cache.set\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts)
  └ 7 lines found

● Search (grep)
  │ "querySummaryEmbeddings\(|checkScaleGate\(|SELECT id, memory_id, summary_embedding|SELECT id,
  │ title, spec_folder" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 8 lines found

● Search (grep)
  │ "SELECT spec_folder FROM memory_index WHERE id = \?|db.prepare\(|get\(Number\(r.id\)\)"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 6 lines found

● Search (grep)
  │ "SELECT rowid, embedding FROM vec_memories WHERE rowid IN|reranked.find\(|for \(const r of
  │ reranked\)|applyMMR\(" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 6 lines found

● Search (grep)
  │ "traceMetadata|_s3meta|_s4shadow|_s4attribution" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 25 lines found

● Search (grep)
  │ "isPipelineV2Enabled\(" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 4 lines found

● Search (grep)
  │ "collapseAndReassembleChunkResults" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 41 lines found

There’s a third MPAB implementation too, in `lib/scoring/mpab-aggregation.ts`. I’m reading that once to confirm whether this is intentional layering or actual duplication drift; right now it looks like the latter.

● Read mpab-aggregation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts
  └ L1:260 (185 lines read)

● Read mpab-aggregation.ts
  └ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts

● Search (grep)
  │ "score: rerankScore|stage2Score: original\.score|score immutability|MUST introduce new score
  │ fields|Stage 3 \(rerank\) and Stage 4" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

I’ve got enough for a solid report, but I’m doing one independent cross-check pass with a sub-agent to make sure I’m not missing a higher-severity hotspot in the same path.

● Explore(claude-haiku-4.5) Reviewing search hot paths
  │ Confirm embedding caching in stage1 (shell)
  │   │ sed -n '260,290p' "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   Env/Public/.opencode/skill
  │   │ /system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts"
  │   └ 32 lines...
  └ Verify Fix #16 implementation (shell)
      │ grep -n "Fix #16\|cachedEmbedding" "/Users/michelkerkmeester/MEGA/Development/Opencode
      Env/Publi
      │ c/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts"
      └ 7 lines...

I’ve got the core architecture and hot-path problems pinned down. I’m grabbing one last set of exact line references around reranker defaults and provider fallback so the final report stays evidence-first.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L748:770 (22 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L44:60 (17 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L257:380 (124 lines read)

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L355:465 (110 lines read)

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L170:240 (71 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L36:46 (10 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L340:390 (51 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L585:646 (62 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L858:922 (65 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L281:294 (14 lines read)

✗ Memory stored search architecture
  └ memory_search always executes the 4-stage executePipeline path; isPipelineV2Enab…

Iteration 13 report, focused on live hot paths.

Live flow is `handleMemorySearch()` → `executePipeline()` → Stage 1/2/3/4, but Stage 1 immediately calls `searchWithFallback()`, which drops into `hybridSearchEnhanced()` and already does routing, fusion, MMR, MPAB, token-budget truncation, and context-header injection before Stage 2/3 run again. That is the biggest architecture bug and wasted-work hotspot. [`handlers/memory-search.ts:929-969`, `pipeline/orchestrator.ts:42-77`, `pipeline/stage1-candidate-gen.ts:179-191`, `pipeline/stage1-candidate-gen.ts:257-325`, `hybrid-search.ts:543-1057`]

High-signal findings:
- **Double pipeline / wrong layer boundary:** Stage 1 is documented as raw candidate generation, but it calls the legacy monolith, so scoring/reranking/truncation happen twice. [`pipeline/stage1-candidate-gen.ts:179-191`, `pipeline/stage1-candidate-gen.ts:257-325`, `hybrid-search.ts:745-799`, `hybrid-search.ts:859-999`]
- **Reranker fallback can overwrite good scores with synthetic ones:** rerank defaults to `true`, cross-encoder is default-on, but if no provider is configured, `rerankResults()` returns positional fallback scores and Stage 3 still marks reranking as applied while overwriting `score`. [`handlers/memory-search.ts:756-757`, `search-flags.ts:48-53`, `cross-encoder.ts:175-185`, `cross-encoder.ts:355-375`, `pipeline/stage3-rerank.ts:347-383`]
- **Stage 3 violates Stage 2’s own score-immutability contract:** Stage 2 says later stages must add new score fields, not overwrite `score`, but Stage 3 rewrites `score` directly. [`pipeline/stage2-fusion.ts:40-45`, `pipeline/stage3-rerank.ts:373-379`]
- **BM25 `specFolder` filtering is N+1 DB work:** every BM25 hit does its own `SELECT spec_folder FROM memory_index WHERE id = ?`. [`hybrid-search.ts:282-294`]
- **R8 summary channel is both expensive and weakly targeted:** it only activates on large corpora, then fetches the first `max(limit*10, 1000)` summary embeddings, computes cosine in JS, then does per-hit row fetches plus six serial filter passes. [`memory-summaries.ts:161-192`, `memory-summaries.ts:210-218`, `pipeline/stage1-candidate-gen.ts:590-646`]
- **Extra embedding calls on the hot path:** deep mode regenerates one embedding per variant; R12 expansion generates another for `combinedQuery`; R8 may regenerate the query embedding instead of reusing `cachedEmbedding`. [`pipeline/stage1-candidate-gen.ts:263-280`, `pipeline/stage1-candidate-gen.ts:350-373`, `pipeline/stage1-candidate-gen.ts:594-595`]
- **MPAB is triplicated:** there is one implementation in the handler, one in `lib/scoring`, and another in Stage 3. That is dead/duplicated architecture and drift risk. [`handlers/memory-search.ts:520-679`, `lib/scoring/mpab-aggregation.ts:147-185`, `pipeline/stage3-rerank.ts:434-505`]

If you want, I can turn this into iteration 14 with a prioritized remediation plan.


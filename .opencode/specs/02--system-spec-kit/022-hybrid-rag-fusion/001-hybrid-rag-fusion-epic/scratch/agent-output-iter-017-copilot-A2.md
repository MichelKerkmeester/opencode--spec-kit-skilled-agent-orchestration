● skill(sk-deep-research)

I’m tracing the search pipeline end-to-end now so I can focus on real misalignments rather than surface-level nits. I’ll map the key data flow first, then verify suspected bugs and dead paths against the source.

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 50 files found

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Create session plan file (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && mkdir -p
  │ '/Users/michelkerkmeester/.copilot/session-state/1d2700cb-fd94-4154-9ccc-91420de94b5d' && cat
  │ >
  │ '/Users/michelkerkmeester/.copilot/session-state/1d2700cb-fd94-4154-9ccc-91420de94b5d/plan.md'
  │ <<'EOF'…
  └ 10 lines...

● search hybrid RAG fusion search pipeline misalignment data flow in mcp_server lib/search
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I’ve got the search inventory. Next I’m reading the core entrypoints plus a few adjacent modules that look most likely to create cross-channel mismatches: routing, fusion, reranking, and output shaping.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:320 (319 lines read)

● Read query-router.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts
  └ L1:260 (166 lines read)

● Read rsf-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "hybridSearch|searchMemories|memory_search|rsf|rerank|crossEncoder|normalize|channel|vector|bm25
  │ |fts" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Explore Mapping search flow
  │ Read channel-enforcement.ts
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts
  │   └ L1:120 (120 lines read)
  └ Check source tracking in output formatting (shell)
      │ cd /Users/michelkerkmeester/MEGA/Development/Opencode\
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search && grep -n
      │ "sources.*\[\]\|source.*undefined\|listSources\|sourceCandidate" hybrid-search.ts
      │ pipeline/stage2-fusion.ts | head -20
      └ 4 lines...

I found one genuinely promising thread from the first pass: the code carries both “live pipeline” and “shadow/offline” concepts side by side, which is often where misalignments hide. I’m checking whether those branches are actually wired, or just documented as if they are.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L320:760 (440 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:260 (260 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L760:1160 (401 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1160:1540 (381 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L420:520 (101 lines read)

I found two separate chunk-collapse implementations already, which is exactly the kind of split-brain architecture that produces “it works here but not there” behavior. I’m validating whether the legacy `hybrid-search` path and the staged pipeline normalize chunk parents the same way.

● Read channel-enforcement.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts
  └ L1:260 (139 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:320 (319 lines read)

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ L1:320 (78 lines read)

● Read mpab-aggregation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts
  └ L1:260 (185 lines read)

● Search (grep)
  │ "rsfShadow|fuseResultsRsf|hybridSearchEnhanced\(|searchWithFallback\(|collapseAndReassembleChunk
  │ Results\(|parentMemoryId|parent_id|chunkIndex|chunk_index" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 78 lines found

I found a potentially bigger architectural split than the chunk issue: the “4-stage pipeline” may be invoking `searchWithFallback()` inside Stage 1, which already performs fusion, reranking, truncation, and fallback on its own. I’m verifying that now because it would mean the staged pipeline is only partially real.

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L260:620 (361 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L1:280 (280 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L240:460 (221 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:260 (259 lines read)

● Search (grep)
  │ "executePipeline\(|SPECKIT_PIPELINE_V2|executeStage1\(|searchWithFallback\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 62 lines found

This now looks less like a small bug and more like an architectural impedance mismatch: V2 is the default path, but its Stage 1 still delegates to the older end-to-end hybrid pipeline. I’m checking the handler boundary to confirm that this isn’t just a test-only path.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L900:1040 (141 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L90:150 (61 lines read)

● Read pipeline-v2.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts
  └ L280:310 (30 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L520:700 (145 lines read)

● Search (grep)
  │ "extractScoringValue\(|resolveEffectiveScore\(|rrfScore ===|intentAdjustedScore ===|score
  │ invariant|budgetTruncated|_s3meta|_degradation" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 53 lines found

I’ve confirmed the handler uses V2 in production, so the split isn’t hypothetical. One last pass: I’m checking whether channel attribution and scoring semantics stay consistent after fusion, because that’s where “correct ranking, wrong explanation” bugs often hide.

● Read ranking-contract.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts
  └ L1:120 (68 lines read)

● Read channel-representation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts
  └ L1:280 (203 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1540:1700 (160 lines read)

● Read search-results.ts
  │ .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
  └ L240:360 (121 lines read)

● Search (grep)
  │ "source: 'mpab'|sources\]|underRepresentedChannels|channelCounts|traceMetadata|queryComplexity"
  │ in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I found a stronger channel-enforcement bug than just attribution: the enforcement layer can promote raw channel scores back into the fused ranking. If those scores are still on heterogeneous scales, a promoted item can outrank the fused list for the wrong reason. I’m confirming the vector score scale before I lock that in.

● Read vector-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts
  └ L1:220 (166 lines read)

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L1:240 (239 lines read)

● Read channel.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/channel.vitest.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "similarity / 100|similarity\) \|\| 0|cosine|0-100|normalize.*similarity|vectorSearch\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 24 lines found

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L260:330 (71 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L80:100 (21 lines read)

● Read causal-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
  └ L80:90 (11 lines read)

● Read session-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts
  └ L108:126 (19 lines read)

I’ve got three high-confidence misalignments already. I’m doing one final consistency check on score precedence, because the staged pipeline has at least three different “best score” resolvers, and that usually leaks into diagnostics or filtering.

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L260:420 (161 lines read)

● Search (grep)
  │ "stage2Score|rerankScore|intentAdjustedScore|rrfScore|score =|score:
  │ rerank|resolveBaseScore\(|extractScoringValue\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 77 lines found

● Search (grep)
  │ "buildPipelineRow\(|resolveBaseScore\(|scoreResolution|extractTrace\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 32 lines found

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L180:215 (36 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L543:575 (33 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:220 (220 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L801:999 (199 lines read)

Q5 synthesis: the biggest misalignment is architectural. The runtime always uses `executePipeline()` (`handlers/memory-search.ts:929-968`), but Stage 1 claims to return raw candidates with no scoring (`lib/search/pipeline/stage1-candidate-gen.ts:6-33,179-190`; `lib/search/pipeline/types.ts:184-210`). In practice, hybrid Stage 1 delegates to `searchWithFallback()` (`stage1-candidate-gen.ts:259-326,406-415`), which already does routing/fusion/enforcement/truncation/reranking/MMR/budgeting inside `hybridSearchEnhanced()` (`lib/search/hybrid-search.ts:543-575,801-999`). Stage 3 then reranks/MMRs again (`lib/search/pipeline/stage3-rerank.ts:116-125,159-229`).

Second, channel enforcement mixes score scales. It promotes raw per-channel results built from `score` or raw `similarity` (`hybrid-search.ts:806-823`); vector similarity is explicitly stored on a 0–100 scale (`lib/search/vector-index-queries.ts:275-299`). Those raw items are promoted and globally resorted by `score` (`lib/search/channel-representation.ts:151-178`; `lib/search/channel-enforcement.ts:109-121`), so promoted vector hits can overpower fused scores.

Third, MPAB is split-brain. `hybrid-search` collapses chunks into bare `{id, score, source:'mpab'}` parents (`hybrid-search.ts:761-792`) using a lightweight helper (`lib/scoring/mpab-aggregation.ts:129-185`), while Pipeline Stage 3 has a separate DB-backed reassembly path with restored content/metadata (`stage3-rerank.ts:221-229,554-607`). Because Stage 1 already calls `searchWithFallback()`, Stage 3 often receives post-collapsed parents, not chunks.

Fourth, score precedence is inconsistent: canonical resolver = `intentAdjustedScore -> rrfScore -> score -> similarity/100` (`pipeline/types.ts:49-68`), ranking contract = `score -> intentAdjustedScore -> rrfScore` (`pipeline/ranking-contract.ts:36-49`), Stage 4 evidence-gap = `rrfScore -> intentAdjustedScore -> score` (`pipeline/stage4-filter.ts:203-216`). After reranking, Stage 3 overwrites `score` but preserves older `rrfScore`/`intentAdjustedScore` (`stage3-rerank.ts:373-380`), so diagnostics can read stale pre-rerank values.

Dead/shadow code: RSF is documented as dormant/shadow-only (`lib/search/rsf-fusion.ts:7-23`), and `rsfShadow` exists in pipeline metadata (`hybrid-search.ts:130-140`), but I found no live write path for it in `lib/search/`.


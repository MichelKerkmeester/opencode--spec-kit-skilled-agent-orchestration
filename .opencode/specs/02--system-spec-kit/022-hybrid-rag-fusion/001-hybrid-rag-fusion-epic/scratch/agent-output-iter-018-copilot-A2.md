● skill(sk-deep-research)

I’m lining up the research pass now: first I’ll load any relevant memory/skill routing context, then I’ll read the search subsystem in a few parallel slices and trace how data moves through it.

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/dfefbf28-f896-434d-9a12-ee671915c7e5/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 10 lines...

● Run skill advisor for research task (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep research iteration 18/20 on
  │ hybrid-rag-fusion system at .opencode/skill/system-spec-kit/mcp_server/lib/search/. Focus:
  │ Cross-validate findings. Read source files, trace data flows, find bugs, dead code, architecture
  │ issues. Report with file:line citations." --threshold 0.8
  └ 99 lines...

I’ve got the routing context. Next I’m mapping the search subsystem’s entry points and pipeline stages so I can validate actual data flow rather than just eyeballing isolated files.

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/search
  └ 50 files found

● Search (grep)
  │ "(search|retrieve|fusion|rerank|rrf|bm25|fts5|vector|graph|trigger|format|normalize|merge|query)
  │ " in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 53 files found

● search hybrid RAG fusion search pipeline in mcp_server lib/search retrieval fusion reranking form…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I’ve identified the likely spine: `hybrid-search.ts` and the pipeline stages. I’m reading those together with the type contracts so I can validate where scores, limits, and filters actually get transformed.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:260 (259 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:260 (260 lines read)

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ L1:260 (78 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:260 (260 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:260 (259 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L1:260 (260 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:260 (260 lines read)

● Read ranking-contract.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts
  └ L1:260 (68 lines read)

I’ve got the main pipeline contract. To cross-check my own read, I’m also spinning up an independent code-analysis pass while I drill into the lower-level fusion and routing helpers.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L260:620 (361 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L260:620 (360 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L260:760 (501 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L260:760 (405 lines read)

● Explore Cross-check search subsystem
  │ Find all syncScoreAliasesInPlace calls (shell)
  │   │ grep -n "syncScoreAliasesInPlace" "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
  │   └ 4 lines...
  └ Read context of both syncScoreAliasesInPlace calls (shell)
      │ cat "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
      |
      │ sed -n '755,800p'
      └ 47 lines...

I’ve got one independent review back. I’m now verifying the most likely issues directly in the call sites and late-stage score handling so I only report things that hold up end-to-end.

● Read query-router.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts
  └ L1:260 (166 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L758:840 (83 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L620:980 (361 lines read)

● Read search-types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts
  └ L1:260 (10 lines read)

● Search (grep)
  │ "executePipeline\(|searchWithFallback\(|syncScoreAliasesInPlace\(|applyValidationSignalScoring\(
  │ |resolveRerankOutputScore\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 32 lines found

I’ve narrowed it down to a few candidate failure modes. I’m checking the handler boundary and the fallback hybrid path now to see which ones are real behavioral bugs versus internal code smells.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L900:1080 (180 lines read)

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L1:260 (259 lines read)

● Read channel-enforcement.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts
  └ L1:260 (139 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1070:1225 (156 lines read)

● Read confidence-truncation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts
  └ L1:260 (231 lines read)

I found a few stronger leads than the first pass. I’m checking whether they’re reachable in the runtime path or only in deprecated helpers, because I only want to hand you issues that can actually matter in this iteration.

● Read mpab-aggregation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts
  └ L1:260 (185 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L980:1135 (156 lines read)

● Search (grep)
  │ "canonicalResultId\(|Set<number>\(|new Set<number>\(" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 14 lines found

● Search (grep)
  │ "collapseAndReassembleChunkResults\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 27 lines found

● Search (grep)
  │ "\bhybridSearch\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 23 lines found

A stronger pattern just surfaced: the “Stage 1 = raw candidate generation” contract doesn’t match the code path it actually calls. I’m validating that mismatch and checking whether it causes duplicated fusion/rerank logic in the live runtime.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L620:760 (82 lines read)

● Read memory-summaries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts
  └ L1:260 (242 lines read)

● Search (grep)
  │ "isMemorySummariesEnabled|querySummaryEmbeddings\(|checkScaleGate\(" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 9 lines found

● Search (grep)
  │ "function applyArchiveFilter|function
  │ applyFolderFilter|applyArchiveFilter\(|applyFolderFilter\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 4 lines found

● Search (grep)
  │ "formatSearchResults\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 31 lines found

I’ve confirmed one of the cleaner side paths, and the bigger issue still stands: the live pipeline is layering a second fusion/rerank stack inside Stage 1. I’m checking the formatter just once to see whether that masks or exposes the chunk-collapse mismatch.

● Read search-results.ts
  │ .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
  └ L356:520 (165 lines read)

● Read search-results.ts
  │ .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
  └ L520:760 (64 lines read)

● Search (grep)
  │ "searchWithFallbackTiered|structuralSearch\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 5 lines found

● Search (grep)
  │ "includeContent|contentSource|precomputedContent|file_read_fallback|reassembled_chunks"
  │ (.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts)
  └ 14 lines found

I’ve confirmed the formatter won’t paper over missing parent metadata if Stage 1 has already collapsed chunks. I’m doing one last targeted read on the tiered fallback and the handler’s search-type signaling so the final report stays tight.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1450:1545 (96 lines read)

● Search (grep)
  │ "searchType: 'hybrid'|searchType: \(hasValidConcepts"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 1 line found

● Search (grep)
  │ "type SearchType|searchType: string|searchType\b"
  │ (.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts)
  └ 4 lines found

● Search (grep)
  │ "co-activation|applyMMR\(|truncateToBudget\(|enforceChannelRepresentation\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 10 lines found

● Search (grep)
  │ "Stage 1.*NO scoring|No scoring|raw scores assigned by the search channel"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 2 lines found

I’ve got the main architecture mismatch nailed down. I’m doing one last check on ID normalization across channels, because there’s a plausible duplicate-result bug in the multi-query merge if string and numeric IDs survive the fusion layer.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L374:389 (15 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L270:305 (36 lines read)

● Read hybrid-search.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts
  └ L430:455 (26 lines read)

● Search (grep)
  │ "export function fuseResultsMulti|function fuseResultsMulti|canonical|normalize.*id|ResultId" in
  │ **/*rrf-fusion*.ts
  └ 9 lines found

● Read rrf-fusion.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
  └ L90:280 (190 lines read)

● Read rrf-fusion.ts
  │ .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
  └ L280:460 (181 lines read)

Cross-validating the live path (`memory-search` → `executePipeline` → Stage1-4), the strongest validated issues are:

- **Stage 1 is not actually “raw candidate generation.”** It calls `searchWithFallback()`/`hybridSearchEnhanced()`, which already does fusion, channel enforcement, confidence truncation, MMR, co-activation, and token-budget truncation, then Stage 2/3 apply co-activation/MMR again. That breaks the Stage 1 contract and double-applies ranking logic. [`handlers/memory-search.ts:929-968`](.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L929-L968) [`pipeline/stage1-candidate-gen.ts:179-190`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L179-L190) [`pipeline/stage1-candidate-gen.ts:257-326`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L257-L326) [`hybrid-search.ts:732-999`](.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L732-L999) [`pipeline/stage2-fusion.ts:619-647`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L619-L647) [`pipeline/stage3-rerank.ts:159-229`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L159-L229)

- **Chunk-collapse is split across two incompatible places.** Stage1’s hybrid path collapses chunk hits into bare parent rows `{id, score, source, _chunkHits}`, but Stage3 can only reassemble rows that still carry `parent_id`/`parentId`. Result: collapsed hits can no longer get `precomputedContent`/`file_path`, so `includeContent` can degrade to `"File not found"`. [`hybrid-search.ts:761-792`](.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L761-L792) [`pipeline/stage3-rerank.ts:448-460`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L448-L460) [`pipeline/stage3-rerank.ts:563-607`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L563-L607) [`formatters/search-results.ts:441-460`](.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts#L441-L460)

- **Deep/R12 variant merging can duplicate the same memory.** Stage1 dedups merged variant results with `Set<number>()` on raw `row.id`, but BM25 emits string IDs and RRF preserves the original ID shape from the first contributing item, so `"42"` and `42` can survive as separate rows across variants. [`pipeline/stage1-candidate-gen.ts:292-300`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L292-L300) [`pipeline/stage1-candidate-gen.ts:378-386`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L378-L386) [`hybrid-search.ts:279-299`](.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L279-L299) [`shared/algorithms/rrf-fusion.ts:248-257`](.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L248-L257)

- **Tier-3 structural fallback ignores `includeArchived`.** `structuralSearch()` filters only on `importance_tier`, not `is_archived`, and Stage1 only reapplies archive filtering to the summary-embedding side channel, not to general fallback results. Degraded searches can therefore surface archived memories even when `includeArchived=false`. [`hybrid-search.ts:1134-1185`](.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1134-L1185) [`hybrid-search.ts:1452-1516`](.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1452-L1516) [`pipeline/stage1-candidate-gen.ts:96-107`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L96-L107) [`pipeline/stage1-candidate-gen.ts:621-623`](.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L621-L623)


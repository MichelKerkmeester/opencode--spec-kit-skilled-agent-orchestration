● skill(sk-deep-research)

I’m pulling prior context and routing guidance first, then I’ll trace the query-expansion path and audit it for effectiveness issues.

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor for research task (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep research iteration 12/20 on
  │ hybrid-rag-fusion system at .opencode/skill/system-spec-kit/mcp_server/lib/search/. Focus: Query
  │ expansion effectiveness. Read source files, trace data flows, find bugs, dead code, architecture
  │ issues. Report with file:line citations." --threshold 0.8
  └ 59 lines...

I’ve got the routing/context baseline. Next I’m mapping the search pipeline and the exact query-expansion codepaths so I can trace effectiveness end to end.

● Search (grep)
  │ "expand|expansion|query variant|variants|synonym|rewrite|bm25|fts5|fusion|rrf|recall|rerank" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/**/*"
  └ 58 files found

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● search query expansion logic and hybrid rag fusion retrieval pipeline in system-spec-kit mcp_serv…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I found one interesting clue already: the focused memory pipeline exposed an `r12-embedding-expansion` candidate step adding very generic terms like `tool`, `anchor`, `spec`, and `memory`, which looks potentially noisy. I’m drilling into where those terms come from and whether they materially affect recall/precision.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ 1 line read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ 1 line read

● Read query-expander.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts
  └ 95 lines read

● Search (grep)
  │ "query-expander|QueryExpander|expandQuery|expandQueries|embedding-expansion|expandEmbedding|r12-
  │ embedding-expansion|expandedTerms|combinedQuery|multiQuery|deepExpansion" in **/*.{ts,js,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 31 lines found

● Read embedding-expansion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts
  └ 304 lines read

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L130:230 (101 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L320:430 (111 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:260 (259 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L620:710 (82 lines read)

● Read query-classifier.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts
  └ L1:240 (223 lines read)

● Read query-router.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts
  └ L1:260 (166 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:260 (251 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L260:520 (261 lines read)

● Search (grep)
  │ "buildDeepQueryVariants\(|expandQuery\(" in **/*.{ts,js,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 4 lines found

● Search (grep)
  │ "searchWithFallback\(|routeQuery\(|forceAllChannels|classifyQueryComplexity\("
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 7 lines found

I’ve confirmed there are two distinct expansion paths: rule-based deep-mode variants and embedding-based R12 expansion. Now I’m checking whether both paths actually affect ranking or if one is effectively shadow/dead behavior.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L240:320 (81 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L540:760 (220 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1460:1515 (56 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1040:1135 (96 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ L260:320 (61 lines read)

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ L1:280 (78 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "type PipelineRow|interface PipelineRow" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 1 line found

● Search (grep)
  │ "canonicalResultId\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 7 lines found

● Search (grep)
  │ "Expand acronyms|fix typos|preprocess" in **/*.md
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 1 line found

I found a bigger architectural wrinkle: Stage 1’s “candidate generation” is calling `searchWithFallback()`, which already runs fusion/reranking internally before Stage 2 and Stage 3 run again. I’m validating whether that means expansion effectiveness is being distorted by double-ranking rather than cleanly measured.

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:260 (260 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L760:1045 (286 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:220 (219 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md
  └ L1:220 (117 lines read)

● Search (grep)
  │ "resolveEffectiveScore|rrfScore|intentAdjustedScore|score|similarity"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 59 lines found

I’ve got several candidate findings. I’m doing one independent pass in parallel to sanity-check the data-flow interpretation before I finalize the report.

● Explore Audit expansion flow
  │ Check exports (shell)
  │   │ cd /Users/michelkerkmeester/MEGA/Development/Opencode\ Env/Public && grep "hybridSearch,"
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  │   └ 2 lines...
  └ Create comprehensive audit findings (shell)
      │ cat > /tmp/audit_findings.txt << 'EOF'
      │ # QUERY EXPANSION EFFECTIVENESS AUDIT - FINDINGS
      │
      │ ## CRITICAL ISSUE: Signal Loss in Expansion Channel Merging…
      └ Permission denied and could not request permission from user

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1190:1215 (26 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L300:380 (81 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L388:405 (17 lines read)

● Search (grep)
  │ "triggerPhrases" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 28 lines found

Findings for query-expansion effectiveness:

- `Stage1` is not feeding raw candidates downstream. Deep-mode and R12 both call `searchWithFallback()`, which already runs hybrid fusion and later-stage ranking logic before `Stage2`/`Stage3` execute again, contradicting the pipeline contract that Stage1 is candidate-gen and Stage2 is the single scoring point. [`pipeline/stage1-candidate-gen.ts:179-187,271-285,350-370`; `hybrid-search.ts:745-748,862-909,1078-1097`; `pipeline/README.md:76-99,103-109`]

- Expansion signal is lost on merge. Both deep-mode and R12 dedupe by first occurrence, baseline-first, so if the same memory appears in baseline and expanded results, the expanded hit is discarded rather than fused. [`pipeline/stage1-candidate-gen.ts:292-299,378-388`; `pipeline/orchestrator.ts:42-57`]

- R12 is noisy and confounded. Expansion terms are mined by raw frequency from similar-memory `content`/`title`/`trigger_phrases`, then appended directly to the literal query string; that same string is sent into lexical search and complexity routing, so “improvements” can come from query noise or extra channels, not cleaner semantic broadening. [`embedding-expansion.ts:124-148,215-243,268-273`; `hybrid-search.ts:347-360,383-408,627-643`; `query-classifier.ts:22-23,176-181`; `query-router.ts:57-60,119-141`]

- Telemetry overstates expansion. Trace metadata records feature-flag state, not actual expansion execution, and suppressed/zero-term R12 cases produce no dedicated trace entry. [`pipeline/stage1-candidate-gen.ts:390-396,659-672`]

- Trigger-phrase suppression is inconsistent. `routeQuery()` can use `triggerPhrases`, but R12 gating calls `classifyQueryComplexity(query)` without them, and pipeline config has no trigger-phrase field, so exact-trigger queries can still take the expansion path. [`hybrid-search.ts:76-82,561-565`; `query-classifier.ts:143-170,176-181`; `embedding-expansion.ts:196-199,300-303`; `pipeline/types.ts:112-158`]

- Legacy scoring remains reachable: `hybridSearchEnhanced()` falls back to deprecated `hybridSearch()`, so failures can silently change scoring semantics during expansion experiments. [`hybrid-search.ts:415-418,1059-1064`]

No edits made.


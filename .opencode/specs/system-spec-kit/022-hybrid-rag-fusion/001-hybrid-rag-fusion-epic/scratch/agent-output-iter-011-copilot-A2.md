● skill(sk-deep-research)

I’m locating the active research state and relevant search-module files first, then I’ll do a focused UX audit on the data flow and surface only concrete issues with citations.

● Search (glob)
  │ "**/lib/search/**/*" in .opencode/skill/system-spec-kit/mcp_server
  └ 58 files found

● Search (glob)
  │ "**/deep-research-*" in specs
  └ 33 files found

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ "**/*hybrid-rag-fusion*"
  └ 1 file found

● Create session plan file (shell)
  │ mkdir -p
  │ '/Users/michelkerkmeester/.copilot/session-state/47fe8824-9abc-4913-8c88-47a673b48d3c' && cat
  │ >
  │ '/Users/michelkerkmeester/.copilot/session-state/47fe8824-9abc-4913-8c88-47a673b48d3c/plan.md'
  │ <<'EOF'…
  └ 9 lines...

I found the hybrid-rag-fusion spec trail. Next I’m reading the current research state plus the search pipeline entry points so I can trace what a developer actually experiences from query to result shaping.

● Read deep-research-strategy.md
  │ specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/scratch/deep-research
  │ -strategy.md
  └ 1 line read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ 1 line read

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ 1 line read

● Read query-router.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts
  └ 166 lines read

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ 78 lines read

● Read search-types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts
  └ 10 lines read

● Read deep-research-config.json
  │ specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/scratch/deep-research
  │ -config.json
  └ 33 lines read

● Search (grep)
  │ "TODO|FIXME|deprecated|warn|console\.|throw new Error|Not implemented|unused" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Read recent deep research state (shell)
  │ tail -n 25 '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-
  │ kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/research/deep-research-state.jsonl'
  └ 25 lines...

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

I’ve got the current loop state; the stored state says iteration 11 was the UX pass, but the config is already marked `complete`, so I’m validating the code directly rather than trusting the research log. Now I’m tracing which UX-oriented pieces are actually wired in.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:260 (259 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L261:520 (260 lines read)

● Read deep-research-strategy.md
  │ specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/scratch/deep-research
  │ -strategy.md
  └ L1:220 (65 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ L1:260 (260 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L521:860 (340 lines read)

● Search (grep)
  │ "routeQuery\(|getChannelSubset\(|ALL_CHANNELS|GraphSearchFn|executePipeline\(|executeStage1\(|ex
  │ ecuteHybridSearch\(|searchType|artifactRouting|evidenceGapDetected|intentWeightsApplied" in
  │ **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 58 lines found

● Search (grep)
  │ "export .*GraphSearchFn|type
  │ GraphSearchFn|RouteResult|ChannelRoutingConfig|routeQuery\(|classifyQueryComplexity\(" in
  │ **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "developer UX|UX|warning|warningText|evidence
  │ gap|evidenceGap|trace|artifact_routing|artifactRouting" in **/*.{md,json,jsonl}
  │ (specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic)
  └ 5 lines found

● search developer-facing search result metadata warnings trace artifact routing evidence gap in hy…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

The search README is promising a lot, so I’m now checking which pieces are actually on the live path versus only in the legacy search implementation. That’s where most UX drift usually hides.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L180:360 (181 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L360:560 (201 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L540:840 (301 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L230:380 (136 lines read)

● Search (grep)
  │ "applyIntentWeights\(|detectIntent\(|PIPELINE_V2|confidence:|confidence\b" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 93 lines found

● Search (grep)
  │ "levenshtein|acronym|typo tolerance|fuzzy" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Search (grep)
  │ "console\.warn|console\.error|catch \(|_err|_error"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 32 lines found

● Search (grep)
  │ "hybridSearchEnhanced\(|hybridSearch\(|searchWithFallback\(|executePipeline\(" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve confirmed there are effectively two search worlds here: the new 4-stage pipeline and the older `hybrid-search.ts` engine that Stage 1 still calls. I’m narrowing on places where docs/metadata imply one thing but callers get another.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L860:1110 (251 lines read)

● Read copilot-tool-output-1774013666796-hrrd7b.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774013666796-hrrd7b.txt
  └ L1:260 (89 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L90:145 (55 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1110:1710 (601 lines read)

● Read intent-classifier.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts
  └ L360:520 (161 lines read)

● Read copilot-tool-output-1774013648420-hc9tkg.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774013648420-hc9tkg.txt
  └ L1:220 (98 lines read)

● Search (grep)
  │ "artifact_routing|artifactRouting|evidenceGapWarning|evidenceGapDetected|annotations:|trace:|pip
  │ elineMetadata" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 58 lines found

I’ve got enough structure now to separate UX issues from general correctness issues. I’m doing one last pass on handler output and dead-code call sites so the report is anchored to what developers actually see from the API.

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L210:330 (121 lines read)

● Search (grep)
  │ "Levenshtein|acronym|typo|fuzzy"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ No matches found

● Search (grep)
  │ "searchWithFallback\(|hybridSearchEnhanced\(" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 1 line found

● Search (grep)
  │ "warning|warn|error|failed|skipped|applied"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts)
  └ 3 lines found

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L820:1015 (195 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1016:1085 (70 lines read)

● Search (grep)
  │ "SPECKIT_PIPELINE_V2" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 15 lines found

● Search (grep)
  │ "\bdetectIntent\b|\bapplyIntentWeights\b" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 17 lines found

I found a few solid UX-specific issues already: normal searches logging to `stderr`, response-shape duplication, and docs/types that contradict the real stage behavior. I’m checking one last metadata contract so I can report the mismatches precisely.

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L150:220 (71 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L640:705 (62 lines read)

● Read search-results-format.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts
  └ L130:180 (51 lines read)

● Search (grep)
  │ "stateFiltered|constitutionalInjected|evidenceGapDetected|stateStats|featureFlags"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts)
  └ No matches found

● Search (grep)
  │ "artifact_routing|feedback_signals|graph_contribution|chunk_reassembly|adaptive_shadow|applied_b
  │ oosts" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 15 lines found

● Search (grep)
  │ "queryComplexity|_s3meta|_s4shadow|traceMetadata|budgetTruncated|budgetLimit" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 63 lines found

One last worthwhile check: whether every public handler uses the same search stack. If not, that’s a big source of “why did tool A and tool B behave differently?” confusion for developers.

● Read eval-reporting.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
  └ L88:108 (21 lines read)

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ L1:20 (20 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ L300:320 (21 lines read)

● Search (grep)
  │ "executePipeline\(|hybridSearchEnhanced\(" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 2 lines found

Audit-only, no code changes.

Findings:

- High: the public search stack is split. `memory_search` runs `executePipeline()`, but Stage 1 still re-enters legacy `searchWithFallback()`/`hybridSearchEnhanced()`, while `eval-reporting` bypasses the pipeline entirely. That means tooling can observe different behavior, metadata, and fallback semantics for the same query. `[handlers/memory-search.ts:929-968] [lib/search/pipeline/stage1-candidate-gen.ts:259-326,340-416] [lib/search/hybrid-search.ts:1078-1118] [handlers/eval-reporting.ts:88-99]`

- High: normal intent auto-detection logs to `console.error`, so successful requests pollute stderr. `[handlers/memory-search.ts:862-872]`

- Medium: pipeline metadata cannot tell “disabled” from “crashed”; it only exposes booleans/counters, while Stage 2 swallows errors and leaves flags false. `[lib/search/pipeline/types.ts:221-240,289-302] [lib/search/pipeline/stage2-fusion.ts:559-576,585-616,717-741]`

- Medium: response schema duplicates camelCase and snake_case fields, increasing payload size and cognitive load. `[handlers/memory-search.ts:993-1005,1016-1047]`

- Medium: docs/types drift. Orchestrator still says “behind `SPECKIT_PIPELINE_V2`” although the flag is ignored, and Stage 4 type docs claim session dedup happens there although implementation says it does not. `[lib/search/pipeline/orchestrator.ts:1-4] [lib/search/search-flags.ts:107-115] [lib/search/README.md:77-80] [lib/search/pipeline/types.ts:270-301] [lib/search/pipeline/stage4-filter.ts:236-237,255-345]`

- Low: `detectIntent` and `applyIntentWeights` look like dead production surface; live flow uses `classifyIntent`/`getIntentWeights` plus Stage 2’s `applyIntentWeightsToResults()`. `[lib/search/intent-classifier.ts:379-489] [handlers/memory-search.ts:862-866] [lib/search/pipeline/stage2-fusion.ts:717-725]`


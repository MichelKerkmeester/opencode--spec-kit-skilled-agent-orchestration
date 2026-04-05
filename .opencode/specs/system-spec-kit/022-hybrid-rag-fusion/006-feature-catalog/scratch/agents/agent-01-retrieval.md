● List directory .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/
  └ 11 files found

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor and create session plan (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Review ALL .md files in
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/ for alignment with described
  │ tool/feature names and parameters in .opencode/skill/system-spec-kit/scripts/ source code"
  │ --threshold 0.8 && mkdir -p
  │ '/Users/michelkerkmeester/.copilot/session-state/85fe0421-335c-4bfc-bdfa-e48f395914a7' && cat …
  └ 62 lines...

● skill(system-spec-kit)

I’m auditing the 11 retrieval catalog docs against the actual `scripts/` source now. First I’m pulling the docs and the relevant implementation references in batches so I can compare each file consistently.

● Read 01-unified-context-retrieval-memorycontext.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memor
  │ ycontext.md
  └ 1 line read

● Read 02-semantic-and-lexical-search-memorysearch.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-mem
  │ orysearch.md
  └ 1 line read

● Read 03-trigger-phrase-matching-memorymatchtriggers.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorym
  │ atchtriggers.md
  └ 175 lines read

● Read 04-hybrid-search-pipeline.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md
  └ 175 lines read

● Read 05-4-stage-pipeline-architecture.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.m
  │ d
  └ 224 lines read

● Read 06-bm25-trigger-phrase-re-index-gate.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-ga
  │ te.md
  └ 47 lines read

● Read 01-unified-context-retrieval-memorycontext.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memor
  │ ycontext.md
  └ L1:120 (120 lines read)

● Read 02-semantic-and-lexical-search-memorysearch.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-mem
  │ orysearch.md
  └ L1:120 (120 lines read)

● Read 07-ast-level-section-retrieval-tool.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-too
  │ l.md
  └ 32 lines read

● Read 08-quality-aware-3-tier-search-fallback.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fal
  │ lback.md
  └ 45 lines read

● Read 09-tool-result-extraction-to-working-memory.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-worki
  │ ng-memory.md
  └ 53 lines read

● Read 10-fast-delegated-search-memory-quick-search.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-qu
  │ ick-search.md
  └ 57 lines read

● Read 11-session-recovery-memory-continue.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-memory-continu
  │ e.md
  └ 69 lines read

I’ve got the catalog claims loaded. Next I’m checking whether those tool names and parameter surfaces actually appear anywhere under `scripts/`, which should make the alignment gaps pretty obvious.

● Search (glob)
  │ "**/*" in .opencode/skill/system-spec-kit/scripts
  └ 5 files found

● Search (grep)
  │ "memory_context|memory_search|memory_match_triggers|memory_quick_search|/memory:continue|working
  │ -memory|working_memory|searchWithFallbackTiered|searchWithFallback|hybrid-search|pipeline|BM25|t
  │ riggerPhrases|read_spec_section" in **/*.{ts,js,md,sh,json}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● search system-spec-kit scripts source code references to memory_context memory_search memory_matc…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

● Read copilot-tool-output-1774455696590-3h7ww2.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774455696590-3h7ww2.txt
  └ L1:220 (104 lines read)

● Search (glob)
  │ "**/*.{ts,js,sh}" in .opencode/skill/system-spec-kit/scripts
  └ 5 files found

● Search (grep)
  │ "memory_context|memory_search|memory_match_triggers|memory_quick_search" in **/*.{ts,js,sh}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Search (grep)
  │ "working_memory|working-memory|searchWithFallbackTiered|searchWithFallback|read_spec_section|tri
  │ ggerPhrases|BM25|pipeline|resume" in **/*.{ts,js,sh} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Scan scripts tree for retrieval tool names and parameters (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts')…
  └ 216 lines...

● Search (grep)
  │ "\bmemory_context\b" in **/*.{ts,js,sh,md,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Search (grep)
  │ "\bmemory_search\b" in **/*.{ts,js,sh,md,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Search (grep)
  │ "\bmemory_match_triggers\b" in **/*.{ts,js,sh,md,json,jsonc}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "\bmemory_quick_search\b" in **/*.{ts,js,sh,md,json,jsonc}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "(/memory:continue|CONTINUE_SESSION\.md|\bmemory_list\b|\bmemory_stats\b)" in
  │ **/*.{ts,js,sh,md,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "searchWithFallbackTiered|searchWithFallback|hybrid-search|RRF|MMR|SPECKIT_SEARCH_FALLBACK" in
  │ **/*.{ts,js,sh,md,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ 2 lines found

● Search (grep)
  │ "stage1-candidate-gen|stage2-fusion|stage3-rerank|stage4-filter|score
  │ immutability|Stage4ReadonlyRow|captureScoreSnapshot|verifyScoreInvariant" in
  │ **/*.{ts,js,sh,md,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "read_spec_section|remark|AST-level section retrieval|heading-level" in
  │ **/*.{ts,js,sh,md,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "working_memory|working-memory|extraction-adapter|upsertExtractedEntry|MENTION_BOOST_FACTOR" in
  │ **/*.{ts,js,sh,md,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ 13 lines found

● Search (grep)
  │ "memoryQuickSearchSchema|handleMemorySearch|includeConstitutional|includeContent|autoDetectInten
  │ t" in **/*.{ts,js,sh,md,json,jsonc} (.opencode/skill/system-spec-kit/scripts)
  └ 3 lines found

● Read install.sh
  │ .opencode/skill/system-spec-kit/scripts/setup/install.sh
  └ L270:360 (91 lines read)

● Search (grep)
  │ "feature_catalog|feature catalog|mcp_server" in **/*.{ts,js,sh,md,json,jsonc}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Read test-export-contracts.js
  │ .opencode/skill/system-spec-kit/scripts/tests/test-export-contracts.js
  └ L110:160 (51 lines read)

● Read test-integration.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts
  └ L150:190 (41 lines read)

● Read run-performance-benchmarks.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts
  └ L140:210 (70 lines read)

● Read reindex-embeddings.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts
  └ L60:95 (36 lines read)

● Read copilot-tool-output-1774455773060-1aaog0.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774455773060-1aaog0.txt
  └ L1:220 (96 lines read)

● Read check-architecture-boundaries.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts
  └ L1:40 (40 lines read)

● Read check-architecture-boundaries.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts
  └ L390:485 (96 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/scripts/evals/README.md
  └ L30:65 (36 lines read)

● Read package.json
  │ .opencode/skill/system-spec-kit/scripts/package.json
  └ L1:40 (32 lines read)

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ L100:130 (31 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1360:1405 (46 lines read)

● Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
  └ L140:156 (17 lines read)

● Read session-types.ts
  │ .opencode/skill/system-spec-kit/scripts/types/session-types.ts
  └ L65:90 (26 lines read)

● Read task-enrichment.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
  └ L540:560 (21 lines read)

● Search (grep)
  │ "includeTrace|tokenUsage|include_cognitive|turnNumber|memoryQuickSearchSchema|autoDetectIntent"
  │ in **/*.{ts,js,sh} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "includeTrace|tokenUsage|sharedSpaceId|tenantId|userId|agentId|include_cognitive|turnNumber|memo
  │ ryQuickSearchSchema|autoDetectIntent|includeConstitutional|includeContent|SPECKIT_SEARCH_FALLBAC
  │ K|SPECKIT_PIPELINE_V2|read_spec_section|CONTINUE_SESSION\.md" in **/*.{ts,js,sh,md,json,jsonc}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Search (grep)
  │ "tenantId|userId|agentId|sharedSpaceId" in **/*.{ts,js,sh}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

I’ve confirmed the main pattern: the retrieval catalog docs mostly point at `mcp_server` runtime code, while the `scripts/` package is mostly wrappers, evals, installers, and tests. I’m now pulling the few concrete `scripts/` call sites so I can separate “indirectly referenced” from “not present at all.”

● Read run-ablation.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts
  └ L1:220 (181 lines read)

● Read run-bm25-baseline.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts
  └ L1:180 (179 lines read)

● Search (grep)
  │ "search\(|runSearch|memorySearch|searchMemory|quick_search|resume|includeContent|anchors|minStat
  │ e|concepts|autoDetectIntent|query" in **/*.ts (.opencode/skill/system-spec-kit/scripts/evals)
  └ 38 lines found

● Search (grep)
  │ "memory_context|memory_search|memory_match_triggers|memory_quick_search|memory_list|memory_stats
  │ " in **/*.ts (.opencode/skill/system-spec-kit/scripts/evals)
  └ No matches found

✗ Memory stored architecture
  └ The scripts workspace is a CLI/evals package; import MCP runtime through `../../…

● Count precise retrieval term matches in scripts source (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts')
  │ exclude_parts = {'node_modules', 'dist'}…
  └ 138 lines...

● Explore Cross-checking audit
  │ Read README.md
  │   │ .opencode/skill/system-spec-kit/scripts/README.md
  │   └ 148 lines read
  └ Search for MCP tool names in scripts (shell)
      │ grep -r
      "memory_context\|memory_search\|memory_quick_search\|memory_match_triggers\|memory_conti
      │ nue\|memory_list\|memory_stats\|memory_context\|read_spec_section"
      │ "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/scripts" --include="*.ts" --include="*.js"
      │ --include="*.sh" 2>/dev/null
      └ 2 lines...

● Read (Explore agent — Cross-checking audit)
  └ idle

Assessed against `.opencode/skill/system-spec-kit/scripts/` only. Most docs describe `mcp_server` runtime features, not `scripts/` implementations.

`01-unified-context-retrieval-memorycontext.md | MISALIGNED | Exact tool name appears only in scripts installer help (`scripts/setup/install.sh:351`); documented modes/params like `includeTrace`, `tokenUsage`, `tenantId/userId/agentId/sharedSpaceId` are absent in scripts.`

`02-semantic-and-lexical-search-memorysearch.md | MISALIGNED | `memory_search` appears only in installer help (`scripts/setup/install.sh:351`); documented search surface (`includeContent`, `autoDetectIntent`, `minState`, full handler/pipeline) is not implemented in scripts.`

`03-trigger-phrase-matching-memorymatchtriggers.md | PARTIAL | No exact `memory_match_triggers` tool in scripts, but related pieces exist: `session_id` fields and trigger phrase handling (`scripts/evals/run-performance-benchmarks.ts:153`, `scripts/core/memory-indexer.ts:104`). Cognitive/governance params are absent.`

`04-hybrid-search-pipeline.md | PARTIAL | Scripts call runtime search via `hybridSearchEnhanced` in eval code (`scripts/evals/run-ablation.ts:24-30,114-126`) and mention MMR in installer help (`scripts/setup/install.sh:282`), but the documented pipeline itself is not implemented in scripts.`

`05-4-stage-pipeline-architecture.md | MISALIGNED | No scripts matches for `stage1-candidate-gen`, `stage2-fusion`, `stage3-rerank`, `stage4-filter`, `Stage4ReadonlyRow`, or `verifyScoreInvariant`.`

`06-bm25-trigger-phrase-re-index-gate.md | PARTIAL | Scripts clearly contain BM25 and `triggerPhrases` concepts (`scripts/evals/run-bm25-baseline.ts:26-31`, `scripts/core/workflow.ts:1384-1388`, `scripts/core/memory-indexer.ts:104-125`), but not the documented `memory-crud-update.ts` re-index gate.`

`07-ast-level-section-retrieval-tool.md | ALIGNED | Doc says deferred/planned with no source files; scripts also contain no `read_spec_section`, `remark`, or heading-level retrieval implementation.`

`08-quality-aware-3-tier-search-fallback.md | MISALIGNED | No scripts matches for `searchWithFallbackTiered`, `checkDegradation`, `SPECKIT_SEARCH_FALLBACK`, or structural SQL fallback logic.`

`09-tool-result-extraction-to-working-memory.md | PARTIAL | Scripts know about `working_memory` in benchmarks/tests (`scripts/evals/run-performance-benchmarks.ts:153-168`, `scripts/tests/test-integration.vitest.ts:167-185`), but there is no scripts-side `extraction-adapter`, `upsertExtractedEntry`, or `MENTION_BOOST_FACTOR` implementation.`

`10-fast-delegated-search-memory-quick-search.md | MISALIGNED | No `memory_quick_search` or `memoryQuickSearchSchema` in scripts; only a generic `handleMemorySearch` export-parser reference appears in test code (`scripts/tests/test-export-contracts.js:129-137`).`

`11-session-recovery-memory-continue.md | MISALIGNED | No `/memory:continue`, `CONTINUE_SESSION.md`, `memory_list`, `memory_stats`, or resume fallback chain in scripts.`

`SUMMARY: total=11, aligned=1, partial=4, misaligned=6, P0=6, P1=4, P2=1.`


● skill(sk-code-review)

I’m scanning the retrieval catalog and cross-checking it against the actual MCP server/tool/search pipeline implementation so I can give you a per-file alignment report with only real mismatches.

● Read review_core.md
  │ .agents/skills/sk-code-review/references/review_core.md
  └ L1:220 (98 lines read)

● Read review_ux_single_pass.md
  │ .agents/skills/sk-code-review/references/review_ux_single_pass.md
  └ L1:220 (82 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/01--retrieval/*.md"
  └ 11 files found

● Run skill advisor for review task (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3
  │ .opencode/skill/scripts/skill_advisor.py 'Review ALL .md files in
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/ against system-spec-kit
  │ mcp_server handlers tools lib/search and scripts, and report genuine mismatches only'
  │ --threshold 0.8
  └ 35 lines...

I’ve got the file list and confirmed the task routes to review plus OpenCode/system-spec context. Next I’m loading the OpenCode standards and then I’ll do the per-file implementation cross-check.

● skill(sk-code-opencode)

● skill(system-spec-kit)

I’m at the evidence-gathering step now: reading all 11 catalog entries, then mapping each claim to actual tool schemas, handlers, and search-pipeline code before I classify anything.

● Read 01-unified-context-retrieval-memorycontext.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memor
  │ ycontext.md
  └ L1:260 (251 lines read)

● Read 02-semantic-and-lexical-search-memorysearch.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-mem
  │ orysearch.md
  └ L1:260 (247 lines read)

● Read 03-trigger-phrase-matching-memorymatchtriggers.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorym
  │ atchtriggers.md
  └ L1:260 (175 lines read)

● Read 04-hybrid-search-pipeline.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md
  └ L1:260 (175 lines read)

● Read 05-4-stage-pipeline-architecture.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.m
  │ d
  └ L1:260 (224 lines read)

● Read 06-bm25-trigger-phrase-re-index-gate.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-ga
  │ te.md
  └ L1:260 (47 lines read)

● Read 07-ast-level-section-retrieval-tool.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-too
  │ l.md
  └ L1:260 (32 lines read)

● Read 08-quality-aware-3-tier-search-fallback.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fal
  │ lback.md
  └ L1:260 (45 lines read)

● Read 09-tool-result-extraction-to-working-memory.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/09-tool-result-extraction-to-worki
  │ ng-memory.md
  └ L1:260 (53 lines read)

● Read 10-fast-delegated-search-memory-quick-search.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-qu
  │ ick-search.md
  └ L1:260 (57 lines read)

● Read 11-session-recovery-memory-continue.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-memory-continu
  │ e.md
  └ L1:260 (69 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/*.ts"
  └ 146 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/handlers/*.ts"
  └ 31 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tools/**/*.ts"
  └ 7 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/**/*.ts"
  └ 71 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/*.js"
  └ 28 files found

I’ve read the catalog entries. Now I’m checking the actual runtime surfaces: tool schemas, tool dispatch, handlers, and the search pipeline implementation/README so I can separate real drift from harmless wording differences.

● Search (grep)
  │ "Stage 1|Stage 2|Stage 3|Stage 4|candidate generation|fusion|rerank|filter|score
  │ immutability|Readonly|verifyScoreInvariant|captureScoreSnapshot" in *.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Search (grep)
  │ "memory_context|memory_search|memory_match_triggers|memory_quick_search" in *.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "handleMemoryContext|handleMemorySearch|handleMemoryTriggers|handleMemoryQuickSearch|memoryQuick
  │ SearchSchema|searchWithFallbackTiered|checkDegradation|enforceTokenBudget|sessionTransition|pres
  │ sure policy|tokenUsage|SPECKIT_PRESSURE_POLICY|SPECKIT_FOLDER_DISCOVERY" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "read_spec_section|remark|AST|heading|section retrieval|ast-parser" in *.{ts,js,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "working memory|upsertExtractedEntry|extraction-adapter|after-tool|tool result|tool-result" in
  │ *.{ts,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/README.md"
  └ 1 file found

● Search (grep)
  │ "CONTINUE_SESSION.md|memory:continue|resume
  │ mode|state|next-steps|summary|blockers|memory_list|memory_stats" in *.{ts,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

I’ve narrowed this to the concrete runtime files now. I’m spot-checking the handler/schema/dispatch code and the search pipeline README so the final report cites actual implementation facts, not just file-name matches.

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L1:260 (257 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:320 (320 lines read)

● Read memory-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts
  └ L1:320 (77 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L1:340 (340 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:360 (360 lines read)

● Read memory-triggers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
  └ L1:320 (320 lines read)

● Read memory-crud-update.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
  └ L1:260 (260 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ L1:260 (260 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:360 (360 lines read)

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ L1:320 (195 lines read)

● Read working-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "MODES|quick|focused|deep|resume|budget|tokenUsage|pressure|SPECKIT_PRESSURE_POLICY|SPECKIT_FOLD
  │ ER_DISCOVERY|discoverSpecFolder|sessionTransition|autoResume|systemPromptContext|effectiveMode"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 5 lines found

● Search (grep)
  │ "executePipeline|trackAccess|mode === 'deep'|expandQuery|query variants|includeConstitutional|mi
  │ nState|quality|includeTrace|graphWalkDiagnostics|sessionTransition"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 30 lines found

● Search (grep)
  │ "searchWithFallbackTiered|checkDegradation|DEGRADATION_QUALITY_THRESHOLD|DEGRADATION_MIN_RELATIV
  │ E_GAP|DEGRADATION_MIN_RESULTS|SPECKIT_SEARCH_FALLBACK|Object.defineProperty|_degradation"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 27 lines found

✗ Search (grep)
  │ "Stage4ReadonlyRow|captureScoreSnapshot|verifyScoreInvariant|Readonly|stateFiltered|evidenceGapD
  │ etected|quality floor|QUALITY_FLOOR"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/*.ts)
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/*.ts: IO error for
    operation on /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/*.ts: No such file or
    directory (os error 2)

● Read continue.md
  │ .opencode/command/memory/continue.md
  └ L1:240 (240 lines read)

● Read extraction-adapter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts
  └ L1:260 (260 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L1:260 (260 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L1:280 (280 lines read)

● Read ast-parser.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts
  └ L1:220 (49 lines read)

I’ve already found a couple of places where the docs are more specific than the runtime. I’m verifying those with line-level source before I call them misaligned so the final list stays high-signal.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L400:760 (361 lines read)

● Search (grep)
  │ "MODES|const .*Mode|quick.*800|focused.*1500|deep.*2000|resume.*1200|tokenUsage
  │ >|pressureOverride|discoverSpecFolder|systemPromptContext|resume mode"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 39 lines found

✗ Search (grep)
  │ "upsertExtractedEntry|insert.*working_memory|source_tool|source_call_id|extraction_rule_id|redac
  │ tion_applied" (.opencode/skill/system-spec-kit/mcp_server/lib/{cognitive,extraction}/*.ts)
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/{cognitive,extraction}/*.ts: IO error
    for operation on /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/{cognitive,extraction}/*.ts: No such
    file or directory (os error 2)

● Search (grep)
  │ "initExtractionAdapter|registerAfterToolCallback|afterTool"
  │ (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 8 lines found

● Search (grep)
  │ "workingMemory|working_memory|checkpoint"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts)
  └ 94 lines found

● Search (grep)
  │ "memory_stats|spec_kit_memory_memory_stats|CONTINUE_SESSION.md|memory_list|memory_search|anchors
  │ |blockers" (.opencode/command/memory/continue.md)
  └ 28 lines found

● Search (grep)
  │ "memory-tools\.vitest|context-server\.vitest|handler-memory-context\.vitest|handler-memory-searc
  │ h\.vitest|handler-memory-triggers\.vitest" (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L1:280 (280 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:260 (259 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L340:760 (420 lines read)

I’ve confirmed the public tool surfaces. I’m doing one more pass through the stage files and a few referenced test/source paths, because some of the drift looks like stale “source files/tests” tables rather than behavioral mismatches.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:320 (320 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:360 (360 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:320 (320 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L760:1180 (421 lines read)

● Search (glob)
  │ "**/CONTINUE_SESSION.md" in .opencode/skill/system-spec-kit
  └ No matches found

● Search (grep)
  │ "memory_stats" (.opencode/command/memory/continue.md)
  └ 1 line found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/{memory-tools.vitest.ts,context-server.vitest.
  │ ts,handler-memory-context.vitest.ts,handler-memory-search.vitest.ts,handler-memory-triggers.vite
  │ st.ts}"
  └ 5 files found

● Search (grep)
  │ "trackAccess|FSRS|update.*access|strengthen|qualityThreshold|includeConstitutional|includeArchiv
  │ ed|query expansion|deep"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 47 lines found

● Search (grep)
  │ "community|graph walk|rollout|testing effect|trackAccess|validation metadata|anchor
  │ metadata|feedback|intent weights|isHybrid"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 52 lines found

● Search (grep)
  │ "parent_id|parentId|chunk_index|chunkIndex|chunk_label|chunkLabel|fallback|reassembled"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)
  └ 69 lines found

● Read pressure-monitor.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts
  └ L1:220 (101 lines read)

● Search (grep)
  │ "0\.60|0\.80|focused|quick|pressure
  │ level|getPressureLevel|HIGH_PRESSURE|MODERATE_PRESSURE|threshold"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/pressure-monitor.ts)
  └ 5 lines found

● Search (grep)
  │ "searchWithFallback\(|searchWithFallbackTiered\(|Tier 3|ORDER BY
  │ importance_tier|includeArchived"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 16 lines found

✗ Search (grep)
  │ "memoryQuickSearchSchema|memory_quick_search|memory_match_triggers|memory_context|memory_search"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/{memory-tools.vitest.ts,context-server.vitest.
  │ ts,handler-memory-context.vitest.ts,handler-memory-search.vitest.ts,handler-memory-triggers.vite
  │ st.ts})
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-ki
    t/mcp_server/tests/{memory-tools.vitest.ts,context-server.vitest.ts,handler-memory-context.vites
    t.ts,handler-memory-search.vitest.ts,handler-memory-triggers.vitest.ts}: IO error for operation
    on /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit
    /mcp_server/tests/{memory-tools.vitest.ts,context-server.vitest.ts,handler-memory-context.vitest
    .ts,handler-memory-search.vitest.ts,handler-memory-triggers.vitest.ts}: No such file or
    directory (os error 2)

● Read memory-tools.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts
  └ L1:220 (65 lines read)

● Read context-server.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
  └ L1:220 (220 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "SPECKIT_ROLLOUT_PERCENT|isPressurePolicyEnabled|isFolderDiscoveryEnabled|isAutoResumeEnabled"
  │ in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 54 lines found

● Search (grep)
  │ "sessionTransition|transitionDiagnostics|graphWalkDiagnostics" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 56 lines found

One feature looks off at the public API layer, and I’m checking one last thing around `/memory:continue` breadcrumbs so I don’t overstate it. After that I can give you the full per-file matrix.

✗ Search (grep)
  │ "tenantId|userId|agentId|sharedSpaceId" (.opencode/skill/system-spec-kit/mcp_server/{tool-schema
  │ s.ts,schemas/tool-input-schemas.ts,handlers/memory-triggers.ts})
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-ki
    t/mcp_server/{tool-schemas.ts,schemas/tool-input-schemas.ts,handlers/memory-triggers.ts}: IO
    error for operation on /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/mcp_server/{tool-schemas.ts,schemas/tool-input-schema
    s.ts,handlers/memory-triggers.ts}: No such file or directory (os error 2)

● Search (grep)
  │ "trackAccess|strengthenOnAccess|fsrs|memory_index"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 25 lines found

● Search (grep)
  │ "CONTINUE_SESSION\.md|continue_session|Quick Resume|Current Task|Pending Work" in
  │ *.{ts,md,sh,js} (.opencode/skill/system-spec-kit)
  └ 28 lines found

● Search (grep)
  │ "context-server\.vitest|memory-tools\.vitest|handler-memory-context\.vitest|handler-memory-searc
  │ h\.vitest|handler-memory-triggers\.vitest" (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 1 file found

● Search (grep)
  │ "memory_context\(|memory_search\(|memory_match_triggers\(|memory_quick_search\("
  │ (.opencode/skill/system-spec-kit/feature_catalog/01--retrieval)
  └ 2 lines found

● Search (grep)
  │ "upsertExtractedEntry"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts)
  └ 1 line found

● Search (grep)
  │ "upsertExtractedEntry"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
  └ 3 lines found

● Search (grep)
  │ "write_continue_session_md|CONTINUE_SESSION.md|generateContinueSessionMarkdown"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
  └ 6 lines found

● Search (grep)
  │ "ORDER BY importance_tier|importance_weight|0\.5|50%|calibrateStructuralFallbackScores|Tier
  │ 3|structural" (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 15 lines found

● Search (grep)
  │ "No source files yet|ast-parser.ts|parseMarkdownSections|read_spec_section" (.opencode/skill/sys
  │ tem-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md)
  └ 2 lines found

● Search (grep)
  │ "parseMarkdownSections|chunkMarkdown|splitIntoBlocks"
  │ (.opencode/skill/system-spec-kit/scripts/memory/ast-parser.ts)
  └ 6 lines found

Reviewed against `.opencode/skill/system-spec-kit/mcp_server/` (handlers/, tools/, lib/search/) and `.opencode/skill/system-spec-kit/scripts/`.

```text
01-unified-context-retrieval-memorycontext.md | ALIGNED | Public tool schema, mode routing, token budgets, pressure policy, folder discovery, resume-mode injection, and sessionTransition trace all exist in `tool-schemas.ts`, `handlers/memory-context.ts`, `lib/search/search-flags.ts`, and `lib/cognitive/pressure-monitor.ts`.

02-semantic-and-lexical-search-memorysearch.md | ALIGNED | `memory_search` schema/handler match the documented parameter surface; runtime uses the 4-stage pipeline via `handlers/memory-search.ts` -> `lib/search/pipeline/*`, with deep-mode expansion, trace support, minState, quality threshold, rerank, and trackAccess.

03-trigger-phrase-matching-memorymatchtriggers.md | MISALIGNED | Handler logic supports governed scope fields in `handlers/memory-triggers.ts`, but the public MCP tool surface does not: `tool-schemas.ts` and `schemas/tool-input-schemas.ts` expose only `prompt`, `limit`, `session_id`, `turnNumber`, and `include_cognitive`. The doc overstates callable parameters.

04-hybrid-search-pipeline.md | ALIGNED | `lib/search/hybrid-search.ts` implements the documented 5-channel engine, adaptive fusion, MMR/diversity, channel enforcement, confidence truncation, dynamic token budget, and `searchWithFallback()` -> `searchWithFallbackTiered()` fallback chain.

05-4-stage-pipeline-architecture.md | ALIGNED | The four bounded stages exist exactly as documented in `lib/search/pipeline/stage1-candidate-gen.ts`, `stage2-fusion.ts`, `stage3-rerank.ts`, `stage4-filter.ts`, with orchestrated execution in `pipeline/orchestrator.ts` and compile/runtime score immutability enforcement in `pipeline/types.ts` + `stage4-filter.ts`.

06-bm25-trigger-phrase-re-index-gate.md | ALIGNED | `handlers/memory-crud-update.ts` reindexes BM25 when either `title` or `triggerPhrases` changes, matching the documented gate.

07-ast-level-section-retrieval-tool.md | PARTIAL | No `read_spec_section` MCP tool/handler exists, so the feature remains deferred as described; however, “No source files yet” is too strong because `scripts/memory/ast-parser.ts` already provides AST/section-parsing groundwork (`parseMarkdownSections`, `chunkMarkdown`, `splitIntoBlocks`).

08-quality-aware-3-tier-search-fallback.md | ALIGNED | `lib/search/hybrid-search.ts` contains `checkDegradation()`, `searchWithFallbackTiered()`, Tier 1/2/3 degradation logic, structural Tier 3 search, non-enumerable `_degradation` metadata, and the 50% Tier-3 score cap.

09-tool-result-extraction-to-working-memory.md | ALIGNED | `lib/extraction/extraction-adapter.ts` summarizes/redacts tool outputs and calls `workingMemory.upsertExtractedEntry()`, `context-server.ts` initializes the adapter via after-tool callbacks, and `lib/storage/checkpoints.ts` snapshots/restores `working_memory`.

10-fast-delegated-search-memory-quick-search.md | ALIGNED | `memory_quick_search` is present in `tool-schemas.ts`, validated by `memoryQuickSearchSchema`, and delegated in `tools/memory-tools.ts` to `handleMemorySearch()` with the documented defaults.

11-session-recovery-memory-continue.md | ALIGNED | The command contract in `.opencode/command/memory/continue.md` matches reality: primary recovery via `memory_context(mode:"resume")`, fallback `memory_search`/`memory_list`, and breadcrumb support via `CONTINUE_SESSION.md` generated by `lib/session/session-manager.ts`.
```

SUMMARY: total=11, aligned=9, misaligned=1, partial=1, P0=0, P1=1, P2=1


● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Review all markdown files in
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/ for alignment with
  │ features implemented in .opencode/skill/system-spec-kit/mcp_server and
  │ .opencode/skill/system-spec-kit/scripts" --threshold 0.8
  └ 43 lines...

I’ve got the review route and relevant skills identified. Next I’m loading the feature catalog files and the review skill context so I can compare each doc against the actual `mcp_server` and `scripts` implementations.

● skill(sk-code-review)

● List directory .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements
  └ 9 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/*.md"
  └ 9 files found

I’ve got the file list. Now I’m reading all nine catalog entries in one pass so I can extract the claimed behavior before matching them against both code trees.

● Read 01-dual-scope-memory-auto-surface.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-
  │ auto-surface.md
  └ 101 lines read

● Read 02-constitutional-memory-as-expert-knowledge-injection.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/02-constitutional-mem
  │ ory-as-expert-knowledge-injection.md
  └ 48 lines read

● Read 03-spec-folder-hierarchy-as-retrieval-structure.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/03-spec-folder-hierar
  │ chy-as-retrieval-structure.md
  └ 46 lines read

● Read 04-lightweight-consolidation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-consol
  │ idation.md
  └ 64 lines read

● Read 05-memory-summary-search-channel.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/05-memory-summary-sea
  │ rch-channel.md
  └ 59 lines read

● Read 06-cross-document-entity-linking.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/06-cross-document-ent
  │ ity-linking.md
  └ 57 lines read

● Read 07-tier-2-fallback-channel-forcing.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-ch
  │ annel-forcing.md
  └ 46 lines read

● Read 08-provenance-rich-response-envelopes.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-re
  │ sponse-envelopes.md
  └ 49 lines read

● Read 09-contextual-tree-injection.md
  │ .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-in
  │ jection.md
  └ 52 lines read

I’ve extracted the claimed behaviors. Next I’m cross-checking those claims against the real code in both `mcp_server` and `scripts`, including whether the named symbols, flags, and tests actually exist.

● search forceAllChannels true during tier-2 quality fallback all retrieval channels execute regard…
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● search auto-surface memories at tool dispatch and session compaction; skip memory-aware tools; co…
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● search constitutional memories enriched with retrieval directives and scope filtering during stag…
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● search spec folder hierarchy tree with parent sibling ancestor retrieval and cache invalidation
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● search cross-document entity linking create supports causal edges across spec folders based on sh…
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● search memory summary search channel TF-IDF extractive summaries summary embeddings stage 1 adapt…
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

✗ search includeTrace provenance envelopes scores source trace in memory_search and memory_context …
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

✗ search contextual tree injection prefixes chunks with hierarchical context headers using cached s…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

✗ search lightweight consolidation weekly contradiction scanning Hebbian edge strengthening stalene…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

The semantic search tool wasn’t cooperative, so I’m falling back to exact symbol searches. I’m checking the concrete functions, flags, and tests each catalog entry claims, across both source trees.

● Search (grep)
  │ "autoSurfaceMemories|autoSurfaceAtCompaction|memory-surface|trigger-matched|tool
  │ dispatch|compaction" in {mcp_server,scripts}/**/*.{ts,tsx,js,json,md}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "retrieval_directive|enrichWithRetrievalDirectives|shouldApplyScopeFiltering|constitutional" in
  │ {mcp_server,scripts}/**/*.{ts,tsx,js,json,md} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "buildHierarchyTree|queryHierarchyMemories|invalidateHierarchyCache|spec-folder-hierarchy|siblin
  │ g|grandparent" in {mcp_server,scripts}/**/*.{ts,tsx,js,json,md}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "CONSOLIDATION_INTERVAL_DAYS|hasNegationConflict|weight_history|staleness|Hebbian|consolidation"
  │ in {mcp_server,scripts}/**/*.{ts,tsx,js,json,md} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "computeTfIdf|extractKeySentences|memory_summaries|querySummaryEmbeddings|SPECKIT_MEMORY_SUMMARI
  │ ES|summary embeddings" in {mcp_server,scripts}/**/*.{ts,tsx,js,json,md}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "buildEntityCatalog|findCrossDocumentMatches|createEntityLinks|runEntityLinking|SPECKIT_ENTITY_L
  │ INKING_MAX_DENSITY|entity_linker|relation='supports'|relation = 'supports'" in
  │ {mcp_server,scripts}/**/*.{ts,tsx,js,json,md} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "forceAllChannels|Tier-2|tier-2|quality fallback|channel reduction" in
  │ {mcp_server,scripts}/**/*.{ts,tsx,js,json,md} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "includeTrace|SPECKIT_RESPONSE_TRACE|scores|channelsUsed|pipelineStages|fallbackTier|queryComple
  │ xity|budgetTruncated|scoreResolution" in {mcp_server,scripts}/**/*.{ts,tsx,js,json,md}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "SPECKIT_CONTEXT_HEADERS|context headers|hierarchical context
  │ headers|tail-description|description map" in {mcp_server,scripts}/**/*.{ts,tsx,js,json,md}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

The first pass came back empty because my path filter was too aggressive. I’m re-running against the actual workspace layout and then I’ll inspect the specific implementation files the docs reference.

● List directory .opencode/skill/system-spec-kit
  └ 27 files found

● List directory .opencode/skill/system-spec-kit/mcp_server
  └ 33 files found

● List directory .opencode/skill/system-spec-kit/scripts
  └ 34 files found

● Search (grep)
  │ "autoSurfaceMemories|autoSurfaceAtCompaction|extractToolContextHints|memory-aware|tool
  │ dispatch|compaction" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "retrieval_directive|enrichWithRetrievalDirectives|shouldApplyScopeFiltering|Stage
  │ 1|constitutional" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "buildHierarchyTree|queryHierarchyMemories|invalidateHierarchyCache|sibling|grandparent|spec
  │ folder hierarchy" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "CONSOLIDATION_INTERVAL_DAYS|hasNegationConflict|weight_history|staleness|Hebbian|consolidation"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "computeTfIdf|extractKeySentences|memory_summaries|querySummaryEmbeddings|SPECKIT_MEMORY_SUMMARI
  │ ES" (.opencode/skill/system-spec-kit/mcp_server)
  └ 93 lines found

● Search (grep)
  │ "buildEntityCatalog|findCrossDocumentMatches|createEntityLinks|runEntityLinking|SPECKIT_ENTITY_L
  │ INKING_MAX_DENSITY|entity_linker|supports" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "forceAllChannels|Tier-2|tier-2|quality fallback|channel reduction"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 12 lines found

● Search (grep)
  │ "includeTrace|SPECKIT_RESPONSE_TRACE|channelsUsed|pipelineStages|fallbackTier|queryComplexity|bu
  │ dgetTruncated|scoreResolution" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_CONTEXT_HEADERS|context headers|hierarchical context
  │ headers|tail-description|description map" (.opencode/skill/system-spec-kit/mcp_server)
  └ 7 lines found

I’ve confirmed several features exist in `mcp_server`. I’m now doing the parallel check against `scripts` so I can distinguish “implemented only in server” from “fully represented across both trees” versus “doc overclaims.”

● Search (grep)
  │ "autoSurfaceMemories|autoSurfaceAtCompaction|memory-surface|retrieval_directive|enrichWithRetrie
  │ valDirectives|buildHierarchyTree|queryHierarchyMemories|invalidateHierarchyCache"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "CONSOLIDATION_INTERVAL_DAYS|hasNegationConflict|weight_history|computeTfIdf|extractKeySentences
  │ |memory_summaries|querySummaryEmbeddings" (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "buildEntityCatalog|findCrossDocumentMatches|createEntityLinks|runEntityLinking|SPECKIT_ENTITY_L
  │ INKING_MAX_DENSITY|forceAllChannels|includeTrace|SPECKIT_RESPONSE_TRACE|SPECKIT_CONTEXT_HEADERS"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Search (grep)
  │ "autoSurfaceMemories|autoSurfaceAtCompaction|extractToolContextHints|skipMemoryAwareTool|skip
  │ auto-surface|TOOL_DISPATCH_BUDGET|COMPACTION_BUDGET|constitutionalCache"
  │ (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 4 lines found

● Search (grep)
  │ "extractToolContextHints|buildAutoSurfaceResult|constitutional|trigger|cache|skip|memory-aware"
  │ (.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
  └ 37 lines found

● Search (grep)
  │ "retrieval_directive|enrichWithRetrievalDirectives|extractRetrievalDirective|MAX_SCAN_CHARS|MAX_
  │ SEGMENT_LENGTH" (.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts)
  └ 15 lines found

● Search (grep)
  │ "shouldApplyScopeFiltering|constitutional|retrieval_directive|enrichWithRetrievalDirectives|inje
  │ ct" (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 30 lines found

● Search (grep)
  │ "buildHierarchyTree|queryHierarchyMemories|invalidateHierarchyCache|CACHE_TTL_MS|parent:
  │ 0.8|sibling: 0.5|grandparent: 0.6"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts)
  └ 6 lines found

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L720:820 (101 lines read)

● Read memory-surface.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts
  └ L1:260 (260 lines read)

● Read retrieval-directives.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts
  └ L1:240 (240 lines read)

● Read spec-folder-hierarchy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts
  └ L1:260 (260 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L140:360 (221 lines read)

● Read consolidation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
  └ L1:320 (320 lines read)

● Read tfidf-summarizer.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts
  └ L1:260 (251 lines read)

● Read memory-summaries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts
  └ L1:320 (242 lines read)

● Read entity-linker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
  └ L1:360 (360 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:320 (320 lines read)

● Read search-results.ts
  │ .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
  └ L1:280 (280 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:260 (260 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L1:260 (260 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:260 (259 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L1:260 (257 lines read)

I’ve got the main implementation files open. I’m now pinpointing the exact sections for fallback forcing, context headers, entity linking, and summary-channel wiring so the final pass can separate core alignment from smaller documentation drift.

● Search (grep)
  │ "forceAllChannels|degrad|tier-2|Tier-2|activeChannels = options.forceAllChannels|force all
  │ channels" (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 26 lines found

● Search (grep)
  │ "CONTEXT_HEADER_MAX_CHARS|injectContextualTree|SPECKIT_CONTEXT_HEADERS|ensureDescriptionCache|he
  │ ader" (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 18 lines found

● Search (grep)
  │ "buildEntityCatalog|findCrossDocumentMatches|createEntityLinks|runEntityLinking|batchGetEdgeCoun
  │ ts|density|supports|created_by"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts)
  └ 47 lines found

● Search (grep)
  │ "querySummaryEmbeddings|checkScaleGate|memory_summaries|minQualityScore|summaryResults|scopeFilt
  │ eredSummaryHits"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 8 lines found

● Search (grep)
  │ "includeTrace|scores:|source:|trace:|channelsUsed|pipelineStages|fallbackTier|queryComplexity|bu
  │ dgetTruncated|scoreResolution"
  │ (.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts)
  └ 39 lines found

● Search (grep)
  │ "includeTrace|SPECKIT_RESPONSE_TRACE"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 7 lines found

● Search (grep)
  │ "includeTrace" (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 12 lines found

● Search (grep)
  │ "forceAllChannels" (.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L560:760 (200 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1160:1360 (201 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1490:1710 (221 lines read)

● Read entity-linker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
  └ L360:760 (401 lines read)

● Read search-results.ts
  │ .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
  └ L260:520 (261 lines read)

● Read run-ablation.ts
  │ .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts
  └ L1:220 (181 lines read)

● Search (grep)
  │ "autoSurfacedContext = await autoSurfaceAtCompaction|autoSurfacedContext = await
  │ autoSurfaceMemories|autoSurfaceAtToolDispatch\(|autoSurfaceAtCompaction\("
  │ (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 3 lines found

● Search (grep)
  │ "TIER 2: Widen search|forceAllChannels: true|Tier 1→2 degradation|Tier 2→3
  │ degradation|searchWithFallbackTiered"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 8 lines found

● Search (grep)
  │ "function injectContextualTree|content: `\$\{header\}\\n\$\{content\}`|withDesc|tailKey"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 10 lines found

I’ve confirmed the major implementations. I’m doing one last precision pass for line-level evidence and for the places where the docs may be overclaiming source-file involvement rather than feature existence.

● Collect line-level evidence for feature review (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit' && {
  │ echo '--- context-server auto-surface ---' && rg -n
  │ "autoSurfaceAtToolDispatch|autoSurfaceAtCompaction|autoSurfaceMemories\("
  │ mcp_server/context-server.ts &&…
  └ 196 lines...

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L286:324 (39 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1878:1904 (27 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1715:1740 (25 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L972:1036 (65 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L744:832 (89 lines read)

● Read hybrid-search.vitest.ts
  └ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts

● Read hybrid-search-context-headers.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts
  └ L1:160 (160 lines read)

I’ve found an important drift candidate: the cross-document entity-linking doc may be mixing `entity_catalog` with `memory_entities`. I’m checking the actual save/link orchestration now so I can classify that one correctly.

● Search (grep)
  │ "generateAndStoreSummary\(|runEntityLinking\(|consolidation"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 1 line found

● Search (grep)
  │ "generateAndStoreSummary\(|runConsolidation\(|consolidation|runEntityLinking\(|memory_entities|e
  │ ntity_catalog" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Find orchestration call sites (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit' && {
  │ echo '--- generateAndStoreSummary call sites ---' && rg -n "generateAndStoreSummary\("
  │ mcp_server &&
  │ echo '\n--- consolidation call sites ---' && rg -n "runConsolidation\(|consolidation …
  └ 15 lines...

● Read copilot-tool-output-1774458596012-5f0hoi.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774458596012-5f0hoi.txt
  └ 1 line read

● Show first lines of orchestration evidence (shell)
  │ head -n 120
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774458596012-5f0hoi.txt
  └ 121 lines...

● Read consolidation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts
  └ L320:580 (238 lines read)

● Read post-insert.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
  └ L100:150 (51 lines read)

● Read response-builder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
  └ L420:445 (26 lines read)

● Read entity-linker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
  └ L836:868 (33 lines read)

● Locate entity infrastructure check (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit' && rg -n
  │ "hasEntityInfrastructure|memory_entities|entity_catalog" mcp_server/lib/search/entity-linker.ts
  │ | head -n 80
  └ 16 lines...

I’ve got enough on most files. The last big question is whether spec-folder hierarchy is actually wired into live retrieval, or whether it mostly exists as an isolated module. That determines whether that catalog entry is aligned or overstated.

● Search (grep)
  │ "queryHierarchyMemories\(|buildHierarchyTree\(|getRelatedFolders\(|invalidateHierarchyCache\("
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 49 lines found

● Search (grep)
  │ "queryHierarchyMemories\(|buildHierarchyTree\(|getRelatedFolders\("
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Locate hierarchy usage in graph search (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit' && rg -n "queryHierarchyMemories\("
  │ mcp_server/lib/search/graph-search-fn.ts
  └ 2 lines...

01-dual-scope-memory-auto-surface.md | PARTIAL | Implemented in `mcp_server/context-server.ts` and `hooks/memory-surface.ts` (tool-dispatch, memory-aware/resume path, 4k budgets, skip recursion). No `scripts` implementation. Mismatch: implementation/test file inventory is heavily over-inclusive.

02-constitutional-memory-as-expert-knowledge-injection.md | ALIGNED | `mcp_server/lib/search/retrieval-directives.ts` and `pipeline/stage1-candidate-gen.ts` match the documented directive extraction and scope-filtered constitutional injection. No `scripts` counterpart found.

03-spec-folder-hierarchy-as-retrieval-structure.md | PARTIAL | Feature exists in `mcp_server/lib/search/spec-folder-hierarchy.ts` and is live via `graph-search-fn.ts:92`. No `scripts` implementation. Mismatch: source-files section omits the live retrieval wiring.

04-lightweight-consolidation.md | PARTIAL | Weekly gated post-save consolidation is real (`lib/storage/consolidation.ts`, `handlers/save/response-builder.ts`). No `scripts` implementation. Mismatch: source-files section overstates unrelated modules and misses the runtime hook.

05-memory-summary-search-channel.md | ALIGNED | Save-time summary generation and gated Stage-1 summary search are implemented in `handlers/save/post-insert.ts`, `lib/search/tfidf-summarizer.ts`, `memory-summaries.ts`, and `pipeline/stage1-candidate-gen.ts`. No `scripts` implementation.

06-cross-document-entity-linking.md | PARTIAL | Implemented in `mcp_server/lib/search/entity-linker.ts` and invoked from `handlers/save/post-insert.ts`. No `scripts` implementation. Mismatch: doc blurs `entity_catalog` (gate/alias source) with `memory_entities` (actual matching substrate).

07-tier-2-fallback-channel-forcing.md | PARTIAL | Tier-2 fallback does set `forceAllChannels: true` in `mcp_server/lib/search/hybrid-search.ts`. `scripts/evals/run-ablation.ts` also sets it, but that is eval plumbing, not Tier-2 fallback. Source-files section overstates supporting files.

08-provenance-rich-response-envelopes.md | ALIGNED | `includeTrace` is wired through `handlers/memory-search.ts`, `handlers/memory-context.ts`, `formatters/search-results.ts`, `schemas/tool-input-schemas.ts`, and `tool-schemas.ts`. No conflicting `scripts` implementation found.

09-contextual-tree-injection.md | ALIGNED | Implemented in `mcp_server/lib/search/hybrid-search.ts` with `SPECKIT_CONTEXT_HEADERS`, cached descriptions, and post-truncation injection; tests exist. No `scripts` counterpart found.

SUMMARY: total=9, aligned=4, misaligned=0, partial=5, P0=0, P1=1, P2=4.


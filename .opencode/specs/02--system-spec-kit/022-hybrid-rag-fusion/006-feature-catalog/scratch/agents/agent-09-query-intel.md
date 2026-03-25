● skill(sk-code--review)

I’m mapping the feature catalog against the actual `mcp_server` and `scripts` implementations now. I’ll read all 11 catalog files, cross-check each claim in both codebases, then return a per-file alignment report with severity-ranked mismatches.

● Read README.md
  │ .agents/skills/sk-code--review/README.md
  └ 79 lines read

● Read review_core.md
  │ .agents/skills/sk-code--review/references/review_core.md
  └ 98 lines read

● Read review_ux_single_pass.md
  │ .agents/skills/sk-code--review/references/review_ux_single_pass.md
  └ 82 lines read

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/*.md"
  └ 11 files found

I’ve got the exact 11 catalog files. Next I’m extracting each file’s claimed feature/phase/status, then I’ll verify whether matching code exists in both `mcp_server` and `scripts` before grading alignment.

● Read 01-query-complexity-router.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-route
  │ r.md
  └ 65 lines read

● Read 02-relative-score-fusion-in-shadow-mode.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-
  │ in-shadow-mode.md
  └ 48 lines read

● Read 03-channel-min-representation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representa
  │ tion.md
  └ 48 lines read

● Read 04-confidence-based-result-truncation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-resul
  │ t-truncation.md
  └ 46 lines read

● Read 05-dynamic-token-budget-allocation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-a
  │ llocation.md
  └ 50 lines read

● Read 06-query-expansion.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md
  └ 108 lines read

● Read 07-llm-query-reformulation.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/07-llm-query-reformulatio
  │ n.md
  └ 52 lines read

● Read 08-hyde-hypothetical-document-embeddings.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/08-hyde-hypothetical-docu
  │ ment-embeddings.md
  └ 56 lines read

● Read 09-index-time-query-surrogates.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/09-index-time-query-surro
  │ gates.md
  └ 53 lines read

● Read 10-query-decomposition.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/10-query-decomposition.md
  └ 53 lines read

● Read 11-graph-concept-routing.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/11-graph-concept-routing.
  │ md
  └ 47 lines read

I’ve read the catalog entries. Now I’m verifying whether each claimed implementation actually exists where the docs say it does, and whether any equivalent appears in `scripts` or is completely absent there.

● Search (grep)
  │ "dynamic-token-budget|adjustedBudget|SPECKIT_CONTEXT_HEADERS|token budget"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "query-classifier|query-router|complexity router|SPECKIT_COMPLEXITY_ROUTER|queryComplexity"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "rrf-fusion|relative score fusion|rsfShadow|SPECKIT_RSF_FUSION|RSF"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 58 lines found

● Search (grep)
  │ "channel-representation|channel-enforcement|SPECKIT_CHANNEL_MIN_REP|min-representation"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 56 lines found

● Search (grep)
  │ "confidence-truncation|SPECKIT_CONFIDENCE_TRUNCATION|median gap|relevance cliff"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 34 lines found

● Search (grep)
  │ "embedding-expansion|query-expander|SPECKIT_EMBEDDING_EXPANSION|expanded-query|stage1-expansion"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 68 lines found

● Search (grep)
  │ "llm-reformulation|SPECKIT_LLM_REFORMULATION|llm-cache|SEED_LIMIT|MAX_VARIANTS"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 41 lines found

● Search (grep)
  │ "hyde|SPECKIT_HYDE|SPECKIT_HYDE_ACTIVE|LOW_CONFIDENCE_THRESHOLD|MAX_HYDE_TOKENS"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 59 lines found

● Search (grep)
  │ "query-surrogates|surrogate-storage|SPECKIT_QUERY_SURROGATES|matchSurrogates|SurrogateMetadata"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 60 lines found

● Search (grep)
  │ "query-decomposer|SPECKIT_QUERY_DECOMPOSITION|MAX_FACETS|decomposition"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 47 lines found

● Search (grep)
  │ "entity-linker|SPECKIT_GRAPH_CONCEPT_ROUTING|matchedConcepts|graphActivated|concept-routing"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 46 lines found

● Search (grep)
  │ "query-classifier|query-router|SPECKIT_COMPLEXITY_ROUTER|rrf-fusion|rsfShadow|channel-representa
  │ tion|channel-enforcement|SPECKIT_CHANNEL_MIN_REP|confidence-truncation|SPECKIT_CONFIDENCE_TRUNCA
  │ TION|dynamic-token-budget|embedding-expansion|query-expander|SPECKIT_EMBEDDING_EXPANSION|llm-ref
  │ ormulation|SPECKIT_LLM_REFORMULATION|hyde|SPECKIT_HYDE|query-surrogates|SPECKIT_QUERY_SURROGATES
  │ |query-decomposer|SPECKIT_QUERY_DECOMPOSITION|entity-linker|SPECKIT_GRAPH_CONCEPT_ROUTING"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

I’ve confirmed a big pattern already: the `scripts` workspace appears to have no direct implementations for these query-intelligence features. I’m now spot-checking the underlying `mcp_server` code and a few ambiguous claims so I can distinguish “catalog scoped to server only” from actual documentation drift.

● Read query-classifier.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts
  └ L1:260 (223 lines read)

● Read query-router.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts
  └ L1:260 (166 lines read)

● search dynamic token budget allocation based on query complexity tier reduce effective budget by …
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● Read dynamic-token-budget.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts
  └ L1:220 (106 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L110:400 (291 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L300:1125 (520 lines read)

● search query complexity classifier router select search channels by term count and trigger match
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

✗ search query decomposition split complex question into sub-queries using conjunctions and wh-word…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

✗ search graph concept routing noun phrases alias table matched concepts trace metadata
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

● Search (grep)
  │ "queryComplexity|routeResult|traceMetadata|adjustedBudget|CONTEXT_HEADER_TOKEN_OVERHEAD|SPECKIT_
  │ DYNAMIC_TOKEN_BUDGET|tokenBudget"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 27 lines found

● Search (grep)
  │ "SEED_LIMIT|MAX_VARIANTS|MIN_OUTPUT_LENGTH|REFORMULATION_TIMEOUT_MS|cheapSeedRetrieve|fanout|nor
  │ malizeQuery" (.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts)
  └ 26 lines found

● Search (grep)
  │ "MIN_MATCH_THRESHOLD|MAX_SUMMARY_LENGTH|MIN_SURROGATE_QUESTIONS|MAX_SURROGATE_QUESTIONS|Surrogat
  │ eMatchResult|memoryId"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts)
  └ 30 lines found

● Search (grep)
  │ "graphActivated|routeQueryConcepts|concepts.length > 0|matchedConcepts"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts)
  └ 7 lines found

● Search (grep)
  │ "rsf-fusion\.vitest|rsf-multi|rsf-vs-rrf|SPECKIT_RSF_FUSION|rsfShadow|Relative score fusion"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 8 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/*rsf*.vitest.ts"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/shared/algorithms/*rsf*"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/*.ts"
  └ 146 files found

I’ve narrowed the likely drift to a small subset. Most entries map cleanly to `mcp_server` and nowhere in `scripts`, but the RSF-removal doc looks overstated, and I’m checking a few runtime details around HyDE/reformulation/filtering before I finalize severities.

● Read hyde.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts
  └ L1:220 (220 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L790:850 (61 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1288:1346 (59 lines read)

● Read llm-reformulation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts
  └ L1:220 (220 lines read)

● Read query-surrogates.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts
  └ L40:95 (56 lines read)

● Read entity-linker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
  └ L300:350 (51 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/tests/README.md
  └ L312:331 (20 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L30:50 (20 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L432:446 (15 lines read)

● Read embedding-expansion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts
  └ L1:360 (304 lines read)

● Search (grep)
  │ "buildDeepQueryVariants|expandQuery\(|stop|shorter than 3|length < 3|combinedQuery|expanded"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 18 lines found

● Read query-expander.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts
  └ L1:220 (101 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L840:980 (141 lines read)

● Search (grep)
  │ "qualityThreshold|contextType|scope filtering|tier
  │ filtering|shouldApplyScopeFiltering|newReformulationCandidates|newHydeCandidates"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 39 lines found

● Read confidence-truncation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts
  └ L1:220 (220 lines read)

I’ve got enough evidence for a near-final pass, but I’m doing one independent cross-check to make sure I’m not missing a subtle mismatch hiding behind comments or stale tests.

● Explore Cross-checking alignment
  │ Check query-surrogates for stale references (shell)
  │   │ grep -n
  │   "MAX_SUMMARY_LENGTH\|MIN_SURROGATE_QUESTIONS\|MAX_SURROGATE_QUESTIONS\|MIN_MATCH_THRESHO
  │   │ LD\|stale\|memoryId" "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts"
  │   │ 2>/dev/null | head -30
  │   └ 30 lines...
  └ Check search-flags for decomposition and graph routing (shell)
      │ grep -n "SPECKIT_QUERY_DECOMPOSITION\|isQueryDecompositionEnabled"
      │ "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      2>/dev/null
      └ 4 lines...

● Read (Explore agent — Cross-checking alignment)
  └ idle

Across all 11 files, I found the actual feature implementations in `mcp_server` only. I found **no matching feature implementations in `scripts`**, and none of these catalog files claim `scripts` ownership.

`01-query-complexity-router.md | ALIGNED | Matches `mcp_server/lib/search/query-classifier.ts`, `query-router.ts`, and `hybrid-search.ts` trace propagation (`queryComplexity`). Tiering, flags, and routing behavior align. No `scripts` implementation found.`

`02-relative-score-fusion-in-shadow-mode.md | MISALIGNED | RSF runtime code is gone, but the “fully removed from the codebase” claim is too strong: stale RSF references remain in mixed tests (`tests/search-fallback-tiered.vitest.ts`, `tests/feature-eval-query-intelligence.vitest.ts`, `tests/cross-feature-integration-eval.vitest.ts`), `tests/README.md`, and Stage 2 comments mentioning “RRF / RSF”. No `scripts` implementation found.`

`03-channel-min-representation.md | ALIGNED | `channel-representation.ts` and `channel-enforcement.ts` match the documented two-layer design, `QUALITY_FLOOR=0.005`, and wrapper re-sort behavior. No `scripts` implementation found.`

`04-confidence-based-result-truncation.md | ALIGNED | `confidence-truncation.ts` matches 2x-median-gap truncation, min-3 behavior, NaN/Infinity filtering, and flag gating. No `scripts` implementation found.`

`05-dynamic-token-budget-allocation.md | ALIGNED | `dynamic-token-budget.ts` and `hybrid-search.ts` match the 1500/2500/4000 tiers, early budget computation, header-overhead adjustment, and 200-token floor. No `scripts` implementation found.`

`06-query-expansion.md | PARTIAL | The embedding-based expansion path is real (`embedding-expansion.ts` + Stage 1 parallel baseline/expanded search), but the file conflates that with the separate deep-mode rule-based `query-expander.ts` path. “Simple-query suppression” is true for embedding expansion, not for the whole query-expansion story. No `scripts` implementation found.`

`07-llm-query-reformulation.md | ALIGNED | `llm-reformulation.ts`, shared `llm-cache.ts`, and Stage 1 deep-mode integration match the documented seed retrieval, constants, timeout, cache, and post-merge guardrails. No `scripts` implementation found.`

`08-hyde-hypothetical-document-embeddings.md | ALIGNED | `hyde.ts` matches dual-flag behavior, low-confidence thresholds, shared LLM cache, active/shadow modes, and Stage 1 guardrail re-filtering. No `scripts` implementation found.`

`09-index-time-query-surrogates.md | ALIGNED | `query-surrogates.ts`, `surrogate-storage.ts`, and Stage 1 integration match the documented surrogate generation, token-overlap matching, capped boost, and even the note that `SurrogateMatchResult.memoryId` is stale. No `scripts` implementation found.`

`10-query-decomposition.md | ALIGNED | `query-decomposer.ts`, Stage 1 deep-mode branching, flag gating, facet cap (`MAX_FACETS=3`), heuristic splitting, and fallback behavior all align. No `scripts` implementation found.`

`11-graph-concept-routing.md | PARTIAL | Runtime behavior matches `entity-linker.ts` + Stage 1 trace-only routing, but `search-flags.ts` still describes this as “activating the graph channel,” which overstates actual behavior. The catalog is more accurate than some inline source comments. No `scripts` implementation found.`

`SUMMARY: total=11 | aligned=8 | partial=2 | misaligned=1 | P0=0 | P1=1 | P2=2`

`Severity notes: P1=02-relative-score-fusion-in-shadow-mode.md; P2=06-query-expansion.md, 11-graph-concept-routing.md.`


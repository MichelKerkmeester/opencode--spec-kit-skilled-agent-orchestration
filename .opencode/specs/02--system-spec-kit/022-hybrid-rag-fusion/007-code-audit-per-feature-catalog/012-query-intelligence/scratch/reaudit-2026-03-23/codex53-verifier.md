**Per-Feature Verification (Query Intelligence)**

1. **F01 – Query complexity router**  
File verification: all 7 catalog-listed `mcp_server` refs exist (catalog refs at [01-query-complexity-router.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/01-query-complexity-router.md:34), :35, :36, :42-:45).  
Function verification: `isComplexityRouterEnabled()` exists at [query-classifier.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:45), `determineConfidence()` at :99, `classifyQueryComplexity()` at :143, `routeQuery()` at [query-router.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:119).  
Flag defaults: `SPECKIT_COMPLEXITY_ROUTER` default ON (`raw !== 'false'`) at [query-classifier.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:46).  
Behavior: tiering uses trigger+term count at [query-classifier.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:175) and propagates to `traceMetadata.queryComplexity` at [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1121).  
Unreferenced files found: none.  
**Verdict: MATCH**

2. **F02 – Relative score fusion in shadow mode**  
File verification: all 5 catalog-listed `mcp_server` refs exist (catalog refs at [02-relative-score-fusion-in-shadow-mode.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md:32), :39-:42).  
Function verification: `fuseResultsRsf()` at [rsf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts:114), `fuseResultsRsfMulti()` at :221, `fuseResultsRsfCrossVariant()` at :322.  
Flag defaults: no runtime `isRsfEnabled()` path; RSF flag is inert in runtime code.  
Behavior: live path uses RRF (`fuseResultsMulti`) at [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:816); `rsfShadow` metadata type slot still present at :151.  
Unreferenced files found: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:150) (RSF compatibility slot is implemented there but not listed in catalog source table).  
**Verdict: MATCH**

3. **F03 – Channel min-representation**  
File verification: all 4 catalog-listed refs exist (catalog refs at [03-channel-min-representation.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representation.md:32), :33, :39, :40).  
Function verification: `analyzeChannelRepresentation()` at [channel-representation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:95), `enforceChannelRepresentation()` at [channel-enforcement.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:81).  
Flag defaults: `SPECKIT_CHANNEL_MIN_REP` default ON at [channel-representation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:70).  
Behavior: quality floor `0.005` at :15; core appends promotions (no resort) at :177; wrapper resorts globally by score at [channel-enforcement.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:111).  
Unreferenced files found: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:890) (pipeline integration callsite).  
**Verdict: MATCH**

4. **F04 – Confidence-based result truncation**  
File verification: all 2 catalog-listed refs exist (catalog refs at [04-confidence-based-result-truncation.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md:32), :38).  
Function verification: `truncateByConfidence()` at [confidence-truncation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:113).  
Flag defaults: `SPECKIT_CONFIDENCE_TRUNCATION` default ON at :47.  
Behavior: min 3 guarantee (`DEFAULT_MIN_RESULTS=3`) at :33; 2x-median rule at :37 and applied at :177-:179; NaN/Infinity filtering at :120; all-equal pass-through at :159.  
Unreferenced files found: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:913) (pipeline integration callsite).  
**Verdict: MATCH**

5. **F05 – Dynamic token budget allocation**  
File verification: all 6 catalog-listed refs exist (catalog refs at [05-dynamic-token-budget-allocation.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md:32), :33, :34, :40-:42).  
Function verification: `isDynamicTokenBudgetEnabled()` at [dynamic-token-budget.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:57), `getDynamicTokenBudget()` at :79.  
Flag defaults: dynamic flag default ON (`raw !== 'false'`) at :58-:59.  
Behavior: 1500/2500/4000 tiers match at :43-:47; computed early before channel execution in [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:640) before channel collection starts at :654.  
Mismatch detail: catalog says context-header overhead is ~12 tokens/result; code reserves ~26 (`(100+1)/4` rounded up) at [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:233), applied at :1068-:1071.  
Unreferenced files found: [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:211) (`isContextHeadersEnabled()` is part of this feature behavior but not listed).  
**Verdict: PARTIAL**

6. **F06 – Query expansion**  
File verification: all 54 catalog-listed `mcp_server` refs exist (implementation refs at [06-query-expansion.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md:30)-:54; test refs at :72-:100).  
Function verification: `expandQueryWithEmbeddings()` at [embedding-expansion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:181), `isExpansionActive()` at :300, `expandQuery()` at [query-expander.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:73).  
Flag defaults: `isEmbeddingExpansionEnabled()` at [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:112), default ON via [rollout-policy.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:59).  
Behavior: stop-words + min token length 3 enforced at [embedding-expansion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:72), :75, :135-:137; simple-query suppression at :196-:199; Stage1 baseline+expanded parallel run and baseline-first dedup at [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:552)-:577.  
Unreferenced files found: none material.  
**Verdict: MATCH**

7. **F07 – LLM query reformulation**  
File verification: all 7 catalog-listed refs exist (catalog refs at [07-llm-query-reformulation.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/07-llm-query-reformulation.md:32)-:36, :42, :50).  
Function verification: `cheapSeedRetrieve()` at [llm-reformulation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:102), `llm.rewrite()` at :340, `normalizeQuery()` at :421, `isLlmReformulationEnabled()` at [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:319).  
Flag defaults: runtime default ON (search-flags + rollout-policy), but stale module comment says default FALSE at [llm-reformulation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:17).  
Behavior: constants match catalog (`SEED_LIMIT=3`, `MAX_VARIANTS=2`, `MIN_OUTPUT_LENGTH=5`, timeout 8000ms) at :58, :67, :73, :61; deep-mode gate in caller at [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:797); fail-open seed retrieval at [llm-reformulation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:121)-:125; shared 1h cache at [llm-cache.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-cache.ts:40).  
Unreferenced files found: none material.  
**Verdict: PARTIAL**

8. **F08 – HyDE (Hypothetical Document Embeddings)**  
File verification: all 7 catalog-listed refs exist (catalog refs at [08-hyde-hypothetical-document-embeddings.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/08-hyde-hypothetical-document-embeddings.md:36)-:40, :46, :54).  
Function verification: `generateHyDE()` at [hyde.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:297), `runHyDE()` at :391, `lowConfidence()` at :133, `isHyDEActive()` at :111, `isHyDEEnabled()` at [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:328).  
Flag defaults: `SPECKIT_HYDE` default ON via `isFeatureEnabled`; `SPECKIT_HYDE_ACTIVE` default ON (`val !== 'false' && val !== '0'`) at [hyde.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:112)-:113.  
Behavior: low-confidence thresholds match (`0.45`, min results `1`) at :87 and :93; timeout 8000ms at :96; deep-mode caller gate at [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:867); shadow-vs-active merge behavior at [hyde.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:420)-:425.  
Unreferenced files found: none material.  
**Verdict: MATCH**

9. **F09 – Index-time query surrogates**  
File verification: all 4 catalog-listed refs exist (catalog refs at [09-index-time-query-surrogates.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/09-index-time-query-surrogates.md:36), :37, :43, :51).  
Function verification: `generateSurrogates()` at [query-surrogates.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:377), `matchSurrogates()` at :455, `isQuerySurrogatesEnabled()` at [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:272).  
Flag defaults: runtime default ON via search-flags/rollout-policy, but stale module header says default OFF at [query-surrogates.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:6), :17.  
Behavior: constants align (`MAX_SUMMARY_LENGTH=200`, min questions 2, max 5, `MIN_MATCH_THRESHOLD=0.15`) at :80, :77, :74, :83; query-time matching is wired in Stage1 at [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:983)-:1030 (contrary to older audit note).  
Unreferenced files found: [surrogate-storage.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/surrogate-storage.ts:182) and [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:991) implement core storage/query-time behavior but are not listed in the feature entry source table.  
**Verdict: PARTIAL**

10. **F10 – Query decomposition**  
File verification: all 6 catalog-listed refs exist (catalog refs at [10-query-decomposition.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/10-query-decomposition.md:36)-:38, :44, :45, :53).  
Function verification: `isMultiFacet()` at [query-decomposer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:97), `decompose()` at :168, `mergeByFacetCoverage()` at :212, `isQueryDecompositionEnabled()` at [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:252).  
Flag defaults: default ON via search-flags/rollout-policy.  
Behavior: conjunction and wh-word heuristic detection matches at [query-decomposer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:30), :47, :106-:116; cap `MAX_FACETS=3` at :22; deep-mode gating in caller at [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:396), :407.  
Mismatch detail: catalog says “any error returns only the original query”; Stage1 catch path falls through to standard expansion flow, not strictly “original-only” ([stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:448)-:460).  
Unreferenced files found: none material.  
**Verdict: PARTIAL**

11. **F11 – Graph concept routing**  
File verification: all 6 catalog-listed refs exist (catalog refs at [11-graph-concept-routing.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/11-graph-concept-routing.md:30)-:32, :38, :39, :47).  
Function verification: `nounPhrases()` at [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:150), `matchAliases()` at :201, `routeQueryConcepts()` at :311, `isGraphConceptRoutingEnabled()` at [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:262).  
Flag defaults: default ON via search-flags/rollout-policy.  
Behavior: noun phrase extraction + alias-table matching exists ([entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:150)-:220, :232-:276).  
Mismatch detail: catalog says matched concepts “activate the graph retrieval channel”; current Stage1 only records trace metadata (`matchedConcepts`, `graphActivated`) at [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:331)-:337, with no downstream consumer found in pipeline code.  
Unreferenced files found: none material.  
**Verdict: PARTIAL**

**Summary Table**

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 1 | Query complexity router | Yes (7/7) | Yes | Yes | None | MATCH |
| 2 | Relative score fusion in shadow mode | Yes (5/5) | Yes | N/A (runtime inert) | Yes (`hybrid-search.ts`) | MATCH |
| 3 | Channel min-representation | Yes (4/4) | Yes | Yes | Yes (`hybrid-search.ts`) | MATCH |
| 4 | Confidence-based result truncation | Yes (2/2) | Yes | Yes | Yes (`hybrid-search.ts`) | MATCH |
| 5 | Dynamic token budget allocation | Yes (6/6) | Yes | Yes | Yes (`search-flags.ts`) | PARTIAL |
| 6 | Query expansion | Yes (54/54) | Yes | Yes | None material | MATCH |
| 7 | LLM query reformulation | Yes (7/7) | Yes | Runtime yes, comment drift | None material | PARTIAL |
| 8 | HyDE | Yes (7/7) | Yes | Yes | None material | MATCH |
| 9 | Index-time query surrogates | Yes (4/4) | Yes | Runtime yes, comment drift | Yes (`surrogate-storage.ts`, `stage1-candidate-gen.ts`) | PARTIAL |
| 10 | Query decomposition | Yes (6/6) | Yes | Yes | None material | PARTIAL |
| 11 | Graph concept routing | Yes (6/6) | Yes | Yes | None material | PARTIAL |

Prior-audit cross-check: [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/012-query-intelligence/implementation-summary.md:43) findings about default-comment contradictions still apply for reformulation/surrogates; prior “surrogates not wired” note is now outdated given current Stage1 integration at [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:983).  

I did not execute test runs in this pass; this was static code-level verification.
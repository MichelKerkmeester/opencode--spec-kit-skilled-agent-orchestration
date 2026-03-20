● Explore Audit search modules
  └ Agent started in background with agent_id: search-audit-scout. You can use re...

● Search (grep)
  │ "causal-boost|session-boost|session-transition|folder-relevance|folder-discovery|spec-folder-hie
  │ rarchy|confidence-truncation|context-budget|dynamic-token-budget|auto-promotion|channel-enforcem
  │ ent|channel-representation|feedback-denylist|learned-feedback|search-flags|retrieval-directives"
  │ in **/*.{ts,tsx,js} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 40 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/*.ts"
  └ 48 files found

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/6cb4af92-5176-4015-b78d-1a9e927d573c/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read the specified search modules and map how boosting, filtering, and budget logic …
  └ 6 lines...

I’ve mapped the target files and related tests. Next I’m reading the modules plus their call sites so I can check the actual interaction points, not just each file in isolation.

● Search (grep)
  │ "causal-boost|session-boost|session-transition|folder-relevance|folder-discovery|spec-folder-hie
  │ rarchy|confidence-truncation|context-budget|dynamic-token-budget|auto-promotion|channel-enforcem
  │ ent|channel-representation|feedback-denylist|learned-feedback|search-flags|retrieval-directives"
  │ in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 58 lines found

● Search (grep)
  │ "applyCausalBoost|applySessionBoost|truncateByConfidence|calculateContextBudget|computeDynamicTo
  │ kenBudget|enforceChannelRepresentation|enforceChannelCoverage|applyFeedbackDenylist|applyLearned
  │ Feedback|resolveSearchFlags|compileRetrievalDirectives|discoverRelevantFolders|scoreFolderReleva
  │ nce|buildSpecFolderHierarchy|inferSessionTransition|runAutoPromotion|budget" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

● Count target file lines (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search' && wc -l causal-boost.ts
  │ session-boost.ts session-transition.ts folder-relevance.ts folder-discovery.ts
  │ spec-folder-hierarchy.ts confidence-truncation.ts context-budget.ts dynamic-token-budget.ts
  │ auto-promotion.ts channel-enforcement.ts channel-representation.ts feedback-denylist.ts …
  └ 19 lines...

● Read causal-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
  └ 326 lines read

● Read session-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts
  └ 212 lines read

● Read confidence-truncation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts
  └ 231 lines read

● Read context-budget.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts
  └ 178 lines read

● Read channel-representation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts
  └ 203 lines read

● Read session-transition.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts
  └ 190 lines read

● Read channel-enforcement.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts
  └ 139 lines read

● Read folder-relevance.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts
  └ 238 lines read

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ 251 lines read

● Read dynamic-token-budget.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts
  └ 116 lines read

● Read spec-folder-hierarchy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts
  └ 299 lines read

● Read auto-promotion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts
  └ 338 lines read

● Read feedback-denylist.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts
  └ 105 lines read

● Read learned-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts
  └ L261:520 (260 lines read)

● Read learned-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts
  └ L1:260 (260 lines read)

● Read learned-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts
  └ L521:667 (147 lines read)

● Read retrieval-directives.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts
  └ 351 lines read

● Search (grep)
  │ "^export function|^export \{|^function |^const [A-Z_]+"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts)
  └ 27 lines found

I’ve got the individual modules. Now I’m reading the pipeline wiring and the specific `folder-discovery` slices that determine how these features compose at runtime.

● Read folder-discovery.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts
  └ L251:520 (270 lines read)

● Read folder-discovery.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts
  └ L521:980 (460 lines read)

● Read folder-discovery.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts
  └ L1:250 (250 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:260 (259 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ 853 lines read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L261:620 (360 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ 365 lines read

● Search (grep)
  │ "recordSelection|executeAutoPromotion|checkAutoPromotion|scanForPromotions|learned_feedback|SPEC
  │ KIT_LEARN_FROM_SELECTION|SPECKIT_PIPELINE_V2|SPECKIT_CHANNEL_MIN_REP|SPECKIT_CONFIDENCE_TRUNCATI
  │ ON|SPECKIT_DYNAMIC_TOKEN_BUDGET" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 42 lines found

● Search (grep)
  │ "enforceChannelRepresentation|truncateByConfidence|isFolderScoringEnabled|computeFolderRelevance
  │ Scores|twoPhaseRetrieval|ensureDescriptionCache|getSpecsBasePaths|isDynamicTokenBudgetEnabled|ge
  │ tDynamicTokenBudget|budgetResult|folderScores|discoverSpecFolder|specFolder"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 53 lines found

● Search (grep)
  │ "budget|tokenBudget|optimizeContextBudget|context-budget|dynamic-token-budget|truncateByConfiden
  │ ce|enforceChannelRepresentation|folderScore|twoPhaseRetrieval" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "from '../lib/search/session-boost'|from
  │ "../lib/search/session-boost"|applySessionBoost|getAttentionBoost|calculateSessionBoost" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "from '../lib/search/causal-boost'|from
  │ "../lib/search/causal-boost"|applyCausalBoost|getNeighborBoosts" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 12 lines found

● Search (grep)
  │ "from '../lib/search/folder-relevance'|from "../lib/search/folder-relevance"|computeFolderReleva
  │ nceScores|twoPhaseRetrieval|lookupFolders|enrichResultsWithFolderScores" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 29 lines found

● Search (grep)
  │ "from '../lib/search/context-budget'|from
  │ "../lib/search/context-budget"|optimizeContextBudget|estimateTokens" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 10 lines found

● Search (grep)
  │ "from '../lib/search/auto-promotion'|from
  │ "../lib/search/auto-promotion"|checkAutoPromotion|executeAutoPromotion|scanForPromotions" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 32 lines found

● Search (grep)
  │ "from '../lib/search/spec-folder-hierarchy'|from "../lib/search/spec-folder-hierarchy"|buildHier
  │ archyTree|getRelatedFolders|queryHierarchyMemories" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 53 lines found

● Search (grep)
  │ "from '../lib/search/session-transition'|from "../lib/search/session-transition"|buildSessionTra
  │ nsitionTrace|readSessionTransitionTrace|attachSessionTransitionTrace" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 8 lines found

● Search (grep)
  │ "from '../lib/search/folder-discovery'|from "../lib/search/folder-discovery"|extractDescription|
  │ findRelevantFolders|ensureDescriptionCache|discoverSpecFolder|getSpecsBasePaths" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 75 lines found

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L780:1025 (246 lines read)

● Read causal-boost.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts
  └ 178 lines read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1240:1295 (56 lines read)

● Read session-boost.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts
  └ 95 lines read

● Read channel-enforcement.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts
  └ 525 lines read

● Read confidence-truncation.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts
  └ 464 lines read

● Read dynamic-token-budget.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/dynamic-token-budget.vitest.ts
  └ 215 lines read

● Read channel-representation.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/channel-representation.vitest.ts
  └ 407 lines read

● Read search-flags.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts
  └ 196 lines read

● Read retrieval-directives.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts
  └ 563 lines read

● Read learned-feedback.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts
  └ L260:560 (301 lines read)

● Read feedback-denylist.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/feedback-denylist.vitest.ts
  └ 89 lines read

● Read memory-context.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts
  └ L260:380 (120 lines read)

● Read learned-feedback.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts
  └ L560:910 (351 lines read)

● Read learned-feedback.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts
  └ L1:260 (260 lines read)

● Read promotion-positive-validation-semantics.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.
  │ ts
  └ 127 lines read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1026:1085 (60 lines read)

● Read context-budget.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts
  └ 178 lines read

● Search (grep)
  │ "truncateToBudget\(|function truncateToBudget|calculateTokenMetrics|budgetLimit|context
  │ header|CONTEXT_HEADER_TOKEN_OVERHEAD"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 8 lines found

● Search (grep)
  │ "isPipelineV2Enabled|isReconsolidationEnabled|isFileWatcherEnabled|isQualityLoopEnabled|isFolder
  │ DiscoveryEnabled|isSearchFallbackEnabled|isDocscoreAggregationEnabled|isSaveQualityGateEnabled"
  │ in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 17 lines found

● Search (grep)
  │ "optimizeContextBudget|estimateTokens" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 11 lines found

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1540:1695 (155 lines read)

● Read folder-relevance.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts
  └ L300:520 (200 lines read)

● Read folder-discovery-integration.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts
  └ L430:620 (191 lines read)

● Read query-router-channel-interaction.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/query-router-channel-interaction.vitest.ts
  └ 433 lines read

● Read spec-folder-hierarchy.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts
  └ L389:620 (205 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "function resolveEffectiveScore|export function resolveEffectiveScore|resolveEffectiveScore" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 7 lines found

● Search (grep)
  │ "SPECKIT_FOLDER_SCORING|SPECKIT_FOLDER_TOP_K|SPECKIT_DYNAMIC_TOKEN_BUDGET|SPECKIT_CONFIDENCE_TRU
  │ NCATION|SPECKIT_CHANNEL_MIN_REP|SPECKIT_FOLDER_DISCOVERY|SPECKIT_LEARN_FROM_SELECTION|SPECKIT_CA
  │ USAL_BOOST|SPECKIT_SESSION_BOOST" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 10 files found

● Search (grep)
  │ "isFolderDiscoveryEnabled\(|isPipelineV2Enabled\(|isDynamicTokenBudgetEnabled\(|isFolderScoringE
  │ nabled\(|optimizeContextBudget\(" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 7 lines found

● Search (grep)
  │ "SPECKIT_FOLDER_DISCOVERY|SPECKIT_PIPELINE_V2|SPECKIT_QUALITY_LOOP|SPECKIT_SAVE_QUALITY_GATE|SPE
  │ CKIT_FILE_WATCHER" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_FOLDER_DISCOVERY|SPECKIT_PIPELINE_V2|SPECKIT_QUALITY_LOOP|SPECKIT_SAVE_QUALITY_GATE|SPE
  │ CKIT_FILE_WATCHER" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 16 lines found

● Search (grep)
  │ "enrichWithRetrievalDirectives|extractRetrievalDirective|formatDirectiveMetadata" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 8 lines found

I’ve now got enough of the wiring to look for systemic issues rather than isolated module bugs. I’m checking the exact score flow around fusion and token truncation, because that’s where most cross-feature surprises tend to hide.

● Read (Explore agent — Audit search modules)
  └ idle

● Read stage2-fusion.vitest.ts
  └ .opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L620:780 (161 lines read)

● Search (grep)
  │ "rrfScore|score: result.rrfScore|hybridAdaptiveFuse|fuseResultsMulti|sources:"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 6 lines found

I’ve confirmed most module-level tests exist, but the integration seams are the real weak spot. I’m doing one last pass on unused flags and then I’ll consolidate the audit into a findings-first report.

● Search (grep)
  │ "SPECKIT_FOLDER_DISCOVERY|SPECKIT_PIPELINE_V2|SPECKIT_QUALITY_LOOP|SPECKIT_SAVE_QUALITY_GATE|SPE
  │ CKIT_FILE_WATCHER" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "isPipelineV2Enabled\(|isFolderDiscoveryEnabled\(|isQualityLoopEnabled\(|isSaveQualityGateEnable
  │ d\(|isFileWatcherEnabled\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 5 lines found

● Run targeted search tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/causal-boost.vitest.ts tests/session-boost.vitest.ts tests/folder-relevance.vitest.ts
  │ tests/folder-discovery.vitest.ts tests/folder-discovery-integration.vitest.ts
  │ tests/spec-folder-hierarchy.vitest.ts tests/confidence-truncation.vitest.ts …
  └ 150 lines...

● Search (grep)
  │ "isQualityLoopEnabled\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 3 files found

● Search (grep)
  │ "isPipelineV2Enabled\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 2 files found

● Search (grep)
  │ "optimizeContextBudget\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 1 file found

● Search (grep)
  │ "isFolderDiscoveryEnabled\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 3 files found

● Search (grep)
  │ "isPipelineV2Enabled\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 4 lines found

● Search (grep)
  │ "isFolderDiscoveryEnabled\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 4 lines found

● Search (grep)
  │ "isQualityLoopEnabled\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 6 lines found

● Read stage2-fusion.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts
  └ L1:120 (120 lines read)

● Read pipeline-integration.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts
  └ L136:152 (17 lines read)

● Search (grep)
  │ "sessionBoost|causalBoost|applySessionBoost|applyCausalBoost"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts)
  └ 2 lines found

● Search (grep)
  │ "context-budget|optimizeContextBudget|estimateTokens"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts)
  └ 4 lines found

● Search (grep)
  │ "budgetLimit|budgetTruncated|queryComplexity" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 15 lines found

● Search (grep)
  │ "truncateToBudget\(|estimateResultTokens\(|createSummaryFallback\(" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 20 lines found

● Search (grep)
  │ "readSessionTransitionTrace\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 2 lines found

● Read hybrid-search-context-headers.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts
  └ L1:190 (190 lines read)

● Read search-results.ts
  │ .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
  └ L320:350 (30 lines read)

● Read token-budget.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/token-budget.vitest.ts
  └ L1:380 (338 lines read)

I’ve got the core issues nailed down now: the main gaps aren’t missing unit tests so much as missing “features-in-combination” tests. I’m checking a couple of uncovered helpers to make sure I only call something dead when it really is dead.

● Search (grep)
  │ "applySessionBoost\(|applyCausalBoost\(" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 4 lines found

● Search (grep)
  │ "buildSessionTransitionTrace\(|attachSessionTransitionTrace\(|readSessionTransitionTrace\(" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "isSearchFallbackEnabled\(|isDocscoreAggregationEnabled\(|isSaveQualityGateEnabled\(" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 28 lines found

● Read session-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts
  └ L1:220 (212 lines read)

● Read causal-boost.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
  └ L1:340 (326 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L780:1065 (286 lines read)

● Read folder-relevance.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts
  └ L1:255 (238 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1530:1695 (165 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:260 (251 lines read)

● Read dynamic-token-budget.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts
  └ L1:120 (116 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:90 (90 lines read)

● Read session-transition.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts
  └ L1:180 (179 lines read)

● Read context-budget.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/context-budget.ts
  └ L1:220 (178 lines read)

I audited the listed search modules plus their runtime wiring in `hybrid-search.ts` / pipeline code. Main takeaway: the individual features are mostly reasonable; the biggest risks are where they compose.

## Findings

### 1) Score boosting respects the shared ceiling, but not the normalized score range
`session-boost.ts:57-71` and `causal-boost.ts:267-275` coordinate on `MAX_COMBINED_BOOST = 0.20`, so boost stacking is bounded. But both modules write `score = baseScore * (1 + boost)` without clamping (`session-boost.ts:155-163`, `causal-boost.ts:273-282`). That means a `1.0` base score can become `> 1.0`. The pipeline later clamps when callers use `resolveEffectiveScore()` (`pipeline/types.ts:58-67`), so this is a range-consistency bug, not a runaway-boost bug.

`stage2-fusion.vitest.ts:31-37` mocks both boost modules, so I did not find a test that exercises session + causal boosting together and asserts post-boost score bounds.

### 2) Token budgeting is enforced, but not strictly correct
`dynamic-token-budget.ts:5-9` says the budget is “advisory-only”, but `hybrid-search.ts:994-999` actually enforces it with `truncateToBudget(...)`. So the docs and runtime behavior have drifted.

The budget math also has three issues:
`hybrid-search.ts:991-995` subtracts header overhead using `reranked.length` before truncation, so it can reserve tokens for results that never survive.
`hybrid-search.ts:1034-1037` records `budgetResult.budget` in trace metadata, not the smaller `adjustedBudget` actually used.
`truncateToBudget()` is not a strict cap: it will keep the first oversized result if nothing has been accepted yet (`hybrid-search.ts:1672-1679`).

There is also stale duplication here: `context-budget.ts` implements a separate budgeting strategy, but repo-wide usage only found the module itself; `pipeline-integration.vitest.ts:143-146` only smoke-tests exports. Current live budgeting is in `hybrid-search.ts`.

### 3) Channel enforcement can be undone later
Channel enforcement runs first (`hybrid-search.ts:801-832`), but confidence truncation and folder scoring run afterward (`hybrid-search.ts:842-848`, `957-975`). `twoPhaseRetrieval()` filters purely by top folders (`folder-relevance.ts:205-238`), so a promoted result from an underrepresented channel can still be removed if its folder loses.

I did not find an integration test covering “channel enforcement survives folder scoring”.

### 4) One feature flag surface is effectively dead
`isPipelineV2Enabled()` always returns `true` and is explicitly documented as deprecated (`search-flags.ts:107-115`). Repo search only found the definition plus its own tests, so this looks removable rather than configurable.

### 5) The biggest simplification opportunity is the late-stage ranking block
`hybrid-search.ts:801-1047` chains channel enforcement, confidence truncation, reranking, co-activation, folder filtering, budget truncation, and header injection in one linear block, but there is no final invariant pass. That makes it easy for one stage to silently invalidate guarantees from an earlier stage.

### 6) Missing coverage is mostly at the seams
Direct tests exist for most individual modules, and I ran the relevant suite: `17` files, `624` tests, all passing.

The gaps are cross-feature:
No combined session+causal boost bounds test.
No channel-enforcement + folder-scoring integration test.
No test for pre-truncation header over-reservation or trace `budgetLimit` mismatch.
No test for `readSessionTransitionTrace()` even though it is consumed by `formatters/search-results.ts:335`; current tests only cover build/attach paths in `memory-context.vitest.ts:276-357`.

Overall, I’d prioritize fixing the budget path first, then either re-running channel enforcement after folder filtering or making folder scoring advisory instead of filtering.


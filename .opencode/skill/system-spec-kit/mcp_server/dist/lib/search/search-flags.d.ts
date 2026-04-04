/**
 * Session attention boost for search result re-ranking.
 * Default: TRUE (graduated). Set SPECKIT_SESSION_BOOST=false to disable.
 */
export declare function isSessionBoostEnabled(): boolean;
/**
 * Causal graph traversal boost for search result amplification.
 * Default: TRUE (graduated). Set SPECKIT_CAUSAL_BOOST=false to disable.
 */
export declare function isCausalBoostEnabled(): boolean;
/**
 * Dynamic startup instruction injection for the MCP server.
 * Default: TRUE (graduated). Set SPECKIT_DYNAMIC_INIT=false to disable.
 */
export declare function isDynamicInitEnabled(): boolean;
/**
 * Token-pressure policy for memory_context.
 * Default: TRUE (graduated). Set SPECKIT_PRESSURE_POLICY=false to disable.
 */
export declare function isPressurePolicyEnabled(identity?: string): boolean;
/**
 * Automatic session resume context injection for memory_context.
 * Default: TRUE (graduated). Set SPECKIT_AUTO_RESUME=false to disable.
 */
export declare function isAutoResumeEnabled(identity?: string): boolean;
/**
 * Graph-guided MMR diversity reranking.
 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
 */
export declare function isMMREnabled(): boolean;
/**
 * Transparent Reasoning Module (evidence-gap detection).
 * Default: TRUE (enabled). Set SPECKIT_TRM=false to disable.
 */
export declare function isTRMEnabled(): boolean;
/**
 * Multi-query expansion for deep-mode retrieval.
 * Default: TRUE (enabled). Set SPECKIT_MULTI_QUERY=false to disable.
 */
export declare function isMultiQueryEnabled(): boolean;
/**
 * Cross-encoder reranking gate.
 * Default: TRUE (enabled). Set SPECKIT_CROSS_ENCODER=false to disable.
 */
export declare function isCrossEncoderEnabled(): boolean;
/**
 * PI-A2: Quality-aware 3-tier search fallback chain.
 * Default: TRUE (graduated). Set SPECKIT_SEARCH_FALLBACK=false to disable.
 */
export declare function isSearchFallbackEnabled(): boolean;
/**
 * PI-B3: Automatic spec folder discovery via description cache.
 * Default: TRUE (graduated). Set SPECKIT_FOLDER_DISCOVERY=false to disable.
 */
export declare function isFolderDiscoveryEnabled(): boolean;
/**
 * R1 MPAB: Document-level chunk-to-memory score aggregation.
 * Default: TRUE (graduated). Set SPECKIT_DOCSCORE_AGGREGATION=false to disable.
 */
export declare function isDocscoreAggregationEnabled(): boolean;
/**
 * Pre-storage quality gate for memory saves.
 * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
 */
export declare function isSaveQualityGateEnabled(): boolean;
/**
 * Dynamic token budget allocation by query complexity.
 * Default: TRUE (graduated). Set SPECKIT_DYNAMIC_TOKEN_BUDGET=false to disable.
 */
export declare function isDynamicTokenBudgetEnabled(): boolean;
/**
 * Confidence-gap truncation for low-confidence tails.
 * Default: TRUE (graduated). Set SPECKIT_CONFIDENCE_TRUNCATION=false to disable.
 */
export declare function isConfidenceTruncationEnabled(): boolean;
/**
 * Channel minimum-representation promotion after fusion.
 * Default: TRUE (graduated). Set SPECKIT_CHANNEL_MIN_REP=false to disable.
 */
export declare function isChannelMinRepEnabled(): boolean;
/**
 * TM-06: Reconsolidation-on-save for memory deduplication.
 * Default: TRUE (graduated). Set SPECKIT_RECONSOLIDATION=false to disable.
 */
export declare function isReconsolidationEnabled(): boolean;
/**
 * T002b/A4: Negative-feedback confidence demotion in ranking.
 * Default: TRUE (graduated). Set SPECKIT_NEGATIVE_FEEDBACK=false to disable.
 */
export declare function isNegativeFeedbackEnabled(): boolean;
/**
 * R12: Query expansion for embedding-based retrieval.
 * Suppressed when R15 classification = "simple" (mutual exclusion).
 * Default: TRUE (graduated). Set SPECKIT_EMBEDDING_EXPANSION=false to disable.
 */
export declare function isEmbeddingExpansionEnabled(): boolean;
/**
 * N3-lite: Consolidation engine — contradiction scan, Hebbian strengthening,
 * staleness detection, edge bounds enforcement.
 * Default: TRUE (graduated). Set SPECKIT_CONSOLIDATION=false to disable.
 */
export declare function isConsolidationEnabled(): boolean;
/**
 * R16: Encoding-intent capture at index time.
 * Records intent metadata (document, code, structured_data) alongside embeddings.
 * Default: TRUE (graduated). Set SPECKIT_ENCODING_INTENT=false to disable.
 */
export declare function isEncodingIntentEnabled(): boolean;
/**
 * N2a+N2b: Graph momentum scoring and causal depth signals.
 * Default: TRUE (enabled). Set SPECKIT_GRAPH_SIGNALS=false to disable.
 */
export type GraphWalkRolloutState = 'off' | 'trace_only' | 'bounded_runtime';
export declare function resolveGraphWalkRolloutState(): GraphWalkRolloutState;
export declare function isGraphSignalsEnabled(): boolean;
/**
 * N2c: Community detection (BFS connected components + Louvain escalation).
 * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_DETECTION=false to disable.
 */
export declare function isCommunityDetectionEnabled(): boolean;
/**
 * Community summary generation and search channel.
 * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_SUMMARIES=false to disable.
 */
export declare function isCommunitySummariesEnabled(): boolean;
/**
 * R8: Memory summary generation (TF-IDF extractive summaries as search channel).
 * Default: TRUE (enabled). Set SPECKIT_MEMORY_SUMMARIES=false to disable.
 */
export declare function isMemorySummariesEnabled(): boolean;
/**
 * Temporal contiguity boost on raw Stage 1 vector results.
 * Default: TRUE (graduated). Set SPECKIT_TEMPORAL_CONTIGUITY=false to disable.
 */
export declare function isTemporalContiguityEnabled(): boolean;
/**
 * R10: Auto entity extraction (rule-based noun-phrase extraction at save time).
 * Default: TRUE (enabled). Set SPECKIT_AUTO_ENTITIES=false to disable.
 */
export declare function isAutoEntitiesEnabled(): boolean;
/**
 * S5: Cross-document entity linking (entity-based cross-doc edges).
 * Requires R10 (auto entities) to also be enabled.
 * Default: TRUE (enabled). Set SPECKIT_ENTITY_LINKING=false to disable.
 */
export declare function isEntityLinkingEnabled(): boolean;
/** Whether causal-edge degree-based re-ranking is enabled (SPECKIT_DEGREE_BOOST). */
export declare function isDegreeBoostEnabled(): boolean;
/**
 * P1-4: Contextual tree headers for Stage 4 result enrichment.
 * Default: TRUE. Set SPECKIT_CONTEXT_HEADERS=false to disable.
 */
export declare function isContextHeadersEnabled(): boolean;
/**
 * P1-7: Real-time file watcher for markdown reindexing.
 * Default: FALSE. Set SPECKIT_FILE_WATCHER=true to enable.
 * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
 */
export declare function isFileWatcherEnabled(): boolean;
/**
 * P1-5: Local GGUF reranker gate.
 * Default: FALSE. Set RERANKER_LOCAL=true to enable.
 * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
 */
export declare function isLocalRerankerEnabled(): boolean;
/**
 * T008: Verify-fix-verify memory quality loop.
 * Default: TRUE (graduated). Set SPECKIT_QUALITY_LOOP=false to disable.
 */
export declare function isQualityLoopEnabled(): boolean;
/**
 * D2 REQ-D2-001: Query decomposition — bounded facet detection.
 * Deep-mode only: multi-faceted queries split into up to 3 sub-queries.
 * Default: TRUE (graduated). Set SPECKIT_QUERY_DECOMPOSITION=false to disable.
 */
export declare function isQueryDecompositionEnabled(): boolean;
/**
 * D2 REQ-D2-002: Graph concept routing — query-time alias matching.
 * Extracts noun phrases from the query and matches against concept alias table,
 * activating the graph channel for matched concepts.
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_CONCEPT_ROUTING=false to disable.
 */
export declare function isGraphConceptRoutingEnabled(): boolean;
/**
 * D2 REQ-D2-005: Index-time surrogates for recall improvement.
 * Generates surrogate metadata (aliases, headings, summary, questions)
 * at index time; matched at query time with no LLM calls.
 * Default: TRUE (graduated). Set SPECKIT_QUERY_SURROGATES=false to disable.
 */
export declare function isQuerySurrogatesEnabled(): boolean;
/**
 * REQ-D4-001: Implicit feedback event ledger.
 * Shadow-only — no ranking side effects.
 * Default: TRUE (graduated). Set SPECKIT_IMPLICIT_FEEDBACK_LOG=false to disable.
 */
export declare function isImplicitFeedbackLogEnabled(): boolean;
/**
 * REQ-D4-002: Hybrid decay policy — type-aware no-decay for permanent artifacts.
 * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
 * When enabled: decision/constitutional/critical context types receive Infinity
 * stability (no decay). All other types follow the standard FSRS schedule.
 */
export declare function isHybridDecayPolicyEnabled(): boolean;
/**
 * REQ-D4-003: Short-critical quality gate exception.
 * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=false to disable.
 * When enabled: decision context_type documents with >= 2 structural signals
 * bypass the 50-character minimum content length check.
 */
export declare function isSaveQualityGateExceptionsEnabled(): boolean;
/**
 * D2 REQ-D2-003: Corpus-grounded LLM query reformulation.
 * Step-back abstraction + corpus seed grounding. Deep-mode only.
 * Default: TRUE (graduated). Set SPECKIT_LLM_REFORMULATION=false to disable.
 * Requires an OpenAI-compatible LLM endpoint (LLM_REFORMULATION_ENDPOINT).
 */
export declare function isLlmReformulationEnabled(): boolean;
/**
 * D2 REQ-D2-004: HyDE (Hypothetical Document Embeddings).
 * Generates a pseudo-document for low-confidence deep queries.
 * Default: TRUE (graduated). Set SPECKIT_HYDE=false to disable.
 */
export declare function isHyDEEnabled(): boolean;
/**
 * REQ-D3-003: Graph refresh mode.
 * Controls when dirty-node recomputation runs after write operations.
 * Default: 'write_local' (graduated). Set SPECKIT_GRAPH_REFRESH_MODE=off to disable.
 * Values: off | write_local | scheduled.
 */
export declare function getGraphRefreshMode(): string;
export declare function isGraphRefreshDisabled(): boolean;
/**
 * REQ-D3-004: Async LLM graph backfill for high-value documents.
 * Runs after deterministic extraction; adds probabilistic edges via LLM.
 * Default: TRUE (graduated). Set SPECKIT_LLM_GRAPH_BACKFILL=false to disable.
 */
export declare function isLlmGraphBackfillEnabled(): boolean;
/**
 * REQ-D3-005 / REQ-D3-006: Graph calibration profiles and community thresholds.
 * Enables calibration profile enforcement, Louvain activation gates, and
 * community score capping (secondary-only).
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_CALIBRATION_PROFILE=false to disable.
 */
export declare function isGraphCalibrationProfileEnabled(): boolean;
/**
 * REQ-D1-006: Learned Stage 2 weight combiner (shadow mode).
 * Runs the learned linear ranker in parallel with manual weights.
 * Scores are computed but NOT used for ranking (shadow-only).
 * Default: TRUE (graduated). Set SPECKIT_LEARNED_STAGE2_COMBINER=false to disable.
 */
export declare function isLearnedStage2CombinerEnabled(): boolean;
/**
 * REQ-D4-006: Shadow scoring with holdout evaluation.
 * Compares would-have-changed rankings vs live rankings on a holdout
 * slice of queries. Shadow-only — no ranking side effects.
 * Default: TRUE (graduated). Set SPECKIT_SHADOW_FEEDBACK=false to disable.
 */
export declare function isShadowFeedbackEnabled(): boolean;
/**
 * REQ-D5-005: Progressive disclosure for search results.
 * Replaces hard tail-truncation with summary layer + snippet + cursor pagination.
 * Default: TRUE (graduated). Set SPECKIT_PROGRESSIVE_DISCLOSURE_V1=false to disable.
 */
export declare function isProgressiveDisclosureEnabled(): boolean;
/**
 * REQ-D5-006: Retrieval session state for cross-turn context.
 * Enables cross-turn dedup and goal-aware refinement of search results.
 * Default: TRUE (graduated). Set SPECKIT_SESSION_RETRIEVAL_STATE_V1=false to disable.
 */
export declare function isSessionRetrievalStateEnabled(): boolean;
/**
 * REQ-D1-001: Calibrated overlap bonus for multi-channel convergence.
 * Default: TRUE (graduated). Set SPECKIT_CALIBRATED_OVERLAP_BONUS=false to disable.
 */
export declare function isCalibratedOverlapBonusEnabled(): boolean;
/**
 * REQ-D1-003: Experimental per-intent RRF K selection.
 * Default: TRUE (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
 */
export declare function isRrfKExperimentalEnabled(): boolean;
/**
 * D3 Phase A: Sparse-first + intent-aware typed traversal.
 * Default: TRUE (graduated). Set SPECKIT_TYPED_TRAVERSAL=false to disable.
 */
export declare function isTypedTraversalEnabled(): boolean;
/**
 * REQ-D5-001: Empty/weak result recovery UX.
 * Default: TRUE (graduated). Set SPECKIT_EMPTY_RESULT_RECOVERY_V1=false to disable.
 */
export declare function isEmptyResultRecoveryEnabled(): boolean;
/**
 * REQ-D5-004: Per-result calibrated confidence scoring.
 * Default: TRUE (graduated). Set SPECKIT_RESULT_CONFIDENCE_V1=false to disable.
 */
export declare function isResultConfidenceEnabled(): boolean;
/**
 * REQ-D4-004: Weekly batch feedback learning pipeline.
 * Default: TRUE (graduated). Set SPECKIT_BATCH_LEARNED_FEEDBACK=false to disable.
 */
export declare function isBatchLearnedFeedbackEnabled(): boolean;
/**
 * REQ-D4-005: Assistive reconsolidation for near-duplicate detection.
 * Default: TRUE (graduated). Set SPECKIT_ASSISTIVE_RECONSOLIDATION=false to disable.
 */
export declare function isAssistiveReconsolidationEnabled(): boolean;
/**
 * REQ-D5-002: Two-tier result explainability.
 * Default: TRUE (graduated). Set SPECKIT_RESULT_EXPLAIN_V1=false to disable.
 */
export declare function isResultExplainEnabled(): boolean;
/**
 * REQ-D5-003: Mode-aware response profile formatting.
 * Default: TRUE (graduated). Set SPECKIT_RESPONSE_PROFILE_V1=false to disable.
 */
export declare function isResponseProfileEnabled(): boolean;
/**
 * Phase B T016: Query concept expansion for hybrid search.
 * When concept routing matches aliases, expands query with related terms.
 * Default: TRUE (graduated). Set SPECKIT_QUERY_CONCEPT_EXPANSION=false to disable.
 */
export declare function isQueryConceptExpansionEnabled(): boolean;
/**
 * Phase B T017: Graph-expanded fallback on zero/weak results.
 * Queries causal_edges for neighbor titles when recovery triggers.
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_FALLBACK=false to disable.
 */
export declare function isGraphFallbackEnabled(): boolean;
/**
 * Phase B T020: Always-on graph context injection.
 * Runs concept routing + graph neighbor lookup even without seed results.
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_CONTEXT_INJECTION=false to disable.
 */
export declare function isGraphContextInjectionEnabled(): boolean;
/**
 * Phase C T027: Result provenance — include graph evidence metadata in search results.
 * When enabled, search results include graphEvidence with contributing edges,
 * communities, and boost factors for transparency and debuggability.
 * Default: TRUE (enabled). Set SPECKIT_RESULT_PROVENANCE=false to disable.
 */
export declare function isResultProvenanceEnabled(): boolean;
/**
 * Phase D T036: Temporal validity tracking for causal edges.
 * Default: TRUE (graduated). Set SPECKIT_TEMPORAL_EDGES=false to disable.
 */
export declare function isTemporalEdgesEnabled(): boolean;
/**
 * Phase D T036: Usage-weighted ranking signal.
 * Default: TRUE (graduated). Set SPECKIT_USAGE_RANKING=false to disable.
 */
export declare function isUsageRankingEnabled(): boolean;
/**
 * Phase D T036: Ontology-guided extraction validation hooks.
 * Default: TRUE (graduated). Set SPECKIT_ONTOLOGY_HOOKS=false to disable.
 */
export declare function isOntologyHooksEnabled(): boolean;
/**
 * Phase B T018: Community-level search as fallback channel.
 * When primary search returns weak/no results, searches community summaries
 * and injects matching community members as candidates.
 * Default: TRUE (graduated). Set SPECKIT_COMMUNITY_SEARCH_FALLBACK=false to disable.
 */
export declare function isCommunitySearchFallbackEnabled(): boolean;
/**
 * Phase B T019: Dual-level retrieval mode.
 * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
 * Default: TRUE (graduated). Set SPECKIT_DUAL_RETRIEVAL=false to disable.
 */
export declare function isDualRetrievalEnabled(): boolean;
/**
 * Phase C: Intent-to-profile auto-routing.
 * When enabled, classifyIntent() results automatically select a response profile
 * (quick, research, resume, debug) when no explicit profile is specified by the caller.
 * Default: TRUE (graduated). Set SPECKIT_INTENT_AUTO_PROFILE=false to disable.
 */
export declare function isIntentAutoProfileEnabled(): boolean;
//# sourceMappingURL=search-flags.d.ts.map
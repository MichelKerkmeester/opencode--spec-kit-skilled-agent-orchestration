// ───────────────────────────────────────────────────────────────
// MODULE: Search Flags
// ───────────────────────────────────────────────────────────────
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { isFeatureEnabled } from '../cognitive/rollout-policy.js';

// Feature catalog: Quality-aware 3-tier search fallback
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Negative feedback confidence signal

/* ───────────────────────────────────────────────────────────────
   2. BOOST FLAGS (Graduated default-ON)
──────────────────────────────────────────────────────────────── */

/**
 * Session attention boost for search result re-ranking.
 * Default: TRUE (graduated). Set SPECKIT_SESSION_BOOST=false to disable.
 */
export function isSessionBoostEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SESSION_BOOST');
}

/**
 * Causal graph traversal boost for search result amplification.
 * Default: TRUE (graduated). Set SPECKIT_CAUSAL_BOOST=false to disable.
 */
export function isCausalBoostEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CAUSAL_BOOST');
}

/* ───────────────────────────────────────────────────────────────
   3. CORE FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Dynamic startup instruction injection for the MCP server.
 * Default: TRUE (graduated). Set SPECKIT_DYNAMIC_INIT=false to disable.
 */
export function isDynamicInitEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DYNAMIC_INIT');
}

/**
 * Token-pressure policy for memory_context.
 * Default: TRUE (graduated). Set SPECKIT_PRESSURE_POLICY=false to disable.
 */
export function isPressurePolicyEnabled(identity?: string): boolean {
  return isFeatureEnabled('SPECKIT_PRESSURE_POLICY', identity);
}

/**
 * Automatic session resume context injection for memory_context.
 * Default: TRUE (graduated). Set SPECKIT_AUTO_RESUME=false to disable.
 */
export function isAutoResumeEnabled(identity?: string): boolean {
  return isFeatureEnabled('SPECKIT_AUTO_RESUME', identity);
}

/**
 * Graph-guided MMR diversity reranking.
 * Default: TRUE (enabled). Set SPECKIT_MMR=false to disable.
 */
export function isMMREnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MMR');
}

/**
 * Transparent Reasoning Module (evidence-gap detection).
 * Default: TRUE (enabled). Set SPECKIT_TRM=false to disable.
 */
export function isTRMEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_TRM');
}

/**
 * Multi-query expansion for deep-mode retrieval.
 * Default: TRUE (enabled). Set SPECKIT_MULTI_QUERY=false to disable.
 */
export function isMultiQueryEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MULTI_QUERY');
}

/**
 * Cross-encoder reranking gate.
 * Default: TRUE (enabled). Set SPECKIT_CROSS_ENCODER=false to disable.
 */
export function isCrossEncoderEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CROSS_ENCODER');
}

/**
 * PI-A2: Quality-aware 3-tier search fallback chain.
 * Default: TRUE (graduated). Set SPECKIT_SEARCH_FALLBACK=false to disable.
 */
export function isSearchFallbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SEARCH_FALLBACK');
}

/**
 * PI-B3: Automatic spec folder discovery via description cache.
 * Default: TRUE (graduated). Set SPECKIT_FOLDER_DISCOVERY=false to disable.
 */
export function isFolderDiscoveryEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_FOLDER_DISCOVERY');
}

// -- Hybrid RAG Fusion Refinement flags --

/**
 * R1 MPAB: Document-level chunk-to-memory score aggregation.
 * Default: TRUE (graduated). Set SPECKIT_DOCSCORE_AGGREGATION=false to disable.
 */
export function isDocscoreAggregationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DOCSCORE_AGGREGATION');
}

/**
 * Pre-storage quality gate for memory saves.
 * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
 */
export function isSaveQualityGateEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SAVE_QUALITY_GATE');
}

/**
 * Dynamic token budget allocation by query complexity.
 * Default: TRUE (graduated). Set SPECKIT_DYNAMIC_TOKEN_BUDGET=false to disable.
 */
export function isDynamicTokenBudgetEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DYNAMIC_TOKEN_BUDGET');
}

/**
 * Confidence-gap truncation for low-confidence tails.
 * Default: TRUE (graduated). Set SPECKIT_CONFIDENCE_TRUNCATION=false to disable.
 */
export function isConfidenceTruncationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONFIDENCE_TRUNCATION');
}

/**
 * Channel minimum-representation promotion after fusion.
 * Default: TRUE (graduated). Set SPECKIT_CHANNEL_MIN_REP=false to disable.
 */
export function isChannelMinRepEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CHANNEL_MIN_REP');
}

/**
 * TM-06: Reconsolidation-on-save for memory deduplication.
 * Default: TRUE (graduated). Set SPECKIT_RECONSOLIDATION=false to disable.
 */
export function isReconsolidationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RECONSOLIDATION');
}

/**
 * T002b/A4: Negative-feedback confidence demotion in ranking.
 * Default: TRUE (graduated). Set SPECKIT_NEGATIVE_FEEDBACK=false to disable.
 */
export function isNegativeFeedbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_NEGATIVE_FEEDBACK');
}

// -- Pipeline Refactor flags --

/**
 * R12: Query expansion for embedding-based retrieval.
 * Suppressed when R15 classification = "simple" (mutual exclusion).
 * Default: TRUE (graduated). Set SPECKIT_EMBEDDING_EXPANSION=false to disable.
 */
export function isEmbeddingExpansionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_EMBEDDING_EXPANSION');
}

// -- Indexing and Graph flags --

/**
 * N3-lite: Consolidation engine — contradiction scan, Hebbian strengthening,
 * staleness detection, edge bounds enforcement.
 * Default: TRUE (graduated). Set SPECKIT_CONSOLIDATION=false to disable.
 */
export function isConsolidationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONSOLIDATION');
}

/**
 * R16: Encoding-intent capture at index time.
 * Records intent metadata (document, code, structured_data) alongside embeddings.
 * Default: TRUE (graduated). Set SPECKIT_ENCODING_INTENT=false to disable.
 */
export function isEncodingIntentEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ENCODING_INTENT');
}

/* ───────────────────────────────────────────────────────────────
   3. GRAPH FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * N2a+N2b: Graph momentum scoring and causal depth signals.
 * Default: TRUE (enabled). Set SPECKIT_GRAPH_SIGNALS=false to disable.
 */
// Supported SPECKIT_GRAPH_WALK_ROLLOUT states: off, trace_only, bounded_runtime.
export type GraphWalkRolloutState = 'off' | 'trace_only' | 'bounded_runtime';

export function resolveGraphWalkRolloutState(): GraphWalkRolloutState {
  const rollout = process.env.SPECKIT_GRAPH_WALK_ROLLOUT?.trim().toLowerCase();
  if (rollout === 'off' || rollout === 'false' || rollout === '0') {
    return 'off';
  }
  if (rollout === 'trace_only' || rollout === 'trace-only') {
    return 'trace_only';
  }
  if (rollout === 'bounded_runtime' || rollout === 'bounded-runtime' || rollout === 'true' || rollout === '1') {
    return 'bounded_runtime';
  }

  return isFeatureEnabled('SPECKIT_GRAPH_SIGNALS') ? 'bounded_runtime' : 'off';
}

export function isGraphSignalsEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_SIGNALS');
}

/**
 * N2c: Community detection (BFS connected components + Louvain escalation).
 * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_DETECTION=false to disable.
 */
export function isCommunityDetectionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_COMMUNITY_DETECTION');
}

/**
 * Community summary generation and search channel.
 * Default: TRUE (enabled). Set SPECKIT_COMMUNITY_SUMMARIES=false to disable.
 */
export function isCommunitySummariesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_COMMUNITY_SUMMARIES');
}

/**
 * R8: Memory summary generation (TF-IDF extractive summaries as search channel).
 * Default: TRUE (enabled). Set SPECKIT_MEMORY_SUMMARIES=false to disable.
 */
export function isMemorySummariesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MEMORY_SUMMARIES');
}

/**
 * Temporal contiguity boost on raw Stage 1 vector results.
 * Default: TRUE (graduated). Set SPECKIT_TEMPORAL_CONTIGUITY=false to disable.
 */
export function isTemporalContiguityEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_TEMPORAL_CONTIGUITY');
}

/**
 * R10: Auto entity extraction (rule-based noun-phrase extraction at save time).
 * Default: TRUE (enabled). Set SPECKIT_AUTO_ENTITIES=false to disable.
 */
export function isAutoEntitiesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_AUTO_ENTITIES');
}

/**
 * S5: Cross-document entity linking (entity-based cross-doc edges).
 * Requires R10 (auto entities) to also be enabled.
 * Default: TRUE (enabled). Set SPECKIT_ENTITY_LINKING=false to disable.
 */
export function isEntityLinkingEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ENTITY_LINKING');
}

/** Whether causal-edge degree-based re-ranking is enabled (SPECKIT_DEGREE_BOOST). */
export function isDegreeBoostEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DEGREE_BOOST');
}

/* ───────────────────────────────────────────────────────────────
   4. SPRINT 9 FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * P1-4: Contextual tree headers for Stage 4 result enrichment.
 * Default: TRUE. Set SPECKIT_CONTEXT_HEADERS=false to disable.
 */
export function isContextHeadersEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CONTEXT_HEADERS');
}

/**
 * P1-7: Real-time file watcher for markdown reindexing.
 * Default: FALSE. Set SPECKIT_FILE_WATCHER=true to enable.
 * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
 */
export function isFileWatcherEnabled(): boolean {
  if (process.env.SPECKIT_FILE_WATCHER?.toLowerCase().trim() !== 'true') return false;
  return isFeatureEnabled('SPECKIT_FILE_WATCHER');
}

/**
 * P1-5: Local GGUF reranker gate.
 * Default: FALSE. Set RERANKER_LOCAL=true to enable.
 * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
 */
export function isLocalRerankerEnabled(): boolean {
  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() !== 'true') return false;
  return isFeatureEnabled('RERANKER_LOCAL');
}

/**
 * T008: Verify-fix-verify memory quality loop.
 * Default: TRUE (graduated). Set SPECKIT_QUALITY_LOOP=false to disable.
 */
export function isQualityLoopEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_QUALITY_LOOP');
}

/* ───────────────────────────────────────────────────────────────
   5. D2 QUERY INTELLIGENCE FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * D2 REQ-D2-001: Query decomposition — bounded facet detection.
 * Deep-mode only: multi-faceted queries split into up to 3 sub-queries.
 * Default: TRUE (graduated). Set SPECKIT_QUERY_DECOMPOSITION=false to disable.
 */
export function isQueryDecompositionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_QUERY_DECOMPOSITION');
}

/**
 * D2 REQ-D2-002: Graph concept routing — query-time alias matching.
 * Extracts noun phrases from the query and matches against concept alias table,
 * activating the graph channel for matched concepts.
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_CONCEPT_ROUTING=false to disable.
 */
export function isGraphConceptRoutingEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_CONCEPT_ROUTING');
}

/**
 * D2 REQ-D2-005: Index-time surrogates for recall improvement.
 * Generates surrogate metadata (aliases, headings, summary, questions)
 * at index time; matched at query time with no LLM calls.
 * Default: TRUE (graduated). Set SPECKIT_QUERY_SURROGATES=false to disable.
 */
export function isQuerySurrogatesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_QUERY_SURROGATES');
}

/* ───────────────────────────────────────────────────────────────
   6. D4 PHASE A FLAGS (Feedback & Quality Learning)
──────────────────────────────────────────────────────────────── */

/**
 * REQ-D4-001: Implicit feedback event ledger.
 * Shadow-only — no ranking side effects.
 * Default: TRUE (graduated). Set SPECKIT_IMPLICIT_FEEDBACK_LOG=false to disable.
 */
export function isImplicitFeedbackLogEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_IMPLICIT_FEEDBACK_LOG');
}

/**
 * REQ-D4-002: Hybrid decay policy — type-aware no-decay for permanent artifacts.
 * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
 * When enabled: decision/constitutional/critical context types receive Infinity
 * stability (no decay). All other types follow the standard FSRS schedule.
 */
export function isHybridDecayPolicyEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_HYBRID_DECAY_POLICY');
}

/**
 * REQ-D4-003: Short-critical quality gate exception.
 * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=false to disable.
 * When enabled: decision context_type documents with >= 2 structural signals
 * bypass the 50-character minimum content length check.
 */
export function isSaveQualityGateExceptionsEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS');
}

/* ───────────────────────────────────────────────────────────────
   7. D2 PHASE B FLAGS (LLM Query Intelligence)
──────────────────────────────────────────────────────────────── */

/**
 * D2 REQ-D2-003: Corpus-grounded LLM query reformulation.
 * Step-back abstraction + corpus seed grounding. Deep-mode only.
 * Default: TRUE (graduated). Set SPECKIT_LLM_REFORMULATION=false to disable.
 * Requires an OpenAI-compatible LLM endpoint (LLM_REFORMULATION_ENDPOINT).
 */
export function isLlmReformulationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_LLM_REFORMULATION');
}

/**
 * D2 REQ-D2-004: HyDE (Hypothetical Document Embeddings).
 * Generates a pseudo-document for low-confidence deep queries.
 * Default: TRUE (graduated). Set SPECKIT_HYDE=false to disable.
 */
export function isHyDEEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_HYDE');
}

/* ───────────────────────────────────────────────────────────────
   8. D3 PHASE B FLAGS (Graph Lifecycle)
──────────────────────────────────────────────────────────────── */

/**
 * REQ-D3-003: Graph refresh mode.
 * Controls when dirty-node recomputation runs after write operations.
 * Default: 'write_local' (graduated). Set SPECKIT_GRAPH_REFRESH_MODE=off to disable.
 * Values: off | write_local | scheduled.
 */
export function getGraphRefreshMode(): string {
  return process.env.SPECKIT_GRAPH_REFRESH_MODE?.trim().toLowerCase() ?? 'write_local';
}

export function isGraphRefreshDisabled(): boolean {
  return getGraphRefreshMode() === 'off';
}

/**
 * REQ-D3-004: Async LLM graph backfill for high-value documents.
 * Runs after deterministic extraction; adds probabilistic edges via LLM.
 * Default: TRUE (graduated). Set SPECKIT_LLM_GRAPH_BACKFILL=false to disable.
 */
export function isLlmGraphBackfillEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_LLM_GRAPH_BACKFILL');
}

/* ───────────────────────────────────────────────────────────────
   9. D3 PHASE C FLAGS (Graph Calibration & Communities)
──────────────────────────────────────────────────────────────── */

/**
 * REQ-D3-005 / REQ-D3-006: Graph calibration profiles and community thresholds.
 * Enables calibration profile enforcement, Louvain activation gates, and
 * community score capping (secondary-only).
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_CALIBRATION_PROFILE=false to disable.
 */
export function isGraphCalibrationProfileEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_CALIBRATION_PROFILE');
}

/* ───────────────────────────────────────────────────────────────
   10. D1 PHASE D FLAGS (Learned Ranking)
──────────────────────────────────────────────────────────────── */

/**
 * REQ-D1-006: Learned Stage 2 weight combiner (shadow mode).
 * Runs the learned linear ranker in parallel with manual weights.
 * Scores are computed but NOT used for ranking (shadow-only).
 * Default: TRUE (graduated). Set SPECKIT_LEARNED_STAGE2_COMBINER=false to disable.
 */
export function isLearnedStage2CombinerEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_LEARNED_STAGE2_COMBINER');
}

/* ───────────────────────────────────────────────────────────────
   11. D4 PHASE C FLAGS (Shadow Evaluation)
──────────────────────────────────────────────────────────────── */

/**
 * REQ-D4-006: Shadow scoring with holdout evaluation.
 * Compares would-have-changed rankings vs live rankings on a holdout
 * slice of queries. Shadow-only — no ranking side effects.
 * Default: TRUE (graduated). Set SPECKIT_SHADOW_FEEDBACK=false to disable.
 */
export function isShadowFeedbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SHADOW_FEEDBACK');
}

/* ───────────────────────────────────────────────────────────────
   12. D5 PHASE C FLAGS (Progressive Disclosure & Session State)
──────────────────────────────────────────────────────────────── */

/**
 * REQ-D5-005: Progressive disclosure for search results.
 * Replaces hard tail-truncation with summary layer + snippet + cursor pagination.
 * Default: TRUE (graduated). Set SPECKIT_PROGRESSIVE_DISCLOSURE_V1=false to disable.
 */
export function isProgressiveDisclosureEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_PROGRESSIVE_DISCLOSURE_V1');
}

/**
 * REQ-D5-006: Retrieval session state for cross-turn context.
 * Enables cross-turn dedup and goal-aware refinement of search results.
 * Default: TRUE (graduated). Set SPECKIT_SESSION_RETRIEVAL_STATE_V1=false to disable.
 */
export function isSessionRetrievalStateEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SESSION_RETRIEVAL_STATE_V1');
}

/* ───────────────────────────────────────────────────────────────
   13. SPEC 011 GRADUATED FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * REQ-D1-001: Calibrated overlap bonus for multi-channel convergence.
 * Default: TRUE (graduated). Set SPECKIT_CALIBRATED_OVERLAP_BONUS=false to disable.
 */
export function isCalibratedOverlapBonusEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_CALIBRATED_OVERLAP_BONUS');
}

/**
 * REQ-D1-003: Experimental per-intent RRF K selection.
 * Default: TRUE (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
 */
export function isRrfKExperimentalEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RRF_K_EXPERIMENTAL');
}

/**
 * D3 Phase A: Sparse-first + intent-aware typed traversal.
 * Default: TRUE (graduated). Set SPECKIT_TYPED_TRAVERSAL=false to disable.
 */
export function isTypedTraversalEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_TYPED_TRAVERSAL');
}

/**
 * REQ-D5-001: Empty/weak result recovery UX.
 * Default: TRUE (graduated). Set SPECKIT_EMPTY_RESULT_RECOVERY_V1=false to disable.
 */
export function isEmptyResultRecoveryEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_EMPTY_RESULT_RECOVERY_V1');
}

/**
 * REQ-D5-004: Per-result calibrated confidence scoring.
 * Default: TRUE (graduated). Set SPECKIT_RESULT_CONFIDENCE_V1=false to disable.
 */
export function isResultConfidenceEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RESULT_CONFIDENCE_V1');
}

/**
 * REQ-D4-004: Weekly batch feedback learning pipeline.
 * Default: TRUE (graduated). Set SPECKIT_BATCH_LEARNED_FEEDBACK=false to disable.
 */
export function isBatchLearnedFeedbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_BATCH_LEARNED_FEEDBACK');
}

/**
 * REQ-D4-005: Assistive reconsolidation for near-duplicate detection.
 * Default: TRUE (graduated). Set SPECKIT_ASSISTIVE_RECONSOLIDATION=false to disable.
 */
export function isAssistiveReconsolidationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ASSISTIVE_RECONSOLIDATION');
}

/**
 * REQ-D5-002: Two-tier result explainability.
 * Default: TRUE (graduated). Set SPECKIT_RESULT_EXPLAIN_V1=false to disable.
 */
export function isResultExplainEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RESULT_EXPLAIN_V1');
}

/**
 * REQ-D5-003: Mode-aware response profile formatting.
 * Default: TRUE (graduated). Set SPECKIT_RESPONSE_PROFILE_V1=false to disable.
 */
export function isResponseProfileEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RESPONSE_PROFILE_V1');
}

/* ───────────────────────────────────────────────────────────────
   14. PHASE B GRAPH RETRIEVAL FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * Phase B T016: Query concept expansion for hybrid search.
 * When concept routing matches aliases, expands query with related terms.
 * Default: TRUE (graduated). Set SPECKIT_QUERY_CONCEPT_EXPANSION=false to disable.
 */
export function isQueryConceptExpansionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_QUERY_CONCEPT_EXPANSION');
}

/**
 * Phase B T017: Graph-expanded fallback on zero/weak results.
 * Queries causal_edges for neighbor titles when recovery triggers.
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_FALLBACK=false to disable.
 */
export function isGraphFallbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_FALLBACK');
}

/**
 * Phase B T020: Always-on graph context injection.
 * Runs concept routing + graph neighbor lookup even without seed results.
 * Default: TRUE (graduated). Set SPECKIT_GRAPH_CONTEXT_INJECTION=false to disable.
 */
export function isGraphContextInjectionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_CONTEXT_INJECTION');
}

/**
 * Phase C T027: Result provenance — include graph evidence metadata in search results.
 * When enabled, search results include graphEvidence with contributing edges,
 * communities, and boost factors for transparency and debuggability.
 * Default: TRUE (enabled). Set SPECKIT_RESULT_PROVENANCE=false to disable.
 */
export function isResultProvenanceEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_RESULT_PROVENANCE');
}

/**
 * Phase D T036: Temporal validity tracking for causal edges.
 * Default: TRUE (graduated). Set SPECKIT_TEMPORAL_EDGES=false to disable.
 */
export function isTemporalEdgesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_TEMPORAL_EDGES');
}

/**
 * Phase D T036: Usage-weighted ranking signal.
 * Default: TRUE (graduated). Set SPECKIT_USAGE_RANKING=false to disable.
 */
export function isUsageRankingEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_USAGE_RANKING');
}

/**
 * Phase D T036: Ontology-guided extraction validation hooks.
 * Default: TRUE (graduated). Set SPECKIT_ONTOLOGY_HOOKS=false to disable.
 */
export function isOntologyHooksEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_ONTOLOGY_HOOKS');
}

/**
 * Phase B T018: Community-level search as fallback channel.
 * When primary search returns weak/no results, searches community summaries
 * and injects matching community members as candidates.
 * Default: TRUE (graduated). Set SPECKIT_COMMUNITY_SEARCH_FALLBACK=false to disable.
 */
export function isCommunitySearchFallbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_COMMUNITY_SEARCH_FALLBACK');
}

/**
 * Phase B T019: Dual-level retrieval mode.
 * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
 * Default: TRUE (graduated). Set SPECKIT_DUAL_RETRIEVAL=false to disable.
 */
export function isDualRetrievalEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DUAL_RETRIEVAL');
}

/**
 * Phase C: Intent-to-profile auto-routing.
 * When enabled, classifyIntent() results automatically select a response profile
 * (quick, research, resume, debug) when no explicit profile is specified by the caller.
 * Default: TRUE (graduated). Set SPECKIT_INTENT_AUTO_PROFILE=false to disable.
 */
export function isIntentAutoProfileEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_INTENT_AUTO_PROFILE');
}

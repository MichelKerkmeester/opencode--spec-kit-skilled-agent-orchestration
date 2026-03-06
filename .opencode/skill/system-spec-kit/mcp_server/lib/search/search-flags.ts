// ---------------------------------------------------------------
// MODULE: Search Feature Flags
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.
// ---------------------------------------------------------------

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

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

// ── Hybrid RAG Fusion Refinement flags ──

/**
 * R1 MPAB: Document-level chunk-to-memory score aggregation.
 * Default: TRUE (graduated). Set SPECKIT_DOCSCORE_AGGREGATION=false to disable.
 */
export function isDocscoreAggregationEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_DOCSCORE_AGGREGATION');
}

/**
 * TM-04: Pre-storage quality gate for memory saves.
 * Default: TRUE (graduated). Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
 */
export function isSaveQualityGateEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_SAVE_QUALITY_GATE');
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

// ── Pipeline Refactor flags ──

/**
 * R6: 4-stage pipeline architecture (Stage 1-4 with Stage 4 invariant).
 * @deprecated Always returns true. Legacy V1 pipeline was removed in
 * 017-refinement-phase-6 Sprint 1. The SPECKIT_PIPELINE_V2 env var is
 * still accepted but ignored — V2 is the only code path.
 */
export function isPipelineV2Enabled(): boolean {
  return true;
}

/**
 * R12: Query expansion for embedding-based retrieval.
 * Suppressed when R15 classification = "simple" (mutual exclusion).
 * Default: TRUE (graduated). Set SPECKIT_EMBEDDING_EXPANSION=false to disable.
 */
export function isEmbeddingExpansionEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_EMBEDDING_EXPANSION');
}

// ── Indexing and Graph flags ──

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

// ── Deferred Features (graduated to default-ON) ──

/**
 * N2a+N2b: Graph momentum scoring and causal depth signals.
 * Default: TRUE (enabled). Set SPECKIT_GRAPH_SIGNALS=false to disable.
 */
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
 * R8: Memory summary generation (TF-IDF extractive summaries as search channel).
 * Default: TRUE (enabled). Set SPECKIT_MEMORY_SUMMARIES=false to disable.
 */
export function isMemorySummariesEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_MEMORY_SUMMARIES');
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
  if (process.env.SPECKIT_FILE_WATCHER !== 'true') return false;
  return isFeatureEnabled('SPECKIT_FILE_WATCHER');
}

/**
 * P1-5: Local GGUF reranker gate.
 * Default: FALSE. Set RERANKER_LOCAL=true to enable.
 * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
 */
export function isLocalRerankerEnabled(): boolean {
  if (process.env.RERANKER_LOCAL !== 'true') return false;
  return isFeatureEnabled('RERANKER_LOCAL');
}

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

import { isFeatureEnabled } from '../cognitive/rollout-policy';

// Feature catalog: Quality-aware 3-tier search fallback
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Negative feedback confidence signal

/* ───────────────────────────────────────────────────────────────
   2. CORE FLAGS
──────────────────────────────────────────────────────────────── */

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
 * TM-06: Reconsolidation-on-save for memory deduplication.
 * Default: FALSE (opt-in). Set SPECKIT_RECONSOLIDATION=true to enable.
 */
export function isReconsolidationEnabled(): boolean {
  return process.env.SPECKIT_RECONSOLIDATION?.toLowerCase().trim() === 'true';
}

/**
 * T002b/A4: Negative-feedback confidence demotion in ranking.
 * Default: TRUE (graduated). Set SPECKIT_NEGATIVE_FEEDBACK=false to disable.
 */
export function isNegativeFeedbackEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_NEGATIVE_FEEDBACK');
}

// -- Pipeline Refactor flags --

// C8 CLEANUP: isPipelineV2Enabled() removed — always returned true.
// The V1 pipeline was removed and V2 is the only code path.
// SPECKIT_PIPELINE_V2 env var is no longer consumed.

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
 * Default: FALSE (opt-in). Set SPECKIT_QUALITY_LOOP=true to enable.
 */
export function isQualityLoopEnabled(): boolean {
  return process.env.SPECKIT_QUALITY_LOOP?.toLowerCase().trim() === 'true';
}

/* ───────────────────────────────────────────────────────────────
   5. D2 QUERY INTELLIGENCE FLAGS
──────────────────────────────────────────────────────────────── */

/**
 * D2 REQ-D2-001: Query decomposition — bounded facet detection.
 * Deep-mode only: multi-faceted queries split into up to 3 sub-queries.
 * Default: FALSE (opt-in). Set SPECKIT_QUERY_DECOMPOSITION=true to enable.
 */
export function isQueryDecompositionEnabled(): boolean {
  return process.env.SPECKIT_QUERY_DECOMPOSITION?.toLowerCase().trim() === 'true';
}

/**
 * D2 REQ-D2-002: Graph concept routing — query-time alias matching.
 * Extracts noun phrases from the query and matches against concept alias table,
 * activating the graph channel for matched concepts.
 * Default: FALSE (opt-in). Set SPECKIT_GRAPH_CONCEPT_ROUTING=true to enable.
 */
export function isGraphConceptRoutingEnabled(): boolean {
  return process.env.SPECKIT_GRAPH_CONCEPT_ROUTING?.toLowerCase().trim() === 'true';
}

/* ───────────────────────────────────────────────────────────────
   6. D4 PHASE A FLAGS (Feedback & Quality Learning)
──────────────────────────────────────────────────────────────── */

/**
 * REQ-D4-001: Implicit feedback event ledger.
 * Shadow-only — no ranking side effects. Default: FALSE (opt-in).
 * Set SPECKIT_IMPLICIT_FEEDBACK_LOG=true to enable.
 */
export function isImplicitFeedbackLogEnabled(): boolean {
  const val = process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG?.toLowerCase().trim();
  return val === 'true' || val === '1';
}

/**
 * REQ-D4-002: Hybrid decay policy — type-aware no-decay for permanent artifacts.
 * Default: FALSE (opt-in). Set SPECKIT_HYBRID_DECAY_POLICY=true to enable.
 * When enabled: decision/constitutional/critical context types receive Infinity
 * stability (no decay). All other types follow the standard FSRS schedule.
 */
export function isHybridDecayPolicyEnabled(): boolean {
  const val = process.env.SPECKIT_HYBRID_DECAY_POLICY?.toLowerCase().trim();
  return val === 'true' || val === '1';
}

/**
 * REQ-D4-003: Short-critical quality gate exception.
 * Warn-only initially. Default: FALSE (opt-in).
 * Set SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=true to enable.
 * When enabled: decision context_type documents with >= 2 structural signals
 * bypass the 50-character minimum content length check.
 */
export function isSaveQualityGateExceptionsEnabled(): boolean {
  const val = process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS?.toLowerCase().trim();
  return val === 'true' || val === '1';
}

/* ───────────────────────────────────────────────────────────────
   7. D2 PHASE B FLAGS (LLM Query Intelligence)
──────────────────────────────────────────────────────────────── */

/**
 * D2 REQ-D2-003: Corpus-grounded LLM query reformulation.
 * Step-back abstraction + corpus seed grounding. Deep-mode only.
 * Default: FALSE (opt-in). Set SPECKIT_LLM_REFORMULATION=true to enable.
 * Requires an OpenAI-compatible LLM endpoint (LLM_REFORMULATION_ENDPOINT).
 */
export function isLlmReformulationEnabled(): boolean {
  const val = process.env.SPECKIT_LLM_REFORMULATION?.toLowerCase().trim();
  return val === 'true' || val === '1';
}

/**
 * D2 REQ-D2-004: HyDE (Hypothetical Document Embeddings) shadow mode.
 * Generates a pseudo-document for low-confidence deep queries.
 * Default: FALSE (opt-in). Set SPECKIT_HYDE=true to enable.
 * Shadow-only until SPECKIT_HYDE_ACTIVE=true graduates it to full merge.
 */
export function isHyDEEnabled(): boolean {
  const val = process.env.SPECKIT_HYDE?.toLowerCase().trim();
  return val === 'true' || val === '1';
}

/* ───────────────────────────────────────────────────────────────
   8. D3 PHASE B FLAGS (Graph Lifecycle)
──────────────────────────────────────────────────────────────── */

/**
 * REQ-D3-003: Graph refresh mode.
 * Controls when dirty-node recomputation runs after write operations.
 * Default: 'off'. Values: off | write_local | scheduled.
 * Delegated to graph-lifecycle.ts — imported here for unified flag discovery.
 */
export function getGraphRefreshMode(): string {
  return process.env.SPECKIT_GRAPH_REFRESH_MODE?.trim().toLowerCase() ?? 'off';
}

/**
 * REQ-D3-004: Async LLM graph backfill for high-value documents.
 * Runs after deterministic extraction; adds probabilistic edges via LLM.
 * Default: FALSE (opt-in). Set SPECKIT_LLM_GRAPH_BACKFILL=true to enable.
 */
export function isLlmGraphBackfillEnabled(): boolean {
  const val = process.env.SPECKIT_LLM_GRAPH_BACKFILL?.toLowerCase().trim();
  return val === 'true' || val === '1';
}

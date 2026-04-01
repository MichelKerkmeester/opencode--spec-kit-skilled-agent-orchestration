// ───────────────────────────────────────────────────────────────
// MODULE: Embeddings
// ───────────────────────────────────────────────────────────────
// Feature catalog: Hybrid search pipeline
// PROVIDERS: EMBEDDINGS
// Re-export from shared/ (canonical source)
// Includes multi-provider support, task-specific functions, dynamic dimensions
// MAINTENANCE: Keep exports in sync with @spec-kit/shared/embeddings.
// Explicit named exports required for auditability (see T-06).
export {
  generateEmbedding,
  generateEmbeddingWithTimeout,
  generateBatchEmbeddings,
  generateDocumentEmbedding,
  generateQueryEmbedding,
  generateClusteringEmbedding,
  buildWeightedDocumentText,
  semanticChunk,
  getEmbeddingDimension,
  getModelName,
  isModelLoaded,
  getModelLoadTime,
  getCurrentDevice,
  getOptimalDevice,
  getTaskPrefix,
  preWarmModel,
  getEmbeddingProfile,
  getEmbeddingProfileAsync,
  getProviderMetadata,
  clearEmbeddingCache,
  getEmbeddingCacheStats,
  isProviderInitialized,
  shouldEagerWarmup,
  getLazyLoadingStats,
  validateApiKey,
  VALIDATION_TIMEOUT_MS,
  EMBEDDING_DIM,
  EMBEDDING_TIMEOUT,
  MAX_TEXT_LENGTH,
  MODEL_NAME,
  DEFAULT_MODEL_NAME,
  TASK_PREFIX,
  BATCH_DELAY_MS,
  BATCH_RATE_LIMIT_DELAY,
  RESERVED_OVERVIEW,
  RESERVED_OUTCOME,
  MIN_SECTION_LENGTH,
  __embeddingCircuitTestables,
} from '@spec-kit/shared/embeddings';

// ---------------------------------------------------------------
// MODULE: Shared Barrel Export
// ---------------------------------------------------------------
// Central export surface for all shared modules.
// Re-exports types, utilities, embeddings, scoring, and chunking.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. TYPE DEFINITIONS
// ---------------------------------------------------------------
export type {
  // DB normalization types (Phase 6A)
  MemoryDbRow,
  Memory,
  // Database interface types (canonical)
  PreparedStatement,
  Database,
  DatabaseExtended,
  // Embedding types
  EmbeddingProfileData,
  EmbeddingProfile,
  EmbeddingProfileExtended,
  IEmbeddingProvider,
  ProviderMetadata,
  UsageStats,
  ProviderInfo,
  ProviderResolution,
  CreateProviderOptions,
  ApiKeyValidationResult,
  EmbeddingCacheStats,
  LazyLoadingStats,
  BatchEmbeddingOptions,
  ModelDimensions,
  // Vector store types
  SearchOptions,
  SearchResult,
  StoreStats,
  IVectorStore,
  // Retry / Error classification types
  RetryConfig,
  ErrorClassification,
  RetryOptions,
  RetryAttemptLogEntry,
  // Folder scoring types
  ArchivePattern,
  FolderScore,
  FolderScoreOptions,
  ScoreWeights,
  TierWeights,
  RankingMode,
  // Chunking types
  PriorityPatterns,
  PriorityBuckets,
  // Trigger extractor types
  TriggerConfig,
  TriggerPhrase,
  NgramCount,
  ScoredNgram,
  ExtractionStats,
  ExtractionBreakdown,
  ExtractionResult,
  // Profile slug types
  ParsedProfileSlug,
  ProfileJson,
  // Task prefix types
  TaskPrefixMap,
  TaskType,
} from './types';

// DB normalization functions (Phase 6A)
export {
  dbRowToMemory,
  memoryToDbRow,
  partialDbRowToMemory,
} from './types';

// ---------------------------------------------------------------
// 2. EMBEDDINGS MODULE
// ---------------------------------------------------------------
export {
  // Core embedding generation
  generateEmbedding,
  generateEmbeddingWithTimeout,
  generateBatchEmbeddings,
  generateDocumentEmbedding,
  generateQueryEmbedding,
  generateClusteringEmbedding,
  // Utility functions
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
  // Lazy loading exports
  isProviderInitialized,
  shouldEagerWarmup,
  getLazyLoadingStats,
  // Pre-flight API key validation
  validateApiKey,
  VALIDATION_TIMEOUT_MS,
  // Constants
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
} from './embeddings';

// ---------------------------------------------------------------
// 3. EMBEDDINGS FACTORY
// ---------------------------------------------------------------
export {
  resolveProvider,
  createEmbeddingsProvider,
  getProviderInfo,
} from './embeddings/factory';

// ---------------------------------------------------------------
// 4. EMBEDDINGS PROFILE
// ---------------------------------------------------------------
export {
  parseProfileSlug,
  createProfileSlug,
} from './embeddings/profile';

// ---------------------------------------------------------------
// 5. CHUNKING MODULE
// ---------------------------------------------------------------
export {
  semanticChunk,
} from './chunking';

// ---------------------------------------------------------------
// 6. TRIGGER EXTRACTOR MODULE
// ---------------------------------------------------------------
export {
  extractTriggerPhrases,
  STOP_WORDS_ENGLISH,
  STOP_WORDS_TECH,
} from './trigger-extractor';

// ---------------------------------------------------------------
// 7. DATABASE CONFIG
// ---------------------------------------------------------------
export { DB_PATH } from './paths';
export { getDbDir } from './config';

// ---------------------------------------------------------------
// 8. SHARED ALGORITHMS / CONTRACTS
// ---------------------------------------------------------------
export * from './algorithms';
export {
  createTrace,
  addTraceEntry,
  createEnvelope,
  createDegradedContract,
  ENVELOPE_VERSION,
  type RetrievalStage,
  type TraceEntry,
  type RetrievalTrace,
  type EnvelopeMetadata,
  type ContextEnvelope,
  // DegradedModeContract intentionally omitted — already exported by ./algorithms/adaptive-fusion
  // The retrieval-trace variant adds degradedStages; import directly from contracts/retrieval-trace if needed
} from './contracts/retrieval-trace';

// ---------------------------------------------------------------
// 9. UTILITIES
// ---------------------------------------------------------------

// Path security utilities
export {
  validateFilePath,
  escapeRegex,
} from './utils/path-security';

// JSONC utilities
export {
  stripJsoncComments,
} from './utils/jsonc-strip';

// Retry utilities
export {
  retryWithBackoff,
  classifyError,
  extractStatusCode,
  DEFAULT_CONFIG,
  TRANSIENT_HTTP_STATUS_CODES,
  PERMANENT_HTTP_STATUS_CODES,
  TRANSIENT_NETWORK_ERRORS,
  TRANSIENT_ERROR_PATTERNS,
  PERMANENT_ERROR_PATTERNS,
} from './utils/retry';

// ---------------------------------------------------------------
// 10. SCORING MODULE
// ---------------------------------------------------------------
export {
  computeFolderScores,
  ARCHIVE_PATTERNS,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
} from './scoring/folder-scoring';

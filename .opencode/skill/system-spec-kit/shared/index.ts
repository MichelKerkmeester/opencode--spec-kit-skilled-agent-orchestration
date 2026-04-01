// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
// Central export surface for all shared modules.
// Re-exports types, utilities, embeddings, scoring, and chunking.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. TYPE DEFINITIONS
// ---------------------------------------------------------------
export type {
  // DB normalization types
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
} from './types.js';

export type { WeightedDocumentSections } from './embeddings.js';

// DB normalization functions
export {
  dbRowToMemory,
  memoryToDbRow,
  partialDbRowToMemory,
} from './types.js';

// Context type definitions (single source of truth)
export type { CanonicalContextType, ContextType } from './context-types.js';
export {
  CANONICAL_CONTEXT_TYPES,
  LEGACY_CONTEXT_TYPE_ALIASES,
  resolveCanonicalContextType,
  isLegacyContextType,
} from './context-types.js';

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
  buildWeightedDocumentText,
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
} from './embeddings.js';

// ---------------------------------------------------------------
// 3. EMBEDDINGS FACTORY
// ---------------------------------------------------------------
export {
  resolveProvider,
  createEmbeddingsProvider,
  getProviderInfo,
} from './embeddings/factory.js';

// ---------------------------------------------------------------
// 4. EMBEDDINGS PROFILE
// ---------------------------------------------------------------
export {
  parseProfileSlug,
  createProfileSlug,
} from './embeddings/profile.js';

// ---------------------------------------------------------------
// 5. CHUNKING MODULE
// ---------------------------------------------------------------
export {
  semanticChunk,
} from './chunking.js';

// ---------------------------------------------------------------
// 6. TRIGGER EXTRACTOR MODULE
// ---------------------------------------------------------------
export {
  extractTriggerPhrases,
  STOP_WORDS_ENGLISH,
  STOP_WORDS_TECH,
} from './trigger-extractor.js';

// ---------------------------------------------------------------
// 7. DATABASE CONFIG
// ---------------------------------------------------------------
export { DB_PATH } from './paths.js';
export { getDbDir, DB_UPDATED_FILE } from './config.js';

// ---------------------------------------------------------------
// 8. SHARED ALGORITHMS / CONTRACTS
// ---------------------------------------------------------------
export * from './algorithms/index.js';
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
} from './contracts/retrieval-trace.js';

// ---------------------------------------------------------------
// 9. UTILITIES
// ---------------------------------------------------------------

// Path security utilities
export {
  validateFilePath,
  escapeRegex,
} from './utils/path-security.js';

// JSONC utilities
export {
  stripJsoncComments,
} from './utils/jsonc-strip.js';

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
} from './utils/retry.js';

// ---------------------------------------------------------------
// 10. SCORING MODULE
// ---------------------------------------------------------------
export {
  computeFolderScores,
  ARCHIVE_PATTERNS,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
} from './scoring/folder-scoring.js';

// ---------------------------------------------------------------
// 11. LEARNED RANKING MODULE
// ---------------------------------------------------------------
export {
  shadowScore,
  trainRegularizedLinearRanker,
  predict,
  extractFeatureVector,
} from './ranking/learned-combiner.js';

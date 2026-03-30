// ────────────────────────────────────────────────────────────────
// MODULE: Index
// ────────────────────────────────────────────────────────────────

export {
  // Types
  type InputLimitsConfig,

  // Path constants
  SERVER_DIR,
  NODE_MODULES,
  LIB_DIR,
  SHARED_DIR,
  DATABASE_DIR,
  DATABASE_PATH,
  DB_UPDATED_FILE,

  // Batch processing
  BATCH_SIZE,
  BATCH_DELAY_MS,

  // Rate limiting
  INDEX_SCAN_COOLDOWN,

  // Query validation
  MAX_QUERY_LENGTH,
  INPUT_LIMITS,

  // Path validation
  DEFAULT_BASE_PATH,
  ALLOWED_BASE_PATHS,

  // Cache
  CONSTITUTIONAL_CACHE_TTL,
} from './config.js';

export {
  // Types
  type VectorIndexLike,
  type DatabaseLike,
  type CheckpointsLike,
  type AccessTrackerLike,
  type HybridSearchLike,
  type DbStateDeps,

  // Initialization
  init,

  // External update detection
  checkDatabaseUpdated,
  reinitializeDatabase,

  // Persistent rate limiting
  getLastScanTime,
  setLastScanTime,

  // Embedding model readiness
  isEmbeddingModelReady,
  setEmbeddingModelReady,
  waitForEmbeddingModel,

  // Constitutional cache
  getConstitutionalCache,
  setConstitutionalCache,
  getConstitutionalCacheTime,
  clearConstitutionalCache,
} from './db-state.js';

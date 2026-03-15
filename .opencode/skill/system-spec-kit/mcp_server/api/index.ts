// ────────────────────────────────────────────────────────────────
// MODULE: Index
// ────────────────────────────────────────────────────────────────
// @public — single entry point for all public API surfaces.
// ARCH-1 consumer scripts import from '../../mcp_server/api'
// Instead of reaching into lib/ internals.

export {
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  isAblationEnabled,
  ALL_CHANNELS,
  type AblationChannel,
  type AblationSearchFn,
  type AblationReport,
  runBM25Baseline,
  recordBaselineMetrics,
  type BM25SearchFn,
  type BM25SearchResult,
  type BM25BaselineResult,
  loadGroundTruth,
  initEvalDb,
} from './eval';

export {
  initializeIndexingRuntime,
  warmEmbeddingModel,
  runMemoryIndexScan,
  closeIndexingRuntime,
  type MemoryIndexScanArgs,
} from './indexing';

export {
  initHybridSearch,
  hybridSearchEnhanced,
  type HybridSearchOptions,
  type HybridSearchResult,
  fts5Bm25Search,
  isFts5Available,
  vectorIndex,
} from './search';

export {
  generateEmbedding,
  generateQueryEmbedding,
  getEmbeddingProfile,
  retryManager,
} from './providers';

export {
  initCheckpoints,
  initAccessTracker,
} from './storage';

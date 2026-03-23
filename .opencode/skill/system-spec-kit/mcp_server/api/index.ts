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

// --- Folder discovery (used by scripts/spec-folder, scripts/core) ---
export {
  generatePerFolderDescription,
  savePerFolderDescription,
  loadPerFolderDescription,
  extractKeywords,
  slugifyFolderName,
} from '../lib/search/folder-discovery';
export type { PerFolderDescription } from '../lib/search/folder-discovery';

// --- Entity extraction (used by scripts/memory) ---
export {
  extractEntities,
  rebuildAutoEntities,
} from '../lib/extraction/entity-extractor';

// --- Performance benchmarking support (used by scripts/evals) ---
export * as sessionBoost from '../lib/search/session-boost';
export * as causalBoost from '../lib/search/causal-boost';
export * as workingMemory from '../lib/cognitive/working-memory';
export {
  initExtractionAdapter,
  getExtractionMetrics,
  resetExtractionMetrics,
} from '../lib/extraction/extraction-adapter';
export type { ExtractionMetrics } from '../lib/extraction/extraction-adapter';

// --- Hybrid RAG Fusion rollout metadata and architecture surfaces ---
export {
  LAYER_DEFINITIONS,
  TOOL_LAYER_MAP,
  getLayerForTool,
  getLayerTokenBudget,
} from '../lib/architecture/layer-definitions';
export type { LayerDefinition, LayerId } from '../lib/architecture/layer-definitions';

export {
  getSharedRolloutMetrics,
  getSharedRolloutCohortSummary,
} from '../lib/collab/shared-spaces';
export type {
  SharedMembership,
  SharedRole,
  SharedRolloutCohortSummary,
  SharedRolloutMetrics,
  SharedSpaceDefinition,
  SharedSubjectType,
} from '../lib/collab/shared-spaces';

export {
  getMemoryRoadmapCapabilityFlags,
  getMemoryRoadmapDefaults,
  getMemoryRoadmapPhase,
} from '../lib/config/capability-flags';
export type { MemoryRoadmapCapabilityFlags } from '../lib/config/capability-flags';
